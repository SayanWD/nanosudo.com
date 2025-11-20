import type { ReactElement } from "react";
import { BriefPageClient } from "./brief-page-client";

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Prevent static generation by not generating static params
export function generateStaticParams(): Array<never> {
  return [];
}

export default function BriefPage(): ReactElement {
  return <BriefPageClient />;
}
