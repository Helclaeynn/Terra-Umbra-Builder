import json,pathlib,tarfile
root=pathlib.Path('.')
def gameplay(path):
 p=path.relative_to('apps/api/src').as_posix()
 return p.startswith(('rules/', 'campaign', 'character', 'canonical-npc', 'npc-', 'live-effect'))
source=[p for p in pathlib.Path('apps/api/src').rglob('*.ts') if gameplay(p)]
runtime=[pathlib.Path(str(p).replace('/src/','/dist/')).with_suffix('.js') for p in source]
assert all(p.is_file() for p in runtime)
assert all(not p.name.startswith('compendium') for p in runtime)
manifest=[str(p) for p in source]+[str(p) for p in pathlib.Path('apps/web/src').rglob('*') if p.is_file()]
pathlib.Path('payload-files.json').write_text(json.dumps(manifest))
with tarfile.open('/tmp/live-table-release.tar.gz','w:gz') as t:
 for p in source+runtime: t.add(p,arcname=str(p))
 for p in ['apps/api/package.json','apps/web/dist','apps/web/src','infrastructure/migrations/20261009_combat_roster.sql','infrastructure/production/check-live-release.mjs','payload-files.json']:t.add(p,arcname=p)
print(f'Packaged {len(runtime)} gameplay modules, web build and combat roster migration; production Compendium modules retained')
