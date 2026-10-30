<script setup lang="ts">
import {computed} from 'vue';
import {RouterLink} from 'vue-router';
import mappings from '../lib/atlas-article-maps.json';
const props=defineProps<{articleId:string}>();
const links=computed(()=>(mappings as Record<string,{map:string;spot:string;name:string}[]>)[props.articleId]||[]);
</script>
<template><aside v-if="links.length" class="article-atlas" aria-label="Cartes liées à cet article"><strong>Sur les cartes</strong><RouterLink v-for="link in links" :key="link.map" :to="{path:'/atlas',query:{map:link.map,...(link.spot?{spot:link.spot}:{})}}">{{link.map==='la'?'Los Angeles':link.map==='reserve'?'Grande Réserve':'Grande Californie'}} · {{link.name}} ↗</RouterLink><RouterLink to="/atlas#cartes-classiques">Cartes classiques et téléchargement</RouterLink></aside></template>
<style scoped>.article-atlas{display:flex;gap:8px 18px;flex-wrap:wrap;align-items:center;padding:12px 16px;margin:12px 0 20px;background:#142f3d;border:1px solid #385969;border-radius:6px;font-size:13px}.article-atlas strong{color:#ccdfe4}.article-atlas a{color:#e0c98a}</style>
