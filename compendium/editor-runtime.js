import {applyOverrideEntries,applyOperations,buildArticleOperations,deepClone} from './editor/override-engine.js';

const DRAFT_KEY='tuc-compendium-drafts-v1';
const EDITOR_VERSION=1;
const state={manual:null,manifest:null,rawArticles:null};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

const currentArticleId=()=>{
  const raw=location.hash.slice(1);
  if(!raw.startsWith('/article/'))return null;
  return decodeURIComponent(raw.slice(9).split('@',1)[0]);
};
function readDrafts(){try{return JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}')||{};}catch{return {};}}
function writeDrafts(drafts){localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts));}
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
async function loadManifest(){
  if(state.manifest)return state.manifest;
  const response=await fetch('data/manifest-v3.json',{cache:'no-cache'});
  if(!response.ok)throw new Error(`manifest-v3.json · HTTP ${response.status}`);
  state.manifest=await response.json();
  return state.manifest;
}
async function loadDataset(spec){
  const texts=await Promise.all(Array.from({length:spec.parts},async(_,index)=>{
    const file=`${spec.prefix}-${String(index).padStart(2,'0')}.b64part`;
    const response=await fetch(`data/${file}`,{cache:'force-cache'});
    if(!response.ok)throw new Error(`${file} · HTTP ${response.status}`);
    return response.text();
  }));
  const bin=atob(texts.join('').replace(/\s+/g,''));
  const bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  if(!('DecompressionStream' in window))throw new Error('Décompression gzip indisponible dans ce navigateur.');
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
}
async function loadRawArticles(){
  if(state.rawArticles)return state.rawArticles;
  const manifest=await loadManifest();
  const map=new Map();
  for(const spec of manifest.datasets){
    const rows=await loadDataset(spec);
    for(const article of rows)if(article?.id)map.set(article.id,deepClone(article));
  }
  state.rawArticles=map;
  return map;
}
async function effectiveArticle(id){
  const raw=(await loadRawArticles()).get(id);
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
  document.querySelectorAll('.editor-state-badge').forEach(node=>node.remove());
}
function blockPreview(block){
  if(block.type==='table'){
    const rows=(block.rows||[]).map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('');
    return `<div class="doc-table-wrap"><table class="doc-table"><tbody>${rows}</tbody></table></div>`;
  }
  return `<p class="body-p ${esc(block.style||'')}">${esc(block.text||'').replace(/\n/g,'<br>')}</p>`;
}
function sectionPreview(section){
  const level=Math.min(5,Math.max(2,Number(section.level)||3));
  const content=(section.blocks||[]).map(blockPreview).join('');
  const inner=`<section class="section" id="${esc(section.id||'')}"><h${level}>${esc(section.title||'')}</h${level}>${content}</section>`;
  return section.audience==='mj'?`<details class="mj-block"><summary>${esc(section.title||'Section MJ')}</summary><div class="mj-inner">${inner}</div></details>`:inner;
}
function renderPreview(article,{draft,committed,conflicts}={}){
  clearPreview();
  const main=document.querySelector('#main');
  if(!main)return;
  const head=main.querySelector('.page-head');
  const title=head?.querySelector('h1');
  if(title)title.textContent=article.title||'';
  if(head&&(draft||committed?.length||conflicts?.length)){
    const badge=document.createElement('div');
    badge.className='editor-state-badge';
    badge.innerHTML=conflicts?.length?'<span class="badge obsolete">Override à revoir</span>':draft?'<span class="badge source">Brouillon local</span>':'<span class="badge canon">Override éditorial</span>';
    head.appendChild(badge);
  }
  const source=main.querySelector('.source-box');
  if(source)source.innerHTML=`<strong>Source :</strong> ${esc(article.source||'')}<br><span class="editor-preview-note">Vue avec corrections éditoriales appliquées.</span>`;
  for(const node of main.querySelectorAll(':scope > .section, :scope > .mj-block:not(.pnj-mj)')){
    node.hidden=true;node.setAttribute('data-editor-hidden','1');
  }
  if(source){
    const wrapper=document.createElement('div');
    wrapper.dataset.editorPreview='sections';
    wrapper.innerHTML=(article.sections||[]).map(sectionPreview).join('');
    source.insertAdjacentElement('afterend',wrapper);
  }
  const portrait=article.pnj?.portrait;
  const oldPortrait=main.querySelector('.pnj-portrait');
  if(article.pnj){
    if(portrait){
      const html=`<div class="pnj-portrait" data-editor-preview="portrait"><img src="${esc(portrait)}" alt="Portrait de ${esc(article.title)}"></div>`;
      if(oldPortrait){oldPortrait.hidden=true;oldPortrait.setAttribute('data-editor-hidden','1');oldPortrait.insertAdjacentHTML('afterend',html);}
      else head?.insertAdjacentHTML('afterend',html);
    }else if(oldPortrait){oldPortrait.hidden=true;oldPortrait.setAttribute('data-editor-hidden','1');}
  }else{
    const media=article.image??article.illustration;
    if(media){
      const src=typeof media==='string'?media:media.src;
      const caption=typeof media==='object'?media.caption:'';
      if(src)head?.insertAdjacentHTML('afterend',`<figure class="editor-media-preview" data-editor-preview="media"><img src="${esc(src)}" alt="${esc(article.title)}">${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`);
    }
  }
}
async function refreshPreview(){
  const id=currentArticleId();
  toggleEditButton(Boolean(id));
  if(!id){clearPreview();return;}
  const manual=await loadManual();
  if(!getDraft(id)&&!(manual.entries||[]).some(entry=>entry.articleId===id)){clearPreview();return;}
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
    return `<div class="editor-block" data-block="${index}" data-type="table"><div class="editor-block-head"><strong>Tableau</strong><button type="button" data-action="remove-block">Supprimer</button></div><textarea data-field="block-table" rows="5">${esc(text)}</textarea></div>`;
  }
  return `<div class="editor-block" data-block="${index}" data-type="p"><div class="editor-block-head"><strong>Paragraphe</strong><select data-field="block-style"><option value="">Normal</option><option value="list" ${(block.style||'').includes('list')?'selected':''}>Liste</option><option value="callout" ${(block.style||'').includes('callout')?'selected':''}>Encadré</option><option value="lore" ${(block.style||'').includes('lore')?'selected':''}>Lore</option></select><button type="button" data-action="remove-block">Supprimer</button></div><textarea data-field="block-text" rows="5">${esc(block.text||'')}</textarea></div>`;
}
function editorSectionsHtml(sections=[]){
  return sections.map((section,index)=>`<article class="editor-section" data-section="${index}"><div class="editor-row"><label>Titre<input data-field="section-title" value="${esc(section.title||'')}"></label><label>Niveau<select data-field="section-level">${[2,3,4,5].map(v=>`<option value="${v}" ${Number(section.level||3)===v?'selected':''}>H${v}</option>`).join('')}</select></label><label>Audience<select data-field="section-audience"><option value="">Public</option><option value="mj" ${section.audience==='mj'?'selected':''}>MJ</option></select></label><button type="button" class="editor-danger" data-action="remove-section">Supprimer section</button></div><div class="editor-blocks">${(section.blocks||[]).map((block,bIndex)=>editorBlockHtml(block,bIndex)).join('')}</div><button type="button" data-action="add-paragraph">+ Paragraphe</button></article>`).join('');
}
function collectSections(dialog,originalSections){
  return [...dialog.querySelectorAll('.editor-section')].map((card,index)=>{
    const original=originalSections[index]||{};
    const blocks=[...card.querySelectorAll('.editor-block')].map(block=>{
      if(block.dataset.type==='table')return {type:'table',rows:block.querySelector('[data-field="block-table"]').value.split(/\r?\n/).filter(Boolean).map(line=>line.split('\t'))};
      const style=block.querySelector('[data-field="block-style"]').value;
      return {type:'p',text:block.querySelector('[data-field="block-text"]').value,...(style?{style}:{})};
    });
    const audience=card.querySelector('[data-field="section-audience"]').value;
    const section={...original,id:original.id||`manual-${Date.now()}-${index+1}`,title:card.querySelector('[data-field="section-title"]').value.trim(),level:Number(card.querySelector('[data-field="section-level"]').value)||3,blocks};
    if(audience)section.audience=audience;else delete section.audience;
    return section;
  });
}
function buildDialog(article,data){
  const dialog=document.createElement('dialog');
  dialog.className='editor-dialog';
  const mediaValue=article.pnj?.portrait??(typeof article.image==='string'?article.image:article.image?.src)??(typeof article.illustration==='string'?article.illustration:article.illustration?.src)??'';
  dialog.innerHTML=`<form method="dialog" class="editor-form"><header><div><div class="eyebrow">MODE ÉDITION · BROUILLON LOCAL</div><h2>${esc(article.title)}</h2></div><button value="cancel" class="editor-close" aria-label="Fermer">×</button></header>${data.conflicts.length?'<div class="editor-warning">La page source a changé depuis un override existant. Les corrections conflictuelles ne sont pas appliquées automatiquement.</div>':''}<div class="editor-grid"><label>Titre<input name="title" value="${esc(article.title||'')}"></label><label>Statut<select name="status">${['canon_recent','canon_enrichi','source_detaillee','obsolete'].map(v=>`<option value="${v}" ${article.status===v?'selected':''}>${v}</option>`).join('')}</select></label><label class="wide">Source<input name="source" value="${esc(article.source||'')}"></label><label class="wide">Tags<textarea name="tags" rows="2">${esc((article.tags||[]).join(', '))}</textarea></label><label class="wide">${article.pnj?'Portrait':'Image / illustration'} — chemin ou URL<input name="media" value="${esc(mediaValue)}" placeholder="images/... ou https://..."></label><label class="wide">Note éditoriale<textarea name="note" rows="2">${esc(data.draft?.note||'')}</textarea></label></div><div class="editor-section-toolbar"><h3>Sections</h3><button type="button" data-action="add-section">+ Ajouter une section</button></div><div class="editor-sections">${editorSectionsHtml(article.sections||[])}</div><footer><button type="button" data-action="discard" class="editor-danger">Supprimer le brouillon</button><span class="editor-spacer"></span><button type="button" data-action="copy">Copier l’override JSON</button><button type="button" data-action="save" class="editor-primary">Enregistrer le brouillon</button></footer></form>`;
  document.body.appendChild(dialog);
  dialog.addEventListener('click',event=>{
    const action=event.target.closest('[data-action]')?.dataset.action;if(!action)return;
    if(action==='remove-section')event.target.closest('.editor-section')?.remove();
    if(action==='remove-block')event.target.closest('.editor-block')?.remove();
    if(action==='add-paragraph'){
      const container=event.target.closest('.editor-section').querySelector('.editor-blocks');
      container.insertAdjacentHTML('beforeend',editorBlockHtml({type:'p',text:''},container.children.length));
    }
    if(action==='add-section'){
      const container=dialog.querySelector('.editor-sections');
      container.insertAdjacentHTML('beforeend',editorSectionsHtml([{id:`manual-${Date.now()}`,title:'Nouvelle section',level:3,blocks:[{type:'p',text:''}]}]));
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
  const media=form.elements.media.value.trim();
  if(edited.pnj){if(media)edited.pnj={...edited.pnj,portrait:media};else delete edited.pnj.portrait;}
  else if(media)edited.image=media;else{delete edited.image;delete edited.illustration;}
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
