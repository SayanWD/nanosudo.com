export type BriefNewStepId =
  | "projectInfo"
  | "modules"
  | "design"
  | "content"
  | "technical"
  | "timeline"
  | "contact";

export type BriefNewStepDefinition = {
  readonly id: BriefNewStepId;
  readonly title: string;
  readonly description: string;
};

export const BRIEF_NEW_STEPS: ReadonlyArray<BriefNewStepDefinition> = [
  {
    id: "projectInfo",
    title: "О проекте",
    description: "Название, тип проекта и краткое описание.",
  },
  {
    id: "modules",
    title: "Функциональные модули",
    description: "Выберите необходимые модули Frontend, Backend, E-commerce и интеграции.",
  },
  {
    id: "design",
    title: "Дизайн",
    description: "Выберите подход к дизайну и количество страниц.",
  },
  {
    id: "content",
    title: "Контент",
    description: "Укажите, кто будет предоставлять контент для проекта.",
  },
  {
    id: "technical",
    title: "Технические требования",
    description: "Ожидаемая нагрузка и дополнительные технические требования.",
  },
  {
    id: "timeline",
    title: "Сроки и особенности",
    description: "Желаемый срок запуска и особенности работы над проектом.",
  },
  {
    id: "contact",
    title: "Контактная информация",
    description: "Ваши контактные данные для связи.",
  },
] as const;

export const BRIEF_NEW_STEP_ORDER: ReadonlyArray<BriefNewStepId> =
  BRIEF_NEW_STEPS.map((step) => step.id);

