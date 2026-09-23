import type { FastifyInstance } from "fastify";
import { pool } from "./db.js";
import { requireUser } from "./auth.js";

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const columns=`j.id,j.title,j.played_on::text AS "playedOn",j.content,j.version,
  j.created_at::text AS "createdAt",j.updated_at::text AS "updatedAt"`;
type NoteBody={title?:unknown;playedOn?:unknown;content?:unknown;version?:unknown};
function noteBody(body:NoteBody|undefined){
  if(!body||typeof body.title!=="string"||typeof body.content!=="string"||typeof body.playedOn!=="string")return null;
  const title=body.title.trim(),content=body.content.trim(),playedOn=body.playedOn;
  if(!title||title.length>120||!content||content.length>20000||!/^\d{4}-\d{2}-\d{2}$/.test(playedOn))return null;
  const date=new Date(`${playedOn}T00:00:00Z`);
  if(Number(playedOn.slice(0,4))<1||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==playedOn)return null;
  return {title,content,playedOn};
}
const versionValid=(version:unknown)=>Number.isSafeInteger(version)&&Number(version)>0;

/** Personal adventure notes are deliberately excluded from sheet sharing. */
export async function registerCharacterJournalRoutes(app:FastifyInstance){
  app.get<{Params:{id:string};Querystring:{offset?:string}}>("/api/characters/:id/journal",async(request,reply)=>{
    const user=await requireUser(request,reply);if(!user)return;
    if(!UUID.test(request.params.id))return reply.code(404).send({error:"character_not_found"});
    const owned=await pool.query("SELECT id,name FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL",[request.params.id,user.id]);
    if(!owned.rows.length)return reply.code(404).send({error:"character_not_found"});
    const offset=Number(request.query.offset??0);
    if(!Number.isSafeInteger(offset)||offset<0||offset>100000)return reply.code(400).send({error:"invalid_journal_page"});
    const result=await pool.query(`SELECT ${columns} FROM character_journal_entries j
      JOIN characters c ON c.id=j.character_id WHERE c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL
      ORDER BY j.created_at DESC,j.id DESC LIMIT 21 OFFSET $3`,[request.params.id,user.id,offset]);
    return {character:owned.rows[0],entries:result.rows.slice(0,20),hasMore:result.rows.length>20};
  });
  app.post<{Params:{id:string};Body:NoteBody}>("/api/characters/:id/journal",async(request,reply)=>{
    const user=await requireUser(request,reply);if(!user)return;
    if(!UUID.test(request.params.id))return reply.code(404).send({error:"character_not_found"});
    const note=noteBody(request.body);
    if(!note)return reply.code(400).send({error:"invalid_journal_entry"});
    const result=await pool.query(`INSERT INTO character_journal_entries AS j (character_id,title,played_on,content)
      SELECT id,$3,$4::date,$5 FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL
      RETURNING ${columns}`,[request.params.id,user.id,note.title,note.playedOn,note.content]);
    if(!result.rows.length)return reply.code(404).send({error:"character_not_found"});
    return reply.code(201).send({entry:result.rows[0]});
  });
  app.patch<{Params:{id:string;entryId:string};Body:NoteBody}>("/api/characters/:id/journal/:entryId",async(request,reply)=>{
    const user=await requireUser(request,reply);if(!user)return;
    const {id,entryId}=request.params;
    if(!UUID.test(id)||!UUID.test(entryId))return reply.code(404).send({error:"journal_entry_not_found"});
    const note=noteBody(request.body);
    if(!note||!versionValid(request.body.version))return reply.code(400).send({error:"invalid_journal_entry"});
    const result=await pool.query(`UPDATE character_journal_entries j
      SET title=$4,played_on=$5::date,content=$6,version=j.version+1,updated_at=now()
      FROM characters c WHERE j.character_id=c.id AND c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL
        AND j.id=$3 AND j.version=$7 RETURNING ${columns}`,[id,user.id,entryId,note.title,note.playedOn,note.content,request.body.version]);
    if(result.rows.length)return {entry:result.rows[0]};
    const existing=await pool.query(`SELECT j.id FROM character_journal_entries j JOIN characters c ON c.id=j.character_id
      WHERE c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND j.id=$3`,[id,user.id,entryId]);
    return reply.code(existing.rows.length?409:404).send({error:existing.rows.length?"journal_version_conflict":"journal_entry_not_found"});
  });
  app.delete<{Params:{id:string;entryId:string};Body:{version?:unknown}}>("/api/characters/:id/journal/:entryId",async(request,reply)=>{
    const user=await requireUser(request,reply);if(!user)return;
    const {id,entryId}=request.params;
    if(!UUID.test(id)||!UUID.test(entryId))return reply.code(404).send({error:"journal_entry_not_found"});
    if(!versionValid(request.body?.version))return reply.code(400).send({error:"invalid_journal_entry"});
    const result=await pool.query(`DELETE FROM character_journal_entries j USING characters c
      WHERE j.character_id=c.id AND c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND j.id=$3 AND j.version=$4 RETURNING j.id`,[id,user.id,entryId,request.body.version]);
    if(result.rows.length)return {ok:true};
    const existing=await pool.query(`SELECT j.id FROM character_journal_entries j JOIN characters c ON c.id=j.character_id
      WHERE c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND j.id=$3`,[id,user.id,entryId]);
    return reply.code(existing.rows.length?409:404).send({error:existing.rows.length?"journal_version_conflict":"journal_entry_not_found"});
  });
}
