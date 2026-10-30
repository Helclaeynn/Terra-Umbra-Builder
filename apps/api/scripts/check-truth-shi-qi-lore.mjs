import assert from "node:assert/strict";

import {
  COMPENDIUM_SHI_QI_ARTICLES,
  COMPENDIUM_SHI_QI_NAVIGATION,
  COMPENDIUM_SHI_QI_ENRICHMENTS
} from "../dist/compendium-shi-qi.js";
import { COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES } from "../dist/compendium-shi-qi-editorial.js";

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};

const withoutSections = ({ sections: _sections, ...article }) => article;
const sectionSignature = (article) =>
  (article.sections ?? []).map(({ id, title, level, audience }) => ({ id, title, level, audience }));

assert.equal(COMPENDIUM_SHI_QI_ARTICLES.length, 9, "9 pages Shi/Qi source");
assert.equal(COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES.length, 9, "9 pages Shi/Qi éditoriales");
assert.deepEqual(
  COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES.map(withoutSections),
  COMPENDIUM_SHI_QI_ARTICLES.map(withoutSections),
  "identifiants, titres, accès, tags, sources et statuts préservés"
);
assert.deepEqual(
  COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES.map(sectionSignature),
  COMPENDIUM_SHI_QI_ARTICLES.map(sectionSignature),
  "identifiants, titres et accès des sections préservés"
);

assert.equal(COMPENDIUM_SHI_QI_NAVIGATION.length, 9, "9 entrées de navigation");
assert.equal(
  new Set(COMPENDIUM_SHI_QI_NAVIGATION.map((entry) => entry.id)).size,
  9,
  "navigation Shi/Qi unique"
);
assert.deepEqual(
  COMPENDIUM_SHI_QI_NAVIGATION.map((entry) => entry.id),
  COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES.map((article) => article.id),
  "ordre de navigation préservé"
);

const changedSections = new Set([
  "verite-clan-shi-taoisme-veritable:histoire",
  "verite-clan-shi-cinq-familles:structure",
  "verite-qi-yin-yang-vide:taoisme",
  "verite-qi-shinoda-pouvoir-oni:heritage"
]);

for (const [articleIndex, article] of COMPENDIUM_SHI_QI_ARTICLES.entries()) {
  const edited = COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES[articleIndex];
  for (const [sectionIndex, section] of (article.sections ?? []).entries()) {
    const key = `${article.id}:${section.id}`;
    if (changedSections.has(key)) {
      assert.notDeepEqual(edited.sections[sectionIndex], section, `${key}: section éditoriale attendue`);
    } else {
      assert.deepEqual(edited.sections[sectionIndex], section, `${key}: section hors lot modifiée`);
    }
  }
}

const forbidden = /[�￾]|Brève histoire|Structures et spécificités|Le Qi chez les Taoïstes|\uF0B7/iu;
let paragraphCount = 0;
let tableCount = 0;
let longest = 0;

for (const article of COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES) {
  assert.equal(article.source, "Le clan Shi(1).docx ; Point technique_ arts du qi(1).docx");
  for (const section of article.sections ?? []) {
    assert.ok(section.id, `${article.id}: identifiant de section absent`);
    assert.ok(section.title, `${article.id}: titre de section absent`);
    for (const block of section.blocks ?? []) {
      if (block.type === "table") {
        tableCount += 1;
        for (const row of block.rows ?? []) {
          for (const cell of row ?? []) {
            const text = flatten(cell);
            assert.ok(text.length <= 400, `${article.id}: cellule de tableau trop longue`);
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
      assert.doesNotMatch(text, forbidden, `${article.id}: fragment d’import résiduel`);
    }
  }
}

const sentinels = {
  "verite-clan-shi-taoisme-veritable": [
    "Shì Hun Zhe",
    "Shi Xuyan",
    "Shi Xin",
    "Gu Lan",
    "448 maîtres Shi",
    "51 grands maîtres",
    "Grand Traqueur",
    "2035"
  ],
  "verite-clan-shi-cinq-familles": [
    "Gu Jin",
    "Zhan Zheon-ju",
    "Laodong Zexi",
    "Xiong Chun",
    "Lu Shun",
    "Shinoda",
    "Shiung",
    "Krushienmayer"
  ],
  "verite-qi-yin-yang-vide": [
    "2 Qi pour produire 2 Yin",
    "Dantian",
    "deux unités de Xuwu",
    "grands maîtres Shi",
    "Shi Wei"
  ],
  "verite-qi-shinoda-pouvoir-oni": [
    "Yakushima",
    "Ombres-humaines",
    "Charte taoïste",
    "septième seuil",
    "vampire",
    "ancêtres"
  ]
};

for (const article of COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES) {
  const text = flatten(article);
  for (const sentinel of sentinels[article.id] ?? []) {
    assert.ok(text.includes(sentinel), `${article.id}: repère canonique perdu (${sentinel})`);
  }
}

const shiText = flatten(
  COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES.filter((article) =>
    ["verite-clan-shi-taoisme-veritable", "verite-clan-shi-cinq-familles"].includes(article.id)
  )
);
assert.match(shiText, /Shi Wei (?:est désormais|dirige désormais)/u, "Shi Wei doit rester la maîtresse actuelle");
assert.match(shiText, /Xuegang[^.]{0,80}(?:fut|ancien)/u, "Xuegang doit rester un ancien maître");
assert.doesNotMatch(
  shiText,
  /(?:grand )?ma[iî]tre actuel(?:le)? (?:est |:) ?Xuegang/iu,
  "Xuegang ne doit pas redevenir le maître actuel"
);

const ryongSource = COMPENDIUM_SHI_QI_ARTICLES.find(
  (article) => article.id === "verite-qi-ryong-energie-dragon"
);
const ryongEdited = COMPENDIUM_SHI_QI_EDITORIAL_ARTICLES.find(
  (article) => article.id === "verite-qi-ryong-energie-dragon"
);
assert.deepEqual(ryongEdited, ryongSource, "page Ryong/Dradyn conservée à l’identique");
assert.match(flatten(ryongEdited), /Dradyn/u, "Dradyn préservée");
assert.doesNotMatch(flatten(ryongEdited), /Dratyn/u, "Dradyn ne doit pas être confondue avec Dratyn");

assert.equal(COMPENDIUM_SHI_QI_ENRICHMENTS.length, 2, "2 enrichissements PNJ préservés");
assert.deepEqual(
  COMPENDIUM_SHI_QI_ENRICHMENTS.map((entry) => entry.id),
  ["pnj-corporations-wei-shi", "personnages-verite-chasseurs-xuegang-shi"],
  "cibles des enrichissements Shi Wei et Xuegang préservées"
);

console.log(
  `TRUTH SHI/QI LORE OK — 9 pages · 4 sections restructurées · ${paragraphCount} paragraphes contrôlés · ${tableCount} tableaux · plus long paragraphe ${longest} caractères`
);
