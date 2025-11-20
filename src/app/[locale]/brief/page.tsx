import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// Route segment config to prevent prerendering
// These exports MUST be in a Server Component, not a Client Component
// Route segment config cannot be exported from Client Components
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
  
  // Force dynamic rendering by making this an async function
  await Promise.resolve();
  
  return <BriefPageClientWrapper />;
}
