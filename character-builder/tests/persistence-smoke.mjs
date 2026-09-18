import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1500,height:1000}});
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().startsWith('Failed to load resource:'))errors.push(`console: ${msg.text()}`)});
page.on('response',response=>{if(response.status()>=400&&!/favicon\.ico(?:\?|$)/i.test(response.url()))errors.push(`http ${response.status()}: ${response.url()}`)});

async function clickStep(label){
  const step=page.locator('#stepNav .step-link').filter({hasText:label}).first();
  await step.waitFor({state:'visible',timeout:20000});await step.click();
}
async function stored(){
  return page.evaluate(()=>JSON.parse(localStorage.getItem('tuc-character-builder-v1')||'{}'));
}

try{
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#stepNav .step-link',{timeout:30000});
  await page.evaluate(()=>localStorage.removeItem('tuc-character-builder-v1'));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#stepNav .step-link',{timeout:30000});

  await clickStep('Edge');
  const attrPack=page.locator('.p32-edge-spend').filter({hasText:'+2 Attributs'}).first();
  await attrPack.locator('button[data-dir="1"]').click();
  await page.waitForSelector('.p32-edge-attr',{timeout:10000});
  const attrPlus=page.locator('.p32-edge-attr button[data-dir="1"]').first();
  await attrPlus.click();await attrPlus.click();

  const cashPack=page.locator('.p32-edge-spend').filter({hasText:'+5 000 $ Compte'}).first();
  await cashPack.locator('button[data-dir="1"]').click();

  let saved=await stored();
  if(saved.edge?.attributePack!==1||saved.edge?.cashPacks!==1)throw new Error(`Edge counters non persistés avant reload: ${JSON.stringify(saved.edge)}`);
  const edgeAttrTotal=Object.values(saved.edgeAttributes||{}).reduce((n,v)=>n+Number(v||0),0);
  if(edgeAttrTotal!==2)throw new Error(`Edge Attributes avant reload: ${edgeAttrTotal}, attendu 2`);

  await clickStep('Dépense XP & PTV');
  await page.waitForSelector('.p43-ledger-inputs input',{timeout:10000});
  const inputs=page.locator('.p43-ledger-inputs input');
  await inputs.nth(0).fill('7');await inputs.nth(0).press('Tab');
  await inputs.nth(1).fill('2');await inputs.nth(1).press('Tab');
  saved=await stored();
  if(saved.progression?.xpEarned!==7||saved.progression?.ptvEarned!==2)throw new Error(`Progression non persistée avant reload: ${JSON.stringify(saved.progression)}`);

  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#stepNav .step-link',{timeout:30000});
  saved=await stored();
  if(saved.edge?.attributePack!==1||saved.edge?.cashPacks!==1)throw new Error(`Edge counters perdus après reload: ${JSON.stringify(saved.edge)}`);
  const edgeAttrAfter=Object.values(saved.edgeAttributes||{}).reduce((n,v)=>n+Number(v||0),0);
  if(edgeAttrAfter!==2)throw new Error(`Edge Attributes perdus après reload: ${edgeAttrAfter}, attendu 2`);
  if(saved.progression?.xpEarned!==7||saved.progression?.ptvEarned!==2)throw new Error(`Progression perdue après reload: ${JSON.stringify(saved.progression)}`);

  await clickStep('Edge');
  const cashText=await page.locator('.p32-edge-spend').filter({hasText:'+5 000 $ Compte'}).first().innerText();
  if(!/1\s*\/\s*3/.test(cashText))throw new Error(`UI Edge non restaurée: ${cashText}`);
  await clickStep('Dépense XP & PTV');
  const afterInputs=page.locator('.p43-ledger-inputs input');
  if(await afterInputs.nth(0).inputValue()!=='7'||await afterInputs.nth(1).inputValue()!=='2')throw new Error('UI XP/PTV non restaurée après reload');

  if(errors.length)throw new Error(`Erreurs navigateur:\n${errors.join('\n')}`);
  console.log('BUILDER PERSISTENCE OK — Edge counters + Edge Attributes + XP/PTV survivent à un reload réel.');
}finally{await browser.close()}
