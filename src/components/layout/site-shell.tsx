'use client';

// Layout wrapper: base shell for pages with optional header and footer.
import type { ReactElement, ReactNode } from "react";
import { usePathname } from "@/i18n/routing";

import { cn } from "@/lib/cn";
import { DynamicBackground } from "@/components/background/dynamic-background";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type SiteShellProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
};

export function SiteShell({
  children,
  className,
  header,
  footer,
}: SiteShellProps): ReactElement {
  const pathname = usePathname();
  // Show header only on home page (root or locale root)
  const isHomePage = pathname === '/' || pathname.match(/^\/[a-z]{2}\/?$/);
  const resolvedHeader = header !== undefined 
    ? header 
    : isHomePage 
      ? <SiteHeader /> 
      : null;
  const resolvedFooter = footer ?? <SiteFooter />;

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col bg-background text-foreground",
        className,
      )}
    >
      <DynamicBackground />
      {resolvedHeader ? (
        <header className="sticky top-0 z-20 border-b border-border/60 bg-surface/60 backdrop-blur-xl">
          {resolvedHeader}
        </header>
      ) : null}
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      {resolvedFooter ? (
        <footer className="relative z-10 border-t border-border/60 bg-surface/80">
          {resolvedFooter}
        </footer>
      ) : null}
    </div>
  );
}
