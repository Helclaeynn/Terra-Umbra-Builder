import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankPlayState} from '../dist/rules/play-state.js';

/** Isolated actors/campaign; canonical purchases and fixed clocks avoid weakening any rule. */
export async function checkRegisteredIntegration({pool,call,player,other,manager,character}){
 const template=(await pool.query('SELECT data FROM characters WHERE id=$1',[character])).rows[0].data;
 const campaign=randomUUID(),id=randomUUID(),data=structuredClone(template);
 data.truth={nature:'extral',consciousness:'initie',choices:{species:'mosen'},truthTalents:['extral-poussee-hormonale','extral-reflexe-de-chasse','extral-osteodermes-renforces','extral-angle-de-cuirasse','extral-carapace-de-combat']};
 data.appearances={reality:[],truth:[]};
 await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'CI registered powers']);
 await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4::jsonb,$5)',[id,player.id,'CI Mosen',JSON.stringify(data),campaign]);
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,player.id,id]);
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'accepted')",[campaign,other.id]);
 await pool.query('INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,1)',[id,JSON.stringify({...blankPlayState(),revelation:'r',initiative:18,pa:3,paPerRound:3})]);
 await pool.query("INSERT INTO campaign_combat_states(campaign_id,active,mode,round,turns,version,participants) VALUES($1,true,'manual',1,'{}'::jsonb,1,'{}'::jsonb)",[campaign]);
 const path=`/api/characters/${id}/play`,roomPath=`/api/campaigns/${campaign}/play`;let live=await call(player,'GET',path);
 const act=async(action,extra={},status=200,user=player)=>{const body={requestId:randomUUID(),version:live.version,action,...extra},response=await call(user,'POST',path,body,status);if(status===200&&!response.alreadyApplied)live=response;return {body,response};};
 const lifecycle=async(action)=>{const room=await call(manager,'GET',roomPath);await call(manager,'POST',roomPath+'/actions',{requestId:randomUUID(),version:room.combat.version,action});live=await call(player,'GET',path);};
 const skill=id=>live.profile.skills.find(s=>s.id===id);
 try{
  assert.equal(live.profile.bodyArmor,2,'canonical passive armor is automatically projected');
  const initialVersion=live.version;
  await act('power-activate',{powerId:'extral-poussee-hormonale',skill:'athletisme',contextConfirmed:true},404,other);
  await act('power-activate',{powerId:'extral-poussee-hormonale',skill:'athletisme',contextConfirmed:false},400);
  await act('power-activate',{powerId:'extral-poussee-hormonale',skill:'commerce',contextConfirmed:true},400);
  await act('power-activate',{powerId:'extral-reflexe-de-chasse',contextConfirmed:true},400);
  await act('power',{powerId:'extral-poussee-hormonale',enabled:true,skill:'athletisme',amount:99,paCost:0,duration:100,note:'forged'},400);
  assert.equal((await call(player,'GET',path)).version,initialVersion,'rejected actions do not consume version/quota/PA');
  await act('save',{state:{...live.state,revelation:'v'}});await act('power-activate',{powerId:'extral-poussee-hormonale',skill:'athletisme',contextConfirmed:true},400);await act('save',{state:{...live.state,revelation:'r'}});
  const baseline=skill('athletisme').total,paBefore=live.state.pa;
  const boost=await act('power-activate',{powerId:'extral-poussee-hormonale',skill:'athletisme',contextConfirmed:true,amount:99,paCost:0,duration:100});
  assert.equal(skill('athletisme').total,baseline+3,'canonical amount replaces forged client amount');assert.equal(live.state.pa,paBefore);assert.equal(live.event.payload.effects[0].amount,3);assert.equal(live.event.payload.duration,'test');assert.equal(live.state.powerUses['scene:extral-poussee-hormonale'],1);
  const boostedVersion=live.version;assert.equal((await call(player,'POST',path,boost.body)).alreadyApplied,true);assert.equal((await call(player,'GET',path)).version,boostedVersion);
  await act('power-activate',{powerId:'extral-poussee-hormonale',skill:'athletisme',contextConfirmed:true},400);
  await act('roll',{skill:'perception'});assert.equal(skill('athletisme').total,baseline+3,'a different skill does not consume the prepared test');
  const roll=await act('roll',{skill:'athletisme'});assert.equal(live.event.payload.modifier,baseline+3);assert.equal(live.event.payload.components.bonus,skill('athletisme').bonus+3);assert.equal(live.state.registeredPowers.length,0);assert.equal(skill('athletisme').total,baseline);
  assert.equal((await call(player,'POST',path,roll.body)).alreadyApplied,true);assert.equal((await call(player,'GET',path)).state.powerUses['scene:extral-poussee-hormonale'],1);
  await act('power-activate',{powerId:'extral-poussee-hormonale',skill:'athletisme',contextConfirmed:true},400);
  await act('save',{state:{...live.state,powerUses:{},registeredPowers:[{id:'extral-poussee-hormonale',skill:'athletisme',until:null,period:'test'}]}});
  assert.equal(live.state.powerUses['scene:extral-poussee-hormonale'],1);assert.equal(live.state.registeredPowers.length,0);assert.equal(skill('athletisme').total,baseline);
  // Paid body armor is a replacement and cannot be made free or copied by saving.
  await act('save',{state:{...live.state,pa:3}});
  const armor=await act('power-activate',{powerId:'extral-carapace-de-combat',paCost:0,amount:99,duration:999});
  assert.equal(live.state.pa,2);assert.equal(live.profile.bodyArmor,3,'2 and 3 body armor never sum');assert.equal(live.event.payload.paCost,1);assert.equal(live.event.payload.effects[0].mode,'replace');assert.equal(live.event.payload.duration,'scene');
  assert.equal((await call(player,'POST',path,armor.body)).alreadyApplied,true);assert.equal((await call(player,'GET',path)).state.pa,2);
  await act('power-activate',{powerId:'extral-carapace-de-combat'},400);
  await call(player,'POST',path,{...armor.body,requestId:randomUUID()},409);
  await act('power-stop',{powerId:'extral-carapace-de-combat'});assert.equal(live.profile.bodyArmor,2);assert.equal(live.state.pa,2,'stopping does not refund its paid activation');
  await act('power-activate',{powerId:'extral-carapace-de-combat'},200,manager);assert.equal(live.state.pa,1);assert.equal(live.profile.bodyArmor,3);
  await lifecycle('combat-stop');assert.equal(live.state.powerUses['scene:extral-poussee-hormonale'],1);assert.equal(live.profile.bodyArmor,3,'scene armor survives combat stop');
  await lifecycle('combat-start');assert.equal(live.state.powerUses['scene:extral-poussee-hormonale'],1);assert.equal(live.profile.bodyArmor,3,'new combat cannot refresh scene quota');await lifecycle('combat-stop');
  await lifecycle('combat-scene');assert.equal(live.state.powerUses['scene:extral-poussee-hormonale'],undefined);assert.equal(live.profile.bodyArmor,2);assert.equal(live.state.registeredPowers.length,0);
  await act('power-activate',{powerId:'extral-poussee-hormonale',skill:'athletisme',contextConfirmed:true});assert.equal(live.state.powerUses['scene:extral-poussee-hormonale'],1);
  const peer=await call(other,'GET',roomPath);assert.equal(peer.characters[0].data,undefined);assert.equal(peer.characters[0].registeredPowers,undefined);const ownerView=await call(player,'GET',path);assert.ok(ownerView.events.some(e=>e.id===boost.body.requestId),'the owner can inspect the activation log');
  // Reserving an unused round power cannot create two uses in the following round.
  data.truth={nature:'garou',consciousness:'initie',choices:{blood:'sang_ecarlate',pelage:'pelages_gris'},truthTalents:['deferlement_ecarlate']};await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[id,JSON.stringify(data)]);
  await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[id,JSON.stringify({...blankPlayState(),revelation:'r',initiative:18,pa:3,paPerRound:3})]);
  await pool.query("UPDATE campaign_combat_states SET active=true,round=1,turns='{}'::jsonb WHERE campaign_id=$1",[campaign]);live=await call(player,'GET',path);
  await act('power-activate',{powerId:'deferlement_ecarlate',skill:'athletisme',contextConfirmed:true});assert.equal(live.state.registeredPowers[0].until,1);
  await lifecycle('combat-round');assert.equal(live.state.round,2);assert.equal(live.state.registeredPowers.length,0);assert.equal(live.state.powerUses['round:deferlement_ecarlate'],undefined);
  await act('power-activate',{powerId:'deferlement_ecarlate',skill:'athletisme',contextConfirmed:true});assert.equal(live.state.registeredPowers[0].until,2);await act('roll',{skill:'athletisme'});assert.equal(live.state.registeredPowers.length,0);await act('power-activate',{powerId:'deferlement_ecarlate',skill:'athletisme',contextConfirmed:true},400);
  // Judgment has a next-test duration and a separate end-of-next-round deadline.
  const judgment='chasseurs_catholiques_ordre_de_magdalena_jugement_jugement';data.truth={nature:'humain',consciousness:'initie',choices:{},truthTalents:[judgment]};await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[id,JSON.stringify(data)]);
  await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[id,JSON.stringify({...blankPlayState(),revelation:'sr',initiative:18,pa:3,paPerRound:3})]);
  await pool.query("UPDATE campaign_combat_states SET active=true,round=1,turns='{}'::jsonb WHERE campaign_id=$1",[campaign]);live=await call(player,'GET',path);const riteBase=skill('maitrise_spirituelle').total;
  await act('power-activate',{powerId:judgment,contextConfirmed:true});assert.equal(live.state.registeredPowers[0].until,2);assert.equal(live.state.pa,2);assert.equal(skill('maitrise_spirituelle').total,riteBase+3);
  await lifecycle('combat-round');assert.equal(live.state.round,2);assert.equal(skill('maitrise_spirituelle').total,riteBase+3);await lifecycle('combat-round');assert.equal(live.state.round,3);assert.equal(live.state.registeredPowers.length,0);assert.equal(skill('maitrise_spirituelle').total,riteBase);assert.equal(live.state.powerUses[`scene:${judgment}`],1);await act('power-activate',{powerId:judgment,contextConfirmed:true},400);
 }finally{await pool.query('DELETE FROM campaigns WHERE id=$1',[campaign]);await pool.query('DELETE FROM characters WHERE id=$1',[id]);}
 console.log('REGISTERED POWERS API OK — canonical access/context/skills, fixed amounts and costs, optimistic conflicts/replay, next-test consumption, protected counters, body armor replacement, MJ authority and scene boundaries.');
}
