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
4. **La Corruption vient des Fléaux**, pas d'une recherche de puissance. Ne pas la présenter comme une tentation de pouvoir.
5. **Talents de Vérité en voies à paliers**, propres à chaque Nature. Paliers I / II / III = 1 / 2 / 3 PTV.
   - Approche **hybride** proposée par l'auteur : voies en *progression* (un pouvoir qui grandit), en *collection à une porte* (talents distincts, entrée obligatoire) ou en *collection à deux portes*.
   - **Deux portes : exclusives jusqu'à la maîtrise** — la seconde porte s'ouvre quand la première a ses deux paliers (validé).
   - Test de classement : si deux personnages de la même voie peuvent sembler n'avoir rien en commun, ce sont deux portes ; s'ils font la même chose plus ou moins fort, c'est une progression.
6. **REFUS des « gestes » / mécaniques communes entre Natures.** L'auteur trouve que ça tue la saveur de la Vérité. Ne jamais proposer de mutualiser des pouvoirs entre Natures. Quand deux pouvoirs se ressemblent, les différencier par un **ressort propre à chaque Nature** (condition, coût ou conséquence).
7. **Pas de Faim pour le Vampire** (option A, 29/10) : sous le Voile, le Vampire en tant qu'humain n'a pas besoin de se nourrir.
8. **Relation au Voile** (nom retenu, remplace « Tension du Voile ») : il n'existe **aucun texte complet** ; seul le principe ci-dessus. Une proposition rédigée est dans `relation-au-voile.md` (v4, validée — jauge de +3 à −4, effets selon le niveau sans dépense, ajustement par le MJ en fin de partie selon la gravité, sans marques ni poids par pouvoir ; jauge individuelle ; Chasseurs sans jauge).
9. **Le combat doit être létal** (29/10) : Défense passive presque toujours battue = voulu. Le combat s'évite si possible. Ne pas proposer de rendre les personnages plus résistants ; se méfier des bonus défensifs permanents.

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
- **Prochaine étape convenue : les Humains et Chasseurs** (266 talents, 14 traditions) avec la même méthode hybride, sans mécaniques communes entre traditions. Le rapport `rapports/03-humains-chasseurs.md` contient l'analyse détaillée.
- **Décisions de l'audit encore ouvertes** : ~~combat~~ (létalité voulue), procédures légères hors combat (contrats, enquête, contacts, factions), rythme de progression (XP/PTV par séance, jalons), place du personnage profane.

## Repères techniques utiles

- Résolution : Attribut + Compétence + 1d10 explosif (une fois) contre 12/15/18/21/25 ; DR = marge ÷ 3 (max 5) ; échec narratif si d10 ≤ Stress + 1.
- Progression XP (`apps/web/src/lib/progression.ts`) : rang de Compétence = nouveau rang + 1 (3 depuis 0) ; Attribut = 3 × nouvelle valeur ; talent de Réalité = 10 XP. PTV : 5 à la création, puis à la discrétion du MJ.
- Données des talents Vampire : `character-builder/rulesets/terra-umbra/truth/talents/vampire.json` et `vampire/0*.json` (champs `group`, `cost`, `access`, `prerequisiteName`).
