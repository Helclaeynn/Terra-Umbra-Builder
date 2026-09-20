type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };

type Section = {
  id: string;
  title: string;
  level: number;
  audience?: "mj";
  blocks: Block[];
};

type Article = {
  id: string;
  dataset: string;
  category: string;
  sourceCategory: string;
  title: string;
  source: string;
  status: string;
  rebuildV2: true;
  tags: string[];
  sections: Section[];
};

const SOURCE = "TUC_Verite_V7_CROSSAUDIT_2026-09-10.pdf";

const p = (text: string, style?: string): Block => ({ type: "p", text, ...(style ? { style } : {}) });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

export const COMPENDIUM_VERITE_V7_RULE_ARTICLES: Article[] = [
  {
    id: "regles-verite-v7-architecture-ptv-acces",
    dataset: "verite-v7",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Architecture, PTV & accès",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Vérité", "PTV", "XP", "Nature", "Origine", "Tradition", "Statut", "accès", "cross-training"],
    sections: [
      {
        id: "architecture",
        title: "Les couches de la Vérité",
        level: 2,
        blocks: [
          p("La Vérité distingue ce que le personnage est, ce qu'il a hérité, ce qu'il a appris et ce qu'il possède. Ces couches ne sont pas interchangeables : un objet ne devient pas une Nature, un rang social ne devient pas automatiquement un pouvoir et une compétence profane ne remplace pas une aptitude de Vérité."),
          table([
            ["Couche", "Principe"],
            ["Nature", "Ce que le personnage est réellement."],
            ["Origine / héritage", "Branche de Nature, ascendance ou héritage propre à la Vérité."],
            ["Tradition / doctrine / fonction", "Formation distinctive ; elle peut être surnaturelle, technique, culturelle ou opérationnelle."],
            ["Statut", "Habilitation, rang, réputation ou fonction sociale ; narratif sauf maîtrise distincte explicitement décrite."],
            ["Équipement", "Ce que le personnage possède. La possession n'est jamais achetée avec des PTV."]
          ]),
          p("Les mêmes termes peuvent avoir une importance différente selon les peuples. Une Cour vampirique, un Pelage garou, une École de Magie, une Fonction daemoniaque ou une tradition de Chasse s'inscrivent dans cette architecture sans devenir pour autant le même type de phénomène.")
        ]
      },
      {
        id: "xp-ptv",
        title: "XP et PTV ne mesurent pas la même progression",
        level: 2,
        blocks: [
          p("L'XP décrit l'expertise profane : compétences, attributs et progression générale du personnage dans le monde visible."),
          p("Les Points de Vérité (PTV) décrivent ce que le personnage est, ce qu'une tradition de Vérité lui a appris à devenir ou une manière exceptionnelle d'exploiter sa Nature, sa doctrine ou sa fonction."),
          p("Un Talent de Vérité peut améliorer une action profane lorsqu'il représente réellement une aptitude distinctive qui s'ajoute à l'expertise. Il ne remplace pas simplement un métier, une connaissance, une ressource, un outil ou un accès que le personnage ne possède pas.")
        ]
      },
      {
        id: "talents-competences",
        title: "Talents de Vérité et Compétences profanes",
        level: 2,
        blocks: [
          p("Lorsqu'un ancien effet de Vérité exprimait une « Compétence au minimum X » pour représenter une aptitude surnaturelle ou une discipline de Vérité, le modèle V7 privilégie un bonus +X. Le novice bénéficie ainsi réellement de son aptitude tandis qu'un spécialiste peut dépasser ce qu'aurait imposé un minimum fixe."),
          p("Une amélioration profane reste légitime si elle exprime une Nature, une discipline ou une doctrine identifiable : bonus, relance, modification de DR, auto-Assistance ou exception d'action. Elle ne doit jamais servir de raccourci générique pour acheter avec des PTV ce qui relève normalement de l'XP ou de la fiction.")
        ]
      },
      {
        id: "couts",
        title: "Échelle de coût des Talents",
        level: 2,
        blocks: [
          table([
            ["Coût", "Intention"],
            ["1 PTV", "Signature utile, ouverture spécialisée ou capacité étroite mais réellement distinctive."],
            ["2 PTV", "Effet puissant ou modification notable d'une règle."],
            ["3 PTV", "Effet majeur, rare ou ouvrant une nouvelle dimension d'action."]
          ]),
          p("Cette échelle guide la conception ; le coût exact d'un Talent canonique reste celui de son arbre. Un effet exceptionnel n'est pas automatiquement disponible simplement parce qu'un personnage possède assez de PTV : prérequis et accès continuent de s'appliquer.")
        ]
      },
      {
        id: "acces",
        title: "Accès N / O / R / X",
        level: 2,
        blocks: [
          table([
            ["Code", "Nom", "Sens"],
            ["N", "Naturel", "Accès canonique ou culturel de la Nature ; le Talent doit encore être acheté."],
            ["O", "Ouvert", "Formation possible avec un mentor, une institution ou un apprentissage crédible."],
            ["R", "Restreint", "Origine rare, initiation, secret ou accès difficile nécessaire."],
            ["X", "Incompatible", "Incompatibilité réelle de Nature, de physiologie ou de principe."]
          ]),
          p("Le code d'accès ne remplace jamais les prérequis internes de l'arbre. Il décrit qui peut raisonnablement apprendre la voie, pas le prix complet de chaque capacité.")
        ]
      },
      {
        id: "cross-training",
        title: "Cross-training et limites réelles",
        level: 2,
        blocks: [
          p("Le cross-training est possible lorsque la fiction le permet. Une personne peut apprendre hors de sa tradition d'origine si elle rencontre un mentor, une méthode et les conditions nécessaires."),
          p("Les signatures racines, prérequis biologiques, initiatiques ou matériels restent cependant applicables. Une technique reposant sur un organe, un état de Révélation, une consécration ou une infrastructure particulière ne devient pas universelle parce qu'elle a été observée.")
        ]
      },
      {
        id: "doctrines-fonctions",
        title: "Doctrines, fonctions et voies non surnaturelles",
        level: 2,
        blocks: [
          p("Une voie PTV peut représenter une doctrine, une fonction ou une culture opérationnelle de Vérité sans être elle-même surnaturelle. Elle est légitime lorsqu'elle formalise une manière distinctive d'agir, d'intégrer une faction ou d'exploiter ses codes."),
          p("Les Hordes, la Croix d'Emphyrra, le Syndicat de Jade, la Mafia Shaediri et d'autres réseaux peuvent ainsi posséder des maîtrises de Vérité sans que le Talent fasse apparaître l'organisation, ses ressources ou sa logistique.")
        ]
      },
      {
        id: "statut-equipement",
        title: "Statut, accès et possession",
        level: 2,
        blocks: [
          p("Un rang, une habilitation ou une réputation reste narratif tant qu'aucune maîtrise distincte n'est définie. Acheter une technique ne confère pas automatiquement le grade, le laboratoire, le vendeur ou l'autorité qui l'entourent."),
          p("Les PTV n'achètent jamais directement une arme, un prototype, un compagnon, une planque ou un service. Ils peuvent acheter la maîtrise, la calibration, le lien ou la capacité d'exploitation permettant d'utiliser pleinement quelque chose qui existe réellement dans la fiction.")
        ]
      }
    ]
  },
  {
    id: "regles-verite-v7-pa-reactions-defense-puissance",
    dataset: "verite-v7",
    category: "Règles",
    sourceCategory: "Règles",
    title: "PA, Réactions, Défense occulte & Puissance",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Vérité", "PA", "Réaction", "non-cumul", "Défense occulte", "Puissance", "Volonté", "Force Mentale"],
    sections: [
      {
        id: "actions-pa",
        title: "Actions et coût en PA",
        level: 2,
        blocks: [
          p("Une capacité active de Vérité coûte 1 PA par défaut. Une capacité peut demander 2 ou 3 PA, une préparation longue ou une autre procédure lorsque son texte l'indique."),
          p("Le maximum normal reste 3 PA. Une capacité qui augmente ce maximum accorde normalement au plus +1 PA, portant le personnage à 4 ; plusieurs gains directs de PA ne se cumulent pas sauf exception explicitement écrite."),
          p("Exception canonique : le Surrégime du Garou Écarlate peut se cumuler avec le +1 PA de la forme Hybride et atteindre 5 PA. Cette exception ne crée pas une règle générale de cumul.")
        ]
      },
      {
        id: "reactions",
        title: "Réactions",
        level: 2,
        blocks: [
          p("Une Réaction dépense normalement 1 PA. Un effet peut créer un PA de Réaction spécialisé ; ce PA ne devient pas un PA général et ne sert qu'aux réactions prévues par le texte."),
          p("Une réaction qui doit intervenir avant une fuite, une téléportation ou une disparition doit l'indiquer explicitement. Une fois le déplacement instantané résolu, aucune poursuite rétroactive n'est créée par défaut.")
        ]
      },
      {
        id: "non-cumul",
        title: "Règles de non-cumul",
        level: 2,
        blocks: [
          table([
            ["Chevauchement", "Arbitrage commun"],
            ["Relance de Talent", "Une seule relance de Talent maximum par test."],
            ["Réduction générique de Difficulté", "Une seule réduction externe maximum ; les moteurs internes qui définissent leur propre échelle suivent leur texte."],
            ["Effets équivalents", "Deux effets substantiellement identiques ne se cumulent pas, sauf mention explicite."],
            ["Assistance", "Une seule Assistance effective peut s'appliquer à un même test."],
            ["Annulation ou report de Mort", "Une seule protection surnaturelle s'applique à une même conséquence mortelle, sauf exception écrite."],
            ["Altération automatique", "N'ajoute pas une seconde Altération de même nature si l'action en accordait déjà une."]
          ]),
          p("Les systèmes internes possédant leur propre logique — par exemple certaines étapes de construction magique — ne sont pas aplatis par cette règle : leur texte spécifique reste prioritaire.")
        ]
      },
      {
        id: "appendices",
        title: "Membres supplémentaires et économie d'action",
        level: 2,
        blocks: [
          p("Bras, tentacules, queues, ailes et autres appendices supplémentaires n'accordent jamais par leur seule existence un PA, une Attaque, une Défense active ou une Réaction supplémentaire."),
          p("Ils peuvent autoriser des actions, prises, formes de déplacement ou capacités prévues par la Nature ; l'économie d'action reste celle du Moteur tant qu'une exception n'est pas explicitement écrite.")
        ]
      },
      {
        id: "compagnons-doubles",
        title: "Compagnons, doubles, invocations et projections",
        level: 2,
        blocks: [
          p("Un compagnon lié, double, invocation ou projection contrôlée n'obtient pas un pool de PA joueur indépendant par défaut. Ses actions tactiques sont payées selon la règle qui le contrôle."),
          p("Une règle particulière peut créer une autonomie réelle ; elle doit l'indiquer. L'existence d'une seconde figurine ou d'un second corps ne suffit pas à doubler l'économie d'action.")
        ]
      },
      {
        id: "copie",
        title: "Pouvoirs copiés ou empruntés",
        level: 2,
        blocks: [
          p("Copier ou emprunter un pouvoir ne supprime pas ses prérequis de Nature, d'état V/SR/R ou de lien externe, sauf exception explicite. Une capacité qui dépend d'une physiologie, d'une consécration ou d'un réseau continue d'en dépendre.")
        ]
      },
      {
        id: "defense-occulte",
        title: "Défense occulte",
        level: 2,
        blocks: [
          p("Une imposition directe sur l'esprit, l'âme, la volonté, l'identité ou l'intérieur du corps utilise la Défense occulte. Un phénomène physiquement évitable utilise la Défense physique. On n'applique jamais les deux défenses au même effet."),
          table([
            ["Défense", "Formule"],
            ["Passive", "Volonté + Force Mentale"],
            ["Active — 1 PA", "Volonté + Force Mentale + 1d10e"]
          ]),
          p("Comme pour la Défense active du Moteur, le dé supplémentaire représente une dépense active de réaction et ne devient pas un bonus permanent.")
        ]
      },
      {
        id: "puissance",
        title: "Puissance d'un effet",
        level: 2,
        blocks: [
          p("Lorsqu'un effet possède déjà un résultat de création ou un jet de Source, ce résultat sert de Puissance. Lorsqu'aucun résultat ni opposant n'existe, utiliser l'échelle autonome commune."),
          table([
            ["Puissance autonome", "Valeur"],
            ["Mineure", "12"],
            ["Courante", "15"],
            ["Forte", "18"],
            ["Majeure", "21"],
            ["Exceptionnelle", "25"]
          ])
        ]
      },
      {
        id: "repere",
        title: "Priorité des règles",
        level: 2,
        blocks: [
          p("Ces conventions sont le socle transversal. Une Nature, un Talent ou un moteur spécialisé peut écrire une exception ; l'exception s'applique alors à son propre périmètre sans devenir automatiquement une nouvelle règle générale.")
        ]
      }
    ]
  },
  {
    id: "regles-verite-v7-voile-continuite-objets-reseaux-interfaces",
    dataset: "verite-v7",
    category: "Règles",
    sourceCategory: "Règles",
    title: "Voile, V/SR/R, continuité, objets, mobilité, compagnons, réseaux & interfaces",
    source: SOURCE,
    status: "canon_enrichi",
    rebuildV2: true,
    tags: ["Vérité", "Voile", "Hologramme", "V", "SR", "R", "continuité", "PV", "compagnons", "réseaux", "Neurodive", "PTV"],
    sections: [
      {
        id: "hologramme",
        title: "Hologramme et états de Révélation",
        level: 2,
        blocks: [
          p("L'Hologramme est un construct technomagique planétaire qui traduit physiquement les êtres et phénomènes de Vérité dans une cohérence humaine. Il ne s'agit pas d'une simple illusion visuelle."),
          table([
            ["État", "Effet mécanique général"],
            ["Voilé (V)", "Forme traduite ; seules les capacités compatibles avec V sont disponibles."],
            ["Semi-Révélé (SR)", "Vérité partielle et métastable ; normalement une scène maximum par défaut."],
            ["Révélé (R)", "Vérité pleinement exprimée ; l'apparence peut rester humaine si la Nature le prévoit."]
          ]),
          p("Sous pression, une transition coûte normalement 1 PA. Un jet n'est demandé que lorsqu'une opposition active le justifie. Aucune action générique ne force un personnage de R vers V ; seuls les effets qui l'autorisent explicitement le peuvent.")
        ]
      },
      {
        id: "observation",
        title: "Observation selon l'état",
        level: 2,
        blocks: [
          table([
            ["Cible", "Observation ordinaire"],
            ["Cible V", "Les observateurs V, SR ou R voient normalement la traduction, sauf perception spéciale."],
            ["Cible SR", "Un observateur V voit la traduction ; SR ou R perçoit la Vérité partielle."],
            ["Cible R", "La Vérité exprimée est visible par tous les témoins présents."]
          ]),
          p("Un observateur Révélé ne voit pas automatiquement la Vérité d'une cible restée Voilée. Voir sous le Voile ne Révèle jamais la cible et ne modifie pas ses capacités disponibles.")
        ]
      },
      {
        id: "preuves-hds",
        title: "Preuves, invariance et HDS",
        level: 2,
        blocks: [
          p("L'Hologramme peut corriger souvenirs et preuves ordinaires. Un support invariant résiste aux corrections ordinaires mais n'enregistre jamais une information que son capteur n'a pas perçue."),
          p("Un HDS/Holojamer peut maintenir un être en V et bloquer une progression V → SR/R lorsqu'il est applicable. Il n'existe pas d'action générique HDS qui force un être déjà Révélé à retourner en V.")
        ]
      },
      {
        id: "dissimulation",
        title: "Dissimulation surnaturelle et capteurs",
        level: 2,
        blocks: [
          p("Lorsqu'un effet rend une cible surnaturellement invisible, les perceptions profanes ordinaires suivent normalement la traduction : vision, caméras et capteurs ordinaires ne révèlent pas la cible."),
          p("Une perception véritablement surnaturelle et adaptée peut néanmoins la détecter si sa nature le permet. Un pouvoir décrivant une dissimulation plus limitée suit son propre texte.")
        ]
      },
      {
        id: "continuite",
        title: "Continuité corporelle et blessures",
        level: 2,
        blocks: [
          p("Un personnage conserve une seule histoire de blessures entre états et formes. Changer de forme ne soigne jamais."),
          p("Si la Vigueur change, les PV maximum et actuels varient immédiatement de 2 × la variation de Vigueur. Lorsqu'une baisse de forme réduit ce total, un personnage qui était encore positif ne tombe pas sous 1 PV par ce seul recalcul."),
          p("Les prothèses, augmentations et modifications durablement intégrées suivent normalement la traduction corporelle. Ce qui est seulement porté reste un objet distinct.")
        ]
      },
      {
        id: "deplacement",
        title: "Déplacement multiplié",
        level: 2,
        blocks: [
          p("Lorsqu'une Nature indique Déplacement ×2 ou environ ×2, chaque PA de Déplacement couvre 2 × (5 + Athlétisme) mètres lorsque le terrain et la morphologie concernés sont réellement adaptés."),
          p("Ce multiplicateur ne crée aucun PA supplémentaire et ne double pas automatiquement les autres actions liées au mouvement.")
        ]
      },
      {
        id: "mobilite-ailee",
        title: "Mobilité ailée — convention PJ",
        level: 2,
        blocks: [
          p("Avec des ailes fonctionnelles, un Déplacement peut devenir un grand déplacement aérien soutenu, franchir un vide, gagner ou perdre fortement de l'altitude et ignorer des obstacles au sol."),
          p("Le personnage doit terminer son déplacement sur un support ou s'y agripper. Par défaut, les ailes ne donnent ni vol stationnaire permanent ni sous-système de combat aérien continu.")
        ]
      },
      {
        id: "objets-projectiles",
        title: "Objets, transformations et projectiles",
        level: 2,
        blocks: [
          p("Une transformation ne duplique ni ne restaure un objet consommé. Une munition, un outil ou une ressource dépensée reste dépensée après un changement de forme."),
          p("Un effet de Vérité attaché à un projectile suit son propre support et sa propre durée. Aucun principe générique ne permet d'empiler plusieurs enchantements substantiellement équivalents sur le même effet.")
        ]
      },
      {
        id: "humanite-integrite",
        title: "Humains, Chasseurs reconnus, Humanité & Intégrité",
        level: 2,
        blocks: [
          p("Un Humain conscient de la Vérité peut encore subir les corrections du Voile. Un véritable Chasseur reconnu par l'Hologramme conserve ce qu'il a réellement vu malgré les corrections civiles ordinaires, sans gagner vision de V, identification automatique ni immunité aux attaques explicites de mémoire."),
          table([
            ["Valeur", "Règle"],
            ["Intégrité", "Force Mentale + Humanité, minimum 1."],
            ["Stress augmentique maximum", "Vigueur + Humanité."],
            ["Charge augmentique", "Jauge indépendante utilisant l'Intégrité."],
            ["Corruption", "Jauge indépendante utilisant la même Intégrité."]
          ]),
          p("Seules les valeurs permanentes de Force Mentale et d'Humanité modifient l'Intégrité.")
        ]
      },
      {
        id: "compagnons",
        title: "Compagnons liés",
        level: 2,
        blocks: [
          p("Un compagnon lié est un véritable PNJ avec ses propres statistiques, PV, sens, pouvoirs, faiblesses et personnalité. Par défaut, un seul compagnon est actif."),
          p("Le compagnon ne possède pas un pool de PA joueur indépendant : ses actions tactiques et ses défenses utilisent les PA du maître selon la règle de contrôle applicable."),
          p("Perdre la créature ne fait pas perdre le Talent. Les PTV achètent le lien, jamais la créature elle-même."),
          table([
            ["Développement commun", "Coût"],
            ["Lien surnaturel", "2 PTV"],
            ["Résonance liée", "1 PTV"],
            ["Accueil de l'essence", "2 PTV"],
            ["Invocation liée", "3 PTV"]
          ])
        ]
      },
      {
        id: "reseaux",
        title: "Réseaux de Vérité",
        level: 2,
        blocks: [
          p("Un Talent de réseau ne crée jamais vendeur, planque, filière, marchandise ou service. Il représente l'intégration suffisante pour reconnaître et exploiter les codes, signes, procédures, relais et voies clandestines d'un réseau qui existe réellement."),
          p("Disponibilité, prix, délais et risques restent fictionnels. Le principe couvre notamment le Syndicat de Jade, la Mafia Shaediri, les Shaekori et les réseaux analogues."),
          p("Certaines institutions peuvent rester volontairement sans arbre PTV lorsque leur intérêt est surtout statutaire ou logistique.")
        ]
      },
      {
        id: "armure-corporelle",
        title: "Armure corporelle et Réductions",
        level: 2,
        blocks: [
          p("Une Armure naturelle de Vérité se lit par défaut comme une Armure corporelle : peau, carapace, tissus minéralisés, armure dermique ou protection explicitement portée par le corps."),
          p("L'Armure reste la couche matérielle de base ; les Réductions typées — Mêlée, Antichoc, Balistique, Feu, Neuro ou autre — restent distinctes et ne s'appliquent qu'à leur vecteur."),
          p("Pour le cumul, utiliser la meilleure Armure corporelle applicable. Elle peut se cumuler avec l'Armure portée selon les règles de Réalité ; deux couches corporelles ne s'additionnent pas sauf texte explicite.")
        ]
      },
      {
        id: "interfaces-neurodive",
        title: "Interfaces étrangères et Neurodive",
        level: 2,
        blocks: [
          p("Un système électronique, connecté ou en réseau n'est pas automatiquement compatible avec le Neurodive terrestre. Il faut une voie de données réelle et une interface ou un protocole compatible, traduit ou effectivement adapté."),
          p("Une fois cette compatibilité obtenue, Intrusion, Contrôle et Neurocombat utilisent le moteur Neurodive normal."),
          p("Magie pure, âme, tissu biologique, pouvoir de Nature ou substrat technobiologique sans interface accessible ne deviennent jamais des cibles Neuro par leur seule existence. Le nuage nanitique intégré d'un Homo Superior n'est notamment pas Neuro-hackable par défaut.")
        ]
      },
      {
        id: "ptv-objets",
        title: "PTV, objets et prototypes",
        level: 2,
        blocks: [
          p("Les PTV achètent une maîtrise, une technique, une calibration ou une capacité d'exploitation ; jamais la possession d'un objet."),
          p("Perdre un objet ne fait donc pas perdre les PTV investis dans la maîtrise correspondante. Un prototype reste un objet réel : il peut être volé, détruit, réparé et parfois utilisé par un tiers."),
          p("Un objet fixe n'accorde jamais automatiquement les Talents de son créateur. Les artefacts uniques, armes de lignée et reliques de PNJ restent hors du catalogue ordinaire.")
        ]
      }
    ]
  }
];

export const COMPENDIUM_VERITE_V7_RULE_NAVIGATION = [
  { id: "regles-verite-v7-architecture-ptv-acces", dataset: "verite-v7", category: "Règles", group: "Socle Vérité", groupOrder: 40, subgroup: "Architecture & progression", subgroupOrder: 10, pageOrder: 10, displayTitle: "Architecture, PTV & accès" },
  { id: "regles-verite-v7-pa-reactions-defense-puissance", dataset: "verite-v7", category: "Règles", group: "Socle Vérité", groupOrder: 40, subgroup: "Action & opposition", subgroupOrder: 20, pageOrder: 10, displayTitle: "PA, Réactions, Défense occulte & Puissance" },
  { id: "regles-verite-v7-voile-continuite-objets-reseaux-interfaces", dataset: "verite-v7", category: "Règles", group: "Socle Vérité", groupOrder: 40, subgroup: "Voile & continuité", subgroupOrder: 30, pageOrder: 10, displayTitle: "Voile, V/SR/R, continuité, objets, mobilité, compagnons, réseaux & interfaces" }
];
