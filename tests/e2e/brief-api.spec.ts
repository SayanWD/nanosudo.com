import { expect, test } from "@playwright/test";

const buildPayload = () => ({
  data: {
    client: {
      clientName: "Smoke Test Company",
      industry: "technology",
      geography: ["Казахстан"],
      languages: ["ru"],
      businessGoals: ["Привлечь квалифицированные лиды"],
    },
    audience: {
      targetAudience: "Бизнесы, которым нужна цифровая трансформация.",
      channels: ["SEO", "Email-маркетинг"],
      usp: "Комплексное внедрение за 90 дней",
      integrations: ["Google Analytics / GA4"],
    },
    metrics: {
      kpiTraffic: "100k monthly",
      kpiConversion: "5%",
      hasBrandbook: false,
      brandbookLink: "",
      brandTone: 60,
    },
    contact: {
      contactName: "Smoke Tester",
      contactEmail: `smoke-${Date.now()}@nanosudo.com`,
      contactPhone: "+7 700 000 00 00",
      contactMethod: "email",
      teamRoles: "QA Engineer",
    },
  },
});

test("/api/brief returns 200 in test mode", async ({ request }) => {
  const response = await request.post("/api/brief", {
    data: buildPayload(),
    headers: {
      "content-type": "application/json",
    },
  });

  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json).toMatchObject({ id: expect.any(String) });
});
