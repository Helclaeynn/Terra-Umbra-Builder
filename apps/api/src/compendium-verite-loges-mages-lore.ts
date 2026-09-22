type JsonObject = Record<string, any>;

type Article = JsonObject & {
  id: string;
  source?: string;
  status?: string;
  tags?: string[];
  sections?: JsonObject[];
};

const HUB_ID = "verite-v7-mages-mageius-roue-loges";
const CURRENT_SOURCE = "factons_Loges des mages(1).pdf";
const LEGACY_SOURCE = "truth-legacy-consolidation-v1.json";

const p = (text: string): JsonObject => ({ type: "p", style: "lore", text });

export const COMPENDIUM_VERITE_LOGES_MAGES_LORE_SECTIONS: JsonObject[] = [
  {
    id: "loges-mages-institution-2035",
    title: "Ce qu’est une Loge en 2035",
    level: 2,
    blocks: [
      p("Une Loge est une communauté de Mages qui entretient des lieux, des savoirs, des relations de tutorat et des moyens de protection. Elle peut prendre la forme d’un cercle ancien, d’un réseau urbain ou d’une alliance plus circonstancielle. Elle n’est ni une administration mondiale, ni une école uniforme : chaque Loge choisit ce qu’elle transmet, les dangers auxquels elle répond et les autres communautés avec lesquelles elle accepte de traiter."),
      p("Les Loges rendent la pratique magique moins solitaire. Elles offrent des pairs capables d’identifier un Mageius, d’évaluer une expérience risquée, de conserver une archive ou d’organiser une réponse collective. Cette solidarité n’efface ni les ambitions personnelles ni les désaccords sur ce que les Mages doivent faire de leur pouvoir.")
    ]
  },
  {
    id: "loges-mages-heritage-guerre",
    title: "L’héritage de la guerre des Loges",
    level: 2,
    blocks: [
      p("Les Loges contemporaines vivent encore avec la mémoire de conflits durant lesquels des communautés entières ont été absorbées, dispersées ou détruites. Les rivalités ne portent pas seulement sur le prestige : protéger un Mage, accueillir un exilé ou revendiquer une tradition peut déplacer l’équilibre entre plusieurs villes."),
      p("La guerre du Pacifique a ravivé cette logique. La Loge de Séoul a soumis ou anéanti plusieurs Loges d’Extrême-Orient, poussant des survivants vers la Californie. La Loge de Phoenix s’est ainsi affirmée comme un pôle asiatique d’exil, tandis que Los Angeles, San Diejuana et les autres Loges californiennes ont dû redéfinir leurs alliances.")
    ]
  },
  {
    id: "loges-mages-territoire-autonomie-diplomatie",
    title: "Territoire, autonomie et diplomatie",
    level: 2,
    blocks: [
      p("Le nom d’une ville désigne un centre de gravité, pas une frontière étanche. Un Mage peut travailler pour une corporation, une agence publique, une mafia ou les Crawlers tout en restant lié à sa Loge. Ces affiliations donnent aux communautés des relais dans la Réalité, mais elles créent aussi des loyautés concurrentes."),
      p("Les relations entre Loges reposent donc sur la négociation : échange d’archives, accueil d’un apprenti, droit de poursuivre une menace, soutien contre un adversaire commun ou simple reconnaissance mutuelle. Une alliance sur un dossier ne vaut jamais soumission générale, et une rivalité ancienne n’empêche pas nécessairement une coopération ponctuelle.")
    ]
  },
  {
    id: "loges-mages-rangs-reconnaissance",
    title: "Rangs de reconnaissance",
    level: 2,
    blocks: [
      p("Certaines Loges ont conservé un vocabulaire de reconnaissance hérité de traditions anciennes : Magister, Référent, Tuteur et Singularis. Ces termes ne forment pas une hiérarchie mondiale uniforme ; leur portée exacte dépend de la Loge, de son histoire et de ses usages."),
      p("Magister désigne généralement un praticien reconnu pour sa maîtrise et sa capacité à transmettre. Référent qualifie un Mage auquel une communauté confie durablement un domaine, un lieu ou une responsabilité. Tuteur insiste sur la relation de formation. Singularis, ou Singulier, désigne dans plusieurs traditions un Mage devenu autonome et qui n’est plus traité comme un apprenti.")
    ]
  },
  {
    id: "loges-mages-former-apprentis",
    title: "Former les apprentis",
    level: 2,
    blocks: [
      p("L’apprentissage magique repose rarement sur la seule lecture d’archives. Les Loges organisent des cours, laboratoires, ateliers, exercices surveillés et relations de tutorat afin qu’un Mage apprenne à confronter ce qu’il croit comprendre aux conséquences réelles de sa pratique."),
      p("Les formes varient énormément : enseignement collectif, compagnonnage auprès d’un Tuteur, spécialisation dans une bibliothèque ou un laboratoire, échanges entre Loges. La transmission est une fonction sociale des Loges, pas un modèle scolaire unique imposé à tous les Mages.")
    ]
  },
  {
    id: "loges-mages-dossier-new-york",
    title: "Dossier de Loge · New York",
    level: 2,
    blocks: [
      p("New York réunit des Mages anciens, puissants et très visibles dans les grands réseaux de la Réalité. La Loge dispose de relais gouvernementaux et corporatifs, mais son influence tient surtout à l’expérience de figures capables d’agir sur les éléments, le temps, les illusions, les sceaux, le sang et la nécromancie."),
      p("Cette puissance ne produit pas une ligne politique paisible. La réputation de Daghain, les interdits imposés à Saint-Germain et l’héritage arthurien de Morgane, Viviane et Gwenddydd font de New York un partenaire recherché autant qu’un foyer de tensions avec Atlantes, Vampires et autres Loges.")
    ]
  },
  {
    id: "loges-mages-dossier-los-angeles",
    title: "Dossier de Loge · Los Angeles",
    level: 2,
    blocks: [
      p("La Loge de Los Angeles traverse presque tous les milieux de la ville : corporations, Crawlers, Pègre et Chasseurs. Ses membres couvrent la transformation du vivant, l’alchimie, les ténèbres, la guérison et les sceaux. Elle fonctionne moins comme une institution isolée que comme un carrefour où les intérêts de la métropole se rencontrent."),
      p("Cette diversité rend la Loge influente mais difficile à aligner. Les absences de Doussou Damba, les ambitions de Circé, l’indépendance de Naalnish et les collections de Siamak Faghih obligent ses membres à composer en permanence avec des projets personnels qui dépassent la seule politique locale.")
    ]
  },
  {
    id: "loges-mages-dossier-san-diejuana",
    title: "Dossier de Loge · San Diejuana",
    level: 2,
    blocks: [
      p("San Diejuana est fortement liée aux scènes Crawlers. Alchimie des poisons, chevalerie télékinétique, magie spectrale, déplacement temporel, nécromancie et lumière y forment un ensemble aussi mobile que dangereux. La Loge protège son autonomie face au poids de Los Angeles."),
      p("Mithridate et Zephania défendent cette indépendance, tout en sachant qu’une entente avec Circé peut devenir nécessaire face à New York. Les inimitiés d’Autolycos, de Maugis ou d’Elyon rappellent que la diplomatie entre Loges se construit souvent autour d’adversaires communs plutôt que d’une confiance durable.")
    ]
  },
  {
    id: "loges-mages-dossier-las-vegas",
    title: "Dossier de Loge · Las Vegas",
    level: 2,
    blocks: [
      p("Makeda préside la Loge de Las Vegas. Elle y a rassemblé les trois figures connues comme les Rois mages : Melchior, Balthazar et Gaspard. Le groupe associe guérison, désenvoûtement, contrôle mental, divination et magie temporelle."),
      p("Leur réunion n’efface pas leur histoire. Les trois Rois se sont autrefois affrontés pour le trône magique de Jérusalem ; Makeda maintient donc ensemble des puissances dont les ambitions et les liens familiaux peuvent devenir aussi importants que les affaires de la ville.")
    ]
  },
  {
    id: "loges-mages-dossier-phoenix",
    title: "Dossier de Loge · Phoenix",
    level: 2,
    blocks: [
      p("Phoenix est devenue la principale Loge asiatique de Californie après la guerre du Pacifique. Elle accueille des survivants et exilés de communautés détruites ou soumises par la Loge de Séoul, notamment Rangda, Yama-Uba et Xingtian."),
      p("Longtemps secondaire, la Loge a gagné un rôle stratégique dans l’accueil des Mages déplacés. Ses pratiques mêlent modelage, ombres, guérison altérée et nécromancie. Les ambitions de ses protecteurs et la mémoire des défaites asiatiques orientent encore sa politique.")
    ]
  },
  {
    id: "loges-mages-dossier-grande-reserve",
    title: "Dossier de Loge · Grande Réserve",
    level: 2,
    blocks: [
      p("La Loge de la Grande Réserve rassemble des traditions magiques liées à plusieurs nations autochtones sans les réduire à une culture unique. Glooscap, Nanabozo, Naste Estsan et Sokanon portent des histoires, des filiations et des rapports au territoire très différents."),
      p("Ses membres travaillent avec Tala, les Crawlers, la Pègre ou le gouvernement, mais la Loge ne se confond avec aucune de ces structures. Elle protège une autonomie magique propre à la Réserve et maintient des liens personnels avec Los Angeles, parfois plus forts que les préférences institutionnelles.")
    ]
  },
  {
    id: "loges-mages-dossier-autres",
    title: "Dossier · Autres Loges et indépendants",
    level: 2,
    blocks: [
      p("Toutes les communautés ne se rattachent pas aux six pôles précédents. Portland et la Loge d’Écume s’opposent autour de pratiques liées aux lignées garoues et à Vhodhal. D’autres Mages refusent la discipline des Loges ou construisent leur propre projet."),
      p("Faust, Leslie Wright et Anahita sont qualifiés de renégats, mais ce terme recouvre des situations très différentes. Ana Diana de la Caza appartient à un culte de Fléau ; Nycellyon suit une institution religieuse ; Alice demeure indépendante. Cet ensemble décrit des positions extérieures aux Loges reconnues, pas une organisation commune.")
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

export function applyCompendiumVeriteLogesMagesLore(byId: Map<string, Article>): void {
  const target = byId.get(HUB_ID);
  if (!target) throw new Error(`Hub des Loges absent: ${HUB_ID}`);

  const incomingIds = new Set(COMPENDIUM_VERITE_LOGES_MAGES_LORE_SECTIONS.map((section) => String(section.id)));
  const sections = (target.sections ?? []).filter((section) => !incomingIds.has(String(section?.id ?? "")));
  const rosterIndex = sections.findIndex((section) => String(section?.id ?? "").startsWith("loges-mages-loge-") || String(section?.id ?? "") === "loges-mages-autres-loges");
  const insertionIndex = rosterIndex >= 0 ? rosterIndex : sections.length;

  target.sections = [
    ...sections.slice(0, insertionIndex),
    ...structuredClone(COMPENDIUM_VERITE_LOGES_MAGES_LORE_SECTIONS),
    ...sections.slice(insertionIndex)
  ];
  target.source = mergeSources(target.source, CURRENT_SOURCE, LEGACY_SOURCE);
  target.tags = [...new Set([...(target.tags ?? []), "Loges des Mages", "apprentissage", "diplomatie", "Multi-source"])];
  target.status = "canon_enrichi";
  target.rebuildV2 = true;
}
