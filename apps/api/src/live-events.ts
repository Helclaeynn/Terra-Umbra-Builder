// Temps réel de la table : le serveur prévient les navigateurs dès qu'une
// campagne ou une fiche change (Server-Sent Events), au lieu que chaque écran
// redemande tout toutes les 3 secondes.
//
// Deux canaux : « campaign:<id> » (table de jeu, combat, pouvoirs, séances…)
// et « character:<id> » (fiche en partie). Le message ne contient que le sujet
// du changement : chaque écran recharge ensuite sa partie par les routes
// habituelles, qui appliquent les droits de lecture. Rien de privé ne transite.
//
// Un seul processus API en production : les abonnés sont gardés en mémoire.
// Avec plusieurs processus, il faudrait relayer par PostgreSQL (LISTEN/NOTIFY).
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requireUser } from "./auth.js";
import { pool } from "./db.js";
import { characterAccess } from "./character-play.js";

type Listener = (topic: string) => void;
const channels = new Map<string, Set<Listener>>();
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEARTBEAT_MS = 25_000;
const gm = (role: string) => ["gm", "editor", "admin"].includes(role);

export function publishLiveChange(channel: string, topic: string) {
  for (const listener of channels.get(channel) ?? []) listener(topic);
}

export function liveSubscriberCount() {
  let n = 0;
  for (const set of channels.values()) n += set.size;
  return n;
}

function subscribe(keys: string[], listener: Listener) {
  for (const key of keys) {
    if (!channels.has(key)) channels.set(key, new Set());
    channels.get(key)!.add(listener);
  }
  return () => {
    for (const key of keys) {
      const set = channels.get(key);
      set?.delete(listener);
      if (set && !set.size) channels.delete(key);
    }
  };
}

/** Ouvre le flux : en-têtes qui empêchent toute mise en tampon (Caddy, navigateur). */
function stream(request: FastifyRequest, reply: FastifyReply, keys: string[]) {
  reply.hijack();
  const raw = reply.raw;
  raw.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-store, no-transform",
    "Content-Encoding": "identity",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  raw.write("retry: 5000\n\n");
  raw.write("event: ready\ndata: {}\n\n");
  const send = (topic: string) => raw.write(`event: change\ndata: ${JSON.stringify({ topic, at: Date.now() })}\n\n`);
  const unsubscribe = subscribe(keys, send);
  const heartbeat = setInterval(() => raw.write(": ping\n\n"), HEARTBEAT_MS);
  const close = () => { clearInterval(heartbeat); unsubscribe(); };
  request.raw.on("close", close);
  raw.on("error", close);
}

/** Campagne dont dépend une fiche (une copie de campagne a son campaign_id). */
async function characterCampaign(characterId: string): Promise<string | null> {
  const r = await pool.query<{ campaign_id: string | null }>("SELECT campaign_id FROM characters WHERE id = $1", [characterId]);
  return r.rows[0]?.campaign_id ?? null;
}

export async function registerLiveEventRoutes(app: FastifyInstance) {
  // Table de campagne : le MJ de la campagne ou un membre accepté (mêmes droits que /play).
  app.get<{ Params: { id: string } }>("/api/campaigns/:id/events", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    if (!UUID.test(request.params.id)) return reply.code(404).send({ error: "campaign_not_found" });
    const access = await pool.query(
      `SELECT 1 FROM campaigns c WHERE c.id = $1 AND c.archived_at IS NULL AND
        ((c.owner_id = $2 AND $3::boolean) OR EXISTS (SELECT 1 FROM campaign_members m
          WHERE m.campaign_id = c.id AND m.user_id = $2 AND m.status = 'accepted'))`,
      [request.params.id, user.id, gm(user.role)]
    );
    if (!access.rowCount) return reply.code(404).send({ error: "campaign_not_found" });
    stream(request, reply, [`campaign:${request.params.id}`]);
  });

  // Fiche en partie : mêmes droits que /api/characters/:id/play ; elle suit aussi sa campagne.
  app.get<{ Params: { id: string } }>("/api/characters/:id/events", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const character = await characterAccess(pool, request.params.id, user);
    if (!character) return reply.code(404).send({ error: "character_not_found" });
    const keys = [`character:${character.id}`];
    if (character.campaign_id) keys.push(`campaign:${character.campaign_id}`);
    stream(request, reply, keys);
  });

  // Toute écriture réussie sur une campagne ou une fiche prévient ses abonnés.
  app.addHook("onResponse", async (request, reply) => {
    if (request.method === "GET" || request.method === "HEAD" || reply.statusCode >= 400) return;
    const path = request.url.split("?")[0];
    const campaign = /^\/api\/campaigns\/([0-9a-f-]{36})(?:\/([a-z-]+))?/i.exec(path);
    if (campaign) {
      // Notes privées du MJ : la Table ne se recharge pas pour elles (TABLE_IGNORED_TOPICS côté site).
      const topic = /\/sessions\/[^/]+\/preparation$/.test(path) ? "session-preparation"
        : /\/play\/scene-notes$/.test(path) ? "scene-notes" : campaign[2] ?? "campaign";
      publishLiveChange(`campaign:${campaign[1]}`, topic);
      return;
    }
    const character = /^\/api\/characters\/([0-9a-f-]{36})(?:\/([a-z-]+))?/i.exec(path);
    if (character) {
      const topic = character[2] ?? "sheet";
      publishLiveChange(`character:${character[1]}`, topic);
      const campaignId = await characterCampaign(character[1]).catch(() => null);
      if (campaignId) publishLiveChange(`campaign:${campaignId}`, `character-${topic}`);
    }
  });
}
