import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const FRAGMENT_SIZE=8000;

function norm(value){
  return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    const file=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    if(!fs.existsSync(file))throw new Error(`${spec.id}: fragment absent ${file}`);
    b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
  }
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}

function generationLore(page,variant){
  const name=page.title||'Cette augmentation';
  const category=variant.category?` Dans la famille ${variant.category},` : '';
  if(Number(variant.generation)===1){
    return `${name} de première génération reste une modification assez visible du corps.${category} les volumes techniques, raccords, trappes de maintenance ou interfaces externes trahissent encore facilement l’implantation. Ces modèles sont robustes et répandus, mais ils assument davantage leur nature artificielle que les versions plus récentes.`;
  }
  if(Number(variant.generation)===2){
    return `${name} de deuxième génération privilégie au contraire l’intégration au corps.${category} les composants sont miniaturisés, mieux noyés dans l’anatomie et pensés pour suivre les lignes naturelles du porteur. Une pose soignée peut ainsi rendre l’augmentation difficile à distinguer sans examen attentif ou équipement spécialisé.`;
  }
  if(variant.generation!==null&&variant.generation!==undefined){
    return `${name} en génération ${variant.generation} correspond à une évolution clinique distincte de cette augmentation.${category} l’architecture, la finition et l’intégration corporelle reflètent les choix techniques propres à cette série, tout en conservant la fonction générale du modèle.`;
  }
  return `${name} existe ici sous une configuration technique propre.${category} son apparence et son degré d’intégration dépendent surtout de la clinique, de la qualité de la pose et des contraintes anatomiques du porteur.`;
}

function writeDataset(spec,rows){
  for(const file of fs.readdirSync(DATA)){
    if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  }
  const payload=JSON.stringify(rows);
  const b64=zlib.gzipSync(Buffer.from(payload,'utf8'),{level:9}).toString('base64');
  const parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  spec.parts=parts;
  spec.count=rows.length;
  spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(x=>x.id==='augmentations');
if(!spec)throw new Error('Dataset augmentations absent du manifeste');
const pages=loadDataset(spec);
let enriched=0;
let gen1=0;
let gen2=0;

for(const page of pages){
  if(page.illustration?.src!=='assets/augmentation-placeholder.svg')throw new Error(`${page.title}: emplacement d’illustration augmentation absent`);
  const variants=Array.isArray(page.catalog?.variants)?page.catalog.variants:[];
  const mechanics=(page.sections||[]).filter(section=>section.id!=='contexte');
  if(!variants.length||mechanics.length!==variants.length)throw new Error(`${page.title}: variantes/sections techniques incohérentes`);
  mechanics.forEach((section,index)=>{
    const variant=variants[index];
    const blocks=Array.isArray(section.blocks)?section.blocks:[];
    const kept=blocks.filter(block=>!(block.type==='p'&&String(block.style||'').includes('generation-lore')));
    section.blocks=[{type:'p',style:'lore generation-lore',text:generationLore(page,variant)},...kept];
    variant.illustration={src:'assets/augmentation-placeholder.svg',alt:`Illustration de ${page.title}${variant.generation!==null&&variant.generation!==undefined?` — Génération ${variant.generation}`:''}`,caption:'Illustration à venir'};
    enriched++;
    if(Number(variant.generation)===1)gen1++;
    if(Number(variant.generation)===2)gen2++;
  });
}

writeDataset(spec,pages);
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');

if(!gen1||!gen2)throw new Error(`Lore génération incomplet: Gen.1 ${gen1}, Gen.2 ${gen2}`);
console.log(`Lore augmentations enrichi — ${pages.length} pages · ${enriched} variantes · Gen.1 ${gen1} · Gen.2 ${gen2}.`);
