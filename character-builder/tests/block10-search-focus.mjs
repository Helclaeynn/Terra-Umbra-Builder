import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1500,height:1100}});
const page=await context.newPage();

async function typeAndKeepFocus(input,text,label){
  await input.focus();
  for(const ch of text){
    await page.keyboard.type(ch);
    await page.waitForTimeout(30);
    const state=await page.evaluate(()=>({
      placeholder:document.activeElement?.getAttribute?.('placeholder')||'',
      value:document.activeElement?.value??null
    }));
    if(!state.placeholder.startsWith('Rechercher'))throw new Error(`${label}: le champ de recherche a perdu le focus après « ${ch} » (${JSON.stringify(state)})`);
  }
  const value=await input.inputValue();
  if(value!==text)throw new Error(`${label}: saisie incomplète, « ${value} » au lieu de « ${text} »`);
}

try{
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.TUCBuilderSeptFixes?.block10SearchFocusFix===true,null,{timeout:30000});
  const equipmentNav=page.locator('#stepNav button').filter({hasText:'Équipement'}).first();
  await equipmentNav.waitFor({state:'visible',timeout:15000});await equipmentNav.click();await page.waitForTimeout(150);

  const equipDetails=page.locator('#stepContent details.r34-catalog-selector').filter({hasText:'Choisir équipement, services & véhicules'}).first();
  await equipDetails.locator('summary').click();
  const equipSearch=equipDetails.locator('input[placeholder="Rechercher équipement, service ou véhicule…"]');
  await equipSearch.waitFor({state:'visible',timeout:10000});
  await typeAndKeepFocus(equipSearch,'Raven','Équipement');
  const equipCount=(await equipDetails.locator('.catalog-count').textContent())||'';
  if(!/entrée\(s\) correspondante\(s\)/.test(equipCount))throw new Error(`Équipement: compteur de résultats absent après recherche (${equipCount})`);

  const augDetails=page.locator('#stepContent details.r34-catalog-selector').filter({hasText:'Choisir des augmentations'}).first();
  await augDetails.locator('summary').click();
  const augSearch=augDetails.locator('input[placeholder="Rechercher une augmentation…"]');
  await augSearch.waitFor({state:'visible',timeout:10000});
  await typeAndKeepFocus(augSearch,'Cyber','Augmentations');
  const augCount=(await augDetails.locator('.catalog-count').textContent())||'';
  if(!/augmentation\(s\) correspondante\(s\)/.test(augCount))throw new Error(`Augmentations: compteur de résultats absent après recherche (${augCount})`);

  console.log('Block 10 search focus OK — équipement et augmentations gardent le focus pendant la saisie.');
} finally {
  await context.close();
  await browser.close();
}
