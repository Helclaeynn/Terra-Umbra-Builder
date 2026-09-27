<script setup lang="ts">
import {computed} from 'vue';
import {shortRealityTalent} from '../../../../api/src/rules/reality-talents-summaries';
const props=defineProps<{talentId:string;effect?:string;lore?:string}>();
const summary=computed(()=>shortRealityTalent(props.talentId,props.effect||'—'));
const hasDetails=computed(()=>Boolean(props.lore||(props.effect&&props.effect!==summary.value)));
</script>
<template>
  <div class="reality-talent-text" :data-reality-talent-text="talentId">
    <p class="talent-summary" data-talent-summary>{{ summary }}</p>
    <details v-if="hasDetails" class="talent-details">
      <summary>Détails</summary>
      <p v-if="lore" class="talent-ambience">{{ lore }}</p>
      <p v-if="effect && effect!==summary" data-talent-full-rule>{{ effect }}</p>
    </details>
  </div>
</template>
<style scoped>
.reality-talent-text{min-width:0;display:grid;gap:6px;font-size:14px;line-height:1.6;overflow-wrap:anywhere}.reality-talent-text p{margin:0;color:inherit}.talent-details>summary{min-height:44px;display:flex;align-items:center;cursor:pointer;color:#a5def0;gap:8px}.talent-details>summary::before{content:'＋'}.talent-details[open]>summary::before{content:'−'}.talent-details>summary:focus-visible{outline:2px solid currentColor;outline-offset:2px}.talent-details>p+p{margin-top:10px}.talent-ambience{font-style:italic}.talent-details{color:#b3c5d9}
</style>
