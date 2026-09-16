import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){
  const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);
  let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function flat(page){
  const out=[];
  const walk=v=>{if(v==null)return;if(typeof v==='string'){out.push(v);return}if(Array.isArray(v)){for(const x of v)walk(x);return}if(typeof v==='object'){for(const [k,x] of Object.entries(v))if(!['id','source','status','tags','category','title'].includes(k))walk(x)}};
  walk(page.sections||[]);return out.join(' ').replace(/\s+/g,' ').trim();
}
function words(text){return String(text||'').trim()?String(text).trim().split(/\s+/).length:0}
const ids=['realite','verite','lore'];
const inventory={generated:new Date().toISOString(),datasets:{}};
for(const id of ids){
  const pages=load(id);
  inventory.datasets[id]=pages.map(page=>{
    const text=flat(page);
    return {id:page.id,title:page.title,category:page.category,tags:page.tags||[],source:page.source||'',status:page.status||'',words:words(text),sections:(page.sections||[]).length,text};
  });
  console.log(`DATASET | ${id} | ${pages.length}`);
  for(const page of inventory.datasets[id]) console.log(`PAGE | ${id} | ${page.id} | ${page.title} | words=${page.words} | sections=${page.sections} | tags=${page.tags.join('>')}`);
}
fs.mkdirSync('compendium/audits',{recursive:true});
fs.writeFileSync('compendium/audits/lore-inventory.json',`${JSON.stringify(inventory,null,2)}\n`,'utf8');
console.log('Lore inventory written: compendium/audits/lore-inventory.json');
