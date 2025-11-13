"use client";

import type { ChangeEvent, ReactElement } from "react";

import { cn } from "@/lib/cn";

import { useBriefStep } from "../hooks/use-brief-step";
import { BriefStepNavigator } from "./brief-step-navigator";

const SECTION_CARD_CLASS =
  "rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft";

export function BriefMetricsStep(): ReactElement {
  const {
    form: { register, watch, setValue, trigger, formState },
    goNext,
  } = useBriefStep("metrics");
  const { errors, isSubmitting, isValidating } = formState;

  const hasBrandbook = watch("metrics.hasBrandbook");
  const brandTone = watch("metrics.brandTone") ?? 50;

  const metricsErrors = errors.metrics;

  const handleBrandbookFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0] ?? null;
    setValue("metrics.brandbookFile", file, {
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleToneChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.target.value);
    setValue("metrics.brandTone", value, {
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleNext = async (): Promise<void> => {
    const isValid = await trigger("metrics", { shouldFocus: true });
    if (isValid) {
      goNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl text-foreground">
          Метрики и бренд
        </h2>
        <p className="text-sm text-muted-foreground">
          Определим ключевые KPI, стиль коммуникации и подготовим материалы,
          которые понадобятся для визуала и контента.
        </p>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Трафик и рост
          </span>
          <textarea
            rows={3}
            placeholder="Например: увеличить органический трафик до 5k визитов в месяц или удерживать CPA < $50."
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            {...register("metrics.kpiTraffic")}
          />
        </label>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Конверсия и результат
          </span>
          <textarea
            rows={3}
            placeholder="Например: конверсия из лида в сделку 15%, заявки с формы 4-6 в неделю."
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            {...register("metrics.kpiConversion")}
          />
        </label>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-foreground">
            Есть брендбук или гайд по стилю?
          </p>
          <div className="flex flex-col gap-2 md:flex-row">
            <label
              className={cn(
                "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                hasBrandbook
                  ? "border-accent bg-accent/10 text-accent"
                  : "hover:border-accent/50 hover:text-accent",
              )}
            >
              <input
                type="radio"
                value="true"
                className="sr-only"
                checked={hasBrandbook === true}
                onChange={() =>
                  setValue("metrics.hasBrandbook", true, {
                    shouldValidate: true,
                  })
                }
              />
              Да, брендбук уже есть
            </label>
            <label
              className={cn(
                "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                hasBrandbook === false
                  ? "border-accent bg-accent/10 text-accent"
                  : "hover:border-accent/50 hover:text-accent",
              )}
            >
              <input
                type="radio"
                value="false"
                className="sr-only"
                checked={hasBrandbook === false}
                onChange={() =>
                  setValue("metrics.hasBrandbook", false, {
                    shouldValidate: true,
                  })
                }
              />
              Нет, нужна помощь с визуалом
            </label>
          </div>
        </div>
      </div>

      {hasBrandbook && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className={SECTION_CARD_CLASS}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Ссылка на брендбук / фигму
              </span>
              <input
                type="url"
                placeholder="https://"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                {...register("metrics.brandbookLink")}
              />
              {metricsErrors?.brandbookLink && (
                <span className="text-xs text-error">
                  {metricsErrors.brandbookLink.message}
                </span>
              )}
            </label>
          </div>
          <div className={SECTION_CARD_CLASS}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Прикрепить файл (PDF/ZIP до 10MB)
              </span>
              <input
                type="file"
                accept=".pdf,.zip"
                className="w-full rounded-lg border border-dashed border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                onChange={handleBrandbookFileChange}
              />
              {metricsErrors?.brandbookFile && (
                <span className="text-xs text-error">
                  {metricsErrors.brandbookFile.message}
                </span>
              )}
            </label>
          </div>
        </div>
      )}

      <div className={SECTION_CARD_CLASS}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-foreground">
              Тон бренда (формальный → дружелюбный)
            </p>
            <span className="inline-flex min-w-[48px] justify-end text-sm font-semibold text-accent">
              {brandTone}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={brandTone}
            onChange={handleToneChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted/60 accent-accent"
          />
        </div>
      </div>

      <BriefStepNavigator
        onNext={handleNext}
        isNextDisabled={isSubmitting || isValidating}
      />
    </div>
  );
}
