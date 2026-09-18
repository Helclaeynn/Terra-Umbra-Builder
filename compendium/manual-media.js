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
  },
  'equipement-035-phoenix-ar-124-mutilator':{
    src:'images/manual/equipement-035-phoenix-ar-124-mutilator.webp',
    alt:'Phoenix AR-124 Mutilator',
    caption:'Phoenix AR-124 Mutilator'
  },
  'equipement-036-raven-ar-027-rampager':{
    src:'images/manual/equipement-036-raven-ar-027-rampager.webp',
    alt:'Raven AR-027 Rampager',
    caption:'Raven AR-027 Rampager'
  },
  'equipement-037-owl-ar-071-howling':{
    src:'images/manual/equipement-037-owl-ar-071-howling.webp',
    alt:'Owl AR-071 Howling',
    caption:'Owl AR-071 Howling'
  },
  'equipement-038-phoenix-ar-124-sunlight':{
    src:'images/manual/equipement-038-phoenix-ar-124-sunlight.webp',
    alt:'Phoenix AR-124 Sunlight',
    caption:'Phoenix AR-124 Sunlight'
  },
  'equipement-039-owl-sr-017-big-game-hunter':{
    src:'images/manual/equipement-039-owl-sr-017-big-game-hunter.webp',
    alt:'Owl SR-017 Big Game Hunter',
    caption:'Owl SR-017 Big Game Hunter'
  },
  'equipement-040-owl-sr-029-hoot':{
    src:'images/manual/equipement-040-owl-sr-029-hoot.webp',
    alt:'Owl SR-029 Hoot',
    caption:'Owl SR-029 Hoot'
  },
  'equipement-041-raven-sr-029-deathbringer':{
    src:'images/manual/equipement-041-raven-sr-029-deathbringer.webp',
    alt:'Raven SR-029 Deathbringer',
    caption:'Raven SR-029 Deathbringer'
  },
  'equipement-042-phoenix-sr-034-phantom':{
    src:'images/manual/equipement-042-phoenix-sr-034-phantom.webp',
    alt:'Phoenix SR-034 Phantom',
    caption:'Phoenix SR-034 Phantom'
  },
  'equipement-288-sal-in':{
    src:'images/manual/equipement-288-sal-in.webp',
    alt:'Sal-in',
    caption:'Sal-in'
  },
  'equipement-289-morissette':{
    src:'images/manual/equipement-289-morissette.webp',
    alt:'Morissette',
    caption:'Morissette'
  },
  'equipement-290-biosun-aciditicteeth':{
    src:'images/manual/equipement-290-biosun-aciditicteeth.webp',
    alt:'Biosun Aciditicteeth',
    caption:'Biosun Aciditicteeth'
  },
  'equipement-291-tortoise-blastard':{
    src:'images/manual/equipement-291-tortoise-blastard.webp',
    alt:'Tortoise Blastard',
    caption:'Tortoise Blastard'
  },
  'equipement-292-song-gos':{
    src:'images/manual/equipement-292-song-gos.webp',
    alt:'Song-gos',
    caption:'Song-gos'
  },
  'equipement-293-byron-luzette':{
    src:'images/manual/equipement-293-byron-luzette.webp',
    alt:'Byron Luzette',
    caption:'Byron Luzette'
  },
  'equipement-294-abraham-kennedy':{
    src:'images/manual/equipement-294-abraham-kennedy.webp',
    alt:'Abraham Kennedy',
    caption:'Abraham Kennedy'
  },
  'equipement-295-raven-sehdia-hellrails':{
    src:'images/manual/equipement-295-raven-sehdia-hellrails.webp',
    alt:'Raven-Sehdia Hellrails',
    caption:'Raven-Sehdia Hellrails'
  }
};

export function manualArticleMedia(id){
  return MANUAL_ARTICLE_MEDIA[String(id||'')]||null;
}
