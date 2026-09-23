import { randomBytes } from "node:crypto";
import cors from "@fastify/cors";
import Fastify, { type FastifyReply } from "fastify";
import {
  ROLES,
  clearSessionCookie,
  createSession,
  currentUser,
  destroySession,
  destroyUserSessions,
  hashPassword,
  hashSessionToken,
  normalizeEmail,
  passwordNeedsRehash,
  readSessionToken,
  requireAdmin,
  requireUser,
  setSessionCookie,
  validateDisplayName,
  validateEmail,
  validatePassword,
  verifyPassword,
  type Role
} from "./auth.js";
import { databaseStatus, pool } from "./db.js";
import { registerCharacterRoutes } from "./characters.js";
import { preloadCompendium, registerCompendiumRoutes } from "./compendium.js";
import { registerQualityRoutes } from "./quality.js";
import { preloadBuilderRules, registerRulesRoutes } from "./rules/index.js";
import { passwordResetMailAvailable, sendPasswordResetEmail } from "./mail.js";

const app = Fastify({
  logger: true,
  trustProxy: true
});

await app.register(cors, {
  origin: false
});

app.addHook("onSend", async (request, reply, payload) => {
  const privateCompendium =
    request.url.startsWith("/api/compendium/library") ||
    request.url.startsWith("/api/compendium/favorites") ||
    request.url.startsWith("/api/compendium/collections") ||
    request.url.startsWith("/api/compendium/editor");

  if (
    request.url.startsWith("/api/compendium/media/") ||
    request.url.startsWith("/api/compendium/uploads/")
  ) {
    reply.header("Cache-Control", "public, max-age=86400");
    return payload;
  }

  if (request.url.startsWith("/api/rulesets/terra-umbra/")) {
    reply.header("Cache-Control", "private, max-age=300");
    reply.header("Vary", "Cookie");
    return payload;
  }

  if (request.url.startsWith("/api/compendium/") && !privateCompendium) {
    if (request.headers.cookie) {
      reply.header("Cache-Control", "private, max-age=60");
      reply.header("Vary", "Cookie");
    } else {
      reply.header("Cache-Control", "public, max-age=60");
    }
    return payload;
  }

  if (
    request.url.startsWith("/api/auth/") ||
    request.url.startsWith("/api/admin/") ||
    request.url.startsWith("/api/characters") ||
    privateCompendium
  ) {
    reply.header("Cache-Control", "no-store, private");
    reply.header("Pragma", "no-cache");
  }

  return payload;
});

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

function loginKey(ip: string, email: string): string {
  return `${ip}:${email}`;
}

function consumeLoginAttempt(key: string): boolean {
  const now = Date.now();
  const current = loginAttempts.get(key);

  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }

  if (current.count >= LOGIN_MAX_ATTEMPTS) return false;
  current.count += 1;
  return true;
}

function clearLoginAttempts(key: string): void {
  loginAttempts.delete(key);
}

function inputError(reply: FastifyReply, error: string) {
  return reply.code(400).send({ error });
}

function isCiSmokeEmail(value: string | null | undefined): boolean {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized.startsWith("ci-") && normalized.endsWith("@example.invalid");
}

async function userCount(): Promise<number> {
  const result = await pool.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM users"
  );
  return Number(result.rows[0]?.count ?? 0);
}

async function loadUser(id: string) {
  const result = await pool.query<{
    id: string;
    email: string;
    displayName: string;
    role: Role;
    active: boolean;
    createdAt: string;
    lastLoginAt: string | null;
  }>(
    `SELECT
       id,
       email,
       display_name AS "displayName",
       role,
       is_active AS active,
       created_at::text AS "createdAt",
       last_login_at::text AS "lastLoginAt"
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

app.get("/api/health", async () => ({
  status: "ok",
  service: "tuc-api",
  version: "0.4.2"
}));

app.get("/api/ready", async (_request, reply) => {
  try {
    const database = await databaseStatus();
    return {
      status: "ready",
      service: "tuc-api",
      database
    };
  } catch (error) {
    app.log.error(error);
    return reply.code(503).send({
      status: "not-ready",
      service: "tuc-api"
    });
  }
});

app.get("/api", async () => ({
  name: "Terra Umbra API",
  status: "online",
  version: "0.4.2"
}));

app.get("/api/auth/setup-status", async () => ({
  setupRequired: (await userCount()) === 0
}));

app.get("/api/auth/capabilities", async () => ({
  passwordResetAvailable: passwordResetMailAvailable()
}));

app.post<{
  Body: { email?: string; displayName?: string; password?: string; passwordConfirmation?: string };
}>("/api/auth/setup", async (request, reply) => {
  const email = normalizeEmail(request.body?.email ?? "");
  const displayName = (request.body?.displayName ?? "").trim();
  const password = request.body?.password ?? "";
  const passwordConfirmation = request.body?.passwordConfirmation ?? "";

  if (!validateEmail(email)) return inputError(reply, "invalid_email");
  if (!validateDisplayName(displayName)) {
    return inputError(reply, "invalid_display_name");
  }
  if (!validatePassword(password)) return inputError(reply, "weak_password");
  if (!passwordConfirmation || password !== passwordConfirmation) {
    return inputError(reply, "password_confirmation_mismatch");
  }

  const passwordHash = await hashPassword(password);
  const client = await pool.connect();
  let userId: string | null = null;

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(88442211)");

    const countResult = await client.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM users"
    );

    if (Number(countResult.rows[0]?.count ?? 0) !== 0) {
      await client.query("ROLLBACK");
      return reply.code(409).send({ error: "setup_already_completed" });
    }

    const created = await client.query<{ id: string }>(
      `INSERT INTO users (email, display_name, role, password_hash)
       VALUES ($1, $2, 'admin', $3)
       RETURNING id`,
      [email, displayName, passwordHash]
    );

    userId = created.rows[0].id;
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    app.log.error(error);
    return reply.code(500).send({ error: "setup_failed" });
  } finally {
    client.release();
  }

  if (!userId) {
    return reply.code(500).send({ error: "setup_failed" });
  }

  const token = await createSession(userId, request);
  setSessionCookie(reply, token);

  return {
    user: await loadUser(userId),
    setupCompleted: true
  };
});

app.post<{
  Body: { email?: string; displayName?: string; password?: string; passwordConfirmation?: string };
}>("/api/auth/register", async (request, reply) => {
  if ((await userCount()) === 0) {
    return reply.code(409).send({ error: "setup_required" });
  }

  const email = normalizeEmail(request.body?.email ?? "");
  const displayName = (request.body?.displayName ?? "").trim();
  const password = request.body?.password ?? "";
  const passwordConfirmation = request.body?.passwordConfirmation ?? "";

  if (!validateEmail(email)) return inputError(reply, "invalid_email");
  if (!validateDisplayName(displayName)) {
    return inputError(reply, "invalid_display_name");
  }
  if (!validatePassword(password)) return inputError(reply, "weak_password");
  if (!passwordConfirmation || password !== passwordConfirmation) {
    return inputError(reply, "password_confirmation_mismatch");
  }

  try {
    const passwordHash = await hashPassword(password);
    const created = await pool.query<{ id: string }>(
      `INSERT INTO users (email, display_name, role, password_hash)
       VALUES ($1, $2, 'player', $3)
       RETURNING id`,
      [email, displayName, passwordHash]
    );

    const token = await createSession(created.rows[0].id, request);
    setSessionCookie(reply, token);

    const user = await loadUser(created.rows[0].id);
    return reply.code(201).send({ user });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return reply.code(409).send({ error: "email_already_used" });
    }

    app.log.error(error);
    return reply.code(500).send({ error: "registration_failed" });
  }
});

app.post<{
  Body: { email?: string; password?: string };
}>("/api/auth/login", async (request, reply) => {
  const email = normalizeEmail(request.body?.email ?? "");
  const password = request.body?.password ?? "";
  const key = loginKey(request.ip, email);

  if (!consumeLoginAttempt(key)) {
    return reply.code(429).send({ error: "too_many_attempts" });
  }

  const result = await pool.query<{
    id: string;
    password_hash: string | null;
    is_active: boolean;
  }>(
    `SELECT id, password_hash, is_active
     FROM users
     WHERE lower(email) = $1
     LIMIT 1`,
    [email]
  );

  const row = result.rows[0];
  const valid =
    row?.password_hash &&
    (await verifyPassword(password, row.password_hash).catch(() => false));

  if (!row || !valid) {
    return reply.code(401).send({ error: "invalid_credentials" });
  }

  if (!row.is_active) {
    return reply.code(403).send({ error: "account_disabled" });
  }

  // Keep expensive password work outside the row lock. Re-read under lock so
  // a concurrent reset or deactivation cannot be overwritten by this login.
  const upgradedHash = passwordNeedsRehash(row.password_hash!)
    ? await hashPassword(password)
    : null;
  const client = await pool.connect();
  let token: string;
  try {
    await client.query("BEGIN");
    const current = await client.query<{
      password_hash: string | null;
      is_active: boolean;
    }>(
      "SELECT password_hash, is_active FROM users WHERE id = $1 FOR UPDATE",
      [row.id]
    );
    const locked = current.rows[0];
    if (!locked || locked.password_hash !== row.password_hash) {
      await client.query("ROLLBACK");
      return reply.code(401).send({ error: "invalid_credentials" });
    }
    if (!locked.is_active) {
      await client.query("ROLLBACK");
      return reply.code(403).send({ error: "account_disabled" });
    }

    if (upgradedHash) {
      await client.query(
        "UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2",
        [upgradedHash, row.id]
      );
    }
    await client.query("UPDATE users SET last_login_at = now() WHERE id = $1", [
      row.id
    ]);
    token = await createSession(row.id, request, client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }

  clearLoginAttempts(key);
  setSessionCookie(reply, token);

  return { user: await loadUser(row.id) };
});


app.post<{
  Body: { email?: string };
}>("/api/auth/forgot-password", async (request, reply) => {
  if (!passwordResetMailAvailable()) {
    return reply.code(503).send({ error: "password_reset_unavailable" });
  }

  const email = normalizeEmail(request.body?.email ?? "");

  if (!validateEmail(email)) {
    return { ok: true };
  }

  const result = await pool.query<{
    id: string;
    email: string;
    display_name: string;
    is_active: boolean;
  }>(
    `SELECT id, email, display_name, is_active
     FROM users
     WHERE lower(email) = $1
     LIMIT 1`,
    [email]
  );

  const account = result.rows[0];
  if (!account || !account.is_active) {
    return { ok: true };
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);

  await pool.query(
    `DELETE FROM password_reset_tokens
     WHERE user_id = $1 OR expires_at <= now() OR used_at IS NOT NULL`,
    [account.id]
  );

  await pool.query(
    `INSERT INTO password_reset_tokens
      (token_hash, user_id, expires_at, requested_ip)
     VALUES ($1, $2, now() + interval '30 minutes', $3)`,
    [tokenHash, account.id, request.ip]
  );

  try {
    await sendPasswordResetEmail(
      account.email,
      account.display_name,
      token
    );
  } catch (mailError) {
    app.log.error(mailError);
    await pool.query(
      "DELETE FROM password_reset_tokens WHERE token_hash = $1",
      [tokenHash]
    );
    return reply.code(503).send({ error: "password_reset_mail_failed" });
  }

  return { ok: true };
});

app.post<{
  Body: {
    token?: string;
    password?: string;
    passwordConfirmation?: string;
  };
}>("/api/auth/reset-password", async (request, reply) => {
  const token = request.body?.token ?? "";
  const password = request.body?.password ?? "";
  const passwordConfirmation = request.body?.passwordConfirmation ?? "";

  if (token.length < 20) return inputError(reply, "invalid_reset_token");
  if (!validatePassword(password)) return inputError(reply, "weak_password");
  if (!passwordConfirmation || password !== passwordConfirmation) {
    return inputError(reply, "password_confirmation_mismatch");
  }

  const tokenHash = hashSessionToken(token);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const resetResult = await client.query<{
      user_id: string;
      is_active: boolean;
    }>(
      `SELECT p.user_id, u.is_active
       FROM password_reset_tokens p
       JOIN users u ON u.id = p.user_id
       WHERE p.token_hash = $1
         AND p.expires_at > now()
         AND p.used_at IS NULL
       FOR UPDATE`,
      [tokenHash]
    );

    const reset = resetResult.rows[0];
    if (!reset || !reset.is_active) {
      await client.query("ROLLBACK");
      return reply.code(400).send({ error: "invalid_or_expired_reset_token" });
    }

    const passwordHash = await hashPassword(password);

    await client.query(
      `UPDATE users
       SET password_hash = $1, updated_at = now()
       WHERE id = $2`,
      [passwordHash, reset.user_id]
    );

    await client.query(
      "UPDATE password_reset_tokens SET used_at = now() WHERE token_hash = $1",
      [tokenHash]
    );
    await client.query(
      "DELETE FROM password_reset_tokens WHERE user_id = $1 AND token_hash <> $2",
      [reset.user_id, tokenHash]
    );
    await client.query("DELETE FROM sessions WHERE user_id = $1", [
      reset.user_id
    ]);

    await client.query("COMMIT");
    return { ok: true };
  } catch (resetError) {
    await client.query("ROLLBACK").catch(() => undefined);
    app.log.error(resetError);
    return reply.code(500).send({ error: "password_reset_failed" });
  } finally {
    client.release();
  }
});

app.post("/api/auth/logout", async (request, reply) => {
  const token = readSessionToken(request);
  const user = await currentUser(request);

  if (user) {
    await destroyUserSessions(user.id);
  } else {
    await destroySession(token);
  }

  clearSessionCookie(reply);
  return { ok: true };
});

app.get("/api/auth/me", async (request, reply) => {
  const user = await currentUser(request);
  if (!user) return reply.code(401).send({ error: "authentication_required" });
  return { user };
});

app.patch<{
  Body: { displayName?: string };
}>("/api/auth/profile", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return;

  const displayName = (request.body?.displayName ?? "").trim();
  if (!validateDisplayName(displayName)) {
    return inputError(reply, "invalid_display_name");
  }

  await pool.query(
    "UPDATE users SET display_name = $1, updated_at = now() WHERE id = $2",
    [displayName, user.id]
  );

  return { user: await loadUser(user.id) };
});

app.post<{
  Body: { currentPassword?: string; newPassword?: string; newPasswordConfirmation?: string };
}>("/api/auth/change-password", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return;

  const currentPassword = request.body?.currentPassword ?? "";
  const newPassword = request.body?.newPassword ?? "";
  const newPasswordConfirmation = request.body?.newPasswordConfirmation ?? "";
  if (!validatePassword(newPassword)) {
    return inputError(reply, "weak_password");
  }
  if (!newPasswordConfirmation || newPassword !== newPasswordConfirmation) {
    return inputError(reply, "password_confirmation_mismatch");
  }

  const result = await pool.query<{ password_hash: string | null }>(
    "SELECT password_hash FROM users WHERE id = $1",
    [user.id]
  );

  const stored = result.rows[0]?.password_hash;
  if (!stored || !(await verifyPassword(currentPassword, stored))) {
    return reply.code(401).send({ error: "invalid_current_password" });
  }

  const passwordHash = await hashPassword(newPassword);
  const currentToken = readSessionToken(request);
  const currentHash = currentToken ? hashSessionToken(currentToken) : null;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const changed = await client.query<{ id: string }>(
      `UPDATE users SET password_hash = $1, updated_at = now()
       WHERE id = $2 AND password_hash = $3 AND is_active = true
       RETURNING id`,
      [passwordHash, user.id, stored]
    );
    if (changed.rowCount !== 1) {
      await client.query("ROLLBACK");
      return reply.code(401).send({ error: "invalid_current_password" });
    }

    if (currentHash) {
      await client.query(
        "DELETE FROM sessions WHERE user_id = $1 AND token_hash <> $2",
        [user.id, currentHash]
      );
    } else {
      await client.query("DELETE FROM sessions WHERE user_id = $1", [user.id]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }

  return { ok: true };
});

app.get("/api/admin/users", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const result = await pool.query(
    `SELECT
       id,
       email,
       display_name AS "displayName",
       role,
       is_active AS active,
       created_at::text AS "createdAt",
       last_login_at::text AS "lastLoginAt"
     FROM users
     ORDER BY created_at ASC`
  );

  return { users: result.rows };
});

app.patch<{
  Params: { id: string };
  Body: { role?: Role; active?: boolean };
}>("/api/admin/users/:id", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const targetId = request.params.id;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      targetId
    )
  ) {
    return inputError(reply, "invalid_user_id");
  }

  if (targetId === admin.id) {
    return reply.code(400).send({ error: "cannot_modify_self" });
  }

  const requestedRole = request.body?.role;
  const requestedActive = request.body?.active;

  if (requestedRole !== undefined && !ROLES.includes(requestedRole)) {
    return inputError(reply, "invalid_role");
  }

  if (requestedRole === undefined && requestedActive === undefined) {
    return inputError(reply, "no_changes");
  }

  if (
    requestedActive !== undefined &&
    typeof requestedActive !== "boolean"
  ) {
    return inputError(reply, "invalid_active_state");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(88442212)");

    const targetResult = await client.query<{
      id: string;
      email: string;
      display_name: string;
      role: Role;
      is_active: boolean;
    }>(
      `SELECT id, email, display_name, role, is_active
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [targetId]
    );

    const target = targetResult.rows[0];
    if (!target) {
      await client.query("ROLLBACK");
      return reply.code(404).send({ error: "user_not_found" });
    }

    const nextRole = requestedRole ?? target.role;
    const nextActive = requestedActive ?? target.is_active;

    if (
      target.role === "admin" &&
      target.is_active &&
      (nextRole !== "admin" || !nextActive)
    ) {
      const otherAdmins = await client.query<{ count: string }>(
        `SELECT count(*)::text AS count
         FROM users
         WHERE role = 'admin'
           AND is_active = true
           AND id <> $1`,
        [targetId]
      );

      if (Number(otherAdmins.rows[0]?.count ?? 0) === 0) {
        await client.query("ROLLBACK");
        return reply.code(409).send({ error: "last_admin_protected" });
      }
    }

    const beforeState = {
      email: target.email,
      displayName: target.display_name,
      role: target.role,
      active: target.is_active
    };

    const updated = await client.query<{
      id: string;
      email: string;
      displayName: string;
      role: Role;
      active: boolean;
      createdAt: string;
      lastLoginAt: string | null;
    }>(
      `UPDATE users
       SET role = $1, is_active = $2, updated_at = now()
       WHERE id = $3
       RETURNING
         id,
         email,
         display_name AS "displayName",
         role,
         is_active AS active,
         created_at::text AS "createdAt",
         last_login_at::text AS "lastLoginAt"`,
      [nextRole, nextActive, targetId]
    );

    if (!nextActive) {
      await client.query("DELETE FROM sessions WHERE user_id = $1", [targetId]);
    }
    if (!isCiSmokeEmail(target.email)) {
      await client.query(
        `INSERT INTO admin_audit_log
          (actor_id, target_user_id, action, before_state, after_state)
         VALUES ($1, $2, 'account_update', $3::jsonb, $4::jsonb)`,
        [
          admin.id,
          targetId,
          JSON.stringify(beforeState),
          JSON.stringify({ role: nextRole, active: nextActive })
        ]
      );
    }

    await client.query("COMMIT");
    return { user: updated.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    app.log.error(error);
    return reply.code(500).send({ error: "account_update_failed" });
  } finally {
    client.release();
  }
});


app.delete<{
  Params: { id: string };
  Body: { confirmation?: string };
}>("/api/admin/users/:id", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const targetId = request.params.id;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      targetId
    )
  ) {
    return inputError(reply, "invalid_user_id");
  }

  if (targetId === admin.id) {
    return reply.code(400).send({ error: "cannot_delete_self" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(88442213)");

    const targetResult = await client.query<{
      id: string;
      email: string;
      display_name: string;
      role: Role;
      is_active: boolean;
    }>(
      `SELECT id, email, display_name, role, is_active
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [targetId]
    );

    const target = targetResult.rows[0];
    if (!target) {
      await client.query("ROLLBACK");
      return reply.code(404).send({ error: "user_not_found" });
    }

    if (
      normalizeEmail(request.body?.confirmation ?? "") !==
      normalizeEmail(target.email)
    ) {
      await client.query("ROLLBACK");
      return reply.code(400).send({ error: "delete_confirmation_mismatch" });
    }

    if (target.role === "admin" && target.is_active) {
      const otherAdmins = await client.query<{ count: string }>(
        `SELECT count(*)::text AS count
         FROM users
         WHERE role = 'admin'
           AND is_active = true
           AND id <> $1`,
        [targetId]
      );

      if (Number(otherAdmins.rows[0]?.count ?? 0) === 0) {
        await client.query("ROLLBACK");
        return reply.code(409).send({ error: "last_admin_protected" });
      }
    }
    if (!isCiSmokeEmail(target.email)) {
      await client.query(
        `INSERT INTO admin_audit_log
          (actor_id, target_user_id, action, before_state, after_state)
         VALUES ($1, $2, 'account_delete', $3::jsonb, $4::jsonb)`,
        [
          admin.id,
          targetId,
          JSON.stringify({
            email: target.email,
            displayName: target.display_name,
            role: target.role,
            active: target.is_active
          }),
          JSON.stringify({ deleted: true })
        ]
      );
    }

    await client.query("DELETE FROM users WHERE id = $1", [targetId]);
    await client.query("COMMIT");

    return { ok: true };
  } catch (deleteError) {
    await client.query("ROLLBACK").catch(() => undefined);
    app.log.error(deleteError);
    return reply.code(500).send({ error: "account_delete_failed" });
  } finally {
    client.release();
  }
});

app.get("/api/admin/audit", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const result = await pool.query(
    `SELECT
       a.id,
       a.action,
       a.before_state AS "beforeState",
       a.after_state AS "afterState",
       a.created_at::text AS "createdAt",
       actor.display_name AS "actorName",
       COALESCE(target.display_name, a.before_state->>'displayName') AS "targetName",
       COALESCE(target.email, a.before_state->>'email') AS "targetEmail"
     FROM admin_audit_log a
     LEFT JOIN users actor ON actor.id = a.actor_id
     LEFT JOIN users target ON target.id = a.target_user_id
     WHERE COALESCE(target.email, a.before_state->>'email', '') NOT ILIKE 'ci-%@example.invalid'
       AND NOT (
         a.action = 'account_update'
         AND a.target_user_id IS NULL
         AND COALESCE(a.before_state->>'email', '') = ''
         AND COALESCE(a.before_state->>'displayName', '') = ''
       )
     ORDER BY a.created_at DESC
     LIMIT 100`
  );

  return { events: result.rows };
});

await registerCharacterRoutes(app);
await registerRulesRoutes(app);
await registerCompendiumRoutes(app);
await registerQualityRoutes(app);

// Build the Compendium once during service startup so the first visitor
// never pays the corpus decode/indexing cost.
await preloadCompendium();
// Same strategy as the Compendium: build the static Builder catalogs once
// during startup so no visitor becomes the cold-cache guinea pig.
await preloadBuilderRules();

const port = Number(process.env.PORT ?? 3000);

const shutdown = async () => {
  await app.close();
  await pool.end();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

await app.listen({
  host: "0.0.0.0",
  port
});
