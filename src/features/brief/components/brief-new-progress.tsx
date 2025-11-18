"use client";

import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useBriefNewFormContext } from "./brief-new-form-provider";

export function BriefNewProgress(): ReactElement {
  const { steps, stepMeta, getStepProgress } = useBriefNewFormContext();
  const progress = getStepProgress();
  const t = useTranslations("brief.progress");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("label")}
          </span>
          <span className="text-xs font-semibold text-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <nav className="space-y-2">
        {steps.map((step) => {
          const isActive = step.id === stepMeta.id;
          const isCompleted = step.index < stepMeta.index;

          return (
            <div
              key={step.id}
              className={`rounded-lg p-3 text-sm transition ${
                isActive
                  ? "bg-accent/10 border border-accent text-foreground"
                  : isCompleted
                    ? "bg-surface/60 text-muted-foreground"
                    : "bg-surface/40 text-muted-foreground/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : isCompleted
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : step.index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {t(`steps.${step.id}.title`)}
                  </div>
                  <div className="text-xs opacity-75 mt-0.5">
                    {t(`steps.${step.id}.description`)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

