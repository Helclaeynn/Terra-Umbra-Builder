<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import TerraUmbraLockup from "../components/TerraUmbraLockup.vue";
import { ApiError, api } from "../lib/api";
import "../brand-signal.css";

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
    .filter((item) => !issue.value || item.issues.some((entry) => entry.code === issue.value))
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
      } else if (cause.message === "admin_required") {
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

async function setReview(item: QualityItem, status: ReviewStatus) {
  let note = item.reviewNote ?? "";
  if (status === "rework") {
    const answer = window.prompt(
      "Note de recette — indique ce qui doit être corrigé :",
      note
    );
    if (answer === null) return;
    note = answer.trim();
  } else if (status === "pending") {
    note = "";
  }

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

onMounted(load);
</script>

<template>
  <div class="quality-shell brand-signal">
    <header class="quality-topbar">
      <RouterLink to="/" class="brand-link">
        <TerraUmbraLockup compact />
      </RouterLink>
      <nav>
        <RouterLink to="/account">Compte</RouterLink>
        <RouterLink to="/compendium">Compendium</RouterLink>
        <button type="button" @click="load">Actualiser</button>
      </nav>
    </header>

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

      <p v-if="error" class="feedback error">{{ error }}</p>
      <p v-if="notice" class="feedback">{{ notice }}</p>
      <section v-if="loading" class="loading-panel">Analyse du corpus…</section>

      <template v-else-if="quality">
        <section class="score-grid">
          <button class="score-card critical" type="button" @click="issue = quality.summary.mjLeaks ? 'mj_leak' : ''">
            <span>Critiques</span><strong>{{ quality.summary.bySeverity.critical }}</strong><small>{{ quality.summary.mjLeaks }} fuite(s) MJ</small>
          </button>
          <button class="score-card" type="button" @click="review = 'pending'; recentOnly = false">
            <span>À recetter</span><strong>{{ quality.summary.pending }}</strong><small>{{ quality.summary.recentPending }} récent(s)</small>
          </button>
          <button class="score-card rework" type="button" @click="review = 'rework'; recentOnly = false">
            <span>À revoir</span><strong>{{ quality.summary.rework }}</strong><small>retours de recette</small>
          </button>
          <button class="score-card ok" type="button" @click="review = 'approved'; recentOnly = false">
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
            <button type="button" class="recent-toggle" :class="{ active: recentOnly }" @click="recentOnly = !recentOnly">
              Ajoutés récemment · non recettés
            </button>
          </div>

          <div class="filters">
            <input v-model="search" type="search" placeholder="Rechercher un titre, ID, source…" />
            <select v-model="category">
              <option value="">Toutes les catégories</option>
              <option v-for="value in categories" :key="value" :value="value">{{ value }}</option>
            </select>
            <select v-model="review">
              <option value="">Tous les états</option><option value="pending">À recetter</option><option value="rework">À revoir</option><option value="approved">Validés</option>
            </select>
            <select v-model="issue">
              <option value="">Tous les contrôles</option>
              <option v-for="value in issueOptions" :key="value.code" :value="value.code">{{ value.label }}</option>
            </select>
            <button type="button" class="clear" @click="search = ''; category = ''; review = ''; issue = ''; recentOnly = false">Réinitialiser</button>
          </div>

          <div class="quality-table-wrap">
            <table class="quality-table">
              <thead><tr><th>Entrée</th><th>Contrôles</th><th>Recette</th><th>Première détection</th><th>Actions</th></tr></thead>
              <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td class="entry-cell">
                    <img v-if="mediaUrl(item.media)" :src="mediaUrl(item.media)" :alt="item.title" loading="lazy" />
                    <div class="entry-copy"><strong>{{ item.title }}</strong><span>{{ item.category }} · {{ item.group || item.dataset || "—" }}</span><small>{{ item.id }}</small></div>
                  </td>
                  <td>
                    <div v-if="item.issues.length" class="issue-list">
                      <span v-for="entry in item.issues" :key="entry.code + entry.label" class="issue-chip" :class="entry.severity">{{ entry.label }}</span>
                    </div>
                    <span v-else class="clean-state">Aucune anomalie détectée</span>
                  </td>
                  <td>
                    <span class="review-state" :class="item.reviewStatus">{{ reviewLabel(item.reviewStatus) }}</span>
                    <small v-if="item.reviewerName" class="review-meta">{{ item.reviewerName }} · {{ formatDate(item.reviewedAt) }}</small>
                    <small v-if="item.reviewNote" class="review-note">{{ item.reviewNote }}</small>
                  </td>
                  <td>{{ formatDate(item.firstSeenAt) }}</td>
                  <td class="action-cell">
                    <a :href="'/compendium?article=' + encodeURIComponent(item.id)" target="_blank">Voir</a>
                    <a :href="'/compendium/edit/' + encodeURIComponent(item.id)" target="_blank">Éditer</a>
                    <button type="button" :disabled="busyId === item.id" @click="setReview(item, 'approved')">Valider</button>
                    <button type="button" class="warn" :disabled="busyId === item.id" @click="setReview(item, 'rework')">À revoir</button>
                    <button v-if="item.reviewStatus !== 'pending'" type="button" class="ghost-action" :disabled="busyId === item.id" @click="setReview(item, 'pending')">Repasser en recette</button>
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
.quality-shell{min-height:100vh;background:radial-gradient(circle at 80% 5%,rgba(43,146,255,.12),transparent 32rem),#071014;color:#d8e5e9}
.quality-topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.65rem 1.25rem;border-bottom:1px solid rgba(134,192,211,.12);background:rgba(7,16,20,.94);backdrop-filter:blur(16px)}
.brand-link{display:flex;max-width:260px;text-decoration:none}.quality-topbar nav{display:flex;align-items:center;gap:.55rem}.quality-topbar nav a,.quality-topbar nav button{border:1px solid rgba(128,181,199,.18);background:rgba(255,255,255,.025);color:#9cb7c1;padding:.5rem .7rem;text-decoration:none;font:inherit;cursor:pointer}
.quality-page{width:min(1580px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 6rem}.quality-hero{display:flex;align-items:end;justify-content:space-between;gap:2rem;padding:1.5rem 0 2rem;border-bottom:1px solid rgba(255,255,255,.08)}.quality-hero h1{font-size:clamp(2rem,4vw,4.2rem);margin:.2rem 0}.quality-hero>div>p:last-child{color:#7f9ba5;max-width:760px}.hero-score{display:grid;text-align:right}.hero-score strong{font-size:3rem;color:#b9e7ef}.hero-score span{font-size:.75rem;text-transform:uppercase;letter-spacing:.12em;color:#6f8e99}.eyebrow{font-size:.68rem;letter-spacing:.16em;color:#5aa9bd;text-transform:uppercase}
.feedback,.loading-panel{margin:1rem 0;padding:.8rem 1rem;border:1px solid rgba(78,177,200,.22);background:rgba(24,91,107,.1)}.feedback.error{border-color:rgba(211,89,75,.3);color:#e6a198}.score-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;margin:1.25rem 0}.score-card{display:grid;gap:.2rem;text-align:left;padding:1rem;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);color:#c7d9df;cursor:pointer}.score-card strong{font-size:2rem}.score-card span,.score-card small{color:#75939e}.score-card.critical strong{color:#e38479}.score-card.rework strong{color:#d5ae6d}.score-card.ok strong{color:#8cc69a}
.audit-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;margin:0 0 1.25rem}.audit-card,.queue-panel{border:1px solid rgba(255,255,255,.08);background:rgba(9,25,31,.86);padding:1rem}.audit-card h2{font-size:1rem;margin:.3rem 0 1rem}.metric-row{display:flex;justify-content:space-between;gap:1rem;padding:.42rem 0;border-top:1px solid rgba(255,255,255,.05);color:#809ba5}.metric-row strong{color:#d4e2e6}.danger-line strong{color:#e38479}
.queue-heading{display:flex;align-items:center;justify-content:space-between;gap:1rem}.queue-heading h2{margin:.2rem 0}.recent-toggle{padding:.55rem .75rem;border:1px solid rgba(79,175,197,.24);background:transparent;color:#8eabb5;cursor:pointer}.recent-toggle.active{background:rgba(43,146,255,.12);border-color:#3f9fba;color:#bee9f1}.filters{display:grid;grid-template-columns:minmax(240px,1.8fr) repeat(3,minmax(150px,.8fr)) auto;gap:.55rem;margin:1rem 0}.filters input,.filters select,.filters button{min-width:0;padding:.6rem .65rem;border:1px solid rgba(255,255,255,.09);background:#08171c;color:#bcd0d6}.filters button{cursor:pointer}
.quality-table-wrap{overflow:auto;border-top:1px solid rgba(255,255,255,.08)}.quality-table{width:100%;border-collapse:collapse;min-width:1160px}.quality-table th{text-align:left;padding:.7rem .55rem;color:#6f8b95;font-size:.66rem;letter-spacing:.09em;text-transform:uppercase}.quality-table td{padding:.65rem .55rem;border-top:1px solid rgba(255,255,255,.055);vertical-align:top}.entry-cell{display:flex;gap:.65rem;min-width:310px}.entry-cell img{width:56px;height:56px;object-fit:cover;border:1px solid rgba(255,255,255,.08);background:#0c1b20}.entry-copy{display:grid;gap:.08rem}.entry-copy strong{color:#dbe8eb}.entry-copy span{color:#78949e;font-size:.72rem}.entry-copy small{color:#4f6c76;font-size:.64rem}.issue-list{display:flex;flex-wrap:wrap;gap:.3rem;max-width:390px}.issue-chip{padding:.25rem .38rem;border:1px solid rgba(255,255,255,.1);font-size:.65rem;color:#91aab2}.issue-chip.critical{color:#e69b92;border-color:rgba(208,83,67,.32);background:rgba(208,83,67,.08)}.issue-chip.warning{color:#d8bc83;border-color:rgba(205,154,76,.28);background:rgba(205,154,76,.07)}.issue-chip.info{color:#8bbbc7}.clean-state{color:#6f9b78;font-size:.7rem}.review-state{display:inline-block;padding:.25rem .4rem;border:1px solid rgba(255,255,255,.09);font-size:.65rem}.review-state.pending{color:#9bb4bd}.review-state.rework{color:#d8bc83}.review-state.approved{color:#8fc59b}.review-meta,.review-note{display:block;margin-top:.35rem;max-width:260px;color:#637f89;font-size:.63rem}.review-note{color:#9b8c72}.action-cell{display:flex;flex-wrap:wrap;gap:.3rem;max-width:270px}.action-cell a,.action-cell button{padding:.35rem .45rem;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.02);color:#a7c2ca;text-decoration:none;font:inherit;font-size:.67rem;cursor:pointer}.action-cell button.warn{color:#d8bc83}.action-cell .ghost-action{color:#6f8b95}
@media (max-width:1100px){.score-grid,.audit-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.filters{grid-template-columns:1fr 1fr}.quality-hero{align-items:start}.hero-score{display:none}}
@media (max-width:680px){.quality-page{width:min(100% - 1rem,1580px)}.quality-topbar{align-items:flex-start}.quality-topbar nav{flex-wrap:wrap;justify-content:flex-end}.score-grid,.audit-grid,.filters{grid-template-columns:1fr}.queue-heading{align-items:flex-start;flex-direction:column}}
</style>
