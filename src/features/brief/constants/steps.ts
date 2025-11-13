export type BriefStepId = "client" | "audience" | "metrics" | "contact";

export type BriefStepDefinition = {
  readonly id: BriefStepId;
  readonly title: string;
  readonly description: string;
};

export const BRIEF_STEPS: ReadonlyArray<BriefStepDefinition> = [
  {
    id: "client",
    title: "О клиенте и бизнесе",
    description:
      "Основная информация о компании, рынках, языках и целях проекта.",
  },
  {
    id: "audience",
    title: "Аудитория и продукт",
    description:
      "Целевая аудитория, каналы продвижения, уникальное предложение и интеграции.",
  },
  {
    id: "metrics",
    title: "Метрики и визуальная коммуникация",
    description:
      "KPI, брендбук, тональность и дополнительные материалы, которые уже есть.",
  },
  {
    id: "contact",
    title: "Контакты и команда",
    description:
      "Ответственные лица, предпочтительный канал связи и структура команды.",
  },
] as const;

export const BRIEF_STEP_ORDER: ReadonlyArray<BriefStepId> = BRIEF_STEPS.map(
  (step) => step.id,
);
