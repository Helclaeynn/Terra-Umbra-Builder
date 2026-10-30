#!/usr/bin/env python3
"""Remove reproducible application artifacts; retain active containers and immediate rollbacks."""
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess

ROOT = Path('/opt/terra-umbra')

def run(args):
    return subprocess.check_output(args, text=True, timeout=300).strip()

def images():
    ids = sorted(set(run(['docker', 'image', 'ls', '-aq', '--no-trunc']).split()))
    return json.loads(run(['docker', 'image', 'inspect', *ids])) if ids else []

def containers():
    ids = run(['docker', 'ps', '-aq']).split()
    rows = json.loads(run(['docker', 'inspect', *ids]))
    return {r['Id']: {'image': r['Image'], 'started': r['State']['StartedAt'],
                     'status': r['State']['Status']} for r in rows}, rows

def free():
    s = os.statvfs(ROOT)
    return s.f_bavail * s.f_frsize

assert ROOT.resolve() == ROOT and (ROOT / 'production-active').is_file()
lock = (ROOT / '.production-release.lock').open('a')
fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
before = free()
state, rows = containers()
volumes = run(['docker', 'volume', 'ls', '-q'])
all_images = images()
by_id = {i['Id']: i for i in all_images}
protected = {c['image'] for c in state.values()}
services = {r['Config'].get('Labels', {}).get('com.docker.compose.service'): r
            for r in rows if r['State']['Status'] == 'running'}
assert all(name in services for name in ('api', 'web', 'db', 'caddy'))
# Discover the immediate rollback for each actual running application image.
for service in ('api', 'web'):
    current = by_id[services[service]['Image']]
    revision = (current.get('Config', {}).get('Labels') or {}).get('org.opencontainers.image.revision', '')
    assert re.fullmatch(r'[0-9a-f]{40}', revision), 'Unidentified running application'
    stages = list((ROOT / 'releases').glob('*-' + revision))
    previous = [stage / ('previous-' + service + '-image') for stage in stages
                if (stage / 'deployed.ok').is_file()]
    previous = [p for p in previous if p.is_file() and not p.is_symlink()]
    assert previous, 'Immediate rollback reference missing'
    for p in previous:
        image = p.read_text().strip()
        assert image in by_id, 'Immediate rollback image missing'
        protected.add(image)

candidates = []
for item in all_images:
    tags = item.get('RepoTags') or []
    if item['Id'] in protected or not tags:
        continue
    if all(re.fullmatch(r'tuc-v2-(api|web):[A-Za-z0-9_.-]+', t) and not t.endswith(':latest') for t in tags):
        candidates.append(item)
print(json.dumps({'before_free_bytes': before, 'obsolete_images': len(candidates),
                  'protected_images': len(protected)}), flush=True)
for item in sorted(candidates, key=lambda i: i['Created'], reverse=True):
    current = json.loads(run(['docker', 'image', 'inspect', item['Id']]))[0]
    assert sorted(current.get('RepoTags') or []) == sorted(item['RepoTags'])
    assert item['Id'] not in {c['image'] for c in containers()[0].values()}
    for tag in item['RepoTags']:
        assert json.loads(run(['docker', 'image', 'inspect', tag]))[0]['Id'] == item['Id']
        run(['docker', 'image', 'rm', '--no-prune', tag])
    print(json.dumps({'removed_obsolete_image': item['Id'], 'tags': item['RepoTags']}), flush=True)

archive_bytes = 0
archive_count = 0
for stage in (ROOT / 'releases').iterdir():
    if not stage.is_dir() or stage.is_symlink() or stage.resolve() != stage:
        continue
    manifest = stage / 'SHA256SUMS'
    if not manifest.is_file() or manifest.is_symlink():
        continue
    checksums = {line.split()[-1].lstrip('*'): line.split()[0]
                 for line in manifest.read_text().splitlines() if len(line.split()) == 2}
    for name in ('images.tar.gz', 'apps-source.tar.gz', 'web.tar.gz', 'web-source.tar.gz'):
        path = stage / name
        if not path.is_file() or path.is_symlink() or name not in checksums:
            continue
        st = path.stat()
        assert st.st_nlink == 1
        with path.open('rb') as f:
            digest = hashlib.file_digest(f, 'sha256').hexdigest()
        assert digest == checksums[name], 'Transfer checksum mismatch; retained'
        assert path.stat().st_ino == st.st_ino and path.stat().st_size == st.st_size
        path.unlink()
        archive_bytes += st.st_size
        archive_count += 1
        print(json.dumps({'removed_transfer_archive': str(path), 'bytes': st.st_size}), flush=True)

print(run(['docker', 'builder', 'prune', '--all', '--force', '--keep-storage', '1GB']), flush=True)
assert containers()[0] == state, 'Container state changed'
assert run(['docker', 'volume', 'ls', '-q']) == volumes, 'Volume list changed'
assert protected <= {i['Id'] for i in images()}, 'Protected image missing'
assert json.loads(run(['curl', '-fsS', '--max-time', '20', 'https://terra-umbra.fr/api/ready']))['status'] == 'ready'
after = free()
print(json.dumps({'status': 'success', 'before_free_bytes': before, 'after_free_bytes': after,
                  'freed_bytes': after - before, 'removed_images': len(candidates),
                  'removed_archives': archive_count, 'archive_bytes': archive_bytes,
                  'containers_unchanged': True, 'volumes_unchanged': True}), flush=True)
