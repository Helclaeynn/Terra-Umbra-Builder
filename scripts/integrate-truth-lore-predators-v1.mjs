import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE_DIR='compendium/source/truth-lore-predators-v1';
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
function navFor(item){
  if(item.title==='10. Vampires')return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Vampires',subgroupOrder:10,pageOrder:10};
  if(item.title==='Sangs noirs vampiriques')return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Vampires — Sangs noirs',subgroupOrder:11,pageOrder:20};
  if(item.title==='11. Garous — Loups descendants de Khinae')return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Garous',subgroupOrder:20,pageOrder:10};
  if(item.title.startsWith('Pelage '))return {group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Garous — Pelages',subgroupOrder:21,pageOrder:Number(item.order||500)};
  throw new Error(`Navigation non définie: ${item.title}`);
}
function tagsFor(item){
  if(item.title==='10. Vampires'||item.title==='Sangs noirs vampiriques')return ['Vérité','Vampires','Lore V6','Lore book-first'];
  return ['Vérité','Garous','Lore V6','Lore book-first'];
}
function loadSources(){
  if(!fs.existsSync(SOURCE_DIR))throw new Error(`Dossier source absent: ${SOURCE_DIR}`);
  const files=fs.readdirSync(SOURCE_DIR).filter(name=>name.endsWith('.json')).sort();
  if(files.length!==9)throw new Error(`9 sources JSON prédateurs attendues, ${files.length}`);
  const pages=[];
  const ids=new Set(),titles=new Set();
  for(const file of files){
    const wrapper=JSON.parse(fs.readFileSync(`${SOURCE_DIR}/${file}`,'utf8'));
    if(wrapper.schemaVersion!==1||wrapper.sourceDocument!==SOURCE_DOCUMENT||!wrapper.page)throw new Error(`${file}: source V6 invalide`);
    const item=wrapper.page;
    if(!item.id||!item.title||!Array.isArray(item.sections)||!item.sections.length)throw new Error(`${file}: page source incomplète`);
    if(ids.has(item.id))throw new Error(`${file}: ID source dupliqué ${item.id}`);
    if(titles.has(norm(item.title)))throw new Error(`${file}: titre source dupliqué ${item.title}`);
    ids.add(item.id);titles.add(norm(item.title));pages.push(item);
  }
  const expected=[
    '10. Vampires','Sangs noirs vampiriques','11. Garous — Loups descendants de Khinae',
    'Pelage Gris','Pelage Noir','Pelage Blanc','Pelage Roux','Pelage Brun','Pelage Doré'
  ];
  for(const title of expected)if(!pages.some(item=>item.title===title))throw new Error(`Source prédatrice absente: ${title}`);
  return pages;
}

const sourcePages=loadSources();
const truth=loadDataset('verite');
const legacy=loadDataset('lore');
const originalLegacyCount=legacy.length;
let added=0,replaced=0;

for(const item of sourcePages){
  const canonical={
    id:item.id,title:item.title,category:'Vérité',source:SOURCE_DOCUMENT,status:'canon_recent',
    tags:tagsFor(item),nav:navFor(item),loreEvidence:{chapter:item.title.startsWith('10.')||item.title.includes('Sangs')?'10. Vampires':'11. Garous — Loups descendants de Khinae',paragraphs:item.evidence||[]},
    loreBook:{source:'Vérité V6',batch:'predators-v1'},sections:(item.sections||[]).map(paragraphSection)
  };
  if(item.title==='10. Vampires'||item.title==='11. Garous — Loups descendants de Khinae'){
    const matches=truth.filter(page=>norm(page.title)===norm(item.title));
    if(matches.length!==1)throw new Error(`${item.title}: ${matches.length} hubs Vérité, attendu 1`);
    const idx=truth.indexOf(matches[0]);
    canonical.id=matches[0].id;
    truth[idx]=canonical;replaced++;continue;
  }
  const byId=truth.find(page=>page.id===item.id);
  if(byId){truth[truth.indexOf(byId)]=canonical;continue}
  const titleMatches=[...truth,...legacy.filter(page=>page.category==='Vérité')].filter(page=>norm(page.title)===norm(item.title));
  if(titleMatches.length)throw new Error(`${item.title}: collision visible book-first (${titleMatches.map(page=>page.id).join(', ')})`);
  truth.push(canonical);added++;
}

if(replaced!==2)throw new Error(`2 hubs remplacés attendus, ${replaced}`);
const touched=truth.filter(page=>page.loreBook?.batch==='predators-v1');
if(touched.length!==9)throw new Error(`9 pages prédateurs book-first attendues, ${touched.length}`);
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bDéfense occulte\b|\bdifficult[eé]\s*\d+|TUC Talent/i;
for(const page of touched){
  if(forbidden.test(textOf(page)))throw new Error(`${page.title}: mécanique détectée dans le lore book-first`);
  if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.title}: table mécanique interdite`);
  if(!page.nav?.group||!page.nav?.subgroup)throw new Error(`${page.title}: navigation explicite absente`);
}
if(legacy.length!==originalLegacyCount)throw new Error(`Le dataset lore ne doit pas être consolidé pendant cette passe (${legacy.length}/${originalLegacyCount})`);
const ids=new Set();for(const page of truth){if(ids.has(page.id))throw new Error(`ID Vérité dupliqué: ${page.id}`);ids.add(page.id)}

const written=writeDataset('verite',truth,'v3-verite-lore-v4');
removePrefix('v3-verite-lore-v3');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`LORE PRÉDATEURS V6 — 9 sources JSON lisibles · ${added} nouvelles · ${replaced} hubs remplacés.`);
console.log(`VÉRITÉ — ${truth.length} pages · ${written.parts} fragments · LORE legacy inchangé ${legacy.length} · total V3 ${manifest.expectedTotal}.`);
