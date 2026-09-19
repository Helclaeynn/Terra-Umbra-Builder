// Generated from the final V1 Builder runtime audit. Do not hand-edit.
export const truthCatalogVampire = [
  {
    "id": "faveur_de_la_nuit",
    "name": "Faveur de la nuit",
    "group": "Vampire — commun",
    "cost": 1,
    "access": "R — passif",
    "effect": "+3 Furtivité dans les ombres ou l’obscurité. Effacement prédateur autorise certaines tentatives ; Faveur de la nuit rend le Vampire meilleur à ces tentatives.",
    "runtimeLore": "L’ombre accepte le Vampire avec une facilité prédatrice. Silhouette, mouvement et respiration se fondent mieux dans l’obscurité, non parce qu’il devient invisible mais parce que la nuit paraît naturellement cacher ce qui chasse en elle."
  },
  {
    "id": "sens_du_chasseur",
    "name": "Sens du chasseur",
    "group": "Vampire — commun",
    "cost": 1,
    "access": "R — passif",
    "effect": "+3 Perception pour repérer, poursuivre ou retrouver une créature vivante ou blessée. Ne remplace pas les pouvoirs d’analyse du Sang Traqueur.",
    "runtimeLore": "Blessure, chaleur, odeur et comportement de fuite composent pour le Vampire une piste instinctive. Ce sens ne lui explique pas l’anatomie de sa proie ; il lui dit où chercher lorsqu’un être vivant tente de disparaître."
  },
  {
    "id": "regeneration_de_sang",
    "name": "Régénération de sang",
    "group": "Vampire — commun",
    "cost": 1,
    "access": "R — passif",
    "effect": "Lors d’une Prédation sanguine, récupération de2 + DR PVau lieu de 1 + DR, toujours limitée par la vitalité réellement prélevée.",
    "runtimeLore": "La prédation nourrit directement la réparation. Le sang arraché à la proie ne se contente pas d’apaiser la faim : il devient matière de reconstruction, refermant les blessures avec une efficacité proportionnelle à la vitalité réellement prise."
  },
  {
    "id": "insensibilite_amelioree",
    "name": "Insensibilité améliorée",
    "group": "Vampire — commun",
    "cost": 1,
    "access": "R — passif",
    "effect": "Le +3 de Physiologie maudite s’applique aussi aux poisons et drogues ; le Vampire peut tenter de résister à certains effets ordinaires qui seraient normalement automatiques.",
    "runtimeLore": "La physiologie maudite cesse de réagir comme celle d’un vivant ordinaire à de nombreuses substances. Poisons et drogues rencontrent un organisme ralenti, étrange, capable de résister là où leur chimie supposait des fonctions plus humaines."
  },
  {
    "id": "charme_inhumain",
    "name": "Charme inhumain",
    "group": "Vampire — commun",
    "cost": 1,
    "access": "SR",
    "effect": "Après une Fascination réussie : +3 aux interactions sociales avec cette cible jusqu’à la fin de la scène, tant que le comportement du Vampire ne brise pas clairement l’emprise.",
    "runtimeLore": "Après avoir déjà ouvert une brèche par la Fascination, le Vampire sait rester exactement dans l’angle où la cible veut encore l’écouter. Sa prédation sociale devient plus fluide tant qu’il ne commet rien qui oblige l’autre à reconnaître brutalement l’emprise."
  },
  {
    "id": "domination",
    "name": "Domination",
    "group": "Vampire — commun",
    "cost": 2,
    "access": "R — 1 PA",
    "effect": "Charisme + Autorité contre Volonté + Force Mentale. Imposer un ordre bref et immédiat. Une instruction manifestement suicidaire ou contraire à une conviction fondamentale donne le +3 circonstanciel normal pour résister.",
    "prerequisite": "charme_inhumain",
    "prerequisiteName": "Charme inhumain",
    "runtimeLore": "La voix vampirique transforme un ordre simple en impulsion difficile à séparer de sa propre volonté. Les convictions profondes peuvent encore résister, mais quelques mots suffisent parfois à détourner le prochain geste avant que la cible comprenne qu’elle a été poussée."
  },
  {
    "id": "somnambulisme",
    "name": "Somnambulisme",
    "group": "Vampire — commun",
    "cost": 2,
    "access": "SR — 2 PA",
    "effect": "Sur une cible endormie ou inconsciente, implanter une suggestion simple ou provoquer un comportement somnambulique. Opposition mentale si la cible pourrait raisonnablement résister ; l’instruction peut attendre son déclenchement durant le scénario.",
    "prerequisite": "charme_inhumain",
    "prerequisiteName": "Charme inhumain",
    "runtimeLore": "Dans un esprit endormi, la suggestion trouve moins de portes fermées. Le Vampire dépose une instruction simple parmi les rêves et laisse la cible l’accomplir plus tard comme une idée qui semblait déjà l’attendre au réveil."
  },
  {
    "id": "stase_profonde",
    "name": "Stase profonde",
    "group": "Vampire — commun",
    "cost": 1,
    "access": "R",
    "effect": "Récupération en Stase :2 PV/heure. Les blessures ordinaires ne peuvent pas spontanément dégrader davantage l’état du Vampire tant qu’il y demeure.",
    "runtimeLore": "La Stase devient une véritable chambre de réparation plutôt qu’une simple immobilité. Le corps maudit se ferme aux dégradations ordinaires et travaille lentement à se reconstruire tant que rien ne vient le détruire de l’extérieur."
  },
  {
    "id": "dernier_sommeil",
    "name": "Dernier sommeil",
    "group": "Vampire — commun",
    "cost": 3,
    "access": "R — Réaction | 1/scénario — Prérequis : Stase profonde",
    "effect": "Lorsqu’une blessure devrait faire franchir le seuil de Mort, le Vampire sombre immédiatement en Stase et reste juste au-dessus de ce seuil. Ne protège pas d’un corps détruit ou d’un effet explicitement annihilant.",
    "prerequisite": "stase_profonde",
    "prerequisiteName": "Stase profonde",
    "runtimeLore": "Lorsque la destruction approche trop près, la malédiction préfère parfois éteindre le Vampire plutôt que le laisser franchir le dernier seuil. Il s’effondre dans une Stase de survie, fragile refuge qui ne sauve rien si le corps lui-même cesse d’exister."
  },
  {
    "id": "presence_du_conquerant",
    "name": "Présence du Conquérant",
    "group": "Krovni Rytsari — Talents de Cour",
    "cost": 1,
    "access": "R — 1 PA",
    "effect": "Charisme + Autorité contre Volonté + Force Mentale. Une réussite impose une pression prédatrice qui rend la cibleTenduetant qu’elle affronte directement le Krovni. Un DR particulièrement élevé peut justifier Panique si la fiction s’y prête.",
    "runtimeLore": "Le Krovni laisse affleurer la certitude froide de celui qui se considère déjà maître du terrain. Face à lui, la cible ressent moins un charme qu’une pression de prédation organisée, comme si toute résistance devait d’abord convaincre le Vampire qu’elle mérite d’exister."
  },
  {
    "id": "ordre_imperieux",
    "name": "Ordre impérieux",
    "group": "Krovni Rytsari — Talents de Cour",
    "cost": 2,
    "access": "R — 1 PA",
    "effect": "Ordre bref : « Recule », « À genoux », « Lâche ton arme », « Tais-toi ». En cas de réussite, la cible exécute l’ordre immédiatement ou perd1 PAen résistant à l’impulsion.",
    "prerequisite": "presence_du_conquerant",
    "prerequisiteName": "Présence du Conquérant",
    "runtimeLore": "La voix du Krovni prend l’ascendant brutal d’un prédateur habitué à être obéi. L’injonction est courte, physique, presque impossible à ignorer sans perdre un instant à lutter contre l’impulsion qu’elle dépose dans le corps."
  },
  {
    "id": "maitre_de_guerre",
    "name": "Maître de guerre",
    "group": "Krovni Rytsari — Talents de Cour",
    "cost": 2,
    "access": "R — 1/round",
    "effect": "Lorsqu’un allié pouvant entendre le Krovni agit conformément à une instruction immédiate et claire, il reçoit+2sur le prochain test directement lié à cette instruction.",
    "runtimeLore": "La tradition Krovni transforme le commandement en réflexe partagé. Un ordre bref venant d’un chef reconnu clarifie immédiatement la priorité du combattant qui l’entend, comme si l’escouade entière avait répété ce mouvement bien avant la bataille."
  },
  {
    "id": "sang_memoriel",
    "name": "Sang mémoriel",
    "group": "Alghul Almalakiu — Talents de Cour",
    "cost": 1,
    "access": "SR",
    "effect": "En goûtant le sang d’une créature : Esprit + Perception pour extraire une impression récente forte — peur, douleur, visage, lieu, sensation. Le DR augmente la précision.",
    "runtimeLore": "Une gorgée de sang peut porter l’écho d’une émotion récente. Peur, douleur, lieu ou visage remontent sans ordre parfait, fragments sensoriels que l’Alghul doit assembler sans les confondre avec un souvenir complet de la victime."
  },
  {
    "id": "interroger_les_restes",
    "name": "Interroger les restes",
    "group": "Alghul Almalakiu — Talents de Cour",
    "cost": 2,
    "access": "R",
    "effect": "L’Empreinte devient précise. Poser au MJ1 question + 1 par DRsur les dernières heures du défunt, dans la limite de ce que son corps ou son sang peut raisonnablement avoir « connu ».",
    "prerequisite": "echo_des_morts",
    "prerequisiteName": "Écho des Morts",
    "runtimeLore": "Chez les Alghul, un cadavre n’est pas immédiatement muet. Sang, tissus et dernières tensions du corps conservent des impressions que le Vampire sait lire comme les pages déchirées d’un témoignage incapable de mentir mais aussi incapable d’expliquer ce qu’il n’a jamais perçu."
  },
  {
    "id": "sang_preserve",
    "name": "Sang préservé",
    "group": "Alghul Almalakiu — Talents de Cour",
    "cost": 3,
    "access": "R — rituel",
    "effect": "Le Vampire sait préparer une quantité de son propre sang afin qu’elle puisse servir d’ancrage à un rituel Alghul de restauration s’il meurt. Le Talent ne ressuscite personne seul : il faut un corps compatible, des praticiens, du temps et les conditions de l’histoire.",
    "runtimeLore": "L’Alghul traite son propre sang comme une archive biologique de lui-même. Préparé selon les rites de Cour, il peut devenir l’ancrage autour duquel d’autres tenteront un jour de reconstruire ce qui aurait normalement été perdu avec sa mort."
  },
  {
    "id": "marche_dans_les_ombres",
    "name": "Marche dans les ombres",
    "group": "Oru Ayeraye — Talents de Cour",
    "cost": 1,
    "access": "R",
    "effect": "Tant qu’il demeure dans une zone suffisamment sombre, le Vampire peut se déplacer sans quitter son état d’Enfant des Ténèbres. Il le perd s’il attaque, manifeste un pouvoir évident ou rejoint une zone suffisamment éclairée.",
    "runtimeLore": "Le Vampire apprend à demeurer dans l’effacement tant que l’obscurité lui offre une continuité. Il glisse d’une zone sombre à l’autre sans rompre la discrétion surnaturelle, jusqu’au moment où violence ou lumière le force à redevenir pleinement présent."
  },
  {
    "id": "ombre_predatrice",
    "name": "Ombre prédatrice",
    "group": "Oru Ayeraye — Talents de Cour",
    "cost": 2,
    "access": "R",
    "effect": "Lorsqu’il quitte l’état d’Enfant des Ténèbres pour attaquer une cible qui ne pouvait pas le percevoir, celle-ci est considérée comme Surprise contre cette attaque.",
    "prerequisite": "marche_dans_les_ombres",
    "prerequisiteName": "Marche dans les ombres",
    "runtimeLore": "L’Oru transforme la sortie des ténèbres en instant de chasse. Lorsque l’ennemi ne savait même pas où regarder, la première attaque surgit avant que son instinct ait eu le temps de replacer le prédateur dans le monde visible."
  },
  {
    "id": "lien_du_deimon",
    "name": "Lien du Deimon",
    "group": "Oru Ayeraye — Talents de Cour",
    "cost": 2,
    "access": "R",
    "effect": "Permet d’établir un lien durable avec un Deimon compatible lié aux traditions de sa Maison. Le Talent ne fournit pas la créature : elle doit être rencontrée ou obtenue dans le récit. Le lien utilise le moteur transversal des Compagnons liés ; le Deimon reste un PNJ réel et ne possède aucun pool de PA indépendant.",
    "runtimeLore": "Dans l’Oru, un Deimon lié n’est ni un objet ni une invocation jetable. Le pacte reconnaît une créature réelle, avec sa volonté et son histoire, puis tisse entre les deux partenaires une proximité assez profonde pour survivre aux scènes où ils sont séparés."
  },
  {
    "id": "sang_exalte",
    "name": "Sang exalté",
    "group": "Ihuito Meztzi — Talents de Cour",
    "cost": 1,
    "access": "R",
    "effect": "Après s’être nourri, le Vampire peut renoncer à une partie de la récupération obtenue afin de recevoir+3 sur le prochain jet lié à un Talent de Sangdurant la scène.",
    "runtimeLore": "Le sang fraîchement pris ne sert pas uniquement à réparer le corps. L’Ihuito peut retenir une part de cette vigueur et la faire circuler dans un pouvoir hématique précis, préférant l’exaltation immédiate à la récupération."
  },
  {
    "id": "offrande_sanglante",
    "name": "Offrande sanglante",
    "group": "Ihuito Meztzi — Talents de Cour",
    "cost": 2,
    "access": "R",
    "effect": "Lors de la préparation d’un Talent de Sang, le Vampire peut payer de sa propre vitalité :2 PV remplacent 1 PA, une seule fois par activation.",
    "runtimeLore": "L’Ihuito ne sépare jamais complètement puissance et sacrifice. Lorsque le temps manque, le Vampire peut verser sa propre vitalité dans la préparation d’un pouvoir de Sang, payant avec sa chair ce qu’il n’a pas le loisir d’accomplir patiemment."
  },
  {
    "id": "sang_du_dieu",
    "name": "Sang du Dieu",
    "group": "Ihuito Meztzi — Talents de Cour",
    "cost": 3,
    "access": "R — 1/scénario",
    "effect": "Après avoir bu une quantité significative de sang d’une créature surnaturelle, conserver jusqu’à la fin de la scène unepropriété physique simplede cette créature, choisie avec le MJ parmi celles réellement présentes dans sa nature. Talent rare et fortement encadré.",
    "runtimeLore": "Après avoir bu une créature surnaturelle, l’Ihuito peut conserver brièvement l’une de ses évidences corporelles. Ce n’est ni une copie d’âme ni un vol de pouvoir complet : seulement une qualité physique que le sang a appris à reproduire."
  },
  {
    "id": "souffle_du_yang",
    "name": "Souffle du Yang",
    "group": "Shi Hun Zhe — Talents de Cour",
    "cost": 1,
    "access": "R",
    "effect": "Après s’être nourri, le Vampire peut consumer l’équilibre volé pourignorer jusqu’à la fin du roundles effets d’une faiblesse vampirique choisie.",
    "runtimeLore": "Le sang fraîchement volé apporte assez de Yang pour soutenir momentanément ce que la condition vampirique rejette. Le Vampire consume cette réserve comme un souffle emprunté, protégeant brièvement son équilibre face à une faiblesse choisie."
  },
  {
    "id": "harmonie_impossible",
    "name": "Harmonie impossible",
    "group": "Shi Hun Zhe — Talents de Cour",
    "cost": 2,
    "access": "R — 1/scène",
    "effect": "Jusqu’à la fin de la scène, une faiblesse choisie est fortement réduite : les dégâts qu’elle inflige sont divisés par deux (arrondi au supérieur) et un effet normalement automatique autorise un test de résistance approprié.",
    "prerequisite": "souffle_du_yang",
    "prerequisiteName": "Souffle du Yang",
    "runtimeLore": "Le Shi Hun Zhe atteint un équilibre que sa malédiction refuse normalement. Une faiblesse demeure présente mais cesse un temps d’être absolue, comme si Hun et Po avaient trouvé une position provisoire où aucun des deux ne laissait l’autre entraîner le Vampire vers sa chute."
  },
  {
    "id": "union_du_hun_et_du_po",
    "name": "Union du Hun et du Po",
    "group": "Shi Hun Zhe — Talents de Cour",
    "cost": 3,
    "access": "R — 1/scénario",
    "effect": "Le Vampire atteint momentanément un équilibre que sa Nature ne devrait pas permettre.Une malédiction vampirique choisie cesse complètement de s’appliquer jusqu’à la fin de la scène.Le soleil peut être choisi.",
    "prerequisite": "harmonie_impossible",
    "prerequisiteName": "Harmonie impossible",
    "runtimeLore": "Pendant quelques instants, les deux principes que la malédiction maintient en conflit cessent de se déchirer. Le Vampire atteint une cohérence presque impossible où même l’une de ses grandes condamnations peut perdre entièrement prise sur lui."
  },
  {
    "id": "vision_du_sang",
    "name": "Vision du Sang",
    "group": "Sang Écarlate — Anya",
    "cost": 1,
    "access": "SR",
    "effect": "Perçoit le sang frais et la circulation des êtres vivants ; peut distinguer ces signatures malgré une faible obscuration ou un obstacle mince.",
    "runtimeLore": "La circulation vivante devient visible derrière peau et faible obstacle. Pulsations, masses chaudes de sang et blessures fraîches composent une cartographie de la vie qui persiste même lorsque l’éclairage ordinaire ne suffit plus."
  },
  {
    "id": "traque_hematique",
    "name": "Traque hématique",
    "group": "Sang Écarlate — Anya",
    "cost": 2,
    "access": "SR",
    "effect": "Reconnaît un sang précis, le distingue des autres et peut suivre sa trace malgré une dissimulation ordinaire.",
    "prerequisite": "vision_du_sang",
    "prerequisiteName": "Vision du Sang",
    "runtimeLore": "Un sang connu possède pour Anya une signature impossible à confondre avec une autre. Une goutte, une trace nettoyée trop vite ou une piste mêlée à d’autres reste identifiable comme le passage précis de la proie recherchée."
  },
  {
    "id": "deferlement_ecarlate",
    "name": "Déferlement écarlate",
    "group": "Sang Écarlate — Anya",
    "cost": 1,
    "access": "R — 1 PA",
    "effect": "+3 au prochain test physique effectué avant la fin du round.",
    "runtimeLore": "Le Sang d’Anya libère une poussée de puissance immédiatement utilisable par le corps. Muscles, coordination ou vitesse reçoivent ensemble cette brève montée hématique, comme si la circulation venait d’ouvrir toutes ses réserves au même instant."
  },
  {
    "id": "surregime",
    "name": "Surrégime",
    "group": "Sang Écarlate — Anya",
    "cost": 2,
    "access": "R — 1/scène",
    "effect": "Gagne immédiatement1 PA supplémentaire, même au-delà du maximum normal, à utiliser durant le round courant.",
    "prerequisite": "deferlement_ecarlate",
    "prerequisiteName": "Déferlement écarlate",
    "runtimeLore": "Le Vampire force son organisme à trouver encore un geste dans un round déjà saturé. Tout s’accélère — perception, décision, mouvement — au prix de faire fonctionner la prédation à un régime que le corps ordinaire ne pourrait soutenir."
  },
  {
    "id": "forme_animale",
    "name": "Forme animale",
    "group": "Sang Primal — Lyssa",
    "cost": 1,
    "access": "R — 1 PA",
    "effect": "Prend la forme d’un animal naturel maîtrisé. Les aptitudes corporelles évidentes de cette forme deviennent utilisables ; l’équipement ordinaire ne s’adapte pas automatiquement.",
    "runtimeLore": "Le Sang primal rappelle au corps une autre anatomie naturelle et la rend complète. Griffes, ailes, nage ou odorat suivent alors les capacités évidentes de l’animal choisi, tandis que vêtements et outils restent les problèmes d’un corps humain qu’il vient de quitter."
  },
  {
    "id": "menagerie",
    "name": "Ménagerie",
    "group": "Sang Primal — Lyssa",
    "cost": 2,
    "access": "R",
    "effect": "Maîtrise plusieurs formes animales et peut choisir celle adaptée à la scène.",
    "prerequisite": "forme_animale",
    "prerequisiteName": "Forme animale",
    "runtimeLore": "Lyssa ne limite plus le Vampire à une seule réponse animale. Plusieurs morphologies sont mémorisées dans le Sang, chacune gardée comme une solution possible à ressortir lorsque terrain, fuite ou chasse réclament un autre corps."
  },
  {
    "id": "corps_de_brume",
    "name": "Corps de brume",
    "group": "Sang Primal — Lyssa",
    "cost": 1,
    "access": "R — Réaction 1 PA",
    "effect": "Se dissout brièvement en brume pour laisser traverser une agression physique ; les effets capables d’atteindre une forme immatérielle restent applicables.",
    "runtimeLore": "La chair se défait juste assez longtemps pour qu’un coup ordinaire traverse une masse sans organes ni os. Le Vampire existe toujours dans cette vapeur, mais seules les attaques capables de toucher l’immatériel peuvent réellement le traiter comme avant."
  },
  {
    "id": "brume_etouffante",
    "name": "Brume étouffante",
    "group": "Sang Primal — Lyssa",
    "cost": 2,
    "access": "R — 2 PA, maintien",
    "effect": "Étend sa brume à une petite zone, gênant vision, respiration et déplacements selon la scène. Maintien normal : 1 PA/round.",
    "prerequisite": "corps_de_brume",
    "prerequisiteName": "Corps de brume",
    "runtimeLore": "Lyssa étend sa forme diffuse jusqu’à remplir l’espace. La brume s’accroche aux yeux, au souffle et aux trajectoires, donnant au Vampire une présence partout à la fois sans lui rendre pour autant un corps solide à cet endroit."
  },
  {
    "id": "double_tenebreux",
    "name": "Double ténébreux",
    "group": "Sang Hypocrite — Briaerus",
    "cost": 1,
    "access": "SR — 1 PA, maintien",
    "effect": "Crée un double crédible mais immatériel, capable de tromper la perception ordinaire.",
    "runtimeLore": "Briaerus donne au Vampire un second corps qui ne possède ni poids ni chair. Assez crédible pour tromper les sens ordinaires, il emprunte apparence et mouvement sans jamais devenir une personne capable de saisir le monde."
  },
  {
    "id": "double_autonome",
    "name": "Double autonome",
    "group": "Sang Hypocrite — Briaerus",
    "cost": 2,
    "access": "R",
    "effect": "Le double peut se déplacer indépendamment pour distraire, feinter ou attirer l’attention ; il n’inflige pas de dégâts par lui-même. Il ne possède aucun pool de PA : toute action tactiquement significative accomplie par le double utilise les PA du Vampire.",
    "prerequisite": "double_tenebreux",
    "prerequisiteName": "Double ténébreux",
    "runtimeLore": "Le double de Briaerus cesse de suivre son créateur comme un reflet docile. Il peut attirer un regard, prendre un couloir ou feindre une intention ailleurs, illusion mobile dont chaque initiative reste néanmoins soutenue par l’attention réelle du Vampire."
  },
  {
    "id": "fantasmagorie",
    "name": "Fantasmagorie",
    "group": "Sang Hypocrite — Briaerus",
    "cost": 1,
    "access": "SR — 1 PA, maintien",
    "effect": "Crée une illusion locale simple. Une cible qui a une vraie raison de douter peut tenter une opposition appropriée.",
    "runtimeLore": "Une scène simple peut être falsifiée par quelques détails bien choisis : silhouette, bruit, objet ou mouvement qui n’existe pas. L’illusion tient tant que rien ne pousse réellement l’observateur à demander au monde une preuve plus solide."
  },
  {
    "id": "grande_illusion",
    "name": "Grande illusion",
    "group": "Sang Hypocrite — Briaerus",
    "cost": 2,
    "access": "R — 2 PA, maintien",
    "effect": "Illusion multisensorielle couvrant une scène ou un environnement important.",
    "prerequisite": "fantasmagorie",
    "prerequisiteName": "Fantasmagorie",
    "runtimeLore": "Le Sang hypocrite ne se contente plus d’un leurre isolé. Sons, volumes, textures et ambiance peuvent composer un environnement mensonger assez vaste pour que plusieurs témoins partagent la même fausse scène."
  },
  {
    "id": "vision_thermique",
    "name": "Vision thermique",
    "group": "Sang Venimeux — Huitzitia",
    "cost": 1,
    "access": "SR",
    "effect": "Perception infrarouge des sources de chaleur et des variations thermiques.",
    "runtimeLore": "Huitzitia ajoute la chaleur au vocabulaire des formes visibles. Corps, moteurs et surfaces récemment touchées se détachent par leur température, révélant des présences que couleur et lumière ordinaire auraient pu dissimuler."
  },
  {
    "id": "venin_noir",
    "name": "Venin noir",
    "group": "Sang Venimeux — Huitzitia",
    "cost": 1,
    "access": "R",
    "effect": "Le Vampire peut rendre ses fluides corporels toxiques. Après contact significatif, la cible résiste avec Constitution si l’effet est contestable.",
    "runtimeLore": "Les fluides du Vampire deviennent eux-mêmes une arme biologique. Sang, salive ou sécrétion peuvent porter une toxicité que l’organisme adverse doit reconnaître et combattre après une exposition suffisamment réelle."
  },
  {
    "id": "venins_faconnes",
    "name": "Venins façonnés",
    "group": "Sang Venimeux — Huitzitia",
    "cost": 2,
    "access": "R",
    "effect": "À chaque sécrétion, choisir une orientation cohérente : paralysante, soporifique, douloureuse ou autre effet validé avec le MJ.",
    "prerequisite": "venin_noir",
    "prerequisiteName": "Venin noir",
    "runtimeLore": "Le Sang venimeux apprend à choisir ce qu’il veut faire au corps plutôt qu’à produire une toxine unique. Sommeil, douleur ou paralysie deviennent des profils biologiques distincts, préparés selon l’effet recherché avant la sécrétion."
  },
  {
    "id": "effluves_toxiques",
    "name": "Effluves toxiques",
    "group": "Sang Venimeux — Huitzitia",
    "cost": 2,
    "access": "R — 2 PA, maintien",
    "effect": "Diffuse ses toxines dans son environnement proche et crée une petite zone dangereuse.",
    "prerequisite": "venins_faconnes",
    "prerequisiteName": "Venins façonnés",
    "runtimeLore": "Huitzitia ne garde plus son venin dans le corps. Une exhalaison, une brume ou des fluides dispersés rendent l’espace proche dangereux, transformant la proximité du Vampire en exposition plutôt que le seul contact direct."
  },
  {
    "id": "visage_vole",
    "name": "Visage volé",
    "group": "Sang Masqué — Kazuo",
    "cost": 1,
    "access": "SR — 1 PA",
    "effect": "Copie le visage d’une personne dont le Vampire s’est déjà nourri.",
    "runtimeLore": "Le sang bu sert de mémoire morphologique. Les traits d’une ancienne proie remontent dans la chair du Vampire et remplacent son visage par une copie dont la crédibilité vient précisément de cette proximité hématique passée."
  },
  {
    "id": "voix_volee",
    "name": "Voix volée",
    "group": "Sang Masqué — Kazuo",
    "cost": 1,
    "access": "SR",
    "effect": "Reproduit fidèlement la voix d’une personne dont il s’est nourri.",
    "runtimeLore": "Une voix entendue de l’intérieur par le sang peut être reproduite bien au-delà d’une simple imitation. Timbre et cadence reviennent avec une fidélité surnaturelle, même lorsque le Vampire n’a jamais appris à parler comme cette personne."
  },
  {
    "id": "mue_complete",
    "name": "Mue complète",
    "group": "Sang Masqué — Kazuo",
    "cost": 2,
    "access": "SR",
    "effect": "Copie aussi la morphologie générale et les particularités physiques visibles.",
    "prerequisite": "visage_vole",
    "prerequisiteName": "Visage volé",
    "runtimeLore": "Le masque gagne le reste du corps. Taille, proportions et particularités visibles peuvent rejoindre le visage déjà volé, produisant une imitation physique convaincante tant qu’aucun détail caché ou savoir personnel n’est exigé."
  },
  {
    "id": "mimetisme_parfait",
    "name": "Mimétisme parfait",
    "group": "Sang Masqué — Kazuo",
    "cost": 2,
    "access": "SR",
    "effect": "Le Vampire reproduit surnaturellement la signature vocale complète de la cible : timbre, micro-intonations, rythme respiratoire, accent, cadence, hésitations, placement de voix et particularités acoustiques involontaires. Une personne connaissant intimement cette voix et une biométrie vocale ordinaire la reconnaissent normalement comme authentique. Le Talent ne fournit aucun souvenir, vocabulaire spécialisé, mot de passe ou connaissance personnelle de la cible.",
    "prerequisite": "voix_volee",
    "prerequisiteName": "Voix volée",
    "runtimeLore": "Kazuo fait de la voix un masque jusque dans ses accidents minuscules. Souffle, hésitations, accent et micro-intonations deviennent assez fidèles pour tromper l’oreille intime comme la biométrie, sans offrir au Vampire les souvenirs qui expliqueraient quoi dire."
  },
  {
    "id": "echolocation",
    "name": "Écholocation",
    "group": "Sang Aveugle — Ashream",
    "cost": 1,
    "access": "SR",
    "effect": "Perçoit précisément volumes, reliefs et mouvements par ultrasons, indépendamment de la lumière.",
    "runtimeLore": "La lumière devient accessoire. Claquements, souffle ou ultrasons bâtissent dans l’esprit une géométrie de volumes et de mouvements où murs, corps et reliefs existent par la manière dont ils renvoient le son."
  },
  {
    "id": "sonar_predateur",
    "name": "Sonar prédateur",
    "group": "Sang Aveugle — Ashream",
    "cost": 2,
    "access": "R",
    "effect": "Étend la précision de l’écholocation et permet de percevoir certaines présences au travers d’obstacles minces.",
    "prerequisite": "echolocation",
    "prerequisiteName": "Écholocation",
    "runtimeLore": "L’écho cesse de décrire seulement la pièce immédiate. Le Vampire apprend à lire le retour des ultrasons avec une finesse prédatrice, distinguant mouvements et présences même lorsque de minces obstacles devraient les cacher à une vue ordinaire."
  },
  {
    "id": "vision_astrale",
    "name": "Vision astrale",
    "group": "Sang Aveugle — Ashream",
    "cost": 1,
    "access": "SR",
    "effect": "Perçoit le plan astral et les présences qui s’y manifestent.",
    "runtimeLore": "Le regard d’Ashream se décale vers ce qui n’appartient pas entièrement au monde matériel. Présences, silhouettes et phénomènes du plan astral prennent une forme lisible sans que le Vampire ait besoin d’abandonner son propre corps."
  },
  {
    "id": "projection_astrale",
    "name": "Projection astrale",
    "group": "Sang Aveugle — Ashream",
    "cost": 2,
    "access": "R — 2 PA, maintien",
    "effect": "Quitte son corps pour se déplacer astralement. Le corps reste totalement vulnérable ; sous pression, la projection suit les règles normales de maintien.",
    "prerequisite": "vision_astrale",
    "prerequisiteName": "Vision astrale",
    "runtimeLore": "Ashream permet à la conscience de se détacher d’un corps devenu silencieux. Le Vampire traverse alors le plan astral comme une présence sans chair, sachant que son enveloppe laissée derrière lui demeure vulnérable à tout ce qui arrivera pendant son absence."
  },
  {
    "id": "diagnostic_predateur",
    "name": "Diagnostic prédateur",
    "group": "Sang Traqueur — Go’Ndai",
    "cost": 1,
    "access": "SR — 1 PA",
    "effect": "Le Vampire lit directement l’organisme comme un réseau vivant : circulation, rythme cardiaque, oxygénation, tensions musculaires, hémorragies internes, fractures, lésions importantes, organes défaillants, intoxications physiologiquement actives et autres anomalies corporelles significatives, même sans signe extérieur. La lecture indique ce qui se passe dans le corps, pas nécessairement pourquoi : Soin, Science ou un savoir approprié restent nécessaires pour interpréter une pathologie inconnue, une modification extraterrestre ou une altération surnaturelle complexe. Ne révèle ni Nature, ni Sang, ni Talent, ni faiblesse surnaturelle abstraite.",
    "runtimeLore": "Pour Go’Ndai, un organisme est un réseau lisible de flux, tensions et ruptures. Le Vampire voit hémorragie, fracture ou organe en difficulté sans confondre cette lecture physiologique avec la connaissance de la cause occulte ou extraterrestre qui l’a provoquée."
  },
  {
    "id": "anatomie_fatale",
    "name": "Anatomie fatale",
    "group": "Sang Traqueur — Go’Ndai",
    "cost": 2,
    "access": "R",
    "effect": "Après avoir étudié une cible, la prochaine attaque réussie peut choisir une zone ou une Altération sans exiger le seuil de marge habituel ; les dégâts restent ceux de la marge réellement obtenue.",
    "prerequisite": "diagnostic_predateur",
    "prerequisiteName": "Diagnostic prédateur",
    "runtimeLore": "Go’Ndai transforme l’observation du corps en violence précise. Après avoir compris où la cible est vulnérable, le Vampire frappe directement l’articulation, l’organe ou la structure dont la défaillance changera réellement la suite du combat."
  },
  {
    "id": "sang_anime",
    "name": "Sang animé",
    "group": "Sang Traqueur — Go’Ndai",
    "cost": 1,
    "access": "R — 1 PA, maintien",
    "effect": "Anime son propre sang ou du sang répandu comme un membre supplémentaire capable de manipulations simples.",
    "runtimeLore": "Le sang répandu se comporte comme un membre détaché mais encore obéissant. Il peut ramper, saisir ou déplacer de petites choses, prolongement rouge de la volonté du Vampire là où ses mains ne se trouvent pas."
  },
  {
    "id": "arme_hematique",
    "name": "Arme hématique",
    "group": "Sang Traqueur — Go’Ndai",
    "cost": 2,
    "access": "R",
    "effect": "Le sang animé peut former lame, fouet ou projectile surnaturel. La forme choisie détermine la compétence d’attaque appropriée ; les valeurs de DGT suivent l’équilibrage des armes de la campagne.",
    "prerequisite": "sang_anime",
    "prerequisiteName": "Sang animé",
    "runtimeLore": "Le sang quitte sa fonction de fluide pour devenir outil de prédation. Lame, fouet ou projectile prennent forme à partir d’une matière qui reste liée au Vampire et se comporte comme une extension armée de sa circulation."
  },
  {
    "id": "toucher_glacial",
    "name": "Toucher glacial",
    "group": "Sang Glacial — Vjärmod",
    "cost": 1,
    "access": "R",
    "effect": "Un contact volontaire peut engourdir ou paralyser par le froid ; Constitution résiste quand l’effet vise directement un adversaire.",
    "runtimeLore": "Au contact, le Vampire aspire assez de chaleur pour faire hésiter nerfs et muscles. L’engourdissement peut devenir paralysie brève, sensation de chair étrangère laissée par une main plus froide que le milieu qui l’entoure."
  },
  {
    "id": "gel_brutal",
    "name": "Gel brutal",
    "group": "Sang Glacial — Vjärmod",
    "cost": 2,
    "access": "R — 2 PA",
    "effect": "Gèle sévèrement un objet ou une partie du corps atteinte, avec conséquences fictionnelles adaptées.",
    "prerequisite": "toucher_glacial",
    "prerequisiteName": "Toucher glacial",
    "runtimeLore": "Le froid se concentre assez vite pour figer matière ou chair avant qu’elles aient le temps de s’adapter. Ce qui est touché devient cassant, engourdi ou raide selon sa nature, marqué par une chute de température presque instantanée."
  },
  {
    "id": "devorer_la_chaleur",
    "name": "Dévorer la chaleur",
    "group": "Sang Glacial — Vjärmod",
    "cost": 1,
    "access": "R — maintien",
    "effect": "Absorbe progressivement la chaleur d’une petite zone et crée un danger environnemental.",
    "runtimeLore": "Vjärmod ne produit pas d’abord du froid : il retire la chaleur. Autour du Vampire, l’énergie thermique disparaît progressivement, laissant air et surfaces tomber vers un silence glacé que le corps vivant reconnaît immédiatement comme dangereux."
  },
  {
    "id": "hiver_noir",
    "name": "Hiver noir",
    "group": "Sang Glacial — Vjärmod",
    "cost": 2,
    "access": "R",
    "effect": "Étend fortement la zone et l’intensité du froid surnaturel.",
    "prerequisite": "devorer_la_chaleur",
    "prerequisiteName": "Dévorer la chaleur",
    "runtimeLore": "Le Sang glacial étend son absence de chaleur jusqu’à transformer une zone entière. Givre, souffle blanc et surfaces durcies installent un hiver local qui ne dépend ni de la saison ni du climat extérieur."
  },
  {
    "id": "toucher_ardent",
    "name": "Toucher ardent",
    "group": "Sang Ardent — Larisha",
    "cost": 1,
    "access": "R",
    "effect": "Le contact provoque douleur et brûlure surnaturelles.",
    "runtimeLore": "Sous les doigts du Vampire, la chaleur cesse d’être une sensation et devient une agression. Le Sang ardent concentre la brûlure au point de contact, laissant douleur et trace avant même qu’une flamme visible soit nécessaire."
  },
  {
    "id": "marque_incandescente",
    "name": "Marque incandescente",
    "group": "Sang Ardent — Larisha",
    "cost": 2,
    "access": "R",
    "effect": "La brûlure persiste après le contact et peut devenir une Altération appropriée.",
    "prerequisite": "toucher_ardent",
    "prerequisiteName": "Toucher ardent",
    "runtimeLore": "La brûlure de Larisha refuse de s’éteindre avec le geste qui l’a créée. Une chaleur rouge demeure dans la chair ou la matière atteinte, rappel persistant du contact vampirique longtemps après que la main s’est retirée."
  },
  {
    "id": "embrasement",
    "name": "Embrasement",
    "group": "Sang Ardent — Larisha",
    "cost": 1,
    "access": "R — 1 PA",
    "effect": "Enflamme à proximité une matière réellement combustible.",
    "runtimeLore": "Le Sang de Larisha transmet sa chaleur à ce qui peut réellement brûler. Le Vampire n’invente pas un combustible : il trouve dans la matière la promesse d’une flamme et la pousse soudain jusqu’à l’incendie."
  },
  {
    "id": "fournaise",
    "name": "Fournaise",
    "group": "Sang Ardent — Larisha",
    "cost": 2,
    "access": "R — 2 PA, maintien",
    "effect": "Transforme l’environnement immédiat en zone de chaleur dangereuse.",
    "prerequisite": "embrasement",
    "prerequisiteName": "Embrasement",
    "runtimeLore": "La chaleur ardente cesse de rester au contact du Vampire. Air, surfaces et souffle deviennent hostiles autour de lui, comme si la pièce entière avait été rapprochée d’un foyer trop vaste pour être contenu."
  },
  {
    "id": "decharge_orageuse",
    "name": "Décharge orageuse",
    "group": "Sang Orageux — Branimir",
    "cost": 1,
    "access": "R",
    "effect": "Contact électrique violent ; Constitution permet de résister à l’engourdissement ou à l’étourdissement.",
    "runtimeLore": "Le contact libère une violence électrique capable de brouiller nerfs et muscles. Le Sang orageux ne se contente pas de brûler : il impose au corps adverse un signal brutal qui concurrence un instant ses propres commandes."
  },
  {
    "id": "surcharge_nerveuse",
    "name": "Surcharge nerveuse",
    "group": "Sang Orageux — Branimir",
    "cost": 2,
    "access": "R",
    "effect": "Une réussite importante peut provoquer une incapacité sévère et, si la fiction le justifie, une atteinte cardiaque.",
    "prerequisite": "decharge_orageuse",
    "prerequisiteName": "Décharge orageuse",
    "runtimeLore": "Branimir pousse l’intrusion électrique jusqu’aux fonctions les plus fragiles. Une décharge particulièrement réussie peut faire plus qu’engourdir : rythme cardiaque, coordination et conscience deviennent des systèmes susceptibles d’être momentanément débordés."
  },
  {
    "id": "brume_electrostatique",
    "name": "Brume électrostatique",
    "group": "Sang Orageux — Branimir",
    "cost": 1,
    "access": "R — 1 PA, maintien",
    "effect": "Crée autour du Vampire une zone conductrice permettant à ses décharges d’atteindre une cible à courte distance.",
    "runtimeLore": "Autour du Vampire, l’air se charge et picote sur la peau. Cette brume conductrice prépare des chemins invisibles à ses décharges, rapprochant électriquement des cibles que quelques mètres séparent encore physiquement."
  },
  {
    "id": "arc_orageux",
    "name": "Arc orageux",
    "group": "Sang Orageux — Branimir",
    "cost": 2,
    "access": "R",
    "effect": "Une décharge peut traverser plusieurs cibles présentes dans la zone conductrice.",
    "prerequisite": "brume_electrostatique",
    "prerequisiteName": "Brume électrostatique",
    "runtimeLore": "Branimir laisse la décharge chercher d’autres chemins après le premier impact. Dans un milieu rendu conducteur, l’électricité bondit vers les corps proches comme si chacun devenait momentanément un morceau du même circuit vivant."
  },
  {
    "id": "lecture_superficielle",
    "name": "Lecture superficielle",
    "group": "Sang Révélateur — Zhi Xia",
    "cost": 1,
    "access": "SR — 1 PA",
    "effect": "Opposition mentale. Lit pensées immédiates, impressions et émotions présentes.",
    "runtimeLore": "Zhi Xia ouvre une fenêtre étroite sur le présent mental. Pensées immédiates et émotion dominante deviennent perceptibles, assez pour comprendre ce qui occupe quelqu’un maintenant mais pas pour fouiller automatiquement son histoire."
  },
  {
    "id": "lecture_profonde",
    "name": "Lecture profonde",
    "group": "Sang Révélateur — Zhi Xia",
    "cost": 2,
    "access": "R — 2 PA",
    "effect": "Le DR permet d’aller vers souvenirs, motivations ou indices sur la Nature véritable. Les pensées restent un mélange d’images, de mots et de sensations que le Vampire doit interpréter.",
    "prerequisite": "lecture_superficielle",
    "prerequisiteName": "Lecture superficielle",
    "runtimeLore": "L’esprit observé cesse d’être seulement une surface d’émotions. Souvenirs, motivations et indices enfouis remontent sous forme d’images, de sensations et de mots partiels que le Vampire doit encore interpréter plutôt que recevoir comme un dossier parfaitement classé."
  },
  {
    "id": "sang_de_verite",
    "name": "Sang de Vérité",
    "group": "Sang Révélateur — Zhi Xia",
    "cost": 1,
    "access": "R",
    "effect": "Toucher ou asperger de son sang permet de confronter une illusion ou transformation surnaturelle à un test opposé.",
    "runtimeLore": "Le sang du Vampire devient un révélateur hostile aux faux-semblants surnaturels. Au contact d’une illusion ou d’une transformation, il force l’apparence à confronter sa cohérence à quelque chose qui se souvient obstinément du réel."
  },
  {
    "id": "dissipation_revelatrice",
    "name": "Dissipation révélatrice",
    "group": "Sang Révélateur — Zhi Xia",
    "cost": 2,
    "access": "R",
    "effect": "Peut également supprimer temporairement un pouvoir surnaturel actif sur une cible. Ne permet jamais de forcer une autre personne à se Révéler à travers le Voile.",
    "prerequisite": "sang_de_verite",
    "prerequisiteName": "Sang de Vérité",
    "runtimeLore": "Zhi Xia pousse la Vérité au-delà de l’apparence et attaque la manifestation active elle-même. Le Vampire peut faire taire temporairement un pouvoir présent sur quelqu’un sans pour autant déchirer le Voile ni révéler de force ce que le monde protège."
  },
  {
    "id": "faim_condamnee",
    "name": "Faim condamnée",
    "group": "Sang Condamné — Ashelia",
    "cost": 1,
    "access": "R — 1 PA",
    "effect": "Aspire à distance une partie de la vitalité ou de l’énergie d’une cible ; la résistance dépend de la nature exacte de ce qui est dévoré.",
    "runtimeLore": "La faim d’Ashelia apprend à atteindre ce qui nourrit sans exiger le contact des crocs. Vitalité ou énergie sont tirées à distance vers le Vampire, comme si son organisme refusait d’attendre que la proie soit déjà entre ses mains."
  },
  {
    "id": "faim_magique",
    "name": "Faim magique",
    "group": "Sang Condamné — Ashelia",
    "cost": 2,
    "access": "R — Réaction 1 PA",
    "effect": "Tente de dévorer une attaque ou manifestation surnaturelle offensive dirigée contre le Vampire.",
    "prerequisite": "faim_condamnee",
    "prerequisiteName": "Faim condamnée",
    "runtimeLore": "Une manifestation hostile peut devenir nourriture plutôt que blessure. Le Vampire ouvre sa faim sur le pouvoir qui arrive et tente d’en dévorer la substance avant qu’elle ne se referme sur lui."
  },
  {
    "id": "changement_de_corps",
    "name": "Changement de corps",
    "group": "Sang Condamné — Ashelia",
    "cost": 3,
    "access": "R — 1/scénario",
    "effect": "Pouvoir exceptionnel, généralement préparé. Le Vampire abandonne son enveloppe condamnée pour en prendre une nouvelle ; l’ancien corps donne naissance à un Strygoï.",
    "runtimeLore": "Ashelia pousse la malédiction jusqu’à traiter le corps comme une enveloppe remplaçable. Le Vampire abandonne une chair condamnée pour s’ancrer ailleurs, laissant derrière lui quelque chose qui ne meurt pas proprement et peut engendrer un monstre autonome."
  }
] as const;
