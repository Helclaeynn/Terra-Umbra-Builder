import assert from "node:assert/strict";

import {
  COMPENDIUM_REALITE_V9_AGENCIES_HUB,
  COMPENDIUM_REALITE_V9_AGENCIES_ARTICLES,
  COMPENDIUM_REALITE_V9_AGENCIES_NAVIGATION
} from "../dist/compendium-realite-v9-agencies.js";
import {
  COMPENDIUM_REALITE_V9_GOVERNMENT_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_GOVERNMENT_ARTICLES,
  COMPENDIUM_REALITE_V9_GOVERNMENT_NAVIGATION
} from "../dist/compendium-realite-v9-government.js";
import {
  COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLE_ENRICHMENTS,
  COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLES,
  COMPENDIUM_REALITE_V9_CRAWLERS_NAVIGATION
} from "../dist/compendium-realite-v9-crawlers.js";
import {
  COMPENDIUM_VERITE_ANGELUS_ARTICLES,
  COMPENDIUM_VERITE_ANGELUS_ENRICHMENTS,
  COMPENDIUM_VERITE_ANGELUS_NAVIGATION
} from "../dist/compendium-verite-angelus-source.js";
import {
  COMPENDIUM_VERITE_LOGES_MAGES_HUB_SECTIONS,
  COMPENDIUM_VERITE_LOGES_MAGES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_LOGES_MAGES_PNJ_NAVIGATION
} from "../dist/compendium-verite-loges-mages.js";
import {
  COMPENDIUM_REALITE_V9_AGENCIES_EDITORIAL_HUB,
  COMPENDIUM_REALITE_V9_AGENCIES_EDITORIAL_ARTICLES,
  COMPENDIUM_REALITE_V9_GOVERNMENT_EDITORIAL_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_GOVERNMENT_EDITORIAL_ARTICLES,
  COMPENDIUM_REALITE_V9_CRAWLERS_EDITORIAL_HUB_SECTIONS,
  COMPENDIUM_REALITE_V9_CRAWLERS_EDITORIAL_ARTICLE_ENRICHMENTS,
  COMPENDIUM_VERITE_ANGELUS_EDITORIAL_ARTICLES,
  COMPENDIUM_VERITE_ANGELUS_EDITORIAL_ENRICHMENTS,
  COMPENDIUM_VERITE_LOGES_MAGES_EDITORIAL_HUB_SECTIONS
} from "../dist/compendium-import-voice-institutions-editorial.js";
import {
  COMPENDIUM_REALITE_V9_AGENCIES_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_AGENCIES_PNJ_NAVIGATION
} from "../dist/compendium-realite-v9-agencies-pnj.js";
import {
  COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_NAVIGATION
} from "../dist/compendium-realite-v9-government-pnj.js";
import {
  COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_ARTICLES,
  COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_NAVIGATION
} from "../dist/compendium-realite-v9-crawlers-pnj.js";
import {
  COMPENDIUM_VERITE_ANGELUS_PNJ_ARTICLES,
  COMPENDIUM_VERITE_ANGELUS_PNJ_NAVIGATION
} from "../dist/compendium-verite-angelus-pnj.js";

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};
const withoutSections = ({ sections: _sections, ...entry }) => entry;
const sectionStructure = (entry) =>
  (entry.sections ?? []).map(({ id, title, level, audience, blocks }) => ({
    id,
    title,
    level,
    audience,
    blockTypes: (blocks ?? []).map((block) => block.type),
    rowShapes: (blocks ?? []).map((block) =>
      block.type === "table" ? (block.rows ?? []).map((row) => row.length) : null
    )
  }));

const groups = [
  {
    name: "agences",
    source: [COMPENDIUM_REALITE_V9_AGENCIES_ARTICLES, [COMPENDIUM_REALITE_V9_AGENCIES_HUB]],
    editorial: [
      COMPENDIUM_REALITE_V9_AGENCIES_EDITORIAL_ARTICLES,
      [COMPENDIUM_REALITE_V9_AGENCIES_EDITORIAL_HUB]
    ],
    expectedParagraphs: 14,
    expectedCells: 5
  },
  {
    name: "gouvernement",
    source: [
      COMPENDIUM_REALITE_V9_GOVERNMENT_ARTICLES,
      [{ sections: COMPENDIUM_REALITE_V9_GOVERNMENT_HUB_SECTIONS }]
    ],
    editorial: [
      COMPENDIUM_REALITE_V9_GOVERNMENT_EDITORIAL_ARTICLES,
      [{ sections: COMPENDIUM_REALITE_V9_GOVERNMENT_EDITORIAL_HUB_SECTIONS }]
    ],
    expectedParagraphs: 11,
    expectedCells: 0
  },
  {
    name: "crawlers",
    source: [
      [{ sections: COMPENDIUM_REALITE_V9_CRAWLERS_HUB_SECTIONS }],
      COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLE_ENRICHMENTS
    ],
    editorial: [
      [{ sections: COMPENDIUM_REALITE_V9_CRAWLERS_EDITORIAL_HUB_SECTIONS }],
      COMPENDIUM_REALITE_V9_CRAWLERS_EDITORIAL_ARTICLE_ENRICHMENTS
    ],
    expectedParagraphs: 3,
    expectedCells: 0
  },
  {
    name: "angelus",
    source: [COMPENDIUM_VERITE_ANGELUS_ARTICLES, COMPENDIUM_VERITE_ANGELUS_ENRICHMENTS],
    editorial: [
      COMPENDIUM_VERITE_ANGELUS_EDITORIAL_ARTICLES,
      COMPENDIUM_VERITE_ANGELUS_EDITORIAL_ENRICHMENTS
    ],
    expectedParagraphs: 13,
    expectedCells: 14
  },
  {
    name: "loges",
    source: [[{ sections: COMPENDIUM_VERITE_LOGES_MAGES_HUB_SECTIONS }]],
    editorial: [[{ sections: COMPENDIUM_VERITE_LOGES_MAGES_EDITORIAL_HUB_SECTIONS }]],
    expectedParagraphs: 7,
    expectedCells: 0
  }
];

let changedParagraphs = 0;
let changedCells = 0;
for (const group of groups) {
  let groupParagraphs = 0;
  let groupCells = 0;
  for (const [collectionIndex, sourceEntries] of group.source.entries()) {
    const editorialEntries = group.editorial[collectionIndex];
    assert.equal(editorialEntries.length, sourceEntries.length, `${group.name}: nombre d’entrées`);
    assert.deepEqual(
      editorialEntries.map(withoutSections),
      sourceEntries.map(withoutSections),
      `${group.name}: métadonnées préservées`
    );
    assert.deepEqual(
      editorialEntries.map(sectionStructure),
      sourceEntries.map(sectionStructure),
      `${group.name}: structure préservée`
    );

    for (const [entryIndex, sourceEntry] of sourceEntries.entries()) {
      const editedEntry = editorialEntries[entryIndex];
      for (const [sectionIndex, sourceSection] of (sourceEntry.sections ?? []).entries()) {
        const editedSection = editedEntry.sections[sectionIndex];
        for (const [blockIndex, sourceBlock] of (sourceSection.blocks ?? []).entries()) {
          const editedBlock = editedSection.blocks[blockIndex];
          if (sourceBlock.type === "p") {
            if (sourceBlock.text !== editedBlock.text) {
              groupParagraphs += 1;
              assert.ok(editedBlock.text.length <= 600, `${group.name}: remplacement trop long`);
            } else {
              assert.deepEqual(editedBlock, sourceBlock, `${group.name}: paragraphe hors cible modifié`);
            }
          } else if (sourceBlock.type === "table") {
            for (const [rowIndex, row] of sourceBlock.rows.entries()) {
              for (const [cellIndex, cell] of row.entries()) {
                if (cell !== editedBlock.rows[rowIndex][cellIndex]) groupCells += 1;
              }
            }
          } else {
            assert.deepEqual(editedBlock, sourceBlock, `${group.name}: bloc hors cible modifié`);
          }
        }
      }
    }
  }
  assert.equal(groupParagraphs, group.expectedParagraphs, `${group.name}: paragraphes corrigés`);
  assert.equal(groupCells, group.expectedCells, `${group.name}: cellules corrigées`);
  changedParagraphs += groupParagraphs;
  changedCells += groupCells;
}

const editorialCorpus = groups.flatMap((group) => group.editorial.flat());
const sourceCorpus = groups.flatMap((group) => group.source.flat());
const editorialText = flatten(editorialCorpus);
const sourceText = flatten(sourceCorpus);
const forbiddenImportVoice = /\b(?:(?:le|la|ce|cette|du|au|dans le|dans cette|selon le|selon la|d’après le|d’après la|par le|par la|par ce|par cette)\s+(?:document|fichier|pdf|corpus)|(?:le|la|cette|dans cette)\s+source\s+(?:cite|décrit|présente|mentionne|indique|signale|montre|précise|renseigne|fournit|distingue|emploie|rapporte|souligne|considère|donne|assume|affirme|estime|renvoie|insiste)|figures?\s+séraphiques\s+documentées?\s+dans\s+cette\s+source|variantes?\s+de\s+source|liste\s+synthétique\s+du\s+document|intertitre\s+de\s+la\s+source|carte\s+source|sert\s+dans\s+la\s+source|fait\s+établi\s+par\s+cette\s+source|attestées?\s+par\s+la\s+source|documentées?\s+par\s+la\s+présente\s+source)\b/iu;
assert.doesNotMatch(editorialText, forbiddenImportVoice, "aucune voix d’import résiduelle dans le lot");
assert.equal(
  (editorialText.match(/[�￾]/gu) ?? []).length,
  (sourceText.match(/[�￾]/gu) ?? []).length,
  "aucun glyphe endommagé supplémentaire introduit"
);

for (const sentinel of [
  "vingt-cinq profils",
  "Ikasha",
  "Tasunke",
  "NaCa Security",
  "Tala Corporation",
  "Seul-Ki Kae",
  "Gavin Clay",
  "Luna Eckelberg",
  "Nehemiah Sellers",
  "Leslie Wright",
  "500 000 personnes",
  "Fixers",
  "Gundrivers",
  "Purim",
  "Malkouth",
  "Treize Anges",
  "Loge de New-York"
]) {
  assert.ok(editorialText.includes(sentinel), `repère canonique perdu (${sentinel})`);
}

assert.equal(COMPENDIUM_REALITE_V9_AGENCIES_NAVIGATION.length, COMPENDIUM_REALITE_V9_AGENCIES_ARTICLES.length);
assert.equal(COMPENDIUM_REALITE_V9_GOVERNMENT_NAVIGATION.length, COMPENDIUM_REALITE_V9_GOVERNMENT_ARTICLES.length);
assert.equal(COMPENDIUM_REALITE_V9_CRAWLERS_NAVIGATION.length, COMPENDIUM_REALITE_V9_CRAWLERS_ARTICLES.length);
assert.equal(COMPENDIUM_VERITE_ANGELUS_NAVIGATION.length, COMPENDIUM_VERITE_ANGELUS_ARTICLES.length);

const pnjGroups = [
  ["agences", COMPENDIUM_REALITE_V9_AGENCIES_PNJ_ARTICLES, COMPENDIUM_REALITE_V9_AGENCIES_PNJ_NAVIGATION],
  ["gouvernement", COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ARTICLES, COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_NAVIGATION],
  ["crawlers", COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_ARTICLES, COMPENDIUM_REALITE_V9_CRAWLERS_PNJ_NAVIGATION],
  ["angelus", COMPENDIUM_VERITE_ANGELUS_PNJ_ARTICLES, COMPENDIUM_VERITE_ANGELUS_PNJ_NAVIGATION],
  ["loges", COMPENDIUM_VERITE_LOGES_MAGES_PNJ_ARTICLES, COMPENDIUM_VERITE_LOGES_MAGES_PNJ_NAVIGATION]
];
let preservedPnjCount = 0;
for (const [name, articles, navigation] of pnjGroups) {
  assert.equal(articles.length, navigation.length, `${name}: articles et navigation PNJ alignés`);
  preservedPnjCount += articles.length;
}

assert.equal(changedParagraphs, 48, "48 paragraphes éditorialisés");
assert.equal(changedCells, 19, "19 cellules éditorialisées");
assert.equal(preservedPnjCount, 275, "275 profils PNJ préservés");
console.log(
  `IMPORT VOICE INSTITUTIONS OK — 48 paragraphes · 19 cellules · ${preservedPnjCount} profils PNJ préservés`
);
