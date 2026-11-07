#!/usr/bin/env bash
# Passage unique (07/11) : recopie le contenu du site d'essai (règles, articles,
# passe éditoriale, historique) dans les tables content_* de la production.
# Lancé à la main sur le VPS, après une mise en ligne qui a créé ces tables,
# et avant de régler CONTENT_SOURCE=db. Ne touche à aucune autre table
# (comptes, fiches, campagnes restent ceux de la production).
# Refuse de tourner si la production a déjà des articles en base.
set -euo pipefail
root=/opt/terra-umbra
tables=(content_type content_entry content_relation content_revision content_media content_tag)
targs=""; for t in "${tables[@]}"; do targs+=" -t $t"; done
list=$(IFS=,; echo "${tables[*]}")
work=$(mktemp -d); trap 'rm -rf "$work"' EXIT

essai() { (cd "$root/recette" && set -a && . ./.env && set +a && docker compose exec -T recette-db "$@"); }
prod() { (cd "$root/infrastructure" && set -a && . ./.env && set +a && docker compose exec -T db "$@"); }
sql() { local who=$1; shift; "$who" sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 "$@"' psql "$@"; }
counts() {
  local q="" t; for t in "${tables[@]}"; do q+="SELECT '$t', count(*) FROM $t UNION ALL "; done
  sql "$1" -At -F' ' -c "${q% UNION ALL } ORDER BY 1"
}

n=$(sql prod -Atc "SELECT count(*) FROM content_entry")
if [ "$n" != 0 ]; then echo "La production a déjà $n entrées de contenu : arrêt." >&2; exit 1; fi

echo "== Export du site d'essai"
essai sh -c "pg_dump -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\" -Fc --data-only $targs" > "$work/contenu.dump"
counts essai > "$work/essai.txt"

echo "== Import en production (vidage et import dans une seule transaction : tout ou rien)"
prod pg_restore -f - --data-only --disable-triggers < "$work/contenu.dump" > "$work/contenu.sql"
{ echo "TRUNCATE $list RESTART IDENTITY;"; cat "$work/contenu.sql"; } | sql prod -q -1
counts prod > "$work/prod.txt"
if ! diff "$work/essai.txt" "$work/prod.txt"; then echo "Comptes différents après l'import." >&2; exit 1; fi
cat "$work/prod.txt"

echo "== Images d'articles présentes seulement sur le site d'essai (ajoutées, jamais remplacées)"
docker run --rm -v tuc-recette_recette-editor-media:/from:ro -v tuc-v2_compendium-editor-media:/to \
  alpine sh -c 'cd /from && find . -type f | while read -r f; do [ -e "/to/$f" ] || { mkdir -p "/to/$(dirname "$f")"; cp -p "$f" "/to/$f"; echo "copiée : $f"; }; done'
echo "CONTENU RECOPIÉ"
