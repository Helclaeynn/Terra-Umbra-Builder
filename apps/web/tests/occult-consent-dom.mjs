import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`import {createApp,h} from 'vue';import Consent from './src/components/CampaignOccultConsent.vue';const app=createApp({render:()=>h(Consent,{campaignId:'camp',onAttention:count=>window.attention=count})});app.mount('#app');window.stop=()=>app.unmount();`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'occult-consent-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window,d=w.document;
w.Headers=Headers;const polls=[],requests=[];let snapshot={offers:[]},lose=false,getFailure=false;w.setInterval=f=>{polls.push(f);return polls.length;};w.clearInterval=()=>{};
w.fetch=async(url,opts)=>{if(!opts?.body){if(getFailure)throw Error('private polling failed');return {ok:true,status:200,json:async()=>structuredClone(snapshot)};}const b=JSON.parse(opts.body);requests.push(b);if(lose){lose=false;throw Error('Lost response');}snapshot.offers=[];return {ok:true,status:200,json:async()=>({ok:true})};};
const wait=()=>new Promise(r=>setTimeout(r,5));async function until(check){for(let i=0;i<100;i++){if(check())return;await wait();}assert(check(),'Consent UI did not settle');}
const button=(text)=>{const el=[...d.querySelectorAll('button')].find(b=>b.textContent.includes(text));assert(el,text);return el;};
async function refresh(){for(const p of polls)await p();await wait();}
w.eval(bundle.outputFiles[0].text);await wait();assert.equal(d.querySelector('section'),null,'No empty player panel');
snapshot.offers=[{offerId:'offer-1',sourceEventId:'spell',actorId:'my-pc',version:4,characterName:'Alba',sourceName:'Mage',type:'consent',note:'Protection proposée'}];await refresh();assert.equal(w.attention,1);assert.match(d.body.textContent,/Protection proposée/);
lose=true;button('Accepter cet effet').click();await until(()=>d.querySelector('[role="alert"]'));assert.equal(requests[0].action,'consent');assert.equal(requests[0].actorId,'my-pc');assert.equal(requests[0].version,4);assert.equal(requests[0].offerId,'offer-1');const original=requests[0];button('Réessayer cet accord').click();await until(()=>requests.length===2);assert.deepEqual(requests[1],original,'Exact replay after lost response');await until(()=>w.attention===0);
snapshot.offers=[{sourceEventId:'attack',actorId:'my-pc',version:5,characterName:'Alba',sourceName:'Mage',type:'defense',defenseKind:'occult',pa:0,note:'Projectile magique'}];await refresh();assert(button('Défense active').disabled);assert(!button('Défense passive').disabled);
snapshot.offers[0].pa=2;await refresh();button('Défense active').click();await until(()=>requests.at(-1).action==='defend');assert.equal(requests.at(-1).active,true);assert.equal(requests.at(-1).defenseKind,'occult');assert.equal(requests.at(-1).contextConfirmed,true);
snapshot.offers=[{sourceEventId:'decree',actorId:'my-pc',version:6,characterName:'Alba',sourceName:'Décret royal',type:'decree',effectId:'condition',note:'Ne traverse pas la porte'}];await refresh();button('Tenter de violer').click();await until(()=>requests.at(-1).action==='resist-decree');assert.equal(requests.at(-1).effectId,'condition');assert.equal(requests.at(-1).violationConfirmed,true);
getFailure=true;await refresh();assert.match(d.body.textContent,/propositions privées ne sont pas à jour/);assert.deepEqual(errors,[]);w.stop();w.close();console.log('OCCULT CONSENT DOM OK — hidden empty panel, private offer, exact replay, active defense selection/PA gate and polling status');
