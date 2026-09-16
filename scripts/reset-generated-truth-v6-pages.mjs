import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

function specFor(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec) throw new Error(`Dataset absent: ${id}`);
  return spec;
}
function loadDataset(id){
  const spec=specFor(id);let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function writeDataset(id,pages,prefix){
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages)),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++) fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  const spec=specFor(id);spec.prefix=prefix;spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
}

const rules=loadDataset('moteur');
const cleaned=rules.filter(page=>!String(page.id||'').startsWith('regles-verite-v6-'));
const removed=rules.length-cleaned.length;
writeDataset('moteur',cleaned,'v3-regles-prebuild-reset');
manifest.expectedTotal=manifest.datasets.reduce((sum,dataset)=>sum+Number(dataset.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`RESET V6 — ${removed} pages générées retirées avant reconstruction · Règles ${cleaned.length}.`);
