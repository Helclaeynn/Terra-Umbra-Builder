import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const REALITY='character-builder/rulesets/terra-umbra/reality';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const expected={equipement:{sourceCount:298,count:297,category:'Équipement',image:'assets/equipment-placeholder.svg'},augmentations:{sourceCount:146,count:64,category:'Augmentations',image:'assets/augmentation-placeholder.svg'}};
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
function tableIn(section){return (section?.blocks||[]).find(b=>b.type==='table');}

const equipSource=safeEntries('equipment'),neuroSource=safeEntries('neuroprograms'),vehicleSource=safeEntries('vehicles');
const equipmentRuntimeCount=equipSource+neuroSource+vehicleSource;
if(equipSource!==261||neuroSource!==27||vehicleSource!==10)throw new Error(`Sources Builder équipement inattendues: ${equipSource}+${neuroSource}+${vehicleSource}`);
if(equipmentRuntimeCount!==expected.equipement.sourceCount)throw new Error(`Source Builder équipement fusionnée: ${equipmentRuntimeCount}, attendu ${expected.equipement.sourceCount}`);
const augB64=fs.readFileSync(`${REALITY}/augmentations.json.gz.b64`,'utf8').replace(/\s+/g,'');
const augSource=JSON.parse(zlib.gunzipSync(Buffer.from(augB64,'base64')).toString('utf8')),augSourceCount=countCatalog(augSource);
const r47=fs.readFileSync('character-builder/app.parts/47-reality-missing-augmentations.txt','utf8');
const r47Count=(r47.match(/\br47Aug\('/g)||[]).length;
const augmentationRuntimeCount=augSourceCount+r47Count;
if(augSourceCount!==132||r47Count!==14||augmentationRuntimeCount!==expected.augmentations.sourceCount)throw new Error(`Source Builder augmentations: base ${augSourceCount} + V9 ${r47Count}, attendu ${expected.augmentations.sourceCount}`);

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
    const lore=(row.sections||[]).find(s=>s.id==='contexte'),paragraphs=(lore?.blocks||[]).filter(b=>b.type==='p'&&String(b.text||'').trim());
    if(paragraphs.length<2)throw new Error(`${row.title}: deux paragraphes de lore attendus`);
    for(const p of paragraphs){for(const re of forbidden)if(re.test(p.text))throw new Error(`${row.title}: formulation méta interdite (${re})`);const key=norm(p.text);if(publicParagraphs.has(key))throw new Error(`Paragraphe public dupliqué: ${row.title} / ${publicParagraphs.get(key)}`);publicParagraphs.set(key,row.title);}
    if(!row.catalog?.id||!row.catalog?.category)throw new Error(`${row.title}: métadonnées catalogue absentes`);
    if(id==='equipement'){
      const mechanics=(row.sections||[]).find(s=>s.id==='proprietes'),table=tableIn(mechanics);
      if(!Array.isArray(table?.rows)||!table.rows.length)throw new Error(`${row.title}: propriétés absentes`);
    }else{
      if(!Array.isArray(row.catalog?.variants)||!row.catalog.variants.length)throw new Error(`${row.title}: variantes runtime absentes`);
      const mechanics=(row.sections||[]).filter(s=>s.id!=='contexte');
      if(mechanics.length!==row.catalog.variants.length)throw new Error(`${row.title}: ${mechanics.length} sections techniques pour ${row.catalog.variants.length} variantes`);
      for(const section of mechanics){const table=tableIn(section);if(!Array.isArray(table?.rows)||!table.rows.length)throw new Error(`${row.title} / ${section.title}: propriétés absentes`);}
    }
  }
  total+=rows.length;console.log(`OK ${rule.category}: ${rows.length} pages · SHA ${spec.sha256.slice(0,12)}…`);
}

const equipment=decoded.equipement,augmentations=decoded.augmentations;
const face=equipment.filter(x=>norm(x.title)==='facecaster dfl');if(face.length!==1)throw new Error(`FaceCaster DFL: ${face.length} pages, attendu 1`);
if(equipmentRuntimeCount-equipment.length!==1)throw new Error(`Dédoublonnage équipement: ${equipmentRuntimeCount-equipment.length} entrée retirée, attendu 1`);
const neuro=equipment.filter(x=>x.catalog?.sourceType==='neuroprogram'),vehicles=equipment.filter(x=>x.catalog?.sourceType==='vehicle');
if(neuro.length!==27||vehicles.length!==10)throw new Error(`Fusion runtime équipement incomplète: Neuro ${neuro.length}/27, véhicules ${vehicles.length}/10`);

const variants=augmentations.flatMap(page=>(page.catalog?.variants||[]).map(variant=>({...variant,pageTitle:page.title,pageSections:page.sections||[]})));
if(variants.length!==expected.augmentations.sourceCount)throw new Error(`Variantes imbriquées: ${variants.length}, attendu ${expected.augmentations.sourceCount}`);
const variantIds=new Set();for(const variant of variants){if(!variant.id||variantIds.has(variant.id))throw new Error(`ID de variante absent ou dupliqué: ${variant.id}`);variantIds.add(variant.id);}
for(const id of ['senseurs-sonars-gen-1','senseurs-sonars-gen-2','senseurs-toucher-gen-1','senseurs-toucher-gen-2','augmentation-v9-cybermain-g1','augmentation-v9-cybermain-g2'])if(!variantIds.has(id))throw new Error(`Variante runtime absente: ${id}`);

function pageForVariants(ids){return augmentations.find(page=>ids.every(id=>(page.catalog?.variants||[]).some(v=>v.id===id)));}
for(const [label,ids] of [['Senseurs sonars',['senseurs-sonars-gen-1','senseurs-sonars-gen-2']],['Senseurs toucher',['senseurs-toucher-gen-1','senseurs-toucher-gen-2']],['Cybermain',['augmentation-v9-cybermain-g1','augmentation-v9-cybermain-g2']]]){
  const page=pageForVariants(ids);if(!page)throw new Error(`${label}: Gen.1 et Gen.2 ne sont pas réunies sur la même page`);
  const headings=(page.sections||[]).map(s=>norm(s.title));
  if(!headings.some(t=>t.includes('generation 1'))||!headings.some(t=>t.includes('generation 2')))throw new Error(`${page.title}: sections Génération 1 / Génération 2 absentes`);
}

const service=equipment.find(x=>/pass|abonnement|basic|standard|premium|executive/i.test(`${x.title} ${x.catalog?.category||''}`));
if(!service)throw new Error('Aucun service/abonnement trouvé pour le smoke-test de propriétés');
const serviceTable=tableIn(service.sections.find(s=>s.id==='proprietes'))?.rows||[];
if(serviceTable.length<2)throw new Error(`${service.title}: propriétés de service incomplètes`);

if(total!==361)throw new Error(`Catalogues visibles: ${total} pages, attendu 361`);
const nonCatalogTotal=manifest.datasets.filter(x=>!['equipement','augmentations'].includes(x.id)).reduce((sum,x)=>sum+Number(x.count||0),0);
if(manifest.expectedTotal!==nonCatalogTotal+total)throw new Error(`Manifest V3: total ${manifest.expectedTotal}, attendu ${nonCatalogTotal+total}`);
if(!fs.existsSync('compendium/assets/equipment-placeholder.svg')||!fs.existsSync('compendium/assets/augmentation-placeholder.svg'))throw new Error('Placeholders image absents');
console.log(`Sources runtime OK — équipement ${equipmentRuntimeCount} -> ${equipment.length} pages (FaceCaster -1) · augmentations ${augmentationRuntimeCount} variantes -> ${augmentations.length} pages.`);
console.log(`Smoke catalogue OK — FaceCaster unique · Gen.1/Gen.2 réunies sur une page · ${variants.length} variantes conservées · ${neuro.length} Neuroprogrammes · ${vehicles.length} véhicules.`);
console.log(`Catalogues Compendium OK — ${total} pages visibles · total V3 ${manifest.expectedTotal} · titres, lore, images et propriétés validés.`);