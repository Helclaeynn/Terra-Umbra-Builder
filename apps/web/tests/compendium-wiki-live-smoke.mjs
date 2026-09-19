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
  const sourceId="verite-047-11-garous-loups-descendants-de-khinae";
  await page.goto(`${baseUrl}/compendium?article=${encodeURIComponent(sourceId)}`,{
    waitUntil:"domcontentloaded",
    timeout:30000
  });

  await page.locator(".article-header h1").waitFor({state:"visible",timeout:20000});
  const sourceTitle=(await page.locator(".article-header h1").innerText()).trim();
  if(!sourceTitle)throw new Error("Titre article source absent.");

  const link=page.locator(".article-paragraph a.wiki-link[data-wiki-id]").first();
  await link.waitFor({state:"visible",timeout:20000});

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

  if(browserErrors.length)throw new Error(browserErrors.join("\n"));

  console.log(`WIKI V2 OK — ${sourceTitle} → ${linkedText} → ${previewTitle}`);
}finally{
  await browser.close();
}
