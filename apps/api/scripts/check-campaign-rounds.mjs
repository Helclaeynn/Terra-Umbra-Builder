import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankPlayState} from '../dist/rules/play-state.js';
export async function checkCampaignRounds({pool,call,player,other,manager,campaign,character}){
 const path=`/api/campaigns/${campaign}/play`,cp=`/api/characters/${character}/play`,combat=`/api/campaigns/${campaign}/combat`;
 await pool.query('UPDATE campaign_members SET character_id=NULL WHERE campaign_id=$1 AND user_id=$2',[campaign,other.id]);
 // Isolate lifecycle scenarios from preceding attack and truth fixtures.
 await pool.query('DELETE FROM campaign_live_events WHERE campaign_id=$1',[campaign]);
 await pool.query('UPDATE campaign_live_combatants SET removed=true WHERE campaign_id=$1',[campaign]);
 await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[character,JSON.stringify(blankPlayState())]);
 const visible=randomUUID(),hidden=randomUUID();
 for(const [id,name,show] of [[visible,'Dive test',true],[hidden,'Embuscade',false]])await pool.query(`INSERT INTO campaign_live_combatants(id,campaign_id,source_kind,source_id,name,data,hp,pv_max,death,initiative_bonus,visible) VALUES($1,$2,'creature',$1,$3,$4::jsonb,30,30,0,100,$5)`,[id,campaign,name,JSON.stringify({stats:{actions:3,physicalDefense:1},attacks:[{name:'Frappe',score:5,damage:1}]}),show]);
 let room=await call(manager,'GET',path);
 const start={requestId:randomUUID(),action:'combat-start',version:room.combat.version};
 await call(other,'POST',path+'/actions',start,404);
 await call(manager,'POST',path+'/actions',start);
 assert.equal((await call(manager,'POST',path+'/actions',start)).alreadyApplied,true);
 room=await call(manager,'GET',path);assert.equal(room.combat.active,true);assert.equal(room.combat.round,1);
 const initiative=room.characters[0].initiative,npc=room.combatants.find(c=>c.id===visible);
 assert.equal(npc.pa,3);assert.equal(room.passes.find(p=>p.id===visible).pass,1);
 let pc=await call(player,'GET',cp);
 await call(player,'POST',cp,{requestId:randomUUID(),action:'round',version:pc.version},403);
 const spend={requestId:randomUUID(),action:'spend',actorId:visible};
 await call(other,'POST',combat,spend,404);await call(manager,'POST',combat,spend);
 assert.equal((await call(manager,'POST',combat,spend)).alreadyApplied,true);
 room=await call(manager,'GET',path);assert.equal(room.passes.find(p=>p.id===visible).pass,2);assert.ok(room.order.indexOf(character)<room.order.indexOf(visible));
 const advance={requestId:randomUUID(),action:'combat-round',version:room.combat.version};
 await call(manager,'POST',path+'/actions',advance);await call(manager,'POST',path+'/actions',advance);
 room=await call(manager,'GET',path);assert.equal(room.combat.round,2);assert.equal(room.characters[0].initiative,initiative);assert.equal(room.combatants.find(c=>c.id===visible).initiative,npc.initiative);assert.equal(room.passes.find(p=>p.id===visible).pass,1);
 // Automatic mode; pending attack delays transition even when PA reach zero.
 await call(manager,'POST',path+'/actions',{requestId:randomUUID(),action:'combat-mode',version:room.combat.version,mode:'automatic'});
 pc=await call(player,'GET',cp);await call(player,'POST',cp,{requestId:randomUUID(),action:'save',version:pc.version,state:{...pc.state,pa:0}});
 room=await call(manager,'GET',path);let actor=room.combatants.find(c=>c.id===visible);
 await call(manager,'POST',path+'/actions',{requestId:randomUUID(),action:'settings',combatantId:visible,version:actor.version,name:actor.name,visible:true,pa:1});
 const attack={requestId:randomUUID(),action:'launch',attackerId:visible,targetId:character,optionId:'attack:0',bonus:0,bonusDamage:0,surprise:false};
 await call(manager,'POST',combat,attack);
 room=await call(manager,'GET',path);assert.equal(room.combat.round,2,'wait for pending attack');
 await call(manager,'POST',path+'/actions',{requestId:randomUUID(),action:'combat-round',version:room.combat.version},400);
 await call(manager,'POST',combat,{requestId:randomUUID(),action:'cancel',attackId:attack.requestId});
 room=await call(manager,'GET',path);assert.equal(room.combat.round,3);assert.equal(room.characters[0].initiative,initiative);assert.equal(room.combatants.find(c=>c.id===visible).pa,3);assert.equal(room.combatants.find(c=>c.id===hidden).pa,3,'hidden participant did not block automatic round');
 const peer=await call(other,'GET',path);assert.equal(peer.combat.active,true);assert.ok(!peer.passes.some(p=>p.id===hidden));assert.ok(!peer.order.includes(hidden));for(const c of [...peer.characters,...peer.combatants])assert.equal('pa' in c,false);
 // Active defense spends a future PA without advancing the defender's pass.
 const attack2={...attack,requestId:randomUUID()};await call(manager,'POST',combat,attack2);
 // A natural 1 cannot be actively defended: keep the test independent of RNG.
 await pool.query("UPDATE campaign_live_events SET payload=jsonb_set(payload,'{narrativeFailure}','false') WHERE id=$1",[attack2.requestId]);
 await call(player,'POST',combat,{requestId:randomUUID(),action:'defend',attackId:attack2.requestId,active:true,bonus:0});
 room=await call(manager,'GET',path);const afterDefense=room.passes.find(p=>p.id===character);assert.equal(afterDefense.pass,room.characters[0].pa>0?1:null);
 await call(manager,'POST',combat,{requestId:randomUUID(),action:'cancel',attackId:attack2.requestId});
 room=await call(manager,'GET',path);
 await call(manager,'POST',path+'/actions',{requestId:randomUUID(),action:'combat-stop',version:room.combat.version});
 room=await call(manager,'GET',path);assert.equal(room.combat.active,false);assert.equal(room.characters[0].initiative,null);assert.equal(room.characters[0].pa,0);assert.ok(room.combatants.every(c=>c.initiative===null&&c.pa===0));
 pc=await call(player,'GET',cp);await call(player,'POST',cp,{requestId:randomUUID(),action:'initiative',version:pc.version},403);
 console.log('CAMPAIGN ROUNDS OK — MJ authorization, replay, fixed initiatives, pass order, manual/shared rounds, automatic exhaustion, pending attacks, reactions, hidden actors and stop.');
}
