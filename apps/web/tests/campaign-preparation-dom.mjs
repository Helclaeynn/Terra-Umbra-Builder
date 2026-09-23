import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
 import {createApp,h,ref} from 'vue';import Preparation from './src/components/CampaignPreparation.vue';
 const scenes=ref([]),readonly=ref(false);window.snapshot=()=>JSON.parse(JSON.stringify(scenes.value));window.saved=()=>{scenes.value=JSON.parse(JSON.stringify(scenes.value));readonly.value=true;};
 const app=createApp({setup(){return ()=>h(Preparation,{modelValue:scenes.value,readonly:readonly.value,'onUpdate:modelValue':value=>scenes.value=value});}});app.mount('#app');window.unmount=()=>app.unmount();
`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'preparation-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.map(String).join(' ')));vc.on('warn',(...a)=>errors.push(a.map(String).join(' ')));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only',virtualConsole:vc});const w=dom.window;
w.Headers=Headers;w.structuredClone=structuredClone;w.confirm=()=>true;
w.fetch=async(url)=>({ok:true,status:200,json:async()=>url.includes('/library')?{favoriteItems:[],recentItems:[]}:{items:[{id:'pnj-cole',title:'Cole Gallagher',category:'Personnages',snippet:'PNJ'},{id:'bestiaire-loup',title:'Loup sombre',category:'Bestiaire',snippet:'Créature'}],total:2}});
const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn){for(let i=0;i<100;i++){if(fn())return;await wait(10);}assert.ok(fn(),JSON.stringify({errors,scenes:w.snapshot(),dom:w.document.body.textContent}));}
function button(label){const b=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===label||b.getAttribute('aria-label')===label);assert.ok(b,label);return b;}
try{
 w.eval(bundle.outputFiles[0].text);button('Préparer : Rencontre').click();await until(()=>w.document.querySelector('.scene'));
 button('Ajouter une référence').click();await until(()=>[...w.document.querySelectorAll('button')].some(b=>b.getAttribute('aria-label')==='Ajouter Cole Gallagher'));
 button('Ajouter Cole Gallagher').click();await until(()=>w.document.querySelectorAll('.reference').length===1);
 button('Ajouter Loup sombre').click();await until(()=>w.document.querySelectorAll('.reference').length===2);
 assert.equal(JSON.stringify(w.snapshot()[0].references.map(r=>r.articleId)),JSON.stringify(['pnj-cole','bestiaire-loup']));
 assert.match(w.document.querySelector('.selected-references').textContent,/Cole Gallagher/);assert.match(w.document.querySelector('.selected-references').textContent,/Loup sombre/);
 assert.match(w.document.querySelector('[role=status]').textContent,/Loup sombre ajouté/);
 button('Dupliquer la scène').click();await until(()=>w.snapshot().length===2);
 assert.notEqual(w.snapshot()[0].id,w.snapshot()[1].id);assert.equal(w.snapshot()[1].references.length,2);
 w.saved();await until(()=>!w.document.querySelector('.picker'));
 assert.equal(w.document.querySelectorAll('.reference').length,4);assert.ok([...w.document.querySelectorAll('.scene')].every(d=>d.open));
 assert.ok([...w.document.querySelectorAll('.scene-roster')].every(s=>s.textContent.includes('Cole Gallagher')&&s.textContent.includes('Loup sombre')));
 assert.deepEqual(errors,[]);console.log('SCENE REFERENCES DOM OK — PNJ and creature appear immediately, named confirmation, immutable second addition, duplicate and saved read-only scenes keep visible references');
}finally{w.unmount?.();dom.window.close();}
