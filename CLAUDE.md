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
2. `docs/audit-game-design/README.md` (charte des décisions 1 à 19, état d'avancement).
3. Les lots `docs/audit-game-design/lots/01` à `16` : refonte des talents en voies à paliers, terminée.

Les passations des agents précédents décrivent **l'existant**, pas ce qu'il faut suivre.

## Branches
- Production : `feature/tuc-web-v2` (V2, terra-umbra.fr).
- Travail en cours : `docs/audit-game-design-bb4kqb`, tirée de la V2.
- Pas de PR ni de fusion sans accord de l'auteur.

## Décisions techniques (31/10)
- Pas de second VPS. La recette tourne sur le même VPS OVH, en seconde pile Compose, une fois le disque nettoyé.
- La V1 (GitHub Pages) ne reste pas en ligne : elle passe dans `legacy/`, et `feature/tuc-web-v2` devient `main`.
- Fin des releases par overlay : un seul déploiement, reconstruit depuis Git.
- Sauvegardes : `infrastructure/backup/daily-backup.sh` sur le VPS, copie sur le PC de l'auteur (disque H) avec `pull-backups-windows.ps1`.
- Pas de changement de langage. Le contenu passe en base (`docs/audit-game-design/schema-contenu.md`), le CMS se choisit ensuite.

## Pièges
- Une quarantaine de workflows lancent une opération de production quand leur propre fichier change sur `feature/tuc-web-v2`. Ne jamais modifier un fichier de `.github/workflows/` sans accord. Le déplacer hors du dossier (archivage) est sans risque.
- Six workflows tournent sur `main`, dont un qui y recommite (`compendium-page-overrides-sync.yml`). Les archiver avant de fusionner.
- Les fiches enregistrent les talents par identifiant : ne jamais changer un identifiant existant.
- Accès VPS : `ssh -i ~/.ssh/terra_umbra debian@terra-umbra.fr` (clé sans phrase secrète, `sudo` sans mot de passe ; `tuc_vps` a une phrase secrète, inutilisable par Claude). Pas de `cron` sur le VPS : utiliser systemd.
- VPS : environ 40 Go de disque, 96 % le 30/10 (1,9 Go libres). Ne jamais lancer `docker system prune -a --volumes`.

## Plan
1. ~~Archiver les 76 workflows ponctuels~~ : fait. Déplacés dans `.github/workflows-archive/` et fusionnés en production le 30/10 (PR #23) ; aucun job lancé. Seul `v2-dev.yml` reste actif.
2. ~~Installer la sauvegarde quotidienne et la copie sur H~~ : serveur fait le 30/10 (minuteur systemd 4 h 17, testé). Copie sur H : tâche planifiée Windows « Terra Umbra - copie des sauvegardes » (9 h), script dans `H:\TerraUmbra\`. Les sauvegardes contiennent le `.env` : jamais dans un dossier synchronisé.
3. Relever ce qui tourne en production, le ramener dans Git, nettoyer le disque. Relevé fait le 30/10 : les 48 dossiers de release viennent de commits déjà dans `feature/tuc-web-v2` ; les fichiers du serveur sont des versions égales ou plus anciennes que Git, sauf le `Caddyfile` de production (HTTP/3 coupé), ramené dans `infrastructure/production/Caddyfile`. Nettoyage : `infrastructure/production/nettoyage-disque.sh` (déposé sur le VPS, testé à blanc : 46 dossiers, 15 Go, et 64 images ; garde ce qui tourne et un retour arrière), à lancer par l'auteur.
4. Fusionner dans `main`, couper Pages, n'avoir qu'un workflow de déploiement, ajouter Prettier/ESLint et une limite de débit sur l'authentification.
5. Monter la recette sur le même VPS.
6. Migrer le contenu en base (schéma `content_*`), puis importer les lots, Vampire en pilote.
7. CMS, temps réel (SSE), règles en données, front.
