import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const IDS=['equipement','augmentations'];
const LIMIT=0.60;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
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
  /ce genre de dépense paraît banal jusqu’au moment/i
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
function groundingValues(page){
  const preferred=[],fallback=[];
  for(const row of tableRows(page)){
    if(!Array.isArray(row)||row.length<2)continue;
    const label=norm(row[0]),value=String(row[1]??'').trim(),nv=norm(value);
    if(!nv||nv.length<2)continue;
    if(/^(effet usage|effet|usage|fonction|description|profil)$/.test(label)){preferred.push(nv);continue;}
    if(/^(categorie|category|prix|price|cout|cost|generation|source|path|chemin|id)$/.test(label))fallback.push(nv);
    else preferred.push(nv);
  }
  return preferred.length?preferred:fallback;
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
for(const id of IDS){
  const spec=manifest.datasets.find(item=>item.id===id);
  if(!spec)throw new Error(`${id}: dataset absent`);
  if(spec.quality?.loreVersion!==2||Number(spec.quality?.maxIdenticalTextRatio)!==LIMIT)throw new Error(`${id}: métadonnées qualité lore V2 absentes`);
  const rows=load(spec);
  for(const page of rows){
    const blocks=contextBlocks(page);
    if(blocks.length!==2)throw new Error(`${page.title}: exactement 2 paragraphes de contexte attendus, trouvé ${blocks.length}`);
    if(page.catalog?.loreVersion!==2||page.catalog?.loreMethod!=='source-grounded-context')throw new Error(`${page.title}: traçabilité lore V2 absente`);
    const text=blocks.map(block=>block.text).join(' ');
    if(text.length<100)throw new Error(`${page.title}: contexte trop pauvre (${text.length} caractères)`);
    for(const re of forbidden)if(re.test(text))throw new Error(`${page.title}: ancien remplissage générique détecté (${re})`);
    const loreNorm=norm(text),values=groundingValues(page);
    if(!values.length)throw new Error(`${page.title}: aucune donnée propre à l’entrée pour ancrer le contexte`);
    if(!values.some(value=>value.length>=2&&loreNorm.includes(value)))throw new Error(`${page.title}: contexte non ancré dans ses propriétés propres`);
    pages.push({page,set:shingleSet(page)});
  }
}

let worst={ratio:0,a:'',b:''};
for(let i=0;i<pages.length;i++)for(let j=i+1;j<pages.length;j++){
  const ratio=containment(pages[i].set,pages[j].set);
  if(ratio>worst.ratio)worst={ratio,a:pages[i].page.title,b:pages[j].page.title};
  if(ratio>LIMIT)throw new Error(`Lore Réalité trop similaire ${(ratio*100).toFixed(1)}%: ${pages[i].page.title} / ${pages[j].page.title}`);
}

console.log(`Lore Réalité V2 OK — ${pages.length} pages · max similarité ${(worst.ratio*100).toFixed(1)}% (${worst.a} / ${worst.b}) · remplissage générique interdit · ancrage source contrôlé.`);
