<script setup lang="ts">
import {computed} from 'vue';
import {playerGuideForTruth} from '../../lib/player-start';
const props=defineProps<{state:{nature:string;choices:Record<string,unknown>}}>();
const guide=computed(()=>playerGuideForTruth(props.state));
</script>
<template>
  <aside class="nature-start-guide" data-nature-guide aria-label="Guide pour commencer ce personnage">
    <template v-if="guide"><div class="nature-guide-heading"><a :href="`/decouvrir/${guide.id}`" target="_blank" rel="noopener noreferrer">Bien commencer — {{ guide.title }} ↗</a><small>Ouvre le guide dans un nouvel onglet</small></div><p>{{ guide.hook }}</p>
      <details :key="guide.id"><summary>Pourquoi le jouer ? Le rappel en bref</summary><div class="nature-guide-reminder"><p><strong>Ce qui peut te plaire.</strong> {{ guide.appeal }}</p><p><strong>Ce que cela implique.</strong> {{ guide.tradeoff }}</p><p class="nature-guide-knowledge">Le guide précise aussi ce que ton personnage sait des autres et les stéréotypes de son milieu.</p></div></details>
    </template>
    <template v-else><a href="/decouvrir#choisir" target="_blank" rel="noopener noreferrer">Bien commencer — comparer les personnages ↗</a><p>Choisis ton peuple ou ton espèce pour retrouver ici son guide. Le lien s’ouvre dans un nouvel onglet.</p></template>
  </aside>
</template>
<style scoped>
.nature-start-guide{min-width:0;margin:18px 0;padding:18px 20px;background:#122333;border:1px solid #365d70;border-left:3px solid #80d5e1;border-radius:7px;color:#cbdce9;font-size:.9rem;line-height:1.65;overflow-wrap:anywhere}.nature-start-guide a{color:#99e6ef;font-weight:600;text-decoration:underline;text-underline-offset:4px;display:inline-block;padding:4px 0}.nature-guide-heading{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 16px}.nature-guide-heading small{font-size:.75rem;color:#a6c1d1}.nature-start-guide p{margin:10px 0 0}.nature-start-guide summary{padding:12px 0 2px;cursor:pointer;color:#deedf4}.nature-start-guide :is(a,summary):focus-visible{outline:2px solid #a7eef4;outline-offset:3px}.nature-guide-reminder{max-width:900px;padding:6px 0}.nature-guide-reminder strong{color:#e2eff6}.nature-guide-reminder .nature-guide-knowledge{font-size:.8rem;color:#afc7d7}
</style>
