import {getMediaDraft,optimizeImageFile,putMediaDraft} from './editor/media-draft-store.js';

const objectUrls=new Map();
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const currentArticleId=()=>{
  const raw=location.hash.slice(1);
  if(!raw.startsWith('/article/'))return null;
  return decodeURIComponent(raw.slice(9).split('@',1)[0]);
};
const safeId=value=>String(value||'page').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'page';

function targetPath(input){
  const id=safeId(currentArticleId());
  return input.name==='pnj_portrait'?`images/pnj/manual/${id}.webp`:`images/manual/${id}.webp`;
}
function humanSize(bytes){
  if(bytes<1024)return `${bytes} o`;
  if(bytes<1024*1024)return `${(bytes/1024).toFixed(1)} Ko`;
  return `${(bytes/1024/1024).toFixed(2)} Mo`;
}
function downloadBlob(blob,path){
  const url=URL.createObjectURL(blob),anchor=document.createElement('a');
  anchor.href=url;anchor.download=path.split('/').pop()||'image.webp';
  document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),0);
}
async function localUrlFor(path){
  const item=await getMediaDraft(path);
  if(!item?.blob)return null;
  if(objectUrls.has(path))return {url:objectUrls.get(path),item};
  const url=URL.createObjectURL(item.blob);objectUrls.set(path,url);return {url,item};
}
function mediaStatusHtml(item){return item?`<span class="editor-local-media-ok">WebP local prêt · ${item.width}×${item.height} · ${humanSize(item.size)}</span>`:'<span class="editor-local-media-muted">Aucun fichier local associé à ce chemin.</span>';}
async function refreshControl(control){
  const input=control._pathInput,path=input.value.trim(),status=control.querySelector('[data-local-media-status]'),download=control.querySelector('[data-action="download-local-media"]');
  const item=path?await getMediaDraft(path):null;
  status.innerHTML=mediaStatusHtml(item);download.hidden=!item;control._item=item||null;
}
async function handleFile(control,file){
  const input=control._pathInput,status=control.querySelector('[data-local-media-status]');
  status.textContent='Conversion WebP…';
  const optimized=await optimizeImageFile(file),path=targetPath(input);
  await putMediaDraft({path,blob:optimized.blob,articleId:currentArticleId(),originalName:file.name,width:optimized.width,height:optimized.height});
  input.value=path;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
  await refreshControl(control);
  const preview=control.querySelector('.editor-local-media-preview');
  const result=await localUrlFor(path);
  preview.innerHTML=result?`<img src="${esc(result.url)}" alt="Prévisualisation du média local">`:'';
}
function enhanceMediaInput(input){
  if(input.dataset.localMediaEnhanced)return;
  input.dataset.localMediaEnhanced='1';
  const control=document.createElement('div');control.className='editor-local-media-control';control._pathInput=input;
  control.innerHTML=`<div class="editor-local-media-actions"><button type="button" data-action="pick-local-media">Choisir une image du PC</button><button type="button" data-action="download-local-media" hidden>Télécharger le WebP</button><input type="file" accept="image/*" data-local-media-file hidden></div><div data-local-media-status class="editor-local-media-status"></div><div class="editor-local-media-preview"></div>`;
  input.insertAdjacentElement('afterend',control);
  const picker=control.querySelector('[data-local-media-file]');
  control.querySelector('[data-action="pick-local-media"]').addEventListener('click',()=>picker.click());
  picker.addEventListener('change',async()=>{
    try{if(picker.files?.[0])await handleFile(control,picker.files[0]);}catch(error){alert(error.message);}finally{picker.value='';}
  });
  control.querySelector('[data-action="download-local-media"]').addEventListener('click',()=>{
    const path=input.value.trim(),item=control._item;if(item?.blob&&path)downloadBlob(item.blob,path);
  });
  input.addEventListener('change',()=>refreshControl(control).catch(console.error));
  refreshControl(control).then(async()=>{
    const path=input.value.trim();if(!path)return;
    const result=await localUrlFor(path);if(result)control.querySelector('.editor-local-media-preview').innerHTML=`<img src="${esc(result.url)}" alt="Prévisualisation du média local">`;
  }).catch(console.error);
}
async function replaceWithLocalAsset(img){
  if(img.dataset.localMediaResolved)return;
  const raw=img.getAttribute('src')||'';
  if(!raw.startsWith('images/'))return;
  const result=await localUrlFor(raw);
  if(!result)return;
  img.dataset.localMediaResolved='1';img.dataset.localMediaPath=raw;img.src=result.url;
}
function scan(root=document){
  for(const input of root.querySelectorAll?.('input[name="pnj_portrait"],input[name="media_src"]')||[])enhanceMediaInput(input);
  for(const img of root.querySelectorAll?.('[data-editor-preview] img')||[])replaceWithLocalAsset(img).catch(console.error);
}
const observer=new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)scan(node);
});
observer.observe(document.body,{childList:true,subtree:true});scan();
window.addEventListener('beforeunload',()=>{for(const url of objectUrls.values())URL.revokeObjectURL(url);});
