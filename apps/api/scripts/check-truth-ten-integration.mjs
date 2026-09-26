import assert from "node:assert/strict";
import { COMPENDIUM_TEN_BACKGROUND_ENRICHMENTS, COMPENDIUM_TEN_SVETLANA_ARTICLE, COMPENDIUM_TEN_ARKHANGEL_LINK, COMPENDIUM_TEN_BACKGROUND_SOURCE_COUNT } from "../dist/compendium-ten-backgrounds.js";
import { COMPENDIUM_VERITE_TEN_EVENTS, COMPENDIUM_VERITE_TEN_CHRONOLOGY_ARTICLE, COMPENDIUM_VERITE_TEN_ENRICHMENTS, COMPENDIUM_VERITE_TEN_EVENT_COUNT } from "../dist/compendium-verite-ten-catastrophes.js";
import { COMPENDIUM_TEN_PAGE_ARTICLE, COMPENDIUM_TEN_TRUTH_ENRICHMENTS } from "../dist/compendium-ten-canon.js";
import { COMPENDIUM_TEN_PROFILE_CALIBRATION } from "../dist/compendium-ten-profiles.js";
assert.equal(COMPENDIUM_TEN_BACKGROUND_SOURCE_COUNT,10);
assert.equal(COMPENDIUM_TEN_BACKGROUND_ENRICHMENTS.length,9,"9 Ten existants doivent recevoir leur BG");
assert.equal(COMPENDIUM_TEN_SVETLANA_ARTICLE.title,"Svetlana Konstantinovna");
assert.ok(COMPENDIUM_TEN_SVETLANA_ARTICLE.pnj.identity_keys.includes("Svetlana Konstantinovna"));
assert.ok(!COMPENDIUM_TEN_SVETLANA_ARTICLE.pnj.identity_keys.some(k=>String(k).toLowerCase().includes("arkhangel")),"Arkhangel ne doit jamais être une clé de fusion de Svetlana");
assert.equal(COMPENDIUM_TEN_ARKHANGEL_LINK.targetId,"pnj-pegre-arkhangel");
assert.equal(COMPENDIUM_TEN_ARKHANGEL_LINK.section.audience,"mj");
assert.equal(COMPENDIUM_VERITE_TEN_EVENT_COUNT,20);
assert.equal(COMPENDIUM_VERITE_TEN_EVENTS.length,20);
assert.equal(new Set(COMPENDIUM_VERITE_TEN_EVENTS.map(e=>e.id)).size,20);
assert.equal(COMPENDIUM_VERITE_TEN_CHRONOLOGY_ARTICLE.audience,"mj");
assert.equal(COMPENDIUM_VERITE_TEN_ENRICHMENTS.length,10,"les dix Ten doivent recevoir les Catastrophes");
assert.equal(COMPENDIUM_VERITE_TEN_EVENTS.filter(e=>e.id==="nextar-tower").length,1,"Nextar Tower doit être dédupliquée");
assert.equal(COMPENDIUM_VERITE_TEN_EVENTS.filter(e=>e.id==="tournoi-arts-martiaux").length,1,"Le grand tournoi doit être dédupliqué");
assert.ok(!COMPENDIUM_VERITE_TEN_EVENTS.some(e=>e.id==="faucheuse"),"La crise des psychopompes doit rester intégrée au grand tournoi");
for(const e of COMPENDIUM_VERITE_TEN_ENRICHMENTS){ for(const s of e.sections??[]) assert.equal(s.audience,"mj","les catastrophes doivent rester protégées"); }
console.log("TRUTH TEN OK — 10 BG · Svetlana/Arkhangel séparés · 20 événements uniques · chronologie MJ");

assert.equal(COMPENDIUM_TEN_PAGE_ARTICLE.title,"Les Ten");
assert.equal(COMPENDIUM_TEN_PAGE_ARTICLE.sourceCategory,"Réalité");
assert.ok(COMPENDIUM_TEN_PAGE_ARTICLE.sections.some(s=>s.audience==="mj"),"La page Les Ten doit porter une couche Vérité MJ");
assert.equal(COMPENDIUM_TEN_TRUTH_ENRICHMENTS.length,10,"les dix Ten doivent avoir une ancre de Vérité canonique");

assert.ok(JSON.stringify(COMPENDIUM_TEN_TRUTH_ENRICHMENTS).includes("Mashia’h"),"Svetlana doit conserver son nom de Vérité dans le canon MJ");
assert.ok(JSON.stringify(COMPENDIUM_TEN_TRUTH_ENRICHMENTS).includes("Nephilim divin"),"Svetlana doit être décrite comme Nephilim divin");

assert.equal(COMPENDIUM_TEN_PROFILE_CALIBRATION.length,10,"les dix Ten doivent avoir une calibration statistique");
assert.equal(new Set(COMPENDIUM_TEN_PROFILE_CALIBRATION.map(profile=>profile.sourceId)).size,10,"les dix profils Ten doivent être uniques");
for(const profile of COMPENDIUM_TEN_PROFILE_CALIBRATION){
  const realityAttr=Object.values(profile.reality.attributes).reduce((sum,value)=>sum+Number(value),0);
  const realitySkills=profile.reality.skills.reduce((sum,row)=>sum+Number(row[1]),0);
  const semi=Object.values(profile.truth.semi).reduce((sum,value)=>sum+Number(value),0);
  const revealed=Object.values(profile.truth.revealed).reduce((sum,value)=>sum+Number(value),0);
  assert.equal(realityAttr,42,`${profile.name} doit rester sur le budget Légendaire de 42 Attributs`);
  assert.equal(realitySkills,140,`${profile.name} doit rester sur le budget Légendaire de 140 Compétences`);
  assert.ok(profile.reality.skills.every(row=>Number(row[1])<=14),`${profile.name} dépasse le plafond Légendaire`);
  const realityRanks=new Map(profile.reality.skills.map(([name,rank])=>[name,Number(rank)]));
  assert.equal(realityRanks.size,profile.reality.skills.length,`${profile.name} a une compétence de Réalité en doublon`);
  const truthRanks=new Map(realityRanks);
  for(const [name,rank] of profile.truth.skills){
    assert.ok(realityRanks.has(name),`${profile.name} a une compétence de Vérité sans base de Réalité : ${name}`);
    assert.ok(Number(rank)>=realityRanks.get(name),`${profile.name} perd des rangs en Vérité : ${name}`);
    truthRanks.set(name,Number(rank));
  }
  const truthSkillTotal=[...truthRanks.values()].reduce((sum,rank)=>sum+rank,0);
  assert.ok(truthSkillTotal>=147&&truthSkillTotal<=151,`${profile.name} sort de l'étalon commun de compétences en Vérité : ${truthSkillTotal}`);
  assert.ok(Number(profile.truth.ptv)>=41,`${profile.name} doit être Exceptionnelle en Vérité`);
  assert.equal(semi,46,`${profile.name} doit conserver la même enveloppe Semi-Révélée`);
  assert.equal(revealed,50,`${profile.name} doit conserver la même enveloppe Révélée`);
  for(const key of Object.keys(profile.reality.attributes)){
    assert.ok(Number(profile.truth.semi[key])>=Number(profile.reality.attributes[key]),`${profile.name} perd ${key} en Semi-Révélé`);
    assert.ok(Number(profile.truth.revealed[key])>=Number(profile.truth.semi[key]),`${profile.name} perd ${key} en Révélé`);
  }
}
const taggedTen=[
  ...COMPENDIUM_TEN_BACKGROUND_ENRICHMENTS.map(entry=>entry.tags??[]),
  COMPENDIUM_TEN_SVETLANA_ARTICLE.tags??[]
];
assert.equal(taggedTen.length,10);
assert.ok(taggedTen.every(tags=>tags.includes("Ten")),"chaque Ten doit porter le tag canonique Ten");
console.log("TEN PROFILE OK — 10 × Légendaire Réalité · 10 × Exceptionnel Vérité · tag Ten");
