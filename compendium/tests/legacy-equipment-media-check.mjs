import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MAP='compendium/source/legacy-equipment-media-v1.json';
const RESULT='compendium/source/legacy-equipment-media-result-v1.json';
const EXPECTED=60;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function load(spec){let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));}
function webp(file){const b=fs.readFileSync(file);return b.length>=12&&b.subarray(0,4).toString('ascii')==='RIFF'&&b.subarray(8,12).toString('ascii')==='WEBP';}

const media=JSON.parse(fs.readFileSync(MAP,'utf8'));
if(media.count!==EXPECTED||media.entries.length!==EXPECTED)throw new Error(`Carte média ${media.entries.length}/${EXPECTED}`);
const composite=new Set(),paths=new Set();
for(const item of media.entries){
  const k=`${norm(item.source)}|${norm(item.legacyName)}`;
  if(composite.has(k))throw new Error(`Source média dupliquée: ${k}`);composite.add(k);
  if(paths.has(item.image))throw new Error(`Chemin média dupliqué: ${item.image}`);paths.add(item.image);
  if(!item.image.startsWith('images/manual/equipment-legacy/')||!item.image.endsWith('.webp'))throw new Error(`Chemin média non géré: ${item.image}`);
  const file=`compendium/${item.image}`;
  if(!fs.existsSync(file)||!webp(file))throw new Error(`WebP absent/invalide: ${file}`);
  const sha=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if(sha!==item.sha256)throw new Error(`SHA média différent: ${item.image}`);
  if(Number(item.width)<100||Number(item.height)<100)throw new Error(`Dimensions source invalides: ${item.image}`);
}
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
if(manifest.expectedTotal!==1862)throw new Error(`Total V3 ${manifest.expectedTotal}/1862`);
const spec=manifest.datasets.find(item=>item.id==='equipement');
const pages=load(spec);if(pages.length!==357)throw new Error(`Équipement ${pages.length}/357`);
const result=JSON.parse(fs.readFileSync(RESULT,'utf8'));
if(result.count!==EXPECTED||result.entries.length!==EXPECTED)throw new Error(`Résultat média ${result.entries.length}/${EXPECTED}`);
const byId=new Map(pages.map(page=>[page.id,page]));
for(const row of result.entries){
  const page=byId.get(row.pageId);if(!page)throw new Error(`Page média absente: ${row.pageId}`);
  if(page.illustration?.src!==row.image)throw new Error(`${row.title}: illustration ${page.illustration?.src||'absente'} != ${row.image}`);
  if(page.catalog?.mediaSource!=='legacy-tuc-docx')throw new Error(`${row.title}: provenance média absente`);
}
console.log(`Médias legacy OK — ${EXPECTED} illustrations WebP reliées aux 60 nouvelles entrées · équipement ${pages.length} · total V3 ${manifest.expectedTotal}.`);
