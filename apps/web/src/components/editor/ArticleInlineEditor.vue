<script setup lang="ts">
// Édition d'une page du compendium directement sur la page, sans codes à
// taper : sections avec leur visibilité, texte mis en forme par boutons,
// tags en pastilles, brouillon, publication et historique.
// L'ancien éditeur reste accessible (« Éditeur complet ») pour la fiche de
// PNJ, le portrait et les blocs de Talents.
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { RouterLink } from "vue-router";
import type { Editor } from "@tiptap/vue-3";
import { api, ApiError } from "../../lib/api";
import type { ArticleBlock } from "../../lib/article-rich-text";
import SectionRichEditor from "./SectionRichEditor.vue";
import TagChips from "./TagChips.vue";

type Section = { key: number; title: string; level: number; audience: string; blocks: ArticleBlock[]; extra: Record<string, unknown> };
type EditorArticle = Record<string, any> & { id: string };
type Revision = { version: number; createdAt: string; author: string | null; comment: string | null };
type BuilderSource = { key: string; kind: string; label: string; mechanics: Record<string, unknown> };

const props = defineProps<{ articleId: string; builderSources?: BuilderSource[] }>();
const emit = defineEmits<{ (event: "close"): void; (event: "published"): void }>();

const CATEGORIES = ["Règles", "Réalité", "Vérité", "Personnages", "Équipement & Objets", "Bestiaire"];
const STATUSES = [
  { id: "canon_enrichi", label: "Canon enrichi" },
  { id: "canon_source", label: "Canon issu de la source" },
  { id: "canon_recent", label: "Canon récent" }
];

const loading = ref(true);
const busy = ref(false);
const error = ref("");
const notice = ref("");
const conflict = ref(false);
const hasDraft = ref(false);
const draftDate = ref<string | null>(null);

const base = ref<EditorArticle | null>(null);
const title = ref("");
const category = ref("");
const audience = ref("");
const editorialStatus = ref("");
const source = ref("");
const tags = ref<string[]>([]);
const truthTags = ref<string[]>([]);
const secretTags = ref<string[]>([]);
const sections = ref<Section[]>([]);
let nextKey = 1;
let baseline = "";

const activeEditor = shallowRef<Editor | null>(null);
const toolbarTick = ref(0);
const imageInput = ref<HTMLInputElement | null>(null);
const linkOpen = ref(false);
const linkQuery = ref("");
const linkResults = ref<Array<{ id: string; title: string; category: string }>>([]);
const linkBusy = ref(false);
const historyOpen = ref(false);
const revisions = ref<Revision[]>([]);

const ERRORS: Record<string, string> = {
  compendium_source_changed: "La page a été modifiée ailleurs depuis ce brouillon. Recharge-la avant de publier.",
  compendium_draft_required: "Rien à publier : enregistre d'abord le brouillon.",
  invalid_compendium_article: "La page contient une donnée refusée (titre vide ou trop long, tag trop long…).",
  invalid_compendium_article_title: "Donne un titre à la page.",
  editor_required: "Ton compte n'a pas le droit de modifier les pages.",
  compendium_image_too_large: "Image trop lourde (15 Mo au plus).",
  unsupported_compendium_image: "Format d'image non pris en charge (PNG, JPEG ou WebP)."
};
function humanError(cause: unknown): string {
  if (cause instanceof ApiError) return ERRORS[cause.message] ?? `Erreur du serveur (${cause.message}).`;
  return "Une erreur est survenue.";
}

function toSections(list: any[] = []): Section[] {
  return list.map((section) => {
    const { title: sectionTitle, level, audience: sectionAudience, blocks, ...extra } = section ?? {};
    return {
      key: nextKey++,
      title: String(sectionTitle ?? ""),
      level: Number(level ?? 2),
      audience: sectionAudience === "mj" || sectionAudience === "verite" ? sectionAudience : "",
      blocks: Array.isArray(blocks) ? blocks : [],
      extra
    };
  });
}

function fill(article: EditorArticle) {
  title.value = String(article.title ?? "");
  category.value = String(article.category ?? "");
  audience.value = article.audience === "mj" || article.audience === "verite" ? article.audience : "";
  editorialStatus.value = String(article.status ?? "");
  source.value = String(article.source ?? "");
  tags.value = [...(article.tags ?? [])];
  truthTags.value = [...(article.truthTags ?? [])];
  secretTags.value = [...(article.secretTags ?? [])];
  sections.value = toSections(article.sections);
}

function sectionId(section: Section, index: number, used: Set<string>): string {
  const existing = typeof section.extra.id === "string" ? section.extra.id : "";
  let id = existing || (section.title
    ? section.title.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)
    : `section-${index + 1}`) || `section-${index + 1}`;
  while (used.has(id)) id = `${id}-${index + 1}`;
  used.add(id);
  return id;
}

const current = computed<EditorArticle | null>(() => {
  if (!base.value) return null;
  const used = new Set<string>();
  return {
    ...base.value,
    title: title.value.trim(),
    category: category.value,
    audience: audience.value,
    status: editorialStatus.value || undefined,
    source: source.value.trim() || undefined,
    tags: tags.value,
    truthTags: truthTags.value,
    secretTags: secretTags.value,
    sections: sections.value.map((section, index) => ({
      ...section.extra,
      id: sectionId(section, index, used),
      title: section.title.trim() || undefined,
      level: section.level,
      ...(section.audience ? { audience: section.audience } : {}),
      blocks: section.blocks
    }))
  };
});
const dirty = computed(() => Boolean(current.value) && JSON.stringify(current.value) !== baseline);

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const payload = await api<{ article: EditorArticle; draft: EditorArticle | null; draftUpdatedAt: string | null; conflict: boolean }>(
      `/api/compendium/editor/articles/${encodeURIComponent(props.articleId)}`
    );
    base.value = payload.article;
    hasDraft.value = Boolean(payload.draft);
    draftDate.value = payload.draftUpdatedAt;
    conflict.value = payload.conflict;
    fill(payload.draft ?? payload.article);
    baseline = JSON.stringify(current.value);
    if (payload.draft) notice.value = "Un brouillon non publié a été repris.";
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    loading.value = false;
  }
}

async function saveDraft(silent = false): Promise<boolean> {
  if (!current.value) return false;
  if (!current.value.title) { error.value = "Donne un titre à la page."; return false; }
  busy.value = true;
  error.value = "";
  try {
    await api(`/api/compendium/editor/articles/${encodeURIComponent(props.articleId)}/draft`, {
      method: "PUT", body: JSON.stringify({ article: current.value })
    });
    baseline = JSON.stringify(current.value);
    hasDraft.value = true;
    conflict.value = false;
    if (!silent) notice.value = "Brouillon enregistré. Il n'est visible que des éditeurs jusqu'à la publication.";
    return true;
  } catch (cause) {
    error.value = humanError(cause);
    return false;
  } finally {
    busy.value = false;
  }
}

async function publish() {
  if (!(await saveDraft(true))) return;
  busy.value = true;
  try {
    await api(`/api/compendium/editor/articles/${encodeURIComponent(props.articleId)}/publish`, { method: "POST", body: "{}" });
    hasDraft.value = false;
    emit("published");
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    busy.value = false;
  }
}

async function discardDraft() {
  if (!window.confirm("Abandonner le brouillon et revenir à la version publiée ?")) return;
  busy.value = true;
  try {
    await api(`/api/compendium/editor/articles/${encodeURIComponent(props.articleId)}/draft`, { method: "DELETE" });
    notice.value = "Brouillon abandonné.";
    await load();
    notice.value = "Brouillon abandonné.";
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    busy.value = false;
  }
}

function close() {
  if (dirty.value && !window.confirm("Quitter sans enregistrer tes modifications ?")) return;
  emit("close");
}

async function openHistory() {
  historyOpen.value = !historyOpen.value;
  if (!historyOpen.value) return;
  try {
    revisions.value = (await api<{ revisions: Revision[] }>(
      `/api/compendium/editor/articles/${encodeURIComponent(props.articleId)}/revisions`
    )).revisions;
  } catch (cause) {
    error.value = humanError(cause);
  }
}

async function loadRevision(revision: Revision) {
  if (dirty.value && !window.confirm("Remplacer tes modifications en cours par cette version ?")) return;
  try {
    const { article } = await api<{ article: EditorArticle }>(
      `/api/compendium/editor/articles/${encodeURIComponent(props.articleId)}/revisions/${revision.version}`
    );
    fill({ ...base.value, ...article, id: props.articleId });
    historyOpen.value = false;
    notice.value = `Version ${revision.version} chargée. Publie pour la rétablir, ou ferme sans enregistrer.`;
  } catch (cause) {
    error.value = humanError(cause);
  }
}

// ------------------------------------------------------------------ sections

function addSection(index: number) {
  sections.value.splice(index, 0, { key: nextKey++, title: "", level: 2, audience: "", blocks: [], extra: {} });
}
function moveSection(index: number, delta: number) {
  const target = index + delta;
  if (target < 0 || target >= sections.value.length) return;
  const list = sections.value;
  [list[index], list[target]] = [list[target], list[index]];
}
function removeSection(index: number) {
  const section = sections.value[index];
  const label = section.title ? `la section « ${section.title} »` : "cette section";
  if (window.confirm(`Supprimer ${label} ? (Tu pourras la retrouver dans l'historique une fois publié.)`)) sections.value.splice(index, 1);
}

// ------------------------------------------------------------------ barre d'outils

let detachTick: (() => void) | null = null;
function onFocus(editor: Editor) {
  if (activeEditor.value === editor) return;
  detachTick?.();
  activeEditor.value = editor;
  const tick = () => { toolbarTick.value++; };
  editor.on("transaction", tick);
  detachTick = () => editor.off("transaction", tick);
  toolbarTick.value++;
}
onBeforeUnmount(() => detachTick?.());

function isActive(name: string, attrs?: Record<string, unknown>): boolean {
  void toolbarTick.value;
  return Boolean(activeEditor.value?.isActive(name, attrs));
}
function chain() {
  return activeEditor.value?.chain().focus();
}
function toggleStyle(style: string) {
  const editor = activeEditor.value;
  if (!editor) return;
  const currentStyle = editor.getAttributes("paragraph").blockStyle;
  editor.chain().focus().updateAttributes("paragraph", { blockStyle: currentStyle === style ? null : style }).run();
}
const imageCaption = computed({
  get: () => { void toolbarTick.value; return String(activeEditor.value?.getAttributes("image").title ?? ""); },
  set: (value: string) => { activeEditor.value?.chain().updateAttributes("image", { title: value }).run(); }
});
const imageAlt = computed({
  get: () => { void toolbarTick.value; return String(activeEditor.value?.getAttributes("image").alt ?? ""); },
  set: (value: string) => { activeEditor.value?.chain().updateAttributes("image", { alt: value }).run(); }
});

async function uploadImage(file: File): Promise<string> {
  if (file.size > 15 * 1024 * 1024) throw new Error("too_large");
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result ?? "").split(",")[1] ?? "");
    reader.readAsDataURL(file);
  });
  const result = await api<{ src: string }>(`/api/compendium/editor/articles/${encodeURIComponent(props.articleId)}/media`, {
    method: "POST", body: JSON.stringify({ data, slot: "page" })
  });
  return result.src;
}
function pickImage() {
  if (!activeEditor.value) { error.value = "Clique d'abord dans le texte d'une section."; return; }
  imageInput.value?.click();
}
async function onImagePicked(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = [...(input.files ?? [])];
  input.value = "";
  const editor = activeEditor.value;
  if (!editor || !files.length) return;
  for (const file of files) {
    try {
      const src = await uploadImage(file);
      editor.chain().focus().insertContent({ type: "image", attrs: { src, alt: file.name.replace(/\.[^.]+$/, ""), title: "" } }).run();
    } catch (cause) {
      error.value = cause instanceof ApiError ? humanError(cause) : `L'image « ${file.name} » n'a pas pu être envoyée.`;
    }
  }
}

let linkRequest = 0;
async function searchLinks() {
  const query = linkQuery.value.trim();
  if (query.length < 2) { linkResults.value = []; return; }
  const request = ++linkRequest;
  linkBusy.value = true;
  try {
    const result = await api<{ items: Array<{ id: string; title: string; category: string }> }>(
      `/api/compendium/search?q=${encodeURIComponent(query)}&limit=12`
    );
    if (request === linkRequest) linkResults.value = result.items;
  } finally {
    if (request === linkRequest) linkBusy.value = false;
  }
}
function openLink() {
  const editor = activeEditor.value;
  if (!editor) { error.value = "Clique d'abord dans le texte d'une section."; return; }
  const { from, to } = editor.state.selection;
  linkQuery.value = editor.state.doc.textBetween(from, to, " ").slice(0, 80);
  linkResults.value = [];
  linkOpen.value = true;
  void searchLinks();
}
function chooseLink(item: { id: string; title: string }) {
  const editor = activeEditor.value;
  if (!editor) return;
  const href = `/compendium?article=${encodeURIComponent(item.id)}`;
  if (editor.state.selection.empty) {
    editor.chain().focus().insertContent({ type: "text", text: item.title, marks: [{ type: "link", attrs: { href } }] }).run();
  } else {
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }
  linkOpen.value = false;
}

function mechanicsText(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return Array.isArray(value) ? value.join(", ") : JSON.stringify(value);
  return String(value);
}

function beforeUnload(event: BeforeUnloadEvent) {
  if (dirty.value) event.preventDefault();
}
onMounted(() => { void load(); window.addEventListener("beforeunload", beforeUnload); });
onBeforeUnmount(() => window.removeEventListener("beforeunload", beforeUnload));
</script>

<template>
  <div class="inline-editor">
    <div class="ie-sticky">
      <div class="ie-bar" role="toolbar" aria-label="Édition de la page">
        <strong class="ie-mode">✎ Modification</strong>
        <span v-if="dirty" class="ie-state">Non enregistré</span>
        <span v-else-if="hasDraft" class="ie-state">Brouillon non publié</span>
        <span class="ie-spacer"></span>
        <button type="button" class="ghost" :disabled="busy" @click="openHistory">Historique</button>
        <button v-if="hasDraft" type="button" class="ghost" :disabled="busy" @click="discardDraft">Abandonner le brouillon</button>
        <button type="button" class="secondary" :disabled="busy || loading" @click="saveDraft()">Enregistrer le brouillon</button>
        <button type="button" class="primary" :disabled="busy || loading" @click="publish">Publier</button>
        <button type="button" class="ghost" :disabled="busy" @click="close">Fermer</button>
      </div>
      <template v-if="base && !loading">
        <div class="ie-toolbar" role="toolbar" aria-label="Mise en forme du texte">
          <button type="button" title="Gras" :class="{ on: isActive('bold') }" @click="chain()?.toggleBold().run()"><b>G</b></button>
          <button type="button" title="Italique" :class="{ on: isActive('italic') }" @click="chain()?.toggleItalic().run()"><i>I</i></button>
          <button type="button" title="Liste à puces" :class="{ on: isActive('bulletList') }" @click="chain()?.toggleBulletList().run()">• Liste</button>
          <button type="button" title="Texte d'ambiance (lore)" :class="{ on: isActive('paragraph', { blockStyle: 'lore' }) }" @click="toggleStyle('lore')">Lore</button>
          <button type="button" title="Encadré" :class="{ on: isActive('paragraph', { blockStyle: 'callout' }) }" @click="toggleStyle('callout')">Encadré</button>
          <button type="button" title="Lien vers une autre page" :class="{ on: isActive('link') }" @click="openLink">Lien</button>
          <button v-if="isActive('link')" type="button" title="Retirer le lien" @click="chain()?.extendMarkRange('link').unsetLink().run()">Retirer le lien</button>
          <button type="button" title="Insérer une image (ou glisse-la dans le texte)" @click="pickImage">Image</button>
          <button type="button" title="Insérer un tableau" @click="chain()?.insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()">Tableau</button>
          <template v-if="isActive('table')">
            <button type="button" @click="chain()?.addRowAfter().run()">+ ligne</button>
            <button type="button" @click="chain()?.addColumnAfter().run()">+ colonne</button>
            <button type="button" @click="chain()?.deleteRow().run()">− ligne</button>
            <button type="button" @click="chain()?.deleteColumn().run()">− colonne</button>
            <button type="button" @click="chain()?.deleteTable().run()">Supprimer le tableau</button>
          </template>
          <span class="ie-spacer"></span>
          <button type="button" title="Annuler" @click="chain()?.undo().run()">↶</button>
          <button type="button" title="Rétablir" @click="chain()?.redo().run()">↷</button>
          <input ref="imageInput" type="file" accept="image/png,image/jpeg,image/webp" multiple hidden @change="onImagePicked" />
        </div>
        <div v-if="isActive('image')" class="ie-image-props">
          <label>Légende<input v-model="imageCaption" /></label>
          <label>Description (pour l'accessibilité)<input v-model="imageAlt" /></label>
        </div>
        <div v-if="linkOpen" class="ie-link">
          <label>Page à relier<input v-model="linkQuery" placeholder="Nom de la page" @input="searchLinks" @keydown.esc="linkOpen = false" /></label>
          <ul>
            <li v-for="item in linkResults" :key="item.id"><button type="button" @click="chooseLink(item)">{{ item.title }} <small>{{ item.category }}</small></button></li>
          </ul>
          <p v-if="!linkBusy && linkQuery.trim().length >= 2 && !linkResults.length">Aucune page trouvée.</p>
          <button type="button" class="ghost compact" @click="linkOpen = false">Fermer</button>
        </div>
      </template>
    </div>

    <p v-if="error" class="ie-feedback error" role="alert">{{ error }}</p>
    <p v-else-if="notice" class="ie-feedback" role="status">{{ notice }}</p>
    <p v-if="conflict" class="ie-feedback error">La page a changé depuis ce brouillon : vérifie le texte avant de publier.</p>

    <div v-if="historyOpen" class="ie-history">
      <p v-if="!revisions.length">Aucune version publiée depuis l'éditeur pour l'instant. L'historique commence à la première publication.</p>
      <ul v-else>
        <li v-for="revision in revisions" :key="revision.version">
          <span>Version {{ revision.version }} · {{ new Date(revision.createdAt).toLocaleString("fr-FR") }}<template v-if="revision.author"> · {{ revision.author }}</template><template v-if="revision.comment"> · {{ revision.comment }}</template></span>
          <button type="button" class="ghost compact" @click="loadRevision(revision)">Charger</button>
        </li>
      </ul>
    </div>

    <p v-if="loading" class="ie-loading">Chargement de la page…</p>
    <template v-else-if="base">
      <input v-model="title" class="ie-title" maxlength="240" placeholder="Titre de la page" aria-label="Titre de la page" />

      <div class="ie-settings">
        <label>Visibilité
          <select v-model="audience">
            <option value="">Public : tout le monde</option>
            <option value="verite">Vérité : joueurs qui la connaissent et MJ</option>
            <option value="mj">MJ : meneurs seulement</option>
          </select>
        </label>
        <label>Rubrique
          <select v-model="category">
            <option v-if="category && !CATEGORIES.includes(category)" :value="category">{{ category }}</option>
            <option v-for="item in CATEGORIES" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
        <details class="ie-more">
          <summary>Plus d'options</summary>
          <label>Statut éditorial
            <select v-model="editorialStatus">
              <option value="">—</option>
              <option v-if="editorialStatus && !STATUSES.some(item => item.id === editorialStatus)" :value="editorialStatus">{{ editorialStatus }}</option>
              <option v-for="item in STATUSES" :key="item.id" :value="item.id">{{ item.label }}</option>
            </select>
          </label>
          <label>Source<input v-model="source" /></label>
          <RouterLink :to="`/compendium/edit/${encodeURIComponent(articleId)}`" class="ie-full-link">Éditeur complet (fiche de PNJ, portrait, blocs de Talents) ↗</RouterLink>
        </details>
      </div>

      <div class="ie-tags">
        <TagChips v-model="tags" label="Public" tone="public" hint="Vus de tous" />
        <TagChips v-model="truthTags" label="Vérité" tone="verite" hint="Vus des joueurs qui connaissent la Vérité et des MJ" />
        <TagChips v-model="secretTags" label="MJ" tone="mj" hint="Vus des MJ seulement" />
      </div>




      <button type="button" class="ie-add" @click="addSection(0)">+ Ajouter une section ici</button>
      <template v-for="(section, index) in sections" :key="section.key">
        <section class="ie-section" :class="section.audience && `ie-${section.audience}`">
          <header class="ie-section-head">
            <input v-model="section.title" class="ie-section-title" :class="`level-${section.level}`" placeholder="Titre de section (facultatif)" :aria-label="`Titre de la section ${index + 1}`" />
            <select v-model.number="section.level" :aria-label="`Niveau du titre de la section ${index + 1}`">
              <option :value="2">Titre</option>
              <option :value="3">Sous-titre</option>
              <option :value="4">Petit titre</option>
            </select>
            <select v-model="section.audience" :aria-label="`Visibilité de la section ${index + 1}`">
              <option value="">Public</option>
              <option value="verite">Vérité</option>
              <option value="mj">MJ</option>
            </select>
            <button type="button" class="ghost compact" title="Monter" :disabled="index === 0" @click="moveSection(index, -1)">↑</button>
            <button type="button" class="ghost compact" title="Descendre" :disabled="index === sections.length - 1" @click="moveSection(index, 1)">↓</button>
            <button type="button" class="ghost compact danger" title="Supprimer la section" @click="removeSection(index)">✕</button>
          </header>
          <SectionRichEditor
            v-model="section.blocks"
            :upload-image="uploadImage"
            @focus="onFocus"
            @error="(message: string) => { error = message; }"
          />
        </section>
        <button type="button" class="ie-add" @click="addSection(index + 1)">+ Ajouter une section ici</button>
      </template>

      <section v-if="builderSources?.length" class="ie-builder">
        <p class="eyebrow">VALEURS DE JEU</p>
        <p>Elles viennent du Builder et s'affichent automatiquement sur la page ; elles ne se modifient pas ici.</p>
        <article v-for="item in builderSources" :key="item.key">
          <strong>{{ item.label }}</strong> <small>{{ item.kind }}</small>
          <dl>
            <template v-for="(value, key) in item.mechanics" :key="key">
              <dt>{{ key }}</dt><dd>{{ mechanicsText(value) }}</dd>
            </template>
          </dl>
        </article>
      </section>
    </template>
  </div>
</template>

<style scoped>
.inline-editor { display: grid; gap: 14px; padding-bottom: 80px; }
.ie-sticky { position: sticky; top: 0; z-index: 20; display: grid; gap: 6px; }
.ie-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 10px 12px; background: #0a1520f2; border: 1px solid #263f54; border-radius: 8px; backdrop-filter: blur(6px); }
.ie-mode { color: #64def5; }
.ie-bar button { min-height: 34px; padding: 4px 12px; }
.ie-state { font-size: 13px; color: #f0c674; }
.ie-spacer { flex: 1; }
.ie-feedback { margin: 0; padding: 8px 12px; border-radius: 6px; background: #12324a; color: #cfe3f5; }
.ie-feedback.error { background: #3a1820; color: #ffc7d0; }
.ie-loading { color: #8ea6bd; }
.ie-title { font-size: 30px; font-weight: 700; background: transparent; border: 0; border-bottom: 1px dashed #314d63; color: #eef5fc; padding: 6px 2px; width: 100%; }
.ie-title:focus { outline: none; border-bottom-color: #64def5; }
.ie-settings { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; }
.ie-settings label, .ie-more label { display: grid; gap: 4px; font-size: 13px; color: #8ea6bd; }
.ie-more { flex-basis: 100%; }
.ie-more summary { cursor: pointer; color: #8ea6bd; font-size: 13px; }
.ie-more[open] { display: grid; gap: 8px; padding: 8px 0; }
.ie-full-link { font-size: 13px; color: #8fd3ff; }
.ie-tags { display: grid; gap: 6px; }
.ie-toolbar { display: flex; flex-wrap: wrap; gap: 4px; padding: 6px; background: #0d1b29f2; border: 1px solid #263f54; border-radius: 8px; }
.ie-toolbar button { min-height: 32px; padding: 4px 10px; background: #13283a; color: #cfe3f5; border: 1px solid #263f54; border-radius: 5px; cursor: pointer; }
.ie-toolbar button.on { background: #1f4a66; border-color: #64def5; }
.ie-image-props, .ie-link { display: grid; gap: 8px; padding: 10px; border: 1px solid #263f54; border-radius: 8px; background: #0b1724; }
.ie-image-props label, .ie-link label { display: grid; gap: 4px; font-size: 13px; color: #8ea6bd; }
.ie-link ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; max-height: 200px; overflow: auto; }
.ie-link li button { width: 100%; text-align: left; background: #13283a; color: #dce7f5; border: 1px solid #263f54; border-radius: 5px; padding: 6px 10px; cursor: pointer; }
.ie-link small { color: #8ea6bd; margin-left: 6px; }
.ie-history { padding: 10px; border: 1px solid #263f54; border-radius: 8px; background: #0b1724; }
.ie-history ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.ie-history li { display: flex; justify-content: space-between; gap: 8px; align-items: center; color: #cfe3f5; font-size: 14px; }
.ie-section { border: 1px solid #1f3446; border-radius: 8px; padding: 8px; background: #0a1520; }
.ie-section.ie-verite { border-color: #2f6b5e; background: #0f2119; }
.ie-section.ie-mj { border-color: #615078; background: #17152a; }
.ie-section-head { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.ie-section-head select, .ie-section-head button { width: auto; flex: 0 0 auto; min-height: 32px; padding: 4px 8px; }
.ie-settings select { width: auto; min-width: 200px; }
.ie-section-title { flex: 1 1 220px; background: transparent; border: 0; border-bottom: 1px dashed #263f54; color: #eef5fc; font-weight: 700; padding: 4px 2px; }
.ie-section-title.level-2 { font-size: 22px; }
.ie-section-title.level-3 { font-size: 19px; }
.ie-section-title.level-4 { font-size: 17px; }
.ie-section-title:focus { outline: none; border-bottom-color: #64def5; }
.ie-add { justify-self: center; background: transparent; border: 1px dashed #263f54; color: #8ea6bd; border-radius: 999px; padding: 2px 14px; font-size: 13px; cursor: pointer; opacity: 0.6; }
.ie-add:hover, .ie-add:focus { opacity: 1; color: #64def5; border-color: #64def5; }
.ie-builder { border: 1px solid #263f54; border-radius: 8px; padding: 12px; background: #0b1724; color: #cfe3f5; }
.ie-builder dl { display: grid; grid-template-columns: max-content 1fr; gap: 2px 12px; font-size: 13px; }
.ie-builder dt { color: #8ea6bd; }
@media (max-width: 640px) {
  .ie-title { font-size: 24px; }
}
</style>
