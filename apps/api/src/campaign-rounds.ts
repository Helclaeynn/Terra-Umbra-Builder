import {advanceAdrenaline,limitAdrenalinePa,finishAdrenaline} from './rules/live-reality.js';
import {nextVampireRound,resetVampirePeriod,vampirePowerRules} from './rules/live-vampire.js';
import {resetNaturePeriod,normalizedNatureResources} from './rules/live-nature-resources.js';
import {finishEffectsScene,rebaseLiveEffects} from './rules/live-effects.js';
import {applyCharacterEffectTick,applyNpcEffectTick} from './live-effect-application.js';
import {resetLivePeriod} from './rules/live-mechanics.js';
import {randomUUID} from 'node:crypto';
import {blankPlayState,playProfile,type PlayState} from './rules/play-state.js';
import {liveBody} from './rules/play-truth.js';

type Db={query:(...args:any[])=>Promise<any>};
export const emptyCombat=()=>({active:false,mode:'manual',round:1,turns:{} as Record<string,number>,participants:{} as Record<string,{participating:boolean;side:string}>,version:0});
// All live mutations acquire this lock BEFORE any participant lock.
export async function lockCombat(db:Db,id:string|null){if(id)await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',['campaign-combat:'+id]);}
export async function combatState(db:Db,id:string|null){if(!id)return emptyCombat();return (await db.query('SELECT active,mode,round,turns,participants,version FROM campaign_combat_states WHERE campaign_id=$1',[id])).rows[0]??emptyCombat();}
async function writeCombat(db:Db,id:string,s:any){await db.query(`INSERT INTO campaign_combat_states(campaign_id,active,mode,round,turns,version,participants) VALUES($1,$2,$3,$4,$5::jsonb,$6,$7::jsonb) ON CONFLICT(campaign_id) DO UPDATE SET active=EXCLUDED.active,mode=EXCLUDED.mode,round=EXCLUDED.round,turns=EXCLUDED.turns,version=EXCLUDED.version,participants=EXCLUDED.participants`,[id,s.active,s.mode,s.round,JSON.stringify(s.turns),s.version+1,JSON.stringify(s.participants)]);}
export const participates=(s:any,id:string)=>s.participants?.[id]?.participating!==false;
export const participantInfo=(s:any,c:any)=>({participating:participates(s,c.id),side:s.participants?.[c.id]?.side??(c.kind==='character'?'ally':'neutral')});
export async function combatActors(db:Db,id:string){
 const pcs=await db.query(`SELECT c.id,c.name,c.owner_id,c.data,s.state FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' LEFT JOIN character_play_states s ON s.character_id=c.id WHERE c.campaign_id=$1 AND c.archived_at IS NULL ORDER BY c.id`,[id]);
 const actors=pcs.rows.map((c:any)=>{const state={...blankPlayState(),...c.state},p=playProfile(c.data,state);return {...c,state,kind:'character',visible:state.share,pa:p.pa,initiative:state.initiative,hp:p.hp,death:p.derived.death,profile:p};});
 const npcs=await db.query('SELECT * FROM campaign_live_combatants WHERE campaign_id=$1 AND NOT removed ORDER BY id',[id]);
 return [...actors,...npcs.rows.map((c:any)=>({...c,kind:c.source_kind}))];
}
export async function pendingAttacks(db:Db,id:string){return !!(await db.query(`SELECT id FROM campaign_live_events e WHERE campaign_id=$1 AND kind='attack' AND NOT EXISTS(SELECT 1 FROM campaign_live_events done WHERE done.campaign_id=$1 AND done.kind IN ('resolve','cancel') AND done.payload->>'attackId'=e.id::text) LIMIT 1`,[id])).rowCount;}
export function advanceCharacterRound(data:any,state:PlayState){
 const ended=applyCharacterEffectTick(data,state,{phase:'round-end',round:state.round});state.round++;
 Object.assign(state,nextVampireRound(state));advanceAdrenaline(state);
 const started=applyCharacterEffectTick(data,state,{phase:'round-start',round:state.round});
 state.powerUses=Object.fromEntries(Object.entries(state.powerUses??{}).filter(([k])=>!k.startsWith('round:')));
 state.registeredPowers=(state.registeredPowers??[]).filter(p=>p.until===null||p.until>=state.round);
 state.powers=(state.powers??[]).filter(p=>p.until===null||p.until>=state.round);
 const wounded=playProfile(data,state);if(wounded.hp<=wounded.derived.death||state.unconscious)state.muePending=null;
 if(state.muePending&&state.round>=state.muePending){state.form='hybrid';state.revelation='r';state.muePending=null;state.formPaRound=state.round+1;const after=playProfile(data,state);state.hp=wounded.hp+after.derived.pvMax-wounded.derived.pvMax;}
 state.pa=state.initiative===null?0:state.paPerRound+((state.formPaRound??0)<=state.round?(liveBody(data,state)?.pace??0):0);
 state.pa=limitAdrenalinePa(state,state.pa);
 state.pa=playProfile(data,state).pa;
 const maintenance:any[]=[];state.powers=(state.powers??[]).filter(p=>{const cost=data.truth?.nature==='vampire'?vampirePowerRules[p.id]?.maintenance??0:0;if(!cost)return true;const paid=state.pa>=cost&&!state.unconscious&&playProfile(data,state).hp>0;if(paid)state.pa-=cost;maintenance.push({powerId:p.id,cost:paid?cost:0,ended:!paid});return paid;});
 return {maintenance,applications:[...ended.applications,...started.applications],expired:[...ended.expired,...started.expired]};
}
async function saveActor(db:Db,c:any){
 if(c.kind==='character')await db.query(`INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,1) ON CONFLICT(character_id) DO UPDATE SET state=EXCLUDED.state,version=character_play_states.version+1,updated_at=now()`,[c.id,JSON.stringify(c.state)]);
 else await db.query('UPDATE campaign_live_combatants SET initiative=$2,pa=$3,pa_per_round=$4,round=$5,data=$6::jsonb,hp=$7,version=version+1 WHERE id=$1',[c.id,c.initiative,c.pa,c.pa_per_round,c.round,JSON.stringify(c.data),c.hp]);
}
async function log(db:Db,id:string,user:string,kind:string,payload:any,visible=true){await db.query(`INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,$4,$5::jsonb,'{}'::jsonb,$6)`,[randomUUID(),id,user,kind,JSON.stringify(payload),visible]);}
export async function nextCombatRound(db:Db,id:string,user:string,s:any,actors:any[],automatic=false){
 s.round++;s.turns={};
 for(const c of actors){if(c.initiative===null||!participates(s,c.id))continue;
  if(c.kind==='character'){c.state.round=s.round-1;const ticks=advanceCharacterRound(c.data,c.state);if(ticks.applications.length||ticks.expired.length||ticks.maintenance.length){await db.query('INSERT INTO character_play_events(id,character_id,campaign_id,created_by,kind,payload,request_payload) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb)',[randomUUID(),c.id,id,user,'effect-tick',JSON.stringify({label:'Effets · changement de round',...ticks}),'{}']);}}
  else{const ended=applyNpcEffectTick(c,{phase:'round-end',round:c.round});c.round=s.round;const started=applyNpcEffectTick(c,{phase:'round-start',round:c.round});if(ended.applications.length||started.applications.length||ended.expired.length||started.expired.length)await log(db,id,user,'effect-tick',{label:'Effets · '+c.name,targetId:c.id,applications:[...ended.applications,...started.applications],expired:[...ended.expired,...started.expired]},false);c.pa=c.hp<=c.death?0:c.hp<=0?Math.min(c.pa_per_round,1):c.pa_per_round;}
  await saveActor(db,c);
 }
 await writeCombat(db,id,s);
 if(automatic)await log(db,id,user,'combat-round',{label:`Round ${s.round} · automatique`,round:s.round});
}
export async function manageCombat(db:Db,id:string,user:string,b:any){
 const s=await combatState(db,id);
 if(b.version!==s.version)return 'combat_version_conflict';
 if(['combat-scene','combat-scenario'].includes(b.action)){
  if(s.active||await pendingAttacks(db,id))return 'finish_combat_first';
  for(const actor of await combatActors(db,id))if(actor.kind==='character'){resetLivePeriod(actor.state,b.action==='combat-scene'?'scene':'scenario');Object.assign(actor.state,resetVampirePeriod(actor.state));resetNaturePeriod(actor.state,b.action==='combat-scene'?'scene':'scenario');actor.state.effects=finishEffectsScene(actor.state.effects??[]);actor.state.registeredPowers=(actor.state.registeredPowers??[]).filter((p:any)=>b.action==='combat-scene'&&p.period==='scenario');await saveActor(db,actor);}
  for(const actor of await combatActors(db,id))if(actor.kind!=='character'){actor.data.liveEffects=finishEffectsScene(actor.data.liveEffects??[]);await saveActor(db,actor);}
  await writeCombat(db,id,s);return null;
 }
 if(b.action==='combat-participant'){
  const actor=(await combatActors(db,id)).find(c=>c.id===b.actorId);
  if(!actor)return 'participant_not_found';
  if(typeof b.participating!=='boolean'||!['ally','enemy','neutral'].includes(b.side))return 'invalid_participant';
  if(s.active&&participates(s,actor.id)!==b.participating&&await pendingAttacks(db,id))return 'pending_attacks';
  s.participants[actor.id]={participating:b.participating,side:b.side};
  await writeCombat(db,id,s);return null;
 }
 if(b.action==='combat-mode'){
  if(!['manual','automatic'].includes(b.mode))return 'invalid_combat_mode';s.mode=b.mode;await writeCombat(db,id,s);return null;
 }
 if(b.action==='combat-start'&&s.active)return 'combat_already_started';
 if(b.action!=='combat-start'&&!s.active)return 'combat_not_started';
 if(await pendingAttacks(db,id))return 'pending_attacks';
 const actors=await combatActors(db,id);
 if(b.action==='combat-round'){if(actors.some(c=>c.visible&&participates(s,c.id)&&c.hp>c.death&&c.initiative===null))return 'initiatives_pending';await nextCombatRound(db,id,user,s,actors);return null;}
 s.active=b.action==='combat-start';s.round=1;s.turns={};
 for(const c of actors){
  if(s.active){
   if(c.kind==='character'){
    const resources=normalizedNatureResources(c.state.natureResources);resources.mage.usedRound=null;resources.mage.blockedUntilRound=null;resources.mage.preparation=null;resources.powerPreparation=null;c.state.natureResources=resources;
    c.state.effects=rebaseLiveEffects(c.state.effects??[],{round:c.state.round,targetActivation:c.state.activation??0},{round:1,targetActivation:c.state.activation??0});c.state.registeredPowers=(c.state.registeredPowers??[]).filter((p:any)=>['scene','scenario'].includes(p.period));
    Object.assign(c.state,{initiative:null,round:1,paPerRound:0,pa:0,formPaRound:0});
    if(c.state.muePending)c.state.muePending=2;
   }else{c.data.liveEffects=rebaseLiveEffects(c.data.liveEffects??[],{round:c.round,targetActivation:c.data.activation??0},{round:1,targetActivation:c.data.activation??0});Object.assign(c,{initiative:null,round:1,pa_per_round:0,pa:0});}
  }else if(c.kind==='character'){
   const resources=normalizedNatureResources(c.state.natureResources);resources.mage.preparation=null;resources.mage.maintained=[];resources.mage.blockedUntilRound=null;resources.powerPreparation=null;c.state.natureResources=resources;if(c.state.vampire)c.state.vampire.cycleUntilRound=null;
   finishAdrenaline(c.state);Object.assign(c.state,{initiative:null,pa:0,paPerRound:0,powers:[],activationOpen:false});c.state.registeredPowers=(c.state.registeredPowers??[]).filter((p:any)=>['scene','scenario'].includes(p.period));
   c.state.powerUses=Object.fromEntries(Object.entries(c.state.powerUses??{}).filter(([k])=>!k.startsWith('round:')));
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
 const actors=await combatActors(db,id),visible=actors.filter(c=>c.visible&&participates(s,c.id)&&c.hp>c.death);
 if(!visible.length||visible.some(c=>c.initiative===null||c.pa>0)||await pendingAttacks(db,id))return;
 await nextCombatRound(db,id,user,s,actors,true);
}
export function combatQueue(actors:any[],s:any){
 return actors.map(c=>({id:c.id,initiative:c.initiative,pass:s.active&&participates(s,c.id)&&c.initiative!==null&&c.pa>0?(s.turns[c.id]??0)+1:null}))
 .sort((a,b)=>(s.active?(a.pass??Infinity)-(b.pass??Infinity):0)||(b.initiative??-Infinity)-(a.initiative??-Infinity)||a.id.localeCompare(b.id));
}
