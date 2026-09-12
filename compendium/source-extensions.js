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
  for(const spec of [{prefix:'wave2-org',count:8,id:'wave2'},{prefix:'wave3-mini-org',count:5,id:'wave3'}]){
    try{articles.push(...normalizeRows(await loadChunked(spec.prefix,spec.count),known,spec.id))}
    catch(error){console.warn(`Extension documentaire ${spec.id} indisponible`,error);errors.push(error)}
  }
  return {articles,error:errors.length?errors:null};
}

export async function loadPnjWave2(){
  try{return await loadChunked('wave2-pnj',2)}catch(error){console.warn('PNJ wave2 indisponibles',error);return []}
}

export async function loadPnjWave3(){
  try{return await loadChunked('wave3-mini-pnj',1)}catch(error){console.warn('PNJ wave3 indisponibles',error);return []}
}
