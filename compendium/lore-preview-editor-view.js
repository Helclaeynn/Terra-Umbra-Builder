import {createMediaFigure,decodeMedia} from './lore-preview-media.js';

export function pageIdentity(frame,doc){
  const url=new URL(frame.src||'',location.href),docId=url.pathname.split('/').pop()?.replace(/-preview\.html$/,'')||'lore';
  const hash=decodeURIComponent((doc.defaultView?.location?.hash||'').replace(/^#\/?/,''));
  const active=doc.querySelector('#nav [data-id].active,.nav [data-id].active,#nav a.active,.nav a.active');
  const activeId=active?.dataset?.id||decodeURIComponent((active?.getAttribute?.('href')||'').replace(/^#\/?/,''));
  const heading=doc.querySelector('#content h1,.content h1');
  const stableTitle=heading?.getAttribute('data-lore-editor-original')||heading?.textContent?.trim()||'';
  return `${docId}::${hash||activeId||stableTitle||'page'}`;
}
export function pageRoot(doc){return doc.querySelector('#content,.content')||doc.body;}
export function snapshot(doc){
  const root=pageRoot(doc),sections=[...root.querySelectorAll('.preview-section,.section')].filter(section=>!section.closest('[data-lore-editor-preview]'));
  return {version:2,title:root.querySelector('.page-head h1,.preview-hero h1,h1')?.textContent?.trim()||'',sections:sections.map(section=>({
    title:section.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > h5')?.textContent?.trim()||'',
    paragraphs:[...section.querySelectorAll(':scope > .body-p,:scope > p.body-p')].map(p=>p.textContent??'')
  }))};
}
export function normalizeDraft(draft){
  if(!draft)return null;
  return {...draft,version:2,sections:(draft.sections||[]).map(section=>({title:String(section?.title||''),paragraphs:Array.isArray(section?.paragraphs)?section.paragraphs.map(value=>String(value??'')):[]}))};
}
function ensureMediaStyles(doc){
  if(doc.querySelector('link[data-lore-editor-media-style]'))return;
  const link=doc.createElement('link');link.rel='stylesheet';link.href=new URL('inline-media-blocks.css',location.href).href;link.dataset.loreEditorMediaStyle='1';doc.head?.appendChild(link);
}
export function clearApplied(doc){
  doc.querySelectorAll('[data-lore-editor-original]').forEach(node=>{node.textContent=node.getAttribute('data-lore-editor-original')||'';node.removeAttribute('data-lore-editor-original');});
  doc.querySelectorAll('[data-lore-editor-hidden-original]').forEach(node=>{node.hidden=node.getAttribute('data-lore-editor-hidden-original')==='1';node.removeAttribute('data-lore-editor-hidden-original');});
  doc.querySelectorAll('[data-lore-editor-preview="block"]').forEach(node=>node.remove());
  doc.querySelectorAll('.editor-state-badge[data-lore-editor-preview]').forEach(node=>node.remove());
}
function setText(node,value){
  if(!node)return;if(!node.hasAttribute('data-lore-editor-original'))node.setAttribute('data-lore-editor-original',node.textContent??'');node.textContent=value??'';
}
function hideOriginal(node){if(!node.hasAttribute('data-lore-editor-hidden-original'))node.setAttribute('data-lore-editor-hidden-original',node.hidden?'1':'0');node.hidden=true;}
function showOriginal(node){if(node.hasAttribute('data-lore-editor-hidden-original'))node.hidden=false;}
function insertAfter(reference,node,section){if(reference?.parentNode)reference.after(node);else section.appendChild(node);}
function applySection(doc,section,saved){
  const values=Array.isArray(saved?.paragraphs)?saved.paragraphs:[];
  const originals=[...section.querySelectorAll(':scope > .body-p,:scope > p.body-p')].filter(node=>!node.hasAttribute('data-lore-editor-preview'));
  const heading=section.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > h5');let textIndex=0,lastNode=heading;
  for(const value of values){
    const meta=decodeMedia(value);
    if(meta){const figure=createMediaFigure(doc,meta),target=originals[textIndex];if(target)target.before(figure);else insertAfter(lastNode,figure,section);lastNode=figure;continue;}
    let paragraph=originals[textIndex];
    if(paragraph){showOriginal(paragraph);setText(paragraph,value);lastNode=paragraph;}
    else{paragraph=doc.createElement('p');paragraph.className='body-p';paragraph.dataset.loreEditorPreview='block';paragraph.textContent=value;insertAfter(lastNode,paragraph,section);lastNode=paragraph;}
    textIndex+=1;
  }
  for(let index=textIndex;index<originals.length;index+=1)hideOriginal(originals[index]);
}
export function applyDraft(doc,draft){
  clearApplied(doc);ensureMediaStyles(doc);draft=normalizeDraft(draft);if(!draft)return;
  const root=pageRoot(doc);setText(root.querySelector('.page-head h1,.preview-hero h1,h1'),draft.title);
  const sections=[...root.querySelectorAll('.preview-section,.section')].filter(section=>!section.closest('[data-lore-editor-preview]'));
  draft.sections?.forEach((saved,index)=>{const section=sections[index];if(!section)return;setText(section.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > h5'),saved.title);applySection(doc,section,saved);});
  const head=root.querySelector('.page-head,.preview-hero');if(head){const badge=doc.createElement('div');badge.className='editor-state-badge';badge.dataset.loreEditorPreview='1';badge.innerHTML='<span class="badge source">Brouillon local</span>';head.appendChild(badge);}
}
