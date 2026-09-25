<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref} from 'vue';
import {onBeforeRouteLeave} from 'vue-router';
import {api} from '../lib/api';
import {NPC_SEXES,validNpcData,type NpcCatalog,type NpcData,type NpcArticleDraft} from '../../../api/src/campaign-npc-model';
import CampaignNpcSheet from './CampaignNpcSheet.vue';
const props=defineProps<{disabled?:boolean}>();
const emit=defineEmits<{(e:'apply',article:NpcArticleDraft):void}>();
const catalog=ref<NpcCatalog|null>(null),draft=ref<NpcData|null>(null),tierId=ref('lambda'),presetId=ref('garde'),sex=ref('random'),nationality=ref('random'),truthEnabled=ref(false),natureId=ref('vampire'),truthPowerId=ref('recent'),truthArchetypeId=ref('veilleur'),faction=ref(''),busy=ref(false),imageBusy=ref(false),error=ref('');
let live=true,applied=false;
const endpoint='/api/compendium/editor/npc-generator';
const locked=computed(()=>busy.value||props.disabled||imageBusy.value);
const valid=computed(()=>!!draft.value&&!!catalog.value&&validNpcData(draft.value,catalog.value));
async function load(){try{const c=await api<NpcCatalog>(endpoint+'/catalog');if(live)catalog.value=c;}catch{if(live)error.value='Le générateur canonique est réservé aux administrateurs. Impossible de le charger.';}}
async function generate(){if(locked.value||draft.value&&!window.confirm('Remplacer cet aperçu et ses modifications ?'))return;busy.value=true;error.value='';try{const r=await api<{npcs:NpcData[]}>(endpoint+'/generate',{method:'POST',body:JSON.stringify({tierId:tierId.value,presetId:presetId.value,sex:sex.value,nationality:nationality.value,faction:faction.value,count:1,seed:crypto.randomUUID(),truth:truthEnabled.value?{natureId:natureId.value,powerId:truthPowerId.value,archetypeId:truthArchetypeId.value}:null})});if(live){draft.value=r.npcs[0];applied=false;}}catch{if(live)error.value='Impossible de générer ce PNJ. Réessaie.';}finally{busy.value=false;}}
async function apply(){if(!valid.value||locked.value)return;busy.value=true;error.value='';try{const r=await api<{article:NpcArticleDraft}>(endpoint+'/preview',{method:'POST',body:JSON.stringify({npc:draft.value})});if(live){applied=true;emit('apply',r.article);}}catch{if(live)error.value='Impossible de préparer le brouillon. Tes modifications sont conservées ici.';}finally{busy.value=false;}}
function beforeUnload(e:BeforeUnloadEvent){if(draft.value&&!applied){e.preventDefault();e.returnValue='';}}
onBeforeRouteLeave(()=>applied||!draft.value||window.confirm('Quitter sans conserver cet aperçu de PNJ ?'));
onMounted(()=>{void load();window.addEventListener('beforeunload',beforeUnload);});
onUnmounted(()=>{live=false;window.removeEventListener('beforeunload',beforeUnload);});
</script>
<template>
 <section class="canonical-generator" aria-label="Générateur de PNJ canonique">
  <h2>Préparer un PNJ canonique</h2>
  <p>Génère une base, ajuste la fiche, puis crée un brouillon dans l’éditeur. La publication reste une action distincte après relecture.</p>
  <p>Après publication, le nom, le rôle, le sexe, l’apparence, le caractère et le portrait seront publics. Faction, motivation, secrets, équipement, statistiques, talents et notes de Vérité restent dans les blocs MJ.</p>
  <p v-if="error" role="alert">{{ error }} <button v-if="!catalog" type="button" @click="load">Réessayer</button></p>
  <template v-if="catalog">
   <fieldset :disabled="locked"><div class="choices">
    <label>Palier du PNJ<select v-model="tierId"><option v-for="t in catalog.tiers" :key="t.id" :value="t.id">{{ t.name }}</option></select></label>
    <label>Prétiré<select v-model="presetId"><option v-for="p in catalog.presets" :key="p.id" :value="p.id">{{ p.name }}</option></select></label>
    <label>Sexe à la génération<select v-model="sex"><option value="random">Aléatoire</option><option v-for="s in NPC_SEXES" :key="s.id" :value="s.id">{{ s.name }}</option></select></label>
    <label>Nationalité d’origine<select v-model="nationality"><option value="random">Aléatoire</option><option v-for="n in catalog.nationalities" :key="n.id" :value="n.id">{{ n.name }}</option></select></label>
    <label>Faction ou groupe suggéré<input v-model="faction" maxlength="160" list="canonical-npc-factions" placeholder="Choisir ou saisir une faction · bloc MJ" /><datalist id="canonical-npc-factions"><option>AIDH</option><option>Crawler</option><option>Chasseurs</option><option>Xenoshield</option><option>Loges des Mages</option></datalist></label>
   </div><label class="check"><input v-model="truthEnabled" type="checkbox" />Profil de Vérité MJ</label><div v-if="truthEnabled" class="choices"><label>Nature<select v-model="natureId"><option v-for="n in catalog.truthNatures" :key="n.id" :value="n.id">{{ n.name }}</option></select></label><label>Puissance de Vérité<select v-model="truthPowerId"><option v-for="t in catalog.truthPowers" :key="t.id" :value="t.id">{{ t.name }}</option></select></label><label>Archétype de Vérité<select v-model="truthArchetypeId"><option v-for="a in catalog.truthArchetypes" :key="a.id" :value="a.id">{{ a.name }}</option></select></label></div><p>Archétype : un profil de répartition des statistiques de Vérité, indépendant de la Nature et de la Puissance. {{ catalog?.presets.find(p=>p.id===catalog?.truthArchetypes.find(a=>a.id===truthArchetypeId)?.presetId)?.description }}</p><p>{{ catalog.presets.find(p=>p.id===presetId)?.description }}</p><button type="button" @click="generate">{{ draft?'Générer un autre aperçu':'Générer un aperçu' }}</button></fieldset>
   <form v-if="draft" @submit.prevent="apply"><fieldset :disabled="busy||disabled"><CampaignNpcSheet v-model:data="draft" :catalog="catalog" editable @image-busy="imageBusy=$event" /></fieldset><button class="primary" :disabled="locked||!valid">Créer le brouillon PNJ</button><small>Le brouillon n’apparaîtra pas dans le Compendium public avant sa publication.</small></form>
  </template>
 </section>
</template>
<style scoped>
.canonical-generator{display:grid;gap:16px;padding:20px;background:#0b1725;border:1px solid #486077;border-radius:8px;min-width:0;overflow-wrap:anywhere}.canonical-generator h2{margin:0}.canonical-generator p,.canonical-generator small{color:#b5c8dc;line-height:1.6}.canonical-generator fieldset{border:0;padding:0;min-width:0}.choices{display:grid;grid-template-columns:1fr 1fr;gap:14px}.choices label{display:grid;gap:8px}.choices input,.choices select{box-sizing:border-box;min-width:0;width:100%;padding:10px;min-height:44px;border:1px solid #405875;border-radius:6px;background:#08131f;color:#edf4ff;font:inherit}.canonical-generator button{min-height:44px;padding:10px 14px;background:#101e30;color:#edf4ff;border:1px solid #405875;border-radius:6px;font:inherit;cursor:pointer}.canonical-generator button.primary{background:#a3eaff;color:#071725;margin:16px 0}.canonical-generator button:disabled{opacity:.5;cursor:default}.canonical-generator small{display:block}.canonical-generator :focus-visible{outline:2px solid #a3eaff;outline-offset:3px}@media(max-width:600px){.choices{grid-template-columns:1fr}.canonical-generator{padding:12px}}
.canonical-generator .check{display:flex;align-items:center;gap:10px;min-height:44px}.canonical-generator .check input{width:20px;height:20px}
</style>
