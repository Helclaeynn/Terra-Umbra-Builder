import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,dirname} from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {chromium} from 'playwright-core';
const css=[];
const {terraUmbraTruthRules:truth}=await import('../../api/dist/rules/truth/rules.js');
const initial=species=>({nature:'extral',consciousness:'initie',choices:{species,network:'aucune',hunterTradition:'aucune'},truthTalents:species==='homo_superior'?['extral-reserve-nanitique','extral-cycle-de-reparation','extral-phasage-de-l-equipement']:[],truthEquipment:[],corruptionTalents:[],corruption:0,extralInventory:[{uid:'owned',itemId:'real',name:'Objet existant',kind:'equipment',biological:false}]});
const bundle=await build({stdin:{resolveDir:resolve('.'),loader:'ts',contents:`
import {createApp,h,ref} from 'vue';import Editor from './src/components/builder/ExtralOptions.vue';
import {extralSheetDetails} from './src/lib/extral';import {truthSanitizeChoices,truthPtvSpent} from './src/lib/truth';
window.start=(rules,s)=>{window.stop?.();const state=ref(s);window.current=()=>JSON.parse(JSON.stringify(state.value));window.reload=()=>{const copy=window.current();copy.choices=truthSanitizeChoices(rules.structure.natures.extral,copy.choices);window.start(rules,copy);};
const app=createApp({render:()=>h('main',{},[h(Editor,{state:state.value,rules,onChange:v=>state.value={...state.value,choices:{...state.value.choices,extralBuild:v}}}),h('output',{'data-ptv':''},String(truthPtvSpent(rules,state.value))),h('section',{'data-readonly':''},extralSheetDetails(rules,state.value).map(d=>h('article',{'data-detail':d.id},[h('h4',d.name),h('p',d.value),h('p',d.description)])))])});app.mount('#app');window.stop=()=>app.unmount();};
`},bundle:true,write:false,platform:'browser',format:'iife',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path})=>{const {descriptor,errors}=parse(await readFile(path,'utf8'),{filename:path});assert.deepEqual(errors,[]);css.push(...descriptor.styles.map(s=>s.content));return {contents:compileScript(descriptor,{id:'extral-browser',inlineTemplate:true}).content,loader:'ts',resolveDir:dirname(path)};});}}]});
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:12px;background:#08131f;color:#e8f1fc;font-family:Arial}*{box-sizing:border-box}main{max-width:1050px;margin:auto;overflow-wrap:anywhere}${css.join('\n')}</style></head><body><div id="app"></div><script>${bundle.outputFiles[0].text}</script></body></html>`;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}`);
 const open=async key=>{const s=page.locator(`[data-extral-section="${key}"]`);if(!await s.getAttribute('open')){await s.locator(':scope>summary').focus();await page.keyboard.press('Enter');}};
 const action=key=>page.locator(`[data-extral-action="${key}"]`);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});await page.evaluate(([r,s])=>window.start(r,s),[truth,initial('homo_superior')]);
  await open('nanites');await action('use-reserve').click();assert.equal(await action('use-repair').isDisabled(),false);await action('use-repair').click();const used=await page.evaluate(()=>window.current());await page.evaluate(()=>window.reload());await open('nanites');assert.ok(await action('use-reserve').isDisabled());assert.ok(await action('use-repair').isDisabled());assert.deepEqual(await page.evaluate(()=>window.current()),used);
  page.once('dialog',d=>d.dismiss());await action('new-scenario').click();assert.ok(await action('use-repair').isDisabled());page.once('dialog',d=>d.accept());await action('new-scenario').click();assert.equal(await action('use-repair').isDisabled(),false);
  await open('patches');await page.locator('[data-extral-patch="owned"]').selectOption('phased');await page.evaluate(()=>window.reload());assert.match(await page.locator('[data-detail="extral-patch-owned"]').textContent(),/déphasé/);assert.equal((await page.evaluate(()=>window.current())).extralInventory.length,1);
  await page.evaluate(([r,s])=>window.start(r,s),[truth,initial('baseanh')]);await open('preparations');await action('add-preparation').click();await action('add-preparation').click();assert.ok(await action('add-preparation').isDisabled());
  const first=page.locator('[data-extral-preparation]').first();await first.locator('input').first().fill('Culture <img src=x onerror=alert(1)>');await first.locator('textarea').first().fill('Coagulant <script>test</script>');await first.getByRole('button',{name:'Consommer une dose'}).click();const saved=await page.evaluate(()=>window.current());await page.evaluate(()=>window.reload());assert.deepEqual(await page.evaluate(()=>window.current()),saved);assert.equal(saved.choices.extralBuild.preparations[0].remaining,0);
  await open('projects');await action('add-project').click();await page.locator('[data-extral-section="projects"] input').first().fill('Prototype <img src=x onerror=alert(1)>');assert.equal(await page.locator('[data-readonly] img,[data-readonly] script,[data-readonly] input,[data-readonly] button').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: no horizontal overflow`);
 }
 assert.deepEqual(errors,[]);console.log('EXTRAL BROWSER OK — forms 1440/390/320px, keyboard, independent scenario counters, confirmed reset, no reload refill, consumed Tardollas, actual inventory references and escaped read-only sharing');
}finally{await browser.close();await new Promise(r=>server.close(r));}
