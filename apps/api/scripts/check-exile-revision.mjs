import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {truthCatalogExile as original} from '../dist/rules/truth/catalog-exile.js';
import {terraUmbraTruthRules as pkg} from '../dist/rules/truth/rules.js';
import {exileRevisions,exilePrerequisites} from '../dist/rules/truth/exile-revision.js';
import {normalizeExileBuild,normalizeBeneficiaryBenefits,exileRuneIds,exileTalentIds as ids,isCybermechanicalItem} from '../dist/rules/truth/exile-build.js';
import {normalizeCharacterData} from '../dist/character-data.js';
import {exileCatalogueSections} from '../dist/rules/truth/exile-compendium.js';
const approved=JSON.parse(readFileSync(new URL('./exile-approved-20260930.json',import.meta.url))),rows=pkg.catalogs.exile,index=new Map(rows.map(t=>[t.id,t]));
assert.equal(rows.length,184);assert.equal(index.size,184);assert.equal(exileRevisions.length,102);
assert.deepEqual(exileRevisions.map(t=>t.id).sort(),approved.changed.sort());
let changed=0,discounts=0;
for(const old of original){const t=index.get(old.id);assert.ok(t);assert.equal(t.access,old.access);assert.equal(t.runtimeLore,old.runtimeLore);assert.deepEqual(t.when,old.when);
 if(approved.changed.includes(old.id)){changed++;assert.ok(t.effectDetails);assert.ok([...new Intl.Segmenter('fr',{granularity:'sentence'}).segment(t.effect)].length<=2,old.id);}
 else{assert.equal(t.effectDetails,old.effect);assert.equal(t.cost,old.cost);if(old.id!=='exile-fiabilisation')assert.equal(t.effect,old.effect);}
 if(t.cost!==old.cost){discounts++;assert.equal(t.cost,approved.discounts[old.id]);}
 for(const dependency of t.requiredTalentIds)assert.ok(index.has(dependency),old.id+' missing '+dependency);
}
assert.equal(changed,102);assert.equal(discounts,11);assert.equal(original.reduce((n,t)=>n+t.cost,0)-rows.reduce((n,t)=>n+t.cost,0),11);
assert.deepEqual(exilePrerequisites[ids.hdp],[ids.hdb]);assert.equal(exileRuneIds.length,5);
assert.match(index.get(ids.healing).effect,/4 \+ DR PV/);assert.match(index.get(ids.healing).effect,/1 PA/);assert.match(index.get(ids.healing).activation,/scénario\/bénéficiaire/);
assert.match(index.get(ids.guard).effect,/6/);assert.match(index.get(ids.guard).effectDetails,/bénéficiaire/);
assert.match(index.get('exile-fiabilisation').effectDetails,/corriger durablement/);assert.match(index.get('exile-fiabilisation').effectDetails,/revêtement/);
const dirty={role:'admin',xpEarned:900,approved:true,trainings:[{uid:'t',network:'hds',mentor:'École',conditions:'Apprentissage',learned:true,approved:true}],runes:[{uid:'r',runeIds:[ids.guard,ids.guard],support:'Peau',author:'Auteur',beneficiary:'Moi',consumed:true,active:true,price:900}],supplies:[{uid:'s',name:'Lot',source:'Appareil',consumed:true}],works:[{uid:'w',itemUid:'owned',talentId:'exile-fiabilisation',effect:'Défaut éliminé',approved:true}],techniques:[{uid:'m',pa:Infinity,maintenance:-5,approved:true}],projects:[{uid:'p',price:NaN,approved:true}],landmarks:[{uid:'l',name:'Repère'}]};
const c=normalizeExileBuild(dirty);assert.deepEqual(normalizeExileBuild(c),c);assert.equal(c.role,undefined);assert.equal(c.approved,undefined);assert.equal(c.trainings[0].approved,undefined);assert.equal(c.runes[0].runeIds.length,1);assert.equal(c.techniques[0].pa,null);assert.equal(c.techniques[0].maintenance,null);assert.equal(c.projects[0].price,null);assert.equal(c.supplies[0].consumed,true);
const received=normalizeBeneficiaryBenefits({scenario:'S1',refectionReceived:true,guardReceived:true,xpEarned:999,source:'ignored'});assert.deepEqual(normalizeBeneficiaryBenefits(received),received);assert.equal(received.xpEarned,undefined);
for(const nature of Object.keys(pkg.structure.natures)){const saved=normalizeCharacterData({truth:{nature,choices:{exileBuild:dirty,beneficiaryBenefits:received}}},'Test');assert.deepEqual(saved.truth.choices.beneficiaryBenefits,received);assert.deepEqual(saved.truth.choices.exileBuild,c);}
assert.equal(exileCatalogueSections(true).flatMap(s=>s.blocks[0].rows.slice(1)).length,53);assert.equal(exileCatalogueSections(false).flatMap(s=>s.blocks[0].rows.slice(1)).length,131);
assert.ok(isCybermechanicalItem({category:'Neural',generation:1}));assert.equal(isCybermechanicalItem({category:'Biogénétique',generation:1}),false);
console.log('EXILE API OK — 184 stable IDs, 102 approved revisions, 82 preserved mechanics, 11 discounts, exact prerequisites, full Fiabilisation, bounded saved configurations and per-beneficiary scenario records, no forged grants');
