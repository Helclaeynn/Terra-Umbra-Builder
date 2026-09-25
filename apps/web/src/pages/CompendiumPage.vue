<script setup lang="ts">
import TerraUmbraBrand from "../components/TerraUmbraBrand.vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { isNavigationFailure, NavigationFailureType, RouterLink, useRoute, useRouter } from "vue-router";
import { api, ApiError } from "../lib/api";
import CompendiumOnboarding from "../components/CompendiumOnboarding.vue";
import CompendiumDiscovery from "../components/CompendiumDiscovery.vue";
import CompendiumHologramComparison from "../components/CompendiumHologramComparison.vue";
import NpcStatProfile from "../components/NpcStatProfile.vue";
import { isNpcStatProfileSection } from "../lib/npc-stat-profile";
import { parseReadingPositions, rememberReading, type ReadingPositions } from "../lib/compendium-reading";
import { createRenderCache } from "../lib/render-cache";
import { createWikiLinker } from "../lib/wiki-linker";
import {
  compendiumHref, compendiumLinkTarget, compendiumTarget, positionCompendiumArticle,
  searchResultTarget, sectionDomId, sectionTargetId
} from "../lib/compendium-navigation";
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
  sectionId?: string;
  section?: string;
  href?: string;
};

type ArticleBlock = {
  type?: string;
  text?: unknown;
  style?: unknown;
  rows?: unknown[][];
  src?: string;
  mobileSrc?: string;
  alt?: string;
  caption?: string;
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
  realityName?: string;
  category?: string;
  dataset?: string;
  source?: string;
  status?: string;
  tags?: string[];
  secretTags?: string[];
  manufacturer?: string;
  sections?: ArticleSection[];
  navigation?: {
    group?: string;
    subgroup?: string;
  };
  pnj?: Record<string, unknown>;
  image?: string | MediaRef;
  illustration?: string | MediaRef;
  brandLogo?: MediaRef;
  brandCorporationId?: string;
  gallery?: MediaRef[];
  __editorialOverride?: boolean;
  __wikiPublishedEdit?: boolean;
};

const route = useRoute();
const router = useRouter();

const meta = ref<Meta | null>(null);
const query = ref("");
const category = ref("");
const searchFamily=ref("");
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
const articlePanel = ref<HTMLElement | null>(null);
let articleRequest = 0;
let pageMounted = false;
const mountedPath = route.path;
let previousScrollRestoration: ScrollRestoration = "auto";
const builderUsage = ref<BuilderUsage[]>([]);
const builderSources = ref<BuilderSourceRecord[]>([]);
const talentEmbeds = ref<Record<string, TalentRegistryRow[]>>({});
const loading = ref(false);
const articleLoading = ref(false);
const articleUnavailable = ref(false);
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
const searchOpen = ref(false);
const libraryOpen = ref(false);
const navigationOpen = ref(false);
const smallScreen = ref(false);
const readerFontSize = ref(17);
const readerFocus = ref(false);
const currentSectionId = ref("");
const readingPositions = ref<ReadingPositions>({});
const readingNotice = ref("");
const contentsDialog = ref<HTMLDialogElement | null>(null);
let contentsOpener: HTMLElement | null = null;
let readingObserver: IntersectionObserver | null = null;
let readingArmed = false;
const articleReturnHref = ref("/compendium");
const articleReturnLabel = ref("Vue d’ensemble");
const wikiReady = ref(false);
const wikiPreviewEl = ref<HTMLElement | null>(null);
const WIKI_PREVIEW_ID = "compendium-wiki-preview";
const wikiPreview = ref({
  visible: false,
  id: "",
  title: "",
  category: "",
  context: "",
  sectionTitle: "",
  snippet: "",
  mediaSrc: "",
  left: 12,
  top: 12,
  width: 360
});
let wikiLinker: any = null;
const wikiById = new Map<string, WikiEntry>();
const wikiPreviewCache = new Map<string, { snippet: string; sectionTitle?: string; media?: string | MediaRef | null }>();
let wikiPreviewTimer: number | undefined;
let wikiBootstrapTimer: number | undefined;
let wikiPreviewLink: HTMLAnchorElement | null = null;

const RECENT_STORAGE_KEY = "tuc-compendium-recent-v1";
const RECENT_LOCAL_LIMIT = 30;
const retiredCategoryRequested = computed(() => route.query.category === "OLD");
const discoveryMode = computed<"home" | "guide" | "journey">(() => route.query.view === "journey" ? "journey" : route.query.view === "guide" || route.query.start === "1" ? "guide" : "home");
const activeLayer = computed(() => (selected.value?.category || category.value) === "Vérité" ? "truth" : "reality");
const orbitalImage = computed(() => `/brand/orbital/orbital-earth${activeLayer.value === "truth" ? "-truth" : ""}.webp`);

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
  if (!activeCategory) return [] as WikiEntry[];

  return [...wikiById.values()].filter((entry) => entry.category === activeCategory);
});

const GROUP_PRIORITY: Record<string,string[]> = {
  'Équipement & Objets':['Armement','Armures & protections','Munitions & consommables','Holonet & Neurodive','Habitat & mobilité','Vie quotidienne & services','Augmentations · Cybernétique','Augmentations · Biogénétique','Augmentations · Esthétique & fonctionnel','Équipement de Chasse','Marché des Exilés','Marché xéno','Arsenal AIDH','Corruption & Calamitechnologie'],
  'Règles':['Moteur commun','Réalité — Création & progression','Réalité — Talents & désavantages','Réalité — Économie & équipement','Réalité — Augmentations','Réalité — Neurodive','Vérité — Règles communes','Vérité — Natures & capacités','Vérité — Corruption & Fléaux'],
  'Réalité':['Grande Californie & société','Corporations & économie','Institutions & sécurité','Pègre, Crawlers & anti-systèmes','Religions & néoreligions'],
  'Vérité':['Entrer dans la Vérité','Cosmologie & histoire cachée','Peuples & Natures','Natures, peuples & traditions','Chasseurs & traditions','Chasseurs','Factions de Vérité','Créatures & phénomènes','Corruption & Fléaux'],
  'Bestiaire':['Faune de Vérité','Prédateurs monstrueux','Métamorphes','Fées & esprits naturels','Revenants','Ombres & entités de l’Ombremonde','Fléaux, Ruptures & Abominations','PNJ de Réalité','PNJ de Vérité','Dossiers majeurs de scénario']
};
function navigationLabels(entry:Pick<WikiEntry,'category'|'group'|'subgroup'>){
  let group=entry.group||'Autres',subgroup=entry.subgroup||'Pages';
  if(entry.category==='Équipement & Objets'){
    const parts=subgroup.split(' — ');
    if(group==='Équipement de Réalité'&&parts.length>1){group=parts[0];subgroup=parts[1]==='Neuroprogrammes'?'Neuroprogrammes':parts.slice(1).join(' — ');}
    else if(group==='Objets de Vérité'&&parts.length>1){group=parts[0];subgroup=parts.slice(1).join(' — ');}
    else if(group==='Augmentations'&&parts.length>1){group=`Augmentations · ${parts[0]}`;subgroup=parts.slice(1).join(' — ');}
  }
  return {group,subgroup};
}
function navigationOrder(categoryName:string,label:string){const n=GROUP_PRIORITY[categoryName]?.indexOf(label)??-1;return n<0?999:n;}

const navigationGroups = computed(() => {
  const groups = new Map<string, Map<string, WikiEntry[]>>();

  for (const entry of navigationEntries.value) {
    const {group:groupName,subgroup:subgroupName}=navigationLabels(entry);
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
      entries:entries.sort((a,b)=>a.title.localeCompare(b.title,'fr',{numeric:true,sensitivity:'base'}))
    })).sort((a,b)=>a.name.localeCompare(b.name,'fr',{numeric:true,sensitivity:'base'}))
  })).sort((a,b)=>navigationOrder(category.value,a.name)-navigationOrder(category.value,b.name)||a.name.localeCompare(b.name,'fr',{sensitivity:'base'}));
});
const searchFamilies=computed(()=>category.value?navigationGroups.value.map(group=>group.name):[]);
async function removeSearchFilter(key:'query'|'category'|'group'|'manufacturer'){
  if(key==='query')query.value='';
  if(key==='category'){category.value='';searchFamily.value='';manufacturer.value='';}
  if(key==='group')searchFamily.value='';
  if(key==='manufacturer')manufacturer.value='';
  clearSuggestions();
  await search();
}

const hasResultSurface = computed(() =>
  !selected.value &&
  Boolean(
    query.value.trim() ||
    searchFamily.value ||
    manufacturer.value ||
    activeLibraryView.value ||
    retiredCategoryRequested.value || route.query.view === "all"
  )
);

const hasCategorySurface = computed(() =>
  !selected.value &&
  Boolean(category.value) &&
  !query.value.trim() &&
  !searchFamily.value &&
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
  if (searchFamily.value)return `Dossier · ${searchFamily.value}`;
  if (manufacturer.value) return `Fabricant · ${manufacturer.value}`;
  return "Tous les articles";
});

function resultBreadcrumb(item: SearchItem | WikiEntry): string {
  const navigation=navigationLabels(item);
  return [
    item.category || "",
    navigation.group || "",
    navigation.subgroup || "",
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
const canSearchTruthTags = computed(() =>
  currentUser.value?.role === "gm" || currentUser.value?.role === "admin"
);
const canReadMjSections = computed(() => ["gm", "editor", "admin"].includes(currentUser.value?.role || ""));
const articleSections = computed(() => (selected.value?.sections || []).map((section, index) => ({ section, index })).filter(({ section }) => section.audience !== "mj" || canReadMjSections.value));
function hasNpcStatProfile(section: ArticleSection): boolean {
  return selected.value?.category === "Personnages" && isNpcStatProfileSection(section)
    && (section.blocks || []).every(block => block.type === "p" || block.type === "table");
}

function searchForTag(tag: string) {
  category.value = "";
  manufacturer.value = "";
  query.value = `tag:"${tag.replace(/"/g, "")}"`;
  void search();
}

const selectedMedia = computed(() => primaryArticleMedia(selected.value));
const showLargeArticleMedia = computed(() =>
  Boolean(selectedMedia.value && ["Équipement & Objets", "Bestiaire"].includes(selected.value?.category || ""))
);

const articleToc = computed(() =>
  articleSections.value
    .map(({ section, index }) => ({
      id: sectionDomId(section, index),
      title: String(section.title ?? "").trim(),
      level: Number(section.level ?? 2)
    }))
    .filter((item) => item.title)
);
const currentSection = computed(() => articleToc.value.find(item => item.id === currentSectionId.value) || articleToc.value[0]);
const selectedResume = computed(() => {
  if (!selected.value) return null;
  const saved = readingPositions.value[selected.value.id];
  const id = saved ? sectionTargetId(selected.value.sections || [], saved.sectionId) : null;
  return id ? articleToc.value.find(item => item.id === id) || null : null;
});
const latestResume = computed(() => {
  void wikiReady.value;
  for (const [id, saved] of Object.entries(readingPositions.value).sort((a, b) => b[1].updatedAt - a[1].updatedAt)) {
    const entry = wikiById.get(id);
    if (entry) return { id, title: entry.title, sectionId: saved.sectionId, sectionTitle: "Votre dernière section" };
  }
  return undefined;
});

function readingStorageKey() { return `tuc-compendium-reading-v1:${currentUser.value?.id || "public"}`; }
function loadReadingPositions() {
  try { readingPositions.value = parseReadingPositions(localStorage.getItem(readingStorageKey())); } catch { readingPositions.value = {}; }
}
function saveReading(sectionId: string) {
  if (!selected.value || !articleToc.value.some(item => item.id === sectionId)) return;
  readingPositions.value = rememberReading(readingPositions.value, selected.value.id, sectionId);
  try { localStorage.setItem(readingStorageKey(), JSON.stringify(readingPositions.value)); } catch { readingNotice.value = "Reprise disponible pour cette session uniquement."; }
}
function installReadingObserver() {
  readingObserver?.disconnect();
  if (!selected.value || !articlePanel.value || typeof IntersectionObserver === "undefined") return;
  const visible = new Set<Element>();
  readingObserver = new IntersectionObserver(entries => {
    for (const entry of entries) { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); }
    const first = [...visible].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (first) { currentSectionId.value = first.id; if (readingArmed) saveReading(first.id); }
  }, { rootMargin: "-170px 0px -45% 0px", threshold: 0 });
  articlePanel.value.querySelectorAll(".article-section").forEach(section => readingObserver?.observe(section));
}
function readingIntent(event: Event) {
  if (!selected.value || (event.target instanceof Element && event.target.closest("button,a,input,select,textarea,dialog"))) return;
  readingArmed = true;
}
function updateScreen() {
  const nextSmall = window.innerWidth <= 900;
  if (nextSmall !== smallScreen.value) navigationOpen.value = false;
  smallScreen.value = nextSmall;
}
function skipToContent(event: MouseEvent) {
  event.preventDefault();
  const main = document.getElementById("compendium-main");
  main?.focus({ preventScroll: true });
  main?.scrollIntoView({ behavior: "instant", block: "start" });
}
async function focusSearch() {
  // Clear the URL query too: route changes otherwise restore its old value
  // into the input after Ctrl K has already cleared the local Vue ref.
  await router.push({ path: "/compendium", query: { view: "all" } });
  window.clearTimeout(suggestionTimer);
  ++suggestionRequest;
  query.value = "";
  category.value = "";
  manufacturer.value = "";
  clearSuggestions();
  searchOpen.value = true;
  await nextTick();
  document.querySelector<HTMLInputElement>('input[aria-label="Recherche dans le Compendium"]')?.focus();
}
function compendiumKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && wikiPreview.value.visible) hideWikiPreview();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    void focusSearch();
  }
  if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) readingIntent(event);
}
function openContents(event: MouseEvent) {
  contentsOpener = event.currentTarget as HTMLElement;
  contentsDialog.value?.showModal();
  contentsDialog.value?.querySelector<HTMLButtonElement>("button")?.focus();
}
function closeContents(restore = true) {
  if (!restore) contentsOpener = null;
  contentsDialog.value?.close();
}
function contentsClosed() { if (contentsOpener?.isConnected) contentsOpener.focus(); contentsOpener = null; }
function followSection(event: MouseEvent, section: string) {
  if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !selected.value) return;
  event.preventDefault(); closeContents(false); void openArticle(selected.value.id, section);
}
function resumeLastReading() { if (latestResume.value) void openArticle(latestResume.value.id, latestResume.value.sectionId); }

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

async function positionArticle(section: string, request: number) {
  await nextTick();
  if (!pageMounted || request !== articleRequest || !selected.value || !articlePanel.value) return;
  const headerHeight = document.querySelector(".compendium-topbar")?.getBoundingClientRect().height ?? 74;
  articlePanel.value.style.setProperty("--compendium-anchor-offset", `${headerHeight + 88}px`);
  readingArmed = false;
  const targetId = sectionTargetId(selected.value.sections || [], section);
  if(targetId){const target=document.getElementById(targetId);target?.querySelector<HTMLDetailsElement>('details.article-disclosure')?.setAttribute('open','');}
  positionCompendiumArticle(articlePanel.value, selected.value.sections ?? [], section);
  currentSectionId.value = articleToc.value.find(item => item.id === targetId)?.id || articleToc.value[0]?.id || "";
  if (section && targetId) saveReading(targetId);
  installReadingObserver();
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

const textRenderCache=createRenderCache();
function linkifyText(value: unknown, article: Article | null = selected.value): string {
  void wikiReady.value;
  const text=String(value??"");
  return textRenderCache.get(JSON.stringify([wikiContext(article),text]),()=>renderLinkedText(text,article));
}
function renderLinkedText(value: unknown, article: Article | null = selected.value): string {
  void wikiReady.value;
  const text = String(value ?? "");
  const renderText = (part: string) => wikiLinker?.linkify(part, wikiContext(article)) ?? escapeHtml(part);
  // Preserve explicit Compendium Markdown links before automatic wiki linking.
  // Labels stay escaped and only same-origin article destinations are enabled.
  let html = "", offset = 0;
  for (const match of text.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)) {
    const target = compendiumLinkTarget(match[2], window.location.href);
    if (!target) continue;
    html += renderText(text.slice(offset, match.index));
    html += `<a class="wiki-link" data-wiki-id="${escapeHtml(target.articleId)}" href="${escapeHtml(compendiumHref(target.articleId, target.section))}">${escapeHtml(match[1])}</a>`;
    offset = match.index! + match[0].length;
  }
  html += renderText(text.slice(offset));
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
    textRenderCache.clear();
    wikiById.clear();
    for (const entry of payload.entries) wikiById.set(entry.id, entry);

    wikiLinker = (createWikiLinker as any)(payload.entries, {
      explicitTargets: WIKI_EXPLICIT_TARGETS,
      strictSurfaceAliases: WIKI_STRICT_SURFACE_ALIASES,
      caseSensitiveAliases: WIKI_CASE_SENSITIVE_ALIASES,
      searchFallbacks: WIKI_SEARCH_FALLBACKS,
      hrefForId: (id: string) => compendiumHref(id),
      hrefForSection: (id: string, section: string) => compendiumHref(id, section),
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

function showRecent(syncRoute = true) {
  if (syncRoute) { void router.push({ path: "/compendium", query: { view: "recent" } }); return; }
  showOnboarding.value = false;
  selected.value = null;
  activeLibraryView.value = "recent";
  query.value = "";
  category.value = "";
  manufacturer.value = "";
  results.value = recentItems.value;
  total.value = recentItems.value.length;
}

function showFavorites(syncRoute = true) {
  if (syncRoute) { void router.push({ path: "/compendium", query: { view: "favorites" } }); return; }
  showOnboarding.value = false;
  selected.value = null;
  activeLibraryView.value = "favorites";
  query.value = "";
  category.value = "";
  manufacturer.value = "";
  results.value = favoriteItems.value;
  total.value = favoriteItems.value.length;
}

function showCollection(collection: LibraryCollection, syncRoute = true) {
  if (syncRoute) { void router.push({ path: "/compendium", query: { view: "collection", collection: collection.id } }); return; }
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
    if (searchFamily.value)params.set('group',searchFamily.value);
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
  await openSearchResult(item);
}

async function openSearchResult(item: SearchItem) {
  const target = searchResultTarget(item, window.location.href);
  await openArticle(target.articleId, target.section);
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

function handleSearchInput() {
  scheduleSuggestions();
}

async function search(syncRoute = true) {
  if (syncRoute) {
    const destination: Record<string, string> = {};
    if (query.value.trim()) destination.q = query.value.trim();
    if (category.value) destination.category = category.value;
    if (searchFamily.value)destination.group=searchFamily.value;
    if (manufacturer.value) destination.manufacturer = manufacturer.value;
    if (!Object.keys(destination).length) destination.view = "all";
    const failure = await router.push({ path: "/compendium", query: destination });
    if (isNavigationFailure(failure, NavigationFailureType.duplicated)) await search(false);
    return;
  }
  const request = ++articleRequest;
  articleLoading.value = false;
  searchFocused.value = false;
  clearSuggestions();
  activeLibraryView.value = "";
  loading.value = true;
  error.value = "";
  showOnboarding.value = false;

  try {
    const params = new URLSearchParams();
    if (query.value.trim()) params.set("q", query.value.trim());
    if (category.value) params.set("category", category.value);
    if (searchFamily.value)params.set('group',searchFamily.value);
    if (manufacturer.value) params.set("manufacturer", manufacturer.value);
    params.set("limit", "60");

    const result = await api<{
      total: number;
      items: SearchItem[];
    }>(`/api/compendium/search?${params.toString()}`);
    if (request !== articleRequest || !pageMounted) return;

    results.value = result.items;
    total.value = result.total;
    selected.value = null;
  } catch (cause) {
    if (request !== articleRequest || !pageMounted) return;
    results.value = [];
    total.value = 0;
    error.value = humanError(cause);
  } finally {
    if (request === articleRequest) loading.value = false;
  }
}

async function openArticle(id: string, section = "") {
  if (!selected.value) { articleReturnHref.value = route.fullPath; articleReturnLabel.value = showOnboarding.value ? (discoveryMode.value === "home" ? "Vue d’ensemble" : discoveryMode.value === "journey" ? "Parcours de lecture" : "Bien commencer") : activeLibraryView.value ? resultSurfaceTitle.value : category.value || resultSurfaceTitle.value; }
  closeContents(false);
  navigationOpen.value = false;
  searchOpen.value = false;
  const href = compendiumHref(id, section);
  // Vue Router suppresses duplicate navigations. An explicit second click must
  // still return to the requested section, or to the beginning of this article.
  if (route.fullPath === href) {
    await loadArticle(id, section);
  } else {
    const failure = await router.push(href);
    if (isNavigationFailure(failure, NavigationFailureType.duplicated)) await loadArticle(id, section);
  }
}

async function loadArticle(id: string, section = "") {
  const request = ++articleRequest;
  loading.value = false;
  showOnboarding.value = false;
  readingArmed = false;
  readerFocus.value = false;
  navigationOpen.value = false;
  closeContents(false);
  if (selected.value?.id === id && !articleLoading.value) {
    await positionArticle(section, request);
    return;
  }
  articleLoading.value = true;
  articleUnavailable.value = false;
  selected.value = null;
  error.value = "";
  textRenderCache.clear();
  builderUsage.value = [];
  builderSources.value = [];
  talentEmbeds.value = {};

  try {
    const result = await api<{ article: Article }>(
      `/api/compendium/articles/${encodeURIComponent(id)}`
    );
    if (request !== articleRequest || !pageMounted) return;

    // Primary content becomes visible immediately. Builder context, dynamic
    // Talents and history enrich the already rendered article afterwards.
    selected.value = result.article;

    // Do not wait for optional Builder enrichment before showing the article.
    const usage = api<{ usage: BuilderUsage[]; sources: BuilderSourceRecord[] }>(
      `/api/compendium/builder-usage/${encodeURIComponent(id)}`
    ).catch(() => ({
      usage: [] as BuilderUsage[],
      sources: [] as BuilderSourceRecord[]
    }));
    void usage.then(usageResult => {
      if (request !== articleRequest || !pageMounted) return;
      builderUsage.value = usageResult.usage;
      builderSources.value = usageResult.sources;
    });
    void rememberArticle(id);
    // Dynamic Talent blocks can move a later section. Resolve them before the
    // section landing; an ordinary article link can land immediately at its top.
    if (!section) await positionArticle("", request);
    await loadTalentEmbeds(result.article, request);
    if (section) await positionArticle(section, request);
  } catch (cause) {
    if (request !== articleRequest || !pageMounted) return;
    builderUsage.value = [];
    builderSources.value = [];
    talentEmbeds.value = {};
    articleUnavailable.value = cause instanceof ApiError && cause.status === 404;
    if (!articleUnavailable.value) error.value = humanError(cause);
  } finally {
    if (request === articleRequest) articleLoading.value = false;
  }
}

async function chooseCategory(name: string) {
  showOnboarding.value = false;
  activeLibraryView.value = "";
  selected.value = null;
  query.value = "";
  category.value = category.value === name ? "" : name;
  searchFamily.value='';
  if (category.value !== "Équipement & Objets") manufacturer.value = "";
  await search();
}

async function openNewcomer() {
  await router.push({ path: "/compendium", query: { view: "guide" } });
}

async function closeNewcomer() {
  await router.push({ path: "/compendium" });
}

async function openJourney(id: string) { await router.push({ path: "/compendium", query: { view: "journey", journey: id } }); }
async function browseDiscovery(payload: { category?: string; query?: string }) {
  category.value = payload.category || ""; query.value = payload.query || ""; manufacturer.value = "";
  await search();
}

async function openOnboardingCategory(name: string) {
  category.value = "";
  await chooseCategory(name);
}

async function chooseManufacturer(name: string) {
  selected.value = null;
  activeLibraryView.value = "";
  manufacturer.value = name;
  if (name){category.value = "Équipement & Objets";searchFamily.value='';}
  await search();
}

function closestWikiLink(event: Event): HTMLAnchorElement | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  return target.closest("a");
}

function hideWikiPreview() {
  if (wikiPreviewTimer !== undefined) window.clearTimeout(wikiPreviewTimer);
  wikiPreviewTimer = undefined;
  if (wikiPreviewLink) {
    const descriptions = (wikiPreviewLink.getAttribute("aria-describedby") || "").split(/\s+/).filter(id => id && id !== WIKI_PREVIEW_ID);
    if (descriptions.length) wikiPreviewLink.setAttribute("aria-describedby", descriptions.join(" "));
    else wikiPreviewLink.removeAttribute("aria-describedby");
  }
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
  const section = compendiumLinkTarget(link.href, window.location.href)?.section || link.dataset.wikiSection || "";
  const cacheKey = `${id}#${section}`;

  hideWikiPreview();
  wikiPreviewLink = link;
  link.setAttribute("aria-describedby", [link.getAttribute("aria-describedby"), WIKI_PREVIEW_ID].filter(Boolean).join(" "));
  const cached = wikiPreviewCache.get(cacheKey);
  wikiPreview.value = {
    visible: true,
    id,
    title: entry.title,
    category: entry.category || "Compendium",
    context: [entry.group, entry.subgroup].filter(Boolean).join(" · "),
    sectionTitle: cached?.sectionTitle ?? "",
    snippet: cached?.snippet ?? "",
    mediaSrc: mediaUrl(cached?.media),
    left: wikiPreview.value.left,
    top: wikiPreview.value.top,
    width: wikiPreview.value.width
  };
  void positionWikiPreview(link);

  if (cached) return;
  try {
    const preview = await api<{ id: string; snippet: string; sectionTitle?: string; media?: string | MediaRef | null }>(
      `/api/compendium/wiki-preview/${encodeURIComponent(id)}${section ? `?section=${encodeURIComponent(section)}` : ""}`
    );
    wikiPreviewCache.set(cacheKey, { snippet: preview.snippet, sectionTitle: preview.sectionTitle, media: preview.media });
    if (wikiPreview.value.visible && wikiPreviewLink === link) {
      wikiPreview.value.snippet = preview.snippet;
      wikiPreview.value.sectionTitle = preview.sectionTitle ?? "";
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
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === "_blank" || link.hasAttribute("download")) return;

  const target = compendiumLinkTarget(link.href, window.location.href);
  const id = target?.articleId || link.dataset.wikiId;
  const searchTerm = link.dataset.wikiSearch;
  if (!id && !searchTerm) return;

  event.preventDefault();
  hideWikiPreview();

  if (id) {
    await openArticle(id, target?.section || link.dataset.wikiSection || "");
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

async function loadTalentEmbeds(article:Article, request: number){
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
  if (request === articleRequest && pageMounted) talentEmbeds.value=Object.fromEntries(entries);
}

function blockText(block: ArticleBlock): string {
  if (block && block.type === "p" && "text" in block) return String(block.text ?? "");
  return "";
}

function tableRows(block: ArticleBlock, section?: ArticleSection): unknown[][] {
  if (block && block.type === "table" && "rows" in block && Array.isArray(block.rows)) {
    const rows = block.rows;
    if (
      (section?.id === "identite-realite-consolidee" || section?.id === "identite-realite-restauree") &&
      String(rows[0]?.[0] ?? "").trim().toLowerCase() === "champ" &&
      String(rows[0]?.[1] ?? "").trim().toLowerCase() === "valeur"
    ) return rows.slice(1);
    return rows;
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

function syncRouteView() {
  articleUnavailable.value = false;
  error.value = "";
  closeContents(false);
  navigationOpen.value = false;
  const target = compendiumTarget(route.query, route.hash);
  if (target) { void loadArticle(target.articleId, target.section); return; }
  ++articleRequest;
  articleLoading.value = false;
  selected.value = null;
  readerFocus.value = false;
  readingObserver?.disconnect();
  query.value = typeof route.query.q === "string" ? route.query.q : "";
  category.value = !retiredCategoryRequested.value && typeof route.query.category === "string" ? route.query.category : "";
  searchFamily.value=category.value&&typeof route.query.group==='string'?route.query.group:'';
  manufacturer.value = typeof route.query.manufacturer === "string" ? route.query.manufacturer : "";
  activeLibraryView.value = "";
  if (route.query.view === "recent") { showRecent(false); return; }
  if (route.query.view === "favorites") { showFavorites(false); return; }
  if (route.query.view === "collection" && typeof route.query.collection === "string") {
    showOnboarding.value = false;
    activeLibraryView.value = route.query.collection;
    refreshActiveLibraryView();
    return;
  }
  showOnboarding.value = !retiredCategoryRequested.value && (route.query.view === "guide" || route.query.view === "journey" || route.query.start === "1" || (!query.value.trim() && !category.value && !manufacturer.value && route.query.view !== "all"));
  if (!showOnboarding.value) void search(false);
}

watch(() => currentUser.value?.id, loadReadingPositions);
watch(canReadMjSections, async () => {
  textRenderCache.clear();
  await nextTick();
  const target = compendiumTarget(route.query, route.hash);
  if (target?.section && selected.value?.id === target.articleId) await positionArticle(target.section, articleRequest);
  else installReadingObserver();
});
watch(
  () => route.fullPath,
  () => {
    if (!pageMounted || route.path !== mountedPath) return;
    syncRouteView();
  }
);

onMounted(() => {
  pageMounted = true;
  previousScrollRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = "manual";
  updateScreen(); loadReadingPositions();

  const initialTarget = compendiumTarget(route.query, route.hash);
  const initialArticleId = initialTarget?.articleId || "";

  // The requested content is always the highest-priority network call.
  syncRouteView();

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
  window.addEventListener("resize", updateScreen);
  window.addEventListener("keydown", compendiumKeydown);
  for (const type of ["wheel", "pointerdown", "touchmove"]) window.addEventListener(type, readingIntent, { passive: true });
});

onBeforeUnmount(() => {
  pageMounted = false;
  textRenderCache.clear();
  ++articleRequest;
  window.history.scrollRestoration = previousScrollRestoration;
  window.clearTimeout(suggestionTimer);
  window.clearTimeout(wikiBootstrapTimer);
  hideWikiPreview();
  readingObserver?.disconnect();
  window.removeEventListener("scroll", repositionWikiPreview);
  window.removeEventListener("resize", repositionWikiPreview);
  window.removeEventListener("resize", updateScreen);
  window.removeEventListener("keydown", compendiumKeydown);
  for (const type of ["wheel", "pointerdown", "touchmove"]) window.removeEventListener(type, readingIntent);
});
</script>

<template>
  <div class="compendium-shell" :class="{ 'reader-active': selected, 'reader-focus': readerFocus }" :data-layer="activeLayer" :style="{ '--reader-font-size': `${readerFontSize}px` }">
    <a class="compendium-skip" href="#compendium-main" @click="skipToContent">Aller au contenu</a>
    <header class="compendium-topbar">
      <RouterLink class="brand compendium-brand-lockup" to="/">
        <TerraUmbraBrand />
      </RouterLink>

      <nav class="compendium-top-nav" aria-label="Navigation principale">
        <button type="button" @click="closeNewcomer">Compendium</button>
        <RouterLink to="/account">Builder <span aria-hidden="true">↗</span></RouterLink>
      </nav>
      <div class="compendium-top-actions">
        <button class="ghost compact-link" type="button" aria-label="Ouvrir la recherche" @click="focusSearch">Rechercher <kbd>⌘/Ctrl K</kbd></button>
        <button class="ghost compact-link" type="button" @click="openNewcomer">
          Bien commencer
        </button>
        <RouterLink v-if="canEdit" class="ghost compact-link wiki-create-link" to="/compendium/new">
          ＋ Nouvelle page
        </RouterLink>
        <RouterLink v-if="currentUser?.role==='admin'" class="ghost compact-link" to="/compendium/new?category=Personnages&amp;template=npc">＋ PNJ canonique</RouterLink>
        <RouterLink class="ghost compact-link" to="/account">
          {{ currentUser ? "Mon espace" : "Connexion" }}
        </RouterLink>
      </div>
    </header>

    <div class="compendium-page">
      <aside class="panel compendium-navigation" aria-label="Explorer le Compendium">
        <details class="navigation-disclosure" :open="!smallScreen || navigationOpen" @toggle="navigationOpen = ($event.target as HTMLDetailsElement).open">
          <summary>Explorer les rubriques</summary>
        <div class="navigation-heading">
          <h2>LE COMPENDIUM</h2>
        </div>

        <nav class="navigation-categories" aria-label="Rubriques du Compendium">
          <button type="button" class="navigation-category" :class="{ active: showOnboarding && discoveryMode === 'home' }" :aria-current="showOnboarding && discoveryMode === 'home' ? 'page' : undefined" @click="closeNewcomer">
            <svg class="navigation-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3Z"/></svg>
            <span>Vue d’ensemble</span>
          </button>
          <button type="button" class="navigation-category" :class="{ active: showOnboarding && discoveryMode !== 'home' }" :aria-current="showOnboarding && discoveryMode !== 'home' ? 'page' : undefined" @click="openNewcomer">
            <svg class="navigation-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3Zm9 2v15"/></svg>
            <span>Bien commencer</span>
          </button>
          <button
            type="button"
            class="navigation-category"
            :class="{ active: !showOnboarding && !category && !activeLibraryView }"
            @click="chooseCategory('')"
          >
            <svg class="navigation-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z"/></svg>
            <span>Tous les articles</span>
            <small>{{ meta?.total?.toLocaleString('fr-FR') || '—' }}</small>
          </button>
          <div class="navigation-divider" aria-hidden="true"></div>
          <button
            v-for="item in meta?.categories || []"
            :key="item.name"
            type="button"
            class="navigation-category"
            :class="{ active: category === item.name }"
            :data-layer="item.name"
            :aria-current="category === item.name ? 'page' : undefined"
            @click="chooseCategory(item.name)"
          >
            <span v-if="item.name === 'Réalité' || item.name === 'Vérité'" class="navigation-layer-icon" aria-hidden="true"></span>
            <svg v-else class="navigation-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path v-if="item.name === 'Règles'" d="M4 3h16v18H4ZM8 7h8M8 12h8M8 17h5"/>
              <path v-else-if="item.name === 'Personnages'" d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 21v-2a8 5 0 0 1 16 0v2"/>
              <path v-else-if="item.name === 'Équipement & Objets'" d="m3 7 9-4 9 4v11l-9 4-9-4Zm0 0 9 4 9-4M12 11v11"/>
              <path v-else-if="item.name === 'Bestiaire'" d="m5 4 5 4h4l5-4 2 10-9 8-9-8Zm2 8h2m6 0h2m-7 5h4"/>
              <path v-else d="M3 3h18v5H3Zm2 5v13h14V8M9 12h6"/>
            </svg>
            <span>{{ item.name }}</span>
            <small>{{ item.count }}</small>
          </button>
          <div class="navigation-divider" aria-hidden="true"></div>
          <button v-if="currentUser" type="button" class="navigation-category" :class="{ active: activeLibraryView === 'favorites' }" @click="showFavorites()">
            <svg class="navigation-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>
            <span>Mes favoris</span><small>{{ favoriteIds.length }}</small>
          </button>
          <button type="button" class="navigation-category" :class="{ active: activeLibraryView === 'recent' }" @click="showRecent()">
            <svg class="navigation-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a9 9 0 1 1 1 7M3 4v6h6m3-3v6l4 2"/></svg>
            <span>Historique</span><small>{{ recentItems.length }}</small>
          </button>
        </nav>

        <div v-if="category" class="navigation-tree">
          <div class="navigation-tree-kicker">
            <strong>{{ category }}</strong>
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

        <section class="navigation-guide" aria-label="Premiers pas">
          <h3>PREMIERS PAS</h3>
          <p>Un monde.<br>Deux niveaux de lecture.</p>
          <button type="button" @click="openArticle('realite-v9-grande-californie-2035')">Découvrir la Réalité <span aria-hidden="true">↗</span></button>
          <button type="button" @click="openArticle('verite-v7-derriere-le-voile')">Franchir le Voile <span aria-hidden="true">↗</span></button>
        </section>
        <section v-if="recentItems.length" class="navigation-recent" aria-label="Dernières lectures">
          <h3>DERNIÈRES LECTURES</h3>
          <button v-for="item in recentItems.slice(0, 3)" :key="item.id" type="button" :title="item.title" @click="openArticle(item.id)">{{ item.title }}</button>
        </section>
        </details>
      </aside>

    <main id="compendium-main" class="compendium-content" tabindex="-1">

      <div v-if="retiredCategoryRequested" class="feedback compendium-feedback archive-retirement-notice" role="status">
        Les archives de l’ancien Compendium ont été supprimées. Les rubriques actuelles restent disponibles ci-dessous et dans la recherche.
      </div>
      <div v-if="error" class="feedback error compendium-feedback">
        {{ error }}
      </div>
      <div v-else-if="libraryNotice" class="feedback compendium-feedback">
        {{ libraryNotice }}
      </div>

      <template v-if="true">
        <section v-show="searchOpen || (!selected && !showOnboarding)" class="panel compendium-search">
          <form @submit.prevent="search()">
            <div class="search-form-control">
              <label for="compendium-query">Recherche globale</label>
              <div class="search-line">
                <input
                  id="compendium-query"
                  v-model="query"
                  type="search"
                  placeholder="Nom, faction, règle, équipement, créature…"
                  autocomplete="off"
                  aria-label="Recherche dans le Compendium"
                  @focus="searchFocused=true; scheduleSuggestions()"
                  @input="handleSearchInput"
                  @blur="handleSearchBlur"
                  @keydown="handleSearchKeydown"
                />
                <select
                  v-model="category"
                  aria-label="Rubrique de recherche"
                  @change="searchFamily='';manufacturer=category==='Équipement & Objets'?manufacturer:''"
                ><option value="">Toutes les rubriques</option><option v-for="item in meta?.categories||[]" :key="item.name" :value="item.name">{{ item.name }}</option></select>
                <select v-if="category" v-model="searchFamily" aria-label="Dossier de recherche"><option value="">Tous les dossiers</option><option v-for="name in searchFamilies" :key="name" :value="name">{{ name }}</option></select>
                <select v-if="category==='Équipement & Objets'"
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
            </div>
          </form>

          <div v-if="query.trim()||category||searchFamily||manufacturer" class="search-active-filters" role="group" aria-label="Filtres actifs">
            <span>Filtres actifs</span>
            <button v-if="query.trim()" type="button" :aria-label="`Retirer la recherche ${query.trim()}`" @click="removeSearchFilter('query')">Recherche · {{ query.trim() }} <span aria-hidden="true">×</span></button>
            <button v-if="category" type="button" :aria-label="`Retirer la rubrique ${category}`" @click="removeSearchFilter('category')">Rubrique · {{ category }} <span aria-hidden="true">×</span></button>
            <button v-if="searchFamily" type="button" :aria-label="`Retirer le dossier ${searchFamily}`" @click="removeSearchFilter('group')">Dossier · {{ searchFamily }} <span aria-hidden="true">×</span></button>
            <button v-if="manufacturer" type="button" :aria-label="`Retirer le fabricant ${manufacturer}`" @click="removeSearchFilter('manufacturer')">Fabricant · {{ manufacturer }} <span aria-hidden="true">×</span></button>
          </div>

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

        <CompendiumDiscovery
          v-if="showOnboarding"
          :mode="discoveryMode"
          :journey-id="typeof route.query.journey === 'string' ? route.query.journey : undefined"
          :item-count="meta?.total"
          :resume="latestResume"
          :article-href="compendiumHref"
          @open-article="openArticle"
          @browse="browseDiscovery"
          @guide="openNewcomer"
          @journey="openJourney"
          @resume="resumeLastReading"
        />
        <details v-if="showOnboarding && discoveryMode === 'guide'" class="panel rules-onboarding">
          <summary>Règles de création et natures de personnage</summary>
          <CompendiumOnboarding :data="onboarding" @open-article="openArticle" @open-category="openOnboardingCategory" @close="closeNewcomer" />
        </details>

        <details
          v-if="currentUser || recentItems.length"
          class="panel library-panel"
          :open="libraryOpen || !!activeLibraryView"
          @toggle="libraryOpen = ($event.target as HTMLDetailsElement).open"
        >
          <summary>{{ currentUser ? 'Ma bibliothèque' : 'Mes dernières lectures' }} <span>{{ recentItems.length }} récentes<span v-if="currentUser"> · {{ favoriteIds.length }} favoris</span></span></summary>
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
                @click="showRecent()"
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
                @click="showFavorites()"
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
        </details>

        <section v-if="!showOnboarding" class="compendium-workspace">


          <article
            ref="articlePanel"
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
                    <img class="reader-orbital-art" :src="orbitalImage" alt="" width="1536" height="1024" decoding="async" />
                    <div class="reader-topline">
                      <button class="reader-back" type="button" @click="router.push(articleReturnHref)">← {{ articleReturnLabel }}</button>
                      <div class="reader-tools" aria-label="Confort de lecture">
                        <button type="button" aria-label="Réduire la taille du texte" :disabled="readerFontSize <= 15" @click="readerFontSize--">A−</button>
                        <button type="button" aria-label="Agrandir la taille du texte" :disabled="readerFontSize >= 21" @click="readerFontSize++">A+</button>
                        <button type="button" :aria-pressed="readerFocus" @click="readerFocus = !readerFocus">{{ readerFocus ? 'Vue complète' : 'Lecture' }}</button>
                      </div>
                    </div>
                    <div class="article-breadcrumb">
                      <span>{{ selected.category || "" }}</span>
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
                      <RouterLink
                        v-if="selected.brandLogo?.src && selected.brandCorporationId"
                        class="corporation-brand-link"
                        :to="`/compendium?article=${encodeURIComponent(selected.brandCorporationId)}`"
                        :title="`Voir ${selected.manufacturer || 'la corporation'} dans le Compendium`"
                      >
                        <img :src="mediaUrl(selected.brandLogo)" :alt="selected.brandLogo.alt || 'Logo du fabricant'" loading="lazy" />
                      </RouterLink>
                      <img
                        v-else-if="selected.brandLogo?.src"
                        class="corporation-brand-logo"
                        :src="mediaUrl(selected.brandLogo)"
                        :alt="selected.brandLogo.alt || 'Logo de la corporation'"
                        loading="lazy"
                      />
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
                      <span v-if="selected.category === 'Personnages' && selected.realityName">
                        Nom de Réalité · {{ selected.realityName }}
                      </span>
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
                        @click="searchForTag(tag)"
                      >
                        {{ tag }}
                      </button>
                    </div>
                    <div v-if="canSearchTruthTags && selected.secretTags?.length" class="article-tags article-truth-tags">
                      <span class="truth-tags-label">Tags Vérité · MJ</span>
                      <button
                        v-for="tag in selected.secretTags"
                        :key="tag"
                        type="button"
                        @click="searchForTag(tag)"
                      >
                        {{ tag }}
                      </button>
                    </div>
                    <button v-if="selectedResume" class="reader-resume" type="button" @click="openArticle(selected.id, selectedResume.id)">Reprendre : {{ selectedResume.title }} <span aria-hidden="true">→</span></button>
                    <p v-if="readingNotice" class="reader-notice" role="status">{{ readingNotice }}</p>
                  </header>

                  <figure v-if="showLargeArticleMedia && selectedMedia" class="wiki-featured-media">
                    <img
                      :src="selectedMedia.src"
                      :alt="selectedMedia.alt || selected.title || selected.id"
                      decoding="async"
                    />
                    <figcaption v-if="selectedMedia.caption">{{ selectedMedia.caption }}</figcaption>
                  </figure>

                  <CompendiumHologramComparison v-if="selected.id === 'verite-v7-voile-hologramme'" />
                  <div class="reader-progress-bar">
                    <div><strong>{{ selected.title }}</strong><span v-if="currentSection">{{ articleToc.findIndex(item => item.id === currentSection.id) + 1 }} / {{ articleToc.length }} · {{ currentSection.title }}</span></div>
                    <button type="button" aria-haspopup="dialog" @click="openContents">Sommaire</button>
                  </div>
                  <section
                    v-for="{ section, index: sectionIndex } in articleSections"
                    :id="sectionDomId(section, sectionIndex)"
                    :key="section.id || sectionIndex"
                    class="article-section"
                  >
                    <details v-if="section.audience === 'mj'" class="mj-section" :open="hasNpcStatProfile(section) && section.title?.includes('Vérité')">
                      <summary>{{ section.title || "Informations MJ" }}</summary>
                      <div class="mj-content">
                        <component :is="sectionHeadingLevel(section)" v-if="section.title && !hasNpcStatProfile(section)">
                          {{ section.title }}
                        </component>

                        <NpcStatProfile v-if="hasNpcStatProfile(section)" :blocks="section.blocks || []" :render-inline="text => linkifyText(text, selected)" />
                        <template v-for="(block, blockIndex) in section.blocks || []" v-else :key="blockIndex">
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
                          <figure v-else-if="block.type === 'image' && block.src" :class="block.style === 'lore-reference' ? 'article-lore-reference' : block.style === 'lore-illustration' ? 'article-lore-illustration' : 'article-rule-diagram'">
                            <picture><source v-if="block.mobileSrc" :srcset="mediaUrl(block.mobileSrc)" media="(max-width: 700px)" /><img :src="mediaUrl(block.src)" :alt="block.alt || ''" loading="lazy" decoding="async" /></picture>
                            <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
                          </figure>
                          <div v-else-if="block.type === 'table'" class="article-table-wrap">
                            <table class="article-table">
                              <tbody>
                                <tr v-for="(row, rowIndex) in tableRows(block, section)" :key="rowIndex">
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

                    <component :is="section.title ? 'details' : 'div'" v-else class="article-disclosure" :open="section.title ? true : undefined">
                      <summary v-if="section.title"><component :is="sectionHeadingLevel(section)">{{ section.title }}</component></summary>

                      <NpcStatProfile v-if="hasNpcStatProfile(section)" :blocks="section.blocks || []" :render-inline="text => linkifyText(text, selected)" />
                      <template v-for="(block, blockIndex) in section.blocks || []" v-else :key="blockIndex">
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
                        <figure v-else-if="block.type === 'image' && block.src" :class="block.style === 'lore-reference' ? 'article-lore-reference' : block.style === 'lore-illustration' ? 'article-lore-illustration' : 'article-rule-diagram'">
                          <picture><source v-if="block.mobileSrc" :srcset="mediaUrl(block.mobileSrc)" media="(max-width: 700px)" /><img :src="mediaUrl(block.src)" :alt="block.alt || ''" loading="lazy" decoding="async" /></picture>
                          <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
                        </figure>
                        <div v-else-if="block.type === 'table'" class="article-table-wrap">
                          <table class="article-table">
                            <tbody>
                              <tr v-for="(row, rowIndex) in tableRows(block, section)" :key="rowIndex">
                                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                                  <span v-html="linkifyText(formatCell(cell), selected)"></span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </template>
                    </component>
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
                    <a
                      v-for="item in articleToc"
                      :key="item.id"
                      :href="compendiumHref(selected.id, item.id)"
                      :class="[`level-${item.level}`, { active: currentSectionId === item.id }]"
                      :aria-current="currentSectionId === item.id ? 'location' : undefined"
                    >
                      {{ item.title }}
                    </a>
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

            <section v-else-if="articleUnavailable" class="article-unavailable" role="status">
              <p class="eyebrow">COMPENDIUM</p>
              <h1>Article indisponible</h1>
              <p>Cette page a été supprimée ou n’est pas accessible avec votre compte. Retrouvez les contenus actuels dans les rubriques ou avec la recherche.</p>
              <div class="article-unavailable-actions">
                <RouterLink class="primary" to="/compendium?view=all">Parcourir les articles</RouterLink>
                <RouterLink class="ghost" to="/compendium">Retour à l’accueil</RouterLink>
              </div>
            </section>

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
                    <strong>{{ group.name }}</strong>
                    <span>{{ group.items.length }}</span>
                  </header>
                  <button
                    v-for="item in group.items"
                    :key="item.id"
                    class="result-card main-result-card"
                    type="button"
                    @click="openSearchResult(item)"
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
                <img v-if="category === 'Réalité' || category === 'Vérité'" class="category-orbital-art" :src="orbitalImage" alt="" width="1536" height="1024" decoding="async" />
                <div>
                  <p class="eyebrow">RUBRIQUE</p>
                  <h1>{{ category }}</h1>
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
                <details v-for="group in navigationGroups" :key="group.name" class="category-group-card">
                  <summary class="category-card-heading">
                    <div>
                      <p class="eyebrow">DOSSIER</p>
                      <h2>{{ group.name }}</h2>
                    </div>
                    <span>{{ group.count }}</span>
                  </summary>

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
                </details>
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

      <dialog ref="contentsDialog" class="reader-contents-dialog" aria-labelledby="reader-contents-title" @close="contentsClosed">
        <div class="reader-contents-heading"><h2 id="reader-contents-title">Dans cet article</h2><button type="button" aria-label="Fermer le sommaire" @click="closeContents()">Fermer</button></div>
        <nav v-if="selected" aria-label="Sommaire rapide"><ol><li v-for="item in articleToc" :key="item.id" :class="`level-${item.level}`"><a :href="compendiumHref(selected.id, item.id)" :aria-current="currentSectionId === item.id ? 'location' : undefined" @click="followSection($event, item.id)">{{ item.title }}</a></li></ol></nav>
      </dialog>

      <div
        v-if="wikiPreview.visible"
        ref="wikiPreviewEl"
        :id="WIKI_PREVIEW_ID"
        class="wiki-hover-preview"
        :data-layer="wikiPreview.category === 'Vérité' ? 'truth' : 'reality'"
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
        <small v-if="wikiPreview.sectionTitle">§ {{ wikiPreview.sectionTitle }}</small>
        <small v-if="wikiPreview.context">{{ wikiPreview.context }}</small>
        <p>{{ wikiPreview.snippet }}</p>
        <span>Cliquer pour ouvrir l’article →</span>
      </div>
    </main>
    </div>
  </div>
</template>

<style scoped>
.article-header, .article-section {
  scroll-margin-top: var(--compendium-anchor-offset, 90px);
}

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
  width: 100%;
  margin: 0;
  padding: 0;
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
  font: 500 clamp(2.8rem, 7vw, 5.6rem)/1 var(--tu-font);
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
  font: 500 2rem/1 var(--tu-font);
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
  grid-template-columns: minmax(220px, 2fr) repeat(3,minmax(135px,1fr)) auto;
  gap: .7rem;
  align-items:stretch;
}
.search-line>select{min-width:0}
@media(max-width:1100px){.search-line{grid-template-columns:repeat(2,minmax(0,1fr))}.search-line input[type="search"]{grid-column:1/-1}}
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
  font: 500 1.45rem/1.2 var(--tu-font);
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
  font: 500 1.45rem/1.2 var(--tu-font);
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
  font-family: var(--tu-font);
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

/* Retired or inaccessible article URLs keep a clear path to the active corpus. */
.article-unavailable { padding: clamp(24px, 4vw, 56px); }
.article-unavailable h1 { margin: 12px 0 20px; font-size: clamp(1.8rem, 3vw, 2.5rem); }
.article-unavailable > p:not(.eyebrow) { max-width: 65ch; color: #bdcfe0; line-height: 1.8; }
.article-unavailable-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.article-unavailable-actions a { display: inline-flex; align-items: center; min-height: 44px; padding: 12px 18px; border-radius: 6px; text-decoration: none; }

.wiki-title-line {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.wiki-title-line h1 {
  flex: 1;
}
.corporation-brand-link, .corporation-brand-logo {
  flex: 0 0 68px;
  width: 68px;
  height: 68px;
  object-fit: contain;
  padding: 5px;
  border: 1px solid rgba(216, 189, 133, .3);
  border-radius: 8px;
  background: rgba(238, 243, 248, .93);
}
.corporation-brand-link { display: grid; place-items: center; }
.corporation-brand-link img { max-width: 100%; max-height: 100%; object-fit: contain; }

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

.wiki-featured-media {
  display: grid;
  justify-items: center;
  margin: 0 0 32px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.025);
}

.wiki-featured-media img {
  display: block;
  width: 100%;
  max-height: min(72vh, 720px);
  object-fit: contain;
  background: rgba(0,0,0,.20);
}

.wiki-featured-media figcaption {
  width: 100%;
  padding: .65rem .9rem;
  color: #91a7b1;
  font-size: .78rem;
  line-height: 1.5;
  text-align: center;
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
.talent-wiki-card header{display:flex;align-items:flex-start;justify-content:space-between;gap:.8rem}.talent-wiki-card header span{color:#709aad;font-size:.6rem;text-transform:uppercase;letter-spacing:.06em}.talent-wiki-card h3{margin:.16rem 0 0;color:#dce8ec;font:500 1.05rem/1.2 var(--tu-font)}.talent-wiki-card header>strong{flex:0 0 auto;color:#91cfe0;font-size:.72rem}
.talent-wiki-meta{display:flex;flex-wrap:wrap;gap:.35rem}.talent-wiki-meta span{padding:.24rem .38rem;border:1px solid rgba(255,255,255,.07);color:#718a95;font-size:.62rem}
.talent-wiki-lore{margin:0;color:#91a7b1;font-size:.76rem;line-height:1.55}
.talent-wiki-mechanics{margin-top:auto;padding:.7rem .75rem;border-left:2px solid rgba(88,220,197,.36);background:rgba(0,0,0,.13)}.talent-wiki-mechanics small{display:block;margin-bottom:.28rem;color:#6fb9d6;font-size:.58rem;letter-spacing:.08em}.talent-wiki-mechanics p{margin:0;color:#afc1c8;font-size:.72rem;line-height:1.5}
.talent-registry-empty{padding:.9rem;border:1px dashed rgba(255,255,255,.1);color:#718a95;font-size:.75rem}
.wiki-mechanics-card{padding:1rem;border:1px solid rgba(88,220,197,.24);background:linear-gradient(145deg,rgba(43,146,255,.08),rgba(255,255,255,.014));box-shadow:inset 0 1px rgba(255,255,255,.025)}
.wiki-mechanics-head{display:flex;justify-content:space-between;gap:.8rem;align-items:flex-start;margin-bottom:.7rem}.wiki-mechanics-head strong{display:block;color:#dce8ec;font:500 1rem/1.2 var(--tu-font)}.wiki-mechanics-head>span{padding:.2rem .38rem;border:1px solid rgba(112,168,121,.22);color:#9fbd9d;font-size:.58rem;text-transform:uppercase;letter-spacing:.05em}
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

.wiki-toc a {
  padding: .35rem .2rem;
  border: 0;
  color: #a6bac2;
  background: transparent;
  text-align: left;
  font-size: .78rem;
}

.wiki-toc a:hover {
  color: #c7eaf2;
}

.wiki-toc a.level-3 { padding-left: .8rem; }
.wiki-toc a.level-4 { padding-left: 1.4rem; }

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
  font: 500 1.65rem/1.2 var(--tu-font);
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
  font-family: var(--tu-font);
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
  font: 500 clamp(2rem, 4vw, 3.4rem)/1.06 var(--tu-font);
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

.search-active-filters{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:12px 0 0;color:#bad1df;font-size:13px}
.search-active-filters button{min-height:44px;padding:8px 12px;border:1px solid #4b7684;border-radius:22px;background:#152b38;color:#e6f4f7;cursor:pointer;font:inherit;overflow-wrap:anywhere}
.search-active-filters button:hover,.search-active-filters button:focus-visible{border-color:#9be5f8;background:#204055}
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

.article-truth-tags { align-items: center; }
.article-truth-tags .truth-tags-label { color: #d9b6e9; font-size: .72rem; }
.article-truth-tags button { border-color: rgba(184, 130, 214, .35); color: #e5c9ef; }

.article-section {
  margin: 1.8rem 0;
}

.article-section h2,
.article-section h3,
.article-section h4 {
  font-family: var(--tu-font);
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

.article-paragraph.source-heading {
  margin: 1.25rem 0 .35rem;
  color: #d5e5e9;
  font-weight: 700;
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

.article-rule-diagram {
  margin: 1.35rem 0 1.7rem;
  padding: .55rem;
  border: 1px solid rgba(88, 220, 197, .25);
  border-radius: .85rem;
  background: #0c1820;
}
.article-rule-diagram img { display: block; width: 100%; height: auto; }
.article-rule-diagram figcaption { margin: .35rem .65rem .2rem; color: #b9cbd0; font-size: .87rem; line-height: 1.45; }
.article-lore-illustration { margin: 1.35rem 0 1.85rem; }
.article-lore-illustration img { display: block; width: 100%; height: auto; border-radius: .65rem; }
.article-lore-illustration figcaption { margin: .5rem .25rem; color: #b9cbd0; font-size: .88rem; line-height: 1.45; }
.article-lore-reference { width: min(100%, 440px); margin: 1.35rem auto 1.85rem; }
.article-lore-reference img { display: block; width: 100%; height: auto; border-radius: .65rem; }
.article-lore-reference figcaption { margin: .5rem .25rem; color: #b9cbd0; font-size: .88rem; line-height: 1.45; }

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
  font-family: var(--tu-font);
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
  font-family: var(--tu-font);
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
  --preview-accent: #64def5;
  position: fixed;
  z-index: 80;
  display: grid;
  gap: 9px;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #36536b;
  border-top: 2px solid var(--preview-accent);
  border-radius: 8px;
  background: #101e2e;
  color: #dce8f5;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  text-align: left;
  overflow-wrap: anywhere;
  box-shadow: 0 16px 48px rgba(0, 0, 0, .45);
  pointer-events: none;
}

.wiki-hover-preview[data-layer="truth"] {
  --preview-accent: #b79aff;
  border-color: #524669;
  border-top-color: var(--preview-accent);
  background: #171b2b;
}

.wiki-hover-image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  margin-bottom: .25rem;
  border: 1px solid #344b62;
  border-radius: 4px;
}

.wiki-hover-preview strong {
  color: #eef5ff;
  font: 600 18px/1.35 Inter, "Segoe UI", Arial, sans-serif;
}

.wiki-hover-preview small {
  color: #a5bbd3;
  font-size: 12px;
  line-height: 1.5;
}

.wiki-hover-preview p {
  margin: 0;
  color: #c1d1e4;
  font-size: 14px;
  line-height: 1.65;
}

.wiki-hover-preview > span {
  margin-top: 3px;
  padding-top: 10px;
  border-top: 1px solid #34435a;
  color: var(--preview-accent);
  font-size: 12px;
  line-height: 1.4;
}

.wiki-hover-kicker {
  color: var(--preview-accent);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.5;
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
  font: 500 1.35rem/1.2 var(--tu-font);
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
.navigation-empty {
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
  font: 500 clamp(1.7rem, 3vw, 2.5rem)/1.05 var(--tu-font);
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

.category-group-card > header,.category-card-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: .85rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.category-group-card > header h2,.category-card-heading h2 {
  margin: .1rem 0 0;
  font: 500 1.25rem/1.2 var(--tu-font);
}

.category-group-card > header > span,.category-card-heading > span {
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


/* Orbital Compendium — scoped presentation; canonical blocks remain unchanged. */
.compendium-shell{--tu-accent:#64def5;--orbital-topbar:78px;color:#dbe6f3;background:#080f1a;font-family:Inter,"Segoe UI",Arial,sans-serif}
.compendium-shell[data-layer="truth"]{--tu-accent:#b79aff}
.compendium-shell :is(button,a,summary,input,select):focus-visible{outline:2px solid var(--tu-accent);outline-offset:4px}
.compendium-skip{position:fixed;left:16px;top:-100px;z-index:100;padding:14px 20px;border:2px solid #64def5;border-radius:5px;background:#101f30;color:#edf4ff}
.compendium-skip:focus{top:12px}
.compendium-topbar{min-height:var(--orbital-topbar);padding:10px clamp(16px,3vw,44px);gap:24px;border-color:#25384a;background:rgba(8,15,26,.98);box-shadow:none}
.compendium-brand-lockup{flex:none;line-height:1;text-decoration:none}
.compendium-top-nav{display:flex;align-items:center;gap:24px;margin-right:auto}
.compendium-top-nav :is(a,button){display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0;border:0;background:none;color:#c5d4e6;text-decoration:none;font:500 13px/1.3 Inter,"Segoe UI",sans-serif;cursor:pointer}
.compendium-top-nav button{color:#edf4ff}
.compendium-top-nav :is(a,button):hover{color:#64def5}
.compendium-top-actions{flex-wrap:wrap;justify-content:flex-end;gap:8px}
.compendium-top-actions .compact-link{min-height:38px;align-items:center;padding:9px 12px;border:1px solid #2b4056;border-radius:5px;color:#b9cadd;background:#0d1725;font-size:12px;line-height:1.2;white-space:nowrap}
.compendium-top-actions .compact-link:hover{border-color:#64def5;color:#edf4ff}
kbd{margin-left:12px;color:#819bb5;font:10px/1.3 Consolas,monospace}
.compendium-page{--compendium-gutter:clamp(24px,3vw,64px);display:grid;grid-template-columns:clamp(232px,13vw,260px) minmax(0,1fr);align-items:start;width:100%;margin:0;padding:0;gap:0}
.compendium-content{min-width:0;padding:0 0 70px;scroll-margin-top:var(--orbital-topbar)}
.compendium-content:focus{outline:none}
.compendium-content>:is(.compendium-feedback,.compendium-search,.library-panel,.rules-onboarding,.compendium-workspace){margin:28px var(--compendium-gutter) 0}
.compendium-search{padding:24px;margin-bottom:24px;border:1px solid #294056;border-radius:8px;background:#0d1725}
.compendium-search label{color:#b8cadd;font-size:12px;letter-spacing:.025em}
.compendium-search input{min-height:48px;border-color:#324d68;border-radius:5px;background:#080f1a;color:#edf4ff;font-size:16px}
.compendium-search :is(select,button){min-height:40px}
.category-chip{font-size:12px;padding:9px 13px;color:#b6c8dc;border-color:#2a4055;border-radius:5px}
.category-chip.active{border-color:var(--tu-accent);color:var(--tu-accent);background:#162638}
.search-help{color:#99b0c8;font-size:12px;line-height:1.7}
.library-panel,.rules-onboarding{padding:0;margin:20px 0;border:1px solid #293d51;border-radius:8px;background:#0d1725}
.library-panel>summary,.rules-onboarding>summary{padding:17px 20px;cursor:pointer;color:#d3e0ef;font-size:13px;line-height:1.6}
.library-panel>summary span{margin-left:14px;color:#8ea7c2;font-size:11px}
.library-panel[open]{padding:0 20px 20px}.library-panel[open]>summary{margin:0 -20px 20px;border-bottom:1px solid #293d51}
.rules-onboarding> :not(summary){margin:20px}
.library-heading h2{font:500 20px/1.4 Inter,"Segoe UI",sans-serif}
.compendium-workspace{display:block;min-width:0}
.compendium-navigation{position:sticky;top:var(--orbital-topbar);height:calc(100dvh - var(--orbital-topbar));max-height:none;margin:0;padding:16px 8px 28px;border:0;border-right:1px solid #26394c;border-radius:0;background:#0a1420;box-shadow:none;scrollbar-color:#344c64 #0a1420}
.navigation-disclosure>summary{display:none;padding:16px 18px;cursor:pointer;color:#d5e3f2;font-size:14px}
.navigation-heading{position:static;padding:20px 20px 16px;border:0;background:transparent}
.navigation-heading h2,.navigation-guide h3,.navigation-recent h3{margin:0;color:#94aec8;font:500 10px/1.7 Consolas,"Liberation Mono",monospace;letter-spacing:.18em}
.navigation-heading>span{font-size:10px;color:var(--tu-accent)}
.navigation-heading .eyebrow{color:#8da8c3}
.navigation-categories{gap:5px;padding:8px;border:0}
.navigation-category{justify-content:flex-start;gap:12px;min-height:46px;padding:10px 12px;color:#b9cadd;border-radius:4px;font-size:13px;line-height:1.5}
.navigation-category>span:not(.navigation-layer-icon){min-width:0;flex:1}
.navigation-category.active{border-color:#344e69;background:#17293b;color:var(--tu-accent)}
.navigation-category small{flex:none;margin-left:auto;color:#8ca7c4;font:10px/1.5 Consolas,monospace}
.navigation-icon{flex:none;width:18px;height:18px;fill:none;stroke:#7896b1;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.navigation-category.active .navigation-icon{stroke:var(--tu-accent)}
.navigation-layer-icon{position:relative;flex:none;width:14px;height:14px;margin:0 2px;border:1px solid #64def5;transform:rotate(45deg)}
.navigation-category[data-layer="Vérité"] .navigation-layer-icon{border-color:#b79aff}
.navigation-category[data-layer="Vérité"] .navigation-layer-icon:after{content:"";position:absolute;inset:3px;border:1px solid #b79aff}
.navigation-category[data-layer="Vérité"].active{border-color:#594774;background:linear-gradient(100deg,#271e3b,#111827);color:#dfcefa}
.navigation-divider{grid-column:1/-1;height:1px;margin:10px 12px;background:#243447}
.navigation-guide,.navigation-recent{margin:26px 20px 0}
.navigation-guide p{margin:12px 0 16px;color:#c8d8e8;font-size:15px;line-height:1.6}
.navigation-guide button,.navigation-recent button{min-height:44px;width:100%;padding:10px 0;border:0;background:none;color:#a4bbd3;text-align:left;font-size:12px;line-height:1.6;cursor:pointer}
.navigation-guide button{display:flex;justify-content:space-between;gap:12px}
.navigation-guide button:last-child{color:#c0a6ef}
.navigation-recent button{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.navigation-recent h3{margin-bottom:8px}
.navigation-guide button:hover,.navigation-recent button:hover{color:#edf4ff}
.navigation-page{min-height:40px;color:#adbed3;font-size:12px;line-height:1.6}
.navigation-group>summary{min-height:42px;color:#c6d6e7;font-size:12px;line-height:1.6}
.navigation-subgroup>strong,.navigation-tree-kicker,.navigation-hint,.navigation-empty{color:#93abc5;font-size:11px;line-height:1.7}
.article-panel{min-width:0;padding:clamp(24px,3vw,48px);border:1px solid #283c51;border-radius:8px;background:#0d1725;box-shadow:none}
.wiki-article-grid{grid-template-columns:minmax(0,1fr) clamp(220px,16vw,280px);gap:clamp(24px,3vw,48px);max-width:1440px;margin-inline:auto}
.wiki-article-enter{animation:none;transform:none}
.wiki-article-main{min-width:0}
.article-header{position:relative;isolation:isolate;overflow:hidden;margin:0 0 26px;padding:0 0 26px;border-bottom:1px solid #294057}
.reader-orbital-art{position:absolute;right:-30px;top:0;z-index:-1;width:72%;height:300px;object-fit:cover;opacity:.19;pointer-events:none;mask-image:linear-gradient(90deg,transparent,#000 45%,#000 85%,transparent)}
.reader-topline{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:28px;padding:6px}
.reader-back{min-height:40px;padding:0;border:0;background:transparent;color:#9fb7d2;text-align:left;font-size:12px;cursor:pointer}
.reader-tools{display:flex;gap:6px}
.reader-tools button{min-height:36px;min-width:36px;padding:7px 10px;border:1px solid #344b64;border-radius:4px;background:#102032;color:#d0e1f4;font-size:12px;cursor:pointer}
.reader-tools button[aria-pressed="true"]{border-color:var(--tu-accent);color:var(--tu-accent)}
.reader-tools button:disabled{opacity:.45;cursor:default}
.wiki-breadcrumbs{color:#91adc9;font-size:11px;line-height:1.7}
.wiki-title-line{gap:14px;margin:14px 0}
.article-header h1{margin:0;font:500 clamp(28px,3.1vw,46px)/1.13 Inter,"Segoe UI",Arial,sans-serif;letter-spacing:-.035em;color:#edf4ff;overflow-wrap:anywhere}
.article-meta{color:#9eb6d0;font-size:12px;line-height:1.7}
.article-tags button,.article-library-actions button{min-height:34px;font-size:11px;color:#b9cbe0;border-color:#34495f;border-radius:4px;background:#101f2f}
.article-tags{gap:6px;margin-top:16px}
.reader-resume{display:flex;align-items:center;justify-content:space-between;gap:18px;max-width:100%;margin-top:22px;padding:12px 16px;border:1px solid #435575;border-radius:5px;background:#182740;color:var(--tu-accent);font-size:12px;text-align:left;cursor:pointer}
.reader-notice{color:#afc1d6;font-size:12px}
.reader-progress-bar{position:sticky;top:calc(var(--orbital-topbar) - 1px);z-index:12;display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 -1px 32px;padding:14px 0;border-top:1px solid #294057;border-bottom:1px solid #294057;background:rgba(13,23,37,.98)}
.reader-progress-bar>div{display:grid;gap:5px;min-width:0}
.reader-progress-bar strong{color:#d7e4f3;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.reader-progress-bar span{color:#95aec9;font-size:11px;line-height:1.5}
.reader-progress-bar button,.reader-contents-heading button{flex:none;min-height:40px;padding:9px 12px;border:1px solid #3e536e;border-radius:5px;background:#132237;color:#dceafb;font-size:12px;cursor:pointer}
.article-section{margin-bottom:36px}
.article-section :is(h2,h3){color:#edf4ff;font-family:Inter,"Segoe UI",Arial,sans-serif;font-weight:500;line-height:1.35;letter-spacing:-.018em}
.article-section h2{font-size:clamp(22px,2.2vw,28px);margin:34px 0 18px}
.article-section h3{font-size:21px;margin:28px 0 16px}
.article-section :deep(p){max-width:78ch;font-size:var(--reader-font-size);line-height:1.95;color:#c2d0e1;overflow-wrap:break-word}
.article-section :deep(a){color:var(--tu-accent);text-underline-offset:3px}
.article-section :deep(table){font-size:14px;line-height:1.7}
.article-section :deep(th){color:#d5e5f6;background:#15283b}.article-section :deep(td){color:#bfcfe1}
.mj-section{padding:16px 18px;border:1px solid #67547f;border-radius:6px;background:#19182a}
.mj-section>summary{min-height:30px;color:#cdb6f0;font-size:14px;line-height:1.6;cursor:pointer}
.wiki-infobox{font-size:12px}
.wiki-infobox-card,.wiki-mechanics-card,.wiki-builder-usage,.wiki-toc{border-color:#2b4055;border-radius:6px;background:#101d2d}
.wiki-infobox :is(dt,p,small){color:#99b0ca}.wiki-infobox dd{color:#d1e0ef}
.wiki-toc{padding:18px 16px}.wiki-toc a{padding:8px 0;color:#a3b9d0;font-size:12px;line-height:1.5}
.wiki-toc a.active{color:var(--tu-accent)}.wiki-toc .level-3{padding-left:12px;border-left:1px solid #354a62}
.wiki-media{border-color:#30485f;border-radius:6px}.wiki-media img{width:100%;height:auto}
.wiki-see-also h2,.wiki-nearby h2{font:500 22px/1.4 Inter,"Segoe UI",sans-serif}
.reader-contents-dialog{width:min(580px,calc(100% - 32px));max-height:80vh;margin:auto;padding:26px;border:1px solid #46607e;border-radius:9px;background:#0f1a2a;color:#dce8f7;box-shadow:0 24px 100px #0009}
.reader-contents-dialog::backdrop{background:#030710bb;backdrop-filter:blur(5px)}
.reader-contents-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:20px}.reader-contents-heading h2{margin:0;font:500 23px/1.3 Inter,"Segoe UI",sans-serif}
.reader-contents-dialog ol{padding-left:24px;color:#7e99b8}.reader-contents-dialog li{padding:5px 0}.reader-contents-dialog li.level-3{margin-left:18px;font-size:14px}
.reader-contents-dialog a{display:block;padding:8px;color:#c9d9eb;text-decoration:none;line-height:1.55}.reader-contents-dialog a[aria-current]{color:var(--tu-accent)}
.reader-focus .compendium-page{grid-template-columns:minmax(0,1fr)}.reader-focus .compendium-workspace{width:calc(100% - 2 * var(--compendium-gutter));max-width:1000px;margin-inline:auto}.reader-focus :is(.compendium-navigation,.wiki-infobox,.library-panel){display:none}.reader-focus .wiki-article-grid{grid-template-columns:1fr}.reader-focus .article-panel{padding:clamp(24px,5vw,64px)}
.surface-heading{position:relative;isolation:isolate;overflow:hidden;padding-bottom:28px;border-color:#30465b;gap:24px}
.surface-heading h1{font:500 clamp(28px,3vw,40px)/1.2 Inter,"Segoe UI",sans-serif;color:#edf4ff;letter-spacing:-.03em}
.surface-heading p{font-size:14px;line-height:1.8;color:#a5bad0}.surface-count{color:var(--tu-accent)}
.category-orbital-art{position:absolute;z-index:-1;right:-40px;top:-50px;width:72%;height:300px;object-fit:cover;opacity:.2;mask-image:linear-gradient(90deg,transparent,#000)}
.main-result-card{padding:22px;border-color:#30465d;border-radius:6px;background:#101e2f}.main-result-card:hover{border-color:var(--tu-accent);background:#15263a}.main-result-card>strong{font:500 20px/1.3 Inter,"Segoe UI",sans-serif;color:#e5effa}.main-result-card>p{color:#abc0d5;font-size:14px;line-height:1.8}.result-path{color:var(--tu-accent);font-size:11px}
.result-limit-note,.category-more{color:#91aac4;font-size:12px;line-height:1.7}
.category-group-card{border-color:#2d445b;border-radius:6px;background:#101d2d}.category-card-heading{padding:20px;border-color:#2d445b;cursor:pointer;list-style:none}.category-card-heading::-webkit-details-marker{display:none}.category-card-heading:after{content:'⌄';margin-left:12px;color:#7edfd7}.category-group-card[open]>.category-card-heading:after{transform:rotate(180deg)}.category-card-heading h2{font:500 22px/1.3 Inter,"Segoe UI",sans-serif}.category-subgroup-list{padding:20px;gap:20px}.category-page-links button{min-height:46px;padding:12px;color:#bccde0;border-color:#2b4158;font-size:12px;line-height:1.6}.category-subgroup-title strong{color:#a7bdd5;font-size:11px}
.article-disclosure>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px;border-bottom:1px solid #2d4057}.article-disclosure>summary::-webkit-details-marker{display:none}.article-disclosure>summary:after{content:'⌄';margin-left:auto;color:#69d7d6}.article-disclosure:not([open])>summary:after{transform:rotate(-90deg)}.article-disclosure>summary :is(h2,h3,h4){margin:18px 0!important}.article-disclosure>summary:focus-visible,.category-card-heading:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}
@media(max-width:1250px){.compendium-top-nav{display:none}.compendium-page{grid-template-columns:224px minmax(0,1fr)}.wiki-article-grid{grid-template-columns:minmax(0,1fr) 190px;gap:22px}.compendium-top-actions kbd{display:none}}
@media(max-width:1100px){.wiki-article-grid{grid-template-columns:1fr}.wiki-infobox{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.wiki-infobox>*{margin:0}.wiki-toc{grid-column:1/-1}}
@media(max-width:900px){.compendium-shell{--orbital-topbar:80px}.compendium-topbar{gap:12px;flex-wrap:wrap}.compendium-top-actions .wiki-create-link{display:none}.compendium-page{--compendium-gutter:20px;grid-template-columns:minmax(0,1fr);width:100%;padding:0}.compendium-navigation{position:static;height:auto;max-height:none;padding:0;border-right:0;border-bottom:1px solid #26394c;overflow:visible}.compendium-content>:is(.compendium-feedback,.compendium-search,.library-panel,.rules-onboarding,.compendium-workspace){margin-top:20px}.navigation-disclosure>summary{display:list-item;margin-left:20px;padding-left:0}.navigation-heading{display:none}.navigation-categories{grid-template-columns:repeat(2,minmax(0,1fr))}.navigation-tree{max-height:55vh;overflow:auto}.article-panel{padding:24px}.reader-focus .article-panel{padding:24px}}
@media(max-width:650px){.compendium-shell{--orbital-topbar:115px}.compendium-topbar{padding:9px 16px;gap:8px;align-content:center}.compendium-brand-lockup{margin-right:auto}.compendium-top-actions{display:flex;gap:6px}.compendium-top-actions .compact-link{min-height:34px;padding:7px 9px;font-size:11px}.compendium-top-actions .compact-link:nth-child(2){display:none}.compendium-page{--compendium-gutter:12px;width:100%;padding:0}.compendium-search{padding:18px}.category-strip{gap:6px}.category-chip{padding:8px 10px}.article-panel{padding:20px 16px}.reader-topline{margin-bottom:20px}.reader-tools{gap:4px}.reader-back{font-size:11px}.reader-progress-bar{gap:10px;padding:12px 0}.reader-progress-bar span{font-size:10px}.article-section :deep(p){line-height:1.9}.wiki-infobox{grid-template-columns:1fr}.wiki-toc{grid-column:auto}.category-page-links{grid-template-columns:1fr}.library-panel>summary span{display:block;margin-left:0}.category-group-card>header,.category-subgroup-list{padding:16px}.reader-contents-dialog{padding:20px}}
@media(prefers-reduced-motion:reduce){.compendium-shell *{scroll-behavior:auto;animation:none;transition:none}}

</style>
