import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { FastifyInstance, FastifyReply } from "fastify";
import { requireAdmin } from "./auth.js";
import { getCompendiumQualityCorpus, type Article } from "./compendium.js";
import { pool } from "./db.js";

type JsonObject = Record<string, any>;
type ReviewStatus = "pending" | "approved" | "rework";
type Severity = "critical" | "warning" | "info";
type QualityIssue = {
  code: string;
  severity: Severity;
  label: string;
};

const RECENT_DAYS = 14;
const MEDIA_DIR =
  process.env.COMPENDIUM_MEDIA_DIR ??
  (process.env.NODE_ENV === "production"
    ? "/app/compendium-media"
    : resolve(process.cwd(), "../../compendium"));

function bad(reply: FastifyReply, error: string) {
  return reply.code(400).send({ error });
}

function mediaSource(media: unknown): string {
  if (typeof media === "string") return media.trim();
  if (media && typeof media === "object") {
    return String((media as JsonObject).src ?? "").trim();
  }
  return "";
}

function primaryMedia(article: Article): unknown {
  const direct = article.illustration ?? article.image ?? article.pnj?.portrait;
  if (direct) return direct;
  const gallery = Array.isArray(article.gallery) ? article.gallery : [];
  return gallery[0] ?? null;
}

function isPlaceholder(media: unknown): boolean {
  return /(?:equipment|augmentation|truth-(?:artifact|catalog))-placeholder\.svg(?:$|[?#])/i.test(
    mediaSource(media)
  );
}

function isPnj(article: Article): boolean {
  const dataset = String(article.dataset ?? "").toLowerCase();
  return (
    article.category === "Personnages" ||
    dataset.includes("pnj") ||
    Boolean(article.pnj && typeof article.pnj === "object")
  );
}

function hasMeaningfulBlocks(section: JsonObject | undefined): boolean {
  if (!section || !Array.isArray(section.blocks)) return false;
  return section.blocks.some((block: JsonObject) => {
    if (block?.type === "table") return Array.isArray(block.rows) && block.rows.length > 0;
    return String(block?.text ?? "").trim().length > 0;
  });
}

function pnjHasTruthHint(article: Article): boolean {
  const pnj = article.pnj ?? {};
  return Boolean(
    String(pnj.nom_verite ?? "").trim() ||
      String(pnj.race ?? "").trim() ||
      (Array.isArray(pnj.source_verite) && pnj.source_verite.length) ||
      (Array.isArray(pnj.hunter_source_verite) && pnj.hunter_source_verite.length)
  );
}

function pnjHasMjBlock(article: Article): boolean {
  return (article.sections ?? []).some(
    (section: JsonObject) => section?.audience === "mj" && hasMeaningfulBlocks(section)
  );
}

function pnjHasStatsBlock(article: Article): boolean {
  return (article.sections ?? []).some((section: JsonObject) => {
    const marker = String(section?.id ?? "") + " " + String(section?.title ?? "");
    return /profil[-_\s]*(?:stat|mec)|statisti|caract[eé]ristiques/i.test(marker) &&
      hasMeaningfulBlocks(section);
  });
}

function pnjNeedsEditorialCompletion(article: Article): boolean {
  if (!pnjHasStatsBlock(article) || pnjHasTruthHint(article) && !pnjHasMjBlock(article)) return true;
  const narrative = (article.sections ?? []).flatMap((section: JsonObject) => section.blocks ?? [])
    .filter((block: JsonObject) => block?.type === "p")
    .map((block: JsonObject) => String(block.text ?? "")).join(" ");
  return narrative.trim().length < 250;
}

function explicitTargets(article: Article): string[] {
  const raw = JSON.stringify(article);
  const targets = new Set<string>();
  const queryRe = /\/compendium\?article=([a-zA-Z0-9%_.~\-]+)/g;
  let match: RegExpExecArray | null;
  while ((match = queryRe.exec(raw))) {
    try {
      targets.add(decodeURIComponent(match[1]));
    } catch {
      targets.add(match[1]);
    }
  }
  const wikiIdRe = /data-wiki-id=\\?["']([^"'\\]+)\\?["']/g;
  while ((match = wikiIdRe.exec(raw))) targets.add(match[1]);
  return [...targets].filter(Boolean);
}

function safeMediaPath(value: string): string | null {
  const clean = value
    .replace(/\\/g, "/")
    .replace(/^\/?compendium\//, "")
    .replace(/^\/+/, "");
  if (!clean || clean.includes("\0") || clean.split("/").includes("..")) return null;
  if (!clean.startsWith("images/") && !clean.startsWith("assets/")) return null;
  return clean;
}

async function localMediaBroken(media: unknown): Promise<boolean> {
  const src = mediaSource(media);
  if (!src || /^(?:https?:|data:|blob:)/i.test(src)) return false;
  const relative = safeMediaPath(src);
  if (!relative) return false;
  try {
    await access(resolve(MEDIA_DIR, relative));
    return false;
  } catch {
    return true;
  }
}

async function ensureReviewRows(articleIds: string[]) {
  if (!articleIds.length) return;

  const count = await pool.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM compendium_review_state"
  );
  const firstBootstrap = Number(count.rows[0]?.count ?? 0) === 0;

  if (firstBootstrap) {
    await pool.query(
      [
        "INSERT INTO compendium_review_state (article_id, first_seen_at)",
        "SELECT unnest($1::text[]), now() - (($2::int + 1) * interval '1 day')",
        "ON CONFLICT (article_id) DO NOTHING"
      ].join("\n"),
      [articleIds, RECENT_DAYS]
    );
    return;
  }

  await pool.query(
    [
      "INSERT INTO compendium_review_state (article_id)",
      "SELECT unnest($1::text[])",
      "ON CONFLICT (article_id) DO NOTHING"
    ].join("\n"),
    [articleIds]
  );
}

async function reviewRows(articleIds: string[]) {
  if (!articleIds.length) return new Map<string, JsonObject>();
  const result = await pool.query<{
    articleId: string;
    firstSeenAt: string;
    reviewStatus: ReviewStatus;
    reviewNote: string | null;
    reviewedAt: string | null;
    reviewerName: string | null;
  }>(
    [
      "SELECT",
      "  s.article_id AS \"articleId\",",
      "  s.first_seen_at::text AS \"firstSeenAt\",",
      "  s.review_status AS \"reviewStatus\",",
      "  s.review_note AS \"reviewNote\",",
      "  s.reviewed_at::text AS \"reviewedAt\",",
      "  u.display_name AS \"reviewerName\"",
      "FROM compendium_review_state s",
      "LEFT JOIN users u ON u.id = s.reviewed_by",
      "WHERE s.article_id = ANY($1::text[])"
    ].join("\n"),
    [articleIds]
  );
  return new Map(result.rows.map((row) => [row.articleId, row]));
}

function issueList(
  article: Article,
  articleIds: Set<string>,
  navigationIds: Set<string>,
  publicById: Map<string, Article>,
  brokenMedia: boolean
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const media = primaryMedia(article);
  const pnj = isPnj(article);
  const imageTracked =
    pnj ||
    article.category === "Bestiaire" ||
    article.category === "Équipement & Objets";

  if (imageTracked && !mediaSource(media)) {
    issues.push({ code: "missing_media", severity: "warning", label: "Aucune image" });
  } else if (imageTracked && isPlaceholder(media)) {
    issues.push({ code: "placeholder_media", severity: "warning", label: "Image placeholder" });
  } else if (imageTracked && brokenMedia) {
    issues.push({ code: "broken_media", severity: "critical", label: "Image introuvable" });
  }

  if (pnj && pnjHasTruthHint(article) && !pnjHasMjBlock(article)) {
    issues.push({
      code: "pnj_missing_mj",
      severity: "warning",
      label: "Infos Vérité sans bloc MJ"
    });
  }

  if (pnj && !pnjHasStatsBlock(article)) {
    issues.push({
      code: "pnj_missing_stats",
      severity: "info",
      label: "Bloc de stats à compléter"
    });
  }

  if (pnj && article.pnj?.completeness === "portrait_only") {
    issues.push({ code: "pnj_portrait_only", severity: "warning", label: "Portrait seul · fiche à rédiger" });
  } else if (pnj && pnjNeedsEditorialCompletion(article)) {
    issues.push({ code: "pnj_partial", severity: "warning", label: "Fiche PNJ partielle · à vérifier" });
  }

  if (!navigationIds.has(article.id) && article.dataset !== "custom") {
    issues.push({
      code: "orphan_navigation",
      severity: "info",
      label: "Absent de la navigation"
    });
  }

  const publicArticle = publicById.get(article.id);
  if ((publicArticle?.sections ?? []).some((section: JsonObject) => section?.audience === "mj")) {
    issues.push({
      code: "mj_leak",
      severity: "critical",
      label: "Contenu MJ exposé au public"
    });
  }

  for (const target of explicitTargets(article)) {
    if (!articleIds.has(target)) {
      issues.push({
        code: "broken_reference",
        severity: "critical",
        label: "Lien interne cassé : " + target
      });
    }
  }

  return issues;
}

export async function registerQualityRoutes(app: FastifyInstance) {
  app.get("/api/admin/compendium-quality", async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) return;

    const corpus = await getCompendiumQualityCorpus();
    const articles = corpus.articles.filter((article) => article.category !== "OLD");
    const portraitLots = await readFile(resolve(MEDIA_DIR, "images/portraits/manifest.json"), "utf8")
      .then((content) => JSON.parse(content) as Record<string, { items?: Array<{ id: string; src: string; visibility: string }> }>)
      .catch(() => ({} as Record<string, { items?: Array<{ id: string; src: string; visibility: string }> }>));
    const portraits = new Map<string, Array<{ lot: string; media: string; visibility: string }>>();
    for (const [lot, group] of Object.entries(portraitLots)) {
      for (const portrait of group.items ?? []) portraits.set(portrait.id, [...(portraits.get(portrait.id) ?? []), { lot, media: portrait.src, visibility: portrait.visibility }]);
    }
    const ids = articles.map((article) => article.id);
    const idSet = new Set(ids);
    const articleById = new Map(articles.map((article) => [article.id, article]));
    const navigationIds = new Set(corpus.navigationIds);
    const publicById = new Map(
      corpus.publicArticles
        .filter((article) => article.category !== "OLD")
        .map((article) => [article.id, article])
    );

    await ensureReviewRows(ids);
    const reviews = await reviewRows(ids);

    const brokenMedia = new Map<string, boolean>();
    await Promise.all(
      articles.map(async (article) => {
        const tracked =
          isPnj(article) ||
          article.category === "Bestiaire" ||
          article.category === "Équipement & Objets";
        if (!tracked) return;
        const media = primaryMedia(article);
        if (!mediaSource(media) || isPlaceholder(media)) return;
        brokenMedia.set(article.id, await localMediaBroken(media));
      })
    );

    const items = articles.map((article) => {
      const navigation = article.navigation as JsonObject | undefined;
      const review = reviews.get(article.id) ?? {};
      const issues = issueList(
        article,
        idSet,
        navigationIds,
        publicById,
        brokenMedia.get(article.id) === true
      );
      if ((article.dataset === "equipement" || article.dataset === "verite-catalogue") && article.manufacturer && !article.brandLogo) {
        issues.push({ code: "missing_brand_logo", severity: "warning", label: `Logo fabricant à intégrer · ${article.manufacturer}` });
      }
      return {
        id: article.id,
        title: article.title ?? article.id,
        category: article.category ?? "",
        dataset: article.dataset ?? "",
        group: navigation?.group ?? "",
        subgroup: navigation?.subgroup ?? "",
        source: article.source ?? "",
        media: primaryMedia(article),
        portraits: portraits.get(article.id) ?? [],
        issues,
        firstSeenAt: review.firstSeenAt ?? null,
        reviewStatus: review.reviewStatus ?? "pending",
        reviewNote: review.reviewNote ?? null,
        reviewedAt: review.reviewedAt ?? null,
        reviewerName: review.reviewerName ?? null
      };
    });

    const recentCutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
    const countStatus = (status: ReviewStatus) =>
      items.filter((item) => item.reviewStatus === status).length;
    const countIssue = (code: string) =>
      items.filter((item) => item.issues.some((entry) => entry.code === code)).length;
    const countSeverity = (severity: Severity) =>
      items.reduce(
        (count, item) =>
          count + item.issues.filter((entry) => entry.severity === severity).length,
        0
      );

    return {
      generatedAt: new Date().toISOString(),
      recentWindowDays: RECENT_DAYS,
      summary: {
        total: items.length,
        pending: countStatus("pending"),
        approved: countStatus("approved"),
        rework: countStatus("rework"),
        recentPending: items.filter(
          (item) =>
            item.reviewStatus === "pending" &&
            item.firstSeenAt &&
            new Date(item.firstSeenAt).getTime() >= recentCutoff
        ).length,
        missingMedia: {
          pnj: items.filter(
            (item) =>
              isPnj(articleById.get(item.id) as Article) &&
              item.issues.some((entry) => entry.code === "missing_media")
          ).length,
          bestiary: items.filter(
            (item) =>
              item.category === "Bestiaire" &&
              item.issues.some((entry) => entry.code === "missing_media")
          ).length,
          equipment: items.filter(
            (item) =>
              item.category === "Équipement & Objets" &&
              item.issues.some((entry) => entry.code === "missing_media")
          ).length
        },
        placeholderMedia: countIssue("placeholder_media"),
        brokenMedia: countIssue("broken_media"),
        pnjMissingMj: countIssue("pnj_missing_mj"),
        pnjMissingStats: countIssue("pnj_missing_stats"),
        pnjPortraitOnly: countIssue("pnj_portrait_only"),
        pnjPartial: countIssue("pnj_partial"),
        orphanNavigation: countIssue("orphan_navigation"),
        brokenReferences: countIssue("broken_reference"),
        mjLeaks: countIssue("mj_leak"),
        bySeverity: {
          critical: countSeverity("critical"),
          warning: countSeverity("warning"),
          info: countSeverity("info")
        },
        editorConflicts: corpus.databaseEditSummary.conflicts,
        overrideConflicts: corpus.overrideSummary.conflicts,
        overrideMissing: corpus.overrideSummary.missing
      },
      items
    };
  });

  app.patch<{
    Params: { id: string };
    Body: { status?: string; note?: string | null };
  }>("/api/admin/compendium-quality/:id/review", async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) return;

    const id = String(request.params.id ?? "").trim();
    const status = String(request.body?.status ?? "").trim() as ReviewStatus;
    const note = request.body?.note == null ? null : String(request.body.note).trim();

    if (!id || id.length > 240) return bad(reply, "invalid_compendium_article_id");
    if (!["pending", "approved", "rework"].includes(status)) {
      return bad(reply, "invalid_compendium_review_status");
    }
    if (note && note.length > 2000) return bad(reply, "compendium_review_note_too_long");

    const corpus = await getCompendiumQualityCorpus();
    const article = corpus.articles.find((candidate) => candidate.id === id);
    if (!article || article.category === "OLD") {
      return reply.code(404).send({ error: "compendium_article_not_found" });
    }

    const reviewed = status !== "pending";
    const result = await pool.query<{
      articleId: string;
      firstSeenAt: string;
      reviewStatus: ReviewStatus;
      reviewNote: string | null;
      reviewedAt: string | null;
    }>(
      [
        "INSERT INTO compendium_review_state",
        "  (article_id, review_status, review_note, reviewed_by, reviewed_at, updated_at)",
        "VALUES ($1, $2, $3, $4, CASE WHEN $5 THEN now() ELSE NULL END, now())",
        "ON CONFLICT (article_id) DO UPDATE SET",
        "  review_status = EXCLUDED.review_status,",
        "  review_note = EXCLUDED.review_note,",
        "  reviewed_by = EXCLUDED.reviewed_by,",
        "  reviewed_at = EXCLUDED.reviewed_at,",
        "  updated_at = now()",
        "RETURNING",
        "  article_id AS \"articleId\",",
        "  first_seen_at::text AS \"firstSeenAt\",",
        "  review_status AS \"reviewStatus\",",
        "  review_note AS \"reviewNote\",",
        "  reviewed_at::text AS \"reviewedAt\""
      ].join("\n"),
      [id, status, note || null, reviewed ? admin.id : null, reviewed]
    );

    return {
      review: {
        ...result.rows[0],
        reviewerName: reviewed ? admin.displayName : null
      }
    };
  });
}
