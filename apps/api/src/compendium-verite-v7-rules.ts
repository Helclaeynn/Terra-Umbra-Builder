type Block={type:"p";text:string;style?:string}|{type:"table";rows:unknown[][]};
type Section={id:string;title:string;level:number;audience?:"mj";blocks:Block[]};
type Article={id:string;dataset:string;category:string;sourceCategory:string;title:string;source:string;status:string;rebuildV2:true;tags:string[];sections:Section[]};
const SOURCE="TUC_Verite_V7_CROSSAUDIT_2026-09-10.docx";
const SOURCE_ARTICLES=[
  {
    "id": "regles-verite-v7-architecture-ptv-acces",
    "title": "Architecture, PTV & accès",
    "tags": [
      "Vérité",
      "PTV",
      "XP",
      "Nature",
      "Origine",
      "Tradition",
      "Statut",
      "accès",
      "cross-training"
    ],
    "sections": [
      {
        "id": "1-architecture-de-la-verite",
        "title": "1. Architecture de la Vérité",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "La Vérité regroupe Natures, héritages, traditions, doctrines, fonctions et disciplines. L’XP décrit l’expertise profane ; les PTV décrivent ce que le personnage est, ce qu’une tradition de Vérité lui a appris à devenir, ou une manière exceptionnelle d’utiliser ses capacités. Couche Principe Nature Ce que le personnage est. Origine / héritage Branche de Nature ou ascendance de Vérité. Tradition / doctrine / fonction Formation distinctive, pas nécessairement surnaturelle. Statut Habilitation, rang, réputation ou fonction sociale ; narratif sauf maîtrise distincte. Équipement Ce que le personnage possède ; jamais acheté par PTV."
          }
        ]
      },
      {
        "id": "2-points-de-verite-acces-et-conception-des-talents",
        "title": "2. Points de Vérité, accès et conception des Talents",
        "level": 2,
        "blocks": []
      },
      {
        "id": "ptv-et-competences-profanes",
        "title": "PTV et Compétences profanes",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Un Talent peut améliorer une action profane — bonus, relance, DR, auto-Assistance, exception d’action — s’il représente une Nature, une discipline ou une doctrine distinctive qui s’ajoute réellement à l’expertise. Il ne remplace pas simplement un métier, une connaissance, un objet ou une ressource absente. Les anciens « Compétence au minimum X » deviennent +X lorsqu’ils expriment une aptitude de Vérité : le novice est aidé et le spécialiste peut dépasser le plafond humain. Coût Intention 1 PTV signature utile ou ouverture spécialisée 2 PTV effet puissant ou règle modifiée 3 PTV effet majeur, rare ou nouvelle dimension d’action Accès Sens N — Naturel accès canonique/culturel ; Talent à acheter O — Ouvert formation ou mentor crédible R — Restreint origine rare, initiation ou accès difficile X — Incompatible incompatibilité réelle de Nature ou de principe Cross-training : possible si la fiction le permet ; signatures racines, prérequis biologiques, initiatiques et matériels restent applicables."
          }
        ]
      },
      {
        "id": "doctrine-fonction-et-reseau-de-verite",
        "title": "Doctrine, fonction et réseau de Vérité",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Une voie PTV peut représenter une fonction, une doctrine ou une culture opérationnelle de Vérité sans être surnaturelle. Elle est légitime lorsqu’elle formalise une manière distinctive d’agir, d’intégrer une faction ou d’exploiter ses codes — Hordes, Croix d’Emphyrra, Syndicat de Jade, Mafia Shaediri, etc. Elle ne remplace jamais l’existence réelle des moyens requis. Un réseau de Vérité n’apparaît jamais parce qu’un Talent est acheté. Si le réseau, la route, le relais, le vendeur ou la ressource existe réellement, l’initié sait en reconnaître les signes, s’authentifier et utiliser les procédures auxquelles son degré d’intégration lui donne accès. Prix, délais, risques et disponibilité restent réels."
          }
        ]
      }
    ]
  },
  {
    "id": "regles-verite-v7-pa-reactions-defense-puissance",
    "title": "PA, Réactions, Défense occulte & Puissance",
    "tags": [
      "Vérité",
      "PA",
      "Réactions",
      "Défense occulte",
      "Puissance",
      "non-cumul"
    ],
    "sections": [
      {
        "id": "3-pa-reactions-durees-et-non-cumul",
        "title": "3. PA, Réactions, durées et non-cumul",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Actif : 1 PA par défaut ; 2–3 PA ou préparation longue si indiqué. Maximum normal : 3 PA. Une capacité accorde normalement au plus +1 PA, donc 4. Plusieurs gains directs ne se cumulent pas sauf exception explicite. Exception écrite possible : le Surrégime Garou Écarlate se cumule avec le +1 PA Hybride et peut atteindre 5 PA. Une Réaction dépense un PA, sauf PA de Réaction spécialisé explicitement créé. Une relance de Talent maximum par test. Une réduction générique de Difficulté maximum par effets externes ; les moteurs internes comme Amplitude/portée/Canalisation Mage suivent leurs propres règles. Deux effets substantiellement équivalents ne se cumulent pas sauf mention explicite. Une seule Assistance effective peut s’appliquer à un même test. Bras, tentacules, queues et appendices supplémentaires n’accordent jamais d’eux-mêmes PA, Attaque, Défense active ou Réaction supplémentaires."
          }
        ]
      },
      {
        "id": "arbitrage-transversal-des-chevauchements",
        "title": "Arbitrage transversal des chevauchements",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Une même conséquence mortelle ne bénéficie que d’un seul effet surnaturel d’annulation/report/remplacement de Mort, sauf exception écrite. Compagnon, double, invocation ou projection contrôlée : aucun pool de PA joueur indépendant sauf règle explicite. Pouvoir copié/emprunté : conserve les prérequis de Nature, V/SR/R et lien externe sauf exception explicite. Une réaction pré-fuite doit l’indiquer ; aucune poursuite rétroactive après téléportation résolue. Une Altération automatique n’en crée pas une seconde de même nature si l’action en accordait déjà une. Voir sous le Voile n’est jamais Révéler."
          }
        ]
      },
      {
        "id": "4-defense-occulte-et-puissance-des-effets",
        "title": "4. Défense occulte et Puissance des effets",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Une imposition directe sur esprit, âme, volonté, identité ou intérieur du corps utilise la Défense occulte. Un phénomène physiquement évitable utilise la Défense physique. Jamais les deux pour le même effet. Défense occulte Formule Passive Volonté + Force Mentale Active — 1 PA Volonté + Force Mentale + 1d10e Puissance Valeur Jet de création connu résultat de création/maintien Source présente jet approprié de la Source Autonome 12 mineur ; 15 courant ; 18 fort ; 21 majeur ; 25 exceptionnel"
          }
        ]
      }
    ]
  },
  {
    "id": "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    "title": "Voile, V/SR/R, continuité, objets, mobilité, compagnons, réseaux & interfaces",
    "tags": [
      "Vérité",
      "Voile",
      "V",
      "SR",
      "R",
      "continuité",
      "mobilité",
      "compagnons",
      "réseaux",
      "interfaces"
    ],
    "sections": [
      {
        "id": "5-hologramme-voile-semi-revelation-et-revelation",
        "title": "5. Hologramme, Voile, Semi-Révélation et Révélation",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "L’Hologramme est un construct technomagique planétaire qui traduit physiquement les êtres et phénomènes de Vérité en une cohérence humaine. Ce n’est pas une simple illusion visuelle. État Effet V forme traduite ; capacités compatibles V seulement SR Vérité partielle, métastable, normalement une scène maximum R Vérité pleinement exprimée ; l’apparence peut rester humaine selon la Nature Transition sous pression : normalement 1 PA, jet seulement si opposition active. Aucune action générique ne force R V ; seuls les effets qui → l’autorisent explicitement le peuvent. Cible Observation Cible V V/SR/R voient normalement la traduction, sauf perception spéciale Cible SR V voit la traduction ; SR/R voit la Vérité partielle Cible R la Vérité exprimée est visible par tous Un observateur R ne voit pas automatiquement la Vérité d’une cible restée V. Voir sous le Voile ne Révèle pas. L’Hologramme peut corriger souvenirs et preuves ordinaires. Les supports invariants résistent aux corrections ordinaires mais n’enregistrent jamais ce que leurs capteurs n’ont pas perçu. HDS/Holojamer peut maintenir V et bloquer V SR/R ; aucun R V → → générique."
          }
        ]
      },
      {
        "id": "dissimulation-surnaturelle-et-capteurs",
        "title": "Dissimulation surnaturelle et capteurs",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Lorsqu’un effet indique qu’une cible devient surnaturellement invisible, les perceptions profanes ordinaires suivent normalement la traduction de la Réalité/Hologramme : vision, caméras et capteurs ordinaires ne révèlent pas la cible. Une perception véritablement surnaturelle et adaptée peut néanmoins la percevoir lorsque sa nature le permet. Un pouvoir qui décrit une dissimulation plus limitée suit son propre texte."
          }
        ]
      },
      {
        "id": "6-continuite-corporelle-objets-et-mobilite-ailee",
        "title": "6. Continuité corporelle, objets et Mobilité ailée",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Une seule histoire de blessures suit le personnage entre états et formes. Si Vigueur change, PV max et actuels varient immédiatement de 2 × la variation ; une baisse de forme ne fait pas passer un personnage positif sous 1 PV. Changer de forme ne soigne jamais."
          }
        ]
      },
      {
        "id": "deplacement-multiplie",
        "title": "Déplacement multiplié",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Lorsqu’une Nature indique Déplacement ×2 ou environ ×2, chaque PA de Déplacement couvre 2 × (5 + Athlétisme) mètres lorsque le terrain et la morphologie concernés sont réellement adaptés. Ce multiplicateur ne crée aucun PA supplémentaire."
          }
        ]
      },
      {
        "id": "mobilite-ailee-convention-pj",
        "title": "Mobilité ailée — convention PJ",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Avec des ailes fonctionnelles, un Déplacement peut devenir un grand déplacement aérien soutenu, franchir un vide, gagner/perdre fortement de l’altitude et ignorer des obstacles au sol. Le personnage doit terminer sur un support ou s’y agripper. Pas de vol stationnaire ni de combat aérien permanent par défaut."
          }
        ]
      },
      {
        "id": "objets-et-projectiles",
        "title": "Objets et projectiles",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Une transformation ne duplique ni ne restaure un objet consommé. Un effet de Vérité attaché à un projectile suit son propre support et sa durée ; aucun principe générique ne permet d’accumuler plusieurs enchantements équivalents."
          }
        ]
      },
      {
        "id": "7-humains-chasseurs-reconnus-humanite-et-integrite",
        "title": "7. Humains, Chasseurs reconnus, Humanité et Intégrité",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "L’Humain conscient connaît la Vérité mais peut encore subir des corrections. Un véritable Chasseur est reconnu par l’Hologramme : les corrections civiles ordinaires cessent d’effacer ce qu’il a réellement vu, sans lui donner vision de V, identification automatique ni immunité aux attaques explicites de mémoire. Valeur Règle Intégrité Force Mentale + Humanité, minimum 1 Stress augmentique max Vigueur + Humanité Charge augmentique jauge indépendante utilisant l’Intégrité Corruption jauge indépendante utilisant la même Intégrité Seules les valeurs permanentes de Force Mentale/Humanité modifient l’Intégrité."
          }
        ]
      },
      {
        "id": "8-compagnons-lies-et-reseaux-de-verite",
        "title": "8. Compagnons liés et réseaux de Vérité",
        "level": 2,
        "blocks": [
          {
            "type": "p",
            "text": "Compagnon = PNJ réel avec stats, PV, sens, pouvoirs, faiblesses et personnalité. Par défaut un seul compagnon actif. Aucun pool de PA indépendant ; actions tactiques et défenses utilisent les PA du maître. Perdre la créature ne fait pas perdre le Talent ; PTV achète le lien, jamais la créature. Développements communs : Lien surnaturel 2 ; Résonance liée 1 ; Accueil de l’essence 2 ; Invocation liée 3."
          }
        ]
      },
      {
        "id": "reseaux-de-verite",
        "title": "Réseaux de Vérité",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Un Talent de réseau ne crée jamais vendeur, planque, filière, marchandise ou service. Il représente l’intégration suffisante pour lire et exploiter codes, signes, procédures, relais et voies clandestines d’un réseau qui existe réellement. Disponibilité, prix, délais et risques restent fictionnels. Cette règle couvre notamment Syndicat de Jade, Mafia Shaediri, Shaekori et réseaux analogues. Certaines institutions restent volontairement sans arbre PTV lorsque leur intérêt est principalement statutaire ou logistique."
          }
        ]
      },
      {
        "id": "9-equipement-de-verite-principe-commun",
        "title": "9. Équipement de Vérité — principe commun",
        "level": 2,
        "blocks": []
      },
      {
        "id": "armure-corporelle-et-reductions",
        "title": "Armure corporelle et Réductions",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Une Armure corporelle est une Armure de base portée par le corps lui-même : peau, carapace, tissus minéralisés, armure dermique ou protection surnaturelle explicitement corporelle. Par défaut, une « Armure naturelle » de Vérité doit être lue comme une Armure corporelle. L’Armure est la couche matérielle de base ; les Réductions typées (Mêlée, Antichoc, Balistique, Feu, Neuro, etc.) restent distinctes et ne s’appliquent qu’à leur vecteur. Pour le cumul, utiliser la meilleure Armure corporelle applicable ; elle peut se cumuler avec l’Armure portée selon les règles de Réalité, mais deux couches corporelles ne s’additionnent pas sauf texte explicite."
          }
        ]
      },
      {
        "id": "interfaces-etrangeres-et-neurodive",
        "title": "Interfaces étrangères et Neurodive",
        "level": 3,
        "blocks": [
          {
            "type": "p",
            "text": "Un système électronique, connecté ou en réseau n’est pas automatiquement compatible avec le Neurodive terrestre. Il faut une voie de données réelle et une interface/protocole compatibles, traduits ou effectivement adaptés. Une fois cette compatibilité obtenue, Intrusion, Contrôle et Neurocombat utilisent le moteur Neurodive normal. Magie pure, âme, tissu biologique, pouvoir de Nature ou substrat technobiologique sans interface accessible ne deviennent jamais des cibles Neuro par leur seule existence ; le nuage nanitique intégré d’un Homo Superior n’est notamment pas Neuro-hackable par défaut. PTV achète une maîtrise, technique, calibration ou capacité d’exploitation, jamais la possession d’un objet. Perdre un objet ne fait pas perdre les PTV investis. Prototype = objet réel, volable, destructible, réparable et parfois utilisable par un tiers. Un objet fixe n’accorde jamais les Talents de son créateur. Artefacts uniques, armes de lignée et reliques de PNJ restent hors catalogue ordinaire."
          }
        ]
      }
    ]
  }
] as const;
export const COMPENDIUM_VERITE_V7_RULE_ARTICLES:Article[]=SOURCE_ARTICLES.map(a=>({...a,tags:[...a.tags],dataset:"verite-v7",category:"Règles",sourceCategory:"Règles",source:SOURCE,status:"canon_enrichi",rebuildV2:true,sections:a.sections as unknown as Section[]}));
export const COMPENDIUM_VERITE_V7_RULE_NAVIGATION=[
{id:"regles-verite-v7-architecture-ptv-acces",dataset:"verite-v7",category:"Règles",group:"Socle Vérité",groupOrder:40,subgroup:"Architecture & progression",subgroupOrder:10,pageOrder:10,displayTitle:"Architecture, PTV & accès"},
{id:"regles-verite-v7-pa-reactions-defense-puissance",dataset:"verite-v7",category:"Règles",group:"Socle Vérité",groupOrder:40,subgroup:"Action & opposition",subgroupOrder:20,pageOrder:10,displayTitle:"PA, Réactions, Défense occulte & Puissance"},
{id:"regles-verite-v7-voile-continuite-objets-reseaux-interfaces",dataset:"verite-v7",category:"Règles",group:"Socle Vérité",groupOrder:40,subgroup:"Voile & continuité",subgroupOrder:30,pageOrder:10,displayTitle:"Voile, V/SR/R, continuité, objets, mobilité, compagnons, réseaux & interfaces"}
];