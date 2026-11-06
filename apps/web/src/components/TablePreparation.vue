<script setup lang="ts">
// Préparation de la séance jouée, à la table (lot Table, 06/11) : les scènes,
// notes et PNJ prévus dans le carnet de la campagne, en mode « En partie »
// (case « Scène jouée »), sans quitter la table.
import { ref, watch } from "vue";
import { api } from "../lib/api";
import CampaignNotebook from "./CampaignNotebook.vue";
import type { CampaignScene } from "../../../api/src/campaign-preparation";

type Prep = { id: string; title: string; preparation?: string; scenes?: CampaignScene[]; version: number };
const props = defineProps<{ campaignId: string; sessionId?: string | null; groupSize?: number }>();
const session = ref<Prep | null>(null);
const loading = ref(false);
const error = ref("");

async function load() {
  session.value = null;
  error.value = "";
  if (!props.sessionId) return;
  loading.value = true;
  try {
    const result = await api<{ sessions: Prep[] }>(`/api/campaigns/${props.campaignId}/sessions`);
    session.value = result.sessions.find((item) => item.id === props.sessionId) ?? null;
    if (!session.value) error.value = "La séance en cours n'est pas parmi les 20 dernières : ouvre-la depuis le tableau de bord de la campagne.";
  } catch {
    error.value = "Préparation indisponible pour l'instant. Réessaie dans un moment.";
  } finally {
    loading.value = false;
  }
}
watch(() => props.sessionId, load, { immediate: true });
</script>

<template>
  <div class="table-preparation">
    <p v-if="!sessionId" class="hint">Aucune séance préparée n'est liée à cette partie. Choisis-la dans « Séance en cours » pour retrouver ici ses scènes et ses PNJ.</p>
    <p v-else-if="loading" role="status">Ouverture de la préparation…</p>
    <p v-else-if="error" role="alert">{{ error }} <button type="button" class="ui-quiet" @click="load">Réessayer</button></p>
    <CampaignNotebook v-else-if="session" :key="session.id" :campaign-id="campaignId" :session="session" :start-playing="true" :group-size="groupSize" @saved="(saved) => (session = { ...session!, ...saved })" />
  </div>
</template>

<style scoped>
.table-preparation { display: grid; gap: 8px; }
.table-preparation .hint { margin: 0; color: var(--ui-ink-soft); font-size: var(--ui-text-md); }
</style>
