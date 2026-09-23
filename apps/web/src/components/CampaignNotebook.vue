<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref,watch} from 'vue';
import {onBeforeRouteLeave} from 'vue-router';
import {api,ApiError} from '../lib/api';
import {validScenes,type CampaignScene} from '../../../api/src/campaign-preparation';
import CampaignPreparation from './CampaignPreparation.vue';
type Prep={id:string;title:string;preparation?:string;scenes?:CampaignScene[];version:number};
const props=defineProps<{campaignId:string;session?:Prep;startPlaying?:boolean}>();
const emit=defineEmits<{(e:'saved',v:Prep):void;(e:'close'):void;(e:'schedule',id:string):void}>();
const currentId=ref(props.session?.id||''),version=ref(props.session?.version||1),playing=ref(!!props.startPlaying);
const draft=ref({title:props.session?.title||'',preparation:props.session?.preparation||'',scenes:JSON.parse(JSON.stringify(props.session?.scenes||[])) as CampaignScene[]});
const serialized=()=>JSON.stringify(draft.value),baseline=ref(serialized());
const dirty=computed(()=>serialized()!==baseline.value),saving=ref(false),error=ref(''),blocked=ref(false),savedOnce=ref(!!props.session),selection=ref('');
const references=ref<{id:string;title:string;category:string;snippet:string}[]>([]),previous=ref<Prep[]>([]),fromSession=ref(''),libraryError=ref('');
const previousOptions=computed(()=>previous.value.filter(s=>s.id!==currentId.value&&s.scenes?.some(s=>!s.done)));
const requestId=crypto.randomUUID();let creationSnapshot='',timer:ReturnType<typeof setTimeout>|undefined,live=true,inflight:Promise<boolean>|null=null;
const endpoint=`/api/campaigns/${props.campaignId}/sessions`;
function queue(){clearTimeout(timer);if(!blocked.value&&dirty.value)timer=setTimeout(()=>{void flush();},1000);}
async function persist(){
 if(blocked.value)return false;
 if(!dirty.value)return true;
 if(!draft.value.title.trim()||!validScenes(draft.value.scenes)){error.value='Ajoute un titre à la séance et à chaque scène pour enregistrer.';return false;}
 saving.value=true;error.value='';
 // Keep the same creation payload on retry, even if the first response was lost.
 const snapshot=!currentId.value?(creationSnapshot||=serialized()):serialized();
 const sent=JSON.parse(snapshot);
 try{
  const result=await api<{session:{id:string;version:number}}>(currentId.value?`${endpoint}/${currentId.value}/preparation`:endpoint,{method:currentId.value?'PATCH':'POST',body:JSON.stringify(currentId.value?{...sent,version:version.value}:{...sent,requestId,playedOn:null,status:'planned',report:'',published:false})});
  if(!live)return false;
  currentId.value=result.session.id;version.value=result.session.version;baseline.value=snapshot;savedOnce.value=true;
  emit('saved',{...sent,...result.session});return true;
 }catch(e){
  if(live){blocked.value=true;error.value=e instanceof ApiError&&e.status===409?'Cette séance a changé ailleurs. Tes notes restent ici : copie-les avant de rouvrir la dernière version.':e instanceof ApiError&&[401,403,404].includes(e.status)?'Cette préparation n’est plus accessible avec ton compte. Tes notes restent ici.':'Enregistrement interrompu. Tes notes restent ici ; réessaie avant de quitter.';}
  return false;
 }finally{saving.value=false;if(live&&!blocked.value&&dirty.value)queue();}
}
async function flush():Promise<boolean>{clearTimeout(timer);if(inflight){await inflight;if(blocked.value)return false;}if(!dirty.value)return true;inflight=persist();try{return await inflight;}finally{inflight=null;}}
async function retry(){blocked.value=false;await flush();}
async function finish(schedule=false){if(saving.value)await inflight;if(dirty.value&&!await flush())return;if(dirty.value&&!await flush())return;if(schedule&&currentId.value)emit('schedule',currentId.value);else emit('close');}
function close(){if(blocked.value||(!draft.value.title.trim()&&dirty.value)){if(window.confirm('Fermer et abandonner les modifications non enregistrées ?'))emit('close');return;}void finish();}
async function library(){libraryError.value='';try{const r=await api<{references:typeof references.value;previous:Prep[]}>(`/api/campaigns/${props.campaignId}/preparation-library`);if(live){references.value=r.references;previous.value=r.previous;}}catch{if(live)libraryError.value='Les références des séances précédentes sont indisponibles.';}}
function carry(){const source=previous.value.find(s=>s.id===fromSession.value);if(!source)return;const pending=source.scenes?.filter(s=>!s.done)||[];if(draft.value.scenes.length+pending.length>30){libraryError.value='La préparation est limitée à 30 scènes. Retire une scène avant de reprendre ce lot.';return;}draft.value.scenes.push(...JSON.parse(JSON.stringify(pending)).map((s:CampaignScene)=>({...s,id:crypto.randomUUID()})));fromSession.value='';}
function idea(){const text=selection.value.trim();if(!text||draft.value.scenes.length>=30)return;draft.value.scenes.push({id:crypto.randomUUID(),title:text.split('\n')[0].slice(0,120),notes:text.slice(0,6000),done:false,references:[]});selection.value='';}
function beforeUnload(e:BeforeUnloadEvent){if(dirty.value||saving.value){e.preventDefault();e.returnValue='';}}
watch(draft,queue,{deep:true});
onBeforeRouteLeave(()=>!(dirty.value||saving.value)||window.confirm('La préparation n’est pas encore enregistrée. Quitter quand même ?'));
onMounted(()=>{void library();window.addEventListener('beforeunload',beforeUnload);});
onUnmounted(()=>{live=false;clearTimeout(timer);window.removeEventListener('beforeunload',beforeUnload);});
</script>
<template>
 <section class="notebook" aria-label="Carnet de séance">
  <div class="toolbar"><h3>{{ playing?'En partie':'Préparer ma séance' }}</h3><button type="button" :aria-pressed="playing" @click="playing=!playing">{{ playing?'Revenir à la préparation':'Passer en vue partie' }}</button></div>
  <p class="save-state" role="status">{{ saving?'Enregistrement…':blocked?'Modifications non enregistrées':dirty?'Modifications en attente…':savedOnce?'Préparation enregistrée automatiquement.':'Un titre et quelques notes suffisent.' }}</p>
  <p v-if="error" role="alert">{{ error }} <button v-if="blocked" type="button" :disabled="saving" @click="retry">Réessayer l’enregistrement</button></p>
  <template v-if="!playing"><label>Titre de la séance<input v-model="draft.title" maxlength="120" placeholder="Ex. : Une piste au port" /></label><label>Mes notes de séance<textarea v-model="draft.preparation" rows="9" maxlength="20000" placeholder="Une idée, quelques pistes, ce qui pourrait arriver…" @select="selection=($event.target as HTMLTextAreaElement).value.slice(($event.target as HTMLTextAreaElement).selectionStart,($event.target as HTMLTextAreaElement).selectionEnd)" /></label><small>Notes et scènes réservées au MJ. Le titre est visible par le groupe.</small><button v-if="selection.trim()" type="button" :disabled="draft.scenes.length>=30" @click="idea">Créer une scène avec le texte sélectionné</button></template>
  <template v-else><h2>{{ draft.title||'Séance sans titre' }}</h2><p class="prose">{{ draft.preparation||'Aucune note.' }}</p></template>
  <CampaignPreparation v-model="draft.scenes" :readonly="playing" :play="playing" :campaign-references="references" />
  <details v-if="!playing" class="reuse"><summary>Reprendre des scènes non jouées</summary><p v-if="libraryError" role="alert">{{ libraryError }} <button type="button" @click="library">Réessayer</button></p><p v-if="!previousOptions.length&&!libraryError">Aucune scène non jouée dans les séances précédentes.</p><template v-if="previousOptions.length"><label>Séance à reprendre<select v-model="fromSession"><option value="">Choisir une séance…</option><option v-for="s in previousOptions" :key="s.id" :value="s.id">{{ s.title }} · {{ s.scenes?.filter(s=>!s.done).length }} scène(s)</option></select></label><button type="button" :disabled="!fromSession" @click="carry">Copier les scènes non jouées</button><small>La séance d’origine est conservée.</small></template></details>
  <div class="toolbar"><button type="button" :disabled="saving||!draft.title.trim()" @click="finish(true)">Date, invitations et compte rendu</button><button type="button" :disabled="saving" @click="close">Fermer la préparation</button></div>
 </section>
</template>
<style scoped>
.notebook{display:grid;gap:14px;border:1px solid #486077;background:#091420;border-radius:8px;padding:20px;margin:20px 0;min-width:0}.toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}.notebook h3{margin:0}.notebook label{display:grid;gap:8px}.notebook input,.notebook textarea,.notebook select{box-sizing:border-box;width:100%;min-width:0;padding:12px;background:#08131f;color:#edf4ff;border:1px solid #405875;border-radius:6px;font:inherit;min-height:44px}.notebook textarea{resize:vertical;line-height:1.7}.notebook button{min-height:44px;padding:10px 14px;background:#101e30;color:#eaf2ff;border:1px solid #405875;border-radius:6px;font:inherit;cursor:pointer}.notebook button:disabled{opacity:.5;cursor:default}.save-state,small{color:#a3b7cc;line-height:1.6}.save-state{margin:0}.prose{white-space:pre-wrap;line-height:1.7}.reuse summary{cursor:pointer;min-height:44px;align-content:center}.reuse[open]{display:grid;gap:12px}button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}@media(max-width:640px){.notebook{padding:12px}.toolbar>button{flex:1}}
</style>
