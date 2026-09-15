import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const IDS=['equipement','augmentations'];
const DECLARED_LIMIT=0.60;
const NEAR_DUPLICATE_LIMIT=0.80;
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
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
  /\bprice ?(?:mode|label|min|max)\b/i
];
function isPriceMeta(label){return /^(price|prix|cout|cost)(?: ?(?:mode|label|min|max|minimum|maximum))?$/.test(label);}
function isMetaLabel(label){return /^(categorie|category|famille|family|type|generation|source|path|chemin|id)$/.test(label)||isPriceMeta(label);}
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
function context(page){
  const section=(page.sections||[]).find(section=>section.id==='contexte');
  return (section?.blocks||[]).filter(block=>block.type==='p'&&String(block.text||'').trim());
}
function rows(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]));}
function facts(page){
  return rows(page).filter(row=>{
    if(!Array.isArray(row)||row.length<2)return false;
    const l=norm(row[0]),v=norm(row[1]);
    return l&&v&&!isMetaLabel(l)&&!EFFECT_LABEL.test(l)&&!/^illustration/.test(l);
  });
}
function effects(page){return rows(page).filter(row=>Array.isArray(row)&&row.length>=2&&EFFECT_LABEL.test(norm(row[0]))&&norm(row[1]));}
function anchors(page){
  const preferred=[...effects(page),...facts(page)].map(row=>norm(row[1])).filter(Boolean);
  if(preferred.length)return preferred;
  const table=rows(page).filter(row=>{
    if(!Array.isArray(row)||row.length<2)return false;
    const l=norm(row[0]);
    return !/^(source|path|chemin|id|price ?mode)$/.test(l);
  }).map(row=>norm(row[1])).filter(Boolean);
  if(table.length)return table;
  return [page.catalog?.category,...(page.catalog?.categories||[]),...(page.catalog?.generations||[]).map(g=>`génération ${g}`),...(page.tags||[])]
    .map(norm).filter(v=>v&&!['realite','equipement','augmentations'].includes(v));
}
function shingles(page){
  const title=new Set(norm(page.title).split(/\s+/).filter(Boolean));
  const words=norm(context(page).map(b=>b.text).join(' ')).split(/\s+/).filter(w=>w&&!title.has(w));
  const out=new Set();for(let i=0;i<=words.length-4;i++)out.add(words.slice(i,i+4).join(' '));return out;
}
function jaccard(a,b){
  if(!a.size||!b.size)return 0;
  let common=0;for(const x of a)if(b.has(x))common++;
  return common/(a.size+b.size-common);
}
function diag(id,page,text){return JSON.stringify({dataset:id,title:page.title,grounding:page.catalog?.loreGrounding,catalog:page.catalog,tags:page.tags,rows:rows(page),context:text});}

const pages=[];let sparse=0,empty=0;
for(const id of IDS){
  const spec=manifest.datasets.find(x=>x.id===id);
  if(!spec)throw new Error(`${id}: dataset absent`);
  if(spec.quality?.loreVersion!==2||Number(spec.quality?.maxIdenticalTextRatio)!==DECLARED_LIMIT)throw new Error(`${id}: métadonnées qualité lore V2 absentes`);
  for(const page of load(spec)){
    const blocks=context(page),grounding=page.catalog?.loreGrounding;
    if(blocks.length!==2)throw new Error(`${page.title}: ${blocks.length} paragraphes de contexte, attendu 2`);
    if(page.catalog?.loreVersion!==2||page.catalog?.loreMethod!=='source-grounded-context')throw new Error(`${page.title}: traçabilité lore V2 absente`);
    if(!['sparse','detailed'].includes(grounding))throw new Error(`${page.title}: loreGrounding invalide (${grounding})`);
    const text=blocks.map(b=>b.text).join(' '),ntext=norm(text);
    if(text.length<100)throw new Error(`${page.title}: contexte trop pauvre (${text.length})`);
    for(const re of forbidden)if(re.test(text))throw new Error(`${page.title}: ancien remplissage ou champ technique détecté (${re})`);
    const ownFacts=facts(page),ownEffects=effects(page);
    if(grounding==='sparse'){
      sparse++;
      if(ownFacts.length||ownEffects.length)throw new Error(`${page.title}: marqué sparse malgré une propriété exploitable — ${diag(id,page,text)}`);
    }else if(id==='equipement'&&!ownFacts.length&&!ownEffects.length){
      throw new Error(`${page.title}: marqué detailed sans propriété exploitable — ${diag(id,page,text)}`);
    }
    const values=anchors(page);
    if(!values.length){
      if(grounding!=='sparse')throw new Error(`${page.title}: contexte détaillé sans ancrage — ${diag(id,page,text)}`);
      if(!/aucun effet ni propriete|aucun effet supplementaire|aucune autre propriete/.test(ntext))throw new Error(`${page.title}: données vides non signalées — ${diag(id,page,text)}`);
      empty++;
    }else if(!values.some(v=>ntext.includes(v))){
      throw new Error(`${page.title}: contexte non ancré — valeurs=${JSON.stringify(values)} — ${diag(id,page,text)}`);
    }
    pages.push({page,grounding,set:shingles(page)});
  }
}
let worst={ratio:0,a:'',b:''};
for(let i=0;i<pages.length;i++)for(let j=i+1;j<pages.length;j++){
  if(pages[i].grounding==='sparse'||pages[j].grounding==='sparse')continue;
  const ratio=jaccard(pages[i].set,pages[j].set);
  if(ratio>worst.ratio)worst={ratio,a:pages[i].page.title,b:pages[j].page.title};
  if(ratio>NEAR_DUPLICATE_LIMIT)throw new Error(`Lore Réalité quasi dupliqué (Jaccard ${(ratio*100).toFixed(1)}%): ${pages[i].page.title} / ${pages[j].page.title}`);
}
const bastion=pages.find(x=>norm(x.page.title)==='bastion');
if(!bastion||bastion.grounding!=='sparse')throw new Error(`Bastion: page sparse attendue`);
console.log(`Bastion QA — ${context(bastion.page).map(b=>b.text).join(' || ')}`);
console.log(`Lore Réalité V2 OK — ${pages.length} pages · ${sparse} entrées sobres (${empty} sans donnée au-delà du classement) · similarité Jaccard max ${(worst.ratio*100).toFixed(1)}% (${worst.a} / ${worst.b}) · quasi-duplication > ${(NEAR_DUPLICATE_LIMIT*100).toFixed(0)}% interdite · remplissage générique interdit.`);
