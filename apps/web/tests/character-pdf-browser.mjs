import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {PDFDocument,PDFName} from 'pdf-lib';
import {chromium} from 'playwright-core';

const base=process.env.TUC_PDF_BROWSER_BASE_URL||'http://127.0.0.1:4173';
const executablePath=process.env.CHROME_BIN;
assert.ok(executablePath,'CHROME_BIN is required');
const root=new URL('../',import.meta.url),cache=new URL('../node_modules/.cache/pdf-browser/',import.meta.url);
await mkdir(cache,{recursive:true});
const source=await readFile(new URL('./builder-v2-smoke.mjs',import.meta.url),'utf8');
const fixtures=source.slice(source.indexOf('const skillIds='),source.indexOf('const browser='));
const bundle=new URL('fixtures.mjs',cache);
await build({stdin:{resolveDir:fileURLToPath(root),loader:'ts',contents:`
import {terraUmbraTruthRules as canon} from '../api/src/rules/truth/rules';
${fixtures}
export {canon,characterData,rules,lore,edgeRules,realityRules};
`},bundle:true,packages:'external',outfile:fileURLToPath(bundle),format:'esm',platform:'node'});
const {canon,characterData,rules,lore,edgeRules,realityRules}=await import(bundle.href);
const fixtureBefore=JSON.stringify(characterData);
const creation={rules,lore,edgeRules,talentChoiceSpecs:{},skillTalentMap:{expertise_smoke:'athletisme'},disadvantages:{common:[],attribute:[],sphere:{crawler:[]}},disadvantageLore:{}};
const manifest=JSON.parse(await readFile(new URL('public/pdf/dossiers/manifest.json',root),'utf8'));
const red=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAFElEQVR4nGP8ICfynwEJMCFzQGwAQ2QCJdp9J7kAAAAASUVORK5CYII=','base64');
const blue=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAYAAACk7+45AAAAFklEQVR4nGPk0vi6ioGBgYEJRGBnAAA8NwHZe1iEyAAAAABJRU5ErkJggg==','base64');
const characterId='11111111-1111-4111-8111-111111111111';
const realityId='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',truthId='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox']});
const context=await browser.newContext({acceptDownloads:true,serviceWorkers:'block'});
const page=await context.newPage(),errors=[],writes=[];
page.on('pageerror',error=>errors.push(String(error)));
context.on('page',opened=>opened.on('pageerror',error=>errors.push(String(error))));
await context.addInitScript(()=>{window.print=()=>{};});
let current;
await context.route('**/api/**',async route=>{
  const request=route.request(),path=new URL(request.url()).pathname;
  if(!path.startsWith('/api/'))return route.continue();
  if(!['GET','HEAD'].includes(request.method())){writes.push(request.method()+' '+path);return route.abort('blockedbyclient');}
  const json=value=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(value)});
  if(path===`/api/characters/${characterId}/sheet`)return json({character:{id:characterId,name:'PDF Browser '+current.truth.nature,data:current,version:1,createdAt:'2026-10-22T00:00:00Z',updatedAt:'2026-10-22T00:00:00Z'},canEdit:true,ownerName:'Compte de test'});
  if(path===`/api/characters/${characterId}`)return json({character:{id:characterId,name:'PDF Browser '+current.truth.nature,data:current,version:1,createdAt:'2026-10-22T00:00:00Z',updatedAt:'2026-10-22T00:00:00Z'}});
  if(path==='/api/rulesets/terra-umbra/creation')return json(creation);
  if(path==='/api/rulesets/terra-umbra/truth')return json(canon);
  if(path==='/api/rulesets/terra-umbra/reality')return json(realityRules);
  if(path==='/api/auth/me')return json({user:{id:'pdf-user',displayName:'PDF Test',email:'pdf@example.invalid',role:'player'}});
  if(path==='/api/auth/setup-status')return json({setupRequired:false});
  if(path==='/api/auth/capabilities')return json({passwordResetAvailable:false});
  if(path==='/api/auth/gm-request')return json({request:null});
  if(path===`/api/character-media/${realityId}`)return route.fulfill({status:200,contentType:'image/png',body:red});
  if(path===`/api/character-media/${truthId}`)return route.fulfill({status:200,contentType:'image/png',body:blue});
  return json({items:[],accounts:[],readers:[],entries:[],campaigns:[],characters:[],total:0,user:null});
});
const imageCount=(doc,index)=>doc.getPage(index).node.Resources().lookup(PDFName.of('XObject')).keys().length;
async function loadRegressionPage(suffix,ready){
  const target=await context.newPage();
  await target.goto(`${base}/characters/${characterId}/${suffix}`,{waitUntil:'networkidle'});
  await target.locator(ready).waitFor({timeout:30000});
  await target.getByRole('button',{name:'Exporter la fiche de personnage en PDF',exact:true}).waitFor({timeout:30000});
  return target;
}
async function downloadPdf(target,locator,name){
  const pending=target.waitForEvent('download',{timeout:120000});
  await locator.click();
  const download=await pending;
  assert.equal(await download.failure(),null);
  const bytes=await readFile(await download.path());
  await writeFile(new URL(name+'.pdf',cache),bytes);
  return PDFDocument.load(bytes);
}
async function checkRegressionExport(target,name,expectedName,expectedPv,expectedXp){
  const doc=await downloadPdf(target,target.getByRole('button',{name:'Exporter la fiche de personnage en PDF',exact:true}),name);
  const form=doc.getForm();
  assert.ok(doc.getPageCount()>=8,'Regression export retains the complete eight-page Nature pack');
  assert.ok(form.getFields().length>manifest.fields.angelus.length,'Long notes retain editable continuations');
  assert.equal(form.getTextField('reality.nom').getText(),expectedName);
  assert.equal(form.getTextField('truth.identity.name').getText(),expectedName);
  assert.equal(form.getTextField('reality.pv_max').getText(),String(expectedPv));
  assert.match(form.getTextField('reality.xp.summary').getText(),new RegExp(`XP disponibles\\s*:\\s*${expectedXp}(?:\\s|/|$)`));
  assert.equal(form.getTextField('reality.pv_actuels').getText()??'','');
  assert.equal(form.getCheckBox('truth.state.V').isChecked(),false);
  assert.ok(form.getFields().some(field=>field.getName().startsWith('annex.')),'Long biography is retained beyond the pack');
  assert.equal(await target.locator('.character-pdf-actions [role=alert]').count(),0);
  return doc;
}
try{
  for(const nature of ['daemon','mage']){
    current=structuredClone(characterData);
    current.identity={...current.identity,firstName:'Éloïse',name:'PDF Browser '+nature,notes:'Biographie et données de test uniquement.',portraitDataUrl:''};
    current.truth={...current.truth,nature,consciousness:'initie',choices:{},truthTalents:[],corruptionTalents:[]};
    current.appearances={reality:[{mediaId:realityId,label:'Voilé'}],truth:[{mediaId:truthId,label:'Révélé'}],primaryReality:realityId,primaryTruth:truthId};
    for(const choice of canon.structure.natures[nature].choices){
      const options=choice.optionsBy?choice.optionsBy[current.truth.choices[choice.dependsOn]]??[]:choice.options??[];
      current.truth.choices[choice.key]=(options.find(option=>option.id!=='aucune')??options[0])?.id??'';
    }
    const savedBefore=JSON.stringify(current);
    await page.goto(`${base}/characters/${characterId}/${nature==='mage'?'builder':'sheet'}`,{waitUntil:'networkidle'});
    const button=page.getByRole('button',{name:'Exporter la fiche de personnage en PDF',exact:true});
    await button.waitFor({timeout:20000});
    if(nature==='mage'){
      await page.locator('.builder-nav').getByRole('button',{name:/Identité/}).click();
      await page.locator('.identity-grid input').nth(1).fill('Brouillon non enregistré');
    }
    const downloadPromise=page.waitForEvent('download',{timeout:120000});
    await button.click();
    const download=await downloadPromise,bytes=await readFile(await download.path());
    const doc=await PDFDocument.load(bytes),form=doc.getForm();
    assert.equal(doc.getPageCount(),8,'A normal character fits the eight-page pack without unnecessary annexes');
    assert.ok(form.getFields().length>=manifest.fields[nature].length,'Worker output remains editable');
    assert.match(form.getTextField('reality.nom').getText(),nature==='mage'?/Brouillon non enregistré/:/Éloïse/);
    assert.equal(form.getTextField('reality.pugilat').getText(),'0','Small R1 statistics stay visible in their original field');
    assert.equal(form.getTextField('reality.pv_actuels').getText()??'','','Unknown current HP are not invented');
    if(nature==='mage')assert.equal(form.getCheckBox('truth.mage.affinities.01.dominant').isChecked(),true);
    const blank=await PDFDocument.load(await readFile(new URL('public/pdf/dossiers/'+manifest.templates[nature].colour,root)));
    assert.equal(imageCount(doc,0),imageCount(blank,0)+1,'Reality gallery portrait is embedded in the worker');
    assert.equal(imageCount(doc,2),imageCount(blank,2)+1,'Distinct truth gallery portrait is embedded in the worker');
    await writeFile(new URL(nature+'-browser.pdf',cache),bytes);
    console.log('Browser PDF verified:',nature,doc.getPageCount(),'pages');
    assert.equal(await page.getByRole('alert').count(),0);
    if(nature==='mage'){
      const popupPromise=page.waitForEvent('popup');
      await page.getByRole('button',{name:'Imprimer la fiche de personnage',exact:true}).click();
      const popup=await popupPromise;
      await popup.getByRole('link',{name:'Télécharger le PDF d’impression'}).waitFor({timeout:120000});
      const printPromise=popup.waitForEvent('download',{timeout:20000});
      await popup.getByRole('link',{name:'Télécharger le PDF d’impression'}).click();
      const print=await printPromise,printed=await PDFDocument.load(await readFile(await print.path()));
      assert.equal(printed.catalog.has(PDFName.of('AcroForm')),false);
      assert.equal(printed.getForm().getFields().length,0,'Only the print copy is flattened');
      assert.ok(printed.getPageCount()>=8);
      await popup.close();
    }
    assert.equal(JSON.stringify(current),savedBefore,'Export and printing do not mutate the saved fixture');
  }
  current=structuredClone(characterData);
  current.identity={...current.identity,firstName:'Sauvee',name:'Fiche',alias:'',notes:'Texte long conserve dans les annexes. '.repeat(120),portraitDataUrl:''};
  current.truth={...current.truth,nature:'angelus',consciousness:'initie',choices:{angelNature:'trone',sephirah:'kether',archangel:'remiel',seraph:'purim'},truthTalents:[],corruptionTalents:[]};
  current.progression={xpEarned:100,ptvEarned:8,attributeRanks:{vigueur:1},skillRanks:{constitution:1},realityTalents:[],truthTalents:[],corruptionTalents:[],cashBase:100,cashTransactions:[]};
  const savedBefore=JSON.stringify(current);
  const builder=await loadRegressionPage('builder','.builder-workspace');
  await builder.locator('.builder-nav').getByRole('button',{name:/Identité/}).click();
  await builder.locator('.identity-grid input').nth(0).fill('Brouillon');
  await builder.locator('.identity-grid input').nth(1).fill('Éléonore');
  await checkRegressionExport(builder,'builder-regression','Éléonore Brouillon',6,0);
  assert.match(await builder.locator('.character-pdf-actions [role=status]').innerText(),/non enregistrés/);
  const progression=await loadRegressionPage('progression','.progression-step');
  const xp=progression.getByLabel('XP reçus depuis la création',{exact:true});
  await xp.fill('160');await xp.blur();
  await checkRegressionExport(progression,'progression-regression','Sauvee Fiche',9,145);
  const sheet=await loadRegressionPage('sheet','.character-sheet');
  await checkRegressionExport(sheet,'sheet-regression','Sauvee Fiche',9,85);
  assert.equal(JSON.stringify(current),savedBefore,'Unsaved Builder and XP drafts do not mutate the saved character fixture');
  console.log('Browser regressions verified: unsaved progression 160 XP versus saved 100 XP, creation versus campaign HP, immutable fixtures');
  await sheet.evaluate(()=>{window.open=()=>null;});
  await sheet.getByRole('button',{name:'Imprimer la fiche de personnage',exact:true}).click();
  await sheet.getByText(/La fenêtre a été bloquée/).waitFor({timeout:120000});
  const fallback=await downloadPdf(sheet,sheet.getByRole('link',{name:'Télécharger le dernier PDF préparé',exact:true}),'print-blocked-fallback');
  assert.equal(fallback.getForm().getFields().length,0,'Blocked-popup fallback downloads the flattened print PDF');
  assert.ok(fallback.getPageCount()>=8);
  await context.route('**/pdf/dossiers/*.pdf',route=>route.fulfill({status:404,contentType:'text/plain',body:'unavailable test asset'}));
  await sheet.getByRole('button',{name:'Exporter la fiche de personnage en PDF',exact:true}).click();
  await sheet.locator('.character-pdf-actions [role=alert]').getByText(/indisponible/).waitFor({timeout:30000});
  assert.equal(await sheet.getByRole('button',{name:'Exporter la fiche de personnage en PDF',exact:true}).isEnabled(),true);
  await context.unroute('**/pdf/dossiers/*.pdf');
  await checkRegressionExport(sheet,'sheet-recovered','Sauvee Fiche',9,85);
  console.log('Browser regressions verified: blocked-popup fallback, readable PDF 404, successful retry');
  for(const target of [page,builder,progression,sheet]){
    await target.setViewportSize({width:320,height:900});
    const bounds=await target.locator('.character-pdf-actions').evaluate(node=>({left:node.getBoundingClientRect().left,right:node.getBoundingClientRect().right,viewport:document.documentElement.clientWidth}));
    assert.ok(bounds.left>=-1&&bounds.right<=bounds.viewport+1,'PDF controls fit a 320px viewport');
  }
  assert.equal(JSON.stringify(current),savedBefore,'Failure recovery and printing do not mutate the saved fixture');
  assert.equal(JSON.stringify(characterData),fixtureBefore,'The shared baseline fixture remains unchanged');
  assert.deepEqual(writes,[],'Browser proof does not write to an account, character or campaign');
  assert.deepEqual(errors,[]);
  console.log('PDF BROWSER OK — real worker, two Nature packs, independent portraits, eight-page normal packs, unsaved Builder and progression, saved sheet, flattened print, blocked-popup fallback, PDF404 recovery, 320px controls, immutable fixtures and no account writes');
}finally{
  await context.close();
  await browser.close();
}
