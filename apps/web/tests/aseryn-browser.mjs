import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,dirname} from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {chromium} from 'playwright-core';
const css=[];
const {terraUmbraTruthRules:truth}=await import('../../api/dist/rules/truth/rules.js');
const specimen=truth.catalogs.aseryn.find(t=>t.name==='Réflexe impossible');
const heritage='aseryn_origines_jouables_seratheen_empreinte_sang_mele_';
const initial={nature:'aseryn',consciousness:'initie',choices:{origin:'seratheen',aserynTrace1:'aerilien',aserynTrace2:'mulien',aserynAtavism:'aerilien',aserynMosaic:''},truthTalents:['atavisme_marque','heritage_eveille','mosaique_ancestrale'].map(s=>heritage+s),corruptionTalents:[],truthEquipment:[]};
const bundle=await build({stdin:{resolveDir:resolve('.'),loader:'ts',contents:`
import {createApp,h,ref} from 'vue';import Text from './src/components/builder/TruthTalentText.vue';import Choices from './src/components/builder/AserynTalentChoices.vue';import {truthAvailableTalents,truthSelectedFreeTraits} from './src/lib/truth';
window.start=(rules,rule,s)=>{window.stop?.();const state=ref(s);const app=createApp({render:()=>h('main',{},[h(Text,{effect:rule.effect,details:rule.effectDetails,lore:rule.runtimeLore,activation:rule.activation}),h(Choices,{state:state.value,onChange:(key,v)=>state.value={...state.value,choices:{...state.value.choices,[key]:v}}}),h('div',{'data-available':''},truthAvailableTalents(rules,state.value).map(t=>t.name).join(' · ')),h('div',{'data-signatures':''},truthSelectedFreeTraits(rules,state.value).map(t=>t.name).join(' · '))])});app.mount('#app');window.stop=()=>app.unmount();window.current=()=>JSON.parse(JSON.stringify(state.value));};
`},bundle:true,write:false,platform:'browser',format:'iife',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path})=>{const {descriptor,errors}=parse(await readFile(path,'utf8'),{filename:path});assert.deepEqual(errors,[]);css.push(...descriptor.styles.map(s=>s.content));return {contents:compileScript(descriptor,{id:'aseryn-browser',inlineTemplate:true}).content,loader:'ts',resolveDir:dirname(path)};});}}]});
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:12px;background:#08131f;color:#e8f1fc;font-family:Arial}*{box-sizing:border-box}main{max-width:1000px;margin:auto;overflow-wrap:anywhere}${css.join('\n')}</style></head><body><div id="app"></div><script>${bundle.outputFiles[0].text}</script></body></html>`;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}`);
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});await page.evaluate(([r,t,s])=>window.start(r,t,s),[truth,specimen,initial]);
 assert.equal(await page.locator('details').evaluate(n=>n.open),true);assert.match(await page.locator('[data-truth-summary]').innerText(),/sans payer son PA/);
 await page.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('details').evaluate(n=>n.open),false);await page.keyboard.press('Enter');assert.equal(await page.locator('details').evaluate(n=>n.open),true);assert.match(await page.locator('[data-truth-full-rule]').innerText(),/Aucune seconde défense/);
 assert.equal((await page.locator('[data-available]').innerText()).includes('Télépathie mûlienne'),false);
 await page.locator('[data-aseryn-choice="aserynMosaic"]').selectOption('mulien');assert.match(await page.locator('[data-available]').innerText(),/Télépathie mûlienne/);assert.match(await page.locator('[data-signatures]').innerText(),/Signature Mûlienne/);
 const saved=await page.evaluate(()=>window.current());await page.evaluate(([r,t,s])=>window.start(r,t,s),[truth,specimen,saved]);assert.equal(await page.locator('[data-aseryn-choice="aserynMosaic"]').inputValue(),'mulien');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),`${width}px: no horizontal overflow`);
 }
 assert.deepEqual(errors,[]);console.log('ASERYN BROWSER OK — 1440/390/320px, keyboard Details, two-sentence effect, Mosaic real selectors/access/second signature, state reload, no page errors');
}finally{await browser.close();await new Promise(r=>server.close(r));}
