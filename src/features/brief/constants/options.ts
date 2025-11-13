export const INDUSTRY_OPTIONS: ReadonlyArray<{
  readonly value: string;
  readonly label: string;
}> = [
  { value: "technology", label: "Технологии / SaaS" },
  { value: "ecommerce", label: "E-commerce / Ритейл" },
  { value: "education", label: "Образование" },
  { value: "finance", label: "Финтех / Банки" },
  { value: "healthcare", label: "Медицина / Well-being" },
  { value: "services", label: "Услуги / Агентства" },
  { value: "manufacturing", label: "Производство" },
  { value: "other", label: "Другое" },
];

export const GEOGRAPHY_OPTIONS: ReadonlyArray<string> = [
  "Казахстан",
  "СНГ",
  "Европа",
  "США",
  "Ближний Восток",
  "Юго-Восточная Азия",
  "Глобально",
  "Другое",
];

export const LANGUAGE_OPTIONS: ReadonlyArray<{
  readonly value: string;
  readonly label: string;
}> = [
  { value: "ru", label: "Русский" },
  { value: "kk", label: "Казахский" },
  { value: "en", label: "Английский" },
  { value: "de", label: "Немецкий" },
  { value: "fr", label: "Французский" },
  { value: "es", label: "Испанский" },
  { value: "zh", label: "Китайский" },
];

export const BUSINESS_GOAL_PRESETS: ReadonlyArray<string> = [
  "Привлечь квалифицированные лиды",
  "Запустить MVP за 4-8 недель",
  "Редизайн для роста конверсии",
  "Оптимизировать Core Web Vitals",
  "Автоматизировать лид-менеджмент",
  "Интегрировать CRM и аналитику",
];
