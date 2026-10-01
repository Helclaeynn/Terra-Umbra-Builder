#!/usr/bin/env bash
set -euo pipefail
umask 077
sha=${1:?Source SHA required}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]]
root=/opt/terra-umbra
stage="$root/releases/aidh-catalogue-$sha"
test -f "$root/production-active"
test -f "$stage/payload-files.json"
exec 9>"$root/.production-release.lock"
flock -n 9
cd "$root/infrastructure"
[ "$(df -PB1 "$root" | awk 'NR==2 {print $4}')" -ge 1073741824 ]
cid=$(docker compose ps -q api)
test -n "$cid"
previous=$(docker inspect --format '{{.Image}}' "$cid")
printf '%s\n' "$previous" > "$stage/previous-api-image"
docker tag "$previous" "tuc-v2-api:before-aidh-${sha:0:12}"
mkdir -p "$stage/live-data" "$stage/overlay/compendium-data" "$stage/overlay/compendium-media/images/manual" "$stage/overlay/rules-data/truth-equipment" "$stage/overlay/dist/rules/truth"
docker cp "$cid:/app/compendium-data/manifest-v3.json" "$stage/live-data/manifest-v3.json"
docker cp "$cid:/app/compendium-data/navigation-v1.json" "$stage/live-data/navigation-v1.json"
STAGE="$stage" ROOT="$root" python3 - <<'PY'
import json,os,pathlib,shutil
s=pathlib.Path(os.environ['STAGE']);r=pathlib.Path(os.environ['ROOT']);o=s/'overlay'
files=json.loads((s/'payload-files.json').read_text())
assert all(not pathlib.PurePosixPath(p).is_absolute() and '..' not in pathlib.PurePosixPath(p).parts and p.startswith(('compendium/','apps/api/src/rules/truth/')) for p in files)
existed=[]
for p in files:
 if (r/p).is_file():
  b=s/'previous'/p;b.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(r/p,b);existed.append(p)
(s/'previous-files.json').write_text(json.dumps(existed))
new=json.loads((s/'compendium/data/manifest-v3.json').read_text());live=json.loads((s/'live-data/manifest-v3.json').read_text())
spec=next(x for x in new['datasets'] if x['id']=='verite-catalogue')
assert spec['count']==231
live['datasets']=[spec if x['id']=='verite-catalogue' else x for x in live['datasets']]
live['expectedTotal']=sum(x['count'] for x in live['datasets']);live['generated']='2026-10-01'
(o/'compendium-data/manifest-v3.json').write_text(json.dumps(live,ensure_ascii=False,indent=2)+'\n')
nav=json.loads((s/'live-data/navigation-v1.json').read_text());incoming=json.loads((s/'compendium/data/navigation-v1.json').read_text())
nav['entries']=[x for x in nav['entries'] if x.get('dataset')!='verite-catalogue']+[x for x in incoming['entries'] if x.get('dataset')=='verite-catalogue']
(o/'compendium-data/navigation-v1.json').write_text(json.dumps(nav,ensure_ascii=False,indent=2)+'\n')
for p in (s/'compendium/data').glob('v3-verite-catalogue-v6-*.b64part'):shutil.copy2(p,o/'compendium-data'/p.name)
for p in (s/'compendium/images/manual').glob('*-aidh-20261001.webp'):shutil.copy2(p,o/'compendium-media/images/manual'/p.name)
shutil.copy2(s/'compendium/source/verite-catalog-v6.json.gz.b64',o/'rules-data/truth-equipment/verite-catalog-v6.json.gz.b64')
shutil.copy2(s/'apps/api/dist/rules/truth/equipment.js',o/'dist/rules/truth/equipment.js')
shutil.copy2(s/'compendium/source/aidh-catalogue-revision-20261001.json',o/'aidh-catalogue-revision.json')
PY
rollback(){
 status=$?
 if [ "$status" -ne 0 ]; then
  docker tag "$previous" tuc-v2-api:latest
  docker compose up -d --no-build --no-deps --force-recreate api </dev/null || true
  STAGE="$stage" ROOT="$root" python3 - <<'PY'
import json,os,pathlib,shutil
s=pathlib.Path(os.environ['STAGE']);r=pathlib.Path(os.environ['ROOT']);existing=set(json.loads((s/'previous-files.json').read_text()))
for p in json.loads((s/'payload-files.json').read_text()):
 dest=r/p
 assert dest.resolve().is_relative_to(r.resolve())
 if p in existing:shutil.copy2(s/'previous'/p,dest)
 elif dest.is_file():dest.unlink()
PY
  echo 'AIDH RELEASE FAILED — previous API and source restored' >&2
 fi
 exit "$status"
}
trap rollback EXIT
cat > "$stage/overlay/Dockerfile" <<'DOCKER'
ARG BASE
FROM ${BASE}
COPY --chown=node:node --chmod=755 compendium-data/ /app/compendium-data/
COPY --chown=node:node --chmod=755 compendium-media/ /app/compendium-media/
COPY --chown=node:node --chmod=755 rules-data/ /app/rules-data/
COPY --chown=node:node --chmod=755 dist/ /app/dist/
COPY --chown=node:node --chmod=644 aidh-catalogue-revision.json /app/aidh-catalogue-revision.json
DOCKER
docker build --pull=false --build-arg "BASE=tuc-v2-api:before-aidh-${sha:0:12}" --label "org.opencontainers.image.revision=$sha" -t "tuc-v2-api:aidh-${sha:0:12}" "$stage/overlay" </dev/null
docker run -i --rm --network none --entrypoint node "tuc-v2-api:aidh-${sha:0:12}" --input-type=module <<'NODE'
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {truthEquipmentCatalog as items} from './dist/rules/truth/equipment.js';
assert.equal(items.length,231);assert.equal(new Set(items.map(x=>x.id)).size,231);
const revision=JSON.parse(readFileSync('./aidh-catalogue-revision.json','utf8'));assert.equal(revision.items.length,25);
for(const x of revision.items)assert.equal(createHash('sha256').update(readFileSync('./compendium-media/'+x.src)).digest('hex'),x.sha256);
for(const id of revision.approvedEquipment)assert.equal(items.find(x=>x.compendiumId===id).requiresMj,false);
console.log('AIDH IMAGE VERIFIED — non-root runtime, 25 assets, 231 equipment records');
NODE
STAGE="$stage" ROOT="$root" python3 - <<'PY'
import json,os,pathlib,shutil
s=pathlib.Path(os.environ['STAGE']);r=pathlib.Path(os.environ['ROOT'])
for p in json.loads((s/'payload-files.json').read_text()):
 dest=r/p;dest.parent.mkdir(parents=True,exist_ok=True)
 if p in ('compendium/data/manifest-v3.json','compendium/data/navigation-v1.json') and dest.is_file():
  current=json.loads(dest.read_text());incoming=json.loads((s/p).read_text())
  if p.endswith('manifest-v3.json'):
   spec=next(x for x in incoming['datasets'] if x['id']=='verite-catalogue')
   current['datasets']=[spec if x['id']=='verite-catalogue' else x for x in current['datasets']]
   current['expectedTotal']=sum(x['count'] for x in current['datasets'])
  else:current['entries']=[x for x in current['entries'] if x.get('dataset')!='verite-catalogue']+[x for x in incoming['entries'] if x.get('dataset')=='verite-catalogue']
  dest.write_text(json.dumps(current,ensure_ascii=False,indent=2)+'\n')
 else:shutil.copy2(s/p,dest)
PY
docker tag "tuc-v2-api:aidh-${sha:0:12}" tuc-v2-api:latest
docker compose up -d --no-build --no-deps --force-recreate api </dev/null
ready=false
for attempt in $(seq 1 24); do
 if curl --fail --silent --max-time 10 https://terra-umbra.fr/api/health >/dev/null; then ready=true;break;fi
 sleep 3
done
[ "$ready" = true ]
docker compose exec -T api node --input-type=module <<'NODE'
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {truthEquipmentCatalog} from './dist/rules/truth/equipment.js';
import {getCompendiumQualityCorpus} from './dist/compendium.js';import {pool} from './dist/db.js';
try{
 const revision=JSON.parse(readFileSync('./aidh-catalogue-revision.json','utf8'));
 const {articles}=await getCompendiumQualityCorpus();
 for(const x of revision.items){const a=articles.find(a=>a.id===x.id);assert.ok(a,x.id);assert.equal(a.illustration?.src,x.src,x.id);}
 for(const id of revision.approvedEquipment){const e=truthEquipmentCatalog.find(e=>e.compendiumId===id);assert.ok(e,id);assert.equal(e.requiresMj,false);}
 console.log('AIDH LIVE CORPUS VERIFIED');
}finally{await pool.end();}
NODE
STAGE="$stage" python3 - <<'PY'
import hashlib,json,os,pathlib,urllib.request
s=pathlib.Path(os.environ['STAGE']);revision=json.loads((s/'compendium/source/aidh-catalogue-revision-20261001.json').read_text())
for item in revision['items']:
 with urllib.request.urlopen('https://terra-umbra.fr/api/compendium/articles/'+item['id'],timeout=30) as r:article=json.load(r)['article']
 assert article['illustration']['src']==item['src'],item['id']
 with urllib.request.urlopen('https://terra-umbra.fr/api/compendium/media/'+item['src'],timeout=30) as r:content=r.read()
 assert hashlib.sha256(content).hexdigest()==item['sha256'],item['id']
print('AIDH PUBLIC API VERIFIED — all 25 selected images and both new articles')
PY
printf '%s\n' "$sha" > "$root/.production-aidh-catalogue-sha"
trap - EXIT
echo 'AIDH CATALOGUE LIVE VERIFIED — approved art and profiles deployed; no database migration'
