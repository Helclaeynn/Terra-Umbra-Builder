import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
export async function checkLiveSessionsEdge({pool,call,player,other,manager,campaign,character}){
 const cp=`/api/characters/${character}/play`,roomPath=`/api/campaigns/${campaign}/play`,sp=roomPath+'/sessions';
 let c=await call(player,'GET',cp),initial=c.edge;assert.ok(initial>=3&&initial<=8);
 const force={requestId:randomUUID(),version:c.version,action:'roll',skill:'athletisme',edge:true};
 c=await call(player,'POST',cp,force);assert.equal(c.event.payload.sum,20);assert.equal(c.event.payload.narrativeFailure,false);assert.deepEqual(c.event.payload.dice,[10,10]);
 await call(player,'POST',cp,force);assert.equal((await call(player,'GET',cp)).edge,initial-1);
 await call(player,'POST',cp,{requestId:randomUUID(),version:c.version,action:'edge-force',eventId:force.requestId},400);
 c=await call(player,'POST',cp,{requestId:randomUUID(),version:c.version,action:'roll',skill:'athletisme'});
 const eventId=c.event.id;const replace={requestId:randomUUID(),version:c.version,action:'edge-force',eventId};
 await call(other,'POST',cp,replace,404);c=await call(player,'POST',cp,replace);assert.equal(c.event.payload.total,c.event.payload.modifier+20);await call(player,'POST',cp,replace);
 assert.equal((await call(player,'GET',cp)).edge,initial-2);
 c=await call(player,'POST',cp,{requestId:randomUUID(),version:c.version,action:'damage',amount:10000});
 let dead=await call(player,'GET',cp);assert.ok(dead.escapeEvent);
 const escape={requestId:randomUUID(),version:dead.version,action:'edge-escape',eventId:dead.escapeEvent};
 c=await call(player,'POST',cp,escape);await call(player,'POST',cp,escape);assert.equal(c.profile.hp,c.profile.derived.death+1);assert.equal(c.profile.health,'Agonisant');assert.equal((await call(player,'GET',cp)).edge,initial-3);
 await call(player,'POST',cp,{...escape,requestId:randomUUID(),version:c.version},400);
 // Reward Edge by itself, no invented XP/cash required. Verify cap and replay.
 const data=(await pool.query('SELECT data FROM characters WHERE id=$1',[character])).rows[0].data;
 await pool.query("UPDATE campaign_members SET admission_status='approved',approved_basis=campaign_character_basis($3::jsonb) WHERE campaign_id=$1 AND character_id=$2",[campaign,character,JSON.stringify(data)]);
 const version=(await pool.query('SELECT version FROM characters WHERE id=$1',[character])).rows[0].version;
 const grant={requestId:randomUUID(),reason:'Accomplissement majeur',rewards:[{characterId:character,version,xp:0,ptv:0,money:0,renownDelta:0,corruptionDelta:0,corruptionSource:'',equipment:[],edge:1}]};
 await call(other,'POST',`/api/campaigns/${campaign}/rewards`,grant,404);await call(manager,'POST',`/api/campaigns/${campaign}/rewards`,grant);await call(manager,'POST',`/api/campaigns/${campaign}/rewards`,grant);
 assert.equal((await call(player,'GET',cp)).edge,initial-2);
 await call(manager,'POST',`/api/campaigns/${campaign}/rewards`,{...grant,requestId:randomUUID(),rewards:[{...grant.rewards[0],version:version+1,edge:8}]},400);
 assert.equal((await call(player,'GET',cp)).edge,initial-2);
 assert.equal((await call(manager,'GET',`/api/campaigns/${campaign}/rewards`)).rewards[0].edge,1);
 // New session archives old logs and full sheets without resetting resources.
 const start={requestId:randomUUID(),action:'start',title:'Séance Edge 1',expectedSession:null};
 await call(other,'POST',sp,start,404);await call(manager,'POST',sp,start);assert.equal((await call(manager,'POST',sp,start)).alreadyApplied,true);
 const first=(await call(manager,'GET',sp)).current.id;
 let room=await call(player,'GET',roomPath);assert.equal(room.session.id,first);assert.ok(room.events.every(e=>!['roll','edge-force'].includes(e.kind)));
 const archive=(await call(manager,'GET',sp)).sessions.find(s=>s.title==='Avant les séances');assert.ok((await call(manager,'GET',roomPath+'?session='+archive.id)).events.some(e=>e.kind==='edge-force'));
 assert.equal((await call(player,'GET',cp)).edge,initial-2);
 const checkpoint={requestId:randomUUID(),action:'checkpoint',title:'Avant récompense',expectedSession:first};await call(manager,'POST',sp,checkpoint);await call(manager,'POST',sp,checkpoint);
 const versions=(await call(manager,'GET',`${sp}/${first}/versions`)).versions;assert.equal(versions.length,2);assert.equal(versions[0].snapshot.characters.find(c=>c.id===character).edge,initial-2);
 const otherVersions=(await call(other,'GET',`${sp}/${first}/versions`)).versions;assert.ok(otherVersions.every(v=>v.snapshot.characters.length===0&&!('combatants' in v.snapshot)));
 const ownVersions=(await call(player,'GET',`${sp}/${first}/versions`)).versions;assert.ok(ownVersions.every(v=>v.snapshot.characters.every(c=>c.ownerId===player.id)));
 const next={requestId:randomUUID(),action:'start',title:'Séance Edge 2',expectedSession:first};await call(manager,'POST',sp,next);
 room=await call(player,'GET',roomPath);assert.notEqual(room.session.id,first);assert.equal(room.events.length,1);assert.equal((await call(player,'GET',cp)).edge,initial-2);
 assert.equal((await call(manager,'GET',`${sp}/${first}/versions`)).versions.length,3);
 // Calendar/session awards support Edge too, independently of live rewards.
 const sessionGift={rewards:[{characterId:character,xp:0,ptv:0,edge:1}]};
 await call(manager,'POST',`/api/campaigns/${campaign}/sessions/${first}/rewards`,sessionGift);
 assert.equal((await call(player,'GET',cp)).edge,initial-1);
 await call(manager,'POST',`/api/campaigns/${campaign}/sessions/${first}/rewards`,sessionGift,409);
 assert.equal((await call(manager,'GET',`/api/campaigns/${campaign}/sessions`)).sessions.find(s=>s.id===first).rewards[0].edge,1);
 // Mixed journal pages at identical timestamps must neither skip nor duplicate events.
 const expected=[];for(let n=0;n<125;n++){const id=randomUUID();expected.push(id);await pool.query(`INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public,created_at) VALUES($1,$2,$3,'message','{"label":"Archive page"}','{}',true,'2030-01-01T00:00:00Z')`,[id,campaign,manager.id]);}
 let page=await call(player,'GET',roomPath),seen=[...page.events.map(e=>e.id)];while(page.nextBefore){page=await call(player,'GET',roomPath+'?before='+encodeURIComponent(page.nextBefore));seen.push(...page.events.map(e=>e.id));}
 assert.equal(new Set(seen).size,seen.length);assert.ok(expected.every(id=>seen.includes(id)));
 // Closed-session rolls cannot be retroactively changed.
 dead=await call(player,'GET',cp);await call(player,'POST',cp,{requestId:randomUUID(),version:dead.version,action:'edge-force',eventId},400);
 // Combat spends Edge in the same transaction as PA and the attack/defense.
 await pool.query("UPDATE character_play_states SET state=state||$2::jsonb WHERE character_id=$1",[character,JSON.stringify({hp:null,pa:3,initiative:18,round:1,paPerRound:3})]);
 const npc=(await pool.query('SELECT id FROM campaign_live_combatants WHERE campaign_id=$1 AND visible AND NOT removed LIMIT 1',[campaign])).rows[0].id;
 await pool.query('UPDATE campaign_live_combatants SET pa=3,initiative=30 WHERE id=$1',[npc]);
 await pool.query("UPDATE campaign_combat_states SET active=true,mode='manual' WHERE campaign_id=$1",[campaign]);
 const combat=`/api/campaigns/${campaign}/combat`,beforeAttack=(await call(player,'GET',cp)).edge;
 const attack={requestId:randomUUID(),action:'launch',attackerId:character,targetId:npc,optionId:'unarmed',bonus:0,bonusDamage:0,surprise:false,edge:true};
 await call(player,'POST',combat,attack);await call(player,'POST',combat,attack);
 let attackEvent=(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[attack.requestId])).rows[0].payload;
 assert.equal(attackEvent.total,20+(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[attackEvent.eventId])).rows[0].payload.modifier);
 assert.equal((await call(player,'GET',cp)).edge,beforeAttack-1);assert.equal((await call(player,'GET',cp)).state.pa,2);
 await call(manager,'POST',combat,{requestId:randomUUID(),action:'cancel',attackId:attack.requestId});
 const second={...attack,requestId:randomUUID(),edge:false};await call(player,'POST',combat,second);
 attackEvent=(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[second.requestId])).rows[0].payload;
 let actor=await call(player,'GET',cp);await call(player,'POST',cp,{requestId:randomUUID(),version:actor.version,action:'edge-force',eventId:attackEvent.eventId});
 assert.equal((await call(manager,'GET',combat)).pending.find(a=>a.id===second.requestId).narrativeFailure,false);
 await call(manager,'POST',combat,{requestId:randomUUID(),action:'cancel',attackId:second.requestId});
 const third={...second,requestId:randomUUID()};await call(player,'POST',combat,third);await call(manager,'POST',combat,{requestId:randomUUID(),action:'cancel',attackId:third.requestId});
 actor=await call(player,'GET',cp);attackEvent=(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[third.requestId])).rows[0].payload;
 await call(player,'POST',cp,{requestId:randomUUID(),version:actor.version,action:'edge-force',eventId:attackEvent.eventId},400);
 await pool.query("UPDATE character_play_states SET state=jsonb_set(state,'{pa}','1') WHERE character_id=$1",[character]);
 const incoming={...third,requestId:randomUUID(),attackerId:npc,targetId:character,optionId:'attack:0'};await call(manager,'POST',combat,incoming);
 await pool.query("UPDATE campaign_live_events SET payload=jsonb_set(payload,'{narrativeFailure}','false') WHERE id=$1",[incoming.requestId]);
 const defend={requestId:randomUUID(),action:'defend',attackId:incoming.requestId,active:true,bonus:0,edge:true};await call(player,'POST',combat,defend);await call(player,'POST',combat,defend);
 const defense=(await call(manager,'GET',combat)).pending.find(a=>a.id===incoming.requestId).defense;
 assert.equal(defense.total,defense.modifier+20);assert.equal(defense.edgeForced,true);assert.equal((await call(player,'GET',cp)).edge,beforeAttack-3);assert.equal((await call(player,'GET',cp)).state.pa,0);
 await call(manager,'POST',combat,{requestId:randomUUID(),action:'cancel',attackId:incoming.requestId});
 // Explicit GM grace revives test deaths without Edge, PA or initiative changes.
 actor=await call(player,'GET',cp);await call(player,'POST',cp,{requestId:randomUUID(),version:actor.version,action:'damage',amount:10000});
 const killed=await call(player,'GET',cp);
 const grace={requestId:randomUUID(),action:'grace',actorId:character,hp:killed.profile.derived.pvMax,beforeHp:killed.profile.hp,reason:'Annulation de mort de test'};
 await call(player,'POST',combat,grace,403);await call(other,'POST',combat,grace,403);
 await call(manager,'POST',combat,{...grace,requestId:randomUUID(),hp:grace.hp+1},400);
 await call(manager,'POST',combat,{...grace,requestId:randomUUID(),beforeHp:grace.beforeHp+1},409);
 await call(manager,'POST',combat,grace);assert.equal((await call(manager,'POST',combat,grace)).alreadyApplied,true);
 const rescued=await call(player,'GET',cp);assert.equal(rescued.profile.hp,grace.hp);assert.equal(rescued.edge,killed.edge);assert.equal(rescued.state.pa,killed.state.pa);assert.equal(rescued.state.initiative,killed.state.initiative);
 const peerLog=(await call(other,'GET',roomPath)).events.find(e=>e.id===grace.requestId);
 // The fixture has future-dated pagination events: fetch the next page if needed.
 let log=peerLog;if(!log){const firstPage=await call(other,'GET',roomPath);log=(await call(other,'GET',roomPath+'?before='+encodeURIComponent(firstPage.nextBefore))).events.find(e=>e.id===grace.requestId);}
 assert.ok(log);assert.equal(log.payload.before,undefined);assert.equal(log.payload.after,undefined);assert.equal(log.payload.text,grace.reason);
 console.log('GM GRACE OK — manager-only revival, explicit HP bounds, stale-state protection, replay, private HP and unchanged Edge/PA/initiative.');
 console.log('LIVE SESSIONS / EDGE OK — forced dice, unique spends, survival, capped MJ rewards, replay, archived logs, immutable snapshots, owner/MJ privacy and persistent Edge.');
}
