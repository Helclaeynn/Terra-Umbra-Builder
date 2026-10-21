# Export des packs PDF compacts — intégration et publication

Cette procédure prépare une publication ciblée du frontend. Sa présence dans
le dépôt ne signifie pas que les nouveaux dossiers sont déjà en production.
La mise en ligne est confirmée uniquement après réussite des contrôles CI et HTTPS.

## Modèles et périmètre

- 20 modèles de Nature : 4 pages de jeu, 2 de BG et 2 d’aide avant options d’export.
- 1 modèle Réalité seule de 2 pages et 1 supplément de progression de 2 pages.
- Les 22 nouveaux PDF sont référencés par `packs-sha256.json` ; le manifest
  d’export est en schemaVersion 2, avec 21 entrées de modèles principaux.
- Les portraits restent distincts : Réalité en page 0 ; Vérité en page 2 pour
  les Natures. Le modèle Réalité seule ne possède pas de portrait Vérité.
- Les sources de l’API, les règles, migrations et données ne font pas partie
  de cette release. Les anciens PDF et assets restent dans l’image web héritée.

## Déclenchement explicite

Workflow : `.github/workflows/v2-production-pdf-packs-release.yml`.
Il démarre sur un push de `feature/tuc-web-v2` qui modifie ce fichier précis.
Un push ne modifiant que le moteur PDF ou cette documentation ne le déclenche pas.
Après revue et commit du lot autorisé, la commande de publication est :

```sh
git push origin feature/tuc-web-v2
```

Le workflow vérifie que le commit descend de
`7d3873411f5c1594f806bcd78bc629f1c818f577` et refuse les changements hors
du moteur/actions/tests/ressources PDF, de cette documentation et des deux
fichiers de livraison dédiés. Les anciens PDF publics ne doivent pas être supprimés.

## Validation et artifact exact

Le job `verify` installe les dépendances verrouillées, lance `test:pdf`, les
régressions ciblées de fiche/lecture/progression et le contrôle Homo superior.
Il compile ensuite le web et exécute le test de téléchargement/impression
dans Chrome contre ce build, avec une API simulée, sans écrire en production.

L’archive contient uniquement l’index, les chunks compilés, le manifest,
les 22 nouveaux PDF, leurs empreintes et la police utilisée par l’export.
Chaque fichier est empreinté ; le commit exact est inscrit dans `release.json`.
Le job `release` télécharge l’ID immuable de l’artifact issu de `verify` :
il ne recompile pas le frontend et ne synchronise aucun dossier source serveur.

## Préflight et conservation de la production

Le verrou CI `tuc-v2-production` et le verrou serveur
`/opt/terra-umbra/.production-release.lock` empêchent les livraisons concurrentes
qui respectent ce protocole. Les jobs et l’exécution distante sont bornés en temps.

Avant bascule, les empreintes HTTPS connues de l’index, du JS/CSS principaux,
du manifest précédent et de la police doivent correspondre au baseline relu.
Les bundles attendus sont `index-BLzr_ptk.js` et `index-gWax7lqo.css`.
Une différence arrête la release : diagnostiquer la version courante avant
d’actualiser un garde-fou ; ne jamais contourner ce contrôle à l’aveugle.

Le script capture l’image et le conteneur API actifs ainsi que l’image/tag web.
Il archive les sources web présentes sur le serveur sans les modifier.
La sauvegarde privée existante vérifie les médias et restaure le dump PostgreSQL
dans une base de contrôle jetable avant toute bascule du service web.
Ces sauvegardes restent sur le serveur, jamais dans un artifact public GitHub.

L’image candidate dérive de l’image web réellement servie : seuls les fichiers
du payload testé sont ajoutés/remplacés. La configuration nginx et les fichiers
hors périmètre sont conservés. Seul `web` est recréé, sans build ni dépendances.
L’API doit garder exactement le même conteneur et la même image avant/après.
Les trois secrets SSH existants sont limités à l’étape de transport ; la clé
temporaire est supprimée en sortie et aucune configuration privée n’est journalisée.

## Recette publique et retour arrière

Après bascule, les contrôles vérifient en HTTPS chaque fichier livré, les 22 PDF,
le schema 2 et les deux zones de portrait attendues, les routes de fiche/builder,
la santé de l’API et le refus anonyme des endpoints privés.
Le total, les catégories et le bilan des éditions du Compendium doivent rester
identiques au snapshot pris immédiatement avant la release.

En cas d’échec après bascule, le piège de sortie remet l’image web précédente
sur son tag, recrée uniquement `web` et contrôle le retour de l’ancien index public.
Aucune restauration de données ni aucun redémarrage API n’est effectué.
Si le rollback public n’est pas confirmé, le script émet une alerte explicite.

Les dossiers privés de release sont distincts par commit, numéro de run et tentative.
Ils conservent le payload, les références des images précédentes et les sauvegardes
de contrôle. Après réussite seulement, `deployed.ok` et
`/opt/terra-umbra/.production-pdf-packs-sha` identifient le commit publié.
Pour une nouvelle tentative, relancer les jobs nécessaires dans GitHub Actions ;
une relance du seul job release réutilise l’artifact déjà validé.
