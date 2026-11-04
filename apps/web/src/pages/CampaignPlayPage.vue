<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useLiveUpdates } from "../lib/live-updates";
import { RouterLink, useRoute } from "vue-router";
import { api, ApiError } from "../lib/api";
import { usePageTitle } from "../lib/page-title";
import { prepareNpcPortrait } from "../lib/npc-portrait";
import PortraitZoom from "../components/PortraitZoom.vue";
import CampaignLiveSessions from "../components/CampaignLiveSessions.vue";
import CampaignRewards from "../components/CampaignRewards.vue";
import CampaignEffects from "../components/CampaignEffects.vue";
import CampaignOccultResolutions from "../components/CampaignOccultResolutions.vue";
import CampaignLightningEffects from "../components/CampaignLightningEffects.vue";
import CampaignOccultConsent from "../components/CampaignOccultConsent.vue";
import CampaignTargetedPowers from "../components/CampaignTargetedPowers.vue";
import CampaignCombat from "../components/CampaignCombat.vue";
import CampaignCharacterPlay from "../components/CampaignCharacterPlay.vue";
import CampaignNpcPreview from "../components/CampaignNpcPreview.vue";
import CampaignCreaturePreview from "../components/CampaignCreaturePreview.vue";
const route = useRoute(),
  id = String(route.params.id),
  endpoint = `/api/campaigns/${id}/play`;
const room = ref<any>(null),
  error = ref(""),
  actionError = ref(""),
  busy = ref(false),
  notice = ref(""),
  selected = ref(
    typeof route.query.actor === "string" ? route.query.actor : ""
  ),
  filter = ref("all");
const feedCollapsed = ref(false),
  gmToolsOpen = ref(false),
  edgeRequest = ref<any>(null),
  unreadEvents = ref(0),
  occultAttention = ref(0);
let feedSeen = new Set<string>(),
  feedInitialized = false,
  feedSession: string | null = null;
function toggleFeed() {
  feedCollapsed.value = !feedCollapsed.value;
  if (!feedCollapsed.value) unreadEvents.value = 0;
}
function openRevelations() {
  filter.value = "messages";
  feedCollapsed.value = false;
  unreadEvents.value = 0;
}
function toggleGmTools() {
  void openPanel("gm");
  gmToolsOpen.value = true;
}
async function forceFeed(eventId: string) {
  if (busy.value || !room.value?.ownCharacterId) return;
  busy.value = true;
  actionError.value = "";
  try {
    const path = `/api/characters/${room.value.ownCharacterId}/play`;
    if (!edgeRequest.value) {
      const p = await api<any>(path);
      edgeRequest.value = {
        requestId: crypto.randomUUID(),
        version: p.version,
        action: "edge-force",
        eventId
      };
    }
    await api(path, {
      method: "POST",
      body: JSON.stringify(edgeRequest.value)
    });
    edgeRequest.value = null;
    await load();
  } catch (e) {
    actionError.value =
      e instanceof ApiError && e.message === "insufficient_edge"
        ? "Tu n’as plus d’Edge."
        : e instanceof ApiError && e.message === "edge_roll_resolved"
          ? "Ce jet est déjà résolu."
          : "Dépense non confirmée. Réessaie le même jet.";
    if (e instanceof ApiError && e.status < 500) edgeRequest.value = null;
  } finally {
    busy.value = false;
  }
}
async function rollOwnInitiative() {
  if (busy.value || !room.value?.ownCharacterId) return;
  busy.value = true;
  actionError.value = "";
  try {
    const path = `/api/characters/${room.value.ownCharacterId}/play`,
      p = await api<any>(path);
    await api(path, {
      method: "POST",
      body: JSON.stringify({
        requestId: crypto.randomUUID(),
        version: p.version,
        action: "initiative"
      })
    });
    await load();
  } catch (e) {
    actionError.value =
      e instanceof ApiError && e.message === "initiative_already_rolled"
        ? "Ton initiative est déjà lancée."
        : "Initiative non confirmée : actualise avant de réessayer.";
  } finally {
    busy.value = false;
  }
}
const ownActor = computed(() =>
  room.value?.characters.find((c: any) => c.id === room.value?.ownCharacterId)
);
const sideLabel = (side: string) =>
  ({ ally: "Allié", enemy: "Ennemi", neutral: "Neutre" })[side] ?? "Neutre";
const availableRolls = computed(
  () =>
    chosen.value?.rolls?.filter(
      (r: any) =>
        room.value?.combat?.active ||
        (!r.attack && !r.requiresWeapon && !r.defense)
    ) ?? []
);
const latest = computed(() =>
  room.value?.events?.find((e: any) => e.payload.dice)
);
const latestRevelation = computed(() =>
  room.value?.events?.find((e: any) => e.kind === "message")
);
const initiativeCount = computed(
  () =>
    roster.value.filter((c) => c.participating !== false && c.initiativePending)
      .length
);
const passOf = (actorId: string) =>
  room.value?.passes?.find((p: any) => p.id === actorId)?.pass ?? null;
const currentPass = computed(() => {
  if (!room.value?.combat?.active) return null;
  const passes = (room.value?.passes ?? [])
    .map((p: any) => p.pass)
    .filter((p: any) => p !== null);
  return passes.length ? Math.min(...passes) : null;
});
const hpRatio = (c: any) => Math.max(0, Math.min(1, c.hp / Math.max(1, c.pvMax)));
const hpLevel = (c: any) =>
  c.hp <= 0 ? "down" : hpRatio(c) > 0.5 ? "ok" : hpRatio(c) > 0.25 ? "low" : "critical";
const paSlots = (c: any) => Math.min(6, Math.max(c.pa ?? 0, c.paPerRound ?? 0));
function passHeading(index: number) {
  if (!room.value?.combat?.active) return "";
  const pass = passOf(roster.value[index].id);
  if (index && pass === passOf(roster.value[index - 1].id)) return "";
  return pass === null ? "Sans action disponible" : `Passe ${pass}`;
}
const text = ref(""),
  link = ref(""),
  image = ref(""),
  imageBusy = ref(false),
  // Révélation à un seul joueur (id du personnage), ou au groupe si vide.
  recipient = ref(""),
  noteText = ref(""),
  noteBusy = ref(false),
  noteNotice = ref("");
// Note privée d'un joueur au MJ (lue par le MJ et par lui seul).
async function sendNote() {
  if (noteBusy.value || !noteText.value.trim()) return;
  noteBusy.value = true;
  noteNotice.value = "";
  try {
    await api(`/api/campaigns/${id}/play/notes`, {
      method: "POST",
      body: JSON.stringify({ requestId: crypto.randomUUID(), text: noteText.value })
    });
    noteText.value = "";
    noteNotice.value = "Note envoyée au MJ.";
    void load();
  } catch {
    noteNotice.value = "La note n’a pas pu être envoyée : réessaie.";
  } finally {
    noteBusy.value = false;
  }
}
const sourceCatalog = ref("compendium"),
  globalSources = ref<any[]>([]);
const sourceKind = ref("npc"),
  sourceQuery = ref(""),
  sources = ref<any[]>([]),
  sourceId = ref(""),
  sourceName = ref(""),
  hasMore = ref(false),
  sourceLoading = ref(false);
const adjustAmount = ref(1);
const graceHp = ref(1),
  graceReason = ref("Annulation d’une mort pendant un test");
const actorName = ref(""),
  actorPa = ref(0),
  actorVisible = ref(false),
  actorDirty = ref(false),
  amount = ref(1);
const gmMode = ref("explosive"),
  gmFaces = ref(20),
  gmCount = ref(1);
const gmLabel = ref("Jet libre"),
  gmBonus = ref(0),
  gmStress = ref(0),
  gmPublic = ref(true);
const combatPanel = ref<InstanceType<typeof CampaignCombat> | null>(null);
const panel = ref<HTMLDialogElement | null>(null),
  panelMode = ref("character"),
  characterTab = ref("jets"),
  combatAttention = ref(0),
  supportAttention = ref(0),
  preparedActor = ref("");
const sceneImage = computed(() =>
  room.value?.events?.find((e: any) => e.kind === "message" && e.image)
);
const panelTitle = computed(() =>
  panelMode.value === "character" &&
  !room.value?.canManage &&
  chosen.value?.id !== room.value?.ownCharacterId
    ? "Participant"
    : panelMode.value === "character" && chosen.value && chosen.value.kind !== "character"
      ? chosen.value.kind === "npc" ? "Fiche du PNJ" : "Fiche de la créature"
    : panelMode.value === "gm"
      ? "Mener la partie"
      : panelMode.value === "attack"
        ? "Attaquer"
        : panelMode.value === "response"
          ? "Répondre à une attaque"
          : ({
              jets: "Lancer un jet",
              truth: "Utiliser une capacité",
              equipment: "Mon sac",
              states: "État & soins",
              rules: "Mes règles",
              rest: "Se reposer",
              history: "Historique"
            }[characterTab.value] ?? "Personnage")
);
async function openPanel(mode: string, tabKey = "jets") {
  panelMode.value = mode;
  characterTab.value = tabKey;
  if (mode === "character" && !selected.value)
    selected.value = room.value?.ownCharacterId ?? "";
  await nextTick();
  if (panel.value && !panel.value.open) {
    panelOpener = document.activeElement as HTMLElement | null;
    panel.value.show();
    panelOpen.value = true;
  }
}
let panelOpener: HTMLElement | null = null;
const panelOpen = ref(false);
function onPanelClosed() {
  panelOpen.value = false;
  if (panelOpener?.isConnected) panelOpener.focus();
  panelOpener = null;
}
const announcement = ref("");
const shortcutsOpen = ref(false);
// Clavier : Échap ferme le tiroir (non modal) ; raccourcis hors des champs de saisie.
function onEscape(e: KeyboardEvent) {
  if (e.key === "Escape") {
    if (shortcutsOpen.value) shortcutsOpen.value = false;
    else if (panel.value?.open && !document.querySelector(".portrait-zoom[open]")) closePanel();
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey || !room.value) return;
  const t = e.target as HTMLElement | null;
  if (t?.closest?.("input,textarea,select,[contenteditable=true]")) return;
  const r = room.value,
    k = e.key;
  const focusDock = (sel: string) => {
    const el = document.querySelector<HTMLElement>(".gm-dock " + sel);
    if (el) {
      e.preventDefault();
      el.focus();
    }
  };
  if (k === "?") {
    e.preventDefault();
    shortcutsOpen.value = !shortcutsOpen.value;
  } else if (/^[1-9]$/.test(k) && r.canManage) {
    const c = roster.value[Number(k) - 1];
    if (c) {
      e.preventDefault();
      selected.value = c.id;
      announcement.value = `Cible : ${c.name}`;
    }
  } else if (k === "j" || k === "J") {
    e.preventDefault();
    if (r.ownCharacterId) ownPanel("jets");
    else if (r.canManage && chosen.value) inspectActor(chosen.value.id);
  } else if ((k === "r" || k === "R") && r.canManage) focusDock("textarea");
  else if ((k === "d" || k === "D") && r.canManage) focusDock(".dock-hp input");
  else if (k === "N" && e.shiftKey && r.canManage && r.combat?.active && !busy.value) {
    e.preventDefault();
    void act("combat-round", { version: r.combat.version });
  }
}
// Annonce aux lecteurs d'écran les nouveautés du journal autres que les jets (déjà annoncés).
watch(
  () => room.value?.events?.[0]?.id,
  (now, before) => {
    const e = room.value?.events?.[0];
    if (before && now && e && !e.payload.dice)
      announcement.value = `${e.characterName ?? e.payload.characterName ?? "MJ"} : ${e.payload.label ?? "nouveau message"}`;
  }
);
onMounted(() => window.addEventListener("keydown", onEscape));
onUnmounted(() => window.removeEventListener("keydown", onEscape));
function inspectActor(actorId: string) {
  selected.value = actorId;
  void openPanel("character", "jets");
}
function ownPanel(tabKey: string) {
  if (room.value?.ownCharacterId) selected.value = room.value.ownCharacterId;
  void openPanel("character", tabKey);
}
async function openAttack() {
  await openPanel("attack");
  const actor = room.value?.canManage
    ? chosen.value?.id
    : room.value?.ownCharacterId;
  if (actor && actor !== preparedActor.value) {
    await combatPanel.value?.prepareAttack(actor);
    preparedActor.value = actor;
  }
}
function closePanel() {
  panel.value?.close();
}
watch(
  () => room.value?.combat?.active,
  (active) => {
    if (!active) {
      combatAttention.value = 0;
      if (["attack", "response"].includes(panelMode.value)) closePanel();
    }
  }
);

function participantRoll() {
  if (rollOption.value?.attack || rollOption.value?.requiresWeapon) {
    void openPanel("attack").then(() =>
      combatPanel.value?.prepareAttack(chosen.value.id, rollId.value)
    );
    return;
  }
  actorAction("roll", {
    rollId: rollId.value,
    label: rollLabel.value,
    bonus: rollBonus.value,
    stress: rollStress.value,
    public: rollPublic.value,
    paCost: room.value?.combat?.active ? rollPa.value : 0
  });
}
const rollId = ref(""),
  rollBonus = ref(0),
  rollStress = ref(0),
  rollPublic = ref(true),
  rollPa = ref(0),
  rollLabel = ref("");
const pending = ref<any>(null);
let alive = true,
  loading = false,
  timer: ReturnType<typeof setInterval> | undefined,
  sourceGeneration = 0;
usePageTitle(() =>
  room.value ? `${room.value.campaignName} — En jeu` : "En jeu · Campagne"
);
const roster = computed(() => {
  const all = [
    ...(room.value?.characters ?? []),
    ...(room.value?.combatants ?? [])
  ];
  const ranks = new Map(
    (room.value?.order ?? []).map((key: string, i: number) => [key, i])
  );
  return all.sort(
    (a, b) => Number(ranks.get(a.id) ?? 999) - Number(ranks.get(b.id) ?? 999)
  );
});
const chosen = computed(() =>
  roster.value.find((c) => c.id === selected.value)
);
watch(availableRolls, (rows) => {
  if (!rows.some((r: any) => r.id === rollId.value))
    rollId.value = rows[0]?.id ?? "";
});
const rollOption = computed(() =>
  chosen.value?.rolls?.find((r: any) => r.id === rollId.value)
);
watch(
  () => chosen.value?.id,
  () => {
    rollId.value = chosen.value?.rolls?.[0]?.id ?? "";
    rollBonus.value = 0;
    rollStress.value = 0;
  }
);
watch(rollOption, (r, old) => {
  if (r?.id !== old?.id) {
    rollLabel.value = r?.label ?? "";
    rollPa.value = r?.attack ? 1 : 0;
  }
});
const feed = computed(() =>
  (room.value?.events ?? []).filter(
    (e: any) =>
      filter.value === "all" ||
      (filter.value === "rolls"
        ? Array.isArray(e.payload.dice)
        : e.kind === "message")
  )
);
async function load() {
  if (!alive || loading || document.visibilityState === "hidden") return;
  loading = true;
  try {
    const r = await api<any>(endpoint);
    if (!alive) return;
    const session = r.session?.id ?? null;
    if (feedSession !== session) {
      feedSeen = new Set();
      feedInitialized = false;
      unreadEvents.value = 0;
      feedSession = session;
    }
    const received = (r.events ?? []).map((e: any) => e.id);
    if (feedInitialized && feedCollapsed.value)
      unreadEvents.value += received.filter(
        (key: string) => !feedSeen.has(key)
      ).length;
    if (!feedCollapsed.value) unreadEvents.value = 0;
    received.forEach((key: string) => feedSeen.add(key));
    feedInitialized = true;
    room.value = r;
    error.value = "";
    if (!selected.value) selected.value = r.ownCharacterId ?? "";
    if (selected.value && !roster.value.some((c) => c.id === selected.value))
      selected.value = r.ownCharacterId ?? "";
  } catch {
    if (alive) {
      room.value = null;
      error.value =
        "La campagne est inaccessible. Vérifie ta connexion et ton invitation.";
    }
  } finally {
    loading = false;
  }
}
watch(
  () => ({ id: chosen.value?.id, version: chosen.value?.version }),
  (next, previous) => {
    if (next.id !== previous?.id) actorDirty.value = false;
    if (chosen.value && !actorDirty.value) {
      actorName.value = chosen.value.name;
      actorPa.value = chosen.value.pa ?? 0;
      actorVisible.value = chosen.value.visible ?? false;
    }
  }
);
async function act(action: string, extra: Record<string, unknown> = {}) {
  if (busy.value || (!room.value?.canManage && action !== "spend")) return;
  if (pending.value) {
    actionError.value =
      "Réessaie l’action non confirmée avant une autre modification.";
    return;
  }
  pending.value = { requestId: crypto.randomUUID(), action, ...extra };
  await sendPending();
}
async function sendPending() {
  if (busy.value || !pending.value) return;
  busy.value = true;
  actionError.value = "";
  notice.value = "";
  try {
    const action = pending.value.action;
    await api(
      ["spend", "grace", "adjust"].includes(action)
        ? `/api/campaigns/${id}/combat`
        : endpoint + "/actions",
      { method: "POST", body: JSON.stringify(pending.value) }
    );
    pending.value = null;
    if (!alive) return;
    if (action === "message") {
      text.value = "";
      link.value = "";
      image.value = "";
    }
    actorDirty.value = false;
    notice.value = action === "message" ? "Révélation envoyée." : action === "withdraw" ? "Révélation retirée." : "Action enregistrée.";
    setTimeout(() => { if (alive) notice.value = ""; }, 4000);
    await load();
  } catch (e) {
    if (alive) {
      actionError.value =
        e instanceof ApiError && e.status === 409
          ? "Une autre fenêtre a modifié cet état. Les valeurs ont été actualisées."
          : e instanceof ApiError && e.message === "finish_combat_first"
            ? "Termine le combat et résous les attaques en attente avant de changer de scène ou de scénario."
            : e instanceof ApiError && e.message === "pending_attacks"
              ? "Résous ou annule les attaques en attente avant de changer de round ou de terminer le combat."
              : e instanceof ApiError && e.message === "campaign_combat_mj_only"
                ? "Le MJ contrôle les rounds du groupe."
                : e instanceof ApiError && e.message === "initiatives_pending"
                  ? "Il reste des initiatives à lancer. Lance-les ou sors les participants absents des tours."
                  : e instanceof ApiError && e.message === "participant_out"
                    ? "Ce participant est hors des tours. Le MJ peut le réintégrer."
                    : e instanceof ApiError &&
                        e.message === "combat_not_started"
                      ? "Lance l’initiative de ce participant pour commencer son combat."
                      : e instanceof ApiError && e.message === "insufficient_pa"
                        ? "Ce participant n’a pas assez de PA."
                        : e instanceof ApiError &&
                            ["character_dead", "character_agonizing"].includes(
                              e.message
                            )
                          ? "L’état du participant empêche ce jet."
                          : "La modification n’a pas été confirmée. Réessaie.";
      if (e instanceof ApiError && e.status < 500) {
        pending.value = null;
        actorDirty.value = false;
        await load();
      }
    }
  } finally {
    busy.value = false;
  }
}
function actorAction(action: string, extra: Record<string, unknown> = {}) {
  if (chosen.value)
    void act(action, {
      combatantId: chosen.value.id,
      version: chosen.value.version,
      ...extra
    });
}
async function upload(event: Event) {
  const input = event.target as HTMLInputElement,
    file = input.files?.[0];
  if (!file) return;
  imageBusy.value = true;
  try {
    image.value = await prepareNpcPortrait(file, 1600);
    actionError.value = "";
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : "Image illisible.";
  } finally {
    imageBusy.value = false;
    input.value = "";
  }
}
async function findSources(more = false) {
  if (sourceLoading.value) return;
  const generation = ++sourceGeneration;
  sourceLoading.value = true;
  try {
    if (sourceCatalog.value === "compendium") {
      if (!globalSources.value.length) {
        const r = await api<any>(endpoint + "/catalog");
        globalSources.value = r.entries;
      }
      if (!alive || generation !== sourceGeneration) return;
      sources.value = globalSources.value.filter(
        (s) =>
          s.kind === sourceKind.value &&
          s.name
            .toLocaleLowerCase()
            .includes(sourceQuery.value.toLocaleLowerCase())
      );
      hasMore.value = false;
      sourceId.value = "";
      sourceName.value = "";
      return;
    }
    const kind = sourceKind.value,
      r = await api<any>(
        `/api/campaigns/${id}/${kind === "npc" ? "npcs" : "bestiary"}?q=${encodeURIComponent(sourceQuery.value)}&offset=${more ? sources.value.length : 0}`
      );
    if (!alive || generation !== sourceGeneration) return;
    sources.value = more
      ? [...sources.value, ...(r.npcs ?? r.creatures)]
      : (r.npcs ?? r.creatures);
    hasMore.value = r.hasMore;
    if (!more) {
      sourceId.value = "";
      sourceName.value = "";
    }
  } catch {
    actionError.value = "Impossible de charger le catalogue de la campagne.";
  } finally {
    sourceLoading.value = false;
    if (alive && generation !== sourceGeneration) void findSources();
  }
}
watch([sourceKind, sourceCatalog], () => {
  ++sourceGeneration;
  sources.value = [];
  sourceId.value = "";
  sourceName.value = "";
  hasMore.value = false;
  void findSources();
});
watch(sourceId, () => {
  sourceName.value =
    sources.value.find((s) => s.id === sourceId.value)?.name ?? "";
});
const date = (v: string) =>
  new Date(v).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
function focus() {
  void load();
}
onMounted(() => {
  void load();
  window.addEventListener("focus", focus);
  document.addEventListener("visibilitychange", focus);
});
// Temps réel : rechargé dès qu'une action a lieu à la table (3 s seulement sans flux).
useLiveUpdates(
  () => `/api/campaigns/${id}/events`,
  () => void load(),
  3000
);
onUnmounted(() => {
  alive = false;
  ++sourceGeneration;
  clearInterval(timer);
  window.removeEventListener("focus", focus);
  document.removeEventListener("visibilitychange", focus);
});
</script>
<template>
 <div class="live-page" :class="{'drawer-open':panelOpen}"><p class="sr-only" aria-live="polite">{{ announcement }}</p><header class="live-header"><div><p class="eyebrow">TERRA UMBRA · EN JEU</p><h1>{{ room?.campaignName??'Table de jeu' }}</h1></div><nav><RouterLink :to="`/campaigns/${id}`">← Campagne</RouterLink><RouterLink to="/account">Mon espace</RouterLink></nav></header>
 <div v-if="error" role="alert"><p>{{ error }}</p><RouterLink :to="`/account?redirect=${encodeURIComponent(route.fullPath)}`">Se connecter</RouterLink><button @click="load">Réessayer</button></div>
 <p v-else-if="!room" role="status">Ouverture de la table…</p>
 <div v-else class="live-layout">
  <aside class="initiative-rail" aria-label="Participants par initiative"><h2>Participants</h2><p>{{ room.combat?.active?`Round ${room.combat.round} · ordre par passe`:'Personnages présents à la table' }}</p>
   <ol><template v-for="(c,index) in roster" :key="c.id"><li v-if="passHeading(index)" class="pass-divider" role="separator">{{ passHeading(index) }}</li><li :class="[{selected:c.id===selected,hiddenActor:c.visible===false,outOfTurns:c.participating===false,currentPass:currentPass!==null&&c.participating!==false&&passOf(c.id)===currentPass},`side-${c.side??'neutral'}`]"><PortraitZoom v-if="c.portrait" :src="c.portrait" :name="c.name" /><div><span v-if="room.combat?.active&&c.initiative!=null" class="init-badge" :aria-label="`Initiative ${c.initiative}`">{{ c.initiative }}</span><span v-if="currentPass!==null&&c.participating!==false&&passOf(c.id)===currentPass" class="turn-tag">À jouer</span><button v-if="room.canManage" type="button" class="card-pick" :aria-pressed="c.id===selected" :title="`Choisir ${c.name} comme cible`" @click="selected=c.id"><strong>{{ c.name }}</strong></button><strong v-else>{{ c.name }}</strong><small v-if="c.id===selected">{{ c.kind==='character'?[c.occupation,c.sphere].filter(Boolean).join(' · '):c.kind==='npc'?'PNJ':'Créature' }}</small><template v-if="c.hp!==undefined&&c.pvMax"><span class="hp-bar" role="meter" aria-valuemin="0" :aria-valuemax="c.pvMax" :aria-valuenow="c.hp" :aria-label="`Points de vie de ${c.name}`"><span :class="hpLevel(c)" :style="{width:hpRatio(c)*100+'%'}"></span></span><span class="hp-text">{{ c.hp }} / {{ c.pvMax }} PV · {{ c.health }}</span></template><span v-else class="health">{{ c.health }}</span><span v-if="room.combat?.active&&c.pa!==undefined&&paSlots(c)" class="pa-pips" role="img" :aria-label="`${c.pa} PA restants`"><i v-for="n in paSlots(c)" :key="n" :class="{spent:n>c.pa}"></i></span><span v-if="c.effects?.length" class="effect-chips"><span v-for="e in c.effects.slice(0,3)" :key="e.id" :title="e.name">{{ e.name }}</span><span v-if="c.effects.length>3" :title="c.effects.slice(3).map((e:any)=>e.name).join(', ')">+{{ c.effects.length-3 }}</span></span><small>{{sideLabel(c.side)}}<template v-if="c.participating===false"> · Hors des tours</template><template v-else-if="room.combat?.active&&c.initiativePending"> · Initiative à lancer</template></small><small v-if="c.visible===false">Caché aux joueurs</small></div><div class="rail-actions"><button @click="inspectActor(c.id)">{{room.canManage||c.id===room.ownCharacterId?'Actions':'Voir'}}</button><a v-if="room.canManage||c.id===room.ownCharacterId" :href="c.kind==='character'?`/characters/${c.id}/play?campaign=${id}`:`/campaigns/${id}/play?actor=${c.id}`" target="_blank" rel="noopener" :aria-label="`Ouvrir ${c.name} dans un nouvel onglet`">↗</a><button v-if="room.canManage&&room.combat?.active&&c.kind!=='character'&&c.initiativePending&&c.participating!==false" :disabled="busy" @click="act('initiative',{combatantId:c.id,version:c.version})">◈ Initiative</button><button v-if="room.combat?.active&&(room.canManage||c.id===room.ownCharacterId)&&(c.id===selected||c.id===room.ownCharacterId)&&c.participating!==false&&c.pa>0" :disabled="busy" @click="act('spend',{actorId:c.id})">Action hors attaque · 1 PA</button></div></li></template></ol><p v-if="!roster.length">Aucun participant visible.</p>

  </aside>
  <main class="live-main"><section class="mode-heading" aria-label="Situation de la table"><div><p class="mode-label">{{room.combat?.active?'Combat':'Exploration'}}<span v-if="room.session?.title"> · {{room.session.title}}</span></p><h2>{{room.combat?.active?'Round '+room.combat.round:'En jeu'}}</h2><p>{{room.combat?.active?(initiativeCount?initiativeCount+' initiative'+(initiativeCount>1?'s':'')+' à lancer':room.combat.mode==='automatic'?'Round suivant quand les PA sont épuisés':'Rounds dirigés par le MJ'):room.canManage?'Mener la scène : participants, révélations et jets':'Jets, ressources et capacités de ton personnage'}}</p></div><div v-if="room.canManage" class="table-primary-actions combat-controls"><button v-if="!room.combat?.active" class="ui-primary" :disabled="busy" @click="act('combat-start',{version:room.combat?.version??0})">Lancer le combat</button><template v-else><button class="ui-primary" :disabled="busy" @click="act('combat-round',{version:room.combat.version})">Round suivant pour tous</button><button class="ui-danger" :disabled="busy" @click="act('combat-stop',{version:room.combat.version})">Arrêter le combat</button></template><button :aria-expanded="gmToolsOpen" aria-controls="campaign-gm-tools" @click="toggleGmTools">Outils du MJ <span v-if="occultAttention" class="attention-badge">{{occultAttention}} à résoudre</span></button></div></section>
   <div v-if="room.combat?.active&&ownActor?.initiativePending&&ownActor?.participating!==false" class="combat-controls"><strong>À toi : lance ton initiative pour ce combat.</strong> <button class="ui-primary" :disabled="busy" @click="rollOwnInitiative">◈ Lancer mon initiative</button><button @click="selected=room.ownCharacterId">Ma fiche / dépenser de l’Edge</button></div>


   <section class="table-stage" aria-label="Scène de la campagne" :class="{'has-scene-image':sceneImage}">
    <img v-if="sceneImage" class="scene-art" :src="sceneImage.image" alt="Scène partagée par le MJ" />
    <div class="scene-caption"><span class="stage-kicker">{{room.combat?.active?'Combat en cours':'À la table'}}</span><h2>{{sceneImage?.payload.label??room.session?.title??'La scène'}}</h2><p v-if="latestRevelation?.payload.text">{{latestRevelation.payload.text}}</p><p v-else-if="!sceneImage">{{room.canManage?'Partage une scène, puis fais vivre la partie.':'La scène, les révélations et vos actions se retrouvent ici.'}}</p><button v-if="room.canManage&&!sceneImage" @click="toggleGmTools">Partager une scène</button></div>
    <button v-if="latest" class="stage-roll" @click="feedCollapsed=false"><span>{{latest.characterName??latest.payload.characterName??'MJ'}} · {{latest.payload.label}}</span><strong>{{latest.payload.total}}</strong><small>{{latest.payload.narrativeFailure?'Échec narratif':latest.payload.exploded?'Explosion !':'Voir le détail dans le journal'}}</small></button>
   </section>

   <section v-if="room.canManage" class="gm-dock" aria-label="Panneau du MJ">
    <div class="dock-block"><h3>Cible</h3><template v-if="chosen"><strong>{{ chosen.name }}</strong><span v-if="chosen.hp!==undefined&&chosen.pvMax">{{ chosen.hp }} / {{ chosen.pvMax }} PV<template v-if="room.combat?.active"> · {{ chosen.pa }} PA</template> · {{ chosen.health }}</span><span v-else>{{ chosen.health }}</span><span v-if="chosen.effects?.length" class="dock-effects">{{ chosen.effects.map((e:any)=>e.name).join(' · ') }}</span><div v-if="chosen.hp!==undefined&&chosen.pvMax" class="dock-row dock-hp"><input v-model.number="adjustAmount" type="number" min="1" max="1000" aria-label="PV à retirer ou rendre" /><button type="button" class="ui-danger" :disabled="busy||!(adjustAmount>=1)" :aria-label="`Retirer ${adjustAmount} PV à ${chosen.name}`" @click="act('adjust',{actorId:chosen.id,delta:-adjustAmount,beforeHp:chosen.hp})">− PV</button><button type="button" :disabled="busy||!(adjustAmount>=1)||chosen.hp<=chosen.death||chosen.hp>=chosen.pvMax" :aria-label="`Rendre ${adjustAmount} PV à ${chosen.name}`" @click="act('adjust',{actorId:chosen.id,delta:adjustAmount,beforeHp:chosen.hp})">+ PV</button></div><div class="dock-buttons"><button type="button" @click="inspectActor(chosen.id)">Fiche, jets et soins</button><button v-if="room.combat?.active&&chosen.kind!=='character'&&chosen.initiativePending&&chosen.participating!==false" type="button" :disabled="busy" @click="act('initiative',{combatantId:chosen.id,version:chosen.version})">◈ Initiative</button></div></template><p v-else>Clique sur le nom d’un participant pour le choisir.</p></div>
    <form class="dock-block" @submit.prevent="act('message',{text,link,image,...(recipient?{recipientCharacterId:recipient}:{})})"><h3>Révéler</h3><select v-model="recipient" aria-label="Destinataire de la révélation"><option value="">Tout le groupe</option><option v-for="c in room.characters" :key="c.id" :value="c.id">{{ c.name }} (privé)</option></select><textarea v-model="text" rows="2" maxlength="5000" aria-label="Texte à révéler" placeholder="Ce que les joueurs découvrent…" /><button class="ui-primary" :disabled="busy||imageBusy||(!text.trim()&&!link&&!image)">{{ recipient?'Envoyer en privé':'Révéler' }}</button></form>
    <form class="dock-block" @submit.prevent="act('gm-roll',{label:gmLabel,bonus:gmBonus,stress:gmStress,public:gmPublic,mode:'explosive',faces:gmFaces,count:gmCount})"><h3>Jet rapide</h3><div class="dock-row"><input v-model="gmLabel" maxlength="120" required aria-label="Intitulé du jet rapide" /><input v-model.number="gmBonus" type="number" min="-100" max="100" required aria-label="Modificateur du jet rapide" /></div><label class="check"><input v-model="gmPublic" type="checkbox" /> Visible des joueurs</label><button :disabled="busy||!gmLabel.trim()">◈ Jet d10</button></form>
    <div class="dock-block"><h3>Partie</h3><div class="dock-buttons"><button v-if="!room.combat?.active" type="button" :disabled="busy" @click="act('combat-scene',{version:room.combat.version})">Nouvelle scène</button><button type="button" @click="toggleGmTools">Tous les outils</button></div><small>Participants, effets, récompenses et séances sont dans « Tous les outils ».</small><button type="button" class="ui-quiet" :aria-expanded="shortcutsOpen" @click="shortcutsOpen=!shortcutsOpen">Raccourcis clavier (?)</button></div>
   </section>
   <section v-if="shortcutsOpen" class="shortcuts-help" aria-label="Raccourcis clavier"><h3>Raccourcis clavier</h3><p>Hors des champs de saisie. Échap ferme.</p><dl><dt>J</dt><dd>{{ room.ownCharacterId?'Ouvrir mes jets':'Ouvrir la fiche de la cible' }}</dd><template v-if="room.canManage"><dt>1 à 9</dt><dd>Choisir la cible, dans l’ordre de la colonne des participants</dd><dt>D</dt><dd>Aller au champ des PV de la cible</dd><dt>R</dt><dd>Écrire une révélation</dd><dt>Maj + N</dt><dd>Round suivant (en combat)</dd></template><dt>?</dt><dd>Afficher ou masquer cette aide</dd></dl></section>
   <button v-if="supportAttention" class="support-prompt response-prompt" @click="openPanel('character','truth')">{{supportAttention}} demande{{supportAttention>1?'s':''}} de soin ou de protection <span>Répondre →</span></button>
   <button v-if="combatAttention" class="response-prompt" @click="openPanel('response')">{{combatAttention}} réponse{{combatAttention>1?'s':''}} de combat à traiter <span>Choisir ma défense →</span></button>
   <p v-if="actionError" role="alert">{{ actionError }} <button v-if="pending" :disabled="busy" @click="sendPending">Réessayer l’action</button></p><p v-if="notice" role="status">{{ notice }}</p>
   <CampaignOccultConsent v-if="!room.canManage" :campaign-id="id" @refresh="load" />



  </main>
 <aside class="table-journal" aria-label="Journal de la table">   <section class="live-feed" :class="{collapsed:feedCollapsed}"><header><h2>Jets & révélations</h2><button class="ui-quiet" :aria-expanded="!feedCollapsed" aria-controls="table-feed-content" @click="toggleFeed">{{ feedCollapsed?'Voir le journal':'Replier le journal' }}<span v-if="unreadEvents" class="attention-badge">{{unreadEvents}} nouveau{{unreadEvents>1?'x':''}}</span></button><label v-show="!feedCollapsed">Afficher<select v-model="filter"><option value="all">Tout le fil</option><option value="rolls">Jets de dés</option><option value="messages">Révélations du MJ</option></select></label></header>
    <p v-if="latest" class="latest-result" role="status" aria-live="polite">{{latest.characterName??latest.payload.characterName??'MJ'}} → {{latest.payload.label}} → <strong>{{latest.payload.total}}</strong><span v-if="latest.payload.narrativeFailure"> · Échec narratif</span><span v-else-if="latest.payload.edgeForced"> · Forcer le Destin</span><span v-else-if="latest.payload.exploded"> · Explosion !</span></p>
    <div v-if="latestRevelation" class="latest-revelation"><span><strong>MJ · {{latestRevelation.payload.label??'Révélation'}}</strong><span v-if="latestRevelation.payload.text"> · {{latestRevelation.payload.text}}</span><span v-else-if="latestRevelation.image"> · Image partagée</span><span v-else-if="latestRevelation.payload.link"> · Page partagée</span></span><button class="ui-quiet" @click="openRevelations">Lire la révélation</button></div>
    <div id="table-feed-content" v-show="!feedCollapsed" class="feed-content"><div class="feed-scroll" role="log" aria-label="Journal des jets et révélations" tabindex="0"><article v-for="e in feed" :key="e.id" :class="['feed-event',{'reveal':e.kind==='message','failed':e.payload.narrativeFailure}]"><header><time>{{ date(e.createdAt) }}</time><strong>{{ e.characterName??e.payload.characterName??'MJ' }} → {{ e.payload.label }}<template v-if="e.payload.total!==undefined"> → {{ e.payload.total }}</template></strong></header><small v-if="e.playerName">{{ e.playerName }}</small>
     <p v-if="e.payload.selectedName"><strong>{{ e.payload.selectedName }}</strong> · parmi {{ e.payload.candidateCount }} joueurs</p><template v-if="e.payload.dice"><strong v-if="e.payload.edgeForced">Forcer le Destin · 1 Edge</strong><p class="dice-detail">{{ e.payload.modifier }} + <span v-for="(die,i) in e.payload.dice" :key="i">{{ i?' + ':'' }}<b>{{ die }}</b>{{ i&&e.payload.exploded?' (explosion)':'' }}</span> = <strong>{{ e.payload.total }}</strong></p><button v-if="room.ownCharacterId===(e.characterId??e.payload.characterId)&&!e.payload.edgeForced&&['roll','initiative','defend'].includes(e.kind)" :disabled="busy" @click="forceFeed(e.id)">Forcer ce jet · 1 Edge</button><strong v-if="e.payload.narrativeFailure" class="failure">Échec narratif</strong><details><summary>Détail du jet</summary><p v-if="e.payload.components?.attributeName">{{ e.payload.components.attributeName }} {{ e.payload.components.attribute }} + {{ e.payload.components.skillName }} {{ e.payload.components.rank }} + bonus {{ e.payload.components.bonus }}</p><p v-else-if="e.payload.components?.profileScore!==undefined">{{e.payload.components.profileName}} · score du profil {{e.payload.components.profileScore}} + bonus {{e.payload.components.bonus}}</p><p v-else-if="e.payload.components?.defense!==undefined">Défense {{e.payload.components.defense}} + bonus {{e.payload.components.bonus}} + {{e.payload.defensePowerName??'capacité'}} {{e.payload.components.specialBonus??0}} · {{e.payload.paCost??0}} PA</p><p v-else>Bonus du jet : {{ e.payload.modifier }}</p><p v-if="e.payload.weaponName">Arme / attaque : {{e.payload.weaponName}} · DGT {{e.payload.damage}}</p><p>Dés : {{e.payload.dice.join(' + ')}} · total {{e.payload.total}}</p><ul v-if="e.payload.bonuses?.length"><li v-for="(b,i) in e.payload.bonuses" :key="i">{{ b.label??b.name??b.id }} : {{ b.amount??b.bonus??0 }}</li></ul></details></template>
     <p v-if="e.kind==='resolve'">Attaque {{ e.payload.attackTotal }} contre défense {{ e.payload.defenseTotal }}<template v-if="e.payload.defenseDice?.length"> (dés : {{ e.payload.defenseDice.join(' + ') }})</template> · <strong>{{ e.payload.damage }} dégâts appliqués</strong></p><p v-if="e.kind==='resolve'&&e.payload.alteration">Altération cohérente à déterminer avec le MJ.</p><p v-if="e.kind!=='resolve'&&e.payload.damage!==undefined">Dégâts de base : {{ e.payload.damage }} · à résoudre selon la défense et l’armure.</p><p v-if="e.payload.text" class="message-text">{{ e.payload.text }}</p><a v-if="e.payload.link" :href="e.payload.link" target="_blank" rel="noopener">Ouvrir la page du Compendium ↗</a><a v-if="e.image" :href="e.image" target="_blank" rel="noopener"><img class="reveal-image" :src="e.image" alt="Image révélée par le MJ" loading="lazy" /></a><p v-if="e.payload.before!==undefined">{{ e.payload.before }} → {{ e.payload.after }} PV</p><p v-if="e.payload.reserveBonus">Réserve nanitique : +{{e.payload.reserveBonus}} PV inclus dans ce soin.</p><p v-if="e.payload.recovered!==undefined">+{{ e.payload.recovered }} PV récupérés</p><button v-if="room.canManage&&e.kind==='message'" class="ui-quiet ui-quiet-danger" :disabled="busy" aria-label="Retirer cette révélation" @click="act('withdraw',{eventId:e.id})">Retirer</button>
    </article><p v-if="!feed.length">Les prochains jets et révélations apparaîtront ici.</p></div>

    </div>
   </section></aside>
  <nav v-if="ownActor||room.ownCharacterId||room.canManage&&chosen||room.combat?.active||combatAttention" class="table-actionbar" aria-label="Actions de la table">
   <div v-if="ownActor" class="actionbar-vitals"><strong>{{ownActor.name}}</strong><span>{{ownActor.hp}} / {{ownActor.pvMax}} PV <template v-if="room.combat?.active">· {{ownActor.pa}} PA</template></span></div>
   <button v-if="room.ownCharacterId||room.canManage&&chosen" @click="room.ownCharacterId?ownPanel('jets'):openPanel('character','jets')"><span aria-hidden="true">◈</span> Lancer un jet</button>
   <button v-if="room.combat?.active" @click="openAttack"><span aria-hidden="true">⚔</span> Attaquer</button>
   <button v-if="room.ownCharacterId" @click="ownPanel('truth')"><span aria-hidden="true">✦</span> Pouvoirs</button>
   <button v-if="room.ownCharacterId" @click="ownPanel('equipment')"><span aria-hidden="true">▣</span> Mon sac</button>
   <button v-if="room.ownCharacterId" @click="ownPanel('states')"><span aria-hidden="true">♥</span> État & soins</button>
   <button v-if="combatAttention" class="response-action" @click="openPanel('response')">Répondre <b>{{combatAttention}}</b></button>
  </nav>

   <dialog ref="panel" class="table-workspace" aria-labelledby="table-workspace-title" @close="onPanelClosed">
    <header class="workspace-header"><div><small>{{panelMode==='gm'?'MJ':chosen?.name??'Table de jeu'}}</small><h2 id="table-workspace-title">{{panelTitle}}</h2></div><button type="button" class="workspace-close" aria-label="Fermer le panneau" @click="closePanel">✕</button></header>
    <nav v-if="panelMode==='character'&&chosen?.kind==='character'&&(room.canManage||chosen.id===room.ownCharacterId)" class="workspace-tabs" aria-label="Actions du personnage"><button v-for="[key,label] in [['jets','Jets'],['truth','Pouvoirs'],['equipment','Sac'],['states','État']]" :key="key" :aria-pressed="characterTab===key" @click="characterTab=key">{{label}}</button></nav><div class="workspace-body"><CampaignTargetedPowers @attention="supportAttention=$event" v-show="panelMode==='character'&&characterTab==='truth'" :campaign-id="id" :room="room" @changed="load" />   <details v-if="room.canManage" v-show="panelMode==='gm'" id="campaign-gm-tools" class="gm-tools" :open="gmToolsOpen" @toggle="gmToolsOpen=($event.target as HTMLDetailsElement).open"><summary>Outils du MJ <span v-if="occultAttention" class="attention-badge">{{occultAttention}} à résoudre</span><span>Participants, révélations, effets & séance</span></summary><div class="gm-tools-content">
    <details class="combat-controls"><summary>Rythme du combat & aide</summary><label>Passage des rounds<select :value="room.combat?.mode??'manual'" :disabled="busy" @change="act('combat-mode',{version:room.combat?.version??0,mode:($event.target as HTMLSelectElement).value})"><option value="manual">Manuel · le MJ décide</option><option value="automatic">Automatique · plus aucun PA visible</option></select></label><p>L’initiative reste la même pendant tout le combat. Lance celles des PNJ et créatures ; chaque joueur lance la sienne. Les attaques en attente doivent être résolues avant de passer au round suivant. « Action hors attaque » dépense 1 PA pour une autre action.</p></details>
   <details v-if="room.canManage" @toggle="($event.target as HTMLDetailsElement).open&&findSources()"><summary>Ajouter un PNJ ou une créature</summary><label>Source<select v-model="sourceCatalog"><option value="compendium">Compendium</option><option value="campaign">Cette campagne</option></select></label><label>Catalogue<select v-model="sourceKind"><option value="npc">PNJ</option><option value="creature">Bestiaire</option></select></label><form @submit.prevent="findSources()"><label>Filtrer la liste (facultatif)<input v-model="sourceQuery" maxlength="100" @input="sourceCatalog==='compendium'&&findSources()" /></label><button :disabled="sourceLoading">Rechercher dans le catalogue</button></form><p v-if="sourceLoading" role="status">Chargement du catalogue…</p><label>Fiche source<select v-model="sourceId" aria-label="Fiche source"><option value="">Choisir…</option><option v-for="s in sources" :key="s.id" :value="s.id">{{ s.name }}</option></select></label><button v-if="hasMore" :disabled="sourceLoading" @click="findSources(true)">Afficher la suite</button><label>Nom affiché<input v-model="sourceName" maxlength="120" placeholder="Ex. Garde du portail" /></label><button class="ui-primary" :disabled="busy||!sourceId||!sourceName.trim()" @click="act('add',{catalog:sourceCatalog,kind:sourceKind,sourceId,name:sourceName,visible:false})">Ajouter à la table, caché</button><p>Révèle ensuite le participant depuis sa fiche. Tu peux ajouter plusieurs exemplaires d’une créature.</p></details>
    <details v-if="room.canManage" class="gm-roll"><summary>Jet libre du MJ</summary><form @submit.prevent="act(gmMode==='player'?'random-player':'gm-roll',{label:gmLabel,bonus:gmBonus,stress:gmStress,public:gmPublic,mode:gmMode,faces:gmFaces,count:gmCount})"><div class="actor-controls"><label>Type de tirage<select v-model="gmMode" aria-label="Type de tirage"><option value="explosive">d10 explosif · règles de jeu</option><option value="dice">Dés libres</option><option value="player">Un joueur au hasard</option></select></label><template v-if="gmMode==='dice'"><label>Nombre de dés<input v-model.number="gmCount" type="number" min="1" max="50" /></label><label>Faces par dé<input v-model.number="gmFaces" type="number" min="2" max="1000" list="gm-dice-faces" /><datalist id="gm-dice-faces"><option v-for="n in [4,6,8,10,12,20,100]" :key="n" :value="n" /></datalist></label></template><label>Intitulé du jet<input v-model="gmLabel" maxlength="120" required /></label><label>Modificateur<input v-model.number="gmBonus" type="number" min="-100" max="100" required /></label><label>Stress du jet<select v-model.number="gmStress"><option :value="0">Neutre</option><option :value="1">Tendu</option><option :value="2">Paniqué</option></select></label><label class="check"><input v-model="gmPublic" type="checkbox" /> Visible par les joueurs</label><button class="ui-primary" :disabled="busy||!gmLabel.trim()">{{ gmMode==='player'?'Tirer un joueur au hasard':'Lancer les dés' }}</button></div></form></details>
    <details v-if="room.canManage" class="compose"><summary>Révéler quelque chose au groupe</summary><form @submit.prevent="act('message',{text,link,image,...(recipient?{recipientCharacterId:recipient}:{})})"><label>Pour<select v-model="recipient"><option value="">Tout le groupe</option><option v-for="c in room.characters" :key="c.id" :value="c.id">{{ c.name }} seulement (privé)</option></select></label><label>Message ou information révélée<textarea v-model="text" maxlength="5000" rows="3" /></label><label>Lien vers une page du Compendium<input v-model="link" maxlength="1000" placeholder="https://terra-umbra.fr/compendium?article=…" /></label><small>Le lien conserve les droits de lecture de la page. Pour révéler une information réservée au MJ, partage ici le texte ou l’image choisis.</small><label>Image à révéler<input type="file" accept="image/png,image/jpeg,image/webp" :disabled="imageBusy||busy" @change="upload" /></label><img v-if="image" :src="image" alt="Aperçu avant révélation" class="image-preview" /><button v-if="image" type="button" @click="image=''">Retirer l’image jointe</button><button class="ui-primary" :disabled="busy||imageBusy||(!text.trim()&&!link&&!image)">{{ recipient ? 'Révéler à ce joueur seulement' : 'Révéler au groupe' }}</button></form></details>
    <details v-if="!room.canManage" class="compose"><summary>Écrire au MJ (privé)</summary><form @submit.prevent="sendNote"><label>Message pour le MJ seul<textarea v-model="noteText" maxlength="2000" rows="3" /></label><small>Seul le MJ le lit ; il apparaît aussi dans ton journal de la table.</small><button class="ui-primary" :disabled="noteBusy||!noteText.trim()">Envoyer au MJ</button><p v-if="noteNotice" role="status">{{ noteNotice }}</p></form></details>
   <details v-if="room.canManage&&!room.combat?.active" class="combat-controls"><summary>Scènes & usages des capacités</summary><p>Déclare une nouvelle scène ou un nouveau scénario lorsque la fiction le justifie. Une séance ou un combat ne renouvelle pas automatiquement les capacités. Les PV, l’Edge, l’inventaire et le compteur de Mues depuis le repos restent inchangés.</p><button :disabled="busy" @click="act('combat-scene',{version:room.combat.version})">Nouvelle scène · renouveler les usages de scène</button><button :disabled="busy" @click="act('combat-scenario',{version:room.combat.version})">Nouveau scénario · renouveler tous les usages</button></details>
    <CampaignEffects :campaign-id="id" :room="room" @changed="load" />
    <CampaignLightningEffects :campaign-id="id" :room="room" @changed="load" />
    <CampaignOccultResolutions :campaign-id="id" :room="room" @changed="load" @attention="occultAttention=$event" />
    <CampaignRewards v-if="!room.combat?.active" :campaign-id="id" :can-manage="true" in-play @changed="load" />
    <CampaignLiveSessions v-show="!room.combat?.active" :campaign-id="id" :can-manage="true" :current="room.session" @changed="load" />
   </div></details>
   <CampaignCombat v-if="room.combat?.active" v-show="['attack','response'].includes(panelMode)" :show-composer="panelMode==='attack'" @attention="combatAttention=$event" ref="combatPanel" :campaign-id="id" :room="room" @changed="load" />
   <section v-show="panelMode==='character'" class="active-sheet"><div class="sheet-heading"><h2>{{ chosen?.name??(room.canManage?'Choisis un participant':'Ta fiche en jeu') }}</h2><button v-if="room.ownCharacterId&&selected!==room.ownCharacterId" @click="selected=room.ownCharacterId">Revenir à mon personnage</button></div>
    <details v-if="room.canManage&&chosen" class="participant-settings"><summary>Camp & participation · MJ</summary><fieldset class="participant-control" :disabled="busy"><legend>Place à la table · MJ</legend><div class="actor-controls"><label>Camp visible<select :value="chosen.side??'neutral'" @change="act('combat-participant',{actorId:chosen.id,version:room.combat.version,participating:chosen.participating!==false,side:($event.target as HTMLSelectElement).value})"><option value="ally">Allié</option><option value="enemy">Ennemi</option><option value="neutral">Neutre</option></select></label><button @click="act('combat-participant',{actorId:chosen.id,version:room.combat.version,participating:chosen.participating===false,side:chosen.side??'neutral'})">{{chosen.participating===false?'Réintégrer les tours':'Sortir des tours · fuite / retrait'}}</button></div><p>Le portrait et les PV sont conservés. Le retrait suspend les actions et la récupération de PA ; revenir conserve l’initiative et les PA restants.</p></fieldset></details>
    <details v-if="room.canManage&&chosen" class="gm-grace"><summary>Grâce du MJ · rétablir les PV</summary><form @submit.prevent="act('grace',{actorId:chosen.id,hp:graceHp,beforeHp:chosen.hp,reason:graceReason})"><p>Permet de sauver un personnage mort ou d’annuler des dégâts de test, sans dépenser d’Edge. L’initiative et les PA restent inchangés.</p><div class="actor-controls"><label>PV après la grâce<input v-model.number="graceHp" type="number" min="1" :max="chosen.pvMax" required /></label><button type="button" :disabled="busy" @click="graceHp=chosen.pvMax">Choisir le maximum · {{chosen.pvMax}} PV</button><label>Motif inscrit au journal partagé<input v-model="graceReason" maxlength="500" required /></label><button :disabled="busy||graceHp<1||graceHp>chosen.pvMax||!graceReason.trim()">Accorder la grâce à {{chosen.name}}</button></div></form></details>
    <CampaignCharacterPlay v-if="room.ownCharacterId&&!room.canManage" v-show="chosen?.id===room.ownCharacterId" :key="room.ownCharacterId" :character-id="room.ownCharacterId" :sheet-version="ownActor?.sheetVersion" :campaign-id="id" :combat-mode="!!room.combat?.active" :focus-tab="characterTab" compact @navigate="characterTab=$event" @changed="load" />
    <template v-if="chosen?.kind==='character'&&(room.canManage||chosen.id===room.ownCharacterId)">    <CampaignCharacterPlay v-if="room.canManage" :key="chosen.id" :character-id="chosen.id" :sheet-version="chosen.sheetVersion" :campaign-id="id" :combat-mode="!!room.combat?.active" :focus-tab="characterTab" compact @navigate="characterTab=$event" @changed="load" /></template>
    <template v-else-if="chosen&&room.canManage"><div v-if="room.combat?.active" class="combatant-status"><strong>{{ chosen.hp }} / {{ chosen.pvMax }} PV · {{ chosen.health }}</strong><span>{{ chosen.pa }} PA · Round {{ chosen.round }}</span><span>Initiative {{ chosen.initiative??'non lancée' }} · {{ chosen.paPerRound }} PA par round</span></div><details v-if="chosen.reference" class="participant-reference"><summary>Capacités, forces & faiblesses · MJ</summary><template v-for="group in [{key:'abilities',label:'Capacités'},{key:'strengths',label:'Forces'},{key:'weaknesses',label:'Faiblesses & limites'},{key:'equipment',label:'Équipement'},{key:'notes',label:'Notes de Vérité'}]" :key="group.key"><div v-if="chosen.reference[group.key]?.length"><h4>{{group.label}}</h4><p v-for="(text,i) in chosen.reference[group.key]" :key="i">{{text}}</p></div></template><div v-for="r in chosen.rolls.filter((r:any)=>r.id.startsWith('capability:'))" :key="r.id"><button @click="rollId=r.id;rollLabel=r.label">Préparer {{r.label}} · {{r.modifier}} + d10</button></div><details v-for="(s,i) in chosen.reference.ruleSections" :key="i"><summary>{{s.title}}</summary><p v-for="(line,j) in s.lines" :key="j">{{line}}</p></details></details><fieldset :disabled="busy" class="actor-roll"><legend>{{room.combat?.active?'Actions & jets du participant':'Jets courants du participant'}}</legend><form @submit.prevent="participantRoll"><div class="actor-controls"><label>Jet du participant<select v-model="rollId"><option v-for="r in availableRolls" :key="r.id" :value="r.id">{{ r.profile?r.profile+' · ':'' }}{{ r.label }} · {{ r.modifier }} + d10</option></select></label><details class="participant-roll-options"><summary>Options du jet · bonus, stress & PA</summary><div class="actor-controls"><label>Intitulé du jet<input v-model="rollLabel" maxlength="120" required /></label><label>Bonus / malus<input v-model.number="rollBonus" type="number" min="-100" max="100" required /></label><label>Stress minimum<select v-model.number="rollStress"><option :value="0">Neutre</option><option :value="1">Tendu</option><option :value="2">Paniqué</option></select></label><label v-if="room.combat?.active">PA à dépenser<input v-model.number="rollPa" type="number" min="0" max="20" required /></label><label class="check"><input v-model="rollPublic" type="checkbox" /> Publier le jet</label></div></details><button :disabled="!rollOption||!rollLabel.trim()">{{rollOption?.attack||rollOption?.requiresWeapon?'Choisir l’arme et la cible':'Lancer le d10 · participant'}}</button></div><p v-if="rollOption">{{ rollOption.modifier }} + bonus {{ rollBonus }} + d10 explosif<template v-if="rollOption.damage!==undefined"> · Dégâts de base {{ rollOption.damage }}</template></p><details class="participant-roll-help"><summary>Comment ce jet est calculé</summary><p>Le stress des blessures s’applique automatiquement. Les jets d’un participant caché restent privés. Les PA sont déduits au lancer ; les dégâts sont appliqués après résolution de l’attaque.</p></details></form></fieldset><details class="participant-followup"><summary>PV, soins & réglages du participant</summary><fieldset :disabled="busy"><legend>Suivi du participant</legend><div class="actor-controls"><label>Nom public<input v-model="actorName" maxlength="120" @input="actorDirty=true" /></label><label v-if="room.combat?.active">PA restants<input v-model.number="actorPa" type="number" min="0" max="20" @input="actorDirty=true" /></label><label class="check"><input type="checkbox" v-model="actorVisible" @change="actorDirty=true" /> Visible par les joueurs</label><button @click="actorAction('settings',{name:actorName,pa:actorPa,visible:actorVisible})">Enregistrer</button></div><div class="actor-controls"><label>Dégâts / soins<input v-model.number="amount" type="number" min="1" max="10000" /></label><button @click="actorAction('damage',{amount})">Subir les dégâts</button><button @click="actorAction('heal',{amount})">Recevoir les soins</button><button v-if="room.combat?.active&&chosen.participating!==false&&chosen.initiative===null" @click="actorAction('initiative')">Rejoindre le combat : initiative</button><button @click="actorAction('remove')">Retirer du combat</button></div></fieldset></details><details><summary>Fiche complète · MJ uniquement</summary><a v-if="chosen.sourceArticle" :href="`/compendium?article=${encodeURIComponent(chosen.sourceArticle)}`" target="_blank" rel="noopener">Ouvrir la fiche du Compendium ↗</a><CampaignNpcPreview v-else-if="chosen.kind==='npc'" :key="chosen.id" :campaign-id="id" :npc-id="chosen.sourceId" /><CampaignCreaturePreview v-else :key="chosen.id" :campaign-id="id" :creature-id="chosen.sourceId" /></details></template>
    <div v-else-if="chosen" class="public-actor-card"><PortraitZoom v-if="chosen.portrait" :src="chosen.portrait" :name="chosen.name" /><h3>{{chosen.name}}</h3><p>{{[chosen.occupation,chosen.sphere].filter(Boolean).join(' · ')}}</p><p>{{chosen.health}}</p><section v-if="chosen.publicDescription" class="public-description"><h4>Ce que les autres voient / savent</h4><p>{{chosen.publicDescription}}</p></section></div>
    <p v-else>{{ room.canManage?'Sélectionne un PJ pour consulter sa fiche, ou ajoute un participant depuis tes PNJ et ton bestiaire.':'Associe un personnage accepté à cette campagne pour retrouver sa fiche ici.' }}</p>
   </section></div>
   </dialog>

 </div></div>
</template>
<style scoped>.side-ally :deep(.portrait-trigger){border-color:var(--ui-ally)}.side-enemy :deep(.portrait-trigger){border-color:var(--ui-enemy)}.side-neutral :deep(.portrait-trigger){border-color:var(--ui-neutral)}.mode-heading{padding:0 0 12px}.mode-heading h2{margin:0}.initiative-rail li.side-ally{border-left:3px solid var(--ui-ally)}.initiative-rail li.side-enemy{border-left:3px solid var(--ui-enemy)}.initiative-rail li.side-neutral{border-left:3px solid var(--ui-neutral)}.initiative-rail li.outOfTurns{opacity:.7}.participant-control p{font-size:var(--ui-text-md);color:var(--ui-ink-soft)}.participant-reference{margin:16px 0;padding:14px;border:1px solid var(--ui-line);border-radius:8px}.participant-reference p{white-space:pre-wrap;line-height:1.5}.participant-reference h4{margin-bottom:8px}
.live-page{max-width:1800px;margin:auto;padding:24px;color:var(--ui-ink);overflow-wrap:anywhere}.live-header,.live-header nav,.live-feed>header,.feed-event header,.sheet-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.live-header{margin-bottom:24px}.live-header h1{margin:4px 0}.live-page a{color:var(--ui-link)}.live-layout{display:grid;grid-template-columns:280px minmax(0,1fr);gap:24px;align-items:start}.initiative-rail{position:sticky;top:16px;max-height:calc(100vh - 32px);overflow:auto;background:var(--ui-panel);border:1px solid var(--ui-line);border-radius:10px;padding:16px}.initiative-rail h2{margin:0}.initiative-rail ol{padding:0;list-style:none}.initiative-rail li{display:flex;gap:12px;flex-wrap:wrap;border:1px solid var(--ui-line);padding:12px;margin:12px 0;border-radius:8px}.initiative-rail li.selected{border-color:var(--ui-link);background:var(--ui-raised)}.initiative-rail li.hiddenActor{border-style:dashed}.initiative-rail img{width:54px;height:70px;object-fit:cover;border-radius:4px}.initiative-rail li>div{flex:1;min-width:0}.initiative-rail small,.health{display:block;margin-top:5px}.health{color:var(--ui-link)}.rail-actions{display:grid;grid-template-columns:minmax(0,1fr) 44px;gap:6px;flex-basis:100%!important}.live-page .rail-actions button{min-height:44px;padding:6px 8px;font-size:var(--ui-text-sm);line-height:1.2;white-space:nowrap;overflow-wrap:normal}.rail-actions button:last-child:not(:first-child){grid-column:1 / -1}.rail-actions a{display:grid;place-items:center;min-height:44px;padding:0;box-sizing:border-box}.live-main,.active-sheet{min-width:0}.live-feed,.active-sheet{padding:20px;background:var(--ui-panel);border:1px solid var(--ui-line);border-radius:10px}.live-feed{margin-bottom:20px;position:sticky;top:8px;z-index:9;padding:12px;box-shadow:0 8px 20px #0008}.feed-content{max-height:42dvh;overflow:auto;overscroll-behavior:contain}.latest-result{margin:8px 0;padding:8px 10px;background:var(--ui-raised);border-radius:5px}.live-feed h2{font-size:var(--ui-text-lg)}.combat-controls{margin-bottom:16px;padding:12px;background:var(--ui-panel-2);border:1px solid var(--ui-line);border-radius:8px}.initiative-rail li.pass-divider{border:0;border-top:2px solid var(--ui-link-soft);border-radius:0;padding:10px 0 0;font-weight:600}.live-feed.collapsed .latest-result{max-height:4.5em;overflow:auto}.active-sheet,.combat-resolution{scroll-margin-top:45vh}.live-feed h2{margin:0}.feed-scroll{height:clamp(130px,24dvh,300px);overflow:auto;overscroll-behavior:contain;margin-top:16px;padding-right:10px}.feed-event{padding:14px;margin-bottom:12px;background:var(--ui-panel-2);border:1px solid var(--ui-line);border-radius:8px}.feed-event.reveal{border-left:3px solid var(--ui-reveal)}.feed-event.failed{border-left:3px solid #ef9c9c}.feed-event header{justify-content:flex-start}.feed-event time,.feed-event small{color:var(--ui-ink-soft)}.dice-detail b{display:inline-block;padding:4px 10px;background:var(--ui-line);border-radius:5px;color:var(--ui-link)}.failure{color:var(--ui-danger-ink)}.message-text{white-space:pre-wrap}.reveal-image{display:block;max-width:100%;max-height:320px;object-fit:contain;margin-top:12px}.image-preview{max-width:240px;max-height:180px}.live-page label{display:grid;gap:6px;margin:8px 0;min-width:0}.live-page input:not([type=checkbox]),.live-page textarea,.live-page select{box-sizing:border-box;width:100%;min-width:0;padding:10px;background:var(--ui-input);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit}.live-page button{padding:10px 14px;min-height:44px;background:var(--ui-btn);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit;cursor:pointer}.live-page button:disabled{opacity:.5;cursor:default}.live-page summary{cursor:pointer;padding:14px 0;min-height:24px}.live-page fieldset{border:1px solid var(--ui-line);border-radius:8px;min-width:0;margin:14px 0}.actor-controls,.combatant-status{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.actor-controls label{flex:1;min-width:120px}.actor-controls .check{display:flex;align-items:center}.combatant-status{padding:12px;background:var(--ui-raised)}.live-page :focus-visible{outline:2px solid var(--ui-link);outline-offset:3px}@media(max-width:800px){.live-page{padding:12px}.live-layout{grid-template-columns:1fr}.initiative-rail{position:static;max-height:none}.initiative-rail ol{display:flex;gap:12px;overflow-x:auto}.initiative-rail li{min-width:210px;flex:0 0 230px;box-sizing:border-box}.live-feed,.active-sheet{padding:12px}.feed-scroll{height:22dvh;min-height:100px}.feed-content{max-height:33dvh}.live-feed{top:4px}.live-feed>header{gap:6px}.live-feed>header label{margin:0;flex:1}.initiative-rail li.pass-divider{min-width:80px;flex-basis:80px;border-top:0;border-left:2px solid var(--ui-link-soft);padding:10px}.latest-result{font-size:var(--ui-text-md)}}

.mode-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 16px;margin-bottom:16px;border:1px solid var(--ui-line);border-radius:10px;background:var(--ui-panel-2)}.mode-label{font-size:var(--ui-text-sm);color:var(--ui-link);font-weight:600;margin:0}.mode-heading h2{font-size:var(--ui-text-lg);margin:4px 0}.mode-heading p:last-child{margin:4px 0;font-size:var(--ui-text-md);color:var(--ui-ink-soft)}.table-primary-actions{display:flex;gap:8px;flex-wrap:wrap;border:0;padding:0;margin:0;background:transparent}.gm-tools{padding:0 14px;margin-bottom:16px;border:1px solid var(--ui-line);border-radius:8px;background:var(--ui-panel);scroll-margin-top:140px}.gm-tools>summary{font-weight:600}.gm-tools>summary>span{font-size:var(--ui-text-sm);font-weight:400;color:var(--ui-ink-soft);margin-left:8px}.gm-tools-content{padding-bottom:12px}.gm-tools-content>details{border-bottom:1px solid var(--ui-line);padding:0 4px}.attention-badge{display:inline-block;margin-left:8px;border-radius:20px;padding:2px 7px;font-size:var(--ui-text-sm);background:var(--ui-warn-bg);color:var(--ui-warn-ink)}.latest-revelation{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px;font-size:var(--ui-text-md)}.latest-revelation>span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.latest-revelation button{flex:none;font-size:var(--ui-text-sm);padding:6px 8px}.participant-roll-options{flex-basis:100%;min-width:0;width:100%}.participant-roll-options summary{font-size:var(--ui-text-md)}.participant-settings{margin:10px 0}.participant-reference>summary{font-weight:600}.initiative-rail li{padding:10px;margin:8px 0;gap:8px}.initiative-rail small,.health{margin-top:3px}.initiative-rail .rail-actions{gap:4px}.active-sheet{scroll-margin-top:160px}@media(max-width:800px){.mode-heading{padding:10px 12px}.mode-heading p:last-child{font-size:var(--ui-text-sm)}.table-primary-actions{width:100%}.table-primary-actions button{flex:1;min-width:110px}.gm-tools>summary>span{display:block;margin:5px 0 0 16px}.live-layout{gap:12px}.initiative-rail{padding:10px}.initiative-rail h2{font-size:var(--ui-text-base)}.initiative-rail>p{font-size:var(--ui-text-sm);margin:5px 0}.initiative-rail ol{margin:4px 0}.initiative-rail li{flex-basis:205px;min-width:190px}.initiative-rail li.pass-divider{flex-basis:70px;min-width:70px}.latest-revelation button{max-width:90px;white-space:normal}.live-feed{max-height:none}.gm-tools{scroll-margin-top:160px}}</style>
<style scoped>
.live-page{max-width:1800px;margin:auto;padding:12px 16px}.live-header{padding:0 4px 12px}.live-header h1{font-size:1.35rem;margin:2px 0}.live-header .eyebrow{font-size:var(--ui-text-xs);color:var(--ui-muted)}.live-layout{display:grid;grid-template-columns:150px minmax(0,1fr) 320px;grid-template-rows:minmax(480px,1fr) auto;grid-template-areas:"roster stage journal" "actions actions actions";gap:14px;min-height:calc(100dvh - 180px);align-items:stretch}.initiative-rail{grid-area:roster;position:static;max-height:calc(100dvh - 235px);overflow:auto;border:0;background:var(--ui-panel);padding:10px;border-radius:14px}.initiative-rail h2{font-size:var(--ui-text-sm)}.initiative-rail>p{font-size:var(--ui-text-xs);color:var(--ui-muted)}.initiative-rail li{display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 6px;border:1px solid var(--ui-line);border-left:3px solid #a99d77;border-radius:10px;text-align:center;background:var(--ui-panel-2)}.initiative-rail li.side-ally{border-left-color:var(--ui-ally)}.initiative-rail li.side-enemy{border-left-color:var(--ui-enemy)}.initiative-rail li.selected{background:var(--ui-accent-bg);border-top-color:var(--ui-accent);border-bottom-color:var(--ui-accent)}.initiative-rail li strong{font-size:var(--ui-text-sm)}.initiative-rail li small,.initiative-rail .health{font-size:var(--ui-text-xs);color:var(--ui-accent-soft)}.initiative-rail .rail-actions{justify-content:center}.initiative-rail .rail-actions button{font-size:var(--ui-text-xs);padding:6px 9px}.initiative-rail li.pass-divider{display:block;padding:5px 0;background:none;border:0;font-size:var(--ui-text-xs)}.live-main{grid-area:stage;display:flex;flex-direction:column;gap:12px;min-width:0}.mode-heading{margin:0;padding:10px 14px;background:var(--ui-panel-2);border:1px solid var(--ui-line);border-radius:12px}.mode-heading h2{font-size:var(--ui-text-base)}.mode-heading p:last-child,.mode-label{font-size:var(--ui-text-xs)}.table-primary-actions button{padding:7px 10px;font-size:var(--ui-text-sm);min-height:36px}.table-stage{position:relative;flex:1;min-height:410px;overflow:hidden;border-radius:16px;border:1px solid var(--ui-line);background:radial-gradient(ellipse at 25% 30%,var(--ui-accent-bg),var(--ui-panel-2) 42%,var(--ui-input));display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(20px,4vw,48px);isolation:isolate}.scene-art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:-2;background:var(--ui-input)}.has-scene-image:after{content:"";position:absolute;inset:40% 0 0;background:linear-gradient(transparent,#040c14ee);z-index:-1;pointer-events:none}.scene-caption{max-width:650px}.stage-kicker{text-transform:uppercase;letter-spacing:.15em;font-size:var(--ui-text-xs);color:var(--ui-accent-soft)}.scene-caption h2{font-size:clamp(1.6rem,3vw,2.7rem);line-height:1.1;margin:12px 0}.scene-caption p{line-height:1.6;color:var(--ui-ink-soft);max-height:150px;overflow:auto;white-space:pre-wrap}.stage-roll{display:grid;grid-template-columns:1fr auto;gap:5px 20px;margin-top:24px;text-align:left;width:100%;max-width:500px;padding:16px 20px;background:#091521e8;border:1px solid #6c9e92;border-radius:12px}.stage-roll>strong{font-size:2.1rem;grid-column:2;grid-row:1 / 3;color:#d4efd5}.stage-roll small{font-size:var(--ui-text-xs);color:var(--ui-neutral)}.response-prompt{display:flex;justify-content:space-between;gap:8px;text-align:left;background:var(--ui-warn-bg);border:1px solid var(--ui-warn);padding:14px;border-radius:10px}.table-journal{grid-area:journal;min-width:0;max-height:calc(100dvh - 235px);overflow:auto;border-radius:14px;background:var(--ui-panel)}.table-journal .live-feed{position:static;margin:0;padding:12px;border:0;background:none;max-height:none}.live-feed>header{flex-wrap:wrap}.live-feed>header h2{font-size:var(--ui-text-md)}.live-feed>header button{font-size:var(--ui-text-xs);padding:6px 8px}.live-feed>header label{width:100%;font-size:var(--ui-text-xs)}.feed-scroll{max-height:none;overflow:visible}.feed-event{padding:12px 8px;border-bottom:1px solid var(--ui-accent-bg);background:none;border-radius:0}.feed-event>header{display:flex;flex-direction:column;align-items:flex-start;gap:5px}.feed-event>header time{font-size:var(--ui-text-xs);color:var(--ui-muted)}.feed-event p,.feed-event small{font-size:var(--ui-text-sm)}.table-journal .latest-result{font-size:var(--ui-text-sm);padding:10px;background:var(--ui-success-bg)}.table-actionbar{grid-area:actions;position:sticky;bottom:10px;z-index:30;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:12px;background:#10232df5;border:1px solid #4c736c;border-radius:16px;box-shadow:0 10px 35px #0008;backdrop-filter:blur(12px)}.table-actionbar>button{display:flex;align-items:center;gap:8px;min-height:46px;padding:10px 16px;background:var(--ui-accent-bg);border:1px solid var(--ui-line);border-radius:9px;font-size:var(--ui-text-sm)}.table-actionbar>button:hover{background:var(--ui-line);border-color:var(--ui-accent-soft)}.table-actionbar>button>span{font-size:var(--ui-text-lg);color:var(--ui-accent-soft)}.actionbar-vitals{display:flex;flex-direction:column;font-size:var(--ui-text-sm);padding-right:18px;border-right:1px solid var(--ui-line)}.actionbar-vitals span{color:var(--ui-accent-soft)}.table-actionbar .response-action{background:#67472c}.table-workspace{position:fixed;inset:0;margin:auto;width:min(880px,calc(100vw - 40px));max-width:none;max-height:calc(100dvh - 60px);padding:0;border:1px solid #5f8a80;border-radius:16px;color:var(--ui-ink);background:var(--ui-panel);box-shadow:0 20px 90px #000a}.table-workspace[open]{display:flex;flex-direction:column}.table-workspace:not([open]){display:none}.table-workspace::backdrop{background:#02080fc7;backdrop-filter:blur(4px)}.workspace-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 22px;border-bottom:1px solid var(--ui-line);background:var(--ui-accent-bg)}.workspace-header small{color:var(--ui-accent-soft)}.workspace-header h2{margin:4px 0 0;font-size:var(--ui-text-lg)}.workspace-close{min-width:44px;min-height:44px;background:transparent;border:1px solid var(--ui-line-strong);border-radius:8px}.workspace-body{overflow:auto;overscroll-behavior:contain;padding:20px;min-height:0}.workspace-body .active-sheet{border:0;padding:0;background:none}.workspace-body .sheet-heading>h2{display:none}.workspace-body .gm-tools{margin:0;border:0;padding:0;background:none}.workspace-body .gm-tools>summary{display:none}.public-actor-card{text-align:center}.public-actor-card :deep(.portrait-trigger){display:block;width:fit-content;margin:12px auto}.public-actor-card :deep(.portrait-trigger img){width:150px;height:190px;object-fit:cover;border-radius:12px}.public-description{text-align:left;max-width:560px;margin:24px auto 0;padding:16px;border:1px solid var(--ui-line);border-radius:12px}.public-description h4{margin:0 0 12px}.public-description p{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6;margin:0}.table-actionbar button:focus-visible,.workspace-close:focus-visible,.stage-roll:focus-visible{outline:3px solid var(--ui-success-ink);outline-offset:3px}
@media(max-width:1100px){.live-layout{grid-template-columns:125px minmax(0,1fr) 280px}.table-actionbar>button{padding:9px 12px}.initiative-rail{padding:7px}}
@media(max-width:850px){.live-page{padding:10px}.live-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto auto auto;grid-template-areas:"roster" "stage" "journal" "actions";min-height:0;gap:10px}.initiative-rail{max-height:none;overflow:visible;padding:8px}.initiative-rail h2,.initiative-rail>p{display:none}.initiative-rail ol{display:flex;gap:8px;overflow-x:auto;margin:0;align-items:stretch}.initiative-rail li{flex:0 0 100px;min-width:100px;margin:0;padding:7px}.initiative-rail li.pass-divider{flex-basis:50px;min-width:50px;align-self:center}.initiative-rail li small{display:none}.initiative-rail .rail-actions a{display:none}.table-stage{min-height:350px;padding:22px}.table-journal{max-height:300px}.table-actionbar{flex-wrap:nowrap;justify-content:flex-start;overflow-x:auto;bottom:6px;padding:8px;border-radius:12px}.table-actionbar>button{flex:none;flex-direction:column;gap:2px;font-size:var(--ui-text-xs);min-width:75px;padding:7px}.actionbar-vitals{flex:none;padding-right:8px;max-width:110px}.mode-heading{padding:10px}.table-primary-actions{width:auto}.table-primary-actions button{min-width:0;flex:none}.table-workspace{width:calc(100vw - 12px);max-height:calc(100dvh - 12px);border-radius:12px}.workspace-body{padding:12px}.workspace-header{padding:12px}.response-prompt{font-size:var(--ui-text-sm);flex-wrap:wrap}.table-actionbar{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));overflow:visible;gap:6px}.table-actionbar>button{min-width:0;width:100%;align-items:center;justify-content:center;text-align:center;line-height:1.15;overflow-wrap:normal;padding:7px 4px}.actionbar-vitals{grid-column:1 / -1;flex-direction:row;justify-content:space-between;max-width:none;padding:0 4px 4px;border-right:0;border-bottom:1px solid var(--ui-line)}.initiative-rail ol{scroll-snap-type:x proximity;-webkit-mask-image:linear-gradient(to right,#000 82%,transparent);mask-image:linear-gradient(to right,#000 82%,transparent);padding-right:40px}.initiative-rail li{scroll-snap-align:start}}.initiative-rail li{position:relative}.initiative-rail li>div:not(.rail-actions){display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0}.init-badge{position:absolute;top:6px;right:6px;min-width:24px;padding:1px 5px;border-radius:999px;background:var(--ui-raised);border:1px solid var(--ui-line-strong);color:var(--ui-link);font-size:var(--ui-text-xs);font-weight:700}.turn-tag{align-self:center;padding:1px 8px;border-radius:999px;background:var(--ui-accent);color:var(--ui-accent-on);font-size:var(--ui-text-xs);font-weight:700}.initiative-rail li.currentPass{box-shadow:0 0 0 2px var(--ui-accent)}.hp-bar{display:block;width:100%;height:6px;margin-top:4px;border-radius:3px;background:var(--ui-input);border:1px solid var(--ui-line);overflow:hidden}.hp-bar>span{display:block;height:100%;transition:width .3s}.hp-bar .ok{background:var(--ui-ally)}.hp-bar .low{background:var(--ui-warn)}.hp-bar .critical,.hp-bar .down{background:var(--ui-enemy)}.hp-text{font-size:var(--ui-text-xs);color:var(--ui-ink-soft)}.pa-pips{display:flex;gap:3px;justify-content:center}.pa-pips i{width:9px;height:9px;border-radius:50%;background:var(--ui-link);border:1px solid var(--ui-link)}.pa-pips i.spent{background:transparent;border-color:var(--ui-line-strong)}.effect-chips{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;max-width:100%}.effect-chips>span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 6px;border-radius:999px;background:var(--ui-warn-bg);color:var(--ui-warn-ink);font-size:var(--ui-text-xs)}@media(max-width:850px){.init-badge{top:3px;right:3px}.hp-text{display:none}}.shortcuts-help{padding:12px 16px;border:1px solid var(--ui-line);border-radius:12px;background:var(--ui-panel)}.shortcuts-help h3{margin:0 0 4px;font-size:var(--ui-text-base)}.shortcuts-help p{margin:0 0 8px;font-size:var(--ui-text-sm);color:var(--ui-muted)}.shortcuts-help dl{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;margin:0;font-size:var(--ui-text-sm)}.shortcuts-help dt{font-weight:700;color:var(--ui-link)}.shortcuts-help dd{margin:0}.gm-dock{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;padding:10px;border:1px solid var(--ui-line);border-radius:12px;background:var(--ui-panel)}.dock-block{display:flex;flex-direction:column;gap:6px;min-width:0;padding:8px;border-radius:8px;background:var(--ui-panel-2)}.dock-block h3{margin:0;font-size:var(--ui-text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--ui-muted)}.dock-block>span,.dock-block small,.dock-block p{font-size:var(--ui-text-sm);color:var(--ui-ink-soft);margin:0}.dock-effects{color:var(--ui-warn-ink)!important}.dock-buttons{display:flex;flex-wrap:wrap;gap:6px}.dock-row{display:grid;grid-template-columns:minmax(0,1fr) 70px;gap:6px}.dock-row.dock-hp{grid-template-columns:70px 1fr 1fr}.live-page .gm-dock button{min-height:38px;padding:6px 10px;font-size:var(--ui-text-sm)}.live-page .gm-dock textarea,.live-page .gm-dock input:not([type=checkbox]),.live-page .gm-dock select{padding:7px;font-size:var(--ui-text-sm)}.gm-dock .check{display:flex;align-items:center;gap:6px;margin:0;font-size:var(--ui-text-sm)}.live-page button.card-pick{min-height:0;padding:0;background:none;border:0;color:inherit;font:inherit;text-decoration:underline dotted;text-underline-offset:3px}.live-page button.card-pick[aria-pressed=true]{color:var(--ui-link)}.live-page :deep(button.ui-primary){background:var(--ui-accent);border-color:var(--ui-accent);color:var(--ui-accent-on);font-weight:600}.live-page :deep(button.ui-primary:hover:not(:disabled)){background:var(--ui-accent-soft)}.live-page :deep(button.ui-danger){background:var(--ui-danger-bg);border-color:var(--ui-enemy);color:var(--ui-danger-ink)}.live-page :deep(button.ui-quiet){background:transparent;border-color:transparent;color:var(--ui-link);text-decoration:underline;text-underline-offset:3px}.live-page :deep(button.ui-quiet:hover:not(:disabled)){border-color:var(--ui-line)}.live-page button.ui-quiet-danger{color:var(--ui-danger-ink);min-height:32px;padding:4px 6px;margin-top:6px;font-size:var(--ui-text-xs)}
</style>

<style scoped>.workspace-tabs{display:flex;gap:6px;padding:10px 20px;background:var(--ui-panel-2);border-bottom:1px solid var(--ui-line)}.workspace-tabs button{flex:1;background:var(--ui-accent-bg);border:1px solid var(--ui-line);border-radius:8px;padding:8px}.workspace-tabs button[aria-pressed="true"]{background:var(--ui-line);border-color:var(--ui-accent-soft)}</style>
<style scoped>
.initiative-rail li{flex-wrap:nowrap}.initiative-rail li>div{width:100%;flex:0 0 auto}.initiative-rail .rail-actions{display:flex;flex-wrap:wrap;flex-basis:auto!important;gap:4px;width:100%;justify-content:center}.initiative-rail .rail-actions button{max-width:100%;white-space:normal}.initiative-rail .rail-actions a{width:30px;min-width:30px}.table-journal .feed-content{max-height:none;overflow:visible}.table-journal .feed-scroll{height:auto}
@media(min-width:851px){.table-workspace{inset:0 0 0 auto;margin:0;width:min(500px,100vw);height:100dvh;max-height:none;border-radius:16px 0 0 16px;z-index:50;box-shadow:-20px 0 60px #0009}}@media(min-width:1300px){.live-page.drawer-open{padding-right:516px;max-width:none}}@media(max-width:850px){.table-workspace{inset:auto 0 0 0;margin:0;width:100vw;max-height:82dvh;border-radius:16px 16px 0 0;z-index:50;box-shadow:0 -20px 60px #0009}}</style>
