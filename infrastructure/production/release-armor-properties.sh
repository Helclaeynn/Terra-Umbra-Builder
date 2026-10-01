#!/usr/bin/env bash
set -euo pipefail
umask 077
sha=${1:?Source SHA required}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]]
root=/opt/terra-umbra
stage="$root/releases/armor-properties-$sha"
test -f "$root/production-active"
test -d "$stage"
exec 9>"$root/.production-release.lock"
flock -n 9
available=$(df -PB1 "$root" | awk 'NR==2 {print $4}')
[ "$available" -ge 4294967296 ] || { echo 'Insufficient storage for safe application build' >&2; exit 1; }
cd "$root/infrastructure"
bash production/backup.sh </dev/null
mkdir -p "$stage/previous"
cp -a "$root/apps/api/src" "$stage/previous/api-src"
cp -a "$root/apps/web/src" "$stage/previous/web-src"
cp "$root/apps/web/Dockerfile" "$stage/previous/web-Dockerfile"
cp "$root/apps/api/Dockerfile" "$stage/previous/api-Dockerfile"
cp "$root/apps/web/public/build-info.json" "$stage/previous/build-info.json"
docker inspect --format '{{.Image}}' "$(docker compose ps -q api)" > "$stage/previous-api-image"
docker inspect --format '{{.Image}}' "$(docker compose ps -q web)" > "$stage/previous-web-image"
docker tag "$(cat "$stage/previous-api-image")" tuc-v2-api:before-armor-properties
docker tag "$(cat "$stage/previous-web-image")" tuc-v2-web:before-armor-properties
rollback(){
 status=$?
 if [ "$status" -ne 0 ]; then
  cp -a "$stage/previous/api-src/." "$root/apps/api/src/"
  cp -a "$stage/previous/web-src/." "$root/apps/web/src/"
  cp "$stage/previous/web-Dockerfile" "$root/apps/web/Dockerfile"
  cp "$stage/previous/api-Dockerfile" "$root/apps/api/Dockerfile"
  cp "$stage/previous/build-info.json" "$root/apps/web/public/build-info.json"
  docker tag "$(cat "$stage/previous-api-image")" tuc-v2-api:latest
  docker tag "$(cat "$stage/previous-web-image")" tuc-v2-web:latest
  docker compose up -d --no-build --no-deps --force-recreate api web
  echo 'ARMOR RELEASE FAILED — previous application restored' >&2
  exit "$status"
 fi
}
trap rollback EXIT
for file in apps/api/src/rules/equipment-armor.ts apps/api/src/rules/index.ts apps/api/src/compendium-armor-properties.ts apps/api/src/compendium.ts apps/web/src/lib/reality.ts apps/web/Dockerfile apps/api/Dockerfile; do
 cp "$stage/$file" "$root/$file"
done
SOURCE_SHA="$sha" python3 - <<'PY'
import json,os,pathlib
pathlib.Path('/opt/terra-umbra/apps/web/public/build-info.json').write_text(json.dumps({'commit':os.environ['SOURCE_SHA'],'release':'armor-properties-20261001'}))
PY
docker build --label "org.opencontainers.image.revision=$sha" -t tuc-v2-api -f "$root/apps/api/Dockerfile" "$root" </dev/null
docker build --label "org.opencontainers.image.revision=$sha" -t tuc-v2-web -f "$root/apps/web/Dockerfile" "$root" </dev/null
docker run -i --pull=never --rm --network none --entrypoint node tuc-v2-api --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getRealityRules} from './dist/rules/reality.js';
assert.ok(readFileSync('/app/package.json','utf8'));
assert.equal(getRealityRules().equipment.filter(item=>item.sourceCategory.startsWith('Armures')).length,27);
console.log('NON-ROOT API IMAGE OK — package and all 27 armour profiles readable');
NODE
docker compose up -d --no-deps api web </dev/null
ready=false
for attempt in $(seq 1 24); do
 if curl --fail --silent --show-error --max-time 10 https://terra-umbra.fr/api/health >/dev/null; then ready=true;break;fi
 sleep 3
done
[ "$ready" = true ]
docker compose exec -T api node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import {getRealityRules} from './dist/rules/reality.js';
import {armorStats} from './dist/rules/equipment-armor.js';
import {getCompendiumQualityCorpus} from './dist/compendium.js';
import {pool} from './dist/db.js';
try{
 const items=getRealityRules().equipment.filter(item=>item.sourceCategory.startsWith('Armures'));
 assert.equal(items.length,27);
 const {articles}=await getCompendiumQualityCorpus();
 for(const item of items){
  const article=articles.find(article=>article.catalog?.id===item.id);
  assert.ok(article,item.name);
  const rows=article.sections.find(section=>section.id==='proprietes').blocks.find(block=>block.type==='table').rows;
  for(const [key,value] of armorStats(item))assert.ok(rows.some(row=>row[0]===key&&row[1]===value),item.name+' '+key);
 }
 console.log('LIVE ARMOR CORPUS OK — all 27 original profiles');
}finally{await pool.end();}
NODE
curl --fail --silent --show-error --max-time 20 https://terra-umbra.fr/api/compendium/articles/equipement-087-raven-black-dog > "$stage/live-armor.json"
python3 - "$stage/live-armor.json" <<'PY'
import json,sys
article=json.load(open(sys.argv[1]))['article']
assert any(block.get('type')=='table' and ['Protection','Balistique 3, Melee 2, Antichoc 2'] in block.get('rows',[]) for section in article['sections'] for block in section['blocks'])
print('LIVE PUBLIC ARMOR API OK')
PY
curl --fail --silent --show-error --max-time 20 "https://terra-umbra.fr/build-info.json?armor=$sha" > "$stage/live-build.json"
SOURCE_SHA="$sha" python3 - "$stage/live-build.json" <<'PY'
import json,os,sys
assert json.load(open(sys.argv[1]))['commit']==os.environ['SOURCE_SHA']
PY
printf '%s\n' "$sha" > "$root/.production-release-sha"
trap - EXIT
echo 'ARMOR PROPERTIES LIVE VERIFIED — Builder and Compendium application deployed; no database migration'
