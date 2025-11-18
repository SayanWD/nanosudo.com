import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { sendBrevoEmail } from "@/server/email/brevo";
import type { BriefNewFormValues } from "@/features/brief/schemas/brief-new";
import type { CalculationResult } from "@/features/brief/utils/calculation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type BriefNewSubmissionPayload = {
  readonly formData: BriefNewFormValues;
  readonly calculation: CalculationResult;
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as BriefNewSubmissionPayload;
    const { formData, calculation } = body;

    if (!formData || !calculation) {
      return NextResponse.json(
        { error: "Missing formData or calculation" },
        { status: 400 },
      );
    }

    if (!formData.projectInfo?.projectName || !formData.contact?.contactEmail) {
      return NextResponse.json(
        { error: "Project name and contact email are required" },
        { status: 400 },
      );
    }

    const submissionId = randomUUID();

    // Сохраняем заявку в базу данных
    const insertPayload = {
      id: submissionId,
      project_name: formData.projectInfo.projectName,
      project_type: formData.projectInfo.projectType,
      project_description: formData.projectInfo.description,
      contact_name: formData.contact.contactName,
      contact_email: formData.contact.contactEmail,
      contact_phone: formData.contact.contactPhone || null,
      company_name: formData.contact.companyName || null,
      total_cost: Math.round(calculation.totalCost * 100) / 100, // Round to 2 decimal places for numeric(12,2)
      total_hours: Math.round(calculation.totalHours), // Ensure integer for total_hours
      calculation_breakdown: calculation.breakdown,
      cost_breakdown: calculation.costBreakdown,
      form_data: formData,
      status: "new",
      submitted_ip:
        request.headers.get("x-forwarded-for") ??
        request.headers.get("x-real-ip") ??
        null,
      user_agent: request.headers.get("user-agent"),
    };

    const insertResult = await supabaseAdmin
      .from("brief_submissions")
      .insert(insertPayload)
      .select()
      .single();

    if (insertResult.error) {
      console.error("[Brief Submission] Database insert error:", {
        error: insertResult.error,
        code: insertResult.error.code,
        message: insertResult.error.message,
        details: insertResult.error.details,
        hint: insertResult.error.hint,
      });
      return NextResponse.json(
        { 
          error: "Failed to save submission",
          details: insertResult.error.message,
        },
        { status: 500 },
      );
    }

    // Отправляем email уведомления
    const adminEmail = process.env.BREVO_NOTIFICATION_EMAIL;
    const senderEmail = process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL;

    if (adminEmail && senderEmail) {
      await Promise.allSettled([
        // Email администратору
        sendBrevoEmail({
          to: [{ email: adminEmail }],
          subject: `Новая заявка: ${formData.projectInfo.projectName}`,
          html: buildAdminEmailHtml(formData, calculation, submissionId),
          replyTo: {
            email: formData.contact.contactEmail,
            name: formData.contact.contactName,
          },
        }),
        // Email клиенту
        sendBrevoEmail({
          to: [
            {
              email: formData.contact.contactEmail,
              name: formData.contact.contactName,
            },
          ],
          subject: "Заявка получена — спасибо!",
          html: buildClientEmailHtml(formData, calculation),
        }),
      ]);
    }

    return NextResponse.json({ id: submissionId }, { status: 200 });
  } catch (error) {
    console.error("Error processing brief submission:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process submission",
      },
      { status: 500 },
    );
  }
}

function buildAdminEmailHtml(
  formData: BriefNewFormValues,
  calculation: CalculationResult,
  submissionId: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0A0A0A; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; color: #0A0A0A; }
        .value { margin-left: 10px; }
        .calculation { background: white; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .total { font-size: 24px; font-weight: bold; color: #3B82F6; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Новая заявка</h1>
          <p>ID: ${submissionId}</p>
        </div>
        <div class="content">
          <div class="section">
            <span class="label">Проект:</span>
            <span class="value">${formData.projectInfo.projectName}</span>
          </div>
          <div class="section">
            <span class="label">Тип:</span>
            <span class="value">${formData.projectInfo.projectType}</span>
          </div>
          <div class="section">
            <span class="label">Контакт:</span>
            <span class="value">${formData.contact.contactName} (${formData.contact.contactEmail})</span>
          </div>
          <div class="calculation">
            <h3>Расчет стоимости:</h3>
            <p>Часов: ${calculation.totalHours}</p>
            <p class="total">Стоимость: $${calculation.totalCost.toLocaleString("en-US")}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildClientEmailHtml(
  formData: BriefNewFormValues,
  calculation: CalculationResult,
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0A0A0A; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .notice { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .calculation { background: white; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .total { font-size: 24px; font-weight: bold; color: #3B82F6; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Заявка получена!</h1>
        </div>
        <div class="content">
          <p>Здравствуйте, ${formData.contact.contactName}!</p>
          <p>Спасибо за вашу заявку на проект <strong>${formData.projectInfo.projectName}</strong>.</p>
          
          <div class="notice">
            <p><strong>Важно:</strong> Мы рассмотрим вашу заявку и свяжемся с вами для уточнения деталей и финальной стоимости проекта.</p>
            <p>Указанная стоимость является <strong>ориентировочной</strong>. Финальные тарифы будут скорректированы после обсуждения деталей проекта.</p>
          </div>
          
          <div class="calculation">
            <h3>Ориентировочная стоимость:</h3>
            <p>Часов: ${calculation.totalHours}</p>
            <p class="total">$${calculation.totalCost.toLocaleString("en-US")}</p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              * Discovery & Планирование — $10/ч<br>
              * Все тарифы уменьшены на 50% от рыночных
            </p>
          </div>
          
          <p>Мы свяжемся с вами в ближайшее время!</p>
          <p>С уважением,<br>Sayan Roor</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

