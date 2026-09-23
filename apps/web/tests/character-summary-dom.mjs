import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { parse, compileScript } from '@vue/compiler-sfc';
import { JSDOM, VirtualConsole } from 'jsdom';

const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
import {createApp,ref,h} from 'vue';
import {createRouter,createMemoryHistory} from 'vue-router';
import Summary from './src/components/builder/CharacterSummary.vue';
import Reading from './src/components/AccountLastReading.vue';
import {characterDerivedStats} from './src/lib/character-sheet';
import {currentAttribute,currentSkillRaw,currentSkillFinal,ensureProgression} from './src/lib/progression';
window.calculations={characterDerivedStats,currentAttribute,currentSkillRaw,currentSkillFinal,ensureProgression};
window.start=async(kind,props)=>{
 const state=ref(props), component=kind==='reading'?Reading:Summary;
 const router=createRouter({history:createMemoryHistory(),routes:[{path:'/:pathMatch(.*)*',component:{render:()=>null}}]});
 const app=createApp({render:()=>h(component,{...state.value,key:state.value.userId})}).use(router);
 await router.push('/account'); app.mount('#app');
 window.setProps=next=>{state.value=next}; window.stop=()=>app.unmount();
};`},bundle:true,write:false,format:'iife',platform:'browser',
 define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},
 plugins:[{name:'vue',setup(b){
 b.onLoad({filter:/BuilderWikiLink\.vue$/},()=>({contents:"import {h} from 'vue'; export default { render(){return h('a',{href:'/compendium?article=should-not-open'},'Compendium')} }",loader:'js'}));
 b.onLoad({filter:/\.vue$/},async({path:filename})=>{
  const {descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});assert.equal(errors.length,0);
  return {contents:compileScript(descriptor,{id:'sheet-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};
 });
 }}]});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn){for(let i=0;i<100;i++){if(fn())return;await wait(5)}assert.ok(fn(),'Expected DOM state was not reached')}
function environment(){
 const errors=[], vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
 const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/account',runScripts:'outside-only',virtualConsole:vc});
 dom.window.Headers=Headers;dom.window.eval(bundle.outputFiles[0].text);
 return {w:dom.window,errors,close(){dom.window.stop?.();dom.window.close();assert.deepEqual(errors,[])}};
}
const env=environment(), {w}=env, c=w.calculations;
const attrs={vigueur:4,agilite:3,esprit:3,volonte:4,charisme:2};
const raw={constitution:2,athletisme:1,esquive:2,force_mentale:2,humanite:1,melee:1,pugilat:1,tir:2,neurodive:1};
const finals={...raw,athletisme:2};
const progress=c.ensureProgression({xpEarned:100,skillRanks:{constitution:1,athletisme:1},attributeRanks:{vigueur:1},realityTalents:['learned-athlete']},Object.keys(raw),Object.keys(attrs));
const before=JSON.stringify({progress,attrs,raw,finals});
const currentAttribute=id=>c.currentAttribute(progress,attrs,id);
const currentSkill=id=>c.currentSkillFinal(progress,raw,finals,{'learned-athlete':'athletisme'},id);
const creation=c.characterDerivedStats(id=>attrs[id],id=>finals[id],[]);
const campaign=c.characterDerivedStats(currentAttribute,currentSkill,[]);
assert.equal(creation.pvMax,10);assert.equal(campaign.pvMax,13);
assert.equal(c.currentSkillRaw(progress,raw,'athletisme'),2);
assert.equal(currentSkill('athletisme'),4,'Creation and learned bonuses count once each');
assert.equal(campaign.initiative,7);assert.equal(campaign.movement,9);
const constrained=c.characterDerivedStats(currentAttribute,currentSkill,['lent_a_reagir','integrite_defaillante']);
assert.equal(constrained.initiative,5);assert.equal(constrained.integrity,1);
assert.equal(JSON.stringify({progress,attrs,raw,finals}),before,'Summary calculations must not mutate the character');
const sheet={mode:'creation',name:'Alexandra',identity:{alias:'Aube',concept:'Enquêtrice',notes:'<script>unsafe</script>'},origin:'Citadine',sphere:'Crawler',style:'Enquête',
 lifestyle:'Standard',lifestyleBase:'Standard',renown:1,
 attributes:Object.keys(attrs).map(id=>({id,name:id,value:attrs[id],base:attrs[id]})),
 skills:Object.keys(raw).map(id=>({id,name:id,attribute:'vigueur',value:finals[id],raw:raw[id],bonus:finals[id]-raw[id]})),derived:creation,
 edge:1,xpRemaining:0,ptvRemaining:5,account:100,cash:75,realityTalents:[{id:'athlete',name:'Athlète',detail:'+1 Athlétisme',compendiumId:'removed-page',lore:'Une discipline quotidienne'}],truthTalents:[],disadvantages:[],inventory:[],
 truthNature:'Humain',truthConsciousness:'Profane',corruption:0,corruptionSource:'',languages:['Anglais'],contacts:[],reputation:'',renownMilieu:''};
const sheetBefore=JSON.stringify(sheet);
await w.start('summary',{sheet});
assert.equal(w.document.querySelector('[data-stat="pvMax"] strong').textContent,'10');
assert.equal(w.document.querySelector('[data-skill="athletisme"] dd').textContent,'2');
assert.equal(w.document.querySelector('.character-sheet script'),null);
assert.equal(w.document.querySelectorAll('input,select,textarea').length,0,'Sheet is read-only');
assert.equal(JSON.stringify(sheet),sheetBefore);
assert.equal(w.document.querySelector('[data-list="reality"] a'),null,'Talent details stay local even with a legacy compendium ID');
assert.match(w.document.querySelector('[data-list="reality"]').textContent,/Une discipline quotidienne/);
w.setProps({sheet:{...sheet,mode:'campaign',derived:campaign,attributes:sheet.attributes.map(a=>({...a,value:currentAttribute(a.id)})),skills:sheet.skills.map(s=>({...s,value:currentSkill(s.id)})),xpRemaining:42}});
await until(()=>w.document.querySelector('[data-stat="pvMax"] strong').textContent==='13');
assert.equal(w.document.querySelector('[data-attribute="vigueur"] strong').textContent,'5');
assert.equal(w.document.querySelector('[data-skill="athletisme"] dd').textContent,'4');
assert.match(w.document.querySelector('.sheet-resources').textContent,/Solde de campagne75/);
env.close();

const reading=environment(), rw=reading.w;
let recent=[{id:'article-1',title:'Titre autorisé par le serveur',category:'Réalité'}], fail=false, pending=null;
rw.localStorage.setItem('tuc-compendium-reading-v1:player',JSON.stringify({'article-1':{sectionId:'section-cible',updatedAt:1000}}));
rw.localStorage.setItem('tuc-compendium-reading-v1:other',JSON.stringify({'article-1':{sectionId:'autre-section',updatedAt:1000}}));
rw.fetch=async url=>{assert.equal(url,'/api/compendium/library');if(pending)await pending;return {ok:!fail,status:fail?500:200,json:async()=>({recentItems:recent})}};
await rw.start('reading',{userId:'player'});
const link=()=>rw.document.querySelector('.account-last-reading a');
await until(()=>link()?.textContent.includes('Reprendre'));
assert.match(link().getAttribute('href'),/article=article-1&section=section-cible/);
assert.match(rw.document.querySelector('h2').textContent,/Titre autorisé/);
rw.setProps({userId:'other'});
await until(()=>link()?.getAttribute('href').includes('autre-section'));
fail=true;rw.dispatchEvent(new rw.Event('focus'));
await until(()=>rw.document.querySelector('button'));
assert.equal(rw.document.querySelector('h2'),null,'A failed refresh must not retain a private title');
fail=false;recent=[];rw.document.querySelector('button').click();
await until(()=>link()?.textContent.includes('Explorer'));
recent=[{id:'article-2',title:'Dernier article',category:'Vérité'}];
Object.defineProperty(rw,'localStorage',{get(){throw new Error('Storage disabled')}});
rw.dispatchEvent(new rw.Event('focus'));
await until(()=>link()?.getAttribute('href').includes('article-2'));
assert.equal(link().getAttribute('href'),'/compendium?article=article-2');
let release;pending=new Promise(r=>release=r);
rw.dispatchEvent(new rw.Event('focus'));await wait(5);
rw.stop();release();await wait(10);
assert.equal(rw.document.querySelector('h2'),null,'Late responses cannot restore an unmounted private title');
reading.close();
console.log('Character sheet & reading OK — creation/campaign values, shared bonuses, constraints, read-only rendering, server history, account isolation, section resume and error handling');
