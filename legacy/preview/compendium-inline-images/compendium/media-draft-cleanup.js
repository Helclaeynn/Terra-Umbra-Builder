import {cleanupMediaDrafts,listMediaDrafts} from './editor/media-draft-store.js';

const DRAFT_KEY='tuc-compendium-drafts-v1';

function readDraftEntries(){
  try{
    const parsed=JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}');
    return Object.values(parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{}).filter(Boolean);
  }catch{return [];}
}
function mediaPath(value){
  if(typeof value==='string')return value;
  return value&&typeof value==='object'?value.src||'':'';
}
function referencedMediaPaths(){
  const refs=new Set();
  for(const entry of readDraftEntries())for(const operation of entry.operations||[]){
    if(operation?.op==='remove')continue;
    const path=operation?.path||'',value=operation?.value;
    let media='';
    if(path==='/pnj')media=value?.portrait||'';
    else if(path==='/pnj/portrait')media=typeof value==='string'?value:'';
    else if(path==='/image'||path==='/illustration')media=mediaPath(value);
    if(typeof media==='string'&&media.startsWith('images/'))refs.add(media);
  }
  return refs;
}
async function orphanRows(){
  const keep=referencedMediaPaths(),rows=await listMediaDrafts();
  return rows.filter(row=>row?.path&&!keep.has(row.path));
}
async function refreshButton(dialog){
  const button=dialog?.querySelector('[data-action="cleanup-media"]');if(!button)return;
  try{
    const rows=await orphanRows();
    button.disabled=!rows.length;
    button.textContent=rows.length?`Nettoyer médias orphelins (${rows.length})`:'Aucun média orphelin';
  }catch(error){
    button.disabled=true;button.textContent='Stockage média indisponible';
    console.warn('Impossible d’analyser les médias locaux',error);
  }
}
function enhanceDialog(dialog){
  if(dialog.dataset.mediaCleanupEnhanced)return;
  dialog.dataset.mediaCleanupEnhanced='1';
  const actions=dialog.querySelector('.editor-draft-actions');if(!actions)return;
  const button=document.createElement('button');
  button.type='button';button.dataset.action='cleanup-media';button.textContent='Analyse des médias…';button.disabled=true;
  const spacer=actions.querySelector('.editor-spacer');
  if(spacer)actions.insertBefore(button,spacer);else actions.appendChild(button);
  button.addEventListener('click',async event=>{
    event.preventDefault();event.stopPropagation();
    const rows=await orphanRows();if(!rows.length){await refreshButton(dialog);return;}
    const total=rows.reduce((sum,row)=>sum+(Number(row.size)||0),0);
    const label=total>1024*1024?`${(total/1024/1024).toFixed(2)} Mo`:`${(total/1024).toFixed(1)} Ko`;
    if(!confirm(`Supprimer ${rows.length} média(s) local(aux) orphelin(s) (${label}) ?`))return;
    const removed=await cleanupMediaDrafts(referencedMediaPaths());
    await refreshButton(dialog);
    alert(`${removed.length} média(s) local(aux) supprimé(s).`);
  });
  refreshButton(dialog);
}

const observer=new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes){
    if(!(node instanceof Element))continue;
    if(node.matches?.('.editor-drafts-dialog'))enhanceDialog(node);
    node.querySelectorAll?.('.editor-drafts-dialog').forEach(enhanceDialog);
  }
});
observer.observe(document.body,{childList:true,subtree:true});
window.addEventListener('tuc:drafts-changed',()=>document.querySelectorAll('.editor-drafts-dialog').forEach(refreshButton));
document.querySelectorAll('.editor-drafts-dialog').forEach(enhanceDialog);
