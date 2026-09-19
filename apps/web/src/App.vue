<script setup lang="ts">
import { onMounted, ref } from "vue";

type Health = {
  status: string;
  service: string;
  version?: string;
};

const health = ref<Health | null>(null);
const error = ref("");

onMounted(async () => {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    health.value = await response.json();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "Erreur inconnue";
  }
});
</script>

<template>
  <main class="shell">
    <section class="hero">
      <p class="eyebrow">TERRA UMBRA CALIFORNIA</p>
      <h1>TUC Web V2</h1>
      <p class="lead">
        Le nouveau socle applicatif est en ligne. Le Compendium et le Builder V1
        restent inchangés pendant la construction.
      </p>

      <div class="status" :class="{ ok: health?.status === 'ok' }">
        <span class="dot" />
        <span v-if="health">API {{ health.status }}</span>
        <span v-else-if="error">API indisponible — {{ error }}</span>
        <span v-else>Connexion à l’API…</span>
      </div>
    </section>
  </main>
</template>
