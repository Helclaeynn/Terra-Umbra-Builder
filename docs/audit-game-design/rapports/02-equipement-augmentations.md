# Audit 02 — Réalité : Équipement & Augmentations

Périmètre lu intégralement :
- `entries-Réalité_équipement.txt` — 367 entrées (#1–#367)
- `entries-Réalité_augmentations.txt` — 146 entrées (#1–#146)
- `rules/Réalité — règles spécifiques › Augmentations` — 2 articles, 16 sections
- `rules/Réalité — règles spécifiques › Économie & équipement` — 3 articles, 29 sections

Note de méthode : l'extrait d'entrées ne contient **ni prix, ni DGT, ni capacité, ni Slots/Charge/Stress** pour la plupart des objets (seulement Propriétés + Portée). Pour juger la courbe prix/puissance, j'ai lu en lecture seule le catalogue source (`Terra-Umbra-Builder/compendium/source/current-combat-catalog-v1.json` et `current-equipment-catalog-v1.json`), qui donne prix et DGT des entrées #1–#261. Les armes #262–#330, les Neuroprogrammes, les véhicules et les augmentations n'y ont pas de valeurs chiffrées exploitables : pour celles-là, l'avis porte sur la lisibilité et la cohérence, pas sur le prix.

---

## A. Synthèse de la famille

1. **Ce que le design cherche à faire** : un catalogue « réaliste » de Californie 2035, avec trois fabricants d'armes qui ont chacun leur identité (Owl = bon marché, simple, « Fiable » ; Raven = militaire, EMP, Fiable ; Phoenix = premium, Smartlink, Feu). Les augmentations suivent trois familles bien posées (Gen1 brute et stressante, Gen2 compacte et modulaire, Bio chère et non hackable). En toile de fond, une économie Compte / Train de vie / Charges fixes. L'idée tient et colle bien au genre.
2. **Forces** : la règle des couches de protection (Armure portée + Armure corporelle + Réduction typée, Perforant n'ignore que l'Armure) est claire. L'échelle Camo 1/2/3 est un modèle de palier bien écrit. La table Portée (+3 / 0 / −3 / impossible) est simple. Les difficultés de Maîtrise augmentique (15/18/21/25) reprennent l'échelle du socle. Le Train de vie en « crans » évite de comptabiliser les petites dépenses.
3. **Faiblesse n°1 — le vocabulaire de propriétés n'est pas maîtrisé** : sur les 95 profils d'armes, on compte **environ 90 libellés de propriétés distincts**, alors que la table des règles n'en définit que **10** (Rafale, Automatique, Fiable, Perforant X, Dispersion X, Smartlink, Autoguide, EMP, Zone X, Encombrant). Restent sans définition : Robuste, Fiable 2, Infaillible, Inaltérable, Défaillant, Dangereux, Aléatoire, Choc, super choc, Électrique / électrique / [Électricité], Feu / [Feu] / Incendiaire / cautérise / Irradiant / nuage ardent, Photoedge, Vibratoire, Biosteel, Hydraulique, Lourd 1, Hypodermique, précision fine, recul réduit, Double balle, Neurochoc, Bloody shock, Munitions noires, Efficience minimale, Dual mode (E), bio-objet, adhésif, thermosensible, paralysant, Flash, etc. Sur papier, le joueur ne peut pas résoudre ces propriétés.
4. **Faiblesse n°2 — des textes techniques dans les profils** : 183 entrées d'équipement portent la mention « Usage réel selon description ; pas de bonus, attaque ou PV inventés… », 95 armes « Confirmer les munitions réellement disponibles… nombre non fixé par la table des impacts », et 103 augmentations « Fonction matérielle conforme au texte… sans +attribut/PA implicites ». Ce sont des consignes internes (garde-fous pour le serveur ou l'IA), pas du texte de jeu. On les trouve même sur des armes de mêlée (Mary-Antoinette #285, Hache circulaire #329). Les phrases « nombre non fixé par la table des impacts » avouent en plus un **trou de règle** : combien de cartouches consomme une Rafale ou une Suppression ?
5. **Faiblesse n°3 — beaucoup d'entrées ne sont que des lignes de prix** : 78 entrées d'équipement ont un effet vide, et une centaine d'autres (applications Holonet, vêtements, nourriture, boissons, loisirs, logements, transports, lots de munitions) ne sont que des **lignes de tarif**. Elles gonflent le compendium (#126–#137, #161–#189, #213–#243, #244–#261) sans rien apporter de mécanique. Leur place est dans 6 à 8 tableaux.
6. **Vocabulaire d'armure incohérent avec la règle** : la règle parle d'une Armure de base plus des « Réductions [Balistique]/[Mêlée]/[Antichoc] » qui s'ajoutent. Les profils d'armure donnent eux trois valeurs indépendantes (« Bal. 5 / Mel. 3 / Ant. 4 »), sans Armure de base. Les modules disent « +1 contre Tir » au lieu de « Balistique ». On ne sait donc pas si Bal. 5 est une Armure ou une Réduction. Même flou pour l'Ablatif : « Balistique 1 (Ablatif 4) » sur les gilets (#84–#87) ne correspond pas à la définition de la règle (« +X pendant N impacts »).
7. **Courbe prix/puissance des armes (#1–#55) : globalement monotone, mais avec des anomalies**. Le **Phoenix AR-124 Mutilator** (#35, 950 $, DGT 11, 60 m, Cap 36) est le meilleur fusil d'assaut **et** le moins cher : il domine le Howling (#37, 1 550 $, 45 m) et ne cède au Rampager (#36, 2 100 $) qu'1 DGT. L'**Owl Gladius** (#31, 950 $, DGT 9, 45 m) domine le **Phoenix Urban** (#32, 1 550 $, DGT 9, 30 m). La **Raven Claymore** (#5, 750 $, DGT 8, EMP) rend inutile la **Riot Control TM-028** (#7, 600 $, DGT 4, EMP). Le **Croaker** (#44, 5 550 $) coûte 3,6 fois le Boss (#45) pour +2 DGT.
8. **Le Smartlink n'a pas de prix cohérent** : intégré, il coûte environ +500 $ (Suppressor → Equalizer) ou +800 $ (Executionner → Neo-Executionner). En accessoire (#60), il coûte 1 000 $. Pour qu'il serve à quelque chose, il faut en plus une interface (#122, 750 $, « aucun +3 propre ») ou un Dispositif de visée (aug. #31–#32), puis payer 1 PA de Verrouillage. **Trois achats et une action pour un +3**, avec des règles de cumul différentes (Viser + Verrouillage se cumulent, Dispositif de visée ne se cumule avec aucun des deux). C'est la chaîne la plus lourde de toute la famille.
9. **Le Chargeur étendu (#58, 75 $, +50 %) écrase les variantes « grande capacité »** : le Gardien (#25, 1 650 $, Cap 12) n'est qu'un Pacificateur (#24, 1 250 $, Cap 7) à +400 $, alors qu'un chargeur étendu à 75 $ fait passer le Pacificateur à Cap 11.
10. **Armures lourdes peu rentables, à une exception près** : le Sun King (#96, 5 000 $, 5/5/5) et la Moon Guard (#97, 4 550 $, 4/7/4) n'apportent que +1/+1/+1 sur le Skylord (#93) ou la Night Guard (#94) à 1 450 $, pour un prix multiplié par 3. À l'inverse, la **Gallowglass II légère** (#92, 1 450 $, 5/3/4 + Anti-EMP) est la meilleure affaire du catalogue. La **Gallowglass II lourde** (#95, Bal. 9) neutralise presque tous les pistolets (DGT 10–11, Perforant 0–1), surtout si on y ajoute une Armure dermique ou un Maillage. C'est l'outlier défensif.
11. **Outliers offensifs** : Raven-Sehdia **Hellrails** (#296 : Perforant 5 + Infaillible + 550 m), **Tortoise Blastard** (#292 : 5 propriétés cumulées), **Raven-Sehdia Pacificateur X** (#313 : Infaillible + EMP sur un pistolet), **Raven Night** (#65 : +5 DGT, bien bornée). Côté augmentations, le **Booster d'adrénaline** (#18–#19) est **la seule source de PA** de la famille (+1 PA, plafond 4). Il est 2 à 3 fois plus fort que tout autre module.
12. **Doublons dans l'équipement** : FaceCaster DFL en double (#61 et #145) ; « Riot Control » donné à deux armes Raven différentes (#7 mêlée, #43 shotgun) ; code « AR-124 » partagé par Mutilator et Sunlight ; Railway to Hell (#269) et Hellrails (#296) ; Flash Doorbell (#77) et Helios II (#274) ; Grenade EMP Doorbell (#76) et Ravenegg (#271) ; Bi (#305) et Bibal (#308) ; Jotkka (#312) et Eolgul-e (#314) ; quatre couteaux de base (#1, #320, #321, #324) ; sept armes hypodermiques (#297–#304) ; les munitions lourdes (#72–#83) recopient les DGT des lanceurs (#47–#55).
13. **Doublons cyber/bio dans les augmentations** : Branchies cyber (#67) et Branchies bio (#110) ; Palmes (#91–#92) et Mains/pieds palmés (#114) ; Spectre auditif étendu (#55) et Spectre auditif (#107) ; Audiovox (#61–#62) et Spectre vocal (#106) ; Griffes (#81–#82) et Bioarme griffes (#129) ; **Électrochoc (#122) et Bioarme décharge électrique (#128), un doublon à l'intérieur même de la famille Bio** ; Anticorps robotiques (#60) et Système immunitaire amplifié (#116) ; Filtre à toxines (#63), Poumon (#66) et Rein amélioré (#109) ; Armure dermique (#69–#70) et Peau de cuir (#121) ; Teinte (#1), Pigmentation (#101) et Camouflage dermique (#71).
14. **Les paires Gen1/Gen2 ne sont pas nommées** : 35 augmentations existent en deux entrées homonymes (70 entrées) (#12/13, #14/15… #144/145) sans la mention « Gen1 » ou « Gen2 » dans le nom. Le lecteur doit deviner laquelle est laquelle d'après le bonus. Le motif implicite est pourtant net et régulier : **Gen1 = +3 / bonus plus fort / Stress élevé / moins de Slots ; Gen2 = +2 / discrète / Stress faible / plus de Slots**. Plusieurs paires sont même **identiques** dans l'extrait (Ports d'interface #20 = #21, Cyberbras #73 = #74, Audiovox #61 = #62, Grappin, Lame cachée, Poings…).
15. **Stress augmentique : un bon socle, mais illisible sur papier**. Intégrité = Force Mentale + Humanité, Stress max = Vigueur + Humanité, Stress de base = somme des Stress installés, plus le Stress temporaire, N-Sta (−1 effectif), le test de Maîtrise spirituelle et la Frénésie. Cela fait **deux jauges, deux plafonds dérivés de quatre valeurs et deux couches de Stress**. Or seules 6 entrées affichent leur Charge/Stress (#18–#19, #64–#65, #69–#70) : **sur la fiche papier, on ne peut pas faire le total**. « Humanité » n'est défini dans aucun des fichiers lus. Le N-Sta (#139) parle de « Maîtrise » là où la règle dit « Maîtrise spirituelle ».
16. **Charge et Slots font double emploi** : les Slots limitent déjà ce qui se monte sur un Support. La Charge (comparée à l'Intégrité) limite le nombre de Supports et d'implants lourds. La règle précise qu'un module monté dans un membre « ne consomme normalement pas de Charge ». Pour le joueur, Charge, Slots et Stress font trois comptabilités pour une seule question : est-ce que je peux encore m'implanter ?
17. **Beaucoup de « le MJ décide »** : 189 des 367 entrées d'équipement sont classées `{inventaire / arbitrage MJ}`. Les drogues Prism, Redline, Bloom et Fleshfire (#192–#195) n'ont aucun effet chiffré, Dreamrush (#196) ne décrit que l'échec, et plusieurs munitions spéciales (Volto, Blast, Liquid, Rust) « peuvent » produire un effet « selon fiction ». À la table, cela crée de la négociation. Sur papier, c'est injouable sans MJ expérimenté.
18. **Les Neuroprogrammes (#331–#357) sont rangés dans l'équipement** mais suivent la règle Neurodive (marge, Intrusion, Défense active Neuro). Ils sont bien plus denses et techniques que le reste. D-Fence, MyWall et Castland ne sont que les paliers +1/+2/+3 d'un même programme ; Shieldic et Omnithorns sont des paliers d'épines ; Data-Shield et Sutr sont déjà déclarés non cumulables.
19. **Véhicules (#358–#367) sans profil** : la règle définit Structure, Blindage, Défense, Sécurité réseau et Pilotage autonome, mais aucune entrée véhicule n'en donne la valeur. Le texte se limite à « Structure/Blindage/Pilotage distincts des PV ». La règle véhicule est pourtant élégante (pas de sous-système, poursuites en tests opposés).
20. **Noms à risque** : « Pokeball » (#277), « Bomberman » (#281) et « Sunnyroshima » (#315, allusion à Hiroshima pour une arme incendiaire) posent un risque de propriété intellectuelle ou de ton. « Abraham Kennedy » (#295) reste acceptable.
21. **Poids cognitif** : en équipement, 1 ligne sur 3 est un tarif, 1 sur 4 une arme avec 2 à 5 mots-clés en partie non définis. En augmentations, le texte est court mais le joueur doit croiser Support → Slots → Charge → Stress → Gen. Au total, la famille est **moins lourde que les talents de Vérité par entrée, mais plus lourde par volume**.
22. **Dépendances vers d'autres chapitres** : Moteur (Rafale, Suppression, Viser, Altération, portage/Encombrant, PA), Neurodive (Rang, Intrusion, Contrôle, Défense Neuro, PV neuraux), Stress psychologique (Tendu/Paniqué, utilisé par Velvet et Dreamrush), talents Crawler (Assurance Silver #200), Unsinkable (#60, #104, #122, #155, aug. #20), « Humanité » et « Force Mentale ». Il faut donc des renvois explicites ou un mini-glossaire en tête de catalogue.

---

## B. Propositions concrètes

### B1. Un lexique fermé de 20 mots-clés d'armes, imprimé une fois

Remplacer les ~90 libellés par 20 mots-clés au maximum, tous définis dans la table « Propriétés d'armes ». Chaque effet tient en une ligne.

| Mot-clé | Effet (1 ligne) | Remplace |
|---|---|---|
| Fiable | 1 naturel : pas d'échec narratif ni d'enrayement. | Fiable, Robuste, Fiable/Robuste, Inaltérable |
| Fiable+ | Comme Fiable ; ignore aussi l'échec narratif du Stress. | Fiable 2, Infaillible |
| Défaillant | Échec narratif : l'arme s'enraye (1 PA pour dégager). | Défaillant, Aléatoire |
| Dangereux | Échec narratif : le tireur subit les DGT −5. | Dangereux |
| Perforant X | (inchangé) | Perforant, Photoedge, Vibratoire (= Perforant 1) |
| Choc | Altération « renversé/projeté » à DR 2 au lieu de 3. | Choc, super choc, Hydraulique, Blast |
| Feu | DGT [Feu] ; Altération = en feu (2 DGT/round jusqu'à 1 PA pour éteindre). | Feu, Incendiaire, cautérise, Irradiant, nuage ardent, Pyro |
| Électrique | DGT [Électricité] ; Altération = perd sa prochaine passe. | Électrique, paralysant, Volto, Neurochoc |
| EMP | (inchangé) | |
| Aveuglant | Altération = −3 aux tests visuels jusqu'à la fin de sa prochaine activation. | Flash, aveuglant, Raven Flash |
| Injecteur | N'inflige que DGT 1–2 ; si 1 PV passe, applique la substance chargée. | Hypodermique, soin assisté |
| Smartlink | Avec interface : Verrouillage coûte 0 PA au lieu de 1. | Smartlink, Visée intégrée, autociblage, précision fine |
| Zone X / Dispersion X / Autoguide / Rafale / Automatique / Encombrant | (inchangés) | |
| Dissimulable | +3 pour cacher l'arme ; Biosteel = indétectable aux portiques. | Pliant, Biosteel, pliant |
| Allonge X m | Attaque de mêlée à X m. | Portée 1,5/3,5 m |
| 1 coup | Recharger = 1 PA. | 1 coup |
| Prototype | Pas de prix ; accès par scénario. | prototype |

Toute propriété hors liste devient une ligne d'**Effet spécial** propre à l'arme, rédigée en clair (par exemple pour Dracula, Reminiscer ou Vader).

### B2. Gabarits d'armes et variantes de fabricant

Les armes #16–#46 (31 entrées) se ramènent à **9 gabarits** et **3 marques**.

**Gabarits (prix de base, profil Owl)** :
| Gabarit | DGT | Portée | Cap | Prix |
|---|---|---|---|---|
| Taser | 3 / 6 (lourd) | 15 m | 10 / 5 | 250 / 500 $ |
| Pistolet de poche | 6 | 20 m | 5 | 300 $ |
| Pistolet léger | 7 | 35 m | 10 | 500 $ |
| Pistolet lourd | 10 | 45 m | 8 | 950 $ |
| PM | 7 | 30 m | 30 | 750 $ |
| SMG | 9 | 30 m | 25 | 950 $ |
| Fusil d'assaut | 11 | 50 m | 30 | 1 200 $ |
| Fusil de précision | 12 | 150 m | 5 | 1 500 $ |
| Shotgun | 12 | 15 m (Dispersion 3) | 8 | 1 250 $ |

**Marques** (à appliquer au gabarit) :
- **Owl** : prix ×1, *Fiable*. Munitions ×0,5.
- **Raven** : prix ×1,3, +1 DGT, au choix *EMP* ou *Fiable*. Munitions ×1.
- **Phoenix** : prix ×1,4, *Smartlink* intégré, munitions *Feu* disponibles. Munitions ×1,6.

Les modèles nommés (Sturdy, Pacificateur, Equalizer…) deviennent une simple ligne de lore : « Raven HP-014 Pacificateur = Pistolet lourd Raven ». Les lots de munitions #244–#261 (18 entrées) suivent le même multiplicateur de marque : un seul tableau 6 × 3, ou même une seule ligne par gabarit.

**Avant (5 entrées #23–#27)** :
> #23 Owl HP-104 Deputy — Propriétés : Fiable. Portée : 45 m. | Confirmer les munitions… (950 $, DGT 10, Cap 7)
> #24 Raven HP-014 Pacificateur — Smartlink. 45 m. | Confirmer… (1 250 $, DGT 11, Cap 7)
> #25 Raven HP-067 Gardien — Smartlink. 45 m. | Confirmer… (1 650 $, DGT 11, Cap 12)
> #26 Phoenix HP-028 Violator — Smartlink. 45 m. | Confirmer… (1 250 $, DGT 10, Cap 10)
> #27 Phoenix HP-092 Depliant — Smartlink ; pliant. 45 m. | Confirmer… (1 250 $, DGT 10, Cap 9)

**Après (1 entrée)** :
> **Pistolet lourd** — DGT 10 · 45 m · Cap 8 · 950 $.
> Owl *Deputy* : Fiable. Raven *Pacificateur* : DGT 11, Fiable, 1 250 $. Phoenix *Violator* : Smartlink, 1 350 $ (*Dépliant* : + Dissimulable).
> Chargeur étendu : +50 % Cap, 150 $. (Le Gardien disparaît, puisque c'est un Pacificateur avec chargeur étendu.)

### B3. Corriger les anomalies de prix

- Mutilator #35 : passer à 60 m → 45 m et Cap 30, ou son prix à 1 400 $.
- Urban #32 : 45 m, ou prix 1 250 $.
- Riot Control TM-028 #7 : ajouter *Électrique* (matraque de contrôle), sinon la supprimer.
- Chargeur étendu #58 : 150 $ et « une seule fois par arme ».
- Smartlink accessoire #60 : 500 $, et Interface de ciblage #122 incluse dans tout casque ou Dispositif de visée.
- Armures lourdes #96–#97 : +2 sur l'axe principal ou prix ÷ 2. Gallowglass lourde #95 : Bal. 9 → 7.
- Croaker #44 : retirer EMP ou Perforant (4 propriétés, c'est trop).
- Renfort balistique #111 : 600 $ comme les autres renforts.

### B4. Unifier le vocabulaire d'armure

Écrire chaque armure sous la forme **« Armure X + Réduction [type] Y »**, conformément à la règle :

**Avant** (#92) : « Raven Gallowglass II légère — Bal.=Balistique 5 ; Mel.=Melee 3 ; Ant.=Antichoc 4 ; Notes=Anti-EMP ». Le lecteur ne sait pas si ces trois valeurs s'additionnent à une Armure.
**Après** : « **Gallowglass II (légère)** — Armure 3 · Balistique +2 · Antichoc +1 · Slots 2 · Anti-EMP intégré · 1 450 $ ». On applique Armure 3 partout, 5 contre balles et 4 contre chocs : une seule soustraction de base, plus un bonus contextuel.

On ajoute aussi la **catégorie** (Gilet / Légère / Lourde / Environnement / Furtivité) dans chaque nom, puisque la table de capacité de modules en dépend. Enfin, Ablatif s'écrit comme dans la règle : « Gilet Black Feathers — Armure 1, Ablatif 4 (+1) ».

### B5. Augmentations : une fiche par fonction, avec Gen1 / Gen2 / Bio en colonnes

On fusionne les 35 paires et les doublons cyber/bio en **une seule entrée par fonction**, avec trois colonnes standardisées :

| Fonction | Gen1 (brute) | Gen2 (discrète) | Bio |
|---|---|---|---|
| Effet type | +3 contextuel | +2 contextuel | +2, non hackable |
| Stress | 2 | 1 | 0 |
| Charge | 1 | 1 | 1 si fonction nouvelle, sinon 0 |
| Prix | ×1 | ×1,5 | ×4 |

**Avant (#18 et #19, deux entrées homonymes)** :
> #18 Booster d'adrénaline — Gen2 : 2 Slots, Charge 0, Stress 1 ; 1/scène, +1 PA pendant 1 round (max 4 PA), puis +1 Stress temporaire. Gen1 : 2 Slots, Charge 0, Stress 2 ; +1 PA pendant 2 rounds (max 4 PA), puis +2 Stress temporaire. · Mécanique : +1 PA ×2 rounds
> #19 Booster d'adrénaline — (même texte) · Mécanique : +1 PA ×1 round

**Après (1 entrée)** :
> **Booster d'adrénaline** · NeuroWare · 2 Slots · Charge 0 — 1/scène, 0 PA : +1 PA (max 4) pendant **Gen1 : 2 rounds / Gen2 : 1 round**, puis Stress temporaire **+2 / +1**. Stress permanent **2 / 1**.

**Avant (#20 = #21)** : deux entrées identiques « Ports d'interface… accès direct +2 ».
**Après** : « **Ports d'interface** · Gen1/Gen2 identiques · Charge 0 · Stress 0 — Connexion physique : +2 Intrusion/Contrôle sur le système câblé. »

Les entrées sans effet chiffré (cosmétiques #1–#9, #97, #98, #101 ; confort bio #99, #100, #104, #105, #115, #117–#119, #124) passent dans un **tableau « Implants de confort »** (Nom · Effet narratif · Stress 0 · Prix), sans fiche individuelle.

### B6. Stress augmentique : une seule jauge sur la fiche

Proposition, du plus léger au plus profond :
1. **Ajouter partout la mention « Charge / Stress / Slots / Prix »** dans le profil. Sans elle, le joueur papier ne peut rien totaliser.
2. **Fusionner les plafonds** : un seul **Seuil augmentique = Vigueur + Volonté** (ou Vigueur + Humanité, mais alors il faut définir l'Humanité). La Charge disparaît en tant que jauge : la place est déjà limitée par les Slots, et le nombre de Supports majeurs est plafonné à Seuil ÷ 3.
3. **Imprimer une piste de cases** : Stress permanent en cases pleines, Stress temporaire en cases barrées. Arrivé au seuil, on fait un test de Maîtrise spirituelle à 15 (+3 par case au-delà). La table 15/18/21/25 reste valable.
4. Frénésie : garder « 1 PA par round vers l'impulsion » et « −3 aux actions calmes ». C'est déjà léger et bien écrit.
5. N-Sta : renommer la compétence en « Maîtrise spirituelle » pour être cohérent.

### B7. Exemple de réécriture pour les drogues vagues

**Avant (#193 Redline)** : « Effort physique exceptionnel mais forte fatigue/risque physiologique ; utiliser circonstances favorables seulement dans l'usage précis préparé. »
**Après** : « **Redline** (100–200 $) — Pendant 1 scène : +3 aux tests de Vigueur et d'Athlétisme. Fin de scène : test Constitution 18 ; en échec, −3 à toutes les actions physiques jusqu'au repos long, et dépendance au 2e échec. »

Même gabarit pour toutes les drogues : **Effet (durée) · Contrecoup (test, difficulté) · Dépendance**.

### B8. Neuroprogrammes en paliers

**Avant** : D-Fence (+1 Défense active), MyWall (+2), Castland (+3), soit 3 entrées.
**Après** : « **Pare-feu I/II/III** — +1/+2/+3 Défense active Neuro. Variante *Épines* (Shieldic/Omnithorns) : si des PV passent, l'assaillant subit 1/2 PV neuraux, pour un Défense active réduit de 1. » Même traitement pour Dark Holes / Langoliers (Marge +1) et Data-Shield / Sutr.

### B9. Supprimer le texte de garde-fou dans l'export joueur

Les mentions « Usage réel selon description… », « Confirmer les munitions… » et « Fonction matérielle conforme au texte… » doivent sortir du texte joueur, soit vers une méta-donnée serveur, soit vers une seule phrase en tête de chapitre. Cela retire environ 380 lignes de bruit.

En contrepartie, il faut **combler le trou** signalé : **Rafale = 3 cartouches, Suppression = 10 cartouches**, une ligne dans la table des propriétés.

### B10. Cartes papier

- **Carte d'arme** (format poker) : Nom/Gabarit · DGT · Portée · Cap · 2 mots-clés au maximum · prix.
- **Carte d'augmentation** : Fonction · Gen · Slots · Charge · Stress · effet en 1 ligne.
- **Fiche « Corps augmenté »** : silhouette avec les Supports (tête/NeuroWare, yeux ×2, audio, bras ×2, jambes ×2, peau, organes), des cases de Slots et la piste de Stress.

---

## C. Tableau exhaustif

### C1. Équipement (`entries-Réalité_équipement.txt`, 367 entrées)

| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Couteau de combat | Fusionner (avec #320/#321/#324) | 1 | Gabarit « Couteau » DGT 3, 150 $ ; les couteaux de marque deviennent des variantes. |
| 2 | Owl KA-73 Last Encounter | Simplifier | 1 | DGT 7 pour 750 $ ; « Fiable/Robuste en fiction » est indéfini, remplacer par Fiable. |
| 3 | Phoenix PCK-08 Feather | Simplifier | 1 | DGT 4, Perforant 1, « cautérise » sans effet défini ; à fusionner dans le mot-clé Feu. |
| 4 | Phoenix BA-037 Sun Axe | Garder | 1 | Hache DGT 7 Perforant 1 à 900 $, cohérente ; cautérise reste à définir. |
| 5 | Raven CL-038 Claymore | Rééquilibrer | 1 | DGT 8 + EMP pour 750 $ : meilleure mêlée du catalogue, elle domine Riot Control #7. |
| 6 | Raven SP-016 Raven Spear | Garder | 1 | Allonge 1,5 m + EMP + Perforant 1 à 1 100 $ ; niche claire. |
| 7 | Raven TM-028 Riot Control | Rééquilibrer | 1 | DGT 4 EMP à 600 $, dominée par Claymore ; homonyme du shotgun #43. |
| 8 | Owl TS-009 Sun Wukong | Garder | 1 | Bâton DGT 6, allonge 1,5 m, 600 $ : bon rapport ; écrire « Fiable » seul. |
| 9 | Phoenix PW-026 Vampire Killer | Garder | 1 | Seule allonge 3,5 m du catalogue ; prix 1 300 $ justifié. |
| 10 | Raven MC-025 Hitman | Garder | 1 | Perforant 2 avec DGT 5 : arme anti-armure lisible. |
| 11 | Owl LC-014 Chasseur | Garder | 1 | Arbalète 1 coup DGT 7 ; doublon partiel de Black Arrow #262. |
| 12 | SeaWares HL-02 Poseidon | Simplifier | 1 | « Aquatique » non défini (malus hors de l'eau ?) ; DGT 8 supérieur au Chasseur. |
| 13 | Raven JL-014 Cuchulainn | Garder | 1 | Javelot EMP + Perforant 1 à 15 m ; identité Raven claire. |
| 14 | Tala TH-029 Tomahawk | Garder | 1 | Hybride jet/mêlée DGT 6 Fiable ; utile et simple. |
| 15 | Owl MB-014 Bolas monofilament | Rééquilibrer | 2 | 1 500 $ pour DGT 6 sans effet d'entrave ; des bolas doivent immobiliser. |
| 16 | Owl LT-015 Incapaciteur | Simplifier | 1 | Taser DGT 3 ; « Électrique » n'a pas d'effet d'étourdissement défini. |
| 17 | Raven HT-014 Immobilisateur | Simplifier | 1 | Taser lourd DGT 6, même trou de définition que #16 ; fusionner en gabarit Taser. |
| 18 | Owl PP-014 Old Colt | Fusionner (gabarit Pistolet de poche) | 1 | DGT 6 Cap 5 à 300 $ = profil de base Owl. |
| 19 | Raven PP-012 Defender | Fusionner (gabarit Pistolet de poche) | 1 | +1 DGT, −1 Cap pour +200 $ = variante Raven type. |
| 20 | Owl LP-019 Acceptable | Fusionner (gabarit Pistolet léger) | 1 | Profil de base pistolet léger, 500 $. |
| 21 | Raven LP-004 Sturdy | Fusionner (gabarit Pistolet léger) | 1 | Variante Raven : +1 DGT, Fiable, Cap 8. |
| 22 | Phoenix LP-028 Sun Blast | Fusionner (gabarit Pistolet léger) | 1 | Variante Phoenix : Smartlink pour +450 $. |
| 23 | Owl HP-104 Deputy | Fusionner (gabarit Pistolet lourd) | 1 | Base Owl DGT 10 Fiable, 950 $. |
| 24 | Raven HP-014 Pacificateur | Fusionner (gabarit Pistolet lourd) | 1 | Variante Raven DGT 11 Smartlink. |
| 25 | Raven HP-067 Gardien | Fusionner (avec #24) | 1 | Pacificateur Cap 12 à +400 $, rendu inutile par le Chargeur étendu à 75 $. |
| 26 | Phoenix HP-028 Violator | Fusionner (gabarit Pistolet lourd) | 1 | Variante Phoenix Smartlink Cap 10. |
| 27 | Phoenix HP-092 Depliant | Fusionner (avec #26) | 1 | Violator pliant, même prix : en faire une option Dissimulable. |
| 28 | Owl MGP-062 Suppressor | Fusionner (gabarit PM) | 1 | Base PM DGT 7 Cap 30, 750 $. |
| 29 | Raven MGP-072 Military | Fusionner (gabarit PM) | 1 | Variante Raven +1 DGT, Fiable, Cap 20. |
| 30 | Phoenix MGP-042 Equalizer | Fusionner (gabarit PM) | 1 | Smartlink intégré à +500 $, alors que l'accessoire coûte 1 000 $ : incohérent. |
| 31 | Owl LMG-092 Gladius | Rééquilibrer | 1 | 45 m à 950 $ : domine Urban #32 et égale la portée des fusils d'assaut. |
| 32 | Phoenix LMG-018 Urban | Rééquilibrer | 1 | 1 550 $ pour moins de portée que Gladius ; donner 45 m ou baisser le prix. |
| 33 | Raven LMG-027 Executionner | Fusionner (gabarit SMG) | 1 | Variante Raven DGT 10 Fiable ; orthographe « Executioner ». |
| 34 | Raven LMG-072 Neo-Executionner | Fusionner (avec #33) | 1 | #33 + Smartlink (+800 $) : c'est une option, pas une arme. |
| 35 | Phoenix AR-124 Mutilator | Rééquilibrer | 1 | Meilleur fusil d'assaut (60 m, Cap 36) et le moins cher (950 $) ; code AR-124 en double. |
| 36 | Raven AR-027 Rampager | Garder | 2 | Haut de gamme DGT 12 Fiable EMP, 2 100 $ ; cohérent. |
| 37 | Owl AR-071 Howling | Rééquilibrer | 1 | Plus cher que Mutilator avec moins de portée ; seul Perforant 1 le distingue. |
| 38 | Phoenix AR-124 Sunlight | Simplifier | 2 | « Flash » non défini ; même code AR-124 que #35 ; 2 550 $. |
| 39 | Owl SR-017 Big Game Hunter | Garder | 1 | Entrée de gamme précision lisible : DGT 12, 120 m. |
| 40 | Owl SR-029 Hoot | Garder | 1 | Progression régulière : +1 DGT, +80 m, Fiable, Perforant 1. |
| 41 | Raven SR-029 Deathbringer | Garder | 1 | Haut de gamme 300 m EMP ; prix 4 550 $ cohérent. |
| 42 | Phoenix SR-034 Phantom | Simplifier | 1 | « silencieux » intégré : renvoyer à l'accessoire #56 plutôt qu'à une propriété. |
| 43 | Raven SG-025 Riot Control | Réécrire | 2 | Homonyme de #7 ; « électrique » non défini sur un fusil à pompe. |
| 44 | Raven SG-039 Croaker | Rééquilibrer | 2 | 4 propriétés, 5 550 $ = 3,6× le Boss pour +2 DGT. |
| 45 | Owl SG-016 Boss | Garder | 1 | Fusil à pompe de référence : Dispersion 3, Fiable, Cap 12. |
| 46 | Phoenix SG-042 Fire Rain | Garder | 1 | Pompe incendiaire ; dépend de la définition de Feu. |
| 47 | Bastion | Garder | 2 | Mitrailleuse d'appui Cap 60 ; dépend de la règle de cartouches par Rafale. |
| 48 | Manticore | Garder | 2 | Arme lourde EMP DGT 14, 8 500 $ ; niche anti-véhicule claire. |
| 49 | Hellstorm | Rééquilibrer | 2 | Cap 200 sans coût en cartouches par Rafale = même effet que Bastion pour 2× le prix. |
| 50 | Doorbell | Réécrire | 1 | Lance-grenades marqué « non profilé » alors que le catalogue donne portée et Cap. |
| 51 | Breacher | Simplifier | 1 | Profil dupliqué par la roquette #79 ; le DGT doit être porté par la munition. |
| 52 | Wasp | Garder | 2 | Missile guidé 14 000 $ + 2 500 $ par coup ; luxe militaire justifié. |
| 53 | Wallbreaker | Garder | 1 | Anti-matériel Perforant 3 ; lisible. |
| 54 | Salamander | Simplifier | 2 | [Feu] et cône sans effet persistant ; le gabarit de cône manque. |
| 55 | Purifier | Simplifier | 2 | [Chimique] sans effet défini ; préciser la réponse du module Étanche #117. |
| 56 | Silencieux | Garder | 1 | −3 Perception, borné et clair ; modèle à suivre. |
| 57 | Optique de précision | Fusionner (avec aug. Zoom optique #33–34) | 1 | Effet identique, déjà non cumulable selon la règle ; un seul mot-clé « Optique ». |
| 58 | Chargeur étendu | Rééquilibrer | 1 | +50 % Cap pour 75 $ efface les variantes grande capacité ; passer à 150 $. |
| 59 | Bipied | Garder | 1 | Contre-mesure Encombrant simple. |
| 60 | Smartlink | Réécrire | 2 | 1 000 $ + interface + 1 PA pour un +3 : chaîne de trois achats à simplifier. |
| 61 | FaceCaster DFL | Fusionner (avec #145) | 1 | Doublon exact de #145 (même nom, même prix). |
| 62 | Raven Flash | Simplifier | 1 | Remplacer « aveugler/éblouir » par le mot-clé Aveuglant (−3 visuel). |
| 63 | Raven Volto | Réécrire | 2 | « immobilisation ou perte de passe selon fiction » : choisir un seul effet. |
| 64 | Raven Drill | Garder | 1 | Perforant 1, prix ×1 : munition idéale pour le papier. |
| 65 | Raven Night | Garder | 1 | +5 DGT, tir unitaire, risque d'échec narratif : outlier bien borné. |
| 66 | Phoenix Pyro | Garder | 1 | [Feu] sans DoT, renvoi à l'Altération ; clair. |
| 67 | Phoenix Hack | Garder | 1 | −3 Défense Neuro sur Altération : effet chiffré et borné. |
| 68 | Phoenix Blast | Simplifier | 1 | « projection significative » vague ; remplacer par le mot-clé Choc. |
| 69 | Owl Venom | Simplifier | 2 | DGT −3, puis test, puis +2 PV : trois étapes pour 2 PV ; mettre un DGT fixe hors Armure. |
| 70 | Owl Liquid | Réécrire | 2 | « conséquence localisée persistante » indéfinie : aucun effet jouable. |
| 71 | Owl Rust | Simplifier | 1 | Désactive une augmentation : préciser la durée (une scène). |
| 72 | Bande Bastion | Fusionner (avec #47) | 1 | Simple ligne de munition (60 coups, 250 $) dans le profil de l'arme. |
| 73 | Charge Manticore | Fusionner (avec #48) | 1 | Prix des munitions à intégrer au profil de l'arme. |
| 74 | Bande Hellstorm | Fusionner (avec #49) | 1 | 650 $ pour 200 coups : une ligne du profil. |
| 75 | Grenade fragmentation Doorbell | Garder | 1 | DGT 12, Zone 4 m : grenade de référence. |
| 76 | Grenade EMP Doorbell | Garder | 1 | Doublon fonctionnel de Ravenegg #271 ; garder celle-ci comme gabarit. |
| 77 | Grenade Flash Doorbell | Garder | 1 | Gabarit de grenade aveuglante ; Helios II #274 en est la variante. |
| 78 | Grenade fumigène Doorbell | Garder | 1 | Écran opaque sans couvert : précise et légère. |
| 79 | Roquette Breacher | Fusionner (avec #51) | 1 | La munition porte le DGT de l'arme : une seule entrée suffit. |
| 80 | Missile Wasp | Fusionner (avec #52) | 1 | Le DGT 20 n'apparaît qu'ici ; rattacher au lanceur. |
| 81 | Munition Wallbreaker | Fusionner (avec #53) | 1 | Même cas que #79 : le profil de l'arme suffit. |
| 82 | Réservoir Salamander | Fusionner (avec #54) | 1 | Ligne de recharge. |
| 83 | Réservoir Purifier | Fusionner (avec #55) | 1 | Ligne de recharge. |
| 84 | Raven Black Feathers | Simplifier | 1 | « Balistique 1 (Ablatif 4) » ne suit pas la syntaxe Ablatif de la règle. |
| 85 | Owl Bullets Fear | Simplifier | 1 | Bal. 2 Ablatif 2 au même prix : même ambiguïté que #84. |
| 86 | Phoenix Sun Shield | Rééquilibrer | 1 | Dominé par Punk Life #87 (même prix, Antichoc 1 en plus). |
| 87 | Byron Punk Life | Garder | 1 | Gilet street lisible ; référence des gilets. |
| 88 | Raven Black Dog | Garder | 1 | 3/2/2 à 1 000 $ : référence de l'armure légère. |
| 89 | Phoenix Silver Knight | Garder | 1 | Miroir mêlée de Black Dog au même prix ; symétrie saine. |
| 90 | Owl New Guard | Garder | 1 | 2/2/2 à 850 $ : entrée de gamme Owl cohérente. |
| 91 | Byron King Worker VII | Garder | 1 | Antichoc 4 spécialisé travail ; niche claire. |
| 92 | Raven Gallowglass II légère | Rééquilibrer | 2 | 5/3/4 + Anti-EMP à 1 450 $ : meilleure affaire, écrase Black Dog. |
| 93 | Phoenix Skylord III | Simplifier | 2 | « thermique réactive en pugilat selon fiction » sans effet ; donner Réduction Feu 2. |
| 94 | Owl Night Guard | Simplifier | 2 | « faible signature » : traduire en Camo 1 nocturne ou supprimer. |
| 95 | Raven Gallowglass II lourde | Rééquilibrer | 2 | Bal. 9 annule pistolets et PM (DGT 7–11) : outlier défensif. |
| 96 | Phoenix Sun King | Rééquilibrer | 2 | +1/+1/+1 sur Skylord pour 3,4× le prix. |
| 97 | Owl Moon Guard | Rééquilibrer | 2 | +1 sur trois axes par rapport à Night Guard, pour 3× le prix. |
| 98 | BridgeElectrics No-Fire | Garder | 1 | Réduction 3 Feu/Électricité chiffrée ; tenue de métier utile. |
| 99 | Ocean Master Free Fly | Garder | 1 | +3 circonstanciel clair contre la désorientation. |
| 100 | Icecorps Santa Clothes | Garder | 1 | Réduction Froid et malus de finesse explicites. |
| 101 | BioSun MedicArmor | Garder | 1 | Étanchéité binaire, sans chiffres : acceptable. |
| 102 | Sunways Desert Survivor | Simplifier | 2 | Quatre fonctions en liste ; chiffrer la « signature thermique réduite » en Camo. |
| 103 | Seawares Scaph IV | Garder | 2 | Antichoc 6 sous l'eau, 4 ailleurs : seule exception, lisible. |
| 104 | ArcaNetwork Neuromaster | Garder | 1 | Réduction 3 Neuro sans Rang : bonne rédaction. |
| 105 | Byron Ghillie Basic | Garder | 1 | Camo 1 à 550 $ : entrée de gamme. |
| 106 | Raven Squid Skin | Rééquilibrer | 1 | Dominée par Dirty Sniper #107 (moins chère, plus protectrice, même Camo 2). |
| 107 | Phoenix Dirty Sniper | Garder | 1 | Camo 2 + 2/2 : référence, mais creuser l'écart avec #106. |
| 108 | Owl Zero Guard | Garder | 1 | Électro-trompeur défini par la règle ; propre. |
| 109 | ArcaNetwork Holo'Rmor V2 | Simplifier | 2 | Écrire « Holo-tissage (+2 Furtivité identité) » dans le profil plutôt que de renvoyer à la règle. |
| 110 | SBA Ninja | Garder | 1 | Camo 3, sommet du palier ; la limite radar est rappelée. |
| 111 | Renfort balistique | Rééquilibrer | 1 | 1 000 $ pour +1, contre 500/600 $ pour les autres renforts ; dit « Tir » au lieu de Balistique. |
| 112 | Renfort mêlée | Fusionner (avec #111/#113) | 1 | Module unique « Renfort [type] +1 ». |
| 113 | Renfort antichoc | Fusionner (avec #111/#112) | 1 | Troisième variante du même module « Renfort [type] ». |
| 114 | Plaques ablatives | Garder | 2 | Ablatif 2 conforme à la règle ; suivi des impacts acceptable. |
| 115 | Anti-EMP | Garder | 1 | Effet binaire et clair. |
| 116 | Anti-hack | Garder | 1 | +3 Défense Neuro ciblé ; clair. |
| 117 | Étanche | Garder | 1 | Effet binaire. |
| 118 | Respirateur | Garder | 1 | 2 h d'air ; simple. |
| 119 | Thermique | Fusionner (avec #120) | 1 | Module générique « Réduction 3 [type] ». |
| 120 | Électrique | Fusionner (avec #119) | 1 | Même module générique ; garder la nuance « ≠ Anti-EMP ». |
| 121 | Suite capteurs | Garder | 1 | +2 Perception à 1 250 $ ; condition claire. |
| 122 | Interface de ciblage | Réécrire | 2 | Aucun effet propre ; à intégrer à Smartlink ou à offrir sur les casques. |
| 123 | Exosquelette léger | Simplifier | 2 | « Exo 1 » n'est défini nulle part ; donner +2 Vigueur pour le portage. |
| 124 | Compensation mobilité | Simplifier | 1 | Les pénalités de mobilité des armures ne sont chiffrées nulle part. |
| 125 | Camo adaptatif | Garder | 1 | Camo 1 en module, interdiction de cumul : propre. |
| 126 | NavIA | Couper | 1 | Application gratuite purement lore : passer en tableau Holonet. |
| 127 | CeltX | Couper | 1 | Ligne de prix (75 $/an) sans mécanique. |
| 128 | Securio | Garder | 1 | Fixe une Difficulté 12–25 au canal : seule app mécanique avec Rampage X. |
| 129 | Shelov | Couper | 1 | App musicale Tuatha : lore pur. |
| 130 | BlackFlag | Couper | 1 | Réseau musical Neopunk : lore pur. |
| 131 | AllBrains | Couper | 1 | Doublon logiciel de l'Imprimante #151 et du Scanner 3D #152. |
| 132 | LadyDolla | Couper | 1 | App bancaire : lore pur. |
| 133 | Redwish | Couper | 1 | Réseau de rencontre : lore pur. |
| 134 | Boudicca | Couper | 1 | Marketplace : lore pur. |
| 135 | Call'infornia | Couper | 1 | Identité civique : encadré de lore avec la Puce de santé #157. |
| 136 | Vatican+ | Couper | 1 | Réseau chrétien : lore pur. |
| 137 | Islamaster | Couper | 1 | Réseau musulman : lore pur. |
| 138 | Rampage X | Réécrire | 2 | « +3 aux Intrusions hostiles contre le système » : ambigu (bonus pour l'utilisateur ou faille ?). |
| 139 | N-Sta | Garder | 2 | Pivot du Stress augmentique ; écrire « Maîtrise spirituelle » comme la règle. |
| 140 | Holophone | Garder | 1 | Objet de base ; y fusionner l'IA personnelle #158. |
| 141 | Hololentilles | Simplifier | 1 | « risques en usage intensif/hack » sans effet. |
| 142 | IDpass | Garder | 1 | Utile en infiltration, clair. |
| 143 | Byron Zippo | Couper | 1 | Briquet à 200 $ sans enjeu : ligne de tableau. |
| 144 | Projecteur holographique | Fusionner (avec #61/#145) | 1 | Kit DFL = projecteur + FaceCaster : une seule entrée. |
| 145 | FaceCaster DFL | Fusionner (avec #61) | 1 | Doublon exact de #61. |
| 146 | Essaim de microbots | Garder | 1 | Outil narratif sans bonus ; acceptable. |
| 147 | Drone civil | Simplifier | 2 | « selon modèle » : donner Structure 4, Défense 12, Pilotage autonome 4. |
| 148 | Serrure intelligente | Garder | 1 | Renvoie aux Difficultés de sécurité. |
| 149 | Relais Holonet portable | Garder | 1 | Fonction claire. |
| 150 | Scanner portable | Garder | 1 | Outil sans bonus ; recoupe le Scanner technique (aug. #140). |
| 151 | Imprimante polymère | Garder | 1 | Outil de fabrication. |
| 152 | Scanner 3D | Fusionner (avec #151) | 1 | Kit « Atelier de fabrication » unique. |
| 153 | Kit médical | Garder | 1 | Prérequis des Premiers soins ; essentiel. |
| 154 | Kit technique | Garder | 1 | Prérequis de la Réparation d'urgence ; essentiel. |
| 155 | Cyberconsole Neurodive | Garder | 1 | Alternative externe à l'implant, sans Rang ; bon garde-fou. |
| 156 | Kit hardline | Garder | 1 | Donne accès au +2 de connexion physique. |
| 157 | Puce de santé citoyenne | Couper | 1 | Lore civique ; encadré. |
| 158 | IA personnelle du Holophone | Fusionner (avec #140) | 1 | Incluse dans le Holophone, aucun bonus. |
| 159 | Pack domotique & robots domestiques | Couper | 1 | Inclus dans le logement ; lore. |
| 160 | Robot / drone de sécurité | Simplifier | 2 | Renvoie au bestiaire ; donner un profil Structure/Blindage minimal. |
| 161 | Récupération / sans-abri | Fusionner (table Tenues) | 1 | Ligne de prix (25 $) sans mécanique. |
| 162 | Provocante / rue | Fusionner (table Tenues) | 1 | « Code social » = ±3 circonstanciel déjà prévu par la règle. |
| 163 | Neopunk | Fusionner (table Tenues) | 1 | Ligne de prix (150 $). |
| 164 | Citoyen | Fusionner (table Tenues) | 1 | Ligne de prix (150 $). |
| 165 | Ouvrier | Fusionner (table Tenues) | 1 | Ligne de prix ; recoupe le King Worker #91. |
| 166 | Lingerie | Fusionner (table Tenues) | 1 | Ligne de prix (200 $). |
| 167 | Détective / rue | Fusionner (table Tenues) | 1 | « outils pratiques » flou ; ligne de prix. |
| 168 | Neurodiver | Fusionner (table Tenues) | 1 | Garder la nuance « ne remplace pas Neuromaster ». |
| 169 | Techfighter / biker | Fusionner (table Tenues) | 1 | Ligne de prix (250 $). |
| 170 | Meditech | Fusionner (table Tenues) | 1 | Ligne de prix (350 $). |
| 171 | Cadre | Fusionner (table Tenues) | 1 | Ligne de prix (500 $). |
| 172 | Grande lingerie | Fusionner (table Tenues) | 1 | Simple palier qualité de Lingerie #166. |
| 173 | Cyber expert | Fusionner (table Tenues) | 1 | Ligne de prix (600 $). |
| 174 | Haut cadre | Fusionner (table Tenues) | 1 | Palier haut de Cadre #171. |
| 175 | Ration / synthétique | Fusionner (table Repas) | 1 | Déjà couvert par le Train de vie Survie. |
| 176 | Mick&Go / alternative | Fusionner (table Repas) | 1 | Ligne de prix (5 $). |
| 177 | Mac'Yellow | Fusionner (table Repas) | 1 | Ligne de prix (10 $). |
| 178 | Famileat | Fusionner (table Repas) | 1 | Ligne de prix (20–30 $). |
| 179 | Artisan / bon restaurant | Fusionner (table Repas) | 1 | Ligne de prix (30–60 $). |
| 180 | Oldo' | Fusionner (table Repas) | 1 | Ligne de prix (100–150 $). |
| 181 | Luxe / vraie production | Fusionner (table Repas) | 1 | Ligne de prix (250 $+) ; recoupe le Train de vie Luxe. |
| 182 | Eau reconditionnée | Fusionner (table Boissons) | 1 | Effet vide, prix 1 $. |
| 183 | Soda | Fusionner (table Boissons) | 1 | Effet vide, prix 2–4 $. |
| 184 | Bière/fermentation d'algues | Fusionner (table Boissons) | 1 | Effet vide ; lore sympathique, à garder en tableau. |
| 185 | Alcool industriel | Fusionner (table Boissons) | 1 | Effet vide ; aucune règle d'ivresse liée. |
| 186 | Alcool traditionnel | Fusionner (table Boissons) | 1 | Effet vide ; palier luxe de #185. |
| 187 | Café synthétique | Fusionner (table Boissons) | 1 | Effet vide, 2–5 $. |
| 188 | Café clone/cellulaire | Fusionner (table Boissons) | 1 | Effet vide, palier intermédiaire. |
| 189 | Vrai café | Fusionner (table Boissons) | 1 | Effet vide ; marqueur de statut (30–100 $). |
| 190 | Kick | Garder | 1 | +2 Initiative, jamais de PA : borné, modèle de drogue. |
| 191 | Velvet | Simplifier | 2 | Décalage d'un cran de Stress : renvoi fin à l'échec narratif ; le −3 Initiative/Perception est clair. |
| 192 | Prism | Réécrire | 2 | Aucun effet chiffré ; « seulement si la scène le justifie ». |
| 193 | Redline | Réécrire | 2 | Ni bonus ni contrecoup chiffrés ; voir la réécriture en B7. |
| 194 | Bloom | Réécrire | 2 | Effet social non chiffré ; donner +3 Séduction/Empathie et −3 contre la manipulation. |
| 195 | Fleshfire | Réécrire | 2 | « effet dépendant de l'augmentation » : aucun effet jouable. |
| 196 | Dreamrush | Réécrire | 2 | Seul l'échec est décrit ; l'effet recherché est absent. |
| 197 | Crashware | Simplifier | 2 | +1 Stress augmentique clair ; « interaction dangereuse » avec Neurodive à chiffrer. |
| 198 | Flashmergencies | Garder | 1 | Urgences publiques ; ancrage d'univers utile. |
| 199 | CareForce Bronze | Fusionner (avec #200/#201) | 1 | Un seul « CareForce » à trois paliers. |
| 200 | CareForce Silver | Fusionner (avec #199/#201) | 1 | Lien utile au talent Crawler Assurance Silver, à garder dans la fusion. |
| 201 | CareForce Golden | Fusionner (avec #199/#200) | 1 | Palier premium (5 500 $/an). |
| 202 | Clinique courante | Fusionner (table Services) | 1 | Fourchette de prix sans mécanique. |
| 203 | Chirurgie / hospitalisation | Fusionner (table Services) | 1 | « selon gravité » : pas de lien avec la récupération de PV. |
| 204 | Black Clinic | Garder | 1 | Accroche narrative essentielle à la pose d'augmentations illégales. |
| 205 | Formation courte / adulte | Fusionner (table Services) | 1 | Aucun lien avec la progression de compétences. |
| 206 | Expertise technique/médicale | Fusionner (table Services) | 1 | Ligne de prix. |
| 207 | Réparation courante | Fusionner (table Services) | 1 | Ligne de prix. |
| 208 | Réparation lourde / augmentique | Fusionner (table Services) | 1 | À lier à l'entretien augmentique (Charges fixes). |
| 209 | Faux document / identité | Garder | 1 | Prix lié au contrôle : relier aux Difficultés 12–25. |
| 210 | Service juridique | Fusionner (table Services) | 1 | Ligne de prix. |
| 211 | Sécurité privée | Fusionner (table Services) | 1 | Renvoi au bestiaire pour les gardes. |
| 212 | Stockage / box / atelier | Fusionner (avec #231 Planques) | 1 | Recoupe « Pièce/box/squat discret ». |
| 213 | Média Holonet / réseaux | Fusionner (table Loisirs) | 1 | Effet vide. |
| 214 | Bar, club, sortie populaire | Fusionner (table Loisirs) | 1 | Effet vide ; déjà couvert par le Train de vie. |
| 215 | Concert, spectacle, sport | Fusionner (table Loisirs) | 1 | Effet vide. |
| 216 | Immersion / expérience premium | Fusionner (table Loisirs) | 1 | Effet vide ; pourrait renvoyer à Dreamrush. |
| 217 | Événement luxe / VIP | Fusionner (table Loisirs) | 1 | Effet vide. |
| 218 | Compagnie sociale courte | Fusionner (table Loisirs) | 1 | Effet vide. |
| 219 | Compagnie intime/prostitution légale | Fusionner (table Loisirs) | 1 | Effet vide ; ton à surveiller en tableau. |
| 220 | Squat / zone abandonnée | Fusionner (table Logements) | 1 | Ligne Sécurité 12 / prix ; le tableau d'accès existe déjà. |
| 221 | Dortoir ouvrier | Fusionner (table Logements) | 1 | Sécurité 12–15 ; ligne de tableau. |
| 222 | Vladic micro-logement | Fusionner (table Logements) | 1 | Variante Vladic : quatre entrées Vladic à regrouper. |
| 223 | Vladic studio | Fusionner (table Logements) | 1 | Regrouper avec #222/#225/#227. |
| 224 | Studio urbain ancien | Fusionner (table Logements) | 1 | Ligne de tableau. |
| 225 | Vladic familial | Fusionner (table Logements) | 1 | Regrouper avec la ligne Vladic. |
| 226 | Appartement connecté | Fusionner (table Logements) | 1 | Ligne de tableau (Sécurité 18). |
| 227 | Vladic grand/protégé | Fusionner (table Logements) | 1 | « pas de bonus de combat » : garde-fou inutile en tableau. |
| 228 | Résidence de cadre sécurisée | Fusionner (table Logements) | 1 | Ligne de tableau (Sécurité 18–21). |
| 229 | Penthouse / villa | Fusionner (table Logements) | 1 | Ligne de tableau (Sécurité 21+). |
| 230 | Cache improvisée | Fusionner (table Planques) | 1 | Sécurité 12 ; ligne de tableau. |
| 231 | Pièce/box/squat discret | Fusionner (table Planques) | 1 | Recoupe Stockage #212. |
| 232 | Studio/garage anonyme | Fusionner (table Planques) | 1 | Ligne de tableau. |
| 233 | Planque dédiée | Fusionner (table Planques) | 1 | Ligne de tableau. |
| 234 | Planque sécurisée | Fusionner (table Planques) | 1 | Ligne de tableau. |
| 235 | Réseau de planques premium | Fusionner (table Planques) | 1 | Ligne de tableau. |
| 236 | Métro / tram | Fusionner (table Transports) | 1 | Effet vide ; déjà absorbé par le Train de vie. |
| 237 | Pass métro/tram | Fusionner (table Transports) | 1 | Effet vide. |
| 238 | MAS - court trajet | Fusionner (table Transports) | 1 | Effet vide ; sigle MAS jamais expliqué. |
| 239 | MAS - trajet long urbain | Fusionner (table Transports) | 1 | Effet vide. |
| 240 | Bull Basic | Fusionner (table Transports) | 1 | Abonnement à quatre paliers Bull : une ligne. |
| 241 | Bull Standard | Fusionner (table Transports) | 1 | Palier Bull. |
| 242 | Bull Premium | Fusionner (table Transports) | 1 | Palier Bull. |
| 243 | Bull Executive | Fusionner (table Transports) | 1 | Palier Bull. |
| 244 | Pistolet léger / PM — Raven | Fusionner (table Munitions) | 1 | Tableau 6 × 3 ou multiplicateur de marque (Owl ×0,5, Phoenix ×1,6). |
| 245 | Pistolet léger / PM — Phoenix | Fusionner (table Munitions) | 1 | 80 $ = Raven ×1,6. |
| 246 | Pistolet léger / PM — Owl | Fusionner (table Munitions) | 1 | 30 $ = Raven ×0,6. |
| 247 | Pistolet lourd — Raven | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 248 | Pistolet lourd — Phoenix | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 249 | Pistolet lourd — Owl | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 250 | Mitraillette — Raven | Fusionner (table Munitions) | 1 | « Mitraillette » ici, mais « PM/SMG » dans les armes : terminologie à aligner. |
| 251 | Mitraillette — Phoenix | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 252 | Mitraillette — Owl | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 253 | Fusil d'assaut — Raven | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 254 | Fusil d'assaut — Phoenix | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 255 | Fusil d'assaut — Owl | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 256 | Précision — Raven | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 257 | Précision — Phoenix | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 258 | Précision — Owl | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 259 | Shotgun — Raven | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 260 | Shotgun — Phoenix | Fusionner (table Munitions) | 1 | Cellule de tableau. |
| 261 | Shotgun — Owl | Fusionner (table Munitions) | 1 | Cellule de tableau ; la taille du lot n'est jamais indiquée. |
| 262 | Black Arrow | Garder | 1 | Arc ou arbalète Perforant 1 Fiable ; lisible. |
| 263 | Nextar Championship | Simplifier | 1 | « dégâts liés à la Vigueur » absents du profil : donner la formule. |
| 264 | Byron Tethyssette | Simplifier | 1 | « Efficience minimale » indéfinie ; même rôle que Poseidon #12. |
| 265 | Flak Cannon — Prototype | Réécrire | 2 | « Incendiaire ; munitions universelles » indéfinis ; prototype sans profil. |
| 266 | Sheer BlueShell A. — Prototype | Réécrire | 2 | Drone-bombe programmable : relève du bestiaire ou des véhicules, pas d'une arme. |
| 267 | Charm — Prototype | Réécrire | 2 | Aucun profil ; effet selon un composé non nommé. |
| 268 | Armcannon — Prototype | Simplifier | 2 | « énergétique, faible autonomie » : préciser le nombre de tirs par cellule. |
| 269 | Raven-Sehdia Railway to Hell — Prototype | Fusionner (avec #296) | 2 | Deux railguns Raven-Sehdia (Perforant 4/5, 500/550 m) : redondants. |
| 270 | Phoenix Vader — Prototype | Réécrire | 2 | Portée « Spéciale » et « dissipation du faisceau » : injouables sur papier. |
| 271 | Raven Ravenegg | Fusionner (avec #76) | 1 | Grenade explosive EMP = Grenade EMP Doorbell. |
| 272 | Phoenix Inferno | Fusionner (gabarit Grenade + Feu) | 1 | Variante incendiaire du gabarit grenade. |
| 273 | Owl Dripper | Fusionner (gabarit Grenade + Chimique) | 1 | « acide » et « chimique » font doublon de mots-clés. |
| 274 | Phoenix Helios II | Fusionner (avec #77) | 1 | Grenade aveuglante = Flash Doorbell. |
| 275 | Owl Superchoc | Réécrire | 1 | « super choc » indéfini ; utiliser Choc + DGT. |
| 276 | Biosun Frog Egg | Simplifier | 2 | « adhésif ; thermosensible » : définir Entravé (−3 Agilité, 1 PA pour se libérer). |
| 277 | Byron Pokeball | Simplifier | 2 | « paralysant » = Électrique ; nom à risque (marque Nintendo). |
| 278 | Owl Vending Machine | Garder | 1 | Lance-grenades 1 coup universel ; clair. |
| 279 | Jagi | Simplifier | 1 | Défaillant et magnétique non définis ; grenade bon marché utile. |
| 280 | Shadow Gift | Simplifier | 2 | « mode bombe programmable » : préciser le délai et le PA d'armement. |
| 281 | Raven Bomberman | Simplifier | 1 | Verrou de marque « grenades Raven » ; nom à risque (marque de jeu vidéo). |
| 282 | Phoenix Easter Bunny | Fusionner (avec #281) | 1 | Lanceur 3 coups identique, verrouillé Phoenix. |
| 283 | Phoenix King Fist | Simplifier | 1 | « Choc » non défini dans la table des propriétés. |
| 284 | Byron Ginette | Garder | 1 | Masse Perforant 2 + Choc ; identité Byron claire. |
| 285 | Mary-Antoinette | Simplifier | 2 | Hydraulique et Lourd 1 indéfinis ; mention munitions parasite sur une arme de contact. |
| 286 | Pierrette | Fusionner (avec #285) | 2 | Deuxième outil hydraulique Byron ; un gabarit « Outil lourd » à modes. |
| 287 | Byron Melinette | Simplifier | 2 | Soudeur : préciser la réserve et la consommation par décharge. |
| 288 | Stretchy | Simplifier | 2 | Allonge variable et 4 décharges EMP à suivre ; fixer 2 m. |
| 289 | Sal-in | Simplifier | 2 | Défaillant + Dangereux non définis ; fusil d'assaut cheap pertinent. |
| 290 | Morissette | Fusionner (gabarit SMG) | 1 | SMG Smartlink = doublon d'Urban #32 et d'Equalizer #30. |
| 291 | Biosun Aciditicteeth | Réécrire | 3 | Cinq propriétés dont « bio-objet » et « régénératif » indéfinis. |
| 292 | Tortoise Blastard | Rééquilibrer | 2 | Rafale, Automatique, EMP, Perforant 1 et Choc : cinq propriétés cumulées. |
| 293 | Song-gos | Simplifier | 1 | Précision Perforant 2 cheap ; définir Défaillant/Dangereux. |
| 294 | Byron Luzette | Garder | 1 | Précision Smartlink + Perforant 1 ; lisible. |
| 295 | Abraham Kennedy | Réécrire | 2 | « Imprimable ; Aléatoire » : qualité aléatoire non chiffrée. |
| 296 | Raven-Sehdia Hellrails | Rééquilibrer | 2 | Perforant 5 + Infaillible + 550 m : ignore toute armure terrestre. |
| 297 | Biosun Pandemic | Fusionner (gabarit Injecteur) | 1 | Fusil hypodermique ; l'effet dépend de la seringue. |
| 298 | Sunways Savior DGR | Fusionner (gabarit Injecteur) | 1 | Variante longue portée du gabarit Injecteur. |
| 299 | Disease | Fusionner (gabarit Injecteur) | 1 | Pistolet hypodermique compact. |
| 300 | Raven-Sunways Savior DG | Fusionner (gabarit Injecteur) | 1 | Quasi-homonyme de #298. |
| 301 | Phoenix RedCrush | Simplifier | 2 | Trois rôles (hypodermique, chimique, lance-grenades) dans une arme : choisir. |
| 302 | Raven Painkiller | Fusionner (gabarit Injecteur) | 1 | « soin assisté » indéfini ; Fiable + Smartlink. |
| 303 | Sunways Hornetouch | Fusionner (gabarit Injecteur) | 1 | Injecteur de contact, 4 doses. |
| 304 | Biosun Blastard Injector | Fusionner (gabarit Injecteur) | 1 | Lame + 2 doses ; nom proche de Tortoise Blastard #292. |
| 305 | Bi | Fusionner (avec #308) | 1 | PM Défaillant cheap = Bibal. |
| 306 | SFU Nebullar | Simplifier | 1 | « Inaltérable » indéfini ; à ramener à Fiable. |
| 307 | Monarch Surge | Simplifier | 1 | « autociblage Connectés » : donner +2 contre une cible connectée. |
| 308 | Bibal | Fusionner (avec #305) | 1 | Doublon de Bi. |
| 309 | Byron Florette | Simplifier | 1 | Biosteel défini seulement dans le lore ; en faire un mot-clé. |
| 310 | Owl Apex | Simplifier | 1 | « précision fine ; recul réduit » sans effet ; 75 m suffit à le distinguer. |
| 311 | Byron Jeanette | Réécrire | 2 | « Double balle » et « détection de ciblage » sans règle. |
| 312 | Jotkka | Fusionner (avec #314) | 1 | Arme cheap Défaillante ; un seul gabarit « arme de rue ». |
| 313 | Raven-Sehdia Pacificateur X | Rééquilibrer | 2 | Pistolet Infaillible + EMP : outlier de la catégorie. |
| 314 | Eolgul-e | Fusionner (avec #312) | 1 | Arme de poche Défaillante. |
| 315 | Phoenix Sunnyroshima | Réécrire | 2 | Nom évoquant Hiroshima ; « nuage ardent » non défini. |
| 316 | Reminiscer — Prototype | Réécrire | 2 | « Munitions noires » programmables, sans effet décrit. |
| 317 | Oblivion — Prototype | Réécrire | 2 | « Neurochoc » sans règle ; relier aux PV neuraux. |
| 318 | Zeus — Prototype | Simplifier | 2 | Modulaire « sans cumuler tous les avantages » : lister 2 ou 3 modes. |
| 319 | Dracula — Prototype | Réécrire | 2 | « Bloody shock » dépend de l'anatomie : non jouable. |
| 320 | Owl K OwlClaws | Fusionner (avec #1) | 1 | Couteau de base Owl, propriétés « — ». |
| 321 | Raven K Blaclaws | Fusionner (avec #1) | 1 | Couteau de base Raven, propriétés « — ». |
| 322 | Owl K Resonancer | Simplifier | 1 | « Vibratoire » à définir (Perforant 1 progressif ?). |
| 323 | Raven K Hellthorn | Simplifier | 1 | « Photoedge » indéfini ; probablement Perforant 2. |
| 324 | Phoenix K SunBeak | Fusionner (avec #1) | 1 | Couteau Robuste = Fiable. |
| 325 | Raven KB Karas | Simplifier | 1 | « Visée intégrée » sur un katana : à remplacer par +1 en mêlée. |
| 326 | K Golijagi | Garder | 1 | Biosteel indétectable : niche d'infiltration claire. |
| 327 | Owl SB Nextcalibur | Garder | 1 | Biosteel + Pliant : épée dissimulable. |
| 328 | Phoenix SB Khopesh | Simplifier | 1 | « Irradiant » + Photoedge : deux mots-clés non définis. |
| 329 | Hache circulaire Owl | Simplifier | 2 | « Dual mode (E) » indéfini ; mention munitions parasite. |
| 330 | Insurrection SP New Partisan | Garder | 1 | Arme imprimée rétractable, efficacité constante : élégant. |
| 331 | D-Fence | Fusionner (avec #333/#336) | 1 | Palier I du programme « Pare-feu » (+1). |
| 332 | Shieldic | Fusionner (avec #335) | 1 | Variante Épines I (1 PV neural). |
| 333 | MyWall | Fusionner (avec #331/#336) | 1 | Palier II (+2). |
| 334 | 2-Fence | Simplifier | 2 | +1 et 2 Interceptions à suivre : compteur supplémentaire. |
| 335 | Omnithorns | Fusionner (avec #332) | 1 | Épines II (2 PV neuraux). |
| 336 | Castland | Fusionner (avec #331/#333) | 1 | Palier III (+3). |
| 337 | Datablast | Garder | 1 | DGT = marge, bonus à marge 6+ : simple. |
| 338 | Dark Holes | Fusionner (avec #340) | 1 | Marge +1 PV, comme Langoliers. |
| 339 | Darksword | Garder | 2 | Intrusion gratuite à marge 6+ ; 1/round borné. |
| 340 | Langoliers | Fusionner (avec #338) | 1 | Marge +1 + extraction de données. |
| 341 | Calamities Reign | Garder | 1 | Risque/récompense lisible (+3 / +3 contre soi). |
| 342 | Darkalibur | Garder | 1 | Deux cibles, jamais la même : clair. |
| 343 | OverLoad IV | Simplifier | 2 | Trois effets en chaîne « selon marge » : donner des seuils. |
| 344 | King Crash | Garder | 1 | Déconnexion forcée ; le Stress à forte marge reste à chiffrer. |
| 345 | Ace-BurnX | Garder | 2 | Pont propre vers le Stress augmentique, plafonné à +3. |
| 346 | Zero K | Garder | 1 | Contre de King Crash ; symétrie saine. |
| 347 | Icewall | Garder | 1 | Protection d'un allié ; fonction de soutien claire. |
| 348 | Data-Shield | Fusionner (avec #353) | 1 | Déjà déclaré non cumulable avec Sutr. |
| 349 | Stealthy Timmy | Garder | 1 | Effacement de traces, seuil 6+. |
| 350 | Jorgmunworm | Garder | 1 | +2 Intrusion sec ; le plus simple de tous. |
| 351 | Nanaruto | Simplifier | 1 | Change la formule de Défense contre IA : à préciser. |
| 352 | Swampro | Garder | 1 | −2 aux actions hostiles ; environnemental. |
| 353 | Sutr | Fusionner (avec #348) | 1 | +1 niveau de sécurité, expulsion sur échec narratif. |
| 354 | Neurald | Garder | 1 | Tâche de fond sans PA : bon garde-fou. |
| 355 | Sicarius | Garder | 1 | Durée selon DR : table claire. |
| 356 | Groundswell | Rééquilibrer | 1 | +2 offensif « pour tous » : profite aussi aux ennemis ? À préciser. |
| 357 | Duppli'cat | Garder | 2 | Copie + bonus futur détectable : bon compromis. |
| 358 | Moto moderne | Simplifier | 2 | Aucune Structure ni Blindage affichés ; la règle donne 8, à reporter. |
| 359 | Vieille voiture manuelle | Simplifier | 2 | Sécurité réseau « — » à afficher ; Structure 15. |
| 360 | CityPod Bullmotors | Simplifier | 2 | « facile à hacker » : donner Sécurité réseau 12. |
| 361 | VAP familial | Simplifier | 2 | Profil vide ; donner Pilotage autonome et Structure. |
| 362 | Horntruck | Simplifier | 2 | Utilitaire : Structure 20 à afficher. |
| 363 | Gundriver modifié | Simplifier | 2 | Manuel, sans propulsion piratable : l'indiquer. |
| 364 | Nymphrover Executive | Simplifier | 2 | « sécurité supérieure » à chiffrer (Sécurité 21). |
| 365 | Nymphrover Security | Simplifier | 2 | Blindé léger : Structure 25 et Blindage à afficher. |
| 366 | Tactical Rover | Simplifier | 2 | Aucune valeur affichée. |
| 367 | APC léger | Simplifier | 2 | Structure 35 et « blindage lourd » à chiffrer. |

### C2. Augmentations (`entries-Réalité_augmentations.txt`, 146 entrées)

Convention : dans chaque paire homonyme, la 1re entrée est la Gen1 (bonus fort) et la 2e la Gen2, d'après le motif +3/+2.

| # | Nom | Verdict | Poids | Note |
|---|---|---|---|---|
| 1 | Teinte dermique modulable | Fusionner (avec #101 Pigmentation, table Cosmétiques) | 1 | Couleur de peau variable ; aucun effet mécanique. |
| 2 | Lentilles polychromes | Fusionner (table Cosmétiques) | 1 | Iris variable ; cosmétique pur. |
| 3 | Tatouage lumineux | Fusionner (avec #97/#5, table Cosmétiques) | 1 | Trois entrées de tatouage ou décor dermique. |
| 4 | Cheveux artificiels | Fusionner (avec #98, table Cosmétiques) | 1 | Doublon cyber de Croissance capillaire. |
| 5 | Maillage dermique décoratif | Fusionner (avec #3, table Cosmétiques) | 1 | Décor sous-cutané. |
| 6 | Montre sous-cutanée | Fusionner (table Cosmétiques) | 1 | Gadget d'affichage sans enjeu. |
| 7 | Implants mammaires modulaires | Fusionner (table Cosmétiques) | 1 | La règle Esthétique interdit tout bonus de Charisme : simple ligne. |
| 8 | Implant sexuel | Fusionner (avec #127) | 1 | Doublon cyber d'Organes reproducteurs. |
| 9 | Implant contraceptif | Fusionner (table Cosmétiques) | 1 | Ligne de lore. |
| 10 | SynthéDerm de couverture | Garder | 1 | Masque une Gen2 : utile en infiltration, règle claire. |
| 11 | Radio intégrée | Fusionner (table Modules CyberAudio) | 1 | Module de confort ; requiert CyberAudio. |
| 12 | Câblage neuronal | Fusionner (avec #13) | 1 | Support 2 Slots : écrire « Gen1 2 / Gen2 4 Slots » dans une entrée. |
| 13 | Câblage neuronal | Fusionner (avec #12) | 1 | Variante Gen2 à 4 Slots ; nom identique. |
| 14 | Analyseur chimique | Fusionner (avec #15) | 1 | +3 circonstanciel (Gen1). |
| 15 | Analyseur chimique | Fusionner (avec #14) | 1 | +2 (Gen2) ; suit le motif standard. |
| 16 | Bloqueur de douleur | Fusionner (avec #17) | 2 | −2 états de blessure : très fort, Stress non affiché. |
| 17 | Bloqueur de douleur | Fusionner (avec #16) | 2 | −1 état ; quel « état » ? Renvoyer aux seuils de blessure. |
| 18 | Booster d'adrénaline | Rééquilibrer | 2 | Seule source de PA de la famille ; texte Gen1+Gen2 recopié dans les deux entrées. |
| 19 | Booster d'adrénaline | Fusionner (avec #18) | 2 | Même texte que #18 ; seule la ligne Mécanique diffère. |
| 20 | Ports d'interface | Fusionner (avec #21) | 1 | Identique à #21 ; +2 au système câblé. |
| 21 | Ports d'interface | Fusionner (avec #20) | 1 | Doublon strict. |
| 22 | Défense électronique | Fusionner (avec #23) | 1 | Texte Gen1/Gen2 complet en double ; +2 Défense Neuro. |
| 23 | Défense électronique | Fusionner (avec #22) | 1 | +1 Défense Neuro, 1 Slot. |
| 24 | Système d'orientation | Garder | 1 | Navigation intégrée sans bonus ; acceptable. |
| 25 | Processeur mathématique | Simplifier | 1 | « +2 spécialisé » : nommer la compétence (Savoirs ? Mécanique ?). |
| 26 | Enregistreur neural | Garder | 1 | Fonction narrative claire. |
| 27 | CyberŒil | Fusionner (avec #28) | 1 | Support 2 Slots (Gen1). |
| 28 | CyberŒil | Fusionner (avec #27) | 1 | Support 3 Slots (Gen2). |
| 29 | Détecteur de radiation | Fusionner (avec #30) | 1 | +3 circonstanciel ; niche étroite. |
| 30 | Détecteur de radiation | Fusionner (avec #29) | 1 | +2 Gen2. |
| 31 | Dispositif de visée | Réécrire | 2 | +3 Tir Smartgun non cumulable avec Viser ni Verrouillage : chaîne de ciblage confuse. |
| 32 | Dispositif de visée | Fusionner (avec #31) | 2 | +2 Gen2 ; mêmes problèmes de cumul. |
| 33 | Zoom optique | Fusionner (avec #34 et Optique de précision éq. #57) | 1 | ×4, +3 distant ; recoupe l'Optique de précision. |
| 34 | Zoom optique | Fusionner (avec #33) | 1 | ×2, +2. |
| 35 | Anti-éblouissement | Garder | 1 | Contre direct d'Aveuglant/Flash : utile et clair. |
| 36 | Caméra intégrée | Fusionner (avec #37) | 1 | « enregistrement » contre « enregistrement intégré » : aucune différence. |
| 37 | Caméra intégrée | Fusionner (avec #36) | 1 | Doublon. |
| 38 | Réalité augmentée / Holonet | Garder | 1 | Remplace les Hololentilles ; clair. |
| 39 | UV / Infrarouge | Fusionner (avec #40) | 1 | 30 m, +3. |
| 40 | UV / Infrarouge | Fusionner (avec #39) | 1 | 15 m, +2 ; recoupe Spectre visuel bio #108. |
| 41 | Lampes oculaires | Fusionner (avec #42) | 1 | 30 m ; aucun intérêt à un double. |
| 42 | Lampes oculaires | Fusionner (avec #41) | 1 | 15 m. |
| 43 | CyberAudio | Fusionner (avec #44) | 1 | Support 2 Slots. |
| 44 | CyberAudio | Fusionner (avec #43) | 1 | Support 4 Slots. |
| 45 | Amplificateur interne | Fusionner (avec #46) | 1 | ×4, +3 ; recoupe Ouïe améliorée #104. |
| 46 | Amplificateur interne | Fusionner (avec #45) | 1 | ×2, +2. |
| 47 | Analyseur de stress vocal | Garder | 1 | +2 Perception, et ce n'est pas un détecteur de mensonge : bon garde-fou. |
| 48 | Brouilleur / Décrypteur | Fusionner (avec #49) | 1 | « +3 spécialisé » : préciser la compétence (Neurodive ?). |
| 49 | Brouilleur / Décrypteur | Fusionner (avec #48) | 1 | +2 Gen2. |
| 50 | Détecteur écholocation | Fusionner (avec #135) | 1 | Requis par Implant radar/sonar ; les deux vont ensemble. |
| 51 | Enregistreur audio | Fusionner (avec #52) | 1 | Aucune différence affichée entre les Gen. |
| 52 | Enregistreur audio | Fusionner (avec #51) | 1 | Doublon. |
| 53 | Filtrage audio | Fusionner (avec #54) | 1 | +3 circonstanciel. |
| 54 | Filtrage audio | Fusionner (avec #53) | 1 | +2. |
| 55 | Spectre auditif étendu | Fusionner (avec #107) | 1 | Doublon cyber de Spectre auditif bio. |
| 56 | Traducteur | Fusionner (avec #57) | 1 | +3 spécialisé ; garde-fou Langages & Argot pertinent. |
| 57 | Traducteur | Fusionner (avec #56) | 1 | +2, argots inclus : la Gen2 couvre plus que la Gen1, ce qui est incohérent. |
| 58 | Protection auditive | Garder | 1 | Contre des grenades sonores ; binaire. |
| 59 | Stabilité gyroscopique | Simplifier | 1 | « équilibre amélioré » : donner +2 Athlétisme (équilibre). |
| 60 | Anticorps robotiques | Fusionner (avec #116) | 1 | Doublon cyber du Système immunitaire amplifié (+3). |
| 61 | Audiovox | Fusionner (avec #62 et #106) | 2 | « attaque sonique selon profil » : aucun profil. |
| 62 | Audiovox | Fusionner (avec #61) | 2 | Texte identique à #61. |
| 63 | Filtre à toxines | Fusionner (avec #66/#109) | 1 | Toxines ingérées ; trois implants anti-toxines. |
| 64 | Maillage squelettique | Fusionner (avec #65) | 2 | Protection 2 Antichoc, Charge 2, Stress 3 : seule entrée qui chiffre tout. |
| 65 | Maillage squelettique | Fusionner (avec #64) | 2 | Protection 1, Stress 1 ; cumulable avec l'Armure dermique ? À préciser. |
| 66 | Poumon cybernétique | Fusionner (avec #63/#109) | 1 | Toxines respiratoires. |
| 67 | Branchies cybernétiques | Fusionner (avec #110) | 1 | Doublon cyber des Branchies bio. |
| 68 | Poche dermique | Garder | 1 | Dimensions précises ; utile en contrebande. |
| 69 | Armure dermique | Rééquilibrer | 2 | Armure corporelle 2 cumulable avec l'armure portée : renforce l'outlier Gallowglass. |
| 70 | Armure dermique | Fusionner (avec #69) | 2 | Armure 1, Charge 1, Stress 1. |
| 71 | Camouflage dermique | Garder | 1 | Camo 1 visuel, exclusivité de peau réglée par la règle. |
| 72 | Système magnétique | Simplifier | 1 | « facilite l'escalade » : donner +2 Athlétisme sur métal (cf. Main Gecko). |
| 73 | Cyberbras | Fusionner (avec #74) | 2 | Gen1/Gen2 identiques dans l'extrait ; Slots non indiqués. |
| 74 | Cyberbras | Fusionner (avec #73) | 2 | Doublon ; préciser Slots et Charge. |
| 75 | Cyberjambe | Fusionner (avec #76) | 2 | Même problème que le Cyberbras. |
| 76 | Cyberjambe | Fusionner (avec #75) | 2 | Doublon. |
| 77 | Pistolet intégré | Fusionner (avec #78) | 1 | Renvoie au profil du modèle : préciser « pistolet de poche ou léger ». |
| 78 | Pistolet intégré | Fusionner (avec #77) | 1 | Doublon. |
| 79 | Lame cachée | Fusionner (avec #80) | 1 | Aucun DGT affiché. |
| 80 | Lame cachée | Fusionner (avec #79) | 1 | Doublon. |
| 81 | Griffes / ongles | Fusionner (avec #82 et #129) | 1 | Aucun DGT ; doublon de la Bioarme griffes. |
| 82 | Griffes / ongles | Fusionner (avec #81) | 1 | Doublon. |
| 83 | Poings renforcés | Fusionner (avec #84) | 1 | « DGT augmenté selon module » : aucun chiffre. |
| 84 | Poings renforcés | Fusionner (avec #83) | 1 | Doublon. |
| 85 | Grappin | Fusionner (avec #86) | 1 | Portée non donnée. |
| 86 | Grappin | Fusionner (avec #85) | 1 | Doublon. |
| 87 | Doigts-outils | Garder | 1 | Remplace le Kit technique ou médical : préciser l'équivalence. |
| 88 | Scanner Meditech | Garder | 1 | Diagnostic intégré ; donner +2 Soin pour aligner sur le Scanner technique #140. |
| 89 | Jambes renforcées | Fusionner (avec #90) | 1 | « aide à courir/sauter » : donner +2/+3 Athlétisme. |
| 90 | Jambes renforcées | Fusionner (avec #89) | 1 | Doublon. |
| 91 | Palmes cybernétiques | Fusionner (avec #92 et #114) | 1 | Doublon cyber des mains/pieds palmés. |
| 92 | Palmes cybernétiques | Fusionner (avec #91) | 1 | Doublon. |
| 93 | Câble monofilament | Simplifier | 2 | Arme sans profil (DGT, Perforant). |
| 94 | Support de membres surnuméraires | Garder | 2 | Ancrages sans PA gratuits : règle Cyborg lourd claire. |
| 95 | Support multioptique | Fusionner (avec #96) | 1 | Même logique « support surnuméraire ». |
| 96 | Support multisenseur | Fusionner (avec #95) | 1 | Un seul « Support sensoriel surnuméraire ». |
| 97 | Bio tatouage | Fusionner (avec #3) | 1 | Cosmétique bio = Tatouage lumineux. |
| 98 | Croissance capillaire | Fusionner (avec #4) | 1 | Cosmétique. |
| 99 | Métabolisme propre | Simplifier | 1 | Utile contre le pistage olfactif : donner −3 aux traqueurs à l'odeur. |
| 100 | Photosynthèse | Fusionner (table Confort bio) | 1 | « support métabolique partiel » : réduit le coût du Train de vie ? |
| 101 | Pigmentation dermique | Fusionner (avec #1) | 1 | Doublon bio de la Teinte dermique. |
| 102 | Yeux parfaits | Fusionner (table Confort bio) | 1 | Restaure la vision humaine : aucun bonus. |
| 103 | Réalignement spinal | Garder | 1 | +1 Athlétisme permanent, chiffré ; prix et Stress à afficher. |
| 104 | Ouïe améliorée | Fusionner (avec #45) | 1 | Doublon bio de l'Amplificateur. |
| 105 | Articulations élastiques | Simplifier | 1 | « Souplesse » : donner +2 pour se libérer ou se contorsionner. |
| 106 | Spectre vocal | Fusionner (avec #61) | 1 | Doublon bio de l'Audiovox. |
| 107 | Spectre auditif | Fusionner (avec #55) | 1 | Doublon bio. |
| 108 | Spectre visuel | Fusionner (avec #39) | 1 | Doublon bio d'UV/Infrarouge. |
| 109 | Rein amélioré | Fusionner (avec #63/#66) | 1 | +2 Constitution contre les toxines : le seul des trois qui soit chiffré. |
| 110 | Branchies | Fusionner (avec #67) | 1 | Doublon. |
| 111 | Glandes chimiques | Réécrire | 2 | « production biologique préparée » : quoi, combien, quel effet ? |
| 112 | Membrane oculaire | Fusionner (avec #35) | 1 | Doublon bio de l'Anti-éblouissement. |
| 113 | Phéromones optimisées | Simplifier | 1 | « effets sociaux quand pertinent » : donner +2 Séduction à courte portée. |
| 114 | Mains/pieds palmés | Fusionner (avec #91) | 1 | Doublon. |
| 115 | Sensibilité tactile | Simplifier | 1 | « Tactile » : donner +2 crochetage ou fouille au toucher. |
| 116 | Système immunitaire amplifié | Garder | 1 | +3 contre les maladies, chiffré ; absorbe #60. |
| 117 | Volume respiratoire étendu | Simplifier | 1 | Préciser l'apnée (×2 durée). |
| 118 | Digestion efficace | Fusionner (table Confort bio) | 1 | Aucun effet. |
| 119 | Injection hormonale | Fusionner (table Confort bio) | 1 | Aucun effet. |
| 120 | Régénération passive | Garder | 1 | Récupération ×2 hors combat : bien borné. |
| 121 | Peau de cuir | Fusionner (avec #69/#70) | 1 | Armure naturelle 1 = Armure dermique Gen2 bio. |
| 122 | Électrochoc | Fusionner (avec #128) | 1 | Doublon interne bio de la Bioarme décharge électrique. |
| 123 | Isolation électrique | Simplifier | 1 | « Protection [Électricité] » : chiffrer (Réduction 3). |
| 124 | Mémoire amplifiée | Simplifier | 1 | Donner +2 Savoirs (rappel) ou rien. |
| 125 | Temps de réaction surhumain | Garder | 1 | +2 Initiative, jamais de PA : bon garde-fou. |
| 126 | Bioware membre | Garder | 1 | Remplacement sans bonus, conforme à la règle Biogénétique. |
| 127 | Organes reproducteurs | Fusionner (avec #8) | 1 | Doublon bio de l'Implant sexuel. |
| 128 | Bioarme - décharge électrique | Fusionner (avec #122) | 1 | Aucun DGT affiché ; doublon. |
| 129 | Bioarme - griffes | Fusionner (avec #81) | 1 | Aucun DGT affiché. |
| 130 | Bioarme - crocs | Simplifier | 1 | Aucun DGT ; donner DGT 3 Pugilat. |
| 131 | Bioarme - épines | Simplifier | 1 | « Arme/protection » : choisir (Épines = 1 DGT à l'agresseur au contact ?). |
| 132 | Glande à venin | Fusionner (avec #111) | 2 | « profil dépend du venin » ; relier à la munition Owl Venom. |
| 133 | Booster sensoriel | Fusionner (avec #134) | 1 | +3 Perception sur stimuli brefs : texte clair et borné. |
| 134 | Booster sensoriel | Fusionner (avec #133) | 1 | +2 Gen2 ; le nom n'indique pas « Gen 2 », seul le texte le dit. |
| 135 | Implant radar/sonar | Simplifier | 2 | Texte clair, mais le profil répète trois fois les mêmes limites. |
| 136 | Estomac blindé | Simplifier | 2 | Trois fois « pas contre les poisons » dans la même entrée ; niche minuscule. |
| 137 | Autoinjecteur | Garder | 1 | 3 doses, 1/round sans manipulation : bonne synergie avec les drogues. |
| 138 | Cybermain | Fusionner (avec #139) | 1 | 1 Slot (Gen1). |
| 139 | Cybermain | Fusionner (avec #138) | 1 | 2 Slots + SynthéDerm (Gen2). |
| 140 | Scanner technique | Garder | 1 | +2 Mécanique pour diagnostiquer : modèle d'écriture. |
| 141 | Main Gecko | Garder | 1 | +2 Athlétisme sous condition claire. |
| 142 | Cyberpied | Fusionner (avec #143) | 1 | 1 Slot (Gen1). |
| 143 | Cyberpied | Fusionner (avec #142) | 1 | 2 Slots discret (Gen2). |
| 144 | Ergot / Griffes de pied | Fusionner (avec #145) | 1 | DGT 4 Pugilat : chiffré. |
| 145 | Ergot / Griffes de pied | Fusionner (avec #144) | 1 | DGT 2 rétractable ; le seul cas où la Gen2 est plus discrète et plus faible. |
| 146 | Pied Gecko | Garder | 1 | +2 Athlétisme, limite du mur vertical bien posée. |

### C3. Règles — Augmentations (16 sections)

| # | Section | Verdict | Poids | Note |
|---|---|---|---|---|
| R-A1 | Intégrité, Charge et Stress | Simplifier | 3 | Deux plafonds tirés de quatre valeurs ; « Humanité » non défini ici. |
| R-A2 | Saturation, dépassement et Difficulté de Maîtrise | Garder | 1 | Table 15/18/21/25 alignée sur le socle. |
| R-A3 | Frénésie augmentique | Garder | 1 | 1 PA vers l'impulsion, −3 au calme, sortie à 15/12 : léger. |
| R-A4 | N-Sta | Garder | 1 | −1 Stress, +2 Maîtrise : clair. |
| R-A5 | Support et module | Garder | 2 | Slots par Support : logique, à mettre en schéma de fiche. |
| R-A6 | NeuroWare | Garder | 1 | « Port ≠ Rang » : garde-fou utile. |
| R-A7 | CyberOptique | Simplifier | 1 | « deux yeux = deux supports, pas de cumul » : une phrase suffit. |
| R-A8 | Ciblage et Zoom | Réécrire | 2 | Règles de cumul différentes de celles de l'Économie (Viser + Verrouillage) : à unifier. |
| R-A9 | CyberAudio | Fusionner (avec R-A7) | 1 | Même règle « pas de cumul de doublons ». |
| R-A10 | Implants internes | Garder | 1 | Pas de Slots, un organe : simple. |
| R-A11 | Transformations dermiques | Garder | 1 | Une seule peau principale : tranche les cumuls. |
| R-A12 | Membres cybernétiques | Garder | 1 | Aucun bonus gratuit, arme intégrée toujours prête : bien. |
| R-A13 | Cyborg lourd | Garder | 1 | Jamais de PA gratuits : garde-fou indispensable. |
| R-A14 | Biogénétique terrestre | Simplifier | 2 | Les principes « tend vers 0 » doivent devenir des valeurs fixes dans les entrées. |
| R-A15 | Esthétique et Charisme | Garder | 1 | Aucun bonus de Charisme automatique : sain. |
| R-A16 | Lecture des trois familles | Garder | 1 | Synthèse Gen1/Gen2/Bio qui doit devenir les colonnes des entrées. |

### C4. Règles — Économie & équipement (29 sections)

| # | Section | Verdict | Poids | Note |
|---|---|---|---|---|
| R-E1 | Économie et pouvoir d'achat | Garder | 1 | Compte, Train de vie et Charges : triptyque clair. |
| R-E2 | Lecture intuitive des montants | Garder | 1 | Excellente aide MJ, à imprimer. |
| R-E3 | Revenus mensuels indicatifs | Garder | 1 | Table de référence utile. |
| R-E4 | Prix, disponibilité et marché | Garder | 1 | Multiplicateurs simples. |
| R-E5 | Train de vie | Garder | 1 | Six crans lisibles. |
| R-E6 | Charges fixes | Simplifier | 2 | « tranches complètes de la référence de base » : l'exemple est indispensable. |
| R-E7 | Accès typique par Train de vie | Garder | 1 | Remplace avantageusement les entrées Logement et Transports. |
| R-E8 | Compte, achats et dotations | Garder | 1 | Frontière Compte / Train de vie claire. |
| R-E9 | Logements, planques et sécurité | Garder | 1 | Trois axes Discrétion / Isolement / Sécurité : élégant. |
| R-E10 | Services et consommables | Garder | 1 | « pas de bonus abstrait » : garde-fou utile. |
| R-E11 | Crédit et économie Crawler | Garder | 1 | Primes de contrat : très utile au MJ. |
| R-E12 | Frontière économique avec Vérité | Garder | 1 | Pas de conversion Dykal ↔ $ : simple. |
| R-E13 | Règles communes (équipement) | Garder | 1 | Pas de cumul de bonus identiques : bon principe. |
| R-E14 | Propriétés d'armes | Réécrire | 2 | 10 définies pour ~90 utilisées ; ni Rafale ni Suppression ne chiffrent les cartouches. |
| R-E15 | Portée et Verrouillage | Simplifier | 2 | Table claire ; le cumul Viser + Verrouillage contredit R-A8. |
| R-E16 | Armure de base et Réductions | Réécrire | 2 | Modèle Armure + Réduction non suivi par les profils Bal/Mel/Ant. |
| R-E17 | Ablatif | Simplifier | 1 | Les gilets écrivent l'Ablatif autrement que la règle. |
| R-E18 | Camo et tromperie électronique | Garder | 1 | Paliers 1/2/3 exemplaires. |
| R-E19 | Holo-tissage et Deep Fake Live | Garder | 1 | Bornes claires (pas de voix, pas d'ADN). |
| R-E20 | Capacité de personnalisation des armures | Simplifier | 1 | Les entrées n'indiquent pas leur catégorie (légère, lourde…). |
| R-E21 | Le moteur véhicule | Garder | 1 | Pas de sous-système : excellent choix. |
| R-E22 | Structure, Blindage et Altérations | Garder | 1 | Pas d'explosion automatique ; Altérations ciblées. |
| R-E23 | Défense et conduite | Garder | 1 | Défense de pilotage et absence de PA propres : simple. |
| R-E24 | Poursuites | Garder | 1 | Tests opposés sans jauge : léger. |
| R-E25 | Tir et occupants | Garder | 2 | Ordre Blindage → Armure perso clair ; schéma utile. |
| R-E26 | Collisions | Garder | 1 | Quatre paliers de DGT. |
| R-E27 | Neurodive et véhicules | Garder | 1 | Neurodive ne remplace pas Pilotage : bonne frontière. |
| R-E28 | Réparation | Garder | 1 | 15, 1 + DR Structure, une seule fois par avarie : jouable. |
| R-E29 | Longue distance | Couper | 1 | Lore pur ; à mettre dans le chapitre Univers. |

---

## D. Comptage

| Fichier | Entrées dans le fichier | Lignes dans ce rapport |
|---|---|---|
| entries-Réalité_équipement.txt | 367 (#1–#367) | 367 |
| entries-Réalité_augmentations.txt | 146 (#1–#146) | 146 |
| Règles › Augmentations (2 articles) | 16 sections | 16 |
| Règles › Économie & équipement (3 articles) | 29 sections | 29 |

**Répartition des verdicts**

| Verdict | Équipement | Augmentations | Règles Augm. | Règles Éco. | Total |
|---|---|---|---|---|---|
| Garder | 88 | 21 | 11 | 22 | 142 |
| Simplifier | 65 | 15 | 3 | 4 | 87 |
| Fusionner | 155 | 106 | 1 | 0 | 262 |
| Réécrire | 24 | 2 | 1 | 2 | 29 |
| Rééquilibrer | 21 | 2 | 0 | 0 | 23 |
| Couper | 14 | 0 | 0 | 1 | 15 |
| **Total** | **367** | **146** | **16** | **29** | **558** |

Effet de volume estimé si les fusions sont appliquées : environ 367 → 130 fiches d'équipement plus 8 tableaux (Tenues, Repas, Boissons, Services, Loisirs, Logements/Planques, Transports, Munitions), et 146 → environ 55 fiches d'augmentations avec colonnes Gen1/Gen2/Bio, plus 2 tableaux (Cosmétiques, Confort bio).
