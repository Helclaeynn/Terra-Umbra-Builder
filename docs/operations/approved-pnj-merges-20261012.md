# Fusions PNJ approuvées — 12 octobre 2026

Décision de l’auteur : fusionner Dragoslav, Feng Tsung, Niichad Tenford et
Yegor Karamov ; Nia et Nina Allen sont des personnes différentes.

| Ancienne entrée | Fiche retenue |
|---|---|
| pnj-portraits-chasseurs-autres-cai7-kai-sieben | pnj-crawlers-docx-dragoslav-memic |
| pnj-portraits-corporations-tsung-feng | pnj-corporations-feng-tsung |
| pnj-portraits-crawlers-niichaad-tenford | pnj-crawlers-antisysteme-p60-niichad-tenford |
| pnj-crawlers-antisysteme-p33-yegpor-karamov | pnj-fleaux-focus-yegor-karamov-05-yegor-karamov |

## Mise en œuvre

Les fusions sont explicites par identifiant. Aucun rapprochement automatique
sur les noms. Le contenu est consolidé après chargement des publications,
portraits et décisions de visibilité. Les lignes d’édition restent intactes,
et leurs empreintes de base ne changent pas. Les portraits supplémentaires
restent attachés ; les portraits publiés choisis restent prioritaires.
Les sections utiles et profils historiques sont conservés sous des IDs
préfixés par leur origine. Le profil principal conserve son ID et reste en
fin de fiche. Les dossiers et images MJ restent protégés.

Articles, aperçus de sections, favoris et liens de catalogue utilisent les
anciennes adresses comme alias. Les anciens liens d’éditeur ouvrent la fiche
canonique. Les quatre anciennes entrées quittent la navigation et la recherche.
Nia Allen et Nina Allen restent présentes sous leurs deux identifiants.

Pour Karamov, la fiche Fléaux reste principale (59 ans). La mention de 69 ans
de la source Crawlers est conservée avec son identité historique dans les
sections MJ ; une note signale cet écart sans prétendre arbitrer le canon.

## Validation et production

Source validée : `7933e88a5ce76af232d13deb2af7346f6469da5c`.
[CI complète réussie](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/38247569946).
Le contrôle des profils historiques vérifie leur conservation sous les alias,
leurs statistiques, leurs budgets de Vérité et leur confidentialité.

Release : `1d8628f5f786c7813b1d8425d264524cbd62ac76`.
[Workflow production réussi](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/38248499043).
Vérifications terminées à 12:22:50 UTC, soit 14:22:50 à Paris.

Overlay ciblé sur le module Compendium exécuté et son nouveau module de fusion.
Les autres modules API, le frontend, les données sources et la base ne sont
pas remplacés. Sauvegarde vérifiée par restauration : 9 utilisateurs,
22 personnages, 6 campagnes, 36 éditions, 13 articles custom et 358 réglages
de portraits. Validation candidate sur la vraie base en lecture seule :
biographie complémentaire de Dragoslav conservée, portrait uploadé principal
et portrait supplémentaire conservés, alias résolus, Nia/Nina distinctes.

HTTPS et recherche vérifiés après bascule. Total : 2 499 → 2 495 articles.
Éditions appliquées : 30 ; conflits : 1, déjà présent. Nombre et empreinte des
publications identiques avant/après. Aucun merge vers main. Le rollback de
l’API précédente et les sauvegardes restent disponibles.
