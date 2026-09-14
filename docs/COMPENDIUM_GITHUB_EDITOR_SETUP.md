# Compendium — authentification propriétaire GitHub

Le Compendium reste public en lecture, mais l'éditeur n'est activé qu'après authentification du compte GitHub `Helclaeynn`.

## 1. Créer la GitHub App

Dans GitHub : **Settings → Developer settings → GitHub Apps → New GitHub App**.

Paramètres conseillés :

- **GitHub App name** : `TUC Compendium Editor`
- **Homepage URL** : URL publique du projet (par exemple la GitHub Pages du dépôt)
- **Request user authorization (OAuth) during installation** : désactivé
- **Webhook** : désactivé
- **Repository permissions → Contents** : `Read and write`
- **Metadata** : `Read-only` (permission automatique)
- aucune autre permission nécessaire
- **Where can this GitHub App be installed?** : `Only on this account`

Après création :

1. Dans les réglages de l'App, activer **Enable Device Flow**.
2. Installer l'App sur le compte `Helclaeynn`.
3. Choisir **Only select repositories** puis `Terra-Umbra-Builder`.
4. Copier le **Client ID** de l'App.

Le Client ID est public. Ne jamais commiter de Client Secret ou de clé privée.

## 2. Déployer le proxy OAuth CORS

GitHub ne permet pas à une page statique d'appeler directement les endpoints Device Flow à cause de CORS. Le dépôt fournit un proxy minimal :

`tools/github-oauth-proxy-worker.js`

Exemple avec Cloudflare Workers :

1. Créer un Worker, par exemple `tuc-github-oauth`.
2. Remplacer le code du Worker par le contenu de `tools/github-oauth-proxy-worker.js`.
3. Ajouter la variable `GITHUB_CLIENT_ID` avec le Client ID de la GitHub App.
4. Facultatif : ajouter `ALLOWED_ORIGINS` sous forme de liste séparée par des virgules. Valeur recommandée :

   `https://helclaeynn.github.io,https://raw.githack.com,https://rawcdn.githack.com`

5. Déployer le Worker et conserver son URL `https://...workers.dev`.

Le Worker ne contient aucun secret GitHub. Il n'accepte que deux routes :

- `POST /device/code`
- `POST /oauth/access_token`

## 3. Raccorder le Compendium

Renseigner dans `compendium/github-editor-config.js` :

- `clientId` : Client ID public de la GitHub App ;
- `oauthProxy` : URL publique du Worker, sans slash final.

## 4. Fonctionnement attendu

- visiteur non authentifié : lecture seule ; boutons `Éditer la page` et `Brouillons` masqués ;
- `Helclaeynn` authentifié : éditeur activé ;
- `Publier sur main` : création d'un commit atomique sur `main` avec l'override de la page et ses médias éventuels ;
- le workflow `Compendium page overrides sync` reconstruit ensuite `manual-overrides.json` ;
- le brouillon local est supprimé une fois la synchronisation détectée.

Les jetons sont conservés dans IndexedDB. Les jetons utilisateur GitHub App expirent normalement après 8 heures ; le refresh token permet un renouvellement automatique pendant jusqu'à 6 mois. Les jetons issus du Device Flow peuvent être renouvelés sans Client Secret.
