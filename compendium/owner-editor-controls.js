const isArticle=()=>location.hash.slice(1).startsWith('/article/');
const authorized=()=>Boolean(window.__TUC_EDITOR_AUTHORIZED__)||document.body.classList.contains('tuc-editor-authorized');

function syncOwnerControls(){
  const ok=authorized();
  const edit=document.querySelector('#tucEditPage');
  const drafts=document.querySelector('#tucDraftsButton');
  if(edit)edit.hidden=!(ok&&isArticle());
  if(drafts)drafts.hidden=!ok;
}

window.addEventListener('tuc:github-auth-changed',()=>{
  window.dispatchEvent(new CustomEvent('tuc:editor-refresh'));
  queueMicrotask(syncOwnerControls);
  setTimeout(syncOwnerControls,50);
});
window.addEventListener('hashchange',()=>setTimeout(syncOwnerControls,0));
window.addEventListener('tuc:drafts-changed',syncOwnerControls);

const observer=new MutationObserver(syncOwnerControls);
observer.observe(document.body,{childList:true,subtree:true});
setTimeout(syncOwnerControls,0);
