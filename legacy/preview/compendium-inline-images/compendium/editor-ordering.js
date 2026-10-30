const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function move(node,direction){
  if(!node)return;
  if(direction==='up'){
    const previous=node.previousElementSibling;
    if(previous)node.parentElement.insertBefore(node,previous);
    return;
  }
  const next=node.nextElementSibling;
  if(next)node.parentElement.insertBefore(next,node);
}
function orderingButtons(kind){
  const group=document.createElement('span');
  group.className='editor-order-controls';
  group.innerHTML=`<button type="button" title="Monter" aria-label="Monter" data-order-kind="${kind}" data-order-direction="up">↑</button><button type="button" title="Descendre" aria-label="Descendre" data-order-kind="${kind}" data-order-direction="down">↓</button>`;
  return group;
}
function enhanceBlock(block){
  if(block.dataset.orderingEnhanced)return;
  block.dataset.orderingEnhanced='1';
  const head=block.querySelector(':scope > .editor-block-head');
  if(!head)return;
  const remove=head.querySelector('[data-action="remove-block"]');
  const controls=orderingButtons('block');
  if(remove)head.insertBefore(controls,remove);else head.appendChild(controls);
}
function addTableButton(section){
  if(section.querySelector(':scope > [data-editor-add-table]'))return;
  const paragraphButton=section.querySelector(':scope > [data-action="add-paragraph"]');
  if(!paragraphButton)return;
  const button=document.createElement('button');
  button.type='button';button.dataset.editorAddTable='1';button.textContent='+ Tableau';
  paragraphButton.insertAdjacentElement('afterend',button);
}
function enhanceSection(section){
  if(!section.dataset.orderingEnhanced){
    section.dataset.orderingEnhanced='1';
    const row=section.querySelector(':scope > .editor-row');
    const remove=row?.querySelector('[data-action="remove-section"]');
    const controls=orderingButtons('section');
    if(row){if(remove)row.insertBefore(controls,remove);else row.appendChild(controls);}
  }
  section.querySelectorAll(':scope > .editor-blocks > .editor-block').forEach(enhanceBlock);
  addTableButton(section);
}
function enhanceDialog(dialog){
  dialog.querySelectorAll('.editor-section').forEach(enhanceSection);
}
function createTableBlock(){
  const block=document.createElement('div');
  block.className='editor-block';block.dataset.originalIndex='-1';block.dataset.type='table';
  block.innerHTML=`<div class="editor-block-head"><strong>Tableau</strong><button type="button" data-action="remove-block">Supprimer</button></div><textarea data-field="block-table" rows="5" placeholder="Colonne 1\tColonne 2\nValeur 1\tValeur 2">${esc('')}</textarea>`;
  return block;
}

document.addEventListener('click',event=>{
  const orderButton=event.target.closest('[data-order-kind][data-order-direction]');
  if(orderButton){
    event.preventDefault();event.stopPropagation();
    const kind=orderButton.dataset.orderKind,direction=orderButton.dataset.orderDirection;
    move(orderButton.closest(kind==='section'?'.editor-section':'.editor-block'),direction);
    return;
  }
  const tableButton=event.target.closest('[data-editor-add-table]');
  if(tableButton){
    event.preventDefault();event.stopPropagation();
    const blocks=tableButton.closest('.editor-section')?.querySelector(':scope > .editor-blocks');
    if(!blocks)return;
    const block=createTableBlock();blocks.appendChild(block);enhanceBlock(block);
  }
},true);

const observer=new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes){
    if(!(node instanceof Element))continue;
    if(node.matches?.('.editor-dialog'))enhanceDialog(node);
    node.querySelectorAll?.('.editor-dialog').forEach(enhanceDialog);
    if(node.matches?.('.editor-section'))enhanceSection(node);
    node.querySelectorAll?.('.editor-section').forEach(enhanceSection);
  }
});
observer.observe(document.body,{childList:true,subtree:true});
document.querySelectorAll('.editor-dialog').forEach(enhanceDialog);
