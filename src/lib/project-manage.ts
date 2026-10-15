export interface IdeaPushPayload {
  name: string;
  description: string;
  url?: string;
  tag?: string;
  status?: string;
  source?: string;
  sourceUrl?: string;
  blueprint?: string;
  vibeGuide?: Array<{
    step: number;
    title: string;
    why?: string;
    prompt: string;
    doneWhen?: string;
  }>;
}

export const DEFAULT_PROJECT_MANAGE_URL = 'https://project-manage-z6u.pages.dev';

export function getProjectManageUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_PROJECT_MANAGE_URL;
  const stored = localStorage.getItem('project_manage_url');
  if (stored) return stored.trim();
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5173';
  }
  return DEFAULT_PROJECT_MANAGE_URL;
}

export function mapOpportunityTag(kind: string, category?: string | null): string {
  const c = (category || '').toLowerCase();
  const k = (kind || '').toLowerCase();

  if (k === 'appstore' || k === 'playstore' || c.includes('ios') || c.includes('android') || c.includes('mobile')) {
    return 'app';
  }
  if (c.includes('game') || c.includes('gaming')) {
    return 'games';
  }
  if (c.includes('saas') || c.includes('b2b') || c.includes('subscription') || c.includes('crm') || c.includes('analytics') || c.includes('ecommerce') || c.includes('store') || c.includes('shop') || c.includes('commerce')) {
    return 'saas';
  }
  if (c.includes('tool') || c.includes('developer') || c.includes('utility') || c.includes('extension') || c.includes('addon') || c.includes('plugin') || k === 'firefox' || k === 'github' || c.includes('ai') || c.includes('llm') || c.includes('gpt')) {
    return 'tool';
  }
  return 'web-app';
}

import { pushToProjectManage } from "./server-fns";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

export function pushIdeaToProjectManage(payload: IdeaPushPayload): void {
  if (typeof window === 'undefined') return;

  const rawId = slugify(payload.name);
  const productId = `finder-${rawId || Date.now()}`;
  const validTag = mapOpportunityTag(payload.tag || '', payload.source || '');

  // Sync directly to Project Manage Turso DB in background
  void pushToProjectManage({
    data: {
      id: productId,
      name: payload.name,
      description: payload.description,
      url: payload.url,
      tag: validTag,
      source: payload.source,
      sourceUrl: payload.sourceUrl,
      blueprint: payload.blueprint,
      vibeGuide: payload.vibeGuide,
    },
  }).catch((err) => {
    console.warn("Direct Turso sync warning:", err);
  });

  const baseUrl = getProjectManageUrl();
  const target = new URL(baseUrl);
  target.searchParams.set('action', 'import-idea');
  target.searchParams.set('id', productId);
  target.searchParams.set('name', payload.name);
  if (payload.description) target.searchParams.set('desc', payload.description.slice(0, 400));
  if (payload.url) target.searchParams.set('url', payload.url);
  target.searchParams.set('tag', validTag);
  target.searchParams.set('status', payload.status || 'idea');
  if (payload.source) target.searchParams.set('source', payload.source);
  if (payload.sourceUrl) target.searchParams.set('sourceUrl', payload.sourceUrl);

  // Compact payload for URL (safe, lightweight, guaranteed under 1.5KB)
  const compactPayload = {
    id: productId,
    name: payload.name,
    description: (payload.description || '').slice(0, 400),
    url: payload.url,
    tag: validTag,
    status: payload.status || 'idea',
    source: payload.source || 'Finder',
    sourceUrl: payload.sourceUrl,
    vibeGuide: payload.vibeGuide?.slice(0, 10).map((s) => ({
      step: s.step,
      title: s.title.slice(0, 100),
      why: (s.why || '').slice(0, 150),
      prompt: (s.prompt || '').slice(0, 300),
      doneWhen: (s.doneWhen || '').slice(0, 100),
    })),
  };
  target.searchParams.set('import_idea', JSON.stringify(compactPayload));

  window.open(target.toString(), '_blank', 'noopener,noreferrer');
}

