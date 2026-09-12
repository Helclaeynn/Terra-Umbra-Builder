const encoder=new TextEncoder();
let crcTable=null;

function table(){
  if(crcTable)return crcTable;
  crcTable=new Uint32Array(256);
  for(let n=0;n<256;n++){
    let c=n;
    for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;
    crcTable[n]=c>>>0;
  }
  return crcTable;
}
function crc32(bytes){
  const t=table();let c=0xffffffff;
  for(const byte of bytes)c=t[(c^byte)&0xff]^(c>>>8);
  return (c^0xffffffff)>>>0;
}
function concat(chunks){
  const size=chunks.reduce((sum,chunk)=>sum+chunk.length,0),out=new Uint8Array(size);
  let offset=0;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.length;}return out;
}
async function bytesOf(data){
  if(typeof data==='string')return encoder.encode(data);
  if(data instanceof Uint8Array)return data;
  if(data instanceof ArrayBuffer)return new Uint8Array(data);
  if(typeof Blob!=='undefined'&&data instanceof Blob)return new Uint8Array(await data.arrayBuffer());
  throw new TypeError('Contenu ZIP non supporté.');
}
function dosDateTime(value=new Date()){
  const date=value instanceof Date?value:new Date(value);
  const year=Math.max(1980,Math.min(2107,date.getFullYear()));
  const dosDate=((year-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate();
  const dosTime=(date.getHours()<<11)|(date.getMinutes()<<5)|Math.floor(date.getSeconds()/2);
  return {dosDate,dosTime};
}
function cleanName(name){
  const value=String(name||'').replace(/\\/g,'/').replace(/^\/+/, '');
  if(!value||value.split('/').includes('..'))throw new Error(`Chemin ZIP invalide: ${name}`);
  return value;
}

export async function buildZip(files,{date=new Date()}={}){
  if(!Array.isArray(files)||!files.length)throw new Error('Aucun fichier à empaqueter.');
  const locals=[],centrals=[];
  let offset=0;
  const {dosDate,dosTime}=dosDateTime(date);
  const seen=new Set();

  for(const file of files){
    const name=cleanName(file?.name);
    if(seen.has(name))throw new Error(`Fichier ZIP dupliqué: ${name}`);
    seen.add(name);
    const nameBytes=encoder.encode(name),data=await bytesOf(file.data),crc=crc32(data);
    const localHeader=new Uint8Array(30),lv=new DataView(localHeader.buffer);
    lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0x0800,true);lv.setUint16(8,0,true);
    lv.setUint16(10,dosTime,true);lv.setUint16(12,dosDate,true);lv.setUint32(14,crc,true);lv.setUint32(18,data.length,true);lv.setUint32(22,data.length,true);lv.setUint16(26,nameBytes.length,true);lv.setUint16(28,0,true);
    const local=concat([localHeader,nameBytes,data]);locals.push(local);

    const centralHeader=new Uint8Array(46),cv=new DataView(centralHeader.buffer);
    cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x0800,true);cv.setUint16(10,0,true);
    cv.setUint16(12,dosTime,true);cv.setUint16(14,dosDate,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,nameBytes.length,true);cv.setUint16(30,0,true);cv.setUint16(32,0,true);cv.setUint16(34,0,true);cv.setUint16(36,0,true);cv.setUint32(38,0,true);cv.setUint32(42,offset,true);
    centrals.push(concat([centralHeader,nameBytes]));offset+=local.length;
  }

  const central=concat(centrals),end=new Uint8Array(22),ev=new DataView(end.buffer);
  ev.setUint32(0,0x06054b50,true);ev.setUint16(4,0,true);ev.setUint16(6,0,true);ev.setUint16(8,files.length,true);ev.setUint16(10,files.length,true);ev.setUint32(12,central.length,true);ev.setUint32(16,offset,true);ev.setUint16(20,0,true);
  return new Blob([...locals,central,end],{type:'application/zip'});
}

export function mergePublicationEntries(committedPayload,draftEntries){
  const committed=Array.isArray(committedPayload?.entries)?committedPayload.entries:[];
  const drafts=Array.isArray(draftEntries)?draftEntries:[];
  const draftById=new Map(drafts.filter(Boolean).map(entry=>[entry.articleId,entry]));
  const entries=committed.filter(entry=>entry?.articleId&&!draftById.has(entry.articleId));
  entries.push(...draftById.values());
  entries.sort((a,b)=>String(a.articleId).localeCompare(String(b.articleId),'fr'));
  return {version:1,updated:new Date().toISOString().slice(0,10),entries};
}
