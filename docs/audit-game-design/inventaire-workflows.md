# Inventaire des workflows GitHub Actions (31/10)

77 workflows. Objectif (relecture technique, étape 0) : n'en garder que trois — **CI**, **déploiement** (reconstruit depuis Git) et **sauvegarde** si elle passe un jour par Actions. Les autres sont archivés dans `.github/workflows-archive/` (GitHub ne les exécute plus) : l'historique reste consultable.

**Pourquoi d'abord** : la plupart se déclenchent quand on pousse une modification de leur propre fichier ; formater ou fusionner sans les archiver lancerait des opérations sur le serveur. Un fichier **déplacé hors de `.github/workflows/`** n'est plus exécuté : l'archivage par déplacement est sans danger, contrairement à une modification.

## À garder

| Workflow | Rôle | Suite |
|---|---|---|
| `v2-dev.yml` | CI complète (API, corpus, droits, front, PDF, navigateur) et déploiement dev, sauté tant que la production est verrouillée | Scinder en `ci.yml` (contrôles) et `deploy.yml` (déploiement depuis Git, déclenché à la main) |

## À archiver : interventions sur le serveur (53)

Releases ciblées, reprises, diagnostics et incidents passés. Chacun a déjà servi une fois ; aucun ne doit tourner de nouveau tel quel.

`dev-resource-diagnostics.yml`, `v2-armor-release-diagnostics.yml`, `v2-production-aidh-catalogue.yml`, `v2-production-angelus-stream-release.yml`, `v2-production-angelus-talents.yml`, `v2-production-approved-pnj-merges.yml`, `v2-production-armor-properties.yml`, `v2-production-armor-resume.yml`, `v2-production-aseryn-talents-retry.yml`, `v2-production-aseryn-talents.yml`, `v2-production-atlas.yml`, `v2-production-bestiary-portrait-storage.yml`, `v2-production-bestiary.yml`, `v2-production-campaign-live.yml`, `v2-production-campaign-rewards-retry.yml`, `v2-production-campaign-rewards.yml`, `v2-production-campaign-source-revision-release.yml`, `v2-production-character-evolution.yml`, `v2-production-combat-initiative.yml`, `v2-production-compact-talents.yml`, `v2-production-compendium-biography-recovery.yml`, `v2-production-compendium-incident-recovery.yml`, `v2-production-compendium-incident.yml`, `v2-production-cutover.yml`, `v2-production-daemon-release-retry.yml`, `v2-production-daemon-talents.yml`, `v2-production-disk-recovery.yml`, `v2-production-exile-talents.yml`, `v2-production-extral-retry.yml`, `v2-production-extral-talents.yml`, `v2-production-http3-isolation.yml`, `v2-production-hunter-builder.yml`, `v2-production-incident-diagnostics.yml`, `v2-production-khinae-builder.yml`, `v2-production-live-table-release.yml`, `v2-production-mage-talents.yml`, `v2-production-pdf-packs-release.yml`, `v2-production-playtest-finalize.yml`, `v2-production-playtest-release.yml`, `v2-production-portrait-cache-release.yml`, `v2-production-portrait-deletion-release.yml`, `v2-production-portrait-instant-invitations-release.yml`, `v2-production-portrait-release.yml`, `v2-production-portrait-responsiveness-release.yml`, `v2-production-preflight.yml`, `v2-production-prepare.yml`, `v2-production-reality-talents-release.yml`, `v2-production-reality-talents-retry.yml`, `v2-production-rollback-midday.yml`, `v2-production-storage-cleanup.yml`, `v2-production-truth-storage-retry.yml`, `v2-production-vampire-builder.yml`, `v2-reality-builder-dev-test.yml`

## À archiver : contrôles d'anciennes branches et de la V1 (23)

Ils visent des branches de travail fermées (`preview/…`, `feature/compendium-…`) ou `main`, qui sert encore la V1. Les contrôles utiles de la V2 sont déjà dans `v2-dev.yml`.

**Attention** : `compendium-page-overrides-sync.yml` a le droit d'écrire et recommite sur `main` ; il doit être archivé **avant** la fusion de la V2 dans `main`.

`builder-browser-smoke.yml`, `builder-syntax.yml`, `compendium-catalog-build.yml`, `compendium-editor-browser-smoke.yml`, `compendium-media-overrides.yml`, `compendium-navigation-browser.yml`, `compendium-page-overrides-sync.yml`, `compendium-restructure-audit.yml`, `compendium-restructure-build.yml`, `compendium-taxonomy-audit.yml`, `compendium-truth-catalog-build.yml`, `compendium-v3-check.yml`, `legacy-equipment-build.yml`, `legacy-equipment-reintegration.yml`, `pegre-preview-check.yml`, `reality-truth-internal-audit.yml`, `truth-catalog-check.yml`, `v2-angelus-source-snapshot.yml`, `v2-character-evolution-check.yml`, `v2-chrome-tls-compatibility.yml`, `v2-daemon-source.yml`, `v2-extral-source-recovery.yml`, `v2-recipe-snapshot.yml`

## Ordre

1. Une PR vers `feature/tuc-web-v2` qui **déplace** les 76 fichiers dans `.github/workflows-archive/`, sans les modifier.
2. Vérifier qu'aucun job ne s'est lancé au merge (onglet Actions).
3. Ensuite seulement : fusion dans `main`, coupure de Pages, Prettier/ESLint.
