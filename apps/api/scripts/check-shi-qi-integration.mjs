import assert from "node:assert/strict";

import {
  COMPENDIUM_SHI_QI_ARTICLES,
  COMPENDIUM_SHI_QI_NAVIGATION,
  COMPENDIUM_SHI_QI_ENRICHMENTS
} from "../dist/compendium-shi-qi.js";

assert.equal(COMPENDIUM_SHI_QI_ARTICLES.length, 9, "Shi/Qi: 9 pages attendues");
assert.equal(new Set(COMPENDIUM_SHI_QI_ARTICLES.map((article) => article.id)).size, 9, "Shi/Qi: ids non uniques");
assert.equal(COMPENDIUM_SHI_QI_NAVIGATION.length, 9, "Shi/Qi: navigation incomplète");

const reality = COMPENDIUM_SHI_QI_ARTICLES.filter((article) => article.category === "Réalité");
const truth = COMPENDIUM_SHI_QI_ARTICLES.filter((article) => article.category === "Vérité");
assert.deepEqual(reality.map((article) => article.id).sort(), [
  "realite-alliance-martiale",
  "realite-arts-du-qi"
], "Shi/Qi: les deux pages de façade Réalité doivent rester identifiées");
assert.equal(truth.length, 7, "Shi/Qi: 7 pages Vérité attendues");
for (const article of truth) {
  assert.equal(article.audience, "mj", `${article.id}: page Vérité non protégée`);
}

const realityQi = reality.find((article) => article.id === "realite-arts-du-qi");
assert.equal(
  realityQi?.sections?.find((section) => section.id === "regard-mj")?.audience,
  "mj",
  "Arts du Qi: la limite de compréhension de l’Alliance doit rester MJ"
);

const clan = truth.find((article) => article.id === "verite-clan-shi-taoisme-veritable");
const clanText = JSON.stringify(clan);
assert.ok(clanText.includes("Shi Wei est désormais la maîtresse du Clan Shi"), "Clan Shi: canon courant de Wei absent");
assert.ok(clanText.includes("448"), "Clan Shi: tournoi des 448 maîtres absent");
assert.ok(clanText.includes("Grand Traqueur"), "Clan Shi: crise du Grand Traqueur absente");

const families = truth.find((article) => article.id === "verite-clan-shi-cinq-familles");
const familiesText = JSON.stringify(families);
for (const expected of [
  "Dōng Gù shì — Est","Dragon azur",
  "Xī Zhān shì — Ouest","Tigre blanc",
  "Nán láodòng shì — Sud","Oiseau vermillon",
  "Běi Xióng shì — Nord","Tortue noire"
]) {
  assert.ok(familiesText.includes(expected), `Clan Shi: association familiale absente — ${expected}`);
}

const ryong = truth.find((article) => article.id === "verite-qi-ryong-energie-dragon");
const ryongText = JSON.stringify(ryong);
assert.ok(ryongText.includes("Dradyn"), "Ryong: origine Dradyn absente");
assert.ok(ryongText.includes("Élu d’Aèr"), "Ryong: Élu d’Aèr absent");
assert.ok(ryongText.includes("aucun lien avec les dragons nareysvor"), "Ryong: distinction avec les Nareysvor absente");

const shinoda = truth.find((article) => article.id === "verite-qi-shinoda-pouvoir-oni");
const shinodaText = JSON.stringify(shinoda);
assert.ok(shinodaText.includes("Yakushima"), "Shinoda: Yakushima absent");
assert.ok(shinodaText.includes("1592"), "Shinoda: ralliement de 1592 absent");
assert.ok(!shinodaText.includes("Le Qi ailleurs"), "Shinoda: section générale Qi ailleurs mal fusionnée");

const metaphysics = truth.find((article) => article.id === "verite-qi-metaphysique");
const metaphysicsText = JSON.stringify(metaphysics);
for (const expected of ["sept Po", "trois Hun", "Jing", "Shen", "Morino Shohei"]) {
  assert.ok(metaphysicsText.includes(expected), `Qi: notion métaphysique absente — ${expected}`);
}

assert.deepEqual(
  COMPENDIUM_SHI_QI_ENRICHMENTS.map((item) => item.id).sort(),
  ["personnages-verite-chasseurs-xuegang-shi", "pnj-corporations-wei-shi"].sort(),
  "Shi/Qi: seuls Wei et Xuegang doivent être enrichis, sans doublon PNJ"
);
const enrichmentText = JSON.stringify(COMPENDIUM_SHI_QI_ENRICHMENTS);
assert.ok(!enrichmentText.includes("Lisa Eredhès"), "Shi/Qi: faux gabarit Lisa Eredhès intégré");
assert.ok(!enrichmentText.includes("Alladava Kjoll"), "Shi/Qi: faux gabarit Alladava Kjoll intégré");

console.log("SHI / QI OK — 9 pages · Réalité/Vérité séparées · Wei/Xuegang enrichis · Ryong/Dradyn protégé · faux gabarits exclus");
