# Audit et refonte game design — document de reprise

Travail commencé le 29 octobre 2026 avec Claude Code. Ce dossier contient tout ce qu'il faut pour reprendre la refonte des règles là où elle s'est arrêtée.

## Publications en ligne (privées, compte de l'auteur)

| Document | Lien |
|---|---|
| Audit game design (v2, sur le fond, avec l'annexe des 2 553 verdicts) | https://claude.ai/artifact/WwCpHa58KdNP5XBXuuPKda |
| Vampire en voies à paliers (version hybride) | https://claude.ai/artifact/BunXYV63PwtnUNk3dkQNYg |
| Audit technique (back-end, CMS, campagnes, table en direct) | https://claude.ai/artifact/5nJHVt6zcezz1vJq2JcVk8 |
| Audit UI/UX | https://claude.ai/artifact/RLu4Wj2PDqoqtPrFk43Yyb |
| Maquettes (canevas Claude Design, 6 écrans) | https://claude.ai/artifact/Cs7jytKajQg84RhnatPTve |

Une copie HTML de chaque page est dans `pages/`. Les fichiers `*-source.html` sont les corps de page éditables à partir desquels les pages ont été générées.

## Contenu du dossier

- `rapports/` : les 10 rapports des lecteurs (un par famille), chacun avec une synthèse (A), des propositions (B), un tableau d'une ligne par entrée avec verdict, poids papier et note (C) et un comptage (D). `00-BRIEF-lecteurs.md` est la consigne donnée aux lecteurs.
- `corpus/entrees/` : les 2 553 entrées de règles extraites de `docs/operations/live-mechanics-inventory.json`, un fichier par famille, au format `#n Nom [accès] {couverture} :: effet ‖ profil`.
- `corpus/regles/` : les 64 chapitres de la rubrique « Règles » du compendium en ligne (terra-umbra.fr), téléchargés le 29 octobre 2026 et découpés par groupe.
- `pages/` : copies des pages publiées.
- `corpus/sources-auteur/` : texte extrait des PDF de règles de l'auteur (Moteur V4, Réalité V9, Bestiaire V17) et du livre Vérité V6 (docx), fournis le 29/10 ; pas forcément à jour, à croiser avec le site.

## Décisions prises avec l'auteur

1. **Rédaction sur deux niveaux** : un texte joueur court (carte), et un texte de référence pour le MJ et le moteur du site.
2. **Edge** : il revient sous contrôle du MJ quand le personnage accomplit un objectif personnel (2 objectifs, court et long terme : +1 ou +2 Edge) ou joue un de ses 1 à 2 principes à ses dépens (+1, une fois par séance). Plafond 8.
3. **Tension du Voile = cœur du jeu.** Règle de l'auteur, présente sur ses fiches papier mais **absente du site V2 et du compendium** : se Révéler devant des témoins non avertis charge la jauge ; trop haute, le Voile défaille au pire moment (semi-révélation involontaire, méfiance) jusqu'à envoyer le personnage dans l'Ombremonde ; bien tenue (discrétion, élimination des menaces pour le Voile), le Voile peut défaillir en faveur du personnage (ennemi Voilé trahi une fraction de seconde, image de caméra détournée). Pas de texte complet chez l'auteur : voir la proposition `relation-au-voile.md`.
4. **La Corruption vient des Fléaux.** Précision de l'auteur (30/10) : c'est bien une tentation de pouvoir *facile* — des Dons séduisants, pas une ambition politique — et en même temps la logique du Fléau qui contamine la pensée du porteur (la « Tentation » de chaque Fléau dans le livre V6).
5. **Talents de Vérité en voies à paliers**, propres à chaque Nature. Paliers I / II / III = 1 / 2 / 3 PTV.
   - Approche **hybride** proposée par l'auteur : voies en *progression* (un pouvoir qui grandit), en *collection à une porte* (talents distincts, entrée obligatoire) ou en *collection à deux portes*.
   - **Deux portes : exclusives jusqu'à la maîtrise** — la seconde porte s'ouvre quand la première a ses deux paliers (validé).
   - Test de classement : si deux personnages de la même voie peuvent sembler n'avoir rien en commun, ce sont deux portes ; s'ils font la même chose plus ou moins fort, c'est une progression.
6. **REFUS des « gestes » / mécaniques communes entre Natures.** L'auteur trouve que ça tue la saveur de la Vérité. Ne jamais proposer de mutualiser des pouvoirs entre Natures. Quand deux pouvoirs se ressemblent, les différencier par un **ressort propre à chaque Nature** (condition, coût ou conséquence).
7. **Pas de Faim pour le Vampire** (option A, 29/10) : sous le Voile, le Vampire en tant qu'humain n'a pas besoin de se nourrir.
8. **Relation au Voile** (nom retenu, remplace « Tension du Voile ») : il n'existe **aucun texte complet** ; seul le principe ci-dessus. Une proposition rédigée est dans `relation-au-voile.md` (v4, validée — jauge de +3 à −4, effets selon le niveau sans dépense, ajustement par le MJ en fin de partie selon la gravité, sans marques ni poids par pouvoir ; jauge individuelle ; Chasseurs sans jauge).
9. **Le combat doit être létal** (29/10) : Défense passive presque toujours battue = voulu. Le combat s'évite si possible. Ne pas proposer de rendre les personnages plus résistants ; se méfier des bonus défensifs permanents.
10. **Garou et autres descendants de Khinae partagent les Sangs vifs** (même origine) : exception voulue à la règle « pas de mécanique commune ». Les entrées Khinae #21–68 identiques aux Garou sont ces Sangs communs, pas une copie fautive.
11. **Sangs noirs du Vampire = voies à deux portes** (les deux branches de chaque Sang du livre V6), comme décidé à l'origine. La version « progression » qui fusionnait les branches est abandonnée.
12. **Empreinte Krovni : texte d'origine** (+3 Défense passive et active contre le physique tant qu'il n'est pas Surpris).
13. **Le culte est le vecteur principal de la Corruption** : il fixe l'entrée et le prix, le Fléau fixe la nature des Dons. D'autres vecteurs restent possibles (croiser un Fléau, un objet, une Abomination).
14. **Sangs oshirique et d'Ivoire** : Ruptures propres au Vampire, jouables au prix de la Corruption, pas des Sangs noirs ordinaires.
15. **Purification** : toujours par une voie ou une organisation qui en a le pouvoir (Vieilles et Chevaliers de la Ruine, etc.), jamais par une règle générale. Possible, mais très difficile.
16. **Silcenters** : exempts du Voile ; on y est Révélé de base, sans effet sur la Relation au Voile.
17. **Espèces hors Natures** (Dhampire, Nephilim, Kelta, Dive, Nymphe, Amazone, Psychopompe, Astharès…) : non jouables par les PJ.
18. **Fléaux hors des six** (Akryth, Sheroh, Zarpheth, Ira'Xiadror…) : des Fléaux venus d'ailleurs, pas des Patrons des six Anciens terrestres.
19. **« Sept Fléaux majeurs »** : les six Anciens plus Delanial, le faux Septième ; le texte reste tel quel.

## Méthode de travail souhaitée par l'auteur

**Depuis le 29/10 (demande de l'auteur : accélérer)** : ne plus poser les questions une par une. Claude applique lui-même les décisions déjà prises (charte ci-dessus) et traite chaque famille **en lot** : texte complet réécrit, appliqué par défaut. L'auteur relit **par exception** (il signale ce qu'il refuse). Ne remonter en question que ce que la charte ne tranche pas, regroupé, 3 à 5 points par famille au plus, chacun avec une recommandation.

- Juger **le fond** (expérience de jeu, boucle, rôles, tensions), pas seulement la forme (doublons, notes de développement). La v1 de l'audit a été jugée trop centrée sur la forme.
- Pour les rares questions remontées : options concrètes et exemples tirés de vrais talents.
- Vérifier qu'une règle n'existe pas dans les sources de l'auteur avant d'affirmer qu'elle manque (cf. la Tension du Voile).
- Tutoyer l'auteur (demandé le 29/10).
- Lore : vérifier les factions avant d'écrire un exemple. Les Chasseurs et l'AIDH sont distincts (« un Chasseur de l'AIDH » n'existe pas ; on parle d'un officier ou d'un agent de l'AIDH).
- Présenter les textes aérés : l'auteur trouve les pages d'audit trop denses. Les lots complets vont dans un fichier lisible ; la conversation ne porte que la synthèse et les questions remontées.

## Où on en est

- **Vampire hybride** publié : 1 carte de Nature + 20 voies (8 progression, 6 une porte, 6 deux portes). Les textes des 8 voies en progression ont été présentés dans la conversation ; en attente de retour de l'auteur.
- **Vampire : clos en lot le 29/10** (voir la fin de `vampire-voies-progression.md`, veto possible). Historique des questions :
  1. ~~Faim~~ → tranché : option A, pas de Faim.
  2. ~~Maîtrise d'un Sang~~ → tranché : en paliers, propre à chaque Nature (Vampire : voie au palier III ; Garou : deux voies au palier II) ; éveil 3 PTV.
  3. ~~Empreintes de Cour~~ → appliqué en lot.
  4. ~~Paliers à créer~~ → appliqué en lot.
  5. ~~Poids de Relation au Voile par palier~~ → abandonné : le MJ juge la gravité, pas le pouvoir.
  6. ~~Ressorts propres entre pouvoirs proches~~ → appliqués en lot.
- **Lots parallèles du 30/10 terminés** (`lots/`) : Garou, Khinae, Humains/Chasseurs, Mage, Daemon, Angelus, Aseryn, Exilés, Extrals. Questions regroupées dans `lots/10-questions-regroupees.md` (recommandations appliquées par défaut). Corruption/Fléaux : lot 12 ; Objets : lot 13 ; Réalité : lot 14. Il ne reste aucune famille à traiter.
- **Corrections des lots après lecture du corpus et de la passation (30/10, faites)** : Sangs vifs partagés Garou/Khinae (plus de réécriture à prévoir) ; B1, B2, B4, B6 et A1 appliqués ; A3 refusé → organisations des Exilés (25 voies) et des Extrals (16 voies) rétablies en PTV ; Chasseurs (Nature, accès à la création, Saignée noire, Sceau du Silence) ; HDS rétablie ; homonymes gardés ; Rémanence nocturne, Fureur de la Corneille et Mange-lumière rétablis ; B5 (Réflexe impossible) gardé ; B7 vérifié Faveur par Faveur (cinq réécrites). Détail dans `lots/10-questions-regroupees.md`.
- **Lot 12 Corruption/Fléaux (30/10)** : `lots/12-corruption-fleaux.md`. Carte commune, 6 cartes de Source, 42 voies ; les 227 entrées et les 493 PTV sont gardés ; moteur inchangé. Analyse 4 réparée (Révélation) ; 3 questions validées le 30/10 (pas d'ordre d'achat imposé dans les voies de Corruption ; Faux sacrement prête un RITE). Restent : Objets de Vérité, Réalité.
- **Lot 13 Objets de Vérité (30/10)** : `lots/13-objets-verite.md`. Chapitre d'accès, glossaire unique, 6 catalogues ; 231 entrées gardées, aucune arme affaiblie (passation §14, §24.4, §31), monnaies par marché ; 3 questions validées le 30/10.
- **Lot 14 Réalité (30/10)** : `lots/14-realite.md`. 122 talents en cartes courtes (Origine, Sphère, communs, expertises) ; les 55 talents de l'annexe J sont déjà identiques au site ; notes de développement retirées du texte joueur ; équipement et augmentations inchangés (annexe C), FaceCaster en double et paires Gen1/Gen2 étiquetées. Aucune question. **Tous les lots sont faits.**
- **Lot 15 Trous post-audit (31/10)** : `lots/15-trous-post-audit.md`. Khinae complétés depuis le livre V6 (30 talents) ; Retour fissile et Crise Blanche définis ; Mage (§8, SR) réparé ; cartes Oshirique et Sang d'Ivoire ; 3 questions (Techniques du Mage, Faveur de Seere, propositions Oshirique).
- **Lot 16 Vampire (31/10)** : `lots/16-vampire-sangs-deux-portes.md`. Les cinq Sangs encore en progression (Orageux, Glacial, Ardent, Venimeux, Masqué) refaits à deux portes (décision 11), textes et coûts d'origine ; Toucher ardent revient à DGT 5. Page Vampire à mettre à jour.
- **Passation générale du 30/10** : lue en entier (synthèse et annexes A à K) ; notes dans `notes-lecture.md`. Le document lui-même n'est pas versé au dépôt (secrets MJ).
- (historique) Prochaine étape convenue : les Humains et Chasseurs (266 talents, 14 traditions) avec la même méthode hybride, sans mécaniques communes entre traditions. Le rapport `rapports/03-humains-chasseurs.md` contient l'analyse détaillée.
- **Décisions de l'audit encore ouvertes** : ~~combat~~ (létalité voulue), procédures légères hors combat (contrats, enquête, contacts, factions), rythme de progression (XP/PTV par séance, jalons), place du personnage profane.

## Repères techniques utiles

- Résolution : Attribut + Compétence + 1d10 explosif (une fois) contre 12/15/18/21/25 ; DR = marge ÷ 3 (max 5) ; échec narratif si d10 ≤ Stress + 1.
- Progression XP (`apps/web/src/lib/progression.ts`) : rang de Compétence = nouveau rang + 1 (3 depuis 0) ; Attribut = 3 × nouvelle valeur ; talent de Réalité = 10 XP. PTV : 5 à la création, puis à la discrétion du MJ.
- Données des talents Vampire : `character-builder/rulesets/terra-umbra/truth/talents/vampire.json` et `vampire/0*.json` (champs `group`, `cost`, `access`, `prerequisiteName`).
