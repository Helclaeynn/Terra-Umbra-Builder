"""Build the classification supplement without modifying the 263 V16 source entries."""
from pathlib import Path
import base64,gzip,json,hashlib
root=Path(__file__).resolve().parent
d=root/'data'
oldprefix='v3-bestiaire-v16-enriched-263'
raw=''.join((d/f'{oldprefix}-{i:02}.b64part').read_text().strip() for i in range(30))
base=json.loads(gzip.decompress(base64.b64decode(raw)))
assert len(base)==263
supp=json.loads((root/'source/bestiary-classification-additions-v17.json').read_text(encoding='utf8'))
def block(text,style='list'):return {'type':'p','style':style,'text':text}
added=[]
for e in supp['items']:
 key=e['key']; ident='bestiaire-v17-'+key
 chapter='2.2 Ombres et entités de l’Ombremonde' if e['family'] in ['Deimons','Voyageurs'] else '2.3 Fées et esprits naturels'
 m,pa,init,per,mas,dp,do,pv,arm=e['stats']
 role='VÉRITÉ • '+e['family'].upper()+' • '+e['role']
 lines=[block('CLASSIFICATION — '+chapter+' › '+e['family'],'spec'),block('RÔLE — '+role,'spec'),block(f'MOUVEMENT {m} m • ACTIONS {pa} PA • INITIATIVE 1d10e + {init}','spec'),block(f'PERCEPTION 1d10e + {per} • MAÎTRISE 1d10e + {mas}','spec'),block(f'DÉF. PHYSIQUE {dp} (+1d10e active) • DÉF. OCCULTE {do} (+1d10e active) • PV {pv} • ARMURE {arm}','spec')]
 lines += [block('ATTAQUE — '+a) for a in e['attacks']]
 lines += [block('CAPACITÉ / INFO MJ — '+a) for a in e['abilities']]
 lines += [block('FAIBLESSE / LIMITE — '+a) for a in e['weaknesses']]
 lines += [block('HOOK MJ — '+e['hook'],'callout')]
 added.append({'id':ident,'title':e['title'],'category':'Bestiaire','source':'Classification des créatures de Terra Umbra — complément V17','status':'canon_enrichi','audience':'player','tags':[chapter,e['family'],'VÉRITÉ',e['role'],*e['aliases']],'aliases':e['aliases'],'illustration':{'src':'images/manual/'+ident+'.webp','alt':e['title']+' — illustration Terra Umbra','caption':'Vue de Vérité, au-delà de l’Hologramme.'},'bestiary':{'chapter':chapter,'family':e['family'],'subfamily':'','role':role,'hook':e['hook']},'sections':[{'id':'description','title':'Description','level':2,'blocks':[block(t,'lore') for t in e['description']]},{'id':'dossier-mj','title':'Dossier MJ · Profil, hook & informations','level':2,'audience':'mj','blocks':lines}]})
rows=base+added
assert len(rows)==281 and len({a['id'] for a in rows})==281
packed=base64.b64encode(gzip.compress(json.dumps(rows,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode()
prefix='v3-bestiaire-v17-classification-281';chunks=[packed[i:i+6000] for i in range(0,len(packed),6000)]
for i,c in enumerate(chunks):(d/f'{prefix}-{i:02}.b64part').write_text(c+'\n',encoding='ascii')
manifest=json.loads((d/'manifest-v3.json').read_text(encoding='utf8'))
s=next(s for s in manifest['datasets'] if s['id']=='bestiaire');s.update(prefix=prefix,parts=len(chunks),count=len(rows),sha256=hashlib.sha256(packed.encode()).hexdigest())
(d/'manifest-v3.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'Bestiaire V17: {len(base)} preserved + {len(added)} additions = {len(rows)} entries, {len(chunks)} parts')
