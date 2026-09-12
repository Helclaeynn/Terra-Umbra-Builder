const MEDIA_DATA='data/';
let mediaIndexPromise=null;
let renderToken=0;

async function loadMediaDataset(spec){
  const texts=await Promise.all(Array.from({length:spec.parts},async(_,i)=>{
    const file=`${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    const response=await fetch(`${MEDIA_DATA}${file}`,{cache:'force-cache'});
    if(!response.ok)throw new Error(`${file} · HTTP ${response.status}`);
    return response.text();
  }));
  const b64=texts.join('').replace(/\s+/g,'');
  const bin=atob(b64);
  const bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  if(!('DecompressionStream' in window))throw new Error('Décompression des médias non prise en charge par ce navigateur.');
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const rows=JSON.parse(await new Response(stream).text());
  if(!Array.isArray(rows))throw new Error(`${spec.id||spec.prefix} · racine média non tabulaire`);
  return rows;
}

async function mediaIndex(){
  if(mediaIndexPromise)return mediaIndexPromise;
  mediaIndexPromise=(async()=>{
    const response=await fetch(`${MEDIA_DATA}manifest-v3.json`,{cache:'no-cache'});
    if(!response.ok)throw new Error(`manifest-v3.json · HTTP ${response.status}`);
    const manifest=await response.json();
    const specs=(manifest.datasets||[]).filter(spec=>spec.media===true);
    const index=new Map();
    for(const spec of specs){
      for(const row of await loadMediaDataset(spec))if(row?.id)index.set(row.id,row);
    }
    return index;
  })();
  return mediaIndexPromise;
}

function currentArticleId(){
  const raw=location.hash.slice(1);
  if(!raw.startsWith('/article/'))return'';
  let value=raw.slice(9).split('@',1)[0];
  try{value=decodeURIComponent(value)}catch{}
  return value;
}

function mediaObject(row){
  const raw=row?.image??row?.illustration;
  if(typeof raw==='string')return{src:raw};
  if(raw&&typeof raw==='object')return raw;
  return null;
}

function esc(value){
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

async function renderCurrentMedia(){
  const token=++renderToken;
  const id=currentArticleId();
  const main=document.querySelector('#main');
  if(!id||!main)return;
  try{
    const index=await mediaIndex();
    if(token!==renderToken)return;
    const row=index.get(id),media=mediaObject(row);
    const src=String(media?.src||'').trim();
    if(!src)return;
    if(main.querySelector('[data-tuc-article-media]'))return;
    const head=main.querySelector('.page-head');
    if(!head)return;
    const alt=String(media?.alt||row?.title||'Illustration').trim();
    const caption=String(media?.caption||'').trim();
    const figure=document.createElement('figure');
    figure.className='article-media';
    figure.dataset.tucArticleMedia='';
    figure.innerHTML=`<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">${caption?`<figcaption>${esc(caption)}</figcaption>`:''}`;
    head.insertAdjacentElement('afterend',figure);
  }catch(error){
    console.warn('Illustration Compendium non chargée :',error);
  }
}

const main=document.querySelector('#main');
if(main){
  new MutationObserver(()=>queueMicrotask(renderCurrentMedia)).observe(main,{childList:true,subtree:true});
}
window.addEventListener('hashchange',()=>queueMicrotask(renderCurrentMedia));
queueMicrotask(renderCurrentMedia);
