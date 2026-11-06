<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useLiveUpdates } from "../lib/live-updates";
import { provideLiveTable } from "../lib/live-table";
import { playAmbience, type AmbienceSound } from "../lib/ambience";
import ParticipantRail from "../components/ParticipantRail.vue";
import TableJournal from "../components/TableJournal.vue";
import GmDock from "../components/GmDock.vue";
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
    // Une demande non confirmée n'est rejouée que pour le même jet.
    if (edgeRequest.value?.eventId !== eventId) {
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
const dockTab = ref("reveal");
// Notes de scène du MJ : brouillon local, enregistré à la demande ou en quittant le champ.
const sceneDraft = ref(""),
  sceneSaved = ref(""),
  sceneDirty = ref(false);
watch(
  () => room.value?.sceneNotes,
  (v) => {
    if (typeof v === "string" && !sceneDirty.value) sceneDraft.value = v;
  },
  { immediate: true }
);
async function saveSceneNotes() {
  if (!sceneDirty.value) return;
  try {
    await api(`/api/campaigns/${id}/play/scene-notes`, { method: "PUT", body: JSON.stringify({ text: sceneDraft.value }) });
    sceneDirty.value = false;
    sceneSaved.value = `Enregistré à ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    sceneSaved.value = "Enregistrement impossible : réessaie.";
  }
}
// Minuteur : la fin vient du serveur ; l'écart d'horloge avec ce navigateur est corrigé.
const clockOffset = ref(0),
  now = ref(Date.now());
watch(
  () => room.value?.serverNow,
  (v) => {
    if (v) clockOffset.value = new Date(v).getTime() - Date.now();
  }
);
const timerLeft = computed(() => {
  const end = room.value?.tableState?.timer?.endsAt;
  if (!end) return 0;
  return Math.max(0, Math.ceil((new Date(end).getTime() - (now.value + clockOffset.value)) / 1000));
});
const timerTotal = computed(() => room.value?.tableState?.timer?.seconds ?? 0);
const timerText = computed(() => `${Math.floor(timerLeft.value / 60)}:${String(timerLeft.value % 60).padStart(2, "0")}`);
let ticker: ReturnType<typeof setInterval> | undefined;
watch(
  () => room.value?.tableState?.timer?.endsAt,
  () => {
    clearInterval(ticker);
    now.value = Date.now();
    if (timerLeft.value > 0)
      ticker = setInterval(() => {
        now.value = Date.now();
        if (!timerLeft.value) clearInterval(ticker);
      }, 1000);
  }
);
// Ambiance : le MJ choisit, chacun active le son sur son appareil (choix gardé sur cet appareil).
const soundOn = ref(false);
try {
  soundOn.value = localStorage.getItem("tuc-table-son") === "1";
} catch {
  /* stockage indisponible : son coupé */
}
const ambience = computed<AmbienceSound>(() => room.value?.tableState?.ambience?.sound ?? "off");
watch([ambience, soundOn], ([sound, on]) => playAmbience(sound, on), { immediate: false });
function toggleSound() {
  soundOn.value = !soundOn.value;
  try {
    localStorage.setItem("tuc-table-son", soundOn.value ? "1" : "0");
  } catch {
    /* sans stockage, le choix vaut pour cette page */
  }
}
// À qui le tour : la passe en cours.
const turnNames = computed(() =>
  currentPass.value === null
    ? []
    : roster.value.filter((c) => c.participating !== false && passOf(c.id) === currentPass.value).map((c) => c.name)
);
const myTurn = computed(
  () =>
    !!room.value?.ownCharacterId &&
    currentPass.value !== null &&
    ownActor.value?.participating !== false &&
    passOf(room.value.ownCharacterId) === currentPass.value
);
const requestLabel = ref(""),
  requestFor = ref(""),
  dismissedRequest = ref("");
// Dernier jet demandé au joueur, tant qu'il n'a pas lancé de dé depuis.
const rollRequest = computed(() => {
  const r = room.value;
  if (!r?.ownCharacterId) return null;
  const events = r.events ?? [];
  const asked = events.find((e: any) => e.kind === "roll-request");
  if (!asked || asked.id === dismissedRequest.value) return null;
  const since = new Date(asked.createdAt).getTime();
  const answered = events.some(
    (e: any) =>
      e.payload.dice &&
      (e.characterId ?? e.payload.characterId) === r.ownCharacterId &&
      new Date(e.createdAt).getTime() > since
  );
  return answered ? null : asked;
});
async function answerRollRequest() {
  const asked = rollRequest.value?.payload.request ?? "";
  ownPanel("jets");
  await nextTick();
  await nextTick();
  // shortcut: pré-remplit la recherche de compétence par le DOM ; passer par une prop de CharacterPlay si elle évolue.
  const search = [...(panel.value?.querySelectorAll("label") ?? [])]
    .find((l) => l.textContent?.includes("Retrouver une compétence"))
    ?.querySelector("input");
  if (search) {
    search.value = asked;
    search.dispatchEvent(new Event("input"));
    search.focus();
  }
}
function requestRoll() {
  void act("roll-request", {
    label: requestLabel.value,
    ...(requestFor.value ? { recipientCharacterId: requestFor.value } : {})
  });
  requestLabel.value = "";
}
const summaryText = ref(""),
  summaryBusy = ref(false);
// Résumé de séance : tout le journal de la séance affichée, du plus ancien au plus récent.
async function openSummary() {
  summaryBusy.value = true;
  summaryText.value = "";
  void openPanel("summary");
  try {
    const all: any[] = [];
    let before: string | null = null;
    for (let page = 0; page < 30; page++) {
      const r: any = await api<any>(endpoint + (before ? "?before=" + encodeURIComponent(before) : ""));
      all.push(...(r.events ?? []));
      before = r.nextBefore;
      if (!before) break;
    }
    const lines = [...new Map(all.map((e) => [e.id, e])).values()]
      .reverse()
      .map((e) => {
        const who = e.characterName ?? e.payload.characterName ?? "MJ";
        const total = e.payload.total !== undefined ? ` → ${e.payload.total}` : "";
        const hp = e.payload.before !== undefined ? ` (${e.payload.before} → ${e.payload.after} PV)` : "";
        const text = e.payload.text ? `\n    ${e.payload.text}` : "";
        return `${date(e.createdAt)} · ${who} → ${e.payload.label}${total}${hp}${text}`;
      });
    summaryText.value =
      `${room.value?.campaignName ?? "Partie"}${room.value?.session?.title ? " · " + room.value.session.title : ""}\n\n` +
      (lines.join("\n") || "Aucun événement dans cette séance.");
  } catch {
    summaryText.value = "Impossible de charger le journal de la séance.";
  } finally {
    summaryBusy.value = false;
  }
}
async function copySummary() {
  try {
    await navigator.clipboard.writeText(summaryText.value);
    notice.value = "Résumé copié.";
  } catch {
    notice.value = "Copie impossible : sélectionne le texte à la main.";
  }
}
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
    : panelMode.value === "summary"
      ? "Résumé de séance"
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
              history: "Historique",
              summary: "Résumé de séance"
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
  } else if ((k === "r" || k === "R") && r.canManage) {
    e.preventDefault();
    dockTab.value = "reveal";
    void nextTick(() => document.querySelector<HTMLElement>(".gm-dock .dock-reveal textarea")?.focus());
  }
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
const connectionLost = ref(false);
let alive = true,
  loading = false,
  reloadAfter = false,
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
      !["timer", "ambience"].includes(e.kind) &&
      (filter.value === "all" ||
      (filter.value === "rolls"
        ? Array.isArray(e.payload.dice)
        : e.kind === "message"))
  )
);
async function load() {
  if (!alive || document.visibilityState === "hidden") return;
  // Une annonce arrivée pendant une lecture relance une lecture juste après.
  if (loading) { reloadAfter = true; return; }
  loading = true;
  reloadAfter = false;
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
    connectionLost.value = false;
    if (!selected.value) selected.value = r.ownCharacterId ?? "";
    if (selected.value && !roster.value.some((c) => c.id === selected.value))
      selected.value = r.ownCharacterId ?? "";
  } catch (e) {
    if (!alive) return;
    // Table déjà ouverte : on garde le dernier état et la saisie en cours.
    if (room.value && !(e instanceof ApiError && [401, 403, 404].includes(e.status))) {
      connectionLost.value = true;
    } else {
      room.value = null;
      error.value =
        "La campagne est inaccessible. Vérifie ta connexion et ton invitation.";
    }
  } finally {
    loading = false;
    if (reloadAfter && alive) void load();
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
provideLiveTable({
  dockTab,
  sceneDraft,
  sceneDirty,
  sceneSaved,
  saveSceneNotes,
  timerLeft,
  timerText,
  ambience,
  requestLabel,
  requestFor,
  requestRoll,
  openSummary,
  room,
  roster,
  selected,
  busy,
  act,
  id,
  currentPass,
  passOf,
  passHeading,
  sideLabel,
  hpLevel,
  hpRatio,
  paSlots,
  inspectActor,
  feed,
  filter,
  feedCollapsed,
  unreadEvents,
  latest,
  latestRevelation,
  date,
  forceFeed,
  openRevelations,
  toggleFeed,
  chosen,
  toggleGmTools,
  adjustAmount,
  text,
  link,
  image,
  imageBusy,
  recipient,
  gmLabel,
  gmBonus,
  gmStress,
  gmPublic,
  gmFaces,
  gmCount,
  shortcutsOpen
});
</script>
<template>
 <div class="live-page" :class="{'drawer-open':panelOpen}"><p class="sr-only" aria-live="polite">{{ announcement }}</p><header class="live-header"><div><p class="eyebrow">TERRA UMBRA · EN JEU</p><h1>{{ room?.campaignName??'Table de jeu' }}</h1></div><nav><button v-if="room&&ambience!=='off'" type="button" class="sound-toggle" :aria-pressed="soundOn" @click="toggleSound">{{ soundOn?'Son de la table : activé':'Activer le son de la table' }}</button><RouterLink :to="`/campaigns/${id}`">← Campagne</RouterLink><RouterLink to="/account">Mon espace</RouterLink></nav></header>
 <div v-if="room&&ownActor" class="phone-vitals" role="group" aria-label="Mon personnage"><strong>{{ ownActor.name }}</strong><span class="pv-mini"><span>{{ ownActor.hp }} / {{ ownActor.pvMax }} PV</span><span class="hp-mini" aria-hidden="true"><span :class="hpLevel(ownActor)" :style="{width:hpRatio(ownActor)*100+'%'}"></span></span></span><span v-if="room.combat?.active&&paSlots(ownActor)" class="pa-mini" role="img" :aria-label="`${ownActor.pa} PA restants`"><i v-for="n in paSlots(ownActor)" :key="n" :class="{spent:n>ownActor.pa}"></i></span><span v-if="room.combat?.active" class="round-mini">Round {{ room.combat.round }}</span></div>
 <p v-if="connectionLost&&room" class="live-offline" role="status">Connexion perdue : la table montre le dernier état connu et ta saisie est gardée. Nouvel essai en cours…</p><div v-if="error" role="alert"><p>{{ error }}</p><RouterLink :to="`/account?redirect=${encodeURIComponent(route.fullPath)}`">Se connecter</RouterLink><button @click="load">Réessayer</button></div>
 <p v-else-if="!room" role="status">Ouverture de la table…</p>
 <div v-else class="live-layout">
  <ParticipantRail />
  <main class="live-main"><section class="mode-heading" aria-label="Situation de la table"><div><p class="mode-label">{{room.combat?.active?'Combat':'Exploration'}}<span v-if="room.session?.title"> · {{room.session.title}}</span></p><h2>{{room.combat?.active?'Round '+room.combat.round:'En jeu'}}</h2><p>{{room.combat?.active?(initiativeCount?initiativeCount+' initiative'+(initiativeCount>1?'s':'')+' à lancer':room.combat.mode==='automatic'?'Round suivant quand les PA sont épuisés':'Rounds dirigés par le MJ'):room.canManage?'Mener la scène : participants, révélations et jets':'Jets, ressources et capacités de ton personnage'}}</p></div><div v-if="room.canManage" class="table-primary-actions combat-controls"><button v-if="!room.combat?.active" class="ui-primary" :disabled="busy" @click="act('combat-start',{version:room.combat?.version??0})">Lancer le combat</button><template v-else><button class="ui-primary" :disabled="busy" @click="act('combat-round',{version:room.combat.version})">Round suivant pour tous</button><button class="ui-danger" :disabled="busy" @click="act('combat-stop',{version:room.combat.version})">Arrêter le combat</button></template><button :aria-expanded="gmToolsOpen" aria-controls="campaign-gm-tools" @click="toggleGmTools">Outils du MJ <span v-if="occultAttention" class="attention-badge">{{occultAttention}} à résoudre</span></button></div></section>
   <div v-if="myTurn&&!ownActor?.initiativePending" class="turn-banner" role="status"><span><strong>C’est ton tour.</strong> {{ ownActor?.pa ?? 0 }} PA disponible{{ (ownActor?.pa ?? 0) > 1 ? 's' : '' }}<template v-if="timerLeft"> · {{ timerText }} restantes</template></span><span class="turn-banner-actions"><button class="ui-primary" @click="openAttack">Attaquer</button><button @click="ownPanel('jets')">Lancer un jet</button></span></div>
   <div v-if="room.combat?.active&&ownActor?.initiativePending&&ownActor?.participating!==false" class="combat-controls"><strong>À toi : lance ton initiative pour ce combat.</strong> <button class="ui-primary" :disabled="busy" @click="rollOwnInitiative">◈ Lancer mon initiative</button><button @click="selected=room.ownCharacterId">Ma fiche / dépenser de l’Edge</button></div>


   <section class="table-stage" aria-label="Scène de la campagne" :class="{'has-scene-image':sceneImage}">
    <img v-if="sceneImage" class="scene-art" :src="sceneImage.image" alt="Scène partagée par le MJ" />
    <div v-if="sceneImage" class="scene-image-actions"><a :href="sceneImage.image" target="_blank" rel="noopener">Voir l’image en grand ↗</a><button v-if="room.canManage" type="button" class="ui-quiet" :disabled="busy" @click="act('withdraw',{eventId:sceneImage.id})">Retirer l’image</button></div><div v-if="turnNames.length||timerLeft" class="stage-top"><div v-if="turnNames.length" class="turn-chip"><span>Au tour de</span><strong>{{ turnNames.join(', ') }}</strong></div><div v-if="timerLeft" class="turn-timer" role="timer" :aria-label="`Minuteur : ${timerText} restantes`" :style="{'--timer-ratio':timerTotal?timerLeft/timerTotal:0}"><span>{{ timerText }}</span></div></div><div class="scene-caption"><span class="stage-kicker">{{room.combat?.active?'Combat en cours':'À la table'}}</span><h2>{{sceneImage?.payload.label??room.session?.title??'La scène'}}</h2><p v-if="latestRevelation?.payload.text" :key="latestRevelation.id" class="revealed">{{latestRevelation.payload.text}}</p><p v-else-if="!sceneImage">{{room.canManage?'Partage une scène, puis fais vivre la partie.':'La scène, les révélations et vos actions se retrouvent ici.'}}</p><button v-if="room.canManage&&!sceneImage" @click="toggleGmTools">Partager une scène</button></div>
    <button v-if="latest" :key="latest.id" class="stage-roll" @click="feedCollapsed=false"><span v-if="latest.payload.dice?.length&&(latest.payload.faces??10)===10" class="stage-dice" aria-hidden="true"><svg v-for="(d,i) in latest.payload.dice.slice(0,3)" :key="i" class="d10" viewBox="0 0 100 100" :style="{animationDelay:i*0.15+'s'}"><path class="d10-body" d="M50 4 96 46 50 96 4 46Z" /><path class="d10-facets" d="M50 4 30 54 50 64 70 54Z M4 46 30 54 M96 46 70 54 M50 64 50 96" /><text x="50" y="40" :style="{animationDelay:(0.55+i*0.15)+'s'}">{{ d }}</text></svg></span><span>{{latest.characterName??latest.payload.characterName??'MJ'}} · {{latest.payload.label}}</span><strong>{{latest.payload.total}}</strong><small>{{latest.payload.narrativeFailure?'Échec narratif':latest.payload.exploded?'Explosion !':'Voir le détail dans le journal'}}</small></button>
   </section>

   <GmDock />
   <button v-if="supportAttention" class="support-prompt response-prompt" @click="openPanel('character','truth')">{{supportAttention}} demande{{supportAttention>1?'s':''}} de soin ou de protection <span>Répondre →</span></button>
   <div v-if="rollRequest" class="response-prompt roll-request" role="status"><span>Le MJ te demande un jet : <strong>{{ rollRequest.payload.request }}</strong></span><span class="roll-request-actions"><button class="ui-primary" @click="answerRollRequest">Lancer ce jet</button><button class="ui-quiet" @click="dismissedRequest=rollRequest.id">Plus tard</button></span></div>
   <button v-if="combatAttention" class="response-prompt" @click="openPanel('response')">{{combatAttention}} réponse{{combatAttention>1?'s':''}} de combat à traiter <span>Choisir ma défense →</span></button>
   <p v-if="actionError" role="alert">{{ actionError }} <button v-if="pending" :disabled="busy" @click="sendPending">Réessayer l’action</button></p><p v-if="notice" role="status">{{ notice }}</p>
   <CampaignOccultConsent v-if="!room.canManage" :campaign-id="id" @refresh="load" />



  </main>
 <TableJournal />
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
    <header class="workspace-header"><div><small>{{panelMode==='gm'||panelMode==='summary'?'MJ':chosen?.name??'Table de jeu'}}</small><h2 id="table-workspace-title">{{panelTitle}}</h2></div><button type="button" class="workspace-close" aria-label="Fermer le panneau" @click="closePanel">✕</button></header>
    <nav v-if="panelMode==='character'&&chosen?.kind==='character'&&(room.canManage||chosen.id===room.ownCharacterId)" class="workspace-tabs" aria-label="Actions du personnage"><button v-for="[key,label] in [['jets','Jets'],['truth','Pouvoirs'],['equipment','Sac'],['states','État']]" :key="key" :aria-pressed="characterTab===key" @click="characterTab=key">{{label}}</button></nav><div class="workspace-body"><section v-if="panelMode==='summary'" class="session-summary"><p v-if="summaryBusy" role="status">Lecture du journal de la séance…</p><template v-else><p>Tout le journal de la séance affichée, du plus ancien au plus récent. Copie-le dans tes notes de campagne et retouche-le.</p><textarea :value="summaryText" readonly rows="18" aria-label="Résumé de séance" /><button type="button" class="ui-primary" @click="copySummary">Copier le résumé</button></template></section><CampaignTargetedPowers @attention="supportAttention=$event" v-show="panelMode==='character'&&characterTab==='truth'" :campaign-id="id" :room="room" @changed="load" />   <details v-if="room.canManage" v-show="panelMode==='gm'" id="campaign-gm-tools" class="gm-tools" :open="gmToolsOpen" @toggle="gmToolsOpen=($event.target as HTMLDetailsElement).open"><summary>Outils du MJ <span v-if="occultAttention" class="attention-badge">{{occultAttention}} à résoudre</span><span>Participants, révélations, effets & séance</span></summary><div class="gm-tools-content">
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
<style scoped>.mode-heading{padding:0 0 12px}.mode-heading h2{margin:0}.participant-control p{font-size:var(--ui-text-md);color:var(--ui-ink-soft)}.participant-reference{margin:16px 0;padding:14px;border:1px solid var(--ui-line);border-radius:8px}.participant-reference p{white-space:pre-wrap;line-height:1.5}.participant-reference h4{margin-bottom:8px}
.live-page{max-width:1800px;margin:auto;padding:24px;color:var(--ui-ink);overflow-wrap:anywhere}.live-header,.live-header nav,.sheet-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.live-header{margin-bottom:24px}.live-header h1{margin:4px 0}.live-page a{color:var(--ui-link)}.live-layout{display:grid;grid-template-columns:280px minmax(0,1fr);gap:24px;align-items:start}.live-main,.active-sheet{min-width:0}.active-sheet{padding:20px;background:var(--ui-panel);border:1px solid var(--ui-line);border-radius:10px}.combat-controls{margin-bottom:16px;padding:12px;background:var(--ui-panel-2);border:1px solid var(--ui-line);border-radius:8px}.active-sheet,.combat-resolution{scroll-margin-top:45vh}.image-preview{max-width:240px;max-height:180px}.live-page label{display:grid;gap:6px;margin:8px 0;min-width:0}.live-page input:not([type=checkbox]),.live-page textarea,.live-page select{box-sizing:border-box;width:100%;min-width:0;padding:10px;background:var(--ui-input);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit}.live-page button{padding:10px 14px;min-height:44px;background:var(--ui-btn);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit;cursor:pointer}.live-page button:disabled{opacity:.5;cursor:default}.live-page summary{cursor:pointer;padding:14px 0;min-height:24px}.live-page fieldset{border:1px solid var(--ui-line);border-radius:8px;min-width:0;margin:14px 0}.actor-controls,.combatant-status{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.actor-controls label{flex:1;min-width:120px}.actor-controls .check{display:flex;align-items:center}.combatant-status{padding:12px;background:var(--ui-raised)}.live-page :focus-visible{outline:2px solid var(--ui-link);outline-offset:3px}@media(max-width:800px){.live-page{padding:12px}.live-layout{grid-template-columns:1fr}.active-sheet{padding:12px}}

.mode-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 16px;margin-bottom:16px;border:1px solid var(--ui-line);border-radius:10px;background:var(--ui-panel-2)}.mode-label{font-size:var(--ui-text-sm);color:var(--ui-link);font-weight:600;margin:0}.mode-heading h2{font-size:var(--ui-text-lg);margin:4px 0}.mode-heading p:last-child{margin:4px 0;font-size:var(--ui-text-md);color:var(--ui-ink-soft)}.table-primary-actions{display:flex;gap:8px;flex-wrap:wrap;border:0;padding:0;margin:0;background:transparent}.gm-tools{padding:0 14px;margin-bottom:16px;border:1px solid var(--ui-line);border-radius:8px;background:var(--ui-panel);scroll-margin-top:140px}.gm-tools>summary{font-weight:600}.gm-tools>summary>span{font-size:var(--ui-text-sm);font-weight:400;color:var(--ui-ink-soft);margin-left:8px}.gm-tools-content{padding-bottom:12px}.gm-tools-content>details{border-bottom:1px solid var(--ui-line);padding:0 4px}.attention-badge{display:inline-block;margin-left:8px;border-radius:20px;padding:2px 7px;font-size:var(--ui-text-sm);background:var(--ui-warn-bg);color:var(--ui-warn-ink)}.participant-roll-options{flex-basis:100%;min-width:0;width:100%}.participant-roll-options summary{font-size:var(--ui-text-md)}.participant-settings{margin:10px 0}.participant-reference>summary{font-weight:600}.active-sheet{scroll-margin-top:160px}@media(max-width:800px){.mode-heading{padding:10px 12px}.mode-heading p:last-child{font-size:var(--ui-text-sm)}.table-primary-actions{width:100%}.table-primary-actions button{flex:1;min-width:110px}.gm-tools>summary>span{display:block;margin:5px 0 0 16px}.live-layout{gap:12px}.gm-tools{scroll-margin-top:160px}}</style>
<style scoped>
.live-page{max-width:1800px;margin:auto;padding:12px 16px}.live-header{padding:0 4px 12px}.live-header h1{font-size:1.35rem;margin:2px 0}.live-header .eyebrow{font-size:var(--ui-text-xs);color:var(--ui-muted)}.live-layout{display:grid;grid-template-columns:270px minmax(0,1fr) 320px;grid-template-rows:minmax(480px,1fr) auto;grid-template-areas:"roster stage journal" "actions actions actions";gap:14px;min-height:calc(100dvh - 180px);align-items:stretch}.live-main{grid-area:stage;display:flex;flex-direction:column;gap:12px;min-width:0}.mode-heading{margin:0;padding:10px 14px;background:var(--ui-panel-2);border:1px solid var(--ui-line);border-radius:12px}.mode-heading h2{font-size:var(--ui-text-base)}.mode-heading p:last-child,.mode-label{font-size:var(--ui-text-xs)}.table-primary-actions button{padding:7px 10px;font-size:var(--ui-text-sm);min-height:36px}.table-stage{position:relative;flex:1;min-height:410px;overflow:hidden;border-radius:16px;border:1px solid var(--ui-line);background:radial-gradient(ellipse at 25% 30%,var(--ui-accent-bg),var(--ui-panel-2) 42%,var(--ui-input));display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(20px,4vw,48px);isolation:isolate}.scene-art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:-2;background:var(--ui-input)}.has-scene-image:after{content:"";position:absolute;inset:40% 0 0;background:linear-gradient(transparent,#040c14ee);z-index:-1;pointer-events:none}.scene-caption{max-width:650px}.stage-kicker{text-transform:uppercase;letter-spacing:.15em;font-size:var(--ui-text-xs);color:var(--ui-accent-soft)}.scene-caption h2{font-size:clamp(1.6rem,3vw,2.7rem);line-height:1.1;margin:12px 0}.scene-caption p{line-height:1.6;color:var(--ui-ink-soft);max-height:150px;overflow:auto;white-space:pre-wrap}.stage-roll{display:grid;grid-template-columns:1fr auto;gap:5px 20px;margin-top:24px;text-align:left;width:100%;max-width:500px;padding:16px 20px;background:#091521e8;border:1px solid #6c9e92;border-radius:12px}.stage-roll>strong{font-size:2.1rem;grid-column:2;grid-row:1 / 3;color:#d4efd5}.stage-roll small{font-size:var(--ui-text-xs);color:var(--ui-neutral)}.response-prompt{display:flex;justify-content:space-between;gap:8px;text-align:left;background:var(--ui-warn-bg);border:1px solid var(--ui-warn);padding:14px;border-radius:10px}.table-actionbar{grid-area:actions;position:sticky;bottom:10px;z-index:30;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:12px;background:#10232df5;border:1px solid var(--c-reality-deep);border-radius:16px;box-shadow:0 10px 35px #0008;backdrop-filter:blur(12px)}.table-actionbar>button{display:flex;align-items:center;gap:8px;min-height:46px;padding:10px 16px;background:var(--ui-accent-bg);border:1px solid var(--ui-line);border-radius:9px;font-size:var(--ui-text-sm)}.table-actionbar>button:hover{background:var(--ui-line);border-color:var(--ui-accent-soft)}.table-actionbar>button>span{font-size:var(--ui-text-lg);color:var(--ui-accent-soft)}.actionbar-vitals{display:flex;flex-direction:column;font-size:var(--ui-text-sm);padding-right:18px;border-right:1px solid var(--ui-line)}.actionbar-vitals span{color:var(--ui-accent-soft)}.table-actionbar .response-action{background:#67472c}.table-workspace{position:fixed;inset:0;margin:auto;width:min(880px,calc(100vw - 40px));max-width:none;max-height:calc(100dvh - 60px);padding:0;border:1px solid #5f8a80;border-radius:16px;color:var(--ui-ink);background:var(--ui-panel);box-shadow:0 20px 90px #000a}.table-workspace[open]{display:flex;flex-direction:column}.table-workspace:not([open]){display:none}.table-workspace::backdrop{background:#02080fc7;backdrop-filter:blur(4px)}.workspace-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 22px;border-bottom:1px solid var(--ui-line);background:var(--ui-accent-bg)}.workspace-header small{color:var(--ui-accent-soft)}.workspace-header h2{margin:4px 0 0;font-size:var(--ui-text-lg)}.workspace-close{min-width:44px;min-height:44px;background:transparent;border:1px solid var(--ui-line-strong);border-radius:8px}.workspace-body{overflow:auto;overscroll-behavior:contain;padding:20px;min-height:0}.workspace-body .active-sheet{border:0;padding:0;background:none}.workspace-body .sheet-heading>h2{display:none}.workspace-body .gm-tools{margin:0;border:0;padding:0;background:none}.workspace-body .gm-tools>summary{display:none}.public-actor-card{text-align:center}.public-actor-card :deep(.portrait-trigger){display:block;width:fit-content;margin:12px auto}.public-actor-card :deep(.portrait-trigger img){width:150px;height:190px;object-fit:cover;border-radius:12px}.public-description{text-align:left;max-width:560px;margin:24px auto 0;padding:16px;border:1px solid var(--ui-line);border-radius:12px}.public-description h4{margin:0 0 12px}.public-description p{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6;margin:0}.table-actionbar button:focus-visible,.workspace-close:focus-visible,.stage-roll:focus-visible{outline:3px solid var(--ui-success-ink);outline-offset:3px}
@media(max-width:1100px){.live-layout{grid-template-columns:230px minmax(0,1fr) 260px}.table-actionbar>button{padding:9px 12px}}
@media(max-width:850px){.live-page{padding:10px}.live-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto auto auto;grid-template-areas:"roster" "stage" "journal" "actions";min-height:0;gap:10px}.table-stage{min-height:350px;padding:22px}.table-actionbar{flex-wrap:nowrap;justify-content:flex-start;overflow-x:auto;bottom:6px;padding:8px;border-radius:12px}.table-actionbar>button{flex:none;flex-direction:column;gap:2px;font-size:var(--ui-text-xs);min-width:75px;padding:7px}.actionbar-vitals{flex:none;padding-right:8px;max-width:110px}.mode-heading{padding:10px}.table-primary-actions{width:auto}.table-primary-actions button{min-width:0;flex:none}.table-workspace{width:calc(100vw - 12px);max-height:calc(100dvh - 12px);border-radius:12px}.workspace-body{padding:12px}.workspace-header{padding:12px}.response-prompt{font-size:var(--ui-text-sm);flex-wrap:wrap}.table-actionbar{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));overflow:visible;gap:6px}.table-actionbar>button{min-width:0;width:100%;align-items:center;justify-content:center;text-align:center;line-height:1.15;overflow-wrap:normal;padding:7px 4px}.actionbar-vitals{grid-column:1 / -1;flex-direction:row;justify-content:space-between;max-width:none;padding:0 4px 4px;border-right:0;border-bottom:1px solid var(--ui-line)}}.live-page :deep(button.ui-primary){background:var(--ui-accent);border-color:var(--ui-accent);color:var(--ui-accent-on);font-weight:600}.live-page :deep(button.ui-primary:hover:not(:disabled)){background:var(--ui-accent-soft)}.live-page :deep(button.ui-danger){background:var(--ui-danger-bg);border-color:var(--ui-enemy);color:var(--ui-danger-ink)}.live-page :deep(button.ui-quiet){background:transparent;border-color:transparent;color:var(--ui-link);text-decoration:underline;text-underline-offset:3px}.live-page :deep(button.ui-quiet:hover:not(:disabled)){border-color:var(--ui-line)}
</style>

<style scoped>.workspace-tabs{display:flex;gap:6px;padding:10px 20px;background:var(--ui-panel-2);border-bottom:1px solid var(--ui-line)}.workspace-tabs button{flex:1;background:var(--ui-accent-bg);border:1px solid var(--ui-line);border-radius:8px;padding:8px}.workspace-tabs button[aria-pressed="true"]{background:var(--ui-line);border-color:var(--ui-accent-soft)}</style>
<style scoped>
@media(min-width:851px){.table-workspace{inset:0 0 0 auto;margin:0;width:min(500px,100vw);height:100dvh;max-height:none;border-radius:16px 0 0 16px;z-index:50;box-shadow:-20px 0 60px #0009}}@media(min-width:1300px){.live-page.drawer-open{padding-right:516px;max-width:none}}@media(max-width:850px){.table-workspace{inset:auto 0 0 0;margin:0;width:100vw;max-height:82dvh;border-radius:16px 16px 0 0;z-index:50;box-shadow:0 -20px 60px #0009}}.roll-request{background:var(--ui-accent-bg);border-color:var(--ui-accent);align-items:center;flex-wrap:wrap}.roll-request-actions{display:flex;gap:8px}.scene-image-actions{position:absolute;top:12px;right:12px;display:flex;gap:10px;align-items:center;padding:4px 10px;border-radius:999px;background:#040c14cc;font-size:var(--ui-text-sm)}.session-summary{display:grid;gap:10px}.session-summary textarea{font:var(--ui-text-sm)/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap}.sound-toggle{min-height:36px!important;padding:6px 12px!important;font-size:var(--ui-text-sm)!important}.turn-banner{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:12px 16px;border-radius:12px;background:var(--ui-accent-bg);border:1px solid var(--ui-accent)}.turn-banner-actions{display:flex;gap:8px}.stage-top{position:absolute;top:16px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;pointer-events:none}.stage-top>*{pointer-events:auto}.turn-chip{display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:12px;background:#081520e6;border:1px solid var(--ui-accent)}.turn-chip span{font-size:var(--ui-text-xs);letter-spacing:.1em;text-transform:uppercase;color:var(--ui-accent)}.turn-timer{margin-left:auto;width:60px;height:60px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--ui-accent) calc(var(--timer-ratio) * 360deg),var(--ui-raised) 0)}.turn-timer span{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--ui-panel);font-weight:700;font-size:var(--ui-text-sm)}.has-scene-image .stage-top{top:56px}@keyframes roll-pop{0%{transform:scale(.6);opacity:0}55%{transform:scale(1.18);opacity:1;text-shadow:0 0 22px var(--ui-accent)}100%{transform:none;text-shadow:none}}@keyframes reveal-in{from{filter:blur(6px);opacity:0}to{filter:none;opacity:1}}@keyframes rise-in{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}.stage-roll{animation:rise-in .3s ease-out}.stage-roll>strong{animation:roll-pop .5s cubic-bezier(.2,.8,.2,1)}.scene-caption p.revealed{animation:reveal-in .6s ease-out}.turn-banner,.turn-chip{animation:rise-in .3s ease-out}.table-workspace[open]{animation:drawer-in .25s ease-out}@keyframes drawer-in{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}@media(max-width:850px){.table-workspace[open]{animation-name:sheet-in}@keyframes sheet-in{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}}@media(prefers-reduced-motion:reduce){.stage-roll,.stage-roll>strong,.scene-caption p.revealed,.turn-banner,.turn-chip,.table-workspace[open]{animation:none}}.stage-roll{grid-template-columns:auto 1fr auto!important}.stage-roll>span:not(.stage-dice),.stage-roll>small{grid-column:2}.stage-roll>strong{grid-column:3!important}.stage-dice{grid-column:1;grid-row:1 / 3;display:flex;gap:4px;align-items:center}.d10{width:46px;height:46px;overflow:visible;animation:d10-roll .7s cubic-bezier(.2,.8,.25,1) both}.d10-body{fill:var(--ui-raised);stroke:var(--ui-accent);stroke-width:3;stroke-linejoin:round}.d10-facets{fill:none;stroke:var(--ui-accent);stroke-width:2;opacity:.6}.d10 text{font:700 22px "Inter Variable",Inter,sans-serif;fill:var(--ui-ink);text-anchor:middle;dominant-baseline:middle;animation:d10-face .25s ease-out both}@keyframes d10-roll{0%{transform:translate(-60px,-24px) rotate(-540deg) scale(.5);opacity:0}60%{transform:translate(4px,2px) rotate(20deg) scale(1.08);opacity:1}80%{transform:rotate(-6deg)}100%{transform:none}}@keyframes d10-face{from{opacity:0}to{opacity:1}}.stage-roll>strong{animation-delay:.6s!important;animation-fill-mode:both!important}@media(prefers-reduced-motion:reduce){.d10,.d10 text{animation:none}}
.phone-vitals{display:none}@media(max-width:850px){.phone-vitals{position:sticky;top:0;z-index:31;display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:10px;margin:0 -10px 10px;padding:8px 12px;background:var(--ui-panel);border-bottom:1px solid var(--ui-line-strong);box-shadow:0 6px 18px #0006}.phone-vitals>strong{font-size:var(--ui-text-sm);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:9rem}.pv-mini{display:flex;flex-direction:column;gap:3px;min-width:0;font-size:var(--ui-text-xs);color:var(--ui-ink-soft)}.hp-mini{display:block;height:5px;border-radius:3px;background:var(--ui-input);overflow:hidden}.hp-mini>span{display:block;height:100%;transition:width .5s ease-in-out}.hp-mini .ok{background:var(--ui-ally)}.hp-mini .low{background:var(--ui-warn)}.hp-mini .critical,.hp-mini .down{background:var(--ui-enemy)}.pa-mini{display:flex;gap:3px}.pa-mini i{width:9px;height:9px;border-radius:50%;background:var(--ui-link);border:1px solid var(--ui-link)}.pa-mini i.spent{background:transparent;border-color:var(--ui-line-strong)}.round-mini{font-size:var(--ui-text-xs);color:var(--ui-link)}.table-actionbar .actionbar-vitals{display:none}}@media(prefers-reduced-motion:reduce){.hp-mini>span{transition:none}}
@media(max-width:850px){.stage-top{position:static;margin-bottom:auto;padding-bottom:16px}}
.live-offline{position:sticky;top:0;z-index:30;margin:0 0 8px;padding:8px 12px;border-radius:6px;background:#33280f;color:var(--c-attention);border:1px solid color-mix(in srgb,var(--c-attention) 40%,transparent)}
</style>
