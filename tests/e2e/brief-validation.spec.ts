import { expect, test } from "@playwright/test";

import {
  completeStepOne,
  completeStepThree,
  completeStepTwo,
  fillStepFourFields,
  submitBrief,
} from "./utils/brief-helpers";

test("step 1 blocks progression when required fields are empty", async ({ page }) => {
  await page.goto("/en/brief");

  await page.getByRole("button", { name: "Далее" }).click();

  await expect(page.getByText("Укажите название компании или ваше имя.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "О клиенте и бизнесе" })).toBeVisible();

  await completeStepOne(page);
  await expect(page.getByRole("heading", { name: "Аудитория и продукт" })).toBeVisible();
});

test("invalid email prevents final submission", async ({ page }) => {
  await page.goto("/en/brief");

  await completeStepOne(page);
  await completeStepTwo(page);
  await completeStepThree(page);
  await fillStepFourFields(page, { email: "invalid-email" });
  await submitBrief(page);

  await expect(page.getByText("Укажите корректный email.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Контакты и команда" })).toBeVisible();
});
