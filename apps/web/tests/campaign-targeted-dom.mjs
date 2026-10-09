import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`import {createApp,h} from 'vue';import Targeted from './src/components/CampaignTargetedPowers.vue';import Combat from './src/components/CampaignCombat.vue';const app=createApp({render:()=>h('div',[h(Targeted,{campaignId:'camp',room:window.room}),h(Combat,{campaignId:'camp',room:window.room})])});app.mount('#app');window.stop=()=>app.unmount();`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'targeted-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window,d=w.document;
w.Headers=Headers;w.room={canManage:true,characters:[{id:'caster',name:'Caster'},{id:'target',name:'Ally'}],combatants:[],events:[],combat:{active:false}};
const polls=[];w.setInterval=f=>{polls.push(f);return polls.length;};w.clearInterval=()=>{};
const support={sources:[{id:'caster',name:'Caster',version:7,edge:3,powers:[{id:'exile-refection-vitale',name:'Réfection vitale',cost:1,context:'Au contact ; difficulté 18'},{id:'exile-rune-de-garde',name:'Rune de Garde',cost:0,context:'Dix minutes'}]}],targets:[{id:'caster',name:'Caster',version:7},{id:'target',name:'Ally',version:4}],offers:[{id:'offer',sourceName:'Other',targetName:'Caster',powerName:'Suture',canAccept:true,canCancel:true}],results:[]};
const combat={attackers:[],pending:[],reactable:[{id:'attack',targetId:'target',targetName:'Ally',attacker:'Enemy',options:[{id:'trait:gardien-de-la-meute',name:'Gardien de la Meute',kind:'redirect',actorId:'caster',actorName:'Caster',version:7,range:'movement',movement:9}]}],counterAttacks:[{attackId:'ashorn',actorId:'caster',actorName:'Caster',targetId:'enemy',targetName:'Enemy',options:[{id:'unarmed',label:'Mains nues',damage:1}]}]};
const gets=[],requests=[],committed=new Set();let loseResponse=false;
w.fetch=async(url,options={})=>{
 if(!options.body){gets.push(url);return {ok:true,status:200,json:async()=>structuredClone(url.endsWith('/combat')?combat:support)};}
 const body=JSON.parse(options.body);requests.push({url,body});if(!committed.has(body.requestId)){committed.add(body.requestId);if(body.action==='request')support.sources[0].version++;}
 if(loseResponse){loseResponse=false;throw new Error('Lost acknowledgement after commit');}
 return {ok:true,status:200,json:async()=>({ok:true,pendingAcceptance:body.action==='request',...(body.action==='react'?{result:{label:'Interposition'}}:{})})};
};
const wait=()=>new Promise(r=>setTimeout(r,5));
async function until(check){for(let i=0;i<120;i++){if(check())return;await wait();}assert(check(),'UI did not settle');}
async function set(selector,value){const el=d.querySelector(selector);assert(el,selector);el.value=String(value);el.dispatchEvent(new w.Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));await wait();}
const button=(label,parent=d)=>{const b=[...parent.querySelectorAll('button')].find(b=>b.textContent.includes(label));assert(b,label);return b;};
async function check(el){assert(el);el.checked=true;el.dispatchEvent(new w.Event('change',{bubbles:true}));await wait();}
async function refresh(){for(const p of polls)await p();await wait();}
w.eval(bundle.outputFiles[0].text);await until(()=>d.querySelector('.reaction-card'));
assert.equal(gets.some(u=>u.endsWith('/targeted-powers')),false,'closed support panel should not fetch');
const panel=d.querySelector('.targeted-powers');panel.open=true;panel.dispatchEvent(new w.Event('toggle'));await until(()=>d.querySelector('[aria-label="Pouvoir ciblé"]'));
await set('[aria-label="Pouvoir ciblé"]','exile-refection-vitale');await set('[aria-label="Bénéficiaire du pouvoir"]','target');assert(button('Appliquer le pouvoir ciblé').disabled);
await check(d.querySelector('.targeted-form .check input'));await check([...d.querySelectorAll('.targeted-form .check input')][1]);assert.equal(button('Appliquer le pouvoir ciblé').disabled,false);
loseResponse=true;d.querySelector('.targeted-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await until(()=>d.querySelector('.targeted-powers [role="alert"]'));assert(d.querySelector('.targeted-form fieldset').disabled);
const first=requests.at(-1).body;assert.equal(first.sourceVersion,7);assert.equal(first.targetVersion,4);assert.equal(first.edge,true);assert.equal(first.contextConfirmed,true);
button('Réessayer cet envoi').click();await until(()=>requests.filter(r=>r.body.action==='request').length===2);await until(()=>!d.querySelector('.targeted-form fieldset').disabled);assert.deepEqual(requests.filter(r=>r.body.action==='request')[1].body,first,'retry reuses exact UUID and versions');assert.equal(support.sources[0].version,8);
await set('[aria-label="Pouvoir ciblé"]','exile-rune-de-garde');assert.equal(d.querySelector('.targeted-form .check input').checked,false,'changing the rule clears old confirmations');await check(d.querySelector('.targeted-form .check input'));assert(button('Appliquer le pouvoir ciblé').disabled);await check([...d.querySelectorAll('.targeted-form .check input')][1]);assert.equal(button('Appliquer le pouvoir ciblé').disabled,false);
button('Accepter ce pouvoir').click();await until(()=>requests.at(-1).body.action==='accept');assert.equal(requests.at(-1).body.offerId,'offer');assert.equal('sourceId' in requests.at(-1).body,false);
await set('[aria-label="Interposition pour Ally"]','caster|trait:gardien-de-la-meute');let reaction=d.querySelector('.reaction-card');await set('.reaction-card input[type="number"]',9);for(const input of reaction.querySelectorAll('input[type="checkbox"]'))await check(input);assert(button('Intervenir',reaction).disabled,'strictly less than one movement');await set('.reaction-card input[type="number"]',8);assert(button('Intervenir',reaction).disabled,'changed distance clears trajectory confirmation');await check([...reaction.querySelectorAll('input[type="checkbox"]')].at(-1));button('Intervenir',reaction).click();await until(()=>requests.at(-1).body.action==='react');assert.equal(requests.at(-1).body.actorVersion,7);assert.equal(requests.at(-1).body.expectedTargetId,'target');assert.equal(requests.at(-1).body.distance,8);assert.equal(requests.at(-1).body.allyConfirmed,true);
await set('[aria-label="Arme de riposte"]','unarmed');const counter=[...d.querySelectorAll('.reaction-card')].find(c=>c.textContent.includes('Riposte d’Ashorn'));assert(button('Lancer la riposte',counter).disabled);await check(counter.querySelector('input[type="checkbox"]'));button('Lancer la riposte',counter).click();await until(()=>requests.at(-1).body.riposteAttackId==='ashorn');assert.equal(requests.at(-1).body.inReach,true);assert.equal(requests.at(-1).body.targetId,'enemy');assert.equal(requests.at(-1).body.optionId,'unarmed');
combat.pending=[{id:'guard-hit',attacker:'Mage',total:20,damage:8,bonusDamage:0,penetration:0,damageType:'occulte',attackMode:'fixed',target:{id:'target',name:'Ally',guard:true,armor:0,bodyArmor:0,reductions:{},protections:[],pa:2},defense:{label:'Défense passive',modifier:10,total:10,active:false}}];await refresh();await until(()=>d.querySelector('.damage-preview'));assert.match(d.querySelector('.damage-preview').textContent,/2 dégâts/);
combat.pending[0].damageType='melee';await refresh();await wait();assert.match(d.querySelector('.damage-preview').textContent,/8 dégâts/);await check(d.querySelector('.pending-attack fieldset input[type="checkbox"]'));assert.match(d.querySelector('.damage-preview').textContent,/2 dégâts/);
assert.deepEqual(errors,[]);w.stop();w.close();console.log('CAMPAIGN TARGETED DOM OK — lazy support, consent, Edge, exact transport retry, confirmation reset, strict interposition reach, Ashorn zero-cost request and rune preview');
