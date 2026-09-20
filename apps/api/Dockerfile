FROM node:24-alpine AS build
WORKDIR /app
COPY apps/api/package.json ./
RUN npm install
COPY apps/api/tsconfig.json ./
COPY apps/api/src ./src
RUN npm run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY apps/api/package.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

COPY compendium/source/current-equipment-catalog-v1.json ./rules-data/current-equipment-catalog-v1.json
COPY compendium/source/reality-lore-v3-*.json ./rules-data/lore/
COPY character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64 ./rules-data/augmentations.json.gz.b64
COPY character-builder/rulesets/terra-umbra/reality/safe/neuroprograms.part01.b64 ./rules-data/neuroprograms.part01.b64
COPY character-builder/rulesets/terra-umbra/reality/safe/vehicles.part01.b64 ./rules-data/vehicles.part01.b64

COPY compendium/source/verite-catalog-v6.json.gz.b64 ./rules-data/truth-equipment/verite-catalog-v6.json.gz.b64

COPY compendium/data/manifest-v3.json ./compendium-data/manifest-v3.json
COPY compendium/data/navigation-v1.json ./compendium-data/navigation-v1.json
COPY compendium/data/manual-overrides.json ./compendium-data/manual-overrides.json
COPY compendium/data/v3-*.b64part ./compendium-data/

COPY compendium/images ./compendium-media/images
COPY compendium/assets ./compendium-media/assets

USER node
EXPOSE 3000
CMD ["npm", "start"]
