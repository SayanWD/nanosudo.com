"use client";

import type { ReactElement } from "react";

import { cn } from "@/lib/cn";

import { useBriefFormContext } from "./brief-form-provider";

export function BriefProgress(): ReactElement {
  const { steps, currentStep, getStepProgress } = useBriefFormContext();
  const progress = getStepProgress();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        <span>
          Шаг {steps.findIndex((step) => step.id === currentStep) + 1}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ol className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:flex-wrap md:gap-4">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted =
            steps.findIndex((item) => item.id === step.id) <
            steps.findIndex((item) => item.id === currentStep);
          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border border-transparent px-2 py-1",
                isActive &&
                  "border-accent/40 bg-accent/10 text-accent-foreground",
                isCompleted && "text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : isCompleted
                      ? "border-accent/50 text-accent"
                      : "border-border/60 text-muted-foreground",
                )}
              >
                {String(
                  steps.findIndex((item) => item.id === step.id) + 1,
                ).padStart(2, "0")}
              </span>
              <span className="font-medium text-foreground">{step.title}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
