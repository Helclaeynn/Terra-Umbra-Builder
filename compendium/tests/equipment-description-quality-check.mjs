import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const META=/^(categorie|category|famille|family|type|generation|source|path|chemin|id|illustration|price|prix|cout|cost|pricemode|pricelabel|pricemin|pricemax|price mode|price label|price min|price max)$/;
const EFFECT=/^(effet usage|effet|usage|fonction|fonction principale|description|profil)$/;
const BAD=[
  /est une prestation plutôt qu[’']un objet/i,
  /est un bien de Réalité dont l[’']usage est défini/i,
  /Sur le terrain, ses caractéristiques utiles se lisent/i,
  /Elles déterminent la façon dont on l[’']emporte, l[’']emploie/i,
  /Ce n[’']est pas un simple libellé commercial/i,
  /Les caractéristiques retenues donnent notamment/i,
  /Parmi les caractéristiques concrètes figurent/i,
  /Concrètement, .* se combine avec/i,
  /le point déterminant est que/i,
  /l[’']expérience montre que/i,
  /l[’']emploi cohérent suppose que/i,
  /la contrainte principale reste que/i,
  /la valeur pratique vient du fait que/i,
  /le choix pertinent exige que/i,
  /Une fois intégré aux moyens disponibles/i,
  /Dans l[’']usage concret/i
];

const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const norm=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function tidy(value){return clean(value).replace(/\.{2,}/g,'.').replace(/\s*;\s*/g,' ; ').replace(/\s+,/g,',').replace(/\bpas bonus\b/gi,'pas de bonus').replace(/\s+([.!?])/g,'$1');}
function finish(value){const s=tidy(value);return !s?'':/[.!?…]$/.test(s)?s:`${s}.`;}
function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    const file=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    if(!fs.existsSync(file))throw new Error(`Fragment absent: ${file}`);
    b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
  }
  const sha=crypto.createHash('sha256').update(b64).digest('hex');
  if(sha!==spec.sha256)throw new Error(`SHA équipement ${sha} != ${spec.sha256}`);
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function context(page){const section=(page.sections||[]).find(item=>item.id==='contexte');return (section?.blocks||[]).filter(block=>block.type==='p'&&clean(block.text));}
function rows(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>Array.isArray(block.rows)?block.rows:[]));}
function uniqueRows(page){
  const out=[],seen=new Set();
  for(const row of rows(page)){
    if(!Array.isArray(row)||row.length<2)continue;
    const label=clean(row[0]),value=tidy(row[1]);if(!label||!value)continue;
    const key=`${norm(label)}|${norm(value)}`;if(seen.has(key))continue;seen.add(key);out.push([label,value]);
  }
  return out;
}
function expectedFacts(page){
  const all=uniqueRows(page);
  const effect=all.find(([label])=>EFFECT.test(norm(label)))?.[1]||'';
  const category=all.find(([label])=>/^(categorie|category|famille|family|type)$/.test(norm(label)))?.[1]||clean(page.catalog?.category||'');
  const extra=all.filter(([label])=>!META.test(norm(label))&&!EFFECT.test(norm(label))).slice(0,3);
  const out=[];
  if(effect)out.push(`${page.title} — ${finish(effect)}`);
  else if(category)out.push(`${page.title} — catégorie : ${finish(category)}`);
  else out.push(`${page.title}.`);
  if(extra.length){
    const rendered=extra.map(([label,value])=>`${clean(label)} — ${finish(value).replace(/[.]$/,'')}`).join(' ; ');
    out.push(`Caractéristiques documentées : ${rendered}.`);
  } else if(category)out.push(`Catégorie documentée : ${finish(category)}`);
  else out.push('Aucune description distincte n’est fournie dans la source de catalogue au-delà des propriétés affichées ci-dessous.');
  return out.map(tidy);
}
function duplicateSentences(text){
  const sentences=clean(text).split(/(?<=[.!?…])\s+/).map(norm).filter(s=>s.length>=20),seen=new Set(),dupes=new Set();
  for(const sentence of sentences){if(seen.has(sentence))dupes.add(sentence);seen.add(sentence);}return [...dupes];
}

const spec=manifest.datasets.find(item=>item.id==='equipement');
if(!spec)throw new Error('Dataset equipement absent');
const pages=load(spec),errors=[];let factsOnly=0,sourceDriven=0;
const byTitle=new Map(pages.map(page=>[norm(page.title),page]));
for(const page of pages){
  const blocks=context(page),texts=blocks.map(block=>tidy(block.text)),joined=texts.join(' ');
  for(const re of BAD)if(re.test(joined))errors.push(`${page.title}: remplissage générique interdit (${re})`);
  if(/\.{2,}/.test(joined))errors.push(`${page.title}: ponctuation doublée`);
  const dupes=duplicateSentences(joined);if(dupes.length)errors.push(`${page.title}: phrase répétée (${dupes[0]})`);
  if(new Set(texts.map(norm)).size!==texts.length)errors.push(`${page.title}: paragraphes identiques`);

  if(page.catalog?.loreGrounding==='catalogue-facts'){
    factsOnly++;
    if(page.catalog?.loreMethod!=='catalogue-facts-only')errors.push(`${page.title}: méthode facts-only absente`);
    const expected=expectedFacts(page);
    if(texts.length!==expected.length||texts.some((text,index)=>text!==expected[index]))errors.push(`${page.title}: la description facts-only ne correspond pas exactement aux propriétés de source`);
  } else {
    sourceDriven++;
    if(blocks.length<2)errors.push(`${page.title}: contenu source-driven incomplet (${blocks.length} paragraphes)`);
  }
}
if(errors.length)throw new Error(`Descriptions équipement invalides (${errors.length}) — ${errors.slice(0,80).join(' | ')}`);

for(const [title,needle] of [['vladic grand protege','protection de quartier'],['cache improvisee','dissimulation par abandon oubli']]){
  const page=byTitle.get(title);if(!page)throw new Error(`Page de contrôle absente: ${title}`);
  const text=norm(context(page).map(block=>block.text).join(' '));if(!text.includes(needle))throw new Error(`${page.title}: usage source attendu absent (${needle})`);
  if(page.catalog?.loreGrounding!=='book-context'||page.catalog?.loreMethod!=='reality-book-semantic-lore')throw new Error(`${page.title}: devrait être curaté manuellement, trouvé ${page.catalog?.loreGrounding}/${page.catalog?.loreMethod}`);
}

console.log(`Descriptions équipement OK — ${pages.length} pages · ${factsOnly} facts-only · ${sourceDriven} source-driven · aucun remplissage générique, aucune phrase interne répétée.`);
