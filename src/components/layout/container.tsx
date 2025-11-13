// Layout component: responsive width-constrained container.
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ContainerProps = {
  readonly as?: "div" | "section" | "main" | "header" | "footer" | "article";
  readonly className?: string;
  readonly children: ReactNode;
};

export function Container({
  as: Component = "div",
  className,
  children,
}: ContainerProps): ReactElement {
  return (
    <Component
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </Component>
  );
}
