"use client";

import type { ReactElement } from "react";
import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useBriefNewFormContext } from "./brief-new-form-provider";
import { calculateProjectCost } from "../utils/calculation";
import { HOURLY_RATES } from "../schemas/brief-new";

type CalculationPreviewProps = {
  readonly onSubmitRequest?: () => Promise<void>;
  readonly isSubmitting?: boolean;
};

export function CalculationPreview({
  onSubmitRequest,
  isSubmitting = false,
}: CalculationPreviewProps): ReactElement {
  const t = useTranslations();
  const { form } = useBriefNewFormContext();
  const values = form.watch();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only calculating after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calculation = useMemo(() => {
    if (!isMounted) {
      return null;
    }
    try {
      return calculateProjectCost(values);
    } catch {
      return null;
    }
  }, [values, isMounted]);

  if (!isMounted || !calculation) {
    return (
      <div className="p-6 rounded-lg border border-border/60 bg-surface/80 text-center text-muted-foreground">
        {isMounted ? t("brief.calculation.fillForm") : t("brief.calculation.loading")}
      </div>
    );
  }

  const {
    totalHours,
    totalCost,
    breakdown,
    costBreakdown,
    coefficients,
  } = calculation;

  return (
    <div className="space-y-6">
      {/* Итоговая стоимость */}
      <div className="p-6 rounded-lg border-2 border-accent bg-accent/10">
        <div className="text-center space-y-2">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("brief.calculation.estimatedCost")}
          </div>
          <div 
            className="text-4xl font-bold text-foreground"
            suppressHydrationWarning
          >
            ${totalCost.toLocaleString("en-US")}
          </div>
          <div 
            className="text-sm text-muted-foreground"
            suppressHydrationWarning
          >
            {t("brief.calculation.totalHours", { hours: totalHours })}
          </div>
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-surface/80 rounded">
            {t.rich("brief.calculation.important", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </div>
        </div>
      </div>

      {/* Детальная разбивка */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("brief.calculation.breakdown.title")}
        </h3>

        {breakdown.discovery > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">
                {t("brief.calculation.breakdown.discovery")}
              </span>
              <span className="text-sm text-muted-foreground">
                {breakdown.discovery}h × <span className="text-accent font-semibold">{t("brief.calculation.breakdown.free")}</span>
              </span>
            </div>
            <div className="text-xs text-accent font-semibold">
              {t("brief.calculation.breakdown.freeNote")}
            </div>
          </div>
        )}

        {breakdown.frontend > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.frontend")}</span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.frontend, rate: HOURLY_RATES.frontend })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.frontend).toLocaleString("en-US")}
            </div>
          </div>
        )}

        {breakdown.backend > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.backend")}</span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.backend, rate: HOURLY_RATES.backend })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.backend).toLocaleString("en-US")}
            </div>
          </div>
        )}

        {breakdown.ecommerce > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.ecommerce")}</span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.ecommerce, rate: HOURLY_RATES.ecommerce })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.ecommerce).toLocaleString("en-US")}
            </div>
          </div>
        )}

        {breakdown.integrations > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.integrations")}</span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.integrations, rate: HOURLY_RATES.integrations })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.integrations).toLocaleString("en-US")}
            </div>
          </div>
        )}

        {breakdown.design > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.design")}</span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.design, rate: HOURLY_RATES.design })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.design).toLocaleString("en-US")}
            </div>
          </div>
        )}

        {breakdown.technical > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">
                {t("brief.calculation.breakdown.technical")}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.technical, rate: HOURLY_RATES.technical })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.technical).toLocaleString("en-US")}
            </div>
          </div>
        )}

        {breakdown.testing > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">
                {t("brief.calculation.breakdown.testing")}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.testing, rate: HOURLY_RATES.testing })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.testing).toLocaleString("en-US")}
            </div>
          </div>
        )}

        {breakdown.deployment > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">
                {t("brief.calculation.breakdown.deployment")}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.deployment, rate: HOURLY_RATES.deployment })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.deployment).toLocaleString("en-US")}
            </div>
          </div>
        )}

        {breakdown.documentation > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.documentation")}</span>
              <span className="text-sm text-muted-foreground">
                {t("brief.calculation.breakdown.perHourRu", { hours: breakdown.documentation, rate: HOURLY_RATES.documentation })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${Math.round(costBreakdown.documentation).toLocaleString("en-US")}
            </div>
          </div>
        )}
      </div>

      {/* Коэффициенты */}
      <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
        <div className="text-sm font-semibold text-foreground mb-2">
          {t("brief.calculation.coefficients.title")}
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>
            {t("brief.calculation.coefficients.complexity", { coeff: coefficients.complexity })}
          </div>
          <div>
            {t("brief.calculation.coefficients.urgency", { coeff: coefficients.urgency })}
          </div>
        </div>
      </div>

      {/* Кнопка отправки заявки */}
      {onSubmitRequest && (
        <button
          type="button"
          onClick={onSubmitRequest}
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t("brief.calculation.submit.submitting") : t("brief.calculation.submit.label")}
        </button>
      )}
    </div>
  );
}

