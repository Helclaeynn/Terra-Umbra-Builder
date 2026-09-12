import {getMediaDraft} from './editor/media-draft-store.js';

function mediaBlocks(root=document){
  const blocks=[];
  if(root.matches?.('.editor-block[data-inline-media-editor="1"]'))blocks.push(root);
  root.querySelectorAll?.('.editor-block[data-inline-media-editor="1"]').forEach(block=>blocks.push(block));
  return blocks;
}

async function refreshPcPicker(block){
  if(!(block instanceof Element))return;
  const panel=block.querySelector('[data-inline-media-pc-picker]');
  const pathInput=block.querySelector('[data-inline-media-src]');
  const button=block.querySelector('[data-inline-media-pick]');
  const filename=block.querySelector('[data-inline-media-pc-file]');
  if(!panel||!pathInput||!button||!filename)return;

  const path=pathInput.value.trim();
  let draft=null;
  try{if(path.startsWith('images/'))draft=await getMediaDraft(path);}catch{}
  const fallback=path?path.split('/').pop()||path:'';
  const displayName=draft?.originalName||fallback;
  const buttonText=path?'Remplacer l’image depuis le PC':'Sélectionner une image depuis le PC';
  const fileText=displayName
    ? `${draft?.originalName?'Fichier sélectionné':'Image actuelle'} : ${displayName}`
    : 'Aucun fichier sélectionné';

  panel.classList.toggle('has-file',Boolean(path));
  if(button.textContent!==buttonText)button.textContent=buttonText;
  if(filename.textContent!==fileText)filename.textContent=fileText;
}

function enhancePcPicker(block){
  if(!(block instanceof Element)||block.dataset.inlineMediaPcPicker)return;
  const fields=block.querySelector('.editor-inline-media-fields');
  const pathInput=block.querySelector('[data-inline-media-src]');
  const button=block.querySelector('[data-inline-media-pick]');
  const fileInput=block.querySelector('[data-inline-media-file]');
  const status=block.querySelector('[data-inline-media-status]');
  if(!fields||!pathInput||!button||!fileInput)return;

  block.dataset.inlineMediaPcPicker='1';
  const pathLabel=pathInput.closest('label');
  if(pathLabel){pathLabel.hidden=true;pathLabel.classList.add('editor-inline-media-tech-path');}

  const panel=document.createElement('div');
  panel.className='editor-inline-media-pc-picker';
  panel.dataset.inlineMediaPcPicker='1';
  panel.tabIndex=0;
  panel.setAttribute('role','group');
  panel.setAttribute('aria-label','Sélection d’une image depuis le PC');
  panel.innerHTML='<div class="editor-inline-media-pc-copy"><strong>Image locale</strong><span data-inline-media-pc-file>Aucun fichier sélectionné</span></div><div class="editor-inline-media-pc-controls"></div>';

  const controls=panel.querySelector('.editor-inline-media-pc-controls');
  controls.append(button,fileInput);
  if(status)controls.append(status);
  fields.prepend(panel);

  const oldActions=fields.querySelector('.editor-inline-media-actions');
  if(oldActions&&!oldActions.children.length)oldActions.remove();

  panel.addEventListener('click',event=>{
    if(event.target.closest('button'))return;
    button.click();
  });
  panel.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    event.preventDefault();button.click();
  });

  fileInput.addEventListener('change',()=>{
    const previous=pathInput.value;
    let attempts=0;
    const waitForPipeline=()=>{
      attempts+=1;
      const ready=pathInput.value!==previous||String(status?.textContent||'').includes('WebP local prêt');
      if(ready||attempts>80){refreshPcPicker(block).catch(console.error);return;}
      setTimeout(waitForPipeline,100);
    };
    setTimeout(waitForPipeline,0);
  });

  refreshPcPicker(block).catch(console.error);
}

function enhance(root=document){for(const block of mediaBlocks(root))enhancePcPicker(block);}

const observer=new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes){if(node instanceof Element)enhance(node);}
});
observer.observe(document.body,{childList:true,subtree:true});
enhance();
