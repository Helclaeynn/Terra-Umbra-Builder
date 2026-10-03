<script setup lang="ts">
import {computed,onMounted,ref} from 'vue';
import {api} from '../lib/api';
import {buildCharacterSheet,type SheetCore} from '../lib/character-sheet-model';
import {ensureTruthRulesPackage,type TruthRulesPackage} from '../lib/truth';
import type {RealityRulesPackage} from '../lib/reality';
import {playProfile} from '../../../api/src/rules/play-state';
import CharacterSummary from './builder/CharacterSummary.vue';
const props=defineProps<{saved:any}>();
const core=ref<SheetCore|null>(null),truth=ref<TruthRulesPackage|null>(null),reality=ref<RealityRulesPackage|null>(null),error=ref('');
const sheet=computed(()=>core.value&&truth.value&&reality.value?{...buildCharacterSheet(props.saved.data,core.value,truth.value,reality.value,true,props.saved.name),edge:props.saved.edge}:null);
const profile=computed(()=>props.saved.profile??playProfile(props.saved.data,props.saved.state));
onMounted(async()=>{try{const [c,t,r]=await Promise.all([api<SheetCore>('/api/rulesets/terra-umbra/creation'),api<TruthRulesPackage>('/api/rulesets/terra-umbra/truth'),api<RealityRulesPackage>('/api/rulesets/terra-umbra/reality')]);core.value=c;truth.value=ensureTruthRulesPackage(t);reality.value=r;}catch{error.value='Impossible de charger la présentation de cette version.';}});
</script>
<template><section><p v-if="error" role="alert">{{error}}</p><p>{{profile.hp}} / {{profile.derived.pvMax}} PV · {{profile.health}} · {{saved.edge}} Edge · {{saved.state.pa}} PA</p><p>Révélation : {{({v:'Voilé',sr:'Semi-révélé',r:'Révélé'} as Record<string,string>)[saved.state.revelation]}} · stress : {{['Neutre','Tendu','Paniqué'][profile.stress]}}</p><details><summary>Compétences en jeu au moment de la sauvegarde</summary><p v-for="skill in profile.skills" :key="skill.id">{{skill.name}} : {{skill.attributeValue}} + {{skill.rank}} + {{skill.bonus}} = <strong>{{skill.total}}</strong></p></details><CharacterSummary v-if="sheet" :sheet="sheet" /><p v-else-if="!error">Chargement de la fiche sauvegardée…</p></section></template>
