"use client";

import type { ReactElement } from "react";
import { useState, useLayoutEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import client component with SSR disabled
// According to Next.js docs: https://nextjs.org/docs/messages/prerender-error
// This prevents the component from being rendered on the server during prerender
// ssr: false can only be used in Client Components
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
  // Ensure this component only renders on the client
  // This prevents any server-side rendering attempts
  // Use lazy initialization to check if we're on the client
  const [isClient, setIsClient] = useState(() => typeof window !== "undefined");

  // Prevent hydration mismatch by only setting client state after mount
  // useLayoutEffect runs synchronously before browser paint
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Return loading state during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <BriefPageClient />;
}

