<script setup lang="ts">
import {computed,onMounted,onUnmounted,shallowRef,ref,watch} from 'vue';
import {api} from '../lib/api';
import type {Character} from '../types/character';
import {buildCharacterSheet,type SheetCore} from '../lib/character-sheet-model';
import {ensureTruthRulesPackage,type TruthRulesPackage} from '../lib/truth';
import type {RealityRulesPackage} from '../lib/reality';
import CharacterPlay from './CharacterPlay.vue';
import CharacterSummary from './builder/CharacterSummary.vue';
const emit=defineEmits<{changed:[]}>();
const props=defineProps<{characterId:string;campaignId:string;sheetVersion?:number;combatMode?:boolean}>();
const character=shallowRef<Character|null>(null),core=shallowRef<SheetCore|null>(null),truth=shallowRef<TruthRulesPackage|null>(null),reality=shallowRef<RealityRulesPackage|null>(null),canEdit=ref(false),error=ref('');
let alive=true;const controller=new AbortController();
const sheet=computed(()=>character.value&&core.value&&truth.value&&reality.value?buildCharacterSheet(character.value.data,core.value,truth.value,reality.value,true,character.value.name):null);
onMounted(async()=>{try{const options={signal:controller.signal};const [r,c,t,e]=await Promise.all([api<{character:Character;canEdit:boolean}>(`/api/characters/${props.characterId}/sheet`,options),api<SheetCore>('/api/rulesets/terra-umbra/creation',options),api<TruthRulesPackage>('/api/rulesets/terra-umbra/truth',options),api<RealityRulesPackage>('/api/rulesets/terra-umbra/reality',options)]);if(!alive)return;character.value=r.character;canEdit.value=r.canEdit;core.value=c;truth.value=ensureTruthRulesPackage(t);reality.value=e;}catch{if(alive)error.value='Cette fiche est indisponible ou ton accès a été retiré.';}});
watch(()=>props.sheetVersion,async()=>{if(!character.value)return;try{const r=await api<{character:Character;canEdit:boolean}>(`/api/characters/${props.characterId}/sheet`,{signal:controller.signal});if(alive){character.value=r.character;canEdit.value=r.canEdit;}}catch{if(alive)error.value='Impossible d’actualiser la fiche après sa modification.';}});
onUnmounted(()=>{alive=false;controller.abort();});
</script>
<template><section class="character-at-table"><p v-if="error" role="alert">{{ error }}</p><template v-else-if="sheet&&character"><a :href="`/characters/${characterId}/play?campaign=${campaignId}`" target="_blank" rel="noopener">Ouvrir la fiche dans un nouvel onglet ↗</a><CharacterPlay :id="characterId" :data="character.data" :sheet="sheet" :can-edit="canEdit" :combat-mode="combatMode" @changed="emit('changed')" /><details><summary>Afficher la fiche complète de {{ character.name }}</summary><CharacterSummary :sheet="sheet" /></details></template><p v-else role="status">Chargement de la fiche en jeu…</p></section></template>
<style scoped>.character-at-table{min-width:0}.character-at-table>a{display:inline-block;padding:12px;color:#b7efff}.character-at-table summary{padding:16px;cursor:pointer}</style>
