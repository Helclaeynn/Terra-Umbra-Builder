import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankCharacterData} from '../dist/character-data.js';
import {blankPlayState} from '../dist/rules/play-state.js';
import {blankNatureResources} from '../dist/rules/live-nature-resources.js';
import {pendingOccultResolution} from '../dist/rules/occult-pending.js';
import {maybeAdvanceCombat} from '../dist/campaign-rounds.js';

export async function checkOccultEdge({pool,call,player,other,manager}){
 const fixtures=[];
 async function release(nature='mage'){
  const campaign=randomUUID(),id=randomUUID(),data=blankCharacterData('Edge occulte');
  Object.assign(data.attributes,{vigueur:8,volonte:5});data.skills.maitrise_spirituelle={style:5,free:0,edge:0};data.creation.sphere='';
  data.truth={nature,consciousness:'initie',choices:nature==='mage'?{mageiusType:'discella',dominantAffinity:'skiamancie'}:{divinity:'mephisto',function:'oracle',daemonBuild:{spectralAffinity:'skiamancie'}},truthTalents:[]};
  await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'Edge occulte']);
  await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4::jsonb,$5)',[id,player.id,'Edge occulte',JSON.stringify(data),campaign]);
  await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,player.id,id]);
  const state={...blankPlayState(),revelation:'r',initiative:20,pa:3,paPerRound:3,natureResources:blankNatureResources()};if(nature==='mage')state.natureResources.mage.tension=2;
  await pool.query('INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,0)',[id,JSON.stringify(state)]);
  await pool.query("INSERT INTO campaign_combat_states(campaign_id,active,mode,round,turns,version,participants) VALUES($1,true,'manual',1,'{}',0,'{}')",[campaign]);
  fixtures.push({campaign,id});const path=`/api/characters/${id}/play`;
  const read=()=>call(player,'GET',path);const act=async(action,extra={},status=200,user=player)=>call(user,'POST',path,{requestId:randomUUID(),version:(await read()).version,action,...extra},status);
  const prefix=nature==='mage'?'nature-mage':'nature-daemon-spectrum';
  await act(prefix+'-begin',{spell:{affinity:'skiamancie',amplitude:'mineure',range:'will',channel:0,opposed:true,urgent:true,contextDifficult:true,forceAmplitude:false,forceMastery:false,intent:'hostile',note:'Ombre hostile'},invest:1});
  const paid=await act(prefix+'-release');assert(Array.isArray(paid.event.payload.dice));
  // A controlled original failure makes after-roll behavior independent of RNG,
  // while retaining the real paid preparation, modifier, Tension and event version.
  const failed={dice:[1],sum:1,total:paid.event.payload.modifier+1,narrativeFailure:true,success:false};
  await pool.query('UPDATE character_play_events SET payload=payload||$2::jsonb WHERE id=$1',[paid.event.id,JSON.stringify(failed)]);
  return {campaign,id,path,read,act,eventId:paid.event.id,payload:paid.event.payload};
 }
 try{
  for(const nature of ['mage','daemon']){
   const f=await release(nature),before=await f.read();assert.equal(await pendingOccultResolution(pool,f.campaign),false);assert.equal(before.events.find(e=>e.id===f.eventId).edgeAvailable,true);assert.equal(before.events.find(e=>e.id===f.eventId).request_payload,undefined);
   const body={requestId:randomUUID(),version:before.version,action:'edge-force',eventId:f.eventId};
   await call(other,'POST',f.path,body,404);const forced=await call(player,'POST',f.path,body);
   assert.equal(forced.event.payload.total,f.payload.modifier+20);assert.equal(forced.event.payload.success,true);assert.equal(forced.event.payload.narrativeFailure,false);assert.deepEqual(forced.event.payload.dice,[10,10]);
   assert.deepEqual(forced.state.natureResources,before.state.natureResources,'Edge cannot erase Tension or a pending Revers');assert.equal(forced.profile.hp,before.profile.hp);assert.equal(forced.state.pa,before.state.pa);
   if(nature==='mage')assert.equal(forced.state.natureResources.mage.pendingBacklash,3);
   const source=(await pool.query('SELECT payload FROM character_play_events WHERE id=$1',[f.eventId])).rows[0].payload;assert.equal(source.originalRoll.success,false);assert.equal(source.tensionAfter,f.payload.tensionAfter);
   assert.equal(await pendingOccultResolution(pool,f.campaign),true,'The newly successful hostile release now holds the current round');
   assert.equal((await call(player,'POST',f.path,body)).alreadyApplied,true);assert.equal((await f.read()).edge,before.edge-1);await f.act('edge-force',{eventId:f.eventId},400);
  }
  // Any following action closes the after-roll window, with no Edge or event mutation.
  let f=await release(),live=await f.read();await f.act('save',{state:live.state});const edge=(await f.read()).edge;assert.equal((await f.read()).events.find(e=>e.id===f.eventId).edgeAvailable,false);await f.act('edge-force',{eventId:f.eventId},400);assert.equal((await f.read()).edge,edge);assert.equal((await pool.query('SELECT payload FROM character_play_events WHERE id=$1',[f.eventId])).rows[0].payload.narrativeFailure,true);
  // A real owner-consent offer freezes its announced source before opposition.
  f=await release();await pool.query("UPDATE character_play_events SET payload=payload||'{\"narrativeFailure\":false,\"success\":true}'::jsonb WHERE id=$1",[f.eventId]);
  await call(manager,'POST',`/api/campaigns/${f.campaign}/occult-resolutions`,{requestId:randomUUID(),action:'request-consent',sourceEventId:f.eventId,note:'Effet proposé sur le lanceur',targets:[{actorId:f.id}]});await f.act('edge-force',{eventId:f.eventId},400);
  // A classified source cannot be brought back to life by Edge.
  f=await release();await pool.query("UPDATE character_play_events SET payload=payload||'{\"narrativeFailure\":false,\"success\":true}'::jsonb WHERE id=$1",[f.eventId]);await call(manager,'POST',`/api/campaigns/${f.campaign}/occult-resolutions`,{requestId:randomUUID(),action:'cancel',sourceEventId:f.eventId,confirmed:true,note:'Conséquence abandonnée à la table'});await f.act('edge-force',{eventId:f.eventId},400);
  // Failed hostile magic at the last PA can already have advanced an automatic
  // round. Forcing afterwards must never reopen the previous round.
  f=await release();await pool.query("UPDATE character_play_states SET state=jsonb_set(state,'{pa}','0'::jsonb) WHERE character_id=$1",[f.id]);await pool.query("UPDATE campaign_combat_states SET mode='automatic' WHERE campaign_id=$1",[f.campaign]);await maybeAdvanceCombat(pool,f.campaign,manager.id);assert.equal((await f.read()).state.round,2);await f.act('edge-force',{eventId:f.eventId},400);
  // No die or an inevitable superior-will catastrophe offers no useful after-roll window.
  for(const patch of [{dice:null,spell:{automatic:true,difficulty:15}},{spell:{automatic:false,forced:true,difficulty:15}}]){f=await release();await pool.query('UPDATE character_play_events SET payload=payload||$2::jsonb WHERE id=$1',[f.eventId,JSON.stringify(patch)]);await f.act('edge-force',{eventId:f.eventId},400);}
  f=await release();live=await f.read();await pool.query('INSERT INTO character_edge_accounts(character_id,balance) VALUES($1,0) ON CONFLICT(character_id) DO UPDATE SET balance=0',[f.id]);await f.act('edge-force',{eventId:f.eventId},400);assert.equal((await f.read()).version,live.version);
  console.log('OCCULT EDGE AFTER OK — paid Mage/Spectre source, fixed modifier, success/margin, unchanged Tension/Revers/HP/PA, replay, owner, consequence/version/automatic-round locks and no spend on rejection');
 }finally{for(const f of fixtures){await pool.query('DELETE FROM campaigns WHERE id=$1',[f.campaign]);await pool.query('DELETE FROM characters WHERE id=$1',[f.id]);}}
}
