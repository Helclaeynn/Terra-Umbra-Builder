type JsonObject = Record<string, any>;

type Article = JsonObject & {
  id: string;
  source?: string;
  status?: string;
  tags?: string[];
  sections?: JsonObject[];
};

const DAILY_LIFE_SOURCE = "TUC_organisations_vie quotidienne.docx";
const AGENCIES_SOURCE = "TUC_organisations_agences(1).docx";

const p = (text: string): JsonObject => ({ type: "p", style: "lore", text });

const dailyLifeEnrichments: Record<string, { tags: string[]; sections: JsonObject[] }> = {
  "realite-v9-technologies-infrastructures-mobilite": {
    tags: ["ville verticale", "infrastructures urbaines"],
    sections: [
      {
        id: "ville-verticale-trois-strates",
        title: "La ville verticale en trois strates",
        level: 2,
        blocks: [
          p("Les grandes villes de 2035 se lisent autant en hauteur et en profondeur que sur une carte. Ce modèle en trois strates est fréquent, sans être une règle d’urbanisme absolue : chaque métropole combine différemment tours corporatives, espace public et infrastructures souterraines."),
          {
            type: "table",
            rows: [
              ["Strate", "Usages dominants", "Ce qui change concrètement"],
              ["Haute", "Tours corporatives, résidences privilégiées, passerelles et services privés", "Accès contrôlé, sécurité et maintenance intégrées, liaisons réservées"],
              ["Sol", "Rues, commerces, administrations, tramways et circulation ordinaire", "Juridictions et qualités de service changent parfois en quelques pâtés de maisons"],
              ["Sous-strates", "Métro, réseaux techniques, anciens ouvrages et espaces délaissés", "Infrastructures vitales côtoient ateliers, marchés informels et zones hors des cartes usuelles"]
            ]
          },
          p("Une même personne peut traverser ces trois mondes dans la journée sans quitter la ville. Le déplacement révèle alors qui entretient un lieu, quelle identité ouvre ses portes et quelle autorité répond lorsqu’un service tombe en panne.")
        ]
      }
    ]
  },
  "realite-v9-holonet-medias-culture-identite": {
    tags: ["dossier citoyen", "zones Holonet", "Lys"],
    sections: [
      {
        id: "dossier-citoyen-holophone",
        title: "Dossier citoyen et holophone",
        level: 2,
        blocks: [
          p("Le dossier numérique d’un citoyen rassemble les identifiants et traces que les institutions utilisent pour reconnaître sa situation : état civil, droits, démarches, éléments sanitaires, contrats ou habilitations selon le service consulté. Le Logifate en exprime la cohérence sociale ; il ne signifie pas que toutes les administrations partagent librement toutes les données."),
          p("L’holophone est l’interface quotidienne de ce dossier et de l’IA personnelle. Il coordonne agenda, paiements, objets connectés, informations et accès Holonet. Le perdre ne supprime pas l’identité de son propriétaire, mais peut rendre sa vie immédiatement plus difficile jusqu’à la révocation des accès et la restauration d’une interface sûre.")
        ]
      },
      {
        id: "zones-holonet-ancrage-physique",
        title: "Des zones Holonet ancrées dans le monde physique",
        level: 2,
        blocks: [
          p("L’Holonet repose sur des objets connectés, des terminaux et des lieux référentiels physiques. Certaines zones corporatives sécurisées n’acceptent donc une connexion que depuis leurs propres locaux. Être présent sur place, franchir le contrôle d’accès et utiliser le réseau autorisé font partie de la protection."),
          p("Cette correspondance entre lieu réel et espace virtuel donne aux territoires une seconde géographie. Une porte, un étage ou une station peuvent marquer à la fois une frontière matérielle et le passage vers des services numériques qui n’existent pas pour un utilisateur connecté depuis l’extérieur.")
        ]
      },
      {
        id: "culture-partagee-talkshow-lys",
        title: "Culture partagée · le talk-show de Lys",
        level: 2,
        blocks: [
          p("Les médias corporatifs produisent des rendez-vous suivis simultanément par des millions de personnes. Le talk-show de Lys est l’un de ces programmes incontournables : invités politiques, figures publiques et débats de société y deviennent des événements Holonet en direct."),
          p("Son audience montre qu’une culture commune subsiste malgré la fragmentation des réseaux. Elle montre aussi le pouvoir des Mediacorpos : choisir l’invité, le format et l’angle d’un entretien suffit souvent à fixer la conversation publique des jours suivants.")
        ]
      }
    ]
  },
  "realite-v9-augmentations-corps-sante": {
    tags: ["inégalités", "cybernétique", "biotechnologies"],
    sections: [
      {
        id: "cyber-rue-bio-richesse-stereotype",
        title: "Cyber dans la rue, bio chez les riches ?",
        level: 2,
        blocks: [
          p("Un vieux stéréotype oppose la cybernétique visible, robuste et réparable des classes populaires aux augmentations organiques discrètes des plus riches. Il décrit une tendance historique : les premières prothèses mécaniques se sont diffusées par l’industrie, l’armée et les ateliers, tandis que la culture de tissus sur mesure exigeait des cliniques coûteuses."),
          p("En 2035, cette opposition n’est plus une règle. Une cyberaugmentation de pointe peut coûter une fortune, une solution organique standardisée peut devenir accessible, et les choix dépendent du métier, de la maintenance, de la culture ou du goût autant que du revenu. L’apparence d’un corps ne permet donc pas de lire sûrement la fortune de son propriétaire.")
        ]
      }
    ]
  }
};

const stabSections: JsonObject[] = [
  {
    id: "organisation",
    title: "Mandat et héritage du TDO",
    level: 2,
    blocks: [
      p("La Special Technologic Anti-abuses Bureau surveille les technologies dangereuses et intervient lorsqu’un abus technologique est avéré. Créée en Californie, elle prolonge le Technologic Development Committee du PCRC, dirigé par Leslie Wright pendant la guerre pour analyser, reproduire et sécuriser les technologies militaires."),
      p("La STAB ne remplace pas une police judiciaire. Elle évalue le danger, fournit l’expertise et neutralise les matériels ou groupes qui dépassent les capacités ordinaires. Le CBII conduit les enquêtes criminelles ; la CPP traite les produits prohibés et la contrebande.")
    ]
  },
  {
    id: "poles-sections",
    title: "Deux pôles, trois sections",
    level: 2,
    blocks: [
      p("Un pôle scientifique étudie brevets, augmentations, armements et moyens de transport. Un pôle opérationnel transforme cette expertise en procédures, contre-mesures et unités de suppression."),
      {
        type: "table",
        rows: [
          ["Section", "Responsable", "Fonction"],
          ["Observatoire", "Hye-Bin Chon", "Veille, signalement et qualification initiale des risques"],
          ["Développement", "Bronislav Morozoff", "Analyse, reproduction contrôlée et conception de contre-mesures"],
          ["Opérations", "Shigenobu Higuchi", "Préparation et conduite des interventions spécialisées"]
        ]
      }
    ]
  },
  {
    id: "brevets-juridiction",
    title: "Brevets, commercialisation et juridiction",
    level: 2,
    blocks: [
      p("Pour commercialiser une technologie sur le territoire californien, une corporation doit permettre son contrôle. La STAB peut ainsi examiner les brevets concernés et développer des réponses adaptées, ce que les groupes industriels dénoncent comme une atteinte majeure à leur propriété."),
      p("Cette compétence a une limite : une technologie qui n’est ni produite, ni commercialisée, ni introduite en Californie ne tombe pas automatiquement sous son autorité. Certaines corporations exploitent cette frontière en faisant circuler prototypes et stocks interdits par la Pègre ou des intermédiaires Crawlers."),
      p("Une saisie technologique peut déclencher des contrôles croisés de la CPP, du CSC et du CBII. Le risque ne se limite donc pas à la perte du matériel : il peut ouvrir les brevets liés au dossier et entraîner une enquête contre les cadres responsables.")
    ]
  },
  {
    id: "unites-intervention",
    title: "Intervenir contre les déviants technologiques",
    level: 2,
    blocks: [
      p("La STAB réserve ses unités de suppression aux groupes assez armés ou augmentés pour dépasser une intervention ordinaire. Les CyberKnights, parfois surnommés Cyns, constituent sa force la plus redoutée. Leur nature exacte et leur lien supposé avec une sixième génération du programme Phoenix ne sont pas reconnus publiquement par l’agence."),
      {
        type: "table",
        rows: [
          ["Unité", "Institution", "Spécialité"],
          ["FA", "LAUS", "Intervention dans les zones abandonnées"],
          ["AITIF", "Police de Las Vegas", "Cibles technoboostées"],
          ["HWAB", "LAUS", "Armes lourdes et augmentations"],
          ["Black Cyclops", "CBII", "Intervention lourde d’agence"],
          ["CyberKnights", "STAB", "Suppression technologique de dernier recours"]
        ]
      }
    ]
  },
  {
    id: "coordination",
    title: "Une expertise au service des autres agences",
    level: 2,
    blocks: [
      p("La STAB travaille avec les laboratoires d’État, les académies publiques et les unités de recherche indépendantes des corporations. Elle prête ses contre-mesures aux forces capables de les employer et rejoint la CPP, le CSC ou le CBII lorsque la technologie dangereuse révèle un trafic, une fraude de conformité ou une organisation criminelle."),
      p("Sa puissance vient de cette articulation : observer, comprendre, développer puis intervenir. Elle n’a pas vocation à criminaliser toute innovation ni à enquêter seule sur ses concepteurs.")
    ]
  },
  {
    id: "statut-mondial",
    title: "Une agence née en Californie devenue mondiale",
    level: 2,
    blocks: [
      p("Née pour répondre aux conséquences de la guerre technologique en Californie, la STAB agit désormais à une échelle internationale. Cette vocation mondiale repose sur son expertise et ses partenariats ; elle ne lui donne pas une compétence universelle indépendante des territoires, des accords et des conditions de commercialisation.")
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

function requireArticle(byId: Map<string, Article>, id: string): Article {
  const article = byId.get(id);
  if (!article) throw new Error(`Cible de clôture éditoriale Réalité absente: ${id}`);
  return article;
}

function insertSections(target: Article, sections: JsonObject[]): void {
  const incomingIds = new Set(sections.map((section) => String(section.id ?? "")));
  target.sections = [
    ...(target.sections ?? []).filter((section) => !incomingIds.has(String(section?.id ?? ""))),
    ...structuredClone(sections)
  ];
}

function enrich(target: Article, source: string, tags: string[]): void {
  target.source = mergeSources(target.source, source);
  target.tags = [...new Set([...(target.tags ?? []), ...tags, "Multi-source"])];
  target.status = "canon_enrichi";
  target.rebuildV2 = true;
}

function scrubUnresolvedStabDirection(article: Article): void {
  for (const section of article.sections ?? []) {
    section.blocks = (section.blocks ?? []).filter((block: JsonObject) => {
      if (block?.type !== "p") return true;
      return !/^Direction\s*:\s*Nehemiah\s+Sellers\s*\(Ou\s+Lisa\s+Eredh[eè]s\s*\?\)/i.test(String(block.text ?? "").trim());
    });

    for (const block of section.blocks ?? []) {
      if (block?.type === "p" && typeof block.text === "string") {
        block.text = block.text
          .replace(/STAB\s+technologies\s+Nehemiah\s+Sellers\s+Directeur/gi, "STAB technologies")
          .replace(/Nehemiah\s+Sellers/gi, "—");
      }
      if (block?.type === "table" && Array.isArray(block.rows)) {
        block.rows = block.rows.map((row: unknown) =>
          Array.isArray(row)
            ? row.map((cell) => String(cell ?? "").replace(/Nehemiah\s+Sellers/gi, "—"))
            : row
        );
      }
    }
  }
}

export function applyCompendiumRealiteV9ClosureLore(byId: Map<string, Article>): void {
  for (const [id, enrichment] of Object.entries(dailyLifeEnrichments)) {
    const target = requireArticle(byId, id);
    insertSections(target, enrichment.sections);
    enrich(target, DAILY_LIFE_SOURCE, enrichment.tags);
  }

  const stab = requireArticle(byId, "realite-v9-stab");
  stab.sections = structuredClone(stabSections);
  enrich(stab, AGENCIES_SOURCE, ["STAB", "brevets", "CyberKnights", "anti-abus technologiques"]);

  for (const id of [
    "realite-v9-agences-securite-enquete",
    "realite-v9-cabinet-secretariats",
    "realite-v9-los-angeles-laus-securites"
  ]) {
    scrubUnresolvedStabDirection(requireArticle(byId, id));
  }
}

export const COMPENDIUM_REALITE_V9_CLOSURE_TARGET_IDS = [
  "realite-v9-technologies-infrastructures-mobilite",
  "realite-v9-holonet-medias-culture-identite",
  "realite-v9-augmentations-corps-sante",
  "realite-v9-stab",
  "realite-v9-agences-securite-enquete",
  "realite-v9-cabinet-secretariats",
  "realite-v9-los-angeles-laus-securites"
] as const;
