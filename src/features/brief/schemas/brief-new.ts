import { z } from "zod";

// Шаг 1: О проекте
const projectInfoSchema = z.object({
  projectName: z
    .string()
    .min(2, "Укажите название проекта.")
    .max(120, "Название должно быть короче 120 символов."),
  projectType: z.enum([
    "landing",
    "corporate",
    "ecommerce",
    "saas",
    "custom-mvp",
  ]),
  description: z
    .string()
    .min(10, "Опишите проект (минимум 10 символов).")
    .max(500, "Описание должно быть короче 500 символов."),
});

// Шаг 2: Функциональные модули
const frontendModuleSchema = z.object({
  mainPage: z.boolean().default(false),
  innerPages: z.number().int().min(0).max(50).default(0),
  contactForm: z.boolean().default(false),
  interactiveMap: z.boolean().default(false),
  calculator: z.boolean().default(false),
  animations: z.boolean().default(false),
  multilingual: z.boolean().default(false),
});

const backendModuleSchema = z.object({
  restApi: z.boolean().default(false),
  auth: z.boolean().default(false),
  adminPanel: z.boolean().default(false),
  database: z.boolean().default(false),
  fileStorage: z.boolean().default(false),
  emailNotifications: z.boolean().default(false),
});

const ecommerceModuleSchema = z.object({
  catalog: z.boolean().default(false),
  cartCheckout: z.boolean().default(false),
  paymentSystems: z.array(z.string()).default([]),
  userAccount: z.boolean().default(false),
  orderSystem: z.boolean().default(false),
});

const integrationSchema = z.object({
  crm: z.array(z.string()).default([]),
  analytics: z.array(z.string()).default([]),
  emailMarketing: z.array(z.string()).default([]),
  socialMedia: z.boolean().default(false),
  telegramBot: z.boolean().default(false),
  erp1c: z.boolean().default(false),
});

const modulesSchema = z.object({
  frontend: frontendModuleSchema,
  backend: backendModuleSchema,
  ecommerce: ecommerceModuleSchema,
  integrations: integrationSchema,
});

// Шаг 3: Дизайн
const designSchema = z.object({
  useTemplate: z.boolean().default(false),
  adaptBrandbook: z.boolean().default(false),
  designFromScratch: z.boolean().default(false),
  uiKit: z.boolean().default(false),
  pageCount: z.number().int().min(1).max(50).default(1),
});

// Шаг 4: Контент
const contentSchema = z.object({
  clientProvides: z.boolean().default(true),
  needsCopywriting: z.boolean().default(false),
  needsMediaProcessing: z.boolean().default(false),
});

// Шаг 5: Технические требования
const technicalSchema = z.object({
  expectedLoad: z.enum(["low", "medium", "high"]).default("low"),
  highSecurity: z.boolean().default(false),
  pwa: z.boolean().default(false),
  realtime: z.boolean().default(false),
});

// Шаг 6: Сроки и особенности
const timelineSchema = z.object({
  desiredWeeks: z.number().int().min(1).max(52).default(8),
  phasedDelivery: z.boolean().default(false),
});

// Контактная информация
const contactSchema = z.object({
  contactName: z
    .string()
    .min(2, "Укажите имя контактного лица.")
    .max(120, "Имя должно быть короче 120 символов."),
  contactEmail: z.string().email("Укажите корректный email."),
  contactPhone: z
    .string()
    .regex(
      /^\+?[0-9\s\-()]{7,20}$/,
      "Укажите номер в международном формате.",
    )
    .optional()
    .or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
});

export const briefNewStepSchemas = {
  projectInfo: projectInfoSchema,
  modules: modulesSchema,
  design: designSchema,
  content: contentSchema,
  technical: technicalSchema,
  timeline: timelineSchema,
  contact: contactSchema,
} as const;

export const briefNewSchema = z.object(briefNewStepSchemas);

export type BriefNewFormValues = z.infer<typeof briefNewSchema>;
export type BriefNewStepValues<
  TStep extends keyof typeof briefNewStepSchemas,
> = z.infer<(typeof briefNewStepSchemas)[TStep]>;

// Константы для калькуляции - часы по модулям
export const MODULE_HOURS = {
  frontend: {
    mainPage: 10, // Увеличено: сложная структура, SEO, оптимизация
    innerPage: 5, // Увеличено: адаптивность, контент-менеджмент
    contactForm: 4, // Увеличено: валидация, защита от спама
    interactiveMap: 8, // Увеличено: интеграция API, интерактивность
    calculator: 16, // Увеличено: сложная логика, валидация
    animations: 12, // Увеличено: производительность, доступность
    multilingual: 8, // Увеличено: i18n, RTL поддержка
  },
  backend: {
    restApi: 20, // Увеличено: архитектура, документация, тесты
    auth: 16, // Увеличено: безопасность, OAuth, 2FA
    adminPanel: 24, // Увеличено: CRUD, права доступа, фильтры
    database: 12, // Увеличено: миграции, индексы, оптимизация
    fileStorage: 8, // Увеличено: загрузка, обработка, CDN
    emailNotifications: 6, // Увеличено: шаблоны, очереди
  },
  ecommerce: {
    catalog: 20, // Увеличено: фильтры, поиск, пагинация
    cartCheckout: 16, // Увеличено: валидация, платежи, инвентарь
    paymentSystem: 12, // Увеличено: интеграция, обработка ошибок
    userAccount: 20, // Увеличено: история, профиль, адреса
    orderSystem: 16, // Увеличено: статусы, уведомления, логи
  },
  integrations: {
    crm: 20, // Увеличено: синхронизация, маппинг данных
    analytics: 6, // Увеличено: события, конверсии
    emailMarketing: 8, // Увеличено: сегментация, автоматизация
    socialMedia: 10, // Увеличено: OAuth, публикации
    telegramBot: 20, // Увеличено: команды, webhooks, логика
    erp1c: 40, // Увеличено: сложная интеграция, синхронизация
  },
  design: {
    template: 0.5, // коэффициент
    adaptBrandbook: 20, // Увеличено: адаптация, компоненты
    fromScratch: 32, // Увеличено: исследование, концепция, дизайн-система
    uiKit: 16, // Увеличено: компоненты, документация
  },
  technical: {
    highLoad: 24, // Увеличено: кэширование, оптимизация, мониторинг
    highSecurity: 20, // Увеличено: аудит, шифрование, compliance
    pwa: 24, // Увеличено: service workers, оффлайн, push
    realtime: 20, // Увеличено: WebSocket, масштабирование
  },
  fixed: {
    discovery: 12, // Увеличено: анализ, ТЗ, прототипирование
    testing: 0.15, // коэффициент (15% от разработки)
    deployment: 8, // Увеличено: CI/CD, настройка окружений
    documentation: 6, // Увеличено: API docs, руководства
  },
} as const;

// Дифференцированные ставки по типам работ (USD/час)
// Уменьшены на 50% от рыночных ставок для Казахстана/СНГ
export const HOURLY_RATES = {
  discovery: 10, // Discovery & Планирование
  frontend: 20, // Frontend разработка (было 40)
  backend: 25, // Backend разработка (было 50)
  design: 17.5, // UI/UX дизайн (было 35)
  ecommerce: 25, // E-commerce функционал (было 50)
  integrations: 30, // Интеграции (высокая сложность) (было 60)
  technical: 30, // Технические задачи (оптимизация, безопасность) (было 60)
  testing: 15, // Тестирование & QA
  deployment: 30, // Деплой и настройка
  documentation: 10, // Документация
} as const;

// Устаревшая константа для обратной совместимости (используется в расчете)
export const HOURLY_RATE = 50; // USD (средняя ставка)

export const URGENCY_COEFFICIENTS = {
  urgent: 1.3, // <4 недели
  normal: 1.0, // 4-8 недель
  flexible: 0.9, // >8 недель
} as const;

export const COMPLEXITY_COEFFICIENTS = {
  landing: 1.0,
  corporate: 1.1,
  ecommerce: 1.3,
  saas: 1.5,
  "custom-mvp": 1.5,
} as const;

