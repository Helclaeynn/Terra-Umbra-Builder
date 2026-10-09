# Audit complet des mécaniques — 9 octobre 2026

Le lot ajoute des commandes réelles aux ressources de Nature, aux capacités individuelles, au Neuro et aux effets ciblés. Les comptes, coûts, durées, quotas et mutations de PV sont vérifiés côté serveur. Les autres pouvoirs dont le résultat dépend d’une cible, du terrain ou d’une décision narrative restent assistés : une activation journalisée ne vaut pas résolution automatique.

## Périmètre et sources

**2 553 entrées canoniques versionnées** : 122 talents de Réalité, 1 187 talents de Vérité des dix Natures, 273 traits conditionnels, 227 capacités de Corruption, 231 objets de Vérité, 367 équipements et 146 augmentations. Les traits conditionnels peuvent décrire plusieurs variantes d’une même capacité ; ce total ne désigne pas 2 553 boutons. S’y ajoutent les 135 identifiants Mage construits, deux développements du second Spectre et les constructions typées du builder.

Sources : catalogues chargés par `truth/rules.ts`, révisions approuvées par Nature, règles de création et catalogue Réalité. Les textes complets sont conservés et confrontés aux commandes effectives. Les changements stockés uniquement dans le Compendium de production n’ont pas été comparés à cette copie versionnée.

L’[inventaire JSON exhaustif](live-mechanics-inventory.json) donne une ligne par entrée, sa source, sa couverture et ses limites. Les 635 entrées de Réalité et les 273 traits indiquent le fichier versionné et le sélecteur de leur définition ; `definitionSource` conserve la définition d’origine lorsque le texte est révisé. Les autres sources restent les identifiants d’articles du Compendium. Parmi les 367 équipements de Réalité, **190 sont suivis uniquement en inventaire, acquisition, attribution et affichage**, sans calcul mécanique ; 177 disposent d’un calcul ciblé, qui ne résout pas toutes leurs propriétés. Reproduction depuis `apps/api` : `npm run build`, puis `node scripts/audit-live-mechanics.mjs`. Les rapports individuels détaillent chaque famille :

| Famille | Rapport détaillé | Résultat principal du lot |
| --- | --- | --- |
| Réalité : talents, équipement, augmentations | [Audit Réalité](audit-reality-20261009.md), [635 lignes JSON](audit-reality-coverage-20261009.json) | Contextes fixes, récupération, protections, profils d’armes, chargeurs, adrénaline, Neuro |
| Garou, Khinae, Extral, Exilé, Aseryn, humain et Corruption | [1 075 capacités](audit-truth-capabilities-20261009.md) | Registre explicite de 110 définitions, activation, réactions, quotas, prérequis |
| Vampire | [71 talents et traits](audit-vampire-20261009.md) | Stase, prédation, Dernier Sommeil, ressources de Sang/Cour, entretien |
| Mage, Daemon, Angelus | [Ressources et constructions](audit-nature-resources-20261009.md) | Préparations, jets, Tension/Revers, Spectres, Faveur, Aura, Égide, Lame |
| Soutiens ciblés et réactions | [Huit capacités reliées au serveur](audit-targeted-reactions-20261009.md) | Suture, Réfection, Rune, Gardien, Caendis, AIDH et ripostes |
| Foudre et Paratonnerre | [Résolution électrique](audit-lightning-20261009.md) | Foudre standard, protection électrique, diversion personnelle et Edge avant/après |
| Effets sur PJ et PNJ | [Suivi des effets](audit-effects-20261009.md) | Horloges par round/activation/scène, ticks, cumul, traitement, huit presets |
| Objets de Vérité et traits gratuits | [Objets et traits](audit-truth-items-20261009.md) | Profils explicites distincts des descriptions et exceptions à arbitrer |

## Parcours désormais exécutés

- **Capacités personnelles** : la capacité réellement possédée détermine ses chiffres, son coût, sa révélation, ses prérequis, sa durée et son quota. Les bonus au prochain test ne s’appliquent qu’à la compétence choisie et sont consommés au bon jet. Les anciennes cases de bonus migrées ne permettent plus de contourner un quota. Les réactions de défense/réduction passent par la résolution d’attaque.
- **Mage** : composition d’un sort, Affinité, Maîtrise, Amplitude, portée et Canalisation ; investissement de PA, interruption, libération avec jet serveur, Tension, Décharge, Revers et Dormance. L’effet sur la cible reste à résoudre avec le MJ. Les Spectres de Méphisto suivent leur préparation propre, sans Tension de Mage.
- **Daemon** : lieu de Résonance validé par le MJ, Faveur divine contextualisée et consommée au prochain test pertinent ; coûts et quotas des pouvoirs fixes. Les propriétés corporelles de Forme supérieure sont réservées à l’état Révélé.
- **Angelus** : connexion, lieu saint, Aura courante et maximum, ouverture/recharge, sacrifices, Yeux, Ailes, Impulsion, Égide pendant la résolution spirituelle et Lame céleste. Les PV sacrifiés ne sont pas récupérables avant la fin prévue. Le maximum de blessures et le plafond de soins sont distincts. Dissiper la Lame ne soigne pas les PV sacrifiés.
- **Vampire** : entrer/sortir de Stase, récupération horaire confirmée, Surrégime, Cycle, Yang/Union, Ancrage et restauration MJ. Prédation soigne selon les PV effectivement retirés à la cible et le DR. Dernier Sommeil intervient aussi sur les dégâts périodiques ; son quota survit aux soins et aux changements de combat. L’entretien des pouvoirs actifs paie les PA à chaque round ou termine le pouvoir lorsque le paiement est impossible.
- **Neuro** : chargement des programmes réellement possédés, capacité de chargement, changement sous pression, attaques Neuro, programme de défense actif et sacrifice de copies chargées. La Défense Neuro conserve sa base propre ; l’Armure physique ne réduit pas automatiquement ces dégâts. Une copie sacrifiée est retirée de l’inventaire. Après le combat, un redémarrage sûr confirmé rétablit les emplacements grillés et vide le chargement, sans recréer de copie ni de licence.
- **Équipement** : propriétés numériques explicites, portée, Perforant, DGT fixes/Vigueur, Armure corporelle, armure portée et réductions par vecteur. Un chargeur est suivi par exemplaire ; tirer consomme une charge, recharger coûte 1 PA sous pression. Une réserve déclarée est décrémentée ; une réserve inconnue exige la confirmation de munitions réelles. Les profils inconnus restent visibles dans leurs règles.
- **Effets ciblés** : le MJ choisit source et cible, règle canonique ou effet arbitré, montant, échéance et horloge. Les ticks de dégâts/soins sont appliqués une fois, aux bornes prévues ; les effets ont un journal. Les venins à activation ne sont pas convertis arbitrairement en rounds. Cobra limite les dépenses physiques de la prochaine activation, en conservant les possibilités mentales/sociales. Compression/nettoyage paient leur action.

- **Soutiens et réactions** : Suture, Réfection vitale et Rune de Garde ont une cible réelle, une demande privée acceptée par le bénéficiaire ou le MJ, et des quotas côté bénéficiaire. Gardien de la Meute et Caendis redirigent l’attaque ; l’interposition AIDH relève sa défense. Riposte du Gardien suit le même agresseur ; Ashorn ouvre une attaque normale sans PA supplémentaire après une défense active réussie. Les conditions de contact, portée et intervention sont confirmées dans la fiction.

Le panneau personnel est repliable et regroupe ces commandes. Le panneau MJ permet le suivi ciblé des PJ/PNJ. Le combat conserve initiative, ordre des passes, choix direct de cible, défenses et résolution ; l’initiative reste fixe pour tout le combat.

## Limites restantes, identifiées après intégration

| Domaine | Ce qui reste assisté ou à intégrer | Conséquence pratique |
| --- | --- | --- |
| Cibles, oppositions, zones et support | Sorts, illusions, domination, autres soins/transferts et protections de groupe | Préparation/coût suivis ; MJ résout la cible et applique l’effet ciblé approprié |
| Réactions complexes | Autres ripostes/interpositions, chaînes de réactions, renvoi Neuro, interceptions, variantes de Foudre et zones électriques | Seules les réactions explicitement intégrées exécutent une riposte ou un changement de cible |
| Restrictions de PA | Crête de Mo’senine et autres PA réservés à une famille d’action | Crête reste une définition externe, non activable comme PA libre |
| Semi-immatérialité | Entre-deux-états impose aussi des interdictions physiques | Route externe : aucun bonus personnel activable sans suivi de ces restrictions |
| Frénésie et peur | Entrées/sorties, Impulsion, résistance et déclencheurs exacts | Aucun déclenchement déduit d’un simple changement de maximum de PV |
| Blessures spéciales | Anatomie, PV non régénérables par source, saturation des soins, faiblesse surnaturelle | Montants suivis par le MJ ; les soins ordinaires ne prouvent pas la résolution de ces exceptions |
| Horloges et maintien complexes | Début/fin d’activation validés explicitement par le MJ, préparation interrompue par événement, concentration adverse, changement de scène | Commandes de fin explicites ; aucune horloge réelle ne fait avancer la fiction |
| Charges et consommables particuliers | Ablatif, verrouillage/surchauffe, modes de rafale, consommations de rites, charges runiques | Pas de nombre de projectiles ou d’effet créé à partir d’un nom ; règles individuelles à appliquer |
| Corps et possessions narratifs | Forme animale vampire, arme hématique détaillée, compagnons, véhicule, installation, territoire | Le suivi de ressource ne crée pas automatiquement un profil complet |
| Autres quotas par bénéficiaire | Autres effets interpersonnels | Réfection vitale et Rune de Garde sont désormais suivies côté serveur ; les autres règles exigent encore un suivi dédié |
| Corruption | Dons/Rites/Faveurs, Souillure, admission, liens et Test de Bascule | Acquisition/récompenses suivies ; résolution narrative et procédures spécifiques encore nécessaires |
| Monde et perception | Réseaux, contrats, mémoire, immunités conditionnelles, sens, contraintes morphologiques | Texte complet accessible ; pas de succès, objet, information ou permission fabriqué par le calcul |
| Compendium en production | Modifications non versionnées en base | Audit limité aux règles sources de cette branche |

## Vérification, confidentialité et livraison

Les suites couvrent les fonctions pures, les routes avec PostgreSQL embarqué isolé, et le DOM des interfaces joueur/MJ. Elles vérifient coûts/quota, révélation et prérequis, mauvaise compétence, sauvegarde falsifiée, conflit de version, rejeu d’une requête, mort et plafonds de soins, propriétés des armes et programmes, source/cible des effets, changements de round/scène/scénario et accès révoqué.

Le MJ de la campagne peut suivre les mécaniques complètes ; un lecteur de fiche sans cette autorité ne gagne aucun droit de mutation. Les autres joueurs reçoivent portrait, identité publique, camp et état de blessure. Les PV numériques, réserves, talents, effets privés et ressources de Vérité ne sont pas ajoutés à leur projection publique. Les événements techniques détaillés sont réservés au propriétaire et au MJ.

Les nouveaux états sont dans les JSON de jeu et conservent des valeurs par défaut pour les anciennes fiches. Ce lot utilise les migrations additives déjà prévues dans la branche ; il ne réinitialise ni les personnages ni les séances. Validation locale réussie : compilations API/Web, suite API complète avec PostgreSQL embarqué, tests de règles, suite DOM complète et vérification du diff. La recette navigateur du lot précédent a réussi sur le commit `3ba7098da87c90511fc65e76644c196332e04ddb`, exécution CI `37932064645`. Aucun déploiement de production n’est effectué dans ce lot.

Le complément de soutiens/réactions ajoute les tests API de consentement, rejeu, confidentialité des PV, quotas reçus, portées, fenêtres de réaction et riposte à zéro PA, ainsi qu’un panneau repliable et des tests DOM. Voir le rapport ciblé pour les conditions et limites exactes.

La recette de ce complément a réussi sur `b2e9fe1f16ccf219b9e85c2d6eb9235117eddf90`, [CI `37940435998`](https://github.com/Helclaeynn/Terra-Umbra-Builder/actions/runs/37940435998) : API/PostgreSQL, UI, PDF, Chrome à 1 440/390/320 pixels et Compose. Le déploiement a été désactivé par le garde du serveur de production.

Le complément [Foudre/Paratonnerre](audit-lightning-20261009.md) ajoute deux résolutions dédiées sans changer le total canonique : attaque de Foudre standard à 20 m, marge + DGT 7, protections réellement électriques, réaction personnelle à 1 PA et 1/round, Edge avant/après. Les variantes, zones et effets sur circuits restent assistés.
