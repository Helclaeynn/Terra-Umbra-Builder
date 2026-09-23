/** Exercise the real HTTP handlers and password implementation, without a DB,
 * listener or SMTP transport. Only the infrastructure modules are replaced. */
import assert from "node:assert/strict";
import { randomBytes, scrypt } from "node:crypto";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { promisify } from "node:util";
import { hash as argonHash, argon2id } from "argon2";

const password = "Argon2-route-check-2026!";
const nextPassword = "Argon2-new-password-2026!";
const salt = randomBytes(16);
const legacyHash = `scrypt$32768$8$1$${salt.toString("base64url")}$${Buffer.from(await promisify(scrypt)(password, salt, 64, {
  N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024
})).toString("base64url")}`;
const now = "2026-09-23T12:00:00.000Z";
let state;
let transaction = null;
let nextId = 0;
const trace = [];

function reset() {
  state = { users: new Map(), sessions: new Map(), resets: new Map(), onConnect: null, failSession: false };
  transaction = null;
  trace.length = 0;
}
function addUser(hash, extra = {}) {
  const id = `test-user-${++nextId}`;
  const user = { id, email: `${id}@example.invalid`, display_name: "Test Argon2", role: "player",
    password_hash: hash, is_active: true, created_at: now, last_login_at: null, ...extra };
  state.users.set(id, user);
  return user;
}
function publicUser(user) {
  return { id: user.id, email: user.email, displayName: user.display_name, role: user.role,
    active: user.is_active, createdAt: user.created_at, lastLoginAt: user.last_login_at };
}
function result(rows = []) { return { rows, rowCount: rows.length }; }
async function query(sql, values = [], scope = "pool") {
  const text = sql.replace(/\s+/g, " ").trim();
  trace.push({ sql: text, scope });
  if (text === "BEGIN") {
    assert.equal(transaction, null, "Nested mock transaction");
    transaction = structuredClone({ users: state.users, sessions: state.sessions, resets: state.resets });
    return result();
  }
  if (text === "COMMIT") { transaction = null; return result(); }
  if (text === "ROLLBACK") {
    if (transaction) Object.assign(state, transaction);
    transaction = null;
    return result();
  }
  if (text.startsWith("SELECT pg_advisory_xact_lock")) return result();
  if (text === "SELECT count(*)::text AS count FROM users") return result([{ count: String(state.users.size) }]);
  if (text.startsWith("INSERT INTO users")) {
    const user = addUser(values[2], { email: values[0], display_name: values[1], role: text.includes("'admin'") ? "admin" : "player" });
    return result([{ id: user.id }]);
  }
  if (text.startsWith("SELECT id, password_hash, is_active FROM users WHERE lower(email)")) {
    const user = [...state.users.values()].find((u) => u.email === values[0]);
    return result(user ? [{ id: user.id, password_hash: user.password_hash, is_active: user.is_active }] : []);
  }
  if (text === "SELECT password_hash, is_active FROM users WHERE id = $1 FOR UPDATE") {
    assert.equal(scope, "client", "Login row lock must use its transaction client");
    assert.ok(transaction, "Row lock must be inside transaction");
    const user = state.users.get(values[0]);
    return result(user ? [{ password_hash: user.password_hash, is_active: user.is_active }] : []);
  }
  if (text === "SELECT password_hash FROM users WHERE id = $1") {
    const user = state.users.get(values[0]);
    return result(user ? [{ password_hash: user.password_hash }] : []);
  }
  if (text.startsWith("SELECT id, email, display_name AS")) {
    const user = state.users.get(values[0]);
    return result(user ? [publicUser(user)] : []);
  }
  if (text.startsWith("SELECT u.id, u.email")) {
    const user = state.users.get(state.sessions.get(values[0])?.user_id);
    return result(user?.is_active ? [{ ...user }] : []);
  }
  if (text.startsWith("SELECT p.user_id, u.is_active FROM password_reset_tokens")) {
    const reset = state.resets.get(values[0]);
    const user = reset && state.users.get(reset.user_id);
    return result(reset && !reset.used && !reset.expired && user ? [{ user_id: user.id, is_active: user.is_active }] : []);
  }
  if (text.startsWith("UPDATE users SET password_hash = $1")) {
    assert.equal(scope, "client", "Password changes must use their transaction client");
    assert.ok(transaction);
    const user = state.users.get(values[1]);
    if (text.includes("password_hash = $3") && (!user?.is_active || user.password_hash !== values[2])) return result();
    user.password_hash = values[0];
    return result(text.includes("RETURNING id") ? [{ id: user.id }] : []);
  }
  if (text.startsWith("UPDATE users SET last_login_at")) {
    state.users.get(values[0]).last_login_at = now;
    return result();
  }
  if (text.startsWith("INSERT INTO sessions")) {
    if (state.failSession) throw new Error("Deliberate session insert failure");
    state.sessions.set(values[0], { user_id: values[1] });
    return result();
  }
  if (text.startsWith("UPDATE sessions SET last_seen_at")) return result();
  if (text.startsWith("DELETE FROM sessions WHERE user_id = $1")) {
    for (const [hash, session] of state.sessions) {
      if (session.user_id === values[0] && (!text.includes("token_hash <> $2") || hash !== values[1])) state.sessions.delete(hash);
    }
    return result();
  }
  if (text.startsWith("UPDATE password_reset_tokens SET used_at")) {
    state.resets.get(values[0]).used = true;
    return result();
  }
  if (text.startsWith("DELETE FROM password_reset_tokens WHERE user_id = $1 AND token_hash <> $2")) {
    for (const [hash, reset] of state.resets) if (reset.user_id === values[0] && hash !== values[1]) state.resets.delete(hash);
    return result();
  }
  throw new Error(`Unexpected SQL in auth route test: ${text}`);
}
const pool = {
  query: (sql, values) => query(sql, values),
  async connect() {
    const beforeConnect = state.onConnect;
    state.onConnect = null;
    beforeConnect?.();
    return { query: (sql, values) => query(sql, values, "client"), release() { trace.push({ sql: "RELEASE", scope: "client" }); } };
  },
  async end() {}
};
globalThis.__tucAuthRouteTest = { pool };
const dist = new URL("../dist/", import.meta.url);
const stubs = new Map([
  [new URL("db.js", dist).href, 'export const pool = globalThis.__tucAuthRouteTest.pool; export async function databaseStatus() { return {}; }'],
  [new URL("mail.js", dist).href, 'export function passwordResetMailAvailable() { return false; } export async function sendPasswordResetEmail() { throw new Error("SMTP must never be used by these tests"); }'],
  [new URL("characters.js", dist).href, 'export async function registerCharacterRoutes() {}'],
  [new URL("quality.js", dist).href, 'export async function registerQualityRoutes() {}'],
  [new URL("compendium.js", dist).href, 'export async function registerCompendiumRoutes() {} export async function preloadCompendium() {}'],
  [new URL("rules/index.js", dist).href, 'export async function registerRulesRoutes() {} export async function preloadBuilderRules() {}']
]);
const serverUrl = new URL("server.js", dist).href;
const hook = registerHooks({ load(url, context, nextLoad) {
  if (stubs.has(url)) return { format: "module", shortCircuit: true, source: stubs.get(url) };
  if (url === serverUrl) {
    const source = readFileSync(new URL(url), "utf8");
    // Keep every production handler unchanged; replace only process startup.
    const startup = /await app\.listen\(\{\s*host: "0\.0\.0\.0",\s*port\s*\}\);\s*$/;
    assert.ok(startup.test(source), "Server startup shape changed: review the test harness");
    return { format: "module", shortCircuit: true, source: source.replace(startup, "export { app };").replace("logger: true", "logger: false") };
  }
  return nextLoad(url, context);
} });
const originalSignals = new Map(["SIGINT", "SIGTERM"].map((name) => [name, new Set(process.listeners(name))]));
const { hashPassword, verifyPassword, hashSessionToken } = await import(new URL("auth.js", dist));
const { app } = await import(serverUrl);
const currentHash = await hashPassword(password);
let checks = 0;
async function check(name, test) {
  reset();
  await test();
  assert.equal(transaction, null, `${name}: transaction left open`);
  checks++;
}
const post = (url, payload, cookie) => app.inject({ method: "POST", url: `/api/auth/${url}`, payload,
  headers: cookie ? { cookie } : {} });
const login = (user, candidate = password) => post("login", { email: user.email, password: candidate });
function assertNoCookie(response) { assert.equal(response.headers["set-cookie"], undefined); }
function assertSessionCookie(response) {
  const cookies = response.headers["set-cookie"];
  assert.ok(Array.isArray(cookies));
  const cookie = cookies.find((value) => value.startsWith("__Host-tuc_session="));
  assert.ok(cookie);
  assert.match(cookie, /HttpOnly; Secure; SameSite=Strict/);
  const token = cookie.split(";")[0].split("=")[1];
  assert.ok(state.sessions.has(hashSessionToken(token)), "Cookie must refer to a committed session");
}
async function assertArgon(hash, candidate = password) {
  assert.match(hash, /^\$argon2id\$v=19\$/);
  assert.deepEqual(Object.fromEntries(hash.split("$")[3].split(",").map((pair) => pair.split("="))),
    { m: "65536", t: "3", p: "1" });
  assert.equal(await verifyPassword(candidate, hash), true);
}
function assertLoginTransaction() {
  const statements = trace.filter((entry) => /^(BEGIN|SELECT password_hash, is_active|UPDATE users|INSERT INTO sessions|COMMIT)/.test(entry.sql));
  assert.ok(statements.length >= 5);
  assert.ok(statements.every((entry) => entry.scope === "client"), "All login writes must share the row-lock transaction");
  assert.equal(statements[0].sql, "BEGIN");
  assert.equal(statements.at(-1).sql, "COMMIT");
  const sessionAt = statements.findIndex((entry) => entry.sql.startsWith("INSERT INTO sessions"));
  const lockAt = statements.findIndex((entry) => entry.sql.endsWith("FOR UPDATE"));
  assert.ok(lockAt > 0 && sessionAt > lockAt);
}

try {
  await check("bootstrap stores Argon2id", async () => {
    const response = await post("setup", { email: "bootstrap@example.invalid", displayName: "Admin Test", password, passwordConfirmation: password });
    assert.equal(response.statusCode, 200, response.body);
    assert.equal(response.json().setupCompleted, true);
    const user = [...state.users.values()][0];
    assert.equal(user.role, "admin");
    await assertArgon(user.password_hash);
    assertSessionCookie(response);
  });
  await check("registration stores Argon2id", async () => {
    addUser(currentHash, { role: "admin" });
    const response = await post("register", { email: "registration@example.invalid", displayName: "Player Test", password, passwordConfirmation: password });
    assert.equal(response.statusCode, 201, response.body);
    const user = [...state.users.values()].find((u) => u.email === "registration@example.invalid");
    assert.equal(user.role, "player");
    await assertArgon(user.password_hash);
    assertSessionCookie(response);
  });
  await check("legacy login upgrades without changing account data", async () => {
    const user = addUser(legacyHash, { role: "editor", display_name: "Keep identity" });
    const response = await login(user);
    assert.equal(response.statusCode, 200, response.body);
    await assertArgon(user.password_hash);
    assert.equal(response.json().user.role, "editor");
    assert.equal(response.json().user.displayName, "Keep identity");
    assert.equal(user.last_login_at, now);
    assertSessionCookie(response);
    assertLoginTransaction();
  });
  await check("current Argon2id login keeps the stored hash", async () => {
    const user = addUser(currentHash);
    const response = await login(user);
    assert.equal(response.statusCode, 200, response.body);
    assert.equal(user.password_hash, currentHash);
    assert.ok(!trace.some((entry) => entry.sql.startsWith("UPDATE users SET password_hash")));
    assertSessionCookie(response);
    assertLoginTransaction();
  });
  await check("old Argon2id policy upgrades on login", async () => {
    const oldHash = await argonHash(password, { type: argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
    const user = addUser(oldHash);
    const response = await login(user);
    assert.equal(response.statusCode, 200, response.body);
    await assertArgon(user.password_hash);
    assertLoginTransaction();
  });
  await check("wrong password neither upgrades nor creates a session", async () => {
    const user = addUser(legacyHash);
    const response = await login(user, "incorrect-password");
    assert.equal(response.statusCode, 401);
    assert.equal(user.password_hash, legacyHash);
    assert.equal(state.sessions.size, 0);
    assertNoCookie(response);
    assert.ok(!trace.some((entry) => entry.sql === "BEGIN"));
  });
  await check("inactive account is not upgraded", async () => {
    const user = addUser(legacyHash, { is_active: false });
    const response = await login(user);
    assert.equal(response.statusCode, 403);
    assert.equal(user.password_hash, legacyHash);
    assert.equal(state.sessions.size, 0);
    assertNoCookie(response);
    assert.ok(!trace.some((entry) => entry.sql === "BEGIN"));
  });
  await check("concurrent password reset is never overwritten", async () => {
    const user = addUser(legacyHash);
    const changedHash = await hashPassword(nextPassword);
    state.onConnect = () => { user.password_hash = changedHash; };
    const response = await login(user);
    assert.equal(response.statusCode, 401);
    assert.equal(state.users.get(user.id).password_hash, changedHash);
    assert.equal(state.sessions.size, 0);
    assertNoCookie(response);
  });
  await check("concurrent deactivation cannot acquire a session", async () => {
    const user = addUser(currentHash);
    state.onConnect = () => { user.is_active = false; };
    const response = await login(user);
    assert.equal(response.statusCode, 403);
    assert.equal(state.users.get(user.id).is_active, false);
    assert.equal(state.sessions.size, 0);
    assertNoCookie(response);
  });
  await check("failed session creation rolls back the migration", async () => {
    const user = addUser(legacyHash);
    state.failSession = true;
    const response = await login(user);
    assert.equal(response.statusCode, 500);
    assert.equal(state.users.get(user.id).password_hash, legacyHash);
    assert.equal(state.users.get(user.id).last_login_at, null);
    assert.equal(state.sessions.size, 0);
    assertNoCookie(response);
    assert.ok(trace.some((entry) => entry.sql === "ROLLBACK"));
  });
  await check("password reset writes Argon2id and revokes all sessions", async () => {
    const user = addUser(legacyHash);
    const token = randomBytes(32).toString("base64url");
    const tokenHash = hashSessionToken(token);
    state.resets.set(tokenHash, { user_id: user.id, used: false });
    state.resets.set("another-reset", { user_id: user.id, used: false });
    state.sessions.set("old-session", { user_id: user.id });
    const response = await post("reset-password", { token, password: nextPassword, passwordConfirmation: nextPassword });
    assert.equal(response.statusCode, 200, response.body);
    await assertArgon(user.password_hash, nextPassword);
    assert.equal(await verifyPassword(password, user.password_hash), false);
    assert.equal(state.sessions.size, 0);
    assert.equal(state.resets.size, 1);
    assert.equal(state.resets.get(tokenHash).used, true);
    assertNoCookie(response);
    const repeated = await post("reset-password", { token, password, passwordConfirmation: password });
    assert.equal(repeated.statusCode, 400);
    await assertArgon(state.users.get(user.id).password_hash, nextPassword);
  });
  await check("password change accepts legacy and retains only current session", async () => {
    const user = addUser(legacyHash);
    const token = "authenticated-test-session";
    const sessionHash = hashSessionToken(token);
    state.sessions.set(sessionHash, { user_id: user.id });
    state.sessions.set("other-session", { user_id: user.id });
    const cookie = `__Host-tuc_session=${token}`;
    const failed = await post("change-password", { currentPassword: "wrong-password", newPassword: nextPassword, newPasswordConfirmation: nextPassword }, cookie);
    assert.equal(failed.statusCode, 401);
    assert.equal(user.password_hash, legacyHash);
    const response = await post("change-password", { currentPassword: password, newPassword: nextPassword, newPasswordConfirmation: nextPassword }, cookie);
    assert.equal(response.statusCode, 200, response.body);
    await assertArgon(user.password_hash, nextPassword);
    assert.equal(await verifyPassword(password, user.password_hash), false);
    assert.deepEqual([...state.sessions.keys()], [sessionHash]);
  });
  await check("confirmation mismatch does not create an account", async () => {
    const response = await post("setup", { email: "invalid@example.invalid", displayName: "Invalid", password, passwordConfirmation: nextPassword });
    assert.equal(response.statusCode, 400);
    assert.equal(state.users.size, 0);
    assert.equal(state.sessions.size, 0);
  });
  await check("concurrent reset cannot be overwritten by a password change", async () => {
    const user = addUser(legacyHash);
    const token = "concurrent-change-test-session";
    const sessionHash = hashSessionToken(token);
    state.sessions.set(sessionHash, { user_id: user.id });
    state.sessions.set("other-session", { user_id: user.id });
    const resetHash = await hashPassword("Concurrent-reset-password-2026!");
    state.onConnect = () => { user.password_hash = resetHash; };
    const response = await post("change-password", { currentPassword: password, newPassword: nextPassword,
      newPasswordConfirmation: nextPassword }, `__Host-tuc_session=${token}`);
    assert.equal(response.statusCode, 401);
    assert.equal(state.users.get(user.id).password_hash, resetHash);
    assert.equal(state.sessions.size, 2, "Failed password change must not alter sessions");
    assertNoCookie(response);
  });
  await check("concurrent deactivation prevents a password change", async () => {
    const user = addUser(currentHash);
    const token = "deactivated-change-test-session";
    state.sessions.set(hashSessionToken(token), { user_id: user.id });
    state.onConnect = () => { user.is_active = false; };
    const response = await post("change-password", { currentPassword: password, newPassword: nextPassword,
      newPasswordConfirmation: nextPassword }, `__Host-tuc_session=${token}`);
    assert.equal(response.statusCode, 401);
    assert.equal(state.users.get(user.id).password_hash, currentHash);
    assert.equal(state.users.get(user.id).is_active, false);
    assert.equal(state.sessions.size, 1);
  });
  await check("login throttling remains enforced", async () => {
    const user = addUser(currentHash);
    for (let i = 0; i < 8; i++) assert.equal((await login(user, "wrong-password")).statusCode, 401);
    assert.equal((await login(user)).statusCode, 429);
    assert.equal(state.sessions.size, 0);
  });
  console.log(`AUTH PASSWORD ROUTES OK — ${checks} scenarios · real Argon2id/scrypt · migration + concurrency + reset/change + rollback`);
} finally {
  await app.close();
  for (const [name, original] of originalSignals) {
    for (const listener of process.listeners(name)) if (!original.has(listener)) process.removeListener(name, listener);
  }
  hook.deregister();
  delete globalThis.__tucAuthRouteTest;
}
