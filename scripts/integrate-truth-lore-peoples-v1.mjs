import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE_DIR='compendium/source/truth-lore-peoples-v1';
const SOURCE_DOCUMENT='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return norm(value).replace(/\s+/g,'-')||'section'}
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function writeDataset(id,pages,prefix){
  removePrefix(prefix);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  const spec=specFor(id);Object.assign(spec,{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});return spec;
}
function paragraphSection(section){return {id:slug(section.title),title:section.title,level:3,blocks:(section.paragraphs||[]).map(text=>({type:'p',style:'lore',text:String(text).trim()})).filter(block=>block.text)}}
function textOf(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])).join(' ')}
function union(...groups){return [...new Set(groups.flat().filter(Boolean))]}
function indexByTitle(pages){const map=new Map();for(const page of pages){const key=norm(page.title);if(!map.has(key))map.set(key,[]);map.get(key).push(page)}return map}
function loadSources(){
  const files=fs.readdirSync(SOURCE_DIR).filter(name=>name.endsWith('.json')).sort();
  if(files.length!==10)throw new Error(`10 sources peuples attendues, ${files.length}`);
  const pages=[];const ids=new Set(),titles=new Set();
  for(const file of files){
    const wrapper=JSON.parse(fs.readFileSync(`${SOURCE_DIR}/${file}`,'utf8'));
    if(wrapper.schemaVersion!==1||wrapper.sourceDocument!==SOURCE_DOCUMENT||!wrapper.page)throw new Error(`${file}: source V6 invalide`);
    const item=wrapper.page;
    if(!item.id||!item.title||!Array.isArray(item.sections)||!item.sections.length)throw new Error(`${file}: page incomplète`);
    if(ids.has(item.id)||titles.has(norm(item.title)))throw new Error(`${file}: doublon source ${item.id} / ${item.title}`);
    ids.add(item.id);titles.add(norm(item.title));pages.push(item);
  }
  const expected=['14. Daemons','16. Aseryns','18. Extrals, Homo Superior et Ad’rak','Talass','Mo’sen','Baséanh','Rocréen','Thalsios','Homo Superior','Ad’rak'];
  for(const title of expected)if(!pages.some(page=>page.title===title))throw new Error(`Source absente: ${title}`);
  return pages;
}
function navFor(title,order){
  if(title==='14. Daemons')return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Daemons',subgroupOrder:40,pageOrder:10};
  if(title==='16. Aseryns')return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Aseryns',subgroupOrder:60,pageOrder:10};
  if(title==='18. Extrals, Homo Superior et Ad’rak')return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Extrals',subgroupOrder:80,pageOrder:10};
  return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Extrals — peuples & profils',subgroupOrder:81,pageOrder:Number(order||500)};
}
function tagsFor(title){
  if(title==='14. Daemons')return ['Vérité','Daemons','Lore V6','Lore book-first'];
  if(title==='16. Aseryns')return ['Vérité','Aseryns','Lore V6','Lore book-first'];
  return ['Vérité','Extrals','Lore V6','Lore book-first',title];
}
function canonical(item,id=item.id){return {id,title:item.title,category:'Vérité',source:SOURCE_DOCUMENT,status:'canon_recent',tags:tagsFor(item.title),nav:navFor(item.title,item.order),loreEvidence:{chapter:item.title,paragraphs:item.evidence||[]},loreBook:{source:'Vérité V6',batch:'peoples-v1'},sections:item.sections.map(paragraphSection)}}

const sourcePages=loadSources();
const truth=loadDataset('verite');
const legacy=loadDataset('lore');
const initialLegacyCount=legacy.length;
const initialTruthCount=truth.length;
const ids=new Set([...truth,...legacy].map(page=>page.id));
let addedTruth=0,replacedTruth=0,replacedLegacy=0;

for(const item of sourcePages){
  let truthIndex=indexByTitle(truth),legacyIndex=indexByTitle(legacy);
  const isHub=['14. Daemons','16. Aseryns','18. Extrals, Homo Superior et Ad’rak'].includes(item.title);
  if(isHub){
    const matches=truthIndex.get(norm(item.title))||[];
    if(matches.length!==1)throw new Error(`${item.title}: ${matches.length} hubs Vérité, attendu 1`);
    const current=matches[0];truth[truth.indexOf(current)]=canonical(item,current.id);replacedTruth++;continue;
  }
  const exact=[...(truthIndex.get(norm(item.title))||[]),...(legacyIndex.get(norm(item.title))||[])];
  let existing=null;
  if(exact.length>1)throw new Error(`${item.title}: ${exact.length} pages exactes visibles`);
  if(exact.length===1)existing=exact[0];
  if(!existing){
    const candidates=[];const seen=new Set();
    for(const alias of item.aliases||[]){const key=norm(alias);for(const page of [...(truthIndex.get(key)||[]),...(legacyIndex.get(key)||[])])if(!seen.has(page.id)){seen.add(page.id);candidates.push(page)}}
    if(candidates.length>1)throw new Error(`${item.title}: alias ambigus (${candidates.map(page=>page.id).join(', ')})`);
    existing=candidates[0]||null;
  }
  if(existing){
    const replacement=canonical(item,existing.id);
    if(truth.includes(existing)){truth[truth.indexOf(existing)]=replacement;replacedTruth++;}
    else {legacy[legacy.indexOf(existing)]=replacement;replacedLegacy++;}
  }else{
    if(ids.has(item.id))throw new Error(`${item.title}: ID déjà utilisé ${item.id}`);
    truth.push(canonical(item));ids.add(item.id);addedTruth++;
  }
}

if(legacy.length!==initialLegacyCount)throw new Error(`Le legacy doit conserver ${initialLegacyCount} pages, ${legacy.length}`);
const visible=[...truth,...legacy.filter(page=>page.category==='Vérité')];
const batch=visible.filter(page=>page.loreBook?.batch==='peoples-v1');
if(batch.length!==10)throw new Error(`10 pages book-first peuples attendues, ${batch.length}`);
for(const item of sourcePages){const matches=visible.filter(page=>norm(page.title)===norm(item.title));if(matches.length!==1)throw new Error(`${item.title}: ${matches.length} pages visibles, attendu 1`)}
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bDéfense occulte\b|\bdifficult[eé]\s*\d+|\bco[uû]t\s*[:—-]|TUC Talent/i;
for(const page of batch){if(forbidden.test(textOf(page)))throw new Error(`${page.title}: mécanique détectée`);if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.title}: table mécanique interdite`)}
const allIds=new Set();for(const page of [...truth,...legacy]){if(allIds.has(page.id))throw new Error(`ID global dupliqué après intégration: ${page.id}`);allIds.add(page.id)}

const truthWritten=writeDataset('verite',truth,'v3-verite-lore-v6');
const loreWritten=writeDataset('lore',legacy,'v3-lore-v4');
removePrefix('v3-verite-lore-v5');removePrefix('v3-lore-v3');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`LORE PEUPLES V6 — 10 pages · ${addedTruth} ajoutées · ${replacedTruth} Vérité remplacées · ${replacedLegacy} legacy réutilisées.`);
console.log(`VÉRITÉ — ${initialTruthCount} -> ${truth.length} pages · ${truthWritten.parts} fragments.`);
console.log(`LORE LEGACY — ${legacy.length} pages · ${loreWritten.parts} fragments · total V3 ${manifest.expectedTotal}.`);
