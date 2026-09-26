<script setup lang="ts">
import { computed, ref } from "vue";
import { api } from "../../lib/api";
import { compendiumHref } from "../../lib/compendium-navigation";

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
  sectionId?:string;
  compact?:boolean;
  detail?:string;
  badges?:string[];
}>(),{
  category:"",
  articleId:"",
  sectionId:"",
  compact:false,
  detail:"",
  badges:()=>[]
});

const cache=new Map<string,Promise<SearchItem|null>>();
const resolved=ref<SearchItem|null>(null);
const loading=ref(false);
const touched=ref(false);
const previewOpen=ref(false);

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
  }catch{throw new Error('Article introuvable');}
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

async function togglePreview(){
  previewOpen.value=!previewOpen.value;
  if(previewOpen.value)await ensureResolved();
}

const href=computed(()=>{
  const id=resolved.value?.id||props.articleId;
  if(id)return compendiumHref(id,props.sectionId);
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
    :class="{compact,'preview-open':previewOpen}"
    @mouseenter="ensureResolved"
    @focusin="ensureResolved"
  >
    <a
      class="builder-wiki-link"
      :href="href"
      target="_blank"
      rel="noopener"
      :title="resolved ? undefined : `Chercher « ${label} » dans le Compendium`"
      @mouseenter="ensureResolved"
      @focus="ensureResolved"
    >
      <slot>{{ label }}</slot>
      <span class="wiki-mark" aria-hidden="true">↗</span>
    </a>
    <button
      class="wiki-info-button"
      type="button"
      aria-label="Aperçu Compendium"
      :aria-expanded="previewOpen"
      @click.stop="togglePreview"
    >i</button>

    <span class="builder-wiki-hover" role="tooltip">
      <img v-if="resolved?.mediaSrc" class="wiki-preview-media" :src="resolved.mediaSrc" alt="" loading="lazy" />
      <small>{{ resolved?.category || category || "Compendium" }}</small>
      <strong>{{ resolved?.title || label }}</strong>
      <span v-if="badges.length" class="wiki-preview-badges">
        <span v-for="badge in badges" :key="badge">{{ badge }}</span>
      </span>
      <p v-if="detail" class="wiki-preview-detail">{{ detail }}</p>
      <p>{{ preview }}</p>
      <span>{{ resolved ? "Ouvrir l’article →" : "Ouvrir la recherche →" }}</span>
    </span>
  </span>
</template>

<style scoped>
.builder-wiki-ref{position:relative;display:inline-flex;max-width:100%}
.builder-wiki-link{display:inline-flex;align-items:center;gap:.3rem;max-width:100%;color:inherit;text-decoration-line:underline;text-decoration-style:dotted;text-underline-offset:3px;text-decoration-color:rgba(88,220,197,.5)}
.builder-wiki-link:hover,.builder-wiki-link:focus{color:#dcecf0;text-decoration-style:solid;outline:none}
.wiki-mark{font-size:.68em;color:#6fcff1;opacity:.8}
.wiki-info-button{display:none;width:1.15rem;height:1.15rem;margin-left:.15rem;padding:0;border:1px solid #36536b;border-radius:50%;background:transparent;color:#a5bbd3;font:700 .68rem/1 Inter,"Segoe UI",Arial,sans-serif}
.builder-wiki-hover{position:absolute;left:0;bottom:calc(100% + 9px);z-index:120;display:none;box-sizing:border-box;width:min(360px,80vw);padding:18px 20px;border:1px solid #36536b;border-top:2px solid var(--tu-accent,#64def5);border-radius:8px;background:#101e2e;color:#dce8f5;box-shadow:0 16px 48px rgba(0,0,0,.45);pointer-events:none;text-align:left;font-family:Inter,"Segoe UI",Arial,sans-serif;overflow-wrap:anywhere}
.builder-wiki-ref:hover .builder-wiki-hover,.builder-wiki-ref:focus-within .builder-wiki-hover,.builder-wiki-ref.preview-open .builder-wiki-hover{display:block}
.wiki-preview-media{display:block;width:100%;max-height:170px;object-fit:contain;margin:0 0 .65rem;border-radius:4px;background:rgba(0,0,0,.25)}
.builder-wiki-hover small{display:block;margin-bottom:8px;color:var(--tu-accent,#64def5);font-size:10px;font-weight:600;line-height:1.5;text-transform:uppercase;letter-spacing:.14em}
.builder-wiki-hover strong{display:block;color:#eef5ff;font:600 17px/1.35 Inter,"Segoe UI",Arial,sans-serif}
.builder-wiki-hover p{margin:9px 0;color:#c1d1e4;font-size:13px;line-height:1.65}
.wiki-preview-badges{display:flex;flex-wrap:wrap;gap:.3rem;margin:.45rem 0 0}
.wiki-preview-badges span{padding:.2rem .35rem;border:1px solid #36536b;border-radius:3px;color:#a5bbd3;font-size:11px}
.wiki-preview-detail{padding:.45rem .55rem;border-left:2px solid var(--tu-accent,#64def5);background:#15283a;color:#c1d1e4!important}
.builder-wiki-hover>span{color:var(--tu-accent,#64def5);font-size:12px;font-weight:500}
.compact .builder-wiki-hover{width:min(320px,80vw)}
@media(max-width:720px){.wiki-info-button{display:inline-grid;place-items:center}.builder-wiki-ref:hover .builder-wiki-hover{display:none}.builder-wiki-ref.preview-open .builder-wiki-hover,.builder-wiki-ref:focus-within .builder-wiki-hover{display:block}.builder-wiki-hover{position:fixed;left:1rem;right:1rem;bottom:1rem;width:auto;max-height:70vh;overflow:auto}}
</style>
