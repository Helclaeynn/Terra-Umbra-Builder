<script setup lang="ts">
import { ref } from "vue";
const failure = ref(false);
</script>

<template>
  <aside class="hologram-comparison" aria-labelledby="hologram-comparison-title">
    <span class="comparison-kicker">UNE MÊME FOULE</span>
    <h2 id="hologram-comparison-title">Quand l’Hologramme défaille</h2>
    <div class="comparison-controls" role="group" aria-label="Choisir la vue de la foule">
      <button type="button" :aria-pressed="!failure" aria-controls="hologram-stage" @click="failure = false">Réalité</button>
      <button type="button" :aria-pressed="failure" aria-controls="hologram-stage" @click="failure = true">Hologramme défaillant</button>
    </div>
    <figure>
      <div id="hologram-stage" class="comparison-stage">
        <img :hidden="failure" src="/brand/orbital/foule-realite.webp" alt="Foule d’apparence humaine sur une avenue nocturne et pluvieuse, éclairée de néons." width="1536" height="1024" loading="lazy" decoding="async">
        <img :hidden="!failure" src="/brand/orbital/foule-hologramme-defaillant.webp" alt="Même foule : au second rang, un visage reptilien, une femme cornue, une tête d’ombre et un visage insectoïde apparaissent derrière quatre passants humains." width="1536" height="1024" loading="lazy" decoding="async">
      </div>
      <figcaption aria-live="polite" aria-atomic="true">{{ failure ? 'Hologramme défaillant — au second rang, quatre passants révèlent des traits non humains.' : 'Réalité — une foule d’apparence humaine.' }}</figcaption>
    </figure>
  </aside>
</template>

<style scoped>
.hologram-comparison{padding:24px;margin:28px 0;border:1px solid #4c4265;border-radius:8px;background:#0d1523;color:#edf4ff}
.comparison-kicker{font:11px/1.5 Consolas,monospace;letter-spacing:.14em;color:#b79aff}
h2{margin:10px 0 20px;font:500 clamp(22px,2.4vw,30px)/1.3 Inter,"Segoe UI",sans-serif}
.comparison-controls{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px}
button{min-height:44px;padding:11px 18px;border:1px solid #486078;border-radius:5px;background:transparent;color:#bad0e3;font-size:14px;cursor:pointer}
button[aria-pressed="true"]{border-color:#64def5;background:#163349;color:#dff8ff;box-shadow:inset 0 -2px #64def5}
button:nth-child(2)[aria-pressed="true"]{border-color:#b79aff;background:#30233f;color:#edddff;box-shadow:inset 0 -2px #b79aff}
button:focus-visible{outline:2px solid #64def5;outline-offset:4px}
figure{margin:0}.comparison-stage{aspect-ratio:3/2;overflow:hidden;border-radius:5px;background:#080e18}
img{display:block;width:100%;height:100%;object-fit:contain}img[hidden]{display:none!important}
figcaption{min-height:3.6em;margin-top:14px;color:#b9cadd;font-size:14px;line-height:1.8}
@media(max-width:650px){.hologram-comparison{padding:16px}button{flex:1 1 auto;padding-left:12px;padding-right:12px}figcaption{min-height:5.4em}}
</style>
