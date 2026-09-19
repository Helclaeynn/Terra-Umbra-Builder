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

const publicContext=await browser.newContext();
const publicPage=await publicContext.newPage();
try{
  await publicPage.goto(baseUrl+"/compendium",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".newcomer-hero").waitFor({state:"visible",timeout:20000});
  const newcomerTitle=(await publicPage.locator(".newcomer-hero h2").innerText()).trim();
  if(newcomerTitle!=="Entrer dans Terra Umbra")throw new Error("Portail nouveau joueur absent: "+newcomerTitle);

  const basics=await publicPage.locator(".newcomer-card").count();
  if(basics<4)throw new Error("Parcours nouveau joueur incomplet: "+basics+" cartes.");

  const searchInput=publicPage.locator('input[aria-label="Recherche dans le Compendium"]');
  await searchInput.fill("Afa");
  const afancSuggestion=publicPage.getByRole("option").filter({hasText:"Afanc"}).first();
  await afancSuggestion.waitFor({state:"visible",timeout:10000});
  await afancSuggestion.click();
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:10000});
  const afancFromSuggestion=(await publicPage.locator(".article-header h1").innerText()).trim();
  if(afancFromSuggestion!=="Afanc")throw new Error("Suggestion Afanc incorrecte: "+afancFromSuggestion);

  await publicPage.goto(baseUrl+"/compendium?article=guide-realite-nouveau-joueur",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  const guideTitle=(await publicPage.locator(".article-header h1").innerText()).trim();
  if(guideTitle!=="Réalité — Guide du nouveau joueur")throw new Error("Guide public inattendu: "+guideTitle);

  await publicPage.goto(baseUrl+"/compendium?article=verite-046-10-vampires",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  await publicPage.getByText("DONNÉES CANONIQUES",{exact:true}).waitFor({state:"visible",timeout:10000});
  await publicPage.getByText("Lecture seule",{exact:true}).waitFor({state:"visible",timeout:10000});
  await publicPage.getByText("DANS LE BUILDER",{exact:true}).waitFor({state:"visible",timeout:10000});
  await publicPage.getByText("Nature",{exact:true}).first().waitFor({state:"visible",timeout:10000});
  await publicPage.getByText("Vérité",{exact:true}).first().waitFor({state:"visible",timeout:10000});

  await publicPage.goto(baseUrl+"/compendium?article=regles-verite-chasseur-lavandieres",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  const hunterHubTitle=(await publicPage.locator(".article-header h1").innerText()).trim();
  if(hunterHubTitle!=="Lavandières — tradition vampirique de Chasse"){
    throw new Error("Hub Talent Chasseur inattendu: "+hunterHubTitle);
  }
  await publicPage.getByText("Lire la souillure",{exact:true}).first().waitFor({state:"visible",timeout:10000});
  const hunterTalentCards=await publicPage.locator(".talent-wiki-card").count();
  if(hunterTalentCards<2)throw new Error("Hub Talent Chasseur incomplet: "+hunterTalentCards+" cartes.");
  const rawHunterDirective=await publicPage.getByText(/\{\{Talents\|group=humain:/).count();
  if(rawHunterDirective)throw new Error("Directive brute visible dans le hub Talent Chasseur.");

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
  const candidates=[
    "verite-048-12-autres-descendants-de-khinae",
    "verite-057-21-les-six-fleaux-et-le-faux-septieme",
    "verite-056-20-corruption",
    "verite-046-10-vampires",
    "verite-050-14-daemons",
    "verite-053-17-exiles-peuples-fonctions-et-traditions",
    "verite-047-11-garous-loups-descendants-de-khinae"
  ];

  let sourceTitle="";
  let link=null;
  let wikiDebug=null;

  for(const sourceId of candidates){
    await page.goto(`${baseUrl}/compendium?article=${encodeURIComponent(sourceId)}`,{
      waitUntil:"domcontentloaded",
      timeout:30000
    });

    await page.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
    sourceTitle=(await page.locator(".article-header h1").innerText()).trim();

    await page.waitForFunction(
      ()=>window.__TUC_WIKI_V2__?.ready!==undefined,
      null,
      {timeout:10000}
    );
    wikiDebug=await page.evaluate(()=>window.__TUC_WIKI_V2__);
    if(!wikiDebug?.ready)throw new Error("Runtime wiki non prêt: "+JSON.stringify(wikiDebug));
    if(!String(wikiDebug.sanity||"").includes("data-wiki-id")){
      throw new Error("Sanity linker sans interlink: "+JSON.stringify(wikiDebug));
    }

    const candidateLink=page.locator(".article-paragraph a.wiki-link[data-wiki-id]").first();
    try{
      await candidateLink.waitFor({state:"visible",timeout:5000});
      link=candidateLink;
      break;
    }catch{}
  }

  if(!link){
    const sample=await page.locator(".article-paragraph").first().innerHTML().catch(()=>"(aucun paragraphe)");
    throw new Error(`Aucun interlink détecté sur les pages de contrôle. HTML exemple: ${sample}. Wiki: ${JSON.stringify(wikiDebug)}. Erreurs: ${browserErrors.join(" | ")}`);
  }

  if(!sourceTitle)throw new Error("Titre article source absent.");

  const targetId=await link.getAttribute("data-wiki-id");
  const linkedText=(await link.innerText()).trim();
  if(!targetId)throw new Error("Interlink sans data-wiki-id.");
  if(!linkedText)throw new Error("Interlink sans libellé.");

  const preview=page.locator(".wiki-hover-preview");
  let previewVisible=false;
  for(let attempt=0;attempt<2&&!previewVisible;attempt+=1){
    await page.mouse.move(2,2);
    await page.waitForTimeout(150);
    await link.hover();
    try{
      await preview.waitFor({state:"visible",timeout:2500});
      previewVisible=true;
    }catch{}
  }
  if(!previewVisible)throw new Error("Aperçu wiki absent après deux survols réels.");

  const previewTitle=(await preview.locator("strong").innerText()).trim();
  const previewText=(await preview.locator("p").innerText()).trim();
  if(!previewTitle)throw new Error("Aperçu wiki sans titre.");
  if(previewText.length<20)throw new Error("Aperçu wiki trop court.");

  await link.click();
  await page.waitForFunction(
    expected=>new URL(location.href).searchParams.get("article")===expected,
    targetId,
    {timeout:10000}
  );

  await page.waitForFunction(
    expected=>document.querySelector(".article-header h1")?.textContent?.trim()===expected,
    previewTitle,
    {timeout:10000}
  );

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

  console.log(`WIKI V2 OK — ${sourceTitle} → ${linkedText} → ${previewTitle} · média + éditeur + registre Talents + source Builder + audit + création OK`);
}finally{
  await browser.close();
}
