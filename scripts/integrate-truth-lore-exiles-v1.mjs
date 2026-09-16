import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE='compendium/source/truth-lore-exiles-v1.json';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const source=JSON.parse(fs.readFileSync(SOURCE,'utf8'));

function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return normalize(value).replace(/\s+/g,'-')||'section'}
function specFor(id){const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function writeDataset(id,pages,prefix){
  removePrefix(prefix);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  const spec=specFor(id);spec.prefix=prefix;spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');return spec;
}
function paragraphSection(section){return {id:slug(section.title),title:section.title,level:3,blocks:(section.paragraphs||[]).map(text=>({type:'p',style:'lore',text:String(text).trim()})).filter(block=>block.text)}}
function union(...groups){return [...new Set(groups.flat().filter(Boolean))]}
function indexByTitle(pages){const map=new Map();for(const page of pages){const key=normalize(page.title);if(!map.has(key))map.set(key,[]);map.get(key).push(page)}return map}
function blockText(block){if(block?.type==='table')return JSON.stringify(block.rows||[]);return String(block?.text||'')}
function isMechanicalSection(section){
  if((section.blocks||[]).some(block=>block.type==='table'))return true;
  const text=[section.title,...(section.blocks||[]).map(blockText)].join(' ');
  return /\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bD[eé]fense occulte\b|\bdifficult[eé]\s*\d+|\bco[uû]t\s*[:—-]|\beffet\s*[:—-]|TUC Talent/i.test(text);
}
function findExisting(canonical,truthIndex,legacyIndex){
  const exact=normalize(canonical.title);
  const exactMatches=[...(truthIndex.get(exact)||[]),...(legacyIndex.get(exact)||[])];
  if(exactMatches.length>1)throw new Error(`${canonical.title}: ${exactMatches.length} pages exactes existantes (${exactMatches.map(page=>page.id).join(', ')})`);
  if(exactMatches.length===1)return exactMatches[0];
  const aliases=union(canonical.aliases||[]).map(normalize).filter(Boolean);
  const ids=new Set();const matches=[];
  for(const alias of aliases){for(const page of [...(truthIndex.get(alias)||[]),...(legacyIndex.get(alias)||[])])if(!ids.has(page.id)){ids.add(page.id);matches.push(page)}}
  if(matches.length>1)throw new Error(`${canonical.title}: plusieurs alias existants (${matches.map(page=>`${page.title} [${page.id}]`).join(', ')})`);
  return matches[0]||null;
}
function enrichPage(page,canonical,sourceLabel){
  const replacementTitles=new Set(canonical.sections.map(section=>normalize(section.title)));
  const preserved=(page.sections||[]).filter(section=>!replacementTitles.has(normalize(section.title))&&!isMechanicalSection(section));
  page.title=canonical.title;
  page.category='Vérité';
  page.source=sourceLabel;
  page.status='canon_enrichi';
  page.tags=union(page.tags||[],canonical.tags);
  page.nav=canonical.nav;
  page.loreEvidence=canonical.loreEvidence;
  page.sections=[...canonical.sections,...preserved];
}
function flatText(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).map(block=>blockText(block))).join(' ')}

if(source.schemaVersion!==1||source.sourceDocument!=='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx')throw new Error('Source Exilés V6 invalide');
if(!Array.isArray(source.pages)||source.pages.length!==7)throw new Error(`7 pages Exilés attendues, ${source.pages?.length||0}`);

const truth=loadDataset('verite');
const legacy=loadDataset('lore');
const originalTruthCount=truth.length;
const originalLegacyCount=legacy.length;
const ids=new Set([...truth,...legacy].map(page=>page.id));
const sourceLabel=source.sourceDocument;
let truthIndex=indexByTitle(truth),legacyIndex=indexByTitle(legacy);
let added=0,enrichedTruth=0,enrichedLegacy=0;
const resolved=[];

for(const item of source.pages){
  const canonical={
    id:item.id,title:item.title,aliases:item.aliases||[],category:'Vérité',source:sourceLabel,status:'canon_recent',
    tags:['Vérité','Exilés','Lore V6','Lore V6 Exilés',item.title],
    nav:{group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Exilés',subgroupOrder:18,pageOrder:Number(item.order||500)},
    loreEvidence:{chapter:'17. Exilés — peuples, fonctions et traditions',paragraphs:item.evidence||[]},
    sections:(item.sections||[]).map(paragraphSection),
  };
  const existing=findExisting(canonical,truthIndex,legacyIndex);
  if(existing){
    enrichPage(existing,canonical,sourceLabel);
    if(truth.includes(existing))enrichedTruth++;else enrichedLegacy++;
    resolved.push({title:canonical.title,id:existing.id,dataset:truth.includes(existing)?'verite':'lore'});
  }else{
    if(ids.has(canonical.id))throw new Error(`${canonical.title}: ID déjà utilisé ${canonical.id}`);
    const page={...canonical};delete page.aliases;truth.push(page);ids.add(page.id);added++;
    resolved.push({title:canonical.title,id:page.id,dataset:'verite'});
  }
  truthIndex=indexByTitle(truth);legacyIndex=indexByTitle(legacy);
}

const visible=[...truth,...legacy.filter(page=>page.category==='Vérité')];
for(const item of source.pages){const matches=visible.filter(page=>normalize(page.title)===normalize(item.title));if(matches.length!==1)throw new Error(`${item.title}: ${matches.length} pages visibles après intégration`)}
const targets=visible.filter(page=>(page.tags||[]).includes('Lore V6 Exilés'));
if(targets.length!==7)throw new Error(`7 pages Exilés V6 attendues après intégration, ${targets.length}`);
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bD[eé]fense occulte\b|\bdifficult[eé]\s*\d+/i;
for(const page of targets){if(forbidden.test(flatText(page)))throw new Error(`${page.title}: mécanique détectée dans le lore Exilé`);if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.title}: table mécanique interdite`)}
if(legacy.length!==originalLegacyCount)throw new Error(`Le dataset lore doit rester à ${originalLegacyCount} pages, ${legacy.length}`);

const writtenTruth=writeDataset('verite',truth,'v3-verite-lore-v3');
const writtenLegacy=writeDataset('lore',legacy,'v3-lore-v3');
for(const prefix of ['v3-verite-lore-v2','v3-lore-v2'])removePrefix(prefix);
manifest.expectedTotal=manifest.datasets.reduce((sum,dataset)=>sum+Number(dataset.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`LORE EXILÉS V6 — 7 pages · ${added} ajoutées · ${enrichedTruth} Vérité enrichies · ${enrichedLegacy} IDs legacy conservés.`);
for(const item of resolved)console.log(`  ${item.dataset.padEnd(6)} ${item.id} — ${item.title}`);
console.log(`VÉRITÉ — ${originalTruthCount} -> ${truth.length} pages · ${writtenTruth.parts} fragments.`);
console.log(`LORE LEGACY — ${legacy.length} pages · ${writtenLegacy.parts} fragments · total V3 ${manifest.expectedTotal}.`);
