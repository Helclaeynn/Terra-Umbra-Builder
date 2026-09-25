import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM} from 'jsdom';
import {BESTIARY_CATALOG,generateBestiaryBatch} from '../../api/dist/campaign-bestiary-generator.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
 import {createApp,h,nextTick} from 'vue';import {createRouter,createMemoryHistory,RouterView} from 'vue-router';import CampaignBestiary from './src/components/CampaignBestiary.vue';
 const page={render:()=>h(CampaignBestiary,{campaignId:'11111111-1111-4111-8111-111111111111',selectable:true,onSelect:c=>window.selected=c})};
 const router=createRouter({history:createMemoryHistory(),routes:[{path:'/',component:page}]});
 const app=createApp({render:()=>h(RouterView)}).use(router);
 window.test={ready:router.push('/').then(()=>{app.mount('#app');return nextTick()}),unmount:()=>app.unmount()};
 `},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'bestiary-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only'}),w=dom.window;w.Headers=Headers;w.structuredClone=structuredClone;w.confirm=()=>true;
const calls=[];let saved=[];
w.fetch=async(url,options={})=>{const method=options.method||'GET',body=options.body?JSON.parse(options.body):undefined;calls.push({url,method,body});let result;
 if(url.endsWith('/catalog'))result=BESTIARY_CATALOG;
 else if(url.endsWith('/generate'))result={creatures:generateBestiaryBatch(body)};
 else if(method==='POST'&&url.endsWith('/bestiary')){saved.push(...body.creatures);result={ok:true,ids:body.creatures.map(c=>c.id)};}
 else if(method==='GET'&&url.includes('/bestiary?'))result={creatures:saved.map(c=>({id:c.id,name:c.data.name,realm:c.data.realm,difficultyId:c.data.difficultyId,role:c.data.role,version:1,archived:false})),hasMore:false};
 else throw Error('Unexpected '+method+' '+url);return {ok:true,status:200,json:async()=>result};};
const wait=async condition=>{for(let i=0;i<200;i++){if(condition())return;await new Promise(r=>setTimeout(r,10));}assert.ok(condition(),w.document.body.textContent.slice(0,700));};
const click=text=>{const btn=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(btn,text);btn.click();};
try{
 w.eval(bundle.outputFiles[0].text);await w.test.ready;await wait(()=>w.document.querySelector('.bestiary-manager button.primary')&&!w.document.querySelector('.bestiary-manager button.primary').disabled);
 click('Générateur de bestiaire');await wait(()=>w.document.querySelectorAll('.fields select').length===4);
 const selects=[...w.document.querySelectorAll('.fields select')];selects[2].value='tireur';selects[2].dispatchEvent(new w.Event('change',{bubbles:true}));selects[3].value='Fusil d’assaut';selects[3].dispatchEvent(new w.Event('change',{bubbles:true}));
 click('Générer maintenant');await wait(()=>w.document.body.textContent.includes('Rejeter cette fiche'));assert.equal(saved.length,0);const first=w.document.querySelector('.creature-sheet .attack');assert.ok(first.textContent.includes('Fusil d’assaut')||first.textContent.includes('DGT'));
 click('Rejeter cette fiche');assert.equal(saved.length,0);
 click('Générateur de bestiaire');await wait(()=>w.document.body.textContent.includes('Générer maintenant'));click('Générer maintenant');await wait(()=>w.document.body.textContent.includes('Conserver et enregistrer'));click('Conserver et enregistrer');await wait(()=>saved.length===1);assert.equal(saved[0].data.attacks[0].weaponId.startsWith('armes-automatiques-'),true);await wait(()=>w.selected);assert.equal(w.selected.id,saved[0].id);
 click('Créer une créature');await wait(()=>w.document.body.textContent.includes('Ouvrir la fiche personnalisée'));click('Ouvrir la fiche personnalisée');await wait(()=>w.document.body.textContent.includes('Nouvelle créature'));assert.equal(saved.length,1);
}finally{w.test?.unmount();dom.window.close();}
console.log('CAMPAIGN BESTIARY DOM OK — exact category, unsaved rejection, save and scene selection, custom sheet');
