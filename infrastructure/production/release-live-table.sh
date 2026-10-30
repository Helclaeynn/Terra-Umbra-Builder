#!/usr/bin/env bash
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]]
root=/opt/terra-umbra
stage="$root/releases/live-table-$sha"
test -f "$root/production-active"
test -f "$stage/payload-files.json"
exec 9>"$root/.production-release.lock"
flock -n 9
cd "$root/infrastructure"
free=$(df -PB1 "$root" | awk 'NR==2 {print $4}')
echo "Release space available: $free bytes"
test "$free" -ge 1073741824
api=$(docker compose ps -q api);web=$(docker compose ps -q web)
test -n "$api" && test -n "$web"
previous_api=$(docker inspect --format '{{.Image}}' "$api")
previous_web=$(docker inspect --format '{{.Image}}' "$web")
api_tag=$(docker inspect --format '{{.Config.Image}}' "$api")
web_tag=$(docker inspect --format '{{.Config.Image}}' "$web")
printf '%s\n' "$previous_api" > "$stage/previous-api-image"
printf '%s\n' "$previous_web" > "$stage/previous-web-image"
docker tag "$previous_api" "tuc-v2-api:before-live-table-${sha:0:12}"
docker tag "$previous_web" "tuc-v2-web:before-live-table-${sha:0:12}"
curl --fail --silent --show-error --max-time 30 https://terra-umbra.fr/api/compendium/meta > "$stage/previous-meta.json"
docker cp "$api:/app/package.json" "$stage/previous-api-package.json"
STAGE="$stage" python3 - <<'PY'
import os,pathlib,json
s=pathlib.Path(os.environ['STAGE'])
a=json.loads((s/'previous-api-package.json').read_text());b=json.loads((s/'apps/api/package.json').read_text())
assert a['dependencies']==b['dependencies'], 'Production dependencies differ; require a dependency-aware release'
PY
mkdir -p "$stage/api-overlay/dist" "$stage/web-overlay/html"
cp -a "$stage/apps/api/dist/." "$stage/api-overlay/dist/"
cp -a "$stage/apps/web/dist/." "$stage/web-overlay/html/"
cp "$stage/infrastructure/production/check-live-release.mjs" "$stage/api-overlay/release-check.mjs"
cp "$stage/previous-meta.json" "$stage/api-overlay/release-baseline.json"
cat > "$stage/api-overlay/Dockerfile" <<'DOCKER'
ARG BASE
FROM ${BASE}
COPY --chown=node:node --chmod=755 dist/ /app/dist/
COPY --chown=node:node --chmod=644 release-check.mjs /app/release-check.mjs
COPY --chown=node:node --chmod=644 release-baseline.json /app/release-baseline.json
DOCKER
cat > "$stage/web-overlay/Dockerfile" <<'DOCKER'
ARG BASE
FROM ${BASE}
COPY --chmod=755 html/ /usr/share/nginx/html/
DOCKER
docker build --pull=false --build-arg "BASE=tuc-v2-api:before-live-table-${sha:0:12}" -t "tuc-v2-api:live-table-${sha:0:12}" "$stage/api-overlay" </dev/null
docker build --pull=false --build-arg "BASE=tuc-v2-web:before-live-table-${sha:0:12}" -t "tuc-v2-web:live-table-${sha:0:12}" "$stage/web-overlay" </dev/null
# Runtime environment stays in private server storage and is never printed.
API="$api" STAGE="$stage" python3 - <<'PY'
import os,pathlib,json,subprocess
s=pathlib.Path(os.environ['STAGE'])
a=json.loads(subprocess.check_output(['docker','inspect',os.environ['API']]))[0]
env=[e for e in a['Config']['Env'] if e.startswith(('DATABASE_URL=','NODE_ENV=','COMPENDIUM_'))]
(s/'runtime.env').write_text('\n'.join(env)+'\n');(s/'runtime.env').chmod(0o600)
networks=list(a['NetworkSettings']['Networks'])
backend=[n for n in networks if n.endswith('_backend')]
assert len(backend)==1
(s/'backend-network').write_text(backend[0])
PY
bash production/backup.sh </dev/null
snapshot_edits(){
 docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -At -v ON_ERROR_STOP=1' <<'SQL'
SELECT count(*), md5(coalesce(string_agg(article_id || published::text, '' ORDER BY article_id), '')) FROM compendium_article_edits WHERE published IS NOT NULL;
SQL
}
snapshot_edits > "$stage/edits-before"
rollback(){
 status=$?
 rm -f "$stage/runtime.env"
 if [ "$status" -ne 0 ]; then
  docker tag "$previous_api" "$api_tag";docker tag "$previous_web" "$web_tag"
  docker compose up -d --no-build --no-deps --force-recreate api web </dev/null || true
  echo 'LIVE TABLE RELEASE FAILED — previous API/web restored; additive column remains compatible' >&2
 fi
 exit "$status"
}
trap rollback EXIT
# A single additive column; no character, campaign, session or event is rewritten.
docker compose exec -T -e PGOPTIONS='-c lock_timeout=10000 -c statement_timeout=60000' db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1' < "$stage/infrastructure/migrations/20261009_combat_roster.sql"
docker run --rm --network "$(cat "$stage/backend-network")" --env-file "$stage/runtime.env" --entrypoint node "tuc-v2-api:live-table-${sha:0:12}" /app/release-check.mjs
rm -f "$stage/runtime.env"
docker tag "tuc-v2-api:live-table-${sha:0:12}" "$api_tag"
docker tag "tuc-v2-web:live-table-${sha:0:12}" "$web_tag"
docker compose up -d --no-build --no-deps --force-recreate api web </dev/null
STAGE="$stage" python3 - <<'PY'
import os,pathlib,json,urllib.request,urllib.error,time,re,hashlib
s=pathlib.Path(os.environ['STAGE']);base='https://terra-umbra.fr'
def get(path):
 with urllib.request.urlopen(base+path,timeout=20) as r:return r.read()
for attempt in range(24):
 try:
  meta=json.loads(get('/api/compendium/meta'))
  old=json.loads((s/'previous-meta.json').read_text())
  assert all(meta[k]==old[k] for k in ['total','categories','databaseEdits'])
  break
 except (urllib.error.URLError,TimeoutError):time.sleep(3)
else:raise AssertionError('Compendium unavailable after release')
expected=(s/'apps/web/dist/index.html').read_bytes()
assert get('/')==expected, 'Web index differs from approved build'
for asset in re.findall(r'(?:src|href)="(/assets/[^" ]+\.(?:js|css))"',expected.decode()):
 assert hashlib.sha256(get(asset)).digest()==hashlib.sha256((s/'apps/web/dist'/asset.lstrip('/')).read_bytes()).digest()
for path in ['/api/compendium/wiki-index?compact=1','/api/compendium/search?q=Dragoslav','/api/compendium/articles/pnj-crawlers-docx-dragoslav-memic','/api/health']:
 get(path)
for path in ['/api/characters/11111111-1111-4111-8111-111111111111/play','/api/campaigns/11111111-1111-4111-8111-111111111111/play','/api/campaigns/11111111-1111-4111-8111-111111111111/occult-resolutions']:
 try:get(path);raise AssertionError('Private endpoint exposed')
 except urllib.error.HTTPError as e:assert e.code==401
print('LIVE TABLE HTTPS VERIFIED — web assets, private endpoints and unchanged Compendium')
PY
snapshot_edits > "$stage/edits-after"
cmp "$stage/edits-before" "$stage/edits-after"
# Persist the exact gameplay/frontend source without changing Compendium source.
STAGE="$stage" ROOT="$root" python3 - <<'PY'
import os,pathlib,json,shutil
s=pathlib.Path(os.environ['STAGE']);r=pathlib.Path(os.environ['ROOT'])
for entry in json.loads((s/'payload-files.json').read_text()):
 p=pathlib.PurePosixPath(entry)
 assert not p.is_absolute() and '..' not in p.parts and entry.startswith(('apps/api/src/','apps/web/src/'))
 assert not p.name.startswith('compendium') or entry.startswith('apps/web/src/')
 dest=r/entry
 if dest.is_file():
  previous=s/'previous-source'/entry;previous.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(dest,previous)
 dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(s/entry,dest)
PY
cp "$stage/infrastructure/migrations/20261009_combat_roster.sql" "$root/infrastructure/migrations/"
printf '%s\n' "$sha" > "$root/.production-live-table-sha"
printf '%s\n' "$sha" > "$stage/deployed.ok"
trap - EXIT
echo 'LIVE TABLE PRODUCTION RELEASE VERIFIED'
