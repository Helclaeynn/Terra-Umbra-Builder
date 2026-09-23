import type { FastifyInstance } from "fastify";
import { pool } from "./db.js";
import { requireUser } from "./auth.js";
import { normalizeCharacterData } from "./character-data.js";

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isGm=(role:string)=>["gm","editor","admin"].includes(role);
const notFound={error:"character_not_found"};

/** Explicit, revocable read-only grants. Existing character write routes stay owner-only. */
export async function registerCharacterSheetRoutes(app:FastifyInstance){
  app.get("/api/characters/shared",async(request,reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    if(!isGm(user.role))return {characters:[]};
    const result=await pool.query(`SELECT c.id,c.name,c.version,c.updated_at::text AS "updatedAt",u.display_name AS "ownerName"
      FROM characters c JOIN character_sheet_readers r ON r.character_id=c.id
      JOIN users u ON u.id=c.owner_id
      WHERE r.reader_id=$1 AND c.archived_at IS NULL ORDER BY c.updated_at DESC`,[user.id]);
    return {characters:result.rows};
  });

  app.get<{Params:{id:string}}>("/api/characters/:id/sheet",async(request,reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    if(!UUID.test(request.params.id))return reply.code(404).send(notFound);
    const result=await pool.query(`SELECT c.id,c.name,c.data,c.version,c.created_at::text AS "createdAt",
      c.updated_at::text AS "updatedAt",c.campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=c.campaign_id) AS "campaignName",c.owner_id=$2 AS "canEdit",u.display_name AS "ownerName"
      FROM characters c JOIN users u ON u.id=c.owner_id
      WHERE c.id=$1 AND c.archived_at IS NULL AND (c.owner_id=$2 OR ($3 AND EXISTS (
        SELECT 1 FROM character_sheet_readers r WHERE r.character_id=c.id AND r.reader_id=$2) OR $3 AND EXISTS (
        SELECT 1 FROM campaign_members m JOIN campaigns camp ON camp.id=m.campaign_id
        WHERE m.character_id=c.id AND m.user_id=c.owner_id AND m.status='accepted' AND camp.owner_id=$2 AND camp.archived_at IS NULL)))`,
      [request.params.id,user.id,isGm(user.role)]);
    const row=result.rows[0];
    if(!row)return reply.code(404).send(notFound);
    const {canEdit,ownerName,...character}=row;
    character.data=normalizeCharacterData(character.data,character.name);
    return {character,canEdit,ownerName};
  });

  app.get<{Params:{id:string};Querystring:{q?:string}}>("/api/characters/:id/reader-search",async(request,reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    if(!UUID.test(request.params.id))return reply.code(404).send(notFound);
    const owned=await pool.query("SELECT id FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL",[request.params.id,user.id]);
    if(!owned.rows.length)return reply.code(404).send(notFound);
    const q=typeof request.query.q==="string"?request.query.q.trim():"";
    if(q.length<2||q.length>80)return {accounts:[]};
    // Literal substring matching, bounded results, no email or private profile fields.
    const result=await pool.query(`SELECT u.id,u.display_name AS "displayName",u.role,
      EXISTS(SELECT 1 FROM character_sheet_readers r WHERE r.character_id=$1 AND r.reader_id=u.id) AS shared
      FROM users u WHERE u.id<>$2 AND u.is_active AND u.role IN ('gm','editor','admin')
        AND strpos(lower(u.display_name),lower($3))>0
      ORDER BY (lower(u.display_name)=lower($3)) DESC,lower(u.display_name),u.id LIMIT 12`,[request.params.id,user.id,q]);
    return {accounts:result.rows};
  });

  app.get<{Params:{id:string}}>("/api/characters/:id/readers",async(request,reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    if(!UUID.test(request.params.id))return reply.code(404).send(notFound);
    const owned=await pool.query("SELECT id FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL",[request.params.id,user.id]);
    if(!owned.rows.length)return reply.code(404).send(notFound);
    const result=await pool.query(`SELECT u.id,u.display_name AS "displayName",u.role,
      (u.is_active AND u.role IN ('gm','editor','admin')) AS active
      FROM character_sheet_readers r JOIN users u ON u.id=r.reader_id WHERE r.character_id=$1
      ORDER BY u.display_name,u.id`,[request.params.id]);
    return {readers:result.rows};
  });

  app.post<{Params:{id:string};Body:{readerId?:unknown}}>("/api/characters/:id/readers",async(request,reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    if(!UUID.test(request.params.id))return reply.code(404).send(notFound);
    const readerId=typeof request.body?.readerId==="string"?request.body.readerId:"";
    if(!UUID.test(readerId))return reply.code(400).send({error:"reader_not_eligible"});
    // Ownership and reader eligibility are checked together, including on duplicate grants.
    const result=await pool.query(`INSERT INTO character_sheet_readers (character_id,reader_id)
      SELECT c.id,u.id FROM characters c CROSS JOIN users u
      WHERE c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND u.id=$3
        AND u.id<>$2 AND u.is_active AND u.role IN ('gm','editor','admin')
      ON CONFLICT (character_id,reader_id) DO UPDATE SET reader_id=EXCLUDED.reader_id
      RETURNING reader_id`,[request.params.id,user.id,readerId]);
    if(!result.rows.length)return reply.code(400).send({error:"reader_not_eligible"});
    return {ok:true};
  });

  app.delete<{Params:{id:string;readerId:string}}>("/api/characters/:id/readers/:readerId",async(request,reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    if(!UUID.test(request.params.id)||!UUID.test(request.params.readerId))return reply.code(404).send(notFound);
    const owned=await pool.query("SELECT id FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL",[request.params.id,user.id]);
    if(!owned.rows.length)return reply.code(404).send(notFound);
    await pool.query(`DELETE FROM character_sheet_readers r USING characters c
      WHERE r.character_id=c.id AND c.id=$1 AND c.owner_id=$2 AND r.reader_id=$3`,[request.params.id,user.id,request.params.readerId]);
    return {ok:true};
  });
}
