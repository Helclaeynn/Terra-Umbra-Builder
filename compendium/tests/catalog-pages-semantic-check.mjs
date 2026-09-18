import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const REALITY='character-builder/rulesets/terra-umbra/reality';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const forbidden=[/\bcorpus\b/i,/\bbuilder\b/i,/\bfiche\b/i,/\bMJ\b/i,/\bjoueur\b/i,/\bjeu\b/i,/\bsc[ée]nario\b/i,/catalogue\s+(?:source|du)/i,/propri[ée]t[ée]s?\s+m[ée]caniques?/i];

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
function safeEntries(name){return Number(JSON.parse(fs.readFileSync(`${REALITY}/safe/${name}.manifest.json`,'utf8')).entries||0);}
function tableIn(section){return (section?.blocks||[]).find(block=>block.type==='table');}
function loreBlocks(section){return (section?.blocks||[]).filter(block=>block.type==='p'&&String(block.text||'').trim());}
function assertPublicLore(label,blocks,min=1){
  if(blocks.length<min)throw new Error(`${label}: ${min} paragraphe(s) de lore attendu(s), trouvé ${blocks.length}`);
  for(const block of blocks){for(const re of forbidden)if(re.test(block.text))throw new Error(`${label}: formulation méta interdite (${re})`);}
}

const equipmentBase=safeEntries('equipment');
const neuroSource=safeEntries('neuroprograms');
const vehicleSource=safeEntries('vehicles');
const equipmentRuntime=equipmentBase+neuroSource+vehicleSource;
if(equipmentBase!==321||neuroSource!==27||vehicleSource!==10||equipmentRuntime!==358)throw new Error(`Sources équipement inattendues: ${equipmentBase}+${neuroSource}+${vehicleSource}=${equipmentRuntime}`);

const augB64=fs.readFileSync(`${REALITY}/augmentations.json.gz.b64`,'utf8').replace(/\s+/g,'');
const augRaw=JSON.parse(zlib.gunzipSync(Buffer.from(augB64,'base64')).toString('utf8'));
function countCatalog(node){
  if(Array.isArray(node))return node.reduce((sum,item)=>sum+countCatalog(item),0);
  if(!node||typeof node!=='object')return 0;
  const keys=Object.keys(node).map(norm);
  const hasName=keys.some(key=>['name','nom','augmentation'].includes(key));
  const hasUseful=keys.some(key=>['prix','price','cout','cost','generation','gen','charge','stress','effet','effect','usage','fonction','description','dgt','degats'].includes(key));
  if(hasName&&hasUseful)return 1;
  return Object.values(node).reduce((sum,item)=>sum+countCatalog(item),0);
}
const augBase=countCatalog(augRaw);
const r47=fs.readFileSync('character-builder/app.parts/47-reality-missing-augmentations.txt','utf8');
const r47Count=(r47.match(/\br47Aug\('/g)||[]).length;
const augmentationRuntime=augBase+r47Count;
if(augBase!==132||r47Count!==14||augmentationRuntime!==146)throw new Error(`Sources augmentations inattendues: ${augBase}+${r47Count}=${augmentationRuntime}`);

const equipSpec=manifest.datasets.find(item=>item.id==='equipement');
const augSpec=manifest.datasets.find(item=>item.id==='augmentations');
if(!equipSpec||!augSpec)throw new Error('Datasets catalogue absents du manifeste');
const equipment=load(equipSpec);
const augmentations=load(augSpec);
if(equipment.length!==357)throw new Error(`Équipement visible: ${equipment.length}, attendu 357 après réintégration legacy et dédoublonnage FaceCaster`);
if(!augmentations.length||augmentations.length>=augmentationRuntime)throw new Error(`Regroupement augmentations invalide: ${augmentations.length} pages pour ${augmentationRuntime} variantes`);
if(equipSpec.count!==equipment.length||augSpec.count!==augmentations.length)throw new Error('Manifeste: nombre de pages catalogue incohérent');

const allIds=new Set();
for(const page of [...equipment,...augmentations]){
  if(!page.id||allIds.has(page.id))throw new Error(`ID de page absent ou dupliqué: ${page.id}`);
  allIds.add(page.id);
  if(!page.title)throw new Error(`${page.id}: titre absent`);
  if(!page.illustration?.src)throw new Error(`${page.title}: emplacement d’illustration absent`);
  const context=(page.sections||[]).find(section=>section.id==='contexte');
  assertPublicLore(`${page.title} / contexte`,loreBlocks(context),2);
}

for(const page of equipment){
  if(page.category!=='Équipement')throw new Error(`${page.title}: catégorie ${page.category}`);
  if(page.illustration.src!=='assets/equipment-placeholder.svg')throw new Error(`${page.title}: placeholder équipement incorrect`);
  const properties=(page.sections||[]).find(section=>section.id==='proprietes');
  const table=tableIn(properties);
  if(!Array.isArray(table?.rows)||!table.rows.length)throw new Error(`${page.title}: tableau mécanique absent`);
}

const face=equipment.filter(page=>norm(page.title)==='facecaster dfl');
if(face.length!==1)throw new Error(`FaceCaster DFL: ${face.length} pages, attendu 1`);
if(equipmentRuntime-equipment.length!==1)throw new Error(`Dédoublonnage équipement: ${equipmentRuntime-equipment.length} entrée retirée, attendu 1`);

const neuro=equipment.filter(page=>page.catalog?.sourceType==='neuroprogram');
const vehicles=equipment.filter(page=>page.catalog?.sourceType==='vehicle');
if(neuro.length!==27)throw new Error(`Neuroprogrammes visibles: ${neuro.length}/27`);
if(vehicles.length!==10)throw new Error(`Véhicules visibles: ${vehicles.length}/10`);
for(const page of neuro){
  if(!norm(page.catalog?.category).startsWith('neuroprogramme'))throw new Error(`${page.title}: catégorie Neuroprogramme perdue`);
  if(page.illustration.src!=='assets/equipment-placeholder.svg')throw new Error(`${page.title}: illustration Neuroprogramme absente`);
  const context=(page.sections||[]).find(section=>section.id==='contexte');
  assertPublicLore(`${page.title} / Neuroprogramme`,loreBlocks(context),2);
  const table=tableIn((page.sections||[]).find(section=>section.id==='proprietes'));
  if(!Array.isArray(table?.rows)||!table.rows.length)throw new Error(`${page.title}: tableau mécanique Neuroprogramme absent`);
}

const variantIds=new Set();
let variantCount=0;
let generationLoreCount=0;
let illustrationSlotCount=0;
let gen1Count=0;
let gen2Count=0;
let groupedGen12=0;
for(const page of augmentations){
  if(page.category!=='Augmentations')throw new Error(`${page.title}: catégorie ${page.category}`);
  if(page.illustration.src!=='assets/augmentation-placeholder.svg')throw new Error(`${page.title}: placeholder augmentation incorrect`);
  const variants=Array.isArray(page.catalog?.variants)?page.catalog.variants:[];
  if(!variants.length)throw new Error(`${page.title}: variantes runtime absentes`);
  const mechanics=(page.sections||[]).filter(section=>section.id!=='contexte');
  if(mechanics.length!==variants.length)throw new Error(`${page.title}: ${mechanics.length} sections techniques pour ${variants.length} variantes`);
  const generations=new Set();
  variants.forEach((variant,index)=>{
    variantCount++;
    if(!variant.id||variantIds.has(variant.id))throw new Error(`${page.title}: ID de variante absent ou dupliqué (${variant.id})`);
    variantIds.add(variant.id);
    if(variant.generation!==null&&variant.generation!==undefined)generations.add(Number(variant.generation));
    if(variant.illustration?.src!=='assets/augmentation-placeholder.svg')throw new Error(`${page.title} / ${variant.id}: emplacement d’illustration de variante absent`);
    const section=mechanics[index];
    const generationLore=loreBlocks(section).filter(block=>String(block.style||'').includes('generation-lore'));
    assertPublicLore(`${page.title} / ${section.title}`,generationLore,1);
    generationLoreCount+=generationLore.length;
    const illustrationSlot=(section.blocks||[]).find(block=>block.type==='p'&&String(block.style||'').includes('illustration-placeholder'));
    if(!illustrationSlot||!norm(illustrationSlot.text).includes('illustration a venir'))throw new Error(`${page.title} / ${section.title}: emplacement d’illustration visible absent`);
    illustrationSlotCount++;
    const table=tableIn(section);
    if(!Array.isArray(table?.rows)||!table.rows.length)throw new Error(`${page.title} / ${section.title}: tableau mécanique absent`);
    const text=norm(generationLore.map(block=>block.text).join(' '));
    if(Number(variant.generation)===1){gen1Count++;if(!text.includes('visible'))throw new Error(`${page.title}: le lore Gen.1 ne décrit pas son caractère visible`);}
    if(Number(variant.generation)===2){gen2Count++;if(!text.includes('integration'))throw new Error(`${page.title}: le lore Gen.2 ne décrit pas son intégration`);}
  });
  if(generations.has(1)&&generations.has(2)){
    groupedGen12++;
    const headings=mechanics.map(section=>norm(section.title));
    if(!headings.some(title=>title.includes('generation 1'))||!headings.some(title=>title.includes('generation 2')))throw new Error(`${page.title}: Gen.1 et Gen.2 regroupées mais titres de sections incomplets`);
  }
}

if(variantCount!==augmentationRuntime)throw new Error(`Variantes d’augmentations conservées: ${variantCount}/${augmentationRuntime}`);
if(generationLoreCount!==variantCount)throw new Error(`Lore spécifique de variante: ${generationLoreCount}/${variantCount}`);
if(illustrationSlotCount!==variantCount)throw new Error(`Emplacements d’illustration de variante: ${illustrationSlotCount}/${variantCount}`);
if(!gen1Count||!gen2Count||!groupedGen12)throw new Error(`Contrôle générations insuffisant: Gen.1 ${gen1Count}, Gen.2 ${gen2Count}, pages Gen.1+2 ${groupedGen12}`);
for(const id of ['augmentation-v9-cybermain-g1','augmentation-v9-cybermain-g2'])if(!variantIds.has(id))throw new Error(`Variante V9 absente: ${id}`);
const cybermain=augmentations.find(page=>['augmentation-v9-cybermain-g1','augmentation-v9-cybermain-g2'].every(id=>(page.catalog?.variants||[]).some(variant=>variant.id===id)));
if(!cybermain)throw new Error('Cybermain: Gen.1 et Gen.2 ne sont pas réunies sur la même page');

const visibleTotal=equipment.length+augmentations.length;
const nonCatalogTotal=manifest.datasets.filter(item=>!['equipement','augmentations'].includes(item.id)).reduce((sum,item)=>sum+Number(item.count||0),0);
if(manifest.expectedTotal!==nonCatalogTotal+visibleTotal)throw new Error(`Manifest V3: total ${manifest.expectedTotal}, attendu ${nonCatalogTotal+visibleTotal}`);
if(!fs.existsSync('compendium/assets/equipment-placeholder.svg')||!fs.existsSync('compendium/assets/augmentation-placeholder.svg'))throw new Error('Placeholders image absents');

console.log(`OK Équipement — ${equipmentRuntime} sources -> ${equipment.length} pages · FaceCaster unique · ${neuro.length} Neuroprogrammes · ${vehicles.length} véhicules.`);
console.log(`OK Augmentations — ${augmentationRuntime} variantes -> ${augmentations.length} pages · ${variantCount} variantes conservées · ${groupedGen12} pages avec Gen.1+Gen.2.`);
console.log(`OK Contenu — 2 paragraphes communs par page · ${generationLoreCount} paragraphes spécifiques · ${illustrationSlotCount} emplacements d’illustration de variante · tableau validé partout.`);
console.log(`OK Compendium — ${visibleTotal} pages catalogue visibles · total V3 ${manifest.expectedTotal}.`);
