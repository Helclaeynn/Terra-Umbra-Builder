import fs from 'node:fs';

const file='scripts/build-compendium-catalog-pages.mjs';
let text=fs.readFileSync(file,'utf8');

if(!text.includes('const identity=item.kind===\'augmentation\'')){
  const old=`  const v=stableVariant(\`\${item.name}|\${item.category}\`);\n  const first=[\n    \`Dans la Grande Californie, \${item.name} appartient à \${context}. Son nom circule surtout chez \${users}.\`,\n    \`\${item.name} s’inscrit dans \${context}. On le rencontre principalement chez \${users}.\`,\n    \`Autour de \${item.name} s’est développé tout un usage lié à \${context}. Il intéresse d’abord \${users}.\`,\n    \`Dans les vitrines, ateliers et réseaux spécialisés de la Grande Californie, \${item.name} relève de \${context}. Il est surtout recherché par \${users}.\`\n  ][v];\n  const second=item.kind==='augmentation'\n    ? \`\${priceLore(item.price)} \${generationLore(item)} Pour \${item.name}, une pose sérieuse suppose suivi, entretien et acceptation des contraintes propres à ce type d’implant.\`.replace(/\\s+/g,' ').trim()`;
  const next=`  const v=stableVariant(\`\${item.name}|\${item.category}|\${item.generation??''}\`);\n  const identity=item.kind==='augmentation'&&item.generation!==null?\`\${item.name} de génération \${item.generation}\`:item.name;\n  const first=[\n    \`Dans la Grande Californie, \${identity} appartient à \${context}. Son nom circule surtout chez \${users}.\`,\n    \`\${identity} s’inscrit dans \${context}. On le rencontre principalement chez \${users}.\`,\n    \`Autour de \${identity} s’est développé tout un usage lié à \${context}. Il intéresse d’abord \${users}.\`,\n    \`Dans les vitrines, ateliers et réseaux spécialisés de la Grande Californie, \${identity} relève de \${context}. Il est surtout recherché par \${users}.\`\n  ][v];\n  const second=item.kind==='augmentation'\n    ? \`\${priceLore(item.price)} \${generationLore(item)} Pour \${identity}, une pose sérieuse suppose suivi, entretien et acceptation des contraintes propres à ce type d’implant.\`.replace(/\\s+/g,' ').trim()`;
  if(!text.includes(old))throw new Error('Bloc d’identité lore attendu introuvable');
  text=text.replace(old,next);
}

if(!text.includes('const displayTitle=item.kind===\'augmentation\'')){
  const old=`  const prefix=item.kind==='augmentation'?'augmentation':'equipement';\n  const [p1,p2]=loreParagraphs(item);`;
  const next=`  const prefix=item.kind==='augmentation'?'augmentation':'equipement';\n  const displayTitle=item.kind==='augmentation'&&item.generation!==null?\`\${item.name} — Génération \${item.generation}\`:item.name;\n  const [p1,p2]=loreParagraphs(item);`;
  if(!text.includes(old))throw new Error('Bloc article attendu introuvable');
  text=text.replace(old,next)
    .replace('    title:item.name,','    title:displayTitle,')
    .replace("alt:`Illustration de ${item.name}`","alt:`Illustration de ${displayTitle}`");
}

fs.writeFileSync(file,text);
console.log('Générateur: générations d’augmentations distinguées dans le lore et les titres.');
