<script setup lang="ts">
// Navigation commune du site (lot « Finir la charte », 06/11) : la marque et les
// cinq grandes rubriques, au même endroit sur chaque page. Chaque page garde
// à côté ses propres actions (recherche, déconnexion…).
import { RouterLink, useRoute } from "vue-router";
import TerraUmbraBrand from "./TerraUmbraBrand.vue";

const route = useRoute();
const LINKS = [
  { to: "/compendium", label: "Compendium", match: (p: string) => p === "/" || p.startsWith("/compendium") },
  { to: "/atlas", label: "Atlas", match: (p: string) => p.startsWith("/atlas") },
  { to: "/decouvrir", label: "Découvrir", match: (p: string) => p.startsWith("/decouvrir") || p === "/glossaire" },
  { to: "/account", label: "Personnages", match: (p: string) => p === "/account" || p.startsWith("/characters") },
  { to: "/campaigns", label: "Campagnes", match: (p: string) => p.startsWith("/campaigns") }
];
</script>

<template>
  <RouterLink class="site-brand" to="/" aria-label="Terra Umbra — accueil"><TerraUmbraBrand /></RouterLink>
  <nav class="site-nav" aria-label="Navigation principale">
    <RouterLink
      v-for="link in LINKS"
      :key="link.to"
      :to="link.to"
      :class="{ on: link.match(route.path) }"
      :aria-current="link.match(route.path) ? 'page' : undefined"
    >{{ link.label }}</RouterLink>
  </nav>
</template>

<style scoped>
.site-brand { display: inline-flex; flex: none; text-decoration: none; }
/* Les liens passent à la ligne plutôt que de sortir de l'écran. */
.site-nav { display: flex; flex: 1 1 auto; flex-wrap: wrap; gap: 2px; min-width: 0; }
.site-nav a {
  padding: 9px 12px; border-radius: 6px; white-space: nowrap; text-decoration: none;
  color: var(--c-text-soft); font: 500 14px/1.2 var(--font-text);
}
.site-nav a:hover { color: var(--c-text); background: color-mix(in srgb, var(--c-relief) 70%, transparent); }
.site-nav a.on { color: var(--c-text); background: var(--c-relief); box-shadow: inset 0 -2px 0 var(--c-reality); }
.site-nav a:focus-visible { outline: 2px solid var(--c-reality); outline-offset: 2px; }
@media (max-width: 650px) { .site-nav a { padding: 8px 9px; font-size: 13px; } }
</style>
