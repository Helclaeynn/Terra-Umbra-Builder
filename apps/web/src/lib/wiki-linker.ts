// @ts-nocheck
// Port V2 du moteur d'interlink canonique de la V1.
const TOKEN_RE=/[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*/gu;

function escapeHtml(value){
  return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(value){return escapeHtml(value).replace(/\n/g,'&#10;')}
function normalizeToken(value){
  return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}
function tokensOf(value){
  const source=String(value??''),tokens=[];TOKEN_RE.lastIndex=0;let match;
  while((match=TOKEN_RE.exec(source))){
    const raw=match[0],clitic=raw.match(/^((?:[cdjlmnst]|qu))[’'](.+)$/iu);
    if(clitic){
      const cut=raw.search(/[’']/u);
      tokens.push({start:match.index,end:match.index+cut,key:normalizeToken(clitic[1])});
      tokens.push({start:match.index+cut+1,end:match.index+raw.length,key:normalizeToken(clitic[2])});
    }else tokens.push({start:match.index,end:match.index+raw.length,key:normalizeToken(raw)});
  }
  return tokens;
}
function phraseKey(value){return tokensOf(value).map(token=>token.key).filter(Boolean).join(' ')}
function surfaceKey(value){return String(value??'').normalize('NFC').toLocaleLowerCase('fr').replace(/[’]/g,"'").replace(/\s+/g,' ').trim()}
function surfaceKeyCase(value){return String(value??'').normalize('NFC').replace(/[’]/g,"'").replace(/\s+/g,' ').trim()}
function titleAliases(title){
  const raw=String(title??'').trim();if(!raw)return[];
  const aliases=[{value:raw,priority:120,kind:'title'}];
  const withoutArticle=raw.replace(/^(?:le|la|les|l[’'])\s+/i,'').trim();
  if(withoutArticle&&withoutArticle!==raw)aliases.push({value:withoutArticle,priority:95,kind:'article'});
  const head=raw.split(/\s+[—–]\s+|\s*:\s*/u,1)[0]?.trim();
  if(head&&head!==raw)aliases.push({value:head,priority:80,kind:'head'});
  if(raw.includes(' / '))for(const part of raw.split(' / ').map(value=>value.trim()).filter(Boolean))aliases.push({value:part,priority:70,kind:'part'});
  return aliases;
}

const GENERIC_SINGLE=new Set([
  'reseau','reseaux','media','medias','systeme','systemes','service','services','societe','culture','histoire',
  'formation','organisation','organisations','creation','progression','propriete','proprietes','reference',
  'principes','principe','territoire','territoires','gouvernement','administration','corporation','corps',
  'identite','information','informations','securite','doctrine','tradition','traditions','equipement',
  'arme','armes','talent','talents','nature','natures','origine','origines','pouvoir','pouvoirs','groupe',
  'groupes','faction','factions','communaute','communautes','monde','lieu','lieux','regle','regles',
  'terre','commission','gang','gangs','motard','motards','insurge','insurges'
]);
export const WIKI_GENERIC_SINGLE=GENERIC_SINGLE;
const GENERIC_MULTI=new Set([
  'autres factions','grands ensembles','les grands ensembles','droits accordes','les droits accordes',
  'autres creatures','grand felin','chien noir','civil ordinaire'
]);

function allowedGeneratedAlias(alias,article){
  const tokens=tokensOf(alias);if(!tokens.length||tokens.length>12||String(alias).length>120)return false;
  const keyPhrase=tokens.map(token=>token.key).join(' ');
  if(tokens.length>1)return !GENERIC_MULTI.has(keyPhrase);
  const raw=String(alias).trim(),key=tokens[0].key;
  if(GENERIC_SINGLE.has(key))return false;
  if(/^[A-ZÀ-ÖØ-Þ0-9][A-ZÀ-ÖØ-Þ0-9.'’\-]{2,}$/.test(raw))return true;
  const loreLike=['Vérité','Réalité','Personnages'].includes(article?.category)||['lore','verite','realite','pnj'].includes(article?.dataset);
  return loreLike&&/^[A-ZÀ-ÖØ-Þ]/.test(raw)&&key.length>=4;
}
function contextText(article){
  return normalizeToken(`${article?.category||''} ${article?.group||''} ${article?.subgroup||''} ${article?.title||''}`);
}
function materialContext(raw=''){
  return /\b(prix|acheter|achat|equipement|arme|armure|implant|augmentation|vehicule|materiel|catalogue|cout|dollar|compte|munition|munitions|chargeur|attaque|dgt|portee|rafale|automatique|smartlink)\b/.test(normalizeToken(raw));
}
function truthCorruptionContext(raw='',current=null){
  const text=normalizeToken(`${raw} ${current?.title||''} ${current?.group||''} ${current?.subgroup||''}`);
  return /\b(verite|fleau|fleaux|souillure|source|sources|rupture|occulte|surnaturel|calamitechnologie|daemon|vampire|garou|mage|neant|hologramme|voile)\b/.test(text);
}
function reserveContext(raw='',matchedRaw='',current=null){
  const exact=/\b(?:La |la )?Grande R[ÉE]serve\b/u.test(String(matchedRaw||''));
  if(exact)return true;
  const text=normalizeToken(`${raw} ${current?.title||''} ${current?.group||''} ${current?.subgroup||''}`);
  return /\b(amerind|amerindien|amerindiens|native|natives|tokala|tala|nation|nations|indienne|indien|indiens|territoire|territoires|californie)\b/.test(text);
}
function generatedCandidateAllowed(candidate,raw,current,matchedRaw=''){
  const c=candidate?.article||{};
  if(candidate?.id==='lore-pegre-la-famille'&&surfaceKeyCase(matchedRaw)!=='La Famille')return false;
  if(candidate?.id==='lore-gouvernement-grande-reserve'&&!reserveContext(raw,matchedRaw,current))return false;
  if(c.category==='Équipement & Objets'&&current?.category&&current.category!=='Équipement & Objets'){
    const exactNamed=surfaceKeyCase(candidate.alias)===surfaceKeyCase(matchedRaw)&&/^[A-ZÀ-ÖØ-Þ0-9]/u.test(String(matchedRaw||''));
    const bestiaryStat=current.category==='Bestiaire'&&/\b(attaque|dgt|portee|armure|anti emp)\b/.test(normalizeToken(raw));
    if(!materialContext(raw)&&!exactNamed&&!bestiaryStat)return false;
  }
  if(c.category==='Bestiaire'&&current?.category&&current.category!=='Bestiaire'&&candidate.tokenCount>1){
    const surface=String(matchedRaw||'');
    if(surface===surface.toLocaleLowerCase('fr'))return false;
  }
  return true;
}

function candidateScore(candidate,raw,current){
  let score=Number(candidate.priority||0);
  if(candidate.explicit)score+=10000;
  const c=candidate.article||{},dataset=String(c.dataset||''),category=String(c.category||'');
  if(category==='Vérité')score+=75;
  else if(category==='Réalité')score+=60;
  else if(category==='Personnages')score+=25;
  else if(category==='Règles')score+=12;
  else if(category==='Équipement & Objets')score-=35;
  if(dataset==='lore')score+=50;
  else if(dataset==='verite')score+=44;
  else if(dataset==='realite')score+=36;
  else if(dataset==='pnj')score+=14;
  else if(dataset==='moteur')score+=8;
  else if(dataset==='equipement'||dataset==='augmentations')score-=45;
  else if(dataset==='verite-catalogue')score-=28;
  else if(dataset==='bestiaire')score-=12;

  const sentence=normalizeToken(raw);
  const material=materialContext(raw);
  const rules=/\b(regle|test|jet|talent|cout|ptv|xp|bonus|malus|degat|defense|attribut|competence)\b/.test(sentence);
  const lore=/\b(histoire|culture|peuple|societe|faction|tradition|temple|divinite|dieu|dieux|communaute|origine|descendant|lignage|lignee|reseau|relations)\b/.test(sentence);
  if(material){if(category==='Équipement & Objets')score+=85;if(dataset==='moteur')score+=12}
  if(rules&&category==='Règles')score+=38;
  if(lore&&(category==='Vérité'||category==='Réalité'||dataset==='lore'||dataset==='verite'||dataset==='realite'))score+=35;

  const here=contextText(current),there=contextText(c);
  if(current&&category===current.category)score+=10;
  for(const token of tokensOf(there).map(x=>x.key))if(token.length>=5&&here.includes(token))score+=1.5;
  return score;
}

export function createWikiLinker(articles,{explicitTargets={},strictSurfaceAliases=[],caseSensitiveAliases=[],searchFallbacks=[],hrefForId=id=>`#/article/${encodeURIComponent(id)}`,searchHref=alias=>`#/search?q=${encodeURIComponent(alias)}`}={}){
  const strictSurfaces=new Set((strictSurfaceAliases||[]).map(surfaceKey));
  const caseSensitiveSurfaces=new Set((caseSensitiveAliases||[]).map(surfaceKeyCase));
  const articleById=new Map((articles||[]).map(article=>[article.id,article]));
  const aliases=new Map();let maxTokens=1;

  function offer(alias,target,priority,meta={}){
    if(!alias||!target?.href)return;
    const key=phraseKey(alias);if(!key)return;
    const tokenCount=key.split(' ').length;maxTokens=Math.max(maxTokens,tokenCount);
    const candidate={...target,...meta,priority,tokenCount,alias};
    const list=aliases.get(key)||[];
    if(!list.some(x=>x.href===candidate.href&&x.explicit===candidate.explicit))list.push(candidate);
    aliases.set(key,list);
  }

  for(const article of articles||[]){
    if(!article?.id||!article?.title)continue;
    const target={id:article.id,href:hrefForId(article.id),title:article.title,article};
    for(const alias of titleAliases(article.title))if(allowedGeneratedAlias(alias.value,article))offer(alias.value,target,alias.priority,{kind:alias.kind,strictSurface:strictSurfaces.has(surfaceKey(alias.value)),caseSensitive:caseSensitiveSurfaces.has(surfaceKeyCase(alias.value))});
  }
  for(const [alias,id] of Object.entries(explicitTargets||{})){
    const article=articleById.get(id);if(!article)continue;
    offer(alias,{id,href:hrefForId(id),title:article.title,article},1000,{explicit:true,kind:'explicit',strictSurface:strictSurfaces.has(surfaceKey(alias)),caseSensitive:caseSensitiveSurfaces.has(surfaceKeyCase(alias))});
  }
  for(const alias of searchFallbacks||[])offer(alias,{href:searchHref(alias),title:`Rechercher : ${alias}`},20,{search:true,kind:'search'});

  function surfaceAllowed(candidate,matchedRaw){
    if(candidate.strictSurface&&surfaceKey(candidate.alias)!==surfaceKey(matchedRaw))return false;
    if(candidate.caseSensitive&&surfaceKeyCase(candidate.alias)!==surfaceKeyCase(matchedRaw))return false;
    return true;
  }
  function chooseCandidate(list,raw,current,matchedRaw=''){
    const viable=(list||[]).filter(candidate=>candidate.id!==current?.id&&surfaceAllowed(candidate,matchedRaw));
    if(!viable.length)return null;
    const explicit=viable.filter(x=>x.explicit);
    if(explicit.length>1&&matchedRaw){
      const exact=explicit.filter(x=>surfaceKey(x.alias)===surfaceKey(matchedRaw));
      if(exact.length===1)return exact[0];
    }
    if(explicit.length===1){
      const only=explicit[0];
      if(['corruption','souillure'].includes(phraseKey(only.alias))&&!truthCorruptionContext(raw,current))return null;
      if(phraseKey(only.alias)==='se reveler'&&phraseKey(matchedRaw)==='se reveler'&&!/R(?:é|e)véler/u.test(String(matchedRaw||'')))return null;
      if(phraseKey(only.alias)==='chasseur'&&surfaceKeyCase(matchedRaw)==='Chasseur'&&['equipement-011-owl-lc-014-chasseur','verite-catalogue-008-owl-lc-014-chasseur'].includes(String(current?.id||'')))return null;
      return only;
    }
    const contextual=viable.filter(candidate=>generatedCandidateAllowed(candidate,raw,current,matchedRaw));
    if(!contextual.length)return null;
    const ranked=contextual.map(candidate=>[candidateScore(candidate,raw,current),candidate]).sort((a,b)=>b[0]-a[0]||String(a[1].title).localeCompare(String(b[1].title),'fr'));
    if(ranked.length>1&&Math.abs(ranked[0][0]-ranked[1][0])<4&&ranked[0][1].href!==ranked[1][1].href)return null;
    return ranked[0][1];
  }

  function embeddedInCurrentTitle(sourceTokens,index,size,current){
    const titleTokens=tokensOf(current?.title||'').map(token=>token.key);if(titleTokens.length<2||size>=titleTokens.length)return false;
    const matched=sourceTokens.slice(index,index+size).map(token=>token.key);
    for(let pos=0;pos+size<=titleTokens.length;pos++){
      if(!matched.every((key,i)=>titleTokens[pos+i]===key))continue;
      const before=pos>0&&index>0&&sourceTokens[index-1].key===titleTokens[pos-1];
      const after=pos+size<titleTokens.length&&index+size<sourceTokens.length&&sourceTokens[index+size].key===titleTokens[pos+size];
      if(before||after)return true;
    }
    return false;
  }

  function linkify(raw,currentContext=''){
    const source=String(raw??''),current=typeof currentContext==='string'?articleById.get(currentContext)||{id:currentContext}:currentContext||null;
    const tokens=tokensOf(source);if(!tokens.length)return escapeHtml(source);
    let html='',cursor=0,index=0;
    while(index<tokens.length){
      let found=null;const max=Math.min(maxTokens,tokens.length-index);
      for(let size=max;size>=1;size--){
        const key=tokens.slice(index,index+size).map(token=>token.key).join(' ');
        const list=aliases.get(key);if(!list?.length)continue;
        const matchedRaw=source.slice(tokens[index].start,tokens[index+size-1].end);const candidate=chooseCandidate(list,source,current,matchedRaw);if(!candidate)continue;
        if(embeddedInCurrentTitle(tokens,index,size,current))continue;
        found={candidate,size};break;
      }
      if(!found){index++;continue}
      const start=tokens[index].start,end=tokens[index+found.size-1].end;
      html+=escapeHtml(source.slice(cursor,start));
      const data=found.candidate.id
        ? ` data-wiki-id="${escapeAttr(found.candidate.id)}"`
        : found.candidate.search
          ? ` data-wiki-search="${escapeAttr(found.candidate.alias)}"`
          : '';
      const title=found.candidate.id ? '' : ` title="Voir : ${escapeAttr(found.candidate.title||'')}"`;
      html+=`<a class="wiki-link" href="${escapeAttr(found.candidate.href)}"${data}${title}>${escapeHtml(source.slice(start,end))}</a>`;
      cursor=end;index+=found.size;
    }
    html+=escapeHtml(source.slice(cursor));return html;
  }

  const multi=[...aliases.values()].filter(list=>new Set(list.map(x=>x.href)).size>1).length;
  return {linkify,stats:{aliases:aliases.size,ambiguous:multi,maxTokens}};
}
