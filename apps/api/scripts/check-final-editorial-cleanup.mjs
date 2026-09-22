import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const API_ROOT = fileURLToPath(new URL("../", import.meta.url));
process.chdir(API_ROOT);

const {
  FINAL_EDITORIAL_CLEANUP_RULES,
  FINAL_EDITORIAL_CLEANUP_EXPECTED,
  applyFinalEditorialCleanup
} = await import("../dist/compendium-final-editorial-cleanup.js");

const sourceFiles = [];
const visit = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      visit(path);
      continue;
    }
    if (!entry.name.endsWith(".ts")) continue;
    if (entry.name.includes("-pnj") || entry.name.includes("-payload")) continue;
    if (entry.name === "compendium-final-editorial-cleanup.ts") continue;
    sourceFiles.push(path);
  }
};
visit(resolve(API_ROOT, "src"));
const sourceCorpus = sourceFiles.map((path) => readFileSync(path, "utf8")).join("\n");

const count = (values, expected) => values.filter((value) => value === expected).length;
const collect = (article) => ({
  sectionTitles: (article.sections ?? []).map((section) => String(section.title ?? "")),
  paragraphs: (article.sections ?? []).flatMap((section) =>
    (section.blocks ?? [])
      .filter((block) => block?.type === "p")
      .map((block) => String(block.text ?? ""))
  ),
  cells: (article.sections ?? []).flatMap((section) =>
    (section.blocks ?? [])
      .filter((block) => block?.type === "table")
      .flatMap((block) => (block.rows ?? []).flat().map((cell) => String(cell ?? "")))
  )
});

let checkedParagraphs = 0;
let checkedSectionTitles = 0;
let checkedCells = 0;
const targetedIds = new Set();

for (const rule of FINAL_EDITORIAL_CLEANUP_RULES) {
  assert.ok(!targetedIds.has(rule.articleId), `${rule.articleId}: règle dupliquée`);
  targetedIds.add(rule.articleId);
  assert.ok(!rule.articleId.startsWith("pnj-"), `${rule.articleId}: un PNJ ne doit jamais être ciblé`);
  assert.ok(sourceCorpus.includes(rule.articleId), `${rule.articleId}: identifiant absent des sources non-PNJ`);

  const fixture = {
    id: rule.articleId,
    sections: [
      {
        id: "paragraphs-and-cells",
        title: "Fixture",
        level: 2,
        blocks: [
          ...(rule.paragraphs ?? []).map(([source]) => ({ type: "p", text: source })),
          ...((rule.cells?.length ?? 0) > 0
            ? [{ type: "table", rows: (rule.cells ?? []).map(([source]) => [source]) }]
            : [])
        ]
      },
      ...(rule.sectionTitles ?? []).map(([source], index) => ({
        id: `title-${index}`,
        title: source,
        level: 2,
        blocks: []
      }))
    ]
  };

  for (const [source] of [
    ...(rule.paragraphs ?? []),
    ...(rule.sectionTitles ?? []),
    ...(rule.cells ?? [])
  ]) {
    assert.ok(sourceCorpus.includes(source), `${rule.articleId}: formulation source absente du corpus`);
  }

  const stats = applyFinalEditorialCleanup(fixture);
  assert.deepEqual(
    stats,
    {
      paragraphs: rule.paragraphs?.length ?? 0,
      sectionTitles: rule.sectionTitles?.length ?? 0,
      cells: rule.cells?.length ?? 0
    },
    `${rule.articleId}: nombre de remplacements`
  );

  const edited = collect(fixture);
  for (const [source, replacement] of rule.paragraphs ?? []) {
    assert.equal(count(edited.paragraphs, source), 0, `${rule.articleId}: ancien paragraphe conservé`);
    assert.equal(count(edited.paragraphs, replacement), 1, `${rule.articleId}: paragraphe corrigé absent`);
    checkedParagraphs += 1;
  }
  for (const [source, replacement] of rule.sectionTitles ?? []) {
    assert.equal(count(edited.sectionTitles, source), 0, `${rule.articleId}: ancien titre conservé`);
    assert.equal(count(edited.sectionTitles, replacement), 1, `${rule.articleId}: titre corrigé absent`);
    checkedSectionTitles += 1;
  }
  for (const [source, replacement] of rule.cells ?? []) {
    assert.equal(count(edited.cells, source), 0, `${rule.articleId}: ancienne cellule conservée`);
    assert.equal(count(edited.cells, replacement), 1, `${rule.articleId}: cellule corrigée absente`);
    checkedCells += 1;
  }
}

assert.deepEqual(
  { paragraphs: checkedParagraphs, sectionTitles: checkedSectionTitles, cells: checkedCells },
  FINAL_EDITORIAL_CLEANUP_EXPECTED,
  "toutes les corrections attendues sont contrôlées"
);
assert.deepEqual(
  FINAL_EDITORIAL_CLEANUP_EXPECTED,
  { paragraphs: 17, sectionTitles: 5, cells: 3 },
  "périmètre éditorial verrouillé"
);

console.log(
  `FINAL EDITORIAL CLEANUP OK — ${targetedIds.size} pages · ${checkedParagraphs} paragraphes · ${checkedSectionTitles} titres · ${checkedCells} cellules · 0 PNJ ciblé`
);
