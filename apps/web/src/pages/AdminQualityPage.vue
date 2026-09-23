<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import TerraUmbraBrand from "../components/TerraUmbraBrand.vue";
import { ApiError, api } from "../lib/api";

type ReviewStatus = "pending" | "approved" | "rework";
type Severity = "critical" | "warning" | "info";
type Issue = { code: string; severity: Severity; label: string };
type QualityItem = {
  id: string;
  title: string;
  category: string;
  dataset: string;
  group: string;
  subgroup: string;
  source: string;
  media: unknown;
  issues: Issue[];
  firstSeenAt: string | null;
  reviewStatus: ReviewStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  reviewerName: string | null;
};
type QualityPayload = {
  generatedAt: string;
  recentWindowDays: number;
  summary: {
    total: number;
    pending: number;
    approved: number;
    rework: number;
    recentPending: number;
    missingMedia: { pnj: number; bestiary: number; equipment: number };
    placeholderMedia: number;
    brokenMedia: number;
    pnjMissingMj: number;
    pnjMissingStats: number;
    orphanNavigation: number;
    brokenReferences: number;
    mjLeaks: number;
    bySeverity: { critical: number; warning: number; info: number };
    editorConflicts: number;
    overrideConflicts: number;
    overrideMissing: number;
  };
  items: QualityItem[];
};
type CoveragePayload = {
  summary: { total: number; linked: number; missing: number; ambiguous: number };
};

const quality = ref<QualityPayload | null>(null);
const coverage = ref<CoveragePayload | null>(null);
const loading = ref(true);
const busyId = ref("");
const error = ref("");
const notice = ref("");
const search = ref("");
const category = ref("");
const review = ref("");
const issue = ref("");
const recentOnly = ref(false);
const reviewDialog = ref<HTMLDialogElement | null>(null);
const reviewTarget = ref<QualityItem | null>(null);
const reviewDraft = ref("");

const issueLabels: Record<string, string> = {
  missing_media: "Sans image",
  placeholder_media: "Placeholder",
  broken_media: "Image cassée",
  pnj_missing_mj: "Bloc MJ",
  pnj_missing_stats: "Stats PNJ",
  orphan_navigation: "Navigation",
  broken_reference: "Lien cassé",
  mj_leak: "Fuite MJ"
};

const categories = computed(() =>
  [...new Set((quality.value?.items ?? []).map((item) => item.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "fr"))
);

const issueOptions = computed(() => {
  const codes = new Set<string>();
  for (const item of quality.value?.items ?? []) {
    for (const current of item.issues) codes.add(current.code);
  }
  return [...codes].sort().map((code) => ({ code, label: issueLabels[code] ?? code }));
});

const filteredItems = computed(() => {
  const q = search.value.trim().toLocaleLowerCase("fr");
  const recentCutoff =
    Date.now() - (quality.value?.recentWindowDays ?? 14) * 24 * 60 * 60 * 1000;

  return (quality.value?.items ?? [])
    .filter((item) => !category.value || item.category === category.value)
    .filter((item) => !review.value || item.reviewStatus === review.value)
    .filter((item) => !issue.value || item.issues.some((entry) => issue.value === "__critical" ? entry.severity === "critical" : entry.code === issue.value))
    .filter((item) => {
      if (!recentOnly.value) return true;
      return (
        item.reviewStatus === "pending" &&
        Boolean(item.firstSeenAt) &&
        new Date(item.firstSeenAt as string).getTime() >= recentCutoff
      );
    })
    .filter((item) => {
      if (!q) return true;
      return [
        item.title,
        item.id,
        item.category,
        item.dataset,
        item.group,
        item.subgroup,
        item.source,
        item.reviewNote ?? ""
      ].join(" ").toLocaleLowerCase("fr").includes(q);
    })
    .sort((a, b) => {
      const rank: Record<ReviewStatus, number> = { rework: 0, pending: 1, approved: 2 };
      const reviewDiff = rank[a.reviewStatus] - rank[b.reviewStatus];
      if (reviewDiff) return reviewDiff;
      const criticalDiff =
        b.issues.filter((entry) => entry.severity === "critical").length -
        a.issues.filter((entry) => entry.severity === "critical").length;
      if (criticalDiff) return criticalDiff;
      return new Date(b.firstSeenAt ?? 0).getTime() - new Date(a.firstSeenAt ?? 0).getTime();
    });
});

function resetFilters() {
  search.value = "";
  category.value = "";
  review.value = "";
  issue.value = "";
  recentOnly.value = false;
}

function mediaSource(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    return String((value as Record<string, unknown>).src ?? "").trim();
  }
  return "";
}

function mediaUrl(value: unknown): string {
  const src = mediaSource(value);
  if (!src) return "";
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/api/compendium/media/")) return src;
  const clean = src.replace(/^\/?compendium\//, "").replace(/^\/+/, "");
  if (!clean.startsWith("images/") && !clean.startsWith("assets/")) return "";
  return "/api/compendium/media/" + clean;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function reviewLabel(value: ReviewStatus): string {
  if (value === "approved") return "Validé";
  if (value === "rework") return "À revoir";
  return "À recetter";
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const [qualityResult, coverageResult] = await Promise.all([
      api<QualityPayload>("/api/admin/compendium-quality"),
      api<CoveragePayload>("/api/compendium/editor/builder-coverage")
    ]);
    quality.value = qualityResult;
    coverage.value = coverageResult;
  } catch (cause) {
    if (cause instanceof ApiError) {
      if (cause.message === "authentication_required") {
        error.value = "Connexion requise.";
      } else if (cause.message === "admin_required" || cause.message === "editor_required") {
        error.value = "Cette page est réservée aux administrateurs.";
      } else {
        error.value = cause.message;
      }
    } else {
      error.value = "Impossible de charger le contrôle qualité.";
    }
  } finally {
    loading.value = false;
  }
}

async function setReview(item: QualityItem, status: ReviewStatus, noteOverride?: string) {
  let note = item.reviewNote ?? "";
  if (status === "rework" && noteOverride === undefined) {
    reviewTarget.value = item;
    reviewDraft.value = note;
    await nextTick();
    reviewDialog.value?.showModal();
    return;
  }
  if (status === "rework") note = (noteOverride ?? "").trim();
  else if (status === "pending") note = "";

  busyId.value = item.id;
  error.value = "";
  notice.value = "";
  try {
    await api("/api/admin/compendium-quality/" + encodeURIComponent(item.id) + "/review", {
      method: "PATCH",
      body: JSON.stringify({ status, note: note || null })
    });
    notice.value =
      status === "approved"
        ? "Entrée validée."
        : status === "rework"
          ? "Entrée marquée à revoir."
          : "Entrée remise dans la file de recette.";
    await load();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "La recette n’a pas pu être enregistrée.";
  } finally {
    busyId.value = "";
  }
}

function submitReview() {
  if (!reviewTarget.value) return;
  const item = reviewTarget.value;
  const note = reviewDraft.value;
  reviewDialog.value?.close();
  void setReview(item, "rework", note);
}

onMounted(load);
</script>

<template>
  <div class="quality-shell">
    <header class="quality-topbar">
      <RouterLink to="/" class="brand-link">
        <TerraUmbraBrand />
      </RouterLink>
      <nav aria-label="Navigation de la recette">
        <RouterLink to="/account">Mon espace</RouterLink>
        <RouterLink to="/compendium">Compendium</RouterLink>
        <button type="button" :disabled="loading || Boolean(busyId)" @click="load">{{ loading ? "Actualisation…" : "Actualiser" }}</button>
      </nav>
    </header>

    <dialog ref="reviewDialog" class="review-dialog" aria-labelledby="review-dialog-title">
      <form @submit.prevent="submitReview">
        <p class="eyebrow">RETOUR DE RECETTE</p>
        <h2 id="review-dialog-title">À revoir</h2>
        <p class="review-dialog-target">{{ reviewTarget?.title }}</p>
        <label for="review-note">Ce qui doit être corrigé</label>
        <textarea id="review-note" v-model="reviewDraft" rows="5" autofocus placeholder="Précise les points à reprendre…"></textarea>
        <div class="review-dialog-actions">
          <button type="button" @click="reviewDialog?.close()">Annuler</button>
          <button class="review-confirm" type="submit">Enregistrer le retour</button>
        </div>
      </form>
    </dialog>

    <main class="quality-page">
      <section class="quality-hero">
        <div>
          <p class="eyebrow">ADMINISTRATION · CONTRÔLE QUALITÉ</p>
          <h1>Recette du Compendium</h1>
          <p>Images, intégrité éditoriale, sécurité MJ, navigation et suivi des pages nouvellement intégrées.</p>
        </div>
        <div v-if="quality" class="hero-score">
          <strong>{{ quality.summary.pending + quality.summary.rework }}</strong>
          <span>à traiter</span>
        </div>
      </section>

      <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
      <p v-if="notice" class="feedback" role="status">{{ notice }}</p>
      <section v-if="loading" class="loading-panel" role="status">Analyse du corpus…</section>

      <template v-else-if="quality">
        <section class="score-grid">
          <button class="score-card critical" type="button" @click="resetFilters(); issue = '__critical'">
            <span>Critiques</span><strong>{{ quality.summary.bySeverity.critical }}</strong><small>{{ quality.summary.mjLeaks }} fuite(s) MJ</small>
          </button>
          <button class="score-card" type="button" @click="resetFilters(); review = 'pending'">
            <span>À recetter</span><strong>{{ quality.summary.pending }}</strong><small>{{ quality.summary.recentPending }} récent(s)</small>
          </button>
          <button class="score-card rework" type="button" @click="resetFilters(); review = 'rework'">
            <span>À revoir</span><strong>{{ quality.summary.rework }}</strong><small>retours de recette</small>
          </button>
          <button class="score-card ok" type="button" @click="resetFilters(); review = 'approved'">
            <span>Validés</span><strong>{{ quality.summary.approved }}</strong><small>recette terminée</small>
          </button>
        </section>

        <section class="audit-grid">
          <article class="audit-card">
            <p class="eyebrow">IMAGES</p><h2>Illustrations manquantes</h2>
            <div class="metric-row"><span>PNJ</span><strong>{{ quality.summary.missingMedia.pnj }}</strong></div>
            <div class="metric-row"><span>Bestiaire</span><strong>{{ quality.summary.missingMedia.bestiary }}</strong></div>
            <div class="metric-row"><span>Équipement</span><strong>{{ quality.summary.missingMedia.equipment }}</strong></div>
            <div class="metric-row"><span>Placeholders</span><strong>{{ quality.summary.placeholderMedia }}</strong></div>
            <div class="metric-row"><span>Images cassées</span><strong>{{ quality.summary.brokenMedia }}</strong></div>
          </article>
          <article class="audit-card">
            <p class="eyebrow">PNJ</p><h2>Complétude</h2>
            <div class="metric-row"><span>Vérité sans bloc MJ</span><strong>{{ quality.summary.pnjMissingMj }}</strong></div>
            <div class="metric-row"><span>Stats à compléter</span><strong>{{ quality.summary.pnjMissingStats }}</strong></div>
            <div class="metric-row"><span>Hors navigation</span><strong>{{ quality.summary.orphanNavigation }}</strong></div>
            <div class="metric-row"><span>Liens cassés</span><strong>{{ quality.summary.brokenReferences }}</strong></div>
          </article>
          <article class="audit-card">
            <p class="eyebrow">ÉDITORIAL</p><h2>Conflits et overrides</h2>
            <div class="metric-row"><span>Éditions en conflit</span><strong>{{ quality.summary.editorConflicts }}</strong></div>
            <div class="metric-row"><span>Overrides en conflit</span><strong>{{ quality.summary.overrideConflicts }}</strong></div>
            <div class="metric-row"><span>Overrides sans cible</span><strong>{{ quality.summary.overrideMissing }}</strong></div>
            <div class="metric-row danger-line"><span>Fuites MJ</span><strong>{{ quality.summary.mjLeaks }}</strong></div>
          </article>
          <article class="audit-card">
            <p class="eyebrow">BUILDER ↔ WIKI</p><h2>Couverture mécanique</h2>
            <template v-if="coverage">
              <div class="metric-row"><span>Références</span><strong>{{ coverage.summary.total }}</strong></div>
              <div class="metric-row"><span>Liées</span><strong>{{ coverage.summary.linked }}</strong></div>
              <div class="metric-row"><span>Sans page</span><strong>{{ coverage.summary.missing }}</strong></div>
              <div class="metric-row"><span>Ambiguës</span><strong>{{ coverage.summary.ambiguous }}</strong></div>
            </template>
          </article>
        </section>

        <section class="queue-panel">
          <div class="queue-heading">
            <div><p class="eyebrow">FILE DE RECETTE</p><h2>{{ filteredItems.length }} entrée(s)</h2></div>
            <button type="button" class="recent-toggle" :class="{ active: recentOnly }" :aria-pressed="recentOnly" @click="recentOnly = !recentOnly">
              Ajoutés récemment · non recettés
            </button>
          </div>

          <div class="filters">
            <label>Recherche<input v-model="search" type="search" placeholder="Titre, identifiant, source…" /></label>
            <label>Catégorie<select v-model="category">
              <option value="">Toutes les catégories</option>
              <option v-for="value in categories" :key="value" :value="value">{{ value }}</option>
            </select></label>
            <label>État de recette<select v-model="review">
              <option value="">Tous les états</option><option value="pending">À recetter</option><option value="rework">À revoir</option><option value="approved">Validés</option>
            </select></label>
            <label>Contrôle<select v-model="issue">
              <option value="">Tous les contrôles</option>
              <option value="__critical">Toutes les anomalies critiques</option>
              <option v-for="value in issueOptions" :key="value.code" :value="value.code">{{ value.label }}</option>
            </select></label>
            <button type="button" class="clear" @click="resetFilters">Réinitialiser</button>
          </div>

          <p v-if="!filteredItems.length" class="queue-empty" role="status">Aucune entrée ne correspond à ces filtres.</p>
          <div v-else class="quality-table-wrap">
            <table class="quality-table">
              <thead><tr><th scope="col">Entrée</th><th scope="col">Contrôles</th><th scope="col">Recette</th><th scope="col">Première détection</th><th scope="col">Actions</th></tr></thead>
              <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td class="entry-cell" data-label="Entrée">
                    <img v-if="mediaUrl(item.media)" :src="mediaUrl(item.media)" :alt="item.title" loading="lazy" />
                    <div class="entry-copy"><strong>{{ item.title }}</strong><span>{{ item.category }} · {{ item.group || item.dataset || "—" }}</span><small>{{ item.id }}</small></div>
                  </td>
                  <td data-label="Contrôles">
                    <div v-if="item.issues.length" class="issue-list">
                      <span v-for="entry in item.issues" :key="entry.code + entry.label" class="issue-chip" :class="entry.severity">{{ entry.label }}</span>
                    </div>
                    <span v-else class="clean-state">Aucune anomalie détectée</span>
                  </td>
                  <td data-label="Recette">
                    <span class="review-state" :class="item.reviewStatus">{{ reviewLabel(item.reviewStatus) }}</span>
                    <small v-if="item.reviewerName" class="review-meta">{{ item.reviewerName }} · {{ formatDate(item.reviewedAt) }}</small>
                    <small v-if="item.reviewNote" class="review-note">{{ item.reviewNote }}</small>
                  </td>
                  <td data-label="Première détection">{{ formatDate(item.firstSeenAt) }}</td>
                  <td class="action-cell" data-label="Actions">
                    <a :href="'/compendium?article=' + encodeURIComponent(item.id)" target="_blank" rel="noopener" :aria-label="`Voir ${item.title} (nouvel onglet)`">Voir ↗</a>
                    <a :href="'/compendium/edit/' + encodeURIComponent(item.id)" target="_blank" rel="noopener" :aria-label="`Éditer ${item.title} (nouvel onglet)`">Éditer ↗</a>
                    <button type="button" :disabled="Boolean(busyId)" @click="setReview(item, 'approved')">Valider</button>
                    <button type="button" class="warn" :disabled="Boolean(busyId)" @click="setReview(item, 'rework')">À revoir</button>
                    <button v-if="item.reviewStatus !== 'pending'" type="button" class="ghost-action" :disabled="Boolean(busyId)" @click="setReview(item, 'pending')">Repasser en recette</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.quality-shell{min-height:100vh;background:#070e18;color:#edf4ff;font:400 15px/1.55 Inter,"Segoe UI",sans-serif}
.quality-shell :is(h1,h2,h3){font-family:inherit;color:#edf4ff;letter-spacing:-.025em}
.quality-shell :is(button,input,select){font:inherit}
.quality-shell :is(button,a,input,select):focus-visible{outline:2px solid #64def5;outline-offset:3px}
.quality-shell button:disabled{opacity:.55;cursor:wait}
.quality-topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:80px;padding:10px clamp(16px,3vw,48px);border-bottom:1px solid #263c51;background:rgba(5,11,19,.97);backdrop-filter:blur(16px)}
.brand-link{display:flex;min-width:0;text-decoration:none}.quality-topbar nav{display:flex;align-items:center;flex-wrap:wrap;gap:8px}
.quality-topbar nav :is(a,button),.recent-toggle,.clear,.action-cell :is(a,button){display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 14px;border:1px solid #314d63;border-radius:6px;background:#0d1927;color:#cee1f2;text-decoration:none;cursor:pointer}
.quality-topbar nav :is(a,button):hover,.recent-toggle:hover,.clear:hover,.action-cell :is(a,button):hover{border-color:#64def5;background:#14273a;color:#edf4ff}
.review-dialog{width:min(560px,calc(100vw - 32px));max-height:calc(100dvh - 32px);padding:28px;border:1px solid #43617b;border-radius:10px;background:#0c1726;color:#edf4ff;box-shadow:0 24px 80px #0008}.review-dialog::backdrop{background:#030811bf;backdrop-filter:blur(4px)}.review-dialog h2{font-size:26px;margin:8px 0}.review-dialog-target{color:#b9ccdf;overflow-wrap:anywhere}.review-dialog label{display:block;margin:24px 0 8px;color:#c6d9ea;font-size:14px}.review-dialog textarea{display:block;resize:vertical;width:100%;padding:12px;border:1px solid #43617b;border-radius:6px;background:#07111e;color:#edf4ff;font:inherit}.review-dialog-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px;margin-top:20px}.review-dialog-actions button{min-height:44px;padding:10px 16px;border:1px solid #43617b;border-radius:6px;background:#14263a;color:#d9edff;cursor:pointer}.review-dialog-actions .review-confirm{background:#9eeaff;border-color:#9eeaff;color:#05131e}
.quality-page{width:min(1640px,calc(100% - 64px));margin:0 auto;padding:36px 0 72px;min-width:0}
.quality-hero{display:flex;align-items:center;justify-content:space-between;gap:32px;padding:clamp(24px,3vw,48px);margin-bottom:28px;border:1px solid #2c4358;border-radius:10px;background:linear-gradient(90deg,#09131ff2,#09131fb0),url('/brand/orbital/orbital-earth.webp') right center/cover}
.quality-hero h1{font-size:clamp(30px,3vw,48px);line-height:1.15;margin:12px 0 16px}.quality-hero>div>p:last-child{color:#bacce0;max-width:72ch;margin:0}
.hero-score{display:grid;text-align:right;flex:none}.hero-score strong{font-size:48px;line-height:1.15;color:#9eeaff}.hero-score span{color:#a1b5cc}.eyebrow{margin:0 0 8px;font:11px/1.5 Consolas,monospace;letter-spacing:.14em;color:#85dff1;text-transform:uppercase}
.feedback,.loading-panel,.queue-empty{margin:20px 0;padding:18px 20px;border:1px solid #314d63;border-radius:8px;background:#102233;color:#c6e6f6}.feedback.error{border-color:#885967;background:#241824;color:#ffb6c1}
.score-grid,.audit-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:0 0 24px}
.score-card{display:grid;gap:6px;min-width:0;text-align:left;padding:22px;border:1px solid #2c4358;border-radius:8px;background:#0e1b2b;color:#edf4ff;cursor:pointer}.score-card:hover{border-color:#64def5;background:#12263a}.score-card strong{font-size:34px;line-height:1.2;font-weight:600}.score-card span{font-size:15px}.score-card small{color:#a1b5cc;font-size:13px}.score-card.critical strong{color:#ffb1be}.score-card.rework strong{color:#edcb98}.score-card.ok strong{color:#97e4ce}
.audit-card,.queue-panel{min-width:0;border:1px solid #2c4358;border-radius:8px;background:#0c1726;padding:22px}.audit-card h2{font-size:18px;line-height:1.35;margin:8px 0 20px}.metric-row{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-top:1px solid #203247;color:#b3c5d8;font-size:14px}.metric-row strong{color:#edf4ff;font-variant-numeric:tabular-nums}.danger-line strong{color:#ffb1be}
.queue-heading{display:flex;align-items:center;justify-content:space-between;gap:20px}.queue-heading h2{margin:6px 0;font-size:26px}.recent-toggle.active{background:#173a50;border-color:#64def5;color:#b2efff}
.filters{display:grid;grid-template-columns:minmax(200px,1.5fr) repeat(3,minmax(145px,1fr)) auto;gap:12px;align-items:end;margin:24px 0}.filters label{display:grid;min-width:0;gap:7px;color:#b9ccdf;font-size:13px}.filters input,.filters select{width:100%;min-width:0;min-height:46px;padding:11px 12px;border:1px solid #314d63;border-radius:6px;background:#08121e;color:#edf4ff}.filters input::placeholder{color:#92a8be}.clear{font-size:13px}
.quality-table-wrap{overflow:auto;border-top:1px solid #2c4358}.quality-table{width:100%;border-collapse:collapse;table-layout:fixed}.quality-table th{text-align:left;padding:16px 12px;color:#a1b5cc;font:11px/1.5 Consolas,monospace;letter-spacing:.08em;text-transform:uppercase}.quality-table th:first-child{width:30%}.quality-table th:nth-child(4){width:14%}.quality-table td{padding:20px 12px;border-top:1px solid #203247;vertical-align:top;overflow-wrap:anywhere;font-size:13px}.quality-table tbody tr:hover{background:#101f30}.entry-cell img{float:left;margin:0 12px 8px 0;width:56px;height:64px;object-fit:cover;border:1px solid #314d63;border-radius:5px;background:#08121e}.entry-copy{display:grid;gap:6px;min-width:0}.entry-copy strong{color:#edf4ff;font-size:15px}.entry-copy span,.entry-copy small{color:#a1b5cc;font-size:12px;line-height:1.45}
.issue-list{display:flex;flex-wrap:wrap;gap:6px}.issue-chip{padding:5px 8px;border:1px solid #314d63;border-radius:5px;font-size:12px;color:#bdd5e9}.issue-chip.critical{color:#ffb6c1;border-color:#805266;background:#271c2d}.issue-chip.warning{color:#edcb98;border-color:#67543c;background:#272321}.issue-chip.info{color:#a8ddf1}.clean-state{color:#97d9c7;font-size:13px}
.review-state{display:inline-block;padding:5px 8px;border:1px solid #314d63;border-radius:5px;font-size:12px;color:#c2d8ec}.review-state.rework{color:#edcb98;border-color:#67543c}.review-state.approved{color:#97e4ce;border-color:#335f5b}.review-meta,.review-note{display:block;margin-top:9px;color:#a1b5cc;font-size:12px;line-height:1.5}.review-note{color:#dfc49f}.action-cell :is(a,button){margin:0 6px 6px 0;min-height:40px;padding:8px 10px;font-size:12px}.action-cell button.warn{color:#edcb98}.action-cell .ghost-action{color:#b3c5d8}
@media(max-width:1200px){.audit-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.filters{grid-template-columns:repeat(2,minmax(0,1fr))}.filters .clear{justify-self:start}.review-dialog{width:min(560px,calc(100vw - 32px));max-height:calc(100dvh - 32px);padding:28px;border:1px solid #43617b;border-radius:10px;background:#0c1726;color:#edf4ff;box-shadow:0 24px 80px #0008}.review-dialog::backdrop{background:#030811bf;backdrop-filter:blur(4px)}.review-dialog h2{font-size:26px;margin:8px 0}.review-dialog-target{color:#b9ccdf;overflow-wrap:anywhere}.review-dialog label{display:block;margin:24px 0 8px;color:#c6d9ea;font-size:14px}.review-dialog textarea{display:block;resize:vertical;width:100%;padding:12px;border:1px solid #43617b;border-radius:6px;background:#07111e;color:#edf4ff;font:inherit}.review-dialog-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px;margin-top:20px}.review-dialog-actions button{min-height:44px;padding:10px 16px;border:1px solid #43617b;border-radius:6px;background:#14263a;color:#d9edff;cursor:pointer}.review-dialog-actions .review-confirm{background:#9eeaff;border-color:#9eeaff;color:#05131e}
.quality-page{width:calc(100% - 40px)}}
@media(max-width:900px){.score-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.quality-topbar{position:static;flex-wrap:wrap}.quality-topbar nav{margin-left:auto}.quality-table,.quality-table tbody{display:block}.quality-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.quality-table tr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));padding:16px 0;border-bottom:1px solid #314d63}.quality-table td{display:block;padding:10px 8px;border:0}.quality-table td::before{content:attr(data-label);display:block;margin-bottom:8px;color:#a1b5cc;font:11px/1.5 Consolas,monospace;text-transform:uppercase;letter-spacing:.08em}.quality-table .entry-cell,.quality-table .action-cell{grid-column:1/-1}.quality-table .entry-cell::before{display:none}.quality-table .action-cell :is(a,button){min-height:44px}.entry-cell img{width:64px;height:76px}.entry-copy strong{font-size:17px}}
@media(max-width:600px){.review-dialog{width:min(560px,calc(100vw - 32px));max-height:calc(100dvh - 32px);padding:28px;border:1px solid #43617b;border-radius:10px;background:#0c1726;color:#edf4ff;box-shadow:0 24px 80px #0008}.review-dialog::backdrop{background:#030811bf;backdrop-filter:blur(4px)}.review-dialog h2{font-size:26px;margin:8px 0}.review-dialog-target{color:#b9ccdf;overflow-wrap:anywhere}.review-dialog label{display:block;margin:24px 0 8px;color:#c6d9ea;font-size:14px}.review-dialog textarea{display:block;resize:vertical;width:100%;padding:12px;border:1px solid #43617b;border-radius:6px;background:#07111e;color:#edf4ff;font:inherit}.review-dialog-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px;margin-top:20px}.review-dialog-actions button{min-height:44px;padding:10px 16px;border:1px solid #43617b;border-radius:6px;background:#14263a;color:#d9edff;cursor:pointer}.review-dialog-actions .review-confirm{background:#9eeaff;border-color:#9eeaff;color:#05131e}
.quality-page{width:calc(100% - 24px);padding-top:20px}.quality-hero{padding:24px 20px;gap:16px;align-items:start}.hero-score{display:none}.score-grid,.audit-grid{gap:12px}.score-card{padding:16px}.audit-grid,.filters{grid-template-columns:1fr}.audit-card,.queue-panel{padding:18px}.queue-heading{align-items:stretch;flex-direction:column}.recent-toggle{justify-content:flex-start}.filters .clear{justify-self:stretch}.quality-table tr{grid-template-columns:1fr}.quality-table td{padding:10px 0}.quality-topbar nav{margin-left:0}.quality-topbar nav :is(a,button){padding:9px 12px;font-size:13px}}
</style>
