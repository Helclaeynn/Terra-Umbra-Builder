import { isDeepStrictEqual } from 'node:util';
import type { FastifyInstance } from 'fastify';
import { pool } from './db.js';
import { requireUser } from './auth.js';
import { campaignCharacterState } from './campaign-character.js';
import { corruptionSources } from './rules/truth/corruption.js';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const gm = (role: string) => ['gm', 'editor', 'admin'].includes(role);
const whole = (value: unknown, maximum: number): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= maximum;
type Grant = {
  characterId: string; version: number; xp: number; ptv: number; money: number;
  renownDelta: number; corruptionDelta: number; corruptionSource: string;
};
type RewardRequest = { requestId: string; reason: string; rewards: Grant[] };

/** Client role flags, extra fields and session dates confer no authority. */
export function validateCampaignRewards(value: unknown): RewardRequest | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const b = value as Record<string, unknown>;
  if (typeof b.requestId !== 'string' || !uuid.test(b.requestId) ||
      typeof b.reason !== 'string' || !b.reason.trim() || b.reason.trim().length > 500 ||
      !Array.isArray(b.rewards) || !b.rewards.length || b.rewards.length > 100) return null;
  const rewards: Grant[] = [], seen = new Set<string>();
  for (const value of b.rewards) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;
    if (typeof row.characterId !== 'string' || !uuid.test(row.characterId) ||
        seen.has(row.characterId.toLowerCase()) || !whole(row.version, 2147483646) || row.version < 1 ||
        !whole(row.xp, 100000) || !whole(row.ptv, 100000) || !whole(row.money, 1e9) ||
        !whole(row.renownDelta, 5) || !whole(row.corruptionDelta, 100) ||
        row.xp + row.ptv + row.money + row.renownDelta + row.corruptionDelta === 0 ||
        typeof row.corruptionSource !== 'string' ||
        (row.corruptionDelta > 0 && !corruptionSources.some(source => source.id === row.corruptionSource)) ||
        (row.corruptionDelta === 0 && row.corruptionSource !== '')) return null;
    const characterId = row.characterId.toLowerCase();
    seen.add(characterId);
    rewards.push({ characterId, version: row.version, xp: row.xp, ptv: row.ptv, money: row.money,
      renownDelta: row.renownDelta, corruptionDelta: row.corruptionDelta, corruptionSource: row.corruptionSource });
  }
  rewards.sort((a, b) => a.characterId.localeCompare(b.characterId));
  return { requestId: b.requestId.toLowerCase(), reason: b.reason.trim(), rewards };
}

export async function registerCampaignRewardRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>('/api/campaigns/:id/rewards', async (req, reply) => {
    const user = await requireUser(req, reply); if (!user) return;
    if (!uuid.test(req.params.id)) return reply.code(404).send({ error: 'campaign_not_found' });
    const access = await pool.query(`SELECT c.owner_id FROM campaigns c
      JOIN users manager ON manager.id=c.owner_id AND manager.is_active=true AND manager.role IN ('gm','editor','admin')
      WHERE c.id=$1 AND c.archived_at IS NULL AND (
        (c.owner_id=$2 AND $3::boolean) OR EXISTS (
          SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2 AND m.status='accepted'
        ))`, [req.params.id, user.id, gm(user.role)]);
    if (!access.rows.length) return reply.code(404).send({ error: 'campaign_not_found' });
    const canManage = access.rows[0].owner_id === user.id && gm(user.role);
    const entries = await pool.query(`SELECT b.id AS "requestId", b.reason, b.created_at::text AS "createdAt",
      g.character_id AS "characterId", g.character_name AS "characterName", g.xp, g.ptv,
      g.money::double precision AS money, g.renown_delta AS "renownDelta",
      g.corruption_delta AS "corruptionDelta", g.corruption_source AS "corruptionSource", g.revision
      FROM campaign_reward_batches b JOIN campaign_reward_grants g ON g.batch_id=b.id
      JOIN characters ch ON ch.id=g.character_id
      WHERE b.campaign_id=$1 AND ($2::boolean OR ch.owner_id=$3)
      ORDER BY b.created_at DESC, b.id, g.character_name, g.character_id LIMIT 100`, [req.params.id, canManage, user.id]);
    return { canManage, rewards: entries.rows };
  });

  app.post<{ Params: { id: string }; Body: unknown }>('/api/campaigns/:id/rewards', async (req, reply) => {
    const user = await requireUser(req, reply); if (!user) return;
    if (!gm(user.role) || !uuid.test(req.params.id)) return reply.code(404).send({ error: 'campaign_not_found' });
    const body = validateCampaignRewards(req.body);
    if (!body) return reply.code(400).send({ error: 'invalid_campaign_rewards' });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const deny = async (status: number, error: string, characterId?: string) => {
        await client.query('ROLLBACK');
        return reply.code(status).send({ error, ...(characterId ? { characterId } : {}) });
      };
      const owned = await client.query(`SELECT id FROM campaigns
        WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL FOR SHARE`, [req.params.id, user.id]);
      if (!owned.rows.length) return await deny(404, 'campaign_not_found');
      // Serialize retries even before the first ledger row exists. All recipients
      // and the receipt commit together; a lost response never doubles a gift.
      await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [body.requestId]);
      const existing = await client.query(`SELECT campaign_id, created_by, request_payload
        FROM campaign_reward_batches WHERE id=$1`, [body.requestId]);
      const payload = { reason: body.reason, rewards: body.rewards };
      if (existing.rows.length) {
        const row = existing.rows[0];
        if (row.campaign_id !== req.params.id.toLowerCase() || row.created_by !== user.id ||
            !isDeepStrictEqual(row.request_payload, payload)) return await deny(409, 'reward_request_conflict');
        await client.query('COMMIT');
        return { ok: true, alreadyApplied: true, requestId: body.requestId };
      }
      const ids = body.rewards.map(row => row.characterId);
      const memberships = await client.query(`SELECT m.user_id, m.character_id
        FROM campaign_members m JOIN characters ch ON ch.id=m.character_id AND ch.owner_id=m.user_id
        WHERE m.campaign_id=$1 AND m.character_id=ANY($2::uuid[]) AND m.status='accepted'
          AND m.admission_status='approved' AND ch.campaign_id=m.campaign_id
          AND m.approved_basis=campaign_character_basis(ch.data) AND ch.archived_at IS NULL
        ORDER BY m.character_id FOR SHARE OF m`, [req.params.id, ids]);
      if (memberships.rows.length !== ids.length) return await deny(409, 'reward_recipient_unavailable');
      const characters = await client.query(`SELECT id, name, data, version, owner_id FROM characters
        WHERE id=ANY($1::uuid[]) AND campaign_id=$2 AND archived_at IS NULL
        ORDER BY id FOR UPDATE`, [ids, req.params.id]);
      if (characters.rows.length !== ids.length) return await deny(409, 'reward_recipient_unavailable');
      // A player may have saved a new creation while the row lock was pending.
      const approved = await client.query(`SELECT m.character_id FROM campaign_members m JOIN characters ch
        ON ch.id=m.character_id AND ch.owner_id=m.user_id AND ch.campaign_id=m.campaign_id
        WHERE m.campaign_id=$1 AND m.character_id=ANY($2::uuid[]) AND m.status='accepted'
          AND m.admission_status='approved' AND m.approved_basis=campaign_character_basis(ch.data)`, [req.params.id, ids]);
      if (approved.rows.length !== ids.length) return await deny(409, 'reward_recipient_unavailable');
      const prepared = [];
      for (const grant of body.rewards) {
        const character = characters.rows.find(row => row.id === grant.characterId)!;
        if (character.version !== grant.version) return await deny(409, 'character_version_conflict', character.id);
        const before = campaignCharacterState(character.data);
        if (before.renown + grant.renownDelta > 5) return await deny(400, 'renown_limit', character.id);
        if (grant.corruptionDelta && before.corruption + grant.corruptionDelta > before.integrity) {
          return await deny(400, 'corruption_integrity_limit', character.id);
        }
        const data = structuredClone(character.data), progress = { ...(data.progression || {}) };
        progress.xpEarned = before.xpEarned + grant.xp;
        progress.ptvEarned = before.ptvEarned + grant.ptv;
        progress.renownAdjustment = before.renownAdjustment + grant.renownDelta;
        if (![progress.xpEarned, progress.ptvEarned, before.money + grant.money].every(Number.isSafeInteger)) {
          return await deny(400, 'reward_amount_limit', character.id);
        }
        if (grant.money) {
          if (progress.cashTransactions != null && !Array.isArray(progress.cashTransactions)) {
            return await deny(409, 'invalid_character_progression', character.id);
          }
          progress.cashBase = before.base;
          progress.cashTransactions = [...(progress.cashTransactions || []), {
            uid: `${body.requestId}:${character.id}`, amount: grant.money, type: 'campaign-gm',
            label: `Récompense MJ · ${body.reason}`, at: new Date().toISOString()
          }];
        }
        data.progression = progress;
        if (grant.corruptionDelta) data.truth = { ...data.truth,
          corruption: before.corruption + grant.corruptionDelta, corruptionSource: grant.corruptionSource,
          corruptionMjAuthorized: true };
        const after = campaignCharacterState(data);
        if (after.renown !== before.renown + grant.renownDelta) return await deny(400, 'renown_limit', character.id);
        prepared.push({ character, grant, data, before, after });
      }
      await client.query(`INSERT INTO campaign_reward_batches(id,campaign_id,created_by,reason,request_payload)
        VALUES($1,$2,$3,$4,$5::jsonb)`, [body.requestId, req.params.id, user.id, body.reason, JSON.stringify(payload)]);
      for (const { character, grant, data, before, after } of prepared) {
        const revision = character.version + 1;
        await client.query(`UPDATE characters SET data=$2::jsonb,version=$3,updated_at=now() WHERE id=$1`,
          [character.id, JSON.stringify(data), revision]);
        await client.query(`INSERT INTO character_revisions(character_id,revision,name,data,reason,created_by)
          VALUES($1,$2,$3,$4::jsonb,$5,$6)`,
          [character.id, revision, character.name, JSON.stringify(data), 'campaign-bonus:' + body.reason, user.id]);
        await client.query(`INSERT INTO campaign_reward_grants(batch_id,character_id,character_name,xp,ptv,money,
          renown_delta,corruption_delta,corruption_source,before_state,after_state,revision)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12)`,
          [body.requestId, character.id, character.name, grant.xp, grant.ptv, grant.money, grant.renownDelta,
            grant.corruptionDelta, grant.corruptionSource, JSON.stringify(before), JSON.stringify(after), revision]);
      }
      await client.query('COMMIT');
      return { ok: true, alreadyApplied: false, requestId: body.requestId,
        characters: prepared.map(({ character, after }) => ({ id: character.id, version: character.version + 1, ...after })) };
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      if (error instanceof Error && error.message === 'invalid_character_progression') {
        return reply.code(409).send({ error: error.message });
      }
      throw error;
    } finally { client.release(); }
  });
}
