import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankPlayState} from '../dist/rules/play-state.js';
import {blankCharacterData} from '../dist/character-data.js';

export async function checkRemainingActionsIntegration({pool,call,player,other,manager}){
 const campaign=randomUUID(),id=randomUUID(),npc=randomUUID(),path=`/api/characters/${id}/play`,room=`/api/campaigns/${campaign}/play`,combat=`/api/campaigns/${campaign}/combat`;
 const make=(nature,talents,choices={})=>{const d=blankCharacterData('CI guarded actions');d.attributes={vigueur:10,agilite:4,esprit:4,volonte:10,charisme:3};d.skills.constitution={style:20,free:0,edge:0};d.skills.maitrise_spirituelle={style:30,free:0,edge:0};d.truth={nature,consciousness:'initie',truthTalents:talents,choices};return d;};
 const seed=async(d,state={})=>{await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[id,JSON.stringify(d)]);await pool.query('UPDATE character_play_states SET state=$2::jsonb,version=version+1 WHERE character_id=$1',[id,JSON.stringify({...blankPlayState(),revelation:'r',initiative:20,pa:3,paPerRound:3,...state})]);await pool.query("UPDATE campaign_combat_states SET active=true,round=1,turns='{}'::jsonb WHERE campaign_id=$1",[campaign]);await pool.query('UPDATE campaign_live_combatants SET initiative=20,pa=3,pa_per_round=3,round=1 WHERE id=$1',[npc]);return call(player,'GET',path);};
 let live;
 const act=async(action,extra={},status=200,user=player)=>{const body={requestId:randomUUID(),version:live.version,action,...extra},r=await call(user,'POST',path,body,status);if(status===200&&!r.alreadyApplied)live=r;return {body,response:r};};
 const spend=async(extra={},status=200)=>{const b={requestId:randomUUID(),action:'spend',actorId:id,...extra},r=await call(player,'POST',combat,b,status);live=await call(player,'GET',path);return {body:b,response:r};};
 const lifecycle=async(action)=>{const roomView=await call(manager,'GET',room);await call(manager,'POST',room+'/actions',{requestId:randomUUID(),version:roomView.combat.version,action});live=await call(player,'GET',path);};
 const phase=async(action)=>{await call(manager,'POST',`/api/campaigns/${campaign}/mechanics`,{requestId:randomUUID(),actorId:id,version:live.version,action});live=await call(player,'GET',path);};
 const mosen=make('extral',['extral-poussee-hormonale','extral-reflexe-de-chasse','extral-surpuissance','extral-crete-de-mosenine'],{species:'mosen'});
 await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'CI guarded remaining actions']);
 await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4::jsonb,$5)',[id,player.id,'CI guarded actions',JSON.stringify(mosen),campaign]);
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,player.id,id]);await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'accepted')",[campaign,other.id]);
 await pool.query('INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,1)',[id,JSON.stringify(blankPlayState())]);
 await pool.query("INSERT INTO campaign_combat_states(campaign_id,active,mode,round,turns,version,participants) VALUES($1,true,'manual',1,'{}'::jsonb,1,'{}'::jsonb)",[campaign]);
 await pool.query("INSERT INTO campaign_live_combatants(id,campaign_id,source_kind,source_id,name,data,hp,pv_max,death,initiative_bonus,initiative,pa,pa_per_round,visible) VALUES($1,$2,'npc',$3,'Guarded target',$4::jsonb,30,30,-10,7,20,3,3,true)",[npc,campaign,randomUUID(),JSON.stringify({attributes:{vigueur:5,agilite:3,volonte:3,esprit:3,charisme:3},skills:{},equipmentIds:[]})]);
 try{
  live=await seed(mosen);const crest={powerId:'extral-crete-de-mosenine',contextConfirmed:true};
  await act('restricted-power-activate',crest,404,other);await act('power-activate',crest,400);await act('restricted-power-activate',{...crest,contextConfirmed:false},400);
  await call(manager,'POST',combat,{requestId:randomUUID(),action:'spend',actorId:npc,physical:false});await act('restricted-power-activate',crest,400);live=await seed(mosen);
  const granted=await act('restricted-power-activate',{...crest,amount:100,paCost:0});assert.equal(live.state.pa,4);assert.equal(live.state.initiative,20);assert.equal(live.profile.actionRestrictions.reservedPhysicalPA,1);
  assert.equal((await call(player,'POST',path,granted.body)).alreadyApplied,true);assert.equal((await call(player,'GET',path)).state.pa,4);
  for(let n=0;n<3;n++)await spend({physical:false});assert.equal(live.state.pa,1);await spend({physical:false},400);assert.equal(live.state.pa,1);
  await spend({physical:true,actionKind:'physical-effort'});assert.equal(live.state.pa,0);assert.equal(live.profile.actionRestrictions.reservedPhysicalPA,0);
  await lifecycle('combat-round');assert.equal(live.state.initiative,20);assert.equal(live.state.pa,3);assert.equal(live.profile.actionRestrictions.reservedPhysicalPA,0);await act('restricted-power-activate',crest,400);
  await lifecycle('combat-stop');await lifecycle('combat-scene');await lifecycle('combat-start');live=await seed(mosen);await spend({physical:false});await act('restricted-power-activate',crest,400);

  const shade=make('exile',['exile-empreinte-d-onyx','exile-chair-intermittente','exile-pas-d-onyx','exile-entre-deux-etats'],{people:'elye',network:'hibou_onyx'});live=await seed(shade);
  const beforeDodge=live.profile.skills.find(s=>s.id==='esquive').total;
  await act('restricted-power-activate',{powerId:'exile-entre-deux-etats',contextConfirmed:true});assert.equal(live.state.pa,2);assert.equal(live.profile.skills.find(s=>s.id==='esquive').total,beforeDodge,'no general dodge increase');
  const forbidden=await call(player,'POST',combat,{requestId:randomUUID(),action:'launch',attackerId:id,targetId:npc,optionId:'unarmed',bonus:0,bonusDamage:0,surprise:false,public:true},400);assert.equal(forbidden.error,'between_states_action_forbidden');await spend({physical:true,actionKind:'melee'},400);assert.equal(live.state.pa,2);
  await act('power-stop',{powerId:'exile-entre-deux-etats'},400);await act('restricted-power-stop',{powerId:'exile-entre-deux-etats',safeExitConfirmed:true},400);
  await phase('activation-start');await spend({physical:false});await act('restricted-power-stop',{powerId:'exile-entre-deux-etats',safeExitConfirmed:true},400);
  await phase('activation-end');await phase('activation-start');await act('restricted-power-stop',{powerId:'exile-entre-deux-etats',safeExitConfirmed:false},400);
  await act('restricted-power-stop',{powerId:'exile-entre-deux-etats',safeExitConfirmed:true});assert.equal(live.state.pa,1);assert.equal(live.profile.actionRestrictions.betweenStates,false);await act('restricted-power-activate',{powerId:'exile-entre-deux-etats',contextConfirmed:true},400);

  const asulf=make('garou',['fureur_croissante'],{blood:'sang_enrage',pelage:'pelages_gris'}),context={sourceId:'CI explicit cause',cause:'Proche menacé',impulse:'Protéger le proche',contextConfirmed:true};live=await seed(asulf);
  await act('fear-set',{...context,level:2},400);await act('fear-set',{...context,level:2},200,manager);assert.equal(live.profile.stress,2);
  const entry=await act('frenzy-enter',{...context,powerId:'fureur_croissante'});assert.equal(live.state.pa,2);assert.equal(live.profile.stress,0);assert.equal(live.profile.frenzy.physicalBonus,1);
  assert.equal((await call(player,'POST',path,entry.body)).alreadyApplied,true);assert.equal((await call(player,'GET',path)).state.pa,2);
  const calmBase=live.profile.skills.find(s=>s.id==='savoirs').total;await act('roll',{skill:'savoirs',requiresCalm:true});assert.equal(live.event.payload.modifier,calmBase-3);assert.equal(live.event.payload.modifier,live.event.payload.components.attribute+live.event.payload.components.rank+live.event.payload.components.bonus,'the detailed roll includes its concentration penalty');
  await act('save',{state:{...live.state,frenzy:null,fear:null}});assert.ok(live.state.frenzy);assert.equal(live.state.fear.level,2,'settings cannot remove source-tracked control states');
  await spend({physical:false});await spend({physical:false},400);assert.equal(live.state.pa,1);await spend({physical:true,pursuesImpulse:true,contextConfirmed:true});assert.equal(live.state.pa,0);assert.equal(live.profile.frenzy.impulseRequired,false);
  await lifecycle('combat-round');assert.equal(live.profile.frenzy.physicalBonus,2);assert.equal(live.profile.frenzy.impulseRequired,true);
  const exit=await act('frenzy-exit',{causeGone:true,contextConfirmed:true});assert.equal(exit.response.event.payload.difficulty,12);assert.equal(exit.response.event.payload.modifier,exit.response.event.payload.components.attribute+exit.response.event.payload.components.rank+exit.response.event.payload.components.bonus);assert.equal(!!live.state.frenzy,!exit.response.event.payload.success);if(exit.response.event.payload.success)assert.equal(live.profile.stress,2);

  const furie=make('garou',['furie_de_survie'],{blood:'sang_naturel',pelage:'pelages_gris'});live=await seed(furie);const maximum=live.profile.healthMaximum,amount=Math.floor(maximum/2)+1,baseline=live.profile.skills.find(s=>s.id==='athletisme').total;
  await act('damage',{amount});assert.equal(live.state.powerUses['scene:furie_de_survie:50'],1);assert.equal(live.profile.skills.find(s=>s.id==='athletisme').total,baseline+3);
  await act('roll',{skill:'athletisme'});assert.equal(live.event.payload.modifier,baseline+3);assert.equal(live.state.survivalFury,null);await act('heal',{amount});await act('damage',{amount});assert.equal(live.state.survivalFury,null,'healing does not refresh the crossed threshold');
  const peer=await call(other,'GET',room);const pc=peer.characters.find(c=>c.id===id);for(const key of ['frenzy','fear','survivalFury','actionRestrictions','powerUses','hp'])assert.equal(pc[key],undefined);
 }finally{await pool.query('DELETE FROM campaigns WHERE id=$1',[campaign]);await pool.query('DELETE FROM characters WHERE id=$1',[id]);}
 console.log('REMAINING ACTIONS API OK — guarded ownership, reserved PA and windows, physical-only semi-immaterial defense, no generic stop bypass, source-tracked frenzy/fear, paid impulse, fixed initiative, real injury thresholds, exact replay and private peer projection.');
}
