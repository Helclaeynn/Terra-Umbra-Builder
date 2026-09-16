import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE_PREFIX='compendium/source/reality-book-v8-setting-v1.part';
const SOURCE_PARTS=6;
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
let sourceB64='';
for(let i=0;i<SOURCE_PARTS;i++)sourceB64+=fs.readFileSync(`${SOURCE_PREFIX}${i}.b64`,'utf8').replace(/\s+/g,'');
const source=JSON.parse(zlib.gunzipSync(Buffer.from(sourceB64,'base64')).toString('utf8'));
const targetPrefix='v3-realite-v3';
const batch='reality-setting-v1';

function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function writeDataset(id,pages,prefix){
  const spec=specFor(id);const prefixes=new Set([spec.prefix,prefix]);
  for(const file of fs.readdirSync(DATA))if([...prefixes].some(p=>file.startsWith(`${p}-`))&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  spec.prefix=prefix;spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
}
function slug(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section'}
function pageFromSource(item){return {
  id:item.id,title:item.title,category:'Réalité',source:source.sourceDocument,status:'canon_recent',
  tags:['Réalité','Livre V8','Grande Californie','Lore V8'],nav:item.nav,
  realityBook:{batch,scope:source.scope,evidence:item.sections.flatMap(s=>s.evidence||[])},
  sections:item.sections.map((section,index)=>({id:`${slug(section.title)}-${index+1}`,title:section.title,level:3,blocks:(section.paragraphs||[]).map(text=>({type:'p',style:'lore reality-book-lore',text:String(text).trim()}))}))
}}

if(source.schemaVersion!==1||source.sourceDocument!=='TUC_Realite_V8_LIVRE_JDR_PAO_RESPIRATION_TOC_2026-09-09.docx')throw new Error('Source Réalité V8 invalide');
if(!Array.isArray(source.pages)||source.pages.length!==9)throw new Error(`9 pages V8 attendues, ${source.pages?.length||0}`);
const reality=loadDataset('realite');
const originalCount=reality.length;
const sourceIds=new Set(source.pages.map(p=>p.id));
if(sourceIds.size!==source.pages.length)throw new Error('IDs dupliqués dans la source Réalité V8');
if(!reality.some(p=>p.id==='realite-001-chapitre-vivre-en-grande-californie'))throw new Error('Hub canonique Réalité realite-001 absent');

const built=source.pages.map(pageFromSource);
const rebuilt=[...reality.filter(page=>!sourceIds.has(page.id)),...built];
const ids=new Set();for(const page of rebuilt){if(ids.has(page.id))throw new Error(`ID dupliqué après intégration: ${page.id}`);ids.add(page.id)}
const batchPages=rebuilt.filter(page=>page.realityBook?.batch===batch);
if(batchPages.length!==9)throw new Error(`Lot Réalité V8 incomplet: ${batchPages.length}/9`);
for(const page of batchPages){
  if(page.category!=='Réalité'||!page.nav?.group||!page.nav?.subgroup)throw new Error(`${page.id}: navigation Réalité incomplète`);
  const blocks=(page.sections||[]).flatMap(s=>s.blocks||[]);if(blocks.some(b=>b.type==='table'))throw new Error(`${page.title}: table interdite dans le lore book-first`);
  const text=blocks.map(b=>b.text||'').join(' ');if(/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b/i.test(text))throw new Error(`${page.title}: mécanique détectée dans le lore`);
}
writeDataset('realite',rebuilt,targetPrefix);
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`RÉALITÉ V8 SETTING — 9 pages book-first · hub conservé · ${built.length-1} nouvelles pages.`);
console.log(`RÉALITÉ — ${originalCount} -> ${rebuilt.length} pages · total V3 ${manifest.expectedTotal}.`);
