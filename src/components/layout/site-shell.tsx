// Layout wrapper: base shell for pages with optional header and footer.
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/cn";
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
  const resolvedHeader = header ?? <SiteHeader />;
  const resolvedFooter = footer ?? <SiteFooter />;

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col bg-background text-foreground",
        className,
      )}
    >
      {resolvedHeader ? (
        <header className="sticky top-0 z-20 border-b border-border/60 bg-surface/80 backdrop-blur-lg">
          {resolvedHeader}
        </header>
      ) : null}
      <div className="flex flex-1 flex-col">{children}</div>
      {resolvedFooter ? (
        <footer className="border-t border-border/60 bg-surface/80">
          {resolvedFooter}
        </footer>
      ) : null}
    </div>
  );
}
