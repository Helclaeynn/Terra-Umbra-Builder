import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { PDFDocument, PDFTextField } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// Run against Vite dev or preview. No private/live API is called and no printer is used.
// Optional portable runtime: PLAYWRIGHT_MODULE=/absolute/path/playwright-core/index.mjs
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright-core');
const root = new URL('../', import.meta.url);
const output = new URL('node_modules/.cache/pdf-browser/', root);
await mkdir(output, { recursive: true });
const source = await readFile(new URL('tests/builder-v2-smoke.mjs', root), 'utf8');
const fixtureSource = source.slice(source.indexOf('const skillIds='), source.indexOf('const browser='));
const { characterData, rules, lore, edgeRules, realityRules } = new Function(fixtureSource + '\nreturn { characterData, rules, lore, edgeRules, realityRules };')();
const canonBundle = new URL('canon.mjs', output);
await build({ stdin: { resolveDir: fileURLToPath(root), loader: 'ts', contents: "export { terraUmbraTruthRules as canon } from '../api/src/rules/truth/rules';" }, bundle: true, outfile: fileURLToPath(canonBundle), format: 'esm', platform: 'node' });
const { canon } = await import(canonBundle.href);
const manifest = JSON.parse(await readFile(new URL('public/pdf/dossiers/manifest.json', root), 'utf8'));
const baseFieldCount = manifest.fields.realite.length + manifest.fields.angelus.length;
const metricsDoc = await PDFDocument.create(); metricsDoc.registerFontkit(fontkit);
const metricsFont = await metricsDoc.embedFont(await readFile(new URL('public/pdf/fonts/DejaVuSans.ttf', root)), { subset: false });
const id = '11111111-1111-4111-8111-111111111111';
const data = structuredClone(characterData);
data.identity.firstName = 'Sauvee'; data.identity.name = 'Fiche';
data.identity.notes = 'Texte long conserve dans les annexes. '.repeat(120);
data.truth = { ...data.truth, nature: 'angelus', consciousness: 'initie', choices: { angelNature: 'trone', sephirah: 'kether', archangel: 'remiel', seraph: 'purim' }, truthTalents: [], corruptionTalents: [] };
data.progression = { xpEarned: 100, ptvEarned: 8, attributeRanks: { vigueur: 1 }, skillRanks: { constitution: 1 }, realityTalents: [], truthTalents: [], corruptionTalents: [], cashBase: 100, cashTransactions: [] };
const before = JSON.stringify(data), writes = [], errors = [], downloads = [];
const baseUrl = process.env.TUC_PDF_BROWSER_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN, args: ['--no-sandbox'] });
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
await context.addInitScript(() => { window.print = () => { window.__pdfPrintInvoked = (window.__pdfPrintInvoked || 0) + 1; }; });
context.on('page', page => page.on('pageerror', error => errors.push(String(error))));
await context.route('**/api/**', async route => {
  const request = route.request(), pathname = new URL(request.url()).pathname;
  if (!pathname.startsWith('/api/')) return route.continue(); // Vite imports shared apps/api source modules through /@fs/.
  const send = value => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(value) });
  if (!['GET', 'HEAD'].includes(request.method())) { writes.push({ method: request.method(), pathname }); return route.fulfill({ status: 409, contentType: 'application/json', body: '{"error":"export_must_not_save"}' }); }
  const character = { id, name: 'Sauvee Fiche', data, version: 7, createdAt: new Date(0).toISOString(), updatedAt: new Date(0).toISOString() };
  if (pathname === `/api/characters/${id}`) return send({ character });
  if (pathname === `/api/characters/${id}/sheet`) return send({ character, canEdit: true, ownerName: 'PDF Test' });
  if (pathname === `/api/characters/${id}/readers`) return send({ readers: [] });
  if (pathname === '/api/rulesets/terra-umbra/creation') return send({ rules, lore, edgeRules, talentChoiceSpecs: {}, skillTalentMap: { expertise_smoke: 'athletisme' }, disadvantages: { common: [], attribute: [], sphere: { crawler: [] } }, disadvantageLore: {} });
  if (pathname === '/api/rulesets/terra-umbra/truth') return send(canon);
  if (pathname === '/api/rulesets/terra-umbra/reality') return send(realityRules);
  if (pathname === '/api/auth/me') return send({ user: { id: 'pdf-user', displayName: 'PDF Test', email: 'pdf@example.invalid', role: 'player' } });
  if (pathname === '/api/auth/setup-status') return send({ setupRequired: false });
  if (pathname === '/api/auth/capabilities') return send({ passwordResetAvailable: false });
  if (pathname === '/api/auth/gm-request') return send({ request: null });
  if (pathname.startsWith('/api/compendium/wiki-preview/')) return send({ media: null });
  if (pathname === '/api/compendium/search') return send({ total: 0, items: [] });
  if (pathname === '/api/compendium/contact-npcs') return send({ total: 0, items: [] });
  return send({ items: [], entries: [], accounts: [], campaigns: [], recentItems: [] });
});

async function loadPage(route, ready) {
  const page = await context.newPage();
  await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
  await page.locator(ready).waitFor({ timeout: 30000 });
  await page.waitForFunction(() => { const button = [...document.querySelectorAll('.character-pdf-actions button')].find(button => button.textContent.includes('Exporter')); return button && !button.disabled; }, { timeout: 30000 });
  return page;
}
async function downloadFrom(page, locator, name) {
  const pending = page.waitForEvent('download', { timeout: 60000 });
  await locator.click();
  const download = await pending;
  assert.equal(await download.failure(), null);
  const path = new URL(name + '.pdf', output);
  await download.saveAs(fileURLToPath(path));
  const bytes = await readFile(path), pdf = await PDFDocument.load(bytes);
  downloads.push({ name, suggestedFilename: download.suggestedFilename(), bytes: bytes.length, pages: pdf.getPageCount(), fields: pdf.getForm().getFields().length });
  return pdf;
}
async function exportPdf(page, name, expectedName, expectedPv, expectedXp) {
  const pdf = await downloadFrom(page, page.getByRole('button', { name: 'Exporter la fiche de personnage en PDF', exact: true }), name);
  const form = pdf.getForm();
  assert.ok(pdf.getPageCount() >= 4, 'Nature dossier retains four base pages');
  assert.ok(form.getFields().length > baseFieldCount, 'Download retains base AcroForm fields and editable annexes');
  assert.equal(form.getTextField('reality.nom').getText(), expectedName);
  assert.equal(form.getTextField('truth.identity.name').getText(), expectedName);
  assert.equal(form.getTextField('reality.pv_max').getText(), String(expectedPv));
  assert.equal(form.getTextField('reality.xp_disponibles').getText(), String(expectedXp));
  assert.equal(form.getTextField('reality.pv_actuels').getText() || '', '');
  assert.equal(form.getCheckBox('truth.state.V').isChecked(), false);
  assert.ok(form.getFields().some(field => field.getName().startsWith('annex.')), 'Long notes are retained in editable annexes');
  for (const field of form.getFields()) {
    if (!(field instanceof PDFTextField) || !field.isMultiline() || !field.getText()) continue;
    const appearance = field.acroField.getDefaultAppearance() || '';
    const size = Number([...appearance.matchAll(/\/[^\s]+\s+([0-9.]+)\s+Tf/g)].at(-1)?.[1]);
    assert.ok(size > 0, `Missing appearance font size on ${field.getName()}`);
    const rect = field.acroField.getWidgets()[0].getRectangle();
    const lineHeight = metricsFont.heightAtSize(size) * 1.2;
    const required = field.getText().split('\n').length * lineHeight;
    assert.ok(required <= rect.height - 3 + 0.1, `${field.getName()} multiline appearance clips: ${required.toFixed(2)}pt in ${(rect.height - 3).toFixed(2)}pt`);
  }
  assert.equal(await page.locator('.character-pdf-actions [role=alert]').count(), 0);
  return pdf;
}

try {
  const builder = await loadPage(`/characters/${id}/builder`, '.builder-workspace');
  await builder.locator('.identity-grid label').filter({ has: builder.locator('input') }).nth(0).locator('input').fill('Brouillon');
  await builder.locator('.identity-grid label').filter({ has: builder.locator('input') }).nth(1).locator('input').fill('Éléonore');
  await exportPdf(builder, 'builder-draft', 'Éléonore Brouillon', 6, 0);
  assert.match(await builder.locator('.character-pdf-actions [role=status]').innerText(), /non enregistrés/);
  console.log('PASS Builder: actual unsaved draft download, Unicode name, creation values, editable annexes');

  const progression = await loadPage(`/characters/${id}/progression`, '.progression-step');
  const xp = progression.getByLabel('XP reçus depuis la création', { exact: true });
  await xp.fill('160'); await xp.blur();
  await exportPdf(progression, 'progression-draft', 'Sauvee Fiche', 9, 145);
  console.log('PASS Progression: actual unsaved XP download and campaign attributes');

  const sheet = await loadPage(`/characters/${id}/sheet`, '.character-sheet');
  await exportPdf(sheet, 'sheet-saved', 'Sauvee Fiche', 9, 85);
  assert.equal(writes.length, 0, 'Exports never save or mutate server state');
  assert.equal(JSON.stringify(data), before, 'Original saved fixture unchanged');
  console.log('PASS Standalone sheet: saved campaign values, no write request');

  const popupEvent = sheet.waitForEvent('popup');
  await sheet.getByRole('button', { name: 'Imprimer la fiche de personnage', exact: true }).click();
  const popup = await popupEvent;
  await popup.getByRole('link', { name: 'Télécharger le PDF d’impression', exact: true }).waitFor({ timeout: 60000 });
  assert.match(await popup.locator('iframe').getAttribute('src'), /^blob:/);
  assert.equal(await popup.getByRole('button', { name: 'Imprimer le dossier', exact: true }).count(), 1);
  const printed = await downloadFrom(popup, popup.getByRole('link', { name: 'Télécharger le PDF d’impression', exact: true }), 'print-popup');
  assert.equal(printed.getForm().getFields().length, 0, 'Print copy is flattened');
  assert.ok(printed.getPageCount() >= 4);
  console.log('PASS Print popup: real PDF viewer, print toolbar, downloadable flattened copy');
  await popup.close();

  await sheet.evaluate(() => { window.open = () => null; });
  await sheet.getByRole('button', { name: 'Imprimer la fiche de personnage', exact: true }).click();
  await sheet.getByText(/La fenêtre a été bloquée/).waitFor({ timeout: 60000 });
  const fallback = await downloadFrom(sheet, sheet.getByRole('link', { name: 'Télécharger le dernier PDF préparé', exact: true }), 'print-blocked-fallback');
  assert.equal(fallback.getForm().getFields().length, 0);
  console.log('PASS Popup blocked: explicit fallback link downloads the correct print PDF');

  await sheet.route('**/pdf/dossiers/*.pdf', route => route.fulfill({ status: 404, contentType: 'text/plain', body: 'unavailable test asset' }));
  await sheet.getByRole('button', { name: 'Exporter la fiche de personnage en PDF', exact: true }).click();
  await sheet.locator('.character-pdf-actions [role=alert]').getByText(/indisponible/).waitFor({ timeout: 30000 });
  assert.equal(await sheet.getByRole('button', { name: 'Exporter la fiche de personnage en PDF', exact: true }).isEnabled(), true);
  await sheet.unroute('**/pdf/dossiers/*.pdf');
  console.log('PASS Missing template: readable error and export buttons reenabled');

  for (const page of [builder, progression, sheet]) {
    await page.setViewportSize({ width: 320, height: 900 });
    const bounds = await page.locator('.character-pdf-actions').evaluate(node => ({ left: node.getBoundingClientRect().left, right: node.getBoundingClientRect().right, viewport: document.documentElement.clientWidth }));
    assert.ok(bounds.left >= -1 && bounds.right <= bounds.viewport + 1, 'PDF actions fit mobile viewport');
  }
  assert.deepEqual(errors, [], 'No browser exceptions');
  await writeFile(new URL('report.json', output), JSON.stringify({ status: 'passed', downloads, apiWrites: writes, browserErrors: errors }, null, 2));
  console.log('PDF BROWSER OK — all three real UI exports, unsaved state, editable PDF values, print popup, blocked-popup fallback, missing-asset recovery, 320px controls');
} catch (error) {
  await writeFile(new URL('failure.json', output), JSON.stringify({ error: String(error), downloads, writes, errors }, null, 2));
  for (const [index, page] of context.pages().entries()) await page.screenshot({ path: fileURLToPath(new URL(`failure-${index}.png`, output)), fullPage: false }).catch(() => {});
  throw error;
} finally {
  await context.close(); await browser.close();
}
