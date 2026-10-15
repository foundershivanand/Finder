export interface PushToHubInput {
  id?: string;
  name: string;
  description: string;
  url?: string;
  tag?: string;
  status?: string;
  source?: string;
  sourceUrl?: string;
  thesis?: string;
  betterName?: string;
  blueprint?: string;
  vibeGuide?: Array<{
    step: number;
    title: string;
    why?: string;
    prompt?: string;
    doneWhen?: string;
  }>;
}

export interface PushToHubResult {
  ok: boolean;
  id: string;
  name: string;
  manageUrl: string;
  savedToTurso: boolean;
  error?: string;
}

const TURSO_PIPELINE_URL = "https://projectmanage-sh15a.aws-ap-south-1.turso.io/v2/pipeline";
const TURSO_AUTH_TOKEN =
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODk4ODMxMTUsImlkIjoiMDFhMGJkNTItY2YwMS03MDNhLTgwNTEtYTZhZTVkNGM2NjY3Iiwia2lkIjoiUEJVVXJDMUljTkFQVmc5WEwyNWlsa1Z1amVTUlFNM0Nqb202b0VvSHpNbyIsInJpZCI6IjY4MTg1NGY0LTZmOTktNDQzNS1hZGI5LTcwNDgyMDJjYjVlYSJ9.A1O5Bwuj3A_T7SvZvaYNv-Iem-iWq0v-GT7R49Rbldqvj0ID1qubk0wsAl1Yho_XI_BqbhuEOjUDZNl9SEdNDQ";
const PROJECT_MANAGE_BASE_URL = "https://project-manage-z6u.pages.dev";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

function normalizeTag(tag?: string): string {
  const t = (tag || "").toLowerCase();
  if (t.includes("game")) return "games";
  if (t.includes("saas") || t.includes("b2b")) return "saas";
  if (t.includes("tool") || t.includes("util") || t.includes("dev")) return "tool";
  if (t.includes("mobile") || t.includes("ios") || t.includes("android") || t.includes("app")) return "app";
  if (t.includes("fun") || t.includes("toy")) return "made-for-fun";
  return "web-app";
}

type TursoArg =
  | { type: "null" }
  | { type: "integer"; value: string }
  | { type: "text"; value: string };

function toArg(val: unknown): TursoArg {
  if (val === null || val === undefined) {
    return { type: "null" };
  }
  if (typeof val === "number") {
    return { type: "integer", value: String(val) };
  }
  return { type: "text", value: String(val) };
}

export async function pushIdeaToProjectHub(input: PushToHubInput): Promise<PushToHubResult> {
  const productName = (input.betterName || input.name).trim() || "Finder Idea";
  const rawId = input.id ? slugify(input.id) : slugify(productName);
  const productId = `finder-${rawId || Date.now()}`;
  const tag = normalizeTag(input.tag);
  const now = new Date().toISOString();

  let finalDescription = (input.thesis || input.description || "").trim();
  if (input.sourceUrl && !finalDescription.includes(input.sourceUrl)) {
    finalDescription = finalDescription
      ? `${finalDescription}\n\n[Mined from Finder: ${input.source || "Opportunity"}](${input.sourceUrl})`
      : `Mined from Finder: ${input.sourceUrl}`;
  }

  const projectUrl = input.url || input.sourceUrl || null;

  // Build the deep-link URL for Project Manage (keep params lightweight < 500 chars)
  const params = new URLSearchParams();
  params.set("action", "import-idea");
  params.set("id", productId);
  params.set("name", productName);
  if (finalDescription) params.set("desc", finalDescription.slice(0, 300));
  if (projectUrl) params.set("url", projectUrl);
  params.set("tag", tag);
  params.set("status", "idea");
  params.set("source", input.source || "Finder");
  if (input.sourceUrl) params.set("sourceUrl", input.sourceUrl);

  const manageUrl = `${PROJECT_MANAGE_BASE_URL}/?${params.toString()}`;

  // Execute Direct Database Sync to Turso (libSQL Pipeline HTTP API)
  let savedToTurso = false;
  try {
    const statements: Array<{ sql: string; args: TursoArg[] }> = [
      {
        sql: `INSERT INTO products (id, name, description, url, tag, status, sort_order, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, 'idea', 0, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                url = excluded.url,
                tag = excluded.tag,
                updated_at = excluded.updated_at;`,
        args: [
          toArg(productId),
          toArg(productName),
          toArg(finalDescription || null),
          toArg(projectUrl),
          toArg(tag),
          toArg(now),
          toArg(now),
        ],
      },
    ];

    // If vibe steps are included, insert tasks into Turso
    if (input.vibeGuide && input.vibeGuide.length > 0) {
      input.vibeGuide.slice(0, 10).forEach((step, idx) => {
        const taskId = `${productId}-vibe-${step.step}`;
        const title = `Step ${step.step}: ${step.title}`;
        statements.push({
          sql: `INSERT OR REPLACE INTO tasks (id, product_id, title, section, section_id, status, done, sort_order, created_at)
                VALUES (?, ?, ?, 'Finder Vibe Plan', 99, 'not_started', 0, ?, ?);`,
          args: [
            toArg(taskId),
            toArg(productId),
            toArg(title),
            toArg(idx),
            toArg(now),
          ],
        });
      });
    }

    const payload = {
      requests: statements.map((stmt) => ({
        type: "execute",
        stmt,
      })),
    };

    const res = await fetch(TURSO_PIPELINE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TURSO_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = (await res.json()) as { results?: Array<{ type: string; error?: unknown }> };
      const hasErrors = Array.isArray(data.results) && data.results.some((r) => r.type === "error");
      if (!hasErrors) {
        savedToTurso = true;
      } else {
        console.warn("[pushIdeaToProjectHub] Turso statement errors:", data.results);
      }
    } else {
      console.warn(`[pushIdeaToProjectHub] Turso returned ${res.status}`);
    }
  } catch (dbErr) {
    console.warn("[pushIdeaToProjectHub] Turso sync error:", dbErr);
  }

  return {
    ok: true,
    id: productId,
    name: productName,
    manageUrl,
    savedToTurso,
  };
}
