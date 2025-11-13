import { z } from "zod";

const clientSchema = z.object({
  clientName: z
    .string()
    .min(2, "Укажите название компании или ваше имя.")
    .max(120, "Название должно быть короче 120 символов."),
  industry: z.string().min(1, "Выберите отрасль."),
  geography: z
    .array(z.string().min(1))
    .max(12, "Можно выбрать не более 12 регионов."),
  languages: z
    .array(z.string().min(1))
    .min(1, "Укажите хотя бы один язык коммуникации.")
    .max(8, "Не более 8 языков в списке."),
  businessGoals: z
    .array(z.string().min(1))
    .min(1, "Опишите ключевые бизнес-цели проекта.")
    .max(10, "Не более 10 целей в списке."),
});

const audienceSchema = z.object({
  targetAudience: z
    .string()
    .min(10, "Опишите вашу целевую аудиторию (минимум 10 символов).")
    .max(1_500, "Описание аудитории должно быть короче 1500 символов."),
  channels: z
    .array(z.string().min(1))
    .max(12, "Достаточно указать до 12 каналов."),
  usp: z
    .string()
    .max(
      1_000,
      "Описание уникального предложения должно быть короче 1000 символов.",
    )
    .optional()
    .or(z.literal("")),
  integrations: z
    .array(z.string().min(1))
    .max(20, "Не более 20 интеграций в списке."),
});

const allowedBrandbookMimeTypes = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
]);

const brandbookFileSchema = z
  .custom<File | null>(
    (value) => {
      if (value === null || typeof value === "undefined") {
        return true;
      }
      if (typeof File === "undefined") {
        return false;
      }
      return value instanceof File;
    },
    {
      message: "Допустимые форматы: PDF или ZIP (до 10MB).",
    },
  )
  .transform((value) => {
    if (value === undefined || value === null) {
      return null;
    }
    return value;
  })
  .superRefine((file, ctx) => {
    if (!file) {
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Максимальный размер файла — 10MB.",
      });
    }
    if (!allowedBrandbookMimeTypes.has(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Допустимые форматы: PDF или ZIP.",
      });
    }
  });

const metricsSchema = z.object({
  kpiTraffic: z
    .string()
    .max(500, "Описание метрик трафика должно быть короче 500 символов.")
    .optional()
    .or(z.literal("")),
  kpiConversion: z
    .string()
    .max(500, "Описание конверсионных метрик должно быть короче 500 символов.")
    .optional()
    .or(z.literal("")),
  hasBrandbook: z.boolean(),
  brandbookLink: z
    .string()
    .trim()
    .url("Укажите корректную ссылку на брендбук.")
    .optional()
    .or(z.literal("")),
  brandbookFile: brandbookFileSchema,
  brandTone: z
    .number({
      invalid_type_error: "Выберите тон коммуникации (0–100).",
    })
    .min(0)
    .max(100),
});

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
      "Укажите номер в международном формате (например, +7 777 123 45 67).",
    )
    .optional()
    .or(z.literal("")),
  contactMethod: z.enum(["email", "telegram", "whatsapp", "phone"]),
  teamRoles: z
    .string()
    .max(1_000, "Описание команды должно быть короче 1000 символов.")
    .optional()
    .or(z.literal("")),
});

export const briefStepSchemas = {
  client: clientSchema,
  audience: audienceSchema,
  metrics: metricsSchema,
  contact: contactSchema,
} as const;

export const briefSchema = z.object(briefStepSchemas);

export type BriefFormValues = z.infer<typeof briefSchema>;
export type BriefStepValues<TStep extends keyof typeof briefStepSchemas> =
  z.infer<(typeof briefStepSchemas)[TStep]>;
