// Run inside the dev API container. All accounts and records are disposable.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
assert.equal(process.env.TUC_GM_SMOKE, 'dev', 'Explicit dev smoke flag required');
const { pool } = await import(pathToFileURL(resolve('dist/db.js')).href);
const { hashSessionToken } = await import(pathToFileURL(resolve('dist/auth.js')).href);
const base = `http://127.0.0.1:${Number(process.env.PORT || 3000)}`;
const ids = [];
let checks = 0;
async function account(role) {
  const suffix = randomBytes(12).toString('hex');
  const email = `ci-gm-${suffix}@example.invalid`;
  const result = await pool.query('INSERT INTO users (email, display_name, role) VALUES ($1, $2, $3) RETURNING id', [email, 'CI accès MJ', role]);
  const id = result.rows[0].id;
  ids.push(id);
  const token = randomBytes(32).toString('base64url');
  await pool.query("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + interval '5 minutes')", [hashSessionToken(token), id]);
  return { id, cookie: `__Host-tuc_session=${token}` };
}
async function call(who, method, endpoint, payload, expected = 200) {
  const r = await fetch(base + endpoint, { method,
    headers: { ...(who ? { Cookie: who.cookie } : {}), ...(payload !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }), signal: AbortSignal.timeout(15000) });
  assert.equal(r.status, expected, `${method} ${endpoint}: unexpected HTTP status`);
  if (endpoint.startsWith('/api/auth/') || endpoint.startsWith('/api/admin/')) assert.match(r.headers.get('cache-control') || '', /no-store/);
  checks++; return r.json();
}
const own = '/api/auth/gm-request', inbox = '/api/admin/gm-requests';
const article = '/api/compendium/articles/pnj-agences-cole-gallagher';
const hasSecrets = data => data.article.sections.some(section => section.audience === 'mj');
try {
  const admin = await account('admin'), player = await account('player'), other = await account('player');
  const decide = (id, decision, expected = 200, who = admin) => call(who, 'POST', `${inbox}/${id}/decision`, { decision }, expected);
  await call(null, 'GET', own, undefined, 401);
  await call(player, 'GET', inbox, undefined, 403);
  await call(admin, 'POST', own, {}, 409);
  assert.equal(hasSecrets(await call(admin, 'GET', article)), true, 'Fixture must contain protected sections');
  const first = (await call(player, 'POST', own, { comment: 'Test de demande MJ' }, 201)).request;
  await call(player, 'POST', own, {}, 409);
  assert.equal((await call(other, 'GET', own)).request, null);
  assert.equal((await call(player, 'GET', '/api/auth/me')).user.role, 'player');
  assert.equal(hasSecrets(await call(player, 'GET', article)), false, 'Pending request must not disclose secrets');
  assert.ok((await call(admin, 'GET', inbox)).requests.some(r => r.id === first.id));
  await decide(first.id, 'approved', 403, player);
  await decide(first.id, 'rejected');
  assert.equal((await call(player, 'GET', own)).request.status, 'rejected');
  assert.equal((await call(player, 'GET', '/api/auth/me')).user.role, 'player');
  const second = (await call(player, 'POST', own, {}, 201)).request;
  // Concurrent decisions: exactly one succeeds, and the losing action cannot overwrite it.
  const responses = await Promise.all(['approved', 'rejected'].map(decision => fetch(base + `${inbox}/${second.id}/decision`, {
    method: 'POST', headers: { Cookie: admin.cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ decision }), signal: AbortSignal.timeout(15000)
  })));
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 409]);
  const winner = responses.findIndex(r => r.status === 200);
  let approvedId = second.id;
  if (winner === 1) {
    approvedId = (await call(player, 'POST', own, {}, 201)).request.id;
    await decide(approvedId, 'approved');
  }
  assert.equal((await call(player, 'GET', '/api/auth/me')).user.role, 'gm');
  assert.equal(hasSecrets(await call(player, 'GET', article)), true, 'Approval takes effect in the existing session');
  await decide(approvedId, 'rejected', 409);
  await call(admin, 'PATCH', `/api/admin/users/${player.id}`, { role: 'player' });
  assert.equal(hasSecrets(await call(player, 'GET', article)), false, 'Revoking MJ removes access on the server');
  const third = (await call(player, 'POST', own, {}, 201)).request;
  await call(admin, 'PATCH', `/api/admin/users/${player.id}`, { active: false });
  await decide(third.id, 'approved', 409);
  await call(player, 'GET', own, undefined, 401);
  await decide(third.id, 'rejected');
  await call(other, 'POST', own, {}, 201);
  await call(admin, 'PATCH', `/api/admin/users/${other.id}`, { role: 'editor' });
  assert.equal((await call(other, 'GET', own)).request.status, 'approved', 'Manual promotion resolves the request');
  const audit = await pool.query("SELECT action FROM admin_audit_log WHERE actor_id = $1 AND action LIKE 'gm_request_%'", [admin.id]);
  assert.ok(audit.rows.some(r => r.action === 'gm_request_approved'));
  assert.ok(audit.rows.some(r => r.action === 'gm_request_rejected'));
  console.log(`GM ACCESS LIVE OK — ${checks} HTTP checks; PostgreSQL, concurrent decisions, audit, private Compendium and revocation`);
} finally {
  if (ids.length) {
    // Remove audit rows before deleting their actors/targets so no orphan test history remains.
    await pool.query('DELETE FROM admin_audit_log WHERE actor_id = ANY($1::uuid[]) OR target_user_id = ANY($1::uuid[])', [ids]);
    await pool.query("DELETE FROM users WHERE id = ANY($1::uuid[]) AND email LIKE 'ci-gm-%@example.invalid'", [ids]);
  }
  await pool.end();
  console.log('GM ACCESS LIVE CLEANUP OK');
}
