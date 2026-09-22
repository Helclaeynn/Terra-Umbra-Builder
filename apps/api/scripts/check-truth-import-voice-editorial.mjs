import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES,
  COMPENDIUM_VERITE_SPECIES_LORE_NAVIGATION,
  COMPENDIUM_VERITE_SPECIES_ENRICHMENTS
} from "../dist/compendium-verite-species-lore.js";
import {
  COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES,
  COMPENDIUM_VERITE_FANTASTIQUES_NAVIGATION,
  COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS
} from "../dist/compendium-verite-fantastiques-lore.js";
import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION,
  COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS
} from "../dist/compendium-verite-extraterrestres-lore.js";
import {
  COMPENDIUM_VERITE_SPECIES_EDITORIAL_ARTICLES,
  COMPENDIUM_VERITE_SPECIES_EDITORIAL_ENRICHMENTS,
  COMPENDIUM_VERITE_FANTASTIQUES_EDITORIAL_ARTICLES,
  COMPENDIUM_VERITE_FANTASTIQUES_EDITORIAL_ENRICHMENTS,
  COMPENDIUM_VERITE_EXTRATERRESTRES_EDITORIAL_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_EDITORIAL_ENRICHMENTS
} from "../dist/compendium-verite-import-voice-editorial.js";
import {
  COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_SPECIES_PNJ_NAVIGATION
} from "../dist/compendium-verite-species-pnj.js";
import {
  COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_FANTASTIQUES_PNJ_NAVIGATION
} from "../dist/compendium-verite-fantastiques-pnj.js";
import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION
} from "../dist/compendium-verite-extraterrestres-pnj.js";

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
    blockTypes: (blocks ?? []).map((block) => block.type)
  }));

const importVoice = /\b(?:le|la|ce|cette|du|au|dans le|selon le|d’après le) (?:document|fichier|pdf|source|corpus)\b|\b(?:document|fichier|pdf|source|corpus) (?:cite|cité|décrit|présente|mentionne|indique|signale|montre|précise|renseigne|fournit|nomme|appelle|ajoute|contient|distingue|qualifie|emploie|traite|développe|aborde|s’arrête|oppose|rapporte|souligne|considère|donne|sait)\b|datation donnée par la source|non renseignés dans le document|mentions « \?\?\? » de la source/iu;

const groups = [
  {
    name: "espèces terrestres",
    source: [COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES, COMPENDIUM_VERITE_SPECIES_ENRICHMENTS],
    editorial: [COMPENDIUM_VERITE_SPECIES_EDITORIAL_ARTICLES, COMPENDIUM_VERITE_SPECIES_EDITORIAL_ENRICHMENTS],
    expectedParagraphs: 6,
    expectedCells: 0
  },
  {
    name: "peuples fantastiques",
    source: [COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES, COMPENDIUM_VERITE_FANTASTIQUES_ENRICHMENTS],
    editorial: [COMPENDIUM_VERITE_FANTASTIQUES_EDITORIAL_ARTICLES, COMPENDIUM_VERITE_FANTASTIQUES_EDITORIAL_ENRICHMENTS],
    expectedParagraphs: 12,
    expectedCells: 1
  },
  {
    name: "peuples extraterrestres",
    source: [COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES, COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS],
    editorial: [COMPENDIUM_VERITE_EXTRATERRESTRES_EDITORIAL_ARTICLES, COMPENDIUM_VERITE_EXTRATERRESTRES_EDITORIAL_ENRICHMENTS],
    expectedParagraphs: 6,
    expectedCells: 2
  }
];

let changedParagraphs = 0;
let changedCells = 0;
for (const group of groups) {
  let groupParagraphs = 0;
  let groupCells = 0;
  for (let collectionIndex = 0; collectionIndex < group.source.length; collectionIndex += 1) {
    const sourceEntries = group.source[collectionIndex];
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
      `${group.name}: structure des sections préservée`
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
              assert.match(sourceBlock.text, importVoice, `${group.name}: ancienne formulation ciblée`);
              assert.doesNotMatch(editedBlock.text, importVoice, `${group.name}: voix d’import retirée`);
              assert.ok(editedBlock.text.length <= 600, `${group.name}: remplacement trop long`);
            } else {
              assert.deepEqual(editedBlock, sourceBlock, `${group.name}: paragraphe hors cible modifié`);
            }
          } else if (sourceBlock.type === "table") {
            assert.equal(editedBlock.rows.length, sourceBlock.rows.length, `${group.name}: lignes de tableau`);
            for (const [rowIndex, row] of sourceBlock.rows.entries()) {
              assert.equal(editedBlock.rows[rowIndex].length, row.length, `${group.name}: cellules de tableau`);
              for (const [cellIndex, cell] of row.entries()) {
                const editedCell = editedBlock.rows[rowIndex][cellIndex];
                if (cell !== editedCell) {
                  groupCells += 1;
                  assert.match(String(cell), importVoice, `${group.name}: ancienne cellule ciblée`);
                  assert.doesNotMatch(String(editedCell), importVoice, `${group.name}: cellule éditorialisée`);
                }
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

const editorialBlocks = groups.flatMap((group) =>
  group.editorial.flatMap((entries) =>
    entries.flatMap((entry) => (entry.sections ?? []).flatMap((section) => section.blocks ?? []))
  )
);
assert.doesNotMatch(flatten(editorialBlocks), importVoice, "aucune voix d’import résiduelle dans les trois corpus");
assert.doesNotMatch(flatten(editorialBlocks), /[�￾]/u, "aucun glyphe endommagé introduit");

const sentinels = [
  "Liches",
  "Golems",
  "Zoanides",
  "Duergars",
  "imaginaire lovecraftien",
  "trois sièges elfiques",
  "papillon vert",
  "Elyë",
  "Ashylls",
  "Thulkars",
  "Azménoriens",
  "Triphoriens",
  "Letrophodiens",
  "wolféennes",
  "Talass",
  "Mo’sens",
  "Baséanhs",
  "Rocréens",
  "Thalsios"
];
const editorialText = flatten(editorialBlocks);
for (const sentinel of sentinels) {
  assert.ok(editorialText.includes(sentinel), `repère canonique perdu (${sentinel})`);
}

assert.equal(COMPENDIUM_VERITE_SPECIES_LORE_NAVIGATION.length, COMPENDIUM_VERITE_SPECIES_LORE_ARTICLES.length);
assert.equal(COMPENDIUM_VERITE_FANTASTIQUES_NAVIGATION.length, COMPENDIUM_VERITE_FANTASTIQUES_ARTICLES.length);
assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION.length, COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES.length);

for (const [name, articles, navigation, minimum] of [
  ["espèces", COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES, COMPENDIUM_VERITE_SPECIES_PNJ_NAVIGATION, 68],
  ["fantastiques", COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES, COMPENDIUM_VERITE_FANTASTIQUES_PNJ_NAVIGATION, 52],
  ["extraterrestres", COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES, COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION, 62]
]) {
  assert.equal(articles.length, navigation.length, `${name}: articles et navigation PNJ alignés`);
  assert.ok(articles.length >= minimum, `${name}: profils PNJ préservés`);
}

assert.equal(changedParagraphs, 24, "24 paragraphes éditorialisés");
assert.equal(changedCells, 3, "3 cellules éditorialisées");
const preservedPnjCount =
  COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES.length +
  COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES.length +
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.length;
console.log(
  `TRUTH IMPORT VOICE EDITORIAL OK — 19 entrées · ${changedParagraphs} paragraphes · ${changedCells} cellules · ${preservedPnjCount} profils PNJ préservés`
);
