import {applyOverrideEntries} from './override-engine.js';

export async function applyCommittedOverridesToMap(articleMap,payload,{strict=false}={}){
  if(!(articleMap instanceof Map))throw new TypeError('articleMap doit être une Map.');
  const entries=Array.isArray(payload?.entries)?payload.entries:[];
  if(!entries.length)return {applied:0,conflicts:[],missing:[]};

  const grouped=new Map();
  for(const entry of entries){
    if(!entry?.articleId)continue;
    if(!grouped.has(entry.articleId))grouped.set(entry.articleId,[]);
    grouped.get(entry.articleId).push(entry);
  }

  let applied=0;
  const conflicts=[];
  const missing=[];
  for(const [articleId,articleEntries] of grouped){
    const base=articleMap.get(articleId);
    if(!base){missing.push(articleId);continue;}
    const result=await applyOverrideEntries(base,articleEntries);
    if(result.conflicts.length){
      conflicts.push(...result.conflicts.map(conflict=>({articleId,...conflict})));
      if(strict)continue;
    }
    if(result.applied.length){
      const effective=result.article;
      if(base.dataset&&!effective.dataset)effective.dataset=base.dataset;
      effective.__editorialOverride=true;
      effective.__editorialOverrideCount=result.applied.length;
      effective.__editorialMediaOverride=result.applied.some(entry=>(entry.operations||[]).some(operation=>operation&&['/illustration','/image'].includes(operation.path)));
      articleMap.set(articleId,effective);
      applied+=result.applied.length;
    }
  }

  if(strict&&(conflicts.length||missing.length)){
    const details=[conflicts.length&&`${conflicts.length} conflit(s)`,missing.length&&`${missing.length} page(s) absente(s)`].filter(Boolean).join(', ');
    throw new Error(`Overrides commités invalides: ${details}`);
  }
  return {applied,conflicts,missing};
}
