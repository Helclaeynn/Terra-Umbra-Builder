export const truthRevelationRules = {
  stages: {
    v: { code:"V", name:"Voilé" },
    sr: { code:"SR", name:"Semi-Révélé" },
    r: { code:"R", name:"Révélé" }
  },
  rules: {
    revealedReplacesSemiRevealed: true,
    vigorPvMultiplier: 2,
    vigorShapeChangeDoesNotHeal: true
  },
  bodies: {
    humain: {
      v:"Le personnage reste un Humain : Profane/Initié décrit sa connaissance de la Vérité, pas une seconde physiologie.",
      sr:"Un Humain Initié peut employer les traditions qu’il a réellement apprises, sans acquérir de bonus racial.",
      r:"Il n’existe pas de corps Révélé humain distinct : seuls les Talents, rites, équipements ou autres sources explicites modifient ses statistiques."
    },
    vampire: {
      v:"Corps humain sous le Voile ; vieillissement et limites biologiques humaines.",
      sr:"La physiologie prédatrice affleure : sens surnaturels et capacités subtiles deviennent accessibles.",
      r:"Le corps prédateur est pleinement présent : prédation, régénération, stase, Empreinte de Cour et Talents R."
    },
    mage: {
      v:"Le Mageius reste refermé : pas de lancement direct par le Mageius.",
      sr:"Le Mageius affleure ; Vision du Voile, Perception magique et Protection du Mageius sont accessibles, avec Amplitude Mineure.",
      r:"Le Mageius est pleinement ouvert ; toutes les Affinités, Maîtrises et Amplitudes réellement acquises deviennent disponibles. Une Affinité non éveillée peut aussi être improvisée en Initiale / Mineure avec +1 niveau de difficulté."
    },
    daemon: {
      v:"Incarnation mortelle maintenue par l’Hologramme ; seuls les effets explicitement V restent disponibles.",
      sr:"La Marque et les capacités SR de l’Élu transparaissent.",
      r:"La forme exaltée s’impose et les capacités R deviennent utilisables."
    },
    angelus: {
      v:"Incarnation mortelle ; les pouvoirs célestes ne fonctionnent que s’ils portent explicitement V.",
      sr:"La Transcendance affleure : Auréole, Yeux célestes et pouvoirs SR deviennent accessibles.",
      r:"La forme angélique véritable, les ailes d’énergie et les capacités R se matérialisent."
    },
    aseryn: {
      v:"Le Voile maintient l’expression compatible avec la Réalité et aucun modificateur racial de Révélation ne s’applique.",
      sr:"La vitesse neuromusculaire aseryne et l’Empreinte de l’Origine commencent à s’exprimer.",
      r:"La physiologie véritable de l’Origine aseryne s’exprime pleinement."
    },
    exile: {
      v:"Le Voile produit une traduction humaine plausible de la physiologie d’Aèr.",
      sr:"Une partie des propriétés raciales du peuple devient physiquement réelle.",
      r:"La physiologie véritable du peuple est matérialisée et ses capacités R deviennent accessibles."
    },
    extral: {
      v:"L’Hologramme traduit le corps extraterrestre en silhouette humaine/plausible.",
      sr:"Une partie de la physiologie réelle du profil traverse le Voile.",
      r:"Le véritable corps extral est matérialisé avec ses traits physiques et ses capacités R."
    },
    garou: {
      v:"Corps humain complet, sans régénération surnaturelle ni transformation.",
      sr:"Toujours humain extérieurement ; instincts, sens et Talents SR percent le Voile.",
      r:"La Révélation ouvre l’humain révélé puis les formes animale et hybride ; chaque forme possède son propre profil."
    },
    khinae: {
      v:"Corps humain complet, sans expression physique de la Lignée.",
      sr:"Toujours humain extérieurement ; instincts, perceptions et signatures SR commencent à s’exprimer.",
      r:"Humain révélé, animal ou hybride : les propriétés exactes dépendent de la Lignée et de la Variante morphologique."
    }
  },
  daemonStats: {
    alabor:{sr:"+1 Vigueur · +1 Agilité",r:"+2 Vigueur · +1 Agilité"},
    astaroth:{sr:"+1 Esprit · +1 Volonté",r:"+2 Esprit · +1 Volonté"},
    belial:{sr:"+1 Vigueur · +1 Volonté",r:"+2 Vigueur · +1 Volonté"},
    diablo:{sr:"+1 Agilité · +1 Volonté",r:"+1 Agilité · +2 Volonté"},
    lilith:{sr:"+1 Charisme · +1 Volonté",r:"+2 Charisme · +1 Volonté"},
    mammon:{sr:"+1 Vigueur · +1 Volonté",r:"+1 Vigueur · +2 Volonté"},
    mephisto:{sr:"+1 Esprit · +1 Charisme",r:"+2 Esprit · +1 Charisme"},
    satan:{sr:"+1 Esprit · +1 Volonté",r:"+1 Esprit · +2 Volonté"},
    lucifer:{sr:"+1 Vigueur · +1 Volonté",r:"+2 Vigueur · +1 Volonté"},
    belzebuth:{sr:"+1 Vigueur · +1 Esprit",r:"+2 Vigueur · +1 Esprit"},
    abigor:{sr:"+1 Agilité · +1 Volonté",r:"+2 Agilité · +1 Volonté"},
    baal:{sr:"+1 Vigueur · +1 Agilité",r:"+2 Vigueur · +1 Agilité"},
    morrighan:{sr:"+1 Agilité · +1 Volonté",r:"+2 Agilité · +1 Volonté"}
  },
  angelusStats: {
    kether:{sr:"+1 Volonté · +1 Charisme",r:"+2 Volonté · +1 Charisme"},
    hokhma:{sr:"+1 Esprit · +1 Volonté",r:"+2 Esprit · +1 Volonté"},
    bina:{sr:"+1 Esprit · +1 Volonté",r:"+2 Esprit · +1 Volonté"},
    hesed:{sr:"+1 Volonté · +1 Charisme",r:"+1 Volonté · +2 Charisme"},
    gueburah:{sr:"+1 Vigueur · +1 Volonté",r:"+2 Vigueur · +1 Volonté"},
    tiphereth:{sr:"+1 Charisme · +1 Volonté",r:"+2 Charisme · +1 Volonté"},
    nesah:{sr:"+1 Charisme · +1 Agilité",r:"+2 Charisme · +1 Agilité"},
    hod:{sr:"+1 Esprit · +1 Charisme",r:"+2 Esprit · +1 Charisme"},
    yessod:{sr:"+1 Esprit · +1 Charisme",r:"+2 Esprit · +1 Charisme"},
    malkhouth:{sr:"+1 Vigueur · +1 Volonté",r:"+2 Vigueur · +1 Volonté"}
  },
  aserynStats: {
    aerilien:{sr:"+1 Agilité · +1 Volonté",r:"+2 Agilité · +1 Volonté"},
    mulien:{sr:"+1 Agilité · +1 Esprit",r:"+2 Agilité · +1 Esprit"},
    hyperboreen:{sr:"+1 Agilité · +1 Vigueur",r:"+2 Agilité · +1 Vigueur"},
    lemurian:{sr:"+1 Agilité · +1 Volonté",r:"+2 Agilité · +1 Volonté"},
    seratheen:{sr:"+1 Agilité",r:"+2 Agilité"}
  },
  exileStats: {
    elye:{sr:"+1 Agilité",r:"+1 Agilité · +1 Esprit · +1 Charisme"},
    whurten:{sr:"+1 Vigueur",r:"+1 Vigueur · +2 Volonté"},
    ashyll:{sr:"+1 Agilité",r:"+2 Agilité · +1 Esprit"},
    thulkar:{sr:"+1 Vigueur",r:"+2 Vigueur · +1 Charisme"},
    azmenorien:{sr:"+1 Esprit",r:"+1 Vigueur · +1 Esprit · +1 Charisme"}
  },
  extralStats: {
    talass:{sr:"+1 Esprit",r:"+2 Esprit · +1 Agilité"},
    mosen:{sr:"+1 Vigueur",r:"+2 Vigueur · +1 Agilité"},
    baseanh:{sr:"+1 Volonté",r:"+1 Esprit · +1 Volonté · +1 Charisme"},
    rocreen:{sr:"+1 Charisme",r:"+2 Charisme · +1 Esprit"},
    thalsios:{sr:"+1 Volonté",r:"+2 Volonté · +1 Vigueur"},
    homo_superior:{sr:"+1 Vigueur",r:"+1 Vigueur · +1 Agilité · +1 Volonté"},
    adrak:{sr:"+1 Vigueur",r:"+3 Vigueur"}
  },
  khinaeBase: {
    canides_errants:{animal:"+2 Agilité",hybrid:"+3 Vigueur · +2 Agilité"},
    renards:{animal:"+3 Agilité",hybrid:"+2 Vigueur · +3 Agilité"},
    grands_felins:{animal:"+2 Vigueur · +2 Agilité",hybrid:"+4 Vigueur · +2 Agilité"},
    chats:{animal:"+4 Agilité",hybrid:"+1 Vigueur · +4 Agilité"},
    rapaces:{animal:"+3 Agilité",hybrid:"+2 Vigueur · +3 Agilité"},
    requins:{animal:"Dans l’eau : +2 Agilité",hybrid:"Dans l’eau : +4 Vigueur · +2 Agilité · sur terre le bonus d’Agilité est perdu"},
    serpents:{animal:"+3 Agilité",hybrid:"+2 Vigueur · +3 Agilité"},
    boudas:{animal:"+2 Vigueur · +2 Agilité",hybrid:"+3 Vigueur · +2 Agilité"},
    berserkirs:{animal:"+3 Vigueur",hybrid:"+5 Vigueur"},
    crocodiliens:{animal:"+3 Vigueur",hybrid:"+5 Vigueur · +2 Agilité dans l’eau · aucun bonus d’Agilité à terre"}
  },
  khinaeVariant: {
    grands_felins:{lion:"+4 Vigueur · +1 Agilité",panthere:"+3 Vigueur · +3 Agilité",puma:"+3 Vigueur · +3 Agilité"},
    chats:{sauvage:"+2 Vigueur · +3 Agilité"},
    rapaces:{aigle:"+3 Vigueur · +2 Agilité",faucon:"+1 Vigueur · +4 Agilité",hibou:"+1 Vigueur · +3 Agilité",vautour:"+2 Vigueur · +2 Agilité"},
    requins:{bouledogue:"+3 Vigueur · +2 Agilité dans l’eau",requin_marteau:"+3 Vigueur · +3 Agilité dans l’eau",requin_baleine:"+5 Vigueur · +1 Agilité dans l’eau"},
    serpents:{cobra:"+2 Vigueur · +2 Agilité",constricteur:"+4 Vigueur · +1 Agilité",furtif:"+1 Vigueur · +4 Agilité"},
    boudas:{tachetee:"+4 Vigueur · +1 Agilité",rayee:"+2 Vigueur · +3 Agilité"},
    berserkirs:{ours_noir:"+4 Vigueur · +1 Agilité"},
    crocodiliens:{alligator:"+4 Vigueur · +1 Agilité à terre · +2 Agilité dans l’eau",caiman:"+4 Vigueur · +1 Agilité",gavial:"+3 Vigueur · +2 Agilité dans l’eau"}
  }
} as const;

export type TruthRevelationRules = typeof truthRevelationRules;
