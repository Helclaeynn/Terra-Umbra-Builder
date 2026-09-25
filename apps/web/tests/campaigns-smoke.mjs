import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const fixtureSource=await readFile(new URL('./builder-v2-smoke.mjs',import.meta.url),'utf8');
const fixtures=Function(fixtureSource.slice(fixtureSource.indexOf('const skillIds='),fixtureSource.indexOf('const browser='))+'; return {characterData,rules,lore,edgeRules,truthRules,realityRules};')();
const base=process.env.TUC_V2_SMOKE_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
const cid='11111111-1111-4111-8111-111111111111',gid='22222222-2222-4222-8222-222222222222',pid='33333333-3333-4333-8333-333333333333',chid='44444444-4444-4444-8444-444444444444';
let role='gm',status='invited',attached=null,invited=false,version=1,notes='Notes secrètes du MJ',archived=false,conflict=false;
const name='<script>Campagne</script> · California';
const campaign=()=>({id:cid,name,description:'Une campagne de test',gmName:'Morgan',ownerId:gid,canManage:role==='gm',membershipStatus:role==='gm'?null:status,memberCount:status==='accepted'?1:0,archivedAt:archived?'2026-09-23':null,version,...(role==='gm'?{gmNotes:notes}:{})});
const members=()=>invited?[{userId:pid,displayName:'Camille',status,admissionStatus,characterId:attached,characterName:attached?'Alexandra':null,canReadSheet:!!attached,updatedAt:null}]:[];
let attendanceResponse=null,sessionCount=0;
let session=null,effectConflict=false,admissionStatus='pending',admissionVersion=1,admissionMessage='';
const effectTarget={id:chid,name:'Alexandra',version:1,money:1000,corruption:0,integrity:4,source:''};
const errors=[];const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
await page.route('**/api/**',async route=>{
 const req=route.request(),url=new URL(req.url()),path=url.pathname,method=req.method();let body={},code=200;
 if(path==='/api/campaigns'&&method==='GET')body={campaigns:[campaign()],canCreate:role==='gm',userId:role==='gm'?gid:pid};
 else if(path==='/api/campaigns'&&method==='POST'){assert.equal(req.postDataJSON().name,'Nouvelle table');body={campaign:{id:cid}};code=201;}
 else if(path===`/api/campaigns/${cid}`&&method==='GET')body={campaign:campaign(),members:members(),userId:role==='gm'?gid:pid};
 else if(path===`/api/campaigns/${cid}`&&method==='PATCH'){
  if(conflict){code=409;body={error:'campaign_version_conflict'};}else{const b=req.postDataJSON();notes=b.gmNotes;archived=b.archived;version++;body={ok:true};}
 }
 else if(path.endsWith('/admissions')&&method==='GET')body={canManage:role==='gm',rules:'Uniquement des Crawlers.',admissions:invited?[{userId:pid,displayName:'Camille',version:admissionVersion,status:attached?admissionStatus:'none',characterId:attached,name:attached?'Alexandra':null,characterVersion:1,data:fixtures.characterData,baseline:fixtures.characterData,sourceVersion:1,sourceName:'Alexandra',sourceCampaign:null,messages:admissionMessage?[{kind:admissionStatus,message:admissionMessage,at:'2026-09-23',author:'Morgan'}]:[]}]:[]};
 else if(path.includes('/admissions/')&&method==='PATCH'){admissionStatus=req.postDataJSON().status;admissionMessage=req.postDataJSON().message;admissionVersion++;body={ok:true};}
 else if(path==='/api/rulesets/terra-umbra/creation')body={rules:fixtures.rules,lore:fixtures.lore,edgeRules:fixtures.edgeRules,talentChoiceSpecs:{},skillTalentMap:{},disadvantages:{common:[],attribute:[],sphere:{}}};
 else if(path==='/api/rulesets/terra-umbra/truth')body=fixtures.truthRules;
 else if(path==='/api/rulesets/terra-umbra/reality')body=fixtures.realityRules;
 else if(path==='/api/compendium/library')body={favoriteItems:[{id:'pnj-favori',title:'Contact favori',category:'Personnages',snippet:'Contact de la campagne'}],recentItems:[]};
 else if(path.endsWith('/preparation-library'))body={references:[],previous:[]};
 else if(path.includes('/attendance/')&&method==='PUT'){attendanceResponse=req.postDataJSON().response;session.attendance=[{userId:pid,displayName:'Camille',characterId:chid,response:attendanceResponse}];body={ok:true};}
 else if(path.endsWith('/sessions')&&method==='GET')body={calendarMailAvailable:true,sessions:session?[role==='gm'?session:{...session,preparation:undefined,scenes:undefined,report:session.published?session.report:''}]:[],hasMore:false};
 else if(path.endsWith('/sessions')&&method==='POST'){session={...req.postDataJSON(),id:++sessionCount===1?gid:'55555555-5555-4555-8555-555555555555',version:1,rewards:[],effects:[],attendance:[{userId:pid,displayName:'Camille',characterId:chid,response:attendanceResponse}]};body={session:{id:session.id,version:1}};code=201;}
 else if((path.endsWith('/preparation')||path.endsWith('/sessions/'+session?.id))&&method==='PATCH'){const b=req.postDataJSON();assert.equal(b.version,session.version);session={...session,...b,version:session.version+1};body={session:{id:session.id,version:session.version}};}
 else if(path.endsWith('/rewards')){const b=req.postDataJSON();assert.equal(b.rewards.length,1);assert.equal(b.rewards[0].characterId,chid);session.rewards=[{characterId:chid,characterName:'Alexandra',xp:b.rewards[0].xp,ptv:b.rewards[0].ptv,awardedAt:'2026-09-23'}];body={ok:true};}
 else if(path==='/api/compendium/search'){body={items:[{id:url.searchParams.get('category')==='Bestiaire'?'bestiaire-loup':'pnj-cole',title:url.searchParams.get('category')==='Bestiaire'?'Loup sombre':'Cole Gallagher',category:url.searchParams.get('category'),snippet:'Référence pour la scène.'}]};}
 else if(path.endsWith('/effect-targets'))body={characters:[effectTarget],sources:[{id:'vhodhal',name:'Vhodhal',corruption:'Famine Blanche'}]};
 else if(path.endsWith('/effects')){const b=req.postDataJSON();if(effectConflict){code=409;body={error:'effect_version_conflict'};}else{assert.equal(b.characterId,chid);assert.equal(b.money,250);assert.equal(b.corruptionDelta,1);effectTarget.money+=250;effectTarget.corruption=1;effectTarget.source='vhodhal';effectTarget.version++;session.effects=[{id:b.requestId,characterName:'Alexandra',money:b.money,corruptionDelta:1,corruptionSource:'vhodhal',reason:b.reason,before:{money:1000,corruption:0,source:''},after:{money:1250,corruption:1,source:'vhodhal'},appliedAt:'2026-09-23'}];body={ok:true};}}
 else if(path.endsWith('/accounts'))body={accounts:[{id:pid,displayName:'Camille'}]};
 else if(path.endsWith('/calendar-invitations')){assert.equal(req.postDataJSON().version,session.version);assert.equal(session.title,'Rendez-vous calendrier');assert.ok(session.startsAt.endsWith('Z'));body={sent:1,alreadySent:0,failed:0,uncertain:0,total:1};}
 else if(path.endsWith('/invitations')){assert.equal(req.postDataJSON().userId,pid);invited=true;code=201;body={ok:true};}
 else if(path.endsWith('/membership')){admissionStatus='pending';status='accepted';attached=req.postDataJSON().characterId;body={ok:true};}
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
 await page.locator('details.panel > summary').filter({hasText:/^Le groupe ·/}).waitFor();
 assert.equal(await page.locator('script').filter({hasText:'Campagne'}).count(),0);
 await page.getByText('Inviter un joueur',{exact:true}).click();
 await page.getByRole('button',{name:'Parcourir les joueurs',exact:true}).click();
 await page.getByRole('button',{name:'Inviter Camille',exact:true}).waitFor();
 assert.equal(await page.getByLabel('Nom de compte',{exact:true}).inputValue(),'');
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
 role='player';await page.goto(base+'/campaigns');
 await page.getByRole('link').filter({hasText:'Répondre →'}).click();
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
 await page.getByLabel('Retour au joueur',{exact:true}).fill('Uniquement des Crawlers, adapte ton Origine.');
 await page.getByRole('button',{name:'Demander des modifications',exact:true}).click();
 await page.getByText('Décision enregistrée et visible par le joueur.',{exact:true}).waitFor();
 assert.equal(admissionStatus,'changes_requested');
 await page.getByRole('button',{name:'Accepter la fiche',exact:true}).click();
 await page.getByText('Fiche acceptée',{exact:false}).waitFor();
 assert.equal(admissionStatus,'approved');
 await page.getByRole('button',{name:'Préparer une séance',exact:true}).click();
 await page.getByLabel('Titre de la séance',{exact:true}).fill('La piste du port');
 await page.getByLabel('Mes notes de séance',{exact:true}).fill('SECRET DU PORT');
 assert.equal(await page.getByLabel('Début de la séance',{exact:true}).count(),0);
 await page.getByRole('button',{name:'Ajouter une scène',exact:true}).click();
 await page.getByLabel('Titre de la scène',{exact:true}).fill('SECRET SCENE PORT');
 await page.getByLabel('Notes de la scène',{exact:true}).fill('SECRET SCENE NOTES');
 await page.getByRole('button',{name:'Ajouter une référence',exact:true}).click();
 await page.getByRole('button',{name:'Ajouter Cole Gallagher',exact:true}).waitFor();
 assert.equal(await page.getByLabel('Rechercher une référence',{exact:true}).inputValue(),'');
 await page.getByLabel('Rechercher une référence',{exact:true}).fill('Cole');
 await page.getByRole('button',{name:'Ajouter Cole Gallagher',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'Ajouter Cole Gallagher',exact:true}).isDisabled(),true);
 await page.locator('.reference-options > summary').first().click();
 await page.getByLabel('Annotation privée',{exact:true}).fill('SECRET NPC ROLE');
 await page.getByRole('button',{name:'Une créature',exact:true}).click();
 await page.getByLabel('Rechercher une référence',{exact:true}).fill('Loup');
 await page.getByRole('button',{name:'Ajouter Loup sombre',exact:true}).click();
 await page.locator('.reference-options > summary').nth(1).click();
 await page.getByLabel('Quantité',{exact:true}).nth(1).fill('3');
 await page.getByRole('button',{name:'Un PNJ',exact:true}).click();
 await page.getByLabel('Rechercher une référence',{exact:true}).fill('');
 await page.getByRole('button',{name:'Mes favoris',exact:true}).click();
 await page.getByRole('button',{name:'Ajouter Contact favori',exact:true}).click();
 await page.getByText('Utiliser une trame',{exact:true}).click();
 await page.getByRole('button',{name:'Préparer : Enquête',exact:true}).click();
 assert.match(await page.getByLabel('Notes de la scène',{exact:true}).nth(1).inputValue(),/Indices accessibles/);
 await page.getByRole('button',{name:'Ajouter une référence',exact:true}).last().click();
 await page.getByRole('button',{name:'Déjà dans la campagne',exact:true}).last().click();
 await page.getByRole('button',{name:'Ajouter Contact favori',exact:true}).last().click();

 for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Preparation layout '+width);}
 await page.getByRole('button',{name:'Date, invitations et compte rendu',exact:true}).click();
 await page.getByLabel('État de la séance',{exact:true}).selectOption('played');
 await page.getByText('Compte rendu pour le groupe',{exact:true}).click();
 await page.getByLabel('Compte rendu de la séance',{exact:true}).fill('BROUILLON DU PORT');
 await page.getByRole('button',{name:'Enregistrer la séance',exact:true}).click();
 await page.getByText('Séance enregistrée.',{exact:true}).waitFor();
 await page.locator('.session > summary').click();
 await page.locator('.private > summary').click();
 await page.getByText('Voir les réponses / ajuster les présences',{exact:true}).click();
 await page.getByLabel('Présence de Camille',{exact:true}).selectOption('present');
 await page.getByText('1 présent(s) · 0 incertain(s) · 0 absent(s) · 0 sans réponse',{exact:true}).waitFor();
 assert.equal(await page.getByRole('link',{name:'Cole Gallagher ↗',exact:true}).isVisible(),true);
 assert.equal(await page.getByRole('link',{name:'Loup sombre ↗',exact:true}).isVisible(),true);
 assert.equal(await page.getByRole('link',{name:'Contact favori ↗',exact:true}).count(),2);
 await page.getByRole('button',{name:'Attribuer les récompenses',exact:true}).click();
 assert.equal(await page.getByLabel('Alexandra',{exact:true}).isChecked(),true);
 await page.getByRole('button',{name:'Courte / transition · 2 XP',exact:true}).click();
 assert.equal(await page.getByLabel('XP · Alexandra',{exact:true}).inputValue(),'2');
 await page.getByRole('button',{name:'Finale / événement majeur · 4 XP',exact:true}).click();
 assert.equal(await page.getByLabel('XP · Alexandra',{exact:true}).inputValue(),'4');
 await page.getByRole('button',{name:'2 PTV pour tous',exact:true}).click();
 await page.getByLabel('XP par personnage',{exact:true}).fill('3');
 assert.equal(await page.getByLabel('XP · Alexandra',{exact:true}).inputValue(),'3');
 await page.getByLabel('XP · Alexandra',{exact:true}).fill('5');
 await page.getByLabel('PTV par personnage',{exact:true}).fill('2');
 await page.getByRole('button',{name:'Confirmer l’attribution',exact:true}).click();
 await page.getByText('Récompenses ajoutées aux fiches et à leur historique.',{exact:true}).waitFor();
 assert.equal(session.rewards[0].xp,5);
 assert.equal(session.scenes[0].references.length,3);assert.equal(session.scenes[1].references[0].articleId,'pnj-favori');assert.equal(session.scenes[0].references[1].quantity,3);
 await page.getByRole('button',{name:'Argent et corruption',exact:true}).click();
 await page.getByLabel('Personnage concerné',{exact:true}).selectOption(chid);
 await page.getByLabel('Argent à verser ($)',{exact:true}).fill('250');
 await page.getByLabel('Points de corruption à ajouter',{exact:true}).fill('1');
 await page.getByLabel('Source dominante après l’effet',{exact:true}).selectOption('vhodhal');
 assert.equal(await page.getByLabel('Motif visible par le joueur (facultatif)',{exact:true}).inputValue(),'');
 effectConflict=true;await page.getByRole('button',{name:'Confirmer l’effet',exact:true}).click();
 await page.getByRole('alert').filter({hasText:'La fiche a changé'}).waitFor();
 assert.equal(await page.getByLabel('Argent à verser ($)',{exact:true}).inputValue(),'250');
 await page.getByRole('button',{name:'Actualiser les valeurs',exact:true}).click();
 effectConflict=false;await page.getByRole('button',{name:'Confirmer l’effet',exact:true}).click();
 await page.getByText('Effet appliqué à la fiche et enregistré dans son historique.',{exact:true}).waitFor();
 assert.equal(effectTarget.money,1250);

 for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Sessions layout '+width);}
 role='player';await page.goto(base+'/campaigns/'+cid);await page.getByText('La piste du port',{exact:true}).waitFor();
 assert.equal(await page.getByText('SECRET DU PORT',{exact:true}).count(),0);
 assert.equal(await page.getByText('SECRET SCENE PORT',{exact:true}).count(),0);
 assert.equal(await page.getByText('SECRET NPC ROLE',{exact:true}).count(),0);
 assert.equal(await page.getByRole('button',{name:'Argent et corruption',exact:true}).count(),0);
 assert.equal(await page.getByText('BROUILLON DU PORT',{exact:true}).count(),0);
 assert.equal(await page.getByRole('button',{name:'Préparer une séance',exact:true}).count(),0);
 assert.equal(await page.getByRole('link',{name:'← Retour à Mon espace',exact:true}).count(),2);
 role='gm';await page.goto(base+'/campaigns/'+cid);await page.getByText('La piste du port',{exact:true}).waitFor();
 await page.getByText('Gérer la campagne',{exact:true}).click();
 await page.getByRole('button',{name:'Préparer une séance',exact:true}).click();
 await page.getByLabel('Titre de la séance',{exact:true}).fill('Rendez-vous calendrier');
 await page.getByRole('button',{name:'Date, invitations et compte rendu',exact:true}).click();
 await page.getByLabel('Début de la séance',{exact:true}).fill('2026-10-01T18:00');
 await page.getByLabel('Fin de la séance',{exact:true}).fill('2026-10-01T22:00');
 await page.getByLabel('Lieu ou lien de visioconférence',{exact:true}).fill('Chez le MJ');
 await page.getByLabel('Envoyer une invitation calendrier aux joueurs en enregistrant',{exact:true}).check();
 await page.getByRole('button',{name:'Enregistrer la séance',exact:true}).click();
 await page.getByText('Séance enregistrée. Invitations : 1 envoyée(s), 0 déjà envoyée(s).',{exact:true}).waitFor();
 role='player';await page.goto(base+'/campaigns/'+cid);await page.locator('.session > summary').click();
 await page.getByRole('button',{name:'Incertain',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.choices button[aria-pressed=true]')?.textContent==='Incertain');
 assert.equal(attendanceResponse,'uncertain');
 role='gm';await page.goto(base+'/campaigns/'+cid);await page.getByText('Gérer la campagne',{exact:true}).click();
 await page.getByRole('button',{name:'Archiver la campagne',exact:true}).click();
 await page.getByText('Campagne archivée.',{exact:true}).waitFor();
 assert.equal(await page.getByText('Inviter un joueur',{exact:true}).count(),0);
 assert.deepEqual(errors,[]);
 console.log('CAMPAIGNS UI OK — create, invite, player consent, sheet link, private notes, version conflict retains draft, admissions with requested changes and approval, guided search, favorites and reusable scenes, private scenes, NPC and bestiary references, money/corruption preview, stale effect protection, archive and 1440/390/320px reflow');
}finally{await browser.close();}
