<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { readingGuides, playerGuides, termLabel, glossaryHref } from '../lib/player-start';
const props=defineProps<{articleId:string}>();
const entry=computed(()=>readingGuides[props.articleId]);
const guides=computed(()=>playerGuides.filter(g=>entry.value?.guides.includes(g.id)));
</script>
<template>
  <aside v-if="entry" class="article-reading-guide" aria-label="Repères pour découvrir cet article">
    <p class="reading-eyebrow">POUR PRENDRE SES REPÈRES</p><p class="reading-purpose">{{ entry.purpose }}</p>
    <ul><li v-for="point in entry.essentials" :key="point">{{ point }}</li></ul>
    <div v-if="guides.length" class="reading-links"><RouterLink v-for="guide in guides" :key="guide.id" :to="`/decouvrir/${guide.id}`">Commencer un {{ guide.title }} →</RouterLink></div>
    <div class="reading-terms"><span>Les mots utiles :</span><RouterLink v-for="id in entry.terms" :key="id" :to="glossaryHref(id)">{{ termLabel(id) }}</RouterLink></div>
    <div class="reading-footer"><RouterLink to="/decouvrir">Je découvre l’univers →</RouterLink><RouterLink to="/glossaire">Tout le glossaire →</RouterLink></div>
  </aside>
</template>
<style scoped>
.article-reading-guide{padding:20px 24px;margin:0 0 24px;border:1px solid #345572;border-left:3px solid #68d6e9;border-radius:8px;background:#112233;color:#e6edf7;font-size:.94rem;line-height:1.65;overflow-wrap:anywhere}.reading-eyebrow{color:#a6cedf;font-size:.7rem;letter-spacing:.13em;margin:0 0 8px}.reading-purpose{font-weight:650;margin:0}.article-reading-guide ul{margin:12px 0;padding-left:20px}.article-reading-guide li+li{margin-top:5px}.article-reading-guide a{color:#8de4f1;text-decoration:underline;text-underline-offset:3px;padding-block:6px;display:inline-block}.article-reading-guide a:focus-visible{outline:2px solid #fff;outline-offset:3px}.reading-links,.reading-terms,.reading-footer{display:flex;flex-wrap:wrap;align-items:center;gap:4px 18px}.reading-links{margin:12px 0}.reading-terms{font-size:.86rem}.reading-footer{margin-top:12px;padding-top:10px;border-top:1px solid #36506a;font-size:.85rem}@media(max-width:600px){.article-reading-guide{padding:16px}}
</style>
