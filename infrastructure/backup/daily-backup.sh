#!/usr/bin/env bash
# Sauvegarde quotidienne : appelle backup.sh (dump, médias, restauration témoin,
# empreintes), puis garde seulement les sauvegardes récentes sur le VPS.
# La copie hors serveur est récupérée par le PC de l'auteur (pull-backups-windows.ps1).
set -euo pipefail
umask 077
backup_root=/opt/terra-umbra/private-backups
keep_min=7          # nombre minimal de sauvegardes conservées sur le VPS
keep_days=14        # au-delà de ce nombre, on supprime ce qui a plus de 14 jours

exec 9>/opt/terra-umbra/.backup.lock
flock -n 9 || { echo "Une sauvegarde est déjà en cours" >&2; exit 1; }

bash /opt/terra-umbra/infrastructure/production/backup.sh

latest=$(cat "$backup_root/latest-verified")
mapfile -t dirs < <(find "$backup_root" -maxdepth 1 -mindepth 1 -type d -name 'pre-production-*' -printf '%T@ %p\n' | sort -rn | cut -d' ' -f2-)
count=0
for dir in "${dirs[@]}"; do
  count=$((count + 1))
  [ "$dir" = "$latest" ] && continue
  [ "$count" -le "$keep_min" ] && continue
  if [ -n "$(find "$dir" -maxdepth 0 -mtime +"$keep_days")" ]; then
    rm -rf -- "$dir"
    echo "Supprimée (ancienne) : $dir"
  fi
done
echo "Sauvegardes conservées sur le VPS : $(find "$backup_root" -maxdepth 1 -mindepth 1 -type d -name 'pre-production-*' | wc -l)"
