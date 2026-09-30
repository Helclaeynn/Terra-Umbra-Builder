<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { articleHref } from '../lib/player-start';
defineProps<{ image: {src:string;alt:string;caption:string;article:string;portrait?:boolean}; eager?:boolean }>();
</script>
<template>
  <figure class="guide-illustration" :class="{'guide-portrait':image.portrait}">
    <img :src="image.src" :alt="image.alt" :loading="eager?'eager':'lazy'" decoding="async" width="1200" height="675">
    <figcaption>{{ image.caption }} <RouterLink :to="articleHref(image.article)">Voir le dossier →</RouterLink></figcaption>
  </figure>
</template>
