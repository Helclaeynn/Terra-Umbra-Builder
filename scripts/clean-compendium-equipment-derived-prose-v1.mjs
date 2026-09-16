import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const FRAGMENT_SIZE=8000;
const META=/^(categorie|category|famille|family|type|generation|source|path|chemin|id|illustration|price|prix|cout|cost|pricemode|pricelabel|pricemin|pricemax|price mode|price label|price min|price max)$/;
const EFFECT=/^(effet usage|effet|usage|fonction|fonction principale|description|profil)$/;

const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const norm=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function tidy(value){
  return clean(value)
    .replace(/\.{2,}/g,'.')
    .replace(/\s*;\s*/g,' ; ')
    .replace(/\s+,/g,',')
    .replace(/\bpas bonus\b/gi,'pas de bonus')
    .replace(/\s+([.!?])/g,'$1');
}
function finish(value){const s=tidy(value);return !s?'':/[.!?…]$/.test(s)?s:`${s}.`;}
function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function write(spec,pages){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');
  const parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
}
function rows(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>Array.isArray(block.rows)?block.rows:[]));}
function uniqueRows(page){
  const out=[],seen=new Set();
  for(const row of rows(page)){
    if(!Array.isArray(row)||row.length<2)continue;
    const label=clean(row[0]),value=tidy(row[1]);
    if(!label||!value)continue;
    const key=`${norm(label)}|${norm(value)}`;
    if(seen.has(key))continue;seen.add(key);out.push([label,value]);
  }
  return out;
}
function sourceFacts(page){
  const all=uniqueRows(page);
  const effect=all.find(([label])=>EFFECT.test(norm(label)))?.[1]||'';
  const category=all.find(([label])=>/^(categorie|category|famille|family|type)$/.test(norm(label)))?.[1]||clean(page.catalog?.category||'');
  const extra=all.filter(([label])=>!META.test(norm(label))&&!EFFECT.test(norm(label))).slice(0,3);
  return {effect,category,extra};
}
function factParagraphs(page){
  const {effect,category,extra}=sourceFacts(page),paragraphs=[];
  if(effect)paragraphs.push(`${page.title} — ${finish(effect)}`);
  else if(category)paragraphs.push(`${page.title} — catégorie : ${finish(category)}`);
  else paragraphs.push(`${page.title}.`);

  if(extra.length){
    const rendered=extra.map(([label,value])=>`${clean(label)} — ${finish(value).replace(/[.]$/,'')}`).join(' ; ');
    paragraphs.push(`Caractéristiques documentées : ${rendered}.`);
  } else if(category){
    paragraphs.push(`Catégorie documentée : ${finish(category)}`);
  } else {
    paragraphs.push('Aucune description distincte n’est fournie dans la source de catalogue au-delà des propriétés affichées ci-dessous.');
  }
  return paragraphs.map(tidy);
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(item=>item.id==='equipement');
if(!spec)throw new Error('Dataset equipement absent');
const pages=load(spec);
let cleaned=0;
for(const page of pages){
  if(page.catalog?.loreGrounding!=='derived')continue;
  const section=(page.sections||[]).find(item=>item.id==='contexte');
  if(!section)throw new Error(`${page.title}: section contexte absente`);
  section.title='Description et usage';
  section.blocks=factParagraphs(page).map(text=>({type:'p',style:'lore reality-catalog-facts',text}));
  page.catalog={
    ...(page.catalog||{}),
    loreVersion:3,
    loreMethod:'catalogue-facts-only',
    loreGrounding:'catalogue-facts',
    loreSource:'Catalogue Réalité du Builder'
  };
  cleaned++;
}
write(spec,pages);
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Descriptions équipement nettoyées — ${cleaned} pages dérivées remplacées par des faits de source · SHA ${spec.sha256}.`);
