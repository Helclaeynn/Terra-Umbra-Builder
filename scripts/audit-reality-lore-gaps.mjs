import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=s=>String(s??'').trim().replace(/\s+/g,' ');
const FINAL_SOURCES=[
  'compendium/source/reality-lore-v3-final-eight.json',
  'compendium/source/reality-lore-v3-curated-holonet.json',
  'compendium/source/reality-lore-v3-curated-civic.json',
  'compendium/source/reality-lore-v3-curated-housing.json',
  'compendium/source/reality-lore-v3-curated-daily-life.json',
  'compendium/source/reality-lore-v3-curated-drugs-services.json',
  'compendium/source/reality-lore-v3-curated-vehicles.json',
  'compendium/source/reality-lore-v3-curated-armor.json',
  'compendium/source/reality-lore-v3-curated-armor-modules.json',
  'compendium/source/reality-lore-v3-curated-ammunition.json',
  'compendium/source/reality-lore-v3-curated-standard-ammunition.json',
  'compendium/source/reality-lore-v3-curated-weapons-melee-handguns.json',
  'compendium/source/reality-lore-v3-curated-weapons-firearms-heavy.json',
  'compendium/source/reality-lore-v3-curated-weapons-support.json',
  'compendium/source/reality-lore-v3-curated-lifestyle-services.json',
  'compendium/source/reality-lore-v3-curated-neuroprograms.json'
];
function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function rows(page){return (page.sections||[]).flatMap(s=>(s.blocks||[]).filter(b=>b.type==='table').flatMap(b=>b.rows||[]));}
function cat(page){const r=rows(page).find(r=>/^(categorie|category|famille|family|type)$/.test(norm(r?.[0])));return clean(r?.[1]||page.catalog?.category||'');}
function rowText(page){return rows(page).map(x=>`${clean(x?.[0])}=${clean(x?.[1])}`).filter(Boolean).join(' | ');}
const finalTitles=new Set();
for(const path of FINAL_SOURCES){
  const src=JSON.parse(fs.readFileSync(path,'utf8'));
  for(const title of Object.keys(src.entries||{})){
    const key=norm(title);
    if(finalTitles.has(key))throw new Error(`Titre dupliqué dans le corpus manuel final: ${title}`);
    finalTitles.add(key);
  }
}
for(const id of ['equipement','augmentations']){
  const spec=manifest.datasets.find(d=>d.id===id);if(!spec)continue;
  const pages=load(spec),gaps=pages.filter(p=>p.catalog?.loreGrounding==='sparse');
  console.log(`AUDIT ${id.toUpperCase()} — ${gaps.length} pages sparse`);
  for(const page of gaps)console.log(`SPARSE | ${page.title} | ${cat(page)} | ${rowText(page)}`);

  if(id==='equipement'){
    const facts=pages.filter(p=>p.catalog?.loreGrounding==='catalogue-facts');
    const outside=pages.filter(p=>!finalTitles.has(norm(p.title)));
    console.log(`AUDIT EQUIPEMENT FACTS-ONLY — ${facts.length} pages`);
    console.log(`AUDIT EQUIPEMENT CORPUS MANUEL FINAL — ${finalTitles.size}/${pages.length} titres`);
    console.log(`AUDIT EQUIPEMENT HORS CORPUS FINAL MANUEL — ${outside.length} pages`);
    if(finalTitles.size!==pages.length||outside.length)throw new Error(`Couverture manuelle finale incomplète: ${finalTitles.size}/${pages.length}, hors corpus=${outside.length}`);
  }
}
