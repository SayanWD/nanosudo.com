"use client";

import type { ReactElement } from "react";
import { BriefPageClientWrapper } from "./brief-page-client-wrapper";

// Route segment config to prevent prerendering
// Even though this is a client component, Next.js still tries to prerender it
// when generateStaticParams is defined in the parent layout
// These exports tell Next.js to skip this page during static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// DO NOT export generateStaticParams - this prevents Next.js from trying to prerender
// By not exporting it and setting dynamicParams = false, Next.js will treat this route as fully dynamic

// This page is a client component to prevent Next.js from prerendering it
// Combined with route segment config above, this should prevent all prerendering attempts
export default function BriefPage(): ReactElement {
  return <BriefPageClientWrapper />;
}
