"use client";

import { useState, type ReactElement } from "react";
import { cn } from "@/lib/cn";

import {
  BUSINESS_GOAL_PRESETS,
  GEOGRAPHY_OPTIONS,
  INDUSTRY_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../constants/options";
import { useBriefStep } from "../hooks/use-brief-step";
import type { BriefFormValues } from "../schemas/brief";
import { BriefStepNavigator } from "./brief-step-navigator";

const SECTION_CARD_CLASS =
  "rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft";

export function BriefClientStep(): ReactElement {
  const {
    form: { register, watch, setValue, trigger, formState },
    goNext,
  } = useBriefStep("client");
  const { errors, isSubmitting, isValidating } = formState;

  const [customGoal, setCustomGoal] = useState<string>("");

  const selectedGeography = watch("client.geography") ?? [];
  const selectedLanguages = watch("client.languages") ?? [];
  const selectedGoals = watch("client.businessGoals") ?? [];

  const clientErrors = errors.client;

  type ClientArrayField = Extract<
    keyof BriefFormValues["client"],
    "geography" | "languages" | "businessGoals"
  >;

  const toggleArrayField = (
    field: ClientArrayField,
    current: ReadonlyArray<string>,
    value: string,
  ): void => {
    const exists = current.includes(value);
    const next = exists
      ? current.filter((item) => item !== value)
      : [...current, value];
    setValue(`client.${field}`, next, {
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleCustomGoalAdd = (): void => {
    const trimmed = customGoal.trim();
    if (
      !trimmed ||
      selectedGoals.some((goal) => goal.toLowerCase() === trimmed.toLowerCase())
    ) {
      return;
    }
    setValue("client.businessGoals", [...selectedGoals, trimmed], {
      shouldTouch: true,
      shouldValidate: true,
    });
    setCustomGoal("");
  };

  const handleRemoveGoal = (goal: string): void => {
    setValue(
      "client.businessGoals",
      selectedGoals.filter((item) => item !== goal),
      { shouldTouch: true, shouldValidate: true },
    );
  };

  const canAddCustomGoal = selectedGoals.length < 10;

  const handleNext = async (): Promise<void> => {
    const isValid = await trigger("client", { shouldFocus: true });
    if (isValid) {
      goNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl text-foreground">
          О клиенте и бизнесе
        </h2>
        <p className="text-sm text-muted-foreground">
          Расскажите, чем занимаетесь сейчас: это поможет сформировать
          релевантный план и оценку сроков.
        </p>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Название компании или проекта <span className="text-error">*</span>
          </span>
          <input
            type="text"
            autoComplete="organization"
            placeholder="Например, Nanosudo или Almaty Logistics"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            {...register("client.clientName")}
          />
          {clientErrors?.clientName && (
            <span className="text-xs text-error">
              {clientErrors.clientName.message}
            </span>
          )}
        </label>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Отрасль / ниша <span className="text-error">*</span>
          </span>
          <select
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            {...register("client.industry")}
            defaultValue=""
          >
            <option value="" disabled>
              Выберите отрасль
            </option>
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {clientErrors?.industry && (
            <span className="text-xs text-error">
              {clientErrors.industry.message}
            </span>
          )}
        </label>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              География и рынки
            </p>
            <p className="text-xs text-muted-foreground">
              Выберите основные регионы, где работает ваш продукт. Можно
              несколько вариантов.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {GEOGRAPHY_OPTIONS.map((option) => {
              const selected = selectedGeography.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    toggleArrayField("geography", selectedGeography, option)
                  }
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
          {clientErrors?.geography && (
            <span className="text-xs text-error">
              {clientErrors.geography.message}
            </span>
          )}
        </div>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Рабочие языки <span className="text-error">*</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Эти языки будут использоваться в интерфейсе и коммуникации.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = selectedLanguages.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    toggleArrayField(
                      "languages",
                      selectedLanguages,
                      option.value,
                    )
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    selected
                      ? "border-accent/60 bg-accent/15 text-accent"
                      : "border-border/70 bg-surface text-muted-foreground hover:border-accent/40 hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {clientErrors?.languages && (
            <span className="text-xs text-error">
              {clientErrors.languages.message}
            </span>
          )}
        </div>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Бизнес-цели проекта <span className="text-error">*</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Выберите релевантные цели или добавьте свои. Это поможет выстроить
              KPI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_GOAL_PRESETS.map((goal) => {
              const selected = selectedGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() =>
                    toggleArrayField("businessGoals", selectedGoals, goal)
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    selected
                      ? "border-accent/60 bg-accent/15 text-accent"
                      : "border-border/70 bg-surface text-muted-foreground hover:border-accent/40 hover:text-foreground",
                  )}
                >
                  {goal}
                </button>
              );
            })}
          </div>
          {canAddCustomGoal && (
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                type="text"
                placeholder="Добавить свою цель"
                value={customGoal}
                onChange={(event) => setCustomGoal(event.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 md:flex-1"
              />
              <button
                type="button"
                onClick={handleCustomGoalAdd}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:mt-0"
              >
                Добавить
              </button>
            </div>
          )}
          {!canAddCustomGoal && (
            <p className="text-xs text-muted-foreground">
              Добавлено максимальное число целей (10). Удалите лишние, если
              хотите добавить новые.
            </p>
          )}
          {clientErrors?.businessGoals && (
            <span className="text-xs text-error">
              {clientErrors.businessGoals.message}
            </span>
          )}
          {selectedGoals.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {selectedGoals.map((goal) => (
                <li key={goal}>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(goal)}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-4 py-2 text-xs text-muted-foreground transition hover:border-accent/50 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {goal}
                    <span aria-hidden className="text-sm">
                      ×
                    </span>
                    <span className="sr-only">Удалить цель {goal}</span>
                  </button>
                </li>
              ))}
            </ul>
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
