"use client";

import type { ReactElement } from "react";

import { cn } from "@/lib/cn";

import { useBriefStep } from "../hooks/use-brief-step";
import { BriefStepNavigator } from "./brief-step-navigator";

const CHANNEL_OPTIONS: ReadonlyArray<string> = [
  "SEO",
  "Контекст / performance",
  "Соцсети",
  "Email-маркетинг",
  "Партнёрства",
  "Оффлайн",
];

const INTEGRATION_PLACEHOLDERS: ReadonlyArray<string> = [
  "Google Analytics / GA4",
  "Yandex Metrica",
  "CRM (Bitrix, amoCRM, HubSpot)",
  "Платёжные системы",
  "Notion / Airtable",
];

const SECTION_CARD_CLASS =
  "rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft";

export function BriefAudienceStep(): ReactElement {
  const {
    form: { register, watch, setValue, trigger, formState },
    goNext,
  } = useBriefStep("audience");
  const { errors, isSubmitting, isValidating } = formState;

  const selectedChannels = watch("audience.channels") ?? [];
  const selectedIntegrations = watch("audience.integrations") ?? [];

  const audienceErrors = errors.audience;

  const toggleSelection = (
    field: "channels" | "integrations",
    option: string,
  ): void => {
    const current = (watch(`audience.${field}`) as string[] | undefined) ?? [];
    const exists = current.includes(option);
    const next = exists
      ? current.filter((item) => item !== option)
      : [...current, option];
    setValue(`audience.${field}`, next, {
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleNext = async (): Promise<void> => {
    const isValid = await trigger("audience", { shouldFocus: true });
    if (isValid) {
      goNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl text-foreground">
          Аудитория и продукт
        </h2>
        <p className="text-sm text-muted-foreground">
          Опишите, кому вы продаёте и чем продукт отличается — это поможет
          подобрать правильные сценарии и язык интерфейса.
        </p>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Целевая аудитория <span className="text-error">*</span>
          </span>
          <textarea
            rows={6}
            placeholder="Например: владельцы малого бизнеса в Алматы, которым нужен онлайн-продажи и аналитика."
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            {...register("audience.targetAudience")}
          />
          <span className="text-xs text-muted-foreground">
            Подсказка: сегменты, боли, ценность, триггеры покупки.
          </span>
          {audienceErrors?.targetAudience && (
            <span className="text-xs text-error">
              {audienceErrors.targetAudience.message}
            </span>
          )}
        </label>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Каналы привлечения
            </p>
            <p className="text-xs text-muted-foreground">
              Отметьте, где вы уже присутствуете или планируете тестировать.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CHANNEL_OPTIONS.map((option) => {
              const selected = selectedChannels.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleSelection("channels", option)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    selected
                      ? "border-accent/60 bg-accent/15 text-accent"
                      : "border-border/70 bg-surface text-muted-foreground hover:border-accent/40 hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {audienceErrors?.channels && (
            <span className="text-xs text-error">
              {audienceErrors.channels.message}
            </span>
          )}
        </div>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Уникальное предложение (USP)
          </span>
          <textarea
            rows={4}
            placeholder="Например: «Мы внедряем e-commerce за 6 недель с упором на аналитику и интеграции»."
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            {...register("audience.usp")}
          />
          <span className="text-xs text-muted-foreground">
            Опишите, в чём ваша основная ценность, и почему клиенты выбирают
            вас.
          </span>
        </label>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Необходимые интеграции
            </p>
            <p className="text-xs text-muted-foreground">
              Отметьте необходимые сервисы — мы заранее продумаем архитектуру.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTEGRATION_PLACEHOLDERS.map((option) => {
              const selected = selectedIntegrations.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleSelection("integrations", option)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    selected
                      ? "border-accent/60 bg-accent/15 text-accent"
                      : "border-border/70 bg-surface text-muted-foreground hover:border-accent/40 hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <textarea
            rows={3}
            placeholder="Дополнительные сервисы или API..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            {...register("audience.integrations", {
              setValueAs: (value: string[] | string) => {
                if (Array.isArray(value)) {
                  return value;
                }
                if (typeof value === "string" && value.trim().length > 0) {
                  return [...selectedIntegrations, value.trim()];
                }
                return selectedIntegrations;
              },
            })}
          />
          {audienceErrors?.integrations && (
            <span className="text-xs text-error">
              {audienceErrors.integrations.message}
            </span>
          )}
        </div>
      </div>

      <BriefStepNavigator
        onNext={handleNext}
        isNextDisabled={isSubmitting || isValidating}
      />
    </div>
  );
}
