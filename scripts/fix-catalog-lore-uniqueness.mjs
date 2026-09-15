import fs from 'node:fs';

const file='scripts/build-compendium-catalog-pages.mjs';
let text=fs.readFileSync(file,'utf8');
const old=`  const second=item.kind==='augmentation'\n    ? \`\${priceLore(item.price)} \${generationLore(item)} Une pose sérieuse suppose cependant suivi, entretien et acceptation des contraintes propres à l’augmentation du corps.\`.replace(/\\s+/g,' ').trim()\n    : \`\${priceLore(item.price)} \${meaning.charAt(0).toUpperCase()+meaning.slice(1)}.\`;`;
const next=`  const second=item.kind==='augmentation'\n    ? \`\${priceLore(item.price)} \${generationLore(item)} Pour \${item.name}, une pose sérieuse suppose suivi, entretien et acceptation des contraintes propres à ce type d’implant.\`.replace(/\\s+/g,' ').trim()\n    : \`\${priceLore(item.price)} Pour \${item.name}, dans la famille « \${item.category} », \${meaning}.\`;`;
if(!text.includes(old))throw new Error('Bloc lore attendu introuvable dans le générateur');
text=text.replace(old,next);
fs.writeFileSync(file,text);
console.log('Générateur: second paragraphe rendu spécifique à chaque entrée.');
