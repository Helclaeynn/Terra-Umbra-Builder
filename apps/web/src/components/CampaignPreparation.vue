<script setup lang="ts">
import {onUnmounted,ref,watch} from 'vue';
import {api} from '../lib/api';
import type {CampaignScene,SceneReference} from '../../../api/src/campaign-preparation';
const props=defineProps<{modelValue:CampaignScene[];readonly?:boolean}>();
const emit=defineEmits<{(e:'update:modelValue',v:CampaignScene[]):void}>();
type Article={id:string;title:string;category:string;snippet:string};
const active=ref(''),query=ref(''),category=ref('Personnages'),results=ref<Article[]>([]),searching=ref(false),error=ref('');
let timer:ReturnType<typeof setTimeout>|undefined,generation=0;
function change(fn:(s:CampaignScene[])=>void){const next=structuredClone(props.modelValue.map(s=>({...s,references:s.references.map(r=>({...r}))})));fn(next);emit('update:modelValue',next);}
function add(){change(s=>s.push({id:crypto.randomUUID(),title:`Scène ${s.length+1}`,notes:'',done:false,references:[]}));}
function patch(id:string,value:Partial<CampaignScene>){change(s=>Object.assign(s.find(s=>s.id===id)!,value));}
function move(index:number,delta:number){change(s=>{const [scene]=s.splice(index,1);s.splice(index+delta,0,scene);});}
function remove(id:string){if(!window.confirm('Retirer cette scène et ses références de la préparation ?'))return;change(s=>s.splice(s.findIndex(s=>s.id===id),1));if(active.value===id)active.value='';}
function patchRef(id:string,articleId:string,value:Partial<SceneReference>){change(s=>Object.assign(s.find(s=>s.id===id)!.references.find(r=>r.articleId===articleId)!,value));}
function removeRef(id:string,articleId:string){change(s=>{const scene=s.find(s=>s.id===id)!;scene.references=scene.references.filter(r=>r.articleId!==articleId);});}
function select(a:Article){change(s=>{const scene=s.find(s=>s.id===active.value);if(scene&&!scene.references.some(r=>r.articleId===a.id))scene.references.push({articleId:a.id,title:a.title,category:a.category,quantity:1,notes:''});});}
function has(id:string){return props.modelValue.find(s=>s.id===active.value)?.references.some(r=>r.articleId===id);}
function search(id:string){active.value=active.value===id?'':id;query.value='';results.value=[];}
watch([query,category,active],()=>{
 const seq=++generation;clearTimeout(timer);results.value=[];searching.value=false;error.value='';
 if(props.readonly||!active.value||query.value.trim().length<2)return;
 searching.value=true;timer=setTimeout(async()=>{try{const r=await api<{items:Article[]}>(`/api/compendium/search?q=${encodeURIComponent(query.value.trim())}&category=${encodeURIComponent(category.value)}&limit=15`);if(seq===generation)results.value=r.items;}catch{if(seq===generation)error.value='Recherche indisponible. Réessaie en modifiant ta recherche.';}finally{if(seq===generation)searching.value=false;}},250);
});
onUnmounted(()=>{generation++;clearTimeout(timer);});
const value=(e:Event)=>(e.target as HTMLInputElement).value;
</script>
<template>
 <div class="preparation">
  <h3>Scènes et références privées</h3><p v-if="!readonly">Organise les scènes dans l’ordre prévu. Ajoute les PNJ, les créatures et les pages utiles à chacune.</p>
  <p v-if="!modelValue.length">Aucune scène préparée.</p>
  <details v-for="(s,index) in modelValue" :key="s.id" class="scene" :open="!readonly">
   <summary>{{ index+1 }}. {{ s.title }} <small>{{ s.done?'· Jouée':'' }} · {{ s.references.length }} référence(s)</small></summary>
   <div class="scene-body">
    <template v-if="!readonly"><label>Titre de la scène<input :value="s.title" maxlength="120" required @input="patch(s.id,{title:value($event)})" /></label><label class="check"><input type="checkbox" :checked="s.done" @change="patch(s.id,{done:($event.target as HTMLInputElement).checked})" />Scène jouée</label><label>Notes de la scène<textarea :value="s.notes" rows="4" maxlength="6000" placeholder="Objectif, ambiance, indices, événements possibles…" @input="patch(s.id,{notes:value($event)})" /></label></template>
    <p v-else class="prose">{{ s.notes||'Aucune note.' }}</p>
    <div v-for="r in s.references" :key="r.articleId" class="reference">
     <div><small>{{ r.category }} · Quantité : {{ r.quantity }}</small><a :href="`/compendium?article=${encodeURIComponent(r.articleId)}`" target="_blank" rel="noopener noreferrer">{{ r.title }} ↗</a><small>Ouvre le Compendium dans un nouvel onglet.</small></div>
     <template v-if="!readonly"><label>Quantité<input type="number" :value="r.quantity" min="1" max="999" required @input="patchRef(s.id,r.articleId,{quantity:Number(value($event))})" /></label><label>Annotation privée<textarea :value="r.notes" rows="2" maxlength="2000" placeholder="Rôle dans la scène, particularités, informations à révéler…" @input="patchRef(s.id,r.articleId,{notes:value($event)})" /></label><button type="button" :aria-label="`Retirer ${r.title}`" @click="removeRef(s.id,r.articleId)">Retirer la référence</button></template><p v-else-if="r.notes" class="prose">{{ r.notes }}</p>
    </div>
    <template v-if="!readonly">
     <div class="actions"><button type="button" :disabled="s.references.length>=30" @click="search(s.id)">{{ active===s.id?'Fermer la recherche':'Ajouter une référence' }}</button><button type="button" :disabled="index===0" :aria-label="`Monter ${s.title}`" @click="move(index,-1)">↑</button><button type="button" :disabled="index===modelValue.length-1" :aria-label="`Descendre ${s.title}`" @click="move(index,1)">↓</button><button type="button" @click="remove(s.id)">Retirer la scène</button></div>
     <div v-if="active===s.id" class="picker"><label>Type de référence<select v-model="category" aria-label="Type de référence"><option value="Personnages">PNJ</option><option value="Bestiaire">Bestiaire</option><option value="">Tout le Compendium</option></select></label><label>Rechercher une référence<input v-model="query" type="search" maxlength="100" placeholder="Au moins 2 caractères…" /></label><p v-if="searching" role="status">Recherche…</p><p v-else-if="error" role="alert">{{ error }}</p><p v-else-if="query.trim().length>=2&&!results.length">Aucun résultat.</p><div v-for="a in results" :key="a.id" class="result"><div><strong>{{ a.title }}</strong><small>{{ a.category }}</small><p>{{ a.snippet }}</p></div><button type="button" :disabled="has(a.id)||s.references.length>=30" :aria-label="`Ajouter ${a.title}`" @click="select(a)">{{ has(a.id)?'Ajouté':'Ajouter' }}</button></div></div>
    </template>
   </div>
  </details>
  <button v-if="!readonly" type="button" :disabled="modelValue.length>=30" @click="add">Ajouter une scène</button>
 </div>
</template>
<style scoped>
.preparation{min-width:0;color:#eaf2ff}.preparation p{line-height:1.6;color:#b5c8dc}.scene{border:1px solid #3c4a65;border-radius:6px;margin:12px 0}.scene>summary{cursor:pointer;padding:14px;min-height:44px;box-sizing:border-box;color:#d3c2f4}.scene-body{padding:14px;display:grid;gap:12px}.scene-body label,.picker label{display:grid;gap:7px;font-size:14px}.scene-body input:not([type=checkbox]),.scene-body textarea,.scene-body select{width:100%;min-width:0;box-sizing:border-box;background:#08131f;color:#edf4ff;border:1px solid #405875;border-radius:6px;padding:11px;font:inherit;min-height:44px}.scene-body textarea{resize:vertical}.scene-body .check{display:flex;align-items:center;gap:10px;min-height:44px}.check input{width:20px;height:20px;accent-color:#a3eaff}.reference{display:grid;gap:10px;border-left:2px solid #8773b6;padding:12px;background:#101e30}.reference label:has(input){max-width:140px}.reference a{color:#a3eaff;overflow-wrap:anywhere}.reference small{display:block;color:#a5b9cf;line-height:1.6}.prose{white-space:pre-wrap}.actions{display:flex;flex-wrap:wrap;gap:8px}.preparation button{min-height:44px;padding:10px 14px;background:#101e30;color:#eaf2ff;border:1px solid #405875;border-radius:6px;cursor:pointer;font:inherit}.preparation button:disabled{opacity:.5;cursor:default}.picker{display:grid;gap:14px;padding:14px;border:1px solid #477080;border-radius:6px}.result{display:flex;align-items:center;gap:12px;justify-content:space-between;border-bottom:1px solid #293d52;padding:12px 0}.result>div{min-width:0}.result p{font-size:13px}.result small{display:block;color:#a3b7cc}button:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}@media(max-width:600px){.result{align-items:stretch;flex-direction:column}.scene-body,.picker{padding:10px}}
</style>
