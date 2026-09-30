import start from './player-start.json';
import glossary from './player-glossary.json';
import reading from './article-reading-guides.json';

export const playerStart = start;
export const playerGuides = start.guides;
export const glossaryTerms = [...glossary].sort((a,b) => a.label.localeCompare(b.label,'fr'));
export const readingGuides: Record<string, { purpose: string; essentials: string[]; terms: string[]; guides: string[] }> = reading;
export const normalizeTerm = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’'‐–—-]/g,' ').replace(/\s+/g,' ').trim();
export const termLabel = (id: string) => glossaryTerms.find(term=>term.id===id)?.label ?? id;
export const glossaryHref = (id: string) => `/glossaire?terme=${encodeURIComponent(id)}`;
export const articleHref = (id: string) => `/compendium?article=${encodeURIComponent(id)}`;
/** Builder IDs are grouped by Nature; guides follow the actual people/species choice. */
export function playerGuideForTruth(state: { nature: string; choices: Record<string, unknown> }) {
  let id=state.nature;
  if(id==='exile') id=({elye:'elfe',whurten:'nain',ashyll:'ashyll',thulkar:'thulkar',azmenorien:'azmenorien'} as Record<string,string>)[String(state.choices.people)] ?? '';
  else if(id==='extral') id=({talass:'talass',mosen:'mosen',baseanh:'baseanh',rocreen:'rocreen',thalsios:'thalsios',homo_superior:'homo-superior',adrak:'adrak'} as Record<string,string>)[String(state.choices.species)] ?? '';
  else if(id==='humain') {
    const tradition=state.choices.hunterTradition;
    const build=state.choices.hunterBuild as {doctrines?:unknown} | undefined;
    if((typeof tradition==='string' && tradition!=='' && tradition!=='aucune') || (Array.isArray(build?.doctrines) && build.doctrines.length>0)) id='chasseur';
  }
  return playerGuides.find(g=>g.id===id);
}
export function filterTerms(query: string) {
  const q=normalizeTerm(query);
  if(!q) return glossaryTerms;
  const exact=glossaryTerms.filter(t=>[t.label,t.id,...t.aliases].some(s=>normalizeTerm(s)===q));
  const other=glossaryTerms.filter(t=>!exact.includes(t) && normalizeTerm([t.label,...t.aliases,t.definition].join(' ')).includes(q));
  return [...exact,...other];
}
