# Promotion of the validated V2 installation

This promotes the existing Docker stack, PostgreSQL volume and editor uploads.
It does not import, reset or replace user data, or merge the V2 branch into main.

## DNS prerequisite

In the OVH DNS zone, replace the root A record currently set to 213.186.33.5
with the same IPv4 as the existing dev A record. Replace the www A record with
a CNAME to terra-umbra.fr. If any root/www AAAA record exists, it must point to
the same VPS IPv6 as dev; do not leave an unrelated IPv6 destination.
Do not change MX, SPF, DKIM or DMARC records.

## Preparation and promotion

`v2-production-prepare.yml` installs these scripts and validates a private
PostgreSQL backup by restoring it into a disposable database. It also archives
uploaded editorial media and saves server configuration. No user data backup is
uploaded to GitHub, a public artifact, or the repository. Backups stay under
`/opt/terra-umbra/private-backups`, with directory mode 700 and private files.
This is a local recovery copy, not an off-server disaster recovery service.

After public DNS has converged, execute `bash production/promote.sh` in
`/opt/terra-umbra/infrastructure` through the authorized SSH deployment channel.
The script checks DNS, creates another verified backup, enables the production
lock, updates reset-email links, reloads Caddy and verifies HTTPS/public API
access controls. It preserves both persistent volumes. It rolls configuration
back on failure, without rolling back or deleting user data.

The production lock makes `v2-dev.yml` skip deployment and live test-account
creation on subsequent dev pushes. CI checks continue. Before resuming dev
hosting, provision a separate stack/database; do not run dev against production.
Future production releases require a reviewed, explicitly triggered deployment.

Users need to sign in again on the new hostname with the same account/password.
Server-saved characters, campaigns, editorial changes, favorites and visibility
settings remain in the same database. Save pending browser edits before cutover.
V1 local-browser characters and browser-only drafts do not migrate across origins;
export/import them explicitly if needed.
