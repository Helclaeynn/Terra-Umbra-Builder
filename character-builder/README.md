# Terra Umbra California — Character Builder V1

Builder de création de personnage **100 % statique**, destiné à GitHub Pages. Aucun framework, aucun backend et aucune compilation : `index.html` charge `app.js`, `styles.css` et les données JSON sous `rulesets/terra-umbra/`.

## Fonctionnel dans cette V1

- Concept / identité.
- 5 Origines et 25 Talents d’Origine.
- 5 Sphères et 25 Styles.
- 5 points fixes de Sphère + 5 points guidés de Style.
- 5 Attributs : budget 22, minimum 3, maximum 7.
- 25 Compétences canoniques actuelles : 15 points libres, plafond brut 5.
- 122 Talents de Réalité : 12 communs, 25 Expertise, 25 Origine et 60 Sphère.
- 55 Désavantages : communs, liés aux Attributs et liés à la Sphère ; maximum 3.
- Edge : budgets, plafonds et reliquat conservé en jeu.
- Nature / Conscience / Révélation et budget initial de 5 PTV.
- Train de vie, Compte, Enveloppe augmentique, Capital véhicule et conversions à 50 %.
- Valeurs dérivées automatiques.
- Sauvegarde navigateur (`localStorage`), import et export JSON.
- JSON Schema minimal du personnage.

## Architecture des règles

Les données sont séparées du code afin de faciliter les futures corrections et extensions :

- `rulesets/terra-umbra/core.json` : Attributs, Compétences, budgets, Origines, Sphères, Styles et formules dérivées ;
- `rulesets/terra-umbra/talents/` : Talents communs, Expertise, Origine et Sphère ;
- `rulesets/terra-umbra/disadvantages/` : Désavantages communs, d’Attribut et de Sphère.

Le builder emploie les terminologies canoniques actuelles **Humanité**, **Esquive** et **Neurodive**.

## Prochaines passes

1. Catalogues complets de Talents, Voies et Traditions de Vérité par Nature.
2. Catalogue des augmentations et validation Charge / Stress augmentique.
3. Équipement, armes, armures et véhicules.
4. Export Markdown Obsidian.
5. Export PDF depuis la fiche TUC.
6. JSON Schema complet et CI de validation.

## Tester localement

Depuis le dossier `character-builder/` :

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Sources intégrées

- `TUC_Creation_de_Personnage_V12_CROSSAUDIT_2026-09-10`
- `TUC_Realite_V9_CROSSAUDIT_2026-09-10`

Cette V1 ne modifie pas le builder historique situé à la racine du dépôt.
