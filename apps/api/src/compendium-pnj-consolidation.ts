type Section = Record<string, any>;
type Article = Record<string, any> & { id: string; sections?: Section[] };

function isStatistics(section: Section): boolean {
  const label = `${String(section.id ?? "")} ${String(section.title ?? "")}`.toLowerCase();
  return /profil.statistique|statistiques/.test(label);
}

function isExplicitSecret(section: Section): boolean {
  return /^dossier v[ée]rit[ée](?:\s|\s*[—·:])/i.test(String(section.title ?? ""));
}

function combineSections(sections: Section[], id: string, title: string): Section | null {
  if (!sections.length) return null;
  const blocks: Array<Record<string, unknown>> = [];
  for (const section of sections) {
    if (!Array.isArray(section.blocks) || !section.blocks.length) continue;
    if (sections.length > 1 && section.title && !isStatistics(section)) {
      blocks.push({ type: "p", style: "source-heading", text: String(section.title) });
    }
    blocks.push(...section.blocks);
  }
  return {
    id,
    title,
    level: 2,
    audience: "mj",
    blocks,
    sourceSectionIds: sections.map((section) => String(section.id ?? "")).filter(Boolean)
  };
}

function truthSpecies(value: unknown): string {
  const source = String(value ?? "").trim();
  if (/loups?[\s-]*garous?/i.test(source)) return "loup-garou";
  return source;
}

/** Consolidate only promoted PNJ, leaving the OLD archive intact. */
export function consolidateActivePnjSections(byId: Map<string, Article>): void {
  for (const article of byId.values()) {
    if (article.rebuildV2 !== true ||
        (article.category !== "Personnages" && !String(article.dataset ?? "").includes("pnj"))) continue;

    // The source title is a protected Mage name; the civilian identity is
    // already present in this profile and must lead its public entry.
    if (article.id === "pnj-loges-mages-naalnish-09") article.title = "Naalnish";

    const truthName = String(article.pnj?.nom_verite ?? "").trim();
    const species = truthSpecies(article.pnj?.race);
    article.secretTags = [
      ...(truthName && truthName.length <= 120 && !/^[_?\s]+$/.test(truthName)
        ? [`vérité/nom/${truthName}`] : []),
      ...(species && species.length <= 100 && !/^[_?\s]+$/.test(species)
        ? [`vérité/espèce/${species}`] : [])
    ];

    const publicSections: Section[] = [];
    const secretSections: Section[] = [];
    const statisticSections: Section[] = [];
    for (const section of article.sections ?? []) {
      if (isStatistics(section)) statisticSections.push(section);
      else if (section.audience === "mj" || isExplicitSecret(section)) secretSections.push(section);
      else publicSections.push(section);
    }

    // Keep the original order of source blocks and their headings inside the
    // single private dossier. The statistics remain the final, private section.
    const dossier = combineSections(secretSections, "dossier-mj-consolide", "Dossier MJ · Vérité et secrets");
    const statistics = combineSections(statisticSections, "profil-statistique", "Profil statistique");
    article.sections = [...publicSections, ...(dossier ? [dossier] : []), ...(statistics ? [statistics] : [])];
  }
}
