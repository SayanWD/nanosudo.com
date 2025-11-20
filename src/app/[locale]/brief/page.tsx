import type { ReactElement } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// CRITICAL: This page MUST NOT be prerendered
// generateStaticParams in layout.tsx forces Next.js to prerender all pages
// Solution: Use dynamic = 'error' and throw error synchronously during build
// Next.js will catch the error and skip this page from static generation
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
  // We check if we're in build context and throw error synchronously
  try {
    await headers();
  } catch (error) {
    // During build/prerender, headers() throws an error
    // We catch it and call notFound() to tell Next.js to skip this page
    // This is a workaround for the generateStaticParams issue in layout
    // notFound() will cause Next.js to skip this page from static generation
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      // We're in build context, skip this page
      notFound();
    }
    // During runtime, re-throw the error to let Next.js handle it
    throw error;
  }
  
  return <BriefPageClientWrapper />;
}
