<script setup lang="ts">
// Nouvelle page du compendium : titre et rubrique, puis la page s'ouvre
// dans l'éditeur sur place. Le PNJ canonique et les pages proposées par la
// couverture du Builder passent encore par l'ancien écran (/compendium/new).
import { computed, defineAsyncComponent, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { api, ApiError } from "../lib/api";
import { usePageTitle } from "../lib/page-title";

const ArticleInlineEditor = defineAsyncComponent(() => import("../components/editor/ArticleInlineEditor.vue"));

const CATEGORIES = ["Règles", "Réalité", "Vérité", "Personnages", "Équipement & Objets", "Bestiaire"];
const ERRORS: Record<string, string> = {
  invalid_compendium_article_title: "Donne un titre à la page (240 caractères au plus).",
  editor_required: "Ton compte n'a pas le droit de créer des pages.",
  authentication_required: "Connecte-toi d'abord (Mon espace)."
};

const route = useRoute();
const router = useRouter();
const articleId = computed(() => String(route.query.id ?? ""));
const title = ref("");
const category = ref(CATEGORIES.includes(String(route.query.category)) ? String(route.query.category) : "Réalité");
const busy = ref(false);
const error = ref("");

usePageTitle(() => "Nouvelle page");

async function create() {
  if (!title.value.trim()) { error.value = "Donne un titre à la page."; return; }
  busy.value = true;
  error.value = "";
  try {
    const payload = await api<{ articleId: string }>("/api/compendium/editor/articles", {
      method: "POST",
      body: JSON.stringify({ title: title.value.trim(), category: category.value })
    });
    await router.replace({ path: "/compendium/nouvelle", query: { id: payload.articleId } });
  } catch (cause) {
    error.value = cause instanceof ApiError ? ERRORS[cause.message] ?? `Erreur du serveur (${cause.message}).` : "Une erreur est survenue.";
  } finally {
    busy.value = false;
  }
}

function onPublished() {
  void router.push({ path: "/compendium", query: { article: articleId.value } });
}
function onClose() {
  void router.push({ path: "/compendium" });
}
</script>

<template>
  <main class="new-page">
    <nav class="new-page-nav">
      <RouterLink to="/compendium">← Compendium</RouterLink>
    </nav>
    <ArticleInlineEditor
      v-if="articleId"
      :key="articleId"
      :article-id="articleId"
      is-new
      @published="onPublished"
      @close="onClose"
    />
    <form v-else class="new-page-form" @submit.prevent="create">
      <h1>Nouvelle page</h1>
      <p>Choisis un titre et une rubrique. La page est créée en brouillon : personne ne la voit avant que tu la publies.</p>
      <label>Titre<input v-model="title" maxlength="240" autofocus placeholder="Ex. : Le Silence de Pasadena" /></label>
      <label>Rubrique<select v-model="category"><option v-for="item in CATEGORIES" :key="item" :value="item">{{ item }}</option></select></label>
      <p v-if="error" class="new-page-error" role="alert">{{ error }}</p>
      <div class="new-page-actions">
        <RouterLink class="ghost" to="/compendium">Annuler</RouterLink>
        <button type="submit" class="primary" :disabled="busy">{{ busy ? "Création…" : "Créer et écrire" }}</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.new-page { width: min(1100px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 64px; }
.new-page-nav { margin-bottom: 16px; }
.new-page-nav a { color: #8fd3ff; }
.new-page-form { display: grid; gap: 16px; max-width: 560px; padding: 24px; border: 1px solid var(--c-line); border-radius: 8px; background: var(--c-night); }
.new-page-form h1 { margin: 0; font-size: 26px; }
.new-page-form p { margin: 0; color: var(--c-text-soft); line-height: 1.6; }
.new-page-form label { display: grid; gap: 8px; color: #bbcee0; font-size: 14px; }
.new-page-form :is(input, select) { min-height: 44px; padding: 10px 12px; border: 1px solid var(--c-line); border-radius: 6px; background: #07111e; color: var(--c-text); font-size: 15px; }
.new-page-error { color: #ffb6c1 !important; }
.new-page-actions { display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
.new-page-actions .primary { padding: 10px 16px; border: 1px solid var(--c-reality-soft); border-radius: 6px; background: var(--c-reality-soft); color: #05131e; }
.new-page-actions .ghost { color: var(--c-text-soft); }
</style>
