# Questions regroupées des lots (30/10)

Chaque question a une recommandation. **Par défaut, la recommandation s'applique.** L'auteur répond « ok » ou cite les numéros qu'il refuse. Le détail (options, exemples) est dans la section « Questions » de chaque lot.

## A. Décisions transversales

- **A1. Source qui fait foi** quand le site V7, le livre V6 et les JSON du Builder divergent : **le site V7** (plus récent, arbitrages du 30 septembre inclus). Le livre est corrigé au prochain export. Un écart d'équilibrage repris du livre est marqué comme correction. Conséquence : l'Angelus prend les baisses de PTV annoncées sur le site (Proportion, Extase apaisante, Prison onirique).
- **A2. Paliers doubles** : quand deux talents d'origine ont le même coût, ils partagent un palier (IIa, IIb), chacun acheté à part. Aucun coût ne bouge. (Humains, Angelus, Aseryn, Extrals.)
- **A3. Ce qui n'est pas un pouvoir de Nature** passe en Réalité (XP) : les 82 entrées profanes des Exilés et la majorité des 65 entrées d'organisation des Extrals. Le PTV reste seulement pour une manière d'agir propre à une faction de Vérité (ex. REPTILE, Doctrine du Géant).
- **A4. Doublons entre Natures** (appliqué d'office par la charte) : les 7 talents Garou homonymes du Vampire sont renommés côté Garou ; la Rémanence nocturne du Daemon ne copie plus les pouvoirs Vampire (forme fixe propre à Diablo) ; les Sangs vifs Khinae seront réécrits avec le ressort de l'espèce, dans un lot séparé.

## B. Baisses de pouvoirs trop forts

- **B1. Garou** : Corps Enchaîné, le +1 PA n'arrive qu'au 2e round en Révélé.
- **B2. Khinae** : hybrides Grand Félin Armure 2 → 1, Crocodilien Armure 4 → 3.
- **B3. Humains** : Saignée noire 1/scène et par cible ; Sceau du Silence limité à une capacité. Puits d'Absence inchangé.
- **B4. Angelus** : Offrande limitée à une fois par scène ; Silence magique seulement contre les sorts qui te visent ou visent un allié à 10 m.
- **B5. Aseryn** : Réflexe impossible ne marche pas si l'Aseryn est Surpris.
- **B6. Exilés** : Encore debout passe à 1/scénario.
- **B7. Daemon** : les 9 Faveurs « +3 » réécrites en changeant de levier (moment, cible, information), sans renforcement.
- **Gardés tels quels**, malgré leur force : Protection du Mageius (+3 Défense occulte, s'éteint en Dormance) ; Instinct de Guerre de Baal (+2 attaques, offensif) ; Foudre de l'Aseryn sans ressource.

## C. Questions propres à une Nature

- **C1. Khinae** : 14 paliers II tirés des fiches du Bestiaire, marqués « Proposition à valider » ; 6 autres restent à écrire.
- **C2. Khinae** : une Impulsion de Frénésie propre à chaque Lignée (une ligne par carte).
- **C3. Humains** : pour un Humain, la mention SR ou R dit seulement ce que voient les témoins ; aucun état nouveau.
- **C4. Humains** : une seconde tradition s'ouvre par la fiction (transmission réelle), sans coût d'entrée.
- **C5. Humains** : la piste de Qi garde ses 5 positions.
- **C6. Humains** : les deux talents d'information de la Table Ronde deviennent gratuits (baisse de coût marquée).
- **C7. Mage** : l'Œuvre personnelle est au palier III de Généalogie d'idées (on reçoit avant d'inventer).
- **C8. Daemon** : le Spectre amplifié est limité à un usage Significatif par scène.
- **C9. Daemon** : trois ajouts du lot sont à valider : un plafond de survie par scène, une Maîtrise de Fonction et une Fureur de la Corneille propre au Daemon (qui ne passe plus par la Frénésie Garou).
- **C10. Aseryn** : les 46 talents sans accès noté deviennent V/SR/R (Traditions, Ancêtres), et SR/R pour l'Ascendance du Serathèen.
- **C11. Aseryn** : Foudre du Silence passe à DGT 8 (léger écart), pour servir hors des Fléaux.
- **C12. Exilés** : le Thulkar reçoit trois talents en SR/R (il n'a aucun trait), et la « physiologie robuste » whurtenne est complétée à partir des sources.
- **C13. Exilés** : l'accès aux traditions suit les codes du Socle (N, O, R, X), peuple par peuple.
- **C14. Exilés** : l'Optique de Vérité reste à 1 PTV (le prix de l'appareil sert de frein).
- **C15. Extrals** : le banc rocréen (réseau télépathique) s'ouvre aux non-télépathes.

## D. Problèmes de source signalés (pour information)

- JSON du Builder très incomplets : Exilés 23 talents sur 184, Angelus 32 sur 114, Aseryn 50 sur 100, Extrals 31 fiches ; Humains seulement la Doctrine commune (coûts pris dans `apps/api/src/rules/truth/hunter-revision.ts`). `exile/01.json` et `manifest.json` vides ; `full/humain.manifest.json` cite un `part05` absent.
- Divergences site / livre / JSON sur plusieurs coûts en PA et en PTV (détail dans chaque lot).
- Daemon : Moloch et Seere sans Faveur jouable ; Sytry porte une restriction « physiologie féminine » ; la Rémanence prophétique manque au catalogue.
- Mage, moteur non modifié : le renvoi « §8 » est cassé, les « Techniques » n'ont pas de liste, et le texte ne dit pas si on peut lancer un sort en Semi-Révélé.
- Le sigle HDS n'est défini nulle part dans le chapitre Garou.
