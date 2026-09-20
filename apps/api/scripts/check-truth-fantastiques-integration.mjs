import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_FANTASTIQUES_PNJ_NAVIGATION
} from "../dist/compendium-verite-fantastiques-pnj.js";
import {
  COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES,
  COMPENDIUM_VERITE_FANTASTIQUES_NAVIGATION,
  COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS
} from "../dist/compendium-verite-fantastiques-lore.js";

const expectedGroups = new Map([
  ["Elyë", 8],
  ["Whurtens", 8],
  ["Ashylls", 8],
  ["Thulkars", 8],
  ["Azménoriens", 8],
  ["Nareysvors", 3],
  ["Autres créatures", 9]
]);

assert.equal(COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES.length, 52, "Fantastic species source must expose 52 active PNJs");
assert.equal(new Set(COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES.map((article) => article.id)).size, 52, "Fantastic species PNJ ids must be unique");
assert.equal(COMPENDIUM_VERITE_FANTASTIQUES_PNJ_NAVIGATION.length, 52, "Every fantastic species PNJ needs navigation");

for (const [group, expected] of expectedGroups) {
  const rows = COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES.filter((article) => article.pnj?.source_group === group);
  assert.equal(rows.length, expected, `${group}: expected ${expected} PNJs`);
}

let withMj = 0;
let withoutMj = 0;

for (const article of COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES) {
  assert.equal(article.category, "Personnages", `${article.id}: PNJ must remain active in Personnages`);
  assert.equal(article.dataset, "verite-fantastiques-pnj", `${article.id}: wrong dataset`);

  const mj = article.sections?.find((section) => section.id === "informations-mj");
  const stats = article.sections?.find((section) => section.id === "statistiques");
  assert.ok(mj, `${article.id}: missing MJ block`);
  assert.ok(stats, `${article.id}: missing statistics block`);
  assert.equal(mj.audience, "mj", `${article.id}: MJ block must be restricted`);
  assert.equal(stats.audience, "mj", `${article.id}: statistics block must be restricted`);
  assert.deepEqual(stats.blocks, [], `${article.id}: statistics must remain empty until consolidation`);

  const truth = Array.isArray(article.pnj?.source_verite) ? article.pnj.source_verite : [];
  const expectedTexts = truth
    .map((entry, index) =>
      truth.length > 1
        ? `${String(entry.label || "Informations Vérité")} ${index + 1}\n\n${String(entry.text || "")}`
        : String(entry.text || "")
    )
    .filter(Boolean);

  assert.deepEqual(
    (mj.blocks ?? []).map((block) => String(block.text ?? "")),
    expectedTexts,
    `${article.id}: MJ blocks must reproduce the preserved secret source`
  );

  if (expectedTexts.length) withMj += 1;
  else withoutMj += 1;

  assert.ok(String(article.pnj?.source_extract ?? "").length > 0, `${article.id}: source extract must be preserved`);
}

assert.equal(withMj, 51, "51 PNJs must have source-derived MJ information");
assert.equal(withoutMj, 1, "Exactly one PNJ has no source-derived MJ information");
assert.equal(
  COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES.find((article) => article.title === "Katell O’Dalaigh")
    ?.sections?.find((section) => section.id === "informations-mj")?.blocks?.length,
  0,
  "Katell O’Dalaigh is the only source profile without Truth/MJ narrative"
);

const lolita = COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES.find((article) => article.title === "Lolitasex666-allholes");
assert.ok(lolita, "Lolitasex666-allholes profile must exist");
assert.ok(
  (lolita.sections?.find((section) => section.id === "informations-mj")?.blocks?.length ?? 0) > 0,
  "The legacy generic Informations block must be protected as MJ material"
);

const frazier = COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES.find((article) => article.title === "King Frazier");
assert.equal(frazier?.pnj?.race, "Nains", "Keep the source Ethnie réelle anomaly for King Frazier instead of silently correcting it");

assert.equal(COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES.length, 1, "One dedicated Dragons/rare Aèr peoples article is expected");
assert.equal(COMPENDIUM_VERITE_FANTASTIQUES_NAVIGATION.length, 1, "Dedicated fantastic lore page needs navigation");
assert.equal(COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS.length, 2, "Chronology and Exiles V7 pages must receive enrichments");
assert.ok(
  COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS.some((row) => row.targetId === "verite-v7-exiles-peuples-silcenters-traditions"),
  "Missing Exiles V7 enrichment"
);
assert.ok(
  COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS.some((row) => row.targetId === "verite-v7-cycle-neant-ombremonde-histoire-cachee"),
  "Missing hidden-history chronology enrichment"
);

console.log(
  "TRUTH FANTASTIC SPECIES OK — 52/52 PNJ · 8/8/8/8/8/3/9 groupes · 51 MJ alimentés · 1 MJ vide · 52 stats vides · Dragons/peuples rares intégrés"
);
