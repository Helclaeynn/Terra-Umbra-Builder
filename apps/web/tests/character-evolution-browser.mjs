import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {deflateSync} from 'node:zlib';
import {resolve,dirname} from 'node:path';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {chromium} from 'playwright-core';
const css=[];
const source=await readFile('tests/builder-v2-smoke.mjs','utf8');
const fixture=Function(source.slice(source.indexOf('const skillIds='),source.indexOf('const browser='))+';return {characterData,rules,lore,edgeRules,truthRules,realityRules};')();
const {terraUmbraTruthRules:truth}=await import('../../api/dist/rules/truth/rules.js');
const bundle=await build({stdin:{resolveDir:resolve('.'),loader:'ts',contents:`
import {createApp,ref,h} from 'vue';
import Summary from './src/components/builder/CharacterSummary.vue';
import Gallery from './src/components/CharacterGallery.vue';
import {buildCharacterSheet} from './src/lib/character-sheet-model';
window.start=(mode,data,core,truth,reality)=>{
 window.stop?.();const current=ref(data);window.current=()=>JSON.parse(JSON.stringify(current.value));
 const app=createApp({render:()=>mode==='summary'?h(Summary,{sheet:buildCharacterSheet(current.value,core,truth,reality,true)}):h('div',{},['reality','truth'].map(layer=>h(Gallery,{modelValue:current.value.appearances,layer,characterId:'11111111-1111-4111-8111-111111111111',legacy:current.value.identity,editable:true,'onUpdate:modelValue':v=>current.value.appearances=v,'onRemove-legacy':()=>current.value.identity.portraitDataUrl=''})))});
 app.mount('#app');window.stop=()=>app.unmount();
};`},bundle:true,write:false,platform:'browser',format:'iife',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){
 b.onLoad({filter:/BuilderWikiLink\.vue$/},()=>({contents:"import {h} from 'vue';export default {props:['label'],render(){return h('span',this.$slots.default?.()||this.label)}}",loader:'js'}));
 b.onLoad({filter:/\.vue$/},async({path})=>{const {descriptor}=parse(await readFile(path,'utf8'),{filename:path});css.push(...descriptor.styles.map(s=>s.content));return {contents:compileScript(descriptor,{id:'evolution-test',inlineTemplate:true}).content,loader:'ts',resolveDir:dirname(path)};});
}}]});
function crc32(buf){let c=0xffffffff;for(const b of buf){c^=b;for(let n=0;n<8;n++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function chunk(name,b){const t=Buffer.from(name),n=Buffer.alloc(4),crc=Buffer.alloc(4);n.writeUInt32BE(b.length);crc.writeUInt32BE(crc32(Buffer.concat([t,b])));return Buffer.concat([n,t,b,crc]);}
function png(width,height){const head=Buffer.alloc(13);head.writeUInt32BE(width,0);head.writeUInt32BE(height,4);head[8]=8;head[9]=6;const pixels=Buffer.alloc((width*4+1)*height);for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=y*(width*4+1)+1+x*4;pixels[i]=y<height/3?220:40;pixels[i+1]=y>height*2/3?200:80;pixels[i+2]=130;pixels[i+3]=255;}return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',head),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);}
const picture=png(300,900);let uploads=0;
const images=new Map();
const server=createServer(async(req,res)=>{
 if(req.url?.startsWith('/api/character-media/')){res.setHeader('Content-Type','image/png');res.end(picture);return;}
 if(req.method==='POST'&&req.url?.endsWith('/images')){let text='';for await(const part of req)text+=part;const body=JSON.parse(text);assert.ok(body.dataUrl.length<=262144);assert.match(body.dataUrl,/^data:image\/(webp|jpeg);base64,/);const id=`00000000-0000-4000-8000-${String(++uploads).padStart(12,'0')}`;images.set(id,body.dataUrl);res.setHeader('Content-Type','application/json');res.end(JSON.stringify({mediaId:id}));return;}
 res.setHeader('Content-Type','text/html');res.end(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;padding:12px;background:#08131f;color:#e8f1fc;font-family:Arial;box-sizing:border-box}*{box-sizing:border-box}${css.join('\n')}</style></head><body><div id="app"></div><script>${bundle.outputFiles[0].text}</script></body></html>`);
});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 if(process.env.TUC_OFFLINE_BROWSER==='1'){
   // Offline component harness: fulfill synthetic URLs locally, never contact a service.
   await page.route('https://character-test.invalid/**',async route=>{
     if(route.request().method()==='OPTIONS'){await route.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-methods':'POST,GET,OPTIONS','access-control-allow-headers':'content-type'}});return;}
     if(route.request().method()==='POST'){
       const body=route.request().postDataJSON();assert.ok(body.dataUrl.length<=262144);
       const id=`00000000-0000-4000-8000-${String(++uploads).padStart(12,'0')}`;images.set(id,body.dataUrl);
       await route.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({mediaId:id})});
     }else await route.fulfill({contentType:'image/png',body:picture});
   });
   await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><base href="https://character-test.invalid/"><style>body{margin:0;padding:12px;background:#08131f;color:#e8f1fc;font-family:Arial;box-sizing:border-box}*{box-sizing:border-box}${css.join('\n')}</style></head><body><div id="app"></div><script>${bundle.outputFiles[0].text}</script></body></html>`);
 }else await page.goto(`http://127.0.0.1:${server.address().port}`);
 const data=structuredClone(fixture.characterData);data.identity.portraitDataUrl='data:image/png;base64,'+picture.toString('base64');data.identity.portraitName='Portrait initial';
 data.truth.nature='vampire';data.truth.choices={court:truth.structure.natures.vampire.choices[0].options[0].id,blood:'sang_ardent'};
 data.appearances={reality:[{mediaId:'22222222-2222-4222-8222-222222222222',label:'DJ masqué'}],truth:[{mediaId:'33333333-3333-4333-8333-333333333333',label:'Vraie apparence'}],primaryReality:'legacy',primaryTruth:'33333333-3333-4333-8333-333333333333'};
 const core={rules:fixture.rules,lore:fixture.lore,edgeRules:fixture.edgeRules,disadvantages:{common:[],attribute:[],sphere:{}},talentChoiceSpecs:{},skillTalentMap:{}};
 const start=async(mode,d=data)=>{await page.evaluate(({mode,data,core,truth,reality})=>window.start(mode,data,core,truth,reality),{mode,data:d,core,truth,reality:fixture.realityRules});};
 await start('summary');await page.locator('[data-truth-choice="court"]').waitFor();assert.match(await page.locator('[data-truth-choice="blood"]').innerText(),/Ardent/);
 assert.equal(await page.locator('[data-gallery="truth"] img').count(),1);
 assert.equal(await page.locator('[data-gallery="reality"] .gallery-image').count(),2);
 await mkdir('/tmp/tuc-evolution-shots',{recursive:true});
 for(const width of [320,390,1440]){await page.setViewportSize({width,height:1000});await page.screenshot({path:`/tmp/tuc-evolution-shots/truth-${width}.png`,fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');assert.equal(await page.locator('.sheet-portrait').evaluate(el=>getComputedStyle(el).objectFit),'contain');}
 await page.locator('[data-gallery="truth"] .gallery-image').click();assert.equal(await page.locator('dialog[open]').count(),1);await page.locator('dialog[open] button').click();assert.equal(await page.locator('dialog[open]').count(),0);
 await start('edit');const originalTruth=JSON.stringify(data.appearances.truth);
 await page.locator('[data-gallery="reality"] input[type=file]').setInputFiles([{name:'Travail.png',mimeType:'image/png',buffer:picture},{name:'Soirée.png',mimeType:'image/png',buffer:png(900,300)}]);
 await page.waitForFunction(()=>window.current().appearances.reality.length===3);
 const real=page.locator('[data-gallery="reality"]');await real.getByLabel('Nom de l’apparence').last().fill('DJ de nuit');await real.getByLabel('Nom de l’apparence').last().blur();
 await real.getByRole('button',{name:'Définir principale'}).last().click();await page.waitForFunction(()=>window.current().appearances.primaryReality.endsWith('000000000002'));
 assert.equal(await page.evaluate(()=>JSON.stringify(window.current().appearances.truth)),originalTruth);
 page.once('dialog',d=>d.dismiss());await real.getByRole('button',{name:'Retirer',exact:true}).first().click();assert.equal((await page.evaluate(()=>window.current())).appearances.reality.length,3);
 page.once('dialog',d=>d.accept());await real.getByRole('button',{name:'Retirer',exact:true}).first().click();await page.waitForFunction(()=>window.current().appearances.reality.length===2);
 const saved=await page.evaluate(()=>window.current());await start('summary',saved);assert.equal(await page.locator('[data-gallery="truth"] .gallery-image').count(),1);assert.equal(await page.locator('[data-gallery="reality"] .gallery-image').count(),3);
 assert.deepEqual(errors,[]);console.log('CHARACTER EVOLUTION BROWSER OK — Vampire court/blood and Truth image; 320/390/1440px, full uncropped portraits and zoom; actual multi-upload/compression, rename, primary, cancel/delete, cross-gallery isolation and saved reload');
}finally{await browser.close();await new Promise(r=>server.close(r));}
