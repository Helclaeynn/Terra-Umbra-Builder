import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const bundle = await build({
  stdin: { resolveDir: root, loader: 'ts', contents: `
    import { createApp } from 'vue';
    import { createRouter, createMemoryHistory } from 'vue-router';
    import Account from './src/pages/CharacterSheetPage.vue';
    import Journal from './src/pages/CharacterJournalPage.vue';
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/characters/:id/:view', component: Account }] });
    const app = createApp(window.testJournal?Journal:Account).use(router);
    router.push('/characters/11111111-1111-4111-8111-111111111111/sheet').then(() => { app.mount('#app'); });
    window.unmount = () => app.unmount();
  ` },
  bundle: true, write: false, format: 'iife', platform: 'browser',
  define: { 'process.env.NODE_ENV': '"test"', __VUE_OPTIONS_API__: 'true', __VUE_PROD_DEVTOOLS__: 'false', __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false' },
  plugins: [{ name: 'vue', setup(b) {
    b.onLoad({ filter: /CharactersPanel\.vue$/ }, () => ({ contents: 'export default { template: "<section>Personnages</section>" }', loader: 'js' }));
    b.onLoad({ filter: /\.vue$/ }, async ({ path: filename }) => {
      const { descriptor, errors } = parse(await readFile(filename, 'utf8'), { filename });
      assert.equal(errors.length, 0);
      if (!descriptor.script && !descriptor.scriptSetup) {
        const compiled = compileTemplate({ source: descriptor.template.content, filename, id: 'gm-test' });
        assert.equal(compiled.errors.length, 0);
        return { contents: `${compiled.code}\nexport default { render };`, loader: 'ts', resolveDir: path.dirname(filename) };
      }
      return { contents: compileScript(descriptor, { id: 'gm-test', inlineTemplate: true }).content, loader: 'ts', resolveDir: path.dirname(filename) };
    });
  } }]
});
const wait = ms => new Promise(r => setTimeout(r, ms));
async function until(predicate) {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await wait(5); }
  assert.ok(predicate(), 'UI did not reach the expected state');
}
const fixtureText=await readFile(path.join(root,'tests/builder-v2-smoke.mjs'),'utf8');
const fixtures=fixtureText.slice(fixtureText.indexOf('const skillIds='),fixtureText.indexOf('const browser='));
const fixtureBundle=await build({stdin:{contents:fixtures+`;export {characterData,rules,lore,edgeRules,truthRules,realityRules};`,loader:'js'},write:false,bundle:true,format:'esm',platform:'node'});
const fixture=await import('data:text/javascript;base64,'+Buffer.from(fixtureBundle.outputFiles[0].text).toString('base64'));
const id='11111111-1111-4111-8111-111111111111',readerId='33333333-3333-4333-8333-333333333333';
const vc=new VirtualConsole(), errors=[];vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM('<!doctype html><div id="app"></div>',{url:'https://test.invalid/characters/'+id+'/sheet',runScripts:'outside-only',virtualConsole:vc});
const w=dom.window;w.Headers=Headers;w.confirm=()=>true;
const requests=[];
w.fetch=async(url,options={})=>{
 requests.push({url,...options});let body;
 if(url.endsWith('/sheet'))body={character:{id,name:'Test',data:fixture.characterData,version:1,updatedAt:'2026-09-23'},canEdit:true,ownerName:'Test'};
 else if(url.includes('/reader-search'))body={accounts:[{id:readerId,displayName:'Alex',role:'gm',shared:false}]};
 else if(url.endsWith('/readers'))body={readers:[]};
 else if(url.endsWith('/creation'))body={rules:fixture.rules,lore:fixture.lore,edgeRules:fixture.edgeRules,talentChoiceSpecs:{},skillTalentMap:{},disadvantages:{common:[],attribute:[],sphere:{}}};
 else if(url.endsWith('/truth'))body=fixture.truthRules;
 else if(url.endsWith('/reality'))body=fixture.realityRules;
 else if(url.includes('/wiki'))body={entries:[]};
 else throw Error('Unexpected '+url);
 return {ok:true,status:200,json:async()=>body};
};
w.eval(bundle.outputFiles[0].text);
await until(()=>w.document.querySelector('.sheet-sharing'));
const details=w.document.querySelector('.sheet-sharing');details.open=true;
const input=w.document.querySelector('#mj-account-search');input.value='Alex';input.dispatchEvent(new w.Event('input',{bubbles:true}));
details.dispatchEvent(new w.Event('toggle'));
await until(()=>w.document.querySelector('.reader-option'));
assert.equal(requests.filter(r=>r.url.includes('reader-search')).length,1,'Typing immediately on disclosure opening must trigger one search');
w.document.querySelector('.reader-option').click();await wait(5);
const grant=()=>[...w.document.querySelectorAll('button')].find(b=>b.textContent==='Accorder l’accès');
assert.equal(grant().disabled,false);
input.value='Nobody';input.dispatchEvent(new w.Event('input',{bubbles:true}));await wait(5);
assert.equal(grant().disabled,true,'Changing query must reset selection');
assert.deepEqual(errors,[]);w.unmount();w.close();
console.log('ACCOUNT SEARCH DOM OK — rapid opening/typing, debounce, result selection, invalidated selection, no render errors');
const journalDom=new JSDOM('<!doctype html><div id="app"></div>',{url:'https://test.invalid/characters/'+id+'/journal',runScripts:'outside-only',virtualConsole:vc});
const jw=journalDom.window;jw.Headers=Headers;jw.testJournal=true;jw.confirm=()=>true;
let journalEntries=[],writes=0;
const noteId='55555555-5555-4555-8555-555555555555';
jw.fetch=async(url,options={})=>{
 const method=options.method||'GET';const data=options.body?JSON.parse(options.body):null;
 let status=200,body;
 if(method==='GET')body={character:{id,name:'Alexandra'},entries:journalEntries,hasMore:false};
 else if(method==='POST'){
   writes++;const entry={...data,id:noteId,version:1,createdAt:'2026-09-23',updatedAt:'2026-09-23'};journalEntries=[entry];body={entry};
 }else if(method==='PATCH'){
   if(data.version!==journalEntries[0].version){status=409;body={error:'journal_version_conflict'};}
   else{writes++;journalEntries[0]={...journalEntries[0],...data,version:data.version+1};body={entry:journalEntries[0]};}
 }else if(method==='DELETE'){writes++;journalEntries=[];body={ok:true};}
 else throw Error('Unexpected '+url);
 return {ok:status<400,status,json:async()=>body};
};
jw.eval(bundle.outputFiles[0].text);
const button=text=>[...jw.document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
await until(()=>button('Nouvelle note'));
button('Nouvelle note').click();await until(()=>jw.document.querySelector('textarea'));
const set=(el,value)=>{el.value=value;el.dispatchEvent(new jw.Event('input',{bubbles:true}));};
set(jw.document.querySelector('.journal-fields input'),'Séance au port');
set(jw.document.querySelector('textarea'),'<script>not executable</script>\nUne piste.');
jw.document.querySelector('form').dispatchEvent(new jw.Event('submit',{bubbles:true,cancelable:true}));
await until(()=>jw.document.querySelector('.journal-entry'));
assert.equal(jw.document.querySelector('.journal-entry script'),null);
assert.match(jw.document.querySelector('.journal-entry').textContent,/<script>not executable/);
button('Modifier').click();await until(()=>jw.document.querySelector('textarea'));
set(jw.document.querySelector('textarea'),'Brouillon à conserver');
journalEntries[0]={...journalEntries[0],content:'Version distante',version:2};
jw.document.querySelector('form').dispatchEvent(new jw.Event('submit',{bubbles:true,cancelable:true}));
await until(()=>button('Charger la dernière version'));
assert.equal(jw.document.querySelector('textarea').value,'Brouillon à conserver','Conflict keeps the unsaved note');
button('Charger la dernière version').click();
await until(()=>jw.document.querySelector('textarea')?.value==='Version distante');
set(jw.document.querySelector('textarea'),'Version réunie');
jw.document.querySelector('form').dispatchEvent(new jw.Event('submit',{bubbles:true,cancelable:true}));
await until(()=>!jw.document.querySelector('textarea'));
assert.equal(journalEntries[0].content,'Version réunie');
jw.confirm=()=>false;button('Supprimer').click();await wait(5);assert.equal(journalEntries.length,1);
jw.confirm=()=>true;button('Supprimer').click();await until(()=>!jw.document.querySelector('.journal-entry'));
assert.equal(writes,3);assert.deepEqual(errors,[]);jw.unmount();jw.close();
console.log('JOURNAL DOM OK — create/read/edit/delete, escaped text, conflict retains draft, explicit reload, deletion confirmation');
