/** Shared, side-effect-free Renommée rules for Terra Umbra (fictional RPG). */
export const renownScale = [
  {score:0,name:"Inconnu",scope:"Aucun nom établi",benefit:"Les actes, relations et compétences permettent de se présenter."},
  {score:1,name:"Connu du milieu",scope:"Quartier ou cercle professionnel",benefit:"Les habitués pertinents reconnaissent le nom et ce qu’il représente."},
  {score:2,name:"Établi",scope:"Milieu local au-delà de ses proches",benefit:"Les clients et prestataires peuvent accorder une confiance initiale sans présentation personnelle."},
  {score:3,name:"Notable",scope:"Ville, Sphère locale ou secteur important",benefit:"Une demande pertinente atteint les responsables locaux sans être écartée comme celle d’un inconnu."},
  {score:4,name:"Célèbre",scope:"Diffusion large, y compris hors du milieu immédiat",benefit:"La réputation permet des introductions entre milieux, mais rend l’anonymat plus difficile."},
  {score:5,name:"Figure majeure",scope:"Référence incontournable dans son domaine",benefit:"Les décideurs concernés doivent tenir compte du personnage, sans être obligés de lui obéir."}
] as const;

export function clampRenown(value:unknown):number {
  const n=Number(value);
  return Number.isFinite(n)?Math.max(0,Math.min(5,Math.trunc(n))):0;
}
export function renownScore(creationIds:readonly string[], learnedIds:readonly string[], edgeRenown:number, unknown:boolean, adjustment=0):number {
  const initial=unknown?0:1+(creationIds.includes("renomme")||edgeRenown>0?1:0);
  const learned=learnedIds.includes("renomme")&&!creationIds.includes("renomme")?1:0;
  return clampRenown(initial+learned+(Number.isFinite(adjustment)?Math.trunc(adjustment):0));
}
export function protectionRenown(personal:unknown,localOrganization:unknown):number {
  return Math.max(clampRenown(personal),clampRenown(localOrganization));
}
export function modestRenownConcession(own:unknown,other:unknown,recognized:boolean,nonHostile:boolean,relevant:boolean):boolean {
  return recognized&&nonHostile&&relevant&&clampRenown(own)>clampRenown(other);
}

type RuleBlock={type:"p";text:string}|{type:"table";rows:unknown[][]};
export const renownSections:Array<{id:string;title:string;level:number;blocks:RuleBlock[]}>= [
  {id:"renommee",title:"Renommée — diffusion du nom et bénéfices",level:2,blocks:[
    {type:"table",rows:[["Score","Niveau","Portée","Bénéfice"],...renownScale.map(row=>[row.score,row.name,row.scope,row.benefit])]},
    {type:"p",text:"La Renommée va de 0 à 5 et possède un milieu de référence. Un nom ou une identité doit pouvoir être relié au personnage : une couverture inconnue ne bénéficie pas automatiquement de la célébrité de son identité réelle. Dans le milieu et la portée appropriés, la reconnaissance ordinaire ne nécessite pas un jet systématique."}
  ]},
  {id:"renommee-reputation",title:"Renommée et Réputation",level:2,blocks:[
    {type:"p",text:"La Renommée mesure combien le nom circule ; la Réputation décrit ce qu’on raconte. Lorsqu’une réputation connue est réellement pertinente, appliquer normalement une circonstance favorable (+3), défavorable (−3) ou une conséquence fictionnelle évidente. Le score de Renommée seul n’accorde aucun bonus social universel : il ne s’ajoute pas au jet."},
    {type:"p",text:"Une réputation de convoyeur fiable aide à obtenir un contrat ; une réputation de brutalité peut intimider, mais ne rassure pas nécessairement une victime. Une réputation pertinente ne s’empile pas plusieurs fois parce qu’elle est formulée de plusieurs façons."}
  ]},
  {id:"faire-valoir-son-nom",title:"Faire valoir son nom — une fois par scène",level:2,blocks:[
    {type:"p",text:"Face à un interlocuteur non hostile qui reconnaît une réputation pertinente, une Renommée strictement supérieure permet d’obtenir sans jet une concession sociale modeste : être reçu, faire écouter sa version, obtenir une présentation ou bénéficier d’une confiance professionnelle initiale. Une seule utilisation par scène."},
    {type:"p",text:"Cela ne fournit ni données secrètes, ni équipement important, ni obéissance contraire aux intérêts ou prérogatives de l’interlocuteur. Être plus connu qu’un gardien ne donne pas son habilitation. À Renommée égale ou inférieure, ou pour une demande dépassant ce cadre, les tests et relations ordinaires restent applicables."}
  ]},
  {id:"protection-et-renommee",title:"Protection et réputation d’une organisation",level:2,blocks:[
    {type:"p",text:"Le talent Protection peut s’appuyer sur la meilleure valeur entre la Renommée personnelle et celle de l’organisation localement reconnue, jamais sur leur somme. Cette valeur d’organisation est fixée pour le territoire et la situation ; ce n’est pas un score mondial automatique."},
    {type:"p",text:"Une affiliation réelle et crédible permet, une fois par scène, de faire renoncer un adversaire ou petit groupe de moindre Renommée à une intimidation, un racket ou une hostilité limitée, et de se retirer. À égalité ou face à une valeur supérieure, la confrontation se résout normalement. Une guerre ouverte ou une vendetta majeure n’est pas annulée par cette dissuasion."}
  ]},
  {id:"progression-renommee",title:"Progression de Renommée",level:2,blocks:[
    {type:"p",text:"À la fin d’un scénario, le MJ peut accorder +1 lorsqu’un accomplissement attribué au personnage élargit réellement la portée de son nom, dans la limite de 5. Ce n’est pas une récompense automatique de chaque combat. Une opération restée secrète ne rend pas célèbre ; un scandale peut accroître la Renommée tout en dégradant la Réputation."},
    {type:"p",text:"Le talent Renommé augmente la Renommée de 1, à la création ou lors de son acquisition ultérieure. Il n’est pas répétable et n’accorde pas de progression au-delà de 5. Les évolutions de campagne sont consignées séparément du bonus du talent pour éviter les doubles attributions."}
  ]}
];
