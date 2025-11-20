import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// Use 'error' to throw an error if Next.js tries to statically generate this page
// This is more aggressive than 'force-dynamic' and will prevent prerendering
export const dynamic = 'error';
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
  
  // Force dynamic rendering by accessing request-specific API
  // This will throw an error during build/prerender, which is what we want
  // The error will be caught by Next.js and the page will be skipped from static generation
  await headers();
  
  return <BriefPageClientWrapper />;
}
