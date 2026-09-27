/** Permanent scores drive derived values; test-only bonuses drive quick rolls. */
export function characterDerivedStats(attribute:(id:string)=>number,skill:(id:string)=>number,disadvantages:readonly string[],testSkill:(id:string)=>number=skill){
  const vigor=attribute('vigueur'),agility=attribute('agilite'),will=attribute('volonte');
  const constitution=skill('constitution'),athletics=skill('athletisme'),dodge=skill('esquive');
  const fortitude=skill('force_mentale'),humanity=skill('humanite');
  return {pvMax:2*vigor+constitution,death:-(vigor+constitution),initiative:agility+athletics-(disadvantages.includes('lent_a_reagir')?2:0),passiveDefense:agility+dodge,occultDefense:will+fortitude,movement:5+athletics,integrity:Math.max(1,fortitude+humanity-(disadvantages.includes('integrite_defaillante')?2:0)),augmentStressMax:vigor+humanity,melee:vigor+testSkill('melee'),pugilat:vigor+testSkill('pugilat'),shooting:agility+testSkill('tir'),neurodive:will+testSkill('neurodive')};
}
