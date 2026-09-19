export const terraUmbraCreationRules = {
  "id": "terra-umbra",
  "name": "Terra Umbra California",
  "sourceVersion": "builder-core-2026-09-11",
  "attributes": [
    {
      "id": "vigueur",
      "name": "Vigueur"
    },
    {
      "id": "agilite",
      "name": "Agilité"
    },
    {
      "id": "esprit",
      "name": "Esprit"
    },
    {
      "id": "volonte",
      "name": "Volonté"
    },
    {
      "id": "charisme",
      "name": "Charisme"
    }
  ],
  "skills": [
    {
      "id": "athletisme",
      "name": "Athlétisme",
      "attribute": "vigueur"
    },
    {
      "id": "pugilat",
      "name": "Pugilat",
      "attribute": "vigueur"
    },
    {
      "id": "humanite",
      "name": "Humanité",
      "attribute": "vigueur"
    },
    {
      "id": "melee",
      "name": "Mêlée",
      "attribute": "vigueur"
    },
    {
      "id": "constitution",
      "name": "Constitution",
      "attribute": "vigueur"
    },
    {
      "id": "tir",
      "name": "Tir",
      "attribute": "agilite"
    },
    {
      "id": "pilotage",
      "name": "Pilotage",
      "attribute": "agilite"
    },
    {
      "id": "furtivite",
      "name": "Furtivité",
      "attribute": "agilite"
    },
    {
      "id": "esquive",
      "name": "Esquive",
      "attribute": "agilite"
    },
    {
      "id": "larcin",
      "name": "Larcin",
      "attribute": "agilite"
    },
    {
      "id": "mecanique",
      "name": "Mécanique",
      "attribute": "esprit"
    },
    {
      "id": "langages_argot",
      "name": "Langages & Argot",
      "attribute": "esprit"
    },
    {
      "id": "savoirs",
      "name": "Savoirs",
      "attribute": "esprit"
    },
    {
      "id": "soin",
      "name": "Soin",
      "attribute": "esprit"
    },
    {
      "id": "investigation",
      "name": "Investigation",
      "attribute": "esprit"
    },
    {
      "id": "neurodive",
      "name": "Neurodive",
      "attribute": "volonte"
    },
    {
      "id": "perception",
      "name": "Perception",
      "attribute": "volonte"
    },
    {
      "id": "maitrise_spirituelle",
      "name": "Maîtrise spirituelle",
      "attribute": "volonte"
    },
    {
      "id": "survie",
      "name": "Survie",
      "attribute": "volonte"
    },
    {
      "id": "force_mentale",
      "name": "Force Mentale",
      "attribute": "volonte"
    },
    {
      "id": "seduction",
      "name": "Séduction",
      "attribute": "charisme"
    },
    {
      "id": "diplomatie",
      "name": "Diplomatie",
      "attribute": "charisme"
    },
    {
      "id": "commerce",
      "name": "Commerce",
      "attribute": "charisme"
    },
    {
      "id": "representation",
      "name": "Représentation",
      "attribute": "charisme"
    },
    {
      "id": "autorite",
      "name": "Autorité",
      "attribute": "charisme"
    }
  ],
  "creation": {
    "attributes": {
      "baseTotal": 22,
      "min": 3,
      "max": 7,
      "edgePackPoints": 2,
      "edgePackMax": 1
    }
  },
  "origins": {
    "corporatiste": {
      "name": "Corporatiste"
    },
    "gouvernementale": {
      "name": "Gouvernementale"
    },
    "mafieuse": {
      "name": "Mafieuse"
    },
    "religieuse": {
      "name": "Religieuse"
    },
    "crawler": {
      "name": "Crawler"
    }
  },
  "spheres": {
    "corporatiste": {
      "name": "Corporatiste",
      "originId": "corporatiste",
      "support": "Avantage contractuel : prestation de base tant que le contrat existe.",
      "fixedSkills": [
        "diplomatie",
        "commerce",
        "langages_argot",
        "savoirs",
        "maitrise_spirituelle"
      ]
    },
    "gouvernementale": {
      "name": "Gouvernementale",
      "originId": "gouvernementale",
      "support": "Service de rattachement : accès normal aux moyens ordinaires nécessaires à la fonction.",
      "fixedSkills": [
        "autorite",
        "diplomatie",
        "savoirs",
        "investigation",
        "perception"
      ]
    },
    "mafieuse": {
      "name": "Pègre",
      "originId": "mafieuse",
      "support": "Appartenance au milieu : reconnaissance et petits services ordinaires dus à un membre.",
      "fixedSkills": [
        "autorite",
        "commerce",
        "larcin",
        "maitrise_spirituelle",
        "pugilat"
      ]
    },
    "crawler": {
      "name": "Crawler",
      "originId": "crawler",
      "support": "Contact fiable : choisir un Contact nommé et cohérent, fiable sans être omniscient ni toujours disponible.",
      "fixedSkills": [
        "survie",
        "esquive",
        "perception",
        "investigation",
        "commerce"
      ]
    },
    "religieuse": {
      "name": "Religieuse",
      "originId": "religieuse",
      "support": "Refuge confessionnel : implantation appropriée fournissant refuge simple et assistance ordinaire lorsqu’elle existe.",
      "fixedSkills": [
        "diplomatie",
        "autorite",
        "savoirs",
        "maitrise_spirituelle",
        "force_mentale"
      ]
    }
  },
  "styles": [
    {
      "id": "manucorpo",
      "sphere": "corporatiste",
      "name": "Manucorpo",
      "skills": [
        "mecanique",
        "savoirs",
        "investigation",
        "pilotage",
        "commerce"
      ],
      "expertiseFamilies": [
        "esprit",
        "agilite"
      ],
      "lifestyle": "Confortable",
      "account": 4000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "biocorpo",
      "sphere": "corporatiste",
      "name": "Biocorpo",
      "skills": [
        "soin",
        "savoirs",
        "humanite",
        "investigation",
        "mecanique"
      ],
      "expertiseFamilies": [
        "esprit",
        "vigueur"
      ],
      "lifestyle": "Confortable",
      "account": 3000,
      "augmentationEnvelope": 15000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "cybercorpo",
      "sphere": "corporatiste",
      "name": "Cybercorpo",
      "skills": [
        "neurodive",
        "mecanique",
        "investigation",
        "savoirs",
        "force_mentale"
      ],
      "expertiseFamilies": [
        "esprit",
        "volonte"
      ],
      "lifestyle": "Confortable",
      "account": 3000,
      "augmentationEnvelope": 15000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "armacorpo",
      "sphere": "corporatiste",
      "name": "Armacorpo",
      "skills": [
        "tir",
        "athletisme",
        "pilotage",
        "pugilat",
        "autorite"
      ],
      "expertiseFamilies": [
        "vigueur",
        "agilite"
      ],
      "lifestyle": "Standard",
      "account": 3000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "servicorpo",
      "sphere": "corporatiste",
      "name": "Servicorpo",
      "skills": [
        "commerce",
        "representation",
        "investigation",
        "perception",
        "autorite"
      ],
      "expertiseFamilies": [
        "charisme",
        "esprit"
      ],
      "lifestyle": "Aisé",
      "account": 6000,
      "augmentationEnvelope": 5000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "forces_armees",
      "sphere": "gouvernementale",
      "name": "Forces armées",
      "skills": [
        "tir",
        "athletisme",
        "pilotage",
        "esquive",
        "autorite"
      ],
      "expertiseFamilies": [
        "vigueur",
        "agilite"
      ],
      "lifestyle": "Standard",
      "account": 3000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "agent_gouvernemental",
      "sphere": "gouvernementale",
      "name": "Agent gouvernemental",
      "skills": [
        "investigation",
        "perception",
        "autorite",
        "tir",
        "furtivite"
      ],
      "expertiseFamilies": [
        "agilite",
        "esprit"
      ],
      "lifestyle": "Standard",
      "account": 4000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "net_corps",
      "sphere": "gouvernementale",
      "name": "Net Corps",
      "skills": [
        "neurodive",
        "tir",
        "mecanique",
        "force_mentale",
        "savoirs"
      ],
      "expertiseFamilies": [
        "volonte",
        "agilite"
      ],
      "lifestyle": "Standard",
      "account": 3000,
      "augmentationEnvelope": 15000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "service_public",
      "sphere": "gouvernementale",
      "name": "Service public",
      "skills": [
        "soin",
        "mecanique",
        "savoirs",
        "athletisme",
        "perception"
      ],
      "expertiseFamilies": [
        "esprit",
        "vigueur"
      ],
      "lifestyle": "Standard",
      "account": 3000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "diplomate_administrateur",
      "sphere": "gouvernementale",
      "name": "Diplomate / Administrateur",
      "skills": [
        "diplomatie",
        "representation",
        "langages_argot",
        "savoirs",
        "autorite"
      ],
      "expertiseFamilies": [
        "charisme",
        "esprit"
      ],
      "lifestyle": "Confortable",
      "account": 5000,
      "augmentationEnvelope": 5000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "soldato",
      "sphere": "mafieuse",
      "name": "Soldato",
      "skills": [
        "tir",
        "pugilat",
        "melee",
        "constitution",
        "autorite"
      ],
      "expertiseFamilies": [
        "vigueur",
        "agilite"
      ],
      "lifestyle": "Standard",
      "account": 4000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 0,
      "vehicleCapital": 0
    },
    {
      "id": "tueur_a_gages",
      "sphere": "mafieuse",
      "name": "Tueur à gages",
      "skills": [
        "tir",
        "furtivite",
        "perception",
        "larcin",
        "melee"
      ],
      "expertiseFamilies": [
        "agilite",
        "volonte"
      ],
      "lifestyle": "Standard",
      "account": 5000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "hacker",
      "sphere": "mafieuse",
      "name": "Hacker",
      "skills": [
        "neurodive",
        "investigation",
        "mecanique",
        "larcin",
        "force_mentale"
      ],
      "expertiseFamilies": [
        "volonte",
        "esprit"
      ],
      "lifestyle": "Standard",
      "account": 4000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "charcudoc",
      "sphere": "mafieuse",
      "name": "Charcudoc",
      "skills": [
        "soin",
        "mecanique",
        "humanite",
        "commerce",
        "larcin"
      ],
      "expertiseFamilies": [
        "esprit",
        "vigueur"
      ],
      "lifestyle": "Modeste",
      "account": 3000,
      "augmentationEnvelope": 15000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "affairiste_bookmaker",
      "sphere": "mafieuse",
      "name": "Affairiste / Bookmaker",
      "skills": [
        "commerce",
        "investigation",
        "diplomatie",
        "autorite",
        "savoirs"
      ],
      "expertiseFamilies": [
        "charisme",
        "esprit"
      ],
      "lifestyle": "Confortable",
      "account": 7000,
      "augmentationEnvelope": 5000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "deathrunner_merc",
      "sphere": "crawler",
      "name": "Deathrunner / Merc",
      "skills": [
        "tir",
        "athletisme",
        "pugilat",
        "melee",
        "esquive"
      ],
      "expertiseFamilies": [
        "vigueur",
        "agilite"
      ],
      "lifestyle": "Modeste",
      "account": 2000,
      "augmentationEnvelope": 15000,
      "gen2SlotsBase": 0,
      "vehicleCapital": 0
    },
    {
      "id": "neurodiver",
      "sphere": "crawler",
      "name": "Neurodiver",
      "skills": [
        "neurodive",
        "mecanique",
        "investigation",
        "force_mentale",
        "savoirs"
      ],
      "expertiseFamilies": [
        "volonte",
        "esprit"
      ],
      "lifestyle": "Modeste",
      "account": 2000,
      "augmentationEnvelope": 15000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "meditech",
      "sphere": "crawler",
      "name": "Meditech",
      "skills": [
        "mecanique",
        "soin",
        "humanite",
        "investigation",
        "savoirs"
      ],
      "expertiseFamilies": [
        "esprit",
        "vigueur"
      ],
      "lifestyle": "Modeste",
      "account": 2000,
      "augmentationEnvelope": 15000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "gundriver",
      "sphere": "crawler",
      "name": "Gundriver",
      "skills": [
        "pilotage",
        "tir",
        "commerce",
        "mecanique",
        "pugilat"
      ],
      "expertiseFamilies": [
        "agilite",
        "charisme"
      ],
      "lifestyle": "Modeste",
      "account": 3000,
      "augmentationEnvelope": 5000,
      "gen2SlotsBase": 0,
      "vehicleCapital": 10000
    },
    {
      "id": "neopunk",
      "sphere": "crawler",
      "name": "Neopunk",
      "skills": [
        "pugilat",
        "representation",
        "neurodive",
        "commerce",
        "autorite"
      ],
      "expertiseFamilies": [
        "charisme",
        "volonte"
      ],
      "lifestyle": "Modeste",
      "account": 3000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "ordre_arme",
      "sphere": "religieuse",
      "name": "Ordre armé",
      "skills": [
        "tir",
        "melee",
        "pugilat",
        "esquive",
        "athletisme"
      ],
      "expertiseFamilies": [
        "vigueur",
        "agilite"
      ],
      "lifestyle": "Standard",
      "account": 2000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "clerc_holonet",
      "sphere": "religieuse",
      "name": "Clerc Holonet",
      "skills": [
        "neurodive",
        "investigation",
        "representation",
        "savoirs",
        "force_mentale"
      ],
      "expertiseFamilies": [
        "volonte",
        "charisme"
      ],
      "lifestyle": "Standard",
      "account": 3000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "ministeriel",
      "sphere": "religieuse",
      "name": "Ministériel",
      "skills": [
        "soin",
        "mecanique",
        "savoirs",
        "investigation",
        "commerce"
      ],
      "expertiseFamilies": [
        "esprit",
        "vigueur"
      ],
      "lifestyle": "Standard",
      "account": 3000,
      "augmentationEnvelope": 15000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "clerc_administrateur",
      "sphere": "religieuse",
      "name": "Clerc / Administrateur",
      "skills": [
        "diplomatie",
        "autorite",
        "representation",
        "savoirs",
        "perception"
      ],
      "expertiseFamilies": [
        "charisme",
        "esprit"
      ],
      "lifestyle": "Confortable",
      "account": 4000,
      "augmentationEnvelope": 5000,
      "gen2SlotsBase": 1,
      "vehicleCapital": 0
    },
    {
      "id": "missionnaire",
      "sphere": "religieuse",
      "name": "Missionnaire",
      "skills": [
        "survie",
        "diplomatie",
        "soin",
        "langages_argot",
        "maitrise_spirituelle"
      ],
      "expertiseFamilies": [
        "volonte",
        "esprit"
      ],
      "lifestyle": "Modeste",
      "account": 2000,
      "augmentationEnvelope": 10000,
      "gen2SlotsBase": 0,
      "vehicleCapital": 0
    }
  ],
  "talents": {
    "origin": {
      "corporatiste": [
        {
          "id": "codes_corporatifs",
          "name": "Codes corporatifs",
          "effect": "+2 Diplomatie pour comprendre et appliquer usages, vocabulaire et hiérarchies corporatives.",
          "category": "origin",
          "origin": "corporatiste"
        },
        {
          "id": "formation_calibree",
          "name": "Formation calibrée",
          "effect": "Choisir une Compétence d’Esprit cohérente avec l’éducation reçue ; +1 à cette Compétence.",
          "category": "origin",
          "origin": "corporatiste"
        },
        {
          "id": "culture_produit",
          "name": "Culture produit",
          "effect": "Choisir un secteur corporatif : cybernétique, armement, médias, biotech, finance, etc. +2 Savoirs pour connaître acteurs, produits et habitudes du secteur.",
          "category": "origin",
          "origin": "corporatiste"
        },
        {
          "id": "reseau_scolaire",
          "name": "Réseau scolaire",
          "effect": "Un Contact mineur issu de l’école, de la formation ou de la corporation familiale.",
          "category": "origin",
          "origin": "corporatiste"
        },
        {
          "id": "toujours_presentable",
          "name": "Toujours présentable",
          "effect": "+2 Représentation lorsqu’il faut adopter rapidement le comportement, l’apparence ou le niveau de langage attendu dans un environnement corporatif formel.",
          "category": "origin",
          "origin": "corporatiste"
        }
      ],
      "gouvernementale": [
        {
          "id": "education_civique",
          "name": "Éducation civique",
          "effect": "+2 Savoirs sur droit, administration et institutions californiennes.",
          "category": "origin",
          "origin": "gouvernementale"
        },
        {
          "id": "procedures_administratives",
          "name": "Procédures administratives",
          "effect": "Sait normalement quel service, formulaire ou interlocuteur rechercher pour une procédure administrative courante.",
          "category": "origin",
          "origin": "gouvernementale"
        },
        {
          "id": "famille_de_fonctionnaires",
          "name": "Famille de fonctionnaires",
          "effect": "Un Contact mineur dans un service public, une administration ou une force gouvernementale.",
          "category": "origin",
          "origin": "gouvernementale"
        },
        {
          "id": "formation_publique",
          "name": "Formation publique",
          "effect": "Choisir une Compétence d’Esprit cohérente avec l’éducation reçue ; +1.",
          "category": "origin",
          "origin": "gouvernementale"
        },
        {
          "id": "dossier_propre",
          "name": "Dossier propre",
          "effect": "Sauf Désavantage contradictoire, possède un historique administratif cohérent et sans anomalie majeure.",
          "category": "origin",
          "origin": "gouvernementale"
        }
      ],
      "mafieuse": [
        {
          "id": "codes_du_milieu",
          "name": "Codes du milieu",
          "effect": "+2 Diplomatie pour connaître respect, rites, rangs, tabous et façons correctes de parler dans sa Pègre d’origine.",
          "category": "origin",
          "origin": "mafieuse"
        },
        {
          "id": "omerta_familiale",
          "name": "Omerta familiale",
          "effect": "+2 Force Mentale contre pression ou intimidation visant directement à faire trahir sa famille ou son ancien milieu.",
          "category": "origin",
          "origin": "mafieuse"
        },
        {
          "id": "enfant_du_quartier",
          "name": "Enfant du quartier",
          "effect": "Circonstance favorable (+3) pour retrouver une adresse, un passage ou une figure locale dans le quartier où il a réellement grandi.",
          "category": "origin",
          "origin": "mafieuse"
        },
        {
          "id": "vieilles_frequentations",
          "name": "Vieilles fréquentations",
          "effect": "Un Contact mineur lié à la Pègre ou à sa communauté.",
          "category": "origin",
          "origin": "mafieuse"
        },
        {
          "id": "petites_combines",
          "name": "Petites combines",
          "effect": "+2 Commerce ou Larcin, choisi à la création, pour de petites pratiques apprises durant l’enfance.",
          "category": "origin",
          "origin": "mafieuse"
        }
      ],
      "crawler": [
        {
          "id": "debrouille",
          "name": "Débrouille",
          "effect": "+1 Survie en milieu urbain pauvre, abandonné ou hors système.",
          "category": "origin",
          "origin": "crawler"
        },
        {
          "id": "codes_de_rue",
          "name": "Codes de rue",
          "effect": "+2 Langages & Argot pour argot, signes, graffitis et codes Underlives.",
          "category": "origin",
          "origin": "crawler"
        },
        {
          "id": "enfant_des_zones_mortes",
          "name": "Enfant des zones mortes",
          "effect": "Circonstance favorable (+3) pour circuler et s’orienter dans son ancien quartier abandonné.",
          "category": "origin",
          "origin": "crawler"
        },
        {
          "id": "on_connait_quelquun",
          "name": "On connaît quelqu’un",
          "effect": "Un Contact mineur Crawler.",
          "category": "origin",
          "origin": "crawler"
        },
        {
          "id": "recuperateur",
          "name": "Récupérateur",
          "effect": "+2 Investigation lorsqu’il s’agit de trouver quelque chose d’utile dans des ruines, déchets techniques, squats ou infrastructures abandonnées.",
          "category": "origin",
          "origin": "crawler"
        }
      ],
      "religieuse": [
        {
          "id": "education_doctrinale",
          "name": "Éducation doctrinale",
          "effect": "+2 Savoirs pour la religion dans laquelle le personnage a été élevé.",
          "category": "origin",
          "origin": "religieuse"
        },
        {
          "id": "vie_communautaire",
          "name": "Vie communautaire",
          "effect": "+2 Diplomatie auprès de sa communauté d’origine lorsque les références et coutumes communes sont pertinentes.",
          "category": "origin",
          "origin": "religieuse"
        },
        {
          "id": "discipline_de_foi",
          "name": "Discipline de foi",
          "effect": "+1 Maîtrise spirituelle. Aucun effet de Vérité.",
          "category": "origin",
          "origin": "religieuse"
        },
        {
          "id": "communaute_dorigine",
          "name": "Communauté d’origine",
          "effect": "Un Contact mineur dans une institution ou congrégation religieuse.",
          "category": "origin",
          "origin": "religieuse"
        },
        {
          "id": "education_caritative",
          "name": "Éducation caritative",
          "effect": "+2 Soin, Diplomatie ou Savoirs, choisi à la création, dans les situations d’assistance sociale correspondant réellement à son éducation.",
          "category": "origin",
          "origin": "religieuse"
        }
      ]
    }
  }
} as const;

export type TerraUmbraCreationRules = typeof terraUmbraCreationRules;
