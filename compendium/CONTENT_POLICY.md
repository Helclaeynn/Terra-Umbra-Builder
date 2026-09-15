# Terra Umbra California — politique documentaire du Compendium

## Principe fondamental

Le Compendium est **composé à partir des dossiers détaillés de lore TUC**. Ils constituent la base documentaire du monde : organisations, personnages, chronologies, institutions, lieux, pratiques, cultures, factions, relations et fonctionnement de l'univers.

Les livres consolidés récents — Création V12, Réalité V9, Vérité V7, Moteur V4 et Bestiaire V17 — ne définissent **ni le sommaire encyclopédique ni la granularité des pages de lore**. Ils forment une **surcouche canonique et fonctionnelle** : ils contrôlent la terminologie et les décisions récentes, arbitrent les contradictions explicites et ajoutent tout ce qui manque aux dossiers détaillés, notamment règles, profils, catalogues, statistiques, équipements, armures, armes, véhicules, Talents, Bestiaire et données de jeu.

Une omission dans un livre récent n'abroge jamais à elle seule un détail compatible présent dans un dossier de lore.

## Deux priorités distinctes

### 1. Priorité de composition documentaire

Pour construire le sommaire, les pages et les interliens du monde :

1. dossiers détaillés de lore ;
2. autres sources détaillées compatibles ;
3. personnages et mini-BG extraits de ces mêmes sources ;
4. livres récents en enrichissement lorsqu'ils apportent un sujet ou une donnée absente.

### 2. Autorité d'arbitrage canonique

Lorsqu'il faut statuer sur une contradiction :

1. décisions explicites les plus récentes prises pendant ou après les cross-audits ;
2. corpus consolidé courant : Création V12, Réalité V9, Vérité V7, Moteur V4 et Bestiaire V17 ;
3. dossiers détaillés de lore ;
4. documents de travail plus anciens.

Cette hiérarchie d'arbitrage ne doit jamais être confondue avec la priorité de composition du wiki.

## Surcouche issue des livres récents

Les livres récents peuvent et doivent alimenter pleinement le Compendium pour les contenus qu'ils sont les mieux placés à fournir :

- règles générales et procédures de jeu ;
- création et progression ;
- Bestiaire et blocs statistiques ;
- catalogues de Talents et pouvoirs ;
- équipements, augmentations, services et véhicules ;
- armes et armures, avec leurs illustrations lorsqu'elles sont disponibles et utilisables ;
- profils de Réalité et de Vérité ;
- coûts, seuils, matrices, tableaux et états actuels ;
- nouvelles notions absentes du corpus de lore détaillé.

Ces contenus doivent être reliés aux pages de lore correspondantes sans remplacer leur matière encyclopédique.

## Découpage encyclopédique et hiérarchie

Le Compendium doit **découper les sujets même lorsque toutes les sous-pages n'ont pas encore la même profondeur**.

Une page-mère explique un phénomène général et sert de carrefour ; ses sous-pages traitent séparément chaque élément identifiable. Exemple canonique :

- `Pègre`
  - `Gangs`
    - `Bloods`
    - `Crips`
    - `18th Street`
    - `MS-13`
    - `Sons of Samoa`
    - `Reapers Incorporated Power`

La page `Gangs` doit expliquer ce qu'est un gang en Grande Californie, sa place dans la Pègre et l'Underlife, puis renvoyer vers les gangs individuels. Les pages filles conservent leur propre histoire, organisation, territoires, dirigeants, relations et éventuelles données de jeu.

Une sous-page n'est pas supprimée ou fusionnée artificiellement au seul motif qu'elle est encore courte. Si la source ne fournit pour l'instant qu'une phrase ou un fait, la page existe comme **stub `À compléter`**, reste recherchable et peut recevoir des interliens. Elle sera enrichie lors d'une passe ultérieure.

À l'inverse, une page-mère ne doit pas absorber tout le contenu de ses enfants au point de rendre leur existence inutile : elle synthétise et oriente ; les détails spécifiques restent sur les sous-pages.

Cette logique vaut pour tous les ensembles structurés : corporations → corporations individuelles, agences → agences individuelles, Pègre → mafias/cartels/gangs, Crawlers → familles et groupes, Cours vampiriques → Cours, Exilés → espèces/traditions/réseaux, Extrals → espèces/fonctions/réseaux, lieux → établissements/territoires, Bestiaire → familles/créatures, etc.

## Règles de fusion

- **Compatible** : conserver toute la profondeur du dossier source et ajouter les précisions récentes utiles.
- **Simple omission dans un livre récent** : conserver intégralement le détail du dossier source.
- **Information récente absente des dossiers détaillés** : l'ajouter totalement comme surcouche canonique.
- **Reformulation compatible** : fusionner sans perdre l'information détaillée.
- **Contradiction avec arbitrage récent explicite** : l'arbitrage récent prime ; adapter le texte de la page sans jeter les autres éléments compatibles du dossier.
- **Contradiction sans arbitrage identifiable** : marquer `a_statuer` avant publication définitive.
- **Avertissement source explicite** (`à refaire`, `ne pas en tenir compte`, brouillon abandonné, etc.) : ne pas promouvoir automatiquement le bloc au canon public.

## Qualité minimale des pages

Une page publiée comme article documentaire ne doit pas être un simple fragment tronqué, une demi-ligne ou un extrait finissant artificiellement par `…` lorsque la source contient davantage de matière.

Les imports doivent conserver les paragraphes complets et les sous-sections pertinentes. Une entrée très courte n'est acceptable que si la source elle-même ne fournit réellement qu'une information minimale ; dans ce cas elle doit être marquée `À compléter` et ne pas être présentée comme une page encyclopédique achevée.

Le sommaire principal doit mettre en avant les ensembles et pages réellement renseignés, tout en laissant apparaître leurs sous-pages courtes dans leur hiérarchie naturelle. Les stubs ne doivent pas noyer le premier niveau de navigation, mais ils ne doivent pas disparaître du wiki.

### Catalogues Réalité

Les pages publiques des catalogues Équipement et Augmentations doivent conserver leurs données techniques dans les tableaux, sans recopier dans le lore les prix ni les champs internes de génération. Chaque page possède deux paragraphes de contexte suffisamment substantiels pour apporter une information d'usage absente du tableau.

Les enrichissements automatiques ne doivent pas fabriquer de propriétés nouvelles : ils peuvent expliciter le rôle, l'environnement d'emploi, les contraintes pratiques et les différences documentées entre variantes. Les entrées disposant d'une source détaillée ou d'un arbitrage récent utilisent cette matière en priorité.

Le contrôle de qualité compare également les textes entre pages. Deux entrées ne doivent pas dépasser 60 % de similarité selon le contrôle Jaccard à quatre mots utilisé par le gate Réalité ; une famille de produits proche doit donc rester identifiable sans devenir une série de paragraphes clonés.

## Statuts de bloc

Chaque bloc documentaire peut porter un statut :

- `canon` — compatible avec le corpus courant ;
- `canon_enrichi` — dossier détaillé enrichi ou corrigé par la surcouche récente ;
- `a_statuer` — contradiction réelle ou ambiguïté nécessitant un arbitrage ;
- `brouillon_source` — matière intéressante mais explicitement provisoire ;
- `obsolete` — remplacé par une décision ultérieure identifiable ;
- `mj` — information de scénario, secret du monde ou donnée destinée au MJ.

## Spoilers MJ

Le Compendium public peut contenir des blocs `mj`. Ils sont masqués par défaut derrière une action explicite **Afficher le contenu MJ**.

Ce masquage est éditorial et non une mesure de sécurité : le contenu demeure présent dans les fichiers publics de GitHub Pages. Les joueurs sont supposés respecter cette séparation volontairement.

## Objectif éditorial

Le Compendium doit devenir une encyclopédie dense et exploitable : matière détaillée, sommaire thématique et hiérarchique, recherche, interliens, PNJ, organisations, lieux, règles, catalogues et profils de jeu. Les sources récentes complètent et sécurisent le canon ; elles ne réduisent pas la richesse des dossiers qui ont servi à construire le monde.
