// Mises à jour en temps réel (Server-Sent Events, apps/api/src/live-events.ts).
// Un écran s'abonne à une campagne ou à une fiche : il recharge sa partie dès que
// le serveur annonce un changement, au lieu d'interroger toutes les 3 secondes.
// Une seule connexion par adresse, partagée par les écrans de la page.
// Sécurités : tant que le flux n'est pas ouvert (ou s'il est refusé), l'écran
// revient à son ancien rafraîchissement ; une fois ouvert, une relecture lente
// rattrape un message perdu ; rien ne tourne quand l'onglet est caché, et
// l'écran se relit en revenant au premier plan.
import { onMounted, onUnmounted } from "vue";

type Channel = { source: EventSource | null; open: boolean; listeners: Set<() => void>; states: Set<(open: boolean) => void> };
const channels = new Map<string, Channel>();
const SAFETY_POLL_MS = 60_000;

function channel(url: string): Channel {
  let current = channels.get(url);
  if (current) return current;
  const created: Channel = { source: null, open: false, listeners: new Set(), states: new Set() };
  channels.set(url, created);
  if (typeof EventSource === "function") {
    const source = new EventSource(url, { withCredentials: true });
    created.source = source;
    const setOpen = (open: boolean) => {
      if (created.open === open) return;
      created.open = open;
      created.states.forEach((notify) => notify(open));
    };
    source.addEventListener("ready", () => setOpen(true));
    source.addEventListener("change", () => created.listeners.forEach((listener) => listener()));
    // Coupure : le navigateur se reconnecte seul ; refus (404, 401) : la connexion se ferme.
    source.addEventListener("error", () => setOpen(false));
  }
  return created;
}

function release(url: string, listener: () => void, state: (open: boolean) => void) {
  const current = channels.get(url);
  if (!current) return;
  current.listeners.delete(listener);
  current.states.delete(state);
  if (!current.listeners.size) {
    current.source?.close();
    channels.delete(url);
  }
}

/**
 * Recharge `refresh` à chaque changement annoncé sur `url`
 * (« /api/campaigns/<id>/events » ou « /api/characters/<id>/events »).
 * `fallbackMs` : ancien intervalle, utilisé seulement sans temps réel.
 */
export function useLiveUpdates(url: () => string | null | undefined, refresh: () => void, fallbackMs: number) {
  let timer: ReturnType<typeof setInterval> | undefined;
  let debounce: ReturnType<typeof setTimeout> | undefined;
  let subscribed: string | null = null;
  let open = false;
  const visible = () => typeof document === "undefined" || document.visibilityState === "visible";
  const trigger = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { if (visible()) refresh(); }, 120);
  };
  const schedule = () => {
    clearInterval(timer);
    timer = setInterval(() => { if (visible()) refresh(); }, open ? SAFETY_POLL_MS : fallbackMs);
  };
  const onState = (next: boolean) => {
    const reopened = next && !open;
    open = next;
    schedule();
    if (reopened) trigger(); // rattrape ce qui a pu se passer pendant la coupure
  };
  const onVisibility = () => { if (visible()) trigger(); };
  const start = () => {
    const target = url();
    if (target) {
      subscribed = target;
      const current = channel(target);
      current.listeners.add(trigger);
      current.states.add(onState);
      open = current.open;
    }
    schedule();
  };
  const stop = () => {
    clearInterval(timer);
    clearTimeout(debounce);
    if (subscribed) release(subscribed, trigger, onState);
    subscribed = null;
  };
  onMounted(() => {
    start();
    document.addEventListener("visibilitychange", onVisibility);
  });
  onUnmounted(() => {
    stop();
    document.removeEventListener("visibilitychange", onVisibility);
  });
  return {
    /** À appeler si l'adresse change (autre campagne ou autre fiche). */
    restart() { stop(); start(); }
  };
}
