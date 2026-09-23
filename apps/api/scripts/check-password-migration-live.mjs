// Run from /app in the deployed API container, only against a disposable CI user.
// This exercises real HTTP handlers + PostgreSQL without sending reset emails.
import assert from "node:assert/strict";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

assert.equal(process.env.TUC_PASSWORD_SMOKE, "dev", "Explicit dev smoke flag required");
const { pool } = await import(pathToFileURL(resolve("dist/db.js")).href);
const { hashSessionToken, passwordNeedsRehash, verifyPassword } = await import(pathToFileURL(resolve("dist/auth.js")).href);
const email = `ci-argon2-${randomBytes(12).toString("hex")}@example.invalid`;
const password = randomBytes(24).toString("base64url");
const changedPassword = randomBytes(24).toString("base64url");
const resetPassword = randomBytes(24).toString("base64url");
const base = `http://127.0.0.1:${Number(process.env.PORT || 3000)}`;
let userId;

async function request(endpoint, payload, expected = 200, cookie = "") {
  const response = await fetch(base + endpoint, {
    method: payload ? "POST" : "GET",
    headers: { ...(payload ? { "Content-Type": "application/json" } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
    signal: AbortSignal.timeout(15000)
  });
  assert.equal(response.status, expected, `${endpoint}: unexpected HTTP status`);
  return {
    body: await response.json(),
    cookie: response.headers.getSetCookie().find(value => value.startsWith("__Host-tuc_session="))?.split(";")[0] || ""
  };
}

async function storedHash() {
  const result = await pool.query("SELECT password_hash FROM users WHERE id = $1 AND email = $2", [userId, email]);
  assert.equal(result.rowCount, 1, "Only the smoke account is read");
  return result.rows[0].password_hash;
}

async function assertArgonPassword(value) {
  const encoded = await storedHash();
  assert.ok(encoded.startsWith("$argon2id$v=19$"), "Stored hash is Argon2id v19");
  assert.equal(passwordNeedsRehash(encoded), false, "Stored work factors match policy");
  assert.equal(await verifyPassword(value, encoded), true);
  return encoded;
}

try {
  const registration = await request("/api/auth/register", {
    email, displayName: "CI Argon2 migration", password, passwordConfirmation: password
  }, 201);
  userId = registration.body.user.id;
  const originalArgon = await assertArgonPassword(password);
  await request("/api/auth/login", { email, password });
  assert.ok(await storedHash() === originalArgon, "Argon2 login does not rehash unnecessarily");

  // Seed a historical hash on this new test account only, then exercise login.
  const salt = randomBytes(16);
  const derived = await promisify(scrypt)(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const legacy = `scrypt$32768$8$1$${salt.toString("base64url")}$${derived.toString("base64url")}`;
  const seeded = await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2 AND email = $3 RETURNING id", [legacy, userId, email]);
  assert.equal(seeded.rowCount, 1);
  await pool.query("DELETE FROM sessions WHERE user_id = $1", [userId]);
  await request("/api/auth/login", { email, password: password + "wrong" }, 401);
  assert.ok(await storedHash() === legacy, "Failed login does not migrate the hash");
  const login = await request("/api/auth/login", { email, password });
  assert.ok(login.cookie, "Migrated login issues a session");
  await assertArgonPassword(password);
  await request("/api/auth/me", null, 200, login.cookie);

  await request("/api/auth/change-password", {
    currentPassword: password, newPassword: changedPassword, newPasswordConfirmation: changedPassword
  }, 200, login.cookie);
  await assertArgonPassword(changedPassword);
  await request("/api/auth/login", { email, password }, 401);

  // A locally seeded reset token avoids delivering a test email to anyone.
  const resetToken = randomBytes(32).toString("base64url");
  await pool.query("INSERT INTO password_reset_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, now() + interval '5 minutes')",
    [hashSessionToken(resetToken), userId]);
  await request("/api/auth/reset-password", { token: resetToken, password: resetPassword, passwordConfirmation: resetPassword });
  await assertArgonPassword(resetPassword);
  await request("/api/auth/me", null, 401, login.cookie);
  await request("/api/auth/login", { email, password: changedPassword }, 401);
  await request("/api/auth/login", { email, password: resetPassword });
  await request("/api/auth/reset-password", { token: resetToken, password: resetPassword, passwordConfirmation: resetPassword }, 400);
  console.log("ARGON2 LIVE OK — registration, scrypt migration, failed login, unchanged Argon2 login, password change, reset and session revocation");
} finally {
  try {
    // Also catches a registration that created the row before returning an error.
    await pool.query("DELETE FROM admin_audit_log WHERE target_user_id IN (SELECT id FROM users WHERE email = $1)", [email]);
    await pool.query("DELETE FROM users WHERE email = $1", [email]);
    console.log("ARGON2 LIVE CLEANUP OK — disposable account removed");
  } finally {
    await pool.end();
  }
}
