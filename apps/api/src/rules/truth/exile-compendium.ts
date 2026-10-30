import {truthCatalogExile} from './catalog-exile.js';
import {applyExileRevisions} from './exile-revision.js';
/** Same canonical rules as the Builder, preserving all existing lore and media. */
export function exileCatalogueSections(profiles:boolean){
 const groups=new Map<string,ReturnType<typeof applyExileRevisions>>();
 for(const t of applyExileRevisions(truthCatalogExile)){
  if(t.group.startsWith('Les cinq profils raciaux')!==profiles)continue;
  const rows=groups.get(t.group)??[];rows.push(t);groups.set(t.group,rows);
 }
 return [...groups].map(([title,talents],i)=>({id:`exile-catalogue-${profiles?'profils':'reseaux'}-${i}`,title,level:2,
 blocks:[{type:'table' as const,rows:[['Talent','PTV','Accès / activation','Prérequis','Effet'],...talents.map(t=>[t.name,t.cost,[t.access,t.activation].join(' · '),t.prerequisiteName,t.effectDetails])]}]}));
}
