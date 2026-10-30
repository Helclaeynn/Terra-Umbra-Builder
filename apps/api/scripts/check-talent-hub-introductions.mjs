import assert from "node:assert/strict";

import { generatedTalentHubCorpus } from "../dist/compendium-talent-hubs.js";
import { talentRegistryMeta } from "../dist/rules/talent-registry.js";

const EXPECTED = new Map([
  ["regles-verite-chasseur-lavandieres", ["humain", "Lavandières — tradition vampirique de Chasse"]],
  ["regles-verite-chasseur-catholiques", ["humain", "Chasseurs catholiques"]],
  ["regles-verite-chasseur-khalsa", ["humain", "Khālsā — Serment, protection et liberté"]],
  ["regles-verite-chasseur-taoistes", ["humain", "Taoïstes — Gu, Shimazu et secrets Shi"]],
  ["regles-verite-chasseur-kabbale", ["humain", "Kabbale — les Dix Sephiroth"]],
  ["regles-verite-chasseur-nizarites-asasiyun", ["humain", "Nizarites / Asāsīyūn — Arts du Djinn et doctrine de chasse"]],
  ["regles-verite-chasseur-onmyoji", ["humain", "Onmyoji — Shikigami, sceaux et pactes spirituels"]],
  ["regles-verite-chasseur-neopaiens", ["humain", "Néopaïens — pratiques communes et Mystères"]],
  ["regles-verite-chasseur-chasse-fantastique", ["humain", "Chasse Fantastique — la Vénerie surnaturelle"]],
  ["regles-verite-chasseur-lueurs-azmenor", ["humain", "Lueurs d’Azménor — visions et Néant"]],
  ["regles-verite-chasseur-xenoshield", ["humain", "Xenoshield — contre-intrusion Extral"]],
  ["regles-verite-chasseur-independants", ["humain", "Chasseurs indépendants — Héritages modulaires"]],
  ["regles-verite-chasseur-table-ronde", ["humain", "Table Ronde — lignées et armes de Merlin"]],
  ["regles-verite-extral-protocoles-de-continuite", ["extral", "Protocoles de Continuité — 7 PTV"]]
]);

const corpus = generatedTalentHubCorpus();
const registryMeta = talentRegistryMeta();

assert.equal(corpus.articles.length, 14, "14 hubs éditoriaux attendus");
assert.equal(corpus.navigation.length, 14, "14 entrées de navigation attendues");
assert.deepEqual(
  corpus.navigation.map((entry) => entry.id),
  corpus.articles.map((article) => article.id),
  "articles et navigation alignés"
);

let catalogueRows = 0;
let editorialParagraphs = 0;
let talentCount = 0;

for (const article of corpus.articles) {
  const expected = EXPECTED.get(article.id);
  assert.ok(expected, `${article.id}: hub attendu`);
  const [natureId, prefix] = expected;

  assert.equal(article.dataset, "generated-talents", `${article.id}: dataset`);
  assert.equal(article.category, "Règles", `${article.id}: catégorie`);
  assert.equal(article.sourceCategory, "Règles", `${article.id}: catégorie source`);
  assert.equal(article.status, "canon_enrichi", `${article.id}: statut`);
  assert.equal(article.rebuildV2, true, `${article.id}: page V2 active`);
  assert.equal(article.__generatedTalentHub, true, `${article.id}: marqueur de hub généré`);
  assert.ok(article.source.includes("Builder V2"), `${article.id}: registre source`);
  assert.ok(
    article.source.includes(
      article.id === "regles-verite-extral-protocoles-de-continuite"
        ? "TUC_Extrals_AIDH_Adrak_V1.docx"
        : "TUC_Chasseurs_V1_finalise.docx"
    ),
    `${article.id}: document canonique source`
  );

  const registryTotal = registryMeta.groups
    .filter(
      (group) =>
        group.natureId === natureId &&
        (group.label === prefix || group.label.startsWith(prefix + " ›"))
    )
    .reduce((total, group) => total + group.count, 0);
  assert.ok(registryTotal > 0, `${article.id}: famille présente dans le registre`);

  assert.equal(article.sections.length, 3, `${article.id}: catalogue et deux sections de principes`);
  assert.ok(article.sections.every((section) => section.level === 2), `${article.id}: sections éditoriales de niveau 2`);

  const catalogue = article.sections[0];
  assert.equal(catalogue.id, "catalogue-canonique", `${article.id}: identifiant du catalogue`);
  assert.equal(catalogue.title, `Un catalogue canonique de ${registryTotal} Talents`, `${article.id}: titre du catalogue`);
  assert.equal(catalogue.blocks.length, 2, `${article.id}: tableau et note de frontière`);
  assert.equal(catalogue.blocks[0].type, "table", `${article.id}: tableau des voies`);
  assert.deepEqual(catalogue.blocks[0].rows[0], ["Voie", "Nombre"], `${article.id}: en-têtes du tableau`);
  assert.deepEqual(catalogue.blocks[0].rows.at(-1), ["Total", String(registryTotal)], `${article.id}: total du tableau`);

  const bodyRows = catalogue.blocks[0].rows.slice(1, -1);
  assert.ok(bodyRows.length >= 1, `${article.id}: au moins une voie`);
  assert.equal(
    bodyRows.reduce((total, row) => total + Number(row[1]), 0),
    registryTotal,
    `${article.id}: somme des voies`
  );
  catalogueRows += bodyRows.length;
  talentCount += registryTotal;

  const boundary = catalogue.blocks[1];
  assert.equal(boundary.type, "p", `${article.id}: note de frontière textuelle`);
  assert.match(boundary.text, /coûts, prérequis, effets/iu, `${article.id}: périmètre mécanique explicite`);
  assert.match(boundary.text, /Builder/iu, `${article.id}: renvoi vers le Builder`);
  assert.match(boundary.text, /n’est pas recopié ici/iu, `${article.id}: absence de duplication explicite`);

  for (const section of article.sections.slice(1)) {
    assert.ok(section.id && section.title, `${article.id}: section éditoriale nommée`);
    assert.equal(section.blocks.length, 2, `${article.id}: deux paragraphes par principe`);
    for (const block of section.blocks) {
      assert.equal(block.type, "p", `${article.id}: prose éditoriale uniquement`);
      assert.ok(block.text.length >= 110, `${article.id}: paragraphe trop court`);
      assert.ok(block.text.length <= 650, `${article.id}: paragraphe trop long`);
      assert.doesNotMatch(block.text, /[�￾]/u, `${article.id}: glyphe endommagé`);
      editorialParagraphs += 1;
    }
  }

  const serialized = JSON.stringify(article);
  assert.doesNotMatch(serialized, /\{\{Talents\|/u, `${article.id}: aucun widget de fiches détaillées`);
  assert.doesNotMatch(serialized, /"mechanics"|"cost"|"access"/u, `${article.id}: aucune fiche mécanique recopiée`);
}

assert.equal(catalogueRows, 58, "58 voies éditoriales synthétisées");
assert.equal(editorialParagraphs, 56, "quatre paragraphes de principes pour chacun des 14 hubs");
assert.equal(talentCount, 266, "266 Talents comptés sans recopier leurs fiches");

const allText = corpus.articles
  .flatMap((article) => article.sections)
  .flatMap((section) => section.blocks)
  .filter((block) => block.type === "p")
  .map((block) => block.text)
  .join(" ");

for (const sentinel of [
  "ne sont pas les réincarnations",
  "Sephirien demeure strictement hors progression PJ",
  "La foudre exceptionnelle de Koji n’est pas une capacité générique",
  "Une Menace n’est jamais une détection du Mal",
  "elle ne détecte pas les « méchants aliens »",
  "ils n’achètent pas la créature",
  "ne sont pas achetés en PTV",
  "quatre Talents pour 7 PTV"
]) {
  assert.ok(allText.includes(sentinel), `repère canonique perdu (${sentinel})`);
}

console.log(
  `TALENT HUB EDITORIAL OK — 14 hubs · ${catalogueRows} voies · ${talentCount} Talents comptés · 0 fiche recopiée`
);
