<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { api, ApiError } from "../lib/api";
import { createWikiLinker } from "../lib/wiki-linker";
import {
  WIKI_CASE_SENSITIVE_ALIASES,
  WIKI_EXPLICIT_TARGETS,
  WIKI_SEARCH_FALLBACKS,
  WIKI_STRICT_SURFACE_ALIASES
} from "../lib/wiki-data";

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
  manufacturers: CategoryCount[];
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
  manufacturer: string;
  edited: boolean;
  snippet: string;
};

type ArticleBlock = {
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

type LibraryCollection = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  articleIds: string[];
  items: SearchItem[];
};

type LibraryPayload = {
  favorites: string[];
  favoriteItems: SearchItem[];
  collections: LibraryCollection[];
};

type MediaRef = {
  src: string;
  alt?: string;
  caption?: string;
};

type WikiEntry = {
  id: string;
  title: string;
  category: string;
  dataset: string;
  group: string;
  subgroup: string;
  manufacturer: string;
  snippet: string;
  media?: string | MediaRef | null;
};

type CurrentUser = {
  id: string;
  displayName: string;
  role: "player" | "gm" | "editor" | "admin";
};

type Article = {
  id: string;
  title?: string;
  category?: string;
  dataset?: string;
  source?: string;
  status?: string;
  tags?: string[];
  manufacturer?: string;
  sections?: ArticleSection[];
  navigation?: {
    group?: string;
    subgroup?: string;
  };
  pnj?: Record<string, unknown>;
  image?: string | MediaRef;
  illustration?: string | MediaRef;
  gallery?: MediaRef[];
  __editorialOverride?: boolean;
  __wikiPublishedEdit?: boolean;
};

const route = useRoute();
const router = useRouter();

const meta = ref<Meta | null>(null);
const query = ref("");
const category = ref("");
const manufacturer = ref("");
const results = ref<SearchItem[]>([]);
const total = ref(0);
const selected = ref<Article | null>(null);
const loading = ref(false);
const articleLoading = ref(false);
const error = ref("");
const authenticationRequired = ref(false);
const favoriteIds = ref<string[]>([]);
const favoriteItems = ref<SearchItem[]>([]);
const collections = ref<LibraryCollection[]>([]);
const newCollectionName = ref("");
const libraryBusy = ref(false);
const libraryNotice = ref("");
const activeLibraryView = ref<"" | "favorites" | string>("");
const currentUser = ref<CurrentUser | null>(null);
const wikiReady = ref(false);
const wikiPreviewEl = ref<HTMLElement | null>(null);
const wikiPreview = ref({
  visible: false,
  id: "",
  title: "",
  category: "",
  context: "",
  snippet: "",
  mediaSrc: "",
  left: 12,
  top: 12,
  width: 360
});
let wikiLinker: any = null;
const wikiById = new Map<string, WikiEntry>();
let wikiPreviewTimer: number | undefined;
let wikiPreviewLink: HTMLAnchorElement | null = null;

const resultLabel = computed(() => {
  if (loading.value) return "Recherche…";
  return total.value === 1 ? "1 entrée" : `${total.value.toLocaleString("fr-FR")} entrées`;
});

const selectedIsFavorite = computed(() =>
  selected.value ? favoriteIds.value.includes(selected.value.id) : false
);

const canEdit = computed(() =>
  currentUser.value?.role === "editor" || currentUser.value?.role === "admin"
);

const selectedMedia = computed(() => primaryArticleMedia(selected.value));

const articleToc = computed(() =>
  (selected.value?.sections ?? [])
    .map((section, index) => ({
      id: sectionDomId(section, index),
      title: String(section.title ?? "").trim(),
      level: Number(section.level ?? 2)
    }))
    .filter((item) => item.title)
);

const relatedArticles = computed(() => {
  void wikiReady.value;
  const article = selected.value;
  if (!article || !wikiLinker) return [] as WikiEntry[];

  const ids = new Set<string>();
  const collect = (value: unknown) => {
    const html = wikiLinker.linkify(String(value ?? ""), wikiContext(article));
    for (const match of html.matchAll(/data-wiki-id="([^"]+)"/g)) {
      if (match[1] && match[1] !== article.id) ids.add(match[1]);
    }
  };

  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block?.type === "p") collect(block.text);
      if (block?.type === "table" && Array.isArray(block.rows)) {
        for (const row of block.rows) {
          if (Array.isArray(row)) for (const cell of row) collect(cell);
        }
      }
    }
  }

  return [...ids]
    .map((id) => wikiById.get(id))
    .filter((entry): entry is WikiEntry => Boolean(entry))
    .slice(0, 12);
});

function collectionContains(collection: LibraryCollection, articleId?: string): boolean {
  return Boolean(articleId && collection.articleIds.includes(articleId));
}

function normalizeMedia(value: unknown): MediaRef | null {
  if (typeof value === "string" && value.trim()) return { src: value.trim() };
  if (value && typeof value === "object") {
    const media = value as Record<string, unknown>;
    const src = String(media.src ?? "").trim();
    if (!src) return null;
    return {
      src,
      alt: String(media.alt ?? "").trim() || undefined,
      caption: String(media.caption ?? "").trim() || undefined
    };
  }
  return null;
}

function mediaUrl(value: unknown): string {
  const media = normalizeMedia(value);
  if (!media?.src) return "";
  const src = media.src.trim();
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/api/compendium/media/")) return src;
  const clean = src
    .replace(/^\/?compendium\//, "")
    .replace(/^\/+/, "");
  if (!clean.startsWith("images/") && !clean.startsWith("assets/")) return src;
  return `/api/compendium/media/${clean}`;
}

function primaryArticleMedia(article: Article | null): MediaRef | null {
  if (!article) return null;
  const direct = normalizeMedia(article.illustration ?? article.image);
  if (direct) return { ...direct, src: mediaUrl(direct) };

  const pnj = article.pnj as Record<string, unknown> | undefined;
  const portrait = normalizeMedia(
    pnj?.portrait
      ? {
          src: pnj.portrait,
          alt: pnj.portrait_alt ?? `Portrait de ${article.title ?? article.id}`,
          caption: pnj.portrait_caption ?? ""
        }
      : null
  );
  return portrait ? { ...portrait, src: mediaUrl(portrait) } : null;
}

function sectionDomId(section: ArticleSection, index: number): string {
  const raw = String(section.id ?? "").trim();
  if (raw) return `wiki-section-${raw.replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
  return `wiki-section-${index + 1}`;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character] ?? character);
}

function wikiContext(article: Article | null) {
  if (!article) return "";
  return {
    id: article.id,
    title: article.title ?? article.id,
    category: article.category ?? "",
    dataset: article.dataset ?? "",
    group: article.navigation?.group ?? "",
    subgroup: article.navigation?.subgroup ?? ""
  };
}

function linkifyText(value: unknown, article: Article | null = selected.value): string {
  void wikiReady.value;
  const text = String(value ?? "");
  const html = wikiLinker?.linkify(text, wikiContext(article)) ?? escapeHtml(text);
  return html
    .replace(/&#39;&#39;&#39;([^\n]+?)&#39;&#39;&#39;/g, "<strong>$1</strong>")
    .replace(/&#39;&#39;([^\n]+?)&#39;&#39;/g, "<em>$1</em>");
}

function humanError(cause: unknown): string {
  if (cause instanceof ApiError && cause.status === 401) {
    authenticationRequired.value = true;
    return "Connexion requise pour consulter le Compendium V2.";
  }
  if (cause instanceof ApiError && cause.message === "compendium_article_not_found") {
    return "Cette entrée du Compendium n’existe plus.";
  }
  if (cause instanceof ApiError && cause.message === "invalid_collection_name") {
    return "Le nom de la collection doit contenir entre 1 et 80 caractères.";
  }
  if (cause instanceof ApiError && cause.message === "collection_name_conflict") {
    return "Une collection porte déjà ce nom.";
  }
  if (cause instanceof ApiError && cause.message === "collection_not_found") {
    return "Cette collection n’existe plus.";
  }
  return "Le Compendium n’a pas pu être chargé.";
}

async function loadCurrentUser() {
  try {
    const payload = await api<{ user: CurrentUser }>("/api/auth/me");
    currentUser.value = payload.user;
  } catch {
    currentUser.value = null;
  }
}

async function loadMeta() {
  try {
    meta.value = await api<Meta>("/api/compendium/meta");
  } catch (cause) {
    error.value = humanError(cause);
  }
}

async function loadWikiIndex() {
  try {
    const payload = await api<{ entries: WikiEntry[] }>("/api/compendium/wiki-index");
    wikiById.clear();
    for (const entry of payload.entries) wikiById.set(entry.id, entry);

    wikiLinker = (createWikiLinker as any)(payload.entries, {
      explicitTargets: WIKI_EXPLICIT_TARGETS,
      strictSurfaceAliases: WIKI_STRICT_SURFACE_ALIASES,
      caseSensitiveAliases: WIKI_CASE_SENSITIVE_ALIASES,
      searchFallbacks: WIKI_SEARCH_FALLBACKS,
      hrefForId: (id: string) => `/compendium?article=${encodeURIComponent(id)}`,
      searchHref: (term: string) => `/compendium?q=${encodeURIComponent(term)}`
    });
    wikiReady.value = true;

    (window as any).__TUC_WIKI_V2__ = {
      ready: true,
      entries: payload.entries.length,
      stats: wikiLinker.stats,
      hasGarouTarget: wikiById.has("verite-047-11-garous-loups-descendants-de-khinae"),
      sanity: wikiLinker.linkify(
        "Les Garous croisent parfois des Vampires.",
        { id: "__wiki_sanity__", category: "Vérité", dataset: "verite", title: "Test" }
      )
    };
  } catch (cause) {
    console.warn("Index wiki indisponible.", cause);
    wikiReady.value = false;
    (window as any).__TUC_WIKI_V2__ = {
      ready: false,
      error: cause instanceof Error ? cause.message : String(cause)
    };
  }
}

async function loadLibrary() {
  try {
    const payload = await api<LibraryPayload>("/api/compendium/library");
    favoriteIds.value = payload.favorites;
    favoriteItems.value = payload.favoriteItems;
    collections.value = payload.collections;
    refreshActiveLibraryView();
  } catch (cause) {
    error.value = humanError(cause);
  }
}

function refreshActiveLibraryView() {
  if (activeLibraryView.value === "favorites") {
    results.value = favoriteItems.value;
    total.value = favoriteItems.value.length;
    return;
  }

  if (activeLibraryView.value) {
    const collection = collections.value.find((item) => item.id === activeLibraryView.value);
    if (!collection) {
      activeLibraryView.value = "";
      return;
    }
    results.value = collection.items;
    total.value = collection.items.length;
  }
}

function showFavorites() {
  activeLibraryView.value = "favorites";
  query.value = "";
  category.value = "";
  manufacturer.value = "";
  results.value = favoriteItems.value;
  total.value = favoriteItems.value.length;
}

function showCollection(collection: LibraryCollection) {
  activeLibraryView.value = collection.id;
  query.value = "";
  category.value = "";
  manufacturer.value = "";
  results.value = collection.items;
  total.value = collection.items.length;
}

async function toggleFavorite(articleId: string) {
  libraryBusy.value = true;
  libraryNotice.value = "";
  error.value = "";

  try {
    const favorite = favoriteIds.value.includes(articleId);
    await api(`/api/compendium/favorites/${encodeURIComponent(articleId)}`, {
      method: favorite ? "DELETE" : "PUT"
    });
    await loadLibrary();
    libraryNotice.value = favorite ? "Retiré des favoris." : "Ajouté aux favoris.";
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    libraryBusy.value = false;
  }
}

async function createCollection() {
  const name = newCollectionName.value.trim();
  if (!name) return;

  libraryBusy.value = true;
  libraryNotice.value = "";
  error.value = "";

  try {
    await api("/api/compendium/collections", {
      method: "POST",
      body: JSON.stringify({ name })
    });
    newCollectionName.value = "";
    await loadLibrary();
    libraryNotice.value = `Collection « ${name} » créée.`;
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    libraryBusy.value = false;
  }
}

async function renameCollection(collection: LibraryCollection) {
  const name = window.prompt("Nouveau nom de la collection :", collection.name)?.trim();
  if (!name || name === collection.name) return;

  libraryBusy.value = true;
  libraryNotice.value = "";
  error.value = "";

  try {
    await api(`/api/compendium/collections/${collection.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name })
    });
    await loadLibrary();
    libraryNotice.value = "Collection renommée.";
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    libraryBusy.value = false;
  }
}

async function deleteCollection(collection: LibraryCollection) {
  if (!window.confirm(`Supprimer la collection « ${collection.name} » ? Les articles du Compendium ne seront pas supprimés.`)) {
    return;
  }

  libraryBusy.value = true;
  libraryNotice.value = "";
  error.value = "";

  try {
    await api(`/api/compendium/collections/${collection.id}`, { method: "DELETE" });
    if (activeLibraryView.value === collection.id) {
      activeLibraryView.value = "";
      await search();
    }
    await loadLibrary();
    libraryNotice.value = "Collection supprimée.";
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    libraryBusy.value = false;
  }
}

async function toggleCollectionArticle(collection: LibraryCollection, articleId: string) {
  libraryBusy.value = true;
  libraryNotice.value = "";
  error.value = "";

  try {
    const included = collectionContains(collection, articleId);
    await api(
      `/api/compendium/collections/${collection.id}/articles/${encodeURIComponent(articleId)}`,
      { method: included ? "DELETE" : "PUT" }
    );
    await loadLibrary();
    libraryNotice.value = included
      ? `Retiré de « ${collection.name} ».`
      : `Ajouté à « ${collection.name} ».`;
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    libraryBusy.value = false;
  }
}

async function search() {
  activeLibraryView.value = "";
  loading.value = true;
  error.value = "";
  authenticationRequired.value = false;

  try {
    const params = new URLSearchParams();
    if (query.value.trim()) params.set("q", query.value.trim());
    if (category.value) params.set("category", category.value);
    if (manufacturer.value) params.set("manufacturer", manufacturer.value);
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

async function openArticle(id: string, syncRoute = true) {
  articleLoading.value = true;
  error.value = "";

  try {
    const result = await api<{ article: Article }>(
      `/api/compendium/articles/${encodeURIComponent(id)}`
    );
    selected.value = result.article;

    if (syncRoute && route.query.article !== id) {
      await router.push({
        path: "/compendium",
        query: { article: id }
      });
    }
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    articleLoading.value = false;
  }
}

async function chooseCategory(name: string) {
  category.value = category.value === name ? "" : name;
  if (category.value && category.value !== "Équipement & Objets") manufacturer.value = "";
  await search();
}

async function chooseManufacturer(name: string) {
  manufacturer.value = name;
  if (name) category.value = "Équipement & Objets";
  await search();
}

function closestWikiLink(event: Event): HTMLAnchorElement | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  return target.closest("a.wiki-link");
}

function hideWikiPreview() {
  if (wikiPreviewTimer !== undefined) window.clearTimeout(wikiPreviewTimer);
  wikiPreviewTimer = undefined;
  wikiPreviewLink = null;
  wikiPreview.value.visible = false;
}

async function positionWikiPreview(link: HTMLAnchorElement) {
  await nextTick();
  if (!wikiPreview.value.visible || !wikiPreviewEl.value) return;

  const rect = link.getBoundingClientRect();
  const pad = 12;
  const width = Math.min(420, window.innerWidth - pad * 2);
  const height = wikiPreviewEl.value.offsetHeight || 180;
  const left = Math.max(pad, Math.min(window.innerWidth - width - pad, rect.left));
  let top = rect.bottom + 10;
  if (top + height > window.innerHeight - pad) {
    top = Math.max(pad, rect.top - height - 10);
  }

  wikiPreview.value.left = left;
  wikiPreview.value.top = top;
  wikiPreview.value.width = width;
}

function showWikiPreview(link: HTMLAnchorElement) {
  const id = link.dataset.wikiId;
  if (!id) return;
  const entry = wikiById.get(id);
  if (!entry) return;

  wikiPreviewLink = link;
  wikiPreview.value = {
    visible: true,
    id,
    title: entry.title,
    category: entry.category || "Compendium",
    context: [entry.group, entry.subgroup].filter(Boolean).join(" · "),
    snippet: entry.snippet,
    mediaSrc: mediaUrl(entry.media),
    left: wikiPreview.value.left,
    top: wikiPreview.value.top,
    width: wikiPreview.value.width
  };
  void positionWikiPreview(link);
}

function handleWikiMouseover(event: MouseEvent) {
  const link = closestWikiLink(event);
  if (!link || link === wikiPreviewLink || !link.dataset.wikiId) return;
  if (wikiPreviewTimer !== undefined) window.clearTimeout(wikiPreviewTimer);
  wikiPreviewTimer = window.setTimeout(() => showWikiPreview(link), 120);
}

function handleWikiMouseout(event: MouseEvent) {
  const link = closestWikiLink(event);
  if (!link) return;
  const related = event.relatedTarget;
  if (!(related instanceof Node) || !link.contains(related)) hideWikiPreview();
}

function handleWikiFocusin(event: FocusEvent) {
  const link = closestWikiLink(event);
  if (link?.dataset.wikiId) showWikiPreview(link);
}

function handleWikiFocusout(event: FocusEvent) {
  if (closestWikiLink(event)) hideWikiPreview();
}

async function handleWikiClick(event: MouseEvent) {
  const link = closestWikiLink(event);
  if (!link) return;

  const id = link.dataset.wikiId;
  const searchTerm = link.dataset.wikiSearch;
  if (!id && !searchTerm) return;

  event.preventDefault();
  hideWikiPreview();

  if (id) {
    await openArticle(id);
    if (window.innerWidth < 940) {
      document.querySelector(".article-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  if (searchTerm) {
    query.value = searchTerm;
    await search();
  }
}

function repositionWikiPreview() {
  if (wikiPreviewLink) void positionWikiPreview(wikiPreviewLink);
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

watch(
  () => route.query.article,
  (value) => {
    const id = typeof value === "string" ? value : "";
    if (id && id !== selected.value?.id) {
      void openArticle(id, false);
    } else if (!id) {
      selected.value = null;
    }
  }
);

onMounted(async () => {
  if (typeof route.query.q === "string") query.value = route.query.q;

  await Promise.all([loadCurrentUser(), loadMeta(), loadLibrary(), loadWikiIndex(), search()]);

  if (typeof route.query.article === "string") {
    await openArticle(route.query.article, false);
  }

  window.addEventListener("scroll", repositionWikiPreview, { passive: true });
  window.addEventListener("resize", repositionWikiPreview);
});

onBeforeUnmount(() => {
  hideWikiPreview();
  window.removeEventListener("scroll", repositionWikiPreview);
  window.removeEventListener("resize", repositionWikiPreview);
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

      <div class="compendium-top-actions">
        <RouterLink v-if="canEdit" class="ghost compact-link wiki-create-link" to="/compendium/new">
          ＋ Nouvelle page
        </RouterLink>
        <RouterLink class="ghost compact-link" to="/">
          Retour à mon espace
        </RouterLink>
      </div>
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
      <div v-else-if="libraryNotice" class="feedback compendium-feedback">
        {{ libraryNotice }}
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
                <select
                  v-model="manufacturer"
                  aria-label="Fabricant ou marque"
                  @change="chooseManufacturer(manufacturer)"
                >
                  <option value="">Tous les fabricants</option>
                  <option
                    v-for="item in meta?.manufacturers || []"
                    :key="item.name"
                    :value="item.name"
                  >
                    {{ item.name }} · {{ item.count }}
                  </option>
                </select>
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

        <section class="panel library-panel">
          <div class="library-heading">
            <div>
              <p class="eyebrow">MA BIBLIOTHÈQUE</p>
              <h2>Favoris & collections</h2>
            </div>
            <button
              class="library-scope"
              :class="{ active: activeLibraryView === 'favorites' }"
              type="button"
              @click="showFavorites"
            >
              ★ Favoris · {{ favoriteIds.length }}
            </button>
          </div>

          <form class="collection-create" @submit.prevent="createCollection">
            <input
              v-model="newCollectionName"
              maxlength="80"
              placeholder="Nouvelle collection…"
              aria-label="Nom de la nouvelle collection"
            />
            <button class="secondary" :disabled="libraryBusy || !newCollectionName.trim()" type="submit">
              Créer
            </button>
          </form>

          <div v-if="collections.length" class="collection-list">
            <div
              v-for="collection in collections"
              :key="collection.id"
              class="collection-row"
              :class="{ active: activeLibraryView === collection.id }"
            >
              <button class="collection-open" type="button" @click="showCollection(collection)">
                <strong>{{ collection.name }}</strong>
                <small>{{ collection.articleIds.length }} article{{ collection.articleIds.length > 1 ? "s" : "" }}</small>
              </button>
              <button
                class="collection-action"
                type="button"
                title="Renommer"
                :disabled="libraryBusy"
                @click="renameCollection(collection)"
              >
                ✎
              </button>
              <button
                class="collection-action danger"
                type="button"
                title="Supprimer"
                :disabled="libraryBusy"
                @click="deleteCollection(collection)"
              >
                ×
              </button>
            </div>
          </div>
          <p v-else class="library-empty">
            Crée une collection pour préparer une campagne, une faction, un scénario ou une liste de références.
          </p>
        </section>

        <section class="compendium-workspace">
          <aside class="panel result-panel">
            <div class="result-heading">
              <div>
                <p class="eyebrow">
                  {{
                    activeLibraryView === "favorites"
                      ? "MES FAVORIS"
                      : activeLibraryView
                        ? collections.find(item => item.id === activeLibraryView)?.name || "MA COLLECTION"
                        : category || "TOUTES LES RUBRIQUES"
                  }}
                </p>
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
                  <template v-if="item.manufacturer"> · {{ item.manufacturer }}</template>
                </span>
                <strong>{{ item.title }}</strong>
                <p>{{ item.snippet }}</p>
                <div class="result-flags">
                  <small v-if="item.edited">Édition canonique appliquée</small>
                  <small v-if="favoriteIds.includes(item.id)">★ Favori</small>
                </div>
              </button>
            </div>

            <div v-else-if="!loading" class="empty-results">
              Aucune entrée ne correspond à cette recherche.
            </div>
          </aside>

          <article
            class="panel article-panel"
            @mouseover="handleWikiMouseover"
            @mouseout="handleWikiMouseout"
            @focusin="handleWikiFocusin"
            @focusout="handleWikiFocusout"
            @click="handleWikiClick"
          >
            <div v-if="articleLoading" class="article-placeholder">
              Chargement de l’entrée…
            </div>

            <template v-else-if="selected">
              <div class="wiki-article-grid">
                <div class="wiki-article-main">
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

                    <div class="wiki-title-line">
                      <h1>{{ selected.title }}</h1>
                      <RouterLink
                        v-if="canEdit"
                        class="wiki-edit-link"
                        :to="`/compendium/edit/${encodeURIComponent(selected.id)}`"
                      >
                        ✎ Modifier
                      </RouterLink>
                    </div>

                    <div class="article-meta">
                      <span v-if="selected.status">{{ selected.status }}</span>
                      <span v-if="selected.source">{{ selected.source }}</span>
                      <button
                        v-if="selected.manufacturer"
                        class="manufacturer-badge"
                        type="button"
                        @click="chooseManufacturer(selected.manufacturer)"
                      >
                        Fabricant · {{ selected.manufacturer }}
                      </button>
                      <span v-if="selected.__editorialOverride">Override canonique</span>
                      <span v-if="selected.__wikiPublishedEdit">Édition wiki publiée</span>
                    </div>

                    <div class="article-library-actions">
                      <button
                        class="favorite-button"
                        :class="{ active: selectedIsFavorite }"
                        type="button"
                        :disabled="libraryBusy"
                        @click="toggleFavorite(selected.id)"
                      >
                        {{ selectedIsFavorite ? "★ Retirer des favoris" : "☆ Ajouter aux favoris" }}
                      </button>

                      <button
                        v-for="collection in collections"
                        :key="collection.id"
                        class="collection-toggle"
                        :class="{ active: collectionContains(collection, selected.id) }"
                        type="button"
                        :disabled="libraryBusy"
                        @click="toggleCollectionArticle(collection, selected.id)"
                      >
                        {{ collectionContains(collection, selected.id) ? "✓" : "+" }}
                        {{ collection.name }}
                      </button>
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
                    :id="sectionDomId(section, sectionIndex)"
                    :key="section.id || sectionIndex"
                    class="article-section"
                  >
                    <details v-if="section.audience === 'mj'" class="mj-section">
                      <summary>{{ section.title || "Informations MJ" }}</summary>
                      <div class="mj-content">
                        <component :is="sectionHeadingLevel(section)" v-if="section.title">
                          {{ section.title }}
                        </component>

                        <template v-for="(block, blockIndex) in section.blocks || []" :key="blockIndex">
                          <p
                            v-if="block.type === 'p'"
                            :class="['article-paragraph', String(block.style || '')]"
                            v-html="linkifyText(blockText(block), selected)"
                          ></p>
                          <div v-else-if="block.type === 'table'" class="article-table-wrap">
                            <table class="article-table">
                              <tbody>
                                <tr v-for="(row, rowIndex) in tableRows(block)" :key="rowIndex">
                                  <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                                    <span v-html="linkifyText(formatCell(cell), selected)"></span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </template>
                      </div>
                    </details>

                    <template v-else>
                      <component :is="sectionHeadingLevel(section)" v-if="section.title">
                        {{ section.title }}
                      </component>

                      <template v-for="(block, blockIndex) in section.blocks || []" :key="blockIndex">
                        <p
                          v-if="block.type === 'p'"
                          :class="['article-paragraph', String(block.style || '')]"
                          v-html="linkifyText(blockText(block), selected)"
                        ></p>
                        <div v-else-if="block.type === 'table'" class="article-table-wrap">
                          <table class="article-table">
                            <tbody>
                              <tr v-for="(row, rowIndex) in tableRows(block)" :key="rowIndex">
                                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                                  <span v-html="linkifyText(formatCell(cell), selected)"></span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </template>
                    </template>
                  </section>

                  <section v-if="relatedArticles.length" class="wiki-see-also">
                    <p class="eyebrow">LIENS DU WIKI</p>
                    <h2>Voir aussi</h2>
                    <div class="wiki-related-grid">
                      <button
                        v-for="entry in relatedArticles"
                        :key="entry.id"
                        type="button"
                        @click="openArticle(entry.id)"
                      >
                        <span>{{ entry.category }}</span>
                        <strong>{{ entry.title }}</strong>
                        <small>{{ entry.snippet }}</small>
                      </button>
                    </div>
                  </section>
                </div>

                <aside class="wiki-infobox">
                  <figure v-if="selectedMedia" class="wiki-media">
                    <img
                      :src="selectedMedia.src"
                      :alt="selectedMedia.alt || selected.title || selected.id"
                      loading="lazy"
                    />
                    <figcaption v-if="selectedMedia.caption">{{ selectedMedia.caption }}</figcaption>
                  </figure>

                  <div class="wiki-infobox-card">
                    <p class="eyebrow">FICHE</p>
                    <dl>
                      <template v-if="selected.category">
                        <dt>Rubrique</dt><dd>{{ selected.category }}</dd>
                      </template>
                      <template v-if="selected.navigation?.group">
                        <dt>Groupe</dt><dd>{{ selected.navigation.group }}</dd>
                      </template>
                      <template v-if="selected.navigation?.subgroup">
                        <dt>Sous-groupe</dt><dd>{{ selected.navigation.subgroup }}</dd>
                      </template>
                      <template v-if="selected.manufacturer">
                        <dt>Fabricant</dt><dd>{{ selected.manufacturer }}</dd>
                      </template>
                    </dl>
                  </div>

                  <nav v-if="articleToc.length" class="wiki-toc" aria-label="Sommaire de l'article">
                    <p class="eyebrow">SOMMAIRE</p>
                    <button
                      v-for="item in articleToc"
                      :key="item.id"
                      type="button"
                      :class="`level-${item.level}`"
                      @click="scrollToSection(item.id)"
                    >
                      {{ item.title }}
                    </button>
                  </nav>

                  <div v-if="selected.gallery?.length" class="wiki-gallery">
                    <p class="eyebrow">GALERIE</p>
                    <figure v-for="media in selected.gallery" :key="media.src">
                      <img :src="mediaUrl(media)" :alt="media.alt || selected.title || selected.id" loading="lazy" />
                      <figcaption v-if="media.caption">{{ media.caption }}</figcaption>
                    </figure>
                  </div>
                </aside>
              </div>
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

      <div
        v-if="wikiPreview.visible"
        ref="wikiPreviewEl"
        class="wiki-hover-preview"
        role="tooltip"
        :style="{
          left: wikiPreview.left + 'px',
          top: wikiPreview.top + 'px',
          width: wikiPreview.width + 'px'
        }"
      >
        <img
          v-if="wikiPreview.mediaSrc"
          class="wiki-hover-image"
          :src="wikiPreview.mediaSrc"
          :alt="wikiPreview.title"
        />
        <div class="wiki-hover-kicker">{{ wikiPreview.category }}</div>
        <strong>{{ wikiPreview.title }}</strong>
        <small v-if="wikiPreview.context">{{ wikiPreview.context }}</small>
        <p>{{ wikiPreview.snippet }}</p>
        <span>Cliquer pour ouvrir l’article →</span>
      </div>
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

.compendium-top-actions {
  display: flex;
  align-items: center;
  gap: .6rem;
}

.wiki-create-link {
  border-color: rgba(157, 124, 72, .45) !important;
  color: #dcc48f !important;
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
  grid-template-columns: minmax(0, 1fr) minmax(190px, 260px) auto;
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

.library-panel {
  margin-bottom: 1rem;
  padding: 1rem;
}

.library-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.library-heading h2 {
  margin: 0;
  font: 500 1.45rem/1.2 Georgia, serif;
}

.library-scope {
  min-height: 38px;
  padding: .45rem .7rem;
  border: 1px solid rgba(255, 255, 255, .11);
  color: #bdb5a8;
  background: transparent;
}

.library-scope.active,
.favorite-button.active,
.collection-toggle.active {
  border-color: #9d7c48;
  color: #e1c995;
  background: rgba(157, 124, 72, .11);
}

.collection-create {
  grid-template-columns: minmax(0, 1fr) auto;
  margin-top: 1rem;
}

.collection-list {
  display: flex;
  flex-wrap: wrap;
  gap: .55rem;
  margin-top: .8rem;
}

.collection-row {
  display: grid;
  grid-template-columns: auto 34px 34px;
  align-items: stretch;
  border: 1px solid rgba(255, 255, 255, .09);
}

.collection-row.active {
  border-color: #806a48;
}

.collection-open,
.collection-action {
  border: 0;
  background: transparent;
  color: #bdb5a8;
}

.collection-open {
  display: grid;
  gap: .1rem;
  padding: .45rem .65rem;
  text-align: left;
}

.collection-open small {
  color: #777169;
}

.collection-action {
  border-left: 1px solid rgba(255, 255, 255, .08);
}

.collection-action.danger {
  color: #c99088;
}

.library-empty {
  margin: .8rem 0 0;
  color: #777169;
  font-size: .82rem;
}

.article-library-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  margin-top: .75rem;
}

.favorite-button,
.collection-toggle {
  min-height: 34px;
  padding: .35rem .55rem;
  border: 1px solid rgba(255, 255, 255, .10);
  color: #a9a195;
  background: transparent;
  font-size: .72rem;
}

.result-flags {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
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

.wiki-article-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: start;
}

.wiki-article-main {
  min-width: 0;
}

.wiki-title-line {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.wiki-title-line h1 {
  flex: 1;
}

.wiki-edit-link {
  flex: 0 0 auto;
  margin-top: .8rem;
  padding: .5rem .7rem;
  border: 1px solid rgba(216, 189, 133, .30);
  color: #d8bd85;
  text-decoration: none;
  font-size: .76rem;
}

.wiki-infobox {
  position: sticky;
  top: 96px;
  display: grid;
  gap: .8rem;
}

.wiki-media,
.wiki-gallery figure {
  margin: 0;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.025);
}

.wiki-media img,
.wiki-gallery img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 420px;
  object-fit: contain;
  background: rgba(0,0,0,.20);
}

.wiki-media figcaption,
.wiki-gallery figcaption {
  padding: .55rem .65rem;
  color: #8f897f;
  font-size: .72rem;
  line-height: 1.4;
}

.wiki-infobox-card,
.wiki-toc,
.wiki-gallery {
  padding: .85rem;
  border: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.018);
}

.wiki-infobox-card dl {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: .45rem .7rem;
  margin: .65rem 0 0;
}

.wiki-infobox-card dt {
  color: #79736a;
  font-size: .7rem;
}

.wiki-infobox-card dd {
  margin: 0;
  color: #c6beb0;
  font-size: .76rem;
}

.wiki-toc {
  display: grid;
  gap: .15rem;
}

.wiki-toc button {
  padding: .35rem .2rem;
  border: 0;
  color: #aaa397;
  background: transparent;
  text-align: left;
  font-size: .78rem;
}

.wiki-toc button:hover {
  color: #e1c995;
}

.wiki-toc button.level-3 { padding-left: .8rem; }
.wiki-toc button.level-4 { padding-left: 1.4rem; }

.wiki-gallery {
  display: grid;
  gap: .65rem;
}

.wiki-see-also {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,.09);
}

.wiki-see-also h2 {
  margin: .2rem 0 1rem;
  font: 500 1.65rem/1.2 Georgia, serif;
}

.wiki-related-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .6rem;
}

.wiki-related-grid button {
  display: grid;
  gap: .28rem;
  padding: .8rem;
  border: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.018);
  color: #c7bfb2;
  text-align: left;
}

.wiki-related-grid button:hover {
  border-color: rgba(216,189,133,.35);
  background: rgba(157,124,72,.08);
}

.wiki-related-grid span {
  color: #9c8156;
  font-size: .65rem;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.wiki-related-grid strong {
  font-family: Georgia, serif;
  font-weight: 500;
}

.wiki-related-grid small {
  color: #817b72;
  line-height: 1.35;
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
.article-meta button,
.article-tags button {
  padding: .3rem .5rem;
  border: 1px solid rgba(255, 255, 255, .10);
  color: #a9a195;
  background: transparent;
  font-size: .72rem;
}

.manufacturer-badge {
  cursor: pointer;
  border-color: rgba(140, 120, 201, .42) !important;
  color: #d7c7ff !important;
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

:deep(.wiki-link) {
  color: #d8bd85;
  text-decoration: underline;
  text-decoration-color: rgba(216, 189, 133, .45);
  text-decoration-thickness: 1px;
  text-underline-offset: .18em;
  cursor: pointer;
}

:deep(.wiki-link:hover),
:deep(.wiki-link:focus-visible) {
  color: #f0d9a8;
  text-decoration-color: currentColor;
  outline: none;
}

.wiki-hover-preview {
  position: fixed;
  z-index: 80;
  display: grid;
  gap: .45rem;
  padding: 1rem 1.05rem;
  border: 1px solid rgba(216, 189, 133, .34);
  background: rgba(16, 15, 13, .98);
  box-shadow: 0 18px 60px rgba(0, 0, 0, .48);
  pointer-events: none;
}

.wiki-hover-image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  margin-bottom: .25rem;
  border: 1px solid rgba(255,255,255,.08);
}

.wiki-hover-preview strong {
  color: #eee7da;
  font: 500 1.15rem/1.2 Georgia, serif;
}

.wiki-hover-preview small {
  color: #8f897f;
}

.wiki-hover-preview p {
  margin: 0;
  color: #bbb3a6;
  font-size: .84rem;
  line-height: 1.55;
}

.wiki-hover-preview > span {
  color: #c7ad78;
  font-size: .72rem;
}

.wiki-hover-kicker {
  color: #c7ad78;
  font-size: .68rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}

@media (max-width: 940px) {
  .compendium-hero,
  .compendium-workspace {
    grid-template-columns: 1fr;
  }

  .wiki-article-grid {
    grid-template-columns: 1fr;
  }

  .wiki-infobox {
    position: static;
    order: -1;
  }

  .wiki-media img {
    max-height: 520px;
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

  .search-line,
  .collection-create {
    grid-template-columns: 1fr;
  }

  .library-heading {
    align-items: stretch;
    flex-direction: column;
  }

  .compendium-page {
    width: min(100% - 1rem, 1480px);
  }
}
</style>
