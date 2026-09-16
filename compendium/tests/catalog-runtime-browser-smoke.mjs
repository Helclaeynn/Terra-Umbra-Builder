import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
const forbidden=[
  /dans les vitrines, ateliers et réseaux spécialisés/i,/il est surtout recherché par/i,/sa présence dit autant du niveau de risque/i,
  /du milieu dans lequel son porteur évolue/i,/effet documenté/i,/montant de référence/i,/tarification indiquée/i,/figure dans la catégorie/i,
  /aucun effet ni propriété supplémentaire/i,/est une prestation plutôt qu[’']un objet/i,/sur le terrain, ses caractéristiques utiles se lisent/i,
  /les caractéristiques retenues donnent notamment/i,/ce n[’']est pas un simple libellé commercial/i,/une fois intégré aux moyens disponibles/i
];
page.on('request',request=>{try{const url=new URL(request.url());if(url.hostname==='cdn.jsdelivr.net')errors.push(`asset CDN interdit: ${request.url()}`);}catch{}});
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().startsWith('Failed to load resource:'))errors.push(`console: ${msg.text()}`);});
page.on('response',response=>{if(response.status()<400)return;const url=response.url();if(url.includes('/compendium/')&&!/favicon\.ico(?:\?|$)/i.test(url))errors.push(`http ${response.status()}: ${url}`);});

const CATALOG_CATEGORY='Équipement & Objets';
const REALITY_SCOPE='Réalité';
async function gotoCategory(category){await page.goto(`${base}compendium/#/category/${encodeURIComponent(category)}`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.article-card',{timeout:20000});}
function visibleCards(){return page.locator('.article-card:visible');}
async function filterCategory(text){const input=page.locator('#categoryFilter');await input.fill(text);await page.waitForTimeout(120);}
async function exactTitleCard(title){const heading=page.locator('.article-card:visible h3').filter({hasText:new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`)});const count=await heading.count();if(count!==1)throw new Error(`${title}: ${count} titre(s) exact(s), attendu 1`);return heading.first().locator('..');}
async function articleLore(label){await page.waitForSelector('#main .article-media img',{timeout:10000});const context=page.locator('#main section#contexte .body-p.lore');await context.first().waitFor({state:'visible',timeout:10000});if(await context.count()!==2)throw new Error(`${label}: deux paragraphes de description attendus`);if(await page.locator('#main .doc-table').count()<1)throw new Error(`${label}: tableau mécanique absent`);const text=(await context.allTextContents()).join(' ');for(const re of forbidden)if(re.test(text))throw new Error(`${label}: ancien faux-lore encore rendu (${re})`);if(/\$/.test(text))throw new Error(`${label}: prix encore recopié dans la description`);return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
async function openExact(title,needles=[]){await gotoCategory(CATALOG_CATEGORY);await filterCategory(`${title} ${REALITY_SCOPE}`);const card=await exactTitleCard(title);await card.click();const text=await articleLore(title);for(const needle of needles){const n=needle.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();if(!text.includes(n))throw new Error(`${title}: détail attendu absent (${needle})`);}return text;}

try{
  await gotoCategory(CATALOG_CATEGORY);
  await filterCategory(`Augmentations ${REALITY_SCOPE}`);
  const augmentationCount=await visibleCards().count();
  if(!augmentationCount||augmentationCount>=146)throw new Error(`Augmentations: ${augmentationCount} pages visibles pour 146 variantes runtime`);
  await filterCategory(`Cybermain ${REALITY_SCOPE}`);const cyberCards=visibleCards();if(await cyberCards.count()!==1)throw new Error(`Cybermain: ${await cyberCards.count()} cartes, attendu 1`);await cyberCards.first().click();await articleLore('Cybermain');
  const headings=(await page.locator('#main .section h2').allTextContents()).map(text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase());
  if(!headings.some(text=>text.includes('generation 1'))||!headings.some(text=>text.includes('generation 2')))throw new Error('Cybermain: Gen.1 et Gen.2 absentes');

  await openExact('Bastion',['mitrailleuse lourde','60 cartouches','bande bastion','appui']);
  await openExact('Bande Bastion',['60 cartouches','mitrailleuse lourde bastion','alimentation']);
  await openExact('2-Fence',['deux agents humanoides','interception','dix minutes','reinitialisation']);
  await openExact('Hellstorm',['gatling lourde','200 coups','suppression']);
  await openExact('Bull Executive',['train de vie aise','abonnement','mobilite']);
  await openExact('Vrai cafe',['grains reellement cultives','rare','statut']);
  await openExact('FaceCaster DFL',['projecteur','holographique','holo']);
  await openExact('Vladic grand/protege',['protection de quartier','pas de bonus de combat']);
  await openExact('Cache improvisee',['dissimulation par abandon/oubli','peu de securite']);

  await gotoCategory(CATALOG_CATEGORY);await filterCategory(`Neuroprogramme ${REALITY_SCOPE}`);const neuroCount=await visibleCards().count();if(neuroCount!==27)throw new Error(`Neuroprogrammes: ${neuroCount} cartes, attendu 27`);
  if(errors.length)throw new Error(`Erreurs navigateur:\n${errors.join('\n')}`);
  console.log(`Browser smoke Réalité V3 OK — rubrique unifiée Équipement & Objets · ${augmentationCount} pages d’augmentations Réalité · Vladic/Cache facts-only · ${neuroCount} Neuroprogrammes · aucun asset jsDelivr.`);
}finally{await browser.close();}
