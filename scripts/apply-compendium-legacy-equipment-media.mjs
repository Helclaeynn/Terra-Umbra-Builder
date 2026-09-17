import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const MEDIA_MAP='compendium/source/legacy-equipment-media-v1.json';
const RESOLUTION='compendium/source/legacy-equipment-resolution-v1.json';
const SOURCE_PARTS=[1,2,3].map(n=>`compendium/source/legacy-reintegration-part${n}-v1.json`);
const RESULT='compendium/source/legacy-equipment-media-result-v1.json';
const FRAGMENT_SIZE=8000;
const EXPECTED_SOURCE=124;
const EXPECTED_REINTEGRATED=60;
const EXPECTED_RESOLVED=64;
const EXPECTED_INSTALLED=123;
const EXPECTED_SKIPPED=1;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const key=(source,legacyName)=>`${norm(source)}|${norm(legacyName)}`;

function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function write(spec,pages){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');
  const parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
}
function assertWebp(file){
  const b=fs.readFileSync(file);
  if(b.length<12||b.subarray(0,4).toString('ascii')!=='RIFF'||b.subarray(8,12).toString('ascii')!=='WEBP')throw new Error(`${file}: WebP invalide`);
}

if(!fs.existsSync(MEDIA_MAP))throw new Error('Carte média legacy absente.');
const media=JSON.parse(fs.readFileSync(MEDIA_MAP,'utf8'));
if(media.count!==EXPECTED_SOURCE||media.installCount!==EXPECTED_INSTALLED||!Array.isArray(media.entries)||media.entries.length!==EXPECTED_SOURCE){
  throw new Error(`Carte média: ${media.entries?.length||0}/${EXPECTED_SOURCE}, installables ${media.installCount||0}/${EXPECTED_INSTALLED}`);
}
const sourceEntries=SOURCE_PARTS.flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).entries||[]);
const sourceByKey=new Map(sourceEntries.map(entry=>[key(entry.source,entry.legacyName),entry]));
if(sourceByKey.size!==EXPECTED_REINTEGRATED)throw new Error(`Corpus de réintégration: ${sourceByKey.size}/${EXPECTED_REINTEGRATED}`);
const resolution=JSON.parse(fs.readFileSync(RESOLUTION,'utf8'));
const resolved=resolution.resolved||[];
if(resolved.length!==EXPECTED_RESOLVED)throw new Error(`Résolution moderne: ${resolved.length}/${EXPECTED_RESOLVED}`);
const resolvedByLegacy=new Map();
for(const entry of resolved){
  const k=norm(entry.legacyName);
  if(resolvedByLegacy.has(k))throw new Error(`Legacy résolu dupliqué: ${entry.legacyName}`);
  resolvedByLegacy.set(k,entry);
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(item=>item.id==='equipement');
if(!spec)throw new Error('Dataset equipement absent.');
const pages=load(spec);
if(pages.length!==357)throw new Error(`Équipement: ${pages.length}/357 pages.`);
const byTitle=new Map(pages.map(page=>[norm(page.title),page]));
const seenKeys=new Set(),seenPages=new Set(),installed=[],skipped=[];

for(const item of media.entries){
  const mediaKey=key(item.source,item.legacyName);
  if(seenKeys.has(mediaKey))throw new Error(`Média source dupliqué: ${item.source} / ${item.legacyName}`);
  seenKeys.add(mediaKey);

  const source=sourceByKey.get(mediaKey);
  const modern=source?null:resolvedByLegacy.get(norm(item.legacyName));
  if(!source&&!modern)throw new Error(`Aucune cible canonique: ${item.source} / ${item.legacyName}`);
  const targetName=source?.name||modern.currentName;

  const repoFile=path.join('compendium',item.image);
  if(!fs.existsSync(repoFile))throw new Error(`${targetName}: média absent ${repoFile}`);
  assertWebp(repoFile);
  const digest=crypto.createHash('sha256').update(fs.readFileSync(repoFile)).digest('hex');
  if(item.sha256&&digest!==item.sha256)throw new Error(`${targetName}: SHA média différent`);

  if(item.install===false){
    skipped.push({source:item.source,legacyName:item.legacyName,targetName,image:item.image,reason:item.collisionPolicy||'explicitly skipped'});
    continue;
  }

  const page=byTitle.get(norm(targetName));
  if(!page)throw new Error(`Page Compendium introuvable pour ${targetName}`);
  if(seenPages.has(page.id))throw new Error(`Deux médias legacy ciblent la même page: ${page.title}`);
  seenPages.add(page.id);
  page.illustration={src:item.image,alt:`${page.title} — illustration`};
  page.catalog={...(page.catalog||{}),mediaSource:'legacy-tuc-docx',mediaLegacyName:item.legacyName,mediaLegacyDocument:item.source};
  installed.push({pageId:page.id,title:page.title,targetName,source:item.source,legacyName:item.legacyName,image:item.image,sha256:digest});
}

if(seenKeys.size!==EXPECTED_SOURCE)throw new Error(`Sources média traitées: ${seenKeys.size}/${EXPECTED_SOURCE}`);
if(installed.length!==EXPECTED_INSTALLED||seenPages.size!==EXPECTED_INSTALLED)throw new Error(`Médias installés: ${installed.length}/${EXPECTED_INSTALLED}`);
if(skipped.length!==EXPECTED_SKIPPED)throw new Error(`Médias ignorés: ${skipped.length}/${EXPECTED_SKIPPED}`);
if(norm(skipped[0]?.legacyName)!==norm('CB Hunter')||norm(skipped[0]?.targetName)!==norm('Owl LC-014 Chasseur'))throw new Error('Collision Hunter inattendue.');

write(spec,pages);
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);
if(manifest.expectedTotal!==1862)throw new Error(`Total V3 modifié: ${manifest.expectedTotal}/1862`);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(RESULT,JSON.stringify({version:2,sourceCount:EXPECTED_SOURCE,count:installed.length,skippedCount:skipped.length,entries:installed,skipped},null,2)+'\n');
console.log(`Médias legacy intégrés — ${installed.length} fiches illustrées depuis ${EXPECTED_SOURCE} occurrences source (${skipped.length} collision explicitement ignorée) · équipement ${pages.length} · total V3 ${manifest.expectedTotal}.`);
