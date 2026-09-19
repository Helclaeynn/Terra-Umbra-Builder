import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import type { FastifyInstance, FastifyReply } from "fastify";
import { requireUser } from "./auth.js";
import { pool } from "./db.js";

type JsonObject = Record<string, any>;
type Article = JsonObject & {
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
  byId: Map<string, Article>;
  editorBaseById: Map<string, { hash: string; article: Article }>;
  navigation: Map<string, NavigationEntry>;
  categories: Array<{ name: string; count: number }>;
  manufacturers: Array<{ name: string; count: number }>;
  overrideSummary: { applied: number; conflicts: number; missing: number };
  databaseEditSummary: { applied: number; conflicts: number };
};

const CATEGORY_ORDER = [
  "Règles",
  "Réalité",
  "Vérité",
  "Équipement & Objets",
  "Personnages",
  "Bestiaire"
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

function bad(reply: FastifyReply, error: string) {
  return reply.code(400).send({ error });
}

function deepClone<T>(value: T): T {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value)) as T;
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
      if (block?.type === "p") bits.push(String(block.text ?? ""));
      if (block?.type === "table" && Array.isArray(block.rows)) {
        for (const row of block.rows) {
          if (Array.isArray(row)) bits.push(...row.map((cell) => String(cell ?? "")));
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
      if (block?.type === "p" && String(block.text ?? "").trim()) {
        chunks.push(String(block.text).trim());
      }
      if (chunks.join(" ").length >= limit * 1.4) break;
    }

    if (chunks.join(" ").length >= limit * 1.4) break;
  }

  const text = (chunks.join(" ") || articleSnippet(article, "", limit))
    .replace(/\s+/g, " ")
    .trim();

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

  const overrideSummary = await applyCommittedOverrides(byId, overridePayload);

  const customArticles = await pool.query<{ articleId: string; baseDocument: Article }>(
    `SELECT article_id AS "articleId", base_document AS "baseDocument"
     FROM compendium_custom_articles
     WHERE is_published = true`
  );
  for (const row of customArticles.rows) {
    if (!row.baseDocument?.id || byId.has(row.articleId)) continue;
    const article = deepClone(row.baseDocument);
    article.dataset = "custom";
    article.__customWikiPage = true;
    byId.set(row.articleId, article);
  }

  const editorBaseById = new Map<string, { hash: string; article: Article }>();
  for (const [id, article] of byId) {
    editorBaseById.set(id, { hash: articleHash(article), article: deepClone(article) });
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

  const navigation = new Map(
    (navigationPayload.entries ?? []).filter((entry) => entry?.id).map((entry) => [entry.id, entry])
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

    const gallery = [...manualMediaFiles]
      .filter((filename) => filename.startsWith(`${article.id}--`) && filename.endsWith(".webp"))
      .sort()
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

  const articles = [...byId.values()];
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
    byId,
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

async function loadUserLibrary(userId: string, corpus: Corpus) {
  const [favoriteRows, collectionRows, itemRows] = await Promise.all([
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
    )
  ]);

  const favorites = favoriteRows.rows.map((row) => row.articleId);
  const favoriteItems = favorites
    .map((id) => corpus.byId.get(id))
    .filter((article): article is Article => Boolean(article))
    .map((article) => searchItem(article, ""));

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
        .map((id) => corpus.byId.get(id))
        .filter((article): article is Article => Boolean(article))
        .map((article) => searchItem(article, ""))
    };
  });

  return { favorites, favoriteItems, collections };
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
  app.get("/api/compendium/meta", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const corpus = await getCorpus();
    return {
      version: corpus.manifest.version,
      generated: corpus.manifest.generated ?? null,
      total: corpus.articles.length,
      expectedTotal: corpus.manifest.expectedTotal ?? null,
      categories: corpus.categories,
      manufacturers: corpus.manufacturers,
      overrides: corpus.overrideSummary,
      databaseEdits: corpus.databaseEditSummary
    };
  });

  app.get("/api/compendium/wiki-index", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const corpus = await getCorpus();
    return {
      entries: corpus.articles.map((article) => {
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
    Querystring: {
      q?: string;
      category?: string;
      dataset?: string;
      manufacturer?: string;
      limit?: string;
      offset?: string;
    };
  }>("/api/compendium/search", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const corpus = await getCorpus();
    const query = String(request.query.q ?? "").trim();
    const normalizedQuery = norm(query);
    const category = String(request.query.category ?? "").trim();
    const dataset = String(request.query.dataset ?? "").trim();
    const manufacturer = String(request.query.manufacturer ?? "").trim();
    const limit = Math.min(100, Math.max(1, Number.parseInt(request.query.limit ?? "40", 10) || 40));
    const offset = Math.max(0, Number.parseInt(request.query.offset ?? "0", 10) || 0);
    const tokens = normalizedQuery.split(" ").filter(Boolean);

    let rows = corpus.articles.filter((article) => {
      if (category && article.category !== category) return false;
      if (dataset && article.dataset !== dataset) return false;
      if (manufacturer && norm(article.manufacturer) !== norm(manufacturer)) return false;
      if (tokens.length && !tokens.every((token) => String(article.__searchText ?? "").includes(token))) {
        return false;
      }
      return true;
    });

    if (normalizedQuery) {
      rows = rows.sort((a, b) => {
        const scoreDifference = searchScore(b, query) - searchScore(a, query);
        return scoreDifference || compareArticles(a, b);
      });
    } else {
      rows = rows.sort(compareArticles);
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

  app.get("/api/compendium/library", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const corpus = await getCorpus();
    return loadUserLibrary(user.id, corpus);
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
    const user = await requireUser(request, reply);
    if (!user) return;

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
    const user = await requireUser(request, reply);
    if (!user) return;

    const id = request.params.id.trim();
    if (!id || id.length > 240) return bad(reply, "invalid_compendium_article_id");

    const corpus = await getCorpus();
    const article = corpus.byId.get(id);
    if (!article) {
      return reply.code(404).send({ error: "compendium_article_not_found" });
    }

    const result = deepClone(article);
    delete result.__searchText;
    return { article: result };
  });
}
