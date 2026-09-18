import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const weapons=[
  ['equipement-035-phoenix-ar-124-mutilator','Phoenix AR-124 Mutilator'],
  ['equipement-036-raven-ar-027-rampager','Raven AR-027 Rampager'],
  ['equipement-037-owl-ar-071-howling','Owl AR-071 Howling'],
  ['equipement-038-phoenix-ar-124-sunlight','Phoenix AR-124 Sunlight'],
  ['equipement-039-owl-sr-017-big-game-hunter','Owl SR-017 Big Game Hunter'],
  ['equipement-040-owl-sr-029-hoot','Owl SR-029 Hoot'],
  ['equipement-041-raven-sr-029-deathbringer','Raven SR-029 Deathbringer'],
  ['equipement-042-phoenix-sr-034-phantom','Phoenix SR-034 Phantom'],
  ['equipement-288-sal-in','Sal-in'],
  ['equipement-289-morissette','Morissette'],
  ['equipement-290-biosun-aciditicteeth','Biosun Aciditicteeth'],
  ['equipement-291-tortoise-blastard','Tortoise Blastard'],
  ['equipement-292-song-gos','Song-gos'],
  ['equipement-293-byron-luzette','Byron Luzette'],
  ['equipement-294-abraham-kennedy','Abraham Kennedy'],
  ['equipement-295-raven-sehdia-hellrails','Raven-Sehdia Hellrails']
];

const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
try{
  for(const [id,title] of weapons){
    await page.goto(`${base}compendium/index.html#/article/${encodeURIComponent(id)}`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(expected=>document.querySelector('h1')?.textContent?.includes(expected),title,{timeout:20000});
    const img=page.locator('.article-media img').first();
    await img.waitFor({state:'visible',timeout:10000});
    const state=await img.evaluate(el=>({src:el.getAttribute('src')||'',complete:el.complete,naturalWidth:el.naturalWidth,naturalHeight:el.naturalHeight}));
    const expected=`images/manual/${id}.webp`;
    if(!state.src.includes(expected))throw new Error(`${id}: média inattendu ${state.src}, attendu ${expected}`);
    if(!state.complete||state.naturalWidth<200||state.naturalHeight<50)throw new Error(`${id}: image non décodée ou trop petite ${JSON.stringify(state)}`);
  }
  console.log(`WEAPON MEDIA OK — ${weapons.length} pages affichent leur WebP manuel.`);
  await page.goto(`${base}compendium/index.html#/article/equipement-288-sal-in`,{waitUntil:'domcontentloaded',timeout:30000});
  const familyTag=page.locator('.meta .tag-link',{hasText:'Armement — Fusils d’assaut'}).first();
  await familyTag.waitFor({state:'visible',timeout:10000});
  await familyTag.click();
  await page.waitForFunction(()=>location.hash.startsWith('#/search?q='),null,{timeout:10000});
  await page.waitForFunction(()=>document.querySelector('.search-results'),null,{timeout:20000});
  const expectedAssaultIds=[
    'equipement-035-phoenix-ar-124-mutilator',
    'equipement-036-raven-ar-027-rampager',
    'equipement-037-owl-ar-071-howling',
    'equipement-038-phoenix-ar-124-sunlight',
    'equipement-288-sal-in',
    'equipement-289-morissette',
    'equipement-290-biosun-aciditicteeth',
    'equipement-291-tortoise-blastard'
  ];
  const hrefs=await page.locator('.search-results .search-result').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')||''));
  for(const id of expectedAssaultIds){if(!hrefs.some(href=>href.includes(id)))throw new Error(`Tag Fusils d’assaut: entrée absente ${id}`);}
  console.log(`TAG SEARCH OK — Armement — Fusils d’assaut retrouve les ${expectedAssaultIds.length} entrées attendues.`);

} finally {await browser.close();}
