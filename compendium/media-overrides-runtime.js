let mediaMapPromise=null;

function currentArticleId(){
  const match=location.hash.match(/^#\/article\/(.+)$/);
  if(!match)return null;
  try{return decodeURIComponent(match[1]);}catch{return match[1];}
}

async function loadMediaMap(){
  if(!mediaMapPromise)mediaMapPromise=(async()=>{
    const response=await fetch('data/media-overrides-v1.json',{cache:'no-cache'});
    if(!response.ok)throw new Error(`media-overrides-v1.json · HTTP ${response.status}`);
    const payload=await response.json();
    if(payload?.version!==1||!Array.isArray(payload.entries))throw new Error('media-overrides-v1.json invalide');
    return new Map(payload.entries.filter(entry=>entry?.articleId&&entry?.image?.src).map(entry=>[entry.articleId,entry.image]));
  })();
  return mediaMapPromise;
}

async function applyCurrentMedia(){
  const articleId=currentArticleId();
  if(!articleId)return;
  const image=(await loadMediaMap()).get(articleId);
  if(!image)return;
  const figure=document.querySelector('#main .article-media');
  const img=figure?.querySelector('img');
  if(!figure||!img)return;
  if(img.dataset.mediaOverrideSrc===image.src)return;
  img.src=image.src;
  img.alt=image.alt||img.alt||articleId;
  img.dataset.mediaOverrideSrc=image.src;
  let caption=figure.querySelector('figcaption');
  if(image.caption){
    if(!caption){caption=document.createElement('figcaption');figure.append(caption);}
    caption.textContent=image.caption;
  }else if(caption)caption.remove();
  figure.dataset.mediaOverride='1';
}

const main=document.querySelector('#main');
if(main){
  const observer=new MutationObserver(()=>queueMicrotask(()=>applyCurrentMedia().catch(error=>console.warn('Média éditorial non appliqué',error))));
  observer.observe(main,{childList:true,subtree:true});
}
window.addEventListener('hashchange',()=>applyCurrentMedia().catch(error=>console.warn('Média éditorial non appliqué',error)));
applyCurrentMedia().catch(error=>console.warn('Média éditorial non appliqué',error));
