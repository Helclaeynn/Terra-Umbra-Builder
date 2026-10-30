import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_FLEAUX_SOURCE,
  COMPENDIUM_VERITE_FLEAUX_ARTICLES,
  COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES,
  COMPENDIUM_VERITE_FLEAUX_NEW_PNJ_ARTICLES,
  COMPENDIUM_VERITE_FLEAUX_NAVIGATION,
  COMPENDIUM_VERITE_FLEAUX_PNJ_NAVIGATION
} from "../dist/compendium-verite-fleaux-focus.js";
import {
  COMPENDIUM_VERITE_FLEAUX_LORE_ARTICLES,
  COMPENDIUM_VERITE_FLEAUX_LORE_ENRICHMENTS
} from "../dist/compendium-verite-fleaux-lore.js";

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};

assert.equal(
  COMPENDIUM_VERITE_FLEAUX_SOURCE,
  "TUC_Vérité_ les créatures_focus  sur les Fléaux(2).docx",
  "source canonique du lot Fléaux"
);
assert.equal(COMPENDIUM_VERITE_FLEAUX_LORE_ARTICLES.length, 6, "6 pages de cultes attendues");
assert.deepEqual(
  COMPENDIUM_VERITE_FLEAUX_LORE_ARTICLES.map(({ id, title, navigation }) => ({
    id,
    title,
    navigation
  })),
  COMPENDIUM_VERITE_FLEAUX_ARTICLES.map(({ id, title, navigation }) => ({ id, title, navigation })),
  "identifiants, titres et navigation des pages de cultes préservés"
);
assert.deepEqual(
  COMPENDIUM_VERITE_FLEAUX_LORE_ARTICLES.map((article) => article.sections.length),
  [10, 6, 4, 2, 2, 2],
  "frontières institutionnelles des 26 sections de cultes"
);
assert.equal(
  COMPENDIUM_VERITE_FLEAUX_LORE_ARTICLES.flatMap((article) => article.sections).length,
  26,
  "26 sections institutionnelles attendues"
);
assert.equal(
  new Set(COMPENDIUM_VERITE_FLEAUX_NAVIGATION.map((entry) => entry.id)).size,
  6,
  "navigation des cultes complète et unique"
);

const forbidden =
  /[�￾]|Nom de la Réalité|Nom de la Vérité|Personnages liés|Voir la fiche|Informations (?:Réalité|Vérité)\s*[—-]\s*Focus Fléaux/iu;
let paragraphCount = 0;
let tableCount = 0;
let longest = 0;

const validateSection = (section, context) => {
  assert.ok(section.id, `${context}: identifiant de section absent`);
  assert.ok(section.title, `${context}: titre de section absent`);
  for (const block of section.blocks ?? []) {
    if (block.type === "table") {
      tableCount += 1;
      continue;
    }
    assert.equal(block.type, "p", `${context}: type de bloc inattendu`);
    paragraphCount += 1;
    const text = String(block.text ?? "");
    longest = Math.max(longest, text.length);
    assert.ok(text.length > 0, `${context}: paragraphe vide`);
    assert.ok(text.length <= 600, `${context}: mur de ${text.length} caractères`);
    assert.doesNotMatch(text, forbidden, `${context}: fragment d’import ou biographie`);
  }
};

for (const article of COMPENDIUM_VERITE_FLEAUX_LORE_ARTICLES) {
  assert.equal(article.source, COMPENDIUM_VERITE_FLEAUX_SOURCE, `${article.id}: source canonique`);
  assert.equal(article.pnj, undefined, `${article.id}: aucun profil PNJ dans le lore institutionnel`);
  assert.ok(
    !(article.sections ?? []).some((section) => /figures liées/iu.test(section.title)),
    `${article.id}: renvoi biographique résiduel`
  );
  for (const section of article.sections ?? []) validateSection(section, `${article.id} / ${section.title}`);
}

const cultSentinels = {
  "lore-plagues-cultes-vaagor": [
    "Ombre-Pape",
    "Rnael’Gem",
    "Osh’bawa",
    "Nerediath Lisindrith",
    "Fredegonda"
  ],
  "lore-plagues-cultes-uxsharith": [
    "Aldebert de Vandrick",
    "Raghnaid Maccalmain",
    "Ashlultum",
    "Enheduana"
  ],
  "lore-plagues-cultes-vhodhal": ["Miluska Voroshilov", "Siadara", "Elfenbeinblut"],
  "lore-plagues-eden-gris": ["métastasismancie", "Am’Mleeac", "sept actes de foi"],
  "lore-plagues-mere-primordiale": ["Li’Loth", "Krerath", "Mo’sen"],
  "lore-plagues-sombre-culte": ["Thuliens", "Mû", "sang royal des Atlantes"]
};

for (const article of COMPENDIUM_VERITE_FLEAUX_LORE_ARTICLES) {
  const text = flatten(article);
  for (const sentinel of cultSentinels[article.id] ?? []) {
    assert.ok(text.includes(sentinel), `${article.id}: repère canonique perdu (${sentinel})`);
  }
}

assert.equal(COMPENDIUM_VERITE_FLEAUX_LORE_ENRICHMENTS.length, 13, "13 enrichissements attendus");
const enrichmentSections = new Map(
  COMPENDIUM_VERITE_FLEAUX_LORE_ENRICHMENTS.map((entry) => [entry.section.id, entry.section])
);
assert.equal(enrichmentSections.size, 13, "identifiants d’enrichissement uniques");
assert.ok(!enrichmentSections.has("fleaux-focus-delanial"), "doublon biographique de Delanial supprimé");

const detailIds = [
  "fleaux-focus-mloxol-v'aagor",
  "fleaux-focus-ux'sharith-bellatheis",
  "fleaux-focus-vhodhal'nact'ru",
  "fleaux-focus-c'thath-vhadhi",
  "fleaux-focus-gajh'-shaoggith",
  "fleaux-focus-k'thuhuth'lul"
];
for (const id of [
  "fleaux-focus-contexte",
  "fleaux-focus-corruption",
  ...detailIds,
  "fleaux-focus-pere-ombre"
]) {
  const section = enrichmentSections.get(id);
  assert.ok(section, `enrichissement absent: ${id}`);
  validateSection(section, id);
}

const detailText = detailIds.map((id) => flatten(enrichmentSections.get(id))).join(" ");
for (const sentinel of [
  "Roi des Fléaux",
  "Alisa Svalisdottir",
  "Famine liquide",
  "Attributs flottants",
  "Tiamandra Vecellio",
  "R’Lyeh"
]) {
  assert.ok(detailText.includes(sentinel), `dossiers des six Fléaux: repère perdu (${sentinel})`);
}
assert.equal(
  enrichmentSections
    .get("fleaux-focus-vhodhal'nact'ru")
    .blocks.filter((block) => block.type === "table").length,
  1,
  "table des quatre regards de Vhodhal"
);
assert.match(
  flatten(enrichmentSections.get("fleaux-focus-pere-ombre")),
  /Delanial n’est pas un Fléau/u,
  "classification de Delanial explicitement préservée"
);

assert.equal(COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES.length, 25, "25 sources PNJ existantes");
assert.equal(COMPENDIUM_VERITE_FLEAUX_NEW_PNJ_ARTICLES.length, 14, "14 nouveaux profils PNJ");
assert.equal(COMPENDIUM_VERITE_FLEAUX_PNJ_NAVIGATION.length, 39, "39 entrées de navigation PNJ");
const pnjIds = [
  ...COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES,
  ...COMPENDIUM_VERITE_FLEAUX_NEW_PNJ_ARTICLES
].map((article) => article.id);
assert.equal(new Set(pnjIds).size, 39, "identifiants PNJ uniques");
assert.deepEqual(
  new Set(COMPENDIUM_VERITE_FLEAUX_PNJ_NAVIGATION.map((entry) => entry.id)),
  new Set(pnjIds),
  "navigation PNJ inchangée"
);

console.log(
  `TRUTH FLÉAUX LORE OK — 6 pages · 26 sections de cultes · 13 enrichissements · ${paragraphCount} paragraphes contrôlés · ${tableCount} tableau · plus long paragraphe ${longest} caractères · 39 profils PNJ préservés`
);
