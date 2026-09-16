import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const DATASETS=['equipement','augmentations','verite-catalogue'];
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');

function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  }
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}

function signature(page){
  const catalog=page.catalog||{};
  const quality=page.quality||{};
  const grounding=clean(catalog.loreGrounding||quality.loreGrounding||'—');
  const method=clean(catalog.loreMethod||quality.loreMethod||'—');
  const version=clean(catalog.loreVersion||quality.loreVersion||'—');
  const source=clean(catalog.loreSource||quality.loreSource||page.source||'—');
  return {grounding,method,version,source,key:`grounding=${grounding} | method=${method} | v=${version} | source=${source}`};
}

for(const id of DATASETS){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec){
    console.log(`EDITORIAL ${id.toUpperCase()} — dataset absent`);
    continue;
  }
  const pages=load(spec);
  const groups=new Map();
  for(const page of pages){
    const sig=signature(page);
    if(!groups.has(sig.key))groups.set(sig.key,{...sig,titles:[]});
    groups.get(sig.key).titles.push(clean(page.title));
  }
  const ordered=[...groups.values()].sort((a,b)=>b.titles.length-a.titles.length||a.key.localeCompare(b.key,'fr'));
  console.log(`EDITORIAL ${id.toUpperCase()} — ${pages.length} pages · ${ordered.length} signatures`);
  for(const group of ordered){
    console.log(`SIGNATURE ${id} | ${group.titles.length} | ${group.key}`);
    console.log(`TITRES ${id} | ${group.titles.sort((a,b)=>a.localeCompare(b,'fr')).join(' || ')}`);
  }
}
