import { generateCharacterPdf } from './character-pdf';
import type { PdfInput } from './character-pdf-model';
import type { PdfWorkerReply } from './character-pdf-client';

// Use the worker API shape without mixing DOM and WebWorker global declarations.
const worker=globalThis as unknown as {
  onmessage:((event:MessageEvent<{input:PdfInput;printing:boolean}>)=>void)|null;
  postMessage:(message:PdfWorkerReply,transfer?:Transferable[])=>void;
};
worker.onmessage=async({data})=>{
  try{
    const result=await generateCharacterPdf(data.input,data.printing);
    worker.postMessage({ok:true,result},[result.bytes.buffer as ArrayBuffer]);
  }catch(cause){
    worker.postMessage({ok:false,error:cause instanceof Error?cause.message:'La création du PDF a échoué. Réessaie.'});
  }
};
