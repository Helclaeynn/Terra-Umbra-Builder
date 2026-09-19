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

const bulkMediaIds=[
  "equipement-002-owl-ka-73-last-encounter",
  "equipement-003-phoenix-pck-08-feather",
  "equipement-004-phoenix-ba-037-sun-axe",
  "equipement-005-raven-cl-038-claymore",
  "equipement-006-raven-sp-016-raven-spear",
  "equipement-007-raven-tm-028-riot-control",
  "equipement-008-owl-ts-009-sun-wukong",
  "equipement-009-phoenix-pw-026-vampire-killer",
  "equipement-010-raven-mc-025-hitman",
  "equipement-018-owl-pp-014-old-colt",
  "equipement-019-raven-pp-012-defender",
  "equipement-020-owl-lp-019-acceptable",
  "equipement-021-raven-lp-004-sturdy",
  "equipement-022-phoenix-lp-028-sun-blast",
  "equipement-023-owl-hp-104-deputy",
  "equipement-024-raven-hp-014-pacificateur",
  "equipement-025-raven-hp-067-gardien",
  "equipement-026-phoenix-hp-028-violator",
  "equipement-027-phoenix-hp-092-depliant",
  "equipement-028-owl-mgp-062-suppressor",
  "equipement-029-raven-mgp-072-military",
  "equipement-030-phoenix-mgp-042-equalizer",
  "equipement-031-owl-lmg-092-gladius",
  "equipement-032-phoenix-lmg-018-urban",
  "equipement-033-raven-lmg-027-executionner",
  "equipement-034-raven-lmg-072-neo-executionner",
  "equipement-083-raven-black-feathers",
  "equipement-084-owl-bullets-fear",
  "equipement-085-phoenix-sun-shield",
  "equipement-086-byron-punk-life",
  "equipement-087-raven-black-dog",
  "equipement-088-phoenix-silver-knight",
  "equipement-089-owl-new-guard",
  "equipement-090-byron-king-worker-vii",
  "equipement-091-raven-gallowglass-ii-legere",
  "equipement-092-phoenix-skylord-iii",
  "equipement-093-owl-night-guard",
  "equipement-094-raven-gallowglass-ii-lourde",
  "equipement-095-phoenix-sun-king",
  "equipement-096-owl-moon-guard",
  "equipement-097-bridgeelectrics-no-fire",
  "equipement-098-ocean-master-free-fly",
  "equipement-099-icecorps-santa-clothes",
  "equipement-100-biosun-medicarmor",
  "equipement-264-flak-cannon-prototype",
  "equipement-265-sheer-blueshell-a-prototype",
  "equipement-266-charm-prototype",
  "equipement-267-armcannon-prototype",
  "equipement-268-raven-sehdia-railway-to-hell-prototype",
  "equipement-269-phoenix-vader-prototype",
  "equipement-270-raven-ravenegg",
  "equipement-271-phoenix-inferno",
  "equipement-272-owl-dripper",
  "equipement-273-phoenix-helios-ii",
  "equipement-274-owl-superchoc",
  "equipement-275-biosun-frog-egg",
  "equipement-276-byron-pokeball",
  "equipement-277-owl-vending-machine",
  "equipement-278-jagi",
  "equipement-279-shadow-gift",
  "equipement-280-raven-bomberman",
  "equipement-281-phoenix-easter-bunny",
  "equipement-282-phoenix-king-fist",
  "equipement-284-mary-antoinette",
  "equipement-285-pierrette",
  "equipement-286-byron-melinette",
  "equipement-287-stretchy",
  "equipement-296-biosun-pandemic",
  "equipement-297-sunways-savior-dgr",
  "equipement-298-disease",
  "equipement-300-phoenix-redcrush",
  "equipement-301-raven-painkiller",
  "equipement-302-sunways-hornetouch",
  "equipement-303-biosun-blastard-injector",
  "equipement-304-bi",
  "equipement-305-sfu-nebullar",
  "equipement-306-monarch-surge",
  "equipement-307-bibal",
  "equipement-309-owl-apex",
  "equipement-310-byron-jeanette",
  "equipement-311-jotkka",
  "equipement-312-raven-sehdia-pacificateur-x",
  "equipement-313-eolgul-e",
  "equipement-314-phoenix-sunnyroshima",
  "equipement-315-reminiscer-prototype",
  "equipement-316-oblivion-prototype",
  "equipement-317-zeus-prototype",
  "equipement-318-dracula-prototype"
];

const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
try{
  await page.goto(`${base}compendium/index.html`,{waitUntil:'domcontentloaded',timeout:30000});
  const bulkFailures=await page.evaluate(async ids=>{
    const mod=await import('./manual-media.js?v=20260918-bulk1');
    const failures=[];
    for(const id of ids){
      const media=mod.manualArticleMedia(id);
      const expected=`images/manual/${id}.webp`;
      if(!media?.src?.includes(expected)){failures.push(`${id}: mapping ${media?.src||'absent'}`);continue;}
      const state=await new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({ok:true,w:img.naturalWidth,h:img.naturalHeight});img.onerror=()=>resolve({ok:false,w:0,h:0});img.src=media.src;});
      if(!state.ok||state.w<1||state.h<1)failures.push(`${id}: image non décodée ${state.w}x${state.h}`);
    }
    return failures;
  },bulkMediaIds);
  if(bulkFailures.length)throw new Error(`Bulk manual media failures: ${bulkFailures.join(' | ')}`);
  console.log(`BULK MEDIA OK — ${bulkMediaIds.length} médias manuels mappés et décodés.`);
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
  await page.waitForFunction(()=>location.hash.startsWith('#/family/'),null,{timeout:10000});
  await page.waitForFunction(()=>document.querySelector('.family-grid'),null,{timeout:20000});
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
  const hrefs=await page.locator('.family-grid .family-card').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')||''));
  for(const id of expectedAssaultIds){if(!hrefs.some(href=>href.includes(id)))throw new Error(`Tag Fusils d’assaut: entrée absente ${id}`);}
  const familyTitle=(await page.locator('.family-page-head h1').textContent())?.trim();
  if(familyTitle!=='Armement — Fusils d’assaut')throw new Error(`Titre famille inattendu: ${familyTitle}`);
  console.log(`FAMILY PAGE OK — Armement — Fusils d’assaut retrouve les ${expectedAssaultIds.length} entrées attendues.`);
  await page.goto(`${base}compendium/index.html#/article/equipement-288-sal-in`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('.breadcrumbs').waitFor({state:'visible',timeout:10000});
  if(!(await page.locator('.breadcrumbs').textContent())?.includes('Armement — Fusils d’assaut'))throw new Error('Breadcrumb Sal-in incomplet');
  if(await page.locator('.related-grid .family-card').count()<1)throw new Error('Voir aussi enrichi absent sur Sal-in');
  await page.goto(`${base}compendium/index.html#/search?q=Sal-in`,{waitUntil:'domcontentloaded',timeout:30000});
  const salInResult=page.locator('.search-result-media[href*="equipement-288-sal-in"]').first();
  await salInResult.waitFor({state:'visible',timeout:10000});
  const searchThumb=salInResult.locator('.search-thumb img').first();
  await searchThumb.waitFor({state:'visible',timeout:10000});
  const thumbState=await searchThumb.evaluate(img=>({complete:img.complete,w:img.naturalWidth,h:img.naturalHeight}));
  if(!thumbState.complete||thumbState.w<1||thumbState.h<1)throw new Error(`Miniature recherche invalide ${JSON.stringify(thumbState)}`);
  console.log('NAV COMFORT OK — breadcrumb, famille, Voir aussi et miniature de recherche.');
  await page.goto(`${base}compendium/index.html#/article/equipement-027-phoenix-hp-092-depliant`,{waitUntil:'domcontentloaded',timeout:30000});
  const folded=page.locator('.article-gallery img[src*="equipement-027-phoenix-hp-092-depliant--folded.webp"]').first();
  await folded.waitFor({state:'visible',timeout:10000});
  const foldedState=await folded.evaluate(img=>({complete:img.complete,w:img.naturalWidth,h:img.naturalHeight}));
  if(!foldedState.complete||foldedState.w<1||foldedState.h<1)throw new Error(`Galerie Depliant invalide ${JSON.stringify(foldedState)}`);
  await page.goto(`${base}compendium/index.html#/media-audit`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('.media-audit-stats').waitFor({state:'visible',timeout:20000});
  console.log('GALLERY/AUDIT OK — variante Depliant décodée et rapport médias rendu.');


} finally {await browser.close();}
