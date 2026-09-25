# Audit UI/UX V2 — 25 septembre 2026

Branche : `feature/tuc-web-v2`. Audit des composants et des parcours fonctionnels, complété par les compilations et les tests DOM/API. Aucun contrôle visuel sur les comptes réels ou sur mobile n'est inclus dans ce document.

## Changements intégrés

| Parcours | Problème constaté | Traitement |
| --- | --- | --- |
| Mon espace | Formulaires du compte, fiches partagées et administration visibles en même temps | Sections repliables ; campagnes ouvertes, réglages et tableaux secondaires fermés par défaut. Recherche locale des fiches et des comptes. |
| Builder, création et progression | Les grands catalogues ne guidaient pas la comparaison | Choix d'une catégorie, puis cartes consultables et recherche. Illustration demandée au Compendium seulement lorsque la carte entre à l'écran ; le survol de la mini-fiche est conservé. |
| Compendium | Arborescence calquée sur l'import ; neuroprogrammes répartis par rôle individuel | Regroupement des neuroprogrammes ; équipement ordonné par usage, puis augmentations et objets de Vérité ; dossiers et sections repliables. Le corpus et les URL canoniques sont inchangés. |
| Recherche Compendium | Un filtre de rubrique pouvait disparaître pendant la saisie | Rubrique et dossier explicitement filtrables, fabricant proposé pour l'équipement ; filtres conservés pendant la saisie et dans l'URL. |
| Bestiaire de campagne | Générateur de Vérité réduit à une tactique ; image non prévue ; nombre d'ennemis ignoré | Pouvoir, tactique et limite proposés selon l'archétype ; illustration des créations custom uniquement ; estimation indicative à la génération et dans la scène avec quantités et joueurs. |

## Lecture par écran

| Écran | État après la passe | Prochaine amélioration utile |
| --- | --- | --- |
| Accueil du Compendium | Accès direct et navigation par rubrique | Vérifier en conditions réelles la lisibilité des nouveaux dossiers sur téléphone. |
| Article Compendium | Sommaire et sections repliables ; ancres rouvraient déjà les sections MJ et rouvrent désormais les autres sections ciblées | Une commande « tout ouvrir / tout replier » si les articles longs deviennent difficiles à parcourir. |
| Recherche Compendium | Catégorie, dossier et fabricant filtrables ; ordre thématique des dossiers | Afficher les filtres actifs sous forme de boutons faciles à retirer. |
| Mon espace | Personnages accessibles, recherche par nom ou campagne, blocs secondaires repliables | Épingler quelques fiches favorites si le volume par compte devient important. |
| Builder | Cartes illustrées par le Compendium en création et progression ; chargement différé des images | Examiner les entrées sans illustration ou sans correspondance wiki dans la recette de couverture. |
| Fiche et historique | Consultation et révisions déjà séparées | Rien de fonctionnel identifié dans cette passe. |
| Campagne et préparation | Scènes repliables, bestiaire et PNJ accessibles, aide indicative pour les rencontres | Chiffrer les créatures anciennes ajoutées à une scène avant l'introduction de leur difficulté ; elles sont signalées comme non comptées aujourd'hui. |
| Recette admin | Filtres de recette existants, tableaux administratifs repliables et recherche des comptes | Harmoniser les contrôles des différents tableaux si l'administration prend plus d'ampleur. |
| Éditeur wiki | Brouillons, aperçu, couverture mécanique et image présents | Remplacer les champs libres de rubrique/statut par des choix guidés pour limiter les nouvelles catégories accidentelles. |

## Limites de l'aide à la rencontre

L'indicateur convertit chaque difficulté en une pression relative (Figurant 1, Standard 2, Dangereux 4, Majeur 7, Exceptionnel 12), puis compare la somme à la taille du groupe. Il tient compte de la quantité des créatures de campagne **ajoutées à une scène après cette passe**. Les PNJ, créatures canoniques et anciennes références sans difficulté chiffrée sont explicitement exclus. Il ne remplace pas une évaluation du terrain, des pouvoirs ou des ressources du groupe.

## Vérification et recette à faire en ligne

- Compilation TypeScript et build du frontend et de l'API ; suite de tests DOM du frontend ; contrôle du générateur Bestiaire et des références de scène.
- À vérifier visuellement sur le site déployé : images des cartes avec de vraies fiches illustrées ; largeur du formulaire de recherche à 375, 768 et 1280 px ; retours au sommaire sur une section repliée ; enregistrement puis réouverture de la fiche illustrée ; scène mixant plusieurs catégories de créatures.
