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
const {daemonTalentIds:ids}=await import('../../api/dist/rules/truth/daemon-build.js');
const truth={nature:'daemon',consciousness:'initie',choices:{divinity:'mephisto',function:'oracle',patron:'',soulOrigin:'eveille'},truthTalents:[],truthEquipment:[],truthEquipmentMjOverride:false,corruptionMjAuthorized:false,corruption:0,corruptionSource:'',corruptionTalents:[]};
const reality={equipment:[],augmentations:[],fixedChargeItems:[]};
const props={rewardsLocked:true,progression:{ptvEarned:10,xpEarned:7,cashBase:900,renownAdjustment:1},reality,truthState:truth,rules:plain(actualRules),truthRules:canonical,realityRules:{equipment:[],augmentations:[],recurring:[],economy:{},source:{},counts:{}},style:null,edge:{},sphereId:'independant',sphereName:'Indépendant',creationTalentIds:[],talentChoiceSpecs:plain(specs),creationTalentChoices:{},skillTalentMap:plain(skillMap),disadvantages:[],skillBases:Object.fromEntries(actualRules.skills.map(s=>[s.id,1])),skillFinalBases:Object.fromEntries(actualRules.skills.map(s=>[s.id,1])),attributeBases:Object.fromEntries(actualRules.attributes.map(a=>[a.id,4])),creationPtvReserve:0,creationAccount:900};
try{
 const state={...truth,nature:'vampire',choices:{court:'alghul_almalakiu',blood:'sang_primal'},truthTalents:['forme_animale','menagerie','sang_anime','arme_hematique','sang_preserve','lien_du_deimon']};
 w.start('progression',{...props,truthState:state});await tick();
 const open=async(label,id)=>{const button=[...d.querySelectorAll('button')].find(b=>b.textContent.trim()===label);assert.ok(button,label);button.click();await tick();assert.ok(d.querySelector('[data-truth-build-choice="'+id+'"]'),id);};
 await open('Choisir la forme animale','forme_animale');
 await open('Compléter le répertoire animal','menagerie');
 await open('Consigner l’ancrage de Sang','sang_preserve');
 const anchor=d.querySelector('[data-truth-build-choice="sang_preserve"] input');set(anchor,'Flacon du refuge','input');await tick();assert.equal(w.current().truth.choices.vampireBuild.anchor.container,'Flacon du refuge');
 await open('Référencer le Deimon lié','lien_du_deimon');
 const deimon=d.querySelector('[data-truth-build-choice="lien_du_deimon"] input');set(deimon,'Deimon existant','input');await tick();assert.equal(w.current().truth.choices.vampireBuild.deimon.name,'Deimon existant');
 await open('Consulter les trois armes hématiques','arme_hematique');
 assert.match(d.querySelector('[data-truth-build-choice="arme_hematique"]').textContent,/DGT 5.*DGT 4.*DGT 5/s);
 assert.equal(d.querySelector('[data-reward-editor]'),null);assert.equal(w.current().progress.ptvEarned,10);assert.equal(w.current().progress.cashBase,900);
 w.stop();await tick();
 console.log('VAMPIRE DOM OK — guided permanent records, exact weapons, reactive saved fields and protected rewards');
}finally{dom.window.close();}
assert.deepEqual(errors,[],'No runtime error');
