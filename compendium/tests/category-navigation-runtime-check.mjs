import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const app=read('compendium/app-v3.js');
const nav=read('compendium/category-navigation.js');
const toc=read('compendium/toc-enhancer.js');
const index=read('compendium/index.html');
const navigation=JSON.parse(read('compendium/data/navigation-v1.json'));
const fail=message=>{throw new Error(message)};
const hierarchical=['Règles','Réalité','Vérité','Équipement & Objets','Personnages','Bestiaire'];

if(!app.includes("const CATEGORY_ORDER=['Règles','Réalité','Vérité','Équipement & Objets','Personnages','Bestiaire']"))fail('app-v3.js ne porte plus les 6 rubriques book-first canoniques.');
if(!app.includes('class="article-list"'))fail('app-v3.js ne rend plus .article-list sur les catégories.');
if(!app.includes('#/article/${encodeURIComponent(a.id)}'))fail('app-v3.js ne rend plus les cartes en #/article/<id>.');
if(!nav.includes(":scope > .article-list:not(.hierarchical-category-list)"))fail('category-navigation.js ne cible pas la liste réellement rendue.');
if(!nav.includes("/^#\\/article\\/(.+)$/"))fail('category-navigation.js ne lit pas les href #/article/<id>.');
if(!nav.includes('cloneNode(true)'))fail('Le renderer ne reconstruit plus les cartes cliquables par clonage.');
if(!nav.includes('root.replaceWith(wrap)'))fail('Le renderer ne remplace plus la liste source par la hiérarchie.');
if(!nav.includes("current==='chasseurs traditions'"))fail('La hiérarchie explicite Chasseurs & traditions n’est plus préservée au runtime.');
if(!nav.includes("current==='corruption fleaux'"))fail('La hiérarchie explicite Corruption & Fléaux n’est plus préservée au runtime.');
if(!nav.includes("card.hidden=!ok"))fail('Le filtre hiérarchique n’agit plus sur les cartes rendues.');
if(nav.includes('#category-list'))fail('Ancien sélecteur #category-list réintroduit.');
if(nav.includes('#\\/page\\/'))fail('Ancienne route #/page réintroduite.');
for(const category of hierarchical)if(!nav.includes(`'${category}'`))fail(`${category} absent du verrou SUPPORTED de category-navigation.js.`);
if(!toc.includes('MANIFEST_NAV_CATEGORIES.has(category)'))fail('toc-enhancer.js ne désactive plus le regroupement legacy lorsque le manifeste pilote la rubrique.');
if(toc.includes("return['Autres règles']"))fail('Fallback « Autres règles » encore actif.');
if(!index.includes('category-navigation.js?v='))fail('Cache-buster absent pour category-navigation.js.');
if(!index.includes('toc-enhancer.js?v='))fail('Cache-buster absent pour toc-enhancer.js.');
if(navigation?.version!==3||!Array.isArray(navigation.entries))fail('navigation-v1.json n’est pas en version 3.');
if(JSON.stringify(navigation.categories)!==JSON.stringify(hierarchical))fail(`Rubriques navigation V3 invalides: ${JSON.stringify(navigation.categories)}`);
for(const category of hierarchical){
  const rows=navigation.entries.filter(entry=>entry.category===category);
  if(!rows.length)fail(`${category}: aucune entrée de navigation.`);
  if(rows.some(entry=>!entry.group||!entry.subgroup||!Number.isFinite(entry.groupOrder)||!Number.isFinite(entry.subgroupOrder)||!Number.isFinite(entry.pageOrder)))fail(`${category}: métadonnée incomplète.`);
}
console.log('CATEGORY NAVIGATION RUNTIME OK — 6 rubriques book-first, cartes clonées/cliquables, filtre rebouclé.');
