# Table de jeu : combat dédié et audit des mécaniques — 9 octobre 2026

## Parcours livré dans le code

Le MJ ouvre le combat depuis le haut de la table. Tous les clients passent en mode combat au prochain rafraîchissement (3 secondes). Chaque PJ lance sa propre initiative ; le MJ lance celles des PNJ/créatures depuis leur carte. Une initiative ne peut être relancée dans le même combat, même après un retrait puis un retour. Arrêter le combat rétablit la vue d’exploration.

La vue combat regroupe armes, cibles, attaques, défense active/passive, protections, dégâts, initiative, passes et PA. La vue d’exploration conserve les jets courants, le journal, les révélations, les séances et les récompenses. La fiche propose des rubriques explicites Équipement et Mes règles, avec possessions, train de vie, talents, désavantages et traits de nature.

Le MJ attribue un camp public allié/ennemi/neutre (trait coloré + texte, sans dépendre uniquement de la couleur). Il peut sortir un participant des tours : sa carte et ses blessures restent, son initiative et ses PA sont conservés, il ne peut plus attaquer/dépenser une action ni défendre activement, et il ne récupère pas de PA aux nouveaux rounds. Revenir ne recharge pas ses PA. Le retrait n’est pas une disparition : il reste ciblable. Le camp est un repère collectif décidé par le MJ, pas une relation relative à chaque observateur.

Les participants visibles, vivants et présents doivent avoir lancé leur initiative avant le round suivant. Les acteurs cachés ou sortis des tours ne bloquent pas l’automatisme. Les attaques en attente doivent être résolues/annulées avant un changement de round, de combat ou de participation. Un MJ peut retirer un PJ absent des tours pour débloquer la table.

## Portée de l’audit

Inventaire reproductible : `apps/api/scripts/audit-live-mechanics.mjs`, après compilation de l’API, exécuté depuis `apps/api`. Résultat : `live-mechanics-inventory.json` dans ce dossier. Il recense **2 553 entrées** : 122 talents de Réalité, 1 187 talents de Vérité répartis entre les dix natures, 273 traits de nature conditionnels, 227 talents de corruption, 231 objets de Vérité, 367 équipements et 146 augmentations de Réalité. Les traits conditionnels sont des entrées de règles, pas nécessairement des pouvoirs distincts.

Cet inventaire décrit la couverture technique. **Il ne constitue pas une validation sémantique individuelle de tous les effets ni une automatisation intégrale du jeu.** Les techniques de Mage construites par le joueur, les configurations de pouvoirs et les objets spécifiques sont des systèmes à paramètres, pas uniquement des entrées de catalogue. Les modifications de Compendium conservées uniquement en base de production n’ont pas été comparées ici.

## Confrontation règles / moteur

| Famille | Intégration constatée | Limite ou travail restant |
|---|---|---|
| Jets, stress, explosions | d10 serveur, détail attribut/rang/bonus, seuils selon stress, deuxième dé non explosif, échec narratif | Arbitrage narratif du résultat |
| Initiative, PA, passes | Un jet par combat, PA restaurés par round, ordre par actions consommées, réaction sans changement de passe | Le contrôle du prochain acteur reste souple : pas de verrou empêchant tout autre participant d’agir |
| Armes et dégâts | Inventaire PJ, catalogue MJ, profils des créatures, mêlée et tir distincts, Perforant, protections et réductions | Propriétés spéciales, munitions, charges ablatives et Altérations demandent confirmation/suivi |
| Défense active | Décision joueur/MJ, 1 PA, stress, surprise, Edge et résolution tracée | Exceptions de gratuité, défense sous surprise et contre-attaques de talents pas toutes reliées automatiquement |
| Blessures | Paliers publics, stress minimal, mort, stabilisation, plafond agonisant de 1 PA | Dégâts périodiques et conséquences anatomiques particulières non planifiés automatiquement |
| Soins et repos | Récupération quotidienne, soins prolongés, Santé de fer, soins explicites, grâce MJ | Récupération horaire propre aux métamorphes et soins spéciaux non unifiés dans le calcul de repos |
| Edge | Forcer le Destin avant/après un jet éligible ; survie ; réserve persistante et récompenses | Arbitrage des autres conséquences de la survie |
| Talents de Réalité | Rangs permanents, bonus de test automatiques/contextuels, économie, prêts, récupération et douleur ciblés | Effets sociaux, contacts, ressources et usages limités restent contextuels |
| Augmentations | Bonus préparés, initiative, douleur, armure corporelle, réductions, descriptions accessibles | Charges/Stress augmentiques, Neuro et consommables ne forment pas un moteur complet en combat |
| Révélation | Attributs V/SR/R, dérivés, accès des capacités, portraits et formes | Les effets de révélation non numériques exigent la lecture du texte |
| Garou / Khinae | Formes, profils, Mue différée, PA différés, blessures conservées, régénération assistée | Épuisement, venins, contraintes morphologiques, effets de Sangs et exceptions encore partiellement arbitrés |
| Vampires | Révélation, textes de pouvoirs, activation assistée et profils du builder | Prédation, stase, ressources sanguines, Cours et régénérations spécifiques non entièrement automatisées |
| Mages | Textes, techniques conservées dans la fiche complète, bonus/PA génériques | Composition, Amplitude, Affinités, difficultés et effets sur cibles à résoudre ; pas de moteur universel de sorts |
| Daemon | Attributs, capacités possédées, configurations lisibles dans la fiche complète | Pactes, faveurs, ressources et effets multi-cibles restent assistés |
| Angelus | Attributs, Aura/configurations dans la fiche complète, capacités activables | Transcendance, Liaisons et effets célestes spécifiques non entièrement reliés aux actions |
| Aseryn | Attributs d’Origine, capacités et descriptions | Accelyr, écoles, déplacements et réactions spéciales restent partiels |
| Exilés / Extrals | Attributs, bonus préparés ciblés, inventaire annoté, règles de peuple/espèce | Réseaux, nanites, technomagie, quotas par bénéficiaire et scénario pas tous reliés aux boutons de jeu |
| Humains / Chasseurs | Mémoire, doctrines/traditions et textes possédés | Rites, préparations, cibles et consommations spécifiques à gérer avec le MJ |
| Corruption | Attribution MJ, source, progression et catalogue | Dons/Rites/Faveurs et conséquences ne disposent pas d’un moteur complet d’activation |
| Objets de Vérité | Possession, description et références | Ne sont pas convertis arbitrairement en armes standard ; profils spéciaux à intégrer explicitement |
| PNJ / Bestiaire | PV, attaques et défenses chiffrées, références capacités/forces/faiblesses, jets explicites | Un texte de faiblesse n’est pas une réduction ou vulnérabilité numérique implicite |
| Séances / confidentialité | Archives, versions, Edge durable, PV privés, état public et portrait autorisé | Aucun élargissement de lecture des fiches entre joueurs |

## Corrections de règles incluses

- Les bonus préparés de Vérité consultent désormais l’accès canonique du talent : les talents SR/R fonctionnent dès Semi-révélé, et restent inactifs pour un Profane ou lorsque le talent n’est pas disponible.
- Un accès explicitement V est reconnu même si le champ comporte aussi SR/R.
- Les textes complets disponibles (`effectDetails`) sont affichés dans Mes règles, au lieu de présenter uniquement le résumé de fiche comme règle complète.

## Suite d’intégration priorisée

1. Défenses exceptionnelles : gratuité, surprise, quotas de scène, contre-attaques, avec identifiants de règles et tests dédiés.
2. Ressources propres aux natures et récupération horaire : modèles typés, consommation atomique, réinitialisations définies par les règles.
3. Effets ciblés et périodiques : durée, source, cumul, expiration, sauvegardes et journal ; relier ensuite venins/Altérations et capacités multi-cibles.
4. Profils d’objets de Vérité et consommables : aucune inférence de DGT à partir d’un nom ou d’un texte ambigu.
5. Validation sémantique talent par talent à partir de l’inventaire, avec tests des exceptions. Le bouton générique d’activation (PA, durée, bonus et note) ne suffit pas à déclarer une règle intégralement prise en charge.

## Vérification et livraison

Compilation API et Web ; tests de table API avec base PostgreSQL embarquée isolée ; tests DOM MJ/joueurs, mode exploration/combat, armes, défense et séances. Régressions ajoutées pour initiative personnelle et unique, participant exclu, non-restauration de ses PA, confidentialité du camp et accès SR des pouvoirs.

La migration additive `20261009_combat_roster.sql` conserve les métadonnées de participation dans l’état de campagne. Elle est ajoutée au script de livraison. Appliquer les migrations avant de démarrer cette version de l’API. Les anciens participants reçoivent par défaut le statut présent, allié pour les PJ, neutre pour les autres.

Le navigateur Chromium local est bloqué par les restrictions de sockets du conteneur ; le test navigateur a été préparé, mais sa validation visuelle reste à exécuter dans l’environnement CI compatible. Aucun déploiement de production effectué pour ce lot.
