#!/usr/bin/env bash
# Authorized release of the approved Vampire talents and saved configurations. No schema migration; never restarts db or caddy.
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
mode=${2:-deploy}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || exit 1
root=/opt/terra-umbra
stage="$root/releases/hunter-$sha"
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
test -f "$stage/new/apps/web/src/lib/angelus.ts"
test -f "$stage/new/apps/api/src/rules/truth/angelus-revision.ts"
test -f "$stage/new/apps/api/src/rules/truth/extral-revision.ts"
test -f "$stage/new/apps/web/src/lib/extral.ts"
test -f "$stage/new/apps/api/src/rules/truth/exile-revision.ts"
test -f "$stage/new/apps/web/src/components/builder/ExileOptions.vue"
test -f "$stage/new/apps/api/src/rules/truth/vampire-revision.ts"
test -f "$stage/new/apps/api/src/rules/truth/hunter-revision.ts"
test -f "$stage/new/apps/web/src/components/builder/TruthBuildChoices.vue"
docker load --input "$stage/images.tar.gz"
for component in api web; do
  test "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "tuc-v2-$component:hunter-$sha")" = "$sha"
  image_id "$component" > "$stage/previous-$component-image"
  docker tag "$(cat "$stage/previous-$component-image")" "tuc-v2-$component:before-hunter-$sha"
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
    echo 'HUNTER BUILDER RELEASE FAILED — application restored; database and user data retained.' >&2
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
docker tag "tuc-v2-api:hunter-$sha" tuc-v2-api:latest
docker tag "tuc-v2-web:hunter-$sha" tuc-v2-web:latest
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
assert.equal(terraUmbraTruthRules.catalogs.humain.length,266);
assert.equal(terraUmbraTruthRules.catalogs.humain.reduce((n,t)=>n+t.cost,0),525);
assert.match(terraUmbraTruthRules.catalogs.humain.find(t=>t.name==='Saignée noire').effectDetails,/Sang entier est éteint/);
assert.equal(terraUmbraTruthRules.catalogs.vampire.length,71);
assert.match(terraUmbraTruthRules.catalogs.vampire.find(t=>t.id==='domination').effectDetails,/Défense occulte/);
import {daemonRevisions} from './dist/rules/truth/daemon-revision.js';
import {normalizeDaemonBuild,daemonTalentIds as ids} from './dist/rules/truth/daemon-build.js';
import {aserynRevisions} from './dist/rules/truth/aseryn-revision.js';
import {mageRevisions} from './dist/rules/truth/mage-revision.js';
import {normalizeMageTechniques} from './dist/rules/truth/mage-techniques.js';
import {angelusRevisions} from './dist/rules/truth/angelus-revision.js';
import {angelusTalentIds as angelIds,angelusAuraCapacity,normalizeAngelusBuild,angelusSins} from './dist/rules/truth/angelus-build.js';
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
const angels=terraUmbraTruthRules.catalogs.angelus;
assert.equal(Object.keys(angelusRevisions).length,55);assert.equal(angels.length,114);
for(const id of Object.keys(angelusRevisions)){const t=angels.find(t=>t.id===id);assert.equal(registry.find(r=>r.natureId==='angelus'&&r.talentId===id).mechanics,t.effectDetails);}
assert.equal(angels.find(t=>t.id===angelIds.liaison).name,'Liaison céleste');
assert.equal(angelusAuraCapacity([angelIds.reserve],5).maximum,10);assert.equal(angelusAuraCapacity([angelIds.cherub,angelIds.reserve],5).maximum,12);
for(const [name,cost] of [['Proportion',1],['Inarrêtable',2],['Extase apaisante',1],['Prison onirique',2]])assert.equal(angels.find(t=>t.name===name).cost,cost);
assert.equal(normalizeAngelusBuild({approved:true,xpEarned:500}).approved,undefined);assert.equal(angelusSins.length,7);
const {extralRevisions}=await import('./dist/rules/truth/extral-revision.js');
const {normalizeExtralBuild,extralTalentIds:extralIds}=await import('./dist/rules/truth/extral-build.js');
const extrals=terraUmbraTruthRules.catalogs.extral;
assert.equal(extrals.length,162);assert.equal(extralRevisions.length,97);
for(const revision of extralRevisions){const talent=extrals.find(t=>t.id===revision.id);assert.ok(talent.effectDetails);assert.equal(registry.find(r=>r.natureId==='extral'&&r.talentId===talent.id).mechanics,talent.effectDetails);}
for(const id of [extralIds.repair,extralIds.reserve]){const t=extrals.find(t=>t.id===id);assert.match(t.effect,/fois par scénario/);assert.match(t.activation,/1\/scénario/);}
assert.match(extrals.find(t=>t.id===extralIds.repair).effect,/6 PV/);
assert.match(extrals.find(t=>t.id===extralIds.reserve).effect,/3 PV/);
assert.equal(extrals.find(t=>t.id==='extral-heritage-recombine').cost,1);
assert.equal(extrals.find(t=>t.id==='extral-projection-de-masse').prerequisiteName,'');
const choices=terraUmbraTruthRules.structure.natures.extral.choices.find(c=>c.key==='network').optionsBy;
assert.ok(choices.rocreen.some(c=>c.id==='shaediri'));assert.ok(choices.thalsios.some(c=>c.id==='hydroguard'));assert.ok(choices.talass.some(c=>c.id==='emeraude'));
const normalized=normalizeExtralBuild({repairUsed:true,reserveUsed:true,approved:true,xpEarned:999});
assert.equal(normalized.repairUsed,true);assert.equal(normalized.reserveUsed,true);assert.equal(normalized.approved,undefined);assert.equal(normalized.xpEarned,undefined);
const {exileRevisions}=await import('./dist/rules/truth/exile-revision.js');
const {normalizeExileBuild,normalizeBeneficiaryBenefits,exileTalentIds:exileIds}=await import('./dist/rules/truth/exile-build.js');
const exiles=terraUmbraTruthRules.catalogs.exile;
assert.equal(exiles.length,184);assert.equal(exileRevisions.length,102);
for(const t of exiles){assert.ok(t.effectDetails);assert.equal(registry.find(r=>r.natureId==='exile'&&r.talentId===t.id).mechanics,t.effectDetails);}
assert.equal(exiles.find(t=>t.id===exileIds.hdp).prerequisite,exileIds.hdb);
assert.match(exiles.find(t=>t.id===exileIds.healing).effect,/4 \+ DR PV/);
assert.match(exiles.find(t=>t.id===exileIds.healing).activation,/scénario\/bénéficiaire/);
assert.match(exiles.find(t=>t.id===exileIds.guard).effectDetails,/bénéficiaire/);
assert.match(exiles.find(t=>t.id==='exile-fiabilisation').effectDetails,/corriger durablement/);
assert.equal(exiles.find(t=>t.id==='exile-reflexe-de-grace').cost,2);
assert.equal(normalizeExileBuild({approved:true,xpEarned:999}).approved,undefined);
assert.deepEqual(normalizeBeneficiaryBenefits({refectionReceived:true,guardReceived:true,role:'gm'}),{scenario:'',refectionReceived:true,guardReceived:true,refectionSource:'',guardSource:''});
const {khinaeRevisions}=await import('./dist/rules/truth/khinae-revision.js');
assert.equal(khinaeRevisions.length,88);assert.equal(terraUmbraTruthRules.catalogs.garou.length,68);assert.equal(terraUmbraTruthRules.catalogs.khinae.length,68);
for(const nature of ['garou','khinae'])for(const t of terraUmbraTruthRules.catalogs[nature]){assert.ok(t.effectDetails);if(t.prerequisite)assert.ok(terraUmbraTruthRules.catalogs[nature].some(p=>p.id===t.prerequisite));}
console.log('HUNTER BUILDER LIVE OK — 136 stable IDs and approved rules');
console.log('EXILE TALENTS LIVE OK — 184 stable IDs, 102 approved definitions, complete full rules, structured runes/HDP, scenario-limited received benefits, previous Natures and real account protection intact');

console.log('EXTRAL TALENTS LIVE OK — 162 stable IDs, 97 approved definitions, scenario-limited nanites, repaired network choices, preserved prior Natures and no production database writes');

console.log('ANGELUS TALENTS LIVE OK — exact public build, 55 revisions, 59 unchanged, Liaison, four discounts, Chérubin, Aura, seven sins and Yessod; prior talents, equipment and reward guards preserved; no production database writes');
NODE
printf '%s\n' "$sha" > "$root/.production-release-sha"
touch "$stage/deployed.ok"
trap - EXIT
printf 'PRODUCTION HUNTER BUILDER RELEASE OK — %s\n' "$sha"
