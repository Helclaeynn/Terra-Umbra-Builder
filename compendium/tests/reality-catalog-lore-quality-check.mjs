import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const IDS=['equipement','augmentations'];
const LIMIT=0.60;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const PUBLIC_META_LABEL=/^(categorie|category|famille|family|type|prix|price|cout|cost|generation|source|path|chemin|id|pricemode|pricelabel)$/;
const EFFECT_LABEL=/^(effet usage|effet|usage|fonction|description|profil)$/;
const forbidden=[
  /dans les vitrines, ateliers et réseaux spécialisés/i,
  /son nom circule surtout chez/i,
  /il est surtout recherché par/i,
  /on le rencontre principalement chez/i,
  /autour de .* s’est développé tout un usage/i,
  /sa présence dit autant du niveau de risque/i,
  /du milieu dans lequel son porteur évolue/i,
  /l’investissement devient suffisamment important pour être réfléchi/i,
  /son coût reste accessible à ceux qui en ont un besoin régulier/i,
  /son prix le place parmi les achats/i,
  /sa diffusion dépend surtout du quartier/i,
  /les habitants, indépendants et professionnels qui recherchent une solution/i,
  /ce qui est payé ici est surtout la continuité du service/i,
  /le choix du modèle est rarement neutre/i,
  /ce genre de dépense paraît banal jusqu’au moment/i,
  /\bpricemode\b/i,
  /\bpricelabel\b/i
];

function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    const path=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    if(!fs.existsSync(path))throw new Error(`${spec.id}: fragment absent ${path}`);
    b64+=fs.readFileSync(path,'utf8').replace(/\s+/g,'');
  }
  const sha=crypto.createHash('sha256').update(b64).digest('hex');
  if(sha!==spec.sha256)throw new Error(`${spec.id}: SHA ${sha} != ${spec.sha256}`);
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function contextBlocks(page){
  const section=(page.sections||[]).find(section=>section.id==='contexte');
  return (section?.blocks||[]).filter(block=>block.type==='p'&&String(block.text||'').trim());
}
function tableRows(page){
  return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]));
}
function publicFacts(page){
  return tableRows(page).filter(row=>{
    if(!Array.isArray(row)||row.length<2)return false;
    const label=norm(row[0]),value=norm(row[1]);
    return label&&value&&!PUBLIC_META_LABEL.test(label)&&!EFFECT_LABEL.test(label)&&!/^illustration/.test(label);
  });
}
function effectRows(page){
  return tableRows(page).filter(row=>Array.isArray(row)&&row.length>=2&&EFFECT_LABEL.test(norm(row[0]))&&norm(row[1]));
}
function groundingValues(page){
  const preferred=[...effectRows(page),...publicFacts(page)];
  if(preferred.length)return preferred.map(row=>norm(row[1])).filter(value=>value.length>=2);
  return tableRows(page)
    .filter(row=>Array.isArray(row)&&row.length>=2&&!['source','path','chemin','id','pricemode'].includes(norm(row[0])))
    .map(row=>norm(row[1])).filter(value=>value.length>=2);
}
function shingleSet(page){
  const titleTokens=new Set(norm(page.title).split(/\s+/).filter(Boolean));
  const words=norm(contextBlocks(page).map(block=>block.text).join(' ')).split(/\s+/).filter(word=>word&&!titleTokens.has(word));
  const set=new Set();for(let i=0;i<=words.length-4;i++)set.add(words.slice(i,i+4).join(' '));return set;
}
function containment(a,b){
  if(!a.size||!b.size)return 0;
  let common=0;for(const item of a)if(b.has(item))common++;
  return common/Math.min(a.size,b.size);
}

const pages=[];
let sparseCount=0;
for(const id of IDS){
  const spec=manifest.datasets.find(item=>item.id===id);
  if(!spec)throw new Error(`${id}: dataset absent`);
  if(spec.quality?.loreVersion!==2||Number(spec.quality?.maxIdenticalTextRatio)!==LIMIT)throw new Error(`${id}: métadonnées qualité lore V2 absentes`);
  const rows=load(spec);
  for(const page of rows){
    const blocks=contextBlocks(page);
    if(blocks.length!==2)throw new Error(`${page.title}: exactement 2 paragraphes de contexte attendus, trouvé ${blocks.length}`);
    if(page.catalog?.loreVersion!==2||page.catalog?.loreMethod!=='source-grounded-context')throw new Error(`${page.title}: traçabilité lore V2 absente`);
    const grounding=page.catalog?.loreGrounding;
    if(!['sparse','detailed'].includes(grounding))throw new Error(`${page.title}: loreGrounding invalide (${grounding})`);
    const text=blocks.map(block=>block.text).join(' ');
    if(text.length<100)throw new Error(`${page.title}: contexte trop pauvre (${text.length} caractères)`);
    for(const re of forbidden)if(re.test(text))throw new Error(`${page.title}: ancien remplissage générique ou champ technique détecté (${re})`);
    const facts=publicFacts(page),effects=effectRows(page);
    if(grounding==='sparse'){
      sparseCount++;
      if(facts.length||effects.length)throw new Error(`${page.title}: marqué sparse malgré des propriétés de lore exploitables`);
    }else if(id==='equipement'&&!facts.length&&!effects.length){
      throw new Error(`${page.title}: marqué detailed sans propriété de lore exploitable`);
    }
    const loreNorm=norm(text),values=groundingValues(page);
    if(!values.length)throw new Error(`${page.title}: aucune donnée propre à l’entrée pour ancrer le contexte`);
    if(!values.some(value=>value.length>=2&&loreNorm.includes(value)))throw new Error(`${page.title}: contexte non ancré dans ses propriétés propres`);
    pages.push({page,set:shingleSet(page),grounding});
  }
}

let worst={ratio:0,a:'',b:''};
for(let i=0;i<pages.length;i++)for(let j=i+1;j<pages.length;j++){
  if(pages[i].grounding==='sparse'||pages[j].grounding==='sparse')continue;
  const ratio=containment(pages[i].set,pages[j].set);
  if(ratio>worst.ratio)worst={ratio,a:pages[i].page.title,b:pages[j].page.title};
  if(ratio>LIMIT)throw new Error(`Lore Réalité trop similaire ${(ratio*100).toFixed(1)}%: ${pages[i].page.title} / ${pages[j].page.title}`);
}

const bastion=pages.find(entry=>norm(entry.page.title)==='bastion');
if(!bastion)throw new Error('Bastion absent du contrôle de qualité Réalité');
if(bastion.grounding!=='sparse')throw new Error(`Bastion: grounding attendu sparse, obtenu ${bastion.grounding}`);
console.log(`Bastion QA — ${contextBlocks(bastion.page).map(block=>block.text).join(' || ')}`);
console.log(`Lore Réalité V2 OK — ${pages.length} pages · ${sparseCount} entrées sobres faute de propriétés supplémentaires · similarité détaillée max ${(worst.ratio*100).toFixed(1)}% (${worst.a} / ${worst.b}) · remplissage générique interdit.`);
