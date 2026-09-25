<script setup lang="ts">
import {computed,onUnmounted,ref,watch} from 'vue';
import CampaignNpcs from './CampaignNpcs.vue';
import CampaignNpcPreview from './CampaignNpcPreview.vue';
import CampaignBestiary from './CampaignBestiary.vue';
import CampaignCreaturePreview from './CampaignCreaturePreview.vue';
import type {NpcSummary} from '../../../api/src/campaign-npc-model';
import type {BestiarySummary} from '../../../api/src/campaign-bestiary-model';
import {api} from '../lib/api';
import type {CampaignScene,SceneReference} from '../../../api/src/campaign-preparation';
const props=defineProps<{modelValue:CampaignScene[];campaignId?:string;readonly?:boolean;play?:boolean;groupSize?:number;campaignReferences?:Article[]}>();
const emit=defineEmits<{(e:'update:modelValue',v:CampaignScene[]):void;(e:'npc-dirty',value:boolean):void}>();
type Article={npcId?:string;creatureId?:string;difficultyId?:string;id:string;title:string;category:string;snippet:string;tags?:string[];group?:string};
const openedNpc=ref(''),openedCreature=ref(''),npcDirty=ref(false);
function npcChanged(value:boolean){npcDirty.value=value;emit('npc-dirty',value);}
function switchTab(key:string){if(npcDirty.value&&!window.confirm('Abandonner les PNJ non enregistrés ?'))return;tab.value=key;}
function selectNpc(n:NpcSummary,id:string){select({id:'campaign-npc:'+n.id,npcId:n.id,title:n.name,category:'PNJ de campagne',snippet:n.role},id);}
function selectCreature(c:BestiarySummary,id:string){select({id:'campaign-creature:'+c.id,creatureId:c.id,difficultyId:c.difficultyId,title:c.name,category:'Bestiaire de campagne',snippet:c.role},id);}
function encounter(scene:CampaignScene){const weights:Record<string,number>={figurant:1,standard:2,dangereux:4,majeur:7,exceptionnel:12};const known=scene.references.filter(r=>r.creatureId&&r.difficultyId);if(!known.length)return '';const total=known.reduce((n,r)=>n+(weights[r.difficultyId!]||0)*r.quantity,0),size=Math.max(1,props.groupSize||4);const level=total<=size?'Légère':total<=size*2?'Soutenue':total<=size*3?'Périlleuse':'Extrême';return `${level} · ${known.reduce((n,r)=>n+r.quantity,0)} créature(s) chiffrée(s)${scene.references.some(r=>r.npcId||r.creatureId&&!r.difficultyId)?' · autres adversaires non comptés':''}`;}
const addedNotice=ref(''),expanded=ref<string[]>([]);
const active=ref(''),query=ref(''),category=ref(''),results=ref<Article[]>([]),searching=ref(false),error=ref('');
const total=ref(0),moreBusy=ref(false),library=ref<{favoriteItems:Article[];recentItems:Article[]}>({favoriteItems:[],recentItems:[]}),tab=ref('explore');
const reused=computed<Article[]>(()=>[...new Map([...(props.campaignReferences||[]),...props.modelValue.flatMap(s=>s.references).map(r=>({id:r.articleId,title:r.title,category:r.category,snippet:r.notes,npcId:r.npcId,creatureId:r.creatureId,difficultyId:r.difficultyId}))].map(a=>[a.id,a])).values()]);
const suggestions=computed(()=>{const list=tab.value==='dossier'?reused.value:tab.value==='favorites'?library.value.favoriteItems:library.value.recentItems;const q=query.value.toLocaleLowerCase('fr').trim();return list.filter(a=>(!category.value||a.category===category.value)&&(!q||`${a.title} ${a.snippet} ${(a.tags||[]).join(" ")}`.toLocaleLowerCase('fr').includes(q))).slice(0,30);});
let librarySeq=0;
let timer:ReturnType<typeof setTimeout>|undefined,generation=0;
function change(fn:(s:CampaignScene[])=>void){const next:CampaignScene[]=JSON.parse(JSON.stringify(props.modelValue));fn(next);emit('update:modelValue',next);}
function add(kind='Scène'){
 const templates:Record<string,string>={Enquête:'Objectif de la scène :\n\nIndices accessibles :\n\nPistes et complications :\n\nConséquences possibles :',Rencontre:'Intervenants et motivations :\n\nCe qu’ils savent :\n\nCe qu’ils veulent :\n\nIssues possibles :',Combat:'Enjeu et objectif :\n\nTerrain et obstacles :\n\nAdversaires et tactiques :\n\nConditions de fin :'};
 const id=crypto.randomUUID();expanded.value.push(id);
 change(s=>s.push({id,title:`${kind} ${s.length+1}`,notes:templates[kind]||'',done:false,references:[]}));
}
function duplicate(id:string){change(s=>{const index=s.findIndex(s=>s.id===id);const copy=structuredClone(s[index]);copy.id=crypto.randomUUID();copy.title=(copy.title+' · copie').slice(0,120);copy.done=false;s.splice(index+1,0,copy);});}
function patch(id:string,value:Partial<CampaignScene>){change(s=>Object.assign(s.find(s=>s.id===id)!,value));}
function move(index:number,delta:number){change(s=>{const [scene]=s.splice(index,1);s.splice(index+delta,0,scene);});}
function remove(id:string){if(!window.confirm('Retirer cette scène et ses références de la préparation ?'))return;change(s=>s.splice(s.findIndex(s=>s.id===id),1));if(active.value===id)active.value='';}
function patchRef(id:string,articleId:string,value:Partial<SceneReference>){change(s=>Object.assign(s.find(s=>s.id===id)!.references.find(r=>r.articleId===articleId)!,value));}
function removeRef(id:string,articleId:string){change(s=>{const scene=s.find(s=>s.id===id)!;scene.references=scene.references.filter(r=>r.articleId!==articleId);});}
function select(a:Article,sceneId:string){change(s=>{const scene=s.find(s=>s.id===sceneId);if(scene&&scene.references.length<30&&!scene.references.some(r=>r.articleId===a.id)){scene.references.push({articleId:a.id,title:a.title,category:a.category,quantity:1,notes:'',...(a.npcId?{npcId:a.npcId}:{}),...(a.creatureId?{creatureId:a.creatureId}:{}),...(a.creatureId&&a.difficultyId?{difficultyId:a.difficultyId}:{})});addedNotice.value=`${a.title} ajouté à « ${scene.title} ».`;}});}
function filterTag(tag:string){tab.value='explore';query.value='tag:"'+tag.replaceAll('"','')+'"';}
function scrolled(e:Event){const el=e.target as HTMLElement;if(el.scrollTop+el.clientHeight>=el.scrollHeight-100&&tab.value==='explore')void more();}
function has(id:string){return props.modelValue.find(s=>s.id===active.value)?.references.some(r=>r.articleId===id);}
async function search(id:string){if(npcDirty.value&&!window.confirm('Abandonner les PNJ non enregistrés ?'))return;active.value=active.value===id?'':id;query.value='';category.value='';addedNotice.value='';results.value=[];tab.value='explore';const n=++librarySeq;if(!active.value)return;try{const r=await api<{favoriteItems:Article[];recentItems:Article[]}>('/api/compendium/library');if(n===librarySeq)library.value=r;}catch{if(n===librarySeq)library.value={favoriteItems:[],recentItems:[]};}}
async function more(){if(moreBusy.value||searching.value||results.value.length>=total.value)return;moreBusy.value=true;const n=generation;try{const r=await api<{items:Article[];total:number}>(`/api/compendium/search?q=${encodeURIComponent(query.value.trim())}&category=${encodeURIComponent(category.value)}&limit=15&offset=${results.value.length}`);if(n===generation){results.value.push(...r.items.filter(a=>!results.value.some(old=>old.id===a.id)));total.value=r.total;}}catch{if(n===generation)error.value='Impossible de charger les résultats suivants.';}finally{if(n===generation)moreBusy.value=false;}}

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
  <h3>Scènes <small v-if="!readonly">· facultatif</small></h3>
  <p v-if="!modelValue.length">Tes notes peuvent suffire. Ajoute une scène si tu veux la détailler.</p>
  <details v-for="(s,index) in modelValue" :key="s.id" class="scene" :open="readonly||expanded.includes(s.id)" @toggle="($event.target as HTMLDetailsElement).open ? !expanded.includes(s.id)&&expanded.push(s.id) : expanded=expanded.filter(id=>id!==s.id)">
   <summary>{{ index+1 }}. {{ s.title }} <small>{{ s.done?'· Jouée':'' }} · {{ s.references.length }} référence(s)</small><span class="scene-roster" v-if="s.references.length">{{ s.references.map(r=>`${r.quantity} × ${r.title}`).join(' · ') }}</span></summary>
   <div class="scene-body">
    <p v-if="encounter(s)" class="encounter-note"><strong>Pression du combat : {{ encounter(s) }}</strong><br />Estimation pour {{ groupSize||4 }} joueurs ; terrain, ressources et pouvoirs peuvent modifier la difficulté.</p>
    <label v-if="play" class="check"><input type="checkbox" :checked="s.done" @change="patch(s.id,{done:($event.target as HTMLInputElement).checked})" />Scène jouée</label>
    <template v-if="!readonly"><label>Titre de la scène<input :value="s.title" maxlength="120" required @input="patch(s.id,{title:value($event)})" /></label><label class="check"><input type="checkbox" :checked="s.done" @change="patch(s.id,{done:($event.target as HTMLInputElement).checked})" />Scène jouée</label><label>Notes de la scène<textarea :value="s.notes" rows="4" maxlength="6000" placeholder="Objectif, ambiance, indices, événements possibles…" @input="patch(s.id,{notes:value($event)})" /></label></template>
    <p v-else class="prose">{{ s.notes||'Aucune note.' }}</p>
    <div v-for="r in s.references" :key="r.articleId" class="reference">
     <div><small>{{ r.category }} · Quantité : {{ r.quantity }}</small><button v-if="r.npcId&&campaignId" type="button" @click="openedNpc=openedNpc===r.npcId?'':r.npcId">{{ r.title }} · {{ openedNpc===r.npcId?'Fermer la fiche':'Ouvrir la fiche' }}</button><button v-else-if="r.creatureId&&campaignId" type="button" @click="openedCreature=openedCreature===r.creatureId?'':r.creatureId">{{ r.title }} · {{ openedCreature===r.creatureId?'Fermer la fiche':'Ouvrir la fiche' }}</button><a v-else :href="`/compendium?article=${encodeURIComponent(r.articleId)}`" target="_blank" rel="noopener noreferrer">{{ r.title }} ↗</a></div>
     <CampaignNpcPreview v-if="r.npcId&&campaignId&&openedNpc===r.npcId" :key="r.npcId" :campaign-id="campaignId" :npc-id="r.npcId" /><CampaignCreaturePreview v-if="r.creatureId&&campaignId&&openedCreature===r.creatureId" :key="r.creatureId" :campaign-id="campaignId" :creature-id="r.creatureId" /><details v-if="!readonly" class="reference-options"><summary>Quantité et annotation</summary><label>Quantité<input type="number" :value="r.quantity" min="1" max="999" required @input="patchRef(s.id,r.articleId,{quantity:Number(value($event))})" /></label><label>Annotation privée<textarea :value="r.notes" rows="2" maxlength="2000" placeholder="Rôle dans la scène, particularités, informations à révéler…" @input="patchRef(s.id,r.articleId,{notes:value($event)})" /></label><button type="button" :aria-label="`Retirer ${r.title}`" @click="removeRef(s.id,r.articleId)">Retirer la référence</button></details><p v-else-if="r.notes" class="prose">{{ r.notes }}</p>
    </div>
    <template v-if="!readonly">
     <div class="actions"><button type="button" :disabled="s.references.length>=30" @click="search(s.id)">{{ active===s.id?'Fermer la recherche':'Ajouter une référence' }}</button><details class="scene-options"><summary>Options de la scène</summary><button type="button" :disabled="index===0" :aria-label="`Monter ${s.title}`" @click="move(index,-1)">↑</button><button type="button" :disabled="index===modelValue.length-1" :aria-label="`Descendre ${s.title}`" @click="move(index,1)">↓</button><button type="button" :disabled="modelValue.length>=30" @click="duplicate(s.id)">Dupliquer la scène</button><button type="button" @click="remove(s.id)">Retirer la scène</button></details></div>
     <div v-if="active===s.id" class="picker">
      <strong>Pages du Compendium</strong><p v-if="addedNotice" role="status">{{ addedNotice }}</p>
      <label>Rechercher une référence<input v-model="query" type="search" maxlength="100" placeholder="Nom, tag, faction, lieu…" /></label>
      <div class="actions" role="group" aria-label="Besoin de la scène"><button v-for="(label,key) in {'':'Toutes les pages',Personnages:'Un PNJ',Bestiaire:'Une créature',Règles:'Une règle'}" :key="key" type="button" :aria-pressed="category===key" @click="category=String(key)">{{ label }}</button></div>


      <small>Parcours la liste ou cherche par nom et par tag. Clique sur un tag pour filtrer.</small>
      <div class="actions" role="group" aria-label="Origine des références"><button v-for="(label,key) in {explore:'Explorer',dossier:'Déjà dans la campagne',favorites:'Mes favoris',recent:'Mes lectures récentes'}" :key="key" type="button" :aria-pressed="tab===key" @click="switchTab(String(key))">{{ label }}</button><button v-if="campaignId" type="button" :aria-pressed="tab==='npcs'" @click="switchTab('npcs')">Mes PNJ de campagne</button><button v-if="campaignId" type="button" :aria-pressed="tab==='bestiary'" @click="switchTab('bestiary')">Mon bestiaire de campagne</button></div>
      <CampaignNpcs v-if="tab==='npcs'&&campaignId" :campaign-id="campaignId" selectable :selection-full="s.references.length>=30" :selected-ids="s.references.map(r=>r.npcId||'')" @select="selectNpc($event,s.id)" @dirty="npcChanged" />
      <CampaignBestiary v-if="tab==='bestiary'&&campaignId" :campaign-id="campaignId" :group-size="groupSize" selectable :selection-full="s.references.length>=30" :selected-ids="s.references.map(r=>r.creatureId||'')" @select="selectCreature($event,s.id)" @dirty="npcChanged" />
      <p v-if="tab==='explore'&&searching" role="status">Recherche…</p><p v-else-if="error" role="alert">{{ error }}</p><p v-else-if="tab==='explore'&&!results.length">Aucun résultat. Essaie un terme plus court ou « Tout le Compendium ».</p><p v-else-if="tab!=='explore'&&tab!=='npcs'&&tab!=='bestiary'&&!suggestions.length">Aucune référence ici pour ces critères.</p>
      <small v-if="tab==='explore'&&!searching">{{ total }} résultat(s) · {{ results.length }} affiché(s)</small>
      <div v-if="tab!=='npcs'&&tab!=='bestiary'" class="results-list" tabindex="0" role="region" aria-label="Pages à ajouter" @scroll="scrolled">
       <div v-for="a in tab==='explore'?results:suggestions" :key="a.id" class="result">
        <div><strong>{{ a.title }}</strong><small>{{ a.category }}{{ a.group?' · '+a.group:'' }}</small><p>{{ a.snippet }}</p><div class="tags"><button v-for="tag in (a.tags||[]).slice(0,5)" :key="tag" type="button" @click="filterTag(tag)">{{ tag }}</button></div><button v-if="a.npcId" type="button" @click="openedNpc=a.npcId">Consulter le PNJ</button><CampaignNpcPreview v-if="a.npcId&&campaignId&&openedNpc===a.npcId" :key="a.npcId" :campaign-id="campaignId" :npc-id="a.npcId" /><button v-if="a.creatureId" type="button" @click="openedCreature=a.creatureId">Consulter la créature</button><CampaignCreaturePreview v-if="a.creatureId&&campaignId&&openedCreature===a.creatureId" :key="a.creatureId" :campaign-id="campaignId" :creature-id="a.creatureId" /><a v-if="!a.npcId&&!a.creatureId" :href="`/compendium?article=${encodeURIComponent(a.id)}`" target="_blank" rel="noopener noreferrer">Consulter avant d’ajouter ↗</a></div>
        <button type="button" :disabled="has(a.id)||s.references.length>=30" :aria-label="`Ajouter ${a.title}`" @click="select(a,s.id)">{{ has(a.id)?'Ajouté à cette scène':'Ajouter à la scène' }}</button>
       </div>
       <button v-if="tab==='explore'&&results.length<total" type="button" :disabled="moreBusy" @click="more">{{ moreBusy?'Chargement…':'Voir d’autres résultats' }}</button>
      </div>
     </div>
    </template>
   </div>
  </details>
  <div v-if="!readonly" class="actions"><button type="button" :disabled="modelValue.length>=30" @click="add()">Ajouter une scène</button><details class="templates"><summary>Utiliser une trame</summary><button v-for="kind in ['Enquête','Rencontre','Combat']" :key="kind" type="button" :disabled="modelValue.length>=30" @click="add(kind)">Préparer : {{ kind }}</button></details></div>
 </div>
</template>
<style scoped>
.results-list{max-height:380px;overflow-y:auto;overscroll-behavior:contain;border:1px solid #405875;border-radius:6px;padding:0 10px}.tags{display:flex;flex-wrap:wrap;gap:5px}.tags button{font-size:12px;padding:4px 8px;min-height:30px}.result p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.reference-options>summary,.templates>summary,.scene-options>summary{cursor:pointer;min-height:44px;align-content:center}.reference-options[open]{display:grid;gap:10px}.scene-roster{display:block;margin-top:8px;color:#a3eaff;overflow-wrap:anywhere}.selected-references{padding:12px;border:1px solid #477080;background:#102634}.selected-references ul{margin:8px 0;padding-left:20px}.preparation{min-width:0;color:#eaf2ff}.preparation p{line-height:1.6;color:#b5c8dc}.scene{border:1px solid #3c4a65;border-radius:6px;margin:12px 0}.scene>summary{cursor:pointer;padding:14px;min-height:44px;box-sizing:border-box;color:#d3c2f4}.scene-body{padding:14px;display:grid;gap:12px}.scene-body label,.picker label{display:grid;gap:7px;font-size:14px}.scene-body input:not([type=checkbox]),.scene-body textarea,.scene-body select{width:100%;min-width:0;box-sizing:border-box;background:#08131f;color:#edf4ff;border:1px solid #405875;border-radius:6px;padding:11px;font:inherit;min-height:44px}.scene-body textarea{resize:vertical}.scene-body .check{display:flex;align-items:center;gap:10px;min-height:44px}.check input{width:20px;height:20px;accent-color:#a3eaff}.reference{display:grid;gap:10px;border-left:2px solid #8773b6;padding:12px;background:#101e30}.reference label:has(input){max-width:140px}.reference a{color:#a3eaff;overflow-wrap:anywhere}.reference small{display:block;color:#a5b9cf;line-height:1.6}.prose{white-space:pre-wrap}.actions{display:flex;flex-wrap:wrap;gap:8px}.preparation button{min-height:44px;padding:10px 14px;background:#101e30;color:#eaf2ff;border:1px solid #405875;border-radius:6px;cursor:pointer;font:inherit}.preparation button[aria-pressed=true]{border-color:#a3eaff;background:#173547}.picker a{color:#a3eaff}.preparation button:disabled{opacity:.5;cursor:default}.picker{display:grid;gap:14px;padding:14px;border:1px solid #477080;border-radius:6px}.result{display:flex;align-items:center;gap:12px;justify-content:space-between;border-bottom:1px solid #293d52;padding:12px 0}.result>div{min-width:0}.result p{font-size:13px}.result small{display:block;color:#a3b7cc}button:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}@media(max-width:600px){.result{align-items:stretch;flex-direction:column}.scene-body,.picker{padding:10px}}
.encounter-note{padding:12px;border:1px solid #487080;border-radius:6px;background:#122839}
</style>
