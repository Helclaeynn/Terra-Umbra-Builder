FROM node:24-alpine AS build
WORKDIR /app/apps/web
COPY apps/web/package.json ./
RUN npm install
COPY apps/web/src ./src
COPY apps/web/public ./public
COPY apps/web/index.html apps/web/vite.config.ts apps/web/tsconfig*.json ./
COPY apps/api/src/rules/economy-model.ts /app/apps/api/src/rules/economy-model.ts
COPY apps/api/src/campaign-preparation.ts /app/apps/api/src/campaign-preparation.ts
COPY apps/api/src/campaign-npc-model.ts apps/api/src/npc-tiers.ts apps/api/src/npc-rules.ts /app/apps/api/src/
RUN npm run build

FROM nginx:1.29-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
