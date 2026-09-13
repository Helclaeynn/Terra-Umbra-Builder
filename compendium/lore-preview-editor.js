(()=>{
  const STORAGE_KEY='tuc-lore-preview-drafts-v1';
  const frame=document.querySelector('#previewFrame');
  if(!frame)return;
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const readDrafts=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};}catch{return {};}};
  const writeDrafts=value=>localStorage.setItem(STORAGE_KEY,JSON.stringify(value));
  let activePageKey='';

  function pageIdentity(doc){
    const url=new URL(frame.src||'',location.href);
    const docId=url.pathname.split('/').pop()?.replace(/-preview\.html$/,'')||'lore';
    const hash=doc.defaultView?.location?.hash||'';
    const route=decodeURIComponent(hash.replace(/^#\/?/,''))||doc.querySelector('#content h1,.content h1')?.textContent?.trim()||'page';
    return `${docId}::${route}`;
  }
  function pageRoot(doc){return doc.querySelector('#content,.content')||doc.body;}
  function sourceSections(root){
    const sections=[...root.querySelectorAll('.preview-section,.section')].filter(section=>!section.closest('[data-lore-editor-preview]'));
    return sections.map((section,index)=>({
      index,
      title:section.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > h5')?.textContent?.trim()||'',
      paragraphs:[...section.querySelectorAll(':scope > .body-p,:scope > p.body-p')].map(p=>p.textContent??'')
    }));
  }
  function snapshot(doc){
    const root=pageRoot(doc);
    return {
      title:root.querySelector('.page-head h1,.preview-hero h1,h1')?.textContent?.trim()||'',
      sections:sourceSections(root)
    };
  }
  function clearApplied(doc){
    doc.querySelectorAll('[data-lore-editor-original]').forEach(node=>{
      const value=node.getAttribute('data-lore-editor-original')||'';
      node.textContent=value;
      node.removeAttribute('data-lore-editor-original');
    });
    doc.querySelectorAll('.editor-state-badge[data-lore-editor-preview]').forEach(node=>node.remove());
  }
  function setText(node,value){
    if(!node)return;
    if(!node.hasAttribute('data-lore-editor-original'))node.setAttribute('data-lore-editor-original',node.textContent??'');
    node.textContent=value??'';
  }
  function applyDraft(doc,draft){
    clearApplied(doc);
    if(!draft)return;
    const root=pageRoot(doc);
    setText(root.querySelector('.page-head h1,.preview-hero h1,h1'),draft.title);
    const sections=[...root.querySelectorAll('.preview-section,.section')].filter(section=>!section.closest('[data-lore-editor-preview]'));
    draft.sections?.forEach((saved,index)=>{
      const section=sections[index]; if(!section)return;
      setText(section.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > h5'),saved.title);
      const ps=[...section.querySelectorAll(':scope > .body-p,:scope > p.body-p')];
      saved.paragraphs?.forEach((text,pIndex)=>setText(ps[pIndex],text));
    });
    const head=root.querySelector('.page-head,.preview-hero');
    if(head){
      const badge=doc.createElement('div');
      badge.className='editor-state-badge';badge.dataset.loreEditorPreview='1';
      badge.innerHTML='<span class="badge source">Brouillon local</span>';
      head.appendChild(badge);
    }
  }
  function current(){
    try{
      const doc=frame.contentDocument;
      if(!doc||!pageRoot(doc))return null;
      const key=pageIdentity(doc);activePageKey=key;
      return {doc,key,draft:readDrafts()[key]||null};
    }catch{return null;}
  }
  function refresh(){
    const state=current();
    editButton.hidden=!state;
    if(state)applyDraft(state.doc,state.draft);
  }

  const editButton=document.createElement('button');
  editButton.id='tucEditPage';editButton.className='editor-floating-button';editButton.type='button';editButton.textContent='Éditer la page';editButton.hidden=true;
  document.body.appendChild(editButton);

  function sectionEditor(section,index){
    return `<article class="editor-section" data-section-index="${index}"><div class="editor-row"><label>Titre de section<input data-field="section-title" value="${esc(section.title)}"></label></div><div class="editor-blocks">${section.paragraphs.map((text,pIndex)=>`<div class="editor-block" data-paragraph-index="${pIndex}"><div class="editor-block-head"><strong>Paragraphe ${pIndex+1}</strong></div><textarea data-field="paragraph" rows="6">${esc(text)}</textarea></div>`).join('')}</div></article>`;
  }
  function openEditor(){
    const state=current();if(!state)return;
    const base=state.draft||snapshot(state.doc);
    const dialog=document.createElement('dialog');dialog.className='editor-dialog';
    dialog.innerHTML=`<form method="dialog" class="editor-form"><header><div><div class="eyebrow">PREVIEW LORE · BROUILLON LOCAL</div><h2>Éditer la page</h2></div><button class="editor-close" type="button" aria-label="Fermer">×</button></header><div class="editor-grid"><label class="wide">Titre de la page<input name="title" value="${esc(base.title)}"></label></div><div class="editor-warning">Les modifications restent locales à ce navigateur. Elles n’altèrent ni le document source ni le corpus Git tant qu’elles ne sont pas reprises dans un commit.</div><div class="editor-section-toolbar"><strong>Contenu affiché</strong><span>${base.sections?.length||0} section(s)</span></div><div class="editor-sections">${(base.sections||[]).map(sectionEditor).join('')}</div><footer><button type="button" data-action="reset" class="editor-danger">Réinitialiser</button><span class="editor-spacer"></span><button type="button" data-action="cancel">Annuler</button><button type="submit" class="editor-primary">Enregistrer le brouillon</button></footer></form>`;
    document.body.appendChild(dialog);
    const close=()=>{dialog.close();dialog.remove();};
    dialog.querySelector('.editor-close').addEventListener('click',close);
    dialog.querySelector('[data-action="cancel"]').addEventListener('click',close);
    dialog.querySelector('[data-action="reset"]').addEventListener('click',()=>{
      const drafts=readDrafts();delete drafts[state.key];writeDrafts(drafts);clearApplied(state.doc);close();refresh();
    });
    dialog.querySelector('form').addEventListener('submit',event=>{
      event.preventDefault();
      const sections=[...dialog.querySelectorAll('.editor-section')].map(card=>({
        title:card.querySelector('[data-field="section-title"]').value,
        paragraphs:[...card.querySelectorAll('[data-field="paragraph"]')].map(area=>area.value)
      }));
      const drafts=readDrafts();drafts[state.key]={version:1,pageKey:state.key,title:dialog.querySelector('[name="title"]').value,sections,updatedAt:new Date().toISOString()};writeDrafts(drafts);close();refresh();
    });
    dialog.showModal();
  }
  editButton.addEventListener('click',openEditor);

  function attachFrameEvents(){
    try{
      frame.contentWindow?.addEventListener('hashchange',()=>setTimeout(refresh,0));
      const observer=new MutationObserver(()=>{
        const next=current();
        if(next&&next.key!==activePageKey)setTimeout(refresh,0);
      });
      observer.observe(frame.contentDocument.body,{childList:true,subtree:true});
    }catch(_e){}
    setTimeout(refresh,0);
  }
  frame.addEventListener('load',attachFrameEvents);
  if(frame.contentDocument?.readyState==='complete')attachFrameEvents();
})();
