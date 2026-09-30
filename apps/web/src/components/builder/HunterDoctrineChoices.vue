<script setup lang="ts">
import {computed} from 'vue';
import {hunterDoctrines,normalizeHunterBuild,selectedHunterDoctrines} from '../../lib/hunter';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage}>();
const emit=defineEmits<{change:[patch:Record<string,unknown>]}>();
const selected=computed(()=>selectedHunterDoctrines({...props.state,mode:'progression'}));
const options=computed(()=>hunterDoctrines.filter(d=>d.id!=='lavandiere'||props.state.nature==='vampire'));
function toggle(id:string,checked:boolean){
 const build=normalizeHunterBuild(props.state.choices.hunterBuild);
 build.doctrines=checked?[...new Set([...selected.value,id])]:selected.value.filter(v=>v!==id);
 emit('change',{hunterBuild:build,hunterTradition:props.state.nature==='humain'?props.state.choices.hunterTradition:'aucune'});
}
function description(id:string){
 for(const nature of Object.values(props.rules.structure.natures)){
  const c=nature.choices.find(c=>c.key==='hunterTradition');
  const option=[...(c?.options??[]),...Object.values(c?.optionsBy??{}).flat()].find(o=>o.id===id);
  if(option?.description)return option.description;
 }
 return 'Ouvre les talents de cette doctrine et le socle commun de Chasse. Chaque talent reste à acquérir avec des PTV.';
}
</script>
<template>
 <details class="doctrine-panel" data-hunter-doctrines>
  <summary><strong>Apprendre des doctrines de Chasse</strong><span>{{selected.length}} choisie(s)</span></summary>
  <p>Choisissez les doctrines apprises pendant vos aventures pour ouvrir leurs catalogues. Chaque talent coûte ses PTV et conserve ses prérequis. Votre Nature et vos bonus révélés restent ceux de votre personnage.</p>
  <label v-for="doctrine in options" :key="doctrine.id"><input type="checkbox" :value="doctrine.id" :checked="selected.includes(doctrine.id)" :disabled="state.nature==='humain'&&state.choices.hunterTradition===doctrine.id" @change="toggle(doctrine.id,($event.target as HTMLInputElement).checked)" /><span><strong>{{doctrine.name}}</strong><small>{{description(doctrine.id)}}</small></span></label>
  <p>Retirer une doctrine conserve les talents payés et les signale comme indisponibles. Les Lavandières exigent une Nature vampirique.</p>
 </details>
</template>
<style scoped>
.doctrine-panel{padding:1rem;border:1px solid var(--border,#36536b);border-radius:.5rem;margin:1rem 0;min-width:0}.doctrine-panel summary{display:flex;gap:1rem;justify-content:space-between;cursor:pointer}.doctrine-panel label{display:flex;gap:.75rem;padding:.65rem 0;align-items:start}.doctrine-panel small{display:block;line-height:1.5}.doctrine-panel input{width:20px;height:20px;flex-shrink:0}.doctrine-panel :focus-visible{outline:2px solid var(--accent,#a6e9ff)}
</style>
