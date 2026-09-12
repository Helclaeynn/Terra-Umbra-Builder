const INLINE_MEDIA_TOKEN='@@TUC_INLINE_MEDIA_V1@@';

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

function readInlineMeta(text){
  const value=String(text||'').trim();
  if(!value.startsWith(INLINE_MEDIA_TOKEN))return {};
  try{return JSON.parse(value.slice(INLINE_MEDIA_TOKEN.length))||{};}catch{return {};}
}

function syncInlineMediaFields(block,changedField){
  if(!(block instanceof Element)||!block.matches('[data-inline-media-editor="1"]'))return;
  const hidden=block.querySelector('[data-field="block-text"]');
  if(!hidden)return;
  const previous=readInlineMeta(hidden.value);
  const kind=block.querySelector('[data-inline-media-kind]')?.value==='portrait'?'portrait':'image';
  const src=block.querySelector('[data-inline-media-src]')?.value.trim()||'';
  const alt=block.querySelector('[data-inline-media-alt]')?.value.trim()||'';
  const caption=block.querySelector('[data-inline-media-caption]')?.value.trim()||'';
  const slot=String(previous.slot||block.dataset.inlineMediaSlot||'');
  hidden.value=INLINE_MEDIA_TOKEN+JSON.stringify({kind,src,alt,caption,slot});

  const head=block.querySelector('.editor-block-head strong');
  if(head)head.textContent=kind==='portrait'?'Portrait':'Image';
  const figure=block.querySelector('.editor-inline-media-preview .content-inline-media');
  if(figure){
    figure.classList.toggle('portrait',kind==='portrait');
    figure.classList.toggle('image',kind!=='portrait');
    const img=figure.querySelector('img');
    if(img){
      img.alt=alt;
      if(changedField?.matches('[data-inline-media-src]')&&src)img.src=src;
    }
    let figcaption=figure.querySelector('figcaption');
    if(caption){
      if(!figcaption){figcaption=document.createElement('figcaption');figure.appendChild(figcaption);}
      figcaption.textContent=caption;
    }else figcaption?.remove();
  }
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

document.addEventListener('input',event=>{
  if(!event.target.closest?.('.editor-inline-media-fields'))return;
  syncInlineMediaFields(event.target.closest('.editor-block'),event.target);
});
document.addEventListener('change',event=>{
  if(!event.target.closest?.('.editor-inline-media-fields'))return;
  syncInlineMediaFields(event.target.closest('.editor-block'),event.target);
});
