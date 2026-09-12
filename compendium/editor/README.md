# Compendium — architecture du mode Édition

Ce dossier contient la couche éditoriale du Compendium V3. Le principe central est de **ne jamais réécrire les datasets V3 générés pour une correction manuelle courante**.

## Ordre des couches

1. **Corpus brut V3** — les datasets déclarés dans `data/manifest-v3.json` restent la source technique de base.
2. **Overlays de datasets** — les datasets déclarés dans le manifeste sont chargés dans l'ordre et remplacent les mêmes IDs via le cache V3.
3. **Overrides éditoriaux commités** — `data/manual-overrides.json` est appliqué après le corpus/les overlays, avant l'indexation du Compendium.
4. **Brouillons locaux** — le navigateur applique éventuellement un brouillon par-dessus la page effective uniquement pour la prévisualisation. Un brouillon n'est pas canonique tant qu'il n'a pas été publié.

Les overrides commités sont appliqués **avant** la recherche, les catégories et `Voir aussi`. Une correction publiée est donc native dans tout le runtime, pas seulement dans le rendu de la fiche.

## Format d'un override

Chaque entrée de `manual-overrides.json` contient :

- `articleId` : ID canonique de la page ;
- `baseHash` : SHA-256 stable de l'article brut actif ;
- `updatedAt` : date ISO ;
- `note` : note éditoriale optionnelle ;
- `operations` : opérations JSON Pointer `add`, `replace` ou `remove`.

Le hash protège contre les modifications silencieuses du corpus. Si l'article source change, l'override devient conflictuel et n'est pas appliqué automatiquement.

Champs éditables actuels : `title`, `source`, `status`, `tags`, `sections`, `pnj`, `image`, `illustration`.

Champs protégés notamment : `id`, `category` et les autres propriétés structurelles non explicitement autorisées par le gate.

## Brouillons locaux

Les brouillons texte/structure sont stockés dans `localStorage` sous `tuc-compendium-drafts-v1`.

Le gestionnaire de brouillons vérifie leur état contre le corpus courant :

- prêt côté données ;
- conflit source ;
- page introuvable ;
- override invalide ;
- média local à publier ;
- média manquant ;
- média déjà présent dans le dépôt.

Un brouillon pour une page possédant déjà un override commité est calculé depuis le corpus brut jusqu'à l'état final voulu. Lors de la publication, il remplace donc proprement l'ancien override de cette page au lieu de créer une seconde couche concurrente.

## Médias

Une image choisie depuis le poste est :

- décodée dans le navigateur ;
- redimensionnée si nécessaire (dimension maximale par défaut : 1600 px) ;
- convertie en WebP (qualité par défaut : 0,86) ;
- stockée localement dans IndexedDB, base `tuc-compendium-editor`, store `media-drafts`.

Chemins cibles :

- portraits PNJ : `images/pnj/manual/<article-id>.webp` ;
- autres médias : `images/manual/<article-id>.webp`.

Dans le dépôt ces fichiers vivent donc sous `compendium/images/...`, tandis que les articles conservent des chemins relatifs `images/...`.

Les blobs image ne sont jamais stockés en base64 dans l'override JSON.

## Lot de publication

Le bouton **Exporter le lot de publication (.zip)** produit un ZIP autonome contenant :

- `compendium/data/manual-overrides.json` fusionné ;
- les WebP locaux nécessaires sous leurs chemins exacts `compendium/images/...` ;
- `TUC-COMPENDIUM-PUBLICATION.txt` avec les instructions.

La fusion conserve les overrides déjà commités. Un brouillon portant le même `articleId` remplace l'override commité correspondant.

La création du lot est bloquée si une page est absente, si le hash source est conflictuel, si l'override est invalide ou si un média requis est introuvable.

## CI

`.github/workflows/compendium-v3-check.yml` contrôle notamment :

- la syntaxe des runtimes actifs ;
- le moteur d'overrides ;
- l'application native des overrides ;
- l'indexation/recherche sur le vrai corpus V3 ;
- le constructeur ZIP ;
- les overrides commités et leurs médias ;
- le manifeste et le corpus V3 actif.

`tests/manifest-check.mjs` détecte dynamiquement le runtime V3 réellement chargé par `index.html` et applique les contrôles legacy à ce runtime.

## Sécurité GitHub

Le mode Édition **ne stocke pas de PAT GitHub ni de secret OAuth dans le navigateur**.

GitHub Pages étant statique, une publication directe sécurisée nécessitera ultérieurement une vraie brique d'authentification (par exemple GitHub App/backend ou passerelle équivalente). En attendant, le ZIP validé constitue le format de transfert sûr entre l'éditeur web et un canal de commit de confiance.
