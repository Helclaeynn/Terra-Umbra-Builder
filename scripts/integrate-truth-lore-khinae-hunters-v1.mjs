import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE_DIR='compendium/source/truth-lore-khinae-hunters-v1';
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
function loadSources(){
  const files=fs.readdirSync(SOURCE_DIR).filter(name=>name.endsWith('.json')).sort();
  if(files.length!==2)throw new Error(`2 sources Khinae/Chasseurs attendues, ${files.length}`);
  const pages=[];
  for(const file of files){
    const wrapper=JSON.parse(fs.readFileSync(`${SOURCE_DIR}/${file}`,'utf8'));
    if(wrapper.schemaVersion!==1||wrapper.sourceDocument!==SOURCE_DOCUMENT||!wrapper.page)throw new Error(`${file}: source V6 invalide`);
    const item=wrapper.page;
    if(!item.title||!Array.isArray(item.sections)||!item.sections.length)throw new Error(`${file}: page source incomplète`);
    pages.push(item);
  }
  for(const title of ['12. Autres descendants de Khinae','19. Formation et doctrine de Chasseur'])if(!pages.some(page=>page.title===title))throw new Error(`Source absente: ${title}`);
  return pages;
}
function navFor(title){
  if(title==='12. Autres descendants de Khinae')return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Khinae — autres lignées',subgroupOrder:22,pageOrder:10};
  if(title==='19. Formation et doctrine de Chasseur')return {group:'Chasseurs & traditions',groupOrder:30,subgroup:'Formation & doctrine',subgroupOrder:10,pageOrder:10};
  throw new Error(`Navigation inconnue: ${title}`);
}
function tagsFor(title){return title.startsWith('12.')?['Vérité','Khinae','Thérianthropes','Lore V6','Lore book-first']:['Vérité','Chasseurs','Traditions de Chasse','Lore V6','Lore book-first']}

const sources=loadSources();
const truth=loadDataset('verite');
const legacy=loadDataset('lore');
const initialTruthCount=truth.length;
const initialLegacyCount=legacy.length;
const replaced=[];

for(const item of sources){
  const matches=truth.filter(page=>norm(page.title)===norm(item.title));
  if(matches.length!==1)throw new Error(`${item.title}: ${matches.length} hubs Vérité trouvés, attendu 1`);
  const current=matches[0];
  const canonical={
    id:current.id,title:item.title,category:'Vérité',source:SOURCE_DOCUMENT,status:'canon_recent',
    tags:tagsFor(item.title),nav:navFor(item.title),loreEvidence:{chapter:item.title,paragraphs:item.evidence||[]},
    loreBook:{source:'Vérité V6',batch:'khinae-hunters-v1'},sections:item.sections.map(paragraphSection)
  };
  truth[truth.indexOf(current)]=canonical;
  replaced.push({title:item.title,id:current.id});
}

if(truth.length!==initialTruthCount)throw new Error(`La passe Khinae/Chasseurs ne doit pas changer le nombre de pages Vérité (${truth.length}/${initialTruthCount})`);
if(legacy.length!==initialLegacyCount)throw new Error(`Le lore legacy doit rester inchangé (${legacy.length}/${initialLegacyCount})`);
const touched=truth.filter(page=>page.loreBook?.batch==='khinae-hunters-v1');
if(touched.length!==2)throw new Error(`2 hubs Khinae/Chasseurs attendus, ${touched.length}`);
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bDéfense occulte\b|\bdifficult[eé]\s*\d+|\bco[uû]t\s*[:—-]|TUC Talent/i;
for(const page of touched){
  if(forbidden.test(textOf(page)))throw new Error(`${page.title}: mécanique détectée dans le lore book-first`);
  if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.title}: table mécanique interdite`);
  if((page.sections||[]).length<14)throw new Error(`${page.title}: hub trop mince (${page.sections?.length||0} sections)`);
}
const ids=new Set();for(const page of truth){if(ids.has(page.id))throw new Error(`ID Vérité dupliqué: ${page.id}`);ids.add(page.id)}

const written=writeDataset('verite',truth,'v3-verite-lore-v7');
removePrefix('v3-verite-lore-v6');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`LORE KHINAE/CHASSEURS V6 — 2 hubs book-first remplacés · IDs conservés: ${replaced.map(x=>x.id).join(', ')}.`);
console.log(`VÉRITÉ — ${truth.length} pages · ${written.parts} fragments · LORE legacy ${legacy.length} · total V3 ${manifest.expectedTotal}.`);
