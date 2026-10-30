// Secondary skills for the 52 reviewed Truth-only dossiers other than Karina
// and Quetzalcoatl. Each line was selected against that character's dossier;
// no rank is inferred from a civil occupation or a generic species bonus.
const secondary:Record<string,string>={
  'pnj-122-steeve-golden-hood':'Esquive:14;Athlétisme:14;Survie:13;Perception:12;Force Mentale:12;Mêlée:11;Autorité:9;Investigation:8',
  'pnj-aseryns-terres-temples-leder-caendis-02':'Perception:14;Esquive:13;Athlétisme:13;Force Mentale:12;Pilotage:12;Constitution:11;Savoirs:10;Investigation:9',
  'pnj-aseryns-terres-temples-kyleane-natyel-04':'Survie:14;Esquive:14;Perception:13;Investigation:13;Force Mentale:12;Athlétisme:11;Diplomatie:10;Constitution:10',
  'pnj-aseryns-terres-temples-erlaris-selerias-09':'Perception:18;Esquive:17;Athlétisme:16;Force Mentale:15;Savoirs:14;Investigation:13;Pugilat:12;Autorité:11',
  'personnages-verite-humains-galactiques-alkiwa-sebeth-mir':'Savoirs:16;Investigation:15;Diplomatie:14;Force Mentale:13;Perception:13;Mécanique:12;Esquive:10;Pilotage:9',
  'pnj-aseryns-terres-temples-shanelias-duria-29':'Savoirs:17;Diplomatie:16;Perception:15;Investigation:14;Constitution:13;Esquive:12;Survie:11;Autorité:10',
  'pnj-aseryns-terres-temples-siegorn-akryth-30':'Survie:16;Esquive:15;Perception:15;Mêlée:14;Athlétisme:12;Diplomatie:11;Investigation:10;Furtivité:9',
  'pnj-aseryns-terres-temples-hildeveig-eijnir-31':'Pugilat:18;Constitution:18;Esquive:17;Athlétisme:17;Perception:16;Survie:15;Diplomatie:13;Savoirs:12',
  'personnages-verite-extraterrestres-rsheraag':'Pugilat:21;Survie:20;Perception:20;Esquive:18;Athlétisme:18;Furtivité:15;Mêlée:14;Investigation:13',
  'personnages-verite-extraterrestres-dsherraneth':'Constitution:21;Pugilat:20;Survie:19;Perception:19;Esquive:18;Athlétisme:16;Furtivité:15;Savoirs:14',
  'pnj-aseryns-terres-temples-ashilirei-saebbidottir-35':'Perception:15;Force Mentale:14;Investigation:13;Survie:12;Constitution:11;Esquive:10;Représentation:10;Commerce:9',
  'pnj-aseryns-terres-temples-hjor-ornsson-37':'Mêlée:17;Constitution:15;Athlétisme:15;Esquive:14;Perception:14;Force Mentale:13;Survie:12;Diplomatie:11',
  'pnj-aseryns-terres-temples-thorgerd-glamdottir-39':'Autorité:16;Diplomatie:15;Perception:14;Constitution:13;Esquive:11;Survie:11;Soin:10;Investigation:9',
  'personnages-verite-extraterrestres-peste-des-vases':'Perception:19;Furtivité:18;Esquive:17;Investigation:16;Pugilat:15;Savoirs:14;Athlétisme:13;Autorité:12',
  'pnj-aseryns-terres-temples-naedessia-valendis-46':'Investigation:13;Force Mentale:13;Perception:12;Constitution:11;Esquive:10;Survie:10;Commerce:9;Langages & Argot:9',
  'pnj-aseryns-terres-temples-kyrtareth-48':'Constitution:18;Esquive:17;Perception:16;Athlétisme:15;Survie:14;Pugilat:13;Furtivité:12;Investigation:11',
  'pnj-aseryns-terres-temples-urekai-serath-49':'Survie:16;Esquive:15;Force Mentale:15;Perception:14;Athlétisme:13;Furtivité:12;Pugilat:12;Investigation:11',
  'pnj-aseryns-terres-temples-rhenylia-naranos-nysalia-50':'Force Mentale:19;Perception:16;Investigation:15;Constitution:13;Esquive:12;Soin:12;Survie:11;Langages & Argot:10',
  'pnj-aseryns-terres-temples-kalireth-renathe-53':'Diplomatie:17;Perception:16;Investigation:16;Autorité:15;Constitution:13;Esquive:12;Soin:11;Langages & Argot:10',
  'personnages-verite-especes-lombre-pape':'Investigation:19;Survie:18;Perception:18;Constitution:17;Esquive:16;Furtivité:15;Mêlée:14;Pugilat:13',
  'personnages-verite-especes-mloxol-vaagor':'Pugilat:25;Survie:23;Perception:22;Esquive:21;Athlétisme:20;Mêlée:19;Furtivité:18;Savoirs:17',
  'personnages-verite-especes-vhodhalnactru':'Pugilat:24;Perception:22;Esquive:20;Athlétisme:20;Furtivité:18;Mêlée:17;Investigation:16;Savoirs:15',
  'personnages-verite-especes-gajh-shaoggith':'Pugilat:24;Perception:22;Esquive:21;Athlétisme:20;Furtivité:19;Mêlée:18;Investigation:17;Autorité:16',
  'personnages-verite-especes-cthath-vhadhi':'Perception:23;Survie:22;Investigation:21;Esquive:19;Autorité:18;Furtivité:17;Diplomatie:16;Mêlée:15',
  'personnages-verite-especes-ravana':'Constitution:21;Survie:20;Esquive:19;Athlétisme:19;Perception:18;Autorité:18;Savoirs:17;Furtivité:15',
  'personnages-verite-especes-angrboda':'Mêlée:22;Survie:20;Esquive:19;Force Mentale:18;Perception:17;Athlétisme:17;Savoirs:16;Diplomatie:15',
  'personnages-verite-especes-akvan':'Mêlée:21;Esquive:19;Survie:19;Perception:17;Athlétisme:17;Furtivité:16;Savoirs:15;Autorité:14',
  'personnages-verite-chasseurs-mrallgirncllg':'Perception:18;Mêlée:18;Constitution:17;Esquive:16;Athlétisme:15;Furtivité:14;Investigation:13;Pugilat:12',
  'pnj-aseryns-terres-temples-kalurdia-eineris-56':'Autorité:18;Savoirs:18;Perception:17;Diplomatie:16;Investigation:15;Constitution:14;Esquive:13;Furtivité:12',
  'pnj-aseryns-terres-temples-dycardion-57':'Autorité:16;Perception:15;Esquive:15;Constitution:13;Diplomatie:12;Savoirs:11;Athlétisme:11;Investigation:10',
  'pnj-aseryns-terres-temples-taelibatha-58':'Constitution:16;Survie:15;Perception:15;Autorité:14;Esquive:13;Investigation:12;Soin:11;Diplomatie:10',
  'pnj-aseryns-terres-temples-lorieth-59':'Survie:18;Perception:16;Esquive:15;Savoirs:14;Furtivité:13;Investigation:12;Athlétisme:11;Soin:10',
  'pnj-aseryns-terres-temples-edrynae-melemnis-60':'Survie:16;Perception:16;Esquive:15;Mêlée:14;Constitution:12;Savoirs:11;Athlétisme:10;Diplomatie:9',
  'pnj-aseryns-terres-temples-irinaeth-eydreas-62':'Savoirs:15;Perception:14;Diplomatie:14;Constitution:12;Esquive:10;Soin:10;Autorité:9;Furtivité:8',
  'pnj-aseryns-terres-temples-rylias-63':'Constitution:21;Esquive:19;Perception:18;Mêlée:17;Athlétisme:16;Autorité:15;Pugilat:14;Investigation:13',
  'pnj-088-cthulhu':'Pugilat:26;Perception:24;Esquive:22;Athlétisme:21;Autorité:20;Mêlée:19;Furtivité:18;Investigation:17',
  'pnj-fleaux-am-mleeac':'Perception:24;Investigation:23;Survie:22;Esquive:20;Autorité:19;Furtivité:18;Diplomatie:17;Mêlée:16',
  'pnj-091-lidira':'Survie:14;Perception:13;Esquive:13;Mêlée:12;Constitution:11;Investigation:10;Savoirs:9;Diplomatie:8',
  'pnj-fleaux-dagon':'Perception:22;Esquive:21;Force Mentale:20;Athlétisme:19;Autorité:18;Mêlée:17;Furtivité:16;Investigation:15',
  'pnj-fleaux-telipinu':'Survie:23;Perception:21;Esquive:20;Force Mentale:19;Athlétisme:18;Savoirs:17;Furtivité:16;Investigation:15',
  'pnj-fleaux-roi-du-givre':'Perception:20;Force Mentale:19;Esquive:18;Furtivité:17;Athlétisme:16;Mêlée:15;Investigation:14;Savoirs:13',
  'personnages-verite-vampires-p46-adinhazu':'Perception:17;Esquive:16;Savoirs:16;Investigation:15;Pugilat:15;Autorité:14;Furtivité:13;Athlétisme:12',
  'personnages-verite-vampires-p15-ankhsebek':'Constitution:17;Esquive:16;Pugilat:16;Perception:15;Force Mentale:15;Athlétisme:14;Furtivité:13;Investigation:12',
  'personnages-verite-extrals-groupes-elleth-dyx':'Perception:20;Constitution:19;Esquive:19;Autorité:18;Mêlée:18;Athlétisme:17;Investigation:16;Diplomatie:15',
  'personnages-verite-vampires-p07-haimanax':'Constitution:18;Esquive:17;Perception:17;Mêlée:16;Athlétisme:16;Autorité:15;Furtivité:14;Savoirs:13',
  'personnages-verite-humains-galactiques-jol-la-etrys':'Diplomatie:17;Perception:17;Investigation:16;Force Mentale:16;Esquive:15;Constitution:14;Pilotage:13;Savoirs:12',
  'personnages-verite-vampires-p39-kali':'Constitution:21;Survie:20;Esquive:19;Perception:19;Mêlée:18;Savoirs:18;Furtivité:17;Athlétisme:16',
  'personnages-verite-vampires-p48-kragen-aagor':'Esquive:22;Perception:22;Force Mentale:21;Athlétisme:21;Mêlée:20;Autorité:19;Furtivité:18;Savoirs:17',
  'personnages-verite-extrals-groupes-otrax-01':'Perception:15;Esquive:15;Mêlée:14;Athlétisme:14;Force Mentale:13;Autorité:12;Furtivité:11;Pilotage:10',
  'personnages-verite-vampires-p17-shul-alghul-dite-shula':'Soin:22;Perception:21;Constitution:20;Survie:20;Investigation:19;Esquive:18;Diplomatie:17;Pugilat:16',
  'personnages-verite-vampires-p25-trauco':'Furtivité:21;Perception:20;Survie:19;Constitution:18;Athlétisme:18;Savoirs:17;Investigation:16;Mêlée:15',
  'personnages-verite-extrals-groupes-zirine-fa-meonn':'Perception:19;Investigation:19;Esquive:17;Autorité:16;Survie:15;Furtivité:14;Diplomatie:13;Constitution:12'
};
export const STANDALONE_TRUTH_SECONDARY_IDS=Object.keys(secondary);
export function standaloneTruthSecondary(id:string):Array<[string,number]>|undefined {
  const source=secondary[id];
  return source?.split(';').map(part=>{
    const [skill,value]=part.split(':');
    if(!skill||!Number.isInteger(Number(value)))throw new Error(`Rang secondaire invalide : ${id}`);
    return [skill,Number(value)];
  });
}
