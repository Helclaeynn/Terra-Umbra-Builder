const DB_NAME='tuc-compendium-editor';
const DB_VERSION=1;
const STORE='media-drafts';
let dbPromise=null;

function openDb(){
  if(!('indexedDB' in globalThis))return Promise.reject(new Error('IndexedDB indisponible dans ce navigateur.'));
  if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'path'});
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('Impossible d’ouvrir le stockage média.'));
  });
  return dbPromise;
}
function txRequest(mode,handler){
  return openDb().then(db=>new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);
    let request;
    try{request=handler(store);}catch(error){reject(error);return;}
    tx.oncomplete=()=>resolve(request?.result);
    tx.onerror=()=>reject(tx.error||request?.error||new Error('Erreur IndexedDB.'));
    tx.onabort=()=>reject(tx.error||new Error('Transaction IndexedDB annulée.'));
  }));
}
export async function putMediaDraft({path,blob,articleId,originalName,width,height}){
  if(!(blob instanceof Blob))throw new Error('Média invalide.');
  if(typeof path!=='string'||!path.startsWith('images/'))throw new Error('Chemin média local invalide.');
  return txRequest('readwrite',store=>store.put({path,blob,articleId,originalName:originalName||'',width:width||0,height:height||0,size:blob.size,type:blob.type,updatedAt:new Date().toISOString()}));
}
export async function getMediaDraft(path){return txRequest('readonly',store=>store.get(path));}
export async function deleteMediaDraft(path){return txRequest('readwrite',store=>store.delete(path));}
export async function listMediaDrafts(){return txRequest('readonly',store=>store.getAll()).then(rows=>rows||[]);}
export async function cleanupMediaDrafts(referencedPaths=[]){
  const keep=new Set([...referencedPaths].filter(path=>typeof path==='string'&&path.startsWith('images/')));
  const rows=await listMediaDrafts();
  const removed=[];
  for(const row of rows){
    if(!row?.path||keep.has(row.path))continue;
    await deleteMediaDraft(row.path);removed.push(row.path);
  }
  return removed;
}

export async function optimizeImageFile(file,{maxDimension=1600,quality=.86}={}){
  if(!(file instanceof File)||!file.type.startsWith('image/'))throw new Error('Sélectionne un fichier image valide.');
  const bitmap=await createImageBitmap(file);
  const scale=Math.min(1,maxDimension/Math.max(bitmap.width,bitmap.height));
  const width=Math.max(1,Math.round(bitmap.width*scale)),height=Math.max(1,Math.round(bitmap.height*scale));
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d',{alpha:true});
  context.drawImage(bitmap,0,0,width,height);bitmap.close?.();
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Conversion WebP impossible.')),'image/webp',quality));
  return {blob,width,height};
}
