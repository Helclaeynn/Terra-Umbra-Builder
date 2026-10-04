import {lockCombat,combatState,manageCombat,recordAction,maybeAdvanceCombat} from './campaign-rounds.js';
import {weaponMechanics} from './rules/combat-damage.js';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {liveCatalog,repairedCombatantData,combatReference,capabilityRolls} from './campaign-live-catalog.js';
import {BESTIARY_WEAPONS} from './campaign-bestiary-weapons.js';
import type {FastifyInstance} from 'fastify';
import type {PoolClient} from 'pg';
import {isDeepStrictEqual} from 'node:util';
import {randomInt} from 'node:crypto';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {npcPortrait} from './campaign-npcs.js';
import {characterDerivedStats} from './rules/character-derived-stats.js';
import {terraUmbraCreationRules as rules} from './rules/terra-umbra-creation.js';
import {rollD10} from './rules/play-state.js';
// Use the same UUID versions as character and campaign routes.
const validId=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
type Db=Pick<PoolClient,'query'>;
async function access(db:Db,id:string,userId:string,write=false){
 if(!validId(id))return null;
 const r=await db.query(`SELECT c.id,c.owner_id=$2 AND u.role IN ('gm','editor','admin') AS manager FROM campaigns c JOIN users u ON u.id=$2 AND u.is_active
 WHERE c.id=$1 AND c.archived_at IS NULL AND ((c.owner_id=$2 AND u.role IN ('gm','editor','admin')) OR ($3::boolean=false AND EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2 AND m.status='accepted'))) ${write?'FOR SHARE OF c,u':''}`,[id,userId,write]);
 return r.rows[0]??null;
}
export function combatantHealth(c:any){return c.hp<=c.death?'Mort':c.hp<=0?'Agonisant':c.hp<=c.pv_max*.25?'Gravement blessé':c.hp<=c.pv_max*.5?'Blessé':c.hp<c.pv_max?'Légèrement blessé':'Indemne';}
// These options are computed from the saved combat snapshot, never from client scores.
export function combatantRolls(c:any,allWeapons=false):any[]{
 if((c.source_kind??c.kind)==='creature')return [
  ...capabilityRolls(c.data),
  ...(c.data.attacks??[]).map((a:any,i:number)=>({id:'attack:'+i,label:'Attaque · '+a.name,modifier:a.score,attack:Number.isFinite(a.damage)&&Number.isFinite(a.score),damage:a.damage,...weaponMechanics({range:a.range||'Contact',properties:a.properties??''}),...(['melee','ranged','fixed'].includes(a.attackMode)?{attackMode:a.attackMode}:{}),components:{profileScore:a.score,profileName:a.name,bonus:0}})),
  ...Object.entries({attack:'Attaque de base',perception:'Perception',mastery:'Maîtrise',physicalDefense:'Défense physique active',occultDefense:'Défense occulte active'}).filter(([k])=>Number.isSafeInteger(c.data.stats[k])).map(([k,label])=>({id:k,label,modifier:c.data.stats[k],attack:false,requiresWeapon:k==='attack',defense:k.endsWith('Defense'),components:{profileScore:c.data.stats[k],profileName:label,bonus:0}}))
 ];
 return [...capabilityRolls(c.data),...['reality',...(c.data.truth?['truth']:[])].flatMap(profile=>{
  const data=profile==='truth'?c.data.truth:c.data;
  const skillRolls=rules.skills.map(skill=>{const attribute=data.attributes?.[skill.attribute]??0,rank=data.skills?.[skill.id]??0,attack=['pugilat','melee','tir'].includes(skill.id);
   return {id:profile+':'+skill.id,label:(attack?'Attaque · ':'')+skill.name,profile:profile==='truth'||/verite|revele/.test(data.sourceSection??'')?'Révélé':'Réalité',modifier:attribute+rank,attack:skill.id==='pugilat',requiresWeapon:attack&&skill.id!=='pugilat',...(skill.id==='pugilat'?{damage:1,damageType:'antichoc',attackMode:'melee'}:{}),defense:skill.id==='esquive',components:{attributeName:rules.attributes.find(a=>a.id===skill.attribute)?.name,attribute,skillName:skill.name,rank,bonus:0}};
  });
  const weapons=BESTIARY_WEAPONS.filter(w=>allWeapons||(c.data.equipmentIds??[]).includes(w.id)).map(w=>{const skill=w.range==='Contact'?'melee':'tir',base=skillRolls.find(r=>r.id===profile+':'+skill)!;return {...base,id:profile+':weapon:'+w.id,label:'Attaque · '+w.name,group:w.group,weaponName:w.name,attack:true,requiresWeapon:false,damage:w.damage,...weaponMechanics(w)};});
  return [...weapons,...skillRolls];
 })];
}
const validRoll=(b:any)=>typeof b.label==='string'&&b.label.trim().length>0&&b.label.length<=120&&Number.isSafeInteger(b.bonus)&&Math.abs(b.bonus)<=100&&[0,1,2].includes(b.stress)&&typeof b.public==='boolean';
export async function liveSnapshot(id:string,manager:boolean,sessionId:string|null=null,before:{at:string;id:string}|null=null){
 const result=await pool.query('SELECT * FROM campaign_live_combatants WHERE campaign_id=$1 AND NOT removed AND ($2::boolean OR visible) ORDER BY created_at,id',[id,manager]);
 await Promise.all(result.rows.map(async c=>{c.data=await repairedCombatantData(c);}));
 const combatants=result.rows.map(c=>({id:c.id,kind:c.source_kind,name:c.name,health:combatantHealth(c),portrait:c.data.portrait||c.data.image||c.data.sourcePortrait?`/api/campaigns/${id}/play/combatants/${c.id}/image`:'',...(manager?{rolls:combatantRolls(c),reference:combatReference(c.data),sourceId:c.source_id,sourceArticle:c.data.sourceArticle,sourceSection:c.data.sourceSection,hp:c.hp,pvMax:c.pv_max,death:c.death,initiative:c.initiative,initiativeBonus:c.initiative_bonus,pa:c.pa,paPerRound:c.pa_per_round,round:c.round,visible:c.visible,version:c.version}:{})}));
 const messages=await pool.query(`SELECT e.id,e.kind,e.payload,e.created_at::text AS "createdAt",u.display_name AS "playerName",e.image IS NOT NULL AS "hasImage" FROM campaign_live_events e JOIN users u ON u.id=e.created_by WHERE e.campaign_id=$1 AND e.live_session_id IS NOT DISTINCT FROM $3::uuid AND ($4::timestamptz IS NULL OR (e.created_at,e.id)<($4::timestamptz,$5::uuid)) AND NOT e.withdrawn AND ($2::boolean OR e.public) ORDER BY e.created_at DESC,e.id DESC LIMIT 101`,[id,manager,sessionId,before?.at??null,before?.id??null]);
 return {combatants,order:result.rows.map(c=>({id:c.id,initiative:c.initiative,pa:c.pa})),messages:messages.rows.map(e=>({...e,...(!manager?{payload:Object.fromEntries(Object.entries(e.payload).filter(([k])=>!['components','profile','before','after','armor','material','reduction','defense','penetration'].includes(k)))}:{}),...(e.hasImage?{image:`/api/campaigns/${id}/play/messages/${e.id}/image`}:{})}))};
}
function link(value:unknown){
 if(value===undefined||value==='')return '';
 if(typeof value!=='string'||value.length>1000)return null;
 try{const u=new URL(value,'https://terra-umbra.fr');if(u.origin!=='https://terra-umbra.fr'||u.pathname!=='/compendium'||!u.searchParams.get('article'))return null;return u.pathname+u.search+u.hash;}catch{return null;}
}
export async function registerCampaignLiveRoutes(app:FastifyInstance){
 app.get<{Params:{id:string}}>('/api/campaigns/:id/play/catalog',async(req,reply)=>{const user=await requireUser(req,reply);if(!user)return;if(!await access(pool,req.params.id,user.id,true))return reply.code(404).send({error:'campaign_not_found'});const entries=await liveCatalog();return {entries:entries.map(({data,...e})=>e)};});
 app.addHook('onSend',async(req,reply,payload)=>{if(/^\/api\/campaigns\/[^/]+\/play(?:\/|\?|$)/.test(req.url))reply.header('Cache-Control','private, no-store');return payload;});
 // All mutations are MJ-only, serialized and idempotent; duplicate retries never spend or heal twice.
 app.post<{Params:{id:string};Body:any}>('/api/campaigns/:id/play/actions',{bodyLimit:1024*1024},async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  const b:any=req.body;if(!b||!validId(b.requestId)||!['combat-start','combat-stop','combat-round','combat-mode','message','withdraw','add','roll','gm-roll','random-player','settings','damage','heal','initiative','round','remove'].includes(b.action))return reply.code(400).send({error:'invalid_live_action'});
  const db=await pool.connect();
  try{
   await db.query('BEGIN');
   const fail=async(code:number,error:string)=>{await db.query('ROLLBACK');return reply.code(code).send({error});};
   if(!await access(db,req.params.id,user.id,true))return await fail(404,'campaign_not_found');
   await lockCombat(db,req.params.id);
   // Serializes retries, including creation requests with no existing row to lock.
   await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[b.requestId]);
   const seen=await db.query('SELECT campaign_id,created_by,request_payload FROM campaign_live_events WHERE id=$1',[b.requestId]);
   if(seen.rows.length){const e=seen.rows[0];if(e.campaign_id!==req.params.id||e.created_by!==user.id||!isDeepStrictEqual(e.request_payload,b))return await fail(409,'live_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
   let payload:any={},publicEvent=false,image:Buffer|null=null,mime:string|null=null;
   if(b.action.startsWith('combat-')){
    const error=await manageCombat(db,req.params.id,user.id,b);if(error)return await fail(error==='combat_version_conflict'?409:400,error);
    payload={label:({'combat-start':'Combat commencé · initiatives lancées','combat-stop':'Combat terminé','combat-round':'Round '+(await combatState(db,req.params.id)).round+' · MJ','combat-mode':'Mode de rounds : '+(b.mode==='automatic'?'automatique':'manuel')} as Record<string,string>)[b.action]};publicEvent=true;
   }else if(b.action==='random-player'){
    if(typeof b.public!=='boolean')return await fail(400,'invalid_live_roll');
    const candidates=await db.query(`SELECT u.display_name,c.name FROM campaign_members m JOIN users u ON u.id=m.user_id AND u.is_active LEFT JOIN characters c ON c.id=m.character_id AND c.archived_at IS NULL WHERE m.campaign_id=$1 AND m.status='accepted' ORDER BY m.user_id`,[req.params.id]);
    if(!candidates.rowCount)return await fail(400,'no_players');const chosen=candidates.rows[randomInt(candidates.rowCount)];
    payload={characterName:'MJ',label:'Joueur tiré au hasard',selectedName:chosen.name||chosen.display_name,candidateCount:candidates.rowCount};publicEvent=b.public;
   }else if(b.action==='gm-roll'){
    if(!validRoll(b))return await fail(400,'invalid_live_roll');
    if(b.mode!==undefined&&!['explosive','dice'].includes(b.mode))return await fail(400,'invalid_live_roll');
    if(b.mode==='dice'&&(!Number.isSafeInteger(b.faces)||b.faces<2||b.faces>1000||!Number.isSafeInteger(b.count)||b.count<1||b.count>50))return await fail(400,'invalid_live_roll');
    const dice=b.mode==='dice'?Array.from({length:b.count},()=>randomInt(1,b.faces+1)):null;
    const die=dice?{dice,sum:dice.reduce((a,b)=>a+b,0),exploded:false,narrativeFailure:false,faces:b.faces}:rollD10(b.stress,()=>randomInt(1,11));
    payload={characterName:'MJ',label:b.label.trim(),modifier:b.bonus,...die,total:b.bonus+die.sum,stress:b.stress};publicEvent=b.public;
   }else if(b.action==='message'){
    const url=link(b.link);if(url===null||typeof b.text!=='string'||b.text.length>5000||(!b.text.trim()&&!url&&!b.image))return await fail(400,'invalid_live_message');
    if(b.image){const pic=typeof b.image==='string'?npcPortrait(b.image):null;if(!pic)return await fail(400,'invalid_live_image');image=pic.buffer;mime=pic.mime;}
    payload={label:'Révélation du MJ',text:b.text.trim(),link:url};publicEvent=true;
   }else if(b.action==='withdraw'){
    if(!validId(b.eventId))return await fail(400,'invalid_live_event');
    const r=await db.query("UPDATE campaign_live_events SET withdrawn=true WHERE id=$1 AND campaign_id=$2 AND kind='message' RETURNING id",[b.eventId,req.params.id]);if(!r.rowCount)return await fail(404,'live_event_not_found');
    payload={label:'Révélation retirée'};
   }else if(b.action==='add'){
    if(!(b.catalog==='compendium'?typeof b.sourceId==='string'&&b.sourceId.length<300:validId(b.sourceId))||!['npc','creature'].includes(b.kind)||typeof b.visible!=='boolean'||typeof b.name!=='string'||!b.name.trim()||b.name.length>120)return await fail(400,'invalid_live_combatant');
    let data:any,sourceId=b.sourceId;
    if(b.catalog==='compendium'){const source=(await liveCatalog()).find(s=>s.id===b.sourceId&&s.kind===b.kind);if(!source)return await fail(404,'live_source_not_found');data=source.data;sourceId=b.requestId;}
    else {const table=b.kind==='npc'?'campaign_npcs':'campaign_bestiary';const source=await db.query(`SELECT data FROM ${table} WHERE id=$1 AND campaign_id=$2 AND archived_at IS NULL`,[b.sourceId,req.params.id]);if(!source.rowCount)return await fail(404,'live_source_not_found');data=source.rows[0].data;}
    const stats=b.kind==='npc'?characterDerivedStats(k=>data.attributes?.[k]??0,k=>data.skills?.[k]??0,[]):{pvMax:data.stats.pv,death:0,initiative:data.stats.initiative};
    const max=Math.max(1,stats.pvMax);
    await db.query(`INSERT INTO campaign_live_combatants(id,campaign_id,source_kind,source_id,name,data,hp,pv_max,death,initiative_bonus,visible) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$7,$8,$9,$10)`,[b.requestId,req.params.id,b.kind,sourceId,b.name.trim(),JSON.stringify(data),max,stats.death,stats.initiative,b.visible]);
    payload={label:'Ajout au combat',characterName:b.name.trim(),combatantId:b.requestId};
   }else{
    if(!validId(b.combatantId)||!Number.isSafeInteger(b.version))return await fail(400,'invalid_live_combatant');
    const r=await db.query('SELECT * FROM campaign_live_combatants WHERE id=$1 AND campaign_id=$2 AND NOT removed FOR UPDATE',[b.combatantId,req.params.id]);if(!r.rowCount)return await fail(404,'live_combatant_not_found');const c=r.rows[0];
    if(c.version!==b.version)return await fail(409,'live_version_conflict');
    const shared=await combatState(db,req.params.id),paBefore=c.pa;let turnCost=0;
    if(shared.active&&(b.action==='round'||b.action==='initiative'&&c.initiative!==null))return await fail(400,'campaign_combat_mj_only');
    payload={characterName:c.name,combatantId:c.id};
    if(b.action==='settings'){
     if(typeof b.name!=='string'||!b.name.trim()||b.name.length>120||typeof b.visible!=='boolean'||!Number.isSafeInteger(b.pa)||b.pa<0||b.pa>20)return await fail(400,'invalid_live_combatant');
     c.name=b.name.trim();c.visible=b.visible;c.pa=b.pa;turnCost=Math.max(0,paBefore-c.pa);payload.label='Participant mis à jour';
    }else if(b.action==='damage'||b.action==='heal'){
     if(!Number.isSafeInteger(b.amount)||b.amount<1||b.amount>10000)return await fail(400,'invalid_play_amount');
     payload.before=c.hp;c.hp=Math.max(c.death,Math.min(c.pv_max,c.hp+(b.action==='heal'?b.amount:-b.amount)));payload.after=c.hp;payload.label=b.action==='heal'?'Soin':'Dégâts';
    }else if(b.action==='roll'){
     if(!validRoll(b)||!Number.isSafeInteger(b.paCost)||b.paCost<0||b.paCost>20)return await fail(400,'invalid_live_roll');
     c.data=await repairedCombatantData(c);
     const option=combatantRolls(c,true).find(o=>o.id===b.rollId);if(!option)return await fail(400,'invalid_live_roll');
     if(c.hp<=c.death)return await fail(400,'character_dead');
     if(c.hp<=0&&(option.attack||option.requiresWeapon||option.defense))return await fail(400,'character_agonizing');
     if(b.paCost>0&&c.initiative===null)return await fail(400,'combat_not_started');
     if(c.pa<b.paCost)return await fail(400,'insufficient_pa');
     const stress=Math.max(b.stress,c.hp<=c.pv_max*.25?2:c.hp<=c.pv_max*.5?1:0) as 0|1|2;
     const die=rollD10(stress,()=>randomInt(1,11)),modifier=option.modifier+b.bonus;
     c.pa-=b.paCost;turnCost=option.defense?0:b.paCost;payload={...payload,label:b.label.trim(),modifier,...die,total:modifier+die.sum,stress,paCost:b.paCost,...(option.components?{components:{...option.components,bonus:b.bonus}}:{}),...(option.damage!==undefined?{damage:option.damage,penetration:option.penetration??0,damageType:option.damageType,attackMode:option.attackMode,weaponName:option.weaponName}:{})};publicEvent=c.visible&&b.public;
    }else if(b.action==='initiative'){
     if(c.hp<=c.death)return await fail(400,'character_dead');
     const stress=c.hp<=c.pv_max*.25?2:c.hp<=c.pv_max*.5?1:0;
     const die=rollD10(stress,()=>randomInt(1,11));c.initiative=c.initiative_bonus+die.sum;c.round=shared.active?shared.round:1;
     c.pa_per_round=c.source_kind==='creature'?c.data.stats.actions:die.dice[0]===1?1:c.initiative>=16?3:c.initiative>=11?2:1;c.pa=c.pa_per_round;
     payload={...payload,label:'Initiative',modifier:c.initiative_bonus,...die,total:c.initiative,stress};publicEvent=c.visible;
    }else if(b.action==='round'){
     if(c.initiative===null)return await fail(400,'combat_not_started');c.round++;c.pa=c.pa_per_round;payload.label='Nouveau round';
    }else{c.removed=true;payload.label='Participant retiré';}
    await recordAction(db,req.params.id,c.id,turnCost);
    c.pa=c.hp<=c.death?0:c.hp<=0?Math.min(c.pa,1):c.pa;
    await db.query('UPDATE campaign_live_combatants SET name=$3,hp=$4,initiative=$5,pa=$6,pa_per_round=$7,round=$8,visible=$9,removed=$10,version=version+1 WHERE id=$1 AND campaign_id=$2',[c.id,req.params.id,c.name,c.hp,c.initiative,c.pa,c.pa_per_round,c.round,c.visible,c.removed]);
   }
   await db.query('INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public,image,mime) VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9)',[b.requestId,req.params.id,user.id,b.action,JSON.stringify(payload),JSON.stringify(b),publicEvent,image,mime]);
   await maybeAdvanceCombat(db,req.params.id,user.id);
   await db.query('COMMIT');return {ok:true};
  }catch(e){await db.query('ROLLBACK').catch(()=>{});throw e;}finally{db.release();}
 });
 for(const category of ['messages','combatants'] as const){
  app.get<{Params:{id:string;itemId:string}}>(`/api/campaigns/:id/play/${category}/:itemId/image`,async(req,reply)=>{
   const user=await requireUser(req,reply);if(!user)return;const a=await access(pool,req.params.id,user.id);if(!a||!validId(req.params.itemId))return reply.code(404).send({error:'image_not_found'});
   let pic:{mime:string;buffer:Buffer}|null=null;
   if(category==='messages'){
    const r=await pool.query('SELECT image,mime FROM campaign_live_events WHERE campaign_id=$1 AND id=$2 AND NOT withdrawn AND ($3::boolean OR public)',[req.params.id,req.params.itemId,a.manager]);if(r.rows[0]?.image)pic={mime:r.rows[0].mime,buffer:r.rows[0].image};
   }else{
    const r=await pool.query('SELECT data,source_kind FROM campaign_live_combatants WHERE campaign_id=$1 AND id=$2 AND NOT removed AND ($3::boolean OR visible)',[req.params.id,req.params.itemId,a.manager]);const d=r.rows[0]?await repairedCombatantData(r.rows[0]):null;pic=npcPortrait(d?.portrait||d?.image||'');if(!pic&&typeof d?.sourcePortrait==='string'){
     const upload=/^\/api\/compendium\/uploads\/([a-zA-Z0-9_.-]+\.(?:jpg|png|webp|gif))$/i.exec(d.sourcePortrait);
     const relative=upload?.[1]??d.sourcePortrait.replace(/^\/api\/compendium\/media\//,'');
     if((upload||/^images\/[a-zA-Z0-9_./-]+\.(webp|png|jpg|jpeg|gif)$/i.test(relative))&&!relative.includes('..')){
      const root=upload?(process.env.COMPENDIUM_UPLOAD_DIR??(process.env.NODE_ENV==='production'?'/app/editor-media':resolve(process.cwd(),'../../.editor-media'))):(process.env.COMPENDIUM_MEDIA_DIR??(process.env.NODE_ENV==='production'?'/app/compendium-media':resolve(process.cwd(),'../../compendium')));
      const buffer=await readFile(resolve(root,relative)).catch(()=>null);const ext=relative.split('.').at(-1)?.toLowerCase();if(buffer)pic={buffer,mime:ext==='webp'?'image/webp':ext==='png'?'image/png':ext==='gif'?'image/gif':'image/jpeg'};
     }
    }
   }
   if(!pic)return reply.code(404).send({error:'image_not_found'});return reply.type(pic.mime).header('X-Content-Type-Options','nosniff').send(pic.buffer);
  });
 }
}
