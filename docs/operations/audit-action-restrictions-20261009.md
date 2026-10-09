# Restrictions d’action, Frénésie et origine de la peur — 9 octobre 2026

Sources canoniques : `truth/extral-revision.ts` (Crête de Mosenine), `truth/exile-revision.ts` (Entre deux états), `compendium-realite-v9-rules.ts` (Charge, Stress & Frénésie augmentique), `compendium-verite-v7-khinae.ts` (Frénésie Garou/Khinae), `truth/khinae-revision.ts` (Furie de survie, Fureur croissante, Rage lucide) et `truth/daemon-revision.ts` (Fureur de la Corneille). Aucune valeur n’est obtenue en exécutant la prose.

## PA et semi-immatérialité

| Règle | Conséquence exécutée | Borne |
|---|---|---|
| Crête de Mosenine | Début de round, gratuit, 1/scène ; +1 PA physique réservé, plafond 4 et aucun cumul avec un autre gain direct | Pas de changement d’Initiative, de quota ou de PA par round ; pas de Tir, Neurocombat, magie ou autre action avec ce point |
| Entre deux états | 1 PA en combat, 1/scène ; état conservé jusqu’à fin de scène | Aucune attaque physique ni manipulation lourde ; pas de bonus global à Esquive ou Défense passive |
| Défense d’Entre deux états | +3 à la Défense active contre le purement physique | Défense normalement payée ; aucun bonus contre Foudre, Neuro, Occulte, surnaturel ou biphysique |
| Sortie d’Entre deux états | Commande dédiée au début de l’activation, sortie matériellement possible confirmée | Un acte mental payé ferme aussi cette fenêtre ; le bouton générique de fin de pouvoir ne contourne pas la restriction |

`live-action-restrictions.ts` suit le point réservé comme une part du total de PA. Les usages ordinaires conservent la réserve ; le premier acte admissible peut la consommer. Les compteurs de round existants font expirer la réserve ; la limite de scène demeure. Un changement de Révélation enregistré ne supprime pas l’interdiction d’action tant que l’état semi-immatériel persiste.

Les bonus qui exigent R deviennent inactifs en SR/V. Cela n’efface pas artificiellement la Frénésie ou l’interdiction d’action encore suivie. Les Défenses actives retiennent la meilleure circonstance équivalente : Entre deux états +3 et une autre circonstance +3 ne deviennent jamais +6 ; les extras manuels explicitement additifs restent identifiés séparément.

## Frénésie et Stress

La Frénésie contient son origine, sa source, sa cause et une Impulsion définie. Une entrée volontaire nécessite le Talent acheté réellement utilisable. Une Frénésie imposée ou une crise augmentique nécessite une cause déclarée avec le MJ. Le profil ne suppose aucune Frénésie du seul fait que le personnage soit Paniqué.

- **Asulf — Fureur croissante** : activation de 1 PA en combat conformément à son accès canonique ; +1 aux tests physiques le premier round, +2 le suivant, +3 ensuite. Une interruption remet la progression à zéro. Un nouveau combat ne fait pas artificiellement vieillir ou remettre à zéro une Frénésie ininterrompue.
- **Rage lucide** : uniquement en Frénésie volontaire avec le Talent utilisable ; ignore le −3 calme/concentration et conserve la reconnaissance des proches. L’Impulsion reste due.
- **Fureur de la Corneille** : Talent Morrighan réel et Révélé ; +3 aux tests physiques, aucun PA supplémentaire et aucun cumul de bonus équivalents.
- **Frénésie augmentique** : test Volonté + Maîtrise spirituelle DD15 à l’égalité, DD18/21/25 à dépassement 1/2/3+. Si Charge et Stress déclenchent ensemble, un seul test avec la plus forte DD. Ni réussite ni mise en Frénésie ne sont déclenchées automatiquement par un rafraîchissement de page.
- **Sortie** : Volonté + Maîtrise spirituelle DD15, DD12 si la cause a disparu ; un échec narratif demeure un échec malgré un total suffisant. Aucun coût ou quota de sortie absent du texte n’est inventé.
- **Impulsion** : au moins 1 PA réellement payé par round lorsqu’elle est possible. Le dernier PA ne peut être dépensé ailleurs avant cela ; l’impossibilité doit être arbitrée par le MJ. Le système ne sélectionne jamais une cible et ne force aucune attaque.
- **Obstacle reconnu** : lorsqu’un proche empêche physiquement l’Impulsion Garou/Khinae, le MJ peut faire le test prévu DD15. Un échec rend cet obstacle hostile pour le round seulement. Cela n’autorise pas automatiquement une attaque gratuite.

La peur est stockée séparément du Stress général et des blessures. La Frénésie Garou/Khinae et les formes volontaires concernées suspendent uniquement ses conséquences ; la même peur réapparaît après sortie. La douleur, le Stress d’une autre origine et les paliers de PV demeurent. Le texte augmentique ne donne pas implicitement l’immunité à la peur du sous-système Khinae.

## Furie de survie

Le moteur reçoit les PV avant/après une **perte réelle** et un maximum fixe. La première traversée sous50%, puis sous25%, est suivie séparément pour la scène. Le prochain test physique gagne +3 avant la fin du round suivant ; un autre test ne consomme pas le bénéfice. Des circonstances équivalentes gardent leur meilleure valeur.

Un soin puis une nouvelle blessure au même seuil ne recharge pas le Talent. Un changement de forme/Révélation ou du maximum ne constitue jamais un déclencheur. Le suivi ne supprime aucun malus de blessure et n’accorde aucun PA.

## Validation

`check-action-restrictions.mjs` et `check-live-frenzy.mjs` vérifient les fonctions pures, les fenêtres, les réserves, les oppositions, les échéances, les sources du Stress et les limites de seuil. `check-remaining-actions-integration.mjs` ajoute la validation des chemins API : accès propriétaire/MJ, confirmations, conservation des états au save, rejouage exact, coûts réels, refus d’un bouton générique de sortie et projection restreinte des autres joueurs.

Les images, liens, choix fictionnels d’Impulsion, appartenance réelle à une Meute, validité d’un obstacle et disparition de la cause sont des informations de jeu à confirmer. Leur suivi ne prétend pas détecter ou décider la fiction à la place du MJ.
