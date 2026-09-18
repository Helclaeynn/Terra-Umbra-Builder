export const MANUAL_ARTICLE_MEDIA={
  'guide-realite-nouveau-joueur':{
    src:'assets/gouvernement-preview/grande-californie.webp',
    alt:'Grande Californie',
    caption:'Grande Californie — cadre de la Réalité en 2035'
  },
  'bestiaire-v15-afanc':{
    src:'images/manual/bestiaire-v15-afanc.webp',
    alt:'Afanc',
    caption:'Afanc'
  },
  'equipement-043-raven-sg-025-riot-control':{
    src:'images/manual/equipement-043-raven-sg-025-riot-control.webp',
    alt:'Raven SG-025 Riot Control',
    caption:'Raven SG-025 Riot Control'
  },
  'equipement-044-raven-sg-039-croaker':{
    src:'images/manual/equipement-044-raven-sg-039-croaker.webp',
    alt:'Raven SG-039 Croaker',
    caption:'Raven SG-039 Croaker'
  },
  'equipement-045-owl-sg-016-boss':{
    src:'images/manual/equipement-045-owl-sg-016-boss.webp',
    alt:'Owl SG-016 Boss',
    caption:'Owl SG-016 Boss'
  },
  'equipement-046-phoenix-sg-042-fire-rain':{
    src:'images/manual/equipement-046-phoenix-sg-042-fire-rain.webp',
    alt:'Phoenix SG-042 Fire Rain',
    caption:'Phoenix SG-042 Fire Rain'
  }
};

export function manualArticleMedia(id){
  return MANUAL_ARTICLE_MEDIA[String(id||'')]||null;
}
