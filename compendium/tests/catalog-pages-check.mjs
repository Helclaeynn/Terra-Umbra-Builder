import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const REALITY='character-builder/rulesets/terra-umbra/reality';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const expected={equipement:{count:298,category:'Équipement',image:'assets/equipment-placeholder.svg'},augmentations:{count:146,category:'Augmentations',image:'assets/augmentation-placeholder.svg'}};
const NAME_KEYS=['name','nom','augmentation','equipement','equipment','service','vehicule','vehicle','neuroprogramme','item','designation'];
const USEFUL=['prix','price','cout','cost','generation','gen','charge','stress','effet','effect','usage','fonction','fonction principale','description','dgt','degats'];
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    const file=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    if(!fs.existsSync(file))throw new Error(`${spec.id}: fragment absent ${file}`);
    b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
  }
  const sha=crypto.createHash('sha256').update(b64).digest('hex');
  if(sha!==spec.sha256)throw new Error(`${spec.id}: SHA ${sha} != ${spec.sha256}`);
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function countCatalog(node){
  if(Array.isArray(node))return node.reduce((n,x)=>n+countCatalog(x),0);
  if(!node||typeof node!=='object')return 0;
  const keys=Object.keys(node).map(norm),names=NAME_KEYS.map(norm);
  const hasName=keys.some(k=>names.includes(k)),hasUseful=keys.some(k=>USEFUL.includes(k));
  if(hasName&&hasUseful)return 1;
  return Object.values(node).reduce((n,x)=>n+countCatalog(x),0);
}
function safeEntries(name){return Number(JSON.parse(fs.readFileSync(`${REALITY}/safe/${name}.manifest.json`,'utf8')).entries||0);}

const equipSource=safeEntries('equipment'),neuroSource=safeEntries('neuroprograms'),vehicleSource=safeEntries('vehicles');
if(equipSource!==261||neuroSource!==27||vehicleSource!==10)throw new Error(`Sources Builder équipement inattendues: ${equipSource}+${neuroSource}+${vehicleSource}`);
if(equipSource+neuroSource+vehicleSource!==expected.equipement.count)throw new Error(`Source Builder équipement fusionnée: ${equipSource+neuroSource+vehicleSource}, attendu ${expected.equipement.count}`);
const augB64=fs.readFileSync(`${REALITY}/augmentations.json.gz.b64`,'utf8').replace(/\s+/g,'');
const augSource=JSON.parse(zlib.gunzipSync(Buffer.from(augB64,'base64')).toString('utf8')),augSourceCount=countCatalog(augSource);
const r47=fs.readFileSync('character-builder/app.parts/47-reality-missing-augmentations.txt','utf8');
const r47Count=(r47.match(/\br47Aug\('/g)||[]).length;
if(augSourceCount!==132||r47Count!==14||augSourceCount+r47Count!==expected.augmentations.count)throw new Error(`Source Builder augmentations: base ${augSourceCount} + V9 ${r47Count}, attendu ${expected.augmentations.count}`);

const allIds=new Set(),publicParagraphs=new Map(),forbidden=[/\bcorpus\b/i,/\bbuilder\b/i,/\bfiche\b/i,/\bMJ\b/i,/\bjoueur\b/i,/\bjeu\b/i,/\bsc[ée]nario\b/i,/catalogue\s+(?:source|du)/i,/propri[ée]t[ée]s?\s+m[ée]caniques?/i];
let total=0;const decoded={};
for(const [id,rule] of Object.entries(expected)){
  const spec=manifest.datasets.find(x=>x.id===id);if(!spec)throw new Error(`Dataset ${id} absent du manifeste`);
  if(spec.count!==rule.count)throw new Error(`${id}: ${spec.count} entrées, attendu ${rule.count}`);
  const rows=load(spec);decoded[id]=rows;if(rows.length!==rule.count)throw new Error(`${id}: ${rows.length} pages décodées, attendu ${rule.count}`);
  const titles=new Set();
  for(const row of rows){
    if(!row.id||allIds.has(row.id))throw new Error(`${id}: ID absent ou dupliqué (${row.id})`);allIds.add(row.id);
    if(!row.title||titles.has(norm(row.title)))throw new Error(`${id}: titre absent ou dupliqué (${row.title})`);titles.add(norm(row.title));
    if(row.category!==rule.category)throw new Error(`${row.title}: catégorie ${row.category}`);
    if(row.illustration?.src!==rule.image)throw new Error(`${row.title}: encart image absent ou incorrect`);
    if(id==='augmentations'&&row.catalog?.generation!==null&&row.catalog?.generation!==undefined&&!row.title.includes(`Génération ${row.catalog.generation}`))throw new Error(`${row.title}: génération absente du titre`);
    const lore=(row.sections||[]).find(s=>s.id==='contexte'),paragraphs=(lore?.blocks||[]).filter(b=>b.type==='p'&&String(b.text||'').trim());
    if(paragraphs.length<2)throw new Error(`${row.title}: deux paragraphes de lore attendus`);
    for(const p of paragraphs){for(const re of forbidden)if(re.test(p.text))throw new Error(`${row.title}: formulation méta interdite (${re})`);const key=norm(p.text);if(publicParagraphs.has(key))throw new Error(`Paragraphe public dupliqué: ${row.title} / ${publicParagraphs.get(key)}`);publicParagraphs.set(key,row.title);}
    const mechanics=(row.sections||[]).find(s=>s.id==='proprietes'),table=(mechanics?.blocks||[]).find(b=>b.type==='table');
    if(!Array.isArray(table?.rows)||!table.rows.length)throw new Error(`${row.title}: propriétés absentes`);
    if(!row.catalog?.id||!row.catalog?.category)throw new Error(`${row.title}: métadonnées catalogue absentes`);
  }
  total+=rows.length;console.log(`OK ${rule.category}: ${rows.length} pages · SHA ${spec.sha256.slice(0,12)}…`);
}

const equipment=decoded.equipement,augmentations=decoded.augmentations;
const face=equipment.filter(x=>norm(x.title)==='facecaster dfl');if(face.length!==1)throw new Error(`FaceCaster DFL: ${face.length} pages, attendu 1`);
const neuro=equipment.filter(x=>x.catalog?.sourceType==='neuroprogram'),vehicles=equipment.filter(x=>x.catalog?.sourceType==='vehicle');
if(neuro.length!==27||vehicles.length!==10)throw new Error(`Fusion runtime équipement incomplète: Neuro ${neuro.length}/27, véhicules ${vehicles.length}/10`);
for(const gen of [1,2])if(!augmentations.some(x=>norm(x.title).includes(`cablage neuronal generation ${gen}`)))throw new Error(`Câblage neuronal Génération ${gen} absent`);
for(const id of ['augmentation-v9-cybermain-g1','augmentation-v9-cybermain-g2'])if(!augmentations.some(x=>x.catalog?.id===id))throw new Error(`Réconciliation V9 absente: ${id}`);
const service=equipment.find(x=>/pass|abonnement|basic|standard|premium|executive/i.test(`${x.title} ${x.catalog?.category||''}`));
if(!service)throw new Error('Aucun service/abonnement trouvé pour le smoke-test de propriétés');
const serviceTable=service.sections.find(s=>s.id==='proprietes')?.blocks?.find(b=>b.type==='table')?.rows||[];
if(serviceTable.length<2)throw new Error(`${service.title}: propriétés de service incomplètes`);

if(total!==444)throw new Error(`Catalogues: ${total} pages, attendu 444`);
if(manifest.expectedTotal!==1374)throw new Error(`Manifest V3: total ${manifest.expectedTotal}, attendu 1374`);
if(!fs.existsSync('compendium/assets/equipment-placeholder.svg')||!fs.existsSync('compendium/assets/augmentation-placeholder.svg'))throw new Error('Placeholders image absents');
console.log(`Sources Builder OK — équipement ${equipSource}+${neuroSource}+${vehicleSource}=${expected.equipement.count} · augmentations ${augSourceCount}+${r47Count}=${expected.augmentations.count}.`);
console.log(`Smoke catalogue OK — FaceCaster unique · Câblage neuronal G1/G2 · ${neuro.length} Neuroprogrammes · ${vehicles.length} véhicules · service « ${service.title} ».`);
console.log(`Catalogues Compendium OK — ${total} pages · total V3 ${manifest.expectedTotal} · titres, lore unique, images et propriétés validés.`);
