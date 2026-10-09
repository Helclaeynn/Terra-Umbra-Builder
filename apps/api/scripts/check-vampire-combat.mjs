import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {vampireState} from '../dist/rules/live-vampire.js';
/** Combat is already active; all mutations are isolated and restored before returning. */
export async function checkVampireCombat({pool,call,player,other,manager,campaign,character}){
 const play=`/api/characters/${character}/play`,url=`/api/campaigns/${campaign}/combat`;
 const original=(await call(player,'GET',play)).state;
 const originalData=(await pool.query('SELECT data FROM characters WHERE id=$1',[character])).rows[0].data;
 const edge=(await pool.query('SELECT balance FROM character_edge_accounts WHERE character_id=$1',[character])).rows[0]?.balance;
 const campaignEvents=new Set((await pool.query('SELECT id FROM campaign_live_events WHERE campaign_id=$1',[campaign])).rows.map(e=>e.id));
 const playEvents=new Set((await pool.query('SELECT id FROM character_play_events WHERE character_id=$1',[character])).rows.map(e=>e.id));
 const npc=randomUUID();
 const npcData={attributes:{vigueur:2,agilite:17,esprit:2,volonte:2,charisme:2},skills:{},equipmentIds:[]};
 await pool.query("INSERT INTO campaign_live_combatants(id,campaign_id,source_kind,source_id,name,data,hp,pv_max,death,initiative_bonus,initiative,pa,pa_per_round,visible) VALUES($1,$2,'npc',$3,'CI Feeding Target',$4::jsonb,30,30,-10,17,24,3,3,true)",[npc,campaign,randomUUID(),JSON.stringify(npcData)]);
 const send=async(user,body,status=200)=>call(user,'POST',url,{requestId:randomUUID(),...body},status);
 const seed=async(extra={})=>pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[character,JSON.stringify({...original,hp:5,pa:3,unconscious:false,revelation:'r',vampire:{...vampireState(original),stasis:false,fedThisScene:false,exaltedBlood:false},...extra})]);
 const updateNpc=async()=>pool.query('UPDATE campaign_live_combatants SET hp=30,pa=3 WHERE id=$1',[npc]);
 const defAndResolve=async(attackId,armor,extras={})=>{
  await send(manager,{action:'defend',attackId,active:false,bonus:0});
  const body={requestId:randomUUID(),action:'resolve',attackId,protectionIds:[],material:true,armor,extraArmor:0,extraReduction:0,defenseOverride:0,...extras};
  await call(manager,'POST',url,body);
  return {body,payload:(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[body.requestId])).rows[0].payload};
 };
 const gmAttack=async({surprise=false,damageType='melee',damage=50}={})=>{
  const eventId=randomUUID();await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'gm-roll',$4::jsonb,'{}',true)",[eventId,campaign,manager.id,JSON.stringify({characterName:'CI Execution',total:99,narrativeFailure:false})]);
  const attackId=randomUUID();await call(manager,'POST',url,{requestId:attackId,action:'attack',eventId,targetId:character,damage,bonusDamage:0,penetration:0,damageType,attackMode:'melee',surprise});
  return attackId;
 };
 try{
  await pool.query('INSERT INTO character_edge_accounts(character_id,balance) VALUES($1,8) ON CONFLICT(character_id) DO UPDATE SET balance=8',[character]);
  // SR cannot select Prédation; a launched option is entirely controlled by the server.
  await seed({revelation:'sr'});
  assert.equal((await call(player,'GET',url)).attackers.find(a=>a.id===character).options.some(o=>o.id==='vampire-predation'),false);
  await send(player,{action:'launch',attackerId:character,targetId:npc,optionId:'vampire-predation',bonus:0,bonusDamage:0,surprise:false,edge:true},400);
  await seed();assert.equal((await call(player,'GET',url)).attackers.find(a=>a.id===character).options.some(o=>o.id==='vampire-predation'),true);
  const cases=[{armor:9,loss:1,recovered:1},{armor:100,loss:0,recovered:0},{armor:0,loss:10,recovered:5},{armor:0,loss:10,recovered:1,hp:15},{armor:0,loss:10,recovered:1,hp:12,anchor:true}];
  for(const entry of cases){
   await seed({hp:entry.hp??5,vampire:{...vampireState(original),stasis:false,fedThisScene:false,exaltedBlood:false,anchor:entry.anchor===true}});await updateNpc();
   const launch={requestId:randomUUID(),action:'launch',attackerId:character,targetId:npc,optionId:'vampire-predation',bonus:0,bonusDamage:0,surprise:false,edge:true};
   await call(player,'POST',url,launch);assert.equal((await call(player,'POST',url,launch)).alreadyApplied,true);
   const attack=(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[launch.requestId])).rows[0].payload;
   assert.equal(attack.predation,true);assert.equal(attack.attackerId,character);assert.equal(attack.damage,1);assert.equal(attack.narrativeFailure,false);assert.equal(attack.total,26);
   assert.equal((await call(player,'GET',play)).state.pa,2);
   const resolved=await defAndResolve(launch.requestId,entry.armor);assert.equal(resolved.payload.before-resolved.payload.after,entry.loss);assert.equal(resolved.payload.predation,true);
   const live=await call(player,'GET',play),heal=live.events.find(e=>e.kind==='vampire-predation-heal');
   assert.ok(heal);assert.equal(heal.payload.dr,3);assert.equal(heal.payload.actualLoss,entry.loss);assert.equal(heal.payload.recovered,entry.recovered);assert.equal(live.profile.hp,(entry.hp??5)+entry.recovered);
   assert.equal(live.state.vampire.fedThisScene,entry.loss>0);
   assert.equal((await call(manager,'POST',url,resolved.body)).alreadyApplied,true);assert.equal((await call(player,'GET',play)).profile.hp,live.profile.hp);
   const peer=await call(other,'GET',`/api/campaigns/${campaign}/play`);const log=peer.events.find(e=>e.id===resolved.body.requestId);assert.ok(log);assert.equal(log.payload.before,undefined);assert.equal(log.payload.after,undefined);assert.equal(log.payload.recovered,undefined);
  }
  // A real failed attack gives no healing, even when the numerical total beats Defense.
  await seed();await updateNpc();
  const failed=randomUUID(),roll=randomUUID();
  await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'roll',$4::jsonb,'{}',true)",[roll,campaign,player.id,JSON.stringify({characterId:character,total:26,dice:[1],sum:1,modifier:25,narrativeFailure:true})]);
  await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'attack',$4::jsonb,'{}',false)",[failed,campaign,player.id,JSON.stringify({eventId:roll,attackerId:character,targetId:npc,total:26,narrativeFailure:true,damage:1,bonusDamage:0,penetration:0,damageType:'melee',attackMode:'melee',surprise:false,predation:true,public:true})]);
  await defAndResolve(failed,0);assert.equal((await call(player,'GET',play)).profile.hp,5);
  // Krovni's +3 applies to passive and active physical Defense, without doubling the equivalent mist bonus.
  const krovni=structuredClone(originalData);krovni.truth.choices.court='krovni_rytsari';
  await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[character,JSON.stringify(krovni)]);
  for(const entry of [{active:false,bonus:3},{active:true,bonus:3},{active:true,bonus:3,defensePowerId:'corps_de_brume'},{active:false,bonus:0,surprise:true},{active:false,bonus:0,damageType:'occulte'},{active:false,bonus:0,damageType:'neuro'}]){
   await seed({hp:16});const profile=(await call(player,'GET',play)).profile,attackId=await gmAttack({...entry,damage:1}),requestId=randomUUID();
   await call(manager,'POST',url,{requestId,action:'defend',attackId,active:entry.active,bonus:0,...(entry.defensePowerId?{defensePowerId:entry.defensePowerId,contextConfirmed:true}: {})});
   const defense=(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[requestId])).rows[0].payload;
   const base=entry.damageType==='occulte'?profile.derived.occultDefense:entry.damageType==='neuro'?profile.neuroDefense:entry.active?profile.skills.find(s=>s.id==='esquive').total:profile.derived.passiveDefense;
   assert.equal(defense.modifier,base+entry.bonus);assert.equal(defense.components.specialBonus,entry.bonus);
  }
  await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[character,JSON.stringify(originalData)]);
  // Committed combat damage invokes Last Sleep exactly once, and an annihilating wound bypasses it.
  const lethalAttack=async(bodySurvivable=true)=>defAndResolve(await gmAttack(),0,{bodySurvivable});
  await seed({powerUses:{...original.powerUses,'scenario:dernier_sommeil':0}});let saved=await lethalAttack();let live=await call(player,'GET',play);
  assert.equal(saved.payload.lastSleep,true);assert.equal(live.profile.hp,live.profile.derived.death+1);assert.equal(live.state.vampire.stasis,true);assert.equal(live.state.pa,0);assert.equal(live.state.powerUses['scenario:dernier_sommeil'],1);
  saved=await lethalAttack();live=await call(player,'GET',play);assert.equal(saved.payload.lastSleep,false);assert.equal(saved.payload.defense,0);assert.equal(live.profile.health,'Mort');
  await seed({powerUses:{...original.powerUses,'scenario:dernier_sommeil':0}});saved=await lethalAttack(false);live=await call(player,'GET',play);assert.equal(saved.payload.lastSleep,false);assert.equal(live.profile.health,'Mort');assert.equal(live.state.powerUses['scenario:dernier_sommeil'],0);
 }finally{
  const newCampaign=(await pool.query('SELECT id FROM campaign_live_events WHERE campaign_id=$1',[campaign])).rows.map(e=>e.id).filter(id=>!campaignEvents.has(id));
  const newPlay=(await pool.query('SELECT id FROM character_play_events WHERE character_id=$1',[character])).rows.map(e=>e.id).filter(id=>!playEvents.has(id));
  if(newCampaign.length){await pool.query('DELETE FROM character_edge_uses WHERE character_id=$1 AND reference_id=ANY($2::uuid[])',[character,newCampaign]);await pool.query('DELETE FROM campaign_live_events WHERE id=ANY($1::uuid[])',[newCampaign]);}
  if(newPlay.length)await pool.query('DELETE FROM character_play_events WHERE id=ANY($1::uuid[])',[newPlay]);
  await pool.query('DELETE FROM campaign_live_combatants WHERE id=$1',[npc]);
  await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[character,JSON.stringify(originalData)]);
  await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[character,JSON.stringify(original)]);
  if(edge===undefined)await pool.query('DELETE FROM character_edge_accounts WHERE character_id=$1',[character]);else await pool.query('UPDATE character_edge_accounts SET balance=$2 WHERE character_id=$1',[character,edge]);
 }
 console.log('VAMPIRE COMBAT API OK — R-only option, initiative PA cost, DR3 at margin9, post-protection loss-bounded feeding, single anchor ceiling, failed attack, replay, private healing, Krovni defenses and lethal reactions.');
}
