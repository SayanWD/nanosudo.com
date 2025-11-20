import type { ReactElement } from "react";
import nextDynamic from "next/dynamic";

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

// Dynamically import client component with SSR disabled
// According to Next.js docs: https://nextjs.org/docs/messages/prerender-error
// This prevents the component from being rendered on the server during prerender
const BriefPageClient = nextDynamic(
  () => import("./brief-page-client").then((mod) => ({ default: mod.BriefPageClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    ),
  }
);

// This page must be rendered dynamically, never statically
export default function BriefPage(): ReactElement {
  return <BriefPageClient />;
}
