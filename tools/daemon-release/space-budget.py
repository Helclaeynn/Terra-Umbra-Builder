# Read-only space budget for an immutable, already-tested release.
import json
import os
import pathlib
import subprocess
import sys

meta = json.loads(pathlib.Path(sys.argv[1]).read_text())
MiB = 1024**2
GiB = 1024**3

def command(args, cwd=None):
    return subprocess.check_output(args, text=True, cwd=cwd).strip()

image_ids = sorted(set(command(['docker', 'image', 'ls', '--quiet', '--no-trunc']).split()))
present = set()
for start in range(0, len(image_ids), 50):
    for image in json.loads(command(['docker', 'image', 'inspect', *image_ids[start:start+50]])):
        present.update(image.get('RootFS', {}).get('Layers', []))
missing = sum(size for digest, size in meta['layers'].items() if digest not in present)
root = '/opt/terra-umbra'
infra = root + '/infrastructure'

def used(service, path):
    # Only allocated byte counts; no private database rows or credentials.
    output = command(['docker', 'compose', 'exec', '-T', service, 'du', '-sk', path], cwd=infra)
    return int(output.split()[0]) * 1024

db = used('db', '/var/lib/postgresql/data')
media = used('api', '/app/editor-media')
parts = {
    'transfer_archives': meta['transfer'],
    'docker_load_temporary': meta['image_temporary'],
    'new_layers_uncompressed': missing,
    'new_source_allocated': meta['source_allocated'],
    'backup_and_restore_upper_bound': 3*db + 2*media + 64*MiB,
    'metadata_and_allocation_margin': 256*MiB,
    'remaining_free_reserve': GiB,
}
required = sum(parts.values())
stat = os.statvfs(root)
free = stat.f_bavail * stat.f_frsize
print(json.dumps({'available_bytes': free, 'required_bytes': required, 'parts': parts,
                  'measured_release': meta['source']}, indent=2), flush=True)
if free < required:
    raise SystemExit('Measured release does not fit safely; no application/data has been changed.')
print('MEASURED SPACE BUDGET OK — temporary extraction, missing layers, backup verification and 1 GiB reserve covered; nothing deleted.')
