"use client";

import type { ReactElement } from "react";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// This page MUST be a Client Component to prevent prerendering
// Server Components with route segment config don't work when generateStaticParams is in layout
// By making this a Client Component, Next.js will skip it during build/prerender
// The actual UI is in BriefPageClientWrapper which uses dynamic import with ssr: false
export default function BriefPage(): ReactElement {
  return <BriefPageClientWrapper />;
}
