import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:"export * from './src/lib/truth';export * from './src/lib/hunter';export * from './src/lib/truth-sheet-details';export * from '../api/src/character-data';"},bundle:true,write:false,format:'esm',platform:'node'});
const m=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const {terraUmbraTruthRules:pkg}=await import('../../api/dist/rules/truth/rules.js');
for(const name of ['Forme du Chevalier','Appel de l’arme','Signature impossible','Odeur du semblable'])assert.ok(m.hunterBuildChoiceLabel(pkg.catalogs.humain.find(t=>t.name===name).id),name+' permanent choice');
assert.equal(m.hunterProfileOptions(pkg.catalogs.humain.find(t=>t.name==='Manifestation prêtée').id).length,4);
const blank=(nature='humain',mode='creation')=>({nature,mode,consciousness:'initie',choices:{hunterTradition:'aucune'},truthTalents:[],truthEquipment:[],truthEquipmentMjOverride:true,corruptionTalents:[],corruption:0,corruptionSource:''});
const hunterIds=new Set(pkg.catalogs.humain.map(t=>t.id));
const getHunter=s=>m.truthAvailableTalents(pkg,s).filter(t=>hunterIds.has(t.id));
for(const nature of Object.keys(pkg.structure.natures)){
 const s=blank(nature);s.choices={hunterTradition:'xenoshield',hunterBuild:{doctrines:['catholique','xenoshield']}};
 if(nature!=='humain')assert.equal(getHunter(s).length,0,nature+' creation');
 else assert.ok(getHunter(s).some(t=>/xenoshield/i.test(t.group)));
 s.mode='progression';assert.ok(getHunter(s).some(t=>/xenoshield/i.test(t.group)),nature+' optional doctrine');
 s.choices={hunterTradition:'aucune'};assert.equal(getHunter(s).length,0,nature+' no automatic unlock');
}
for(const d of m.hunterDoctrines){
 const s=blank(d.id==='lavandiere'?'vampire':'humain','progression');s.choices.hunterBuild={doctrines:[d.id]};
 const available=getHunter(s);assert.ok(available.length>=4,d.id);
 for(let i=0;i<available.length;i++)for(const t of available)if(!s.truthTalents.includes(t.id)&&m.truthPrerequisiteSatisfied(pkg,s,t))s.truthTalents.push(t.id);
 assert.equal(s.truthTalents.length,available.length,d.id+' all chains reachable');
 const cost=m.truthPtvSpent(pkg,s);s.choices.hunterBuild={doctrines:[]};assert.equal(getHunter(s).length,0);assert.equal(m.truthPtvSpent(pkg,s),cost);assert.deepEqual(m.truthSanitizeTalents(pkg,s),s.truthTalents);assert.equal(m.truthUnavailableHunters(pkg,s).length,s.truthTalents.length);
}
const s=blank('humain','progression');s.choices.hunterBuild={doctrines:['onmyoji']};const vase=pkg.catalogs.humain.find(t=>t.name==='Vase de Souillure');assert.equal(m.truthPrerequisiteSatisfied(pkg,s,vase),false);s.truthTalents=[vase.anyRequiredTalentIds[0]];assert.equal(m.truthPrerequisiteSatisfied(pkg,s,vase),true);s.truthTalents=[vase.anyRequiredTalentIds[1]];assert.equal(m.truthPrerequisiteSatisfied(pkg,s,vase),false,'Missing ancestor of alternate prerequisite');
for(const chapter of ['23','24','25','26','27']){const item=pkg.equipment.find(t=>t.chapter===chapter&&!t.referenceOnly);if(item)assert.equal(m.truthEquipmentAccess(item,blank()).ok,false,'Creation ignores old GM override '+chapter);}
const x=blank();x.choices.hunterTradition='xenoshield';assert.ok(getHunter(x).length>4);assert.ok(pkg.equipment.filter(t=>t.chapter==='23'&&!t.requiresMj&&!t.referenceOnly).every(t=>m.truthEquipmentAccess(t,x).ok));
const data=m.blankCharacterData('Hunter');data.truth={...x,choices:{...x.choices,hunterBuild:{doctrines:['onmyoji'],records:{[vase.id]:{reference:'Vase réel',profile:'Un effet',ptvEarned:99}},approved:true}}};data.truth.truthTalents=[vase.id];const saved=m.normalizeCharacterData(JSON.parse(JSON.stringify(data)));assert.equal(saved.truth.choices.hunterBuild.records[vase.id].reference,'Vase réel');assert.equal(saved.truth.choices.hunterBuild.approved,undefined);assert.ok(m.truthSheetDetails(pkg,saved.truth,3).some(t=>t.id==='hunter-'+vase.id));
console.log('HUNTERS WEB OK — all natures, opt-in doctrine matrix, entire prerequisite graph, retained prices, creation equipment, bounded persistence and PDF projection');
