#!/usr/bin/env bash
# Met une version à l'essai sur dev.terra-umbra.fr.
# Lancé par .github/workflows/deploy-recette.yml (n'importe quelle branche).
#
#   deploy-recette.sh <sha> <archive.tar.gz>
#
# Construit api et web depuis l'archive du commit, applique les migrations
# nouvelles et le contenu (infrastructure/content/*.sql) à la base d'essai, et
# redémarre la pile tuc-recette. Au premier
# lancement, ou avec REFRESH_DATA=1, la base et les médias d'essai sont
# remplacés par la dernière sauvegarde vérifiée de la production.
# Ne touche jamais à la pile de production (tuc-v2).
set -euo pipefail
umask 022

sha=${1:?SHA du commit requis}
archive=${2:?archive requise}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]]
short=${sha:0:12}
root=/opt/terra-umbra
dir=$root/recette
refresh=${REFRESH_DATA:-0}

exec 9>"$root/.recette.lock"
flock -w 60 9 || { echo "Une mise à l'essai est déjà en cours" >&2; exit 1; }

# Le cache de construction (commun aux deux sites) peut dépasser 15 Go après
# un essai interrompu : on le vide d'abord si la place manque.
free_gb=$(df --output=avail -BG / | tail -1 | tr -dc 0-9)
if (( free_gb < 8 + 4 )); then docker builder prune -af >/dev/null; free_gb=$(df --output=avail -BG / | tail -1 | tr -dc 0-9); fi
if (( free_gb < 8 )); then
  echo "Moins de 8 Go libres sur le serveur ($free_gb Go) : arrêt." >&2
  exit 1
fi

echo "== Sources $short"
stage="$dir/src"
rm -rf "$stage"
mkdir -p "$stage"
tar -xzf "$archive" -C "$stage"
rm -f "$archive"
test "$(cat "$stage/.release-sha")" = "$sha"
cp "$stage/infrastructure/recette/docker-compose.yml" "$dir/docker-compose.yml"

# Mot de passe de la base d'essai, créé une fois, hors de Git.
if [ ! -f "$dir/.env" ]; then
  printf 'POSTGRES_DB=terra_umbra_recette\nPOSTGRES_USER=recette\nPOSTGRES_PASSWORD=%s\n' \
    "$(head -c 32 /dev/urandom | base64 | tr -dc A-Za-z0-9)" > "$dir/.env"
  chmod 600 "$dir/.env"
fi
# Clés et compte administrateur de Directus, créés une fois, hors de Git.
# L'accès est recopié dans les secrets du serveur pour l'auteur.
if ! grep -q '^DIRECTUS_KEY=' "$dir/.env"; then
  rand() { head -c 48 /dev/urandom | base64 | tr -dc A-Za-z0-9 | head -c "$1"; }
  password=$(rand 24)
  printf 'DIRECTUS_KEY=%s\nDIRECTUS_SECRET=%s\nDIRECTUS_ADMIN_EMAIL=auteur@terra-umbra.fr\nDIRECTUS_ADMIN_PASSWORD=%s\n' \
    "$(rand 32)" "$(rand 48)" "$password" >> "$dir/.env"
  umask 077
  printf 'Directus (site d essai) : https://dev.terra-umbra.fr/cms\nIdentifiant : auteur@terra-umbra.fr\nMot de passe : %s\n' "$password" \
    > "$root/secrets/directus-acces.txt"
  umask 022
fi

echo "== Construction des images"
docker build --pull=false -f "$stage/apps/api/Dockerfile" \
  --label "org.opencontainers.image.revision=$sha" -t tuc-recette-api:latest "$stage" </dev/null
docker build --pull=false -f "$stage/apps/web/Dockerfile" \
  --label "org.opencontainers.image.revision=$sha" -t tuc-recette-web:latest "$stage" </dev/null

cd "$dir"
set -a
. ./.env
set +a
compose() { docker compose --env-file .env "$@"; }
psql() {
  compose exec -T recette-db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 "$@"
}

compose up -d --wait recette-db </dev/null
if [ "$refresh" = 1 ] || [ "$(psql -Atc "SELECT to_regclass('public.users') IS NULL" </dev/null)" = t ]; then
  latest=$(cat "$root/private-backups/latest-verified")
  echo "== Données : copie de $(basename "$latest")"
  compose stop recette-api </dev/null || true
  psql -qc "DROP SCHEMA public CASCADE; CREATE SCHEMA public" </dev/null
  compose exec -T recette-db pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
    --no-owner --no-privileges --exit-on-error < "$latest/database.dump"
  # Les sessions de production ne doivent pas ouvrir le site d'essai.
  psql -qc "DELETE FROM sessions" </dev/null
  compose run --rm --no-deps -T --entrypoint sh recette-api \
    -c 'rm -rf /app/editor-media/* && tar -xzf - -C /app/editor-media' < "$latest/editor-media.tar.gz"
fi

echo "== Migrations"
psql -qc "CREATE TABLE IF NOT EXISTS deploy_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
)" </dev/null
for file in "$stage"/infrastructure/migrations/*.sql; do
  name=$(basename "$file")
  [[ "$name" =~ ^[A-Za-z0-9_.-]+$ ]]
  if [ "$(psql -Atc "SELECT count(*) FROM deploy_migrations WHERE name = '$name'" </dev/null)" = 0 ]; then
    echo "Migration : $name"
    { cat "$file"; echo; echo "INSERT INTO deploy_migrations (name) VALUES ('$name');"; } | psql -q -1
  fi
done

# Contenu en base : chaque fichier infrastructure/content/*.sql couvre une
# portée (vampire, objets, equipement…). Il n'est importé que si sa portée est
# vide dans la base d'essai, ou quand on recopie les données. Jamais
# par-dessus : le contenu se modifie sur le site (passe éditoriale), et un
# import écraserait ces modifications.
for file in "$stage"/infrastructure/content/*.sql; do
  [ -e "$file" ] || continue
  scope=$(grep -om1 "WHERE scope = '[a-z_]*'" "$file" | cut -d"'" -f2)
  if [ "$refresh" = 1 ] || [ "$(psql -Atc "SELECT count(*) FROM content_entry WHERE scope = '$scope'" </dev/null)" = 0 ]; then
    echo "Contenu : $(basename "$file") (portée $scope)"
    psql -q < "$file"
  fi
done

# Extensions de Directus (éditeur du corps des articles) : Directus ne les lit
# qu'au démarrage, on le redémarre seulement si elles ont changé.
extensions_before=$(cd "$dir" && find directus-extensions -type f -exec sha256sum {} + 2>/dev/null | sort | sha256sum)
rm -rf "$dir/directus-extensions"
cp -r "$stage/infrastructure/recette/directus-extensions" "$dir/directus-extensions"
extensions_after=$(cd "$dir" && find directus-extensions -type f -exec sha256sum {} + | sort | sha256sum)

echo "== Démarrage"
compose up -d --force-recreate recette-api recette-web </dev/null
compose up -d recette-directus </dev/null
if [ "$extensions_before" != "$extensions_after" ]; then compose restart recette-directus </dev/null; fi
for _ in $(seq 1 30); do
  if compose exec -T recette-api node -e \
      "fetch('http://127.0.0.1:3000/api/ready').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))" </dev/null; then
    echo "== Directus"
    for _ in $(seq 1 60); do
      compose exec -T recette-api node -e \
        "fetch('http://recette-directus:8055/server/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))" </dev/null && break
      sleep 3
    done
    # Collections, liens et champs de Directus sur les tables de contenu.
    psql -q < "$stage/infrastructure/recette/directus-relations.sql"
    docker run --rm --network tuc-recette_recette \
      -e DIRECTUS_URL=http://recette-directus:8055 \
      -e DIRECTUS_ADMIN_EMAIL -e DIRECTUS_ADMIN_PASSWORD \
      -v "$stage/infrastructure/recette/directus-setup.mjs:/setup.mjs:ro" \
      node:24-alpine node /setup.mjs </dev/null
    docker image prune -f >/dev/null
    # Le cache de construction grossit de 2 à 3 Go à chaque essai (17 Go le
    # 01/11) et --max-used-space ne le réduit pas : on le vide.
    docker builder prune -af >/dev/null
    printf '%s\n' "$sha" > "$dir/.recette-sha"
    echo "À L'ESSAI : $sha sur https://dev.terra-umbra.fr"
    exit 0
  fi
  sleep 2
done
echo "Le site d'essai ne répond pas." >&2
compose logs --tail 50 recette-api >&2
exit 1
