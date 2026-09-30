import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
const root=fileURLToPath(new URL('../',import.meta.url));
const b=await build({stdin:{resolveDir:root,loader:'ts',contents:`export * from './src/lib/truth';export * from './src/lib/extral';export * from './src/lib/character-sheet-model';export * from './src/lib/character-pdf-model';export * from '../api/src/character-data';`},bundle:true,write:false,format:'esm',platform:'node'});
const m=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
const {terraUmbraTruthRules:pkg}=await import('../../api/dist/rules/truth/rules.js');
const blank=(species='talass',network='aucune')=>({nature:'extral',consciousness:'initie',choices:{species,network,hunterTradition:'aucune'},truthTalents:[],truthEquipment:[],corruptionTalents:[],corruption:0,corruptionSource:''});
const configure=(s,c)=>s.choices.extralBuild=m.normalizeExtralBuild({...s.choices.extralBuild,...c});
const rows=s=>m.truthAvailableTalents(pkg,s),eligible=(s,id)=>{const t=rows(s).find(t=>t.id===id);return !!t&&m.truthPrerequisiteSatisfied(pkg,s,t);};
for(const species of m.extralSpecies){
 const s=blank(species);assert.ok(rows(s).length);for(const n of m.extralNetworks){if(!m.extralNetworkAccess(species,n.id))continue;s.choices.network=n.id;const sanitized=m.truthSanitizeChoices(pkg.structure.natures.extral,s.choices);assert.equal(sanitized.network,n.id);assert.ok(rows(s).some(t=>t.when?.network===n.id),species+' '+n.id);}
}
const t=blank('thalsios');t.truthTalents=['extral-densification-osseuse','extral-muscle-tasse','extral-vieux-cuir'];assert.deepEqual(m.extralCombatProfile(pkg,t,'r'),{armor:3,unarmed:4});assert.deepEqual(m.extralCombatProfile(pkg,t,'v'),{armor:0,unarmed:1});assert.equal(m.truthPtvSpent(pkg,t),6);
assert.match(m.truthRevelationProfile(pkg,t).stats.r,/Armure corporelle 3/);
const a=blank('adrak');assert.ok(eligible(a,'extral-projection-de-masse'),'Combat trigger does not prevent acquisition');
const n=blank('talass','ctu');n.truthTalents=['extral-standard-terrestre'];const cost=m.truthPtvSpent(pkg,n);n.choices.network='aucune';assert.equal(m.truthPtvSpent(pkg,n),cost);assert.deepEqual(m.truthSanitizeTalents(pkg,n),n.truthTalents);assert.equal(m.extralUsableTalents(pkg,n).has(n.truthTalents[0]),false);assert.ok(m.extralSheetDetails(pkg,n).some(d=>d.id==='extral-unavailable'));
n.consciousness='profane';assert.deepEqual(m.truthSanitizeTalents(pkg,n),n.truthTalents);assert.equal(m.extralUsableTalents(pkg,n).size,0);
const r=blank('thalsios','smrc');r.extralInventory=[{uid:'bio',itemId:'real-bio',name:'Greffe réelle',kind:'augmentation',biological:true}];configure(r,{recombination:{graftUid:'bio',talentId:'extral-thermovision',architecture:'Organe visuel compatible à valider avec le MJ'}});assert.ok(eligible(r,m.extralTalentIds.recombine));r.truthTalents.push(m.extralTalentIds.recombine);assert.ok(eligible(r,'extral-thermovision'));assert.equal(rows(r).some(t=>t.id==='extral-gouter-l-air'),false);r.truthTalents.push('extral-thermovision');assert.ok(m.extralUsableTalents(pkg,r).has('extral-thermovision'));const paid=m.truthPtvSpent(pkg,r);r.extralInventory=[];assert.equal(m.extralUsableTalents(pkg,r).has('extral-thermovision'),false);assert.equal(m.truthPtvSpent(pkg,r),paid);assert.deepEqual(m.truthSanitizeTalents(pkg,r),r.truthTalents);
const restricted=blank('mosen','smrc');assert.equal(eligible(restricted,'extral-tolerance-au-greffon'),false);configure(restricted,{training:'Recrutement à valider',trainingNetwork:'smrc'});assert.equal(eligible(restricted,'extral-tolerance-au-greffon'),true);restricted.choices.network='hydroguard';assert.equal(eligible(restricted,'extral-equilibrage-brutal'),false,'Prior network note must not grant another training');
const aidh=blank('homo_superior');
assert.deepEqual(pkg.structure.natures.extral.choices.find(c=>c.key==='network').optionsBy.homo_superior.map(o=>o.id),['aucune','aidh_intervention','aidh_coherence']);
for(const network of ['smrc','reptile','continuite','ctu']){
 aidh.choices.network=network;configure(aidh,{training:'Legacy training must not grant access',trainingNetwork:network});
 assert.equal(rows(aidh).some(t=>t.when?.network===network),false,'AIDH cannot buy '+network);
 assert.equal(m.truthSanitizeChoices(pkg.structure.natures.extral,aidh.choices).network,'aucune');
}
aidh.choices.network='aidh_intervention';assert.ok(rows(aidh).some(t=>t.when?.network==='aidh_intervention'));
for(const item of pkg.equipment.filter(i=>!i.requiresMj&&['25','26'].includes(i.chapter))){
 assert.equal(m.truthEquipmentVisible(item,{...aidh,mode:'creation'}),item.chapter==='26','AIDH catalogue is separate from xeno market');
 if(!item.referenceOnly)assert.equal(m.truthEquipmentVisible(item,{...blank('talass'),mode:'creation'}),item.chapter==='25','Ordinary Extral catalogue preserved');
}
const hs=blank('homo_superior');hs.truthTalents=[m.extralTalentIds.repair,m.extralTalentIds.reserve,m.extralTalentIds.phase];hs.extralInventory=[{uid:'owned',itemId:'weapon',name:'Arme',kind:'equipment',biological:false}];configure(hs,{reserveUsed:true,repairUsed:true,patches:[{uid:'owned',state:'phased'},{uid:'sold',state:'phased'}]});
for(let i=0;i<4;i++){hs.choices=m.truthSanitizeChoices(pkg.structure.natures.extral,hs.choices);assert.equal(hs.choices.extralBuild.repairUsed,true);assert.equal(hs.choices.extralBuild.reserveUsed,true);assert.match(m.extralInventoryAnnotation(hs,'owned'),/déphasé/);}
assert.equal(m.extralNaturalRecoveryMultiplier(pkg,hs),2);const details=m.extralSheetDetails(pkg,hs);assert.equal(details.filter(d=>d.value==='Utilisation du scénario consommée').length,2);assert.ok(details.some(d=>d.name.includes('Ancien objet absent')));
const reality={equipment:[{uid:'owned',itemId:'weapon',kind:'equipment',selectedPrice:600}],augmentations:[]};const before=JSON.stringify(reality);assert.equal(m.extralOwnedItems(reality,true).length,1);assert.equal(JSON.stringify(reality),before);
const d=m.blankCharacterData('Extral');d.truth=structuredClone(hs);delete d.truth.extralInventory;d.reality=reality;d.progression={xpEarned:0,ptvEarned:0,cashTransactions:[]};const dataBefore=JSON.stringify(d);
const {terraUmbraCreationRules:rules}=await import('../../api/dist/rules/terra-umbra-creation.js');
const {terraUmbraCreationLore:lore,terraUmbraTalentChoiceSpecs:specs,terraUmbraRealitySkillTalentMap:skillMap}=await import('../../api/dist/rules/terra-umbra-creation-lore.js');
const {getRealityRules}=await import('../../api/dist/rules/reality.js');
const fixture=await readFile(new URL('./builder-v2-smoke.mjs',import.meta.url),'utf8'),fx=fixture.slice(fixture.indexOf('const skillIds='),fixture.indexOf('const browser='));
const f=await build({stdin:{resolveDir:root,loader:'ts',contents:`${fx}\nexport {edgeRules};`},bundle:true,write:false,format:'esm',platform:'node'});const {edgeRules}=await import('data:text/javascript;base64,'+Buffer.from(f.outputFiles[0].text).toString('base64'));
const core={rules,lore,talentChoiceSpecs:specs,skillTalentMap:skillMap,disadvantages:{common:[],attribute:[],sphere:{}},edgeRules},real=getRealityRules();
const sheet=m.buildCharacterSheet(d,core,pkg,real,true);assert.equal(sheet.inventory.filter(i=>i.id==='owned').length,1);assert.match(sheet.inventory.find(i=>i.id==='owned').detail,/déphasé/);assert.ok(sheet.truthDetails.some(i=>i.name==='Cycle de réparation'));assert.equal(JSON.stringify(d),dataBefore,'Projection never grants rewards or heals');
const pdf=m.projectCharacterPdf({data:d,core,truth:pkg,reality:real,campaign:true},new Set());assert.match(JSON.stringify(pdf),/Cycle de réparation/);assert.match(JSON.stringify(pdf),/consommée/);
console.log('EXTRAL WEB OK — seven profiles, all networks, restricted training, preserved PTV/dependencies, bounded graft unlock, actual stock phasing, no duplication, independent scenario counters, numeric body profiles, shared/PDF details and no reward mutation');
