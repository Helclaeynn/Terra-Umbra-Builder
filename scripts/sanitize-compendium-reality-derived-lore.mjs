import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const FRAGMENT_SIZE=8000;
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const BAD=/\$|\bprice ?(?:mode|label|min|max)\b|\bprice(?:mode|label|min|max)\b/i;

function load(spec){let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));}
function write(spec,pages){for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');const parts=Math.ceil(b64.length/FRAGMENT_SIZE);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');}
function scrub(text){
  const sentences=clean(text).split(/(?<=[.!?…])\s+/).filter(Boolean),kept=[];
  for(const sentence of sentences){
    const chunks=sentence.split(/,\s+/).filter(Boolean).filter(chunk=>!BAD.test(chunk));
    let s=clean(chunks.join(', ')).replace(/\s+([.;!?])/g,'$1');
    if(!s||BAD.test(s))continue;
    if(!/[.!?…]$/.test(s))s+='.';
    kept.push(s);
  }
  return clean(kept.join(' '));
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(x=>x.id==='equipement');if(!spec)throw new Error('Dataset equipement absent');
const pages=load(spec);let touched=0,removed=0;
for(const page of pages){
  const section=(page.sections||[]).find(s=>s.id==='contexte');if(!section)continue;
  const blocks=(section.blocks||[]).filter(b=>b.type==='p');
  if(!blocks.some(b=>BAD.test(String(b.text||''))))continue;
  touched++;
  section.blocks=blocks.map(block=>{
    const before=clean(block.text),after=scrub(before);
    if(after!==before)removed++;
    return {...block,text:after};
  }).filter(block=>block.text);
}
write(spec,pages);manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Lore Réalité assaini sans génération — ${touched} pages nettoyées · ${removed} paragraphes filtrés · 0 paragraphe inventé · SHA ${spec.sha256}.`);
