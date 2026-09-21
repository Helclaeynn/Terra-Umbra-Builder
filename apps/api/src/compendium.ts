import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import type { FastifyInstance, FastifyReply } from "fastify";
import { currentUser, requireUser } from "./auth.js";
import { pool } from "./db.js";
import {
  COMPENDIUM_GUIDE_ARTICLES,
  COMPENDIUM_GUIDE_NAVIGATION,
  COMPENDIUM_PLAYER_START
} from "./compendium-onboarding.js";
import { generatedTalentHubCorpus } from "./compendium-talent-hubs.js";
import { generatedBuilderReferenceCorpus } from "./compendium-builder-references.js";
import {
  COMPENDIUM_MOTEUR_V4_ARTICLES,
  COMPENDIUM_MOTEUR_V4_NAVIGATION
} from "./compendium-moteur-v4.js";
import {
  COMPENDIUM_REALITE_V9_LORE_ARTICLES,
  COMPENDIUM_REALITE_V9_LORE_NAVIGATION
} from "./compendium-realite-v9-lore.js";
import {
  COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ID,
  COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT,
  COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES,
  COMPENDIUM_REALITE_V9_CORPORATIONS_NAVIGATION
} from "./compendium-realite-v9-corporations.js";
import {
  COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_NAVIGATION
} from "./compendium-realite-v9-corporations-pnj.js";
import {
  COMPENDIUM_REALITE_V9_PEGRE_ARTICLES,
  COMPENDIUM_REALITE_V9_PEGRE_NAVIGATION
} from "./compendium-realite-v9-pegre.js";
import {
  COMPENDIUM_REALITE_V9_PEGRE_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_PEGRE_PNJ_NAVIGATION
} from "./compendium-realite-v9-pegre-pnj.js";
import {
  COMPENDIUM_REALITE_V9_POLICE_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_POLICE_ARTICLES,
  COMPENDIUM_REALITE_V9_POLICE_NAVIGATION
} from "./compendium-realite-v9-police.js";
import {
  COMPENDIUM_REALITE_V9_POLICE_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_POLICE_PNJ_NAVIGATION,
  COMPENDIUM_REALITE_V9_POLICE_PNJ_ENRICHMENTS
} from "./compendium-realite-v9-police-pnj.js";
import {
  COMPENDIUM_REALITE_V9_GOVERNMENT_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_GOVERNMENT_ARTICLES,
  COMPENDIUM_REALITE_V9_GOVERNMENT_NAVIGATION
} from "./compendium-realite-v9-government.js";
import {
  COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_NAVIGATION,
  COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ENRICHMENTS,
  COMPENDIUM_REALITE_V9_GOVERNMENT_TRUTH_PNJ_ENRICHMENTS
} from "./compendium-realite-v9-government-pnj.js";
import {
  COMPENDIUM_REALITE_V9_AGENCIES_HUB_ID,
  COMPENDIUM_REALITE_V9_AGENCIES_HUB,
  COMPENDIUM_REALITE_V9_AGENCIES_ARTICLES,
  COMPENDIUM_REALITE_V9_AGENCIES_NAVIGATION
} from "./compendium-realite-v9-agencies.js";
import {
  COMPENDIUM_REALITE_V9_AGENCIES_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_AGENCIES_PNJ_NAVIGATION,
  COMPENDIUM_REALITE_V9_AGENCIES_PNJ_ENRICHMENTS
} from "./compendium-realite-v9-agencies-pnj.js";
import {
  COMPENDIUM_REALITE_V9_CRAWLERS_HUB_ID,
  COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SOURCE,
  COMPENDIUM_REALITE_V9_CRAWLERS_HUB_TAGS,
  COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLE_ENRICHMENTS,
  COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLES,
  COMPENDIUM_REALITE_V9_CRAWLERS_NAVIGATION
} from "./compendium-realite-v9-crawlers.js";
import {
  COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_NAVIGATION
} from "./compendium-realite-v9-crawlers-pnj.js";
import {
  COMPENDIUM_REALITE_V9_RELIGION_ARTICLES,
  COMPENDIUM_REALITE_V9_RELIGION_NAVIGATION
} from "./compendium-realite-v9-religions.js";
import {
  COMPENDIUM_REALITE_V9_RELIGION_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_RELIGION_PNJ_NAVIGATION
} from "./compendium-realite-v9-religion-pnj.js";
import {
  COMPENDIUM_REALITE_V9_CHRISTIANITY_ARTICLES,
  COMPENDIUM_REALITE_V9_CHRISTIANITY_NAVIGATION
} from "./compendium-realite-v9-christianity.js";
import { COMPENDIUM_REALITE_V9_CHRISTIANITY_LORE_ARTICLE } from "./compendium-realite-v9-christianity-lore.js";
import {
  COMPENDIUM_REALITE_V9_RULE_ARTICLES,
  COMPENDIUM_REALITE_V9_RULE_NAVIGATION
} from "./compendium-realite-v9-rules.js";
import {
  COMPENDIUM_VERITE_V7_LORE_ARTICLES,
  COMPENDIUM_VERITE_V7_LORE_NAVIGATION
} from "./compendium-verite-v7-lore.js";
import {
  COMPENDIUM_VERITE_V7_RULE_ARTICLES,
  COMPENDIUM_VERITE_V7_RULE_NAVIGATION
} from "./compendium-verite-v7-rules.js";
import {
  COMPENDIUM_VERITE_V7_KHINAE_LORE_ARTICLES,
  COMPENDIUM_VERITE_V7_KHINAE_RULE_ARTICLES,
  COMPENDIUM_VERITE_V7_KHINAE_LORE_NAVIGATION,
  COMPENDIUM_VERITE_V7_KHINAE_RULE_NAVIGATION
} from "./compendium-verite-v7-khinae.js";
import {
  COMPENDIUM_VERITE_V7_MAGE_ARTICLES,
  COMPENDIUM_VERITE_V7_MAGE_NAVIGATION
} from "./compendium-verite-v7-mages.js";
import {
  COMPENDIUM_VERITE_LOGES_MAGES_SOURCE,
  COMPENDIUM_VERITE_LOGES_MAGES_HUB_ID,
  COMPENDIUM_VERITE_LOGES_MAGES_HUB_SECTIONS,
  COMPENDIUM_VERITE_LOGES_MAGES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_LOGES_MAGES_PNJ_NAVIGATION
} from "./compendium-verite-loges-mages.js";
import {
  COMPENDIUM_VERITE_V7_DAEMON_ARTICLES,
  COMPENDIUM_VERITE_V7_DAEMON_NAVIGATION
} from "./compendium-verite-v7-daemons.js";
import {
  COMPENDIUM_VERITE_V7_ANGELUS_ARTICLES,
  COMPENDIUM_VERITE_V7_ANGELUS_NAVIGATION
} from "./compendium-verite-v7-angelus.js";
import {
  COMPENDIUM_VERITE_ANGELUS_ARTICLES,
  COMPENDIUM_VERITE_ANGELUS_ENRICHMENTS,
  COMPENDIUM_VERITE_ANGELUS_NAVIGATION
} from "./compendium-verite-angelus-source.js";
import {
  COMPENDIUM_VERITE_ANGELUS_PNJ_ARTICLES,
  COMPENDIUM_VERITE_ANGELUS_PNJ_NAVIGATION
} from "./compendium-verite-angelus-pnj.js";
import {
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_SOURCE,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_SOURCE,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_ID,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_SECTIONS,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_RELATIONS
} from "./compendium-verite-temples-daemoniaques.js";
import {
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_NAVIGATION
} from "./compendium-verite-temples-daemoniaques-pnj.js";
import {
  COMPENDIUM_VERITE_V7_ASERYN_ARTICLES,
  COMPENDIUM_VERITE_V7_ASERYN_NAVIGATION
} from "./compendium-verite-v7-aseryns.js";
import {
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_SOURCE,
  COMPENDIUM_VERITE_ASERYN_HUB_ID,
  COMPENDIUM_VERITE_ASERYN_HUB_SECTIONS,
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_ARTICLES,
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_NAVIGATION
} from "./compendium-verite-aseryn-terres-temples.js";
import {
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_NAVIGATION
} from "./compendium-verite-aseryn-terres-temples-pnj.js";
import {
  COMPENDIUM_VERITE_GRANDS_EXILES_SOURCE,
  COMPENDIUM_VERITE_GRANDS_EXILES_HUB_ID,
  COMPENDIUM_VERITE_GRANDS_EXILES_HUB_SECTIONS,
  COMPENDIUM_VERITE_GRANDS_EXILES_ARTICLES,
  COMPENDIUM_VERITE_GRANDS_EXILES_NAVIGATION,
  COMPENDIUM_VERITE_GRANDS_EXILES_HUNTER_ENRICHMENT
} from "./compendium-verite-grands-exiles.js";
import {
  COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_NAVIGATION
} from "./compendium-verite-grands-exiles-pnj.js";
import {
  COMPENDIUM_VERITE_V7_PASS_B_ARTICLES,
  COMPENDIUM_VERITE_V7_PASS_B_NAVIGATION
} from "./compendium-verite-v7-pass-b.js";
import {
  COMPENDIUM_VERITE_HUNTERS_SOURCE,
  COMPENDIUM_VERITE_HUNTERS_ARTICLES,
  COMPENDIUM_VERITE_HUNTERS_ENRICHMENTS,
  COMPENDIUM_VERITE_HUNTERS_NAVIGATION
} from "./compendium-verite-hunters-source.js";
import {
  COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES,
  COMPENDIUM_VERITE_HUNTERS_PNJ_NAVIGATION
} from "./compendium-verite-hunters-pnj.js";
import {
  COMPENDIUM_VERITE_FLEAUX_SOURCE,
  COMPENDIUM_VERITE_FLEAUX_ARTICLES,
  COMPENDIUM_VERITE_FLEAUX_ENRICHMENTS,
  COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES,
  COMPENDIUM_VERITE_FLEAUX_NEW_PNJ_ARTICLES,
  COMPENDIUM_VERITE_FLEAUX_NAVIGATION,
  COMPENDIUM_VERITE_FLEAUX_PNJ_NAVIGATION
} from "./compendium-verite-fleaux-focus.js";
import {
  COMPENDIUM_VERITE_V7_PASS_B_RULE_ARTICLES,
  COMPENDIUM_VERITE_V7_PASS_B_RULE_NAVIGATION
} from "./compendium-verite-v7-pass-b-rules.js";
import {
  COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES,
  COMPENDIUM_VERITE_SPECIES_LORE_NAVIGATION,
  COMPENDIUM_VERITE_SPECIES_ENRICHMENTS
} from "./compendium-verite-species-lore.js";
import {
  COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_SPECIES_PNJ_NAVIGATION
} from "./compendium-verite-species-pnj.js";
import {
  COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES,
  COMPENDIUM_VERITE_FANTASTIQUES_NAVIGATION,
  COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS
} from "./compendium-verite-fantastiques-lore.js";
import {
  COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_FANTASTIQUES_PNJ_NAVIGATION
} from "./compendium-verite-fantastiques-pnj.js";
import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION,
  COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS
} from "./compendium-verite-extraterrestres-lore.js";
import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION
} from "./compendium-verite-extraterrestres-pnj.js";
import {
  COMPENDIUM_VERITE_GALACTIC_LORE_ARTICLES,
  COMPENDIUM_VERITE_GALACTIC_LORE_NAVIGATION
} from "./compendium-verite-galactic-factions-lore.js";
import {
  COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES,
  COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_NAVIGATION
} from "./compendium-verite-extrals-groups-pnj.js";
import {
  COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_ARTICLES,
  COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_NAVIGATION
} from "./compendium-verite-humans-galactic-pnj.js";
import { COMPENDIUM_VERITE_VAMPIRE_COURTS_SOURCE, COMPENDIUM_VERITE_VAMPIRE_COURTS_ARTICLES, COMPENDIUM_VERITE_VAMPIRE_COURTS_ENRICHMENTS, COMPENDIUM_VERITE_VAMPIRE_COURTS_NAVIGATION } from "./compendium-verite-vampire-courts-lore.js";
import { COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_ARTICLES, COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_NAVIGATION } from "./compendium-verite-vampire-courts-pnj.js";
import {
  COMPENDIUM_VERITE_PELAGES_ARTICLES,
  COMPENDIUM_VERITE_PELAGES_ENRICHMENTS,
  COMPENDIUM_VERITE_PELAGES_NAVIGATION
} from "./compendium-verite-pelages-lore.js";
import {
  COMPENDIUM_VERITE_PELAGES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_PELAGES_PNJ_NAVIGATION
} from "./compendium-verite-pelages-pnj.js";

type JsonObject = Record<string, any>;
export type Article = JsonObject & {
  id: string;
  title?: string;
  category?: string;
  sourceCategory?: string;
  dataset?: string;
  source?: string;
  status?: string;
  tags?: string[];
  sections?: JsonObject[];
};

type DatasetSpec = {
  id: string;
  prefix: string;
  parts: number;
  count: number;
};

type Manifest = {
  version: number;
  generated?: string;
  categories: string[];
  statusLabels?: Record<string, string>;
  datasets: DatasetSpec[];
  expectedTotal?: number;
};

type NavigationEntry = {
  id: string;
  dataset?: string;
  category?: string;
  group?: string;
  groupOrder?: number;
  subgroup?: string;
  subgroupOrder?: number;
  pageOrder?: number;
  displayTitle?: string;
};

type Corpus = {
  manifest: Manifest;
  articles: Article[];
  publicArticles: Article[];
  byId: Map<string, Article>;
  publicById: Map<string, Article>;
  wikiIndexCompact: Array<Record<string, unknown>>;
  editorBaseById: Map<string, { hash: string; article: Article }>;
  navigation: Map<string, NavigationEntry>;
  categories: Array<{ name: string; count: number }>;
  manufacturers: Array<{ name: string; count: number }>;
  overrideSummary: { applied: number; conflicts: number; missing: number };
  databaseEditSummary: { applied: number; conflicts: number };
};

const LEGACY_CATEGORY = "OLD";
const RELIGION_ARCHIVE_ID_REMAP: Record<string, string> = {
  "pnj-059-bhima-shiravadakar": "pnj-religions-bhima-shiravadakar",
  "pnj-062-ciara-mcfarlane": "pnj-religions-ciara-mcfarlane"
};
const activeReligionPnjId = (id: string) => RELIGION_ARCHIVE_ID_REMAP[id] ?? id;
const PROTECTED_REBUILD_CATEGORIES = new Set(["Équipement & Objets", "Bestiaire"]);

const CATEGORY_ORDER = [
  "Règles",
  "Réalité",
  "Vérité",
  "Personnages",
  "Équipement & Objets",
  "Bestiaire",
  LEGACY_CATEGORY
];

const EQUIPMENT_MANUFACTURERS = [
  "Raven-Sehdia",
  "Raven-Sunways",
  "BridgeElectrics",
  "Ocean Master",
  "ArcaNetwork",
  "SeaWares",
  "Phoenix",
  "Raven",
  "Owl",
  "Byron",
  "Biosun",
  "Sunways",
  "Icecorps",
  "Tala",
  "SBA",
  "SFU",
  "Monarch",
  "Tortoise"
];

const ARTICLE_TITLE_FIXES: Record<string, string> = {
  "regles-verite-angelus-sephirah-nesah-la-victoire": "Nesah — La Victoire"
};

const COMPENDIUM_DATA_DIR =
  process.env.COMPENDIUM_DATA_DIR ??
  (process.env.NODE_ENV === "production"
    ? "/app/compendium-data"
    : resolve(process.cwd(), "../../compendium/data"));

const COMPENDIUM_MEDIA_DIR =
  process.env.COMPENDIUM_MEDIA_DIR ??
  (process.env.NODE_ENV === "production"
    ? "/app/compendium-media"
    : resolve(process.cwd(), "../../compendium"));

const COMPENDIUM_UPLOAD_DIR =
  process.env.COMPENDIUM_UPLOAD_DIR ??
  (process.env.NODE_ENV === "production"
    ? "/app/editor-media"
    : resolve(process.cwd(), "../../.editor-media"));

let corpusPromise: Promise<Corpus> | null = null;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validCollectionName(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 1 && value.trim().length <= 80;
}

function isEditorRole(role: unknown): boolean {
  return role === "editor" || role === "admin";
}

async function requireEditor(request: any, reply: FastifyReply) {
  const user = await requireUser(request, reply);
  if (!user) return null;
  if (!isEditorRole(user.role)) {
    reply.code(403).send({ error: "editor_required" });
    return null;
  }
  return user;
}

function canReadMj(role: unknown): boolean {
  return role === "gm" || role === "editor" || role === "admin";
}

function isMjOnlyArticle(article: Article): boolean { return article?.audience === "mj"; }
function articleForAudience(article: Article, includeMj: boolean): Article {
  const result = deepClone(article);
  if (!includeMj) {
    if (Array.isArray(result.sections)) result.sections = result.sections.filter((section) => section?.audience !== "mj");
    if (result.pnj && typeof result.pnj === "object") {
      const pnj = result.pnj as JsonObject;
      result.pnj = {...(pnj.portrait?{portrait:pnj.portrait}:{}),...(pnj.portrait_alt?{portrait_alt:pnj.portrait_alt}:{}),...(pnj.portrait_caption?{portrait_caption:pnj.portrait_caption}:{})};
    }
  }
  delete result.__searchText;
  return result;
}

function canonicalCategory(article: Article): string {
  return String(article.legacyCategory ?? article.category ?? "");
}

export async function findCompendiumMatches(
  label: string,
  category = ""
): Promise<Array<{ id: string; title: string; category: string }>> {
  const target = norm(label);
  if (!target) return [];
  const corpus = await getCorpus();
  let matches = corpus.articles.filter((article) => norm(article.title) === target);
  if (category) {
    const categorized = matches.filter((article) => canonicalCategory(article) === category);
    if (categorized.length) matches = categorized;
  }
  return matches.map((article) => ({
    id: article.id,
    title: String(article.title ?? article.id),
    category: String(article.category ?? "")
  }));
}

export async function resolveCompendiumId(
  label: string,
  category = ""
): Promise<string | null> {
  const matches = await findCompendiumMatches(label, category);
  return matches.length === 1 ? matches[0].id : null;
}

export async function findActiveCompendiumArticleById(
  id: string
): Promise<{ id: string; title: string; category: string } | null> {
  const target = String(id ?? "").trim();
  if (!target) return null;
  const corpus = await getCorpus();
  const article = corpus.byId.get(target);
  if (!article || article.category === LEGACY_CATEGORY) return null;
  return {
    id: article.id,
    title: String(article.title ?? article.id),
    category: String(article.category ?? "")
  };
}


type HubLabelForm = { value: string; depth: number };

function hubLabelForms(label: string): HubLabelForm[] {
  const raw = String(label ?? "").trim();
  if (!raw) return [];

  const forms = new Map<string, number>();
  const push = (value: string, depth: number) => {
    const cleaned = value
      .replace(/\s+[—-]\s+\d+\s*PTV\b/gi, "")
      .replace(/^Facette\s*:\s*/i, "")
      .replace(/^Nature\s*:\s*/i, "")
      .replace(/\s+[—-]\s+Talents? de Cour\s*$/i, "")
      .replace(/\s+[—-]\s+Talents? de Lignée\s*$/i, "")
      .trim();
    const normalized = norm(cleaned);
    if (normalized.length < 4) return;
    forms.set(normalized, Math.max(forms.get(normalized) ?? 0, depth));
  };

  const segments = raw.split(/\s*›\s*/).filter(Boolean);
  push(raw, segments.length + 1);
  segments.forEach((segment, index) => push(segment, index + 1));

  if (/\bcommun(?:e|s)?\b/i.test(raw)) push("Talents communs", segments.length + 2);

  return [...forms.entries()]
    .map(([value, depth]) => ({ value, depth }))
    .sort((a, b) => b.depth - a.depth || b.value.length - a.value.length);
}

function articleMatchesNatureHub(articleId: string, natureId: string): boolean {
  if (!natureId) return true;
  const id = norm(articleId).replace(/\s+/g, "-");
  const nature = norm(natureId).replace(/\s+/g, "-");
  if (!nature) return true;

  const prefixes = new Set([
    `regles-verite-${nature}-`,
    `regles-verite-v7-${nature}-`,
    `regles-verite-v6-${nature}-`,
    `regles-verite-nature-${nature}`
  ]);
  if (nature === "humain") prefixes.add("regles-verite-chasseur-");

  return [...prefixes].some((prefix) => id.includes(prefix));
}

export async function findCompendiumHubMatches(
  label: string,
  natureId = "",
  includeLegacy = false
): Promise<Array<{ id: string; title: string; category: string }>> {
  const exact = (await findCompendiumMatches(label, "Règles"))
    .filter((article) => includeLegacy || article.category !== LEGACY_CATEGORY);
  if (exact.length) return exact;

  const forms = hubLabelForms(label);
  if (!forms.length) return [];

  const corpus = await getCorpus();
  const scored = corpus.articles
    .filter((article) =>
      includeLegacy
        ? canonicalCategory(article) === "Règles"
        : article.category === "Règles"
    )
    .filter((article) => articleMatchesNatureHub(article.id, natureId))
    .map((article) => {
      const navTitle = corpus.navigation.get(article.id)?.displayTitle ?? "";
      const sectionTitles = (article.sections ?? [])
        .map((section) => norm(section?.title ?? ""))
        .filter(Boolean);
      const labels = [
        norm(article.title ?? ""),
        norm(navTitle),
        ...sectionTitles
      ].filter(Boolean);

      let score = 0;
      for (const form of forms) {
        const depthBonus = form.depth * 1000;
        for (const candidate of labels) {
          if (candidate === form.value) {
            score = Math.max(score, 100000 + depthBonus + form.value.length);
          } else if (candidate.includes(form.value)) {
            const extra = Math.max(0, candidate.length - form.value.length);
            score = Math.max(score, 50000 + depthBonus + form.value.length - extra);
          } else if (form.value.includes(candidate) && candidate.length >= 7) {
            score = Math.max(score, 40000 + depthBonus + candidate.length);
          }
        }
      }
      return { article, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || compareArticles(a.article, b.article));

  if (!scored.length) return [];
  const best = scored[0].score;
  return scored
    .filter((row) => row.score === best)
    .map(({ article }) => ({
      id: article.id,
      title: String(article.title ?? article.id),
      category: String(article.category ?? "")
    }));
}

export async function resolveCompendiumHubId(
  label: string,
  natureId = ""
): Promise<string | null> {
  const matches = await findCompendiumHubMatches(label, natureId, true);
  if (matches.length === 1) return matches[0].id;

  // Builder provenance remains traceable while a legacy family is awaiting
  // its V2 hub. Interactive hub audits call findCompendiumHubMatches directly
  // and therefore still require an active page.
  if (!matches.length) {
    const historical = await findCompendiumMatches(label, "Règles");
    if (historical.length === 1) return historical[0].id;
  }
  return null;
}

function mediaSource(media: unknown): string {
  if (typeof media === "string") return media.trim();
  if (media && typeof media === "object") return String((media as JsonObject).src ?? "").trim();
  return "";
}

function isPlaceholderMedia(media: unknown): boolean {
  return /(?:equipment|augmentation|truth-(?:artifact|catalog))-placeholder\.svg(?:$|[?#])/i.test(
    mediaSource(media)
  );
}

function editableArticle(base: Article, input: unknown): Article {
  const source = input && typeof input === "object" ? (input as JsonObject) : {};
  const result = deepClone(base);
  const simpleFields = ["title", "category", "source", "status", "tags", "sections", "pnj", "image", "illustration"];

  for (const field of simpleFields) {
    if (!Object.prototype.hasOwnProperty.call(source, field)) continue;
    const value = deepClone(source[field]);
    if (value === null || value === undefined || value === "") delete result[field];
    else result[field] = value;
  }

  result.id = base.id;
  result.dataset = base.dataset;
  result.category = String(result.category ?? base.category ?? "Réalité");
  result.sourceCategory = result.category;
  delete result.navigation;
  delete result.manufacturer;
  delete result.__searchText;
  delete result.__wikiPublishedEdit;
  return result;
}

function slugifyArticleTitle(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function editorBaseFor(
  id: string,
  corpus: Corpus
): Promise<{ hash: string; article: Article } | null> {
  const existing = corpus.editorBaseById.get(id);
  if (existing) return existing;

  const custom = await pool.query<{ baseDocument: Article }>(
    `SELECT base_document AS "baseDocument"
     FROM compendium_custom_articles
     WHERE article_id = $1`,
    [id]
  );
  const article = custom.rows[0]?.baseDocument;
  if (!article) return null;
  return { hash: articleHash(article), article: deepClone(article) };
}

async function editorCurrentArticle(id: string, corpus: Corpus): Promise<Article | null> {
  const current = corpus.byId.get(id);
  if (current) return current;
  const base = await editorBaseFor(id, corpus);
  return base?.article ?? null;
}

function validEditableArticle(value: unknown): value is Article {
  if (!value || typeof value !== "object") return false;
  const article = value as JsonObject;
  const title = String(article.title ?? "").trim();
  if (!title || title.length > 240) return false;
  if (article.tags !== undefined) {
    if (!Array.isArray(article.tags) || article.tags.length > 100) return false;
    if (article.tags.some((tag: unknown) => typeof tag !== "string" || tag.length > 120)) return false;
  }
  if (article.sections !== undefined) {
    if (!Array.isArray(article.sections) || article.sections.length > 160) return false;
    for (const section of article.sections) {
      if (!section || typeof section !== "object") return false;
      if (!Array.isArray(section.blocks) || section.blocks.length > 300) return false;
      for (const block of section.blocks) {
        if (!block || typeof block !== "object") return false;
        if (!["p", "table"].includes(String(block.type ?? ""))) return false;
        if (block.type === "p" && String(block.text ?? "").length > 120000) return false;
        if (block.type === "table" && !Array.isArray(block.rows)) return false;
      }
    }
  }
  return true;
}

function safeMediaRelativePath(value: string): string | null {
  const clean = value.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!clean || clean.includes("\0") || clean.split("/").includes("..")) return null;
  if (!clean.startsWith("images/") && !clean.startsWith("assets/")) return null;
  return clean;
}

function mediaContentType(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml; charset=utf-8";
  return "application/octet-stream";
}

function uploadedImageExtension(data: Buffer): "jpg" | "png" | "webp" | "gif" | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "jpg";
  if (
    data.length >= 8 &&
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47 &&
    data[4] === 0x0d &&
    data[5] === 0x0a &&
    data[6] === 0x1a &&
    data[7] === 0x0a
  ) return "png";
  if (
    data.length >= 12 &&
    data.subarray(0, 4).toString("ascii") === "RIFF" &&
    data.subarray(8, 12).toString("ascii") === "WEBP"
  ) return "webp";
  if (data.length >= 6) {
    const signature = data.subarray(0, 6).toString("ascii");
    if (signature === "GIF87a" || signature === "GIF89a") return "gif";
  }
  return null;
}

function safeUploadFilename(value: string): string | null {
  const clean = value.trim();
  if (!/^[a-zA-Z0-9_.-]+\.(?:jpg|png|webp|gif)$/i.test(clean)) return null;
  return clean;
}

function bad(reply: FastifyReply, error: string) {
  return reply.code(400).send({ error });
}

function deepClone<T>(value: T): T {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizedPnjIdentity(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9']+/g, " ")
    .trim();
}

function usablePnjIdentity(value: unknown): string | null {
  const normalized = normalizedPnjIdentity(value);
  if (!normalized || normalized === "?" || normalized === "_" || normalized.length < 4) return null;
  return normalized;
}

function articlePnjIdentityKeys(article: Article): Set<string> {
  const keys = new Set<string>();
  const add = (value: unknown) => {
    const key = usablePnjIdentity(value);
    if (key) keys.add(key);
  };

  add(article.title);
  const pnj = article.pnj ?? {};
  for (const field of ["real_name", "nom_reel", "nom_realite", "nom_verite", "name", "alias"]) add(pnj[field]);
  for (const value of Array.isArray(pnj.identity_keys) ? pnj.identity_keys : []) add(value);

  for (const section of article.sections ?? []) {
    for (const block of section?.blocks ?? []) {
      if (block?.type !== "table" || !Array.isArray(block.rows)) continue;
      for (const row of block.rows) {
        if (!Array.isArray(row) || row.length < 2) continue;
        const label = normalizedPnjIdentity(row[0]);
        if (
          label.includes("nom de la realite") ||
          label.includes("nom de la verite") ||
          label === "nom" ||
          label.includes("identite")
        ) {
          add(row[1]);
        }
      }
    }
  }

  return keys;
}

function mergeUniqueTextBlocks(target: JsonObject, blocks: JsonObject[]) {
  target.blocks = Array.isArray(target.blocks) ? target.blocks : [];
  const existing = new Set(
    target.blocks
      .map((block: JsonObject) => (block?.type === "p" ? String(block.text ?? "").trim() : ""))
      .filter(Boolean)
  );
  for (const block of blocks) {
    const text = block?.type === "p" ? String(block.text ?? "").trim() : "";
    if (text && existing.has(text)) continue;
    target.blocks.push(deepClone(block));
    if (text) existing.add(text);
  }
}

function mergeCrawlerPnj(target: Article, source: Article): Article {
  const merged = deepClone(target);
  merged.tags = [...new Set([...(merged.tags ?? []), ...(source.tags ?? [])])];

  const sources = [merged.source, source.source]
    .flatMap((value) => String(value ?? "").split(" ; "))
    .map((value) => value.trim())
    .filter(Boolean);
  merged.source = [...new Set(sources)].join(" ; ");
  if (new Set(sources).size > 1) merged.tags = [...new Set([...(merged.tags ?? []), "Multi-source"])];

  merged.pnj = { ...(merged.pnj ?? {}), ...(source.pnj ?? {}) };
  merged.pnj.identity_keys = [
    ...new Set([
      ...articlePnjIdentityKeys(merged),
      ...articlePnjIdentityKeys(source)
    ])
  ];

  const sections = [...(merged.sections ?? [])];
  const existingIds = new Set(sections.map((section) => String(section?.id ?? "")));

  const insertPublicSection = (section: JsonObject) => {
    const copy = deepClone(section);
    const mjIndex = sections.findIndex((item) => item?.audience === "mj");
    if (mjIndex >= 0) sections.splice(mjIndex, 0, copy);
    else sections.push(copy);
    existingIds.add(String(copy?.id ?? ""));
  };

  for (const section of source.sections ?? []) {
    const id = String(section?.id ?? "");
    if (!id || id === "profil-statistique" || section?.audience === "mj" || existingIds.has(id)) continue;
    insertPublicSection(section);
  }

  for (const section of source.sections ?? []) {
    const id = String(section?.id ?? "");
    if (!id || id === "profil-statistique" || section?.audience !== "mj" || existingIds.has(id)) continue;
    const blocks = Array.isArray(section?.blocks) ? section.blocks : [];
    if (!blocks.length) continue;
    sections.push(deepClone(section));
    existingIds.add(id);
  }

  if (!existingIds.has("profil-statistique")) {
    sections.push({
      id: "profil-statistique",
      title: "Profil statistique",
      level: 2,
      audience: "mj",
      blocks: []
    });
  }

  merged.sections = sections;
  merged.status = "canon_enrichi";
  merged.rebuildV2 = true;
  return merged;
}

function mergeCorporationPnj(target: Article, source: Article): Article {
  const merged = mergeCrawlerPnj(target, source);
  merged.pnj = { ...(source.pnj ?? {}), ...(target.pnj ?? {}) };
  merged.pnj.identity_keys = [
    ...new Set([
      ...articlePnjIdentityKeys(target),
      ...articlePnjIdentityKeys(source),
      ...articlePnjIdentityKeys(merged)
    ])
  ];
  return merged;
}

function mergeFleauxPnj(target: Article, source: Article): Article {
  const merged = mergeCrawlerPnj(target, source);
  const targetPnj = target.pnj ?? {};
  const sourcePnj = source.pnj ?? {};
  merged.pnj = { ...sourcePnj, ...targetPnj };
  merged.pnj.tags = [
    ...new Set([...(sourcePnj.tags ?? []), ...(targetPnj.tags ?? [])])
  ];
  merged.pnj.relations = [
    ...new Set([...(sourcePnj.relations ?? []), ...(targetPnj.relations ?? [])])
  ];
  merged.pnj.identity_keys = [
    ...new Set([
      ...articlePnjIdentityKeys(target),
      ...articlePnjIdentityKeys(source),
      ...articlePnjIdentityKeys(merged)
    ])
  ];
  merged.status = "canon_enrichi";
  merged.rebuildV2 = true;
  return merged;
}

function mergeVampireCourtPnj(target: Article, source: Article): Article {
  const merged = mergeFleauxPnj(target, source);
  const targetRealityIdentity = usablePnjIdentity(target.pnj?.real_name) ?? usablePnjIdentity(target.pnj?.nom_reel) ?? usablePnjIdentity(target.pnj?.nom_realite);
  const sourceRealityIdentity = String(source.pnj?.real_name ?? "").trim();
  if (!targetRealityIdentity && sourceRealityIdentity) merged.title = sourceRealityIdentity;
  if (source.audience === "mj" && !targetRealityIdentity && !sourceRealityIdentity) merged.audience = "mj";
  return merged;
}
function findMatchingAserynPnj(byId: Map<string, Article>, source: Article): Article | null {
  const standard = findMatchingActivePnj(byId, source);
  if (standard) return standard;

  const sourceKeys = articlePnjIdentityKeys(source);
  if (!sourceKeys.size) return null;

  const candidates = [...byId.values()].filter((candidate) => {
    if (candidate.id === source.id || candidate.rebuildV2 !== true) return false;
    const category = String(candidate.category ?? candidate.sourceCategory ?? "");
    return category === "Personnages" || String(candidate.dataset ?? "").includes("pnj");
  });

  const scored: Array<{ article: Article; score: number }> = [];
  for (const candidate of candidates) {
    const candidateKeys = articlePnjIdentityKeys(candidate);
    const overlap = [...sourceKeys].filter((key) => candidateKeys.has(key));
    if (!overlap.length) continue;

    let score = overlap.length * 10;
    const directCandidate = new Set<string>();
    const add = (value: unknown) => {
      const key = usablePnjIdentity(value);
      if (key) directCandidate.add(key);
    };
    add(candidate.title);
    for (const field of ["real_name", "nom_reel", "nom_realite", "nom_verite", "name", "alias"]) {
      add(candidate.pnj?.[field]);
    }
    if (overlap.some((key) => directCandidate.has(key))) score += 100;
    scored.push({ article: candidate, score });
  }

  if (!scored.length) return null;
  const bestScore = Math.max(...scored.map((row) => row.score));
  const best = scored.filter((row) => row.score === bestScore);
  if (best.length > 1) {
    throw new Error(
      `Identité PNJ Aseryn ambiguë pour ${source.title ?? source.id}: ${best.map((row) => row.article.id).join(", ")}`
    );
  }
  return best[0].article;
}

function mergeAserynPnj(target: Article, source: Article): Article {
  const merged = mergeFleauxPnj(target, source);
  const targetPnj = target.pnj ?? {};
  const sourcePnj = source.pnj ?? {};

  const sourceDocuments = [
    ...((Array.isArray(targetPnj.source_documents) ? targetPnj.source_documents : []) as string[]),
    ...((Array.isArray(sourcePnj.source_documents) ? sourcePnj.source_documents : []) as string[]),
    ...String(target.source ?? "").split(" ; "),
    ...String(source.source ?? "").split(" ; ")
  ].map((value) => String(value ?? "").trim()).filter(Boolean);

  const sourceAffiliations = [
    ...((Array.isArray(targetPnj.source_affiliations) ? targetPnj.source_affiliations : []) as string[]),
    ...((Array.isArray(sourcePnj.source_affiliations) ? sourcePnj.source_affiliations : []) as string[]),
    targetPnj.affiliations,
    sourcePnj.affiliations
  ].map((value) => String(value ?? "").trim()).filter(
    (value) => value && !["_", "?", "-", "???", "????"].includes(value)
  );

  merged.pnj = {
    ...(merged.pnj ?? {}),
    source_documents: [...new Set(sourceDocuments)],
    source_affiliations: [...new Set(sourceAffiliations)]
  };

  const secretLabels = [
    "nom de la verite",
    "nature reelle",
    "ethnie reelle",
    "statut verite",
    "identite de verite"
  ];

  merged.sections = (merged.sections ?? []).map((section) => {
    if (section?.audience === "mj") return section;
    const copy = deepClone(section) as JsonObject;
    copy.blocks = (copy.blocks ?? []).map((block: JsonObject) => {
      if (block?.type !== "table" || !Array.isArray(block.rows)) return block;
      const rows = block.rows.filter((row: unknown[]) => {
        const label = normalizedPnjIdentity(row?.[0]);
        return !secretLabels.some((secret) => label.includes(secret));
      });
      return { ...block, rows };
    });
    return copy;
  });

  return merged;
}

function mergePelagePnj(target: Article, source: Article): Article {
  const merged = mergeVampireCourtPnj(target, source);

  // Older active species sheets sometimes exposed Truth rows in their public
  // profile section. Keep all source information but remove those rows from
  // the public profile when this newer Pelages source is merged.
  merged.sections = (merged.sections ?? []).map((section) => {
    const copy = deepClone(section) as JsonObject;

    if (String(copy.id ?? "") === "profil") {
      copy.blocks = (copy.blocks ?? []).map((block: JsonObject) => {
        if (block?.type !== "table" || !Array.isArray(block.rows)) return block;
        const rows = block.rows.filter((row: unknown[]) => {
          const label = normalizedPnjIdentity(row?.[0]);
          return !(
            label.includes("nom de la verite") ||
            label.includes("nature reelle") ||
            label.includes("ethnie reelle") ||
            label.includes("grand meneur") ||
            label.includes("pouvoir du sang") ||
            label.includes("statut verite")
          );
        });
        return { ...block, rows };
      });
    }

    // Some previous "Informations Réalité" paragraphs mixed public biography
    // and supernatural identity. The new Pelages source provides a clean
    // public section, so retain the older mixed text as GM-only instead of
    // leaking it.
    if (String(copy.id ?? "") === "info-realite") {
      const sourceText = JSON.stringify(copy);
      if (/loup.?garou|garou|pelage|meute|meneur|sang vif|sang [a-z]|nature reelle|revele/i.test(sourceText)) {
        copy.audience = "mj";
        copy.title = "Informations source antérieure · MJ";
      }
    }

    return copy;
  });

  return merged;
}

function mergeAngelusPnj(target: Article, source: Article): Article {
  const merged = deepClone(target);
  merged.tags = [...new Set([...(merged.tags ?? []), ...(source.tags ?? [])])];

  const sources = [merged.source, source.source]
    .flatMap((value) => String(value ?? "").split(" ; "))
    .map((value) => value.trim())
    .filter(Boolean);
  merged.source = [...new Set(sources)].join(" ; ");
  if (new Set(sources).size > 1) {
    merged.tags = [...new Set([...(merged.tags ?? []), "Multi-source"])];
  }

  const targetPnj = merged.pnj ?? {};
  const sourcePnj = source.pnj ?? {};
  merged.pnj = { ...sourcePnj, ...targetPnj };
  merged.pnj.identity_keys = [
    ...new Set([
      ...articlePnjIdentityKeys(target),
      ...articlePnjIdentityKeys(source),
      ...articlePnjIdentityKeys(merged)
    ])
  ];
  merged.pnj.source_documents = [
    ...new Set([
      ...((Array.isArray(targetPnj.source_documents) ? targetPnj.source_documents : []) as string[]),
      ...((Array.isArray(sourcePnj.source_documents) ? sourcePnj.source_documents : []) as string[]),
      ...sources
    ])
  ];

  const sections = [...(merged.sections ?? [])];
  const sourceProfile = (source.sections ?? []).find((section) => section.id === "profil");
  const sourceReality = (source.sections ?? []).find((section) => section.id === "informations-realite");
  const sourceTruth = (source.sections ?? []).find((section) => section.id === "informations-mj");

  let mj = sections.find(
    (section) => section?.audience === "mj" && /mj|dossier|verite/i.test(String(section.id ?? ""))
  );
  if (!mj) {
    mj = {
      id: "informations-mj",
      title: "Informations MJ",
      level: 2,
      audience: "mj",
      blocks: []
    };
    sections.push(mj);
  }
  if (sourceTruth) mergeUniqueTextBlocks(mj, sourceTruth.blocks ?? []);

  const insertBeforeMj = (section: JsonObject) => {
    const index = sections.findIndex((item) => item?.audience === "mj");
    if (index >= 0) sections.splice(index, 0, section);
    else sections.push(section);
  };

  const existingIds = new Set(sections.map((section) => String(section?.id ?? "")));
  if (sourceReality?.blocks?.length && !existingIds.has("source-angelus-realite")) {
    insertBeforeMj({
      id: "source-angelus-realite",
      title: "Complément Réalité · dossier Angelus",
      level: 2,
      blocks: deepClone(sourceReality.blocks)
    });
    existingIds.add("source-angelus-realite");
  }

  if (sourceProfile && !existingIds.has("source-angelus-identite")) {
    const rows = (sourceProfile.blocks ?? [])
      .flatMap((block: JsonObject) => (block?.type === "table" && Array.isArray(block.rows) ? block.rows : []))
      .filter((row: unknown[]) => {
        const label = normalizedPnjIdentity(row?.[0]);
        return label.includes("age") || label.includes("affiliations") || label.includes("nationalite");
      });
    if (rows.length) {
      insertBeforeMj({
        id: "source-angelus-identite",
        title: "Complément de fiche · dossier Angelus",
        level: 2,
        blocks: [{ type: "table", rows }]
      });
    }
  }

  const secretLabels = [
    "nom de la verite",
    "nature reelle",
    "ethnie reelle",
    "archange tutelaire",
    "divinite",
    "pouvoir principal",
    "statut verite"
  ];
  merged.sections = sections.map((section) => {
    if (section?.audience === "mj") return section;
    const copy = deepClone(section) as JsonObject;
    copy.blocks = (copy.blocks ?? []).map((block: JsonObject) => {
      if (block?.type !== "table" || !Array.isArray(block.rows)) return block;
      return {
        ...block,
        rows: block.rows.filter((row: unknown[]) => {
          const label = normalizedPnjIdentity(row?.[0]);
          return !secretLabels.some((secret) => label.includes(secret));
        })
      };
    });
    return copy;
  });

  merged.status = "canon_enrichi";
  merged.rebuildV2 = true;
  return merged;
}

function mergeHunterPnj(target: Article, source: Article): Article {
  const merged = mergeFleauxPnj(target, source);
  const targetPnj = target.pnj ?? {};
  const sourcePnj = source.pnj ?? {};
  merged.pnj = {
    ...(merged.pnj ?? {}),
    hunter_source_extract: sourcePnj.source_extract ?? "",
    hunter_source_verite: deepClone(sourcePnj.source_verite ?? []),
    source_documents: [
      ...new Set([
        ...((Array.isArray(targetPnj.source_documents) ? targetPnj.source_documents : []) as string[]),
        ...((Array.isArray(sourcePnj.source_documents) ? sourcePnj.source_documents : []) as string[]),
        COMPENDIUM_VERITE_HUNTERS_SOURCE
      ])
    ]
  };
  merged.tags = [...new Set([...(merged.tags ?? []), "Chasseurs", "Lore Chasseurs 2026-09"])];
  return merged;
}

function mergeExtraterrestrialPnj(target: Article, source: Article): Article {
  const merged = deepClone(target);
  merged.tags = [...new Set([...(merged.tags ?? []), ...(source.tags ?? [])])];

  const sources = [merged.source, source.source]
    .flatMap((value) => String(value ?? "").split(" ; "))
    .map((value) => value.trim())
    .filter(Boolean);
  merged.source = [...new Set(sources)].join(" ; ");

  merged.pnj = { ...(source.pnj ?? {}), ...(merged.pnj ?? {}) };
  const identityKeys = new Set<string>([
    ...articlePnjIdentityKeys(merged),
    ...articlePnjIdentityKeys(source)
  ]);
  merged.pnj.identity_keys = [...identityKeys];

  const sourceProfile = (source.sections ?? []).find((section) => section.id === "profil");
  const sourceTruth = (source.sections ?? []).find((section) => section.id === "informations-mj");
  const sourceReality = (source.sections ?? []).filter((section) =>
    section.id === "informations-realite" || section.id === "informations-seuil"
  );

  let mj = (merged.sections ?? []).find((section) => section?.audience === "mj" && /mj|dossier/i.test(String(section.id ?? "")));
  if (!mj) {
    mj = {
      id: "informations-mj",
      title: "Informations MJ",
      level: 2,
      audience: "mj",
      blocks: []
    };
    merged.sections = [...(merged.sections ?? []), mj];
  }

  const identityLines = [
    source.pnj?.nom_verite ? `Nom de la Vérité : ${source.pnj.nom_verite}` : "",
    source.pnj?.race ? `Nature réelle : ${source.pnj.race}` : ""
  ].filter(Boolean);
  if (identityLines.length) {
    mergeUniqueTextBlocks(mj, [{ type: "p", text: identityLines.join(" · ") }]);
  }
  if (sourceTruth) mergeUniqueTextBlocks(mj, sourceTruth.blocks ?? []);

  const insertPublicSectionBeforeMj = (section: JsonObject) => {
    const sections = [...(merged.sections ?? [])];
    const mjIndex = sections.findIndex((item) => item?.audience === "mj");
    if (mjIndex >= 0) sections.splice(mjIndex, 0, section);
    else sections.push(section);
    merged.sections = sections;
  };

  const existingSectionIds = new Set((merged.sections ?? []).map((section) => String(section?.id ?? "")));
  if (sourceReality.length && !existingSectionIds.has("source-extraterrestres-realite")) {
    insertPublicSectionBeforeMj({
      id: "source-extraterrestres-realite",
      title: "Complément Réalité · dossier extraterrestre",
      level: 2,
      blocks: sourceReality.flatMap((section) => deepClone(section.blocks ?? []))
    });
    existingSectionIds.add("source-extraterrestres-realite");
  }

  if (sourceProfile && !existingSectionIds.has("source-extraterrestres-identite")) {
    const rows = (sourceProfile.blocks ?? [])
      .flatMap((block: JsonObject) => (block?.type === "table" && Array.isArray(block.rows) ? block.rows : []))
      .filter((row: unknown[]) => {
        const label = normalizedPnjIdentity(row?.[0]);
        return label === "age" || label.includes("affiliations") || label.includes("nationalite") || label.includes("personnages lies") || label.includes("repere");
      });
    if (rows.length) {
      insertPublicSectionBeforeMj({
        id: "source-extraterrestres-identite",
        title: "Complément de fiche · dossier extraterrestre",
        level: 2,
        blocks: [{ type: "table", rows }]
      });
    }
  }

  return merged;
}

function findMatchingActivePnj(byId: Map<string, Article>, source: Article): Article | null {
  const realKey = usablePnjIdentity(source.pnj?.real_name);
  const truthKey = usablePnjIdentity(source.pnj?.nom_verite);
  if (!realKey && !truthKey) return null;

  const candidates = [...byId.values()].filter((candidate) => {
    if (candidate.id === source.id) return false;
    // OLD/legacy corpus is loaded before its final category remap. Only rebuilt V2
    // profiles may absorb a new cross-document source; archives remain audit-only.
    if (candidate.rebuildV2 !== true) return false;
    const category = String(candidate.category ?? candidate.sourceCategory ?? "");
    return category === "Personnages" || String(candidate.dataset ?? "").includes("pnj");
  });

  const directIdentityKeys = (candidate: Article) => {
    const keys = new Set<string>();
    const add = (value: unknown) => {
      const key = usablePnjIdentity(value);
      if (key) keys.add(key);
    };
    add(candidate.title);
    const pnj = candidate.pnj ?? {};
    for (const field of ["real_name", "nom_reel", "nom_realite", "nom_verite", "name", "alias"]) add(pnj[field]);
    return keys;
  };

  // Prefer a single explicit title/PNJ-field match over identities recovered from tables.
  // Some legacy sheets contain copied "Nom de la Réalité" rows from another character.
  for (const key of [truthKey, realKey].filter(Boolean) as string[]) {
    const direct = candidates.filter((candidate) => directIdentityKeys(candidate).has(key));
    if (direct.length === 1) return direct[0];
    if (direct.length > 1) {
      const titleMatches = direct.filter(
        (candidate) => usablePnjIdentity(candidate.title) === key
      );
      if (titleMatches.length === 1) return titleMatches[0];
    }
  }

  const matches: Array<{ article: Article; score: number }> = [];
  for (const candidate of candidates) {
    const keys = articlePnjIdentityKeys(candidate);
    let score = 0;
    if (truthKey && keys.has(truthKey)) score = Math.max(score, 5);
    if (realKey && keys.has(realKey)) score = Math.max(score, 4);
    if (score > 0) matches.push({ article: candidate, score });
  }

  if (!matches.length) return null;
  const bestScore = Math.max(...matches.map((match) => match.score));
  const best = matches.filter((match) => match.score === bestScore);
  if (best.length > 1) {
    throw new Error(
      `Identité PNJ ambiguë pour ${source.title ?? source.id}: ${best.map((match) => match.article.id).join(", ")}`
    );
  }
  return best[0].article;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    const output: JsonObject = {};
    for (const key of Object.keys(value as JsonObject).sort()) {
      if (key === "dataset") continue;
      output[key] = canonicalize((value as JsonObject)[key]);
    }
    return output;
  }
  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

function articleHash(article: Article): string {
  return createHash("sha256").update(stableStringify(article)).digest("hex");
}

function decodePointerToken(token: string): string {
  return token.replace(/~1/g, "/").replace(/~0/g, "~");
}

function pointerParts(path: string): string[] {
  if (!path.startsWith("/")) throw new Error(`Chemin JSON Pointer invalide: ${path}`);
  if (path === "/") return [""];
  return path.slice(1).split("/").map(decodePointerToken);
}

function resolveParent(root: JsonObject, path: string, create = false) {
  const parts = pointerParts(path);
  const key = parts.pop() ?? "";
  let node: any = root;

  for (const part of parts) {
    if (Array.isArray(node)) {
      const index = Number(part);
      if (!Number.isInteger(index) || index < 0 || index >= node.length) {
        throw new Error(`Index introuvable: ${part}`);
      }
      node = node[index];
      continue;
    }

    if (!node || typeof node !== "object") {
      throw new Error(`Parent non objet pour ${path}`);
    }

    if (!Object.prototype.hasOwnProperty.call(node, part)) {
      if (!create) throw new Error(`Chemin introuvable: ${path}`);
      node[part] = {};
    }

    node = node[part];
  }

  return { parent: node, key };
}

function arrayIndex(key: string, length: number, allowEnd = false): number {
  if (key === "-" && allowEnd) return length;
  const index = Number(key);
  const max = allowEnd ? length : length - 1;
  if (!Number.isInteger(index) || index < 0 || index > max) {
    throw new Error(`Index de tableau invalide: ${key}`);
  }
  return index;
}

function applyOperation(target: JsonObject, operation: JsonObject): void {
  const op = String(operation.op ?? "");
  const path = String(operation.path ?? "");
  if (!["add", "replace", "remove"].includes(op)) {
    throw new Error(`Opération inconnue: ${op}`);
  }

  const { parent, key } = resolveParent(target, path, op === "add");

  if (Array.isArray(parent)) {
    if (op === "add") {
      parent.splice(arrayIndex(key, parent.length, true), 0, deepClone(operation.value));
    } else {
      const index = arrayIndex(key, parent.length);
      if (op === "replace") parent[index] = deepClone(operation.value);
      else parent.splice(index, 1);
    }
    return;
  }

  if (!parent || typeof parent !== "object") {
    throw new Error(`Parent non objet pour ${path}`);
  }

  if (op === "remove") {
    if (!Object.prototype.hasOwnProperty.call(parent, key)) {
      throw new Error(`Chemin introuvable: ${path}`);
    }
    delete parent[key];
  } else if (op === "replace") {
    if (!Object.prototype.hasOwnProperty.call(parent, key)) {
      throw new Error(`Chemin introuvable: ${path}`);
    }
    parent[key] = deepClone(operation.value);
  } else {
    parent[key] = deepClone(operation.value);
  }
}

function norm(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function organisationRealm(article: Article): string {
  const tags = (article.tags ?? []).map(norm);
  if (tags.includes("verite")) return "Vérité";
  if (tags.includes("realite")) return "Réalité";

  const text = norm(`${article.title ?? ""} ${(article.tags ?? []).join(" ")} ${article.source ?? ""}`);
  return /vampir|garou|loup garou|mage|daemon|angelus|aseryn|atlante|exile|extral|chasseur|fleau|occulte|khinae/.test(
    text
  )
    ? "Vérité"
    : "Réalité";
}

function displayCategory(article: Article): string {
  const source = article.sourceCategory ?? article.category ?? "";
  if (["Équipement", "Augmentations", "Catalogue Vérité"].includes(source)) {
    return "Équipement & Objets";
  }
  if (source === "Organisations") return organisationRealm(article);
  return source;
}

function manufacturerFromTitle(title: unknown): string {
  const raw = String(title ?? "").trim();
  const key = norm(raw);

  for (const manufacturer of EQUIPMENT_MANUFACTURERS) {
    const maker = norm(manufacturer);
    if (key === maker || key.startsWith(`${maker} `)) return manufacturer;
  }

  const suffix = raw.split(/\s+[—–-]\s+/).at(-1);
  const suffixKey = norm(suffix);
  return EQUIPMENT_MANUFACTURERS.find((manufacturer) => norm(manufacturer) === suffixKey) ?? "";
}

function manufacturerFor(article: Article): string {
  return article.dataset === "equipement" ? manufacturerFromTitle(article.title) : "";
}

function applyNavigationTaxonomy(article: Article, entry?: NavigationEntry): void {
  const subgroup = String(entry?.subgroup ?? "").trim();
  if (article.dataset !== "equipement" || !/^Armement\s+—\s+/i.test(subgroup)) return;

  if (Array.isArray(article.tags)) {
    let replaced = false;
    article.tags = article.tags.map((tag) => {
      if (/^(?:Armes|Armement)\s+—\s+/i.test(String(tag ?? ""))) {
        replaced = true;
        return subgroup;
      }
      return tag;
    });
    if (!replaced) article.tags.push(subgroup);
  }

  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block?.type !== "table" || !Array.isArray(block.rows)) continue;
      block.rows = block.rows.map((row: unknown) => {
        if (!Array.isArray(row) || row.length < 2 || norm(row[0]) !== "categorie") return row;
        if (!/^(?:Armes|Armement)\s+—\s+/i.test(String(row[1] ?? ""))) return row;
        const copy = [...row];
        copy[1] = subgroup;
        return copy;
      });
    }
  }
}

function applyTargetedEditorialCorrections(article: Article): void {
  if (article.id !== "equipement-045-owl-sg-016-boss") return;

  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block?.type !== "p" || typeof block.text !== "string") continue;
      block.text = block.text.replace(
        /Sa grande réserve n[’']en fait pas une arme de moyenne portée\s*:\s*la philosophie du modèle reste celle d[’']un shotgun fiable, efficace tant qu[’']on accepte son domaine d[’']emploi très rapproché\.?/i,
        "Sa capacité de munitions supérieure à la moyenne limite les rechargements, mais ne change pas son domaine d’emploi : le Boss reste un shotgun fiable, conçu pour le combat à très courte portée."
      );
    }
  }
}

function publicSnippetText(value: unknown): string {
  return String(value ?? "")
    .replace(/\{\{Talents\|[^{}]*\}\}/gi, " ")
    .replace(/\{\{(?:MJ|Lore|Encadré)\}\}/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenText(article: Article): string {
  const bits: string[] = [
    article.title ?? "",
    article.source ?? "",
    String(article.manufacturer ?? ""),
    ...(article.tags ?? [])
  ];

  const pnj = article.pnj as JsonObject | undefined;
  if (pnj) {
    bits.push(
      String(pnj.nom_verite ?? ""),
      String(pnj.race ?? ""),
      String(pnj.age ?? ""),
      String(pnj.origine ?? ""),
      String(pnj.statut ?? ""),
      String(pnj.statut_verite ?? ""),
      ...(Array.isArray(pnj.relations) ? pnj.relations.map(String) : [])
    );
  }

  for (const section of article.sections ?? []) {
    bits.push(String(section.title ?? ""));
    for (const block of section.blocks ?? []) {
      if (block?.type === "p") {
        const text = publicSnippetText(block.text);
        if (text) bits.push(text);
      }
      if (block?.type === "table" && Array.isArray(block.rows)) {
        for (const row of block.rows) {
          if (Array.isArray(row)) {
            bits.push(...row.map((cell) => publicSnippetText(cell)).filter(Boolean));
          }
        }
      }
    }
  }

  return bits.join(" ");
}

function articleSnippet(article: Article, query = "", limit = 260): string {
  const text = flattenText(article).replace(/\s+/g, " ").trim();
  if (!text) return "";

  if (query) {
    const normalizedText = norm(text);
    const firstToken = norm(query).split(" ").find(Boolean);
    if (firstToken) {
      const index = normalizedText.indexOf(firstToken);
      if (index > 80) {
        const start = Math.max(0, index - 70);
        const excerpt = text.slice(start, start + limit);
        return `…${excerpt}${start + limit < text.length ? "…" : ""}`;
      }
    }
  }

  return text.slice(0, limit) + (text.length > limit ? "…" : "");
}

function wikiPreviewText(article: Article, limit = 360): string {
  const chunks: string[] = [];

  for (const section of article.sections ?? []) {
    if (section?.audience === "mj") continue;

    for (const block of section.blocks ?? []) {
      if (block?.type === "p") {
        const text = publicSnippetText(block.text);
        if (text) chunks.push(text);
      }
      if (chunks.join(" ").length >= limit * 1.4) break;
    }

    if (chunks.join(" ").length >= limit * 1.4) break;
  }

  const text = publicSnippetText(chunks.join(" ") || articleSnippet(article, "", limit));

  if (text.length <= limit) return text;
  return text.slice(0, limit).replace(/\s+\S*$/, "") + "…";
}

async function readJson<T>(filename: string): Promise<T> {
  return JSON.parse(await readFile(resolve(COMPENDIUM_DATA_DIR, filename), "utf8")) as T;
}

async function loadDataset(spec: DatasetSpec): Promise<Article[]> {
  const parts = await Promise.all(
    Array.from({ length: spec.parts }, async (_, index) => {
      const filename = `${spec.prefix}-${String(index).padStart(2, "0")}.b64part`;
      return readFile(resolve(COMPENDIUM_DATA_DIR, filename), "utf8");
    })
  );

  const compressed = Buffer.from(parts.join("").replace(/\s+/g, ""), "base64");
  const parsed = JSON.parse(gunzipSync(compressed).toString("utf8")) as Article[];
  if (!Array.isArray(parsed)) throw new Error(`${spec.id} · racine non tabulaire`);
  return parsed;
}

async function applyCommittedOverrides(
  articleMap: Map<string, Article>,
  payload: JsonObject
): Promise<{ applied: number; conflicts: number; missing: number }> {
  const entries = Array.isArray(payload.entries) ? payload.entries : [];
  const grouped = new Map<string, JsonObject[]>();

  for (const entry of entries) {
    if (!entry?.articleId) continue;
    const id = String(entry.articleId);
    const list = grouped.get(id) ?? [];
    list.push(entry);
    grouped.set(id, list);
  }

  let applied = 0;
  let conflicts = 0;
  let missing = 0;

  for (const [articleId, articleEntries] of grouped) {
    const base = articleMap.get(articleId);
    if (!base) {
      missing += 1;
      continue;
    }

    const baseHash = articleHash(base);
    let effective = deepClone(base);
    let appliedHere = 0;
    let mediaOverride = false;

    for (const entry of articleEntries) {
      if (entry.baseHash !== baseHash) {
        conflicts += 1;
        continue;
      }

      for (const operation of Array.isArray(entry.operations) ? entry.operations : []) {
        applyOperation(effective, operation);
        if (["/illustration", "/image"].includes(String(operation?.path ?? ""))) {
          mediaOverride = true;
        }
      }

      applied += 1;
      appliedHere += 1;
    }

    if (appliedHere > 0) {
      effective.dataset = effective.dataset ?? base.dataset;
      effective.__editorialOverride = true;
      effective.__editorialOverrideCount = appliedHere;
      effective.__editorialMediaOverride = mediaOverride;
      articleMap.set(articleId, effective);
    }
  }

  return { applied, conflicts, missing };
}

async function loadCorpus(): Promise<Corpus> {
  const manifest = await readJson<Manifest>("manifest-v3.json");
  const navigationPayload = await readJson<{ entries?: NavigationEntry[] }>("navigation-v1.json");
  const overridePayload = await readJson<JsonObject>("manual-overrides.json");

  if (!Array.isArray(manifest.datasets)) throw new Error("Manifest Compendium V3 invalide");

  const byId = new Map<string, Article>();
  const extraterrestrialPnjResolvedIds = new Map<string, string>();
  const extralsGroupsPnjResolvedIds = new Map<string, string>();
  const humanGalacticPnjResolvedIds = new Map<string, string>();
  const crawlerPnjResolvedIds = new Map<string, string>();
  const corporationPnjResolvedIds = new Map<string, string>();
  const hunterPnjResolvedIds = new Map<string, string>();
  const fleauxPnjResolvedIds = new Map<string, string>();
  const mageLogesPnjResolvedIds = new Map<string, string>();
  const vampireCourtPnjResolvedIds = new Map<string, string>();
  const pelagePnjResolvedIds = new Map<string, string>();
  const angelusPnjResolvedIds = new Map<string, string>();
  const templesDaemoniaquesPnjResolvedIds = new Map<string, string>();
  const aserynTerresTemplesPnjResolvedIds = new Map<string, string>();
  const grandsExilesPnjResolvedIds = new Map<string, string>();
  const loaded = await Promise.all(
    manifest.datasets.map(async (spec) => [spec.id, await loadDataset(spec)] as const)
  );

  for (const [dataset, rows] of loaded) {
    for (const source of rows) {
      if (!source?.id) continue;
      const article = deepClone(source);
      article.dataset = article.dataset ?? dataset;
      byId.set(article.id, article);
    }
  }

  for (const guide of COMPENDIUM_GUIDE_ARTICLES) {
    if (!byId.has(guide.id)) byId.set(guide.id, deepClone(guide) as Article);
  }

  for (const article of COMPENDIUM_MOTEUR_V4_ARTICLES) {
    // The rebuilt Moteur corpus deliberately supersedes any legacy page with the same ID.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_REALITE_V9_LORE_ARTICLES) {
    // Reality V9 is the rebuilt canonical public lore corpus for this source.
    byId.set(article.id, deepClone(article) as Article);
  }

  const corporationsHub = byId.get(COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ID);
  if (corporationsHub) {
    const existingIds = new Set((corporationsHub.sections ?? []).map((section) => String(section?.id ?? "")));
    const additions = (COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT.sections ?? [])
      .filter((section: JsonObject) => !existingIds.has(String(section?.id ?? "")));
    corporationsHub.sections = [...(corporationsHub.sections ?? []), ...(deepClone(additions) as JsonObject[])];
    const sources = [corporationsHub.source, COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT.source]
      .flatMap((value) => String(value ?? "").split(" ; "))
      .map((value) => value.trim())
      .filter(Boolean);
    corporationsHub.source = [...new Set(sources)].join(" ; ");
    corporationsHub.tags = [...new Set([
      ...(corporationsHub.tags ?? []),
      ...(COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT.tags ?? [])
    ])];
    corporationsHub.status = "canon_enrichi";
    corporationsHub.rebuildV2 = true;
  }

  for (const article of COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES) {
    byId.set(String(article.id), deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_REALITE_V9_PEGRE_ARTICLES) {
    // Detailed California underworld pass: overrides the Reality hub and adds one page per criminal organization.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_REALITE_V9_PEGRE_PNJ_ARTICLES) {
    // Active underworld PNJs use dedicated IDs; archived PNJ pages remain audit material only.
    byId.set(article.id, deepClone(article) as Article);
  }

  const lausHub = byId.get("realite-v9-los-angeles-laus-securites");
  if (lausHub) {
    // Preserve the consolidated Reality page and append the source-complete Police/LAUS detail pass.
    lausHub.sections = [
      ...(lausHub.sections ?? []),
      ...(deepClone(COMPENDIUM_REALITE_V9_POLICE_HUB_SECTIONS) as JsonObject[])
    ];
  }

  for (const article of COMPENDIUM_REALITE_V9_POLICE_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_REALITE_V9_POLICE_PNJ_ARTICLES) {
    // Active Police/Most-Wanted profiles use dedicated IDs; matching OLD pages remain audit-only.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const enrichment of COMPENDIUM_REALITE_V9_POLICE_PNJ_ENRICHMENTS) {
    const target = byId.get(enrichment.id);
    if (!target) continue;
    target.sections = [
      ...(target.sections ?? []),
      deepClone(enrichment.section) as JsonObject
    ];
  }

  const governmentHub = byId.get("realite-v9-etat-institutions-grande-reserve");
  if (governmentHub) {
    governmentHub.sections = [
      ...(governmentHub.sections ?? []),
      ...(deepClone(COMPENDIUM_REALITE_V9_GOVERNMENT_HUB_SECTIONS) as JsonObject[])
    ];
    if (!String(governmentHub.source ?? "").includes("TUC_organisations_gouvernement(1).docx")) {
      governmentHub.source = [governmentHub.source, "TUC_organisations_gouvernement(1).docx"].filter(Boolean).join(" ; ");
    }
  }

  for (const article of COMPENDIUM_REALITE_V9_GOVERNMENT_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const enrichment of COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ENRICHMENTS) {
    const target = byId.get(enrichment.id);
    if (!target) continue;
    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    if (!existingIds.has(String(enrichment.section?.id ?? ""))) {
      target.sections = [
        ...(target.sections ?? []),
        deepClone(enrichment.section) as JsonObject
      ];
    }
    if (!String(target.source ?? "").includes("TUC_organisations_gouvernement(1).docx")) {
      target.source = [target.source, "TUC_organisations_gouvernement(1).docx"].filter(Boolean).join(" ; ");
    }
    target.tags = Array.from(new Set([...(target.tags ?? []), "Gouvernement"]));
  }

  const agenciesHub = byId.get(COMPENDIUM_REALITE_V9_AGENCIES_HUB_ID);
  if (agenciesHub) {
    agenciesHub.title = String(COMPENDIUM_REALITE_V9_AGENCIES_HUB.title ?? agenciesHub.title);
    agenciesHub.source = String(COMPENDIUM_REALITE_V9_AGENCIES_HUB.source ?? agenciesHub.source);
    agenciesHub.tags = deepClone(COMPENDIUM_REALITE_V9_AGENCIES_HUB.tags ?? agenciesHub.tags ?? []);
    agenciesHub.sections = deepClone(COMPENDIUM_REALITE_V9_AGENCIES_HUB.sections ?? []) as JsonObject[];
    agenciesHub.status = "canon_enrichi";
    agenciesHub.rebuildV2 = true;
  }

  for (const article of COMPENDIUM_REALITE_V9_AGENCIES_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_REALITE_V9_AGENCIES_PNJ_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_REALITE_V9_RELIGION_ARTICLES) {
    // Religion consolidation overrides the Reality hub and adds one immersive page per major tradition.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const sourceArticle of COMPENDIUM_REALITE_V9_RELIGION_PNJ_ARTICLES) {
    // Active religious profiles never reuse archived legacy IDs: archives remain independent audit material.
    const article = deepClone(sourceArticle) as Article;
    article.id = activeReligionPnjId(article.id);
    byId.set(article.id, article);
  }

  for (const article of COMPENDIUM_REALITE_V9_CHRISTIANITY_ARTICLES) {
    // Full Christianity pass: enriches the public Church page and adds active PNJs from the detailed source.
    byId.set(article.id, deepClone(article) as Article);
  }

  // Final source-complete public Reality consolidation for the unified Christian Church.
  byId.set(
    COMPENDIUM_REALITE_V9_CHRISTIANITY_LORE_ARTICLE.id,
    deepClone(COMPENDIUM_REALITE_V9_CHRISTIANITY_LORE_ARTICLE) as Article
  );

  for (const article of COMPENDIUM_REALITE_V9_RULE_ARTICLES) {
    // Transversal rules hidden among catalog chapters are promoted here without duplicating catalog entries.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_LORE_ARTICLES) {
    // Truth V7 is rebuilt source-first; it supersedes archived legacy pages without restoring the old corpus.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_RULE_ARTICLES) {
    // Common Truth rules are promoted from the canonical V7 source and remain separate from product catalogs.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_KHINAE_LORE_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_KHINAE_RULE_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_MAGE_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_DAEMON_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_ANGELUS_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const enrichment of COMPENDIUM_VERITE_ANGELUS_ENRICHMENTS) {
    const target = byId.get(String(enrichment.targetId ?? ""));
    if (!target) {
      throw new Error(`Cible d'enrichissement Angelus absente: ${String(enrichment.targetId ?? "")}`);
    }

    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    const sections = (deepClone(enrichment.sections ?? []) as JsonObject[]).filter(
      (section) => !existingIds.has(String(section?.id ?? ""))
    );
    if (sections.length) target.sections = [...(target.sections ?? []), ...sections];

    const sources = [target.source, enrichment.source]
      .flatMap((value) => String(value ?? "").split(" ; "))
      .map((value) => value.trim())
      .filter(Boolean);
    target.source = [...new Set(sources)].join(" ; ");
    target.tags = [
      ...new Set([
        ...(target.tags ?? []),
        ...(enrichment.tags ?? []),
        ...(new Set(sources).size > 1 ? ["Multi-source"] : [])
      ])
    ];
    target.status = "canon_enrichi";
    target.rebuildV2 = true;
  }

  for (const article of COMPENDIUM_VERITE_ANGELUS_ARTICLES) {
    byId.set(String(article.id), deepClone(article) as Article);
  }

  for (const sourceArticle of COMPENDIUM_VERITE_ANGELUS_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingAserynPnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeAngelusPnj(existing, article));
      angelusPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    angelusPnjResolvedIds.set(article.id, article.id);
  }

  for (const article of COMPENDIUM_VERITE_V7_ASERYN_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  const aserynHub = byId.get(COMPENDIUM_VERITE_ASERYN_HUB_ID);
  if (!aserynHub) {
    throw new Error(`Hub Aseryn absent pour l'intégration des terres et temples: ${COMPENDIUM_VERITE_ASERYN_HUB_ID}`);
  }

  const aserynHubSectionIds = new Set(
    (aserynHub.sections ?? []).map((section) => String(section?.id ?? ""))
  );
  for (const section of COMPENDIUM_VERITE_ASERYN_HUB_SECTIONS) {
    const id = String(section?.id ?? "");
    if (!id || aserynHubSectionIds.has(id)) continue;
    aserynHub.sections = [...(aserynHub.sections ?? []), deepClone(section) as JsonObject];
    aserynHubSectionIds.add(id);
  }

  aserynHub.source = [
    ...new Set(
      [aserynHub.source, COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_SOURCE]
        .flatMap((value) => String(value ?? "").split(" ; "))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ].join(" ; ");
  aserynHub.tags = [
    ...new Set([...(aserynHub.tags ?? []), "Terres aserynes", "Temples aseryns", "Multi-source"])
  ];
  aserynHub.status = "canon_enrichi";
  aserynHub.rebuildV2 = true;

  for (const article of COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_ARTICLES) {
    byId.set(String(article.id), deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_PASS_B_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  const grandsExilesHub = byId.get(COMPENDIUM_VERITE_GRANDS_EXILES_HUB_ID);
  if (!grandsExilesHub) {
    throw new Error(`Hub Exilés absent pour l'intégration Grands Exilés: ${COMPENDIUM_VERITE_GRANDS_EXILES_HUB_ID}`);
  }
  const grandsExilesHubSectionIds = new Set(
    (grandsExilesHub.sections ?? []).map((section) => String(section?.id ?? ""))
  );
  for (const section of COMPENDIUM_VERITE_GRANDS_EXILES_HUB_SECTIONS) {
    const id = String(section?.id ?? "");
    if (!id || grandsExilesHubSectionIds.has(id)) continue;
    grandsExilesHub.sections = [...(grandsExilesHub.sections ?? []), deepClone(section) as JsonObject];
    grandsExilesHubSectionIds.add(id);
  }
  grandsExilesHub.source = [
    ...new Set(
      [grandsExilesHub.source, COMPENDIUM_VERITE_GRANDS_EXILES_SOURCE]
        .flatMap((value) => String(value ?? "").split(" ; "))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ].join(" ; ");
  grandsExilesHub.tags = [
    ...new Set([...(grandsExilesHub.tags ?? []), "Grands Exilés", "Factions exilées", "Multi-source"])
  ];
  grandsExilesHub.status = "canon_enrichi";
  grandsExilesHub.rebuildV2 = true;

  for (const article of COMPENDIUM_VERITE_GRANDS_EXILES_ARTICLES) {
    byId.set(String(article.id), deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_HUNTERS_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_V7_PASS_B_RULE_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES) {
    // Detailed terrestrial-creature source: adds families not already promoted by Truth V7.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const enrichment of COMPENDIUM_VERITE_SPECIES_ENRICHMENTS) {
    const target = byId.get(enrichment.targetId);
    if (!target) continue;
    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    target.sections = [
      ...(target.sections ?? []),
      ...deepClone(enrichment.sections).filter((section) => !existingIds.has(String(section?.id ?? "")))
    ];
  }

  for (const article of COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES) {
    // These active PNJs are recreated from the detailed source and remain independent from OLD archives.
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const enrichment of COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS) {
    const target = byId.get(enrichment.targetId);
    if (!target) continue;
    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    target.sections = [
      ...(target.sections ?? []),
      ...deepClone(enrichment.sections).filter((section) => !existingIds.has(String(section?.id ?? "")))
    ];
  }

  for (const article of COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const article of COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES) {
    byId.set(article.id, deepClone(article) as Article);
  }

  for (const enrichment of COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS) {
    const target = byId.get(enrichment.targetId);
    if (!target) continue;
    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    target.sections = [
      ...(target.sections ?? []),
      ...deepClone(enrichment.sections).filter((section) => !existingIds.has(String(section?.id ?? "")))
    ];
  }

  for (const sourceArticle of COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeExtraterrestrialPnj(existing, article));
      extraterrestrialPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    extraterrestrialPnjResolvedIds.set(article.id, article.id);
  }

  for (const article of COMPENDIUM_VERITE_GALACTIC_LORE_ARTICLES) {
    byId.set(String(article.id), deepClone(article) as Article);
  }

  for (const sourceArticle of COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeExtraterrestrialPnj(existing, article));
      extralsGroupsPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    extralsGroupsPnjResolvedIds.set(article.id, article.id);
  }

  for (const sourceArticle of COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeExtraterrestrialPnj(existing, article));
      humanGalacticPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    humanGalacticPnjResolvedIds.set(article.id, article.id);
  }

  for (const enrichment of COMPENDIUM_VERITE_HUNTERS_ENRICHMENTS) {
    const target = byId.get(String(enrichment.id ?? ""));
    if (!target) continue;

    const replaceTitles = new Set(
      (enrichment.replaceSections ?? []).map((title: unknown) => norm(title))
    );
    const incomingTitles = new Set(
      (enrichment.sections ?? []).map((section: JsonObject) => norm(section?.title ?? ""))
    );
    target.sections = [
      ...(target.sections ?? []).filter((section) => {
        const title = norm(section?.title ?? "");
        return !replaceTitles.has(title) && !incomingTitles.has(title);
      }),
      ...(deepClone(enrichment.sections ?? []) as JsonObject[])
    ];

    const sources = [target.source, COMPENDIUM_VERITE_HUNTERS_SOURCE]
      .flatMap((value) => String(value ?? "").split(" ; "))
      .map((value) => value.trim())
      .filter(Boolean);
    target.source = [...new Set(sources)].join(" ; ");

    const isRealityLore =
      target.category === "Réalité" ||
      (target.category === "Organisations" &&
        (target.tags ?? []).some((tag) => norm(tag) === "religions et neoreligions"));
    target.tags = [
      ...new Set([
        ...(target.tags ?? []),
        ...(isRealityLore ? ["Lore Chasseurs 2026-09"] : ["Vérité", "Chasseurs", "Lore Chasseurs 2026-09"])
      ])
    ];
    target.status = "canon_enrichi";
    // Do not promote a legacy archive merely because the Chasseurs source adds evidence to it.
    // Rebuilt active pages remain rebuilt; archived V3 pages keep their OLD status at cut-over.
  }

  const grandsExilesHunterTarget = byId.get(
    String(COMPENDIUM_VERITE_GRANDS_EXILES_HUNTER_ENRICHMENT.targetId ?? "")
  );
  if (!grandsExilesHunterTarget) {
    throw new Error(
      `Cible Chasse Fantastique absente: ${COMPENDIUM_VERITE_GRANDS_EXILES_HUNTER_ENRICHMENT.targetId}`
    );
  }
  const grandsExilesHunterSectionIds = new Set(
    (grandsExilesHunterTarget.sections ?? []).map((section) => String(section?.id ?? ""))
  );
  const grandsExilesHunterSections = deepClone(
    COMPENDIUM_VERITE_GRANDS_EXILES_HUNTER_ENRICHMENT.sections ?? []
  ).filter((section: JsonObject) => !grandsExilesHunterSectionIds.has(String(section?.id ?? "")));
  if (grandsExilesHunterSections.length) {
    grandsExilesHunterTarget.sections = [
      ...(grandsExilesHunterTarget.sections ?? []),
      ...grandsExilesHunterSections
    ];
  }
  grandsExilesHunterTarget.source = [
    ...new Set(
      [grandsExilesHunterTarget.source, COMPENDIUM_VERITE_GRANDS_EXILES_SOURCE]
        .flatMap((value) => String(value ?? "").split(" ; "))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ].join(" ; ");
  grandsExilesHunterTarget.tags = [
    ...new Set([
      ...(grandsExilesHunterTarget.tags ?? []),
      ...(COMPENDIUM_VERITE_GRANDS_EXILES_HUNTER_ENRICHMENT.tags ?? []),
      "Multi-source"
    ])
  ];
  grandsExilesHunterTarget.status = "canon_enrichi";
  grandsExilesHunterTarget.rebuildV2 = true;

  for (const enrichment of COMPENDIUM_REALITE_V9_GOVERNMENT_TRUTH_PNJ_ENRICHMENTS) {
    const target = byId.get(enrichment.id);
    if (!target) continue;
    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    if (!existingIds.has(String(enrichment.section?.id ?? ""))) {
      target.sections = [
        ...(target.sections ?? []),
        deepClone(enrichment.section) as JsonObject
      ];
    }
    if (!String(target.source ?? "").includes("TUC_organisations_gouvernement(1).docx")) {
      target.source = [target.source, "TUC_organisations_gouvernement(1).docx"].filter(Boolean).join(" ; ");
    }
    target.tags = Array.from(new Set([...(target.tags ?? []), "Gouvernement", "Réalité"]));
  }

  for (const enrichment of COMPENDIUM_REALITE_V9_AGENCIES_PNJ_ENRICHMENTS) {
    const target = byId.get(enrichment.id);
    if (!target) continue;
    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    const sections = deepClone(enrichment.sections ?? []).filter(
      (section: JsonObject) => !existingIds.has(String(section?.id ?? ""))
    );
    if (sections.length) {
      target.sections = [...(target.sections ?? []), ...sections];
    }
    if (enrichment.pnjPatch) {
      target.pnj = {
        ...(target.pnj ?? {}),
        ...deepClone(enrichment.pnjPatch)
      };
    }
    if (!String(target.source ?? "").includes("TUC_organisations_agences(1).docx")) {
      target.source = [target.source, "TUC_organisations_agences(1).docx"].filter(Boolean).join(" ; ");
    }
    target.tags = Array.from(new Set([...(target.tags ?? []), "Agences", "Réalité"]));
  }

  const crawlersHub = byId.get(COMPENDIUM_REALITE_V9_CRAWLERS_HUB_ID);
  if (crawlersHub) {
    const existingIds = new Set((crawlersHub.sections ?? []).map((section) => String(section?.id ?? "")));
    const sections = deepClone(COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SECTIONS).filter(
      (section: JsonObject) => !existingIds.has(String(section?.id ?? ""))
    );
    if (sections.length) {
      crawlersHub.sections = [...(crawlersHub.sections ?? []), ...sections];
    }
    const sources = [crawlersHub.source, COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SOURCE]
      .flatMap((value) => String(value ?? "").split(" ; "))
      .map((value) => value.trim())
      .filter(Boolean);
    crawlersHub.source = [...new Set(sources)].join(" ; ");
    crawlersHub.tags = [
      ...new Set([...(crawlersHub.tags ?? []), ...COMPENDIUM_REALITE_V9_CRAWLERS_HUB_TAGS])
    ];
    crawlersHub.status = "canon_enrichi";
    crawlersHub.rebuildV2 = true;
  }

  for (const enrichment of COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLE_ENRICHMENTS) {
    const target = byId.get(String(enrichment.targetId ?? ""));
    if (!target) continue;

    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    const sections = deepClone(enrichment.sections ?? []).filter(
      (section: JsonObject) => !existingIds.has(String(section?.id ?? ""))
    );
    if (sections.length) {
      target.sections = [...(target.sections ?? []), ...sections];
    }

    const sources = [target.source, enrichment.source]
      .flatMap((value) => String(value ?? "").split(" ; "))
      .map((value) => value.trim())
      .filter(Boolean);
    target.source = [...new Set(sources)].join(" ; ");
    target.tags = [...new Set([...(target.tags ?? []), ...(enrichment.tags ?? [])])];
    target.status = "canon_enrichi";
    target.rebuildV2 = true;
  }

  for (const article of COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLES) {
    byId.set(String(article.id), deepClone(article) as Article);
  }

  for (const sourceArticle of COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeCrawlerPnj(existing, article));
      crawlerPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    crawlerPnjResolvedIds.set(article.id, article.id);
  }

  for (const sourceArticle of COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeCorporationPnj(existing, article));
      corporationPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    corporationPnjResolvedIds.set(article.id, article.id);
  }

  for (const sourceArticle of COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeHunterPnj(existing, article));
      hunterPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    hunterPnjResolvedIds.set(article.id, article.id);
  }

  for (const article of COMPENDIUM_VERITE_FLEAUX_ARTICLES) {
    byId.set(String(article.id), deepClone(article) as Article);
  }

  for (const enrichment of COMPENDIUM_VERITE_FLEAUX_ENRICHMENTS) {
    const target = byId.get(String(enrichment.targetId ?? ""));
    if (!target) {
      throw new Error(`Cible d'enrichissement Fléaux absente: ${String(enrichment.targetId ?? "")}`);
    }
    const incoming = deepClone(enrichment.section) as JsonObject;
    const incomingId = String(incoming?.id ?? "");
    const incomingTitle = norm(incoming?.title ?? "");
    const exists = (target.sections ?? []).some(
      (section) =>
        (incomingId && String(section?.id ?? "") === incomingId) ||
        (incomingTitle && norm(section?.title ?? "") === incomingTitle)
    );
    if (!exists) target.sections = [...(target.sections ?? []), incoming];

    const sources = [target.source, COMPENDIUM_VERITE_FLEAUX_SOURCE]
      .flatMap((value) => String(value ?? "").split(" ; "))
      .map((value) => value.trim())
      .filter(Boolean);
    target.source = [...new Set(sources)].join(" ; ");
    target.tags = [...new Set([...(target.tags ?? []), "Fléaux", "Focus Fléaux 2026-09"])];
    target.status = "canon_enrichi";
    target.rebuildV2 = true;
  }

  for (const sourceArticle of COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeFleauxPnj(existing, article));
      fleauxPnjResolvedIds.set(article.id, existing.id);
      continue;
    }

    const legacyTargetId = String(article.legacyTargetId ?? "");
    const legacy = legacyTargetId ? byId.get(legacyTargetId) : null;
    if (legacy) {
      const rebuilt = deepClone(legacy) as Article;
      rebuilt.id = article.id;
      rebuilt.dataset = article.dataset;
      rebuilt.category = "Personnages";
      rebuilt.sourceCategory = String(legacy.sourceCategory ?? "Vérité");
      rebuilt.rebuildV2 = true;
      delete rebuilt.__legacy;
      delete rebuilt.legacyCategory;
      byId.set(article.id, mergeFleauxPnj(rebuilt, article));
    } else {
      byId.set(article.id, article);
    }
    fleauxPnjResolvedIds.set(article.id, article.id);
  }

  for (const sourceArticle of COMPENDIUM_VERITE_FLEAUX_NEW_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeFleauxPnj(existing, article));
      fleauxPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    fleauxPnjResolvedIds.set(article.id, article.id);
  }

  const mageLogesHub = byId.get(COMPENDIUM_VERITE_LOGES_MAGES_HUB_ID);
  if (!mageLogesHub) {
    throw new Error(`Hub Mages absent pour l'intégration des Loges: ${COMPENDIUM_VERITE_LOGES_MAGES_HUB_ID}`);
  }
  const mageLogesSectionIds = new Set(
    (mageLogesHub.sections ?? []).map((section) => String(section?.id ?? ""))
  );
  for (const section of COMPENDIUM_VERITE_LOGES_MAGES_HUB_SECTIONS) {
    const id = String(section?.id ?? "");
    if (!id || mageLogesSectionIds.has(id)) continue;
    mageLogesHub.sections = [...(mageLogesHub.sections ?? []), deepClone(section) as JsonObject];
    mageLogesSectionIds.add(id);
  }
  mageLogesHub.source = [
    ...new Set(
      [mageLogesHub.source, COMPENDIUM_VERITE_LOGES_MAGES_SOURCE]
        .flatMap((value) => String(value ?? "").split(" ; "))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ].join(" ; ");
  mageLogesHub.tags = [
    ...new Set([...(mageLogesHub.tags ?? []), "Loges des Mages", "New-York", "Los Angeles", "San Diejuana", "Las Vegas", "Phoenix", "Grande Réserve"])
  ];
  mageLogesHub.status = "canon_enrichi";
  mageLogesHub.rebuildV2 = true;

  for (const sourceArticle of COMPENDIUM_VERITE_LOGES_MAGES_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeFleauxPnj(existing, article));
      mageLogesPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    mageLogesPnjResolvedIds.set(article.id, article.id);
  }

  const templesDaemoniaquesHub = byId.get(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_ID);
  if (!templesDaemoniaquesHub) {
    throw new Error(`Hub Daemons absent pour l'intégration des Temples démoniaques: ${COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_ID}`);
  }
  const templesDaemoniaquesHubSectionIds = new Set(
    (templesDaemoniaquesHub.sections ?? []).map((section) => String(section?.id ?? ""))
  );
  for (const section of COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_SECTIONS) {
    const id = String(section?.id ?? "");
    if (!id || templesDaemoniaquesHubSectionIds.has(id)) continue;
    templesDaemoniaquesHub.sections = [
      ...(templesDaemoniaquesHub.sections ?? []),
      deepClone(section) as JsonObject
    ];
    templesDaemoniaquesHubSectionIds.add(id);
  }
  const templesDaemoniaquesHubSources = [
    templesDaemoniaquesHub.source,
    COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_SOURCE,
    COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_SOURCE
  ]
    .flatMap((value) => String(value ?? "").split(" ; "))
    .map((value) => value.trim())
    .filter(Boolean);
  templesDaemoniaquesHub.source = [...new Set(templesDaemoniaquesHubSources)].join(" ; ");
  templesDaemoniaquesHub.tags = [
    ...new Set([
      ...(templesDaemoniaquesHub.tags ?? []),
      "Temples démoniaques",
      "Temples fantômes",
      "Multi-source"
    ])
  ];
  templesDaemoniaquesHub.status = "canon_enrichi";
  templesDaemoniaquesHub.rebuildV2 = true;

  for (const sourceArticle of COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    // Public PNJ metadata must not reveal daemon nature, patron deity or Temple.
    article.tags = (article.tags ?? []).filter((tag) => !/daemon|temple/i.test(String(tag)));

    const existing = findMatchingActivePnj(byId, article);
    if (existing && String(existing.dataset ?? "").includes("angelus")) {
      throw new Error(`Fusion Angelus/Daemon interdite pour ${article.title ?? article.id}: ${existing.id}`);
    }

    if (existing) {
      const merged = mergeCrawlerPnj(existing, article);
      const targetPnj = existing.pnj ?? {};
      const sourcePnj = article.pnj ?? {};
      merged.pnj = {
        ...targetPnj,
        ...sourcePnj,
        relations: [
          ...new Set([
            ...((Array.isArray(targetPnj.relations) ? targetPnj.relations : []) as string[]),
            ...((Array.isArray(sourcePnj.relations) ? sourcePnj.relations : []) as string[])
          ])
        ],
        source_documents: [
          ...new Set([
            ...((Array.isArray(targetPnj.source_documents) ? targetPnj.source_documents : []) as string[]),
            ...((Array.isArray(sourcePnj.source_documents) ? sourcePnj.source_documents : []) as string[]),
            ...String(existing.source ?? "").split(" ; "),
            ...String(article.source ?? "").split(" ; ")
          ].map((value) => String(value ?? "").trim()).filter(Boolean))
        ]
      };
      merged.pnj.identity_keys = [
        ...new Set([
          ...articlePnjIdentityKeys(existing),
          ...articlePnjIdentityKeys(article),
          ...articlePnjIdentityKeys(merged)
        ])
      ];
      if (String(sourcePnj.real_name ?? "").trim() === "Nick Edison") {
        merged.pnj.identity_keys = merged.pnj.identity_keys.filter(
          (key: string) => !normalizedPnjIdentity(key).includes("balam")
        );
        merged.pnj.nom_verite = sourcePnj.nom_verite;
        merged.pnj.nom_verite_source = sourcePnj.nom_verite_source;
      }
      byId.set(existing.id, merged);
      templesDaemoniaquesPnjResolvedIds.set(article.id, existing.id);
      continue;
    }

    if (String(article.pnj?.real_name ?? "").trim() === "Nick Edison") {
      article.pnj.identity_keys = (article.pnj.identity_keys ?? []).filter(
        (key: string) => !normalizedPnjIdentity(key).includes("balam")
      );
    }
    byId.set(article.id, article);
    templesDaemoniaquesPnjResolvedIds.set(article.id, article.id);
  }

  const leslie = byId.get(String(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT.targetId ?? ""));
  if (!leslie) {
    throw new Error(`Leslie Wright absente pour le lien Abrasax: ${String(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT.targetId ?? "")}`);
  }
  const abrasaxResolvedId =
    templesDaemoniaquesPnjResolvedIds.get(String(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT.relationId ?? "")) ??
    String(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT.relationId ?? "");
  leslie.pnj = { ...(leslie.pnj ?? {}) };
  leslie.pnj.relations = [
    ...new Set([
      ...((Array.isArray(leslie.pnj.relations) ? leslie.pnj.relations : []) as string[]),
      abrasaxResolvedId
    ].filter(Boolean))
  ];
  leslie.pnj.source_documents = [
    ...new Set([
      ...((Array.isArray(leslie.pnj.source_documents) ? leslie.pnj.source_documents : []) as string[]),
      COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_SOURCE
    ])
  ];
  const leslieSection = deepClone(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT.section) as JsonObject;
  if (!(leslie.sections ?? []).some((section) => String(section?.id ?? "") === String(leslieSection.id ?? ""))) {
    leslie.sections = [...(leslie.sections ?? []), leslieSection];
  }
  leslie.tags = [...new Set([...(leslie.tags ?? []), "Multi-source"])];
  leslie.status = "canon_enrichi";
  leslie.rebuildV2 = true;

  const addProtectedPnjRelation = (
    article: Article,
    relatedId: string,
    note: string,
    relationKey: string
  ) => {
    article.pnj = { ...(article.pnj ?? {}) };
    article.pnj.relations = [
      ...new Set([
        ...((Array.isArray(article.pnj.relations) ? article.pnj.relations : []) as string[]),
        relatedId
      ].filter(Boolean))
    ];
    article.pnj.source_documents = [
      ...new Set([
        ...((Array.isArray(article.pnj.source_documents) ? article.pnj.source_documents : []) as string[]),
        COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_SOURCE,
        COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_SOURCE
      ])
    ];
    const sectionId = `temples-daemoniaques-relation-${relationKey.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
    if (!(article.sections ?? []).some((section) => String(section?.id ?? "") === sectionId)) {
      article.sections = [
        ...(article.sections ?? []),
        {
          id: sectionId,
          title: "Lien MJ · Angelus & Daemons",
          level: 2,
          audience: "mj",
          blocks: [{ type: "p", style: "lore", text: note }]
        }
      ];
    }
    article.status = "canon_enrichi";
    article.rebuildV2 = true;
  };

  for (const relation of COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_RELATIONS) {
    const daemonId =
      templesDaemoniaquesPnjResolvedIds.get(String(relation.daemonSourceId ?? "")) ??
      String(relation.daemonSourceId ?? "");
    const angelusId =
      angelusPnjResolvedIds.get(String(relation.angelusId ?? "")) ??
      String(relation.angelusId ?? "");
    const daemon = byId.get(daemonId);
    const angelus = byId.get(angelusId);
    if (!daemon || !angelus) {
      throw new Error(`Relation Angelus/Daemon introuvable: ${daemonId} ↔ ${angelusId}`);
    }
    const key = `${String(relation.daemonSourceId ?? "")}-${String(relation.angelusId ?? "")}`;
    addProtectedPnjRelation(daemon, angelusId, String(relation.note ?? ""), key);
    addProtectedPnjRelation(angelus, daemonId, String(relation.note ?? ""), key);
  }

  for (const article of COMPENDIUM_VERITE_VAMPIRE_COURTS_ARTICLES) byId.set(String(article.id), deepClone(article) as Article);
  for (const enrichment of COMPENDIUM_VERITE_VAMPIRE_COURTS_ENRICHMENTS) {
    const target=byId.get(String(enrichment.targetId??"")); if(!target) throw new Error(`Cible d'enrichissement Cours vampiriques absente: ${String(enrichment.targetId??"")}`);
    const ids=new Set((target.sections??[]).map((section)=>String(section?.id??""))); const ss=deepClone(enrichment.sections??[]).filter((section:JsonObject)=>!ids.has(String(section?.id??""))); if(ss.length)target.sections=[...(target.sections??[]),...ss];
    const sources=[target.source,COMPENDIUM_VERITE_VAMPIRE_COURTS_SOURCE].flatMap((v)=>String(v??"").split(" ; ")).map((v)=>v.trim()).filter(Boolean); target.source=[...new Set(sources)].join(" ; "); target.tags=[...new Set([...(target.tags??[]),"Vampires","Cours vampiriques",...(new Set(sources).size>1?["Multi-source"]:[])])]; target.status="canon_enrichi"; target.rebuildV2=true;
  }
  for (const sourceArticle of COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_ARTICLES) {
    const article=deepClone(sourceArticle) as Article; const existing=findMatchingActivePnj(byId,article);
    if(existing){byId.set(existing.id,mergeVampireCourtPnj(existing,article));vampireCourtPnjResolvedIds.set(article.id,existing.id);continue;}
    byId.set(article.id,article);vampireCourtPnjResolvedIds.set(article.id,article.id);
  }
  for (const article of COMPENDIUM_VERITE_PELAGES_ARTICLES) {
    byId.set(String(article.id), deepClone(article) as Article);
  }

  for (const enrichment of COMPENDIUM_VERITE_PELAGES_ENRICHMENTS) {
    const target = byId.get(String(enrichment.targetId ?? ""));
    if (!target) {
      throw new Error(`Cible d'enrichissement Pelages absente: ${String(enrichment.targetId ?? "")}`);
    }

    const existingIds = new Set((target.sections ?? []).map((section) => String(section?.id ?? "")));
    const sections = deepClone(enrichment.sections ?? []).filter(
      (section: JsonObject) => !existingIds.has(String(section?.id ?? ""))
    );
    if (sections.length) target.sections = [...(target.sections ?? []), ...sections];

    const sources = [target.source, enrichment.source]
      .flatMap((value) => String(value ?? "").split(" ; "))
      .map((value) => value.trim())
      .filter(Boolean);
    target.source = [...new Set(sources)].join(" ; ");
    target.tags = [
      ...new Set([
        ...(target.tags ?? []),
        ...(enrichment.tags ?? []),
        ...(new Set(sources).size > 1 ? ["Multi-source"] : [])
      ])
    ];
    target.status = "canon_enrichi";
    target.rebuildV2 = true;
  }

  for (const sourceArticle of COMPENDIUM_VERITE_PELAGES_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingActivePnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergePelagePnj(existing, article));
      pelagePnjResolvedIds.set(article.id, existing.id);
      continue;
    }

    byId.set(article.id, article);
    pelagePnjResolvedIds.set(article.id, article.id);
  }

  for (const sourceArticle of COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingAserynPnj(byId, article);
    if (existing) {
      byId.set(existing.id, mergeAserynPnj(existing, article));
      aserynTerresTemplesPnjResolvedIds.set(article.id, existing.id);
      continue;
    }
    byId.set(article.id, article);
    aserynTerresTemplesPnjResolvedIds.set(article.id, article.id);
  }

  for (const sourceArticle of COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES) {
    const article = deepClone(sourceArticle) as Article;
    const existing = findMatchingAserynPnj(byId, article);
    if (existing) {
      const merged = mergeAserynPnj(existing, article);
      const sources = [existing.source, article.source]
        .flatMap((value) => String(value ?? "").split(" ; "))
        .map((value) => value.trim())
        .filter(Boolean);
      merged.source = [...new Set(sources)].join(" ; ");
      merged.tags = [
        ...new Set([
          ...(merged.tags ?? []),
          "Exilés",
          "Grands Exilés 2026-09",
          ...(new Set(sources).size > 1 ? ["Multi-source"] : [])
        ])
      ];
      merged.status = "canon_enrichi";
      merged.rebuildV2 = true;
      byId.set(existing.id, merged);
      grandsExilesPnjResolvedIds.set(article.id, existing.id);
      continue;
    }

    byId.set(article.id, article);
    grandsExilesPnjResolvedIds.set(article.id, article.id);
  }

  const generatedTalentHubs = generatedTalentHubCorpus();
  for (const hub of generatedTalentHubs.articles) {
    if (!byId.has(hub.id)) byId.set(hub.id, deepClone(hub) as Article);
  }

  const generatedBuilderReferences = generatedBuilderReferenceCorpus();
  for (const reference of generatedBuilderReferences.articles) {
    if (!byId.has(String(reference.id))) {
      byId.set(String(reference.id), deepClone(reference) as Article);
    }
  }

  const overrideSummary = await applyCommittedOverrides(byId, overridePayload);

  const customArticles = await pool.query<{ articleId: string; baseDocument: Article }>(
    `SELECT article_id AS "articleId", base_document AS "baseDocument"
     FROM compendium_custom_articles
     WHERE is_published = true`
  );
  const customArticleIds = new Set<string>();
  for (const row of customArticles.rows) {
    if (!row.baseDocument?.id || byId.has(row.articleId)) continue;
    const article = deepClone(row.baseDocument);
    article.dataset = "custom";
    byId.set(row.articleId, article);
    customArticleIds.add(row.articleId);
  }

  const editorBaseById = new Map<string, { hash: string; article: Article }>();
  for (const [id, article] of byId) {
    editorBaseById.set(id, { hash: articleHash(article), article: deepClone(article) });
  }

  for (const id of customArticleIds) {
    const article = byId.get(id);
    if (article) article.__customWikiPage = true;
  }

  let databaseEditApplied = 0;
  let databaseEditConflicts = 0;
  const publishedEdits = await pool.query<{
    articleId: string;
    baseHash: string;
    published: JsonObject;
  }>(
    `SELECT
       article_id AS "articleId",
       base_hash AS "baseHash",
       published
     FROM compendium_article_edits
     WHERE published IS NOT NULL`
  );

  for (const row of publishedEdits.rows) {
    const base = editorBaseById.get(row.articleId);
    const current = byId.get(row.articleId);
    if (!base || !current) continue;
    if (row.baseHash !== base.hash) {
      databaseEditConflicts += 1;
      continue;
    }

    const effective = editableArticle(current, row.published);
    effective.__wikiPublishedEdit = true;
    byId.set(row.articleId, effective);
    databaseEditApplied += 1;
  }

  const manualMediaFiles = new Set(
    await readdir(resolve(COMPENDIUM_MEDIA_DIR, "images/manual")).catch(() => [] as string[])
  );
  const manualGalleryByArticle = new Map<string, string[]>();
  for (const filename of manualMediaFiles) {
    if (!filename.endsWith(".webp")) continue;
    const marker = filename.indexOf("--");
    if (marker <= 0) continue;
    const articleId = filename.slice(0, marker);
    const gallery = manualGalleryByArticle.get(articleId) ?? [];
    gallery.push(filename);
    manualGalleryByArticle.set(articleId, gallery);
  }
  for (const gallery of manualGalleryByArticle.values()) gallery.sort();

  const navigation = new Map(
    [
      ...(navigationPayload.entries ?? []),
      ...COMPENDIUM_GUIDE_NAVIGATION,
      ...COMPENDIUM_MOTEUR_V4_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_LORE_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_CORPORATIONS_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_NAVIGATION.filter(
        (entry) => corporationPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_REALITE_V9_PEGRE_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_PEGRE_PNJ_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_POLICE_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_POLICE_PNJ_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_GOVERNMENT_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_AGENCIES_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_AGENCIES_PNJ_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_CRAWLERS_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_NAVIGATION.filter(
        (entry) => crawlerPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_REALITE_V9_RELIGION_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_RELIGION_PNJ_NAVIGATION.map((entry) => ({
        ...entry,
        id: activeReligionPnjId(entry.id)
      })),
      ...COMPENDIUM_REALITE_V9_CHRISTIANITY_NAVIGATION,
      ...COMPENDIUM_REALITE_V9_RULE_NAVIGATION,
      ...COMPENDIUM_VERITE_V7_LORE_NAVIGATION,
      ...COMPENDIUM_VERITE_V7_RULE_NAVIGATION,
      ...COMPENDIUM_VERITE_V7_KHINAE_LORE_NAVIGATION,
      ...COMPENDIUM_VERITE_V7_KHINAE_RULE_NAVIGATION,
      ...COMPENDIUM_VERITE_V7_MAGE_NAVIGATION,
      ...COMPENDIUM_VERITE_LOGES_MAGES_PNJ_NAVIGATION.filter(
        (entry) => mageLogesPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_NAVIGATION.filter(
        (entry) => templesDaemoniaquesPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_VAMPIRE_COURTS_NAVIGATION,
      ...COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_NAVIGATION.filter((entry) => vampireCourtPnjResolvedIds.get(entry.id) === entry.id),
      ...COMPENDIUM_VERITE_PELAGES_NAVIGATION,
      ...COMPENDIUM_VERITE_PELAGES_PNJ_NAVIGATION.filter(
        (entry) => pelagePnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_V7_DAEMON_NAVIGATION,
      ...COMPENDIUM_VERITE_V7_ANGELUS_NAVIGATION,
      ...COMPENDIUM_VERITE_ANGELUS_NAVIGATION,
      ...COMPENDIUM_VERITE_ANGELUS_PNJ_NAVIGATION.filter(
        (entry) => angelusPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_V7_ASERYN_NAVIGATION,
      ...COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_NAVIGATION,
      ...COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_NAVIGATION.filter(
        (entry) => aserynTerresTemplesPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_GRANDS_EXILES_NAVIGATION,
      ...COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_NAVIGATION.filter(
        (entry) => grandsExilesPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_V7_PASS_B_NAVIGATION,
      ...COMPENDIUM_VERITE_HUNTERS_NAVIGATION,
      ...COMPENDIUM_VERITE_HUNTERS_PNJ_NAVIGATION.filter(
        (entry) => hunterPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_FLEAUX_NAVIGATION,
      ...COMPENDIUM_VERITE_FLEAUX_PNJ_NAVIGATION.filter(
        (entry) => fleauxPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_V7_PASS_B_RULE_NAVIGATION,
      ...COMPENDIUM_VERITE_SPECIES_LORE_NAVIGATION,
      ...COMPENDIUM_VERITE_SPECIES_PNJ_NAVIGATION,
      ...COMPENDIUM_VERITE_FANTASTIQUES_NAVIGATION,
      ...COMPENDIUM_VERITE_FANTASTIQUES_PNJ_NAVIGATION,
      ...COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION,
      ...COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION.filter(
        (entry) => extraterrestrialPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_GALACTIC_LORE_NAVIGATION,
      ...COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_NAVIGATION.filter(
        (entry) => extralsGroupsPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_NAVIGATION.filter(
        (entry) => humanGalacticPnjResolvedIds.get(entry.id) === entry.id
      ),
      ...generatedTalentHubs.navigation,
      ...generatedBuilderReferences.navigation
    ]
      .filter((entry) => entry?.id)
      .map((entry) => [entry.id, entry as NavigationEntry])
  );

  for (const article of byId.values()) {
    const manualImage = `${article.id}.webp`;
    const currentMedia = article.illustration ?? article.image;
    if (manualMediaFiles.has(manualImage) && (!currentMedia || isPlaceholderMedia(currentMedia))) {
      const media = {
        src: `images/manual/${manualImage}`,
        alt: article.title ?? article.id,
        caption: article.title ?? article.id
      };
      if (Object.prototype.hasOwnProperty.call(article, "illustration")) article.illustration = media;
      else article.image = media;
    }

    const gallery = (manualGalleryByArticle.get(article.id) ?? [])
      .map((filename) => ({
        src: `images/manual/${filename}`,
        alt: article.title ?? article.id,
        caption: filename
          .slice(article.id.length + 2, -5)
          .replace(/[-_]+/g, " ")
          .replace(/^./, (value) => value.toUpperCase())
      }));
    if (gallery.length) article.gallery = gallery;

    article.title = ARTICLE_TITLE_FIXES[article.id] ?? article.title;
    article.sourceCategory = article.sourceCategory ?? article.category;

    const navEntry = navigation.get(article.id);
    article.category = navEntry?.category ?? displayCategory(article);
    if (navEntry) {
      article.navigation = {
        group: navEntry.group ?? "",
        groupOrder: navEntry.groupOrder ?? 0,
        subgroup: navEntry.subgroup ?? "",
        subgroupOrder: navEntry.subgroupOrder ?? 0,
        pageOrder: navEntry.pageOrder ?? 0
      };
    }

    applyNavigationTaxonomy(article, navEntry);
    applyTargetedEditorialCorrections(article);
    article.manufacturer = manufacturerFor(article);
    article.__searchText = norm(flattenText(article));
  }

  const legacyRows = await pool.query<{ articleId: string }>(
    `SELECT article_id AS "articleId"
     FROM compendium_legacy_articles`
  );
  let legacyIds = new Set(legacyRows.rows.map((row) => row.articleId));

  // One-time cut-over: snapshot every article that exists at deployment time,
  // except Equipment and Bestiary. Future pages are not automatically archived.
  if (!legacyIds.size) {
    const initialLegacyIds = [...byId.values()]
      .filter((article) => !PROTECTED_REBUILD_CATEGORIES.has(String(article.category ?? "")))
      .filter((article) => article.rebuildV2 !== true)
      .map((article) => article.id);

    if (initialLegacyIds.length) {
      await pool.query(
        `INSERT INTO compendium_legacy_articles (article_id)
         SELECT unnest($1::text[])
         ON CONFLICT (article_id) DO NOTHING`,
        [initialLegacyIds]
      );
      legacyIds = new Set(initialLegacyIds);
    }
  }

  for (const article of byId.values()) {
    if (!legacyIds.has(article.id)) continue;
    if (article.rebuildV2 === true) continue;
    article.legacyCategory = article.category ?? "";
    article.category = LEGACY_CATEGORY;
    article.__legacy = true;
    article.__searchText = norm(flattenText(article));
  }

  const articles = [...byId.values()].sort(compareArticles);
  const publicArticles = articles.filter((article) => !isMjOnlyArticle(article)).map((article) => { const publicArticle=articleForAudience(article,false); publicArticle.__searchText=norm(flattenText(publicArticle)); return publicArticle; });
  const publicById = new Map(publicArticles.map((article) => [article.id, article]));
  const wikiIndexCompact = articles
    .filter((article) => article.category !== LEGACY_CATEGORY)
    .map((article) => {
      const navigation = article.navigation as JsonObject | undefined;
      return {
        id: article.id,
        title: article.title ?? article.id,
        category: article.category ?? "",
        dataset: article.dataset ?? "",
        group: navigation?.group ?? "",
        subgroup: navigation?.subgroup ?? "",
        manufacturer: String(article.manufacturer ?? "")
      };
    });

  const counts = new Map<string, number>();
  for (const article of articles) {
    if (article.category) counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }

  const categories = [
    ...CATEGORY_ORDER.filter((name) => counts.has(name)),
    ...[...counts.keys()].filter((name) => !CATEGORY_ORDER.includes(name)).sort((a, b) => a.localeCompare(b, "fr"))
  ].map((name) => ({ name, count: counts.get(name) ?? 0 }));

  const manufacturerCounts = new Map<string, number>();
  for (const article of articles) {
    const manufacturer = String(article.manufacturer ?? "");
    if (!manufacturer) continue;
    manufacturerCounts.set(manufacturer, (manufacturerCounts.get(manufacturer) ?? 0) + 1);
  }
  const manufacturers = [...manufacturerCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"));

  return {
    manifest,
    articles,
    publicArticles,
    byId,
    publicById,
    wikiIndexCompact,
    editorBaseById,
    navigation,
    categories,
    manufacturers,
    overrideSummary,
    databaseEditSummary: {
      applied: databaseEditApplied,
      conflicts: databaseEditConflicts
    }
  };
}

function getCorpus(): Promise<Corpus> {
  if (!corpusPromise) corpusPromise = loadCorpus();
  return corpusPromise;
}

export async function getCompendiumQualityCorpus() {
  const corpus = await getCorpus();
  return {
    articles: corpus.articles,
    publicArticles: corpus.publicArticles,
    navigationIds: [...corpus.navigation.keys()],
    databaseEditSummary: corpus.databaseEditSummary,
    overrideSummary: corpus.overrideSummary
  };
}

export async function preloadCompendium(): Promise<void> {
  const started = performance.now();
  const corpus = await getCorpus();
  const elapsed = Math.round(performance.now() - started);
  console.info(
    `Compendium preloaded: ${corpus.articles.length} articles in ${elapsed} ms`
  );
}

function navSort(article: Article): [number, number, number, string] {
  const navigation = article.navigation as JsonObject | undefined;
  return [
    Number(navigation?.groupOrder ?? 9999),
    Number(navigation?.subgroupOrder ?? 9999),
    Number(navigation?.pageOrder ?? 9999),
    article.title ?? article.id
  ];
}

function compareArticles(a: Article, b: Article): number {
  const left = navSort(a);
  const right = navSort(b);
  for (let index = 0; index < 3; index += 1) {
    const difference = Number(left[index]) - Number(right[index]);
    if (difference) return difference;
  }
  return String(left[3]).localeCompare(String(right[3]), "fr", {
    numeric: true,
    sensitivity: "base"
  });
}

function searchScore(article: Article, query: string): number {
  if (!query) return 0;
  const title = norm(article.title);
  const q = norm(query);
  let score = 0;
  if (title === q) score += 1000;
  else if (title.startsWith(q)) score += 500;
  else if (title.includes(q)) score += 250;

  const tags = norm((article.tags ?? []).join(" "));
  if (tags.includes(q)) score += 100;

  const navigation = article.navigation as JsonObject | undefined;
  if (norm(`${navigation?.group ?? ""} ${navigation?.subgroup ?? ""}`).includes(q)) score += 80;

  return score;
}

function searchItem(article: Article, query: string) {
  const navigation = article.navigation as JsonObject | undefined;
  return {
    id: article.id,
    title: article.title ?? article.id,
    category: article.category ?? "",
    dataset: article.dataset ?? "",
    source: article.source ?? "",
    status: article.status ?? "",
    group: navigation?.group ?? "",
    subgroup: navigation?.subgroup ?? "",
    tags: article.tags ?? [],
    manufacturer: String(article.manufacturer ?? ""),
    edited: Boolean(article.__editorialOverride),
    snippet: articleSnippet(article, query)
  };
}

async function loadUserLibrary(userId: string, corpus: Corpus, includeMj: boolean) {
  const [favoriteRows, collectionRows, itemRows, historyRows] = await Promise.all([
    pool.query<{ articleId: string }>(
      `SELECT article_id AS "articleId"
       FROM compendium_favorites
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    ),
    pool.query<{
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }>(
      `SELECT
         id,
         name,
         created_at::text AS "createdAt",
         updated_at::text AS "updatedAt"
       FROM compendium_collections
       WHERE owner_id = $1
       ORDER BY updated_at DESC, name ASC`,
      [userId]
    ),
    pool.query<{ collectionId: string; articleId: string }>(
      `SELECT
         i.collection_id AS "collectionId",
         i.article_id AS "articleId"
       FROM compendium_collection_items i
       JOIN compendium_collections c ON c.id = i.collection_id
       WHERE c.owner_id = $1
       ORDER BY i.created_at DESC`,
      [userId]
    ),
    pool.query<{ articleId: string; viewedAt: string; viewCount: number }>(
      `SELECT
         article_id AS "articleId",
         viewed_at::text AS "viewedAt",
         view_count AS "viewCount"
       FROM compendium_history
       WHERE user_id = $1
       ORDER BY viewed_at DESC
       LIMIT 50`,
      [userId]
    )
  ]);

  const visibleItem = (id: string) => {
    const article = corpus.byId.get(id);
    if (!article || article.category === LEGACY_CATEGORY) return null;
    return searchItem(articleForAudience(article, includeMj), "");
  };

  const favorites = favoriteRows.rows.map((row) => row.articleId);
  const favoriteItems = favorites
    .map(visibleItem)
    .filter((article): article is ReturnType<typeof searchItem> => Boolean(article));

  const idsByCollection = new Map<string, string[]>();
  for (const row of itemRows.rows) {
    const ids = idsByCollection.get(row.collectionId) ?? [];
    ids.push(row.articleId);
    idsByCollection.set(row.collectionId, ids);
  }

  const collections = collectionRows.rows.map((collection) => {
    const articleIds = idsByCollection.get(collection.id) ?? [];
    return {
      ...collection,
      articleIds,
      items: articleIds
        .map(visibleItem)
        .filter((article): article is ReturnType<typeof searchItem> => Boolean(article))
    };
  });

  const recentItems = historyRows.rows
    .map((row) => {
      const item = visibleItem(row.articleId);
      return item ? { ...item, viewedAt: row.viewedAt, viewCount: row.viewCount } : null;
    })
    .filter((item): item is ReturnType<typeof searchItem> & { viewedAt: string; viewCount: number } => Boolean(item));

  return { favorites, favoriteItems, collections, recentItems };
}

async function ownedCollection(collectionId: string, userId: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT 1
     FROM compendium_collections
     WHERE id = $1 AND owner_id = $2`,
    [collectionId, userId]
  );
  return Boolean(result.rowCount);
}

export async function registerCompendiumRoutes(app: FastifyInstance) {
  app.get("/api/compendium/meta", async (request) => {
    const corpus = await getCorpus();
    const user = await currentUser(request);
    const canAuditLegacy = isEditorRole(user?.role);
    const activeTotal = corpus.articles.filter((article) => article.category !== LEGACY_CATEGORY).length;
    const archivedTotal = corpus.articles.length - activeTotal;
    return {
      version: corpus.manifest.version,
      generated: corpus.manifest.generated ?? null,
      total: activeTotal,
      archivedTotal,
      expectedTotal: null,
      categories: corpus.categories.filter((entry) => entry.name !== LEGACY_CATEGORY || canAuditLegacy),
      manufacturers: corpus.manufacturers,
      overrides: corpus.overrideSummary,
      databaseEdits: corpus.databaseEditSummary
    };
  });

  app.get<{
    Querystring: { compact?: string };
  }>("/api/compendium/wiki-index", async (request) => {
    const corpus = await getCorpus();
    const user = await currentUser(request);
    const includeMj = canReadMj(user?.role);
    if (request.query.compact === "1") return { entries: includeMj ? corpus.wikiIndexCompact : corpus.wikiIndexCompact.filter((entry) => corpus.publicById.has(String(entry.id ?? ""))) };
    const articles = (includeMj ? corpus.articles : corpus.publicArticles)
      .filter((article) => article.category !== LEGACY_CATEGORY);
    return {
      entries: articles.map((article) => {
        const navigation = article.navigation as JsonObject | undefined;
        return {
          id: article.id,
          title: article.title ?? article.id,
          category: article.category ?? "",
          dataset: article.dataset ?? "",
          group: navigation?.group ?? "",
          subgroup: navigation?.subgroup ?? "",
          manufacturer: String(article.manufacturer ?? ""),
          snippet: wikiPreviewText(article),
          media: article.illustration ?? article.image ?? null
        };
      })
    };
  });

  app.get<{
    Params: { id: string };
  }>("/api/compendium/wiki-preview/:id", async (request, reply) => {
    const id = request.params.id.trim();
    if (!id || id.length > 240) return bad(reply, "invalid_compendium_article_id");

    const corpus = await getCorpus();
    const user = await currentUser(request);
    const includeMj = canReadMj(user?.role);
    const article = (includeMj ? corpus.byId : corpus.publicById).get(id);
    if (!article) return reply.code(404).send({ error: "compendium_article_not_found" });

    return {
      id: article.id,
      snippet: wikiPreviewText(article),
      media: article.illustration ?? article.image ?? null
    };
  });

  app.get<{
    Querystring: {
      q?: string;
      category?: string;
      dataset?: string;
      manufacturer?: string;
      limit?: string;
      offset?: string;
    };
  }>("/api/compendium/search", async (request) => {
    const corpus = await getCorpus();
    const user = await currentUser(request);
    const includeMj = canReadMj(user?.role);
    const query = String(request.query.q ?? "").trim();
    const normalizedQuery = norm(query);
    const category = String(request.query.category ?? "").trim();
    const dataset = String(request.query.dataset ?? "").trim();
    const manufacturer = String(request.query.manufacturer ?? "").trim();
    const limit = Math.min(100, Math.max(1, Number.parseInt(request.query.limit ?? "40", 10) || 40));
    const offset = Math.max(0, Number.parseInt(request.query.offset ?? "0", 10) || 0);
    const tokens = normalizedQuery.split(" ").filter(Boolean);

    const sourceArticles = includeMj ? corpus.articles : corpus.publicArticles;
    const canAuditLegacy = isEditorRole(user?.role);
    let rows =
      category === LEGACY_CATEGORY && canAuditLegacy
        ? sourceArticles.filter((article) => article.category === LEGACY_CATEGORY)
        : sourceArticles.filter((article) => article.category !== LEGACY_CATEGORY);

    if (category && category !== LEGACY_CATEGORY) {
      rows = rows.filter((article) => article.category === category);
    }
    if (category === LEGACY_CATEGORY && !canAuditLegacy) rows = [];
    if (dataset) rows = rows.filter((article) => article.dataset === dataset);
    if (manufacturer) {
      const normalizedManufacturer = norm(manufacturer);
      rows = rows.filter((article) => norm(article.manufacturer) === normalizedManufacturer);
    }
    if (tokens.length) {
      rows = rows.filter((article) => {
        const searchable = String(article.__searchText ?? "");
        return tokens.every((token) => searchable.includes(token));
      });
    }

    if (normalizedQuery) {
      rows = [...rows].sort((a, b) => {
        const scoreDifference = searchScore(b, query) - searchScore(a, query);
        return scoreDifference || compareArticles(a, b);
      });
    }

    const total = rows.length;
    return {
      q: query,
      category,
      dataset,
      manufacturer,
      total,
      offset,
      limit,
      items: rows.slice(offset, offset + limit).map((article) => searchItem(article, query))
    };
  });

  app.get("/api/compendium/onboarding", async () => {
    const corpus = await getCorpus();
    const exists = (id?: string) => {
      if (!id) return false;
      const article = corpus.byId.get(id);
      return Boolean(article && article.category !== LEGACY_CATEGORY);
    };
    const activeCategories = new Set(
      corpus.articles
        .filter((article) => article.category !== LEGACY_CATEGORY)
        .map((article) => String(article.category ?? ""))
        .filter(Boolean)
    );
    const sanitizeNature = (item: JsonObject) => {
      const rulesId = exists(String(item.rulesId ?? "")) ? String(item.rulesId) : undefined;
      const loreId = exists(String(item.loreId ?? "")) ? String(item.loreId) : undefined;
      return rulesId || loreId ? { ...deepClone(item), rulesId, loreId } : null;
    };
    return {
      ...deepClone(COMPENDIUM_PLAYER_START),
      basics: COMPENDIUM_PLAYER_START.basics.filter((item) => exists(item.id)),
      loreHubs: COMPENDIUM_PLAYER_START.loreHubs.filter((item) => exists(item.id)),
      natures: COMPENDIUM_PLAYER_START.natures
        .map((item) => sanitizeNature(item as JsonObject))
        .filter(Boolean),
      restricted: COMPENDIUM_PLAYER_START.restricted
        .map((item) => sanitizeNature(item as JsonObject))
        .filter(Boolean),
      categories: COMPENDIUM_PLAYER_START.categories
        .filter((item) => activeCategories.has(item.category)),
      available: {
        basics: COMPENDIUM_PLAYER_START.basics.filter((item) => exists(item.id)).map((item) => item.id),
        loreHubs: COMPENDIUM_PLAYER_START.loreHubs.filter((item) => exists(item.id)).map((item) => item.id)
      }
    };
  });

  app.get("/api/compendium/library", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const corpus = await getCorpus();
    return loadUserLibrary(user.id, corpus, canReadMj(user.role));
  });

  app.put<{
    Params: { id: string };
  }>("/api/compendium/history/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const id = request.params.id.trim();
    const corpus = await getCorpus();
    if (!id || id.length > 240 || !corpus.byId.has(id)) {
      return reply.code(404).send({ error: "compendium_article_not_found" });
    }

    await pool.query(
      `INSERT INTO compendium_history (user_id, article_id, viewed_at, view_count)
       VALUES ($1, $2, now(), 1)
       ON CONFLICT (user_id, article_id) DO UPDATE SET
         viewed_at = now(),
         view_count = compendium_history.view_count + 1`,
      [user.id, id]
    );

    await pool.query(
      `DELETE FROM compendium_history
       WHERE user_id = $1
         AND article_id NOT IN (
           SELECT article_id
           FROM compendium_history
           WHERE user_id = $1
           ORDER BY viewed_at DESC
           LIMIT 100
         )`,
      [user.id]
    );

    return { articleId: id, recorded: true };
  });

  app.delete("/api/compendium/history", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    await pool.query("DELETE FROM compendium_history WHERE user_id = $1", [user.id]);
    return { cleared: true };
  });

  app.put<{
    Params: { id: string };
  }>("/api/compendium/favorites/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const id = request.params.id.trim();
    const corpus = await getCorpus();
    if (!id || id.length > 240 || !corpus.byId.has(id)) {
      return reply.code(404).send({ error: "compendium_article_not_found" });
    }

    await pool.query(
      `INSERT INTO compendium_favorites (user_id, article_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, article_id) DO NOTHING`,
      [user.id, id]
    );

    return { articleId: id, favorite: true };
  });

  app.delete<{
    Params: { id: string };
  }>("/api/compendium/favorites/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const id = request.params.id.trim();
    if (!id || id.length > 240) return bad(reply, "invalid_compendium_article_id");

    await pool.query(
      `DELETE FROM compendium_favorites
       WHERE user_id = $1 AND article_id = $2`,
      [user.id, id]
    );

    return { articleId: id, favorite: false };
  });

  app.post<{
    Body: { name?: string };
  }>("/api/compendium/collections", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const name = request.body?.name?.trim();
    if (!validCollectionName(name)) return bad(reply, "invalid_collection_name");

    try {
      const result = await pool.query<{
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
      }>(
        `INSERT INTO compendium_collections (owner_id, name)
         VALUES ($1, $2)
         RETURNING
           id,
           name,
           created_at::text AS "createdAt",
           updated_at::text AS "updatedAt"`,
        [user.id, name]
      );
      return reply.code(201).send({
        collection: { ...result.rows[0], articleIds: [], items: [] }
      });
    } catch (cause: any) {
      if (cause?.code === "23505") {
        return reply.code(409).send({ error: "collection_name_conflict" });
      }
      throw cause;
    }
  });

  app.patch<{
    Params: { id: string };
    Body: { name?: string };
  }>("/api/compendium/collections/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_collection_id");
    const name = request.body?.name?.trim();
    if (!validCollectionName(name)) return bad(reply, "invalid_collection_name");

    try {
      const result = await pool.query<{
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
      }>(
        `UPDATE compendium_collections
         SET name = $1, updated_at = now()
         WHERE id = $2 AND owner_id = $3
         RETURNING
           id,
           name,
           created_at::text AS "createdAt",
           updated_at::text AS "updatedAt"`,
        [name, request.params.id, user.id]
      );

      if (!result.rows[0]) {
        return reply.code(404).send({ error: "collection_not_found" });
      }

      return { collection: result.rows[0] };
    } catch (cause: any) {
      if (cause?.code === "23505") {
        return reply.code(409).send({ error: "collection_name_conflict" });
      }
      throw cause;
    }
  });

  app.delete<{
    Params: { id: string };
  }>("/api/compendium/collections/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_collection_id");

    const result = await pool.query(
      `DELETE FROM compendium_collections
       WHERE id = $1 AND owner_id = $2
       RETURNING id`,
      [request.params.id, user.id]
    );

    if (!result.rowCount) {
      return reply.code(404).send({ error: "collection_not_found" });
    }

    return { deleted: true, id: request.params.id };
  });

  app.put<{
    Params: { collectionId: string; articleId: string };
  }>("/api/compendium/collections/:collectionId/articles/:articleId", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const { collectionId } = request.params;
    const articleId = request.params.articleId.trim();
    if (!UUID_RE.test(collectionId)) return bad(reply, "invalid_collection_id");

    const corpus = await getCorpus();
    if (!articleId || articleId.length > 240 || !corpus.byId.has(articleId)) {
      return reply.code(404).send({ error: "compendium_article_not_found" });
    }

    if (!(await ownedCollection(collectionId, user.id))) {
      return reply.code(404).send({ error: "collection_not_found" });
    }

    await pool.query(
      `INSERT INTO compendium_collection_items (collection_id, article_id)
       VALUES ($1, $2)
       ON CONFLICT (collection_id, article_id) DO NOTHING`,
      [collectionId, articleId]
    );
    await pool.query(
      `UPDATE compendium_collections
       SET updated_at = now()
       WHERE id = $1`,
      [collectionId]
    );

    return { collectionId, articleId, included: true };
  });

  app.delete<{
    Params: { collectionId: string; articleId: string };
  }>("/api/compendium/collections/:collectionId/articles/:articleId", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const { collectionId } = request.params;
    const articleId = request.params.articleId.trim();
    if (!UUID_RE.test(collectionId)) return bad(reply, "invalid_collection_id");

    if (!(await ownedCollection(collectionId, user.id))) {
      return reply.code(404).send({ error: "collection_not_found" });
    }

    await pool.query(
      `DELETE FROM compendium_collection_items
       WHERE collection_id = $1 AND article_id = $2`,
      [collectionId, articleId]
    );
    await pool.query(
      `UPDATE compendium_collections
       SET updated_at = now()
       WHERE id = $1`,
      [collectionId]
    );

    return { collectionId, articleId, included: false };
  });

  app.get<{
    Params: { "*": string };
  }>("/api/compendium/media/*", async (request, reply) => {
    const relative = safeMediaRelativePath(String(request.params["*"] ?? ""));
    if (!relative) return bad(reply, "invalid_compendium_media_path");

    try {
      const body = await readFile(resolve(COMPENDIUM_MEDIA_DIR, relative));
      reply.header("Content-Type", mediaContentType(relative));
      reply.header("Cache-Control", "private, max-age=86400");
      return reply.send(body);
    } catch {
      return reply.code(404).send({ error: "compendium_media_not_found" });
    }
  });

  app.get<{
    Params: { "*": string };
  }>("/api/compendium/uploads/*", async (request, reply) => {
    const filename = safeUploadFilename(String(request.params["*"] ?? ""));
    if (!filename) return bad(reply, "invalid_compendium_upload_path");

    try {
      const body = await readFile(resolve(COMPENDIUM_UPLOAD_DIR, filename));
      reply.header("Content-Type", mediaContentType(filename));
      reply.header("Cache-Control", "public, max-age=31536000, immutable");
      reply.header("X-Content-Type-Options", "nosniff");
      return reply.send(body);
    } catch {
      return reply.code(404).send({ error: "compendium_media_not_found" });
    }
  });

  app.post<{
    Params: { id: string };
    Body: {
      data?: string;
      slot?: "page" | "portrait";
    };
  }>(
    "/api/compendium/editor/articles/:id/media",
    { bodyLimit: 24 * 1024 * 1024 },
    async (request, reply) => {
      const user = await requireEditor(request, reply);
      if (!user) return;

      const id = String(request.params.id ?? "").trim();
      if (!id || id.length > 240) return bad(reply, "invalid_compendium_article_id");

      const corpus = await getCorpus();
      const article = await editorCurrentArticle(id, corpus);
      if (!article) {
        return reply.code(404).send({ error: "compendium_article_not_found" });
      }

      const slot = request.body?.slot === "portrait" ? "portrait" : "page";
      const encoded = String(request.body?.data ?? "").trim();
      if (!encoded) return bad(reply, "compendium_image_required");
      if (encoded.length > 21 * 1024 * 1024) {
        return reply.code(413).send({ error: "compendium_image_too_large" });
      }

      const data = Buffer.from(encoded, "base64");
      if (!data.length) return bad(reply, "invalid_compendium_image");
      if (data.length > 15 * 1024 * 1024) {
        return reply.code(413).send({ error: "compendium_image_too_large" });
      }

      const extension = uploadedImageExtension(data);
      if (!extension) return bad(reply, "unsupported_compendium_image");

      const safeId = id.replace(/[^a-zA-Z0-9_.-]+/g, "-").slice(0, 180);
      const token = randomBytes(5).toString("hex");
      const filename = `${safeId}--${slot}-${Date.now()}-${token}.${extension}`;

      await mkdir(COMPENDIUM_UPLOAD_DIR, { recursive: true });
      await writeFile(resolve(COMPENDIUM_UPLOAD_DIR, filename), data, { flag: "wx" });

      return reply.code(201).send({
        src: `/api/compendium/uploads/${filename}`,
        filename,
        slot,
        contentType: mediaContentType(filename),
        size: data.length
      });
    }
  );

  app.post<{
    Body: {
      title?: string;
      category?: string;
      source?: string;
      status?: string;
      tags?: string[];
    };
  }>("/api/compendium/editor/articles", async (request, reply) => {
    const user = await requireEditor(request, reply);
    if (!user) return;

    const title = String(request.body?.title ?? "").trim();
    const category = String(request.body?.category ?? "Réalité").trim() || "Réalité";
    const source = String(request.body?.source ?? "").trim();
    const status = String(request.body?.status ?? "canon_enrichi").trim() || "canon_enrichi";
    const tags = Array.isArray(request.body?.tags)
      ? request.body.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 100)
      : [];

    if (!title || title.length > 240) return bad(reply, "invalid_compendium_article_title");

    const slug = slugifyArticleTitle(title);
    if (!slug) return bad(reply, "invalid_compendium_article_title");

    const corpus = await getCorpus();
    let id = `wiki-${slug}`;
    let suffix = 2;
    while (
      corpus.byId.has(id) ||
      (await pool.query("SELECT 1 FROM compendium_custom_articles WHERE article_id = $1", [id])).rowCount
    ) {
      id = `wiki-${slug}-${suffix}`;
      suffix += 1;
    }

    const base: Article = {
      id,
      title,
      category,
      sourceCategory: category,
      dataset: "custom",
      source,
      status,
      tags,
      sections: []
    };
    const baseHash = articleHash(base);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO compendium_custom_articles
           (article_id, base_document, created_by)
         VALUES ($1, $2::jsonb, $3)`,
        [id, JSON.stringify(base), user.id]
      );
      await client.query(
        `INSERT INTO compendium_article_edits
           (article_id, base_hash, draft, draft_by, draft_updated_at, updated_at)
         VALUES ($1, $2, $3::jsonb, $4, now(), now())`,
        [id, baseHash, JSON.stringify(base), user.id]
      );
      await client.query("COMMIT");
    } catch (cause) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw cause;
    } finally {
      client.release();
    }

    return reply.code(201).send({ articleId: id, article: base });
  });

  app.get<{
    Params: { id: string };
  }>("/api/compendium/editor/articles/:id", async (request, reply) => {
    const user = await requireEditor(request, reply);
    if (!user) return;

    const id = request.params.id.trim();
    const corpus = await getCorpus();
    const article = await editorCurrentArticle(id, corpus);
    const base = await editorBaseFor(id, corpus);
    if (!article || !base) {
      return reply.code(404).send({ error: "compendium_article_not_found" });
    }

    const state = await pool.query<{
      baseHash: string;
      draft: Article | null;
      draftUpdatedAt: string | null;
      publishedAt: string | null;
    }>(
      `SELECT
         base_hash AS "baseHash",
         draft,
         draft_updated_at::text AS "draftUpdatedAt",
         published_at::text AS "publishedAt"
       FROM compendium_article_edits
       WHERE article_id = $1`,
      [id]
    );

    const row = state.rows[0] ?? null;
    const publicArticle = deepClone(article);
    delete publicArticle.__searchText;

    return {
      article: publicArticle,
      baseHash: base.hash,
      draft: row?.draft ?? null,
      draftUpdatedAt: row?.draftUpdatedAt ?? null,
      publishedAt: row?.publishedAt ?? null,
      conflict: Boolean(row && row.baseHash !== base.hash)
    };
  });

  app.put<{
    Params: { id: string };
    Body: { article?: Article };
  }>("/api/compendium/editor/articles/:id/draft", async (request, reply) => {
    const user = await requireEditor(request, reply);
    if (!user) return;

    const id = request.params.id.trim();
    const corpus = await getCorpus();
    const current = await editorCurrentArticle(id, corpus);
    const base = await editorBaseFor(id, corpus);
    if (!current || !base) {
      return reply.code(404).send({ error: "compendium_article_not_found" });
    }

    if (!validEditableArticle(request.body?.article)) {
      return bad(reply, "invalid_compendium_article");
    }

    const draft = editableArticle(current, request.body.article);
    await pool.query(
      `INSERT INTO compendium_article_edits
         (article_id, base_hash, draft, draft_by, draft_updated_at, updated_at)
       VALUES ($1, $2, $3::jsonb, $4, now(), now())
       ON CONFLICT (article_id) DO UPDATE SET
         base_hash = EXCLUDED.base_hash,
         draft = EXCLUDED.draft,
         draft_by = EXCLUDED.draft_by,
         draft_updated_at = now(),
         updated_at = now()`,
      [id, base.hash, JSON.stringify(draft), user.id]
    );

    return { articleId: id, draft, saved: true };
  });

  app.delete<{
    Params: { id: string };
  }>("/api/compendium/editor/articles/:id/draft", async (request, reply) => {
    const user = await requireEditor(request, reply);
    if (!user) return;

    const id = request.params.id.trim();
    await pool.query(
      `UPDATE compendium_article_edits
       SET draft = NULL,
           draft_by = NULL,
           draft_updated_at = NULL,
           updated_at = now()
       WHERE article_id = $1`,
      [id]
    );
    return { articleId: id, draft: null };
  });

  app.post<{
    Params: { id: string };
  }>("/api/compendium/editor/articles/:id/publish", async (request, reply) => {
    const user = await requireEditor(request, reply);
    if (!user) return;

    const id = request.params.id.trim();
    const corpus = await getCorpus();
    const base = await editorBaseFor(id, corpus);
    if (!base) return reply.code(404).send({ error: "compendium_article_not_found" });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const state = await client.query<{
        baseHash: string;
        draft: Article | null;
      }>(
        `SELECT base_hash AS "baseHash", draft
         FROM compendium_article_edits
         WHERE article_id = $1
         FOR UPDATE`,
        [id]
      );
      const row = state.rows[0];
      if (!row?.draft) {
        await client.query("ROLLBACK");
        return reply.code(409).send({ error: "compendium_draft_required" });
      }
      if (row.baseHash !== base.hash) {
        await client.query("ROLLBACK");
        return reply.code(409).send({ error: "compendium_source_changed" });
      }

      await client.query(
        `INSERT INTO compendium_article_edit_revisions
           (article_id, base_hash, document, published_by)
         VALUES ($1, $2, $3::jsonb, $4)`,
        [id, base.hash, JSON.stringify(row.draft), user.id]
      );

      await client.query(
        `UPDATE compendium_article_edits
         SET published = draft,
             published_by = $2,
             published_at = now(),
             draft = NULL,
             draft_by = NULL,
             draft_updated_at = NULL,
             updated_at = now()
         WHERE article_id = $1`,
        [id, user.id]
      );
      await client.query(
        `UPDATE compendium_custom_articles
         SET is_published = true,
             published_at = COALESCE(published_at, now()),
             updated_at = now()
         WHERE article_id = $1`,
        [id]
      );
      await client.query("COMMIT");
    } catch (cause) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw cause;
    } finally {
      client.release();
    }

    corpusPromise = null;
    const refreshed = await getCorpus();
    const article = refreshed.byId.get(id);
    if (!article) return reply.code(404).send({ error: "compendium_article_not_found" });
    const result = deepClone(article);
    delete result.__searchText;
    return { article: result, published: true };
  });

  app.get<{
    Params: { id: string };
  }>("/api/compendium/articles/:id", async (request, reply) => {
    const id = request.params.id.trim();
    if (!id || id.length > 240) return bad(reply, "invalid_compendium_article_id");

    const corpus = await getCorpus();
    const user = await currentUser(request);
    const includeMj = canReadMj(user?.role);
    const article = (includeMj ? corpus.byId : corpus.publicById).get(id);
    if (!article) {
      return reply.code(404).send({ error: "compendium_article_not_found" });
    }

    if (!includeMj) {
      const { __searchText: _searchText, ...publicArticle } = article;
      return { article: publicArticle };
    }
    return { article: articleForAudience(article, true) };
  });
}
