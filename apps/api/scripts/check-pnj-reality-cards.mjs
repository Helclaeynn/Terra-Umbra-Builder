import assert from "node:assert/strict";
import pg from "pg";

pg.Pool.prototype.query = async () => ({ rows: [], rowCount: 0 });
const { getCompendiumQualityCorpus } = await import("../dist/compendium.js");
const corpus = await getCompendiumQualityCorpus();
const active = corpus.articles.filter((article) => article.category === "Personnages");
assert.equal(active.length, 918);
const article = (id, publicView = false) =>
  (publicView ? corpus.publicArticles : corpus.articles).find((item) => item.id === id);
const rows = (id) => article(id).sections[0].blocks[0].rows;

const religiousCards = active.filter((item) =>
  ["realite-v9-religions-pnj", "realite-v9-christianity-pnj"].includes(item.dataset) &&
  item.sections.at(-1)?.id === "profil-statistique" && item.sections.at(-1).blocks.length >= 6);
assert.equal(religiousCards.length, 46);
for (const person of religiousCards) {
  assert.equal(person.sections[0].id, "identite-realite-consolidee", person.id);
  assert.equal(person.sections.filter((s) => s.id === "identite-realite-consolidee").length, 1, person.id);
  assert.ok(!person.sections.some((s) => s.id === "reperes"), person.id);
  const fields = person.sections[0].blocks[0].rows;
  assert.equal(fields[0][0], "Champ", person.id);
  assert.ok(fields.some(([label]) => label === "Fonction"), person.id);
  assert.ok(!article(person.id, true)?.sections.some((s) => s.id === "profil-statistique"), person.id);
}
const agencies = active.filter((person) => person.dataset === "realite-v9-agencies-pnj" &&
  person.id !== "pnj-agences-cole-gallagher" && person.sections.at(-1)?.blocks.length >= 6);
assert.equal(agencies.length, 18);
const meetingProfiles = active.filter((person) => person.dataset === "points-rencontre-pnj" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(meetingProfiles.length, 24);
const hunterProfiles = active.filter((person) => person.dataset === "verite-hunters-pnj" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(hunterProfiles.length, 19);
const speciesRealityProfiles = active.filter((person) =>
  ["verite-species-pnj", "verite-fantastiques-pnj"].includes(person.dataset) &&
  person.id !== "personnages-verite-especes-tokala" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(speciesRealityProfiles.length, 40);
const angelicRealityProfiles = active.filter((person) =>
  ["verite-angelus-pnj", "verite-humains-galactiques-pnj"].includes(person.dataset) &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(angelicRealityProfiles.length, 65);
const templeTerrestrialProfiles = active.filter((person) =>
  person.dataset === "verite-aseryns-terres-temples-pnj" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(templeTerrestrialProfiles.length, 32);
const olderActiveProfiles = active.filter((person) =>
  person.dataset === "pnj" && person.id !== "pnj-148-kai-gehrman" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(olderActiveProfiles.length, 50);
const exileRealityProfiles = active.filter((person) =>
  ["verite-pelages-pnj", "verite-grands-exiles-pnj", "verite-vampire-courts-pnj", "verite-extrals-groupes-pnj"].includes(person.dataset) &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
const templeRealityProfiles = active.filter((person) =>
  person.dataset === "verite-temples-daemoniaques-pnj" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
const alienRealityProfiles = active.filter((person) =>
  person.dataset === "verite-extraterrestres-pnj" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(templeRealityProfiles.length, 45);
assert.equal(alienRealityProfiles.length, 38);
assert.equal(exileRealityProfiles.length, 121);
for (const [id, forbidden] of [
  ["personnages-verite-extrals-groupes-axelle-monroy", "ième siège du SMRC"],
  ["pnj-temples-daemoniaques-ludovic-yersin", "ne soit pas vampire"]
]) assert.ok(!JSON.stringify(article(id, true)).includes(forbidden), `${id}: Vérité dans le récit public`);
for (const [id, secret, retained] of [
  ["personnages-points-rencontre-kristina-moon", "magie familiale de l’empire vert", "empire vert"],
  ["personnages-points-rencontre-murck-date", "projection spectrale", "magie spectrale"],
  ["personnages-points-rencontre-mukna", "magie du sang", "magie du sang"],
  ["personnages-points-rencontre-lana-alvarez", "tueur de mageius", "tueur de mageius"],
  ["personnages-points-rencontre-james-hopper", "origine clonale", "clones de"]
]) {
  assert.ok(!JSON.stringify(article(id, true)).toLowerCase().includes(secret), `${id}: secret révélé publiquement`);
  assert.ok(JSON.stringify(article(id)).toLowerCase().includes(retained), `${id}: information MJ perdue`);
}
const civilPrerequisiteFailures = [];
for (const person of [...religiousCards, ...agencies, ...meetingProfiles, ...hunterProfiles, ...exileRealityProfiles, ...templeRealityProfiles, ...alienRealityProfiles, ...speciesRealityProfiles, ...angelicRealityProfiles, ...templeTerrestrialProfiles, ...olderActiveProfiles]) {
  const blocks = person.sections.at(-1).blocks;
  const ranks = new Map(blocks[2].rows.slice(1,-1).map(([name, value]) => [name, Number(value)]));
  const rank = (name) => ranks.get(name) ?? 0;
  const intro = blocks[0].text;
  assert.equal(blocks[1].rows[1].slice(1).reduce((sum, value) => sum + Number(value), 0),
    Number(intro.match(/(\d+) points d'Attributs/)?.[1]), person.id);
  assert.equal([...ranks.values()].reduce((sum, value) => sum + value, 0),
    Number(intro.match(/(\d+) points de Compétences/)?.[1]), person.id);
  assert.ok(!article(person.id, true)?.sections.some((s) => s.id === "profil-statistique"), person.id);
  for (const [talent, valid] of [
    ["Réseau mobilisable", rank("Autorité") >= 6], ["Dossier préparé", rank("Investigation") >= 6],
    ["Chef de manœuvre", rank("Autorité") >= 6],
    ["Terrain reconnu", Math.max(rank("Survie"),rank("Perception")) >= 7],
    ["Lecture des failles", Math.max(rank("Investigation"),rank("Perception")) >= 7],
    ["Désarmement net", Math.max(rank("Mêlée"),rank("Pugilat")) >= 8]
  ]) if (blocks[4].text.includes(talent) && !valid) civilPrerequisiteFailures.push(`${person.id}: ${talent}`);
}
assert.deepEqual(civilPrerequisiteFailures, []);
assert.ok(!JSON.stringify(article("pnj-religions-chretiente-aureliana-longo-austin", true)).includes("Aara’lo"));

assert.equal(article("pnj-148-kai-gehrman").sections[0].title, "Identité · Réalité");
assert.ok(!article("pnj-148-kai-gehrman").sections.some((s) => /source antérieure/i.test(s.title)));
assert.equal(article("pnj-corporations-baldwin-vandrick").sections
  .filter((s) => s.blocks?.some((block) => block.type === "table" &&
    block.rows?.[0]?.[0] === "Champ")).length, 1);
assert.ok(rows("pnj-corporations-baldwin-vandrick").some((r) =>
  r[0] === "Organisation" && r[1] === "LAGUNA BANK CORPORATION"));
assert.ok(!JSON.stringify(rows("pnj-crawlers-antisysteme-p64-jayceon-osborn")).includes("Jacyr Oceriol"));
for (const id of ["pnj-148-kai-gehrman", "pnj-corporations-baldwin-vandrick",
  "personnages-verite-especes-tokala", "pnj-agences-cole-gallagher"]) {
  assert.ok(article(id).sections.at(-1).blocks.length >= 6, id);
  assert.equal(article(id).sections.at(-1).audience, "mj", id);
  assert.ok(!article(id, true).sections.some((s) => s.id === "profil-statistique"), id);
}
const corporations = active.filter((item) => item.dataset === "realite-v9-corporations-pnj");
assert.equal(corporations.length, 54);
const talentPrerequisiteFailures = [];
for (const person of corporations) {
  const section = person.sections.at(-1);
  assert.equal(section.id, "profil-statistique", person.id);
  assert.equal(section.audience, "mj", person.id);
  assert.ok(section.blocks.length >= 6, person.id);
  const attrs = section.blocks[1].rows[1].slice(1).map(Number);
  const rankRows = section.blocks[2].rows.slice(1).filter((row) => row[0] !== "Autres compétences" && row[0] !== "Autres");
  const rankSum = rankRows.reduce((sum, row) => sum + Number(row[1]), 0);
  const intro = section.blocks[0].text;
  assert.equal(attrs.reduce((sum, value) => sum + value, 0), Number(intro.match(/(\d+) points d'Attributs/)?.[1]), person.id);
  if (person.id !== "pnj-corporations-baldwin-vandrick") {
    assert.equal(rankSum, Number(intro.match(/(\d+) points de Compétences/)?.[1]), person.id);
    const rank = (skill) => Number(rankRows.find((row) => row[0] === skill)?.[1] ?? 0);
    const talents = section.blocks[4].text;
    for (const [talent, valid] of [
      ["Réseau mobilisable", rank("Autorité") >= 6],
      ["Dossier préparé", rank("Investigation") >= 6],
      ["Chaîne de commandement", rank("Autorité") >= 7],
      ["Terrain reconnu", Math.max(rank("Survie"), rank("Perception")) >= 7],
      ["Lecture des failles", Math.max(rank("Investigation"), rank("Perception")) >= 7],
      ["Lutte brève", rank("Pugilat") >= 7]
    ]) if (talents.includes(talent) && !valid) talentPrerequisiteFailures.push(`${person.id}: ${talent}`);
  }
  assert.ok(!article(person.id, true)?.sections.some((s) => s.id === "profil-statistique"), person.id);
}
assert.deepEqual(talentPrerequisiteFailures, []);
const institutions = active.filter((item) =>
  ["realite-v9-police-pnj", "realite-v9-government-pnj", "realite-v9-agencies-pnj"].includes(item.dataset));
const staffed = institutions.filter((person) => person.sections.at(-1)?.id === "profil-statistique" &&
  person.sections.at(-1).blocks.length >= 6);
assert.equal(staffed.length, 62); // All agencies, police and government, including Cole Gallagher.
for (const person of staffed) {
  const section = person.sections.at(-1);
  assert.equal(section.audience, "mj", person.id);
  if (person.id !== "pnj-agences-cole-gallagher") {
    const intro = section.blocks[0].text;
    const attrs = section.blocks[1].rows[1].slice(1).map(Number);
    const ranks = section.blocks[2].rows.slice(1,-1).map((row) => Number(row[1]));
    assert.equal(attrs.reduce((sum, value) => sum + value, 0), Number(intro.match(/(\d+) points d'Attributs/)?.[1]), person.id);
    assert.equal(ranks.reduce((sum, value) => sum + value, 0), Number(intro.match(/(\d+) points de Compétences/)?.[1]), person.id);
  }
  assert.ok(!article(person.id, true)?.sections.some((s) => s.id === "profil-statistique"), person.id);
}
const crawlerProfiles = active.filter((person) => person.dataset === "realite-v9-crawlers-pnj" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(crawlerProfiles.length, 123);
const pegreProfiles = active.filter((person) => person.dataset === "realite-v9-pegre-pnj" &&
  person.sections.at(-1)?.id === "profil-statistique" && person.sections.at(-1).blocks.length >= 6);
assert.equal(pegreProfiles.length, 36);
for (const [id, forbidden, retained] of [
  ["pnj-crawlers-antisysteme-p15-jane-costa", "En tant que louve", "En tant que louve"],
  ["pnj-crawlers-antisysteme-p18-sahamena-lannis", "origine elfes sylvains", "origine elfes sylvains"],
  ["pnj-crawlers-antisysteme-p49-toxicity-norton", "pouvoir angélique", "poison céleste"]
]) {
  assert.ok(!JSON.stringify(article(id, true)).includes(forbidden), `${id}: fuite dans la vue publique`);
  assert.ok(JSON.stringify(article(id, false)).includes(retained), `${id}: secret MJ perdu`);
}
const crawlerTalentErrors = [];
for (const person of [...crawlerProfiles, ...pegreProfiles]) {
  const blocks = person.sections.at(-1).blocks;
  const attrs = blocks[1].rows[1].slice(1).map(Number);
  const ranks = new Map(blocks[2].rows.slice(1,-1).map((row) => [row[0], Number(row[1])]));
  const intro = blocks[0].text;
  const rank = (skill) => ranks.get(skill) ?? 0;
  assert.equal(attrs.reduce((sum, value) => sum + value, 0), Number(intro.match(/(\d+) points d'Attributs/)?.[1]), person.id);
  assert.equal([...ranks.values()].reduce((sum, value) => sum + value, 0), Number(intro.match(/(\d+) points de Compétences/)?.[1]), person.id);
  for (const [talent, valid] of [
    ["Réseau mobilisable", rank("Autorité") >= 6], ["Dossier préparé", rank("Investigation") >= 6],
    ["Chef de manœuvre", rank("Autorité") >= 6],
    ["Terrain reconnu", Math.max(rank("Survie"), rank("Perception")) >= 7],
    ["Lecture des failles", Math.max(rank("Investigation"), rank("Perception")) >= 7],
    ["Désarmement net", Math.max(rank("Mêlée"), rank("Pugilat")) >= 8],
    ["Lutte brève", rank("Pugilat") >= 7],
    ["Décrochage préparé", Math.max(rank("Athlétisme"), rank("Esquive")) >= 6]
  ]) if (blocks[4].text.includes(talent) && !valid) crawlerTalentErrors.push(`${person.id}: ${talent}`);
  assert.ok(!article(person.id,true).sections.some((section) => section.id === "profil-statistique"), person.id);
}
assert.deepEqual(crawlerTalentErrors, []);
console.log("PNJ REALITY CARDS OK — identity first; duplicates merged; profiles MJ only");
