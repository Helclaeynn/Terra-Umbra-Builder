<script setup lang="ts">
import {ref} from 'vue';
import {api} from '../lib/api';
const props=defineProps<{articleId:string;name:string}>();
const anchor=ref<HTMLElement|null>(null),position=ref({left:'0px',top:'0px'});
const visible=ref(false),image=ref(''),loading=ref(false),loaded=ref(false);
function mediaSource(value:unknown):string{
  const raw=typeof value==='string'?value:value&&typeof value==='object'?(value as Record<string,unknown>).src:'';
  if(typeof raw!=='string')return '';
  const src=raw.trim();
  if(/^https?:\/\//i.test(src)||/^data:image\//i.test(src)||src.startsWith('/api/compendium/media/'))return src;
  const clean=src.replace(/^\/?compendium\//,'').replace(/^\/+/, '');
  return /^(images|assets)\//.test(clean)?`/api/compendium/media/${clean}`:'';
}
async function preview(){
  const rect=anchor.value?.getBoundingClientRect();
  if(rect)position.value={left:`${Math.max(8,Math.min(rect.left,innerWidth-228))}px`,top:`${Math.max(8,Math.min(rect.top>270?rect.top-260:rect.bottom+6,innerHeight-260))}px`};
  visible.value=true;
  if(loaded.value||loading.value)return;
  loading.value=true;
  try{
    // Fetch only on demand through the permission-filtered article endpoint.
    const {article}=await api<{article:Record<string,unknown>}>(`/api/compendium/articles/${encodeURIComponent(props.articleId)}`);
    image.value=mediaSource(article.illustration??article.image);
    loaded.value=true;
  }catch{image.value='';}finally{loading.value=false;}
}
function leave(event:FocusEvent){if(!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node|null))visible.value=false;}
</script>

<template>
  <span ref="anchor" class="item-link" @pointerenter="$event.pointerType==='mouse' && preview()" @pointerleave="$event.pointerType==='mouse' && (visible=false)" @focusout="leave">
    <a :href="`/compendium?article=${encodeURIComponent(articleId)}`" target="_blank" rel="noopener" @focus="preview" @click.stop>{{name}}</a>
    <button type="button" :aria-label="`Aperçu de ${name}`" :aria-expanded="visible" @click.stop="visible?visible=false:preview()">▧</button>
    <span v-if="visible" class="item-preview" :style="position" role="status" @click.stop>
      <img v-if="image" :src="image" :alt="name" @error="image=''" />
      <small v-else>{{loading?'Chargement de l’aperçu…':'Illustration indisponible. Ouvrez la fiche pour les détails.'}}</small>
    </span>
  </span>
</template>

<style scoped>
.item-link{position:relative;display:inline-flex;align-items:center;gap:8px;max-width:100%}.item-link a{color:#b7dfd1;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}.item-link button{background:transparent;color:#b7dfd1;border:1px solid #567779;border-radius:6px;min-width:36px;min-height:36px;flex-shrink:0}.item-link a:focus-visible,.item-link button:focus-visible{outline:3px solid #c2e9bc;outline-offset:3px}.item-preview{position:fixed;width:min(220px,calc(100vw - 32px));z-index:5;padding:10px;background:#142631;border:1px solid #567779;border-radius:8px;box-shadow:0 8px 24px #0008;pointer-events:none}.item-preview img{display:block;width:100%;max-height:220px;object-fit:contain}.item-preview small{display:block;white-space:normal;line-height:1.5}
</style>
