<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { cloneJson } from '../lib/json';
import type { PdfInput } from '../lib/character-pdf-model';

const props=defineProps<{input:PdfInput|null;draft?:boolean}>();
const busy=ref(false),error=ref(''),notice=ref(''),downloadUrl=ref(''),downloadName=ref('');
const objectUrls=new Set<string>();
let mounted=true;
onBeforeUnmount(()=>{mounted=false;for(const url of objectUrls)URL.revokeObjectURL(url);objectUrls.clear();});

function printWindow(){
  const popup=window.open('','_blank');
  if(!popup)return null;
  popup.opener=null;
  popup.document.title='Préparation du dossier à imprimer';
  const message=popup.document.createElement('p');message.textContent='Préparation du dossier à imprimer…';
  message.style.cssText='font:16px sans-serif;padding:24px';popup.document.body.append(message);
  return popup;
}
function showPrint(popup:Window,url:string,filename:string){
  const doc=popup.document;doc.body.replaceChildren();doc.title=filename;
  doc.body.style.cssText='margin:0;font:15px system-ui,sans-serif;background:#eef1f3';
  const toolbar=doc.createElement('div');toolbar.style.cssText='padding:12px;display:flex;gap:16px;align-items:center;flex-wrap:wrap';
  const button=doc.createElement('button');button.textContent='Imprimer le dossier';button.style.cssText='padding:10px 16px;cursor:pointer';
  const link=doc.createElement('a');link.href=url;link.download=filename;link.textContent='Télécharger le PDF d’impression';
  const help=doc.createElement('span');help.textContent='Si la boîte d’impression ne s’ouvre pas, utilise le bouton d’impression du lecteur PDF.';
  toolbar.append(button,link,help);
  const frame=doc.createElement('iframe');frame.title='Dossier de personnage à imprimer';frame.src=url;frame.style.cssText='width:100%;height:calc(100vh - 90px);border:0';
  const print=()=>{try{frame.contentWindow?.focus();frame.contentWindow?.print();}catch{/* The visible PDF viewer and download remain available. */}};
  button.addEventListener('click',print);frame.addEventListener('load',()=>{window.setTimeout(()=>{if(!popup.closed)print();},500);},{once:true});
  doc.body.append(toolbar,frame);
}
async function run(printing:boolean){
  if(busy.value||!props.input)return;
  // Open synchronously in the click handler, before fetching the PDF.
  const popup=printing?printWindow():null;
  busy.value=true;error.value='';notice.value='Préparation du dossier…';
  try{
    const snapshot=cloneJson(props.input);
    const {generateCharacterPdf}=await import('../lib/character-pdf');
    const result=await generateCharacterPdf(snapshot,printing);
    if(!mounted){popup?.close();return;}
    const url=URL.createObjectURL(new Blob([result.bytes as Uint8Array<ArrayBuffer>],{type:'application/pdf'}));objectUrls.add(url);
    downloadUrl.value=url;downloadName.value=result.filename;
    if(printing&&popup&&!popup.closed)showPrint(popup,url,result.filename);
    else if(!printing){const anchor=document.createElement('a');anchor.href=url;anchor.download=result.filename;anchor.click();}
    notice.value=`Dossier prêt : ${result.pages} pages${result.annexPages?`, dont ${result.annexPages} de compléments pour conserver toutes les informations`:''}. ${props.draft?'Les choix affichés, y compris non enregistrés, sont inclus. ':''}${printing&&!popup?'La fenêtre a été bloquée : télécharge le PDF ci-dessous pour l’imprimer. ':''}${result.warnings.join(' ')}`;
  }catch(cause){popup?.close();if(mounted){error.value=cause instanceof Error?cause.message:'La création du PDF a échoué. Réessaie.';notice.value='';}}
  finally{if(mounted)busy.value=false;}
}
</script>

<template>
  <section class="character-pdf-actions" aria-label="Export du personnage" :aria-busy="busy">
    <div class="pdf-buttons">
      <button type="button" class="ghost" :disabled="busy||!input" @click="run(false)">Exporter la fiche de personnage en PDF</button>
      <button type="button" class="ghost" :disabled="busy||!input" @click="run(true)">Imprimer la fiche de personnage</button>
    </div>
    <p v-if="notice" role="status" aria-live="polite">{{ notice }}</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <a v-if="downloadUrl" :href="downloadUrl" :download="downloadName">Télécharger le dernier PDF préparé</a>
  </section>
</template>

<style scoped>
.character-pdf-actions{display:grid;gap:.5rem;margin:.8rem 0;min-width:0}
.pdf-buttons{display:flex;flex-wrap:wrap;gap:.65rem}
.pdf-buttons button{min-height:44px;white-space:normal}
.character-pdf-actions p{margin:0;font-size:.9rem;line-height:1.5;color:#c7d7e6}
.character-pdf-actions [role=alert]{color:#ffbdab}
.character-pdf-actions a{color:#a4e8f2}
@media print{.character-pdf-actions{display:none}}
</style>
