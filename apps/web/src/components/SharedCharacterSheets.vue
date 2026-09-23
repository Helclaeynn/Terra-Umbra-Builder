<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { api } from "../lib/api";
const characters=ref<Array<{id:string;name:string;ownerName:string}>>([]);
const loading=ref(true),error=ref("");
let generation=0;
async function load(){
  const current=++generation;
  loading.value=true;error.value="";
  try{
    const result=await api<{characters:typeof characters.value}>("/api/characters/shared");
    if(current===generation)characters.value=result.characters;
  }catch{if(current===generation){characters.value=[];error.value="Impossible de charger les fiches partagées.";}}
  finally{if(current===generation)loading.value=false;}
}
onMounted(()=>{void load();window.addEventListener("focus",load);});
onUnmounted(()=>{generation++;window.removeEventListener("focus",load);});
</script>
<template>
  <section class="panel shared-character-sheets" aria-labelledby="shared-sheets-title" :aria-busy="loading">
    <p class="eyebrow">OUTILS MJ · LECTURE SEULE</p><h2 id="shared-sheets-title">Fiches partagées avec moi</h2>
    <p v-if="loading" role="status">Chargement des partages…</p>
    <div v-else-if="error" role="alert"><p>{{ error }}</p><button class="ghost" @click="load">Réessayer</button></div>
    <p v-else-if="!characters.length">Aucune fiche partagée pour le moment. Chaque joueur peut te donner accès depuis sa fiche actuelle, en recherchant ton nom de compte.</p>
    <ul v-else><li v-for="character in characters" :key="character.id"><div><strong>{{ character.name }}</strong><small>{{ character.ownerName }}</small></div><RouterLink class="ghost" :to="`/characters/${character.id}/sheet`">Consulter la fiche</RouterLink></li></ul>
  </section>
</template>
<style scoped>
ul{padding:0;list-style:none}li{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;border-bottom:1px solid #284255}small{display:block;color:#adc2d4;margin-top:4px}a{min-height:44px}@media(max-width:600px){li{align-items:start;flex-direction:column}}
</style>
