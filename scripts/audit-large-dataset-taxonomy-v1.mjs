import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function inc(map,key){key=String(key??'—');map.set(key,(map.get(key)||0)+1)}
function printMap(label,map,limit=100){console.log(label);for(const [key,count] of [...map.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr')).slice(0,limit))console.log(`  ${count} | ${key}`)}
function scalarShape(obj,prefix='',out=[]){if(!obj||typeof obj!=='object'||Array.isArray(obj))return out;for(const [k,v] of Object.entries(obj)){const key=prefix?`${prefix}.${k}`:k;if(v==null||['string','number','boolean'].includes(typeof v))out.push([key,String(v)]);else if(!Array.isArray(v)&&typeof v==='object')scalarShape(v,key,out)}return out}

for(const dataset of ['equipement','augmentations','bestiaire','verite-catalogue']){
  const pages=load(dataset);console.log(`\n=== ${dataset.toUpperCase()} ${pages.length} ===`);
  const sources=new Map(),tag1=new Map(),tagCombo=new Map(),keys=new Map(),catalogKeys=new Map(),navPairs=new Map(),scalarValues=new Map();
  for(const page of pages){
    inc(sources,page.source||'—');
    const tags=(page.tags||[]).map(String);for(const tag of tags)inc(tag1,tag);inc(tagCombo,tags.join(' > ')||'—');
    inc(keys,Object.keys(page).sort().join(','));
    if(page.catalog)inc(catalogKeys,Object.keys(page.catalog).sort().join(','));
    if(page.nav)inc(navPairs,`${page.nav.group||'—'} > ${page.nav.subgroup||'—'}`);
    for(const [key,value] of scalarShape(page).filter(([key])=>!['id','title','source','status','category','illustration'].includes(key)&&!key.startsWith('sections.'))){const compound=`${key} = ${value}`;inc(scalarValues,compound)}
  }
  printMap('SOURCES',sources,30);printMap('TOP TAGS',tag1,80);printMap('TAG COMBINATIONS',tagCombo,80);printMap('TOP-LEVEL SHAPES',keys,20);if(catalogKeys.size)printMap('CATALOG SHAPES',catalogKeys,20);if(navPairs.size)printMap('EXPLICIT NAV',navPairs,50);printMap('SCALAR METADATA',scalarValues,120);
  console.log('SAMPLES');
  for(const page of pages.slice(0,12))console.log(`  ${page.id} | ${page.title} | tags=${(page.tags||[]).join(' > ')} | catalog=${page.catalog?JSON.stringify(page.catalog):'—'} | nav=${page.nav?JSON.stringify(page.nav):'—'}`);
}
