import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const model=await build({stdin:{resolveDir:root,loader:'ts',contents:`
export * from './src/lib/aseryn';export * from './src/lib/truth';
export * from './src/lib/progression';export * from './src/lib/character-sheet-model';
export * from '../api/src/character-data';
`},bundle:true,write:false,format:'esm',platform:'node'});
const m=await import('data:text/javascript;base64,'+Buffer.from(model.outputFiles[0].text).toString('base64'));
const {terraUmbraTruthRules:pkg}=await import('../../api/dist/rules/truth/rules.js');
const {terraUmbraCreationRules:rules}=await import('../../api/dist/rules/terra-umbra-creation.js');
const {terraUmbraCreationLore:lore,terraUmbraTalentChoiceSpecs:specs,terraUmbraRealitySkillTalentMap:skillMap}=await import('../../api/dist/rules/terra-umbra-creation-lore.js');
const {getRealityRules}=await import('../../api/dist/rules/reality.js');
const {aserynRevisions}=await import('../../api/dist/rules/truth/aseryn-revision.js');
const idByName=name=>{const t=pkg.catalogs.aseryn.find(t=>t.name===name);assert.ok(t,name);return t.id;};
const H=m.aserynHeritageIds;
const state={nature:'aseryn',consciousness:'initie',choices:{origin:'seratheen',tradition:'aucune',seratheenTradition:'aucune',hunterTradition:'aucune',aserynTrace1:'aerilien',aserynTrace2:'mulien',aserynAtavism:'aerilien',aserynMosaic:'mulien'},truthTalents:[],truthEquipment:[],corruptionTalents:[],corruption:0,corruptionSource:'',corruptionMjAuthorized:false,truthEquipmentMjOverride:false};
const available=s=>m.truthAvailableTalents(pkg,s);
const names=s=>available(s).map(t=>t.name);
assert.deepEqual(m.aserynFullSignatures(state),[]);
assert.equal(names(state).includes('Télépathie mûlienne'),false,'Trace alone does not grant Origin talent access');
state.truthTalents=[H.atavism];assert.deepEqual(m.aserynFullSignatures(state),['aerilien']);assert.equal(names(state).includes('Lecture des flux'),false,'Signature is not yet the learned path');
state.truthTalents.push(H.awaken);assert.ok(names(state).includes('Lecture des flux'));assert.equal(names(state).includes('Télépathie mûlienne'),false);
const beforeMosaic=m.truthPtvSpent(pkg,state);
state.truthTalents.push(H.mosaic);assert.deepEqual(m.aserynFullSignatures(state),['aerilien','mulien']);assert.ok(names(state).includes('Télépathie mûlienne'));
assert.equal(m.truthPtvSpent(pkg,state),beforeMosaic+3);
state.truthTalents.push(idByName('Télépathie mûlienne'));
assert.deepEqual(m.truthSanitizeTalents(pkg,state),state.truthTalents,'Inherited talent remains selected through sanitization');
const cleaned=m.truthSanitizeChoices(pkg.structure.natures.aseryn,state.choices);
for(const key of ['aserynTrace1','aserynTrace2','aserynAtavism','aserynMosaic'])assert.equal(cleaned[key],state.choices[key]);
assert.equal(m.sanitizeAserynChoices({aserynElement:'bogus',aserynTrace1:'god'}).aserynTrace1,undefined);
const lost={...state,truthTalents:state.truthTalents.filter(id=>id!==H.mosaic)};
assert.equal(m.truthSanitizeTalents(pkg,lost).includes(idByName('Télépathie mûlienne')),false,'Removing Mosaic revokes second path');
const duplicated={...state,choices:{...state.choices,aserynMosaic:'aerilien'}};assert.deepEqual(m.aserynFullSignatures(duplicated),['aerilien']);
assert.equal(names({...state,choices:{...state.choices,aserynMosaic:''}}).includes('Télépathie mûlienne'),false);
assert.equal(m.truthPtvSpent(pkg,{...state,choices:{...state.choices,aserynMosaic:''}}),m.truthPtvSpent(pkg,state),'Incomplete choices never refund a saved talent');
assert.equal(m.aserynChoiceFields({...state,choices:{...state.choices,aserynTrace3:'lemurian'}}).find(f=>f.key==='aserynTrace1').options.some(o=>o.id==='lemurian'),true,'Inactive third trace cannot reserve a choice');
for(const [name,cost] of [['Signature électrique',1],['Arbitrage',1],['Chambre scellée',2],['Détruire la fausse certitude',2],['La famille ne manque de rien',2]])assert.equal(pkg.catalogs.aseryn.find(t=>t.name===name).cost,cost);
for(const element of ['air','eau','terre','feu']){
 const sample={...state,choices:{origin:'lemurian',aserynElement:element}};
 const t=available(sample).find(t=>t.name==='Déchaînement nymphal');assert.equal(t.effect,t.elementEffects[element]);
 assert.ok([...new Intl.Segmenter('fr',{granularity:'sentence'}).segment(t.effect)].length<=2);
 if(element==='eau'){assert.match(t.effect,/20 m/);assert.match(t.effect,/fin de la scène/);assert.match(t.effect,/−3/);}
}
const source=await readFile(new URL('./builder-v2-smoke.mjs',import.meta.url),'utf8');
const fixtures=source.slice(source.indexOf('const skillIds='),source.indexOf('const browser='));
const fixtureBundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`${fixtures}\nexport {edgeRules};`},bundle:true,write:false,format:'esm',platform:'node'});
const {edgeRules}=await import('data:text/javascript;base64,'+Buffer.from(fixtureBundle.outputFiles[0].text).toString('base64'));
const core={rules,lore,talentChoiceSpecs:specs,skillTalentMap:skillMap,disadvantages:{common:[],attribute:[],sphere:{}},edgeRules};
const data=m.blankCharacterData('Aseryn vérifié');data.truth=structuredClone(state);data.truth.truthTalents=[H.atavism,H.awaken];data.progression={ptvEarned:20,xpEarned:0,truthTalents:[H.mosaic,idByName('Télépathie mûlienne')]};
const original=JSON.stringify(data),reality=getRealityRules();
const base=m.buildCharacterSheet(data,core,pkg,reality,false),campaign=m.buildCharacterSheet(data,core,pkg,reality,true);
assert.equal(campaign.ptvRemaining,base.ptvRemaining+20-4,'Campaign purchases really deduct PTV');
assert.ok(campaign.truthFreeTraits.some(t=>t.name==='Signature Mûlienne'));
assert.equal(base.truthFreeTraits.some(t=>t.name==='Signature Mûlienne'),false,'Campaign Mosaic does not rewrite creation');
assert.ok(campaign.truthDetails.some(d=>d.id==='aserynMosaic'&&d.value==='Mûlienne'));
assert.equal(campaign.attributes.map(a=>a.value).join(),base.attributes.map(a=>a.value).join(),'Inherited signature grants no attribute points');
assert.equal(JSON.stringify(data),original,'Sheet calculation does not mutate records or rewards');
assert.deepEqual(m.normalizeCharacterData(data).truth.choices,data.truth.choices,'Selections survive persistence normalization');
const combat=structuredClone(data);combat.truth.truthTalents.push(...Object.keys(aserynRevisions));
const sheet=m.buildCharacterSheet(combat,core,pkg,reality,true);
assert.equal(sheet.derived.pvMax,campaign.derived.pvMax,'Conditional effects do not become permanent PV');
assert.equal(sheet.derived.passiveDefense,campaign.derived.passiveDefense,'Active defense bonuses do not inflate base defense');
for(const t of sheet.truthTalents.filter(t=>t.effectDetails)){assert.ok(t.activation);assert.ok(t.detail);}
// Real Vue rendering: visible effects remain short; full new rules are closed by default.
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
import {createApp,h,ref} from 'vue';import Text from './src/components/builder/TruthTalentText.vue';import Choices from './src/components/builder/AserynTalentChoices.vue';import Sheet from './src/components/builder/CharacterSummary.vue';
window.start=(which,props)=>{const value=ref(props.state);const app=createApp({render:()=>h(which==='choices'?Choices:which==='sheet'?Sheet:Text,{...props,state:value.value,onChange:(key,v)=>value.value={...value.value,choices:{...value.value.choices,[key]:v}}})});app.mount('#app');window.stop=()=>app.unmount();window.state=()=>JSON.parse(JSON.stringify(value.value));};
`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});assert.deepEqual(errors,[]);return {contents:compileScript(descriptor,{id:'aseryn-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only',virtualConsole:vc});const w=dom.window,d=w.document;w.structuredClone=structuredClone;w.Headers=Headers;w.requestAnimationFrame=f=>setTimeout(f,0);w.cancelAnimationFrame=clearTimeout;w.fetch=async()=>({ok:true,json:async()=>({items:[]})});w.eval(bundle.outputFiles[0].text);
const tick=()=>new Promise(r=>setTimeout(r,0));
for(const rule of Object.values(aserynRevisions)){
 w.start('text',{effect:rule.effect,details:rule.effectDetails,activation:rule.activation,lore:'Ambiance'});await tick();
 assert.equal(d.querySelector('[data-truth-summary]').textContent,rule.effect);assert.equal(d.querySelector('details').open,true);d.querySelector('details').open=false;assert.equal(d.querySelector('details').open,false,'The expanded rule can still be folded');assert.equal(d.querySelector('[data-truth-full-rule]').textContent,rule.effectDetails);w.stop();await tick();
}
w.start('choices',{state});await tick();assert.ok(d.querySelector('[data-aseryn-choice="aserynMosaic"]'));
const select=d.querySelector('[data-aseryn-choice="aserynMosaic"]');assert.equal([...select.options].some(o=>o.value==='aerilien'),false);select.value='mulien';select.dispatchEvent(new w.Event('change',{bubbles:true}));await tick();assert.equal(w.state().choices.aserynMosaic,'mulien');w.stop();await tick();
w.start('sheet',{sheet:campaign});await tick();assert.match(d.body.textContent,/Signature Mûlienne/);assert.ok(d.querySelector('[data-truth-choice="aserynMosaic"]'));assert.equal(d.querySelectorAll('[data-aseryn-choice]').length,0,'Shared sheet is read-only');w.stop();dom.window.close();assert.deepEqual(errors,[]);
console.log('ASERYN WEB OK — 40 concise rules and details, 5 prices, inherited access/prerequisites/second signature, element-specific rules, saved selections, campaign PTV and source isolation, shared read-only sheet, no permanent combat/reward inflation');
