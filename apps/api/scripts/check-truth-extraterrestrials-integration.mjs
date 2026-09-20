import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS,
  COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION
} from "../dist/compendium-verite-extraterrestres-lore.js";
import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION
} from "../dist/compendium-verite-extraterrestres-pnj.js";
import { COMPENDIUM_REALITE_V9_PEGRE_PNJ_ARTICLES } from "../dist/compendium-realite-v9-pegre-pnj.js";
import { COMPENDIUM_REALITE_V9_POLICE_PNJ_ARTICLES } from "../dist/compendium-realite-v9-police-pnj.js";
import { COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ARTICLES } from "../dist/compendium-realite-v9-government-pnj.js";
import { COMPENDIUM_REALITE_V9_RELIGION_PNJ_ARTICLES } from "../dist/compendium-realite-v9-religion-pnj.js";
import { COMPENDIUM_REALITE_V9_CHRISTIANITY_ARTICLES } from "../dist/compendium-realite-v9-christianity.js";
import { COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES } from "../dist/compendium-verite-species-pnj.js";
import { COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES } from "../dist/compendium-verite-fantastiques-pnj.js";
import { truthCatalogExtral } from "../dist/rules/truth/catalog-extral.js";

const norm = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9']+/g, " ")
    .trim();

const usable = (value) => {
  const key = norm(value);
  return key && key !== "?" && key !== "_" && key.length >= 4 ? key : null;
};

const identityKeys = (article) => {
  const keys = new Set();
  const add = (value) => {
    const key = usable(value);
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
        const label = norm(row[0]);
        if (label.includes("nom de la realite") || label.includes("nom de la verite") || label === "nom" || label.includes("identite")) add(row[1]);
      }
    }
  }
  return keys;
};

assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES.length, 7, "7 dedicated extraterrestrial lore pages expected");
assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION.length, 7, "Every dedicated lore page needs navigation");
assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS.length, 3, "Hub, Ad'rak and chronology enrichments expected");

assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.length, 62, "62 source PNJs expected");
assert.equal(new Set(COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.map((article) => article.id)).size, 62, "PNJ ids must be unique");
assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION.length, 62, "Every source PNJ needs source navigation");

const expectedGroups = new Map([
  ["Talass", 10],
  ["Mo’sens", 10],
  ["Baséanhs", 10],
  ["Rocréens", 10],
  ["Thalsios", 10],
  ["Autres", 12]
]);
for (const [group, expected] of expectedGroups) {
  assert.equal(
    COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.filter((article) => article.pnj?.source_group === group).length,
    expected,
    `${group}: expected ${expected} PNJs`
  );
}

for (const article of COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES) {
  const mj = article.sections?.find((section) => section.id === "informations-mj");
  const stats = article.sections?.find((section) => section.id === "statistiques");
  assert.ok(mj && mj.audience === "mj", `${article.id}: MJ block missing/restricted incorrectly`);
  assert.ok((mj.blocks ?? []).length > 0, `${article.id}: source Truth information must fill MJ block`);
  const expectedTruth = (article.pnj?.source_verite ?? [])
    .map((entry) => String(entry?.text ?? ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const renderedTruth = (mj.blocks ?? [])
    .map((block) => String(block?.text ?? ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  assert.equal(renderedTruth, expectedTruth, `${article.id}: MJ block must reproduce the complete source Truth text`);
  assert.ok(stats && stats.audience === "mj", `${article.id}: statistics block missing/restricted incorrectly`);
  assert.deepEqual(stats.blocks, [], `${article.id}: statistics stay empty until consolidation`);
  assert.ok(Array.isArray(article.pnj?.identity_keys) && article.pnj.identity_keys.length >= 1, `${article.id}: identity keys missing`);
  assert.ok(String(article.pnj?.source_extract ?? "").length > 0, `${article.id}: full source extract missing`);
}

const activeOtherPnjs = [
  ...COMPENDIUM_REALITE_V9_PEGRE_PNJ_ARTICLES,
  ...COMPENDIUM_REALITE_V9_POLICE_PNJ_ARTICLES,
  ...COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ARTICLES,
  ...COMPENDIUM_REALITE_V9_RELIGION_PNJ_ARTICLES,
  ...COMPENDIUM_REALITE_V9_CHRISTIANITY_ARTICLES.filter((article) => article.category === "Personnages"),
  ...COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES,
  ...COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES
];

const mergeMatches = [];
for (const source of COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES) {
  const real = usable(source.pnj?.real_name);
  const truth = usable(source.pnj?.nom_verite);
  const matches = activeOtherPnjs.filter((candidate) => {
    const keys = identityKeys(candidate);
    return (truth && keys.has(truth)) || (real && keys.has(real));
  });
  assert.ok(matches.length <= 1, `${source.title}: ambiguous cross-document identity: ${matches.map((item) => item.id).join(", ")}`);
  if (matches.length === 1) mergeMatches.push([source.title, matches[0].id]);
}

for (const species of ["Talass", "Mo’sen", "Baséanh", "Rocréen", "Thalsios"]) {
  assert.ok(
    truthCatalogExtral.some((talent) => String(talent.group ?? "").startsWith(species)),
    `${species}: Builder Extral mechanical catalog missing`
  );
}

console.log(
  `TRUTH EXTRATERRESTRIALS OK — 7 pages lore · 62/62 PNJ · 10/10/10/10/10/12 · 62 MJ alimentés · 62 stats vides · ${mergeMatches.length} fusion(s) inter-doc détectée(s)`
);
for (const [source, target] of mergeMatches) console.log(`MERGE PNJ — ${source} -> ${target}`);
