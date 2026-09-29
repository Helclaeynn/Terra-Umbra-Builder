import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,dirname} from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {chromium} from 'playwright-core';
const css=[];
const {terraUmbraTruthRules:truth}=await import('../../api/dist/rules/truth/rules.js');
const initial={nature:'daemon',consciousness:'initie',choices:{divinity:'mephisto',function:'oracle',patron:'',soulOrigin:'eveille'},truthTalents:[],truthEquipment:[],corruptionTalents:[],corruption:0};
const bundle=await build({stdin:{resolveDir:resolve('.'),loader:'ts',contents:`
import {createApp,h,ref} from 'vue';
import Editor from './src/components/builder/DaemonOptions.vue';import Cards from './src/components/builder/DaemonDetailCards.vue';import TalentText from './src/components/builder/TruthTalentText.vue';
import {daemonSheetEntries,daemonTalentIds as ids} from './src/lib/daemon';import {truthAvailableTalents,truthPrerequisiteSatisfied,truthSanitizeChoices,truthPtvSpent} from './src/lib/truth';
window.start=(rules,s)=>{window.stop?.();const state=ref(s);window.current=()=>JSON.parse(JSON.stringify(state.value));window.reload=()=>{const copy=JSON.parse(JSON.stringify(state.value));copy.choices=truthSanitizeChoices(rules.structure.natures.daemon,copy.choices);window.start(rules,copy);};
const candidates=()=>truthAvailableTalents(rules,state.value),eligible=t=>!!t&&!state.value.truthTalents.includes(t.id)&&truthPrerequisiteSatisfied(rules,state.value,t)&&truthPtvSpent(rules,state.value)+t.cost<=20;
const app=createApp({render:()=>h('main',{},[
h(Editor,{state:state.value,rules,onChange:v=>state.value={...state.value,choices:{...state.value.choices,daemonBuild:v}}}),
h('output',{'data-daemon-spent':''},String(truthPtvSpent(rules,state.value))),
h('div',{},Object.entries(ids).map(([key,id])=>{const t=candidates().find(t=>t.id===id);return h('button',{'data-buy-daemon':key,disabled:!eligible(t),onClick:()=>{if(eligible(t))state.value={...state.value,truthTalents:[...state.value.truthTalents,t.id]};}},t?.name||key);})),
h(Cards,{entries:daemonSheetEntries(rules,state.value)}),h(TalentText,{effect:rules.catalogs.daemon.find(t=>t.name==='Loi du Juge').effect,details:rules.catalogs.daemon.find(t=>t.name==='Loi du Juge').effectDetails})
])});app.mount('#app');window.stop=()=>app.unmount();};
`},bundle:true,write:false,platform:'browser',format:'iife',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path})=>{const {descriptor,errors}=parse(await readFile(path,'utf8'),{filename:path});assert.deepEqual(errors,[]);css.push(...descriptor.styles.map(s=>s.content));return {contents:compileScript(descriptor,{id:'daemon-browser',inlineTemplate:true}).content,loader:'ts',resolveDir:dirname(path)};});}}]});
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:12px;background:#08131f;color:#e8f1fc;font-family:Arial}*{box-sizing:border-box}main{max-width:1050px;margin:auto;overflow-wrap:anywhere}${css.join('\n')}</style></head><body><div id="app"></div><script>${bundle.outputFiles[0].text}</script></body></html>`;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));if(process.env.DAEMON_INLINE_BROWSER==='1')await page.setContent(html);else await page.goto(`http://127.0.0.1:${server.address().port}`);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});await page.evaluate(([rules,s])=>window.start(rules,s),[truth,initial]);
  const buy=key=>page.locator(`[data-buy-daemon="${key}"]`),field=key=>page.locator(`[data-daemon-field="${key}"]`);
  const open=async key=>{const section=page.locator(`[data-daemon-section="${key}"]`);if(!await section.getAttribute('open')){await section.locator(':scope>summary').focus();await page.keyboard.press('Enter');}};
  assert.equal(await buy('formation').isDisabled(),true);await open('secondary');
  await field('secondaryFunction').selectOption('legionnaire');await field('secondaryMentor').pressSequentially('La Cour <img src=x onerror=alert(1)>');
  assert.equal(await buy('formation').isDisabled(),false);await buy('formation').click();assert.equal(await page.locator('[data-daemon-spent]').textContent(),'3');
  assert.equal(await page.locator('[data-daemon-sheet="secondary"]').count(),1);assert.equal(await page.locator('[data-daemon-sheet] img').count(),0);
  await open('spectra');await field('spectralAffinity').selectOption('photomancie');await buy('affined').click();await buy('amplified').click();
  assert.equal(await buy('polyphony').isDisabled(),true);await field('secondSpectralAffinity').selectOption('divination');await buy('polyphony').click();
  assert.match(await page.locator('[data-daemon-sheet="spectrum-secondary"]').textContent(),/Initiale \/ Mineure/);await buy('secondAffined').click();await buy('secondAmplified').click();assert.equal(await page.locator('[data-daemon-spent]').textContent(),'12');
  const saved=await page.evaluate(()=>window.current());await page.evaluate(()=>window.reload());assert.deepEqual(await page.evaluate(()=>window.current()),saved);
  assert.equal(await page.locator('[data-daemon-sheet] input').count(),0);assert.equal(await page.locator('[data-daemon-sheet] button').count(),0);
  await page.locator('.truth-talent-details>summary').focus();await page.keyboard.press('Enter');assert.ok(await page.locator('[data-truth-full-rule]').isVisible());
  const belzebuth={...initial,choices:{...initial.choices,divinity:'belzebuth',function:'tourmenteur'}};await page.evaluate(([rules,s])=>window.start(rules,s),[truth,belzebuth]);
  assert.equal(await buy('form').isDisabled(),true);await open('form');await page.locator('[data-daemon-property="armour"]').check();await page.locator('[data-daemon-property="flight"]').check();await buy('form').click();await buy('contagion').click();
  await open('pathologies');await page.locator('[data-daemon-add="pathology"]').click();
  for(const [k,v] of Object.entries({name:'Vertige défini',symptoms:'Vertige temporaire',penalty:'−3, sans cumul',duration:'Scène',transmission:'Contact convenu',incubation:'1 round',resistance:'Défense occulte',cure:'Soins appropriés'}))await field('pathology-0-'+k).fill(v);
  assert.ok((await page.locator('[data-daemon-sheet="pathology-contagion-0"]').textContent()).includes('Soins appropriés'));
  const configured=await page.evaluate(()=>window.current());await page.evaluate(()=>window.reload());assert.deepEqual(await page.evaluate(()=>window.current()),configured);
  const rare={...initial,choices:{...initial.choices,divinity:'morrighan',soulOrigin:'ancien_prophete'}};await page.evaluate(([rules,s])=>window.start(rules,s),[truth,rare]);
  await open('rites');await field('riteDomain').selectOption('corvides');await page.locator('[data-daemon-add="rite"]').click();await open('remanence');
  for(const prefix of ['rite-0','remanence'])for(const [k,v] of Object.entries({name:'Manifestation <script>x</script>',effect:'Effet étroit défini',source:'Histoire et mentor',range:'Contact',frequency:'1/scène',duration:'Un round',resistance:'Défense occulte',limits:'Initiale / Mineure uniquement',pa:'1'}))await field(prefix+'-'+k).fill(v);
  assert.equal(await buy('ritual').isDisabled(),false);assert.equal(await buy('remanence').isDisabled(),false);await buy('ritual').click();await buy('remanence').click();assert.equal(await page.locator('[data-daemon-spent]').textContent(),'4');
  assert.equal(await page.locator('[data-daemon-sheet] script').count(),0);assert.equal(await page.locator('[data-daemon-sheet] input').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: no horizontal overflow`);
  if(process.env.DAEMON_SCREENSHOT_DIR){await mkdir(process.env.DAEMON_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:`${process.env.DAEMON_SCREENSHOT_DIR}/daemon-${width}.png`,fullPage:true});}
 }
 assert.deepEqual(errors,[]);console.log('DAEMON BROWSER OK — actual forms at 1440/390/320px, keyboard, gated purchases and PTV costs, distinct Spectres, full definitions, escaped read-only sharing and reload');
}finally{await browser.close();await new Promise(r=>server.close(r));}
