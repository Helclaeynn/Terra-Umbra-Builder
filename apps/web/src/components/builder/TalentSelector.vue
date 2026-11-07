<script setup lang="ts">
import { computed, ref } from "vue";
import RealityTalentText from "./RealityTalentText.vue";
import {shortRealityTalent} from "../../../../api/src/rules/reality-talents-summaries";
import { sortedNames } from "../../lib/catalog-order";

export type TalentOption={
  id:string;
  compendiumId?:string;
  name:string;
  effect?:string;
  description?:string;
  category?:string;
  attribute?:string;
  skill?:string;
  prerequisite?:string|null;
};

export type TalentGroup={
  label:string;
  items:TalentOption[];
};

export type TalentChoiceOption={
  id:string;
  name:string;
};

export type TalentChoiceSpec={
  kind:"skill"|"text"|"enum";
  label:string;
  skills?:readonly string[];
  skillAttribute?:string;
  styleSkills?:boolean;
  options?:readonly TalentChoiceOption[];
  bonus?:number;
  permanent?:boolean;
  contextual?:boolean;
  placeholder?:string;
  help?:string;
};

const props=defineProps<{
  label:string;
  placeholder:string;
  groups:TalentGroup[];
  modelValue:string;
  selectedLore?:string;
  choiceSpec?:TalentChoiceSpec|null;
  choiceValue?:string;
  choiceOptions?:TalentChoiceOption[];
  categoryPicker?:boolean;
}>();

const emit=defineEmits<{
  "update:modelValue":[value:string];
  "update:choiceValue":[value:string];
}>();

const selected=computed(()=>
  props.groups.flatMap((group)=>group.items).find((talent)=>talent.id===props.modelValue)??null
);
const allGroups=computed(()=>props.groups.filter(group=>group.items.length));
const chosenCategory=ref('');
// Nothing chosen yet: the list starts open, so the required choice is seen.
const startOpen=!props.modelValue;
const available=computed(()=>props.categoryPicker?allGroups.value.filter(group=>group.label===chosenCategory.value):allGroups.value);

function updateChoice(event:Event){
  emit("update:choiceValue",(event.target as HTMLInputElement|HTMLSelectElement).value);
}
</script>

<template>
  <section class="talent-selector">
    <label v-if="categoryPicker">Catégorie de talents<select v-model="chosenCategory"><option value="">— Choisir une catégorie —</option><option v-for="group in allGroups" :key="group.label" :value="group.label">{{ group.label }} · {{ group.items.length }}</option></select></label>
    <p v-if="categoryPicker && modelValue && !available.length" class="catalog-guidance">Talent sélectionné : {{ allGroups.flatMap(group=>group.items).find(item=>item.id===modelValue)?.name || modelValue }}</p>
    <details v-for="group in available" :key="group.label" class="talent-group" :open="categoryPicker||startOpen?true:undefined">
      <summary>{{ group.label || label }} · {{ group.items.length }} talent{{ group.items.length>1?'s':'' }}</summary>
      <div class="talent-card-grid">
        <button v-for="talent in sortedNames(group.items)" :key="talent.id" type="button" class="talent-choice-card" :class="{chosen:talent.id===modelValue}" :aria-pressed="talent.id===modelValue" @click="emit('update:modelValue',talent.id)">
          <img v-if="['common','expertise','origin','sphere'].includes(talent.category||'')" class="talent-art" :src="`/images/talents/${talent.category}/${encodeURIComponent(talent.id)}.webp`" :alt="`Illustration du talent ${talent.name}`" loading="lazy" />
          <strong>{{ talent.name }}</strong>
          <small>{{ shortRealityTalent(talent.id,talent.effect||talent.description||'Consulter la fiche pour les détails.') }}</small>
          <span>{{ talent.id===modelValue?'✓ Sélectionné':'Choisir ce talent' }}</span>
        </button>
      </div>
    </details>
    <p v-if="!available.length && (!categoryPicker || !modelValue)" class="catalog-guidance">{{ categoryPicker?'Choisis une catégorie pour afficher ses talents.':placeholder }}</p>

    <template v-if="selected">
      <div v-if="choiceSpec" class="talent-choice">
        <label>
          {{ choiceSpec.label }}
          <select
            v-if="choiceSpec.kind === 'skill' || choiceSpec.kind === 'enum'"
            :value="choiceValue || ''"
            @change="updateChoice"
          >
            <option value="">— Choisir —</option>
            <option v-for="option in choiceOptions || []" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
          <input
            v-else
            :value="choiceValue || ''"
            :placeholder="choiceSpec.placeholder || ''"
            @input="updateChoice"
          />
        </label>
        <small v-if="choiceSpec.help">{{ choiceSpec.help }}</small>
      </div>

      <div class="talent-detail">
        <strong>{{ selected.name }}</strong>
        <RealityTalentText :talent-id="selected.id" :effect="selected.effect || selected.description" :lore="selectedLore" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.talent-selector{display:grid;gap:14px;margin:0 0 24px;max-width:none;color:var(--c-text);font-family:var(--font-text)}
.talent-card-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.talent-choice-card{box-sizing:border-box;flex:0 1 calc((100% - 16px)/3);min-width:0;display:grid;align-content:start;gap:5px;min-height:76px;padding:12px 14px;text-align:left;border:1px solid var(--c-line-strong);border-radius:8px;background:var(--c-surface);color:var(--c-text);cursor:pointer;font:inherit}.talent-choice-card.chosen{border-color:var(--c-reality);background:var(--c-relief)}.talent-choice-card small{color:var(--c-text-soft);line-height:1.5}.talent-choice-card span{color:var(--c-reality);font-size:12px}.catalog-guidance{color:var(--c-text-soft);margin:0}
.talent-art{display:block;width:100%;height:132px;object-fit:contain;object-position:center;background:var(--c-surface);border-radius:4px;margin-bottom:5px}.talent-choice-card:focus-visible{outline:2px solid var(--c-reality);outline-offset:2px}
.talent-group h3{font-size:14px;color:var(--c-text-soft)}@media(max-width:850px){.talent-choice-card{flex-basis:calc((100% - 8px)/2)}}@media(max-width:550px){.talent-choice-card{flex-basis:100%}}.talent-selector>label,.talent-choice label{display:grid;gap:8px;color:var(--c-text-soft);font-size:14px;line-height:1.5}
.talent-group>summary{min-height:44px;padding:10px;cursor:pointer;color:var(--c-reality-soft);font-weight:600;user-select:none}.talent-group[open]>.talent-card-grid{padding-top:8px}
.talent-select-shell{min-width:0}
.talent-select-shell select,.talent-choice :is(select,input){width:100%;min-width:0;min-height:44px;border-radius:6px;font:inherit}
.talent-selector>label>select,.talent-selector>label>input{width:100%;min-height:44px;padding:10px;border:1px solid var(--c-line-strong);border-radius:6px;background:var(--c-night);color:var(--c-text);font:inherit}
.talent-detail,.talent-choice{display:grid;gap:12px;padding:18px 20px;border:1px solid var(--c-line);border-radius:8px;background:var(--c-surface)}
.talent-detail strong{color:var(--c-text);font-size:16px;line-height:1.4}
.talent-detail em{color:var(--c-text-soft);font-size:14px;line-height:1.65}
.talent-detail p{margin:0;color:var(--c-text-soft);font-size:14px;line-height:1.65}
.talent-detail b{color:var(--c-text)}
.talent-choice{border-color:var(--c-line-strong);background:var(--c-relief)}
.talent-choice small{color:var(--c-text-soft);font-size:13px;line-height:1.6}
@media(max-width:620px){.talent-detail,.talent-choice{padding:16px}}
</style>
