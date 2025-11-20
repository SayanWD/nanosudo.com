import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// Use 'error' to prevent static generation - Next.js will skip this page during build
// if it tries to prerender it, which is exactly what we want
export const dynamic = 'error';
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
  // This will throw an error during build/prerender, causing Next.js to skip this page
  // The error is expected and handled by Next.js - it will skip the page from static generation
  // We don't wrap in try-catch because we WANT the error to be thrown during build
  // This is the only reliable way to prevent prerendering when generateStaticParams is in layout
  await headers();
  
  return <BriefPageClientWrapper />;
}
