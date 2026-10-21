import { PDFDocument, PDFTextField, PDFCheckBox, PDFDict, PDFName, ParseSpeeds, rgb, pushGraphicsState, popGraphicsState, rectangle, clip, endPath } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { dossierSlug, projectCharacterPdf, type PdfInput, type PdfProjection, type PdfValue } from './character-pdf-model';
import { fitPdfText, pdfMultilineCapacity, plainPdfText, wrapPdfText } from './character-pdf-layout';

export { fitPdfText, wrapPdfText } from './character-pdf-layout';
export type PdfFieldSpec={name:string;label:string;type:string;page:number;rect:number[];multiline?:boolean;fontSize?:number};
export type PdfPortraitArea={layer:'reality'|'truth';page:number;rect:{x:number;y:number;width:number;height:number}};
export type PdfSupplement={pages:number;fields:PdfFieldSpec[];bytes?:Uint8Array;load?:()=>Promise<Uint8Array>};
type PdfTemplate={pages:number;colour:string;print:string;portraitAreas?:PdfPortraitArea[]};
export type DossierManifest={schemaVersion:number;templates:Record<string,PdfTemplate>;fields:Record<string,PdfFieldSpec[]>;supplement?:{file:string;pages:number;fields:PdfFieldSpec[]}};
export type PdfResult={bytes:Uint8Array;filename:string;pages:number;annexPages:number;warnings:string[]};
type TextEntry={fieldName:string;title:string;text:string};
type ExtendedProjection=PdfProjection&{fields?:Record<string,PdfValue>;portraitReality?:string;portraitTruth?:string;annexEntries?:TextEntry[]};
const BASE='/pdf/dossiers/';
const FONT='/pdf/fonts/DejaVuSans.ttf';
const BODY_SIZE=9.5;

function templateFile(filename:string){
  if(!/^[a-zA-Z0-9_.-]+\.pdf$/.test(filename))throw new Error('Le nom du modèle PDF est invalide.');
  return BASE+filename;
}

async function loadBytes(url:string,kind:'pdf'|'font'){
  const response=await fetch(url,{credentials:'same-origin',cache:'no-cache'});
  if(!response.ok)throw new Error('Le dossier PDF est indisponible. Réessaie après avoir actualisé la page.');
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(kind==='pdf'&&String.fromCharCode(...bytes.subarray(0,5))!=='%PDF-')throw new Error('Le modèle reçu n’est pas un PDF valide. Réessaie après avoir actualisé la page.');
  if(kind==='font'&&(bytes.length<1000||new TextDecoder().decode(bytes.subarray(0,30)).includes('<!DOCTYPE')))throw new Error('La police du PDF est indisponible. Réessaie après avoir actualisé la page.');
  return bytes;
}

export async function generateCharacterPdf(input:PdfInput,printing=false):Promise<PdfResult>{
  const slug=dossierSlug(input.data.truth);
  const response=await fetch(BASE+'manifest.json',{credentials:'same-origin',cache:'no-cache'});
  if(!response.ok)throw new Error('La liste des dossiers PDF est indisponible. Réessaie dans un instant.');
  const manifest=await response.json() as DossierManifest;
  if(![1,2].includes(manifest.schemaVersion)||!manifest.templates?.[slug]||!manifest.fields?.realite)throw new Error('Ce dossier n’est pas encore disponible sur le site.');
  const template=manifest.templates[slug],filename=printing?template.print:template.colour;
  const specs=manifest.schemaVersion===2?manifest.fields[slug]:[...manifest.fields.realite,...(slug==='realite'?[]:manifest.fields[slug]??[])];
  if(!specs?.length)throw new Error('Les champs de ce dossier sont indisponibles.');
  const projection=projectCharacterPdf(input,new Set(specs.map(field=>field.name)));
  const [pdfBytes,fontBytes]=await Promise.all([loadBytes(templateFile(filename),'pdf'),loadBytes(FONT,'font')]);
  const extra=manifest.supplement;
  const supplement=extra?{pages:extra.pages,fields:extra.fields,load:()=>loadBytes(templateFile(extra.file),'pdf')}:undefined;
  return fillDossierPdf(pdfBytes,fontBytes,projection,template.pages,specs,printing,template.portraitAreas,supplement);
}

function fieldSize(field:PDFTextField,spec?:PdfFieldSpec){
  const declared=spec?.fontSize??Number(field.acroField.getDefaultAppearance()?.match(/([\d.]+)\s+Tf/)?.[1]);
  return Number.isFinite(declared)&&declared>0?declared:BODY_SIZE;
}

function textPadding(field:PDFTextField){
  return Math.max(0,...field.acroField.getWidgets().map(widget=>widget.getBorderStyle()?.getWidth()??0))+1;
}

function family(name:string){
  if(/^truth\.(?:powers|talents)\.\d+\./.test(name))return 'truth';
  if(name.startsWith('truth.')&&(/\.effect$/.test(name)||/^truth\.mage\.(echo|personalWork)$/.test(name)))return 'truth';
  if(/^reality\.talents\.\d+\.detail$/.test(name))return 'reality';
  return undefined;
}

function reference(name:string){
  const power=name.match(/^truth\.(?:powers|talents)\.(\d+)\./);
  if(power)return `V2, capacité ${power[1]}`;
  const talent=name.match(/^reality\.talents\.(\d+)\.detail$/);
  if(talent)return `R2, talent ${talent[1]}`;
  return name;
}

async function drawPortraits(doc:PDFDocument,projection:ExtendedProjection,areas:PdfPortraitArea[]|undefined,printing:boolean,warnings:string[]){
  const sources={reality:projection.portraitReality??projection.portrait,truth:projection.portraitTruth};
  const first=doc.getPage(0),sx=first.getWidth()/1055,sy=first.getHeight()/1491;
  const slots=areas??[{layer:'reality' as const,page:0,rect:{x:60*sx,y:first.getHeight()-(187+175)*sy,width:153*sx,height:175*sy}}];
  for(const area of slots){
    if(area.layer!=='reality'&&area.layer!=='truth')continue;
    const source=sources[area.layer];
    if(!source)continue;
    try{
      if(!source.startsWith('data:image/')){
        if(typeof location==='undefined'||new URL(source,location.href).origin!==location.origin)throw new Error('Portrait externe');
      }
      const rect=area.rect;
      if(!Number.isInteger(area.page)||area.page<0||area.page>=doc.getPageCount()||![rect.x,rect.y,rect.width,rect.height].every(Number.isFinite)||rect.x<0||rect.y<0||rect.width<=0||rect.height<=0)throw new Error('Zone du portrait invalide');
      const page=doc.getPage(area.page);
      if(rect.x+rect.width>page.getWidth()+.1||rect.y+rect.height>page.getHeight()+.1)throw new Error('Portrait hors page');
      const response=await fetch(source,{credentials:'same-origin'});
      if(!response.ok)throw new Error('Portrait indisponible');
      let bytes=new Uint8Array(await response.arrayBuffer()),kind=response.headers.get('content-type')??'';
      if(!/image\/(png|jpe?g)/i.test(kind)){
        const bitmap=await createImageBitmap(new Blob([bytes],{type:kind}));
        try{
          const canvas=new OffscreenCanvas(bitmap.width,bitmap.height),context=canvas.getContext('2d');
          if(!context)throw new Error('Image non convertible');
          context.drawImage(bitmap,0,0);
          bytes=new Uint8Array(await (await canvas.convertToBlob({type:'image/png'})).arrayBuffer());kind='image/png';
        }finally{bitmap.close();}
      }
      const image=/png/i.test(kind)?await doc.embedPng(bytes):await doc.embedJpg(bytes);
      const scale=Math.min(rect.width/image.width,rect.height/image.height);
      page.pushOperators(pushGraphicsState(),rectangle(rect.x,rect.y,rect.width,rect.height),clip(),endPath());
      if(areas)page.drawRectangle({...rect,color:rgb(1,1,1),opacity:1,borderWidth:0});
      page.drawImage(image,{x:rect.x+(rect.width-image.width*scale)/2,y:rect.y+(rect.height-image.height*scale)/2,width:image.width*scale,height:image.height*scale,opacity:printing?.85:1});
      page.pushOperators(popGraphicsState());
    }catch{warnings.push(`Le portrait de ${area.layer==='truth'?'Vérité':'Réalité'} n’a pas pu être intégré. Les autres informations sont conservées.`);}
  }
}

export async function fillDossierPdf(pdfBytes:Uint8Array,fontBytes:Uint8Array,projection:PdfProjection,expectedPages:number,specs:PdfFieldSpec[],printing=false,portraitAreas?:PdfPortraitArea[],supplement?:PdfSupplement):Promise<PdfResult>{
  const doc=await PDFDocument.load(pdfBytes,{parseSpeed:ParseSpeeds.Fastest});
  if(doc.getPageCount()!==expectedPages)throw new Error('Le dossier PDF ne correspond pas à la version attendue.');
  doc.registerFontkit(fontkit);
  const font=await doc.embedFont(fontBytes,{subset:false}),form=doc.getForm();
  const fields=new Map(form.getFields().map(field=>[field.getName(),field]));
  const originalNames=new Set(fields.keys());
  const metadata=new Map(specs.map(spec=>[spec.name,spec]));
  for(const spec of specs)if(!fields.has(spec.name))throw new Error(`Le dossier PDF est incomplet : champ ${spec.name} absent.`);
  for(const field of fields.values())if(field instanceof PDFTextField){
    const size=fieldSize(field,metadata.get(field.getName()));
    const rect=field.acroField.getWidgets()[0]?.getRectangle();
    if(rect&&field.isMultiline()&&pdfMultilineCapacity(font,size,rect.height,textPadding(field))<2)field.disableMultiline();
    field.acroField.setDefaultAppearance(`/Helv ${size} Tf 0 0 0 rg`);
    field.setFontSize(size);field.updateAppearances(font);
  }
  const current=projection as ExtendedProjection;
  const values=current.fields??projection.values;
  const pending:TextEntry[]=current.annexEntries?current.annexEntries.map(entry=>({...entry})):projection.annex.map((section,index)=>({fieldName:`legacy.${index+1}`,...section}));
  const warnings:string[]=[];
  await drawPortraits(doc,current,portraitAreas,printing,warnings);
  const covered=new Set(font.getCharacterSet());
  let missingGlyph=false;
  const display=(value:string)=>Array.from(plainPdfText(value)).map(character=>{
    if(character==='\n'||covered.has(character.codePointAt(0)!))return character;
    missingGlyph=true;return `[U+${character.codePointAt(0)!.toString(16).toUpperCase()}]`;
  }).join('');
  const write=(name:string,value:string)=>{
    const field=fields.get(name);
    if(!(field instanceof PDFTextField))throw new Error(`Le champ texte ${name} est introuvable.`);
    const rect=field.acroField.getWidgets()[0]?.getRectangle();
    if(!rect)throw new Error(`La zone du champ ${name} est introuvable.`);
    const size=fieldSize(field,metadata.get(name));
    if(field.isMultiline()&&pdfMultilineCapacity(font,size,rect.height,textPadding(field))<2)field.disableMultiline();
    const fitted=fitPdfText(display(value),font,size,rect.width,rect.height,field.isMultiline(),textPadding(field));
    field.removeMaxLength();field.setFontSize(size);field.disableScrolling();field.setText(fitted.text);
    if(field.isMultiline()&&fitted.text.trim())for(const widget of field.acroField.getWidgets())widget.getOrCreateAppearanceCharacteristics().setBackgroundColor([1,1,1]);
    return fitted;
  };
  for(const [name,value] of Object.entries(values)){
    const field=fields.get(name);
    if(!field)throw new Error(`Le modèle ne contient pas le champ ${name}.`);
    if(field instanceof PDFCheckBox){value===true?field.check():field.uncheck();continue;}
    if(!(field instanceof PDFTextField)||typeof value!=='string')continue;
    const fitted=write(name,value);
    if(fitted.overflow)pending.push({fieldName:name,title:projection.labels[name]??metadata.get(name)?.label??name,text:fitted.remaining});
  }
  const empty=(name:string)=>fields.get(name) instanceof PDFTextField&&!form.getTextField(name).getText()?.trim();
  const continuedEntries=new Set<TextEntry>();
  const consume=(entry:TextEntry,names:{access?:string;effect:string}[])=>{
    for(const slot of names){
      if(!entry.text.trim())break;
      if(!empty(slot.effect)||(slot.access&&!empty(slot.access)))continue;
      const original=originalNames.has(entry.fieldName),continued=continuedEntries.has(entry);
      const origin=reference(entry.fieldName);
      let heading=original?(origin===entry.fieldName?`Suite - ${entry.title}`:`Suite de ${origin}`):continued?`Suite - ${entry.title}`:entry.title;
      let body=entry.text;
      if(slot.access&&!original&&!continued){
        const split=body.indexOf('\n');
        heading=split>=0?body.slice(0,split):body;
        body=split>=0?body.slice(split+1):'';
      }
      if(slot.access){
        const access=write(slot.access,heading);
        if(!original&&!continued&&access.remaining)body=[access.remaining,body].filter(Boolean).join('\n');
      }
      const content=slot.access?body:original||continued?`${heading}\n${body}`:body;
      const fitted=write(slot.effect,content);
      if(fitted.remaining.length>=entry.text.length){write(slot.effect,'');if(slot.access)write(slot.access,'');continue;}
      entry.text=fitted.remaining;
      continuedEntries.add(entry);
    }
  };
  const slots=(prefix:string,kind:'reality'|'truth',count:number)=>Array.from({length:count},(_,index)=>{
    const number=String(index+1).padStart(2,'0');
    return kind==='truth'?{access:`${prefix}truth.powers.${number}.access`,effect:`${prefix}truth.powers.${number}.effect`}:{effect:`${prefix}reality.talents.${number}.detail`};
  }).filter(slot=>fields.has(slot.effect));
  for(const entry of pending){
    if(entry.fieldName==='bg.history.01'&&empty('bg.history.02')){
      entry.text=write('bg.history.02',entry.text).remaining;
    }else if(entry.fieldName.startsWith('reality.')&&!family(entry.fieldName)&&/augmentation|equipment|biens|resources|programmes|neuro_/.test(entry.fieldName)&&empty('reality.acquisitions.future')){
      consume(entry,[{effect:'reality.acquisitions.future'}]);
    }else{
      const kind=family(entry.fieldName);
      if(kind)consume(entry,slots('',kind,kind==='truth'?6:8));
    }
  }
  let supplementDoc:PDFDocument|undefined,supplementIndex=0;
  const addSupplement=async()=>{
    if(!supplement)return undefined;
    if(!supplementDoc){
      const bytes=supplement.bytes??await supplement.load?.();
      if(!bytes)return undefined;
      supplementDoc=await PDFDocument.load(bytes,{parseSpeed:ParseSpeeds.Fastest});
      if(supplementDoc.getPageCount()!==supplement.pages||supplement.pages%2!==0)throw new Error('Le supplément de progression est invalide.');
      const original=new Set(supplementDoc.getForm().getFields().map(field=>field.getName()));
      for(const spec of supplement.fields)if(!original.has(spec.name))throw new Error(`Champ du supplément absent : ${spec.name}.`);
    }
    const prefix=`continuation.${String(++supplementIndex).padStart(3,'0')}.`;
    const pages=await doc.copyPages(supplementDoc,supplementDoc.getPageIndices()),offset=doc.getPageCount();
    for(const page of pages){page.node.delete(PDFName.of('Annots'));doc.addPage(page);}
    for(const spec of supplement.fields){
      const [x,y,width,height]=spec.rect;
      if(!Number.isInteger(spec.page)||spec.page<0||spec.page>=pages.length||![x,y,width,height].every(Number.isFinite)||width<=0||height<=0||x<0||y<0||x+width>pages[spec.page]!.getWidth()+.1||y+height>pages[spec.page]!.getHeight()+.1)throw new Error('Une zone du supplément est invalide.');
      const name=prefix+spec.name;
      if(spec.type==='checkbox'){
        const field=form.createCheckBox(name);field.addToPage(pages[spec.page]!,{x,y,width,height});fields.set(name,field);
      }else{
        const field=form.createTextField(name),size=spec.fontSize??BODY_SIZE;
        field.acroField.setDefaultAppearance(`/Helv ${size} Tf 0 0 0 rg`);
        if(spec.multiline)field.enableMultiline();
        field.setFontSize(size);field.disableScrolling();
        field.addToPage(pages[spec.page]!,{x,y,width,height,font,borderWidth:.4,borderColor:rgb(.72,.77,.8),backgroundColor:rgb(1,1,1),textColor:rgb(.04,.06,.08)});
        fields.set(name,field);
      }
      metadata.set(name,{...spec,name,page:offset+spec.page});
    }
    return prefix+'supplement.';
  };
  let eligible=pending.filter(entry=>entry.text.trim()&&family(entry.fieldName));
  while(supplement&&eligible.length){
    const previous=eligible.reduce((total,entry)=>total+entry.text.length,0);
    let prefix:string|undefined;
    try{prefix=await addSupplement();}
    catch{warnings.push('Le supplément optionnel est indisponible ; les suites sont conservées dans les compléments.');break;}
    if(!prefix)break;
    for(const entry of eligible){const kind=family(entry.fieldName)!;consume(entry,slots(prefix,kind,kind==='truth'?6:8));}
    eligible=pending.filter(entry=>entry.text.trim()&&family(entry.fieldName));
    if(eligible.reduce((total,entry)=>total+entry.text.length,0)>=previous)break;
  }
  let page:ReturnType<PDFDocument['addPage']>|undefined,y=0,annexIndex=0;
  const newPage=()=>{
    page=doc.addPage([595.276,841.89]);y=758;
    page.drawText('TERRA UMBRA CALIFORNIA',{x:42,y:800,size:13,font,color:rgb(.09,.2,.25)});
    page.drawText(fitPdfText(`Compléments du dossier - ${display(projection.name)}`,font,BODY_SIZE,511,18,false).text,{x:42,y:781,size:BODY_SIZE,font,color:rgb(.18,.24,.28)});
    page.drawLine({start:{x:42,y:772},end:{x:553,y:772},thickness:.6,color:rgb(.65,.72,.75)});
  };
  for(const section of pending){
    if(!section.text.trim())continue;
    const heading=fitPdfText(display(`Suite de ${reference(section.fieldName)} - ${section.title}`),font,10,511,44,true,1.5);
    let remaining=[heading.remaining,display(section.text)].filter(Boolean).join('\n'),part=0;
    while(remaining.trim()){
      if(!page||y<120)newPage();
      const titleLines=wrapPdfText(heading.text+(part?' (suite)':''),font,10,507);
      if(y-titleLines.length*13<100){newPage();continue;}
      for(const line of titleLines){page!.drawText(line,{x:42,y,size:10,font,color:rgb(.08,.18,.22)});y-=13;}
      const availableHeight=y-62;
      const fitted=fitPdfText(remaining,font,BODY_SIZE,511,availableHeight,true,1.5);
      if(fitted.remaining.length>=remaining.length)throw new Error('Une continuation PDF ne peut pas être mise en page.');
      const lineCount=wrapPdfText(fitted.text,font,BODY_SIZE,507.9).length;
      const height=lineCount*font.heightAtSize(BODY_SIZE)*1.2+font.heightAtSize(BODY_SIZE)-font.heightAtSize(BODY_SIZE,{descender:false})+4;
      const field=form.createTextField(`annex.${String(++annexIndex).padStart(3,'0')}`);
      field.acroField.setDefaultAppearance(`/Helv ${BODY_SIZE} Tf 0 0 0 rg`);
      field.enableMultiline();field.setFontSize(BODY_SIZE);field.disableScrolling();field.setText(fitted.text);
      field.addToPage(page!,{x:42,y:y-height,width:511,height,font,textColor:rgb(.04,.06,.08),borderWidth:.5,borderColor:rgb(.78,.82,.83),backgroundColor:rgb(1,1,1)});
      y-=height+18;remaining=fitted.remaining;part++;
    }
  }
  if(doc.getPageCount()>expectedPages&&doc.getPageCount()%2!==expectedPages%2){
    const blank=doc.addPage([595.276,841.89]);
    blank.drawText('Page laissée libre pour le recto-verso',{x:42,y:30,size:8,font,color:rgb(.35,.4,.42)});
  }
  const pageCount=doc.getPageCount();
  for(let index=expectedPages;index<pageCount;index++)doc.getPage(index).drawText(`Compléments - ${index+1} / ${pageCount}`,{x:42,y:18,font,size:8,color:rgb(.35,.4,.42)});
  if(pageCount>expectedPages)warnings.push('Les informations supplémentaires sont conservées dans les suites identifiées du dossier.');
  form.updateFieldAppearances(font);
  if(printing){
    form.flatten({updateFieldAppearances:false});
    for(const currentPage of doc.getPages()){
      const annotations=currentPage.node.Annots();
      if(!annotations)continue;
      for(let index=annotations.size()-1;index>=0;index--){
        let annotation;
        try{annotation=doc.context.lookup(annotations.get(index));}catch{annotation=undefined;}
        if(!(annotation instanceof PDFDict)||annotation.get(PDFName.of('Subtype'))?.toString()==='/Widget')annotations.remove(index);
      }
      if(!annotations.size())currentPage.node.delete(PDFName.of('Annots'));
    }
    doc.catalog.delete(PDFName.of('AcroForm'));
  }
  if(missingGlyph)warnings.push('Certains caractères rares sont indiqués par leur code Unicode entre crochets dans le PDF.');
  doc.setTitle(`${projection.name} - Dossier ${projection.slug}`);doc.setAuthor('Terra Umbra California');doc.setSubject('Fiche de personnage');
  const bytes=await doc.save({updateFieldAppearances:false,objectsPerTick:Infinity});
  const safeName=projection.name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'personnage';
  return {bytes,filename:`TUC-${safeName}-${projection.slug}${printing?'-impression':''}.pdf`,pages:pageCount,annexPages:pageCount-expectedPages,warnings};
}
