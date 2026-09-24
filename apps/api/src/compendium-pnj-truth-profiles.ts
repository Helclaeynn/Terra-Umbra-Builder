type Block = {type:'p';text:string}|{type:'table';rows:string[][]};
import {applyPnjTruthBatch001, REVIEWED_TRUTH_BATCH_001_IDS} from './compendium-pnj-truth-batch-001.js';
type Article = {id:string;sections?:Array<{id?:string;audience?:string;blocks?:Block[]}>;[key:string]:any};
const p=(text:string):Block=>({type:'p',text});
const table=(rows:string[][]):Block=>({type:'table',rows});
export const INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS = [
  'personnages-verite-especes-neeba-ngubenani',
  'pnj-142-dan-harrington',
  'personnages-verite-especes-quetzalcoatl',
  'personnages-verite-especes-elody-katherine-skotia',
  'personnages-verite-especes-ming-xinya',
  'pnj-fleaux-focus-olayinka-najja-8-olayinka-najja',
  'personnages-verite-especes-megda-ayshin',
  ...REVIEWED_TRUTH_BATCH_001_IDS
] as const;

// Editorial, source-anchored Truth profiles are separate from Reality. The
// purchaser catalog and the exact PTV total stay unset until individual Dons
// and Talents have been selected and checked against their prerequisites.
export function applyCompendiumPnjTruthProfiles(byId:Map<string,Article>):void {
  const neeba=byId.get('personnages-verite-especes-neeba-ngubenani');
  if(!neeba)throw new Error('Profil Vérité : Neeba introuvable');
  const reality=neeba.sections?.find(section=>section.id==='profil-statistique');
  if(!reality||reality.audience!=='mj')throw new Error('Profil Vérité : profil MJ de Neeba introuvable');
  reality.blocks??=[];
  reality.blocks.push(
    p('Vérité · Neeba « l’Oba Okunkun ». Le profil Héroïque de Réalité décrit son rôle d’avocat et de dirigeant ; il ne mesure pas le roi vampire. Estimation MJ indépendante : Semi-Révélé Légendaire, Révélé Supérieur. Le dossier des Cours vampiriques établit son règne sur l’Oru Ayeraye, ses conquêtes, son immersion dans la Fontaine des Ténèbres et son lien avec Gundura. Ces éléments justifient ce saut de puissance ; les valeurs ci-dessous sont un calibrage de jeu, non des nombres cités par la source.'),
    table([
      ['État','Palier de combat','Attributs','Compétences','Vigueur','Agilité','Esprit','Volonté','Charisme'],
      ['Voilé','Héroïque · profil de Réalité','38','110','6','6','8','8','10'],
      ['Semi-Révélé','Légendaire · estimation MJ','42','140','8','7','8','9','10'],
      ['Révélé','Supérieur · estimation MJ','46','170','10','8','8','10','10']
    ]),
    table([
      ['Compétence de Vérité révélée','Rang proposé'],
      ['Pugilat','15'],['Autorité','14'],['Force Mentale','14'],['Mêlée','13'],
      ['Constitution','13'],['Esquive','12'],['Perception','12'],['Athlétisme','11'],
      ['Survie','10'],['Savoirs','10'],['Furtivité','9'],['Investigation','8'],
      ['Diplomatie','8'],['Commerce','7'],['Représentation','7'],['Tir','7']
    ]),
    p('Les valeurs des états Semi-Révélé et Révélé incluent déjà les modificateurs de Nature vampire (+1 Vigueur et +1 Volonté en SR ; +2 Vigueur et +1 Volonté en R) : ne pas les ajouter une seconde fois. Le passage à Révélé remplace Semi-Révélé. Les 170 points de compétences révélées sont une répartition éditoriale ancrée dans son règne et ses conquêtes, distincte de sa formation d’avocat. Les pouvoirs précis, valeurs dérivées et PTV attendent le choix vérifié des Talents et Dons ; leur total n’est pas inféré de son âge ni de son titre.'),
    table([
      ['Capacité documentée','Portée sur la fiche'],
      ['Souverain de l’Oru Ayeraye','Autorité et ressources de sa cour ; une faction et ses délais, pas une armée instantanée.'],
      ['Gundura','Deimone ancienne liée à Neeba, invocable ou maniée comme une arme selon le dossier ; définir les règles de l’invocation avec le catalogue avant un jet.'],
      ['Fontaine des Ténèbres','Immersion et puissance exceptionnelles documentées ; aucun achat PTV ou effet chiffré supposé.'],
      ['Lien à Gundura — Talent signature','1/scène, 1 PA pour donner un ordre précis ; Gundura garde sa propre initiative et exige une fiche distincte.']
    ])
  );

  const dragoy=byId.get('pnj-142-dan-harrington');
  if(!dragoy)throw new Error('Profil Vérité : Dragoy Skotia introuvable');
  const dragoyReality=dragoy.sections?.find(section=>section.id==='profil-statistique');
  if(!dragoyReality||dragoyReality.audience!=='mj')throw new Error('Profil Vérité : profil MJ de Dragoy introuvable');
  dragoyReality.blocks??=[];
  dragoyReality.blocks.push(
    p('Vérité · Dragoy Skotia. Dan Harrington est un Fixer de Haute élite dans la Réalité. Dragoy fut un guerrier exceptionnel avant sa transformation ; il a combattu pendant des millénaires, fondé la Krovni Rytsari et compte parmi les plus puissants rois vampires selon le dossier MJ des Cours vampiriques. Son profil de Vérité est donc chiffré séparément. Les valeurs suivantes sont un calibrage éditorial de jeu, et non des nombres cités par le livre.'),
    table([
      ['État','Palier de combat','Attributs','Compétences','Vigueur','Agilité','Esprit','Volonté','Charisme'],
      ['Voilé','Haute élite · profil de Réalité','32','75','4','5','10','7','6'],
      ['Semi-Révélé','Légendaire · estimation MJ','42','140','9','9','9','8','7'],
      ['Révélé','Supérieur · estimation MJ','46','170','10','10','9','9','8']
    ]),
    table([
      ['Compétence de Vérité révélée','Rang proposé'],
      ['Pugilat','17'],['Mêlée','14'],['Athlétisme','14'],['Esquive','13'],
      ['Survie','13'],['Perception','12'],['Force Mentale','12'],['Constitution','11'],
      ['Autorité','10'],['Furtivité','10'],['Investigation','9'],['Savoirs','8'],
      ['Tir','8'],['Diplomatie','7'],['Commerce','7'],['Représentation','5']
    ]),
    p('Révélé : 46 points d’Attributs et 170 de Compétences ; le Pugilat 17 est une exception MJ personnelle fondée sur son passé de guerrier exceptionnel et ses millénaires de combats. Talent signature : Renversement du roi — Dragoy (déclencheur, opposition et limite dans la page des règles PNJ). Ces totaux incluent déjà le bonus de Nature vampire (+2 Vigueur et +1 Volonté en R) et ne se cumulent pas avec les valeurs SR. La Marque de Caïn et son état incomplet d’Archivampire sont documentés, mais leurs effets et leur coût PTV exacts restent à sélectionner dans les règles avant de les chiffrer.')
  );

  const quetzal=byId.get('personnages-verite-especes-quetzalcoatl');
  if(!quetzal)throw new Error('Profil Vérité : Quetzalcoatl introuvable');
  const finalReality=quetzal.sections?.find(section=>section.id==='profil-statistique');
  if(!finalReality||!quetzal.sections)throw new Error('Profil Vérité : dossier de Quetzalcoatl incomplet');
  const index=quetzal.sections.indexOf(finalReality);
  quetzal.sections.splice(index,0,{
    id:'profil-verite-quetzalcoatl',audience:'mj',
    title:'Profil de Vérité · Quetzalcoatl',level:2,
    blocks:[
      p('Figure singulière · puissance occulte exceptionnelle · corps physique variable. Son dossier décrit plusieurs identités, des corps d’hôtes différents et un corps de base remodelable. Un total fixe de Vigueur, de Pugilat ou de PV pour toutes ses apparences contredirait cette source. La fiche de la couverture choisie fournit les statistiques physiques du corps en scène ; les pouvoirs acquis et les états de Vérité sont suivis séparément.'),
      table([
        ['Axe','Évaluation MJ fondée sur le dossier'],
        ['Combat physique','Variable selon l’hôte ; le dossier le situe sous Dragoy ou Neeba sur cet axe.'],
        ['Puissance occulte','Exceptionnelle ; capacités de Sang et Mageius documentées, PTV exacts à établir par achats vérifiés.'],
        ['Sang masqué','Changements d’apparence documentés ; utiliser les effets et prérequis du catalogue pour chaque usage.'],
        ['Sang primal','Forme de serpent ailé géant rapportée au conditionnel dans la source : garder ce statut tant que confirmée en jeu.'],
        ['Sang Coatl · signature','Si un vampire a bu son Sang selon les conditions préparées, Quetzal peut renaître dans cet hôte et écraser sa personnalité ; le corps de base demeure. Ni retour sans hôte ni statistiques de l’hôte inventées.']
      ]),
      p('La Vérité peut inverser la confrontation : un adversaire physiquement supérieur à son hôte reste exposé à ses capacités occultes et à sa survie par le Sang Coatl. La Nature Khinae corrompue et le Mageius de Brimhild restent des éléments singuliers, sans second jeu de bonus attribué automatiquement.')
    ]
  } as any);

  const hecate=byId.get('personnages-verite-especes-elody-katherine-skotia');
  const hecateReality=hecate?.sections?.find(section=>section.id==='profil-statistique');
  if(!hecateReality||hecateReality.audience!=='mj')throw new Error('Profil Vérité : Hécate Skotia introuvable');
  hecateReality.blocks??=[];
  hecateReality.blocks.push(
    p('Vérité · Hécate Skotia. Son profil Héroïque de Réalité mesure sa carrière scientifique. La première princesse de la Krovni est présentée comme peut-être le vampire le plus puissant de toutes les Cours ; elle a contribué avec Dragoy aux conquêtes de la Krovni et à la diffusion de la Marque de Caïn. L’estimation de Vérité la place hors de l’étalon Supérieur, davantage par ses pouvoirs et son savoir que par un Pugilat supérieur à celui de Dragoy.'),
    table([
      ['État','Profil','Attributs','Compétences','Vigueur','Agilité','Esprit','Volonté','Charisme'],
      ['Voilé','Héroïque · Réalité','38','110','6','6','10','9','7'],
      ['Semi-Révélé','Singulière · estimation MJ','45','155','9','8','10','9','9'],
      ['Révélé','Hors étalon · estimation MJ','50','185','10','9','11','10','10']
    ]),
    table([
      ['Compétence de Vérité révélée','Rang proposé'],
      ['Savoirs','18'],['Force Mentale','16'],['Autorité','15'],['Pugilat','14'],
      ['Mêlée','13'],['Constitution','13'],['Esquive','12'],['Perception','12'],
      ['Investigation','11'],['Soin','11'],['Athlétisme','10'],['Furtivité','9'],
      ['Diplomatie','9'],['Survie','8'],['Mécanique','7'],['Commerce','7']
    ]),
    p('Savoirs 18 et Force Mentale 16 sont des exceptions MJ explicites. Les attributs SR/R comprennent les modificateurs vampiriques et ne s’additionnent pas. Talent signature : Héritage de la Krovni, lié à ses recherches et à la transformation des lignées ; ses effets à long terme se préparent comme une intrigue. Les achats PTV, la Marque de Caïn et les pouvoirs exacts demeurent à déterminer dans leurs catalogues ; aucun Don n’est octroyé automatiquement par ce talent.')
  );

  const xinya=byId.get('personnages-verite-especes-ming-xinya');
  const xinyaReality=xinya?.sections?.find(section=>section.id==='profil-statistique');
  if(!xinyaReality||xinyaReality.audience!=='mj')throw new Error('Profil Vérité : Xinya introuvable');
  xinyaReality.blocks??=[];
  xinyaReality.blocks.push(
    p('Vérité · Ming Xinya. L’Élite de sa couverture de Réalité ne représente pas l’impératrice archivampire du Shì hun zhe, décrite comme la plus ancienne vampire connue, sorcière incomparable et guerrière entraînée. Le dossier relate aussi un scellement ancien par un membre du clan Shi : elle possède une vulnérabilité attestée. Les valeurs révélées ci-dessous sont une estimation MJ propre à sa fiche.'),
    table([
      ['État','Profil','Attributs','Compétences','Vigueur','Agilité','Esprit','Volonté','Charisme'],
      ['Voilé','Élite · Réalité','28','55','4','4','6','6','8'],
      ['Semi-Révélé','Singulière · estimation MJ','43','150','8','7','9','10','9'],
      ['Révélé','Hors étalon · estimation MJ','50','185','9','9','11','11','10']
    ]),
    table([
      ['Compétence de Vérité révélée','Rang proposé'],
      ['Savoirs','18'],['Force Mentale','16'],['Diplomatie','15'],['Mêlée','14'],
      ['Pugilat','13'],['Esquive','13'],['Perception','12'],['Autorité','12'],
      ['Furtivité','11'],['Investigation','11'],['Constitution','10'],['Athlétisme','9'],
      ['Survie','9'],['Commerce','8'],['Langages & Argot','7'],['Représentation','7']
    ]),
    p('Savoirs 18 et Force Mentale 16 sont des exceptions MJ fondées sur sa pratique millénaire ; elles ne donnent aucune immunité au taoïsme véritable. Talent signature : Équilibre impérial, une préparation défensive limitée liée aux recherches décrites dans son dossier. Les propriétés propres aux Archivampires et les Talents de Sang ne sont ajoutés qu’après vérification de leurs prérequis et de leurs coûts ; aucune règle commune de Vampire ne se cumule aveuglément avec sa Nature singulière.')
  );

  const olayinka=byId.get('pnj-fleaux-focus-olayinka-najja-8-olayinka-najja');
  const olayinkaReality=olayinka?.sections?.find(section=>section.id==='profil-statistique');
  if(!olayinkaReality||olayinkaReality.audience!=='mj')throw new Error('Profil Vérité : Olayinka introuvable');
  olayinkaReality.blocks??=[];
  olayinkaReality.blocks.push(
    p('Vérité · Olayinka Najja. Son profil de Réalité décrit une dirigeante religieuse ; le dossier MJ décrit l’ancienne chamane devenue archiprêtresse de la Fontaine des Ténèbres, mère adoptive et mentor de Neeba, dont le sang peut engendrer une Strygoï noire. La puissance religieuse et vampirique est évaluée indépendamment de son métier apparent. Les nombres suivants sont une estimation éditoriale pour le jeu.'),
    table([
      ['État','Profil','Attributs','Compétences','Vigueur','Agilité','Esprit','Volonté','Charisme'],
      ['Voilé','Haute élite · Réalité','32','75','5','5','7','7','8'],
      ['Semi-Révélé','Légendaire · estimation MJ','42','140','7','7','9','9','10'],
      ['Révélé','Supérieur · estimation MJ','46','170','9','7','10','10','10']
    ]),
    table([
      ['Compétence de Vérité révélée','Rang proposé'],
      ['Savoirs','17'],['Force Mentale','16'],['Autorité','15'],['Diplomatie','14'],
      ['Constitution','13'],['Perception','12'],['Pugilat','12'],['Représentation','11'],
      ['Survie','10'],['Investigation','10'],['Esquive','9'],['Athlétisme','8'],
      ['Furtivité','7'],['Mêlée','6'],['Commerce','5'],['Tir','5']
    ]),
    p('Savoirs 17 et Force Mentale 16 sont des exceptions MJ propres à sa pratique et à son ancienneté. Les valeurs SR/R comprennent les bonus de Nature vampire. Talent signature : Sang de la Fontaine ; la transformation éventuelle d’un humain est un événement de scénario et demande un contact réel. Son sang ne lui confère aucun achat gratuit de Sang d’une autre Cour ; les PTV et les règles de la Fontaine restent à documenter séparément.')
  );

  const megda=byId.get('personnages-verite-especes-megda-ayshin');
  const megdaReality=megda?.sections?.find(section=>section.id==='profil-statistique');
  if(!megdaReality||megdaReality.audience!=='mj')throw new Error('Profil Vérité : Megda introuvable');
  megdaReality.blocks??=[];
  megdaReality.blocks.push(
    p('Vérité · Megda Ayshin, la Lamia. Sa Haute élite de Réalité reflète sa couverture d’insurgée ; le dossier MJ atteste une reine de l’Alghul manipulatrice, infiltrant chasseurs et réseaux criminels, et un venin surnaturel transmis par baiser, morsure ou effluve. Sa puissance occulte et son influence sont chiffrées à part de son activité apparente. Les valeurs suivantes sont une estimation éditoriale.'),
    table([
      ['État','Profil','Attributs','Compétences','Vigueur','Agilité','Esprit','Volonté','Charisme'],
      ['Voilé','Haute élite · Réalité','32','75','8','8','5','6','5'],
      ['Semi-Révélé','Légendaire · estimation MJ','42','140','8','8','8','9','9'],
      ['Révélé','Supérieur · estimation MJ','46','170','9','9','9','10','9']
    ]),
    table([
      ['Compétence de Vérité révélée','Rang proposé'],
      ['Autorité','16'],['Furtivité','16'],['Force Mentale','15'],['Diplomatie','14'],
      ['Savoirs','13'],['Perception','12'],['Constitution','12'],['Pugilat','11'],
      ['Investigation','10'],['Esquive','10'],['Survie','9'],['Commerce','8'],
      ['Tir','7'],['Athlétisme','6'],['Mêlée','6'],['Représentation','5']
    ]),
    p('Autorité 16 et Furtivité 16 sont des exceptions MJ liées à la manipulation de sa Cour et à ses infiltrations documentées. Les valeurs SR/R comprennent les bonus de Nature vampire. Talent signature : Venin de la Lamia, à résoudre sur exposition réelle et résistance appropriée ; il n’ouvre pas automatiquement l’arbre de Sang Venimeux d’une autre Cour. Son appartenance secrète à Ashlutum et l’Œil d’or demandent des achats et prérequis vérifiés avant de chiffrer les pouvoirs correspondants.')
  );
  applyPnjTruthBatch001(byId);
}
