// Real Fastify routes and authentication; only PostgreSQL is replaced here.
// The deployed smoke additionally verifies the SQL and private Compendium on PostgreSQL.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { registerHooks } from 'node:module';
import Fastify from 'fastify';

const users = new Map(), requests = new Map(), sessions = new Map(), audits = [];
let snapshot = null, failAudit = false;
const rows = (...items) => ({ rows: items.filter(Boolean), rowCount: items.filter(Boolean).length });
const project = r => r && ({ id: r.id, userId: r.user_id, comment: r.comment, status: r.status, createdAt: r.created_at, decidedAt: r.decided_at });
async function query(sql, values = []) {
  const s = sql.replace(/\s+/g, ' ').trim();
  if (s === 'BEGIN') { snapshot = structuredClone({ users, requests, audits }); return rows(); }
  if (s === 'COMMIT') { snapshot = null; return rows(); }
  if (s === 'ROLLBACK') {
    if (snapshot) {
      users.clear(); requests.clear();
      for (const [k,v] of snapshot.users) users.set(k,v);
      for (const [k,v] of snapshot.requests) requests.set(k,v);
      audits.splice(0, audits.length, ...snapshot.audits);
    }
    snapshot = null; return rows();
  }
  if (s.startsWith('SELECT pg_advisory') || s.startsWith('UPDATE sessions SET last_seen_at')) return rows();
  if (s.includes('FROM sessions s')) {
    const u = users.get(sessions.get(values[0]));
    return rows(u?.is_active ? u : null);
  }
  if (s.startsWith('SELECT role, is_active FROM users')) return rows(users.get(values[0]));
  if (s.startsWith('INSERT INTO gm_access_requests')) {
    if ([...requests.values()].some(r => r.user_id === values[0] && r.status === 'pending')) return rows();
    const r = { id: randomUUID(), user_id: values[0], comment: values[1], status: 'pending', created_at: new Date().toISOString(), decided_at: null };
    requests.set(r.id, r); return rows(project(r));
  }
  if (s.includes('FROM gm_access_requests') && s.includes('ORDER BY created_at DESC')) {
    return rows(project([...requests.values()].reverse().find(r => r.user_id === values[0])));
  }
  if (s.startsWith('SELECT r.id, r.user_id')) {
    return rows(...[...requests.values()].filter(r => r.status === 'pending').map(r => {
      const u = users.get(r.user_id); return { ...project(r), displayName: u.display_name, email: u.email, role: u.role, active: u.is_active };
    }));
  }
  if (s.startsWith('SELECT r.*, u.role')) {
    const r = requests.get(values[0]), u = users.get(r?.user_id);
    return rows(r && { ...r, role: u.role, is_active: u.is_active, email: u.email, display_name: u.display_name });
  }
  if (s.startsWith("UPDATE users SET role = 'gm'")) { users.get(values[0]).role = 'gm'; return rows(); }
  if (s.startsWith('UPDATE gm_access_requests SET status = $2')) {
    const r = requests.get(values[0]); Object.assign(r, { status: values[1], decided_by: values[2], decided_at: new Date().toISOString() });
    return rows(project(r));
  }
  if (s.startsWith("UPDATE gm_access_requests SET status = 'approved'")) {
    for (const r of requests.values()) if (r.user_id === values[0] && r.status === 'pending') Object.assign(r, { status: 'approved', decided_by: values[1], decided_at: new Date().toISOString() });
    return rows();
  }
  if (s.startsWith('INSERT INTO admin_audit_log')) {
    if (failAudit) throw new Error('Simulated audit write failure');
    audits.push(values); return rows();
  }
  throw new Error(`Unexpected SQL: ${s}`);
}
const pool = { query, connect: async () => ({ query, release() {} }) };
globalThis.__gmTestPool = pool;
const dbUrl = new URL('../dist/db.js', import.meta.url).href;
const hook = registerHooks({ load(url, context, next) {
  if (url === dbUrl) return { format: 'module', shortCircuit: true, source: 'export const pool = globalThis.__gmTestPool;' };
  return next(url, context);
} });
const { registerGmAccessRoutes, approvePendingGmRequest } = await import('../dist/gm-access.js');
const { hashSessionToken } = await import('../dist/auth.js');
const app = Fastify();
await registerGmAccessRoutes(app);
function addUser(role = 'player') {
  const id = randomUUID(), token = randomUUID();
  users.set(id, { id, role, is_active: true, display_name: role, email: `${id}@example.invalid`, created_at: new Date().toISOString() });
  sessions.set(hashSessionToken(token), id);
  return { id, cookie: `__Host-tuc_session=${token}` };
}
const admin = addUser('admin'), player = addUser(), stranger = addUser(), editor = addUser('editor');
const own = '/api/auth/gm-request', inbox = '/api/admin/gm-requests';
let checks = 0;
async function call(who, method, url, payload, expected = 200) {
  const r = await app.inject({ method, url, headers: who ? { cookie: who.cookie } : {}, ...(payload === undefined ? {} : { payload }) });
  assert.equal(r.statusCode, expected, `${method} ${url}: ${r.body}`); checks++;
  assert.equal(snapshot, null, 'Transaction must always close');
  return r.json();
}
const decide = (id, decision, expected = 200, who = admin) => call(who, 'POST', `${inbox}/${id}/decision`, { decision }, expected);
try {
  await call(null, 'GET', own, undefined, 401);
  await call(null, 'POST', own, {}, 401);
  await call(player, 'GET', inbox, undefined, 403);
  await call(editor, 'GET', inbox, undefined, 403);
  await call(editor, 'POST', own, {}, 409);
  assert.equal((await call(player, 'GET', own)).request, null);
  await call(player, 'POST', own, { comment: 'x'.repeat(1001) }, 400);
  const first = (await call(player, 'POST', own, { comment: '  Ma campagne  ' }, 201)).request;
  assert.equal(first.comment, 'Ma campagne');
  assert.equal(users.get(player.id).role, 'player', 'A request does not grant rights');
  await call(player, 'POST', own, {}, 409);
  assert.equal((await call(stranger, 'GET', own)).request, null, 'No cross-user disclosure');
  assert.equal((await call(admin, 'GET', inbox)).requests.length, 1);
  await decide(first.id, 'approved', 403, player);
  await decide(first.id, 'invalid', 400);
  await decide('bad-id', 'approved', 400);
  await decide(randomUUID(), 'approved', 404);
  await decide(first.id, 'rejected');
  assert.equal(users.get(player.id).role, 'player');
  assert.equal((await call(player, 'GET', own)).request.status, 'rejected');
  await decide(first.id, 'approved', 409);
  const second = (await call(player, 'POST', own, {}, 201)).request;
  users.get(player.id).is_active = false;
  await decide(second.id, 'approved', 409);
  await call(player, 'GET', own, undefined, 401);
  users.get(player.id).is_active = true;
  failAudit = true;
  await decide(second.id, 'approved', 500);
  failAudit = false;
  assert.equal(users.get(player.id).role, 'player', 'Failed audit rolls back promotion');
  assert.equal(requests.get(second.id).status, 'pending', 'Failed audit leaves request pending');
  await decide(second.id, 'approved');
  assert.equal(users.get(player.id).role, 'gm');
  assert.equal((await call(player, 'GET', own)).request.status, 'approved');
  assert.equal(audits.length, 2);
  assert.equal(audits.at(-1)[2], 'gm_request_approved');
  await call(player, 'POST', own, {}, 409);
  await decide(second.id, 'rejected', 409);
  const third = (await call(stranger, 'POST', own, {}, 201)).request;
  users.get(stranger.id).role = 'editor';
  await approvePendingGmRequest(pool, stranger.id, admin.id);
  assert.equal(requests.get(third.id).status, 'approved', 'Manual promotion resolves pending requests');
  assert.equal((await call(admin, 'GET', inbox)).requests.length, 0);
  users.get(player.id).role = 'player';
  await call(player, 'POST', own, {}, 201);
  console.log(`GM ACCESS OK — ${checks} HTTP checks; permissions, isolation, duplicates, rejection, approval, rollback and manual promotion`);
} finally { await app.close(); hook.deregister(); delete globalThis.__gmTestPool; }
