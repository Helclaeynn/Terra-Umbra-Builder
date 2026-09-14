import {deepClone} from './override-engine.js';

let manifestPromise=null;
let articlesPromise=null;

function corpusAssetUrl(relativePath){
  const clean=String(relativePath||'').replace(/^\.?\//,'');
  if(location.hostname==='raw.githack.com'||location.hostname==='rawcdn.githack.com'){
    const match=location.pathname.match(/^\/([^/]+)\/([^/]+)\/([^/]+)\//);
    if(match){
      const [,owner,repo,ref]=match;
      return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/compendium/${clean}`;
    }
  }
  return new URL(`../${clean}`,import.meta.url).href;
}

const dataUrl=path=>corpusAssetUrl(`data/${path}`);

export async function loadEditorManifest(){
  if(!manifestPromise)manifestPromise=(async()=>{
    const response=await fetch(dataUrl('manifest-v3.json'),{cache:'no-cache'});
    if(!response.ok)throw new Error(`manifest-v3.json · HTTP ${response.status}`);
    const manifest=await response.json();
    if(!Array.isArray(manifest.datasets))throw new Error('Manifest V3 invalide');
    return manifest;
  })();
  return manifestPromise;
}

async function loadDataset(spec){
  const texts=await Promise.all(Array.from({length:spec.parts},async(_,index)=>{
    const file=`${spec.prefix}-${String(index).padStart(2,'0')}.b64part`;
    const response=await fetch(dataUrl(file),{cache:'force-cache'});
    if(!response.ok)throw new Error(`${file} · HTTP ${response.status}`);
    return response.text();
  }));
  const joined=texts.join('').replace(/\s+/g,'');
  let bin;
  try{bin=atob(joined);}catch{throw new Error(`${spec.id||spec.prefix} · Base64 invalide`);}
  const bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  if(!('DecompressionStream' in globalThis))throw new Error('Décompression gzip indisponible dans ce navigateur.');
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  let rows;
  try{rows=JSON.parse(await new Response(stream).text());}catch{throw new Error(`${spec.id||spec.prefix} · dataset invalide`);}
  if(!Array.isArray(rows))throw new Error(`${spec.id||spec.prefix} · racine non tabulaire`);
  return rows;
}

export async function loadEditorArticles(){
  if(!articlesPromise)articlesPromise=(async()=>{
    const manifest=await loadEditorManifest();
    const map=new Map();
    for(const spec of manifest.datasets){
      const rows=await loadDataset(spec);
      for(const article of rows)if(article?.id)map.set(article.id,deepClone(article));
    }
    return map;
  })();
  return articlesPromise;
}

export function resetEditorCorpusCache(){
  manifestPromise=null;
  articlesPromise=null;
}
