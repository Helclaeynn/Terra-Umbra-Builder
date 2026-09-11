# Terra Umbra California — politique documentaire du Compendium

## Principe

Le Compendium ne traite pas les anciens dossiers détaillés comme des archives obsolètes. Ils constituent la **base détaillée du lore TUC** : organisations, personnages, chronologies, institutions, lieux, pratiques, cultures et fonctionnement du monde.

Les livres consolidés récents sont des **synthèses canoniques et des couches de décision** construites à partir de ce matériau. Ils servent à contrôler les règles actuelles, les renommages, les simplifications et les arbitrages explicites intervenus depuis la rédaction des dossiers détaillés.

## Hiérarchie de traitement

1. **Décisions explicites les plus récentes** prises après ou pendant les cross-audits.
2. **Corpus consolidé courant** : Création V12, Réalité V9, Vérité V7, Moteur V4 et Bestiaire V17, pour les règles, états actuels, terminologie et arbitrages.
3. **Dossiers détaillés de lore** du dossier `DOSSIER Infos TUC`, comme source de profondeur encyclopédique.
4. Documents plus anciens uniquement lorsqu'ils apportent un détail absent ailleurs et compatible avec les niveaux précédents.

Cette hiérarchie ne signifie pas que le niveau 2 remplace le niveau 3 : une omission ou une synthèse dans un livre récent **n'invalide pas** un détail compatible présent dans un dossier de lore.

## Règles de fusion

- **Compatible** : conserver le texte récent comme repère et enrichir avec le détail du dossier source.
- **Simple omission** : conserver le détail du dossier source.
- **Reformulation compatible** : fusionner en une entrée plus claire sans perdre l'information.
- **Contradiction avec arbitrage récent explicite** : l'arbitrage récent prime ; conserver la divergence dans les notes éditoriales internes si elle aide à comprendre l'évolution du canon.
- **Contradiction sans arbitrage identifiable** : marquer le bloc `a_statuer` avant publication définitive et comparer les sources avant de choisir.
- **Avertissement source explicite** (`à refaire`, `ne pas en tenir compte`, brouillon abandonné, etc.) : ne pas promouvoir automatiquement le bloc au canon public.

## Statuts de bloc

Chaque bloc documentaire peut porter un statut :

- `canon` — compatible avec le corpus courant.
- `canon_enrichi` — synthèse récente enrichie depuis un dossier détaillé.
- `a_statuer` — contradiction réelle ou ambiguïté nécessitant un arbitrage.
- `brouillon_source` — matière intéressante mais explicitement provisoire dans le document d'origine.
- `obsolete` — remplacé par une décision ultérieure identifiable.
- `mj` — information de scénario, secret du monde ou donnée destinée au MJ.

## Spoilers MJ

Le Compendium public peut contenir des blocs `mj`. Ils sont masqués par défaut derrière une action explicite **Afficher le contenu MJ**.

Ce masquage est éditorial et non une mesure de sécurité : le contenu demeure présent dans les fichiers publics de GitHub Pages. Les joueurs sont supposés respecter cette séparation volontairement.

## Objectif éditorial

La première version du Compendium doit d'abord **restituer fidèlement les blocs existants**, avec navigation, recherche, interliens et provenance. Les réécritures encyclopédiques, fusions de pages et développements supplémentaires viennent ensuite, sujet par sujet, après contrôle des conflits.
