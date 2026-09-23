import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const bundle = await build({
  stdin: { resolveDir: root, loader: 'ts', contents: `
    import { createApp } from 'vue';
    import { createRouter, createMemoryHistory } from 'vue-router';
    import Account from './src/App.vue';
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: Account }] });
    const app = createApp(Account).use(router);
    router.push('/account').then(() => { app.mount('#app'); });
    window.unmount = () => app.unmount();
  ` },
  bundle: true, write: false, format: 'iife', platform: 'browser',
  define: { 'process.env.NODE_ENV': '"test"', __VUE_OPTIONS_API__: 'true', __VUE_PROD_DEVTOOLS__: 'false', __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false' },
  plugins: [{ name: 'vue', setup(b) {
    b.onLoad({ filter: /CharactersPanel\.vue$/ }, () => ({ contents: 'export default { template: "<section>Personnages</section>" }', loader: 'js' }));
    b.onLoad({ filter: /\.vue$/ }, async ({ path: filename }) => {
      const { descriptor, errors } = parse(await readFile(filename, 'utf8'), { filename });
      assert.equal(errors.length, 0);
      if (!descriptor.script && !descriptor.scriptSetup) {
        const compiled = compileTemplate({ source: descriptor.template.content, filename, id: 'gm-test' });
        assert.equal(compiled.errors.length, 0);
        return { contents: `${compiled.code}\nexport default { render };`, loader: 'ts', resolveDir: path.dirname(filename) };
      }
      return { contents: compileScript(descriptor, { id: 'gm-test', inlineTemplate: true }).content, loader: 'ts', resolveDir: path.dirname(filename) };
    });
  } }]
});
const wait = ms => new Promise(r => setTimeout(r, ms));
async function until(predicate) {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await wait(5); }
  assert.ok(predicate(), 'UI did not reach the expected state');
}
const fixture = { id: 'request-1', userId: 'player', comment: '<script>alert(1)</script>', status: 'pending', createdAt: '2026-09-23T10:00:00Z', decidedAt: null, displayName: 'Joueur test', email: 'player@example.invalid', active: true, role: 'player' };
async function mount(role = 'player', initial = null) {
  const state = { role, request: initial, requests: [structuredClone(fixture)], calls: [], confirm: true, failLoad: false };
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  vc.on('error', e => errors.push(String(e)));
  const dom = new JSDOM('<!doctype html><div id="app"></div>', { url: 'https://test.invalid/account', runScripts: 'outside-only', virtualConsole: vc });
  const w = dom.window;
  w.Headers = Headers;
  w.confirm = () => state.confirm;
  w.fetch = async (url, options = {}) => {
    const method = options.method || 'GET', payload = options.body && JSON.parse(options.body);
    state.calls.push({ url, method, payload });
    let body, status = 200;
    if (url === '/api/health') body = { status: 'ok' };
    else if (url === '/api/auth/setup-status') body = { setupRequired: false };
    else if (url === '/api/auth/capabilities') body = { passwordResetAvailable: true };
    else if (url === '/api/auth/me') body = { user: { id: role, role: state.role, displayName: 'Test', email: 'test@example.invalid' } };
    else if (url === '/api/auth/gm-request' && method === 'GET') {
      if (state.failLoad) { status = 500; body = {}; } else body = { request: state.request };
    }
    else if (url === '/api/auth/gm-request' && method === 'POST') {
      await wait(15); state.request = { ...fixture, comment: payload.comment }; body = { request: state.request }; status = 201;
    }
    else if (url === '/api/admin/gm-requests') body = { requests: state.requests };
    else if (url === '/api/admin/users') body = { users: [] };
    else if (url === '/api/admin/audit') body = { events: [] };
    else if (url.endsWith('/decision')) { state.requests = []; body = {}; }
    else throw new Error(`Unexpected request ${method} ${url}`);
    return { ok: status < 400, status, json: async () => body };
  };
  w.eval(bundle.outputFiles[0].text);
  const panel = () => w.document.querySelector('.gm-access-panel');
  await until(() => panel() && panel().getAttribute('aria-busy') === 'false');
  return { w, state, panel, errors, close() { w.unmount(); dom.window.close(); } };
}

const player = await mount();
assert.match(player.panel().textContent, /secrets de l’univers et aux outils MJ/);
const textarea = player.panel().querySelector('textarea');
textarea.value = 'Je prépare une campagne'; textarea.dispatchEvent(new player.w.Event('input', { bubbles: true }));
player.panel().querySelector('form').dispatchEvent(new player.w.Event('submit', { bubbles: true, cancelable: true }));
await until(() => player.panel().querySelector('button[type=submit]')?.disabled);
await until(() => /En attente de validation/.test(player.panel().textContent));
assert.equal(player.panel().querySelector('textarea'), null);
assert.equal(player.state.calls.filter(c => c.method === 'POST').length, 1);
assert.equal(player.state.calls.find(c => c.method === 'POST').payload.comment, 'Je prépare une campagne');
player.state.role = 'gm'; player.state.request.status = 'approved';
player.w.dispatchEvent(new player.w.Event('focus'));
await until(() => /te donne déjà l’accès MJ/.test(player.panel().textContent));
assert.equal(player.panel().querySelector('form'), null);
assert.deepEqual(player.errors, []); player.close();

const rejected = await mount('player', { ...fixture, status: 'rejected', decidedAt: fixture.createdAt });
assert.match(rejected.panel().textContent, /a été refusée/);
assert.ok(rejected.panel().querySelector('form'));
rejected.state.failLoad = true; rejected.w.dispatchEvent(new rejected.w.Event('focus'));
await until(() => /Impossible de charger/.test(rejected.panel().textContent));
assert.equal(rejected.panel().querySelector('form'), null, 'Do not allow blind requests after a loading error');
rejected.state.failLoad = false; rejected.w.dispatchEvent(new rejected.w.Event('focus'));
await until(() => rejected.panel().querySelector('form'));
assert.deepEqual(rejected.errors, []); rejected.close();

for (const decision of ['Accepter', 'Refuser']) {
  const admin = await mount('admin');
  assert.match(admin.w.document.querySelector('.gm-notification').textContent, /1 demande MJ en attente/);
  assert.equal(admin.panel().querySelector('script'), null, 'Comments must be escaped');
  const action = [...admin.panel().querySelectorAll('button')].find(b => b.textContent === decision);
  admin.state.confirm = false; action.click(); await wait(10);
  assert.equal(admin.state.calls.filter(c => c.method === 'POST').length, 0);
  admin.state.confirm = true; action.click();
  await until(() => /Aucune demande en attente/.test(admin.panel().textContent));
  assert.equal(admin.state.calls.find(c => c.method === 'POST').payload.decision, decision === 'Accepter' ? 'approved' : 'rejected');
  assert.match(admin.w.document.querySelector('.gm-notification').textContent, /0 demande MJ en attente/);
  assert.deepEqual(admin.errors, []); admin.close();
}
console.log('GM UI OK — request, pending, refusal, reload, approval, escaped comments, confirmation and admin counter');
