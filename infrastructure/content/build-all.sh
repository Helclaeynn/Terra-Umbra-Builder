#!/usr/bin/env bash
# Régénère tous les fichiers infrastructure/content/*.sql depuis les lots et les
# catalogues de l'API. À lancer depuis la racine du dépôt après toute
# modification d'un lot ou d'un catalogue :
#   bash infrastructure/content/build-all.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
export TUC_TRUTH_EQUIPMENT_SOURCE=compendium/source/verite-catalog-v6.json.gz.b64
for generator in vampire garou khinae natures objets realite; do
  node --import ./infrastructure/content/ts-register.mjs "infrastructure/content/build-$generator.mjs"
done
