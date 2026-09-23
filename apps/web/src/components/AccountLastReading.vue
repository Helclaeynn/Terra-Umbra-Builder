<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { api } from "../lib/api";
import { parseReadingPositions } from "../lib/compendium-reading";

const props = defineProps<{ userId: string }>();
type RecentArticle = { id: string; title: string; category: string };
const latest = ref<RecentArticle | null>(null);
const sectionId = ref("");
const loading = ref(true);
const failed = ref(false);
let version = 0;
const target = computed(() => ({ path: "/compendium", query: {
  article: latest.value?.id ?? "", ...(sectionId.value ? { section: sectionId.value } : {})
} }));

async function load() {
  const current = ++version;
  loading.value = true;
  failed.value = false;
  latest.value = null;
  sectionId.value = "";
  try {
    // Titles and visibility always come from the authenticated server response.
    const result = await api<{ recentItems: RecentArticle[] }>("/api/compendium/library");
    if (version !== current) return;
    latest.value = result.recentItems[0] ?? null;
    if (latest.value) {
      try {
        sectionId.value = parseReadingPositions(localStorage.getItem(`tuc-compendium-reading-v1:${props.userId}`))[latest.value.id]?.sectionId ?? "";
      } catch { /* Reading the article remains possible without local storage. */ }
    }
  } catch {
    if (version === current) failed.value = true;
  } finally { if (version === current) loading.value = false; }
}
onMounted(() => { void load(); window.addEventListener("focus", load); });
onUnmounted(() => { version++; window.removeEventListener("focus", load); });
</script>

<template>
  <section class="account-last-reading" aria-label="Dernière lecture du Compendium" :aria-busy="loading">
    <div>
      <p class="eyebrow">MA DERNIÈRE LECTURE</p>
      <template v-if="latest">
        <h2>{{ latest.title }}</h2>
        <p>{{ latest.category }} · {{ sectionId ? 'Reprendre à la dernière section consultée' : 'Ouvrir au début de l’article' }}</p>
      </template>
      <p v-else-if="loading" role="status">Chargement de ta dernière lecture…</p>
      <p v-else-if="failed" role="status">Ta dernière lecture n’a pas pu être chargée.</p>
      <p v-else>Les articles consultés avec ton compte apparaîtront ici.</p>
    </div>
    <RouterLink v-if="latest" class="ghost" :to="target">Reprendre ma lecture →</RouterLink>
    <button v-else-if="failed" class="ghost" type="button" @click="load">Réessayer</button>
    <RouterLink v-else-if="!loading" class="ghost" to="/compendium">Explorer le Compendium →</RouterLink>
  </section>
</template>

<style scoped>
.account-last-reading{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:24px 28px;margin:0 0 28px;border:1px solid #36576d;border-radius:8px;background:linear-gradient(110deg,#142937,#101d30);color:#e7f1fc}
.account-last-reading>div{min-width:0;overflow-wrap:anywhere}
.account-last-reading h2{margin:8px 0;font-size:21px;line-height:1.35;letter-spacing:-.02em}
.account-last-reading p{margin:0;color:#b3c9da;font-size:14px;line-height:1.6}
.account-last-reading .eyebrow{font-size:11px;letter-spacing:.14em}
.account-last-reading :is(a,button){flex-shrink:0;min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;box-sizing:border-box}
@media(max-width:650px){.account-last-reading{align-items:stretch;flex-direction:column;padding:20px;gap:16px}.account-last-reading :is(a,button){white-space:normal}}
</style>
