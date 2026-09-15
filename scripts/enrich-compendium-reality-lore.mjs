import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const FRAGMENT_SIZE=8000;
const DATASETS=['equipement','augmentations'];

const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const punctuate=value=>{const s=String(value??'').trim().replace(/\s+/g,' ');return !s?'':/[.!?…]$/.test(s)?s:`${s}.`;};
const lowerFirst=value=>{const s=String(value??'').trim();return s?s[0].toLowerCase()+s.slice(1):s;};
const PUBLIC_META_LABEL=/^(categorie|category|famille|family|type|prix|price|cout|cost|generation|source|path|chemin|id|pricemode|pricelabel)$/;

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    const file=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    if(!fs.existsSync(file))throw new Error(`${spec.id}: fragment absent ${file}`);
    b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
  }
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}

function writeDataset(spec,rows){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  const payload=JSON.stringify(rows);
  const b64=zlib.gzipSync(Buffer.from(payload,'utf8'),{level:9}).toString('base64');
  const parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  spec.parts=parts;
  spec.count=rows.length;
  spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
  spec.quality={...(spec.quality||{}),loreVersion:2,maxIdenticalTextRatio:0.6,method:'source-grounded-context'};
}

function allTableRows(page){
  return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>Array.isArray(block.rows)?block.rows:[]));
}
function rowLabel(row){return String(row?.[0]??'').trim();}
function rowValue(row){return String(row?.[1]??'').trim().replace(/\s+/g,' ');}
function firstRow(rows,re){return rows.find(row=>re.test(norm(rowLabel(row)))&&rowValue(row));}
function uniqueRows(rows){
  const out=[],seen=new Set();
  for(const row of rows){
    if(!Array.isArray(row)||row.length<2)continue;
    const label=rowLabel(row),value=rowValue(row),key=`${norm(label)}|${norm(value)}`;
    if(!label||!value||seen.has(key))continue;
    seen.add(key);out.push([label,value]);
  }
  return out;
}
function concreteRows(rows){
  const effect=/^(effet usage|effet|usage|fonction|description|profil)$/;
  return uniqueRows(rows).filter(([label,value])=>{
    const n=norm(label);
    if(PUBLIC_META_LABEL.test(n)||effect.test(n))return false;
    if(/^illustration/.test(n))return false;
    return norm(value)!=='';
  });
}
function effectValue(rows){
  const row=firstRow(rows,/^(effet usage|effet|usage|fonction|description|profil)$/);
  if(!row)return '';
  const value=rowValue(row);
  return norm(value)?value:'';
}
function priceValue(rows){const row=firstRow(rows,/^(prix|price|cout|cost)$/);return row?rowValue(row):'';}
function priceDisplay(rows){
  const label=firstRow(rows,/^(pricelabel)$/);
  return label?rowValue(label):priceValue(rows);
}
function categoryValue(page,rows){
  const row=firstRow(rows,/^(categorie|category|famille|family|type)$/);
  return row?rowValue(row):String(page.catalog?.category||page.tags?.find(tag=>!['Réalité','Équipement','Augmentations'].includes(tag))||'').trim();
}
function compactFact([label,value]){return `${lowerFirst(label)} : ${value}`;}
function itemKind(page,category){
  const s=norm(`${category} ${page.title}`);
  if(page.category==='Augmentations')return 'une augmentation';
  if(/neuroprogramme/.test(s))return 'un neuroprogramme';
  if(/vehicule|voiture|moto|camion|transport/.test(s))return 'un véhicule';
  if(/arme|pistolet|fusil|carabine|shotgun|mitrail|lame|couteau|matraque|taser/.test(s))return 'une arme';
  if(/armure|protection|gilet|casque|blindage|bouclier/.test(s))return 'un équipement de protection';
  if(/service|abonnement|pass|assurance|loyer|hotel|hôtel|repas|transport/.test(s))return 'une offre de service';
  if(/medical|médical|soin|medkit|pharma|chirurg/.test(s))return 'un matériel médical';
  if(/outil|kit|atelier|maintenance|reparation|réparation/.test(s))return 'un équipement technique';
  return 'un équipement';
}
function describeIdentity(page,category){
  const kind=itemKind(page,category);
  if(category)return `${page.title} est ${kind} classé dans « ${category} ».`;
  return `${page.title} est ${kind} de Réalité.`;
}
function factSentence(facts,limit=3){
  const picked=facts.slice(0,limit);
  if(!picked.length)return '';
  if(picked.length===1)return `Sa caractéristique « ${picked[0][0]} » est donnée à ${picked[0][1]}.`;
  const rendered=picked.map(compactFact);
  return `Ses caractéristiques associent ${rendered.slice(0,-1).join(', ')} et ${rendered.at(-1)}.`;
}
function ensureConcreteLength(text,page,category,rows){
  let out=String(text||'').replace(/\s+/g,' ').trim();
  if(out.length>=45)return out;
  const candidates=uniqueRows(rows).filter(([label])=>!PUBLIC_META_LABEL.test(norm(label))&&!/^illustration/.test(norm(label)));
  const extra=candidates.find(([label,value])=>!norm(out).includes(norm(value))&&!norm(out).includes(norm(label)));
  if(extra)out=`${out} Pour ${page.title}, « ${extra[0]} » est indiqué à ${extra[1]}.`.trim();
  if(out.length<45&&category)out=`${out} Cette référence appartient à la catégorie « ${category} ».`.trim();
  return out;
}
function sparseEquipmentLore(page,category,displayPrice,rows){
  const p1=displayPrice
    ? `${page.title} est classé dans « ${category||'Équipement'} », avec un prix de référence de ${displayPrice}.`
    : `${page.title} appartient à la catégorie « ${category||'Équipement'} » de Réalité.`;
  const p2=`Aucun effet ni usage spécial propre n’est associé à ${page.title} : cette référence est définie par son classement${displayPrice?` et son tarif de ${displayPrice}`:''}, sans propriété additionnelle attribuée.`;
  return [ensureConcreteLength(p1,page,category,rows),ensureConcreteLength(p2,page,category,rows)];
}
function equipmentLore(page){
  const rows=allTableRows(page),category=categoryValue(page,rows),effect=effectValue(rows),displayPrice=priceDisplay(rows),facts=concreteRows(rows);
  if(!effect&&!facts.length)return {paragraphs:sparseEquipmentLore(page,category,displayPrice,rows),grounding:'sparse'};
  const p1=[describeIdentity(page,category)];
  if(effect)p1.push(`Sa fonction ou son usage est décrit ainsi : « ${punctuate(effect).replace(/[.]$/,'')} ».`);
  else p1.push(factSentence(facts,2));

  const remaining=effect?facts:facts.slice(2);
  const p2=[];
  if(remaining.length)p2.push(factSentence(remaining,3));
  if(displayPrice)p2.push(`Son prix de référence est fixé à ${punctuate(displayPrice)}`);
  if(!p2.length&&facts.length)p2.push(factSentence(facts,3));
  if(!p2.length)p2.push(`${page.title} conserve les caractéristiques propres à « ${category||'Équipement'} » sans autre effet distinctif.`);
  return {paragraphs:[ensureConcreteLength(p1.join(' '),page,category,rows),ensureConcreteLength(p2.join(' '),page,category,rows)],grounding:'detailed'};
}
function augmentationLore(page){
  const sections=(page.sections||[]).filter(section=>section.id!=='contexte');
  const rows=sections.flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]));
  const category=String((page.catalog?.categories||[]).join(' · ')||page.catalog?.category||'Augmentations');
  const effects=[...new Set(sections.map(section=>effectValue((section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]))).filter(Boolean))];
  const generations=[...new Set((page.catalog?.generations||[]).map(Number).filter(Number.isFinite))].sort((a,b)=>a-b);
  const prices=[...new Set(sections.map(section=>priceDisplay((section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]))).filter(Boolean))];
  const facts=concreteRows(rows);
  if(!effects.length&&!facts.length){
    const p1=`${page.title} est classée parmi les augmentations de la famille « ${category} ».`;
    const known=[];
    if(generations.length)known.push(`les ${generations.map(g=>`générations ${g}`).join(' et ')}`);
    if(prices.length===1)known.push(`un prix de référence de ${prices[0]}`);
    else if(prices.length>1)known.push(`des prix de référence de ${prices.slice(0,4).join(', ')}`);
    const p2=known.length
      ? `Aucun effet propre supplémentaire n’est documenté pour ${page.title} ; les données disponibles se limitent à ${known.join(' et ')}.`
      : `Aucun effet propre supplémentaire n’est documenté pour ${page.title} ; seule sa classification d’augmentation est renseignée.`;
    return {paragraphs:[ensureConcreteLength(p1,page,category,rows),ensureConcreteLength(p2,page,category,rows)],grounding:'sparse'};
  }

  const p1=[`${page.title} est une augmentation de la famille « ${category} ».`];
  if(effects.length===1)p1.push(`Sa fonction est décrite ainsi : « ${punctuate(effects[0]).replace(/[.]$/,'')} ».`);
  else if(effects.length>1)p1.push(`Ses variantes couvrent plusieurs effets distincts : ${effects.slice(0,3).map(x=>`« ${punctuate(x).replace(/[.]$/,'')} »`).join(' ; ')}.`);
  else if(facts.length)p1.push(factSentence(facts,2));

  const p2=[];
  if(generations.length)p2.push(`Elle existe ici en ${generations.map(g=>`génération ${g}`).join(' et ')}.`);
  if(facts.length)p2.push(factSentence(facts,3));
  if(prices.length===1)p2.push(`Son prix de référence est fixé à ${punctuate(prices[0])}`);
  else if(prices.length>1)p2.push(`Selon la variante, ses prix de référence sont ${prices.slice(0,4).join(', ')}.`);
  if(!p2.length)p2.push(`${page.title} conserve les caractéristiques propres à sa famille d’augmentation sans autre effet distinctif documenté.`);
  return {paragraphs:[ensureConcreteLength(p1.join(' '),page,category,rows),ensureConcreteLength(p2.join(' '),page,category,rows)],grounding:'detailed'};
}
function replaceContext(page,paragraphs,grounding){
  const section=(page.sections||[]).find(section=>section.id==='contexte');
  if(!section)throw new Error(`${page.title}: section contexte absente`);
  section.title='Description et usage';
  section.blocks=paragraphs.map(text=>({type:'p',style:'lore source-grounded',text}));
  page.catalog={...(page.catalog||{}),loreVersion:2,loreMethod:'source-grounded-context',loreGrounding:grounding};
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
let total=0;
let bastionTrace=null;
for(const id of DATASETS){
  const spec=manifest.datasets.find(item=>item.id===id);
  if(!spec)throw new Error(`Dataset ${id} absent du manifeste`);
  const pages=loadDataset(spec);
  for(const page of pages){
    const result=id==='equipement'?equipmentLore(page):augmentationLore(page);
    if(result.paragraphs.some(text=>text.length<45))throw new Error(`${page.title}: lore Réalité trop court`);
    replaceContext(page,result.paragraphs,result.grounding);
    if(id==='equipement'&&norm(page.title)==='bastion')bastionTrace={...result,rows:allTableRows(page)};
  }
  writeDataset(spec,pages);total+=pages.length;
  console.log(`Lore Réalité V2 enrichi — ${id}: ${pages.length} pages · SHA ${spec.sha256}`);
}
if(!bastionTrace)throw new Error('Bastion: page introuvable après enrichissement');
console.log(`Bastion contrôle [${bastionTrace.grounding}] — ${bastionTrace.paragraphs.join(' || ')}`);
console.log(`Bastion propriétés — ${bastionTrace.rows.map(row=>`${rowLabel(row)}=${rowValue(row)}`).join(' · ')}`);
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Lore Réalité V2 — ${total} pages réécrites depuis leurs propriétés documentées.`);
