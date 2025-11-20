import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
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

// This page must be rendered dynamically, never statically
export default async function BriefPage(): Promise<ReactElement> {
  // Prevent caching and static generation
  noStore();
  
  // Force dynamic rendering by accessing request-specific API
  // This will throw an error during build/prerender, causing Next.js to skip this page
  // The error is expected and handled by Next.js - it will skip the page from static generation
  try {
    await headers();
  } catch {
    // Error is expected during build/prerender - Next.js will handle it and skip this page
    // This is the desired behavior to prevent prerendering
  }
  
  return <BriefPageClientWrapper />;
}
