import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankPlayState,playProfile} from '../dist/rules/play-state.js';
import {truthCoreRules} from '../dist/rules/truth/core-rules.js';
import {truthPowers} from '../dist/rules/play-truth.js';
import {BESTIARY_WEAPONS} from '../dist/campaign-bestiary-weapons.js';
import {normalizeCharacterData} from '../dist/character-data.js';
export async function checkTruthPlay({pool,app,call,player,other,manager,campaign,character}){
 const original=(await pool.query('SELECT data FROM characters WHERE id=$1',[character])).rows[0].data;
 const extral={...original,truth:{nature:'extral',consciousness:'initie',choices:{species:'talass'},truthTalents:['extral-vision-des-fractures']}};
 for(const revelation of ['v','sr','r']){
  const state={...blankPlayState(),revelation,contexts:['extral-vision-des-fractures']};
  const prepared=playProfile(extral,state).skills.find(s=>s.id==='perception').prepared.find(p=>p.id==='extral-vision-des-fractures');
  assert.equal(prepared.active,revelation!=='v','canonical SR/R access for prepared truth bonus');
  assert.equal(playProfile({...extral,truth:{...extral.truth,consciousness:'profane'}},state).skills.find(s=>s.id==='perception').prepared.find(p=>p.id==='extral-vision-des-fractures').active,false);
 }
 const old=(await pool.query('SELECT state FROM character_play_states WHERE character_id=$1',[character])).rows[0].state;
 const data=structuredClone(original);data.truth={nature:'garou',consciousness:'initie',choices:{blood:'sang_predateur',pelage:'gris'},truthTalents:[]};
 data.identity.nationality='Française';assert.equal(normalizeCharacterData(data).identity.nationality,'Française');
 const media=randomUUID();await pool.query('INSERT INTO character_media(id,owner_id,sha256,mime_type,content) VALUES($1,$2,$3,$4,$5)',[media,player.id,media.padEnd(64,'0'),'image/png',Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0])]);
 data.appearances.truth.push({mediaId:media,label:'Hybride'});data.appearances.formPortraits={hybrid:media};
 const setData=()=>pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[character,JSON.stringify(data)]);await setData();
 await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[character,JSON.stringify({...blankPlayState(),hp:10,pa:3,paPerRound:3,initiative:19})]);
 const path=`/api/characters/${character}/play`;let live=await call(player,'GET',path);
 // Individual round endpoint is only available outside campaigns.
 const act=async(action,extra={},status=200)=>{if(action==='round')await pool.query('UPDATE characters SET campaign_id=NULL WHERE id=$1',[character]);const r=await call(player,'POST',path,{requestId:randomUUID(),version:live.version,action,...extra},status);if(action==='round')await pool.query('UPDATE characters SET campaign_id=$2 WHERE id=$1',[character,campaign]);if(status===200)live=r;return r;};
 const wounds=live.profile.derived.pvMax-live.profile.hp;
 await act('form',{form:'hybrid'});assert.equal(live.state.pa,0);assert.equal(live.state.form,'human');
 await act('round');assert.equal(live.state.form,'hybrid');assert.equal(live.state.pa,3);assert.equal(live.profile.derived.pvMax-live.profile.hp,wounds);assert.equal(live.profile.body.damage,5);assert.equal(live.profile.body.armor,2);
 assert.equal((await call(other,'GET',`/api/campaigns/${campaign}/play`)).characters.find(c=>c.id===character).portrait,`/api/character-media/${media}`);
 assert.equal((await app.inject({url:`/api/character-media/${media}`,headers:{cookie:other.cookie}})).statusCode,200);
 await act('round');assert.equal(live.state.pa,4);assert.equal(live.state.initiative,19);
 await act('form',{form:'human'});assert.equal(live.profile.derived.pvMax-live.profile.hp,wounds);
 assert.equal((await app.inject({url:`/api/character-media/${media}`,headers:{cookie:other.cookie}})).statusCode,404);
 await act('form',{form:'hybrid'},400);
 await act('form',{form:'hybrid',exhaustion:'narrative-failure'});assert.equal(live.state.mueBlocked,true);await act('form',{form:'hybrid',exhaustion:'success'},400);
 await act('scene');assert.equal(live.state.mueCount,2);assert.equal(live.state.mueBlocked,false);
 // Saved settings cannot forge a form, active powers or usage counters.
 await act('save',{state:{...live.state,form:'hybrid',powers:[{id:'forged',until:null,skill:'pugilat',amount:99,note:''}],mueCount:0}});assert.equal(live.state.form,'human');assert.equal(live.state.powers.length,0);assert.equal(live.state.mueCount,2);
 data.truth={nature:'vampire',consciousness:'initie',choices:{},truthTalents:['faveur_de_la_nuit']};await setData();
 await act('save',{state:{...live.state,revelation:'v',pa:3}});
 await act('power',{powerId:'faveur_de_la_nuit',enabled:true,paCost:0,duration:1,skill:'furtivite',amount:3,note:'Dans les ombres'},400);
 await act('save',{state:{...live.state,revelation:'r',pa:3}});
 const base=live.profile.skills.find(s=>s.id==='furtivite').total;
 await act('power',{powerId:'faveur_de_la_nuit',enabled:true,paCost:0,duration:1,skill:'furtivite',amount:3,note:'Dans les ombres'});assert.equal(live.profile.skills.find(s=>s.id==='furtivite').total,base+3);
 await act('round');assert.equal(live.state.powers.length,0);assert.equal(live.profile.skills.find(s=>s.id==='furtivite').total,base);
 for(const nature of ['vampire','garou','khinae','mage','daemon','angelus','aseryn','exile','extral'])assert.ok(truthPowers({...data,truth:{nature,consciousness:'initie',choices:{},truthTalents:[truthCoreRules.catalogs[nature][0].id]}}).length,nature);
 // Target-first player attacks expose only their inventory and reject forged equipment.
 const victim=randomUUID();await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4::jsonb,$5)',[victim,other.id,'Cible CI',JSON.stringify(original),campaign]);await pool.query('UPDATE campaign_members SET character_id=$3 WHERE campaign_id=$1 AND user_id=$2',[campaign,other.id,victim]);
 data.reality.equipment=[{itemId:BESTIARY_WEAPONS[0].id,quantity:1}];await setData();
 const url=`/api/campaigns/${campaign}/combat`,room=await call(player,'GET',url),attacker=room.attackers.find(a=>a.id===character);
 assert.deepEqual(new Set(attacker.options.map(o=>o.id)),new Set(['unarmed',BESTIARY_WEAPONS[0].id]));
 const attack={requestId:randomUUID(),action:'launch',attackerId:character,targetId:victim,optionId:BESTIARY_WEAPONS[0].id,bonus:0,bonusDamage:0,surprise:false};
 await call(player,'POST',url,{...attack,requestId:randomUUID(),optionId:BESTIARY_WEAPONS[1].id},400);
 const pa=live.state.pa;await call(player,'POST',url,attack);await call(player,'POST',url,attack);assert.equal((await call(player,'GET',path)).state.pa,pa-1);
 assert.ok((await call(other,'GET',url)).pending.some(a=>a.id===attack.requestId));
 await call(other,'POST',url,{...attack,requestId:randomUUID()},404);
 await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[character,JSON.stringify(original)]);await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[character,JSON.stringify(old)]);
 console.log('TRUTH PLAY OK — forms, wound preservation, delayed PA, portrait privacy, exhaustion, protected state, power gating/expiry, target-first inventory-only attacks and replay safety.');
}
