import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// DO NOT export generateStaticParams - this prevents Next.js from trying to prerender
// By not exporting it and setting dynamicParams = false, Next.js will treat this route as fully dynamic

// This page must be rendered dynamically, never statically
export default async function BriefPage(): Promise<ReactElement> {
  // Prevent caching and static generation
  noStore();
  
  // Force dynamic rendering by making this an async function
  // This ensures Next.js treats this route as fully dynamic
  // We don't use headers() here to avoid errors during build
  await Promise.resolve();
  
  return <BriefPageClientWrapper />;
}
