import assert from 'node:assert/strict';
import {truthCatalogAseryn as original} from '../dist/rules/truth/catalog-aseryn.js';
import {terraUmbraTruthRules as rules} from '../dist/rules/truth/rules.js';
import {aserynRevisions} from '../dist/rules/truth/aseryn-revision.js';
import {getTalentRegistry} from '../dist/rules/talent-registry.js';
const rows=rules.catalogs.aseryn, byId=new Map(rows.map(r=>[r.id,r]));
assert.equal(rows.length,100);assert.equal(Object.keys(aserynRevisions).length,40);
assert.equal(new Set(rows.map(r=>r.id)).size,100);
const registry=getTalentRegistry().filter(r=>r.natureId==='aseryn');
const sentences=new Intl.Segmenter('fr',{granularity:'sentence'});
let unchanged=0,discounted=0;
for(const before of original){
 const after=byId.get(before.id),patch=aserynRevisions[before.id];assert.ok(after);assert.equal(after.name,before.name);assert.equal(after.access,before.access);assert.equal(after.group,before.group);assert.equal(after.prerequisiteName,before.prerequisiteName);
 if(!patch){const {compendiumId,...plain}=after;assert.deepEqual(plain,before);unchanged++;continue;}
 assert.equal(after.cost,patch.cost);if(after.cost!==before.cost){assert.equal(after.cost,before.cost-1);discounted++;}
 assert.equal(after.effect,patch.effect);assert.ok([...sentences.segment(after.effect)].length<=2,`${after.name}: at most two sentences`);
 assert.ok(after.effectDetails);assert.ok(after.activation);assert.ok(after.compendiumId);
 assert.equal(registry.find(r=>r.talentId===before.id).mechanics,after.effectDetails,'Compendium retains the full NEW rule, not the obsolete one');
 if(after.elementEffects)for(const s of Object.values(after.elementEffects))assert.ok([...sentences.segment(s)].length<=2);
}
assert.equal(unchanged,60);assert.equal(discounted,5);
const byName=name=>rows.find(r=>r.name===name);
assert.match(byName('Réflexe impossible').effect,/sans payer son PA/);
assert.match(byName('Surcadence nerveuse').effect,/y compris offensive/);
assert.match(byName('Perception neuromotrice').effect,/fois par round/);
assert.match(byName('Trait du Silence').effect,/1 PA/);
assert.match(byName('Fortification').effect,/\+6/);
assert.match(byName('Éclipse noire').effect,/trois/);
assert.match(byName('Déchaînement nymphal').elementEffects.eau,/fin de la scène/);
assert.match(byName('Laisser la place').effectDetails,/plafonné à 6/);
assert.equal(byName('Fin véritable').effect,original.find(t=>t.name==='Fin véritable').effect,'Fléaux interaction deferred');
console.log('ASERYN REVISION OK — 40 approved effects, 60 unchanged, 5 discounts, canonical IDs/access/prerequisites, two-sentence cards and complete Compendium rules');
