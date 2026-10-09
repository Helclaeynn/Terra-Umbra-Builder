import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
 import {createApp,h,reactive,ref} from 'vue';
 import CharacterPlay from './src/components/CharacterPlay.vue';
 import {blankPlayState,playProfile} from '../api/src/rules/play-state';
 const data=reactive({attributes:{vigueur:4,agilite:3},skills:{athletisme:{style:6},constitution:{style:4}},creation:{},truth:{nature:'humain'},talents:{},reality:{augmentations:[{itemId:'augmentation-v9-main-gecko-g2'}]},progression:{}});window.data=data;window.ownerEdits=ref(true);
 window.live=blankPlayState();window.profile=()=>playProfile(data,window.live);
 const app=createApp({render:()=>h(CharacterPlay,{id:'11111111-1111-4111-8111-111111111111',data,sheet:{name:'Nikos',realityTalents:[],truthTalents:[],inventory:[]},canEdit:window.ownerEdits.value})});
 app.mount('#app');window.stop=()=>app.unmount();
`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'play-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window,d=w.document;w.Headers=Headers;
let edge=5,version=0,events=[],lastRequest,drop=false,managerRole=false;const requests=[];w.setInterval=fn=>{w.poll=fn;return 1;};w.clearInterval=()=>{};
w.fetch=async(url,options={})=>{
 const b=options.body?JSON.parse(options.body):null;let body;
 if(!b)body={edge,state:w.live,version,events,profile:w.profile(),canManageMechanics:managerRole};
 else{
  requests.push(b);
  if(lastRequest?.requestId===b.requestId){assert.deepEqual(b,lastRequest);body={ok:true,alreadyApplied:true};}
  else{lastRequest=b;assert.equal(b.version,version);version++;if(b.action==='save')w.live=b.state;
   const payload=b.action==='roll'?{label:'Athlétisme',modifier:w.profile().skills.find(s=>s.id==='athletisme').total,dice:[10,4],sum:14,total:w.profile().skills.find(s=>s.id==='athletisme').total+14,exploded:true,narrativeFailure:false}:{label:'Enregistré'};
   const event={id:b.requestId,kind:b.action,payload,createdAt:'2026-10-03T12:00:00Z'};events.unshift(event);body={state:w.live,version,profile:w.profile(),event};
   if(drop){drop=false;throw new Error('Response lost');}
  }
 }
 return {ok:true,status:200,json:async()=>JSON.parse(JSON.stringify(body))};
};
const wait=()=>new Promise(r=>setTimeout(r,5));async function until(fn){for(let i=0;i<160;i++){if(fn())return;await wait();}assert.ok(fn(),'Expected live view state');}
w.eval(bundle.outputFiles[0].text);await until(()=>d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]'));
const athletics=()=>[...d.querySelectorAll('.skill-roll')].find(e=>e.querySelector('strong').textContent==='Athlétisme');
assert.match(athletics().textContent,/4 \+ 6 = 10/);
const spinal=[...athletics().querySelectorAll('label')].find(e=>e.textContent.includes('Main Gecko'));assert.ok(spinal);spinal.querySelector('input').click();await wait();assert.match(athletics().textContent,/4 \+ 6\s*\+ 2 = 12/);
d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').click();await until(()=>d.querySelectorAll('.die').length===2);assert.deepEqual(requests.map(r=>r.action),['save','roll']);assert.match(d.querySelector('.roll-result').textContent,/12 \+ 10 \+ 4 = 26/);
// A lost response can be safely retried from the same button.
drop=true;d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').click();await until(()=>d.querySelector('[role=alert]'));const lost=requests.at(-1).requestId;d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').click();await until(()=>!d.querySelector('[role=alert]'));assert.equal(requests.at(-1).requestId,lost);
w.data.truth={nature:'garou',consciousness:'initie',choices:{},truthTalents:[]};await wait();
assert.ok(d.querySelector('[aria-label="Forme souhaitée"]'));const transform=[...d.querySelectorAll('button')].find(b=>b.textContent==='Changer de forme');transform.click();await until(()=>requests.at(-1).action==='form');assert.equal(requests.at(-1).form,'hybrid');
w.data.truth={nature:'vampire',consciousness:'initie',choices:{},truthTalents:['faveur_de_la_nuit']};await wait();const power=d.querySelector('[aria-label="Capacité de Vérité"]');power.value='faveur_de_la_nuit';power.dispatchEvent(new w.Event('change',{bubbles:true}));await wait();assert.match(d.body.textContent,/Furtivité dans les ombres/);assert.ok([...d.querySelectorAll('button')].find(b=>b.textContent==='Activer la capacité').disabled);
const jetsTab=[...d.querySelectorAll('.play-tabs button')].find(b=>b.textContent==='Jets & compétences');jetsTab.click();await wait();
const search=d.querySelector('.skill-tools input[type=search]');search.value='athletisme';search.dispatchEvent(new w.Event('input',{bubbles:true}));await wait();assert.equal(d.querySelectorAll('.skill-roll').length,1);
const edgeToggle=d.querySelector('.skill-tools input[type=checkbox]');assert.equal(edgeToggle.disabled,false);edgeToggle.click();await wait();d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').click();await until(()=>requests.at(-1).edge===true);await until(()=>!d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').disabled);
const statesTab=[...d.querySelectorAll('.play-tabs button')].find(b=>b.textContent==='États & PV');statesTab.click();await wait();assert.equal(statesTab.getAttribute('aria-pressed'),'true');assert.equal(d.querySelector('.skill-tools').style.display,'none');
// The campaign MJ can invoke dedicated resource commands, while regular player editing stays disabled.
managerRole=true;w.ownerEdits.value=false;w.live.revelation='r';w.data.truth={nature:'daemon',consciousness:'initie',choices:{divinity:'lilith',function:'oracle'},truthTalents:[]};await w.poll();await until(()=>d.querySelector('.manager-resource-settings'));
assert.ok(d.querySelector('.manager-play-notice'));assert.ok(d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').disabled);const managerCheck=d.querySelector('.manager-resource-settings input[type=checkbox]');managerCheck.click();await until(()=>requests.at(-1).action==='nature-settings');assert.equal(requests.at(-1).resonancePlace,true);await until(()=>!d.querySelector('.manager-resource-settings').disabled);
managerRole=false;await w.poll();await until(()=>!d.querySelector('.manager-resource-settings'));assert.ok([...d.querySelectorAll('.live-mechanics button')].every(b=>b.matches(':disabled')));
assert.deepEqual(errors,[]);w.stop();w.close();console.log('PLAY DOM OK — precalculated totals, prepared augmentation toggle, automatic save before roll, explosion rendering, retry identity and no Vue errors.');
