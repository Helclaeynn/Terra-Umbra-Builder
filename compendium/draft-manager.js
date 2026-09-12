import {articleHash,applyOperations} from './editor/override-engine.js';
import {loadEditorArticles} from './editor/corpus-loader.js';

const DRAFT_KEY='tuc-compendium-drafts-v1';
const VERSION=1;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function readDrafts(){
  try{
    const parsed=JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}');
    return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
  }catch{return {};}
}
function writeDrafts(drafts){
  localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts));
  window.dispatchEvent(new CustomEvent('tuc:editor-refresh'));
  refreshButton();
}
function draftEntries(){return Object.values(readDrafts()).filter(Boolean);}
function isHexHash(value){return typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);}
function validOperation(operation){
  if(!operation||!['add','replace','remove'].includes(operation.op)||typeof operation.path!=='string'||!operation.path.startsWith('/'))return false;
  return operation.op==='remove'||Object.prototype.hasOwnProperty.call(operation,'value');
}
function validEntry(entry){
  return Boolean(entry&&typeof entry.articleId==='string'&&entry.articleId&&isHexHash(entry.baseHash)&&typeof entry.updatedAt==='string'&&Array.isArray(entry.operations)&&entry.operations.length&&entry.operations.every(validOperation));
}
function normalizePackage(payload){
  if(!payload||payload.version!==VERSION||!Array.isArray(payload.entries))throw new Error('Fichier d’overrides incompatible ou invalide.');
  const invalid=payload.entries.filter(entry=>!validEntry(entry));
  if(invalid.length)throw new Error(`${invalid.length} entrée(s) d’override invalide(s).`);
  const map=new Map();
  for(const entry of payload.entries)map.set(entry.articleId,entry);
  return [...map.values()];
}
function titleFromDraft(raw,draft){
  try{return applyOperations(raw,draft.operations||[]).title||raw.title||draft.articleId;}catch{return raw?.title||draft.articleId;}
}
async function inspectDrafts(){
  const entries=draftEntries();
  if(!entries.length)return [];
  const articles=await loadEditorArticles();
  return Promise.all(entries.map(async draft=>{
    const raw=articles.get(draft.articleId);
    if(!raw)return {draft,title:draft.articleId,state:'missing',label:'Page introuvable'};
    const currentHash=await articleHash(raw);
    const conflict=currentHash!==draft.baseHash;
    return {draft,raw,title:titleFromDraft(raw,draft),currentHash,state:conflict?'conflict':'ok',label:conflict?'Conflit source':'À jour'};
  }));
}
function dateLabel(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return value||'';
  return date.toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'});
}
function downloadJson(payload){
  const blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  const date=new Date().toISOString().slice(0,10);
  anchor.href=url;anchor.download=`tuc-compendium-overrides-${date}.json`;
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}
function packageFromDrafts(){
  return {version:VERSION,updated:new Date().toISOString().slice(0,10),entries:draftEntries().sort((a,b)=>a.articleId.localeCompare(b.articleId,'fr'))};
}
function refreshButton(){
  const button=document.querySelector('#tucDraftsButton');
  if(button)button.textContent=`Brouillons (${draftEntries().length})`;
}
function ensureButton(){
  let button=document.querySelector('#tucDraftsButton');
  if(button)return button;
  button=document.createElement('button');
  button.id='tucDraftsButton';button.className='editor-drafts-button';button.type='button';
  button.addEventListener('click',()=>openDraftManager().catch(error=>alert(error.message)));
  document.body.appendChild(button);refreshButton();return button;
}
function statusBadge(item){
  const cls=item.state==='ok'?'canon':item.state==='conflict'?'obsolete':'mj';
  return `<span class="badge ${cls}">${esc(item.label)}</span>`;
}
async function renderDraftList(container){
  container.innerHTML='<div class="loading">Analyse des brouillons…</div>';
  let items;
  try{items=await inspectDrafts();}catch(error){container.innerHTML=`<div class="editor-warning">Impossible de relire le corpus : ${esc(error.message)}</div>`;return;}
  if(!items.length){container.innerHTML='<div class="empty">Aucun brouillon local.</div>';return;}
  items.sort((a,b)=>a.title.localeCompare(b.title,'fr',{sensitivity:'base'}));
  container.innerHTML=items.map(item=>`<article class="editor-draft-card" data-id="${esc(item.draft.articleId)}"><div class="editor-draft-main"><div class="editor-draft-title"><a href="#/article/${encodeURIComponent(item.draft.articleId)}">${esc(item.title)}</a>${statusBadge(item)}</div><code>${esc(item.draft.articleId)}</code>${item.draft.note?`<p>${esc(item.draft.note)}</p>`:''}<small>Modifié : ${esc(dateLabel(item.draft.updatedAt))} · ${item.draft.operations.length} opération(s)</small></div><button type="button" class="editor-danger" data-action="delete-draft">Supprimer</button></article>`).join('');
}
function buildManager(){
  const dialog=document.createElement('dialog');
  dialog.className='editor-dialog editor-drafts-dialog';
  dialog.innerHTML=`<div class="editor-form"><header><div><div class="eyebrow">MODE ÉDITION</div><h2>Brouillons locaux</h2></div><button type="button" class="editor-close" data-action="close">×</button></header><div class="editor-draft-intro">Ces modifications restent dans ce navigateur tant qu’elles ne sont pas exportées ou publiées. L’état <strong>Conflit source</strong> signifie que la page importée a changé depuis la création du brouillon.</div><div class="editor-draft-actions"><button type="button" data-action="export">Exporter tous les brouillons</button><button type="button" data-action="import">Importer / fusionner</button><input type="file" accept="application/json,.json" data-import-file hidden><span class="editor-spacer"></span><button type="button" class="editor-danger" data-action="delete-all">Tout supprimer</button></div><div class="editor-draft-list"></div><footer><span class="editor-spacer"></span><button type="button" data-action="close">Fermer</button></footer></div>`;
  document.body.appendChild(dialog);
  return dialog;
}
async function importFile(file){
  if(!file)return;
  let payload;
  try{payload=JSON.parse(await file.text());}catch{throw new Error('Le fichier sélectionné n’est pas un JSON valide.');}
  const entries=normalizePackage(payload);
  const drafts=readDrafts();
  for(const entry of entries)drafts[entry.articleId]=entry;
  writeDrafts(drafts);
  return entries.length;
}
async function openDraftManager(){
  const dialog=buildManager(),list=dialog.querySelector('.editor-draft-list'),fileInput=dialog.querySelector('[data-import-file]');
  const rerender=()=>renderDraftList(list);
  dialog.addEventListener('click',async event=>{
    const action=event.target.closest('[data-action]')?.dataset.action;if(!action)return;
    if(action==='close'){dialog.close();return;}
    if(action==='export'){
      const payload=packageFromDrafts();
      if(!payload.entries.length){alert('Aucun brouillon à exporter.');return;}
      downloadJson(payload);return;
    }
    if(action==='import'){fileInput.click();return;}
    if(action==='delete-all'){
      if(confirm('Supprimer tous les brouillons locaux ?')){writeDrafts({});await rerender();}
      return;
    }
    if(action==='delete-draft'){
      const card=event.target.closest('.editor-draft-card'),id=card?.dataset.id;if(!id)return;
      const drafts=readDrafts();delete drafts[id];writeDrafts(drafts);await rerender();return;
    }
  });
  fileInput.addEventListener('change',async()=>{
    try{
      const count=await importFile(fileInput.files?.[0]);
      if(count!=null){await rerender();alert(`${count} brouillon(s) importé(s) ou mis à jour.`);}
    }catch(error){alert(error.message);}finally{fileInput.value='';}
  });
  dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  dialog.showModal();await rerender();
}

ensureButton();
window.addEventListener('storage',refreshButton);
document.addEventListener('click',event=>{
  if(event.target.closest('[data-action="save"],[data-action="discard"]'))setTimeout(refreshButton,50);
},true);
