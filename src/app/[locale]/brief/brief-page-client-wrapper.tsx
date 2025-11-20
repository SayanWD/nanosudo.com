"use client";

import type { ReactElement } from "react";
import dynamic from "next/dynamic";

// Dynamically import client component with SSR disabled
// According to Next.js docs: https://nextjs.org/docs/messages/prerender-error
// This prevents the component from being rendered on the server during prerender
// ssr: false can only be used in Client Components
// The loading state will be shown during client-side hydration
const BriefPageClient = dynamic(
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

export function BriefPageClientWrapper(): ReactElement {
  // With ssr: false, this component will never render on the server
  // It will only render on the client after hydration
  // The loading state from dynamic() will be shown during client-side loading
  return <BriefPageClient />;
}

