import PDFDocument from "pdfkit";

import type { BriefFormValues } from "@/features/brief/types";

const TITLE_COLOR = "#0A0A0A";
const SUBTITLE_COLOR = "#3B82F6";
const TEXT_COLOR = "#1F2937";

export async function generateBriefPdf(
  values: BriefFormValues,
  submissionId: string,
  brandbookFileUrl: string | null,
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (error) => reject(error));

    doc
      .fillColor(TITLE_COLOR)
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("Brief Summary", {
        align: "left",
      });
    doc.moveDown(0.5);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(SUBTITLE_COLOR)
      .text(`Submission ID: ${submissionId}`);
    doc.moveDown(1);

    renderSection(doc, "1. Client & Business", [
      ["Client Name", values.client.clientName],
      ["Industry", values.client.industry],
      ["Geography", formatArray(values.client.geography)],
      ["Languages", formatArray(values.client.languages)],
      ["Business Goals", formatArray(values.client.businessGoals)],
    ]);

    renderSection(doc, "2. Audience & Product", [
      ["Target Audience", values.audience.targetAudience],
      ["Channels", formatArray(values.audience.channels)],
      ["Unique Value Proposition", values.audience.usp || "—"],
      ["Integrations", formatArray(values.audience.integrations)],
    ]);

    renderSection(doc, "3. Metrics & Brand", [
      ["Traffic KPI", values.metrics.kpiTraffic || "—"],
      ["Conversion KPI", values.metrics.kpiConversion || "—"],
      [
        "Brandbook",
        values.metrics.hasBrandbook
          ? brandbookFileUrl
            ? `Provided (file: ${brandbookFileUrl})`
            : "Provided"
          : "Needs assistance",
      ],
      ["Brandbook Link", values.metrics.brandbookLink || "—"],
      ["Brand Tone", `${values.metrics.brandTone}/100`],
    ]);

    renderSection(doc, "4. Contacts", [
      ["Contact Name", values.contact.contactName],
      ["Email", values.contact.contactEmail],
      ["Phone", values.contact.contactPhone || "—"],
      ["Preferred Channel", values.contact.contactMethod],
      ["Team / Roles", values.contact.teamRoles || "—"],
    ]);

    doc.end();
  });
}

function renderSection(
  doc: PDFKit.PDFDocument,
  title: string,
  rows: ReadonlyArray<[string, string]>,
): void {
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(SUBTITLE_COLOR).text(title);
  doc.moveDown(0.3);

  rows.forEach(([label, value]) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(TEXT_COLOR)
      .text(`${label}:`, { continued: true });
    doc.font("Helvetica").fontSize(10).fillColor(TEXT_COLOR).text(` ${value}`);
    doc.moveDown(0.2);
  });

  doc.moveDown(0.6);
}

function formatArray(items: ReadonlyArray<string>): string {
  if (!items || items.length === 0) {
    return "—";
  }
  return items.join(", ");
}
