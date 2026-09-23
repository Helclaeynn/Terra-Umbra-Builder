<script setup lang="ts">
import {computed,onUnmounted,ref,watch} from 'vue';
import {api} from '../lib/api';
import type {CampaignScene,SceneReference} from '../../../api/src/campaign-preparation';
const props=defineProps<{modelValue:CampaignScene[];readonly?:boolean}>();
const emit=defineEmits<{(e:'update:modelValue',v:CampaignScene[]):void}>();
type Article={id:string;title:string;category:string;snippet:string;tags?:string[];group?:string};
const addedNotice=ref('');
const active=ref(''),query=ref(''),category=ref('Personnages'),results=ref<Article[]>([]),searching=ref(false),error=ref('');
const total=ref(0),moreBusy=ref(false),library=ref<{favoriteItems:Article[];recentItems:Article[]}>({favoriteItems:[],recentItems:[]}),tab=ref('explore');
const reused=computed<Article[]>(()=>[...new Map(props.modelValue.flatMap(s=>s.references).map(r=>[r.articleId,{id:r.articleId,title:r.title,category:r.category,snippet:r.notes}])).values()]);
const suggestions=computed(()=>{const list=tab.value==='dossier'?reused.value:tab.value==='favorites'?library.value.favoriteItems:library.value.recentItems;const q=query.value.toLocaleLowerCase('fr').trim();return list.filter(a=>(!category.value||a.category===category.value)&&(!q||`${a.title} ${a.snippet}`.toLocaleLowerCase('fr').includes(q))).slice(0,30);});
let librarySeq=0;
let timer:ReturnType<typeof setTimeout>|undefined,generation=0;
function change(fn:(s:CampaignScene[])=>void){const next:CampaignScene[]=JSON.parse(JSON.stringify(props.modelValue));fn(next);emit('update:modelValue',next);}
function add(kind='Scène'){
 const templates:Record<string,string>={Enquête:'Objectif de la scène :\n\nIndices accessibles :\n\nPistes et complications :\n\nConséquences possibles :',Rencontre:'Intervenants et motivations :\n\nCe qu’ils savent :\n\nCe qu’ils veulent :\n\nIssues possibles :',Combat:'Enjeu et objectif :\n\nTerrain et obstacles :\n\nAdversaires et tactiques :\n\nConditions de fin :'};
 change(s=>s.push({id:crypto.randomUUID(),title:`${kind} ${s.length+1}`,notes:templates[kind]||'',done:false,references:[]}));
}
function duplicate(id:string){change(s=>{const index=s.findIndex(s=>s.id===id);const copy=structuredClone(s[index]);copy.id=crypto.randomUUID();copy.title=(copy.title+' · copie').slice(0,120);copy.done=false;s.splice(index+1,0,copy);});}
function patch(id:string,value:Partial<CampaignScene>){change(s=>Object.assign(s.find(s=>s.id===id)!,value));}
function move(index:number,delta:number){change(s=>{const [scene]=s.splice(index,1);s.splice(index+delta,0,scene);});}
function remove(id:string){if(!window.confirm('Retirer cette scène et ses références de la préparation ?'))return;change(s=>s.splice(s.findIndex(s=>s.id===id),1));if(active.value===id)active.value='';}
function patchRef(id:string,articleId:string,value:Partial<SceneReference>){change(s=>Object.assign(s.find(s=>s.id===id)!.references.find(r=>r.articleId===articleId)!,value));}
function removeRef(id:string,articleId:string){change(s=>{const scene=s.find(s=>s.id===id)!;scene.references=scene.references.filter(r=>r.articleId!==articleId);});}
function select(a:Article,sceneId:string){change(s=>{const scene=s.find(s=>s.id===sceneId);if(scene&&!scene.references.some(r=>r.articleId===a.id)){scene.references.push({articleId:a.id,title:a.title,category:a.category,quantity:1,notes:''});addedNotice.value=`${a.title} ajouté à « ${scene.title} ».`;}});}
function has(id:string){return props.modelValue.find(s=>s.id===active.value)?.references.some(r=>r.articleId===id);}
async function search(id:string){active.value=active.value===id?'':id;query.value='';results.value=[];tab.value='explore';const n=++librarySeq;if(!active.value)return;try{const r=await api<{favoriteItems:Article[];recentItems:Article[]}>('/api/compendium/library');if(n===librarySeq)library.value=r;}catch{if(n===librarySeq)library.value={favoriteItems:[],recentItems:[]};}}
async function more(){if(moreBusy.value)return;moreBusy.value=true;const n=generation;try{const r=await api<{items:Article[];total:number}>(`/api/compendium/search?q=${encodeURIComponent(query.value.trim())}&category=${encodeURIComponent(category.value)}&limit=15&offset=${results.value.length}`);if(n===generation){results.value.push(...r.items.filter(a=>!results.value.some(old=>old.id===a.id)));total.value=r.total;}}catch{if(n===generation)error.value='Impossible de charger les résultats suivants.';}finally{if(n===generation)moreBusy.value=false;}}

watch([query,category,active,tab],()=>{
 const seq=++generation;clearTimeout(timer);results.value=[];searching.value=false;moreBusy.value=false;error.value='';total.value=0;
 if(props.readonly||!active.value||tab.value!=='explore')return;
 searching.value=true;timer=setTimeout(async()=>{try{const r=await api<{items:Article[];total:number}>(`/api/compendium/search?q=${encodeURIComponent(query.value.trim())}&category=${encodeURIComponent(category.value)}&limit=15`);if(seq===generation){results.value=r.items;total.value=r.total??r.items.length;}}catch{if(seq===generation)error.value='Recherche indisponible. Réessaie en modifiant ta recherche.';}finally{if(seq===generation)searching.value=false;}},250);
});
onUnmounted(()=>{generation++;librarySeq++;clearTimeout(timer);});
const value=(e:Event)=>(e.target as HTMLInputElement).value;
</script>
<template>
 <div class="preparation">
  <h3>Scènes et références privées</h3><p v-if="!readonly">Organise les scènes dans l’ordre prévu. Ajoute les PNJ, les créatures et les pages utiles à chacune.</p>
  <p v-if="!modelValue.length">Aucune scène préparée.</p>
  <details v-for="(s,index) in modelValue" :key="s.id" class="scene" open>
   <summary>{{ index+1 }}. {{ s.title }} <small>{{ s.done?'· Jouée':'' }} · {{ s.references.length }} référence(s)</small><span class="scene-roster" v-if="s.references.length">{{ s.references.map(r=>`${r.quantity} × ${r.title}`).join(' · ') }}</span></summary>
   <div class="scene-body">
    <p v-if="!s.references.length" class="reference-empty">Aucun PNJ, créature ou document ajouté à cette scène.</p>
    <template v-if="!readonly"><label>Titre de la scène<input :value="s.title" maxlength="120" required @input="patch(s.id,{title:value($event)})" /></label><label class="check"><input type="checkbox" :checked="s.done" @change="patch(s.id,{done:($event.target as HTMLInputElement).checked})" />Scène jouée</label><label>Notes de la scène<textarea :value="s.notes" rows="4" maxlength="6000" placeholder="Objectif, ambiance, indices, événements possibles…" @input="patch(s.id,{notes:value($event)})" /></label></template>
    <p v-else class="prose">{{ s.notes||'Aucune note.' }}</p>
    <div v-for="r in s.references" :key="r.articleId" class="reference">
     <div><small>{{ r.category }} · Quantité : {{ r.quantity }}</small><a :href="`/compendium?article=${encodeURIComponent(r.articleId)}`" target="_blank" rel="noopener noreferrer">{{ r.title }} ↗</a><small>Ouvre le Compendium dans un nouvel onglet.</small></div>
     <template v-if="!readonly"><label>Quantité<input type="number" :value="r.quantity" min="1" max="999" required @input="patchRef(s.id,r.articleId,{quantity:Number(value($event))})" /></label><label>Annotation privée<textarea :value="r.notes" rows="2" maxlength="2000" placeholder="Rôle dans la scène, particularités, informations à révéler…" @input="patchRef(s.id,r.articleId,{notes:value($event)})" /></label><button type="button" :aria-label="`Retirer ${r.title}`" @click="removeRef(s.id,r.articleId)">Retirer la référence</button></template><p v-else-if="r.notes" class="prose">{{ r.notes }}</p>
    </div>
    <template v-if="!readonly">
     <div class="actions"><button type="button" :disabled="s.references.length>=30" @click="search(s.id)">{{ active===s.id?'Fermer la recherche':'Ajouter une référence' }}</button><button type="button" :disabled="index===0" :aria-label="`Monter ${s.title}`" @click="move(index,-1)">↑</button><button type="button" :disabled="index===modelValue.length-1" :aria-label="`Descendre ${s.title}`" @click="move(index,1)">↓</button><button type="button" :disabled="modelValue.length>=30" @click="duplicate(s.id)">Dupliquer la scène</button><button type="button" @click="remove(s.id)">Retirer la scène</button></div>
     <div v-if="active===s.id" class="picker">
      <strong>Que te faut-il pour cette scène ?</strong><p v-if="addedNotice" role="status">{{ addedNotice }}</p><div v-if="s.references.length" class="selected-references"><strong>Déjà ajoutés à cette scène</strong><ul><li v-for="r in s.references" :key="r.articleId">{{ r.quantity }} × {{ r.title }}</li></ul></div>
      <div class="actions" role="group" aria-label="Besoin de la scène"><button v-for="(label,key) in {Personnages:'Un PNJ',Bestiaire:'Une créature',Règles:'Une règle','':'Un lieu ou un dossier'}" :key="key" type="button" :aria-pressed="category===key" @click="category=String(key)">{{ label }}</button></div>
      <label>Type de référence<select v-model="category" aria-label="Type de référence"><option value="Personnages">PNJ</option><option value="Bestiaire">Bestiaire</option><option value="Règles">Règles</option><option value="">Tout le Compendium</option></select></label>
      <label>Rechercher une référence<input v-model="query" type="search" maxlength="100" placeholder="Nom, faction, territoire, type de créature…" /></label>
      <small>Tu peux parcourir sans connaître le nom exact. Pour un lieu, essaie « temple », « quartier » ou « Silcenter ».</small>
      <div class="actions" role="group" aria-label="Origine des références"><button v-for="(label,key) in {explore:'Explorer',dossier:'Déjà dans la préparation',favorites:'Mes favoris',recent:'Mes lectures récentes'}" :key="key" type="button" :aria-pressed="tab===key" @click="tab=String(key)">{{ label }}</button></div>
      <p v-if="tab==='explore'&&searching" role="status">Recherche…</p><p v-else-if="error" role="alert">{{ error }}</p><p v-else-if="tab==='explore'&&!results.length">Aucun résultat. Essaie un terme plus court ou « Tout le Compendium ».</p><p v-else-if="tab!=='explore'&&!suggestions.length">Aucune référence ici pour ces critères. Change de type ou explore le Compendium.</p>
      <small v-if="tab==='explore'&&!searching">{{ total }} résultat(s) · {{ results.length }} affiché(s)</small>
      <div v-for="a in tab==='explore'?results:suggestions" :key="a.id" class="result"><div><strong>{{ a.title }}</strong><small>{{ a.category }}{{ a.group?' · '+a.group:'' }}</small><p>{{ a.snippet }}</p><a :href="`/compendium?article=${encodeURIComponent(a.id)}`" target="_blank" rel="noopener noreferrer">Consulter avant d’ajouter ↗</a></div><button type="button" :disabled="has(a.id)||s.references.length>=30" :aria-label="`Ajouter ${a.title}`" @click="select(a,s.id)">{{ has(a.id)?'Ajouté à cette scène':'Ajouter à la scène' }}</button></div>
      <button v-if="tab==='explore'&&results.length<total" type="button" :disabled="moreBusy" @click="more">Voir d’autres résultats</button>
     </div>
    </template>
   </div>
  </details>
  <div v-if="!readonly" class="actions"><button type="button" :disabled="modelValue.length>=30" @click="add()">Ajouter une scène</button><button v-for="kind in ['Enquête','Rencontre','Combat']" :key="kind" type="button" :disabled="modelValue.length>=30" @click="add(kind)">Préparer : {{ kind }}</button></div>
 </div>
</template>
<style scoped>
.scene-roster{display:block;margin-top:8px;color:#a3eaff;overflow-wrap:anywhere}.selected-references{padding:12px;border:1px solid #477080;background:#102634}.selected-references ul{margin:8px 0;padding-left:20px}.preparation{min-width:0;color:#eaf2ff}.preparation p{line-height:1.6;color:#b5c8dc}.scene{border:1px solid #3c4a65;border-radius:6px;margin:12px 0}.scene>summary{cursor:pointer;padding:14px;min-height:44px;box-sizing:border-box;color:#d3c2f4}.scene-body{padding:14px;display:grid;gap:12px}.scene-body label,.picker label{display:grid;gap:7px;font-size:14px}.scene-body input:not([type=checkbox]),.scene-body textarea,.scene-body select{width:100%;min-width:0;box-sizing:border-box;background:#08131f;color:#edf4ff;border:1px solid #405875;border-radius:6px;padding:11px;font:inherit;min-height:44px}.scene-body textarea{resize:vertical}.scene-body .check{display:flex;align-items:center;gap:10px;min-height:44px}.check input{width:20px;height:20px;accent-color:#a3eaff}.reference{display:grid;gap:10px;border-left:2px solid #8773b6;padding:12px;background:#101e30}.reference label:has(input){max-width:140px}.reference a{color:#a3eaff;overflow-wrap:anywhere}.reference small{display:block;color:#a5b9cf;line-height:1.6}.prose{white-space:pre-wrap}.actions{display:flex;flex-wrap:wrap;gap:8px}.preparation button{min-height:44px;padding:10px 14px;background:#101e30;color:#eaf2ff;border:1px solid #405875;border-radius:6px;cursor:pointer;font:inherit}.preparation button[aria-pressed=true]{border-color:#a3eaff;background:#173547}.picker a{color:#a3eaff}.preparation button:disabled{opacity:.5;cursor:default}.picker{display:grid;gap:14px;padding:14px;border:1px solid #477080;border-radius:6px}.result{display:flex;align-items:center;gap:12px;justify-content:space-between;border-bottom:1px solid #293d52;padding:12px 0}.result>div{min-width:0}.result p{font-size:13px}.result small{display:block;color:#a3b7cc}button:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}@media(max-width:600px){.result{align-items:stretch;flex-direction:column}.scene-body,.picker{padding:10px}}
</style>
