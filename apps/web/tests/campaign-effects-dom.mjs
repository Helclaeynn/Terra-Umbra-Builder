import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const campaignId='10000000-0000-4000-8000-000000000001',pcId='10000000-0000-4000-8000-000000000002',npcId='10000000-0000-4000-8000-000000000003';
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`import {createApp,h,ref} from 'vue';import Effects from './src/components/CampaignEffects.vue';const room=ref(window.initialRoom);window.setRoom=value=>room.value=value;const app=createApp({render:()=>h(Effects,{campaignId:'${campaignId}',room:room.value,onChanged:()=>window.onChanged?.()})});app.mount('#app');window.stop=()=>app.unmount();`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'effects-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const wait=()=>new Promise(resolve=>setTimeout(resolve,5));
async function eventually(check){for(let i=0;i<100;i++){if(check())return;await wait();}assert(check(),'UI did not settle');}
function fixture(manager=true){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
 const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window,d=w.document;w.Headers=Headers;
 const states=new Map([[pcId,{version:7,state:{effects:[],activation:0,activationOpen:false,effectArmor:2}}],[npcId,{version:4,state:{effects:[],activation:3,activationOpen:false,effectArmor:0}}]]),requests=[],gets=[],applied=new Set();let failAfterApply=false,conflict=false;
 const room=()=>({canManage:manager,characters:[{id:pcId,name:'Alba'}],combatants:[{id:npcId,name:'Dive',...states.get(npcId).state,version:states.get(npcId).version}],events:[],combat:{active:true,version:1}});
 w.initialRoom=room();w.onChanged=()=>w.setRoom(room());
 w.fetch=async(url,options={})=>{
  if(!options.body){gets.push(url);assert.equal(url,`/api/characters/${pcId}/play`);return {ok:true,status:200,json:async()=>structuredClone(states.get(pcId))};}
  const body=JSON.parse(options.body);requests.push(body);assert.equal(url,`/api/campaigns/${campaignId}/mechanics`);
  if(conflict){conflict=false;states.get(body.actorId).version++;return {ok:false,status:409,json:async()=>({error:'mechanics_version_conflict'})};}
  const saved=states.get(body.actorId);
  if(!applied.has(body.requestId)){
   assert.equal(body.version,saved.version,'optimistic version must be fetched from the selected actor');applied.add(body.requestId);saved.version++;
   if(body.action==='effect-add'&&body.effect){saved.state.effects.push({...body.effect,id:`effect-${saved.version}`,createdRound:1,createdActivation:saved.state.activation,startsAt:null,expires:{unit:body.effect.duration.unit,at:body.effect.duration.unit==='round'?1+body.effect.duration.value:body.effect.duration.unit==='activation'?saved.state.activation+body.effect.duration.value:null},nextTick:body.effect.period?1:null,remainingTicks:body.effect.ticks??null,lastRoundTick:null,lastActivationTick:null});}
   if(body.action==='effect-remove')saved.state.effects=saved.state.effects.filter(e=>e.id!==body.effectId);
   if(body.action==='effect-armor')saved.state.effectArmor=body.armor;
   if(body.action==='activation-start'){saved.state.activation++;saved.state.activationOpen=true;}
   if(body.action==='activation-end')saved.state.activationOpen=false;
  }
  if(failAfterApply){failAfterApply=false;throw new Error('network interruption after server commit');}
  return {ok:true,status:200,json:async()=>({ok:true,version:saved.version})};
 };
 w.eval(bundle.outputFiles[0].text);
 return {w,d,requests,gets,states,errors,room,failNext:()=>failAfterApply=true,conflictNext:()=>conflict=true,close(){assert.deepEqual(errors,[]);w.stop();w.close();}};
}
async function set(f,selector,value){const element=f.d.querySelector(selector);assert(element,selector);element.value=String(value);element.dispatchEvent(new f.w.Event(element.tagName==='SELECT'?'change':'input',{bubbles:true}));await wait();}
async function check(f,element){assert(element);element.checked=true;element.dispatchEvent(new f.w.Event('change',{bubbles:true}));await wait();}
async function submit(f,selector){f.d.querySelector(selector).dispatchEvent(new f.w.Event('submit',{bubbles:true,cancelable:true}));await wait();}
function button(f,label){const element=[...f.d.querySelectorAll('button')].find(b=>b.textContent.includes(label));assert(element,label);return element;}

const reader=fixture(false);await wait();assert.equal(reader.d.querySelector('.campaign-effects'),null);assert.equal(reader.gets.length,0,'a player must not load MJ effects');reader.close();
const f=fixture();await eventually(()=>f.d.querySelector('.custom-effect-form'));
assert.equal(f.d.querySelector('.campaign-effects').open,false,'MJ panel is initially collapsible');
assert.match(f.d.body.textContent,/elles ne dépensent pas de PA/);
await set(f,'[aria-label="Nom de l’effet"]','Vision brouillée');await set(f,'[aria-label="Application de l’effet"]','skill');await set(f,'[aria-label="Compétence de l’effet"]','tir');await set(f,'[aria-label="Valeur de l’effet"]',-3);
await submit(f,'.custom-effect-form');assert.equal(f.requests.length,0,'custom effect requires explicit ruling confirmation');
await check(f,f.d.querySelector('.custom-effect-form .check input'));
f.failNext();await submit(f,'.custom-effect-form');await eventually(()=>f.d.querySelector('[role="alert"]'));
assert.match(f.d.body.textContent,/Action non confirmée/);assert(f.d.querySelector('[aria-label="Cible de l’effet"]').disabled);
const initial=f.requests[0];assert.equal(initial.actorId,pcId);assert.equal(initial.version,7);assert.match(initial.requestId,/^[\da-f-]{36}$/);assert.equal(initial.action,'effect-add');assert.deepEqual(initial.effect,{name:'Vision brouillée',sourceId:pcId,targetId:pcId,kind:'modifier',scope:'skill',amount:-3,stackKey:'mj:vision brouillée',stackMode:'best',duration:{unit:'scene'},skill:'tir'});
button(f,'Réessayer cette action').click();await eventually(()=>f.d.querySelector('[aria-label="Retirer Vision brouillée"]'));
assert.deepEqual(f.requests[1],initial,'transport retry must reuse the UUID, version and exact payload');assert.equal(f.states.get(pcId).version,8,'retry must not duplicate a committed mutation');
f.d.querySelector('[aria-label="Retirer Vision brouillée"]').click();await eventually(()=>!f.d.querySelector('[aria-label="Retirer Vision brouillée"]'));
assert.equal(f.requests[2].action,'effect-remove');assert.equal(f.requests[2].effectId,'effect-8');assert.equal(f.requests[2].version,8);

await set(f,'[aria-label="Nom de l’effet"]','Plaie profonde');await set(f,'[aria-label="Nature de l’effet"]','damage');await set(f,'[aria-label="Valeur de l’effet"]',2);await set(f,'[aria-label="Durée de l’effet"]','round');await set(f,'[aria-label="Nombre pour la durée"]',3);await set(f,'[aria-label="Nombre d’applications"]',2);
await check(f,f.d.querySelector('.custom-effect-form .check:last-of-type input'));await submit(f,'.custom-effect-form');await eventually(()=>f.d.querySelector('[aria-label="Retirer Plaie profonde"]'));
const damage=f.requests.at(-1).effect;assert.equal(damage.kind,'damage');assert.equal(damage.scope,'condition');assert.equal(damage.amount,2);assert.equal(damage.period,'round-end');assert.equal(damage.delay,1);assert.equal(damage.ticks,2);assert.equal(damage.armorMode,'ignore');assert.equal(damage.damageType,'physique');assert.deepEqual(damage.duration,{unit:'round',value:3});assert.match(f.d.querySelector('.effect-list').textContent,/2 application\(s\) restante\(s\)/);
await set(f,'[aria-label="Armure des effets périodiques"]',4);await submit(f,'.armor-form');await eventually(()=>f.states.get(pcId).state.effectArmor===4);assert.equal(f.requests.at(-1).action,'effect-armor');assert.equal(f.requests.at(-1).armor,4);

assert(button(f,'Terminer l’activation').disabled);button(f,'Commencer l’activation').click();await eventually(()=>!button(f,'Terminer l’activation').disabled);assert.equal(f.requests.at(-1).action,'activation-start');assert(!('pa' in f.requests.at(-1)));assert.match(f.d.body.textContent,/Activation 1 · en cours/);
button(f,'Terminer l’activation').click();await eventually(()=>!button(f,'Commencer l’activation').disabled);assert.equal(f.requests.at(-1).action,'activation-end');

await set(f,'[aria-label="Effet canonique"]','maitre_des_lames');const presetForm=f.d.querySelector('.preset-effect-form');for(const input of presetForm.querySelectorAll('input[type="checkbox"]'))await check(f,input);await submit(f,'.preset-effect-form');await eventually(()=>f.requests.at(-1).preset==='maitre_des_lames');const canonical=f.requests.at(-1);assert.equal(canonical.sourceId,pcId);assert.deepEqual(canonical.proof,{hit:true,alteration:true,damage:1,margin:6,bleeds:true});assert(!('effect' in canonical),'canonical values are computed by the server');assert(!('cost' in canonical));

await set(f,'[aria-label="Cible de l’effet"]',npcId);await eventually(()=>f.d.body.textContent.includes('Activation 3 · terminée'));button(f,'Commencer l’activation').click();await eventually(()=>f.d.body.textContent.includes('Activation 4 · en cours'));assert.equal(f.requests.at(-1).actorId,npcId);assert.equal(f.requests.at(-1).version,4);assert.equal(f.gets.some(url=>url.includes(npcId)),false,'NPC effects use the protected room snapshot');
f.conflictNext();button(f,'Terminer l’activation').click();await eventually(()=>f.d.body.textContent.includes('L’état de ce personnage a changé'));assert.equal(f.d.querySelector('[aria-label="Cible de l’effet"]').disabled,false,'a definite conflict clears the uncertain request');assert.equal(f.states.get(npcId).state.activationOpen,true);
f.close();console.log('CAMPAIGN EFFECTS UI OK — MJ-only access, actor versions, custom and canonical effects, periodic damage, armor, explicit activation clocks, removal, exact retries and conflict refresh.');
