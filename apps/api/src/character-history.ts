import type { FastifyInstance } from "fastify";
import { pool } from "./db.js";
import { requireUser } from "./auth.js";
import { normalizeCharacterData } from "./character-data.js";

/** Only the fields needed for progression comparisons leave the history endpoint. */
function snapshot(raw:Record<string,unknown>,name:string){
  const data=normalizeCharacterData(raw,name);
  const pick=(source:Record<string,unknown>,keys:string[])=>Object.fromEntries(keys.filter(key=>key in source).map(key=>[key,source[key]]));
  return {
    creation:{sphere:data.creation.sphere},attributes:data.attributes,edgeAttributes:data.edgeAttributes,skills:data.skills,
    truth:pick(data.truth,['nature','consciousness','choices','truthTalents','truthEquipment','truthEquipmentMjOverride','corruption','corruptionSource','corruptionTalents','corruptionMjAuthorized']),
    progression:pick(data.progression,['xpEarned','ptvEarned','skillRanks','attributeRanks','realityTalents','truthTalents','corruptionTalents','truthTalentsMjAuthorized','truthEquipmentMjAuthorized','flashUses','cashBase','cashTransactions'])
  };
}
export async function registerCharacterHistoryRoutes(app:FastifyInstance){
  app.get<{Params:{id:string};Querystring:{before?:string}}>("/api/characters/:id/history",async(request,reply)=>{
    const user=await requireUser(request,reply);if(!user)return;
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(request.params.id))return reply.code(404).send({error:"character_not_found"});
    const before=request.query.before===undefined?null:Number(request.query.before);
    if(before!==null&&(!Number.isSafeInteger(before)||before<1||before>2147483647))return reply.code(400).send({error:"invalid_history_cursor"});
    const owned=await pool.query('SELECT id,name,version FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL',[request.params.id,user.id]);
    if(!owned.rows.length)return reply.code(404).send({error:"character_not_found"});
    const result=await pool.query(`SELECT r.revision,r.reason,r.created_at::text AS "createdAt",r.name,
      jsonb_build_object('creation',r.data->'creation','attributes',r.data->'attributes',
        'edgeAttributes',r.data->'edgeAttributes','skills',r.data->'skills',
        'truth',r.data->'truth','progression',r.data->'progression') AS data
      FROM character_revisions r JOIN characters c ON c.id=r.character_id
      WHERE c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND ($3::integer IS NULL OR r.revision<$3)
      ORDER BY r.revision DESC LIMIT 21`,[request.params.id,user.id,before]);
    const rows=result.rows.map(row=>({revision:row.revision,reason:row.reason,createdAt:row.createdAt,snapshot:snapshot(row.data,row.name)}));
    return {character:owned.rows[0],revisions:rows.slice(0,20),predecessor:rows[20]??null,nextBefore:rows.length>20?rows[19].revision:null};
  });
}
