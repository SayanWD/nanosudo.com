import type { ReactElement } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

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
  
  return <BriefPageClientWrapper />;
}
