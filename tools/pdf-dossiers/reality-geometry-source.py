from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import black
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, NumberObject, DecodedStreamObject
import pypdfium2 as pdfium
ROOT=Path.cwd(); OUT=ROOT/'output/pdf'; OUT.mkdir(parents=True,exist_ok=True)
TMP=ROOT/'tmp/pdfs'; TMP.mkdir(parents=True,exist_ok=True)
imgs=[ROOT/'outputs/prototype-fiche-1/TUC-realite-page-1-seuil-initiative.png',ROOT/'outputs/prototype-fiche-2/TUC-realite-page-2-cadre-harmonise.png']
W,H=A4; sx=W/1055; sy=H/1491
spec=[[],[]]
def f(p,n,x,y,w,h,m=False):spec[p].append((n,x,y,w,h,'text',m))
def ck(p,n,x,y,s=16):spec[p].append((n,x,y,s,s,'check',False))
for n,x,y,w,h in [('nom',356,188,435,24),('joueur',356,224,435,24),('concept',356,260,435,24),('origine',356,297,177,26),('sphere',356,335,177,23),('style',660,298,131,24),('langue_native',660,335,131,23)]:f(0,n,x,y,w,h)
attrs=['vigueur','agilite','esprit','volonte','charisme']
skills=[['athletisme','pugilat','humanite','melee','constitution'],['tir','pilotage','furtivite','esquive','larcin'],['mecanique','langages_argot','savoirs','soin','investigation'],['neurodrive','perception','maitrise_spirituelle','survie','force_mentale'],['seduction','diplomatie','commerce','representation','autorite']]
for i,a in enumerate(attrs):
 f(0,a,115+i*195,510,37,29)
 for j,n in enumerate(skills[i]):f(0,n,62+i*194,581+j*47,17,17)
for n,x,y,w,h in [('pv_actuels',150,888,99,23),('pv_max',355,888,83,23),('seuil_mort',579,888,120,23),('defense_physique',187,953,74,23),('defense_occulte',401,953,80,23),('deplacement',604,953,94,23),('seuil_augmentique',194,1019,47,21),('initiative',375,1019,62,21),('attaque_melee',161,1133,48,24),('attaque_pugilat',301,1133,80,24),('attaque_tir',457,1133,73,24),('attaque_neurodrive',639,1133,61,24),('armure_protection',738,1156,251,63),('argent',840,1245,149,20),('train_de_vie',840,1279,149,23)]:f(0,n,x,y,w,h,n=='armure_protection')
for j in range(9):ck(0,'edge_'+str(j),747+j*28,901,14)
for j,n in enumerate(['normal','tendu','panique']):ck(0,'stress_'+n,852+j*56,951,15)
for n,x in [('agonisant',827),('stabilise',936)]:ck(0,'sante_'+n,x,1016,15)
for j in range(5):ck(0,'pa_'+str(j+1),560+j*30,1032,18)
for j in range(6):ck(0,'renommee_'+str(j),827+j*28.5,1342,14)
for j in range(5):
 for n,x,w in [('arme',59,170),('degats',236,75),('portee',318,81),('proprietes_munitions',406,294)]:f(0,f'arme_{j+1}_{n}',x,1221+j*29,w,23)
for n,x,y,w,h in [('talent_origine',52,204,564,21),('talent_commun',655,204,347,21),('talents_sphere',52,266,292,103),('talents_expertise',372,266,255,103),('autres_talents',655,266,346,103),('habitation',175,459,319,20),('planque_refuge',175,500,319,20),('vehicule',175,541,319,20),('autres_biens_abonnements',52,611,441,117),('desavantages',560,476,441,42),('xp_disponibles',685,557,104,21),('xp_depenses',832,557,104,21),('ptv_disponibles',685,592,104,18),('ptv_depenses',832,592,104,18),('charge_totale',168,947,75,18),('integrite',384,947,76,18),('stress_aug_base',749,949,38,21),('stress_aug_temp',858,949,39,21),('stress_aug_total',959,949,42,21),('rang_neuro',113,1049,42,15),('programmes_charges',370,1049,38,15),('capacite_programmes',448,1049,38,15),('alterations_sequelles',557,1054,443,130),('contacts',54,1274,454,25),('reseaux',547,1274,454,25),('statuts_habilitations',54,1330,454,24),('langues',547,1330,454,24),('milieu_reputation',54,1382,947,19)]:f(1,n,x,y,w,h,h>30)
for j in range(5):
 for n,x,w in [('nom',53,265),('generation',325,78),('charge',411,109),('stress',530,114),('notes',654,346)]:f(1,f'augmentation_{j+1}_{n}',x,834+j*20.3,w,16)
 for n,x,w in [('programme',53,148),('effet',289,207)]:f(1,f'neuro_{j+1}_{n}',x,1099+j*19,w,15)
 ck(1,f'neuro_{j+1}_charge',238,1101+j*19,12)
for printing in [False,True]:
 name='TUC-fiche-realite-impression-remplissable.pdf' if printing else 'TUC-fiche-realite-couleur-remplissable.pdf'
 raw=TMP/('raw-'+name);c=canvas.Canvas(str(raw),pagesize=A4)
 c.setTitle('Terra Umbra California - Réalité - '+('Impression' if printing else 'Couleur'))
 for p,img in enumerate(imgs):
  c.saveState()
  if printing:c.setFillAlpha(.60)
  c.drawImage(str(img),0,0,width=W,height=H)
  c.restoreState()
  for n,x,y,w,h,kind,m in spec[p]:
   kw=dict(name=n,tooltip=n.replace('_',' '),x=x*sx,y=H-(y+h)*sy,width=w*sx,height=h*sy,borderWidth=0,forceBorder=False)
   if kind=='text':c.acroForm.textfield(**kw,fontName='Helvetica',fontSize=8 if m else min(10,h*sy*.72),textColor=black,fieldFlags='multiline' if m else '',maxlen=2000 if m else 150)
   else:
    kw.pop('width');kw.pop('height');c.acroForm.checkbox(**kw,size=w*sx,buttonStyle='check',checked=False,textColor=black)
  c.showPage()
 c.save()
 r=PdfReader(raw);wr=PdfWriter();wr.clone_document_from_reader(r)
 for page in wr.pages:
  for ref in page['/Annots']:
   a=ref.get_object();mk=a.get('/MK')
   if mk:
    mk.pop(NameObject('/BG'),None);mk.pop(NameObject('/BC'),None)
   # Blank transparent appearance preserves the illustrated field underneath.
   if a.get('/FT')=='/Tx':
    ap=a['/AP']['/N'].get_object();ap.set_data(b'')
   else:
    ap=a['/AP']['/N']['/Off'].get_object();ap.set_data(b'')
   a[NameObject('/F')]=NumberObject(4)
 with open(OUT/name,'wb') as o:wr.write(o)
 rr=PdfReader(OUT/name);assert len(rr.pages)==2
 fields=rr.get_fields();assert len(fields)==sum(map(len,spec))
 widgets=[a.get_object() for p in rr.pages for a in p['/Annots']];assert len(widgets)==len(fields)
 assert all(a['/T'] in fields for a in widgets)
 doc=pdfium.PdfDocument(str(OUT/name))
 for p in range(2):doc[p].render(scale=1.4).to_pil().save(TMP/f'{"print" if printing else "color"}-{p+1}.png')
 # Fill representative single/multiline/numeric fields, then reopen and verify values.
 test=PdfWriter();test.clone_document_from_reader(rr)
 vals={'nom':'Alex Morgan','vigueur':'4','xp_disponibles':'12','talents_sphere':'Premier talent\nSecond talent','argent':'1 250','neuro_1_programme':'Analyse'}
 test.update_page_form_field_values(None,vals,auto_regenerate=False)
 testfile=TMP/('test-'+name)
 with open(testfile,'wb') as o:test.write(o)
 tr=PdfReader(testfile)
 for k,v in vals.items():assert tr.get_fields()[k]['/V']==v
 for page in tr.pages:
  for ref in page['/Annots']:
   a=ref.get_object()
   if a.get('/T') in vals:assert a['/V']==vals[a['/T']] and a['/AP']['/N'].get_object().get_data()
 td=pdfium.PdfDocument(str(testfile));td[0].render(scale=1.4).to_pil().save(TMP/f'test-{printing}.png')
 print(name,len(fields),'champs, vérifications OK')
