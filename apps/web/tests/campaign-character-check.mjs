Error.stackTraceLimit=0;
import {mkdtemp,copyFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const bundle=await build({stdin:{resolveDir:fileURLToPath(new URL('../',import.meta.url)),loader:'ts',contents:`
import {buildCharacterSheet} from './src/lib/character-sheet-model';
import {campaignCharacterState} from '../api/src/campaign-character';
import {blankCharacterData} from '../api/src/character-data';
import {terraUmbraCreationRules as rules} from '../api/src/rules/terra-umbra-creation';
import {terraUmbraCreationLore as lore,terraUmbraTalentChoiceSpecs as talentChoiceSpecs,terraUmbraRealitySkillTalentMap as skillTalentMap} from '../api/src/rules/terra-umbra-creation-lore';
import {terraUmbraDisadvantages as disadvantages,terraUmbraEdgeRules as edgeRules} from '../api/src/rules/terra-umbra-disadvantages-edge';
import {getRealityRules} from '../api/src/rules/reality';
export {buildCharacterSheet,campaignCharacterState,blankCharacterData,getRealityRules};
export const core={rules,lore,talentChoiceSpecs,skillTalentMap,disadvantages,edgeRules};
`},bundle:true,write:false,format:'esm',platform:'node'});
const {buildCharacterSheet,campaignCharacterState,blankCharacterData,getRealityRules,core}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const root=await mkdtemp(join(tmpdir(),'tuc-economy-'));
process.env.TUC_REALITY_RULES_ROOT=root;
try {
await copyFile(new URL('../../../compendium/source/current-equipment-catalog-v1.json',import.meta.url),join(root,'current-equipment-catalog-v1.json'));
await copyFile(new URL('../../../character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64',import.meta.url),join(root,'augmentations.json.gz.b64'));
await copyFile(new URL('../../../character-builder/rulesets/terra-umbra/reality/safe/vehicles.part01.b64',import.meta.url),join(root,'vehicles.part01.b64'));
const reality=getRealityRules();
const truth={structure:{ptvInitial:5,natures:{humain:{name:'Humain'}},consciousness:[]},catalogs:{},corruption:{sources:[],talents:[]},equipment:[]};
for(const [index,style] of core.rules.styles.entries()){
 const d=blankCharacterData('Test');d.creation.style=style.id;d.creation.sphere=Object.keys(core.rules.spheres)[index%Object.keys(core.rules.spheres).length];
 d.edge.cashPacks=1;d.edge.augmentationPacks=1;d.skills.force_mentale.free=2;d.skills.humanite.style=1;
 d.talents.expertise=Object.entries(core.skillTalentMap).find(([,s])=>s==='force_mentale')?.[0]||'';
 const permanent=Object.entries(core.talentChoiceSpecs).find(([,s])=>s.kind==='skill'&&s.permanent);
 if(permanent){d.talents.origin=permanent[0];d.talentChoices[permanent[0]]='humanite';}
 d.progression.skillRanks={force_mentale:2,humanite:1};d.progression.realityTalents=[Object.entries(core.skillTalentMap).find(([,s])=>s==='humanite')?.[0]].filter(Boolean);
 d.progression.cashTransactions=[{uid:'old',amount:150,label:'Ancien versement',type:'manual',at:'2026-09-23'}];
 const item=reality.equipment.find(i=>i.price>0&&!i.vehicle);if(item)d.reality.equipment=[{uid:'buy',itemId:item.id,selectedPrice:75}];
 if(index%2)d.disadvantages=['integrite_defaillante'];
 if(index%3===0)d.progression.cashBase=1234;
 const before=JSON.stringify(d),api=campaignCharacterState(d),sheet=buildCharacterSheet(d,core,truth,reality);
 assert.equal(api.money,sheet.cash,style.id+' cash');assert.equal(api.integrity,sheet.derived.integrity,style.id+' integrity');assert.equal(JSON.stringify(d),before);
}
console.log('CAMPAIGN CHARACTER MODEL OK — every canonical style, shared money formula, frozen balances, purchased equipment, permanent choices, campaign talents and integrity agree with the character sheet');

}finally{delete process.env.TUC_REALITY_RULES_ROOT;await rm(root,{recursive:true,force:true});}
