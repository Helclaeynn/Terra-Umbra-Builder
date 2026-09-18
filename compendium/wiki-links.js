const TOKEN_RE=/[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*/gu;

function escapeHtml(value){
  return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function normalizeToken(value){
  return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}

function tokensOf(value){
  const source=String(value??''),tokens=[];
  TOKEN_RE.lastIndex=0;
  let match;
  while((match=TOKEN_RE.exec(source))){
    tokens.push({start:match.index,end:match.index+match[0].length,key:normalizeToken(match[0])});
  }
  return tokens;
}

function phraseKey(value){
  return tokensOf(value).map(token=>token.key).filter(Boolean).join(' ');
}

function titleAliases(title){
  const raw=String(title??'').trim();
  if(!raw)return[];
  const aliases=[{value:raw,priority:100}];
  const withoutArticle=raw.replace(/^(?:le|la|les|l[’'])\s+/i,'').trim();
  if(withoutArticle&&withoutArticle!==raw)aliases.push({value:withoutArticle,priority:75});
  const head=raw.split(/\s+[—–]\s+|\s*:\s*/u,1)[0]?.trim();
  if(head&&head!==raw)aliases.push({value:head,priority:65});
  if(raw.includes(' / ')){
    for(const part of raw.split(' / ').map(value=>value.trim()).filter(Boolean))aliases.push({value:part,priority:60});
  }
  return aliases;
}

function allowedGeneratedAlias(alias){
  const tokens=tokensOf(alias);
  if(!tokens.length||tokens.length>12||String(alias).length>120)return false;
  if(tokens.length>1)return true;
  const raw=String(alias).trim();
  if(/^[A-ZÀ-ÖØ-Þ0-9]{3,}$/.test(raw))return true;
  const key=tokens[0].key;
  return key.length>=5&&!new Set([
    'contexte','general','generale','organisation','commission','services','service','formation',
    'creation','progression','proprietes','reference','principes','principe','autres','histoire',
    'culture','territoires','territoire','gouvernement','administration','corporation','societe'
  ]).has(key);
}

export function createWikiLinker(articles,{explicitTargets={}}={}){
  const articleById=new Map((articles||[]).map(article=>[article.id,article]));
  const aliases=new Map();
  let maxTokens=1;

  function offer(alias,target,priority){
    if(!alias||!target?.href)return;
    const key=phraseKey(alias);
    if(!key)return;
    const tokenCount=key.split(' ').length;
    maxTokens=Math.max(maxTokens,tokenCount);
    const previous=aliases.get(key);
    const candidate={...target,priority,tokenCount,alias};
    if(!previous||priority>previous.priority){
      aliases.set(key,candidate);
      return;
    }
    if(priority===previous.priority&&previous.href!==candidate.href){
      aliases.set(key,{...previous,ambiguous:true});
    }
  }

  for(const article of articles||[]){
    if(!article?.id||!article?.title)continue;
    const target={id:article.id,href:`#/article/${encodeURIComponent(article.id)}`,title:article.title};
    for(const alias of titleAliases(article.title)){
      if(allowedGeneratedAlias(alias.value))offer(alias.value,target,alias.priority);
    }
  }

  for(const [alias,id] of Object.entries(explicitTargets||{})){
    const article=articleById.get(id);
    if(!article)continue;
    offer(alias,{id,href:`#/article/${encodeURIComponent(id)}`,title:article.title},1000);
  }

  function linkify(raw,currentArticleId=''){
    const source=String(raw??'');
    const tokens=tokensOf(source);
    if(!tokens.length)return escapeHtml(source);
    let html='',cursor=0,index=0;
    while(index<tokens.length){
      let found=null;
      const max=Math.min(maxTokens,tokens.length-index);
      for(let size=max;size>=1;size--){
        const key=tokens.slice(index,index+size).map(token=>token.key).join(' ');
        const candidate=aliases.get(key);
        if(!candidate||candidate.ambiguous||candidate.id===currentArticleId)continue;
        found={candidate,size};
        break;
      }
      if(!found){index++;continue}
      const start=tokens[index].start,end=tokens[index+found.size-1].end;
      html+=escapeHtml(source.slice(cursor,start));
      html+=`<a class="wiki-link" href="${found.candidate.href}" title="Voir : ${escapeHtml(found.candidate.title||'')}">${escapeHtml(source.slice(start,end))}</a>`;
      cursor=end;
      index+=found.size;
    }
    html+=escapeHtml(source.slice(cursor));
    return html;
  }

  return {
    linkify,
    stats:{
      aliases:[...aliases.values()].filter(entry=>!entry.ambiguous).length,
      ambiguous:[...aliases.values()].filter(entry=>entry.ambiguous).length,
      maxTokens
    }
  };
}
