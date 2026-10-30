import {api} from './api';
/** Resize the whole frame; never crop faces. Upload only compressed raster pixels. */
export async function uploadCharacterImage(characterId:string,file:File):Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size>15*1024*1024)
    throw new Error('Choisissez une image JPEG, PNG ou WebP de moins de 15 Mo.');
  const url=URL.createObjectURL(file);
  try {
    const image=await new Promise<HTMLImageElement>((resolve,reject)=>{
      const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Image illisible.'));img.src=url;
    });
    let dataUrl='';
    for(const [edge,quality] of [[1200,.82],[1000,.72],[800,.65],[640,.6]] as const){
      const ratio=Math.min(1,edge/Math.max(image.naturalWidth,image.naturalHeight));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Préparation de l’image impossible.');
      ctx.drawImage(image,0,0,canvas.width,canvas.height);dataUrl=canvas.toDataURL('image/webp',quality);
      if(!dataUrl.startsWith('data:image/webp;'))dataUrl=canvas.toDataURL('image/jpeg',quality);
      if(dataUrl.length<=262144)break;
    }
    if(dataUrl.length>262144)throw new Error('L’image reste trop lourde après compression.');
    const result=await api<{mediaId:string}>(`/api/characters/${characterId}/images`,{method:'POST',body:JSON.stringify({dataUrl})});
    return result.mediaId;
  } finally {URL.revokeObjectURL(url);}
}
