import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";

type RawSection = { title?: string; paragraphs?: string[] };
type RawPage = {
  id: string;
  title: string;
  nav?: Record<string, any>;
  sections?: RawSection[];
};
type RawEnrichment = {
  dataset?: string;
  id: string;
  replaceSections?: string[];
  sections?: RawSection[];
};
type HunterSource = {
  schemaVersion?: number;
  sourceDocument?: string;
  newPages?: RawPage[];
  enrichments?: RawEnrichment[];
};

const PREFIX = "truth-lore-hunters-2026-09-v1-";
const PARTS = 9;
const SOURCE_DIR =
  process.env.HUNTER_LORE_SOURCE_DIR ??
  (process.env.NODE_ENV === "production"
    ? "/app/rules-data/hunters"
    : fileURLToPath(new URL("../../../compendium/source/", import.meta.url)));

const encoded = Array.from({ length: PARTS }, (_, index) => {
  const filename = `${PREFIX}${String(index).padStart(2, "0")}.b64part`;
  return readFileSync(resolve(SOURCE_DIR, filename), "utf8").replace(/\s+/g, "");
}).join("");

const source = JSON.parse(
  gunzipSync(Buffer.from(encoded, "base64")).toString("utf8")
) as HunterSource;

if (
  source.schemaVersion !== 1 ||
  source.sourceDocument !== "TUC_Vérité_ les chasseurs(1).docx" ||
  source.newPages?.length !== 8 ||
  source.enrichments?.length !== 19
) {
  throw new Error(
    `Source Chasseurs 2026-09 invalide: pages=${source.newPages?.length ?? 0}, enrichissements=${source.enrichments?.length ?? 0}`
  );
}

const norm = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const slug = (value: unknown) => norm(value).replace(/\s+/g, "-") || "section";

const sectionFrom = (raw: RawSection) => ({
  id: slug(raw.title),
  title: String(raw.title ?? "Section"),
  level: 2,
  blocks: (raw.paragraphs ?? [])
    .map((text) => String(text ?? "").trim())
    .filter(Boolean)
    .map((text) => ({ type: "p", style: "lore", text }))
});

export const COMPENDIUM_VERITE_HUNTERS_SOURCE = String(source.sourceDocument);

export const COMPENDIUM_VERITE_HUNTERS_ARTICLES = (source.newPages ?? []).map((item) => ({
  id: item.id,
  dataset: "verite-hunters-2026-09",
  category: "Vérité",
  sourceCategory: "Vérité",
  title: item.title,
  source: source.sourceDocument,
  status: "canon_recent",
  rebuildV2: true,
  tags: ["Vérité", "Chasseurs", "Traditions de Chasse", "Lore Chasseurs 2026-09"],
  sections: (item.sections ?? []).map(sectionFrom)
})) as Array<Record<string, any>>;

export const COMPENDIUM_VERITE_HUNTERS_ENRICHMENTS = (source.enrichments ?? []).map((item) => ({
  ...item,
  sections: (item.sections ?? []).map(sectionFrom)
})) as Array<Record<string, any>>;

export const COMPENDIUM_VERITE_HUNTERS_NAVIGATION = (source.newPages ?? []).map((item, index) => ({
  ...(item.nav ?? {}),
  id: item.id,
  dataset: "verite-hunters-2026-09",
  category: "Vérité",
  group: item.nav?.group ?? "Chasseurs & traditions",
  groupOrder: item.nav?.groupOrder ?? 50,
  subgroup: item.nav?.subgroup ?? "Traditions et réseaux",
  subgroupOrder: item.nav?.subgroupOrder ?? 20,
  pageOrder: item.nav?.pageOrder ?? index + 1,
  displayTitle: item.nav?.displayTitle ?? item.title
})) as Array<Record<string, any>>;
