# Interface orbitale V2

L’application Vue sert les articles et les règles depuis les API existantes. Les parcours du guide sont des points d’entrée éditoriaux ; la recherche, les catégories, les favoris et les collections continuent d’utiliser le corpus complet accessible au compte.

## Profils statistiques des PNJ

`NpcStatProfile.vue` présente les blocs fournis par l’article sans modifier ni recalculer leurs valeurs. Le branchement est limité à la rubrique Personnages et aux sections « Profil statistique » ou « Statistiques ». Les droits de lecture restent ceux de l’API ; le parent applique aussi le contrôle des sections MJ.

Le composant reconnaît les en-têtes suivants :

| Tableau source | Présentation |
| --- | --- |
| Attribut / Valeur | Cartes d’attributs |
| Compétence ou Compétences / Rang | Lignes groupées avec rang visible |
| Valeur dérivée / Calcul / Résultat | Résultat mis en avant, calcul secondaire |
| Valeur dérivée / Résultat | Cartes de résultats sans calcul ajouté |
| Talent PNJ / Application sur la fiche | Cartes de talents |
| Talent / Prérequis / Effet et limite | Cartes avec prérequis |

Les tableaux non reconnus restent complets. Les liens passent par le même rendu échappé que le reste du Compendium. Les données des PNJ restent dans le chantier API existant.

## Lecture et illustrations

Un lien d’article ouvre son titre, sauf s’il fournit une section explicite (`section`, `sectionId` ou fragment). La reprise est une action distincte. Les positions enregistrées localement ne contiennent que des identifiants et sont séparées par compte.

Les six illustrations WebP sont dans `public/brand/orbital/`. Le logo approuvé reste inchangé. La comparaison de foule est limitée à l’article sur le Voile ; elle ne transforme aucun texte du lore.

## Contrôles

`npm run build` vérifie le typage et produit l’application. `npm run test:ui` couvre navigation, reprise, fidélité des profils PNJ et interactions Corruption. Le workflow V2 exécute aussi les parcours navigateur avant et après déploiement sur la branche `feature/tuc-web-v2`.
