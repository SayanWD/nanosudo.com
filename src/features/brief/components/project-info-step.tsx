"use client";

import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";

export function ProjectInfoStep(): ReactElement {
  const t = useTranslations();
  const {
    form: { register, watch, formState },
    goNext,
  } = useBriefNewStep("projectInfo");
  const { errors } = formState;

  const PROJECT_TYPES = [
    { value: "landing", label: t("brief.projectInfo.projectType.landing"), hours: "8-16h" },
    { value: "corporate", label: t("brief.projectInfo.projectType.corporate"), hours: "40-80h" },
    { value: "ecommerce", label: t("brief.projectInfo.projectType.ecommerce"), hours: "80-160h" },
    { value: "saas", label: t("brief.projectInfo.projectType.saas"), hours: "120-240h" },
    { value: "custom-mvp", label: t("brief.projectInfo.projectType.customMvp"), hours: "100-200h" },
  ] as const;

  const projectType = watch("projectInfo.projectType");
  const description = watch("projectInfo.description");
  const [descriptionLength, setDescriptionLength] = useState(0);

  // Prevent hydration mismatch by only updating length on client
  useEffect(() => {
    setDescriptionLength(description?.length ?? 0);
  }, [description]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            {t("brief.projectInfo.projectName.label")} <span className="text-error">*</span>
          </label>
          <input
            id="projectName"
            type="text"
            {...register("projectInfo.projectName")}
            placeholder={t("brief.projectInfo.projectName.placeholder")}
            className="w-full rounded-lg border border-border/60 bg-surface/80 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
          {errors.projectInfo?.projectName && (
            <p className="mt-1 text-sm text-error">
              {errors.projectInfo.projectName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            {t("brief.projectInfo.projectType.label")} <span className="text-error">*</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROJECT_TYPES.map((type) => {
              const isSelected = projectType === type.value;
              return (
              <label
                key={type.value}
                className={`relative flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-border/60 bg-surface/80 hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register("projectInfo.projectType")}
                  className="mt-1 h-4 w-4 text-accent focus:ring-accent"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {type.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {type.hours}
                  </div>
                </div>
              </label>
              );
            })}
          </div>
          {errors.projectInfo?.projectType && (
            <p className="mt-1 text-sm text-error">
              {errors.projectInfo.projectType.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            {t("brief.projectInfo.description.label")} <span className="text-error">*</span>
          </label>
          <textarea
            id="description"
            {...register("projectInfo.description")}
            rows={4}
            placeholder={t("brief.projectInfo.description.placeholder")}
            className="w-full rounded-lg border border-border/60 bg-surface/80 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition resize-none"
          />
          {errors.projectInfo?.description && (
            <p className="mt-1 text-sm text-error">
              {errors.projectInfo.description.message}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>
            {t("brief.projectInfo.description.characters", { count: descriptionLength })}
          </p>
        </div>
      </div>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

