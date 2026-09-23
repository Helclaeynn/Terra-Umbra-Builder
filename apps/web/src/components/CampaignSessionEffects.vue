<script setup lang="ts">
import {computed,onUnmounted,ref,watch} from 'vue';
import {api,ApiError} from '../lib/api';
type Target={id:string;name:string;version:number;money:number;corruption:number;integrity:number;source:string;unavailable?:boolean};
type Effect={id:string;characterName:string;money:number;corruptionDelta:number;corruptionSource:string;reason:string;before:{money:number;corruption:number;source:string};after:{money:number;corruption:number;source:string};appliedAt:string};
const props=defineProps<{campaignId:string;sessionId:string;canManage:boolean;effects:Effect[]}>();
const emit=defineEmits<{(e:'applied'):void}>();
const open=ref(false),targets=ref<Target[]>([]),sources=ref<{id:string;name:string;corruption:string}[]>([]),selected=ref(''),money=ref(0),delta=ref(0),source=ref(''),reason=ref(''),busy=ref(false),loading=ref(false),error=ref(''),notice=ref('');
const target=computed(()=>targets.value.find(t=>t.id===selected.value));
const remaining=computed(()=>Math.max(0,(target.value?.integrity||0)-(target.value?.corruption||0)));
const valid=computed(()=>target.value&&!target.value.unavailable&&reason.value.trim()&&Number.isSafeInteger(money.value)&&money.value>=0&&money.value<=1e9&&Number.isInteger(delta.value)&&delta.value>=0&&delta.value<=remaining.value&&money.value+delta.value>0&&(!delta.value||!!source.value));
let seq=0,requestId=crypto.randomUUID();
watch([selected,money,delta,source,reason],()=>{requestId=crypto.randomUUID();});
watch(selected,()=>{source.value=target.value?.source||'';delta.value=0;});
async function load(){const n=++seq;loading.value=true;error.value='';try{const r=await api<{characters:Target[];sources:typeof sources.value}>(`/api/campaigns/${props.campaignId}/effect-targets`);if(n!==seq)return;targets.value=r.characters;sources.value=r.sources;}catch{if(n===seq){targets.value=[];error.value='Impossible de charger les fiches actuelles.';}}finally{if(n===seq)loading.value=false;}}
async function start(){open.value=!open.value;if(open.value)await load();}
function sourceName(id:string){return sources.value.find(s=>s.id===id)?.name||({vhodhal:'Vhodhal',vaagor:'V’Aagor',sharith:'Ux’Sharith',vhadhi:'C’Thath Vhadhi',shaoggith:'Gajh’Shaoggith',thul:'Thul'} as Record<string,string>)[id]||id||'Aucune';}
async function apply(){
 if(!valid.value||busy.value||!target.value)return;
 const t=target.value;
 if(!window.confirm(`Appliquer à ${t.name} : +${money.value} $ et +${delta.value} point(s) de corruption${delta.value?' · '+sourceName(source.value):''} ?\n\nMotif : ${reason.value.trim()}\nCes changements seront enregistrés sur la fiche et dans son historique.`))return;
 busy.value=true;error.value='';notice.value='';
 try{await api(`/api/campaigns/${props.campaignId}/sessions/${props.sessionId}/effects`,{method:'POST',body:JSON.stringify({requestId,characterId:t.id,version:t.version,money:money.value,corruptionDelta:delta.value,corruptionSource:delta.value?source.value:'',reason:reason.value})});money.value=0;delta.value=0;reason.value='';notice.value='Effet appliqué à la fiche et enregistré dans son historique.';emit('applied');await load();}
 catch(e){const msg=e instanceof Error?e.message:'';error.value=msg==='effect_version_conflict'?'La fiche a changé. Actualise les valeurs, puis vérifie à nouveau le récapitulatif.':msg==='corruption_limit'?'Le total dépasserait l’Intégrité du personnage. Actualise les valeurs.':msg==='reward_recipient_unavailable'?'Cette fiche n’est plus disponible dans le groupe.':msg==='effect_request_conflict'?'Cette demande a déjà été utilisée pour un autre effet. Ferme puis rouvre le panneau.':'L’attribution n’a pas pu être confirmée. Réessaie sans modifier les champs pour éviter un doublon.';if(e instanceof ApiError&&[401,403,404].includes(e.status)){targets.value=[];open.value=false;}}
 finally{busy.value=false;}
}
onUnmounted(()=>{seq++;});
</script>
<template>
 <div class="effects">
  <button v-if="canManage" type="button" :disabled="busy" @click="start">{{ open?'Fermer les effets de séance':'Argent et corruption' }}</button>
  <p v-if="notice" role="status">{{ notice }}</p><p v-if="error" role="alert">{{ error }}</p>
  <form v-if="open&&canManage" class="effect-form" @submit.prevent="apply">
   <h3>Effet individuel de séance</h3><p>L’argent et la corruption sont indépendants des récompenses XP/PTV. Chaque application laisse une trace.</p>
   <p v-if="loading" role="status">Chargement des fiches…</p>
   <fieldset :disabled="busy||loading"><legend>Personnage et conséquences</legend>
    <label>Personnage concerné<select v-model="selected" aria-label="Personnage concerné"><option value="">Choisir une fiche</option><option v-for="t in targets" :key="t.id" :value="t.id" :disabled="t.unavailable">{{ t.name }}{{ t.unavailable?' · Données à vérifier':'' }}</option></select></label>
    <div v-if="target&&!target.unavailable" class="fields"><label>Argent à verser ($)<input v-model.number="money" type="number" min="0" max="1000000000" step="1" required /></label><label>Points de corruption à ajouter<input v-model.number="delta" type="number" min="0" :max="remaining" step="1" required /></label></div>
    <label v-if="delta>0">Source dominante après l’effet<select v-model="source" aria-label="Source dominante après l’effet" required><option value="">Choisir la Source</option><option v-for="s in sources" :key="s.id" :value="s.id">{{ s.name }} — {{ s.corruption }}</option></select></label>
    <label>Motif visible par le joueur<textarea v-model="reason" rows="2" maxlength="500" required placeholder="Prime de mission, exposition à une Source…" /></label>
   </fieldset>
   <div v-if="target&&!target.unavailable" class="preview" aria-live="polite"><strong>{{ target.name }} · Avant → après</strong><p>Solde : {{ target.money.toLocaleString('fr-FR') }} $ → {{ (target.money+(Number(money)||0)).toLocaleString('fr-FR') }} $</p><p>Corruption : {{ target.corruption }} → {{ target.corruption+(Number(delta)||0) }} / {{ target.integrity }}</p><p v-if="delta>0">Source : {{ sourceName(target.source) }} → {{ sourceName(source) }}</p><p v-if="delta>0&&source!==target.source&&target.source">Les Dons d’une autre Source deviennent dormants ; leurs PTV restent engagés.</p><p v-if="delta>0&&target.corruption+delta>=target.integrity">Seuil de Bascule atteint : le test contre DD 18 et ses conséquences restent à résoudre à la table.</p></div>
   <small>Ajouter de la corruption n’accorde aucun Don automatiquement et ne dépense aucun PTV.</small>
   <div class="actions"><button type="submit" :disabled="busy||loading||!valid">Confirmer l’effet</button><button type="button" :disabled="busy||loading" @click="load">Actualiser les valeurs</button></div>
  </form>
  <details v-if="effects.length" class="effect-history"><summary>Argent et corruption · {{ effects.length }} événement(s)</summary><div v-for="e in effects" :key="e.id" class="event"><strong>{{ e.characterName }}</strong><span v-if="e.money"> · +{{ Number(e.money).toLocaleString('fr-FR') }} $</span><span v-if="e.corruptionDelta"> · +{{ e.corruptionDelta }} Corruption ({{ sourceName(e.corruptionSource) }}) · {{ e.before.corruption }} → {{ e.after.corruption }}</span><p>{{ e.reason }}</p><small>{{ new Date(e.appliedAt).toLocaleString('fr-FR') }}</small></div></details>
 </div>
</template>
<style scoped>
.effects{margin-top:18px;min-width:0}.effect-form{display:grid;gap:14px;margin-top:16px;padding:18px;background:#091420;border:1px solid #486077;border-radius:8px}.effect-form fieldset{display:grid;gap:14px;min-width:0;border:1px solid #405875;border-radius:6px;padding:14px}.effect-form label{display:grid;gap:8px;font-size:14px}.effect-form input,.effect-form select,.effect-form textarea{width:100%;min-width:0;box-sizing:border-box;min-height:44px;padding:12px;color:#edf4ff;background:#08131f;border:1px solid #405875;border-radius:6px;font:inherit}.fields{display:grid;grid-template-columns:1fr 1fr;gap:14px}p{line-height:1.6;color:#b5c8dc}.preview{border-left:2px solid #b39bd8;padding:12px;background:#151d30}.preview p{margin:8px 0}.actions{display:flex;flex-wrap:wrap;gap:10px}button{min-height:44px;padding:10px 16px;border:1px solid #405875;border-radius:6px;background:#101e30;color:#eaf2ff;cursor:pointer;font:inherit}button[type=submit]{background:#a3eaff;color:#071725}button:disabled{opacity:.5;cursor:default}small{color:#a3b7cc;line-height:1.6}.effect-history{margin-top:16px}summary{cursor:pointer;min-height:44px;align-content:center}.event{padding:14px 0;border-top:1px solid #293d52}.event p{margin:6px 0;white-space:pre-wrap}button:focus-visible,summary:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}@media(max-width:600px){.fields{grid-template-columns:1fr}.effect-form{padding:12px}.actions>button{flex:1}}
</style>
