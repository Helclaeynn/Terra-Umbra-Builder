import {truthCatalogExtral} from './catalog-extral.js';
import {applyExtralRevisions} from './extral-revision.js';
/** Render the rules from the same catalogue as the Builder; no media/lore deletion. */
export function extralCatalogueSections(profiles:boolean){
 const groups=new Map<string,ReturnType<typeof applyExtralRevisions>>();
 for(const t of applyExtralRevisions(truthCatalogExtral)){
  const basic=/^(Talass|Mo’sen|Baséanh|Rocréen|Thalsios|Protocoles de Continuité)/.test(t.group);
  if(basic!==profiles)continue;
  const list=groups.get(t.group)??[];list.push(t);groups.set(t.group,list);
 }
 return [...groups].map(([title,talents],i)=>({id:`extral-catalogue-${profiles?'profils':'reseaux'}-${i}`,title,level:2,
  blocks:[{type:'table' as const,rows:[['Talent','PTV','Accès / activation','Effet'],...talents.map(t=>[t.name,t.cost,[t.access,t.activation].filter(Boolean).join(' · '),'effectDetails' in t?t.effectDetails:t.effect])]}]
 }));
}
