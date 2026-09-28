import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript,compileTemplate} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const fixtureSource=await readFile(new URL('./builder-v2-smoke.mjs',import.meta.url),'utf8');
const fixtures=Function(fixtureSource.slice(fixtureSource.indexOf('const skillIds='),fixtureSource.indexOf('const browser='))+';return {characterData,rules,lore,edgeRules,truthRules,realityRules};')();
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`import './src/main';import * as draft from './src/lib/builder-draft';window.draftHelpers=draft;`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false','import.meta.env':'{}'},plugins:[{name:'test-app',setup(b){
 b.onLoad({filter:/\/src\/main\.ts$/},async({path:filename})=>({contents:(await readFile(filename,'utf8'))+'\nwindow.testRouter=router;',loader:'ts',resolveDir:path.dirname(filename)}));
 b.onLoad({filter:/\.css$/},()=>({contents:'',loader:'js'}));
 b.onLoad({filter:/(CompendiumPage|CompendiumEditorPage|AdminQualityPage|CompendiumArbitragePage|CharactersPanel|AccountLastReading|SharedCharacterSheets|AccountCampaigns)\.vue$/},()=>({contents:'export default {template:"<section>Isolated unrelated panel</section>"}',loader:'js'}));
 b.onLoad({filter:/\.vue$/},async({path:filename})=>{const{descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});assert.deepEqual(errors,[]);if(!descriptor.script&&!descriptor.scriptSetup){const c=compileTemplate({source:descriptor.template.content,filename,id:'navigation-test'});return {contents:c.code+'\nexport default {render};',loader:'ts',resolveDir:path.dirname(filename)};}return {contents:compileScript(descriptor,{id:'navigation-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};});
}}]});
const id='11111111-1111-4111-8111-111111111111',url=`https://test.invalid/characters/${id}/builder`;
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/window.scrollTo/.test(e.message))errors.push(e.message);});vc.on('error',e=>errors.push(String(e)));
const dom=new JSDOM('<div id="app"></div>',{url,runScripts:'outside-only',virtualConsole:vc});const w=dom.window,d=w.document;
w.Headers=Headers;w.structuredClone=structuredClone;w.requestAnimationFrame=fn=>w.setTimeout(fn,0);w.cancelAnimationFrame=id=>w.clearTimeout(id);w.scrollTo=()=>{};w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});w.HTMLElement.prototype.scrollIntoView=()=>{};
let confirms=0,accept=true,holdSave=false,releaseSave;
w.confirm=()=>{confirms++;return accept;};w.alert=()=>{};
function jsonb(value){if(Array.isArray(value))return value.map(jsonb);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).sort(([a],[b])=>b.localeCompare(a)).map(([k,v])=>[k,jsonb(v)]));return value;}
let stored={id,name:'Alexandra',campaignId:'22222222-2222-4222-8222-222222222222',version:4,data:structuredClone(fixtures.characterData)};
const calls=[];
w.fetch=async(url,options={})=>{calls.push({url,options});const method=options.method||'GET';let body;
 if(url===`/api/characters/${id}`){if(method==='PATCH'){const b=JSON.parse(options.body);assert.equal(b.version,stored.version);stored={...stored,name:b.name,version:stored.version+1,data:jsonb(b.data)};body={character:structuredClone(stored)};if(holdSave){holdSave=false;await new Promise(resolve=>releaseSave=resolve);}}else body={character:structuredClone(stored)};}
 else if(url==='/api/rulesets/terra-umbra/creation')body={rules:fixtures.rules,lore:fixtures.lore,edgeRules:fixtures.edgeRules,talentChoiceSpecs:{},skillTalentMap:{},disadvantages:{common:[],attribute:[],sphere:{}}};
 else if(url==='/api/rulesets/terra-umbra/truth')body=fixtures.truthRules;
 else if(url==='/api/rulesets/terra-umbra/reality')body=fixtures.realityRules;
 else if(url==='/api/auth/me')body={user:{id:'qa-owner',role:'player',displayName:'Navigation test',email:'test@example.invalid'}};
 else if(url==='/api/auth/gm-request')body={request:null};
 else if(url==='/api/auth/logout')body={ok:true};
 else if(url==='/api/health')body={status:'ok'};
 else if(url==='/api/auth/setup-status')body={setupRequired:false};
 else if(url==='/api/auth/capabilities')body={passwordResetAvailable:true};
 else if(String(url).startsWith('/api/compendium/'))body={items:[],recentItems:[],favoriteItems:[],sources:[]};
 else throw new Error('Unexpected API '+method+' '+url);
 return {ok:true,status:200,json:async()=>structuredClone(body)};
};
const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn,message){for(let n=0;n<200;n++){if(fn())return;await wait(5);}assert.ok(fn(),message||'Expected navigation state');}
const save=()=>d.querySelector('.top-actions button.primary');
const alias=()=>d.querySelectorAll('.identity-grid input')[2];
function edit(text){assert.ok(alias());alias().value=text;alias().dispatchEvent(new w.Event('input',{bubbles:true}));}
const account=()=>d.querySelector('a[href="/account#characters"]');
w.eval(bundle.outputFiles[0].text);
await until(()=>alias()&&save()?.disabled,'Initial hydration must be clean');await wait(30);
assert.equal(save().disabled,true,'Late catalogue hydration is not a user edit');
const helpers=w.draftHelpers;assert.equal(helpers.builderDraftFingerprint(stored.data),helpers.builderDraftFingerprint(jsonb(stored.data)),'JSONB order is irrelevant');
edit('Recorded alias');await until(()=>!save().disabled);save().click();await until(()=>stored.version===5&&save()?.disabled&&save()?.textContent.trim()==='Enregistré','Save must end clean after the reactive flush');
const unloaded=new w.Event('beforeunload',{cancelable:true});w.dispatchEvent(unloaded);assert.equal(unloaded.defaultPrevented,false,'No false native dialog after save');account().click();await until(()=>d.querySelector('.account-grid'));assert.equal(confirms,0,'Saved return to account has no dialogs');
// Repeated builder/progression mounts must not leave stale guards behind.
for(let n=0;n<6;n++){
 await w.testRouter.push(`/characters/${id}/builder`);await until(()=>alias()&&save()?.disabled);
 edit('Unsaved '+n);await until(()=>!save().disabled);const count=confirms;
 await w.testRouter.push(`/characters/${id}/progression`);await until(()=>d.querySelector('[data-campaign-rewards-lock]'));
 assert.equal(confirms,count+1,'Exactly one dialog, even after repeated route reuse');
 assert.equal(d.querySelector('[data-reward-editor]'),null);assert.equal(d.querySelectorAll('[data-renown-progression] button').length,0);
 await w.testRouter.push('/account#characters');await until(()=>d.querySelector('.account-grid'));assert.equal(confirms,count+1);
}
await w.testRouter.push(`/characters/${id}/builder`);await until(()=>alias()&&save()?.disabled);
edit('Pending save');await until(()=>!save().disabled);holdSave=true;save().click();await until(()=>typeof releaseSave==='function');edit('Edited while saving');releaseSave();await until(()=>save()?.textContent.trim()==='Enregistrer');assert.equal(alias().value,'Edited while saving','Late save response does not discard new input');
accept=false;const count=confirms;await w.testRouter.push('/account');assert.equal(confirms,count+1);assert.ok(alias(),'Cancelling keeps editor mounted');
const native=new w.Event('beforeunload',{cancelable:true});w.dispatchEvent(native);assert.equal(native.defaultPrevented,true,'Actual unsaved input remains protected');
save().click();await until(()=>save()?.textContent.trim()==='Enregistré');accept=true;account().click();await until(()=>d.querySelector('.account-grid'));assert.equal(confirms,count+1,'Saving clears the guard after an earlier cancelled leave');
const logout=[...d.querySelectorAll('button')].find(b=>b.textContent.trim()==='Déconnexion');assert.ok(logout);logout.click();await until(()=>!d.querySelector('.account-grid'));
assert.ok(calls.some(c=>c.url==='/api/auth/logout'),'Account controls remain responsive without a forced reload');
assert.deepEqual(errors,[]);w.close();
console.log('BUILDER SAVE/NAVIGATION OK — actual router, JSONB/default normalization, clean saved leave, six remount cycles with one real confirmation, in-flight edits preserved, cancel/native protection and responsive account logout');
