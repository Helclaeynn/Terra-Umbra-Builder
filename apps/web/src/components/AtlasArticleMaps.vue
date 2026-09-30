<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import atlas from '../lib/atlas-data.json';
import articleMaps from '../lib/atlas-static-articles.json';

const props = defineProps<{ articleId: string }>();
const maps = computed(() => {
  const ids = (articleMaps as Record<string, string[]>)[props.articleId] || [];
  return ids.flatMap(id => atlas.gallery.filter(map => map.id === id));
});
</script>

<template>
  <section v-if="maps.length" class="article-maps" aria-label="Cartes du territoire">
    <h2>Cartes du territoire</h2>
    <p>Cartes illustrées non interactives. Cliquez sur une image pour l’ouvrir en haute définition.</p>
    <div class="article-maps-grid" :class="{ single: maps.length === 1 }">
      <figure v-for="map in maps" :key="map.id">
        <a :href="map.image" target="_blank" rel="noopener" :aria-label="`Ouvrir la carte ${map.title} en haute définition`">
          <img :src="map.thumb" :alt="`Carte de ${map.title}`" loading="lazy" decoding="async" :width="map.width" :height="map.height" />
        </a>
        <figcaption>
          <strong>{{ map.title }}</strong>
          <span>{{ map.width.toLocaleString('fr-FR') }} × {{ map.height.toLocaleString('fr-FR') }} pixels</span>
          <div><a :href="map.image" download>Télécharger la carte</a><RouterLink :to="{path:'/atlas',query:{map:map.id}}">Version interactive ↗</RouterLink></div>
        </figcaption>
      </figure>
    </div>
    <p class="article-maps-note">Implantations de jeu interprétées pour 2035. <RouterLink to="/atlas#cartes-classiques">Voir toutes les cartes</RouterLink></p>
  </section>
</template>

<style scoped>
.article-maps{margin:24px 0 32px;padding:20px;border:1px solid #385969;border-radius:8px;background:#102532;color:#ccdfe4;scroll-margin-top:140px}
.article-maps h2{margin:0 0 10px;font-size:23px;color:#edf4ff}
.article-maps p{font-size:14px;line-height:1.6}
.article-maps-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.article-maps-grid.single{grid-template-columns:minmax(0,1fr)}
.article-maps figure{margin:0;min-width:0;background:#0a1c28;border:1px solid #294453;border-radius:5px;overflow:hidden}
.article-maps figure>a{display:block;padding:10px}
.article-maps img{display:block;width:100%;height:auto;max-height:560px;object-fit:contain}
.article-maps figcaption{display:grid;gap:8px;padding:14px;font-size:13px}
.article-maps figcaption>span{color:#a8c0c8;font-size:12px}
.article-maps figcaption>div{display:flex;gap:10px 18px;flex-wrap:wrap}
.article-maps a{color:#e0c98a;text-underline-offset:3px}
.article-maps a:focus-visible{outline:2px solid #f1ce79;outline-offset:3px}
.article-maps .article-maps-note{margin:16px 0 0;font-size:12px;color:#a8c0c8}
@media(max-width:650px){.article-maps{padding:14px}.article-maps-grid{grid-template-columns:minmax(0,1fr)}}
</style>
