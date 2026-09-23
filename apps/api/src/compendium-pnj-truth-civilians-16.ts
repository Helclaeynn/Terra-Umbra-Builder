import { applyNamedPnjStatProfile, type StatProfile } from "./compendium-pnj-corporate-stats.js";
import fantasticSources from "./compendium-verite-fantastiques-pnj-payload-2.js";
import extraterrestrialSources from "./compendium-verite-extraterrestres-pnj-payload-0.js";
import extralSources from "./compendium-verite-extrals-groups-pnj-payload-3.js";

type Article={id:string;title?:string;pnj?:Record<string,any>;sections?:Array<Record<string,any>>;[key:string]:any};
type Entry=StatProfile & {id:string};
const PROFILES:Entry[]=[
  {"id":"pnj-crawlers-docx-adam-nevine-qigang-xuyin-carmello-shen","tier":"heroique","shape":"social","skills":["Commerce","Autorité","Investigation","Diplomatie"],"anchor":"Adam Nevine, ancien cadre de Nextar, devenu Fixer stratège ; Qigang Xuyin et Carmello Shen sont des noms qu'il utilise.","talents":["Réseau mobilisable — Crawlers","Dossier préparé — contrats"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-115-myra-allan","tier":"haute","shape":"social","skills":["Autorité","Survie","Investigation","Diplomatie"],"anchor":"Myra Allan est une Crawler canadienne engagée dans les réseaux insurgés de défense de l'environnement.","talents":["Réseau mobilisable — insurgés","Terrain reconnu — littoral"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-071-luke-cypher","tier":"heroique","shape":"terrain","skills":["Investigation","Mêlée","Survie","Perception"],"anchor":"Luke Cypher est un chasseur d'élite du Hunt-15 ; ses aptitudes angéliques ne sont pas chiffrées ici.","talents":["Dossier préparé — proie","Terrain reconnu — chasse"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-truth-kerys","tier":"heroique","shape":"terrain","skills":["Investigation","Mêlée","Survie","Furtivité"],"anchor":"Kerys poursuit seule ses contrats de chasse, sans ordre ou association permanente.","talents":["Dossier préparé — cible","Terrain reconnu — traque"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-truth-neals-corvo","tier":"heroique","shape":"terrain","skills":["Furtivité","Mêlée","Survie","Perception"],"anchor":"Neals Corvo travaille comme assassin Crawler ; sa confrérie et ses mutations restent MJ.","talents":["Désarmement net — Mêlée","Terrain reconnu — infiltration"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"pnj-truth-yun","tier":"haute","shape":"terrain","skills":["Furtivité","Mêlée","Survie","Perception"],"anchor":"Yun exerce comme Voidrunner lié à la Blanchisserie, réputé pour traquer des Nord-Coréens.","talents":["Terrain reconnu — chasse","Expertise éprouvée — Furtivité"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"personnages-verite-chasseurs-sharam-yeganeh","tier":"heroique","shape":"terrain","skills":["Savoirs","Investigation","Survie","Perception"],"anchor":"Sharam Yeganeh exerce comme chasseur dualiste, mais ses flammes surnaturelles ne relèvent pas de la Réalité.","talents":["Dossier préparé — créature","Terrain reconnu — traque"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"personnages-verite-chasseurs-sahadeva-parekh","tier":"haute","shape":"terrain","skills":["Mêlée","Survie","Perception","Savoirs"],"anchor":"Sahadeva Parekh est chasseur issu d'une lignée religieuse de Shiva.","talents":["Terrain reconnu — chasse","Expertise éprouvée — Mêlée"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"personnages-verite-chasseurs-daryl-graves","tier":"haute","shape":"esprit","skills":["Investigation","Savoirs","Survie","Perception"],"anchor":"Daryl Graves recherche des reliques dans un ordre de chasseurs apparenté aux chevaliers de la Table ronde.","talents":["Dossier préparé — relique","Terrain reconnu — site"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {"id":"personnages-verite-chasseurs-valle-von-hardenberg","tier":"heroique","shape":"esprit","skills":["Savoirs","Investigation","Diplomatie","Perception"],"anchor":"Valle von Hardenberg pratique l'étude kabbalistique et la chasse rituelle ; sa magie est un profil distinct.","talents":["Expertise éprouvée — Savoirs","Dossier préparé — rituel"],"truth":"Les capacités de Vérité restent distinctes et réservées au MJ."},
  {id:"pnj-136-alisa-svalisdottir",tier:"haute",shape:"terrain",skills:["Mêlée","Pugilat","Athlétisme","Survie"],anchor:"Crawler mercenaire, combattante d'arts martiaux en circuits clandestins ; exerce aussi occasionnellement le travail du sexe.",talents:["Expertise éprouvée — Pugilat","Terrain reconnu — combats clandestins"]},
  {id:"pnj-108-asheylinn-medira",tier:"heroique",shape:"social",skills:["Représentation","Diplomatie","Commerce","Perception"],anchor:"Chanteuse célèbre d'Omegacoustic, rivale d'Evangelina Vera et figure de la scène musicale.",talents:["Expertise éprouvée — Représentation","Réseau mobilisable — Omegacoustic"]},
  {id:"pnj-truth-beatrix-kruger",tier:"haute",shape:"esprit",skills:["Autorité","Commerce","Mécanique","Investigation"],anchor:"Dirige Eversor Industries, la branche de fabrication des pièces et systèmes courants du groupe.",talents:["Chaîne de commandement — Eversor Industries","Dossier préparé — approvisionnement industriel"]},
  {id:"pnj-truth-cassandra-helen",tier:"haute",shape:"social",skills:["Diplomatie","Investigation","Autorité","Commerce"],anchor:"Dirige la branche management de Dreampoint en Europe et conseille son président dans ses relations grâce à ses connaissances en psychologie.",talents:["Lecture des failles — interlocuteur","Réseau mobilisable — Dreampoint"]},
  {id:"pnj-truth-kevin-eckker",tier:"haute",shape:"terrain",skills:["Tir","Survie","Autorité","Commerce"],anchor:"Ancien Marine et marin-pêcheur ; dirige la branche pêche d'Eversor pour Saskia.",talents:["Terrain reconnu — mer et littoral","Chaîne de commandement — Eversor Fishing & Sea Product"]},
  {id:"pnj-121-zoran-kozic",tier:"haute",shape:"esprit",skills:["Savoirs","Investigation","Commerce","Autorité"],anchor:"Juriste polonais, formé par Adam Abellan ; dirige Mediaforce et se spécialise dans le droit administratif plutôt que la plaidoirie.",talents:["Dossier préparé — droit administratif","Réseau mobilisable — Mediaforce"]},
  {id:"personnages-verite-fantastiques-koldraalsheroh",tier:"heroique",shape:"terrain",skills:["Tir","Autorité","Mêlée","Survie"],anchor:"Vétéran de la guerre de 2022 et des missions de mercenaire ; bras droit d'Andrea Shield, commandant de terrain spécialisé dans l'assaut.",talents:["Chef de manœuvre — assaut","Terrain reconnu — zone de guerre"]},
  {id:"personnages-verite-fantastiques-fredegonda",tier:"entraine",shape:"terrain",skills:["Survie","Perception","Furtivité","Force Mentale"],anchor:"Sans-abri dans la Réalité, sans identité civile documentée ; ces chiffres ne décrivent que sa survie quotidienne.",talents:["Terrain reconnu — rue"],truth:"Son identité et ses pouvoirs véritables restent exclusivement dans le dossier MJ ; aucun pouvoir surnaturel n'est chiffré dans le profil de Réalité."},
  {id:"personnages-verite-fantastiques-marjolein-enneman",tier:"haute",shape:"terrain",skills:["Mêlée","Survie","Investigation","Savoirs"],anchor:"Religieuse chrétienne et chasseuse de terrain de l'ordre d'Arianwen ; la force et les résistances surnaturelles de sa Vérité sont exclues.",talents:["Terrain reconnu — traque","Dossier préparé — cible"],truth:"Les capacités surnaturelles et l'histoire de l'ordre figurent uniquement dans le dossier MJ ; leur puissance ne se déduit pas de ce profil de Réalité."},
  {id:"personnages-verite-fantastiques-tharlal-rark",tier:"haute",shape:"esprit",skills:["Mécanique","Investigation","Tir","Survie"],anchor:"Chasseur de primes Crawler discret, bricoleur et inventeur proposant parfois ses technologies ; ses modifications et la chasse aux extraterrestres relèvent du dossier MJ.",talents:["Expertise éprouvée — Mécanique","Dossier préparé — cible"]},
  {id:"personnages-verite-fantastiques-theoderid",tier:"heroique",shape:"terrain",skills:["Mêlée","Autorité","Survie","Athlétisme"],anchor:"Chef du gang insurgé des Killdrillers, guerrier d'assaut et adversaire de Raven ; sa force surhumaine et sa résistance aux balles exigent un profil révélé distinct.",talents:["Chef de manœuvre — Killdrillers","Terrain reconnu — affrontements urbains"],truth:"Le bloc de Réalité décrit le commandement et l'entraînement. La force titanesque et la résistance aux armes conventionnelles décrites dans le dossier MJ ne sont pas plafonnées par les chiffres civils et demandent un profil révélé."},
  {id:"pnj-fleaux-focus-ana-diana-de-la-caza-diana-de-la-caza",tier:"elite",shape:"social",skills:["Commerce","Représentation","Autorité","Investigation"],anchor:"Travaille officiellement pour Sehdia Craft, corporation d'ultra-luxe et d'artisanat ; l'âge réel et le culte relèvent du dossier MJ.",talents:["Réseau mobilisable — Sehdia Craft","Dossier préparé — clientèle de luxe"]},
  {id:"pnj-fleaux-focus-anastasia-vargas-awan-aklima-anastasia-vargas",tier:"haute",shape:"terrain",skills:["Tir","Survie","Mêlée","Furtivité"],anchor:"Crawler mercenaire dans la Réalité ; sa nature et ses liens occultes ne font pas partie de ce profil.",talents:["Terrain reconnu — contrats mercenaires","Expertise éprouvée — Tir"]},
  {id:"pnj-fleaux-focus-arkady-karamov-4-arkady-karamov",tier:"heroique",shape:"terrain",skills:["Tir","Autorité","Furtivité","Survie"],anchor:"Ancien Spetsnaz devenu mafieux de la Bratva ; le profil civil se fonde sur ses années de service et son ascension criminelle, sans chiffrer sa reconstruction secrète.",talents:["Terrain reconnu — opérations militaires","Réseau mobilisable — Bratva"],truth:"Sa mort en 2033, son corps synthétique et le cerveau cloné par Yegor restent dans le dossier MJ ; ce profil ne chiffre pas le corps reconstruit."},
  {id:"pnj-fleaux-focus-azaliah-springer-azaliah-springer",tier:"entraine",shape:"esprit",skills:["Savoirs","Diplomatie","Investigation","Force Mentale"],anchor:"Officiellement religieuse catholique ; aucun entraînement au combat ni pouvoir religieux n'est attesté par sa couverture civile.",talents:["Dossier préparé — vie conventuelle"]},
  {id:"pnj-fleaux-focus-margareta-diaconescu-areta-diaconescu",tier:"entraine",shape:"social",skills:["Diplomatie","Savoirs","Perception","Investigation"],anchor:"Religieuse roumaine ayant immigré en Californie et vivant dans une petite église isolée ; son charme apparent n'établit aucune capacité surnaturelle civile.",talents:["Expertise éprouvée — Diplomatie"]},
  {id:"pnj-fleaux-focus-mila-shilove-094-mila-shilove",tier:"haute",shape:"terrain",skills:["Survie","Autorité","Perception","Investigation"],anchor:"Ender qui dirige une petite communauté isolée d'Alaska ; le cannibalisme et la nature de ses habitants restent des révélations MJ.",talents:["Terrain reconnu — Alaska","Chaîne de commandement — communauté"]},
  {id:"pnj-fleaux-focus-mira-stephens-5-mir-a-stephens",tier:"heroique",shape:"terrain",skills:["Furtivité","Mêlée","Tir","Investigation"],anchor:"Assassin de la Blanchisserie ; son identité secrète et sa nature ne sont pas révélées par ses aptitudes de Réalité.",talents:["Dossier préparé — cible","Terrain reconnu — infiltration"]},
  {id:"pnj-fleaux-focus-noah-brenneman-6-noah-brenneman",tier:"entraine",shape:"esprit",skills:["Savoirs","Diplomatie","Perception","Force Mentale"],anchor:"Prêtre catholique peu présent dans la Réalité ; sa mise en sommeil et son identité de Vérité restent MJ.",talents:["Expertise éprouvée — Savoirs"]},
  {id:"pnj-fleaux-focus-nora-shakir--097-nora-shakir",tier:"entraine",shape:"social",skills:["Diplomatie","Perception","Survie","Représentation"],anchor:"Nora Shakir exerce le travail du sexe ; ses origines et ses capacités surnaturelles sont entièrement MJ.",talents:["Expertise éprouvée — Diplomatie"]},
  {id:"pnj-fleaux-focus-olayinka-najja-8-olayinka-najja",tier:"haute",shape:"social",skills:["Autorité","Diplomatie","Savoirs","Représentation"],anchor:"Olayinka Najja dirige publiquement la secte oshirique et exerce aussi le travail du sexe ; son passé surnaturel est séparé du profil civil.",talents:["Réseau mobilisable — secte oshirique","Expertise éprouvée — Diplomatie"]},
  {id:"pnj-fleaux-raghnaid-maccalmain",tier:"entraine",shape:"terrain",skills:["Survie","Perception","Diplomatie","Furtivité"],anchor:"Raghnaid Maccalmain exerce le travail du sexe ; ses aptitudes occultes ne découlent pas de cette activité de Réalité.",talents:["Terrain reconnu — rue"]},
  {id:"pnj-fleaux-siadara",tier:"haute",shape:"social",skills:["Représentation","Commerce","Diplomatie","Autorité"],anchor:"Sianna Danein est une ancienne actrice de Redwheels travaillant aujourd'hui chez YellowFood ; la Vérité de Siadara reste dans le dossier MJ.",talents:["Expertise éprouvée — Représentation","Réseau mobilisable — YellowFood"]},
  {id:"pnj-fleaux-focus-tellia-fedirivna-skrypnyk-dirivna-skrypnyk",tier:"elite",shape:"terrain",skills:["Survie","Furtivité","Investigation","Perception"],anchor:"Crawler vivant en marge, entre réseaux insurgés et Enders, engagée pour des missions ponctuelles ; son origine cachée reste MJ.",talents:["Terrain reconnu — vie en marge","Dossier préparé — mission"]},
  {id:"pnj-fleaux-focus-yegor-karamov-05-yegor-karamov",tier:"haute",shape:"esprit",skills:["Soin","Savoirs","Investigation","Commerce"],anchor:"Yegor Karamov est un charcudoc clandestin qui opère pour la pègre et les Crawlers ; ses recherches sont secrètes.",talents:["Expertise éprouvée — Soin","Dossier préparé — opération clandestine"]},
  {id:"personnages-verite-humains-galactiques-kay-salzer",tier:"heroique",shape:"terrain",skills:["Furtivité","Tir","Mêlée","Investigation"],anchor:"Kay Salzer travaille comme assassin pour la Blanchisserie ; son parcours psychique et galactique reste dans le dossier MJ.",talents:["Dossier préparé — cible","Terrain reconnu — infiltration"]},
  {id:"personnages-verite-humains-galactiques-kenneth-shatter",tier:"elite",shape:"esprit",skills:["Investigation","Perception","Diplomatie","Commerce"],anchor:"Kenneth Shatter est détective et Crawler, exerçant aussi comme Fixer à l'occasion.",talents:["Dossier préparé — enquête","Lecture des failles — interrogatoire"]},
  {id:"personnages-verite-humains-galactiques-moira-blake",tier:"haute",shape:"social",skills:["Diplomatie","Savoirs","Investigation","Commerce"],anchor:"Moira Blake est officiellement consultante de la Space Force Union ; son identité véritable, Morrighan, n'appartient pas à ce profil civil.",talents:["Expertise éprouvée — Diplomatie","Dossier préparé — conseil SFU"],truth:"Moira Blake est une identité de Morrighan ; son pouvoir et son parcours de Vérité exigent un profil révélé distinct, réservé au MJ."},
  {id:"personnages-verite-chasseurs-charunee-sawasdipon",tier:"entraine",shape:"esprit",skills:["Savoirs","Diplomatie","Force Mentale","Perception"],anchor:"Charunee Sawasdipon exerce publiquement comme prêtresse bouddhiste néopaïenne ; sa nature de Bouddha est un secret MJ.",talents:["Expertise éprouvée — Savoirs"],truth:"Sa nature de Bouddha et les capacités qui en découlent relèvent du dossier et du profil révélés, non de la pratique religieuse publique."},
  {id:"personnages-verite-chasseurs-isabella-mironescu",tier:"haute",shape:"social",skills:["Diplomatie","Représentation","Survie","Investigation"],anchor:"Isabella Mironescu est diseuse de bonne aventure, mercenaire et héritière ; sa place dans le Hunt-15 relève du dossier MJ.",talents:["Expertise éprouvée — Diplomatie","Dossier préparé — contrat"]},
  {id:"pnj-loges-mages-anggriawan-yang-24",tier:"elite",shape:"social",skills:["Autorité","Commerce","Diplomatie","Perception"],anchor:"Anggriawan Yáng exerce le travail du sexe et dirige une maison close ; la magie de sa loge n'entre pas dans les chiffres de Réalité.",talents:["Réseau mobilisable — établissement","Expertise éprouvée — Commerce"]},
  {id:"pnj-loges-mages-anayah-kumba-11",tier:"haute",shape:"esprit",skills:["Savoirs","Soin","Autorité","Investigation"],anchor:"Anayah Kumba dirige la recherche en génétique et en soins au sein de BioSun ; aucun pouvoir de mage n'est chiffré ici.",talents:["Expertise éprouvée — Savoirs","Réseau mobilisable — BioSun"]},
  {id:"pnj-loges-mages-alice-carroll-38",tier:"entraine",shape:"social",skills:["Survie","Diplomatie","Savoirs","Commerce"],anchor:"Alice Carroll est une héritière de Lewis Carroll et voyage grâce à ses ressources ; sa fortune ne prouve pas une maîtrise du combat ni de la magie.",talents:["Expertise éprouvée — Survie"]},
  {id:"pnj-loges-mages-adrien-daigremont-14",tier:"haute",shape:"terrain",skills:["Furtivité","Tir","Investigation","Survie"],anchor:"Adrien d'Aigremont est Crawler, assassin pour la Blanchisserie et mercenaire ; ses arts occultes restent MJ.",talents:["Dossier préparé — cible","Terrain reconnu — infiltration"]},
  {id:"pnj-loges-mages-adalardo-gravina-16",tier:"haute",shape:"terrain",skills:["Furtivité","Athlétisme","Investigation","Survie"],anchor:"Adalardo Gravina est un Crawler et un cambrioleur agile lié à la pègre, engagé pour des coups variés.",talents:["Dossier préparé — cambriolage","Terrain reconnu — intrusion"]},
  {id:"personnages-verite-chasseurs-verawati-yenny-pranoto",tier:"haute",shape:"esprit",skills:["Diplomatie","Savoirs","Investigation","Perception"],anchor:"Verawati Yenny Pranoto exerce comme psychologue et conseillère de vie dans un cadre religieux musulman.",talents:["Lecture des failles — entretien","Expertise éprouvée — Diplomatie"]},
  {id:"personnages-verite-chasseurs-tiamandra-vecellio",tier:"haute",shape:"equilibre",skills:["Représentation","Mêlée","Athlétisme","Esquive"],anchor:"Tiamandra Vecellio est mannequin maltaise chez Dreampoint, sportive et entraînée notamment au combat à l'épée ; sa puissance de Vérité est distincte.",talents:["Expertise éprouvée — Représentation","Expertise éprouvée — Mêlée"]},
  {id:"personnages-verite-chasseurs-raekath-lee",tier:"elite",shape:"terrain",skills:["Survie","Pilotage","Perception","Athlétisme"],anchor:"Raekath Lee est une Ender vagabonde, souvent seule sur sa moto ; elle réalise de petits boulots et côtoie des motards.",talents:["Terrain reconnu — vie nomade","Expertise éprouvée — Pilotage"]},
  {id:"personnages-verite-chasseurs-jude-riot",tier:"haute",shape:"social",skills:["Représentation","Diplomatie","Perception","Commerce"],anchor:"Jude Riot est un acteur charismatique collaborant régulièrement avec la réalisatrice Shmira ; sa lignée est réservée au dossier MJ.",talents:["Expertise éprouvée — Représentation","Réseau mobilisable — cinéma"]},
  {id:"pnj-loges-mages-arash-ostaan-05",tier:"haute",shape:"esprit",skills:["Autorité","Investigation","Diplomatie","Savoirs"],anchor:"Arash Osta'An est cadre de l'administration municipale de New York ; ses responsabilités précises ne sont pas documentées.",talents:["Dossier préparé — administration municipale","Réseau mobilisable — mairie de New York"]},
  {id:"pnj-loges-mages-asuka-yamamuro-23",tier:"haute",shape:"terrain",skills:["Tir","Survie","Perception","Furtivité"],anchor:"Asuka Yamamuro exerce comme Crawler mercenaire ; son affiliation aux gunwatchers figure dans son identité civile.",talents:["Terrain reconnu — contrats mercenaires","Expertise éprouvée — Tir"]},
  {id:"pnj-loges-mages-bassaam-el-akram-21",tier:"elite",shape:"social",skills:["Commerce","Autorité","Investigation","Diplomatie"],anchor:"Bassaam el-Akram est cadre de Wellspring ; aucune spécialité ni fonction exacte ne sont attestées.",talents:["Réseau mobilisable — Wellspring","Dossier préparé — dossiers corporatifs"]},
  {id:"pnj-loges-mages-edwin-kelly-31",tier:"elite",shape:"social",skills:["Autorité","Diplomatie","Commerce","Perception"],anchor:"Edwin Kelly dirige un petit hospice indépendant pour des personnes défavorisées ; le fonctionnement quotidien de l'établissement fonde son profil civil.",talents:["Réseau mobilisable — hospice","Expertise éprouvée — Diplomatie"]},
  {id:"pnj-loges-mages-gwendoleen-macguire-06",tier:"haute",shape:"social",skills:["Autorité","Commerce","Investigation","Diplomatie"],anchor:"Gwendoleen MacGuire dirige une branche de Raven à New York ; le secteur précis de cette branche reste à documenter.",talents:["Chaîne de commandement — branche Raven","Dossier préparé — dossiers de branche"]},
  {id:"pnj-loges-mages-hassan-abate-yideg-22",tier:"elite",shape:"social",skills:["Commerce","Diplomatie","Autorité","Investigation"],anchor:"Hassan Abate Yideg est cadre de Tala ; sa fonction exacte au sein du groupe n'est pas encore documentée.",talents:["Réseau mobilisable — Tala","Dossier préparé — dossiers corporatifs"]},
  {id:"pnj-loges-mages-jin-tian-myong-25",tier:"haute",shape:"terrain",skills:["Furtivité","Investigation","Tir","Survie"],anchor:"Jin-Tian Myong est Crawler et assassin de la Blanchisserie ; ses mutations et sa magie restent réservées au MJ.",talents:["Dossier préparé — cible","Terrain reconnu — infiltration"]},
  {id:"pnj-loges-mages-lara-steven-30",tier:"haute",shape:"social",skills:["Diplomatie","Autorité","Savoirs","Investigation"],anchor:"Lara Steven siège au conseil des tribus de la Grande Réserve ; sa magie n'entre pas dans ce profil de Réalité.",talents:["Réseau mobilisable — Grande Réserve","Dossier préparé — conseil des tribus"]},
  {id:"pnj-loges-mages-melina-apapoulos-15",tier:"elite",shape:"terrain",skills:["Pilotage","Perception","Survie","Athlétisme"],anchor:"Melina Apapoulos est Crawler et Freerunner, chauffeur affectée aux livraisons et aux déplacements fréquents.",talents:["Expertise éprouvée — Pilotage","Terrain reconnu — itinéraires de livraison"]},
  {id:"pnj-loges-mages-mertkan-sabanci-20",tier:"elite",shape:"social",skills:["Commerce","Autorité","Diplomatie","Investigation"],anchor:"Mertkan Sabanci est cadre chez Tala ; sa fonction exacte n'est pas encore documentée.",talents:["Réseau mobilisable — Tala","Dossier préparé — dossiers corporatifs"]},
];
const NO_PROJECTION:string[]=[
  "pnj-122-steeve-golden-hood",
  "pnj-aseryns-terres-temples-leder-caendis-02",
  "pnj-aseryns-terres-temples-kyleane-natyel-04",
  "personnages-verite-especes-quetzalcoatl",
  "pnj-aseryns-terres-temples-erlaris-selerias-09",
  "personnages-verite-humains-galactiques-alkiwa-sebeth-mir",
  "pnj-aseryns-terres-temples-shanelias-duria-29",
  "pnj-aseryns-terres-temples-siegorn-akryth-30",
  "pnj-aseryns-terres-temples-hildeveig-eijnir-31",
  "personnages-verite-extraterrestres-rsheraag",
  "personnages-verite-extraterrestres-dsherraneth",
  "pnj-aseryns-terres-temples-ashilirei-saebbidottir-35",
  "pnj-aseryns-terres-temples-hjor-ornsson-37",
  "pnj-aseryns-terres-temples-thorgerd-glamdottir-39",
  "personnages-verite-extraterrestres-peste-des-vases",
  "pnj-aseryns-terres-temples-naedessia-valendis-46",
  "pnj-aseryns-terres-temples-kyrtareth-48",
  "pnj-aseryns-terres-temples-urekai-serath-49",
  "pnj-aseryns-terres-temples-rhenylia-naranos-nysalia-50",
  "pnj-aseryns-terres-temples-kalireth-renathe-53",
  "personnages-verite-especes-lombre-pape",
  "personnages-verite-especes-mloxol-vaagor",
  "personnages-verite-especes-vhodhalnactru",
  "personnages-verite-especes-gajh-shaoggith",
  "personnages-verite-especes-cthath-vhadhi",
  "personnages-verite-especes-ravana",
  "personnages-verite-especes-angrboda",
  "personnages-verite-especes-akvan",
  "personnages-verite-chasseurs-mrallgirncllg",
  "pnj-aseryns-terres-temples-kalurdia-eineris-56",
  "pnj-aseryns-terres-temples-dycardion-57",
  "pnj-aseryns-terres-temples-taelibatha-58",
  "pnj-aseryns-terres-temples-lorieth-59",
  "pnj-aseryns-terres-temples-edrynae-melemnis-60",
  "pnj-aseryns-terres-temples-irinaeth-eydreas-62",
  "pnj-aseryns-terres-temples-rylias-63",
  "pnj-088-cthulhu",
  "pnj-fleaux-am-mleeac",
  "pnj-091-lidira",
  "pnj-fleaux-dagon",
  "pnj-fleaux-telipinu",
  "pnj-fleaux-roi-du-givre",
  "personnages-verite-vampires-p46-adinhazu",
  "personnages-verite-vampires-p15-ankhsebek",
  "personnages-verite-extrals-groupes-elleth-dyx",
  "personnages-verite-vampires-p07-haimanax",
  "personnages-verite-humains-galactiques-jol-la-etrys",
  "personnages-verite-vampires-p39-kali",
  "personnages-verite-humains-galactiques-karina-kelack",
  "personnages-verite-vampires-p48-kragen-aagor",
  "personnages-verite-extrals-groupes-otrax-01",
  "personnages-verite-vampires-p17-shul-alghul-dite-shula",
  "personnages-verite-vampires-p25-trauco",
  "personnages-verite-extrals-groupes-zirine-fa-meonn"
];
const NEEDS_ARBITRATION:string[]=[
  "pnj-loges-mages-morgane-o-broin-04",
  "pnj-loges-mages-zhao-guanyu-10",
  "pnj-loges-mages-sergio-venegas-12",
  "pnj-loges-mages-zephia-brummer-17",
  "pnj-loges-mages-robert-peng-26",
  "pnj-loges-mages-roowinu-27",
  "pnj-loges-mages-mike-michabou-28",
  "pnj-loges-mages-muna-29",
  "pnj-loges-mages-nike-celio-37"
];

// Several merged dossiers retained the source's Truth paragraphs but lost
// their separately authored Reality biographies. Restore only those public
// source sections; keep supernatural details in the consolidated MJ dossier.
const ROLE_REALITY:Record<string,{role:string;organisation?:string;source?:[Array<Record<string,any>>,string,string];text?:string;mjOnly?:boolean;hideAge?:boolean}>={
  "pnj-136-alisa-svalisdottir":{role:"Crawler · mercenaire et combattante clandestine",text:"Alisa est une Crawler qui travaille comme mercenaire et participe régulièrement à des combats clandestins d'arts martiaux. Elle exerce aussi occasionnellement le travail du sexe."},
  "pnj-108-asheylinn-medira":{role:"Chanteuse",organisation:"Omegacoustic",source:[extralSources,"personnages-verite-extrals-groupes-asheylinn-medira","informations-realite"]},
  "pnj-truth-beatrix-kruger":{role:"Directrice d'Eversor Industries",organisation:"Eversor",text:"Beatrix Krüger dirige Eversor Industries. Cette branche transforme les matières premières non alimentaires en pièces et systèmes de base indispensables aux autres branches du groupe, des clous aux panneaux et autres fournitures courantes."},
  "pnj-truth-cassandra-helen":{role:"Directrice de la branche management · Europe et conseillère en relations du président",organisation:"Dreampoint",source:[fantasticSources,"personnages-verite-fantastiques-cassandra-helen","informations-realite-1"]},
  "pnj-truth-kevin-eckker":{role:"Directeur de la branche pêche et produits de la mer",organisation:"Eversor",source:[fantasticSources,"personnages-verite-fantastiques-kevin-eckker","informations-realite-1"]},
  "pnj-121-zoran-kozic":{role:"Juriste · direction de Mediaforce",organisation:"First Lawyers",source:[extraterrestrialSources,"personnages-verite-extraterrestres-zoran-kozic","informations-realite"]},
  "personnages-verite-fantastiques-koldraalsheroh":{role:"Commandant de terrain · assaut",text:"Connor Shero est le bras droit d'Andrea Shield et commande des assauts sur le terrain. Ancien de la Black Crow, il a participé à plusieurs guerres comme militaire et mercenaire, dont celle de 2022. Tacticien redoutable malgré ses allures de brute, il est taciturne et difficile à contenir ; Andrea reste son amie et son interlocutrice de confiance."},
  "personnages-verite-fantastiques-fredegonda":{role:"Sans-abri",text:"Dans la Réalité, Fredegonda vit sans domicile fixe. Elle ne dispose d'aucune identité civile documentée ; cette situation ne révèle rien de sa nature véritable."},
  "personnages-verite-fantastiques-marjolein-enneman":{role:"Religieuse chrétienne",text:"Marjolein Enneman est officiellement une religieuse chrétienne. Son engagement au sein d'un ordre de chasseurs et son histoire surnaturelle sont réservés au dossier MJ."},
  "personnages-verite-fantastiques-tharlal-rark":{role:"Crawler · chasseur de primes et inventeur",text:"Surnommé « Thor », ce Crawler discret travaille comme chasseur de primes. Bricoleur et inventeur, il reste hors des radars mais propose parfois des technologies de sa fabrication."},
  "personnages-verite-fantastiques-theoderid":{role:"Chef du gang insurgé des Killdrillers",text:"Theoderid dirige les Killdrillers, groupe insurgé initialement surnommé le gang des haches après le massacre de mai 2034. Il s'oppose à Raven et traite parfois avec d'autres groupes insurgés, notamment celui d'Osheena Payne."},
  "pnj-fleaux-focus-ana-diana-de-la-caza-diana-de-la-caza":{role:"Collaboratrice d'une corporation de luxe et d'artisanat",organisation:"Sehdia Craft",hideAge:true,text:"Ana Diana de la Caza travaille officiellement pour Sehdia Craft, corporation d'ultra-luxe et d'artisanat. Elle affiche une apparence jeune ; son âge officiel exact n'est pas encore documenté."},
  "pnj-fleaux-focus-anastasia-vargas-awan-aklima-anastasia-vargas":{role:"Crawler · mercenaire",text:"Anastasia Vargas travaille officiellement comme Crawler et mercenaire."},
  "pnj-fleaux-focus-arkady-karamov-4-arkady-karamov":{role:"Ancien Spetsnaz · mafieux",text:"Après cinq années de service dans les Spetsnaz, Arkady Karamov est revenu à Vladivostok et a bâti sa place dans la pègre. Il a ensuite poursuivi ses activités mafieuses, notamment au sein de la Bratva, pendant et après la guerre."},
  "pnj-fleaux-focus-azaliah-springer-azaliah-springer":{role:"Religieuse catholique",text:"Azaliah Springer est officiellement une nonne catholique."},
  "pnj-fleaux-focus-margareta-diaconescu-areta-diaconescu":{role:"Religieuse catholique",text:"Margareta Diaconescu est une nonne roumaine installée dans une petite église isolée de Californie après les grandes insurrections européennes. Elle conserve un accent roumain prononcé et dégage un charme remarquable."},
  "pnj-fleaux-focus-mila-shilove-094-mila-shilove":{role:"Ender · cheffe de communauté",text:"Mila Shilove, parfois appelée « la prêtresse Mila », dirige une petite communauté isolée en Alaska. Le village, composé de maisons de bois, est peu connu des habitants de la région."},
  "pnj-fleaux-focus-mira-stephens-5-mir-a-stephens":{role:"Assassin",organisation:"La Blanchisserie",text:"Mira Stephens travaille comme assassin pour la Blanchisserie."},
  "pnj-fleaux-focus-noah-brenneman-6-noah-brenneman":{role:"Prêtre catholique",text:"Noah Brenneman est officiellement un prêtre catholique ; il est peu présent dans la vie courante de sa paroisse."},
  "pnj-fleaux-focus-nora-shakir--097-nora-shakir":{role:"Travailleuse du sexe",text:"Nora Shakir exerce le travail du sexe."},
  "pnj-fleaux-focus-olayinka-najja-8-olayinka-najja":{role:"Prêtresse néopaïenne · travailleuse du sexe",text:"Elle exerce également le travail du sexe."},
  "pnj-fleaux-raghnaid-maccalmain":{role:"Travailleuse du sexe",text:"Raghnaid Maccalmain exerce le travail du sexe."},
  "pnj-fleaux-siadara":{role:"Ancienne actrice · employée de YellowFood",organisation:"YellowFood",text:"Sianna Danein est une ancienne actrice de Redwheels. Elle travaille désormais chez YellowFood."},
  "pnj-fleaux-focus-tellia-fedirivna-skrypnyk-dirivna-skrypnyk":{role:"Crawler · Ender et missions ponctuelles",text:"Tellia Fedirivna Skrypnyk vit en marge des réseaux établis. Cette Crawler, proche des Enders et de certains insurgés, accepte des missions ponctuelles."},
  "pnj-fleaux-focus-yegor-karamov-05-yegor-karamov":{role:"Charcudoc clandestin",text:"Yegor Karamov est un savant excentrique et un charcudoc travaillant pour la pègre et des Crawlers. Il conduit ses propres recherches dans la clandestinité, sans en rendre le contenu public."},
  "personnages-verite-humains-galactiques-kay-salzer":{role:"Assassin",organisation:"La Blanchisserie",text:"Kay Salzer travaille comme assassin pour la Blanchisserie."},
  "personnages-verite-humains-galactiques-kenneth-shatter":{role:"Détective · Crawler et Fixer occasionnel",text:"Kenneth Shatter exerce officiellement comme détective. Il appartient aux réseaux Crawlers et intervient à l'occasion comme Fixer."},
  "personnages-verite-humains-galactiques-moira-blake":{role:"Consultante",organisation:"Space Force Union",text:"Moira Blake travaille officiellement comme consultante auprès de la Space Force Union."},
  "personnages-verite-chasseurs-charunee-sawasdipon":{role:"Prêtresse bouddhiste néopaïenne",text:"Charunee Sawasdipon est publiquement une prêtresse bouddhiste néopaïenne."},
  "personnages-verite-chasseurs-isabella-mironescu":{role:"Diseuse de bonne aventure · mercenaire",text:"Isabella Mironescu pratique la voyance et accepte des contrats de mercenaire. Elle possède également un héritage familial, sans que celui-ci définisse à lui seul ses activités."},
  "pnj-loges-mages-anggriawan-yang-24":{role:"Travailleuse du sexe · directrice de maison close",text:"Anggriawan Yáng exerce le travail du sexe et dirige une maison close."},
  "pnj-loges-mages-anayah-kumba-11":{role:"Directrice de recherche · génétique et soins",organisation:"BioSun",text:"Anayah Kumba est scientifique chez BioSun. Elle dirige les recherches en génétique et dans le domaine des soins."},
  "pnj-loges-mages-alice-carroll-38":{role:"Héritière · voyageuse",text:"Alice Carroll est une héritière de Lewis Carroll. Son patrimoine lui permet de subvenir à ses besoins tout en voyageant."},
  "pnj-loges-mages-adrien-daigremont-14":{role:"Crawler · assassin et mercenaire",text:"Adrien d'Aigremont travaille comme Crawler et mercenaire. Il exécute également des contrats d'assassinat pour la Blanchisserie."},
  "pnj-loges-mages-adalardo-gravina-16":{role:"Crawler · cambrioleur",text:"Adalardo Gravina est un Crawler lié à la pègre. Voleur et excellent monte-en-l'air, il réalise des cambriolages et divers coups pour ses contacts."},
  "personnages-verite-chasseurs-verawati-yenny-pranoto":{role:"Psychologue · conseillère de vie",text:"Verawati Yenny Pranoto est une religieuse musulmane. Elle exerce comme psychologue et conseillère de vie."},
  "personnages-verite-chasseurs-tiamandra-vecellio":{role:"Mannequin · top model",organisation:"Dreampoint Corporation",text:"Tiamandra Vecellio est une mannequin maltaise travaillant pour Dreampoint Corporation. Elle pratique beaucoup de sport et des sports de combat, notamment l'escrime."},
  "personnages-verite-chasseurs-raekath-lee":{role:"Ender · travailleuse itinérante",text:"Raekath Lee vit en marge comme Ender vagabonde. Elle roule souvent seule à moto, fréquente parfois des motards et accepte de petits boulots."},
  "personnages-verite-chasseurs-jude-riot":{role:"Acteur",text:"Jude Riot est un acteur charismatique. Il travaille en étroite collaboration avec la réalisatrice Shmira."},
  "pnj-loges-mages-arash-ostaan-05":{role:"Cadre municipal",organisation:"Mairie de New York",text:"Arash Osta'An travaille comme cadre de l'administration municipale de New York. Son poste le place dans le fonctionnement quotidien de la mairie : il suit des dossiers, coordonne des interlocuteurs et doit composer avec les décisions de l'administration. Son service et ses attributions exactes ne sont pas encore précisés."},
  "pnj-loges-mages-asuka-yamamuro-23":{role:"Crawler · mercenaire",text:"Asuka Yamamuro appartient aux réseaux Crawlers et travaille comme mercenaire. Elle alterne les contrats et les périodes de préparation ; ses commanditaires et sa spécialité opérationnelle varient selon les missions."},
  "pnj-loges-mages-bassaam-el-akram-21":{role:"Cadre corporatiste",organisation:"Wellspring",text:"Bassaam el-Akram est cadre chez Wellspring. Il évolue dans une organisation où les projets passent par des arbitrages, des équipes et des rapports de force internes ; son département et son niveau hiérarchique précis restent à établir."},
  "pnj-loges-mages-edwin-kelly-31":{role:"Directeur d'un hospice pour personnes défavorisées",text:"Edwin Kelly dirige sa propre petite entreprise, un hospice qui accueille des personnes défavorisées. À cette échelle, il veille aussi bien à l'accueil des résidents qu'à la continuité du fonctionnement de l'établissement. Les moyens dont dispose l'hospice et ses partenariats restent à préciser."},
  "pnj-loges-mages-gwendoleen-macguire-06":{role:"Directrice de branche · New York",organisation:"Raven",text:"Gwendoleen MacGuire dirige une branche de Raven à New York. Elle encadre l'activité locale et sert de relais entre ses équipes et la corporation. Le domaine précis de cette branche n'est pas encore documenté."},
  "pnj-loges-mages-hassan-abate-yideg-22":{role:"Cadre corporatiste",organisation:"Tala",text:"Hassan Abate Yideg occupe un poste de cadre chez Tala. Il suit des dossiers au sein de la corporation et travaille avec d'autres responsables, sans qu'un département ou une compétence technique particulière soit encore établi dans sa couverture civile."},
  "pnj-loges-mages-jin-tian-myong-25":{role:"Crawler · assassin",organisation:"La Blanchisserie",text:"Jin-Tian Myong évolue parmi les Crawlers et exécute des contrats d'assassinat pour la Blanchisserie. Ses missions supposent de repérer une cible, de préparer une approche et de quitter les lieux ; ses méthodes exactes dépendent du contrat."},
  "pnj-loges-mages-lara-steven-30":{role:"Membre du conseil des tribus",organisation:"Grande Réserve",text:"Lara Steven siège au conseil des tribus de la Grande Réserve. Elle participe aux échanges et aux décisions communes, dans un rôle où l'écoute des représentants compte autant que la défense de leurs intérêts. Ses autres responsabilités civiles restent à préciser."},
  "pnj-loges-mages-melina-apapoulos-15":{role:"Crawler · chauffeuse Freerunner",text:"Melina Apapoulos est une Crawler Freerunner. Chauffeuse, elle assure des livraisons et passe beaucoup de temps sur la route. Son activité l'amène à préparer ses trajets, tenir ses délais et s'adapter aux changements de destination."},
  "pnj-loges-mages-mertkan-sabanci-20":{role:"Cadre corporatiste",organisation:"Tala",text:"Mertkan Sabanci travaille comme cadre chez Tala. Il suit des dossiers et échange avec les autres équipes de la corporation ; son poste précis et la branche à laquelle il appartient ne sont pas encore documentés."}
};

function concealRedundantRealitySecret(article:Article,id:string):void {
  const sourceId:Record<string,string>={
    "pnj-fleaux-focus-nora-shakir--097-nora-shakir":"pnj-097-s2",
    "pnj-fleaux-focus-olayinka-najja-8-olayinka-najja":"pnj-098-s2",
    "pnj-fleaux-focus-yegor-karamov-05-yegor-karamov":"pnj-105-s2"
  };
  if(!sourceId[id])return;
  const section=article.sections?.find(s=>s.id===sourceId[id]);
  if(!section)throw new Error(`PNJ · ancien bloc public introuvable : ${id}`);
  const dossier=article.sections?.find(s=>s.id==="dossier-mj-consolide");
  if(!dossier||!section.blocks?.length||section.blocks.some((b:Record<string,any>)=>
    b.type!=="p"||!dossier.blocks?.some((privateBlock:Record<string,any>)=>
      privateBlock.type==="p"&&String(privateBlock.text??"").includes(String(b.text??"")))))
    throw new Error(`PNJ · récit secret non retrouvé dans le dossier MJ : ${id}`);
  // Each paragraph is already present in the MJ dossier; remove its public copy.
  article.sections=article.sections!.filter(s=>s!==section);
}

function repairRoleReality(article:Article,id:string):void {
  const entry=ROLE_REALITY[id];
  const dossier=article.sections?.find(section=>section.id==="dossier-mj-consolide");
  if(!dossier)throw new Error(`PNJ · dossier MJ absent : ${id}`);
  const source=entry.source?.[0].find(a=>a.id===entry.source?.[1]);
  const sourceSection=source?.sections?.find((s:Record<string,any>)=>s.id===entry.source?.[2]);
  const texts=entry.source
    ? sourceSection?.blocks?.filter((b:Record<string,any>)=>b.type==="p").map((b:Record<string,any>)=>String(b.text).trim())
    : [entry.text];
  if(!texts?.length||texts.some((value:string|undefined)=>!value))throw new Error(`PNJ · biographie source absente : ${id}`);
  // The source attributes an exceptional vocal range to Asheylinn. Do not
  // publish a possibly supernatural capability alongside her civil career.
  if(id==="pnj-108-asheylinn-medira"){
    if(texts.length!==1||!texts[0].includes("Hautaine et désespèrent prétentieuse"))throw new Error("PNJ · biographie d'Asheylinn modifiée");
    texts[0]=texts[0].split(" Hautaine et désespèrent prétentieuse")[0];
  }
  concealRedundantRealitySecret(article,id);
  if(id==="personnages-verite-fantastiques-fredegonda"||entry.mjOnly){
    // Her only known name is occult: this note must stay on the MJ surface.
    dossier.blocks.push({type:"p",text:entry.text});
    return;
  }
  const card=article.sections?.find(section=>section.id==="identite-realite-consolidee")?.blocks?.find((block:Record<string,any>)=>block.type==="table");
  if(!card?.rows||card.rows[0]?.[0]!=="Champ")throw new Error(`PNJ · identité publique absente : ${id}`);
  if(entry.hideAge){
    const age=card.rows.find((row:string[])=>row[0]==="Âge");
    if(!age||age[1]!=="79 ans")throw new Error(`PNJ · âge source d'Ana Diana modifié : ${id}`);
    card.rows=card.rows.filter((row:string[])=>row[0]!=="Âge");
    dossier.blocks.push({type:"p",text:"L'âge réel de 79 ans, présent dans la source, ne correspond pas à l'âge qu'Ana Diana affiche publiquement. Âge officiel exact non établi."});
  }
  card.rows.push(["Fonction",entry.role]);
  if(entry.organisation)card.rows.push(["Organisation",entry.organisation]);
  const reality={id:"parcours-realite-role",title:"Parcours · Réalité",audience:"public",blocks:texts.map((value:string)=>({type:"p",text:value}))};
  if(id==="pnj-fleaux-focus-olayinka-najja-8-olayinka-najja"){
    const publicReality=article.sections?.find(section=>section.id==="vampires-realite"&&section.audience!=="mj");
    if(!publicReality?.blocks?.length)throw new Error("PNJ · récit de Réalité d'Olayinka absent");
    publicReality.blocks.push(...reality.blocks);
  } else article.sections!.splice(article.sections!.indexOf(dossier),0,reality);
  if(id==="pnj-136-alisa-svalisdottir")article.tags=[...new Set([...(article.tags??[]),"réalité/faction/crawlers"])];
  if(id==="personnages-verite-fantastiques-tharlal-rark")article.tags=[...new Set([...(article.tags??[]),"réalité/faction/crawlers"])];
  if(id==="personnages-verite-fantastiques-theoderid")article.tags=[...new Set([...(article.tags??[]),"réalité/faction/insurgés"])];
  if(id==="pnj-fleaux-focus-anastasia-vargas-awan-aklima-anastasia-vargas")article.tags=[...new Set([...(article.tags??[]),"réalité/faction/crawlers"])];
  if(["pnj-fleaux-focus-tellia-fedirivna-skrypnyk-dirivna-skrypnyk","personnages-verite-humains-galactiques-kenneth-shatter","pnj-fleaux-focus-yegor-karamov-05-yegor-karamov"].includes(id))article.tags=[...new Set([...(article.tags??[]),"réalité/faction/crawlers"])];
  if(id==="pnj-fleaux-focus-arkady-karamov-4-arkady-karamov")article.tags=[...new Set([...(article.tags??[]),"réalité/faction/pègre"])];
  if(["pnj-fleaux-focus-azaliah-springer-azaliah-springer","pnj-fleaux-focus-margareta-diaconescu-areta-diaconescu","pnj-fleaux-focus-noah-brenneman-6-noah-brenneman"].includes(id))article.tags=[...new Set([...(article.tags??[]),"réalité/faction/religieux"])];
  if(["personnages-verite-chasseurs-charunee-sawasdipon","pnj-fleaux-focus-olayinka-najja-8-olayinka-najja"].includes(id))article.tags=[...new Set([...(article.tags??[]),"réalité/faction/religieux"])];
  if(id==="personnages-verite-chasseurs-verawati-yenny-pranoto")article.tags=[...new Set([...(article.tags??[]),"réalité/faction/religieux"])];
  if(["pnj-loges-mages-adrien-daigremont-14","pnj-loges-mages-adalardo-gravina-16","pnj-loges-mages-asuka-yamamuro-23","pnj-loges-mages-jin-tian-myong-25","pnj-loges-mages-melina-apapoulos-15"].includes(id))article.tags=[...new Set([...(article.tags??[]),"réalité/faction/crawlers"])];
  if(id==="pnj-loges-mages-adalardo-gravina-16")article.tags=[...new Set([...(article.tags??[]),"réalité/faction/pègre"])];
  if(id==="pnj-fleaux-focus-yegor-karamov-05-yegor-karamov")article.tags=[...new Set([...(article.tags??[]),"réalité/faction/pègre"])];
  if(entry.organisation){
    article.tags=[...new Set([...(article.tags??[]),`réalité/organisation/${entry.organisation}`])];
    if(!["La Blanchisserie","Mairie de New York","Grande Réserve"].includes(entry.organisation))article.tags=[...new Set([...article.tags,"réalité/faction/corporatiste"])];
  }
  if(id==="pnj-fleaux-siadara"||id.startsWith("pnj-loges-mages-"))article.audience="public";
  if(id==="personnages-verite-humains-galactiques-moira-blake")article.secretTags=[...new Set([...(article.secretTags??[]),"vérité/nom/Morrighan"])];
}

export function applyPnjStatBatch16(byId:Map<string,Article>):void {
  if(PROFILES.length!==59||NO_PROJECTION.length+NEEDS_ARBITRATION.length!==63||
     new Set([...PROFILES.map(p=>p.id),...NO_PROJECTION,...NEEDS_ARBITRATION]).size!==122)
     throw new Error("PNJ · résolution finale incomplète ou dupliquée");
  for(const profile of PROFILES){
    const article=byId.get(profile.id);
    if(!article)throw new Error(`PNJ · fiche active introuvable : ${profile.id}`);
    if(profile.id==="pnj-crawlers-docx-adam-nevine-qigang-xuyin-carmello-shen")repairAdamIdentity(article);
    if(profile.id==="pnj-115-myra-allan")repairMyraIntroduction(article);
    if(ROLE_REALITY[profile.id])repairRoleReality(article,profile.id);
    if(!article.sections?.some(section=>section.id==="profil-statistique"))
      (article.sections??=[]).push({id:"profil-statistique",title:"Profil statistique",audience:"mj",blocks:[]});
    applyNamedPnjStatProfile(article,profile);
  }
  for(const [ids,note] of [
    [NO_PROJECTION,"Aucune projection civile individuelle n'est documentée. Bloc de statistiques de Réalité non applicable ; seules les capacités révélées pourront être chiffrées après arbitrage MJ."],
    [NEEDS_ARBITRATION,"Le corpus conserve une identité ou un rôle, sans parcours civil assez précis pour attribuer des compétences et des talents chiffrés avec fiabilité. Arbitrage éditorial requis avant de créer ce profil de Réalité."]
  ] as const)for(const id of ids){
    const article=byId.get(id);
    if(!article)throw new Error(`PNJ · fiche active introuvable : ${id}`);
    let stats=article.sections?.find(section=>section.id==="profil-statistique");
    if(!stats){stats={id:"profil-statistique",title:"Profil statistique · à qualifier",audience:"mj",blocks:[]};(article.sections??=[]).push(stats);}
    if(article.sections?.at(-1)!==stats||stats.blocks?.length)throw new Error(`PNJ · dossier statistique déjà exploité : ${id}`);
    stats.audience="mj";
    stats.blocks=[{type:"p",text:note}];
  }
}
function repairAdamIdentity(article:Article):void {
  const card=article.sections?.find(section=>section.id==="identite-realite-consolidee")?.blocks?.[0];
  const name=card?.rows?.find((row:string[])=>row[0]==="Nom");
  const aliases=card?.rows?.find((row:string[])=>row[0]==="Alias");
  if(!name||!aliases||!String(name[1]).includes("Carmello SHEN"))throw new Error("PNJ · identité d'Adam modifiée");
  name[1]="Adam Nevine";aliases[1]="Qigang Xuyin · Carmello Shen · L’omniscient";
  article.title="Adam Nevine";
  if(article.pnj){article.pnj.real_name="Adam Nevine";article.pnj.identity_keys=["Adam Nevine","Qigang Xuyin","Carmello Shen","L’omniscient"];}
}
function repairMyraIntroduction(article:Article):void {
  const section=article.sections?.find(section=>section.id==="pnj-115-s2");
  if(!section?.blocks?.length||!String(section.blocks[0].text).startsWith("Mettre de côté l’environnement"))throw new Error("PNJ · histoire de Myra modifiée");
  section.blocks.unshift({type:"p",text:"Myra Allan est une Crawler canadienne proche des milieux insurgés qui défendent l’environnement."});
}
