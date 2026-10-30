#!/usr/bin/env bash
# Explicitly authorized production release. Never restarts db or caddy.
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
mode=${2:-deploy}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid release SHA' >&2; exit 1; }
root=/opt/terra-umbra
stage="$root/releases/reality-$sha"
test -f "$root/production-active"
test -f "$root/infrastructure/.env"
test -d "$stage"
exec 9>"$root/.production-release.lock"
flock -n 9 || { echo 'Another production release holds the lock.' >&2; exit 1; }
cd "$root/infrastructure"
image_id(){ docker inspect --format '{{.Image}}' "$(docker compose ps -q "$1")"; }
image_revision(){ docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$(image_id "$1")"; }
restore_sources(){
  for component in api web; do
    if test -d "$stage/previous-$component"; then
      if test -e "$root/apps/$component"; then mv "$root/apps/$component" "$stage/failed-$component-$(date +%s%N)"; fi
      mv "$stage/previous-$component" "$root/apps/$component"
    fi
  done
}
restore_images(){
  docker tag "$(cat "$stage/previous-api-image")" tuc-v2-api:latest
  docker tag "$(cat "$stage/previous-web-image")" tuc-v2-web:latest
  docker compose up -d --no-build --no-deps --force-recreate api web
}
restore_marker(){
  if test -s "$stage/previous-release-sha"; then cp "$stage/previous-release-sha" "$root/.production-release-sha"; else rm -f "$root/.production-release-sha"; fi
}
if [[ "$mode" == rollback ]]; then
  test "$(cat "$root/.production-release-sha")" = "$sha"
  test "$(image_revision api)" = "$sha" && test "$(image_revision web)" = "$sha"
  restore_sources; restore_images; restore_marker
  rm -f "$stage/deployed.ok"
  echo 'Previous application source and images restored; database and uploaded media unchanged.'
  exit 0
fi
[[ "$mode" == deploy ]]
if test -f "$stage/deployed.ok"; then
  test "$(image_revision api)" = "$sha" && test "$(image_revision web)" = "$sha"
  echo 'This release is already running.'; exit 0
fi
(cd "$stage" && sha256sum --check SHA256SUMS)
test "$(cat "$stage/source-sha.txt")" = "$sha"
mkdir -p "$stage/new"
tar -xzf "$stage/apps-source.tar.gz" -C "$stage/new" --no-same-owner
test -f "$stage/new/apps/api/Dockerfile"
test -f "$stage/new/apps/web/Dockerfile"
test -f "$stage/new/apps/web/src/lib/reality-benefits.ts"
docker load --input "$stage/images.tar.gz"
for component in api web; do
  test "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "tuc-v2-$component:reality-$sha")" = "$sha"
  image_id "$component" > "$stage/previous-$component-image"
  docker tag "$(cat "$stage/previous-$component-image")" "tuc-v2-$component:before-reality-$sha"
done
if test -f "$root/.production-release-sha"; then cp "$root/.production-release-sha" "$stage/previous-release-sha"; else : > "$stage/previous-release-sha"; fi
bash production/backup.sh
images_changed=false
rollback_on_error(){
  status=$?
  trap - EXIT
  if [[ "$status" -ne 0 ]]; then
    restore_sources
    if [[ "$images_changed" == true ]]; then restore_images; fi
    restore_marker
    echo 'REALITY RELEASE FAILED — previous application restored; no database migration performed.' >&2
    exit "$status"
  fi
}
trap rollback_on_error EXIT
for component in api web; do
  test ! -e "$stage/previous-$component"
  mv "$root/apps/$component" "$stage/previous-$component"
  mv "$stage/new/apps/$component" "$root/apps/$component"
done
images_changed=true
docker tag "tuc-v2-api:reality-$sha" tuc-v2-api:latest
docker tag "tuc-v2-web:reality-$sha" tuc-v2-web:latest
docker compose up -d --no-build --no-deps --force-recreate api web
ready=false
for attempt in $(seq 1 40); do
  if curl --fail --silent --max-time 8 https://terra-umbra.fr/api/health >/dev/null; then ready=true; break; fi
  sleep 3
done
test "$ready" = true
for component in api web; do test "$(image_revision "$component")" = "$sha"; done
docker compose exec -T -e EXPECTED_SHA="$sha" api node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import {realityTalentRevision} from './dist/rules/reality-talents-revision.js';
import {terraUmbraCreationRules as rules} from './dist/rules/terra-umbra-creation.js';
import {terraUmbraTalentChoiceSpecs as talentChoiceSpecs} from './dist/rules/terra-umbra-creation-lore.js';
const base='https://terra-umbra.fr';
async function get(path){const r=await fetch(base+path,{signal:AbortSignal.timeout(15000)});assert.equal(r.status,200,path);return r.json();}
const info=await get('/build-info.json?release='+process.env.EXPECTED_SHA);
assert.equal(info.commit,process.env.EXPECTED_SHA,'The public site must serve the newly built web image');
// This endpoint requires a real logged-in user. Do not create a production
// account or impersonate an owner merely to check a release. Inspect the
// exact rule modules used by the running API and verify its HTTP auth guard.
assert.equal((await fetch(base+'/api/rulesets/terra-umbra/creation',{signal:AbortSignal.timeout(15000)})).status,401,'Anonymous rule access must remain protected');
const t=rules.talents,all=[...t.common,...t.expertise,...Object.values(t.origin).flat(),...Object.values(t.sphere).flat()];
assert.equal(all.length,122);
for(const [id,revision] of Object.entries(realityTalentRevision))assert.equal(all.find(t=>t.id===id)?.effect,revision.effect,'Runtime effect '+id);
assert.equal(Object.keys(realityTalentRevision).length,55);
assert.equal(talentChoiceSpecs.profil_calibre.kind,'skill');
assert.equal(talentChoiceSpecs.profil_calibre.styleSkills,true);
const {article}=await get('/api/compendium/articles/regles-profil-valeurs-derivees-statut');
for(const id of ['renommee','renommee-reputation','faire-valoir-son-nom','protection-et-renommee','progression-renommee'])assert.ok(article.sections.some(s=>s.id===id),'Live Renown section '+id);
assert.equal((await fetch(base+'/api/characters',{signal:AbortSignal.timeout(15000)})).status,401,'Character data remains private');
console.log('REALITY LIVE OK — exact public web release; 55 approved effects and 122 talents in the running API image; Style selection; five public Renown sections; protected rules and character access');
NODE
printf '%s\n' "$sha" > "$root/.production-release-sha"
touch "$stage/deployed.ok"
trap - EXIT
printf 'PRODUCTION REALITY RELEASE OK — %s\n' "$sha"
