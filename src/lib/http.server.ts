type CacheEntry<T> = { at: number; value: T };
const cache = new Map<string, CacheEntry<unknown>>();

export const UA = "Riposte/1.0 (https://grok.com; product research desk)";
export const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

export function readCache<T>(key: string, ttlMs: number): T | null {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (!hit) return null;
  if (Date.now() - hit.at > ttlMs) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

export function writeCache<T>(key: string, value: T): T {
  cache.set(key, { at: Date.now(), value });
  return value;
}

export async function fetchText(
  url: string,
  opts: { timeoutMs?: number; maxBytes?: number; headers?: Record<string, string>; ua?: string } = {},
): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": opts.ua ?? UA,
        Accept: "text/html,application/json,application/xml;q=0.9,*/*;q=0.8",
        ...opts.headers,
      },
      signal: AbortSignal.timeout(opts.timeoutMs ?? 8_000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const cap = opts.maxBytes ?? 400_000;
    const slice = buf.byteLength > cap ? buf.slice(0, cap) : buf;
    return new TextDecoder("utf-8", { fatal: false }).decode(slice);
  } catch {
    return null;
  }
}

export async function fetchJson(
  url: string,
  opts?: { timeoutMs?: number; ua?: string; maxBytes?: number },
): Promise<unknown | null> {
  const text = await fetchText(url, {
    timeoutMs: opts?.timeoutMs ?? 10_000,
    ua: opts?.ua,
    maxBytes: opts?.maxBytes,
    headers: { Accept: "application/json" },
  });
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export function decodeEntities(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/&#39;|'/gi, "'")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(Number.parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

export function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

export const ZERO_REVENUE = { last30Days: 0, mrr: 0, total: 0 };
