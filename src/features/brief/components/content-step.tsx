"use client";

import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";

export function ContentStep(): ReactElement {
  const {
    form: { register },
    goNext,
  } = useBriefNewStep("content");
  const t = useTranslations("brief.content");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
          <input
            type="checkbox"
            {...register("content.clientProvides")}
            className="h-4 w-4 text-accent focus:ring-accent"
          />
          <div className="flex-1">
            <div className="font-medium text-foreground">
              {t("clientProvides.label")}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("clientProvides.description")}
            </div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
          <input
            type="checkbox"
            {...register("content.needsCopywriting")}
            className="h-4 w-4 text-accent focus:ring-accent"
          />
          <div className="flex-1">
            <div className="font-medium text-foreground">
              {t("needsCopywriting.label")}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("needsCopywriting.description")}
            </div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
          <input
            type="checkbox"
            {...register("content.needsMediaProcessing")}
            className="h-4 w-4 text-accent focus:ring-accent"
          />
          <div className="flex-1">
            <div className="font-medium text-foreground">
              {t("needsMediaProcessing.label")}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("needsMediaProcessing.description")}
            </div>
          </div>
        </label>
      </div>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

