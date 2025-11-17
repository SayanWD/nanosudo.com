"use client";

import type { ReactElement } from "react";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";
import { URGENCY_COEFFICIENTS } from "../schemas/brief-new";

export function TimelineStep(): ReactElement {
  const {
    form: { register, watch },
    goNext,
  } = useBriefNewStep("timeline");

  const desiredWeeks = watch("timeline.desiredWeeks");
  const phasedDelivery = watch("timeline.phasedDelivery");

  const getUrgencyCoefficient = (weeks: number): number => {
    if (weeks < 4) return URGENCY_COEFFICIENTS.urgent;
    if (weeks <= 8) return URGENCY_COEFFICIENTS.normal;
    return URGENCY_COEFFICIENTS.flexible;
  };

  const urgencyCoeff = getUrgencyCoefficient(desiredWeeks);
  const urgencyLabel =
    desiredWeeks < 4
      ? "Срочно (<4 недели)"
      : desiredWeeks <= 8
        ? "Нормальная (4-8 недель)"
        : "Гибкий график (>8 недель)";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
          <label className="block text-sm font-medium text-foreground mb-2">
            Желаемый срок запуска (недель) <span className="text-error">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="52"
            {...register("timeline.desiredWeeks", { valueAsNumber: true })}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-foreground"
          />
          <div className="mt-3 space-y-2">
            <div className="text-sm text-foreground">
              <strong>Режим:</strong> {urgencyLabel}
            </div>
            <div className="text-xs text-muted-foreground">
              Коэффициент: {urgencyCoeff}x
              {desiredWeeks < 4 && " (срочность увеличивает стоимость на 30%)"}
              {desiredWeeks > 8 && " (гибкий график снижает стоимость на 10%)"}
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("timeline.phasedDelivery")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                Поэтапная сдача
              </div>
              <div className="text-xs text-muted-foreground">
                +10% времени на координацию
              </div>
            </div>
          </label>
        </div>
      </div>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

