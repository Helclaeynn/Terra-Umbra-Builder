import {articleHash,applyOperations} from './editor/override-engine.js';
import {loadEditorArticles} from './editor/corpus-loader.js';
import {cleanupMediaDrafts,getMediaDraft,listMediaDrafts,optimizeImageFile,putMediaDraft} from './editor/media-draft-store.js';
import {buildZip,mergePublicationEntries} from './editor/zip-bundle.js';

const TOKEN='@@TUC_INLINE_MEDIA_V1@@';
const DRAFT_KEY='tuc-compendium-drafts-v1';
const objectUrls=new Map();
let sequence=0;

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeId=value=>String(value||'page').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'page';
const currentArticleId=()=>{
  const raw=location.hash.slice(1);
  if(!raw.startsWith('/article/'))return null;
  return decodeURIComponent(raw.slice(9).split('@',1)[0]);
};

function encodeMedia(meta){
  return TOKEN+JSON.stringify({
    kind:meta.kind==='portrait'?'portrait':'image',
    src:String(meta.src||''),
    alt:String(meta.alt||''),
    caption:String(meta.caption||''),
    slot:String(meta.slot||'')
  });
}
function decodeMedia(value){
  const text=String(value??'').trim();
  if(!text.startsWith(TOKEN))return null;
  try{
    const parsed=JSON.parse(text.slice(TOKEN.length));
    if(!parsed||typeof parsed!=='object')return null;
    return {
      kind:parsed.kind==='portrait'?'portrait':'image',
      src:String(parsed.src||''),
      alt:String(parsed.alt||''),
      caption:String(parsed.caption||''),
      slot:String(parsed.slot||'')
    };
  }catch{return null;}
}
function newSlot(){return `${Date.now().toString(36)}-${(++sequence).toString(36)}`;}
function targetPath(kind,slot){
  const article=safeId(currentArticleId());
  return `images/manual/${article}-${kind==='portrait'?'portrait':'image'}-${safeId(slot||newSlot())}.webp`;
}
function readDrafts(){
  try{
    const parsed=JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}');
    return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
  }catch{return {};}
}
function draftEntries(){return Object.values(readDrafts()).filter(Boolean);}
function hasInlineMediaDrafts(){return draftEntries().some(entry=>JSON.stringify(entry.operations||[]).includes(TOKEN));}
function humanSize(bytes){
  if(bytes<1024)return `${bytes} o`;
  if(bytes<1024*1024)return `${(bytes/1024).toFixed(1)} Ko`;
  return `${(bytes/1024/1024).toFixed(2)} Mo`;
}
function downloadBlob(blob,filename){
  const url=URL.createObjectURL(blob),anchor=document.createElement('a');
  anchor.href=url;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}
async function localUrlFor(path){
  if(!path)return null;
  const item=await getMediaDraft(path);
  if(!item?.blob)return null;
  if(objectUrls.has(path))return {url:objectUrls.get(path),item};
  const url=URL.createObjectURL(item.blob);objectUrls.set(path,url);return {url,item};
}

function figureHtml(meta,preview=false){
  const kind=meta.kind==='portrait'?'portrait':'image';
  const src=meta.src||'';
  const alt=meta.alt||'';
  const caption=meta.caption||'';
  return `<figure class="content-inline-media ${kind}" data-inline-media-rendered="1"${preview?' data-editor-preview="inline-media"':''}>${src?`<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`:'<div class="content-inline-media-empty">Image à choisir</div>'}${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`;
}
async function resolveLocalFigure(figure,meta){
  if(!meta.src?.startsWith('images/'))return;
  const result=await localUrlFor(meta.src);if(!result)return;
  const img=figure.querySelector('img');if(img)img.src=result.url;
}
function transformRenderedParagraph(paragraph){
  if(!(paragraph instanceof HTMLElement)||paragraph.dataset.inlineMediaTransformed)return;
  const meta=decodeMedia(paragraph.textContent);if(!meta)return;
  paragraph.dataset.inlineMediaTransformed='1';
  const wrapper=document.createElement('div');
  wrapper.innerHTML=figureHtml(meta,Boolean(paragraph.closest('[data-editor-preview]')));
  const figure=wrapper.firstElementChild;
  paragraph.replaceWith(figure);
  resolveLocalFigure(figure,meta).catch(console.error);
}
function transformRenderedMedia(root=document){
  if(root.matches?.('p.body-p'))transformRenderedParagraph(root);
  root.querySelectorAll?.('p.body-p').forEach(transformRenderedParagraph);
}

function standardTextBlockHtml(){
  return `<div class="editor-block" data-original-index="-1" data-type="p"><div class="editor-block-head"><strong>Paragraphe</strong><select data-field="block-style"><option value="">Normal</option><option value="list">Liste</option><option value="callout">Encadré</option><option value="lore">Lore</option></select><button type="button" data-action="remove-block">Supprimer</button></div><textarea data-field="block-text" rows="5"></textarea></div>`;
}
function mediaEditorFields(meta){
  return `<div class="editor-inline-media-fields"><div class="editor-inline-media-grid"><label>Type<select data-inline-media-kind><option value="image" ${meta.kind==='image'?'selected':''}>Image</option><option value="portrait" ${meta.kind==='portrait'?'selected':''}>Portrait</option></select></label><label class="wide">Chemin<input data-inline-media-src value="${esc(meta.src)}" placeholder="images/... ou URL"></label><label>Texte alternatif<input data-inline-media-alt value="${esc(meta.alt)}"></label><label>Légende<input data-inline-media-caption value="${esc(meta.caption)}"></label></div><div class="editor-inline-media-actions"><button type="button" data-inline-media-pick>Choisir une image du PC</button><input type="file" accept="image/*" data-inline-media-file hidden><span data-inline-media-status></span></div><div class="editor-inline-media-preview"></div></div>`;
}
function syncEditorMedia(block){
  const text=block.querySelector('[data-field="block-text"]');if(!text)return null;
  const current=decodeMedia(text.value)||{};
  const meta={
    kind:block.querySelector('[data-inline-media-kind]')?.value==='portrait'?'portrait':'image',
    src:block.querySelector('[data-inline-media-src]')?.value.trim()||'',
    alt:block.querySelector('[data-inline-media-alt]')?.value.trim()||'',
    caption:block.querySelector('[data-inline-media-caption]')?.value.trim()||'',
    slot:current.slot||block.dataset.inlineMediaSlot||newSlot()
  };
  block.dataset.inlineMediaSlot=meta.slot;text.value=encodeMedia(meta);
  const preview=block.querySelector('.editor-inline-media-preview');
  if(preview){
    preview.innerHTML=figureHtml(meta,true);
    const figure=preview.querySelector('.content-inline-media');if(figure)resolveLocalFigure(figure,meta).catch(console.error);
  }
  return meta;
}
async function refreshMediaStatus(block){
  const meta=syncEditorMedia(block);if(!meta)return;
  const status=block.querySelector('[data-inline-media-status]');if(!status)return;
  const item=meta.src?await getMediaDraft(meta.src):null;
  status.textContent=item?`WebP local prêt · ${item.width}×${item.height} · ${humanSize(item.size)}`:(meta.src?'Chemin saisi · aucun WebP local associé':'Aucune image sélectionnée');
}
async function handleMediaFile(block,file){
  const status=block.querySelector('[data-inline-media-status]');if(status)status.textContent='Conversion WebP…';
  let meta=syncEditorMedia(block);if(!meta)return;
  const optimized=await optimizeImageFile(file);
  const path=targetPath(meta.kind,meta.slot);
  await putMediaDraft({path,blob:optimized.blob,articleId:currentArticleId(),originalName:file.name,width:optimized.width,height:optimized.height});
  block.querySelector('[data-inline-media-src]').value=path;
  meta=syncEditorMedia(block);
  await refreshMediaStatus(block);
}
function enhanceMediaEditorBlock(block,meta=null){
  if(block.dataset.inlineMediaEditor)return;
  const text=block.querySelector('[data-field="block-text"]');
  meta=meta||decodeMedia(text?.value);if(!meta)return;
  if(!meta.slot)meta.slot=newSlot();
  block.dataset.inlineMediaEditor='1';block.dataset.inlineMediaSlot=meta.slot;
  const head=block.querySelector('.editor-block-head');
  if(head){const strong=head.querySelector('strong');if(strong)strong.textContent=meta.kind==='portrait'?'Portrait':'Image';}
  const style=block.querySelector('[data-field="block-style"]');if(style)style.hidden=true;
  if(text){text.value=encodeMedia(meta);text.hidden=true;}
  block.insertAdjacentHTML('beforeend',mediaEditorFields(meta));
  const picker=block.querySelector('[data-inline-media-file]');
  block.querySelector('[data-inline-media-pick]')?.addEventListener('click',()=>picker?.click());
  picker?.addEventListener('change',async()=>{
    try{if(picker.files?.[0])await handleMediaFile(block,picker.files[0]);}catch(error){alert(error.message);}finally{picker.value='';}
  });
  block.addEventListener('input',event=>{
    if(event.target.closest('[data-inline-media-fields]'))syncEditorMedia(block);
  });
  block.addEventListener('change',event=>{
    if(event.target.matches('[data-inline-media-kind]')){
      const strong=head?.querySelector('strong');if(strong)strong.textContent=event.target.value==='portrait'?'Portrait':'Image';
    }
    if(event.target.closest('[data-inline-media-fields]'))refreshMediaStatus(block).catch(console.error);
  });
  refreshMediaStatus(block).catch(console.error);
}
function createMediaBlock(kind){
  const slot=newSlot(),meta={kind:kind==='portrait'?'portrait':'image',src:'',alt:'',caption:'',slot};
  const wrapper=document.createElement('div');wrapper.innerHTML=standardTextBlockHtml();
  const block=wrapper.firstElementChild;
  block.querySelector('[data-field="block-text"]').value=encodeMedia(meta);
  enhanceMediaEditorBlock(block,meta);return block;
}
function enhanceAddControl(section){
  const button=section.querySelector(':scope > [data-action="add-paragraph"]');
  if(!button||button.dataset.inlineMediaAddEnhanced)return;
  button.dataset.inlineMediaAddEnhanced='1';
  const select=document.createElement('select');
  select.className='editor-inline-add-type';select.dataset.inlineAddType='1';
  select.innerHTML='<option value="text">Texte</option><option value="image">Image</option><option value="portrait">Portrait</option>';
  button.insertAdjacentElement('beforebegin',select);
}
function enhanceEditor(root=document){
  root.querySelectorAll?.('.editor-section').forEach(section=>{
    enhanceAddControl(section);
    section.querySelectorAll('.editor-block').forEach(block=>enhanceMediaEditorBlock(block));
  });
}

document.addEventListener('click',event=>{
  const add=event.target.closest('[data-action="add-paragraph"]');
  if(!add)return;
  const section=add.closest('.editor-section'),kind=section?.querySelector(':scope > [data-inline-add-type]')?.value||'text';
  if(kind==='text')return;
  event.preventDefault();event.stopImmediatePropagation();
  const blocks=section?.querySelector(':scope > .editor-blocks');if(!blocks)return;
  blocks.appendChild(createMediaBlock(kind));
},true);

function collectMediaPaths(value,refs=new Set()){
  if(typeof value==='string'){
    const inline=decodeMedia(value);
    if(inline?.src?.startsWith('images/'))refs.add(inline.src);
    else if(value.startsWith('images/'))refs.add(value);
    return refs;
  }
  if(Array.isArray(value)){for(const item of value)collectMediaPaths(item,refs);return refs;}
  if(value&&typeof value==='object')for(const item of Object.values(value))collectMediaPaths(item,refs);
  return refs;
}
async function repositoryMediaExists(path){
  if(!path?.startsWith('images/'))return false;
  try{const response=await fetch(path,{method:'HEAD',cache:'no-cache'});return response.ok;}catch{return false;}
}
async function inspectInlinePublication(){
  const drafts=draftEntries();
  const [articles,localRows]=await Promise.all([loadEditorArticles(),listMediaDrafts()]);
  const local=new Map(localRows.map(item=>[item.path,item]));
  const items=[];
  for(const draft of drafts){
    const raw=articles.get(draft.articleId);if(!raw)throw new Error(`Page introuvable : ${draft.articleId}`);
    const currentHash=await articleHash(raw);if(currentHash!==draft.baseHash)throw new Error(`Conflit source : ${raw.title||draft.articleId}`);
    const effective=applyOperations(raw,draft.operations||[]);
    const before=collectMediaPaths(raw),after=collectMediaPaths(effective);
    const changed=[...after].filter(path=>!before.has(path));
    const media=[];
    for(const path of changed){
      const item=local.get(path);
      if(item?.blob){media.push({path,item});continue;}
      if(await repositoryMediaExists(path))continue;
      throw new Error(`Média local manquant : ${raw.title||draft.articleId} — ${path}`);
    }
    items.push({draft,raw,effective,media});
  }
  return items;
}
async function loadCommittedPackage(){
  const response=await fetch('data/manual-overrides.json',{cache:'no-cache'});
  if(!response.ok)throw new Error(`manual-overrides.json indisponible · HTTP ${response.status}`);
  const payload=await response.json();
  if(payload?.version!==1||!Array.isArray(payload.entries))throw new Error('manual-overrides.json commité invalide.');
  return payload;
}
async function exportInlinePublicationBundle(){
  const items=await inspectInlinePublication();if(!items.length)throw new Error('Aucun brouillon à publier.');
  const committed=await loadCommittedPackage();
  const payload=mergePublicationEntries(committed,items.map(item=>item.draft));
  const files=[{name:'compendium/data/manual-overrides.json',data:JSON.stringify(payload,null,2)+'\n'}];
  const added=new Set();
  for(const item of items)for(const media of item.media){
    const repoPath=`compendium/${media.path.replace(/^compendium\//,'')}`;
    if(added.has(repoPath))continue;added.add(repoPath);files.push({name:repoPath,data:media.item.blob});
  }
  files.push({name:'TUC-COMPENDIUM-PUBLICATION.txt',data:[
    'TUC COMPENDIUM — LOT DE PUBLICATION','',
    'Ce lot inclut les blocs Image / Portrait ajoutés dans le corps des pages.',
    'Copier son contenu à la racine du dépôt en conservant exactement les chemins.','',
    `Overrides finaux : ${payload.entries.length}`,
    `Brouillons intégrés : ${items.length}`,
    `Médias WebP inclus : ${added.size}`,'',
    'Après commit, laisser passer les gates Compendium V3 et Builder syntax check.'
  ].join('\n')+'\n'});
  const zip=await buildZip(files);
  downloadBlob(zip,`tuc-compendium-publication-${new Date().toISOString().slice(0,10)}.zip`);
  return {files:files.length,media:added.size};
}

document.addEventListener('click',async event=>{
  const button=event.target.closest('.editor-drafts-dialog [data-action="publication"]');
  if(!button||!hasInlineMediaDrafts())return;
  event.preventDefault();event.stopImmediatePropagation();
  const original=button.textContent;button.disabled=true;button.textContent='Préparation du lot…';
  try{
    const result=await exportInlinePublicationBundle();
    button.textContent=`Lot prêt ✓ · ${result.files} fichier(s), ${result.media} média(s)`;
    setTimeout(()=>button.textContent=original,2200);
  }catch(error){alert(error.message);button.textContent=original;}finally{button.disabled=false;}
},true);

async function referencedDraftMediaPaths(){
  const refs=new Set(),drafts=draftEntries();if(!drafts.length)return refs;
  const articles=await loadEditorArticles();
  for(const draft of drafts){
    const raw=articles.get(draft.articleId);if(!raw)continue;
    try{collectMediaPaths(applyOperations(raw,draft.operations||[]),refs);}catch{}
  }
  return refs;
}
async function refreshCleanup(dialog){
  if(!hasInlineMediaDrafts())return;
  const button=dialog.querySelector('[data-action="cleanup-media"]');if(!button)return;
  const [refs,rows]=await Promise.all([referencedDraftMediaPaths(),listMediaDrafts()]);
  const orphans=rows.filter(row=>row?.path&&!refs.has(row.path));
  button.disabled=!orphans.length;
  button.textContent=orphans.length?`Nettoyer médias orphelins (${orphans.length})`:'Aucun média orphelin';
}
document.addEventListener('click',async event=>{
  const button=event.target.closest('.editor-drafts-dialog [data-action="cleanup-media"]');
  if(!button||!hasInlineMediaDrafts())return;
  event.preventDefault();event.stopImmediatePropagation();
  const dialog=button.closest('.editor-drafts-dialog');
  const [refs,rows]=await Promise.all([referencedDraftMediaPaths(),listMediaDrafts()]);
  const orphans=rows.filter(row=>row?.path&&!refs.has(row.path));
  if(!orphans.length){await refreshCleanup(dialog);return;}
  const total=orphans.reduce((sum,row)=>sum+(Number(row.size)||0),0);
  if(!confirm(`Supprimer ${orphans.length} média(s) local(aux) orphelin(s) (${humanSize(total)}) ?`))return;
  const removed=await cleanupMediaDrafts(refs);await refreshCleanup(dialog);
  alert(`${removed.length} média(s) local(aux) supprimé(s).`);
},true);

const observer=new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes){
    if(!(node instanceof Element))continue;
    transformRenderedMedia(node);enhanceEditor(node);
    if(node.matches?.('.editor-drafts-dialog'))setTimeout(()=>refreshCleanup(node).catch(console.error),0);
    node.querySelectorAll?.('.editor-drafts-dialog').forEach(dialog=>setTimeout(()=>refreshCleanup(dialog).catch(console.error),0));
  }
});
observer.observe(document.body,{childList:true,subtree:true});
transformRenderedMedia();enhanceEditor();
window.addEventListener('tuc:drafts-changed',()=>document.querySelectorAll('.editor-drafts-dialog').forEach(dialog=>refreshCleanup(dialog).catch(console.error)));
window.addEventListener('beforeunload',()=>{for(const url of objectUrls.values())URL.revokeObjectURL(url);});
