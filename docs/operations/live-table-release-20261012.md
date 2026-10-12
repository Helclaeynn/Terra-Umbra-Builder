# Table en jeu — release du 12 octobre 2026

Déploiement explicitement autorisé après recette visuelle des vues joueur et MJ.
Release : `4cfb0f7fa647dd3ff0a5ae94fe9882bfca93bacb`.
[Workflow production réussi](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/38243025396).
Contrôles terminés à 11:33:50 UTC, soit 13:33:50 heure de Paris.

## Périmètre

Table centrée sur la scène, portraits / passes à gauche, journal partagé à
droite et barre d’actions persistante. Les outils MJ, l’attaque et la fiche
s’ouvrent dans des panneaux. Les vues joueur conservent leurs brouillons.
Le formulaire d’attaque joueur privilégie arme et cible ; les options restent
repliées. Les portraits publics sont agrandis et zoomables.

Le builder propose le champ public facultatif « Ce que les autres voient /
savent » (2 000 caractères). La table partage ce texte sans les notes privées,
objectifs ni PV exacts des pairs. Les objets possédés disposent de liens vers
le Compendium et d’un aperçu illustré à la demande, au survol, au clavier ou
par bouton tactile. Les droits de l’API d’article continuent de s’appliquer.

Source applicative validée : `3b12a85bffb01e67a0d635cd3f7356c835f7fab2`,
[CI réussie](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/38181950290).
La galerie MJ et son générateur ont ensuite été ajoutés sans changement
applicatif (`7f1c8a566f886cec525744837d8660c6cef23446`). Le workflow vérifie
ces différences et l’absence de changement applicatif jusqu’à la release.

## Contrôles et conservation

Compilation API/Web réussie ; 126 modules de jeu et le build web transférés.
Modules et données du Compendium de production conservés, y compris son
correctif de biographie. Sauvegarde PostgreSQL vérifiée par restauration :
9 utilisateurs, 22 personnages, 6 campagnes, 36 articles édités, 13 articles
custom et 358 réglages de visibilité des portraits.

Dans l’image candidate, 19 fiches actives et 5 campagnes actives sont vérifiées
avec les vraies connexions PostgreSQL en lecture seule, sans créer de session
ni de jet. Les endpoints privés anonymes refusent l’accès. Après bascule,
index web et assets correspondent exactement au build ; health et Compendium
répondent en HTTPS. Corpus inchangé : 2 499 articles, 30 éditions appliquées
et 1 conflit déjà présent ; empreinte des éditions publiées identique.

Le nettoyage a libéré 964 866 048 octets de cache Docker inutilisé. Volumes,
images précédentes et sauvegardes sont conservés. Le mécanisme de rollback
API/Web reste disponible. Le marqueur production-active reste en place et
aucun merge V2 vers main n’a été effectué.
