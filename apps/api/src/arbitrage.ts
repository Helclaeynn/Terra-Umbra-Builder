import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import type { FastifyInstance } from "fastify";
import { requireAdmin } from "./auth.js";

type JsonObject = Record<string, any>;
type Audience = "public" | "mj" | "mixed" | "unknown";

type TaxonomyKind =
  | "contradiction"
  | "fiche_lacunaire"
  | "visibilite_public_mj"
  | "identite_doublon"
  | "chronologie"
  | "terme_orthographe"
  | "regle_mecanique"
  | "quantification"
  | "portee_contexte";

type ReviewPage = {
  id: string;
  title?: string;
  category?: string;
  dataset?: string;
  audience?: Audience;
  sections?: Array<{ id?: string; title?: string; anchor?: string; audience?: Audience }>;
  semanticSummary?: string;
  candidateReferences?: string[];
  ambiguities?: string[];
  editorialFindings?: string[];
  semanticReading?: {
    ambiguities?: string[];
    editorialFindings?: string[];
    candidateReferences?: string[];
    semanticSummary?: string;
    tagDecision?: string;
  };
};

const ARBITRAGE_FILE =
  process.env.COMPENDIUM_ARBITRAGE_FILE ??
  resolve(process.cwd(), "../../compendium/source/wiki-taxonomy-arbitrage-v1.json.gz");

const TAXONOMY: Record<TaxonomyKind, { label: string; explanation: string }> = {
  contradiction: {
    label: "Informations contradictoires",
    explanation: "Deux énoncés, dates, rôles ou versions ne peuvent pas être retenus simultanément sans préciser leur périmètre."
  },
  fiche_lacunaire: {
    label: "Fiche lacunaire ou vide",
    explanation: "La fiche ne fournit pas assez d’éléments pour publier, relier ou statuer sans compléter la source."
  },
  visibilite_public_mj: {
    label: "Visibilité public / MJ",
    explanation: "Le constat porte sur une information qui peut révéler une identité, une nature, un lien ou un secret MJ au mauvais public."
  },
  identite_doublon: {
    label: "Identité, alias ou doublon",
    explanation: "Le texte rapproche des noms, alias, lignées ou organisations sans dire s’il s’agit d’une même fiche ou de personnes distinctes."
  },
  chronologie: {
    label: "Chronologie ou succession",
    explanation: "Les dates, âges, fondations, successions ou états ‘actuel/ancien’ ne s’alignent pas encore."
  },
  terme_orthographe: {
    label: "Terme, graphie ou casse",
    explanation: "Un même terme apparaît sous plusieurs graphies, accents, traductions ou capitales ; le lien automatique pourrait viser la mauvaise entrée."
  },
  regle_mecanique: {
    label: "Règle, profil ou mécanique",
    explanation: "Le texte narratif, le profil chiffré ou la règle ne donnent pas la même portée ; une correction modifierait le jeu ou le lien vers les règles."
  },
  quantification: {
    label: "Nombre ou périmètre quantifié",
    explanation: "Un total, une liste, un nombre de membres ou une portée est annoncé de façon incompatible ou incomplète."
  },
  portee_contexte: {
    label: "Portée ou contexte à préciser",
    explanation: "Le constat est compréhensible mais son domaine d’application, son statut de rumeur, son exception ou son niveau de généralité n’est pas fixé."
  }
};

function text(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function sectionContext(page: ReviewPage, sectionIds: string[]): Array<{ id: string; title: string; anchor: string; audience: Audience }> {
  const byId = new Map((page.sections ?? []).map((section) => [text(section.id), section]));
  return sectionIds.map((id) => {
    const section = byId.get(id);
    return {
      id,
      title: text(section?.title) || id,
      anchor: text(section?.anchor) || `wiki-section-${id}`,
      audience: section?.audience ?? page.audience ?? "unknown"
    };
  });
}

function classify(value: string): TaxonomyKind {
  const lower = value.toLocaleLowerCase("fr");
  if (/(mj|public|publique|publi[cq]|masqu|visibil|aperçu|révéler l'identit|identit.{0,16}secret|expos.{0,24}(?:joueur|public|mj|secret|identit))/i.test(lower)) return "visibilite_public_mj";
  if (/(contradiction|incoh|contre|alors que|tandis que|versus|diffère|diffèrent|varie|oppos|annonce.{0,24}(mais|versus)|conflit|incompatible)/i.test(lower)) return "contradiction";
  if (/(absence totale|absent|absence|vide|incomplet|incomplète|inachev|coup[ée]|presque uniquement|une seule phrase|une ligne|sans (expliquer|description|décrire|nom)|non décrit|peu décrit|fiche à rédiger|portrait seul|manque|lacune)/i.test(lower)) return "fiche_lacunaire";
  if (/(date|chronolog|succession|fondation|futur|203[0-9]|202[0-9]|201[0-9]|âge|age|naissance|mort|décès|devenu|devenue|nommé|nommée|remplac|depuis|jusqu)/i.test(lower)) return "chronologie";
  if (/(nombre|chiffre|total|liste de|sièges|sieges|membres|pourcentage|proportion|combien|effectif|\d+\s*(?:pages?|profils?|membres?|sièges?|personnes?))/i.test(lower)) return "quantification";
  if (/(compétence|competence|profil|stat|mécanique|mecanique|règle|regle|armure|talent|don |d[oô]n |puissance|difficulté|difficulte|valeur|tir|pugilat|mêlée|melee|pa propre|points? d’action|points? action|proximité|proximite|entrée dans l’organisme|entree dans l.organisme|germe|exposition|infection|contamination)/i.test(lower)) return "regle_mecanique";
  if (/(orthograph|graphie|casse|accent|appellation|nom à harmoniser|nom a harmoniser|variante|faute|coquille|écriture|ecriture|sehdia|gonzález|gonzalez)/i.test(lower)) return "terme_orthographe";
  if (/(alias|identité.{0,24}(?:publique|réelle|vérité|cachée|secrète)|deux personnes|plusieurs ident|distincte?s?|ne pas assimiler|pas automatiquement|synonyme|fusionner|même personne|meme personne|homonyme|doublon)/i.test(lower)) return "identite_doublon";
  return "portee_contexte";
}

function audienceOf(page: ReviewPage, sections: Array<{ audience: Audience }>): Audience {
  const values = new Set(sections.map((section) => section.audience).filter(Boolean));
  if (values.has("mj") && values.has("public")) return "mixed";
  if (values.has("mj")) return "mj";
  if (values.has("public")) return "public";
  return page.audience ?? "unknown";
}

function opposedParts(value: string): string[] {
  const match = value.match(/^(.{20,220}?)\s+(?:contre|alors que|tandis que|versus|mais|plutôt que|versus)\s+(.{20,260})$/i);
  if (!match) return [];
  return [match[1].trim(), match[2].trim()];
}

function decisionModel(kind: TaxonomyKind, observation: string, title: string): { question: string; options: Array<{ key: string; label: string }>; impact: string } {
  const parts = opposedParts(observation);
  const pair = parts.length === 2 ? ` (« ${parts[0]} » ou « ${parts[1]} »)` : "";
  if (/(germe|pa propre|points? d’action|points? action|proximité|proximite|entrée dans l’organisme|entree dans l.organisme)/i.test(observation)) {\n    return {\n      question: `Quelle règle d’activation doit faire foi pour le germe de « ${title} » ?`,\n      options: [\n        { key: "A", label: "Entrée dans un organisme obligatoire ; aucun coût de PA propre n’est ajouté au germe." },\n        { key: "B", label: "Une action par proximité est possible ; préciser le coût de PA et la portée." },\n        { key: "C", label: "Conserver le texte descriptif et documenter la mécanique avant de la publier." }\n      ],\n      impact: "Fonctionnement de la créature, activation en scène, coût en PA et résolution des combats."\n    };\n  }\n  if (/(profil|statistique).{0,80}(compétence|competence).{0,100}(zéro|zero|biographie|corps à corps|combat|tir|pugilat|mêlée|melee)/i.test(observation)) {
    return {
      question: `Les compétences de combat de « ${title} » doivent-elles être corrigées pour correspondre à la biographie ?`,
      options: [
        { key: "A", label: "Oui : renseigner / recalculer Tir, Pugilat et Mêlée à partir de la biographie validée." },
        { key: "B", label: "Non : conserver les zéros ; la biographie reste narrative et non mécanique." },
        { key: "C", label: "Conserver les valeurs actuelles et ajouter une note MJ expliquant l’écart." }
      ],
      impact: "Profil PNJ, difficulté en scène et cohérence entre biographie, compétences et générateur."
    };
  }
  switch (kind) {
    case "contradiction":
      return { question: `Quelle version doit faire foi pour « ${title} »${pair} ?`, options: [{ key: "A", label: "Retenir la première version explicitement documentée." }, { key: "B", label: "Retenir la seconde version explicitement documentée." }, { key: "C", label: "Conserver les deux en distinguant époque, lieu ou point de vue." }], impact: "Texte canonique, résumé et liens vers les fiches concernées." };
    case "fiche_lacunaire":
      return { question: `Que fait-on de la fiche « ${title} » tant que l’information manque ?`, options: [{ key: "A", label: "Compléter à partir d’une source identifiée avant publication." }, { key: "B", label: "Publier comme fiche lacunaire, sans rien inventer." }, { key: "C", label: "Retirer la fiche de la navigation jusqu’à réception d’une source." }], impact: "Navigation, statut de publication et éventuels liens entrants." };
    case "visibilite_public_mj":
      return { question: `À qui cette information doit-elle être visible dans « ${title} » ?`, options: [{ key: "A", label: "Public / joueurs : l’information est canonique et révélable." }, { key: "B", label: "MJ uniquement : conserver le secret et masquer le lien public." }, { key: "C", label: "Ne pas publier tant que l’audience n’est pas tranchée." }], impact: "Sécurité MJ, aperçu de lien et recherche du Compendium." };
    case "identite_doublon":
      return { question: `Ces noms ou rôles désignent-ils la même entrée dans « ${title} » ?`, options: [{ key: "A", label: "Oui : fusionner sous une fiche canonique et conserver les alias." }, { key: "B", label: "Non : créer ou conserver des fiches distinctes." }, { key: "C", label: "Alias conditionnel : relier seulement avec le contexte indiqué." }], impact: "Identifiants, liens croisés, mini-fiches et risque de révélation MJ." };
    case "chronologie":
      return { question: `Comment résoudre la chronologie de « ${title} » ?`, options: [{ key: "A", label: "Retenir la date ou succession la plus récente / explicitement canonique." }, { key: "B", label: "Retenir l’ancienne version et marquer la nouvelle comme erreur." }, { key: "C", label: "Conserver deux périodes en les rattachant à des phases distinctes." }], impact: "Biographies, titres actuels, liens de succession et cohérence des fiches." };
    case "terme_orthographe":
      return { question: `Quelle forme doit servir d’identifiant et de libellé pour « ${title} » ?`, options: [{ key: "A", label: "Normaliser vers la graphie canonique et garder les variantes comme alias." }, { key: "B", label: "Conserver les graphies distinctes car elles désignent des entrées différentes." }, { key: "C", label: "Laisser le texte source intact et désambiguïser seulement le lien." }], impact: "Recherche, URL, ancres et liens automatiques." };
    case "regle_mecanique":
      return { question: `Le profil ou la règle de « ${title} » doit-il être modifié pour correspondre au texte ?`, options: [{ key: "A", label: "Oui : corriger les valeurs / règles et recalculer les dépendances." }, { key: "B", label: "Non : le texte est narratif, le profil actuel fait foi." }, { key: "C", label: "Conserver les valeurs et ajouter une note MJ explicite." }], impact: "Jouabilité, générateur, fiches PNJ et liens vers les règles." };
    case "quantification":
      return { question: `Quel périmètre numérique faut-il retenir pour « ${title} » ?`, options: [{ key: "A", label: "Corriger le total pour qu’il corresponde à la liste détaillée." }, { key: "B", label: "Conserver le total annoncé et considérer la liste comme partielle." }, { key: "C", label: "Publier le périmètre comme estimation / ordre de grandeur." }], impact: "Tableaux, compteurs, organigrammes et attentes de complétude." };
    default:
      return { question: `Quelle portée doit être retenue pour le constat de « ${title} » ?`, options: [{ key: "A", label: "Appliquer l’interprétation la plus étroite explicitement documentée." }, { key: "B", label: "Étendre l’interprétation au groupe / cas général." }, { key: "C", label: "Conserver le cas comme exception et documenter sa limite." }], impact: "Résumé, tags, liens proposés et règles de recherche." };
  }
}

let payloadPromise: Promise<unknown> | null = null;

async function readArbitrageSource(): Promise<JsonObject> {
  const buffer = await readFile(ARBITRAGE_FILE);
  const source = ARBITRAGE_FILE.endsWith(".gz") ? gunzipSync(buffer).toString("utf8") : buffer.toString("utf8");
  return JSON.parse(source) as JsonObject;
}

export async function loadArbitragePayload() {
  if (!payloadPromise) {
    payloadPromise = readArbitrageSource().then((review) => {
      const items: JsonObject[] = [];
      for (const page of (review.pages ?? []) as ReviewPage[]) {
        const sections = (page.sections ?? []).map((section) => ({
          id: text(section.id), title: text(section.title) || text(section.id), anchor: text(section.anchor) || `wiki-section-${text(section.id)}`, audience: section.audience ?? page.audience ?? "unknown"
        }));
        const reading = page;
        const sourceBase = {
          pageId: page.id,
          title: text(page.title) || page.id,
          category: text(page.category) || "Non classé",
          dataset: text(page.dataset),
          audience: audienceOf(page, sections),
          sections,
          summary: text(reading.semanticSummary),
          references: Array.isArray(reading.candidateReferences) ? reading.candidateReferences.map(text).filter(Boolean) : []
        };
        for (const [sourceType, values] of [["ambiguity", reading.ambiguities ?? []], ["editorial", reading.editorialFindings ?? []]] as const) {
          (values as unknown[]).map(text).filter(Boolean).forEach((observation, index) => {
            const kind = classify(observation);
            const decision = decisionModel(kind, observation, sourceBase.title);
            const id = `${sourceBase.pageId}:${sourceType}:${index + 1}`;
            items.push({ id, sourceType, ...sourceBase, kind, kindLabel: TAXONOMY[kind].label, whyUnclear: TAXONOMY[kind].explanation, observation, opposedParts: opposedParts(observation), question: decision.question, options: decision.options, impact: decision.impact });
          });
        }
      }
      const byKind = Object.fromEntries(Object.keys(TAXONOMY).map((key) => [key, items.filter((item) => item.kind === key).length]));
      const byAudience = Object.fromEntries(["public", "mj", "mixed", "unknown"].map((key) => [key, items.filter((item) => item.audience === key).length]));
      return {
        generatedAt: new Date().toISOString(),
        sourceCommit: text(review.sourceCommit),
        coverage: review.coverage ?? {},
        summary: { total: items.length, pages: new Set(items.map((item) => item.pageId)).size, byKind, byAudience },
        taxonomy: Object.entries(TAXONOMY).map(([key, value]) => ({ key, ...value })),
        items
      };
    });
  }
  return payloadPromise;
}

export async function registerArbitrageRoutes(app: FastifyInstance) {
  app.get("/api/admin/compendium-arbitrage", async (request, reply) => {
    const admin = await requireAdmin(request, reply);
    if (!admin) return;
    try {
      return await loadArbitragePayload();
    } catch (error) {
      request.log.error(error, "Unable to load compendium arbitrage source");
      return reply.code(500).send({ error: "compendium_arbitrage_source_unavailable" });
    }
  });
}
