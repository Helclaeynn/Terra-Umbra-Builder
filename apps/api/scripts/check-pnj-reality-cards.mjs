import assert from "node:assert/strict";
import pg from "pg";

pg.Pool.prototype.query = async () => ({ rows: [], rowCount: 0 });
const { getCompendiumQualityCorpus } = await import("../dist/compendium.js");
const corpus = await getCompendiumQualityCorpus();
const active = corpus.articles.filter((article) => article.category === "Personnages");
assert.equal(active.length, 918);
const article = (id, publicView = false) =>
  (publicView ? corpus.publicArticles : corpus.articles).find((item) => item.id === id);
const rows = (id) => article(id).sections[0].blocks[0].rows;

assert.equal(article("pnj-148-kai-gehrman").sections[0].title, "Identité · Réalité");
assert.ok(!article("pnj-148-kai-gehrman").sections.some((s) => /source antérieure/i.test(s.title)));
assert.equal(article("pnj-corporations-baldwin-vandrick").sections
  .filter((s) => s.blocks?.some((block) => block.type === "table" &&
    block.rows?.[0]?.[0] === "Champ")).length, 1);
assert.ok(rows("pnj-corporations-baldwin-vandrick").some((r) =>
  r[0] === "Organisation" && r[1] === "LAGUNA BANK CORPORATION"));
assert.ok(!JSON.stringify(rows("pnj-crawlers-antisysteme-p64-jayceon-osborn")).includes("Jacyr Oceriol"));
for (const id of ["pnj-148-kai-gehrman", "pnj-corporations-baldwin-vandrick",
  "personnages-verite-especes-tokala", "pnj-agences-cole-gallagher"]) {
  assert.ok(article(id).sections.at(-1).blocks.length >= 6, id);
  assert.equal(article(id).sections.at(-1).audience, "mj", id);
  assert.ok(!article(id, true).sections.some((s) => s.id === "profil-statistique"), id);
}
console.log("PNJ REALITY CARDS OK — identity first; duplicates merged; profiles MJ only");
