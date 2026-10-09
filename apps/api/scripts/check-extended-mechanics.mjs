import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {truthCoreRules} from '../dist/rules/truth/core-rules.js';
import {applyVampirePredation,resetVampirePeriod,vampireState} from '../dist/rules/live-vampire.js';
import {blankPlayState} from '../dist/rules/play-state.js';

/** Uses a new character/campaign: never changes the surrounding playtest fixtures. */
export async function checkExtendedMechanics({pool,call,player,other,manager,character}){
 const template=(await pool.query('SELECT data FROM characters WHERE id=$1',[character])).rows[0].data;
 const data=structuredClone(template);data.truth={nature:'vampire',consciousness:'initie',choices:{court:'ihuito_meztzi',blood:'sang_ecarlate'},truthTalents:truthCoreRules.catalogs.vampire.map(p=>p.id)};
 data.appearances={reality:[],truth:[]};
 const id=randomUUID(),campaign=randomUUID();
 await pool.query('INSERT INTO characters(id,owner_id,name,data) VALUES($1,$2,$3,$4::jsonb)',[id,player.id,'CI Extended Vampire',JSON.stringify(data)]);
 const path=`/api/characters/${id}/play`;let live=await call(player,'GET',path);
 const request=(action,extra={})=>({requestId:randomUUID(),version:live.version,action,...extra});
 const act=async(action,extra={},status=200,user=player)=>{const body=request(action,extra),response=await call(user,'POST',path,body,status);if(status===200&&!response.alreadyApplied)live=response;return {body,response};};
 const campaignAction=async(action,extra={},status=200)=>{const room=await call(manager,'GET',`/api/campaigns/${campaign}/play`);return call(manager,'POST',`/api/campaigns/${campaign}/play/actions`,{requestId:randomUUID(),version:room.combat.version,action,...extra},status);};
 try{
  await act('save',{state:{...live.state,revelation:'r',hp:5}});
  const entering=await act('vampire-stasis',{active:true});assert.equal(live.state.vampire.stasis,true);assert.equal(live.state.unconscious,true);assert.equal(live.event.payload.paCost,0);
  assert.equal((await call(player,'POST',path,entering.body)).alreadyApplied,true);
  const version=live.version;await call(player,'POST',path,{...entering.body,requestId:randomUUID()},409);assert.equal((await call(player,'GET',path)).version,version);
  const before=live.profile.hp;await act('vampire-stasis-recovery',{hours:2,regenerable:true});assert.equal(live.profile.hp,Math.min(live.profile.derived.pvMax,before+4));assert.equal(live.event.payload.rate,2);
  await act('vampire-stasis-recovery',{hours:2,regenerable:false},400);
  await act('save',{state:{...live.state,unconscious:false,vampire:{...live.state.vampire,stasis:false,anchor:true},powerUses:{'scenario:dernier_sommeil':0}}});
  assert.equal(live.state.vampire.stasis,true);assert.equal(live.state.vampire.anchor,false);assert.equal(live.state.unconscious,true);
  await act('roll',{skill:'athletisme'},400);await act('vampire-surregime',{},400);
  await act('vampire-stasis',{active:false});assert.equal(live.state.unconscious,false);
  await act('initiative');await act('save',{state:{...live.state,pa:5}});
  const boost=await act('vampire-surregime');assert.equal(live.state.pa,6);assert.equal(live.event.payload.paGained,1);assert.equal(live.state.powerUses['scene:surregime'],1);
  assert.equal((await call(player,'POST',path,boost.body)).alreadyApplied,true);await act('vampire-surregime',{},400);
  await act('save',{state:{...live.state,powerUses:{},vampire:{...live.state.vampire,cycleUntilRound:999,exaltedBlood:true}}});assert.equal(live.state.powerUses['scene:surregime'],1);assert.equal(live.state.vampire.exaltedBlood,false);
  await act('vampire-stasis',{active:true});assert.equal(live.event.payload.paCost,2);assert.equal(live.state.pa,4);
  await act('vampire-stasis-recovery',{hours:1,regenerable:true},400);
  await act('vampire-stasis',{active:false});assert.equal(live.event.payload.paCost,1);assert.equal(live.state.pa,3);
  await act('round');assert.equal(live.state.pa,live.state.paPerRound);assert.ok(live.state.pa<6);assert.equal(live.state.powerUses['scene:surregime'],1);
  await act('end-combat');assert.equal(live.state.powerUses['scene:surregime'],1);
  await act('rest',{days:1,prolonged:false});assert.equal(live.state.powerUses['scene:surregime'],1);
  await act('initiative');await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[id,JSON.stringify({...live.state,pa:3,paPerRound:3})]);live=await call(player,'GET',path);
  await act('power',{powerId:'fantasmagorie',enabled:true,paCost:0,duration:0,skill:'',amount:0,note:'Illusion dans le cube canonique'});assert.equal(live.state.pa,2);
  await act('round');assert.equal(live.state.pa,2);assert.equal(live.state.powers.some(p=>p.id==='fantasmagorie'),true);
  await act('power',{powerId:'double_tenebreux',enabled:true,paCost:0,duration:0,skill:'',amount:0,note:'Double canonique'});assert.equal(live.state.pa,1);
  await act('power',{powerId:'devorer_la_chaleur',enabled:true,paCost:0,duration:0,skill:'',amount:0,note:'Zone canonique3m'});
  await act('round');assert.equal(live.state.pa,0);assert.equal(live.state.powers.length,3);
  await act('save',{state:{...live.state,pa:3}});await act('power',{powerId:'fournaise',enabled:true,paCost:0,duration:0,skill:'',amount:0,note:'Zone thermique canonique'});assert.equal(live.state.pa,1);
  await act('round');assert.equal(live.state.pa,0);assert.equal(live.state.powers.some(p=>p.id==='fournaise'),false);assert.equal(live.state.powers.length,3);
  await act('save',{state:{...live.state,unconscious:true}});await act('round');assert.equal(live.state.powers.length,0);
  await act('save',{state:{...live.state,unconscious:false}});await act('end-combat');
  await act('save',{state:{...live.state,revelation:'v'}});await act('vampire-stasis',{active:true},400);await act('save',{state:{...live.state,revelation:'r'}});
  await act('scene');assert.equal(live.state.powerUses['scene:surregime'],undefined);await act('initiative');await act('vampire-surregime');
  await act('power',{powerId:'surregime',enabled:true,paCost:0,duration:0,skill:'athletisme',amount:99,note:'forged'},400);
  await act('end-combat');
  // An anchor persists through scenes, reserves exactly 3 PV and only an authorized campaign MJ can destroy/restore it.
  await act('vampire-anchor',{hours:1});assert.equal(live.state.vampire.anchor,true);const ceiling=live.profile.derived.pvMax-3;
  await act('heal',{amount:1000});assert.equal(live.profile.hp,ceiling);await act('scene');assert.equal(live.state.vampire.anchor,true);
  await act('vampire-anchor-destroy',{},400);await act('vampire-anchor-restore',{hours:24,bodyRepairable:true,practitioner:true},400);
  await act('initiative');await act('vampire-surregime');await act('end-combat');
  await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'CI Extended Mechanics']);
  await pool.query('UPDATE characters SET campaign_id=$2 WHERE id=$1',[id,campaign]);
  await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,player.id,id]);
  await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'accepted')",[campaign,other.id]);
  assert.equal((await call(manager,'GET',path)).canManageMechanics,true);
  await act('vampire-anchor-destroy',{},404,other);await act('vampire-anchor-destroy',{},200,manager);assert.equal(live.state.vampire.anchor,false);
  await act('scene',{},403);await act('scenario',{},403);
  await campaignAction('combat-start',{mode:'manual'});live=await call(player,'GET',path);await act('initiative');
  await act('vampire-surregime',{},400); // The previous standalone combat's scene quota survives the new campaign combat.
  const seeded={...live.state,vampire:{...vampireState(live.state),fedThisScene:true,exaltedBlood:true,cycleUntilRound:live.state.round}};
  await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[id,JSON.stringify(seeded)]);
  await campaignAction('combat-stop');live=await call(player,'GET',path);assert.equal(live.state.powerUses['scene:surregime'],1);assert.equal(live.state.vampire.fedThisScene,true);assert.equal(live.state.vampire.exaltedBlood,true);
  await campaignAction('combat-scene');live=await call(player,'GET',path);assert.equal(live.state.powerUses['scene:surregime'],undefined);assert.equal(live.state.vampire.fedThisScene,false);assert.equal(live.state.vampire.exaltedBlood,false);
  await campaignAction('combat-start',{mode:'manual'});live=await call(player,'GET',path);await act('initiative');await act('vampire-surregime');
  await (await import('./check-vampire-combat.mjs')).checkVampireCombat({pool,call,player,other,manager,campaign,character:id});live=await call(player,'GET',path);
  await campaignAction('combat-stop');live=await call(player,'GET',path);
  await act('vampire-anchor',{hours:1});const lethal=await act('damage',{amount:1000});assert.equal(live.profile.hp,live.profile.derived.death+1);assert.equal(live.event.payload.lastSleep.saved,true);assert.equal(live.state.vampire.stasis,true);assert.equal(live.state.unconscious,true);assert.equal(live.state.powerUses['scenario:dernier_sommeil'],1);
  assert.equal((await call(player,'POST',path,lethal.body)).alreadyApplied,true);
  await act('save',{state:{...live.state,unconscious:false,powerUses:{},vampire:{...live.state.vampire,stasis:false}}});assert.equal(live.state.powerUses['scenario:dernier_sommeil'],1);assert.equal(live.state.vampire.stasis,true);
  await act('damage',{amount:1});assert.equal(live.profile.health,'Mort');assert.equal(live.event.payload.lastSleep.saved,false);
  await act('vampire-anchor-restore',{hours:23,bodyRepairable:true,practitioner:true},400,manager);
  await act('vampire-anchor-restore',{hours:24,bodyRepairable:false,practitioner:true},400,manager);
  const restored=await act('vampire-anchor-restore',{hours:24,bodyRepairable:true,practitioner:true},200,manager);
  assert.equal(live.profile.hp,1);assert.equal(live.state.vampire.stasis,true);assert.equal(live.state.vampire.anchor,false);assert.equal(live.state.powerUses['scene:surregime'],1);
  assert.equal((await call(manager,'POST',path,restored.body)).alreadyApplied,true);
  const peer=await call(other,'GET',`/api/campaigns/${campaign}/play`);assert.equal(peer.characters[0].data,undefined);assert.equal(peer.events.some(e=>e.kind==='vampire-anchor-restore'),false);
  // Pure feeding/scene boundary hooks cannot heal more than committed losses or renew protected usages.
  const pure={...blankPlayState(),hp:5,revelation:'r',powerUses:{'scenario:dernier_sommeil':1},vampire:{...vampireState(live.state),stasis:false},unconscious:false};
  const fed=applyVampirePredation(data,pure,{success:true,actualLoss:2,dr:5,exalt:true},16);assert.equal(fed.payload.recovered,0);assert.equal(fed.state.vampire.exaltedBlood,true);
  const next=resetVampirePeriod(fed.state);assert.equal(next.vampire.exaltedBlood,false);assert.equal(next.vampire.fedThisScene,false);assert.equal(next.powerUses['scenario:dernier_sommeil'],1);
 }finally{
  await pool.query('DELETE FROM characters WHERE id=$1',[id]);await pool.query('DELETE FROM campaigns WHERE id=$1',[campaign]);
 }
 console.log('EXTENDED MECHANICS API OK — protected Vampire state, stasis costs, recovery gating, PA6 boost, canonical maintenance/budget/end conditions, replay/conflicts, scene/combat boundaries, anchors, campaign MJ permissions and private logs.');
}
