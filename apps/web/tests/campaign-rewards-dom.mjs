import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`import {createApp,h} from 'vue';import Rewards from './src/components/CampaignRewards.vue';window.start=manage=>{const app=createApp({render:()=>h(Rewards,{campaignId:'11111111-1111-4111-8111-111111111111',canManage:manage})});app.mount('#app');window.stop=()=>app.unmount();};`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const{descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});assert.deepEqual(errors,[]);return {contents:compileScript(descriptor,{id:'reward-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/campaigns/test',runScripts:'outside-only',virtualConsole:vc});
const w=dom.window,d=w.document;w.Headers=Headers;w.structuredClone=structuredClone;
let confirm=true,loseResponse=false;w.confirm=()=>confirm;
const calls=[],batches=new Map();
const targets=[{id:'22222222-2222-4222-8222-222222222222',name:'Alex',version:1,xpEarned:0,ptvEarned:0,money:100,renown:1,corruption:0,integrity:4},{id:'33333333-3333-4333-8333-333333333333',name:'Camille',version:1,xpEarned:0,ptvEarned:0,money:100,renown:5,corruption:0,integrity:4}];
const history=[];
w.fetch=async(url,options={})=>{
 calls.push({url,options});const method=options.method||'GET';let body;
 if(url.endsWith('/reality'))body={equipment:[]};
 else if(url.endsWith('/effect-targets'))body={characters:structuredClone(targets),sources:[{id:'vhodhal',name:'Vhodhal'}]};
 else if(url.endsWith('/rewards')&&method==='GET')body={canManage:true,rewards:structuredClone(history)};
 else if(url.endsWith('/rewards')&&method==='POST'){
  const b=JSON.parse(options.body),existing=batches.get(b.requestId);
  if(existing){assert.deepEqual(b,existing,'Retry carries exactly the same payload');body={ok:true,alreadyApplied:true};}
  else{batches.set(b.requestId,b);for(const g of b.rewards){const target=targets.find(t=>t.id===g.characterId);assert.equal(g.version,target.version);target.version++;target.xpEarned+=g.xp;target.ptvEarned+=g.ptv;target.money+=g.money;target.renown+=g.renownDelta;history.unshift({...g,requestId:b.requestId,characterName:target.name,reason:b.reason,createdAt:'2026-09-28T20:00:00Z',revision:target.version});}body={ok:true,alreadyApplied:false};if(loseResponse){loseResponse=false;throw new Error('lost response after commit');}}
 }else throw new Error(method+' '+url);
 return {ok:true,status:200,json:async()=>body};
};
const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn){for(let n=0;n<150;n++){if(fn())return;await wait(5);}assert.ok(fn(),'Expected DOM state');}
const button=text=>[...d.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith(text));
function input(label,value){const el=[...d.querySelectorAll('label')].find(l=>l.firstChild.textContent.trim()===label)?.querySelector('input');assert.ok(el,label);el.value=String(value);el.dispatchEvent(new w.Event('input',{bubbles:true}));}
const posts=()=>calls.filter(c=>c.options.method==='POST');
w.eval(bundle.outputFiles[0].text);w.start(true);assert.equal(calls.length,0,'No hidden form request on mount');button('Attribuer une récompense').click();await until(()=>d.querySelectorAll('.recipient').length===2);
button('Tous les personnages').click();input('Edge',1);input('XP',3);input('Renommée',1);input('Motif','Initiative hors séance');await wait(10);assert.match(d.querySelector('.hint').textContent,/Camille.*5/);assert.equal(d.querySelector('button[type=submit]').disabled,true);
d.querySelectorAll('.recipient input')[1].click();await wait(10);assert.equal(d.querySelector('button[type=submit]').disabled,false);
confirm=false;d.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await wait(10);assert.equal(posts().length,0,'Cancelled confirmation has no effect');
confirm=true;d.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>history.length===1&&d.querySelector('.success')&&!d.querySelector('fieldset').disabled);
assert.equal(targets[0].xpEarned,3);assert.equal(targets[0].renown,2);assert.equal(targets[1].xpEarned,0);assert.match(d.querySelector('.success').textContent,/enregistrée/);assert.equal(calls.some(c=>c.url.includes('/sessions')),false,'No calendar session API used');
d.querySelector('.recipient input').click();input('XP',2);input('Motif','Deuxième bonus');await wait(10);loseResponse=true;d.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>d.querySelector('.error')&&!d.querySelector('fieldset').disabled);
const lostId=JSON.parse(posts().at(-1).options.body).requestId;assert.equal(targets[0].xpEarned,5);
d.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>d.querySelector('.success')?.textContent.includes('aucun doublon'));
assert.equal(JSON.parse(posts().at(-1).options.body).requestId,lostId);assert.equal(targets[0].xpEarned,5);assert.equal(history.length,2);
w.stop();await wait(10);const before=calls.length;w.start(false);assert.equal(d.querySelector('form'),null);button('Voir mes récompenses').click();await until(()=>d.querySelector('.reward-history'));
await wait(10);assert.equal(d.querySelector('form'),null,'Player cannot show GM grant inputs');assert.equal(calls.slice(before).some(c=>c.url.endsWith('/effect-targets')),false,'Player never requests private roster');
w.stop();w.close();assert.ok(posts().some(p=>JSON.parse(p.options.body).rewards.some(r=>r.edge===1)));assert.deepEqual(errors,[]);
console.log('CAMPAIGN REWARDS DOM OK — real GM form, no scheduled session, selection and renown cap, confirmation, idempotent lost-response retry and player read-only history');
