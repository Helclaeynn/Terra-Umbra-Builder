type RewritePair = readonly [source: string, replacement: string];

type EditorialCleanupRule = {
  articleId: string;
  paragraphs?: readonly RewritePair[];
  sectionTitles?: readonly RewritePair[];
  cells?: readonly RewritePair[];
};

type ArticleLike = {
  id?: unknown;
  sections?: Array<Record<string, any>>;
};

export type FinalEditorialCleanupStats = {
  paragraphs: number;
  sectionTitles: number;
  cells: number;
};

export const FINAL_EDITORIAL_CLEANUP_RULES: readonly EditorialCleanupRule[] = [
  {
    articleId: "realite-v9-mairies-pouvoirs-locaux",
    paragraphs: [
      [
        "(La police est définie dans un autre fichier quant à elle.)",
        "La police possède toutefois sa propre organisation et ne se confond pas avec l’administration municipale."
      ]
    ]
  },
  {
    articleId: "realite-v9-pegre-mafias-gangs",
    paragraphs: [
      [
        "Document -Organisation TUC – La pègre",
        "La Pègre justifie son action par l’abandon des populations durant les crises et par la domination corporatiste."
      ]
    ]
  },
  {
    articleId: "realite-v9-gangs-underlife",
    paragraphs: [
      [
        "Il n’existe aucun crawler qui ne soit pas un délinquant, de fait, ils sont des outils prodigieux pour la Pègre, mais en tant que criminels, les crawlers n’ont pas d’organisation, c’est ainsi qu’ils n’entrent pas dans la catégorie « Crime organisé » et sont donc abordés en fin de document.",
        "Les Crawlers criminels sont des outils prodigieux pour la Pègre, mais ils ne forment pas à eux seuls une organisation unifiée. Ils n’entrent donc pas dans la catégorie du « crime organisé » et restent distingués des structures mafieuses."
      ],
      [
        "On parlera d’ailleurs des « crawlers » spécifiquement liés aux Mafias, et non des crawlers en général, qui ont leur propre document dédié (cf. « TUC_organisations_crawlers »).",
        "Seuls les Crawlers directement liés aux mafias sont traités ici. Les autres relèvent de leurs propres familles et organisations."
      ]
    ]
  },
  {
    articleId: "realite-v9-crawlers-insurges-la-grande-revolution",
    paragraphs: [
      [
        "La « grande révolution » (dans le texte, toujours en français), est la faction révolutionnaire européenne si ce n’est mondiale la plus farouche. Elle compte énormément de membres, répartis sur tous les continents, surtout dans les anciennes colonies et territoires français hors métropole. Elle s’appuie sur un réseau assez compliqué de chantage et de dettes pour assurer sa continuité et une certaine part de mystère.",
        "La « Grande Révolution », dont le nom demeure toujours en français, est la faction révolutionnaire européenne, sinon mondiale, la plus farouche. Elle compte énormément de membres, répartis sur tous les continents, surtout dans les anciennes colonies et territoires français hors métropole. Elle s’appuie sur un réseau complexe de chantage et de dettes pour assurer sa continuité et préserver une part de mystère."
      ]
    ]
  },
  {
    articleId: "realite-v9-agences-securite-enquete",
    sectionTitles: [
      ["Structures spécialisées également documentées", "Structures spécialisées complémentaires"]
    ],
    paragraphs: [
      [
        "En 2035, le cabinet emploie les dénominations et directions présentées ci-dessus. Certaines agences, comme le CSC, prolongent des structures antérieures dont elles conservent les méthodes et les missions compatibles.",
        "En 2035, le cabinet emploie ces dénominations et conserve ces directions. Certaines agences, comme le CSC, prolongent des structures antérieures dont elles conservent les méthodes et les missions compatibles."
      ],
      [
        "NRMD et EIO n’apparaissent pas parmi les dix directions principales du cabinet gouvernemental plus récent ; ils restent conservés comme organismes spécialisés faute de source indiquant leur suppression.",
        "NRMD et EIO ne siègent pas parmi les dix directions principales du cabinet en 2035 ; ils subsistent comme organismes spécialisés en dehors de ce cercle."
      ]
    ],
    cells: [
      [
        "Ancienne forme documentée du contrôle des standards corporatifs ; ses pratiques compatibles sont reprises dans la page CSC.",
        "Structure antérieure de contrôle des standards corporatifs ; le CSC en reprend les pratiques compatibles."
      ]
    ]
  },
  {
    articleId: "verite-ten-eveils-2035",
    paragraphs: [
      [
        "Cette page est un dossier MJ. Elle distingue volontairement les faits datés des trames non datées ou explicitement à venir. Une date inconnue dans la source reste inconnue : aucune date n’est inventée pour compléter la chronologie.",
        "Cette page est un dossier MJ. Elle distingue volontairement les faits datés des trames non datées ou explicitement à venir. Une date inconnue demeure inconnue : aucune datation n’est ajoutée pour compléter la chronologie."
      ],
      [
        "Deux doublons internes de la source sont fusionnés ici : l’attaque de la Nextar Tower n’existe qu’une fois malgré son apparition dans plusieurs trames, et le grand tournoi des arts martiaux est un événement unique partagé entre Wei et Dina.",
        "L’attaque de la Nextar Tower et le grand tournoi des arts martiaux n’apparaissent chacun qu’une fois dans cette chronologie. Le tournoi appartient à la fois aux trames de Wei et de Dina."
      ]
    ]
  },
  {
    articleId: "verite-v7-daemons-divinites-maisonnees-temples",
    sectionTitles: [
      ["Temples documentés", "Temples recensés"],
      ["Dossier MJ · Incarnations documentées", "Dossier MJ · Incarnations connues"]
    ],
    paragraphs: [
      [
        "Complément issu du corpus Angelus / Arbre de Vie déjà intégré en V2 : le schéma sephirien d’Elynea associe dix Sephiroth à dix puissances daemoniaques sacrifiées. Cette information est un lien croisé de corpus et ne provient pas du document des Temples démoniaques.",
        "Le schéma sephirien d’Elynea associe dix Sephiroth à dix puissances daemoniaques sacrifiées. Ce lien avec l’Arbre de Vie complète l’histoire des Temples sans modifier leur organisation propre."
      ],
      [
        "Le document conserve aussi plusieurs figures hors des chapitres de Temples. Focalor et Alocer restent rattachés respectivement à Baal et Astaroth ; Caïn occupe une position de Prince et de puissance divine atypique ; Birrahgnooloo / Byamee Waagal est décrite comme une divinité médiane oubliée, indépendante des grands plans divins, créatrice du Temps du Rêve et disposant de sa propre dimension onirique ainsi que de ses propres daemons.",
        "Plusieurs figures demeurent hors des principaux Temples. Focalor et Alocer restent rattachés respectivement à Baal et Astaroth ; Caïn occupe une position de Prince et de puissance divine atypique ; Birrahgnooloo / Byamee Waagal est décrite comme une divinité médiane oubliée, indépendante des grands plans divins, créatrice du Temps du Rêve et disposant de sa propre dimension onirique ainsi que de ses propres daemons."
      ]
    ],
    cells: [["Fiches documentées", "Incarnations recensées"]]
  },
  {
    articleId: "verite-v7-angelus-elynea-arbre-vie",
    paragraphs: [
      [
        "Cette filiation est ce que la plupart des habitants du monde tiennent pour vrai. Elle ne correspond pas à la généalogie réelle d’Elynea, connue de très peu d’individus et conservée telle qu’elle est déjà documentée dans le canon V2.",
        "Cette filiation est ce que la plupart des habitants du monde tiennent pour vrai. Elle ne correspond pas à la généalogie réelle d’Elynea, tenue secrète et connue de très peu d’individus."
      ]
    ]
  },
  {
    articleId: "verite-v7-descendants-khinae",
    sectionTitles: [["Lignées majeures conservées dans le corpus", "Lignées majeures"]],
    paragraphs: [
      [
        "Ces Lignées sont rares et leur présence dans le corpus ne signifie pas qu'elles soient disponibles partout. La rareté doit servir le monde : familles dispersées, petites communautés, manque d'infrastructure et rencontres parfois uniques.",
        "Ces Lignées sont rares et ne sont pas disponibles partout. La rareté doit servir le monde : familles dispersées, petites communautés, manque d’infrastructure et rencontres parfois uniques."
      ]
    ],
    cells: [
      [
        "Branche lourde d'embuscade aquatique ; armure naturelle, lenteur terrestre et morphologies héritées d'un corpus ancien plus esquissé.",
        "Branche lourde d’embuscade aquatique ; armure naturelle et lenteur terrestre."
      ]
    ]
  },
  {
    articleId: "regles-verite-v7-khinae-moteur-lignees",
    paragraphs: [
      [
        "Développement mécanique extrapolé d'un corpus ancien plus esquissé : branche terrestre lourde, très blindée, lente à terre et spécialisée dans l'embuscade aquatique et la prise de mâchoire.",
        "Les Crocodiliens forment une branche terrestre lourde, très blindée, lente à terre et spécialisée dans l’embuscade aquatique et la prise de mâchoire."
      ]
    ]
  },
  {
    articleId: "verite-v7-homo-superior-adrak-profils-rares",
    paragraphs: [
      [
        "Ils restent des profils rares du corpus, pas deux grandes Natures autonomes équivalentes aux Vampires, Garous, Mages ou Angelus. Leur intérêt vient précisément de ce qu’ils révèlent sur l’échelle galactique du monde et sur les limites de la définition humaine de l’espèce.",
        "Ils restent des profils rares, pas deux grandes Natures autonomes équivalentes aux Vampires, Garous, Mages ou Angelus. Leur intérêt vient précisément de ce qu’ils révèlent sur l’échelle galactique du monde et sur les limites de la définition humaine de l’espèce."
      ]
    ]
  },
  {
    articleId: "verite-especes-creatures-ombres",
    paragraphs: [
      [
        "Les Voyageurs regroupent de très anciennes espèces terrestres fortement liées à la Magie. Ils franchissent dimensions et illusions comme si les frontières n’étaient qu’un rideau, perturbent fortement l’Hologramme et ne reconnaissent aucune autorité commune. Le texte cite notamment les Croquemitaines, Amazones, Dises et Gorgones. Avec les Mages, ils comptent parmi les rares créatures décrites comme possédant des Mageius ; cette proximité fut aussi l’une des raisons de leur extermination par les Mages.",
        "Les Voyageurs regroupent de très anciennes espèces terrestres fortement liées à la Magie. Ils franchissent dimensions et illusions comme si les frontières n’étaient qu’un rideau, perturbent fortement l’Hologramme et ne reconnaissent aucune autorité commune. Les Croquemitaines, Amazones, Dises et Gorgones en font notamment partie. Avec les Mages, ils comptent parmi les rares créatures décrites comme possédant des Mageius ; cette proximité fut aussi l’une des raisons de leur extermination par les Mages."
      ]
    ]
  },
  {
    articleId: "verite-especes-creatures-revenants",
    paragraphs: [
      [
        "Les Revenants proviennent d’espèces vivantes. Après la mort, un corps ou une âme peut se réanimer sous l’effet d’un pouvoir, d’une volonté, d’une erreur du Cycle ou d’un processus prolongé. Toutes les espèces vivantes sont présentées comme potentiellement concernées. Le texte insiste sur leur danger : l’exposition répétée aux Revenants favoriserait à son tour l’apparition de nouveaux Revenants.",
        "Les Revenants proviennent d’espèces vivantes. Après la mort, un corps ou une âme peut se réanimer sous l’effet d’un pouvoir, d’une volonté, d’une erreur du Cycle ou d’un processus prolongé. Toutes les espèces vivantes peuvent potentiellement être concernées. Les Revenants restent particulièrement dangereux : leur exposition répétée favoriserait à son tour l’apparition de nouveaux Revenants."
      ]
    ]
  },
  {
    articleId: "verite-points-rencontre",
    sectionTitles: [["Lieux documentés", "Lieux recensés"]]
  }
] as const;

const RULES_BY_ARTICLE = new Map<string, EditorialCleanupRule>(
  FINAL_EDITORIAL_CLEANUP_RULES.map((rule) => [rule.articleId, rule])
);

const rewrite = (value: unknown, rewrites: ReadonlyMap<string, string>) =>
  rewrites.get(String(value ?? ""));

export function applyFinalEditorialCleanup(article: ArticleLike): FinalEditorialCleanupStats {
  const stats: FinalEditorialCleanupStats = { paragraphs: 0, sectionTitles: 0, cells: 0 };
  const rule = RULES_BY_ARTICLE.get(String(article.id ?? ""));
  if (!rule) return stats;

  const paragraphRewrites = new Map<string, string>(rule.paragraphs ?? []);
  const titleRewrites = new Map<string, string>(rule.sectionTitles ?? []);
  const cellRewrites = new Map<string, string>(rule.cells ?? []);

  for (const section of article.sections ?? []) {
    const titleReplacement = rewrite(section.title, titleRewrites);
    if (titleReplacement !== undefined) {
      section.title = titleReplacement;
      stats.sectionTitles += 1;
    }

    for (const block of section.blocks ?? []) {
      if (block?.type === "p") {
        const replacement = rewrite(block.text, paragraphRewrites);
        if (replacement !== undefined) {
          block.text = replacement;
          stats.paragraphs += 1;
        }
        continue;
      }

      if (block?.type !== "table" || !Array.isArray(block.rows)) continue;
      block.rows = block.rows.map((row: unknown) => {
        if (!Array.isArray(row)) return row;
        return row.map((cell) => {
          const replacement = rewrite(cell, cellRewrites);
          if (replacement === undefined) return cell;
          stats.cells += 1;
          return replacement;
        });
      });
    }
  }

  return stats;
}

export const FINAL_EDITORIAL_CLEANUP_EXPECTED = FINAL_EDITORIAL_CLEANUP_RULES.reduce(
  (total, rule) => ({
    paragraphs: total.paragraphs + (rule.paragraphs?.length ?? 0),
    sectionTitles: total.sectionTitles + (rule.sectionTitles?.length ?? 0),
    cells: total.cells + (rule.cells?.length ?? 0)
  }),
  { paragraphs: 0, sectionTitles: 0, cells: 0 }
);
