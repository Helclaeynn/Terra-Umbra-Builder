# Lot 03 — Humains et Chasseurs en voies à paliers

Lot complet du 29 octobre 2026, appliqué par défaut (veto de l'auteur possible). Sources : `rapports/03-humains-chasseurs.md`, `corpus/entrees/entries-Vérité_humain.txt`, chapitre Humains & Chasseurs, Socle Vérité (chapitre 7), livre Vérité V6 (livre III). Coûts : arbitrages Chasseurs du 30 septembre 2026 (`apps/api/src/rules/truth/hunter-revision.ts`).

## 1. En bref

- **Architecture** : Nature (Humain conscient, gratuite ; « Chasseur reconnu » est un statut, pas une Nature) → Doctrine commune (une voie, ouverte à tout véritable Chasseur) → une tradition parmi 13, chacune avec ses propres voies → statuts narratifs hors PTV (Association, GT, Hunt, rangs, armes de Merlin).
- **266 entrées → 59 cartes** : 1 carte de Nature + 58 voies (1 en progression, 1 à deux portes, 56 à une porte).
- **Aucun pouvoir supprimé, aucune fusion.** Les doublons entre traditions restent séparés : chaque tradition garde son ressort propre. Deux paires identiques mot pour mot reçoivent un ressort nouveau ; les autres ont déjà le leur, signalé dans la voie.
- **Ce qui change vraiment** : chaque tradition n'est plus un catalogue de 20 talents. Elle se lit en 2 à 6 voies, avec une entrée et un ordre. Les règles cachées dans des talents remontent dans l'en-tête de tradition (accès, piste de Qi, règle des sceaux). Les profils « définis avec le MJ » deviennent des listes fermées.
- **Corrections** : 7 notes de développement retirées ; 23 en-têtes sans PA ou contradictoires corrigés ; un en-tête tronqué (Grande Chasse) réparé ; 3 blocs d'Accès sortis des talents.

## 2. Carte de Nature (gratuite)

> **HUMAIN CONSCIENT** · Nature · Gratuit
>
> **Humain conscient** : il connaît la Vérité, mais l'Hologramme peut encore corriger ses souvenirs. **+1 Volonté permanent** ; ni package racial, ni encyclopédie gratuite, ni détection de V.
>
> **Statut de Chasseur reconnu** (pas une Nature) : il agit durablement dans la Vérité et l'Hologramme le reconnaît. Les corrections civiles ordinaires n'effacent plus ce qu'il a réellement vu. Ce statut naît de la fiction ; il ne s'achète pas en PTV.
>
> **V / SR / R** : un Humain n'a pas de Vérité à Révéler et n'a pas d'états propres. Les mentions V, SR et R des voies sont celles du catalogue (voir question 1).
>
> **Limites** : aucune malédiction de Nature. Il reste humain : pas de vision de V, pas d'identification automatique, pas d'immunité aux pouvoirs qui altèrent explicitement l'esprit ou la mémoire.
>
> **Relation au Voile** : pas de jauge. Quand il neutralise une menace pour le Voile au profit d'un allié de Vérité, c'est la jauge de cet allié qui en profite.

**Qui peut suivre ces voies** (décision du Builder, rappelée par la passation) : à la création, le parcours de Chasseur est **réservé aux Humains**. Certaines traditions s'ouvrent ensuite **en progression**, sur choix explicite, à d'autres Natures qui gardent leur propre carte : les **Lavandières** aux Vampires seulement, la **Chasse Fantastique** aux Exilés, les **Lueurs d'Azménor** aux Azménoriens, le **Xenoshield** aux Extrals qui l'ont infiltré sans qu'il le sache. Un Chasseur d'une autre Nature garde la jauge de Relation au Voile de sa Nature.

*Correction du 30/10* : la première version présentait « Chasseur reconnu » comme une Nature et ne disait rien de la restriction de création. Corrigé.

Jamais achetés en PTV : Association des Chasseurs, habilitations GT, Hunt100 et Hunt15, Observers, Confrérie du Bestiaire, rangs de la Vénerie, ressources de l'Église, compagnons (Djinn, Shikigami, monture), armes de Merlin, reliques et prototypes.

## 3. Les voies

**Lecture des voies (vaut pour toute la famille)**

- Le palier d'un talent est son coût d'origine : I = 1 PTV, II = 2 PTV, III = 3 PTV. Aucun coût n'a changé.
- On achète une voie dans l'ordre : le palier I d'abord. Quand un palier porte plusieurs talents, chacun s'achète à part, dans l'ordre voulu. Un prérequis d'origine plus précis est indiqué entre parenthèses (« après … »).
- Deux voies (Arts du Djinn, Shikigami) commencent par une **Entrée à 2 PTV** : le lien avec le compagnon, qui coûte 2 PTV à l'origine.
- V + MS = Volonté + Maîtrise spirituelle. « Blessure » = au moins 1 dégât réel. « Identifié » = établi en jeu (enquête, talent, expérience).

### 3.1 Doctrine commune

Ouverte à tout véritable Chasseur, quelle que soit son origine. Elle ne remplace pas une tradition.

#### Doctrine de Chasse — 1 porte
*Expérience de l'horreur, maintien de la chasse, lecture de la faiblesse, mise à mort.*
*Reprend : Rompu aux horreurs, Fenêtre de chasse, Frapper la faiblesse, Mise à mort préparée.*

- **I (1 PTV) · Rompu aux horreurs** (V/SR/R, passif) : une famille de créatures que tu as identifiée et réellement affrontée ne te cause plus de Stress par sa seule apparence ou Révélation. Ses actes et ses pouvoirs, si.
- **II (2 PTV) · Fenêtre de chasse** (V/SR/R, réaction 1 PA, 1/round) : quand une proie identifiée et perçue déclenche une fuite (disparition, transformation, passage de seuil, extraction), tu agis avant : une action simple pour maintenir la chasse (te déplacer, fermer une porte, saisir, activer un dispositif). Ni attaque, ni annulation, ni suivi d'une téléportation déjà faite.
- **II (2 PTV) · Frapper la faiblesse** (V/SR/R, 1/scène, sans PA) : une action offensive réussie qui exploite une vulnérabilité réelle identifiée applique une Altération cohérente, même si la marge n'en donnait pas. Jamais une seconde Altération, jamais de dégâts en plus.
- **III (3 PTV) · Mise à mort préparée** (V/SR/R, 2 PA) : sur une cible à 0 PV, inconsciente, totalement immobilisée ou sans défense, tu appliques une méthode durable que tu connais et possèdes. Elle tue ou maintient neutralisé ; ni régénération ni retour ordinaire pendant la scène. Ne contourne pas phylactère distant, clone, incarnation de remplacement ou résurrection divine.

**Changements** : aucun. Signalé : la page « Traditions de Chasse » totalise 262 talents ; c'est sans les 4 de la Doctrine (266 au total). Elle dit aussi « treize traditions » : c'est juste, la Doctrine n'en est pas une.

### 3.2 Lavandières

Accès : naturel pour une véritable Lavandière, restreint pour un Vampire recruté, impossible pour un non-Vampire. Une trace de sang ne livre jamais Cour, Sang, âge ni position.

#### Lavandières — 1 porte
*Suivre la souillure d'un Vampire, le reconnaître sous tous ses masques, l'empêcher de se soustraire.*
*Reprend : Lire la souillure, Sang sous le masque, Saignée noire, Clouer au corps.*

- **I (1 PTV) · Lire la souillure** (SR/R, 1 PA) : sur un échantillon de sang accessible : Vampire, Moroï ou Strygoï ? Deux échantillons du même individu ? Son nom seulement si tu le connais. Ni Cour, ni Sang, ni Talents, ni âge, ni position.
- **II (2 PTV) · Sang sous le masque** (SR/R, passif, après Lire la souillure) : à 10 m, avec du sang frais perceptible ou un nouvel échantillon, tu reconnais une signature déjà connue malgré déguisement, Visage volé, Mue ou changement d'état. Tu ne vois pas la forme de Vérité d'une cible Voilée.
- **II (2 PTV) · Saignée noire** (R, 1/round, sans PA) : après une attaque de Pugilat ou de Mêlée qui blesse un Vampire, un Moroï ou un Strygoï, V + MS contre sa Défense occulte. Réussite : un de ses Sangs est éteint jusqu'à la fin de sa prochaine activation. Nature, états, Cour, talents communs et autres Sangs restent ; la Prédation blesse mais ne soigne plus.
- **III (3 PTV) · Clouer au corps** (R, réaction 1 PA attaque comprise, 1/scène) : quand un Vampire à portée de ton arme déclenche une fuite qui soustrait son corps à la chasse, tu attaques avant. Blessure : l'activation échoue, ses PA et son usage sont perdus. Ne bloque ni la Stase ni Dernier sommeil.

**Changements** : bloc d'Accès sorti de Clouer au corps vers l'en-tête (correction). Saignée noire inchangée : c'est la décision du 30/09 (opposition et extinction d'un Sang), qui explique la crainte qu'inspirent les Lavandières.

### 3.3 Chasseurs catholiques

Les locaux, armureries, dossiers, véhicules et contacts de l'Église sont des ressources institutionnelles, jamais des Talents. Un rite exige une cible ou une relation surnaturelle réelle : consacrer ne crée pas de faiblesse, juger ne crée pas de culpabilité.

#### Liturgie de terrain — 2 portes
*Le langage rituel commun aux trois ordres.*
*Reprend : Consécration de terrain, Sanctuaire provisoire, Restaurer le sacré, Signe de fermeté, Intercession, Derniers rites.*

Porte A — **Le sacré**
- **I (1 PTV) · Consécration de terrain** (SR/R, 1 minute ou 1 PA sous pression) : un objet tenu, 1 litre ou 1 m² au contact devient Sacré pour la scène ou pour le rite qui suit. Ne crée ni arme, ni dégâts, ni faiblesse ; une profanation active peut s'y opposer.
- **II (2 PTV) · Sanctuaire provisoire** (SR/R, 1 minute ou 2 PA sous pression) : rayon de 3 m autour d'un support consacré, pour la scène. La première intrusion extérieure par round (possession, malédiction, corruption, intrusion spirituelle) doit d'abord vaincre ton jet de V + MS, fixé au rite. N'arrête pas les coups physiques.
- **II (2 PTV) · Restaurer le sacré** (SR/R, 1 PA au contact, ou 10 minutes pour une zone de 3 m) : V + MS contre la Puissance d'une profanation active ; réussite, le support redevient Sacré. Ne consacre pas ce qui ne l'a jamais été.

Porte B — **La fermeté**
- **I (1 PTV) · Signe de fermeté** (SR/R, réaction 1 PA, 1/scène) : après un échec non narratif à une résistance contre peur, terreur, désespoir ou compulsion surnaturelle, relance le d10e. Le second résultat est définitif.
- **II (2 PTV) · Intercession** (SR/R, réaction 1 PA, 1/round, 10 m) : un allié résiste à un effet mental, spirituel ou de corruption ; tu pries, touches ou protèges. Il gagne +3 (Assistance surnaturelle, permise en combat). Une seule Assistance par test.
- **II (2 PTV) · Derniers rites** (SR/R, rituel d'une minute au contact) : sur un mourant ou un mort depuis moins d'une heure, jusqu'à la fin de la scène, possession du cadavre, capture de l'âme ou réanimation spirituelle doivent vaincre ton V + MS. Ne ressuscite personne, ne retient pas une âme déjà partie.

**Changements** : forme à deux portes (le sacré des lieux, la fermeté des âmes). En-tête de Signe de fermeté corrigé (réaction 1 PA). Note de développement retirée d'Intercession (« Conserver l'exception +3 et 2 PTV »).

#### Arianwen · Escouade — 1 porte
*La traque se fait à plusieurs.*
*Reprend : Chasse en escouade, Relais de chasse, Couverture croisée, Battue sacrée.*

- **I (1 PTV) · Chasse en escouade** (V/SR/R, 1 PA) : Assistance +2 à l'attaque d'un allié, même en combat, si tu as la Compétence pertinente à 1+ et peux réellement intervenir. Une seule Assistance.
- **I (1 PTV) · Relais de chasse** (V/SR/R, réaction 1 PA, 1/round) : quand un allié à 10 m pourrait utiliser Fenêtre de chasse, il te la cède. Tu paies le PA et fais l'action simple à ta portée ; lui ne paie rien. Ni seconde réaction ni attaque.
- **II (2 PTV) · Couverture croisée** (V/SR/R, réaction 1 PA, 1/round) : quand une proie identifiée attaque un allié à 10 m que tu peux aider, +2 à sa Défense active, malgré l'interdiction normale d'Assistance en combat.
- **III (3 PTV) · Battue sacrée** (R, passif) : deux membres de l'escouade perçoivent la même proie identifiée depuis deux positions distinctes à 20 m. Ses capacités de fuite immédiate coûtent +1 PA (maximum 3, sans cumul de battues).

**Changements** : aucun. Ressort déjà distinct de la Battue volante (Chasse Fantastique) : ici une proie identifiée par l'escouade ; là une proie marquée par un Limier.

#### Arianwen · Tenir la proie — 1 porte
*Empêcher le monstre de rompre le contact ou de changer de corps.*
*Reprend : Tenir le monstre, Briser la mue, Clouer la proie.*

- **I (1 PTV) · Tenir le monstre** (V/SR/R, réaction 1 PA, 1/round) : quand une proie au contact recule pour rompre le corps-à-corps, suis-la (un Déplacement au plus) ou saisis un appui pour rester au contact. Se dégager par la force reste un test de Pugilat normal.
- **II (2 PTV) · Briser la mue** (R, réaction 1 PA attaque comprise, 1/scène) : quand une proie perçue commence une transformation corporelle, attaque avant. Blessure : V + MS contre la Puissance de la transformation ; réussite, elle échoue et son coût est perdu.
- **II (2 PTV) · Clouer la proie** (R, 1/scène, sans PA) : après avoir blessé une proie identifiée, choisis un mode de fuite corporelle vu ou identifié. Il coûte +1 PA (maximum 3) jusqu'à la fin de sa prochaine activation.

**Changements** : aucun.

#### Arianwen · Armes consacrées — 1 porte
*L'arme et la munition sacrées.*
*Reprend : Plaie consacrée, Frapper l'immatériel, Purification balistique, Salve de purification, Tueur de l'impossible.*

- **I (1 PTV) · Plaie consacrée** (R, passif) : une blessure infligée par un moyen réellement Sacré ne peut pas être régénérée surnaturellement jusqu'à la fin de la prochaine activation de la cible. Médecine et soins externes restent possibles.
- **II (2 PTV) · Frapper l'immatériel** (R, passif) : ton arme consacrée frappe une manifestation spirituelle ou un corps partiellement immatériel suffisamment présent. Pas une cible absente ou dans un autre plan.
- **II (2 PTV) · Purification balistique** (R, passif) : une munition Angélique ou Sacrée compte comme moyen divin contre une faiblesse réelle et porte jusqu'à l'impact tes effets attachables à l'attaque. Blessure : une Protection fondée sur la profanation ou l'impureté, réellement vulnérable au sacré, est suspendue jusqu'à la fin de la prochaine activation de la cible.
- **III (3 PTV) · Salve de purification** (R, 2 PA, 1/scène) : tir de suppression consacré avec munitions Angéliques (gabarit et munitions de l'arme). Jusqu'au début du prochain round, les entités exposées ne peuvent ignorer la salve par une dissimulation, une phase ou une Protection fondée sur l'impureté.
- **III (3 PTV) · Tueur de l'impossible** (R, après Mise à mort préparée) : lors d'une Mise à mort préparée après neutralisation sacrée, tu scelles un support consacré dans le corps. Tant qu'il reste en place et consacré, la cible ne peut revenir par ce corps ou son ancrage local. Aucun PA en plus.

**Changements** : Purification balistique clarifiée (« porter les Talents » devient « porter les effets attachables à l'attaque », repris de ses conditions). Ressort déjà distinct des autres armes de Vérité : ici le moyen Sacré, à distance comme au contact.

#### Ephraïm · Discernement — 1 porte (courte)
*Savoir qui occupe un corps, et ce qui l'y tient.*
*Reprend : Présence étrangère, Lire l'ancrage.*

- **I (1 PTV) · Présence étrangère** (SR/R, 1 PA, 10 m) : par une prière à voix haute, tu sais si une présence spirituelle étrangère (possession, parasite) est attachée à une personne ou un objet. Une présence cachée oppose sa Puissance à ton Esprit + Perception. L'occupant détecté sait qu'il a été vu. Ne détecte pas une Nature.
- **II (2 PTV) · Lire l'ancrage** (SR/R, 1 PA, 10 m) : sur une possession ou un lien identifié, tu perçois son ancrage principal (corps, objet, serment, lieu, marque, nom, relation). Ni la manière de le détruire, ni les ancrages secondaires.

**Changements** : **ressort propre ajouté** à Présence étrangère : la prière se fait à voix haute et l'occupant se sait repéré. Avant, le texte était identique mot pour mot à Présence parasite (Onmyoji).

#### Ephraïm · Seuils — 1 porte
*Tracer, fermer, enfermer.*
*Reprend : Ligne de sel, Cercle d'Ephraïm, Fermer le seuil, Chambre blanche.*

- **I (1 PTV) · Ligne de sel** (SR/R, 1 PA au contact, scène) : avec un support rituel, trace 2 m de ligne. Une entité spirituelle, immatérielle ou possessive qui veut la franchir surnaturellement doit vaincre ton V + MS, fixé au tracé. Une rupture matérielle la brise ; elle n'arrête pas une personne matérielle.
- **II (2 PTV) · Cercle d'Ephraïm** (SR/R, rituel de 10 minutes, après Ligne de sel) : ta ligne se ferme en cercle de 3 m de rayon jusqu'à rupture ou fin de scène. Sortir ou entrer surnaturellement exige de vaincre l'opposition. Une rupture matérielle le brise.
- **II (2 PTV) · Fermer le seuil** (SR/R, 1 PA au contact, scène) : consacre un passage précis (porte, fenêtre, brèche, portail matériel) de 3 m au plus. Possessions, intrusions spirituelles et passages immatériels doivent vaincre ton V + MS. Une créature matérielle peut encore l'ouvrir ou le détruire.
- **III (3 PTV) · Chambre blanche** (R, rituel d'une heure, 24 heures) : une pièce de 5 m de rayon au plus. Tant que ses limites restent intactes, une entité étrangère à l'hôte ne peut se téléporter spirituellement, posséder une nouvelle cible ou se projeter hors du corps sans vaincre ton V + MS. Ses autres pouvoirs restent.

**Changements** : note de développement retirée du Cercle (« garder 2 PTV »). Ressort déjà distinct du Sceau de Fermeture (Onmyoji) : Fermer le seuil est une consécration immédiate, sans préparation ni support.

#### Ephraïm · Exorcisme — 1 porte
*Faire parler l'occupant, le repousser, l'expulser, le renvoyer.*
*Reprend : Faire parler l'occupant, Distinguer l'hôte, Prière de bannissement, Purge, Renvoi, Grand exorcisme.*

- **I (1 PTV) · Faire parler l'occupant** (SR/R, 1 PA, 10 m) : sur un hôte dont la présence étrangère est établie, V + MS contre la Défense occulte de l'entité. Réussite : elle se manifeste assez pour entendre et répondre jusqu'à la fin du prochain round. Elle peut mentir ; elle n'est pas expulsée.
- **II (2 PTV) · Distinguer l'hôte** (SR/R, passif) : une fois l'occupant identifié, tes exorcismes et effets spirituels le visent sans traiter le corps de l'hôte comme la cible. Une attaque physique reste physique.
- **II (2 PTV) · Prière de bannissement** (SR/R, 1 PA, 10 m) : sur une présence manifestée ou rendue ciblable, V + MS contre Défense occulte. Réussite : elle recule de 3 m et ne peut reprendre le même hôte avant la fin de sa prochaine activation.
- **III (3 PTV) · Purge** (R, 2 PA, 1/scène, au contact) : sur un hôte vivant portant une présence étrangère identifiée, V + MS contre la Défense occulte de l'occupant. Réussite : la possession est rompue et l'occupant expulsé, pas détruit.
- **III (3 PTV) · Renvoi** (R, 2 PA, 1/scène, 10 m) : sur une entité expulsée, manifestée ou contenue, nomme son domaine d'origine accessible avant le jet, puis V + MS contre sa Défense occulte. Réussite : elle y est renvoyée. Sans effet sur une créature qui est chez elle dans ce monde.
- **III (3 PTV) · Grand exorcisme** (R, rituel d'une heure au moins) : contre une possession majeure, une entité très puissante ou une contamination enracinée. Avant le rite, la fiche rituelle fixe ancrage, participants, conditions et Puissance ; puis même opposition. Réussite : la possession est rompue durablement ou la présence majeure renvoyée. Ne détruit pas une Nature.

**Changements** : aucun. Ressort déjà distinct de l'Extraction par le Sceau (Onmyoji) : Ephraïm expulse par la prière en un temps ; l'Onmyoji doit d'abord faire comparaître, puis sceller.

#### Magdalena · Enquête — 1 porte
*Peser une âme, lire une marque, remonter une chaîne.*
*Reprend : Pesée de l'âme, Main de l'Inquisiteur, Lire la marque, Suivre la chaîne.*

- **I (1 PTV) · Pesée de l'âme** (SR/R, 1 PA, 10 m) : face à une altération surnaturelle soupçonnée, tu sais si l'âme de la cible porte une influence extérieure active. Jamais une lecture morale (« est-ce quelqu'un de mauvais ? »).
- **I (1 PTV) · Main de l'Inquisiteur** (SR/R, passif) : tu peux saisir et manipuler un objet porteur d'une influence spirituelle dangereuse sans que le simple contact la déclenche contre toi. Un effet actif hostile peut toujours t'attaquer. Pour toi seul.
- **II (2 PTV) · Lire la marque** (SR/R, 1 PA, 10 m) : sur une marque, bénédiction, pacte, sceau ou corruption déjà détectés, tu perçois sa fonction générale (contraindre, nourrir, protéger, appeler, surveiller, transformer). Ni ses clauses, ni son auteur.
- **II (2 PTV) · Suivre la chaîne** (SR/R, 1 PA, scène) : sur une marque ou un lien actif, tu sens la direction de l'autre extrémité, si elle est à 10 km au plus et dans le même plan. Ni distance ni adresse ; un anti-divination s'y oppose.

**Changements** : note de développement retirée de Lire la marque (« conserver le coût de 2 PTV »).

#### Magdalena · Jugement — 1 porte
*Juger une source, puis la sceller, la confisquer ou la rompre.*
*Reprend : Jugement, Mise sous scellés, Confiscation spirituelle, Faire comparaître la corruption, Briser le pacte, Excommunication surnaturelle.*

- **I (1 PTV) · Jugement** (SR/R, 1 PA, 10 m, 1/scène) : désigne une source surnaturelle identifiée. +3 à ton prochain rite de Magdalena contre elle avant la fin du prochain round. Ne crée ni culpabilité ni faiblesse.
- **II (2 PTV) · Mise sous scellés** (SR/R, 1 PA au contact, scène) : sur un objet ou support surnaturel, nomme une propriété identifiée. Chaque activation de cette propriété doit vaincre ton V + MS, fixé à la pose. Un support explicitement supérieur peut résister.
- **II (2 PTV) · Confiscation spirituelle** (R, 1/scène, sans PA) : après avoir désarmé ou neutralisé une cible d'un objet surnaturel lié, opposition à la Puissance du lien : le lien d'usage est suspendu pour la scène. L'objet n'est ni détruit ni acquis.
- **II (2 PTV) · Faire comparaître la corruption** (SR/R, 1 PA, 10 m) : une corruption ou influence extérieure déjà détectée devient distincte et ciblable par les rites de purification, de scellement ou de rupture jusqu'à la fin du prochain round. Une dissimulation oppose sa Puissance à ton V + MS. La cible n'est pas purifiée pour autant.
- **III (3 PTV) · Briser le pacte** (R, rituel d'une heure au moins) : sur un pacte imposé sans consentement réel, dont tu as identifié la chaîne et les clauses essentielles, victime et support accessibles, V + MS contre sa Puissance ou son garant. Réussite : le pacte est rompu durablement ; ses clauses de rupture peuvent se déclencher. Un pacte librement conclu tient.
- **III (3 PTV) · Excommunication surnaturelle** (R, 2 PA, 10 m, 1/scène) : sur une faveur, bénédiction, délégation ou canal extérieur identifié, V + MS contre sa source. Réussite : ce canal est suspendu pour la scène. Jamais une Nature, un Mageius, un Patron ou une identité divine.

**Changements** : note de développement retirée de Briser le pacte (« garder 3 PTV »). Ressort déjà distinct de Briser le pacte contraint (Khālsā) : Magdalena juge sur pièces et doit connaître les clauses ; le Khālsā tranche avec l'Arme du Serment, victime présente, sans connaître les clauses.

### 3.4 Khālsā

Tradition fictionnelle de Chasse : elle ne prétend pas décrire les pratiques réelles du sikhisme. Ses voies agissent sur des serments, emprises et entraves surnaturels identifiés, jamais sur une blessure, un poison ou une contrainte naturelle.

#### Arme du Serment — 1 porte
*Une lame consacrée qui frappe l'occupant et tranche l'emprise.*
*Reprend : Arme du Serment, Plaie fidèle, Trancher l'emprise, Coup de délivrance, Briser le rempart.*

- **I (1 PTV) · Arme du Serment** (SR/R, rituel de 10 minutes, puis passif) : une arme de mêlée que tu possèdes devient Sacrée et peut frapper une manifestation spirituelle ou partiellement immatérielle suffisamment présente. Une seule à la fois. Aucun bonus.
- **II (2 PTV) · Plaie fidèle** (R, passif) : une blessure infligée par l'Arme du Serment ne peut pas être régénérée surnaturellement jusqu'à la fin de la prochaine activation de la cible. Médecine et soins externes restent possibles.
- **II (2 PTV) · Trancher l'emprise** (R, 1 PA au contact, 1/scène) : touche ou frappe la source, l'ancrage, l'objet ou la manifestation qui maintient un effet surnaturel (attaque normale si hostile), puis V + MS contre sa Puissance. Réussite : l'effet maintenu s'interrompt. Ni Nature, ni propriété permanente, ni effet devenu autonome.
- **II (2 PTV) · Coup de délivrance** (R, 1/round) : contre une possession ou un parasite identifié, ton attaque normalement payée avec l'Arme du Serment vise l'occupant à travers l'hôte, contre la Défense de l'entité. Les dégâts touchent l'entité, pas le corps de l'hôte.
- **III (3 PTV) · Briser le rempart** (R, 1/scène, après Trancher l'emprise) : après une attaque réussie contre une barrière ou Protection surnaturelle active, renonce aux dégâts : V + MS contre sa Puissance. Réussite : la Protection est suspendue jusqu'à la fin de la prochaine activation de son bénéficiaire. Aucun PA en plus de l'attaque.

**Changements** : note de développement de Briser le rempart appliquée (aucun PA ajouté) puis retirée. En-tête de Trancher l'emprise complété (1 PA). Ressort déjà distinct des brèches d'autres traditions : l'Arme du Serment, consacrée longuement, au contact.

#### Devoir de Protection — 1 porte
*Se mettre entre l'emprise et celui qu'on protège.*
*Reprend : Veille du défenseur, Parole qui relève, Tenir la ligne, Prendre le fardeau, Refuge vivant.*

- **I (1 PTV) · Veille du défenseur** (SR/R, réaction 1 PA) : même Surpris, quand une manifestation surnaturelle attaque un allié au contact ou à 3 m sur un trajet libre, tu t'interposes et deviens la cible. Aucun PA ni défense en plus.
- **II (2 PTV) · Parole qui relève** (SR/R, réaction 1 PA, 1/scène par cible, 10 m) : un allié qui t'entend échoue (non narratif) à résister à peur, domination, désespoir, compulsion ou attaque de volonté surnaturelle : il relance le d10e. Le second résultat est définitif.
- **II (2 PTV) · Tenir la ligne** (R, 1 PA puis 1 PA par round) : tu tiens une ligne de 3 m devant toi. Une entité spirituelle, immatérielle ou en déplacement surnaturel doit vaincre ton V + MS pour la franchir. N'arrête ni course, ni véhicule, ni projectile.
- **III (3 PTV) · Prendre le fardeau** (SR/R, réaction 1 PA, 1/round, 10 m) : un effet surnaturel hostile à cible unique (malédiction, domination, possession, attaque mentale) vise un allié perçu : si tu es une cible valide, tu deviens la cible, avec tes propres protections. Pas contre une zone.
- **II (2 PTV) · Refuge vivant** (R, 1 PA puis 1 PA par round, après Prendre le fardeau) : une personne consentante au contact ou juste derrière toi (1 m) : toute tentative extérieure de possession, domination, malédiction ou lien hostile doit d'abord vaincre ton V + MS, puis se résout normalement contre elle. Quitter la position y met fin.

**Changements** : aucun. Ressort déjà distinct du Sacrifice de Tiph'ereth (Kabbale) : le Khālsā le fait chaque round, par devoir ; le Kabbaliste une fois par scène, par offrande.

#### Volonté libre — 1 porte
*Le droit de rester soi-même.*
*Reprend : Esprit sans maître, Déceler l'emprise, Refuser la souillure, Parole qui brise l'ordre, Libérer la volonté.*

- **I (1 PTV) · Esprit sans maître** (SR/R, passif, 1/scène) : au début de ta prochaine activation après avoir subi un contrôle surnaturel, une résistance supplémentaire gratuite contre sa Puissance. Ensuite, seules les résistances prévues par l'effet.
- **I (1 PTV) · Déceler l'emprise** (SR/R, 1 PA, 10 m) : tu sais si les actes actuels d'une personne sont directement contraints par une influence surnaturelle extérieure. Ni source, ni ordre, ni Nature ; pas la persuasion, le chantage ou l'addiction.
- **II (2 PTV) · Refuser la souillure** (SR/R, 1/scène) : quand une source surnaturelle extérieure devrait te donner de la Corruption, le gain baisse de 1 (minimum 0). Pas contre une Corruption recherchée ou une transformation devenue intrinsèque ; sans cumul avec une réduction équivalente.
- **II (2 PTV) · Parole qui brise l'ordre** (SR/R, 1 PA, 1/scène par cible, 10 m) : une personne sous domination ou compulsion surnaturelle qui t'entend fait immédiatement un nouveau test complet contre la Puissance actuelle, même si l'effet n'en prévoit pas.
- **III (3 PTV) · Libérer la volonté** (R, 2 PA, 10 m, 1/scène, après Déceler l'emprise) : contre un contrôle identifié, V + MS contre sa source. Réussite : la domination, compulsion ou contrôle est suspendu pour la scène. Une entité possessive peut rester, mais ne dirige plus l'hôte.

**Changements** : mention méta retirée de Libérer la volonté (« Ephraïm reste la référence pour l'expulsion »).

#### Briseur de chaînes — 1 porte
*Voir les liens, les trancher, empêcher qu'on les renoue.*
*Reprend : Voir les chaînes, Acier libérateur, Délier l'entrave, Briser le pacte contraint, Serment contre serment.*

- **I (1 PTV) · Voir les chaînes** (SR/R, 1 PA, 10 m) : sur une personne, un objet ou un lieu, tu perçois les liens surnaturels actifs vers l'extérieur (pacte, marque, chaîne, sceau, contrat occulte, ancrage, entrave) et s'ils contraignent ou nourrissent. Ni clauses, ni source exacte, ni localisation.
- **II (2 PTV) · Acier libérateur** (R, 1 PA au contact, 1/scène, après Voir les chaînes et Arme du Serment) : l'Arme du Serment frappe une chaîne surnaturelle identifiée : V + MS contre la Puissance du lien. Réussite : suspendu jusqu'à la fin de la prochaine activation de la cible ; le pacte n'est pas forcément détruit.
- **II (2 PTV) · Délier l'entrave** (R, 1 PA au contact, 1/scène, après Arme du Serment) : l'Arme du Serment frappe des chaînes magiques, liens spectraux, paralysies surnaturelles externes ou sceaux de contention : V + MS contre leur Puissance. Réussite : l'entrave est brisée. Pas une paralysie naturelle, une blessure ou un poison.
- **III (3 PTV) · Briser le pacte contraint** (R, rituel d'une heure au moins, après Acier libérateur) : victime présente, pacte identifié, Arme du Serment ou support : V + MS contre le pacte ou son garant. Réussite : un pacte imposé sans consentement réel est rompu durablement ; ses clauses de rupture peuvent se déclencher. Un pacte libre tient.
- **III (3 PTV) · Serment contre serment** (R, 1/scène, sans PA, après Briser le pacte contraint) : quand tu brises, suspends ou purges un lien hostile, tu prononces un Serment protecteur. La même source ne peut rétablir le même type de lien avant la fin de la scène sans vaincre ton V + MS.

**Changements** : note de développement retirée de Briser le pacte contraint (« deux prérequis exacts »). En-têtes d'Acier libérateur et Délier l'entrave complétés (1 PA).

### 3.5 Taoïstes

Les Gu et les Shimazu cultivent l'équilibre du Yin et du Yang ; les Shi historiques travaillent le Vide, un contact méthodique avec le Néant. Sentir un Qi perturbé ne révèle ni espèce, ni identité, ni fiche.

**La piste de Qi** (imprimée sur la fiche) : Yin profond ← Yin ← Équilibre → Yang → Yang profond. Tu commences à Équilibre. Une technique Yin ou Yang déplace d'un cran vers sa polarité, sans dépasser l'extrême ; un déplacement « direct » rejoint l'état indiqué. Les techniques se résolvent dans l'ordre d'usage. Transe de l'équilibre, Cycle contraire et Deux souffles, un corps sont les seules exceptions. Les extrêmes décrivent une circulation, pas une morale.

#### Fondamentaux du Qi — 1 porte
*Lire la circulation, puis la tenir en équilibre.*
*Reprend : Sentir le Qi, Souffle intérieur, Lecture des méridiens, Transe de l'équilibre.*

- **I (1 PTV) · Sentir le Qi** (SR/R, 1 PA, 10 m) : tu perçois le Qi d'une créature ou d'un phénomène présent : flux vivant cohérent, altéré, vide anormal ou circulation surnaturelle active. Ni espèce, ni fiche, ni identité ; une dissimulation active s'y oppose.
- **I (1 PTV) · Souffle intérieur** (SR/R, 1 PA, 1/scène) : pour la scène, tu survis sans respirer normalement et résistes aux agents qui ne passent que par l'inhalation. Pas les doses déjà reçues, ni le vide, ni la pression.
- **II (2 PTV) · Lecture des méridiens** (SR/R, 1 PA, 10 m, après Sentir le Qi) : sur une créature perçue, tu lis si une altération active est interne ou extérieure, si un méridien est bloqué ou surchargé, et où. Valable pour l'état observé dans la scène ; elle rend ces points ciblables par les techniques taoïstes.
- **III (3 PTV) · Transe de l'équilibre** (R, 2 PA, 1/scène, à Équilibre seulement) : pour la scène, ta première technique Yin et ta première technique Yang de chaque round ne déplacent pas la piste. Une polarité répétée la déplace normalement. La Transe cesse dès qu'un extrême est atteint.

**Changements** : les règles de la piste sortent de Transe de l'équilibre vers l'encadré de tradition (correction : c'était l'entrée la plus longue du fichier).

#### Voie du Yin — 1 porte
*Fermer les flux : bloquer, se taire, disparaître aux sens énergétiques.*
*Reprend : Paume Yin, Qi silencieux, Méridiens fermés, Nuit des cinq souffles.*

- **I (1 PTV) · Paume Yin** (SR/R, 1/round, sans PA, Yin +1) : après une attaque de Pugilat qui blesse, la cible ne peut bénéficier d'aucune récupération surnaturelle automatique de PV jusqu'à la fin de sa prochaine activation.
- **II (2 PTV) · Qi silencieux** (SR/R, 1 PA, scène, Yin +1) : les perceptions surnaturelles d'aura, de Qi, d'énergie vitale ou de signature spirituelle doivent vaincre ton V + MS, fixé à l'activation. Tu n'es ni invisible ni silencieux.
- **II (2 PTV) · Méridiens fermés** (SR/R, réaction 1 PA, 1/round, Yin +1, après Lecture des méridiens) : contre un effet qui veut agir à l'intérieur de ton corps, Défense active V + MS + d10e. Réussite : il ne s'ancre pas en toi.
- **III (3 PTV) · Nuit des cinq souffles** (R, 2 PA, 1/scène, Yin profond direct, après Qi silencieux) : pour la scène, les sens énergétiques ordinaires ne détectent plus ta vie ; une perception dédiée doit vaincre ton V + MS. Tu peux franchir les seuils qui exigent l'absence de souffle vivant. Tu restes vivant, matériel et visible.

**Changements** : aucun. Ressort déjà distinct des autres défenses spirituelles : chaque technique déplace la piste de Qi.

#### Voie du Yang — 1 porte
*Projeter les flux : frapper l'invisible, repousser, relancer.*
*Reprend : Paume Yang, Barrière Yang, Circulation vitale, Débordement Yang.*

- **I (1 PTV) · Paume Yang** (SR/R, 1/round, Yang +1) : ton attaque de Pugilat peut viser une entité spirituelle ou partiellement immatérielle présente. Réussite : jusqu'à la fin de sa prochaine activation, elle ne peut se dissimuler en supprimant sa propre présence énergétique.
- **II (2 PTV) · Barrière Yang** (SR/R, réaction 1 PA, 1/round, Yang +1) : contre une attaque surnaturelle directe perçue, Défense active V + MS + d10e si c'est mieux. Pas contre une balle ou une chute ordinaire ; jamais en plus d'une autre Défense.
- **II (2 PTV) · Circulation vitale** (SR/R, 1 PA, 1/scène, Yang +1, après Lecture des méridiens) : sur toi ou une cible consentante au contact, une fonction vitale bloquée surnaturellement (respiration, circulation, membre, conscience) repart : l'altération extérieure est suspendue un round. Ne soigne pas.
- **III (3 PTV) · Débordement Yang** (R, 2 PA, 1/scène, Yang profond direct, après Barrière Yang) : dans 3 m, possessions, influences maintenues et formes immatérielles : V + MS contre chaque Défense occulte. Réussite : recul de 3 m et manifestation distincte jusqu'à la fin du round. Ne détruit rien.

**Changements** : aucun.

#### Harmonie — 1 porte
*Organiser la tension entre les deux souffles.*
*Reprend : Cycle contraire, Renversement des souffles, Deux souffles un corps, Harmonie imposée.*

- **I (1 PTV) · Cycle contraire** (SR/R, passif) : après une technique Yin, ta prochaine technique Yang de la scène ramène le Qi d'un cran vers Équilibre au lieu de le pousser ; inversement. Une application par alternance, jamais un cran de plus.
- **II (2 PTV) · Renversement des souffles** (SR/R, réaction 1 PA, 1/scène, 10 m, après Cycle contraire) : une altération extérieure impose une polarité opposable (accélération ou stagnation, chaud ou froid énergétique, expansion ou contraction) à toi ou à une cible perçue : V + MS contre sa Puissance. Réussite : suspendue jusqu'à la fin de la prochaine activation de sa source.
- **II (2 PTV) · Deux souffles, un corps** (SR/R, passif, 1/round) : dans une même activation, une technique Yin puis une technique Yang (ou l'inverse), sans que le premier déplacement empêche la seconde. PA payés normalement ; la piste se calcule après les deux.
- **III (3 PTV) · Harmonie imposée** (R, 2 PA au contact, 1/scène, après Lecture des méridiens et Renversement des souffles) : sur une cible dont tu as lu les méridiens, V + MS contre Défense occulte. Réussite : jusqu'à la fin de sa prochaine activation, une source d'énergie surnaturelle choisie ne peut changer de forme, de polarité ou de régime. Ses pouvoirs compatibles continuent.

**Changements** : aucun. Voir question 4 sur la piste.

#### Art du Néant des Shi — 1 porte
*Sentir l'instant où un pouvoir naît, puis l'annuler ou le sceller dans le Vide.*
*Ouverture : Lecture des méridiens.*
*Reprend : Vacillement du Qi, Sceau de Vacuité, Paume des Shi, Grand Scellement des Shi.*

- **I (1 PTV) · Vacillement du Qi** (SR/R, passif, 10 m) : quand une créature perçue commence à utiliser un Talent Actif, tu sens « maintenant ». Jamais quel talent ; passifs, effets autonomes et gestes physiques ne vacillent pas.
- **II (2 PTV) · Sceau de Vacuité** (SR/R, rituel de 10 minutes, scène) : une enceinte de 3 m de rayon sur une limite réelle. Une créature contenue qui veut sortir par téléportation, immatérialité, passage spirituel, projection, abandon d'incarnation ou ouverture dimensionnelle doit vaincre ton V + MS. Elle peut marcher, casser le mur ou détruire les ancrages.
- **III (3 PTV) · Paume des Shi** (R, réaction 1 PA frappe comprise, 1/scène) : quand le Vacillement t'avertit d'une capacité déclenchée à portée de Pugilat, frappe. Blessure : V + MS contre la Puissance de la capacité ; réussite, cette activation est annulée. Rien d'autre n'est verrouillé.
- **III (3 PTV) · Grand Scellement des Shi** (R, rituel d'une heure au moins, après Sceau de Vacuité) : sur une créature vaincue, inconsciente, immobilisée, volontaire ou contenue, tu fixes son existence à un ancrage et l'entoures de Vacuité, contre sa Défense occulte. Tant que l'ancrage tient, elle ne peut s'échapper, se téléporter, quitter son corps, changer d'incarnation ni se reconstruire ailleurs par sa Nature. Puissances majeures : conditions de scénario fixées avant.

**Changements** : aucun. Ressort déjà distinct du Grand Scellement des Onmyoji : les Shi fixent la créature à un ancrage dans le Vide ; les Onmyoji l'enferment dans un support.

### 3.6 Kabbale

Accès naturel pour un initié ; ouvert ou restreint pour une formation extérieure crédible. Le Sephirien reste hors progression de personnage joueur. La Kabbale n'approche pas l'Angelus : elle ne donne jamais tous les pouvoirs d'une Sephira. Chaque talent garde le nom de sa Sephira.

#### Rigueur (Bina, Gueburah, Hod) — 1 porte
*Analyser, limiter, briser.*
*Reprend : Arme de Gueburah, Lecture de Hod, Imposer une limite, Décomposition de Hod, Interdit de Bina, Brèche de Gueburah.*

- **I (1 PTV) · Arme de Gueburah** (R, 1 PA, scène) : une arme que tu tiens devient arme de Vérité pour la scène et peut atteindre une présence spirituelle manifestée. Aucun bonus ; attaques payées normalement.
- **I (1 PTV) · Lecture de Hod** (SR/R, 1 PA, 10 m) : sur un effet surnaturel perçu, tu distingues sa structure : source, cible, lien de maintien, point d'intervention. Une dissimulation oppose sa Puissance à ton Esprit + Perception. Ni nom, ni faiblesse.
- **II (2 PTV) · Imposer une limite** (Bina ; SR/R, 1 PA, 10 m, scène) : sur un phénomène actif délimitable, choisis avant le jet une limite (rayon ou seuil de 3 m, cible protégée, extension maximale) qu'il ne franchit pas sans vaincre ton V + MS. Une seule limite active ; elle ne supprime pas l'effet.
- **II (2 PTV) · Décomposition de Hod** (R, 1 PA, 10 m, 1/scène, après Lecture de Hod) : V + MS contre la Puissance d'un effet composite : une composante choisie avant (camouflage et protection, lien et douleur, projection et contrôle) en est séparée jusqu'à la fin de la prochaine activation de sa source.
- **III (3 PTV) · Interdit de Bina** (R, 1 PA, 10 m, 1/scène) : tu prononces la limite à voix haute ; la cible doit pouvoir t'entendre. Sur une capacité Active vue ou identifiée, V + MS contre sa Défense occulte. Réussite : elle ne peut être activée jusqu'à la fin de la prochaine activation de la cible. Jamais une Nature, un passif ou une ressource.
- **III (3 PTV) · Brèche de Gueburah** (R, 1/scène, sans PA, après Arme de Gueburah) : après une attaque réussie de l'Arme de Gueburah contre une barrière ou Protection active, renonce aux dégâts : V + MS contre sa Puissance. Réussite : suspendue jusqu'à la fin de la prochaine activation de sa source.

**Changements** : coût d'activation d'Interdit de Bina corrigé (l'en-tête disait 2 PA, le texte validé 1 PA). **Ressort propre ajouté** : l'Interdit est prononcé et la cible doit t'entendre. Avant, il était identique à Interdit du Néant (Lueurs). Les Sephiroth sont regroupées en 4 voies (voir Grâce, Unité et rêve, Victoire) ; aucune paire n'est séparée de sa Sephira.

#### Grâce (Hokhma, Hesed, Tiph'ereth) — 1 porte
*Purifier, protéger, donner de soi.*
*Reprend : Offrande de Tiph'ereth, Purification de Hokhma, Sceau de pureté, Main de Hesed, Sursis de Hesed, Sacrifice de Tiph'ereth.*

- **I (1 PTV) · Offrande de Tiph'ereth** (SR/R, 1/scène, sans PA) : lors d'un rite de Vérité, perds volontairement 1 PV irréductible pour remplacer un petit composant symbolique manquant, si l'équivalence est cohérente. Jamais un artefact ni une condition majeure.
- **II (2 PTV) · Purification de Hokhma** (SR/R, 1 PA au contact) : sur une pollution spirituelle, corruption extérieure ou effet impur présent, V + MS contre sa Puissance. Réussite : supprimé si sa Puissance est de 12 au plus, sinon suspendu pour la scène. Ne retire aucun point de Corruption, ni une Nature.
- **II (2 PTV) · Sceau de pureté** (SR/R, rituel de 10 minutes, scène) : une personne ou un objet au contact, ou un rayon de 3 m. La première tentative extérieure par round de corruption, possession ou mutation hostile doit d'abord vaincre ton V + MS.
- **II (2 PTV) · Main de Hesed** (SR/R, réaction 1 PA, 1/scène par cible, 10 m) : un allié va subir une conséquence surnaturelle non létale immédiate (chute spirituelle, expulsion, emprise, affliction) : il fait une nouvelle résistance complète contre la même Puissance. Résultat définitif ; n'annule pas des dégâts reçus.
- **II (2 PTV) · Sursis de Hesed** (R, réaction 1 PA, 1/scène, 10 m) : un allié va franchir son seuil de Mort à cause d'un effet surnaturel : son âme et son corps tiennent ensemble jusqu'à la fin de sa prochaine activation. Aucun PV rendu ; s'il n'est pas stabilisé avant, la mort suit.
- **II (2 PTV) · Sacrifice de Tiph'ereth** (R, réaction 1 PA, 1/scène, 10 m, après Offrande) : une conséquence surnaturelle vise un allié ; si tu es une cible valide, tu la subis entièrement à sa place, avec tes protections. Pas contre une zone.

**Changements** : en-tête de Sacrifice de Tiph'ereth complété (réaction 1 PA). Ressorts déjà distincts : Sceau de pureté est le seul à couvrir la mutation ; Sursis de Hesed sauve un allié, Quête inachevée (Table Ronde) se sauve soi-même tant que la Quête tient.

#### Unité et rêve (Kether, Yessod, Malkhouth) — 1 porte
*Lier les consciences, porter l'image et le rêve, forcer l'esprit à s'incarner.*
*Reprend : Image de Yessod, Nœud de Kether, Concordance de Kether, Marche onirique, Ancrage de Malkhouth, Incarner de force.*

- **I (1 PTV) · Image de Yessod** (SR/R, 1 PA, 10 m, scène) : une image surnaturelle simple dans un cube de 2 m, attachée à un support, un lieu ou une personne consentante : forme, symbole, message ou apparence. Aucune substance ; un doute motivé oppose Esprit + Perception à sa Puissance.
- **II (2 PTV) · Nœud de Kether** (SR/R, 1 PA, scène) : lie jusqu'à 3 volontaires à 10 m (puis 100 m de liaison). Toute tentative de les isoler, de leur faire s'oublier ou de leur imposer des réalités incompatibles doit d'abord vaincre ton V + MS. Aucune télépathie.
- **II (2 PTV) · Concordance de Kether** (SR/R, 1 PA, 1/scène, après Nœud de Kether) : quand des membres du Nœud perçoivent ou se souviennent d'une scène de façon surnaturellement contradictoire, tu obtiens un fait commun à toutes les versions (personne présente, objet absent, son, direction). Pas quelle version est vraie.
- **II (2 PTV) · Marche onirique** (R, rituel de 10 minutes, 1/scène) : entre 10 minutes dans le rêve d'un dormeur consentant à 1 km au plus, connu ou lié par un support. Tu communiques et observes ses symboles ; ni souvenirs cachés, ni contrôle. Ton corps reste inerte.
- **III (3 PTV) · Ancrage de Malkhouth** (R, rituel de 10 minutes, scène) : fixe une manifestation spirituelle ou projetée à 10 m à un lieu ou un support pour qu'elle ne puisse cesser d'être présente pour éviter l'échange. Opposition si elle résiste. Ne l'immobilise pas.
- **III (3 PTV) · Incarner de force** (R, 2 PA, 10 m, 1/scène, après Ancrage de Malkhouth) : sur une entité Ancrée, V + MS contre Défense occulte. Réussite : jusqu'à la fin de sa prochaine activation, elle prend une forme assez corporelle pour être ciblée physiquement.

**Changements** : bloc d'Accès de toute la Kabbale sorti d'Incarner de force vers l'en-tête (correction).

#### Victoire (Nesah) — progression (courte)
*Tenir ouverte la brèche qu'un allié vient de créer.*
*Reprend : Élan de Nesah, Victoire contagieuse.*

- **I (1 PTV) · Élan de Nesah** (SR/R, réaction 1 PA, 1/round, 10 m) : quand un allié crée une ouverture temporaire dans un phénomène surnaturel (brèche, passage, cible matérialisée, lien rompu, Protection suspendue), elle reste ouverte jusqu'à la fin de ta prochaine activation. Ni dégâts ni contrôle prolongés.
- **II (2 PTV) · Victoire contagieuse** (SR/R, passif) : jusqu'à 2 autres alliés peuvent exploiter l'ouverture que tu maintiens, avec leurs PA et un moyen réel. Rien n'est offert.

**Changements** : « ouverture » précisée par les exemples du texte (brèche, passage, cible matérialisée, lien rompu, Protection suspendue), comme pour Formes complémentaires (Table Ronde). Aucune autre définition ajoutée.

### 3.7 Nizarites / Asāsīyūn

Arts du Djinn : naturels pour un véritable Nizarite, parfois ouverts à d'autres initiés ; ils ne sont pas réservés aux Chasseurs. Doctrine Asāsīyūn : naturelle pour un Nizarite Chasseur, impossible tant que le personnage n'est pas réellement Chasseur. Les PTV achètent le lien, jamais le Djinn : il garde sa personnalité et n'a pas de PA propres. Vaanesh et les entités tutélaires majeures restent hors calibrage.

#### Arts du Djinn — 1 porte
*Un pacte consenti avec un esprit réellement rencontré.*
*Reprend : Pacte du Djinn, Voix du compagnon, Sens jumelés, Possession consentie, Rappel d'urgence, Déchaîner le Djinn, Échange d'ancrage, Incarnation profonde.*

- **Entrée (2 PTV) · Pacte du Djinn** (R, lien) : lien avec un Djinn compatible réellement rencontré, qui a accepté le pacte. Il suit les règles des Compagnons liés. L'achat ne crée pas le Djinn.
- **I (1 PTV) · Voix du compagnon** (V/SR/R) : communication simple à 100 m, même plan. Pour 1 PA, tu perçois par ses sens jusqu'à ta prochaine activation.
- **I (1 PTV) · Sens jumelés** (SR/R, passif, après Voix du compagnon) : ce que tu perçois par ton Djinn sert à cibler, réagir ou te défendre, avec un moyen valide et tes PA.
- **II (2 PTV) · Possession consentie** (R, 1 PA, 1/scène) : le Djinn fusionne avec toi pour la scène et te prête une propriété réelle choisie à l'achat (résistance plafonnée à Protection 3 typée, respiration, mouvement, perception ou contact élémentaire). Ni fiche, ni Attributs, ni PA.
- **II (2 PTV) · Rappel d'urgence** (R, réaction 1 PA, après Déchaîner le Djinn) : Déchaîner le Djinn en réaction, sur son usage de la scène. Aucune action gratuite, aucune interception automatique.
- **III (3 PTV) · Déchaîner le Djinn** (R, 1 PA, 1/scène) : le Djinn apparaît à 3 m depuis son refuge, dans un espace valide. Il agit avec ses statistiques sur tes PA. Ne traverse pas un sceau ; ne rappelle pas un mort.
- **III (3 PTV) · Échange d'ancrage** (R, 1 PA, 1/scène, 20 m, après Déchaîner le Djinn) : toi et ton Djinn manifesté et consentant échangez vos positions, même plan, destinations valides. Une barrière anti-transport bloque. Aucun coup gratuit.
- **III (3 PTV) · Incarnation profonde** (R, 2 PA, 1/scène, après Possession consentie) : pendant la Possession, une capacité active signature du Djinn, fixée à l'achat avec son coût et sa portée (souffle de feu, mouvement aérien, passage aquatique). Ses usages se paient ensuite ; jamais tous ses pouvoirs.

**Changements** : l'entrée garde son coût d'origine (2 PTV). Ressort déjà distinct du Shikigami (Onmyoji) : un Djinn a accepté un pacte et fusionne avec son maître ; un Shikigami peut être créé et porte des sceaux.

#### Asāsīyūn · Marquer la proie — 1 porte
*Marquer, suivre par le pacte, refuser à la proie sa fuite et son dernier refuge.*
*Ouverture : être un véritable Chasseur.*
*Reprend : Marque de la proie, Fenêtre jumelée, Traque du pacte, Contre-rite du témoin, Sceau de poursuite, Dernier ancrage.*

- **I (1 PTV) · Marque de la proie** (SR/R, 1 PA) : sur une proie identifiée, touchée, blessée ou au contact d'un rite, V + MS contre sa Défense occulte : une marque invisible jusqu'à retrait, rupture ou neutralisation durable. Une seule proie ; elle ne localise pas.
- **I (1 PTV) · Fenêtre jumelée** (SR/R, passif, après Fenêtre de chasse et Voix du compagnon) : Fenêtre de chasse se déclenche aussi quand ton Djinn perçoit la fuite. L'action simple est faite par toi ou par lui, toujours sur ton PA.
- **II (2 PTV) · Traque du pacte** (SR/R, passif, après Marque de la proie et Pacte du Djinn) : toi et ton Djinn sentez la direction de la proie marquée à 10 km au plus, même plan, et si elle est très proche, proche, loin ou très loin. Un anti-divination s'oppose à la Puissance du lien.
- **II (2 PTV) · Contre-rite du témoin** (SR/R, réaction 1 PA, 1/scène) : une capacité Active que toi ou ton Djinn avez vue reste mémorisée pour la scène. À sa prochaine activation par la même cible, tu la sens avant résolution et fais une Défense active, un déplacement, une préparation défensive ou une action défensive du Djinn. Ni attaque ni annulation.
- **III (3 PTV) · Sceau de poursuite** (R, réaction 1 PA, 1/scène, 20 m, après Marque de la proie) : la proie marquée tente téléportation, sortie du plan, immatérialité ou abandon du corps pour fuir : V + MS contre sa résistance. Réussite : la tentative échoue et ses PA sont perdus. Pas contre course, véhicule ou vol.
- **III (3 PTV) · Dernier ancrage** (R, passif, après Marque de la proie et Mise à mort préparée) : une Mise à mort préparée sur une proie marquée bloque aussi pour la scène les transferts locaux d'essence (corps voisin, réceptacle local, fuite spirituelle, saut, reconstitution). Ni phylactère distant, ni clone externe, ni résurrection supérieure.

**Changements** : bloc d'Accès de toute la tradition sorti de Dernier ancrage vers l'en-tête (correction).

#### Asāsīyūn · Balles liées — 1 porte (courte)
*La munition accordée au Djinn.*
*Ouverture : être un véritable Chasseur.*
*Reprend : Balle liée, Trajectoire du Djinn, Projectile d'ancrage, Balle d'exil.*

- **I (1 PTV) · Balle liée** (SR/R, préparation d'une minute par munition, après Pacte du Djinn) : une munition Angélique accordée à ton Djinn compte comme Sacrée et porte sa nature élémentaire réelle contre une vulnérabilité authentique. Consommée au tir ; aucun dégât en plus.
- **II (2 PTV) · Trajectoire du Djinn** (SR/R, passif, après Sens jumelés et Balle liée) : si ton Djinn voit la cible et qu'un trajet ouvert existe, ton projectile corrige une fois sa course et ignore une source de Couvert partiel. Jamais un mur, une porte fermée ou un obstacle total.
- **II (2 PTV) · Projectile d'ancrage** (R, préparation d'une minute, après Déchaîner le Djinn) : s'il touche une cible ou une surface à 20 m au plus, ta prochaine invocation avant la fin du round peut faire apparaître le Djinn près de l'impact. L'invocation garde son coût et ses limites.
- **II (2 PTV) · Balle d'exil** (R, 1/scène, sans PA) : une munition Angélique qui blesse une entité possessive ou parasite l'empêche d'entrer dans un nouvel hôte jusqu'à la fin de sa prochaine activation. N'expulse pas l'hôte actuel.

**Changements** : aucun.

### 3.8 Onmyoji

Chasseurs shinto spécialisés dans les entités nuisibles, les Shikigami et les sceaux. Un sceau ne rend pas un esprit coupable et ne remplace pas la négociation. La foudre de Koji n'est pas une capacité de la tradition.

**La règle des sceaux** : préparer un sceau prend 1 minute sur un support physique (papier, bois, tissu, plaque, gravure). Le poser coûte 1 PA au contact. Une cible hostile oppose sa Défense occulte à ton V + MS. Le jet de pose fixe la Puissance du sceau. Il dure la scène ou jusqu'au retrait ou à la rupture de son support.

#### Shikigami — 1 porte
*Un compagnon lié qui porte tes sceaux.*
*Reprend : Lien du Shikigami, Résonance du Shikigami, Porte-sceau, Invocation du Shikigami, Ancrage vivant.*

- **Entrée (2 PTV) · Lien du Shikigami** (SR/R, lien) : lien avec un Shikigami compatible réellement rencontré, ou créé selon la tradition. C'est un compagnon réel ; aucun PTV n'achète la créature.
- **I (1 PTV) · Résonance du Shikigami** (SR/R) : communication simple à 100 m, même plan. Pour 1 PA, tu perçois par ses sens jusqu'à ta prochaine activation.
- **I (1 PTV) · Porte-sceau** (SR/R, passif) : ton Shikigami transporte des sceaux préparés. Quand tu paies 1 PA pour le faire agir, il pose un sceau sur une cible ou une surface atteignable (jet physique contre une cible hostile).
- **III (3 PTV) · Invocation du Shikigami** (R, 1 PA, 1/scène) : il apparaît à 3 m depuis un état compatible. Il n'a pas de PA propres. Ne contourne pas un sceau ; ne rappelle pas un mort.
- **III (3 PTV) · Ancrage vivant** (R, 1 PA, 1/scène, après Porte-sceau) : un sceau de zone préparé (3 m au plus) s'ancre sur ton Shikigami manifesté et se déplace avec lui. Un seul à la fois ; il cesse si le Shikigami est neutralisé ou renvoyé.

**Changements** : l'entrée garde son coût d'origine (2 PTV) ; la voie n'a pas de palier II, aucun talent de ce coût n'existant.

#### Fūin (sceaux) — 1 porte
*Entraver, taire, fermer, protéger, défaire, sceller.*
*Reprend : Sceau d'Entrave, Sceau du Silence, Sceau de Fermeture, Sceau de Protection, Contre-sceau, Grand Scellement.*

- **I (1 PTV) · Sceau d'Entrave** (SR/R, sceau) : chaque tentative de fuite surnaturelle de la cible doit vaincre la Puissance du sceau. Les déplacements physiques ordinaires restent possibles.
- **II (2 PTV) · Sceau du Silence** (R, sceau, scène) : les Talents Actifs de la cible coûtent +1 PA (maximum 3, sans cumul). Passifs, réactions et Nature ne sont pas touchés.
- **II (2 PTV) · Sceau de Fermeture** (SR/R, sceau, scène) : sur une porte, fenêtre, portail ou seuil de 3 m au plus. Une entité spirituelle, immatérielle, invoquée ou en passage surnaturel doit vaincre ton V + MS pour le franchir. Ne bloque pas une brèche matérielle.
- **II (2 PTV) · Sceau de Protection** (SR/R, sceau, scène) : sur une personne ou un objet, il intercepte la première tentative extérieure par round de possession, malédiction, corruption ou contrôle spirituel : elle doit d'abord vaincre ton V + MS.
- **II (2 PTV) · Contre-sceau** (SR/R, 1 PA au contact) : sur un sceau, une rune, un cercle, une marque rituelle ou un lien symbolique actif, V + MS contre sa Puissance. Réussite : neutralisé pour la scène ; un effet temporaire peut prendre fin.
- **III (3 PTV) · Grand Scellement** (R, rituel d'une heure au moins, après Sceau d'Entrave et Sceau de Fermeture) : une entité vaincue, immobilisée, volontaire ou piégée est scellée dans un objet, un lieu ou un sanctuaire, contre sa Défense occulte, jusqu'à la rupture du support. Puissances majeures : vrai nom, artefact, plusieurs officiants ou condition de scénario, fixés avant.

**Changements** : la règle des sceaux sort de Sceau d'Entrave et du Sceau du Silence vers l'en-tête (correction). Sceau du Silence inchangé, voir question 3.

#### Exorcisme et noms — 1 porte
*Repérer le parasite, le nommer, l'extraire, l'enfermer dans un vase.*
*Reprend : Présence parasite, Sceau du Nom, Faire comparaître l'esprit, Extraction par le Sceau, Vase de Souillure.*

- **I (1 PTV) · Présence parasite** (SR/R, 1 PA, au contact) : tu poses un papier de sceau préparé sur une personne ou un objet ; il réagit si une présence spirituelle étrangère (possession, parasite) y est attachée. Une présence cachée oppose sa Puissance à ton Esprit + Perception. L'occupant ne sait pas qu'il a été repéré. Ne détecte pas une Nature.
- **II (2 PTV) · Sceau du Nom** (SR/R, préparation de 10 minutes) : si tu connais le vrai nom d'une entité et une trace authentique, tu prépares un sceau ciblé sur elle. Posé sur un objet fortement lié ou une représentation rituelle, il remplace le contact jusqu'à 100 m, même plan. Ne découvre jamais le nom ; un nom civil ne suffit pas.
- **II (2 PTV) · Faire comparaître l'esprit** (R, 1 PA, 10 m) : sur un hôte portant une présence identifiée, V + MS contre sa Défense occulte. Réussite : jusqu'à la fin du prochain round, elle devient distincte et ciblable par sceaux, exorcismes et effets spirituels. Elle n'est pas expulsée.
- **III (3 PTV) · Extraction par le Sceau** (R, 2 PA pose comprise, 1/scène, après Faire comparaître l'esprit) : sur un hôte dont l'esprit a été rendu distinct, V + MS contre sa Défense occulte. Réussite : la possession est rompue et l'entité expulsée.
- **III (3 PTV) · Vase de Souillure** (R, rituel de 10 minutes, 1/scène, après Contre-sceau ou Extraction par le Sceau) : sur une cible consentante portant une malédiction, une corruption extérieure, une pollution spirituelle, une marque hostile ou un parasite mineur, V + MS contre sa Puissance. Réussite : l'effet passe dans un récipient préparé, sans être détruit. Briser le vase peut le libérer. Aucun point de Corruption effacé.

**Changements** : **ressort propre ajouté** à Présence parasite : elle passe par un papier de sceau posé au contact (au lieu de 10 m) et l'occupant ne se sait pas repéré. Avant, elle était identique mot pour mot à Présence étrangère (Ephraïm).

#### Pactes d'esprits — 1 porte
*Un accord avec un esprit de la nature, qui prête sa propriété.*
*Reprend : Pacte de Faveur, Sceau d'Affinité, Souffle emprunté, Manifestation prêtée.*

- **I (1 PTV) · Pacte de Faveur** (SR/R, rituel) : pacte avec un esprit compatible réellement rencontré. Il fixe une Affinité réelle (tempête, vent, feu, eau, rivière, montagne, forêt, ombre). Un seul pacte actif ; l'esprit n'est pas un second compagnon.
- **II (2 PTV) · Sceau d'Affinité** (SR/R, préparation, après Pacte de Faveur) : un sceau préparé porte la nature du pacte. Aucun bonus chiffré, mais il exploite une vulnérabilité authentique ou interagit avec un effet qui exige cette nature.
- **II (2 PTV) · Souffle emprunté** (R, 1 PA, 1/scène, après Pacte de Faveur) : pour la scène, une propriété simple fixée au pacte : Protection 3 contre un vecteur précis, ou une respiration, un sens ou une mobilité réels. Remplace une protection équivalente.
- **III (3 PTV) · Manifestation prêtée** (R, 2 PA, 1/scène, après Souffle emprunté) : un profil fixé à l'achat : attaque DGT 7 à 10 m contre la Défense adaptée ; poussée de 3 m sur opposition ; manipulation d'un litre à 10 m ; ou Protection typée 3 pour un round.

**Changements** : la liste fermée des profils de Manifestation prêtée remonte de ses conditions vers le texte joueur.

### 3.9 Néopaïens

Néopaganisme syncrétique, moderne et pluriel. Les pratiques communes et un ou deux Mystères liés au culte réel sont naturels ; les autres demandent un apprentissage ou sont restreints. Une correspondance ou une offrande doit être culturellement et métaphysiquement pertinente.

#### Pratiques néopaïennes — 1 porte
*Correspondances, mémoire des lieux, témoins du rite, offrandes.*
*Reprend : Correspondance sacrée, Syncrétisme opératif, Mémoire du lieu, Cercle des témoins, Offrande de paix.*

- **I (1 PTV) · Correspondance sacrée** (SR/R, rituel de 10 minutes) : un symbole, objet, matériau, nom ou offrande devient pertinent pour le prochain rite de la scène qui exige cette correspondance. Aucune vulnérabilité créée.
- **II (2 PTV) · Syncrétisme opératif** (SR/R, passif) : quand un rite exige un élément symbolique, tu le remplaces par un équivalent mythiquement cohérent d'une autre tradition. Composants, coûts et opposition restent ; « n'importe quoi » ne vaut pas.
- **II (2 PTV) · Mémoire du lieu** (SR/R, 2 PA, 1/scène par lieu) : dans un lieu marqué par un événement surnaturel significatif, le MJ donne des impressions fragmentaires authentiques de la manifestation la plus forte. Jamais la scène complète ni les identités.
- **II (2 PTV) · Cercle des témoins** (SR/R, préparation de 10 minutes) : des personnes consentantes non initiées tiennent de vraies fonctions rituelles (point du cercle, offrande, refrain, nombre minimal d'officiants). Elles ne gagnent aucun pouvoir ; l'Assistance reste limitée à +2 au total.
- **II (2 PTV) · Offrande de paix** (SR/R, 2 PA, 1/scène, 10 m) : tu proposes une trêve à une entité. Si elle accepte, un accord surnaturel protège les interlocuteurs nommés de leurs actes hostiles pendant cet échange loyal. La fin de l'échange ou la mauvaise foi y met fin.

**Changements** : aucun (le coût de 2 PTV d'Offrande de paix est celui de l'arbitrage du 30 septembre ; le livre V6 dit encore 3).

#### Mystère des Morts et des Ancêtres — 1 porte
*Veiller, guider, interroger les ancêtres.*
*Reprend : Veillée des morts, Guider le défunt, Appel des ancêtres.*

- **I (1 PTV) · Veillée des morts** (SR/R, rituel de 10 minutes) : auprès d'un mort récent, d'une tombe ou d'une hantise, ce qui est réellement présent peut communiquer 5 minutes. Rien n'est rappelé ni forcé.
- **II (2 PTV) · Guider le défunt** (SR/R, rituel de 10 minutes, après Veillée) : sur une âme errante retenue par un attachement identifié, V + MS contre ce qui la retient. Réussite : l'ancrage est rompu ; l'esprit choisit ce qu'il fait.
- **III (3 PTV) · Appel des ancêtres** (R, rituel de 30 minutes, 1/scénario, après Veillée) : autour d'une famille, communauté ou lignée à laquelle un participant appartient réellement, une question sur un ennemi, un rite, un événement ou une dette. Réponse vraie si un ancêtre la connaissait ; sinon « je ne sais pas ».

**Changements** : aucun.

#### Mystère de la Terre et de la Chasse — 1 porte
*La terre se souvient du passage de la proie.*
*Reprend : Terre troublée, Trace que rien n'efface, Cercle de chasse.*

- **I (1 PTV) · Terre troublée** (SR/R, 1 PA, 10 m) : sur un sol naturel continu, tu sens si une présence surnaturelle étrangère est passée dans les dernières 24 heures : oui ou non, direction générale, passage isolé ou répété. Ni identité, ni nombre.
- **III (3 PTV) · Trace que rien n'efface** (SR/R, rituel de 10 minutes, scénario, après Terre troublée) : à partir d'une trace réelle d'une proie identifiée et d'une correspondance, ses pouvoirs ne peuvent plus effacer toute trace de son passage en milieu naturel. Pistage, Perception ou Investigation restent nécessaires. Un seul suivi actif.
- **III (3 PTV) · Cercle de chasse** (R, rituel de 10 minutes, 1/scène) : une zone naturelle bornée de 20 m de rayon est vouée à la chasse d'une proie identifiée. Toute sortie par téléportation, passage dimensionnel, immatérialité ou fuite spirituelle doit vaincre ton V + MS. Elle peut sortir en courant.

**Changements** : aucun. La voie n'a pas de palier II, aucun talent de ce coût n'existant.

#### Mystère du Foyer et des Seuils — 1 porte
*L'hospitalité, le feu, la maison.*
*Reprend : Droit d'hospitalité, Feu du foyer, Maison fermée.*

- **I (1 PTV) · Droit d'hospitalité** (SR/R, rituel d'une minute intégré à l'accueil) : une entité qui a demandé ou accepté l'hospitalité du véritable occupant doit vaincre ton V + MS pour attaquer l'hôte ou les personnes nommées, jusqu'à son départ. L'hôte perd la protection s'il attaque, piège ou viole l'accord.
- **II (2 PTV) · Feu du foyer** (SR/R, 2 PA, scène) : au véritable foyer d'un lieu habité, rayon de 3 m. La première tentative extérieure par round de posséder, expulser ou pénétrer l'esprit d'un occupant doit d'abord vaincre ton V + MS, fixé au rite.
- **III (3 PTV) · Maison fermée** (R, rituel de 10 minutes, scène) : les limites d'une maison, d'un refuge ou d'un camp habité (20 m au plus). Une entité extérieure ne peut entrer ou sortir par apparition, téléportation, intrusion spirituelle ou passage dimensionnel sans vaincre ton V + MS. Portes et fenêtres fonctionnent normalement.

**Changements** : aucun.

#### Mystère des Présages et du Destin — 1 porte
*Lire ce qui se prépare, reconnaître l'instant, refuser la fatalité.*
*Reprend : Augure, Reconnaître l'heure, Refuser le destin imposé.*

- **I (1 PTV) · Augure** (SR/R, rituel de 10 minutes, 1/scène) : pour une action prévue dans l'heure, le MJ dit favorable, neutre ou menaçant selon les forces surnaturelles déjà en place. Ni garantie, ni danger qui n'existe pas encore.
- **II (2 PTV) · Reconnaître l'heure** (SR/R, réaction 1 PA, 1/scène, après Augure) : quand la menace annoncée par l'Augure se manifeste, tu sens « c'est maintenant » et fais une action simple : te déplacer, te mettre à couvert, protéger quelqu'un ou activer une préparation. Pas d'attaque.
- **III (3 PTV) · Refuser le destin imposé** (R, réaction 1 PA, 1/scène, 10 m) : un pouvoir impose une fatalité, une malédiction conditionnelle ou un résultat prédéterminé à toi ou à un allié : V + MS contre sa Puissance. Réussite : la conséquence est suspendue pour la scène. Pas contre une balle ni une mortalité ordinaire.

**Changements** : aucun.

#### Mystère des Serments et du Sacrifice — 1 porte
*Suivre un serment, payer le prix, lier une créature à sa parole.*
*Reprend : Serment véritable, Prix consenti, Lier par le serment.*

- **I (1 PTV) · Serment véritable** (SR/R, rituel de 10 minutes) : deux parties consentantes déclarent un serment clair. Tu sais ensuite s'il reste intact ou a été volontairement rompu. Ni où, ni pourquoi ; il n'oblige pas à obéir.
- **II (2 PTV) · Prix consenti** (SR/R, 1/scène) : quand un rite manque une condition ou un coût symbolique, tu offres un sacrifice personnel concret et durable, défini avant le rite, si le MJ juge l'équivalence suffisante. Jamais de l'argent trivial à la place d'une condition cosmologique.
- **III (3 PTV) · Lier par le serment** (R, rituel de 10 minutes, après Serment véritable) : une créature accepte librement un accord écrit. Quand elle tente de le violer, sa Volonté + Force Mentale contre ton V + MS, fixé au pacte ; échec, elle ne peut pas commettre l'acte maintenant (une tentative par clause et par scène).

**Changements** : aucun. Prix consenti reste à l'appréciation du MJ (pas de barème dans les sources).

### 3.10 Chasse Fantastique

Ancienne armée punitive elfique de la Guerre de la Magie, devenue faction de Chasseurs. Limier, Piqueur, Officier de Vénerie, Grand Veneur, Roi ou Reine sont des rangs narratifs. Ni monture ni véhicule ne s'achètent en PTV.

#### Voie des Limiers — 1 porte
*Marquer la proie, la reconnaître, la suivre jusque dans les passages.*
*Reprend : Marque du Limier, La vraie bête, Écho du passage, Forcer le passage, Hallali.*

- **I (1 PTV) · Marque du Limier** (SR/R, 1 PA) : après contact, blessure ou un round d'observation à 20 m d'une proie identifiée, tu fixes sa signature de chasse. Une seule proie. Ses pouvoirs ne peuvent plus effacer toute trace : Pistage, Perception ou Investigation trouvent encore quelque chose.
- **I (1 PTV) · La vraie bête** (SR/R, passif, après Marque du Limier) : quand la proie marquée se cache par métamorphose, duplication, illusion ou échange de corps, tu reconnais la vraie quand tu la perçois. Une cible Voilée reste humaine à tes yeux ; tu sais seulement « c'est elle ».
- **II (2 PTV) · Écho du passage** (SR/R, réaction 1 PA, 20 m) : quand la proie marquée quitte la zone par portail, seuil, téléportation ou transition, tu perçois le type de transition, son point de départ et si elle reste dans la même couche ; direction si elle arrive à 100 m au plus.
- **II (2 PTV) · Forcer le passage** (R, réaction 1 PA, 1/scène, après Écho du passage) : quand la proie marquée emprunte un passage traversable (portail, brèche, seuil dimensionnel), tu le franchis avant qu'il se ferme, avec ta monture si elle peut y entrer. Pas après une téléportation sans passage.
- **III (3 PTV) · Hallali** (R, 1 PA, 20 m, 1/scène, après Marque du Limier) : sur la proie marquée à 25 % de ses PV ou moins, V + MS contre Défense occulte. Réussite, jusqu'à la fin de sa prochaine activation : elle ne peut effacer sa signature ni se rendre inaccessible, et ses capacités de rupture coûtent +1 PA (maximum 3). Elle peut courir, voler, se battre.

**Changements** : en-tête d'Écho du passage complété (réaction 1 PA). Ressort déjà distinct des autres marques : la Marque du Limier interdit l'effacement de la piste.

#### Chevauchée — 1 porte
*Le Veneur et sa Monture de Chasse.*
*Reprend : Monture du seuil, Même selle même destin, Prendre le vent, Charge irréelle, Chevauchée sauvage.*

- **I (1 PTV) · Monture du seuil** (SR/R, passif) : quand un passage surnaturel te laisse passer, ta Monture de Chasse le franchit avec toi si elle peut l'emprunter. Ni taille, ni scellement, ni incompatibilité contournés.
- **I (1 PTV) · Même selle, même destin** (SR/R, passif) : tant que tu es monté, un effet surnaturel qui cherche à te séparer de ta Monture doit vaincre ton V + MS. Chocs et chutes ordinaires fonctionnent.
- **II (2 PTV) · Prendre le vent** (SR/R, passif, après Fenêtre de chasse) : monté, l'action simple de Fenêtre de chasse peut utiliser le déplacement de ta monture. Toujours 1 PA, pas de mouvement en plus.
- **II (2 PTV) · Charge irréelle** (R, 1/round, après Marque du Limier) : après t'être rapproché d'une proie marquée avec ta monture, ta prochaine attaque de mêlée de l'activation peut toucher une cible partiellement immatérielle ou en phase. Aucun bonus.
- **III (3 PTV) · Chevauchée sauvage** (R, 2 PA, 1/scène) : toi et ta monture forcez une frontière surnaturelle ou une barrière de déplacement, V + MS contre sa Puissance. Réussite : vous traversez ensemble, dans la limite de son Déplacement. Jamais de la matière pleine.

**Changements** : aucun. La voie demande une Monture de Chasse réelle, acquise dans la fiction.

#### Tempête de la Chasse — 1 porte
*Le courant qui aspire et disperse la Magie.*
*Reprend : Flair de la Tempête, Vent de rupture, Courant dissipateur, Foudre dispersante, Vortex de la Chasse.*

- **I (1 PTV) · Flair de la Tempête** (SR/R, passif, 10 m) : tu sens quand une Magie explicite est activement utilisée près de toi : présence, direction, et si visible, si le foyer est une créature, un objet ou le lieu. Ni école, ni sort, ni identité.
- **II (2 PTV) · Vent de rupture** (R, réaction 1 PA, 1/round) : après ta Défense ou résistance réussie contre un effet magique qui te vise, ses composantes persistantes sur toi sont dissipées. Pas les autres pouvoirs surnaturels.
- **II (2 PTV) · Courant dissipateur** (R, 1 PA, 10 m, 1/scène) : contre un effet magique actif perçu (barrière, enchantement, sort maintenu, illusion, invocation), V + MS contre sa Puissance. Réussite : suspendu jusqu'à la fin de la prochaine activation de sa source. Pas la Nature de Mage.
- **III (3 PTV) · Foudre dispersante** (R, réaction 1 PA, 20 m, 1/scène, après Courant dissipateur) : quand une Magie est activée, V + MS contre sa Puissance. Réussite : son premier effet instantané se produit, puis sa structure se brise ; rien de persistant ne demeure.
- **III (3 PTV) · Vortex de la Chasse** (R, 2 PA puis 1 PA par round, 1/scène, après Courant dissipateur) : dans 3 m autour de toi, alliés compris, toute nouvelle Magie Active doit aussi vaincre ton V + MS, fixé au départ ; en échec, PA dépensés et rien ne se forme. Les Protections magiques y perdent 2 (minimum 0).

**Changements** : aucun. Ressort déjà distinct des autres zones d'interdiction : la Tempête ne touche que la Magie.

#### Art de la Vénerie — 1 porte
*La battue coordonnée, au cor.*
*Reprend : Cor de chasse, Relais des Limiers, Rabattre la proie, Battue volante, Grande Chasse.*

- **I (1 PTV) · Cor de chasse** (V/SR/R, 1 PA, scène) : désigne une proie portant la Marque du Limier. Jusqu'à 3 membres volontaires à 20 m la traitent comme marquée pour leurs talents de Chasse Fantastique, tant qu'un membre la perçoit et que le groupe reste dans 100 m.
- **I (1 PTV) · Relais des Limiers** (SR/R, passif, après Cor de chasse) : tant qu'un membre voit la proie désignée, les autres ne peuvent pas être Surpris par elle. Aucun sens partagé.
- **II (2 PTV) · Rabattre la proie** (V/SR/R, réaction 1 PA, 1/round) : quand la proie désignée rompt le contact avec un membre et entre dans ta zone d'intervention, tu fais une action simple pour fermer cette voie de fuite. Pas d'attaque. Il faut posséder ce talent pour l'utiliser.
- **II (2 PTV) · Battue volante** (R, passif) : deux membres coordonnés perçoivent la même proie marquée depuis deux positions à 20 m. Ses capacités de fuite immédiate coûtent +1 PA (maximum 3, sans cumul de battues).
- **III (3 PTV) · Grande Chasse** (R, 1 PA par participant, au moins 3, 1/scène, après Cor de chasse et Battue volante) : tant que trois participants restent engagés à 20 m : la proie reste identifiée par tous tant qu'un la perçoit, ne peut effacer sa trace, et doit vaincre le meilleur V + MS du groupe, fixé au rite, pour quitter la zone par un moyen surnaturel. Vous savez quand elle tente de rompre. Aucun PA ni attaque gratuits.

**Changements** : en-tête tronqué de Grande Chasse réparé (« Prérequis : Cor de ch »). Ressort déjà distinct de la Battue sacrée (Arianwen) : ici la proie doit porter la Marque du Limier.

### 3.11 Lueurs d'Azménor

Petite tradition née d'un héritage azménorien déformé. Leurs dons viennent réellement du Néant ; la doctrine construite autour peut être fausse. Une Menace n'est jamais une détection du Mal : c'est une puissance déjà engagée vers une conséquence importante. Accès naturel pour le noyau historique et les initiés, restreint pour un recrutement extérieur exceptionnel.

#### Visions des Menaces — 1 porte
*Voir ce qui vient, sans savoir l'interpréter.*
*Reprend : Écho de Menace, Vision de Menace, Fil de convergence, Seuil de catastrophe, Avenir sans intervention.*

- **I (1 PTV) · Écho de Menace** (SR/R, passif, 1/scène, 20 m) : quand une puissance latente devient une Menace active, tu sens que « quelque chose vient de commencer ». Rien de plus.
- **II (2 PTV) · Vision de Menace** (SR/R, rituel de 10 minutes, 1/scénario) : sur une personne, un lieu, un objet ou une situation, le MJ donne un fragment vrai de la Menace déjà en mouvement la plus susceptible de la frapper dans les 24 heures. Vision vide s'il n'y en a pas.
- **II (2 PTV) · Fil de convergence** (SR/R, 1 PA, 1/scène) : deux éléments surnaturels que tu as perçus appartiennent-ils à la même Menace ? Oui, non ou lien indirect. Jamais la nature du lien.
- **II (2 PTV) · Seuil de catastrophe** (SR/R, 1 PA, 1/scène) : sur une Menace identifiée, le MJ indique une condition concrète, déjà en place, qui lui ferait franchir son prochain seuil. Pas la solution.
- **III (3 PTV) · Avenir sans intervention** (R, rituel de 30 minutes, 1/scénario, après Vision de Menace) : le MJ donne une conséquence majeure probable si personne n'intervient, un fragment de la scène, et un signe concret qui montrera que cet avenir cesse d'être valable. Jamais un destin fixé.

**Changements** : en-tête de Seuil de catastrophe complété (1 PA).

#### Purge du Néant — 1 porte
*Toucher l'imposé, le défaire, le suspendre.*
*Reprend : Toucher d'Absence, Purger la corruption, Défaire la chair faussée, Silence de la Marque, Puits d'Absence.*

- **I (1 PTV) · Toucher d'Absence** (SR/R, 1 PA, au contact) : une modification surnaturelle est-elle intrinsèque ou imposée ? Si imposée, sa famille générale : Magie, Fléau, divine, possession ou autre source étrangère. Ni nom ni fonctionnement ; un masquage s'y oppose.
- **II (2 PTV) · Purger la corruption** (R, rituel d'une heure, 1/scénario par cible, après Toucher d'Absence) : sur une cible consentante dont la Corruption vient d'une source surnaturelle extérieure, V + MS contre la Puissance de la source. Réussite : retire 1 point de Corruption (1 au plus par cible et par scénario, tous officiants confondus).
- **II (2 PTV) · Défaire la chair faussée** (R, 2 PA au contact, ou rituel d'une heure) : sur une altération corporelle imposée de l'extérieur, V + MS contre sa source. Une transformation temporaire prend fin (2 PA) ; une modification durable encore soutenue est retirée (1 heure). Ni Nature, ni physiologie naturelle, ni prothèse.
- **II (2 PTV) · Silence de la Marque** (R, 1 PA, 10 m, 1/scène) : sur une marque extérieure identifiée (faveur, bénédiction, pacte, investiture, marque divine ou de Fléau), V + MS contre sa Puissance. Réussite : ses bénéfices actifs sont suspendus jusqu'à la fin de la prochaine activation de la cible. Ni Nature, ni Patron, ni Empreinte.
- **III (3 PTV) · Puits d'Absence** (R, 3 PA au contact, 1/scène, après Purger la corruption et Défaire la chair faussée) : un seul jet de V + MS, opposé séparément à chaque influence extérieure de corruption, de chair faussée ou de délégation présente. Seules les vaincues sont suspendues pour la scène, bénéfiques comprises. Ni Nature ni Corruption acquise.

**Changements** : aucun. Purger la corruption est cohérent avec le chapitre Corruption (« moyen rare et explicitement capable de purifier la Source », points indiqués seulement). Ressorts déjà distincts : Silence de la Marque suspend une marque (une activation), l'Excommunication de Magdalena un canal (la scène).

#### Extinction — 1 porte
*Reconnaître la famille d'un pouvoir, puis l'éteindre.*
*Reprend : Signature de Puissance, Vide entre les gestes, Fracture d'Extinction, Interdit du Néant, Chambre d'Extinction.*

- **I (1 PTV) · Signature de Puissance** (SR/R, passif) : quand tu assistes à l'usage d'un pouvoir Actif, tu reconnais sa famille énergétique (magique, divine, Fléau, spirituelle, biologique, technomagique, Néant), et si deux capacités vues semblent venir de la même source. Ni nom, ni fiche.
- **II (2 PTV) · Vide entre les gestes** (R, réaction 1 PA, 1/scène par cible, 10 m) : juste après qu'une cible a utilisé une capacité Active, V + MS contre sa Défense occulte. Réussite : sa prochaine utilisation de cette capacité dans la scène coûte +1 PA (maximum 3). Une seule taxe en attente par capacité.
- **II (2 PTV) · Fracture d'Extinction** (R, 1/scène, sans PA) : après une blessure, V + MS contre la Puissance d'une Protection active identifiée de la cible. Réussite : cette Protection est suspendue jusqu'à la fin de sa prochaine activation. Aucune armure matérielle retirée.
- **III (3 PTV) · Interdit du Néant** (R, 1 PA, 10 m, 1/scène, après Signature de Puissance) : l'extinction est muette : la cible ne sait pas d'où elle vient. Sur une capacité Active que tu as vue et dont tu as reconnu la famille, V + MS contre sa Défense occulte. Réussite : elle ne peut être activée jusqu'à la fin de la prochaine activation de la cible. Jamais une Nature entière ni « toute sa Magie ».
- **III (3 PTV) · Chambre d'Extinction** (R, 2 PA puis 1 PA par round, 1/scène) : choisis une famille de puissance que tu as déjà reconnue. Dans 3 m autour de toi, alliés compris, toute nouvelle activation de cette famille doit aussi vaincre ton V + MS, fixé au départ ; en échec, PA dépensés et rien ne se forme. Passifs, Natures et effets autonomes continuent.

**Changements** : **ressort propre ajouté** à Interdit du Néant : l'extinction est muette (la cible ignore sa source) et ne vise qu'une famille reconnue. Avant, il était identique à Interdit de Bina (Kabbale).

#### Les Voix dans le Vide — 1 porte
*Les voix du Néant avertissent, contredisent, conseillent.*
*Reprend : Avertissement impossible, La voix derrière le mensonge, Conseil inhumain, Contempler l'Absence, Dernière Lueur.*

- **I (1 PTV) · Avertissement impossible** (SR/R, passif, 1/scène) : quand ton action volontaire va déclencher un piège ou phénomène surnaturel latent indétectable, une voix t'avertit une fraction de seconde avant. Tu peux renoncer ; tu ne sais pas ce qui allait arriver.
- **II (2 PTV) · La voix derrière le mensonge** (SR/R, réaction 1 PA, 1/scène) : sous illusion, perception falsifiée, mémoire modifiée ou réalité mentale imposée, la Voix montre une contradiction réelle : nouveau test complet contre la Puissance de l'effet, même s'il n'en prévoit pas.
- **II (2 PTV) · Conseil inhumain** (SR/R, 1 PA, 1/scène) : face à un danger surnaturel immédiat mal compris : « Quelle action à ma portée pourrait me faire survivre aux prochaines secondes ? » Le MJ donne une réponse concrète s'il en existe une. L'action se paie normalement.
- **II (2 PTV) · Contempler l'Absence** (R, 1 PA, 10 m, 1/scène) : jusqu'à la fin du round, tu perçois comme des vides les phénomènes actifs qui effacent ou excluent quelque chose de la Création (annihilation, brèche vers le Néant, disparition, désintégration). Rien d'autre.
- **III (3 PTV) · Dernière Lueur** (R, réaction 1 PA, 1/scénario) : quand un effet surnaturel devrait t'amener à ton seuil de Mort ou au-delà, tu restes 1 PV au-dessus. Ni soin, ni protection contre le coup suivant ; un seul sauvetage par conséquence.

**Changements** : en-têtes complétés (1 PA ou réaction 1 PA) pour La voix derrière le mensonge, Conseil inhumain et Dernière Lueur. Ressort déjà distinct de Refus de mourir (Indépendants) : la Lueur est sauvée de tout effet surnaturel, une fois par scénario, pour 3 PTV ; le Survivant seulement d'une famille déjà affrontée.

### 3.12 Xenoshield

Armée internationale indépendante, reconstruite en 2032 contre les intrusions extraterrestres ; ses soldats opèrent infiltrés. L'accès dépend d'une formation réelle, pas de l'espèce : un Humain ou un Extral sincèrement formé peut posséder ces techniques. Aucun diagnostic ne prouve une hostilité, une culpabilité ou une loyauté.

#### Détection d'intrusion — 1 porte
*Établir l'origine non terrestre, rien de plus.*
*Reprend : Incompatibilité, Résidu d'intrusion, Faux humain, Signature impossible, Pont fantôme.*

- **I (1 PTV) · Incompatibilité** (V/SR/R, 1 PA, 3 m ou au contact d'un échantillon) : tu sais si une créature, une trace ou un échantillon repose sur une biologie extraterrestre, même sous un camouflage parfait. Sous Hologramme : l'exogénéité seulement, jamais la forme, l'espèce ou les intentions.
- **I (1 PTV) · Résidu d'intrusion** (V/SR/R, 1 PA, 10 m) : dans un lieu où une technologie extraterrestre a fonctionné dans les dernières 24 heures, tu perçois la rupture résiduelle et son point général. Investigation et Technologie font le reste.
- **II (2 PTV) · Faux humain** (SR/R, passif) : après un round d'observation directe à 10 m, tu détectes une falsification de la physiologie d'une cible. Ni biologie extraterrestre ni hostilité prouvées : Incompatibilité reste nécessaire.
- **II (2 PTV) · Signature impossible** (SR/R, 1 PA, au contact ou 3 m) : tu reconnais le paradigme d'une civilisation déjà étudiée, même si matériaux, architecture et apparence ont été changés. Aucun mode d'emploi offert.
- **II (2 PTV) · Pont fantôme** (R, 2 PA, 1/scène) : avec un capteur terrestre adapté (100 m au plus), tu cartographies un réseau extraterrestre local : nœuds actifs, relais, directions. Aucun décryptage.

**Changements** : aucun.

#### Xénobiologie hostile — 1 porte
*Trouver où le corps étranger cède.*
*Reprend : Point de rupture, Blessure xénologique, Agent incompatible, Contamination croisée, Effondrement adaptatif.*

- **I (1 PTV) · Point de rupture** (SR/R, 1 PA, 10 m) : après avoir vu une adaptation biologique extraordinaire, tu identifies un point matériel atteignable pour la perturber. Aucune vulnérabilité inventée.
- **II (2 PTV) · Blessure xénologique** (R, 1/scène, sans PA, après Point de rupture) : après avoir blessé un Extral dont le mécanisme est identifié, Esprit + Science contre Vigueur + Constitution : un processus biologique observé (régénération, respiration secondaire, adhérence, changement de forme) est suspendu jusqu'à la fin de sa prochaine activation.
- **II (2 PTV) · Agent incompatible** (SR/R, préparation de 4 heures, après Point de rupture) : avec échantillon et laboratoire, une dose d'inhibiteur contre un mécanisme identifié. Exposition réelle : Vigueur + Constitution contre ton résultat ; une adaptation inhibée pour la scène. Ni laboratoire ni matériaux fournis.
- **II (2 PTV) · Contamination croisée** (R, réaction 1 PA, 1/scène, 10 m) : un allié est exposé à une toxine, un parasite ou un agent infectieux non terrestre : tu le reconnais et il fait un nouveau test (sinon Vigueur + Constitution contre la Puissance de l'agent). Ni antidote ni soin.
- **III (3 PTV) · Effondrement adaptatif** (R, 1/scène, sans PA, après Blessure xénologique) : après avoir blessé une créature qui utilise une adaptation, Esprit + Science contre Vigueur + Constitution (Puissance pour un soutien technomagique) : l'adaptation choisie est neutralisée pour la scène. Jamais un cœur vital.

**Changements** : en-tête de Contamination croisée complété (réaction 1 PA). Ressort déjà distinct des autres résistances accordées : ici Vigueur + Constitution et un agent biologique étranger.

#### Contre-technologie — 1 porte
*Faire céder une machine qui n'a pas été pensée pour toi.*
*Reprend : Interface hérétique, Court-circuit de paradigme, Fenêtre de brouillage, Boucle de retour, Rupture de système.*

- **I (1 PTV) · Interface hérétique** (SR/R, 1 PA) : tu tentes d'utiliser une interface extraterrestre qui n'est pas faite pour toi. Les tests techniques et les verrous biologiques absolus restent ; tu accèdes aux fonctions identifiables.
- **II (2 PTV) · Court-circuit de paradigme** (R, 1 PA, 1/scène) : après avoir vu une technologie extraterrestre utiliser une fonction Active, interaction matérielle et Esprit + Technologie contre sa sécurité. Réussite : cette fonction est coupée jusqu'à la fin de la prochaine activation de son utilisateur.
- **II (2 PTV) · Fenêtre de brouillage** (R, réaction 1 PA, 1/scène) : quand un appareil extraterrestre tente transmission, verrouillage, guidage, synchronisation ou télécommande, ton émetteur introduit une interférence : Esprit + Technologie contre le système ; réussite, l'échange échoue cette fois.
- **III (3 PTV) · Boucle de retour** (R, réaction 1 PA, 1/scène, après Court-circuit) : quand une technologie déjà étudiée agit sur toi et que ta Défense ou résistance réussit, tu renvoies une contre-interaction par le même vecteur : la fonction est coupée jusqu'à la fin de la prochaine activation de sa source. Aucune attaque renvoyée.
- **III (3 PTV) · Rupture de système** (R, 2 PA, 1/scène, après Court-circuit) : sur un dispositif dont tu as vu une fonction, par interface, signal ou connexion, Esprit + Technologie contre sa sécurité. Réussite : une fonction Active choisie est coupée pour la scène.

**Changements** : en-tête de Court-circuit de paradigme complété (1 PA).

#### Confinement et interception — 1 porte
*Marquer la cible, empêcher qu'on l'extraie.*
*Reprend : Marque d'interception, Accrocher le signal, Mettre à terre, Zone morte, Pas de récupération.*

- **I (1 PTV) · Marque d'interception** (SR/R, 1 PA, analyse à 3 m ou échantillon) : une seule cible. Tu la reconnais malgré changement d'identifiant, usurpation électronique ou camouflage technologique du même paradigme, et tu es averti quand son extraction technologique commence à 20 m au plus.
- **II (2 PTV) · Accrocher le signal** (R, réaction 1 PA, 1/scène, après Marque d'interception) : quand la cible marquée tente une extraction à distance, Esprit + Technologie contre le système : le processus est retardé jusqu'à la fin de sa prochaine activation.
- **II (2 PTV) · Mettre à terre** (R, réaction 1 PA, 1/scène, après Marque d'interception et Fenêtre de chasse) : exception à Fenêtre de chasse : quand la cible marquée engage un déplacement extraordinaire par un mécanisme identifié, une attaque comprise dans la réaction. Blessure au mécanisme : ce mode est coupé jusqu'à la fin de sa prochaine activation.
- **III (3 PTV) · Zone morte** (R, 2 PA puis 1 PA par round, 1/scène) : avec un brouilleur, dans 3 m, appareils alliés compris, les communications, rappels, guidages et commandes distantes extraterrestres doivent vaincre ton Esprit + Technologie, fixé au départ. Ni Magie, ni télépathie, ni biologie.
- **III (3 PTV) · Pas de récupération** (R, passif, après Marque d'interception et Mise à mort préparée) : une Mise à mort préparée sur une cible extraterrestre bloque aussi pour la scène ses protocoles locaux identifiés (extraction du corps, téléchargement neural local, téléportation post-mortem, balise, drone récupérateur). Rien de distant.

**Changements** : aucun. Ressort déjà distinct des autres zones d'interdiction : la Zone morte ne coupe que la technologie extraterrestre.

### 3.13 Chasseurs indépendants

Ni doctrine, ni uniforme, ni réseau unique. Un personnage a normalement un Héritage naturel, et un second ouvert si son histoire le justifie ; les autres sont restreints et peuvent s'ouvrir en jeu. Un Héritage reste attaché à ce qui a été réellement vécu ou transmis.

#### Survivant de l'impossible — 1 porte
*Ce qui ne t'a pas tué t'a appris.*
*Reprend : Réflexe traumatique, Refus de mourir, Cicatrice révélatrice, Retour du prédateur.*

- **I (1 PTV) · Réflexe traumatique** (V/SR/R, réaction 1 PA, 1/scène) : quand une famille déjà affrontée déclenche contre toi une capacité que tu as déjà subie, tu fais une Défense active ou une action simple de protection, même Surpris. Aucun PA gratuit.
- **II (2 PTV) · Refus de mourir** (V/SR/R, réaction 1 PA, 1/scénario) : quand une conséquence surnaturelle d'une famille déjà affrontée devrait te faire franchir ton seuil de Mort, tu restes 1 PV au-dessus. Ni soin, ni protection contre le coup suivant.
- **II (2 PTV) · Cicatrice révélatrice** (SR/R, passif, 10 m) : choisis à l'achat une cicatrice surnaturelle réelle et sa famille. Quand cette famille agit près de toi, la cicatrice réagit : tu sais que c'est là, pas où.
- **III (3 PTV) · Retour du prédateur** (R, réaction 1 PA, 1/scène, après Cicatrice révélatrice) : quand une créature de cette famille déclenche contre toi exactement le type d'effet qui t'a marqué, V + MS contre sa Puissance. Réussite : il échoue sur toi cette fois.

**Changements** : en-têtes complétés (réaction 1 PA) pour Réflexe traumatique, Refus de mourir et Retour du prédateur.

#### Tradition familiale — 1 porte
*Le secret d'une maison contre sa proie historique.*
*Reprend : Signe de la maison, Rite de la maison, Arme héritée, Dernière leçon.*

- **I (1 PTV) · Signe de la maison** (SR/R, préparation de 10 minutes, 24 heures) : un seuil de 3 m, un objet ou un rayon de 3 m. Si un représentant de la proie traditionnelle le franchit ou l'active, le signe change, même sans trace normale. Il ne localise pas.
- **II (2 PTV) · Rite de la maison** (SR/R, rituel de 10 minutes, scène) : choisis une fonction à l'achat, efficace seulement contre la proie historique : seuil de 3 m qu'elle ne franchit pas, détection à 10 m, blocage de sa régénération un round, ou refuge de 3 m. Un effet hostile s'oppose à sa Puissance.
- **II (2 PTV) · Arme héritée** (SR/R, préparation de 10 minutes) : une arme ordinaire ou un lot de 6 munitions acquiert pour la scène une résonance avec la faiblesse familiale connue. Composants consommés ; ni arme, ni faiblesse, ni dégâts fournis.
- **III (3 PTV) · Dernière leçon** (R, 1/scène, sans PA, après Rite de la maison) : après une action réussie qui exploite le secret de famille contre la proie historique, une Protection, une régénération ou une fuite directement incompatible avec cette faiblesse est suspendue jusqu'à la fin de sa prochaine activation.

**Changements** : Rite de la maison n'est plus « défini avec le MJ » : les quatre profils fermés de ses conditions deviennent le seul choix (correction de l'incohérence entre texte et conditions).

#### Bricoleur de Vérité — 1 porte
*Faire marcher ensemble ce qui ne devrait pas.*
*Reprend : Interface bâtarde, Relais de propriété, Surcharge impossible, Prototype unique.*

- **I (1 PTV) · Interface bâtarde** (SR/R, préparation d'une heure au moins) : tu fais fonctionner ensemble deux technologies ou principes de Vérité incompatibles, si tu possèdes les composants. Une fonction existante par liaison ; test technique si incertain.
- **II (2 PTV) · Relais de propriété** (SR/R, préparation, après Interface bâtarde) : une propriété surnaturelle réelle d'un composant passe dans une autre fonction du montage (une relique qui touche les esprits permet au capteur construit autour d'enregistrer ce contact). Rien d'inventé.
- **II (2 PTV) · Surcharge impossible** (R, 1 PA, 1/scène) : un dispositif hybride que tu as préparé dépasse une fois son interface : portée ou rayon ×2, ou fonctionnement sous alimentation insuffisante, ou tolérance d'un milieu précis. Puis il tombe en panne jusqu'à réparation.
- **III (3 PTV) · Prototype unique** (R, préparation de plusieurs heures ou jours, après Interface bâtarde et Relais de propriété) : un dispositif qui produit une interaction de Vérité nouvelle à partir de composants réels. Sa fiche fixe composants, fonction unique, PA, portée, Puissance, durée, entretien et défaillance. Les PTV achètent le savoir-faire, jamais l'objet.

**Changements** : en-tête de Surcharge impossible complété (1 PA).

#### Marqué par la proie — 1 porte
*La marque d'une créature, retournée contre sa famille.*
*Reprend : Odeur du semblable, Résonance étrangère, Retour par le lien, Retourner la cicatrice.*

- **I (1 PTV) · Odeur du semblable** (SR/R, 1 PA, 10 m) : choisis à l'achat une marque réelle et sa famille. Tu reconnais la même signature fondamentale chez une cible perçue. Ni identité, ni clan, ni puissance ; une dissimulation adaptée s'y oppose.
- **II (2 PTV) · Résonance étrangère** (SR/R, réaction 1 PA) : quand un pouvoir de cette famille te vise, ta marque répond : +3 à la résistance (sans cumul). Si tu échoues quand même, la source sait que tu portes cette résonance.
- **II (2 PTV) · Retour par le lien** (R, réaction 1 PA, 1/scène) : quand une créature de cette famille agit sur ta marque ou l'exploite, tu sens la direction de la source jusqu'à la fin du round, même plan. Un anti-lien adapté bloque.
- **III (3 PTV) · Retourner la cicatrice** (R, 1/scène, sans PA, après Résonance étrangère) : quand un pouvoir de cette famille échoue contre toi, jusqu'à la fin de ta prochaine activation la source ne peut plus se dissimuler à toi par un effet de cette famille. Ni murs, ni Hologramme, ni autre famille.

**Changements** : en-tête de Retour par le lien complété (réaction 1 PA).

#### Obsession d'une seule proie — 1 porte (courte)
*Une proie, une seule, pour toujours.*
*Reprend : Je te retrouverai, Rien ne te remplacera, Le chemin jusqu'à toi, Pas cette fois.*

- **I (1 PTV) · Je te retrouverai** (SR/R, rituel de 10 minutes) : avec une trace authentique de ta proie obsessionnelle (sang, fragment, objet très lié), tu sais si elle est encore à 10 km au plus, même plan. Oui ou non.
- **I (1 PTV) · Rien ne te remplacera** (SR/R, passif) : tu reconnais ta proie obsessionnelle quand tu la perçois, malgré métamorphose, corps différent, possession ou déguisement. Une cible Voilée reste humaine ; tu sais seulement que c'est elle.
- **II (2 PTV) · Le chemin jusqu'à toi** (SR/R, 1 PA, 1/scène) : avec une trace authentique, une direction approximative vers ta proie si elle est à 10 km au plus, même plan. Un effet anti-lien s'y oppose.
- **II (2 PTV) · Pas cette fois** (R, réaction 1 PA, 1/scène, après Fenêtre de chasse) : tu détectes le départ autrement imperceptible de ta proie obsessionnelle et utilises Fenêtre de chasse : une action simple, sans attaque ni seconde dépense. Aucune autre proie.

**Changements** : en-tête du Chemin jusqu'à toi complété (1 PA). Ressort déjà distinct des autres reconnaissances : une seule proie, choisie pour toujours.

### 3.14 Table Ronde

Descendants des chevaliers choisis par Merlin, pas leurs réincarnations. Trois conditions ne coûtent aucun PTV : descendre d'un chevalier historique, retrouver l'Arme de Merlin de sa lignée, être reconnu par elle. L'arme est unique et ne reconnaît qu'un héritier actif à la fois. Excalibur reste à part.

#### Résonance de Merlin — 1 porte
*L'héritier et son arme ne font qu'un.*
*Reprend : Appel de l'arme, Reconnaître l'héritage, Mémoire du fer, Lien indissociable, Résonance parfaite.*

- **I (1 PTV) · Appel de l'arme** (SR/R, 1 PA) : ton arme à 20 m au plus rejoint ta main par le trajet le plus direct. Ni matière pleine, ni contenant fermé, ni sceau ; elle n'est pas arrachée à un porteur hostile.
- **I (1 PTV) · Reconnaître l'héritage** (SR/R, passif) : au contact d'une arme de Merlin, tu reconnais son authenticité et sa lignée. Ni l'identité ni la position de son héritier actuel.
- **II (2 PTV) · Mémoire du fer** (SR/R, 1 PA, 1/scène, arme tenue) : face à un lieu, une personne, une créature ou un objet qu'un ancien héritier a rencontré avec elle, un bref souvenir authentique (image, parole, émotion, fragment de combat). Aucune Compétence transmise.
- **II (2 PTV) · Lien indissociable** (SR/R, passif) : toute tentative surnaturelle de voler le lien, d'asservir l'arme ou de lui faire accepter un faux héritier doit vaincre ton V + MS. Le vol ordinaire reste possible : il protège le lien, pas les poches.
- **III (3 PTV) · Résonance parfaite** (R, 1 PA, 1/scène, au moins deux Formes connues) : pour la scène, changer de Forme est gratuit une fois par round, un Appel de l'arme est gratuit une fois, et une Forme peut apparaître pendant une réaction qui utilise l'arme. Aucun PA ni attaque créés.

**Changements** : en-tête de Mémoire du fer complété (1 PA). Reconnaître l'héritage inchangé, voir question 5.

#### Formes de la Lame — 1 porte
*Les formes que l'arme de Merlin sait prendre.*
*Reprend : Forme de Garde, Forme de Chasse, Forme d'Entrave, Forme de Rupture, Forme du Chevalier.*

- **I (1 PTV) · Forme de Garde** (R, passif) : ton arme peut parer, pour le PA normal de la Défense active de Mêlée, une attaque surnaturelle physique ou énergétique qu'une arme ordinaire ne parerait pas. Pas contre une possession ou une pensée.
- **II (2 PTV) · Forme de Chasse** (R, passif) : une forme adaptée frappe un esprit manifesté ou une créature partiellement immatérielle accessible au contact. Ni cible absente, ni autre plan ; aucun dégât en plus.
- **II (2 PTV) · Forme d'Entrave** (R, passif) : sur une attaque réussie à DR 2+, renonce à une Altération pour empêcher, jusqu'à la fin de la prochaine activation de la cible, un déplacement surnaturel qui passe par le corps touché (phase, dissolution, transformation de fuite, déplacement spectral). Pas un portail extérieur.
- **III (3 PTV) · Forme de Rupture** (R, 1 PA au contact, 1/scène) : une barrière, un lien, un enchantement ou un ancrage que tu perçois comme cible distincte : attaque-le, Vigueur + Mêlée contre sa Puissance. Réussite : suspendu jusqu'à la fin de la prochaine activation de sa source. Jamais une Nature, un Mageius ou un passif fondamental.
- **III (3 PTV) · Forme du Chevalier** (R, 1/scène) : la fonction parfaite de ton arme, choisie une fois pour toutes parmi trois profils : interception (réaction 1 PA) ; ouverture d'un seuil (2 PA, sur opposition) ; verrou d'une fuite précise (1 PA, sur opposition). Portée 10 m ou contact selon le profil. Jamais un bonus de dégâts.

**Changements** : Forme du Chevalier n'est plus « définie avec le MJ » : les trois profils fermés de ses conditions deviennent le seul choix. Forme de Rupture garde Vigueur + Mêlée, alors que ses équivalents d'autres traditions utilisent V + MS : c'est son ressort propre (la lame du chevalier, pas la prière). Signalé, non corrigé.

#### Héritage chevaleresque — 1 porte
*Le serment de quête et la mémoire de la lignée.*
*Reprend : Serment de Quête, Écho de la lignée, Écho ancestral, Aucun enchantement ne détourne, Quête inachevée.*

- **I (1 PTV) · Serment de Quête** (SR/R, rituel de 10 minutes) : un objectif concret et un critère de fin, une seule Quête active. Tu sais toujours si elle reste réalisable ou est devenue impossible ; pas comment l'accomplir.
- **I (1 PTV) · Écho de la lignée** (SR/R, 1 PA, 1/scène, arme tenue) : pour un membre de ta lignée déjà reconnu par l'arme : vivant ou non, même plan ou non, et sa direction s'il est à 10 km au plus. Un anti-lien bloque.
- **II (2 PTV) · Écho ancestral** (SR/R, 1 PA, 1/scène, arme tenue) : dans une situation analogue à ce qu'a vécu ton ancêtre chevalier avec cette arme, tu reçois ce qu'il a compris trop tard, réussi ou raté. Une possibilité, jamais une réussite.
- **II (2 PTV) · Aucun enchantement ne détourne** (SR/R, passif, après Serment de Quête) : tant que ta Quête est valable, +3 (sans cumul) aux résistances contre une influence surnaturelle qui te contraindrait à la trahir. Ni immunité ni relance.
- **III (3 PTV) · Quête inachevée** (R, réaction 1 PA, 1/scénario, après Serment de Quête) : quand un effet devrait te tuer alors que ta Quête reste réalisable, l'arme te maintient jusqu'à la fin de ta prochaine activation. Aucun PV rendu ; sans stabilisation avant, la mort suit.

**Changements** : en-têtes complétés pour Écho de la lignée, Écho ancestral (1 PA) et Quête inachevée (réaction 1 PA).

#### La Table — 1 porte
*Les héritiers se reconnaissent, s'appellent, se reforment.*
*Reprend : Les armes se reconnaissent, Appel de la Table, Résonance croisée, Formes complémentaires, Reformer la Table.*

- **I (1 PTV) · Les armes se reconnaissent** (SR/R, passif, 20 m) : quand une autre véritable arme de Merlin est à portée de perception, tu sais qu'un autre héritier de la Table est là ; sa lignée seulement si elle t'est familière.
- **I (1 PTV) · Appel de la Table** (SR/R, 1 PA) : une impulsion simple aux autres armes de Merlin à 10 km au plus, même plan : danger, rassemblement, poursuite ou aide, avec une direction. Pas une conversation ; un scellement spirituel la coupe.
- **II (2 PTV) · Résonance croisée** (SR/R, réaction 1 PA, 10 m) : quand un autre chevalier fait une Défense active contre un phénomène surnaturel, ton arme résonne avec la sienne : Assistance +2, même en combat. Une seule Assistance.
- **III (3 PTV) · Formes complémentaires** (R, passif, 1/round) : quand deux porteurs coordonnent deux actions payées, l'ouverture réellement créée par la première Forme tient jusqu'à l'action du partenaire avant la fin du round. Le partenaire doit avoir une Forme et un vecteur compatibles ; rien n'est offert.
- **III (3 PTV) · Reformer la Table** (R, 1 PA par héritier, au moins 3, 1/scène, 20 m) : tant que trois restent conscients dans la zone : chaque arme connaît la position des autres ; une falsification qui veut les isoler doit vaincre le meilleur V + MS du groupe ; aucune arme ne peut être arrachée à sa lignée ; Appel de la Table est gratuit une fois par round dans le groupe.

**Changements** : aucun. Les armes se reconnaissent inchangé, voir question 5.

## 4. Table de correspondance

Les 266 entrées, dans l'ordre du fichier. Palier = coût d'origine en PTV. Aucune entrée supprimée.

| # | Entrée | Voie | Palier (PTV) |
|---|---|---|---|
| 1 | Rompu aux horreurs | Doctrine de Chasse | I (1) |
| 2 | Fenêtre de chasse | Doctrine de Chasse | II (2) |
| 3 | Frapper la faiblesse | Doctrine de Chasse | II (2) |
| 4 | Mise à mort préparée | Doctrine de Chasse | III (3) |
| 5 | Lire la souillure | Lavandières | I (1) |
| 6 | Sang sous le masque | Lavandières | II (2) |
| 7 | Saignée noire | Lavandières | II (2) |
| 8 | Clouer au corps | Lavandières | III (3) |
| 9 | Consécration de terrain | Liturgie de terrain (porte A) | I (1) |
| 10 | Signe de fermeté | Liturgie de terrain (porte B) | I (1) |
| 11 | Intercession | Liturgie de terrain (porte B) | II (2) |
| 12 | Sanctuaire provisoire | Liturgie de terrain (porte A) | II (2) |
| 13 | Derniers rites | Liturgie de terrain (porte B) | II (2) |
| 14 | Restaurer le sacré | Liturgie de terrain (porte A) | II (2) |
| 15 | Chasse en escouade | Arianwen · Escouade | I (1) |
| 16 | Couverture croisée | Arianwen · Escouade | II (2) |
| 17 | Relais de chasse | Arianwen · Escouade | I (1) |
| 18 | Battue sacrée | Arianwen · Escouade | III (3) |
| 19 | Plaie consacrée | Arianwen · Armes consacrées | I (1) |
| 20 | Frapper l’immatériel | Arianwen · Armes consacrées | II (2) |
| 21 | Purification balistique | Arianwen · Armes consacrées | II (2) |
| 22 | Salve de purification | Arianwen · Armes consacrées | III (3) |
| 23 | Tenir le monstre | Arianwen · Tenir la proie | I (1) |
| 24 | Briser la mue | Arianwen · Tenir la proie | II (2) |
| 25 | Clouer la proie | Arianwen · Tenir la proie | II (2) |
| 26 | Tueur de l’impossible | Arianwen · Armes consacrées | III (3) |
| 27 | Présence étrangère | Ephraïm · Discernement | I (1) |
| 28 | Faire parler l’occupant | Ephraïm · Exorcisme | I (1) |
| 29 | Lire l’ancrage | Ephraïm · Discernement | II (2) |
| 30 | Distinguer l’hôte | Ephraïm · Exorcisme | II (2) |
| 31 | Ligne de sel | Ephraïm · Seuils | I (1) |
| 32 | Cercle d’Ephraïm | Ephraïm · Seuils | II (2) |
| 33 | Fermer le seuil | Ephraïm · Seuils | II (2) |
| 34 | Chambre blanche | Ephraïm · Seuils | III (3) |
| 35 | Prière de bannissement | Ephraïm · Exorcisme | II (2) |
| 36 | Purge | Ephraïm · Exorcisme | III (3) |
| 37 | Renvoi | Ephraïm · Exorcisme | III (3) |
| 38 | Grand exorcisme | Ephraïm · Exorcisme | III (3) |
| 39 | Pesée de l’âme | Magdalena · Enquête | I (1) |
| 40 | Lire la marque | Magdalena · Enquête | II (2) |
| 41 | Suivre la chaîne | Magdalena · Enquête | II (2) |
| 42 | Main de l’Inquisiteur | Magdalena · Enquête | I (1) |
| 43 | Mise sous scellés | Magdalena · Jugement | II (2) |
| 44 | Confiscation spirituelle | Magdalena · Jugement | II (2) |
| 45 | Faire comparaître la corruption | Magdalena · Jugement | II (2) |
| 46 | Briser le pacte | Magdalena · Jugement | III (3) |
| 47 | Excommunication surnaturelle | Magdalena · Jugement | III (3) |
| 48 | Jugement | Magdalena · Jugement | I (1) |
| 49 | Arme du Serment | Khālsā · Arme du Serment | I (1) |
| 50 | Plaie fidèle | Khālsā · Arme du Serment | II (2) |
| 51 | Trancher l’emprise | Khālsā · Arme du Serment | II (2) |
| 52 | Coup de délivrance | Khālsā · Arme du Serment | II (2) |
| 53 | Briser le rempart | Khālsā · Arme du Serment | III (3) |
| 54 | Veille du défenseur | Khālsā · Devoir de Protection | I (1) |
| 55 | Parole qui relève | Khālsā · Devoir de Protection | II (2) |
| 56 | Tenir la ligne | Khālsā · Devoir de Protection | II (2) |
| 57 | Prendre le fardeau | Khālsā · Devoir de Protection | III (3) |
| 58 | Refuge vivant | Khālsā · Devoir de Protection | II (2) |
| 59 | Esprit sans maître | Khālsā · Volonté libre | I (1) |
| 60 | Déceler l’emprise | Khālsā · Volonté libre | I (1) |
| 61 | Refuser la souillure | Khālsā · Volonté libre | II (2) |
| 62 | Parole qui brise l’ordre | Khālsā · Volonté libre | II (2) |
| 63 | Libérer la volonté | Khālsā · Volonté libre | III (3) |
| 64 | Voir les chaînes | Khālsā · Briseur de chaînes | I (1) |
| 65 | Acier libérateur | Khālsā · Briseur de chaînes | II (2) |
| 66 | Délier l’entrave | Khālsā · Briseur de chaînes | II (2) |
| 67 | Briser le pacte contraint | Khālsā · Briseur de chaînes | III (3) |
| 68 | Serment contre serment | Khālsā · Briseur de chaînes | III (3) |
| 69 | Sentir le Qi | Taoïstes · Fondamentaux du Qi | I (1) |
| 70 | Lecture des méridiens | Taoïstes · Fondamentaux du Qi | II (2) |
| 71 | Souffle intérieur | Taoïstes · Fondamentaux du Qi | I (1) |
| 72 | Transe de l’équilibre | Taoïstes · Fondamentaux du Qi | III (3) |
| 73 | Paume Yin | Taoïstes · Voie du Yin | I (1) |
| 74 | Qi silencieux | Taoïstes · Voie du Yin | II (2) |
| 75 | Méridiens fermés | Taoïstes · Voie du Yin | II (2) |
| 76 | Nuit des cinq souffles | Taoïstes · Voie du Yin | III (3) |
| 77 | Paume Yang | Taoïstes · Voie du Yang | I (1) |
| 78 | Barrière Yang | Taoïstes · Voie du Yang | II (2) |
| 79 | Circulation vitale | Taoïstes · Voie du Yang | II (2) |
| 80 | Débordement Yang | Taoïstes · Voie du Yang | III (3) |
| 81 | Cycle contraire | Taoïstes · Harmonie | I (1) |
| 82 | Renversement des souffles | Taoïstes · Harmonie | II (2) |
| 83 | Deux souffles, un corps | Taoïstes · Harmonie | II (2) |
| 84 | Harmonie imposée | Taoïstes · Harmonie | III (3) |
| 85 | Vacillement du Qi | Taoïstes · Art du Néant des Shi | I (1) |
| 86 | Paume des Shi | Taoïstes · Art du Néant des Shi | III (3) |
| 87 | Sceau de Vacuité | Taoïstes · Art du Néant des Shi | II (2) |
| 88 | Grand Scellement des Shi | Taoïstes · Art du Néant des Shi | III (3) |
| 89 | Nœud de Kether | Kabbale · Unité et rêve | II (2) |
| 90 | Concordance de Kether | Kabbale · Unité et rêve | II (2) |
| 91 | Purification de Hokhma | Kabbale · Grâce | II (2) |
| 92 | Sceau de pureté | Kabbale · Grâce | II (2) |
| 93 | Imposer une limite | Kabbale · Rigueur | II (2) |
| 94 | Interdit de Bina | Kabbale · Rigueur | III (3) |
| 95 | Main de Hesed | Kabbale · Grâce | II (2) |
| 96 | Sursis de Hesed | Kabbale · Grâce | II (2) |
| 97 | Arme de Gueburah | Kabbale · Rigueur | I (1) |
| 98 | Brèche de Gueburah | Kabbale · Rigueur | III (3) |
| 99 | Offrande de Tiph’ereth | Kabbale · Grâce | I (1) |
| 100 | Sacrifice de Tiph’ereth | Kabbale · Grâce | II (2) |
| 101 | Élan de Nesah | Kabbale · Victoire | I (1) |
| 102 | Victoire contagieuse | Kabbale · Victoire | II (2) |
| 103 | Lecture de Hod | Kabbale · Rigueur | I (1) |
| 104 | Décomposition de Hod | Kabbale · Rigueur | II (2) |
| 105 | Image de Yessod | Kabbale · Unité et rêve | I (1) |
| 106 | Marche onirique | Kabbale · Unité et rêve | II (2) |
| 107 | Ancrage de Malkhouth | Kabbale · Unité et rêve | III (3) |
| 108 | Incarner de force | Kabbale · Unité et rêve | III (3) |
| 109 | Pacte du Djinn | Nizarites · Arts du Djinn | Entrée (2) |
| 110 | Voix du compagnon | Nizarites · Arts du Djinn | I (1) |
| 111 | Possession consentie | Nizarites · Arts du Djinn | II (2) |
| 112 | Déchaîner le Djinn | Nizarites · Arts du Djinn | III (3) |
| 113 | Sens jumelés | Nizarites · Arts du Djinn | I (1) |
| 114 | Rappel d’urgence | Nizarites · Arts du Djinn | II (2) |
| 115 | Échange d’ancrage | Nizarites · Arts du Djinn | III (3) |
| 116 | Incarnation profonde | Nizarites · Arts du Djinn | III (3) |
| 117 | Marque de la proie | Asāsīyūn · Marquer la proie | I (1) |
| 118 | Traque du pacte | Asāsīyūn · Marquer la proie | II (2) |
| 119 | Fenêtre jumelée | Asāsīyūn · Marquer la proie | I (1) |
| 120 | Sceau de poursuite | Asāsīyūn · Marquer la proie | III (3) |
| 121 | Balle liée | Asāsīyūn · Balles liées | I (1) |
| 122 | Trajectoire du Djinn | Asāsīyūn · Balles liées | II (2) |
| 123 | Projectile d’ancrage | Asāsīyūn · Balles liées | II (2) |
| 124 | Balle d’exil | Asāsīyūn · Balles liées | II (2) |
| 125 | Contre-rite du témoin | Asāsīyūn · Marquer la proie | II (2) |
| 126 | Dernier ancrage | Asāsīyūn · Marquer la proie | III (3) |
| 127 | Lien du Shikigami | Onmyoji · Shikigami | Entrée (2) |
| 128 | Résonance du Shikigami | Onmyoji · Shikigami | I (1) |
| 129 | Invocation du Shikigami | Onmyoji · Shikigami | III (3) |
| 130 | Porte-sceau | Onmyoji · Shikigami | I (1) |
| 131 | Ancrage vivant | Onmyoji · Shikigami | III (3) |
| 132 | Sceau d’Entrave | Onmyoji · Fūin | I (1) |
| 133 | Sceau du Silence | Onmyoji · Fūin | II (2) |
| 134 | Sceau de Fermeture | Onmyoji · Fūin | II (2) |
| 135 | Sceau de Protection | Onmyoji · Fūin | II (2) |
| 136 | Contre-sceau | Onmyoji · Fūin | II (2) |
| 137 | Grand Scellement | Onmyoji · Fūin | III (3) |
| 138 | Présence parasite | Onmyoji · Exorcisme et noms | I (1) |
| 139 | Sceau du Nom | Onmyoji · Exorcisme et noms | II (2) |
| 140 | Faire comparaître l’esprit | Onmyoji · Exorcisme et noms | II (2) |
| 141 | Extraction par le Sceau | Onmyoji · Exorcisme et noms | III (3) |
| 142 | Vase de Souillure | Onmyoji · Exorcisme et noms | III (3) |
| 143 | Pacte de Faveur | Onmyoji · Pactes d’esprits | I (1) |
| 144 | Sceau d’Affinité | Onmyoji · Pactes d’esprits | II (2) |
| 145 | Souffle emprunté | Onmyoji · Pactes d’esprits | II (2) |
| 146 | Manifestation prêtée | Onmyoji · Pactes d’esprits | III (3) |
| 147 | Correspondance sacrée | Néopaïens · Pratiques | I (1) |
| 148 | Syncrétisme opératif | Néopaïens · Pratiques | II (2) |
| 149 | Mémoire du lieu | Néopaïens · Pratiques | II (2) |
| 150 | Cercle des témoins | Néopaïens · Pratiques | II (2) |
| 151 | Offrande de paix | Néopaïens · Pratiques | II (2) |
| 152 | Veillée des morts | Néopaïens · Morts et Ancêtres | I (1) |
| 153 | Guider le défunt | Néopaïens · Morts et Ancêtres | II (2) |
| 154 | Appel des ancêtres | Néopaïens · Morts et Ancêtres | III (3) |
| 155 | Terre troublée | Néopaïens · Terre et Chasse | I (1) |
| 156 | Trace que rien n’efface | Néopaïens · Terre et Chasse | III (3) |
| 157 | Cercle de chasse | Néopaïens · Terre et Chasse | III (3) |
| 158 | Droit d’hospitalité | Néopaïens · Foyer et Seuils | I (1) |
| 159 | Feu du foyer | Néopaïens · Foyer et Seuils | II (2) |
| 160 | Maison fermée | Néopaïens · Foyer et Seuils | III (3) |
| 161 | Augure | Néopaïens · Présages et Destin | I (1) |
| 162 | Reconnaître l’heure | Néopaïens · Présages et Destin | II (2) |
| 163 | Refuser le destin imposé | Néopaïens · Présages et Destin | III (3) |
| 164 | Serment véritable | Néopaïens · Serments et Sacrifice | I (1) |
| 165 | Prix consenti | Néopaïens · Serments et Sacrifice | II (2) |
| 166 | Lier par le serment | Néopaïens · Serments et Sacrifice | III (3) |
| 167 | Marque du Limier | Chasse Fantastique · Limiers | I (1) |
| 168 | La vraie bête | Chasse Fantastique · Limiers | I (1) |
| 169 | Écho du passage | Chasse Fantastique · Limiers | II (2) |
| 170 | Forcer le passage | Chasse Fantastique · Limiers | II (2) |
| 171 | Hallali | Chasse Fantastique · Limiers | III (3) |
| 172 | Même selle, même destin | Chasse Fantastique · Chevauchée | I (1) |
| 173 | Monture du seuil | Chasse Fantastique · Chevauchée | I (1) |
| 174 | Prendre le vent | Chasse Fantastique · Chevauchée | II (2) |
| 175 | Charge irréelle | Chasse Fantastique · Chevauchée | II (2) |
| 176 | Chevauchée sauvage | Chasse Fantastique · Chevauchée | III (3) |
| 177 | Flair de la Tempête | Chasse Fantastique · Tempête | I (1) |
| 178 | Vent de rupture | Chasse Fantastique · Tempête | II (2) |
| 179 | Courant dissipateur | Chasse Fantastique · Tempête | II (2) |
| 180 | Foudre dispersante | Chasse Fantastique · Tempête | III (3) |
| 181 | Vortex de la Chasse | Chasse Fantastique · Tempête | III (3) |
| 182 | Cor de chasse | Chasse Fantastique · Vénerie | I (1) |
| 183 | Relais des Limiers | Chasse Fantastique · Vénerie | I (1) |
| 184 | Rabattre la proie | Chasse Fantastique · Vénerie | II (2) |
| 185 | Battue volante | Chasse Fantastique · Vénerie | II (2) |
| 186 | Grande Chasse | Chasse Fantastique · Vénerie | III (3) |
| 187 | Écho de Menace | Lueurs · Visions des Menaces | I (1) |
| 188 | Vision de Menace | Lueurs · Visions des Menaces | II (2) |
| 189 | Fil de convergence | Lueurs · Visions des Menaces | II (2) |
| 190 | Seuil de catastrophe | Lueurs · Visions des Menaces | II (2) |
| 191 | Avenir sans intervention | Lueurs · Visions des Menaces | III (3) |
| 192 | Toucher d’Absence | Lueurs · Purge du Néant | I (1) |
| 193 | Purger la corruption | Lueurs · Purge du Néant | II (2) |
| 194 | Défaire la chair faussée | Lueurs · Purge du Néant | II (2) |
| 195 | Silence de la Marque | Lueurs · Purge du Néant | II (2) |
| 196 | Puits d’Absence | Lueurs · Purge du Néant | III (3) |
| 197 | Signature de Puissance | Lueurs · Extinction | I (1) |
| 198 | Vide entre les gestes | Lueurs · Extinction | II (2) |
| 199 | Fracture d’Extinction | Lueurs · Extinction | II (2) |
| 200 | Interdit du Néant | Lueurs · Extinction | III (3) |
| 201 | Chambre d’Extinction | Lueurs · Extinction | III (3) |
| 202 | Avertissement impossible | Lueurs · Voix dans le Vide | I (1) |
| 203 | La voix derrière le mensonge | Lueurs · Voix dans le Vide | II (2) |
| 204 | Conseil inhumain | Lueurs · Voix dans le Vide | II (2) |
| 205 | Contempler l’Absence | Lueurs · Voix dans le Vide | II (2) |
| 206 | Dernière Lueur | Lueurs · Voix dans le Vide | III (3) |
| 207 | Incompatibilité | Xenoshield · Détection | I (1) |
| 208 | Résidu d’intrusion | Xenoshield · Détection | I (1) |
| 209 | Faux humain | Xenoshield · Détection | II (2) |
| 210 | Signature impossible | Xenoshield · Détection | II (2) |
| 211 | Pont fantôme | Xenoshield · Détection | II (2) |
| 212 | Point de rupture | Xenoshield · Xénobiologie | I (1) |
| 213 | Blessure xénologique | Xenoshield · Xénobiologie | II (2) |
| 214 | Agent incompatible | Xenoshield · Xénobiologie | II (2) |
| 215 | Contamination croisée | Xenoshield · Xénobiologie | II (2) |
| 216 | Effondrement adaptatif | Xenoshield · Xénobiologie | III (3) |
| 217 | Interface hérétique | Xenoshield · Contre-technologie | I (1) |
| 218 | Court-circuit de paradigme | Xenoshield · Contre-technologie | II (2) |
| 219 | Fenêtre de brouillage | Xenoshield · Contre-technologie | II (2) |
| 220 | Boucle de retour | Xenoshield · Contre-technologie | III (3) |
| 221 | Rupture de système | Xenoshield · Contre-technologie | III (3) |
| 222 | Marque d’interception | Xenoshield · Confinement | I (1) |
| 223 | Accrocher le signal | Xenoshield · Confinement | II (2) |
| 224 | Zone morte | Xenoshield · Confinement | III (3) |
| 225 | Mettre à terre | Xenoshield · Confinement | II (2) |
| 226 | Pas de récupération | Xenoshield · Confinement | III (3) |
| 227 | Réflexe traumatique | Indépendants · Survivant | I (1) |
| 228 | Refus de mourir | Indépendants · Survivant | II (2) |
| 229 | Cicatrice révélatrice | Indépendants · Survivant | II (2) |
| 230 | Retour du prédateur | Indépendants · Survivant | III (3) |
| 231 | Signe de la maison | Indépendants · Tradition familiale | I (1) |
| 232 | Rite de la maison | Indépendants · Tradition familiale | II (2) |
| 233 | Arme héritée | Indépendants · Tradition familiale | II (2) |
| 234 | Dernière leçon | Indépendants · Tradition familiale | III (3) |
| 235 | Interface bâtarde | Indépendants · Bricoleur | I (1) |
| 236 | Relais de propriété | Indépendants · Bricoleur | II (2) |
| 237 | Surcharge impossible | Indépendants · Bricoleur | II (2) |
| 238 | Prototype unique | Indépendants · Bricoleur | III (3) |
| 239 | Odeur du semblable | Indépendants · Marqué | I (1) |
| 240 | Résonance étrangère | Indépendants · Marqué | II (2) |
| 241 | Retour par le lien | Indépendants · Marqué | II (2) |
| 242 | Retourner la cicatrice | Indépendants · Marqué | III (3) |
| 243 | Je te retrouverai | Indépendants · Obsession | I (1) |
| 244 | Rien ne te remplacera | Indépendants · Obsession | I (1) |
| 245 | Le chemin jusqu’à toi | Indépendants · Obsession | II (2) |
| 246 | Pas cette fois | Indépendants · Obsession | II (2) |
| 247 | Appel de l’arme | Table Ronde · Résonance de Merlin | I (1) |
| 248 | Reconnaître l’héritage | Table Ronde · Résonance de Merlin | I (1) |
| 249 | Mémoire du fer | Table Ronde · Résonance de Merlin | II (2) |
| 250 | Lien indissociable | Table Ronde · Résonance de Merlin | II (2) |
| 251 | Résonance parfaite | Table Ronde · Résonance de Merlin | III (3) |
| 252 | Forme de Garde | Table Ronde · Formes de la Lame | I (1) |
| 253 | Forme de Chasse | Table Ronde · Formes de la Lame | II (2) |
| 254 | Forme d’Entrave | Table Ronde · Formes de la Lame | II (2) |
| 255 | Forme de Rupture | Table Ronde · Formes de la Lame | III (3) |
| 256 | Forme du Chevalier | Table Ronde · Formes de la Lame | III (3) |
| 257 | Serment de Quête | Table Ronde · Héritage chevaleresque | I (1) |
| 258 | Écho ancestral | Table Ronde · Héritage chevaleresque | II (2) |
| 259 | Aucun enchantement ne détourne | Table Ronde · Héritage chevaleresque | II (2) |
| 260 | Quête inachevée | Table Ronde · Héritage chevaleresque | III (3) |
| 261 | Écho de la lignée | Table Ronde · Héritage chevaleresque | I (1) |
| 262 | Les armes se reconnaissent | Table Ronde · La Table | I (1) |
| 263 | Appel de la Table | Table Ronde · La Table | I (1) |
| 264 | Résonance croisée | Table Ronde · La Table | II (2) |
| 265 | Formes complémentaires | Table Ronde · La Table | III (3) |
| 266 | Reformer la Table | Table Ronde · La Table | III (3) |

## 5. Questions pour l'auteur

### Q1. Que veulent dire SR et R pour un Humain ?
Un Humain n'a pas de Vérité à Révéler, mais 260 de ses talents portent « SR/R » ou « R ». Rien dans les sources ne dit ce que la mention impose à un Chasseur.
- **A.** La mention dit ce que voient les profanes : V, rien d'anormal ; SR, l'effet reste traduit ; R, les témoins voient l'impossible. Aucun effet sur une jauge.
- **B.** On retire la mention pour les Humains : tout talent s'utilise toujours, la visibilité se juge à la fiction. On ne la garde que pour les Lavandières, qui sont des Vampires.
- **C.** Le Chasseur « entre en rite » (un état SR ou R qui coûte 1 PA), comme une Nature se Révèle.
- **Recommandation : A.** Elle garde l'information du catalogue, ne crée aucune règle d'état et dit au MJ ce que voient les témoins.
- *Exemple* : Débordement Yang (R) dans un centre commercial : les témoins voient les possédés projetés à 3 m. Incompatibilité (V/SR/R) au même endroit : un homme qui examine un échantillon, rien de plus.

### Q2. Apprendre une seconde tradition
La charte définit une maîtrise et un éveil à 3 PTV pour les Sangs. Les traditions de Chasse s'apprennent : l'accès dépend aujourd'hui de la transmission (naturel, ouvert, restreint, impossible), sans coût d'entrée.
- **A.** Garder la règle actuelle : une seconde tradition s'ouvre par la fiction, sans maîtrise ni coût d'entrée.
- **B.** Maîtrise propre aux Chasseurs : une tradition est maîtrisée quand une de ses voies atteint son dernier palier ; une seconde tradition s'ouvre alors, pour 3 PTV.
- **C.** Pas de maîtrise, mais 3 PTV d'entrée pour toute tradition hors de l'origine.
- **Recommandation : A.** Une tradition n'est pas un Sang qui s'éveille, et la règle actuelle (transmission réelle, accès restreint) freine déjà le mélange. Les Indépendants et les Néopaïens ont leurs propres limites d'accès.
- *Exemple* : une Arianwen qui veut la Ligne de sel d'Ephraïm. A : un exorciste doit la former en jeu. B : elle doit d'abord finir une voie d'Arianwen, puis payer 3 PTV.

### Q3. Trois pouvoirs forts, gardés tels quels
Le rapport signale des verrous trop forts. La charte dit « dans le doute, garde » : je n'ai rien changé.
- Saignée noire (Lavandières, 2 PTV) éteint un Sang entier, une fois par round, sans PA.
- Sceau du Silence (Onmyoji, 2 PTV) fait coûter +1 PA à tous les Actifs de la cible, pour toute la scène.
- Puits d'Absence (Lueurs, 3 PTV) suspend d'un seul jet toutes les influences extérieures d'une cible.
- **A.** Ne rien changer.
- **B.** Saignée noire passe à une fois par scène et par cible ; Sceau du Silence vise une seule capacité Active observée, pour la scène ; Puits d'Absence inchangé.
- **C.** B, et Puits d'Absence ne suspend les effets que jusqu'à la fin de la prochaine activation de la cible.
- **Tranché par les décisions antérieures (30/10) : A.** La Saignée noire relève de ta décision du 30/09 (tu as refusé de l'affaiblir) ; le Sceau du Silence est sur la liste « à observer en jeu, ne pas affaiblir préventivement » de la passation du 6/09. Ma recommandation B est retirée. Puits d'Absence reste tel quel.

### Q4. La piste de Qi à cinq positions
Le rapport propose de la réduire à trois positions (Yin, Équilibre, Yang). Elle est lourde, mais c'est le ressort des Taoïstes. Je l'ai gardée telle quelle, sortie dans un encadré.
- **A.** Garder les cinq positions et les trois exceptions (Transe, Cycle contraire, Deux souffles).
- **B.** Trois positions : un extrême donne +1 à la Puissance de ses techniques et interdit le pôle opposé. Les trois talents d'exception gardent leur effet, adapté.
- **Recommandation : A.** On ne change pas un sous-système qui fonctionne et que l'auteur a écrit. L'encadré et la case sur la fiche suffisent à le rendre lisible.
- *Exemple* : Paume Yin puis Qi silencieux mènent à Yin profond, ce qui arrête la Transe de l'équilibre.

### Q5. Les deux talents d'information de la Table Ronde
Reconnaître l'héritage et Les armes se reconnaissent coûtent 1 PTV pour une information que la règle dit naturelle (« La résonance entre armes est naturelle »).
- **A.** Garder les deux talents à 1 PTV.
- **B.** Les rendre gratuits pour tout héritier reconnu, dans l'en-tête de la tradition. C'est une baisse de coût, à marquer.
- **Recommandation : B.** C'est ce que l'héritier sait déjà par son arme. Payer 1 PTV pour cela pénalise la tradition, et l'information ne donne aucun avantage en combat.
- *Exemple* : deux héritiers se croisent dans un bar de Chasseurs. Sans le talent, ni l'un ni l'autre ne sent l'arme de l'autre, alors que leurs armes résonnent.
