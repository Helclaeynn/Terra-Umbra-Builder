<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { api, ApiError } from "../lib/api";
import TerraUmbraLockup from "../components/TerraUmbraLockup.vue";

type MediaRef = { src: string; alt?: string; caption?: string };
type ArticleBlock = {
  type: "p" | "table";
  text?: string;
  style?: string;
  rows?: string[][];
};
type ArticleSection = {
  id?: string;
  title?: string;
  level?: number;
  audience?: string;
  blocks: ArticleBlock[];
};
type EditableArticle = {
  id: string;
  title?: string;
  category?: string;
  source?: string;
  status?: string;
  tags?: string[];
  image?: string | MediaRef | null;
  illustration?: string | MediaRef | null;
  gallery?: MediaRef[];
  pnj?: Record<string, any>;
  sections?: ArticleSection[];
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

type CoverageItem = BuilderSourceRecord & {
  status: "linked" | "missing" | "ambiguous";
  matches: Array<{ id: string; title: string; category: string }>;
};

type CoveragePayload = {
  summary: { total: number; linked: number; missing: number; ambiguous: number };
  families: Array<{ family: string; total: number; linked: number; missing: number; ambiguous: number }>;
  items: CoverageItem[];
};

type TalentRegistryMeta = {
  total: number;
  natures: string[];
  groups: Array<{ groupId: string; natureId: string; label: string; count: number }>;
};

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id ?? ""));
const isNew = computed(() => route.path === "/compendium/new" || !id.value);
const pageId = ref("");
const article = ref<EditableArticle | null>(null);
const wikiText = ref("");
const sourceArea = ref<HTMLTextAreaElement | null>(null);
const tagsText = ref("");
const mediaType = ref<"image" | "illustration">("image");
const mediaSrc = ref("");
const mediaAlt = ref("");
const mediaCaption = ref("");
const mediaUploading = ref(false);
const portraitUploading = ref(false);
const pnjForm = ref({
  age: "",
  origine: "",
  statut: "",
  nomVerite: "",
  race: "",
  statutVerite: "",
  relations: "",
  portrait: "",
  portraitAlt: "",
  portraitCaption: ""
});
const loading = ref(true);
const busy = ref(false);
const error = ref("");
const notice = ref("");
const conflict = ref(false);
const draftUpdatedAt = ref<string | null>(null);
const publishedAt = ref<string | null>(null);
const builderSources = ref<BuilderSourceRecord[]>([]);
const coverage = ref<CoveragePayload | null>(null);
const coverageOpen = ref(false);
const coverageLoading = ref(false);
const coverageFamily = ref("");
const coverageStatus = ref<"" | "missing" | "ambiguous" | "linked">("missing");
const talentInsertOpen = ref(false);
const talentMeta = ref<TalentRegistryMeta | null>(null);
const talentInsertMode = ref<"nature" | "group">("nature");
const talentInsertNature = ref("vampire");
const talentInsertGroup = ref("");
const categories = ["Règles", "Réalité", "Vérité", "Personnages", "Équipement & Objets", "Bestiaire", "OLD"];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeMedia(value: unknown): MediaRef | null {
  if (typeof value === "string" && value.trim()) return { src: value.trim() };
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const src = String(source.src ?? "").trim();
    if (!src) return null;
    return {
      src,
      alt: String(source.alt ?? "").trim() || undefined,
      caption: String(source.caption ?? "").trim() || undefined
    };
  }
  return null;
}

function mediaUrl(value: unknown): string {
  const media = normalizeMedia(value);
  if (!media?.src) return "";
  const src = media.src;
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/api/compendium/media/")) return src;
  const clean = src.replace(/^\/?compendium\//, "").replace(/^\/+/, "");
  if (!clean.startsWith("images/") && !clean.startsWith("assets/")) return src;
  return `/api/compendium/media/${clean}`;
}

const familyLabels: Record<string, string> = {
  origins: "Origines",
  spheres: "Sphères",
  styles: "Styles",
  "reality-talents": "Talents de Réalité",
  disadvantages: "Désavantages",
  natures: "Natures",
  "truth-talents": "Talents de Vérité",
  equipment: "Équipement",
  augmentations: "Augmentations",
  recurring: "Services & charges"
};

const mechanicalLabels: Record<string, string> = {
  id: "ID Builder",
  name: "Nom",
  category: "Catégorie",
  sourceCategory: "Source",
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
  skills: "Compétences",
  expertiseFamilies: "Familles d’expertise",
  support: "Appui",
  fixedSkills: "Compétences fixes",
  recurring: "Récurrence",
  monthlyCost: "Coût mensuel",
  vehicle: "Véhicule",
  neuro: "Neuroprogramme",
  attribute: "Attribut",
  skill: "Compétence",
  sphere: "Sphère",
  originId: "Origine"
};

function mechanicalValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join(" · ");
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (value && typeof value === "object") return JSON.stringify(value);
  if (typeof value === "number") return new Intl.NumberFormat("fr-FR").format(value);
  return String(value ?? "—");
}

const filteredCoverage = computed(() => {
  const rows = coverage.value?.items ?? [];
  return rows.filter((item) =>
    (!coverageFamily.value || item.family === coverageFamily.value) &&
    (!coverageStatus.value || item.status === coverageStatus.value)
  );
});

const coveragePercent = computed(() => {
  const summary = coverage.value?.summary;
  if (!summary?.total) return 0;
  return Math.round((summary.linked / summary.total) * 100);
});

const previewMedia = computed(() =>
  mediaSrc.value.trim()
    ? mediaUrl({ src: mediaSrc.value.trim() })
    : article.value?.pnj?.portrait
      ? mediaUrl(article.value.pnj.portrait)
      : ""
);

function humanError(cause: unknown): string {
  if (cause instanceof ApiError) {
    const labels: Record<string, string> = {
      authentication_required: "Connexion requise.",
      editor_required: "Cette page est réservée aux éditeurs et administrateurs.",
      compendium_article_not_found: "Article introuvable.",
      invalid_compendium_article_title: "Le titre de la page n’est pas valide.",
      invalid_compendium_article: "Le contenu de l’article n’est pas valide.",
      compendium_draft_required: "Enregistre d’abord un brouillon avant de publier.",
      compendium_source_changed: "Le corpus source a changé. Recharge la page avant de republier.",
      compendium_image_required: "Choisis une image à envoyer.",
      compendium_image_too_large: "L’image dépasse la limite de 15 Mo.",
      invalid_compendium_image: "Le fichier image n’est pas valide.",
      unsupported_compendium_image: "Format non pris en charge. Utilise JPEG, PNG, WebP ou GIF."
    };
    return labels[cause.message] ?? cause.message;
  }
  return "Une erreur est survenue dans l’éditeur.";
}

function sectionsToWiki(sections: ArticleSection[] = []): string {
  const out: string[] = [];
  for (const section of sections) {
    if (section.audience === "mj") out.push("{{MJ}}");
    if (section.title) {
      const level = Math.max(2, Math.min(4, Number(section.level ?? 2)));
      const mark = "=".repeat(level);
      out.push(mark + " " + section.title + " " + mark, "");
    }
    for (const block of section.blocks ?? []) {
      if (block.type === "table") {
        out.push('{| class="wikitable"');
        for (const row of block.rows ?? []) out.push("|-", "| " + row.join(" || "));
        out.push("|}", "");
        continue;
      }
      const text = String(block.text ?? "");
      if (!text.trim()) continue;
      if (block.style === "lore") out.push("{{Lore}}");
      else if (block.style === "callout") out.push("{{Encadré}}");
      if (block.style === "list") {
        for (const line of text.split(/\r?\n/).filter(Boolean)) {
          out.push("* " + line.replace(/^\s*[•*-]\s*/, ""));
        }
        out.push("");
      } else {
        out.push(text, "");
      }
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function wikiToSections(source: string): ArticleSection[] {
  const lines = source.replace(/\r/g, "").split("\n");
  const sections: ArticleSection[] = [];
  let current: ArticleSection = { id: "intro", title: "", level: 2, blocks: [] };
  let paragraph: string[] = [];
  let pendingStyle = "";
  let pendingAudience = "";

  const pushSection = () => {
    if (current.title || current.blocks.length) sections.push(current);
  };
  const flush = () => {
    if (!paragraph.length) return;
    const text = paragraph.join("\n").trim();
    if (text) current.blocks.push({
      type: "p",
      text,
      ...(pendingStyle ? { style: pendingStyle } : {})
    });
    paragraph = [];
    pendingStyle = "";
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trim = line.trim();

    if (trim === "{{MJ}}") {
      flush();
      pendingAudience = "mj";
      continue;
    }
    if (trim === "{{Lore}}") {
      flush();
      pendingStyle = "lore";
      continue;
    }
    if (trim === "{{Encadré}}") {
      flush();
      pendingStyle = "callout";
      continue;
    }

    const heading = trim.match(/^(={2,4})\s*(.+?)\s*\1$/);
    if (heading) {
      flush();
      pushSection();
      current = {
        id: "section-" + (sections.length + 1),
        title: heading[2].trim(),
        level: heading[1].length,
        blocks: [],
        ...(pendingAudience ? { audience: pendingAudience } : {})
      };
      pendingAudience = "";
      continue;
    }

    if (trim.startsWith("{|")) {
      flush();
      const rows: string[][] = [];
      for (index += 1; index < lines.length; index += 1) {
        const rowLine = lines[index].trim();
        if (rowLine === "|}") break;
        if (rowLine === "|-" || !rowLine) continue;
        if (rowLine.startsWith("|") || rowLine.startsWith("!")) {
          rows.push(rowLine.slice(1).split(/\|\||!!/).map((value) => value.trim()));
        }
      }
      current.blocks.push({ type: "table", rows });
      continue;
    }

    if (/^\*\s+/.test(trim)) {
      flush();
      const items: string[] = [];
      while (index < lines.length && /^\*\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\*\s+/, ""));
        index += 1;
      }
      index -= 1;
      current.blocks.push({
        type: "p",
        style: "list",
        text: items.map((item) => "• " + item).join("\n")
      });
      continue;
    }

    if (!trim) {
      flush();
      continue;
    }
    paragraph.push(line);
  }

  flush();
  pushSection();
  return sections;
}

const previewSections = computed(() => wikiToSections(wikiText.value));

async function insertMarkup(before: string, after = "", placeholder = "Texte") {
  const element = sourceArea.value;
  if (!element) return;
  const start = element.selectionStart;
  const end = element.selectionEnd;
  const selected = wikiText.value.slice(start, end) || placeholder;
  wikiText.value =
    wikiText.value.slice(0, start) +
    before +
    selected +
    after +
    wikiText.value.slice(end);
  await nextTick();
  element.focus();
  element.setSelectionRange(start + before.length, start + before.length + selected.length);
}

async function insertHeading(level: number) {
  const element = sourceArea.value;
  if (!element) return;
  const start = element.selectionStart;
  const end = element.selectionEnd;
  const selected = wikiText.value.slice(start, end) || "Titre de section";
  const mark = "=".repeat(level);
  const prefix = start > 0 && !wikiText.value.slice(0, start).endsWith("\n") ? "\n\n" : "";
  const value = prefix + mark + " " + selected + " " + mark + "\n\n";
  wikiText.value = wikiText.value.slice(0, start) + value + wikiText.value.slice(end);
  await nextTick();
  element.focus();
}

async function insertBullet() {
  const element = sourceArea.value;
  if (!element) return;
  const start = element.selectionStart;
  const end = element.selectionEnd;
  const selected = wikiText.value.slice(start, end) || "Élément de liste";
  const value = selected
    .split(/\r?\n/)
    .map((line) => "* " + line.replace(/^\*\s*/, ""))
    .join("\n");
  wikiText.value = wikiText.value.slice(0, start) + value + wikiText.value.slice(end);
  await nextTick();
  element.focus();
}

async function insertTable() {
  const element = sourceArea.value;
  if (!element) return;
  const start = element.selectionStart;
  const value = '\n{| class="wikitable"\n|-\n| Colonne 1 || Colonne 2\n|-\n| Valeur || Valeur\n|}\n';
  wikiText.value = wikiText.value.slice(0, start) + value + wikiText.value.slice(start);
  await nextTick();
  element.focus();
}

function insertBold() {
  return insertMarkup("'''", "'''", "texte en gras");
}

function insertItalic() {
  return insertMarkup("''", "''", "texte en italique");
}

function insertMjSection() {
  return insertMarkup("{{MJ}}\n", "", "== Section MJ ==");
}

function insertLore() {
  return insertMarkup("{{Lore}}\n", "", "Texte de lore");
}

async function toggleTalentInsert() {
  talentInsertOpen.value = !talentInsertOpen.value;
  if (!talentInsertOpen.value || talentMeta.value) return;
  try {
    talentMeta.value = await api<TalentRegistryMeta>("/api/compendium/talents/meta");
    if (!talentMeta.value.natures.includes(talentInsertNature.value)) {
      talentInsertNature.value = talentMeta.value.natures[0] ?? "";
    }
    if (!talentInsertGroup.value) {
      talentInsertGroup.value = talentMeta.value.groups[0]?.groupId ?? "";
    }
  } catch (cause) {
    error.value = humanError(cause);
  }
}

const talentInsertGroups = computed(() =>
  (talentMeta.value?.groups ?? []).filter(group =>
    !talentInsertNature.value || group.natureId === talentInsertNature.value
  )
);

function talentDirectiveInfo(value: unknown) {
  const text = String(value ?? "").trim();
  const match = text.match(/^\{\{Talents\|(.+)\}\}$/i);
  if (!match) return null;
  const fields = new Map<string,string>();
  for (const part of match[1].split("|")) {
    const [rawKey,...rest] = part.split("=");
    fields.set(rawKey.trim().toLowerCase(), rest.join("=").trim());
  }
  const nature = fields.get("nature") || fields.get("natureid") || "";
  const group = fields.get("group") || fields.get("groupid") || "";
  const ids = fields.get("ids") || "";
  if (group) {
    const found = talentMeta.value?.groups.find(item => item.groupId === group);
    return { label: found?.label || group, detail: found ? `${found.natureId} · ${found.count} Talent${found.count > 1 ? "s" : ""}` : "Groupe dynamique" };
  }
  if (nature) {
    const count = talentMeta.value?.groups
      .filter(item => item.natureId === nature)
      .reduce((sum,item) => sum + item.count,0);
    return { label: `Talents · ${nature}`, detail: count ? `${count} Talents` : "Nature dynamique" };
  }
  if (ids) {
    const count = ids.split(",").map(value => value.trim()).filter(Boolean).length;
    return { label: "Sélection de Talents", detail: `${count} Talent${count > 1 ? "s" : ""}` };
  }
  return null;
}

async function insertTalentBlock() {
  const element = sourceArea.value;
  if (!element) return;
  let directive = "";
  if (talentInsertMode.value === "group" && talentInsertGroup.value) {
    directive = `{{Talents|group=${talentInsertGroup.value}}}`;
  } else if (talentInsertNature.value) {
    directive = `{{Talents|nature=${talentInsertNature.value}}}`;
  }
  if (!directive) return;
  const start = element.selectionStart;
  const prefix = start > 0 && !wikiText.value.slice(0,start).endsWith("\n") ? "\n\n" : "";
  wikiText.value = wikiText.value.slice(0,start) + prefix + directive + "\n\n" + wikiText.value.slice(start);
  talentInsertOpen.value = false;
  await nextTick();
  element.focus();
}

function previewInline(value: unknown): string {
  const escaped = String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  return escaped
    .replace(/&#39;&#39;&#39;([^\n]+?)&#39;&#39;&#39;/g, "<strong>$1</strong>")
    .replace(/&#39;&#39;([^\n]+?)&#39;&#39;/g, "<em>$1</em>");
}

function fileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("file_read_failed"));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const marker = result.indexOf(",");
      resolve(marker >= 0 ? result.slice(marker + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

async function uploadLocalImage(event: Event, slot: "page" | "portrait") {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const file = input.files?.[0];
  if (!file) return;

  error.value = "";
  notice.value = "";

  if (file.size > 15 * 1024 * 1024) {
    error.value = "L’image dépasse la limite de 15 Mo.";
    input.value = "";
    return;
  }

  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
    error.value = "Format non pris en charge. Utilise JPEG, PNG, WebP ou GIF.";
    input.value = "";
    return;
  }

  if (!(await ensureCreated())) {
    input.value = "";
    return;
  }

  if (slot === "portrait") portraitUploading.value = true;
  else mediaUploading.value = true;

  try {
    const payload = await api<{ src: string }>(
      `/api/compendium/editor/articles/${encodeURIComponent(pageId.value)}/media`,
      {
        method: "POST",
        body: JSON.stringify({
          slot,
          data: await fileAsBase64(file)
        })
      }
    );

    if (slot === "portrait") {
      pnjForm.value.portrait = payload.src;
      if (!pnjForm.value.portraitAlt.trim()) {
        pnjForm.value.portraitAlt = article.value?.title ?? "";
      }
    } else {
      mediaSrc.value = payload.src;
      if (!mediaAlt.value.trim()) mediaAlt.value = article.value?.title ?? "";
    }

    notice.value =
      slot === "portrait"
        ? "Portrait envoyé. Enregistre ou publie la page pour conserver la référence."
        : "Image envoyée. Enregistre ou publie la page pour conserver la référence.";
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    if (slot === "portrait") portraitUploading.value = false;
    else mediaUploading.value = false;
    input.value = "";
  }
}

function enablePnj() {
  if (article.value && !article.value.pnj) article.value.pnj = {};
}

function disablePnj() {
  if (article.value?.pnj && window.confirm("Retirer la fiche structurée de personnage ?")) {
    delete article.value.pnj;
  }
}

function fillForms(source: EditableArticle) {
  tagsText.value = (source.tags ?? []).join(", ");
  wikiText.value = sectionsToWiki(source.sections ?? []);

  const media = normalizeMedia(source.illustration ?? source.image);
  mediaType.value = source.illustration ? "illustration" : "image";
  mediaSrc.value = media?.src ?? "";
  mediaAlt.value = media?.alt ?? "";
  mediaCaption.value = media?.caption ?? "";

  const p = source.pnj ?? {};
  pnjForm.value = {
    age: String(p.age ?? ""),
    origine: String(p.origine ?? ""),
    statut: String(p.statut ?? ""),
    nomVerite: String(p.nom_verite ?? ""),
    race: String(p.race ?? ""),
    statutVerite: String(p.statut_verite ?? ""),
    relations: Array.isArray(p.relations) ? p.relations.join("\n") : "",
    portrait: String(p.portrait ?? ""),
    portraitAlt: String(p.portrait_alt ?? ""),
    portraitCaption: String(p.portrait_caption ?? "")
  };
}

async function loadBuilderSource(articleId: string) {
  if (!articleId) {
    builderSources.value = [];
    return;
  }
  try {
    const payload = await api<{ records: BuilderSourceRecord[] }>(
      `/api/compendium/editor/builder-source/${encodeURIComponent(articleId)}`
    );
    builderSources.value = payload.records;
  } catch {
    builderSources.value = [];
  }
}

async function toggleCoverage() {
  coverageOpen.value = !coverageOpen.value;
  if (!coverageOpen.value || coverage.value || coverageLoading.value) return;
  coverageLoading.value = true;
  try {
    coverage.value = await api<CoveragePayload>("/api/compendium/editor/builder-coverage");
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    coverageLoading.value = false;
  }
}

function closeCoverage() {
  coverageOpen.value = false;
}

async function createCoveragePage(item: CoverageItem) {
  coverageOpen.value = false;
  await router.push({
    path: "/compendium/new",
    query: {
      title: item.label,
      category: item.category,
      source: `Builder · ${familyLabels[item.family] || item.family}`,
      tags: [item.kind, "Builder"].join(",")
    }
  });
  await load();
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    if (isNew.value) {
      const requestedCategory = String(route.query.category ?? "Réalité").trim();
      article.value = {
        id: "",
        title: String(route.query.title ?? ""),
        category: requestedCategory || "Réalité",
        source: String(route.query.source ?? ""),
        status: "canon_enrichi",
        tags: String(route.query.tags ?? "")
          .split(",")
          .map(value => value.trim())
          .filter(Boolean),
        sections: []
      };
      pageId.value = "";
      builderSources.value = [];
      fillForms(article.value);
      return;
    }

    const payload = await api<{
      article: EditableArticle;
      draft: EditableArticle | null;
      conflict: boolean;
      draftUpdatedAt: string | null;
      publishedAt: string | null;
    }>(`/api/compendium/editor/articles/${encodeURIComponent(id.value)}`);

    pageId.value = id.value;
    article.value = clone(payload.draft ?? payload.article);
    conflict.value = payload.conflict;
    draftUpdatedAt.value = payload.draftUpdatedAt;
    publishedAt.value = payload.publishedAt;
    fillForms(article.value);
    await loadBuilderSource(pageId.value);
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    loading.value = false;
  }
}

function syncForms() {
  if (!article.value) return;

  article.value.tags = tagsText.value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  article.value.sections = wikiToSections(wikiText.value);

  article.value.image = null;
  article.value.illustration = null;
  if (mediaSrc.value.trim()) {
    article.value[mediaType.value] = {
      src: mediaSrc.value.trim(),
      ...(mediaAlt.value.trim() ? { alt: mediaAlt.value.trim() } : {}),
      ...(mediaCaption.value.trim() ? { caption: mediaCaption.value.trim() } : {})
    };
  }

  if (article.value.pnj) {
    const p = article.value.pnj;
    const optional = (key: string, value: string) => {
      const clean = value.trim();
      if (clean) p[key] = clean;
      else delete p[key];
    };
    optional("age", pnjForm.value.age);
    optional("origine", pnjForm.value.origine);
    optional("statut", pnjForm.value.statut);
    optional("nom_verite", pnjForm.value.nomVerite);
    optional("race", pnjForm.value.race);
    optional("statut_verite", pnjForm.value.statutVerite);
    optional("portrait", pnjForm.value.portrait);
    optional("portrait_alt", pnjForm.value.portraitAlt);
    optional("portrait_caption", pnjForm.value.portraitCaption);
    const relations = pnjForm.value.relations.split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
    if (relations.length) p.relations = relations;
    else delete p.relations;
  }
}

function addSection() {
  if (!article.value) return;
  article.value.sections ??= [];
  article.value.sections.push({
    id: `manual-${Date.now()}`,
    title: "Nouvelle section",
    level: 2,
    blocks: [{ type: "p", text: "" }]
  });
}

function removeSection(index: number) {
  article.value?.sections?.splice(index, 1);
}

function addParagraph(section: ArticleSection) {
  section.blocks.push({ type: "p", text: "" });
}

function addTable(section: ArticleSection) {
  section.blocks.push({ type: "table", rows: [["Clé", "Valeur"]] });
}

function removeBlock(section: ArticleSection, index: number) {
  section.blocks.splice(index, 1);
}

function tableText(block: ArticleBlock): string {
  return (block.rows ?? []).map((row) => row.join("\t")).join("\n");
}

function setTableText(block: ArticleBlock, value: string) {
  block.rows = value
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => line.split("\t"));
}

function setTableEvent(block: ArticleBlock, event: Event) {
  const target = event.target;
  if (target instanceof HTMLTextAreaElement) setTableText(block, target.value);
}

async function ensureCreated(): Promise<boolean> {
  if (pageId.value) return true;
  if (!article.value?.title?.trim()) {
    error.value = "Donne un titre à la nouvelle page.";
    return false;
  }

  syncForms();
  try {
    const payload = await api<{ articleId: string; article: EditableArticle }>(
      "/api/compendium/editor/articles",
      {
        method: "POST",
        body: JSON.stringify({
          title: article.value.title,
          category: article.value.category,
          source: article.value.source,
          status: article.value.status,
          tags: article.value.tags
        })
      }
    );
    pageId.value = payload.articleId;
    article.value.id = payload.articleId;
    await router.replace("/compendium/edit/" + encodeURIComponent(payload.articleId));
    await loadBuilderSource(payload.articleId);
    return true;
  } catch (cause) {
    error.value = humanError(cause);
    return false;
  }
}

async function saveDraft(showNotice = true): Promise<boolean> {
  if (!article.value || !(await ensureCreated())) return false;
  syncForms();
  busy.value = true;
  error.value = "";
  notice.value = "";

  try {
    await api(`/api/compendium/editor/articles/${encodeURIComponent(pageId.value)}/draft`, {
      method: "PUT",
      body: JSON.stringify({ article: article.value })
    });
    draftUpdatedAt.value = new Date().toISOString();
    conflict.value = false;
    if (showNotice) notice.value = "Brouillon enregistré.";
    return true;
  } catch (cause) {
    error.value = humanError(cause);
    return false;
  } finally {
    busy.value = false;
  }
}

async function publish() {
  const saved = await saveDraft(false);
  if (!saved) return;

  busy.value = true;
  error.value = "";
  notice.value = "";
  try {
    const payload = await api<{ article: EditableArticle }>(
      `/api/compendium/editor/articles/${encodeURIComponent(pageId.value)}/publish`,
      { method: "POST" }
    );
    article.value = clone(payload.article);
    fillForms(article.value);
    publishedAt.value = new Date().toISOString();
    draftUpdatedAt.value = null;
    notice.value = "Modification publiée dans le wiki.";
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    busy.value = false;
  }
}

async function discardDraft() {
  if (!window.confirm("Supprimer le brouillon et revenir à la version publiée ?")) return;
  busy.value = true;
  try {
    await api(`/api/compendium/editor/articles/${encodeURIComponent(pageId.value)}/draft`, {
      method: "DELETE"
    });
    await load();
    notice.value = "Brouillon supprimé.";
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    busy.value = false;
  }
}

async function backToArticle() {
  if (pageId.value && publishedAt.value) {
    await router.push({ path: "/compendium", query: { article: pageId.value } });
  } else {
    await router.push("/compendium");
  }
}

onMounted(load);
</script>

<template>
  <div class="wiki-editor-shell">
    <header class="wiki-editor-topbar">
      <RouterLink class="brand editor-brand-lockup" to="/">
        <TerraUmbraLockup compact />
      </RouterLink>
      <div class="editor-top-actions">
        <button class="ghost compact" type="button" :aria-expanded="coverageOpen" @click="toggleCoverage">
          Couverture Builder
          <span v-if="coverage" class="coverage-mini">{{ coveragePercent }}%</span>
        </button>
        <button class="ghost" type="button" @click="backToArticle">← Retour à l’article</button>
      </div>
    </header>

    <button
      v-if="coverageOpen"
      class="coverage-backdrop"
      type="button"
      aria-label="Fermer l’audit de couverture"
      @click="closeCoverage"
    ></button>
    <aside class="coverage-drawer" :class="{ open: coverageOpen }" :aria-hidden="!coverageOpen">
      <header class="coverage-head">
        <div>
          <p class="eyebrow">AUDIT BUILDER → WIKI</p>
          <h2>Couverture du Compendium</h2>
          <p>Les associations exactes entre les catalogues mécaniques et leurs pages encyclopédiques.</p>
        </div>
        <button class="ghost compact" type="button" @click="closeCoverage">Fermer</button>
      </header>

      <div v-if="coverageLoading" class="coverage-loading">
        <span></span><span></span><span></span>
      </div>

      <template v-else-if="coverage">
        <div class="coverage-score">
          <strong>{{ coveragePercent }}%</strong>
          <div>
            <span>{{ coverage.summary.linked }} liés</span>
            <small>{{ coverage.summary.total }} éléments canoniques</small>
          </div>
        </div>

        <div class="coverage-stats">
          <article><strong>{{ coverage.summary.linked }}</strong><span>Liés</span></article>
          <article><strong>{{ coverage.summary.missing }}</strong><span>Sans page</span></article>
          <article><strong>{{ coverage.summary.ambiguous }}</strong><span>Ambigus</span></article>
        </div>

        <div class="coverage-family-grid">
          <article v-for="family in coverage.families" :key="family.family">
            <div>
              <strong>{{ familyLabels[family.family] || family.family }}</strong>
              <span>{{ family.linked }}/{{ family.total }}</span>
            </div>
            <div class="coverage-family-track">
              <span :style="{ width: family.total ? ((family.linked / family.total) * 100) + '%' : '0%' }"></span>
            </div>
            <small>
              <template v-if="family.missing">{{ family.missing }} sans page</template>
              <template v-if="family.missing && family.ambiguous"> · </template>
              <template v-if="family.ambiguous">{{ family.ambiguous }} ambigu{{ family.ambiguous > 1 ? 's' : '' }}</template>
              <template v-if="!family.missing && !family.ambiguous">Couverture complète</template>
            </small>
          </article>
        </div>

        <div class="coverage-filters">
          <select v-model="coverageStatus" aria-label="État de couverture">
            <option value="">Tous les états</option>
            <option value="missing">Sans page</option>
            <option value="ambiguous">Ambigus</option>
            <option value="linked">Liés</option>
          </select>
          <select v-model="coverageFamily" aria-label="Famille Builder">
            <option value="">Toutes les familles</option>
            <option v-for="family in coverage.families" :key="family.family" :value="family.family">
              {{ familyLabels[family.family] || family.family }} · {{ family.linked }}/{{ family.total }}
            </option>
          </select>
        </div>

        <div class="coverage-list">
          <article v-for="item in filteredCoverage" :key="item.key" :class="item.status">
            <div>
              <span>{{ familyLabels[item.family] || item.family }}</span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.kind }}</small>
            </div>
            <div class="coverage-item-state">
              <b>{{ item.status === "linked" ? "Lié" : item.status === "ambiguous" ? "Ambigu" : "À créer" }}</b>
              <div v-if="item.status === 'ambiguous' && item.matches.length" class="coverage-matches">
                <a
                  v-for="match in item.matches"
                  :key="match.id"
                  :href="`/compendium?article=${encodeURIComponent(match.id)}`"
                  target="_blank"
                  rel="noopener"
                >
                  <strong>{{ match.title }}</strong>
                  <small>{{ match.category }}</small>
                </a>
              </div>
              <small v-else-if="item.matches.length">{{ item.matches.map(match => match.title).join(" · ") }}</small>
              <button
                v-if="item.status !== 'linked'"
                class="coverage-create"
                type="button"
                @click="createCoveragePage(item)"
              >
                {{ item.status === "ambiguous" ? "Créer une page distincte" : "Créer la page" }}
              </button>
            </div>
          </article>
        </div>
      </template>
    </aside>

    <main class="wiki-editor-page">
      <div v-if="loading" class="panel editor-loading editor-skeleton" aria-label="Chargement de l’éditeur">
        <span></span><span></span><span></span><span></span>
      </div>
      <div v-else-if="error && !article" class="feedback error">{{ error }}</div>

      <template v-else-if="article">
        <header class="editor-heading">
          <div>
            <p class="eyebrow">{{ isNew && !pageId ? "NOUVELLE PAGE WIKI" : "ÉDITION WIKI" }}</p>
            <h1>{{ article.title || "Nouvelle page" }}</h1>
            <p>
              Édite le contenu comme une page encyclopédique. Le brouillon reste privé jusqu’à publication.
            </p>
          </div>
          <div class="editor-state">
            <span v-if="draftUpdatedAt">Brouillon enregistré</span>
            <span v-if="publishedAt">Publié</span>
            <span v-if="conflict" class="danger">Source modifiée</span>
          </div>
        </header>

        <div v-if="error" class="feedback error">{{ error }}</div>
        <div v-if="notice" class="feedback">{{ notice }}</div>
        <div v-if="conflict" class="feedback error">
          Le corpus source a changé depuis ce brouillon. Recharge ou réenregistre le brouillon avant publication.
        </div>

        <div class="wiki-editor-grid">
          <section class="editor-form-column">
            <div class="panel editor-card">
              <p class="eyebrow">IDENTITÉ DE LA PAGE</p>
              <label>Titre<input v-model="article.title" maxlength="240" placeholder="Titre de la page" /></label>
              <div class="editor-two">
                <label>Statut<input v-model="article.status" placeholder="canon_recent…" /></label>
                <label>Rubrique
                  <input
                    v-model="article.category"
                    list="compendium-category-suggestions"
                    maxlength="80"
                    placeholder="Règles, Lieux, Organisations…"
                  />
                  <datalist id="compendium-category-suggestions">
                    <option v-for="item in categories" :key="item" :value="item"></option>
                  </datalist>
                </label>
              </div>
              <label>Source<input v-model="article.source" /></label>
              <label>Tags<textarea v-model="tagsText" rows="2" placeholder="Vérité, Garous, Californie…" /></label>
            </div>

            <div v-if="!isNew" class="panel editor-card builder-source-card" :class="{ linked: builderSources.length }">
              <div class="editor-card-title">
                <div>
                  <p class="eyebrow">SOURCE MÉCANIQUE</p>
                  <h2>{{ builderSources.length ? "Relié au Builder" : "Aucune liaison Builder" }}</h2>
                </div>
                <span class="builder-source-state" :class="{ ok: builderSources.length }">
                  {{ builderSources.length ? "Données verrouillées" : "Lore uniquement" }}
                </span>
              </div>
              <p class="editor-hint">
                <template v-if="builderSources.length">
                  Les valeurs ci-dessous proviennent du Builder et ne sont pas éditables ici. Le wiki reste responsable du lore, des illustrations et de la rédaction.
                </template>
                <template v-else>
                  Cette page n’est reliée à aucun objet mécanique canonique. L’audit de couverture permet d’identifier les pages manquantes.
                </template>
              </p>
              <div v-for="source in builderSources" :key="source.key" class="builder-source-record">
                <header>
                  <div>
                    <span>{{ familyLabels[source.family] || source.family }}</span>
                    <strong>{{ source.label }}</strong>
                  </div>
                  <small>{{ source.kind }}</small>
                </header>
                <dl>
                  <template v-for="(value,key) in source.mechanics" :key="key">
                    <dt>{{ mechanicalLabels[String(key)] || key }}</dt>
                    <dd>{{ mechanicalValue(value) }}</dd>
                  </template>
                </dl>
              </div>
            </div>

            <div class="panel editor-card">
              <div class="editor-card-title">
                <div><p class="eyebrow">ILLUSTRATION</p><h2>Image de la page</h2></div>
              </div>
              <div class="editor-two">
                <label>Type
                  <select v-model="mediaType">
                    <option value="image">Image</option>
                    <option value="illustration">Illustration</option>
                  </select>
                </label>
                <label>Texte alternatif<input v-model="mediaAlt" /></label>
              </div>
              <label class="editor-upload-field">
                Choisir une image depuis mon PC
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  :disabled="mediaUploading"
                  @change="uploadLocalImage($event, 'page')"
                />
                <small>{{ mediaUploading ? "Envoi en cours…" : "JPEG, PNG, WebP ou GIF · 15 Mo maximum" }}</small>
              </label>
              <label>Ou utiliser un chemin / une URL
                <input v-model="mediaSrc" placeholder="images/manual/… ou https://…" />
              </label>
              <label>Légende<input v-model="mediaCaption" /></label>
              <img v-if="previewMedia" class="editor-media-preview" :src="previewMedia" :alt="mediaAlt || article.title" />
            </div>

            <div v-if="!article.pnj" class="panel editor-card">
              <p class="eyebrow">FICHE PERSONNAGE</p>
              <p class="editor-hint">Optionnel : ajoute des champs structurés si cette page décrit un personnage.</p>
              <button class="secondary" type="button" @click="enablePnj">Ajouter une fiche personnage</button>
            </div>

            <div v-else class="panel editor-card">
              <p class="eyebrow">FICHE PERSONNAGE</p>
              <div class="editor-two">
                <label>Âge<input v-model="pnjForm.age" /></label>
                <label>Origine<input v-model="pnjForm.origine" /></label>
                <label>Statut<input v-model="pnjForm.statut" /></label>
                <label>Nom de Vérité<input v-model="pnjForm.nomVerite" /></label>
                <label>Race / nature<input v-model="pnjForm.race" /></label>
                <label>Statut de Vérité<input v-model="pnjForm.statutVerite" /></label>
              </div>
              <label>Relations<textarea v-model="pnjForm.relations" rows="4" placeholder="Une relation par ligne" /></label>
              <label class="editor-upload-field">
                Choisir le portrait depuis mon PC
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  :disabled="portraitUploading"
                  @change="uploadLocalImage($event, 'portrait')"
                />
                <small>{{ portraitUploading ? "Envoi en cours…" : "JPEG, PNG, WebP ou GIF · 15 Mo maximum" }}</small>
              </label>
              <label>Ou utiliser un chemin / une URL
                <input v-model="pnjForm.portrait" placeholder="images/… ou URL" />
              </label>
              <div class="editor-two">
                <label>Alt portrait<input v-model="pnjForm.portraitAlt" /></label>
                <label>Légende portrait<input v-model="pnjForm.portraitCaption" /></label>
              </div>
              <button class="danger-button" type="button" @click="disablePnj">Retirer la fiche personnage</button>
            </div>

            <div class="editor-sections-head">
              <div>
                <p class="eyebrow">CONTENU</p>
                <h2>Texte de la page</h2>
                <p class="editor-hint">Écris d’un seul tenant. Les sections techniques sont reconstruites automatiquement.</p>
              </div>
            </div>

            <div class="panel wiki-source-card">
              <div class="wiki-toolbar" aria-label="Outils d’édition wiki">
                <button type="button" title="Titre de section" @click="insertHeading(2)">H2</button>
                <button type="button" title="Sous-section" @click="insertHeading(3)">H3</button>
                <button type="button" title="Gras" @click="insertBold"><strong>B</strong></button>
                <button type="button" title="Italique" @click="insertItalic"><em>I</em></button>
                <button type="button" title="Liste" @click="insertBullet">• Liste</button>
                <button type="button" title="Tableau" @click="insertTable">▦ Tableau</button>
                <button type="button" title="Section MJ" @click="insertMjSection">MJ</button>
                <button type="button" title="Encadré lore" @click="insertLore">Lore</button>
                <button type="button" title="Bloc dynamique de Talents" :class="{ active: talentInsertOpen }" @click="toggleTalentInsert">Talents</button>
              </div>
              <div v-if="talentInsertOpen" class="talent-insert-panel">
                <div>
                  <strong>Insérer des Talents dynamiques</strong>
                  <small>Le texte des Talents restera centralisé dans le registre canonique.</small>
                </div>
                <select v-model="talentInsertMode" aria-label="Type de bloc Talents">
                  <option value="nature">Toute une Nature</option>
                  <option value="group">Un groupe de Talents</option>
                </select>
                <select v-model="talentInsertNature" aria-label="Nature des Talents">
                  <option v-for="nature in talentMeta?.natures || []" :key="nature" :value="nature">{{ nature }}</option>
                </select>
                <select
                  v-if="talentInsertMode === 'group'"
                  v-model="talentInsertGroup"
                  aria-label="Groupe de Talents"
                >
                  <option v-for="group in talentInsertGroups" :key="group.groupId" :value="group.groupId">
                    {{ group.label }} · {{ group.count }}
                  </option>
                </select>
                <button class="secondary compact" type="button" @click="insertTalentBlock">Insérer</button>
                <button class="ghost compact" type="button" @click="talentInsertOpen=false">Annuler</button>
              </div>
              <textarea
                ref="sourceArea"
                v-model="wikiText"
                class="wiki-source"
                spellcheck="true"
                placeholder="Rédige ici…

== Une section ==
Le texte de la section.

=== Une sous-section ===
Encore du texte.

* Un élément
* Un autre élément"
              />
              <div class="syntax-help">
                <span><code>== Titre ==</code> section</span>
                <span><code>=== Sous-titre ===</code> sous-section</span>
                <span><code>* élément</code> liste</span>
                <span><code>'''gras'''</code> et <code>''italique''</code></span>
                <span><code v-pre>{{Talents|…}}</code> cartes alimentées par le registre central.</span>
                <span>Les liens vers les autres pages sont détectés automatiquement.</span>
              </div>
            </div>
          </section>

          <aside class="panel editor-preview-column">
            <p class="eyebrow">APERÇU</p>
            <figure v-if="previewMedia" class="preview-figure">
              <img :src="previewMedia" :alt="mediaAlt || article.title" />
              <figcaption v-if="mediaCaption">{{ mediaCaption }}</figcaption>
            </figure>
            <h1>{{ article.title }}</h1>
            <div class="preview-meta">
              <span v-if="article.category">{{ article.category }}</span>
              <span v-if="article.status">{{ article.status }}</span>
            </div>

            <section v-for="(section, index) in previewSections" :key="section.id || index" :class="{ 'mj-preview': section.audience === 'mj' }">
              <h2 v-if="section.title && Number(section.level || 2) === 2">{{ section.title }}</h2>
              <h3 v-else-if="section.title && Number(section.level || 2) === 3">{{ section.title }}</h3>
              <h4 v-else-if="section.title">{{ section.title }}</h4>
              <template v-for="(block, blockIndex) in section.blocks" :key="blockIndex">
                <div v-if="block.type === 'p' && talentDirectiveInfo(block.text)" class="preview-talent-embed">
                  <span>REGISTRE DE TALENTS</span>
                  <strong>{{ talentDirectiveInfo(block.text)?.label }}</strong>
                  <small>{{ talentDirectiveInfo(block.text)?.detail }}</small>
                </div>
                <p v-else-if="block.type === 'p'" :class="block.style" v-html="previewInline(block.text)"></p>
                <table v-else>
                  <tbody>
                    <tr v-for="(row, rowIndex) in block.rows || []" :key="rowIndex">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </section>
          </aside>
        </div>

        <div class="editor-actions">
          <button class="danger-button" type="button" :disabled="busy || !draftUpdatedAt" @click="discardDraft">
            Supprimer le brouillon
          </button>
          <span class="spacer"></span>
          <button class="secondary" type="button" :disabled="busy" @click="saveDraft()">
            {{ busy ? "Enregistrement…" : "Enregistrer le brouillon" }}
          </button>
          <button class="primary" type="button" :disabled="busy || conflict || !article.title?.trim()" @click="publish">
            Publier dans le wiki
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.wiki-editor-shell { min-height: 100vh; background:radial-gradient(circle at 82% 8%,rgba(43,146,255,.1),transparent 30rem); }
.editor-top-actions{display:flex;align-items:center;gap:.55rem}.coverage-mini{margin-left:.35rem;color:#b8dfea;font-size:.68rem}
.coverage-backdrop{position:fixed;inset:0;z-index:44;border:0;background:rgba(0,0,0,.52);backdrop-filter:blur(3px)}
.coverage-drawer{position:fixed;top:0;right:0;z-index:45;width:min(560px,94vw);height:100vh;padding:1.2rem;overflow:auto;border-left:1px solid rgba(70,126,148,.16);background:linear-gradient(180deg,#101b25,#081119);box-shadow:-30px 0 80px rgba(0,0,0,.45);transform:translateX(104%);opacity:0;pointer-events:none;transition:transform .24s cubic-bezier(.2,.7,.2,1),opacity .18s ease}.coverage-drawer.open{transform:none;opacity:1;pointer-events:auto}
.coverage-head{display:flex;justify-content:space-between;gap:1rem;padding:.25rem 0 1rem;border-bottom:1px solid rgba(255,255,255,.08)}.coverage-head h2{margin:.12rem 0 .35rem;font:500 1.65rem/1.1 Georgia,serif}.coverage-head p:not(.eyebrow){margin:0;color:#718a95;font-size:.76rem;line-height:1.5}
.coverage-score{display:flex;align-items:center;gap:1rem;padding:1rem 0}.coverage-score>strong{font:500 2.8rem/1 Georgia,serif;color:#b8dfea}.coverage-score>div{display:grid;gap:.15rem}.coverage-score span{color:#b8c9cf}.coverage-score small{color:#667f8b}
.coverage-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem}.coverage-stats article{display:grid;gap:.2rem;padding:.75rem;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.018)}.coverage-stats strong{font:500 1.45rem/1 Georgia,serif}.coverage-stats span{color:#718a95;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em}
.coverage-family-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;margin:1rem 0}
.coverage-family-grid article{padding:.65rem;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.012)}
.coverage-family-grid article>div:first-child{display:flex;justify-content:space-between;gap:.5rem;align-items:center}.coverage-family-grid strong{color:#c5d4d9;font-size:.7rem}.coverage-family-grid article>div:first-child span{color:#6fb9d6;font-size:.65rem}
.coverage-family-track{height:3px;margin:.45rem 0;background:rgba(255,255,255,.06);overflow:hidden}.coverage-family-track span{display:block;height:100%;background:linear-gradient(90deg,#365f73,#58dcc5)}
.coverage-family-grid small{color:#667f8b;font-size:.6rem}
.coverage-matches{display:grid;gap:.28rem;margin:.35rem 0}.coverage-matches a{display:flex;justify-content:space-between;gap:.5rem;padding:.38rem .45rem;border:1px solid rgba(255,255,255,.07);color:inherit;text-decoration:none;background:rgba(255,255,255,.012)}.coverage-matches a:hover{border-color:rgba(88,220,197,.3);background:rgba(43,146,255,.05)}.coverage-matches strong{color:#c5d4d9;font-size:.66rem}.coverage-matches small{color:#718a95;font-size:.6rem}
.coverage-filters{display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin:1rem 0}.coverage-list{display:grid;gap:.45rem}.coverage-list article{display:flex;justify-content:space-between;gap:1rem;padding:.7rem .75rem;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.012)}.coverage-list article.missing{border-left:3px solid #aa695e}.coverage-list article.ambiguous{border-left:3px solid #b99556}.coverage-list article.linked{border-left:3px solid #6f9f78}.coverage-list article>div:first-child{display:grid;gap:.15rem}.coverage-list article span{color:#709aad;font-size:.62rem;text-transform:uppercase;letter-spacing:.06em}.coverage-list article strong{color:#d7e3e7;font-size:.82rem}.coverage-list article small{color:#667f8b;font-size:.66rem}.coverage-item-state{display:grid;gap:.2rem;text-align:right;align-content:start;max-width:46%}.coverage-item-state b{color:#a6bac2;font-size:.7rem}.coverage-create{justify-self:end;margin-top:.25rem;padding:.3rem .45rem;border:1px solid rgba(88,220,197,.28);background:rgba(43,146,255,.06);color:#91cfe0;font-size:.65rem}.coverage-create:hover{border-color:#4cb6d9;background:rgba(43,146,255,.12)}.coverage-loading{display:grid;gap:.6rem;padding:1rem 0}.coverage-loading span,.editor-skeleton span{height:14px;background:linear-gradient(90deg,rgba(255,255,255,.035),rgba(255,255,255,.09),rgba(255,255,255,.035));background-size:220% 100%;animation:editor-shimmer 1.2s linear infinite}.coverage-loading span:nth-child(2),.editor-skeleton span:nth-child(2){width:72%}.coverage-loading span:nth-child(3){width:84%}
@keyframes editor-shimmer{to{background-position:-220% 0}}

.wiki-editor-topbar {
  min-height: 72px; display:flex; align-items:center; justify-content:space-between; gap:1rem;
  padding:0 clamp(1rem,4vw,3rem); position:sticky; top:0; z-index:30;
  border-bottom:1px solid rgba(70,126,148,.13); background:rgba(8,15,23,.97);
}
.wiki-editor-page { width:min(1540px,calc(100% - 2rem)); margin:0 auto; padding:2rem 0 7rem; }
.editor-loading { padding:2rem; }.editor-skeleton{display:grid;gap:.75rem;min-height:180px;align-content:center}.editor-skeleton span{height:18px}.editor-skeleton span:nth-child(3){width:88%}.editor-skeleton span:nth-child(4){width:58%}
.editor-heading { display:flex; justify-content:space-between; gap:2rem; align-items:end; margin-bottom:1.2rem; }
.editor-heading h1 { margin:.2rem 0 .5rem; font:500 clamp(2rem,4vw,3.8rem)/1.04 Georgia,serif; }
.editor-heading p:not(.eyebrow) { margin:0; max-width:72ch; color:#91a7b1; }
.editor-state { display:flex; gap:.45rem; flex-wrap:wrap; justify-content:flex-end; }
.editor-state span { padding:.35rem .55rem; border:1px solid rgba(255,255,255,.1); color:#91a7b1; font-size:.72rem; }
.editor-state .danger { color:#d7a39b; border-color:rgba(215,163,155,.35); }
.wiki-editor-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(330px,.65fr); gap:1rem; align-items:start; }
.editor-form-column { display:grid; gap:1rem; }
.editor-card,.editor-section-card,.editor-preview-column { padding:1rem; }
.editor-card { display:grid; gap:.8rem; border-color:rgba(70,126,148,.12); background:linear-gradient(145deg,rgba(26,24,20,.9),rgba(20,18,15,.78)); }.editor-card:hover{border-color:rgba(70,126,148,.2)}
.editor-card-title,.editor-sections-head { display:flex; justify-content:space-between; align-items:end; gap:1rem; }
.editor-card h2,.editor-sections-head h2 { margin:.15rem 0 0; font:500 1.45rem/1.2 Georgia,serif; }
.editor-two { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.7rem; }
.editor-card label,.editor-section-card label { display:grid; gap:.35rem; color:#7f98a3; font-size:.76rem; }
.editor-card input,.editor-card textarea,.editor-card select,.editor-section-card input,.editor-section-card textarea,.editor-section-card select {
  width:100%; box-sizing:border-box;
}
.builder-source-card{border-left:3px solid rgba(125,101,66,.55)}.builder-source-card.linked{border-left-color:#7c9d72}.builder-source-state{padding:.3rem .45rem;border:1px solid rgba(255,255,255,.09);color:#7f98a3;font-size:.65rem;text-transform:uppercase;letter-spacing:.05em}.builder-source-state.ok{color:#9fbe98;border-color:rgba(112,168,121,.25)}
.builder-source-record{display:grid;gap:.6rem;padding:.75rem;border:1px solid rgba(255,255,255,.07);background:rgba(8,8,7,.22)}.builder-source-record>header{display:flex;justify-content:space-between;gap:.8rem}.builder-source-record>header>div{display:grid;gap:.15rem}.builder-source-record>header span{color:#6fb9d6;font-size:.62rem;text-transform:uppercase;letter-spacing:.07em}.builder-source-record>header strong{color:#d7e3e7}.builder-source-record>header small{color:#718a95;font-size:.67rem}.builder-source-record dl{display:grid;grid-template-columns:minmax(100px,.6fr) minmax(0,1.4fr);gap:0;margin:0}.builder-source-record dt,.builder-source-record dd{padding:.38rem .45rem;border-top:1px solid rgba(255,255,255,.05);font-size:.7rem}.builder-source-record dt{color:#667f8b}.builder-source-record dd{margin:0;color:#a7bbc3;overflow-wrap:anywhere}
.editor-media-preview { width:min(100%,520px); max-height:340px; object-fit:contain; margin-top:.2rem; border:1px solid rgba(255,255,255,.08); background:rgba(0,0,0,.2); }
.editor-upload-field{padding:.75rem;border:1px dashed rgba(78,177,200,.24);background:rgba(43,146,255,.035)}
.editor-upload-field input[type="file"]{margin-top:.45rem;padding:.5rem;background:rgba(0,0,0,.16);cursor:pointer}
.editor-upload-field small{display:block;margin-top:.35rem;color:#66838e;font-size:.68rem}
.editor-sections-head { margin-top:.3rem; }
.editor-section-card { display:grid; gap:.8rem; }
.editor-section-card > header { display:grid; grid-template-columns:minmax(0,1fr) 80px 100px auto; gap:.5rem; }
.section-title-input { font-family:Georgia,serif; font-size:1.08rem; }
.editor-blocks { display:grid; gap:.7rem; }
.editor-block { border:1px solid rgba(255,255,255,.08); padding:.65rem; background:rgba(255,255,255,.015); }
.editor-block-toolbar { display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin-bottom:.5rem; color:#91a7b1; font-size:.75rem; }
.editor-block-toolbar select { width:auto; margin-left:auto; }
.editor-block-toolbar button,.editor-section-card footer button {
  border:1px solid rgba(255,255,255,.09); background:transparent; color:#91a7b1; padding:.35rem .5rem;
}
.editor-section-card footer { display:flex; gap:.5rem; }
.danger-button { border:1px solid rgba(190,105,95,.35); color:#d59a91; background:transparent; padding:.45rem .65rem; }
.editor-preview-column { position:sticky; top:88px; max-height:calc(100vh - 110px); overflow:auto; }
.editor-preview-column h1 { margin:.6rem 0 .8rem; font:500 2.2rem/1.05 Georgia,serif; }
.editor-preview-column h2 { margin:1.4rem 0 .5rem; font:500 1.35rem/1.2 Georgia,serif; }
.editor-preview-column p { color:#afc1c8; line-height:1.65; white-space:pre-line; }
.editor-preview-column p.lore { color:#c5d4d9; }
.editor-preview-column p.list { padding-left:.8rem; border-left:2px solid rgba(43,146,255,.35); }
.editor-preview-column table { width:100%; border-collapse:collapse; margin:.7rem 0; }
.editor-preview-column td { padding:.45rem; border:1px solid rgba(255,255,255,.08); color:#a6bac2; }
.preview-figure { margin:0 0 .8rem; }
.preview-figure img { display:block; width:100%; max-height:360px; object-fit:contain; background:rgba(0,0,0,.2); }
.preview-figure figcaption { padding:.45rem 0; color:#718a95; font-size:.72rem; }
.preview-meta { display:flex; gap:.4rem; flex-wrap:wrap; }
.preview-meta span { padding:.25rem .45rem; border:1px solid rgba(255,255,255,.08); color:#7f98a3; font-size:.68rem; }
.editor-actions {
  position:fixed; left:0; right:0; bottom:0; z-index:40; display:flex; align-items:center; gap:.7rem;
  padding:.8rem max(1rem,calc((100vw - 1540px)/2)); border-top:1px solid rgba(70,126,148,.13);
  background:rgba(8,15,23,.97); box-shadow:0 -10px 35px rgba(0,0,0,.25);
}
.editor-actions .spacer { flex:1; }
.editor-hint { margin:.25rem 0; color:#718a95; font-size:.78rem; line-height:1.5; }
.talent-insert-panel{display:grid;grid-template-columns:minmax(180px,1fr) auto auto auto auto;gap:.5rem;align-items:center;padding:.7rem .8rem;border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);background:linear-gradient(90deg,rgba(43,146,255,.08),rgba(255,255,255,.012));position:relative;z-index:6;scroll-margin-block:96px}
.talent-insert-panel>div{display:grid;gap:.15rem}.talent-insert-panel strong{color:#c5d4d9;font-size:.76rem}.talent-insert-panel small{color:#718a95;font-size:.63rem}.talent-insert-panel select{min-width:130px}.talent-insert-panel button{scroll-margin-block:112px}
.wiki-toolbar button.active{border-color:#2b92ff;color:#c7eaf2;background:rgba(43,146,255,.1)}
.preview-talent-embed{display:grid;gap:.28rem;margin:.75rem 0;padding:.8rem;border:1px solid rgba(88,220,197,.2);background:linear-gradient(145deg,rgba(43,146,255,.07),rgba(255,255,255,.012))}.preview-talent-embed span{color:#6fb9d6;font-size:.58rem;letter-spacing:.08em}.preview-talent-embed strong{color:#dce8ec;font-family:Georgia,serif}.preview-talent-embed small{color:#718a95}
@media(max-width:900px){.talent-insert-panel{grid-template-columns:1fr 1fr}.talent-insert-panel>div{grid-column:1/-1}}
.wiki-source-card { padding:0; overflow:hidden; }
.wiki-toolbar {
  display:flex; gap:.4rem; flex-wrap:wrap; align-items:center;
  padding:.65rem; border-bottom:1px solid rgba(255,255,255,.08);
  background:rgba(255,255,255,.02); position:static; z-index:5;
}
.wiki-toolbar button {
  min-width:38px; padding:.42rem .58rem; border:1px solid rgba(255,255,255,.1);
  background:transparent; color:#a6bac2;
}
.wiki-toolbar button:hover { border-color:#2b92ff; color:#c7eaf2; }
.wiki-source {
  display:block; width:100%; min-height:62vh; resize:vertical; box-sizing:border-box;
  border:0; border-radius:0; padding:1.2rem; outline:none;
  background:rgba(8,8,7,.35); color:#c5d4d9;
  font:400 .98rem/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;
}
.wiki-source:focus { box-shadow:inset 0 0 0 1px rgba(43,146,255,.35); }
.syntax-help {
  display:flex; flex-wrap:wrap; gap:.75rem; padding:.7rem 1rem;
  border-top:1px solid rgba(255,255,255,.07); color:#667f8b; font-size:.7rem;
}
.syntax-help code { color:#6fb9d6; }
.editor-preview-column h3,.editor-preview-column h4 {
  font-family:Georgia,serif; font-weight:500; margin:1.1rem 0 .45rem;
}
.editor-preview-column p.callout {
  padding:.8rem; border-left:3px solid #365f73; background:rgba(54,95,115,.08);
}
.editor-preview-column .mj-preview {
  padding:.8rem; border:1px solid rgba(175,110,92,.3); background:rgba(84,43,30,.08);
}
@media (max-width:1000px) {
  .wiki-editor-grid { grid-template-columns:1fr; }
  .editor-preview-column { position:static; max-height:none; }
}
@media (max-width:680px) {
  .editor-top-actions{gap:.35rem}.editor-top-actions .ghost{padding:.4rem .5rem}
  .coverage-filters{grid-template-columns:1fr}.coverage-stats{grid-template-columns:1fr 1fr 1fr}.coverage-list article{flex-direction:column}.coverage-item-state{max-width:none;text-align:left}

  .editor-heading,.editor-card-title,.editor-sections-head { align-items:stretch; flex-direction:column; }
  .editor-two,.editor-section-card > header { grid-template-columns:1fr; }
  .editor-actions { flex-wrap:wrap; }
  .editor-actions .spacer { display:none; }
}

/* Approved V2 visual system */
.wiki-editor-shell{
  background:
    radial-gradient(circle at 85% 5%,rgba(111,67,145,.11),transparent 30rem),
    radial-gradient(circle at 10% 15%,rgba(32,96,111,.17),transparent 28rem),
    linear-gradient(180deg,#09121a,#071019);
}
.wiki-editor-topbar{
  min-height:68px;
  border-bottom-color:rgba(82,134,151,.34);
  background:rgba(8,15,23,.97);
  backdrop-filter:blur(18px);
}
.wiki-editor-page{padding:1.4rem 0 5rem}
.coverage-drawer{
  border-left-color:#294452;
  background:linear-gradient(180deg,#101b25,#081119);
}
.coverage-family-track span{background:linear-gradient(90deg,#58dcc5,#2b92ff 58%,#a67ce6)}
.editor-card,.editor-section-card,.editor-preview-card{
  border-color:#203f4d;
  background:linear-gradient(145deg,rgba(13,25,34,.97),rgba(8,17,24,.95));
}

</style>
