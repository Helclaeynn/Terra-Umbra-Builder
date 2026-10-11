# Compendium indisponible — 11 octobre 2026

## Cause et correction

Les endpoints publics `meta` et `search` répondaient HTTP 500 :
`Biographie fragmentée introuvable : pnj-crawlers-docx-dragoslav-memic`.
Le chargement applique les pages publiées en base avant les réparations de PNJ.
La réparation des paragraphes importés de Word exigeait ensuite la section
`crawlers-v2-realite`, alors qu'une page publiée peut remplacer ses sections.
Une seule édition empêchait ainsi la reconstruction du corpus entier.

La réparation ignore désormais cette opération seulement quand la section a
disparu d'une page portant `__wikiPublishedEdit === true`. Les contrôles des
sources statiques restent stricts. Aucun paragraphe ancien n'est réintroduit et
les filtres des informations MJ restent appliqués.

Commit correctif : `38a97731b4244bb10a81aa92176a02572268f5bb`.
Le test `check-published-pnj-biography.mjs` charge le corpus, récupère une base
éditeur, simule une biographie publiée avec une nouvelle section, invalide le
cache puis vérifie le nombre d'articles et les quatre endpoints publics.
La CI courante et le workflow de réparation exécutent cette régression.

## Intervention production

La première tentative s'est arrêtée avant remplacement des conteneurs :
BuildKit interprétait l'identifiant brut d'image comme un dépôt distant. La
seconde utilise un tag local de l'image réellement en cours d'exécution.

Release ciblée : `7d12bbc4f4757afb1117437989d262861bfd2708`.
[Workflow de réparation réussi](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/38173490468).
Seul le module de réparation PNJ de l'image API existante est modifié ; le lot
V2 complet et le frontend ne sont pas déployés par cette intervention.
Le script conserve l'image précédente, prend le verrou production, vérifie
l'espace disponible et restaure l'image précédente en cas d'échec.

Sauvegarde vérifiée par restauration PostgreSQL avant l'intervention :
9 utilisateurs, 22 personnages, 6 campagnes, 36 éditions, 13 pages custom et
358 réglages de visibilité des portraits. Le dump et les médias passent leurs
contrôles d'intégrité. Aucun changement de schéma ni écriture métier en base.
Le nombre et l'empreinte de toutes les éditions publiées sont identiques avant
et après la réparation.

À 20:46 UTC, les quatre endpoints passent HTTP 200. Vérification externe :
2 499 articles dans les métadonnées, 2 371 entrées dans l'index public,
3 résultats pour Dragoslav, et sa fiche publique lisible. Le navigateur
affiche à nouveau les rubriques, la liste des articles et les résultats.

Le lot mécaniques/UX décrit dans `audit-gameplay-and-ux-20261010.md` demeure
sur la branche V2 avec ses validations antérieures ; il attend toujours une
release production distincte. Cette réparation ne constitue pas cette release.
