import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const characterId='11111111-1111-4111-8111-111111111111';
const stale={identity:{name:'LOCAL STALE',age:'99',concept:'Ancienne fiche locale'}};
let savedPayload=null;

const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1500,height:1100}});
await context.addInitScript(value=>{
  localStorage.setItem('tuc-character-builder-v1',JSON.stringify(value));
},stale);

const page=await context.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',message=>{
  const text=message.text();
  const optionalRemoteTruthFailure=text.startsWith('Chargement V5 Exilés/Extrals TypeError: Failed to fetch');
  if(message.type()==='error'&&!text.startsWith('Failed to load resource:')&&!optionalRemoteTruthFailure)errors.push(`console: ${text}`);
});

await page.route(`**/api/characters/${characterId}`,async route=>{
  const request=route.request();
  if(request.method()==='GET'){
    return route.fulfill({
      status:200,
      contentType:'application/json',
      body:JSON.stringify({
        character:{
          id:characterId,
          name:'Anya côté liste',
          version:7,
          createdAt:'2026-09-19T10:00:00.000Z',
          updatedAt:'2026-09-19T10:00:00.000Z',
          data:{
            schemaVersion:1,
            rulesetId:'terra-umbra',
            identity:{
              name:'Anya Serveur',
              alias:'',
              age:'31',
              concept:'Diplomate de la Vérité',
              objective:'',
              notes:''
            }
          }
        }
      })
    });
  }
  if(request.method()==='PATCH'){
    savedPayload=JSON.parse(request.postData()||'{}');
    return route.fulfill({
      status:200,
      contentType:'application/json',
      body:JSON.stringify({
        character:{
          id:characterId,
          name:savedPayload.name,
          version:8,
          createdAt:'2026-09-19T10:00:00.000Z',
          updatedAt:'2026-09-19T10:05:00.000Z',
          data:savedPayload.data
        }
      })
    });
  }
  return route.fulfill({status:405,body:'method not allowed'});
});

try{
  await page.goto(`${base}character-builder/?character=${characterId}`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__TUC_APP_READY__===true&&window.TUCV2Bridge?.version===7,null,{timeout:30000});

  const loaded=await page.evaluate(()=>window.TUCV2Bridge.snapshot());
  if(loaded.identity?.name!=='Anya Serveur')throw new Error(`La fiche serveur n'a pas gagné sur le localStorage: ${JSON.stringify(loaded.identity)}`);

  const untouchedLocal=JSON.parse(await page.evaluate(()=>localStorage.getItem('tuc-character-builder-v1')||'{}'));
  if(untouchedLocal.identity?.name!=='LOCAL STALE')throw new Error(`Le mode V2 a modifié la sauvegarde V1 locale: ${JSON.stringify(untouchedLocal.identity)}`);

  const changed=await page.evaluate(()=>{
    const input=[...document.querySelectorAll('#stepContent input')].find(node=>node.value==='Anya Serveur');
    if(!input)return false;
    input.value='Anya Modifiée';
    input.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  });
  if(!changed)throw new Error('Champ Nom introuvable dans le Builder V2.');

  await page.locator('#saveBtn').click();
  await page.waitForFunction(()=>window.TUCV2Bridge?.version===8,null,{timeout:10000});

  if(!savedPayload)throw new Error('Aucun PATCH personnage observé.');
  if(savedPayload.version!==7)throw new Error(`Version optimiste incorrecte: ${savedPayload.version}`);
  if(savedPayload.name!=='Anya Modifiée')throw new Error(`Nom serveur non synchronisé: ${savedPayload.name}`);
  if(savedPayload.data?.identity?.name!=='Anya Modifiée')throw new Error('characters.data ne contient pas le nouvel état du Builder.');

  if(errors.length)throw new Error(errors.join(' | '));
  console.log('Builder V2 bridge smoke OK — PostgreSQL prioritaire sur localStorage, chargement et sauvegarde versionnée validés.');
} finally {
  await context.close();
  await browser.close();
}
