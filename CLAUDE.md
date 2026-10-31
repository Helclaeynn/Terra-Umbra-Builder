# Terra Umbra — mémoire de travail pour Claude

Lu automatiquement à l'ouverture d'une session dans ce dépôt. À tenir à jour à la fin de chaque étape.

## L'auteur
- Quentin (Helclaeynn), auteur de Terra Umbra California. Écrire en français et le tutoyer.
- Il veut de l'autonomie : avancer, appliquer par défaut, ne poser que les questions qui lui reviennent (au plus 3 à 5, avec une recommandation).
- Messages courts et clairs : ce qui est fait, ce qui suit, ce qu'on attend de lui. Pas de multiplication de documents.
- Pas de jargon (branche, PR, worktree, workflow…) : dire en mots simples ce que ça change pour lui. Quand il doit agir, donner des étapes numérotées, clic par clic.
- Pas de `gh` sur son PC, et le navigateur intégré n'est pas connecté à GitHub : pour une PR, lui donner le lien et les clics, puis vérifier soi-même le résultat via l'API publique (le dépôt est public).

## Ordre d'autorité
1. Dernière décision explicite de l'auteur.
2. `docs/audit-game-design/README.md` (charte des décisions 1 à 22, état d'avancement).
3. Les lots `docs/audit-game-design/lots/01` à `16` : refonte des talents en voies à paliers, terminée.

Les passations des agents précédents décrivent **l'existant**, pas ce qu'il faut suivre.

## Branches
- Production : `main` (V2, terra-umbra.fr), depuis le 31/10. `feature/tuc-web-v2` est l'ancienne branche de production, à ne plus utiliser. La V1 complète est sous l'étiquette `v1-finale`.
- Mettre en ligne : fusionner dans `main`, attendre que « TUC Web V2 dev » réussisse, puis lancer « Mise en ligne » (`gh workflow run deploy.yml --ref main`). Mettre à l'essai : `gh workflow run deploy-recette.yml --ref <branche>` (option `-f refresh_data=true` pour recopier les données).
- **Délégation (31/10)** : l'auteur délègue à Claude les fusions dans `main`, les mises en ligne, les mises à l'essai et l'exploitation du VPS, jusqu'à nouvel ordre. `gh` est connecté sur son PC (`/c/Program Files/GitHub CLI`, à ajouter au PATH dans Git Bash) ; permissions dans `.claude/settings.local.json` (copie de `H:\TerraUmbra\delegation-claude.json`). Toujours lui demander avant toute suppression de données, et lui rendre compte simplement.
- Travail en cours : `docs/audit-game-design-bb4kqb` (en retard sur `main` : y fusionner `main` avant de toucher au code).

## Décisions techniques (31/10)
- Pas de second VPS. La recette tourne sur le même VPS OVH, en seconde pile Compose, une fois le disque nettoyé.
- La V1 (GitHub Pages) ne reste pas en ligne : elle passe dans `legacy/`, et `feature/tuc-web-v2` devient `main`.
- Fin des releases par overlay : un seul déploiement, reconstruit depuis Git.
- Sauvegardes : `infrastructure/backup/daily-backup.sh` sur le VPS, copie sur le PC de l'auteur (disque H) avec `pull-backups-windows.ps1`.
- Pas de changement de langage. Le contenu passe en base (`docs/audit-game-design/schema-contenu.md`), le CMS se choisit ensuite.

## Pièges
- Workflows actifs : `v2-dev.yml` (contrôles sur `main` ; ne déploie pas, la production est protégée par `/opt/terra-umbra/production-active`), `deploy.yml` et `deploy-recette.yml` (manuels).
- Le `Caddyfile` de production vient de `infrastructure/production/Caddyfile` à chaque mise en ligne : toute modification à la main sur le VPS est écrasée. Les anciens sont dans `.github/workflows-archive/` : ne jamais les remettre dans `.github/workflows/`.
- Pousser une étiquette sur un ancien commit relance les workflows de ce commit.
- Les fiches enregistrent les talents par identifiant : ne jamais changer un identifiant existant.
- Accès VPS : `ssh -i ~/.ssh/terra_umbra debian@terra-umbra.fr` (clé sans phrase secrète, `sudo` sans mot de passe ; `tuc_vps` a une phrase secrète, inutilisable par Claude). Pas de `cron` sur le VPS : utiliser systemd.
- VPS : 40 Go de disque, 52 % le 31/10 avec les deux piles. `deploy.sh` range lui-même (garde la version en ligne et une de retour arrière) et refuse de tourner sous 10 Go libres. Ne jamais lancer `docker system prune -a --volumes`.

## Plan
1. ~~Archiver les 76 workflows ponctuels~~ : fait. Déplacés dans `.github/workflows-archive/` et fusionnés en production le 30/10 (PR #23) ; aucun job lancé. Seul `v2-dev.yml` reste actif.
2. ~~Installer la sauvegarde quotidienne et la copie sur H~~ : serveur fait le 30/10 (minuteur systemd 4 h 17, testé). Copie sur H : tâche planifiée Windows « Terra Umbra - copie des sauvegardes » (9 h), script dans `H:\TerraUmbra\`. Les sauvegardes contiennent le `.env` : jamais dans un dossier synchronisé.
3. ~~Relever ce qui tourne en production, le ramener dans Git, nettoyer le disque~~ : fait le 30/10, disque passé de 96 % à 37 % (24 Go libres), site vérifié. Relevé : les 48 dossiers de release viennent de commits déjà dans `feature/tuc-web-v2` ; les fichiers du serveur sont des versions égales ou plus anciennes que Git, sauf le `Caddyfile` de production (HTTP/3 coupé), ramené dans `infrastructure/production/Caddyfile`. Nettoyage : `infrastructure/production/nettoyage-disque.sh` (déposé sur le VPS, testé à blanc : 46 dossiers, 15 Go, et 64 images ; garde ce qui tourne et un retour arrière), à lancer par l'auteur.
4. ~~Fusionner dans `main`, couper Pages, un seul déploiement, Prettier/ESLint, limite de débit~~ : fait le 31/10. `main` = production (PR #24, #25, #26), Pages coupé, V1 dans `legacy/`. Première mise en ligne depuis Git réussie (commit `a1abeef8`, bouton `deploy.yml` → `infrastructure/production/deploy.sh`) : site, API et compendium vérifiés, limite de connexion vérifiée (429 au 9e essai), 34 migrations inscrites dans `deploy_migrations`. ESLint/Prettier dans `apps/api` seulement (correction, pas de style imposé) ; le front n'a pas encore ESLint. `apps/web/Dockerfile` réparé (il ne construisait plus depuis Git).
5. ~~Monter la recette sur le même VPS~~ : fait le 31/10 (PR #27, mise en ligne `abaa1026`, bouton « Mise à l'essai » testé). Pile `tuc-recette` (`infrastructure/recette/`, dossier `/opt/terra-umbra/recette` sur le VPS) déjà démarrée avec une copie de la sauvegarde ; aucun e-mail ; services nommés `recette-*` (sur le réseau partagé avec Caddy, `api`/`web` désignent la production). Adresse : `dev.terra-umbra.fr` derrière un mot de passe (identifiant `recette`, mot de passe dans `/opt/terra-umbra/secrets/recette-acces.txt` et `H:\TerraUmbra\recette-acces.txt`). Bouton `deploy-recette.yml` (« Mise à l'essai », toute branche). Note : la première copie a rejoué toutes les migrations sur la base d'essai (la sauvegarde précédait la table `deploy_migrations`) ; sans effet sur la production.
6. Migrer le contenu en base (schéma `content_*`), puis importer les lots, Vampire en pilote.
   - 31/10, branche `feat/contenu-vampire` (poussée, à l'essai, **pas fusionnée dans `main`** ; textes révisés de l'API, décisions 20 à 22 appliquées ; en recette : 99 entrées publiées, 172 révisions) : migration `20261031_content_schema.sql` ; `infrastructure/content/build-vampire.mjs` génère `vampire.sql` (1 Nature, 3 couches, 20 voies, 75 talents ; les 71 identifiants actuels gardés, fusions Prédateur en `legacy_ids`) ; `deploy-recette.sh` applique `infrastructure/content/*.sql` en recette seulement. Vérifié en recette : 20 voies, coûts 1/2/3, tous les talents des fiches réelles retrouvés (15 fiches avec talents de Vérité, 1 Vampire). L'API ne lit pas encore ces tables.
   - Questions tranchées par l'auteur le 31/10 : décisions 20 (droits acquis), 21 (maîtrise à 4 PTV) et 22 (Sens de la magie, Déferlement 1/scène, Arme hématique à 10 m), appliquées dans `build-vampire.mjs`.
   - Ensuite : le moteur (achats, coûts, prérequis) lit `content_*` ; puis les autres Natures, lot par lot.
7. CMS, temps réel (SSE), règles en données, front.
