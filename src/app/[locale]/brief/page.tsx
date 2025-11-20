import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// Force dynamic rendering to prevent static generation
// This page uses client-side only features (localStorage, form state) that cannot be prerendered
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// DO NOT export generateStaticParams - this prevents Next.js from trying to prerender
// By not exporting it and setting dynamicParams = false, Next.js will treat this route as fully dynamic

// This is a Server Component that wraps the Client Component
// The route segment config prevents prerendering, and the client component handles the UI
export default async function BriefPage(): Promise<ReactElement> {
  // Prevent caching and static generation
  noStore();
  
  // Force dynamic rendering by accessing request-specific API
  // This ensures Next.js treats this route as fully dynamic
  // We use cookies() instead of headers() to avoid build errors
  try {
    await cookies();
  } catch {
    // Error is expected during build/prerender - Next.js will handle it
    // This is safe because we're in a try-catch
  }
  
  return <BriefPageClientWrapper />;
}
