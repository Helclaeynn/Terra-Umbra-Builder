import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));

function load(id){
  const spec=manifest.datasets.find(d=>d.id===id);
  if(!spec) throw new Error(`Dataset absent: ${id}`);
  let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}

for(const id of ['moteur','realite','verite']){
  const pages=load(id);
  console.log(`NAV_DATASET | ${id} | ${pages.length}`);
  for(const page of pages){
    console.log(`NAV | ${page.id} | ${page.category} | ${page.title} | tags=${(page.tags||[]).join(' > ')} | source=${page.source||''}`);
  }
}
