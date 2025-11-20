"use client";

import type { ReactElement } from "react";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// This page is a client component to prevent Next.js from prerendering it
// Client components are never prerendered during build
// This is the most reliable way to prevent prerendering errors
export default function BriefPage(): ReactElement {
  return <BriefPageClientWrapper />;
}
