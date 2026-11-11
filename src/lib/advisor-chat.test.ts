import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  checkAdvisorRateLimit,
  resetAdvisorRateLimits,
  generateLocalAdvisorResponse,
  generateContextualSuggestions,
} from "./advisor-chat.server.ts";

describe("Advisor Chat Rate Limiting", () => {
  beforeEach(() => {
    resetAdvisorRateLimits();
  });

  it("permits requests within quota window", () => {
    const res1 = checkAdvisorRateLimit("client-1");
    assert.equal(res1.allowed, true);
    assert.equal(res1.retryAfterSeconds, undefined);
  });

  it("throttles clients exceeding request threshold", () => {
    // Threshold is 25 requests per minute
    for (let i = 0; i < 25; i++) {
      const res = checkAdvisorRateLimit("spammer");
      assert.equal(res.allowed, true);
    }

    // 26th request should be throttled
    const blocked = checkAdvisorRateLimit("spammer");
    assert.equal(blocked.allowed, false);
    assert.ok((blocked.retryAfterSeconds || 0) > 0);
  });

  it("isolates quotas across distinct clients", () => {
    for (let i = 0; i < 25; i++) {
      checkAdvisorRateLimit("client-a");
    }
    assert.equal(checkAdvisorRateLimit("client-a").allowed, false);
    assert.equal(checkAdvisorRateLimit("client-b").allowed, true);
  });
});

describe("generateLocalAdvisorResponse (Offline Intelligence Fallback)", () => {
  it("generates context-grounded response when viewing a specific opportunity", () => {
    const reply = generateLocalAdvisorResponse("How do I build this?", {
      name: "Typeframes",
      category: "Video SaaS",
    });
    assert.ok(reply.includes("Typeframes"));
    assert.ok(reply.includes("Market Wedge"));
    assert.ok(reply.includes("Project Manage"));
  });

  it("returns curated suggestions for best ideas ask", () => {
    const reply = generateLocalAdvisorResponse("What are the best ideas?");
    assert.ok(reply.includes("Freelance Micro-CRM"));
    assert.ok(reply.includes("Offline Calorie & Macro Tracker"));
  });

  it("returns revenue startup opportunities for SaaS/MRR query", () => {
    const reply = generateLocalAdvisorResponse("Show me high MRR SaaS to flank");
    assert.ok(reply.includes("ScreenshotOne"));
    assert.ok(reply.includes("Typeframes"));
  });
});

describe("generateContextualSuggestions", () => {
  it("returns contextual prompts for current opportunity context", () => {
    const suggestions = generateContextualSuggestions("Here is a plan", {
      name: "Dub.co",
    });
    assert.equal(suggestions.length, 3);
    assert.ok(suggestions.some((s) => s.includes("Dub.co")));
  });

  it("derives keyword-relevant suggestions based on reply contents", () => {
    const suggestions = generateContextualSuggestions("This is a micro-crm idea for freelancers");
    assert.ok(suggestions.some((s) => s.includes("Micro-CRM")));
  });
});
