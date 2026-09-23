export async function prepareNpcPortrait(file:File):Promise<string>{
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Choisis une image JPG, PNG ou WebP.');
 if(file.size>12*1024*1024)throw Error('Image trop lourde : 12 Mo maximum.');
 const url=URL.createObjectURL(file);
 try{
  const image=await new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Image illisible.'));img.src=url;});
  if(!image.naturalWidth||!image.naturalHeight)throw Error('Image illisible.');
  for(const [size,quality] of [[640,.82],[480,.7],[320,.65]]){
   const scale=Math.min(1,size/Math.max(image.naturalWidth,image.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const context=canvas.getContext('2d');if(!context)throw Error('Impossible de préparer l’image.');context.drawImage(image,0,0,canvas.width,canvas.height);
   let data=canvas.toDataURL('image/webp',quality);if(!data.startsWith('data:image/webp;'))data=canvas.toDataURL('image/jpeg',quality);if(data.length<=700000)return data;
  }
  throw Error('L’image reste trop lourde après réduction.');
 }finally{URL.revokeObjectURL(url);}
}
