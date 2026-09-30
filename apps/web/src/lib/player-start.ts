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
export function filterTerms(query: string) {
  const q=normalizeTerm(query);
  if(!q) return glossaryTerms;
  const exact=glossaryTerms.filter(t=>[t.label,t.id,...t.aliases].some(s=>normalizeTerm(s)===q));
  const other=glossaryTerms.filter(t=>!exact.includes(t) && normalizeTerm([t.label,...t.aliases,t.definition].join(' ')).includes(q));
  return [...exact,...other];
}
