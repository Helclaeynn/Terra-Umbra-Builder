import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const consoleErrors=[];
page.on('console',message=>{if(message.type()==='error'&&!message.text().startsWith('Failed to load resource:'))consoleErrors.push(message.text());});
page.on('pageerror',error=>consoleErrors.push(error.message));

try{
  await page.goto(`${base}compendium/#/category/${encodeURIComponent('Personnages')}`,{waitUntil:'domcontentloaded',timeout:30000});
  const firstCard=page.locator('.article-card').first();
  await firstCard.waitFor({timeout:30000});await firstCard.click();
  await page.locator('#main .page-head h1').waitFor({timeout:30000});
  const originalTitle=(await page.locator('#main .page-head h1').innerText()).trim();

  const editButton=page.locator('#tucEditPage');await editButton.waitFor({state:'visible'});await editButton.click();
  const dialog=page.locator('dialog.editor-dialog');await dialog.waitFor({state:'visible'});
  const beforeSections=await dialog.locator('.editor-section').count();
  await dialog.getByRole('button',{name:'+ Ajouter une section'}).click();
  const section=dialog.locator('.editor-section').nth(beforeSections);await section.waitFor();

  await section.getByRole('button',{name:'+ Image',exact:true}).waitFor({timeout:10000});
  await section.getByRole('button',{name:'+ Portrait',exact:true}).waitFor({timeout:10000});
  await section.getByRole('button',{name:'+ Image',exact:true}).click();
  const block=section.locator('.editor-block[data-inline-media-editor="1"][data-inline-media-kind-block="image"]').last();
  await block.waitFor({timeout:10000});

  const pcPicker=block.locator('[data-inline-media-pc-picker]');
  await pcPicker.waitFor({state:'visible',timeout:10000});
  await pcPicker.getByText('Image locale',{exact:true}).waitFor();
  const initialPick=pcPicker.getByRole('button',{name:'Sélectionner une image depuis le PC'});
  await initialPick.waitFor({state:'visible'});
  if(await block.locator('[data-inline-media-src]').isVisible())throw new Error('Le chemin technique du média est encore visible au lieu du sélecteur PC.');

  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAGCAYAAADkOT91AAAAFklEQVR4nGOsCDjxnwEJMDGgAWoIAAAAZwKbcqkHXQAAAABJRU5ErkJggg==','base64');
  await block.locator('[data-inline-media-file]').setInputFiles({name:'smoke-image.png',mimeType:'image/png',buffer:png});
  await block.locator('[data-inline-media-status]').filter({hasText:'WebP local prêt'}).waitFor({timeout:15000});
  await pcPicker.getByRole('button',{name:'Remplacer l’image depuis le PC'}).waitFor({timeout:10000});
  await pcPicker.getByText('Fichier sélectionné : smoke-image.png',{exact:true}).waitFor({timeout:10000});

  const storedPath=await block.locator('[data-inline-media-src]').inputValue();
  if(!/^images\/manual\/.*-image-.*\.webp$/.test(storedPath))throw new Error(`Chemin WebP inattendu: ${storedPath}`);
  await block.locator('[data-inline-media-alt]').fill('Image de smoke test');
  await block.locator('[data-inline-media-caption]').fill('Image intégrée de test');
  const encodedBeforeSave=await block.locator('[data-field="block-text"]').inputValue();
  if(!encodedBeforeSave.includes('@@TUC_INLINE_MEDIA_V1@@')||!encodedBeforeSave.includes('Image intégrée de test'))throw new Error(`Bloc média non synchronisé avant sauvegarde: ${encodedBeforeSave}`);

  const smokeTitle=`${originalTitle} [SMOKE]`;await dialog.locator('input[name="title"]').fill(smokeTitle);
  await dialog.locator('[data-action="save"]').click();await dialog.waitFor({state:'detached'});
  await page.locator('.editor-state-badge').filter({hasText:'Brouillon local'}).waitFor({timeout:10000});
  await page.waitForTimeout(500);

  const diagnostics=await page.evaluate(()=>{
    let drafts={};try{drafts=JSON.parse(localStorage.getItem('tuc-compendium-drafts-v1')||'{}');}catch{}
    return {
      draft:JSON.stringify(drafts),
      figures:[...document.querySelectorAll('#main .content-inline-media')].map(n=>({cls:n.className,text:n.textContent,src:n.querySelector('img')?.getAttribute('src')})),
      paragraphs:[...document.querySelectorAll('#main p.body-p')].map(n=>n.textContent).filter(t=>t.includes('TUC_INLINE')||t.includes('Image intégrée')),
      previewHtml:document.querySelector('#main [data-editor-preview="sections"]')?.innerHTML?.slice(0,4000)||''
    };
  });
  const rendered=page.locator('#main .content-inline-media.image').filter({hasText:'Image intégrée de test'});
  if(await rendered.count()===0)throw new Error(`Bloc Image absent après sauvegarde. Diagnostics: ${JSON.stringify(diagnostics)}`);
  await rendered.first().waitFor({state:'visible'});
  if((await rendered.first().locator('img').getAttribute('alt'))!=='Image de smoke test')throw new Error('Alt du bloc Image non conservé.');

  await editButton.click();
  const reopened=page.locator('dialog.editor-dialog');await reopened.waitFor({state:'visible'});
  const reopenedBlock=reopened.locator('.editor-block[data-inline-media-editor="1"][data-inline-media-kind-block="image"]').last();
  await reopenedBlock.waitFor({timeout:10000});
  const reopenedPicker=reopenedBlock.locator('[data-inline-media-pc-picker]');
  await reopenedPicker.waitFor({state:'visible',timeout:10000});
  await reopenedPicker.getByRole('button',{name:'Remplacer l’image depuis le PC'}).waitFor({timeout:10000});
  await reopenedPicker.getByText('Fichier sélectionné : smoke-image.png',{exact:true}).waitFor({timeout:10000});
  if(await reopenedBlock.locator('[data-inline-media-src]').isVisible())throw new Error('Le chemin technique réapparaît à la réouverture.');
  if(await reopenedBlock.locator('[data-inline-media-src]').inputValue()!==storedPath)throw new Error('Chemin média perdu à la réouverture.');
  if(await reopenedBlock.locator('[data-inline-media-caption]').inputValue()!=='Image intégrée de test')throw new Error('Légende média perdue à la réouverture.');
  if(await reopenedBlock.locator('[data-field="block-text"]').isVisible())throw new Error('Le bloc Image redevient visuellement un paragraphe.');

  await reopened.locator('[data-action="discard"]').click();await reopened.waitFor({state:'detached'});
  await page.waitForFunction(expected=>document.querySelector('#main .page-head h1')?.textContent?.trim()===expected,originalTitle,{timeout:10000});
  if(consoleErrors.length)throw new Error(`Erreurs navigateur: ${consoleErrors.join(' | ')}`);
  console.log(`Browser smoke OK: ${originalTitle} · bloc Image avec sélecteur PC dédié, WebP, sauvegarde, rendu et réouverture validés.`);
} finally {await browser.close();}