import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createWikiLinker} from '../wiki-links.js';
import {PLAYER_START,WIKI_EXPLICIT_TARGETS} from '../onboarding-data.js';
import {GUIDE_NAVIGATION} from '../guide-articles.js';
import {MANUAL_ARTICLE_MEDIA} from '../manual-media.js';

const navigation=JSON.parse(fs.readFileSync(new URL('../data/navigation-v1.json',import.meta.url),'utf8'));
const entries=[...(Array.isArray(navigation)?navigation:(navigation.entries||[])),...GUIDE_NAVIGATION];
const ids=new Set(entries.map(entry=>entry.id));

const requiredIds=[
  ...PLAYER_START.basics.map(item=>item.id),
  ...PLAYER_START.natures.flatMap(item=>[item.rulesId,item.loreId]),
  ...PLAYER_START.restricted.flatMap(item=>[item.rulesId,item.loreId]),
  ...(PLAYER_START.loreHubs||[]).map(item=>item.id),
  ...Object.values(WIKI_EXPLICIT_TARGETS)
].filter(Boolean);

for(const id of requiredIds)assert.ok(ids.has(id),`Onboarding/wiki target absent de navigation-v1.json: ${id}`);
for(const [id,media] of Object.entries(MANUAL_ARTICLE_MEDIA)){
  assert.ok(ids.has(id),`Média manuel ciblant une page absente: ${id}`);
  assert.ok(media?.src&&!/placeholder/i.test(media.src),`Média manuel invalide pour ${id}`);
  assert.ok(fs.existsSync(new URL('../'+media.src.replace(/^\.\//,''),import.meta.url)),`Fichier média absent pour ${id}: ${media.src}`);
}

const sampleIds=[
  'verite-050-14-daemons',
  'verite-lore-anciennes-divinites',
  'verite-lore-divinite-belial',
  'lore-daemon-temples-temple-belial'
];
const sampleArticles=sampleIds.map(id=>{
  const entry=entries.find(row=>row.id===id);
  assert.ok(entry,`Article de test absent: ${id}`);
  return {id,title:entry.displayTitle||entry.title};
});

const linker=createWikiLinker(sampleArticles,{explicitTargets:{
  Daemons:'verite-050-14-daemons',
  Divinités:'verite-lore-anciennes-divinites',
  Belial:'verite-lore-divinite-belial'
}});

const chain=linker.linkify('Les Daemons servent des Divinités. Belial est ici.');
assert.match(chain,/href="#\/article\/verite-050-14-daemons"[^>]*>Daemons<\/a>/);
assert.match(chain,/href="#\/article\/verite-lore-anciennes-divinites"[^>]*>Divinités<\/a>/);
assert.match(chain,/href="#\/article\/verite-lore-divinite-belial"[^>]*>Belial<\/a>/);

const temple=linker.linkify('Le Temple de Belial possède sa propre page.');
assert.match(temple,/href="#\/article\/lore-daemon-temples-temple-belial"[^>]*>Temple de Belial<\/a>/);

const self=linker.linkify('Belial demeure Belial.','verite-lore-divinite-belial');
assert.doesNotMatch(self,/href="#\/article\/verite-lore-divinite-belial"/);

const escaped=linker.linkify('<script>Belial</script>');
assert.ok(escaped.startsWith('&lt;script&gt;'));
assert.ok(escaped.endsWith('&lt;/script&gt;'));

console.log(`Wiki links OK — ${requiredIds.length} cibles d’onboarding/alias vérifiées, ${Object.keys(MANUAL_ARTICLE_MEDIA).length} médias manuels, ${linker.stats.aliases} alias de test.`);
