FROM node:24-alpine AS build
WORKDIR /app/apps/web
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci
COPY apps/web/src ./src
COPY apps/web/public ./public
COPY apps/web/index.html apps/web/vite.config.ts apps/web/tsconfig*.json ./
# Les formulaires Vue réutilisent les règles pures de l API : on copie tout son code source
# (une liste fichier par fichier se désynchronisait à chaque nouveau module).
COPY apps/api/src /app/apps/api/src
RUN npm run build

FROM nginx:1.29-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 80
