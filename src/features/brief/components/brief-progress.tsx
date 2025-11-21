"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/cn";

import { useBriefFormContext } from "./brief-form-provider";

export function BriefProgress(): ReactElement {
  const { steps, currentStep, getStepProgress } = useBriefFormContext();
  const t = useTranslations("brief.progress");
  const progress = getStepProgress();
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const activeStep = steps[currentIndex];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        <span>
          Шаг {currentIndex + 1}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="rounded-xl border border-border/60 bg-surface/80 p-4 shadow-soft space-y-3 md:hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {t("activeStep")}
          </p>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-accent transition hover:text-accent/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {isExpanded ? t("toggle.hide") : t("toggle.show")}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent bg-accent text-xs font-semibold text-accent-foreground">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="font-semibold text-foreground">{activeStep?.title}</span>
        </div>
      </div>

      <ol
        className={cn(
          "flex-col gap-2 text-sm text-muted-foreground md:flex md:flex-row md:flex-wrap md:gap-4",
          isExpanded ? "flex" : "hidden md:flex",
        )}
      >
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted =
            steps.findIndex((item) => item.id === step.id) <
            steps.findIndex((item) => item.id === currentStep);
          return (
            <li
              key={step.id}
              className={cn(
                "items-center gap-2 rounded-lg border border-transparent px-2 py-1",
                isActive || isExpanded ? "flex" : "hidden md:flex",
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
