# Dossiers PDF de Vérité

Le site distribue vingt modèles de quatre pages et le modèle Réalité de deux pages, chacun en couleur et en impression. Aucun PDF rempli n'est publié : le navigateur charge un modèle vierge et remplit localement une copie du brouillon courant.

`apps/web/public/pdf/dossiers/manifest.json` est le contrat entre PDF et projection TypeScript. Les identifiants `reality.*` et `truth.*` sont stables. `fields.realite` décrit les deux premières pages ; les champs de chaque nature sont positionnés sur la troisième page. La quatrième page reste une référence. Les rectangles sont exprimés en pixels des illustrations sources (1055 × 1491) ; l'export utilise les rectangles réels des widgets PDF pour mesurer le texte.

La version imprimable conserve 85 % de l'opacité du fond ; les valeurs remplies restent sombres. Les modèles vierges restent interactifs. Seule la copie préparée par le bouton d'impression est aplatie. Les annexes du téléchargement normal sont également modifiables.

## Sources et régénération

Les images sélectionnées et validées sont conservées dans le dossier de travail de création. Pour éviter une seconde copie de toutes les illustrations dans Git, les PDF embarquent directement leurs flux PNG RGB compressés, sans rééchantillonnage ni perte de pixels.

Installer `reportlab`, `pypdf`, `Pillow`, `pypdfium2`, puis définir `TUC_PDF_SOURCE_ROOT` sur le dossier de travail contenant :

- `outputs/TUC-fiches-verite-selection/{nature}-page-1-personnage.png` et `...-page-2-references.png` ;
- `outputs/prototype-fiche-1/TUC-realite-page-1-seuil-initiative.png` ;
- `outputs/prototype-fiche-2/TUC-realite-page-2-cadre-harmonise.png`.

Lancer `python tools/pdf-dossiers/build_dossiers.py`. `TUC_PDF_PUBLIC_DIR` permet de choisir un autre répertoire de publication. Les deux JSON adjacents portent la géométrie des vingt natures. `reality-geometry-source.py` conserve la géométrie auditée de Réalité ; le générateur lit seulement sa partie déclarative, sans exécuter son ancien moteur d'export.

Corrections textuelles PDF approuvées le 26 septembre 2026 : Vampire Révélé = +2 Vigueur, +1 Volonté ; Garou/Khinae hybride = +3 aux tests de Pugilat. Elles sont appliquées par-dessus l'image source, sans régénérer les illustrations. Le Phasage Homo Superior est aussi synchronisé dans le catalogue actif.

## Contrôles

- `npm run test:pdf` dans `apps/web` : routage, valeurs, dépassements, Unicode, formulaires, séparation création/progression et impression.
- `node tests/homo-superior-phasing-check.mjs` : disponibilité et coût du nouveau talent.
- Vérifier les valeurs dans l'arbre AcroForm et les widgets, puis rendre avec Poppler. Un rendu PDFium exige `init_forms()` pour montrer les valeurs.
- Recontrôler visuellement chaque modèle modifié : titres, bordures, champs, pages de références et annexes.

Les champs de séance non persistés (PV actuels, PA restants, forme active, mues, frénésie, relation au Voile…) restent vides. Un humain sans tradition de Chasseur utilise Réalité seule. Les informations qui dépassent les cases sont conservées en annexe, jamais coupées silencieusement.
