import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_PELAGES_SOURCE,
  COMPENDIUM_VERITE_THERIANTHROPES_COMPLEMENT_SOURCE,
  COMPENDIUM_VERITE_PELAGES_ARTICLES,
  COMPENDIUM_VERITE_PELAGES_ENRICHMENTS,
  COMPENDIUM_VERITE_PELAGES_NAVIGATION
} from "../dist/compendium-verite-pelages-lore.js";
import {
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES,
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ENRICHMENTS
} from "../dist/compendium-verite-pelages-editorial.js";
import {
  COMPENDIUM_VERITE_PELAGES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_PELAGES_PNJ_NAVIGATION
} from "../dist/compendium-verite-pelages-pnj.js";

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};

const withoutSections = ({ sections: _sections, ...entry }) => entry;
const sectionStructure = (entry) =>
  (entry.sections ?? []).map(({ id, level, audience, blocks }) => ({
    id,
    level,
    audience,
    blockTypes: (blocks ?? []).map((block) => block.type)
  }));

assert.equal(
  COMPENDIUM_VERITE_PELAGES_SOURCE,
  "factions_Les Pelages (loups-garous)(1)(1).pdf",
  "source principale des Pelages"
);
assert.equal(
  COMPENDIUM_VERITE_THERIANTHROPES_COMPLEMENT_SOURCE,
  "Les thérianthropes_complément garous(2)(1).pdf",
  "source du complément thérianthrope"
);
assert.equal(COMPENDIUM_VERITE_PELAGES_ARTICLES.length, 7, "7 pages de Pelages source");
assert.equal(COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES.length, 7, "7 pages de Pelages éditoriales");
assert.deepEqual(
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES.map(withoutSections),
  COMPENDIUM_VERITE_PELAGES_ARTICLES.map(withoutSections),
  "identifiants, titres de page, accès, tags, sources et navigation locale préservés"
);
assert.deepEqual(
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES.map(sectionStructure),
  COMPENDIUM_VERITE_PELAGES_ARTICLES.map(sectionStructure),
  "identifiants, accès et types de blocs préservés"
);

assert.deepEqual(
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES.map((article) => article.sections[0].title),
  [
    "Origines, direction et implantation",
    "Origines, direction et implantation",
    "Origines, direction et implantation",
    "Origines, direction et implantation",
    "Origines, direction et implantation",
    "Origines, direction et implantation",
    "Lignées périphériques"
  ],
  "titres encyclopédiques des sept fiches"
);

assert.equal(COMPENDIUM_VERITE_PELAGES_ENRICHMENTS.length, 2, "2 enrichissements source");
assert.equal(COMPENDIUM_VERITE_PELAGES_EDITORIAL_ENRICHMENTS.length, 2, "2 enrichissements éditoriaux");
assert.deepEqual(
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ENRICHMENTS.map(withoutSections),
  COMPENDIUM_VERITE_PELAGES_ENRICHMENTS.map(withoutSections),
  "cibles, tags et sources des enrichissements préservés"
);
assert.deepEqual(
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ENRICHMENTS.map(sectionStructure),
  COMPENDIUM_VERITE_PELAGES_ENRICHMENTS.map(sectionStructure),
  "structure des enrichissements préservée"
);

let changedParagraphs = 0;
for (const [entryIndex, source] of [
  ...COMPENDIUM_VERITE_PELAGES_ARTICLES,
  ...COMPENDIUM_VERITE_PELAGES_ENRICHMENTS
].entries()) {
  const edited = [
    ...COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES,
    ...COMPENDIUM_VERITE_PELAGES_EDITORIAL_ENRICHMENTS
  ][entryIndex];
  for (const [sectionIndex, section] of (source.sections ?? []).entries()) {
    for (const [blockIndex, block] of (section.blocks ?? []).entries()) {
      const editedBlock = edited.sections[sectionIndex].blocks[blockIndex];
      if (block.type === "p" && block.text !== editedBlock.text) changedParagraphs += 1;
      else assert.deepEqual(editedBlock, block, `${source.id ?? source.targetId}: bloc hors cible modifié`);
    }
  }
}
assert.equal(changedParagraphs, 6, "six formulations de fabrication remplacées");

const forbiddenVoice = /\b(?:le document|la source)\s+(?:cite|montre|décrit|mentionne|signale|indique|évoque)/iu;
const editorialText = flatten([
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES,
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ENRICHMENTS
]);
assert.doesNotMatch(editorialText, forbiddenVoice, "voix de fabrication résiduelle");
assert.doesNotMatch(
  flatten(COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES),
  /Dossier de Pelage/iu,
  "titre de gabarit résiduel"
);

let paragraphCount = 0;
let longest = 0;
for (const article of COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES) {
  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      assert.equal(block.type, "p", `${article.id}: type de bloc inattendu`);
      const text = String(block.text ?? "");
      paragraphCount += 1;
      longest = Math.max(longest, text.length);
      assert.ok(text.length > 0, `${article.id}: paragraphe vide`);
      assert.ok(text.length <= 600, `${article.id}: mur de ${text.length} caractères`);
      assert.doesNotMatch(text, /[�￾]/u, `${article.id}: glyphe d’import endommagé`);
    }
  }
}

const sentinels = {
  "verite-pelages-blancs": ["Ulfhednars", "Thorunn", "Neige-Pattes"],
  "verite-pelages-noirs": ["Talatuwa", "Tokala", "Untamed Fangs"],
  "verite-pelages-gris": ["Ascanius", "Lune enchaînée", "Romulus", "Lycovicus"],
  "verite-pelages-dores": ["Kadriye", "Barghests", "pègre indienne"],
  "verite-pelages-bruns": ["Kami", "Keltas", "Inukami"],
  "verite-pelages-roux": ["Khaashtay", "gouvernement californien"],
  "verite-pelages-autres": ["Pelage d’acier", "Galeux", "Vhodhal", "Sharith"]
};

for (const article of COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES) {
  const text = flatten(article);
  for (const sentinel of sentinels[article.id] ?? []) {
    assert.ok(text.includes(sentinel), `${article.id}: repère canonique perdu (${sentinel})`);
  }
}

assert.equal(COMPENDIUM_VERITE_PELAGES_NAVIGATION.length, 7, "7 entrées de navigation");
assert.deepEqual(
  COMPENDIUM_VERITE_PELAGES_NAVIGATION.map((entry) => entry.id),
  COMPENDIUM_VERITE_PELAGES_EDITORIAL_ARTICLES.map((article) => article.id),
  "ordre de navigation préservé"
);
assert.equal(COMPENDIUM_VERITE_PELAGES_PNJ_ARTICLES.length, 28, "28 profils PNJ préservés");
assert.equal(COMPENDIUM_VERITE_PELAGES_PNJ_NAVIGATION.length, 28, "28 entrées PNJ préservées");

console.log(
  `TRUTH PELAGES LORE OK — 7 pages · ${paragraphCount} paragraphes · 6 formulations éditoriales corrigées · plus long paragraphe ${longest} caractères · 28 profils PNJ préservés`
);
