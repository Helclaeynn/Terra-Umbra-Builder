# TUC Web V2 — infrastructure

Cette pile est volontairement séparée de la V1 statique.

## Services

- Caddy : terminaison HTTPS et reverse proxy.
- Web : frontend Vue servi par Nginx.
- API : Fastify/TypeScript.
- DB : PostgreSQL, réseau Docker interne uniquement.

## Premier démarrage

Créer `.env` depuis `.env.example` avec un mot de passe PostgreSQL aléatoire long, puis :

```bash
docker compose --env-file .env up -d --build
```

Contrôles locaux sur le VPS :

```bash
docker compose ps
docker compose exec db pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"
curl -fsS https://dev.terra-umbra.fr/api/health
curl -fsS https://dev.terra-umbra.fr/api/ready
```

Ne jamais exposer le port 5432 sur l'hôte.
