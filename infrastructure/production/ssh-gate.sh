#!/usr/bin/env bash
# Portier SSH de la clé GitHub (« github-tuc-v2 »), installé hors du dépôt dans
# /usr/local/bin/terra-umbra-ssh-gate et imposé par authorized_keys :
#   restrict,command="/usr/local/bin/terra-umbra-ssh-gate" ssh-ed25519 … github-tuc-v2
# La clé ne peut ni ouvrir de session ni lancer une commande libre. Trois ordres
# seulement, ceux des workflows deploy.yml et deploy-recette.yml :
#   upload incoming-<sha>.tar.gz   (archive lue sur l'entrée standard)
#   upload recette-<sha>.tar.gz
#   deploy <sha>                   (mise en ligne de la production)
#   recette <sha> <0|1>            (mise à l'essai ; 1 = recopier les données)
# Le script de déploiement est celui de l'archive du commit, comme avant.
set -euo pipefail
releases=/opt/terra-umbra/releases
read -r -a args <<<"${SSH_ORIGINAL_COMMAND:-}"

refuse() { echo "Commande refusée : ${SSH_ORIGINAL_COMMAND:-(vide)}" >&2; exit 1; }
run_from_archive() {
  local archive=$1 script=$2
  shift 2
  test -f "$archive" || { echo "Archive absente : $archive" >&2; exit 1; }
  # Variable globale : le piège EXIT la lit après la fin de la fonction.
  gate_tmp=$(mktemp -d)
  trap 'rm -rf "$gate_tmp"' EXIT
  tar -xzf "$archive" -C "$gate_tmp" "$script"
  bash "$gate_tmp/$script" "$@"
}

case "${args[0]:-}" in
  upload)
    [[ ${#args[@]} -eq 2 && "${args[1]}" =~ ^(incoming|recette)-[0-9a-f]{40}\.tar\.gz$ ]] || refuse
    cat > "$releases/${args[1]}"
    ;;
  deploy)
    [[ ${#args[@]} -eq 2 && "${args[1]}" =~ ^[0-9a-f]{40}$ ]] || refuse
    run_from_archive "$releases/incoming-${args[1]}.tar.gz" infrastructure/production/deploy.sh \
      "${args[1]}" "$releases/incoming-${args[1]}.tar.gz"
    ;;
  recette)
    [[ ${#args[@]} -eq 3 && "${args[1]}" =~ ^[0-9a-f]{40}$ && "${args[2]}" =~ ^[01]$ ]] || refuse
    REFRESH_DATA=${args[2]} run_from_archive "$releases/recette-${args[1]}.tar.gz" infrastructure/recette/deploy-recette.sh \
      "${args[1]}" "$releases/recette-${args[1]}.tar.gz"
    ;;
  *)
    refuse
    ;;
esac
