// PNJ proposés par un joueur depuis le Builder (Contact fiable de Sphère,
// Contact de renom, contacts mineurs). Mêmes règles de création que le
// générateur canonique des administrateurs (validNpcData, paliers) ; le PNJ
// n'entre au Compendium qu'après validation : un administrateur l'ouvre dans
// l'éditeur (brouillon lié par article_id), relit, puis publie. Un refus est
// gardé avec sa raison ; rien n'est effacé.
import type { FastifyInstance, FastifyReply } from "fastify";
import { requireAdmin, requireUser } from "./auth.js";
import { pool } from "./db.js";
import { NPC_CATALOG, generateNpcBatch } from "./campaign-npc-generator.js";
import { cleanNpcData, validNpcData, type NpcData } from "./campaign-npc-model.js";
import { npcPortrait } from "./campaign-npcs.js";
import { canonicalNpcDraft } from "./canonical-npc-draft.js";

const TIER_RANK: Record<string, number> = Object.fromEntries(NPC_CATALOG.tiers.map((tier, index) => [tier.id, index]));
// Plafonds proposés par le Builder : Contact fiable / mineur (Élite), Contact de renom (Supérieur, Haute élite minimum).
const ALLOWED_MAX = new Set(["entraine", "elite", "superieur"]);
const ALLOWED_MIN = new Set(["haute-elite"]);
const MAX_PENDING_PER_USER = 10;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ProposalRow = {
  id: string; proposedBy: string; proposerName: string | null; characterId: string | null; characterName: string | null;
  maxTier: string; npc: NpcData; status: "pending" | "approved" | "rejected"; articleId: string | null;
  reviewNote: string; createdAt: string; reviewedAt: string | null;
};

const SELECT = `SELECT p.id, p.proposed_by AS "proposedBy", u.display_name AS "proposerName",
  p.character_id AS "characterId", c.name AS "characterName", p.max_tier AS "maxTier", p.npc, p.status,
  p.article_id AS "articleId", p.review_note AS "reviewNote", p.created_at::text AS "createdAt", p.reviewed_at::text AS "reviewedAt"
  FROM npc_proposals p JOIN users u ON u.id = p.proposed_by LEFT JOIN characters c ON c.id = p.character_id`;

const tierLabel = (id: string) => NPC_CATALOG.tiers.find((tier) => tier.id === id)?.name ?? id;
const bad = (reply: FastifyReply, error: string) => reply.code(400).send({ error });

/** Résumé montré au joueur et dans le sélecteur de contact (sans les blocs MJ). */
function summary(row: ProposalRow, published: boolean) {
  return {
    proposalId: row.id, title: row.npc.name, tierId: row.npc.tierId, tierLabel: tierLabel(row.npc.tierId),
    role: row.npc.role, status: row.status, articleId: row.articleId, published, reviewNote: row.reviewNote,
    createdAt: row.createdAt
  };
}

function tierAllowed(tierId: string, maxTier: string, minTier?: string) {
  const rank = TIER_RANK[tierId];
  if (rank === undefined || rank > TIER_RANK[maxTier]) return false;
  return !minTier || rank >= TIER_RANK[minTier];
}

export async function registerNpcProposalRoutes(app: FastifyInstance, isPublished: (articleId: string) => Promise<boolean>) {
  const base = "/api/npc-proposals";
  const published = async (row: ProposalRow) => Boolean(row.articleId && await isPublished(row.articleId));

  app.get(`${base}/catalog`, async (request, reply) => {
    if (!await requireUser(request, reply)) return;
    return NPC_CATALOG;
  });

  // Génération assistée, plafonnée au palier demandé par le Builder.
  app.post<{ Body: Record<string, unknown> }>(`${base}/generate`, async (request, reply) => {
    if (!await requireUser(request, reply)) return;
    const maxTier = String(request.body?.maxTier ?? "elite");
    if (!ALLOWED_MAX.has(maxTier) || !tierAllowed(String(request.body?.tierId ?? ""), maxTier)) return bad(reply, "invalid_npc_tier");
    const npcs = generateNpcBatch({ ...request.body, count: 1 });
    if (!npcs || npcs.length !== 1) return bad(reply, "invalid_npc_generator");
    return { npcs };
  });

  app.post<{ Body: { npc?: unknown; characterId?: unknown; maxTier?: unknown; minTier?: unknown } }>(base, async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const maxTier = String(request.body?.maxTier ?? "elite");
    const minTier = request.body?.minTier === undefined ? undefined : String(request.body.minTier);
    if (!ALLOWED_MAX.has(maxTier) || (minTier !== undefined && !ALLOWED_MIN.has(minTier))) return bad(reply, "invalid_npc_tier");
    const npc = request.body?.npc;
    if (!validNpcData(npc, NPC_CATALOG) || (npc.portrait && !npcPortrait(npc.portrait))) return bad(reply, "invalid_npc");
    if (!npc.name.trim()) return bad(reply, "invalid_npc");
    if (!tierAllowed(npc.tierId, maxTier, minTier)) return bad(reply, "invalid_npc_tier");
    let characterId: string | null = null;
    if (request.body?.characterId !== undefined) {
      characterId = String(request.body.characterId);
      if (!UUID_RE.test(characterId)) return bad(reply, "invalid_character_id");
      const owned = await pool.query("SELECT 1 FROM characters WHERE id = $1 AND owner_id = $2", [characterId, user.id]);
      if (!owned.rowCount) return reply.code(404).send({ error: "character_not_found" });
    }
    const pending = await pool.query("SELECT count(*)::int AS n FROM npc_proposals WHERE proposed_by = $1 AND status = 'pending'", [user.id]);
    if (pending.rows[0].n >= MAX_PENDING_PER_USER) return reply.code(429).send({ error: "npc_proposals_limit" });
    const { rows: [created] } = await pool.query<{ id: string }>(
      `INSERT INTO npc_proposals (proposed_by, character_id, max_tier, npc) VALUES ($1, $2, $3, $4::jsonb) RETURNING id`,
      [user.id, characterId, maxTier, JSON.stringify(cleanNpcData(npc))]
    );
    const { rows: [row] } = await pool.query<ProposalRow>(`${SELECT} WHERE p.id = $1`, [created.id]);
    return reply.code(201).send({ proposal: summary(row, false) });
  });

  app.get(`${base}/mine`, async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const { rows } = await pool.query<ProposalRow>(`${SELECT} WHERE p.proposed_by = $1 ORDER BY p.created_at DESC LIMIT 100`, [user.id]);
    return { proposals: await Promise.all(rows.map(async (row) => summary(row, await published(row)))) };
  });

  // Le joueur qui l'a proposé, ou un administrateur.
  app.get<{ Params: { id: string } }>(`${base}/:id`, async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_npc_proposal");
    const { rows: [row] } = await pool.query<ProposalRow>(`${SELECT} WHERE p.id = $1`, [request.params.id]);
    if (!row || (row.proposedBy !== user.id && user.role !== "admin")) return reply.code(404).send({ error: "npc_proposal_not_found" });
    return { proposal: summary(row, await published(row)), ...(user.role === "admin" ? { npc: row.npc } : {}) };
  });

  // ---------------------------------------------------------------- administrateurs

  app.get<{ Querystring: { status?: string } }>("/api/admin/npc-proposals", async (request, reply) => {
    if (!await requireAdmin(request, reply)) return;
    const status = String(request.query.status ?? "pending");
    if (!["pending", "approved", "rejected", "all"].includes(status)) return bad(reply, "invalid_npc_proposal_status");
    const { rows } = await pool.query<ProposalRow>(
      `${SELECT} ${status === "all" ? "" : "WHERE p.status = $1"} ORDER BY p.created_at DESC LIMIT 200`,
      status === "all" ? [] : [status]
    );
    return {
      proposals: await Promise.all(rows.map(async (row) => ({
        ...summary(row, await published(row)), npc: row.npc, proposerName: row.proposerName,
        characterName: row.characterName, maxTier: row.maxTier, reviewedAt: row.reviewedAt
      })))
    };
  });

  // Brouillon d'article prêt pour l'éditeur (même rendu que le générateur canonique).
  app.post<{ Params: { id: string } }>("/api/admin/npc-proposals/:id/preview", async (request, reply) => {
    if (!await requireAdmin(request, reply)) return;
    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_npc_proposal");
    const { rows: [row] } = await pool.query<ProposalRow>(`${SELECT} WHERE p.id = $1`, [request.params.id]);
    if (!row) return reply.code(404).send({ error: "npc_proposal_not_found" });
    return { article: canonicalNpcDraft(row.npc), npc: row.npc };
  });

  // L'éditeur a créé le brouillon : la proposition est acceptée et liée à sa page.
  app.post<{ Params: { id: string }; Body: { articleId?: unknown } }>("/api/admin/npc-proposals/:id/link", async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) return;
    const articleId = String(request.body?.articleId ?? "").trim();
    if (!UUID_RE.test(request.params.id) || !/^[a-z0-9-]{1,200}$/.test(articleId)) return bad(reply, "invalid_npc_proposal");
    const { rowCount } = await pool.query(
      `UPDATE npc_proposals SET status = 'approved', article_id = $2, reviewed_by = $3, reviewed_at = now(), updated_at = now()
        WHERE id = $1 AND status <> 'rejected'`,
      [request.params.id, articleId, admin.id]
    );
    if (!rowCount) return reply.code(409).send({ error: "npc_proposal_not_linkable" });
    return { ok: true };
  });

  app.post<{ Params: { id: string }; Body: { note?: unknown } }>("/api/admin/npc-proposals/:id/reject", async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) return;
    const note = String(request.body?.note ?? "").trim().slice(0, 1000);
    if (!UUID_RE.test(request.params.id) || !note) return bad(reply, "npc_proposal_note_required");
    const { rowCount } = await pool.query(
      `UPDATE npc_proposals SET status = 'rejected', review_note = $2, reviewed_by = $3, reviewed_at = now(), updated_at = now()
        WHERE id = $1 AND status = 'pending'`,
      [request.params.id, note, admin.id]
    );
    if (!rowCount) return reply.code(409).send({ error: "npc_proposal_not_pending" });
    return { ok: true };
  });
}
