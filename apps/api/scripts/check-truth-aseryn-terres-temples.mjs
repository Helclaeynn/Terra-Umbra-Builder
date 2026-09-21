import assert from "node:assert/strict";
import {
  COMPENDIUM_VERITE_ASERYN_HUB_SECTIONS,
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_ARTICLES
} from "../dist/compendium-verite-aseryn-terres-temples.js";
import {
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_NAVIGATION
} from "../dist/compendium-verite-aseryn-terres-temples-pnj.js";

assert.equal(COMPENDIUM_VERITE_ASERYN_HUB_SECTIONS.length, 9, "9 enrichissements du hub Aseryn attendus");
assert.equal(COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_ARTICLES.length, 10, "10 pages lore Aseryn attendues");
assert.equal(COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES.length, 63, "63 PNJ Aseryn uniques attendus");
assert.equal(new Set(COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES.map((a) => a.id)).size, 63, "IDs PNJ Aseryn uniques");
assert.equal(COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_NAVIGATION.length, 63, "Navigation PNJ Aseryn complète");

for (const article of COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES) {
  const mj = article.sections?.find((section) => section.id === "aseryn-dossier-mj");
  const stats = article.sections?.find((section) => section.id === "profil-statistique");
  assert.ok(mj && mj.audience === "mj", `${article.id}: bloc MJ absent ou non protégé`);
  assert.ok(stats && stats.audience === "mj", `${article.id}: statistiques MJ absentes`);
  assert.deepEqual(stats.blocks, [], `${article.id}: statistiques inventées`);
  assert.ok(!("image" in article) && !("illustration" in article) && !article.pnj?.portrait, `${article.id}: média ajouté malgré la passe sans images`);

  const publicText = JSON.stringify((article.sections ?? []).filter((section) => section.audience !== "mj"));
  assert.ok(!publicText.includes("Nom de la Vérité"), `${article.id}: nom de Vérité exposé hors MJ`);
  assert.ok(!publicText.includes("Nature réelle"), `${article.id}: nature réelle exposée hors MJ`);
}

const rylias = COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_PNJ_ARTICLES.find(
  (article) => String(article.pnj?.nom_verite ?? "").toLowerCase().includes("rylias")
);
assert.ok(rylias, "Rylias absent");
assert.ok(rylias.tags.includes("Multi-source"), "Rylias doit être marqué Multi-source");
assert.equal(rylias.pnj.source_documents.length, 2, "Rylias doit conserver les deux documents");

for (const title of [
  "Néo-Atlantide — royaume, duchés & héritage atlante",
  "Mû — royaume mûlien & héritage de Thul",
  "Lémurie — royaumes, épidémies & aristocratie élective",
  "Hyperborée — royaume gelé & héritage d’Akryth",
  "Serathéens — diasporas & Conseil de la Foudre",
  "Ordre Sépulcral — gardiens du Mausolée de Serathè",
  "Temple du Créateur — le Temple Véritable",
  "Temple de l’Esprit — la Dame & l’Ombre-Songe",
  "Temple de l’Érosion — Vieilles & Chevaliers de la Ruine",
  "Temple de la Fin — Foudre du Silence & culte proscrit"
]) {
  assert.ok(COMPENDIUM_VERITE_ASERYN_TERRES_TEMPLES_ARTICLES.some((article) => article.title === title), `Page absente: ${title}`);
}

console.log("TRUTH ASERYN TERRES/TEMPLES OK — 10 pages lore · 63 PNJ uniques · secrets MJ · stats vides · aucun média");
