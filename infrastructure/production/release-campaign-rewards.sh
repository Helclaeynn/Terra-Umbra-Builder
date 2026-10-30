#!/usr/bin/env bash
# Authorized release of GM-only campaign rewards. Never restarts db or caddy.
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
mode=${2:-deploy}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || exit 1
root=/opt/terra-umbra
stage="$root/releases/campaign-$sha"
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
  echo 'Previous application restored. Compatible additive reward tables and user records preserved.'
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
migration=infrastructure/migrations/20260928_campaign_rewards.sql
test -f "$stage/new/$migration"
test -f "$stage/new/apps/api/src/campaign-rewards.ts"
test -f "$stage/new/apps/web/src/components/CampaignRewards.vue"
if test -f "$root/$migration"; then cmp "$stage/new/$migration" "$root/$migration"; fi
docker load --input "$stage/images.tar.gz"
for component in api web; do
  test "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "tuc-v2-$component:campaign-$sha")" = "$sha"
  image_id "$component" > "$stage/previous-$component-image"
  docker tag "$(cat "$stage/previous-$component-image")" "tuc-v2-$component:before-campaign-$sha"
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
    echo 'CAMPAIGN RELEASE FAILED — application restored; additive schema and user data retained.' >&2
    exit "$status"
  fi
}
trap rollback_on_error EXIT
# Apply only the reviewed additive SQL, transactionally, using existing DB configuration.
# There is no production fixture or reward write in deployment checks.
docker compose exec -T api node --input-type=module -e "import {readFileSync} from 'node:fs';import {pool} from './dist/db.js';try{await pool.query(readFileSync(0,'utf8'));console.log('ADDITIVE REWARD LEDGER MIGRATION OK');}finally{await pool.end();}" < "$stage/new/$migration"
mkdir -p "$root/infrastructure/migrations"
cp "$stage/new/$migration" "$root/$migration"
for component in api web; do
  test ! -e "$stage/previous-$component"
  mv "$root/apps/$component" "$stage/previous-$component"
  mv "$stage/new/apps/$component" "$root/apps/$component"
done
images_changed=true
docker tag "tuc-v2-api:campaign-$sha" tuc-v2-api:latest
docker tag "tuc-v2-web:campaign-$sha" tuc-v2-web:latest
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
import {pool} from './dist/db.js';
import {campaignRewardViolation} from './dist/campaign-reward-guard.js';
import {validateCampaignRewards} from './dist/campaign-rewards.js';
const base='https://terra-umbra.fr';
const response=await fetch(base+'/build-info.json?release='+process.env.EXPECTED_SHA,{signal:AbortSignal.timeout(15000)});
assert.equal(response.status,200);assert.equal((await response.json()).commit,process.env.EXPECTED_SHA);
const path='/api/campaigns/11111111-1111-4111-8111-111111111111/rewards';
for(const method of ['GET','POST'])assert.equal((await fetch(base+path,{method,signal:AbortSignal.timeout(15000)})).status,401,'GM rewards remain authenticated');
assert.equal((await fetch(base+'/api/characters',{signal:AbortSignal.timeout(15000)})).status,401);
assert.equal((await fetch(base+'/api/rulesets/terra-umbra/creation',{signal:AbortSignal.timeout(15000)})).status,401);
const seed={progression:{xpEarned:4,ptvEarned:2,renownAdjustment:1,cashBase:0,cashTransactions:[]},truth:{},reality:{equipment:[],augmentations:[]}};
const forged=structuredClone(seed);forged.progression.renownAdjustment=2;
assert.equal(campaignRewardViolation(seed,forged),'renown');
assert.equal(validateCampaignRewards({}),null);
try{
  const result=await pool.query("SELECT to_regclass('public.campaign_reward_batches')::text AS batches,to_regclass('public.campaign_reward_grants')::text AS grants");
  assert.ok(result.rows[0].batches&&result.rows[0].grants);
}finally{await pool.end();}
console.log('CAMPAIGN LIVE OK — exact public build, loaded server renown guard, reward endpoints authenticated and additive ledger present; no account or character modified by smoke tests');
NODE
printf '%s\n' "$sha" > "$root/.production-release-sha"
touch "$stage/deployed.ok"
trap - EXIT
printf 'PRODUCTION CAMPAIGN RELEASE OK — %s\n' "$sha"
