import type { ReactElement } from "react";
import { headers } from "next/headers";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// CRITICAL: This page MUST NOT be prerendered
// generateStaticParams in layout.tsx forces Next.js to prerender all pages
// Solution: Use dynamic = 'error' to tell Next.js to skip this page during build
// When Next.js tries to prerender, headers() will throw an error synchronously
// Next.js will catch this error and skip this page from static generation
export const dynamic = 'error';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// DO NOT export generateStaticParams - this would force prerendering

export default async function BriefPage(): Promise<ReactElement> {
  // Force dynamic rendering by accessing request-specific API
  // This will throw an error during build/prerender, which is what we want
  // Next.js will catch this error and skip this page from static generation
  // We don't wrap in try-catch because we WANT the error to be thrown during build
  // The error must be thrown synchronously, before any rendering happens
  await headers();
  
  return <BriefPageClientWrapper />;
}
