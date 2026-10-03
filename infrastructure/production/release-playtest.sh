#!/usr/bin/env bash
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]]
root=/opt/terra-umbra
stage="$root/releases/playtest-$sha"
test -f "$root/production-active"
test -f "$stage/payload-files.json"
exec 9>"$root/.production-release.lock"
flock -n 9
cd "$root/infrastructure"
[ "$(df -PB1 "$root" | awk 'NR==2 {print $4}')" -ge 1073741824 ]
api=$(docker compose ps -q api)
web=$(docker compose ps -q web)
test -n "$api" && test -n "$web"
previous_api=$(docker inspect --format '{{.Image}}' "$api")
previous_web=$(docker inspect --format '{{.Image}}' "$web")
printf '%s\n' "$previous_api" > "$stage/previous-api-image"
printf '%s\n' "$previous_web" > "$stage/previous-web-image"
docker tag "$previous_api" "tuc-v2-api:before-playtest-${sha:0:12}"
docker tag "$previous_web" "tuc-v2-web:before-playtest-${sha:0:12}"
curl --fail --silent --show-error --max-time 30 https://terra-umbra.fr/api/compendium/meta > "$stage/previous-meta.json"
STAGE="$stage" ROOT="$root" python3 - <<'PY'
import json,os,pathlib,shutil
s=pathlib.Path(os.environ['STAGE']);r=pathlib.Path(os.environ['ROOT']);files=json.loads((s/'payload-files.json').read_text());existing=[]
for p in files:
 assert not pathlib.PurePosixPath(p).is_absolute() and '..' not in pathlib.PurePosixPath(p).parts
 assert p.startswith(('apps/','infrastructure/migrations/'))
 if (r/p).is_file():
  b=s/'previous'/p;b.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(r/p,b);existing.append(p)
(s/'previous-files.json').write_text(json.dumps(existing))
PY
mkdir -p "$stage/api-overlay/dist" "$stage/web-overlay/html"
cp -a "$stage/apps/api/dist/." "$stage/api-overlay/dist/"
cp -a "$stage/apps/web/dist/." "$stage/web-overlay/html/"
cat > "$stage/api-overlay/Dockerfile" <<'DOCKER'
ARG BASE
FROM ${BASE}
COPY --chown=node:node --chmod=755 dist/ /app/dist/
DOCKER
cat > "$stage/web-overlay/Dockerfile" <<'DOCKER'
ARG BASE
FROM ${BASE}
COPY --chmod=755 html/ /usr/share/nginx/html/
DOCKER
docker build --pull=false --build-arg "BASE=tuc-v2-api:before-playtest-${sha:0:12}" --label "org.opencontainers.image.revision=$sha" -t "tuc-v2-api:playtest-${sha:0:12}" "$stage/api-overlay" </dev/null
docker build --pull=false --build-arg "BASE=tuc-v2-web:before-playtest-${sha:0:12}" --label "org.opencontainers.image.revision=$sha" -t "tuc-v2-web:playtest-${sha:0:12}" "$stage/web-overlay" </dev/null
docker run -i --rm --network none -e DATABASE_URL=postgres://check:check@127.0.0.1:1/check --entrypoint node "tuc-v2-api:playtest-${sha:0:12}" --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import {registerCharacterRoutes} from './dist/characters.js';
import {registerCharacterPlayRoutes} from './dist/character-play.js';
import {playProfile,blankPlayState} from './dist/rules/play-state.js';
assert.equal(typeof registerCharacterRoutes,'function');assert.equal(typeof registerCharacterPlayRoutes,'function');
const p=playProfile({attributes:{vigueur:3,agilite:3,esprit:3,volonte:3,charisme:3}},blankPlayState());assert.equal(p.health,'Indemne');assert.ok(p.skills.length>0);
console.log('PLAYTEST CANDIDATE IMPORTS VERIFIED');
NODE
bash production/backup.sh </dev/null
rollback(){
 status=$?
 if [ "$status" -ne 0 ]; then
  docker tag "$previous_api" tuc-v2-api:latest
  docker tag "$previous_web" tuc-v2-web:latest
  docker compose up -d --no-build --no-deps --force-recreate api web </dev/null || true
  STAGE="$stage" ROOT="$root" python3 - <<'PY'
import json,os,pathlib,shutil
s=pathlib.Path(os.environ['STAGE']);r=pathlib.Path(os.environ['ROOT']);existing=set(json.loads((s/'previous-files.json').read_text()))
for p in json.loads((s/'payload-files.json').read_text()):
 dest=r/p
 assert dest.resolve().is_relative_to(r.resolve())
 if p in existing:shutil.copy2(s/'previous'/p,dest)
 elif dest.is_file():dest.unlink()
PY
  echo 'PLAYTEST RELEASE FAILED — previous containers and source restored; additive tables retained' >&2
 fi
 exit "$status"
}
trap rollback EXIT
# The transaction adds tables and a defaulted column; old containers remain compatible.
docker compose exec -T -e PGOPTIONS='-c lock_timeout=10000 -c statement_timeout=60000' db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1' < "$stage/infrastructure/migrations/20261003_character_play.sql"
STAGE="$stage" ROOT="$root" python3 - <<'PY'
import json,os,pathlib,shutil
s=pathlib.Path(os.environ['STAGE']);r=pathlib.Path(os.environ['ROOT'])
for p in json.loads((s/'payload-files.json').read_text()):
 dest=r/p;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(s/p,dest)
PY
docker tag "tuc-v2-api:playtest-${sha:0:12}" tuc-v2-api:latest
docker tag "tuc-v2-web:playtest-${sha:0:12}" tuc-v2-web:latest
docker compose up -d --no-build --no-deps --force-recreate api web </dev/null
ready=false
for attempt in $(seq 1 24); do
 if curl --fail --silent --max-time 10 https://terra-umbra.fr/api/health >/dev/null; then ready=true;break;fi
 sleep 3
done
[ "$ready" = true ]
[ "$(docker inspect --format '{{.Image}}' "$(docker compose ps -q api)")" = "$(docker image inspect --format '{{.Id}}' "tuc-v2-api:playtest-${sha:0:12}")" ]
[ "$(docker inspect --format '{{.Image}}' "$(docker compose ps -q web)")" = "$(docker image inspect --format '{{.Id}}' "tuc-v2-web:playtest-${sha:0:12}")" ]
STAGE="$stage" python3 - <<'PY'
import hashlib,json,os,pathlib,re,urllib.request,urllib.error,time
s=pathlib.Path(os.environ['STAGE']);base='https://terra-umbra.fr'
def get(path):
 with urllib.request.urlopen(base+path,timeout=30) as r:return r.read()
expected=(s/'apps/web/dist/index.html').read_bytes()
for attempt in range(12):
 if get('/')==expected:break
 time.sleep(2)
else:raise AssertionError('Published web index differs from approved build')
for asset in re.findall(r'(?:src|href)="(/assets/[^" ]+\.(?:js|css))"',expected.decode()):
 assert hashlib.sha256(get(asset)).digest()==hashlib.sha256((s/'apps/web/dist'/asset.lstrip('/')).read_bytes()).digest(),asset
for path in ['/api/characters/11111111-1111-4111-8111-111111111111/play','/api/campaigns/11111111-1111-4111-8111-111111111111/play']:
 try:get(path);raise AssertionError('Private route accepted anonymous access')
 except urllib.error.HTTPError as e:assert e.code==401,(path,e.code)
meta=json.loads(get('/api/compendium/meta'));before=json.loads((s/'previous-meta.json').read_text())
assert meta['total']==before['total'] and meta['total']>2000
assert get('/characters/11111111-1111-4111-8111-111111111111/play')==expected
for id in ['verite-catalogue-230-fulgur-eb-7','verite-catalogue-231-duplex-ar-12']:assert json.loads(get('/api/compendium/articles/'+id))['article']['id']==id
print('PLAYTEST HTTPS VERIFIED — current bundles, private routes, dedicated page and unchanged Compendium')
PY
docker compose exec -T api node --input-type=module <<'NODE'
import assert from 'node:assert/strict';import {pool} from './dist/db.js';
try{
 const r=await pool.query("SELECT to_regclass('character_play_states') AS states,to_regclass('character_play_events') AS events");assert.ok(r.rows[0].states&&r.rows[0].events);
 const c=await pool.query("SELECT column_default FROM information_schema.columns WHERE table_name='campaign_reward_grants' AND column_name='equipment'");assert.equal(c.rowCount,1);
 console.log('PLAYTEST LIVE MIGRATION VERIFIED');
}finally{await pool.end();}
NODE
printf '%s\n' "$sha" > "$root/.production-playtest-sha"
trap - EXIT
echo 'PLAYTEST PRODUCTION LIVE VERIFIED — full MJ access, player privacy, live sheets and equipment gifts'
