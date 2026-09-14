import {decodeMedia,deletePaths,encodeMedia,humanSize,localUrlFor,mediaDraftFor,mediaPaths,newSlot,storeMediaFile} from './lore-preview-media.js';
import {clearApplied,snapshot} from './lore-preview-editor-view.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const actions=()=>'<span class="editor-block-actions"><button type="button" data-action="move-up" title="Monter">↑</button><button type="button" data-action="move-down" title="Descendre">↓</button><button type="button" data-action="remove-block">Supprimer</button></span>';
function textBlockHtml(text,index){return `<div class="editor-block" data-type="text"><div class="editor-block-head"><strong>Paragraphe ${index+1}</strong>${actions()}</div><textarea data-field="block-text" rows="6">${esc(text)}</textarea></div>`;}
function mediaFields(meta){
  const filename=meta.src?meta.src.split('/').pop():'Aucun fichier sélectionné';
  return `<div class="editor-inline-media-fields"><input type="hidden" data-inline-media-src value="${esc(meta.src)}"><div class="editor-inline-media-pc-picker${meta.src?' has-file':''}" data-inline-media-pc-picker tabindex="0" role="group" aria-label="Sélection d’une image depuis le PC"><div class="editor-inline-media-pc-copy"><strong>Image locale</strong><span data-inline-media-pc-file>${esc(filename)}</span></div><div class="editor-inline-media-pc-controls"><button type="button" data-inline-media-pick>${meta.src?'Remplacer l’image depuis le PC':'Sélectionner une image depuis le PC'}</button><input type="file" accept="image/*" data-inline-media-file hidden><span data-inline-media-status></span></div></div><div class="editor-inline-media-grid"><label>Texte alternatif<input data-inline-media-alt value="${esc(meta.alt)}" placeholder="Description de l’image"></label><label>Légende<input data-inline-media-caption value="${esc(meta.caption)}" placeholder="Légende facultative"></label></div><div class="editor-inline-media-preview"></div></div>`;
}
function mediaBlockHtml(meta){
  if(!meta.slot)meta.slot=newSlot();
  return `<div class="editor-block" data-type="media" data-inline-media-kind="${meta.kind}" data-inline-media-slot="${esc(meta.slot)}"><div class="editor-block-head"><strong>${meta.kind==='portrait'?'Portrait':'Image'}</strong>${actions()}</div><textarea data-field="block-text" hidden>${esc(encodeMedia(meta))}</textarea>${mediaFields(meta)}</div>`;
}
function blockHtml(value,index){const meta=decodeMedia(value);return meta?mediaBlockHtml(meta):textBlockHtml(value,index);}
function sectionHtml(section,index){
  const values=Array.isArray(section.paragraphs)?section.paragraphs:[];
  return `<article class="editor-section" data-section-index="${index}"><div class="editor-row"><label>Titre de section<input data-field="section-title" value="${esc(section.title)}"></label></div><div class="editor-blocks">${values.map(blockHtml).join('')}</div><div class="lore-editor-add-row"><button type="button" data-action="add-text">+ Texte</button><button type="button" data-action="add-media" data-kind="image">+ Image</button><button type="button" data-action="add-media" data-kind="portrait">+ Portrait</button></div></article>`;
}
function mediaMeta(block){
  const current=decodeMedia(block.querySelector('[data-field="block-text"]')?.value)||{};
  return {kind:block.dataset.inlineMediaKind==='portrait'?'portrait':'image',src:block.querySelector('[data-inline-media-src]')?.value.trim()||'',alt:block.querySelector('[data-inline-media-alt]')?.value.trim()||'',caption:block.querySelector('[data-inline-media-caption]')?.value.trim()||'',slot:current.slot||block.dataset.inlineMediaSlot||newSlot()};
}
function syncMedia(block){const meta=mediaMeta(block);block.dataset.inlineMediaSlot=meta.slot;const text=block.querySelector('[data-field="block-text"]');if(text)text.value=encodeMedia(meta);return meta;}
async function renderPreview(block){
  const meta=syncMedia(block),preview=block.querySelector('.editor-inline-media-preview');if(!preview)return;preview.innerHTML='';
  const figure=document.createElement('figure');figure.className=`content-inline-media ${meta.kind}`;
  if(meta.src){const img=document.createElement('img');img.alt=meta.alt;img.loading='lazy';img.src=meta.src;figure.appendChild(img);const url=await localUrlFor(meta.src).catch(()=>null);if(url&&img.isConnected)img.src=url;}
  else{const empty=document.createElement('div');empty.className='content-inline-media-empty';empty.textContent='Image à choisir';figure.appendChild(empty);}
  if(meta.caption){const caption=document.createElement('figcaption');caption.textContent=meta.caption;figure.appendChild(caption);}preview.appendChild(figure);
  const item=meta.src?await mediaDraftFor(meta.src):null,status=block.querySelector('[data-inline-media-status]'),fileName=block.querySelector('[data-inline-media-pc-file]'),picker=block.querySelector('[data-inline-media-pc-picker]');
  if(status)status.textContent=item?`WebP local prêt · ${item.width}×${item.height} · ${humanSize(item.size)}`:(meta.src?'Image référencée':'Aucune image sélectionnée');
  if(fileName)fileName.textContent=item?.originalName||meta.src?.split('/').pop()||'Aucun fichier sélectionné';picker?.classList.toggle('has-file',Boolean(meta.src));
}
function renumber(section){let index=0;section.querySelectorAll(':scope > .editor-blocks > .editor-block').forEach(block=>{if(block.dataset.type!=='text')return;index+=1;const strong=block.querySelector('.editor-block-head strong');if(strong)strong.textContent=`Paragraphe ${index}`;});}
function collect(dialog,state){
  const sections=[...dialog.querySelectorAll('.editor-section')].map(card=>({title:card.querySelector('[data-field="section-title"]')?.value||'',paragraphs:[...card.querySelectorAll(':scope > .editor-blocks > .editor-block')].map(block=>{if(block.dataset.type==='media')syncMedia(block);return block.querySelector('[data-field="block-text"]')?.value||'';})}));
  return {version:2,pageKey:state.key,title:dialog.querySelector('[name="title"]')?.value||'',sections,updatedAt:new Date().toISOString()};
}

export function openLoreEditor({state,readDrafts,writeDrafts,refresh}){
  const base=state.draft||snapshot(state.doc),sessionPaths=new Set(),dialog=document.createElement('dialog');dialog.className='editor-dialog';
  dialog.innerHTML=`<form method="dialog" class="editor-form"><header><div><div class="eyebrow">PREVIEW LORE · BROUILLON LOCAL</div><h2>Éditer la page</h2></div><button class="editor-close" type="button" aria-label="Fermer">×</button></header><div class="editor-grid"><label class="wide">Titre de la page<input name="title" value="${esc(base.title)}"></label></div><div class="editor-warning">Texte, images et portraits restent locaux à ce navigateur. Les images sont converties en WebP et conservées dans IndexedDB ; le corpus Git n’est pas modifié automatiquement.</div><div class="editor-section-toolbar"><strong>Contenu affiché</strong><span>${base.sections?.length||0} section(s)</span></div><div class="editor-sections">${(base.sections||[]).map(sectionHtml).join('')}</div><footer><button type="button" data-action="reset" class="editor-danger">Réinitialiser</button><span class="editor-spacer"></span><button type="button" data-action="cancel">Annuler</button><button type="submit" class="editor-primary">Enregistrer le brouillon</button></footer></form>`;
  document.body.appendChild(dialog);let committed=false;
  const cleanupUnsaved=async()=>{if(committed)return;const persisted=mediaPaths(readDrafts()[state.key]);await deletePaths([...sessionPaths].filter(path=>!persisted.has(path)));};
  const close=async()=>{await cleanupUnsaved();dialog.close();dialog.remove();};
  dialog.querySelector('.editor-close').addEventListener('click',()=>void close());dialog.querySelector('[data-action="cancel"]').addEventListener('click',()=>void close());dialog.addEventListener('cancel',event=>{event.preventDefault();void close();});
  dialog.querySelectorAll('.editor-block[data-type="media"]').forEach(block=>void renderPreview(block));
  dialog.addEventListener('input',event=>{const block=event.target.closest('.editor-block[data-type="media"]');if(block&&event.target.matches('[data-inline-media-alt],[data-inline-media-caption]'))void renderPreview(block);});
  dialog.addEventListener('click',event=>{
    const section=event.target.closest('.editor-section'),block=event.target.closest('.editor-block');
    if(event.target.closest('[data-action="add-text"]')&&section){const blocks=section.querySelector(':scope > .editor-blocks');blocks.insertAdjacentHTML('beforeend',textBlockHtml('',blocks.querySelectorAll('.editor-block[data-type="text"]').length));renumber(section);return;}
    const add=event.target.closest('[data-action="add-media"]');if(add&&section){const meta={kind:add.dataset.kind==='portrait'?'portrait':'image',src:'',alt:'',caption:'',slot:newSlot()},blocks=section.querySelector(':scope > .editor-blocks');blocks.insertAdjacentHTML('beforeend',mediaBlockHtml(meta));const created=blocks.lastElementChild;void renderPreview(created);created.querySelector('[data-inline-media-file]')?.click();return;}
    const pick=event.target.closest('[data-inline-media-pick]');if(pick){pick.closest('.editor-block')?.querySelector('[data-inline-media-file]')?.click();return;}
    const panel=event.target.closest('[data-inline-media-pc-picker]');if(panel&&!event.target.closest('button')){panel.closest('.editor-block')?.querySelector('[data-inline-media-file]')?.click();return;}
    if(event.target.closest('[data-action="remove-block"]')&&block){block.remove();if(section)renumber(section);return;}
    if(event.target.closest('[data-action="move-up"]')&&block){const prev=block.previousElementSibling;if(prev)prev.before(block);if(section)renumber(section);return;}
    if(event.target.closest('[data-action="move-down"]')&&block){const next=block.nextElementSibling;if(next)next.after(block);if(section)renumber(section);}
  });
  dialog.addEventListener('keydown',event=>{if(!event.target.closest('[data-inline-media-pc-picker]')||!['Enter',' '].includes(event.key))return;event.preventDefault();event.target.closest('.editor-block')?.querySelector('[data-inline-media-file]')?.click();});
  dialog.addEventListener('change',event=>{
    const input=event.target.closest('[data-inline-media-file]');if(!input)return;const block=input.closest('.editor-block'),file=input.files?.[0];input.value='';if(!file)return;
    const status=block.querySelector('[data-inline-media-status]');if(status)status.textContent='Conversion WebP…';
    storeMediaFile(file,state.key,block.dataset.inlineMediaKind).then(result=>{sessionPaths.add(result.path);block.dataset.inlineMediaSlot=result.slot;block.querySelector('[data-inline-media-src]').value=result.path;syncMedia(block);return renderPreview(block);}).catch(error=>alert(error.message));
  });
  dialog.querySelector('[data-action="reset"]').addEventListener('click',async()=>{const drafts=readDrafts(),old=drafts[state.key];delete drafts[state.key];writeDrafts(drafts);committed=true;await deletePaths(mediaPaths(old));await deletePaths(sessionPaths);clearApplied(state.doc);dialog.close();dialog.remove();refresh();});
  dialog.querySelector('form').addEventListener('submit',async event=>{event.preventDefault();const next=collect(dialog,state),nextPaths=mediaPaths(next),oldPaths=mediaPaths(state.draft),drafts=readDrafts();drafts[state.key]=next;writeDrafts(drafts);committed=true;await deletePaths([...oldPaths].filter(path=>!nextPaths.has(path)));await deletePaths([...sessionPaths].filter(path=>!nextPaths.has(path)));dialog.close();dialog.remove();refresh();});
  dialog.showModal();
}
