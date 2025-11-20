import type { ReactElement } from "react";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// CRITICAL: This page MUST NOT be prerendered
// generateStaticParams in layout.tsx forces Next.js to prerender all pages
// Solution: Export generateStaticParams that returns empty array
// This tells Next.js not to prerender this page for any locale
// Combined with dynamic = 'force-dynamic', this prevents prerendering
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Override generateStaticParams from layout to return empty array
// This prevents Next.js from trying to prerender this page
// Even though layout has generateStaticParams, page-level generateStaticParams takes precedence
export function generateStaticParams(): Array<{ locale: string }> {
  // Return empty array to prevent prerendering
  // Next.js will skip this page from static generation
  return [];
}

export default function BriefPage(): ReactElement {
  return <BriefPageClientWrapper />;
}
