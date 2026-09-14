import {openLoreEditor} from './lore-preview-editor-dialog.js';
import {revokeAllMediaUrls} from './lore-preview-media.js';
import {applyDraft,normalizeDraft,pageIdentity,pageRoot} from './lore-preview-editor-view.js';

(()=>{
  const STORAGE_KEY='tuc-lore-preview-drafts-v1',frame=document.querySelector('#previewFrame');if(!frame)return;
  const readDrafts=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};}catch{return {};}};
  const writeDrafts=value=>localStorage.setItem(STORAGE_KEY,JSON.stringify(value));
  let activePageKey='';
  const editButton=document.createElement('button');editButton.id='tucEditPage';editButton.className='editor-floating-button';editButton.type='button';editButton.textContent='Éditer la page';editButton.hidden=true;document.body.appendChild(editButton);

  function current(){
    try{const doc=frame.contentDocument;if(!doc||!pageRoot(doc))return null;const key=pageIdentity(frame,doc);activePageKey=key;return {doc,key,draft:normalizeDraft(readDrafts()[key]||null)};}catch{return null;}
  }
  function refresh(){const state=current();editButton.hidden=!state;if(state)applyDraft(state.doc,state.draft);}
  editButton.addEventListener('click',()=>{const state=current();if(state)openLoreEditor({state,readDrafts,writeDrafts,refresh});});
  function attachFrameEvents(){
    try{
      frame.contentWindow?.addEventListener('hashchange',()=>setTimeout(refresh,0));
      const observer=new MutationObserver(()=>{const next=current();if(next&&next.key!==activePageKey)setTimeout(refresh,0);});observer.observe(frame.contentDocument.body,{childList:true,subtree:true});
    }catch(_e){}
    setTimeout(refresh,0);
  }
  frame.addEventListener('load',attachFrameEvents);if(frame.contentDocument?.readyState==='complete')attachFrameEvents();window.addEventListener('beforeunload',revokeAllMediaUrls);
})();
