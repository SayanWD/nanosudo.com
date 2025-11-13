import { expect, type Page } from "@playwright/test";

export const briefApiPattern = "**/api/brief";

type ContactMethodValue = "email" | "telegram" | "whatsapp" | "phone";

const contactMethodLabels: Record<ContactMethodValue, string> = {
  email: "Email",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  phone: "Телефон",
};

type ContactOverrides = {
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly contactMethod?: ContactMethodValue;
  readonly team?: string;
};

export async function completeStepOne(page: Page): Promise<void> {
  await expect(page.getByRole("heading", { name: "О клиенте и бизнесе" })).toBeVisible();
  await page
    .getByLabel("Название компании или проекта", { exact: false })
    .fill("Nanosudo Studio");
  await page.getByLabel("Отрасль", { exact: false }).selectOption({ value: "technology" });
  await page.getByRole("button", { name: "Казахстан" }).click();
  await page.getByRole("button", { name: "Английский" }).click();
  await page.getByRole("button", { name: "Привлечь квалифицированные лиды" }).click();
  await page.getByRole("button", { name: "Далее" }).click();
  await expect(page.getByRole("heading", { name: "Аудитория и продукт" })).toBeVisible();
}

export async function completeStepTwo(page: Page): Promise<void> {
  await expect(page.getByRole("heading", { name: "Аудитория и продукт" })).toBeVisible();
  await page
    .getByLabel("Целевая аудитория", { exact: false })
    .fill("Руководители среднего бизнеса в Алматы, которым нужна цифровая трансформация.");
  await page.getByRole("button", { name: "SEO" }).click();
  await page
    .getByLabel("Уникальное предложение", { exact: false })
    .fill("Комплексный рост за 90 дней с акцентом на аналитику и дизайн.");
  await page.getByRole("button", { name: "CRM (Bitrix, amoCRM, HubSpot)" }).click();
  await page.getByRole("button", { name: "Далее" }).click();
  await expect(page.getByRole("heading", { name: "Метрики и бренд" })).toBeVisible();
}

export async function completeStepThree(page: Page): Promise<void> {
  await expect(page.getByRole("heading", { name: "Метрики и бренд" })).toBeVisible();
  await page
    .getByLabel("Трафик и рост", { exact: false })
    .fill("Увеличить органический трафик до 150k визитов.");
  await page
    .getByLabel("Конверсия и результат", { exact: false })
    .fill("Поддерживать конверсию лидов не ниже 5%.");
  await page.getByText("Нет, нужна помощь с визуалом").click();
  await page
    .locator('input[type="range"]')
    .first()
    .evaluate((slider, value) => {
      const input = slider as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, "65");
  await page.getByRole("button", { name: "Далее" }).click();
  await expect(page.getByRole("heading", { name: "Контакты и команда" })).toBeVisible();
}

export async function fillStepFourFields(
  page: Page,
  overrides: ContactOverrides = {},
): Promise<void> {
  await expect(page.getByRole("heading", { name: "Контакты и команда" })).toBeVisible();
  const contact = {
    name: "Sayan Roor",
    email: "admin@nanosudo.com",
    phone: "+7 777 123 45 67",
    contactMethod: "email" as const,
    team: "Проджект-менеджер, дизайнер, аналитик.",
    ...overrides,
  };

  await page.getByLabel("Имя контактного лица", { exact: false }).fill(contact.name);
  await page.getByPlaceholder("name@company.com").fill(contact.email);
  await page.getByPlaceholder("+7 777 123 45 67").fill(contact.phone);
  await page.getByRole("radio", { name: contactMethodLabels[contact.contactMethod] }).check();
  await page
    .getByLabel("Команда / роли", { exact: false })
    .fill(contact.team);
}

export async function submitBrief(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Отправить бриф" }).click();
}

export async function completeWizard(page: Page): Promise<void> {
  await completeStepOne(page);
  await completeStepTwo(page);
  await completeStepThree(page);
  await fillStepFourFields(page);
  await submitBrief(page);
}
