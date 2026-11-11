import { ZERO_REVENUE } from "./http.server.ts";
import type { StartupProfile, TargetProfile } from "./types.ts";

export function emptyTarget(partial: Partial<TargetProfile> & Pick<TargetProfile, "kind" | "id" | "name">): TargetProfile {
  return {
    description: "",
    icon: null,
    category: null,
    website: null,
    sourceUrl: "",
    sourceLabel: "Riposte",
    developer: null,
    extra: {},
    revenue: ZERO_REVENUE,
    growth30d: null,
    growthMRR30d: null,
    onSale: false,
    stealthMode: false,
    rating: null,
    ratingsCount: null,
    rank: null,
    installs: null,
    price: null,
    score: null,
    comments: null,
    subreddit: null,
    insights: {},
    techStack: {},
    marketingChannels: [],
    github: null,
    domainRating: null,
    estimatedUsers: null,
    ...partial,
  };
}

export function fromTrustProfile(p: StartupProfile): TargetProfile {
  return emptyTarget({
    kind: "trustmrr",
    id: p.slug,
    name: p.name,
    description: p.description,
    icon: p.icon,
    category: p.category,
    website: p.website,
    sourceUrl: p.trustmrrUrl,
    sourceLabel: "TrustMRR",
    developer: p.founder,
    extra: {
      country: p.country ?? "",
      founded: p.foundedDate ?? "",
      ...p.insights,
    },
    revenue: p.revenue,
    growth30d: p.growth30d,
    growthMRR30d: p.growthMRR30d,
    onSale: p.onSale,
    stealthMode: p.stealthMode,
    insights: p.insights,
    techStack: p.techStack,
    marketingChannels: p.marketingChannels,
    github: p.github,
    domainRating: p.domainRating,
    estimatedUsers: p.estimatedUsers,
  });
}
