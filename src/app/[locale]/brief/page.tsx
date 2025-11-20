import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import nextDynamic from "next/dynamic";

// Dynamically import client component with SSR disabled
const BriefPageClient = nextDynamic(() => import("./brief-page-client").then((mod) => ({ default: mod.BriefPageClient })), {
  ssr: false,
});

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Prevent static generation - return empty array to skip static generation
// but allow dynamic rendering for all locales
export function generateStaticParams(): Array<never> {
  return [];
}

// This page must be rendered dynamically, never statically
export default async function BriefPage(): Promise<ReactElement> {
  // Prevent caching and static generation
  noStore();
  
  // Force dynamic rendering by making this an async function
  // This ensures Next.js treats this as a dynamic route
  await Promise.resolve();
  
  return <BriefPageClient />;
}
