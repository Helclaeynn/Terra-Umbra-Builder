import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){
  const spec=manifest.datasets.find(d=>d.id===id);
  let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
const truth=load('verite');
const mixed=/^(10\. Vampires|11\. Garous|12\.|13\. Mages|14\. Daemons|15\. Angelus|16\. Aseryns|17\. Exilés|18\. Extrals|19\.|20\. Corruption|21\. Les six Fléaux)/;
for(const page of truth.filter(p=>mixed.test(p.title||''))){
  const styleCounts=new Map();
  let blocks=0, tech=0, ptv=0;
  const examples=[];
  for(const section of page.sections||[]){
    for(const block of section.blocks||[]){
      blocks++;
      const style=String(block.style||'').trim()||'(none)';
      styleCounts.set(style,(styleCounts.get(style)||0)+1);
      const text=block.type==='table'?(block.rows||[]).flat().join(' '):String(block.text||'');
      if(/tech/i.test(style)){tech++; if(examples.length<8) examples.push(`${section.title} :: ${style} :: ${text.slice(0,180)}`)}
      if(/\bPTV\b/.test(text)) ptv++;
    }
  }
  console.log(`MIXED_PAGE | ${page.title} | sections=${page.sections?.length||0} | blocks=${blocks} | tech=${tech} | ptvBlocks=${ptv}`);
  console.log(`STYLES | ${[...styleCounts].sort((a,b)=>b[1]-a[1]).map(([s,n])=>`${s}:${n}`).join(' | ')}`);
  for(const ex of examples) console.log(`EXAMPLE | ${ex}`);
}
