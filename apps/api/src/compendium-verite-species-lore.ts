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

const SOURCE = "TUC_Vérité_ les espèces  surnaturelles(1).docx";
const p = (text: string): Block => ({ type: "p", text });

function article(id: string, title: string, tags: string[], sections: Section[]): Article {
  return {
    id,
    dataset: "verite-species",
    category: "Vérité",
    sourceCategory: "Vérité",
    title,
    source: SOURCE,
    status: "canon_source",
    rebuildV2: true,
    tags,
    sections
  };
}

export const COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES: Article[] = [
  article(
    "verite-especes-creatures-ombres",
    "Ombres — Voyageurs, Deimons & Projections",
    ["Vérité", "Créatures", "Ombres", "Voyageurs", "Deimons", "Projections", "Ombremonde"],
    [
      {
        id: "les-ombres",
        title: "Les Ombres",
        level: 2,
        blocks: [
          p("Le Livre des espèces surnaturelles classe parmi les « Créatures » plusieurs familles vivant largement en marge des sociétés humaines et des peuples surnaturels organisés. Les Ombres sont des créatures spirituelles dont la plupart furent enfermées avec la Magie dans l’Ombremonde. Certaines en sortent encore ou se sont maintenues sur Terre. Leur puissance spirituelle peut être immense : les individus les plus anciens peuvent rivaliser avec des Vampires très anciens, voire avec des puissances divines.")
        ]
      },
      {
        id: "voyageurs",
        title: "Voyageurs",
        level: 3,
        blocks: [
          p("Les Voyageurs regroupent de très anciennes espèces terrestres fortement liées à la Magie. Ils franchissent dimensions et illusions comme si les frontières n’étaient qu’un rideau, perturbent fortement l’Hologramme et ne reconnaissent aucune autorité commune. Le texte cite notamment les Croquemitaines, Amazones, Dises et Gorgones. Avec les Mages, ils comptent parmi les rares créatures décrites comme possédant des Mageius ; cette proximité fut aussi l’une des raisons de leur extermination par les Mages.")
        ]
      },
      {
        id: "deimons",
        title: "Deimons",
        level: 3,
        blocks: [
          p("Les Deimons sont décrits comme une très ancienne espèce immatérielle : des Esprits de l’Ombre polymorphes qui ont oublié ce qu’ils étaient à force de chercher à se maintenir dans le plan des mortels. Contrairement aux Voyageurs, ils ne circulent pas librement entre les dimensions et dépendent des mortels pour conserver leur présence. Goules, Barghests, Hellhests, Caith Sidh et Doppelgängers sont donnés comme exemples de formes attribuées à ces entités.")
        ]
      },
      {
        id: "projections",
        title: "Projections",
        level: 3,
        blocks: [
          p("Les Projections sont plus récentes. Elles sont les échos de créatures pensantes capables de pouvoirs : désirs, peurs, remords et inconscient peuvent engendrer des Cauchemars, Fantasmes ou Somnium. Elles dépendent d’un créateur et, le plus souvent, ne lui survivent pas.")
        ]
      }
    ]
  ),
  article(
    "verite-especes-creatures-revenants",
    "Revenants — Cadavres, Fantômes & Immortels",
    ["Vérité", "Créatures", "Revenants", "Cadavres", "Fantômes", "Immortels"],
    [
      {
        id: "nature-des-revenants",
        title: "Une mort qui ne s’achève pas",
        level: 2,
        blocks: [
          p("Les Revenants proviennent d’espèces vivantes. Après la mort, un corps ou une âme peut se réanimer sous l’effet d’un pouvoir, d’une volonté, d’une erreur du Cycle ou d’un processus prolongé. Toutes les espèces vivantes sont présentées comme potentiellement concernées. Le texte insiste sur leur danger : l’exposition répétée aux Revenants favoriserait à son tour l’apparition de nouveaux Revenants.")
        ]
      },
      {
        id: "cadavres",
        title: "Cadavres",
        level: 3,
        blocks: [
          p("Les Cadavres sont les Revenants matériels : des corps privés d’âme, animés par des résidus de souvenirs ou des mécanismes magiques. Leur vide les pousse souvent vers les vivants sans leur permettre pour autant de retrouver une âme. Zombies, squelettes, strigoï, Wendigos et momies sont cités parmi leurs formes.")
        ]
      },
      {
        id: "fantomes",
        title: "Fantômes",
        level: 3,
        blocks: [
          p("Les Fantômes représentent le cas inverse : une âme privée de son corps. Leur influence physique est généralement faible, ce qui les pousse à communiquer, à chercher un corps ou à prélever de l’énergie aux mortels. Spectres, Dames blanches, Sluaghs, Lémures et Skinwalkers sont cités comme exemples.")
        ]
      },
      {
        id: "immortels",
        title: "Immortels",
        level: 3,
        blocks: [
          p("Les Immortels sont des êtres qui ont perdu la vie sans parvenir à mourir : corps et âme subsistent, mais leur Nature n’est plus celle de leur espèce d’origine. Certains Chasseurs y rangent les Vampires, mais le document considère cette classification comme trop large et réserve plutôt la catégorie aux Liches et à d’autres cas singuliers.")
        ]
      }
    ]
  ),
  article(
    "verite-especes-creatures-fees",
    "Fées — Lutins, Élémentaires, Golems & Zoanides",
    ["Vérité", "Créatures", "Fées", "Lutins", "Élémentaires", "Djinns", "Golems", "Zoanides"],
    [
      {
        id: "esprits-naturels",
        title: "Esprits naturels de la Terre",
        level: 2,
        blocks: [
          p("Les Fées sont présentées comme des esprits naturels de la Terre. Elles servirent autrefois les dieux avant que ceux-ci ne privilégient les mortels et leurs grandes civilisations. Beaucoup se rapprochèrent alors des Voyageurs, notamment des Dises, mais furent durement écrasées dans les conflits avec les puissances divines. Elles restent craintives et pourtant extrêmement puissantes. Leur capacité à se reproduire avec les mortels et avec certaines Ombres a produit de nombreux hybrides.")
        ]
      },
      {
        id: "lutins",
        title: "Lutins",
        level: 3,
        blocks: [
          p("Le « petit peuple » comprend des communautés extrêmement secrètes que les légendes humaines ont décrites sous de nombreux noms. Farfadets, Boggarts, Chichigas et Gnomes sont cités. Ces groupes survivent encore en 2035 mais supportent mal l’intrusion de créatures mortelles dans leurs refuges.")
        ]
      },
      {
        id: "elementaires-djinns",
        title: "Élémentaires ou Djinns",
        level: 3,
        blocks: [
          p("Les Élémentaires sont liés à un environnement, à un élément et à un sanctuaire. Dryades, Naïades, Lampades et Cyberiades figurent parmi les exemples. Les Hamadryades illustrent la symbiose avec un arbre particulier. Souvent décrites autrefois comme des divinités mineures, ces Nymphes ont développé une forte hostilité envers les mortels et les dieux après les atteintes répétées à leurs sanctuaires.")
        ]
      },
      {
        id: "golems",
        title: "Golems",
        level: 3,
        blocks: [
          p("Les Golems sont des Fées artificielles créées à l’origine par les Voyageurs et les Mages pour leur protection. Très matériels là où beaucoup de Djinns sont immatériels, ils disposent de peu de pouvoirs propres mais peuvent posséder des capacités physiques considérables. Le document regroupe sous cette famille des êtres argileux, marionnettes, Homoncules ou androïdes. Certains peuvent parfaitement ressembler à des Humains ; comme les Cadavres, ils sont décrits comme privés d’âme et leur existence devient souvent instable lorsqu’ils prennent conscience de cette absence.")
        ]
      },
      {
        id: "zoanides",
        title: "Zoanides",
        level: 3,
        blocks: [
          p("Les Zoanides sont les Fées animales, esprits totémiques et protecteurs des bêtes. Les Khinae furent leurs protégés et de nombreuses lignées khinae bénéficient encore de leur bienveillance ; certaines partageraient même leur sang. Leur rapport aux mortels est contradictoire, fait à la fois d’attachement et de rejet. Le document souligne aussi la difficulté à distinguer certains Zoanides de Keltas venus d’Aèr, les deux pouvant être perçus comme des esprits animaux.")
        ]
      },
      {
        id: "creatures-et-chasse",
        title: "Créatures et Chasse",
        level: 2,
        blocks: [
          p("Ces Créatures vivent davantage dans la Vérité que dans la Réalité et influencent rarement directement les sociétés visibles. Le document les présente comme les adversaires les plus fréquents des Chasseurs. Vampires, Garous, Mages, Atlantes, Daemons et Angelus ne connaissent pas nécessairement ces familles tant qu’elles n’entrent pas en conflit avec eux.")
        ]
      }
    ]
  ),
  article(
    "verite-especes-creatures-abominations",
    "Abominations — serviteurs des Fléaux",
    ["Vérité", "Créatures", "Abominations", "Fléaux", "Corruption", "Ombremonde"],
    [
      {
        id: "deformation-par-les-fleaux",
        title: "Déformées par les Fléaux",
        level: 2,
        blocks: [
          p("Les Abominations constituent un dernier genre à part. Comme les ancêtres des Vampires, elles ont été déformées par la puissance des Fléaux ; contrairement aux Vampires, elles n’ont jamais échappé à leur domination et forment leurs principales forces. Toutes les espèces peuvent être touchées. Le document donne les Duergars whurtens et les Abyssaux possiblement issus des Aseryns comme exemples de peuples transformés.")
        ]
      },
      {
        id: "ouvrir-l-ombremonde",
        title: "Ouvrir l’Ombremonde",
        level: 2,
        blocks: [
          p("Leur objectif commun est d’ouvrir l’Ombremonde. Cela en fait les ennemies des peuples de la Vérité comme de la Réalité. Beaucoup vivent en groupes fanatiques autour d’une Abomination plus directement façonnée par un Fléau et servant d’intermédiaire avec lui.")
        ]
      },
      {
        id: "origine-et-conflits",
        title: "Origines, conflits et dissidences",
        level: 2,
        blocks: [
          p("Les Fléaux étant souvent d’origine extraterrestre, certaines Abominations sont décrites comme d’anciennes tribus aliens déformées qui ont oublié leur origine. Paradis et Enfers ne leur accordent aucune tolérance. Exilés, Vampires et Garous évitent plus volontiers les affrontements ouverts, car les communautés d’Abominations peuvent être beaucoup plus nombreuses qu’elles ne le paraissent. Les Voyageurs furent historiquement leurs ennemis, mais certains survivants de peuples brisés ont fini par rejoindre les Fléaux par désir de vengeance contre les dieux.")
        ]
      },
      {
        id: "immortalite-et-sectes",
        title: "Immortalité et sectes humaines",
        level: 2,
        blocks: [
          p("Certaines communautés établies près des tombeaux ou portails de leurs maîtres possèdent une forme d’immortalité. Chaque Fléau dispose en outre de sectes humaines qui glorifient les Abominations, les envient ou cherchent à en devenir. Le document rattache explicitement ces thèmes à l’imaginaire lovecraftien.")
        ]
      }
    ]
  )
];

export const COMPENDIUM_VERITE_SPECIES_LORE_NAVIGATION = [
  { id: "verite-especes-creatures-ombres", dataset: "verite-species", category: "Vérité", group: "Peuples & Natures", groupOrder: 30, subgroup: "Autres Créatures", subgroupOrder: 80, pageOrder: 10, displayTitle: "Ombres — Voyageurs, Deimons & Projections" },
  { id: "verite-especes-creatures-revenants", dataset: "verite-species", category: "Vérité", group: "Peuples & Natures", groupOrder: 30, subgroup: "Autres Créatures", subgroupOrder: 80, pageOrder: 20, displayTitle: "Revenants — Cadavres, Fantômes & Immortels" },
  { id: "verite-especes-creatures-fees", dataset: "verite-species", category: "Vérité", group: "Peuples & Natures", groupOrder: 30, subgroup: "Autres Créatures", subgroupOrder: 80, pageOrder: 30, displayTitle: "Fées — Lutins, Élémentaires, Golems & Zoanides" },
  { id: "verite-especes-creatures-abominations", dataset: "verite-species", category: "Vérité", group: "Peuples & Natures", groupOrder: 30, subgroup: "Autres Créatures", subgroupOrder: 80, pageOrder: 40, displayTitle: "Abominations — serviteurs des Fléaux" }
];

export const COMPENDIUM_VERITE_SPECIES_ENRICHMENTS = [
  {
    targetId: "verite-v7-vampires-civilisation-cours-sangs",
    sections: [
      {
        id: "cryptes-profondes-et-veilleurs",
        title: "Cryptes profondes & Veilleurs",
        level: 2,
        blocks: [
          p("Chaque communauté vampirique relève d’un Veilleur gardant une Crypte profonde. Ces sanctuaires renforcent la Nature vampirique et permettent de soigner des blessures extrêmes par l’intervention de l’Ombre. Ils constituent aussi des passages dangereux vers l’Ombremonde et donc vers les anciens maîtres que sont les Fléaux."),
          p("Le Veilleur est généralement un Vampire extrêmement ancien. Il ne peut quitter sa Crypte ni chasser librement, ce qui l’affaiblit malgré son âge. La proximité de la Crypte altère son apparence et fait réapparaître des caractéristiques khinae plus primitives. Des siècles ou des millénaires de faim peuvent rendre toute interaction avec lui dangereuse, y compris pour les nobles Vampires.")
        ]
      },
      {
        id: "principautes-serfs-et-implantation-2035",
        title: "Principautés, serfs & implantation en 2035",
        level: 2,
        blocks: [
          p("Le vocabulaire féodal vampirique se transpose directement dans la société moderne. Une « principauté » peut désigner un bâtiment ou une institution contrôlée par un Prince et les « serfs » son cheptel humain associé. Le grand laboratoire de recherches de Sunways à Los Angeles est ainsi cité comme principauté d’Elody Katheryn Skotia : s’attaquer aux personnes qui y travaillent peut devenir une affaire politique vampirique."),
          p("En Grande Californie, les jeunes Vampires recherchent souvent des activités leur donnant un accès discret au sang ou aux blessés, notamment dans le biomédical ou chez les Crawlers. Les plus anciens exploitent volontiers leur charisme dans les fonctions de pouvoir, le divertissement, le droit ou l’enquête. Le monde nocturne leur offre également des territoires naturels ; le Pinksun Nightclub de Beryx Draghici est cité comme établissement emblématique de la Krovni Rytsari.")
        ]
      }
    ]
  },
  {
    targetId: "verite-v7-garous-khinae-meutes-pelages",
    sections: [
      {
        id: "meutes-familles-primes-et-meneur",
        title: "Meutes, familles, Primes & Meneur",
        level: 2,
        blocks: [
          p("La structure garou se construit du bas vers le haut. La Meute constitue l’unité de base et peut réunir un couple alpha, sa parenté et ses descendants. Plusieurs couples alphas forment une famille et reconnaissent deux Grands Alphas chargés d’arbitrer les conflits et d’assurer la sécurité. Lors de rassemblements exceptionnels, ces Grands Alphas choisissent des Primes ; tous les vingt-cinq ans, les Primes élisent le Meneur du clan."),
          p("Le Meneur reçoit le nom du fondateur et dévore le cœur de son prédécesseur. Cette Dévoration lui transmet souvenirs, puissance et secrets au point que la succession est pensée comme une forme de continuité plutôt que comme un remplacement. La perte du corps d’un Meneur rompt cette chaîne mémorielle. Certains clans indépendants refusent cette autorité et certaines Meutes pratiquent elles-mêmes la Dévoration malgré le tabou.")
        ]
      },
      {
        id: "besoin-de-meute-en-2035",
        title: "Le besoin de Meute en 2035",
        level: 2,
        blocks: [
          p("Les Garous supportent mal l’isolement. Une vie familiale humaine ne suffit pas toujours à satisfaire le besoin de Meute d’un Garou véritable ; les solitaires peuvent accumuler stress, agressivité et dépression. La Meute est autant une relation fraternelle qu’une fonction commune : une « Chasse » peut être une traque animale, une mission d’infiltration, un assassinat, une bataille ou même une compétition sportive."),
          p("Cette logique explique leur présence fréquente chez les Crawlers, militaires, policiers, gangs, mafias, associations et équipes sportives. Les métiers physiques et les activités collectives conviennent particulièrement bien à leur physiologie et à leur besoin d’appartenance, sans constituer pour autant une obligation professionnelle.")
        ]
      }
    ]
  }
];
