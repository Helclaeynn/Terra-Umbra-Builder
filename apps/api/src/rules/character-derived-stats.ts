/** Existing Builder formulas, shared unchanged by creation and campaign views. */
export function characterDerivedStats(attribute:(id:string)=>number, skill:(id:string)=>number, disadvantages:readonly string[]){
  const vigor=attribute("vigueur"), agility=attribute("agilite"), will=attribute("volonte");
  const constitution=skill("constitution"), athletics=skill("athletisme"), dodge=skill("esquive");
  const fortitude=skill("force_mentale"), humanity=skill("humanite");
  return {
    pvMax:2*vigor+constitution, death:-(vigor+constitution),
    initiative:agility+athletics-(disadvantages.includes("lent_a_reagir")?2:0),
    passiveDefense:agility+dodge, occultDefense:will+fortitude, movement:5+athletics,
    integrity:Math.max(1,fortitude+humanity-(disadvantages.includes("integrite_defaillante")?2:0)),
    augmentStressMax:vigor+humanity, melee:vigor+skill("melee"), pugilat:vigor+skill("pugilat"),
    shooting:agility+skill("tir"), neurodive:will+skill("neurodive")
  };
}
