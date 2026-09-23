type Article = { id:string; sections?:Array<Record<string,any>>; [key:string]:any };
export type Tier = "entraine"|"elite"|"haute"|"heroique";
export type Shape = "esprit"|"social"|"terrain"|"equilibre";
export type StatProfile = { tier:Tier; shape:Shape; skills:string[]; anchor:string; talents:string[]; truth?:string };
type Profile = StatProfile & { slug:string };

// Each entry records an editorial reading of one active corporate dossier.
// The shared renderer performs only arithmetic and layout; it does not infer a
// tier, ability, talent, or supernatural power from the corporation's name.
const PROFILES:Profile[] = [
  {slug:"stanley-vandendriessche",tier:"elite",shape:"social",skills:["Commerce","Autorité","Investigation","Diplomatie"],anchor:"OPA sur Burger King puis rachat de Yum! Brands à partir de Tiny Sushi ; négociateur et bâtisseur de Yellow Food.",talents:["Réseau mobilisable — Yellow Food","Dossier préparé — acquisitions"]},
  {slug:"joana-kyong",tier:"elite",shape:"social",skills:["Commerce","Investigation","Autorité","Diplomatie"],anchor:"Ancienne cadre de McDonald Corporation ; corruption politique, manœuvres contre son président et recours à des intermédiaires.",talents:["Dossier préparé — rivalités internes","Réseau mobilisable — relations politiques"]},
  {slug:"damayanti-randhawa",tier:"elite",shape:"social",skills:["Commerce","Autorité","Diplomatie","Investigation"],anchor:"Principale actionnaire devenue directrice d'Asco après la mort du fondateur ; négociatrice redoutée sous des dehors affables.",talents:["Réseau mobilisable — Asco","Expertise éprouvée — Commerce"]},
  {slug:"munke-ghaimur",tier:"elite",shape:"social",skills:["Autorité","Investigation","Commerce","Force Mentale"],anchor:"Vice-président d'Asco issu du milieu équestre ; inflexibilité et prise de pouvoir meurtrière décrites dans son parcours.",talents:["Dossier préparé — succession d'Asco","Chaîne de commandement — Asco"]},
  {slug:"keith-butler-khmelnov-veitlovich",tier:"elite",shape:"social",skills:["Commerce","Autorité","Investigation","Diplomatie"],anchor:"Oligarque expatrié, propriétaire de ranchs et acteur de la concentration de Dwarfood.",talents:["Réseau mobilisable — Dwarfood","Expertise éprouvée — Commerce"]},
  {slug:"warren-walton",tier:"haute",shape:"esprit",skills:["Commerce","Investigation","Savoirs","Autorité"],anchor:"Formation financière britannique ; développement d'Ocean Master à partir des rapports sur la dégradation environnementale.",talents:["Dossier préparé — marchés maritimes","Réseau mobilisable — Ocean Master"]},
  {slug:"shaylinn-lukas",tier:"elite",shape:"social",skills:["Commerce","Diplomatie","Autorité","Investigation"],anchor:"Vice-présidente d'Ocean Master, manœuvrière des affaires et consommatrice de traitements de rajeunissement ; aucun avantage augmentique chiffré n'en découle.",talents:["Expertise éprouvée — Commerce","Réseau mobilisable — Ocean Master"]},
  {slug:"jie-luo",tier:"elite",shape:"esprit",skills:["Commerce","Autorité","Force Mentale","Investigation"],anchor:"Présidente taciturne d'Herbrews, réputée pour ses décisions commerciales implacables.",talents:["Expertise éprouvée — Commerce","Chaîne de commandement — Herbrews"]},
  {slug:"aghna-ui-siomoin",tier:"elite",shape:"social",skills:["Commerce","Diplomatie","Représentation","Autorité"],anchor:"Héritière d'une maison de whiskey irlandais, moteur de partenariats culturels autour d'Herbrews.",talents:["Réseau mobilisable — Herbrews","Expertise éprouvée — Commerce"]},
  {slug:"elianna-knowles",tier:"haute",shape:"esprit",skills:["Commerce","Savoirs","Autorité","Investigation"],anchor:"Fondatrice de Mastersky et proche d'une scientifique du CPRC ; elle a tenu l'entreprise face à la concurrence.",talents:["Dossier préparé — concurrence industrielle","Réseau mobilisable — Eversor"]},
  {slug:"saleem-el-khayat",tier:"haute",shape:"social",skills:["Diplomatie","Commerce","Autorité","Investigation"],anchor:"Prince d'Iranie et fils de diplomate ; Wellspring s'appuie sur les ressources minières et des alliances internationales.",talents:["Réseau mobilisable — Wellspring","Dossier préparé — négociations énergétiques"]},
  {slug:"ntando-ziyane",tier:"elite",shape:"social",skills:["Commerce","Investigation","Autorité","Diplomatie"],anchor:"Cadre pétrochimique passé par la Chine et l'Amérique du Sud, avec parcours criminel puis retour aux affaires.",talents:["Dossier préparé — dossiers industriels","Réseau mobilisable — Wellspring"]},
  {slug:"siobhain-nic-siridean",tier:"haute",shape:"social",skills:["Représentation","Autorité","Diplomatie","Commerce"],anchor:"Actrice devenue figure mondiale, productrice et présidente de Tuatha ; ses soutiens publics et sa lignée privée sont distincts.",talents:["Réseau mobilisable — Tuatha","Expertise éprouvée — Représentation"],truth:"Sa lignée et son éveil liés au Sidh figurent dans le dossier MJ ; PTV et forme révélée demandent un arbitrage séparé."},
  {slug:"hunter-o-brien",tier:"elite",shape:"social",skills:["Commerce","Autorité","Investigation","Diplomatie"],anchor:"Successeur de Robert Iger à la tête de Disney ; gestion des capitaux puis arrivée chez Tuatha.",talents:["Dossier préparé — participations médiatiques","Réseau mobilisable — Tuatha"]},
  {slug:"ryunosuke-yodokawa",tier:"haute",shape:"social",skills:["Autorité","Commerce","Diplomatie","Investigation"],anchor:"Jeune président de Dreampoint, entouré de conseillers et d'un réseau capable de tenir face à Tuatha.",talents:["Réseau mobilisable — Dreampoint","Chaîne de commandement — Dreampoint"]},
  {slug:"ippei-takano",tier:"haute",shape:"esprit",skills:["Commerce","Investigation","Autorité","Savoirs"],anchor:"Stratège commercial de Dreampoint ; fournit des drones au PCRC pendant la guerre et pilote la relance de l'entreprise.",talents:["Dossier préparé — stratégie commerciale","Réseau mobilisable — Dreampoint"]},
  {slug:"gabriella-austin",tier:"haute",shape:"social",skills:["Représentation","Commerce","Autorité","Investigation"],anchor:"Héritière de dynasties de presse, présidente de Nexstar, attentive aux ventes et à la véracité des informations publiées.",talents:["Réseau mobilisable — Nexstar","Dossier préparé — enquête éditoriale"]},
  {slug:"wei-shi",tier:"haute",shape:"social",skills:["Investigation","Représentation","Diplomatie","Perception"],anchor:"Journaliste mondiale et vice-présidente de Nexstar ; son dossier distingue sa carrière publique des événements cachés de 2035.",talents:["Lecture des failles — enquête","Réseau mobilisable — rédaction Nexstar"],truth:"Le changement de 2035 décrit dans le dossier MJ exige un profil de Vérité propre ; PTV non fixés ici."},
  {slug:"janenda-cole",tier:"elite",shape:"social",skills:["Représentation","Commerce","Autorité","Diplomatie"],anchor:"Artiste issue de Compton et du rap, devenue présidente d'Omegacoustics grâce à sa carrière et à ses négociations.",talents:["Expertise éprouvée — Représentation","Réseau mobilisable — Omegacoustics"]},
  {slug:"yoon-ju-sowu",tier:"elite",shape:"social",skills:["Représentation","Diplomatie","Commerce","Force Mentale"],anchor:"Ancienne artiste de K-pop captive pendant la guerre puis sauvée par des soldats ; sa carrière publique n'établit pas un entraînement militaire.",talents:["Expertise éprouvée — Représentation","Réseau mobilisable — Omegacoustics"]},
  {slug:"linda-maerris",tier:"elite",shape:"social",skills:["Commerce","Autorité","Diplomatie","Investigation"],anchor:"Gestion des bars et nightclubs de RedWheels, où elle tient la fonction de bras droit et de négociatrice.",talents:["Réseau mobilisable — RedWheels","Dossier préparé — établissements"]},
  {slug:"daxton-cash",tier:"elite",shape:"social",skills:["Représentation","Commerce","Autorité","Force Mentale"],anchor:"Bassiste puis artiste solo devenu président de Hound Record ; son parcours comporte des crises personnelles et une reconstruction.",talents:["Expertise éprouvée — Représentation","Réseau mobilisable — Hound Record"]},
  {slug:"victoria-saez",tier:"elite",shape:"social",skills:["Commerce","Représentation","Diplomatie","Investigation"],anchor:"Issue de l'insurrection civile mexicaine et liée au milieu musical de sa famille ; vice-préside Hound Record.",talents:["Réseau mobilisable — Hound Record","Dossier préparé — contacts culturels"]},
  {slug:"nelhino-ricardo-mendo",tier:"elite",shape:"terrain",skills:["Survie","Investigation","Autorité","Commerce"],anchor:"A traversé l'insurrection du Mozambique et observé les méthodes mercenaires avant de rejoindre Raven Industries ; formation au tir non attestée.",talents:["Terrain reconnu — zones de conflit","Réseau mobilisable — Raven Industries"]},
  {slug:"athinea-dimitrios",tier:"elite",shape:"social",skills:["Commerce","Diplomatie","Autorité","Investigation"],anchor:"Cadre expérimentée, numéro deux de Phoenix, réputée pour ses négociations d'affaires redoutables.",talents:["Dossier préparé — négociations","Réseau mobilisable — Phoenix"]},
  {slug:"melina-byron-smith",tier:"haute",shape:"esprit",skills:["Savoirs","Commerce","Autorité","Investigation"],anchor:"Ancienne professeure de physique, héritière de Gerald Byron et dirigeante de Byron Industries après sa campagne de rachats.",talents:["Expertise éprouvée — Savoirs","Réseau mobilisable — Byron Industries"]},
  {slug:"oakley-mclean",tier:"haute",shape:"esprit",skills:["Savoirs","Investigation","Mécanique","Autorité"],anchor:"Chercheur en physique du PCRC, acteur du bond technologique ; ses traumatismes ne constituent pas un talent chiffré.",talents:["Expertise éprouvée — Savoirs","Lecture des failles — recherche"]},
  {slug:"robert-sykes",tier:"elite",shape:"terrain",skills:["Pugilat","Commerce","Autorité","Représentation"],anchor:"Ancien catcheur et commentateur sportif, reconverti dans les paris et les courses de Bullmotors.",talents:["Lutte brève — Pugilat","Réseau mobilisable — Bullmotors"]},
  {slug:"tekkan-kirishima",tier:"haute",shape:"terrain",skills:["Pugilat","Athlétisme","Force Mentale","Autorité"],anchor:"Ancien rikishi réputé invincible, entré dans l'effort de guerre après la mort de ses frères ; liens yakuzas documentés.",talents:["Lutte brève — Pugilat","Réseau mobilisable — liens industriels"]},
  {slug:"kristia-jacobsen",tier:"haute",shape:"esprit",skills:["Neurodive","Investigation","Savoirs","Autorité"],anchor:"Neurodiver corporatiste de grande renommée, promue vice-présidente d'Arcanetworks.",talents:["Expertise éprouvée — Neurodive","Lecture des failles — investigation numérique"]},
  {slug:"young-see-wang",tier:"haute",shape:"esprit",skills:["Savoirs","Mécanique","Investigation","Autorité"],anchor:"Scientifique du PCRC spécialisée dans les IA, cofondatrice de l'Holonet puis cadre de Monarch Systems.",talents:["Expertise éprouvée — Savoirs","Réseau mobilisable — Monarch Systems"]},
  {slug:"kai-farley",tier:"haute",shape:"esprit",skills:["Savoirs","Investigation","Mécanique","Commerce"],anchor:"Mathématicien et chercheur fondamental à l'origine d'Aces ; ses compétences sociales ne sont pas extrapolées de sa fonction.",talents:["Expertise éprouvée — Savoirs","Lecture des failles — modélisation"]},
  {slug:"kadeena-jackson",tier:"haute",shape:"social",skills:["Commerce","Diplomatie","Autorité","Investigation"],anchor:"Diplômée de commerce, responsable de la stratégie ayant transformé les avancées techniques de Farley en Aces Corporation.",talents:["Expertise éprouvée — Commerce","Réseau mobilisable — Aces"],truth:"Le dossier MJ contient une ascendance de Vérité ; ses capacités et ses PTV ne sont pas déduits de sa carrière commerciale."},
  {slug:"lenavah-uriel",tier:"haute",shape:"esprit",skills:["Soin","Savoirs","Investigation","Autorité"],anchor:"Médecin et généticienne du PCRC, fondatrice de Biosun, spécialisée dans les augmentations et le corps humain.",talents:["Expertise éprouvée — Soin","Réseau mobilisable — Biosun"],truth:"Les affiliations du dossier MJ et leurs éventuelles capacités restent distinctes de la médecine publique ; PTV à arbitrer."},
  {slug:"serge-laubert",tier:"elite",shape:"social",skills:["Diplomatie","Commerce","Représentation","Autorité"],anchor:"Entrepreneur français sorti d'un milieu modeste grâce à son éloquence, ses alliances et Sunways.",talents:["Expertise éprouvée — Diplomatie","Réseau mobilisable — Sunways"]},
  {slug:"ranjit-bhagat",tier:"elite",shape:"social",skills:["Savoirs","Commerce","Investigation","Diplomatie"],anchor:"Héritier d'une entreprise pharmachimique indienne, réfugié après le meurtre de son père et cadre de Sunways.",talents:["Dossier préparé — secteur pharmachimique","Réseau mobilisable — Sunways"]},
  {slug:"kyu-ri-sung",tier:"elite",shape:"esprit",skills:["Investigation","Commerce","Autorité","Force Mentale"],anchor:"Survivante de la guerre de Corée après une période de résistance, devenue présidente d'Antelligence ; aucune spécialisation de combat n'est déduite de cette seule survie.",talents:["Dossier préparé — concurrence technologique","Réseau mobilisable — Antelligence"]},
  {slug:"blake-weiss",tier:"elite",shape:"esprit",skills:["Mécanique","Savoirs","Commerce","Investigation"],anchor:"Études d'informatique, travail sur les implants neuraux d'Antelligence puis vice-présidence.",talents:["Expertise éprouvée — Mécanique","Dossier préparé — implants neuraux"]},
  {slug:"katja-de-jankath",tier:"haute",shape:"social",skills:["Autorité","Commerce","Investigation","Diplomatie"],anchor:"Présidente d'Ushkoll Security et cheffe institutionnelle d'une force mercenaire mondiale ; aucune aptitude personnelle de terrain n'est attestée par ce seul poste.",talents:["Chaîne de commandement — Ushkoll","Réseau mobilisable — Ushkoll"]},
  {slug:"scott-riggs",tier:"haute",shape:"terrain",skills:["Autorité","Survie","Investigation","Tir"],anchor:"Général de l'US Army pendant et après la guerre de Corée, remarqué pour ses prouesses tactiques et son commandement.",talents:["Chef de manœuvre — vétérans","Terrain reconnu — opérations militaires"]},
  {slug:"feng-tsung",tier:"haute",shape:"terrain",skills:["Autorité","Survie","Tir","Investigation"],anchor:"Général chinois ayant mené un bataillon vers Pyongyang et participé aux opérations de l'armée de libération.",talents:["Chef de manœuvre — unité militaire","Terrain reconnu — opérations militaires"]},
  {slug:"keishi-mishima",tier:"elite",shape:"social",skills:["Commerce","Autorité","Investigation","Savoirs"],anchor:"Héritier d'un keiretsu d'armement puis fondateur de Tortoise Security après la faillite familiale ; le dossier ne documente pas son entraînement au combat.",talents:["Dossier préparé — marchés d'armement","Réseau mobilisable — Tortoise"]},
  {slug:"quahna-alvarez",tier:"elite",shape:"terrain",skills:["Survie","Tir","Autorité","Athlétisme"],anchor:"Engagée dès 2022 et survivante de la guerre, désormais vice-présidente de Tortoise ; elle n'est pas décrite comme une combattante du niveau de Tokala.",talents:["Terrain reconnu — opérations militaires","Réseau mobilisable — Tortoise"]},
  {slug:"tashca",tier:"entraine",shape:"social",skills:["Autorité","Diplomatie","Commerce","Investigation"],anchor:"Ancienne participante à la campagne de Dina Page, passée par la Grande Réserve puis par la direction de Tala avec Tokala.",talents:["Réseau mobilisable — Grande Réserve et Tala"]},
  {slug:"zachariah-kaufmann",tier:"haute",shape:"esprit",skills:["Investigation","Savoirs","Diplomatie","Autorité"],anchor:"Ancien procureur de Los Angeles ayant enquêté sur l'affaire U.S. Bank Tower, puis fondateur de son cabinet juridique.",talents:["Dossier préparé — contentieux","Lecture des failles — enquête"]},
  {slug:"garrett-terrell",tier:"haute",shape:"social",skills:["Diplomatie","Savoirs","Investigation","Commerce"],anchor:"Avocat international des procès de guerre et des affaires corporatistes ; maîtrise des contentieux internationaux.",talents:["Expertise éprouvée — Diplomatie","Dossier préparé — jurisprudence"]},
  {slug:"sun-mi-somung",tier:"haute",shape:"esprit",skills:["Soin","Savoirs","Autorité","Investigation"],anchor:"Infirmière promue médecin pendant la guerre après une neuro-formation risquée, puis présidente de Northstar.",talents:["Expertise éprouvée — Soin","Réseau mobilisable — Northstar"]},
  {slug:"lamar-k-rice",tier:"elite",shape:"esprit",skills:["Soin","Survie","Investigation","Autorité"],anchor:"Médecin de l'armée britannique pendant le conflit de 2022, puis cadre de Northstar ; expérience médicale et de terrain documentée.",talents:["Expertise éprouvée — Soin","Terrain reconnu — zones de guerre"]},
  {slug:"xintia-shen",tier:"entraine",shape:"social",skills:["Commerce","Autorité","Diplomatie","Investigation"],anchor:"Jeune héritière de Corebank après la mort du grand-père et des héritiers directs ; la propriété n'implique pas encore une expertise légendaire.",talents:["Réseau mobilisable — Corebank"]},
  {slug:"zisham-bishop",tier:"elite",shape:"social",skills:["Commerce","Diplomatie","Autorité","Investigation"],anchor:"Banquier international issu d'un quartier défavorisé, connu pour sa réussite et sa non-violence personnelle.",talents:["Expertise éprouvée — Commerce","Réseau mobilisable — Corebank"]},
  {slug:"samantha-borrmann",tier:"elite",shape:"esprit",skills:["Commerce","Autorité","Investigation","Savoirs"],anchor:"Formée à la finance après l'Académie des Saintes Lagunes, chargée du marché asiatique puis dirigeante de Laguna Bank.",talents:["Dossier préparé — marchés bancaires","Réseau mobilisable — Laguna Bank"]},
  {slug:"shuji-kashiwa",tier:"haute",shape:"social",skills:["Langages & Argot","Commerce","Diplomatie","Autorité"],anchor:"Fils de diplomate et polyglotte hors pair, fondateur d'une grande corporation bancaire asiatique.",talents:["Expertise éprouvée — Langages & Argot","Réseau mobilisable — Liao Kashiwa"]},
  {slug:"stephania-volkov",tier:"elite",shape:"esprit",skills:["Savoirs","Commerce","Investigation","Autorité"],anchor:"Études de droit et d'économie à l'Académie des Saintes Lagunes, enseignement puis carrière chez Liao Kashiwa.",talents:["Dossier préparé — droit et finance","Réseau mobilisable — Liao Kashiwa"],truth:"Son dossier MJ comporte un ordre religieux et des informations cachées ; PTV non déduits de sa formation civile."}
];

const TIERS:Record<Tier,{label:string;attributes:number;budget:number;ranks:number[]}>={
  entraine:{label:"Entraîné",attributes:25,budget:40,ranks:[7,6,6,5,5,4,3,2,2]},
  elite:{label:"Élite",attributes:28,budget:55,ranks:[9,8,7,6,6,5,5,4,3,2]},
  haute:{label:"Haute élite",attributes:32,budget:75,ranks:[10,9,9,8,8,8,7,6,5,5]},
  heroique:{label:"Héroïque",attributes:38,budget:110,ranks:[13,12,11,10,10,10,9,9,8,8,5,5]}
};
const ATTRIBUTES:Record<Tier,Record<Shape,number[]>>={
  entraine:{esprit:[4,4,7,5,5],social:[4,4,5,5,7],terrain:[6,6,4,5,4],equilibre:[5,5,5,5,5]},
  elite:{esprit:[4,4,8,7,5],social:[4,4,6,6,8],terrain:[7,7,4,6,4],equilibre:[6,6,6,6,4]},
  haute:{esprit:[4,5,10,7,6],social:[5,5,7,7,8],terrain:[8,8,5,6,5],equilibre:[7,7,7,6,5]},
  heroique:{esprit:[6,6,10,9,7],social:[6,6,8,8,10],terrain:[10,10,6,7,5],equilibre:[8,8,8,7,7]}
};
const FALLBACKS:Record<Shape,string[]>={
  esprit:["Savoirs","Investigation","Perception","Mécanique","Force Mentale","Diplomatie","Autorité","Constitution","Esquive","Athlétisme","Commerce","Furtivité"],
  social:["Commerce","Autorité","Diplomatie","Investigation","Perception","Force Mentale","Savoirs","Constitution","Esquive","Athlétisme","Représentation","Survie"],
  terrain:["Athlétisme","Esquive","Perception","Survie","Force Mentale","Autorité","Constitution","Investigation","Tir","Mêlée","Pugilat","Diplomatie"],
  equilibre:["Investigation","Perception","Autorité","Diplomatie","Savoirs","Force Mentale","Esquive","Constitution","Athlétisme","Commerce","Tir","Survie"]
};
const p=(text:string)=>({type:"p",text});
const table=(rows:string[][])=>({type:"table",rows});

export function applyCorporatePnjStats(byId:Map<string,Article>):void {
  if(PROFILES.length!==53||new Set(PROFILES.map(p=>p.slug)).size!==53)throw new Error("PNJ · lot corporations incomplet ou dupliqué");
  for(const profile of PROFILES){
    const id=`pnj-corporations-${profile.slug}`;
    const article=byId.get(id);
    if(!article||article.dataset!=="realite-v9-corporations-pnj")throw new Error(`PNJ · fiche corporation introuvable : ${id}`);
    applyNamedPnjStatProfile(article,profile);
  }
}

export function applyNamedPnjStatProfile(article:Article,profile:StatProfile):void {
  const id=article.id;
  const tier=TIERS[profile.tier];
  const attributes=ATTRIBUTES[profile.tier][profile.shape];
  if(attributes.reduce((sum,value)=>sum+value,0)!==tier.attributes||
     tier.ranks.reduce((sum,value)=>sum+value,0)!==tier.budget)throw new Error(`PNJ · budget incohérent : ${id}`);
  const skills=[...new Set([...profile.skills,...FALLBACKS[profile.shape]])].slice(0,tier.ranks.length);
  if(skills.length!==tier.ranks.length||profile.skills.length<4)throw new Error(`PNJ · compétences insuffisantes : ${id}`);
  const ranks=new Map(skills.map((skill,index)=>[skill,tier.ranks[index]]));
  const [vigor,agility,,will]=attributes;
  const constitution=ranks.get("Constitution")??0;
  const evasion=ranks.get("Esquive")??0;
  const mental=ranks.get("Force Mentale")??0;
  const athletics=ranks.get("Athlétisme")??0;
  const blocks=[
    p(`${tier.label} · Réalité · ${tier.attributes} points d'Attributs · ${tier.budget} points de Compétences. Ancrage dans la fiche : ${profile.anchor}`),
    table([["Attribut","Vigueur","Agilité","Esprit","Volonté","Charisme"],["Valeur",...attributes.map(String)]]),
    table([["Compétence","Rang"],...skills.map((skill)=>[skill,String(ranks.get(skill))]),["Autres compétences","0"]]),
    table([["Valeur dérivée","Résultat"],["PV maximum / Seuil de Mort",`${2*vigor+constitution} / −${vigor+constitution}`],["Défense passive / active",`${agility+evasion} / ${agility+evasion} + 1d10e`],["Défense occulte passive / active",`${will+mental} / ${will+mental} + 1d10e`],["Initiative / déplacement",`${agility+athletics} + 1d10e / ${5+athletics} m par PA`]]),
    p(`Talents proposés : ${profile.talents.join(" ; ")}. Chaque effet suit ses prérequis et ses limites du catalogue MJ. Les personnels, armes, implants et armures ne sont jamais supposés disponibles sans scène ou source.`),
    p(profile.truth??"Vérité : aucune capacité surnaturelle, forme révélée ou dépense de PTV n'est déduite de la biographie publique. Le dossier MJ conserve les éventuels secrets sans leur attribuer de chiffres supplémentaires.")
  ];
  const sections=article.sections??[];
  const statistics=sections.filter(section=>section.id==="profil-statistique");
  if(statistics.length!==1||sections.at(-1)!==statistics[0]||statistics[0].blocks?.length)throw new Error(`PNJ · profil déjà rempli ou ambigu : ${id}`);
  statistics[0].title=`Profil statistique · ${article.title}`;
  statistics[0].audience="mj";
  statistics[0].blocks=blocks;
}
