import assert from 'node:assert/strict';
import {truthCatalogExtral as original} from '../dist/rules/truth/catalog-extral.js';
import {terraUmbraTruthRules as pkg} from '../dist/rules/truth/rules.js';
import {extralRevisions} from '../dist/rules/truth/extral-revision.js';
import {normalizeExtralBuild,extralSpecies,extralNetworks,extralNetworkAccess,extralTalentIds as ids} from '../dist/rules/truth/extral-build.js';
import {normalizeCharacterData} from '../dist/character-data.js';
import {extralCatalogueSections} from '../dist/rules/truth/extral-compendium.js';
const rows=pkg.catalogs.extral,index=new Map(rows.map(t=>[t.id,t]));
assert.equal(rows.length,162);assert.equal(index.size,162);assert.equal(extralRevisions.length,97);
const edits=new Map(extralRevisions.map(r=>[r.id,r]));let changed=0,discounts=0;
for(const old of original){const t=index.get(old.id);assert.ok(t);if(edits.has(t.id)){changed++;assert.ok(t.effectDetails);assert.ok([...new Intl.Segmenter('fr',{granularity:'sentence'}).segment(t.effect)].length<=2,t.name);if(t.cost!==old.cost)discounts++;}else{assert.equal(t.effect,old.effect);assert.equal(t.cost,old.cost);assert.equal(t.name,old.name);}if(old.id!=='extral-projection-de-masse')assert.equal(t.prerequisiteName,old.prerequisiteName);}
assert.equal(changed,97);assert.equal(discounts,10);assert.equal(original.reduce((n,t)=>n+t.cost,0)-rows.reduce((n,t)=>n+t.cost,0),11);
for(const id of [ids.reserve,ids.repair]){assert.match(index.get(id).effect,/fois par scénario/);assert.match(index.get(id).activation,/1\/scénario/);assert.doesNotMatch(index.get(id).activation,/1\/scène/);}
assert.match(index.get(ids.repair).effect,/6 PV/);assert.match(index.get(ids.repair).effect,/1 PA/);assert.match(index.get(ids.reserve).effect,/3 PV/);assert.match(index.get(ids.reserve).effect,/Cycle de réparation/);
assert.equal(index.get('extral-projection-de-masse').prerequisiteName,'');assert.equal(index.get('extral-heritage-recombine').cost,1);assert.equal(index.get('extral-industrialisation-frugale').name,'Production de terrain');assert.equal(index.get('extral-fenetre-orbitale').name,'Fenêtre de transit');
const network=pkg.structure.natures.extral.choices.find(c=>c.key==='network');
for(const species of extralSpecies){const offers=network.optionsBy[species];assert.ok(offers.length>1);for(const n of extralNetworks)assert.equal(offers.some(o=>o.id===n.id),!!extralNetworkAccess(species,n.id));}
assert.ok(network.optionsBy.talass.some(o=>o.id==='emeraude'));assert.ok(network.optionsBy.rocreen.some(o=>o.id==='shaediri'));assert.ok(network.optionsBy.thalsios.some(o=>o.id==='hydroguard'));
const raw={training:'Parcours ',trainingNetwork:'ctu',hydrated:true,reserveUsed:true,repairUsed:true,approved:true,xpEarned:999,role:'gm',preparations:[{uid:'p',name:'Culture <script>x</script>',kind:'medical',remaining:2,effect:'Soin',resistance:'15',duration:'scène',approved:true},{uid:'p',name:'duplicate'}],patches:[{uid:'item',state:'phased'},{uid:'item',state:'materialized'}],recombination:{graftUid:'graft',talentId:'extral-peau-saturee',architecture:'Architecture <img>',approved:true},projects:[{uid:'project',name:'Prototype',talentId:'extral-prototype-de-transition',effect:'Filtrer',materials:'Composants réels',duration:'Scène',limits:'Débit fixé',pa:2,approved:true}]};
const clean=normalizeExtralBuild(raw);assert.deepEqual(normalizeExtralBuild(clean),clean);assert.equal(clean.preparations.length,1);assert.equal(clean.patches.length,1);assert.equal(clean.preparations[0].approved,undefined);assert.equal(clean.recombination.approved,undefined);assert.equal(clean.projects[0].approved,undefined);assert.equal(clean.role,undefined);assert.equal(clean.xpEarned,undefined);
assert.equal(normalizeExtralBuild({preparations:[{uid:'p',remaining:Infinity}]}).preparations[0].remaining,0);assert.equal(normalizeExtralBuild({repairUsed:'true'}).repairUsed,false);
const saved=normalizeCharacterData({truth:{nature:'extral',choices:{extralBuild:raw}},identity:{name:'Extral'}},'Test');assert.deepEqual(saved.truth.choices.extralBuild,clean);
assert.equal(extralCatalogueSections(true).flatMap(s=>s.blocks[0].rows.slice(1)).length+extralCatalogueSections(false).flatMap(s=>s.blocks[0].rows.slice(1)).length,162);
console.log('EXTRAL API OK — 162 stable IDs, 97 approved definitions, 65 unchanged effects, ten discounts, scenario-limited nanites, complete network matrix, canonical compendium, bounded saved choices and no forged grants');
