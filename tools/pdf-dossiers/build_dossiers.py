"""Reproducible interactive PDFs over the 40 approved, unchanged illustrations."""
from pathlib import Path
import argparse
import os
import hashlib
import json
import shutil
import struct
import zipfile

from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import black, Color, white
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, NumberObject, BooleanObject, DictionaryObject

ROOT = Path(os.environ['TUC_PDF_SOURCE_ROOT']).resolve()
HERE = Path(__file__).resolve().parent
OUT = ROOT / 'output/pdf/dossiers-verite'
TMP = ROOT / 'tmp/pdfs/dossiers-verite'
PUBLIC = Path(os.environ.get('TUC_PDF_PUBLIC_DIR', str(Path(__file__).resolve().parents[2] / 'apps/web/public/pdf/dossiers')))
IMAGES = ROOT / 'outputs/TUC-fiches-verite-selection'
W, H = A4
SLUGS = ['angelus','vampire','mage','daemon','aseryn','garou','khinae','whurten','thulkar','talass','mosen','baseanh','elye','ashyll','azmenorien','rocreen','thalsios','chasseur','homo-superior','adrak']
LABELS = dict(zip(SLUGS, ['Angelus','Vampire','Mage','Daemon','Aseryn','Garou','Descendants de Khinae','Whurten','Thulkar','Talass',"Mo’sen",'Baséanh','Élye','Ashyll','Azménorien','Rocréen','Thalsios','Chasseur','Homo Superior',"Ad’rak"]))
TEXT_CORRECTIONS={
    'vampire-page-1-personnage.png':[(257,601,449,25,266,619,10.2,'+2 Vigueur, +1 Volonté (remplace SR).')],
    'garou-page-1-personnage.png':[(432,658,126,24,435,676,9.4,'+3 Pugilat')],
    'garou-page-2-references.png':[(114,1306,166,20,117,1321,9.0,'+3 Pugilat.')],
    'khinae-page-1-personnage.png':[(653,641,117,22,655,657,8.6,'+3 Pugilat.')],
    'khinae-page-2-references.png':[(518,324,114,20,520,339,8.4,'+3 Pugilat.')],
}

def reality_specs():
    # Reuse only the audited coordinate declarations, not the old PDF writer.
    src = (HERE/'reality-geometry-source.py').read_text(encoding='utf-8')
    ns = {'__name__':'geometry_only'}
    geometry=src[src.index('spec=[[],[]]'):src.index('for printing in [False,True]:')]
    exec(compile(geometry, 'reality-geometry', 'exec'),ns)
    fields = []
    for p, specs in enumerate(ns['spec']):
        for name,x,y,w,h,kind,multi in specs:
            fields.append(dict(name='reality.'+name,label=name.replace('_',' '),type='checkbox' if kind=='check' else 'text',rect=[x,y,w,h],page=p,multiline=multi,fontSize=8 if multi else min(10,h*H/1491*.72)))
    return fields, [ROOT/'outputs/prototype-fiche-1/TUC-realite-page-1-seuil-initiative.png',ROOT/'outputs/prototype-fiche-2/TUC-realite-page-2-cadre-harmonise.png']

def transparent_widgets(writer):
    for page in writer.pages:
        page[NameObject('/Tabs')] = NameObject('/S')
        for ref in page.get('/Annots',[]):
            a=ref.get_object()
            if a.get('/Subtype') != '/Widget': continue
            if '/MK' in a:
                a['/MK'].pop(NameObject('/BG'),None)
                a['/MK'].pop(NameObject('/BC'),None)
            if a.get('/FT')=='/Tx':
                a.pop(NameObject('/MaxLen'),None)
                a['/AP']['/N'].get_object().set_data(b'')
            elif a.get('/FT')=='/Btn':
                a['/AP']['/N']['/Off'].get_object().set_data(b'')
            a[NameObject('/F')]=NumberObject(4)
    if '/AcroForm' in writer.root_object:
        writer.root_object['/AcroForm'][NameObject('/NeedAppearances')]=BooleanObject(False)

def reuse_png_compression(page, image_path):
    # Embed the original PNG's filtered RGB stream verbatim. This is lossless:
    # no resizing, JPEG conversion, colour change or image regeneration.
    data=Path(image_path).read_bytes()
    assert data[:8]==b'\x89PNG\r\n\x1a\n'
    width,height,bits,colour,compression,filtering,interlace=struct.unpack('>IIBBBBB',data[16:29])
    assert (bits,colour,compression,filtering,interlace)==(8,2,0,0,0)
    chunks=[]; offset=8
    while offset<len(data):
        length=struct.unpack_from('>I',data,offset)[0]
        kind=data[offset+4:offset+8]
        if kind==b'IDAT': chunks.append(data[offset+8:offset+8+length])
        offset+=length+12
    images=[ref.get_object() for ref in page['/Resources']['/XObject'].values() if ref.get_object().get('/Subtype')=='/Image']
    assert len(images)==1
    obj=images[0]; obj._data=b''.join(chunks)
    obj[NameObject('/Filter')]=NameObject('/FlateDecode')
    obj[NameObject('/DecodeParms')]=DictionaryObject({NameObject('/Predictor'):NumberObject(15),NameObject('/Colors'):NumberObject(3),NameObject('/BitsPerComponent'):NumberObject(8),NameObject('/Columns'):NumberObject(width)})
    obj.decoded_self=None

def make_pdf(path, imgs, fields, printing, title):
    raw=TMP/('raw-'+path.name)
    c=canvas.Canvas(str(raw),pagesize=A4, pageCompression=1)
    c.setTitle(title)
    c.setAuthor('Terra Umbra California')
    c.setSubject('Formulaire remplissable • identifiants stables v1')
    for p,img in enumerate(imgs):
        iw,ih=Image.open(img).size
        c.saveState()
        if printing: c.setFillAlpha(.85)
        c.drawImage(str(img),0,0,width=W,height=H)
        c.restoreState()
        for x,y,w,h,tx,baseline,size,text in TEXT_CORRECTIONS.get(Path(img).name,[]):
            # User arbitration 2026-09-26: the site's mechanics are canonical.
            # Apply precise PDF text corrections, keeping source art intact.
            sx=W/iw; sy=H/ih
            c.saveState(); c.setFillColor(white)
            c.rect(x*sx,H-(y+h)*sy,w*sx,h*sy,fill=1,stroke=0)
            if printing: c.setFillAlpha(.85)
            c.setFillColor(Color(.16,.025,.22)); c.setFont('Times-Roman',size)
            c.drawString(tx*sx,H-baseline*sy,text)
            c.restoreState()
        for f in fields:
            if f['page'] != p: continue
            x,y,w,h=f['rect']; sx=W/iw; sy=H/ih
            assert x>=0 and y>=0 and w>0 and h>0 and x+w<=iw and y+h<=ih, f
            kw=dict(name=f['name'],tooltip=f['label'],x=x*sx,y=H-(y+h)*sy,borderWidth=0,forceBorder=False,textColor=black)
            if f['type']=='checkbox':
                c.acroForm.checkbox(**kw,size=min(w*sx,h*sy),buttonStyle='check',checked=False)
            else:
                c.acroForm.textfield(**kw,width=w*sx,height=h*sy,fontName='Helvetica',fontSize=f.get('fontSize',8),fieldFlags='multiline' if f.get('multiline') else '',maxlen=0)
        c.showPage()
    c.save()
    wr=PdfWriter(); wr.clone_document_from_reader(PdfReader(raw)); transparent_widgets(wr)
    for page,img in zip(wr.pages,imgs): reuse_png_compression(page,img)
    with path.open('wb') as stream: wr.write(stream)
    verify(path, fields, len(imgs))

def verify(path, specs, page_count):
    r=PdfReader(path); fields=r.get_fields() or {}
    assert len(r.pages)==page_count, path
    wanted={f['name'] for f in specs}
    assert len(wanted)==len(specs), 'Duplicate field names in source specification'
    assert set(fields)==wanted, (path,set(fields)^wanted)
    widget_names=[]
    for p in r.pages:
        for ref in p.get('/Annots',[]):
            a=ref.get_object()
            if a.get('/Subtype')=='/Widget':
                widget_names.append(a.get('/T'))
                assert a.get('/T') in fields and a.get('/AP'), (path,a.get('/T'))
    assert set(widget_names)==wanted and len(widget_names)==len(wanted), path
    return len(fields)

def fill_smoke(path, specs):
    r=PdfReader(path); wr=PdfWriter(); wr.clone_document_from_reader(r)
    vals={}
    for f in specs:
        vals[f['name']]=NameObject('/Yes') if f['type']=='checkbox' else ('Éléonore' if 'name' in f['name'] or f['name']=='reality.nom' else '2')
    wr.update_page_form_field_values(None, vals, auto_regenerate=False)
    test=TMP/('filled-'+path.name)
    with test.open('wb') as stream: wr.write(stream)
    rr=PdfReader(test); ff=rr.get_fields()
    for n,v in vals.items(): assert ff[n].get('/V')==v,(n,ff[n].get('/V'),v)
    for p in rr.pages:
        for ref in p.get('/Annots',[]):
            a=ref.get_object()
            if a.get('/Subtype')!='/Widget': continue
            assert a.get('/V')==vals[a['/T']]
            ap=a['/AP']['/N'].get_object()
            if a.get('/FT')=='/Btn': ap=ap[a['/AS']].get_object()
            assert ap.get_data(), a['/T']
    return test

def build(slugs, package):
    for d in (OUT,TMP,PUBLIC): d.mkdir(parents=True,exist_ok=True)
    nature={}
    for part in ('a','b'):
        p=HERE/f'fields-truth-{part}.json'
        if p.exists(): nature.update(json.loads(p.read_text(encoding='utf-8-sig')))
    reality,real_images=reality_specs()
    manifest={'schemaVersion':1,'revision':'2026-09-26','printOpacity':.85,'corrections':{'vampire':'Révélé : +2 Vigueur, +1 Volonté. Arbitrage utilisateur du 26/09/2026.','garou':'Hybride : +3 aux tests de Pugilat, pas un minimum de 3.','khinae':'Hybride : +3 aux tests de Pugilat, pas un minimum de 3.'},'templates':{},'fields':{'realite':reality}}
    for slug,data in nature.items():
        manifest['fields'][slug]=[dict(f,page=f.get('page',0)+2) for f in data['fields']]
        manifest['templates'][slug]={'label':LABELS[slug],'pages':4,'colour':f'TUC-dossier-{slug}-couleur.pdf','print':f'TUC-dossier-{slug}-impression.pdf'}
    manifest['templates']['realite']={'label':'Réalité','pages':2}
    audits=[]
    for mode in ('couleur','impression'):
        real=OUT/f'TUC-realite-{mode}.pdf'
        make_pdf(real,real_images,reality,mode=='impression','Terra Umbra California - Réalité')
        manifest['templates']['realite']['colour' if mode=='couleur' else 'print']=real.name
        shutil.copy2(real,PUBLIC/real.name)
    fill_smoke(OUT/'TUC-realite-couleur.pdf',reality)
    for slug in slugs:
        data=nature[slug]
        local=[dict(f,page=f.get('page',0)) for f in data['fields']]
        manifest['fields'][slug]=[dict(f,page=f['page']+2) for f in local]
        manifest['templates'][slug]={'label':LABELS[slug],'pages':4}
        imgs=[IMAGES/f'{slug}-page-1-personnage.png',IMAGES/f'{slug}-page-2-references.png']
        for mode in ('couleur','impression'):
            truth=OUT/f'TUC-verite-{slug}-{mode}.pdf'
            make_pdf(truth,imgs,local,mode=='impression',f'Terra Umbra California - Vérité - {LABELS[slug]}')
            dossier=OUT/f'TUC-dossier-{slug}-{mode}.pdf'
            wr=PdfWriter()
            wr.append(OUT/f'TUC-realite-{mode}.pdf',import_outline=False)
            wr.append(truth,import_outline=False)
            wr.add_metadata({'/Title':f'Dossier de Vérité - {LABELS[slug]}','/Author':'Terra Umbra California','/Subject':'Formulaire remplissable - schéma v1'})
            with dossier.open('wb') as stream: wr.write(stream)
            count=verify(dossier,reality+manifest['fields'][slug],4)
            shutil.copy2(dossier,PUBLIC/dossier.name)
            manifest['templates'][slug]['colour' if mode=='couleur' else 'print']=dossier.name
            audits.append({'file':dossier.name,'pages':4,'fields':count,'sha256':hashlib.sha256(dossier.read_bytes()).hexdigest()})
            if mode=='couleur': fill_smoke(dossier,reality+manifest['fields'][slug])
        print(f'{slug}: {len(local)} vérité + {len(reality)} réalité; 4 PDFs created and verified',flush=True)
    for path in (OUT/'manifest.json',PUBLIC/'manifest.json'):
        path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (TMP/'audit.json').write_text(json.dumps(audits,indent=2),encoding='utf-8')
    if package:
        assert set(slugs)==set(SLUGS), 'Do not package an incomplete collection'
        with zipfile.ZipFile(ROOT/'output/pdf/TUC-dossiers-verite-editables.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
            for p in sorted(OUT.glob('*.pdf')):
                folder='Dossiers-4-pages' if p.name.startswith('TUC-dossier-') else 'Fiches-Verite-2-pages' if p.name.startswith('TUC-verite-') else 'Realite-2-pages'
                mode='Impression' if '-impression.' in p.name else 'Couleur'
                archive.write(p,f'{folder}/{mode}/{p.name}')
            archive.write(OUT/'manifest.json','Technique/manifest.json')
            archive.writestr('LIRE-MOI.txt','Terra Umbra California — Dossiers de Vérité\n\n20 dossiers de 4 pages : 2 Réalité + 2 Vérité.\nChaque dossier existe en couleur et en impression éclaircie de 15 %.\nLes fiches de Vérité et de Réalité sont aussi fournies séparément.\nTous les PDF vierges sont remplissables. Les identifiants stables sont préfixés reality. et truth.\nLa page de références ne contient pas de champs personnels.\nLes valeurs de séance restent à renseigner pendant la partie.\nLes humains sans tradition de Chasseur utilisent Réalité seule.\nVampire Révélé : +2 Vigueur, +1 Volonté, conformément au site et à votre arbitrage.\n')
        print('Packaged 82 PDFs.',flush=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--slugs',nargs='*',default=SLUGS); parser.add_argument('--package',action='store_true')
    args=parser.parse_args(); build(args.slugs,args.package)
