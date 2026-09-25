<script setup lang="ts">
import { computed,ref,watch } from "vue";
import { sortedNames } from "../../lib/catalog-order";
import BuilderCatalogImage from './BuilderCatalogImage.vue';

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
const selectedGroup=ref(''),query=ref('');
const available=computed(()=>props.groups.filter(group=>group.items.length));
watch(available,groups=>{if(selectedGroup.value&&!groups.some(group=>group.label===selectedGroup.value))selectedGroup.value='';});
const visible=computed(()=>{const group=available.value.find(row=>row.label===selectedGroup.value);const q=query.value.trim().toLocaleLowerCase('fr');return sortedNames(group?.items||[]).filter(row=>!q||`${row.name} ${row.effect||row.description||''}`.toLocaleLowerCase('fr').includes(q));});

function updateChoice(event:Event){
  emit("update:choiceValue",(event.target as HTMLInputElement|HTMLSelectElement).value);
}
</script>

<template>
  <section class="talent-selector">
    <label>{{ label }} · catégorie<select v-model="selectedGroup"><option value="">— Choisir une catégorie —</option><option v-for="group in available" :key="group.label" :value="group.label">{{ group.label }} · {{ group.items.length }}</option></select></label>
    <label v-if="selectedGroup">Chercher dans cette catégorie<input v-model="query" type="search" placeholder="Nom ou effet…" /></label>
    <p v-if="!selectedGroup" class="catalog-guidance">{{ placeholder }} : choisis d’abord une catégorie pour comparer les cartes.</p>
    <div v-else class="talent-card-grid"><button v-for="talent in visible" :key="talent.id" type="button" class="talent-choice-card" :class="{chosen:talent.id===modelValue}" :aria-pressed="talent.id===modelValue" @click="emit('update:modelValue',talent.id)"><BuilderCatalogImage :article-id="talent.compendiumId" :name="talent.name" category="Règles" /><strong>{{ talent.name }}</strong><small>{{ talent.effect||talent.description||'Consulter la fiche pour les détails.' }}</small><span>{{ talent.id===modelValue?'✓ Sélectionné':'Choisir ce talent' }}</span></button><p v-if="!visible.length">Aucun Talent dans cette catégorie pour cette recherche.</p></div>

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
.talent-selector{display:grid;gap:14px;margin:0 0 24px;max-width:900px;color:#edf4ff;font-family:Inter,"Segoe UI",sans-serif}
.talent-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:12px}.talent-choice-card{display:grid;align-content:start;gap:8px;padding:10px;text-align:left;border:1px solid #36536b;border-radius:8px;background:#101e30;color:#edf4ff;cursor:pointer;font:inherit}.talent-choice-card.chosen{border-color:#77e3da;background:#16343e}.talent-choice-card small{color:#b3c5d9;line-height:1.5}.talent-choice-card span{color:#77e3da}.catalog-guidance{color:#b3c5d9;margin:0}
.talent-selector>label,.talent-choice label{display:grid;gap:8px;color:#c3d2e4;font-size:14px;line-height:1.5}
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
