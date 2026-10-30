# Terra Umbra — mémoire de travail pour Claude

Lu automatiquement à l'ouverture d'une session dans ce dépôt. À tenir à jour à la fin de chaque étape.

## L'auteur
- Quentin (Helclaeynn), auteur de Terra Umbra California. Écrire en français et le tutoyer.
- Il veut de l'autonomie : avancer, appliquer par défaut, ne poser que les questions qui lui reviennent (au plus 3 à 5, avec une recommandation).
- Messages courts et clairs : ce qui est fait, ce qui suit, ce qu'on attend de lui. Pas de multiplication de documents.

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
- VPS : environ 40 Go de disque, déjà monté à 99 %. Ne jamais lancer `docker system prune -a --volumes`.

## Plan
1. ~~Archiver les 76 workflows ponctuels~~ : fait le 30/10 sur la branche de travail (déplacés dans `.github/workflows-archive/`, sans modification ; seul `v2-dev.yml` reste). Ne prend effet en production qu'une fois fusionné dans `feature/tuc-web-v2` : PR validée par l'auteur le 30/10, depuis la branche `chore/archive-workflows` (poussée, tirée de la prod, rien d'autre que les 76 déplacements ; pas de `gh` sur le PC, la PR s'ouvre depuis github.com), puis vérifier dans l'onglet Actions qu'aucun job n'est parti.
2. Installer la sauvegarde quotidienne et la copie sur H.
3. Relever ce qui tourne en production, le ramener dans Git, nettoyer le disque.
4. Fusionner dans `main`, couper Pages, n'avoir qu'un workflow de déploiement, ajouter Prettier/ESLint et une limite de débit sur l'authentification.
5. Monter la recette sur le même VPS.
6. Migrer le contenu en base (schéma `content_*`), puis importer les lots, Vampire en pilote.
7. CMS, temps réel (SSE), règles en données, front.
