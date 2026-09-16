import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));

function load(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec)throw new Error(`Dataset absent: ${id}`);
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8')).map(page=>({...page,dataset:page.dataset||id}));
}
function inc(map,key){key=String(key??'—').trim()||'—';map.set(key,(map.get(key)||0)+1)}
function printMap(label,map,limit=120){
  console.log(label);
  for(const [key,count] of [...map.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr')).slice(0,limit))console.log(`  ${count} | ${key}`);
}
function scalarShape(obj,prefix='',out=[]){
  if(!obj||typeof obj!=='object'||Array.isArray(obj))return out;
  for(const [key,value] of Object.entries(obj)){
    const path=prefix?`${prefix}.${key}`:key;
    if(value==null||['string','number','boolean'].includes(typeof value))out.push([path,String(value)]);
    else if(!Array.isArray(value)&&typeof value==='object')scalarShape(value,path,out);
  }
  return out;
}
function audit(label,pages){
  console.log(`\n=== ${label.toUpperCase()} ${pages.length} ===`);
  const datasets=new Map(),sources=new Map(),tags=new Map(),tagCombos=new Map(),shapes=new Map(),scalarValues=new Map(),nav=new Map();
  for(const page of pages){
    inc(datasets,page.dataset);
    inc(sources,page.source||'—');
    const list=(page.tags||[]).map(String);for(const tag of list)inc(tags,tag);inc(tagCombos,list.join(' > ')||'—');
    inc(shapes,Object.keys(page).sort().join(','));
    if(page.nav)inc(nav,`${page.nav.group||'—'} > ${page.nav.subgroup||'—'}`);
    for(const [key,value] of scalarShape(page).filter(([key])=>!['id','title','source','status','category','illustration'].includes(key)&&!key.startsWith('sections.')))inc(scalarValues,`${key} = ${value}`);
  }
  printMap('DATASETS',datasets,20);
  printMap('SOURCES',sources,60);
  printMap('TOP TAGS',tags,120);
  printMap('TAG COMBINATIONS',tagCombos,120);
  printMap('TOP-LEVEL SHAPES',shapes,30);
  if(nav.size)printMap('EXPLICIT NAV',nav,120);
  printMap('SCALAR METADATA',scalarValues,200);
  console.log('SAMPLES');
  for(const page of pages.slice(0,60))console.log(`  ${page.dataset} | ${page.id} | ${page.title} | tags=${(page.tags||[]).join(' > ')} | source=${page.source||'—'} | nav=${page.nav?JSON.stringify(page.nav):'—'}`);
}

const all=manifest.datasets.flatMap(dataset=>load(dataset.id));
const organisations=all.filter(page=>page.category==='Organisations');
const personnages=all.filter(page=>page.category==='Personnages');

audit('Organisations',organisations);
audit('Personnages',personnages);

if(!organisations.length)throw new Error('Aucune page Organisations trouvée');
if(!personnages.length)throw new Error('Aucune page Personnages trouvée');
console.log(`\nTAXONOMY TARGETS OK — Organisations ${organisations.length} · Personnages ${personnages.length}.`);
