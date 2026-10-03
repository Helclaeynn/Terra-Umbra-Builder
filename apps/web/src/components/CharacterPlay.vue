<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref} from 'vue';
import {api,ApiError} from '../lib/api';
import {blankPlayState,playProfile,type PlayState} from '../../../api/src/rules/play-state';
import type {CharacterDataV2} from '../types/character';
import type {CharacterSheet} from '../lib/character-sheet';
const emit=defineEmits<{ready:[]}>();
const props=defineProps<{id:string;data:CharacterDataV2;sheet:CharacterSheet;canEdit:boolean}>();
const state=ref<PlayState>(blankPlayState()),version=ref(0),loaded=ref(false),busy=ref(false),error=ref(''),notice=ref(''),dirty=ref(false);
const events=ref<any[]>([]),lastRoll=ref<any>(null),amount=ref(1),days=ref(3),prolonged=ref(false);
const bonusLabel=ref(''),bonusSkill=ref('athletisme'),bonusAmount=ref(1),bonusTruth=ref(false);
const profile=computed(()=>playProfile(props.data,state.value));
const stressNames=['Neutre (Normal)','Tendu','Paniqué'];
const groups=computed(()=>profile.value.attributes.map(a=>({...a,skills:profile.value.skills.filter(s=>s.attribute===a.id)})));
const endpoint=computed(()=>`/api/characters/${props.id}/play`);
let timer:ReturnType<typeof setInterval>|undefined,alive=true;
let pending:{requestId:string;version:number;action:string;[key:string]:unknown}|null=null;
function message(cause:unknown){return cause instanceof ApiError&&cause.status===409?'L’état a changé dans un autre onglet. Actualise avant de réessayer.':({combat_not_started:'Commence un combat en lançant l’initiative.',rest_requires_positive_hp:'À 0 PV ou moins, stabilise puis soigne avant le repos.',character_dead:'Le seuil de mort est atteint : les soins ordinaires ne suffisent plus.',cannot_stabilize:'La stabilisation concerne uniquement un personnage agonisant vivant.'} as Record<string,string>)[cause instanceof Error?cause.message:'']??'Action non confirmée. Réessaie la même action pour vérifier son enregistrement.';}
async function load(){
  if(busy.value||dirty.value||!alive)return;
  try{const r=await api<{state:PlayState;version:number;events:any[]}>(endpoint.value);if(!alive||busy.value||dirty.value)return;const first=!loaded.value;state.value=r.state;version.value=r.version;events.value=r.events;loaded.value=true;error.value='';if(first)emit('ready');}catch(cause){if(alive)error.value=message(cause);}
}
async function perform(action:string,extra:Record<string,unknown>={}){
  if(busy.value||!loaded.value||!props.canEdit)return;
  if(dirty.value&&action!=='save'){await save();if(dirty.value||error.value)return;}
  if(pending&&pending.action!==action){error.value='Réessaie l’action non confirmée avant d’en effectuer une autre.';return;}
  pending??={requestId:crypto.randomUUID(),version:version.value,action,...extra};
  busy.value=true;error.value='';notice.value='';
  try{
    const r=await api<any>(endpoint.value,{method:'POST',body:JSON.stringify(pending)});
    pending=null;
    if(!alive)return;
    dirty.value=false;
    if(r.state){state.value=r.state;version.value=r.version;events.value=[r.event,...events.value].slice(0,30);if(r.event.payload.dice)lastRoll.value=r.event;notice.value=r.event.payload.recovered!==undefined?`${r.event.payload.recovered} PV récupérés.`:'Enregistré.';}
    busy.value=false;await load();
  }catch(cause){if(alive){error.value=message(cause);if(cause instanceof ApiError&&cause.status<500){pending=null;if(cause.status===409){dirty.value=false;busy.value=false;await load();}}}}
  finally{busy.value=false;}
}
function save(){return perform('save',{state:JSON.parse(JSON.stringify(state.value))});}
function addBonus(){if(!bonusLabel.value.trim())return;state.value.bonuses.push({id:crypto.randomUUID(),label:bonusLabel.value.trim(),skill:bonusSkill.value,amount:bonusAmount.value,truth:bonusTruth.value,enabled:true});bonusLabel.value='';dirty.value=true;}
function toggleAutomatic(id:string,enabled:boolean){state.value.disabled=enabled?state.value.disabled.filter(x=>x!==id):[...state.value.disabled,id];dirty.value=true;}
function toggleContext(id:string,enabled:boolean){state.value.contexts=enabled?[...state.value.contexts,id]:state.value.contexts.filter(x=>x!==id);dirty.value=true;}
const sourceOptions=computed(()=>[...props.sheet.realityTalents.map(s=>({name:s.name,truth:false})),...props.sheet.inventory.map(s=>({name:s.name,truth:s.group?.startsWith('Objet de Vérité')??false})),...props.sheet.truthTalents.map(s=>({name:s.name,truth:true}))]);
function sourceChanged(){bonusTruth.value=sourceOptions.value.find(s=>s.name===bonusLabel.value)?.truth??false;}
onMounted(()=>{void load();timer=setInterval(()=>{if(document.visibilityState==='visible')void load();},5000);});
onUnmounted(()=>{alive=false;clearInterval(timer);});
</script>
<template>
<section class="play-panel" aria-label="Personnage en jeu">
  <header><div><p class="eyebrow">EN JEU</p><h2>{{ sheet.name }}</h2></div><a class="ghost" :href="`/characters/${id}/play`" target="_blank" rel="noopener">Ouvrir dans un onglet dédié ↗</a></header>
  <p v-if="error" role="alert">{{ error }}</p><p v-if="notice" role="status">{{ notice }}</p>
  <p v-if="!loaded">Chargement de l’état en jeu…</p>
  <template v-else>
    <div class="play-vitals"><strong>{{ profile.hp }} / {{ profile.derived.pvMax }} PV</strong><strong>{{ profile.health }}</strong><span>{{ stressNames[profile.stress] }}</span><span>{{ profile.pa }} PA · Round {{ state.round }}</span><span v-if="state.initiative!==null">Initiative du combat : {{ state.initiative }} · {{ state.paPerRound }} PA par round</span></div>
    <fieldset :disabled="busy||!canEdit">
      <legend>États et ressources</legend>
      <div class="play-fields">
        <label>Révélation<select v-model="state.revelation" @change="dirty=true"><option value="v">Voilé</option><option value="sr">Semi-révélé</option><option value="r">Révélé</option></select></label>
        <label>Stress indépendant des blessures<select v-model.number="state.stress" @change="dirty=true"><option :value="0">Neutre (Normal)</option><option :value="1">Tendu</option><option :value="2">Paniqué</option></select></label>
        <label>PA restants<input type="number" min="0" :max="profile.hp<=0?1:5" v-model.number="state.pa" @input="dirty=true" /></label>
        <label>Round<input type="number" min="1" max="100000" v-model.number="state.round" @input="dirty=true" /></label>
      </div>
      <label v-for="bonus in profile.attributeBonuses" :key="bonus.id" class="check"><input type="checkbox" :checked="bonus.enabled" @change="toggleAutomatic(bonus.id,($event.target as HTMLInputElement).checked)" />{{ bonus.label }} +{{ bonus.amount }}<em v-if="bonus.truth&&state.revelation!=='r'"> — Vérité inactive</em></label>
      <label v-for="bonus in profile.mechanics" :key="bonus.id" class="check"><input type="checkbox" :checked="bonus.enabled" @change="toggleAutomatic(bonus.id,($event.target as HTMLInputElement).checked)" />{{ bonus.label }}</label>
      <p>Le Stress effectif tient compte des blessures. Les bonus marqués Vérité sont désactivés tant que tu n’es pas Révélé.</p>
      <label class="check"><input type="checkbox" v-model="state.share" @change="dirty=true" /> Montrer mon portrait, mon nom, mon occupation, ma Sphère et mon état général aux joueurs de ma campagne.</label>
      <button :disabled="!dirty" @click="save">Enregistrer les états et bonus{{ dirty?' *':'' }}</button>
    </fieldset>
    <fieldset :disabled="busy||!canEdit"><legend>Blessures, soins et combat</legend><div class="play-fields"><label>Nombre de PV<input v-model.number="amount" type="number" min="1" max="10000" /></label><button @click="perform('damage',{amount})">Subir les dégâts</button><button @click="perform('heal',{amount})">Recevoir les soins</button><button v-if="profile.hp<=0&&profile.hp>profile.derived.death&&!state.stabilized" @click="perform('stabilize')">Stabiliser après réussite du soin</button><button @click="perform('initiative')">◈ Nouveau combat : initiative</button><button :disabled="state.initiative===null" @click="perform('round')">Round suivant</button></div><p>L’initiative est conservée pendant tout le combat. Chaque nouveau round restitue les PA du combat, avec un plafond de 1 PA à 0 PV ou moins (Agonisant ou Stabilisé). Déduis les PA dépensés dans le compteur ; relance l’initiative au début du prochain combat.</p></fieldset>
    <fieldset :disabled="busy||!canEdit"><legend>Récupération entre les scènes</legend><div class="play-fields"><label>Jours de repos<input v-model.number="days" type="number" min="1" max="365" /></label><label class="check"><input v-model="prolonged" type="checkbox" /> Soins prolongés</label><strong>{{ Math.max(0,Math.min(profile.derived.pvMax-profile.hp,days*(prolonged?profile.recovery.prolonged:profile.recovery.normal))) }} PV à récupérer</strong><button @click="perform('rest',{days,prolonged})">Appliquer ce repos</button></div><p>{{ profile.recovery.normal }} PV/jour · {{ profile.recovery.prolonged }} PV/jour avec soins prolongés. Les soins particuliers sont à appliquer avec « Recevoir les soins ».</p></fieldset>
    <details><summary>Configurer un bonus de pouvoir, d’augmentation ou de situation</summary><fieldset :disabled="busy||!canEdit"><legend>Bonus supplémentaire explicite</legend><p>Les bonus préparés apparaissent sous les compétences concernées. Ce réglage permet d’ajouter un effet particulier ou un ajustement de situation convenu avec le MJ.</p><div class="play-fields"><label>Source<select v-model="bonusLabel" @change="sourceChanged"><option value="">Choisir…</option><option v-for="s in sourceOptions" :key="s.name" :value="s.name">{{ s.name }}</option><option value="Situation (MJ)">Situation (MJ)</option></select></label><label>Compétence<select v-model="bonusSkill"><option v-for="s in profile.skills" :key="s.id" :value="s.id">{{ s.name }}</option></select></label><label>Bonus / malus<input type="number" min="-100" max="100" v-model.number="bonusAmount" /></label><label class="check"><input type="checkbox" v-model="bonusTruth" /> Vérité : Révélé seulement</label><button @click="addBonus">Ajouter</button></div></fieldset></details>
    <div v-if="lastRoll" :key="lastRoll.id" class="roll-result" role="status"><strong>{{ lastRoll.payload.label }}</strong><span v-for="(die,i) in lastRoll.payload.dice" :key="i" class="die" :style="{'animation-delay':`${Number(i)*.45}s`}">{{ die }}</span><span v-if="lastRoll.payload.exploded">Explosion !</span><strong>{{ lastRoll.payload.modifier }} + {{ lastRoll.payload.dice.join(' + ') }} = {{ lastRoll.payload.total }}</strong><strong v-if="lastRoll.payload.narrativeFailure" class="failure">Échec narratif, quel que soit le total.</strong></div>
    <p>Neutre : échec sur 1, explosion sur 10. Tendu : échec sur 1–2, explosion sur 9–10. Paniqué : échec sur 1–3, explosion sur 10. Le deuxième dé n’explose jamais. Pour les bonus préparés équivalents, seul le meilleur s’applique ; les ajustements manuels s’ajoutent.</p>
    <details v-for="group in groups" :key="group.id" open><summary>{{ group.name }} · {{ group.value }}</summary><article v-for="skill in group.skills" :key="skill.id" class="skill-roll"><div class="skill-line"><strong>{{ skill.name }}</strong><span>{{ skill.attributeValue }} + {{ skill.rank }}<template v-if="skill.bonus"> {{ skill.bonus>=0?'+':'−' }} {{ Math.abs(skill.bonus) }}</template> = <b>{{ skill.total }}</b></span><button :disabled="busy||!canEdit" :aria-label="`Lancer le d10 pour ${skill.name}`" @click="perform('roll',{skill:skill.id})">◈ d10</button></div><small>{{ group.name }} + rang de compétence + bonus actifs</small>
      <label v-for="bonus in skill.automatic" :key="bonus.id" class="check"><input type="checkbox" :checked="bonus.enabled" :disabled="busy||!canEdit" @change="toggleAutomatic(bonus.id,($event.target as HTMLInputElement).checked)" />{{ bonus.label }} +{{ bonus.amount }}</label>
      <label v-for="bonus in skill.contexts" :key="bonus.id" class="check"><input type="checkbox" :checked="bonus.enabled" :disabled="busy||!canEdit" @change="toggleContext(bonus.id,($event.target as HTMLInputElement).checked)" />{{ bonus.label }} +{{ bonus.bonus }} (meilleur bonus de Talent applicable)</label>
      <label v-for="bonus in skill.prepared" :key="bonus.id" class="check"><input type="checkbox" :checked="bonus.enabled" :disabled="busy||!canEdit" @change="toggleContext(bonus.id,($event.target as HTMLInputElement).checked)" />{{ bonus.label }} +{{ bonus.bonus }}<em v-if="bonus.truth&&state.revelation!=='r'"> — Vérité inactive</em></label>
      <div v-for="bonus in state.bonuses.filter(b=>b.skill===skill.id)" :key="bonus.id" class="custom-bonus"><label class="check"><input type="checkbox" v-model="bonus.enabled" :disabled="busy||!canEdit" @change="dirty=true" />{{ bonus.label }} {{ bonus.amount>=0?'+':'' }}{{ bonus.amount }} {{ bonus.truth?'· Vérité':'' }}<em v-if="bonus.truth&&state.revelation!=='r'"> — inactif</em></label><button :disabled="busy||!canEdit" aria-label="Retirer ce bonus" @click="state.bonuses=state.bonuses.filter(b=>b.id!==bonus.id);dirty=true">Retirer</button></div>
    </article></details>
    <details><summary>Historique partagé avec le MJ</summary><article v-for="event in events" :key="event.id" class="event"><small>{{ new Date(event.createdAt).toLocaleString('fr-FR') }}</small><strong>{{ event.payload.label }}</strong><span v-if="event.payload.dice">{{ event.payload.modifier }} + {{ event.payload.dice.join(' + ') }} = {{ event.payload.total }}{{ event.payload.narrativeFailure?' · ÉCHEC NARRATIF':'' }}</span><span v-if="event.payload.before!==undefined">{{ event.payload.before }} → {{ event.payload.after }} PV</span><span v-if="event.payload.recovered!==undefined">+{{ event.payload.recovered }} PV en {{ event.payload.days }} jour(s)</span></article></details>
  </template>
</section>
</template>
<style scoped>
.play-panel{display:grid;gap:18px;padding:20px;background:#0d1b2b;border:1px solid #355267;border-radius:10px;margin:20px 0;color:#e6eef8;overflow-wrap:anywhere}.play-panel header,.play-vitals,.skill-line,.custom-bonus{display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap}.play-panel h2{margin:4px 0}.play-panel fieldset{border:1px solid #355267;border-radius:8px;padding:16px;min-width:0}.play-fields{display:flex;gap:12px;align-items:end;flex-wrap:wrap}.play-fields label{display:grid;gap:6px;flex:1;min-width:120px}.play-panel .check{display:flex;gap:8px;align-items:center;margin:10px 0}.play-panel input:not([type=checkbox]),.play-panel select{width:100%;min-width:0;padding:10px;background:#071320;color:inherit;border:1px solid #526c80;border-radius:4px}.play-panel button,.play-panel a{min-height:44px;padding:10px 14px;border:1px solid #52758b;background:#102b3e;color:#c3f4ff;border-radius:5px;cursor:pointer}.play-panel button:disabled{opacity:.5;cursor:default}.play-panel summary{padding:12px;cursor:pointer;background:#142839}.skill-roll{padding:15px;border-bottom:1px solid #355267}.skill-roll small{color:#acc1d0}.play-vitals{padding:15px;border:1px solid #78bcd0}.play-vitals strong{font-size:1.25rem}.event{display:flex;flex-wrap:wrap;gap:10px;padding:12px;border-bottom:1px solid #355267}.event small{color:#acc1d0}.roll-result{display:flex;flex-wrap:wrap;gap:16px;align-items:center;border:1px solid #8cdcfa;padding:16px}.die{display:grid;place-items:center;width:48px;height:48px;background:#bcefff;color:#092130;font-weight:bold;font-size:22px;clip-path:polygon(50% 0,100% 30%,85% 85%,50% 100%,15% 85%,0 30%);animation:roll .45s both}.failure{color:#ffb4b4}@keyframes roll{from{transform:rotate(-180deg) scale(.5);opacity:0}to{transform:none;opacity:1}}@media(prefers-reduced-motion:reduce){.die{animation:none}}@media(max-width:500px){.play-panel{padding:12px}.play-panel fieldset{padding:10px}.skill-line>span{flex-basis:100%}}
</style>
