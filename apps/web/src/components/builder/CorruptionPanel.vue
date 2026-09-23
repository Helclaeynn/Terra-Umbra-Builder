<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from "vue";
import { cloneJson } from "../../lib/json";
import BuilderWikiLink from "./BuilderWikiLink.vue";
import {
  truthCorruptionDepth,
  truthCorruptionPrerequisiteSatisfied,
  truthCorruptionTalentActive,
  truthNorm,
  type CorruptionTalent,
  type TruthRulesPackage,
  type TruthState
} from "../../lib/truth";

const props=defineProps<{
  modelValue:TruthState;
  rules:TruthRulesPackage;
  integrity:number;
  ptvRemaining:number;
}>();

const emit=defineEmits<{
  "update:modelValue":[value:TruthState];
  "request-initiation":[];
}>();

const catalogSource=ref("");
const catalogQuery=ref("");
const catalogKind=ref<"all"|"DON"|"RITE"|"FAVEUR">("all");
const availableOnly=ref(false);
const catalogSearchInput=ref<HTMLInputElement|null>(null);
const ownedHeading=ref<HTMLElement|null>(null);
const liveMessage=ref("");
const panelId=useId();

watch(
  ()=>props.modelValue.corruptionSource,
  value=>{
    if(value){
      catalogSource.value=value;
    }
    else if(!catalogSource.value)catalogSource.value=props.rules.corruption.sources[0]?.id??"";
  },
  {immediate:true}
);

const sourceMap=computed(()=>new Map(props.rules.corruption.sources.map(source=>[source.id,source])));
const talentMap=computed(()=>new Map(props.rules.corruption.talents.map(talent=>[talent.id,talent])));
const selectedIds=computed(()=>new Set(props.modelValue.corruptionTalents??[]));
const depth=computed(()=>truthCorruptionDepth(props.modelValue.corruption,props.integrity));
const currentSource=computed(()=>sourceMap.value.get(props.modelValue.corruptionSource)??null);
const selectedTalents=computed(()=>
  (props.modelValue.corruptionTalents??[])
    .map(id=>talentMap.value.get(id))
    .filter((talent):talent is CorruptionTalent=>!!talent)
);
const hasCorruptionState=computed(()=>
  props.modelValue.corruption>0||(props.modelValue.corruptionTalents??[]).length>0
);
const hasDominantCorruption=computed(()=>props.modelValue.corruption>0&&!!currentSource.value);
const gaugeMax=computed(()=>Math.max(1,Math.floor(Number.isFinite(props.integrity)?props.integrity:1)));
const gaugeValue=computed(()=>Math.max(0,Math.min(gaugeMax.value,Math.trunc(Number(props.modelValue.corruption)||0))));
const thresholds=computed(()=>[
  {value:1,label:"Marqué",depth:"Marqué"},
  {value:Math.ceil(gaugeMax.value/2),label:"Envahi",depth:"Envahi"},
  {value:Math.max(1,gaugeMax.value-1),label:"Au bord",depth:"Au bord de la Rupture"},
  {value:gaugeMax.value,label:"Bascule · DD 18",depth:"Seuil atteint"}
].filter(item=>truthCorruptionDepth(item.value,gaugeMax.value)===item.depth));
const nextThreshold=computed(()=>thresholds.value.find(item=>item.value>gaugeValue.value));
const catalogKinds=computed(()=>[
  {id:"all" as const,label:"Toutes"},
  ...(hasDominantCorruption.value?[{id:"DON" as const,label:"Dons"}]:[]),
  {id:"RITE" as const,label:"Rites"},
  {id:"FAVEUR" as const,label:"Faveurs"}
]);

watch(hasDominantCorruption,value=>{
  if(!value&&catalogKind.value==="DON")catalogKind.value="all";
});

const visibleTalents=computed(()=>{
  const source=catalogSource.value||props.modelValue.corruptionSource||"all";
  const query=truthNorm(catalogQuery.value);
  return props.rules.corruption.talents.filter(talent=>
    (source==="all"||talent.sourceId===source)&&
    (hasDominantCorruption.value||talent.kind!=="DON")&&
    (catalogKind.value==="all"||talent.kind===catalogKind.value)&&
    (!query||truthNorm(`${talent.name} ${talent.family} ${talent.effect} ${talent.prerequisiteName}`).includes(query))&&
    (!availableOnly.value||canBuy(talent))
  );
});

function update(mutator:(state:TruthState)=>void){
  const next=cloneJson(props.modelValue);
  next.corruptionMjAuthorized=Boolean(next.corruptionMjAuthorized);
  next.corruption=Math.max(0,Math.min(gaugeMax.value,Math.trunc(Number(next.corruption)||0)));
  next.corruptionSource=String(next.corruptionSource||"");
  next.corruptionTalents=[...new Set(next.corruptionTalents??[])];
  mutator(next);
  if(next.corruption<=0){
    next.corruption=0;
    next.corruptionSource="";
  }else if(!sourceMap.value.has(next.corruptionSource)){
    next.corruption=0;
    next.corruptionSource="";
  }
  emit("update:modelValue",next);
}

function setAuthorized(value:boolean){
  if(!value&&hasCorruptionState.value)return;
  update(next=>{
    next.corruptionMjAuthorized=value;
    if(!value){
      next.corruption=0;
      next.corruptionSource="";
      next.corruptionTalents=[];
    }
  });
}


function setSource(id:string){
  if(!props.modelValue.corruptionMjAuthorized)return;
  update(next=>{
    if(!id){
      next.corruption=0;
      next.corruptionSource="";
      return;
    }
    next.corruptionSource=id;
    if(next.corruption<1)next.corruption=1;
  });
  if(id)catalogSource.value=id;
}

function changeCorruption(delta:number){
  if(!props.modelValue.corruptionMjAuthorized)return;
  update(next=>{
    if(delta>0&&!next.corruptionSource)return;
    next.corruption=Math.max(0,Math.min(gaugeMax.value,next.corruption+delta));
  });
}

function sourceLabel(id:string){
  const source=sourceMap.value.get(id);
  return source?`${source.name} — ${source.corruption}`:id;
}

function selected(talent:CorruptionTalent){
  return selectedIds.value.has(talent.id);
}

function active(talent:CorruptionTalent){
  return truthCorruptionTalentActive(talent,props.modelValue,props.integrity);
}

function buyBlockReason(talent:CorruptionTalent){
  if(!props.modelValue.corruptionMjAuthorized)return "Autorisation MJ requise";
  if(props.modelValue.consciousness==="profane")return "Initiation requise";
  if(selected(talent))return "";
  if(props.ptvRemaining<talent.cost)return "PTV insuffisants";
  if(!truthCorruptionPrerequisiteSatisfied(props.rules,props.modelValue,talent))return "Prérequis manquant";
  if(talent.kind==="DON"){
    if(props.modelValue.corruptionSource!==talent.sourceId)return "Source dominante différente";
    if(!active(talent))return `Profondeur ${talent.depth} requise`;
  }
  return "";
}

function canBuy(talent:CorruptionTalent){
  return !selected(talent)&&!buyBlockReason(talent);
}

function removeCascade(id:string){
  update(next=>{
    let ids=next.corruptionTalents.filter(value=>value!==id);
    let changed=true;
    while(changed){
      changed=false;
      const state={...next,corruptionTalents:ids};
      const pruned=ids.filter(value=>{
        const talent=talentMap.value.get(value);
        return !talent||truthCorruptionPrerequisiteSatisfied(props.rules,state,talent);
      });
      if(pruned.length!==ids.length){
        ids=pruned;
        changed=true;
      }
    }
    next.corruptionTalents=ids;
  });
  liveMessage.value="Capacité retirée. Les capacités qui en dépendent sont également retirées.";
}

function toggle(talent:CorruptionTalent){
  if(!props.modelValue.corruptionMjAuthorized)return;
  if(selected(talent)){
    removeCascade(talent.id);
    return;
  }
  if(!canBuy(talent))return;
  update(next=>{next.corruptionTalents=[...next.corruptionTalents,talent.id];});
  liveMessage.value=`${talent.name} acquis · ${talent.cost} PTV dépensés.`;
  if(availableOnly.value)void nextTick(()=>catalogSearchInput.value?.focus({preventScroll:true}));
}

function removeOwned(id:string){
  removeCascade(id);
  void nextTick(()=>ownedHeading.value?.focus({preventScroll:true}));
}

function resetFilters(){
  catalogQuery.value="";
  catalogKind.value="all";
  availableOnly.value=false;
  catalogSource.value=props.modelValue.corruptionSource||"all";
  void nextTick(()=>catalogSearchInput.value?.focus({preventScroll:true}));
}

function souillureDifficulty(talent:CorruptionTalent){
  if(talent.kind==="DON")return "";
  if(talent.cost===1)return "Souillure 15";
  if(talent.cost===2)return "Souillure 18";
  if(talent.cost===3)return "Souillure 21";
  return "";
}

function talentExcerpt(talent:CorruptionTalent){
  // Only the preview is shortened; the complete canonical effect stays in the disclosure.
  const start=talent.effect.search(/Le porteur|Lorsqu[’']une|Lorsque |Ce rite |Le rite |La cible |Le fidèle |Le bénéficiaire |Le personnage |La Faveur |Une fois |Un porteur |Il peut |Elle permet /);
  const text=start>=0?talent.effect.slice(start):talent.effect;
  return text.length>180?text.slice(0,180).replace(/\s+\S*$/,"")+"…":text;
}

function talentState(talent:CorruptionTalent){
  if(!selected(talent))return buyBlockReason(talent);
  if(talent.kind==="DON"&&!active(talent))return "Dormant";
  if(talent.kind==="FAVEUR")return "Active si le lien extérieur subsiste";
  return "Actif";
}
</script>

<template>
  <label class="corruption-authorization" :class="{ active: modelValue.corruptionMjAuthorized }">
    <span class="authorization-copy">
      <strong>Autorisation MJ — Corruption & Fléaux</strong>
      <small>Ouvre ce bloc pour une création corrompue ou l’acquisition de Rites et Faveurs, avec l’accord explicite du MJ.</small>
      <small v-if="modelValue.corruptionMjAuthorized && hasCorruptionState">Retirez d’abord toute Corruption et toute capacité de Fléau pour refermer ce bloc.</small>
      <small v-else-if="hasCorruptionState">Des données de Corruption sont conservées. Réactivez l’autorisation pour les consulter.</small>
      <small v-else-if="modelValue.corruptionMjAuthorized">Peut être retirée tant qu’aucune Corruption ni capacité n’a été enregistrée.</small>
    </span>
    <span class="authorization-switch">
      <input
        type="checkbox"
        aria-label="Autorisation MJ — Corruption & Fléaux"
        :aria-controls="panelId"
        :checked="modelValue.corruptionMjAuthorized"
        :disabled="modelValue.corruptionMjAuthorized && hasCorruptionState"
        @change="setAuthorized(($event.target as HTMLInputElement).checked)"
      />
      <span aria-hidden="true"></span>
    </span>
  </label>

  <section v-if="modelValue.corruptionMjAuthorized" :id="panelId" class="corruption-panel" :aria-labelledby="`${panelId}-heading`">
    <header class="corruption-heading">
      <p class="eyebrow">VÉRITÉ · L’EMPRISE DU FLÉAU</p>
      <h3 :id="`${panelId}-heading`">Corruption & Fléaux</h3>
      <p>Mesurez l’emprise de votre Source. Choisissez les capacités qui l’accompagnent.</p>
    </header>

    <div class="corruption-state-grid">
      <article class="corruption-gauge" :aria-labelledby="`${panelId}-gauge-heading`">
        <div class="panel-top"><h4 :id="`${panelId}-gauge-heading`">Niveau de corruption</h4><span class="schema-badge">Intégrité · {{ gaugeMax }}</span></div>
        <div class="gauge-heading">
          <div><p class="eyebrow">ÉTAT ACTUEL</p><h4>{{ depth }}</h4></div>
          <div class="stepper">
            <button type="button" aria-label="Diminuer la corruption" :disabled="gaugeValue<=0" @click="changeCorruption(-1)">−</button>
            <strong><span>{{ gaugeValue }}</span> / {{ gaugeMax }}</strong>
            <button type="button" aria-label="Augmenter la corruption" :disabled="!currentSource || gaugeValue>=gaugeMax" @click="changeCorruption(1)">+</button>
          </div>
        </div>
        <div
          class="corruption-segments"
          role="meter"
          aria-label="Corruption"
          :aria-valuemin="0"
          :aria-valuemax="gaugeMax"
          :aria-valuenow="gaugeValue"
          :aria-valuetext="`${gaugeValue} sur ${gaugeMax} · ${depth}`"
          :style="{gridTemplateColumns:`repeat(${gaugeMax},minmax(0,1fr))` }"
        >
          <span v-for="segment in gaugeMax" :key="segment" class="segment" :class="{filled:segment<=gaugeValue,limit:segment===gaugeMax}" aria-hidden="true"></span>
        </div>
        <div class="corruption-depths" aria-label="Seuils de corruption">
          <span v-for="threshold in thresholds" :key="threshold.depth" :class="{current:depth===threshold.depth}"><b>{{ String(threshold.value).padStart(2,'0') }}</b><small>{{ threshold.label }}</small></span>
        </div>
        <p v-if="gaugeValue!==modelValue.corruption" class="threshold-note bad">Valeur enregistrée : {{ modelValue.corruption }}. Ajustez la Corruption dans les limites de votre Intégrité.</p>
        <div class="threshold-note" :class="{bad:gaugeValue>=gaugeMax}">
          <template v-if="gaugeValue>=gaugeMax"><strong>Seuil de Bascule atteint.</strong> Volonté + Maîtrise spirituelle + 1d10e contre 18. Une réussite maintient la Corruption au maximum ; un échec produit normalement une Rupture et fait sortir le personnage du cadre PJ standard.</template>
          <template v-else-if="gaugeValue===0"><strong>Aucune Corruption.</strong> Choisir une Source porte la jauge à 1. Les Dons déjà acquis restent dormants.</template>
          <template v-else-if="nextThreshold"><strong>Prochain palier : {{ nextThreshold.label }}.</strong> {{ nextThreshold.value-gaugeValue }} point{{ nextThreshold.value-gaugeValue>1?'s':'' }} avant ce palier.</template>
        </div>
      </article>

      <article class="corruption-source-card">
        <div class="panel-top"><h4>Source dominante</h4><span aria-hidden="true" class="source-mark">◈</span></div>
        <label class="source-choice">
          <span class="sr-only">Choisir la Source dominante</span>
          <select :value="modelValue.corruptionSource" @change="setSource(($event.target as HTMLSelectElement).value)">
            <option value="">Aucune — Sain</option>
            <option v-for="source in rules.corruption.sources" :key="source.id" :value="source.id">{{ source.name }}</option>
          </select>
        </label>
        <div class="source-identity">
          <p>{{ currentSource?.corruption || 'Aucune emprise' }}</p>
          <div class="source-principle"><small>PRINCIPE</small><strong>{{ currentSource?.principle || 'Sain' }}</strong></div>
        </div>
        <BuilderWikiLink v-if="currentSource" :label="sourceLabel(currentSource.id)" :article-id="currentSource.compendiumId" category="Règles" compact><span>Lire les règles de la Source</span></BuilderWikiLink>
        <details class="source-help"><summary>Que se passe-t-il si je change de Source ?</summary><p>Une seule Source domine la jauge. Les Dons acquis d’une autre Source restent sur la fiche mais deviennent dormants. Leurs PTV ne sont pas remboursés.</p></details>
      </article>
    </div>

    <details class="corruption-rules">
      <summary><strong>Comprendre la Souillure et les capacités</strong><span>Règles essentielles</span></summary>
      <div class="rules-content">
        <div><h4>Tests de Souillure</h4><p>Exposition physique : <strong>Vigueur + Constitution</strong>. Exposition mentale, spirituelle ou essentielle : <strong>Volonté + Force Mentale</strong>.</p><p>Un Rite ou une Faveur provoque un test à chaque activation surnaturelle : <strong>1 PTV → 15 · 2 PTV → 18 · 3 PTV → 21</strong>.</p></div>
        <div><h4>Trois formes de capacités</h4><p><strong>Dons</strong> — Source dominante et profondeur requises.</p><p><strong>Rites</strong> — restent connus après purification ; leur usage est corrupteur.</p><p><strong>Faveurs</strong> — actives tant que le Patron, la marque ou le lien extérieur subsiste.</p></div>
        <div class="corruption-precedence"><strong>Préséance en cas d’égalité</strong><p>{{ rules.corruption.precedence.map(sourceLabel).join(' → ') }}</p></div>
      </div>
    </details>

    <div v-if="modelValue.consciousness==='profane'" class="corruption-initiation-note">
      <p><strong>Initiation requise pour acheter.</strong> Un personnage Profane conserve ses PTV en réserve, même si sa Corruption est déjà renseignée.</p>
      <button class="secondary compact" type="button" @click="emit('request-initiation')">Choisir la Conscience</button>
    </div>

    <section class="corruption-catalog" :aria-labelledby="`${panelId}-catalog-heading`">
      <header class="catalog-heading corruption-purchase-note">
        <div><p class="eyebrow">CHOISIR SES CAPACITÉS</p><h4 :id="`${panelId}-catalog-heading`">{{ hasDominantCorruption ? 'Catalogue des six Fléaux' : 'Rites & Faveurs — sans Corruption' }}</h4><p v-if="hasDominantCorruption">Choisir une Source ne dépense aucun PTV. Les PTV servent à acheter les capacités ci-dessous.</p><p v-else>Dons masqués ; vos Dons acquis restent dormants et conservent leur coût.</p></div>
        <div class="ptv-summary" :class="{bad:ptvRemaining<0}"><strong>{{ ptvRemaining }}</strong><span>PTV disponibles</span></div>
      </header>

      <div class="catalog-layout">
        <div class="catalog-main">
          <div class="catalog-toolbar">
            <label class="catalog-search"><span class="sr-only">Rechercher une capacité</span><input ref="catalogSearchInput" v-model="catalogQuery" type="search" placeholder="Rechercher une capacité, un effet…" autocomplete="off" /></label>
            <label class="catalog-source"><span class="sr-only">Source du catalogue</span><select v-model="catalogSource"><option value="all">Toutes les Sources</option><option v-for="source in rules.corruption.sources" :key="source.id" :value="source.id">{{ source.name }}</option></select></label>
          </div>
          <div class="catalog-filters">
            <div class="kind-filters" role="group" aria-label="Type de capacité"><button v-for="kind in catalogKinds" :key="kind.id" type="button" :data-kind="kind.id" :aria-pressed="catalogKind===kind.id" @click="catalogKind=kind.id">{{ kind.label }}</button></div>
            <label class="available-filter"><input v-model="availableOnly" type="checkbox" /> Accessibles uniquement</label>
          </div>
          <div class="catalog-results"><span aria-live="polite">{{ visibleTalents.length }} capacité{{ visibleTalents.length!==1?'s':'' }} affichée{{ visibleTalents.length!==1?'s':'' }}</span><span>{{ sourceMap.get(catalogSource)?.name || 'Les six Sources' }}</span></div>
          <p class="sr-only" role="status">{{ liveMessage }}</p>

          <div v-if="!visibleTalents.length" class="catalog-empty"><h4>Aucune capacité correspondante</h4><p>Essayez un autre terme ou élargissez vos filtres.</p><button class="secondary" type="button" @click="resetFilters">Réinitialiser les filtres</button></div>
          <div v-else class="corruption-grid">
            <article v-for="talent in visibleTalents" :key="talent.id" class="corruption-talent-card" :class="{selected:selected(talent),dormant:selected(talent)&&talent.kind==='DON'&&!active(talent)}">
              <div class="corruption-talent-head"><div><span :data-kind="talent.kind">{{ talent.kind }} · {{ talent.cost }} PTV</span><strong>{{ talent.name }}</strong></div></div>
              <div class="truth-talent-meta"><span>{{ talent.depth || talent.family }}</span><span v-if="souillureDifficulty(talent)">{{ souillureDifficulty(talent) }}</span></div>
              <p class="talent-excerpt">{{ talentExcerpt(talent) }}</p>
              <details class="talent-detail"><summary>Lire l’effet complet</summary><p>{{ talent.effect }}</p><p v-if="talent.prerequisiteName"><strong>Prérequis :</strong> {{ talent.prerequisiteName }}</p><p>{{ talent.sourceName }} · {{ talent.family }}</p><BuilderWikiLink :label="talent.name" :article-id="talent.compendiumId" category="Règles" compact><span>Règles du Fléau</span></BuilderWikiLink></details>
              <div class="talent-actions"><p class="buy-reason">{{ selected(talent)?talentState(talent):buyBlockReason(talent) }}</p><button class="purchase-button" type="button" :class="{remove:selected(talent)}" :disabled="!selected(talent)&&!canBuy(talent)" :aria-label="selected(talent)?`Retirer ${talent.name}`:`Acquérir ${talent.name} pour ${talent.cost} PTV`" @click="toggle(talent)">{{ selected(talent)?'Retirer':`Acquérir · ${talent.cost} PTV` }}</button></div>
            </article>
          </div>
        </div>

        <aside class="corruption-owned" :aria-labelledby="`${panelId}-owned-heading`">
          <header class="owned-heading"><p class="eyebrow">MON PERSONNAGE</p><h4 :id="`${panelId}-owned-heading`" ref="ownedHeading" tabindex="-1">Capacités acquises <span>{{ selectedTalents.length }}</span></h4></header>
          <div v-if="!selectedTalents.length" class="owned-empty"><strong>Aucune capacité acquise</strong><p>Explorez le catalogue. Vos choix et leur état apparaîtront ici.</p></div>
          <article v-for="talent in selectedTalents" :key="talent.id" class="corruption-owned-row"><div class="owned-copy"><strong>{{ talent.name }}</strong><span>{{ talent.sourceName }} · {{ talent.cost }} PTV</span><small :class="{dormant:talentState(talent)==='Dormant'}">{{ talentState(talent) }}</small></div><button type="button" :aria-label="`Retirer ${talent.name} des capacités acquises`" @click="removeOwned(talent.id)">Retirer</button></article>
          <p class="owned-note">Un Don dormant reste acquis et conserve son coût en PTV.</p>
        </aside>
      </div>
    </section>
  </section>
</template>

<style scoped>
.corruption-panel,
.corruption-authorization,
.authorization {
  --corruption-line: #2d3e53;
  --corruption-text: #eaf2fa;
  --corruption-muted: #a0b3c8;
  --corruption-cyan: #66ded5;
  --corruption-violet: #baa0ee;
  --corruption-amber: #eac8a3;
  color: var(--corruption-text);
  font-size: 14px;
  line-height: 1.6;
  color-scheme: dark;
}
.corruption-panel {
  container: corruption / inline-size;
  min-width: 0;
  margin-top: 24px;
}
.corruption-panel *,
.corruption-authorization *,
.authorization * {
  box-sizing: border-box;
}
.corruption-panel :is(h2, h3, h4, p) {
  margin: 0;
}
.corruption-panel :is(button, input, select) {
  font: inherit;
}
.corruption-panel :is(button, summary, select) {
  cursor: pointer;
}
.corruption-panel button {
  min-width: 44px;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid var(--corruption-line);
  border-radius: 7px;
  color: var(--corruption-text);
  background: #132130;
  line-height: 1.4;
  white-space: normal;
}
.corruption-panel button:hover:not(:disabled) {
  border-color: #5c8d97;
  background: #1a3040;
}
.corruption-panel button:disabled {
  cursor: not-allowed;
  opacity: .65;
}
.corruption-panel :is(button, input, select, summary, a):focus-visible,
.corruption-authorization input:focus-visible,
.authorization input:focus-visible {
  outline: 2px solid var(--corruption-cyan);
  outline-offset: 4px;
}
.corruption-panel :is(input, select) {
  min-width: 0;
  min-height: 44px;
  border: 1px solid #40516a;
  border-radius: 7px;
  color: var(--corruption-text);
  background-color: #0d1724;
}
.corruption-panel select {
  width: 100%;
  padding: 11px 38px 11px 13px;
}
.corruption-panel [hidden] {
  display: none !important;
}
.corruption-panel .eyebrow {
  margin-bottom: 7px;
  color: var(--corruption-violet);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .12em;
}
.corruption-panel .schema-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  max-width: 100%;
  padding: 5px 9px;
  border: 1px solid #385066;
  border-radius: 6px;
  color: #b9d4e2;
  font-size: 12px;
  line-height: 1.4;
}
.corruption-authorization,
.authorization {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 20px;
  padding: 15px 18px;
  border: 1px solid #2b454d;
  border-radius: 10px;
  background: #0d1c26;
}
.authorization-copy {
  display: grid;
  flex: 1;
  min-width: 0;
  gap: 4px;
}
.authorization-copy :is(strong, h2, h3) {
  margin: 0;
  color: #c7e0e1;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}
.authorization-copy :is(p, small) {
  display: block;
  margin: 0;
  color: var(--corruption-muted);
  font-size: 12px;
  line-height: 1.6;
}
.authorization-switch {
  position: relative;
  display: grid;
  place-items: center;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  cursor: pointer;
}
.authorization-switch input[type=checkbox] {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 44px;
  min-width: 44px;
  max-width: 44px;
  height: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0;
  border: 0;
  opacity: 0;
  cursor: pointer;
}
.authorization-switch input + span {
  display: block;
  width: 42px;
  height: 24px;
  border: 1px solid #567488;
  border-radius: 20px;
  background: #192c3b;
}
.authorization-switch input + span::after {
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  margin: 3px;
  border-radius: 50%;
  background: #9cafc1;
  transition: transform .15s;
}
.authorization-switch input:checked + span {
  border-color: #66b7ad;
  background: #245953;
}
.authorization-switch input:checked + span::after {
  transform: translateX(17px);
  background: #91e1d5;
}
.authorization-switch input:disabled {
  cursor: not-allowed;
}
.authorization-switch input:focus-visible + span {
  outline: 2px solid var(--corruption-cyan);
  outline-offset: 4px;
}
.corruption-heading {
  margin-bottom: 24px;
}
.corruption-heading :is(h2, h3) {
  font:
    650 clamp(26px, 4cqi, 34px)/1.2 Inter,
    "Segoe UI",
    sans-serif;
  letter-spacing: -.02em;
}
.corruption-heading > p:last-child {
  max-width: 78ch;
  margin-top: 10px;
  color: var(--corruption-muted);
  font-size: 14px;
}
.corruption-state-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 18px;
  margin-bottom: 18px;
}
.corruption-gauge,
.corruption-source-card {
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--corruption-line);
  border-radius: 12px;
  background:
    linear-gradient(
      125deg,
      #142234,
      #101925);
}
.corruption-source-card {
  background:
    radial-gradient(
      ellipse at 90% 5%,
      #4c2f6344,
      transparent 75%),
    #121b2a;
}
.panel-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.panel-top :is(h3, h4) {
  color: #cad8e8;
  font-size: 14px;
  font-weight: 500;
}
.gauge-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  margin: 24px 0 20px;
}
.gauge-heading > div:first-child {
  flex: 1 1 160px;
  min-width: 0;
}
.gauge-heading :is(h3, h4) {
  color: #e7d9f7;
  font: 400 26px/1.25 Inter, "Segoe UI", sans-serif;
}
.gauge-heading .eyebrow {
  color: var(--corruption-muted);
}
.stepper {
  display: grid;
  grid-template-columns: 44px minmax(66px, 1fr) 44px;
  align-items: center;
  gap: 9px;
  text-align: center;
}
.stepper button {
  width: 44px;
  height: 44px;
  padding: 0;
  border-color: #4b5c78;
  color: #d0eaf4;
  background: #192b41;
  font-size: 24px;
  line-height: 1;
}
.stepper strong {
  color: #f0e3ff;
  font-size: 25px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.stepper small {
  color: var(--corruption-muted);
  font-size: 14px;
}
.corruption-segments {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: clamp(2px, .65cqi, 7px);
}
.corruption-segments .segment {
  min-width: 0;
  height: 15px;
  border: 1px solid #3d465c;
  border-radius: 3px;
  background: #162236;
}
.corruption-segments .segment.filled {
  border-color: #b6a0d4;
  background:
    linear-gradient(
      90deg,
      #8e81b5,
      #ba9dda);
}
.corruption-depths {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 14px;
}
.corruption-depths span {
  display: grid;
  align-content: start;
  gap: 3px;
  min-width: 0;
  color: #9eafc4;
  font-size: 12px;
}
.corruption-depths b {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
}
.corruption-depths small {
  font-size: 12px;
  line-height: 1.45;
}
.corruption-depths span.current {
  color: #e0c8fa;
}
.corruption-depths span:last-child {
  text-align: right;
}
.threshold-note {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #44435b;
  color: #c6b5dc;
  font-size: 13px;
  line-height: 1.65;
}
.threshold-note strong {
  color: #e6d8f5;
  font-weight: 500;
}
.threshold-note.bad,
.threshold-note.bad strong {
  color: var(--corruption-amber);
}
.source-choice {
  display: block;
  min-width: 0;
}
.source-mark {
  color: var(--corruption-violet);
  font-size: 26px;
  line-height: 1;
}
.corruption-source-card select {
  margin-top: 18px;
}
.corruption-source-card .source-help {
  margin-top: 14px;
}
.corruption-segments .segment.limit.filled {
  border-color: #e4c4a6;
  background: #c8a68e;
}
.source-identity {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  padding: 20px 0 17px;
}
.source-identity > :is(p, h3, h4) {
  color: #e3d8ef;
  font: 400 23px/1.3 Inter, "Segoe UI", sans-serif;
}
.source-principle {
  display: grid;
  gap: 4px;
}
.source-principle :is(span, small) {
  color: #afabc2;
  font-size: 12px;
  letter-spacing: .04em;
}
.source-principle strong {
  color: #deccee;
  font-size: 14px;
  font-weight: 500;
}
.source-help {
  border-top: 1px solid #423a55;
  color: #b2b2cb;
  font-size: 12px;
}
.source-help summary {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 10px 0;
  line-height: 1.5;
}
.source-help p {
  padding: 0 0 4px;
  line-height: 1.7;
}
.corruption-rules {
  margin: 18px 0 24px;
  border: 1px solid var(--corruption-line);
  border-radius: 10px;
  background: #0f1927;
}
.corruption-rules > summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 44px;
  padding: 14px 18px;
  color: #bdcbdf;
  font-size: 13px;
  list-style: none;
}
.corruption-rules > summary::-webkit-details-marker {
  display: none;
}
.corruption-rules > summary::after {
  content: "+";
  color: var(--corruption-cyan);
  font-size: 22px;
}
.corruption-rules[open] > summary::after {
  content: "\2212";
}
.rules-content {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  padding: 20px;
  border-top: 1px solid var(--corruption-line);
  color: var(--corruption-muted);
  font-size: 13px;
  line-height: 1.75;
}
.rules-content :is(h3, h4) {
  margin-bottom: 8px;
  color: #dae5f2;
  font-size: 15px;
}
.rules-content strong {
  color: #d5dfec;
}
.rules-content p + p {
  margin-top: 9px;
}
.corruption-precedence {
  grid-column: 1/-1;
  padding-top: 14px;
  border-top: 1px solid var(--corruption-line);
  font-size: 12px;
  line-height: 1.7;
}
.corruption-purchase-note {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 18px 0;
  color: var(--corruption-muted);
  font-size: 13px;
}
.corruption-purchase-note p {
  flex: 1 1 260px;
}
.corruption-initiation-note,
.initiation-note {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin: 16px 0;
  padding: 14px 16px;
  border: 1px solid #675847;
  border-radius: 9px;
  color: var(--corruption-amber);
  background: #30261b66;
  font-size: 13px;
}
.corruption-initiation-note p,
.initiation-note p {
  flex: 1 1 240px;
}
.catalog-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin: 24px 0 20px;
}
.catalog-heading > div {
  min-width: 0;
}
.catalog-heading > div:first-child {
  flex: 1 1 280px;
}
.ptv-summary {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 12px;
  min-height: 56px;
  padding: 11px 15px;
  border: 1px solid #41676a;
  border-radius: 8px;
  color: #b7e6e3;
  background: #142e34;
}
.ptv-summary strong {
  color: #97e8dd;
  font-size: 28px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
.ptv-summary span {
  font-size: 13px;
}
.ptv-summary.bad {
  border-color: #ae7d69;
  color: var(--corruption-amber);
  background: #412a2366;
}
.ptv-summary.bad strong {
  color: var(--corruption-amber);
}
.catalog-heading :is(h3, h4) {
  color: #e6edf7;
  font: 400 28px/1.25 Inter, "Segoe UI", sans-serif;
}
.catalog-heading .eyebrow {
  color: #8ad8d7;
}
.catalog-heading p:last-child {
  max-width: 75ch;
  margin-top: 9px;
  color: var(--corruption-muted);
  font-size: 13px;
}
.catalog-heading .schema-badge {
  min-height: 44px;
  padding: 10px 14px;
  border-color: #41676a;
  color: #a1e2df;
  background: #142e34;
  font-size: 14px;
}
.catalog-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  gap: 20px;
  align-items: start;
}
.catalog-main {
  min-width: 0;
}
.catalog-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 10px;
}
.catalog-search,
.catalog-source {
  display: grid;
  gap: 6px;
  min-width: 0;
  color: var(--corruption-muted);
  font-size: 12px;
}
.catalog-search input {
  width: 100%;
  min-height: 46px;
  padding: 11px 13px;
  color: var(--corruption-text);
  background: #111f30;
}
.catalog-search input::placeholder {
  color: #9bb0c9;
}
.catalog-source select {
  min-height: 46px;
  background-color: #111f30;
}
.catalog-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin: 12px 0;
}
.kind-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.kind-filters button {
  min-height: 44px;
  padding: 8px 12px;
  border-color: transparent;
  color: #afc1d8;
  background: transparent;
  font-size: 12px;
}
.kind-filters button[aria-pressed=true] {
  border-color: #3d6770;
  color: #9ee6e3;
  background: #193442;
}
.available-filter {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  color: #b0c2d8;
  font-size: 12px;
  cursor: pointer;
}
.available-filter input[type=checkbox] {
  flex: 0 0 18px;
  width: 18px;
  min-width: 18px;
  max-width: 18px;
  height: 18px;
  min-height: 18px;
  margin: 0;
  padding: 0;
  accent-color: var(--corruption-cyan);
  cursor: pointer;
}
.catalog-results {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 0 0 12px;
  border-bottom: 1px solid var(--corruption-line);
  color: #a2b6d0;
  font-size: 12px;
}
.corruption-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}
.corruption-talent-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 18px;
  border: 1px solid #32465e;
  border-radius: 10px;
  background:
    linear-gradient(
      135deg,
      #142338,
      #101a29);
  overflow-wrap: anywhere;
}
.corruption-talent-card.selected {
  border-color: #5e9a97;
  background:
    linear-gradient(
      135deg,
      #18333d,
      #122534);
}
.corruption-talent-card.dormant {
  border-color: #89729e;
  border-style: dashed;
}
.corruption-talent-head > div {
  display: grid;
  gap: 6px;
  min-width: 0;
}
.corruption-talent-head > div > strong {
  color: #e1ebf6;
  font: 400 21px/1.3 Inter, "Segoe UI", sans-serif;
}
.corruption-talent-head > div > span {
  color: #c3adda;
  font-size: 12px;
}
.corruption-talent-head [data-kind=RITE] {
  color: #97cce5;
}
.corruption-talent-head [data-kind=FAVEUR] {
  color: #ddc39f;
}
.truth-talent-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.truth-talent-meta > span {
  color: #acbdd3;
  font-size: 12px;
  line-height: 1.5;
}
.truth-talent-meta > span + span::before {
  content: "\b7";
  margin-right: 6px;
  color: #7c92ad;
}
.talent-excerpt {
  color: #b3c4d9;
  font-size: 14px;
  line-height: 1.75;
}
.talent-detail {
  color: #b2c3d9;
  font-size: 13px;
}
.talent-detail summary {
  display: flex;
  align-items: center;
  min-height: 44px;
  color: #b6d6e5;
  font-size: 12px;
}
.talent-detail p {
  margin-top: 8px;
  line-height: 1.75;
}
.talent-actions {
  display: grid;
  gap: 9px;
  margin-top: auto;
  padding-top: 8px;
}
.buy-reason {
  color: #d0b6cc;
  font-size: 12px;
  line-height: 1.55;
}
.buy-reason:empty {
  display: none;
}
.corruption-panel .purchase-button {
  width: 100%;
  min-height: 44px;
  border-color: #4b7c86;
  color: #b1eeea;
  background: #173541;
  font-size: 13px;
}
.corruption-panel .purchase-button:disabled {
  border-color: #3c4c64;
  color: #a8bad1;
  background: #1a283c;
  opacity: .8;
}
.corruption-panel .purchase-button.remove {
  border-color: #5d7c86;
  color: #c6d8e5;
  background: transparent;
}
.corruption-owned {
  position: sticky;
  top: 20px;
  min-width: 0;
  border: 1px solid var(--corruption-line);
  border-radius: 11px;
  background: #0f1c2b;
}
.owned-heading {
  padding: 19px 17px;
  border-bottom: 1px solid var(--corruption-line);
}
.owned-heading :is(h3, h4) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #e0e8f3;
  font: 400 21px/1.35 Inter, "Segoe UI", sans-serif;
}
.owned-heading .eyebrow {
  color: #9ac9d6;
}
.owned-heading h4 > span {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border-radius: 5px;
  color: #b5d6e5;
  background: #203a4b;
  font: 12px/1.2 system-ui, sans-serif;
}
.owned-heading h4:focus {
  outline: 2px solid var(--corruption-cyan);
  outline-offset: 4px;
}
.owned-empty {
  display: grid;
  gap: 8px;
  padding: 22px 18px;
  color: var(--corruption-muted);
  font-size: 13px;
  line-height: 1.7;
}
.owned-empty strong {
  color: #ccdae9;
  font-size: 14px;
  font-weight: 500;
}
.corruption-owned-row {
  display: grid;
  gap: 8px;
  padding: 16px 17px;
  border-bottom: 1px solid var(--corruption-line);
}
.owned-copy {
  display: grid;
  min-width: 0;
  gap: 6px;
}
.owned-copy strong {
  color: #e2ebf6;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}
.owned-copy span {
  color: #a6bdd5;
  font-size: 12px;
  line-height: 1.6;
}
.owned-copy small {
  color: #a0dbcf;
  font-size: 12px;
  line-height: 1.6;
}
.owned-copy small.dormant {
  color: #d6b8ed;
}
.corruption-owned-row button {
  justify-self: start;
  min-height: 44px;
  padding: 8px 10px;
  border-color: #486474;
  color: #bdd0df;
  background: transparent;
  font-size: 12px;
}
.owned-note {
  padding: 15px 17px;
  color: #acbfd4;
  font-size: 12px;
  line-height: 1.7;
}
.catalog-empty {
  display: grid;
  justify-items: start;
  gap: 12px;
  margin-top: 14px;
  padding: 26px 22px;
  border: 1px dashed #476077;
  border-radius: 10px;
  color: var(--corruption-muted);
  font-size: 14px;
}
.catalog-empty h4 {
  color: #d9e7f2;
  font: 400 23px/1.3 Inter, "Segoe UI", sans-serif;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@container corruption (max-width: 960px) {
  .catalog-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .corruption-owned {
    position: static;
    order: -1;
  }
  .owned-heading,
  .owned-empty,
  .owned-note {
    padding: 14px 17px;
  }
  .corruption-owned-row {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 14px;
  }
}
@container corruption (max-width: 760px) {
  .corruption-state-grid,
  .rules-content {
    grid-template-columns: minmax(0, 1fr);
  }
  .corruption-precedence {
    grid-column: auto;
  }
  .corruption-gauge,
  .corruption-source-card {
    padding: 19px;
  }
  .gauge-heading {
    gap: 14px;
  }
}
@container corruption (max-width: 560px) {
  .corruption-grid,
  .catalog-toolbar {
    grid-template-columns: minmax(0, 1fr);
  }
  .catalog-heading :is(h3, h4) {
    font-size: 25px;
  }
  .catalog-heading .schema-badge,
  .catalog-heading .ptv-summary {
    width: 100%;
    justify-content: flex-start;
  }
  .corruption-depths {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .corruption-depths span:last-child {
    text-align: left;
  }
  .corruption-owned-row {
    grid-template-columns: minmax(0, 1fr);
  }
  .corruption-talent-card {
    padding: 17px;
  }
  .rules-content {
    padding: 17px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .authorization-switch input + span::after {
    transition: none;
  }
  .corruption-panel button {
    transition: none;
  }
}

</style>
