import assert from "node:assert/strict";
import { COMPENDIUM_TEN_BACKGROUND_ENRICHMENTS, COMPENDIUM_TEN_SVETLANA_ARTICLE, COMPENDIUM_TEN_ARKHANGEL_LINK, COMPENDIUM_TEN_BACKGROUND_SOURCE_COUNT } from "../dist/compendium-ten-backgrounds.js";
import { COMPENDIUM_VERITE_TEN_EVENTS, COMPENDIUM_VERITE_TEN_CHRONOLOGY_ARTICLE, COMPENDIUM_VERITE_TEN_ENRICHMENTS, COMPENDIUM_VERITE_TEN_EVENT_COUNT } from "../dist/compendium-verite-ten-catastrophes.js";
import { COMPENDIUM_TEN_PAGE_ARTICLE, COMPENDIUM_TEN_TRUTH_ENRICHMENTS } from "../dist/compendium-ten-canon.js";
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
