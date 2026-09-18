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
  await b.waitFor({state:'visible',timeout:15000});await b.click();await page.waitForTimeout(120);
}
async function selectContaining(value){
  const sel=page.locator(`#stepContent select:has(option[value="${value}"])`).first();
  await sel.waitFor({state:'visible',timeout:10000});await sel.selectOption(value);await page.waitForTimeout(140);return sel;
}
async function assertReveal(expected,label,forbidden=[]){
  const reveal=page.locator('#stepContent .t46-reveal-panel');await reveal.waitFor({state:'visible',timeout:10000});
  const text=(await reveal.textContent())||'';
  for(const needle of expected)if(!text.includes(needle))throw new Error(`${label}: panneau Révélation incomplet, manque « ${needle} »\n${text}`);
  for(const needle of forbidden)if(text.includes(needle))throw new Error(`${label}: valeur obsolète encore présente « ${needle} »\n${text}`);
  if(!/remplace/i.test(text)||!/ne se cumulent/i.test(text))throw new Error(`${label}: règle de remplacement SR/R non explicite\n${text}`);
}
const moneyNumber=text=>Number(String(text||'').replace(/[^\d-]/g,''))||0;

try{
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.TUCRealitySelfTest!==undefined&&window.TUCV9ReconciledAugmentations!==undefined&&window.TUCBuilderSeptFixes?.truthLoreMetaProblems!==undefined,null,{timeout:30000});
  await page.waitForFunction(()=>window.__TUC_APP_READY__===true&&window.__TUC_LATE_STATE_READY__===true,null,{timeout:30000});
  const bootState=await page.evaluate(()=>({booting:document.body.classList.contains('builder-booting'),boot:!!document.getElementById('builderBoot')}));
  if(bootState.booting||bootState.boot)throw new Error(`Écran bootstrap encore visible après chargement complet: ${JSON.stringify(bootState)}`);
  await page.waitForTimeout(250);
  const startup=await page.evaluate(()=>({self:window.TUCRealitySelfTest,reconciled:window.TUCV9ReconciledAugmentations,commerce:window.TUCBuilderSeptFixes.commerce(),loreProblems:window.TUCBuilderSeptFixes.truthLoreMetaProblems(),familyAudit:window.TUCBuilderSeptFixes.equipmentFamilyAudit(),equipmentCategories:window.TUCBuilderSeptFixes.equipmentCategoryList()}));
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
  if(startup.commerce.length!==7||startup.commerce[0].buy!==1||startup.commerce[0].sale!==.5||startup.commerce[1].buy!==.95||startup.commerce[1].sale!==.55||startup.commerce[6].buy!==.70||startup.commerce[6].sale!==.80)throw new Error(`Barème Commerce incorrect: ${JSON.stringify(startup.commerce)}`);
  if(startup.loreProblems.length)throw new Error(`Lore Vérité méta encore présent: ${JSON.stringify(startup.loreProblems.slice(0,12))}`);
  if(startup.familyAudit.broad.length)throw new Error(`Familles d'armes anciennes encore actives: ${JSON.stringify(startup.familyAudit.broad.slice(0,20))}`);
  if(startup.familyAudit.shotguns.length!==4||startup.familyAudit.shotguns.some(x=>x.family!=='Armement — Shotguns'))throw new Error(`Shotguns mal regroupés dans le Builder: ${JSON.stringify(startup.familyAudit.shotguns)}`);
  for(const expected of ['Armement — Shotguns','Armement — Fusils de précision','Armement — Fusils d’assaut','Armement — Pistolets lourds'])if(!startup.equipmentCategories.includes(expected))throw new Error(`Catégorie Builder absente: ${expected}`);


  const navText=await page.locator('#stepNav').innerText();
  for(const expected of ['Vérité','Équipement','Dépense XP & PTV'])if(!navText.includes(expected))throw new Error(`Étape absente: ${expected}`);

  // Gouvernementale > Formation publique: real Esprit selector including Savoirs.
  await nav('Origine');
  let originCard=page.locator('#stepContent .p25-choice-card').filter({hasText:'Gouvernementale'}).first();
  await originCard.waitFor({state:'visible',timeout:10000});await originCard.click();
  let originTalent=page.locator('#stepContent select').filter({has:page.locator('option[value="formation_publique"]')}).first();
  await originTalent.waitFor({state:'visible',timeout:10000});await originTalent.selectOption('formation_publique');
  const secondary=page.locator('#stepContent .p45-talent-choice select').first();await secondary.waitFor({state:'visible',timeout:10000});
  if(!(await secondary.locator('option').allTextContents()).some(x=>/Savoirs/i.test(x)))throw new Error('Formation publique ne propose pas Savoirs.');

  // Religieuse > Discipline de foi must really add +1 Maîtrise spirituelle.
  originCard=page.locator('#stepContent .p25-choice-card').filter({hasText:'Religieuse'}).first();await originCard.click();await page.waitForTimeout(100);
  originTalent=page.locator('#stepContent select').filter({has:page.locator('option[value="discipline_de_foi"]')}).first();await originTalent.selectOption('discipline_de_foi');await page.waitForTimeout(100);
  const faithBonus=await page.evaluate(()=>window.TUCBuilderSeptFixes.skillTalentBonus('maitrise_spirituelle'));
  if(faithBonus!==1)throw new Error(`Discipline de foi non appliquée à Maîtrise spirituelle: +${faithBonus}`);

  await nav('Vérité');
  const initie=page.locator('#stepContent select:has(option[value="initie"])').first();if(await initie.count())await initie.selectOption('initie');

  await selectContaining('vampire');await assertReveal(['+1 Vigueur · +1 Volonté','+2 Vigueur · +1 Volonté'],'Vampire',['+2 Vigueur · +1 Agilité · +1 Volonté']);
  await selectContaining('mage');await assertReveal(['+1 Esprit · +1 Volonté','+1 Esprit · +2 Volonté'],'Mage');
  await selectContaining('angelus');await selectContaining('kether');await assertReveal(['+1 Volonté · +1 Charisme','+2 Volonté · +1 Charisme'],'Angelus/Kether');
  await selectContaining('aseryn');await selectContaining('hyperboreen');await assertReveal(['+1 Agilité · +1 Vigueur','+2 Agilité · +1 Vigueur'],'Aseryn/Hyperboréen');
  await selectContaining('exile');await selectContaining('thulkar');await assertReveal(['+1 Vigueur','+2 Vigueur · +1 Charisme'],'Exilé/Thulkar');
  await selectContaining('extral');await selectContaining('talass');await assertReveal(['+1 Esprit','+2 Esprit · +1 Agilité'],'Extral/Talass');
  await selectContaining('garou');await assertReveal(['Loup : +2 Agilité · morsure DGT 3','Hybride : +3 Vigueur · +2 Agilité · +3 Pugilat · griffes/crocs DGT 5'],'Garou');
  await selectContaining('khinae');await selectContaining('renards');await assertReveal(['Animal : +3 Agilité','Hybride : +2 Vigueur · +3 Agilité'],'Khinae/Renard');

  // A real Human Hunter carries the permanent +1 Volonté in every revelation state and in finalAttr.
  await selectContaining('humain');await selectContaining('doctrine_commune');await assertReveal(['+1 Volonté permanent','aucun bonus SR supplémentaire','aucun bonus R supplémentaire'],'Humain Chasseur');
  const hunterDiag=await page.evaluate(()=>({active:window.TUCBuilderSeptFixes.hunterMemoryActive(),bonus:window.TUCBuilderSeptFixes.hunterVolonteBonus()}));
  if(!hunterDiag.active||hunterDiag.bonus!==1)throw new Error(`Bonus permanent du Chasseur non appliqué: ${JSON.stringify(hunterDiag)}`);

  // Daemon: explicit Divinity stats plus unique lore. Lilith's Fertility & Flesh branch must not fall back to rules commentary.
  await selectContaining('daemon');await selectContaining('alabor');await assertReveal(['+1 Vigueur · +1 Agilité','+2 Vigueur · +1 Agilité'],'Daemon/Alabor');
  let truthText=(await page.locator('#stepContent').textContent())||'';
  if(!truthText.includes('Main des Eaux')||!truthText.includes('l’eau n’est jamais un décor inerte'))throw new Error('Lore spécifique de Main des Eaux absent : fallback Daemon générique encore actif.');
  await selectContaining('lilith');await page.waitForTimeout(120);truthText=(await page.locator('#stepContent').textContent())||'';
  for(const expected of ['Corps souverain','le corps n’est plus une mécanique opaque','Chair féconde','La bénédiction de Lilith peut franchir','Fécondité divine','la fécondité n’est ni une récompense morale'])if(!truthText.includes(expected))throw new Error(`Lore Lilith/Fertilité incomplet: manque « ${expected} »`);
  for(const forbidden of ['ce Talent correspond','effet mécanique décrit','fournit une réponse surnaturelle ou doctrinale'])if(truthText.includes(forbidden))throw new Error(`Lore méta encore visible dans Lilith: « ${forbidden} »`);

  // Campaign economy: no roll = base price, simple success = 5%, ledger survives render,
  // an augmentation can be purchased and resold and both operations modify cash AND the sidebar Compte.
  await nav('Dépense XP & PTV');
  await page.locator('#stepContent').getByText('Argent, achats & revente',{exact:true}).waitFor({state:'visible',timeout:10000});
  const progressionText=await page.locator('#stepContent').innerText();
  if(!progressionText.includes('sans jet, achat à 100 % et revente à 50 %')||!progressionText.includes('réussite simple améliore déjà le prix de 5 points'))throw new Error(`Économie campagne: règle Commerce visible incorrecte\n${progressionText}`);

  const cash0=await page.evaluate(()=>window.TUCBuilderSeptFixes.cash());
  const money=page.locator('#stepContent details').filter({hasText:'Ajouter ou retirer de l’argent'}).first();await money.locator('summary').click();
  await money.locator('input[placeholder="Ex. prime de mission"]').fill('Prime smoke test');
  await money.locator('input[type="number"]').fill('100000');
  await money.getByRole('button',{name:'Enregistrer le mouvement'}).click();await page.waitForTimeout(180);
  const funded=await page.evaluate(()=>({cash:window.TUCBuilderSeptFixes.cash(),summary:window.TUCBuilderSeptFixes.summaryCash()}));
  if(funded.cash!==cash0+100000||moneyNumber(funded.summary)!==funded.cash)throw new Error(`Le mouvement d'argent / résumé ne persiste pas: ${JSON.stringify({cash0,funded})}`);

  const beforeCounts=await page.evaluate(()=>window.TUCBuilderSeptFixes.resaleCounts());
  const buy=page.locator('#stepContent details').filter({hasText:'Acheter en campagne'}).first();
  const kind=buy.locator('.p50-trade-toolbar select');await kind.selectOption('augmentation');
  await buy.locator('.p50-trade-toolbar input').fill('Cybermain');await page.waitForTimeout(100);
  const article=buy.locator('.p50-item-field select');await article.selectOption('augmentation-v9-cybermain-g1');await page.waitForTimeout(80);
  const buyCashBefore=await page.evaluate(()=>window.TUCBuilderSeptFixes.cash());
  await buy.getByRole('button',{name:/Acheter ·/}).click();await page.waitForTimeout(180);
  const afterBuy=await page.evaluate(()=>({cash:window.TUCBuilderSeptFixes.cash(),summary:window.TUCBuilderSeptFixes.summaryCash(),counts:window.TUCBuilderSeptFixes.resaleCounts()}));
  if(afterBuy.cash!==buyCashBefore-4000||moneyNumber(afterBuy.summary)!==afterBuy.cash||afterBuy.counts.augmentations!==beforeCounts.augmentations+1)throw new Error(`Achat augmentation / résumé non comptabilisé: ${JSON.stringify({buyCashBefore,beforeCounts,afterBuy})}`);

  const sell=page.locator('#stepContent details').filter({hasText:'Revendre'}).first();await sell.locator('summary').click();await page.waitForTimeout(60);
  const saleSelect=sell.locator('.p50-item-field select');
  const cyberOption=await saleSelect.locator('option').evaluateAll(opts=>opts.map(o=>({value:o.value,text:o.textContent||''})).find(o=>o.text.includes('Cybermain'))||null);
  if(!cyberOption)throw new Error('Cybermain achetée absente de la liste de revente des augmentations.');
  await saleSelect.selectOption(cyberOption.value);await page.waitForTimeout(60);page.once('dialog',d=>d.accept());
  await sell.getByRole('button',{name:/Revendre ·/}).click();await page.waitForTimeout(180);
  const afterSale=await page.evaluate(()=>({cash:window.TUCBuilderSeptFixes.cash(),summary:window.TUCBuilderSeptFixes.summaryCash(),counts:window.TUCBuilderSeptFixes.resaleCounts()}));
  if(afterSale.cash!==buyCashBefore-2000||moneyNumber(afterSale.summary)!==afterSale.cash||afterSale.counts.augmentations!==beforeCounts.augmentations)throw new Error(`Revente augmentation / résumé non comptabilisée: ${JSON.stringify({buyCashBefore,beforeCounts,afterSale})}`);

  if(errors.length)throw new Error(`Erreurs navigateur: ${errors.join(' | ')}`);
  console.log(`Builder browser smoke OK — ${self.counts.augmentations} augmentations, ${self.counts.equipment} équipements, lore Vérité sans meta-fallback, Lilith/Fertilité spécifique, résumé Compte live, bonus Chasseur/Discipline, Vampire/Garou, Commerce, cash et revente d'augmentation validés.`);
} finally {await context.close();await browser.close();}
