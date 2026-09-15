import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE_DIR='compendium/source/truth-lore-corruption-fleaux-v1';
const SOURCE_DOCUMENT='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx';
const BATCH='corruption-fleaux-v1';
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
function textOf(page){return [page.title||'',...(page.sections||[]).flatMap(section=>[section.title||'',...(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])])].join(' ')}

const REQUIRED=new Map([
  ['verite-056-20-corruption','verite'],
  ['verite-057-21-les-six-fleaux-et-le-faux-septieme','verite'],
  ['lore-plagues-contexte','lore'],
  ['lore-plagues-vhodhal-nactru','lore'],
  ['lore-plagues-mloxol-vaagor','lore'],
  ['lore-plagues-uxsharith-bellatheis','lore'],
  ['lore-plagues-cthath-vhadhi','lore'],
  ['lore-plagues-gajh-shaoggith','lore'],
  ['lore-plagues-kthuhuthlul','lore'],
  ['lore-plagues-delanial','lore'],
]);

function loadSources(){
  const files=fs.readdirSync(SOURCE_DIR).filter(name=>name.endsWith('.json')).sort();
  if(files.length!==10)throw new Error(`10 sources Corruption/Fléaux attendues, ${files.length}`);
  const pages=[];
  for(const file of files){
    const wrapper=JSON.parse(fs.readFileSync(`${SOURCE_DIR}/${file}`,'utf8'));
    if(wrapper.schemaVersion!==1||wrapper.sourceDocument!==SOURCE_DOCUMENT||wrapper.batch!==BATCH||!wrapper.page)throw new Error(`${file}: source V6 invalide`);
    const item=wrapper.page;
    if(!item.targetDataset||!item.targetId||!item.title||!item.nav?.group||!Array.isArray(item.sections)||!item.sections.length)throw new Error(`${file}: page source incomplète`);
    if(!REQUIRED.has(item.targetId)||REQUIRED.get(item.targetId)!==item.targetDataset)throw new Error(`${file}: cible inattendue ${item.targetDataset}/${item.targetId}`);
    pages.push(item);
  }
  const seen=new Set();for(const item of pages){if(seen.has(item.targetId))throw new Error(`Cible source dupliquée: ${item.targetId}`);seen.add(item.targetId)}
  for(const id of REQUIRED.keys())if(!seen.has(id))throw new Error(`Source attendue absente: ${id}`);
  return pages;
}

const sources=loadSources();
const truth=loadDataset('verite');
const legacy=loadDataset('lore');
const initialTruthCount=truth.length;
const initialLegacyCount=legacy.length;
const oldTruthPrefix=specFor('verite').prefix;
const oldLorePrefix=specFor('lore').prefix;
const replaced=[];

for(const item of sources){
  const target=item.targetDataset==='verite'?truth:legacy;
  const matches=target.filter(page=>page.id===item.targetId);
  if(matches.length!==1)throw new Error(`${item.targetId}: ${matches.length} pages trouvées dans ${item.targetDataset}, attendu 1`);
  const current=matches[0];
  const canonical={
    id:current.id,title:item.title,category:'Vérité',source:SOURCE_DOCUMENT,status:'canon_recent',
    tags:item.tags||['Vérité','Lore V6','Lore book-first'],nav:item.nav,
    loreEvidence:{chapter:item.title,paragraphs:item.evidence||[]},loreBook:{source:'Vérité V6',batch:BATCH},
    sections:item.sections.map(paragraphSection)
  };
  target[target.indexOf(current)]=canonical;
  replaced.push({dataset:item.targetDataset,id:current.id,title:item.title});
}

if(truth.length!==initialTruthCount)throw new Error(`La passe Corruption/Fléaux ne doit pas changer le nombre de pages Vérité (${truth.length}/${initialTruthCount})`);
if(legacy.length!==initialLegacyCount)throw new Error(`La passe Corruption/Fléaux ne doit pas changer le nombre de pages legacy (${legacy.length}/${initialLegacyCount})`);
const touchedTruth=truth.filter(page=>page.loreBook?.batch===BATCH);
const touchedLegacy=legacy.filter(page=>page.loreBook?.batch===BATCH);
if(touchedTruth.length!==2||touchedLegacy.length!==8)throw new Error(`Lot incomplet: ${touchedTruth.length} Vérité + ${touchedLegacy.length} legacy, attendu 2 + 8`);

const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+|TUC Talent|\bProfil\s*:/i;
for(const page of [...touchedTruth,...touchedLegacy]){
  if(forbidden.test(textOf(page)))throw new Error(`${page.id}: mécanique détectée dans le lore book-first`);
  if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.id}: table mécanique interdite`);
}
const truth20=touchedTruth.find(page=>page.id==='verite-056-20-corruption');
const truth21=touchedTruth.find(page=>page.id==='verite-057-21-les-six-fleaux-et-le-faux-septieme');
if((truth20?.sections||[]).length<12)throw new Error('20. Corruption: hub book-first trop mince');
if((truth21?.sections||[]).length<10)throw new Error('21. Les six Fléaux: hub book-first trop mince');
for(const page of touchedLegacy)if((page.sections||[]).length<7)throw new Error(`${page.id}: fiche narrative trop mince`);

const delanial=touchedLegacy.find(page=>page.id==='lore-plagues-delanial');
const delanialText=textOf(delanial);
if(!/Delanial n.est pas un Fléau/i.test(delanialText)||!/Légionnaire des Puissances/i.test(delanialText))throw new Error('Delanial: classification canonique perdue');
if(/\bsept\s+Fléaux\b/i.test(delanialText))throw new Error('Delanial: formulation à sept Fléaux détectée');
const six=touchedLegacy.filter(page=>page.nav?.subgroup==='Les six Fléaux');
if(six.length!==6)throw new Error(`Six fiches de Fléau attendues, ${six.length}`);
if(new Set(six.map(page=>page.nav?.pageOrder)).size!==6)throw new Error('Ordre des six Fléaux non unique');

const truthSpec=writeDataset('verite',truth,'v3-verite-lore-v8');
if(oldTruthPrefix!=='v3-verite-lore-v8')removePrefix(oldTruthPrefix);
const loreSpec=writeDataset('lore',legacy,'v3-lore-v5');
if(oldLorePrefix!=='v3-lore-v5')removePrefix(oldLorePrefix);
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');

console.log(`LORE CORRUPTION/FLÉAUX V6 — ${replaced.length} pages book-first remplacées · IDs conservés.`);
console.log(`VÉRITÉ — ${truth.length} pages · ${truthSpec.parts} fragments · LORE legacy ${legacy.length} · ${loreSpec.parts} fragments · total V3 ${manifest.expectedTotal}.`);
