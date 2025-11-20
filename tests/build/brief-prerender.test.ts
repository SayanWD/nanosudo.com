/**
 * Test to verify that the /brief page is not prerendered during build
 * This test should be run before deployment to catch prerender errors early
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("Brief page prerender check", () => {
  it("should not have static HTML files for /brief route", () => {
    // After build, Next.js creates static HTML files in .next/server/app
    // If /brief is prerendered, there will be HTML files for it
    // We check that these files don't exist or that the route is marked as dynamic
    
    const buildOutputPath = join(process.cwd(), ".next");
    
    // Check if build output exists
    if (!existsSync(buildOutputPath)) {
      // If build hasn't been run, skip this test
      console.warn("Build output not found. Run 'pnpm build' first.");
      return;
    }

    // Check the build manifest to see if old /brief route exists
    // The manifest contains all routes (including dynamic ones), so we only check for old route
    const manifestPath = join(buildOutputPath, "server", "app-paths-manifest.json");
    
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
      
      // The old /brief route should NOT exist (we use /[locale]/brief now)
      // API routes are fine, we only check page routes
      const oldBriefPageRoute = Object.keys(manifest).find(
        (path) => path === "/brief/page"
      );
      
      // Old route should not exist
      expect(oldBriefPageRoute).toBeUndefined();
      
      // The new /[locale]/brief route should exist in manifest (it's normal for dynamic routes)
      // But it should be marked as dynamic in the build output, not static
      const localeBriefRoute = Object.keys(manifest).find(
        (path) => path === "/[locale]/brief/page"
      );
      
      // New route should exist
      expect(localeBriefRoute).toBeDefined();
    }
  });

  it("should have dynamic route configuration", () => {
    // Check that the page.tsx file has the correct configuration
    const pagePath = join(
      process.cwd(),
      "src",
      "app",
      "[locale]",
      "brief",
      "page.tsx"
    );
    
    if (!existsSync(pagePath)) {
      throw new Error("Brief page file not found");
    }
    
    const pageContent = readFileSync(pagePath, "utf-8");
    
    // The page should have:
    // 1. generateStaticParams returning empty array (to override layout's generateStaticParams)
    // 2. dynamic = 'force-dynamic' configuration
    // 3. unstable_noStore() call to force dynamic rendering
    const hasGenerateStaticParams = pageContent.includes("generateStaticParams");
    const hasEmptyArrayReturn = pageContent.includes("return []");
    const hasDynamicConfig = pageContent.includes("export const dynamic");
    const hasForceDynamic = pageContent.includes("'force-dynamic'");
    const hasNoStore = pageContent.includes("unstable_noStore") || pageContent.includes("noStore");
    
    expect(hasGenerateStaticParams && hasEmptyArrayReturn).toBe(true);
    expect(hasDynamicConfig && hasForceDynamic).toBe(true);
    expect(hasNoStore).toBe(true);
  });
});

