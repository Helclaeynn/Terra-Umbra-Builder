#!/usr/bin/env bash
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]]
root=/opt/terra-umbra;stage="$root/releases/pnj-merges-$sha"
test -f "$root/production-active"
exec 9>"$root/.production-release.lock";flock -n 9
cd "$root/infrastructure"
test "$(df -PB1 "$root" | awk 'NR==2 {print $4}')" -ge 536870912
api=$(docker compose ps -q api);previous=$(docker inspect --format '{{.Image}}' "$api");target=$(docker inspect --format '{{.Config.Image}}' "$api")
mkdir -p "$stage/overlay"
printf '%s\n' "$previous" > "$stage/previous-api-image"
curl --fail --silent --show-error https://terra-umbra.fr/api/compendium/meta > "$stage/baseline.json"
docker cp "$api:/app/dist/compendium.js" "$stage/original-compendium.js"
cp "$stage/original-compendium.js" "$stage/overlay/compendium.js"
cp "$stage/compendium-pnj-approved-merges.js" "$stage/overlay/"
cp "$stage/check-approved-pnj-merges.mjs" "$stage/overlay/merge-check.mjs"
cp "$stage/baseline.json" "$stage/overlay/merge-baseline.json"
STAGE="$stage" python3 - <<'PY'
import os,pathlib
p=pathlib.Path(os.environ['STAGE'])/'overlay/compendium.js';s=p.read_text()
assert 'applyApprovedPnjMerges' not in s,'Already applied; stop for review'
s='import { APPROVED_PNJ_ALIASES, applyApprovedPnjMerges, approvedAliasArticle } from "./compendium-pnj-approved-merges.js";\n'+s
def replace(a,b,count=1):
 global s
 assert s.count(a)==count,'Running module differs at '+a[:70]
 s=s.replace(a,b)
replace('const MERGED_PNJ_ALIAS_IDS = {','const MERGED_PNJ_ALIAS_IDS = {\n    ...APPROVED_PNJ_ALIASES,')
replace('    const articles = [...byId.values()].sort(compareArticles);','    applyApprovedPnjMerges(byId);\n    for (const alias of Object.keys(APPROVED_PNJ_ALIASES)) navigation.delete(alias);\n    const articles = [...byId.values()].sort(compareArticles);')
replace('        const article = includeMj\n            ? corpus.byId.get(PROTECTED_ARTICLE_SOURCE_IDS[canonicalId] ?? canonicalId)\n            : corpus.publicById.get(PROTECTED_ARTICLE_PUBLIC_IDS[canonicalId] ?? canonicalId);','        const resolved = includeMj\n            ? corpus.byId.get(PROTECTED_ARTICLE_SOURCE_IDS[canonicalId] ?? canonicalId)\n            : corpus.publicById.get(PROTECTED_ARTICLE_PUBLIC_IDS[canonicalId] ?? canonicalId);\n        const article = resolved ? approvedAliasArticle(resolved,id) : undefined;',2)
marker='app.get("/api/compendium/editor/articles/:id",';assert s.count(marker)==1
start=s.index(marker);front=s[:start];tail=s[start:]
assert tail.count('const id = request.params.id.trim();')>=4
s=front+tail.replace('const id = request.params.id.trim();','const requestedId = request.params.id.trim();\n        const id = APPROVED_PNJ_ALIASES[requestedId] ?? requestedId;',4)
p.write_text(s)
PY
cat > "$stage/overlay/Dockerfile" <<'DOCKER'
ARG BASE
FROM ${BASE}
COPY --chown=node:node --chmod=755 compendium.js compendium-pnj-approved-merges.js /app/dist/
COPY --chown=node:node --chmod=644 merge-check.mjs merge-baseline.json /app/
DOCKER
base="tuc-v2-api:before-pnj-merges-${sha:0:12}";image="tuc-v2-api:pnj-merges-${sha:0:12}"
docker tag "$previous" "$base"
docker build --pull=false --build-arg "BASE=$base" -t "$image" "$stage/overlay" </dev/null
API="$api" STAGE="$stage" python3 - <<'PY'
import os,pathlib,json,subprocess
s=pathlib.Path(os.environ['STAGE']);a=json.loads(subprocess.check_output(['docker','inspect',os.environ['API']]))[0]
(s/'runtime.env').write_text('\n'.join(e for e in a['Config']['Env'] if e.startswith(('DATABASE_URL=','NODE_ENV=','COMPENDIUM_')))+'\n');(s/'runtime.env').chmod(0o600)
networks=[n for n in a['NetworkSettings']['Networks'] if n.endswith('_backend')];assert len(networks)==1;(s/'network').write_text(networks[0])
PY
bash production/backup.sh </dev/null
snapshot_edits(){ docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -At -v ON_ERROR_STOP=1' <<'SQL'
SELECT count(*),md5(coalesce(string_agg(article_id||published::text,'' ORDER BY article_id),'')) FROM compendium_article_edits WHERE published IS NOT NULL;
SQL
}
snapshot_edits > "$stage/edits-before"
rollback(){ status=$?;rm -f "$stage/runtime.env";if [ "$status" -ne 0 ];then docker tag "$previous" "$target";docker compose up -d --no-build --no-deps --force-recreate api </dev/null || true;echo 'PNJ merge release failed; previous API restored' >&2;fi;exit "$status"; }
trap rollback EXIT
docker run --rm --network "$(cat "$stage/network")" --env-file "$stage/runtime.env" --entrypoint node "$image" /app/merge-check.mjs
rm -f "$stage/runtime.env"
docker tag "$image" "$target";docker compose up -d --no-build --no-deps --force-recreate api </dev/null
STAGE="$stage" python3 - <<'PY'
import urllib.request,urllib.error,time,json,os,pathlib
s=pathlib.Path(os.environ['STAGE']);base='https://terra-umbra.fr'
def get(path):
 with urllib.request.urlopen(base+path,timeout=20) as r:return json.load(r)
for attempt in range(24):
 try:meta=get('/api/compendium/meta');break
 except (urllib.error.URLError,TimeoutError):time.sleep(3)
else:raise AssertionError('Compendium unavailable')
old=json.loads((s/'baseline.json').read_text());assert meta['total']==old['total']-4;assert meta['databaseEdits']==old['databaseEdits']
for oldId,id in {'pnj-portraits-chasseurs-autres-cai7-kai-sieben':'pnj-crawlers-docx-dragoslav-memic','pnj-portraits-corporations-tsung-feng':'pnj-corporations-feng-tsung','pnj-portraits-crawlers-niichaad-tenford':'pnj-crawlers-antisysteme-p60-niichad-tenford','pnj-crawlers-antisysteme-p33-yegpor-karamov':'pnj-fleaux-focus-yegor-karamov-05-yegor-karamov'}.items():assert get('/api/compendium/articles/'+oldId)['article']['id']==id
ids=[a['id'] for a in get('/api/compendium/search?category=Personnages&q=Dragoslav')['items']];assert ids==['pnj-crawlers-docx-dragoslav-memic']
for id in ['pnj-portraits-corporations-nia-allen','pnj-temples-daemoniaques-nina-allen']:get('/api/compendium/articles/'+id)
get('/api/health');get('/api/compendium/wiki-index?compact=1')
print('PNJ MERGES HTTPS VERIFIED — four canonical entries, aliases, published edits and distinct Nia/Nina')
PY
snapshot_edits > "$stage/edits-after";cmp "$stage/edits-before" "$stage/edits-after"
printf '%s\n' "$sha" > "$stage/deployed.ok"
trap - EXIT
echo 'APPROVED PNJ MERGES RELEASE VERIFIED — database rows and web unchanged'
