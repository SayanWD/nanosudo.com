import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";

import { clientEnv, serverEnv } from "@/config";
import { briefSchema } from "@/features/brief/schemas/brief";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendBrevoEmail } from "@/server/email/brevo";
import { generateBriefPdf } from "@/server/pdf/brief-report";

type BrandbookFilePayload = {
  name: string;
  type: string;
  size: number;
  base64: string;
};

type BriefSubmissionPayload = {
  data: unknown;
  brandbookFile?: BrandbookFilePayload | null;
};

const BRAND_BOOK_BUCKET = "brandbooks";
const isTestMode = process.env.E2E_TEST_MODE === "true";

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = (await request.json()) as BriefSubmissionPayload;
    if (!payload || typeof payload !== "object" || payload.data === undefined) {
      return NextResponse.json(
        { message: "Invalid payload. Expected JSON with `data` property." },
        { status: 400 },
      );
    }

    const rawData = payload.data as Record<string, unknown>;
    const rawMetrics =
      typeof rawData.metrics === "object" && rawData.metrics !== null
        ? (rawData.metrics as Record<string, unknown>)
        : {};

    const parsed = briefSchema.safeParse({
      ...rawData,
      metrics: {
        ...rawMetrics,
        brandbookFile: null,
      },
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const values = parsed.data;

    const submissionId = randomUUID();
    let brandbookFileUrl: string | null = null;

    if (!isTestMode && payload.brandbookFile) {
      if (!payload.brandbookFile.base64 || !payload.brandbookFile.name) {
        return NextResponse.json(
          { message: "Invalid brandbook file payload." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(payload.brandbookFile.base64, "base64");
      const filePath = `${submissionId}/${Date.now()}-${payload.brandbookFile.name}`;

      const uploadResult = await supabaseAdmin.storage
        .from(BRAND_BOOK_BUCKET)
        .upload(filePath, buffer, {
          contentType: payload.brandbookFile.type ?? "application/octet-stream",
          upsert: true,
        });

      if (uploadResult.error) {
        console.error(uploadResult.error);
        return NextResponse.json(
          {
            message:
              "Не удалось сохранить файл брендбука. Проверьте настройки Supabase Storage.",
          },
          { status: 500 },
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from(BRAND_BOOK_BUCKET)
        .getPublicUrl(filePath);

      brandbookFileUrl = publicUrlData.publicUrl ?? null;
    }

    if (isTestMode) {
      return NextResponse.json({ id: submissionId, mode: "test" }, { status: 200 });
    }

    const insertPayload = {
      id: submissionId,
      client_name: values.client.clientName,
      industry: values.client.industry,
      geography: values.client.geography,
      languages: values.client.languages,
      business_goals: values.client.businessGoals,
      target_audience: values.audience.targetAudience,
      channels: values.audience.channels,
      usp: values.audience.usp,
      integrations: values.audience.integrations,
      kpi_traffic: values.metrics.kpiTraffic,
      kpi_conversion: values.metrics.kpiConversion,
      has_brandbook: values.metrics.hasBrandbook,
      brandbook_link: values.metrics.brandbookLink,
      brandbook_file_url: brandbookFileUrl,
      brand_tone: values.metrics.brandTone,
      contact_name: values.contact.contactName,
      contact_email: values.contact.contactEmail,
      contact_phone: values.contact.contactPhone,
      contact_method: values.contact.contactMethod,
      team_roles: values.contact.teamRoles,
      status: "new",
      submitted_ip:
        request.headers.get("x-forwarded-for") ??
        request.headers.get("x-real-ip") ??
        null,
      user_agent: request.headers.get("user-agent"),
    };

    const insertResult = await supabaseAdmin
      .from("submissions")
      .insert(insertPayload);
    if (insertResult.error) {
      console.error(insertResult.error);
      return NextResponse.json(
        { message: "Не удалось сохранить бриф в базе данных." },
        { status: 500 },
      );
    }

    const pdfBuffer = await generateBriefPdf(
      values,
      submissionId,
      brandbookFileUrl,
    );
    const pdfAttachment = {
      name: `brief-${submissionId}.pdf`,
      content: pdfBuffer.toString("base64"),
    };

    await Promise.allSettled([
      sendBrevoEmail({
        to: [
          {
            email:
              serverEnv.BREVO_NOTIFICATION_EMAIL ??
              clientEnv.NEXT_PUBLIC_BREVO_SENDER_EMAIL ??
              values.contact.contactEmail,
          },
        ],
        subject: `Новый бриф: ${values.client.clientName}`,
        html: buildAdminEmailHtml(values, submissionId, brandbookFileUrl),
        replyTo: {
          email: values.contact.contactEmail,
          name: values.contact.contactName,
        },
        attachments: [pdfAttachment],
      }),
      sendBrevoEmail({
        to: [
          {
            email: values.contact.contactEmail,
            name: values.contact.contactName,
          },
        ],
        subject: "Получили ваш бриф — спасибо!",
        html: buildClientEmailHtml(values, submissionId),
        attachments: [pdfAttachment],
      }),
    ]);

    return NextResponse.json({ id: submissionId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Не удалось отправить бриф. Попробуйте позже.",
      },
      { status: 500 },
    );
  }
}

function buildAdminEmailHtml(
  values: ReturnType<typeof briefSchema.parse>,
  submissionId: string,
  brandbookFileUrl: string | null,
): string {
  const renderList = (items: ReadonlyArray<string>): string =>
    items.length > 0
      ? `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
      : "<em>—</em>";

  return `
    <h2>Новая заявка (#${submissionId})</h2>
    <p><strong>Клиент:</strong> ${values.client.clientName}</p>
    <p><strong>Отрасль:</strong> ${values.client.industry}</p>
    <p><strong>География:</strong> ${renderList(values.client.geography)}</p>
    <p><strong>Языки:</strong> ${renderList(values.client.languages)}</p>
    <p><strong>Цели:</strong> ${renderList(values.client.businessGoals)}</p>
    <hr />
    <p><strong>Целевая аудитория:</strong><br />${values.audience.targetAudience.replace(/\n/g, "<br />")}</p>
    <p><strong>Каналы:</strong> ${renderList(values.audience.channels)}</p>
    <p><strong>USP:</strong> ${values.audience.usp || "—"}</p>
    <p><strong>Интеграции:</strong> ${renderList(values.audience.integrations)}</p>
    <hr />
    <p><strong>KPI (трафик):</strong> ${values.metrics.kpiTraffic || "—"}</p>
    <p><strong>KPI (конверсия):</strong> ${values.metrics.kpiConversion || "—"}</p>
    <p><strong>Брендбук:</strong> ${
      values.metrics.hasBrandbook ? "Да" : "Нужно подготовить"
    }</p>
    ${brandbookFileUrl ? `<p><strong>Файл брендбука:</strong> <a href="${brandbookFileUrl}">${brandbookFileUrl}</a></p>` : ""}
    ${values.metrics.brandbookLink ? `<p><strong>Ссылка на брендбук:</strong> <a href="${values.metrics.brandbookLink}">${values.metrics.brandbookLink}</a></p>` : ""}
    <p><strong>Тон бренда:</strong> ${values.metrics.brandTone}/100</p>
    <hr />
    <p><strong>Контакт:</strong> ${values.contact.contactName} (${values.contact.contactEmail})</p>
    <p><strong>Телефон:</strong> ${values.contact.contactPhone || "—"}</p>
    <p><strong>Связаться через:</strong> ${values.contact.contactMethod}</p>
    <p><strong>Команда:</strong><br />${values.contact.teamRoles || "—"}</p>
    <p><em>PDF с полной сводкой прикреплён к письму.</em></p>
  `;
}

function buildClientEmailHtml(
  values: ReturnType<typeof briefSchema.parse>,
  submissionId: string,
): string {
  return `
    <h2>Спасибо за доверие!</h2>
    <p>Я получил ваш бриф №${submissionId}. В течение 24 часов вернусь с первым фидбеком и планом следующих шагов.</p>
    <p>Во вложении — PDF с полной сводкой того, что вы указали в анкете.</p>
    <p><strong>Что дальше:</strong></p>
    <ol>
      <li>Я изучу данные и подготовлю уточняющие вопросы (если будут).</li>
      <li>Мы согласуем формат созвона или письменный фидбек.</li>
      <li>Вы получите детальное предложение с таймингами и бюджетом.</li>
    </ol>
    <p>Если хотите дополнить бриф — просто ответьте на это письмо.</p>
    <p>Хорошего дня!<br />Sayan Roor</p>
  `;
}
