#!/usr/bin/env bash
# Web-only atlas release; API, database, media and reverse proxy are untouched.
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
base=${2:?Published base SHA required}
[[ "$sha" =~ ^[0-9a-f]{40}$ && "$base" =~ ^[0-9a-f]{40}$ ]]
root=/opt/terra-umbra
stage="$root/releases/atlas-$sha"
test -f "$root/production-active"
exec 9>"$root/.production-release.lock"
flock -n 9 || { echo 'Another production release is running.' >&2; exit 1; }
cd "$root/infrastructure"
current=$(curl -fsS --max-time 20 https://terra-umbra.fr/build-info.json | python3 -c 'import json,sys; print(json.load(sys.stdin)["commit"])')
test "$current" = "$base" || { echo 'Published version changed; atlas must be rebuilt on the new base.' >&2; exit 1; }
(cd "$stage" && sha256sum --check SHA256SUMS)
available=$(df -B1 --output=avail "$root" | tail -1)
# The archives have already been transferred. Do not reserve their space twice.
remaining_required=$(( $(cat "$stage/required-bytes.txt") - $(du -sb "$stage" | cut -f1) ))
test "$remaining_required" -gt 0
echo "Release disk check: $available bytes available, $remaining_required still required."
test "$available" -gt "$remaining_required" || { echo 'Not enough space to unpack safely.' >&2; exit 1; }
previous=$(docker inspect --format '{{.Image}}' "$(docker compose ps -q web)")
api_before=$(docker inspect --format '{{.Image}}' "$(docker compose ps -q api)")
printf '%s\n' "$previous" > "$stage/previous-web-image"
docker tag "$previous" "tuc-v2-web:before-atlas-$sha"
docker load -i "$stage/web.tar.gz"
test "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "tuc-v2-web:atlas-$sha")" = "$sha"
mkdir -p "$stage/new"
tar -xzf "$stage/web-source.tar.gz" -C "$stage/new" --no-same-owner
test -f "$stage/new/web/src/pages/AtlasPage.vue"
test -f "$stage/new/web/public/map-assets/v1/la-ecran.jpg"
changed=false
rollback(){
  status=$?
  if [ "$status" -ne 0 ] && [ "$changed" = true ]; then
    docker tag "$previous" tuc-v2-web:latest
    docker compose up -d --no-build --no-deps --force-recreate web
    if test -d "$stage/previous-web"; then
      mv "$root/apps/web" "$stage/failed-web"
      mv "$stage/previous-web" "$root/apps/web"
    fi
    echo 'Atlas release failed; previous website restored.' >&2
  fi
  exit "$status"
}
trap rollback EXIT
changed=true
docker tag "tuc-v2-web:atlas-$sha" tuc-v2-web:latest
docker compose up -d --no-build --no-deps --force-recreate web
ready=false
for attempt in $(seq 1 24); do
  live=$(curl -fsS --max-time 10 https://terra-umbra.fr/build-info.json 2>/dev/null || true)
  if printf '%s' "$live" | python3 -c 'import json,sys; assert json.load(sys.stdin)["commit"]==sys.argv[1]' "$sha" 2>/dev/null; then ready=true; break; fi
  sleep 3
done
test "$ready" = true
curl -fsS --max-time 20 https://terra-umbra.fr/atlas | grep -q '<div id="app">'
curl -fsS --max-time 20 https://terra-umbra.fr/api/health >/dev/null
for asset in la-ecran.jpg californie-ecran.jpg la-impression.jpg reserve-impression.jpg; do
  curl -fsSI --max-time 20 "https://terra-umbra.fr/map-assets/v1/$asset" | grep -qi 'content-type: image/jpeg'
done
test "$(docker inspect --format '{{.Image}}' "$(docker compose ps -q api)")" = "$api_before"
mv "$root/apps/web" "$stage/previous-web"
mv "$stage/new/web" "$root/apps/web"
# Separate marker: the global/API release marker continues to identify its own version.
printf '%s\n' "$sha" > "$root/.production-web-release-sha"
touch "$stage/deployed.ok"
trap - EXIT
echo "ATLAS LIVE VERIFIED — $sha, base $base; previous web retained for rollback."
