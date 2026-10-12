# Vues MJ — recette avant déploiement

Captures du 12 octobre 2026 sur la branche feature/tuc-web-v2.
Les vrais composants Vue et leurs styles sont exécutés dans Chromium.
La campagne, les portraits avec initiales, les profils et les réponses API
sont fictifs : les valeurs servent à la recette visuelle et ne sont pas des
profils canoniques du Compendium. Aucun compte ni donnée de production n’est
consulté ou modifié. Aucun déploiement n’est déclenché par cette galerie.

| Capture | Points à examiner |
|---|---|
| [Exploration](01-exploration-mj.png) | Scène, portraits, journal partagé, bouton de lancement du combat |
| [Révélation](02-revelation.png) | Texte, lien Compendium et image à partager |
| [Dés libres](03-des-libres.png) | Nombre de dés, faces, visibilité du jet ; sélection aléatoire disponible |
| [Ajout de participant](04-ajout-participant.png) | Compendium / campagne, PNJ / bestiaire, ajout caché |
| [Récompenses](05-recompenses.png) | Destinataires, XP, PTV, argent, Edge, Corruption et équipement |
| [Séances et versions](06-seances-versions.png) | Nouvelle séance, réinitialisation du journal et sauvegarde des fiches |
| [Combat](07-combat-mj.png) | Ordre des passes, PV/PA côté MJ, round suivant et arrêt du combat |
| [Rythme du combat](08-rythme-combat.png) | Rounds manuels ou automatiques, initiative conservée |
| [PNJ : PV et retrait](09-pnj-pv-retrait.png) | Camp, fuite / sortie des tours, blessures, soins et visibilité |
| [Créature : capacités](10-creature-capacites.png) | Forces, faiblesses, capacités et actions sur place |
| [Attaque PNJ](11-attaque-pnj.png) | Attaquant, arme, cible et décomposition du score |
| [Mobile MJ](12-mobile-mj.png) | Parcours à 390 px sans débordement horizontal |
| [Soins du PNJ](14-pnj-soins.png) | Dégâts, soins, PA et visibilité du participant |
| [Fiche PJ côté MJ](13-fiche-pj-mj.png) | Accès à la fiche en jeu du personnage sélectionné |

Le générateur reproductible est apps/web/tests/live-table-gm-views.mjs.
Il contrôle l’absence d’erreurs Vue, l’ouverture des panneaux, les commandes
simulées de début de combat et de mode automatique, les cibles et le format
mobile. Les formulaires de révélation et récompense sont remplis sans envoi.

Ces images permettent une recette de disposition et de lisibilité. La
recette interactive des sauvegardes et du réseau nécessite un environnement
de test ; elle n’est pas remplacée par les captures.
