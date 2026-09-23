<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref} from 'vue';
import {onBeforeRouteLeave} from 'vue-router';
import CampaignPreparation from './CampaignPreparation.vue';
import CampaignSessionEffects from './CampaignSessionEffects.vue';
import type {CampaignScene} from '../../../api/src/campaign-preparation';
import {api,ApiError} from '../lib/api';
type Reward={characterId:string;characterName:string;xp:number;ptv:number;awardedAt:string};
type Session={scenes?:CampaignScene[];effects?:any[];id:string;title:string;playedOn:string|null;status:'planned'|'played';preparation?:string;report:string;published:boolean;version:number;rewards:Reward[]};
const props=defineProps<{campaignId:string;canManage:boolean;archived:boolean;members:{status:string;characterId:string|null;characterName:string|null}[]}>();
const sessions=ref<Session[]>([]),hasMore=ref(false),loading=ref(false),busy=ref(false),error=ref(''),notice=ref('');
const editing=ref<string|null>(null),baseline=ref('');
const blank=()=>({scenes:[] as CampaignScene[],title:'',playedOn:'',status:'planned' as 'planned'|'played',preparation:'',report:'',published:false,version:1});
const draft=ref(blank()),dirty=computed(()=>editing.value!==null&&JSON.stringify(draft.value)!==baseline.value);
const awarding=ref<string|null>(null),selected=ref<string[]>([]),xp=ref(0),ptv=ref(0);
const eligible=computed(()=>props.members.filter(m=>m.status==='accepted'&&m.characterId&&!sessions.value.find(s=>s.id===awarding.value)?.rewards.some(r=>r.characterId===m.characterId)));
const endpoint=`/api/campaigns/${props.campaignId}/sessions`;
let generation=0;
function failure(e:unknown){
 const messages:Record<string,string>={session_version_conflict:'Cette séance a changé ailleurs. Ton texte est conservé : copie-le avant de recharger.',rewards_already_applied:'Une des fiches a déjà reçu les récompenses de cette séance. Actualise la liste avant de réessayer.',reward_recipient_unavailable:'Une fiche n’est plus rattachée à cette campagne. Actualise la page.',invalid_character_progression:'Une fiche contient un total de progression invalide. Aucune récompense n’a été appliquée.',session_not_played:'Marque d’abord la séance comme jouée.',invalid_session:'Vérifie les champs et la date de la séance.',invalid_rewards:'Choisis au moins un personnage et des montants entiers positifs.'};
 error.value=messages[e instanceof Error?e.message:'']||'Impossible de terminer cette action. Réessaie.';
 if(e instanceof ApiError&&[401,403,404].includes(e.status)){sessions.value=[];editing.value=null;draft.value=blank();awarding.value=null;error.value='Ces séances ne sont plus accessibles avec ton compte.';}
}
async function load(more=false){
 const seq=++generation;loading.value=true;error.value='';
 try{const r=await api<{sessions:Session[];hasMore:boolean}>(`${endpoint}?offset=${more?sessions.value.length:0}`);if(seq!==generation)return;sessions.value=more?[...sessions.value,...r.sessions.filter(s=>!sessions.value.some(old=>old.id===s.id))]:r.sessions;hasMore.value=r.hasMore;}
 catch(e){if(seq===generation)failure(e);}finally{if(seq===generation)loading.value=false;}
}
function edit(s?:Session){
 if(dirty.value&&!window.confirm('Abandonner les modifications de séance non enregistrées ?'))return;
 draft.value=s?{scenes:JSON.parse(JSON.stringify(s.scenes||[])),title:s.title,playedOn:s.playedOn||'',status:s.status,preparation:s.preparation||'',report:s.report,published:s.published,version:s.version}:blank();
 baseline.value=JSON.stringify(draft.value);editing.value=s?.id||'new';awarding.value=null;error.value='';notice.value='';
}
function cancel(){if(dirty.value&&!window.confirm('Abandonner les modifications non enregistrées ?'))return;editing.value=null;}
async function save(){
 if(busy.value)return;busy.value=true;error.value='';notice.value='';
 try{await api(editing.value==='new'?endpoint:`${endpoint}/${editing.value}`,{method:editing.value==='new'?'POST':'PATCH',body:JSON.stringify({...draft.value,playedOn:draft.value.playedOn||null})});editing.value=null;notice.value='Séance enregistrée.';await load();}catch(e){failure(e);}finally{busy.value=false;}
}
function prepareRewards(s:Session){awarding.value=s.id;selected.value=[];xp.value=0;ptv.value=0;notice.value='';error.value='';}
const validRewards=computed(()=>selected.value.length>0&&[xp.value,ptv.value].every(n=>Number.isSafeInteger(n)&&n>=0&&n<=100000)&&xp.value+ptv.value>0);
async function award(){
 if(busy.value||!validRewards.value)return;
 const names=eligible.value.filter(m=>selected.value.includes(m.characterId!)).map(m=>m.characterName||'Personnage').join(', ');
 if(!window.confirm(`Attribuer ${xp.value} XP et ${ptv.value} PTV à chaque personnage : ${names} ?\n\nCes points seront ajoutés à leurs fiches et à leur historique. Cette attribution ne peut pas être répétée pour la même séance.`))return;
 busy.value=true;error.value='';notice.value='';
 try{await api(`${endpoint}/${awarding.value}/rewards`,{method:'POST',body:JSON.stringify({characterIds:selected.value,xp:xp.value,ptv:ptv.value})});awarding.value=null;notice.value='Récompenses ajoutées aux fiches et à leur historique.';await load();}catch(e){failure(e);}finally{busy.value=false;}
}
function beforeUnload(e:BeforeUnloadEvent){if(dirty.value){e.preventDefault();e.returnValue='';}}
onBeforeRouteLeave(()=>!dirty.value||window.confirm('Quitter sans enregistrer la séance ?'));
onMounted(()=>{void load();window.addEventListener('beforeunload',beforeUnload);});
onUnmounted(()=>{generation++;window.removeEventListener('beforeunload',beforeUnload);});
</script>
<template>
 <section class="sessions" aria-label="Séances de campagne">
  <div class="heading"><div><h2>Les séances</h2><p>{{ canManage?'Prépare ta table, partage le récit et attribue les récompenses.':'Les rendez-vous, comptes rendus et récompenses de ta table.' }}</p></div><button v-if="canManage&&!archived" :disabled="busy" class="primary" @click="edit()">Préparer une séance</button></div>
  <p v-if="error" role="alert" class="feedback">{{ error }}</p><p v-if="notice" role="status" class="feedback">{{ notice }}</p>
  <form v-if="editing!==null&&canManage&&!archived" class="editor" @submit.prevent="save">
   <h3>{{ editing==='new'?'Nouvelle séance':'Modifier la séance' }}</h3>
   <label>Titre de la séance<input v-model="draft.title" required maxlength="120" /></label>
   <div class="fields"><label>Date prévue ou jouée<input v-model="draft.playedOn" type="date" /></label><label>État de la séance<select v-model="draft.status" aria-label="État de la séance"><option value="planned">À jouer</option><option value="played">Jouée</option></select></label></div>
   <label>Préparation privée du MJ<textarea v-model="draft.preparation" rows="6" maxlength="20000" placeholder="Scènes, indices, PNJ et secrets…" /></label><small>Seul le MJ de cette campagne peut lire cette préparation. Le titre et la date sont visibles par le groupe.</small>
   <CampaignPreparation v-model="draft.scenes" />
   <label>Compte rendu de la séance<textarea v-model="draft.report" rows="5" maxlength="20000" /></label>
   <label class="check"><input v-model="draft.published" type="checkbox" />Publier ce compte rendu pour le groupe</label><small>Décoché, le texte reste un brouillon réservé au MJ.</small>
   <div class="actions"><button class="primary" :disabled="busy||!draft.title.trim()">Enregistrer la séance</button><button type="button" :disabled="busy" @click="cancel">Annuler</button></div><small v-if="dirty">Modifications non enregistrées.</small>
  </form>
  <p v-if="loading" role="status">Chargement des séances…</p>
  <p v-else-if="!sessions.length&&!error">{{ canManage?'Aucune séance pour le moment. Prépare la première pour réunir tes notes et le récit de la table.':'Ton MJ n’a pas encore préparé de séance.' }}</p>
  <details v-for="s in sessions" :key="s.id" class="session">
   <summary><span><strong>{{ s.title }}</strong><small>{{ s.playedOn?s.playedOn.split('-').reverse().join('/'):'Date à préciser' }} · {{ s.status==='played'?'Jouée':'À jouer' }} · {{ s.published?'Compte rendu publié':'Compte rendu non publié' }}</small></span></summary>
   <div class="body">
    <details v-if="canManage" class="private"><summary>Préparation privée du MJ</summary><p class="prose">{{ s.preparation||'Aucune préparation enregistrée.' }}</p><CampaignPreparation :model-value="s.scenes||[]" readonly /></details>
    <h3>Compte rendu {{ !s.published&&canManage?'· Brouillon privé':'' }}</h3><p class="prose">{{ s.report||(s.published?'Aucun texte publié.':'Le compte rendu n’est pas encore publié.') }}</p>
    <div v-if="canManage&&!archived" class="actions"><button :disabled="busy" @click="edit(s)">Modifier la séance</button><button v-if="s.status==='played'" :disabled="busy" @click="prepareRewards(s)">Attribuer les récompenses</button><small v-else>Les récompenses s’ouvrent une fois la séance marquée « Jouée ».</small></div>
    <details v-if="s.rewards.length" class="rewards"><summary>Récompenses attribuées · {{ s.rewards.length }}</summary><div v-for="r in s.rewards" :key="r.characterId" class="reward-row"><strong>{{ r.characterName }}</strong><span>{{ r.xp }} XP · {{ r.ptv }} PTV</span><small>{{ new Date(r.awardedAt).toLocaleDateString('fr-FR') }}</small></div></details>
    <CampaignSessionEffects :campaign-id="campaignId" :session-id="s.id" :can-manage="canManage&&!archived&&s.status==='played'" :effects="s.effects||[]" @applied="load()" />
    <form v-if="awarding===s.id&&canManage&&!archived" class="editor" @submit.prevent="award">
     <h3>Récompenses de cette séance</h3><p>Les points sont ajoutés à la progression de chaque personnage sélectionné. Chaque fiche ne peut être récompensée qu’une fois par séance.</p>
     <fieldset><legend>Personnages à récompenser</legend><label v-for="m in eligible" :key="m.characterId!" class="check"><input v-model="selected" type="checkbox" :value="m.characterId" />{{ m.characterName||'Personnage' }}</label><p v-if="!eligible.length">Aucune nouvelle fiche rattachée à récompenser.</p></fieldset>
     <div class="fields"><label>XP par personnage<input v-model.number="xp" type="number" min="0" max="100000" step="1" required /></label><label>PTV par personnage<input v-model.number="ptv" type="number" min="0" max="100000" step="1" required /></label></div>
     <p aria-live="polite">{{ selected.length }} personnage(s) · {{ xp||0 }} XP et {{ ptv||0 }} PTV chacun</p><div class="actions"><button class="primary" :disabled="busy||!validRewards">Confirmer l’attribution</button><button type="button" :disabled="busy" @click="awarding=null">Annuler l’attribution</button></div>
    </form>
   </div>
  </details>
  <div class="actions"><button v-if="hasMore" :disabled="loading||busy||dirty" @click="load(true)">Séances précédentes</button><button :disabled="loading||busy||dirty" @click="load()">Actualiser les séances</button></div>
 </section>
</template>
<style scoped>
.sessions{margin:24px 0;padding:22px;background:#0e1b2c;border:1px solid #2e455d;border-radius:10px;color:#eaf2ff;overflow-wrap:anywhere}.heading,.actions,.reward-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.actions{justify-content:flex-start;margin-top:16px}h2{font-size:20px;margin:0}h3{font-size:16px}p{line-height:1.65;color:#b5c8dc}small{display:block;color:#a3b7cc;line-height:1.6}button{min-height:44px;padding:10px 16px;border:1px solid #405875;border-radius:6px;background:#101e30;color:#eaf2ff;cursor:pointer;font:inherit}.primary{background:#a3eaff;color:#071725;border-color:#a3eaff;font-weight:600}button:disabled{opacity:.5;cursor:default}.editor{display:grid;gap:14px;margin:20px 0;padding:20px;border:1px solid #486077;border-radius:8px;background:#091420}.editor label{display:grid;gap:8px;font-size:14px}.editor input:not([type=checkbox]),.editor textarea,.editor select{box-sizing:border-box;width:100%;min-width:0;min-height:44px;padding:12px;background:#08131f;color:#edf4ff;border:1px solid #405875;border-radius:6px;font:inherit}.editor textarea{resize:vertical}.fields{display:grid;grid-template-columns:1fr 1fr;gap:14px}.editor .check{display:flex;align-items:center;gap:12px;min-height:44px}.check input{width:20px;height:20px;flex-shrink:0;accent-color:#a3eaff}fieldset{min-width:0;border:1px solid #405875;border-radius:6px}.session{margin:12px 0;border:1px solid #354a63;border-radius:8px}.session>summary{padding:16px;display:list-item}.session>summary span{display:inline-block;vertical-align:middle;max-width:90%}.session small{margin-top:5px}summary{min-height:44px;align-content:center;cursor:pointer;box-sizing:border-box}.body{padding:0 18px 18px;border-top:1px solid #293d52}.private,.rewards{padding:10px 0}.private{color:#cbb7ef}.prose{white-space:pre-wrap}.reward-row{padding:12px 0;border-bottom:1px solid #293d52}.feedback{border:1px solid #62758f;padding:14px;border-radius:6px}button:focus-visible,summary:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}@media(max-width:640px){.sessions{padding:16px}.fields{grid-template-columns:1fr}.editor{padding:14px}.heading{align-items:stretch;flex-direction:column}.actions>button{flex:1}.body{padding-inline:12px}}
</style>
