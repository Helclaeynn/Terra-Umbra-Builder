import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_VAMPIRE_COURTS_SOURCE,
  COMPENDIUM_VERITE_VAMPIRE_COURTS_ARTICLES,
  COMPENDIUM_VERITE_VAMPIRE_COURTS_ENRICHMENTS,
  COMPENDIUM_VERITE_VAMPIRE_COURTS_NAVIGATION
} from "../dist/compendium-verite-vampire-courts-lore.js";
import { COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES } from "../dist/compendium-verite-vampire-courts-editorial.js";
import {
  COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_ARTICLES,
  COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_NAVIGATION
} from "../dist/compendium-verite-vampire-courts-pnj.js";

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};

const withoutSections = ({ sections: _sections, ...article }) => article;

assert.equal(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_SOURCE,
  "Factions_Les cours vampiriques(1)(2).pdf",
  "source canonique du lot Cours vampiriques"
);
assert.equal(COMPENDIUM_VERITE_VAMPIRE_COURTS_ARTICLES.length, 7, "7 pages institutionnelles source");
assert.equal(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES.length,
  7,
  "7 pages institutionnelles éditoriales"
);
assert.deepEqual(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES.map(withoutSections),
  COMPENDIUM_VERITE_VAMPIRE_COURTS_ARTICLES.map(withoutSections),
  "identifiants, titres, tags, source, statut et navigation préservés"
);
assert.deepEqual(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES.map((article) => article.sections.length),
  [6, 7, 6, 7, 6, 4, 4],
  "frontières institutionnelles des Cours"
);
assert.deepEqual(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES.at(-1),
  COMPENDIUM_VERITE_VAMPIRE_COURTS_ARTICLES.at(-1),
  "page des Lavandières conservée à l’identique"
);

assert.equal(COMPENDIUM_VERITE_VAMPIRE_COURTS_NAVIGATION.length, 7, "7 entrées de navigation");
assert.equal(
  new Set(COMPENDIUM_VERITE_VAMPIRE_COURTS_NAVIGATION.map((entry) => entry.id)).size,
  7,
  "navigation institutionnelle complète et unique"
);
assert.deepEqual(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_NAVIGATION.map((entry) => entry.id),
  COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES.map((article) => article.id),
  "ordre de navigation préservé"
);

const forbidden =
  /[�￾]|Nom de la Réalité|Nom de la Vérité|Personnages liés|Voir la fiche|Dossier source|source-complete/iu;
let paragraphCount = 0;
let tableCount = 0;
let longest = 0;

for (const [articleIndex, article] of COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES.entries()) {
  if (articleIndex < 6) {
    assert.equal(article.source, COMPENDIUM_VERITE_VAMPIRE_COURTS_SOURCE, `${article.id}: source canonique`);
  }
  assert.equal(article.pnj, undefined, `${article.id}: aucun profil PNJ dans le lore institutionnel`);
  for (const section of article.sections ?? []) {
    assert.ok(section.id, `${article.id}: identifiant de section absent`);
    assert.ok(section.title, `${article.id}: titre de section absent`);
    assert.doesNotMatch(`${section.id} ${section.title}`, forbidden, `${article.id}: frontière d’import résiduelle`);
    for (const block of section.blocks ?? []) {
      if (block.type === "table") {
        tableCount += 1;
        for (const row of block.rows ?? []) {
          for (const cell of row ?? []) {
            const text = flatten(cell);
            assert.ok(text.length <= 300, `${article.id}: cellule de tableau trop longue`);
            assert.doesNotMatch(text, forbidden, `${article.id}: fragment d’import dans un tableau`);
          }
        }
        continue;
      }
      assert.equal(block.type, "p", `${article.id}: type de bloc inattendu`);
      const text = String(block.text ?? "");
      paragraphCount += 1;
      longest = Math.max(longest, text.length);
      assert.ok(text.length > 0, `${article.id}: paragraphe vide`);
      assert.ok(text.length <= 600, `${article.id}: mur de ${text.length} caractères`);
      assert.doesNotMatch(text, forbidden, `${article.id}: fragment d’import ou biographie`);
    }
  }
}

const sentinels = {
  "verite-vampires-krovni-rytsari": [
    "Dragoy Skotia",
    "marque de Caïn",
    "Maison Empusa",
    "Ombre-Pape",
    "Katja"
  ],
  "verite-vampires-alghul-almalakiu": [
    "Urungad",
    "Gajh’Shaoggith",
    "Radjnishag",
    "Masques",
    "Transcendance",
    "Megda"
  ],
  "verite-vampires-ihuito-meztzi": [
    "Brimhild",
    "Cycle du sang",
    "K’uhul Ajaw",
    "Ah’kin Ajaw",
    "Nemma Moogura",
    "Jurooga"
  ],
  "verite-vampires-oru-ayeraye": [
    "Oluwasegun",
    "Kragen",
    "N’sa’Aagor",
    "Fontaine des Ténèbres",
    "Olayinka",
    "Neeba",
    "Oshirique",
    "Neenymah"
  ],
  "verite-vampires-shi-hun-zhe": [
    "Hēi’àn zhīzǐ",
    "Anahita",
    "Xiny’Aagor",
    "Laozi",
    "Zhu Ting",
    "Trois Excellences",
    "2035"
  ],
  "verite-vampires-cours-secondaires": [
    "Elfenbeinblut",
    "Nemma Moogura",
    "Lavandières",
    "Cour de l’Ombre-Monde",
    "Notte Nostra",
    "Ditele Cayla"
  ]
};

for (const article of COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES) {
  const text = flatten(article);
  for (const sentinel of sentinels[article.id] ?? []) {
    assert.ok(text.includes(sentinel), `${article.id}: repère canonique perdu (${sentinel})`);
  }
}

assert.equal(COMPENDIUM_VERITE_VAMPIRE_COURTS_ENRICHMENTS.length, 1, "enrichissement général préservé");
assert.equal(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_ENRICHMENTS[0].targetId,
  "verite-v7-vampires-civilisation-cours-sangs",
  "cible de l’enrichissement général préservée"
);
assert.equal(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_ENRICHMENTS[0].sections[0].id,
  "cours-vampiriques-source-complete",
  "identifiant de l’enrichissement général préservé"
);

assert.equal(COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_ARTICLES.length, 72, "72 profils PNJ préservés");
assert.equal(COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_NAVIGATION.length, 64, "64 entrées PNJ publiques préservées");
const pnjIds = COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_ARTICLES.map((article) => article.id);
assert.equal(new Set(pnjIds).size, pnjIds.length, "identifiants PNJ uniques");
assert.ok(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_PNJ_NAVIGATION.every((entry) => pnjIds.includes(entry.id)),
  "navigation PNJ limitée aux profils existants"
);
assert.ok(
  COMPENDIUM_VERITE_VAMPIRE_COURTS_EDITORIAL_ARTICLES.every((article) => !pnjIds.includes(article.id)),
  "aucune collision entre lore institutionnel et PNJ"
);

console.log(
  `TRUTH VAMPIRE COURTS LORE OK — 7 pages · 40 sections · ${paragraphCount} paragraphes contrôlés · ${tableCount} tableaux · plus long paragraphe ${longest} caractères · 72 profils PNJ préservés`
);
