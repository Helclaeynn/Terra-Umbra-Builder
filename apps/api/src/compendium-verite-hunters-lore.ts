import {
  COMPENDIUM_VERITE_HUNTERS_ARTICLES,
  COMPENDIUM_VERITE_HUNTERS_ENRICHMENTS
} from "./compendium-verite-hunters-source.js";

type Block =
  | { type: "p"; text: string; style?: string }
  | { type: "table"; rows: unknown[][] };

type Section = {
  id: string;
  title: string;
  level: number;
  blocks: Block[];
};

const lore = (text: string): Block => ({ type: "p", style: "lore", text });
const table = (rows: unknown[][]): Block => ({ type: "table", rows });

const SECTION_TITLE_FIXES: Record<string, string> = {
  "les-envouteurs": "Les envoûteurs",
  "chasseurs-shintoistes": "Chasseurs shintoïstes",
  "chasseurs-taoiste": "Chasseurs taoïstes",
  "l-influence-egyptienne": "L’influence égyptienne",
  "l-influence-hindouiste": "L’influence hindouiste",
  "l-influence-greco-romaine": "L’influence gréco-romaine",
  "l-influence-biblique": "L’influence biblique"
};

const TEXT_FIXES: Array<[RegExp, string]> = [
  [/\bXenochield\b/giu, "Xenoshield"],
  [/\bXenoShield\b/gu, "Xenoshield"],
  [/\bxenoshield\b/gu, "Xenoshield"],
  [/\bChretiens\b/gu, "Chrétiens"],
  [/\bChretienne\b/gu, "Chrétienne"],
  [/\bJesus\b/gu, "Jésus"],
  [/\bEtats-Unis\b/gu, "États-Unis"],
  [/\bMoyen-Age\b/gu, "Moyen Âge"],
  [/\bEvêque\b/gu, "Évêque"],
  [/\bEglise\b/gu, "Église"],
  [/\bEglises\b/gu, "Églises"],
  [/\bA l’instar\b/gu, "À l’instar"],
  [/\bA travers\b/gu, "À travers"],
  [/\bà proprement parlé\b/giu, "à proprement parler"],
  [/\bn’a rien avoir\b/giu, "n’a rien à voir"],
  [/\bn’ont rien avoir\b/giu, "n’ont rien à voir"],
  [/\bn’ont absolument rien avoir\b/giu, "n’ont absolument rien à voir"],
  [/\bhors pairs\b/giu, "hors pair"],
  [/\bpallier\b/giu, "palier"],
  [/\bquelque soit\b/giu, "quel que soit"],
  [/\bmaitrise\b/giu, "maîtrise"],
  [/\bmaitriser\b/giu, "maîtriser"],
  [/\bmaitrisé\b/giu, "maîtrisé"],
  [/\bmaitrisée\b/giu, "maîtrisée"],
  [/\bmaitre\b/giu, "maître"],
  [/\bmaitres\b/giu, "maîtres"],
  [/\bbrule\b/giu, "brûle"],
  [/\bentrainement\b/giu, "entraînement"],
  [/\bentrainés\b/giu, "entraînés"],
  [/\bentrainé\b/giu, "entraîné"],
  [/\bcoute\b/giu, "coûte"],
  [/\bshientaïstes\b/giu, "shientaoïstes"],
  [/\bShientaoisme\b/gu, "Shientaoïsme"],
  [/\bshientaoisme\b/gu, "shientaoïsme"],
  [/\bShintoistes\b/gu, "Shintoïstes"],
  [/\bshintoistes\b/gu, "shintoïstes"],
  [/\bTaoistes\b/gu, "Taoïstes"],
  [/\btaoistes\b/gu, "taoïstes"],
  [/\bEgyptienne\b/gu, "Égyptienne"],
  [/\begyptiens\b/gu, "égyptiens"],
  [/\bGreco-romaine\b/gu, "Gréco-romaine"],
  [/\bgracques\b/giu, "grecques"],
  [/\bpar exemples\b/giu, "par exemple"],
  [/ils sont été/giu, "ils ont été"],
  [/\bconnait qu’assez peur\b/giu, "connaît qu’assez peu"],
  [/\bconfréries indépendante\b/giu, "confréries indépendantes"],
  [/\bau japon\b/gu, "au Japon"],
  [/\bs’est vu évoluer\b/giu, "a évolué"],
  [/\blégitimiser\b/giu, "légitimer"],
  [/\bLa majorité de leurs temps\b/gu, "La majeure partie de leur temps"],
  [/\bIIIème\b/gu, "IIIe"],
  [/\bVème\b/gu, "Ve"],
  [/\bVIème\b/gu, "VIe"],
  [/\bVIIème\b/gu, "VIIe"],
  [/\bXème\b/gu, "Xe"],
  [/\bXIXème\b/gu, "XIXe"],
  [/\bBeowolf\b/gu, "Beowulf"],
  [/\bSaint George\b/gu, "saint Georges"],
  [/\bRoqya\b/gu, "Roqya"],
  [/\bde le\b/gu, "du"]
];

const cleanText = (raw: unknown) => {
  let text = String(raw ?? "")
    .replace(/[�￾]/gu, "-")
    .replace(/\s+/gu, " ")
    .replace(/\s+([,.])/gu, "$1")
    .replace(/\(\s+/gu, "(")
    .replace(/\s+\)/gu, ")")
    .trim();

  for (const [pattern, replacement] of TEXT_FIXES) {
    text = text.replace(pattern, replacement);
  }

  return text;
};

const CURATED_REWRITES: Array<[string, string[]]> = [
  [
    "Les différents cultes, des différentes civilisations",
    [
      "Dans les différentes civilisations, les cultes durent très tôt répondre à la prédation de créatures rares.",
      "Bien auparavant, les Atlantes s’étaient retirés sur leurs continents afin de ne pas interférer avec les Khinae. Les terres qu’ils laissèrent à ces derniers développèrent une très forte densité de créatures surnaturelles, soumises à une pression concurrentielle intense et à une grande porosité génétique entre espèces.",
      "Toutes les créatures de Terra Umbra ne descendent donc pas des Khinae, mais chacune a subi leur influence à un moment ou à un autre."
    ]
  ],
  [
    "L’Association n’est pas purement humaniste",
    [
      "L’Association n’est pas une organisation purement humaniste. Son poids dans la politique de la Vérité lui permet de favoriser certains chefs de communauté ou d’en combattre d’autres.",
      "Elle jugea ainsi Atreesha trop dangereuse lorsqu’elle poussait la communauté ashyll à se reproduire toujours davantage. La campagne lancée contre l’impératrice provoqua des massacres de Gobelins au nom de la régulation de leur nombre.",
      "L’Association ne parvint pas à faire remplacer Atreesha, mais la marqua assez profondément pour qu’elle respecte de nouveau le Secret."
    ]
  ],
  [
    "Le Xenoshield n’est pas composé d’agent en costume noir",
    [
      "Le Xenoshield ne rassemble pas des agents en costume noir semblables à ceux des fictions. Ses membres sont des soldats infiltrés dans des corporations ou des organisations criminelles. Ils portent une armure biotechnologique composée d’une enveloppe vivante et d’un exosquelette mécanique.",
      "Ils s’injectent aussi l’Hyperblood, un sang vampirique modifié qui leur confère temporairement certains dons. Les soldats en ignorent l’origine véritable ; ils savent surtout que le produit purge leur organisme des mutations, parasites et nanites extraterrestres."
    ]
  ],
  [
    "Parmi les « chasseurs de l’Église » leur mission est essentiellement double. D’abord",
    [
      "La mission de l’ordre d’Arianwen est double. Il assure d’abord la logistique commune aux trois grands ordres : usines, ateliers d’armes religieuses, transports et distribution de l’équipement relèvent de ses combattants comme de ses membres de soutien.",
      "L’ordre protège aussi les armes-reliques attribuées aux saints et aux Anges. Ses membres sont les seuls autorisés à les employer sans permission particulière du pape.",
      "Sa seconde mission est la traque armée : il élimine les créatures repérées par un exorciste lorsque celui-ci ne peut les affronter seul."
    ]
  ],
  [
    "Parmi les « chasseurs de l’Église » leur mission n’est pas d’enquêter sur place",
    [
      "Les Chasseurs de Magdalena enquêtent moins sur le terrain qu’ils ne recoupent les informations de l’Holonet avec les dossiers administratifs. Les Inquisiteurs s’infiltrent donc dans les gouvernements, les polices et les agences afin d’accéder à ces traces.",
      "Ils recherchent tout signe d’inhumanité : absence durable d’achats alimentaires, consommation d’énergie limitée à la nuit ou déplacements impossibles à expliquer par un véhicule. Ces anomalies ne prouvent rien isolément, mais leur convergence permet de sélectionner une cible."
    ]
  ],
  [
    "Les premiers ont plutôt hérité des traditions subsahariennes",
    [
      "Les Envoûteurs ont surtout hérité de traditions subsahariennes. Par leurs chants et leurs musiques, parfois comparés à ceux des charmeurs de serpents, ils influencent les Djinns, c’est-à-dire les Fées.",
      "Ces peuples de l’invisible sont souvent élémentaires : ils ne sont ni des Ombres ni des Revenants. Les Maritins regroupent les Hydriades, Naïades, Néréides, Sirènes ou Ondines ; les Sylphes célestes sont aussi connus comme Ouranies, Harpies ou Sylphides."
    ]
  ],
  [
    "Les Chasseurs « Envoûteurs » connaissent les bonnes musiques",
    [
      "Les Envoûteurs connaissent les chants qui appellent les esprits, mais aussi ceux qui les font fuir, les irritent ou les blessent. Ils ne partagent ni énergie vitale ni magie avec l’être invoqué et ne sont donc pas des chamans.",
      "Leur pacte, plus fragile, lie l’esprit à la fraternité du Chasseur ; le chant rappelle les termes de cet accord ancien. Des tatouages montrent souvent cette alliance aux créatures appelées.",
      "Les nouveaux pactes sont rares, car peu de Chasseurs savent encore les conclure. Il faut soumettre ou convaincre un esprit supérieur capable d’engager ses sujets. Certaines lignées possèdent ainsi du sang de Djinn ou les bénéfices d’un pacte sans appartenir elles-mêmes à la Chasse."
    ]
  ],
  [
    "Plus le chasseur utilise ce « Feu Lucide »",
    [
      "L’usage répété du Feu Lucide menace la vue du Dualiste. Ce feu ne révèle pas seulement la vérité : il brûle le « mauvais côté » des êtres et des pouvoirs. Pour cette tradition, chaque qualité possède un opposé et chaque concept deux facettes.",
      "Contrairement aux Taoïstes qui recherchent un équilibre, les Dualistes purgent ce qui relève de l’Angra Mainyu, l’Esprit Mauvais associé aux démons et aux ennemis de Dieu. Ils embrasent leurs yeux, leurs armes ou leur propre corps afin d’anéantir la part maléfique d’une capacité."
    ]
  ],
  [
    "Les Chasseurs « Assassins » sont tatoués sur la langue",
    [
      "Les Assassins sont tatoués sur la langue, parlent peu et savent rendre leur souffle comme leur présence imperceptibles. À l’inverse des Dualistes qui détruisent les Ombres, ils les enferment dans leur propre corps. Ils deviennent ainsi partiellement des Ombres et acquièrent des aptitudes surhumaines.",
      "À mesure que ces esprits s’accumulent, des marques noires recouvrent leur peau. Un tatouage principal se trouve sur le torse ou le dos ; lorsqu’il est entièrement envahi, la vie du Chasseur est presque consumée et celui-ci doit se sacrifier pour ne pas devenir une créature néfaste."
    ]
  ],
  [
    "Parce qu’Historiquement ils ont été connus pour les assassinats politiques",
    [
      "Le souvenir de leurs assassinats politiques fait croire que les Hashishin visent surtout des Humains. Ils chassent en réalité les Mages et les sorciers, dont ils neutralisent les pouvoirs grâce aux Ténèbres acquises par les Ombres qu’ils retiennent.",
      "Contrairement aux Taoïstes du clan Shi, qui dévorent les esprits, les Assassins pratiquent une possession maîtrisée. Leur corps sert de prison ; les Ombres ne sont pas détruites et sont libérées à la mort de l’hôte.",
      "Un esprit trop puissant peut toutefois prendre le contrôle. Le tatouage de vie devient alors le point faible qui permet de tuer le possesseur : en occupant ce corps préparé, la créature en partage aussi la mortalité."
    ]
  ],
  [
    "Plus encore que l’Islam, l’hindouisme est doté de la plus grande variété",
    [
      "L’hindouisme présente une immense variété de rites, de formes et de courants. Il n’est réductible ni au monothéisme ni au polythéisme : Brahman est l’Absolu dont les divinités et les êtres vivants constituent des parties, tandis que la Trimurti réunit Brahma, Vishnou et Shiva.",
      "Des courants comme le vishnouisme ou le shivaïsme privilégient l’une de ces figures sans nier Brahma ni, à plus forte raison, Brahman.",
      "Chaque dieu majeur possède des avatars : Krishna est le plus connu de Vishnou et Rudra celui de Shiva. Chacun est aussi associé à une parèdre qui représente sa facette féminine et possède ses propres avatars ; Parvati, épouse de Shiva, est ainsi à la fois Dourga et Kali."
    ]
  ],
  [
    "Le Shientaoïsme est officiellement né en 2033",
    [
      "Le shientaoïsme de la Réalité naquit officiellement en 2033, à la suite d’accords entre la Chine et le Japon. Après la guerre de 2022-2028, l’émigration resta forte : de nombreux Chinois et Coréens furent invités à travailler au Japon, où le bouddhisme était déjà bien implanté.",
      "Les autorités financèrent alors philosophes et religieux afin de produire le Livre de Jade, corpus synthétique destiné à donner une cosmologie commune aux quatre courants retenus :"
    ]
  ],
  [
    "La notion la plus importante pour les chasseurs bouddhistes c’est le principe de « Karma »",
    [
      "Pour les Chasseurs bouddhistes, la notion centrale est le karma. Dans le samsara, il représente l’accumulation causale des actions passées, présentes et futures de chaque être. Il s’oppose en cela à Śūnyatā, la vacuité.",
      "La vacuité affirme qu’aucune chose ne possède d’essence propre : forme, fonction et matière n’existent pas hors de la causalité et de l’interdépendance des matières, des énergies et des volontés. L’illumination consiste à comprendre cette absence d’essence afin de se libérer du karma et du cycle des réincarnations."
    ]
  ],
  [
    "Les chasseurs des confréries chinoises n’ont absolument rien à voir",
    [
      "Les confréries chinoises ne se confondent pas avec les Chasseurs shientaoïstes. Les Chasseurs de Nüwa, de l’Empereur Jaune ou de Chang’e sont nés bien avant les racines de cette synthèse moderne.",
      "Même des confréries plus tardives liées à l’Empereur de Jade, à Guanyin ou à d’autres figures rattachées au taoïsme et au bouddhisme ne partagent pas automatiquement les méthodes des quatre traditions shientaoïstes.",
      "Leur arme principale demeure le Qi, souvent renforcé par le Souffle divin, ou shenqi. Cette manifestation d’un pouvoir tutélaire ne se développe qu’à travers la maîtrise personnelle du Qi."
    ]
  ],
  [
    "La mythologie grecque et son héritière celle romaine sont extrêmement mieux connues",
    [
      "Les mythologies grecques et romaines sont mieux connues que beaucoup d’autres traditions anciennes, mais leur diversité reste souvent sous-estimée. Le monde grec s’étendait bien au-delà d’un territoire uniforme et ses récits variaient selon les époques, les cités et les peuples voisins.",
      "Les Olympiens ne furent jamais les seules puissances vénérées : divinités primordiales, Titans, figures mineures et demi-dieux produisirent une grande variété de cultes, puis de confréries de Chasse."
    ]
  ],
  [
    "Il existe une autre mythologie, ou plutôt une multitude de mythologies qui sont très influentes",
    [
      "Les traditions celtiques forment une autre famille très influente dans la Chasse et pourtant difficile à résumer. Leur trace demeure dans des croyances locales, notamment en Irlande et en Bretagne, mais les noms et les légendes variaient d’un peuple à l’autre tout en conservant des correspondances reconnaissables.",
      "Les peuples celtiques étaient mobiles, ouverts aux échanges et politiquement divisés. Leurs traditions se développèrent donc différemment selon leur origine géographique et leurs contacts avec d’autres civilisations."
    ]
  ],
  [
    "Bien que plus récente que celles citées au-dessus, les mythologies scandinaves",
    [
      "Les mythologies scandinaves et leurs antécédents germaniques sont plus tardifs que plusieurs traditions déjà évoquées, mais tout aussi riches. Elles sont souvent mal connues, d’abord relues à travers le prisme chrétien chez les Saxons, les Angles ou les Francs, puis de nouveau transformées par la christianisation des Scandinaves.",
      "Au XXe siècle, elles furent instrumentalisées par des mouvements nationalistes. La culture populaire a ensuite ravivé l’intérêt pour ces récits tout en en déformant une partie."
    ]
  ],
  [
    "La vie des chasseurs de l’Association est souvent courte, celle des chasseurs des confréries encore plus",
    [
      "La vie d’un Chasseur de l’Association est souvent courte ; celle d’un membre de confrérie l’est davantage encore. Sans structure commune pour les encadrer ou les protéger, ces groupes s’affrontent fréquemment. Leurs oppositions expliquent en partie pourquoi les religions instituées ont cessé de reconnaître nombre d’entre eux.",
      "Les conflits entre traditions, parfois même entre branches d’une même religion, dispersent leurs forces dans des querelles locales. Leur fragilité vient aussi d’une foi souvent moins structurée, donc de pouvoirs plus faibles que ceux des Chasseurs religieux.",
      "Moins renseignées et moins coordonnées que l’Association ou le Xenoshield, les confréries se laissent plus facilement piéger. Leur besoin de puissance les expose enfin aux Mages, aux Fléaux, aux Vampires et à toutes les créatures prêtes à exploiter leur vulnérabilité."
    ]
  ]
];

const splitLongText = (raw: unknown, limit = 560): string[] => {
  const text = cleanText(raw);
  const curated = CURATED_REWRITES.find(([prefix]) => text.startsWith(prefix));
  if (curated) return curated[1].map(cleanText);
  if (!text || text.length <= limit) return text ? [text] : [];

  const sentences = text.split(/(?<=[.!?…])\s+(?=[«“A-ZÀ-ÖØ-Þ])/u);
  const parts: string[] = [];

  for (const sentence of sentences) {
    if (sentence.length <= limit) {
      parts.push(sentence);
      continue;
    }

    const clauses = sentence.split(/(?<=[;:])\s+|,\s+(?=[A-ZÀ-ÖØ-Þ«“])/u);
    let current = "";
    for (const clause of clauses) {
      if (!current) {
        current = clause;
        continue;
      }
      const separator = /[;:]$/u.test(current) ? " " : ", ";
      if (`${current}${separator}${clause}`.length <= limit) {
        current = `${current}${separator}${clause}`;
      } else {
        parts.push(current);
        current = clause;
      }
    }
    if (current) parts.push(current);
  }

  const chunks: string[] = [];
  for (const part of parts) {
    if (part.length <= limit) {
      chunks.push(part);
      continue;
    }
    const words = part.split(/\s+/u);
    let current = "";
    for (const word of words) {
      if (!current || `${current} ${word}`.length <= limit) {
        current = current ? `${current} ${word}` : word;
      } else {
        chunks.push(current);
        current = word;
      }
    }
    if (current) chunks.push(current);
  }

  return chunks.reduce<string[]>((joined, chunk) => {
    const previous = joined.at(-1);
    if (previous && `${previous} ${chunk}`.length <= limit) {
      joined[joined.length - 1] = `${previous} ${chunk}`;
    } else {
      joined.push(chunk);
    }
    return joined;
  }, []);
};

const repairBlocks = (blocks: Array<Record<string, any>>): Block[] =>
  blocks.flatMap((block) => {
    if (block?.type !== "p") return [block as Block];
    return splitLongText(block.text).map(lore);
  });

const repairSection = (section: Record<string, any>): Section => ({
  ...section,
  id: String(section.id ?? "section"),
  title: SECTION_TITLE_FIXES[String(section.id)] ?? cleanText(section.title),
  level: Number(section.level ?? 2),
  blocks: repairBlocks(section.blocks ?? [])
});

const ASSOCIATION_GATE_HUNT: Section[] = [
  {
    id: "gate-of-truth",
    title: "Gate of Truth",
    level: 2,
    blocks: [
      lore(
        "Chaque Chasseur référencé reçoit un badge Gate of Truth. Dans un Bar de l’Association, ce badge révèle les espaces, les dossiers et les interlocuteurs correspondant à son habilitation. Il atteste un domaine de confiance ; il ne confère ni puissance ni équipement gratuit."
      ),
      table([
        ["Code", "Accès principal"],
        ["GT-00", "Ensemble du Bar, des renseignements et des armements autorisés."],
        ["GT-01", "Chasseurs et dossiers sur les créatures surnaturelles de faible impact."],
        ["GT-11", "Domaine surnaturel étendu et informations détaillées sur ces créatures."],
        ["GT-02", "Chasseurs et dossiers sur les créatures fantastiques de faible impact."],
        ["GT-22", "Domaine fantastique étendu, notamment Aèr et les communautés exilées."],
        ["GT-03", "Chasseurs et dossiers sur les menaces extraterrestres de faible impact."],
        ["GT-33", "Domaine extral étendu et informations détaillées sur ces menaces."]
      ])
    ]
  },
  {
    id: "rangs-hunt",
    title: "Rangs Hunt",
    level: 2,
    blocks: [
      lore(
        "Les rangs Hunt reconnaissent l’expérience et les résultats, selon des critères différents. Ils ne forment donc pas une progression parfaitement linéaire : un Chasseur proche du Hunt 15 peut encore relever du Hunt 1000 si son nombre de proies supérieures ne lui donne pas accès au Hunt 100."
      ),
      table([
        ["Rang", "Critère"],
        ["Hunt 0", "Statut de base obtenu après une première mission réussie."],
        ["Hunt 1000", "Reconnaissance d’un vétéran ayant éliminé plus de mille créatures."],
        ["Hunt 100", "Classement limité à cent Chasseurs, fondé sur les créatures supérieures neutralisées."],
        ["Hunt 15", "Quinze trajectoires évaluées selon le danger affronté, les résultats, l’influence et la préservation du Secret."]
      ]),
      lore(
        "Chaque rang ouvre des renseignements et des ressources plus rares. Cette reconnaissance reste contrôlée par l’Association et ne transforme pas un classement en capacité surnaturelle."
      )
    ]
  },
  {
    id: "observateurs-et-secret",
    title: "Observateurs et Secret",
    level: 2,
    blocks: [
      lore(
        "Les Bars sont défendus par des soldats expérimentés appelés Observateurs. Ils sécurisent les bastions de la Chasse, surveillent les organisations où l’Association a placé des relais et interviennent lorsqu’une opération menace d’exposer la Vérité."
      ),
      lore(
        "La Chasse et le Secret sont les deux priorités de l’Association. L’existence des créatures ne doit pas se répandre dans la Réalité : une révélation générale transformerait la Chasse en guerre et provoquerait une réaction incontrôlable contre toutes les communautés de Vérité."
      ),
      lore(
        "Cette doctrine rend aussi les Observateurs redoutables. Ils ne se limitent pas à la défense des Bars : les milices de l’Association peuvent faire disparaître les témoins ou les lignées de Chasseurs qui menacent délibérément le Secret."
      )
    ]
  }
];

const CHRISTIAN_FUNCTIONING: Section = {
  id: "fonctionnement",
  title: "Fonctionnement",
  level: 2,
  blocks: [
    lore("Les Chasseurs chrétiens se répartissent entre trois grands ordres, auxquels s’ajoutent les exorcistes du laïcat."),
    table([
      ["Branche", "Fonction"],
      ["Ordre d’Ephraïm", "Exorcistat et lutte contre les possessions."],
      ["Ordre d’Arianwen", "Traque des créatures et soutien des opérations."],
      ["Ordre de Magdalena", "Jugement, enquête et scellement."],
      ["Exorcistes du laïcat", "Ministère local officiellement connu, confié par un évêque à des personnes présentant les dons appropriés."]
    ]),
    lore(
      "Toutes ces branches connaissent le Bannissement, l’art de repousser une entité surnaturelle ou ses pouvoirs par la répétition de prières. Leur appartenance commune ne supprime ni leurs compétences propres ni leurs divergences d’autorité."
    )
  ]
};

const MUSLIM_FUNCTIONING: Section = {
  id: "fonctionnement",
  title: "Fonctionnement",
  level: 2,
  blocks: [
    lore(
      "Les Chasseurs musulmans ne relèvent pas d’ordres centralisés comparables à ceux de l’Église chrétienne. À la Roqya s’ajoutent trois grandes traditions, transmises par des fraternités locales et désormais reliées par l’Holonet."
    ),
    table([
      ["Tradition", "Héritage et méthode"],
      ["Envoûteurs", "Traditions animistes et subsahariennes ; chants, pactes et diplomatie avec les Djinns."],
      ["Dualistes", "Héritage zoroastrien ; Feu Lucide et purification de ce qui relève de l’Angra Mainyu."],
      ["Assassins", "Héritage nizarite ; maîtrise des Ombres, discrétion et traque des Mages et sorciers."]
    ])
  ]
};

const HINDU_FUNCTIONING: Section = {
  id: "fonctionnement",
  title: "Fonctionnement",
  level: 2,
  blocks: [
    lore(
      "Les Chasseurs hindouistes sont appelés Gourous. Malgré la diversité des écoles, leur formation s’organise autour des quatre buts de la vie et des trois fonctions de la Trimurti."
    ),
    table([
      ["But", "Sens pour la Chasse"],
      ["Kāma", "Désir, communion des corps, exaltation des sens et recherche de l’épanouissement."],
      ["Artha", "Prospérité, patrimoine et trace concrète laissée par le travail d’une vie."],
      ["Dharma", "Devoir, rigueur et morale nécessaires pour rester sur le juste chemin."],
      ["Moksha", "Délivrance du cycle des réincarnations, notamment par la dévotion."]
    ]),
    lore(
      "Les Gourous sont des brahmanes. Aux quatre buts s’ajoutent la création, la protection et la destruction représentées par Brahma, Vishnou et Shiva. Le mantra Aum associe ces trois forces ; sa répétition prolongée renforce le Chasseur."
    )
  ]
};

const SHIENTAO_FUNCTIONING: Section = {
  id: "fonctionnement",
  title: "Fonctionnement",
  level: 2,
  blocks: [
    lore(
      "Le shientaoïsme de la Réalité rassemble plusieurs courants, mais leurs Chasseurs ne forment pas une institution unique. Ils travaillent surtout par clans et par territoires ; les communautés bouddhistes suivent une organisation distincte."
    ),
    table([
      ["Tradition", "Support privilégié des sceaux"],
      ["Shintoïstes", "Bandes de papier."],
      ["Taoïstes", "Talismans de bois."],
      ["Confucianistes", "Anneaux métalliques."],
      ["Bouddhistes", "Rouleaux et sutras."]
    ]),
    lore(
      "Dans ces traditions, la prière n’agit pas seule : elle accompagne l’activation d’écritures et de sceaux. Chaque clan conserve ses propres rites, supports et préférences ; le tableau donne un repère commun sans effacer cette diversité."
    )
  ]
};

const SECTION_OVERRIDES: Record<string, Record<string, Section>> = {
  "lore-hunters-chretiens": { fonctionnement: CHRISTIAN_FUNCTIONING },
  "lore-hunters-musulmans": { fonctionnement: MUSLIM_FUNCTIONING },
  "lore-hunters-hindouistes": { fonctionnement: HINDU_FUNCTIONING },
  "lore-hunters-shientaoistes": { fonctionnement: SHIENTAO_FUNCTIONING }
};

export const COMPENDIUM_VERITE_HUNTERS_LORE_ARTICLES = COMPENDIUM_VERITE_HUNTERS_ARTICLES.map(
  (article) => {
    const sections =
      article.id === "lore-hunters-association-gate-hunt"
        ? ASSOCIATION_GATE_HUNT
        : (article.sections ?? []).map((section: Record<string, any>) =>
            SECTION_OVERRIDES[article.id]?.[String(section.id)] ?? repairSection(section)
          );

    return {
      ...article,
      sections
    };
  }
) as Array<Record<string, any>>;

const CHASSE_FANTASTIQUE_BLOCKS: Block[] = [
  lore(
    "La Chasse Fantastique, aussi appelée Chasse volante, Chasse du Diable ou Chasse sauvage, a nourri le folklore européen sous la forme d’une chevauchée céleste. Elle naquit en vérité comme une coalition elfique levée pendant la Guerre de la Magie. Sa première marche, ordonnée par Oberon Vadel, devait rallier les Ruvyns, des Elyë sylvains, des Dryades et des Keltas, puis frapper les Mages."
  ),
  lore(
    "L’armée porta d’abord les noms de Chasse magique et de Chasse aux Mages. Elle poursuivit ensuite les êtres exerçant une influence dangereuse sur la magie : Voyageurs, Deimons, Vampires ou serviteurs des Fléaux. Ses unités combattent en groupe et se déploient avec une force volontairement spectaculaire, capable de déchirer localement l’Hologramme."
  ),
  lore(
    "Trois souverains se sont succédé à sa tête : Oberon Vadel, Mirrissi, puis Titania Sellin’Yn. Le titre de roi ou reine de la Chasse est attribué par les grands veneurs. Titania a adapté cette armée sans front permanent aux réseaux modernes de Chasseurs, aux forces de la Réalité et aux mercenaires comme Ushkoll ; elle participa aussi à une force secrète de Black Crow aux côtés de Katja et Andrea."
  ),
  lore(
    "Chaque mobilisation majeure fait naître une tempête magique : vents, éclairs et vortex absorbent puis dispersent la magie afin de briser les défenses des Mages. La Mère des tempêtes, seconde autorité de la Chasse, est une prêtresse aseryne désignée par le Grand Temple d’Atlantide lorsque la souveraine vient demander son concours."
  ),
  table([
    ["Fonction", "Rôle"],
    ["Roi ou reine de la Chasse", "Commandement suprême élu par les grands veneurs."],
    ["Mère des tempêtes", "Bras droit aseryn et maîtrise de la tempête magique."],
    ["Grands veneurs", "Généraux secondaires et corps électoral de la souveraine."],
    ["Officiers de vénerie", "Commandement des unités."],
    ["Limiers", "Avant-garde et poursuite."],
    ["Piqueurs", "Corps principal de la cavalerie."],
    ["Éclaireurs", "Renseignement et prévention des déploiements destructeurs."]
  ]),
  lore(
    "La Chasse est entièrement montée, sur des animaux fantastiques ou des véhicules technomagiques. Le Conseil des Anciens la considère comme son armée punitive, mais répugne à mobiliser une force aussi destructrice. Les éclaireurs agissent donc beaucoup plus souvent que le reste de l’armée, devenue une faction politique autonome dans l’attente d’un accord entre la souveraine et le Conseil."
  ),
  lore(
    "Cette double autorité a déjà bloqué des campagnes. En 842, Titania imposa une mobilisation que le Conseil n’avait pas validée ; le Grand Temple refusa de fournir une Mère des tempêtes et la Chasse avorta. En 1002, le Temple désigna Anyra alors que Titania exigeait Exandrena, exilée à Mû. Un assassin du Conseil tua les deux prêtresses afin d’empêcher que le conflit entre Mû et l’Atlantide ne gagne la Chasse."
  )
];

const chasseFantastiqueSection = (id: string, title: string): Section => ({
  id,
  title,
  level: 2,
  blocks: CHASSE_FANTASTIQUE_BLOCKS
});

export const COMPENDIUM_VERITE_HUNTERS_CHASSE_FANTASTIQUE_HUB_ENRICHMENT = {
  targetId: "verite-v7-chasseurs-doctrine-association-traditions",
  source: "factions_les grands exilés(1)(1).pdf",
  tags: ["Chasse Fantastique", "Guerre de la Magie", "Titania", "Conseil des Anciens"],
  sections: [
    chasseFantastiqueSection(
      "grands-exiles-chasse-fantastique",
      "Chasse Fantastique — armée, tempête & vénerie"
    )
  ]
} as Record<string, any>;

export const COMPENDIUM_VERITE_HUNTERS_LORE_ENRICHMENTS =
  COMPENDIUM_VERITE_HUNTERS_ENRICHMENTS.map((enrichment) => {
    if (enrichment.id === "lore-grands-exiles-chasse-fantastique") {
      return {
        ...enrichment,
        sections: [
          chasseFantastiqueSection(
            "origines-et-fonctionnement-de-la-chasse-fantastique",
            "Origines et fonctionnement de la Chasse Fantastique"
          )
        ]
      };
    }

    if (enrichment.id === "verite-055-19-formation-et-doctrine-de-chasseur") {
      return {
        ...enrichment,
        sections: (enrichment.sections ?? []).map(repairSection)
      };
    }

    return enrichment;
  }) as Array<Record<string, any>>;
