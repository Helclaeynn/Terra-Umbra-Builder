import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {PDFDocument,PDFName,PDFTextField,PDFCheckBox,layoutMultilineText,TextAlignment} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('./builder-v2-smoke.mjs',import.meta.url),'utf8');
const fixtures=source.slice(source.indexOf('const skillIds='),source.indexOf('const browser='));
const cache=new URL('../node_modules/.cache/pdf-check/',import.meta.url);await mkdir(cache,{recursive:true});
const bundle=new URL('check.mjs',cache);
await build({stdin:{resolveDir:fileURLToPath(root),loader:'ts',contents:`
import {dossierSlug,projectCharacterPdf,pdfTalentEffect} from './src/lib/character-pdf-model';
import {fillDossierPdf,fitPdfText} from './src/lib/character-pdf';
import {terraUmbraTruthRules as canon} from '../api/src/rules/truth/rules';
import {truthAvailableTalents,truthAngelusCapacity} from './src/lib/truth';
${fixtures}
export const core={rules,lore,talentChoiceSpecs:{},skillTalentMap:{expertise_smoke:'athletisme'},disadvantages:{common:[],attribute:[],sphere:{crawler:[]}},edgeRules};
export {dossierSlug,projectCharacterPdf,pdfTalentEffect,fillDossierPdf,fitPdfText,characterData,realityRules,canon,truthAvailableTalents,truthAngelusCapacity};
`},bundle:true,packages:'external',outfile:fileURLToPath(bundle),format:'esm',platform:'node'});
const {dossierSlug,projectCharacterPdf,pdfTalentEffect,fillDossierPdf,fitPdfText,characterData,realityRules,canon,core,truthAvailableTalents,truthAngelusCapacity}=await import(bundle.href);
const manifest=JSON.parse(await readFile(new URL('public/pdf/dossiers/manifest.json',root),'utf8'));
const specsFor=slug=>manifest.schemaVersion===2?manifest.fields[slug]:[...manifest.fields.realite,...(slug==='realite'?[]:manifest.fields[slug])];
assert.equal(manifest.schemaVersion,2);
const checksums=JSON.parse(await readFile(new URL('public/pdf/dossiers/packs-sha256.json',root),'utf8'));
for(const [slug,template] of Object.entries(manifest.templates)){
  const specs=specsFor(slug),bytes=await readFile(new URL('public/pdf/dossiers/'+template.colour,root));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),checksums[template.colour],slug+' approved PDF checksum');
  const doc=await PDFDocument.load(bytes),fields=doc.getForm().getFields();
  assert.equal(doc.getPageCount(),slug==='realite'?2:8);
  assert.equal(fields.length,specs.length,slug+' complete canonical field tree');
  assert.equal(new Set(fields.map(field=>field.getName())).size,fields.length,slug+' unique fields');
  for(const spec of specs){
    const field=fields.find(field=>field.getName()===spec.name);
    assert.ok(field,slug+' '+spec.name);
    assert.equal(field instanceof PDFTextField,spec.type==='text');
    if(field instanceof PDFTextField){assert.equal(field.getText()??'','');assert.equal(field.isMultiline(),spec.multiline);}
    if(field instanceof PDFCheckBox)assert.equal(field.isChecked(),false);
    const widgets=field.acroField.getWidgets();assert.equal(widgets.length,1);
    const rect=widgets[0].getRectangle();
    for(const [key,index] of [['x',0],['y',1],['width',2],['height',3]])assert.ok(Math.abs(rect[key]-spec.rect[index])<.001,slug+' '+spec.name+' '+key);
    if(spec.page>0&&spec.type==='text')assert.ok(spec.fontSize>=9.5,slug+' readable new fields');
  }
  assert.equal(specs.filter(spec=>/^reality\.talents\.\d+\.detail$/.test(spec.name)).length,8);
  if(slug!=='realite'){
    assert.equal(specs.filter(spec=>/^truth\.powers\.\d+\.access$/.test(spec.name)).length,6);
    assert.equal(specs.filter(spec=>spec.name.startsWith('bg.')).length,8);
    assert.ok(specs.every(spec=>spec.page<6),'Reference aid is not another character form');
    assert.deepEqual(template.portraitAreas.map(area=>[area.layer,area.page]),[['reality',0],['truth',2]]);
  }
}
const font=new Uint8Array(await readFile(new URL('public/pdf/fonts/DejaVuSans.ttf',root)));
const fontDoc=await PDFDocument.create();fontDoc.registerFontkit(fontkit);const metricFont=await fontDoc.embedFont(font);
const withoutSpacing=value=>value.replace(/[\s…]/gu,'');
for(const content of ['Écho : effet réel, coûts et limites. '.repeat(70),'ABCDEFGHIJKLMN'.repeat(50),'Ligne une\n\nLigne deux : Ω et Æ\nFin.']){
  for(const [width,height,multiline] of [[63,20,false],[130,40,true],[250,58,true],[530,350,true]]){
    const result=fitPdfText(content,metricFont,9.5,width,height,multiline,1.4);
    assert.equal(withoutSpacing(result.text+result.remaining),withoutSpacing(content),'Visible text plus continuation retains every character');
  }
}
function assertVisibleMultiline(form){
  for(const field of form.getFields()){
    if(!(field instanceof PDFTextField)||!field.isMultiline()||!field.getText())continue;
    const rect=field.acroField.getWidgets()[0].getRectangle();
    const size=Number(field.acroField.getDefaultAppearance().match(/([\d.]+) Tf/)?.[1]);
    const border=field.getName().startsWith('annex.')?.5:0,padding=border+1;
    const layout=layoutMultilineText(field.getText(),{alignment:TextAlignment.Left,fontSize:size,font:metricFont,bounds:{x:padding,y:padding,width:rect.width-padding*2,height:rect.height-padding*2}});
    const descent=metricFont.heightAtSize(size)-metricFont.heightAtSize(size,{descender:false});
    assert.ok(layout.lines.every(line=>line.y>=padding+descent-0.01),`${field.getName()}: the final line including descenders must remain visible`);
  }
}
const tests=[['humain',{},'profane','realite'],['humain',{},'initie','realite'],['humain',{hunterTradition:'association'},'initie','chasseur'],
...['angelus','vampire','mage','daemon','aseryn','garou','khinae'].map(n=>[n,{},'initie',n]),
...['elye','whurten','ashyll','thulkar','azmenorien'].map(n=>['exile',{people:n},'initie',n]),
...['talass','mosen','baseanh','rocreen','thalsios','homo_superior','adrak'].map(n=>['extral',{species:n},'initie',n.replace('_','-')])];
assert.equal(pdfTalentEffect('Bouches sans fondProfil: DON · PassifLe porteur est affamé.','Bouches sans fond'),'Profil: DON · Passif\nLe porteur est affamé.');
assert.deepEqual(truthAngelusCapacity({nature:'angelus',truthTalents:[]},2),{rank:'angelus',maximum:5});
assert.deepEqual(truthAngelusCapacity({nature:'angelus',truthTalents:['nature_commune_pouvoirs_angeliques_talents_communs_reserve_transcendee']},5),{rank:'angelus',maximum:10});
assert.deepEqual(truthAngelusCapacity({nature:'angelus',truthTalents:['progression_de_transcendance_transcendance_cherubique','nature_commune_pouvoirs_angeliques_talents_communs_reserve_transcendee']},9),{rank:'cherub',maximum:12});
for(const [nature,choices,consciousness,slug] of tests)assert.equal(dossierSlug({nature,choices,consciousness}),slug);
assert.throws(()=>dossierSlug({nature:'exile',choices:{}}),/peuple/);
assert.throws(()=>dossierSlug({nature:'extral',choices:{species:'missing'}}),/profil/);
assert.throws(()=>dossierSlug({nature:'invented'}),/Nature/);
{
 const data=structuredClone(characterData),id=canon.catalogs.humain.find(t=>t.name==='Pacte du Djinn').id;
 data.truth={...data.truth,nature:'humain',consciousness:'initie',choices:{hunterTradition:'aucune',hunterBuild:{doctrines:['nizarite'],records:{[id]:{reference:'Djinn existant',agreement:'Accord réel',profile:'Souffle',limits:'PA du maître'}}}},truthTalents:[]};
 data.progression={...data.progression,truthTalents:[id]};
 const fields=new Set(specsFor('chasseur').map(f=>f.name));
 const model=projectCharacterPdf({data,core,truth:canon,reality:realityRules,campaign:true},fields);
 const allText=Object.values(model.values).join('\n')+'\n'+model.annex.map(entry=>entry.title+'\n'+entry.text).join('\n');
 assert.equal(model.slug,'chasseur');assert.match(allText,/Djinn existant/,'Readable permanent hunter reference in actual PDF projection');
 assert.match(allText,/Nizarites/);
 assert.ok(!model.annex.some(a=>a.title==='hunterBuild'),'No raw hunter JSON in PDF');
}
for(const slug of Object.keys(manifest.templates)){
  const data=structuredClone(characterData),row=tests.find(t=>t[3]===slug);
  data.truth={...data.truth,nature:row[0],choices:{...row[1]},consciousness:row[2],truthTalents:[],corruptionTalents:[]};
  const nature=canon.structure.natures[data.truth.nature];
  for(const choice of nature.choices){
    const options=choice.optionsBy?choice.optionsBy[data.truth.choices[choice.dependsOn]]??[]:choice.options??[];
    if(!data.truth.choices[choice.key])data.truth.choices[choice.key]=(options.find(o=>o.id!=='aucune')??options[0])?.id??'';
  }
  data.identity.firstName='Éloïse';data.identity.name='D’Œuvre';data.identity.alias='La lumière';
  data.identity.notes='Texte de contrôle à conserver. '.repeat(180);
  data.identity.portraitDataUrl='';
  data.progression={xpEarned:100,ptvEarned:8,attributeRanks:{vigueur:1},skillRanks:{constitution:1},realityTalents:[],truthTalents:[],corruptionTalents:[],cashBase:100,cashTransactions:[]};
  const specs=specsFor(slug);
  const input={data,core,truth:canon,reality:realityRules,campaign:true};
  const before=JSON.stringify(input),model=projectCharacterPdf(input,new Set(specs.map(s=>s.name)));
  assert.equal(JSON.stringify(input),before,'PDF projection never changes the draft');
  assert.equal(model.slug,slug);assert.equal(model.values['reality.nom'],'Éloïse D’Œuvre « La lumière »');
  for(const key of ['reality.pv_actuels','reality.pa_1','truth.state.V','truth.molts'])assert.equal(model.values[key],undefined,'Unknown session values remain empty');
  assert.equal(model.values['reality.pv_max'],'9');
  const creation=projectCharacterPdf({...input,campaign:false},new Set(specs.map(s=>s.name)));
  assert.equal(creation.values['reality.pv_max'],'6');assert.match(creation.values['reality.xp.summary'],/0/);
  if(slug==='angelus'){assert.match(model.values['truth.angelus.primaryNatureLabel'],/Tr[oô]ne/i);assert.ok(model.values['truth.angelus.gift.sephira.effect']);assert.ok(model.values['truth.angelus.natureGift']);}
  if(slug==='mage'){assert.ok(model.values['truth.mage.type']);assert.ok(model.values['truth.mage.affinities.01.name']);assert.equal(model.values['truth.mage.affinities.01.dominant'],true);}
  if(slug==='daemon'){assert.match(model.values['truth.daemon.functionLabel'],/Oracle/i);assert.ok(model.values['truth.daemon.imprint.effect']);}
  const template=manifest.templates[slug];
  const bytes=new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+template.colour,root)));
  const result=await fillDossierPdf(bytes,font,model,template.pages,specs,false,template.portraitAreas);
  const pdf=await PDFDocument.load(result.bytes),form=pdf.getForm();
  assertVisibleMultiline(form);
  assert.ok(result.annexPages>0,'Long information produces annex pages');
  assert.ok(form.getFields().length>specs.length,'Annexes remain editable');
  assert.ok(form.getTextField('reality.nom').getText().includes('Éloïse'));
  for(const key of ['reality.constitution','reality.perception','reality.pugilat','reality.vigueur','reality.defense_physique'])assert.equal(form.getTextField(key).getText(),model.values[key],key+' stays in its original action field');
  assert.ok(form.getFields().some(f=>f.getName().startsWith('annex.')));
  assert.ok(!form.getTextField('reality.pv_actuels').getText());
  await writeFile(new URL(slug+'-filled.pdf',cache),result.bytes);
  if(slug==='angelus'){
    const printTemplate=new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+template.print,root)));
    // A newly opened print window backgrounds the source tab. Each pdf-lib
    // yield would then be subject to background timer throttling in Chrome.
    const originalTimeout=globalThis.setTimeout;let timerYields=0,print;
    globalThis.setTimeout=(callback,delay,...args)=>{if(!delay)timerYields++;return originalTimeout(callback,delay,...args);};
    try{print=await fillDossierPdf(printTemplate,font,model,template.pages,specs,true,template.portraitAreas);}
    finally{globalThis.setTimeout=originalTimeout;}
    assert.equal(timerYields,0,'Print generation must not wait on throttled background timers');
    const printed=await PDFDocument.load(print.bytes);
    assert.equal(printed.catalog.has(PDFName.of('AcroForm')),false,'Print copy has no remaining AcroForm tree');
    for(const page of printed.getPages())for(const reference of page.node.Annots()?.asArray()??[]){
      const annotation=printed.context.lookup(reference);
      assert.ok(annotation,'Print pages contain no dangling annotation references');
      assert.notEqual(annotation.get(PDFName.of('Subtype'))?.toString(),'/Widget','Print pages contain no residual widgets');
    }
    assert.equal(printed.getForm().getFields().length,0,'Only print copy is flattened');
    await writeFile(new URL('angelus-print.pdf',cache),print.bytes);
  }
}
for(const slug of ['realite','angelus','mage','garou','homo-superior']){
  const data=structuredClone(characterData),row=tests.find(t=>t[3]===slug);
  data.truth={...data.truth,nature:row[0],choices:{...row[1]},consciousness:'initie',truthTalents:[],corruptionTalents:[],corruption:0};
  const nature=canon.structure.natures[data.truth.nature];
  for(const choice of nature.choices){const options=choice.optionsBy?choice.optionsBy[data.truth.choices[choice.dependsOn]]??[]:choice.options??[];if(!data.truth.choices[choice.key])data.truth.choices[choice.key]=(options.find(o=>o.id!=='aucune')??options[0])?.id??'';}
  if(slug==='realite')data.truth.choices.hunterTradition='aucune';
  if(slug==='garou')data.truth.choices.blood='sang_enchaine';
  if(slug==='mage'){
    const affinity=canon.structure.natures.mage.choices.find(c=>c.key==='dominantAffinity');
    const natives=affinity.optionsBy[data.truth.choices.mageiusType];
    const foreign=Object.values(affinity.optionsBy).flat().find(a=>!natives.some(n=>n.id===a.id));
    data.truth.truthTalents.push(`mage_awaken_${natives[1].id}`,`mage_${natives[0].id}_mastery_affinee`,...(foreign?[`mage_awaken_${foreign.id}`]:[]));
  }
  const available=truthAvailableTalents(canon,data.truth);
  data.truth.truthTalents=[...new Set([...data.truth.truthTalents,...available.slice(0,12).map(t=>t.id)])];
  if(slug==='homo-superior')data.truth.truthTalents.unshift('extral-phasage-de-l-equipement');
  const don=canon.corruption.talents.find(t=>t.kind==='DON');
  data.truth.corruptionTalents=[don.id];data.truth.corruptionSource=don.sourceId;
  data.identity.firstName='Éloïse';data.identity.name='W'.repeat(70);data.identity.portraitDataUrl='';
  data.progression={xpEarned:120,ptvEarned:60,truthTalents:[],corruptionTalents:[]};
  const rp=structuredClone(realityRules);
  rp.recurring=[{id:'housing-test',name:'Appartement de fonction',category:'Habitation',kind:'equipment'}, {id:'shelter-test',name:'Planque sûre',category:'Refuge',kind:'equipment'}];
  rp.augmentations=[{id:'augment-test',name:'Câblage de contrôle',kind:'augmentation',generation:2,charge:2,stress:1,effect:'Effet de contrôle'}];
  data.reality={fixedChargeItems:[{uid:'home',name:'Appartement de fonction',sourceItemId:'housing-test',monthly:1000},{uid:'shelter',name:'Planque sûre',sourceItemId:'shelter-test',monthly:200}],augmentations:[{uid:'aug',itemId:'augment-test',kind:'augmentation',gen2System:2}],equipment:[]};
  const specs=specsFor(slug);
  const model=projectCharacterPdf({data,core,truth:canon,reality:rp,campaign:true},new Set(specs.map(s=>s.name)));
  assert.match(model.values['reality.resources.compact'],/Appartement de fonction/);assert.match(model.values['reality.resources.compact'],/Planque sûre/);assert.match(model.values['reality.augmentations.compact'],/Système Gen2 2/);
  const allText=Object.values(model.values).join('\n')+'\n'+model.annex.map(s=>s.title+'\n'+s.text).join('\n');
  assert.match(allText,/Dormant/,'Dormant corruption Don remains recorded');
  for(const id of data.truth.truthTalents){const t=available.find(t=>t.id===id);if(t)assert.ok(allText.includes(t.name),'Every acquired talent survives row overflow: '+t.name);}
  if(slug==='garou')assert.match(allText,/forme hybride interdite|Mue hybride interdite/);
  if(slug==='angelus'){assert.match(model.values['truth.angelus.rankLabel'],/Ch[ée]rub/i);assert.equal(model.values['truth.angelus.aura.max'],'7');assert.equal(model.values['truth.angelus.aura.current'],undefined);}
  if(slug==='mage'){assert.equal(model.values['truth.mage.affinities.01.mastery'],'Magistrale','Highest purchased mastery is exported');assert.match(allText,/Acquise/);}
  if(slug==='homo-superior'){assert.match(model.values['truth.powers.01.access'],/Phasage de l’équipement/);assert.match(allText,/chaque soldat/);}
  const template=manifest.templates[slug];
  const result=await fillDossierPdf(new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+template.colour,root))),font,model,template.pages,specs,false,template.portraitAreas);
  assertVisibleMultiline((await PDFDocument.load(result.bytes)).getForm());
  assert.ok(result.annexPages>0);await writeFile(new URL(slug+'-advanced.pdf',cache),result.bytes);
}
{
  const bytes=new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+manifest.templates.realite.colour,root)));
  const portrait='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6lF0AAAAASUVORK5CYII=';
  const model={slug:'realite',name:'Portrait 🙂',portrait,values:{'reality.nom':'Portrait 🙂'},labels:{},annex:[]};
  const result=await fillDossierPdf(bytes,font,model,2,manifest.fields.realite,false,manifest.templates.realite.portraitAreas);
  assert.ok(!result.warnings.some(w=>w.includes('portrait')),'A selected image is embedded');
  assert.ok(result.warnings.some(w=>w.includes('Unicode')),'Unsupported characters are reported with their Unicode code');
  const doc=await PDFDocument.load(result.bytes),before=await PDFDocument.load(bytes);
  const images=d=>d.getPage(0).node.Resources().lookup(PDFName.of('XObject')).keys().length;
  assert.ok(images(doc)>images(before),'Portrait becomes an additional page image');
}
{
  const template=manifest.templates.vampire,specs=specsFor('vampire');
  const bytes=new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+template.colour,root)));
  const base=await PDFDocument.load(bytes);
  const imageCount=(doc,page)=>doc.getPage(page).node.Resources().lookup(PDFName.of('XObject')).keys().length;
  const red='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAFElEQVR4nGP8ICfynwEJMCFzQGwAQ2QCJdp9J7kAAAAASUVORK5CYII=';
  const blue='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAYAAACk7+45AAAAFklEQVR4nGPk0vi6ioGBgYEJRGBnAAA8NwHZe1iEyAAAAABJRU5ErkJggg==';
  const originalFetch=globalThis.fetch,originalLocation=Object.getOwnPropertyDescriptor(globalThis,'location');
  const calls=[];
  Object.defineProperty(globalThis,'location',{configurable:true,value:new URL('https://same-origin.test/sheet')});
  globalThis.fetch=async url=>{
    calls.push(String(url));
    if(url==='https://same-origin.test/unavailable.png')return new Response('',{status:404});
    assert.ok([red,blue].includes(String(url)),'Only permitted portrait URLs may be fetched');
    return new Response(Buffer.from(String(url).split(',')[1],'base64'),{headers:{'content-type':'image/png'}});
  };
  try{
    for(const [label,reality,truth,expectedReality,expectedTruth] of [['both',red,blue,1,1],['truth-only','',blue,0,1],['truth-absent',red,'',1,0],['truth-failed',red,'https://same-origin.test/unavailable.png',1,0],['truth-external',red,'https://outside.invalid/portrait.png',1,0]]){
      calls.length=0;
      const values={'reality.nom':'Portraits indépendants'};
      const projection={slug:'vampire',name:'Portraits indépendants',portrait:reality,portraitReality:reality,portraitTruth:truth,values,fields:values,labels:{},annex:[],annexEntries:[]};
      const result=await fillDossierPdf(bytes,font,projection,8,specs,false,template.portraitAreas);
      const doc=await PDFDocument.load(result.bytes);
      assert.equal(imageCount(doc,0)-imageCount(base,0),expectedReality,label+' reality portrait');
      assert.equal(imageCount(doc,2)-imageCount(base,2),expectedTruth,label+' truth portrait without fallback');
      if(label==='truth-failed'||label==='truth-external')assert.ok(result.warnings.some(warning=>warning.includes('Vérité')));
      if(label==='truth-external')assert.ok(!calls.some(url=>url.includes('outside.invalid')));
      if(label==='both')await writeFile(new URL('dual-portraits.pdf',cache),result.bytes);
    }
  }finally{
    globalThis.fetch=originalFetch;
    if(originalLocation)Object.defineProperty(globalThis,'location',originalLocation);else delete globalThis.location;
  }
}
{
  const template=manifest.templates.vampire,specs=specsFor('vampire');
  const bytes=new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+template.colour,root)));
  const supplementBytes=new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+manifest.supplement.file,root)));
  const values={'bg.history.01':'Une histoire longue à conserver intégralement. '.repeat(180),'bg.history.02':'BG02-DO-NOT-OVERWRITE'};
  for(let index=1;index<=8;index++)values[`reality.talents.${String(index).padStart(2,'0')}.detail`]=`Talent de Réalité ${index}`;
  for(let index=1;index<=6;index++){
    values[`truth.powers.${String(index).padStart(2,'0')}.access`]=`Capacité ${index} - 1 PTV - SR/R`;
    values[`truth.powers.${String(index).padStart(2,'0')}.effect`]=`Effet court ${index}, sans avantage supplémentaire.`;
  }
  const entries=Array.from({length:14},(_,offset)=>{
    const number=String(offset+7).padStart(2,'0');
    return {fieldName:`truth.powers.${number}.effect`,title:`Capacité ${number}`,text:`QUEUE_${number} - Source acquise - 1 PTV - SR/R${offset===0?' - Dormant':''}\nEffet réel ${number}, durée et limite spécifiques.`};
  });
  let loads=0;
  const supplement={pages:manifest.supplement.pages,fields:manifest.supplement.fields,load:async()=>{loads++;return supplementBytes;}};
  const model={slug:'vampire',name:'Progression sans plafond',portrait:'',portraitReality:'',portraitTruth:'',values,fields:values,labels:{},annex:entries.map(({title,text})=>({title,text})),annexEntries:entries};
  const result=await fillDossierPdf(bytes,font,model,8,specs,false,template.portraitAreas,supplement);
  const doc=await PDFDocument.load(result.bytes),form=doc.getForm(),fields=form.getFields();
  const allValues=fields.filter(field=>field instanceof PDFTextField).map(field=>field.getText()??'').join('\n');
  assert.equal(loads,1,'Supplement PDF is fetched once, only when needed');
  assert.equal(form.getTextField('bg.history.02').getText(),'BG02-DO-NOT-OVERWRITE');
  assert.equal(new Set(fields.map(field=>field.getName())).size,fields.length,'Each copied supplement has independent canonical fields');
  assert.ok(result.pages>=14&&result.pages%2===0,'Growth uses complete duplex leaves');
  assertVisibleMultiline(form);
  for(let index=7;index<=20;index++){
    const marker=`QUEUE_${String(index).padStart(2,'0')}`;
    assert.equal(allValues.split(marker).length-1,1,marker+' is preserved exactly once');
  }
  assert.match(allValues,/Dormant/,'Dormant acquired powers remain identified beyond the six main cards');
  const access=fields.filter(field=>field instanceof PDFTextField&&field.getName().endsWith('.access')).find(field=>field.getText()?.includes('QUEUE_07'));
  assert.ok(access,'A seventh acquisition is named in its own card, not referred to a nonexistent main slot');
  assert.ok(!access.getText().startsWith('Suite de V2, capacité 07'));
  await writeFile(new URL('progression-20-powers.pdf',cache),result.bytes);
}
const builder=await readFile(new URL('src/pages/CharacterBuilderPage.vue',root),'utf8');
const sheet=await readFile(new URL('src/pages/CharacterSheetPage.vue',root),'utf8');
assert.match(builder,/data:draft\.value/);assert.match(builder,/campaign:progressionMode/);assert.match(builder,/<CharacterPdfActions/);
assert.match(sheet,/<CharacterPdfActions/);
console.log(`PDF EXPORT OK — ${Object.keys(manifest.templates).length} templates, 22 routing cases, current draft / campaign split, Unicode, editable overflow, empty session values, print flattening, advanced purchased talents, dormant corruption, Mage affinities, chained Garou, AIDH phasing, housing and Gen2`);
