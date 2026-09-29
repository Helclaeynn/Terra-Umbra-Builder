import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,dirname} from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {chromium} from 'playwright-core';
const css=[];
const {terraUmbraTruthRules:truth}=await import('../../api/dist/rules/truth/rules.js');
const initial={nature:'mage',consciousness:'initie',choices:{mageiusType:'kaharal',dominantAffinity:'architetramancie'},truthTalents:[],truthEquipment:[],corruptionTalents:[],corruption:0};
const bundle=await build({stdin:{resolveDir:resolve('.'),loader:'ts',contents:`
import {createApp,h,ref} from 'vue';import Editor from './src/components/builder/MageTechniques.vue';import Cards from './src/components/builder/MageTechniqueCards.vue';import {mageTechniqueViews,mageTechniqueIds} from './src/lib/mage';import {truthAvailableTalents,truthPrerequisiteSatisfied,truthSanitizeChoices} from './src/lib/truth';
window.start=(rules,s)=>{window.stop?.();const state=ref(s);window.current=()=>JSON.parse(JSON.stringify(state.value));window.reload=()=>{const copy=JSON.parse(JSON.stringify(state.value));copy.choices=truthSanitizeChoices(rules.structure.natures.mage,copy.choices);window.start(rules,copy);};window.acquire=()=>{const t=truthAvailableTalents(rules,state.value).find(t=>t.id===mageTechniqueIds.echo);if(truthPrerequisiteSatisfied(rules,state.value,t))state.value={...state.value,truthTalents:[...state.value.truthTalents,t.id]};};const app=createApp({render:()=>h('main',{},[h(Editor,{state:state.value,rules,onChange:v=>state.value={...state.value,choices:{...state.value.choices,mageTechniques:v}}}),h('button',{'data-buy-echo':'',disabled:!truthPrerequisiteSatisfied(rules,state.value,truthAvailableTalents(rules,state.value).find(t=>t.id===mageTechniqueIds.echo)),onClick:()=>window.acquire()},'Acheter l’Écho'),h(Cards,{entries:mageTechniqueViews(rules,state.value)})])});app.mount('#app');window.stop=()=>app.unmount();};
`},bundle:true,write:false,platform:'browser',format:'iife',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path})=>{const {descriptor,errors}=parse(await readFile(path,'utf8'),{filename:path});assert.deepEqual(errors,[]);css.push(...descriptor.styles.map(s=>s.content));return {contents:compileScript(descriptor,{id:'mage-browser',inlineTemplate:true}).content,loader:'ts',resolveDir:dirname(path)};});}}]});
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:12px;background:#08131f;color:#e8f1fc;font-family:Arial}*{box-sizing:border-box}main{max-width:1050px;margin:auto;overflow-wrap:anywhere}${css.join('\n')}</style></head><body><div id="app"></div><script>${bundle.outputFiles[0].text}</script></body></html>`;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));if(process.env.MAGE_INLINE_BROWSER==='1')await page.setContent(html);else await page.goto(`http://127.0.0.1:${server.address().port}`);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});await page.evaluate(([rules,s])=>window.start(rules,s),[truth,initial]);
  assert.equal(await page.locator('[data-buy-echo]').isDisabled(),true);
  await page.locator('#mage-technique-echo>summary').focus();await page.keyboard.press('Enter');
  for(const [key,value] of Object.entries({name:'Lueur <img src=x onerror=alert(1)>',effect:'Illuminer un sceau réellement connu.',source:'Porteur ancien',pa:'1',range:'20 m',tension:'1'}))await page.locator(`[data-mage-field="echo-${key}"]`).fill(value);
  await page.locator('[data-mage-field="echo-affinity-0"]').selectOption('photomancie');
  await page.locator('[data-mage-field="echo-mastery-0"]').selectOption('affinee');assert.equal(await page.locator('[data-buy-echo]').isDisabled(),true);
  await page.locator('[data-mage-field="echo-mastery-0"]').selectOption('initiale');assert.equal(await page.locator('[data-buy-echo]').isDisabled(),false);
  await page.locator('[data-buy-echo]').click();assert.equal(await page.locator('[data-mage-sheet="echo"]').count(),1);assert.equal(await page.locator('[data-mage-sheet] input').count(),0);assert.equal(await page.locator('[data-mage-sheet] img').count(),0,'Saved text is escaped');
  const saved=await page.evaluate(()=>window.current());await page.evaluate(()=>window.reload());
  assert.deepEqual(await page.evaluate(()=>window.current()),saved,'Remount and sanitize retain actual form values');
  await page.locator('#mage-technique-echo>summary').click();assert.equal(await page.locator('[data-mage-field="echo-range"]').inputValue(),'20 m');
  await page.locator('#mage-technique-family>summary').click();await page.locator('#mage-technique-family').getByRole('button',{name:'Ajouter une Affinité requise'}).click();assert.equal(await page.locator('[data-mage-field="family-affinity-1"]').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: no horizontal overflow`);
  if(process.env.MAGE_SCREENSHOT_DIR){await mkdir(process.env.MAGE_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:`${process.env.MAGE_SCREENSHOT_DIR}/mage-${width}.png`,fullPage:true});}
 }
 assert.deepEqual(errors,[]);console.log('MAGE BROWSER OK — real forms at 1440/390/320px, keyboard, incremental edits, buy gating, multiple required affinities, reload, read-only shared cards and escaped text');
}finally{await browser.close();await new Promise(r=>server.close(r));}
