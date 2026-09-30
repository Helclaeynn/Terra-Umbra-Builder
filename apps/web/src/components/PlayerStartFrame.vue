<script setup lang="ts">
import { RouterLink } from 'vue-router';
import '../player-start.css';
</script>
<template>
  <div class="player-start">
    <a class="start-skip" href="#start-main">Aller au contenu</a>
    <header class="start-header">
      <RouterLink class="start-brand" to="/compendium">TERRA UMBRA<span>CALIFORNIA · 2035</span></RouterLink>
      <nav aria-label="Découverte de Terra Umbra">
        <RouterLink to="/decouvrir">Bien commencer</RouterLink>
        <RouterLink to="/glossaire">Glossaire</RouterLink>
        <RouterLink to="/compendium">Compendium</RouterLink>
        <RouterLink to="/atlas">Atlas & cartes</RouterLink>
      </nav>
    </header>
    <main id="start-main" tabindex="-1"><slot /></main>
    <footer class="start-footer">TERRA UMBRA <span>Un monde à découvrir, une partie à la fois.</span><RouterLink to="/compendium">Retour au Compendium →</RouterLink></footer>
  </div>
</template>
