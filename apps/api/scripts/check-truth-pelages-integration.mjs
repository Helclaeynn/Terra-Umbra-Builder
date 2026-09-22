import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_PELAGES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_PELAGES_PNJ_NAVIGATION
} from "../dist/compendium-verite-pelages-pnj.js";

const articles = COMPENDIUM_VERITE_PELAGES_PNJ_ARTICLES;
assert.equal(articles.length, 28, "28 Pelage PNJ expected");
assert.equal(new Set(articles.map((article) => article.id)).size, 28, "Pelage PNJ ids must be unique");
assert.equal(COMPENDIUM_VERITE_PELAGES_PNJ_NAVIGATION.length, 28, "Every Pelage PNJ needs navigation");

const occultPublic = /\b(?:loups?-garous?|garous?|lycanthropes?|pelages?|meutes?|alphas?|meneurs?)\b|Thorunn|Talatuwa|Ascanius|Lycovicus|Kadriye|Inukami|Khaashtay/i;
const completed = new Set([
  "personnages-verite-pelages-benedicte-vilhelmsen",
  "personnages-verite-pelages-tsvetomir-nickolov",
  "personnages-verite-pelages-sikya-hawkins",
  "personnages-verite-pelages-juan-martin-reyes",
  "personnages-verite-pelages-nathan-chappelle",
  "personnages-verite-pelages-josefin-drescher",
  "personnages-verite-pelages-chamunda-dhavale",
  "personnages-verite-pelages-diana-buck",
  "personnages-verite-pelages-shingen-inukawa",
  "personnages-verite-pelages-tishandra-debrun",
  "personnages-verite-pelages-john-sandrock",
  "personnages-verite-pelages-cynthea-marraniro",
  "personnages-verite-pelages-tokala",
  "personnages-verite-pelages-jacob-delisle"
]);

for (const article of articles) {
  assert.equal(article.pnj?.protect_truth_metadata, true, `${article.id}: Truth metadata protection missing`);
  assert.equal(article.pnj?.source_designation, undefined, `${article.id}: cross-page designation remains active`);
  assert.ok(
    !(article.pnj?.identity_keys ?? []).some((key) => String(key).length > 80 || /[.!?]\s/.test(String(key))),
    `${article.id}: polluted identity key`
  );
  const truth = article.sections?.find((section) => section.id === "pelages-verite");
  assert.equal(truth?.audience, "mj", `${article.id}: Truth biography must be MJ-only`);
  assert.ok((truth?.blocks ?? []).some((block) => typeof block?.text === "string" && block.text.trim()), `${article.id}: missing Truth biography`);

  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (typeof block?.text !== "string" || !block.text.trim()) continue;
      assert.match(block.text.trim(), /[.!?…»)]$/, `${article.id}/${section.id}: truncated active paragraph`);
      if (section.audience !== "mj") assert.doesNotMatch(block.text, occultPublic, `${article.id}/${section.id}: occult term leaked publicly`);
    }
    if (section.audience !== "mj") assert.doesNotMatch(JSON.stringify(section.blocks ?? []), occultPublic, `${article.id}/${section.id}: occult metadata leaked publicly`);
  }

  if (completed.has(article.id)) {
    const lastTruthParagraph = truth?.blocks?.findLast((block) => typeof block?.text === "string");
    assert.match(lastTruthParagraph?.text?.trim() ?? "", /[.!?…»)]$/, `${article.id}: restored ending missing`);
  }
}

assert.equal(completed.size, 14, "14 cross-page biographies must be restored");
assert.equal(articles.find((article) => article.id.endsWith("virgil-lupesbei"))?.title, "Virgil Lupesbei");
assert.equal(articles.find((article) => article.id.endsWith("koshaway-le-gris"))?.title, "Koshaway « le Gris »");
assert.match(
  articles.find((article) => article.id.endsWith("tokala"))?.sections?.find((section) => section.id === "pelages-realite")?.blocks?.at(-1)?.text ?? "",
  /Grande Réserve/
);

console.log("TRUTH PELAGES OK — 28/28 PNJ · 14 fins restaurées · 0 fuite publique détectée");
