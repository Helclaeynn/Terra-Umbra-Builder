<script setup lang="ts">
import {computed} from 'vue';
import {aserynChoiceFields} from '../../lib/aseryn';
import type {TruthState} from '../../lib/truth';
const props=defineProps<{state:TruthState}>();
const emit=defineEmits<{change:[key:string,value:string]}>();
const fields=computed(()=>aserynChoiceFields(props.state));
</script>
<template><section v-if="fields.length" class="aseryn-choices" aria-label="Héritages aseryns"><h3>Héritages aseryns</h3><p>Ces choix précisent vos Traces, Signatures et Résonance ; ils n’accordent aucun talent ni bonus d’Attribut supplémentaire.</p><div><label v-for="field in fields" :key="field.key">{{field.label}}<select :data-aseryn-choice="field.key" :value="state.choices[field.key]??''" @change="emit('change',field.key,($event.target as HTMLSelectElement).value)"><option value="">— Choisir —</option><option v-for="option in field.options" :key="option.id" :value="option.id">{{option.name}}</option></select></label></div></section></template>
<style scoped>.aseryn-choices{border:1px solid #30485d;padding:16px;border-radius:8px;margin-block:16px;min-width:0}.aseryn-choices>div{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px}label{display:grid;gap:6px}select{min-width:0;min-height:44px;width:100%;background:#071320;color:inherit;border:1px solid #375366;border-radius:6px;padding:8px}p{line-height:1.5}select:focus-visible{outline:2px solid #b7efff;outline-offset:2px}</style>
