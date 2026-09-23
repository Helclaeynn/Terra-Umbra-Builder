import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const base=process.env.TUC_V2_SMOKE_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
const cid='11111111-1111-4111-8111-111111111111',gid='22222222-2222-4222-8222-222222222222',pid='33333333-3333-4333-8333-333333333333',chid='44444444-4444-4444-8444-444444444444';
let role='gm',status='invited',attached=null,invited=false,version=1,notes='Notes secrètes du MJ',archived=false,conflict=false;
const name='<script>Campagne</script> · California';
const campaign=()=>({id:cid,name,description:'Une campagne de test',gmName:'Morgan',ownerId:gid,canManage:role==='gm',membershipStatus:role==='gm'?null:status,memberCount:status==='accepted'?1:0,archivedAt:archived?'2026-09-23':null,version,...(role==='gm'?{gmNotes:notes}:{})});
const members=()=>invited?[{userId:pid,displayName:'Camille',status,characterId:attached,characterName:attached?'Alexandra':null,canReadSheet:!!attached,updatedAt:null}]:[];
const errors=[];const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
await page.route('**/api/**',async route=>{
 const req=route.request(),url=new URL(req.url()),path=url.pathname,method=req.method();let body={},code=200;
 if(path==='/api/campaigns'&&method==='GET')body={campaigns:[campaign()],canCreate:role==='gm',userId:role==='gm'?gid:pid};
 else if(path==='/api/campaigns'&&method==='POST'){assert.equal(req.postDataJSON().name,'Nouvelle table');body={campaign:{id:cid}};code=201;}
 else if(path===`/api/campaigns/${cid}`&&method==='GET')body={campaign:campaign(),members:members(),userId:role==='gm'?gid:pid};
 else if(path===`/api/campaigns/${cid}`&&method==='PATCH'){
  if(conflict){code=409;body={error:'campaign_version_conflict'};}else{const b=req.postDataJSON();notes=b.gmNotes;archived=b.archived;version++;body={ok:true};}
 }
 else if(path.endsWith('/accounts'))body={accounts:[{id:pid,displayName:'Camille'}]};
 else if(path.endsWith('/invitations')){assert.equal(req.postDataJSON().userId,pid);invited=true;code=201;body={ok:true};}
 else if(path.endsWith('/membership')){status='accepted';attached=req.postDataJSON().characterId;body={ok:true};}
 else if(path.includes('/members/')&&method==='DELETE'){invited=false;body={ok:true};}
 else if(path==='/api/characters')body={characters:[{id:chid,name:'Alexandra'}]};
 else{throw new Error('Unexpected API '+method+' '+path);}
 await route.fulfill({status:code,json:body});
});
try{
 await page.goto(base+'/campaigns');
 await page.getByRole('button',{name:'Créer une campagne'}).click();
 await page.getByLabel('Nom de la campagne',{exact:true}).fill('Nouvelle table');
 await page.getByRole('button',{name:'Créer',exact:true}).click();
 await page.getByRole('heading',{name:'Le groupe',exact:true}).waitFor();
 assert.equal(await page.locator('script').filter({hasText:'Campagne'}).count(),0);
 await page.getByLabel('Nom de compte',{exact:true}).fill('Ca');
 await page.getByRole('button',{name:'Inviter Camille',exact:true}).click();
 await page.getByText('Invitation en attente',{exact:false}).waitFor();
 await page.getByRole('button',{name:'Notes et paramètres',exact:true}).click();
 await page.getByLabel('Notes privées du MJ',{exact:true}).fill('Nouvelles notes privées');
 conflict=true;await page.getByRole('button',{name:'Enregistrer',exact:true}).click();
 await page.getByRole('alert').filter({hasText:'changé ailleurs'}).waitFor();
 assert.equal(await page.getByLabel('Notes privées du MJ',{exact:true}).inputValue(),'Nouvelles notes privées');
 conflict=false;await page.getByRole('button',{name:'Enregistrer',exact:true}).click();
 await page.getByText('Campagne enregistrée.',{exact:true}).waitFor();
 role='player';await page.goto(base+'/campaigns/'+cid);
 await page.getByRole('heading',{name:'Tu es invité à cette campagne'}).waitFor();
 assert.equal(await page.getByText('Nouvelles notes privées',{exact:true}).count(),0);
 assert.equal(await page.getByRole('button',{name:'Notes et paramètres'}).count(),0);
 await page.getByRole('combobox',{name:/^Personnage/}).selectOption(chid);
 await page.getByRole('button',{name:'Accepter l’invitation'}).click();
 await page.getByRole('link',{name:'Ouvrir la fiche →'}).waitFor();
 assert.match(await page.getByRole('link',{name:'Ouvrir la fiche →'}).getAttribute('href'),/campaign=/);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Player layout '+width);
 }
 role='gm';await page.goto(base+'/campaigns/'+cid);await page.getByRole('link',{name:'Ouvrir la fiche →'}).waitFor();
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'GM layout '+width);
 }
 await page.getByText('Gérer la campagne',{exact:true}).click();
 await page.getByRole('button',{name:'Archiver la campagne',exact:true}).click();
 await page.getByText('Campagne archivée.',{exact:true}).waitFor();
 assert.equal(await page.getByRole('heading',{name:'Inviter un joueur'}).count(),0);
 assert.deepEqual(errors,[]);
 console.log('CAMPAIGNS UI OK — create, invite, player consent, sheet link, private notes, version conflict retains draft, archive and 1440/390/320px reflow');
}finally{await browser.close();}
