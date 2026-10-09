import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankCharacterData} from '../dist/character-data.js';
import {blankPlayState} from '../dist/rules/play-state.js';
export async function checkCampaignMechanics({pool,call,player,other,manager}){
 const campaign=randomUUID(),source=randomUUID(),target=randomUUID();
 const sourceData=blankCharacterData('Source mechanics');sourceData.attributes.vigueur=4;sourceData.skills.constitution={style:4,free:0,edge:0};sourceData.creation.sphere='';sourceData.truth={nature:'extral',consciousness:'initie',choices:{species:'rocreen'},truthTalents:[]};
 const targetData=blankCharacterData('Target mechanics');targetData.attributes.vigueur=4;targetData.skills.constitution={style:4,free:0,edge:0};targetData.creation.sphere='';
 await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'CI mechanics']);
 for(const [id,owner,name,data] of [[source,player.id,'Source mechanics',sourceData],[target,other.id,'Target mechanics',targetData]]){
  await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4::jsonb,$5)',[id,owner,name,JSON.stringify(data),campaign]);
  await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,owner,id]);
  await pool.query('INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,1)',[id,JSON.stringify({...blankPlayState(),hp:12,revelation:id===source?'r':'v',initiative:15,pa:2,paPerRound:2})]);
 }
 await pool.query("INSERT INTO campaign_combat_states(campaign_id,active,mode,round,turns,version,participants) VALUES($1,true,'manual',1,'{}'::jsonb,1,'{}'::jsonb)",[campaign]);
 const endpoint=`/api/campaigns/${campaign}/mechanics`,get=async(id)=>call(id===source?player:other,'GET',`/api/characters/${id}/play`);
 let live=await get(target);const act=async(action,extra={},status=200,user=manager)=>{const body={requestId:randomUUID(),actorId:target,version:live.version,action,...extra};const r=await call(user,'POST',endpoint,body,status);if(status===200)live=await get(target);return {body,r};};
 const proof={owned:true,access:true,hit:true,alteration:true,margin:6,damage:1,bleeds:true,exposed:true,resistanceFailed:true,connected:true};
 try{
  await act('effect-add',{preset:'extral-venin-rocreen',sourceId:source,proof},404,player);
  await act('effect-add',{preset:'extral-venin-rocreen',sourceId:source,proof},400);
  await act('effect-add',{preset:'extral-venin-rocreen',sourceId:source,proof:{...proof,exposed:'false'}},400);
  sourceData.truth.truthTalents=['extral-venin-rocreen'];await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[source,JSON.stringify(sourceData)]);
  const venin=await act('effect-add',{preset:'extral-venin-rocreen',sourceId:source,proof});
  assert.equal((await get(source)).state.pa,1);assert.equal((await get(source)).state.powerUses['scene:extral-venin-rocreen'],1);assert.equal(live.state.effects[0].amount,-3);
  assert.equal((await call(manager,'POST',endpoint,venin.body)).alreadyApplied,true);assert.equal((await get(source)).state.pa,1);
  await act('effect-remove',{effectId:live.state.effects[0].id});await act('effect-add',{preset:'extral-venin-rocreen',sourceId:source,proof},400);
  sourceData.progression={...sourceData.progression,realityTalents:['maitre_des_lames']};await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[source,JSON.stringify(sourceData)]);
  await act('effect-add',{preset:'maitre_des_lames',sourceId:source,proof});const wound=live.state.effects[0];assert.equal(wound.amount,2);assert.equal(wound.armorMode,'ignore');
  const beforeSave=live.state.effects;await call(other,'POST',`/api/characters/${target}/play`,{requestId:randomUUID(),version:live.version,action:'save',state:{...live.state,effects:[],effectArmor:100,activation:999}});live=await get(target);assert.deepEqual(live.state.effects,beforeSave);assert.equal(live.state.effectArmor,0);assert.equal(live.state.activation,0);
  const treated=await act('effect-remove',{effectId:wound.id,treatment:true});assert.equal(live.state.pa,1);assert.equal(live.state.effects.length,0);assert.equal((await call(manager,'POST',endpoint,treated.body)).alreadyApplied,true);assert.equal((await get(target)).state.pa,1);
  await act('effect-armor',{armor:2});
  const custom={name:'SECRET EFFECT NAME',sourceId:source,targetId:target,kind:'damage',scope:'condition',amount:3,stackKey:'ci:periodic',stackMode:'exclusive',duration:{unit:'activation',value:1},period:'activation-start',delay:1,ticks:1,armorMode:'normal',damageType:'physique'};
  const added=await act('effect-add',{effect:custom});assert.equal(live.state.effects.length,1);
  assert.ok(live.events.some(e=>e.id===added.body.requestId&&e.payload.effect.name==='SECRET EFFECT NAME'));
  const peer=await call(player,'GET',`/api/campaigns/${campaign}/play`);assert.equal(JSON.stringify(peer).includes('SECRET EFFECT NAME'),false);assert.equal(peer.events.some(e=>e.id===added.body.requestId),false);
  const tick=await act('activation-start');assert.equal(live.state.hp,11);assert.equal(live.state.effects.length,0);assert.equal(live.state.activation,1);
  assert.equal((await call(manager,'POST',endpoint,tick.body)).alreadyApplied,true);assert.equal((await get(target)).state.hp,11);
  await act('activation-start',{},400);await act('activation-end');assert.equal(live.state.activationOpen,false);
  await call(manager,'POST',endpoint,{...tick.body,requestId:randomUUID(),version:0},409);
  await act('effect-add',{effect:{...custom,unknown:true}},400);await act('effect-add',{effect:{...custom,amount:1e6}},400);
  const n=randomUUID();await pool.query("INSERT INTO campaign_live_combatants(id,campaign_id,source_kind,source_id,name,data,hp,pv_max,death,initiative_bonus,initiative,pa,pa_per_round) VALUES($1,$2,'creature',$1,'NPC effects',$3::jsonb,10,10,0,5,15,2,2)",[n,campaign,JSON.stringify({stats:{actions:2},liveEffects:[]})]);
  let npc=(await pool.query('SELECT version FROM campaign_live_combatants WHERE id=$1',[n])).rows[0];await call(manager,'POST',endpoint,{requestId:randomUUID(),actorId:n,version:npc.version,action:'effect-add',effect:{...custom,targetId:n,armorMode:'ignore'}});npc=(await pool.query('SELECT version FROM campaign_live_combatants WHERE id=$1',[n])).rows[0];
  await call(manager,'POST',endpoint,{requestId:randomUUID(),actorId:n,version:npc.version,action:'activation-start'});const afterNpc=(await pool.query('SELECT hp,data FROM campaign_live_combatants WHERE id=$1',[n])).rows[0];assert.equal(afterNpc.hp,7);assert.deepEqual(afterNpc.data.liveEffects,[]);
  const sourceLive=await get(source);sourceLive.state.pa=0;sourceLive.state.powerUses={};await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[source,JSON.stringify(sourceLive.state)]);
  await act('effect-add',{preset:'extral-venin-rocreen',sourceId:source,proof,sourceActionId:randomUUID()},400);
  const attackId=randomUUID();await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'attack',$4::jsonb,$5::jsonb,false)",[attackId,campaign,manager.id,JSON.stringify({targetId:target}),JSON.stringify({action:'launch',attackerId:source,targetId:target})]);await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'cancel',$4::jsonb,'{}'::jsonb,false)",[randomUUID(),campaign,manager.id,JSON.stringify({attackId})]);
  await act('effect-add',{preset:'extral-venin-rocreen',sourceId:source,proof,sourceActionId:attackId});assert.equal((await get(source)).state.pa,0,'verified attack PA is not paid twice');assert.equal((await get(source)).state.powerUses['scene:extral-venin-rocreen'],1);
 }finally{await pool.query('DELETE FROM campaigns WHERE id=$1',[campaign]);await pool.query('DELETE FROM characters WHERE id=ANY($1::uuid[])',[[source,target]]);}
 console.log('CAMPAIGN MECHANICS OK — manager authority, verified sources, atomic PA/quotas, protected effects/clocks, treatment cost, private owner logs, character/NPC ticks and replay.');
}
