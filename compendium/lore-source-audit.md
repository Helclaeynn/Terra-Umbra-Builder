# Audit de fidélité des previews Lore

État de travail sur la branche `preview/lore`.

## Règle de contrôle

Chaque bloc de lore affiché est comparé au document source primaire complet. Le contrôle normalise uniquement les différences de mise en page et d'espacement introduites par Word/PDF (retours à la ligne, espaces et caractères de contrôle). L'ordre des caractères et le texte doivent autrement être identiques au document source : aucune paraphrase, synthèse ou réécriture n'est acceptée comme contenu de lore source.

Les éléments explicitement éditoriaux de l'interface (badges de source, mentions de recette, avertissements `À statuer`, navigation) ne sont pas comptés comme texte canonique du document et doivent rester visuellement distincts du lore.

## Baseline avant corrections

Sur les 22 previews actuellement décodables : **3 833 blocs contrôlés, 3 304 exacts, 529 écarts**.

| Preview | Blocs | Exacts | Écarts |
|---|---:|---:|---:|
| Agences | 75 | 0 | 75 |
| Arbre de Vie & Angelus | 89 | 87 | 2 |
| Crawlers — Anti-systèmes | 119 | 0 | 119 |
| Continents Aseryns | 18 | 17 | 1 |
| Temples Aseryns | 155 | 139 | 16 |
| Corporations | 635 | 635 | 0 |
| Crawlers | 209 | 209 | 0 |
| Temples Daemoniaques | 21 | 15 | 6 |
| Groupes d’Extrals | 132 | 127 | 5 |
| Espèces extraterrestres | 172 | 172 | 0 |
| Gouvernement | 42 | 0 | 42 |
| Grands Exilés | 15 | 13 | 2 |
| Humains galactiques | 13 | 12 | 1 |
| Loges des Mages | 12 | 8 | 4 |
| Pègre | 786 | 786 | 0 |
| Pelages / Loups-garous | 13 | 13 | 0 |
| Police de Los Angeles | 243 | 238 | 5 |
| Religions et néoreligions | 277 | 277 | 0 |
| Espèces surnaturelles | 577 | 417 | 160 |
| Autres Thérianthropes | 39 | 39 | 0 |
| Cours vampiriques | 82 | 82 | 0 |
| Vie quotidienne | 109 | 18 | 91 |

Les cinq ensembles qui concentrent les écarts sont donc : **Espèces surnaturelles (160), Anti-systèmes (119), Vie quotidienne (91), Agences (75), Gouvernement (42)**. Ils représentent 487 des 529 écarts.

## Previews déjà propres sur leur corps de lore

Pègre, Corporations, Crawlers, Religions, Cours vampiriques, Pelages / Loups-garous, Autres Thérianthropes et Espèces extraterrestres ont un corps de lore intégralement retrouvé dans leur source primaire, caractère pour caractère après normalisation de mise en page.

## Défaut technique distinct

La preview **Fléaux** n'est pas incluse dans les chiffres ci-dessus : son paquet gzip concaténé possède un en-tête valide mais échoue au contrôle CRC à la décompression. Il doit être régénéré depuis `TUC_Vérité_ les créatures_focus  sur les Fléaux.docx`, puis audité comme les autres previews.

## Ordre de correction

1. Agences et Gouvernement : remplacer les synthèses actuelles par les paragraphes littéraux des documents Word, en conservant l'exclusion des fiches individuelles.
2. Anti-systèmes, Vie quotidienne et Espèces surnaturelles : reconstruire le corps des pages à partir des passages sources sans fusion paraphrasée.
3. Corriger les 42 écarts résiduels des autres previews.
4. Régénérer Fléaux et l'ajouter à l'audit.
5. Rejouer le contrôle complet jusqu'à obtenir 100 % de blocs de lore source exacts.
