import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// CRITICAL: This page MUST NOT be prerendered
// generateStaticParams in layout.tsx forces Next.js to prerender all pages
// The solution is to use dynamic = 'force-dynamic' with cookies() in try-catch
// This ensures Next.js treats this route as fully dynamic and skips it during build
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// DO NOT export generateStaticParams - this would force prerendering

export default async function BriefPage(): Promise<ReactElement> {
  // Prevent caching and static generation
  noStore();
  
  // Force dynamic rendering by accessing request-specific API
  // cookies() will throw an error during build/prerender, which is what we want
  // Next.js will catch this error and skip this page from static generation
  // We wrap in try-catch to handle the error gracefully during build
  try {
    await cookies();
  } catch {
    // Error is expected during build/prerender - Next.js will handle it
    // This is safe because we're in a try-catch
    // Next.js will skip this page from static generation when it encounters the error
  }
  
  return <BriefPageClientWrapper />;
}
