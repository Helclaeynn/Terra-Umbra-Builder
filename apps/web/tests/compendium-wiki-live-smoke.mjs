import { chromium } from "playwright-core";

const baseUrl=(process.env.TUC_V2_SMOKE_BASE_URL||"https://dev.terra-umbra.fr").replace(/\/$/,"");
const executablePath=process.env.CHROME_BIN;
const sessionToken=process.env.TUC_SESSION_TOKEN;
const dynamicTalentArticle=process.env.TUC_DYNAMIC_TALENT_ARTICLE||"";

if(!executablePath)throw new Error("CHROME_BIN manquant.");
if(!sessionToken)throw new Error("TUC_SESSION_TOKEN manquant.");

const browser=await chromium.launch({
  headless:true,
  executablePath,
  args:["--no-sandbox"]
});

const perfContext=await browser.newContext();
const perfPage=await perfContext.newPage();
try{
  const compactResponsePromise=perfPage.waitForResponse(
    response=>response.url().includes("/api/compendium/wiki-index?compact=1"),
    {timeout:15000}
  );
  const started=Date.now();
  await perfPage.goto(baseUrl+"/compendium?article=guide-realite-nouveau-joueur",{
    waitUntil:"domcontentloaded",
    timeout:30000
  });
  await perfPage.locator(".article-header h1").waitFor({state:"visible",timeout:10000});
  const articleVisibleMs=Date.now()-started;

  const compactResponse=await compactResponsePromise;
  const compactPayload=await compactResponse.json();
  const compactEntries=compactPayload.entries||[];
  if(compactEntries.length<500)throw new Error("Index wiki actif trop petit: "+compactEntries.length);
  if(compactEntries.some(entry=>entry.category==="OLD")){
    throw new Error("Une archive OLD a fui dans l’index wiki actif.");
  }
  if(compactEntries.some(entry=>"snippet" in entry||"media" in entry)){
    throw new Error("Index wiki compact contient encore snippets ou médias.");
  }
  await perfPage.waitForFunction(()=>window.__TUC_WIKI_V2__?.ready===true,null,{timeout:10000});
  const wikiReadyMs=Date.now()-started;
  console.log(
    `COMPENDIUM PERF — article visible ${articleVisibleMs} ms · wiki prêt ${wikiReadyMs} ms · index compact ${compactEntries.length} entrées`
  );
}finally{
  await perfContext.close();
}

const publicContext=await browser.newContext();
const publicPage=await publicContext.newPage();
try{
  await publicPage.goto(baseUrl+"/",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".newcomer-hero").waitFor({state:"visible",timeout:20000});
  await publicPage.locator(".compendium-topbar .tu-brand-lockup").waitFor({state:"visible",timeout:10000});
  await publicPage.waitForFunction(
    ()=>document.querySelector(".compendium-topbar .tu-brand-lockup")?.naturalWidth>0,
    null,
    {timeout:10000}
  );
  const newcomerTitle=(await publicPage.locator(".newcomer-hero h2").innerText()).trim();
  if(newcomerTitle!=="Entrer dans Terra Umbra")throw new Error("Portail nouveau joueur absent: "+newcomerTitle);

  if(await publicPage.getByRole("button",{name:/Archives · ancien Compendium/}).count()){
    throw new Error("La rubrique OLD ne doit pas être proposée au public.");
  }

  const searchInput=publicPage.locator('input[aria-label="Recherche dans le Compendium"]');
  await searchInput.fill("Afa");
  const afancSuggestion=publicPage.getByRole("option").filter({hasText:"Afanc"}).first();
  await afancSuggestion.waitFor({state:"visible",timeout:10000});
  await afancSuggestion.click();
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:10000});
  const afancFromSuggestion=(await publicPage.locator(".article-header h1").innerText()).trim();
  if(afancFromSuggestion!=="Afanc")throw new Error("Suggestion Afanc incorrecte: "+afancFromSuggestion);

  const rulesChip=publicPage.locator(".category-strip .category-chip").filter({hasText:"Règles"}).first();
  await rulesChip.click();
  await publicPage.waitForURL(
    url=>new URL(url).searchParams.get("category")==="Règles",
    {timeout:20000}
  );
  await publicPage.locator(".category-overview h1").filter({hasText:"Règles"}).waitFor({state:"visible",timeout:20000});
  await publicPage.locator(".compendium-navigation .navigation-group").filter({hasText:"Moteur de jeu"}).first()
    .waitFor({state:"visible",timeout:20000});
  await publicPage.locator(".category-group-card").filter({hasText:"Moteur de jeu"}).first()
    .waitFor({state:"visible",timeout:20000});
  if(await publicPage.locator(".compendium-navigation .result-card").count()){
    throw new Error("Les résultats de recherche ne doivent plus occuper la navigation gauche.");
  }

  await searchInput.fill("Neurodive");
  await searchInput.press("Enter");
  await publicPage.locator(".search-results-main").waitFor({state:"visible",timeout:10000});
  await publicPage.locator(".main-result-card").first().waitFor({state:"visible",timeout:10000});
  await publicPage.locator(".compendium-navigation").waitFor({state:"visible",timeout:10000});

  await publicPage.goto(baseUrl+"/compendium?article=guide-realite-nouveau-joueur",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  const guideTitle=(await publicPage.locator(".article-header h1").innerText()).trim();
  if(guideTitle!=="Réalité — Guide du nouveau joueur")throw new Error("Guide archive inattendu: "+guideTitle);
  await publicPage.getByText("Archive de l’ancien Compendium",{exact:true}).waitFor({state:"visible",timeout:10000});

  await publicPage.goto(baseUrl+"/compendium?article=verite-046-10-vampires",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  await publicPage.getByText("Archive de l’ancien Compendium",{exact:true}).waitFor({state:"visible",timeout:10000});
  await publicPage.getByText("Lecture seule",{exact:true}).waitFor({state:"visible",timeout:10000});

  // Builder provenance belongs to the rebuilt active article, never to its OLD archive.
  await publicPage.goto(baseUrl+"/compendium?article=verite-v7-vampires-civilisation-cours-sangs",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  await publicPage.getByText("DONNÉES CANONIQUES",{exact:true}).waitFor({state:"visible",timeout:10000});
  await publicPage.getByText("DANS LE BUILDER",{exact:true}).waitFor({state:"visible",timeout:10000});
  if(await publicPage.getByText("Archive de l’ancien Compendium",{exact:true}).count()){
    throw new Error("La page Vampire V7 reconstruite ne doit pas être marquée OLD.");
  }

  const truthLoreChecks=[
    ["verite-v7-exiles-peuples-silcenters-traditions","Une société exilée, pas cinq musées","Un catalogue canonique de 184 Talents"],
    ["verite-v7-extrals-gaac-aidh-diasporas","Les Extrals en 2035 — une diaspora récente, déjà divisée","Un catalogue canonique de 161 Talents"],
    ["verite-v7-homo-superior-adrak-profils-rares","Les Arts de Nel’Akna","Repère Builder"],
    ["verite-v7-chasseurs-doctrine-association-traditions","La Californie comme territoire de Chasse","Un catalogue canonique de 266 Talents"],
    ["verite-v7-six-fleaux-sources-rupture","Thul — la Fixation","Les Dons ne sont pas un second catalogue de Compendium"],
    ["verite-v7-delanial-pere-ombre","Le Père de l’Ombre","progression PTV"],
    ["verite-v7-descendants-khinae","Crocodiliens","Catalogue canonique des Talents de Lignée et Sangs vifs"]
  ];
  for(const [articleId,requiredHeading,forbiddenText] of truthLoreChecks){
    await publicPage.goto(baseUrl+"/compendium?article="+encodeURIComponent(articleId),{waitUntil:"domcontentloaded",timeout:30000});
    await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
    await publicPage.getByRole("heading",{name:requiredHeading,exact:true}).waitFor({state:"visible",timeout:10000});
    if(await publicPage.getByText(forbiddenText,{exact:false}).count()){
      throw new Error(articleId+" contient encore du contenu mécanique de lore interdit: "+forbiddenText);
    }
    if(await publicPage.getByText("Archive de l’ancien Compendium",{exact:true}).count()){
      throw new Error(articleId+" est retombé en OLD.");
    }
  }
  console.log("TRUTH LORE LIVE OK — 7 pages sensibles · lore rendu · anciens catalogues absents");

  await publicPage.goto(baseUrl+"/compendium?article=regles-verite-chasseur-lavandieres",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  await publicPage.getByText("Archive de l’ancien Compendium",{exact:true}).waitFor({state:"visible",timeout:10000});
  await publicPage.locator(".talent-wiki-card").first().waitFor({state:"visible",timeout:10000});
  const rawHunterDirective=await publicPage.getByText(/\{\{Talents\|group=humain:/).count();
  if(rawHunterDirective)throw new Error("Directive brute visible dans le hub Talent archivé.");

  if(dynamicTalentArticle){
    await publicPage.goto(baseUrl+"/compendium?article="+encodeURIComponent(dynamicTalentArticle),{waitUntil:"domcontentloaded",timeout:30000});
    await publicPage.getByRole("heading",{name:"Talents dynamiques"}).waitFor({state:"visible",timeout:10000});
    await publicPage.getByRole("heading",{name:"Faveur de la nuit"}).waitFor({state:"visible",timeout:10000});
    await publicPage.getByRole("heading",{name:"Sens du chasseur"}).waitFor({state:"visible",timeout:10000});
    const cards=await publicPage.locator(".talent-wiki-card").count();
    if(cards!==2)throw new Error("Bloc dynamique de Talents inattendu: "+cards+" cartes.");
    const rawDirective=await publicPage.getByText("{{Talents|ids=faveur_de_la_nuit,sens_du_chasseur}}",{exact:true}).count();
    if(rawDirective)throw new Error("Directive Talents brute encore visible.");
  }

  const styleThemes=[
    ["interface-2035","Interface 2035"],
    ["livre-vivant","Livre vivant"],
    ["codex-hybride","Codex hybride"],
    ["dossier-umbra","Dossier Umbra"],
    ["umbra-archive","Umbra Archive"],
    ["umbra-signal","Umbra Signal"],
    ["umbra-signal-final","Umbra Signal Final"]
  ];
  for(const [slug,label] of styleThemes){
    await publicPage.goto(`${baseUrl}/style-lab/${slug}/builder`,{waitUntil:"domcontentloaded",timeout:30000});
    await publicPage.getByRole("heading",{name:label,exact:true}).waitFor({state:"visible",timeout:10000});
    await publicPage.getByRole("heading",{name:"Équipement & patrimoine",exact:true}).waitFor({state:"visible",timeout:10000});
    await publicPage.waitForFunction(
      ()=>[...document.querySelectorAll(".equipment-image img")].every(img=>img.naturalWidth>0),
      null,
      {timeout:10000}
    );

    await publicPage.getByRole("link",{name:"Compendium",exact:true}).click();
    await publicPage.getByRole("heading",{name:"OWL LC-014 Chasseur",exact:true}).waitFor({state:"visible",timeout:10000});
    await publicPage.waitForFunction(
      ()=>document.querySelector(".hero-media img")?.naturalWidth>0,
      null,
      {timeout:10000}
    );
  }
  console.log("STYLE LAB OK — 7 thèmes · Builder + Compendium · médias chargés");

  await publicPage.goto(baseUrl+"/",{waitUntil:"domcontentloaded",timeout:30000});
  const loginLink=publicPage.getByRole("link",{name:"Connexion"});
  await loginLink.waitFor({state:"visible",timeout:10000});
  console.log("WIKI PUBLIC OK — onboarding + suggestions + backlinks Builder + cartes Talents dynamiques sans session");
}finally{
  await publicContext.close();
}

const context=await browser.newContext();
await context.addCookies([{
  name:"__Host-tuc_session",
  value:sessionToken,
  domain:"dev.terra-umbra.fr",
  path:"/",
  secure:true,
  httpOnly:true,
  sameSite:"Lax"
}]);

const page=await context.newPage();
const browserErrors=[];
page.on("pageerror",error=>browserErrors.push("pageerror: "+String(error)));
page.on("console",message=>{
  if(message.type()==="error")browserErrors.push("console: "+message.text());
});

try{
  await page.goto(baseUrl+"/compendium",{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForFunction(()=>window.__TUC_WIKI_V2__?.ready===true,null,{timeout:10000});
  const wikiDebug=await page.evaluate(()=>window.__TUC_WIKI_V2__);
  if(!wikiDebug?.hasAfancTarget)throw new Error("Afanc absent de l’index actif: "+JSON.stringify(wikiDebug));
  if(wikiDebug?.hasLegacyEntry)throw new Error("OLD présent dans l’index actif: "+JSON.stringify(wikiDebug));

  const archiveChip=page.getByRole("button",{name:/Archives · ancien Compendium/});
  await archiveChip.waitFor({state:"visible",timeout:10000});
  await archiveChip.click();
  await page.getByText(/entrées?/).first().waitFor({state:"visible",timeout:10000});
  const archiveResult=page.locator(".result-card").first();
  await archiveResult.waitFor({state:"visible",timeout:10000});

  await page.goto(baseUrl+"/compendium?article=verite-046-10-vampires",{waitUntil:"domcontentloaded",timeout:30000});
  await page.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  await page.getByText("Archive de l’ancien Compendium",{exact:true}).waitFor({state:"visible",timeout:10000});

  await page.goto(`${baseUrl}/compendium?article=bestiaire-v15-afanc`,{
    waitUntil:"domcontentloaded",
    timeout:30000
  });
  await page.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  const afancTitle=(await page.locator(".article-header h1").innerText()).trim();
  if(afancTitle!=="Afanc")throw new Error("Page Afanc inattendue: "+afancTitle);

  const media=page.locator(".wiki-media img");
  await media.waitFor({state:"visible",timeout:10000});
  await page.waitForFunction(
    ()=>document.querySelector(".wiki-media img")?.naturalWidth>0,
    null,
    {timeout:10000}
  );

  const editLink=page.locator(".wiki-edit-link");
  await editLink.waitFor({state:"visible",timeout:10000});
  await editLink.click();
  await page.waitForURL(/\/compendium\/edit\/bestiaire-v15-afanc$/, {timeout:10000});
  await page.getByText("ÉDITION WIKI",{exact:true}).waitFor({state:"visible",timeout:10000});
  await page.locator(".wiki-source").waitFor({state:"visible",timeout:10000});
  const legacySections=await page.locator(".editor-section-card").count();
  if(legacySections!==0)throw new Error("Ancien éditeur par sections encore visible.");

  await page.goto(baseUrl+"/compendium/edit/verite-046-10-vampires",{waitUntil:"domcontentloaded",timeout:30000});
  await page.getByText("SOURCE MÉCANIQUE",{exact:true}).waitFor({state:"visible",timeout:10000});
  await page.getByRole("heading",{name:"Relié au Builder"}).waitFor({state:"visible",timeout:10000});
  await page.getByText("Nature",{exact:true}).first().waitFor({state:"visible",timeout:10000});

  const coverageButton=page.getByRole("button",{name:/Couverture Builder/});
  await coverageButton.click();
  await page.getByRole("heading",{name:"Couverture du Compendium"}).waitFor({state:"visible",timeout:10000});
  await page.getByText(/éléments canoniques/).waitFor({state:"visible",timeout:10000});
  await page.getByRole("button",{name:"Fermer",exact:true}).click();

  await page.goto(baseUrl+"/compendium/new?title=CI%20Builder%20Page&category=R%C3%A8gles&source=Builder%20%C2%B7%20CI&tags=Talent%2CBuilder",{waitUntil:"domcontentloaded",timeout:30000});
  await page.getByText("NOUVELLE PAGE WIKI",{exact:true}).waitFor({state:"visible",timeout:10000});
  await page.locator(".wiki-source").waitFor({state:"visible",timeout:10000});
  const talentButton=page.getByRole("button",{name:"Talents",exact:true});
  await talentButton.waitFor({state:"visible",timeout:10000});
  await talentButton.click();
  await page.getByText("Insérer des Talents dynamiques",{exact:true}).waitFor({state:"visible",timeout:10000});
  await page.getByRole("button",{name:"Annuler",exact:true}).click();

  const newTitle=page.locator('input[placeholder="Titre de la page"]');
  await newTitle.waitFor({state:"visible",timeout:10000});
  if(await newTitle.inputValue()!=="CI Builder Page")throw new Error("Préremplissage titre Builder absent.");
  const categoryValue=await page.getByLabel("Rubrique").inputValue();
  if(categoryValue!=="Règles")throw new Error("Préremplissage rubrique Builder absent: "+categoryValue);
  const sourceValue=await page.getByLabel("Source").inputValue();
  if(sourceValue!=="Builder · CI")throw new Error("Préremplissage source Builder absent: "+sourceValue);

  if(browserErrors.length)throw new Error(browserErrors.join("\n"));

  console.log("WIKI V2 OK — Compendium actif isolé des archives OLD · média + éditeur + registre Talents + source Builder + audit + création OK");
}finally{
  await browser.close();
}
