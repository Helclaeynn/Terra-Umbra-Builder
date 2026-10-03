#!/usr/bin/env bash
set -euo pipefail
root=/opt/terra-umbra
test -f "$root/production-active"
exec 9>"$root/.production-release.lock"
flock -n 9
cd "$root/infrastructure"
state_before=$(docker ps -a --no-trunc --format '{{.ID}} {{.Image}} {{.Status}}' | sed 's/ Up .*$/ Up/' | sort)
volumes_before=$(docker volume ls -q | sort)
free_before=$(df -PB1 "$root" | awk 'NR==2 {print $4}')
echo 'Disk usage before cleanup:'
df -h "$root"
docker system df
# Only reproducible, unused build cache. No volume, backup, source or image removal.
docker builder prune --all --force --keep-storage 512MB </dev/null
free_after=$(df -PB1 "$root" | awk 'NR==2 {print $4}')
test "$volumes_before" = "$(docker volume ls -q | sort)"
test "$state_before" = "$(docker ps -a --no-trunc --format '{{.ID}} {{.Image}} {{.Status}}' | sed 's/ Up .*$/ Up/' | sort)"
curl --fail --silent --show-error --max-time 30 https://terra-umbra.fr/api/health >/dev/null
echo "PLAYTEST CACHE CLEANUP VERIFIED — before=$free_before after=$free_after reclaimed=$((free_after-free_before)) bytes"
df -h "$root"
[ "$free_after" -ge 2147483648 ] || { echo 'Less than 2 GiB free; stop before transfer and deployment for further reviewed cleanup.' >&2; exit 1; }
