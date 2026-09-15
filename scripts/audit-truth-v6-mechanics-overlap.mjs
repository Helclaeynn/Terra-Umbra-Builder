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
function clean(value){return value==null?'':String(value).trim()}
function inc(map,key,n=1){map.set(key,(map.get(key)||0)+n)}

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
if(!columns.includes('chapter')||!columns.includes('heading3')||!columns.includes('heading4')||!columns.includes('title')||!columns.includes('text')) throw new Error(`Colonnes V6 inattendues: ${JSON.stringify(columns)}`);

const builder=walkArrays(BUILDER_ROOT);
if(builder.length!==347) throw new Error(`Builder Vérité: ${builder.length}, attendu 347`);
const builderByName=new Map();
for(const row of builder){const key=normalize(row.name);if(!builderByName.has(key))builderByName.set(key,[]);builderByName.get(key).push(row)}

const rows=cards.map((card,index)=>{
  const title=clean(card.title),chapter=clean(card.chapter),h3=clean(card.heading3),h4=clean(card.heading4),h5=clean(card.heading5),text=clean(card.text);
  const matches=builderByName.get(normalize(title))||[];
  return {index:index+1,title,chapter,h3,h4,h5,text,matches,exact:matches.length>0};
});
if(rows.some(row=>!row.title)) throw new Error('Une carte V6 au moins ne possède pas de titre');

const chapterStats=new Map(),headingStats=new Map();
for(const row of rows){
  if(!chapterStats.has(row.chapter)) chapterStats.set(row.chapter,{total:0,exact:0,unmatched:0,titles:new Set()});
  const stat=chapterStats.get(row.chapter);stat.total++;stat.titles.add(normalize(row.title));if(row.exact)stat.exact++;else stat.unmatched++;
  const pathKey=[row.chapter,row.h3||'—',row.h4||'—',row.h5||'—'].join(' › ');
  if(!headingStats.has(pathKey)) headingStats.set(pathKey,{total:0,exact:0,unmatched:0});
  const hs=headingStats.get(pathKey);hs.total++;if(row.exact)hs.exact++;else hs.unmatched++;
}
const exact=rows.filter(row=>row.exact),unmatched=rows.filter(row=>!row.exact);
const exactNames=new Set(exact.map(row=>normalize(row.title)));
const v6NameCounts=new Map();for(const row of rows)inc(v6NameCounts,normalize(row.title));
const duplicateV6Names=[...v6NameCounts.entries()].filter(([,count])=>count>1).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr'));

console.log(`TRUTH V6 SOURCE — ${rows.length} cartes · 8 fragments · SHA ${hashMode} validé.`);
console.log(`COLUMNS — ${JSON.stringify(columns)}`);
console.log(`BUILDER — ${builder.length} capacités · ${builderByName.size} noms normalisés.`);
console.log(`OVERLAP EXACT TITLE — ${exact.length} cartes / ${exactNames.size} noms Builder distincts.`);
console.log(`V6 EXACT-TITLE UNMATCHED — ${unmatched.length} cartes.`);
console.log(`V6 DUPLICATE TITLES — ${duplicateV6Names.length} noms répétés.`);
console.log('CHAPTER COVERAGE');
for(const [chapter,stat] of [...chapterStats.entries()].sort((a,b)=>Number(a[0])-Number(b[0]))) console.log(`  ch.${chapter}: ${stat.total} cartes · exact Builder ${stat.exact} · hors exact ${stat.unmatched} · ${stat.titles.size} titres distincts`);
console.log('HEADING GROUPS');
for(const [group,stat] of [...headingStats.entries()].sort((a,b)=>Number(a[0].split(' › ')[0])-Number(b[0].split(' › ')[0])||a[0].localeCompare(b[0],'fr'))) console.log(`  ${group}: ${stat.total} · exact ${stat.exact} · hors exact ${stat.unmatched}`);
console.log('DUPLICATE TITLES — TOP 30');
for(const [title,count] of duplicateV6Names.slice(0,30)) console.log(`  ${title}: ${count}`);
console.log('UNMATCHED — FIRST 120');
for(const row of unmatched.slice(0,120)) console.log(`  ${row.index} | ch.${row.chapter} | ${row.h3||'—'} | ${row.h4||'—'} | ${row.h5||'—'} | ${row.title}`);
