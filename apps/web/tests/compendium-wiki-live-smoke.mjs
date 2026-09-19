import { chromium } from "playwright-core";

const baseUrl=(process.env.TUC_V2_SMOKE_BASE_URL||"https://dev.terra-umbra.fr").replace(/\/$/,"");
const executablePath=process.env.CHROME_BIN;
const sessionToken=process.env.TUC_SESSION_TOKEN;

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

  const searchInput=publicPage.locator('input[type="search"]');
  await searchInput.fill("Afanc");
  await publicPage.getByRole("button",{name:"Rechercher"}).click();
  await publicPage.locator(".result-card strong",{hasText:"Afanc"}).first().waitFor({state:"visible",timeout:10000});
  const searchTitles=await publicPage.locator(".result-card strong").allInnerTexts();
  if(!searchTitles.some(title=>title.trim()==="Afanc"))throw new Error("Recherche publique Afanc absente: "+searchTitles.join(", "));

  await publicPage.goto(baseUrl+"/compendium?article=guide-realite-nouveau-joueur",{waitUntil:"domcontentloaded",timeout:30000});
  await publicPage.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  const guideTitle=(await publicPage.locator(".article-header h1").innerText()).trim();
  if(guideTitle!=="Réalité — Guide du nouveau joueur")throw new Error("Guide public inattendu: "+guideTitle);

  const loginLink=publicPage.getByRole("link",{name:"Connexion"});
  await loginLink.waitFor({state:"visible",timeout:10000});
  console.log("WIKI PUBLIC OK — onboarding + recherche + guide sans session");
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

  await link.hover();
  const preview=page.locator(".wiki-hover-preview");
  await preview.waitFor({state:"visible",timeout:10000});

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

  await page.goto(baseUrl+"/compendium/new",{waitUntil:"domcontentloaded",timeout:30000});
  await page.getByText("NOUVELLE PAGE WIKI",{exact:true}).waitFor({state:"visible",timeout:10000});
  await page.locator(".wiki-source").waitFor({state:"visible",timeout:10000});
  await page.locator('input[placeholder="Titre de la page"]').waitFor({state:"visible",timeout:10000});

  if(browserErrors.length)throw new Error(browserErrors.join("\n"));

  console.log(`WIKI V2 OK — ${sourceTitle} → ${linkedText} → ${previewTitle} · média + éditeur continu + création OK`);
}finally{
  await browser.close();
}
