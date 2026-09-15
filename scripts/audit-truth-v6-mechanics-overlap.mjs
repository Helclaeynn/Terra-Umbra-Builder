import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const SOURCE_DIR='compendium/source';
const MANIFEST=`${SOURCE_DIR}/truth-mechanics-v6-fixed.manifest.json`;
const BUILDER_ROOT='character-builder/rulesets/terra-umbra/truth/talents';

function sha(value){return crypto.createHash('sha256').update(value).digest('hex')}
function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function walkArrays(root){
  const rows=[];
  function walk(dir){
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
      const full=path.join(dir,entry.name);
      if(entry.isDirectory()) walk(full);
      else if(entry.isFile()&&entry.name.endsWith('.json')){
        const parsed=JSON.parse(fs.readFileSync(full,'utf8'));
        if(Array.isArray(parsed)) for(const item of parsed) if(item&&item.name) rows.push({...item,__file:full.replaceAll('\\','/')});
      }
    }
  }
  walk(root);return rows;
}
function stringFields(obj){return Object.entries(obj||{}).filter(([,value])=>typeof value==='string').map(([key,value])=>[key,value])}
function titleCandidate(card){
  for(const key of ['name','title','talent','ability','capacity','heading','label']) if(typeof card?.[key]==='string'&&card[key].trim()) return card[key].trim();
  return '';
}
function chapterCandidate(card){
  for(const key of ['chapter','domain','nature','section','family','category']) if(typeof card?.[key]==='string'&&card[key].trim()) return card[key].trim();
  return '';
}
function locateCards(decoded){
  if(Array.isArray(decoded)) return {cards:decoded,path:'$'};
  if(!decoded||typeof decoded!=='object') return {cards:null,path:null};
  const direct=['cards','entries','items','mechanics','techCards','tech_cards'];
  for(const key of direct) if(Array.isArray(decoded[key])) return {cards:decoded[key],path:`$.${key}`};
  const arrays=Object.entries(decoded).filter(([,value])=>Array.isArray(value)).sort((a,b)=>b[1].length-a[1].length);
  if(arrays.length) return {cards:arrays[0][1],path:`$.${arrays[0][0]}`};
  for(const [key,value] of Object.entries(decoded)){
    if(!value||typeof value!=='object'||Array.isArray(value)) continue;
    const nested=Object.entries(value).filter(([,candidate])=>Array.isArray(candidate)).sort((a,b)=>b[1].length-a[1].length);
    if(nested.length) return {cards:nested[0][1],path:`$.${key}.${nested[0][0]}`};
  }
  return {cards:null,path:null};
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
if(manifest.encoding!=='gzip+base64-parts') throw new Error(`Encodage V6 inattendu: ${manifest.encoding}`);
if(!Array.isArray(manifest.parts)||manifest.parts.length!==8) throw new Error(`Fragments V6: ${manifest.parts?.length||0}, attendu 8`);

let b64='';
for(const part of manifest.parts){
  const file=`${SOURCE_DIR}/${part}`;
  if(!fs.existsSync(file)) throw new Error(`Fragment V6 absent: ${part}`);
  b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
}
const gzipBytes=Buffer.from(b64,'base64');
const jsonBytes=zlib.gunzipSync(gzipBytes);
const decoded=JSON.parse(jsonBytes.toString('utf8'));
const hashes={base64:sha(Buffer.from(b64,'utf8')),gzip:sha(gzipBytes),json:sha(jsonBytes)};
const hashMode=Object.entries(hashes).find(([,value])=>value===manifest.sha256)?.[0]||null;
if(!hashMode) throw new Error(`SHA V6 non reconnu: manifeste ${manifest.sha256}; calculés ${JSON.stringify(hashes)}`);

const rootKeys=decoded&&typeof decoded==='object'&&!Array.isArray(decoded)?Object.keys(decoded):[];
const rootArrays=decoded&&typeof decoded==='object'&&!Array.isArray(decoded)?Object.entries(decoded).filter(([,value])=>Array.isArray(value)).map(([key,value])=>`${key}:${value.length}`):[];
const located=locateCards(decoded);
const cards=located.cards;
console.log(`ROOT — ${Array.isArray(decoded)?'array':'object'} · keys ${rootKeys.join(', ')||'—'} · arrays ${rootArrays.join(' · ')||'—'}`);
if(!Array.isArray(cards)) throw new Error('Impossible de localiser le tableau des cartes V6 dans l’enveloppe décodée');
if(cards.length!==manifest.entries||cards.length!==882) throw new Error(`Cartes V6: ${cards.length}, attendu ${manifest.entries}/882 (chemin ${located.path})`);

const builder=walkArrays(BUILDER_ROOT);
if(builder.length!==347) throw new Error(`Builder Vérité: ${builder.length}, attendu 347`);
const builderByName=new Map();
for(const row of builder){const key=normalize(row.name);if(!builderByName.has(key))builderByName.set(key,[]);builderByName.get(key).push(row)}

const keys=[...new Set(cards.flatMap(card=>Object.keys(card||{})))].sort();
const stringFieldCounts=new Map();
for(const card of cards) for(const [key,value] of stringFields(card)) if(value.trim()) stringFieldCounts.set(key,(stringFieldCounts.get(key)||0)+1);
const candidates=cards.map((card,index)=>({index,card,title:titleCandidate(card),chapter:chapterCandidate(card)}));
const named=candidates.filter(row=>row.title);
const exact=named.filter(row=>builderByName.has(normalize(row.title)));
const exactUnique=new Set(exact.map(row=>normalize(row.title)));
const chapterCounts=new Map();
for(const row of candidates){const key=row.chapter||'(sans chapitre détecté)';chapterCounts.set(key,(chapterCounts.get(key)||0)+1)}

console.log(`TRUTH V6 SOURCE — ${cards.length} cartes · chemin ${located.path} · 8 fragments · SHA ${hashMode} validé.`);
console.log(`SCHEMA — ${keys.join(', ')}`);
console.log(`STRING FIELDS — ${[...stringFieldCounts.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(' · ')}`);
console.log(`TITLE CANDIDATES — ${named.length}/${cards.length}`);
for(const row of candidates.slice(0,8)) console.log(`SAMPLE ${row.index+1} | ${JSON.stringify(row.card)}`);
console.log(`BUILDER — ${builder.length} capacités · ${builderByName.size} noms normalisés.`);
console.log(`OVERLAP EXACT TITLE — ${exact.length} cartes / ${exactUnique.size} noms Builder distincts.`);
console.log('CHAPTER/DISCRIMINATOR COUNTS');
for(const [chapter,count] of [...chapterCounts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr'))) console.log(`  ${chapter}: ${count}`);

if(named.length){
  const unmatched=named.filter(row=>!builderByName.has(normalize(row.title)));
  console.log(`UNMATCHED NAMED — ${unmatched.length}`);
  for(const row of unmatched.slice(0,60)) console.log(`  ${row.index+1} | ${row.chapter||'—'} | ${row.title}`);
}
