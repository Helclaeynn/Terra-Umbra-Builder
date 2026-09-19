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
    },
    "skills": {
      "sphereFixedPoints": 5,
      "stylePoints": 5,
      "stylePerSkillMax": 2,
      "freePoints": 15,
      "rawMax": 5,
      "edgePackPoints": 4,
      "edgePackMax": 3
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
      ]
    },
    "sphere": {
      "corporatiste": [
        {
          "id": "dotation_standard",
          "name": "Dotation standard",
          "effect": "Équipement professionnel correspondant réellement au poste.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "assurance_corporative",
          "name": "Assurance corporative",
          "effect": "Couverture médicale liée au contrat.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "badge_interne",
          "name": "Badge interne",
          "effect": "Accréditations ordinaires nécessaires à la fonction.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "avantages_salaries",
          "name": "Avantages salariés",
          "effect": "Accès aux services et prestations internes/partenaires.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "compte_de_frais",
          "name": "Compte de frais",
          "effect": "Dépenses professionnelles raisonnables prises en charge.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "reseau_interne",
          "name": "Réseau interne",
          "effect": "Un Contact dans un autre service de la corporation.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "profil_calibre",
          "name": "Profil calibré",
          "effect": "+2 lorsque l’adéquation du Logifate au poste est directement examinée.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "acces_fournisseur",
          "name": "Accès fournisseur",
          "effect": "Accès privilégié aux produits ordinaires de sa corporation ou de ses partenaires.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "service_juridique",
          "name": "Service juridique",
          "effect": "Assistance légale dans les affaires relevant réellement du travail.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "programme_pilote",
          "name": "Programme pilote",
          "effect": "Peut accéder à des essais/prototypes compatibles avec sa fonction, sur autorisation.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "extraction_corporative",
          "name": "Extraction corporative",
          "effect": "Peut solliciter une assistance de sécurité lorsqu’un employé de son rang justifie réellement l’intervention.",
          "category": "sphere",
          "sphere": "corporatiste"
        },
        {
          "id": "requin_corporatif",
          "name": "Requin corporatif",
          "effect": "+2 Diplomatie ou Commerce, choisi à l’acquisition, lors de négociations professionnelles entre corporations.",
          "category": "sphere",
          "sphere": "corporatiste"
        }
      ],
      "gouvernementale": [
        {
          "id": "dotation_de_service",
          "name": "Dotation de service",
          "effect": "Équipement nécessaire au poste ; arme uniquement lorsque la fonction la justifie.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "habilitation_administrative",
          "name": "Habilitation administrative",
          "effect": "Accès ordinaire à une branche précise de l’administration.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "reseau_administratif",
          "name": "Réseau administratif",
          "effect": "Un Contact dans un autre service public.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "acces_aux_registres",
          "name": "Accès aux registres",
          "effect": "Peut consulter légalement les données relevant de sa fonction.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "procedure_acceleree",
          "name": "Procédure accélérée",
          "effect": "+2 pour faire progresser une démarche administrative relevant réellement de son domaine.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "fonctionnaire_experimente",
          "name": "Fonctionnaire expérimenté",
          "effect": "+1 Diplomatie dans les rapports professionnels avec l’administration.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "requisition_de_service",
          "name": "Réquisition de service",
          "effect": "Peut demander temporairement véhicule, matériel ou local raisonnable lorsque sa mission le justifie.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "couverture_fonctionnelle",
          "name": "Couverture fonctionnelle",
          "effect": "Assistance institutionnelle/juridique pour les actes légaux accomplis en service.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "dossier_institutionnel",
          "name": "Dossier institutionnel",
          "effect": "Possède un profil professionnel reconnu et cohérent dans les bases gouvernementales.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "autorite_officielle",
          "name": "Autorité officielle",
          "effect": "+2 Autorité lorsqu’un agent assermenté donne un ordre entrant réellement dans ses prérogatives.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "priorite_interservices",
          "name": "Priorité interservices",
          "effect": "Sait à quelle chaîne hiérarchique faire remonter une urgence et peut demander une coopération officielle entre services.",
          "category": "sphere",
          "sphere": "gouvernementale"
        },
        {
          "id": "appui_du_service",
          "name": "Appui du service",
          "effect": "En cas de difficulté professionnelle sérieuse, peut solliciter renforts, expertise ou soutien correspondant réellement aux moyens de son administration.",
          "category": "sphere",
          "sphere": "gouvernementale"
        }
      ],
      "mafieuse": [
        {
          "id": "protection",
          "name": "Protection",
          "effect": "S’en prendre publiquement au personnage sur le territoire de son organisation peut provoquer des représailles.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "marche_noir",
          "name": "Marché noir",
          "effect": "Sait accéder aux filières illégales de son organisation pour rechercher une marchandise existante.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "receleur",
          "name": "Recéleur",
          "effect": "+2 Commerce pour acheter/vendre des marchandises volées ou illégales via son réseau.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "blanchiment",
          "name": "Blanchiment",
          "effect": "Sait faire passer des revenus criminels par une filière légale lorsqu’il possède le réseau nécessaire.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "faussaires",
          "name": "Faussaires",
          "effect": "Accès à une filière de faux papiers, identités ou documents.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "dette_de_faveur",
          "name": "Dette de faveur",
          "effect": "Un Contact ou groupe lui doit une faveur significative mais raisonnable.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "omerta",
          "name": "Omerta",
          "effect": "+2 Force Mentale contre les pressions visant à lui faire trahir l’organisation.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "planque",
          "name": "Planque",
          "effect": "Dispose d’un refuge réellement existant associé à son organisation.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "homme_femme_du_milieu",
          "name": "Homme/Femme du milieu",
          "effect": "+1 Diplomatie ou Autorité, choisi à l’acquisition, dans les interactions internes à sa propre organisation.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "armurier_du_milieu",
          "name": "Armurier du milieu",
          "effect": "Canal privilégié pour armes et munitions effectivement disponibles dans le réseau.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "entreprise_de_couverture",
          "name": "Entreprise de couverture",
          "effect": "Possède ou utilise une activité légale pouvant servir de façade.",
          "category": "sphere",
          "sphere": "mafieuse"
        },
        {
          "id": "corruption_locale",
          "name": "Corruption locale",
          "effect": "Un Contact compromis dans une institution précise ; ses capacités restent celles de son véritable poste.",
          "category": "sphere",
          "sphere": "mafieuse"
        }
      ],
      "crawler": [
        {
          "id": "fiable",
          "name": "Fiable",
          "effect": "+2 pour convaincre un commanditaire connaissant sa réputation de lui confier un contrat.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "bonnes_adresses",
          "name": "Bonnes adresses",
          "effect": "+2 Investigation, Survie ou Commerce pour trouver un service clandestin dans un milieu Crawler où il possède réellement des entrées.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "dans_le_coup",
          "name": "Dans le coup",
          "effect": "Reçoit normalement les informations publiques ou semi-publiques de la scène underground dont il fait partie.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "contact_de_renom",
          "name": "Contact de renom",
          "effect": "Un Contact Crawler notable. Son aide n’est jamais automatique.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "assurance_silver",
          "name": "Assurance Silver",
          "effect": "Possède réellement une couverture CareForce Silver ; sa traduction économique suit le bloc Services/Train de vie.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "maitrise_des_codes_de_la_rue",
          "name": "Maîtrise des codes de la rue",
          "effect": "+1 Langages & Argot concernant la culture et les codes Crawlers.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "optitech",
          "name": "OptiTech",
          "effect": "Avec outils et préparation, optimise un matériel pour la scène : il ignore sa première défaillance matérielle non catastrophique.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "logifake",
          "name": "Logifake",
          "effect": "Possède un profil Logifate de couverture cohérent résistant aux contrôles ordinaires.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "nid_de_frelons",
          "name": "Nid de frelons",
          "effect": "Sait reconnaître et approcher les refuges/réseaux Neopunks réellement présents.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "insignifiant",
          "name": "Insignifiant",
          "effect": "+2 Furtivité pour se fondre dans une foule ; les témoins retiennent difficilement son visage après une interaction banale.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "fixweb",
          "name": "Fixweb",
          "effect": "Membre du réseau oral des Fixers ; peut rechercher ou faire circuler des contrats et contacter un intermédiaire local.",
          "category": "sphere",
          "sphere": "crawler"
        },
        {
          "id": "black_clinic",
          "name": "Black Clinic",
          "effect": "Possède une entrée crédible auprès d’au moins une clinique noire / réseau Meditech.",
          "category": "sphere",
          "sphere": "crawler"
        }
      ],
      "religieuse": [
        {
          "id": "communaute_de_fideles",
          "name": "Communauté de fidèles",
          "effect": "Accès normal à sa communauté religieuse locale pour renseignements et aide quotidienne.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "autorite_religieuse",
          "name": "Autorité religieuse",
          "effect": "+2 Autorité ou Diplomatie auprès de croyants reconnaissant réellement sa fonction.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "ministere",
          "name": "Ministère",
          "effect": "Appartenance à une branche : santé, logement, charité, éducation, ressources, sciences, etc.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "mission_ecclesiastique",
          "name": "Mission ecclésiastique",
          "effect": "L’institution peut fournir régulièrement du travail/rémunération correspondant à son rôle.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "hebergement_religieux",
          "name": "Hébergement religieux",
          "effect": "Possibilité de demander un logement simple dans une implantation disposant de place.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "reseau_caritatif",
          "name": "Réseau caritatif",
          "effect": "Accès aux associations, aides matérielles et services sociaux de son institution.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "education_theologique",
          "name": "Éducation théologique",
          "effect": "+1 Savoirs pour religion, doctrine et histoire religieuse.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "conseiller_spirituel",
          "name": "Conseiller spirituel",
          "effect": "+1 Diplomatie lorsqu’un interlocuteur accepte sincèrement cette relation de conseil.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "presence_holonet",
          "name": "Présence Holonet",
          "effect": "+2 Investigation ou Représentation dans les réseaux médiatiques officiels de sa religion.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "soutien_communautaire",
          "name": "Soutien communautaire",
          "effect": "Sait mobiliser rapidement une aide profane modeste : bénévoles, repas, transport, traduction, collecte…",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "ordre_religieux",
          "name": "Ordre religieux",
          "effect": "Appartenance à une structure régulière reconnue, avec réseau, uniforme, hiérarchie et accès ordinaires.",
          "category": "sphere",
          "sphere": "religieuse"
        },
        {
          "id": "reseau_confessionnel",
          "name": "Réseau confessionnel",
          "effect": "Lors d’un déplacement, sait identifier et contacter une implantation de sa religion ou d’une organisation alliée, lorsqu’elle existe.",
          "category": "sphere",
          "sphere": "religieuse"
        }
      ]
    },
    "common": [
      {
        "id": "sommeil_leger",
        "name": "Sommeil léger",
        "effect": "+2 Perception pour remarquer un danger pendant le sommeil. Un danger évident réveille normalement le personnage.",
        "category": "common"
      },
      {
        "id": "resistance_a_la_chaleur",
        "name": "Résistance à la chaleur",
        "effect": "+2 Constitution contre chaleur, déshydratation et exposition climatique chaude.",
        "category": "common"
      },
      {
        "id": "resistance_au_froid",
        "name": "Résistance au froid",
        "effect": "+2 Constitution contre froid et exposition climatique glaciale.",
        "category": "common"
      },
      {
        "id": "sante_de_fer",
        "name": "Santé de fer",
        "effect": "+1 Constitution contre maladies, infections et récupération physiologique.",
        "category": "common"
      },
      {
        "id": "insensibilite_a_la_douleur",
        "name": "Insensibilité à la douleur",
        "effect": "Les conséquences dues exclusivement à la douleur sont considérées comme un cran moins sévères. Les blessures restent totalement présentes.",
        "category": "common"
      },
      {
        "id": "nageur",
        "name": "Nageur",
        "effect": "+1 Athlétisme pour nage et manœuvres aquatiques ; pleine mobilité dans une eau ordinaire.",
        "category": "common"
      },
      {
        "id": "ambidextre",
        "name": "Ambidextre",
        "effect": "Utilise indifféremment les deux mains sans complication liée à la main non directrice.",
        "category": "common"
      },
      {
        "id": "brave",
        "name": "Brave",
        "effect": "+2 Maîtrise spirituelle face à la peur d’un danger physique identifiable.",
        "category": "common"
      },
      {
        "id": "fier_heritier",
        "name": "Fier héritier",
        "effect": "Augmente le Train de vie de base d’un cran, avec un minimum Confortable ; peut exceptionnellement faire passer Aisé à Luxe.",
        "category": "common"
      },
      {
        "id": "renomme",
        "name": "Renommé",
        "effect": "Fixe la Renommée initiale à 2 dans un milieu cohérent.",
        "category": "common"
      },
      {
        "id": "presence_remarquable",
        "name": "Présence remarquable",
        "effect": "Choisir un trait particulièrement frappant : beauté, voix, allure, style, carrure… +2 au test social lorsque ce trait précis constitue réellement un avantage.",
        "category": "common"
      },
      {
        "id": "apprentissage_fulgurant",
        "name": "Apprentissage fulgurant",
        "effect": "Une fois par scénario, réduit de 2 XP le coût d’une hausse de Compétence réellement pratiquée ou entraînée pendant ce scénario, minimum 1 XP.",
        "category": "common"
      }
    ],
    "expertise": [
      {
        "id": "athlete",
        "name": "Athlète",
        "effect": "+1 Athlétisme. En opposition purement athlétique, une égalité peut être départagée à son avantage lorsque l’entraînement constitue la différence.",
        "category": "expertise",
        "attribute": "vigueur",
        "skill": "athletisme",
        "prerequisite": null
      },
      {
        "id": "poings_de_fer",
        "name": "Poings de fer",
        "effect": "+1 Pugilat. Les attaques à mains nues ont DGT 2 au lieu de 1.",
        "category": "expertise",
        "attribute": "vigueur",
        "skill": "pugilat",
        "prerequisite": null
      },
      {
        "id": "stabilite_augmentique",
        "name": "Stabilité augmentique",
        "effect": "+1 Humanité. Le Stress augmentique de base total est réduit de 1, minimum 0.",
        "category": "expertise",
        "attribute": "vigueur",
        "skill": "humanite",
        "prerequisite": null
      },
      {
        "id": "maitre_des_lames",
        "name": "Maître des lames",
        "effect": "+1 Mêlée lorsqu’il utilise une lame. Sur marge 6+, une Altération cohérente peut laisser une plaie ouverte persistante jusqu’à un soin approprié.",
        "category": "expertise",
        "attribute": "vigueur",
        "skill": "melee",
        "prerequisite": null
      },
      {
        "id": "resistance_aux_toxines",
        "name": "Résistance aux toxines",
        "effect": "+2 Constitution contre poisons, drogues, toxines et substances similaires.",
        "category": "expertise",
        "attribute": "vigueur",
        "skill": "constitution",
        "prerequisite": null
      },
      {
        "id": "tireur_de_precision",
        "name": "Tireur de précision",
        "effect": "+1 Tir. Avec Viser et une Altération, la localisation annoncée s’applique si elle est physiquement possible.",
        "category": "expertise",
        "attribute": "agilite",
        "skill": "tir",
        "prerequisite": null
      },
      {
        "id": "pilote_emerite",
        "name": "Pilote émérite",
        "effect": "+1 Pilotage. Gagne les égalités d’opposition lorsque la maîtrise du véhicule est réellement déterminante.",
        "category": "expertise",
        "attribute": "agilite",
        "skill": "pilotage",
        "prerequisite": null
      },
      {
        "id": "ombre_vivante",
        "name": "Ombre vivante",
        "effect": "+1 Furtivité. +2 lorsqu’il vient de rompre la ligne de vue et exploite immédiatement un environnement permettant de disparaître.",
        "category": "expertise",
        "attribute": "agilite",
        "skill": "furtivite",
        "prerequisite": null
      },
      {
        "id": "reflexes_defensifs",
        "name": "Réflexes défensifs",
        "effect": "+1 Esquive. Peut défendre activement si le temps de réaction est la principale difficulté, sans supprimer une vraie Surprise.",
        "category": "expertise",
        "attribute": "agilite",
        "skill": "esquive",
        "prerequisite": null
      },
      {
        "id": "mains_lestes",
        "name": "Mains lestes",
        "effect": "+1 Larcin. +2 pour pickpocket, manipulation discrète ou dissimulation d’un petit objet.",
        "category": "expertise",
        "attribute": "agilite",
        "skill": "larcin",
        "prerequisite": null
      },
      {
        "id": "linguiste_emerite",
        "name": "Linguiste émérite",
        "effect": "+1 Langages & Argot. Peut déduire le sens général d’une langue inconnue apparentée à une langue connue.",
        "category": "expertise",
        "attribute": "esprit",
        "skill": "langages_argot",
        "prerequisite": null
      },
      {
        "id": "puits_de_savoir",
        "name": "Puits de savoir",
        "effect": "+1 Savoirs. Choisir un grand domaine de connaissance ; peut y effectuer des recherches spécialisées.",
        "category": "expertise",
        "attribute": "esprit",
        "skill": "savoirs",
        "prerequisite": null
      },
      {
        "id": "doc_de_choc",
        "name": "Doc de choc",
        "effect": "+1 Soin. Les Premiers soins réussis rendent +1 PV supplémentaire.",
        "category": "expertise",
        "attribute": "esprit",
        "skill": "soin",
        "prerequisite": null
      },
      {
        "id": "mecano_de_pointe",
        "name": "Mécano de pointe",
        "effect": "+1 Mécanique. Diagnostic, démontage et compréhension d’une machine accessible demandent environ deux fois moins de temps.",
        "category": "expertise",
        "attribute": "esprit",
        "skill": "mecanique",
        "prerequisite": null
      },
      {
        "id": "detective",
        "name": "Détective",
        "effect": "+1 Investigation. Sur DR 2+, une enquête réussie révèle normalement un détail ou lien supplémentaire pertinent lorsque la scène en contient un.",
        "category": "expertise",
        "attribute": "esprit",
        "skill": "investigation",
        "prerequisite": null
      },
      {
        "id": "stable",
        "name": "Stable",
        "effect": "+1 Maîtrise spirituelle lorsqu’il s’agit de Stress, choc, panique ou maintien du sang-froid.",
        "category": "expertise",
        "attribute": "volonte",
        "skill": "maitrise_spirituelle",
        "prerequisite": null
      },
      {
        "id": "sens_accru_x",
        "name": "Sens accru (X)",
        "effect": "Choisir vue, ouïe, odorat, toucher ou goût. +2 Perception lorsque ce sens précis est déterminant.",
        "category": "expertise",
        "attribute": "volonte",
        "skill": "perception",
        "prerequisite": null
      },
      {
        "id": "maitre_de_la_survie",
        "name": "Maître de la survie",
        "effect": "+1 Survie. Lorsque les ressources existent réellement et qu’il dispose de temps, trouve généralement nourriture, eau ou abri sans test inutile.",
        "category": "expertise",
        "attribute": "volonte",
        "skill": "survie",
        "prerequisite": null
      },
      {
        "id": "mental_dacier",
        "name": "Mental d’acier",
        "effect": "+1 Force Mentale. +2 contre interrogatoire, pression psychologique ou tentative profane de briser sa volonté ; prendre le meilleur bonus applicable.",
        "category": "expertise",
        "attribute": "volonte",
        "skill": "force_mentale",
        "prerequisite": null
      },
      {
        "id": "neurodriver",
        "name": "Neurodriver",
        "effect": "Prérequis Neurodive 1+. +1 aux tests de Neurodive et +1 Neuroprogramme chargé. Ne modifie jamais le Rang Neurodive.",
        "category": "expertise",
        "attribute": "volonte",
        "skill": "neurodive",
        "prerequisite": "neurodive_1"
      },
      {
        "id": "seducteur_seductrice",
        "name": "Séducteur / Séductrice",
        "effect": "+1 Séduction. Après une interaction suffisamment longue et réussie, distingue généralement attirance sincère, indifférence et séduction intéressée.",
        "category": "expertise",
        "attribute": "charisme",
        "skill": "seduction",
        "prerequisite": null
      },
      {
        "id": "diplomate",
        "name": "Diplomate",
        "effect": "+1 Diplomatie. Après quelques échanges, identifie le principal point de blocage déclaré d’une négociation.",
        "category": "expertise",
        "attribute": "charisme",
        "skill": "diplomatie",
        "prerequisite": null
      },
      {
        "id": "maitre_du_troc",
        "name": "Maître du Troc",
        "effect": "+1 Commerce. Une réussite permet normalement d’obtenir une condition commerciale légèrement meilleure.",
        "category": "expertise",
        "attribute": "charisme",
        "skill": "commerce",
        "prerequisite": null
      },
      {
        "id": "artiste",
        "name": "Artiste",
        "effect": "+1 Représentation. Une représentation réussie peut créer une circonstance favorable (+3) lors d’une interaction ultérieure directement influencée.",
        "category": "expertise",
        "attribute": "charisme",
        "skill": "representation",
        "prerequisite": null
      },
      {
        "id": "autorite_naturelle",
        "name": "Autorité naturelle",
        "effect": "+1 Autorité. +2 pour donner immédiatement une consigne simple à un groupe qui reconnaît déjà une légitimité au personnage.",
        "category": "expertise",
        "attribute": "charisme",
        "skill": "autorite",
        "prerequisite": null
      }
    ]
  }
} as const;

export type TerraUmbraCreationRules = typeof terraUmbraCreationRules;
