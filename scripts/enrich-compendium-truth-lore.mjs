import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const SOURCE_MANIFEST='compendium/source/verite-catalog-v6.json';
const LORE_MANIFEST='compendium/source/truth-lore-v2.manifest.json';
const LORE_DIR='compendium/source/truth-lore-v2';
const DATASET_ID='verite-catalogue';
const FRAGMENT_SIZE=8000;

function decodeGzipBase64(b64,label){
  const clean=String(b64).replace(/^\uFEFF/,'').replace(/\s+/g,'');
  if(!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)||clean.length%4!==0)throw new Error(`${label}: Base64 invalide`);
  return JSON.parse(zlib.gunzipSync(Buffer.from(clean,'base64')).toString('utf8'));
}
function readParts(dir,prefix,parts){
  return Array.from({length:parts},(_,i)=>fs.readFileSync(path.join(dir,`${prefix}-${String(i).padStart(2,'0')}.b64part`),'utf8').replace(/\s+/g,'')).join('');
}
function writeDataset(prefix,rows){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(path.join(DATA,file));
  const payload=JSON.stringify(rows),b64=zlib.gzipSync(Buffer.from(payload,'utf8'),{level:9}).toString('base64'),parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(path.join(DATA,`${prefix}-${String(i).padStart(2,'0')}.b64part`),b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  return {parts,count:rows.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')};
}

const loreManifest=JSON.parse(fs.readFileSync(LORE_MANIFEST,'utf8'));
if(loreManifest.encoding!=='gzip+base64'||loreManifest.entryCount!==229||!loreManifest.prefix||!loreManifest.parts)throw new Error('Manifeste lore Vérité V2 invalide');
const loreB64=readParts(LORE_DIR,loreManifest.prefix,loreManifest.parts);
const loreSha=crypto.createHash('sha256').update(loreB64).digest('hex');
if(loreSha!==loreManifest.sha256)throw new Error(`Lore Vérité V2: SHA invalide ${loreSha}`);
const lorePayload=decodeGzipBase64(loreB64,'Lore Vérité V2');
if(lorePayload.schemaVersion!==2||lorePayload.entryCount!==229||Object.keys(lorePayload.lore||{}).length!==229)throw new Error('Lore Vérité V2: contenu incomplet');

const sourceManifest=JSON.parse(fs.readFileSync(SOURCE_MANIFEST,'utf8'));
const sourceB64=fs.readFileSync(path.join(path.dirname(SOURCE_MANIFEST),sourceManifest.file),'utf8').replace(/\s+/g,'');
const source=decodeGzipBase64(sourceB64,'Source Vérité V6');
const sourceByName=new Map(source.entries.map(entry=>[entry.name,entry]));

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const dataset=manifest.datasets.find(x=>x.id===DATASET_ID);if(!dataset)throw new Error('Dataset verite-catalogue absent');
const dataB64=readParts(DATA,dataset.prefix,dataset.parts);
const rows=decodeGzipBase64(dataB64,'Dataset verite-catalogue');
if(rows.length!==229)throw new Error(`Dataset Vérité: ${rows.length} pages, attendu 229`);

const seen=new Set();
for(const article of rows){
  const pair=lorePayload.lore?.[article.title];if(!Array.isArray(pair)||pair.length!==2||pair.some(text=>!String(text||'').trim()))throw new Error(`${article.title}: lore V2 absent`);
  const sourceEntry=sourceByName.get(article.title);if(!sourceEntry)throw new Error(`${article.title}: source Vérité absente`);
  const section=article.sections?.find(x=>x.id==='contexte');if(!section)throw new Error(`${article.title}: section contexte absente`);
  section.blocks=[{type:'p',style:'lore',text:pair[0]},{type:'p',style:'lore',text:pair[1]}];
  article.catalog={...(article.catalog||{}),loreVersion:2,loreEvidence:(sourceEntry.rows||[]).map(row=>String(row?.[0]||'')).filter(Boolean)};
  seen.add(article.title);
}
const missing=Object.keys(lorePayload.lore).filter(title=>!seen.has(title));if(missing.length)throw new Error(`Lore Vérité V2: pages non consommées: ${missing.join(', ')}`);
const written=writeDataset(dataset.prefix,rows);
Object.assign(dataset,written,{quality:{...(dataset.quality||{}),loreVersion:2,maxIdenticalTextRatio:0.60}});
manifest.expectedTotal=manifest.datasets.reduce((sum,x)=>sum+Number(x.count||0),0);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Lore Vérité V2 enrichi — ${rows.length} pages · ${written.parts} fragments · SHA ${written.sha256}`);
