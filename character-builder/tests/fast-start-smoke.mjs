import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1400,height:1000}});
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',message=>{
  const value=message.text();
  if(message.type()==='error'&&!value.startsWith('Failed to load resource:')&&!value.startsWith('Chargement V5 Exilés/Extrals'))errors.push(`console: ${value}`);
});

try{
  await page.route('**/character-builder/app.parts/*.txt',async route=>{
    await new Promise(resolve=>setTimeout(resolve,2400));
    await route.continue();
  });

  const started=Date.now();
  await page.goto(`${base}character-builder/`,{waitUntil:'commit',timeout:30000});
  const fastName=page.locator('[data-fast-identity="name"]');
  await fastName.waitFor({state:'visible',timeout:1800});
  const fastElapsed=Date.now()-started;
  const shellState=await page.evaluate(()=>({
    shellVisible:getComputedStyle(document.querySelector('.shell')).visibility!=='hidden'&&getComputedStyle(document.querySelector('.shell')).display!=='none',
    nav:document.querySelectorAll('#stepNav .step-link').length,
    summaryVisible:!!document.querySelector('.summary-card')&&getComputedStyle(document.querySelector('.summary-card')).display!=='none',
    active:document.querySelector('#stepNav .step-link.active')?.textContent||''
  }));
  if(!shellState.shellVisible||shellState.nav!==12||!shellState.summaryVisible||!/Identité/.test(shellState.active))throw new Error(`UI complète absente pendant le fast-start: ${JSON.stringify(shellState)}`);
  const early=await page.evaluate(()=>({fast:window.__TUC_FAST_IDENTITY_READY__===true,full:window.__TUC_APP_READY__===true,late:window.__TUC_LATE_STATE_READY__===true}));
  if(!early.fast||early.full||early.late)throw new Error(`Fast-start non isolé du chargement lourd: ${JSON.stringify(early)}`);

  await fastName.fill('Alicia Fastboot');
  await page.locator('[data-fast-identity="age"]').fill('31 ans');
  await page.locator('[data-fast-identity="concept"]').fill('Messagère de test pendant le chargement');
  await page.locator('[data-fast-identity="objective"]').fill('Préserver les saisies du fast-start');

  const storedDuring=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuc-character-builder-v1')||'{}').identity||{});
  if(storedDuring.name!=='Alicia Fastboot'||storedDuring.age!=='31 ans'||!/Messagère/.test(storedDuring.concept||''))throw new Error(`Saisie fast-start non persistée immédiatement: ${JSON.stringify(storedDuring)}`);

  await page.waitForFunction(()=>window.__TUC_APP_READY__===true&&window.__TUC_LATE_STATE_READY__===true,null,{timeout:45000});
  await page.waitForSelector('#stepContent input[placeholder="Nom du personnage"]',{state:'visible',timeout:10000});
  const restored={
    name:await page.locator('#stepContent input[placeholder="Nom du personnage"]').inputValue(),
    age:await page.locator('#stepContent input[placeholder="Ex. 34 ans"]').inputValue(),
    concept:await page.locator('#stepContent input[placeholder*="ancienne enquêtrice"]').inputValue(),
    objective:await page.locator('#stepContent input[placeholder*="retrouver son frère"]').inputValue()
  };
  if(restored.name!=='Alicia Fastboot'||restored.age!=='31 ans'||!/Messagère/.test(restored.concept)||!/Préserver/.test(restored.objective))throw new Error(`Saisie fast-start perdue à la réhydratation: ${JSON.stringify(restored)}`);

  const boot=await page.evaluate(()=>({booting:document.body.classList.contains('builder-booting'),boot:!!document.getElementById('builderBoot')}));
  if(boot.booting||boot.boot)throw new Error(`Bootstrap encore présent après chargement complet: ${JSON.stringify(boot)}`);
  if(errors.length)throw new Error(errors.join(' | '));
  console.log(`BUILDER FAST START OK — identité utilisable en ${fastElapsed} ms pendant que les 97 fragments sont retardés, saisie réhydratée sans perte.`);
}finally{await browser.close()}
