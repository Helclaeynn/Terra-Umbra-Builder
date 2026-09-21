import assert from "node:assert/strict";

import {
  COMPENDIUM_POINTS_RENCONTRE_ARTICLES,
  COMPENDIUM_POINTS_RENCONTRE_NAVIGATION
} from "../dist/compendium-points-rencontre.js";
import {
  COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES,
  COMPENDIUM_POINTS_RENCONTRE_PNJ_NAVIGATION
} from "../dist/compendium-points-rencontre-pnj.js";

const hub = COMPENDIUM_POINTS_RENCONTRE_ARTICLES.find((article) => article.id === "verite-points-rencontre");
const locations = COMPENDIUM_POINTS_RENCONTRE_ARTICLES.filter((article) => article.id !== "verite-points-rencontre");

assert.ok(hub, "Points de rencontre: hub MJ absent");
assert.equal(COMPENDIUM_POINTS_RENCONTRE_ARTICLES.length, 25, "Points de rencontre: 1 hub + 24 lieux uniques attendus");
assert.equal(locations.length, 24, "Points de rencontre: 24 lieux physiques uniques attendus");
assert.equal(new Set(COMPENDIUM_POINTS_RENCONTRE_ARTICLES.map((article) => article.id)).size, 25, "Points de rencontre: ids de lieux non uniques");
assert.equal(COMPENDIUM_POINTS_RENCONTRE_NAVIGATION.length, 25, "Points de rencontre: navigation des lieux incomplète");

for (const article of COMPENDIUM_POINTS_RENCONTRE_ARTICLES) {
  assert.equal(article.audience, "mj", `${article.id}: le lieu doit rester MJ-only`);
  assert.equal(article.source, "Points de rencontre(3).pdf", `${article.id}: provenance source incorrecte`);
}

assert.equal(COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES.length, 52, "Points de rencontre: 52 gardiens attendus");
assert.equal(new Set(COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES.map((article) => article.id)).size, 52, "Points de rencontre: ids PNJ non uniques");
assert.equal(COMPENDIUM_POINTS_RENCONTRE_PNJ_NAVIGATION.length, 52, "Points de rencontre: navigation PNJ incomplète");

const forbiddenPublicLabels = [
  "nom de la vérité",
  "ethnie réelle",
  "faction réelle",
  "type de mageius",
  "magie dominante",
  "magie familiale",
  "archange tutélaire",
  "divinité",
  "pouvoir principal",
  "pouvoir du sang",
  "pouvoirs du sang",
  "grand meneur",
  "titre infernal",
  "clan rocréen",
  "rang dans le syndicat",
  "spécificité"
];

for (const article of COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES) {
  assert.equal(article.category, "Personnages", `${article.id}: catégorie PNJ incorrecte`);
  assert.equal(article.dataset, "points-rencontre-pnj", `${article.id}: dataset PNJ incorrect`);
  assert.ok(article.pnj?.source_extract, `${article.id}: extrait source intégral absent`);
  assert.deepEqual(article.pnj?.source_pages?.length, 2, `${article.id}: provenance de page absente`);

  const mj = article.sections?.find((section) => section.id === "informations-mj");
  const stats = article.sections?.find((section) => section.id === "profil-statistique");
  assert.equal(mj?.audience, "mj", `${article.id}: bloc Vérité non protégé`);
  assert.equal(stats?.audience, "mj", `${article.id}: bloc statistiques non protégé`);
  assert.deepEqual(stats?.blocks, [], `${article.id}: statistiques inventées dans une passe lore-only`);

  const publicText = JSON.stringify((article.sections ?? []).filter((section) => section.audience !== "mj")).toLowerCase();
  for (const label of forbiddenPublicLabels) {
    assert.ok(!publicText.includes(label), `${article.id}: fuite publique du champ secret « ${label} »`);
  }
}

const magicCasino = locations.find((article) => article.id === "points-rencontre-magic-casino");
assert.ok(magicCasino?.sections?.some((section) => section.id === "dossier-mages-5"), "M(agic) Casino: dossier Mages p.5 absent");
assert.ok(magicCasino?.sections?.some((section) => section.id === "dossier-loups-garous-33"), "M(agic) Casino: dossier Loups-garous p.33 absent");

const raven = locations.find((article) => article.id === "points-rencontre-raven-corporation-hq");
assert.ok(raven?.sections?.some((section) => section.id === "dossier-daemons-25"), "Raven HQ: dossier Daemons p.25 absent");
assert.ok(raven?.sections?.some((section) => section.id === "dossier-rocreens-aliens-51"), "Raven HQ: dossier Rocréens p.51 absent");

const byTitle = new Map(COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES.map((article) => [article.title, article]));
for (const [title, truthName] of [
  ["Jamal Jace Jayson", "Georah"],
  ["Jimmy Brazier", "Moloch"],
  ["Belyandra Queen", "Belial"],
  ["Benedicte VILHELMSEN", "Thorunn"],
  ["Sikya HAWKINS", "Talatuwa"],
  ["Rached KELLEY", "Raysh’kan’Feeshri"]
]) {
  assert.equal(byTitle.get(title)?.pnj?.nom_verite, truthName, `${title}: identité Vérité canonique incorrecte`);
}

const jcube = byTitle.get("Jamal Jace Jayson");
assert.ok(jcube?.pnj?.identity_keys?.includes("J3"), "Jcube: alias J3 absent");
assert.ok(jcube?.pnj?.identity_keys?.includes("Jcube"), "Jcube: alias Jcube absent");

console.log("POINTS DE RENCONTRE OK — 24 lieux uniques + 1 hub MJ · 52 gardiens · Vérité protégée · doublons physiques fusionnés");
