type Article = Record<string, any> & {id:string};

// Explicit author decisions. Similar names are never merged automatically.
export const APPROVED_PNJ_ALIASES:Record<string,string> = {
  'pnj-portraits-chasseurs-autres-cai7-kai-sieben':'pnj-crawlers-docx-dragoslav-memic',
  'pnj-portraits-corporations-tsung-feng':'pnj-corporations-feng-tsung',
  'pnj-portraits-crawlers-niichaad-tenford':'pnj-crawlers-antisysteme-p60-niichad-tenford',
  'pnj-crawlers-antisysteme-p33-yegpor-karamov':'pnj-fleaux-focus-yegor-karamov-05-yegor-karamov'
};

const copy=<T>(value:T):T=>structuredClone(value);
// Préfixe neutre des sections reprises d'une fiche fusionnée : l'identifiant
// de la source (pnj-portraits-chasseurs-…) trahirait sa nature aux joueurs.
export const mergedSectionPrefix=(alias:string)=>`fusion-${Object.keys(APPROVED_PNJ_ALIASES).indexOf(alias)+1}-`;
const isProfile=(section:any)=>section.id==='profil-statistique'||/^Profil (statistique|de Vérité)/.test(String(section.title??''));
/** Le dossier MJ de la fiche : tout le contenu MJ repris d'une fiche fusionnée y est rangé. */
function mjDossier(article:Article){
  let dossier=article.sections.find((section:any)=>section.audience==='mj'&&!isProfile(section));
  if(!dossier){
    dossier={id:'dossier-mj-consolide',title:'Dossier MJ · Vérité et secrets',level:2,audience:'mj',blocks:[]};
    article.sections.push(dossier);
  }
  return dossier;
}
function foldIntoDossier(article:Article,marker:string,title:string,blocks:any[]){
  const dossier=mjDossier(article);
  if((dossier.blocks??[]).some((block:any)=>block.mergedFrom===marker))return;
  // Chaque bloc repris garde sa provenance : la fiche d'origine reste reconstituable.
  dossier.blocks=[...(dossier.blocks??[]),{type:'p',style:'source-heading',text:title,mergedFrom:marker},
    ...copy(blocks).map((block:any)=>({...block,mergedFrom:marker}))];
}
function blankSection(section:any){
  return !(section.blocks??[]).some((block:any)=>
    block.type==='table' ? (block.rows??[]).slice(1).some((row:any[])=>row.slice(1).some(value=>value&&value!=='À renseigner')) : Boolean(block.text||block.src));
}
function media(article:Article){
  return [article.image,article.illustration,...(article.gallery??[]),article.pnj?.portrait?{src:article.pnj.portrait,alt:article.title}:null].filter(value=>value?.src);
}
export function applyApprovedPnjMerges(byId:Map<string,Article>):void{
  for(const [alias,id] of Object.entries(APPROVED_PNJ_ALIASES)){
    const source=byId.get(alias),target=byId.get(id);
    if(!source||!target)continue;
    const merged=copy(target);
    merged.sections??=[];
    const sourcePrivate=source.audience==='mj';
    for(const section of source.sections??[]){
      if(blankSection(section)||source.pnj?.completeness==='portrait_only'&&!source.__wikiPublishedEdit)continue;
      // Existing IDs make repeat publication/reload idempotent. Keep provenance
      // when two unrelated source sections share the same generated ID.
      const sectionId=`${mergedSectionPrefix(alias)}${section.id}`;
      const privateSection=sourcePrivate||section.audience==='mj'||id==='pnj-fleaux-focus-yegor-karamov-05-yegor-karamov'&&section.id==='identite-realite-consolidee';
      // Une seule section MJ par rôle : le contenu MJ de la source rejoint le
      // dossier MJ de la fiche, ses profils chiffrés aussi (ceux de la fiche font foi).
      if(privateSection){foldIntoDossier(merged,sectionId,`Fiche fusionnée · ${section.title??section.id}`,section.blocks??[]);continue;}
      if(merged.sections.some((s:any)=>s.id===sectionId))continue;
      const fragment=copy(section);
      fragment.id=sectionId;
      merged.sections.push(fragment);
    }
    const existing=new Set(media(merged).map(value=>value.src));
    for(const value of media(source)){
      if(existing.has(value.src))continue;
      const image=copy(value);
      if(sourcePrivate)image.portraitVisibility='mj';
      if(!merged.image&&!merged.illustration)merged.image=image;
      else merged.gallery=[...(merged.gallery??[]),image];
      existing.add(image.src);
    }
    // Preserve source identity fields in source sections, rather than overwrite
    // a current published biography or expose its Truth dossier as Reality.
    if(id==='pnj-fleaux-focus-yegor-karamov-05-yegor-karamov'){
      foldIntoDossier(merged,'fusion-karamov-ecart','Écart entre les sources',[{type:'p',text:'La source Crawlers indique 69 ans ; la fiche Fléaux indique 59 ans. Les deux mentions sont conservées pour arbitrage éditorial. Le profil principal reste celui de la fiche Fléaux.'}]);
    }
    // Ordre MJ : dossier, puis profil de Vérité, puis profil statistique.
    const truthProfile=merged.sections.find((section:any)=>section.audience==='mj'&&/^Profil de Vérité/.test(String(section.title??'')));
    if(truthProfile)merged.sections=[...merged.sections.filter((section:any)=>section!==truthProfile),truthProfile];
    const profile=merged.sections.find((section:any)=>section.id==='profil-statistique');
    if(profile)merged.sections=[...merged.sections.filter((section:any)=>section!==profile),profile];
    byId.set(id,merged);byId.delete(alias);
  }
}

// Old article links and their section anchors retain the source's section IDs.
// The content and audience are unchanged; only conflicting anchor IDs differ.
export function approvedAliasArticle<T extends Article>(article:T,alias:string):T{
  if(!APPROVED_PNJ_ALIASES[alias])return article;
  const prefix=mergedSectionPrefix(alias),out=copy(article);
  const originals=new Set((out.sections??[]).filter((s:any)=>s.id.startsWith(prefix)).map((s:any)=>s.id.slice(prefix.length)));
  for(const s of out.sections??[]){
    if(s.id.startsWith(prefix))s.id=s.id.slice(prefix.length);
    else if(originals.has(s.id))s.id=`canonical-${s.id}`;
  }
  return out;
}
