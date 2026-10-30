# Lot en attente : attaques et table de combat

État : local uniquement, sans push ni déploiement. Branche `feature/tuc-web-v2` ; ne pas fusionner vers `main`. Le déploiement groupé reste à autoriser.

Le commit précédent corrige les armes, les dégâts de tir et le détail des jets des PNJ/créatures. Ce lot ajoute le combat partagé piloté par le MJ, les rounds manuels ou automatiques, l'ordre par passe et le journal compact/repliable conservé à l'écran.

## Migration obligatoire avant publication de l'API

Appliquer `infrastructure/migrations/20261003_campaign_rounds.sql` après `20261003_campaign_live.sql`. Elle ajoute la table `campaign_combat_states`, sans changer les ressources existantes. Le workflow de production actuel ne rejoue explicitement que la migration live : ajouter la migration rounds lors de la préparation du futur déploiement. Ne pas publier la nouvelle API avant cette migration.

## Comportement

- Seul le MJ commence/arrête le combat et passe manuellement les rounds. Les initiatives sont tirées une fois au démarrage, pour les PJ, PNJ et créatures présents.
- Automatique : participants visibles, vivants et ayant rejoint le combat ; aucun PA restant et aucune attaque en attente. Les participants cachés ne bloquent pas la transition. Le groupe retrouve ses PA sans relancer l'initiative.
- Une attaque ou une autre action payante avance la passe de l'acteur. Une défense active réduit les PA futurs sans avancer son tour. Le bouton « Action hors attaque » déduit un PA ; ne pas le presser en plus d'une attaque déjà lancée.
- Rounds partagés : les pouvoirs expirent, les usages par round se renouvellent et les Mues se terminent avec les mêmes règles que les fiches individuelles.
- Les commandes utilisent des identifiants de requête pour les reprises réseau ; un verrou par campagne sérialise les dépenses et transitions.
- Les informations privées (PV, PA, participants cachés, données de fiche) conservent leurs restrictions. L'ordre et les séparations des passes sont publics pour les participants visibles.

## Vérifications locales

Compilation TypeScript API, build Vue, tests API sur PGlite (attaques, règles de Vérité, autorisations, reprise réseau, phases et rounds partagés, confidentialité), tests DOM CharacterPlay, CampaignPlay et résolution de combat. Le catalogue vérifie 269 profils de créatures, dont les attaques du Dive, ainsi que les profils de Veronica et leurs détails de calcul. Aucun test de navigateur Chrome réel pour ce lot : à effectuer dans la recette du futur déploiement.


## Complément du lot : séances, Edge et ergonomie

Toujours local, sans publication. Appliquer aussi `infrastructure/migrations/20261003_live_sessions_edge.sql`, après les migrations live/rounds/character_play, avant de publier cette API.

- Rubriques Jets, États/PV, Vérité, Repos, Historique et recherche de compétence.
- Edge initial issu du solde de création ; compte en jeu indépendant dès sa première dépense/attribution, plafond 8. Aucun rechargement par séance. Forcer le Destin remplace le dé par 20 (10 + 10), avant ou après un jet non résolu ; les attaques et défenses en attente utilisent le nouveau résultat. Une seule dépense par référence, avec reprise réseau sans double débit.
- Échapper au Destin s'appuie sur la dernière conséquence mortelle enregistrée (dégâts directs ou résolution d'attaque). Le personnage revient juste au-dessus de son seuil de mort et reste agonisant ; cette action n'accorde pas de soin supplémentaire.
- Edge offert par le MJ dans les attributions habituelles, les récompenses de séance existantes et le panneau En jeu. Le plafond est contrôlé dans la même transaction que l'ensemble de l'attribution.
- Séance en jeu liée aux séances de campagne : choix d'une séance préparée ou création d'une nouvelle. Versions immuables au début/à la fin et à la demande. Données de fiche, profil calculé, état en jeu, Edge, PNJ/bestiaire et état du combat sauvegardés.
- Nouvelle séance : journal courant réinitialisé sans suppression des événements. Archives paginées, y compris les anciens événements classés dans « Avant les séances ». Combat/initiative/PA conservés si le MJ poursuit le combat ; attaques en attente à résoudre avant le changement.
- Versions visibles seulement par leur propriétaire et le MJ. Les archives publiques du journal gardent les mêmes restrictions que la table.
- Le panneau de récompenses complet (XP, PTV, argent, équipement, Corruption, Renommée et Edge) est présent dans En jeu. Les fiches intégrées rechargent leurs données après une modification de version.

Vérifié : compilation API et Vue, intégration PGlite (Edge/reprise/plafond/survie/attaques/défenses, récompenses habituelles et de séance, snapshots/confidentialité, pagination sans pertes à timestamps identiques), tests DOM rubriques/recherche/Edge, table, résolution, archives et récompenses. Recette navigateur réel toujours à réaliser lors du déploiement groupé.

## Grâce du MJ

Commande repliable dans la fiche sélectionnée de la table (PJ, PNJ ou créature). Le MJ fixe les PV de retour, de 1 au maximum du profil, et saisit un motif partagé. Fonctionne au seuil de mort, sans consommation d'Edge ni changement des PA/initiative/round. Action historisée, autorisation serveur MJ uniquement, contrôle du dernier total de PV et reprise réseau sans double application. Aucune migration supplémentaire.

## Autorisation du lot groupé

Le 3 octobre 2026, déploiement explicitement autorisé par le propriétaire. Publication après validation CI du commit source, sauvegarde et migrations atomiques (live, rounds, sessions/Edge).
