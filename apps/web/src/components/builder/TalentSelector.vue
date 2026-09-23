<script setup lang="ts">
import { computed } from "vue";
import BuilderWikiLink from "./BuilderWikiLink.vue";

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

function updateTalent(event:Event){
  emit("update:modelValue",(event.target as HTMLSelectElement).value);
}

function updateChoice(event:Event){
  emit("update:choiceValue",(event.target as HTMLInputElement|HTMLSelectElement).value);
}
</script>

<template>
  <section class="talent-selector">
    <label>
      {{ label }}
      <div class="talent-select-shell">
        <select :value="modelValue" @change="updateTalent">
          <option value="">{{ placeholder }}</option>
          <optgroup
            v-for="group in groups.filter((item)=>item.items.length)"
            :key="group.label"
            :label="group.label.toUpperCase()"
          >
            <option
              v-for="talent in group.items"
              :key="talent.id"
              :value="talent.id"
            >
              {{ talent.name }}
            </option>
          </optgroup>
        </select>
      </div>
    </label>

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
        <strong>
          <BuilderWikiLink
            :label="selected.name"
            :article-id="selected.compendiumId"
            category="Règles"
            :detail="selected.effect || selected.description || ''"
            :badges="[label]"
          />
        </strong>
        <em v-if="selectedLore">{{ selectedLore }}</em>
        <p><b>Effet mécanique :</b> {{ selected.effect || selected.description || "—" }}</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.talent-selector{display:grid;gap:14px;margin:0 0 24px;max-width:900px;color:#edf4ff;font-family:Inter,"Segoe UI",sans-serif}
.talent-selector>label,.talent-choice label{display:grid;gap:8px;color:#c3d2e4;font-size:14px;line-height:1.5}
.talent-select-shell{min-width:0}
.talent-select-shell select,.talent-choice :is(select,input){width:100%;min-width:0;min-height:44px;border-radius:6px;font:inherit}
.talent-detail,.talent-choice{display:grid;gap:12px;padding:18px 20px;border:1px solid #2b3b51;border-radius:8px;background:#0e1b2d}
.talent-detail strong{color:#edf4ff;font-size:16px;line-height:1.4}
.talent-detail em{color:#b3c5d9;font-size:14px;line-height:1.65}
.talent-detail p{margin:0;color:#c3d2e4;font-size:14px;line-height:1.65}
.talent-detail b{color:#edf4ff}
.talent-choice{border-color:#36596b;background:#102738}
.talent-choice small{color:#b3c5d9;font-size:13px;line-height:1.6}
@media(max-width:620px){.talent-detail,.talent-choice{padding:16px}}
</style>
