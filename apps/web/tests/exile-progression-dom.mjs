import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=await readFile(new URL('./builder-v2-smoke.mjs',import.meta.url),'utf8');
const fixtures=source.slice(source.indexOf('const skillIds='),source.indexOf('const browser='));
assert.ok(fixtures.length>1000,'Real smoke fixtures must be available');
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
import {createApp,h,ref} from 'vue';
import Equipment from './src/components/builder/EquipmentStep.vue';
import Progression from './src/components/builder/ProgressionStep.vue';
import * as b from './src/lib/reality-benefits';
import * as r from './src/lib/reality';
import * as p from './src/lib/progression';
import {buildCharacterSheet} from './src/lib/character-sheet-model';
import {characterDerivedStats} from '../api/src/rules/character-derived-stats';
import {blankCharacterData,normalizeCharacterData} from '../api/src/character-data';
import {terraUmbraCreationRules as actualRules} from '../api/src/rules/terra-umbra-creation';
import {terraUmbraCreationLore as actualLore,terraUmbraTalentChoiceSpecs as specs,terraUmbraRealitySkillTalentMap as skillMap} from '../api/src/rules/terra-umbra-creation-lore';
${fixtures}
window.qa={b,r,p,buildCharacterSheet,characterDerivedStats,blankCharacterData,normalizeCharacterData,actualRules,actualLore,specs,skillMap,truthRules,edgeRules};
window.start=(which,props)=>{
  const progress=ref(props.progression??{}),reality=ref(props.reality??props.modelValue),truth=ref(props.truthState);
  const app=createApp({render:()=>h(which==='equipment'?Equipment:Progression,{...props,truthState:truth.value,'onUpdate:truth':v=>truth.value=v,modelValue:reality.value,reality:reality.value,progression:progress.value,
    'onUpdate:modelValue':v=>reality.value=v,'onUpdate:reality':v=>reality.value=v,'onUpdate:progression':v=>progress.value=v})});
  app.mount('#app');window.stop=()=>app.unmount();window.current=()=>({truth:JSON.parse(JSON.stringify(truth.value)),progress:JSON.parse(JSON.stringify(progress.value)),reality:JSON.parse(JSON.stringify(reality.value))});
  window.changeProgress=v=>progress.value=v;
};`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(builder){builder.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});assert.deepEqual(errors,[]);return {contents:compileScript(descriptor,{id:'reality-talents-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only',virtualConsole:vc});
const w=dom.window,d=w.document;w.structuredClone=structuredClone;w.Headers=Headers;w.confirm=()=>true;w.alert=()=>{};w.requestAnimationFrame=fn=>setTimeout(fn,0);w.cancelAnimationFrame=clearTimeout;
w.fetch=async()=>({ok:true,json:async()=>({items:[],article:{title:'Test',sections:[]}})});
w.eval(bundle.outputFiles[0].text);
const {b,r,p,actualRules,actualLore,specs,skillMap,truthRules,edgeRules}=w.qa;
const plain=v=>JSON.parse(JSON.stringify(v));
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
const set=(node,value,event='change')=>{assert.ok(node,'Control exists');node.value=value;node.dispatchEvent(new w.Event(event,{bubbles:true}));};

const {terraUmbraTruthRules:canonical}=await import('../../api/dist/rules/truth/rules.js');
const truth={nature:'exile',consciousness:'initie',choices:{people:'whurten',network:'runes_whurten',hunterTradition:'aucune'},truthTalents:[],truthEquipment:[],corruptionTalents:[],corruption:0,corruptionSource:''};
const reality={equipment:[],augmentations:[],fixedChargeItems:[]};
const props={rewardsLocked:true,progression:{ptvEarned:15,xpEarned:7,cashBase:900,renownAdjustment:1},reality,truthState:truth,rules:plain(actualRules),truthRules:canonical,realityRules:{equipment:[],augmentations:[],recurring:[],economy:{},source:{},counts:{}},style:null,edge:{},sphereId:'independant',sphereName:'Indépendant',creationTalentIds:[],talentChoiceSpecs:plain(specs),creationTalentChoices:{},skillTalentMap:plain(skillMap),disadvantages:[],skillBases:Object.fromEntries(actualRules.skills.map(s=>[s.id,1])),skillFinalBases:Object.fromEntries(actualRules.skills.map(s=>[s.id,1])),attributeBases:Object.fromEntries(actualRules.attributes.map(a=>[a.id,4])),creationPtvReserve:0,creationAccount:900};
try{
 w.start('progression',props);await tick();
 const search=d.querySelector('.truth-search input'),find=name=>Array.from(d.querySelectorAll('.truth-talent-list article')).find(n=>n.querySelector('strong')?.textContent===name),choose=async id=>{const name=canonical.catalogs.exile.find(t=>t.id===id).name;set(search,name,'input');await tick();return find(name);};
 const buy=async id=>{const card=await choose(id);assert.ok(card,id);assert.equal(card.querySelector('button').disabled,false,id+' buyable');card.querySelector('button').click();await tick();};
 assert.equal((await choose('exile-inscription-breve')).querySelector('button').disabled,true);
 await buy('exile-rune-du-foyer');await buy('exile-rune-de-veille');await buy('exile-inscription-breve');
 assert.equal((await choose('exile-phrase-runique')).querySelector('button').disabled,true);
 await buy('exile-rune-de-fer');await buy('exile-phrase-runique');
 // Each user event has its own Vue render cycle, as it does in a browser.
 d.querySelector('[data-exile-add="trainings"]').click();await tick();
 const training=d.querySelector('[data-exile-section="trainings"] fieldset');
 set(training.querySelector('select'),'hds');await tick();
 set(training.querySelector('input:not([type=checkbox])'),'Enseignant','input');await tick();
 set(training.querySelector('textarea'),'Cursus réellement acquis','input');await tick();
 training.querySelector('[type=checkbox]').click();await tick();
 const learned=w.current().truth.choices.exileBuild.trainings[0];
 assert.equal(learned.network,'hds');assert.equal(learned.mentor,'Enseignant');
 assert.equal(learned.conditions,'Cursus réellement acquis');assert.equal(learned.learned,true);
 await buy('exile-lecture-de-distorsion');await buy('exile-hdb-hologram-distorsion-block');await buy('exile-hdp-hologram-distorsion-punishment');
 assert.equal((await choose('exile-rune-de-garde')).querySelector('button').disabled,true,'PTV exhausted');
 assert.deepEqual(plain(w.current().truth.truthTalents),[],'Creation talents are not rewritten');assert.equal(w.current().progress.truthTalents.length,8);assert.equal(w.current().progress.ptvEarned,15);assert.equal(w.current().progress.xpEarned,7);assert.equal(w.current().progress.cashBase,900);assert.equal(w.current().progress.renownAdjustment,1);
 d.querySelector('[data-beneficiary="refection"]').click();await tick();
 d.querySelector('[data-beneficiary="guard"]').click();await tick();assert.equal(w.current().truth.choices.beneficiaryBenefits.refectionReceived,true);assert.equal(w.current().truth.choices.beneficiaryBenefits.guardReceived,true);
 const saved=plain(w.current());w.stop();await tick();w.start('progression',{...props,truthState:saved.truth,progression:saved.progress,reality:saved.reality});await tick();assert.deepEqual(plain(w.current()),saved);assert.equal(d.querySelector('[data-beneficiary="refection"]').disabled,true);
 assert.equal(d.querySelector('[data-reward-editor]'),null);console.log('EXILE PROGRESSION DOM OK — real Vue purchases of base runes/Brief/Phrase and HDB/HDP, learned training, exact PTV costs, creation isolation, saved recipient tracking and unchanged campaign rewards');
}finally{w.stop();dom.window.close();}
assert.deepEqual(errors,[],'No runtime error');
