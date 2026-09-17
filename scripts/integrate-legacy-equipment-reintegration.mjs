import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT='character-builder/rulesets/terra-umbra/reality';
const SAFE=path.join(ROOT,'safe');
const SOURCE='compendium/source';
const PARTS=[1,2,3].map(n=>`${SOURCE}/legacy-reintegration-part${n}-v1.json`);
const LORE_OUT=`${SOURCE}/reality-lore-v3-curated-legacy-reintegration.json`;
const RESULT_OUT=`${SOURCE}/legacy-reintegration-result-v1.json`;
const EXPECTED_SOURCE=60;
const BASE_COUNT=261;
const FINAL_COUNT=321;
const FRAGMENT_SIZE=50000;

const clean=s=>String(s??'').trim().replace(/\s+/g,' ');
const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slug=s=>norm(s).replace(/\s+/g,'-').replace(/^-+|-+$/g,'')||'item';
const cleanB64=s=>String(s).replace(/^\uFEFF/,'').replace(/\s+/g,'');

function loadCatalog(){
  const manifest=JSON.parse(fs.readFileSync(path.join(SAFE,'equipment.manifest.json'),'utf8'));
  if(!Array.isArray(manifest.chunks)||!manifest.chunks.length)throw new Error('Manifeste équipement safe invalide.');
  const b64=manifest.chunks.map(file=>cleanB64(fs.readFileSync(path.join(SAFE,file),'utf8'))).join('');
  const catalog=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
  if(!catalog||!Array.isArray(catalog.entries))throw new Error('Catalogue équipement actif invalide.');
  return {manifest,catalog};
}
function writeCatalog(manifest,catalog){
  const json=JSON.stringify(catalog);
  const b64=zlib.gzipSync(Buffer.from(json,'utf8'),{level:9}).toString('base64');
  for(const file of fs.readdirSync(SAFE))if(/^equipment\.part\d+\.b64$/i.test(file))fs.unlinkSync(path.join(SAFE,file));
  const chunks=[];
  for(let i=0;i<b64.length;i+=FRAGMENT_SIZE){
    const file=`equipment.part${String(chunks.length+1).padStart(2,'0')}.b64`;
    chunks.push(file);
    fs.writeFileSync(path.join(SAFE,file),b64.slice(i,i+FRAGMENT_SIZE)+'\n');
  }
  manifest.encoding='gzip+base64-split';
  manifest.chunks=chunks;
  manifest.entries=catalog.entries.length;
  manifest.source='TUC Reality equipment catalog + legacy arsenal/armor reintegration 2026-09-17';
  fs.writeFileSync(path.join(SAFE,'equipment.manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  fs.writeFileSync(path.join(ROOT,'equipment.json.gz.b64'),b64+'\n');
  return {chunks:chunks.length,b64Length:b64.length};
}
function paragraph1(entry){
  return `${entry.name} provient du catalogue historique « ${entry.source} ». La fiche source le présente comme ${clean(entry.summary)}.`;
}
function paragraph2(entry){
  return `${clean(entry.usage)}. Cette réintégration conserve cette fonction, ses contraintes et son positionnement sans ajouter d’élément de lore absent du document d’origine.`;
}

const sources=PARTS.flatMap(file=>{
  const part=JSON.parse(fs.readFileSync(file,'utf8'));
  if(!Array.isArray(part.entries)||part.entries.length!==20)throw new Error(`${file}: 20 entrées attendues.`);
  return part.entries;
});
if(sources.length!==EXPECTED_SOURCE)throw new Error(`Corpus legacy: ${sources.length}/${EXPECTED_SOURCE}.`);
const sourceNames=new Set(),legacyKeys=new Set();
for(const entry of sources){
  if(!entry.name||!entry.legacyName||!entry.category||!entry.source||!entry.builder||!entry.summary||!entry.usage)throw new Error(`Entrée legacy incomplète: ${JSON.stringify(entry)}`);
  const nameKey=norm(entry.name),legacyKey=`${norm(entry.source)}|${norm(entry.legacyName)}`;
  if(sourceNames.has(nameKey))throw new Error(`Nom canonique legacy dupliqué: ${entry.name}`);
  if(legacyKeys.has(legacyKey))throw new Error(`Occurrence source dupliquée: ${entry.source} / ${entry.legacyName}`);
  sourceNames.add(nameKey);legacyKeys.add(legacyKey);
}

const {manifest,catalog}=loadCatalog();
if(![BASE_COUNT,FINAL_COUNT].includes(catalog.entries.length))throw new Error(`Taille initiale inattendue: ${catalog.entries.length}.`);
const byName=new Map(catalog.entries.map(entry=>[norm(entry.name),entry]));
let added=0,verified=0;
const installed=[];
for(const source of sources){
  const id=slug(`${source.category}-${source.name}`);
  const wanted={id,name:source.name,category:source.category,...source.builder};
  const current=byName.get(norm(source.name));
  if(current){
    if(current.id!==id)throw new Error(`${source.name}: ID existant inattendu ${current.id} != ${id}.`);
    verified++;
  }else{
    if(catalog.entries.some(entry=>entry.id===id))throw new Error(`${source.name}: ID déjà utilisé ${id}.`);
    catalog.entries.push(wanted);byName.set(norm(source.name),wanted);added++;
  }
  installed.push({legacyName:source.legacyName,name:source.name,id,category:source.category,source:source.source});
}
if(catalog.entries.length!==FINAL_COUNT)throw new Error(`Catalogue final ${catalog.entries.length}/${FINAL_COUNT}.`);
const lore={schemaVersion:1,source:'Corpus historique armes/armures TUC fourni par l’utilisateur — réintégration modernisée sans ajout de canon',entries:{}};
for(const entry of sources){
  const paragraphs=[paragraph1(entry),paragraph2(entry)];
  if(paragraphs.some(p=>p.length<70))throw new Error(`${entry.name}: paragraphe lore trop court.`);
  lore.entries[entry.name]={paragraphs,source:`${entry.source} — fiche historique réintégrée`};
}
fs.writeFileSync(LORE_OUT,JSON.stringify(lore,null,2)+'\n');
const written=writeCatalog(manifest,catalog);
fs.writeFileSync(RESULT_OUT,JSON.stringify({version:1,sourceCount:sources.length,baseCount:BASE_COUNT,finalCount:catalog.entries.length,added,verified,chunks:written.chunks,entries:installed},null,2)+'\n');
console.log(`Réintégration legacy: ${sources.length} sources · ${added} ajoutées · ${verified} déjà synchronisées · Builder ${catalog.entries.length} entrées · ${written.chunks} fragments.`);
