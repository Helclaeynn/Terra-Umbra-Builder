<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import TerraUmbraBrand from "../components/TerraUmbraBrand.vue";
import { ApiError, api } from "../lib/api";

type DecisionStatus = "pending" | "decided" | "deferred";
type Decision = { choice: string; note: string; status: DecisionStatus };
type Taxonomy = { key: string; label: string; explanation: string };
type ArbitrageItem = {
  id: string;
  sourceType: "ambiguity" | "editorial";
  pageId: string;
  title: string;
  category: string;
  dataset: string;
  audience: "public" | "mj" | "mixed" | "unknown";
  sections: Array<{ id: string; title: string; anchor: string; audience: string }>;
  summary: string;
  references: string[];
  kind: string;
  kindLabel: string;
  whyUnclear: string;
  observation: string;
  opposedParts: string[];
  question: string;
  options: Array<{ key: string; label: string }>;
  impact: string;
};
type ArbitragePayload = {
  generatedAt: string;
  sourceCommit: string;
  coverage: { activePages?: number; sections?: number; pagesNotRead?: number };
  summary: { total: number; pages: number; byKind: Record<string, number>; byAudience: Record<string, number> };
  taxonomy: Taxonomy[];
  items: ArbitrageItem[];
};

const STORAGE_KEY = "tuc-recipe2-arbitrations-v1";
const data = ref<ArbitragePayload | null>(null);
const decisions = ref<Record<string, Decision>>({});
const loading = ref(true);
const error = ref("");
const search = ref("");
const kind = ref("");
const audience = ref("");
const sourceType = ref("");
const status = ref("");
const page = ref(1);
const pageSize = 20;

function readDecisions(): Record<string, Decision> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch { return {}; }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions.value)); }
function decisionFor(item: ArbitrageItem): Decision {
  return decisions.value[item.id] ?? { choice: "", note: "", status: "pending" };
}
function updateDecision(item: ArbitrageItem, patch: Partial<Decision>) {
  decisions.value[item.id] = { ...decisionFor(item), ...patch };
  if (patch.choice && !patch.status) decisions.value[item.id].status = "decided";
  persist();
}
function statusLabel(value: DecisionStatus): string {
  if (value === "decided") return "Décidé";
  if (value === "deferred") return "À documenter";
  return "À arbitrer";
}
function audienceLabel(value: string): string {
  if (value === "mj") return "MJ uniquement";
  if (value === "mixed") return "Public + MJ";
  if (value === "public") return "Public";
  return "Non précisée";
}
function sourceTypeLabel(value: string): string {
  return value === "editorial" ? "Constat éditorial" : "Ambiguïté de lecture";
}
function resetFilters() { search.value = ""; kind.value = ""; audience.value = ""; sourceType.value = ""; status.value = ""; page.value = 1; }
function filtersChanged() { page.value = 1; }

const taxonomy = computed(() => data.value?.taxonomy ?? []);
const filteredItems = computed(() => {
  const q = search.value.trim().toLocaleLowerCase("fr");
  return (data.value?.items ?? []).filter((item) => {
    if (kind.value && item.kind !== kind.value) return false;
    if (audience.value && item.audience !== audience.value) return false;
    if (sourceType.value && item.sourceType !== sourceType.value) return false;
    const current = decisionFor(item);
    if (status.value && current.status !== status.value) return false;
    if (!q) return true;
    return [item.id, item.title, item.category, item.dataset, item.observation, item.question, item.kindLabel, ...item.references].join(" ").toLocaleLowerCase("fr").includes(q);
  }).sort((a, b) => {
    const rank = (item: ArbitrageItem) => decisionFor(item).status === "pending" ? 0 : decisionFor(item).status === "deferred" ? 1 : 2;
    return rank(a) - rank(b) || a.title.localeCompare(b.title, "fr") || a.id.localeCompare(b.id, "fr");
  });
});
const pageCount = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize)));
const visibleItems = computed(() => filteredItems.value.slice((Math.min(page.value, pageCount.value) - 1) * pageSize, Math.min(page.value, pageCount.value) * pageSize));
const pendingCount = computed(() => (data.value?.items ?? []).filter((item) => decisionFor(item).status === "pending").length);
const decidedCount = computed(() => (data.value?.items ?? []).filter((item) => decisionFor(item).status === "decided").length);

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}
function exportJson() {
  if (!data.value) return;
  const rows = data.value.items.map((item) => ({ ...item, decision: decisionFor(item) }));
  download("terra-umbra-recette-2-arbitrages.json", JSON.stringify({ exportedAt: new Date().toISOString(), sourceCommit: data.value.sourceCommit, rows }, null, 2) + "\n", "application/json;charset=utf-8");
}
function csvCell(value: unknown): string { return `"${String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`; }
function exportCsv() {
  if (!data.value) return;
  const header = ["id", "fiche", "categorie", "audience", "type", "observation", "pourquoi", "question", "option_choisie", "statut", "note", "sections", "impact"];
  const lines = [header.map(csvCell).join(",")];
  for (const item of data.value.items) {
    const decision = decisionFor(item);
    lines.push([item.id, item.title, item.category, audienceLabel(item.audience), item.kindLabel, item.observation, item.whyUnclear, item.question, decision.choice, statusLabel(decision.status), decision.note, item.sections.map((section) => `${section.title} (${section.anchor})`).join(" | "), item.impact].map(csvCell).join(","));
  }
  download("terra-umbra-recette-2-arbitrages.csv", "\ufeff" + lines.join("\n") + "\n", "text/csv;charset=utf-8");
}

async function load() {
  loading.value = true; error.value = "";
  try { data.value = await api<ArbitragePayload>("/api/admin/compendium-arbitrage"); }
  catch (cause) { error.value = cause instanceof ApiError && cause.message === "authentication_required" ? "Connexion administrateur requise." : cause instanceof ApiError && cause.message === "admin_required" ? "Cette page est réservée aux administrateurs." : "La recette 2 n’a pas pu charger le corpus."; }
  finally { loading.value = false; }
}
onMounted(() => { decisions.value = readDecisions(); void load(); });
watch(pageCount, (value) => { if (page.value > value) page.value = value; });
</script>

<template>
  <div class="arbitrage-shell">
    <header class="arbitrage-topbar">
      <RouterLink to="/" class="brand-link"><TerraUmbraBrand /></RouterLink>
      <nav aria-label="Navigation de la recette"><RouterLink to="/admin/quality">Recette 1</RouterLink><RouterLink to="/compendium">Compendium</RouterLink><button type="button" :disabled="loading" @click="load">{{ loading ? "Actualisation…" : "Actualiser" }}</button></nav>
    </header>
    <main class="arbitrage-page">
      <section class="arbitrage-hero">
        <div><p class="eyebrow">ADMINISTRATION · RECETTE 2</p><h1>Arbitrer les ambiguïtés du corpus</h1><p>Chaque ligne est une vraie question de décision. La page indique la fiche, la section, ce que le texte dit, pourquoi ce n’est pas clair, les options possibles et ce que la décision changera.</p><p class="private-note">MJ / administrateurs uniquement · les informations de Vérité et les liens PNJ privés ne sont pas exposés aux joueurs.</p><p class="classification-note"><strong>Important :</strong> le badge Audience décrit la section source ; il ne constitue pas la décision à prendre. La décision porte sur la <strong>Nature du problème</strong> et la question affichée dans chaque fiche. Si le classement semble faux, ne force pas un choix : passe la fiche à « À documenter » et signale-le dans la justification.</p></div>
        <div class="hero-score"><strong>{{ data?.summary.total ?? "—" }}</strong><span>cas à arbitrer</span><small>{{ pendingCount }} encore ouverts</small></div>
      </section>

      <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
      <section v-if="loading" class="loading-panel" role="status">Lecture du catalogue d’arbitrage…</section>
      <template v-else-if="data">
        <section class="summary-grid">
          <article class="summary-card"><span>Total des constats</span><strong>{{ data.summary.total.toLocaleString("fr-FR") }}</strong><small>{{ data.summary.pages.toLocaleString("fr-FR") }} fiches concernées</small></article>
          <article class="summary-card"><span>Encore à arbitrer</span><strong>{{ pendingCount.toLocaleString("fr-FR") }}</strong><small>{{ decidedCount.toLocaleString("fr-FR") }} décision(s) locale(s) enregistrée(s)</small></article>
          <article class="summary-card"><span>Fiches jamais non-lues</span><strong>{{ data.coverage.pagesNotRead ?? 0 }}</strong><small>{{ data.coverage.sections ?? 0 }} sections consignées</small></article>
        </section>
        <section class="taxonomy-strip" aria-label="Taxonomie des causes"><button type="button" :class="{ active: !kind }" @click="kind = ''; filtersChanged()">Toutes <strong>{{ data.summary.total }}</strong></button><button v-for="entry in taxonomy" :key="entry.key" type="button" :class="{ active: kind === entry.key }" @click="kind = entry.key; filtersChanged()">{{ entry.label }} <strong>{{ data.summary.byKind[entry.key] ?? 0 }}</strong></button></section>
        <section class="queue-panel">
          <div class="queue-heading"><div><p class="eyebrow">FILE EXPLICABLE</p><h2>{{ filteredItems.length.toLocaleString("fr-FR") }} cas affichés</h2></div><div class="export-actions"><button type="button" @click="exportCsv">Exporter CSV</button><button type="button" @click="exportJson">Exporter JSON</button></div></div>
          <div class="filters">
            <label>Recherche<input v-model="search" type="search" placeholder="Fiche, constat, terme…" @input="filtersChanged" /></label>
            <label>Cause<select v-model="kind" @change="filtersChanged"><option value="">Toutes les causes</option><option v-for="entry in taxonomy" :key="entry.key" :value="entry.key">{{ entry.label }}</option></select></label>
            <label>Audience<select v-model="audience" @change="filtersChanged"><option value="">Toutes les audiences</option><option value="public">Public</option><option value="mj">MJ uniquement</option><option value="mixed">Public + MJ</option><option value="unknown">Non précisée</option></select></label>
            <label>Origine<select v-model="sourceType" @change="filtersChanged"><option value="">Ambiguïtés + constats éditoriaux</option><option value="ambiguity">Ambiguïté de lecture</option><option value="editorial">Constat éditorial</option></select></label>
            <label>Mon état<select v-model="status" @change="filtersChanged"><option value="">Tous mes états</option><option value="pending">À arbitrer</option><option value="decided">Décidé</option><option value="deferred">À documenter</option></select></label>
            <button type="button" class="clear" @click="resetFilters">Réinitialiser</button>
          </div>
          <p class="local-note">Les choix sont enregistrés dans ce navigateur. Utilise l’export CSV/JSON pour transmettre ou archiver les arbitrages.</p>
          <p v-if="!filteredItems.length" class="queue-empty">Aucun cas ne correspond à ces filtres.</p>
          <section v-for="item in visibleItems" :key="item.id" class="case-card">
            <header class="case-head"><div><span class="case-number">{{ item.id }}</span><h3>{{ item.title }}</h3><p>{{ item.category }}<template v-if="item.dataset"> · {{ item.dataset }}</template> · <span class="audience-badge" :class="item.audience">{{ audienceLabel(item.audience) }}</span></p></div><span class="kind-badge">{{ item.kindLabel }}</span></header>
            <div class="case-meta"><span><strong>Nature de la décision :</strong> {{ item.kindLabel }}</span><span><strong>Audience source :</strong> {{ audienceLabel(item.audience) }}</span><span v-for="section in item.sections" :key="section.id">Section : <a :href="`/compendium?article=${encodeURIComponent(item.pageId)}&section=${encodeURIComponent(section.id)}`" target="_blank" rel="noopener">{{ section.title }} ↗</a></span><span>{{ sourceTypeLabel(item.sourceType) }}</span></div>
            <div class="case-grid"><div><h4>Ce que le corpus dit</h4><p class="observation">{{ item.observation }}</p><div v-if="item.opposedParts.length === 2" class="opposed"><div><strong>Élément A</strong><p>{{ item.opposedParts[0] }}</p></div><div><strong>Élément B</strong><p>{{ item.opposedParts[1] }}</p></div></div><h4>Pourquoi ce n’est pas clair</h4><p>{{ item.whyUnclear }}</p><p v-if="item.summary" class="summary"><strong>Contexte de la fiche :</strong> {{ item.summary }}</p><p v-if="item.references.length" class="references"><strong>À recroiser :</strong> {{ item.references.join(" · ") }}</p></div><div><h4>Question à trancher</h4><p class="question">{{ item.question }}</p><fieldset><legend>Choix</legend><label v-for="option in item.options" :key="option.key" class="option"><input type="radio" :name="item.id" :value="option.key" :checked="decisionFor(item).choice === option.key" @change="updateDecision(item, { choice: option.key })" /><span><strong>{{ option.key }}</strong> — {{ option.label }}</span></label></fieldset><p class="impact"><strong>Impact :</strong> {{ item.impact }}</p><label class="decision-status">État<select :value="decisionFor(item).status" @change="updateDecision(item, { status: ($event.target as HTMLSelectElement).value as DecisionStatus })"><option value="pending">À arbitrer</option><option value="decided">Décidé</option><option value="deferred">À documenter</option></select></label><label class="decision-note">Justification / action<textarea :value="decisionFor(item).note" rows="3" placeholder="Écris pourquoi tu retiens ce choix…" @input="updateDecision(item, { note: ($event.target as HTMLTextAreaElement).value })"></textarea></label></div></div>
          </section>
          <nav v-if="pageCount > 1" class="pagination" aria-label="Pages d’ambiguïtés"><button type="button" :disabled="page <= 1" @click="page--">Précédent</button><span>Page {{ Math.min(page, pageCount) }} / {{ pageCount }} · {{ visibleItems.length }} affichées</span><button type="button" :disabled="page >= pageCount" @click="page++">Suivant</button></nav>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.arbitrage-shell{min-height:100vh;background:#070e18;color:#edf4ff;font:400 15px/1.55 Inter,"Segoe UI",sans-serif}.arbitrage-shell :is(h1,h2,h3,h4){font-family:inherit;color:#edf4ff;letter-spacing:-.025em}.arbitrage-shell :is(button,input,select,textarea){font:inherit}.arbitrage-shell :is(button,a,input,select,textarea):focus-visible{outline:2px solid #64def5;outline-offset:3px}.arbitrage-shell button:disabled{opacity:.55;cursor:wait}.arbitrage-topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:80px;padding:10px clamp(16px,3vw,48px);border-bottom:1px solid #263c51;background:rgba(5,11,19,.97);backdrop-filter:blur(16px)}.brand-link{display:flex;min-width:0;text-decoration:none}.arbitrage-topbar nav{display:flex;align-items:center;flex-wrap:wrap;gap:8px}.arbitrage-topbar nav :is(a,button),.export-actions button,.clear,.pagination button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 14px;border:1px solid #314d63;border-radius:6px;background:#0d1927;color:#cee1f2;text-decoration:none;cursor:pointer}.arbitrage-topbar nav :is(a,button):hover,.export-actions button:hover,.clear:hover,.pagination button:hover{border-color:#64def5;background:#14273a;color:#edf4ff}.arbitrage-page{width:min(1640px,calc(100% - 64px));margin:0 auto;padding:36px 0 72px}.arbitrage-hero{display:flex;align-items:center;justify-content:space-between;gap:32px;padding:clamp(24px,3vw,48px);margin-bottom:24px;border:1px solid #2c4358;border-radius:10px;background:linear-gradient(90deg,#09131ff2,#09131fb0),url('/brand/orbital/orbital-earth.webp') right center/cover}.arbitrage-hero h1{font-size:clamp(30px,3vw,48px);line-height:1.15;margin:12px 0 16px}.arbitrage-hero p{max-width:85ch;color:#bacce0;margin:0 0 12px}.private-note{color:#f1cf9f!important}.classification-note{max-width:100ch!important;padding:12px 14px;border:1px solid #735c38;border-radius:6px;background:#211a10;color:#f0d5a8!important}.classification-note strong{color:#ffe4ad}.hero-score{display:grid;text-align:right;flex:none}.hero-score strong{font-size:48px;line-height:1.15;color:#9eeaff}.hero-score span,.hero-score small{color:#a1b5cc}.eyebrow{margin:0 0 8px;font:11px/1.5 Consolas,monospace;letter-spacing:.14em;color:#85dff1;text-transform:uppercase}.feedback,.loading-panel,.queue-empty{margin:20px 0;padding:18px 20px;border:1px solid #314d63;border-radius:8px;background:#102233;color:#c6e6f6}.feedback.error{border-color:#885967;background:#241824;color:#ffb6c1}.summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0 0 16px}.summary-card{display:grid;gap:5px;padding:20px;border:1px solid #2c4358;border-radius:8px;background:#0c1726}.summary-card span{color:#b9ccdf}.summary-card strong{font-size:32px;color:#edf4ff}.summary-card small{color:#91a8bd}.taxonomy-strip{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 24px}.taxonomy-strip button{padding:9px 12px;border:1px solid #314d63;border-radius:999px;background:#0c1726;color:#b9ccdf;cursor:pointer}.taxonomy-strip button.active,.taxonomy-strip button:hover{border-color:#64def5;background:#15354a;color:#e7faff}.taxonomy-strip strong{margin-left:5px;color:#9eeaff}.queue-panel{min-width:0;border:1px solid #2c4358;border-radius:8px;background:#0c1726;padding:22px}.queue-heading{display:flex;align-items:center;justify-content:space-between;gap:20px}.queue-heading h2{margin:6px 0;font-size:26px}.export-actions{display:flex;flex-wrap:wrap;gap:8px}.filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;align-items:end;margin:24px 0 12px}.filters label,.decision-status,.decision-note{display:grid;min-width:0;gap:7px;color:#b9ccdf;font-size:13px}.filters input,.filters select,.decision-status select,.decision-note textarea{width:100%;min-width:0;min-height:44px;padding:10px 11px;border:1px solid #314d63;border-radius:6px;background:#08121e;color:#edf4ff}.filters input::placeholder,.decision-note textarea::placeholder{color:#92a8be}.local-note{margin:0 0 20px;color:#a1b5cc;font-size:13px}.case-card{margin-top:18px;padding:22px;border:1px solid #263f55;border-radius:8px;background:#0a1421}.case-head{display:flex;justify-content:space-between;gap:18px;align-items:start}.case-head h3{margin:4px 0 2px;font-size:20px}.case-head p{margin:0;color:#a9bed1}.case-number{color:#6f91aa;font:11px/1.4 Consolas,monospace;overflow-wrap:anywhere}.kind-badge,.audience-badge{display:inline-block;padding:4px 8px;border:1px solid #416078;border-radius:5px;color:#bce8f5;font-size:12px}.audience-badge.mj{color:#ffcf9d;border-color:#80603b}.audience-badge.mixed{color:#f2d692;border-color:#806f3b}.case-meta{display:flex;flex-wrap:wrap;gap:8px 18px;padding:12px 0;border-bottom:1px solid #203247;color:#92abc0;font-size:12px}.case-meta a{color:#9eeaff}.case-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(320px,.92fr);gap:28px;padding-top:18px}.case-grid h4{margin:0 0 7px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#85dff1}.case-grid p{margin:0 0 14px;color:#c5d5e2}.observation{padding:13px 14px;border-left:3px solid #587892;background:#0d1d2d;color:#edf4ff!important}.question{padding:13px 14px;border-left:3px solid #64def5;background:#10283b;color:#eafaff!important}.summary,.references{font-size:13px}.references{color:#9cb4c8!important}.opposed{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:-2px 0 18px}.opposed>div{padding:10px 12px;border:1px solid #354c61;border-radius:5px;background:#0d1a28}.opposed strong{color:#edcb98;font-size:12px}.opposed p{font-size:13px;margin:5px 0 0}.case-grid fieldset{margin:0 0 14px;padding:0;border:0}.case-grid legend{margin-bottom:7px;color:#b9ccdf;font-size:13px}.option{display:flex;align-items:start;gap:9px;padding:9px 10px;border:1px solid transparent;border-radius:5px;color:#c5d5e2;cursor:pointer}.option:hover{border-color:#35536a;background:#0d2031}.option input{margin-top:4px;accent-color:#64def5}.option strong{color:#9eeaff}.impact{padding-top:10px;border-top:1px solid #203247;color:#a7bfd0!important;font-size:13px}.decision-status{margin-top:12px}.decision-note{margin-top:12px}.decision-note textarea{resize:vertical}.pagination{display:flex;align-items:center;justify-content:center;gap:18px;padding:22px}.pagination span{color:#a1b5cc}.pagination button:disabled{opacity:.5;cursor:default}@media(max-width:1000px){.arbitrage-page{width:calc(100% - 40px)}.case-grid{grid-template-columns:1fr}.summary-grid{grid-template-columns:1fr 1fr}}@media(max-width:700px){.arbitrage-topbar{position:static;flex-wrap:wrap}.arbitrage-topbar nav{margin-left:auto}.arbitrage-page{width:calc(100% - 24px);padding-top:20px}.arbitrage-hero{padding:24px 20px;align-items:start}.hero-score{display:none}.summary-grid{grid-template-columns:1fr}.queue-heading,.case-head{align-items:stretch;flex-direction:column}.export-actions{justify-content:flex-start}.filters{grid-template-columns:1fr}.case-card,.queue-panel{padding:16px}.opposed{grid-template-columns:1fr}}
</style>
