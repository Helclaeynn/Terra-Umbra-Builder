import assert from "node:assert/strict";

import { COMPENDIUM_VERITE_HUMAN_GALACTIC_PNJ_ARTICLES as articles } from "../dist/compendium-verite-humans-galactic-pnj.js";

assert.equal(articles.length, 32, "32 source profiles expected");
assert.equal(new Set(articles.map((article) => article.id)).size, 32, "Human galactic ids must be unique");
assert.ok(articles.every((article) => article.pnj?.protect_truth_metadata === true), "Truth metadata protection missing");
assert.ok(articles.every((article) => article.pnj?.source_designation === undefined), "Cross-page source designation survived the audit");

assert.deepEqual(
  articles.filter((article) => article.audience === "mj").map((article) => article.title),
  ["Karina Kelack", "Jol’la Etrys"],
  "Profiles without a Reality identity must stay MJ-only"
);

const occultPublic = /\b(?:AIDH|Extrals?|REPTILE|GAAC|Rocréens?|Talass|Mo[’']sens?|Effisme|Eon|inquisition|Seigneur[- ]?[Gg]énéral|galax(?:ie|ique)|Corp[’']?\+|G-corpo|Homo (?:superior|hybridus|galacticus|gravitas)|ordres? assassins?|Scytheri|Ichéi|Zarpheth|Ad[’']rak|magie|pouvoirs? psychiques|créatures? artificielles|Xenoshield)\b/i;
for (const article of articles) {
  assert.ok(
    (article.pnj?.identity_keys ?? []).every((key) => !String(key).includes(":")),
    `${article.id}: a neighbouring heading survived in identity keys`
  );
  const profile = article.sections?.find((section) => section.id === "profil");
  if (profile) assert.equal(profile.audience, "mj", `${article.id}: source profile must be MJ-only`);
  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (typeof block?.text === "string" && block.text.trim()) {
        assert.match(block.text.trim(), /[.!?…»)]$/, `${article.id}/${section.id}: truncated active paragraph`);
        if (article.audience !== "mj" && section.audience !== "mj") {
          assert.doesNotMatch(block.text, occultPublic, `${article.id}/${section.id}: occult information leaked publicly`);
        }
      }
      if (article.audience !== "mj" && section.audience !== "mj" && Array.isArray(block?.rows)) {
        for (const row of block.rows) {
          for (const cell of row ?? []) assert.doesNotMatch(String(cell), occultPublic, `${article.id}/${section.id}: occult table value leaked publicly`);
        }
      }
    }
  }
}

const byId = new Map(articles.map((article) => [article.id, article]));
assert.equal(byId.get("personnages-verite-humains-galactiques-james-zero")?.title, "James Zero");
assert.equal(byId.get("personnages-verite-humains-galactiques-james-zero")?.pnj?.nom_verite, "CBT-0-0013");
assert.equal(byId.get("personnages-verite-humains-galactiques-moira-blake")?.pnj?.nom_verite, "Moira Blackraven");
assert.equal(byId.get("personnages-verite-humains-galactiques-kassim-heirdaen-castanelli")?.title, "Kassim Heirdaen-Castanelli");
assert.equal(byId.get("personnages-verite-humains-galactiques-zairon-tenfi")?.title, "Zairon Tenfi");

for (const id of [
  "personnages-verite-humains-galactiques-lisa-eredhes",
  "personnages-verite-humains-galactiques-james-zero",
  "personnages-verite-humains-galactiques-chris-sunborne",
  "personnages-verite-humains-galactiques-jol-la-etrys",
  "personnages-verite-humains-galactiques-sigmund-vandendriessche",
  "personnages-verite-humains-galactiques-sally-melia-goom",
  "personnages-verite-humains-galactiques-christopher-zaakdu",
  "personnages-verite-humains-galactiques-zack-ray-ashford",
  "personnages-verite-humains-galactiques-ysabel-thorne",
  "personnages-verite-humains-galactiques-satan-kirchov",
  "personnages-verite-humains-galactiques-gustavo-shiba",
  "personnages-verite-humains-galactiques-saskia",
  "personnages-verite-humains-galactiques-sharon-skull",
  "personnages-verite-humains-galactiques-kaylarie-dandwalb",
  "personnages-verite-humains-galactiques-kim-sera",
  "personnages-verite-humains-galactiques-dona-di-canerra"
]) {
  const mjText = byId.get(id)?.sections?.find((section) => section.id === "informations-mj")?.blocks
    ?.map((block) => String(block?.text ?? ""))
    .join(" ");
  assert.match(mjText ?? "", /[.!?…]$/, `${id}: restored PDF ending missing`);
}

console.log("HUMAINS GALACTIQUES OK — 32/32 fiches · 16 fins restaurées · 2 fiches MJ-only · aucune fuite publique détectée");
