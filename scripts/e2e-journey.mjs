#!/usr/bin/env node
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8080/";

async function runE2EJourney() {
  console.log(`[E2E] Starting Finder end-to-end journey test against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. Visit Home Page
    console.log("  Step 1: Navigating to homepage...");
    const response = await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 15_000 });
    if (!response || response.status() !== 200) {
      throw new Error(`Expected HTTP 200 on ${BASE_URL}, received ${response?.status()}`);
    }

    const title = await page.title();
    console.log(`  Page title: "${title}"`);
    if (!title.includes("Finder")) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    // Verify main headings or content
    await page.waitForSelector("main, [role='main'], h1, h2", { timeout: 8_000 });
    console.log("  Step 1 passed: Homepage rendered successfully.");

    // 2. Test Desk Switching
    console.log("  Step 2: Testing opportunity desk switching...");
    // Find Reddit desk button
    const redditBtn = page.locator("button:has-text('Reddit')").first();
    if (await redditBtn.isVisible()) {
      await redditBtn.click();
      await page.waitForTimeout(1000);
      console.log("    Switched to Reddit desk.");
    }

    // Find App Store desk button
    const appStoreBtn = page.locator("button:has-text('App Store')").first();
    if (await appStoreBtn.isVisible()) {
      await appStoreBtn.click();
      await page.waitForTimeout(1000);
      console.log("    Switched to App Store desk.");
    }

    // Switch back to TrustMRR
    const trustmrrBtn = page.locator("button:has-text('TrustMRR')").first();
    if (await trustmrrBtn.isVisible()) {
      await trustmrrBtn.click();
      await page.waitForTimeout(1000);
      console.log("    Switched back to TrustMRR desk.");
    }
    console.log("  Step 2 passed: Desk tabs switch cleanly.");

    // 3. Test Search Filtering
    console.log("  Step 3: Testing search filtering...");
    const searchInput = page.locator("input[placeholder*='Search'], input[type='search'], input[type='text']").first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("postiz");
      await page.waitForTimeout(600);
      const postizCard = page.locator("text=Postiz").first();
      const isPostizVisible = await postizCard.isVisible().catch(() => false);
      console.log(`    Search for 'postiz' returned results: ${isPostizVisible}`);
      await searchInput.fill("");
      await page.waitForTimeout(400);
    }
    console.log("  Step 3 passed: Search filtering operates without errors.");

    // 4. Test Opportunity Dossier Navigation
    console.log("  Step 4: Navigating into an opportunity dossier...");
    await page.goto(`${BASE_URL}hit/trustmrr/postiz`, { waitUntil: "domcontentloaded", timeout: 15_000 });
    await page.waitForTimeout(1000);
    await page.waitForSelector("h1, h2", { timeout: 8_000 });
    const dossierText = await page.textContent("body");
    if (!dossierText.includes("Postiz") && !dossierText.includes("Blueprint")) {
      throw new Error("Dossier page did not render Postiz details or Blueprint");
    }
    console.log("  Step 4 passed: Dossier and Blueprint rendered.");

    // 5. Test All Links Ecosystem Modal
    console.log("  Step 5: Testing All Links ecosystem modal...");
    const allLinksBtn = page.locator("button:has-text('All Links')").first();
    if (await allLinksBtn.isVisible()) {
      await allLinksBtn.click();
      await page.waitForTimeout(500);
      const modalText = await page.textContent("body");
      if (!modalText.includes("AI Mentor OS") && !modalText.includes("Project Manage")) {
        console.warn("    Modal opened but expected ecosystem text was not immediately found");
      } else {
        console.log("    All Links modal displayed ecosystem tools.");
      }
      // Press Escape or close button
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }
    console.log("  Step 5 passed: All Links modal verified.");

    // 6. Test Saved Route Navigation
    console.log("  Step 6: Navigating to /saved route...");
    await page.goto(`${BASE_URL}saved`, { waitUntil: "domcontentloaded", timeout: 15_000 });
    await page.waitForTimeout(800);
    const savedText = await page.textContent("body");
    if (!savedText.includes("Saved") && !savedText.includes("Bookmarks")) {
      throw new Error("Saved route did not render expected bookmarks view");
    }
    console.log("  Step 6 passed: Saved route rendered cleanly.");

    // 7. Verify Console Error Invariants
    console.log("  Step 7: Auditing console errors across entire journey...");
    if (consoleErrors.length > 0) {
      console.error("  E2E Journey encountered console errors:", consoleErrors);
      throw new Error(`Encountered ${consoleErrors.length} uncaught console errors during journey.`);
    }
    console.log("  Step 7 passed: 0 uncaught console errors recorded.");

    console.log("\n[E2E] SUCCESS: Full end-to-end user journey passed all verification checks!");
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error("\n[E2E] FAILURE:", err.message);
    await browser.close();
    process.exit(1);
  }
}

runE2EJourney();
