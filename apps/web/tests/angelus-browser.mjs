import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,dirname} from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {chromium} from 'playwright-core';
const css=[];
const {terraUmbraTruthRules:truth}=await import('../../api/dist/rules/truth/rules.js');
const initial={nature:'angelus',consciousness:'initie',choices:{angelNature:'trone',sephirah:'yessod',archangel:'',seraph:''},truthTalents:['nature_trone_lecture_superficielle','nature_trone_lecture_profonde'],truthEquipment:[],corruptionTalents:[],corruption:0};
const bundle=await build({stdin:{resolveDir:resolve('.'),loader:'ts',contents:`
import {createApp,h,ref} from 'vue';
import Editor from './src/components/builder/AngelusOptions.vue';import Cards from './src/components/builder/AngelusDetailCards.vue';import TalentText from './src/components/builder/TruthTalentText.vue';
import {angelusSheetEntries,angelusTalentIds as ids} from './src/lib/angelus';import {truthAvailableTalents,truthPrerequisiteSatisfied,truthSanitizeChoices,truthPtvSpent} from './src/lib/truth';
window.start=(rules,s)=>{window.stop?.();const state=ref(s);window.current=()=>JSON.parse(JSON.stringify(state.value));window.reload=()=>{const copy=JSON.parse(JSON.stringify(state.value));copy.choices=truthSanitizeChoices(rules.structure.natures.angelus,copy.choices);window.start(rules,copy);};
const candidates=()=>truthAvailableTalents(rules,state.value),eligible=t=>!!t&&!state.value.truthTalents.includes(t.id)&&truthPrerequisiteSatisfied(rules,state.value,t)&&truthPtvSpent(rules,state.value)+t.cost<=20;
const app=createApp({render:()=>h('main',{},[
h(Editor,{state:state.value,rules,onChange:v=>state.value={...state.value,choices:{...state.value.choices,angelusBuild:v}}}),
h('output',{'data-angelus-spent':''},String(truthPtvSpent(rules,state.value))),
h('div',{},Object.entries(ids).map(([key,id])=>{const t=candidates().find(t=>t.id===id);return h('button',{'data-buy-angelus':key,disabled:!eligible(t),onClick:()=>{if(eligible(t))state.value={...state.value,truthTalents:[...state.value.truthTalents,t.id]};}},t?.name||key);})),
h(Cards,{entries:angelusSheetEntries(rules,state.value)}),h(TalentText,{effect:rules.catalogs.angelus.find(t=>t.name==='Liaison céleste').effect,details:rules.catalogs.angelus.find(t=>t.name==='Liaison céleste').effectDetails})
])});app.mount('#app');window.stop=()=>app.unmount();};
`},bundle:true,write:false,platform:'browser',format:'iife',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path})=>{const {descriptor,errors}=parse(await readFile(path,'utf8'),{filename:path});assert.deepEqual(errors,[]);css.push(...descriptor.styles.map(s=>s.content));return {contents:compileScript(descriptor,{id:'angelus-browser',inlineTemplate:true}).content,loader:'ts',resolveDir:dirname(path)};});}}]});
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:12px;background:#08131f;color:#e8f1fc;font-family:Arial}*{box-sizing:border-box}main{max-width:1050px;margin:auto;overflow-wrap:anywhere}${css.join('\n')}</style></head><body><div id="app"></div><script>${bundle.outputFiles[0].text}</script></body></html>`;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));if(process.env.ANGELUS_INLINE_BROWSER==='1')await page.setContent(html);else await page.goto(`http://127.0.0.1:${server.address().port}`);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});await page.evaluate(([rules,s])=>window.start(rules,s),[truth,initial]);
  const buy=key=>page.locator(`[data-buy-angelus="${key}"]`),field=key=>page.locator(`[data-angelus-field="${key}"]`);
  const open=async key=>{const section=page.locator(`[data-angelus-section="${key}"]`);if(!await section.getAttribute('open')){await section.locator(':scope>summary').focus();await page.keyboard.press('Enter');}};
  assert.equal(await buy('cherub').isDisabled(),true);await open('cherub');
  await field('secondaryNature').selectOption('vertu');await field('transcendenceEvent').pressSequentially('Éveil <img src=x onerror=alert(1)>');
  assert.equal(await buy('cherub').isDisabled(),false);await buy('cherub').click();assert.equal(await page.locator('[data-angelus-spent]').textContent(),'6');
  assert.equal(await page.locator('[data-angelus-sheet="cherub"]').count(),1);assert.equal(await page.locator('[data-angelus-sheet] img').count(),0);
  await buy('liaison').click();await open('liaison');await field('liaisonContact').fill('Une amie <script>x</script>');
  await open('sins');assert.equal(await page.locator('[data-angelus-sin]').count(),7);await field('preferredSin').selectOption('envie');await field('observedSkill').fill('Médecine');
  assert.equal(await buy('construct').isDisabled(),true);await open('construct');
  await field('construct-name').fill('Porteur <img src=x onerror=alert(1)>');await field('construct-kind').selectOption('carrier');await field('construct-purpose').fill('Évacuer un blessé');await field('construct-limits').fill('30 m ; mes PA et Compétences');await buy('construct').click();
  assert.equal(await page.locator('[data-angelus-spent]').textContent(),'11');assert.match(await page.locator('[data-angelus-sheet="construct"]').textContent(),/10 PV/);
  const saved=await page.evaluate(()=>window.current());await page.evaluate(()=>window.reload());assert.deepEqual(await page.evaluate(()=>window.current()),saved);
  assert.equal(await page.locator('[data-angelus-sheet] input').count(),0);assert.equal(await page.locator('[data-angelus-sheet] button').count(),0);assert.equal(await page.locator('[data-angelus-sheet] img').count(),0);assert.equal(await page.locator('[data-angelus-sheet] script').count(),0);
  assert.ok(await page.locator('[data-truth-full-rule]').isVisible());await page.locator('.truth-talent-details>summary').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-truth-full-rule]').isVisible(),false);await page.keyboard.press('Enter');assert.ok(await page.locator('[data-truth-full-rule]').isVisible());
  await open('cherub');await field('secondaryNature').selectOption('');
  assert.equal(await page.locator('[data-angelus-spent]').textContent(),'11','No silent refund after clearing a definition');assert.ok(await page.locator('[data-angelus-sheet="unavailable"]').isVisible());
  await field('secondaryNature').selectOption('vertu');await open('construct');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: no horizontal overflow`);
  if(process.env.ANGELUS_SCREENSHOT_DIR){await mkdir(process.env.ANGELUS_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:`${process.env.ANGELUS_SCREENSHOT_DIR}/angelus-${width}.png`,fullPage:true});}
 }
 assert.deepEqual(errors,[]);console.log('ANGELUS BROWSER OK — actual forms at 1440/390/320px, keyboard, Chérubin gates, seven sins, Yessod definitions, Liaison, no hidden refund, escaped read-only sharing and reload');
}finally{await browser.close();await new Promise(r=>server.close(r));}
