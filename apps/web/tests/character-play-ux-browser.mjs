import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {parse,compileScript,compileStyle} from '@vue/compiler-sfc';
import {chromium} from 'playwright-core';

const root=fileURLToPath(new URL('../',import.meta.url)),styles=[];
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
 import {createApp,h,reactive,ref} from 'vue';
 import CharacterPlay from './src/components/CharacterPlay.vue';
 import {blankPlayState,playProfile} from '../api/src/rules/play-state';
 const data=reactive({attributes:{vigueur:4,agilite:3,esprit:3,volonte:4,charisme:3},skills:{athletisme:{style:6},constitution:{style:4}},creation:{},truth:{nature:'humain',consciousness:'initie'},talents:{},reality:{augmentations:[]},progression:{}});
 const sheet=reactive({name:'Verónica Cortez',lifestyle:'Confort',cash:50,account:2500,realityTalents:[],truthTalents:[],disadvantages:[],inventory:Array.from({length:24},(_,i)=>({id:'item-'+i,name:i===0?'Manteau renforcé':'Objet personnel '+i,group:i===0?'Vêtements':'Accessoires',detail:'Texte détaillé du matériel. '.repeat(8)}))});
 const owner=ref(true);let state=blankPlayState();window.ux={data,sheet,owner};window.playState=state;
 window.serverSnapshot=()=>({state:window.playState,profile:playProfile(data,window.playState),events:window.playEvents??[],version:window.playVersion??0,edge:3,canManageMechanics:false});
 const app=createApp({render:()=>h(CharacterPlay,{id:'ux-character',data,sheet,canEdit:owner.value})});app.mount('#app');window.stop=()=>app.unmount();
`},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false'},plugins:[{name:'vue-with-real-styles',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor,errors}=parse(await readFile(filename,'utf8'));assert.deepEqual(errors,[]);const id='data-v-'+createHash('sha256').update(filename).digest('hex').slice(0,8);const script=compileScript(descriptor,{id,inlineTemplate:true});for(const style of descriptor.styles){const compiled=compileStyle({source:style.content,filename,id,scoped:style.scoped});assert.deepEqual(compiled.errors,[]);styles.push(compiled.code);}return {contents:script.content.replace('export default','const __component =')+`\n__component.__scopeId=${JSON.stringify(id)};export default __component;`,loader:'ts',resolveDir:path.dirname(filename)};});}}]});

if(process.env.TUC_UX_BUILD_ONLY==='1'){console.log('CHARACTER UX FIXTURE BUILD OK — actual Vue templates and scoped styles compile.');process.exit(0);}
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
const page=await browser.newPage(),errors=[],requests=[];page.on('pageerror',error=>errors.push(error.message));
await page.route('https://character-ux.invalid/',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="fr"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main class="fixture-shell"><div id="app"></div></main></body></html>'}));
await page.route('**/api/characters/ux-character/play',async route=>{
 const body=route.request().postDataJSON();
 if(body){requests.push(body);await page.evaluate(input=>{window.playVersion=(window.playVersion??0)+1;if(input.action==='save')window.playState=input.state;const skill=window.serverSnapshot().profile.skills.find(s=>s.id===input.skill);const payload=input.action==='roll'?{label:skill.name,modifier:skill.total,dice:[10,4],sum:14,total:skill.total+14,exploded:true,narrativeFailure:false}:{label:'Enregistré'};window.playEvents=[{id:input.requestId,kind:input.action,payload,createdAt:'2026-10-09T20:00:00Z'},...(window.playEvents??[])];},body);}
 const snapshot=await page.evaluate(()=>window.serverSnapshot());
 await route.fulfill({json:body?{state:snapshot.state,profile:snapshot.profile,version:snapshot.version,event:snapshot.events[0]}:snapshot});
});
const primary=name=>page.locator('.play-tabs').getByRole('button',{name,exact:true});
const overflow=async(width)=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Character play reflows at '+width);
try{
 await page.goto('https://character-ux.invalid/');await page.addStyleTag({content:'*{box-sizing:border-box}body{margin:0;background:#06111f;color:#e6eef8;font-family:Arial,sans-serif}.fixture-shell{max-width:1100px;margin:auto;padding:16px}'+styles.join('\n')});await page.addScriptTag({content:bundle.outputFiles[0].text});
 await page.getByRole('heading',{name:'Verónica Cortez',exact:true}).waitFor();await page.getByRole('button',{name:'Lancer le d10 pour Athlétisme',exact:true}).waitFor();
 assert.equal(await page.locator('.play-tabs > button').count(),4);assert.equal(await page.locator('.play-more').evaluate(el=>el.open),false);assert.equal(await page.locator('.skill-group[open]').count(),1);
 const search=page.getByLabel('Retrouver une compétence',{exact:true});await search.fill('athletisme');assert.equal(await page.locator('.skill-roll').count(),1);assert.equal(await page.locator('.skill-group').evaluate(el=>el.open),true);await page.getByRole('button',{name:'Lancer le d10 pour Athlétisme',exact:true}).click();await page.locator('.roll-result summary').getByText('Athlétisme · 24',{exact:true}).waitFor();assert.equal(requests.at(-1).action,'roll');assert.equal(await page.locator('.roll-result details').evaluate(el=>el.open),false);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:720});await primary('Jets').click();await search.fill('');await overflow(width);
  const result=page.locator('.roll-result details'),summary=result.locator(':scope > summary');await summary.focus();await summary.press('Enter');assert.equal(await result.evaluate(el=>el.open),true,'Dice detail opens with the keyboard at '+width);await result.getByText('10 + 10 + 4 = 24',{exact:true}).waitFor();await summary.press('Enter');assert.equal(await result.evaluate(el=>el.open),false);
  const rollHelp=page.locator('.roll-help');await rollHelp.locator(':scope > summary').click();assert.equal(await rollHelp.evaluate(el=>el.open),true);
  await page.evaluate(()=>window.scrollTo(0,Math.min(450,document.documentElement.scrollHeight-innerHeight)));await page.waitForTimeout(30);const dock=await page.locator('.play-dock').boundingBox();assert.ok(dock&&dock.y>=0&&dock.y<32,'Essential state/result remain visible after scrolling at '+width);await page.evaluate(()=>window.scrollTo(0,0));await rollHelp.locator(':scope > summary').click();
  await primary('Équipement').click();await page.getByLabel('Retrouver un objet',{exact:true}).fill('vetements');assert.equal(await page.locator('.rule-card').count(),1);const item=page.locator('.rule-card');assert.equal(await item.evaluate(el=>el.open),false);await item.locator('summary').focus();await item.locator('summary').press('Enter');assert.equal(await item.evaluate(el=>el.open),true);await item.getByText('Texte détaillé du matériel.',{exact:false}).waitFor();await overflow(width);
  const more=page.locator('.play-more');await more.locator('summary').focus();await more.locator('summary').press('Enter');assert.equal(await more.evaluate(el=>el.open),true);await more.getByRole('button',{name:'Historique',exact:true}).click();assert.equal(await more.evaluate(el=>el.open),false);await page.getByText('Historique partagé avec le MJ',{exact:true}).waitFor();await page.locator('.play-dock .revelation-control select').waitFor();await page.locator('.play-dock .roll-result summary').getByText('Athlétisme · 24',{exact:true}).waitFor();await overflow(width);
  await page.screenshot({path:`/tmp/character-play-ux-${width}.png`,fullPage:true});
 }
 // Read-only observers can navigate and inspect a result, but cannot change Revelation or launch a roll.
 await page.evaluate(()=>{window.ux.owner.value=false;});await primary('Jets').click();await search.fill('athletisme');assert.equal(await page.getByRole('button',{name:'Lancer le d10 pour Athlétisme',exact:true}).isDisabled(),true);assert.equal(await page.locator('.revelation-control select').isDisabled(),true);assert.deepEqual(errors,[]);console.log('CHARACTER PLAY UX BROWSER OK — four primary tabs, searchable collapsed skills and owned equipment, keyboard disclosures, persistent state/result while scrolling, Plus navigation, 1440/390/320px reflow and read-only permissions.');
}finally{await browser.close();}
