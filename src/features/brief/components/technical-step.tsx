"use client";

import type { ReactElement } from "react";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";
import { MODULE_HOURS } from "../schemas/brief-new";

const LOAD_OPTIONS = [
  { value: "low" as const, label: "<1000 посетителей/день", hours: 0 },
  { value: "medium" as const, label: "1000-10000 посетителей/день", hours: 0 },
  { value: "high" as const, label: ">10000 посетителей/день", hours: MODULE_HOURS.technical.highLoad },
] as const;

export function TechnicalStep(): ReactElement {
  const {
    form: { register, watch },
    goNext,
  } = useBriefNewStep("technical");

  const expectedLoad = watch("technical.expectedLoad");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Ожидаемая нагрузка <span className="text-error">*</span>
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
                      +{option.hours}h на оптимизацию
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
                Высокие требования к безопасности
              </div>
              <div className="text-xs text-muted-foreground">
                +{MODULE_HOURS.technical.highSecurity}h
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
                PWA/оффлайн режим
              </div>
              <div className="text-xs text-muted-foreground">
                +{MODULE_HOURS.technical.pwa}h
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
                Реалтайм функции (WebSocket)
              </div>
              <div className="text-xs text-muted-foreground">
                +{MODULE_HOURS.technical.realtime}h
              </div>
            </div>
          </label>
        </div>
      </div>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

