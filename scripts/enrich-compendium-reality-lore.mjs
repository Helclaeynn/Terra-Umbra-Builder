import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const FRAGMENT_SIZE=8000;
const DATASETS=['equipement','augmentations'];

const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const lowerFirst=value=>{const s=clean(value);return s?s[0].toLowerCase()+s.slice(1):s;};
const finish=value=>{const s=clean(value);return !s?'':/[.!?…]$/.test(s)?s:`${s}.`;};
const EFFECT_LABEL=/^(effet usage|effet|usage|fonction|description|profil)$/;

function isPriceMeta(label){return /^(price|prix|cout|cost)(?: ?(?:mode|label|min|max|minimum|maximum))?$/.test(label);}
function isMetaLabel(label){
  return /^(categorie|category|famille|family|type|generation|source|path|chemin|id)$/.test(label)||isPriceMeta(label);
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
function writeDataset(spec,pages){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');
  const parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  spec.parts=parts;
  spec.count=pages.length;
  spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
  spec.quality={...(spec.quality||{}),loreVersion:2,maxIdenticalTextRatio:0.6,method:'source-grounded-context'};
}
function rowsOf(page){
  return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>Array.isArray(block.rows)?block.rows:[]));
}
function label(row){return clean(row?.[0]);}
function value(row){return clean(row?.[1]);}
function first(rows,predicate){return rows.find(row=>predicate(norm(label(row)))&&value(row));}
function uniqueRows(rows){
  const out=[],seen=new Set();
  for(const row of rows){
    if(!Array.isArray(row)||row.length<2)continue;
    const l=label(row),v=value(row),key=`${norm(l)}|${norm(v)}`;
    if(!l||!v||seen.has(key))continue;
    seen.add(key);out.push([l,v]);
  }
  return out;
}
function factsOf(rows){
  return uniqueRows(rows).filter(([l,v])=>{
    const n=norm(l);
    return norm(v)&&!isMetaLabel(n)&&!EFFECT_LABEL.test(n)&&!/^illustration/.test(n);
  });
}
function effectOf(rows){
  const row=first(rows,n=>EFFECT_LABEL.test(n));
  if(!row)return '';
  return norm(value(row))?value(row):'';
}
function categoryOf(page,rows){
  const row=first(rows,n=>/^(categorie|category|famille|family|type)$/.test(n));
  if(row)return value(row);
  return clean(page.catalog?.category||page.tags?.find(tag=>!['Réalité','Équipement','Augmentations'].includes(tag))||'');
}
function priceOf(rows){
  const display=first(rows,n=>/^(price ?label)$/.test(n));
  if(display)return value(display);
  const direct=first(rows,n=>/^(prix|price|cout|cost)$/.test(n));
  if(direct)return value(direct);
  const min=first(rows,n=>/^(price|prix|cout|cost) ?(min|minimum)$/.test(n));
  const max=first(rows,n=>/^(price|prix|cout|cost) ?(max|maximum)$/.test(n));
  if(min&&max)return `${value(min)} - ${value(max)} $`;
  return min?`à partir de ${value(min)} $`:max?`jusqu’à ${value(max)} $`:'';
}
function factSentence(facts,limit=3){
  const picked=facts.slice(0,limit);
  if(!picked.length)return '';
  if(picked.length===1)return `Sa caractéristique « ${picked[0][0]} » vaut ${picked[0][1]}.`;
  const rendered=picked.map(([l,v])=>`${lowerFirst(l)} : ${v}`);
  return `Ses caractéristiques associent ${rendered.slice(0,-1).join(', ')} et ${rendered.at(-1)}.`;
}
function itemKind(page,category){
  const s=norm(`${category} ${page.title}`);
  if(page.category==='Augmentations')return 'une augmentation';
  if(/neuroprogramme/.test(s))return 'un neuroprogramme';
  if(/vehicule|voiture|moto|camion|transport/.test(s))return 'un véhicule';
  if(/arme|pistolet|fusil|carabine|shotgun|mitrail|lame|couteau|matraque|taser/.test(s))return 'une arme';
  if(/armure|protection|gilet|casque|blindage|bouclier/.test(s))return 'un équipement de protection';
  if(/service|abonnement|pass|assurance|loyer|hotel|repas|transport/.test(s))return 'une offre de service';
  if(/medical|soin|medkit|pharma|chirurg/.test(s))return 'un matériel médical';
  if(/outil|kit|atelier|maintenance|reparation/.test(s))return 'un équipement technique';
  return 'un équipement';
}
function ensureLength(text,page,category,rows){
  let out=clean(text);
  if(out.length>=45)return out;
  const extra=factsOf(rows).find(([l,v])=>!norm(out).includes(norm(l))&&!norm(out).includes(norm(v)));
  if(extra)out=`${out} Sa caractéristique « ${extra[0]} » vaut ${extra[1]}.`;
  if(out.length<45&&category)out=`${out} Il appartient à la catégorie « ${category} ».`;
  return clean(out);
}
function sparseEquipment(page,rows,category,price){
  const p1=price
    ?`${page.title} figure dans la catégorie « ${category||'Équipement'} », avec un prix de référence de ${price}.`
    :`${page.title} figure dans la catégorie « ${category||'Équipement'} » de Réalité.`;
  const p2=price
    ?`Aucun effet ni propriété supplémentaire n’est attribué à ${page.title} : seules sa catégorie et sa tarification de ${price} sont établies.`
    :`Aucun effet ni propriété supplémentaire n’est attribué à ${page.title} au-delà de son classement dans « ${category||'Équipement'} ».`;
  return {paragraphs:[ensureLength(p1,page,category,rows),ensureLength(p2,page,category,rows)],grounding:'sparse'};
}
function equipmentLore(page){
  const rows=rowsOf(page),category=categoryOf(page,rows),price=priceOf(rows),effect=effectOf(rows),facts=factsOf(rows);
  if(!effect&&!facts.length)return sparseEquipment(page,rows,category,price);
  const p1=[`${page.title} est ${itemKind(page,category)} classé dans « ${category||'Équipement'} ».`];
  if(effect)p1.push(`Son usage ou son effet propre est le suivant : ${finish(effect)}`);
  else p1.push(factSentence(facts,2));
  const p2=[];
  const remaining=effect?facts:facts.slice(2);
  if(remaining.length)p2.push(factSentence(remaining,3));
  if(price)p2.push(`Son prix de référence est ${finish(price)}`);
  if(!p2.length)p2.push(`${page.title} ne reçoit aucune autre propriété distincte dans les données établies pour cette référence.`);
  return {paragraphs:[ensureLength(p1.join(' '),page,category,rows),ensureLength(p2.join(' '),page,category,rows)],grounding:'detailed'};
}
function augmentationLore(page){
  const sections=(page.sections||[]).filter(section=>section.id!=='contexte');
  const rows=sections.flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]));
  const category=clean((page.catalog?.categories||[]).join(' · ')||page.catalog?.category||'Augmentations');
  const effects=[...new Set(sections.map(section=>effectOf((section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]))).filter(Boolean))];
  const facts=factsOf(rows);
  const generations=[...new Set((page.catalog?.generations||[]).map(Number).filter(Number.isFinite))].sort((a,b)=>a-b);
  const prices=[...new Set(sections.map(section=>priceOf((section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]))).filter(Boolean))];
  if(!effects.length&&!facts.length){
    const p1=`${page.title} est classée parmi les augmentations de la famille « ${category} ».`;
    const known=[];
    if(generations.length)known.push(generations.map(g=>`génération ${g}`).join(' et '));
    if(prices.length===1)known.push(`un prix de référence de ${prices[0]}`);
    else if(prices.length>1)known.push(`des prix de référence de ${prices.slice(0,4).join(', ')}`);
    const p2=known.length
      ?`Aucun effet supplémentaire n’est attribué à ${page.title} ; les éléments établis se limitent à ${known.join(' et ')}.`
      :`Aucun effet supplémentaire n’est attribué à ${page.title} au-delà de son classement parmi les augmentations.`;
    return {paragraphs:[ensureLength(p1,page,category,rows),ensureLength(p2,page,category,rows)],grounding:'sparse'};
  }
  const p1=[`${page.title} est une augmentation de la famille « ${category} ».`];
  if(effects.length===1)p1.push(`Son effet propre est le suivant : ${finish(effects[0])}`);
  else if(effects.length>1)p1.push(`Ses variantes possèdent plusieurs effets distincts : ${effects.slice(0,3).map(finish).join(' ')}`);
  else p1.push(factSentence(facts,2));
  const p2=[];
  if(generations.length)p2.push(`Elle existe ici en ${generations.map(g=>`génération ${g}`).join(' et ')}.`);
  if(facts.length)p2.push(factSentence(facts,3));
  if(prices.length===1)p2.push(`Son prix de référence est ${finish(prices[0])}`);
  else if(prices.length>1)p2.push(`Selon la variante, ses prix de référence sont ${prices.slice(0,4).join(', ')}.`);
  if(!p2.length)p2.push(`${page.title} ne reçoit aucune autre propriété distincte dans les données établies pour cette augmentation.`);
  return {paragraphs:[ensureLength(p1.join(' '),page,category,rows),ensureLength(p2.join(' '),page,category,rows)],grounding:'detailed'};
}
function replaceContext(page,result){
  const section=(page.sections||[]).find(section=>section.id==='contexte');
  if(!section)throw new Error(`${page.title}: section contexte absente`);
  section.title='Description et usage';
  section.blocks=result.paragraphs.map(text=>({type:'p',style:'lore source-grounded',text}));
  page.catalog={...(page.catalog||{}),loreVersion:2,loreMethod:'source-grounded-context',loreGrounding:result.grounding};
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
let total=0,bastion=null;
for(const id of DATASETS){
  const spec=manifest.datasets.find(item=>item.id===id);
  if(!spec)throw new Error(`Dataset ${id} absent du manifeste`);
  const pages=loadDataset(spec);
  for(const page of pages){
    const result=id==='equipement'?equipmentLore(page):augmentationLore(page);
    if(result.paragraphs.some(text=>text.length<45))throw new Error(`${page.title}: lore Réalité trop court`);
    replaceContext(page,result);
    if(id==='equipement'&&norm(page.title)==='bastion')bastion={...result,rows:rowsOf(page)};
  }
  writeDataset(spec,pages);total+=pages.length;
  console.log(`Lore Réalité V2 enrichi — ${id}: ${pages.length} pages · SHA ${spec.sha256}`);
}
if(!bastion)throw new Error('Bastion: page introuvable après enrichissement');
console.log(`Bastion contrôle [${bastion.grounding}] — ${bastion.paragraphs.join(' || ')}`);
console.log(`Bastion propriétés — ${bastion.rows.map(row=>`${label(row)}=${value(row)}`).join(' · ')}`);
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Lore Réalité V2 — ${total} pages réécrites depuis leurs propriétés documentées.`);
