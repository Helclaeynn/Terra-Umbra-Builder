import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM} from 'jsdom';
import {NPC_CATALOG,generateNpcBatch} from '../../api/dist/campaign-npc-generator.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
 import {createApp,h,nextTick} from 'vue';import {createRouter,createMemoryHistory,RouterView} from 'vue-router';import CampaignNpcs from './src/components/CampaignNpcs.vue';
 const page={render:()=>h(CampaignNpcs,{campaignId:'11111111-1111-4111-8111-111111111111',selectable:true,onSelect:n=>window.selected=n})};
 const router=createRouter({history:createMemoryHistory(),routes:[{path:'/',component:page}]});
 const app=createApp({render:()=>h(RouterView)}).use(router);
 window.test={ready:router.push('/').then(()=>{app.mount('#app');return nextTick()}),unmount:()=>app.unmount()};
 `},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'npc-creation-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only'}),w=dom.window;
w.Headers=Headers;w.structuredClone=structuredClone;w.confirm=()=>true;
const calls=[];let saved=[];
w.fetch=async(url,options={})=>{const method=options.method||'GET',body=options.body?JSON.parse(options.body):undefined;calls.push({url,method,body});let result;
 if(url.endsWith('/catalog'))result=NPC_CATALOG;
 else if(url.endsWith('/generate'))result={npcs:generateNpcBatch(body)};
 else if(method==='POST'&&url.endsWith('/npcs')){saved.push(...body.npcs);result={ok:true,ids:body.npcs.map(n=>n.id)};}
 else if(method==='GET'&&url.includes('/npcs?'))result={npcs:saved.map(n=>({id:n.id,name:n.data.name,tierId:n.data.tierId,role:n.data.role,faction:n.data.faction,tags:n.data.tags,hasPortrait:false,version:1,archived:false})),hasMore:false};
 else throw Error('Unexpected '+method+' '+url);
 return {ok:true,status:200,json:async()=>result};};
const wait=async condition=>{for(let i=0;i<200;i++){if(condition())return;await new Promise(r=>setTimeout(r,10));}assert.ok(condition(),w.document.body.textContent.slice(0,500));};
const click=text=>{const btn=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(btn,text);btn.click();};
try{
 w.eval(bundle.outputFiles[0].text);await w.test.ready;await wait(()=>w.document.querySelector('.npc-manager button.primary')&&!w.document.querySelector('.npc-manager button.primary').disabled);
 click('Générateur de PNJ');await wait(()=>w.document.querySelectorAll('.generator select').length===4);
 const selectors=[...w.document.querySelectorAll('.generator select')];assert.equal(selectors.length,4);
 selectors[0].value='elite';selectors[0].dispatchEvent(new w.Event('change',{bubbles:true}));
 selectors[1].value='garde';selectors[1].dispatchEvent(new w.Event('change',{bubbles:true}));
 const checkbox=w.document.querySelector('.generator input[type=checkbox]');checkbox.click();
 await wait(()=>w.document.querySelectorAll('.generator select').length===7);
 const truth=[...w.document.querySelectorAll('.truth-choices select')];truth[1].value='exceptionnel';truth[1].dispatchEvent(new w.Event('change',{bubbles:true}));
 click('Créer maintenant');await wait(()=>w.document.body.textContent.includes('Rejeter et regénérer'));
 assert.equal(saved.length,0,'quick sheet is playable before choosing whether to save');
 assert.ok(w.document.querySelector('.truth-profile'),'truth is visible only in the private sheet');
 click('Rejeter cette fiche');assert.equal(saved.length,0);assert.equal(w.selected,undefined);
 click('Générateur de PNJ');await wait(()=>w.document.body.textContent.includes('Créer maintenant'));click('Créer maintenant');await wait(()=>w.document.body.textContent.includes('Conserver et enregistrer'));
 click('Conserver et enregistrer');await wait(()=>saved.length===1);
 assert.ok(saved[0].data.truth);await wait(()=>w.selected);assert.equal(w.selected.id,saved[0].id,'saved NPC is attached to the current scene');
 click('Créer un PNJ');await wait(()=>w.document.body.textContent.includes('Ouvrir la fiche personnalisée'));click('Ouvrir la fiche personnalisée');await wait(()=>w.document.body.textContent.includes('Fiche personnalisée'));
 assert.equal(saved.length,1,'custom sheet is not saved before explicit submission');
 assert.ok(w.document.querySelector('input[value="Nouveau PNJ"]'));
}finally{w.test?.unmount();dom.window.close();}
console.log('CAMPAIGN NPC CREATION DOM OK — quick reject/save, scene selection only after save, separate Truth, custom unsaved sheet');
