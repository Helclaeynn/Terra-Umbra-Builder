import type { PDFFont } from 'pdf-lib';

type WrappedRow={text:string;start:number;ends:number[]};
export type PdfTextFit={text:string;remaining:string;overflow:boolean};

export function plainPdfText(value:string){
  return value.replace(/\r\n?/g,'\n').replace(/\t/g,'  ').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');
}

function wrappedRows(value:string,font:PDFFont,size:number,width:number):WrappedRow[]{
  const rows:WrappedRow[]=[];
  let offset=0;
  for(const paragraph of value.split('\n')){
    let line='',start=offset,ends:number[]=[];
    const flush=()=>{rows.push({text:line,start,ends});line='';ends=[];};
    for(const match of paragraph.matchAll(/\S+/gu)){
      const word=match[0],wordStart=offset+match.index!;
      const joined=line?`${line} ${word}`:word;
      if(line&&font.widthOfTextAtSize(joined,size)>width)flush();
      if(line){line+=' ';ends.push(wordStart);}
      let position=wordStart;
      for(const character of Array.from(word)){
        if(line&&font.widthOfTextAtSize(line+character,size)>width)flush();
        if(!line)start=position;
        line+=character;position+=character.length;ends.push(position);
      }
    }
    if(line)flush();
    else if(!paragraph.trim())rows.push({text:'',start:offset,ends:[]});
    offset+=paragraph.length+1;
  }
  return rows;
}

export function wrapPdfText(value:string,font:PDFFont,size:number,width:number):string[]{
  return wrappedRows(plainPdfText(value),font,size,Math.max(.1,width)).map(row=>row.text);
}

export function pdfMultilineCapacity(font:PDFFont,size:number,height:number,padding=1){
  const fullHeight=font.heightAtSize(size);
  const descent=fullHeight-font.heightAtSize(size,{descender:false});
  return Math.max(0,Math.floor((height-padding*2-descent)/(fullHeight*1.2)));
}

export function fitPdfText(value:string,font:PDFFont,size:number,width:number,height:number,multiline:boolean,padding=1):PdfTextFit{
  const clean=plainPdfText(value);
  if(!clean)return {text:'',remaining:'',overflow:false};
  const availableWidth=Math.max(.1,width-padding*2-.1);
  const rows=wrappedRows(multiline?clean:clean.replace(/\n/g,' '),font,size,availableWidth);
  const capacity=multiline?pdfMultilineCapacity(font,size,height,padding):height-padding*2>=font.heightAtSize(size,{descender:false})?1:0;
  const fits=rows.length<=capacity&&rows.every(row=>font.widthOfTextAtSize(row.text,size)<=availableWidth);
  if(fits)return {text:rows.map(row=>row.text).join(multiline?'\n':''),remaining:'',overflow:false};
  if(!capacity)return {text:'',remaining:clean,overflow:true};
  const kept=rows.slice(0,capacity),last=kept[kept.length-1];
  const characters=Array.from(last.text);
  while(characters.length&&font.widthOfTextAtSize(characters.join('')+'…',size)>availableWidth)characters.pop();
  const consumed=characters.length?last.ends[characters.length-1]!:last.start;
  const marker=font.widthOfTextAtSize('…',size)<=availableWidth?'…':'';
  kept[kept.length-1]={...last,text:characters.join('')+marker};
  return {text:kept.map(row=>row.text).join(multiline?'\n':''),remaining:clean.slice(consumed).trimStart(),overflow:true};
}
