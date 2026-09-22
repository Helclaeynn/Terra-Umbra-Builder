import { getCompendiumQualityCorpus, type Article } from "./compendium.js";

type JsonObject = Record<string, any>;

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’'`´]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function isPnj(article: Article): boolean {
  const dataset = String(article.dataset ?? "").toLowerCase();
  return (
    article.category === "Personnages" ||
    dataset.includes("pnj") ||
    Boolean(article.pnj && typeof article.pnj === "object")
  );
}

function hasMeaningfulBlocks(section: JsonObject | undefined): boolean {
  if (!section || !Array.isArray(section.blocks)) return false;
  return section.blocks.some((block: JsonObject) => {
    if (block?.type === "table") return Array.isArray(block.rows) && block.rows.length > 0;
    return String(block?.text ?? "").trim().length > 0;
  });
}

function pnjHasTruthHint(article: Article): boolean {
  const pnj = (article.pnj ?? {}) as JsonObject;
  return Boolean(
    String(pnj.nom_verite ?? "").trim() ||
      String(pnj.race ?? "").trim() ||
      (Array.isArray(pnj.source_verite) && pnj.source_verite.length) ||
      (Array.isArray(pnj.hunter_source_verite) && pnj.hunter_source_verite.length)
  );
}

function pnjHasMjBlock(article: Article): boolean {
  return (article.sections ?? []).some(
    (section: JsonObject) => section?.audience === "mj" && hasMeaningfulBlocks(section)
  );
}

function pnjHasStatsBlock(article: Article): boolean {
  return (article.sections ?? []).some((section: JsonObject) => {
    const marker = String(section?.id ?? "") + " " + String(section?.title ?? "");
    return /profil[-_\s]*(?:stat|mec)|statisti|caract[eé]ristiques/i.test(marker) &&
      hasMeaningfulBlocks(section);
  });
}

function meaningfulSectionCount(article: Article, audience?: string): number {
  return (article.sections ?? []).filter((section: JsonObject) => {
    if (audience && String(section?.audience ?? "public") !== audience) return false;
    return hasMeaningfulBlocks(section);
  }).length;
}

function identityValues(article: Article): string[] {
  const pnj = (article.pnj ?? {}) as JsonObject;
  const values = [
    article.title,
    pnj.nom,
    pnj.name,
    pnj.nom_complet,
    pnj.nom_verite,
    pnj.alias
  ];
  return [...new Set(values.map(normalize).filter((value) => value.length >= 4))];
}

async function main() {
  const corpus = await getCompendiumQualityCorpus();
  const articles = corpus.articles.filter((article) => article.category !== "OLD");
  const navigationIds = new Set(corpus.navigationIds);
  const publicById = new Map(
    corpus.publicArticles
      .filter((article) => article.category !== "OLD")
      .map((article) => [article.id, article])
  );
  const pnjs = articles.filter(isPnj);

  const titleGroups = new Map<string, Article[]>();
  const identityGroups = new Map<string, Article[]>();

  for (const article of pnjs) {
    const titleKey = normalize(article.title ?? article.id);
    if (titleKey) titleGroups.set(titleKey, [...(titleGroups.get(titleKey) ?? []), article]);
    for (const key of identityValues(article)) {
      identityGroups.set(key, [...(identityGroups.get(key) ?? []), article]);
    }
  }

  const duplicateTitleIds = new Set<string>();
  const duplicateIdentityIds = new Set<string>();
  const duplicateTitles: Array<{ key: string; entries: Array<{ id: string; title: string; dataset: string }> }> = [];
  const duplicateIdentities: Array<{ key: string; entries: Array<{ id: string; title: string; dataset: string }> }> = [];

  for (const [key, group] of titleGroups) {
    const unique = [...new Map(group.map((article) => [article.id, article])).values()];
    if (unique.length < 2) continue;
    unique.forEach((article) => duplicateTitleIds.add(article.id));
    duplicateTitles.push({
      key,
      entries: unique.map((article) => ({
        id: article.id,
        title: String(article.title ?? article.id),
        dataset: String(article.dataset ?? "")
      }))
    });
  }

  for (const [key, group] of identityGroups) {
    const unique = [...new Map(group.map((article) => [article.id, article])).values()];
    if (unique.length < 2) continue;
    unique.forEach((article) => duplicateIdentityIds.add(article.id));
    duplicateIdentities.push({
      key,
      entries: unique.map((article) => ({
        id: article.id,
        title: String(article.title ?? article.id),
        dataset: String(article.dataset ?? "")
      }))
    });
  }

  let missingMj = 0;
  let orphanNavigation = 0;
  let mjLeak = 0;
  let emptyPublic = 0;
  let missingStats = 0;

  console.log("PNJ_AUDIT_BEGIN " + JSON.stringify({ activePnj: pnjs.length }));

  for (const article of pnjs) {
    const truthHint = pnjHasTruthHint(article);
    const hasMj = pnjHasMjBlock(article);
    const hasStats = pnjHasStatsBlock(article);
    const orphan = !navigationIds.has(article.id) && article.dataset !== "custom";
    const publicArticle = publicById.get(article.id);
    const leaksMj = Boolean(
      (publicArticle?.sections ?? []).some((section: JsonObject) => section?.audience === "mj")
    );
    const publicSections = meaningfulSectionCount(article, "public") +
      (article.sections ?? []).filter((section: JsonObject) => !section?.audience && hasMeaningfulBlocks(section)).length;
    const noPublicContent = publicSections === 0;

    if (truthHint && !hasMj) missingMj += 1;
    if (orphan) orphanNavigation += 1;
    if (leaksMj) mjLeak += 1;
    if (noPublicContent) emptyPublic += 1;
    if (!hasStats) missingStats += 1;

    const issues: string[] = [];
    if (truthHint && !hasMj) issues.push("pnj_missing_mj");
    if (orphan) issues.push("orphan_navigation");
    if (leaksMj) issues.push("mj_leak");
    if (noPublicContent) issues.push("no_public_content");
    if (duplicateTitleIds.has(article.id)) issues.push("duplicate_title_candidate");
    if (duplicateIdentityIds.has(article.id)) issues.push("duplicate_identity_candidate");

    console.log(
      "PNJ_AUDIT_ITEM " +
        JSON.stringify({
          id: article.id,
          title: String(article.title ?? article.id),
          category: String(article.category ?? ""),
          dataset: String(article.dataset ?? ""),
          source: String(article.source ?? ""),
          truthHint,
          hasMj,
          hasStats,
          inNavigation: navigationIds.has(article.id),
          publicSectionCount: publicSections,
          mjSectionCount: meaningfulSectionCount(article, "mj"),
          issues
        })
    );
  }

  for (const group of duplicateTitles) {
    console.log("PNJ_AUDIT_DUP_TITLE " + JSON.stringify(group));
  }
  for (const group of duplicateIdentities) {
    console.log("PNJ_AUDIT_DUP_IDENTITY " + JSON.stringify(group));
  }

  console.log(
    "PNJ_AUDIT_SUMMARY " +
      JSON.stringify({
        activePnj: pnjs.length,
        missingMj,
        orphanNavigation,
        mjLeak,
        emptyPublic,
        missingStats,
        duplicateTitleGroups: duplicateTitles.length,
        duplicateIdentityGroups: duplicateIdentities.length,
        databaseEditSummary: corpus.databaseEditSummary,
        overrideSummary: corpus.overrideSummary
      })
  );
}

main().catch((error) => {
  console.error("PNJ_AUDIT_ERROR", error);
  process.exitCode = 1;
});
