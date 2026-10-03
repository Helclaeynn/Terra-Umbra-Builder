<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { builderPurchaseAllowed } from '../../../api/src/rules/builder-equipment-policy';
import type {RealityRulesPackage,RealityItem} from '../lib/reality';
import { api, ApiError } from '../lib/api';

type Target = { id:string; name:string; version:number; unavailable?:boolean; xpEarned:number; ptvEarned:number; money:number; renown:number; corruption:number; integrity:number };
type Source = { id:string; name:string; corruption?:string };
type Award = { equipment?:Array<{name:string;quantity:number}>; requestId:string; characterId:string; characterName:string; reason:string; createdAt:string; xp:number; ptv:number; money:number; renownDelta:number; corruptionDelta:number; revision:number };
const props = defineProps<{ campaignId:string; canManage:boolean; archived?:boolean }>();
const open=ref(false), loading=ref(false), sending=ref(false), error=ref(''), notice=ref('');
const targets=ref<Target[]>([]), sources=ref<Source[]>([]), history=ref<Award[]>([]), selected=ref<string[]>([]);
const reason=ref(''), xp=ref(0), ptv=ref(0), money=ref(0), renown=ref(0), corruption=ref(0), source=ref('');
const equipment=ref<RealityItem[]>([]),giftId=ref(''),giftQuantity=ref(1),giftSearch=ref(''),giftCategory=ref('');
const giftCategories=computed(()=>[...new Set(equipment.value.map(i=>i.category))].sort((a,b)=>a.localeCompare(b,'fr')));
const giftOptions=computed(()=>equipment.value.filter(i=>(!giftCategory.value||i.category===giftCategory.value)&&i.name.toLocaleLowerCase('fr').includes(giftSearch.value.toLocaleLowerCase('fr'))).sort((a,b)=>a.category.localeCompare(b.category,'fr')||a.name.localeCompare(b.name,'fr')).slice(0,80));
const requestId=ref('');
let generation=0;
const recipients=computed(()=>targets.value.filter(row=>selected.value.includes(row.id)&&!row.unavailable));
const amounts=computed(()=>({xp:Number(xp.value),ptv:Number(ptv.value),money:Number(money.value),renownDelta:Number(renown.value),corruptionDelta:Number(corruption.value)}));
const problem=computed(()=>{
  if(!recipients.value.length)return 'Choisissez au moins un personnage dont la fiche est acceptée.';
  if(!reason.value.trim())return 'Indiquez le motif de cette récompense.';
  const a=amounts.value;
  if(Object.values(a).some(n=>!Number.isSafeInteger(n)||n<0)||a.xp>100000||a.ptv>100000||a.money>1e9||a.renownDelta>5||a.corruptionDelta>100)return 'Les montants doivent être des entiers positifs dans les limites indiquées.';
  if(giftId.value&&(!Number.isInteger(giftQuantity.value)||giftQuantity.value<1||giftQuantity.value>20))return 'Choisir une quantité entre 1 et 20.';
  if(!Object.values(a).some(n=>n>0)&&!giftId.value)return 'Indiquez au moins une récompense.';
  if(a.corruptionDelta&&!source.value)return 'Choisissez la Source de Corruption.';
  const capped=recipients.value.find(row=>row.renown+a.renownDelta>5);
  if(capped)return `${capped.name} dépasserait 5 en Renommée.`;
  const fragile=recipients.value.find(row=>a.corruptionDelta>0&&row.corruption+a.corruptionDelta>row.integrity);
  return fragile?`${fragile.name} dépasserait son Intégrité.`:'';
});
watch([reason,xp,ptv,money,renown,corruption,source,giftId,giftQuantity,()=>selected.value.join('|')],()=>{if(!sending.value)requestId.value='';});
watch(()=>props.campaignId,()=>{generation++;targets.value=[];history.value=[];selected.value=[];requestId.value='';notice.value='';if(open.value)void load();});
function describe(cause:unknown){
  const messages:Record<string,string>={
    character_version_conflict:'Une fiche a changé depuis cet aperçu. Actualisez les personnages avant de confirmer à nouveau.',
    reward_recipient_unavailable:'Une fiche n’est plus acceptée ou n’est plus liée à cette campagne. Actualisez la liste.',
    reward_request_conflict:'Cette référence désigne déjà une autre attribution. Actualisez avant de recommencer.',
    campaign_not_found:'Seul le MJ de cette campagne active peut distribuer ces récompenses.',
    renown_limit:'La Renommée ne peut pas dépasser 5.',corruption_integrity_limit:'La Corruption dépasserait l’Intégrité.',
    invalid_campaign_rewards:'Vérifiez les destinataires, les montants et le motif.'
  };
  return messages[cause instanceof Error?cause.message:'']||'La confirmation n’a pas été reçue. Réessayez sans modifier les champs : la même attribution ne sera pas appliquée deux fois.';
}
async function load(){
  const seq=++generation;loading.value=true;error.value='';
  try{
    const [ledger,roster,catalog]=await Promise.all([
      api<{rewards:Award[]}>(`/api/campaigns/${props.campaignId}/rewards`),
      props.canManage?api<{characters:Target[];sources:Source[]}>(`/api/campaigns/${props.campaignId}/effect-targets`):Promise.resolve({characters:[],sources:[]}),
      props.canManage?api<RealityRulesPackage>('/api/rulesets/terra-umbra/reality'):Promise.resolve(null)
    ]);
    if(seq!==generation)return;
    equipment.value=catalog?.equipment.filter(i=>builderPurchaseAllowed(i)&&!['monthly','annual','per_use'].includes(i.recurring))??[];
    history.value=ledger.rewards;targets.value=roster.characters;sources.value=roster.sources;
    selected.value=selected.value.filter(id=>targets.value.some(row=>row.id===id&&!row.unavailable));
  }catch(cause){if(seq===generation){if(cause instanceof ApiError&&[401,403,404].includes(cause.status)){targets.value=[];history.value=[];selected.value=[];}error.value=notice.value?'Récompense enregistrée ; l’actualisation de la liste a échoué.':describe(cause);}}
  finally{if(seq===generation)loading.value=false;}
}
function toggle(){open.value=!open.value;if(open.value)void load();}
function all(){selected.value=targets.value.filter(row=>!row.unavailable).map(row=>row.id);}
async function grant(){
  if(!props.canManage||props.archived||sending.value||loading.value||problem.value)return;
  const summary=Object.entries(amounts.value).filter(([,n])=>n>0).map(([key,n])=>`+${n} ${{xp:'XP',ptv:'PTV',money:'$',renownDelta:'Renommée',corruptionDelta:'Corruption'}[key]}`).join(', ')+(giftId.value?` · ${giftQuantity.value} × ${equipment.value.find(i=>i.id===giftId.value)?.name}`:'');
  if(!window.confirm(`Attribuer ${summary} à chaque personnage sélectionné (${recipients.value.map(row=>row.name).join(', ')}) ?`))return;
  requestId.value ||= crypto.randomUUID();
  const body={requestId:requestId.value,reason:reason.value.trim(),rewards:recipients.value.map(row=>({characterId:row.id,version:row.version,...amounts.value,corruptionSource:amounts.value.corruptionDelta?source.value:'',equipment:giftId.value?[{itemId:giftId.value,quantity:giftQuantity.value}]:[]}))};
  sending.value=true;error.value='';notice.value='';
  try{
    const result=await api<{ok:boolean;alreadyApplied:boolean}>(`/api/campaigns/${props.campaignId}/rewards`,{method:'POST',body:JSON.stringify(body)});
    notice.value=result.alreadyApplied?'Cette récompense était déjà enregistrée : aucun doublon n’a été ajouté.':'Récompense enregistrée sur les copies de campagne et dans leur historique.';
    giftId.value='';giftQuantity.value=1;selected.value=[];xp.value=0;ptv.value=0;money.value=0;renown.value=0;corruption.value=0;source.value='';reason.value='';requestId.value='';
    await load();
  }catch(cause){error.value=describe(cause);}finally{sending.value=false;}
}
const moneyText=(n:number)=>`${n.toLocaleString('fr-FR')} $`;
</script>

<template>
  <section v-if="!archived" class="campaign-rewards" data-campaign-bonus>
    <header><div><h2>{{ canManage?'Récompenses hors séance':'Récompenses reçues hors séance' }}</h2><p v-if="canManage">Cadeau, action entre deux séances ou bonus : aucune séance planifiée n’est nécessaire.</p></div><button type="button" :aria-expanded="open" :disabled="sending" @click="toggle">{{ open?'Replier':canManage?'Attribuer une récompense':'Voir mes récompenses' }}</button></header>
    <div v-if="open" class="reward-content">
      <p v-if="notice" role="status" class="success">{{ notice }}</p><p v-if="error" role="alert" class="error">{{ error }}</p>
      <button type="button" :disabled="loading||sending" @click="load">{{ loading?'Actualisation…':'Actualiser les personnages et l’historique' }}</button>
      <form v-if="canManage" @submit.prevent="grant">
        <fieldset :disabled="loading||sending"><legend>Destinataires — fiches de campagne acceptées</legend>
          <div class="selection-actions"><button type="button" @click="all">Tous les personnages</button><button type="button" @click="selected=[]">Aucun</button></div>
          <p v-if="!loading&&!targets.length">Aucune fiche acceptée pour le moment. Validez les propositions des joueurs dans la campagne.</p>
          <label v-for="target in targets" :key="target.id" class="recipient"><input v-model="selected" type="checkbox" :value="target.id" :disabled="target.unavailable" /><span><strong>{{ target.name }}</strong><small v-if="target.unavailable">Fiche à vérifier avant attribution.</small><small v-else>{{ target.xpEarned }} XP reçus · {{ target.ptvEarned }} PTV reçus · {{ moneyText(target.money) }} · Renommée {{ target.renown }}/5 · Corruption {{ target.corruption }}/{{ target.integrity }}</small></span></label>
          <p>Les montants ci-dessous sont ajoutés <strong>à chaque personnage sélectionné</strong>.</p>
          <div class="reward-fields"><label>XP<input v-model.number="xp" type="number" min="0" max="100000" step="1" /></label><label>PTV<input v-model.number="ptv" type="number" min="0" max="100000" step="1" /></label><label>Argent ($)<input v-model.number="money" type="number" min="0" max="1000000000" step="1" /></label><label>Renommée<input v-model.number="renown" type="number" min="0" max="5" step="1" /></label><label>Corruption<input v-model.number="corruption" type="number" min="0" max="100" step="1" /></label></div>
          <label v-if="Number(corruption)>0">Source de Corruption<select v-model="source"><option value="">— Choisir —</option><option v-for="item in sources" :key="item.id" :value="item.id">{{ item.name }}{{ item.corruption?' · '+item.corruption:'' }}</option></select></label>
          <fieldset><legend>Équipement offert · ajouté à l’inventaire sans débit d’argent</legend><label>Catégorie d’équipement<select v-model="giftCategory" aria-label="Catégorie d’équipement"><option value="">Toutes les catégories</option><option v-for="c in giftCategories" :key="c" :value="c">{{c}}</option></select></label><label>Rechercher un objet<input v-model="giftSearch" type="search" placeholder="Arme, armure, véhicule…" /></label><label>Objet du catalogue<select v-model="giftId"><option value="">Aucun équipement</option><option v-if="giftId&&!giftOptions.some(i=>i.id===giftId)" :value="giftId">{{ equipment.find(i=>i.id===giftId)?.name }}</option><option v-for="item in giftOptions" :key="item.id" :value="item.id">{{ item.category }} · {{ item.name }}</option></select></label><label v-if="giftId">Quantité par personnage<input v-model.number="giftQuantity" type="number" min="1" max="20" /></label></fieldset>
          <label>Motif<input v-model="reason" required maxlength="500" placeholder="Action hors séance, bonne idée, cadeau…" /></label>
          <p v-if="problem" class="hint">{{ problem }}</p>
          <button type="submit" class="primary" :disabled="!!problem">{{ sending?'Attribution…':`Attribuer à ${recipients.length} personnage(s)` }}</button>
        </fieldset>
      </form>
      <details class="reward-history"><summary>Historique des attributions hors séance · {{ history.length }}</summary><p v-if="!history.length">Aucune attribution hors séance enregistrée.</p><article v-for="entry in history" :key="entry.requestId+entry.characterId"><strong>{{ entry.characterName }}</strong><span>{{ new Date(entry.createdAt).toLocaleString('fr-FR') }} · version {{ entry.revision }}</span><p>{{ entry.reason }}</p><p v-for="item in entry.equipment??[]" :key="item.name">{{ item.quantity }} × {{ item.name }}</p><p><span v-if="entry.xp">+{{ entry.xp }} XP · </span><span v-if="entry.ptv">+{{ entry.ptv }} PTV · </span><span v-if="entry.money">+{{ moneyText(entry.money) }} · </span><span v-if="entry.renownDelta">+{{ entry.renownDelta }} Renommée · </span><span v-if="entry.corruptionDelta">+{{ entry.corruptionDelta }} Corruption</span></p></article></details>
    </div>
  </section>
</template>

<style scoped>
.campaign-rewards{border:1px solid #294457;border-radius:10px;padding:20px;background:#0d1b2b;color:#e8f1fc;min-width:0}.campaign-rewards header{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}.campaign-rewards h2,.campaign-rewards p{margin:0}.campaign-rewards header p{margin-top:8px;color:#b6cadb}.reward-content,fieldset{display:grid;gap:14px}.reward-content{margin-top:20px}fieldset{border:1px solid #294457;border-radius:8px;padding:16px;min-width:0}legend{padding:0 8px}.selection-actions{display:flex;gap:8px;flex-wrap:wrap}.recipient{display:flex;align-items:flex-start;gap:12px;padding:10px;border-bottom:1px solid #294457}.recipient small{display:block;color:#b6cadb;margin-top:5px}.reward-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}label:not(.recipient){display:grid;gap:6px}input,select,button{font:inherit}input:not([type=checkbox]),select{width:100%;min-width:0;box-sizing:border-box;background:#071320;color:inherit;border:1px solid #375366;border-radius:6px;padding:10px}button{min-height:44px;cursor:pointer;border:1px solid #375366;border-radius:6px;background:#101f2d;color:inherit;padding:10px 14px}.primary{background:#b7efff;color:#092130;font-weight:700}button:disabled{opacity:.5;cursor:default}input[type=checkbox]{width:20px;height:20px;flex:none}.error{color:#ffb4b4}.success{color:#a7e7c3}.hint{color:#b6cadb}.reward-history summary{cursor:pointer;min-height:44px;display:flex;align-items:center}.reward-history article{border-top:1px solid #294457;padding:14px 0;display:grid;gap:7px}.reward-history article>span{font-size:12px;color:#b6cadb}.campaign-rewards :focus-visible{outline:2px solid #b7efff;outline-offset:2px}@media(max-width:480px){.campaign-rewards{padding:12px}fieldset{padding:10px}.reward-fields{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
