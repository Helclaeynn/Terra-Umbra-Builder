const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slugify=s=>norm(s).replace(/\s+/g,'-')||'source';

async function loadChunked(prefix,count){
  const texts=await Promise.all(Array.from({length:count},(_,i)=>fetch(`data/${prefix}-${String(i).padStart(2,'0')}.b64part`).then(r=>{if(!r.ok)throw new Error(`${prefix}-${i} · HTTP ${r.status}`);return r.text()})));
  const b64=texts.join('').replace(/\s+/g,'');
  const bin=atob(b64),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  if(!('DecompressionStream' in window))throw new Error('Ce navigateur ne prend pas en charge la décompression du Compendium.');
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
}

const ORG_WAVES=[
  {prefix:'wave2-org',count:8,id:'wave2'},
  {prefix:'wave3-mini-org',count:5,id:'wave3'},
  {prefix:'wave4-org',count:1,id:'wave4'}
];
const PNJ_WAVES=[
  {prefix:'wave2-pnj',count:2,id:'wave2'},
  {prefix:'wave3-mini-pnj',count:1,id:'wave3'},
  {prefix:'wave4-pnj',count:1,id:'wave4'}
];

function normalizeRows(rows,known,prefix){
  const articles=[];
  for(const row of rows||[]){
    const key=norm(row.title);if(!key||known.has(key))continue;
    known.add(key);
    articles.push({...row,id:row.id||`${prefix}-${slugify(row.title)}`,status:row.status||'source_detaillee',audience:row.audience||'player',tags:[...(row.tags||[]),'Source détaillée']});
  }
  return articles;
}

export async function loadSourceExtensions(existingMeta=[]){
  const known=new Set(existingMeta.map(a=>norm(a.title))),articles=[],errors=[];
  const results=await Promise.all(ORG_WAVES.map(async spec=>{
    try{return {spec,rows:await loadChunked(spec.prefix,spec.count)}}
    catch(error){console.warn(`Extension documentaire ${spec.id} indisponible`,error);return {spec,error}}
  }));
  for(const result of results){
    if(result.error){errors.push(result.error);continue}
    articles.push(...normalizeRows(result.rows,known,result.spec.id));
  }
  return {articles,error:errors.length?errors:null};
}

export async function loadPnjWaves(){
  const results=await Promise.all(PNJ_WAVES.map(async spec=>{
    try{return {id:spec.id,rows:await loadChunked(spec.prefix,spec.count)}}
    catch(error){console.warn(`PNJ ${spec.id} indisponibles`,error);return {id:spec.id,rows:[],error}}
  }));
  return results;
}

// Compatibilité temporaire avec les appels historiques.
export async function loadPnjWave2(){const all=await loadPnjWaves();return all.find(x=>x.id==='wave2')?.rows||[]}
export async function loadPnjWave3(){const all=await loadPnjWaves();return all.find(x=>x.id==='wave3')?.rows||[]}
export async function loadPnjWave4(){const all=await loadPnjWaves();return all.find(x=>x.id==='wave4')?.rows||[]}
