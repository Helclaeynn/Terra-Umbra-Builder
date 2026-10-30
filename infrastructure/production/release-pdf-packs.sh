#!/usr/bin/env bash
set -euo pipefail
umask 077
sha=${1:?Release SHA required}
run=${2:?Workflow run required}
attempt=${3:?Workflow attempt required}
[[ "$sha" =~ ^[0-9a-f]{40}$ && "$run" =~ ^[0-9]+$ && "$attempt" =~ ^[0-9]+$ ]]
root=/opt/terra-umbra
stage="$root/releases/pdf-packs-$sha-$run-$attempt"
export STAGE="$stage" RELEASE_SHA="$sha"
test -f "$root/production-active"
test -f "$stage/web-pdf-packs.tar.gz"
exec 9>"$root/.production-release.lock"
flock -w 60 9
cd "$stage"
sha256sum --check SHA256SUMS
python3 - <<'PY'
import json, os, pathlib, shutil, tarfile
stage = pathlib.Path(os.environ['STAGE'])
with tarfile.open(stage / 'web-pdf-packs.tar.gz') as archive:
    members = archive.getmembers()
    names = [member.name for member in members]
    assert len(names) == len(set(names)), 'Duplicate payload paths'
    for member in members:
        path = pathlib.PurePosixPath(member.name)
        assert member.isfile() and not path.is_absolute() and '..' not in path.parts
        assert member.name == 'release.json' or member.name.startswith('html/')
    record = json.load(archive.extractfile('release.json'))
    assert record['sha'] == os.environ['RELEASE_SHA']
    assert record['baseline'] == '7d3873411f5c1594f806bcd78bc629f1c818f577'
    assert shutil.disk_usage(stage).free >= record['bytes'] * 3 + 536870912, 'Insufficient release/rollback storage'
    for member in members:
        target = stage / member.name
        target.parent.mkdir(parents=True, exist_ok=True)
        with archive.extractfile(member) as source, target.open('wb') as destination:
            shutil.copyfileobj(source, destination)
PY
python3 - <<'PY'
import hashlib, json, os, pathlib, urllib.request
stage = pathlib.Path(os.environ['STAGE'])
record = json.loads((stage / 'release.json').read_text())
assert {path.relative_to(stage / 'html').as_posix() for path in (stage / 'html').rglob('*') if path.is_file()} == set(record['files'])
for name, digest in record['files'].items():
    assert hashlib.sha256((stage / 'html' / name).read_bytes()).hexdigest() == digest, name
for path, digest in record['publicBaseline'].items():
    with urllib.request.urlopen('https://terra-umbra.fr' + path, timeout=30) as response:
        assert hashlib.sha256(response.read()).hexdigest() == digest, 'Production changed since review: ' + path
print('Exact tested artifact and current public production baseline verified')
PY
cd "$root/infrastructure"
api=$(docker compose ps -q api)
web=$(docker compose ps -q web)
test -n "$api" && test -n "$web"
previous_api=$(docker inspect --format '{{.Image}}' "$api")
previous_web=$(docker inspect --format '{{.Image}}' "$web")
web_tag=$(docker inspect --format '{{.Config.Image}}' "$web")
test -n "$web_tag"
printf '%s\n' "$previous_api" > "$stage/previous-api-image"
printf '%s\n' "$api" > "$stage/previous-api-container"
printf '%s\n' "$previous_web" > "$stage/previous-web-image"
printf '%s\n' "$web_tag" > "$stage/previous-web-tag"
docker inspect --format '{{json .Config.Labels}}' "$web" > "$stage/previous-web-labels.json"
curl --fail --silent --show-error --max-time 30 https://terra-umbra.fr/api/compendium/meta > "$stage/previous-meta.json"
docker cp "$web:/usr/share/nginx/html/index.html" "$stage/previous-index.html"
python3 - <<'PY'
import hashlib, json, os, pathlib
stage = pathlib.Path(os.environ['STAGE'])
expected = json.loads((stage / 'release.json').read_text())['publicBaseline']['/']
assert hashlib.sha256((stage / 'previous-index.html').read_bytes()).hexdigest() == expected, 'Container and public baseline differ'
PY
tar --exclude='node_modules' --exclude='dist' --exclude='*.log' -C "$root" -czf "$stage/previous-web-source.tar.gz" apps/web
tar -tzf "$stage/previous-web-source.tar.gz" >/dev/null
bash production/backup.sh </dev/null
base="tuc-v2-web:before-pdf-packs-$sha-$run-$attempt"
candidate="tuc-v2-web:pdf-packs-$sha-$run-$attempt"
docker tag "$previous_web" "$base"
cat > "$stage/Dockerfile" <<'DOCKER'
ARG BASE
FROM ${BASE}
COPY --chmod=755 html/ /usr/share/nginx/html/
DOCKER
printf '*\n!Dockerfile\n!html/\n!html/**\n' > "$stage/.dockerignore"
docker build --pull=false --build-arg "BASE=$base" --label "org.opencontainers.image.revision=$sha" --label "fr.terra-umbra.release=compact-pdf-packs" -t "$candidate" "$stage" </dev/null
docker run --rm --network none --entrypoint nginx "$candidate" -t </dev/null
switched=false
rollback() {
  status=$?
  trap - EXIT HUP INT TERM
  if [ "$status" -ne 0 ] && [ "$switched" = true ]; then
    echo 'PDF PACKS RELEASE FAILED — restoring only the previous web image' >&2
    if docker tag "$previous_web" "$web_tag" && docker compose up -d --no-build --no-deps --force-recreate web </dev/null; then
      restored=false
      for retry in $(seq 1 12); do
        if curl --fail --silent --max-time 5 https://terra-umbra.fr/ | cmp -s - "$stage/previous-index.html"; then restored=true; break; fi
        sleep 2
      done
      if [ "$restored" = true ]; then
        echo 'Previous public web index restored' >&2
      else
        echo 'URGENT: previous image restored but public rollback health is unconfirmed' >&2
      fi
    else
      echo 'URGENT: automatic web rollback could not recreate the previous container' >&2
    fi
  fi
  exit "$status"
}
trap rollback EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM
test "$(docker compose ps -q api)" = "$api"
test "$(docker inspect --format '{{.Image}}' "$api")" = "$previous_api"
test "$(docker inspect --format '{{.Image}}' "$(docker compose ps -q web)")" = "$previous_web"
switched=true
docker tag "$candidate" "$web_tag"
docker compose up -d --no-build --no-deps --force-recreate web </dev/null
test "$(docker compose ps -q api)" = "$api"
test "$(docker inspect --format '{{.Image}}' "$api")" = "$previous_api"
test "$(docker inspect --format '{{.Image}}' "$(docker compose ps -q web)")" = "$(docker image inspect --format '{{.Id}}' "$candidate")"
python3 - <<'PY'
import hashlib, json, os, pathlib, time, urllib.error, urllib.request
stage = pathlib.Path(os.environ['STAGE'])
record = json.loads((stage / 'release.json').read_text())
base = 'https://terra-umbra.fr'
def get(path):
    with urllib.request.urlopen(base + path, timeout=45) as response:
        return response.read()
for retry in range(24):
    try:
        assert hashlib.sha256(get('/')).hexdigest() == record['files']['index.html']
        assert json.loads(get('/api/health'))['status'] == 'ok'
        break
    except (AssertionError, urllib.error.URLError, TimeoutError):
        time.sleep(3)
else:
    raise AssertionError('New public index/API health unavailable')
for name, digest in record['files'].items():
    assert hashlib.sha256(get('/' + name)).hexdigest() == digest, 'Public artifact differs: ' + name
manifest = json.loads(get('/pdf/dossiers/manifest.json'))
assert manifest['schemaVersion'] == 2 and len(manifest['templates']) == 21
for slug, template in manifest['templates'].items():
    assert template['pages'] == (2 if slug == 'realite' else 8)
    areas = {area['layer']: area for area in template['portraitAreas']}
    assert areas['reality']['page'] == 0
    assert areas['reality']['rect'] == {'x': 33.85453595551741, 'y': 637.487285920246, 'width': 86.3290666865694, 'height': 98.81335255628261}
    if slug != 'realite':
        assert set(areas) == {'reality', 'truth'}
        assert areas['truth']['page'] == 2
        assert areas['truth']['rect'] == {'x': 414, 'y': 541, 'width': 137, 'height': 136}
for route in ['/characters/11111111-1111-4111-8111-111111111111/sheet', '/builder']:
    assert hashlib.sha256(get(route)).hexdigest() == record['files']['index.html']
for route in ['/api/characters/11111111-1111-4111-8111-111111111111/sheet', '/api/campaigns/11111111-1111-4111-8111-111111111111/play']:
    try:
        get(route)
        raise AssertionError('Private API route exposed')
    except urllib.error.HTTPError as error:
        assert error.code == 401, (route, error.code)
before = json.loads((stage / 'previous-meta.json').read_text())
after = json.loads(get('/api/compendium/meta'))
assert all(before[key] == after[key] for key in ['total', 'categories', 'databaseEdits'])
print('PUBLIC HTTPS VERIFIED — exact tested bundles/22 PDFs, schema 2, separate portraits, private routes and unchanged Compendium')
PY
test "$(docker compose ps -q api)" = "$api"
test "$(docker inspect --format '{{.Image}}' "$api")" = "$previous_api"
printf '%s\n' "$sha" > "$root/.production-pdf-packs-sha"
printf '%s\n' "$sha" > "$stage/deployed.ok"
trap - EXIT HUP INT TERM
echo "PDF PACKS WEB-ONLY RELEASE VERIFIED — $sha; API/data and server sources retained"
