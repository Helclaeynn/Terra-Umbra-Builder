import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI environment only');
const database=new URL(process.env.DATABASE_URL||'');
assert.ok(['127.0.0.1','localhost'].includes(database.hostname)&&database.pathname==='/tuc_sheet_test','Never run this test on a production database');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {normalizeAngelusBuild,angelusTalentIds:ids}=await import('../dist/rules/truth/angelus-build.js');
const {registerCharacterRoutes}=await import('../dist/characters.js');
const {default:Fastify}=await import('fastify');
const app=Fastify();await registerCharacterRoutes(app);
const users=[];
async function user(){const suffix=randomBytes(10).toString('hex');const row=(await pool.query("INSERT INTO users(email,display_name,role) VALUES ($1,$2,'player') RETURNING id",['ci-angelus-'+suffix+'@example.invalid','CI angelus'])).rows[0];users.push(row.id);const token=randomBytes(32).toString('base64url');await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),row.id]);return {id:row.id,cookie:'__Host-tuc_session='+token};}
async function call(who,method,url,payload,status=200){const response=await app.inject({method,url,headers:who?{cookie:who.cookie}:{},...(payload===undefined?{}:{payload})});assert.equal(response.statusCode,status,method+' '+url+' '+response.body);return response.json();}
try{
  const owner=await user(),other=await user();
  const created=(await call(owner,'POST','/api/characters',{name:'CI angelus sauvegarde'},201)).character;
  const url='/api/characters/'+created.id,data=structuredClone(created.data);
  data.creation={origin:'corporatiste',sphere:'corporatiste',style:'manucorpo'};
  data.talents.sphere='profil_calibre';data.talentChoices={profil_calibre:'mecanique',badge_interne:'Programme confidentiel fictif'};
  data.progression={...data.progression,xpEarned:100,realityTalents:['renomme','avantages_salaries'],renownAdjustment:2,realityTalentChoices:{acces_aux_registres:'Police'},profilCalibreUsed:true,cashBase:10000,cashTransactions:[{uid:'historic',amount:-750,label:'Achat avant migration',type:'purchase',at:'2026-09-27'}]};
  data.reality={...data.reality,talentBenefits:{insuredAssetUid:'personal',additionalSupportType:'vehicle',additionalSupportItemId:'test-car'},equipment:[{uid:'personal',itemId:'test-equipment',kind:'equipment',selectedPrice:750,cataloguePrice:1000,priceConfirmed:true},{uid:'loan',itemId:'test-car',kind:'equipment',selectedPrice:0,cataloguePrice:9000,talentGrant:'avantages_salaries',grantCreated:true,sphereSupport:true,acquiredInCampaign:true}],fixedChargeItems:[{uid:'rent',name:'Studio',monthly:0,grantOriginalMonthly:500,talentGrant:'avantages_salaries',grantAcquiredInCampaign:true}]};
  const angelusBuild=normalizeAngelusBuild({secondaryNature:'vertu',transcendenceEvent:'Éveil <script>test</script>',preferredSin:'envie',observedSkill:'Médecine',bladeForm:'ranged',bladeSacrifice:3,liaisonContact:'Un contact céleste',heartLink:'Un partenaire',shapeDescription:'Une passerelle ancrée',construct:{name:'Porteur',kind:'carrier',purpose:'Évacuer un blessé',limits:'30 m ; PA du créateur'}});
  data.truth={...data.truth,nature:'angelus',consciousness:'initie',choices:{angelNature:'trone',sephirah:'yessod',archangel:'',seraph:'',angelusBuild},truthTalents:['nature_trone_lecture_superficielle','nature_trone_lecture_profonde',ids.cherub,ids.reserve,ids.liaison,ids.construct]};
  await call(owner,'PATCH',url,{version:1,data});
  let saved=(await call(owner,'GET',url)).character;
  assert.deepEqual(saved.data.talentChoices,data.talentChoices);assert.deepEqual(saved.data.progression,data.progression);assert.deepEqual(saved.data.reality,data.reality);
  assert.deepEqual(saved.data.truth,data.truth,'Angelus options saved and reloaded through actual API + SQL');
  await call(other,'GET',url,undefined,404);await call(null,'GET',url,undefined,401);
  await call(owner,'PATCH',url,{version:1,data},409);
  const modified=structuredClone(saved.data);modified.truth.choices.angelusBuild.construct.name='Autre nom';modified.progression.renownAdjustment=3;modified.progression.profilCalibreUsed=false;
  await call(owner,'PATCH',url,{version:2,data:modified});
  await call(owner,'POST',url+'/revisions/2/restore',{});
  saved=(await call(owner,'GET',url)).character;
  assert.deepEqual(saved.data.truth,data.truth,'Angelus configuration restored with its actual version');
  assert.deepEqual(saved.data.progression,data.progression,'Restoring a version restores renown, choices, usage and historic cash');
  assert.deepEqual(saved.data.reality,data.reality,'Loans and grant provenance survive restoration');
  const forged=structuredClone(saved.data);forged.truth.choices.angelusBuild.approved=true;forged.truth.choices.angelusBuild.xpEarned=999;forged.truth.choices.angelusBuild.role='gm';forged.truth.choices.angelusBuild.construct.approved=true;
  await call(owner,'PATCH',url,{version:saved.version,data:forged});const verified=(await call(owner,'GET',url)).character;
  assert.equal(verified.data.truth.choices.angelusBuild.approved,undefined);assert.equal(verified.data.truth.choices.angelusBuild.role,undefined);assert.equal(verified.data.truth.choices.angelusBuild.xpEarned,undefined);assert.equal(verified.data.truth.choices.angelusBuild.construct.approved,undefined);assert.deepEqual(verified.data.progression,saved.data.progression);
  assert.equal((await pool.query('SELECT role FROM users WHERE id=$1',[owner.id])).rows[0].role,'player','Fictional secret access does not promote the account');
  console.log('ANGELUS PERSISTENCE OK — actual API + PostgreSQL configuration save/reload, unchanged rewards, version conflict, complete restoration, private ownership and no role changes');
}finally{await app.close();if(users.length)await pool.query('DELETE FROM users WHERE id=ANY($1::uuid[])',[users]);await pool.end();}
