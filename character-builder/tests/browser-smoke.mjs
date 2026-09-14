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
  await b.waitFor({state:'visible',timeout:15000});await b.click();
  await page.waitForTimeout(80);
}
async function selectContaining(value){
  const sel=page.locator(`#stepContent select:has(option[value="${value}"])`).first();
  await sel.waitFor({state:'visible',timeout:10000});await sel.selectOption(value);await page.waitForTimeout(100);return sel;
}

try{
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.TUCRealitySelfTest!==undefined,null,{timeout:30000});
  await page.waitForTimeout(250);
  const startup=await page.evaluate(()=>({self:window.TUCRealitySelfTest,reconciled:window.TUCV9ReconciledAugmentations||null}));
  if(errors.length)throw new Error(`Erreurs navigateur au chargement: ${errors.join(' | ')} · diagnostics ${JSON.stringify(startup)}`);
  const self=startup.self;
  if(!startup.reconciled)throw new Error(`Couche V9 de réconciliation non exécutée: ${JSON.stringify(startup)}`);
  if(startup.reconciled.installed!==14||startup.reconciled.total<146)throw new Error(`Réconciliation V9 incomplète: ${JSON.stringify(startup.reconciled)}`);
  if(!self?.ok)throw new Error(`Auto-test Réalité en échec: ${JSON.stringify(self?.failed||self)}`);
  if((self?.counts?.augmentations||0)<146)throw new Error(`Auto-test non rafraîchi après réconciliation: ${self?.counts?.augmentations} · ${JSON.stringify(startup.reconciled)}`);
  if((self?.counts?.equipment||0)<261)throw new Error(`Catalogue équipement régressé: ${self?.counts?.equipment}`);

  const navText=await page.locator('#stepNav').innerText();
  for(const expected of ['Vérité','Équipement','Dépense XP & PTV'])if(!navText.includes(expected))throw new Error(`Étape absente: ${expected}`);

  // Regression: Gouvernementale > Formation publique must expose a real Esprit skill selector including Savoirs.
  await nav('Origine');
  const government=page.locator('#stepContent .p25-choice-card').filter({hasText:'Gouvernementale'}).first();
  await government.waitFor({state:'visible',timeout:10000});await government.click();
  const originTalent=page.locator('#stepContent select').filter({has:page.locator('option[value="formation_publique"]')}).first();
  await originTalent.waitFor({state:'visible',timeout:10000});await originTalent.selectOption('formation_publique');
  const secondary=page.locator('#stepContent .p45-talent-choice select').first();
  await secondary.waitFor({state:'visible',timeout:10000});
  const secondaryOptions=await secondary.locator('option').allTextContents();
  if(!secondaryOptions.some(x=>/Savoirs/i.test(x)))throw new Error(`Formation publique ne propose pas Savoirs: ${secondaryOptions.join(' | ')}`);

  // Truth: choose Initié, Daemon and Alabor, then verify explicit V/SR/R stat consequences and distinct lore.
  await nav('Vérité');
  const initie=page.locator('#stepContent select:has(option[value="initie"])').first();
  if(await initie.count())await initie.selectOption('initie');
  await selectContaining('daemon');
  await selectContaining('alabor');
  const reveal=page.locator('#stepContent .t46-reveal-panel');
  await reveal.waitFor({state:'visible',timeout:10000});
  const revealText=await reveal.innerText();
  for(const expected of ['Voilé','Semi-Révélé','Révélé','+1 Vigueur · +1 Agilité','+2 Vigueur · +1 Agilité'])if(!revealText.includes(expected))throw new Error(`Panneau Révélation incomplet, manque: ${expected}\n${revealText}`);
  if(!/remplace/i.test(revealText)||!/ne se cumulent/i.test(revealText))throw new Error(`Le non-cumul SR/R n'est pas explicite: ${revealText}`);
  await page.getByText('Main des Eaux',{exact:true}).first().waitFor({state:'visible',timeout:10000});
  const truthText=await page.locator('#stepContent').innerText();
  if(!truthText.includes('l’eau n’est jamais un décor inerte'))throw new Error('Lore spécifique de Main des Eaux absent : fallback Daemon générique encore actif.');

  // Progression: campaign economy is rendered with the agreed Commerce scale.
  await nav('Dépense XP & PTV');
  const economy=page.locator('#stepContent').getByText('Argent, achats & revente',{exact:true});
  await economy.waitFor({state:'visible',timeout:10000});
  const progressionText=await page.locator('#stepContent').innerText();
  if(!progressionText.includes('50 %')||!progressionText.includes('75 %'))throw new Error('Barème Commerce achat/revente absent de la progression.');

  if(errors.length)throw new Error(`Erreurs navigateur: ${errors.join(' | ')}`);
  console.log(`Builder browser smoke OK — ${self.counts.augmentations} augmentations, ${self.counts.equipment} équipements, Formation publique/Savoirs, Daemon Alabor SR/R, lore spécifique et économie campagne validés.`);
} finally {
  await context.close();await browser.close();
}
