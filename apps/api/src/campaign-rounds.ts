import {randomInt,randomUUID} from 'node:crypto';
import {blankPlayState,playProfile,rollD10,type PlayState} from './rules/play-state.js';
import {liveBody} from './rules/play-truth.js';

type Db={query:(...args:any[])=>Promise<any>};
export const emptyCombat=()=>({active:false,mode:'manual',round:1,turns:{} as Record<string,number>,version:0});
// All live mutations acquire this lock BEFORE any participant lock.
export async function lockCombat(db:Db,id:string|null){if(id)await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',['campaign-combat:'+id]);}
export async function combatState(db:Db,id:string|null){if(!id)return emptyCombat();return (await db.query('SELECT active,mode,round,turns,version FROM campaign_combat_states WHERE campaign_id=$1',[id])).rows[0]??emptyCombat();}
async function writeCombat(db:Db,id:string,s:any){await db.query(`INSERT INTO campaign_combat_states(campaign_id,active,mode,round,turns,version) VALUES($1,$2,$3,$4,$5::jsonb,$6) ON CONFLICT(campaign_id) DO UPDATE SET active=EXCLUDED.active,mode=EXCLUDED.mode,round=EXCLUDED.round,turns=EXCLUDED.turns,version=EXCLUDED.version`,[id,s.active,s.mode,s.round,JSON.stringify(s.turns),s.version+1]);}
export async function combatActors(db:Db,id:string){
 const pcs=await db.query(`SELECT c.id,c.name,c.owner_id,c.data,s.state FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' LEFT JOIN character_play_states s ON s.character_id=c.id WHERE c.campaign_id=$1 AND c.archived_at IS NULL ORDER BY c.id`,[id]);
 const actors=pcs.rows.map((c:any)=>{const state={...blankPlayState(),...c.state},p=playProfile(c.data,state);return {...c,state,kind:'character',visible:state.share,pa:p.pa,initiative:state.initiative,hp:p.hp,death:p.derived.death,profile:p};});
 const npcs=await db.query('SELECT * FROM campaign_live_combatants WHERE campaign_id=$1 AND NOT removed ORDER BY id',[id]);
 return [...actors,...npcs.rows.map((c:any)=>({...c,kind:c.source_kind}))];
}
export async function pendingAttacks(db:Db,id:string){return !!(await db.query(`SELECT id FROM campaign_live_events e WHERE campaign_id=$1 AND kind='attack' AND NOT EXISTS(SELECT 1 FROM campaign_live_events done WHERE done.campaign_id=$1 AND done.kind IN ('resolve','cancel') AND done.payload->>'attackId'=e.id::text) LIMIT 1`,[id])).rowCount;}
export function advanceCharacterRound(data:any,state:PlayState){
 const before=playProfile(data,state);state.round++;
 state.powerUses=Object.fromEntries(Object.entries(state.powerUses??{}).filter(([k])=>!k.startsWith('round:')));
 state.powers=(state.powers??[]).filter(p=>p.until===null||p.until>=state.round);
 if(state.muePending&&state.round>=state.muePending){state.form='hybrid';state.revelation='r';state.muePending=null;state.formPaRound=state.round+1;const after=playProfile(data,state);state.hp=before.hp+after.derived.pvMax-before.derived.pvMax;}
 state.pa=state.initiative===null?0:state.paPerRound+((state.formPaRound??0)<=state.round?(liveBody(data,state)?.pace??0):0);
 state.pa=playProfile(data,state).pa;
}
async function saveActor(db:Db,c:any){
 if(c.kind==='character')await db.query(`INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,1) ON CONFLICT(character_id) DO UPDATE SET state=EXCLUDED.state,version=character_play_states.version+1,updated_at=now()`,[c.id,JSON.stringify(c.state)]);
 else await db.query('UPDATE campaign_live_combatants SET initiative=$2,pa=$3,pa_per_round=$4,round=$5,version=version+1 WHERE id=$1',[c.id,c.initiative,c.pa,c.pa_per_round,c.round]);
}
async function log(db:Db,id:string,user:string,kind:string,payload:any,visible=true){await db.query(`INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,$4,$5::jsonb,'{}'::jsonb,$6)`,[randomUUID(),id,user,kind,JSON.stringify(payload),visible]);}
export async function nextCombatRound(db:Db,id:string,user:string,s:any,actors:any[],automatic=false){
 s.round++;s.turns={};
 for(const c of actors){if(c.initiative===null)continue;
  if(c.kind==='character'){c.state.round=s.round-1;advanceCharacterRound(c.data,c.state);}
  else{c.round=s.round;c.pa=c.hp<=c.death?0:c.hp<=0?Math.min(c.pa_per_round,1):c.pa_per_round;}
  await saveActor(db,c);
 }
 await writeCombat(db,id,s);
 if(automatic)await log(db,id,user,'combat-round',{label:`Round ${s.round} · automatique`,round:s.round});
}
export async function manageCombat(db:Db,id:string,user:string,b:any){
 const s=await combatState(db,id);
 if(b.version!==s.version)return 'combat_version_conflict';
 if(b.action==='combat-mode'){
  if(!['manual','automatic'].includes(b.mode))return 'invalid_combat_mode';s.mode=b.mode;await writeCombat(db,id,s);return null;
 }
 if(b.action==='combat-start'&&s.active)return 'combat_already_started';
 if(b.action!=='combat-start'&&!s.active)return 'combat_not_started';
 if(await pendingAttacks(db,id))return 'pending_attacks';
 const actors=await combatActors(db,id);
 if(b.action==='combat-round'){await nextCombatRound(db,id,user,s,actors);return null;}
 s.active=b.action==='combat-start';s.round=1;s.turns={};
 for(const c of actors){
  if(s.active){
   if(c.hp<=c.death)continue;
   const stress=c.kind==='character'?c.profile.stress:c.hp<=c.pv_max*.25?2:c.hp<=c.pv_max*.5?1:0;
   const die=rollD10(stress,()=>randomInt(1,11)),modifier=c.kind==='character'?c.profile.derived.initiative:c.initiative_bonus,total=modifier+die.sum;
   const base=c.kind==='creature'?Math.max(1,Math.min(20,c.data.stats.actions??1)):die.dice[0]===1?1:total>=16?3:total>=11?2:1;
   if(c.kind==='character'){Object.assign(c.state,{initiative:total,round:1,paPerRound:base,pa:base+(liveBody(c.data,c.state)?.pace??0),formPaRound:0});if(c.state.muePending)c.state.muePending=2;c.state.pa=playProfile(c.data,c.state).pa;}
   else{Object.assign(c,{initiative:total,round:1,pa_per_round:base,pa:c.hp<=0?Math.min(base,1):base});}
   await log(db,id,user,'initiative',{label:'Initiative',characterName:c.name,characterId:c.kind==='character'?c.id:null,modifier,...die,total,stress},c.visible);
  }else if(c.kind==='character'){
   Object.assign(c.state,{initiative:null,pa:0,paPerRound:0,powers:[],mueBlocked:false});
   c.state.powerUses=Object.fromEntries(Object.entries(c.state.powerUses??{}).filter(([k])=>!k.startsWith('scene:')&&!k.startsWith('round:')));
  }else Object.assign(c,{initiative:null,pa:0,pa_per_round:0});
  await saveActor(db,c);
 }
 await writeCombat(db,id,s);return null;
}
// Actions move an actor to its next pass. Reactions consume future PA, not a turn.
export async function recordAction(db:Db,id:string|null,actor:string,cost:number){
 if(!id||cost<=0)return;const s=await combatState(db,id);if(!s.active)return;
 s.turns[actor]=(s.turns[actor]??0)+cost;await writeCombat(db,id,s);
}
export async function maybeAdvanceCombat(db:Db,id:string|null,user:string){
 if(!id)return;const s=await combatState(db,id);if(!s.active||s.mode!=='automatic')return;
 const actors=await combatActors(db,id),visible=actors.filter(c=>c.visible&&c.initiative!==null&&c.hp>c.death);
 if(!visible.length||visible.some(c=>c.pa>0)||await pendingAttacks(db,id))return;
 await nextCombatRound(db,id,user,s,actors,true);
}
export function combatQueue(actors:any[],s:any){
 return actors.map(c=>({id:c.id,initiative:c.initiative,pass:s.active&&c.initiative!==null&&c.pa>0?(s.turns[c.id]??0)+1:null}))
 .sort((a,b)=>(s.active?(a.pass??Infinity)-(b.pass??Infinity):0)||(b.initiative??-Infinity)-(a.initiative??-Infinity)||a.id.localeCompare(b.id));
}
