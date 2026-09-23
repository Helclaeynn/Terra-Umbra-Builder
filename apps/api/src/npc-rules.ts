// Shared with the Compendium article: one source for NPC budgets and talent text.
export const NPC_RULES_ARTICLE='regles-pnj-talents-statistiques';
export const NPC_TIERS=[
 {id:'sbire',name:'Sbire',attributes:20,skills:20,cap:4,talents:'0',recommended:0},
 {id:'lambda',name:'Ennemi lambda',attributes:22,skills:25,cap:5,talents:'0–1',recommended:0},
 {id:'entraine',name:'Entraîné',attributes:25,skills:40,cap:7,talents:'1–2',recommended:1},
 {id:'elite',name:'Élite',attributes:28,skills:55,cap:9,talents:'2–3',recommended:2},
 {id:'haute-elite',name:'Haute élite',attributes:32,skills:75,cap:10,talents:'3–4',recommended:3},
 {id:'heroique',name:'Héroïque',attributes:38,skills:110,cap:13,talents:'3–5',recommended:3},
 {id:'legendaire',name:'Légendaire',attributes:42,skills:140,cap:14,talents:'4–6',recommended:4},
 {id:'superieur',name:'Supérieur',attributes:46,skills:170,cap:15,talents:'sur mesure',recommended:0}
];
export const npcTalents:Array<[string,string,string,string]>= [
  ["Expertise","Apex — compétence","PNJ nommé Héroïque ou Légendaire, spécialité documentée","Une compétence à 15 dans le budget de son palier, une seule par personnage ; aucun bonus au jet."],
  ["Expertise","Dossier préparé","Investigation 6+ et recherches préalables effectives","1/scène : +2 à un test d'Investigation, d'Autorité ou de Diplomatie fondé sur ce dossier ; une cible précise."],
  ["Expertise","Expertise éprouvée","Une compétence définie à 7+","1/scène : relancer le premier d10 d'un test de cette compétence et garder le second, y compris un échec narratif."],
  ["Expertise","Lecture des failles","Investigation ou Perception 7+ et observation réelle","1/scène : relever une faiblesse, routine ou ouverture effectivement accessible à l'observation ; aucune exploitation automatique."],
  ["Expertise","Fausse piste administrative","Investigation ou Savoirs 6+ et accès institutionnel","1/scénario : retarder ou orienter une consultation administrative vers une piste préparée ; n'efface aucune preuve déjà détenue."],
  ["Combat","Tir maîtrisé","Tir 7+ et 1 PA consacré à Viser","1/scène : relancer le premier d10 d'une attaque de Tir et garder le second ; exige arme et ligne de vue."],
  ["Combat","Désarmement net","Mêlée ou Pugilat 8+","1/scène, après une attaque réussie de marge 3+ : tenter un désarmement d'arme exposée comme Altération ; opposition physique appropriée."],
  ["Combat","Lutte brève","Pugilat 7+","1/scène, après une attaque de Pugilat réussie : engager une saisie contre une cible de gabarit compatible ; libération par opposition normale."],
  ["Combat","Décrochage préparé","Athlétisme ou Esquive 6+ et 1 PA disponible","1/scène, en réaction à une attaque déclarée : se déplacer de 2 m vers un espace réellement atteignable, avant sa résolution."],
  ["Combat","Terrain reconnu","Survie ou Perception 7+ et repérage préalable","1/scène : +2 à un test d'Athlétisme, de Survie ou de Perception lié à ce terrain réellement reconnu."],
  ["Combat","Chef de manœuvre","Autorité 6+ et allié en mesure d'entendre","1/scène : +2 au prochain test d'un allié pour un ordre tactique précis avant la fin du round ; ne se cumule pas avec l'Assistance."],
  ["Ressources","Réseau mobilisable","Autorité 6+ et réseau documenté","1/scénario : solliciter un service plausible ; la fiche précise personnes, délai, portée et traces. Aucun renfort instantané."],
  ["Ressources","Chaîne de commandement","Autorité 7+ et mandat réel","Accès prioritaire à une ressource conforme à la fonction ; les contrôles et contestations de l'institution demeurent."],
  ["Ressources","Plan de sortie","Investigation ou Autorité 6+ et itinéraire préparé","1/scène : signaler un repli crédible à un groupe briefé ; chacun paie ses PA et affronte les obstacles réels."],
  ["Vérité","Enveloppe vide","PNJ nommé, enveloppe effectivement préparée avant la scène","La présence détruite ne contient personne. La vraie position du PNJ et les indices de substitution sont établis à l'avance."],
  ["Vérité","Correction fatale","PNJ nommé explicitement protégé par l'Hologramme","Au plus 1/scénario, avant une blessure mortelle établie : infléchir l'événement si la cohérence locale le permet ; effets matériels conservés."],
  ["Vérité","Continuité du Pilier","Pilier identifié, par exemple Belyandra Queen","Permanent : une atteinte réelle à la personne rencontre les protections de sa Nature véritable ; aucune mort constatée n'est effacée."],
  ["Vérité","Éveil singulier","Transformation canonique propre à un PNJ nommé","Décrit les états et permissions propres à son histoire ; n'accorde aucun bonus numérique générique."]
];
export const NPC_TALENTS=npcTalents.filter(t=>t[0]!=='Vérité'&&t[1]!=='Apex — compétence').map(t=>({id:t[1],group:t[0],name:t[1],prerequisite:t[2],effect:t[3]}));
