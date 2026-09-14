import {deleteMediaDraft,getMediaDraft,optimizeImageFile,putMediaDraft} from './editor/media-draft-store.js';

export const TOKEN='@@TUC_INLINE_MEDIA_V1@@';
const objectUrls=new Map();
let sequence=0;

const safeId=value=>String(value||'page').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'page';
export const newSlot=()=>`${Date.now().toString(36)}-${(++sequence).toString(36)}`;

export function encodeMedia(meta){
  return TOKEN+JSON.stringify({kind:meta.kind==='portrait'?'portrait':'image',src:String(meta.src||''),alt:String(meta.alt||''),caption:String(meta.caption||''),slot:String(meta.slot||'')});
}
export function decodeMedia(value){
  const text=String(value??'').trim();if(!text.startsWith(TOKEN))return null;
  try{
    const parsed=JSON.parse(text.slice(TOKEN.length));if(!parsed||typeof parsed!=='object')return null;
    return {kind:parsed.kind==='portrait'?'portrait':'image',src:String(parsed.src||''),alt:String(parsed.alt||''),caption:String(parsed.caption||''),slot:String(parsed.slot||'')};
  }catch{return null;}
}
export function mediaPaths(draft){
  const paths=new Set();
  for(const section of draft?.sections||[])for(const value of section?.paragraphs||[]){const meta=decodeMedia(value);if(meta?.src?.startsWith('images/'))paths.add(meta.src);}
  return paths;
}
export function humanSize(bytes){
  if(bytes<1024)return `${bytes} o`;if(bytes<1024*1024)return `${(bytes/1024).toFixed(1)} Ko`;return `${(bytes/1024/1024).toFixed(2)} Mo`;
}
export function forgetObjectUrl(path){
  const url=objectUrls.get(path);if(url){URL.revokeObjectURL(url);objectUrls.delete(path);}
}
export async function localUrlFor(path){
  if(!path?.startsWith('images/'))return null;if(objectUrls.has(path))return objectUrls.get(path);
  const item=await getMediaDraft(path).catch(()=>null);if(!item?.blob)return null;
  const url=URL.createObjectURL(item.blob);objectUrls.set(path,url);return url;
}
export async function mediaDraftFor(path){return path?getMediaDraft(path).catch(()=>null):null;}
export async function storeMediaFile(file,pageKey,kind){
  const slot=newSlot(),optimized=await optimizeImageFile(file);
  const path=`images/manual/lore-${safeId(pageKey)}-${kind==='portrait'?'portrait':'image'}-${safeId(slot)}.webp`;
  await putMediaDraft({path,blob:optimized.blob,articleId:`lore:${pageKey}`,originalName:file.name,width:optimized.width,height:optimized.height});
  forgetObjectUrl(path);return {path,slot,width:optimized.width,height:optimized.height,size:optimized.blob.size};
}
export async function deletePaths(paths){
  for(const path of paths){forgetObjectUrl(path);await deleteMediaDraft(path).catch(()=>{});}
}
export function createMediaFigure(doc,meta){
  const figure=doc.createElement('figure');figure.className=`content-inline-media ${meta.kind==='portrait'?'portrait':'image'}`;figure.dataset.loreEditorPreview='block';
  if(meta.src){
    const img=doc.createElement('img');img.alt=meta.alt||'';img.loading='lazy';img.src=meta.src;figure.appendChild(img);
    if(meta.src.startsWith('images/'))localUrlFor(meta.src).then(url=>{if(url&&img.isConnected)img.src=url;}).catch(console.error);
  }else{
    const empty=doc.createElement('div');empty.className='content-inline-media-empty';empty.textContent='Image à choisir';figure.appendChild(empty);
  }
  if(meta.caption){const caption=doc.createElement('figcaption');caption.textContent=meta.caption;figure.appendChild(caption);}
  return figure;
}
export function revokeAllMediaUrls(){for(const path of [...objectUrls.keys()])forgetObjectUrl(path);}
