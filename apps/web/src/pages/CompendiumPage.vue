<script setup lang="ts">
import TerraUmbraLockup from "../components/TerraUmbraLockup.vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { api, ApiError } from "../lib/api";
import CompendiumOnboarding from "../components/CompendiumOnboarding.vue";
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
  archivedTotal?: number;
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

type TalentRegistryRow = {
  talentId: string;
  natureId: string;
  groupId: string;
  groupLabel: string;
  name: string;
  lore: string;
  mechanics: string;
  cost: number;
  access: string;
  prerequisiteId?: string;
  prerequisiteName?: string;
};

type LibraryCollection = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  articleIds: string[];
  items: SearchItem[];
};

type RecentItem = SearchItem & {
  viewedAt?: string;
  viewCount?: number;
};

type LibraryPayload = {
  favorites: string[];
  favoriteItems: SearchItem[];
  collections: LibraryCollection[];
  recentItems: RecentItem[];
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
  snippet?: string;
  media?: string | MediaRef | null;
};

type CurrentUser = {
  id: string;
  displayName: string;
  role: "player" | "gm" | "editor" | "admin";
};

type BuilderUsage = {
  kind: string;
  label: string;
  step: "origin" | "sphere" | "talents" | "truth" | "disadvantages" | "equipment";
  detail?: string;
};

type BuilderSourceRecord = {
  key: string;
  family: string;
  kind: string;
  label: string;
  category: string;
  step: string;
  compendiumId?: string | null;
  mechanics: Record<string, unknown>;
};

type OnboardingItem = {
  id: string;
  label: string;
  summary: string;
};

type OnboardingNature = {
  label: string;
  summary: string;
  rulesId?: string;
  loreId?: string;
  note?: string;
};

type OnboardingData = {
  basics: OnboardingItem[];
  natures: OnboardingNature[];
  restricted: OnboardingNature[];
  loreHubs: OnboardingItem[];
  categories: Array<{ label: string; category: string; summary: string }>;
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
  legacyCategory?: string;
  __legacy?: boolean;
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
const suggestions = ref<SearchItem[]>([]);
const suggestionLoading = ref(false);
const searchFocused = ref(false);
const suggestionIndex = ref(-1);
let suggestionTimer: number | undefined;
let suggestionRequest = 0;
const selected = ref<Article | null>(null);
const builderUsage = ref<BuilderUsage[]>([]);
const builderSources = ref<BuilderSourceRecord[]>([]);
const talentEmbeds = ref<Record<string, TalentRegistryRow[]>>({});
const loading = ref(false);
const articleLoading = ref(false);
const error = ref("");
const onboarding = ref<OnboardingData | null>(null);
const showOnboarding = ref(false);
const favoriteIds = ref<string[]>([]);
const favoriteItems = ref<SearchItem[]>([]);
const recentItems = ref<RecentItem[]>([]);
const collections = ref<LibraryCollection[]>([]);
const newCollectionName = ref("");
const libraryBusy = ref(false);
const libraryNotice = ref("");
const activeLibraryView = ref<"" | "favorites" | "recent" | string>("");
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
const wikiPreviewCache = new Map<string, { snippet: string; media?: string | MediaRef | null }>();
let wikiPreviewTimer: number | undefined;
let wikiBootstrapTimer: number | undefined;
let wikiPreviewLink: HTMLAnchorElement | null = null;

const RECENT_STORAGE_KEY = "tuc-compendium-recent-v1";
const RECENT_LOCAL_LIMIT = 30;

const resultLabel = computed(() => {
  if (loading.value) return "Recherche…";
  return total.value === 1 ? "1 entrée" : `${total.value.toLocaleString("fr-FR")} entrées`;
});

const suggestionsVisible = computed(() =>
  searchFocused.value &&
  query.value.trim().length >= 2 &&
  (suggestionLoading.value || suggestions.value.length > 0)
);

const resultGroups = computed(() => {
  const groups = new Map<string, SearchItem[]>();
  for (const item of results.value) {
    const name = item.category || "Autres";
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name)!.push(item);
  }
  return [...groups.entries()].map(([name, items]) => ({ name, items }));
});

const navigationEntries = computed(() => {
  void wikiReady.value;
  const activeCategory = category.value || selected.value?.category || "";
  if (!activeCategory || activeCategory === "OLD") return [] as WikiEntry[];

  return [...wikiById.values()]
    .filter((entry) => entry.category === activeCategory)
    .sort((a, b) =>
      (a.group || "Autres").localeCompare(b.group || "Autres", "fr", { sensitivity: "base" }) ||
      (a.subgroup || "Pages").localeCompare(b.subgroup || "Pages", "fr", { sensitivity: "base" }) ||
      a.title.localeCompare(b.title, "fr", { numeric: true, sensitivity: "base" })
    );
});

const navigationGroups = computed(() => {
  const groups = new Map<string, Map<string, WikiEntry[]>>();

  for (const entry of navigationEntries.value) {
    const groupName = entry.group || "Autres";
    const subgroupName = entry.subgroup || "Pages";
    if (!groups.has(groupName)) groups.set(groupName, new Map());
    const subgroups = groups.get(groupName)!;
    if (!subgroups.has(subgroupName)) subgroups.set(subgroupName, []);
    subgroups.get(subgroupName)!.push(entry);
  }

  return [...groups.entries()].map(([name, subgroupMap]) => ({
    name,
    count: [...subgroupMap.values()].reduce((sum, entries) => sum + entries.length, 0),
    subgroups: [...subgroupMap.entries()].map(([subgroup, entries]) => ({
      name: subgroup,
      entries
    }))
  }));
});

const hasResultSurface = computed(() =>
  !selected.value &&
  Boolean(
    query.value.trim() ||
    manufacturer.value ||
    activeLibraryView.value ||
    category.value === "OLD"
  )
);

const hasCategorySurface = computed(() =>
  !selected.value &&
  Boolean(category.value) &&
  category.value !== "OLD" &&
  !query.value.trim() &&
  !manufacturer.value &&
  !activeLibraryView.value
);

const resultSurfaceTitle = computed(() => {
  if (activeLibraryView.value === "recent") return "Récemment consultés";
  if (activeLibraryView.value === "favorites") return "Mes favoris";
  if (activeLibraryView.value) {
    return collections.value.find((item) => item.id === activeLibraryView.value)?.name || "Ma collection";
  }
  if (query.value.trim()) return `Recherche · « ${query.value.trim()} »`;
  if (manufacturer.value) return `Fabricant · ${manufacturer.value}`;
  if (category.value === "OLD") return "Archives · ancien Compendium";
  return "Résultats";
});

function resultBreadcrumb(item: SearchItem | WikiEntry): string {
  return [
    categoryLabel(item.category || ""),
    item.group || "",
    item.subgroup || "",
    item.manufacturer ? `Fabricant · ${item.manufacturer}` : ""
  ].filter(Boolean).join(" › ");
}

function navigationGroupOpen(groupName: string): boolean {
  if (selected.value?.navigation?.group === groupName) return true;
  if (category.value === "Règles" || category.value === "Réalité") return navigationGroups.value.length <= 5;
  return false;
}

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

const dossierContext = computed(() => {
  void wikiReady.value;
  const article = selected.value;
  if (!article) return { label: "", mode: "" as "manufacturer" | "subgroup" | "group" | "" };

  if (article.manufacturer) {
    return { label: `Fabricant · ${article.manufacturer}`, mode: "manufacturer" as const };
  }
  if (article.navigation?.subgroup) {
    return { label: article.navigation.subgroup, mode: "subgroup" as const };
  }
  if (article.navigation?.group) {
    return { label: article.navigation.group, mode: "group" as const };
  }
  return { label: "", mode: "" as const };
});

const dossierArticles = computed(() => {
  void wikiReady.value;
  const article = selected.value;
  const context = dossierContext.value;
  if (!article || !context.mode) return [] as WikiEntry[];

  const explicitIds = new Set(relatedArticles.value.map((entry) => entry.id));
  return [...wikiById.values()]
    .filter((entry) => entry.id !== article.id && !explicitIds.has(entry.id))
    .filter((entry) => {
      if (context.mode === "manufacturer") {
        return Boolean(article.manufacturer) && entry.manufacturer === article.manufacturer;
      }
      if (context.mode === "subgroup") {
        return (
          Boolean(article.navigation?.subgroup) &&
          entry.subgroup === article.navigation?.subgroup
        );
      }
      return (
        entry.category === article.category &&
        Boolean(article.navigation?.group) &&
        entry.group === article.navigation?.group
      );
    })
    .sort((a, b) =>
      Number(b.category === article.category) - Number(a.category === article.category) ||
      a.subgroup.localeCompare(b.subgroup, "fr", { sensitivity: "base" }) ||
      a.title.localeCompare(b.title, "fr", { numeric: true, sensitivity: "base" })
    )
    .slice(0, 36);
});

const mechanicalLabels: Record<string, string> = {
  effect: "Effet",
  prerequisite: "Prérequis",
  prerequisiteName: "Prérequis",
  cost: "Coût",
  access: "Accès",
  group: "Groupe",
  generation: "Génération",
  price: "Prix",
  priceMin: "Prix min.",
  priceMax: "Prix max.",
  priceLabel: "Prix",
  charge: "Charge",
  stress: "Stress",
  slots: "Emplacements",
  lifestyle: "Train de vie",
  account: "Compte",
  augmentationEnvelope: "Enveloppe augmentique",
  vehicleCapital: "Capital véhicule",
  support: "Appui",
  recurring: "Récurrence",
  monthlyCost: "Coût mensuel",
  attribute: "Attribut",
  skill: "Compétence"
};

function mechanicalValue(key: string, value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join(" · ");
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (typeof value === "number") {
    const formatted = new Intl.NumberFormat("fr-FR").format(value);
    if (/price|account|capital|envelope|cost/i.test(key)) return formatted + " $";
    return formatted;
  }
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value ?? "—");
}

function visibleMechanics(source: BuilderSourceRecord) {
  const hidden = new Set(["id", "name", "category", "sourceCategory", "originId", "sphere", "vehicle", "neuro"]);
  return Object.entries(source.mechanics).filter(([key, value]) =>
    !hidden.has(key) && value !== undefined && value !== null && value !== ""
  );
}

function categoryLabel(value: string): string {
  return value === "OLD" ? "Archives · ancien Compendium" : value;
}

function builderStepLabel(step: BuilderUsage["step"]): string {
  return ({
    origin: "Origine",
    sphere: "Sphère & Style",
    talents: "Talents",
    truth: "Vérité",
    disadvantages: "Désavantages",
    equipment: "Équipement"
  } as const)[step] ?? step;
}

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

async function loadOnboarding() {
  try {
    onboarding.value = await api<OnboardingData>("/api/compendium/onboarding");
  } catch (cause) {
    console.warn("Parcours nouveau joueur indisponible.", cause);
    onboarding.value = null;
  }
}

async function loadWikiIndex() {
  try {
    const payload = await api<{ entries: WikiEntry[] }>("/api/compendium/wiki-index?compact=1");
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
    loadLocalRecent();

    (window as any).__TUC_WIKI_V2__ = {
      ready: true,
      entries: payload.entries.length,
      stats: wikiLinker.stats,
      hasAfancTarget: wikiById.has("bestiaire-v15-afanc"),
      hasLegacyEntry: payload.entries.some((entry) => entry.category === "OLD"),
      sanity: wikiLinker.linkify(
        "Un Afanc rôde près du rivage.",
        { id: "__wiki_sanity__", category: "Bestiaire", dataset: "bestiaire", title: "Test" }
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

function recentSearchItem(id: string): RecentItem | null {
  const entry = wikiById.get(id);
  if (!entry) return null;
  return {
    id: entry.id,
    title: entry.title,
    category: entry.category,
    dataset: entry.dataset,
    source: "",
    status: "",
    group: entry.group,
    subgroup: entry.subgroup,
    tags: [],
    manufacturer: entry.manufacturer,
    edited: false,
    snippet: entry.snippet ?? ""
  };
}

function localRecentIds(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.map(String).filter(Boolean).slice(0, RECENT_LOCAL_LIMIT)
      : [];
  } catch {
    return [];
  }
}

function loadLocalRecent() {
  const rows = localRecentIds()
    .map(recentSearchItem)
    .filter((item): item is RecentItem => Boolean(item));
  if (!currentUser.value || !recentItems.value.length) recentItems.value = rows;
}

function rememberLocalRecent(id: string) {
  const ids = [id, ...localRecentIds().filter((item) => item !== id)].slice(0, RECENT_LOCAL_LIMIT);
  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Private browsing/storage denial must never block article reading.
  }
}

async function rememberArticle(id: string) {
  rememberLocalRecent(id);
  const item = recentSearchItem(id);
  if (item) {
    recentItems.value = [
      item,
      ...recentItems.value.filter((row) => row.id !== id)
    ].slice(0, 50);
    refreshActiveLibraryView();
  }

  if (currentUser.value) {
    await api(`/api/compendium/history/${encodeURIComponent(id)}`, { method: "PUT" }).catch(() => undefined);
  }
}

async function clearHistory() {
  if (currentUser.value) {
    await api("/api/compendium/history", { method: "DELETE" }).catch(() => undefined);
  }
  try {
    localStorage.removeItem(RECENT_STORAGE_KEY);
  } catch {
    // Storage may be unavailable.
  }
  recentItems.value = [];
  if (activeLibraryView.value === "recent") {
    results.value = [];
    total.value = 0;
  }
}

async function loadLibrary() {
  if (!currentUser.value) {
    favoriteIds.value = [];
    favoriteItems.value = [];
    collections.value = [];
    loadLocalRecent();
    return;
  }

  try {
    const payload = await api<LibraryPayload>("/api/compendium/library");
    favoriteIds.value = payload.favorites;
    favoriteItems.value = payload.favoriteItems;
    recentItems.value = payload.recentItems;
    collections.value = payload.collections;
    refreshActiveLibraryView();
  } catch (cause) {
    if (cause instanceof ApiError && cause.status === 401) {
      currentUser.value = null;
      favoriteIds.value = [];
      favoriteItems.value = [];
      collections.value = [];
      loadLocalRecent();
      return;
    }
    error.value = humanError(cause);
  }
}

function refreshActiveLibraryView() {
  if (activeLibraryView.value === "recent") {
    results.value = recentItems.value;
    total.value = recentItems.value.length;
    return;
  }

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

function showRecent() {
  showOnboarding.value = false;
  selected.value = null;
  activeLibraryView.value = "recent";
  query.value = "";
  category.value = "";
  manufacturer.value = "";
  results.value = recentItems.value;
  total.value = recentItems.value.length;
}

function showFavorites() {
  showOnboarding.value = false;
  selected.value = null;
  activeLibraryView.value = "favorites";
  query.value = "";
  category.value = "";
  manufacturer.value = "";
  results.value = favoriteItems.value;
  total.value = favoriteItems.value.length;
}

function showCollection(collection: LibraryCollection) {
  showOnboarding.value = false;
  selected.value = null;
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

function clearSuggestions() {
  suggestions.value = [];
  suggestionIndex.value = -1;
  suggestionLoading.value = false;
}

function scheduleSuggestions() {
  window.clearTimeout(suggestionTimer);
  const value = query.value.trim();
  if (value.length < 2) {
    clearSuggestions();
    return;
  }
  suggestionTimer = window.setTimeout(() => void loadSuggestions(value), 180);
}

async function loadSuggestions(value: string) {
  const requestId = ++suggestionRequest;
  suggestionLoading.value = true;
  try {
    const params = new URLSearchParams({ q: value, limit: "8" });
    if (category.value) params.set("category", category.value);
    if (manufacturer.value) params.set("manufacturer", manufacturer.value);
    const payload = await api<{ items: SearchItem[] }>(
      `/api/compendium/search?${params.toString()}`
    );
    if (requestId !== suggestionRequest || value !== query.value.trim()) return;
    suggestions.value = payload.items;
    suggestionIndex.value = payload.items.length ? 0 : -1;
  } catch {
    if (requestId === suggestionRequest) suggestions.value = [];
  } finally {
    if (requestId === suggestionRequest) suggestionLoading.value = false;
  }
}

async function chooseSuggestion(item: SearchItem) {
  query.value = item.title;
  searchFocused.value = false;
  clearSuggestions();
  await openArticle(item.id);
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (!suggestionsVisible.value || !suggestions.value.length) {
    if (event.key === "Escape") {
      searchFocused.value = false;
      clearSuggestions();
    }
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    suggestionIndex.value = (suggestionIndex.value + 1) % suggestions.value.length;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    suggestionIndex.value =
      (suggestionIndex.value - 1 + suggestions.value.length) % suggestions.value.length;
  } else if (event.key === "Enter" && suggestionIndex.value >= 0) {
    event.preventDefault();
    const item = suggestions.value[suggestionIndex.value];
    if (item) void chooseSuggestion(item);
  } else if (event.key === "Escape") {
    event.preventDefault();
    searchFocused.value = false;
    clearSuggestions();
  }
}

function handleSearchBlur() {
  window.setTimeout(() => {
    searchFocused.value = false;
  }, 120);
}

watch(query, () => {
  if (searchFocused.value) scheduleSuggestions();
});

async function search() {
  searchFocused.value = false;
  clearSuggestions();
  activeLibraryView.value = "";
  loading.value = true;
  error.value = "";
  if (query.value.trim() || category.value || manufacturer.value) showOnboarding.value = false;

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
    selected.value = null;
  } catch (cause) {
    results.value = [];
    total.value = 0;
    error.value = humanError(cause);
  } finally {
    loading.value = false;
  }
}

async function openArticle(id: string, syncRoute = true) {
  showOnboarding.value = false;
  articleLoading.value = true;
  error.value = "";
  builderUsage.value = [];
  builderSources.value = [];
  talentEmbeds.value = {};

  try {
    const result = await api<{ article: Article }>(
      `/api/compendium/articles/${encodeURIComponent(id)}`
    );

    // Primary content becomes visible immediately. Builder context, dynamic
    // Talents and history enrich the already rendered article afterwards.
    selected.value = result.article;
    if (result.article.category) category.value = result.article.category;
    articleLoading.value = false;

    if (syncRoute && route.query.article !== id) {
      void router.push({
        path: "/compendium",
        query: { article: id }
      });
    }

    const usageResult = await api<{ usage: BuilderUsage[]; sources: BuilderSourceRecord[] }>(
      `/api/compendium/builder-usage/${encodeURIComponent(id)}`
    ).catch(() => ({
      usage: [] as BuilderUsage[],
      sources: [] as BuilderSourceRecord[]
    }));
    if (selected.value?.id !== id) return;
    builderUsage.value = usageResult.usage;
    builderSources.value = usageResult.sources;

    await Promise.all([
      loadTalentEmbeds(result.article),
      rememberArticle(id)
    ]);
  } catch (cause) {
    builderUsage.value = [];
    builderSources.value = [];
    talentEmbeds.value = {};
    error.value = humanError(cause);
  } finally {
    articleLoading.value = false;
  }
}

async function chooseCategory(name: string) {
  showOnboarding.value = false;
  activeLibraryView.value = "";
  selected.value = null;
  query.value = "";
  category.value = category.value === name ? "" : name;
  if (category.value !== "Équipement & Objets") manufacturer.value = "";
  await search();
  await router.replace({
    path: "/compendium",
    query: category.value ? { category: category.value } : {}
  });
}

async function openNewcomer() {
  selected.value = null;
  query.value = "";
  category.value = "";
  manufacturer.value = "";
  showOnboarding.value = true;
  await router.push({ path: "/compendium", query: { start: "1" } });
}

async function closeNewcomer() {
  showOnboarding.value = false;
  await router.push({ path: "/compendium" });
}

async function openOnboardingCategory(name: string) {
  category.value = "";
  await chooseCategory(name);
}

async function chooseManufacturer(name: string) {
  selected.value = null;
  activeLibraryView.value = "";
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

async function showWikiPreview(link: HTMLAnchorElement) {
  const id = link.dataset.wikiId;
  if (!id) return;
  const entry = wikiById.get(id);
  if (!entry) return;

  wikiPreviewLink = link;
  const cached = wikiPreviewCache.get(id);
  wikiPreview.value = {
    visible: true,
    id,
    title: entry.title,
    category: entry.category || "Compendium",
    context: [entry.group, entry.subgroup].filter(Boolean).join(" · "),
    snippet: cached?.snippet ?? "",
    mediaSrc: mediaUrl(cached?.media),
    left: wikiPreview.value.left,
    top: wikiPreview.value.top,
    width: wikiPreview.value.width
  };
  void positionWikiPreview(link);

  if (cached) return;
  try {
    const preview = await api<{ id: string; snippet: string; media?: string | MediaRef | null }>(
      `/api/compendium/wiki-preview/${encodeURIComponent(id)}`
    );
    wikiPreviewCache.set(id, { snippet: preview.snippet, media: preview.media });
    if (wikiPreview.value.visible && wikiPreview.value.id === id) {
      wikiPreview.value.snippet = preview.snippet;
      wikiPreview.value.mediaSrc = mediaUrl(preview.media);
      void positionWikiPreview(link);
    }
  } catch {
    // Preview enrichment is optional; navigation must stay instant.
  }
}

function handleWikiMouseover(event: MouseEvent) {
  const link = closestWikiLink(event);
  if (!link || link === wikiPreviewLink || !link.dataset.wikiId) return;
  if (wikiPreviewTimer !== undefined) window.clearTimeout(wikiPreviewTimer);
  wikiPreviewTimer = window.setTimeout(() => void showWikiPreview(link), 120);
}

function handleWikiMouseout(event: MouseEvent) {
  const link = closestWikiLink(event);
  if (!link) return;
  const related = event.relatedTarget;
  if (!(related instanceof Node) || !link.contains(related)) hideWikiPreview();
}

function handleWikiFocusin(event: FocusEvent) {
  const link = closestWikiLink(event);
  if (link?.dataset.wikiId) void showWikiPreview(link);
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

type TalentDirective = {natureId?:string;groupId?:string;ids?:string[]};

function talentDirective(value:string):TalentDirective|null{
  const match=value.trim().match(/^\{\{Talents\|(.+)\}\}$/i);
  if(!match)return null;
  const result:TalentDirective={};
  for(const part of match[1].split("|")){
    const [rawKey,...rest]=part.split("=");
    const key=rawKey.trim().toLocaleLowerCase("fr");
    const val=rest.join("=").trim();
    if(!val)continue;
    if(key==="nature"||key==="natureid")result.natureId=val;
    else if(key==="group"||key==="groupid")result.groupId=val;
    else if(key==="ids")result.ids=val.split(",").map(item=>item.trim()).filter(Boolean);
  }
  return result.natureId||result.groupId||result.ids?.length?result:null;
}

function talentEmbedKey(block:ArticleBlock):string{
  return blockText(block).trim();
}

function isTalentEmbed(block:ArticleBlock):boolean{
  return block?.type==="p"&&Boolean(talentDirective(talentEmbedKey(block)));
}

function talentsForBlock(block:ArticleBlock):TalentRegistryRow[]{
  return talentEmbeds.value[talentEmbedKey(block)]??[];
}

async function loadTalentEmbeds(article:Article){
  const directives=new Map<string,TalentDirective>();
  for(const section of article.sections??[]){
    for(const block of section.blocks??[]){
      const key=talentEmbedKey(block);
      const spec=talentDirective(key);
      if(spec)directives.set(key,spec);
    }
  }
  if(!directives.size){
    talentEmbeds.value={};
    return;
  }

  const entries=await Promise.all([...directives.entries()].map(async([key,spec])=>{
    const params=new URLSearchParams();
    if(spec.natureId)params.set("natureId",spec.natureId);
    if(spec.groupId)params.set("groupId",spec.groupId);
    if(spec.ids?.length)params.set("ids",spec.ids.join(","));
    try{
      const payload=await api<{items:TalentRegistryRow[]}>(`/api/compendium/talents?${params.toString()}`);
      return [key,payload.items] as const;
    }catch{
      return [key,[] as TalentRegistryRow[]] as const;
    }
  }));
  talentEmbeds.value=Object.fromEntries(entries);
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

onMounted(() => {
  if (typeof route.query.q === "string") query.value = route.query.q;
  if (typeof route.query.category === "string") category.value = route.query.category;

  const initialArticleId =
    typeof route.query.article === "string" ? route.query.article : "";

  showOnboarding.value =
    route.query.start === "1" ||
    (!initialArticleId && !query.value.trim() && !category.value);

  // The requested content is always the highest-priority network call.
  if (initialArticleId) {
    void openArticle(initialArticleId, false);
  } else if (!showOnboarding.value || query.value.trim() || category.value) {
    void search();
  }

  void loadMeta();
  void loadOnboarding();
  void loadCurrentUser().then(async () => {
    if (currentUser.value) await loadLibrary();
  });

  // Interlinking is an enhancement, not a prerequisite to reading a page.
  // A short delay lets the article/search request win the initial connection.
  wikiBootstrapTimer = window.setTimeout(() => {
    void loadWikiIndex();
  }, initialArticleId ? 250 : 50);

  window.addEventListener("scroll", repositionWikiPreview, { passive: true });
  window.addEventListener("resize", repositionWikiPreview);
});

onBeforeUnmount(() => {
  window.clearTimeout(suggestionTimer);
  window.clearTimeout(wikiBootstrapTimer);
  hideWikiPreview();
  window.removeEventListener("scroll", repositionWikiPreview);
  window.removeEventListener("resize", repositionWikiPreview);
});
</script>

<template>
  <div class="compendium-shell">
    <header class="compendium-topbar">
      <RouterLink class="brand compendium-brand-lockup" to="/">
        <TerraUmbraLockup compact />
      </RouterLink>

      <div class="compendium-top-actions">
        <button class="ghost compact-link" type="button" @click="openNewcomer">
          Nouveau joueur
        </button>
        <RouterLink v-if="canEdit" class="ghost compact-link wiki-create-link" to="/compendium/new">
          ＋ Nouvelle page
        </RouterLink>
        <RouterLink class="ghost compact-link" to="/account">
          {{ currentUser ? "Mon espace" : "Connexion" }}
        </RouterLink>
      </div>
    </header>

    <main class="compendium-page">
      <section class="compendium-hero">
        <div class="compendium-earth-horizon" aria-hidden="true"></div>
        <div>
          <TerraUmbraLockup class="compendium-hero-logo" />
          <p class="eyebrow">CORPUS NATIF V2</p>
          <h1>Compendium</h1>
          <p>
            Wiki public de Terra Umbra California : règles, Réalité, Vérité, personnages,
            créatures et équipement. Aucun compte n’est nécessaire pour lire ou rechercher.
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
      </div>
      <div v-else-if="libraryNotice" class="feedback compendium-feedback">
        {{ libraryNotice }}
      </div>

      <template v-if="true">
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
                  aria-label="Recherche dans le Compendium"
                  @focus="searchFocused=true; scheduleSuggestions()"
                  @blur="handleSearchBlur"
                  @keydown="handleSearchKeydown"
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

              <div
                v-if="suggestionsVisible"
                class="search-suggestions"
                role="listbox"
                aria-label="Suggestions de recherche"
              >
                <div v-if="suggestionLoading && !suggestions.length" class="search-suggestion-loading">
                  Recherche…
                </div>
                <button
                  v-for="(item,index) in suggestions"
                  :key="item.id"
                  type="button"
                  role="option"
                  :aria-selected="index === suggestionIndex"
                  :class="{ active: index === suggestionIndex }"
                  @mousedown.prevent
                  @mouseenter="suggestionIndex=index"
                  @click="chooseSuggestion(item)"
                >
                  <span>
                    <strong>{{ item.title }}</strong>
                    <small>{{ resultBreadcrumb(item) }}</small>
                  </span>
                  <em>{{ item.snippet }}</em>
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
              <span>{{ categoryLabel(item.name) }}</span>
              <small>{{ item.count }}</small>
            </button>
          </div>
        </section>

        <CompendiumOnboarding
          v-if="showOnboarding"
          :data="onboarding"
          @open-article="openArticle"
          @open-category="openOnboardingCategory"
          @close="closeNewcomer"
        />

        <section
          v-if="!showOnboarding && (currentUser || recentItems.length)"
          class="panel library-panel"
        >
          <div class="library-heading">
            <div>
              <p class="eyebrow">{{ currentUser ? "MA BIBLIOTHÈQUE" : "MA NAVIGATION" }}</p>
              <h2>{{ currentUser ? "Historique, favoris & collections" : "Historique récent" }}</h2>
            </div>
            <div class="library-scopes">
              <button
                class="library-scope"
                :class="{ active: activeLibraryView === 'recent' }"
                type="button"
                @click="showRecent"
              >
                ◷ Historique · {{ recentItems.length }}
              </button>
              <button
                v-if="recentItems.length"
                class="library-clear"
                type="button"
                @click="clearHistory"
              >
                Effacer
              </button>
              <button
                v-if="currentUser"
                class="library-scope"
                :class="{ active: activeLibraryView === 'favorites' }"
                type="button"
                @click="showFavorites"
              >
                ★ Favoris · {{ favoriteIds.length }}
              </button>
            </div>
          </div>

          <template v-if="currentUser">
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
          </template>
          <p v-else class="library-empty">
            Cet historique reste uniquement dans ce navigateur tant que tu n’es pas connecté.
          </p>
        </section>

        <section v-if="!showOnboarding" class="compendium-workspace">
          <aside class="panel compendium-navigation">
            <div class="navigation-heading">
              <div>
                <p class="eyebrow">NAVIGATION</p>
                <h2>Compendium</h2>
              </div>
              <span v-if="category">{{ categoryLabel(category) }}</span>
            </div>

            <nav class="navigation-categories" aria-label="Rubriques du Compendium">
              <button
                type="button"
                class="navigation-category"
                :class="{ active: !category }"
                @click="chooseCategory('')"
              >
                <span>Toutes les rubriques</span>
                <small>{{ meta?.total?.toLocaleString('fr-FR') || '—' }}</small>
              </button>
              <button
                v-for="item in meta?.categories || []"
                :key="item.name"
                type="button"
                class="navigation-category"
                :class="{ active: category === item.name }"
                @click="chooseCategory(item.name)"
              >
                <span>{{ categoryLabel(item.name) }}</span>
                <small>{{ item.count }}</small>
              </button>
            </nav>

            <div v-if="category && category !== 'OLD'" class="navigation-tree">
              <div class="navigation-tree-kicker">
                <strong>{{ categoryLabel(category) }}</strong>
                <span>{{ navigationEntries.length }} page{{ navigationEntries.length > 1 ? 's' : '' }}</span>
              </div>

              <details
                v-for="group in navigationGroups"
                :key="group.name"
                class="navigation-group"
                :open="navigationGroupOpen(group.name)"
              >
                <summary>
                  <span>{{ group.name }}</span>
                  <small>{{ group.count }}</small>
                </summary>

                <div class="navigation-group-body">
                  <section
                    v-for="subgroup in group.subgroups"
                    :key="`${group.name}-${subgroup.name}`"
                    class="navigation-subgroup"
                  >
                    <header v-if="subgroup.name !== 'Pages'">
                      <span>{{ subgroup.name }}</span>
                      <small>{{ subgroup.entries.length }}</small>
                    </header>
                    <button
                      v-for="entry in subgroup.entries"
                      :key="entry.id"
                      type="button"
                      class="navigation-page"
                      :class="{ active: selected?.id === entry.id }"
                      @click="openArticle(entry.id)"
                    >
                      {{ entry.title }}
                    </button>
                  </section>
                </div>
              </details>

              <p v-if="wikiReady && !navigationGroups.length" class="navigation-empty">
                Aucune page active dans cette rubrique.
              </p>
            </div>

            <div v-else-if="category === 'OLD'" class="navigation-archive-note">
              Les archives sont volontairement absentes de l’arborescence active. Leur contenu apparaît dans la zone principale.
            </div>

            <div v-else class="navigation-hint">
              Choisis une rubrique pour afficher ses groupes, sous-groupes et pages.
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
            <div v-if="articleLoading && !selected" class="article-skeleton" aria-label="Chargement de l’article">
              <div class="article-skeleton-kicker"></div>
              <div class="article-skeleton-title"></div>
              <div class="article-skeleton-meta"></div>
              <div class="article-skeleton-grid">
                <div>
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <aside></aside>
              </div>
            </div>

            <template v-else-if="selected">
              <div :key="selected.id" class="wiki-article-grid wiki-article-enter">
                <div class="wiki-article-main">
                  <header class="article-header">
                    <div class="article-breadcrumb">
                      <span>{{ categoryLabel(selected.category || "") }}</span>
                      <template v-if="selected.navigation?.group">
                        <span>›</span>
                        <span>{{ selected.navigation.group }}</span>
                      </template>
                      <template v-if="selected.navigation?.subgroup">
                        <span>›</span>
                        <span>{{ selected.navigation.subgroup }}</span>
                      </template>
                    </div>

                    <div v-if="selected.__legacy" class="legacy-article-notice">
                      <strong>Archive de l’ancien Compendium</strong>
                      <span>
                        Conservée pour audit{{ selected.legacyCategory ? ` · ancienne rubrique : ${selected.legacyCategory}` : "" }}.
                        Cette fiche n’apparaît plus dans la navigation normale.
                      </span>
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
                      <span v-if="canEdit && selected.source">{{ selected.source }}</span>
                      <button
                        v-if="selected.manufacturer"
                        class="manufacturer-badge"
                        type="button"
                        @click="chooseManufacturer(selected.manufacturer)"
                      >
                        Fabricant · {{ selected.manufacturer }}
                      </button>
                      <span v-if="canEdit && selected.__editorialOverride">Surcharge éditoriale</span>
                      <span v-if="canEdit && selected.__wikiPublishedEdit">Édition wiki publiée</span>
                    </div>

                    <div v-if="currentUser" class="article-library-actions">
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
                          <div v-if="isTalentEmbed(block)" class="talent-registry-block">
                            <div v-if="talentsForBlock(block).length" class="talent-card-grid">
                              <article v-for="talent in talentsForBlock(block)" :key="talent.talentId" class="talent-wiki-card">
                                <header>
                                  <div>
                                    <span>{{ talent.groupLabel }}</span>
                                    <h3>{{ talent.name }}</h3>
                                  </div>
                                  <strong>{{ talent.cost }} PTV</strong>
                                </header>
                                <div class="talent-wiki-meta">
                                  <span v-if="talent.access">{{ talent.access }}</span>
                                  <span v-if="talent.prerequisiteName">Prérequis · {{ talent.prerequisiteName }}</span>
                                </div>
                                <p class="talent-wiki-lore">{{ talent.lore }}</p>
                                <div class="talent-wiki-mechanics">
                                  <small>EFFET</small>
                                  <p>{{ talent.mechanics }}</p>
                                </div>
                              </article>
                            </div>
                            <div v-else class="talent-registry-empty">Aucun Talent ne correspond à ce bloc dynamique.</div>
                          </div>
                          <p
                            v-else-if="block.type === 'p'"
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
                        <div v-if="isTalentEmbed(block)" class="talent-registry-block">
                          <div v-if="talentsForBlock(block).length" class="talent-card-grid">
                            <article v-for="talent in talentsForBlock(block)" :key="talent.talentId" class="talent-wiki-card">
                              <header>
                                <div>
                                  <span>{{ talent.groupLabel }}</span>
                                  <h3>{{ talent.name }}</h3>
                                </div>
                                <strong>{{ talent.cost }} PTV</strong>
                              </header>
                              <div class="talent-wiki-meta">
                                <span v-if="talent.access">{{ talent.access }}</span>
                                <span v-if="talent.prerequisiteName">Prérequis · {{ talent.prerequisiteName }}</span>
                              </div>
                              <p class="talent-wiki-lore">{{ talent.lore }}</p>
                              <div class="talent-wiki-mechanics">
                                <small>EFFET</small>
                                <p>{{ talent.mechanics }}</p>
                              </div>
                            </article>
                          </div>
                          <div v-else class="talent-registry-empty">Aucun Talent ne correspond à ce bloc dynamique.</div>
                        </div>
                        <p
                          v-else-if="block.type === 'p'"
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

                  <section v-if="dossierArticles.length" class="wiki-see-also wiki-dossier">
                    <p class="eyebrow">DOSSIER</p>
                    <h2>Dans ce dossier</h2>
                    <p class="wiki-dossier-context">{{ dossierContext.label }}</p>
                    <div class="wiki-related-grid">
                      <button
                        v-for="entry in dossierArticles"
                        :key="entry.id"
                        type="button"
                        @click="openArticle(entry.id)"
                      >
                        <span>{{ entry.subgroup || entry.category }}</span>
                        <strong>{{ entry.title }}</strong>
                        <small v-if="entry.snippet">{{ entry.snippet }}</small>
                      </button>
                    </div>
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
                        <dt>Rubrique</dt><dd>{{ categoryLabel(selected.category) }}</dd>
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

                  <section v-if="builderSources.length" class="wiki-mechanics-card">
                    <div class="wiki-mechanics-head">
                      <div>
                        <p class="eyebrow">DONNÉES CANONIQUES</p>
                        <strong>{{ builderSources.length > 1 ? "Références Builder" : builderSources[0]?.kind }}</strong>
                      </div>
                      <span>Lecture seule</span>
                    </div>
                    <article v-for="source in builderSources" :key="source.key" class="wiki-mechanics-record">
                      <header v-if="builderSources.length > 1">
                        <strong>{{ source.label }}</strong>
                        <small>{{ source.kind }}</small>
                      </header>
                      <dl v-if="visibleMechanics(source).length">
                        <template v-for="[key,value] in visibleMechanics(source)" :key="key">
                          <dt>{{ mechanicalLabels[key] || key }}</dt>
                          <dd>{{ mechanicalValue(key,value) }}</dd>
                        </template>
                      </dl>
                    </article>
                    <p class="wiki-mechanics-note">Ces valeurs proviennent directement du Builder et ne sont pas éditées par le wiki.</p>
                  </section>

                  <section v-if="builderUsage.length" class="wiki-builder-usage">
                    <p class="eyebrow">DANS LE BUILDER</p>
                    <p class="wiki-builder-intro">
                      Cette page sert directement de référence à {{ builderUsage.length > 1 ? "plusieurs choix" : "un choix" }} du Builder.
                    </p>
                    <div class="wiki-builder-usage-list">
                      <article v-for="(usage,index) in builderUsage" :key="`${usage.step}-${usage.kind}-${index}`">
                        <span>{{ builderStepLabel(usage.step) }}</span>
                        <strong>{{ usage.kind }}</strong>
                        <small>{{ usage.label }}<template v-if="usage.detail"> · {{ usage.detail }}</template></small>
                      </article>
                    </div>
                  </section>

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

            <section v-else-if="hasResultSurface" class="search-results-main">
              <header class="surface-heading">
                <div>
                  <p class="eyebrow">RECHERCHE & BIBLIOTHÈQUE</p>
                  <h1>{{ resultSurfaceTitle }}</h1>
                  <p v-if="query.trim()">
                    Les résultats sont affichés ici pour garder la navigation du Compendium disponible à gauche.
                  </p>
                </div>
                <div class="surface-count">
                  <strong>{{ total.toLocaleString("fr-FR") }}</strong>
                  <span>{{ total === 1 ? "entrée" : "entrées" }}</span>
                </div>
              </header>

              <div v-if="results.length" class="main-result-list">
                <section v-for="group in resultGroups" :key="group.name" class="main-result-group">
                  <header>
                    <strong>{{ categoryLabel(group.name) }}</strong>
                    <span>{{ group.items.length }}</span>
                  </header>
                  <button
                    v-for="item in group.items"
                    :key="item.id"
                    class="result-card main-result-card"
                    type="button"
                    @click="openArticle(item.id)"
                  >
                    <span class="result-path">{{ resultBreadcrumb(item) }}</span>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.snippet }}</p>
                    <div class="result-flags">
                      <small v-if="item.edited">Édition canonique appliquée</small>
                      <small v-if="favoriteIds.includes(item.id)">★ Favori</small>
                    </div>
                  </button>
                </section>
                <p v-if="total > results.length" class="result-limit-note">
                  {{ results.length }} premiers résultats affichés sur {{ total.toLocaleString("fr-FR") }}.
                  Affine la recherche pour aller plus vite.
                </p>
              </div>

              <div v-else-if="!loading" class="empty-results main-empty-results">
                Aucune entrée ne correspond à cette recherche.
              </div>
            </section>

            <section v-else-if="hasCategorySurface" class="category-overview">
              <header class="surface-heading">
                <div>
                  <p class="eyebrow">RUBRIQUE</p>
                  <h1>{{ categoryLabel(category) }}</h1>
                  <p>
                    Parcours la rubrique par dossier. Les mêmes groupes restent disponibles dans l’arborescence à gauche pendant la lecture.
                  </p>
                </div>
                <div class="surface-count">
                  <strong>{{ navigationEntries.length.toLocaleString("fr-FR") }}</strong>
                  <span>pages actives</span>
                </div>
              </header>

              <div v-if="navigationGroups.length" class="category-group-grid">
                <section v-for="group in navigationGroups" :key="group.name" class="category-group-card">
                  <header>
                    <div>
                      <p class="eyebrow">DOSSIER</p>
                      <h2>{{ group.name }}</h2>
                    </div>
                    <span>{{ group.count }}</span>
                  </header>

                  <div class="category-subgroup-list">
                    <section v-for="subgroup in group.subgroups" :key="subgroup.name">
                      <div v-if="subgroup.name !== 'Pages'" class="category-subgroup-title">
                        <strong>{{ subgroup.name }}</strong>
                        <span>{{ subgroup.entries.length }}</span>
                      </div>
                      <div class="category-page-links">
                        <button
                          v-for="entry in subgroup.entries.slice(0, 12)"
                          :key="entry.id"
                          type="button"
                          @click="openArticle(entry.id)"
                        >
                          <span>{{ entry.title }}</span>
                          <small>Ouvrir →</small>
                        </button>
                      </div>
                      <p v-if="subgroup.entries.length > 12" class="category-more">
                        + {{ subgroup.entries.length - 12 }} autres pages dans l’arborescence de gauche.
                      </p>
                    </section>
                  </div>
                </section>
              </div>

              <div v-else-if="wikiReady" class="main-empty-results">
                Cette rubrique ne contient pas encore de pages reconstruites.
              </div>
            </section>

            <div v-else class="article-placeholder">
              <p class="eyebrow">LECTURE</p>
              <h2>Choisis une rubrique ou lance une recherche</h2>
              <p>
                La colonne de gauche sert désormais uniquement à naviguer dans le Compendium.
                Les résultats de recherche et les sommaires de rubrique s’affichent dans cette zone.
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
  background:
    radial-gradient(circle at 80% 4%, rgba(43,146,255, .11), transparent 34rem),
    radial-gradient(circle at 8% 42%, rgba(166,124,230, .07), transparent 28rem);
}

.compendium-topbar {
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 clamp(1rem, 5vw, 4rem);
  border-bottom: 1px solid rgba(70,126,148, .13);
  background: rgba(8,15,23, .94);
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
  border-color: rgba(43,146,255, .45) !important;
  color: #b8dfea !important;
}

.compendium-page {
  width: min(1480px, calc(100% - 2rem));
  margin: 0 auto;
  padding: clamp(2rem, 4vw, 4rem) 0 5rem;
}

.compendium-hero {
  position:relative;
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:end;
  gap:2rem;
  min-height:250px;
  margin-bottom:2rem;
  padding:clamp(1.1rem,2vw,1.7rem) clamp(1rem,2vw,1.65rem);
  overflow:hidden;
  border:1px solid rgba(59,126,157,.22);
  background:
    radial-gradient(circle at 86% 78%,rgba(44,144,212,.11),transparent 25rem),
    radial-gradient(circle at 96% 58%,rgba(179,61,219,.07),transparent 21rem),
    linear-gradient(135deg,rgba(16,19,24,.86),rgba(11,13,17,.68));
}

.compendium-hero > :not(.compendium-earth-horizon){
  position:relative;
  z-index:2;
}

.compendium-hero-logo{
  width:min(360px,72vw) !important;
  margin:0 0 .65rem;
}

.compendium-earth-horizon{
  position:absolute;
  z-index:1;
  right:-58px;
  bottom:-205px;
  width:min(44vw,520px);
  height:295px;
  border-radius:50%;
  border-top:1px solid rgba(66,215,236,.48);
  opacity:.44;
  pointer-events:none;
  background:
    radial-gradient(ellipse at 50% 0%,rgba(43,151,240,.15),transparent 43%),
    linear-gradient(90deg,transparent 2%,rgba(54,207,232,.055) 36%,rgba(177,62,224,.075) 78%,transparent);
  box-shadow:
    0 -3px 11px rgba(48,195,239,.12),
    0 -10px 30px rgba(41,139,232,.08),
    0 -18px 50px rgba(166,72,221,.06);
}

.compendium-earth-horizon::before{
  content:"";
  position:absolute;
  left:9%;
  right:8%;
  top:-1px;
  height:1px;
  background:linear-gradient(90deg,transparent,#48d8e5 35%,#3f93ff 58%,#c85cec 83%,transparent);
}

.compendium-hero h1 {
  margin: .2rem 0 .7rem;
  font: 500 clamp(2.8rem, 7vw, 5.6rem)/1 Georgia, serif;
}

.compendium-hero p:not(.eyebrow) {
  max-width: 72ch;
  margin: 0;
  color: #a6bac2;
  line-height: 1.65;
}

.compendium-stats {
  min-width: 190px;
  padding: 1.05rem 1.2rem;
  display: grid;
  gap:.15rem;
  border-color:rgba(88,220,197,.22);
  background:linear-gradient(145deg,rgba(43,146,255,.09),rgba(12,23,32,.82));
}

.compendium-stats strong {
  color: #91cfe0;
  font: 500 2rem/1 Georgia, serif;
}

.compendium-stats span,
.compendium-stats small {
  color: #91a7b1;
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
  border-color:rgba(88,220,197,.2);
  background:
    linear-gradient(135deg,rgba(43,146,255,.07),rgba(16,27,37,.86) 42%,rgba(8,16,24,.9));
  box-shadow:0 22px 65px rgba(0,0,0,.2);
}

.search-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 260px) auto;
  gap: .7rem;
  align-items:stretch;
}
.search-line input[type="search"]{min-height:50px;font-size:1rem;border-color:rgba(88,220,197,.2);background:rgba(8,8,7,.38)}
.search-line input[type="search"]:focus{border-color:#2b92ff;box-shadow:0 0 0 2px rgba(43,146,255,.12),0 12px 30px rgba(0,0,0,.18)}
.search-line .primary{min-height:50px}

.compendium-search form{position:relative}
.search-suggestions{position:absolute;left:0;right:0;top:calc(100% + .45rem);z-index:30;display:grid;max-height:min(520px,62vh);overflow:auto;border:1px solid rgba(88,220,197,.24);background:#081119;box-shadow:0 22px 60px rgba(0,0,0,.42)}
.search-suggestions button{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:1rem;padding:.7rem .85rem;border:0;border-bottom:1px solid rgba(255,255,255,.055);text-align:left;color:#c5d4d9;background:transparent}
.search-suggestions button:last-child{border-bottom:0}.search-suggestions button.active,.search-suggestions button:hover{background:rgba(43,146,255,.09)}
.search-suggestions button>span{display:grid;gap:.2rem}.search-suggestions strong{color:#dce8ec;font-size:.84rem}.search-suggestions small{color:#6fb9d6;font-size:.65rem}.search-suggestions em{color:#718a95;font-size:.69rem;line-height:1.4;font-style:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.search-suggestion-loading{padding:.9rem;color:#718a95;font-size:.75rem}
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
  background: rgba(255,255,255,.012);
  color: #afc1c8;
  transition:transform .16s ease,border-color .16s ease,background .16s ease,color .16s ease;
}
.category-chip:hover{transform:translateY(-1px);border-color:rgba(88,220,197,.34);background:rgba(43,146,255,.055)}

.category-chip small {
  color: #667f8b;
}

.category-chip.active {
  border-color: #2b92ff;
  color: #c7eaf2;
  background: rgba(43,146,255, .11);
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

.library-scopes {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: .45rem;
}

.library-clear {
  min-height: 38px;
  padding: .45rem .6rem;
  border: 1px solid rgba(255, 255, 255, .08);
  color: #718a95;
  background: transparent;
  font-size: .72rem;
}

.library-clear:hover {
  border-color: rgba(88,220,197, .25);
  color: #afc1c8;
}

.library-scope {
  min-height: 38px;
  padding: .45rem .7rem;
  border: 1px solid rgba(255, 255, 255, .11);
  color: #afc1c8;
  background: transparent;
}

.library-scope.active,
.favorite-button.active,
.collection-toggle.active {
  border-color: #2b92ff;
  color: #c7eaf2;
  background: rgba(43,146,255, .11);
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
  border-color: #365f73;
}

.collection-open,
.collection-action {
  border: 0;
  background: transparent;
  color: #afc1c8;
}

.collection-open {
  display: grid;
  gap: .1rem;
  padding: .45rem .65rem;
  text-align: left;
}

.collection-open small {
  color: #667f8b;
}

.collection-action {
  border-left: 1px solid rgba(255, 255, 255, .08);
}

.collection-action.danger {
  color: #c99088;
}

.library-empty {
  margin: .8rem 0 0;
  color: #667f8b;
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
  color: #a6bac2;
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
  border-color:rgba(70,126,148,.12);
  background:rgba(12,23,32,.88);
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
  color: #7f98a3;
  font-size: .78rem;
}

.result-group{display:grid;gap:.45rem}.result-group+.result-group{margin-top:.8rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.07)}
.result-group>header{display:flex;justify-content:space-between;gap:.6rem;align-items:center;padding:0 .15rem}.result-group>header strong{color:#8fb7c5;font-size:.68rem;text-transform:uppercase;letter-spacing:.07em}.result-group>header span{color:#667f8b;font-size:.65rem}
.result-list {
  max-height: calc(100vh - 205px);
  overflow-y: auto;
}

.result-card {
  width: 100%;
  display: grid;
  gap: .42rem;
  padding: .9rem 1rem;
  border: 1px solid transparent;
  border-bottom-color: rgba(255, 255, 255, .06);
  text-align: left;
  color: #c5d4d9;
  background: transparent;
  transition:background .16s ease,border-color .16s ease,transform .16s ease;
}

.result-card:hover,
.result-card.active {
  background: linear-gradient(90deg,rgba(43,146,255,.105),rgba(43,146,255,.025));
}
.result-card:hover{transform:translateX(2px)}

.result-card.active {
  box-shadow: inset 3px 0 #2b92ff;
}

.result-card strong {
  font-family: Georgia, serif;
  font-size: 1.05rem;
}

.result-card p {
  margin: 0;
  color: #91a7b1;
  font-size: .8rem;
  line-height: 1.45;
}

.result-meta,
.result-card small {
  color: #6fb9d6;
  font-size: .68rem;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.empty-results {
  padding: 2rem 1rem;
  color: #718a95;
}

.article-panel {
  min-height: 620px;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  border-color:rgba(70,126,148,.13);
  background:linear-gradient(160deg,rgba(16,27,37,.9),rgba(8,16,24,.82));
}

.article-skeleton{display:grid;gap:1rem;min-height:520px;padding:.2rem}
.article-skeleton-kicker,.article-skeleton-title,.article-skeleton-meta,.article-skeleton-grid span,.article-skeleton-grid aside{background:linear-gradient(90deg,rgba(255,255,255,.035),rgba(255,255,255,.09),rgba(255,255,255,.035));background-size:220% 100%;animation:wiki-skeleton 1.25s linear infinite}
.article-skeleton-kicker{width:22%;height:10px}.article-skeleton-title{width:58%;height:46px;margin:.15rem 0}.article-skeleton-meta{width:40%;height:18px}
.article-skeleton-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,300px);gap:2rem;margin-top:1rem}.article-skeleton-grid>div{display:grid;gap:.7rem;align-content:start}.article-skeleton-grid span{height:13px}.article-skeleton-grid span:nth-child(2){width:88%}.article-skeleton-grid span:nth-child(3){width:95%}.article-skeleton-grid span:nth-child(4){width:72%}.article-skeleton-grid span:nth-child(5){width:84%}.article-skeleton-grid aside{height:320px}
@keyframes wiki-skeleton{to{background-position:-220% 0}}

.wiki-article-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: start;
}
.wiki-article-enter {
  animation: wiki-article-in .2s cubic-bezier(.2,.7,.2,1) both;
}
@keyframes wiki-article-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}


.wiki-article-main {
  min-width: 0;
}

.legacy-article-notice {
  display: grid;
  gap: .22rem;
  margin: 0 0 .85rem;
  padding: .7rem .85rem;
  border: 1px solid rgba(176,132,77,.34);
  border-radius: 9px;
  background: rgba(176,132,77,.055);
  color: #b9a58b;
}
.legacy-article-notice strong {
  color: #d8c4a4;
  font-size: .76rem;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.legacy-article-notice span {
  font-size: .72rem;
  line-height: 1.45;
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
  color: #91cfe0;
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
  color: #91a7b1;
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
  color: #667f8b;
  font-size: .7rem;
}

.wiki-infobox-card dd {
  margin: 0;
  color: #afc1c8;
  font-size: .76rem;
}

.talent-registry-block{margin:1.1rem 0 1.6rem}
.talent-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.75rem}
.talent-wiki-card{display:flex;flex-direction:column;gap:.7rem;padding:1rem;border:1px solid rgba(88,220,197,.16);background:linear-gradient(145deg,rgba(43,146,255,.055),rgba(255,255,255,.012));box-shadow:0 10px 28px rgba(0,0,0,.12)}
.talent-wiki-card header{display:flex;align-items:flex-start;justify-content:space-between;gap:.8rem}.talent-wiki-card header span{color:#709aad;font-size:.6rem;text-transform:uppercase;letter-spacing:.06em}.talent-wiki-card h3{margin:.16rem 0 0;color:#dce8ec;font:500 1.05rem/1.2 Georgia,serif}.talent-wiki-card header>strong{flex:0 0 auto;color:#91cfe0;font-size:.72rem}
.talent-wiki-meta{display:flex;flex-wrap:wrap;gap:.35rem}.talent-wiki-meta span{padding:.24rem .38rem;border:1px solid rgba(255,255,255,.07);color:#718a95;font-size:.62rem}
.talent-wiki-lore{margin:0;color:#91a7b1;font-size:.76rem;line-height:1.55}
.talent-wiki-mechanics{margin-top:auto;padding:.7rem .75rem;border-left:2px solid rgba(88,220,197,.36);background:rgba(0,0,0,.13)}.talent-wiki-mechanics small{display:block;margin-bottom:.28rem;color:#6fb9d6;font-size:.58rem;letter-spacing:.08em}.talent-wiki-mechanics p{margin:0;color:#afc1c8;font-size:.72rem;line-height:1.5}
.talent-registry-empty{padding:.9rem;border:1px dashed rgba(255,255,255,.1);color:#718a95;font-size:.75rem}
.wiki-mechanics-card{padding:1rem;border:1px solid rgba(88,220,197,.24);background:linear-gradient(145deg,rgba(43,146,255,.08),rgba(255,255,255,.014));box-shadow:inset 0 1px rgba(255,255,255,.025)}
.wiki-mechanics-head{display:flex;justify-content:space-between;gap:.8rem;align-items:flex-start;margin-bottom:.7rem}.wiki-mechanics-head strong{display:block;color:#dce8ec;font:500 1rem/1.2 Georgia,serif}.wiki-mechanics-head>span{padding:.2rem .38rem;border:1px solid rgba(112,168,121,.22);color:#9fbd9d;font-size:.58rem;text-transform:uppercase;letter-spacing:.05em}
.wiki-mechanics-record+.wiki-mechanics-record{margin-top:.8rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.07)}.wiki-mechanics-record header{display:flex;justify-content:space-between;gap:.6rem;margin-bottom:.5rem}.wiki-mechanics-record header strong{color:#c5d4d9;font-size:.76rem}.wiki-mechanics-record header small{color:#718a95;font-size:.62rem}
.wiki-mechanics-record dl{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:.34rem .65rem;margin:0}.wiki-mechanics-record dt{color:#718a95;font-size:.64rem}.wiki-mechanics-record dd{margin:0;color:#afc1c8;font-size:.68rem;text-align:right;overflow-wrap:anywhere}.wiki-mechanics-note{margin:.75rem 0 0;padding-top:.65rem;border-top:1px solid rgba(255,255,255,.06);color:#667f8b;font-size:.62rem;line-height:1.4}
.wiki-builder-usage{padding:1rem;border:1px solid rgba(88,220,197,.18);background:rgba(43,146,255,.045)}
.wiki-builder-intro{margin:.1rem 0 .75rem;color:#718a95;font-size:.72rem;line-height:1.45}
.wiki-builder-usage-list{display:grid;gap:.45rem}
.wiki-builder-usage-list article{display:grid;gap:.14rem;padding:.55rem .6rem;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.015)}
.wiki-builder-usage-list article>span{color:#8fb7c5;font-size:.62rem;text-transform:uppercase;letter-spacing:.06em}
.wiki-builder-usage-list strong{color:#d7e3e7;font-size:.78rem}
.wiki-builder-usage-list small{color:#718a95;font-size:.68rem;line-height:1.35}
.wiki-toc {
  display: grid;
  gap: .15rem;
}

.wiki-toc button {
  padding: .35rem .2rem;
  border: 0;
  color: #a6bac2;
  background: transparent;
  text-align: left;
  font-size: .78rem;
}

.wiki-toc button:hover {
  color: #c7eaf2;
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
  color: #afc1c8;
  text-align: left;
}

.wiki-related-grid button:hover {
  border-color: rgba(216,189,133,.35);
  background: rgba(43,146,255,.08);
}

.wiki-related-grid span {
  color: #6fb9d6;
  font-size: .65rem;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.wiki-related-grid strong {
  font-family: Georgia, serif;
  font-weight: 500;
}

.wiki-related-grid small {
  color: #718a95;
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
  color: #7f98a3;
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
  color: #a6bac2;
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
  color: #dce8ec;
}

.article-section h2 {
  margin-top: 2rem;
  font-size: 1.65rem;
}

.article-paragraph {
  color: #afc1c8;
  line-height: 1.72;
  white-space: pre-line;
}

.article-paragraph.lore {
  color: #c5d4d9;
}

.article-paragraph.list {
  padding-left: 1rem;
  border-left: 2px solid rgba(43,146,255, .35);
}

.article-paragraph.tech {
  margin: .75rem 0;
  padding: .8rem 1rem;
  border: 1px solid rgba(88, 220, 197, .18);
  border-left: 3px solid rgba(88, 220, 197, .45);
  border-radius: .5rem;
  background: rgba(16, 32, 42, .45);
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
  color: #afc1c8;
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
  color: #91a7b1;
  text-align: center;
}

.article-placeholder h2 {
  margin: .2rem 0 .7rem;
  color: #d3e0e4;
  font-family: Georgia, serif;
  font-weight: 500;
}

:deep(.wiki-link) {
  color: #91cfe0;
  text-decoration: underline;
  text-decoration-color: rgba(216, 189, 133, .45);
  text-decoration-thickness: 1px;
  text-underline-offset: .18em;
  cursor: pointer;
}

:deep(.wiki-link:hover),
:deep(.wiki-link:focus-visible) {
  color: #c7eaf2;
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
  color: #eef6f8;
  font: 500 1.15rem/1.2 Georgia, serif;
}

.wiki-hover-preview small {
  color: #91a7b1;
}

.wiki-hover-preview p {
  margin: 0;
  color: #afc1c8;
  font-size: .84rem;
  line-height: 1.55;
}

.wiki-hover-preview > span {
  color: #58dcc5;
  font-size: .72rem;
}

.wiki-hover-kicker {
  color: #58dcc5;
  font-size: .68rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}

@media (max-width: 940px) {
  .article-skeleton-grid{grid-template-columns:1fr}.article-skeleton-grid aside{height:180px}

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

/* Approved V2 visual system */
.compendium-shell{
  background:
    radial-gradient(circle at 12% -5%,rgba(32,96,111,.20),transparent 32rem),
    radial-gradient(circle at 88% 12%,rgba(111,67,145,.11),transparent 28rem),
    linear-gradient(180deg,#09121a,#071019);
}
.compendium-topbar{
  min-height:68px;
  border-bottom-color:rgba(82,134,151,.34);
  background:rgba(8,15,23,.96);
  backdrop-filter:blur(18px) saturate(1.14);
  box-shadow:0 12px 34px rgba(0,0,0,.25);
}
.wiki-create-link{border-color:rgba(88,220,197,.35)!important;color:#b8dfea!important}
.compendium-page{padding:1.45rem 0 4.5rem}
.compendium-hero{
  min-height:205px;
  margin-bottom:1.25rem;
  padding:.9rem 1.15rem;
  border-color:#1f4a60;
  border-radius:11px;
  background:
    radial-gradient(circle at 84% 72%,rgba(43,146,255,.10),transparent 24rem),
    radial-gradient(circle at 96% 48%,rgba(166,124,230,.07),transparent 20rem),
    linear-gradient(135deg,rgba(10,24,34,.95),rgba(7,16,24,.90));
}
.compendium-hero-logo{width:min(255px,62vw)!important;margin:0 0 .45rem}
.compendium-earth-horizon{opacity:.27}
.compendium-stats,.compendium-search,.compendium-results,.compendium-article{
  border-color:#203f4d;
  background:linear-gradient(145deg,rgba(13,25,34,.96),rgba(8,17,24,.94));
}
.category-chip.active,.favorite-button.active,.collection-toggle.active{
  border-color:#2b92ff;
  color:#c7eaf2;
  background:rgba(43,146,255,.10);
}
.result-card.active{box-shadow:inset 3px 0 #58dcc5}



/* Navigation / discovery pass: the left column is navigation only; results live in the reading surface. */
.compendium-workspace {
  grid-template-columns: minmax(270px, 330px) minmax(0, 1fr);
  gap: 1rem;
}

.compendium-navigation {
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 110px);
  overflow: auto;
  border-color: rgba(70,126,148,.14);
  background: rgba(10,20,29,.9);
  scrollbar-width: thin;
}

.navigation-heading {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: .8rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,.075);
  background: rgba(10,20,29,.97);
}

.navigation-heading h2 {
  margin: 0;
  font: 500 1.35rem/1.2 Georgia, serif;
}

.navigation-heading > span {
  max-width: 46%;
  color: #6fb9d6;
  font-size: .68rem;
  text-align: right;
}

.navigation-categories {
  display: grid;
  padding: .55rem;
  border-bottom: 1px solid rgba(255,255,255,.065);
}

.navigation-category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .65rem;
  min-height: 35px;
  padding: .42rem .55rem;
  border: 1px solid transparent;
  color: #91a9b3;
  background: transparent;
  text-align: left;
}

.navigation-category:hover {
  color: #c5e4ea;
  background: rgba(43,146,255,.055);
}

.navigation-category.active {
  border-color: rgba(43,146,255,.3);
  color: #d5edf2;
  background: rgba(43,146,255,.1);
}

.navigation-category small {
  color: #617985;
  font-size: .63rem;
}

.navigation-tree {
  display: grid;
  gap: .5rem;
  padding: .65rem;
}

.navigation-tree-kicker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .6rem;
  padding: .2rem .15rem .45rem;
}

.navigation-tree-kicker strong {
  color: #8bcbd6;
  font-size: .7rem;
  text-transform: uppercase;
  letter-spacing: .07em;
}

.navigation-tree-kicker span {
  color: #617985;
  font-size: .62rem;
}

.navigation-group {
  border: 1px solid rgba(255,255,255,.075);
  background: rgba(255,255,255,.012);
}

.navigation-group > summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .65rem;
  padding: .62rem .7rem;
  cursor: pointer;
  list-style: none;
  color: #afc4cc;
  font-size: .75rem;
  font-weight: 700;
}

.navigation-group > summary::-webkit-details-marker { display: none; }

.navigation-group > summary::before {
  content: "›";
  margin-right: .25rem;
  color: #58dcc5;
  transform: rotate(0deg);
  transition: transform .15s ease;
}

.navigation-group[open] > summary::before {
  transform: rotate(90deg);
}

.navigation-group > summary span { flex: 1; }
.navigation-group > summary small {
  color: #617985;
  font-size: .62rem;
}

.navigation-group-body {
  display: grid;
  gap: .65rem;
  padding: 0 .45rem .5rem;
  border-top: 1px solid rgba(255,255,255,.045);
}

.navigation-subgroup {
  display: grid;
  gap: .18rem;
  padding-top: .5rem;
}

.navigation-subgroup > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  padding: 0 .35rem .2rem;
  color: #6fb9d6;
  font-size: .63rem;
  text-transform: uppercase;
  letter-spacing: .055em;
}

.navigation-subgroup > header small { color: #566e79; }

.navigation-page {
  width: 100%;
  padding: .42rem .5rem;
  border: 0;
  border-left: 2px solid transparent;
  color: #8da4ae;
  background: transparent;
  text-align: left;
  font-size: .69rem;
  line-height: 1.35;
}

.navigation-page:hover {
  color: #d0e7ec;
  background: rgba(43,146,255,.045);
}

.navigation-page.active {
  border-left-color: #2b92ff;
  color: #d9f0f3;
  background: rgba(43,146,255,.09);
}

.navigation-hint,
.navigation-empty,
.navigation-archive-note {
  margin: .7rem;
  padding: .75rem;
  border: 1px solid rgba(255,255,255,.06);
  color: #718a95;
  background: rgba(255,255,255,.012);
  font-size: .72rem;
  line-height: 1.5;
}

.search-results-main,
.category-overview {
  padding: clamp(1rem, 2vw, 1.6rem);
}

.surface-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,.075);
}

.surface-heading h1 {
  margin: .1rem 0 .35rem;
  font: 500 clamp(1.7rem, 3vw, 2.5rem)/1.05 Georgia, serif;
}

.surface-heading p {
  max-width: 760px;
  margin: 0;
  color: #829aa5;
  font-size: .82rem;
  line-height: 1.55;
}

.surface-count {
  min-width: 94px;
  display: grid;
  gap: .1rem;
  padding: .65rem .75rem;
  border: 1px solid rgba(88,220,197,.2);
  text-align: center;
}

.surface-count strong {
  color: #63e0ca;
  font-size: 1.2rem;
}

.surface-count span {
  color: #718a95;
  font-size: .62rem;
  text-transform: uppercase;
  letter-spacing: .055em;
}

.main-result-list {
  display: grid;
  gap: 1rem;
}

.main-result-group {
  display: grid;
  gap: .5rem;
}

.main-result-group > header {
  display: flex;
  justify-content: space-between;
  gap: .6rem;
  padding: .2rem .1rem .45rem;
  border-bottom: 1px solid rgba(255,255,255,.055);
}

.main-result-group > header strong {
  color: #8fc9d5;
  font-size: .72rem;
  text-transform: uppercase;
  letter-spacing: .065em;
}

.main-result-group > header span {
  color: #617985;
  font-size: .68rem;
}

.main-result-card {
  padding: .85rem 1rem;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 8px;
  background: rgba(255,255,255,.012);
}

.main-result-card:hover {
  border-color: rgba(43,146,255,.32);
  background: rgba(43,146,255,.055);
}

.main-result-card > strong {
  color: #d8e7eb;
  font-size: .95rem;
}

.main-result-card > p {
  margin: 0;
  color: #8199a3;
  font-size: .74rem;
  line-height: 1.48;
}

.result-path {
  color: #6fb9d6;
  font-size: .63rem;
  line-height: 1.35;
}

.result-limit-note,
.category-more {
  margin: .35rem 0 0;
  color: #617985;
  font-size: .68rem;
}

.category-group-grid {
  display: grid;
  gap: .85rem;
}

.category-group-card {
  border: 1px solid rgba(255,255,255,.075);
  background: rgba(255,255,255,.012);
}

.category-group-card > header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: .85rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.category-group-card > header h2 {
  margin: .1rem 0 0;
  font: 500 1.25rem/1.2 Georgia, serif;
}

.category-group-card > header > span {
  color: #63e0ca;
  font-size: .74rem;
}

.category-subgroup-list {
  display: grid;
  gap: .85rem;
  padding: .85rem 1rem 1rem;
}

.category-subgroup-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .7rem;
  margin-bottom: .35rem;
}

.category-subgroup-title strong {
  color: #7fb6c4;
  font-size: .68rem;
  text-transform: uppercase;
  letter-spacing: .055em;
}

.category-subgroup-title span {
  color: #617985;
  font-size: .64rem;
}

.category-page-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .38rem;
}

.category-page-links button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
  padding: .58rem .65rem;
  border: 1px solid rgba(255,255,255,.06);
  color: #a9bec6;
  background: rgba(8,16,24,.35);
  text-align: left;
}

.category-page-links button:hover {
  border-color: rgba(88,220,197,.25);
  color: #d6edf1;
  background: rgba(43,146,255,.045);
}

.category-page-links button small {
  color: #5f9eaf;
  white-space: nowrap;
}

.main-empty-results {
  margin: 1rem 0 0;
  padding: 1rem;
  border: 1px dashed rgba(255,255,255,.09);
  color: #718a95;
  text-align: center;
}

@media(max-width: 980px) {
  .compendium-workspace {
    grid-template-columns: 1fr;
  }
  .compendium-navigation {
    position: static;
    max-height: none;
  }
}

@media(max-width: 680px) {
  .surface-heading {
    align-items: stretch;
    flex-direction: column;
  }
  .surface-count {
    align-self: flex-start;
  }
  .category-page-links {
    grid-template-columns: 1fr;
  }
}

</style>
