import {createHash} from 'node:crypto';
import type {FastifyInstance} from 'fastify';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {mediaIdPattern} from './character-appearances.js';

export function decodeCharacterImage(value: unknown): {content:Buffer;mime:string} | null {
  if (typeof value !== 'string' || value.length > 270000) return null;
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!m) return null;
  const content = Buffer.from(m[2], 'base64');
  if (content.length < 12 || content.length > 196608 || content.toString('base64') !== m[2]) return null;
  const valid = m[1] === 'image/png' ? content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) :
    m[1] === 'image/jpeg' ? content[0] === 255 && content[1] === 216 && content[2] === 255 :
    content.toString('ascii',0,4) === 'RIFF' && content.toString('ascii',8,12) === 'WEBP';
  return valid ? {content,mime:m[1]} : null;
}

export async function registerCharacterMediaRoutes(app: FastifyInstance) {
  app.post<{Params:{id:string};Body:{dataUrl?:unknown}}>('/api/characters/:id/images', {bodyLimit:280000}, async(req,reply) => {
    const user = await requireUser(req,reply); if (!user) return;
    if (!mediaIdPattern.test(req.params.id)) return reply.code(404).send({error:'character_not_found'});
    const picture = decodeCharacterImage(req.body?.dataUrl);
    if (!picture) return reply.code(400).send({error:'invalid_character_image'});
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const owner = await db.query('SELECT 1 FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL FOR SHARE',[req.params.id,user.id]);
      if (!owner.rowCount) {await db.query('ROLLBACK');return reply.code(404).send({error:'character_not_found'});}
      // Serialize quota/deduplication checks, not characters' gameplay revisions.
      await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',['character-media:'+user.id]);
      const hash = createHash('sha256').update(picture.content).digest('hex');
      const prior = await db.query('SELECT id FROM character_media WHERE owner_id=$1 AND sha256=$2',[user.id,hash]);
      let id = prior.rows[0]?.id as string | undefined;
      if (!id) {
        const size = await db.query('SELECT COALESCE(sum(octet_length(content)),0)::bigint AS bytes FROM character_media WHERE owner_id=$1',[user.id]);
        if (Number(size.rows[0].bytes) + picture.content.length > 64*1024*1024) {
          await db.query('ROLLBACK');return reply.code(413).send({error:'character_image_quota'});
        }
        const inserted = await db.query('INSERT INTO character_media(owner_id,sha256,mime_type,content) VALUES ($1,$2,$3,$4) RETURNING id',[user.id,hash,picture.mime,picture.content]);
        id = inserted.rows[0].id;
      }
      await db.query('COMMIT');
      return reply.code(201).send({mediaId:id});
    } catch (error) {await db.query('ROLLBACK').catch(()=>{});throw error;} finally {db.release();}
  });

  app.get<{Params:{id:string}}>('/api/character-media/:id', async(req,reply) => {
    reply.header('Cache-Control','private, no-store').header('Vary','Cookie').header('X-Content-Type-Options','nosniff');
    const user = await requireUser(req,reply); if (!user) return;
    if (!mediaIdPattern.test(req.params.id)) return reply.code(404).send({error:'image_not_found'});
    const canReadShared = ['gm','editor','admin'].includes(user.role);
    // No public URL and no global-admin bypass. Shared readers only see images
    // actually referenced by a currently shared/accepted character sheet.
    const result = await pool.query(`SELECT media.mime_type,media.content FROM character_media media
      WHERE media.id=$1 AND (media.owner_id=$2 OR ($3::boolean AND EXISTS (
        SELECT 1 FROM characters c WHERE c.owner_id=media.owner_id AND c.archived_at IS NULL
        AND (COALESCE(c.data->'appearances'->'reality','[]'::jsonb) @> jsonb_build_array(jsonb_build_object('mediaId',media.id::text))
          OR COALESCE(c.data->'appearances'->'truth','[]'::jsonb) @> jsonb_build_array(jsonb_build_object('mediaId',media.id::text)))
        AND (EXISTS(SELECT 1 FROM character_sheet_readers r WHERE r.character_id=c.id AND r.reader_id=$2)
          OR EXISTS(SELECT 1 FROM campaign_members m JOIN campaigns camp ON camp.id=m.campaign_id
            WHERE m.character_id=c.id AND m.user_id=c.owner_id AND m.status='accepted'
              AND camp.owner_id=$2 AND camp.archived_at IS NULL))
      )) OR EXISTS (
        SELECT 1 FROM characters c JOIN character_play_states s ON s.character_id=c.id
        JOIN campaign_members owner_member ON owner_member.character_id=c.id AND owner_member.user_id=c.owner_id AND owner_member.campaign_id=c.campaign_id AND owner_member.status='accepted'
        JOIN campaigns camp ON camp.id=c.campaign_id AND camp.archived_at IS NULL
        JOIN campaign_members viewer ON viewer.campaign_id=camp.id AND viewer.user_id=$2 AND viewer.status='accepted'
        WHERE c.archived_at IS NULL AND c.owner_id=media.owner_id AND s.state->>'share'='true'
          AND COALESCE(c.data->'appearances'->'reality','[]'::jsonb) @> jsonb_build_array(jsonb_build_object('mediaId',media.id::text))
          AND media.id::text=COALESCE(NULLIF(c.data->'appearances'->>'primaryReality',''),c.data->'appearances'->'reality'->0->>'mediaId')
      ))`,[req.params.id,user.id,canReadShared]);
    const row = result.rows[0]; if (!row) return reply.code(404).send({error:'image_not_found'});
    return reply.type(row.mime_type).send(row.content);
  });
}
