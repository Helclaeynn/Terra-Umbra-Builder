import {combatantRolls} from './campaign-live.js';
import type {FastifyInstance} from 'fastify';
import {BESTIARY_WEAPONS} from './campaign-bestiary-weapons.js';
import {randomInt,randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {blankPlayState,playProfile,rollD10} from './rules/play-state.js';
import {characterDerivedStats} from './rules/character-derived-stats.js';
import {getRealityRules} from './rules/reality.js';
const uuid=(v:any)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const integer=(v:any,min=0,max=100)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
const kinds=['melee','balistique','antichoc','feu','froid','electricite','chimique','occulte','neuro'];
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function combatEquipment(data:any,npc=false){
 const rules=getRealityRules(),catalog=[...rules.equipment,...rules.augmentations];
 const owned=npc?(data.equipmentIds??[]).map((itemId:string)=>({itemId})): [...(data.reality?.equipment??[]),...(data.reality?.augmentations??[]).filter((p:any)=>p.loaded!==false)];
 return owned.flatMap((p:any)=>{const item=catalog.find(x=>x.id===p.itemId||(x as any).compendiumId?.replace(/^equipement-\d+-/,'')===p.itemId);if(!item)return [];
  const text=item.effect+' '+Object.values(item.data??{}).join(' · '),n=norm(text),body=Number(/armure (?:corporelle|naturelle)\s*(\d+)/.exec(n)?.[1]??0),armor=Number(/armure\s+(\d+)/.exec(n)?.[1]??0);
  const aliases:Record<string,string>={melee:'(?:melee|mel\\.)',balistique:'(?:balistique|bal\\.)',antichoc:'(?:antichoc|ant\\.)'};
  const reductions=Object.fromEntries(kinds.map(k=>{const direct=Number(new RegExp('(?:reduction\\s+)?'+(aliases[k]??k)+'\\s*[:+]?\\s*(\\d+)').exec(n)?.[1]??0);
   const grouped=[...n.matchAll(/reduction\s+(\d+)\s*\[([^\]]+)\]/g)].filter(m=>m[2].split('/').map(t=>t.trim()).includes(k)).map(m=>Number(m[1]));return [k,Math.max(direct,0,...grouped)];}));
  return body||armor||Object.values(reductions).some(Boolean)||/armure/i.test(item.category)?[{id:p.uid??p.itemId,name:item.name,text,body,armor,reductions}]:[];
 });
}
export function damageCalculation(a:any,defense:number,armor:number,reduction:number){
 const margin=a.total-defense,hit=!a.narrativeFailure&&margin>0,material=Math.max(0,armor-a.penetration);
 return {hit,margin:Math.max(0,margin),defense,armor,penetration:a.penetration,material,reduction,weaponDamage:a.damage,bonusDamage:a.bonusDamage,damage:hit?Math.max(0,margin+a.damage+a.bonusDamage-material-reduction):0};
}
async function member(db:any,campaign:string,user:any){
 const r=await db.query(`SELECT c.owner_id=$2 AND u.role IN ('gm','editor','admin') AS manager FROM campaigns c JOIN users u ON u.id=$2 AND u.is_active WHERE c.id=$1 AND c.archived_at IS NULL AND (c.owner_id=$2 OR EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2 AND m.status='accepted'))`,[campaign,user.id]);return r.rows[0];
}
async function target(db:any,campaign:string,id:string,lock=false){
 const n=await db.query(`SELECT * FROM campaign_live_combatants WHERE campaign_id=$1 AND id=$2 AND NOT removed ${lock?'FOR UPDATE':''}`,[campaign,id]);
 if(n.rowCount){const c=n.rows[0],d=c.source_kind==='npc'?characterDerivedStats(k=>c.data.attributes?.[k]??0,k=>c.data.skills?.[k]??0,[]):null;
  return {...c,kind:c.source_kind,owner_id:null,defense:d?.passiveDefense??c.data.stats.physicalDefense??0,occultDefense:d?.occultDefense??c.data.stats.occultDefense??0,armor:c.source_kind==='npc'?c.data.armor??0:c.data.stats.armor??0,protections:c.source_kind==='creature'?[]:combatEquipment(c.data,true),reductions:c.data.reductions??{},stress:c.hp<=c.pv_max*.25?2:c.hp<=c.pv_max*.5?1:0};
 }
 const p=await db.query(`SELECT c.* FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' WHERE c.campaign_id=$1 AND c.id=$2 AND c.archived_at IS NULL ${lock?'FOR UPDATE OF c':''}`,[campaign,id]);if(!p.rowCount)return null;
 const c=p.rows[0],r=await db.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[id]),state={...blankPlayState(),...r.rows[0]?.state},profile=playProfile(c.data,state);
 return {...c,kind:'character',state,version:r.rows[0]?.version??0,hp:profile.hp,pv_max:profile.derived.pvMax,death:profile.derived.death,pa:profile.pa,initiative:state.initiative,defense:profile.derived.passiveDefense,occultDefense:profile.derived.occultDefense,armor:0,bodyArmor:profile.body?.armor??0,protections:combatEquipment(c.data),stress:profile.stress,visible:state.share};
}
export function characterAttacks(data:any,state:any,allWeapons=false){
 const profile=playProfile(data,state),equipment=getRealityRules().equipment;
 const owned=new Set((data.reality?.equipment??[]).filter((p:any)=>p.quantity!==0).map((p:any)=>p.itemId));
 const weapons=BESTIARY_WEAPONS.filter(w=>allWeapons||owned.has(w.id)||equipment.some(e=>owned.has(e.id)&&e.name===w.name));
 const bare=profile.skills.find(s=>s.id==='pugilat')!;
 return [{id:'unarmed',label:profile.body?'Armes naturelles · '+profile.body.form:'Mains nues',group:'Sans équipement',modifier:bare.total,damage:profile.body?.damage??1,penetration:0,damageType:profile.body?'melee':'antichoc'},...weapons.map(w=>{
  const skill=profile.skills.find(s=>s.id===(w.range==='Contact'?'melee':'tir'))!;
  return {id:w.id,label:w.name,group:w.group,modifier:skill.total,damage:w.damage,penetration:Number(/Perforant\s+(\d+)/i.exec(w.properties)?.[1]??0),damageType:/electri/i.test(w.properties)?'electricite':w.range==='Contact'?'melee':'balistique'};
 })].sort((a,b)=>a.group.localeCompare(b.group,'fr')||a.label.localeCompare(b.label,'fr'));
}
function attackOptions(t:any,manager=false){return t.kind==='character'?characterAttacks(t.data,t.state,manager):combatantRolls(t).filter(r=>r.attack).map(r=>({...r,group:r.profile??'Attaques du profil',damage:r.damage??1,penetration:r.penetration??0,damageType:r.damageType??'melee'})).sort((a,b)=>a.label.localeCompare(b.label,'fr'));}
async function saveTarget(db:any,t:any){
 if(t.kind==='character'){t.state.hp=t.hp;t.state.pa=t.pa;await db.query(`INSERT INTO character_play_states(character_id,version,state) VALUES($1,$2,$3::jsonb) ON CONFLICT(character_id) DO UPDATE SET version=EXCLUDED.version,state=EXCLUDED.state,updated_at=now()`,[t.id,t.version+1,JSON.stringify(t.state)]);}
 else await db.query('UPDATE campaign_live_combatants SET hp=$2,pa=$3,version=version+1 WHERE id=$1',[t.id,t.hp,t.pa]);
}
export async function registerCampaignCombatRoutes(app:FastifyInstance){
 app.get<{Params:{id:string}}>('/api/campaigns/:id/combat',async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;if(!uuid(req.params.id))return reply.code(404).send({error:'campaign_not_found'});const access=await member(pool,req.params.id,user);if(!access)return reply.code(404).send({error:'campaign_not_found'});
  const rows=await pool.query(`SELECT id,payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='attack' AND NOT EXISTS(SELECT 1 FROM campaign_live_events done WHERE done.campaign_id=$1 AND done.kind IN ('resolve','cancel') AND done.payload->>'attackId'=campaign_live_events.id::text) ORDER BY created_at`,[req.params.id]);
  const pending=[];for(const e of rows.rows){const t=await target(pool,req.params.id,e.payload.targetId);if(!t||!access.manager&&t.owner_id!==user.id)continue;
   const defense=await pool.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='defend' AND payload->>'attackId'=$2 ORDER BY created_at LIMIT 1",[req.params.id,e.id]);
   pending.push({id:e.id,...e.payload,...(!access.manager&&!e.payload.public?{attacker:'Attaquant non révélé'}:{}),target:{id:t.id,name:t.name,defense:t.defense,occultDefense:t.occultDefense,armor:t.armor,bodyArmor:t.bodyArmor??0,reductions:t.reductions??{},protections:t.protections,pa:t.pa,hp:t.hp,canDefend:t.hp>0&&t.pa>0&&t.initiative!==null},defense: defense.rows[0]?.payload??null});
  }
  const characterIds=await pool.query(`SELECT c.id FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' WHERE c.campaign_id=$1 AND c.archived_at IS NULL AND ($3::boolean OR c.owner_id=$2)`,[req.params.id,user.id,access.manager]);
  const npcIds=access.manager?await pool.query('SELECT id FROM campaign_live_combatants WHERE campaign_id=$1 AND NOT removed',[req.params.id]):{rows:[]};
  const attackers=[];for(const row of [...characterIds.rows,...npcIds.rows]){const t=await target(pool,req.params.id,row.id);if(t)attackers.push({id:t.id,name:t.name,options:attackOptions(t,access.manager)});}
  return {pending,attackers,canManage:access.manager,...(access.manager?{weapons:[...BESTIARY_WEAPONS].sort((a,b)=>a.group.localeCompare(b.group,'fr')||a.name.localeCompare(b.name,'fr'))}:{})};
 });
 app.post<{Params:{id:string};Body:any}>('/api/campaigns/:id/combat',async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;const b:any=req.body;if(!uuid(req.params.id)||!b||!uuid(b.requestId)||!['launch','attack','defend','resolve','cancel'].includes(b.action))return reply.code(400).send({error:'invalid_combat_action'});
  const db=await pool.connect();try{await db.query('BEGIN');const fail=async(code:number,error:string)=>{await db.query('ROLLBACK');return reply.code(code).send({error});};
   const access=await member(db,req.params.id,user);if(!access)return await fail(404,'campaign_not_found');
   await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[b.requestId]);const previous=await db.query('SELECT campaign_id,created_by,request_payload FROM campaign_live_events WHERE id=$1',[b.requestId]);if(previous.rowCount){if(previous.rows[0].campaign_id!==req.params.id||previous.rows[0].created_by!==user.id||!isDeepStrictEqual(previous.rows[0].request_payload,b))return await fail(409,'combat_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
   let payload:any,publicEvent=false;
   if(b.action==='launch'){
    if(!uuid(b.attackerId)||!uuid(b.targetId)||b.attackerId===b.targetId||typeof b.optionId!=='string'||!integer(b.bonus,-100)||!integer(b.bonusDamage,-100)||typeof b.surprise!=='boolean')return await fail(400,'invalid_attack');
    // Serialize launches per campaign before acquiring two participant locks.
    await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[req.params.id+':launch']);
    const source=await target(db,req.params.id,b.attackerId,true),victim=await target(db,req.params.id,b.targetId);
    if(!source||!victim||!access.manager&&(source.owner_id!==user.id||!victim.visible))return await fail(404,'attack_not_found');
    const option=attackOptions(source,access.manager).find((r:any)=>r.id===b.optionId);if(!option)return await fail(400,'weapon_not_owned');
    if(source.hp<=0||source.pa<1||source.initiative===null||source.state?.muePending)return await fail(400,'attack_unavailable');
    const die=rollD10(source.stress,()=>randomInt(1,11)),modifier=option.modifier+b.bonus,eventId=randomUUID();
    const roll={label:'Attaque · '+option.label,characterName:source.name,...die,modifier,total:modifier+die.sum,damage:option.damage,targetName:victim.visible?victim.name:'Cible non révélée',bonus:b.bonus};
    const visible=!!source.visible&&!!victim.visible;
    await db.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'roll',$4::jsonb,$5::jsonb,$6)",[eventId,req.params.id,user.id,JSON.stringify(roll),JSON.stringify(b),visible]);
    source.pa--;await saveTarget(db,source);
    payload={label:'Attaque à résoudre',eventId,targetId:victim.id,attacker:source.name,total:roll.total,narrativeFailure:die.narrativeFailure,damage:option.damage,bonusDamage:b.bonusDamage,penetration:option.penetration,damageType:option.damageType,surprise:b.surprise,public:visible};
   }else if(b.action==='attack'){
    if(!access.manager)return await fail(403,'mj_only');
    if(!uuid(b.eventId)||!uuid(b.targetId)||!integer(b.damage)||!integer(b.bonusDamage,-100)||!integer(b.penetration)||!kinds.includes(b.damageType)||typeof b.surprise!=='boolean')return await fail(400,'invalid_attack');
    const r=await db.query(`SELECT payload,public FROM campaign_live_events WHERE id=$1 AND campaign_id=$2 AND kind IN ('roll','gm-roll') UNION ALL SELECT e.payload||jsonb_build_object('characterName',c.name),true AS public FROM character_play_events e JOIN characters c ON c.id=e.character_id WHERE e.id=$1 AND e.campaign_id=$2 AND c.campaign_id=$2 AND e.kind='roll'`,[b.eventId,req.params.id]);
    if(!r.rowCount||!Number.isSafeInteger(r.rows[0].payload.total)||!await target(db,req.params.id,b.targetId))return await fail(404,'attack_not_found');
    await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[b.eventId+':'+b.targetId]);
    const duplicate=await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind='attack' AND payload->>'eventId'=$2 AND payload->>'targetId'=$3",[req.params.id,b.eventId,b.targetId]);if(duplicate.rowCount)return await fail(409,'attack_already_requested');
    payload={label:'Attaque à résoudre',eventId:b.eventId,targetId:b.targetId,attacker:r.rows[0].payload.characterName??'Attaquant',total:r.rows[0].payload.total,narrativeFailure:!!r.rows[0].payload.narrativeFailure,damage:b.damage,bonusDamage:b.bonusDamage,penetration:b.penetration,damageType:b.damageType,surprise:b.surprise,public:!!r.rows[0].public};
   }else{
    if(!uuid(b.attackId))return await fail(400,'invalid_attack');await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[b.attackId]);
    const r=await db.query("SELECT payload FROM campaign_live_events WHERE id=$1 AND campaign_id=$2 AND kind='attack'",[b.attackId,req.params.id]);if(!r.rowCount)return await fail(404,'attack_not_found');const a=r.rows[0].payload;
    const t=await target(db,req.params.id,a.targetId,true);if(!t||!access.manager&&t.owner_id!==user.id)return await fail(404,'target_not_found');
    const finished=await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind IN ('resolve','cancel') AND payload->>'attackId'=$2",[req.params.id,b.attackId]);if(finished.rowCount)return await fail(409,'attack_already_resolved');
    const d=await db.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='defend' AND payload->>'attackId'=$2",[req.params.id,b.attackId]);
    payload={attackId:b.attackId,targetId:t.id,characterName:t.name};
    if(b.action==='cancel'){if(!access.manager)return await fail(403,'mj_only');payload.label='Attaque annulée';}
    else if(b.action==='defend'){
     if(d.rowCount)return await fail(409,'defense_already_chosen');if(typeof b.active!=='boolean'||!integer(b.bonus,-100))return await fail(400,'invalid_defense');
     if(b.active&&(a.surprise||t.hp<=0||t.pa<1||t.initiative===null||a.narrativeFailure))return await fail(400,'active_defense_unavailable');
     const base=['occulte','neuro'].includes(a.damageType)?t.occultDefense:t.defense,die=b.active?rollD10(t.stress,()=>randomInt(1,11)):null;
     payload={...payload,label:b.active?'Défense active':'Défense passive',active:b.active,modifier:base+b.bonus,...die,total:base+b.bonus+(die?.sum??0)};
     if(b.active){t.pa--;await saveTarget(db,t);}
    }else{
     if(!d.rowCount)return await fail(400,'choose_defense');const defense=d.rows[0].payload;
     if(typeof b.material!=='boolean'||!Array.isArray(b.protectionIds)||b.protectionIds.length>100||b.protectionIds.some((id:any)=>!t.protections.some((p:any)=>p.id===id))||!integer(b.extraArmor)||!integer(b.extraReduction)||!integer(b.armor,-0,100)||!integer(b.defenseOverride,0,1000))return await fail(400,'invalid_reduction');
     if(defense.narrativeFailure&&!access.manager)return await fail(400,'mj_defense_ruling_required');
     const selected=t.protections.filter((p:any)=>b.protectionIds.includes(p.id));
     const material=!b.material?0:b.armor+Math.max(0,...selected.map((p:any)=>p.armor))+Math.max(t.bodyArmor??0,...selected.map((p:any)=>p.body))+b.extraArmor;
     const reduction=b.extraReduction+(t.reductions?.[a.damageType]??0)+Math.max(0,...selected.map((p:any)=>p.reductions[a.damageType]??0));
     const calc=damageCalculation(a,defense.narrativeFailure?b.defenseOverride:defense.total,material,reduction),before=t.hp;
     t.hp=Math.max(t.death,t.hp-calc.damage);if(t.kind==='character'&&calc.damage>0)t.state.stabilized=false;t.pa=t.hp<=t.death?0:t.hp<=0?Math.min(t.pa,1):t.pa;
     await saveTarget(db,t);payload={...payload,label:'Résolution d’attaque',...calc,before,after:t.hp,attackTotal:a.total,defenseTotal:defense.narrativeFailure?b.defenseOverride:defense.total,defenseDice:defense.dice??[],active:defense.active,defenseNarrativeFailure:!!defense.narrativeFailure};publicEvent=a.public&&t.visible;
    }
   }
   await db.query('INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7)',[b.requestId,req.params.id,user.id,b.action==='launch'?'attack':b.action,JSON.stringify(payload),JSON.stringify(b),publicEvent]);await db.query('COMMIT');return {ok:true};
  }catch(e){await db.query('ROLLBACK').catch(()=>{});throw e;}finally{db.release();}
 });
}
