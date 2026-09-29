#!/usr/bin/env bash
# Authorized release of the approved Daemon talents and saved manifestations. No schema migration; never restarts db or caddy.
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
mode=${2:-deploy}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || exit 1
root=/opt/terra-umbra
stage="$root/releases/daemon-$sha"
test -f "$root/production-active" && test -f "$root/infrastructure/.env"
test -d "$stage"
exec 9>"$root/.production-release.lock"
flock -n 9 || { echo 'Another release is running.' >&2; exit 1; }
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
  echo 'Previous application restored. Database, media and user records preserved.'
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
test -f "$stage/new/apps/api/src/rules/truth/mage-revision.ts"
test -f "$stage/new/apps/web/src/lib/mage.ts"
test -f "$stage/new/apps/web/src/lib/daemon.ts"
test -f "$stage/new/apps/api/src/rules/truth/daemon-revision.ts"
docker load --input "$stage/images.tar.gz"
for component in api web; do
  test "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "tuc-v2-$component:daemon-$sha")" = "$sha"
  image_id "$component" > "$stage/previous-$component-image"
  docker tag "$(cat "$stage/previous-$component-image")" "tuc-v2-$component:before-daemon-$sha"
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
    echo 'DAEMON TALENTS RELEASE FAILED — application restored; database and user data retained.' >&2
    exit "$status"
  fi
}
trap rollback_on_error EXIT
# No production database writes or schema migration are needed for this rules release.
for component in api web; do
  test ! -e "$stage/previous-$component"
  mv "$root/apps/$component" "$stage/previous-$component"
  mv "$stage/new/apps/$component" "$root/apps/$component"
done
images_changed=true
docker tag "tuc-v2-api:daemon-$sha" tuc-v2-api:latest
docker tag "tuc-v2-web:daemon-$sha" tuc-v2-web:latest
docker compose up -d --no-build --no-deps --force-recreate api web
ready=false
for attempt in $(seq 1 40); do
  if curl --fail --silent --max-time 8 https://terra-umbra.fr/api/ready >/dev/null; then ready=true; break; fi
  sleep 3
done
test "$ready" = true
for component in api web; do test "$(image_revision "$component")" = "$sha"; done
docker compose exec -T -e EXPECTED_SHA="$sha" api node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import {terraUmbraTruthRules} from './dist/rules/truth/rules.js';
import {daemonRevisions} from './dist/rules/truth/daemon-revision.js';
import {normalizeDaemonBuild,daemonTalentIds as ids} from './dist/rules/truth/daemon-build.js';
import {aserynRevisions} from './dist/rules/truth/aseryn-revision.js';
import {mageRevisions} from './dist/rules/truth/mage-revision.js';
import {normalizeMageTechniques} from './dist/rules/truth/mage-techniques.js';
import {getTalentRegistry} from './dist/rules/talent-registry.js';
import {campaignRewardViolation} from './dist/campaign-reward-guard.js';
import {getRealityRules} from './dist/rules/reality.js';
import {lifestyleReferenceIds,builderPurchaseAllowed,everydayEquipmentIds} from './dist/rules/builder-equipment-policy.js';
import {normalizeAppearances} from './dist/character-appearances.js';
const base='https://terra-umbra.fr';
const response=await fetch(base+'/build-info.json?release='+process.env.EXPECTED_SHA,{signal:AbortSignal.timeout(15000)});
assert.equal(response.status,200);assert.equal((await response.json()).commit,process.env.EXPECTED_SHA);
for(const [method,path] of [['GET','/api/characters'],['GET','/api/character-media/11111111-1111-4111-8111-111111111111'],['POST','/api/characters/11111111-1111-4111-8111-111111111111/images'],['GET','/api/campaigns/11111111-1111-4111-8111-111111111111/rewards']]){
 const result=await fetch(base+path,{method,signal:AbortSignal.timeout(15000)});assert.equal(result.status,401,'Private endpoint '+path);
}
assert.equal(lifestyleReferenceIds.size,88);
const all=getRealityRules().equipment;assert.equal(all.filter(i=>!builderPurchaseAllowed(i)).length,88,'References retained in canonical catalogue');
assert.equal(everydayEquipmentIds({reality:{augmentations:[{uid:'test'}]}}).length,6);
assert.equal(normalizeAppearances({truth:[{mediaId:'javascript:bad'}]}).truth.length,0);
const before={progression:{xpEarned:4,ptvEarned:2,renownAdjustment:1,cashBase:0,cashTransactions:[]},truth:{},reality:{equipment:[],augmentations:[]}};
const after=structuredClone(before);after.progression.renownAdjustment=2;assert.equal(campaignRewardViolation(before,after),'renown');
assert.equal(Object.keys(aserynRevisions).length,40);
const talents=terraUmbraTruthRules.catalogs.aseryn;
assert.equal(talents.length,100);
assert.equal(talents.filter(t=>t.effectDetails).length,40);
for(const [name,cost] of [['Signature électrique',1],['Arbitrage',1],['Chambre scellée',2],['Détruire la fausse certitude',2],['La famille ne manque de rien',2]])assert.equal(talents.find(t=>t.name===name).cost,cost);
assert.match(talents.find(t=>t.name==='Réflexe impossible').effect,/sans payer son PA/);
assert.match(talents.find(t=>t.name==='Déchaînement nymphal').elementEffects.eau,/fin de la scène/);
assert.match(talents.find(t=>t.name==='Trait du Silence').effect,/1 PA/);
const registry=getTalentRegistry();
for(const t of talents.filter(t=>t.effectDetails))assert.equal(registry.find(r=>r.natureId==='aseryn'&&r.talentId===t.id).mechanics,t.effectDetails);
assert.equal(Object.keys(mageRevisions).length,12);
for(const t of terraUmbraTruthRules.catalogs.mage){assert.ok(t.effectDetails);assert.equal(registry.find(r=>r.natureId==='mage'&&r.talentId===t.id).mechanics,t.effectDetails);}
assert.match(terraUmbraTruthRules.catalogs.mage.find(t=>t.name==='Ancrage du Mageius').effect,/concentration/);
assert.equal(normalizeMageTechniques({echo:{approved:true}}).echo.approved,undefined);
assert.equal(Object.keys(daemonRevisions).length,62);
const daemons=terraUmbraTruthRules.catalogs.daemon;assert.equal(daemons.length,142);
assert.equal(daemons.find(t=>t.name==='Appel du Prophète').cost,1);assert.equal(daemons.find(t=>t.name==='Dernière destination').cost,2);
assert.equal(daemons.find(t=>t.id===ids.remanence).cost,2);
for(const id of Object.keys(daemonRevisions)){const t=daemons.find(t=>t.id===id);assert.equal(registry.find(r=>r.natureId==='daemon'&&r.talentId===id).mechanics,t.effectDetails);}
assert.equal(normalizeDaemonBuild({approved:true,xpEarned:500}).approved,undefined);
assert.match(daemons.find(t=>t.name==='Arc céleste').effect,/fois par round/);
assert.match(daemons.find(t=>t.name==='Loi du Juge').effect,/3 PV irréductibles/);
assert.equal(terraUmbraTruthRules.catalogs.angelus.length,114);assert.equal(terraUmbraTruthRules.corruption.talents.length,227);
console.log('DAEMON TALENTS LIVE OK — exact public build, 62 approved revisions, 79 unchanged, Remanence, complete Compendium and saved options; Mage/Aseryn, 88 equipment filters and private/reward protections retained; no production database writes');
NODE
printf '%s\n' "$sha" > "$root/.production-release-sha"
touch "$stage/deployed.ok"
trap - EXIT
printf 'PRODUCTION DAEMON TALENTS RELEASE OK — %s\n' "$sha"
