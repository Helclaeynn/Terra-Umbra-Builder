// « Ce qui t'attend » : ce qu'un compte doit traiter, pour la pastille du site et la page
// Administration. Que des compteurs et des liens : le détail reste sur les pages concernées.
import type { FastifyInstance } from "fastify";
import { requireUser } from "./auth.js";
import { pool } from "./db.js";

type Item = { key: string; label: string; count: number; to: string };
const gm = (role: string) => ["gm", "editor", "admin"].includes(role);

async function count(sql: string, params: unknown[] = []) {
  const r = await pool.query<{ n: number }>(sql, params).catch(() => null);
  return r?.rows[0]?.n ?? 0; // une table absente (contenu pas encore en base) compte 0
}

export async function registerAttentionRoutes(app: FastifyInstance) {
  app.get("/api/attention", async (request, reply) => {
    reply.header("Cache-Control", "private, no-store");
    const user = await requireUser(request, reply);
    if (!user) return;
    const items: Item[] = [
      { key: "invitations", label: "Invitations à une campagne", to: "/campaigns",
        count: await count(`SELECT count(*)::int AS n FROM campaign_members m JOIN campaigns c ON c.id = m.campaign_id
          WHERE m.user_id = $1 AND m.status = 'invited' AND c.archived_at IS NULL`, [user.id]) },
      { key: "admission-changes", label: "Personnage à corriger pour une campagne", to: "/campaigns",
        count: await count(`SELECT count(*)::int AS n FROM campaign_members m JOIN campaigns c ON c.id = m.campaign_id
          WHERE m.user_id = $1 AND m.admission_status = 'changes_requested' AND c.archived_at IS NULL`, [user.id]) }
    ];
    if (gm(user.role)) items.push({ key: "admissions", label: "Personnages à accepter dans mes campagnes", to: "/campaigns",
      count: await count(`SELECT count(*)::int AS n FROM campaign_members m JOIN campaigns c ON c.id = m.campaign_id
        WHERE c.owner_id = $1 AND m.admission_status = 'pending' AND c.archived_at IS NULL`, [user.id]) });
    if (user.role === "admin") items.push(
      { key: "gm-requests", label: "Demandes d'accès MJ", to: "/admin",
        count: await count("SELECT count(*)::int AS n FROM gm_access_requests WHERE status = 'pending'") },
      { key: "npc-proposals", label: "PNJ proposés par les joueurs", to: "/admin/pnj-proposes",
        count: await count("SELECT count(*)::int AS n FROM npc_proposals WHERE status = 'pending'") },
      { key: "content-review", label: "Contenu en relecture (Directus)", to: "/admin",
        count: await count("SELECT count(*)::int AS n FROM content_entry WHERE status = 'review'") }
    );
    return { items, total: items.reduce((n, i) => n + i.count, 0), role: user.role };
  });
}
