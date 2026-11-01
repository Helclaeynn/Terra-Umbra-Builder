#!/usr/bin/env bash
# Mise en ligne depuis Git : le seul chemin de déploiement de la production.
# Lancé par .github/workflows/deploy.yml (bouton « Mise en ligne », branche main).
#
#   deploy.sh <sha> <archive.tar.gz>
#
# L'archive contient apps/, character-builder/, compendium/, infrastructure/
# et .release-sha, tirés du commit <sha>. Étapes :
#   1. construit les images api et web depuis l'archive (le site tourne encore) ;
#   2. sauvegarde vérifiée (base + médias) ;
#   3. applique les migrations SQL nouvelles, une seule fois chacune ;
#   4. remplace les sources du serveur, bascule api et web, recharge Caddy ;
#   5. vérifie que le site répond ; sinon remet les images précédentes.
# Les migrations ne sont pas annulées par le retour arrière : la sauvegarde
# de l'étape 2 sert à cela.
#
# DRY_RUN=1 : construit et vérifie les images, sans rien basculer.
set -euo pipefail
umask 022

sha=${1:?SHA du commit requis}
archive=${2:?archive requise}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]]
short=${sha:0:12}
root=/opt/terra-umbra
site=https://terra-umbra.fr
dry_run=${DRY_RUN:-0}

exec 9>"$root/.production-release.lock"
flock -w 60 9 || { echo "Une autre mise en ligne est en cours" >&2; exit 1; }

# Le cache de construction (commun aux deux sites) peut dépasser 15 Go après
# un essai interrompu : on le vide d'abord si la place manque.
free_gb=$(df --output=avail -BG / | tail -1 | tr -dc 0-9)
if (( free_gb < 10 + 4 )); then docker builder prune -af >/dev/null; free_gb=$(df --output=avail -BG / | tail -1 | tr -dc 0-9); fi
if (( free_gb < 10 )); then
  echo "Moins de 10 Go libres sur le serveur ($free_gb Go) : arrêt." >&2
  exit 1
fi

echo "== Sources $short"
stage="$root/releases/deploy-$short"
rm -rf "$stage"
mkdir -p "$stage/src"
tar -xzf "$archive" -C "$stage/src"
test "$(cat "$stage/src/.release-sha")" = "$sha"
for dir in apps character-builder compendium infrastructure; do
  test -d "$stage/src/$dir"
done

echo "== Construction des images"
docker build --pull=false -f "$stage/src/apps/api/Dockerfile" \
  --label "org.opencontainers.image.revision=$sha" \
  -t "tuc-v2-api:$short" "$stage/src" </dev/null
docker build --pull=false -f "$stage/src/apps/web/Dockerfile" \
  --label "org.opencontainers.image.revision=$sha" \
  -t "tuc-v2-web:$short" "$stage/src" </dev/null
docker run --rm --network none --entrypoint nginx "tuc-v2-web:$short" -t </dev/null

if [ "$dry_run" = 1 ]; then
  echo "DRY_RUN : images tuc-v2-api:$short et tuc-v2-web:$short construites, rien n'est basculé."
  exit 0
fi

echo "== Sauvegarde"
bash "$root/infrastructure/backup/daily-backup.sh" </dev/null

cd "$root/infrastructure"
set -a
. ./.env
set +a
psql() {
  docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 "$@"
}

echo "== Migrations"
psql -qc "CREATE TABLE IF NOT EXISTS deploy_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
)" </dev/null
# Premier passage : toutes les migrations déjà présentes sur le serveur ont été
# appliquées à la main par les anciennes releases ; on les inscrit sans les rejouer.
if [ "$(psql -Atc "SELECT count(*) FROM deploy_migrations" </dev/null)" = 0 ]; then
  for file in "$root"/infrastructure/migrations/*.sql; do
    psql -qc "INSERT INTO deploy_migrations (name) VALUES ('$(basename "$file")')" </dev/null
  done
fi
for file in "$stage"/src/infrastructure/migrations/*.sql; do
  name=$(basename "$file")
  [[ "$name" =~ ^[A-Za-z0-9_.-]+$ ]]
  if [ "$(psql -Atc "SELECT count(*) FROM deploy_migrations WHERE name = '$name'" </dev/null)" = 0 ]; then
    echo "Migration : $name"
    { cat "$file"; echo; echo "INSERT INTO deploy_migrations (name) VALUES ('$name');"; } | psql -q -1
  fi
done

echo "== Sources du serveur"
for dir in apps character-builder compendium; do
  rsync -a --delete --exclude node_modules --exclude dist "$stage/src/$dir/" "$root/$dir/"
done
rsync -a --delete --exclude .env --exclude Caddyfile --exclude backup/ \
  "$stage/src/infrastructure/" "$root/infrastructure/"
caddy_changed=false
if ! cmp -s "$stage/src/infrastructure/production/Caddyfile" "$root/infrastructure/Caddyfile"; then
  cp "$stage/src/infrastructure/production/Caddyfile" "$root/infrastructure/Caddyfile"
  caddy_changed=true
fi

echo "== Bascule"
docker tag tuc-v2-api:latest tuc-v2-api:rollback
docker tag tuc-v2-web:latest tuc-v2-web:rollback

site_ok() {
  for _ in $(seq 1 30); do
    if curl -fsS --max-time 5 "$site/api/ready" >/dev/null &&
       curl -fsS --max-time 5 "$site/" >/dev/null; then
      return 0
    fi
    sleep 2
  done
  return 1
}

docker tag "tuc-v2-api:$short" tuc-v2-api:latest
docker tag "tuc-v2-web:$short" tuc-v2-web:latest
docker compose up -d --no-build --no-deps --force-recreate api web </dev/null
if [ "$caddy_changed" = true ]; then
  docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile </dev/null
fi

if ! site_ok; then
  echo "LE SITE NE RÉPOND PAS : retour aux images précédentes" >&2
  docker tag tuc-v2-api:rollback tuc-v2-api:latest
  docker tag tuc-v2-web:rollback tuc-v2-web:latest
  docker compose up -d --no-build --no-deps --force-recreate api web </dev/null
  if site_ok; then
    echo "Version précédente rétablie. Les migrations éventuelles restent appliquées." >&2
  else
    echo "URGENT : la version précédente ne répond pas non plus." >&2
  fi
  exit 1
fi

echo "== Rangement"
printf '%s\n' "$sha" > "$root/.production-sha"
rm -f "$archive"
# Garde les deux derniers dossiers de mise en ligne et une image de retour arrière.
ls -dt "$root"/releases/deploy-* | tail -n +3 | xargs -r rm -rf
docker images --format '{{.Repository}}:{{.Tag}}' |
  grep -E '^tuc-v2-(api|web):' |
  grep -vE ":(latest|rollback|$short)$" |
  xargs -r docker rmi >/dev/null 2>&1 || true
docker image prune -f >/dev/null
# Cache de construction commun avec le site d'essai : vidé (--max-used-space ne le réduit pas).
docker builder prune -af >/dev/null

echo "EN LIGNE : $sha"
df -h / | awk 'NR==2{print "Disque : "$4" libres ("$5" utilisés)"}'
