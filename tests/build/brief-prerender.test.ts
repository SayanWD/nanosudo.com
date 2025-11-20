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

    // Check the build manifest to see if /brief is in the static pages list
    const manifestPath = join(buildOutputPath, "server", "app-paths-manifest.json");
    
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
      
      // The brief route should NOT be in the static pages manifest
      // If it is, that means it was prerendered, which is the problem
      const briefRoutes = Object.keys(manifest).filter((path) =>
        path.includes("/brief")
      );
      
      expect(briefRoutes.length).toBe(0);
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
    
    // The page should be a Client Component or have dynamic configuration
    // Check for "use client" directive or dynamic route config
    const isClientComponent = pageContent.includes('"use client"');
    const hasDynamicConfig =
      pageContent.includes("export const dynamic") ||
      pageContent.includes("export const revalidate");
    
    expect(isClientComponent || hasDynamicConfig).toBe(true);
  });
});

