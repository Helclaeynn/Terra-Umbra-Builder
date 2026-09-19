<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { api, ApiError } from "../lib/api";

type CategoryCount = {
  name: string;
  count: number;
};

type Meta = {
  version: number;
  generated: string | null;
  total: number;
  expectedTotal: number | null;
  categories: CategoryCount[];
  overrides: {
    applied: number;
    conflicts: number;
    missing: number;
  };
};

type SearchItem = {
  id: string;
  title: string;
  category: string;
  dataset: string;
  source: string;
  status: string;
  group: string;
  subgroup: string;
  tags: string[];
  edited: boolean;
  snippet: string;
};

type ParagraphBlock = {
  type: "p";
  text?: string;
  style?: string;
};

type TableBlock = {
  type: "table";
  rows?: unknown[][];
};

type ArticleBlock = ParagraphBlock | TableBlock | {
  type?: string;
  text?: unknown;
  style?: unknown;
  rows?: unknown[][];
};

type ArticleSection = {
  id?: string;
  title?: string;
  level?: number;
  audience?: string;
  status?: string;
  blocks?: ArticleBlock[];
};

type Article = {
  id: string;
  title?: string;
  category?: string;
  source?: string;
  status?: string;
  tags?: string[];
  sections?: ArticleSection[];
  navigation?: {
    group?: string;
    subgroup?: string;
  };
  pnj?: Record<string, unknown>;
  __editorialOverride?: boolean;
};

const meta = ref<Meta | null>(null);
const query = ref("");
const category = ref("");
const results = ref<SearchItem[]>([]);
const total = ref(0);
const selected = ref<Article | null>(null);
const loading = ref(false);
const articleLoading = ref(false);
const error = ref("");
const authenticationRequired = ref(false);

const resultLabel = computed(() => {
  if (loading.value) return "Recherche…";
  return total.value === 1 ? "1 entrée" : `${total.value.toLocaleString("fr-FR")} entrées`;
});

function humanError(cause: unknown): string {
  if (cause instanceof ApiError && cause.status === 401) {
    authenticationRequired.value = true;
    return "Connexion requise pour consulter le Compendium V2.";
  }
  if (cause instanceof ApiError && cause.message === "compendium_article_not_found") {
    return "Cette entrée du Compendium n’existe plus.";
  }
  return "Le Compendium n’a pas pu être chargé.";
}

async function loadMeta() {
  try {
    meta.value = await api<Meta>("/api/compendium/meta");
  } catch (cause) {
    error.value = humanError(cause);
  }
}

async function search() {
  loading.value = true;
  error.value = "";
  authenticationRequired.value = false;

  try {
    const params = new URLSearchParams();
    if (query.value.trim()) params.set("q", query.value.trim());
    if (category.value) params.set("category", category.value);
    params.set("limit", "60");

    const result = await api<{
      total: number;
      items: SearchItem[];
    }>(`/api/compendium/search?${params.toString()}`);

    results.value = result.items;
    total.value = result.total;

    if (selected.value && !result.items.some((item) => item.id === selected.value?.id)) {
      selected.value = null;
    }
  } catch (cause) {
    results.value = [];
    total.value = 0;
    error.value = humanError(cause);
  } finally {
    loading.value = false;
  }
}

async function openArticle(id: string) {
  articleLoading.value = true;
  error.value = "";

  try {
    const result = await api<{ article: Article }>(
      `/api/compendium/articles/${encodeURIComponent(id)}`
    );
    selected.value = result.article;
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    articleLoading.value = false;
  }
}

async function chooseCategory(name: string) {
  category.value = category.value === name ? "" : name;
  await search();
}

function blockText(block: ArticleBlock): string {
  if (block && block.type === "p" && "text" in block) return String(block.text ?? "");
  return "";
}

function tableRows(block: ArticleBlock): unknown[][] {
  if (block && block.type === "table" && "rows" in block && Array.isArray(block.rows)) {
    return block.rows;
  }
  return [];
}

function formatCell(value: unknown): string {
  return String(value ?? "");
}

function sectionHeadingLevel(section: ArticleSection): "h2" | "h3" | "h4" {
  const level = Number(section.level ?? 2);
  if (level >= 4) return "h4";
  if (level === 3) return "h3";
  return "h2";
}

onMounted(async () => {
  await Promise.all([loadMeta(), search()]);
});
</script>

<template>
  <div class="compendium-shell">
    <header class="compendium-topbar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">TU</span>
        <span>
          <strong>Terra Umbra</strong>
          <small>California · Compendium V2</small>
        </span>
      </RouterLink>

      <RouterLink class="ghost compact-link" to="/">
        Retour à mon espace
      </RouterLink>
    </header>

    <main class="compendium-page">
      <section class="compendium-hero">
        <div>
          <p class="eyebrow">CORPUS NATIF V2</p>
          <h1>Compendium</h1>
          <p>
            Consultation du corpus V3 consolidé par l’API Terra Umbra. La recherche
            s’effectue côté serveur sur les titres, tags, groupes et contenu des articles.
          </p>
        </div>

        <div v-if="meta" class="compendium-stats panel">
          <strong>{{ meta.total.toLocaleString("fr-FR") }}</strong>
          <span>entrées chargées</span>
          <small>
            Corpus V{{ meta.version }}
            <template v-if="meta.generated"> · {{ meta.generated }}</template>
          </small>
        </div>
      </section>

      <div v-if="error" class="feedback error compendium-feedback">
        {{ error }}
        <RouterLink v-if="authenticationRequired" to="/">Se connecter</RouterLink>
      </div>

      <template v-if="!authenticationRequired">
        <section class="panel compendium-search">
          <form @submit.prevent="search">
            <label>
              Recherche globale
              <div class="search-line">
                <input
                  v-model="query"
                  type="search"
                  placeholder="Nom, faction, règle, équipement, créature…"
                  autocomplete="off"
                />
                <button class="primary" :disabled="loading" type="submit">
                  Rechercher
                </button>
              </div>
            </label>
          </form>

          <div v-if="meta" class="category-strip" aria-label="Rubriques du Compendium">
            <button
              v-for="item in meta.categories"
              :key="item.name"
              class="category-chip"
              :class="{ active: category === item.name }"
              type="button"
              @click="chooseCategory(item.name)"
            >
              <span>{{ item.name }}</span>
              <small>{{ item.count }}</small>
            </button>
          </div>
        </section>

        <section class="compendium-workspace">
          <aside class="panel result-panel">
            <div class="result-heading">
              <div>
                <p class="eyebrow">{{ category || "TOUTES LES RUBRIQUES" }}</p>
                <h2>Résultats</h2>
              </div>
              <span>{{ resultLabel }}</span>
            </div>

            <div v-if="results.length" class="result-list">
              <button
                v-for="item in results"
                :key="item.id"
                class="result-card"
                :class="{ active: selected?.id === item.id }"
                type="button"
                @click="openArticle(item.id)"
              >
                <span class="result-meta">
                  {{ item.category }}
                  <template v-if="item.subgroup"> · {{ item.subgroup }}</template>
                </span>
                <strong>{{ item.title }}</strong>
                <p>{{ item.snippet }}</p>
                <small v-if="item.edited">Édition canonique appliquée</small>
              </button>
            </div>

            <div v-else-if="!loading" class="empty-results">
              Aucune entrée ne correspond à cette recherche.
            </div>
          </aside>

          <article class="panel article-panel">
            <div v-if="articleLoading" class="article-placeholder">
              Chargement de l’entrée…
            </div>

            <template v-else-if="selected">
              <header class="article-header">
                <div class="article-breadcrumb">
                  <span>{{ selected.category }}</span>
                  <template v-if="selected.navigation?.group">
                    <span>›</span>
                    <span>{{ selected.navigation.group }}</span>
                  </template>
                  <template v-if="selected.navigation?.subgroup">
                    <span>›</span>
                    <span>{{ selected.navigation.subgroup }}</span>
                  </template>
                </div>

                <h1>{{ selected.title }}</h1>

                <div class="article-meta">
                  <span v-if="selected.status">{{ selected.status }}</span>
                  <span v-if="selected.source">{{ selected.source }}</span>
                  <span v-if="selected.__editorialOverride">Édité</span>
                </div>

                <div v-if="selected.tags?.length" class="article-tags">
                  <button
                    v-for="tag in selected.tags.slice(0, 12)"
                    :key="tag"
                    type="button"
                    @click="query = tag; search()"
                  >
                    {{ tag }}
                  </button>
                </div>
              </header>

              <section
                v-for="(section, sectionIndex) in selected.sections || []"
                :key="section.id || sectionIndex"
                class="article-section"
              >
                <details v-if="section.audience === 'mj'" class="mj-section">
                  <summary>{{ section.title || "Informations MJ" }}</summary>
                  <div class="mj-content">
                    <component
                      :is="sectionHeadingLevel(section)"
                      v-if="section.title"
                    >
                      {{ section.title }}
                    </component>

                    <template v-for="(block, blockIndex) in section.blocks || []" :key="blockIndex">
                      <p
                        v-if="block.type === 'p'"
                        :class="['article-paragraph', String(block.style || '')]"
                      >
                        {{ blockText(block) }}
                      </p>
                      <div v-else-if="block.type === 'table'" class="article-table-wrap">
                        <table class="article-table">
                          <tbody>
                            <tr v-for="(row, rowIndex) in tableRows(block)" :key="rowIndex">
                              <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                                {{ formatCell(cell) }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </template>
                  </div>
                </details>

                <template v-else>
                  <component
                    :is="sectionHeadingLevel(section)"
                    v-if="section.title"
                  >
                    {{ section.title }}
                  </component>

                  <template v-for="(block, blockIndex) in section.blocks || []" :key="blockIndex">
                    <p
                      v-if="block.type === 'p'"
                      :class="['article-paragraph', String(block.style || '')]"
                    >
                      {{ blockText(block) }}
                    </p>
                    <div v-else-if="block.type === 'table'" class="article-table-wrap">
                      <table class="article-table">
                        <tbody>
                          <tr v-for="(row, rowIndex) in tableRows(block)" :key="rowIndex">
                            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                              {{ formatCell(cell) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </template>
                </template>
              </section>
            </template>

            <div v-else class="article-placeholder">
              <p class="eyebrow">LECTURE</p>
              <h2>Sélectionne une entrée</h2>
              <p>
                Utilise la recherche ou les rubriques à gauche, puis ouvre une entrée
                pour afficher son contenu complet.
              </p>
            </div>
          </article>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.compendium-shell {
  min-height: 100vh;
}

.compendium-topbar {
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 clamp(1rem, 5vw, 4rem);
  border-bottom: 1px solid rgba(226, 206, 164, .13);
  background: rgba(13, 12, 10, .94);
  position: sticky;
  top: 0;
  z-index: 20;
}

.compact-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.compendium-page {
  width: min(1480px, calc(100% - 2rem));
  margin: 0 auto;
  padding: clamp(2rem, 4vw, 4rem) 0 5rem;
}

.compendium-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 2rem;
  margin-bottom: 2rem;
}

.compendium-hero h1 {
  margin: .2rem 0 .7rem;
  font: 500 clamp(2.8rem, 7vw, 5.6rem)/1 Georgia, serif;
}

.compendium-hero p:not(.eyebrow) {
  max-width: 72ch;
  margin: 0;
  color: #aaa397;
  line-height: 1.65;
}

.compendium-stats {
  min-width: 180px;
  padding: 1rem 1.2rem;
  display: grid;
}

.compendium-stats strong {
  color: #d8bd85;
  font: 500 2rem/1 Georgia, serif;
}

.compendium-stats span,
.compendium-stats small {
  color: #9e978b;
}

.compendium-feedback {
  margin-bottom: 1rem;
}

.compendium-feedback a {
  margin-left: .5rem;
  color: inherit;
}

.compendium-search {
  padding: 1rem;
  margin-bottom: 1rem;
}

.search-line {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .7rem;
}

.category-strip {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin-top: 1rem;
}

.category-chip {
  display: inline-flex;
  gap: .55rem;
  align-items: center;
  min-height: 36px;
  padding: .45rem .7rem;
  border: 1px solid rgba(255, 255, 255, .11);
  background: transparent;
  color: #bdb5a8;
}

.category-chip small {
  color: #777169;
}

.category-chip.active {
  border-color: #9d7c48;
  color: #e1c995;
  background: rgba(157, 124, 72, .11);
}

.compendium-workspace {
  display: grid;
  grid-template-columns: minmax(300px, 410px) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.result-panel {
  max-height: calc(100vh - 110px);
  overflow: hidden;
  position: sticky;
  top: 90px;
}

.result-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, .08);
}

.result-heading h2 {
  margin: 0;
  font: 500 1.45rem/1.2 Georgia, serif;
}

.result-heading > span {
  color: #8d887f;
  font-size: .78rem;
}

.result-list {
  max-height: calc(100vh - 205px);
  overflow-y: auto;
}

.result-card {
  width: 100%;
  display: grid;
  gap: .42rem;
  padding: 1rem;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, .07);
  text-align: left;
  color: #d6cfc2;
  background: transparent;
}

.result-card:hover,
.result-card.active {
  background: rgba(157, 124, 72, .10);
}

.result-card.active {
  box-shadow: inset 3px 0 #9d7c48;
}

.result-card strong {
  font-family: Georgia, serif;
  font-size: 1.05rem;
}

.result-card p {
  margin: 0;
  color: #8f897f;
  font-size: .8rem;
  line-height: 1.45;
}

.result-meta,
.result-card small {
  color: #a88e60;
  font-size: .68rem;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.empty-results {
  padding: 2rem 1rem;
  color: #827c72;
}

.article-panel {
  min-height: 620px;
  padding: clamp(1.25rem, 3vw, 2.5rem);
}

.article-header {
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, .09);
}

.article-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
  color: #8d887f;
  font-size: .75rem;
}

.article-header h1 {
  margin: .65rem 0 .9rem;
  font: 500 clamp(2rem, 4vw, 3.4rem)/1.06 Georgia, serif;
}

.article-meta,
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
}

.article-meta span,
.article-tags button {
  padding: .3rem .5rem;
  border: 1px solid rgba(255, 255, 255, .10);
  color: #a9a195;
  background: transparent;
  font-size: .72rem;
}

.article-tags {
  margin-top: .7rem;
}

.article-tags button {
  cursor: pointer;
}

.article-section {
  margin: 1.8rem 0;
}

.article-section h2,
.article-section h3,
.article-section h4 {
  font-family: Georgia, serif;
  font-weight: 500;
  color: #e3d9c7;
}

.article-section h2 {
  margin-top: 2rem;
  font-size: 1.65rem;
}

.article-paragraph {
  color: #c2bbaf;
  line-height: 1.72;
  white-space: pre-line;
}

.article-paragraph.lore {
  color: #cfc3ad;
}

.article-paragraph.list {
  padding-left: 1rem;
  border-left: 2px solid rgba(157, 124, 72, .35);
}

.article-table-wrap {
  overflow-x: auto;
  margin: 1rem 0;
}

.article-table {
  width: 100%;
  border-collapse: collapse;
}

.article-table td {
  padding: .6rem .7rem;
  border: 1px solid rgba(255, 255, 255, .09);
  color: #bbb3a6;
  vertical-align: top;
}

.mj-section {
  padding: 1rem;
  border: 1px solid rgba(155, 112, 88, .3);
  background: rgba(84, 43, 30, .08);
}

.mj-section summary {
  cursor: pointer;
  color: #ca9d86;
  font-family: Georgia, serif;
  font-size: 1.1rem;
}

.mj-content {
  margin-top: 1rem;
}

.article-placeholder {
  min-height: 520px;
  display: grid;
  place-content: center;
  max-width: 55ch;
  margin: 0 auto;
  color: #8f897f;
  text-align: center;
}

.article-placeholder h2 {
  margin: .2rem 0 .7rem;
  color: #d8d0c2;
  font-family: Georgia, serif;
  font-weight: 500;
}

@media (max-width: 940px) {
  .compendium-hero,
  .compendium-workspace {
    grid-template-columns: 1fr;
  }

  .compendium-stats {
    width: max-content;
  }

  .result-panel {
    position: static;
    max-height: none;
  }

  .result-list {
    max-height: 430px;
  }
}

@media (max-width: 620px) {
  .compendium-topbar {
    align-items: center;
    padding: .8rem 1rem;
  }

  .compendium-topbar .brand small {
    display: none;
  }

  .search-line {
    grid-template-columns: 1fr;
  }

  .compendium-page {
    width: min(100% - 1rem, 1480px);
  }
}
</style>
