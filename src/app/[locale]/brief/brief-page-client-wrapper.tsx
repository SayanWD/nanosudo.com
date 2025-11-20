"use client";

import type { ReactElement } from "react";
import dynamic from "next/dynamic";

// Dynamically import client component with SSR disabled
// This must be in a Client Component to use ssr: false
const BriefPageClient = dynamic(() => import("./brief-page-client").then((mod) => ({ default: mod.BriefPageClient })), {
  ssr: false,
});

export function BriefPageClientWrapper(): ReactElement {
  return <BriefPageClient />;
}

