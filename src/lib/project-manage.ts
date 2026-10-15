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
  return DEFAULT_PROJECT_MANAGE_URL;
}

export function mapOpportunityTag(kind: string, category?: string | null): string {
  const c = (category || '').toLowerCase();
  const k = (kind || '').toLowerCase();

  if (k === 'appstore' || k === 'playstore' || c.includes('ios') || c.includes('android') || c.includes('mobile')) {
    return 'mobile';
  }
  if (c.includes('ai') || c.includes('llm') || c.includes('gpt') || c.includes('bot') || c.includes('machine learning')) {
    return 'ai';
  }
  if (c.includes('saas') || c.includes('b2b') || c.includes('subscription') || c.includes('crm') || c.includes('analytics')) {
    return 'saas';
  }
  if (c.includes('extension') || c.includes('addon') || c.includes('plugin') || k === 'firefox') {
    return 'extension';
  }
  if (c.includes('ecommerce') || c.includes('store') || c.includes('shop') || c.includes('commerce')) {
    return 'ecommerce';
  }
  if (c.includes('tool') || c.includes('developer') || c.includes('utility') || k === 'github') {
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

  // Sync directly to Project Manage Turso DB in background
  void pushToProjectManage({
    data: {
      id: productId,
      name: payload.name,
      description: payload.description,
      url: payload.url,
      tag: payload.tag,
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
  if (payload.description) target.searchParams.set('desc', payload.description.slice(0, 300));
  if (payload.url) target.searchParams.set('url', payload.url);
  if (payload.tag) target.searchParams.set('tag', payload.tag);
  if (payload.status) target.searchParams.set('status', payload.status);
  if (payload.source) target.searchParams.set('source', payload.source);
  if (payload.sourceUrl) target.searchParams.set('sourceUrl', payload.sourceUrl);

  window.open(target.toString(), '_blank', 'noopener,noreferrer');
}

