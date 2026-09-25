<script setup lang="ts">
import { computed } from "vue";
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
}>();

const emit=defineEmits<{
  "update:modelValue":[value:string];
  "update:choiceValue":[value:string];
}>();

const selected=computed(()=>
  props.groups.flatMap((group)=>group.items).find((talent)=>talent.id===props.modelValue)??null
);
const available=computed(()=>props.groups.filter(group=>group.items.length));

function updateChoice(event:Event){
  emit("update:choiceValue",(event.target as HTMLInputElement|HTMLSelectElement).value);
}
</script>

<template>
  <section class="talent-selector">
    <div v-for="group in available" :key="group.label" class="talent-group"><h3 v-if="available.length > 1">{{ group.label }}</h3><div class="talent-card-grid"><button v-for="talent in sortedNames(group.items)" :key="talent.id" type="button" class="talent-choice-card" :class="{chosen:talent.id===modelValue}" :aria-pressed="talent.id===modelValue" @click="emit('update:modelValue',talent.id)"><img v-if="talent.category==='common'||talent.category==='expertise'||talent.category==='origin'" class="talent-art" :src="`/images/talents/${talent.category}/${encodeURIComponent(talent.id)}.webp`" :alt="`Illustration du talent ${talent.name}`" loading="lazy" /><strong>{{ talent.name }}</strong><small>{{ talent.effect||talent.description||'Consulter la fiche pour les détails.' }}</small><span>{{ talent.id===modelValue?'✓ Sélectionné':'Choisir ce talent' }}</span></button></div></div>
    <p v-if="!available.length" class="catalog-guidance">{{ placeholder }}</p>

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
        <em v-if="selectedLore">{{ selectedLore }}</em>
        <p><b>Effet mécanique :</b> {{ selected.effect || selected.description || "—" }}</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.talent-selector{display:grid;gap:14px;margin:0 0 24px;max-width:none;color:#edf4ff;font-family:Inter,"Segoe UI",sans-serif}
.talent-card-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.talent-choice-card{box-sizing:border-box;flex:0 1 calc((100% - 16px)/3);min-width:0;display:grid;align-content:start;gap:5px;min-height:76px;padding:12px 14px;text-align:left;border:1px solid #36536b;border-radius:8px;background:#101e30;color:#edf4ff;cursor:pointer;font:inherit}.talent-choice-card.chosen{border-color:#77e3da;background:#16343e}.talent-choice-card small{color:#b3c5d9;line-height:1.5}.talent-choice-card span{color:#77e3da;font-size:12px}.catalog-guidance{color:#b3c5d9;margin:0}
.talent-art{display:block;width:100%;height:132px;object-fit:contain;object-position:center;background:#0b1726;border-radius:4px;margin-bottom:5px}.talent-choice-card:focus-visible{outline:2px solid #77e3da;outline-offset:2px}
.talent-group h3{font-size:14px;color:#b9d7e4}@media(max-width:850px){.talent-choice-card{flex-basis:calc((100% - 8px)/2)}}@media(max-width:550px){.talent-choice-card{flex-basis:100%}}.talent-selector>label,.talent-choice label{display:grid;gap:8px;color:#c3d2e4;font-size:14px;line-height:1.5}
.talent-select-shell{min-width:0}
.talent-select-shell select,.talent-choice :is(select,input){width:100%;min-width:0;min-height:44px;border-radius:6px;font:inherit}
.talent-selector>label>select,.talent-selector>label>input{width:100%;min-height:44px;padding:10px;border:1px solid #36536b;border-radius:6px;background:#08131f;color:#edf4ff;font:inherit}
.talent-detail,.talent-choice{display:grid;gap:12px;padding:18px 20px;border:1px solid #2b3b51;border-radius:8px;background:#0e1b2d}
.talent-detail strong{color:#edf4ff;font-size:16px;line-height:1.4}
.talent-detail em{color:#b3c5d9;font-size:14px;line-height:1.65}
.talent-detail p{margin:0;color:#c3d2e4;font-size:14px;line-height:1.65}
.talent-detail b{color:#edf4ff}
.talent-choice{border-color:#36596b;background:#102738}
.talent-choice small{color:#b3c5d9;font-size:13px;line-height:1.6}
@media(max-width:620px){.talent-detail,.talent-choice{padding:16px}}
</style>
