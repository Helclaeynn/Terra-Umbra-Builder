<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { cloneJson } from "../../lib/json";
import BuilderWikiLink from "./BuilderWikiLink.vue";
import {
  truthCorruptionDepth,
  truthCorruptionPrerequisiteSatisfied,
  truthCorruptionTalentActive,
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
}>();

const catalogSource=ref("");

watch(
  ()=>props.modelValue.corruptionSource,
  value=>{
    if(value)catalogSource.value=value;
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

const visibleTalents=computed(()=>{
  const source=catalogSource.value||props.modelValue.corruptionSource;
  return props.rules.corruption.talents.filter(talent=>talent.sourceId===source);
});

const groups=computed(()=>{
  const map=new Map<string,CorruptionTalent[]>();
  for(const talent of visibleTalents.value){
    if(!map.has(talent.family))map.set(talent.family,[]);
    map.get(talent.family)!.push(talent);
  }
  return [...map.entries()].map(([name,items])=>({name,items}));
});

function update(mutator:(state:TruthState)=>void){
  const next=cloneJson(props.modelValue);
  next.corruptionMjAuthorized=Boolean(next.corruptionMjAuthorized);
  next.corruption=Math.max(0,Math.min(Math.max(1,props.integrity),Math.trunc(Number(next.corruption)||0)));
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
  if(!value&&(props.modelValue.corruption>0||(props.modelValue.corruptionTalents??[]).length>0))return;
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
    next.corruption=Math.max(0,Math.min(props.integrity,next.corruption+delta));
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
}

function toggle(talent:CorruptionTalent){
  if(!props.modelValue.corruptionMjAuthorized)return;
  if(selected(talent)){
    removeCascade(talent.id);
    return;
  }
  if(!canBuy(talent))return;
  update(next=>{next.corruptionTalents=[...next.corruptionTalents,talent.id];});
}

function souillureDifficulty(talent:CorruptionTalent){
  if(talent.kind==="DON")return "";
  if(talent.cost===1)return "Souillure 15";
  if(talent.cost===2)return "Souillure 18";
  if(talent.cost===3)return "Souillure 21";
  return "";
}

function talentState(talent:CorruptionTalent){
  if(!selected(talent))return buyBlockReason(talent);
  if(talent.kind==="DON"&&!active(talent))return "Dormant";
  if(talent.kind==="FAVEUR")return "Active si le lien extérieur subsiste";
  return "Actif";
}
</script>

<template>
  <section class="corruption-panel">
    <div class="subsection-title">
      <div>
        <h3>Corruption & Fléaux</h3>
        <p>
          Une seule Source domine la jauge. Les Dons achetés d’une ancienne Source restent sur la
          fiche mais deviennent dormants ; leurs PTV ne sont jamais remboursés.
        </p>
      </div>
      <span class="schema-badge">
        {{ modelValue.corruptionMjAuthorized ? `${modelValue.corruption}/${integrity} · ${depth}` : "MJ requis" }}
      </span>
    </div>

    <div v-if="!modelValue.corruptionMjAuthorized" class="corruption-gate">
      <div class="rule-note">
        <strong>Personnage sain par défaut.</strong>
        La Corruption n’est pas un choix de création ordinaire. Ce bloc ne s’ouvre que sur accord explicite du MJ ;
        en campagne, la Corruption est normalement gérée depuis l’évolution du personnage.
      </div>
      <label class="corruption-authorization">
        <input
          type="checkbox"
          :checked="false"
          @change="setAuthorized(($event.target as HTMLInputElement).checked)"
        />
        <span>
          <strong>Autorisation MJ : ouvrir Corruption & Fléaux</strong>
          <small>À utiliser uniquement si le MJ autorise un personnage déjà corrompu à la création.</small>
        </span>
      </label>
    </div>

    <template v-else>
    <div class="corruption-state-grid">
      <label>
        <span>Source dominante</span>
        <select :value="modelValue.corruptionSource" @change="setSource(($event.target as HTMLSelectElement).value)">
          <option value="">Aucune — Sain</option>
          <option v-for="source in rules.corruption.sources" :key="source.id" :value="source.id">
            {{ source.name }} — {{ source.corruption }}
          </option>
        </select>
      </label>

      <div class="corruption-gauge">
        <span>Corruption</span>
        <div class="stepper">
          <button type="button" :disabled="modelValue.corruption<=0" @click="changeCorruption(-1)">−</button>
          <strong>{{ modelValue.corruption }} / {{ integrity }}</strong>
          <button
            type="button"
            :disabled="!modelValue.corruptionSource || modelValue.corruption>=integrity"
            @click="changeCorruption(1)"
          >+</button>
        </div>
      </div>
    </div>

    <article v-if="currentSource" class="corruption-source-card">
      <div>
        <p class="eyebrow">SOURCE DOMINANTE</p>
        <h4>
          <BuilderWikiLink
            :label="sourceLabel(currentSource.id)"
            :article-id="currentSource.compendiumId"
            category="Règles"
          />
        </h4>
        <p><strong>Principe :</strong> {{ currentSource.principle }}</p>
      </div>
      <div class="corruption-depths">
        <span :class="{ current: depth==='Marqué' }">Marqué · 1+</span>
        <span :class="{ current: depth==='Envahi' }">Envahi · ≥ moitié d’Intégrité</span>
        <span :class="{ current: depth==='Au bord de la Rupture' }">Au bord · ≥ Intégrité − 1</span>
        <span :class="{ current: depth==='Seuil atteint' }">Seuil · Bascule DD 18</span>
      </div>
    </article>

    <div v-if="modelValue.corruption>=integrity" class="rule-note bad">
      <strong>Seuil de Bascule atteint :</strong>
      Volonté + Maîtrise spirituelle + 1d10e contre 18. Une réussite maintient la Corruption
      au maximum ; un échec produit normalement une Rupture et fait sortir le personnage du cadre PJ standard.
    </div>

    <div class="rule-note">
      <strong>Souillure :</strong>
      une exposition physique utilise Vigueur + Constitution ; une exposition mentale,
      spirituelle ou essentielle utilise Volonté + Force Mentale. Un Rite ou une Faveur provoque
      son Test de Souillure à chaque activation surnaturelle selon son coût.
    </div>

    <div v-if="selectedTalents.length" class="corruption-owned">
      <h4>Capacités de Fléau acquises</h4>
      <article v-for="talent in selectedTalents" :key="talent.id" class="corruption-owned-row">
        <div>
          <strong>{{ talent.name }}</strong>
          <span>{{ sourceLabel(talent.sourceId) }} · {{ talent.family }} · {{ talent.kind }} · {{ talent.cost }} PTV</span>
          <small :class="{ dormant: talentState(talent)==='Dormant' }">{{ talentState(talent) }}</small>
        </div>
        <button class="ghost danger compact" type="button" @click="removeCascade(talent.id)">Retirer</button>
      </article>
    </div>

    <details class="corruption-catalog">
      <summary class="truth-disclosure-summary">
        <span>
          <strong>Catalogue des six Fléaux</strong>
          <small>227 Dons, Rites & Faveurs · 493 PTV de catalogue complet</small>
        </span>
        <span class="schema-badge">{{ visibleTalents.length }}</span>
      </summary>

      <div class="corruption-source-tabs">
        <button
          v-for="source in rules.corruption.sources"
          :key="source.id"
          type="button"
          class="secondary compact"
          :class="{ selected: catalogSource===source.id }"
          @click="catalogSource=source.id"
        >
          {{ source.name }}
        </button>
      </div>

      <p class="rule-note">
        Les <strong>Dons</strong> exigent la Source dominante et la profondeur indiquée.
        Les <strong>Rites</strong> restent connus après purification et leur usage est corrupteur.
        Les <strong>Faveurs</strong> dépendent d’un Patron, d’une marque ou d’un lien extérieur :
        le Builder les considère actives tant que ce lien n’a pas été déclaré rompu en fiction.
      </p>

      <details v-for="group in groups" :key="group.name" class="corruption-group">
        <summary>
          <span><strong>{{ group.name }}</strong><small>{{ group.items.length }} capacité(s)</small></span>
          <span class="schema-badge">{{ group.items.reduce((sum,item)=>sum+item.cost,0) }} PTV</span>
        </summary>

        <div class="corruption-grid">
          <article
            v-for="talent in group.items"
            :key="talent.id"
            class="corruption-talent-card"
            :class="{ selected: selected(talent), dormant: selected(talent)&&talent.kind==='DON'&&!active(talent) }"
          >
            <div class="corruption-talent-head">
              <div>
                <strong>{{ talent.name }}</strong>
                <span>{{ talent.kind }} · {{ talent.cost }} PTV</span>
              </div>
              <button
                type="button"
                class="secondary compact"
                :disabled="!selected(talent)&&!canBuy(talent)"
                @click="toggle(talent)"
              >
                {{ selected(talent) ? "Retirer" : canBuy(talent) ? "Acheter" : buyBlockReason(talent) }}
              </button>
            </div>

            <div class="truth-talent-meta">
              <span v-if="talent.depth">{{ talent.depth }}</span>
              <span v-if="souillureDifficulty(talent)">{{ souillureDifficulty(talent) }}</span>
              <span v-if="talent.prerequisiteName">Prérequis : {{ talent.prerequisiteName }}</span>
            </div>

            <p>{{ talent.effect }}</p>

            <div class="corruption-card-footer">
              <small v-if="selected(talent)">{{ talentState(talent) }}</small>
              <BuilderWikiLink
                :label="talent.name"
                :article-id="talent.compendiumId"
                category="Règles"
                compact
              >
                <span>Règles du Fléau</span>
              </BuilderWikiLink>
            </div>
          </article>
        </div>
      </details>
    </details>

    <div class="corruption-precedence">
      <strong>Préséance en cas d’égalité :</strong>
      {{ rules.corruption.precedence.map(sourceLabel).join(" → ") }}
    </div>

    <label class="corruption-authorization active">
      <input
        type="checkbox"
        :checked="true"
        :disabled="modelValue.corruption>0 || modelValue.corruptionTalents.length>0"
        @change="setAuthorized(($event.target as HTMLInputElement).checked)"
      />
      <span>
        <strong>Autorisation MJ active</strong>
        <small v-if="modelValue.corruption>0 || modelValue.corruptionTalents.length>0">
          Retirez d’abord toute Corruption et toute capacité de Fléau pour refermer ce bloc.
        </small>
        <small v-else>Peut être retirée tant qu’aucune Corruption ni capacité n’a été enregistrée.</small>
      </span>
    </label>
    </template>
  </section>
</template>

<style scoped>
.corruption-panel{margin-top:24px;border-top:1px solid var(--line);padding-top:22px}
.corruption-gate{display:grid;gap:12px;margin:14px 0}
.corruption-authorization{display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid var(--line);border-radius:12px}
.corruption-authorization span{display:grid;gap:3px}
.corruption-authorization small{color:var(--muted)}
.corruption-authorization.active{margin-top:14px}
.corruption-state-grid{display:grid;grid-template-columns:minmax(220px,1fr) minmax(220px,1fr);gap:14px;margin:14px 0}
.corruption-state-grid label{display:grid;gap:6px}
.corruption-gauge{display:grid;gap:6px}
.corruption-source-card{display:flex;justify-content:space-between;gap:20px;border:1px solid var(--line);border-radius:14px;padding:14px;margin:12px 0}
.corruption-source-card h4,.corruption-source-card p{margin:0}
.corruption-depths{display:grid;gap:5px;min-width:220px}
.corruption-depths span{font-size:12px;color:var(--muted)}
.corruption-depths span.current{font-weight:800;color:inherit}
.corruption-owned{display:grid;gap:8px;margin:16px 0}
.corruption-owned h4{margin:0}
.corruption-owned-row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:10px 12px;border:1px solid var(--line);border-radius:12px}
.corruption-owned-row>div{display:grid;gap:3px}
.corruption-owned-row span,.corruption-owned-row small{font-size:12px;color:var(--muted)}
.corruption-owned-row small.dormant{font-weight:800}
.corruption-catalog{margin-top:16px}
.corruption-source-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.corruption-source-tabs .selected{font-weight:800}
.corruption-group{border:1px solid var(--line);border-radius:12px;padding:0 12px;margin-top:10px}
.corruption-group>summary{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px 0;cursor:pointer}
.corruption-group>summary span:first-child{display:grid;gap:2px}
.corruption-group>summary small{color:var(--muted)}
.corruption-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:10px;padding-bottom:12px}
.corruption-talent-card{display:grid;gap:9px;border:1px solid var(--line);border-radius:12px;padding:12px}
.corruption-talent-card.selected{box-shadow:inset 0 0 0 1px currentColor}
.corruption-talent-card.dormant{opacity:.72}
.corruption-talent-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.corruption-talent-head>div{display:grid;gap:2px}
.corruption-talent-head span{font-size:12px;color:var(--muted)}
.corruption-talent-card p{margin:0;font-size:13px;line-height:1.45}
.corruption-card-footer{display:flex;justify-content:space-between;align-items:center;gap:10px}
.corruption-card-footer small{color:var(--muted)}
.corruption-precedence{margin-top:12px;font-size:12px;color:var(--muted)}
@media(max-width:720px){
  .corruption-state-grid{grid-template-columns:1fr}
  .corruption-source-card,.corruption-owned-row,.corruption-talent-head,.corruption-card-footer{flex-direction:column;align-items:stretch}
}
</style>
