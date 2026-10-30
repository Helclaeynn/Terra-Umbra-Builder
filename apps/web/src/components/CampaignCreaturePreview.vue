<script setup lang="ts">
import {onMounted,onUnmounted,ref} from 'vue';
import {api} from '../lib/api';
import type {BestiaryCatalog,BestiaryRecord} from '../../../api/src/campaign-bestiary-model';
import CampaignCreatureSheet from './CampaignCreatureSheet.vue';
const props=defineProps<{campaignId:string;creatureId:string}>();
const record=ref<BestiaryRecord|null>(null),catalog=ref<BestiaryCatalog|null>(null),error=ref('');let live=true;
async function load(){error.value='';try{const [r,c]=await Promise.all([api<{creature:BestiaryRecord}>(`/api/campaigns/${props.campaignId}/bestiary/${props.creatureId}`),api<BestiaryCatalog>(`/api/campaigns/${props.campaignId}/bestiary/catalog`)]);if(live){record.value=r.creature;catalog.value=c;}}catch{if(live)error.value='Cette créature est introuvable ou inaccessible dans la campagne.';}}
onMounted(load);onUnmounted(()=>{live=false;});
</script>
<template><div class="creature-preview"><p v-if="error" role="alert">{{ error }} <button type="button" @click="load">Réessayer</button></p><CampaignCreatureSheet v-else-if="record&&catalog" :data="record.data" :catalog="catalog" /><p v-else role="status">Chargement de la créature…</p></div></template>
<style scoped>.creature-preview{padding:14px;border:1px solid #405875;border-radius:6px;background:#0b1725;margin:10px 0;min-width:0}</style>
