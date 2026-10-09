import {terraUmbraEdgeRules} from './rules/terra-umbra-disadvantages-edge.js';
import {paratonnerreTest} from './rules/lightning.js';
type Db={query:(...args:any[])=>Promise<any>};
export function startingEdge(data:any){return Math.max(0,Math.min(8,terraUmbraEdgeRules.base+(data.disadvantages?.length??0)-['attributePack','skillPacks','talentPacks','cashPacks','lifestylePack','augmentationPacks','renownPack'].reduce((sum,k)=>sum+(Number(data.edge?.[k])||0),0)));}
export async function edgeBalance(db:Db,id:string,data:any){return (await db.query('SELECT balance FROM character_edge_accounts WHERE character_id=$1',[id])).rows[0]?.balance??startingEdge(data);}
// Caller holds the character lock, and the campaign lock when applicable.
export async function spendEdge(db:Db,id:string,data:any,reference:string,kind:'force'|'escape'){
 if((await db.query('SELECT 1 FROM character_edge_uses WHERE character_id=$1 AND reference_id=$2',[id,reference])).rowCount)return 'edge_already_used';
 await db.query('INSERT INTO character_edge_accounts(character_id,balance) VALUES($1,$2) ON CONFLICT DO NOTHING',[id,startingEdge(data)]);
 if(!(await db.query('UPDATE character_edge_accounts SET balance=balance-1 WHERE character_id=$1 AND balance>0 RETURNING balance',[id])).rowCount)return 'insufficient_edge';
 await db.query('INSERT INTO character_edge_uses(character_id,reference_id,kind) VALUES($1,$2,$3)',[id,reference,kind]);return null;
}
export const forcedDie=()=>({dice:[10,10],sum:20,exploded:true,narrativeFailure:false,edgeForced:true});
export async function lethalEvent(db:Db,id:string,death:number){
 const r=await db.query(`SELECT id,payload FROM (
 SELECT id,payload,created_at FROM character_play_events WHERE character_id=$1 AND kind='damage'
 UNION ALL SELECT id,payload,created_at FROM campaign_live_events WHERE kind='resolve' AND payload->>'targetId'=$1::text
 ) e ORDER BY created_at DESC,id DESC LIMIT 1`,[id]);
 return r.rows[0]?.payload.after<=death?r.rows[0].id:null;
}
export async function forcePastRoll(db:Db,c:any,state:any,id:string){
 let table='character_play_events';
 let event=(await db.query("SELECT id,kind,payload FROM character_play_events WHERE id=$1 AND character_id=$2 AND campaign_id IS NOT DISTINCT FROM $3::uuid AND kind IN ('roll','initiative') AND live_session_id IS NOT DISTINCT FROM (SELECT session_id FROM campaign_live_context WHERE campaign_id=$3)",[id,c.id,c.campaign_id])).rows[0];
 if(!event){table='campaign_live_events';event=(await db.query("SELECT id,kind,payload FROM campaign_live_events WHERE id=$1 AND campaign_id=$2 AND kind IN ('roll','defend','initiative','paratonnerre') AND payload->>'characterId'=$3 AND live_session_id IS NOT DISTINCT FROM (SELECT session_id FROM campaign_live_context WHERE campaign_id=$2)",[id,c.campaign_id,c.id])).rows[0];}
 if((await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind='occult-resolve' AND (payload->>'rollEventId'=$2 OR payload->>'sourceEventId'=$2) LIMIT 1",[c.campaign_id,id])).rowCount)return {error:'edge_roll_resolved'};
 if(!event||!Array.isArray(event.payload.dice))return {error:'edge_roll_unavailable'};
 if(event.payload.edgeForced)return {error:'edge_already_used'};
 const linked=await db.query("SELECT id,payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='attack' AND payload->>'eventId'=$2",[c.campaign_id,id]);
 // An opposition must keep the attack result that the intervenant actually opposed.
 if(linked.rows.some((a:any)=>a.payload.electricDiversion))return {error:'edge_roll_resolved'};
 const attackIds=[...linked.rows.map((r:any)=>r.id),...(event.payload.attackId?[event.payload.attackId]:[])];
 if(attackIds.length&&(await db.query("SELECT id FROM campaign_live_events WHERE kind IN ('resolve','cancel') AND payload->>'attackId'=ANY($1::text[])",[attackIds])).rowCount)return {error:'edge_roll_resolved'};
 const electrical=event.kind==='paratonnerre'?(await db.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND id=$2 AND kind='attack'",[c.campaign_id,event.payload.attackId])).rows[0]?.payload:null;
 if(event.kind==='paratonnerre'&&(!(await db.query('SELECT active FROM campaign_combat_states WHERE campaign_id=$1',[c.campaign_id])).rows[0]?.active||(await db.query("SELECT boundary.id FROM campaign_live_events boundary JOIN campaign_live_events reaction ON reaction.id=$2 WHERE boundary.campaign_id=$1 AND boundary.kind IN ('combat-start','combat-stop','combat-scene','combat-scenario') AND boundary.created_at>reaction.created_at LIMIT 1",[c.campaign_id,id])).rowCount))return {error:'edge_roll_resolved'};
 if(event.kind==='paratonnerre'&&(!electrical||electrical.electricDiversion?.actorId!==c.id||electrical.electricDiversion?.eventId!==id||electrical.electricDiversion.success||(await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind='defend' AND payload->>'attackId'=$2",[c.campaign_id,event.payload.attackId])).rowCount))return {error:'edge_roll_resolved'};
 if(event.kind==='initiative'&&(state.round!==1||state.initiative!==event.payload.total||state.pa<state.paPerRound))return {error:'edge_roll_resolved'};
 const error=await spendEdge(db,c.id,c.data,id,'force');if(error)return {error};
 const p={...event.payload,originalRoll:{dice:event.payload.dice,total:event.payload.total,narrativeFailure:event.payload.narrativeFailure},...forcedDie(),total:event.payload.modifier+20};
 if(electrical){p.success=paratonnerreTest(p.total,false,electrical.total);electrical.electricDiversion={...electrical.electricDiversion,...forcedDie(),total:p.total,success:p.success,narrativeFailure:false,edgeForced:true};await db.query('UPDATE campaign_live_events SET payload=$2::jsonb WHERE id=$1',[event.payload.attackId,JSON.stringify(electrical)]);}
 await db.query(`UPDATE ${table} SET payload=$2::jsonb WHERE id=$1`,[id,JSON.stringify(p)]);
 for(const a of linked.rows)await db.query("UPDATE campaign_live_events SET payload=payload||$2::jsonb WHERE id=$1",[a.id,JSON.stringify({total:p.total,narrativeFailure:false})]);
 if(event.kind==='initiative'){const allowance=p.total>=16?3:p.total>=11?2:1;state.pa+=allowance-state.paPerRound;state.paPerRound=allowance;state.initiative=p.total;}
 return {payload:{...p,label:'Forcer le Destin · '+event.payload.label,referenceId:id}};
}
export async function grantEdge(db:Db,id:string,data:any,amount:number){
 const balance=await edgeBalance(db,id,data);if(balance+amount>8)return 'edge_limit';
 await db.query('INSERT INTO character_edge_accounts(character_id,balance) VALUES($1,$2) ON CONFLICT(character_id) DO UPDATE SET balance=EXCLUDED.balance',[id,balance+amount]);return null;
}
