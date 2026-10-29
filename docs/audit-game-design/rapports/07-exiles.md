# Audit 07 — Vérité : EXILÉS (peuples d'Aèr)

Sources lues intégralement :
- `rules/Vérité__Natures_capacités_º_Exilés.txt` (80 588 caractères, 1 313 lignes, 2 articles : « Profils raciaux des cinq peuples » et « Silcenters, HDS, Croix d'Emphyrra, Runes, réseaux, Hordes & technomagie »)
- `entries-Vérité_exile.txt` (#1 à #184)
- `entries-Traits_exile.txt` (#1 à #8)

Contrôles faits pendant la lecture :
- **Coûts en PTV** : les 47 branches ont été additionnées une par une. Chaque total annoncé (« Grâce elfique — 5 PTV », « Syndicat de Jade — 32 PTV », etc.) correspond à la somme de ses talents. Les comptes du catalogue sont aussi exacts : 53 talents raciaux (#1–53) et 131 talents de traditions (#54–184 : 7 + 40 + 16 + 23 + 22 + 23).
- **Indicateurs textuels** (comptés par script sur les 184 entrées) :
  - 56 923 caractères d'effet, soit 309 en moyenne par entrée (médiane 279, maximum 1 141 pour *Fiabilisation*) ;
  - 57 quotas « Une fois par… » ;
  - 43 occurrences de « réellement » et 58 de « ni » ;
  - 44 « +3 » ;
  - 30 entrées « Circonstances favorables (+3) ».
- **Accès** : 121 entrées sur 184 sont V/SR/R, 31 SR/R, 30 R et 2 V seulement.
- **Couverture serveur** :
  - 142 entrées sont en « texte / activation assistée » et 35 en « action dédiée / calcul ciblé » ;
  - 4 sont en « résolution ciblée / réaction serveur », 2 en « calcul passif ciblé » et 1 en « action dédiée / contraintes serveur ».
- **Format** : aucune ligne d'entrée ne contient le champ `‖ profil` attendu par le format.

---

## A. Synthèse de la famille

1. **Intention perçue.** On ne joue pas un « monstre ». On joue un réfugié d'une autre planète, défini par sa physiologie (cinq peuples) et par ses appartenances (Croix, Clans, Ligue, Syndicat, Hordes, Servants de Pluton). L'idée est forte et propre au jeu : la Nature Exilé est d'abord **sociale et culturelle**, là où les autres Natures sont surnaturelles.
2. **Point fort : le ton.** Presque tous les talents sont ancrés dans la fiction (« outil détourné », « route réellement existante », « une sortie s'il en existe une »). Ils récompensent la débrouille et l'astuce plutôt que les gros chiffres. Gobelins débrouillards, nains obstinés, orques en meute, elfes mémorialistes : les archétypes sont lisibles.
3. **Point fort : un équilibre global sobre.**
   - Les modificateurs raciaux sont parfaitement symétriques : +1 en SR, +3 répartis en R pour chaque peuple.
   - L'immense majorité des effets tient en « +3 une fois par scène », « ignorez −3 » ou « relance ».
   - Très peu de dégâts bruts. Pas d'explosion combinatoire.
4. **Contradiction de fond : les PTV paient beaucoup de Réalité.** L'article 2 pose que « les PTV ne paient que les capacités de Vérité qui modifient réellement transitions, perception ou action ». Pourtant, environ **82 des 131 talents de traditions (≈ 63 %) sont profanes** :
   - Ligue des Quatre Empereurs (7) et Syndicat de Jade (16) ;
   - les 5 Hordes et la Formation commune (22) ;
   - Atelier des Clans (4) et Iron Law (5) ;
   - Faucon, voies Terrain, Autonomie et Briser l'Artifice (12) ;
   - Serpentaire, voies Exigence et Ascendant (8) ;
   - Ingénierie xéno (4) et Silence de Pluton (4).

   Ce sont des sociétés-écrans, de la contrebande, des tactiques d'escouade et des réglages d'atelier. Ils n'ont aucun lien avec V/SR/R et sont d'ailleurs presque tous V/SR/R. Seuls environ 49 talents (Protocoles, HDS, Haute Magie, Aigle, Hibou, Runes, Convergence, Fracture, Arsenal) sont de la vraie Vérité.
5. **Conséquence : la Révélation ne sert à rien pour deux talents sur trois.** 121 entrées sur 184 fonctionnent Voilé. Le triptyque V/SR/R, cœur du système de Vérité, ne joue que pour les capacités physiologiques et quelques rites.
6. **Lore et règle : ce que contient chaque sous-section de l'article 2.**
   - **Silcenters et Continuité** : ≈ 90 % lore et règles d'accès. Une seule règle nette : l'Expérience paie l'intégration ordinaire, les PTV paient la Vérité.
   - **Croix d'Emphyrra** : 100 % lore. L'accès suppose « éducation, adhésion, mentorat et parfois épreuves », sans aucun mécanisme (Edge ? prérequis ? validation du MJ ?).
   - **Runes, Atelier, Iron Law** : un paragraphe de politique éditoriale (« une faction sans méthode propre ne reçoit pas d'arbre »). C'est une note pour l'auteur, pas une règle de jeu.
   - **Réseaux ashylls** : Green Union présentée comme lore sans arbre ; une seule règle (« les ressources doivent exister »).
   - **Hordes** : lore. Une vraie règle seulement : la Horde Abyssale ne donne pas de Corruption gratuite et renvoie au chapitre Corruption. La Horde Maudite est explicitement « lore sans arbre ».
   - **Technomagie** : une règle unique (« chaque dispositif doit exister ») qui renvoie au chapitre Équipement.
   - **Conclusion** : ces sections répondent surtout à « pourquoi il n'y a pas d'arbre pour X ». Le joueur a besoin de l'inverse : comment j'obtiens l'accès, et ce que cela me coûte.
7. **Accès aux traditions non spécifié.** Rien ne dit si un Whurten peut entrer dans une Horde, si un Thulkar peut porter une Croix, ni si un Humain ou un Extral peut apprendre les Runes. Le Builder doit trancher seul. Une matrice peuple × tradition et une condition d'entrée chiffrée manquent.
8. **Le catalogue est recopié alors que le texte dit le contraire.** Le texte annonce que la page fixe les règles « sans recopier leur catalogue », et que le détail des 131 talents « reste dans le Builder ». Or l'article recopie intégralement les 184 talents sous forme de tableaux. C'est le double du volume pour aucune information nouvelle, avec un risque de divergence (les noms de prérequis non accentués en sont déjà le symptôme).
9. **Économie de PTV : des arbres hors d'échelle.**
   - Avec 5 PTV à la création, un Exilé achète environ deux talents. Une branche raciale coûte 4 à 8 PTV, un ordre de la Croix 15 à 22, le Syndicat 32, la Technomagie 31.
   - Les sommets à 3 PTV exigent presque toujours deux talents à 2 PTV : il faut 6 à 8 PTV pour toucher le haut d'une seule branche.
   - Le catalogue est donc pour l'essentiel décoratif pour un PJ. Le lecteur parcourt 184 entrées pour en utiliser 2 à 6.
10. **Asymétrie raciale.**
    - Elyë : 3 branches (17 PTV) et 3 traits gratuits.
    - Whurten : 3 branches (22 PTV) mais 1 seul trait listé. La « physiologie robuste » annoncée dans le tableau n'a **aucune entrée** dans les Traits.
    - Ashyll : 3 branches (23 PTV) et 2 traits.
    - Thulkar : 3 branches (16 PTV), « progression volontairement compacte », et **aucun trait** dans `entries-Traits_exile`.
    - Azménorien : 2 branches (16 PTV) et 2 traits.

    Les Thulkars sont donc les plus pauvres en traits comme en catalogue. De plus, 6 de leurs 10 talents sont **R seulement** (Poigne, Mains de guerre, Force de rupture, Peau épaisse, Toujours dangereux, Masse imposante), alors qu'être Révélé en ville est l'exception. Le Thulkar est le peuple le plus faible en pratique.
11. **Outliers forts.**
    - *Optique de Vérité* (#177, 1 PTV, accès V) : voit à travers le Voile de tous, « la Volonté de la cible ne protège pas ». Effet à l'échelle du monde de jeu, au prix le plus bas.
    - *HDB/HDP* (#59–60) : verrou de Révélation, puis dégâts de réaction **chaque round** sans quota de scène, accessibles à tout PJ Voilé pour 6 PTV.
    - *Incantation fulgurante* (#53) : −1 PA sur l'activation **à chaque round**.
    - *Encore debout* (#14) : refuse la mise à 0 PV une fois par scène.
    - *Riposte d'Ashorn* (#145) : attaque gratuite, 2 PTV, sans prérequis.
    - *La réussite appelle la réussite* (#150) : +1 PA.
    - *Mains de guerre* (#37) : triple les DGT de Pugilat pour 1 PTV.
    - *Disparaître dans la Réalité* (#153) : casse automatiquement une poursuite.
    - *Chantier de guerre* (#157) : transforme des heures en minutes sans plafond.
    - *Passage de Jade* (#135) : « une route existe » garantie.
12. **Outliers faibles ou nuls.**
    - *Feu masqué* (#128) : c'est déjà la règle normale.
    - *Garantie de Jade* (#136) : aucun effet mécanique.
    - *Ne pas détourner le regard* (#44) : la règle anti-répétition couvre déjà le cas.
    - *Laisser une cicatrice* (#72), *Menace réversible* (#122), *Portefeuille cloisonné* (#120), *Force de chantier* (#154) : effets marginaux.
    - *Marché ferme* et *Commande noire* (#137, #139) : un contact, puis un achat payant, pour 5 PTV.
    - *Transition en chaîne* (#57) : sommet à 3 PTV qui n'ajoute presque rien à *Révélation drillée*.
    - *Toujours dangereux* (#42) : sommet à 3 PTV utilisable seulement Agonisant et Révélé.
13. **Redondances internes (gabarits identiques).**
    - **Résistant +3** (9 entrées) : Endurance obstinée, Masse enracinée, Volonté incompressible, Même pas peur, Poigne thulkar, Douleur familière, Aucune révérence, Ancrage de Réalité, Vivre de peu.
    - **Ignorer −3 dû à X** (6 entrées) : Pas léger, Terrain familier, Faire sans, Hyperfocalisation, Interface étrangère, et en partie Ça devrait marcher.
    - **Relance après échec non narratif** (4 entrées) : Réflexe de grâce, Ancrage whurten, Correction instinctive, Reprise minutieuse.
    - **Lecture : le MJ révèle une information, +3 à la première exploitation** (6 entrées) : Lecture des êtres, Lire le terrain, Lire le cercle, Diagnostic sauvage, Dépendance critique, Standard.
    - **Plan collectif : jusqu'à 3 participants, +3 à la première action** (3 entrées) : Faire avec ce qu'on a, Préparer l'embuscade, Plan de bataille.
    - **Brouillage −3** (7 entrées) : Acquisition silencieuse, Canal mort, Couverture logistique, Nettoyage de provenance, Identité cloisonnée, Refuge autonome, Mode silencieux.
    - **Touche l'immatériel sans bonus** (3 entrées réparties sur 3 traditions) : Main d'Onyx, Rune de Fer, Arme d'Interférence.
    - **Prise en tenaille +3** (2 entrées) : Épaulement, Feu croisé.
    - **Contact de réseau** (3 entrées) : Le bon intermédiaire, Marché ferme, Trouver quelqu'un qui sait.
    - **Remettre en fonction jusqu'à la fin de la scène** (2 entrées) : Bricolage de fortune et Remise en ligne. Remise en ligne est plus forte (pas de test) au même coût.
    - **Réduire le maintien de 1 PA** (2 entrées) : Accord instinctif et Maintien naturel, avec clause anti-cumul croisée.
    - **Alarme à 100 m** (3 entrées) : Rune du Foyer, Rune de Veille, Consécration.
    - **Résistance intangible à 18/21** (3 entrées) : Rune de Scellement, Ancre d'Ombre, Cage de Vérité.
14. **Incohérence avec le socle.**
    - *Interdisciplinarité* (#161) donne une auto-Assistance de **+3**, alors que l'Assistance normale vaut **+2** (*Coordination de Silcenter*, *Rappeler à lui*).
    - *Une fois suffit* (#86) introduit « facilitées d'un niveau sur un seuil fixe ». C'est une seconde échelle de bonus, à côté du ±3 standard.
15. **Sept types de quotas.** 1/round, 1/scène, 1/scénario, 1/combat (*Déploiement de Horde*), 1/effet subi (*Âme réfractaire*), 1/scène/cible (*Désancrage offensif*) et 1/scénario/bénéficiaire (*Réfection vitale*, *Rune de Garde*). Les deux derniers obligent à tenir un registre **sur la fiche d'autrui**, ce qui est impraticable sur papier.
16. **Durées hétérogènes.** « quelques minutes », « dix minutes », « une heure », « plusieurs heures », « préparation », « préparation longue », « briefing réel », « transaction réelle ». Il faut une échelle à trois crans.
17. **Poids textuel des démentis.** Environ 30 à 40 % du texte des entrées est fait de négations défensives : « ne crée jamais », « ni…, ni… », « aucun… n'est créé ». Ce sont des réponses à des abus imaginés. Une seule **clause de réalité** générale (« un talent ne crée jamais ce que la fiction ne contient pas ») en supprimerait la majorité. Les 43 « réellement » sont le symptôme le plus visible.
18. **Notes de développement visibles par le joueur.**
    - *Réfection vitale* (#83) : « Proposition de nouvelle limite… inspirée de l'arbitrage sur les nanites », « rechargement de page ».
    - *Phrase runique* (#107) : « contrôlées par identifiants ».
    - *Rune de Garde* (#105) : « sauvegarde ».
    - *Réflexe de grâce* (#3) : « Ne restreint pas silencieusement les types de Défenses admis actuellement ».
    - *Pousser la limite* (#48) : « n'interdit plus les aides », formulation de changelog.
    - *Impossible ? Non. Mal préparé.* (#27) : comparaison de designer avec *Bricolage*.

    Ces passages doivent disparaître du texte de jeu.
19. **Bloc Runes répété 6 fois.** Le paragraphe « Runes : dix minutes d'inscription ordinaire… » figure dans six entrées (#101–105, #107). *Rune de Garde* cumule ainsi 4 phrases de suivi anti-abus pour un effet de 2 lignes (−6 dégâts une fois).
20. **Qualité éditoriale.**
    - Apostrophes parasites : « son’action », « Transition’en chaîne », « Whurten’a », « jusqu'àu ».
    - Accents fautifs : « concrété », « menér », « achétér », « réténue », « détérmine », « détécteur », « interprétér ».
    - Prérequis non accentués, qui ne correspondent pas aux noms des talents : « Pas leger », « Ame refractaire », « Feu masque », « Refection vitale », « Deploiement de Horde + Releve immediate », « Frapper ou ca cede ».
    - Tirets incohérents : « Reaction - 1/Scène » contre « Réaction — 1 PA — 1/round ».

    Sur papier, cela nuit à la lisibilité. Côté serveur, cela fait courir un risque de rupture de prérequis.
21. **Dépendances à d'autres chapitres.** Il faut connaître ces chapitres pour lire la famille :
    - transitions V/SR/R et Hologramme ;
    - Stress, Agonie et seuils de blessure (Tendu, Paniquée) ;
    - Techniques magiques (maintien, activation, concentration) ;
    - Assistance et Action combinée ;
    - règle de non-répétition et Prendre son temps ;
    - Altération matérielle ;
    - Stress augmentique et état Surchargée ;
    - Défense occulte et Puissance ;
    - Corruption ;
    - acquisition d'équipement.

    *Insensible à la peine* et *Stabilité augmentique* contiennent même des clauses anti-cumul envers des talents d'**autres** familles. Sur papier, c'est un renvoi croisé permanent.
22. **Couverture serveur.** Seuls 7 talents sur 184 sont réellement calculés (Mains de guerre, Peau épaisse, Suture, Réfection vitale, Rune de Garde, Riposte d'Ashorn, Entre deux états). La famille est donc presque entièrement jugée à table. Plus le texte est court et fondé sur des mots-clés, moins le MJ arbitre.
23. **Traits gratuits.**
    - *Longévité* et *Petite morphologie* sont du pur lore. Petite morphologie précise même « aucun bonus chiffré », alors que *Faufiler* vend précisément cet avantage.
    - *Boussole intérieure* (#19) paie 1 PTV pour presque rien de plus que *Sens magnétique*, qui est gratuit.
    - *Affinité elfique* et *Don magique azménorien* sont le même trait sous deux noms.
24. **Synthèse du poids papier.** Pour un PJ, la fiche n'est pas lourde par le nombre de talents : 2 à 6 talents en début de campagne. Elle l'est par **la longueur de chaque texte** (≈ 310 caractères, à recopier ou à retrouver), **les quotas à cocher** (57 quotas, dont 2 suivis par bénéficiaire) et **les ressources à noter** (repères de *Point fixe*, lots de *Rien ne se perd*, 3 sociétés-écrans, pressions latentes suspendues, inscriptions de runes actives, création *Fait pour durer* active). Le catalogue est lourd pour le **lecteur** (184 entrées et 47 branches), pas pour la fiche.

---

## B. Propositions concrètes

### B1. Séparer « Vérité » et « Affiliations »
- **Garder en PTV (Vérité)** :
  - les 53 talents raciaux, après élagage ;
  - Protocoles et HDS ;
  - Haute Magie de Citrine ;
  - Aigle (Intransigeance surnaturelle et Rites) ;
  - Hibou ;
  - Runes ;
  - Convergence, Fracture et Arsenal.

  Cela fait environ 100 entrées, ramenées à environ 60 après fusions.
- **Basculer en Réalité, sous forme de « talents d'Affiliation » achetés en XP ou Edge comme les talents de Sphère** :
  - Ligue et Syndicat ;
  - Hordes et Formation de Horde ;
  - Atelier et Iron Law ;
  - Faucon (Terrain, Autonomie, Briser) ;
  - Serpentaire (Exigence, Ascendant) ;
  - Ingénierie xéno et Silence de Pluton.

  Ils restent réservés aux membres, mais cessent de concurrencer les capacités surnaturelles pour 5 PTV. Le chapitre devient cohérent avec sa propre phrase : « les PTV ne paient que la Vérité ».
- **Les réseaux (Ligue, Jade) se réduisent à un mécanisme de Faveurs** : `Réseau [Nom] : N Faveurs/scénario`. Une Faveur se dépense sur un menu commun : contact, structure-écran, route grise, pression, commande, garantie. Seize talents de Jade deviennent ainsi 1 trait d'affiliation et un menu de 6 lignes.

### B2. Glossaire de mots-clés (imprimé une fois, en tête de famille)
| Mot-clé | Règle unique | Remplace |
|---|---|---|
| **Résistant (X)** | +3 pour résister à X. Ne se cumule pas avec un autre Résistant sur le même jet. | #11, 12, 15, 32, 36, 40, 65, 85, 151 |
| **Aisé (X)** | Ignore jusqu'à −3 de malus dû uniquement à X. | #1, 47, 62, 66, 162, (23) |
| **Relance (X), 1/scène** | Après un échec non narratif sur X, relancer le d10 et garder le second. Une seule relance de talent par jet. | #3, 16, 51, 75 |
| **Lecture (X), 1/scène** | 1 PA ou quelques minutes : le MJ donne 1 fait sur X. La première action qui l'exploite gagne +3. | #5, 24, 61, 69, 73, 77 |
| **Plan collectif, 1/scène** | Préparation : jusqu'à 3 participants gagnent +3 à leur première action qui exécute le plan. | #35, 64, 146 |
| **Brouillage** | −3 aux tests qui cherchent à relier ou détecter X. Une preuve directe reste une preuve. | #118, 126, 134, 152, 167, 168 |
| **Touche l'immatériel** | L'arme ou la main affecte les Ombres et les intangibles avec ses caractéristiques normales. | #95, 103, 181 |
| **Tenaille** | +3 en attaque si un allié engage la même cible sous un angle distinct. | #130, 141 |
| **Contact (catégorie), 1/scénario** | Le réseau fournit une personne joignable. Son prix reste dû. | #124, 127, 137 |
| **Prototype** | Voir B6. | #170, 171, 177–183 |

**Clause de réalité** (une seule fois) : « Aucun talent ne crée ressource, information, passage, action ou PA qui n'existe pas dans la fiction, sauf mention contraire. Les effets ne se cumulent pas avec un bonus équivalent. » Cette clause permet de supprimer presque tous les « ni… ni… » et les « réellement ».

### B3. Trois quotas, trois durées
- **Quotas** : `1/round`, `1/scène`, `1/scénario`. On supprime 1/combat (devient 1/scène), 1/effet subi (devient 1/scène), 1/scène/cible et 1/scénario/bénéficiaire. Pour ces deux derniers : « le bénéficiaire ne peut profiter que d'une copie de cet effet par scénario ». Le joueur cible coche une case **sur sa propre fiche** « Soin/Protection d'Exilé reçu ».
- **Durées** : `Instant (1–2 PA)`, `Court (≈10 min)`, `Long (≈1 h ou plus, atelier)`.

### B4. Branches en « Voies à rangs » (format carte)
Chaque branche de 3–4 talents devient une **Voie linéaire** : Rang 1 (1 PTV), Rang 2 (+2), Rang 3 (+3), total 6 PTV. Les prérequis en Y (deux talents à 2 PTV pour un sommet) disparaissent. Une carte A6 par Voie contient 3 lignes et tient sur la fiche. Exemple pour **Voie du Terrain (Faucon)** :
- R1 *Aisé (terrain naturel)* et *Lecture (terrain)* ;
- R2 *Immobile en couvert naturel* : +3 en Furtivité, même contre une recherche active ;
- R3 *Plan collectif (embuscade)*.

### B5. Réparations raciales
- Écrire dans les Traits la **physiologie robuste** whurtenne (ex. *Résistant (poison, maladie)*) et **un trait thulkar** (ex. *Carrure : DGT de Pugilat 3*, c'est-à-dire Mains de guerre rendu gratuit).
- Passer *Poigne thulkar*, *Force de rupture* et *Masse imposante* en **SR/R**.
- Fusionner *Boussole intérieure* dans *Sens magnétique*, *Faufiler* dans *Petite morphologie*, *Affinité elfique* et *Don azménorien* dans un trait commun **Accès magique**.
- Classer *Longévité* comme note de lore et non comme trait.

### B6. Gabarit unique « Prototype de Vérité » (Technomagie)
« Construire ou adapter : Durée Long, test Esprit + compétence technique, difficulté 18, matériel acquis selon les règles d'Équipement. Un prototype par talent à la fois. L'appareil peut être volé, détruit ou étudié par un tiers. » Chaque talent Arsenal ou Convergence ne garde alors que son **effet**, en une ligne.

### B7. Accès aux traditions (à écrire, c'est la seule vraie règle manquante)
Tableau peuple × tradition :
- **Accès natif** : par exemple Elyë → Croix, Whurten → Runes, Atelier et Iron Law, Ashyll → Ligue et Jade, Thulkar → Hordes, Azménorien → Pluton et Technomagie ;
- **Accès par adoption** : tout Exilé, au prix d'1 point d'Edge ou d'un désavantage de Devoir ;
- **Interdit**.

Le lore (Conseil des Anciens, Green Union, Horde Maudite) va dans un encadré « Monde » séparé.

### B8. Rééquilibrages ciblés
- *Optique de Vérité* : 2 PTV, accès SR/R, et une Défense occulte de la cible **contre la Technomagie de l'auteur** (ou contre la HDS).
- *HDP* : 1/scène par cible, ou coût d'1 Stress.
- *Incantation fulgurante* : 1/scène, ou minimum 2 PA.
- *Encore debout* : 1/scénario.
- *Riposte d'Ashorn* : prérequis *Fixer la cible*, et la riposte coûte 1 PA (sans PA supplémentaire seulement en Défense active).
- *Interdisciplinarité* : +2, aligné sur l'Assistance.
- *Mains de guerre* : DGT 2.
- *Disparaître dans la Réalité* : +3 au test de fuite au lieu d'une réussite automatique.
- *Feu masqué*, *Garantie de Jade*, *Ne pas détourner le regard*, *Laisser une cicatrice* et *Force de chantier* : supprimés, ou absorbés dans l'entrée voisine.

### B9. Hygiène éditoriale
- Retirer toutes les notes de développement (liste en A18).
- Unifier la syntaxe d'en-tête : `Accès · Coût · Quota · Durée`.
- Accentuer les prérequis, ou mieux, utiliser des identifiants.
- Imprimer le **bloc Runes** une seule fois, en tête de la Voie.

### B10. Exemples réécrits (avant → après)

**1. Rune de Garde (#105)**, 1 016 → 170 caractères
- *Avant* : « La Rune réduit de 6 les dégâts de la première atteinte surnaturelle subie, minimum 0, puis s'éteint. Un bénéficiaire ne peut recevoir cette protection qu'une fois par scénario, même après réinscription. Inscription normale de dix minutes ; une Rune de Garde active par runiste. La protection n'est pas remise à zéro par une nouvelle scène ou un nouveau support. Runes : dix minutes d'inscription ordinaire ; […] La Rune de Garde consommée ne se recharge jamais […]. Le suivi est porté par le bénéficiaire : nouveau lanceur, nouveau combat, réinscription, sauvegarde et changement V/SR/R ne renouvellent pas cette protection. »
- *Après* : « **Rune de Garde** (2 PTV · R · Rune). Le porteur réduit de 6 les dégâts de la première atteinte surnaturelle, puis la rune s'éteint. ☐ Garde reçue ce scénario (case sur la fiche du porteur). »

**2. Fiabilisation (#108)**, 1 141 → environ 260 caractères, en deux crans
- *Avant* : bloc de 7 phrases mêlant effet de scénario, modification permanente, échec narratif, revêtement abrasif et liste d'exclusions.
- *Après* : « **Fiabilisation** (1 PTV). *Court* : la première défaillance matérielle ordinaire de l'objet ce scénario est ignorée. *Long (atelier)* : éliminez définitivement un mode de panne nommé ; un échec narratif reste un échec, mais ne cause plus cette panne. »

**3. Endurance obstinée (#11)** et ses 8 jumeaux
- *Avant* : « Circonstances favorables (+3) pour resister à la fatigue, au manque de sommeil, à la marché forcee, au froid ou à l'effort prolonge lorsqu'il s'agit d'endurance corporelle. Ne protege pas d'un effet surnaturel cible. »
- *Après* : « **Endurance obstinée** (1 PTV · V/SR/R) : *Résistant (fatigue, froid, privations)*. »

**4. Accord instinctif (#10) + Maintien naturel (#52)**, fusion
- *Avant* : deux talents de 3 et 2 PTV, deux races, deux durées (« reste de la scène » contre « trois rounds »), avec une clause de non-cumul croisée.
- *Après* : mot-clé **Maintien allégé, 1/scène** : « Une Technique déjà maintenue coûte 1 PA de moins par round jusqu'à la fin de la scène (minimum 0). » Elyë : *Accord instinctif* = Maintien allégé + 3 aux tests pour ne pas être interrompu. Azménorien : *Maintien naturel* = Maintien allégé.

**5. Réfection vitale (#83)**
- *Avant* : « Pour 1 PA au contact, Volonté + Maîtrise spirituelle difficulté 18 rend 4 + DR PV […]. Proposition de nouvelle limite par cible/scénario, inspirée de l'arbitrage sur les nanites ; un autre lanceur ou un rechargement de page ne doit pas renouveler ce même soin sur la cible. Le suivi est porté par le bénéficiaire […] aucune recharge au combat suivant, au rechargement de page ou à une transition V/SR/R. »
- *Après* : « **Réfection vitale** (2 PTV · R · 1 PA · contact) : Volonté + Maîtrise spirituelle diff. 18, la cible récupère 4 + DR PV. ☐ Soin d'Exilé reçu ce scénario (fiche de la cible). »

**6. Pression latente (#121) + Menace réversible (#122)**, passage en Affiliation et Faveur
- *Avant* : deux talents, 4 PTV, aucun test ni coût chiffré (« ressource, faveur ou dépense appropriée »).
- *Après* : « **Ligue — Faveur : Pression** (1 Faveur) : choisissez une dépendance d'une cible locale. Elle est coupée au moment de votre choix pendant le scénario (activable ou levable une fois). Échelle maximale : antenne locale. »

---

## C. Tableau exhaustif

### C1. Chapitre de règles (une ligne par section)
| # | Section | Verdict | Poids | Note |
|---|---|---|---|---|
| R1 | Profils des cinq peuples (tableau SR/R) | Garder | 1 | Symétrie +1 SR / +3 R exemplaire ; colonne traits incomplète (Whurten, Thulkar). |
| R2 | Traits de Nature et limites | Simplifier | 1 | Utile mais purement négatif ; absorber dans la clause de réalité générale. |
| R3 | Catalogue mécanique (53) | Réécrire | 1 | Dit « sans recopier le catalogue » puis recopie tout : supprimer les tableaux redondants. |
| R4 | Elyë › Grâce elfique (5 PTV) | Simplifier | 2 | Voie linéaire possible ; Réflexe contient une note dev. |
| R5 | Elyë › Mémoire elfique (5 PTV) | Garder | 1 | Identité forte, peu de chiffres. |
| R6 | Elyë › Résonance elfique (7 PTV) | Fusionner (Sens + Empreinte) | 2 | Deux talents à 1 PTV fusionnables ; Accord doublonne Maintien naturel. |
| R7 | Whurten › Constitution (7 PTV) | Rééquilibrer | 2 | Encore debout trop fort 1/scène. |
| R8 | Whurten › Intégrité (8 PTV) | Simplifier | 2 | Âme réfractaire introduit un « test de libération » non défini. |
| R9 | Whurten › Instinct des profondeurs (7 PTV) | Fusionner | 2 | Boussole et Mémoire des profondeurs doublonnent le trait Sens magnétique. |
| R10 | Ashyll › Génie (8 PTV) | Simplifier | 2 | Bricolage doublonne Remise en ligne ; stock de lots = comptabilité. |
| R11 | Ashyll › Instinct du terrier (7 PTV) | Fusionner | 2 | Passage de rat / Toujours une sortie = même révélation MJ. |
| R12 | Ashyll › Culot (8 PTV) | Garder | 2 | Bonne identité « rebond » ; Faire avec = gabarit Plan collectif. |
| R13 | Thulkar › Puissance (4 PTV) | Rééquilibrer | 1 | R seulement, Mains de guerre trop rentable ; passer en SR/R. |
| R14 | Thulkar › Corps (7 PTV) | Simplifier | 2 | Toujours dangereux sommet trop situationnel. |
| R15 | Thulkar › Présence (5 PTV) | Simplifier | 1 | Pas de sommet ; Ne pas détourner le regard quasi nul. |
| R16 | Azménorien › Jusqu'au bout (8 PTV) | Simplifier | 2 | Insister et Pousser : bons, à raccourcir. |
| R17 | Azménorien › Don d'Azmenor (8 PTV) | Rééquilibrer | 2 | Incantation fulgurante −1 PA/round trop forte. |
| R18 | Silcenters, Continuité & HDS (prose) | Réécrire | 1 | ≈90 % lore ; manque la règle d'accès effective. |
| R19 | Croix d'Emphyrra (prose) | Réécrire | 1 | « Éducation, adhésion, mentorat » sans mécanique d'entrée. |
| R20 | Runes, Atelier des Clans & Iron Law (prose) | Couper | 1 | Politique éditoriale, aucune règle joueur. |
| R21 | Réseaux ashylls & Syndicat de Jade (prose) | Simplifier | 1 | Une règle utile : ressources existantes ; le reste vers l'encadré Monde. |
| R22 | Hordes thulkars (prose) | Simplifier | 1 | Seule règle : Horde Abyssale → Corruption ; garder ce renvoi. |
| R23 | Héritages azménoriens & technomagie (prose) | Réécrire | 1 | Remplacer par le gabarit Prototype de Vérité chiffré. |
| R24 | Catalogue mécanique (131) | Réécrire | 1 | Même contradiction « reste dans le Builder » mais recopié. |
| R25 | Protocoles de Continuité (7 PTV) | Simplifier | 1 | Transition en chaîne : sommet faible. |
| R26 | HDS (6 PTV) | Rééquilibrer | 2 | Anti-Nature puissant, accessible Voilé, sans quota sur HDP. |
| R27 | Faucon › Voie du Terrain (7 PTV) | Simplifier | 2 | Profane ; modèle idéal de Voie linéaire. |
| R28 | Faucon › Autonomie (6 PTV) | Simplifier | 2 | Survie profane → Affiliation. |
| R29 | Faucon › Briser l'Artifice (6 PTV) | Fusionner | 2 | Laisser une cicatrice à absorber ; Dépendance = gabarit Lecture. |
| R30 | Serpentaire › Exigence de Citrine (8 PTV) | Simplifier | 2 | Artisanat profane → Affiliation. |
| R31 | Serpentaire › Culture de l'Ascendant (6 PTV) | Fusionner | 1 | Codes et Étiquette fusionnables. |
| R32 | Serpentaire › Haute Magie de Citrine (8 PTV) | Simplifier | 2 | Vraie Vérité ; nettoyer la note dev de Réfection. |
| R33 | Aigle › Intransigeance (8 PTV) | Simplifier | 2 | Une fois suffit crée une seconde échelle de bonus. |
| R34 | Aigle › Rites des anciens dieux (7 PTV) | Garder | 2 | Niche mais thématique ; Consécration ≈ alarme runique. |
| R35 | Hibou › Science des Ombres (7 PTV) | Garder | 1 | Cohérent, lisible. |
| R36 | Hibou › Symbiose d'Onyx (8 PTV) | Simplifier | 2 | Trois talents de traversée qui se recoupent. |
| R37 | Runes whurtennes (13 PTV) | Réécrire | 3 | Bloc commun répété 6× ; suivi par bénéficiaire. |
| R38 | Atelier des Clans (8 PTV) | Réécrire | 2 | Fiabilisation 1 141 caractères ; Remise en ligne doublonne Bricolage. |
| R39 | Iron Law (10 PTV) | Simplifier | 2 | Stabilité augmentique = doublon d'un talent Réalité. |
| R40 | Ligue › Empire invisible (7 PTV) | Réécrire | 2 | Profane → Faveurs de réseau. |
| R41 | Ligue › Doctrine du levier (7 PTV) | Réécrire | 2 | Pas de test ni coût ; une Faveur suffit. |
| R42 | Jade › Réseau de Jade (8 PTV) | Réécrire | 2 | Contacts → menu de Faveurs. |
| R43 | Jade › Garde de Jade (8 PTV) | Simplifier | 2 | Seule branche combat du réseau ; Feu masqué inutile. |
| R44 | Jade › Contrebande de Jade (8 PTV) | Réécrire | 2 | Point mort / Canal mort redondants. |
| R45 | Jade › Courtage occulte (8 PTV) | Réécrire | 2 | Garantie sans effet ; sommet = acheter. |
| R46 | Formation de Horde (8 PTV) | Simplifier | 2 | Quota 1/combat isolé ; termes « sécuriser » flous. |
| R47 | Horde Divine (7 PTV) | Rééquilibrer | 2 | Riposte gratuite sans prérequis. |
| R48 | Horde des Marais (8 PTV) | Rééquilibrer | 2 | +1 PA en sommet ; trois +3 de combat 1/round. |
| R49 | Horde Fantôme (6 PTV) | Simplifier | 1 | Seule Voie V-only cohérente ; Disparaître trop automatique. |
| R50 | Horde des Cendres (8 PTV) | Simplifier | 2 | Force de chantier ne fait rien de chiffré. |
| R51 | Horde de la Rose (7 PTV) | Rééquilibrer | 2 | Interdisciplinarité +3 vs Assistance +2. |
| R52 | Pluton › Ingénierie xéno (8 PTV) | Simplifier | 2 | Fabrication sans test ni durée. |
| R53 | Pluton › Silence de Pluton (8 PTV) | Garder | 1 | Clair, bien borné. |
| R54 | Technomagie › Convergence (5 PTV) | Réécrire | 2 | Prototypes sans procédure. |
| R55 | Technomagie › Fracture (8 PTV) | Simplifier | 2 | Quatre variantes « 1 m de matière ». |
| R56 | Technomagie › Arsenal de Rupture (18 PTV) | Rééquilibrer | 3 | Optique 1 PTV casse le Voile ; 8 talents, deux sommets. |

### C2. `entries-Vérité_exile.txt`
| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Pas léger | Fusionner (mot-clé Aisé avec #62, #66) | 1 | « Ignorer −3 sol instable » : même gabarit que Terrain familier. |
| 2 | Effacement elfique | Garder | 1 | Discrétion sans PA après rupture de vue ; net et jouable. |
| 3 | Réflexe de grâce | Simplifier | 1 | Mot-clé Relance ; retirer la note dev « ne restreint pas silencieusement ». |
| 4 | Souvenir ordonné | Garder | 1 | Mémoire fidèle sans jet, purement narrative, zéro calcul. |
| 5 | Lecture des êtres | Fusionner (gabarit Lecture avec #61, #77) | 1 | MJ révèle un indice, +3 première exploitation : triplon. |
| 6 | Expérience accumulée | Garder | 2 | Signature elfique forte ; définition avant jet bien posée. |
| 7 | Sens du Flux | Garder | 1 | Détection 10 m simple, limites claires. |
| 8 | Empreinte du Flux | Fusionner (avec Sens du Flux) | 1 | 1 PTV juste pour mémoriser ; à intégrer dans #7. |
| 9 | Suivre le Flux | Simplifier | 2 | Difficulté du pistage Esprit+Perception non donnée. |
| 10 | Accord instinctif | Fusionner (avec Maintien naturel #52) | 2 | Même réduction de maintien, clause anti-cumul croisée inter-races. |
| 11 | Endurance obstinée | Simplifier | 1 | Devient Résistant (fatigue, froid, privations). |
| 12 | Masse enracinée | Simplifier | 1 | Devient Résistant (déplacement forcé). |
| 13 | Insensible à la peine | Simplifier | 2 | Renvoi au Stress et clause anti-cumul vers une autre famille. |
| 14 | Encore debout | Rééquilibrer | 2 | Annule la mise à 0 PV chaque scène : passer 1/scénario. |
| 15 | Volonté incompressible | Simplifier | 1 | Devient Résistant (domination, possession). |
| 16 | Ancrage whurten | Simplifier | 1 | Quota absent de l'entrée (présent en table) ; mot-clé Relance. |
| 17 | Âme réfractaire | Réécrire | 3 | « Nouveau test de libération » différé, quota 1/effet subi : concept inédit. |
| 18 | Inaltérable | Garder | 2 | Échec → réussite DR 0, 1/scénario ; sommet clair. |
| 19 | Boussole intérieure | Fusionner (avec trait Sens magnétique) | 1 | Quasi doublon d'un trait gratuit. |
| 20 | Lecture du champ | Garder | 2 | Détecteur magnétique 20 m utile en cyberpunk. |
| 21 | Mémoire des profondeurs | Fusionner (avec Boussole intérieure) | 1 | Même registre navigation ; deux talents à 1–2 PTV fusionnables. |
| 22 | Point fixe | Simplifier | 2 | Trois repères à noter sur la fiche : gestion papier. |
| 23 | Ça devrait marcher | Simplifier | 2 | Double effet (+3 et annule −3) plus une clause anti-abus. |
| 24 | Diagnostic sauvage | Fusionner (avec Dépendance critique #69) | 1 | 1 PA d'examen → +3 : gabarit identique. |
| 25 | Bricolage de fortune | Fusionner (avec Remise en ligne #109) | 2 | Même effet ; Remise en ligne sans test est plus forte. |
| 26 | Rien ne se perd | Simplifier | 2 | Stock de 3 lots = comptabilité ; passer en 1/scène. |
| 27 | Impossible ? Non. Mal préparé. | Simplifier | 2 | Retirer la note de designer comparant à Bricolage. |
| 28 | Faufiler | Fusionner (avec trait Petite morphologie) | 1 | Donne enfin un effet au trait vide. |
| 29 | Oreille du terrier | Garder | 1 | Interaction avec Ouïe ashyll bien réglée. |
| 30 | Passage de rat | Fusionner (avec Toujours une sortie #31) | 2 | Deux révélations MJ de passage physique. |
| 31 | Toujours une sortie | Fusionner (avec Passage de rat #30) | 2 | Sommet 3 PTV quasi identique au talent précédent. |
| 32 | Même pas peur | Simplifier | 1 | Résistant (intimidation ordinaire). |
| 33 | Profiter du flottement | Simplifier | 2 | Déclencheur « échec adverse à vous surveiller » rarement visible. |
| 34 | Rebondir | Garder | 1 | Changement d'approche sans PA ; bonne identité gobeline. |
| 35 | Faire avec ce qu'on a | Fusionner (gabarit Plan collectif #64, #146) | 2 | Trois participants +3 première action : triplon. |
| 36 | Poigne thulkar | Simplifier | 1 | R seulement pour un +3 : passer en SR/R. |
| 37 | Mains de guerre | Rééquilibrer | 1 | DGT Pugilat ×3 pour 1 PTV ; meilleur en trait gratuit à DGT 2. |
| 38 | Force de rupture | Garder | 1 | Ignorer 2 Protection matérielle ; clair, mais accès R. |
| 39 | Peau épaisse | Garder | 1 | Armure 1, calculée par le serveur. |
| 40 | Douleur familière | Simplifier | 1 | Résistant (douleur) ; proche d'Insensible à la peine. |
| 41 | Encaisser | Garder | 1 | −5 dégâts 1/scène, gabarit réutilisable. |
| 42 | Toujours dangereux | Rééquilibrer | 2 | Sommet 3 PTV utilisable seulement Agonisant et Révélé. |
| 43 | Masse imposante | Garder | 1 | Vigueur au lieu de Charisme pour intimider ; simple. |
| 44 | Ne pas détourner le regard | Couper | 1 | La règle anti-répétition couvre déjà la répétition d'intimidation. |
| 45 | Monter au défi | Simplifier | 2 | « Défi accepté ouvertement » laissé à l'arbitrage du MJ. |
| 46 | Insister | Simplifier | 1 | Exception à la non-répétition ; raccourcir en une phrase. |
| 47 | Hyperfocalisation | Fusionner (mot-clé Aisé) | 1 | Ignorer −3 de distraction ; quota absent de l'entrée. |
| 48 | Pousser la limite | Simplifier | 1 | Retirer la formule de changelog « n'interdit plus les aides ». |
| 49 | Jusqu'à la rupture | Simplifier | 2 | Bonne tension ; supprimer les clauses Aura et douleur. |
| 50 | Canalisation naturelle | Garder | 1 | Corps = focus ; limites concises. |
| 51 | Correction instinctive | Simplifier | 1 | Mot-clé Relance (activation de Technique). |
| 52 | Maintien naturel | Fusionner (avec Accord instinctif #10) | 2 | Durée « trois rounds » différente pour le même effet. |
| 53 | Incantation fulgurante | Rééquilibrer | 2 | −1 PA chaque round : passer 1/scène ou minimum 2 PA. |
| 54 | Révélation drillée | Garder | 1 | Transition sans PA 1/scène ; la meilleure Vérité du chapitre. |
| 55 | Repli réflexe | Garder | 1 | Retour en V réflexe ; bien borné. |
| 56 | Coordination de Silcenter | Fusionner (avec Rappeler à lui #87) | 2 | Assistance +2 en combat : même dérogation. |
| 57 | Transition en chaîne | Fusionner (avec Révélation drillée #54) | 1 | Sommet 3 PTV qui n'ajoute presque rien au talent à 1 PTV. |
| 58 | Lecture de distorsion | Garder | 1 | Détection d'Hologramme 10 m claire. |
| 59 | HDB - Hologram Distorsion Block | Rééquilibrer | 2 | Verrou de Révélation accessible Voilé pour 2 PTV. |
| 60 | HDP - Hologram Distorsion Punishment | Rééquilibrer | 2 | Dégâts de réaction chaque round, sans quota de scène. |
| 61 | Lire le terrain | Fusionner (gabarit Lecture) | 1 | Identique à Lecture des êtres, appliqué au terrain. |
| 62 | Terrain familier | Fusionner (mot-clé Aisé avec #1) | 1 | Ignorer −3 de terrain naturel. |
| 63 | Se fondre dans le décor | Garder | 1 | +3 Furtivité immobile ; simple. |
| 64 | Préparer l'embuscade | Fusionner (gabarit Plan collectif) | 2 | Triplon de #35 et #146. |
| 65 | Vivre de peu | Simplifier | 1 | Résistant (survie, pénurie). |
| 66 | Faire sans | Fusionner (Aisé, avec Vivre de peu #65) | 1 | Ignorer −3 d'équipement de survie. |
| 67 | Déjouer les capteurs | Simplifier | 2 | « Catégorie de capteurs » non listée nulle part. |
| 68 | Refuge autonome | Simplifier | 2 | Clauses anti-revenu superflues ; garder 5 personnes / 3 jours / −3. |
| 69 | Dépendance critique | Fusionner (avec Diagnostic sauvage #24) | 1 | Gabarit Lecture technique. |
| 70 | Sabotage minimal | Simplifier | 1 | Ni test ni durée de panne précisés. |
| 71 | Frapper juste | Garder | 2 | Altération matérielle dès la réussite ; dépend du chapitre Altérations. |
| 72 | Laisser une cicatrice | Couper | 1 | 2 PTV pour un effet narratif ; fondre dans Sabotage minimal. |
| 73 | Standard | Garder | 1 | Défauts manifestes sans jet, +3 pour les vices cachés. |
| 74 | Préparation | Simplifier | 2 | Long renvoi à Prendre son temps ; une phrase suffit. |
| 75 | Reprise minutieuse | Simplifier | 1 | Mot-clé Relance (travail corrigeable). |
| 76 | Œuvre parfaite | Garder | 2 | +2 DR qualité, 1/scénario ; sommet propre. |
| 77 | Lire le cercle | Fusionner (gabarit Lecture) | 1 | Révélation MJ sur un groupe social. |
| 78 | Maîtriser les codes | Fusionner (avec Retourner l'étiquette #79) | 1 | Annule un malus d'étiquette ; trop mince seul. |
| 79 | Retourner l'étiquette | Fusionner (avec Maîtriser les codes #78) | 1 | +3 social sur une violation de protocole. |
| 80 | Enfermer dans ses propres règles | Simplifier | 2 | −3 aux actions « conservant les avantages du cadre » : abstrait. |
| 81 | Suture | Garder | 1 | Stabilisation automatique au contact, serveur. |
| 82 | Correction somatique | Simplifier | 2 | « Trouble » non défini (poison ? maladie ? état ?). |
| 83 | Réfection vitale | Réécrire | 2 | Note dev et « rechargement de page » dans le texte joueur. |
| 84 | Restauration parfaite | Garder | 2 | Régénère un membre 1/scénario ; narratif mais thématique. |
| 85 | Aucune révérence | Simplifier | 1 | Résistant (autorité sacrée). |
| 86 | Une fois suffit | Réécrire | 2 | « Facilité d'un niveau sur seuil fixe » : seconde échelle de bonus. |
| 87 | Rappeler à lui | Fusionner (avec Coordination #56) | 1 | Assistance +2 en combat sur une résistance. |
| 88 | Liturgie du refus | Garder | 2 | Bouclier collectif anti-domination ; bon sommet. |
| 89 | Consécration | Simplifier | 2 | Alarme à 100 m, recoupe Rune du Foyer. |
| 90 | Rite funéraire | Simplifier | 2 | Niche ; « résultat sert de Puissance » mérite un exemple. |
| 91 | Rite de séparation | Garder | 2 | « Lien spirituel mineur » à définir dans le glossaire. |
| 92 | Rupture de l'idole | Garder | 2 | Interrompt un culte ; définitif si le support est détruit. |
| 93 | Regard d'Onyx | Garder | 1 | Perception des Ombres ; clair. |
| 94 | Lire l'ancrage | Garder | 1 | Esprit+Perception donne la nature de l'ancrage. |
| 95 | Main d'Onyx | Fusionner (mot-clé Touche l'immatériel, avec #103, #181) | 1 | Triplon entre trois traditions. |
| 96 | Refuser l'arrachement | Garder | 2 | Réaction opposée contre l'arrachement spirituel. |
| 97 | Empreinte d'Onyx | Simplifier | 1 | « Ombre consentante » : lore lourd pour un talent à 1 PTV. |
| 98 | Chair intermittente | Simplifier | 2 | Deux effets alternatifs dans un seul talent ; scinder ou choisir. |
| 99 | Pas d'Onyx | Garder | 1 | Traverser 1 m pendant un Déplacement ; simple. |
| 100 | Entre deux états | Simplifier | 2 | Bon sommet, mais 3 phrases d'exclusions. |
| 101 | Rune du Foyer | Fusionner (avec Rune de Veille #102) | 2 | Deux alarmes à 100 m ; bloc Runes recopié. |
| 102 | Rune de Veille | Fusionner (avec Rune du Foyer #101) | 1 | Alarme conditionnelle à 100 m ; même famille. |
| 103 | Rune de Fer | Fusionner (Touche l'immatériel) | 1 | Identique à Arme d'Interférence et Main d'Onyx. |
| 104 | Rune de Scellement | Garder | 1 | Fermeture diff. 18 ; lisible (hors boilerplate). |
| 105 | Rune de Garde | Réécrire | 3 | 1 016 caractères pour −6 dégâts ; suivi par bénéficiaire. |
| 106 | Inscription brève | Garder | 1 | Rune en 1 PA 1/scène ; clair. |
| 107 | Phrase runique | Réécrire | 3 | « Contrôlées par identifiants » : jargon serveur dans la règle. |
| 108 | Fiabilisation | Réécrire | 3 | 1 141 caractères, deux talents en un (scénario et permanent). |
| 109 | Remise en ligne | Fusionner (avec Bricolage #25) | 1 | Plus fort que Bricolage (sans test) au même coût. |
| 110 | Réglage de maître | Garder | 1 | +3 sur une fonction réglée pour la scène. |
| 111 | Fait pour durer | Simplifier | 2 | « Une création active par artisan » : suivi supplémentaire. |
| 112 | Interface de Vérité | Simplifier | 2 | Niche ; règle d'interaction implant/trait à mettre dans le socle. |
| 113 | Stabilité augmentique | Fusionner (avec Stabilité augmentique Réalité) | 1 | Doublon explicite d'un talent de Réalité. |
| 114 | Redondance intégrée | Garder | 1 | Maintien d'un implant un round ; propre. |
| 115 | Surcadence | Simplifier | 1 | Dépend de l'état Surchargée défini ailleurs. |
| 116 | Architecture résiliente | Garder | 2 | Sommet clair, 1/scénario. |
| 117 | Société écran | Simplifier | 2 | Profane : basculer en Affiliation ou Faveur. |
| 118 | Acquisition silencieuse | Fusionner (avec Société écran #117) | 1 | Gabarit Brouillage −3 sur une transaction. |
| 119 | Capital mobilisé | Simplifier | 1 | Accélérateur d'achat : une Faveur de réseau. |
| 120 | Portefeuille cloisonné | Couper | 2 | Gérer 3 structures pour un basculement 1/scénario marginal. |
| 121 | Pression latente | Réécrire | 2 | Ni test ni coût chiffré (« dépense appropriée »). |
| 122 | Menace réversible | Fusionner (avec Pression latente #121) | 1 | 2 PTV pour le timing d'activation. |
| 123 | Étranglement | Simplifier | 2 | Deux pressions ou une antenne : deux options floues. |
| 124 | Le bon intermédiaire | Fusionner (gabarit Contact #127, #137) | 1 | Contact 1/scénario ; même gabarit. |
| 125 | Faire courir le bruit | Simplifier | 1 | Utile ; « portion réelle du réseau » à supprimer. |
| 126 | Canal mort | Fusionner (avec Point mort #132) | 1 | Le texte renvoie lui-même à Point mort. |
| 127 | Trouver quelqu'un qui sait | Garder | 2 | Expert plus +3 intellectuel ; bon sommet de réseau. |
| 128 | Feu masqué | Couper | 1 | Reformule la règle normale de tir dissimulé. |
| 129 | Tirer et décrocher | Garder | 1 | Miroir d'Effacement elfique pour un tireur. |
| 130 | Feu croisé | Fusionner (mot-clé Tenaille avec #141) | 1 | Version à distance d'Épaulement. |
| 131 | Zone de mort | Garder | 2 | Tir d'interception clair ; vérifier le cumul de Réactions. |
| 132 | Point mort | Fusionner (avec Canal mort #126) | 1 | Dépôt clandestin ; redondant. |
| 133 | Route grise | Garder | 1 | +3 au passage, 1/scène ; propre. |
| 134 | Couverture logistique | Garder | 1 | Brouillage −3 sur une fouille ; concis. |
| 135 | Passage de Jade | Simplifier | 2 | « Une route existe » garantie ; le prix n'est pas chiffré. |
| 136 | Garantie de Jade | Couper | 1 | Lore pur, aucun effet mécanique. |
| 137 | Marché ferme | Fusionner (avec Commande noire #139) | 1 | Un simple contact d'achat. |
| 138 | Provenance garantie | Simplifier | 2 | Clauses d'assurance juridique trop détaillées. |
| 139 | Commande noire | Fusionner (avec Marché ferme #137) | 1 | Sommet 3 PTV = pouvoir acheter. |
| 140 | Déploiement de Horde | Simplifier | 2 | Quota 1/combat unique ; manipulation d'initiative à préciser. |
| 141 | Épaulement | Fusionner (mot-clé Tenaille avec #130) | 1 | +3 en mêlée sous un angle distinct. |
| 142 | Relève immédiate | Simplifier | 2 | « Sécuriser au contact » sans effet défini. |
| 143 | Mouvement de Horde | Garder | 2 | Déplacement ou Défense gratuits pour 2 alliés ; bon sommet. |
| 144 | Fixer la cible | Garder | 1 | Marquage d'équipe +3 ; excellent outil coopératif. |
| 145 | Riposte d'Ashorn | Rééquilibrer | 1 | Attaque gratuite 1/scène pour 2 PTV sans prérequis. |
| 146 | Plan de bataille | Fusionner (gabarit Plan collectif) | 2 | Triplon de #35 et #64. |
| 147 | Mauvais moment | Simplifier | 1 | +3 après un raté adverse ; s'empile avec Riposte. |
| 148 | Frapper où ça cède | Simplifier | 1 | Dépend des états Tendu/Paniquée ; « action comparable » flou. |
| 149 | Pas mourir pour rien | Simplifier | 2 | « Repli gratuit déjà prévu » : renvoi obscur. |
| 150 | La réussite appelle la réussite | Rééquilibrer | 1 | +1 PA : gain d'économie rare et fort. |
| 151 | Ancrage de Réalité | Simplifier | 1 | Résistant (transition forcée) ; clause capteur = lore. |
| 152 | Identité cloisonnée | Garder | 1 | Seul talent V-only ; Brouillage −3 cohérent. |
| 153 | Disparaître dans la Réalité | Rééquilibrer | 2 | Casse automatiquement une poursuite : passer à +3. |
| 154 | Force de chantier | Couper | 1 | Détermine seulement la faisabilité ; règle générale d'Assistance. |
| 155 | Fortification express | Garder | 1 | Couvert partiel en 1 PA ; clair. |
| 156 | Tenir la structure | Simplifier | 1 | Réaction plus maintien ; difficulté non donnée. |
| 157 | Chantier de guerre | Simplifier | 2 | Heures → minutes sans plafond ni test. |
| 158 | Faire scène | Simplifier | 2 | Trois conditions pour un bonus d'un round. |
| 159 | Contrepied | Simplifier | 1 | « Erreur adverse préexistante » difficile à établir à table. |
| 160 | Formation croisée | Garder | 1 | Meilleure compétence en Action combinée ; élégant. |
| 161 | Interdisciplinarité | Rééquilibrer | 1 | Auto-Assistance +3 contre +2 dans le socle : incohérent. |
| 162 | Interface étrangère | Fusionner (mot-clé Aisé) | 1 | Ignorer −3 de paradigme xéno. |
| 163 | Pont de standards | Simplifier | 2 | Fabrication durable sans test ni durée. |
| 164 | Autonomie forcée | Garder | 1 | Fonction locale sans infrastructure ; borné. |
| 165 | Architecture croisée | Simplifier | 2 | Intégration xéno : relève du chapitre Équipement. |
| 166 | Couper la balise | Garder | 1 | Coupe une émission en Réaction ; très lisible. |
| 167 | Nettoyage de provenance | Fusionner (mot-clé Brouillage) | 1 | −3 aux analyses d'origine. |
| 168 | Mode silencieux | Garder | 1 | Silence radio, −3 de détection ; clair. |
| 169 | Fenêtre noire | Simplifier | 1 | Extension à 3 appareils ; retirer la clause redondante. |
| 170 | Capteur biphysique | Réécrire | 2 | Prototype sans coût, délai ni test. |
| 171 | Asservissement croisé | Simplifier | 2 | Domotique surnaturelle ; dépend du gabarit Prototype. |
| 172 | Convertisseur biphysique | Simplifier | 2 | « Puissance admissible à enregistrer » : liste absente. |
| 173 | Relais discontinu | Garder | 1 | Connexion à travers 1 m ; limites nettes. |
| 174 | Fenêtre de phase | Fusionner (avec Relais discontinu #173) | 1 | Même principe, flux sensoriel au lieu de données. |
| 175 | Décalage de trajectoire | Rééquilibrer | 2 | Bénéfice réel flou (ignore couvert ?) ; préciser l'effet. |
| 176 | Microbrèche | Simplifier | 2 | Bon sommet, mais deux phrases d'exclusions. |
| 177 | Optique de Vérité | Rééquilibrer | 2 | 1 PTV, voit le Voile de tous, sans résistance : casse l'univers. |
| 178 | Enregistrement invariant | Fusionner (avec Optique de Vérité #177) | 1 | Corollaire naturel ; mention AIDH = lore. |
| 179 | Signature de Vérité | Garder | 2 | Reconnaissance d'un individu malgré l'Hologramme. |
| 180 | Fenêtre de Vérité | Simplifier | 2 | Installation : durée, coût et alimentation non précisés. |
| 181 | Arme d'Interférence | Fusionner (mot-clé Touche l'immatériel) | 1 | Triplon de Main d'Onyx et Rune de Fer. |
| 182 | Ancre d'Ombre | Simplifier | 2 | « Tentatives immatérielles prévues » : liste absente. |
| 183 | Cage de Vérité | Fusionner (avec Ancre d'Ombre #182) | 2 | Même effet, diff. 21 au lieu de 18. |
| 184 | Désancrage offensif | Simplifier | 2 | Quota 1/scène/cible ; dépend de deux prérequis. |

### C3. `entries-Traits_exile.txt`
| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Ambidextrie naturelle | Garder | 1 | Aucune pénalité main non dominante ; aucune attaque supplémentaire. |
| 2 | Affinité elfique à la Magie | Fusionner (avec Don magique azménorien #8) | 1 | Même trait d'accès sous deux noms. |
| 3 | Longévité | Simplifier | 1 | Purement narratif : le classer en lore, hors liste mécanique. |
| 4 | Sens magnétique | Garder | 1 | Trait solide ; doit absorber Boussole intérieure. |
| 5 | Ouïe ashyll | Garder | 1 | +3 auditif simple. |
| 6 | Petite morphologie | Réécrire | 1 | « Aucun bonus chiffré » : intégrer l'effet de Faufiler. |
| 7 | Ailes sombres | Simplifier | 1 | « Immenses sauts » non chiffrés ; donner distance et réduction de chute. |
| 8 | Don magique azménorien | Fusionner (avec Affinité elfique #2) | 1 | Trait commun « Accès magique ». |

Traits manquants (aucune ligne dans le fichier, alors que le tableau R1 les annonce ou que l'équité l'exige) : **Physiologie robuste (Whurten)** et **tout trait Thulkar**.

---

## D. Comptage

**Lecture**
- `entries-Vérité_exile.txt` : **184 / 184** entrées lues (#1–#184).
- `entries-Traits_exile.txt` : **8 / 8** entrées lues (#1–#8).
- Chapitre de règles : 1 313 lignes / 80 588 caractères lus. Il compte 2 articles et 56 sections, évaluées en C1 (R1–R56).

**Répartition des verdicts — `entries-Vérité_exile.txt` (184 lignes, ordre #1→#184 vérifié par script)**
| Verdict | Nombre |
|---|---|
| Garder | 49 |
| Simplifier | 62 |
| Fusionner | 47 |
| Réécrire | 8 |
| Rééquilibrer | 12 |
| Couper | 6 |
| **Total** | **184** |

Poids papier des entrées : 1 léger = 104 · 2 moyen = 76 · 3 lourd = 4. Les quatre entrées lourdes sont Âme réfractaire, Rune de Garde, Phrase runique et Fiabilisation.

**Traits (8)** : Garder 3 · Simplifier 2 · Fusionner 2 · Réécrire 1. Poids : tous légers (1).

**Règles (56 sections R1–R56)** : Garder 6 · Simplifier 23 · Fusionner 5 · Réécrire 13 · Rééquilibrer 8 · Couper 1. Poids : 1 = 18 · 2 = 36 · 3 = 2.

**Impact estimé si B1 à B4 sont appliqués** :
- la Vérité Exilé passe de 184 à environ 60 entrées (talents raciaux et vraie Vérité, après fusions par mots-clés) ;
- environ 80 entrées profanes deviennent environ 12 Affiliations, plus un menu de Faveurs ;
- le texte moyen d'une entrée passe de ≈ 310 à ≈ 120 caractères grâce au glossaire et à la clause de réalité ;
- les quotas passent de 7 types à 3.
