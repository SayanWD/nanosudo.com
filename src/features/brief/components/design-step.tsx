"use client";

import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";
import { MODULE_HOURS } from "../schemas/brief-new";

export function DesignStep(): ReactElement {
  const {
    form: { register, watch },
    goNext,
  } = useBriefNewStep("design");
  const t = useTranslations("brief.design");

  const design = watch("design");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("design.useTemplate")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {t("useTemplate.label")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("useTemplate.description")}
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("design.adaptBrandbook")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {t("adaptBrandbook.label")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("adaptBrandbook.description", { hours: MODULE_HOURS.design.adaptBrandbook })}
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("design.designFromScratch")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {t("designFromScratch.label")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("designFromScratch.description", { hours: MODULE_HOURS.design.fromScratch })}
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("design.uiKit")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {t("uiKit.label")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("uiKit.description", { hours: MODULE_HOURS.design.uiKit })}
              </div>
            </div>
          </label>
        </div>

        <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("pageCount.label")}
          </label>
          <input
            type="number"
            min="1"
            max="50"
            {...register("design.pageCount", { valueAsNumber: true })}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-foreground"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {t("currentValue", { count: design.pageCount })}
          </p>
        </div>
      </div>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

