<script setup lang="ts">
// Pastille « ce qui t'attend », sur tout le site : invitations, personnages à corriger ou à
// accepter, et pour les admins demandes MJ, PNJ proposés, contenu en relecture.
// Rien quand il n'y a rien à faire ou qu'on n'est pas connecté.
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { api } from "../lib/api";

type Item = { key: string; label: string; count: number; to: string };
const route = useRoute();
const items = ref<Item[]>([]);
const open = ref(false);
const pending = computed(() => items.value.filter((i) => i.count > 0));
const total = computed(() => pending.value.reduce((n, i) => n + i.count, 0));
// La table de jeu a sa barre d'actions en bas d'écran : pas de pastille par-dessus.
const hidden = computed(() => /^\/campaigns\/[^/]+\/play/.test(route.path));
let timer: ReturnType<typeof setInterval> | undefined;

async function load() {
  if (document.visibilityState === "hidden") return;
  try { items.value = (await api<{ items: Item[] }>("/api/attention")).items; }
  catch { items.value = []; } // déconnecté ou serveur indisponible : pas de pastille
}
watch(() => route.path, () => { open.value = false; void load(); });
onMounted(() => { void load(); timer = setInterval(load, 60_000); });
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div v-if="total && !hidden" class="attention">
    <button type="button" class="attention-pill" :aria-expanded="open" @click="open = !open">
      {{ total }} {{ total > 1 ? "choses t’attendent" : "chose t’attend" }}
    </button>
    <ul v-if="open" class="attention-list">
      <li v-for="item in pending" :key="item.key">
        <RouterLink :to="item.to">{{ item.label }} · {{ item.count }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.attention{position:fixed;left:16px;bottom:16px;z-index:60;display:grid;gap:8px;justify-items:start;font-family:var(--font-text)}
.attention-pill{min-height:44px;padding:8px 14px;border:1px solid var(--c-reality);border-radius:999px;background:var(--c-relief);color:var(--c-text);font:inherit;font-size:14px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.35)}
.attention-list{margin:0;padding:8px;list-style:none;border:1px solid var(--c-line-strong);border-radius:8px;background:var(--c-surface);box-shadow:0 6px 20px rgba(0,0,0,.45)}
.attention-list a{display:block;padding:8px 10px;color:var(--c-reality-soft);text-decoration:none;border-radius:6px}
.attention-list a:hover,.attention-list a:focus-visible{background:var(--c-relief)}
.attention-pill:focus-visible{outline:2px solid var(--c-reality-soft);outline-offset:3px}
@media print{.attention{display:none}}
</style>
