import { expect, test } from "@playwright/test";

import {
  briefApiPattern,
  completeStepOne,
  completeStepTwo,
  completeStepThree,
  fillStepFourFields,
  submitBrief,
} from "./utils/brief-helpers";

test("brief wizard happy path", async ({ page }) => {
  await page.route(briefApiPattern, async (route) => {
    const request = route.request();
    const payload = await request.postDataJSON();
    expect(payload?.data?.client?.clientName).toBe("Nanosudo Studio");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: "test-submission-id" }),
    });
  });

  await page.goto("/en/brief");

  await completeStepOne(page);
  await completeStepTwo(page);
  await completeStepThree(page);
  await fillStepFourFields(page);
  await submitBrief(page);

  await expect(page.getByText("Спасибо! Бриф отправлен.")).toBeVisible();
  await expect(page.getByText(/ID заявки: test-submission-id/)).toBeVisible();
});
