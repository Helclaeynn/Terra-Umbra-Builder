import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_SPECIES_PNJ_NAVIGATION
} from "../dist/compendium-verite-species-pnj.js";
import {
  COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES,
  COMPENDIUM_VERITE_SPECIES_LORE_NAVIGATION,
  COMPENDIUM_VERITE_SPECIES_ENRICHMENTS
} from "../dist/compendium-verite-species-lore.js";

const expectedGroups = new Map([
  ["Vampires", 7],
  ["Loups-garous", 8],
  ["Mages", 8],
  ["Atlantes", 8],
  ["Daemons", 13],
  ["Angelus", 12],
  ["Autres créatures", 12]
]);

assert.equal(COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES.length, 68, "The detailed source must expose 68 active Truth PNJs");
assert.equal(new Set(COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES.map((article) => article.id)).size, 68, "Truth species PNJ ids must be unique");
assert.equal(COMPENDIUM_VERITE_SPECIES_PNJ_NAVIGATION.length, 68, "Every Truth species PNJ needs navigation");

for (const [group, expected] of expectedGroups) {
  const rows = COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES.filter((article) => article.pnj?.source_group === group);
  assert.equal(rows.length, expected, `${group}: expected ${expected} active PNJs`);
}

for (const article of COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES) {
  assert.equal(article.category, "Personnages", `${article.id}: active PNJ must be in Personnages`);
  assert.equal(article.dataset, "verite-species-pnj", `${article.id}: wrong dataset`);
  assert.ok(!/\(modifi[eé]\)/i.test(article.title), `${article.id}: source revision note leaked into canonical title`);

  const mj = article.sections?.find((section) => section.id === "informations-mj");
  const stats = article.sections?.find((section) => section.id === "statistiques");
  assert.ok(mj, `${article.id}: missing MJ block`);
  assert.ok(stats, `${article.id}: missing statistics block`);
  assert.equal(mj.audience, "mj", `${article.id}: MJ block must be restricted`);
  assert.equal(stats.audience, "mj", `${article.id}: statistics block must be restricted`);
  assert.deepEqual(stats.blocks, [], `${article.id}: statistics block must remain empty until consolidation`);

  assert.ok(Array.isArray(article.pnj?.source_verite), `${article.id}: missing preserved Truth source`);
  const truthSections = article.pnj.source_verite;
  const expectedMjTexts = truthSections
    .map((entry, index) =>
      truthSections.length > 1
        ? `${String(entry.label || `Informations Vérité ${index + 1}`)}\n\n${String(entry.text || "")}`
        : String(entry.text || "")
    )
    .filter(Boolean);
  assert.deepEqual(
    (mj.blocks ?? []).map((block) => String(block.text ?? "")),
    expectedMjTexts,
    `${article.id}: MJ block must reproduce all source Informations Vérité sections`
  );
  assert.ok(String(article.pnj?.source_extract ?? "").length > 0, `${article.id}: missing complete source extract`);
}

assert.equal(COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES.length, 4, "Four dedicated Other Creatures lore pages are expected");
assert.equal(COMPENDIUM_VERITE_SPECIES_LORE_NAVIGATION.length, 4, "Every Other Creatures lore page needs navigation");
assert.equal(new Set(COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES.map((article) => article.id)).size, 4, "Other Creatures lore ids must be unique");

const loreIds = new Set(COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES.map((article) => article.id));
for (const expected of [
  "verite-especes-creatures-ombres",
  "verite-especes-creatures-revenants",
  "verite-especes-creatures-fees",
  "verite-especes-creatures-abominations"
]) {
  assert.ok(loreIds.has(expected), `Missing lore page ${expected}`);
}

assert.equal(COMPENDIUM_VERITE_SPECIES_ENRICHMENTS.length, 2, "Vampire and Garou V7 pages receive source-specific enrichment");
assert.ok(
  COMPENDIUM_VERITE_SPECIES_ENRICHMENTS.some((row) => row.targetId === "verite-v7-vampires-civilisation-cours-sangs"),
  "Missing Vampire enrichment"
);
assert.ok(
  COMPENDIUM_VERITE_SPECIES_ENRICHMENTS.some((row) => row.targetId === "verite-v7-garous-khinae-meutes-pelages"),
  "Missing Garou enrichment"
);

const withTruth = COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES.filter((article) => article.pnj?.source_verite?.length).length;
const withoutTruth = COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES.length - withTruth;

console.log(
  `TRUTH SPECIES INTEGRATION OK — 68/68 PNJ · 7/8/8/8/13/12/12 groupes · 4/4 pages Créatures · ${withTruth} blocs MJ alimentés · ${withoutTruth} sans Vérité source · stats vides`
);
