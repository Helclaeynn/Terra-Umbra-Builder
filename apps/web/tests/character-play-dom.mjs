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
 const data=reactive({attributes:{vigueur:4,agilite:3},skills:{athletisme:{style:6},constitution:{style:4}},creation:{},truth:{nature:'humain'},talents:{},reality:{augmentations:[{itemId:'augmentation-v9-main-gecko-g2'}]},progression:{}});window.data=data;window.ownerEdits=ref(true);window.sheet=reactive({name:'Nikos',realityTalents:[],truthTalents:[],inventory:[],disadvantages:[]});
 window.live=blankPlayState();window.profile=()=>playProfile(data,window.live);
 const app=createApp({render:()=>h(CharacterPlay,{id:'11111111-1111-4111-8111-111111111111',data,sheet:window.sheet,canEdit:window.ownerEdits.value})});
 app.mount('#app');window.stop=()=>app.unmount();
`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));return {contents:compileScript(descriptor,{id:'play-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window,d=w.document;w.Headers=Headers;
let edge=5,version=0,events=[],lastRequest,drop=false,managerRole=false;const requests=[];w.setInterval=fn=>{w.poll=fn;return 1;};w.clearInterval=()=>{};
w.fetch=async(url,options={})=>{
 const b=options.body?JSON.parse(options.body):null;let body;
 if(!b)body={edge,state:w.live,version,events,profile:{...w.profile(),reality:w.serverReality??null},canManageMechanics:managerRole};
 else{
  requests.push(b);
  if(lastRequest?.requestId===b.requestId){assert.deepEqual(b,lastRequest);body={ok:true,alreadyApplied:true};}
  else{lastRequest=b;assert.equal(b.version,version);version++;if(b.action==='save')w.live=b.state;
   const payload=b.action==='roll'?{label:'Athlétisme',modifier:w.profile().skills.find(s=>s.id==='athletisme').total,dice:[10,4],sum:14,total:w.profile().skills.find(s=>s.id==='athletisme').total+14,exploded:true,narrativeFailure:false}:{label:'Enregistré'};
   const event={id:b.requestId,kind:b.action,payload,createdAt:'2026-10-03T12:00:00Z'};events.unshift(event);body={state:w.live,version,profile:{...w.profile(),reality:w.serverReality??null},event};
   if(drop){drop=false;throw new Error('Response lost');}
  }
 }
 return {ok:true,status:200,json:async()=>JSON.parse(JSON.stringify(body))};
};
const wait=()=>new Promise(r=>setTimeout(r,5));async function until(fn){for(let i=0;i<160;i++){if(fn())return;await wait();}assert.ok(fn(),'Expected live view state');}
w.eval(bundle.outputFiles[0].text);await until(()=>d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]'));
assert.equal(d.querySelectorAll('.play-tabs>button').length,4,'Keep four primary destinations.');
assert.equal(d.querySelector('.play-more').open,false);
assert.equal(d.querySelectorAll('.revelation-control select').length,1,'Revelation is always reachable, without duplicate controls.');
assert.ok(d.querySelector('.play-dock .health-shortcut'));
assert.equal([...d.querySelectorAll('.skill-group')].filter(group=>group.open).length,1,'Only the first skill group is open initially.');
assert.equal(d.querySelector('.roll-help').open,false,'Long rules are optional.');
const athletics=()=>[...d.querySelectorAll('.skill-roll')].find(e=>e.querySelector('strong').textContent==='Athlétisme');
assert.match(athletics().textContent,/4 \+ 6 = 10/);
assert.equal(athletics().querySelector('.skill-modifiers').open,false);athletics().querySelector('.skill-modifiers summary').click();await wait();
const spinal=[...athletics().querySelectorAll('label')].find(e=>e.textContent.includes('Main Gecko'));assert.ok(spinal);spinal.querySelector('input').click();await wait();assert.match(athletics().textContent,/4 \+ 6\s*\+ 2 = 12/);
d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').click();await until(()=>d.querySelectorAll('.die').length===2);assert.deepEqual(requests.map(r=>r.action),['save','roll']);assert.match(d.querySelector('.roll-result').textContent,/12 \+ 10 \+ 4 = 26/);assert.match(d.querySelector('.play-dock .roll-result summary').textContent,/Athlétisme · 26/);assert.equal(d.querySelector('.roll-result details').open,false);
// A lost response can be safely retried from the same button.
drop=true;d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').click();await until(()=>d.querySelector('[role=alert]'));const lost=requests.at(-1).requestId;d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').click();await until(()=>!d.querySelector('[role=alert]'));assert.equal(requests.at(-1).requestId,lost);
w.data.truth={nature:'garou',consciousness:'initie',choices:{},truthTalents:[]};await wait();
const navigate=(name)=>[...d.querySelectorAll('.play-tabs button')].find(b=>b.textContent===name).click();navigate('Pouvoirs');await wait();
assert.ok(d.querySelector('[aria-label="Forme souhaitée"]'));const transform=[...d.querySelectorAll('button')].find(b=>b.textContent==='Changer de forme');transform.click();await until(()=>requests.at(-1).action==='form');assert.equal(requests.at(-1).form,'hybrid');
w.data.truth={nature:'vampire',consciousness:'initie',choices:{},truthTalents:['faveur_de_la_nuit']};await wait();const power=d.querySelector('[aria-label="Capacité de Vérité"]');power.value='faveur_de_la_nuit';power.dispatchEvent(new w.Event('change',{bubbles:true}));await wait();assert.match(d.body.textContent,/Furtivité dans les ombres/);assert.ok([...d.querySelectorAll('button')].find(b=>b.textContent==='Activer la capacité').disabled);
const jetsTab=[...d.querySelectorAll('.play-tabs button')].find(b=>b.textContent==='Jets');jetsTab.click();await wait();
const search=d.querySelector('.skill-tools input[type=search]');search.value='athletisme';search.dispatchEvent(new w.Event('input',{bubbles:true}));await wait();assert.equal(d.querySelectorAll('.skill-roll').length,1);assert.ok(d.querySelector('.skill-group').open,'Searching reveals the matching skill.');
const edgeToggle=d.querySelector('.skill-tools input[type=checkbox]');assert.equal(edgeToggle.disabled,false);edgeToggle.click();await wait();d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').click();await until(()=>requests.at(-1).edge===true);await until(()=>!d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').disabled);
const statesTab=[...d.querySelectorAll('.play-tabs button')].find(b=>b.textContent==='États & PV');statesTab.click();await wait();assert.equal(statesTab.getAttribute('aria-pressed'),'true');assert.equal(d.querySelector('.skill-tools').style.display,'none');
// The campaign MJ can invoke dedicated resource commands, while regular player editing stays disabled.
navigate('Pouvoirs');await wait();managerRole=true;w.ownerEdits.value=false;w.live.revelation='r';w.data.truth={nature:'daemon',consciousness:'initie',choices:{divinity:'lilith',function:'oracle'},truthTalents:[]};await w.poll();await until(()=>d.querySelector('.manager-resource-settings'));
assert.ok(d.querySelector('.manager-play-notice'));assert.ok(d.querySelector('[aria-label="Lancer le d10 pour Athlétisme"]').disabled);const managerCheck=d.querySelector('.manager-resource-settings input[type=checkbox]');managerCheck.click();await until(()=>requests.at(-1).action==='nature-settings');assert.equal(requests.at(-1).resonancePlace,true);await until(()=>!d.querySelector('.manager-resource-settings').disabled);
managerRole=false;await w.poll();await until(()=>!d.querySelector('.manager-resource-settings'));assert.ok([...d.querySelectorAll('.live-mechanics button')].every(b=>b.matches(':disabled')));
// Dedicated Neuro reboot commands retain the same idempotency identity after a lost response.
navigate('Équipement');await wait();w.ownerEdits.value=true;w.data.truth={nature:'humain'};w.live.initiative=null;w.live.neuroBurned=['sacrificed-copy'];w.serverReality={neuro:{owned:[],loaded:[],capacity:2,availableCapacity:1}};await w.poll();await until(()=>d.querySelector('.neuro-reboot'));const reboot=d.querySelector('.neuro-reboot');reboot.querySelector('input[type=checkbox]').click();await wait();const rebootButton=[...reboot.querySelectorAll('button')].find(b=>b.textContent.includes('Redémarrer le Neuro'));drop=true;rebootButton.click();await until(()=>d.querySelector('[role=alert]'));const failedReboot=requests.at(-1);assert.equal(failedReboot.action,'reality-neuro-reboot');assert.equal(failedReboot.safeRestart,true);rebootButton.click();await until(()=>!d.querySelector('[role=alert]'));assert.equal(requests.at(-1).requestId,failedReboot.requestId);assert.deepEqual(requests.at(-1),failedReboot);
// Optional destinations close the menu, but retain the essential controls and last result.
navigate('Jets');await wait();d.querySelector('.play-more summary').click();await wait();assert.ok(d.querySelector('.play-more').open);navigate('Historique');await wait();assert.equal(d.querySelector('.play-more').open,false);assert.match(d.querySelector('.play-more summary').textContent,/Historique/);assert.ok(d.querySelector('.play-dock .revelation-control select'));assert.ok(d.querySelector('.play-dock .roll-result'));
// Inventory names stay compact; filtering matches accented names and groups without listing unrelated text.
w.sheet.inventory=[{id:'coat',name:'Manteau renforcé',group:'Vêtements',detail:'Protection du manteau.'},{id:'apartment',name:'Appartement',group:'Logement',detail:'Appartement loué à Nextar.'}];navigate('Équipement');await wait();const objects=[...d.querySelectorAll('.rule-card')];assert.equal(objects.length,2);assert.ok(objects.every(item=>!item.open));const equipmentSearch=d.querySelector('.equipment-search input');equipmentSearch.value='vetements';equipmentSearch.dispatchEvent(new w.Event('input',{bubbles:true}));await wait();assert.equal(d.querySelectorAll('.rule-card').length,1);assert.match(d.querySelector('.rule-card summary').textContent,/Manteau/);d.querySelector('.rule-card summary').click();assert.equal(d.querySelector('.rule-card').open,true);
// Important preparation remains visible while the player rolls; its shortcut opens the right commands.
w.data.truth={nature:'mage',consciousness:'initie',choices:{mageiusType:'discella',dominantAffinity:'skiamancie'},truthTalents:[]};w.live.natureResources={mage:{tension:3,preparation:{affinity:'skiamancie',name:'Distraction',note:'',paid:1,pa:2,difficulty:15,tension:1}}};await w.poll();navigate('Jets');await wait();const prepShortcut=[...d.querySelectorAll('.resource-links button')].find(b=>b.textContent.includes('Sort en préparation'));assert.ok(prepShortcut);assert.match(d.querySelector('.resource-links').textContent,/Tension 3/);prepShortcut.click();await wait();assert.equal([...d.querySelectorAll('.play-tabs>button')].find(b=>b.textContent==='Pouvoirs').getAttribute('aria-pressed'),'true');assert.ok(d.querySelector('.mage-resource'));assert.equal(d.querySelector('.neuro-reboot'),null,'Equipment controls are not duplicated under Powers.');
assert.deepEqual(errors,[]);w.stop();w.close();console.log('PLAY DOM OK — compact primary navigation, searchable disclosed skills/equipment, always reachable state/result, active preparation shortcut, role permissions, automatic save and retry identity.');
