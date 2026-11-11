import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatUsd,
  formatCount,
  formatRating,
  formatGrowth,
  initials,
  isSafeSlug,
  isDeskKind,
  isSafeHitId,
  hitKey,
  parseHitKey,
} from "./format.ts";

describe("formatUsd", () => {
  it("formats millions correctly", () => {
    assert.equal(formatUsd(1_500_000), "$1.5M");
    assert.equal(formatUsd(2_000_000), "$2M");
    assert.equal(formatUsd(10_000_000), "$10M");
  });

  it("formats thousands correctly", () => {
    assert.equal(formatUsd(15_800), "$15.8k");
    assert.equal(formatUsd(1_200), "$1.2k");
    assert.equal(formatUsd(100_000), "$100k");
  });

  it("formats small numbers correctly", () => {
    assert.equal(formatUsd(0), "$0");
    assert.equal(formatUsd(50), "$50");
    assert.equal(formatUsd(5.5), "$5.50");
  });

  it("handles null and undefined gracefully", () => {
    assert.equal(formatUsd(null), "—");
    assert.equal(formatUsd(undefined), "—");
    assert.equal(formatUsd(Number.NaN), "—");
  });

  it("formats negative values with minus prefix", () => {
    assert.equal(formatUsd(-5000), "-$5k");
  });
});

describe("formatCount", () => {
  it("formats counts in thousands and millions", () => {
    assert.equal(formatCount(1_200), "1.2k");
    assert.equal(formatCount(3_500_000), "3.5M");
    assert.equal(formatCount(42), "42");
  });

  it("handles non-finite and null counts", () => {
    assert.equal(formatCount(null), "—");
    assert.equal(formatCount(-5), "—");
  });
});

describe("formatRating", () => {
  it("formats ratings to 1 decimal place", () => {
    assert.equal(formatRating(4.832), "4.8");
    assert.equal(formatRating(5), "5.0");
    assert.equal(formatRating(null), "—");
  });
});

describe("formatGrowth", () => {
  it("formats positive and negative percentage growth", () => {
    assert.equal(formatGrowth(45), "+45%");
    assert.equal(formatGrowth(-23), "−23%");
    assert.equal(formatGrowth(1200), "×12");
  });

  it("returns null for 0 or non-finite growth", () => {
    assert.equal(formatGrowth(0), null);
    assert.equal(formatGrowth(null), null);
  });
});

describe("initials", () => {
  it("extracts 2-letter uppercase initials", () => {
    assert.equal(initials("Typeframes"), "TY");
    assert.equal(initials("Postiz App"), "PA");
    assert.equal(initials("Open AI"), "OA");
    assert.equal(initials(""), "R");
  });
});

describe("isSafeSlug & isSafeHitId (Security Invariants)", () => {
  it("validates legitimate slugs", () => {
    assert.equal(isSafeSlug("typeframes"), true);
    assert.equal(isSafeSlug("calorie-counter-pro"), true);
  });

  it("rejects path traversal and malicious slugs", () => {
    assert.equal(isSafeSlug("../etc/passwd"), false);
    assert.equal(isSafeSlug("typeframes/evil"), false);
    assert.equal(isSafeSlug(""), false);
  });

  it("validates safe hit IDs across platform kinds", () => {
    assert.equal(isSafeHitId("trustmrr", "typeframes"), true);
    assert.equal(isSafeHitId("reddit", "12ab34"), true);
    assert.equal(isSafeHitId("appstore", "123456789"), true);
    assert.equal(isSafeHitId("playstore", "com.myfitnesspal.android"), true);
  });

  it("rejects malformed hit IDs across platform kinds", () => {
    assert.equal(isSafeHitId("trustmrr", "../etc/passwd"), false);
    assert.equal(isSafeHitId("appstore", "not-a-number"), false);
    assert.equal(isSafeHitId("reddit", "sh"), false); // too short
  });
});

describe("isDeskKind", () => {
  it("accurately identifies all 13 supported desks", () => {
    assert.equal(isDeskKind("trustmrr"), true);
    assert.equal(isDeskKind("reddit"), true);
    assert.equal(isDeskKind("appstore"), true);
    assert.equal(isDeskKind("playstore"), true);
    assert.equal(isDeskKind("producthunt"), true);
    assert.equal(isDeskKind("twitter"), true);
    assert.equal(isDeskKind("hackernews"), true);
    assert.equal(isDeskKind("github"), true);
    assert.equal(isDeskKind("betalist"), true);
    assert.equal(isDeskKind("lobsters"), true);
    assert.equal(isDeskKind("devto"), true);
    assert.equal(isDeskKind("firefox"), true);
    assert.equal(isDeskKind("launchingnext"), true);
  });

  it("rejects invalid desks", () => {
    assert.equal(isDeskKind("tiktok"), false);
    assert.equal(isDeskKind("random"), false);
  });
});

describe("hitKey & parseHitKey", () => {
  it("encodes and parses composite keys accurately", () => {
    const key = hitKey("trustmrr", "postiz");
    assert.equal(key, "trustmrr:postiz");
    const parsed = parseHitKey(key);
    assert.deepEqual(parsed, { kind: "trustmrr", id: "postiz" });
  });

  it("returns null for malformed keys", () => {
    assert.equal(parseHitKey("invalid"), null);
    assert.equal(parseHitKey("unknown:123"), null);
  });
});
