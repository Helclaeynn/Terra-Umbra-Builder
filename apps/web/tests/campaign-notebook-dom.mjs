import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`import {createApp,h} from 'vue';import Notebook from './src/components/CampaignNotebook.vue';const app=createApp({setup(){return ()=>h(Notebook,{campaignId:'campaign','onSaved':v=>window.saved.push(v),onClose:()=>window.closed=true,onSchedule:id=>window.scheduled=id});}});app.mount('#app');window.unmount=()=>app.unmount();`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onResolve({filter:/^vue-router$/},()=>({path:'router',namespace:'test'}));b.onLoad({filter:/.*/,namespace:'test'},()=>({contents:'export function onBeforeRouteLeave(fn){window.leaveGuard=fn;}'}));b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'notebook-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.map(String).join(' ')));vc.on('warn',(...a)=>errors.push(a.map(String).join(' ')));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only',virtualConsole:vc}),w=dom.window;
w.Headers=Headers;w.structuredClone=structuredClone;w.confirm=()=>true;w.saved=[];
const calls=[];let version=1,failCreate=true,conflict=false,release;
const scene={id:'old-scene',title:'La piste',notes:'Notes privées',done:false,references:[]};
w.fetch=async(url,opts={})=>{const payload=opts.body?JSON.parse(opts.body):undefined;calls.push({url,payload,method:opts.method});if(url.endsWith('/preparation-library'))return {ok:true,status:200,json:async()=>({references:[],previous:[{id:'previous',title:'Ancienne séance',scenes:[scene,{...scene,id:'played',done:true}],version:1}]})};if(opts.method==='POST'){if(failCreate){failCreate=false;throw Error('Lost response');}return {ok:true,status:201,json:async()=>({session:{id:'session',version}})};}if(opts.method==='PATCH'){if(conflict)return {ok:false,status:409,json:async()=>({error:'session_version_conflict'})};if(release===null)await new Promise(r=>release=r);version++;return {ok:true,status:200,json:async()=>({session:{id:'session',version}})};}throw Error(url);};
const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn){for(let i=0;i<300;i++){if(fn())return;await wait(10);}assert.ok(fn(),JSON.stringify({errors,calls,dom:w.document.body.textContent}));}
function button(label){const b=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===label);assert.ok(b,label);return b;}
function fill(el,value){el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));}
try{
 w.eval(bundle.outputFiles[0].text);await until(()=>w.document.querySelector('textarea'));
 fill(w.document.querySelector('input'),'Carnet test');fill(w.document.querySelector('textarea'),'Premières notes');
 await until(()=>w.document.querySelector('[role=alert]'));assert.match(w.document.querySelector('[role=alert]').textContent,/interrompu/);assert.equal(w.document.querySelector('textarea').value,'Premières notes');
 fill(w.document.querySelector('textarea'),'Notes après coupure');button('Réessayer l’enregistrement').click();
 await until(()=>w.saved.length===2);
 const creates=calls.filter(c=>c.method==='POST');assert.equal(creates.length,2);assert.deepEqual(creates[0].payload,creates[1].payload);assert.ok(creates[0].payload.requestId);assert.equal(w.saved.at(-1).preparation,'Notes après coupure');
 // A slow write must not overwrite typing that happened during its request.
 release=null;fill(w.document.querySelector('textarea'),'Envoi lent');await until(()=>typeof release==='function');fill(w.document.querySelector('textarea'),'Saisie pendant l’envoi');release();release=undefined;
 await until(()=>w.saved.at(-1)?.preparation==='Saisie pendant l’envoi');
 const select=w.document.querySelector('.reuse select');select.value='previous';select.dispatchEvent(new w.Event('change',{bubbles:true}));await wait(0);button('Copier les scènes non jouées').click();
 await until(()=>w.document.querySelectorAll('.scene').length===1);await until(()=>w.saved.at(-1)?.scenes.length===1);assert.notEqual(w.saved.at(-1).scenes[0].id,'old-scene');
 button('Passer en vue partie').click();await until(()=>!w.document.querySelector('textarea'));assert.match(w.document.body.textContent,/Saisie pendant l’envoi/);
 const played=w.document.querySelector('.scene input[type=checkbox]');played.checked=true;played.dispatchEvent(new w.Event('change',{bubbles:true}));await until(()=>w.saved.at(-1)?.scenes[0].done===true);
 button('Revenir à la préparation').click();await until(()=>w.document.querySelector('textarea'));conflict=true;fill(w.document.querySelector('textarea'),'Texte à conserver');await until(()=>w.document.querySelector('[role=alert]')?.textContent.includes('changé ailleurs'));assert.equal(w.document.querySelector('textarea').value,'Texte à conserver');
 const count=calls.length;await wait(1100);assert.equal(calls.length,count,'Conflict must stop automatic retries');assert.ok(calls.every(c=>!c.url.includes('calendar-invitations')));assert.deepEqual(errors,[]);
 console.log('NOTEBOOK DOM OK — autosave, idempotent lost-response retry, typing during save, unfinished scene reuse, play view, persisted progress, conflict retains draft and sends no mail');
}finally{w.unmount?.();dom.window.close();}
