function ensureInlineMediaSelector(section){
  if(!(section instanceof Element)||!section.matches('.editor-section'))return;
  const button=section.querySelector(':scope > [data-action="add-paragraph"]');
  if(!button||button.dataset.inlineMediaAddEnhanced)return;
  button.dataset.inlineMediaAddEnhanced='1';
  const select=document.createElement('select');
  select.className='editor-inline-add-type';
  select.dataset.inlineAddType='1';
  select.setAttribute('aria-label','Type de bloc à ajouter');
  select.innerHTML='<option value="text">Texte</option><option value="image">Image</option><option value="portrait">Portrait</option>';
  button.insertAdjacentElement('beforebegin',select);
}

function enhance(root){
  if(root.matches?.('.editor-section'))ensureInlineMediaSelector(root);
  root.querySelectorAll?.('.editor-section').forEach(ensureInlineMediaSelector);
}

const observer=new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes){
    if(node instanceof Element)enhance(node);
  }
});
observer.observe(document.body,{childList:true,subtree:true});
enhance(document);
