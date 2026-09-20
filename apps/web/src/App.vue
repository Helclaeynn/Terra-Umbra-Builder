<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import CharactersPanel from "./components/CharactersPanel.vue";
import "./brand-signal.css";

type Role = "player" | "gm" | "editor" | "admin";

type User = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

type AuditEvent = {
  id: string;
  action: string;
  actorName: string | null;
  targetName: string | null;
  targetEmail: string | null;
  beforeState: { role?: Role; active?: boolean } | null;
  afterState: { role?: Role; active?: boolean } | null;
  createdAt: string;
};

const roleLabels: Record<Role, string> = {
  player: "Joueur",
  gm: "MJ",
  editor: "Éditeur",
  admin: "Administrateur"
};

const health = ref("…");
const setupRequired = ref(false);
const user = ref<User | null>(null);
const adminUsers = ref<User[]>([]);
const auditEvents = ref<AuditEvent[]>([]);
const busy = ref(false);
const message = ref("");
const error = ref("");
const passwordResetAvailable = ref(false);
const resetToken = ref(new URLSearchParams(window.location.search).get("reset") ?? "");
const authMode = ref<"login" | "register" | "forgot" | "reset">(
  resetToken.value ? "reset" : "login"
);

const authForm = ref({
  displayName: "",
  email: "",
  password: "",
  passwordConfirmation: ""
});

const profileForm = ref({
  displayName: ""
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirmation: ""
});

const isAdmin = computed(() => user.value?.role === "admin");

function resetFeedback() {
  message.value = "";
  error.value = "";
}

function humanError(code: string): string {
  const labels: Record<string, string> = {
    invalid_email: "Adresse e-mail invalide.",
    invalid_display_name: "Le nom doit contenir entre 2 et 80 caractères.",
    weak_password: "Le mot de passe doit contenir au moins 12 caractères.",
    password_confirmation_mismatch: "Les deux mots de passe doivent être renseignés et identiques.",
    password_reset_unavailable: "La récupération par e-mail n’est pas encore configurée.",
    password_reset_mail_failed: "L’e-mail de réinitialisation n’a pas pu être envoyé.",
    invalid_reset_token: "Le lien de réinitialisation est invalide.",
    invalid_or_expired_reset_token: "Le lien de réinitialisation est invalide ou a expiré.",
    password_reset_failed: "La réinitialisation du mot de passe a échoué.",
    setup_already_completed: "Le compte administrateur initial existe déjà.",
    setup_required: "L'initialisation administrateur doit être terminée d'abord.",
    email_already_used: "Cette adresse e-mail est déjà utilisée.",
    invalid_credentials: "E-mail ou mot de passe incorrect.",
    account_disabled: "Ce compte a été désactivé.",
    too_many_attempts: "Trop de tentatives. Réessaie dans quelques minutes.",
    authentication_required: "Connexion requise.",
    admin_required: "Droits administrateur requis.",
    cannot_modify_self: "Ton propre rôle ne se modifie pas depuis ce panneau.",
    last_admin_protected: "Le dernier administrateur actif est protégé.",
    invalid_current_password: "Le mot de passe actuel est incorrect.",
    account_update_failed: "La modification du compte a échoué.",
    cannot_delete_self: "Tu ne peux pas supprimer ton propre compte administrateur.",
    delete_confirmation_mismatch: "La confirmation ne correspond pas à l’adresse e-mail du compte.",
    account_delete_failed: "La suppression du compte a échoué.",
    logout_failed: "La déconnexion n’a pas été confirmée par le serveur."
  };

  return labels[code] ?? "Une erreur est survenue.";
}

async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    headers
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error ?? `http_${response.status}`);
  }

  return body as T;
}

async function bootstrap() {
  const [healthResult, setupResult, capabilitiesResult] = await Promise.allSettled([
    api<{ status: string }>("/api/health"),
    api<{ setupRequired: boolean }>("/api/auth/setup-status"),
    api<{ passwordResetAvailable: boolean }>("/api/auth/capabilities")
  ]);

  health.value =
    healthResult.status === "fulfilled" ? healthResult.value.status : "hors ligne";

  if (setupResult.status === "fulfilled") {
    setupRequired.value = setupResult.value.setupRequired;
  }

  if (capabilitiesResult.status === "fulfilled") {
    passwordResetAvailable.value = capabilitiesResult.value.passwordResetAvailable;
  }

  if (!setupRequired.value) {
    try {
      const result = await api<{ user: User }>("/api/auth/me");
      applyUser(result.user);
    } catch {
      user.value = null;
    }
  }
}

function applyUser(nextUser: User) {
  user.value = nextUser;
  profileForm.value.displayName = nextUser.displayName;
  authForm.value.password = "";
  authForm.value.passwordConfirmation = "";

  if (nextUser.role === "admin") {
    void loadAdmin();
  }
}

async function submitSetup() {
  resetFeedback();
  busy.value = true;

  try {
    const result = await api<{ user: User }>("/api/auth/setup", {
      method: "POST",
      body: JSON.stringify(authForm.value)
    });

    setupRequired.value = false;
    applyUser(result.user);
    message.value = "Compte administrateur créé.";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    busy.value = false;
  }
}

async function submitAuth() {
  resetFeedback();
  busy.value = true;

  try {
    if (authMode.value === "register") {
      const result = await api<{ user: User }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(authForm.value)
      });
      applyUser(result.user);
      message.value = "Compte créé.";
    } else {
      const result = await api<{ user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: authForm.value.email,
          password: authForm.value.password
        })
      });
      applyUser(result.user);
      message.value = "Connexion réussie.";
    }
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    busy.value = false;
  }
}

async function requestPasswordReset() {
  resetFeedback();
  busy.value = true;

  try {
    await api("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: authForm.value.email })
    });
    message.value = "Si ce compte existe, un lien de réinitialisation vient d’être envoyé.";
    authMode.value = "login";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    busy.value = false;
  }
}

async function resetPassword() {
  resetFeedback();
  busy.value = true;

  try {
    await api("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: resetToken.value,
        password: authForm.value.password,
        passwordConfirmation: authForm.value.passwordConfirmation
      })
    });
    authForm.value.password = "";
    authForm.value.passwordConfirmation = "";
    resetToken.value = "";
    window.history.replaceState({}, "", window.location.pathname);
    authMode.value = "login";
    message.value = "Mot de passe réinitialisé. Tu peux maintenant te connecter.";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    busy.value = false;
  }
}

async function logout() {
  resetFeedback();
  busy.value = true;

  try {
    await api("/api/auth/logout", {
      method: "POST",
      body: "{}"
    });

    const check = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store"
    });

    if (check.status !== 401) {
      throw new Error("logout_failed");
    }

    user.value = null;
    adminUsers.value = [];
    auditEvents.value = [];
    authMode.value = "login";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    busy.value = false;
  }
}

async function saveProfile() {
  resetFeedback();
  busy.value = true;

  try {
    const result = await api<{ user: User }>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(profileForm.value)
    });
    applyUser(result.user);
    message.value = "Profil mis à jour.";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    busy.value = false;
  }
}

async function changePassword() {
  resetFeedback();
  busy.value = true;

  try {
    await api("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwordForm.value)
    });
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: ""
    };
    message.value = "Mot de passe modifié. Les autres sessions ont été fermées.";
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  } finally {
    busy.value = false;
  }
}

async function loadAdmin() {
  if (!isAdmin.value) return;

  try {
    const [usersResult, auditResult] = await Promise.all([
      api<{ users: User[] }>("/api/admin/users"),
      api<{ events: AuditEvent[] }>("/api/admin/audit")
    ]);
    adminUsers.value = usersResult.users;
    auditEvents.value = auditResult.events;
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  }
}

async function setRole(target: User, role: Role) {
  if (role === target.role) return;

  const confirmed = window.confirm(
    `Changer le rôle de ${target.displayName} (${target.email}) de « ${roleLabels[target.role]} » vers « ${roleLabels[role]} » ?`
  );

  if (!confirmed) {
    await loadAdmin();
    return;
  }

  await updateAdminUser(target, { role });
}

async function toggleActive(target: User) {
  const action = target.active ? "désactiver" : "réactiver";
  const confirmed = window.confirm(
    `Êtes-vous sûr de vouloir ${action} le compte de ${target.displayName} (${target.email}) ?`
  );

  if (!confirmed) return;
  await updateAdminUser(target, { active: !target.active });
}

async function deleteAccount(target: User) {
  resetFeedback();

  const confirmation = window.prompt(
    `Suppression définitive de ${target.displayName}. Cette opération supprimera aussi ses personnages.\n\nPour confirmer, retape exactement son adresse e-mail :\n${target.email}`
  );

  if (confirmation === null) return;

  try {
    await api(`/api/admin/users/${target.id}`, {
      method: "DELETE",
      body: JSON.stringify({ confirmation })
    });
    message.value = `Compte ${target.email} supprimé.`;
    await loadAdmin();
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  }
}

async function updateAdminUser(
  target: User,
  changes: { role?: Role; active?: boolean }
) {
  resetFeedback();

  try {
    const result = await api<{ user: User }>(`/api/admin/users/${target.id}`, {
      method: "PATCH",
      body: JSON.stringify(changes)
    });

    const index = adminUsers.value.findIndex((item) => item.id === target.id);
    if (index >= 0) adminUsers.value[index] = result.user;
    message.value = "Compte mis à jour.";
    await loadAdmin();
  } catch (cause) {
    error.value = humanError((cause as Error).message);
  }
}

function auditActionLabel(event: AuditEvent): string {
  return event.action === "account_delete" ? "a supprimé" : "a modifié";
}

function formatDate(value: string | null): string {
  if (!value) return "Jamais";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

onMounted(bootstrap);
</script>

<template>
  <div class="app-shell brand-signal">
    <header class="topbar">
      <RouterLink class="brand" to="/">
        <span class="brand-emblem" aria-hidden="true">
          <img src="/brand/terra-umbra-mark-clean.webp" alt="" />
        </span>
        <span class="brand-wordmark">
          <strong>Terra Umbra</strong>
          <small><span>California</span><i></i><span>Web V2</span></small>
        </span>
      </RouterLink>

      <div class="top-actions">
        <span class="brand-top-signal" aria-hidden="true">REALITY // VÉRITÉ</span>
        <a v-if="user" class="ghost compact top-product-link brand-nav-link" href="#characters">
          Builder
        </a>
        <RouterLink class="ghost compact top-product-link brand-nav-link" to="/compendium">
          Explore
        </RouterLink>
        <span class="api-pill" :class="{ ok: health === 'ok' }">
          API {{ health }}
        </span>
        <button v-if="user" class="ghost" type="button" @click="logout">
          Déconnexion
        </button>
      </div>
    </header>

    <main class="page">
      <section v-if="setupRequired" class="auth-layout">
        <div class="intro">
          <p class="eyebrow">PREMIÈRE OUVERTURE</p>
          <h1>Créer l’administrateur initial</h1>
          <p>
            Ce premier compte recevra les droits Administrateur. Dès sa création,
            cette étape sera définitivement fermée et les nouveaux comptes seront
            créés comme Joueur.
          </p>
        </div>

        <form class="panel auth-card" @submit.prevent="submitSetup">
          <label>
            Nom affiché
            <input
              v-model="authForm.displayName"
              autocomplete="name"
              required
              minlength="2"
              maxlength="80"
            />
          </label>
          <label>
            E-mail
            <input
              v-model="authForm.email"
              type="email"
              autocomplete="email"
              required
            />
          </label>
          <label>
            Mot de passe
            <input
              v-model="authForm.password"
              type="password"
              autocomplete="new-password"
              required
              minlength="12"
            />
            <small>12 caractères minimum.</small>
          </label>
          <label>
            Confirmer le mot de passe
            <input
              v-model="authForm.passwordConfirmation"
              type="password"
              autocomplete="new-password"
              required
              minlength="12"
            />
          </label>
          <button class="primary" :disabled="busy" type="submit">
            Créer mon compte administrateur
          </button>
        </form>
      </section>

      <section v-else-if="!user" class="auth-layout">
        <div class="intro">
          <p class="eyebrow">TERRA UMBRA CALIFORNIA</p>
          <h1>Bienvenue dans TUC Web</h1>
          <p>
            La V2 dispose maintenant de comptes persistants. Les personnages,
            collections et outils de campagne viendront se greffer sur ce compte.
          </p>
        </div>

        <div class="panel auth-card">
          <div v-if="authMode === 'login' || authMode === 'register'" class="tabs">
            <button
              type="button"
              :class="{ active: authMode === 'login' }"
              @click="authMode = 'login'"
            >
              Connexion
            </button>
            <button
              type="button"
              :class="{ active: authMode === 'register' }"
              @click="authMode = 'register'"
            >
              Créer un compte
            </button>
          </div>

          <form v-if="authMode === 'login' || authMode === 'register'" @submit.prevent="submitAuth">
            <label v-if="authMode === 'register'">
              Nom affiché
              <input
                v-model="authForm.displayName"
                autocomplete="name"
                required
                minlength="2"
                maxlength="80"
              />
            </label>
            <label>
              E-mail
              <input
                v-model="authForm.email"
                type="email"
                autocomplete="email"
                required
              />
            </label>
            <label>
              Mot de passe
              <input
                v-model="authForm.password"
                type="password"
                :autocomplete="authMode === 'login' ? 'current-password' : 'new-password'"
                required
                :minlength="authMode === 'register' ? 12 : undefined"
              />
              <small v-if="authMode === 'register'">12 caractères minimum.</small>
            </label>
            <label v-if="authMode === 'register'">
              Confirmer le mot de passe
              <input
                v-model="authForm.passwordConfirmation"
                type="password"
                autocomplete="new-password"
                required
                minlength="12"
              />
            </label>
            <button class="primary" :disabled="busy" type="submit">
              {{ authMode === "login" ? "Se connecter" : "Créer le compte" }}
            </button>
            <button
              v-if="authMode === 'login' && passwordResetAvailable"
              class="link-button"
              type="button"
              @click="authMode = 'forgot'"
            >
              Mot de passe oublié ?
            </button>
          </form>

          <form v-if="authMode === 'forgot'" @submit.prevent="requestPasswordReset">
            <p class="auth-help">
              Renseigne l’adresse e-mail de ton compte. Si elle existe, nous t’enverrons
              un lien valable 30 minutes.
            </p>
            <label>
              E-mail
              <input v-model="authForm.email" type="email" autocomplete="email" required />
            </label>
            <button class="primary" :disabled="busy" type="submit">
              Envoyer le lien
            </button>
            <button class="link-button" type="button" @click="authMode = 'login'">
              Retour à la connexion
            </button>
          </form>

          <form v-if="authMode === 'reset'" @submit.prevent="resetPassword">
            <p class="auth-help">Choisis ton nouveau mot de passe.</p>
            <label>
              Nouveau mot de passe
              <input
                v-model="authForm.password"
                type="password"
                autocomplete="new-password"
                minlength="12"
                required
              />
            </label>
            <label>
              Confirmer le mot de passe
              <input
                v-model="authForm.passwordConfirmation"
                type="password"
                autocomplete="new-password"
                minlength="12"
                required
              />
            </label>
            <button class="primary" :disabled="busy" type="submit">
              Réinitialiser le mot de passe
            </button>
          </form>
        </div>
      </section>

      <template v-else>
        <section class="welcome dashboard-hero brand-dashboard-hero">
          <img
            class="brand-horizon-art"
            src="/brand/terra-umbra-horizon.webp"
            alt=""
            aria-hidden="true"
          />

          <div class="brand-masthead">
            <div class="brand-masthead-mark" aria-hidden="true">
              <img src="/brand/terra-umbra-mark-clean.webp" alt="" />
            </div>

            <div class="brand-masthead-copy">
              <p class="brand-microline">REALITY // VÉRITÉ // WHAT LIES BENEATH</p>
              <h1 class="brand-title">TERRA UMBRA</h1>
              <p class="brand-subtitle">CALIFORNIA&nbsp;&nbsp;•&nbsp;&nbsp;BUILDER V2</p>
              <div class="brand-title-rule" aria-hidden="true"></div>
              <p class="brand-tagline">SAME WORLD&nbsp;&nbsp;//&nbsp;&nbsp;A DEEPER LAYER&nbsp;&nbsp;//&nbsp;&nbsp;BUILT TO UNCOVER</p>

              <p class="dashboard-lead">
                Personnages, règles et encyclopédie dans un même espace. Reprends une fiche
                ou explore le monde sans changer d’outil.
              </p>

              <div class="dashboard-identity">
                <strong>{{ user.displayName }}</strong>
                <span class="role-badge">{{ roleLabels[user.role] }}</span>
                <span class="muted">{{ user.email }}</span>
              </div>
            </div>
          </div>

          <div class="brand-side-rail" aria-hidden="true">
            <span>BUILD</span>
            <span>EXPLORE</span>
            <span>UNCOVER</span>
            <span>REVEAL</span>
            <span>PERSIST</span>
          </div>
        </section>

        <div v-if="message || error" class="feedback" :class="{ error: !!error }">
          {{ error || message }}
        </div>

        <section class="dashboard-portals">
          <a class="dashboard-portal builder-portal" href="#characters">
            <span class="portal-index">01</span>
            <div>
              <p class="eyebrow">BUILDER</p>
              <h2>Mes personnages</h2>
              <p>Créer, reprendre et faire progresser les fiches sauvegardées.</p>
            </div>
            <strong>Voir mes fiches ↓</strong>
          </a>

          <RouterLink class="dashboard-portal compendium-portal" to="/compendium">
            <span class="portal-index">02</span>
            <div>
              <p class="eyebrow">COMPENDIUM</p>
              <h2>Explorer Terra Umbra</h2>
              <p>Règles, lore, équipement, personnages et références du Builder.</p>
            </div>
            <strong>Ouvrir le wiki →</strong>
          </RouterLink>
        </section>

        <section class="grid">
          <article class="panel account-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">MON COMPTE</p>
                <h2>Profil</h2>
              </div>
            </div>

            <form @submit.prevent="saveProfile">
              <label>
                Nom affiché
                <input
                  v-model="profileForm.displayName"
                  minlength="2"
                  maxlength="80"
                  required
                />
              </label>
              <button class="secondary" :disabled="busy" type="submit">
                Enregistrer
              </button>
            </form>

            <hr />

            <form @submit.prevent="changePassword">
              <h3>Changer le mot de passe</h3>
              <label>
                Mot de passe actuel
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  autocomplete="current-password"
                  required
                />
              </label>
              <label>
                Nouveau mot de passe
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  autocomplete="new-password"
                  minlength="12"
                  required
                />
              </label>
              <label>
                Confirmer le nouveau mot de passe
                <input
                  v-model="passwordForm.newPasswordConfirmation"
                  type="password"
                  autocomplete="new-password"
                  minlength="12"
                  required
                />
              </label>
              <button class="secondary" :disabled="busy" type="submit">
                Modifier le mot de passe
              </button>
            </form>
          </article>

          <CharactersPanel />
        </section>

        <section v-if="isAdmin" class="admin-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">ADMINISTRATION</p>
              <h2>Gestion des comptes</h2>
            </div>
            <button class="ghost" type="button" @click="loadAdmin">
              Actualiser
            </button>
          </div>

          <div class="panel table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>État</th>
                  <th>Dernière connexion</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="account in adminUsers" :key="account.id">
                  <td>
                    <strong>{{ account.displayName }}</strong>
                    <span>{{ account.email }}</span>
                    <small v-if="account.id === user.id">Vous</small>
                  </td>
                  <td>
                    <select
                      :value="account.role"
                      :disabled="account.id === user.id"
                      @change="setRole(account, ($event.target as HTMLSelectElement).value as Role)"
                    >
                      <option
                        v-for="(label, role) in roleLabels"
                        :key="role"
                        :value="role"
                      >
                        {{ label }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <span class="state" :class="{ disabled: !account.active }">
                      {{ account.active ? "Actif" : "Désactivé" }}
                    </span>
                  </td>
                  <td>{{ formatDate(account.lastLoginAt) }}</td>
                  <td class="actions-cell">
                    <button
                      class="ghost compact"
                      type="button"
                      :disabled="account.id === user.id"
                      @click="toggleActive(account)"
                    >
                      {{ account.active ? "Désactiver" : "Réactiver" }}
                    </button>
                    <button
                      class="ghost compact danger"
                      type="button"
                      :disabled="account.id === user.id"
                      @click="deleteAccount(account)"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section-heading audit-heading">
            <div>
              <p class="eyebrow">TRAÇABILITÉ</p>
              <h2>Journal administrateur</h2>
            </div>
          </div>

          <div class="panel audit-list">
            <p v-if="auditEvents.length === 0" class="muted">
              Aucune action administrative pour le moment.
            </p>
            <article v-for="event in auditEvents" :key="event.id">
              <div>
                <strong>{{ event.actorName || "Administrateur supprimé" }}</strong>
                {{ auditActionLabel(event) }}
                <strong>{{ event.targetName || event.targetEmail || "un compte" }}</strong>
              </div>
              <small>{{ formatDate(event.createdAt) }}</small>
            </article>
          </div>
        </section>
      </template>

      <div v-if="!user && (message || error)" class="feedback floating" :class="{ error: !!error }">
        {{ error || message }}
      </div>
    </main>
  </div>
</template>
