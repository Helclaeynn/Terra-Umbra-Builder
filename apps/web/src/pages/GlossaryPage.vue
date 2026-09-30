<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import PlayerStartFrame from '../components/PlayerStartFrame.vue';
import { glossaryTerms, filterTerms, articleHref, glossaryHref } from '../lib/player-start';
const route=useRoute(); const router=useRouter();
const search=computed({get:()=>typeof route.query.q==='string'?route.query.q:'',set:(value:string)=>{void router.replace({path:'/glossaire',query:value?{q:value}:{}});}});
const selected=computed(()=>typeof route.query.terme==='string'?glossaryTerms.find(t=>t.id===route.query.terme):undefined);
const results=computed(()=>selected.value?[selected.value]:filterTerms(search.value));
</script>
<template>
  <PlayerStartFrame>
    <header class="start-hero start-hero-small"><p class="start-eyebrow">LES MOTS DU MONDE</p><h1>Le glossaire</h1><p class="start-lead">Une idée simple avant les détails. Cherche un mot, un sigle ou une notion ; ouvre le dossier seulement si tu veux approfondir.</p></header>
    <section class="start-section glossary-section" aria-label="Définitions">
      <label class="start-search">Rechercher dans le glossaire<input v-model="search" type="search" placeholder="Voile, AIDH, essaim, PA…" autocomplete="off"></label>
      <div v-if="selected" class="start-selected-term"><span>Définition : {{ selected.label }}</span><RouterLink to="/glossaire">Voir tout le glossaire →</RouterLink></div>
      <p v-else-if="route.query.terme" class="start-note">Cette entrée n’existe pas. Les autres définitions restent disponibles ci-dessous.</p>
      <p class="start-caption" role="status">{{ results.length }} {{ results.length > 1 ? 'définitions' : 'définition' }}{{ !selected && !search ? ' · classées par ordre alphabétique' : '' }}</p>
      <div class="glossary-list"><article v-for="term in results" :key="term.id" :id="`terme-${term.id}`" class="glossary-term"><h2><RouterLink :to="glossaryHref(term.id)">{{ term.label }}</RouterLink></h2><p>{{ term.definition }}</p><RouterLink :to="articleHref(term.article)" class="glossary-detail">Approfondir dans le Compendium →</RouterLink></article></div>
      <div v-if="!results.length" class="start-note"><h2>Aucun mot trouvé</h2><p>Essaie une orthographe plus courte ou cherche directement dans les dossiers.</p><RouterLink :to="{path:'/compendium',query:{q:search}}">Chercher « {{ search }} » dans le Compendium →</RouterLink><br><RouterLink to="/glossaire">Effacer la recherche</RouterLink></div>
    </section>
  </PlayerStartFrame>
</template>
