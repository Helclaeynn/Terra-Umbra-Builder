function hasDraftCard(node){
  if(!(node instanceof Element))return false;
  return node.matches?.('.editor-draft-card')||Boolean(node.querySelector?.('.editor-draft-card'));
}

const observer=new MutationObserver(records=>{
  for(const record of records){
    for(const node of record.addedNodes){
      if(hasDraftCard(node)){
        queueMicrotask(()=>window.dispatchEvent(new CustomEvent('tuc:github-auth-changed',{detail:{status:'authorized-refresh'}})));
        return;
      }
    }
  }
});

observer.observe(document.body,{childList:true,subtree:true});
