import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`import {createApp,h} from 'vue';import Page from './src/pages/CampaignsPage.vue';const app=createApp({setup(){return ()=>h(Page);}});app.mount('#app');window.unmount=()=>app.unmount();`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onResolve({filter:/^vue-router$/},()=>({path:'router',namespace:'test'}));b.onLoad({filter:/.*/,namespace:'test'},()=>({contents:`export const RouterLink={props:['to'],template:'<a><slot /></a>'};export function useRoute(){return {params:{id:'campaign'}};}export function useRouter(){return {push:async url=>window.navigation.push(url)};}export function onBeforeRouteLeave(){}` }));b.onLoad({filter:/\.vue$/},async({path:filename})=>{if(!/\/(CampaignsPage|CampaignSessions)\.vue$/.test(filename))return {contents:'export default {render(){return null;}}',loader:'ts'};const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'campaign-final',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.map(String).join(' ')));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only',virtualConsole:vc}),w=dom.window;
w.Headers=Headers;w.navigation=[];let confirmed=false,deleteCalls=0;
w.confirm=()=>confirmed;
const campaign={id:'campaign',name:'Dernière recette',description:'',ownerId:'owner',gmName:'MJ',canManage:true,archivedAt:null,version:4};
let session={id:'session',title:'Ma séance',playedOn:'2026-09-30',startsAt:null,endsAt:null,status:'planned',preparation:'',report:'',published:false,rewards:[],version:1};
const saved=[];
w.fetch=async(url,opts={})=>{let body;
 if(url==='/api/campaigns/campaign'&&opts.method==='DELETE'){deleteCalls++;assert.equal(JSON.parse(opts.body).version,4);body={ok:true};}
 else if(url==='/api/campaigns/campaign')body={campaign,members:[],userId:'owner'};
 else if(url==='/api/campaigns/campaign/sessions/session'&&opts.method==='PATCH'){const row=JSON.parse(opts.body);saved.push(row);session={...session,...row,version:session.version+1};body={session};}
 else if(url.startsWith('/api/campaigns/campaign/sessions?'))body={sessions:[session],hasMore:false,calendarMailAvailable:false};
 else throw Error('Unexpected API '+url);
 return {ok:true,status:200,json:async()=>body};
};
const wait=()=>new Promise(resolve=>setTimeout(resolve,5));
async function until(fn){for(let i=0;i<100;i++){if(fn())return;await wait();}throw Error('Timed out waiting for DOM');}
const button=text=>[...w.document.querySelectorAll('button')].find(el=>el.textContent.trim()===text);
const input=label=>[...w.document.querySelectorAll('label')].find(el=>el.firstChild?.textContent.trim()===label)?.querySelector('input');
async function fill(label,value){const el=input(label);assert.ok(el,label);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));await wait();}
try{
 w.eval(bundle.outputFiles[0].text);await until(()=>button('Date, invitations et compte rendu'));button('Date, invitations et compte rendu').click();await until(()=>input('Date prévue ou jouée'));
 assert.equal(input('Date prévue ou jouée').value,'2026-09-30');assert.equal(input('Début de la séance').value,'','Opening an all-day session must preserve its empty hours');
 await fill('Date prévue ou jouée','2026-10-01');assert.equal(input('Début de la séance').value,'2026-10-01T20:00');assert.equal(input('Fin de la séance').value,'2026-10-01T23:00');assert.equal(input('Date prévue ou jouée').disabled,false);
 await fill('Fin de la séance','2026-10-02T01:30');await fill('Date prévue ou jouée','2026-10-24');assert.equal(input('Début de la séance').value,'2026-10-24T20:00');assert.equal(input('Fin de la séance').value,'2026-10-25T01:30');
 await fill('Début de la séance','2026-10-31T21:15');assert.equal(input('Date prévue ou jouée').value,'2026-10-31');assert.equal(input('Fin de la séance').value,'2026-11-01T01:30');
 w.document.querySelector('form.editor').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>saved.length===1&&!w.document.querySelector('form.editor'));assert.equal(saved[0].playedOn,'2026-10-31');assert.equal(saved[0].startsAt,new Date('2026-10-31T21:15').toISOString());assert.equal(saved[0].endsAt,new Date('2026-11-01T01:30').toISOString());
 await until(()=>button('Date, invitations et compte rendu'));button('Date, invitations et compte rendu').click();await until(()=>button('Sans horaire · journée entière'));button('Sans horaire · journée entière').click();await wait();assert.equal(input('Date prévue ou jouée').value,'2026-10-31');assert.equal(input('Début de la séance').value,'');assert.equal(input('Fin de la séance').value,'');
 w.document.querySelector('form.editor').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>saved.length===2&&!w.document.querySelector('form.editor'));assert.equal(saved[1].playedOn,'2026-10-31');assert.equal(saved[1].startsAt,null);assert.equal(saved[1].endsAt,null);
 button('Supprimer la campagne').click();await wait();assert.equal(deleteCalls,0);assert.equal(w.navigation.length,0);
 confirmed=true;button('Supprimer la campagne').click();await until(()=>w.navigation.length);assert.equal(deleteCalls,1);assert.equal(w.navigation[0],'/campaigns');assert.deepEqual(errors,[]);
 console.log('CAMPAIGN FINAL RECETTE DOM OK — editable planned date, preserved hours and overnight end, start-date synchronization, all-day sessions, cancel/confirm deletion and return to campaign list');
}finally{w.unmount?.();w.close();}
