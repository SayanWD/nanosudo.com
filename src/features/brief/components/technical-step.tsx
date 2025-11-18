"use client";

import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";
import { MODULE_HOURS } from "../schemas/brief-new";

export function TechnicalStep(): ReactElement {
  const {
    form: { register, watch },
    goNext,
  } = useBriefNewStep("technical");
  const t = useTranslations("brief.technical");

  const expectedLoad = watch("technical.expectedLoad");

  const LOAD_OPTIONS = [
    { value: "low" as const, label: t("expectedLoad.low"), hours: 0 },
    { value: "medium" as const, label: t("expectedLoad.medium"), hours: 0 },
    { value: "high" as const, label: t("expectedLoad.high"), hours: MODULE_HOURS.technical.highLoad },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            {t("expectedLoad.label")} <span className="text-error">*</span>
          </label>
          <div className="space-y-3">
            {LOAD_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition ${
                  expectedLoad === option.value
                    ? "border-accent bg-accent/10"
                    : "border-border/60 bg-surface/80 hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register("technical.expectedLoad")}
                  className="mt-1 h-4 w-4 text-accent focus:ring-accent"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {option.label}
                  </div>
                  {option.hours > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {t("expectedLoad.optimization", { hours: option.hours })}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("technical.highSecurity")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {t("highSecurity.label")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("highSecurity.description", { hours: MODULE_HOURS.technical.highSecurity })}
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("technical.pwa")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {t("pwa.label")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("pwa.description", { hours: MODULE_HOURS.technical.pwa })}
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("technical.realtime")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {t("realtime.label")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("realtime.description", { hours: MODULE_HOURS.technical.realtime })}
              </div>
            </div>
          </label>
        </div>
      </div>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

