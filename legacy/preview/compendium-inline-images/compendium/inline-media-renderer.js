import {getMediaDraft} from './editor/media-draft-store.js';

const TOKEN='@@TUC_INLINE_MEDIA_V1@@';
const objectUrls=new Map();
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function decodeMedia(value){
  const text=String(value??'').trim();
  if(!text.startsWith(TOKEN))return null;
  try{
    const parsed=JSON.parse(text.slice(TOKEN.length));
    if(!parsed||typeof parsed!=='object')return null;
    return {
      kind:parsed.kind==='portrait'?'portrait':'image',
      src:String(parsed.src||''),
      alt:String(parsed.alt||''),
      caption:String(parsed.caption||'')
    };
  }catch{return null;}
}

async function localUrl(path){
  if(!path?.startsWith('images/'))return null;
  if(objectUrls.has(path))return objectUrls.get(path);
  const item=await getMediaDraft(path).catch(()=>null);
  if(!item?.blob)return null;
  const url=URL.createObjectURL(item.blob);objectUrls.set(path,url);return url;
}

async function renderParagraph(paragraph){
  if(!(paragraph instanceof HTMLElement)||!paragraph.matches('p.body-p'))return;
  const meta=decodeMedia(paragraph.textContent);if(!meta)return;
  const figure=document.createElement('figure');
  figure.className=`content-inline-media ${meta.kind}`;
  figure.dataset.inlineMediaRendered='1';
  if(paragraph.closest('[data-editor-preview]'))figure.dataset.editorPreview='inline-media';
  if(meta.src){
    const img=document.createElement('img');
    img.alt=meta.alt;img.loading='lazy';img.src=(await localUrl(meta.src))||meta.src;
    figure.appendChild(img);
  }else{
    const empty=document.createElement('div');empty.className='content-inline-media-empty';empty.textContent='Image à choisir';figure.appendChild(empty);
  }
  if(meta.caption){const caption=document.createElement('figcaption');caption.textContent=meta.caption;figure.appendChild(caption);}
  paragraph.replaceWith(figure);
}

function scan(root=document){
  const paragraphs=[];
  if(root.matches?.('p.body-p'))paragraphs.push(root);
  root.querySelectorAll?.('p.body-p').forEach(node=>paragraphs.push(node));
  for(const paragraph of paragraphs)renderParagraph(paragraph).catch(console.error);
}
function rescanSoon(){
  for(const delay of [0,40,150])setTimeout(()=>scan(document),delay);
}

const observer=new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes)if(node instanceof Element)scan(node);
});
observer.observe(document.body,{childList:true,subtree:true});
scan(document);
window.addEventListener('tuc:drafts-changed',rescanSoon);
window.addEventListener('tuc:editor-refresh',rescanSoon);
window.addEventListener('hashchange',rescanSoon);
window.addEventListener('beforeunload',()=>{for(const url of objectUrls.values())URL.revokeObjectURL(url);});