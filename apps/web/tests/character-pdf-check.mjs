import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {PDFDocument,PDFName,PDFTextField,layoutMultilineText,TextAlignment} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('./builder-v2-smoke.mjs',import.meta.url),'utf8');
const fixtures=source.slice(source.indexOf('const skillIds='),source.indexOf('const browser='));
const cache=new URL('../node_modules/.cache/pdf-check/',import.meta.url);await mkdir(cache,{recursive:true});
const bundle=new URL('check.mjs',cache);
await build({stdin:{resolveDir:fileURLToPath(root),loader:'ts',contents:`
import {dossierSlug,projectCharacterPdf,pdfTalentEffect} from './src/lib/character-pdf-model';
import {fillDossierPdf} from './src/lib/character-pdf';
import {terraUmbraTruthRules as canon} from '../api/src/rules/truth/rules';
import {truthAvailableTalents,truthAngelusCapacity} from './src/lib/truth';
${fixtures}
export const core={rules,lore,talentChoiceSpecs:{},skillTalentMap:{expertise_smoke:'athletisme'},disadvantages:{common:[],attribute:[],sphere:{crawler:[]}},edgeRules};
export {dossierSlug,projectCharacterPdf,pdfTalentEffect,fillDossierPdf,characterData,realityRules,canon,truthAvailableTalents,truthAngelusCapacity};
`},bundle:true,packages:'external',outfile:fileURLToPath(bundle),format:'esm',platform:'node'});
const {dossierSlug,projectCharacterPdf,pdfTalentEffect,fillDossierPdf,characterData,realityRules,canon,core,truthAvailableTalents,truthAngelusCapacity}=await import(bundle.href);
const manifest=JSON.parse(await readFile(new URL('public/pdf/dossiers/manifest.json',root),'utf8'));
const font=new Uint8Array(await readFile(new URL('public/pdf/fonts/DejaVuSans.ttf',root)));
const fontDoc=await PDFDocument.create();fontDoc.registerFontkit(fontkit);const metricFont=await fontDoc.embedFont(font);
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
 const fields=new Set([...manifest.fields.realite,...manifest.fields.chasseur].map(f=>f.name));
 const model=projectCharacterPdf({data,core,truth:canon,reality:realityRules,campaign:true},fields);
 assert.equal(model.slug,'chasseur');assert.ok(model.annex.some(a=>a.title==='Pacte du Djinn'&&a.text.includes('Djinn existant')),'Readable permanent hunter reference in actual PDF projection');
 assert.ok(model.annex.some(a=>a.title==='Doctrines de Chasse choisies'&&a.text.includes('Nizarites')));
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
  const specs=[...manifest.fields.realite,...(slug==='realite'?[]:manifest.fields[slug])];
  const input={data,core,truth:canon,reality:realityRules,campaign:true};
  const before=JSON.stringify(input),model=projectCharacterPdf(input,new Set(specs.map(s=>s.name)));
  assert.equal(JSON.stringify(input),before,'PDF projection never changes the draft');
  assert.equal(model.slug,slug);assert.equal(model.values['reality.nom'],'Éloïse D’Œuvre « La lumière »');
  for(const key of ['reality.pv_actuels','reality.pa_1','truth.state.V','truth.molts'])assert.equal(model.values[key],undefined,'Unknown session values remain empty');
  assert.equal(model.values['reality.pv_max'],'9');
  const creation=projectCharacterPdf({...input,campaign:false},new Set(specs.map(s=>s.name)));
  assert.equal(creation.values['reality.pv_max'],'6');assert.equal(creation.values['reality.xp_disponibles'],'0');
  if(slug==='angelus'){assert.equal(model.values['truth.angelus.primaryNature.throne'],true);assert.ok(model.values['truth.angelus.gift.sephira.name']);}
  if(slug==='mage'){assert.ok(model.values['truth.mage.type']);assert.ok(model.values['truth.mage.affinities.01.name']);}
  if(slug==='daemon'){assert.equal(model.values['truth.daemon.function.oracle'],true);assert.ok(model.values['truth.daemon.imprint.name']);}
  const template=manifest.templates[slug];
  const bytes=new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+template.colour,root)));
  const result=await fillDossierPdf(bytes,font,model,template.pages,specs);
  const pdf=await PDFDocument.load(result.bytes),form=pdf.getForm();
  assertVisibleMultiline(form);
  assert.ok(result.annexPages>0,'Long information produces annex pages');
  assert.ok(form.getFields().length>specs.length,'Annexes remain editable');
  assert.ok(form.getTextField('reality.nom').getText().includes('Éloïse'));
  assert.ok(form.getFields().some(f=>f.getName().startsWith('annex.')));
  assert.ok(!form.getTextField('reality.pv_actuels').getText());
  await writeFile(new URL(slug+'-filled.pdf',cache),result.bytes);
  if(slug==='angelus'){
    const printTemplate=new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+template.print,root)));
    // A newly opened print window backgrounds the source tab. Each pdf-lib
    // yield would then be subject to background timer throttling in Chrome.
    const originalTimeout=globalThis.setTimeout;let timerYields=0,print;
    globalThis.setTimeout=(callback,delay,...args)=>{if(!delay)timerYields++;return originalTimeout(callback,delay,...args);};
    try{print=await fillDossierPdf(printTemplate,font,model,4,specs,true);}
    finally{globalThis.setTimeout=originalTimeout;}
    assert.equal(timerYields,0,'Print generation must not wait on throttled background timers');
    assert.equal((await PDFDocument.load(print.bytes)).getForm().getFields().length,0,'Only print copy is flattened');
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
  const specs=[...manifest.fields.realite,...(slug==='realite'?[]:manifest.fields[slug])];
  const model=projectCharacterPdf({data,core,truth:canon,reality:rp,campaign:true},new Set(specs.map(s=>s.name)));
  assert.equal(model.values['reality.habitation'],'Appartement de fonction');assert.equal(model.values['reality.planque_refuge'],'Planque sûre');assert.match(model.values['reality.augmentation_1_notes'],/Système Gen2 2/);
  const allText=Object.values(model.values).join('\n')+'\n'+model.annex.map(s=>s.title+'\n'+s.text).join('\n');
  assert.match(allText,/Dormant/,'Dormant corruption Don remains recorded');
  for(const id of data.truth.truthTalents){const t=available.find(t=>t.id===id);if(t)assert.ok(allText.includes(t.name),'Every acquired talent survives row overflow: '+t.name);}
  if(slug==='garou')assert.match(allText,/forme hybride interdite|Mue hybride interdite/);
  if(slug==='angelus'){assert.equal(model.values['truth.angelus.rank.cherub'],true);assert.equal(model.values['truth.angelus.aura.max'],'7');assert.equal(model.values['truth.angelus.aura.current'],undefined);}
  if(slug==='mage'){assert.equal(model.values['truth.mage.affinities.01.mastery'],'Magistrale','Highest purchased mastery is exported');assert.match(allText,/Acquise/);}
  if(slug==='homo-superior'){assert.equal(model.values['truth.talents.01.name'],'Phasage de l’équipement');assert.match(model.values['truth.homo-superior.patches'],/chaque soldat/);}
  const template=manifest.templates[slug];
  const result=await fillDossierPdf(new Uint8Array(await readFile(new URL('public/pdf/dossiers/'+template.colour,root))),font,model,template.pages,specs);
  assertVisibleMultiline((await PDFDocument.load(result.bytes)).getForm());
  assert.ok(result.annexPages>0);await writeFile(new URL(slug+'-advanced.pdf',cache),result.bytes);
}
{
  const bytes=new Uint8Array(await readFile(new URL('public/pdf/dossiers/TUC-realite-couleur.pdf',root)));
  const portrait='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6lF0AAAAASUVORK5CYII=';
  const model={slug:'realite',name:'Portrait 🙂',portrait,values:{'reality.nom':'Portrait 🙂'},labels:{},annex:[]};
  const result=await fillDossierPdf(bytes,font,model,2,manifest.fields.realite);
  assert.ok(!result.warnings.some(w=>w.includes('portrait')),'A selected image is embedded');
  assert.ok(result.warnings.some(w=>w.includes('Unicode')),'Unsupported characters are reported with their Unicode code');
  const doc=await PDFDocument.load(result.bytes),before=await PDFDocument.load(bytes);
  const images=d=>d.getPage(0).node.Resources().lookup(PDFName.of('XObject')).keys().length;
  assert.ok(images(doc)>images(before),'Portrait becomes an additional page image');
}
const builder=await readFile(new URL('src/pages/CharacterBuilderPage.vue',root),'utf8');
const sheet=await readFile(new URL('src/pages/CharacterSheetPage.vue',root),'utf8');
assert.match(builder,/data:draft\.value/);assert.match(builder,/campaign:progressionMode/);assert.match(builder,/<CharacterPdfActions/);
assert.match(sheet,/<CharacterPdfActions/);
console.log(`PDF EXPORT OK — ${Object.keys(manifest.templates).length} templates, 22 routing cases, current draft / campaign split, Unicode, editable overflow, empty session values, print flattening, advanced purchased talents, dormant corruption, Mage affinities, chained Garou, AIDH phasing, housing and Gen2`);
