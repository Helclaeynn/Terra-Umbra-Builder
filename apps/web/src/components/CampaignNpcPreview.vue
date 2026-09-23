<script setup lang="ts">
import {onMounted,onUnmounted,ref} from 'vue';
import {api} from '../lib/api';
import type {NpcCatalog,NpcRecord} from '../../../api/src/campaign-npc-model';
import CampaignNpcSheet from './CampaignNpcSheet.vue';
const props=defineProps<{campaignId:string;npcId:string}>();
const npc=ref<NpcRecord|null>(null),catalog=ref<NpcCatalog|null>(null),error=ref('');let live=true;
async function load(){error.value='';try{const [r,c]=await Promise.all([api<{npc:NpcRecord}>(`/api/campaigns/${props.campaignId}/npcs/${props.npcId}`),api<NpcCatalog>(`/api/campaigns/${props.campaignId}/npcs/catalog`)]);if(live){npc.value=r.npc;catalog.value=c;}}catch{if(live)error.value='Ce PNJ est introuvable ou inaccessible dans cette campagne.';}}
onMounted(load);onUnmounted(()=>{live=false;});
</script>
<template><div class="npc-preview"><p v-if="error" role="alert">{{ error }} <button type="button" @click="load">Réessayer</button></p><CampaignNpcSheet v-else-if="npc&&catalog" :data="npc.data" :catalog="catalog" /><p v-else role="status">Chargement de la fiche PNJ…</p></div></template>
<style scoped>.npc-preview{padding:14px;border:1px solid #405875;border-radius:6px;background:#0b1725;margin:10px 0;min-width:0}</style>
