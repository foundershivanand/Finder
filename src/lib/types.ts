export type Revenue = {
  last30Days: number;
  mrr: number;
  total: number;
};

export type ScoutSource = "recent" | "growing" | "listed" | "deal";

export type DeskKind =
  | "trustmrr"
  | "reddit"
  | "appstore"
  | "playstore"
  | "producthunt"
  | "twitter"
  | "hackernews"
  | "github"
  | "betalist"
  | "lobsters"
  | "devto"
  | "firefox"
  | "launchingnext";

export type ScoutProduct = {
  name: string;
  slug: string;
  url: string;
  icon: string | null;
  description: string;
  website: string | null;
  category: string | null;
  paymentProvider: string | null;
  revenue: Revenue;
  growth30d: number;
  growthMRR30d: number;
  onSale: boolean;
  stealthMode: boolean;
  askingPrice: number | null;
  multiple: number | null;
  sources: ScoutSource[];
};

export type ScoutFeed = {
  earning: ScoutProduct[];
  growing: ScoutProduct[];
  recent: ScoutProduct[];
  listed: ScoutProduct[];
  fetchedAt: string;
};

export type HitStat = {
  label: string;
  value: string;
  tone?: "money" | "pain";
};

export type ScoutHit = {
  kind: DeskKind;
  id: string;
  name: string;
  description: string;
  icon: string | null;
  category: string | null;
  sourceUrl: string;
  stats: HitStat[];
  badges: string[];
  tags: string[];
  painPreview: string | null;
};

export type ScoutBoard = {
  trustmrr: ScoutFeed;
  reddit: ScoutHit[];
  appstore: ScoutHit[];
  playstore: ScoutHit[];
  errors: Partial<Record<DeskKind, string>>;
  fetchedAt: string;
};

export type StartupProfile = {
  slug: string;
  name: string;
  description: string;
  website: string | null;
  icon: string | null;
  category: string | null;
  founder: string | null;
  country: string | null;
  foundedDate: string | null;
  stealthMode: boolean;
  onSale: boolean;
  trustmrrUrl: string;
  markdownUrl: string;
  revenue: Revenue;
  growth30d: number | null;
  growthMRR30d: number | null;
  revenueTable: Array<{ period: string; amount: string }>;
  insights: Record<string, string>;
  techStack: Record<string, string[]>;
  marketingChannels: string[];
  markdownExcerpt: string;
  github: { connected: boolean; contrib30: number } | null;
  domainRating: number | null;
  estimatedUsers: string | null;
};

export type TargetProfile = {
  kind: DeskKind;
  id: string;
  name: string;
  description: string;
  icon: string | null;
  category: string | null;
  website: string | null;
  sourceUrl: string;
  sourceLabel: string;
  developer: string | null;
  extra: Record<string, string>;
  revenue: Revenue;
  growth30d: number | null;
  growthMRR30d: number | null;
  onSale: boolean;
  stealthMode: boolean;
  rating: number | null;
  ratingsCount: number | null;
  rank: number | null;
  installs: string | null;
  price: string | null;
  score: number | null;
  comments: number | null;
  subreddit: string | null;
  insights: Record<string, string>;
  techStack: Record<string, string[]>;
  marketingChannels: string[];
  github: { connected: boolean; contrib30: number } | null;
  domainRating: number | null;
  estimatedUsers: string | null;
};

export type ReviewSnippet = {
  source: string;
  title: string;
  url: string;
  body: string;
};

export type ComplaintSeverity = "critical" | "high" | "medium";

export type Complaint = {
  theme: string;
  severity: ComplaintSeverity;
  quote: string;
  source: string;
  sourced: boolean;
  howToFix: string;
};

export type VibeStep = {
  step: number;
  title: string;
  why: string;
  prompt: string;
  doneWhen: string;
};

export type BriefOrigin = "grok" | "traces";

export type RiposteBrief = {
  productName: string;
  slug: string;
  thesis: string;
  opportunity: {
    betterName: string;
    positioning: string;
    whoItsFor: string;
    whyNow: string;
  };
  complaints: Complaint[];
  gaps: string[];
  vibeGuide: VibeStep[];
  stack: {
    recommendation: string;
    reason: string;
    pieces: string[];
  };
  mvpScope: string[];
  outOfScope: string[];
  launch: {
    firstUsers: string;
    pricing: string;
    differentiator: string;
  };
  generatedAt: string;
  origin?: BriefOrigin;
  masterBlueprint?: string;
};

export type ProductDossier = {
  profile: TargetProfile;
  reviews: ReviewSnippet[];
  brief: RiposteBrief;
  websiteText: string | null;
};

export type GenerateResult =
  | { ok: true; brief: RiposteBrief; profile: TargetProfile; warning?: string }
  | { ok: false; error: string; profile: TargetProfile | null };
