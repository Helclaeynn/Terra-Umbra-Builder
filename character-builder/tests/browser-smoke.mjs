import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1500,height:1100}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',message=>{
  const text=message.text();
  const optionalRemoteTruthFailure=text.startsWith('Chargement V5 Exilés/Extrals TypeError: Failed to fetch');
  if(message.type()==='error'&&!text.startsWith('Failed to load resource:')&&!optionalRemoteTruthFailure)errors.push(`console: ${text}`);
});

async function nav(label){
  const b=page.locator('#stepNav button').filter({hasText:label}).first();
  await b.waitFor({state:'visible',timeout:15000});await b.click();await page.waitForTimeout(100);
}
async function selectContaining(value){
  const sel=page.locator(`#stepContent select:has(option[value="${value}"])`).first();
  await sel.waitFor({state:'visible',timeout:10000});await sel.selectOption(value);await page.waitForTimeout(120);return sel;
}
async function assertReveal(expected,label){
  const reveal=page.locator('#stepContent .t46-reveal-panel');await reveal.waitFor({state:'visible',timeout:10000});
  const text=(await reveal.textContent())||'';
  for(const needle of expected)if(!text.includes(needle))throw new Error(`${label}: panneau Révélation incomplet, manque « ${needle} »\n${text}`);
  if(!/remplace/i.test(text)||!/ne se cumulent/i.test(text))throw new Error(`${label}: règle de remplacement SR/R non explicite\n${text}`);
}

try{
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.TUCRealitySelfTest!==undefined&&window.TUCV9ReconciledAugmentations!==undefined,null,{timeout:30000});
  await page.waitForTimeout(250);
  const startup=await page.evaluate(()=>({self:window.TUCRealitySelfTest,reconciled:window.TUCV9ReconciledAugmentations}));
  if(errors.length)throw new Error(`Erreurs navigateur au chargement: ${errors.join(' | ')} · diagnostics ${JSON.stringify(startup)}`);
  const self=startup.self,rec=startup.reconciled;
  if(rec.installed!==14||rec.total<146)throw new Error(`Réconciliation V9 incomplète: ${JSON.stringify(rec)}`);
  const expectedPrices={
    'augmentation-v9-booster-sensoriel-g1':3000,'augmentation-v9-booster-sensoriel-g2':6000,'augmentation-v9-radar-sonar-g2':7500,
    'augmentation-v9-estomac-blinde-g2':4500,'augmentation-v9-autoinjecteur-g2':2500,'augmentation-v9-cybermain-g1':4000,
    'augmentation-v9-cybermain-g2':10000,'augmentation-v9-scanner-technique-g2':4500,'augmentation-v9-main-gecko-g2':3000,
    'augmentation-v9-cyberpied-g1':4000,'augmentation-v9-cyberpied-g2':10000,'augmentation-v9-ergot-griffes-g1':3500,
    'augmentation-v9-ergot-griffes-g2':5000,'augmentation-v9-pied-gecko-g2':3000
  };
  for(const [id,price] of Object.entries(expectedPrices))if(rec.prices?.[id]!==price)throw new Error(`Prix V9 inattendu ${id}: ${rec.prices?.[id]} au lieu de ${price}`);
  if(!self?.ok)throw new Error(`Auto-test Réalité en échec: ${JSON.stringify(self?.failed||self)}`);
  if((self?.counts?.augmentations||0)<146||(self?.counts?.equipment||0)<261)throw new Error(`Comptages catalogues régressés: ${JSON.stringify(self?.counts)}`);

  const navText=await page.locator('#stepNav').innerText();
  for(const expected of ['Vérité','Équipement','Dépense XP & PTV'])if(!navText.includes(expected))throw new Error(`Étape absente: ${expected}`);

  // Regression: Gouvernementale > Formation publique must expose a real Esprit skill selector including Savoirs.
  await nav('Origine');
  const government=page.locator('#stepContent .p25-choice-card').filter({hasText:'Gouvernementale'}).first();
  await government.waitFor({state:'visible',timeout:10000});await government.click();
  const originTalent=page.locator('#stepContent select').filter({has:page.locator('option[value="formation_publique"]')}).first();
  await originTalent.waitFor({state:'visible',timeout:10000});await originTalent.selectOption('formation_publique');
  const secondary=page.locator('#stepContent .p45-talent-choice select').first();await secondary.waitFor({state:'visible',timeout:10000});
  if(!(await secondary.locator('option').allTextContents()).some(x=>/Savoirs/i.test(x)))throw new Error('Formation publique ne propose pas Savoirs.');

  await nav('Vérité');
  const initie=page.locator('#stepContent select:has(option[value="initie"])').first();if(await initie.count())await initie.selectOption('initie');

  await selectContaining('vampire');await assertReveal(['+1 Vigueur · +1 Volonté','+2 Vigueur · +1 Agilité · +1 Volonté'],'Vampire');
  await selectContaining('mage');await assertReveal(['+1 Esprit · +1 Volonté','+1 Esprit · +2 Volonté'],'Mage');
  await selectContaining('angelus');await selectContaining('kether');await assertReveal(['+1 Volonté · +1 Charisme','+2 Volonté · +1 Charisme'],'Angelus/Kether');
  await selectContaining('aseryn');await selectContaining('hyperboreen');await assertReveal(['+1 Agilité · +1 Vigueur','+2 Agilité · +1 Vigueur'],'Aseryn/Hyperboréen');
  await selectContaining('exile');await selectContaining('thulkar');await assertReveal(['+1 Vigueur','+2 Vigueur · +1 Charisme'],'Exilé/Thulkar');
  await selectContaining('extral');await selectContaining('talass');await assertReveal(['+1 Esprit','+2 Esprit · +1 Agilité'],'Extral/Talass');
  await selectContaining('garou');await assertReveal(['Aucun bonus d’Attribut automatique','Loup : +2 Agilité','Hybride : +3 Vigueur · +2 Agilité'],'Garou');
  await selectContaining('khinae');await selectContaining('renards');await assertReveal(['Animal : +3 Agilité','Hybride : +2 Vigueur · +3 Agilité'],'Khinae/Renard');
  await selectContaining('humain');await assertReveal(['Aucun bonus racial','Humain ne possède pas de forme Révélée propre'],'Humain');

  // Daemon: explicit Divinity stats plus unique, non-template lore even inside a collapsed details group.
  await selectContaining('daemon');await selectContaining('alabor');await assertReveal(['+1 Vigueur · +1 Agilité','+2 Vigueur · +1 Agilité'],'Daemon/Alabor');
  const truthText=(await page.locator('#stepContent').textContent())||'';
  if(!truthText.includes('Main des Eaux')||!truthText.includes('l’eau n’est jamais un décor inerte'))throw new Error('Lore spécifique de Main des Eaux absent : fallback Daemon générique encore actif.');

  await nav('Dépense XP & PTV');
  await page.locator('#stepContent').getByText('Argent, achats & revente',{exact:true}).waitFor({state:'visible',timeout:10000});
  const progressionText=await page.locator('#stepContent').innerText();
  if(!progressionText.includes('50 %')||!progressionText.includes('75 %'))throw new Error('Barème Commerce achat/revente absent de la progression.');

  if(errors.length)throw new Error(`Erreurs navigateur: ${errors.join(' | ')}`);
  console.log(`Builder browser smoke OK — ${self.counts.augmentations} augmentations, ${self.counts.equipment} équipements, 14 prix V9, Formation publique/Savoirs, profils SR/R de toutes les Natures, lore Daemon et économie campagne validés.`);
} finally {await context.close();await browser.close();}
