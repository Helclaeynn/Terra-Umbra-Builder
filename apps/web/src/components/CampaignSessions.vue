<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref} from 'vue';
import {onBeforeRouteLeave} from 'vue-router';
import CampaignPreparation from './CampaignPreparation.vue';
import CampaignSessionEffects from './CampaignSessionEffects.vue';
import type {CampaignScene} from '../../../api/src/campaign-preparation';
import {api,ApiError} from '../lib/api';
type Reward={characterId:string;characterName:string;xp:number;ptv:number;awardedAt:string};
type Session={startsAt?:string|null;endsAt?:string|null;location?:string;scenes?:CampaignScene[];effects?:any[];id:string;title:string;playedOn:string|null;status:'planned'|'played';preparation?:string;report:string;published:boolean;version:number;rewards:Reward[]};
const props=defineProps<{campaignId:string;canManage:boolean;archived:boolean;members:{admissionStatus?:string;status:string;characterId:string|null;characterName:string|null}[]}>();
const sessions=ref<Session[]>([]),hasMore=ref(false),loading=ref(false),busy=ref(false),error=ref(''),notice=ref('');
const editing=ref<string|null>(null),baseline=ref('');
const mailAvailable=ref(false),notifyPlayers=ref(false);
const localTimezone=Intl.DateTimeFormat().resolvedOptions().timeZone;
function localInput(value?:string|null){if(!value)return '';const d=new Date(value);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);}
const blank=()=>({startsAt:'',endsAt:'',location:'',scenes:[] as CampaignScene[],title:'',playedOn:'',status:'planned' as 'planned'|'played',preparation:'',report:'',published:false,version:1});
const draft=ref(blank()),dirty=computed(()=>editing.value!==null&&JSON.stringify(draft.value)!==baseline.value);
const awarding=ref<string|null>(null),selected=ref<string[]>([]),xp=ref(3),ptv=ref(0),amounts=ref<Record<string,{xp:number;ptv:number}>>({});
const eligible=computed(()=>props.members.filter(m=>m.status==='accepted'&&m.admissionStatus==='approved'&&m.characterId&&!sessions.value.find(s=>s.id===awarding.value)?.rewards.some(r=>r.characterId===m.characterId)));
function common(kind:'xp'|'ptv',value:number){if(kind==='xp')xp.value=value;else ptv.value=value;for(const row of Object.values(amounts.value))row[kind]=value;}
const rewardRows=computed(()=>selected.value.map(characterId=>({characterId,...amounts.value[characterId]})));
const endpoint=`/api/campaigns/${props.campaignId}/sessions`;
let generation=0;
function failure(e:unknown){
 const messages:Record<string,string>={session_version_conflict:'Cette séance a changé ailleurs. Ton texte est conservé : copie-le avant de recharger.',rewards_already_applied:'Une des fiches a déjà reçu les récompenses de cette séance. Actualise la liste avant de réessayer.',reward_recipient_unavailable:'Une fiche n’est plus rattachée à cette campagne. Actualise la page.',invalid_character_progression:'Une fiche contient un total de progression invalide. Aucune récompense n’a été appliquée.',session_not_played:'Marque d’abord la séance comme jouée.',calendar_date_required:'Une date et une séance à jouer sont nécessaires pour envoyer les invitations.',calendar_mail_unavailable:'L’envoi d’e-mails est indisponible. La séance reste enregistrée.',calendar_send_in_progress:'Un envoi est déjà en cours pour cette séance.',invalid_session:'Vérifie les champs et la date de la séance.',invalid_rewards:'Choisis au moins un personnage et des montants entiers positifs.'};
 error.value=messages[e instanceof Error?e.message:'']||'Impossible de terminer cette action. Réessaie.';
 if(e instanceof ApiError&&[401,403,404].includes(e.status)){sessions.value=[];editing.value=null;draft.value=blank();awarding.value=null;error.value='Ces séances ne sont plus accessibles avec ton compte.';}
}
async function load(more=false){
 const seq=++generation;loading.value=true;error.value='';
 try{const r=await api<{sessions:Session[];hasMore:boolean;calendarMailAvailable:boolean}>(`${endpoint}?offset=${more?sessions.value.length:0}`);if(seq!==generation)return;sessions.value=more?[...sessions.value,...r.sessions.filter(s=>!sessions.value.some(old=>old.id===s.id))]:r.sessions;hasMore.value=r.hasMore;mailAvailable.value=r.calendarMailAvailable;}
 catch(e){if(seq===generation)failure(e);}finally{if(seq===generation)loading.value=false;}
}
function edit(s?:Session){
 if(dirty.value&&!window.confirm('Abandonner les modifications de séance non enregistrées ?'))return;
 notifyPlayers.value=!s&&mailAvailable.value;
 draft.value=s?{startsAt:localInput(s.startsAt),endsAt:localInput(s.endsAt),location:s.location||'',scenes:JSON.parse(JSON.stringify(s.scenes||[])),title:s.title,playedOn:s.playedOn||'',status:s.status,preparation:s.preparation||'',report:s.report,published:s.published,version:s.version}:blank();
 baseline.value=JSON.stringify(draft.value);editing.value=s?.id||'new';awarding.value=null;error.value='';notice.value='';
}
function cancel(){if(dirty.value&&!window.confirm('Abandonner les modifications non enregistrées ?'))return;editing.value=null;}
async function sendInvitations(s:{id:string;version:number}){
 const r=await api<{sent:number;failed:number;alreadySent:number;uncertain:number;total:number}>(`${endpoint}/${s.id}/calendar-invitations`,{method:'POST',body:JSON.stringify({version:s.version})});
 notice.value=`Séance enregistrée. Invitations : ${r.sent} envoyée(s), ${r.alreadySent} déjà envoyée(s).`;
 if(!r.total)notice.value+=' Aucun joueur n’a encore accepté la campagne.';
 if(r.failed)error.value=`${r.failed} invitation(s) non envoyée(s). Tu peux réessayer : les envois réussis seront conservés.`;
 if(r.uncertain)error.value=`${r.uncertain} envoi(s) en cours ou à vérifier. Aucun doublon n’a été envoyé.`;
}
async function invite(s:Session){if(busy.value)return;busy.value=true;error.value='';try{await sendInvitations(s);}catch(e){failure(e);}finally{busy.value=false;}}
async function save(){
 if(busy.value)return;busy.value=true;error.value='';notice.value='';
 try{
  const body={...draft.value,playedOn:draft.value.startsAt?draft.value.startsAt.slice(0,10):draft.value.playedOn||null,startsAt:draft.value.startsAt?new Date(draft.value.startsAt).toISOString():null,endsAt:draft.value.endsAt?new Date(draft.value.endsAt).toISOString():null};
  const send=notifyPlayers.value&&draft.value.status==='planned'&&!!(draft.value.playedOn||draft.value.startsAt);
  const r=await api<{session:{id:string;version:number}}>(editing.value==='new'?endpoint:`${endpoint}/${editing.value}`,{method:editing.value==='new'?'POST':'PATCH',body:JSON.stringify(body)});
  editing.value=null;notice.value='Séance enregistrée.';await load();
  if(send)await sendInvitations(r.session);
 }catch(e){failure(e);}finally{busy.value=false;}
}
function prepareRewards(s:Session){awarding.value=s.id;xp.value=3;ptv.value=0;selected.value=eligible.value.map(m=>m.characterId!);amounts.value=Object.fromEntries(eligible.value.map(m=>[m.characterId!,{xp:3,ptv:0}]));notice.value='';error.value='';}
const validRewards=computed(()=>rewardRows.value.length>0&&rewardRows.value.every(r=>[r.xp,r.ptv].every(n=>Number.isSafeInteger(n)&&n>=0&&n<=100000)&&r.xp+r.ptv>0));
async function award(){
 if(busy.value||!validRewards.value)return;
 const lines=rewardRows.value.map(r=>`${eligible.value.find(m=>m.characterId===r.characterId)?.characterName||'Personnage'} : ${r.xp} XP · ${r.ptv} PTV`).join('\n');
 if(!window.confirm(`Attribuer ces récompenses ?\n\n${lines}\n\nCes points seront ajoutés aux fiches et à leur historique. Cette attribution ne peut pas être répétée pour la même séance.`))return;
 busy.value=true;error.value='';notice.value='';
 try{await api(`${endpoint}/${awarding.value}/rewards`,{method:'POST',body:JSON.stringify({rewards:rewardRows.value})});awarding.value=null;notice.value='Récompenses ajoutées aux fiches et à leur historique.';await load();}catch(e){failure(e);}finally{busy.value=false;}
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
   <div class="fields"><label>Date prévue ou jouée<input v-model="draft.playedOn" type="date" :disabled="!!draft.startsAt" :required="notifyPlayers&&draft.status==='planned'&&!draft.startsAt" /></label><label>État de la séance<select v-model="draft.status" aria-label="État de la séance"><option value="planned">À jouer</option><option value="played">Jouée</option></select></label></div>
   <div class="fields"><label>Début de la séance<input v-model="draft.startsAt" type="datetime-local" :required="!!draft.endsAt" @input="draft.playedOn=draft.startsAt.slice(0,10)" /></label><label>Fin de la séance<input v-model="draft.endsAt" type="datetime-local" :min="draft.startsAt" :required="!!draft.startsAt" /></label></div>
   <small>Horaires dans ton fuseau : {{ localTimezone }}. Sans horaire, l’invitation occupe la journée indiquée.</small>
   <label>Lieu ou lien de visioconférence<input v-model="draft.location" maxlength="1000" /></label>
   <label v-if="draft.status==='planned'" class="check"><input v-model="notifyPlayers" type="checkbox" :disabled="!mailAvailable" />Envoyer une invitation calendrier aux joueurs en enregistrant</label><small v-if="draft.status==='planned'">{{ mailAvailable?'Envoi individuel aux joueurs ayant accepté la campagne. Une date est nécessaire. Les notes privées et les scènes restent dans ton espace MJ.':'L’envoi d’e-mails n’est pas configuré ; tu peux enregistrer la séance.' }}</small>
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
   <div class="body"><p v-if="s.startsAt">{{ new Date(s.startsAt).toLocaleString('fr-FR') }} → {{ s.endsAt?new Date(s.endsAt).toLocaleString('fr-FR'):'' }} · {{ localTimezone }}</p><p v-if="s.location">Lieu : {{ s.location }}</p>
    <details v-if="canManage" class="private" open><summary>Préparation privée du MJ</summary><p class="prose">{{ s.preparation||'Aucune préparation enregistrée.' }}</p><CampaignPreparation :model-value="s.scenes||[]" readonly /></details>
    <h3>Compte rendu {{ !s.published&&canManage?'· Brouillon privé':'' }}</h3><p class="prose">{{ s.report||(s.published?'Aucun texte publié.':'Le compte rendu n’est pas encore publié.') }}</p>
    <div v-if="canManage&&!archived" class="actions"><button :disabled="busy" @click="edit(s)">Modifier la séance</button><button v-if="s.status==='planned'&&s.playedOn&&mailAvailable" :disabled="busy" @click="invite(s)">Envoyer les invitations calendrier</button><button v-if="s.status==='played'" :disabled="busy" @click="prepareRewards(s)">Attribuer les récompenses</button><small v-else>Les récompenses s’ouvrent une fois la séance marquée « Jouée ».</small></div>
    <details v-if="s.rewards.length" class="rewards"><summary>Récompenses attribuées · {{ s.rewards.length }}</summary><div v-for="r in s.rewards" :key="r.characterId" class="reward-row"><strong>{{ r.characterName }}</strong><span>{{ r.xp }} XP · {{ r.ptv }} PTV</span><small>{{ new Date(r.awardedAt).toLocaleDateString('fr-FR') }}</small></div></details>
    <CampaignSessionEffects :campaign-id="campaignId" :session-id="s.id" :can-manage="canManage&&!archived&&s.status==='played'" :effects="s.effects||[]" @applied="load()" />
    <form v-if="awarding===s.id&&canManage&&!archived" class="editor" @submit.prevent="award">
     <h3>Récompenses de cette séance</h3><p>Les points sont ajoutés à la progression de chaque personnage sélectionné. Chaque fiche ne peut être récompensée qu’une fois par séance.</p>
     <div class="presets" role="group" aria-label="Barème XP de la séance"><button type="button" :aria-pressed="xp===2" @click="common('xp',2)">Courte / transition · 2 XP</button><button type="button" :aria-pressed="xp===3" @click="common('xp',3)">Normale · 3 XP</button><button type="button" :aria-pressed="xp===4" @click="common('xp',4)">Finale / événement majeur · 4 XP</button></div>
     <div class="fields"><label>XP par personnage<input :value="xp" type="number" min="0" max="100000" step="1" required @input="common('xp',Number(($event.target as HTMLInputElement).value))" /></label><label>PTV par personnage<input :value="ptv" type="number" min="0" max="100000" step="1" required @input="common('ptv',Number(($event.target as HTMLInputElement).value))" /></label></div>
     <div class="presets" role="group" aria-label="PTV communs"><button v-for="n in [0,1,2,3]" :key="n" type="button" :aria-pressed="ptv===n" @click="common('ptv',n)">{{ n }} PTV pour tous</button></div>
     <p>Le barème commun s’applique à toutes les fiches ci-dessous. Ajuste ensuite les exceptions ou décoche les absents.</p>
     <fieldset><legend>Détail par personnage</legend><div v-for="m in eligible" :key="m.characterId!" class="individual-reward"><label class="check"><input v-model="selected" type="checkbox" :value="m.characterId" />{{ m.characterName||'Personnage' }}</label><div class="fields" v-if="amounts[m.characterId!]"><label>XP · {{ m.characterName }}<input v-model.number="amounts[m.characterId!].xp" :disabled="!selected.includes(m.characterId!)" type="number" min="0" max="100000" step="1" required /></label><label>PTV · {{ m.characterName }}<input v-model.number="amounts[m.characterId!].ptv" :disabled="!selected.includes(m.characterId!)" type="number" min="0" max="100000" step="1" required /></label></div></div><p v-if="!eligible.length">Aucune nouvelle fiche acceptée par le MJ à récompenser.</p></fieldset>
     <p aria-live="polite">{{ selected.length }} personnage(s) sélectionné(s). Vérifie les montants individuels avant de confirmer.</p><div class="actions"><button class="primary" :disabled="busy||!validRewards">Confirmer l’attribution</button><button type="button" :disabled="busy" @click="awarding=null">Annuler l’attribution</button></div>
    </form>
   </div>
  </details>
  <div class="actions"><button v-if="hasMore" :disabled="loading||busy||dirty" @click="load(true)">Séances précédentes</button><button :disabled="loading||busy||dirty" @click="load()">Actualiser les séances</button></div>
 </section>
</template>
<style scoped>
.presets{display:flex;gap:10px;flex-wrap:wrap}.presets button[aria-pressed=true]{border-color:#a3eaff;background:#173547}.individual-reward{padding:12px 0;border-bottom:1px solid #405875}.sessions{margin:24px 0;padding:22px;background:#0e1b2c;border:1px solid #2e455d;border-radius:10px;color:#eaf2ff;overflow-wrap:anywhere}.heading,.actions,.reward-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.actions{justify-content:flex-start;margin-top:16px}h2{font-size:20px;margin:0}h3{font-size:16px}p{line-height:1.65;color:#b5c8dc}small{display:block;color:#a3b7cc;line-height:1.6}button{min-height:44px;padding:10px 16px;border:1px solid #405875;border-radius:6px;background:#101e30;color:#eaf2ff;cursor:pointer;font:inherit}.primary{background:#a3eaff;color:#071725;border-color:#a3eaff;font-weight:600}button:disabled{opacity:.5;cursor:default}.editor{display:grid;gap:14px;margin:20px 0;padding:20px;border:1px solid #486077;border-radius:8px;background:#091420}.editor label{display:grid;gap:8px;font-size:14px}.editor input:not([type=checkbox]),.editor textarea,.editor select{box-sizing:border-box;width:100%;min-width:0;min-height:44px;padding:12px;background:#08131f;color:#edf4ff;border:1px solid #405875;border-radius:6px;font:inherit}.editor textarea{resize:vertical}.fields{display:grid;grid-template-columns:1fr 1fr;gap:14px}.editor .check{display:flex;align-items:center;gap:12px;min-height:44px}.check input{width:20px;height:20px;flex-shrink:0;accent-color:#a3eaff}fieldset{min-width:0;border:1px solid #405875;border-radius:6px}.session{margin:12px 0;border:1px solid #354a63;border-radius:8px}.session>summary{padding:16px;display:list-item}.session>summary span{display:inline-block;vertical-align:middle;max-width:90%}.session small{margin-top:5px}summary{min-height:44px;align-content:center;cursor:pointer;box-sizing:border-box}.body{padding:0 18px 18px;border-top:1px solid #293d52}.private,.rewards{padding:10px 0}.private{color:#cbb7ef}.prose{white-space:pre-wrap}.reward-row{padding:12px 0;border-bottom:1px solid #293d52}.feedback{border:1px solid #62758f;padding:14px;border-radius:6px}button:focus-visible,summary:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}@media(max-width:640px){.sessions{padding:16px}.fields{grid-template-columns:1fr}.editor{padding:14px}.heading{align-items:stretch;flex-direction:column}.actions>button{flex:1}.body{padding-inline:12px}}
</style>
