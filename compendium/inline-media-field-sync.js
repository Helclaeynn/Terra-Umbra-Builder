const TOKEN='@@TUC_INLINE_MEDIA_V1@@';

function currentPayload(block){
  const text=block.querySelector('[data-field="block-text"]');
  if(!text)return {text:null,payload:{}};
  const raw=String(text.value||'').trim();
  if(!raw.startsWith(TOKEN))return {text,payload:{}};
  try{return {text,payload:JSON.parse(raw.slice(TOKEN.length))||{}};}catch{return {text,payload:{}};}
}
function sync(block){
  if(!block?.matches('.editor-block[data-inline-media-editor="1"]'))return;
  const {text,payload}=currentPayload(block);if(!text)return;
  const next={
    kind:block.dataset.inlineMediaKindBlock==='portrait'?'portrait':'image',
    src:block.querySelector('[data-inline-media-src]')?.value.trim()||'',
    alt:block.querySelector('[data-inline-media-alt]')?.value.trim()||'',
    caption:block.querySelector('[data-inline-media-caption]')?.value.trim()||'',
    slot:String(payload.slot||block.dataset.inlineMediaSlot||'')
  };
  text.value=TOKEN+JSON.stringify(next);
}
function mediaField(target){return target.matches?.('[data-inline-media-src],[data-inline-media-alt],[data-inline-media-caption]');}
for(const eventName of ['input','change'])document.addEventListener(eventName,event=>{
  if(!mediaField(event.target))return;
  sync(event.target.closest('.editor-block[data-inline-media-editor="1"]'));
},true);
