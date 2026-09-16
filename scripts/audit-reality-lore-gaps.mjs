import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=s=>String(s??'').trim().replace(/\s+/g,' ');
function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function rows(page){return (page.sections||[]).flatMap(s=>(s.blocks||[]).filter(b=>b.type==='table').flatMap(b=>b.rows||[]));}
function cat(page){const r=rows(page).find(r=>/^(categorie|category|famille|family|type)$/.test(norm(r?.[0])));return clean(r?.[1]||page.catalog?.category||'');}
function rowText(page){return rows(page).map(x=>`${clean(x?.[0])}=${clean(x?.[1])}`).filter(Boolean).join(' | ');}
for(const id of ['equipement','augmentations']){
  const spec=manifest.datasets.find(d=>d.id===id);if(!spec)continue;
  const pages=load(spec),gaps=pages.filter(p=>p.catalog?.loreGrounding==='sparse');
  console.log(`AUDIT ${id.toUpperCase()} — ${gaps.length} pages sparse`);
  for(const page of gaps)console.log(`SPARSE | ${page.title} | ${cat(page)} | ${rowText(page)}`);

  if(id==='equipement'){
    const facts=pages.filter(p=>p.catalog?.loreGrounding==='catalogue-facts');
    console.log(`AUDIT EQUIPEMENT FACTS-ONLY — ${facts.length} pages`);
    for(const page of facts)console.log(`FACTS | ${page.title} | ${cat(page)} | ${rowText(page)}`);

    const manual=pages.filter(p=>p.catalog?.loreMethod==='reality-book-semantic-lore');
    const pending=pages.filter(p=>p.catalog?.loreMethod!=='reality-book-semantic-lore');
    console.log(`AUDIT EQUIPEMENT MANUAL V3 — ${manual.length}/${pages.length} pages`);
    console.log(`AUDIT EQUIPEMENT A REPRENDRE — ${pending.length} pages`);
    for(const page of pending)console.log(`PENDING | ${page.title} | ${cat(page)} | ${rowText(page)}`);
  }
}
