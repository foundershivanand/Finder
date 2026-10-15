import type { DeskKind, RiposteBrief, Revenue } from "./types";

const KEY = "riposte.saved.v2";
const LEGACY = "riposte.saved.v1";

export type SavedBrief = {
  savedAt: string;
  brief: RiposteBrief;
  profile: {
    kind?: DeskKind;
    id?: string;
    slug: string;
    name: string;
    icon: string | null;
    category: string | null;
    revenue: Revenue;
    website: string | null;
  };
};

function canUse(): boolean {
  return typeof window !== "undefined";
}

function readRaw(key: string): SavedBrief[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedBrief[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function listSavedBriefs(): SavedBrief[] {
  if (!canUse()) return [];
  const current = readRaw(KEY);
  if (current.length) return current;
  const legacy = readRaw(LEGACY);
  if (!legacy.length) return [];
  const migrated = legacy.map((s) => ({
    ...s,
    profile: {
      ...s.profile,
      kind: s.profile.kind ?? ("trustmrr" as const),
      id: s.profile.id ?? s.brief.slug,
    },
  }));
  window.localStorage.setItem(KEY, JSON.stringify(migrated));
  return migrated;
}

export function saveBrief(entry: SavedBrief): SavedBrief[] {
  const next = [entry, ...listSavedBriefs().filter((s) => s.brief.slug !== entry.brief.slug)].slice(0, 24);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function removeBrief(slug: string): SavedBrief[] {
  const next = listSavedBriefs().filter((s) => s.brief.slug !== slug);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function getSavedBrief(slug: string): SavedBrief | null {
  return listSavedBriefs().find((s) => s.brief.slug === slug) ?? null;
}
