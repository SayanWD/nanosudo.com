"use client";

import type { ReactElement } from "react";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";

export function ContentStep(): ReactElement {
  const {
    form: { register },
    goNext,
  } = useBriefNewStep("content");

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
              Контент предоставляет клиент
            </div>
            <div className="text-xs text-muted-foreground">0h</div>
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
              Нужен копирайтинг
            </div>
            <div className="text-xs text-muted-foreground">
              Не включено, партнёр
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
              Нужна обработка фото/видео
            </div>
            <div className="text-xs text-muted-foreground">
              Не включено, партнёр
            </div>
          </div>
        </label>
      </div>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

