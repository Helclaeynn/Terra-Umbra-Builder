type JsonObject = Record<string, any>;

type Article = JsonObject & {
  id: string;
  source?: string;
  status?: string;
  tags?: string[];
  sections?: JsonObject[];
};

const LEGACY_SOURCE = "truth-legacy-consolidation-v1.json";
const TEMPLES_SOURCE = "factions_Temples Daemoniaques(3).pdf";
const AIDH_SOURCE = "TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx";

const p = (text: string): JsonObject => ({ type: "p", style: "lore", text });

const daemonContextSections: JsonObject[] = [
  {
    id: "daemons-nevaerkal-deimons-daemons",
    title: "Trois mots souvent confondus",
    level: 2,
    blocks: [
      p("Le vocabulaire humain rapproche des êtres qui n’appartiennent pas à la même catégorie métaphysique. Les Nevaerkal sont les grandes créatures élémentaires de feu et de terre d’Aèr ; les Deimons sont des créatures liées aux Ombres de la Terre ; les Daemons de ce chapitre sont d’anciennes âmes choisies et reforgées par les Divinités terrestres."),
      p("La ressemblance des mots vient de traductions, de religions et de siècles de récits qui ont mélangé des réalités différentes. Employer « démon » sans préciser le contexte peut donc cacher trois histoires et trois natures sans rapport direct.")
    ]
  },
  {
    id: "daemons-revenir-sur-terre",
    title: "Revenir sur Terre",
    level: 2,
    blocks: [
      p("Les traditions daemoniaques décrivent plusieurs manières de revenir agir sur Terre. La réincarnation donne une nouvelle vie complète ; la possession passe par un corps déjà vivant ; l’invocation ouvre une présence limitée depuis un lieu ou un rite ; certaines Cours parlent enfin d’émissaires envoyés directement pour une mission."),
      p("Ces modes de présence ne sont pas interchangeables sur le plan social. Ils changent la relation du Daemon à son identité contemporaine, à son entourage et à sa Cour, et expliquent pourquoi deux serviteurs d’une même Divinité peuvent vivre leur retour dans le monde humain de façons radicalement différentes.")
    ]
  }
];

const templesIndexSection: JsonObject = {
  id: "temples-daemoniaques-inventaire",
  title: "Index institutionnel des Temples",
  level: 2,
  blocks: [
    p("Treize ensembles sont connus. Leurs façades ne sont pas toutes identifiées ; l’absence d’adresse ne signifie ni que le Temple est détruit, ni qu’une affiliation humaine de ses serviteurs constitue sa façade."),
    {
      type: "table",
      rows: [
        ["Temple", "Statut", "Attributs dominants", "Ancrage documenté"],
        ["Morrighan", "Temple ancien actif", "Guerre, présages, mort, royauté", "Façade non précisée"],
        ["Belial", "Temple ancien actif", "Feu, domination, royauté", "Cabinet Faith ; bureau de Belial comme portail"],
        ["Lilith", "Temple ancien actif", "Désir, plaisir, attachement, fertilité", "Studios Redwheels"],
        ["Alabor", "Temple ancien actif", "Eaux primordiales", "Façade non précisée"],
        ["Mammon", "Temple ancien actif", "Mort, vieillesse, inéluctable", "Façade non précisée"],
        ["Diablo", "Temple ancien actif", "Nuit et peur", "Façade non précisée"],
        ["Astaroth", "Temple ancien actif", "Civilisation, savoir, création", "Façade non précisée"],
        ["Satan", "Temple ancien actif", "Jugement, sentence, ordre", "Façade non précisée"],
        ["Méphisto", "Temple ancien actif", "Occulte, parole, hasard", "Façade non précisée"],
        ["Abigor", "Temple fantôme", "Ciel, vent, orage, tempête", "Relique et gardien non précisés"],
        ["Baal", "Temple fantôme", "Guerre", "Relique et gardien non précisés"],
        ["Belzébuth", "Temple fantôme", "Vie, évolution, maladie, mutation", "Relique et gardien non précisés"],
        ["Lucifer", "Temple fantôme", "Soleil, cycle, vie, courage", "Relique et gardien non précisés"]
      ]
    }
  ]
};

const templeDossierSections: JsonObject[] = [
  {
    id: "temples-daemoniaques-dossier-morrighan",
    title: "Temple de Morrighan",
    level: 2,
    blocks: [
      p("Le Temple de Morrighan occupe une place singulière : la déesse s’appuie sur de grands Corbeaux issus des Keltas autant que sur des Ducs et Duchesses daemoniaques. Ses Attributs relient guerre, frénésie, pensée, tromperie, colère et courage."),
      p("Ses serviteurs connus sont dispersés entre réseaux mercenaires, corporations et institutions publiques. Aucune façade unique n’est identifiée pour le Temple ; cette dispersion décrit ses relais dans la Réalité, pas l’emplacement de son portail.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-belial",
    title: "Temple de Belial · Cabinet Faith",
    level: 2,
    blocks: [
      p("Le cabinet Faith constitue le Temple de Belial, et le bureau de la reine-divine y sert de portail infernal. L’infrastructure sacrée se dissimule ainsi derrière une institution juridique parfaitement intégrée à la Réalité."),
      p("Feu, destruction, victoire et puissance royale structurent cette Cour. Ses Ducs et Duchesses agissent pourtant dans des milieux très différents ; leur appartenance commune ne transforme pas chacune de leurs activités humaines en opération officielle du cabinet.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-lilith",
    title: "Temple de Lilith · Studios Redwheels",
    level: 2,
    blocks: [
      p("Les studios de tournage de Redwheels abritent le Temple de Lilith. Le choix d’une entreprise vouée au désir et à sa mise en scène permet à la Cour de rester visible dans ses thèmes tout en demeurant invisible dans sa nature."),
      p("Charme, fertilité, manipulation et secrets intimes composent les Attributs de ses serviteurs. La Cour fonctionne aussi comme une parenté choisie : ses Duchesses protègent les membres moins puissants et maintiennent des solidarités qui dépassent les employeurs et réseaux de la Réalité.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-alabor",
    title: "Temple d’Alabor",
    level: 2,
    blocks: [
      p("La Cour d’Alabor décline les Eaux primordiales en brumes, vagues, pression et pluie. Ses relais humains connus touchent aux ressources maritimes, aux corporations océaniques, aux Crawlers et à la Pègre."),
      p("Aucune façade du Temple n’est nommée. Les métiers maritimes de plusieurs incarnations rendent la Cour présente autour de l’océan, mais ne suffisent pas à localiser son portail ni ses trônes.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-mammon",
    title: "Temple de Mammon",
    level: 2,
    blocks: [
      p("Mammon gouverne la mort, la vieillesse et l’Inéluctable. Souffrance, âge, destruction et repos ne sont pas quatre cultes séparés : ils expriment les manières dont sa Cour accompagne, provoque ou ordonne la fin."),
      p("Le pacte de Mammon avec les Psychopompes et l’entente secrète conclue autour d’Azraël donnent à cette Maison une diplomatie propre au-delà de la seule opposition entre Daemons et Angelus. La façade terrestre du Temple n’est pas précisée.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-diablo",
    title: "Temple de Diablo",
    level: 2,
    blocks: [
      p("Le Temple de Diablo rassemble les formes de la Nuit : cauchemars, peur, obscurité et ténèbres premières. Ses serviteurs connus traversent l’Underlife, la Pègre et des institutions religieuses, ce qui rend la Cour socialement difficile à circonscrire."),
      p("La présence d’Anammalech, ombre ancienne liée aux Deimons et marquée par V’aagor, rappelle que toutes les figures de la Cour ne correspondent pas au parcours ordinaire d’une âme humaine devenue Daemon. Aucune façade précise du Temple n’est connue.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-astaroth",
    title: "Temple d’Astaroth",
    level: 2,
    blocks: [
      p("Astaroth patronne la Civilisation, le savoir et la création. Arts, inventivité, mathématiques et médecine composent une Cour dont les incarnations s’insèrent naturellement dans les industries culturelles, Caltech, les cliniques et les ateliers Crawlers."),
      p("Ces implantations donnent accès à la création humaine contemporaine sans constituer un Temple distribué. Aucun portail ni sanctuaire terrestre n’est localisé.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-satan",
    title: "Temple de Satan",
    level: 2,
    blocks: [
      p("La Cour de Satan articule sentence, vengeance, paix et jugement. L’ordre qu’elle défend n’est donc pas réductible à la punition : il comprend aussi la capacité à mettre fin au conflit et à maintenir une décision juste."),
      p("Ses incarnations connues occupent aussi bien les marges Crawlers qu’un restaurant indépendant ou la justice californienne. Ces positions éclairent ses Attributs, mais aucune façade du Temple n’est identifiée.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-mephisto",
    title: "Temple de Méphisto",
    level: 2,
    blocks: [
      p("Méphisto gouverne l’Occulte, la parole et le hasard. Sa Cour met en regard parole et magie, mensonge et vérité ; elle réunit des figures dont les fonctions humaines touchent à la politique, aux Chasseurs, aux médias et aux opérations Crawlers."),
      p("Cette distribution correspond à une politique d’influence plutôt qu’à une adresse. Aucun lieu n’est identifié comme façade de son Temple.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-abigor",
    title: "Temple fantôme d’Abigor",
    level: 2,
    blocks: [
      p("Abigor, puissance du ciel violent, du vent, de l’orage et de la tempête, ne dispose plus d’un Temple complet. Son Temple fantôme doit s’organiser autour d’une relique capable de concentrer ce qui subsiste de son influence."),
      p("Astarté et Furfur sont les deux incarnations connues de ce Temple fantôme. Ni la relique, ni son gardien, ni le lieu qui la protège ne sont identifiés.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-baal",
    title: "Temple fantôme de Baal",
    level: 2,
    blocks: [
      p("Baal incarne la Guerre mais a perdu sa dimension infernale et son Temple fonctionnel. Le vol du Prophète de la Force par Caïn illustre les conséquences politiques de cette déchéance : ses Attributs restent convoités alors que son infrastructure ne peut plus les administrer normalement."),
      p("Ereshkigal et Leraje sont les incarnations rattachées au Temple fantôme. La relique et le sanctuaire qui la protège ne sont pas identifiés.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-belzebuth",
    title: "Temple fantôme de Belzébuth",
    level: 2,
    blocks: [
      p("Belzébuth porte la Vie, jusque dans la régénération, l’évolution, la maladie et la mutation. La perte de son Enfer ne supprime pas cette puissance personnelle, mais prive sa Cour des fonctions complètes d’un Temple ancien."),
      p("Perséphone et Baphomet sont les deux incarnations connues de ce Temple fantôme. Aucun artefact central ni lieu de conservation n’est identifié.")
    ]
  },
  {
    id: "temples-daemoniaques-dossier-lucifer",
    title: "Temple fantôme de Lucifer",
    level: 2,
    blocks: [
      p("Lucifer conserve les Attributs du Soleil, du cycle, de la vie et du courage malgré son statut déchu. Son Temple fantôme ne possède donc ni portail infernal ni trônes actifs, mais peut encore ancrer et renforcer des pouvoirs autour d’une relique."),
      p("Adramalech et Abalim sont les deux incarnations connues de ce Temple fantôme. La nature de la relique et son emplacement restent inconnus.")
    ]
  }
];

const angelusSections: JsonObject[] = [
  {
    id: "angelus-nephilim-restriction-manifestations",
    title: "Nephilim et restriction des manifestations",
    level: 2,
    blocks: [
      p("Des traditions anciennes attribuent la naissance des Nephilim à une époque où des Angelus demeuraient beaucoup plus directement et durablement sur Terre. Leurs descendants héritaient d’une part de Transcendance sans être de simples incarnations d’Angelus, créant des lignées que l’ordre céleste ne contrôlait pas entièrement."),
      p("Certains Nephilim se rangèrent auprès des puissances daemoniaques ou suivirent leurs propres intérêts. Les conflits qui en découlèrent contribuèrent à justifier des règles plus strictes sur la présence céleste directe et sur la manière dont les Angelus interviennent dans le monde humain.")
    ]
  }
];

const garouSections: JsonObject[] = [
  {
    id: "khinae-chasse-activite-meute",
    title: "La Chasse comme activité de Meute",
    level: 2,
    blocks: [
      p("Dans le vocabulaire de certaines Meutes, une Chasse ne désigne pas seulement une traque animale. Le mot peut couvrir toute action collective où le groupe poursuit un objectif : repérage, infiltration, protection, affrontement, compétition sportive ou chasse au sens littéral."),
      p("Ce qui compte est moins la nature de l’objectif que la coordination et l’impression d’agir comme une Meute. Les usages varient selon les familles et les Pelages ; le terme n’impose donc ni une pratique universelle, ni une hiérarchie particulière.")
    ]
  },
  {
    id: "khinae-latents-partenaires-parente",
    title: "Latents, partenaires et parenté de Meute",
    level: 2,
    blocks: [
      p("Une Meute peut inclure des descendants de Khinae encore latents et des partenaires qui ne se transforment pas. L’appartenance ne se réduit donc ni au sang, ni au fait d’avoir déjà éveillé sa Nature."),
      p("Dans certaines familles, une personne peut appartenir à la communauté bien avant son premier Éveil, ou y rester sans jamais manifester de forme garoue. Cette réalité renforce l’idée moderne de la Meute comme relation vécue plutôt que comme simple regroupement de combattants métamorphes.")
    ]
  }
];

const aidhSections: JsonObject[] = [
  {
    id: "aidh-trois-couches-technologiques",
    title: "Trois couches technologiques",
    level: 2,
    blocks: [
      p("Le matériel générique regroupe les outils qu’une force AIDH pourrait employer sur presque n’importe quel monde : communication, capteurs, soutien médical, énergie et maintenance. Ils sont très avancés pour un observateur terrestre sans être propres à Terra Umbra."),
      p("L’arsenal et les armures constituent le standard militaire moderne de l’organisation, largement supérieur aux équivalents terrestres. Les dispositifs TUC forment une troisième couche, conçue spécifiquement pour l’Hologramme, la Révélation, l’enregistrement invariant et les menaces surnaturelles locales. Un appareil AIDH ordinaire ne perçoit donc pas automatiquement la Vérité.")
    ]
  },
  {
    id: "aidh-dotation-verrouillage-recuperation",
    title: "Dotation, verrouillage et récupération",
    level: 2,
    blocks: [
      p("L’AIDH n’utilise plus les anciens points de réquisition. Une mission autorise le matériel dont elle a besoin selon son mandat, sa discrétion, la distance au soutien et la menace estimée. L’équipement lourd, spécial ou expérimental exige une chaîne de responsabilité plus stricte qu’une dotation quotidienne."),
      p("Posséder physiquement un appareil ne suffit pas à en faire un équipement légitime. Authentification, verrouillage, mission et autorisations restent attachés aux pièces sensibles ; leur perte peut déclencher une récupération prioritaire. Le catalogue détaillé demeure dans « Arsenal AIDH — doctrine matérielle et références ».")
    ]
  }
];

function mergeSources(...values: unknown[]): string {
  return [...new Set(
    values
      .flatMap((value) => String(value ?? "").split(" ; "))
      .map((value) => value.trim())
      .filter(Boolean)
  )].join(" ; ");
}

function insertSections(target: Article, sections: JsonObject[], beforeId?: string): void {
  const incomingIds = new Set(sections.map((section) => String(section.id ?? "")));
  const existing = (target.sections ?? []).filter((section) => !incomingIds.has(String(section?.id ?? "")));
  const index = beforeId ? existing.findIndex((section) => String(section?.id ?? "") === beforeId) : -1;
  const insertionIndex = index >= 0 ? index : existing.length;
  target.sections = [
    ...existing.slice(0, insertionIndex),
    ...structuredClone(sections),
    ...existing.slice(insertionIndex)
  ];
}

function enrich(target: Article, source: string, tags: string[]): void {
  target.source = mergeSources(target.source, source);
  target.tags = [...new Set([...(target.tags ?? []), ...tags, "Multi-source"])];
  target.status = "canon_enrichi";
  target.rebuildV2 = true;
}

function requireArticle(byId: Map<string, Article>, id: string): Article {
  const article = byId.get(id);
  if (!article) throw new Error(`Cible de clôture éditoriale Vérité absente: ${id}`);
  return article;
}

export function applyCompendiumVeriteClosureLore(byId: Map<string, Article>): void {
  const daemons = requireArticle(byId, "verite-v7-daemons-divinites-maisonnees-temples");
  insertSections(daemons, daemonContextSections, "temples-daemoniaques-definition-complete");

  const withoutOldIndex = (daemons.sections ?? []).filter((section) => String(section?.id ?? "") !== "temples-daemoniaques-inventaire");
  daemons.sections = withoutOldIndex;
  insertSections(daemons, [templesIndexSection, ...templeDossierSections], "temples-daemoniaques-lien-angelus");
  enrich(daemons, mergeSources(TEMPLES_SOURCE, LEGACY_SOURCE), ["Temples démoniaques", "Temples fantômes", "Daemons"]);

  const angelus = requireArticle(byId, "verite-v7-angelus-elynea-arbre-vie");
  insertSections(angelus, angelusSections, "renvoi-regles");
  enrich(angelus, LEGACY_SOURCE, ["Nephilim", "manifestations célestes"]);

  const garous = requireArticle(byId, "verite-v7-garous-khinae-meutes-pelages");
  insertSections(garous, garouSections);
  enrich(garous, LEGACY_SOURCE, ["Meutes", "Chasse", "Latents"]);

  const aidh = requireArticle(byId, "verite-humanite-galactique-aidh");
  insertSections(aidh, aidhSections);
  enrich(aidh, AIDH_SOURCE, ["technologie AIDH", "dotation", "TUC"]);
}

export const COMPENDIUM_VERITE_CLOSURE_TARGET_IDS = [
  "verite-v7-daemons-divinites-maisonnees-temples",
  "verite-v7-angelus-elynea-arbre-vie",
  "verite-v7-garous-khinae-meutes-pelages",
  "verite-humanite-galactique-aidh"
] as const;
