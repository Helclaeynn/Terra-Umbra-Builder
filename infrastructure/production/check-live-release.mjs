import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const connection = new URL(process.env.DATABASE_URL);
connection.searchParams.set('options', '-c default_transaction_read_only=on');
process.env.DATABASE_URL = connection.toString();
const { pool } = await import('./dist/db.js');
const { default: fastify } = await import('fastify');
const { registerCompendiumRoutes } = await import('./dist/compendium.js');
const { registerCharacterRoutes } = await import('./dist/characters.js');
const { registerRulesRoutes } = await import('./dist/rules/index.js');
const app = fastify();
await registerCompendiumRoutes(app);
await registerCharacterRoutes(app);
await registerRulesRoutes(app);
const metaResponse = await app.inject({ method: 'GET', url: '/api/compendium/meta' });
assert.equal(metaResponse.statusCode, 200, metaResponse.body);
const baseline = JSON.parse(readFileSync('/app/release-baseline.json', 'utf8'));
const meta = metaResponse.json();
for (const key of ['total', 'categories', 'databaseEdits']) assert.deepEqual(meta[key], baseline[key], `Production Compendium ${key} preserved`);
for (const url of ['/api/compendium/wiki-index?compact=1', '/api/compendium/search?q=Dragoslav', '/api/compendium/articles/pnj-crawlers-docx-dragoslav-memic']) {
 const response = await app.inject({ method: 'GET', url });
 assert.equal(response.statusCode, 200, response.body);
}
for (const url of ['/api/characters/11111111-1111-4111-8111-111111111111/play', '/api/campaigns/11111111-1111-4111-8111-111111111111/play', '/api/campaigns/11111111-1111-4111-8111-111111111111/occult-resolutions']) {
 const response = await app.inject({ method: 'GET', url });
 assert.equal(response.statusCode, 401, `${url}: ${response.body}`);
}
// Local request injection only: no session/token is created in the live database.
// Every real PostgreSQL connection is read-only; session touch is suppressed.
const query = pool.query.bind(pool);
let user = null;
pool.query = async function(sql, ...args) {
 if (String(sql).includes('FROM sessions s')) return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
 if (String(sql).startsWith('UPDATE sessions SET last_seen_at')) return { rows: [], rowCount: 0 };
 return query(sql, ...args);
};
const headers = { cookie: '__Host-tuc_session=local-release-readonly-check' };
const characters = (await query('SELECT c.id AS character_id, c.campaign_id, u.* FROM characters c JOIN users u ON u.id=c.owner_id WHERE c.archived_at IS NULL AND u.is_active')).rows;
for (const character of characters) {
 user = character;
 const response = await app.inject({ method: 'GET', url: `/api/characters/${character.character_id}/play`, headers });
 assert.equal(response.statusCode, 200, `Existing character play failed: ${response.statusCode}`);
 assert.ok(response.json().profile && response.json().combat);
}
const campaigns = (await query('SELECT c.id AS campaign_id, u.* FROM campaigns c JOIN users u ON u.id=c.owner_id WHERE c.archived_at IS NULL AND u.is_active AND u.role IN (\'gm\',\'editor\',\'admin\')')).rows;
for (const campaign of campaigns) {
 user = campaign;
 for (const suffix of ['play', 'occult-consents', 'occult-resolutions']) {
  const response = await app.inject({ method: 'GET', url: `/api/campaigns/${campaign.campaign_id}/${suffix}`, headers });
  assert.equal(response.statusCode, 200, `Existing campaign ${suffix} failed: ${response.statusCode}`);
 }
}
await app.close();
await pool.end();
console.log(JSON.stringify({ result: 'LIVE RELEASE READ-ONLY CHECK PASSED', compendiumTotal: meta.total, charactersChecked: characters.length, campaignsChecked: campaigns.length, anonymousDenied: true }));
