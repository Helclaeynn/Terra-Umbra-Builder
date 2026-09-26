import { PDFDocument, PDFTextField, PDFCheckBox, ParseSpeeds, rgb, pushGraphicsState, popGraphicsState, rectangle, clip, endPath, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { dossierSlug, projectCharacterPdf, type PdfInput, type PdfProjection, type PdfSection } from './character-pdf-model';

export type PdfFieldSpec={name:string;label:string;type:string;page:number;rect:number[];multiline?:boolean;fontSize?:number};
export type DossierManifest={schemaVersion:number;templates:Record<string,{pages:number;colour:string;print:string}>;fields:Record<string,PdfFieldSpec[]>};
export type PdfResult={bytes:Uint8Array;filename:string;pages:number;annexPages:number;warnings:string[]};
const BASE='/pdf/dossiers/';
const FONT='/pdf/fonts/DejaVuSans.ttf';

async function loadBytes(url:string,kind:'pdf'|'font'){
  const response=await fetch(url,{credentials:'same-origin',cache:'no-cache'});
  if(!response.ok)throw new Error('Le dossier PDF est indisponible. Réessaie après avoir actualisé la page.');
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(kind==='pdf'&&String.fromCharCode(...bytes.subarray(0,5))!=='%PDF-')throw new Error('Le modèle reçu n’est pas un PDF valide. Réessaie après avoir actualisé la page.');
  if(kind==='font'&&(bytes.length<1000||new TextDecoder().decode(bytes.subarray(0,30)).includes('<!DOCTYPE')))throw new Error('La police du PDF est indisponible. Réessaie après avoir actualisé la page.');
  return bytes;
}
export async function generateCharacterPdf(input:PdfInput,printing=false):Promise<PdfResult>{
  // The caller supplies an immutable snapshot, including the unsaved local draft.
  const slug=dossierSlug(input.data.truth);
  const response=await fetch(BASE+'manifest.json',{credentials:'same-origin',cache:'no-cache'});
  if(!response.ok)throw new Error('La liste des dossiers PDF est indisponible. Réessaie dans un instant.');
  const manifest=await response.json() as DossierManifest;
  if(manifest.schemaVersion!==1||!manifest.templates?.[slug]||!manifest.fields?.realite)throw new Error('Ce dossier n’est pas encore disponible sur le site.');
  const template=manifest.templates[slug], filename=printing?template.print:template.colour;
  if(!/^[a-zA-Z0-9_.-]+\.pdf$/.test(filename))throw new Error('Le nom du modèle PDF est invalide.');
  const specs=[...manifest.fields.realite,...(slug==='realite'?[]:manifest.fields[slug]??[])];
  const projection=projectCharacterPdf(input,new Set(specs.map(field=>field.name)));
  const [pdfBytes,fontBytes]=await Promise.all([loadBytes(BASE+filename,'pdf'),loadBytes(FONT,'font')]);
  return fillDossierPdf(pdfBytes,fontBytes,projection,template.pages,specs,printing);
}

function plain(value:string){return value.replace(/\r\n?/g,'\n').replace(/\t/g,'  ').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');}
function wrapLine(value:string,font:PDFFont,size:number,width:number):string[]{
  if(!value)return [''];
  const rows:string[]=[];let line='';
  // Split words, with character-level fallback for long URLs or unbroken names.
  for(const word of value.split(/\s+/)){
    const joined=line?`${line} ${word}`:word;
    if(font.widthOfTextAtSize(joined,size)<=width){line=joined;continue;}
    if(line){rows.push(line);line='';}
    for(const character of Array.from(word)){
      if(line&&font.widthOfTextAtSize(line+character,size)>width){rows.push(line);line='';}
      line+=character;
    }
  }
  if(line)rows.push(line);
  return rows;
}
export function wrapPdfText(value:string,font:PDFFont,size:number,width:number):string[]{return plain(value).split('\n').flatMap(line=>wrapLine(line,font,size,width));}

function fitText(value:string,font:PDFFont,size:number,width:number,height:number,multiline:boolean){
  const clean=plain(value), availableWidth=Math.max(2,width-5);
  const rows=multiline?wrapPdfText(clean,font,size,availableWidth):[clean.replace(/\n/g,' · ')];
  // Match pdf-lib's actual font metrics (DejaVu's ascent/descent are taller
  // than its nominal point size), leaving room for descenders and padding.
  const lineHeight=font.heightAtSize(size)*1.2;
  const capacity=multiline?Math.max(1,Math.floor((height-6)/lineHeight)):1;
  const over=rows.length>capacity||rows.some(line=>font.widthOfTextAtSize(line,size)>availableWidth);
  if(!over)return {text:multiline?rows.join('\n'):rows[0],overflow:false};
  const kept=rows.slice(0,capacity);let last=Array.from(kept[kept.length-1]??'');
  while(last.length&&font.widthOfTextAtSize(last.join('')+'…',size)>availableWidth)last.pop();
  kept[kept.length-1]=last.join('')+'…';
  return {text:kept.join('\n'),overflow:true};
}

export async function fillDossierPdf(pdfBytes:Uint8Array,fontBytes:Uint8Array,projection:PdfProjection,expectedPages:number,specs:PdfFieldSpec[],printing=false):Promise<PdfResult>{
  // Generation runs in a worker. pdf-lib's default setTimeout(0) pauses are
  // throttled when the print popup puts the originating tab in the background.
  const doc=await PDFDocument.load(pdfBytes,{parseSpeed:ParseSpeeds.Fastest});
  if(doc.getPageCount()!==expectedPages)throw new Error('Le dossier PDF ne correspond pas à la version attendue.');
  doc.registerFontkit(fontkit);
  // Full embedding keeps the editable export usable for characters added later.
  const font=await doc.embedFont(fontBytes,{subset:false}), form=doc.getForm();
  const fields=new Map(form.getFields().map(field=>[field.getName(),field]));
  for(const spec of specs)if(!fields.has(spec.name))throw new Error(`Le dossier PDF est incomplet : champ ${spec.name} absent.`);
  // pypdf may serialize the slash in /Helv as an octal escape. pdf-lib's
  // default-appearance parser reads it literally, so normalize this legal PDF
  // spelling before any font-size operation. Install the embedded font even
  // for empty fields, which must remain editable after downloading.
  for(const field of fields.values())if(field instanceof PDFTextField){
    const spec=specs.find(s=>s.name===field.getName());
    field.acroField.setDefaultAppearance(`/Helv ${spec?.fontSize??8} Tf 0 0 0 rg`);
    field.updateAppearances(font);
  }
  const sections:PdfSection[]=[...projection.annex], warnings:string[]=[];
  if(projection.portrait){
    try{
      if(!projection.portrait.startsWith('data:image/')){
        if(typeof location==='undefined'||new URL(projection.portrait,location.href).origin!==location.origin)throw new Error('Portrait externe');
      }
      const response=await fetch(projection.portrait,{credentials:'same-origin'});
      if(!response.ok)throw new Error('Portrait indisponible');
      let bytes=new Uint8Array(await response.arrayBuffer()),kind=response.headers.get('content-type')??'';
      if(!/image\/(png|jpe?g)/i.test(kind)){
        const bitmap=await createImageBitmap(new Blob([bytes],{type:kind}));
        const canvas=new OffscreenCanvas(bitmap.width,bitmap.height);canvas.getContext('2d')!.drawImage(bitmap,0,0);bitmap.close();
        bytes=new Uint8Array(await (await canvas.convertToBlob({type:'image/png'})).arrayBuffer());kind='image/png';
      }
      const image=/png/i.test(kind)?await doc.embedPng(bytes):await doc.embedJpg(bytes);
      const page=doc.getPage(0),sx=page.getWidth()/1055,sy=page.getHeight()/1491;
      const rect={x:60*sx,y:page.getHeight()-(187+175)*sy,width:153*sx,height:175*sy};
      const scale=Math.max(rect.width/image.width,rect.height/image.height);
      page.pushOperators(pushGraphicsState(),rectangle(rect.x,rect.y,rect.width,rect.height),clip(),endPath());
      page.drawImage(image,{x:rect.x+(rect.width-image.width*scale)/2,y:rect.y+(rect.height-image.height*scale)/2,width:image.width*scale,height:image.height*scale,opacity:printing?.85:1});
      page.pushOperators(popGraphicsState());
    }catch{warnings.push('Le portrait n’a pas pu être intégré. Les autres informations sont conservées.');}
  }
  const covered=new Set(font.getCharacterSet());
  let missingGlyph=false;
  const display=(s:string)=>Array.from(plain(s)).map(c=>{
    if(c==='\n'||covered.has(c.codePointAt(0)!))return c;
    missingGlyph=true;return `[U+${c.codePointAt(0)!.toString(16).toUpperCase()}]`;
  }).join('');
  for(const [name,value] of Object.entries(projection.values)){
    const field=fields.get(name);
    if(!field)throw new Error(`Le modèle ne contient pas le champ ${name}.`);
    if(field instanceof PDFCheckBox){value===true?field.check():field.uncheck();continue;}
    if(!(field instanceof PDFTextField)||typeof value!=='string')continue;
    const widget=field.acroField.getWidgets()[0], rect=widget?.getRectangle();
    if(!rect)throw new Error(`La zone du champ ${name} est introuvable.`);
    const spec=specs.find(s=>s.name===name);
    const size=Math.min(9,Math.max(6,Math.min(spec?.fontSize??8,rect.height*.66)));
    const rendered=display(value), fitted=fitText(rendered,font,size,rect.width,rect.height,field.isMultiline());
    field.removeMaxLength();field.setFontSize(size);field.disableScrolling();field.setText(fitted.text);
    // The paper's writing rules must not run through typed multiline text.
    // Only populated widgets get a white interior; blank templates stay intact.
    if(field.isMultiline()&&fitted.text.trim())for(const w of field.acroField.getWidgets())w.getOrCreateAppearanceCharacteristics().setBackgroundColor([1,1,1]);
    if(fitted.overflow)sections.push({title:projection.labels[name]??name,text:rendered});
  }
  const beforeAnnex=doc.getPageCount();
  const annexLineHeight=font.heightAtSize(9)*1.2;
  let page:ReturnType<PDFDocument['addPage']>|undefined,y=0,annexIndex=0;
  const newPage=()=>{
    page=doc.addPage([595.276,841.89]);y=758;
    page.drawText('TERRA UMBRA CALIFORNIA',{x:42,y:800,size:13,font,color:rgb(.09,.2,.25)});
    page.drawText(fitText('Compléments du dossier · '+display(projection.name),font,9,511,14,false).text,{x:42,y:781,size:9,font,color:rgb(.18,.24,.28)});
    page.drawLine({start:{x:42,y:772},end:{x:553,y:772},thickness:.6,color:rgb(.65,.72,.75)});
  };
  for(const section of sections){
    const content=display(section.text);if(!content.trim())continue;
    const lines=wrapPdfText(content,font,9,501);
    let part=0;
    while(lines.length){
      if(!page||y<100)newPage();
      const title=display(section.title)+(part?' — suite':'');
      const titleLines=wrapPdfText(title,font,10,507);
      const maxRows=Math.max(1,Math.floor((y-60-titleLines.length*13-10)/annexLineHeight));
      const take=lines.splice(0,maxRows), height=take.length*annexLineHeight+8;
      for(const titleLine of titleLines){page!.drawText(titleLine,{x:42,y,size:10,font,color:rgb(.08,.18,.22)});y-=13;}
      const field=form.createTextField(`annex.${String(++annexIndex).padStart(3,'0')}`);
      field.acroField.setDefaultAppearance('/Helv 9 Tf 0 0 0 rg');
      field.enableMultiline();field.setFontSize(9);field.disableScrolling();field.setText(take.join('\n'));
      field.addToPage(page!,{x:42,y:y-height,width:511,height,font,textColor:rgb(.04,.06,.08),borderWidth:.5,borderColor:rgb(.78,.82,.83),backgroundColor:rgb(1,1,1)});
      y-=height+18;part++;
    }
  }
  const pageCount=doc.getPageCount();
  for(let index=beforeAnnex;index<pageCount;index++)doc.getPage(index).drawText(`Compléments · ${index+1} / ${pageCount}`,{x:42,y:30,font,size:8,color:rgb(.35,.4,.42)});
  form.updateFieldAppearances(font);
  if(printing)form.flatten({updateFieldAppearances:false});
  if(missingGlyph)warnings.push('Certains caractères rares sont indiqués par leur code Unicode entre crochets dans le PDF.');
  doc.setTitle(`${projection.name} — Dossier ${projection.slug}`);doc.setAuthor('Terra Umbra California');doc.setSubject('Fiche de personnage');
  const bytes=await doc.save({updateFieldAppearances:false,objectsPerTick:Infinity});
  const safeName=projection.name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'personnage';
  return {bytes,filename:`TUC-${safeName}-${projection.slug}${printing?'-impression':''}.pdf`,pages:pageCount,annexPages:pageCount-beforeAnnex,warnings};
}
