<script setup lang="ts">
import SiteNav from "../components/SiteNav.vue";
// Point d'entrée des administrateurs : chaque outil, avec ce qui l'attend.
// Les outils eux-mêmes restent où ils sont (Mon espace, pages /admin/…, Directus).
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { api } from "../lib/api";
import { usePageTitle } from "../lib/page-title";

type Item = { key: string; count: number };
usePageTitle(() => "Administration");
const counts = ref<Record<string, number>>({});
const role = ref("");
const error = ref("");
const loaded = ref(false);
const n = (key: string) => counts.value[key] ?? 0;
const tools = computed(() => [
  { to: "/account", title: "Comptes et demandes d’accès MJ", text: "Rôles, activation, suppression, demandes MJ et journal administrateur (dans Mon espace).", count: n("gm-requests") },
  { to: "/admin/pnj-proposes", title: "PNJ proposés", text: "Contacts créés par les joueurs : relire, ouvrir dans l’éditeur pour publier, ou refuser.", count: n("npc-proposals") },
  { to: "/admin/quality", title: "Contrôle qualité du Compendium", text: "Pages à relire, portraits, médias manquants.", count: 0 },
  { to: "/admin/arbitrage", title: "Arbitrages", text: "Décisions de recette en attente sur le contenu.", count: 0 }
]);

onMounted(async () => {
  try {
    const r = await api<{ items: Item[]; role: string }>("/api/attention");
    role.value = r.role;
    counts.value = Object.fromEntries(r.items.map((i) => [i.key, i.count]));
  } catch {
    error.value = "Impossible de charger l’administration.";
  } finally {
    loaded.value = true;
  }
});
</script>

<template>
  <div class="admin-shell">
    <header class="admin-topbar">
      <SiteNav />
    </header>
    <main class="admin-page">
      <p class="eyebrow">ADMINISTRATION</p>
      <h1>Administration</h1>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <p v-else-if="loaded && role !== 'admin'" role="alert" class="error">Cette page est réservée aux administrateurs.</p>
      <template v-else-if="loaded">
        <div class="tools">
          <RouterLink v-for="tool in tools" :key="tool.to" :to="tool.to" class="tool">
            <strong>{{ tool.title }} <span v-if="tool.count" class="badge">{{ tool.count }}</span></strong>
            <span>{{ tool.text }}</span>
          </RouterLink>
          <a href="/cms" class="tool" target="_blank" rel="noopener">
            <strong>Contenu (Directus) <span v-if="n('content-review')" class="badge">{{ n("content-review") }} en relecture</span></strong>
            <span>Articles, PNJ, règles : modifier, relire, publier. Disponible sur le site d’essai.</span>
          </a>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.admin-shell{min-height:100vh;background:var(--c-night);color:var(--c-text);font-family:var(--font-text)}
.admin-topbar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--c-line)}
.admin-topbar a{color:var(--c-reality-soft)}
.admin-page{max-width:1000px;margin:0 auto;padding:24px 16px 60px;display:grid;gap:16px}
.eyebrow{margin:0;color:var(--c-reality);font-size:12px;letter-spacing:.08em}
h1{margin:0;font-size:28px}
.error{color:#ffb4b4}
.tools{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.tool{display:grid;gap:6px;padding:16px;border:1px solid var(--c-line);border-radius:8px;background:var(--c-surface);color:var(--c-text);text-decoration:none}
.tool:hover,.tool:focus-visible{border-color:var(--c-reality)}
.tool span{color:var(--c-text-soft);line-height:1.5;font-size:14px}
.tool .badge{display:inline-block;margin-left:6px;padding:1px 8px;border-radius:999px;background:var(--c-reality);color:var(--c-night);font-size:12px;font-weight:700}
.tool:focus-visible{outline:2px solid var(--c-reality-soft);outline-offset:3px}
</style>
