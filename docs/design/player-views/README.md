# Vues joueur — table orientée scène et actions

Aperçus du 12 octobre 2026, avec une campagne et des personnages fictifs.
Ils sont capturés à partir des vrais composants Vue de la table, des jets,
des capacités, de l'inventaire et du combat. La projection de fiche et les
réponses API sont des fixtures locales ; aucun compte ni événement n'est créé
en production. Le scénario de génération est `live-table-player-views.mjs`.

| Vue | Ce que le joueur voit |
|---|---|
| [Exploration](01-exploration.png) | Scène, groupe, journal et actions personnelles ; aucun outil du MJ |
| [Jet courant](02-jet.png) | Recherche de compétence, score calculé, résultat, détail et Edge |
| [Combat](03-combat.png) | Ordre des passes, PV/PA personnels, état restreint des autres participants |
| [Attaque](04-attaque.png) | Arme possédée et cible d'abord ; filtres, bonus et situation repliés ; calcul détaillé |
| [Pouvoirs](05-pouvoirs.png) | Exemple de Garou : Révélation, forme et commandes de transformation |
| [Inventaire](06-inventaire.png) | Objets possédés, filtre, détail ouvert, train de vie et possessions |
| [État et soins](07-soins.png) | PV, soins, Stress, conscience et réglages personnels |
| [Défense](08-defense.png) | Attaque reçue et choix de défense du personnage ciblé |
| [Mobile 390 px](09-mobile-390.png) | Table et barre d'actions personnelle sans débordement horizontal |
| [Mobile 320 px](09-mobile-320.png) | Même parcours sur un petit écran |
| [Autre joueur](10-autre-joueur.png) | Nom, occupation, Sphère et blessure ; aucun PV exact ni commande privée |

Deux ajustements découlent de cette recette : le formulaire d'attaque joueur
met l'arme et la cible au premier plan, et les autres portraits indiquent
« Voir » plutôt que suggérer des actions sur un personnage tiers. La fiche
personnelle reste montée lorsqu'on consulte un participant public : son
brouillon et ses requêtes non confirmées ne sont pas perdus.

Validation : compilation Vue/TypeScript, parcours réel de table/jet/attaque,
Garou et inventaire, isolation des outils MJ, projection publique et conservation
de la recherche personnelle après inspection d'un tiers ; contrôles de largeur
à 390 et 320 pixels. Le scénario est exécuté dans la recette Chrome de CI.
Les suites de combat et de table existantes vérifient également les calculs et
requêtes inchangés. Cette proposition n'est pas déployée en production.
