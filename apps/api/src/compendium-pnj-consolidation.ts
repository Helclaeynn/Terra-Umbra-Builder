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

const REALITY_FACTIONS: Record<string, string> = {
  Crawlers: "crawlers", "Anti-système": "anti-système", Corporations: "corporatiste",
  Corporatiste: "corporatiste", Gouvernement: "gouvernement", Agences: "gouvernement",
  Police: "gouvernement", police: "gouvernement", Pègre: "pègre", Religion: "religieux",
  Chrétienté: "religieux", Insurgés: "insurgés", Association: "associatif"
};
const REALITY_ROLES = new Set([
  "Freerunners", "Gundrivers", "DeathRunners", "Neurodivers", "Meditechs",
  "Fixers", "Neopunks", "Enders", "Motards", "Justice", "Présidence"
]);
const TRUTH_GROUPS: Record<string, string> = {
  Vampires: "vampires", Vampire: "vampires", "Loups-garous": "loups-garous",
  Mages: "mages", Daemons: "daemons", Angelus: "angelus", Exilés: "exilés",
  Extrals: "extrals", Aseryns: "aseryns", Chasseurs: "chasseurs",
  Fléaux: "fléaux", "Humanité galactique": "humanité galactique",
  Pelages: "pelages", "Autres créatures": "créatures"
};
const SPECIES_ALIASES: Array<[RegExp, string]> = [
  [/^loups?[\s-]*garous?$/i, "loup-garou"],
  [/^vampires?$/i, "vampire"], [/^daemons?$/i, "daemon"],
  [/^angelus$/i, "angelus"], [/^archangelus$/i, "archangelus"],
  [/^mages?$/i, "mage"], [/^humain(?:e|s|es)?$/i, "humain"],
  [/^aseryn(?:e|s|es)?$/i, "aseryn"], [/^elfes?$/i, "elfe"],
  [/^nains?|^naines?$/i, "nain"], [/^orques?$/i, "orque"],
  [/^gobelin(?:e|s|es)?$/i, "gobelin"], [/^fl[ée]aux?$/i, "fléau"],
  [/^abominations?$/i, "abomination"], [/^dragons?$/i, "dragon"],
  [/^voyageurs?$/i, "voyageur"], [/^rocr[ée]enn?e?$/i, "rocréen"],
  [/^mo[’']senn?e?$/i, "mo’sen"], [/^thalsioss?e?$/i, "thalsios"],
  [/^talass?e?$/i, "talass"], [/^azm[ée]norienn?e?$/i, "azménorien"],
  [/^bas[ée]ann?e?$/i, "baséen"], [/^s[ée]ryss?e?$/i, "sérys"]
];

function canonicalSpecies(value: unknown): string {
  const raw = truthSpecies(value).replace(/[«»]/g, "").trim();
  if (!raw || /^[_?\s]+$/.test(raw) || raw.includes("￾") || raw.length > 100) return "";
  const stem = raw.replace(/\s*\([^)]*\).*/, "").trim();
  for (const [pattern, label] of SPECIES_ALIASES) if (pattern.test(stem)) return label;
  // Preserve unfamiliar species exactly; no species is inferred from a dossier's folder.
  return raw.toLocaleLowerCase("fr");
}

function distinct(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

const REALITY_FIELDS: Array<[RegExp, string]> = [
  [/^(nom(?:\s*\/\s*identit[ée] de r[ée]alit[ée])?|identit[ée] connue)$/i, "Nom"],
  [/^alias(?:\s*\/\s*d[ée]signation)?$|^alias policier$/i, "Alias"],
  [/^\u00e2ge(?: apparent)?$/i, "Âge"],
  [/^nationalit[ée](?: d.origine| d[ée]clar[ée]e)?$/i, "Nationalité"],
  [/^affiliations?$|^affiliation publique$/i, "Affiliations"],
  [/^corporation$|^organisation(?:\s*\/\s*affiliation)?$/i, "Organisation"],
  [/^fonction$|^statut$/i, "Fonction / statut"]
];

function identityLabel(value: unknown): string {
  const label = String(value ?? "").trim();
  return REALITY_FIELDS.find(([pattern]) => pattern.test(label))?.[1] ?? label;
}

function isRealityIdentityTable(block: Record<string, any>): boolean {
  if (block.type !== "table" || !Array.isArray(block.rows)) return false;
  const rows: unknown[][] = block.rows;
  if (rows.length < 2 || !rows.every((row) => Array.isArray(row) && row.length === 2)) return false;
  const header = rows[0].map((cell) => String(cell ?? "").trim().toLowerCase());
  if (header[0] !== "champ" || header[1] !== "valeur") return false;
  return rows.slice(1).some((row) => ["Nom", "Âge", "Affiliations", "Organisation"]
    .includes(identityLabel(row[0])));
}

function consolidateRealityIdentity(article: Article, sections: Section[]): Section[] {
  const identityTables: Array<{ rows: unknown[][]; title: string }> = [];
  const retained: Section[] = [];
  const protectedNames = new Set<string>();
  for (const section of article.sections ?? []) {
    if (section.audience !== "mj" && !isExplicitSecret(section)) continue;
    for (const block of section.blocks ?? []) {
      if (block.type !== "table" || !Array.isArray(block.rows)) continue;
      for (const row of block.rows) {
        if (!Array.isArray(row) || !/^nom de la v[ée]rit[ée]$/i.test(String(row[0] ?? "").trim())) continue;
        const name = String(row[1] ?? "").trim();
        if (name.length > 3 && name.toLocaleLowerCase("fr") !== String(article.title ?? "").toLocaleLowerCase("fr")) protectedNames.add(name);
      }
    }
  }
  for (const section of sections) {
    if (section.audience === "mj" || isExplicitSecret(section) || isStatistics(section)) {
      retained.push(section);
      continue;
    }
    const blocks: Array<Record<string, any>> = [];
    for (const block of section.blocks ?? []) {
      if (isRealityIdentityTable(block)) identityTables.push({ rows: block.rows, title: section.title });
      else blocks.push(block);
    }
    if (blocks.length || !identityTables.length) {
      retained.push({ ...section, blocks,
        title: String(section.title ?? "").replace(/\s*[·—]\s*source ant[ée]rieure\s*$/i, "").trim() });
    }
  }
  if (!identityTables.length) return retained;
  const fields = new Map<string, string[]>();
  for (const { rows } of identityTables) {
    for (const row of rows.slice(1)) {
      const key = identityLabel(row[0]);
      const value = String(row[1] ?? "").trim();
      if ([...protectedNames].some((name) => value.toLocaleLowerCase("fr").includes(name.toLocaleLowerCase("fr")))) {
        article.__realityIdentityConflicts = distinct([...(article.__realityIdentityConflicts ?? []), "Identité protégée"]);
        continue;
      }
      if (!key || !value || /^champ$/i.test(key)) continue;
      const values = fields.get(key) ?? [];
      if (!values.some((existing) => existing.localeCompare(value, "fr", { sensitivity: "base" }) === 0)) values.push(value);
      fields.set(key, values);
    }
  }
  const preferred = ["Nom", "Alias", "Âge", "Affiliations", "Organisation", "Fonction / statut", "Nationalité"];
  const ordered = [...preferred.filter((field) => fields.has(field)), ...[...fields.keys()].filter((field) => !preferred.includes(field))];
  // A source may disagree with another on age or function. Keep every value in
  // the displayed card and flag the disagreement for fiche-by-fiche review.
  const conflicts = ordered.filter((field) => (fields.get(field)?.length ?? 0) > 1);
  if (conflicts.length) article.__realityIdentityConflicts = distinct([...(article.__realityIdentityConflicts ?? []), ...conflicts]);
  const card: Section = {
    id: "identite-realite-consolidee", title: "Identité · Réalité", level: 2,
    blocks: [{ type: "table", rows: [["Champ", "Valeur"], ...ordered.map((field) =>
      [field, (fields.get(field) ?? []).join(" / ")])] }]
  };
  return [card, ...retained.filter((section) => section.blocks?.length)];
}

function publicIdentityRows(article: Article): { name: string; affiliations: string[] } {
  let name = "";
  const affiliations: string[] = [];
  for (const section of article.sections ?? []) {
    if (section.audience === "mj" || isExplicitSecret(section)) continue;
    for (const block of section.blocks ?? []) {
      if (block.type !== "table" || !Array.isArray(block.rows)) continue;
      for (const row of block.rows) {
        if (!Array.isArray(row) || row.length < 2) continue;
        const label = String(row[0] ?? "").trim();
        const value = String(row[1] ?? "").trim();
        if (!value || value.length > 120 || /[￾]/.test(value)) continue;
        if (/^nom\s*\/\s*identit[ée] de r[ée]alit[ée]$/i.test(label) ||
            (article.dataset === "realite-v9-religions-pnj" && label === "Nom")) name ||= value;
        if (/^affiliations?$/i.test(label)) affiliations.push(value.replace(/[«»]/g, "").trim());
      }
    }
  }
  return { name, affiliations: distinct(affiliations) };
}

function publicAffiliationTags(affiliations: string[]): string[] {
  const tags: string[] = [];
  for (const affiliation of affiliations) {
    if (/^(?:corporati|corporation\b)/i.test(affiliation)) {
      tags.push("réalité/faction/corporatiste");
      const corporation = affiliation.match(/^corporation\s*:\s*(.{2,65})$/i)?.[1]?.trim();
      if (corporation && !/[?￾]/.test(corporation)) tags.push(`réalité/organisation/${corporation}`);
    } else if (/^(?:p[èe]gre|mafias?\b|cartels?\b)/i.test(affiliation)) {
      tags.push("réalité/faction/pègre");
    } else if (/^crawlers?\b/i.test(affiliation)) {
      tags.push("réalité/faction/crawlers");
      for (const role of REALITY_ROLES) {
        if (new RegExp(`\\b${role}\\b`, "i").test(affiliation))
          tags.push(`réalité/rôle/${role.toLocaleLowerCase("fr")}`);
      }
    } else if (/^(?:gouvernement|police|agences?\b)/i.test(affiliation)) {
      tags.push("réalité/faction/gouvernement");
    } else if (/^(?:religion|religieux|chr[ée]tiens?\b)/i.test(affiliation)) {
      tags.push("réalité/faction/religieux");
    } else if (/^insurg[ée]s?\b/i.test(affiliation)) {
      tags.push("réalité/faction/insurgés");
    }
  }
  return tags;
}

function addPnjTaxonomy(article: Article): void {
  const sourceTags: string[] = Array.isArray(article.tags) ? article.tags : [];
  const dataset = String(article.dataset ?? "");
  const reality = sourceTags.includes("Réalité") || dataset.startsWith("realite-");
  const publicIdentity = publicIdentityRows(article);
  const publicTags = ["réalité/type/personnage", ...publicAffiliationTags(publicIdentity.affiliations)];
  // Her public profile names the corporation; the affiliation cell only says
  // "Corporatiste". Keep this documented Reality affiliation searchable.
  if (article.id === "pnj-loges-mages-nina-le-guellec-03" &&
      publicTags.includes("réalité/faction/corporatiste") &&
      (article.sections ?? []).some((section: Section) => section.audience !== "mj" &&
        (section.blocks ?? []).some((block: Record<string, unknown>) =>
          block.type === "p" && /directrice de branche de la Tuatha/i.test(String(block.text ?? ""))))) {
    publicTags.push("réalité/organisation/Tuatha");
  }
  if (reality) {
    if (dataset === "realite-v9-police-pnj") publicTags.push("réalité/faction/gouvernement");
    for (const tag of sourceTags) {
      if (REALITY_FACTIONS[tag]) publicTags.push(`réalité/faction/${REALITY_FACTIONS[tag]}`);
      if (REALITY_ROLES.has(tag)) publicTags.push(`réalité/rôle/${tag.toLocaleLowerCase("fr")}`);
    }
    const organisation = String(article.pnj?.organisation ?? "").trim();
    // A named affiliation is public only when documented in a Reality dossier.
    if (organisation && organisation.length <= 80 && !/[?￾]/.test(organisation) &&
        /^(?:realite-v9-(?:corporations|pegre|agencies|police|government)|points-rencontre)/.test(String(article.dataset ?? ""))) {
      publicTags.push(`réalité/organisation/${organisation}`);
    }
    const subgroup = String(article.navigation?.subgroup ?? "").trim();
    if (subgroup && subgroup.length <= 80 &&
        /^(?:realite-v9-(?:corporations|pegre|crawlers|agencies|police|government|christianity|religions))/.test(String(article.dataset ?? ""))) {
      publicTags.push(`réalité/groupe/${subgroup}`);
    }
  }
  article.tags = distinct([...publicTags, ...sourceTags]);

  const truthName = String(article.pnj?.nom_verite ?? "").trim();
  const species = canonicalSpecies(article.pnj?.race);
  article.secretTags = distinct([
    ...(truthName && truthName.length <= 120 && !/^[_?\s]+$/.test(truthName)
      ? [`vérité/nom/${truthName}`] : []),
    ...(species ? [`vérité/espèce/${species}`] : []),
    ...sourceTags.filter((tag) => TRUTH_GROUPS[tag]).map((tag) => `vérité/groupe/${TRUTH_GROUPS[tag]}`)
  ]);
  const realityName = String(article.pnj?.real_name ?? publicIdentity.name).trim();
  if (realityName && realityName.length <= 120 && !/^[_?\s]+$/.test(realityName)) article.realityName = realityName;
}

/** Consolidate only promoted PNJ, leaving the OLD archive intact. */
export function consolidateActivePnjSections(byId: Map<string, Article>): void {
  for (const article of byId.values()) {
    if (article.rebuildV2 !== true ||
        (article.category !== "Personnages" && !String(article.dataset ?? "").includes("pnj"))) continue;

    // The source title is a protected Mage name; the civilian identity is
    // already present in this profile and must lead its public entry.
    if (article.id === "pnj-loges-mages-naalnish-09") article.title = "Naalnish";

    addPnjTaxonomy(article);

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
    article.sections = [...consolidateRealityIdentity(article, publicSections),
      ...(dossier ? [dossier] : []), ...(statistics ? [statistics] : [])];
  }
}
