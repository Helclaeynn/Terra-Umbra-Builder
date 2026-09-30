<script setup lang="ts">
import {computed} from 'vue';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
import {normalizeMageTechniques,mageTechniqueNames,type MageTechniqueKind,type MageTechniques} from '../../lib/mage';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage;onlyKind?:MageTechniqueKind}>();
defineEmits<{change:[value:MageTechniques]}>();
const saved=computed(()=>props.onlyKind?normalizeMageTechniques(props.state.choices.mageTechniques)[props.onlyKind]:undefined);
</script>
<template><article v-if="state.nature==='mage'&&onlyKind&&saved" class="established-technique"><h4>{{mageTechniqueNames[onlyKind]}}</h4><strong>{{saved.name}}</strong><p>{{saved.effect}}</p><p>{{saved.pa}} PA · {{saved.range}} · Tension {{saved.tension}}</p><p>{{saved.source}}</p><p v-if="saved.exception">{{saved.exception}}</p></article></template>
<style scoped>.established-technique{min-width:0;overflow-wrap:anywhere;line-height:1.55}</style>
