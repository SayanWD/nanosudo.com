import { describe, expect, it } from "vitest";

import { briefStepSchemas } from "./brief";

describe("briefStepSchemas.client", () => {
  const schema = briefStepSchemas.client;

  it("accepts a valid client payload", () => {
    const result = schema.safeParse({
      clientName: "Nanosudo Studio",
      industry: "E-commerce",
      geography: ["Kazakhstan"],
      languages: ["ru", "en"],
      businessGoals: ["Increase CR"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a too short client name", () => {
    const result = schema.safeParse({
      clientName: "A",
      industry: "IT",
      geography: ["Kazakhstan"],
      languages: ["ru"],
      businessGoals: ["Grow"],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["clientName"]);
    }
  });
});

describe("briefStepSchemas.metrics", () => {
  const schema = briefStepSchemas.metrics;

  it("allows empty optional fields", () => {
    const result = schema.safeParse({
      kpiTraffic: "",
      kpiConversion: "",
      hasBrandbook: false,
      brandbookLink: "",
      brandbookFile: null,
      brandTone: 70,
    });

    expect(result.success).toBe(true);
  });

  it("rejects too large brandbook file", () => {
    const file = new File([new Uint8Array(11 * 1024 * 1024)], "brandbook.pdf", {
      type: "application/pdf",
    });

    const result = schema.safeParse({
      kpiTraffic: "20% traffic growth",
      kpiConversion: "",
      hasBrandbook: true,
      brandbookLink: "https://example.com/brandbook",
      brandbookFile: file,
      brandTone: 40,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("Максимальный размер файла");
    }
  });

  it("rejects unsupported mime type", () => {
    const file = new File(["content"], "brandbook.txt", { type: "text/plain" });

    const result = schema.safeParse({
      kpiTraffic: "",
      kpiConversion: "",
      hasBrandbook: true,
      brandbookLink: "",
      brandbookFile: file,
      brandTone: 55,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("Допустимые форматы");
    }
  });
});

describe("briefStepSchemas.contact", () => {
  const schema = briefStepSchemas.contact;

  it("validates correct contact payload", () => {
    const result = schema.safeParse({
      contactName: "Sayan Roor",
      contactEmail: "admin@nanosudo.com",
      contactPhone: "+7 777 123 45 67",
      contactMethod: "email",
      teamRoles: "Founder",
    });

    expect(result.success).toBe(true);
  });

  it("rejects malformed phone number", () => {
    const result = schema.safeParse({
      contactName: "Sayan",
      contactEmail: "admin@nanosudo.com",
      contactPhone: "123",
      contactMethod: "email",
      teamRoles: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["contactPhone"]);
    }
  });
});
