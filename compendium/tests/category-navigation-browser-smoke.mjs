import fs from 'node:fs';
import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const navigation=JSON.parse(fs.readFileSync('compendium/data/navigation-v1.json','utf8'));
const categories=['Règles','Réalité','Vérité','Équipement & Objets','Personnages','Bestiaire'];
const expectedByCategory=new Map(categories.map(category=>[category,navigation.entries.filter(entry=>entry.category===category).length]));

const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1500,height:1000}});
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().startsWith('Failed to load resource:'))errors.push(`console: ${msg.text()}`)});
page.on('response',response=>{if(response.status()>=400&&response.url().includes('/compendium/')&&!/favicon\.ico(?:\?|$)/i.test(response.url()))errors.push(`http ${response.status()}: ${response.url()}`)});

async function openCategory(category){
  await page.goto(`${base}compendium/#/category/${encodeURIComponent(category)}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hierarchical-category-list .article-card',{timeout:30000});
  const cards=page.locator('.hierarchical-category-list .article-card');
  const count=await cards.count();
  if(count<1)throw new Error(`${category}: aucune carte rendue`);
  return count;
}

try{
  for(const category of categories)await openCategory(category);
  await page.goto(`${base}compendium/#/category/${encodeURIComponent('Vérité')}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hierarchical-category-list .article-card',{timeout:30000});
  const shortcut=page.locator('[data-hunter-shortcut="1"]');
  if(await shortcut.count()!==1)throw new Error('Vérité: raccourci Chasseurs & traditions absent.');
  for(const label of ['Organisations de Chasse','Traditions religieuses de Chasse']){
    if(await page.locator(`.nav-subgroup-title span:text-is("${label}")`).count()!==1)throw new Error(`Vérité: sous-groupe Chasseurs absent: ${label}`);
  }
  const expectedHunters=[
    'L’Association — histoire et réseau de la Chasse',
    'L’Association — Gate of Truth, rangs Hunt et Observateurs',
    'Xenoshield',
    'Chasseurs chrétiens — Ephraïm, Arianwen et Magdalena',
    'Chasseurs musulmans — Roqya et traditions de Chasse',
    'Chasseurs hindouistes — Gourous et traditions divines',
    'Chasseurs shientaoïstes — quatre traditions',
    'Confréries de Chasseurs',
  ];
  const titles=await page.locator('.hierarchical-category-list .article-card h3').allTextContents();
  for(const title of expectedHunters)if(!titles.includes(title))throw new Error(`Vérité: page Chasseurs non rendue: ${title}`);
  await page.locator('[data-hunter-shortcut="1"] a').first().click();
  await page.waitForFunction(()=>location.hash.startsWith('#/family/'),null,{timeout:10000});
  await page.waitForSelector('#main .family-card',{timeout:10000});
  const familyTitles=await page.locator('#main .family-card strong').allTextContents();
  for(const title of expectedHunters.slice(0,3))if(!familyTitles.includes(title))throw new Error(`Famille Organisations de Chasse: page absente ${title}`);
  if(errors.length)throw new Error(`Erreurs navigateur:\n${errors.join('\n')}`);
  console.log('CATEGORY NAV BROWSER OK — 6 rubriques + raccourcis et 8 pages Chasseurs réellement rendues/cliquables.');
}finally{await browser.close()}
