import assert from "node:assert/strict";
import fs from "node:fs";

import {
  INLINE_BULLET_TARGETS,
  LONG_PARAGRAPH_TARGETS,
  applyLoreQualityCleanup,
  removeInternalPublicMetadata
} from "../dist/compendium-lore-quality-cleanup.js";
import { COMPENDIUM_VERITE_V7_PASS_B_ARTICLES } from "../dist/compendium-verite-v7-pass-b.js";

const norm = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const articleText = (article) => (article.sections ?? []).flatMap((section) =>
  (section.blocks ?? []).flatMap((block) => {
    if (block?.type === "p") return [String(block.text ?? "")];
    if (block?.type === "table") return (block.rows ?? []).flat().map(String);
    return [];
  })
).join(" ");

assert.equal(LONG_PARAGRAPH_TARGETS.size, 18, "18 pages longues ciblées");
assert.equal(INLINE_BULLET_TARGETS.size, 14, "14 pages à listes compactées ciblées");

const longText = [
  "Une première phrase assez longue décrit le contexte sans rien retirer.",
  "Une deuxième phrase poursuit la démonstration et conserve chaque information utile.",
  "Une troisième phrase ajoute encore du contenu afin de dépasser volontairement le seuil de contrôle."
].join(" ").repeat(8);

const fixture = {
  id: "verite-v7-aseryns-serathe-atlantide-treize",
  category: "Vérité",
  title: "Aseryns",
  source: "document-secret.docx",
  sourceCategory: "Vérité",
  rebuildV2: true,
  loreBook: { internal: true },
  sections: [
    { id: "duplicate", title: "Les Treize", blocks: [{ type: "p", text: `grands￾parents ${longText} • Premier élément • Second élément` }] },
    { id: "empty", title: "Coquille vide", blocks: [] },
    { id: "duplicate", title: "Les Treize", blocks: [{ type: "p", text: "Complément conservé." }] }
  ]
};

const before = norm(articleText(fixture).replace(/￾/gu, "-"));
const stats = applyLoreQualityCleanup(fixture);
const after = norm(articleText(fixture));
assert.equal(after, before, "le texte normalisé est intégralement conservé");
assert.equal(new Set(fixture.sections.map((section) => section.id)).size, fixture.sections.length, "sections uniques");
assert.ok(fixture.sections.every((section) => section.blocks.length), "aucune section vide");
assert.doesNotMatch(JSON.stringify(fixture), /[�￾]/u, "aucun glyphe corrompu");
assert.ok(
  fixture.sections.flatMap((section) => section.blocks).filter((block) => block.type === "p").every((block) => block.text.length <= 600),
  "aucun paragraphe ciblé au-dessus de 600 caractères"
);
assert.ok(stats.damagedGlyphs === 1 && stats.mergedSections === 1 && stats.removedEmptySections === 1);
assert.ok(stats.splitParagraphs > 0 && stats.splitBulletLists === 1);

removeInternalPublicMetadata(fixture);
for (const key of ["source", "sourceCategory", "rebuildV2", "loreBook", "legacyTargetId", "__searchText"]) {
  assert.ok(!Object.hasOwn(fixture, key), `métadonnée publique retirée : ${key}`);
}

const delanial = COMPENDIUM_VERITE_V7_PASS_B_ARTICLES.find((article) => article.id === "verite-v7-delanial-pere-ombre");
assert.ok(delanial, "page Delanial présente");
assert.match(articleText(delanial), /aucune Source de Corruption Delanial/u, "garde Delanial explicite");
const mergedDelanial = {
  id: "verite-v7-delanial-pere-ombre",
  category: "Vérité",
  sections: [{ id: "classification", blocks: [{ type: "p", text: "Delanial n’est pas un Fléau." }] }]
};
applyLoreQualityCleanup(mergedDelanial);
assert.match(articleText(mergedDelanial), /aucune Source de Corruption Delanial/u, "classification Delanial conservée après fusion");

for (const file of ["apps/web/src/lib/wiki-data.ts", "compendium/onboarding-data.js"]) {
  assert.match(fs.readFileSync(new URL(`../../../${file}`, import.meta.url), "utf8"), /['"]Cycle['"]\s*:\s*['"]verite-033-le-cycle-le-neant-et-ce-que-la-mort-revele['"]/u, `${file}: alias Cycle`);
}

console.log(
  `LORE QUALITY CLEANUP OK — ${LONG_PARAGRAPH_TARGETS.size} pages longues · ${INLINE_BULLET_TARGETS.size} listes compactées · structure, glyphes, Delanial, Cycle et métadonnées publiques contrôlés`
);
