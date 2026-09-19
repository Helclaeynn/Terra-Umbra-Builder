<script setup lang="ts">
import { computed, ref } from "vue";
import { api } from "../../lib/api";

type SearchItem={
  id:string;
  title:string;
  category:string;
  dataset?:string;
  source?:string;
  status?:string;
  group?:string;
  subgroup?:string;
  snippet?:string;
  mediaSrc?:string;
};

const props=withDefaults(defineProps<{
  label:string;
  category?:string;
  articleId?:string;
  compact?:boolean;
}>(),{
  category:"",
  articleId:"",
  compact:false
});

const cache=new Map<string,Promise<SearchItem|null>>();
const resolved=ref<SearchItem|null>(null);
const loading=ref(false);
const touched=ref(false);

function norm(value:string){
  return String(value??"")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g," ")
    .trim();
}

function searchKey(){
  return [props.articleId,props.category,norm(props.label)].join("|");
}

function mediaSrc(value:unknown):string{
  let raw="";
  if(typeof value==="string")raw=value.trim();
  else if(value&&typeof value==="object")raw=String((value as Record<string,unknown>).src??"").trim();
  if(!raw)return"";
  if(/^(?:https?:|data:|blob:)/i.test(raw))return raw;
  if(raw.startsWith("/api/compendium/media/"))return raw;
  const clean=raw.replace(/^\/?compendium\//,"").replace(/^\/+/, "");
  return clean.startsWith("images/")||clean.startsWith("assets/")
    ?`/api/compendium/media/${clean}`
    :raw;
}

function articleSnippet(article:Record<string,unknown>):string{
  const sections=Array.isArray(article.sections)?article.sections as Array<Record<string,unknown>>:[];
  const chunks:string[]=[];
  for(const section of sections){
    if(section.audience==="mj")continue;
    const blocks=Array.isArray(section.blocks)?section.blocks as Array<Record<string,unknown>>:[];
    for(const block of blocks){
      if(block.type==="p"&&String(block.text??"").trim())chunks.push(String(block.text).trim());
      if(chunks.join(" ").length>360)break;
    }
    if(chunks.join(" ").length>360)break;
  }
  const text=chunks.join(" ").replace(/\s+/g," ").trim();
  return text.length>360?text.slice(0,357).replace(/\s+\S*$/,"")+"…":text;
}

async function hydrate(item:SearchItem):Promise<SearchItem>{
  try{
    const payload=await api<{article:Record<string,unknown>}>(`/api/compendium/articles/${encodeURIComponent(item.id)}`);
    const article=payload.article;
    return{
      ...item,
      title:String(article.title??item.title),
      category:String(article.category??item.category),
      source:String(article.source??item.source??""),
      status:String(article.status??item.status??""),
      snippet:articleSnippet(article)||item.snippet,
      mediaSrc:mediaSrc(article.illustration??article.image)
    };
  }catch{return item;}
}

async function resolveArticle():Promise<SearchItem|null>{
  if(props.articleId){
    try{
      return await hydrate({
        id:props.articleId,
        title:props.label,
        category:props.category
      });
    }catch{/* fallback search below */}
  }

  const params=new URLSearchParams({q:props.label,limit:"12"});
  if(props.category)params.set("category",props.category);
  const payload=await api<{items:SearchItem[]}>(`/api/compendium/search?${params.toString()}`);
  const target=norm(props.label);
  const exact=payload.items.find(item=>norm(item.title)===target);
  if(exact)return hydrate(exact);

  const starts=payload.items.filter(item=>norm(item.title).startsWith(target+" "));
  if(starts.length===1)return hydrate(starts[0]);

  return null;
}

async function ensureResolved(){
  touched.value=true;
  if(resolved.value||loading.value)return;
  const key=searchKey();
  let pending=cache.get(key);
  if(!pending){
    pending=resolveArticle().catch(()=>null);
    cache.set(key,pending);
  }
  loading.value=true;
  try{resolved.value=await pending;}
  finally{loading.value=false;}
}

const href=computed(()=>{
  if(resolved.value?.id)return `/compendium?article=${encodeURIComponent(resolved.value.id)}`;
  const params=new URLSearchParams({q:props.label});
  if(props.category)params.set("category",props.category);
  return `/compendium?${params.toString()}`;
});

const preview=computed(()=>{
  if(resolved.value?.snippet?.trim())return resolved.value.snippet.trim();
  if(loading.value)return"Recherche de la page canonique…";
  if(touched.value&&!resolved.value)return"Pas de page exacte dédiée pour le moment. Ouvrir la recherche du Compendium.";
  return"Voir la page dédiée dans le Compendium.";
});

</script>

<template>
  <span
    class="builder-wiki-ref"
    :class="{compact}"
    @mouseenter="ensureResolved"
    @focusin="ensureResolved"
  >
    <a
      class="builder-wiki-link"
      :href="href"
      target="_blank"
      rel="noopener"
      :title="resolved ? `Ouvrir : ${resolved.title}` : `Chercher « ${label} » dans le Compendium`"
      @mouseenter="ensureResolved"
      @focus="ensureResolved"
    >
      <slot>{{ label }}</slot>
      <span class="wiki-mark" aria-hidden="true">↗</span>
    </a>

    <span class="builder-wiki-hover" role="tooltip">
      <img v-if="resolved?.mediaSrc" class="wiki-preview-media" :src="resolved.mediaSrc" alt="" loading="lazy" />
      <small>{{ resolved?.category || category || "Compendium" }}</small>
      <strong>{{ resolved?.title || label }}</strong>
      <p>{{ preview }}</p>
      <span>{{ resolved ? "Ouvrir l’article →" : "Ouvrir la recherche →" }}</span>
    </span>
  </span>
</template>

<style scoped>
.builder-wiki-ref{position:relative;display:inline-flex;max-width:100%}
.builder-wiki-link{display:inline-flex;align-items:center;gap:.3rem;max-width:100%;color:inherit;text-decoration-line:underline;text-decoration-style:dotted;text-underline-offset:3px;text-decoration-color:rgba(199,173,120,.5)}
.builder-wiki-link:hover,.builder-wiki-link:focus{color:#e6d6b6;text-decoration-style:solid;outline:none}
.wiki-mark{font-size:.68em;color:#a88c58;opacity:.8}
.builder-wiki-hover{position:absolute;left:0;bottom:calc(100% + 9px);z-index:120;display:none;width:min(360px,80vw);padding:.75rem .85rem;border:1px solid rgba(199,173,120,.28);background:#0d0c0a;color:#cfc6b8;box-shadow:0 14px 36px rgba(0,0,0,.5);pointer-events:none;text-align:left}
.builder-wiki-ref:hover .builder-wiki-hover,.builder-wiki-ref:focus-within .builder-wiki-hover{display:block}
.wiki-preview-media{display:block;width:100%;max-height:170px;object-fit:contain;margin:0 0 .65rem;background:rgba(0,0,0,.25)}
.builder-wiki-hover small{display:block;margin-bottom:.2rem;color:#a68d64;font-size:.62rem;text-transform:uppercase;letter-spacing:.08em}
.builder-wiki-hover strong{display:block;color:#e2d8c8;font:500 .98rem/1.25 Georgia,serif}
.builder-wiki-hover p{margin:.42rem 0;color:#aaa195;font-size:.72rem;line-height:1.45}
.builder-wiki-hover>span{color:#b89b67;font-size:.67rem;font-weight:700}
.compact .builder-wiki-hover{width:min(320px,80vw)}
@media(max-width:720px){.builder-wiki-hover{position:fixed;left:1rem;right:1rem;bottom:1rem;width:auto}}
</style>
