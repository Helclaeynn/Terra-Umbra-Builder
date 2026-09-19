<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { api, ApiError } from "../lib/api";

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
      compendium_source_changed: "Le corpus source a changé. Recharge la page avant de republier."
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

async function load() {
  loading.value = true;
  error.value = "";
  try {
    if (isNew.value) {
      article.value = {
        id: "",
        title: "",
        category: "Réalité",
        source: "",
        status: "canon_enrichi",
        tags: [],
        sections: []
      };
      pageId.value = "";
      fillForms(article.value);
      return;
    }

    const payload = await api<{
      article: EditableArticle;
      draft: EditableArticle | null;
      conflict: boolean;
      draftUpdatedAt: string | null;
      publishedAt: string | null;
    }>(`/api/compendium/editor/articles/${encodeURIComponent(pageId.value)}`);

    pageId.value = id.value;
    article.value = clone(payload.draft ?? payload.article);
    conflict.value = payload.conflict;
    draftUpdatedAt.value = payload.draftUpdatedAt;
    publishedAt.value = payload.publishedAt;
    fillForms(article.value);
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
      <RouterLink class="brand" to="/">
        <span class="brand-mark">TU</span>
        <span><strong>Terra Umbra</strong><small>Éditeur du Compendium</small></span>
      </RouterLink>
      <button class="ghost" type="button" @click="backToArticle">← Retour à l’article</button>
    </header>

    <main class="wiki-editor-page">
      <div v-if="loading" class="panel editor-loading">Chargement de l’éditeur…</div>
      <div v-else-if="error && !article" class="feedback error">{{ error }}</div>

      <template v-else-if="article">
        <header class="editor-heading">
          <div>
            <p class="eyebrow">ÉDITION WIKI</p>
            <h1>{{ article.title }}</h1>
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
              <label>Titre<input v-model="article.title" maxlength="240" /></label>
              <div class="editor-two">
                <label>Statut<input v-model="article.status" placeholder="canon_recent…" /></label>
                <label>Rubrique<input :value="article.category" disabled /></label>
              </div>
              <label>Source<input v-model="article.source" /></label>
              <label>Tags<textarea v-model="tagsText" rows="2" placeholder="Vérité, Garous, Californie…" /></label>
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
              <label>Chemin ou URL
                <input v-model="mediaSrc" placeholder="images/manual/… ou https://…" />
              </label>
              <label>Légende<input v-model="mediaCaption" /></label>
              <img v-if="previewMedia" class="editor-media-preview" :src="previewMedia" :alt="mediaAlt || article.title" />
            </div>

            <div v-if="article.pnj" class="panel editor-card">
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
              <label>Portrait<input v-model="pnjForm.portrait" placeholder="images/… ou URL" /></label>
              <div class="editor-two">
                <label>Alt portrait<input v-model="pnjForm.portraitAlt" /></label>
                <label>Légende portrait<input v-model="pnjForm.portraitCaption" /></label>
              </div>
            </div>

            <div class="editor-sections-head">
              <div><p class="eyebrow">CONTENU</p><h2>Sections</h2></div>
              <button class="secondary" type="button" @click="addSection">+ Section</button>
            </div>

            <article
              v-for="(section, sectionIndex) in article.sections || []"
              :key="section.id || sectionIndex"
              class="panel editor-section-card"
            >
              <header>
                <input v-model="section.title" class="section-title-input" placeholder="Titre de section" />
                <select v-model.number="section.level">
                  <option :value="2">H2</option>
                  <option :value="3">H3</option>
                  <option :value="4">H4</option>
                </select>
                <select v-model="section.audience">
                  <option value="">Public</option>
                  <option value="mj">MJ</option>
                </select>
                <button class="danger-button" type="button" @click="removeSection(sectionIndex)">Supprimer</button>
              </header>

              <div class="editor-blocks">
                <div v-for="(block, blockIndex) in section.blocks" :key="blockIndex" class="editor-block">
                  <div class="editor-block-toolbar">
                    <strong>{{ block.type === "table" ? "Tableau" : "Paragraphe" }}</strong>
                    <select v-if="block.type === 'p'" v-model="block.style">
                      <option value="">Normal</option>
                      <option value="lore">Lore</option>
                      <option value="list">Liste / retrait</option>
                      <option value="callout">Encadré</option>
                    </select>
                    <button type="button" @click="removeBlock(section, blockIndex)">×</button>
                  </div>

                  <textarea
                    v-if="block.type === 'p'"
                    v-model="block.text"
                    rows="7"
                    placeholder="Texte de la page…"
                  />
                  <textarea
                    v-else
                    :value="tableText(block)"
                    rows="6"
                    placeholder="Colonnes séparées par des tabulations"
                    @input="setTableEvent(block, $event)"
                  />
                </div>
              </div>

              <footer>
                <button type="button" @click="addParagraph(section)">+ Paragraphe</button>
                <button type="button" @click="addTable(section)">+ Tableau</button>
              </footer>
            </article>
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

            <section v-for="(section, index) in article.sections || []" :key="section.id || index">
              <h2 v-if="section.title">{{ section.title }}</h2>
              <template v-for="(block, blockIndex) in section.blocks" :key="blockIndex">
                <p v-if="block.type === 'p'" :class="block.style">{{ block.text }}</p>
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
          <button class="primary" type="button" :disabled="busy || conflict" @click="publish">
            Publier dans le wiki
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.wiki-editor-shell { min-height: 100vh; }
.wiki-editor-topbar {
  min-height: 72px; display:flex; align-items:center; justify-content:space-between; gap:1rem;
  padding:0 clamp(1rem,4vw,3rem); position:sticky; top:0; z-index:30;
  border-bottom:1px solid rgba(226,206,164,.13); background:rgba(13,12,10,.97);
}
.wiki-editor-page { width:min(1540px,calc(100% - 2rem)); margin:0 auto; padding:2rem 0 7rem; }
.editor-loading { padding:2rem; }
.editor-heading { display:flex; justify-content:space-between; gap:2rem; align-items:end; margin-bottom:1.2rem; }
.editor-heading h1 { margin:.2rem 0 .5rem; font:500 clamp(2rem,4vw,3.8rem)/1.04 Georgia,serif; }
.editor-heading p:not(.eyebrow) { margin:0; max-width:72ch; color:#999287; }
.editor-state { display:flex; gap:.45rem; flex-wrap:wrap; justify-content:flex-end; }
.editor-state span { padding:.35rem .55rem; border:1px solid rgba(255,255,255,.1); color:#9f988d; font-size:.72rem; }
.editor-state .danger { color:#d7a39b; border-color:rgba(215,163,155,.35); }
.wiki-editor-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(330px,.65fr); gap:1rem; align-items:start; }
.editor-form-column { display:grid; gap:1rem; }
.editor-card,.editor-section-card,.editor-preview-column { padding:1rem; }
.editor-card { display:grid; gap:.8rem; }
.editor-card-title,.editor-sections-head { display:flex; justify-content:space-between; align-items:end; gap:1rem; }
.editor-card h2,.editor-sections-head h2 { margin:.15rem 0 0; font:500 1.45rem/1.2 Georgia,serif; }
.editor-two { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.7rem; }
.editor-card label,.editor-section-card label { display:grid; gap:.35rem; color:#918a80; font-size:.76rem; }
.editor-card input,.editor-card textarea,.editor-card select,.editor-section-card input,.editor-section-card textarea,.editor-section-card select {
  width:100%; box-sizing:border-box;
}
.editor-media-preview { width:min(100%,520px); max-height:340px; object-fit:contain; margin-top:.2rem; border:1px solid rgba(255,255,255,.08); background:rgba(0,0,0,.2); }
.editor-sections-head { margin-top:.3rem; }
.editor-section-card { display:grid; gap:.8rem; }
.editor-section-card > header { display:grid; grid-template-columns:minmax(0,1fr) 80px 100px auto; gap:.5rem; }
.section-title-input { font-family:Georgia,serif; font-size:1.08rem; }
.editor-blocks { display:grid; gap:.7rem; }
.editor-block { border:1px solid rgba(255,255,255,.08); padding:.65rem; background:rgba(255,255,255,.015); }
.editor-block-toolbar { display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin-bottom:.5rem; color:#9c9488; font-size:.75rem; }
.editor-block-toolbar select { width:auto; margin-left:auto; }
.editor-block-toolbar button,.editor-section-card footer button {
  border:1px solid rgba(255,255,255,.09); background:transparent; color:#9d968b; padding:.35rem .5rem;
}
.editor-section-card footer { display:flex; gap:.5rem; }
.danger-button { border:1px solid rgba(190,105,95,.35); color:#d59a91; background:transparent; padding:.45rem .65rem; }
.editor-preview-column { position:sticky; top:88px; max-height:calc(100vh - 110px); overflow:auto; }
.editor-preview-column h1 { margin:.6rem 0 .8rem; font:500 2.2rem/1.05 Georgia,serif; }
.editor-preview-column h2 { margin:1.4rem 0 .5rem; font:500 1.35rem/1.2 Georgia,serif; }
.editor-preview-column p { color:#bbb3a7; line-height:1.65; white-space:pre-line; }
.editor-preview-column p.lore { color:#cfc3ad; }
.editor-preview-column p.list { padding-left:.8rem; border-left:2px solid rgba(157,124,72,.35); }
.editor-preview-column table { width:100%; border-collapse:collapse; margin:.7rem 0; }
.editor-preview-column td { padding:.45rem; border:1px solid rgba(255,255,255,.08); color:#aaa296; }
.preview-figure { margin:0 0 .8rem; }
.preview-figure img { display:block; width:100%; max-height:360px; object-fit:contain; background:rgba(0,0,0,.2); }
.preview-figure figcaption { padding:.45rem 0; color:#827b72; font-size:.72rem; }
.preview-meta { display:flex; gap:.4rem; flex-wrap:wrap; }
.preview-meta span { padding:.25rem .45rem; border:1px solid rgba(255,255,255,.08); color:#918a80; font-size:.68rem; }
.editor-actions {
  position:fixed; left:0; right:0; bottom:0; z-index:40; display:flex; align-items:center; gap:.7rem;
  padding:.8rem max(1rem,calc((100vw - 1540px)/2)); border-top:1px solid rgba(226,206,164,.13);
  background:rgba(13,12,10,.97); box-shadow:0 -10px 35px rgba(0,0,0,.25);
}
.editor-actions .spacer { flex:1; }
@media (max-width:1000px) {
  .wiki-editor-grid { grid-template-columns:1fr; }
  .editor-preview-column { position:static; max-height:none; }
}
@media (max-width:680px) {
  .editor-heading,.editor-card-title,.editor-sections-head { align-items:stretch; flex-direction:column; }
  .editor-two,.editor-section-card > header { grid-template-columns:1fr; }
  .editor-actions { flex-wrap:wrap; }
  .editor-actions .spacer { display:none; }
}
</style>
