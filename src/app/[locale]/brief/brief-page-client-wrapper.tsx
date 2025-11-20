"use client";

import type { ReactElement } from "react";
import { useState, useEffect } from "react";
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

export function BriefPageClientWrapper(): ReactElement | null {
  // Ensure this component only renders on the client
  // This prevents any server-side rendering attempts
  // Start with false to prevent any server-side rendering
  const [isClient, setIsClient] = useState(false);

  // Only set to true after component mounts on client
  // This ensures the component never renders on the server
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsClient(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Return null during SSR to prevent any server-side rendering
  // This is safe because ssr: false in dynamic() already prevents server rendering
  // but we add this extra check to be absolutely sure
  if (!isClient) {
    return null;
  }

  return <BriefPageClient />;
}

