import {applyOverrideEntries,applyOperations,buildArticleOperations,deepClone} from './editor/override-engine.js';
import {loadEditorArticles} from './editor/corpus-loader.js';

const DRAFT_KEY='tuc-compendium-drafts-v1';
const EDITOR_VERSION=1;
const state={manual:null};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cleanLines=value=>String(value??'').split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
const setOptional=(obj,key,value)=>{const text=String(value??'').trim();if(text)obj[key]=text;else delete obj[key];};
const nativeCommitted=()=>Boolean(window.__TUC_NATIVE_OVERRIDES__);

const currentArticleId=()=>{
  const raw=location.hash.slice(1);
  if(!raw.startsWith('/article/'))return null;
  return decodeURIComponent(raw.slice(9).split('@',1)[0]);
};
function readDrafts(){try{return JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}')||{};}catch{return {};}}
function writeDrafts(drafts){
  localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts));
  window.dispatchEvent(new CustomEvent('tuc:drafts-changed'));
}
function getDraft(id){return readDrafts()[id]||null;}
function saveDraft(entry){const drafts=readDrafts();drafts[entry.articleId]=entry;writeDrafts(drafts);}
function removeDraft(id){const drafts=readDrafts();delete drafts[id];writeDrafts(drafts);}

async function loadManual(){
  if(state.manual)return state.manual;
  try{
    const response=await fetch('data/manual-overrides.json',{cache:'no-cache'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    state.manual=await response.json();
  }catch(error){
    console.warn('Overrides manuels indisponibles',error);
    state.manual={version:EDITOR_VERSION,entries:[]};
  }
  return state.manual;
}
async function effectiveArticle(id){
  const raw=(await loadEditorArticles()).get(id);
  if(!raw)throw new Error(`Article introuvable: ${id}`);
  const manual=await loadManual();
  const committed=await applyOverrideEntries(raw,manual.entries||[]);
  let article=committed.article;
  const conflicts=[...committed.conflicts];
  const draft=getDraft(id);
  if(draft){
    if(draft.baseHash===committed.baseHash)article=applyOperations(article,draft.operations||[]);
    else conflicts.push({entry:draft,expected:committed.baseHash,received:draft.baseHash,draft:true});
  }
  return {raw,article,baseHash:committed.baseHash,draft,committed:committed.applied,conflicts};
}

function waitForArticleDom(id,attempt=0){
  return new Promise(resolve=>{
    const ready=currentArticleId()===id&&document.querySelector('#main .page-head h1');
    if(ready||attempt>40)return resolve(Boolean(ready));
    setTimeout(()=>resolve(waitForArticleDom(id,attempt+1)),50);
  });
}
function clearPreview(){
  document.querySelectorAll('[data-editor-preview]').forEach(node=>node.remove());
  document.querySelectorAll('[data-editor-hidden]').forEach(node=>{node.hidden=false;node.removeAttribute('data-editor-hidden');});
  document.querySelectorAll('[data-editor-original-text]').forEach(node=>{node.textContent=node.dataset.editorOriginalText||'';node.removeAttribute('data-editor-original-text');});
  document.querySelectorAll('[data-editor-original-html]').forEach(node=>{node.innerHTML=node.dataset.editorOriginalHtml||'';node.removeAttribute('data-editor-original-html');});
  document.querySelectorAll('.editor-state-badge').forEach(node=>node.remove());
}
function blockPreview(block){
  if(block.type==='table'){
    const rows=(block.rows||[]).map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('');
    return `<div class="doc-table-wrap"><table class="doc-table"><tbody>${rows}</tbody></table></div>`;
  }
  const style=String(block.style||'').toLowerCase();
  const cls=style.includes('list')?' list':style.includes('spec')?' spec':style.includes('callout')?' callout':style.includes('lore')?' lore':'';
  return `<p class="body-p${cls}">${esc(block.text||'').replace(/\n/g,'<br>')}</p>`;
}
function sectionPreview(section){
  const level=Math.min(5,Math.max(2,Number(section.level)||3));
  const content=(section.blocks||[]).map(blockPreview).join('');
  const inner=`<section class="section" id="${esc(section.id||'')}"><h${level}>${esc(section.title||'')}</h${level}>${content}</section>`;
  return section.audience==='mj'?`<details class="mj-block"><summary>${esc(section.title||'Section MJ')}</summary><div class="mj-inner">${inner}</div></details>`:inner;
}
function pnjPreviewHtml(article,main){
  const p=article.pnj||{};
  const portrait=p.portrait?`<figure class="pnj-portrait editor-portrait-figure"><img src="${esc(p.portrait)}" alt="${esc(p.portrait_alt||`Portrait de ${article.title}`)}" loading="lazy">${p.portrait_caption?`<figcaption>${esc(p.portrait_caption)}</figcaption>`:''}</figure>`:'';
  const facts=[['Âge',p.age],['Origine',p.origine],['Statut',p.statut]].filter(([,value])=>value);
  const factHtml=facts.length?`<div class="pnj-facts">${facts.map(([key,value])=>`<div><span>${esc(key)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>`:'';
  const relations=(p.relations||[]).filter(Boolean);
  const relHtml=relations.length?`<div class="pnj-relations"><strong>Relations</strong><div class="related-links">${relations.map(value=>`<span>${esc(value)}</span>`).join('')}</div></div>`:'';
  const truth=[['Nom / identité de Vérité',p.nom_verite],['Race / nature réelle',p.race],['Statut de Vérité',p.statut_verite]].filter(([,value])=>value);
  const existingStats=main.querySelector('.pnj-mj .pnj-stat-columns')?.outerHTML||'';
  const truthHtml=(truth.length||existingStats)?`<details class="mj-block pnj-mj editor-pnj-mj"><summary>Dossier MJ · Vérité & statistiques</summary><div class="mj-inner">${truth.map(([key,value])=>`<div class="pnj-secret-line"><span>${esc(key)}</span><strong>${esc(value)}</strong></div>`).join('')}${existingStats}</div></details>`:'';
  return `<div class="editor-pnj-preview" data-editor-preview="pnj">${portrait}${factHtml}${relHtml}${truthHtml}</div>`;
}
function mediaPreviewHtml(article){
  const media=article.image??article.illustration;
  if(!media)return'';
  const src=typeof media==='string'?media:media.src;
  if(!src)return'';
  const alt=typeof media==='object'?(media.alt||article.title):article.title;
  const caption=typeof media==='object'?media.caption:'';
  return `<figure class="editor-media-preview" data-editor-preview="media"><img src="${esc(src)}" alt="${esc(alt)}">${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`;
}
function renderPreview(article,{draft,committed,conflicts}={}){
  clearPreview();
  const main=document.querySelector('#main');
  if(!main)return;
  const head=main.querySelector('.page-head');
  const title=head?.querySelector('h1');
  if(title){title.dataset.editorOriginalText=title.textContent||'';title.textContent=article.title||'';}
  if(head&&(draft||(!nativeCommitted()&&committed?.length)||conflicts?.length)){
    const badge=document.createElement('div');
    badge.className='editor-state-badge';
    badge.innerHTML=conflicts?.length?'<span class="badge obsolete">Override à revoir</span>':draft?'<span class="badge source">Brouillon local</span>':'<span class="badge canon">Override éditorial</span>';
    head.appendChild(badge);
  }
  const source=main.querySelector('.source-box');
  if(source){source.dataset.editorOriginalHtml=source.innerHTML;source.innerHTML=`<strong>Source :</strong> ${esc(article.source||'')}<br><span class="editor-preview-note">Vue avec corrections éditoriales appliquées.</span>`;}
  for(const node of main.querySelectorAll(':scope > .section, :scope > .mj-block:not(.pnj-mj)')){
    node.hidden=true;node.setAttribute('data-editor-hidden','1');
  }
  if(source){
    const wrapper=document.createElement('div');
    wrapper.dataset.editorPreview='sections';
    wrapper.innerHTML=(article.sections||[]).map(sectionPreview).join('');
    source.insertAdjacentElement('afterend',wrapper);
  }
  if(article.pnj){
    for(const node of main.querySelectorAll(':scope > .pnj-portrait, :scope > .pnj-facts, :scope > .pnj-relations, :scope > .pnj-mj')){
      node.hidden=true;node.setAttribute('data-editor-hidden','1');
    }
    head?.insertAdjacentHTML('afterend',pnjPreviewHtml(article,main));
  }else{
    for(const node of main.querySelectorAll(':scope > .article-media')){node.hidden=true;node.setAttribute('data-editor-hidden','1');}
    const html=mediaPreviewHtml(article);
    if(html)head?.insertAdjacentHTML('afterend',html);
  }
}
async function refreshPreview(){
  const id=currentArticleId();
  toggleEditButton(Boolean(id));
  if(!id){clearPreview();return;}
  const draft=getDraft(id);
  const manual=await loadManual();
  const hasCommitted=(manual.entries||[]).some(entry=>entry.articleId===id);
  if(!draft&&(nativeCommitted()||!hasCommitted)){clearPreview();return;}
  try{
    const data=await effectiveArticle(id);
    if(await waitForArticleDom(id))renderPreview(data.article,data);
  }catch(error){console.error('Impossible d’appliquer la prévisualisation éditoriale',error);}
}

function toggleEditButton(show){
  let button=document.querySelector('#tucEditPage');
  if(!button){
    button=document.createElement('button');
    button.id='tucEditPage';button.className='editor-floating-button';button.type='button';button.textContent='Éditer la page';
    button.addEventListener('click',()=>openEditor().catch(error=>alert(error.message)));
    document.body.appendChild(button);
  }
  button.hidden=!show;
}
function editorBlockHtml(block,index){
  if(block.type==='table'){
    const text=(block.rows||[]).map(row=>row.join('\t')).join('\n');
    return `<div class="editor-block" data-original-index="${index}" data-type="table"><div class="editor-block-head"><strong>Tableau</strong><button type="button" data-action="remove-block">Supprimer</button></div><textarea data-field="block-table" rows="5">${esc(text)}</textarea></div>`;
  }
  return `<div class="editor-block" data-original-index="${index}" data-type="p"><div class="editor-block-head"><strong>Paragraphe</strong><select data-field="block-style"><option value="">Normal</option><option value="list" ${(block.style||'').includes('list')?'selected':''}>Liste</option><option value="callout" ${(block.style||'').includes('callout')?'selected':''}>Encadré</option><option value="lore" ${(block.style||'').includes('lore')?'selected':''}>Lore</option></select><button type="button" data-action="remove-block">Supprimer</button></div><textarea data-field="block-text" rows="5">${esc(block.text||'')}</textarea></div>`;
}
function editorSectionHtml(section,index){
  return `<article class="editor-section" data-original-index="${index}"><div class="editor-row"><label>Titre<input data-field="section-title" value="${esc(section.title||'')}"></label><label>Niveau<select data-field="section-level">${[2,3,4,5].map(v=>`<option value="${v}" ${Number(section.level||3)===v?'selected':''}>H${v}</option>`).join('')}</select></label><label>Audience<select data-field="section-audience"><option value="">Public</option><option value="mj" ${section.audience==='mj'?'selected':''}>MJ</option></select></label><button type="button" class="editor-danger" data-action="remove-section">Supprimer section</button></div><div class="editor-blocks">${(section.blocks||[]).map((block,bIndex)=>editorBlockHtml(block,bIndex)).join('')}</div><button type="button" data-action="add-paragraph">+ Paragraphe</button></article>`;
}
function editorSectionsHtml(sections=[]){return sections.map((section,index)=>editorSectionHtml(section,index)).join('');}
function collectSections(dialog,originalSections){
  return [...dialog.querySelectorAll('.editor-section')].map((card,index)=>{
    const originalIndex=Number(card.dataset.originalIndex);
    const original=Number.isInteger(originalIndex)&&originalIndex>=0?originalSections[originalIndex]||{}:{};
    const originalBlocks=original.blocks||[];
    const blocks=[...card.querySelectorAll('.editor-block')].map(block=>{
      const blockIndex=Number(block.dataset.originalIndex);
      const old=Number.isInteger(blockIndex)&&blockIndex>=0?originalBlocks[blockIndex]||{}:{};
      if(block.dataset.type==='table')return {...old,type:'table',rows:block.querySelector('[data-field="block-table"]').value.split(/\r?\n/).filter(Boolean).map(line=>line.split('\t'))};
      const style=block.querySelector('[data-field="block-style"]').value;
      const next={...old,type:'p',text:block.querySelector('[data-field="block-text"]').value};
      if(style)next.style=style;else delete next.style;
      return next;
    });
    const audience=card.querySelector('[data-field="section-audience"]').value;
    const section={...original,id:original.id||`manual-${Date.now()}-${index+1}`,title:card.querySelector('[data-field="section-title"]').value.trim(),level:Number(card.querySelector('[data-field="section-level"]').value)||3,blocks};
    if(audience)section.audience=audience;else delete section.audience;
    return section;
  });
}
function pnjFieldsHtml(p={}){
  return `<fieldset class="editor-fieldset"><legend>Fiche structurée du personnage</legend><div class="editor-grid"><label>Âge<input name="pnj_age" value="${esc(p.age||'')}"></label><label>Origine<input name="pnj_origine" value="${esc(p.origine||'')}"></label><label>Statut<input name="pnj_statut" value="${esc(p.statut||'')}"></label><label>Nom / identité de Vérité<input name="pnj_nom_verite" value="${esc(p.nom_verite||'')}"></label><label>Race / nature réelle<input name="pnj_race" value="${esc(p.race||'')}"></label><label>Statut de Vérité<input name="pnj_statut_verite" value="${esc(p.statut_verite||'')}"></label><label class="wide">Relations — une par ligne<textarea name="pnj_relations" rows="4">${esc((p.relations||[]).join('\n'))}</textarea></label><label class="wide">Portrait — chemin ou URL<input name="pnj_portrait" value="${esc(p.portrait||'')}" placeholder="images/... ou https://..."></label><label>Texte alternatif<input name="pnj_portrait_alt" value="${esc(p.portrait_alt||'')}"></label><label>Légende<input name="pnj_portrait_caption" value="${esc(p.portrait_caption||'')}"></label></div></fieldset>`;
}
function mediaFieldsHtml(article){
  const current=article.image??article.illustration;
  const type=Object.prototype.hasOwnProperty.call(article,'illustration')?'illustration':'image';
  const src=typeof current==='string'?current:current?.src||'';
  const alt=typeof current==='object'?current?.alt||'':'';
  const caption=typeof current==='object'?current?.caption||'':'';
  return `<fieldset class="editor-fieldset"><legend>Média de la page</legend><div class="editor-grid"><label>Type<select name="media_type"><option value="image" ${type==='image'?'selected':''}>Image</option><option value="illustration" ${type==='illustration'?'selected':''}>Illustration</option></select></label><label class="wide">Chemin ou URL<input name="media_src" value="${esc(src)}" placeholder="images/... ou https://..."></label><label>Texte alternatif<input name="media_alt" value="${esc(alt)}"></label><label>Légende<input name="media_caption" value="${esc(caption)}"></label></div></fieldset>`;
}
function buildDialog(article,data){
  const dialog=document.createElement('dialog');
  dialog.className='editor-dialog';
  dialog.innerHTML=`<form method="dialog" class="editor-form"><header><div><div class="eyebrow">MODE ÉDITION · BROUILLON LOCAL</div><h2>${esc(article.title)}</h2></div><button value="cancel" class="editor-close" aria-label="Fermer">×</button></header>${data.conflicts.length?'<div class="editor-warning">La page source a changé depuis un override existant. Les corrections conflictuelles ne sont pas appliquées automatiquement.</div>':''}<div class="editor-grid"><label>Titre<input name="title" value="${esc(article.title||'')}"></label><label>Statut<select name="status">${['canon_recent','canon_enrichi','source_detaillee','obsolete'].map(v=>`<option value="${v}" ${article.status===v?'selected':''}>${v}</option>`).join('')}</select></label><label class="wide">Source<input name="source" value="${esc(article.source||'')}"></label><label class="wide">Tags<textarea name="tags" rows="2">${esc((article.tags||[]).join(', '))}</textarea></label><label class="wide">Note éditoriale<textarea name="note" rows="2">${esc(data.draft?.note||'')}</textarea></label></div>${article.pnj?pnjFieldsHtml(article.pnj):mediaFieldsHtml(article)}<div class="editor-section-toolbar"><h3>Sections</h3><button type="button" data-action="add-section">+ Ajouter une section</button></div><div class="editor-sections">${editorSectionsHtml(article.sections||[])}</div><footer><button type="button" data-action="discard" class="editor-danger">Supprimer le brouillon</button><span class="editor-spacer"></span><button type="button" data-action="copy">Copier l’override JSON</button><button type="button" data-action="save" class="editor-primary">Enregistrer le brouillon</button></footer></form>`;
  document.body.appendChild(dialog);
  dialog.addEventListener('click',event=>{
    const action=event.target.closest('[data-action]')?.dataset.action;if(!action)return;
    if(action==='remove-section')event.target.closest('.editor-section')?.remove();
    if(action==='remove-block')event.target.closest('.editor-block')?.remove();
    if(action==='add-paragraph'){
      const container=event.target.closest('.editor-section').querySelector('.editor-blocks');
      container.insertAdjacentHTML('beforeend',editorBlockHtml({type:'p',text:''},-1));
    }
    if(action==='add-section'){
      const container=dialog.querySelector('.editor-sections');
      container.insertAdjacentHTML('beforeend',editorSectionHtml({id:`manual-${Date.now()}`,title:'Nouvelle section',level:3,blocks:[{type:'p',text:''}]},-1));
    }
  });
  return dialog;
}
function editedFromDialog(dialog,article){
  const edited=deepClone(article),form=dialog.querySelector('.editor-form');
  edited.title=form.elements.title.value.trim()||article.title;
  edited.status=form.elements.status.value;
  edited.source=form.elements.source.value.trim();
  edited.tags=form.elements.tags.value.split(',').map(x=>x.trim()).filter(Boolean);
  edited.sections=collectSections(dialog,article.sections||[]);
  if(edited.pnj){
    const p={...edited.pnj};
    setOptional(p,'age',form.elements.pnj_age.value);
    setOptional(p,'origine',form.elements.pnj_origine.value);
    setOptional(p,'statut',form.elements.pnj_statut.value);
    setOptional(p,'nom_verite',form.elements.pnj_nom_verite.value);
    setOptional(p,'race',form.elements.pnj_race.value);
    setOptional(p,'statut_verite',form.elements.pnj_statut_verite.value);
    const relations=cleanLines(form.elements.pnj_relations.value);
    if(relations.length)p.relations=relations;else delete p.relations;
    setOptional(p,'portrait',form.elements.pnj_portrait.value);
    setOptional(p,'portrait_alt',form.elements.pnj_portrait_alt.value);
    setOptional(p,'portrait_caption',form.elements.pnj_portrait_caption.value);
    edited.pnj=p;
  }else{
    delete edited.image;delete edited.illustration;
    const src=form.elements.media_src.value.trim();
    if(src){
      const type=form.elements.media_type.value==='illustration'?'illustration':'image';
      const alt=form.elements.media_alt.value.trim();
      const caption=form.elements.media_caption.value.trim();
      edited[type]=alt||caption?{src,...(alt?{alt}:{}),...(caption?{caption}:{})}:src;
    }
  }
  return edited;
}
async function overrideEntryFromDialog(dialog,data){
  const edited=editedFromDialog(dialog,data.article);
  return {articleId:data.raw.id,baseHash:data.baseHash,updatedAt:new Date().toISOString(),note:dialog.querySelector('[name="note"]').value.trim(),operations:buildArticleOperations(data.raw,edited)};
}
async function copyOverride(entry){
  const payload={version:EDITOR_VERSION,updated:new Date().toISOString().slice(0,10),entries:[entry]};
  await navigator.clipboard.writeText(JSON.stringify(payload,null,2));
}
async function openEditor(){
  const id=currentArticleId();if(!id)return;
  const data=await effectiveArticle(id),dialog=buildDialog(data.article,data);
  dialog.querySelector('[data-action="save"]').addEventListener('click',async()=>{
    const entry=await overrideEntryFromDialog(dialog,data);
    if(!entry.operations.length)removeDraft(id);else saveDraft(entry);
    dialog.close();dialog.remove();await refreshPreview();
  });
  dialog.querySelector('[data-action="discard"]').addEventListener('click',async()=>{removeDraft(id);dialog.close();dialog.remove();await refreshPreview();});
  dialog.querySelector('[data-action="copy"]').addEventListener('click',async event=>{
    const entry=await overrideEntryFromDialog(dialog,data);await copyOverride(entry);
    event.target.textContent='Copié ✓';setTimeout(()=>event.target.textContent='Copier l’override JSON',1200);
  });
  dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  dialog.showModal();
}

window.addEventListener('hashchange',()=>setTimeout(refreshPreview,0));
window.addEventListener('tuc:editor-refresh',refreshPreview);
toggleEditButton(Boolean(currentArticleId()));
setTimeout(refreshPreview,250);
