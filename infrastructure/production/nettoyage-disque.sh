#!/usr/bin/env bash
# Nettoyage du disque du VPS (30/10/2026).
# Supprime ce qui se reconstruit depuis Git : les anciens dossiers de release
# et les anciennes images Docker. Garde ce qui tourne, et une image de retour
# arrière (web avant pdf-packs, api avant pnj-merges) avec leurs dossiers.
# Ne touche ni à la base, ni aux volumes, ni aux sauvegardes.
set -euo pipefail
cd /opt/terra-umbra

echo "Avant : $(df -h / | awk 'NR==2{print $4" libres ("$5" utilisés)"}')"

# Garde-fou : une sauvegarde vérifiée de moins de 24 h doit exister.
latest=$(cat private-backups/latest-verified)
if [ -z "$(find "$latest" -maxdepth 0 -mmin -1440)" ]; then
  echo "Pas de sauvegarde vérifiée de moins de 24 h : arrêt." >&2
  exit 1
fi

# 1. Anciens dossiers de release (sources tirées de commits déjà dans Git).
for dir in releases/*/; do
  case "$dir" in
    releases/pdf-packs-82129cd2*|releases/pnj-merges-1d8628f5*) continue ;;
  esac
  rm -rf -- "$dir"
done

# 2. Anciennes images : on garde celles qui tournent et un retour arrière.
docker images --format '{{.Repository}}:{{.Tag}}' \
  | grep -E '^tuc-v2-(web|api):' \
  | grep -vE ':(latest|before-pdf-packs-82129cd2.*|before-pnj-merges-1d8628f5f786)$' \
  | xargs -r docker rmi
docker image prune -f >/dev/null

echo "Après : $(df -h / | awk 'NR==2{print $4" libres ("$5" utilisés)"}')"
docker ps --format '{{.Names}} : {{.Status}}'
