import type { ReactElement } from "react";
import { headers } from "next/headers";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// CRITICAL: This page MUST NOT be prerendered
// generateStaticParams in layout.tsx forces Next.js to prerender all pages
// Solution: Override generateStaticParams to return empty array
// This prevents Next.js from attempting to prerender this page
export function generateStaticParams(): Array<{ locale: string }> {
  // Return empty array to prevent prerendering
  // This overrides the generateStaticParams from layout.tsx for this specific page
  return [];
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export default async function BriefPage(): Promise<ReactElement> {
  // Force dynamic rendering by accessing request-specific API
  // This ensures the page is always rendered dynamically at request time
  await headers();
  
  return <BriefPageClientWrapper />;
}
