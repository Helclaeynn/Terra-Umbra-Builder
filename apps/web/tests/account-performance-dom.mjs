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
    b.onLoad({ filter: /(CharactersPanel|AccountLastReading|SharedCharacterSheets|AccountCampaigns)\.vue$/ }, () => ({ contents: 'export default { template: "<section>Personnages</section>" }', loader: 'js' }));
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
const vc=new VirtualConsole();const errors=[];vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM('<!doctype html><div id="app"></div>',{url:'https://test.invalid/account',runScripts:'outside-only',virtualConsole:vc});
const w=dom.window;w.Headers=Headers;
const user={id:'owner',role:'player',displayName:'Compte de test',email:'test@example.invalid'};
const calls=[];
let releaseMe=null, failLogout=false;
w.fetch=async(url,options={})=>{
  calls.push({url,...options});
  // Secondary requests never finish: the account must still become usable.
  if(['/api/health','/api/auth/setup-status','/api/auth/capabilities'].includes(url))return new Promise(()=>{});
  if(url==='/api/auth/me'&&releaseMe===true)return new Promise(resolve=>{releaseMe=()=>resolve({ok:true,json:async()=>({user})});});
  if(url==='/api/auth/me')return {ok:true,json:async()=>({user})};
  if(url==='/api/auth/gm-request')return {ok:true,json:async()=>({request:null})};
  if(url==='/api/auth/logout')return {ok:!failLogout,status:failLogout?500:200,json:async()=>failLogout?{error:'logout_failed'}:{ok:true}};
  throw new Error('Unexpected fetch '+url);
};
w.eval(bundle.outputFiles[0].text);
const logout=()=>[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Déconnexion');
await until(()=>logout());
assert.ok(w.document.querySelector('.account-grid'),'Identity is not blocked by secondary requests');
assert.equal(calls.find(c=>c.url==='/api/auth/me').cache,'no-store');
failLogout=true;logout().click();await until(()=>w.document.querySelector('[role=alert]'));
assert.ok(logout(),'A failed server logout must keep the signed-in state');
failLogout=false;releaseMe=true;w.dispatchEvent(new w.Event('focus'));
await until(()=>typeof releaseMe==='function');
const meCount=calls.filter(c=>c.url==='/api/auth/me').length;
logout().click();await until(()=>!logout());
assert.equal(calls.filter(c=>c.url==='/api/auth/me').length,meCount,'No redundant identity round trip after logout');
releaseMe();await wait(20);
assert.equal(logout(),undefined,'Late focus response must not restore the logged-out account');
assert.equal(w.document.querySelector('.account-grid'),null);
assert.deepEqual(errors,[]);w.unmount();w.close();
console.log('ACCOUNT PERFORMANCE OK — identity independent of secondary requests, no redundant logout fetch, failure preserved, late response cannot restore private UI');
