# Projection d’intégration Lore vers le Compendium V3

État comparé : `main` au commit `6057a85512e537a55c6183b37e8079db540c2b61` et `preview/lore` après reconstruction du corpus Lore.

## Principe d’intégration

Le `main` contient actuellement 229 entrées dans le dataset Lore. Une grande partie de ces entrées correspond encore à un découpage brut par document (`Partie 1`, `Partie 2`, `Personnages`, etc.). La preview Lore a repris les mêmes familles de sources et les a redécoupées en pages encyclopédiques nommées et enrichies.

Il ne faut donc pas ajouter les 364 pages de preview aux 229 pages existantes. Pour les 23 familles de sources reconstruites, l’ancien découpage doit être remplacé par le nouveau. Les sources hors de cette passe restent inchangées.

- Lore actuel dans `main` : **229 entrées**
- Anciennes entrées appartenant aux 23 familles reconstruites : **196**
- Anciennes entrées Lore conservées hors de cette passe : **33**
- Pages structurées issues de la preview : **364**
- Lore projeté après remplacement : **397 entrées**
- Compendium V3 actuel : **519 entrées**
- Compendium projeté après remplacement Lore : **687 entrées**

La comparaison automatique par titre a trouvé 19 recouvrements probables et 11 correspondances à revoir, mais elle ne doit pas servir de règle de fusion : la granularité des pages a changé. La fusion correcte se fait par **famille de source**, puis par contrôle sémantique.

## Matrice de remplacement

| Corpus preview | Catégorie V3 conservée | Anciennes entrées `main` | Nouvelles pages | Sources remplacées |
|---|---|---:|---:|---|
| Pègre de Los Angeles | Organisations | 16 | 18 | `TUC_organisations_Pegre LA_V2.docx` |
| Agences gouvernementales | Organisations | 5 | 18 | `TUC_organisations_agences.docx` |
| Gouvernement | Organisations | 5 | 18 | `TUC_organisations_gouvernement.docx` |
| Vie quotidienne | Réalité | 10 | 18 | `TUC_organisations_vie quotidienne.docx`, `TUC_vie quotidienne.docx` |
| Police de Los Angeles | Organisations | 12 | 20 | `TUC_organisations_Police LA_v2.docx`, `TUC_organisations_Police LA_Bonus Prisons.docx` |
| Religions et néoreligions | Organisations | 11 | 24 | `TUC_organisations_religions.docx`, `Eglise chrétiennne TUC.pdf` |
| Corporations | Organisations | 12 | 68 | `TUC_organisations_corporations (inachevé).docx` |
| Crawlers | Organisations | 12 | 16 | `TUC_organisations_crawlers_V2.docx` |
| Crawlers — Anti-systèmes | Organisations | 12 | 34 | `factions crawlers _ les anti système.pdf` |
| Arbre de Vie & Angelus | Organisations | 5 | 21 | `factions_Arbre de vie et angelus.pdf` |
| Cours vampiriques | Organisations | 9 | 12 | `Factions_Les cours vampiriques.pdf` |
| Pelages / Loups-garous | Organisations | 3 | 6 | `factions_Les Pelages (loups-garous).pdf` |
| Autres Thérianthropes | Vérité | 3 | 7 | `Les thérianthropes_complément garous.pdf` |
| Loges des Mages | Organisations | 3 | 8 | `factons_Loges des mages.pdf` |
| Temples Daemoniaques | Organisations | 5 | 15 | `factions_Temples Daemoniaques.pdf` |
| Temples Aseryns | Organisations | 5 | 8 | `Les temples Aseryns.pdf` |
| Continents Aseryns | Vérité | 8 | 6 | `faction_les continents Aseryns.pdf` |
| Espèces surnaturelles | Vérité | 16 | 8 | `TUC_Vérité_ les espèces  surnaturelles.docx` |
| Fléaux | Vérité | 10 | 8 | `TUC_Vérité_ les créatures_focus  sur les Fléaux.docx` |
| Grands Exilés | Organisations | 8 | 10 | `factions_les grands exilés.pdf` |
| Groupes d’Extrals | Organisations | 8 | 9 | `factions_Les groupes d'extrals.pdf` |
| Humains galactiques | Vérité | 6 | 5 | `factions_Les humains galactiques.pdf` |
| Espèces extraterrestres | Vérité | 12 | 7 | `TUC_Vérité_ les espèces  extraterrestres.docx` |
| **Total** |  | **196** | **364** |  |

## Lore de `main` conservé hors de cette passe

Ces 33 entrées restent en place jusqu’à leur propre reprise :

- `Points de rencontre.pdf` : 7 entrées ;
- `Shichiba no Hana.docx` : 1 entrée ;
- `TUC_Vérité_ les chasseurs.docx` : 16 entrées ;
- `TUC_Vérité_ les espèces  fantastiques.docx` : 9 entrées.

## Projection des catégories après remplacement

En conservant les autres datasets V3 sans modification :

- **Règles : 5**
- **Réalité : 57** = 39 entrées V3 existantes + 18 pages Lore restructurées
- **Vérité : 137** = 63 entrées V3 existantes + 33 anciennes pages Lore conservées + 41 pages restructurées
- **Organisations : 305** = 305 pages Lore restructurées
- **Personnages : 163**
- **Bestiaire : 20**

Total projeté : **687 entrées**.

Cette projection ne modifie pas `main`. Elle sert de plan de cut-over pour la future intégration canonique.
