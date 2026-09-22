import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES,
  COMPENDIUM_VERITE_FLEAUX_NEW_PNJ_ARTICLES,
  COMPENDIUM_VERITE_FLEAUX_PNJ_NAVIGATION
} from "../dist/compendium-verite-fleaux-focus.js";

const articles = [...COMPENDIUM_VERITE_FLEAUX_NEW_PNJ_ARTICLES, ...COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES];
assert.equal(articles.length, 39, "39 Focus Fléaux PNJ expected");
assert.equal(new Set(articles.map((article) => article.id)).size, 39, "Focus Fléaux PNJ ids must be unique");
assert.equal(COMPENDIUM_VERITE_FLEAUX_PNJ_NAVIGATION.length, 39, "Every Focus Fléaux PNJ needs navigation");

const expectedMjOnly = new Set(["Fredegonda Vonrim", "Le Roi du Givre", "Am’Mleeac", "Pestiria"]);
assert.deepEqual(new Set(articles.filter((article) => article.audience === "mj").map((article) => article.title)), expectedMjOnly);

const publicOccult = /\b(?:fléaux?|abominations?|vampires?|mages?|garous?|duergars?|revenants?|gobelins?|rocréens?|thalsiosse|effismes?|daemons?)\b|nom de la vérité|ethnie réelle|nature réelle|R’Gahanath|Absariath|Zaalia’Gaer|Rnael’gem|Tel’Shaerith|Karr’Shahan|Anadia|Selm Scytheri|Milushka|Aristaeus|Héméra|Rulfam|Li’loth|Shy’Krerath|Greem’Sha/i;
const safeRealityIds = new Set([
  "pnj-fleaux-r-sheraag",
  "pnj-fleaux-dsherra-neth",
  "pnj-fleaux-focus-neals-corvo-ruth-neals-corvo",
  "pnj-fleaux-focus-sven-scythe--102-sven-scythe",
  "pnj-fleaux-focus-leona-elliott-90-leona-elliott",
  "pnj-fleaux-focus-aberration-z-87--aberration-z-87",
  "pnj-fleaux-focus-olla-berwick-099-olla-berwick",
  "pnj-fleaux-focus-grim-grigoria-ravinsky-rigoria-ravinsky"
]);

for (const article of articles) {
  assert.equal(article.pnj?.protect_truth_metadata, true, `${article.id}: Truth metadata protection missing`);
  const dossier = article.sections?.find((section) => section.id === "fleaux-focus-dossier");
  assert.equal(dossier?.audience, "mj", `${article.id}: Focus dossier must be MJ-only`);
  const truth = article.sections?.find((section) => section.id === "fleaux-focus-verite");
  if (truth) assert.equal(truth.audience, "mj", `${article.id}: Truth biography must be MJ-only`);

  const mixed = article.sections?.find((section) => section.id === "fleaux-focus-realite" || section.id === "fleaux-focus-informations");
  if (mixed) {
    assert.equal(
      mixed.audience !== "mj",
      safeRealityIds.has(article.id),
      `${article.id}: Reality/Truth section classification is wrong`
    );
  }

  for (const section of article.sections ?? []) {
    if (section.audience !== "mj") assert.doesNotMatch(JSON.stringify(section.blocks ?? []), publicOccult, `${article.id}/${section.id}: occult data leaked publicly`);
    if (section.id === "fleaux-focus-dossier") continue;
    for (const block of section.blocks ?? []) {
      if (typeof block?.text === "string" && block.text.trim()) {
        assert.match(block.text.trim(), /[.!?…»)]$/, `${article.id}/${section.id}: truncated active paragraph`);
      }
    }
  }
}

assert.equal(safeRealityIds.size, 8, "Eight individually reviewed Reality biographies must remain public");
const arkady = articles.find((article) => article.id === "pnj-fleaux-focus-arkady-karamov-4-arkady-karamov");
assert.equal(arkady?.pnj?.nom_verite, "Arkady Karamov / Yegor Karamov", "Arkady's dual post-reconstruction identity must remain explicit");
assert.ok(!(arkady?.pnj?.identity_keys ?? []).some((key) => /^Yegor Karamov(?:ich)?$/i.test(String(key))), "Arkady must not merge into Yegor");
assert.equal(articles.find((article) => article.id === "pnj-fleaux-telipinu")?.pnj?.nom_verite, "Telipinu");
assert.equal(articles.find((article) => article.id === "pnj-fleaux-siadara")?.title, "Sianna Danein");

console.log("TRUTH FLÉAUX PNJ OK — 39/39 fiches · 4 MJ-only · 8 Réalités publiques · 0 fuite détectée");
