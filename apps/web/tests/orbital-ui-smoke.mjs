import assert from "node:assert/strict";
import { chromium } from "playwright-core";

// Presentation tests only: all API responses are local fixtures. Server access
// rules and persistence are covered separately by the live V2 smoke tests.
const baseUrl = process.env.TUC_V2_SMOKE_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.CHROME_BIN;
if (!executablePath) throw new Error("CHROME_BIN manquant.");

const timestamp = "2026-09-23T10:00:00.000Z";
const characterId = "22222222-2222-4222-8222-222222222222";
const articleId = "orbital-audit-article";
const character = {
  id: characterId,
  name: "Alexandra des Archives de Grande Californie — enquêtes et exploration",
  data: {}, version: 3, createdAt: timestamp, updatedAt: timestamp
};
const article = {
  id: articleId, title: "Dossier de contrôle de la présentation", category: "Réalité",
  source: "Fixture UI", status: "canon_recent", tags: ["California"],
  sections: [{ id: "introduction", title: "Présentation", level: 2,
    blocks: [{ type: "p", text: "Une entrée de contrôle, sans modification du corpus." }] }]
};
const coverage = {
  summary: { total: 1, linked: 1, missing: 0, ambiguous: 0 },
  families: [{ family: "origins", total: 1, linked: 1, missing: 0, ambiguous: 0 }],
  items: []
};
const quality = {
  generatedAt: timestamp, recentWindowDays: 14,
  summary: {
    total: 1, pending: 1, approved: 0, rework: 0, recentPending: 1,
    missingMedia: { pnj: 0, bestiary: 0, equipment: 0 }, placeholderMedia: 0,
    brokenMedia: 0, pnjMissingMj: 0, pnjMissingStats: 0, orphanNavigation: 0,
    brokenReferences: 0, mjLeaks: 0, bySeverity: { critical: 0, warning: 0, info: 0 },
    editorConflicts: 0, overrideConflicts: 0, overrideMissing: 0
  },
  items: [{ ...article, dataset: "fixture", group: "Grande Californie & société",
    subgroup: "Institutions", media: null, issues: [], firstSeenAt: timestamp,
    reviewStatus: "pending", reviewNote: null, reviewedAt: null, reviewerName: null }]
};

const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-sandbox"] });
let checkedScreens = 0;

async function assertLayout(page, label, headingSelector = "main h1") {
  await page.waitForFunction(() => !document.documentElement.classList.contains("route-changing"));
  const result = await page.evaluate(selector => {
    const root = document.documentElement;
    const heading = document.querySelector(selector);
    const main = document.querySelector("main");
    const headingStyle = heading ? getComputedStyle(heading) : null;
    return {
      viewport: root.clientWidth,
      width: Math.max(root.scrollWidth, document.body.scrollWidth),
      mainWidth: main?.getBoundingClientRect().width || 0,
      headingFont: headingStyle?.fontFamily || "",
      headingText: heading?.textContent?.trim() || "",
      offenders: [...document.querySelectorAll("body *")].filter(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 1 || getComputedStyle(element).position === "fixed") return false;
        if (element.closest('[aria-hidden="true"], [inert], .quality-table-wrap, .table-wrap')) return false;
        return rect.right > root.clientWidth + 2;
      }).slice(0, 8).map(element => element.tagName + "." + element.className)
    };
  }, headingSelector);
  assert.ok(result.width <= result.viewport + 2,
    `${label}: débordement horizontal ${result.width}/${result.viewport}px (${result.offenders.join(", ")}).`);
  assert.ok(result.mainWidth > 250, `${label}: contenu principal comprimé.`);
  if (result.headingText) {
    assert.ok(!/Georgia|Times New Roman/i.test(result.headingFont),
      `${label}: ancienne typographie sur « ${result.headingText} » (${result.headingFont}).`);
  }
  checkedScreens++;
}

async function assertKeyboardFocus(page, start) {
  await start.focus();
  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const element = document.activeElement;
    const style = element ? getComputedStyle(element) : null;
    return {
      tag: element?.tagName,
      hidden: Boolean(element?.closest('[aria-hidden="true"], [inert], dialog:not([open])')),
      outline: Boolean(style && style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 1)
    };
  });
  assert.ok(focus.tag && focus.tag !== "BODY", "Le parcours clavier doit atteindre un contrôle.");
  assert.equal(focus.hidden, false, "Le focus ne doit pas entrer dans un panneau fermé.");
  assert.equal(focus.outline, true, "Le contrôle atteint au clavier doit avoir un focus visible.");
}

try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(12000);
    const errors = [];
    const unhandled = [];
    let role = "public";
    let gmRequest = null;
    const fixtureUser = userRole => ({
      id: "ui-audit-" + userRole,
      email: "alexandra.archiviste.grande.californie@example.test",
      displayName: "Alexandra des Archives de Grande Californie",
      role: userRole, active: true, createdAt: timestamp, lastLoginAt: timestamp
    });
    page.on("pageerror", error => errors.push(String(error)));
    await page.route("**/api/**", async route => {
      const request = route.request();
      const path = new URL(request.url()).pathname;
      const method = request.method();
      const send = (body, status = 200) => route.fulfill({ status,
        contentType: "application/json", body: JSON.stringify(body) });
      const requireRole = allowed => !allowed.includes(role)
        ? send({ error: role === "public" ? "authentication_required" : "editor_required" }, role === "public" ? 401 : 403)
        : null;
      if (path === "/api/health") return send({ status: "ok" });
      if (path === "/api/auth/setup-status") return send({ setupRequired: false });
      if (path === "/api/auth/capabilities") return send({ passwordResetAvailable: true });
      if (path === "/api/auth/me") return role === "public"
        ? send({ error: "authentication_required" }, 401) : send({ user: fixtureUser(role) });
      if (path === "/api/auth/login") return send({ error: "invalid_credentials" }, 401);
      if (path === "/api/auth/gm-request" && method === "GET") return send({ request: gmRequest });
      if (path === "/api/auth/gm-request" && method === "POST") {
        gmRequest = { id: "gm-request-fixture", userId: "ui-audit-player", status: "pending",
          comment: request.postDataJSON().comment, createdAt: timestamp, decidedAt: null };
        return send({ request: gmRequest }, 201);
      }
      if (path === "/api/admin/gm-requests") return send({ requests: gmRequest?.status === "pending"
        ? [{ ...fixtureUser("player"), ...gmRequest }] : [] });
      if (path === "/api/admin/gm-requests/gm-request-fixture/decision" && method === "POST") {
        gmRequest = { ...gmRequest, status: request.postDataJSON().decision, decidedAt: timestamp };
        return send({ request: gmRequest });
      }
      if (path === "/api/characters") return send({ characters: [character] });
      if (path === `/api/characters/${characterId}/revisions`) return send({ revisions: [
        { revision: 3, name: character.name, reason: "saved", createdAt: timestamp },
        { revision: 2, name: "Alexandra", reason: "created", createdAt: timestamp }
      ] });
      if (path === "/api/admin/users") return send({ users: [fixtureUser("admin"), fixtureUser("player")] });
      if (path === "/api/admin/audit") return send({ events: [{ id: "audit-fixture", action: "user_role_changed",
        actorName: "Administrateur", targetName: "Alexandra", targetEmail: null,
        beforeState: { role: "player" }, afterState: { role: "editor" }, createdAt: timestamp }] });
      if (path === "/api/admin/compendium-quality") return role === "admin" ? send(quality)
        : send({ error: role === "public" ? "authentication_required" : "admin_required" }, role === "public" ? 401 : 403);
      if (path === "/api/compendium/editor/builder-coverage") return requireRole(["editor", "admin"]) || send(coverage);
      if (path === `/api/compendium/editor/articles/${articleId}` && method === "GET") {
        return requireRole(["editor", "admin"]) || send({ article, draft: null, conflict: false,
          draftUpdatedAt: null, publishedAt: timestamp });
      }
      if (path === `/api/compendium/editor/builder-source/${articleId}`) return send({ records: [] });
      unhandled.push(`${method} ${path}`);
      return send({ error: "orbital_smoke_unhandled_route" }, 404);
    });

    await page.goto(baseUrl + "/account", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Se connecter", exact: true }).waitFor();
    await assertLayout(page, `Connexion ${width}`);
    await assertKeyboardFocus(page, page.getByLabel("E-mail", { exact: true }));
    await page.getByLabel("E-mail", { exact: true }).fill("fixture@example.test");
    await page.getByLabel("Mot de passe", { exact: true }).fill("not-a-real-password");
    await page.getByRole("button", { name: "Se connecter", exact: true }).click();
    await page.getByText("E-mail ou mot de passe incorrect.", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Créer un compte", exact: true }).click();
    await page.getByLabel("Confirmer le mot de passe", { exact: true }).waitFor();
    await assertLayout(page, `Inscription ${width}`);
    await page.getByRole("button", { name: "Connexion", exact: true }).click();
    await page.getByRole("button", { name: "Mot de passe oublié ?", exact: true }).click();
    await page.getByRole("heading", { name: "Retrouver mon accès", exact: true }).waitFor();
    await assertLayout(page, `Récupération du compte ${width}`);
    await page.goto(baseUrl + "/account?reset=ui-layout-fixture", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Nouveau mot de passe", exact: true }).waitFor();
    await assertLayout(page, `Réinitialisation du mot de passe ${width}`);

    role = "player";
    await page.goto(baseUrl + "/account", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Fiches sauvegardées", exact: true }).waitFor();
    await page.getByLabel("Nom du personnage", { exact: true }).waitFor();
    assert.equal(await page.getByRole("heading", { name: "Gestion des comptes", exact: true }).count(), 0,
      "Les outils administrateur ne doivent pas être proposés au Joueur.");
    await assertLayout(page, `Compte Joueur et fiche longue ${width}`);
    const gmPanel = page.locator(".gm-access-panel");
    await page.getByRole("button", { name: "Demander l’accès MJ", exact: true }).waitFor();
    assert.ok((await gmPanel.innerText()).includes("l’accès aux secrets de l’univers et aux outils MJ"));
    await page.locator("#gm-comment").fill("Je souhaite mener une campagne pour notre groupe de joueurs.");
    await assertKeyboardFocus(page, page.locator("#gm-comment"));
    await assertLayout(page, `Demande MJ ${width}`);
    await page.getByRole("button", { name: "Demander l’accès MJ", exact: true }).click();
    await page.getByText("En attente de validation", { exact: true }).waitFor();
    assert.equal(await page.locator("#gm-comment").count(), 0, "Pas de nouvelle demande pendant l’attente.");
    await assertLayout(page, `Demande MJ en attente ${width}`);
    await assertKeyboardFocus(page, page.getByLabel("Nom affiché", { exact: true }));
    assert.ok((await page.getByRole("link", { name: "Ouvrir le Builder", exact: true }).getAttribute("href"))
      ?.endsWith(`/characters/${characterId}/builder`), "Le Builder doit ouvrir la fiche sélectionnée.");

    role = "admin";
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Gestion des comptes", exact: true }).waitFor();
    await page.getByRole("heading", { name: "Journal administrateur", exact: true }).waitFor();
    await assertLayout(page, `Compte Administrateur ${width}`);
    await page.getByRole("link", { name: "1 demande MJ en attente ↓", exact: true }).waitFor();
    const approve = page.getByRole("button", { name: "Accepter la demande MJ de Alexandra des Archives de Grande Californie", exact: true });
    await approve.waitFor();
    for (const button of await page.locator(".gm-request-actions button").all()) {
      assert.ok((await button.boundingBox()).height >= 44, "Les décisions MJ doivent garder une cible tactile de 44 px.");
    }
    await assertLayout(page, `Validation MJ ${width}`);
    page.once("dialog", dialog => dialog.accept());
    await approve.click();
    await page.getByText("Aucune demande en attente.", { exact: true }).waitFor();
    await page.getByRole("link", { name: "0 demande MJ en attente ↓", exact: true }).waitFor();
    // A client-side transition also exercises the shared stylesheet cascade.
    await page.getByRole("link", { name: "Contrôle qualité", exact: true }).click();
    await page.getByRole("heading", { name: "Recette du Compendium", exact: true }).waitFor();
    const qualityEntry = page.locator(".entry-copy").getByText(article.title, { exact: true });
    await qualityEntry.waitFor();
    await assertLayout(page, `Recette après Mon espace ${width}`);
    const search = page.locator(".filters").getByRole("searchbox");
    await search.fill("aucun résultat de cette fixture");
    await qualityEntry.waitFor({ state: "detached" });
    await page.getByRole("button", { name: "Réinitialiser", exact: true }).click();
    await qualityEntry.waitFor();
    await assertKeyboardFocus(page, search);
    const reviewButton = page.locator(".action-cell").getByRole("button", { name: "À revoir", exact: true });
    await reviewButton.click();
    const reviewDialog = page.getByRole("dialog", { name: "À revoir", exact: true });
    await reviewDialog.waitFor();
    await reviewDialog.getByLabel("Ce qui doit être corrigé", { exact: true }).fill("Note de test annulée.");
    await assertLayout(page, `Retour de recette ${width}`);
    await page.keyboard.press("Escape");
    await reviewDialog.waitFor({ state: "hidden" });
    assert.equal(await reviewButton.evaluate(element => element === document.activeElement), true,
      "Fermer le retour de recette doit rendre le focus au bouton d’origine.");
    await page.locator(".quality-topbar").getByRole("link", { name: /Compte|Mon espace/ }).click();
    await page.getByRole("heading", { name: "Fiches sauvegardées", exact: true }).waitFor();
    await assertLayout(page, `Retour Mon espace après Recette ${width}`);

    role = "editor";
    await page.goto(baseUrl + "/compendium/new", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Titre", { exact: true }).waitFor();
    await assertLayout(page, `Nouvelle page ${width}`, ".editor-heading h1");
    await page.getByLabel("Titre", { exact: true }).fill("Nouvelle page de contrôle");
    await page.locator("textarea.wiki-source").fill("== Repères ==\nUn aperçu lisible avant publication.");
    await page.locator(".editor-preview-column").getByRole("heading", { name: "Repères", exact: true }).waitFor();
    await assertLayout(page, `Aperçu éditeur ${width}`, ".editor-heading h1");
    await page.goto(baseUrl + "/compendium/edit/" + articleId, { waitUntil: "domcontentloaded" });
    await page.locator(".editor-heading").getByRole("heading", { name: article.title, exact: true }).waitFor();
    await assertLayout(page, `Édition de page ${width}`, ".editor-heading h1");
    const coverageButton = page.getByRole("button", { name: /Couverture Builder/ });
    await assertKeyboardFocus(page, coverageButton);
    await coverageButton.click();
    await page.locator(".coverage-drawer").getByText("Couverture complète", { exact: true }).waitFor();
    await assertLayout(page, `Tiroir de couverture ${width}`, ".editor-heading h1");
    await page.keyboard.press("Escape");
    await page.locator(".coverage-drawer").waitFor({ state: "hidden" });
    assert.equal(await coverageButton.getAttribute("aria-expanded"), "false");
    assert.equal(await coverageButton.evaluate(element => element === document.activeElement), true,
      "Fermer la couverture doit rendre le focus à son déclencheur.");

    for (const deniedRole of ["public", "player"]) {
      role = deniedRole;
      await page.goto(baseUrl + "/admin/quality", { waitUntil: "domcontentloaded" });
      await page.getByText(role === "public" ? "Connexion requise." : "Cette page est réservée aux administrateurs.",
        { exact: true }).waitFor();
      assert.equal(await page.locator(".quality-table").count(), 0);
      await assertLayout(page, `Recette accès refusé ${role} ${width}`);
      await page.goto(baseUrl + "/compendium/edit/" + articleId, { waitUntil: "domcontentloaded" });
      await page.getByText(role === "public" ? "Connexion requise." : "Cette page est réservée aux éditeurs et administrateurs.",
        { exact: true }).waitFor();
      assert.equal(await page.locator("textarea.wiki-source").count(), 0);
      await assertLayout(page, `Éditeur accès refusé ${role} ${width}`);
      await page.goto(baseUrl + "/compendium/new", { waitUntil: "domcontentloaded" });
      await page.getByText(role === "public" ? "Connexion requise." : "Cette page est réservée aux éditeurs et administrateurs.",
        { exact: true }).waitFor();
      assert.equal(await page.locator("textarea.wiki-source").count(), 0,
        "La création ne doit pas inviter à saisir un texte impossible à enregistrer.");
      await assertLayout(page, `Nouvelle page accès refusé ${role} ${width}`);
    }
    assert.deepEqual(unhandled, [], "Requêtes non couvertes par les fixtures UI.");
    assert.deepEqual(errors, [], "Erreurs JavaScript pendant les parcours UI.");
    await page.close();
  }
  console.log(`ORBITAL UI OK — ${checkedScreens} écrans à 1440/390px · connexion/inscription/récupération · comptes Joueur/admin · Recette · éditeur/aperçu/couverture · réponses 401/403 · reflow et focus clavier.`);
} finally {
  await browser.close();
}
