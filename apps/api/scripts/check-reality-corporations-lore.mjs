import assert from "node:assert/strict";

import {
  COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT,
  COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES,
  COMPENDIUM_REALITE_V9_CORPORATIONS_NAVIGATION
} from "../dist/compendium-realite-v9-corporations.js";
import {
  COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_HUB_ENRICHMENT,
  COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES
} from "../dist/compendium-realite-v9-corporations-editorial.js";
import { CORPORATION_HIERARCHY_ROWS } from "../dist/compendium-realite-v9-corporations-hierarchy.js";
import {
  COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_NAVIGATION
} from "../dist/compendium-realite-v9-corporations-pnj.js";

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};
const withoutSections = ({ sections: _sections, ...entry }) => entry;
const sectionSignature = (entry) =>
  (entry.sections ?? []).map(({ id, title, level, audience }) => ({ id, title, level, audience }));

assert.equal(COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES.length, 35, "35 pages source");
assert.equal(COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES.length, 35, "35 pages éditoriales");
assert.deepEqual(
  COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES.map(withoutSections),
  COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES.map(withoutSections),
  "métadonnées des pages préservées"
);
assert.deepEqual(
  COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES.map(sectionSignature),
  COMPENDIUM_REALITE_V9_CORPORATIONS_ARTICLES.map(sectionSignature),
  "identifiants et titres des sections préservés"
);
assert.deepEqual(
  withoutSections(COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_HUB_ENRICHMENT),
  withoutSections(COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT),
  "métadonnées de l’enrichissement du hub préservées"
);
assert.deepEqual(
  COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_HUB_ENRICHMENT.sections.map((section) => section.id),
  COMPENDIUM_REALITE_V9_CORPORATIONS_HUB_ENRICHMENT.sections.map((section) => section.id),
  "sept sections du hub préservées"
);

assert.equal(COMPENDIUM_REALITE_V9_CORPORATIONS_NAVIGATION.length, 35, "35 entrées de navigation");
assert.deepEqual(
  COMPENDIUM_REALITE_V9_CORPORATIONS_NAVIGATION.map((entry) => entry.id),
  COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES.map((article) => article.id),
  "ordre et identifiants de navigation préservés"
);

const hierarchyPages = Object.keys(CORPORATION_HIERARCHY_ROWS);
const hierarchyRowCount = Object.values(CORPORATION_HIERARCHY_ROWS).flat().length;
const hierarchyRows = Object.values(CORPORATION_HIERARCHY_ROWS).flat();
assert.equal(hierarchyPages.length, 34, "34 organigrammes de corporations");
assert.equal(hierarchyRowCount, 628, "628 entrées SmartArt structurées");
assert.equal(hierarchyRows.filter(([level]) => level === "Direction").length, 166, "166 directions structurées");
assert.doesNotMatch(flatten(hierarchyRows), /Direction générale/u, "intitulés de branche restaurés");
for (const branch of [
  "Soda",
  "Catering",
  "Supervision",
  "Administration orbitale",
  "NeuroSoftwares",
  "Sécurité des intérêts",
  "NaCa Enterprise",
  "NaCa Security",
  "Droit des affaires",
  "Prévention santé sociale",
  "Huissiers et sécurité"
]) {
  assert.ok(flatten(hierarchyRows).includes(branch), `branche d’organigramme perdue (${branch})`);
}

const corporationArticles = COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES.slice(1);
assert.deepEqual(
  corporationArticles.map((article) => article.id).sort(),
  hierarchyPages.toSorted(),
  "un organigramme pour chaque fiche développée"
);

let insertedHierarchyRows = 0;
let paragraphCount = 0;
let tableCount = 0;
let longestParagraph = 0;
for (const article of COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES) {
  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block.type === "p") {
        const text = String(block.text ?? "");
        paragraphCount += 1;
        longestParagraph = Math.max(longestParagraph, text.length);
        assert.ok(text.length > 0, `${article.id}: paragraphe vide`);
        assert.ok(text.length <= 600, `${article.id}: mur de ${text.length} caractères`);
        assert.doesNotMatch(text, /^[•-]\s/u, `${article.id}: puce brute résiduelle`);
        assert.doesNotMatch(text, /[�￾]/u, `${article.id}: glyphe d’import endommagé`);
        assert.doesNotMatch(
          text,
          /Organigramme source|transcription linéaire/iu,
          `${article.id}: commentaire d’import résiduel`
        );
      } else if (block.type === "table") {
        tableCount += 1;
        assert.ok((block.rows ?? []).length > 1, `${article.id}: tableau vide`);
      } else {
        assert.fail(`${article.id}: type de bloc inattendu ${block.type}`);
      }
    }
  }
}

for (const article of corporationArticles) {
  const branches = article.sections.find((section) => section.id === "branches");
  assert.ok(branches, `${article.id}: section d’organisation absente`);
  const leadership = branches.blocks.find(
    (block) => block.type === "table" && block.rows?.[0]?.join("|") === "Fonction|Nom"
  );
  const hierarchy = branches.blocks.find(
    (block) =>
      block.type === "table" &&
      block.rows?.[0]?.join("|") === "Niveau|Responsable|Périmètre|Rattachement"
  );
  assert.ok(leadership, `${article.id}: présidence perdue`);
  assert.ok(hierarchy, `${article.id}: organigramme structuré absent`);
  assert.equal(
    hierarchy.rows.length - 1,
    CORPORATION_HIERARCHY_ROWS[article.id].length,
    `${article.id}: nombre d’entrées de l’organigramme`
  );
  insertedHierarchyRows += hierarchy.rows.length - 1;
  const articleText = flatten(article);
  for (const [, responsible] of CORPORATION_HIERARCHY_ROWS[article.id]) {
    assert.ok(articleText.includes(responsible), `${article.id}: responsable perdu (${responsible})`);
  }
}
assert.equal(insertedHierarchyRows, 628, "toutes les entrées SmartArt sont publiées");

const wars = COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_ARTICLES[0];
assert.equal(wars.id, "realite-v9-guerres-corporatives", "page des guerres en tête du lot");
assert.equal(wars.sections.length, 3, "trois guerres corporatives");
const warSentinels = {
  congo: ["Liao Kashiwa", "Tiger", "Herbrews", "Redwheels", "Dreampoint"],
  mexique: ["Corebank", "Tortoise security", "Yellowfood", "Panamerica bank", "Falenjo army", "Raven Corporation", "Ushkoll security"],
  israel: ["Biosun", "Asco", "Firstlawyers Inc.", "Phoenix", "Sunways", "Dwarfood", "Pixy security", "Wellspring"]
};
for (const section of wars.sections) {
  assert.equal(section.blocks[0].type, "table", `${section.id}: camps convertis en tableau`);
  assert.deepEqual(section.blocks[0].rows[0], ["Camp", "Corporations"], `${section.id}: en-tête des camps`);
  const text = flatten(section);
  for (const sentinel of warSentinels[section.id]) {
    assert.ok(text.includes(sentinel), `${section.id}: participant perdu (${sentinel})`);
  }
}

const hub = COMPENDIUM_REALITE_V9_CORPORATIONS_EDITORIAL_HUB_ENRICHMENT;
const chronology = hub.sections.find((section) => section.id === "corporations-source-chronologie");
assert.deepEqual(
  chronology.blocks[0].rows.map((row) => row[0]),
  ["Année", "2019", "2020", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2030"],
  "chronologie structurée sans année perdue"
);
const families = hub.sections.find((section) => section.id === "corporations-source-familles");
assert.equal(families.blocks[0].rows.length, 9, "huit familles corporatives structurées");
const inventory = hub.sections.find((section) => section.id === "corporations-source-inventaire");
assert.equal(inventory.title, "Panorama des corporations", "titre éditorial du panorama");
assert.equal(inventory.blocks[1].rows.length, 35, "34 fiches développées recensées");
assert.equal(inventory.blocks[3].rows.length, 27, "26 noms sans développement recensés");
assert.doesNotMatch(
  flatten(hub.sections.map((section) => section.blocks)),
  /Organigramme source|transcription linéaire|fiches? développées?|inachevée|Citée dans le document/iu,
  "voix de fabrication retirée du hub"
);

assert.equal(
  COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_ARTICLES.length,
  COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_NAVIGATION.length,
  "articles et navigation PNJ restent alignés"
);
assert.ok(COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_ARTICLES.length >= 69, "au moins 69 fiches PNJ préservées");
assert.deepEqual(
  COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_ARTICLES.map((article) => article.id).toSorted(),
  COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_NAVIGATION.map((entry) => entry.id).toSorted(),
  "identifiants PNJ et navigation préservés"
);

console.log(
  `REALITY CORPORATIONS LORE OK — 35 pages · ${paragraphCount} paragraphes · ${tableCount} tableaux · 628 entrées d’organigramme · plus long paragraphe ${longestParagraph} caractères · ${COMPENDIUM_REALITE_V9_CORPORATIONS_PNJ_ARTICLES.length} fiches PNJ préservées`
);
