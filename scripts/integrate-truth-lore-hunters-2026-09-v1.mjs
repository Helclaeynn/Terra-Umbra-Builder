import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE_DIR='compendium/source';
const SOURCE_PREFIX='truth-lore-hunters-2026-09-v1-';
const MANIFEST=`${DATA}/manifest-v3.json`;
const sourceFiles=fs.readdirSync(SOURCE_DIR).filter(name=>name.startsWith(SOURCE_PREFIX)&&name.endsWith('.b64part')).sort();
if(sourceFiles.length!==9)throw new Error(`9 fragments source Chasseurs attendus, ${sourceFiles.length}`);
const sourceB64=sourceFiles.map(name=>fs.readFileSync(`${SOURCE_DIR}/${name}`,'utf8')).join('').replace(/\s+/g,'');
const source=JSON.parse(zlib.gunzipSync(Buffer.from(sourceB64,'base64')).toString('utf8'));
const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[\u2019\u2018`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return norm(value).replace(/\s+/g,'-')||'section'}
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function writeDataset(id,pages,prefix){
  const previous=specFor(id).prefix;
  removePrefix(prefix);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  const spec=specFor(id);Object.assign(spec,{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});
  if(previous!==prefix)removePrefix(previous);
  return spec;
}
function union(...groups){return [...new Set(groups.flat().filter(Boolean))]}
function sectionFrom(src){return {id:slug(src.title),title:src.title,level:3,blocks:(src.paragraphs||[]).map(text=>({type:'p',style:'lore',text:String(text).trim()})).filter(b=>b.text)}}
function replaceSections(page,item){
  const remove=new Set((item.replaceSections||[]).map(norm));
  const incomingTitles=new Set((item.sections||[]).map(s=>norm(s.title)));
  const kept=(page.sections||[]).filter(s=>!remove.has(norm(s.title))&&!incomingTitles.has(norm(s.title)));
  page.sections=[...kept,...(item.sections||[]).map(sectionFrom)];
  const realityLore=page.category==='R\xe9alit\xe9'||(page.category==='Organisations'&&(page.tags||[]).some(tag=>norm(tag)==='religions et neoreligions'));
  const extraTags=realityLore?['Lore Chasseurs 2026-09']:['V\xe9rit\xe9','Chasseurs','Lore Chasseurs 2026-09'];
  page.tags=union(page.tags||[],extraTags);
  page.loreSources=union(page.loreSources||[],[source.sourceDocument]);
}
function assertUniqueIds(pages,id){const seen=new Set();for(const page of pages){if(seen.has(page.id))throw new Error(`${id}: ID dupliqu\xe9 ${page.id}`);seen.add(page.id)}}
function flat(page){return (page.sections||[]).flatMap(s=>(s.blocks||[]).map(b=>b.text||JSON.stringify(b.rows||[]))).join(' ')}

if(source.schemaVersion!==1||source.sourceDocument!=='TUC_V\xe9rit\xe9_ les chasseurs(1).docx')throw new Error('Source Chasseurs invalide');
if(source.newPages?.length!==8)throw new Error(`8 nouvelles pages attendues, ${source.newPages?.length||0}`);
if(source.enrichments?.length!==19)throw new Error(`19 enrichissements attendus, ${source.enrichments?.length||0}`);

const datasets={verite:loadDataset('verite'),lore:loadDataset('lore'),bestiaire:loadDataset('bestiaire')};
const initial={verite:datasets.verite.length,lore:datasets.lore.length,bestiaire:datasets.bestiaire.length};
const touched=[];

for(const item of source.enrichments){
  const pages=datasets[item.dataset];if(!pages)throw new Error(`Dataset non g\xe9r\xe9: ${item.dataset}`);
  const matches=pages.filter(page=>page.id===item.id);
  if(matches.length!==1)throw new Error(`${item.dataset}/${item.id}: ${matches.length} pages trouv\xe9es`);
  replaceSections(matches[0],item);touched.push(`${item.dataset}:${item.id}`);
}

const allIds=new Set(Object.values(datasets).flat().map(p=>p.id));
for(const item of source.newPages){
  if(allIds.has(item.id))throw new Error(`Nouvelle page d\xe9j\xe0 existante: ${item.id}`);
  const page={
    id:item.id,title:item.title,category:'V\xe9rit\xe9',source:source.sourceDocument,status:'canon_recent',
    tags:['V\xe9rit\xe9','Chasseurs','Traditions de Chasse','Lore Chasseurs 2026-09'],nav:item.nav,
    loreEvidence:{source:source.sourceDocument,scope:'TUC V\xe9rit\xe9 \u2014 Les Chasseurs'},
    sections:(item.sections||[]).map(sectionFrom),
  };
  datasets.lore.push(page);allIds.add(page.id);touched.push(`lore:${page.id}`);
}

if(datasets.verite.length!==initial.verite)throw new Error(`V\xe9rit\xe9: changement de compte inattendu ${initial.verite}->${datasets.verite.length}`);
if(datasets.bestiaire.length!==initial.bestiaire)throw new Error(`Bestiaire: changement de compte inattendu ${initial.bestiaire}->${datasets.bestiaire.length}`);
if(datasets.lore.length!==initial.lore+8)throw new Error(`Lore: +8 pages attendu, ${initial.lore}->${datasets.lore.length}`);
for(const [id,pages] of Object.entries(datasets))assertUniqueIds(pages,id);

const requiredIds=source.newPages.map(x=>x.id);
for(const id of requiredIds){const page=datasets.lore.find(p=>p.id===id);if(!page||!page.sections?.length)throw new Error(`Page nouvelle absente/mince: ${id}`)}
const minParagraphs=new Map([['lore-hunters-association',15],['lore-hunters-association-gate-hunt',15],['lore-hunters-xenoshield',15],['lore-hunters-chretiens',40],['lore-hunters-musulmans',20],['lore-hunters-hindouistes',25],['lore-hunters-shientaoistes',70],['lore-hunters-confreries',35]]);
for(const [id,min] of minParagraphs){const page=datasets.lore.find(p=>p.id===id);const n=(page.sections||[]).reduce((s,x)=>s+(x.blocks||[]).length,0);if(n<min)throw new Error(`${id}: trop mince (${n}<${min})`)}
for(const key of touched){const [did,id]=key.split(':');const page=datasets[did].find(p=>p.id===id);if(!page)throw new Error(`Page touch\xe9e introuvable ${key}`);if(/\bundefined\b|\[object Object\]/i.test(flat(page)))throw new Error(`${key}: contenu invalide`)}

const wLore=writeDataset('lore',datasets.lore,'v3-lore-v10');
const wTruth=writeDataset('verite',datasets.verite,'v3-verite-lore-v12');
const wBestiary=writeDataset('bestiaire',datasets.bestiaire,'v3-bestiaire-v17-enriched-263');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(MANIFEST,`${JSON.stringify(manifest,null,2)}\n`,'utf8');

console.log(`CHASSEURS LORE 2026-09 \u2014 ${source.newPages.length} nouvelles pages \xb7 ${source.enrichments.length} enrichissements.`);
console.log(`LORE ${initial.lore} -> ${datasets.lore.length} (${wLore.parts} fragments) \xb7 V\xc9RIT\xc9 ${datasets.verite.length} (${wTruth.parts}) \xb7 BESTIAIRE ${datasets.bestiaire.length} (${wBestiary.parts}) \xb7 TOTAL ${manifest.expectedTotal}.`);
