# Table En jeu — release production du 11 octobre 2026

Déploiement demandé après la réparation du Compendium.
Release : `36a297f9e70825fb68615f27eb1a942cb4b39261`.
[Workflow production réussi](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/38174238682).
Bascule et contrôles terminés à 20:59 UTC, soit 22:59 heure de Paris.

## Périmètre

Le lot de mécaniques et d'UX documenté dans
`audit-gameplay-and-ux-20261010.md` est maintenant en production : effets et
ressources de Nature, variantes électriques, charges et modes d'équipement,
Frénésie, résolutions occultes et Edge avant/après, séparation exploration et
combat, navigation de fiche et détails repliables.

Le workflow exige la validation complète
[38173490433](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/38173490433)
du commit `7d12bbc4f4757afb1117437989d262861bfd2708` et l'absence de différence
dans le code applicatif, les données et migrations entre cette source et la
release. Il compile à nouveau API/Web et transfère 126 modules de jeu, le build
web complet et la migration additive `20261009_combat_roster.sql`.

Les modules et données du Compendium de l'image de production sont conservés,
avec le correctif de biographie publié ce soir. Les dépendances runtime sont
comparées avant construction des images. La source du jeu et du frontend est
synchronisée sur le serveur ; la source Compendium n'est pas remplacée.

## Conservation et validation

Sauvegarde PostgreSQL et médias vérifiée par restauration avant bascule :
9 utilisateurs, 22 personnages, 6 campagnes, 36 éditions, 13 pages custom,
358 réglages de visibilité des portraits. La migration ajoute uniquement
`campaign_combat_states.participants` avec une valeur par défaut.

Une vérification dans l'image candidate utilise la vraie base avec des
connexions PostgreSQL en lecture seule. Les requêtes locales simulent en
mémoire les propriétaires existants, sans créer de compte, session ou jet.
Les fiches des 19 personnages actifs et les tables/consentements/résolutions
des 5 campagnes actives chargent correctement. Les éléments archivés ou sans
propriétaire actif ne font pas partie de cette recette ; ils restent sauvegardés.
Les endpoints privés anonymes répondent 401.

Après bascule : index HTML et assets JS/CSS identiques au build approuvé,
health et endpoints Compendium en HTTP 200. Métadonnées identiques : 2 499
articles, 30 éditions appliquées et 1 conflit déjà présent. Le nombre et
l'empreinte des éditions publiées sont identiques avant/après. Le bundle
principal servi est `index-sGPHcmy3.js`.

Le nettoyage préalable a supprimé seulement du cache Docker inutilisé
(6 885 376 octets). Les images précédentes, volumes et sauvegardes sont
conservés. Le script de release rétablit les images API/Web précédentes si
la migration, la recette candidate ou les contrôles HTTPS échouent.

Les limites mécaniques et la recette UX joueurs décrites dans l'audit restent
valables : cette release ne transforme pas les arbitrages narratifs en règles
automatiques supplémentaires.
