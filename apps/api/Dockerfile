FROM node:24-alpine AS build
WORKDIR /app
COPY apps/api/package.json apps/api/package-lock.json ./
RUN npm ci
COPY apps/api/tsconfig.json ./
COPY apps/api/src ./src
RUN npm run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY apps/api/package.json apps/api/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

# Verify the native Argon2 module in the actual musl/Alpine runtime before deploy.
RUN DATABASE_URL=postgres://build:build@127.0.0.1:1/build node --input-type=module -e \
  'import { hashPassword, verifyPassword, passwordNeedsRehash } from "./dist/auth.js"; const hash = await hashPassword("Build-only-Argon2-check"); if (!hash.startsWith("$argon2id$v=19$") || passwordNeedsRehash(hash) || !await verifyPassword("Build-only-Argon2-check", hash)) throw new Error("Argon2 runtime check failed"); console.log("ARGON2 ALPINE OK");'

COPY compendium/source/current-equipment-catalog-v1.json ./rules-data/current-equipment-catalog-v1.json
COPY compendium/source/reality-lore-v3-*.json ./rules-data/lore/
COPY character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64 ./rules-data/augmentations.json.gz.b64
COPY character-builder/rulesets/terra-umbra/reality/safe/neuroprograms.part01.b64 ./rules-data/neuroprograms.part01.b64
COPY character-builder/rulesets/terra-umbra/reality/safe/vehicles.part01.b64 ./rules-data/vehicles.part01.b64

COPY compendium/source/verite-catalog-v6.json.gz.b64 ./rules-data/truth-equipment/verite-catalog-v6.json.gz.b64
COPY compendium/source/truth-mechanics-v6-fixed.manifest.json ./rules-data/truth-mechanics/truth-mechanics-v6-fixed.manifest.json
COPY compendium/source/truth-mechanics-v6-fixed.part*.b64 ./rules-data/truth-mechanics/
COPY compendium/source/truth-lore-hunters-2026-09-v1-*.b64part ./rules-data/hunters/

COPY compendium/data/manifest-v3.json ./compendium-data/manifest-v3.json
COPY compendium/data/navigation-v1.json ./compendium-data/navigation-v1.json
COPY compendium/data/manual-overrides.json ./compendium-data/manual-overrides.json
COPY compendium/data/v3-*.b64part ./compendium-data/

COPY compendium/images ./compendium-media/images
COPY compendium/assets ./compendium-media/assets
COPY compendium/source/rules-diagrams-v1.json ./compendium-media/source/rules-diagrams-v1.json
COPY compendium/source/lore-illustrations-v1.json ./compendium-media/source/lore-illustrations-v1.json
COPY compendium/source/corporation-branding-v1.json ./compendium-media/source/corporation-branding-v1.json
COPY compendium/source/weapon-brand-links-v1.json ./compendium-media/source/weapon-brand-links-v1.json
COPY compendium/source/portrait-only-lot2-v1.json ./compendium-media/source/portrait-only-lot2-v1.json
COPY compendium/source/bestiary-art-direction-v2.json ./compendium-media/source/bestiary-art-direction-v2.json
COPY compendium/source/wiki-taxonomy-arbitrage-v1.json.gz ./review-data/wiki-taxonomy-arbitrage-v1.json.gz
ENV COMPENDIUM_ARBITRAGE_FILE=/app/review-data/wiki-taxonomy-arbitrage-v1.json.gz

RUN mkdir -p /app/editor-media && chown -R node:node /app/editor-media

USER node
EXPOSE 3000
CMD ["npm", "start"]
