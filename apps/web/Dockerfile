FROM node:24-alpine AS build
WORKDIR /app/apps/web
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci
COPY apps/web/src ./src
COPY apps/web/public ./public
COPY apps/web/index.html apps/web/vite.config.ts apps/web/tsconfig*.json ./
COPY apps/api/src/rules/economy-model.ts apps/api/src/rules/character-derived-stats.ts apps/api/src/rules/reality-talents-policy.ts apps/api/src/rules/renown-rules.ts /app/apps/api/src/rules/
COPY apps/api/src/rules/reality-talents-summaries.ts apps/api/src/rules/reality-conditional-bonuses.ts /app/apps/api/src/rules/
COPY apps/api/src/campaign-preparation.ts /app/apps/api/src/campaign-preparation.ts
COPY apps/api/src/campaign-npc-model.ts apps/api/src/npc-tiers.ts apps/api/src/npc-rules.ts apps/api/src/npc-identities.ts apps/api/src/npc-truth-generator.ts apps/api/src/npc-truth-tiers.ts apps/api/src/npc-truth-generic-talents.ts /app/apps/api/src/
COPY apps/api/src/campaign-bestiary-model.ts apps/api/src/campaign-bestiary-weapons.ts /app/apps/api/src/
COPY apps/api/src/character-appearances.ts /app/apps/api/src/character-appearances.ts
COPY apps/api/src/rules/builder-equipment-policy.ts /app/apps/api/src/rules/builder-equipment-policy.ts
# Shared pure definitions are consumed by the Vue forms and their type checks.
COPY apps/api/src/rules/truth/mage-techniques.ts /app/apps/api/src/rules/truth/mage-techniques.ts
RUN npm run build

FROM nginx:1.29-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
