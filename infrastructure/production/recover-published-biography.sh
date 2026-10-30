#!/usr/bin/env bash
set -euo pipefail
umask 077
sha=${1:?Commit required}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]]
root=/opt/terra-umbra
stage="$root/releases/compendium-biography-$sha"
test -f "$root/production-active"
exec 9>"$root/.production-release.lock"
flock -n 9
cd "$root/infrastructure"
test "$(df -PB1 "$root" | awk 'NR==2 {print $4}')" -ge 536870912
mkdir -m 700 -p "$stage/overlay"
api=$(docker compose ps -q api)
test -n "$api"
previous=$(docker inspect --format '{{.Image}}' "$api")
target=$(docker inspect --format '{{.Config.Image}}' "$api")
printf '%s\n' "$previous" > "$stage/previous-api-image"
printf '%s\n' "$target" > "$stage/previous-api-tag"
docker compose ps api db web
docker cp "$api:/app/dist/compendium-pnj-repairs.js" "$stage/original.js"
cp "$stage/original.js" "$stage/overlay/compendium-pnj-repairs.js"
STAGE="$stage" python3 - <<'PY'
import os,pathlib,re
p=pathlib.Path(os.environ['STAGE'])/'overlay/compendium-pnj-repairs.js'
s=p.read_text()
pattern=r'(?P<indent>^[ \t]*)if \(!section\)\s*throw new Error\(`Biographie fragmentée introuvable : \$\{id\}`\);'
assert len(list(re.finditer(pattern,s,re.M)))==1, 'Running repair differs; refusing broad replacement'
assert '__wikiPublishedEdit === true) continue' not in s, 'Recovery already applied'
s=re.sub(pattern,lambda m:m['indent']+'if (!section && article?.__wikiPublishedEdit === true) continue;\n'+m[0],s,count=1,flags=re.M)
p.write_text(s)
PY
cat > "$stage/overlay/Dockerfile" <<'DOCKER'
ARG BASE
FROM ${BASE}
COPY --chown=node:node --chmod=755 compendium-pnj-repairs.js /app/dist/compendium-pnj-repairs.js
DOCKER
base="tuc-v2-api:before-biography-${sha:0:12}"
docker tag "$previous" "$base"
docker build --pull=false --build-arg "BASE=$base" -t "tuc-v2-api:biography-${sha:0:12}" "$stage/overlay" </dev/null
docker run --rm --network none --entrypoint node "tuc-v2-api:biography-${sha:0:12}" --input-type=module -e "import {applyCompendiumPnjRepairs} from './dist/compendium-pnj-repairs.js'; if(typeof applyCompendiumPnjRepairs !== 'function') process.exit(1);"
bash production/backup.sh </dev/null
snapshot_edits() {
  docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -At -v ON_ERROR_STOP=1' <<'SQL'
SELECT count(*), md5(coalesce(string_agg(article_id || published::text, '' ORDER BY article_id), '')) FROM compendium_article_edits WHERE published IS NOT NULL;
SQL
}
snapshot_edits > "$stage/edits-before"
rollback() {
  status=$?
  if [ "$status" -ne 0 ]; then
    docker tag "$previous" "$target"
    docker compose up -d --no-build --no-deps --force-recreate api </dev/null || true
    echo 'Recovery failed; original API image restored' >&2
  fi
  exit "$status"
}
trap rollback EXIT
docker tag "tuc-v2-api:biography-${sha:0:12}" "$target"
docker compose up -d --no-build --no-deps --force-recreate api </dev/null
ready=false
for attempt in $(seq 1 24); do
  if curl --fail --silent --max-time 15 https://terra-umbra.fr/api/compendium/meta > "$stage/meta.json"; then ready=true; break; fi
  sleep 3
done
test "$ready" = true
for path in '/api/compendium/wiki-index?compact=1' '/api/compendium/search?q=Dragoslav' '/api/compendium/articles/pnj-crawlers-docx-dragoslav-memic'; do
  curl --fail --silent --show-error --max-time 20 "https://terra-umbra.fr$path" >/dev/null
done
snapshot_edits > "$stage/edits-after"
cmp "$stage/edits-before" "$stage/edits-after"
source="$root/apps/api/src/compendium-pnj-repairs.ts"
if [ -f "$source" ]; then
  cp "$source" "$stage/original.ts"
  SOURCE="$source" python3 - <<'PY'
import os,pathlib,re
p=pathlib.Path(os.environ['SOURCE']);s=p.read_text()
pattern=r'(?P<indent>^[ \t]*)if \(!section\)\s*throw new Error\(`Biographie fragmentée introuvable : \$\{id\}`\);'
if '__wikiPublishedEdit === true) continue' not in s:
 s,n=re.subn(pattern,lambda m:m['indent']+'if (!section && article?.__wikiPublishedEdit === true) continue;\n'+m[0],s,count=1,flags=re.M)
 assert n==1, 'Source differs; preserved for reconciliation'
 p.write_text(s)
PY
fi
echo 'COMPENDIUM RECOVERED: metadata, index, search and Dragoslav return 200; published edits unchanged'
