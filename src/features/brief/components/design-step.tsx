"use client";

import type { ReactElement } from "react";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";
import { MODULE_HOURS } from "../schemas/brief-new";

export function DesignStep(): ReactElement {
  const {
    form: { register, watch },
    goNext,
  } = useBriefNewStep("design");

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
                Использовать готовый шаблон
              </div>
              <div className="text-xs text-muted-foreground">
                -50% времени на дизайн
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
                Адаптация существующего брендбука
              </div>
              <div className="text-xs text-muted-foreground">
                {MODULE_HOURS.design.adaptBrandbook}h
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
                Дизайн с нуля
              </div>
              <div className="text-xs text-muted-foreground">
                {MODULE_HOURS.design.fromScratch}-40h (в зависимости от страниц)
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
                UI Kit и дизайн-система
              </div>
              <div className="text-xs text-muted-foreground">
                +{MODULE_HOURS.design.uiKit}h дополнительно
              </div>
            </div>
          </label>
        </div>

        <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
          <label className="block text-sm font-medium text-foreground mb-2">
            Количество страниц
          </label>
          <input
            type="number"
            min="1"
            max="50"
            {...register("design.pageCount", { valueAsNumber: true })}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-foreground"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Текущее значение: {design.pageCount}
          </p>
        </div>
      </div>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

