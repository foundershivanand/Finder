export interface EcosystemLinkItem {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  url: string;
  iconName: "FolderKanban" | "Bot" | "Cpu" | "Smartphone" | "Boxes";
  stats: string;
}

export const ALL_ECOSYSTEM_LINKS: EcosystemLinkItem[] = [
  {
    id: "product-manage",
    title: "Product Hub",
    badge: "Launch OS",
    tagline: "Master Launch Operating System",
    description: "Turn scouted ideas into live products with 817-task launch checklists, Kanban stage tracking, and shared Turso cloud sync.",
    url: "https://project-manage-z6u.pages.dev/",
    iconName: "FolderKanban",
    stats: "96 Projects • 817 Tasks",
  },
  {
    id: "botserusable",
    title: "Bots Product Factory",
    badge: "Bot Factory",
    tagline: "Reusable Bot Code Library",
    description: "Production bot templates and integration modules for Telegram, Discord, Slack, and WhatsApp with conversational workflows.",
    url: "https://botserusable.pages.dev/",
    iconName: "Bot",
    stats: "Multi-Platform • Webhooks",
  },
  {
    id: "agentsreusable",
    title: "AI Agent Product Factory",
    badge: "Agent Factory",
    tagline: "Autonomous Agent Architecture",
    description: "Modular AI agent scaffolding, tool execution runtimes, long-term memory, prompt injection defenses, and multi-agent orchestration.",
    url: "https://agentsreusable.pages.dev/",
    iconName: "Cpu",
    stats: "Tool Calling • Agent Memory",
  },
  {
    id: "appreusable",
    title: "Mobile Product Factory",
    badge: "Mobile Factory",
    tagline: "163 Mobile Architecture Modules",
    description: "Production-ready mobile architecture for React Native, Flutter, iOS, and Android with offline-first sync engines and native bridges.",
    url: "https://appreusable.pages.dev/",
    iconName: "Smartphone",
    stats: "163 Modules • iOS & Android",
  },
  {
    id: "reusable-library",
    title: "Reusable Code Library",
    badge: "Web & Backend",
    tagline: "33 Enterprise-Grade Modules",
    description: "33 battle-tested modules (OAuth, Stripe subscriptions, Turso DB, rate limiting, audit logging) ready for autonomous AI coding agents.",
    url: "https://reusable-library.foundershivanand.workers.dev/",
    iconName: "Boxes",
    stats: "33 Modules • AI Agent Ready",
  },
];
