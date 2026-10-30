#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/terra-umbra/infrastructure
set -a
. ./.env
set +a
backup_root=/opt/terra-umbra/private-backups
mkdir -p "$backup_root"
chmod 700 "$backup_root"
backup_dir="$backup_root/pre-production-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -m 700 "$backup_dir"
docker compose exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom > "$backup_dir/database.dump"
docker compose exec -T api tar -C /app/editor-media -czf - . > "$backup_dir/editor-media.tar.gz"
cp .env Caddyfile docker-compose.yml "$backup_dir/"
tar -tzf "$backup_dir/editor-media.tar.gz" >/dev/null
restore_db="tuc_restore_check_$(date +%s)"
cleanup() {
  docker compose exec -T db dropdb -U "$POSTGRES_USER" --if-exists "$restore_db" >/dev/null 2>&1 || true
}
trap cleanup EXIT
docker compose exec -T db createdb -U "$POSTGRES_USER" "$restore_db"
docker compose exec -T db pg_restore -U "$POSTGRES_USER" -d "$restore_db" --exit-on-error --no-owner < "$backup_dir/database.dump"
docker compose exec -T db psql -U "$POSTGRES_USER" -d "$restore_db" -At -v ON_ERROR_STOP=1 <<'SQL'
SELECT 'RESTORED users='||count(*) FROM users;
SELECT 'RESTORED characters='||count(*) FROM characters;
SELECT 'RESTORED campaigns='||count(*) FROM campaigns;
SELECT 'RESTORED edited_articles='||count(*) FROM compendium_article_edits;
SELECT 'RESTORED custom_articles='||count(*) FROM compendium_custom_articles;
SELECT 'RESTORED portrait_visibility='||count(*) FROM compendium_portrait_visibility;
SQL
(
  cd "$backup_dir"
  sha256sum database.dump editor-media.tar.gz > SHA256SUMS
  sha256sum --check SHA256SUMS
)
printf '%s\n' "$backup_dir" > "$backup_root/latest-verified"
printf 'BACKUP VERIFIED — %s (private server storage; successful PostgreSQL restore)\n' "$backup_dir"
