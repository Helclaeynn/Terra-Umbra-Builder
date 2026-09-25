<script setup lang="ts">
import {onMounted,onUnmounted,ref,watch} from 'vue';
import {api} from '../../lib/api';

const props=defineProps<{articleId?:string;name:string;category?:string}>();
const root=ref<HTMLElement|null>(null),src=ref('');
const cache=new Map<string,Promise<string>>();
let observer:IntersectionObserver|null=null,alive=true,request=0;
function media(value:unknown){const raw=typeof value==='string'?value:String((value as {src?:string}|null)?.src||'');if(!raw)return '';if(/^(?:https?:|data:|blob:)/i.test(raw))return raw;if(raw.startsWith('/api/compendium/media/'))return raw;const clean=raw.replace(/^\/?compendium\//,'').replace(/^\/+/, '');return clean.startsWith('images/')||clean.startsWith('assets/')?`/api/compendium/media/${clean}`:'';}
async function resolve(){const key=props.articleId||`${props.category||''}:${props.name}`;if(!key)return '';let pending=cache.get(key);if(!pending){pending=(async()=>{let id=props.articleId;if(!id){const params=new URLSearchParams({q:props.name,limit:'8'});if(props.category)params.set('category',props.category);const result=await api<{items:{id:string;title:string}[]}>(`/api/compendium/search?${params}`);id=result.items.find(row=>row.title.toLocaleLowerCase('fr')===props.name.toLocaleLowerCase('fr'))?.id;}if(!id)return '';const result=await api<{media:unknown}>(`/api/compendium/wiki-preview/${encodeURIComponent(id)}`);return media(result.media);})().catch(()=> '');cache.set(key,pending);}return pending;}
async function load(){const n=++request;const image=await resolve();if(alive&&n===request)src.value=image;}
function observe(){observer?.disconnect();if(!root.value)return;if(typeof IntersectionObserver==='undefined'){void load();return;}observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer?.disconnect();void load();}},{rootMargin:'250px'});observer.observe(root.value);}
onMounted(observe);onUnmounted(()=>{alive=false;request++;observer?.disconnect();});watch(()=>[props.articleId,props.name,props.category],()=>{request++;src.value='';observe();});
</script>
<template><div ref="root" class="catalog-art"><img v-if="src" :src="src" :alt="`Illustration de ${name}`" loading="lazy" decoding="async" /><span v-else aria-hidden="true">TU</span></div></template>
<style scoped>.catalog-art{box-sizing:border-box;min-width:0;height:180px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#0a1929;border:1px solid #30475e;border-radius:6px}.catalog-art img{display:block;min-width:0;min-height:0;max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain;object-position:center}.catalog-art span{font:600 22px/1 Inter,sans-serif;letter-spacing:.18em;color:#608094}@media(max-width:600px){.catalog-art{height:150px}}</style>
