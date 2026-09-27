#!/usr/bin/env bash
# Run only after the root and www DNS records point to the same VPS as dev.
set -euo pipefail
umask 077
cd /opt/terra-umbra/infrastructure
if [ -f /opt/terra-umbra/production-active ]; then
  echo 'Production is already active; use a reviewed production release instead of repeating cutover.' >&2
  exit 1
fi
python3 - <<'PY'
import socket
addresses=lambda host:{row[4][0] for row in socket.getaddrinfo(host,443,type=socket.SOCK_STREAM)}
dev=addresses('dev.terra-umbra.fr')
for host in ('terra-umbra.fr','www.terra-umbra.fr'):
    found=addresses(host)
    if not found or not found.issubset(dev):
        raise SystemExit('DNS NOT READY: '+host+' does not exclusively resolve to the dev VPS')
print('DNS READY — root and www resolve to the existing VPS')
PY
# No builds, database imports, migrations or volume replacements during promotion.
bash production/backup.sh
backup_dir=$(cat /opt/terra-umbra/private-backups/latest-verified)
docker compose exec -T caddy caddy validate --config /dev/stdin --adapter caddyfile < production/Caddyfile
rollback() {
  cutover_status=$?
  if [ "$cutover_status" -ne 0 ]; then
    rollback_ok=true
    cp "$backup_dir/.env" .env || rollback_ok=false
    cat "$backup_dir/Caddyfile" > Caddyfile || rollback_ok=false
    docker compose up -d --no-build --no-deps api || rollback_ok=false
    docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile || rollback_ok=false
    if [ "$rollback_ok" = true ]; then
      rm -f /opt/terra-umbra/production-active
      echo 'CUTOVER FAILED — previous host configuration restored; database and media retained' >&2
    else
      echo 'CUTOVER FAILED — rollback incomplete; deployment lock retained; manual recovery required' >&2
    fi
    exit "$cutover_status"
  fi
}
trap rollback EXIT
# This lock disables automatic dev deployments before the production endpoint opens.
touch /opt/terra-umbra/production-active
python3 - <<'PY'
from pathlib import Path
p=Path('.env'); lines=p.read_text().splitlines()
lines=[line for line in lines if not line.startswith('APP_BASE_URL=')]
p.write_text('\n'.join(lines+['APP_BASE_URL=https://terra-umbra.fr'])+'\n')
PY
docker compose up -d --no-build --no-deps api
# Write in place: the running Caddy container has a bind mount of this file.
cat production/Caddyfile > Caddyfile
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
ready=false
for attempt in $(seq 1 36); do
  if curl --fail --silent --show-error --max-time 10 https://terra-umbra.fr/api/health >/dev/null; then
    ready=true
    break
  fi
  sleep 5
done
[ "$ready" = true ]
python3 - <<'PY'
import urllib.request,urllib.error,json
base='https://terra-umbra.fr'
with urllib.request.urlopen(base+'/api/health',timeout=20) as r:
    assert json.load(r)['status']=='ok'
    assert r.headers.get('Strict-Transport-Security')
for path in ['/api/admin/users','/api/characters','/api/campaigns']:
    try:
        urllib.request.urlopen(base+path,timeout=20)
        raise AssertionError('Unauthenticated private endpoint accessible: '+path)
    except urllib.error.HTTPError as e:
        assert e.code==401,(path,e.code)
for origin in ['http://terra-umbra.fr','https://www.terra-umbra.fr','https://dev.terra-umbra.fr']:
    with urllib.request.urlopen(origin+'/account',timeout=20) as r:
        assert r.url==base+'/account',(origin,r.url)
print('PRODUCTION HTTPS OK — health, redirects and anonymous private API denial')
PY
trap - EXIT
echo 'PRODUCTION ACTIVE — existing PostgreSQL and editor-media volumes preserved'
