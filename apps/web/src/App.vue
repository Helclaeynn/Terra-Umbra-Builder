<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import CharactersPanel from "./components/CharactersPanel.vue";
import AccountCampaigns from "./components/AccountCampaigns.vue";
import AccountLastReading from "./components/AccountLastReading.vue";
import TerraUmbraBrand from "./components/TerraUmbraBrand.vue";

import { api } from "./lib/api";
import SharedCharacterSheets from "./components/SharedCharacterSheets.vue";
const router=useRouter();
const identifying=ref(true);
let sessionGeneration=0;
let refreshing=false;

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

type GmRequest = {
  id: string; userId: string; comment: string; createdAt: string; decidedAt: string | null;
  status: "pending" | "approved" | "rejected";
};
type PendingGmRequest = GmRequest & { displayName: string; email: string; active: boolean; role: Role };
const gmRequest = ref<GmRequest | null>(null);
const gmRequests = ref<PendingGmRequest[]>([]);
const gmComment = ref("");
const gmBusy = ref(false);
const gmLoading = ref(true);
const gmError = ref("");
const gmMessage = ref("");
const gmLoaded = ref(false);

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
    gm_request_pending: "Une demande est déjà en attente de validation.",
    gm_request_decided: "Cette demande a déjà été traitée. La liste a été actualisée.",
    gm_request_not_found: "Cette demande n’existe plus. La liste a été actualisée.",
    gm_request_not_eligible: "Le rôle ou l’état du compte a changé. Actualise ton espace.",
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

async function bootstrap() {
  const generation=sessionGeneration;
  // Secondary service information must not delay identity or the character list.
  void api<{status:string}>("/api/health").then(result=>{health.value=result.status;}).catch(()=>{health.value="hors ligne";});
  void api<{setupRequired:boolean}>("/api/auth/setup-status").then(result=>{if(generation===sessionGeneration)setupRequired.value=result.setupRequired;}).catch(()=>{});
  void api<{passwordResetAvailable:boolean}>("/api/auth/capabilities").then(result=>{passwordResetAvailable.value=result.passwordResetAvailable;}).catch(()=>{});
  try {
    const result=await api<{user:User}>("/api/auth/me");
    if(generation===sessionGeneration)applyUser(result.user);
  } catch { if(generation===sessionGeneration)user.value=null; }
  finally { if(generation===sessionGeneration)identifying.value=false; }
}

function applyUser(nextUser: User, preserveDraft = false) {
  if (user.value?.id !== nextUser.id) {
    gmRequest.value = null;
    gmRequests.value = [];
    gmLoaded.value = false;
    gmComment.value = "";
    gmError.value = "";
    gmMessage.value = "";
  }
  user.value = nextUser;
  if (!preserveDraft) profileForm.value.displayName = nextUser.displayName;
  authForm.value.password = "";
  authForm.value.passwordConfirmation = "";

  if (nextUser.role === "admin") {
    void loadAdmin();
  } else {
    void loadGmRequest();
  }
}

async function loadGmRequest() {
  const userId = user.value?.id;
  gmLoading.value = true;
  gmError.value = "";
  try {
    const result = await api<{ request: GmRequest | null }>("/api/auth/gm-request");
    if (user.value?.id !== userId) return;
    gmRequest.value = result.request;
    gmLoaded.value = true;
  } catch {
    if (user.value?.id !== userId) return;
    gmError.value = "Impossible de charger le statut de l’accès MJ. Réessaie avec Actualiser.";
    gmLoaded.value = false;
  } finally { gmLoading.value = false; }
}

async function refreshAccess() {
  if (!user.value || gmBusy.value || busy.value || refreshing) return;
  const generation=sessionGeneration;
  refreshing=true;
  try {
    const result = await api<{ user: User }>("/api/auth/me");
    if(generation!==sessionGeneration)return;
    applyUser(result.user, result.user.id === user.value?.id);
  } catch (cause) {
    if (generation===sessionGeneration && (cause as Error).message === "authentication_required") {
      user.value = null;
      gmRequests.value = [];
      adminUsers.value = [];
      auditEvents.value = [];
    }
  }
  finally { refreshing=false; }
}

async function submitGmRequest() {
  if (gmBusy.value) return;
  gmBusy.value = true;
  gmError.value = "";
  gmMessage.value = "";
  try {
    const result = await api<{ request: GmRequest }>("/api/auth/gm-request", {
      method: "POST", body: JSON.stringify({ comment: gmComment.value })
    });
    gmRequest.value = result.request;
    gmComment.value = "";
    gmMessage.value = "Demande envoyée. Un administrateur doit autoriser ton accès MJ.";
  } catch (cause) {
    await loadGmRequest();
    gmError.value = humanError((cause as Error).message);
  } finally { gmBusy.value = false; }
}

async function decideGmRequest(target: PendingGmRequest, decision: "approved" | "rejected") {
  if (gmBusy.value) return;
  const prompt = decision === "approved"
    ? `Autoriser ${target.displayName} à devenir MJ ? Cette autorisation ouvre l’accès aux secrets de l’univers et aux outils MJ.`
    : `Refuser la demande d’accès MJ de ${target.displayName} ? Le compte conservera son rôle actuel.`;
  if (!window.confirm(prompt)) return;
  gmBusy.value = true;
  gmError.value = "";
  gmMessage.value = "";
  try {
    await api(`/api/admin/gm-requests/${target.id}/decision`, {
      method: "POST", body: JSON.stringify({ decision })
    });
    gmMessage.value = decision === "approved" ? `Accès MJ accordé à ${target.displayName}.` : `Demande de ${target.displayName} refusée.`;
  } catch (cause) {
    gmError.value = humanError((cause as Error).message);
  } finally {
    await loadAdmin();
    gmBusy.value = false;
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
  sessionGeneration++;
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
    const redirect=new URLSearchParams(window.location.search).get("redirect");
    if(redirect && /^\/characters\/[0-9a-f-]{36}\/sheet$/.test(redirect))await router.replace(redirect);
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
  sessionGeneration++;
  resetFeedback();
  busy.value = true;

  try {
    await api("/api/auth/logout", {
      method: "POST",
      body: "{}"
    });

    user.value = null;
    adminUsers.value = [];
    auditEvents.value = [];
    gmRequest.value = null;
    gmRequests.value = [];
    gmComment.value = "";
    gmError.value = "";
    gmMessage.value = "";
    gmLoaded.value = false;
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
  const userId = user.value?.id;
  gmLoading.value = true;
  try {
    const [usersResult, auditResult, requestsResult] = await Promise.all([
      api<{ users: User[] }>("/api/admin/users"),
      api<{ events: AuditEvent[] }>("/api/admin/audit"),
      api<{ requests: PendingGmRequest[] }>("/api/admin/gm-requests")
    ]);
    if (user.value?.id !== userId || !isAdmin.value) return;
    adminUsers.value = usersResult.users;
    auditEvents.value = auditResult.events;
    gmRequests.value = requestsResult.requests;
    gmLoaded.value = true;
  } catch (cause) {
    gmLoaded.value = false;
    error.value = humanError((cause as Error).message);
  } finally { gmLoading.value = false; }
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
  if (event.action === "gm_request_approved") return "a accepté la demande MJ de";
  if (event.action === "gm_request_rejected") return "a refusé la demande MJ de";
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
onMounted(() => window.addEventListener("focus", refreshAccess));
onUnmounted(() => {sessionGeneration++; window.removeEventListener("focus", refreshAccess);});
</script>

<template>
  <div class="app-shell account-shell">
    <a class="account-skip-link" href="#account-main">Aller à mon espace</a>
    <header class="topbar">
      <RouterLink class="brand brand-lockup-link" to="/">
        <TerraUmbraBrand />
      </RouterLink>

      <div class="top-actions">
        <a v-if="user" class="ghost compact top-product-link brand-nav-link" href="#characters">
          Builder
        </a>
        <RouterLink class="ghost compact top-product-link brand-nav-link" to="/compendium">
          Compendium
        </RouterLink>
        <span v-if="health === 'hors ligne'" class="service-status" role="status">
          Service indisponible
        </span>
        <button v-if="user" class="ghost" type="button" :disabled="busy" @click="logout">
          Déconnexion
        </button>
      </div>
    </header>

    <main id="account-main" class="page" tabindex="-1">
      <div v-if="message || error" class="feedback account-feedback" :class="{ error: !!error }" :role="error ? 'alert' : 'status'">
        {{ error || message }}
      </div>
      <p v-if="identifying" role="status">Ouverture de ton espace…</p>
      <section v-else-if="setupRequired" class="auth-layout">
        <div class="intro">
          <p class="eyebrow">PREMIÈRE OUVERTURE</p>
          <h1>Créer l’administrateur initial</h1>
          <p>
            Ce premier compte recevra les droits Administrateur. Dès sa création,
            cette étape sera définitivement fermée et les nouveaux comptes seront
            créés comme Joueur.
          </p>
        </div>

        <form class="panel auth-card" :aria-busy="busy" @submit.prevent="submitSetup">
          <h2>Compte administrateur</h2>
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
          <h1>Ton espace Terra Umbra</h1>
          <p>
            Connecte-toi pour retrouver tes personnages, tes favoris, tes collections
            et ton historique synchronisé. Le Compendium reste accessible sans compte.
          </p>
        </div>

        <div class="panel auth-card">
          <div v-if="authMode === 'login' || authMode === 'register'" class="tabs" role="group" aria-label="Accès à mon espace">
            <button
              type="button"
              :class="{ active: authMode === 'login' }"
              :aria-pressed="authMode === 'login'"
              :disabled="busy"
              @click="authMode = 'login'; resetFeedback()"
            >
              Connexion
            </button>
            <button
              type="button"
              :class="{ active: authMode === 'register' }"
              :aria-pressed="authMode === 'register'"
              :disabled="busy"
              @click="authMode = 'register'; resetFeedback()"
            >
              Créer un compte
            </button>
          </div>

          <form v-if="authMode === 'login' || authMode === 'register'" :aria-busy="busy" @submit.prevent="submitAuth">
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
              :disabled="busy"
              @click="authMode = 'forgot'; resetFeedback()"
            >
              Mot de passe oublié ?
            </button>
          </form>

          <form v-if="authMode === 'forgot'" :aria-busy="busy" @submit.prevent="requestPasswordReset">
            <h2>Retrouver mon accès</h2>
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
            <button class="link-button" type="button" :disabled="busy" @click="authMode = 'login'; resetFeedback()">
              Retour à la connexion
            </button>
          </form>

          <form v-if="authMode === 'reset'" :aria-busy="busy" @submit.prevent="resetPassword">
            <h2>Nouveau mot de passe</h2>
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
        <section class="account-hero" aria-labelledby="account-title">
          <img class="account-horizon-art" src="/brand/orbital/orbital-earth.webp" width="1536" height="1024" alt="" decoding="async" />
          <div class="account-hero-copy">
            <p class="eyebrow">TERRA UMBRA / TON ESPACE</p>
            <h1 id="account-title">Mon espace</h1>
            <p class="dashboard-lead">
              Tes personnages, tes lectures, ton univers. Reprends une fiche
              ou pars explorer le Compendium.
            </p>
            <div class="dashboard-identity">
              <strong>{{ user.displayName }}</strong>
              <span class="role-badge">{{ roleLabels[user.role] }}</span>
              <span class="muted">{{ user.email }}</span>
              <a v-if="isAdmin && gmLoaded" class="gm-notification" href="#gm-requests">
                {{ gmRequests.length }} demande{{ gmRequests.length > 1 ? 's' : '' }} MJ en attente ↓
              </a>
            </div>
          </div>
        </section>

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

        <AccountCampaigns :key="user.id" :user-id="user.id" />

        <AccountLastReading :key="`${user.id}:${user.role}`" :user-id="user.id" />

        <section class="account-grid" aria-label="Personnages et préférences">
          <CharactersPanel :key="user.id" />
          <SharedCharacterSheets v-if="['gm','editor','admin'].includes(user.role)" :key="`${user.id}:${user.role}`" />

          <article class="panel account-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">MON COMPTE</p>
                <h2>Profil et sécurité</h2>
              </div>
            </div>

            <div class="account-settings-grid">
              <form :aria-busy="busy" @submit.prevent="saveProfile">
                <h3>Mon profil</h3>
                <p class="muted">Code de compte : <strong>{{ user.id.slice(0,8) }}</strong> · Pour distinguer les homonymes lors d’un partage.</p>
                <label>
                  Nom affiché
                  <input
                    v-model="profileForm.displayName"
                    autocomplete="name"
                    minlength="2"
                    maxlength="80"
                    required
                  />
                </label>
                <button class="secondary" :disabled="busy" type="submit">
                  Enregistrer
                </button>
              </form>

              <form :aria-busy="busy" @submit.prevent="changePassword">
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
            </div>
            <section v-if="!isAdmin" class="gm-access-panel account-gm-settings" aria-labelledby="gm-access-title" :aria-busy="gmBusy || gmLoading">
              <div class="section-heading">
                <div><p class="eyebrow">MENER UNE PARTIE</p><h3 id="gm-access-title">Accès Maître du Jeu</h3></div>
                <button class="ghost compact" type="button" :disabled="gmBusy || gmLoading" @click="refreshAccess">Actualiser</button>
              </div>
              <p>Le rôle MJ ouvre <strong>l’accès aux secrets de l’univers et aux outils MJ</strong>. Il révèle les informations confidentielles du Compendium : demande-le si tu souhaites mener des parties.</p>
              <p class="muted">Les outils MJ seront enrichis au fil des prochaines mises à jour.</p>
              <p v-if="gmError" class="gm-feedback error" role="alert">{{ gmError }}</p>
              <p v-if="gmMessage" class="gm-feedback" role="status">{{ gmMessage }}</p>
              <p v-if="user.role !== 'player'" class="gm-state">Ton rôle {{ roleLabels[user.role] }} te donne déjà l’accès MJ.</p>
              <p v-else-if="gmLoading" role="status">Chargement du statut…</p>
              <template v-else-if="gmLoaded">
                <div v-if="gmRequest?.status === 'pending'" class="gm-state" role="status">
                  <strong>En attente de validation</strong>
                  <p>Demande envoyée le {{ formatDate(gmRequest.createdAt) }}. Tu conserves ton accès joueur jusqu’à la décision d’un administrateur.</p>
                </div>
                <form v-else @submit.prevent="submitGmRequest">
                  <p v-if="gmRequest?.status === 'rejected'" class="gm-state">Ta demande a été refusée le {{ formatDate(gmRequest.decidedAt) }}. Tu peux contacter un administrateur ou envoyer une nouvelle demande.</p>
                  <p v-else-if="gmRequest?.status === 'approved'" class="gm-state">Ton compte ne dispose plus du rôle MJ. Tu peux demander une nouvelle autorisation.</p>
                  <label for="gm-comment">Un mot pour l’administrateur <span class="muted">(facultatif, 1 000 caractères maximum)</span></label>
                  <textarea id="gm-comment" v-model="gmComment" rows="3" maxlength="1000" placeholder="Par exemple, la partie que tu souhaites mener…" :disabled="gmBusy"></textarea>
                  <button type="submit" :disabled="gmBusy">{{ gmBusy ? 'Envoi…' : 'Demander l’accès MJ' }}</button>
                </form>
              </template>
            </section>
          </article>
        </section>

        <section v-if="isAdmin" class="admin-section">
          <section id="gm-requests" class="panel gm-access-panel" aria-labelledby="gm-requests-title" :aria-busy="gmBusy || gmLoading">
            <div class="section-heading">
              <div><p class="eyebrow">AUTORISATIONS</p><h2 id="gm-requests-title">Demandes d’accès MJ <span v-if="gmLoaded" class="role-badge">{{ gmRequests.length }}</span></h2></div>
              <button class="ghost compact" type="button" :disabled="gmBusy || gmLoading" @click="loadAdmin">Actualiser les demandes</button>
            </div>
            <p>Accepter accorde le rôle MJ et ouvre <strong>l’accès aux secrets de l’univers et aux outils MJ</strong>, dont les informations confidentielles du Compendium.</p>
            <p v-if="gmError" class="gm-feedback error" role="alert">{{ gmError }}</p>
            <p v-if="gmMessage" class="gm-feedback" role="status">{{ gmMessage }}</p>
            <p v-if="gmLoading && !gmLoaded" role="status">Chargement des demandes…</p>
            <p v-else-if="!gmLoaded" role="alert">Impossible de charger les demandes. Réessaie avec Actualiser.</p>
            <p v-else-if="!gmRequests.length" class="muted">Aucune demande en attente.</p>
            <article v-for="item in gmRequests" v-else :key="item.id" class="gm-request-card">
              <div>
                <h3>{{ item.displayName }}</h3>
                <p class="muted">{{ item.email }} · {{ formatDate(item.createdAt) }}</p>
                <p class="gm-comment">{{ item.comment || 'Aucun commentaire ajouté.' }}</p>
                <p v-if="!item.active" class="muted">Compte désactivé : réactive-le avant d’accorder l’accès MJ.</p>
              </div>
              <div class="gm-request-actions">
                <button type="button" :disabled="gmBusy || gmLoading || !item.active || item.role !== 'player'" :aria-label="`Accepter la demande MJ de ${item.displayName}`" @click="decideGmRequest(item, 'approved')">Accepter</button>
                <button class="ghost" type="button" :disabled="gmBusy || gmLoading" :aria-label="`Refuser la demande MJ de ${item.displayName}`" @click="decideGmRequest(item, 'rejected')">Refuser</button>
              </div>
            </article>
          </section>
          <div class="section-heading">
            <div>
              <p class="eyebrow">ADMINISTRATION</p>
              <h2>Gestion des comptes</h2>
            </div>
            <div class="top-actions">
              <RouterLink class="ghost" to="/admin/quality">
                Contrôle qualité
              </RouterLink>
              <button class="ghost" type="button" @click="loadAdmin">
                Actualiser
              </button>
            </div>
          </div>

          <p id="account-table-help" class="muted admin-table-help">Les rôles et accès se gèrent ici. Les rôles MJ, Éditeur et Administrateur ouvrent l’accès aux secrets de l’univers et aux outils MJ. La suppression d’un compte demande une confirmation.</p>
          <div class="panel table-wrap" role="region" aria-label="Comptes utilisateurs" aria-describedby="account-table-help" tabindex="0">
            <table>
              <caption class="visually-hidden">Comptes, rôles et accès des utilisateurs</caption>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>État</th>
                  <th>Dernière connexion</th>
                  <th>Actions</th>
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
                      :aria-label="`Rôle de ${account.displayName}`"
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
                      :aria-label="`${account.active ? 'Désactiver' : 'Réactiver'} le compte de ${account.displayName}`"
                      @click="toggleActive(account)"
                    >
                      {{ account.active ? "Désactiver" : "Réactiver" }}
                    </button>
                    <button
                      class="ghost compact danger"
                      type="button"
                      :disabled="account.id === user.id"
                      :aria-label="`Supprimer le compte de ${account.displayName}`"
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

    </main>
  </div>
</template>

<style scoped>
.account-shell {
  color: #e8f0ff;
  background: #070e18;
  font-family: Inter, "Segoe UI", sans-serif;
}

.account-shell .topbar {
  min-height: 78px;
  padding: 12px clamp(18px, 2.5vw, 40px);
  border-color: #283e55;
  background: #080f19f5;
  box-shadow: none;
}

.account-shell .top-actions { flex-wrap: wrap; gap: 10px; }
.account-shell .brand-lockup-link { min-width: 0; }
.account-shell .page { width: min(1480px, calc(100% - 48px)); padding: 32px 0 72px; }
.account-shell .page:focus { outline: none; }
.account-skip-link { position: fixed; top: -100px; left: 16px; z-index: 100; padding: 12px 18px; color: #06111e; background: #a4edff; }
.account-skip-link:focus { top: 12px; }
.service-status { color: #ffc0a0; font-size: 13px; }

.account-shell :is(h1, h2, h3) { color: #edf4ff; font-family: inherit; letter-spacing: -.035em; }
.account-shell .eyebrow { color: #8edff5; font: 600 11px/1.5 "SFMono-Regular", Consolas, monospace; letter-spacing: .14em; }
.account-shell .panel { border: 1px solid #293f55; border-radius: 8px; background: #0c1725; box-shadow: none; }
.account-shell .section-heading h2 { font-size: clamp(22px, 2vw, 28px); font-weight: 650; }
.account-shell .muted { color: #a4b8cf; }
.account-shell label { min-width: 0; gap: 8px; color: #c8d8e9; font-size: 14px; }
.account-shell label small { color: #a4b8cf; font-size: 13px; }
.account-shell :is(input, select) { min-width: 0; min-height: 46px; border: 1px solid #35536e; border-radius: 6px; background: #09121e; color: #e8f0ff; }
.account-shell :is(input, select):focus { border-color: #85e6ff; box-shadow: 0 0 0 3px #85e6ff1f; }
.account-shell :is(.primary, .secondary, .ghost, .link-button) { min-height: 44px; border-radius: 6px; font-size: 14px; line-height: 1.4; }
.account-shell :is(.primary, .secondary, .ghost) { display: inline-flex; align-items: center; justify-content: center; text-align: center; text-decoration: none; }
.account-shell .primary { border-color: #a4edff; background: #a4edff; color: #071522; box-shadow: none; }
.account-shell .primary:not(:disabled):hover { background: #c2f3ff; border-color: #c2f3ff; }
.account-shell :is(.secondary, .ghost) { color: #cedef0; background: #0c1725; border-color: #35536e; }
.account-shell :is(.secondary, .ghost):not(:disabled):hover { color: #fff; border-color: #80d4ee; background: #142739; }
.account-shell .link-button { color: #9ae8fc; }
.account-shell .danger { color: #ffafb9; border-color: #724453; }
.account-shell :is(a, button, input, select):focus-visible { outline: 2px solid #85e6ff; outline-offset: 4px; }

.auth-layout { min-height: min(720px, calc(100vh - 160px)); grid-template-columns: minmax(0, 1fr) minmax(320px, 440px); gap: clamp(32px, 7vw, 100px); max-width: 1200px; margin: auto; }
.auth-layout .intro { min-width: 0; padding: 32px 0; }
.auth-layout .intro h1 { max-width: 12ch; margin: 14px 0 24px; font-size: clamp(36px, 4.5vw, 62px); font-weight: 650; line-height: 1.06; }
.auth-layout .intro p:not(.eyebrow) { max-width: 48ch; color: #b9cce0; font-size: 16px; line-height: 1.8; }
.account-shell .auth-card { min-width: 0; padding: clamp(22px, 3vw, 36px); }
.auth-card h2 { margin: 0 0 8px; font-size: 24px; font-weight: 650; }
.auth-card .tabs { gap: 6px; margin: 0 0 26px; padding: 5px; border: 1px solid #293f55; border-radius: 8px; background: #07101b; }
.auth-card .tabs button { min-height: 48px; padding: 10px; border: 1px solid transparent; border-radius: 5px; color: #b7cbe0; font-size: 14px; }
.auth-card .tabs button.active { color: #a4edff; border-color: #355a74; background: #142638; }
.auth-help { color: #b7cbe0; font-size: 15px; line-height: 1.7; }
.auth-card form { gap: 20px; }
.account-feedback { position: sticky; top: 90px; z-index: 11; margin-bottom: 20px; padding: 16px 20px; border-radius: 8px; border-color: #375f69; color: #c5f4e8; background: #112d32; box-shadow: 0 8px 28px #0005; }
.account-feedback.error { border-color: #845063; color: #ffd3da; background: #321c2b; }

.account-hero { position: relative; min-height: 300px; display: flex; align-items: center; overflow: hidden; margin-bottom: 24px; padding: clamp(28px, 4vw, 56px); border: 1px solid #293f55; border-radius: 8px; background: #050c16; }
.account-horizon-art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 44%; opacity: .75; mask-image: linear-gradient(90deg, transparent 10%, #000 85%); }
.account-hero-copy { position: relative; z-index: 1; max-width: 710px; min-width: 0; }
.account-hero h1 { margin: 14px 0 20px; font-size: clamp(38px, 4vw, 58px); line-height: 1.07; font-weight: 650; }
.account-hero .dashboard-lead { max-width: 48ch; color: #c4d6e9; font-size: 16px; line-height: 1.7; }
.account-hero .dashboard-identity { margin-top: 26px; gap: 10px 14px; font-size: 14px; overflow-wrap: anywhere; }
.account-hero .dashboard-identity .muted { flex-basis: 100%; }
.account-shell .role-badge { border: 1px solid #3d6580; border-radius: 4px; color: #a4edff; background: #0e2136c9; font-size: 12px; }

.dashboard-portals { gap: 20px; margin-bottom: 28px; }
.dashboard-portal { min-height: 185px; padding: 26px; border-color: #304a63; border-radius: 8px; background: linear-gradient(120deg, #102535, #0b1625); box-shadow: none; }
.dashboard-portal.compendium-portal { border-color: #484264; background: linear-gradient(120deg, #211d33, #0b1625); }
.dashboard-portal::after { border-color: #6da7c32a; }
.dashboard-portal:hover { transform: translateY(-2px); border-color: #7bdcf5; box-shadow: none; }
.dashboard-portal.compendium-portal:hover { border-color: #b79aff; }
.dashboard-portal h2 { margin: 10px 0 12px; padding-right: 24px; font-size: 25px; font-weight: 600; line-height: 1.15; }
.dashboard-portal p:not(.eyebrow) { color: #bacde1; font-size: 15px; line-height: 1.65; }
.dashboard-portal > strong { color: #a4edff; font-size: 14px; }
.dashboard-portal.compendium-portal > strong, .compendium-portal .eyebrow { color: #c4acff; }
.portal-index { color: #7798b2; font: 12px/1.5 Consolas, monospace; }
.account-grid { display: grid; gap: 28px; }
.account-grid > * { min-width: 0; }
.account-panel { padding: clamp(22px, 3vw, 36px); }
.account-settings-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(28px, 5vw, 72px); }
.account-settings-grid form { align-content: start; }
.account-settings-grid h3 { margin: 0 0 2px; color: #d7e7f6; font-size: 17px; font-weight: 600; }
.account-settings-grid form button { justify-self: start; margin-top: 4px; }

.admin-section { min-width: 0; margin-top: 44px; }
.gm-access-panel { margin: 24px 0; padding: clamp(20px, 3vw, 32px); scroll-margin-top: 100px; }
.gm-access-panel p { line-height: 1.65; }
.gm-access-panel form { display: grid; gap: 12px; max-width: 760px; }
.gm-access-panel textarea { width: 100%; box-sizing: border-box; resize: vertical; min-height: 88px; padding: 12px; color: #e6f0fb; background: #091522; border: 1px solid #36536a; border-radius: 6px; font: inherit; }
.gm-access-panel button { min-height: 44px; }
.gm-access-panel form button { justify-self: start; }
.account-gm-settings { margin: 28px 0 0; padding: 24px 0 0; border-top: 1px solid #304458; }
.account-gm-settings h3 { margin: 0; font-size: 19px; }
.gm-state { padding: 16px 20px; border-left: 3px solid #80dded; background: #122638; }
.gm-state p { margin-bottom: 0; }
.gm-notification { color: #a4edff; border: 1px solid #3d6580; border-radius: 5px; padding: 8px 12px; text-decoration: none; }
.gm-request-card { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 20px 0; border-top: 1px solid #304458; }
.gm-request-card > div:first-child { min-width: 0; overflow-wrap: anywhere; }
.gm-request-card h3 { margin: 0; }
.gm-comment { white-space: pre-wrap; }
.gm-request-actions { display: flex; flex-wrap: wrap; gap: 10px; flex-shrink: 0; }
.gm-feedback { padding: 12px 16px; color: #a4edff; background: #122638; }
.gm-feedback.error { color: #ffc1c1; border-left: 3px solid #ea9999; }
@media (max-width: 650px) {
  .gm-request-card { align-items: stretch; flex-direction: column; gap: 12px; }
  .gm-access-panel .section-heading { flex-wrap: wrap; gap: 12px; }
  .gm-request-actions button { flex: 1; }
}
.admin-section .section-heading { flex-wrap: wrap; }
.admin-table-help { margin: 0 0 16px; font-size: 14px; line-height: 1.7; }
.table-wrap { max-width: 100%; overscroll-behavior-x: contain; }
.table-wrap table { min-width: 850px; }
.table-wrap th { color: #a1b9d3; font-size: 11px; border-color: #263d54; }
.table-wrap td { color: #c8d8e9; font-size: 14px; border-color: #263d54; }
.table-wrap td:first-child { max-width: 340px; overflow-wrap: anywhere; }
.table-wrap td:first-child strong { color: #edf4ff; }
.table-wrap td:first-child span { color: #a4b8cf; }
.table-wrap select { min-width: 155px; }
.table-wrap .actions-cell { display: table-cell; white-space: nowrap; }
.table-wrap .actions-cell button + button { margin-left: 8px; }
.account-shell .state { padding: 7px 10px; border-radius: 4px; color: #b1ecd8; border-color: #32675e; background: #12332c; }
.account-shell .state.disabled { color: #ffc1c9; border-color: #704151; background: #2b1927; }
.audit-list { padding: 8px 22px; }
.audit-list article { padding: 18px 0; color: #b9cce0; border-color: #263d54; font-size: 14px; line-height: 1.6; }
.audit-list article > div { min-width: 0; overflow-wrap: anywhere; }
.audit-list strong { color: #edf4ff; }
.audit-list small { color: #a4b8cf; font-size: 12px; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (max-width: 850px) {
  .account-shell .topbar { position: relative; flex-wrap: wrap; gap: 14px; }
  .account-shell .top-actions { width: 100%; }
  .account-feedback { top: 12px; }
  .auth-layout { grid-template-columns: 1fr; max-width: 600px; min-height: 0; gap: 20px; }
  .auth-layout .intro { padding: 14px 0; }
  .auth-layout .intro h1 { max-width: 18ch; font-size: 42px; }
  .account-settings-grid { grid-template-columns: 1fr; gap: 32px; }
  .account-settings-grid form + form { padding-top: 28px; border-top: 1px solid #293f55; }
}

@media (max-width: 600px) {
  .account-shell .page { width: calc(100% - 28px); padding-top: 18px; }
  .account-shell .topbar { padding: 14px; }
  .account-shell .top-actions { gap: 8px; }
  .account-shell .top-actions :is(.ghost, .secondary) { padding: 10px 12px; font-size: 13px; }
  .auth-layout .intro h1 { font-size: 36px; }
  .account-hero { min-height: 290px; padding: 26px 22px; }
  .account-horizon-art { object-position: 65% center; opacity: .35; mask-image: linear-gradient(90deg, transparent, #000); }
  .account-hero h1 { font-size: 38px; }
  .dashboard-portals { grid-template-columns: 1fr; gap: 14px; }
  .dashboard-portal { min-height: 175px; padding: 22px; }
  .dashboard-portal h2 { font-size: 23px; }
  .account-grid { gap: 20px; }
  .account-panel { padding: 22px; }
  .account-settings-grid form button { width: 100%; }
  .admin-section .top-actions { width: auto; }
  .audit-list article { flex-direction: column; gap: 6px; }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-portal:hover { transform: none; }
}
</style>
