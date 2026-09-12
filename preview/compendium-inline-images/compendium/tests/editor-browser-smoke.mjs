import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const consoleErrors=[];
const httpErrors=[];
page.on('console',message=>{
  if(message.type()!=='error')return;
  const text=message.text();
  if(text.startsWith('Failed to load resource:'))return;
  consoleErrors.push(text);
});
page.on('pageerror',error=>consoleErrors.push(error.message));
page.on('response',response=>{
  if(response.status()<400)return;
  const url=response.url();
  if(/\/favicon\.ico(?:\?|$)/.test(url))return;
  httpErrors.push(`${response.status()} ${url}`);
});

try{
  await page.goto(`${base}compendium/#/home`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('#main .page-head h1').filter({hasText:'Compendium'}).waitFor({timeout:30000});
  const homeText=await page.locator('#main').innerText();
  if(!homeText.includes('519 entrées'))throw new Error('Le Compendium n’affiche pas les 519 entrées attendues.');

  await page.goto(`${base}compendium/#/category/${encodeURIComponent('Personnages')}`,{waitUntil:'domcontentloaded'});
  const firstCard=page.locator('.article-card').first();
  await firstCard.waitFor({timeout:30000});
  await firstCard.click();
  await page.locator('#main .page-head h1').waitFor({timeout:30000});
  const originalTitle=(await page.locator('#main .page-head h1').innerText()).trim();
  if(!originalTitle)throw new Error('Titre de PNJ introuvable.');

  const editButton=page.locator('#tucEditPage');
  await editButton.waitFor({state:'visible',timeout:10000});
  await editButton.click();
  const dialog=page.locator('dialog.editor-dialog');
  await dialog.waitFor({state:'visible',timeout:30000});
  await dialog.locator('input[name="pnj_age"]').waitFor();
  await dialog.getByRole('button',{name:'Choisir une image du PC'}).waitFor({timeout:10000});

  const titleInput=dialog.locator('input[name="title"]');
  if((await titleInput.inputValue()).trim()!==originalTitle)throw new Error('Le titre initial n’est pas chargé dans l’éditeur.');

  const beforeSections=await dialog.locator('.editor-section').count();
  await dialog.getByRole('button',{name:'+ Ajouter une section'}).click();
  await dialog.locator('.editor-section').nth(beforeSections).waitFor();
  const addedSection=dialog.locator('.editor-section').nth(beforeSections);
  await addedSection.getByRole('button',{name:'+ Tableau'}).waitFor({timeout:10000});
  await addedSection.getByRole('button',{name:'+ Tableau'}).click();
  await addedSection.locator('.editor-block[data-type="table"]').waitFor();

  const addType=addedSection.locator('[data-inline-add-type]');
  await addType.waitFor({timeout:10000});
  await addType.selectOption('portrait');
  await addedSection.getByRole('button',{name:'+ Paragraphe'}).click();
  const mediaBlock=addedSection.locator('.editor-block[data-inline-media-editor="1"]').last();
  await mediaBlock.waitFor({timeout:10000});
  if(await mediaBlock.locator('[data-inline-media-kind]').inputValue()!=='portrait')throw new Error('Le nouveau bloc média n’est pas de type Portrait.');
  const smokeImage='data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2216%22%3E%3Crect%20width=%2212%22%20height=%2216%22%20fill=%22%23999%22/%3E%3C/svg%3E';
  await mediaBlock.locator('[data-inline-media-src]').fill(smokeImage);
  await mediaBlock.locator('[data-inline-media-alt]').fill('Portrait de smoke test');
  await mediaBlock.locator('[data-inline-media-caption]').fill('Portrait intégré de test');

  if(beforeSections>0){
    await addedSection.locator('[data-order-kind="section"][data-order-direction="up"]').click();
    const sectionTitles=await dialog.locator('.editor-section [data-field="section-title"]').evaluateAll(nodes=>nodes.map(node=>node.value));
    if(sectionTitles.at(-1)==='Nouvelle section')throw new Error('Le contrôle de réordonnancement de section n’a pas déplacé la section.');
  }

  const smokeTitle=`${originalTitle} [SMOKE]`;
  await titleInput.fill(smokeTitle);
  await dialog.locator('[data-action="save"]').click();
  await dialog.waitFor({state:'detached',timeout:10000});
  await page.locator('.editor-state-badge').filter({hasText:'Brouillon local'}).waitFor({timeout:10000});
  if((await page.locator('#main .page-head h1').innerText()).trim()!==smokeTitle)throw new Error('La prévisualisation du brouillon ne reflète pas le nouveau titre.');
  const renderedPortrait=page.locator('#main .content-inline-media.portrait').filter({hasText:'Portrait intégré de test'});
  await renderedPortrait.waitFor({timeout:10000});
  if((await renderedPortrait.locator('img').getAttribute('alt'))!=='Portrait de smoke test')throw new Error('Le texte alternatif du portrait intégré n’est pas rendu.');

  await editButton.click();
  const reopened=page.locator('dialog.editor-dialog');
  await reopened.waitFor({state:'visible',timeout:30000});
  if((await reopened.locator('input[name="title"]').inputValue()).trim()!==smokeTitle)throw new Error('Le brouillon n’est pas rechargé dans l’éditeur.');
  const reopenedMedia=reopened.locator('.editor-block[data-inline-media-editor="1"]').last();
  await reopenedMedia.waitFor({timeout:10000});
  if(await reopenedMedia.locator('[data-inline-media-kind]').inputValue()!=='portrait')throw new Error('Le type Portrait n’est pas conservé à la réouverture.');
  if(await reopenedMedia.locator('[data-inline-media-caption]').inputValue()!=='Portrait intégré de test')throw new Error('La légende du bloc Portrait n’est pas conservée.');
  await reopened.locator('[data-action="discard"]').click();
  await reopened.waitFor({state:'detached',timeout:10000});
  await page.waitForFunction(expected=>document.querySelector('#main .page-head h1')?.textContent?.trim()===expected,originalTitle,{timeout:10000});
  await page.waitForFunction(()=>!document.querySelector('.editor-state-badge'),null,{timeout:10000});

  const draftCount=await page.evaluate(()=>{
    try{return Object.keys(JSON.parse(localStorage.getItem('tuc-compendium-drafts-v1')||'{}')).length;}catch{return -1;}
  });
  if(draftCount!==0)throw new Error(`Le brouillon de smoke test n’a pas été supprimé (${draftCount}).`);
  const draftsButton=page.locator('#tucDraftsButton');
  await draftsButton.waitFor({state:'visible'});
  if(!(await draftsButton.innerText()).includes('(0)'))throw new Error('Le compteur de brouillons n’est pas revenu à zéro.');

  if(httpErrors.length)throw new Error(`Ressources HTTP en erreur:\n${httpErrors.join('\n')}`);
  if(consoleErrors.length)throw new Error(`Erreurs JavaScript navigateur détectées:\n${consoleErrors.join('\n')}`);
  console.log(`Browser smoke OK: ${originalTitle} · édition, tableau, ordre, bloc Portrait, brouillon et suppression validés.`);
} finally {
  await browser.close();
}
