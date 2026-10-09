<script setup lang="ts">
import {computed,onUnmounted,ref,watch} from 'vue';
import {api,ApiError} from '../lib/api';
const props=defineProps<{campaignId:string;room:any}>(),emit=defineEmits<{changed:[]}>();
const endpoint=`/api/campaigns/${props.campaignId}/targeted-powers`;
const open=ref(false),snapshot=ref<any>(null),sourceId=ref(''),targetId=ref(''),powerId=ref('');
const confirmed=ref(false),inscribed=ref(false),edge=ref(false),busy=ref(false),error=ref(''),notice=ref(''),pending=ref<any>(null);
let alive=true,timer:ReturnType<typeof setInterval>|undefined;
const sources=computed(()=>(snapshot.value?.sources??[]).filter((s:any)=>s.powers.length));
const source=computed(()=>sources.value.find((s:any)=>s.id===sourceId.value));
const power=computed(()=>source.value?.powers.find((p:any)=>p.id===powerId.value));
const target=computed(()=>snapshot.value?.targets.find((t:any)=>t.id===targetId.value));
const ready=computed(()=>!busy.value&&!pending.value&&!!power.value&&!!target.value&&confirmed.value&&(powerId.value!=='exile-rune-de-garde'||inscribed.value&&!props.room.combat?.active));
watch([sourceId,powerId,targetId],()=>{confirmed.value=false;inscribed.value=false;edge.value=false;});
async function load(){if(!alive||!open.value||document.visibilityState==='hidden')return;try{snapshot.value=await api(endpoint);if(!sources.value.some((s:any)=>s.id===sourceId.value))sourceId.value=sources.value[0]?.id??'';}catch{error.value='Impossible de charger les pouvoirs ciblés.';}}
watch(open,value=>{clearInterval(timer);if(value){void load();timer=setInterval(()=>void load(),3000);}});
onUnmounted(()=>{alive=false;clearInterval(timer);});
const messages:Record<string,string>={targeted_state_changed:'Une fiche a changé. Actualise et propose à nouveau le pouvoir.',targeted_offer_closed:'Cette proposition a expiré ou a déjà été traitée.',targeted_beneficiary_used:'Ce bénéficiaire a déjà reçu ce pouvoir dans le scénario.',targeted_source_unavailable:'Le lanceur ne peut pas agir : vérifie ses PA, son initiative et son état.',targeted_beneficiary_dead:'Ce pouvoir ne ramène pas un personnage mort à la vie.',targeted_no_healable_wound:'Aucune blessure ne peut être soignée avec ce pouvoir actuellement.',targeted_rune_already_active:'Ce runiste a déjà une Rune de Garde active.',targeted_inscription_outside_combat:'Termine le combat avant cette inscription de dix minutes.',targeted_context_required:'Confirme les conditions réelles du pouvoir.'};
async function send(action:string,extra:any){if(busy.value||pending.value)return;pending.value={requestId:crypto.randomUUID(),action,...extra};await retry();}
async function retry(){if(busy.value||!pending.value)return;busy.value=true;error.value='';notice.value='';try{const r=await api<any>(endpoint,{method:'POST',body:JSON.stringify(pending.value)});pending.value=null;notice.value=r.pendingAcceptance?'Proposition envoyée : le bénéficiaire ou le MJ doit l’accepter.':'Action enregistrée.';confirmed.value=false;inscribed.value=false;await load();emit('changed');}catch(e){error.value=e instanceof ApiError?messages[e.message]??'Action refusée. Vérifie les conditions et actualise.':'Action non confirmée. Réessaie le même envoi.';if(e instanceof ApiError&&e.status<500){pending.value=null;await load();}}finally{busy.value=false;}}
function request(){if(!ready.value)return;void send('request',{sourceId:sourceId.value,targetId:targetId.value,powerId:powerId.value,sourceVersion:source.value.version,targetVersion:target.value.version,contextConfirmed:confirmed.value,inscriptionConfirmed:inscribed.value,edge:edge.value});}
</script>
<template>
<details class="targeted-powers" :open="open" @toggle="open=($event.target as HTMLDetailsElement).open">
 <summary>Pouvoirs ciblés · soins & protections</summary>
 <p v-if="error" role="alert">{{error}} <button v-if="pending" :disabled="busy" @click="retry">Réessayer cet envoi</button></p><p v-if="notice" role="status">{{notice}}</p>
 <template v-if="snapshot">
  <p>Le lanceur choisit la cible. Un autre joueur accepte le soutien avant que ses PV ou protections changent ; le MJ peut l’appliquer directement. Les conditions de contact et de blessure restent à vérifier à la table.</p>
  <form v-if="sources.length" class="targeted-form" @submit.prevent="request"><fieldset :disabled="busy||!!pending"><div class="targeted-fields">
   <label>Lanceur<select v-model="sourceId" aria-label="Lanceur du pouvoir"><option v-for="s in sources" :key="s.id" :value="s.id">{{s.name}}</option></select></label>
   <label>Pouvoir<select v-model="powerId" aria-label="Pouvoir ciblé"><option value="">Choisir…</option><option v-for="p in source?.powers??[]" :key="p.id" :value="p.id">{{p.name}} · {{p.cost}} PA sous pression</option></select></label>
   <label>Bénéficiaire<select v-model="targetId" aria-label="Bénéficiaire du pouvoir"><option value="">Choisir…</option><option v-for="t in snapshot.targets" :key="t.id" :value="t.id">{{t.name}}</option></select></label>
  </div><p v-if="power">{{power.context}}</p><label v-if="power" class="check"><input v-model="confirmed" type="checkbox" /> Je confirme les conditions réelles de ce pouvoir.</label>
  <label v-if="powerId==='exile-rune-de-garde'" class="check"><input v-model="inscribed" type="checkbox" /> Les dix minutes d’inscription sont achevées, hors combat.</label>
  <label v-if="powerId==='exile-refection-vitale'" class="check"><input v-model="edge" type="checkbox" :disabled="!source.edge" /> Forcer le jet de soin · 1 Edge ({{source.edge}} disponibles).</label>
  <button :disabled="!ready">{{room.canManage?'Appliquer le pouvoir ciblé':'Proposer / utiliser le pouvoir ciblé'}}</button></fieldset></form>
  <p v-else>Aucun pouvoir de soutien dédié n’est disponible pour tes personnages dans leur état actuel.</p>
  <article v-for="offer in snapshot.offers" :key="offer.id" class="targeted-offer"><strong>{{offer.sourceName}} → {{offer.targetName}} · {{offer.powerName}}</strong><p>L’acceptation vérifie à nouveau les fiches, les conditions et les ressources. Aucun coût n’est dépensé avant.</p><button v-if="offer.canAccept" :disabled="busy||!!pending" @click="send('accept',{offerId:offer.id})">Accepter ce pouvoir</button><button v-if="offer.canCancel" :disabled="busy||!!pending" @click="send('cancel',{offerId:offer.id})">Refuser / annuler</button></article>
  <details v-if="snapshot.results?.length"><summary>Dernières résolutions de soutien</summary><article v-for="r in snapshot.results.slice(0,8)" :key="r.id"><strong>{{r.characterName}} → {{r.targetName}} · {{r.label}}</strong><p v-if="r.total!=null">{{r.modifier}} + {{r.dice.join(' + ')}} = {{r.total}} contre {{r.difficulty}} · {{r.dr}} DR</p><p v-if="r.narrativeFailure">Échec narratif : aucun soin.</p><p v-else-if="r.success===false">Test échoué : aucun soin.</p><p v-if="r.recovered!=null">{{r.recovered}} PV récupérés.</p><p v-if="r.stabilized">Bénéficiaire stabilisé.</p><p v-if="r.reduction">Rune active : −{{r.reduction}} dégâts sur la première atteinte surnaturelle.</p></article></details>
 </template>
</details>
</template>
<style scoped>
.targeted-powers{padding:12px;margin-bottom:20px;background:#0d1b2b;border:1px solid #355267;border-radius:8px;min-width:0}.targeted-powers summary{cursor:pointer;padding:10px}.targeted-fields{display:flex;flex-wrap:wrap;gap:12px}.targeted-fields label{flex:1;min-width:140px}.targeted-powers label{display:grid;gap:6px;margin:10px 0}.targeted-powers .check{display:flex;align-items:center;gap:8px}.targeted-powers fieldset{min-width:0;border:0;padding:0}.targeted-powers select{width:100%;min-width:0;box-sizing:border-box;padding:10px;background:#08131f;color:#e6eef8;border:1px solid #526c80;border-radius:5px}.targeted-powers button{min-height:44px;padding:10px;margin:6px 6px 6px 0;background:#143247;color:#d5f6ff;border:1px solid #52758b;border-radius:5px;cursor:pointer}.targeted-powers button:disabled{opacity:.5;cursor:default}.targeted-offer{padding:12px;margin:12px 0;border:1px solid #52758b;border-radius:6px}.targeted-powers p{line-height:1.5}@media(max-width:500px){.targeted-fields{display:grid;grid-template-columns:minmax(0,1fr)}.targeted-fields label{min-width:0}}
</style>
