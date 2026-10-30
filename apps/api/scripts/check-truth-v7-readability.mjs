import assert from "node:assert/strict";

const modules = await Promise.all(["mages", "daemons", "angelus", "aseryns"].map((name) => import(`../dist/compendium-verite-v7-${name}.js`)));
const articles = modules.flatMap((module) => Object.values(module).find((value) => Array.isArray(value) && value[0]?.dataset === "verite-v7") ?? []);
const rules = articles.filter((article) => article.category === "Règles");
assert.equal(rules.length, 9);

for (const article of rules) for (const section of article.sections) for (const block of section.blocks) {
  if (block.type !== "p") continue;
  assert.ok(block.text.length <= 600 || block.text.startsWith("{{Talents|"), `${article.id} / ${section.title}: ${block.text.length}-character wall of text`);
  assert.ok(!/[�￾]/u.test(block.text), `${article.id} / ${section.title}: damaged glyph`);
  assert.ok(!block.text.includes(" • "), `${article.id} / ${section.title}: inline bullets`);
}

const mage = rules.find((article) => article.id === "regles-verite-v7-mage-maitrise-amplitude-lancement");
const sectionText = (title) => mage.sections.find((section) => section.title === title).blocks.map((block) => block.text ?? "").join(" ");
assert.match(sectionText("Défense occulte"), /Défense occulte passive/u);
assert.doesNotMatch(sectionText("Défense occulte"), /Type de Mageius/u);
assert.match(sectionText("Principe de désignation et rôle des Savoirs"), /Compétences profanes/u);
assert.match(sectionText("Principe de désignation et rôle des Savoirs"), /Connaissance/u);
console.log("TRUTH V7 READABILITY — 9/9 sensitive rule pages structured");
