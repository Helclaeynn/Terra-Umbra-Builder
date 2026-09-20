import { COMPENDIUM_VERITE_V7_PASS_B_ARTICLES } from "../dist/compendium-verite-v7-pass-b.js";
import { terraUmbraTruthRules } from "../dist/rules/truth/rules.js";

const fail = (message) => {
  console.error(`[truth-v7-pass-b] ${message}`);
  process.exitCode = 1;
};

const articles = COMPENDIUM_VERITE_V7_PASS_B_ARTICLES;
const byId = new Map(articles.map((article) => [article.id, article]));
const expectedIds = [
  "verite-v7-exiles-peuples-silcenters-traditions",
  "verite-v7-extrals-gaac-aidh-diasporas",
  "verite-v7-chasseurs-doctrine-association-traditions",
  "regles-verite-v7-corruption-integrite-bascule",
  "verite-v7-six-fleaux-sources-rupture",
  "verite-v7-delanial-pere-ombre",
  "regles-verite-v7-equipement-proprietes-acquisition"
];

if (articles.length !== expectedIds.length) {
  fail(`expected ${expectedIds.length} Pass B articles, found ${articles.length}`);
}
for (const id of expectedIds) {
  if (!byId.has(id)) fail(`missing article ${id}`);
}

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};

for (const article of articles) {
  const text = flatten(article);
  if (text.includes("{{Talents|")) fail(`${article.id}: talent catalog placeholder is forbidden in Pass B`);
  if (/[�￾]/u.test(text)) fail(`${article.id}: damaged extraction glyph`);
  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block?.type !== "p") continue;
      if (String(block.text ?? "").length > 600) {
        fail(`${article.id} / ${section.id}: paragraph exceeds 600 characters`);
      }
      if (String(block.text ?? "").includes(" • ")) {
        fail(`${article.id} / ${section.id}: inline bullet wall detected`);
      }
    }
  }
}

const catalogs = terraUmbraTruthRules.catalogs;
const expectedBindings = [
  ["exile", catalogs.exile, 184, "verite-v7-exiles-peuples-silcenters-traditions"],
  ["extral", catalogs.extral, 161, "verite-v7-extrals-gaac-aidh-diasporas"],
  ["humain", catalogs.humain, 266, "verite-v7-chasseurs-doctrine-association-traditions"]
];

for (const [label, catalog, count, compendiumId] of expectedBindings) {
  if (catalog.length !== count) fail(`${label}: expected ${count} talents, found ${catalog.length}`);
  const wrong = catalog.filter((talent) => talent.compendiumId !== compendiumId);
  if (wrong.length) fail(`${label}: ${wrong.length} talents do not point to ${compendiumId}`);
}

const corruptionText = flatten(byId.get("regles-verite-v7-corruption-integrite-bascule"));
for (const needle of [
  "Force Mentale + Humanité",
  "V’Aagor → Sharith → Vhodhal → Vhadhi → Shaoggith → Thul",
  "Volonté + Maîtrise spirituelle + 1d10e",
  "DON, RITE & FAVEUR"
]) {
  if (!corruptionText.includes(needle)) fail(`corruption page lost canonical marker: ${needle}`);
}

const fleauxText = flatten(byId.get("verite-v7-six-fleaux-sources-rupture"));
for (const needle of ["Vhodhal", "V’Aagor", "Ux’Sharith", "C’Thath Vhadhi", "Gajh’Shaoggith", "Thul"]) {
  if (!fleauxText.includes(needle)) fail(`six-Fléaux page missing ${needle}`);
}

const delanial = byId.get("verite-v7-delanial-pere-ombre");
const mjText = flatten((delanial?.sections ?? []).filter((section) => section.audience === "mj"));
if (!mjText.includes("Delanial n’est pas un Fléau")) fail("Delanial MJ classification missing");
if (!mjText.includes("Légionnaire des Puissances")) fail("Delanial cosmological classification missing");
if (!mjText.includes("aucune Source de Corruption Delanial")) fail("Delanial false-source guard missing");

const equipmentText = flatten(byId.get("regles-verite-v7-equipement-proprietes-acquisition"));
for (const needle of ["Perforant X", "Sacré", "Angélique", "Solaire", "EMP / Ion", "Invariant", "Calibré", "Surchauffe", "Verrouillé"]) {
  if (!equipmentText.includes(needle)) fail(`equipment page missing property ${needle}`);
}

if (!process.exitCode) {
  console.log("[truth-v7-pass-b] 7/7 editorial pages validated; 611 Builder talents linked without catalog duplication.");
}
