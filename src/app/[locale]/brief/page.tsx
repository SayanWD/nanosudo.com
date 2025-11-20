import type { ReactElement } from "react";
import { BriefPageClient } from "./brief-page-client";

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic';

export default function BriefPage(): ReactElement {
  return <BriefPageClient />;
}
