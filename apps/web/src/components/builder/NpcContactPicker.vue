<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { api } from "../../lib/api";
import BuilderWikiLink from "./BuilderWikiLink.vue";

export type NpcContactChoice={articleId:string;title:string;tierId:string;tierLabel:string;snippet?:string};

const props=withDefaults(defineProps<{
  modelValue?:NpcContactChoice|null;
  label:string;
  help:string;
  maxTier:"entraine"|"elite"|"superieur";
  minTier?:"haute-elite";
  allowCreate?:boolean;
}>(),{modelValue:null,allowCreate:false});

const emit=defineEmits<{"update:modelValue":[value:NpcContactChoice|null]}>();
const query=ref("");
const results=ref<NpcContactChoice[]>([]);
const loading=ref(false);
const error=ref("");
let timer:ReturnType<typeof setTimeout>|undefined;
let sequence=0;

const selected=computed(()=>props.modelValue?.articleId?props.modelValue:null);

async function search(){
  const current=++sequence;
  loading.value=true;
  error.value="";
  try{
    const params=new URLSearchParams({q:query.value.trim(),maxTier:props.maxTier});
    if(props.minTier)params.set('minTier',props.minTier);
    const payload=await api<{items:NpcContactChoice[];total:number}>(`/api/compendium/contact-npcs?${params}`);
    if(current===sequence)results.value=payload.items;
  }catch{
    if(current===sequence){results.value=[];error.value="Impossible de charger la liste des PNJ.";}
  }finally{
    if(current===sequence)loading.value=false;
  }
}

function schedule(){
  if(timer)clearTimeout(timer);
  timer=setTimeout(()=>void search(),220);
}

watch(query,schedule);
onMounted(()=>void search());
onBeforeUnmount(()=>{sequence++;if(timer)clearTimeout(timer);});
</script>

<template>
  <section class="contact-picker">
    <div class="contact-heading">
      <div><strong>{{ label }}</strong><small>{{ help }}</small></div>
      <a
        v-if="allowCreate"
        :href="`/compendium/new?category=Personnages&template=npc&maxTier=${maxTier}`"
        target="_blank"
        rel="noopener"
      >Créer un PNJ ({{ maxTier==='entraine'?'Entraîné':'Élite' }} maximum)</a>
    </div>

    <div v-if="selected" class="selected-contact">
      <span>
        <BuilderWikiLink
          :label="selected.title"
          :article-id="selected.articleId"
          :detail="selected.snippet || ''"
          :badges="[selected.tierLabel]"
          compact
        >{{ selected.title }}</BuilderWikiLink>
        <small>{{ selected.tierLabel }}</small>
      </span>
      <button type="button" @click="emit('update:modelValue',null)">Changer</button>
    </div>

    <template v-else>
      <label>
        Rechercher dans les PNJ existants
        <input
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Nom, faction, rôle…"
          @focus="results.length||loading?undefined:search()"
        />
      </label>
      <p v-if="loading" role="status">Chargement des PNJ compatibles…</p>
      <p v-else-if="error" role="alert">{{ error }} <button type="button" @click="search">Réessayer</button></p>
      <template v-else-if="results.length">
        <small class="contact-count">{{ results.length }} profil{{ results.length>1 ? 's' : '' }} compatible{{ results.length>1 ? 's' : '' }} · liste scrollable</small>
        <div class="contact-results" role="listbox" :aria-label="label">
          <article
            v-for="npc in results"
            :key="npc.articleId"
            class="contact-result"
            role="option"
            :aria-label="`${npc.title}, ${npc.tierLabel}`"
          >
            <div>
              <BuilderWikiLink
                :label="npc.title"
                :article-id="npc.articleId"
                :detail="npc.snippet || ''"
                :badges="[npc.tierLabel]"
                compact
              >{{ npc.title }}</BuilderWikiLink>
              <small>{{ npc.tierLabel }}</small>
              <p v-if="npc.snippet">{{ npc.snippet }}</p>
            </div>
            <button type="button" @click="emit('update:modelValue',npc)">Choisir</button>
          </article>
        </div>
      </template>
      <small v-else-if="query.trim()">Aucun PNJ compatible trouvé.</small>
    </template>
  </section>
</template>

<style scoped>
.contact-picker{display:grid;gap:.75rem;padding:.9rem;border:1px solid #36546b;border-radius:9px;background:#0b1827}
.contact-heading,.selected-contact{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.7rem}
.contact-heading>div,.selected-contact>span{display:grid;gap:.2rem}
.contact-picker small{color:#a1b5cc;line-height:1.45}
.contact-picker a{color:#9eeaff}
.contact-picker label{display:grid;gap:.4rem}
.contact-picker input{box-sizing:border-box;width:100%;min-height:44px;padding:10px;border:1px solid #405875;border-radius:6px;background:#08131f;color:#edf4ff;font:inherit}
.contact-count{display:block}
.contact-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:.5rem;max-height:360px;padding-right:.2rem;overflow:auto;overscroll-behavior:contain}
.contact-result{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:.65rem;padding:.7rem;border:1px solid #2c4358;border-radius:7px;background:#0d1c2b}
.contact-result>div{display:grid;gap:.18rem}
.contact-result p{display:-webkit-box;margin:.2rem 0 0;overflow:hidden;color:#9fb4c8;font-size:.78rem;line-height:1.45;-webkit-box-orient:vertical;-webkit-line-clamp:3}
.contact-result>button{align-self:center}
.selected-contact{padding:.7rem;border:1px solid rgba(100,222,245,.2);border-radius:7px;background:rgba(100,222,245,.035)}
.contact-picker button{min-height:44px;padding:9px 12px;border:1px solid #405875;border-radius:6px;background:#13283b;color:#edf4ff;font:inherit;cursor:pointer}
.contact-picker :focus-visible{outline:2px solid #a3eaff;outline-offset:3px}
</style>
