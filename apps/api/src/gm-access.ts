import type { FastifyInstance } from "fastify";
import type { PoolClient } from "pg";
import { requireAdmin, requireUser } from "./auth.js";
import { pool } from "./db.js";

const fields = `id, user_id AS "userId", comment, status,
  created_at::text AS "createdAt", decided_at::text AS "decidedAt"`;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// The existing account administration uses this same lock: a manual role change,
// request submission and decision cannot overwrite each other.
async function lockAccounts(client: PoolClient) {
  await client.query("SELECT pg_advisory_xact_lock(88442212)");
}

export async function approvePendingGmRequest(client: PoolClient, userId: string, adminId: string) {
  await client.query(`UPDATE gm_access_requests SET status = 'approved', decided_at = now(), decided_by = $2
    WHERE user_id = $1 AND status = 'pending'`, [userId, adminId]);
}

export async function registerGmAccessRoutes(app: FastifyInstance) {
  app.get("/api/auth/gm-request", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const result = await pool.query(`SELECT ${fields} FROM gm_access_requests
      WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1`, [user.id]);
    return { request: result.rows[0] ?? null };
  });

  app.post<{ Body: { comment?: string } }>("/api/auth/gm-request", {
    bodyLimit: 8192,
    schema: { body: { type: "object", additionalProperties: false,
      properties: { comment: { type: "string", maxLength: 1000 } } } }
  }, async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await lockAccounts(client);
      const current = await client.query("SELECT role, is_active FROM users WHERE id = $1 FOR UPDATE", [user.id]);
      if (!current.rows[0]?.is_active || current.rows[0].role !== "player") {
        await client.query("ROLLBACK");
        return reply.code(409).send({ error: "gm_request_not_eligible" });
      }
      const result = await client.query(`INSERT INTO gm_access_requests (user_id, comment) VALUES ($1, $2)
        ON CONFLICT (user_id) WHERE status = 'pending' DO NOTHING RETURNING ${fields}`,
      [user.id, (request.body.comment ?? "").trim()]);
      if (!result.rowCount) {
        await client.query("ROLLBACK");
        return reply.code(409).send({ error: "gm_request_pending" });
      }
      await client.query("COMMIT");
      return reply.code(201).send({ request: result.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    } finally { client.release(); }
  });

  app.get("/api/admin/gm-requests", async (request, reply) => {
    if (!await requireAdmin(request, reply)) return;
    const result = await pool.query(`SELECT r.id, r.user_id AS "userId", r.comment, r.status,
      r.created_at::text AS "createdAt", u.display_name AS "displayName", u.email,
      u.is_active AS active, u.role
      FROM gm_access_requests r JOIN users u ON u.id = r.user_id
      WHERE r.status = 'pending' ORDER BY r.created_at, r.id`);
    return { requests: result.rows };
  });

  app.post<{ Params: { id: string }; Body: { decision: "approved" | "rejected" } }>(
    "/api/admin/gm-requests/:id/decision", {
      schema: { body: { type: "object", required: ["decision"], additionalProperties: false,
        properties: { decision: { type: "string", enum: ["approved", "rejected"] } } } }
    }, async (request, reply) => {
      const admin = await requireAdmin(request, reply);
      if (!admin) return;
      if (!uuid.test(request.params.id)) return reply.code(400).send({ error: "invalid_request_id" });
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await lockAccounts(client);
        const actor = await client.query("SELECT role, is_active FROM users WHERE id = $1", [admin.id]);
        if (!actor.rows[0]?.is_active || actor.rows[0].role !== "admin") {
          await client.query("ROLLBACK");
          return reply.code(403).send({ error: "admin_required" });
        }
        const result = await client.query(`SELECT r.*, u.role, u.is_active, u.email, u.display_name
          FROM gm_access_requests r JOIN users u ON u.id = r.user_id
          WHERE r.id = $1 FOR UPDATE OF r, u`, [request.params.id]);
        const target = result.rows[0];
        if (!target || target.status !== "pending") {
          await client.query("ROLLBACK");
          return reply.code(target ? 409 : 404).send({ error: target ? "gm_request_decided" : "gm_request_not_found" });
        }
        const decision = request.body.decision;
        if (decision === "approved" && (!target.is_active || target.role !== "player")) {
          await client.query("ROLLBACK");
          return reply.code(409).send({ error: "gm_request_not_eligible" });
        }
        if (decision === "approved") {
          await client.query("UPDATE users SET role = 'gm', updated_at = now() WHERE id = $1", [target.user_id]);
        }
        const updated = await client.query(`UPDATE gm_access_requests
          SET status = $2, decided_at = now(), decided_by = $3 WHERE id = $1 RETURNING ${fields}`,
        [target.id, decision, admin.id]);
        await client.query(`INSERT INTO admin_audit_log
          (actor_id, target_user_id, action, before_state, after_state) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`,
        [admin.id, target.user_id, `gm_request_${decision}`,
          JSON.stringify({ requestId: target.id, status: "pending", role: target.role, email: target.email, displayName: target.display_name }),
          JSON.stringify({ requestId: target.id, status: decision, role: decision === "approved" ? "gm" : target.role })]);
        await client.query("COMMIT");
        return { request: updated.rows[0] };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally { client.release(); }
    });
}
