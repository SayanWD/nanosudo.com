import { beforeEach, describe, expect, it, vi } from "vitest";

const uploadMock = vi.fn();
const getPublicUrlMock = vi.fn();
const storageFromMock = vi.fn(() => ({
  upload: uploadMock,
  getPublicUrl: getPublicUrlMock,
}));

const insertMock = vi.fn();
const tableFromMock = vi.fn(() => ({
  insert: insertMock,
}));

const sendBrevoEmailMock = vi.fn();
const generateBriefPdfMock = vi.fn();

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    storage: {
      from: storageFromMock,
    },
    from: tableFromMock,
  },
}));

vi.mock("@/server/email/brevo", () => ({
  sendBrevoEmail: sendBrevoEmailMock,
}));

vi.mock("@/server/pdf/brief-report", () => ({
  generateBriefPdf: generateBriefPdfMock,
}));

const validPayload = {
  data: {
    client: {
      clientName: "Nanosudo Studio",
      industry: "E-commerce",
      geography: ["Kazakhstan"],
      languages: ["ru"],
      businessGoals: ["Increase CR"],
    },
    audience: {
      targetAudience: "SMBs looking for digital transformation.",
      channels: ["email", "seo"],
      usp: "Full-service marketing",
      integrations: ["crm"],
    },
    metrics: {
      kpiTraffic: "200k monthly sessions",
      kpiConversion: "5%",
      hasBrandbook: true,
      brandbookLink: "https://example.com/brandbook",
      brandTone: 65,
    },
    contact: {
      contactName: "Sayan Roor",
      contactEmail: "admin@nanosudo.com",
      contactPhone: "+7 777 123 45 67",
      contactMethod: "email",
      teamRoles: "Founder",
    },
  },
  brandbookFile: {
    name: "brandbook.pdf",
    type: "application/pdf",
    size: 6,
    base64: Buffer.from("PDF").toString("base64"),
  },
};

const runPost = async (payload: unknown): Promise<Response> => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.test");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
  vi.stubEnv("NEXT_PUBLIC_BREVO_SENDER_EMAIL", "sender@nanosudo.com");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");
  vi.stubEnv("BREVO_API_KEY", "brevo-key");
  vi.stubEnv("BREVO_NOTIFICATION_EMAIL", "notify@nanosudo.com");

  const { POST } = await import("./route");
  return POST(
    new Request("http://localhost/api/brief", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "vitest",
      },
      body: JSON.stringify(payload),
    }),
  );
};

describe("POST /api/brief", () => {
  beforeEach(() => {
    uploadMock.mockResolvedValue({ data: { path: "brandbooks/test.pdf" }, error: null });
    getPublicUrlMock.mockReturnValue({ data: { publicUrl: "https://cdn.test/brandbook.pdf" } });
    insertMock.mockResolvedValue({ data: null, error: null });
    sendBrevoEmailMock.mockResolvedValue(undefined);
    generateBriefPdfMock.mockResolvedValue(Buffer.from("PDF"));
    storageFromMock.mockClear();
    tableFromMock.mockClear();
    uploadMock.mockClear();
    getPublicUrlMock.mockClear();
    insertMock.mockClear();
    sendBrevoEmailMock.mockClear();
    generateBriefPdfMock.mockClear();
  });

  it("stores submission, uploads brandbook and sends emails", async () => {
    const response = await runPost(validPayload);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("id");

    expect(storageFromMock).toHaveBeenCalledWith("brandbooks");
    expect(uploadMock).toHaveBeenCalledTimes(1);
    expect(getPublicUrlMock).toHaveBeenCalledTimes(1);
    expect(tableFromMock).toHaveBeenCalledWith("submissions");
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        client_name: "Nanosudo Studio",
        brandbook_file_url: "https://cdn.test/brandbook.pdf",
        user_agent: "vitest",
      }),
    );
    expect(generateBriefPdfMock).toHaveBeenCalledTimes(1);
    expect(sendBrevoEmailMock).toHaveBeenCalledTimes(2);
  });

  it("returns 400 when validation fails", async () => {
    const invalidPayload = {
      data: {
        client: {
          clientName: "",
          industry: "E-commerce",
          geography: ["Kazakhstan"],
          languages: ["ru"],
          businessGoals: ["Increase CR"],
        },
        audience: validPayload.data.audience,
        metrics: validPayload.data.metrics,
        contact: validPayload.data.contact,
      },
    };

    const response = await runPost(invalidPayload);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("message", "Validation failed.");
    expect(insertMock).not.toHaveBeenCalled();
    expect(sendBrevoEmailMock).not.toHaveBeenCalled();
  });
});
