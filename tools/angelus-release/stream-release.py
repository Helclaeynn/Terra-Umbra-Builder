"""Verified streaming transport for an already-tested Angelus release.

No archives are stored on the VPS; image loading, source extraction and backup
verification happen in sequence. No running container, image, volume or backup
is deleted. The same 256 MiB allocation margin and 1 GiB free reserve are kept.
"""
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path('/opt/terra-umbra')
MIB, GIB = 1024**2, 1024**3

def command(args, cwd=None):
    return subprocess.check_output(args, cwd=cwd, text=True).strip()

def space_requirement(meta, missing, backup, phase):
    if phase == 'check':
        peak = max(meta['image_temporary'] + missing,
                   missing + meta['source_allocated'] + backup)
    elif phase == 'images':
        peak = meta['image_temporary'] + missing
    elif phase == 'source':
        peak = meta['source_allocated'] + backup
    else:
        peak = backup
    return peak + 256*MIB + GIB

def preflight(meta, phase):
    images = sorted(set(command(['docker','image','ls','--quiet','--no-trunc']).split()))
    present = set()
    for start in range(0, len(images), 50):
        for image in json.loads(command(['docker','image','inspect',*images[start:start+50]])):
            present.update(image.get('RootFS',{}).get('Layers',[]))
    missing = sum(size for digest,size in meta['layers'].items() if digest not in present)
    def used(service, path):
        return int(command(['docker','compose','exec','-T',service,'du','-sk',path],ROOT/'infrastructure').split()[0])*1024
    backup = 3*used('db','/var/lib/postgresql/data')+2*used('api','/app/editor-media')+64*MIB
    required = space_requirement(meta, missing, backup, phase)
    fs = os.statvfs(ROOT)
    available = fs.f_bavail*fs.f_frsize
    print(json.dumps({'phase':phase,'available_bytes':available,'required_bytes':required,
          'missing_layers':missing,'backup_bound':backup,'stored_transfer_archives':0,
          'allocation_margin':256*MIB,'free_reserve':GIB,'source':meta['source']}),flush=True)
    if available < required:
        raise RuntimeError('Insufficient space for this phase; no running application changed.')

def receive(stream, args, expected, cwd=None):
    digest, count = hashlib.sha256(), 0
    proc = subprocess.Popen(args, stdin=subprocess.PIPE, cwd=cwd)
    try:
        while True:
            block = stream.read(1024*1024)
            if not block:
                break
            count += len(block)
            if count > expected['size']:
                raise RuntimeError('Stream longer than verified artifact')
            digest.update(block)
            proc.stdin.write(block)
        proc.stdin.close()
        code = proc.wait(timeout=300)
        if code or count != expected['size'] or digest.hexdigest() != expected['sha256']:
            raise RuntimeError('Artifact stream validation failed; it must not be deployed')
    finally:
        if proc.poll() is None:
            proc.kill()
            proc.wait()
    return {'size':count,'sha256':digest.hexdigest()}

def verify_images(meta):
    for image in meta['images']:
        actual = json.loads(command(['docker','image','inspect',image['tag']]))[0]
        assert actual['Id'] == image['id'], 'Loaded image is not the tested artifact image'
        assert actual['Config']['Labels']['org.opencontainers.image.revision'] == meta['source']

def verify_source(stage, meta):
    for name, digest in meta['source_files'].items():
        path = stage/'new'/name
        assert path.is_file() and not path.is_symlink(), 'Missing regular source file: '+name
        assert hashlib.sha256(path.read_bytes()).hexdigest() == digest, 'Changed extracted source: '+name

def main():
    mode, raw_stage = sys.argv[1:]
    assert mode in ('check','images','source','deploy')
    stage = Path(raw_stage)
    meta = json.loads((stage/'space-budget.json').read_text())
    sha = meta['source']
    assert re.fullmatch('[0-9a-f]{40}',sha)
    assert stage == ROOT/'releases'/('angelus-'+sha) and stage.resolve() == stage
    assert (ROOT/'production-active').is_file()
    assert not (stage/'deployed.ok').exists(), 'Already deployed; no reapplication'
    with (ROOT/'.production-release.lock').open('a') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        preflight(meta, mode)
        if mode == 'check':
            assert not (stage/'new').exists(), 'Staging source already present'
            print('STREAM BUDGET OK — sequential peak measured, margins unchanged, nothing deleted.',flush=True)
            return
        if mode in ('images','source'):
            expected = meta['archives'][mode]
            receipt = stage/(mode+'.stream-verified.json')
            assert not receipt.exists(), 'This stream was already received'
            if mode == 'images':
                args = ['docker','load']
            else:
                verify_images(meta)
                # Paths and file types were checked on the runner before sending.
                (stage/'new').mkdir(mode=0o700)
                args = ['tar','-xz','--no-same-owner','--no-same-permissions','-C',str(stage/'new')]
            got = receive(sys.stdin.buffer,args,expected)
            if mode == 'images':
                verify_images(meta)
            else:
                verify_source(stage,meta)
            receipt.write_text(json.dumps(got))
            print(mode.upper()+' STREAM VERIFIED — exact tested bytes; no transfer archive saved.',flush=True)
            return
        for kind in ('images','source'):
            assert json.loads((stage/(kind+'.stream-verified.json')).read_text()) == meta['archives'][kind]
        verify_images(meta)
        verify_source(stage,meta)
        original = (stage/'tested-release.sh').read_bytes()
        assert hashlib.sha256(original).hexdigest() == meta['release_script_sha256']
        text = original.decode()
        lock_block = 'exec 9>"$root/.production-release.lock"\nflock -n 9 || { echo \'Another release is running.\' >&2; exit 1; }'
        assert text.count(lock_block) == 1
        text = text.replace(lock_block,'# The streaming supervisor holds the same exclusive release lock.')
        begin = '(cd "$stage" && sha256sum --check SHA256SUMS)'
        end = 'docker load --input "$stage/images.tar.gz"'
        assert text.count(begin) == 1 and text.count(end) == 1
        start = text.index(begin)
        finish = text.index(end,start)+len(end)
        # Only repeat-transfer operations are replaced. The verified backup,
        # atomic application switch, readiness checks and rollback are unchanged.
        text = text[:start]+'# Exact image IDs, extracted file hashes and stream receipts verified by supervisor.\n'+text[finish:]
        target = stage/'streamed-release.sh'
        target.write_text(text)
        subprocess.run(['bash',str(target),sha],check=True)

if __name__ == '__main__':
    main()
