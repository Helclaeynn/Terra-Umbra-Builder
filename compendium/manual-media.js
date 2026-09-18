export const MANUAL_ARTICLE_MEDIA={
  'equipement-044-raven-sg-039-croaker':{
    src:'images/manual/equipement-044-raven-sg-039-croaker.webp',
    alt:'Raven SG-039 Croaker',
    caption:'Raven SG-039 Croaker'
  }
};

export function manualArticleMedia(id){
  return MANUAL_ARTICLE_MEDIA[String(id||'')]||null;
}
