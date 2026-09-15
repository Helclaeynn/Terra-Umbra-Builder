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
function locateCards(decoded){
  if(Array.isArray(decoded)) return {cards:decoded,path:'$'};
  if(!decoded||typeof decoded!=='object') return {cards:null,path:null};
  const direct=['cards','entries','items','mechanics','techCards','tech_cards'];
  for(const key of direct) if(Array.isArray(decoded[key])) return {cards:decoded[key],path:`$.${key}`};
  const arrays=Object.entries(decoded).filter(([,value])=>Array.isArray(value)).sort((a,b)=>b[1].length-a[1].length);
  return arrays.length?{cards:arrays[0][1],path:`$.${arrays[0][0]}`}:{cards:null,path:null};
}
function asObject(card,columns){
  if(!Array.isArray(card)) return card||{};
  const out={};
  for(let i=0;i<card.length;i++) out[String(columns?.[i]??i)]=card[i];
  return out;
}
function firstString(obj,keys){
  for(const key of keys){const value=obj?.[key];if(typeof value==='string'&&value.trim()) return value.trim()}
  return '';
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

const located=locateCards(decoded),rawCards=located.cards;
if(!Array.isArray(rawCards)) throw new Error('Impossible de localiser les cartes V6');
if(rawCards.length!==882||rawCards.length!==manifest.entries) throw new Error(`Cartes V6: ${rawCards.length}, attendu 882`);
const columns=Array.isArray(decoded?.columns)?decoded.columns:[];
const cards=rawCards.map(card=>asObject(card,columns));

const rootKeys=decoded&&typeof decoded==='object'&&!Array.isArray(decoded)?Object.keys(decoded):[];
console.log(`ROOT — object · keys ${rootKeys.join(', ')||'—'} · chemin ${located.path}`);
console.log(`COLUMNS — ${JSON.stringify(columns)}`);

const builder=walkArrays(BUILDER_ROOT);
if(builder.length!==347) throw new Error(`Builder Vérité: ${builder.length}, attendu 347`);
const builderByName=new Map();
for(const row of builder){const key=normalize(row.name);if(!builderByName.has(key))builderByName.set(key,[]);builderByName.get(key).push(row)}

const titleKeys=['name','title','talent','ability','capacity','heading','label','nom','Nom','4'];
const chapterKeys=['chapter','chapitre','domain','nature','category','0'];
const sectionKeys=['section','family','group','1'];
const subgroupKeys=['subsection','subgroup','path','2'];
const candidates=cards.map((card,index)=>({
  index,card,
  title:firstString(card,titleKeys),
  chapter:firstString(card,chapterKeys),
  section:firstString(card,sectionKeys),
  subgroup:firstString(card,subgroupKeys),
}));
const named=candidates.filter(row=>row.title);
const exact=named.filter(row=>builderByName.has(normalize(row.title)));
const exactUnique=new Set(exact.map(row=>normalize(row.title)));
const chapterCounts=new Map(),sectionCounts=new Map();
for(const row of candidates){
  chapterCounts.set(row.chapter||'(sans chapitre)',(chapterCounts.get(row.chapter||'(sans chapitre)')||0)+1);
  const section=`${row.chapter||'—'} · ${row.section||'—'}`;sectionCounts.set(section,(sectionCounts.get(section)||0)+1);
}

console.log(`TRUTH V6 SOURCE — ${cards.length} cartes · 8 fragments · SHA ${hashMode} validé.`);
console.log(`TITLE CANDIDATES — ${named.length}/${cards.length}`);
for(const row of candidates.slice(0,8)) console.log(`SAMPLE ${row.index+1} | chapitre=${row.chapter} | section=${row.section} | sous=${row.subgroup} | nom=${row.title}`);
console.log(`BUILDER — ${builder.length} capacités · ${builderByName.size} noms normalisés.`);
console.log(`OVERLAP EXACT TITLE — ${exact.length} cartes / ${exactUnique.size} noms Builder distincts.`);
console.log('CHAPTER COUNTS');
for(const [chapter,count] of [...chapterCounts.entries()].sort((a,b)=>String(a[0]).localeCompare(String(b[0]),'fr'))) console.log(`  ${chapter}: ${count}`);
console.log('TOP SECTIONS');
for(const [section,count] of [...sectionCounts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr')).slice(0,40)) console.log(`  ${section}: ${count}`);

const unmatched=named.filter(row=>!builderByName.has(normalize(row.title)));
console.log(`UNMATCHED NAMED — ${unmatched.length}`);
for(const row of unmatched.slice(0,80)) console.log(`  ${row.index+1} | ch.${row.chapter||'—'} | ${row.section||'—'} | ${row.subgroup||'—'} | ${row.title}`);
