import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const app=read('compendium/app-v3.js');
const nav=read('compendium/category-navigation.js');
const toc=read('compendium/toc-enhancer.js');
const index=read('compendium/index.html');
const navigation=JSON.parse(read('compendium/data/navigation-v1.json'));

const fail=message=>{throw new Error(message)};

if(!app.includes('class="article-list"')) fail('app-v3.js ne rend plus .article-list sur les catégories.');
if(!app.includes('#/article/${encodeURIComponent(a.id)}')) fail('app-v3.js ne rend plus les cartes en #/article/<id>.');

if(!nav.includes(":scope > .article-list")) fail('category-navigation.js ne cible pas la liste réellement rendue par app-v3.js.');
if(!nav.includes("/^#\\/article\\/(.+)$/")) fail('category-navigation.js ne lit pas les href #/article/<id>.');
if(nav.includes('#category-list')) fail('Ancien sélecteur #category-list réintroduit dans category-navigation.js.');
if(nav.includes('#\\/page\\/')) fail('Ancienne route #/page réintroduite dans category-navigation.js.');

for(const category of ['Règles','Réalité','Vérité']){
  if(!toc.includes(`'${category}'`)) fail(`${category} absent du verrou MANIFEST_NAV_CATEGORIES.`);
}
if(!toc.includes('MANIFEST_NAV_CATEGORIES.has(category)')) fail('toc-enhancer.js ne désactive plus le regroupement legacy sur les catégories hiérarchiques.');
if(toc.includes("'Règles':['Résolution & profil'")) fail('Ancien TOP_ORDER de Règles encore actif.');
if(toc.includes("return['Autres règles']")) fail('Fallback « Autres règles » encore actif.');

if(!index.includes('category-navigation.js?v=20260915-nav2')) fail('Cache-buster nav2 absent pour category-navigation.js.');
if(!index.includes('toc-enhancer.js?v=20260915-nav2')) fail('Cache-buster nav2 absent pour toc-enhancer.js.');

if(navigation?.version!==1||!Array.isArray(navigation.entries)) fail('navigation-v1.json invalide.');
const expected={Règles:247,Réalité:21,Vérité:54};
for(const [category,count] of Object.entries(expected)){
  const rows=navigation.entries.filter(entry=>entry.category===category);
  if(rows.length!==count) fail(`${category}: ${rows.length} entrées de navigation, attendu ${count}.`);
  if(rows.some(entry=>!entry.group||!entry.subgroup||!Number.isFinite(entry.groupOrder)||!Number.isFinite(entry.subgroupOrder)||!Number.isFinite(entry.pageOrder))){
    fail(`${category}: métadonnée de navigation incomplète.`);
  }
}

console.log('CATEGORY NAVIGATION RUNTIME OK — app-v3 ↔ navigation-v1 ↔ renderer contractuel, aucun fallback « Autres règles ».');
