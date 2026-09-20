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
            :title="talent.effect || talent.description || ''"
          >
            {{ talent.name }}
          </option>
        </optgroup>
      </select>
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
.talent-selector{display:grid;gap:.65rem;margin:0 0 1rem;max-width:800px}.talent-selector>label,.talent-choice label{display:grid;gap:.42rem;color:#c4d5da;font-size:.88rem}.talent-detail,.talent-choice{display:grid;gap:.5rem;padding:.85rem 1rem;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.018)}.talent-detail strong{color:#dce8ec}.talent-detail em{color:#91a7b1;font-size:.82rem;line-height:1.55}.talent-detail p{margin:0;color:#afc1c8;font-size:.82rem;line-height:1.55}.talent-detail b{color:#d7e3e7}.talent-choice{border-color:rgba(88,220,197,.2)}.talent-choice small{color:#718a95;line-height:1.45}
</style>
