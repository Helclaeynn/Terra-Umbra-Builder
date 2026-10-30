import assert from "node:assert/strict";

import {
  COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES,
  COMPENDIUM_POINTS_RENCONTRE_PNJ_NAVIGATION
} from "../dist/compendium-points-rencontre-pnj.js";

const articles = COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES;
assert.equal(articles.length, 52, "52 Points de rencontre PNJ expected");
assert.equal(new Set(articles.map((article) => article.id)).size, 52, "PNJ ids must be unique");
assert.equal(COMPENDIUM_POINTS_RENCONTRE_PNJ_NAVIGATION.length, 52, "Every PNJ needs navigation");
assert.deepEqual(articles.map((article) => article.pnj?.source_order), Array.from({ length: 52 }, (_, index) => index + 1));

const occult = /nom de la vérité|ethnie réelle|nature réelle|âge réel|mageius|\bmages?\b|angelus|archangelus|daemons?|loups?-garous?|thulkars?|ashylls?|rocréenn?e?s?|serysse|Khir’stae|Ishvaarahla|Shurlgaar|Feeshri|Greem’Sha|Kran’Rag|Kiarn’kay|Sheorrn’kay|Talatuwa|Morrighan|Belial|Moloch|Urielle|Pergamin|Barabbiel|Ashirel|Erianel|Georah|Argariel/i;

for (const article of articles) {
  assert.equal(article.pnj?.protect_truth_metadata, true, `${article.id}: metadata protection missing`);
  const profile = article.sections?.find((section) => section.id === "profil");
  const reality = article.sections?.find((section) => section.id === "informations-realite");
  const truth = article.sections?.find((section) => section.id === "informations-mj");
  assert.ok(profile && profile.audience !== "mj", `${article.id}: public profile missing`);
  assert.ok(reality && reality.audience !== "mj", `${article.id}: Reality biography missing`);
  assert.equal(truth?.audience, "mj", `${article.id}: Truth dossier must be MJ-only`);
  const publicSections = article.sections?.filter((section) => section.audience !== "mj") ?? [];
  const publicText = JSON.stringify(publicSections);
  assert.doesNotMatch(publicText, occult, `${article.id}: occult information leaked publicly`);
  assert.doesNotMatch(publicText, /\?\?\?|Âge source|\d+\s*ans[^\]]*(?:-|,)\s*\d+\s*ans/i, `${article.id}: real or unknown age leaked publicly`);
  const paragraph = reality.blocks?.find((block) => block.type === "p")?.text ?? "";
  assert.match(paragraph.trim(), /[.!?…»)]$/, `${article.id}: truncated Reality paragraph`);
}

assert.equal(articles.find((article) => article.id.endsWith("aessa-lee-love"))?.pnj?.nom_verite, "Meririm–Messaline");
assert.equal(articles.find((article) => article.id.endsWith("grigoria-ravinsky"))?.title, "Grigoria « Grim » Ravinsky");
assert.equal(articles.find((article) => article.id.endsWith("anna-hetfield"))?.title, "Anna « Annallica » Hetfield");
assert.equal(articles.find((article) => article.id.endsWith("racheyl-rosemann"))?.title, "Racheyl Rosemann");

console.log("POINTS DE RENCONTRE PNJ OK — 52/52 fiches · Réalité restaurée · dossiers occultes MJ-only");
