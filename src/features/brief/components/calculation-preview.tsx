"use client";

import type { ReactElement } from "react";
import { useMemo, useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useBriefNewFormContext } from "./brief-new-form-provider";
import { calculateProjectCost } from "../utils/calculation";
import { HOURLY_RATES } from "../schemas/brief-new";
import { formatCurrency, formatHourlyRate } from "@/lib/currency";
import type { Locale } from "@/i18n/config";

type CalculationPreviewProps = {
  readonly onSubmitRequest?: () => Promise<void>;
  readonly isSubmitting?: boolean;
};

export function CalculationPreview({
  onSubmitRequest,
  isSubmitting = false,
}: CalculationPreviewProps): ReactElement {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { form } = useBriefNewFormContext();
  const values = form.watch();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only calculating after mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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
            {formatCurrency(totalCost, locale)}
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
                {breakdown.discovery}h × {formatHourlyRate(HOURLY_RATES.discovery, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.discovery), locale)}
            </div>
          </div>
        )}

        {breakdown.frontend > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.frontend")}</span>
              <span className="text-sm text-muted-foreground">
                {breakdown.frontend}h × {formatHourlyRate(HOURLY_RATES.frontend, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.frontend), locale)}
            </div>
          </div>
        )}

        {breakdown.backend > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.backend")}</span>
              <span className="text-sm text-muted-foreground">
                {breakdown.backend}h × {formatHourlyRate(HOURLY_RATES.backend, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.backend), locale)}
            </div>
          </div>
        )}

        {breakdown.ecommerce > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.ecommerce")}</span>
              <span className="text-sm text-muted-foreground">
                {breakdown.ecommerce}h × {formatHourlyRate(HOURLY_RATES.ecommerce, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.ecommerce), locale)}
            </div>
          </div>
        )}

        {breakdown.integrations > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.integrations")}</span>
              <span className="text-sm text-muted-foreground">
                {breakdown.integrations}h × {formatHourlyRate(HOURLY_RATES.integrations, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.integrations), locale)}
            </div>
          </div>
        )}

        {breakdown.design > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.design")}</span>
              <span className="text-sm text-muted-foreground">
                {breakdown.design}h × {formatHourlyRate(HOURLY_RATES.design, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.design), locale)}
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
                {breakdown.technical}h × {formatHourlyRate(HOURLY_RATES.technical, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.technical), locale)}
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
                {breakdown.testing}h × {formatHourlyRate(HOURLY_RATES.testing, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.testing), locale)}
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
                {breakdown.deployment}h × {formatHourlyRate(HOURLY_RATES.deployment, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.deployment), locale)}
            </div>
          </div>
        )}

        {breakdown.documentation > 0 && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{t("brief.calculation.breakdown.documentation")}</span>
              <span className="text-sm text-muted-foreground">
                {breakdown.documentation}h × {formatHourlyRate(HOURLY_RATES.documentation, locale)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(costBreakdown.documentation), locale)}
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

