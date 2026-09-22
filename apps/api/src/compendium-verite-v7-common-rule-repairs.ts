type ParagraphBlock = { type: "p"; text: string; style?: string };
type TableBlock = { type: "table"; rows: unknown[][] };
type Block = ParagraphBlock | TableBlock;
export type CommonRuleSection = { id: string; title: string; level: number; audience?: "mj"; blocks: Block[] };

const p = (text: string, style?: string): ParagraphBlock => style ? { type: "p", text, style } : { type: "p", text };
const table = (rows: unknown[][]): TableBlock => ({ type: "table", rows });

const RULE_BLOCKS: Record<string, Block[]> = {
  "1-architecture-de-la-verite": [
    p("La Vérité regroupe Natures, héritages, traditions, doctrines, fonctions et disciplines. L’XP décrit l’expertise profane ; les PTV décrivent ce que le personnage est, ce qu’une tradition de Vérité lui a appris à devenir, ou une manière exceptionnelle d’utiliser ses capacités."),
    table([
      ["Couche", "Principe"],
      ["Nature", "Ce que le personnage est."],
      ["Origine / héritage", "Branche de Nature ou ascendance de Vérité."],
      ["Tradition / doctrine / fonction", "Formation distinctive, pas nécessairement surnaturelle."],
      ["Statut", "Habilitation, rang, réputation ou fonction sociale ; narratif sauf maîtrise distincte."],
      ["Équipement", "Ce que le personnage possède ; jamais acheté par PTV."]
    ])
  ],
  "ptv-et-competences-profanes": [
    p("Un Talent peut améliorer une action profane — bonus, relance, DR, auto-Assistance, exception d’action — s’il représente une Nature, une discipline ou une doctrine distinctive qui s’ajoute réellement à l’expertise. Il ne remplace pas simplement un métier, une connaissance, un objet ou une ressource absente.", "tech"),
    p("Les anciens « Compétence au minimum X » deviennent +X lorsqu’ils expriment une aptitude de Vérité : le novice est aidé et le spécialiste peut dépasser le plafond humain."),
    table([
      ["Coût", "Intention"],
      ["1 PTV", "signature utile ou ouverture spécialisée"],
      ["2 PTV", "effet puissant ou règle modifiée"],
      ["3 PTV", "effet majeur, rare ou nouvelle dimension d’action"]
    ]),
    table([
      ["Accès", "Sens"],
      ["N — Naturel", "accès canonique/culturel ; Talent à acheter"],
      ["O — Ouvert", "formation ou mentor crédible"],
      ["R — Restreint", "origine rare, initiation ou accès difficile"],
      ["X — Incompatible", "incompatibilité réelle de Nature ou de principe"]
    ]),
    p("Cross-training : possible si la fiction le permet ; signatures racines, prérequis biologiques, initiatiques et matériels restent applicables.")
  ],
  "doctrine-fonction-et-reseau-de-verite": [
    p("Une voie PTV peut représenter une fonction, une doctrine ou une culture opérationnelle de Vérité sans être surnaturelle. Elle est légitime lorsqu’elle formalise une manière distinctive d’agir, d’intégrer une faction ou d’exploiter ses codes — Hordes, Croix d’Emphyrra, Syndicat de Jade, Mafia Shaediri, etc. Elle ne remplace jamais l’existence réelle des moyens requis."),
    p("Un réseau de Vérité n’apparaît jamais parce qu’un Talent est acheté. Si le réseau, la route, le relais, le vendeur ou la ressource existe réellement, l’initié sait en reconnaître les signes, s’authentifier et utiliser les procédures auxquelles son degré d’intégration lui donne accès. Prix, délais, risques et disponibilité restent réels.")
  ],
  "3-pa-reactions-durees-et-non-cumul": [
    p("• Actif : 1 PA par défaut ; 2–3 PA ou préparation longue si indiqué.", "list"),
    p("• Maximum normal : 3 PA. Une capacité accorde normalement au plus +1 PA, donc 4. Plusieurs gains directs ne se cumulent pas sauf exception explicite.", "list"),
    p("• Exception écrite possible : le Surrégime Garou Écarlate se cumule avec le +1 PA Hybride et peut atteindre 5 PA.", "list"),
    p("• Une Réaction dépense un PA, sauf PA de Réaction spécialisé explicitement créé.", "list"),
    p("• Une relance de Talent maximum par test. Une réduction générique de Difficulté maximum par effets externes ; les moteurs internes comme Amplitude/portée/Canalisation Mage suivent leurs propres règles.", "list"),
    p("• Deux effets substantiellement équivalents ne se cumulent pas sauf mention explicite. Une seule Assistance effective peut s’appliquer à un même test.", "list"),
    p("• Bras, tentacules, queues et appendices supplémentaires n’accordent jamais d’eux-mêmes PA, Attaque, Défense active ou Réaction supplémentaires.", "list")
  ],
  "arbitrage-transversal-des-chevauchements": [
    p("• Une même conséquence mortelle ne bénéficie que d’un seul effet surnaturel d’annulation/report/remplacement de Mort, sauf exception écrite.", "list"),
    p("• Compagnon, double, invocation ou projection contrôlée : aucun pool de PA joueur indépendant sauf règle explicite.", "list"),
    p("• Pouvoir copié/emprunté : conserve les prérequis de Nature, V/SR/R et lien externe sauf exception explicite.", "list"),
    p("• Une réaction pré-fuite doit l’indiquer ; aucune poursuite rétroactive après téléportation résolue.", "list"),
    p("• Une Altération automatique n’en crée pas une seconde de même nature si l’action en accordait déjà une.", "list"),
    p("• Voir sous le Voile n’est jamais Révéler.", "list")
  ],
  "4-defense-occulte-et-puissance-des-effets": [
    p("Une imposition directe sur esprit, âme, volonté, identité ou intérieur du corps utilise la Défense occulte. Un phénomène physiquement évitable utilise la Défense physique. Jamais les deux pour le même effet."),
    table([
      ["Défense occulte", "Formule"],
      ["Passive", "Volonté + Force Mentale"],
      ["Active — 1 PA", "Volonté + Force Mentale + 1d10e"]
    ]),
    table([
      ["Puissance", "Valeur"],
      ["Jet de création connu", "résultat de création/maintien"],
      ["Source présente", "jet approprié de la Source"],
      ["Autonome", "12 mineur ; 15 courant ; 18 fort ; 21 majeur ; 25 exceptionnel"]
    ])
  ],
  "5-hologramme-voile-semi-revelation-et-revelation": [
    p("L’Hologramme est un construct technomagique planétaire qui traduit physiquement les êtres et phénomènes de Vérité en une cohérence humaine. Ce n’est pas une simple illusion visuelle."),
    table([
      ["État", "Effet"],
      ["V", "forme traduite ; capacités compatibles V seulement"],
      ["SR", "Vérité partielle, métastable, normalement une scène maximum"],
      ["R", "Vérité pleinement exprimée ; l’apparence peut rester humaine selon la Nature"]
    ]),
    p("Transition sous pression : normalement 1 PA, jet seulement si opposition active. Aucune action générique ne force R→V ; seuls les effets qui l’autorisent explicitement le peuvent."),
    table([
      ["Cible", "Observation"],
      ["Cible V", "V/SR/R voient normalement la traduction, sauf perception spéciale"],
      ["Cible SR", "V voit la traduction ; SR/R voit la Vérité partielle"],
      ["Cible R", "la Vérité exprimée est visible par tous"]
    ]),
    p("Un observateur R ne voit pas automatiquement la Vérité d’une cible restée V. Voir sous le Voile ne Révèle pas.", "tech"),
    p("L’Hologramme peut corriger souvenirs et preuves ordinaires. Les supports invariants résistent aux corrections ordinaires mais n’enregistrent jamais ce que leurs capteurs n’ont pas perçu. HDS/Holojamer peut maintenir V et bloquer V→SR/R ; aucun R→V générique.")
  ],
  "dissimulation-surnaturelle-et-capteurs": [
    p("Lorsqu’un effet indique qu’une cible devient surnaturellement invisible, les perceptions profanes ordinaires suivent normalement la traduction de la Réalité/Hologramme : vision, caméras et capteurs ordinaires ne révèlent pas la cible. Une perception véritablement surnaturelle et adaptée peut néanmoins la percevoir lorsque sa nature le permet. Un pouvoir qui décrit une dissimulation plus limitée suit son propre texte.", "tech")
  ],
  "7-humains-chasseurs-reconnus-humanite-et-integrite": [
    p("L’Humain conscient connaît la Vérité mais peut encore subir des corrections. Un véritable Chasseur est reconnu par l’Hologramme : les corrections civiles ordinaires cessent d’effacer ce qu’il a réellement vu, sans lui donner vision de V, identification automatique ni immunité aux attaques explicites de mémoire."),
    table([
      ["Valeur", "Règle"],
      ["Intégrité", "Force Mentale + Humanité, minimum 1"],
      ["Stress augmentique max", "Vigueur + Humanité"],
      ["Charge augmentique", "jauge indépendante utilisant l’Intégrité"],
      ["Corruption", "jauge indépendante utilisant la même Intégrité"]
    ]),
    p("Seules les valeurs permanentes de Force Mentale/Humanité modifient l’Intégrité.")
  ],
  "8-compagnons-lies-et-reseaux-de-verite": [
    p("• Compagnon = PNJ réel avec stats, PV, sens, pouvoirs, faiblesses et personnalité.", "list"),
    p("• Par défaut un seul compagnon actif.", "list"),
    p("• Aucun pool de PA indépendant ; actions tactiques et défenses utilisent les PA du maître.", "list"),
    p("• Perdre la créature ne fait pas perdre le Talent ; PTV achète le lien, jamais la créature.", "list"),
    p("• Développements communs : Lien surnaturel 2 ; Résonance liée 1 ; Accueil de l’essence 2 ; Invocation liée 3.", "list")
  ],
  "reseaux-de-verite": [
    p("Un Talent de réseau ne crée jamais vendeur, planque, filière, marchandise ou service. Il représente l’intégration suffisante pour lire et exploiter codes, signes, procédures, relais et voies clandestines d’un réseau qui existe réellement. Disponibilité, prix, délais et risques restent fictionnels.", "tech"),
    p("Cette règle couvre notamment Syndicat de Jade, Mafia Shaediri, Shaekori et réseaux analogues. Certaines institutions restent volontairement sans arbre PTV lorsque leur intérêt est principalement statutaire ou logistique.")
  ],
  "armure-corporelle-et-reductions": [
    p("Une Armure corporelle est une Armure de base portée par le corps lui-même : peau, carapace, tissus minéralisés, armure dermique ou protection surnaturelle explicitement corporelle. Par défaut, une « Armure naturelle » de Vérité doit être lue comme une Armure corporelle. L’Armure est la couche matérielle de base ; les Réductions typées (Mêlée, Antichoc, Balistique, Feu, Neuro, etc.) restent distinctes et ne s’appliquent qu’à leur vecteur.", "tech"),
    p("Pour le cumul, utiliser la meilleure Armure corporelle applicable ; elle peut se cumuler avec l’Armure portée selon les règles de Réalité, mais deux couches corporelles ne s’additionnent pas sauf texte explicite.", "tech")
  ],
  "interfaces-etrangeres-et-neurodive": [
    p("Un système électronique, connecté ou en réseau n’est pas automatiquement compatible avec le Neurodive terrestre. Il faut une voie de données réelle et une interface/protocole compatibles, traduits ou effectivement adaptés. Une fois cette compatibilité obtenue, Intrusion, Contrôle et Neurocombat utilisent le moteur Neurodive normal.", "tech"),
    p("Magie pure, âme, tissu biologique, pouvoir de Nature ou substrat technobiologique sans interface accessible ne deviennent jamais des cibles Neuro par leur seule existence ; le nuage nanitique intégré d’un Homo Superior n’est notamment pas Neuro-hackable par défaut.", "tech"),
    p("• PTV achète une maîtrise, technique, calibration ou capacité d’exploitation, jamais la possession d’un objet.", "list"),
    p("• Perdre un objet ne fait pas perdre les PTV investis.", "list"),
    p("• Prototype = objet réel, volable, destructible, réparable et parfois utilisable par un tiers.", "list"),
    p("• Un objet fixe n’accorde jamais les Talents de son créateur.", "list"),
    p("• Artefacts uniques, armes de lignée et reliques de PNJ restent hors catalogue ordinaire.", "list")
  ]
};

/** Restores canonical paragraph, list and table boundaries lost during import. */
export function repairCommonRuleSections(sections: CommonRuleSection[]): CommonRuleSection[] {
  return sections.map((section) => {
    const blocks = RULE_BLOCKS[section.id];
    return blocks ? { ...section, blocks } : section;
  });
}
