<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { articleHref } from '../lib/player-start';
</script>
<template>
  <section id="regles" class="start-prose guide-rules" aria-labelledby="guide-rules-title">
    <p class="start-eyebrow">LE MÊME SOCLE POUR TOUS</p><h2 id="guide-rules-title">La règle de base, en une minute</h2>
    <p>Décris ce que ton personnage veut faire et comment. Le MJ — la personne qui mène la partie — indique le test adapté et la difficulté quand la situation demande un jet.</p>
    <p class="guide-formula"><strong>Attribut + Compétence + 1d10 explosif</strong><span>Atteindre ou dépasser la difficulté pour réussir.</span></p>
    <p>L’Attribut représente une aptitude générale, la Compétence un savoir-faire. À l’état <strong>Normal</strong>, un 10 au dé permet d’en lancer un second et de l’ajouter, une seule fois. Un 1 naturel au premier dé est un échec narratif, même avec un total suffisant.</p>
    <div class="guide-thresholds" aria-label="Seuils de difficulté"><span>Facile <b>12</b></span><span>Normale <b>15</b></span><span>Difficile <b>18</b></span><span>Très difficile <b>21</b></span><span>Impossible <b>25</b></span></div>
    <p class="start-example"><strong>Exemple</strong>Ton Attribut et ta Compétence totalisent 7. Tu fais 9 au dé : 16 contre une difficulté de 15, c’est réussi. La marge est de 1, soit 0 degré de réussite (DR). Chaque tranche de 3 points de marge donne ensuite 1 DR, jusqu’à 5.</p>
    <details class="start-stereotypes"><summary>Et pendant un combat ?</summary><div class="start-stereotypes-content"><p>L’Initiative se calcule avec Agilité + Athlétisme + 1d10 explosif. Elle donne normalement 1 PA de 1 à 10, 2 PA de 11 à 15, ou 3 PA à partir de 16. Un 1 naturel limite à 1 PA. Les PA sont tes Points d’Action pour le round ; certaines capacités modifient ce nombre.</p><p>Les personnages agissent par passes : tous à la première, puis ceux qui ont assez de PA aux suivantes. Une Réaction payée en PA consomme une action future, en retirant d’abord la plus haute passe disponible. Garde donc de quoi te défendre.</p></div></details>
    <p class="start-caption">Le Stress peut modifier les résultats naturels qui font échouer ou exploser le dé. Les talents, pouvoirs et équipements n’accordent que leurs effets écrits : consulte leur fiche au moment de les utiliser.</p>
    <div class="start-terms"><RouterLink :to="articleHref('regles-resolution-des-tests')">Résoudre un test →</RouterLink><RouterLink :to="articleHref('regles-initiative-pa-deplacement')">Initiative et actions →</RouterLink><RouterLink :to="articleHref('regles-stress-etats-psychologiques')">Comprendre le Stress →</RouterLink></div>
  </section>
</template>
