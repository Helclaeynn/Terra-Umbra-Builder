// Éditeur du corps des articles (champ content_entry.body) pour Directus.
// Écrit à la main, sans étape de construction : Directus fournit « vue ».
//
// Le corps est le bloc de sections du compendium :
//   { ...réglages, sections: [{ id, level, title, audience?, blocks: [...] }] }
// Blocs connus : paragraphe { type: "p", text, style? }, tableau { type: "table", rows },
// image { type: "image", src, alt, caption }. Tout le reste est montré en JSON.
//
// Règle : rien ne se perd. L'éditeur ne modifie que la propriété touchée ;
// les clés qu'il ne connaît pas restent telles quelles, une valeur inconnue
// reste choisie dans les listes, et un corps sans sections s'édite en JSON.
import { h, inject, ref, watch } from "vue";

const STYLES = [
  ["", "Paragraphe"], ["lore", "Texte d'ambiance"], ["callout", "Encadré"],
  ["list", "Liste (un élément par ligne)"], ["spec", "Caractéristique"], ["tech", "Technique"],
  ["source-heading", "Intertitre"], ["profil-titre", "Titre de profil"]
];
const AUDIENCES = [["", "Tout le monde"], ["verite", "Vérité"], ["mj", "MJ seulement"]];
const LEVELS = [[2, "Section"], [3, "Sous-section"], [4, "Sous-sous-section"]];
const VISIBILITY = { public: "", verite: "Vérité", gm: "MJ" };

const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const slugify = (text) => String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

function grow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight + 2}px`;
}

// Liste déroulante qui garde toujours la valeur actuelle, même inconnue.
function select(value, list, onChange, extra = {}) {
  const options = list.map(([v, t]) => ({ v, t }));
  const known = options.some((o) => String(o.v) === String(value ?? ""));
  if (!known) {
    // « lore reality-book-lore » : variante d'un style connu, gardée telle quelle.
    const base = options.find((o) => o.v && String(value ?? "").split(" ")[0] === String(o.v));
    options.unshift({ v: value, t: value == null || value === "" ? "(non précisé)" : base ? `${base.t} (variante)` : `${value} (tel quel)` });
  }
  return h("select", {
    class: "tuc-select", ...extra,
    onChange: (event) => onChange(options[event.target.selectedIndex].v)
  }, options.map((o) => h("option", { selected: String(o.v ?? "") === String(value ?? "") }, o.t)));
}

function put(object, key, value) {
  if (value === undefined || value === "") delete object[key];
  else object[key] = value;
}

const CSS = `
.tuc-corps { display: flex; flex-direction: column; gap: 12px; color: var(--theme--foreground, #172940); }
.tuc-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; color: var(--theme--foreground-subdued, #6b7a90); }
.tuc-bar .tuc-space { flex: 1; }
.tuc-btn { font: inherit; font-size: 13px; padding: 4px 10px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--theme--form--field--input--border-color, var(--theme--border-color, #d3dae4));
  background: var(--theme--background, #fff); color: var(--theme--foreground, #172940); }
.tuc-btn:hover:not(:disabled) { border-color: var(--theme--primary, #6644ff); color: var(--theme--primary, #6644ff); }
.tuc-btn:disabled { opacity: .4; cursor: default; }
.tuc-btn.tuc-icon { padding: 2px 7px; min-width: 28px; }
.tuc-btn.tuc-danger:hover:not(:disabled) { border-color: var(--theme--danger, #e35169); color: var(--theme--danger, #e35169); }
.tuc-section { border: 1px solid var(--theme--border-color, #d3dae4); border-radius: 8px; background: var(--theme--background, #fff); }
.tuc-section.tuc-mj { border-left: 4px solid var(--theme--danger, #e35169); }
.tuc-section.tuc-verite { border-left: 4px solid var(--theme--warning, #ffa439); }
.tuc-head { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 8px 10px;
  background: var(--theme--background-subdued, #f4f6f9); border-radius: 8px 8px 0 0; }
.tuc-head .tuc-title { flex: 1 1 260px; font-weight: 600; font-size: 15px; }
.tuc-toggle { background: none; border: 0; cursor: pointer; font-size: 14px; width: 22px; color: inherit; }
.tuc-anchor { width: 100%; font-size: 11px; color: var(--theme--foreground-subdued, #6b7a90); padding-left: 28px; }
.tuc-blocks { display: flex; flex-direction: column; gap: 10px; padding: 10px 10px 10px 12px; }
.tuc-block { display: grid; grid-template-columns: 1fr auto; gap: 6px; align-items: start; }
.tuc-block-tools { display: flex; flex-direction: column; gap: 3px; opacity: .55; }
.tuc-block:hover .tuc-block-tools, .tuc-block:focus-within .tuc-block-tools { opacity: 1; }
.tuc-block-main { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.tuc-block-meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 12px; color: var(--theme--foreground-subdued, #6b7a90); }
.tuc-input, .tuc-text, .tuc-select, .tuc-json { font: inherit; color: inherit; box-sizing: border-box;
  border: 1px solid var(--theme--form--field--input--border-color, var(--theme--border-color, #d3dae4));
  background: var(--theme--form--field--input--background, #fff); border-radius: 6px; padding: 6px 8px; }
.tuc-input:focus, .tuc-text:focus, .tuc-select:focus, .tuc-json:focus { outline: none; border-color: var(--theme--primary, #6644ff); }
.tuc-select { padding: 4px 6px; font-size: 13px; max-width: 220px; }
.tuc-text { width: 100%; resize: vertical; line-height: 1.55; min-height: 2.6em; field-sizing: content; }
.tuc-text.tuc-lore { font-style: italic; }
.tuc-text.tuc-callout { background: var(--theme--background-subdued, #f4f6f9); }
.tuc-text.tuc-heading { font-weight: 600; }
.tuc-json { width: 100%; font-family: var(--theme--fonts--monospace--font-family, monospace); font-size: 12px; line-height: 1.45; min-height: 8em; resize: vertical; }
.tuc-table { border-collapse: collapse; width: 100%; }
.tuc-table td { border: 1px solid var(--theme--border-color, #d3dae4); padding: 0; }
.tuc-table input { width: 100%; box-sizing: border-box; border: 0; padding: 5px 7px; font: inherit; background: transparent; color: inherit; }
.tuc-table tr:first-child input { font-weight: 600; }
.tuc-image { display: grid; grid-template-columns: 140px 1fr; gap: 8px; align-items: start; }
.tuc-image img { width: 140px; max-height: 120px; object-fit: cover; border-radius: 6px; background: var(--theme--background-subdued, #f4f6f9); }
.tuc-image .tuc-fields { display: flex; flex-direction: column; gap: 4px; }
.tuc-add { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 10px 10px 12px; }
.tuc-links { border: 1px solid var(--theme--primary, #6644ff); border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
.tuc-links ul { list-style: none; margin: 0; padding: 0; max-height: 220px; overflow: auto; }
.tuc-links li button { width: 100%; text-align: left; background: none; border: 0; padding: 4px 6px; cursor: pointer; font: inherit; color: inherit; border-radius: 4px; }
.tuc-links li button:hover { background: var(--theme--background-subdued, #f4f6f9); }
.tuc-tag { font-size: 11px; padding: 1px 6px; border-radius: 10px; background: var(--theme--background-subdued, #f4f6f9); margin-left: 6px; }
.tuc-find { flex: 0 1 260px; padding: 4px 8px; font-size: 13px; }
.tuc-hit { box-shadow: 0 0 0 2px var(--theme--warning, #ffa439); }
.tuc-excerpt { width: 100%; padding-left: 28px; font-size: 13px; color: var(--theme--foreground-subdued, #6b7a90); cursor: pointer;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tuc-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.tuc-chip { font-size: 12px; padding: 1px 8px; border-radius: 10px; text-decoration: none;
  background: var(--theme--background-subdued, #f4f6f9); color: var(--theme--primary, #6644ff); }
.tuc-chip.tuc-broken { background: var(--theme--danger-background, #fde8ec); color: var(--theme--danger, #e35169); font-weight: 600; }
.tuc-error { color: var(--theme--danger, #e35169); font-size: 13px; }
.tuc-help { font-size: 12px; color: var(--theme--foreground-subdued, #6b7a90); }
`;

function ensureStyle() {
  if (typeof document === "undefined" || document.getElementById("tuc-corps-style")) return;
  const style = document.createElement("style");
  style.id = "tuc-corps-style";
  style.textContent = CSS;
  document.head.appendChild(style);
}

const Editor = {
  name: "TerraUmbraCorps",
  props: { value: { type: [Object, Array, String], default: null }, disabled: { type: Boolean, default: false } },
  emits: ["input"],
  setup(props, { emit }) {
    ensureStyle();
    const api = inject("api", null);
    const formValues = inject("values", ref({}));

    const doc = ref(clone(props.value));
    let lastEmitted = JSON.stringify(props.value ?? null);
    let timer = null;
    const flush = () => {
      clearTimeout(timer); timer = null;
      const text = JSON.stringify(doc.value ?? null);
      if (text === lastEmitted) return;
      lastEmitted = text;
      emit("input", JSON.parse(text));
    };
    const changed = () => { clearTimeout(timer); timer = setTimeout(flush, 250); };
    watch(() => props.value, (value) => {
      const text = JSON.stringify(value ?? null);
      if (text === lastEmitted) return;
      clearTimeout(timer); timer = null;
      lastEmitted = text;
      doc.value = clone(value);
      jsonDraft.value = null;
    }, { deep: true });

    const hasSections = () => doc.value && typeof doc.value === "object" && !Array.isArray(doc.value) && Array.isArray(doc.value.sections);
    const jsonMode = ref(!hasSections());
    const jsonDraft = ref(null);
    const jsonError = ref("");
    const open = ref(new Set());
    const sectionsCount = hasSections() ? doc.value.sections.length : 0;
    if (sectionsCount <= 4) for (let i = 0; i < sectionsCount; i += 1) open.value.add(doc.value.sections[i]);
    const fresh = new WeakSet();       // sections créées ici : leur ancre suit le titre
    const carets = new WeakMap();      // dernière sélection dans chaque paragraphe
    const linkFor = ref(null);
    const linkQuery = ref("");
    const linkResults = ref([]);
    const linkState = ref("");
    let linkTimer = null;

    // Annuler : instantanés du corps pris avant chaque action (et au début de
    // chaque saisie dans un champ), 50 au plus.
    const history = ref([]);
    function snapshot() {
      const text = JSON.stringify(doc.value ?? null);
      const list = history.value;
      if (list[list.length - 1] === text) return;
      history.value = [...list.slice(-49), text];
    }
    function undo() {
      const list = history.value;
      if (!list.length) return;
      const sections = hasSections() ? doc.value.sections : [];
      const openIndexes = sections.map((s, i) => (open.value.has(s) ? i : -1)).filter((i) => i >= 0);
      doc.value = JSON.parse(list[list.length - 1]);
      history.value = list.slice(0, -1);
      open.value = new Set(hasSections() ? openIndexes.map((i) => doc.value.sections[i]).filter(Boolean) : []);
      linkFor.value = null;
      flush();
    }
    const act = (fn) => (...args) => { snapshot(); fn(...args); };

    // Recherche dans l'article : ne montre que les sections qui contiennent le texte.
    const find = ref("");
    const norm = (text) => String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const blockText = (b) => (b && typeof b === "object" ? [b.text, b.caption, b.alt, ...(Array.isArray(b.rows) ? b.rows.flat() : [])].filter((x) => x != null).join(" ") : "");
    const matches = (text) => find.value.trim().length >= 2 && norm(text).includes(norm(find.value.trim()));

    // Contrôle des liens : titre de l'article visé, ou « introuvable ».
    const known = ref({});           // slug -> { title, status, visibility } ou null
    const pending = new Set();
    let knownTimer = null;
    const LINK = /\[([^\]]*)\]\(\/compendium\?article=([a-z0-9-]+)(#[^)]*)?\)/g;
    function linksOf(text) {
      return [...String(text ?? "").matchAll(LINK)].map((m) => ({ label: m[1], slug: m[2], anchor: m[3] ?? "" }));
    }
    function lookup(slugs) {
      if (!api) return;
      for (const slug of slugs) if (!(slug in known.value)) pending.add(slug);
      if (!pending.size || knownTimer) return;
      knownTimer = setTimeout(async () => {
        const batch = [...pending].slice(0, 100);
        batch.forEach((slug) => pending.delete(slug));
        knownTimer = null;
        try {
          const res = await api.get("/items/content_entry", { params: {
            limit: -1, fields: "slug,title,status,visibility",
            filter: JSON.stringify({ type: { _eq: "article" }, slug: { _in: batch } })
          } });
          const next = { ...known.value };
          for (const slug of batch) next[slug] = null;
          for (const row of res.data?.data ?? []) if (!next[row.slug] || row.status === "published") next[row.slug] = row;
          known.value = next;
        } catch { /* contrôle seulement indicatif */ }
        if (pending.size) lookup([]);
      }, 300);
    }

    const dis = () => ({ disabled: props.disabled });
    const confirmDrop = (what) => typeof window === "undefined" || window.confirm(`Supprimer ${what} ? (Directus garde l'ancienne version dans l'historique de l'article.)`);
    const isEmptyBlock = (b) => !b || (!String(b.text ?? "").trim() && !(b.rows || []).some((r) => (Array.isArray(r) ? r : []).some((c) => String(c ?? "").trim())) && !b.src);

    function uniqueId(base) {
      const used = new Set(doc.value.sections.map((s) => s.id));
      let id = slugify(base); let n = 2;
      while (used.has(id)) id = `${slugify(base)}-${n++}`;
      return id;
    }
    function move(list, index, delta) {
      const target = index + delta;
      if (target < 0 || target >= list.length) return;
      snapshot();
      const [item] = list.splice(index, 1);
      list.splice(target, 0, item);
      changed();
    }

    // -------------------------------------------------------------- liens
    function searchLinks() {
      clearTimeout(linkTimer);
      const query = linkQuery.value.trim();
      if (query.length < 2 || !api) { linkResults.value = []; linkState.value = api ? "" : "Recherche indisponible."; return; }
      linkTimer = setTimeout(async () => {
        linkState.value = "Recherche…";
        try {
          const res = await api.get("/items/content_entry", { params: {
            search: query, limit: 15, sort: "title", fields: "slug,title,visibility",
            filter: JSON.stringify({ type: { _eq: "article" }, status: { _eq: "published" } })
          } });
          linkResults.value = res.data?.data ?? [];
          linkState.value = linkResults.value.length ? "" : "Aucun article trouvé.";
        } catch (error) {
          linkState.value = "Recherche impossible.";
        }
      }, 250);
    }
    function insertLink(block, article) {
      const text = String(block.text ?? "");
      const caret = carets.get(block) ?? { start: text.length, end: text.length };
      snapshot();
      const label = text.slice(caret.start, caret.end) || article.title;
      const link = `[${label}](/compendium?article=${article.slug})`;
      block.text = text.slice(0, caret.start) + link + text.slice(caret.end);
      carets.set(block, { start: caret.start + link.length, end: caret.start + link.length });
      linkFor.value = null; linkQuery.value = ""; linkResults.value = [];
      changed();
    }
    const remember = (block) => (event) => carets.set(block, { start: event.target.selectionStart, end: event.target.selectionEnd });

    // -------------------------------------------------------------- blocs
    function paragraph(block, section) {
      const style = String(block.style ?? "");
      const cls = ["tuc-text", style.includes("lore") ? "tuc-lore" : "", style === "callout" ? "tuc-callout" : "",
        style === "source-heading" || style === "profil-titre" ? "tuc-heading" : ""];
      const nodes = [
        h("div", { class: "tuc-block-meta" }, [
          select(block.style ?? "", STYLES, act((v) => { put(block, "style", v); changed(); }), dis()),
          h("button", { class: "tuc-btn", type: "button", ...dis(), onClick: () => {
            linkFor.value = linkFor.value === block ? null : block; linkQuery.value = ""; linkResults.value = []; linkState.value = "";
          } }, linkFor.value === block ? "Fermer" : "Lien vers un article"),
          block.mergedFrom ? h("span", { class: "tuc-tag" }, "fiche fusionnée") : null
        ]),
        h("textarea", {
          class: [...cls, matches(block.text) ? "tuc-hit" : ""], value: block.text ?? "", rows: 2, ...dis(),
          onVnodeMounted: (vnode) => grow(vnode.el), onFocus: snapshot,
          onInput: (event) => { block.text = event.target.value; grow(event.target); remember(block)(event); changed(); },
          onKeyup: remember(block), onMouseup: remember(block), onBlur: (event) => { remember(block)(event); flush(); }
        })
      ];
      const links = linksOf(block.text);
      if (links.length) {
        lookup(links.map((l) => l.slug));
        nodes.push(h("div", { class: "tuc-chips" }, links.map((l) => {
          const target = known.value[l.slug];
          const problem = !(l.slug in known.value) ? "" : !target ? "introuvable" : target.status !== "published" ? "pas publié" : "";
          return h("a", {
            class: ["tuc-chip", problem ? "tuc-broken" : ""], href: `/compendium?article=${l.slug}${l.anchor}`,
            target: "_blank", rel: "noopener", title: `« ${l.label} » → ${l.slug}${l.anchor}`
          }, [`→ ${target?.title ?? l.slug}`, problem ? ` : ${problem}` : "",
            target && VISIBILITY[target.visibility] ? h("span", { class: "tuc-tag" }, VISIBILITY[target.visibility]) : null]);
        })));
      }
      if (linkFor.value === block) nodes.push(h("div", { class: "tuc-links" }, [
        h("input", {
          class: "tuc-input", placeholder: "Chercher un article par son titre…", value: linkQuery.value,
          onVnodeMounted: (vnode) => vnode.el.focus(),
          onInput: (event) => { linkQuery.value = event.target.value; searchLinks(); }
        }),
        h("div", { class: "tuc-help" }, "Le lien remplace le texte sélectionné dans le paragraphe, ou s'ajoute à l'endroit du curseur."),
        linkState.value ? h("div", { class: "tuc-help" }, linkState.value) : null,
        linkResults.value.length ? h("ul", linkResults.value.map((article) => h("li", [
          h("button", { type: "button", onClick: () => insertLink(block, article) }, [
            article.title,
            VISIBILITY[article.visibility] ? h("span", { class: "tuc-tag" }, VISIBILITY[article.visibility]) : null,
            section.audience !== "mj" && article.visibility === "gm" ? h("span", { class: "tuc-tag" }, "attention : article MJ") : null
          ])
        ]))) : null
      ]));
      return nodes;
    }

    function table(block) {
      const rows = block.rows;
      const width = Math.max(1, ...rows.map((r) => r.length));
      const last = (list) => list.length && String(list[list.length - 1] ?? "").trim();
      return [
        h("div", { class: "tuc-block-meta" }, ["Tableau",
          h("button", { class: "tuc-btn", type: "button", ...dis(), onClick: act(() => { rows.push(Array(width).fill("")); changed(); }) }, "+ ligne"),
          h("button", { class: "tuc-btn", type: "button", ...dis(), onClick: act(() => { rows.forEach((r) => r.push("")); changed(); }) }, "+ colonne"),
          h("button", { class: "tuc-btn tuc-danger", type: "button", disabled: props.disabled || rows.length < 2, onClick: () => {
            if (rows[rows.length - 1].some((c) => String(c ?? "").trim()) && !confirmDrop("la dernière ligne")) return;
            snapshot(); rows.pop(); changed();
          } }, "− ligne"),
          h("button", { class: "tuc-btn tuc-danger", type: "button", disabled: props.disabled || width < 2, onClick: () => {
            if (rows.some((r) => r.length === width && last(r)) && !confirmDrop("la dernière colonne")) return;
            snapshot(); rows.forEach((r) => { if (r.length === width) r.pop(); }); changed();
          } }, "− colonne")
        ]),
        h("table", { class: "tuc-table" }, h("tbody", rows.map((row) => h("tr",
          Array.from({ length: width }, (_, c) => h("td", h("input", {
            value: row[c] == null ? "" : String(row[c]), ...dis(), onFocus: snapshot,
            class: matches(row[c]) ? "tuc-hit" : "",
            onInput: (event) => { while (row.length <= c) row.push(""); row[c] = event.target.value; changed(); },
            onBlur: flush
          }))))))
        )
      ];
    }

    function image(block) {
      const src = String(block.src ?? "");
      const url = !src || /^(https?:|data:)/.test(src) ? src : `${window.location.origin}/${src.replace(/^\//, "")}`;
      const field = (key, label) => h("input", {
        class: ["tuc-input", matches(block[key]) ? "tuc-hit" : ""], placeholder: label, title: label, value: block[key] ?? "", ...dis(), onFocus: snapshot,
        onInput: (event) => { block[key] = event.target.value; changed(); }, onBlur: flush
      });
      return [
        h("div", { class: "tuc-block-meta" }, ["Image", block.style ? h("span", { class: "tuc-tag" }, block.style) : null]),
        h("div", { class: "tuc-image" }, [
          url ? h("img", { src: url, alt: "" }) : h("div"),
          h("div", { class: "tuc-fields" }, [field("caption", "Légende"), field("alt", "Description (texte alternatif)"), field("src", "Chemin de l'image")])
        ])
      ];
    }

    function rawBlock(block, list, index) {
      const text = JSON.stringify(block, null, 2);
      return [
        h("div", { class: "tuc-block-meta" }, `Bloc « ${block?.type ?? "?"} » : modifiable en JSON seulement`),
        h("textarea", {
          class: "tuc-json", value: text, ...dis(), onVnodeMounted: (vnode) => grow(vnode.el),
          onChange: (event) => {
            try { const parsed = JSON.parse(event.target.value); snapshot(); list[index] = parsed; changed(); }
            catch { event.target.value = text; window.alert("JSON invalide : bloc remis comme avant."); }
          }
        })
      ];
    }

    function block(section, list, index) {
      const b = list[index];
      let main;
      if (b && typeof b === "object" && (b.type === "p" || b.type === "paragraph") && (b.text === undefined || typeof b.text === "string")) main = paragraph(b, section);
      else if (b && b.type === "table" && Array.isArray(b.rows) && b.rows.every(Array.isArray)) main = table(b);
      else if (b && b.type === "image") main = image(b);
      else main = rawBlock(b, list, index);
      return h("div", { class: "tuc-block" }, [
        h("div", { class: "tuc-block-main" }, main),
        h("div", { class: "tuc-block-tools" }, [
          h("button", { class: "tuc-btn tuc-icon", type: "button", title: "Monter", disabled: props.disabled || index === 0, onClick: () => move(list, index, -1) }, "↑"),
          h("button", { class: "tuc-btn tuc-icon", type: "button", title: "Descendre", disabled: props.disabled || index === list.length - 1, onClick: () => move(list, index, 1) }, "↓"),
          h("button", { class: "tuc-btn tuc-icon tuc-danger", type: "button", title: "Supprimer ce bloc", ...dis(), onClick: () => {
            if (!isEmptyBlock(b) && !confirmDrop("ce bloc")) return;
            snapshot(); list.splice(index, 1); changed();
          } }, "✕")
        ])
      ]);
    }

    // -------------------------------------------------------------- sections
    function section(s, index) {
      const sections = doc.value.sections;
      if (!s || typeof s !== "object" || !Array.isArray(s.blocks)) {
        return h("div", { class: "tuc-section" }, h("div", { class: "tuc-blocks" }, rawBlock(s, sections, index)));
      }
      const searching = find.value.trim().length >= 2;
      const hit = searching && (matches(s.title) || s.blocks.some((b) => matches(blockText(b))));
      if (searching && !hit) return null;
      const isOpen = searching || open.value.has(s);
      const toggle = () => { const next = new Set(open.value); isOpen ? next.delete(s) : next.add(s); open.value = next; };
      return h("div", { class: ["tuc-section", s.audience === "mj" ? "tuc-mj" : "", s.audience === "verite" ? "tuc-verite" : ""] }, [
        h("div", { class: "tuc-head" }, [
          h("button", { class: "tuc-toggle", type: "button", title: isOpen ? "Replier" : "Déplier", onClick: toggle }, isOpen ? "▾" : "▸"),
          h("input", {
            class: ["tuc-input tuc-title", matches(s.title) ? "tuc-hit" : ""], value: s.title ?? "", placeholder: "Titre de la section", ...dis(), onFocus: snapshot,
            onInput: (event) => {
              s.title = event.target.value;
              if (fresh.has(s)) { s.id = ""; s.id = uniqueId(s.title); }
              changed();
            }, onBlur: flush
          }),
          select(s.level, LEVELS, act((v) => { put(s, "level", v); changed(); }), dis()),
          select(s.audience ?? "", AUDIENCES, act((v) => { put(s, "audience", v); changed(); }), dis()),
          h("button", { class: "tuc-btn tuc-icon", type: "button", title: "Monter la section", disabled: props.disabled || index === 0, onClick: () => move(sections, index, -1) }, "↑"),
          h("button", { class: "tuc-btn tuc-icon", type: "button", title: "Descendre la section", disabled: props.disabled || index === sections.length - 1, onClick: () => move(sections, index, 1) }, "↓"),
          h("button", { class: "tuc-btn tuc-icon", type: "button", title: "Insérer une section après celle-ci", ...dis(), onClick: () => addSection(index + 1) }, "+"),
          h("button", { class: "tuc-btn tuc-icon tuc-danger", type: "button", title: "Supprimer la section", ...dis(), onClick: () => {
            if (s.blocks.some((b) => !isEmptyBlock(b)) && !confirmDrop(`la section « ${s.title || s.id} » et tout son texte`)) return;
            snapshot(); sections.splice(index, 1); changed();
          } }, "✕"),
          h("div", { class: "tuc-anchor" }, `${s.blocks.length} bloc${s.blocks.length > 1 ? "s" : ""} · ${words(s)} mots · ancre #${s.id ?? "?"}${fresh.has(s) ? " (suit le titre)" : ""}`),
          isOpen ? null : h("div", { class: "tuc-excerpt", onClick: toggle }, excerpt(s))
        ]),
        isOpen ? h("div", { class: "tuc-blocks" }, s.blocks.map((_, i) => block(s, s.blocks, i))) : null,
        isOpen ? h("div", { class: "tuc-add" }, [
          h("button", { class: "tuc-btn", type: "button", ...dis(), onClick: act(() => { s.blocks.push({ type: "p", text: "" }); changed(); }) }, "+ Paragraphe"),
          h("button", { class: "tuc-btn", type: "button", ...dis(), onClick: act(() => { s.blocks.push({ type: "table", rows: [["", ""], ["", ""]] }); changed(); }) }, "+ Tableau")
        ]) : null
      ]);
    }

    const plain = (text) => String(text ?? "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
    const words = (s) => s.blocks.reduce((n, b) => n + (plain(blockText(b)).match(/[\p{L}\p{N}]+/gu) || []).length, 0);
    function excerpt(s) {
      const first = s.blocks.map((b) => plain(blockText(b)).trim()).find(Boolean) ?? "(vide)";
      return first.length > 160 ? `${first.slice(0, 160)}…` : first;
    }

    function addSection(at) {
      snapshot();
      const s = { id: "", level: 2, title: "Nouvelle section", blocks: [{ type: "p", text: "" }] };
      s.id = uniqueId(s.title);
      fresh.add(s);
      doc.value.sections.splice(at, 0, s);
      const next = new Set(open.value); next.add(s); open.value = next;
      changed();
    }

    // -------------------------------------------------------------- JSON complet
    function jsonView() {
      const text = jsonDraft.value ?? JSON.stringify(doc.value ?? null, null, 2);
      return [
        hasSections() ? null
          : h("div", { class: "tuc-help" }, "Ce contenu n'a pas de sections (ce n'est pas un article) : il se modifie en JSON."),
        h("textarea", {
          class: "tuc-json", value: text, rows: 24, ...dis(),
          onInput: (event) => { jsonDraft.value = event.target.value; jsonError.value = ""; }
        }),
        jsonError.value ? h("div", { class: "tuc-error" }, jsonError.value) : null,
        jsonDraft.value !== null ? h("div", { class: "tuc-bar" }, [
          h("button", { class: "tuc-btn", type: "button", ...dis(), onClick: () => {
            try { const parsed = JSON.parse(jsonDraft.value); snapshot(); doc.value = parsed; jsonDraft.value = null; jsonError.value = ""; flush(); }
            catch (error) { jsonError.value = `JSON invalide : ${error.message}. Rien n'a été changé.`; }
          } }, "Appliquer ce JSON"),
          h("button", { class: "tuc-btn", type: "button", onClick: () => { jsonDraft.value = null; jsonError.value = ""; } }, "Annuler")
        ]) : null
      ];
    }

    return () => {
      const slug = formValues?.value?.slug;
      const sections = hasSections() ? doc.value.sections : [];
      const paragraphs = sections.reduce((n, s) => n + (Array.isArray(s?.blocks) ? s.blocks.length : 0), 0);
      const bar = h("div", { class: "tuc-bar" }, [
        hasSections() ? `${sections.length} section${sections.length > 1 ? "s" : ""} · ${paragraphs} bloc${paragraphs > 1 ? "s" : ""}` : "",
        hasSections() && !jsonMode.value ? h("input", {
          class: "tuc-input tuc-find", type: "search", placeholder: "Chercher dans l'article…", value: find.value,
          onInput: (event) => { find.value = event.target.value; }
        }) : null,
        hasSections() && !jsonMode.value && find.value.trim().length >= 2
          ? `${sections.filter((x) => x && Array.isArray(x.blocks) && (matches(x.title) || x.blocks.some((b) => matches(blockText(b))))).length} section(s) trouvée(s)` : null,
        h("span", { class: "tuc-space" }),
        h("button", { class: "tuc-btn", type: "button", title: "Défait la dernière modification (déplacement, suppression, saisie dans un champ…)",
          disabled: props.disabled || !history.value.length, onClick: undo }, `↶ Annuler${history.value.length ? ` (${history.value.length})` : ""}`),
        hasSections() && !jsonMode.value ? h("button", { class: "tuc-btn", type: "button", onClick: () => { open.value = new Set(sections); } }, "Tout déplier") : null,
        hasSections() && !jsonMode.value ? h("button", { class: "tuc-btn", type: "button", onClick: () => { open.value = new Set(); } }, "Tout replier") : null,
        slug && hasSections() ? h("a", { class: "tuc-btn", href: `/compendium?article=${encodeURIComponent(slug)}`, target: "_blank", rel: "noopener" }, "Voir sur le site") : null,
        h("button", { class: "tuc-btn", type: "button", disabled: !hasSections() && jsonMode.value, onClick: () => {
          if (jsonMode.value && jsonDraft.value !== null && !window.confirm("Abandonner les modifications du JSON non appliquées ?")) return;
          flush(); jsonDraft.value = null; jsonError.value = ""; jsonMode.value = !jsonMode.value;
        } }, jsonMode.value ? "Revenir à l'éditeur" : "JSON complet (avancé)")
      ]);
      if (jsonMode.value || !hasSections()) return h("div", { class: "tuc-corps" }, [bar, ...jsonView()]);
      return h("div", { class: "tuc-corps" }, [
        bar,
        ...sections.map((s, i) => section(s, i)),
        h("div", h("button", { class: "tuc-btn", type: "button", ...dis(), onClick: () => addSection(sections.length) }, "+ Ajouter une section à la fin"))
      ]);
    };
  }
};

export default {
  id: "terra-umbra-corps",
  name: "Corps d'article (Terra Umbra)",
  icon: "article",
  description: "Sections, paragraphes, tableaux et images du compendium, sans JSON.",
  component: Editor,
  types: ["json"],
  options: null
};
