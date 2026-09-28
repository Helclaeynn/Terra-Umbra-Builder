<script setup lang="ts">
import { computed } from 'vue';
import { everydayEquipmentIds } from '../../../../api/src/rules/builder-equipment-policy';
import type { RealityRulesPackage } from '../../lib/reality';
import BuilderWikiLink from './BuilderWikiLink.vue';
const props = defineProps<{rules: RealityRulesPackage; data: {disadvantages?:string[]; social?:Record<string,unknown>; reality?:Record<string,unknown>}; campaign?: boolean}>();
const items = computed(() => everydayEquipmentIds(props.data, props.campaign !== false)
  .map(id => props.rules.equipment.find(i => i.id === id)).filter(i => !!i));
</script>
<template>
  <section class="everyday-equipment" aria-label="Équipement courant inclus">
    <h3>Équipement courant inclus</h3>
    <p>Fourni par votre Train de vie : aucun achat, aucune charge fixe supplémentaire et aucune revente depuis ces lignes.</p>
    <ul><li v-for="item in items" :key="item.id" :data-everyday-item="item.id">
      <BuilderWikiLink v-if="item.compendiumId" :article-id="item.compendiumId" :label="item.name" compact>{{ item.name }}</BuilderWikiLink><strong v-else>{{ item.name }}</strong>
      <span>Inclus · {{ item.id.endsWith('n-sta') ? 'réserve usuelle, effets seulement après utilisation' : 'équipement personnel' }}</span>
    </li></ul>
    <p class="everyday-note">Les dépenses quotidiennes sont couvertes à hauteur du Train de vie, pas les achats exceptionnels. Prix et descriptions restent dans le Compendium.</p>
  </section>
</template>
<style scoped>
.everyday-equipment{padding:16px;border:1px solid #30485d;border-radius:8px;margin-block:16px;background:#0d1a2b;color:#d7e7f3}.everyday-equipment h3{margin:0}.everyday-equipment p{font-size:13px;color:#b3c9d9}.everyday-equipment ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}.everyday-equipment li{display:grid;gap:4px}.everyday-equipment span{font-size:12px;color:#9ab9cc}.everyday-note{margin-bottom:0}
</style>
