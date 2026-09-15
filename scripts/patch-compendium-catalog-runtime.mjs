import fs from 'node:fs';

const file='compendium/app-v3.js';
let text=fs.readFileSync(file,'utf8');
const oldOrder="const CATEGORY_ORDER=['Règles','Réalité','Vérité','Organisations','Personnages','Bestiaire'];";
const newOrder="const CATEGORY_ORDER=['Règles','Réalité','Équipement','Augmentations','Vérité','Organisations','Personnages','Bestiaire'];";
if(text.includes(oldOrder))text=text.replace(oldOrder,newOrder);
else if(!text.includes(newOrder))throw new Error('CATEGORY_ORDER inattendu');

const oldDesc="function categoryDescription(c){return c==='Règles'?'Moteur commun, combat, santé, ressources et progression.':c==='Réalité'?'Grande Californie, société, technologie, économie et vie quotidienne.':c==='Vérité'?'Voile, peuples, traditions, pouvoirs, lieux et cosmologie cachée.':c==='Organisations'?'Institutions, corporations, Pègre, Crawlers et réseaux de Vérité.':c==='Personnages'?'PNJ issus des dossiers détaillés, structurés sur le modèle de l’Index PNJ.':'Profils de créatures, PNJ génériques et figures de scénario.'}";
const newDesc="function categoryDescription(c){return c==='Règles'?'Moteur commun, combat, santé, ressources et progression.':c==='Réalité'?'Grande Californie, société, technologie, économie et vie quotidienne.':c==='Équipement'?'Biens, services et matériels de Réalité, avec contexte d’usage et propriétés mécaniques.':c==='Augmentations'?'Implants et augmentations terrestres, avec contexte clinique, génération et effets mécaniques.':c==='Vérité'?'Voile, peuples, traditions, pouvoirs, lieux et cosmologie cachée.':c==='Organisations'?'Institutions, corporations, Pègre, Crawlers et réseaux de Vérité.':c==='Personnages'?'PNJ issus des dossiers détaillés, structurés sur le modèle de l’Index PNJ.':'Profils de créatures, PNJ génériques et figures de scénario.'}";
if(text.includes(oldDesc))text=text.replace(oldDesc,newDesc);
else if(!text.includes(newDesc))throw new Error('categoryDescription inattendue');

const oldSearch="La recherche porte sur les pages de lore, PNJ, règles, Bestiaire et surcouches récentes.";
const newSearch="La recherche porte sur le lore, les PNJ, les règles, le Bestiaire, l’équipement, les augmentations et les surcouches récentes.";
if(text.includes(oldSearch))text=text.replace(oldSearch,newSearch);

fs.writeFileSync(file,text);
console.log('Runtime Compendium raccordé aux catégories Équipement et Augmentations.');
