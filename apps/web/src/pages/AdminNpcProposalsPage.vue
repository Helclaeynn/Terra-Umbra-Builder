<script setup lang="ts">
// PNJ proposés par les joueurs depuis le Builder (contacts). Un administrateur
// relit la fiche, puis l'ouvre dans l'éditeur pour la publier au Compendium,
// ou la refuse avec une raison que le joueur voit sur sa fiche.
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import TerraUmbraBrand from "../components/TerraUmbraBrand.vue";
import CampaignNpcSheet from "../components/CampaignNpcSheet.vue";
import { ApiError, api } from "../lib/api";
import { usePageTitle } from "../lib/page-title";
import type { NpcCatalog, NpcData } from "../../../api/src/campaign-npc-model";

type Status = "pending" | "approved" | "rejected";
type Proposal = {
  proposalId: string; title: string; tierLabel: string; role: string; status: Status; articleId: string | null;
  published: boolean; reviewNote: string; createdAt: string; reviewedAt: string | null;
  npc: NpcData; proposerName: string | null; characterName: string | null;
};

usePageTitle(() => "PNJ proposés");
const status = ref<Status>("pending");
const proposals = ref<Proposal[]>([]);
const catalog = ref<NpcCatalog | null>(null);
const loading = ref(true);
const error = ref("");
const notice = ref("");
const busyId = ref("");
const notes = ref<Record<string, string>>({});
const openId = ref("");

const labels: Record<Status, string> = { pending: "En attente", approved: "Validés", rejected: "Refusés" };
const empty = computed(() => !loading.value && !proposals.value.length);
const date = (value: string | null) => value ? new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

function humanError(cause: unknown) {
  if (cause instanceof ApiError && cause.status === 403) return "Cet écran est réservé aux administrateurs.";
  if (cause instanceof ApiError && cause.message === "npc_proposal_not_pending") return "Cette proposition a déjà été traitée.";
  return "Une erreur est survenue. Réessaie.";
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const [list, npcCatalog] = await Promise.all([
      api<{ proposals: Proposal[] }>(`/api/admin/npc-proposals?status=${status.value}`),
      catalog.value ? Promise.resolve(catalog.value) : api<NpcCatalog>("/api/npc-proposals/catalog")
    ]);
    proposals.value = list.proposals;
    catalog.value = npcCatalog;
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    loading.value = false;
  }
}

function show(next: Status) {
  status.value = next;
  openId.value = "";
  void load();
}

async function reject(item: Proposal) {
  const note = (notes.value[item.proposalId] ?? "").trim();
  if (!note) { error.value = "Écris la raison du refus : le joueur la verra sur sa fiche."; return; }
  busyId.value = item.proposalId;
  error.value = "";
  try {
    await api(`/api/admin/npc-proposals/${item.proposalId}/reject`, { method: "POST", body: JSON.stringify({ note }) });
    notice.value = `« ${item.title} » refusé. Le joueur voit la raison et peut choisir un autre contact.`;
    await load();
  } catch (cause) {
    error.value = humanError(cause);
  } finally {
    busyId.value = "";
  }
}

onMounted(load);
</script>

<template>
  <div class="proposals-shell">
    <header class="proposals-topbar">
      <RouterLink to="/" class="brand-link"><TerraUmbraBrand /></RouterLink>
      <nav aria-label="Administration">
        <RouterLink to="/account">Mon espace</RouterLink>
        <RouterLink to="/admin/quality">Contrôle qualité</RouterLink>
        <button type="button" :disabled="loading" @click="load">{{ loading ? "Actualisation…" : "Actualiser" }}</button>
      </nav>
    </header>

    <main class="proposals-page">
      <p class="eyebrow">ADMINISTRATION</p>
      <h1>PNJ proposés par les joueurs</h1>
      <p class="intro">Les joueurs créent ici leurs contacts depuis le Builder, avec les règles de création des PNJ. Relis la fiche : « Ouvrir dans l’éditeur » en fait un brouillon de page au Compendium, que tu publies après relecture. Un refus demande une raison, montrée au joueur.</p>

      <div class="tabs" role="tablist" aria-label="Statut des propositions">
        <button v-for="(label, key) in labels" :key="key" type="button" role="tab" :aria-selected="status === key" :class="{ active: status === key }" @click="show(key)">{{ label }}</button>
      </div>

      <p v-if="notice" class="notice" role="status">{{ notice }}</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="loading" role="status">Chargement…</p>
      <p v-else-if="empty" class="muted">Aucune proposition {{ labels[status].toLowerCase() }}.</p>

      <article v-for="item in proposals" :key="item.proposalId" class="proposal">
        <div class="proposal-head">
          <div>
            <h2>{{ item.title }}</h2>
            <p class="muted">{{ item.tierLabel }}<template v-if="item.role"> · {{ item.role }}</template></p>
            <p class="muted">Proposé par {{ item.proposerName || "un joueur" }}<template v-if="item.characterName"> pour {{ item.characterName }}</template> · {{ date(item.createdAt) }}</p>
            <p v-if="item.status === 'approved'" class="muted">
              <template v-if="item.published">Publié au Compendium.</template>
              <template v-else>Brouillon créé, pas encore publié.</template>
              <RouterLink v-if="item.articleId" :to="`/compendium/edit/${encodeURIComponent(item.articleId)}`">Ouvrir la page</RouterLink>
            </p>
            <p v-if="item.status === 'rejected'" class="muted">Refusé le {{ date(item.reviewedAt) }} : {{ item.reviewNote }}</p>
          </div>
          <button type="button" class="ghost" :aria-expanded="openId === item.proposalId" @click="openId = openId === item.proposalId ? '' : item.proposalId">
            {{ openId === item.proposalId ? "Replier la fiche" : "Voir la fiche" }}
          </button>
        </div>

        <CampaignNpcSheet v-if="openId === item.proposalId && catalog" :data="item.npc" :catalog="catalog" />

        <div v-if="item.status === 'pending'" class="proposal-actions">
          <RouterLink class="primary" :to="`/compendium/new?category=Personnages&proposal=${item.proposalId}`">Ouvrir dans l’éditeur</RouterLink>
          <label>Raison du refus (vue par le joueur)
            <input v-model="notes[item.proposalId]" type="text" maxlength="1000" placeholder="Ex. : trop puissant pour un contact, nom déjà pris…" />
          </label>
          <button type="button" class="danger" :disabled="busyId === item.proposalId" @click="reject(item)">Refuser</button>
        </div>
      </article>
    </main>
  </div>
</template>

<style scoped>
.proposals-shell{min-height:100vh;background:#07111c;color:var(--c-text);font-family:var(--font-text)}
.proposals-topbar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid #22384c}
.proposals-topbar nav{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.proposals-topbar a,.proposal a{color:var(--c-reality-soft)}
.proposals-page{max-width:1100px;margin:0 auto;padding:24px 16px 60px;display:grid;gap:16px}
.eyebrow{margin:0;color:#77e3da;font-size:12px;letter-spacing:.08em}
h1{margin:0;font-size:28px}
.intro,.muted{color:var(--c-text-soft);line-height:1.6;margin:0}
.tabs{display:flex;flex-wrap:wrap;gap:8px}
button,.primary{min-height:44px;padding:9px 14px;border:1px solid var(--c-line-strong);border-radius:6px;background:#13283b;color:var(--c-text);font:inherit;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}
.tabs .active,.primary{background:var(--c-reality-soft);color:var(--c-night);border-color:var(--c-reality-soft)}
.danger{border-color:#e07a7a;color:#ffd6d6;background:#2a1418}
button:disabled{opacity:.5;cursor:default}
.notice{color:#9ff0c8}.error{color:#ffb4b4}
.proposal{display:grid;gap:14px;padding:16px;border:1px solid var(--c-line);border-radius:8px;background:#0e1b2d}
.proposal-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:flex-start}
.proposal h2{margin:0 0 4px;font-size:20px}
.proposal-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}
.proposal-actions label{display:grid;gap:6px;flex:1 1 280px;color:#c3d2e4;font-size:14px}
.proposal-actions input{min-height:44px;padding:10px;border:1px solid var(--c-line-strong);border-radius:6px;background:var(--c-night);color:var(--c-text);font:inherit}
:focus-visible{outline:2px solid var(--c-reality-soft);outline-offset:3px}
</style>
