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
const stableVariant=(key,count=4)=>crypto.createHash('sha1').update(String(key)).digest()[0]%count;

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
function factSentence(facts,limit=3,variant=0){
  const picked=facts.slice(0,limit);
  if(!picked.length)return '';
  if(picked.length===1){
    const [l,v]=picked[0];
    return [
      `Sa caractéristique « ${l} » vaut ${v}.`,
      `Pour « ${l} », la valeur indiquée est ${v}.`,
      `La donnée « ${l} » est fixée à ${v}.`,
      `« ${l} » est renseigné à ${v}.`
    ][variant%4];
  }
  const rendered=picked.map(([l,v])=>`${lowerFirst(l)} : ${v}`),joined=`${rendered.slice(0,-1).join(', ')} et ${rendered.at(-1)}`;
  return [
    `Ses caractéristiques associent ${joined}.`,
    `Les données propres à cette référence donnent ${joined}.`,
    `Le profil indiqué réunit ${joined}.`,
    `Les valeurs documentées sont ${joined}.`
  ][variant%4];
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
function identitySentence(page,category,variant){
  const cat=category||'Équipement',kind=itemKind(page,category);
  return [
    `${page.title} est ${kind} classé dans « ${cat} ».`,
    `Dans « ${cat} », ${page.title} est répertorié comme ${kind}.`,
    `${page.title} relève de « ${cat} » et correspond à ${kind}.`,
    `La famille « ${cat} » comprend ${page.title}, ${kind}.`
  ][variant%4];
}
function effectSentence(page,effect,variant){
  return [
    `Son usage ou son effet propre est le suivant : ${finish(effect)}`,
    `Cette référence se distingue par l’effet suivant : ${finish(effect)}`,
    `Le fonctionnement associé à cette référence est décrit ainsi : ${finish(effect)}`,
    `L’effet documenté pour ${page.title} est le suivant : ${finish(effect)}`
  ][variant%4];
}
function priceSentence(page,price,variant){
  return [
    `Son prix de référence est ${finish(price)}`,
    `La tarification indiquée est ${finish(price)}`,
    `Le montant de référence retenu est ${finish(price)}`,
    `Le prix associé à ${page.title} est ${finish(price)}`
  ][variant%4];
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
  const rows=rowsOf(page),category=categoryOf(page,rows),price=priceOf(rows),effect=effectOf(rows),facts=factsOf(rows),variant=stableVariant(`equipment|${page.title}|${category}`);
  if(!effect&&!facts.length)return sparseEquipment(page,rows,category,price);
  const p1=[identitySentence(page,category,variant)];
  if(effect)p1.push(effectSentence(page,effect,variant));
  else p1.push(factSentence(facts,2,variant));
  const p2=[];
  const remaining=effect?facts:facts.slice(2);
  if(remaining.length)p2.push(factSentence(remaining,3,(variant+1)%4));
  if(price)p2.push(priceSentence(page,price,(variant+2)%4));
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
  const variant=stableVariant(`augmentation|${page.title}|${category}`);
  if(!effects.length&&!facts.length){
    const p1=[
      `${page.title} est classée parmi les augmentations de la famille « ${category} ».`,
      `La famille « ${category} » comprend l’augmentation ${page.title}.`,
      `${page.title} relève des augmentations rattachées à « ${category} ».`,
      `Parmi « ${category} », ${page.title} constitue une augmentation distincte.`
    ][variant];
    const known=[];
    if(generations.length)known.push(generations.map(g=>`génération ${g}`).join(' et '));
    if(prices.length===1)known.push(`un prix de référence de ${prices[0]}`);
    else if(prices.length>1)known.push(`des prix de référence de ${prices.slice(0,4).join(', ')}`);
    const p2=known.length
      ?`Aucun effet supplémentaire n’est attribué à ${page.title} ; les éléments établis se limitent à ${known.join(' et ')}.`
      :`Aucun effet supplémentaire n’est attribué à ${page.title} au-delà de son classement parmi les augmentations.`;
    return {paragraphs:[ensureLength(p1,page,category,rows),ensureLength(p2,page,category,rows)],grounding:'sparse'};
  }
  const p1=[
    `${page.title} est une augmentation de la famille « ${category} ».`,
    `Dans la famille « ${category} », ${page.title} est répertoriée comme une augmentation.`,
    `${page.title} appartient à « ${category} » en tant qu’augmentation.`,
    `La famille « ${category} » inclut ${page.title}, une augmentation.`
  ][variant];
  const firstParts=[p1];
  if(effects.length===1)firstParts.push([
    `Son effet propre est le suivant : ${finish(effects[0])}`,
    `La propriété distinctive indiquée est : ${finish(effects[0])}`,
    `Son fonctionnement est décrit ainsi : ${finish(effects[0])}`,
    `L’effet associé à ${page.title} est : ${finish(effects[0])}`
  ][variant]);
  else if(effects.length>1)firstParts.push([
    `Ses variantes possèdent plusieurs effets distincts : ${effects.slice(0,3).map(finish).join(' ')}`,
    `Plusieurs effets sont documentés selon la variante : ${effects.slice(0,3).map(finish).join(' ')}`,
    `Les variantes se distinguent par plusieurs effets : ${effects.slice(0,3).map(finish).join(' ')}`,
    `Pour ${page.title}, les effets varient selon la version : ${effects.slice(0,3).map(finish).join(' ')}`
  ][variant]);
  else firstParts.push(factSentence(facts,2,variant));
  const p2=[];
  if(generations.length)p2.push([
    `Elle existe ici en ${generations.map(g=>`génération ${g}`).join(' et ')}.`,
    `Les générations documentées sont ${generations.join(' et ')}.`,
    `Cette augmentation est présente en ${generations.map(g=>`génération ${g}`).join(' et ')}.`,
    `Pour ${page.title}, les générations retenues sont ${generations.join(' et ')}.`
  ][variant]);
  if(facts.length)p2.push(factSentence(facts,3,(variant+1)%4));
  if(prices.length===1)p2.push([
    `Son prix de référence est ${finish(prices[0])}`,
    `La tarification indiquée est ${finish(prices[0])}`,
    `Le montant de référence retenu est ${finish(prices[0])}`,
    `Le prix associé à ${page.title} est ${finish(prices[0])}`
  ][variant]);
  else if(prices.length>1)p2.push(`Selon la variante, ses prix de référence sont ${prices.slice(0,4).join(', ')}.`);
  if(!p2.length)p2.push(`${page.title} ne reçoit aucune autre propriété distincte dans les données établies pour cette augmentation.`);
  return {paragraphs:[ensureLength(firstParts.join(' '),page,category,rows),ensureLength(p2.join(' '),page,category,rows)],grounding:'detailed'};
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
