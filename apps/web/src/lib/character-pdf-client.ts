import type { PdfInput } from './character-pdf-model';
import type { PdfResult } from './character-pdf';

export type PdfWorkerReply = {ok:true;result:PdfResult}|{ok:false;error:string};

/** Keep PDF parsing, font layout and flattening off the page's UI thread. */
export async function generateCharacterPdf(input:PdfInput,printing=false):Promise<PdfResult>{
  if(typeof Worker==='undefined'){
    const generator=await import('./character-pdf');
    return generator.generateCharacterPdf(input,printing);
  }
  return new Promise((resolve,reject)=>{
    const worker=new Worker(new URL('./character-pdf.worker.ts',import.meta.url),{type:'module'});
    worker.onmessage=({data}:MessageEvent<PdfWorkerReply>)=>{
      worker.terminate();
      if(data.ok)resolve(data.result);
      else reject(new Error(data.error));
    };
    worker.onerror=()=>{
      worker.terminate();
      reject(new Error('La préparation du PDF a échoué. Réessaie après avoir actualisé la page.'));
    };
    try{worker.postMessage({input,printing});}
    catch(error){worker.terminate();reject(error);}
  });
}
