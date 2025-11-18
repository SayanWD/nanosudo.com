import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { Buffer } from "node:buffer";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import type { BriefNewFormValues } from "@/features/brief/schemas/brief-new";
import type { CalculationResult } from "@/features/brief/utils/calculation";

type GeneratePDFRequest = {
  readonly formData: BriefNewFormValues;
  readonly calculation: CalculationResult;
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  landing: "Landing page",
  corporate: "Корпоративный сайт",
  ecommerce: "E-commerce",
  saas: "SaaS платформа",
  "custom-mvp": "Custom MVP",
};

function formatModuleDetails(formData: BriefNewFormValues): string {
  const details: string[] = [];

  // Frontend
  if (formData.modules.frontend.mainPage) details.push("• Главная страница");
  if (formData.modules.frontend.innerPages > 0) {
    details.push(`• Внутренние страницы (${formData.modules.frontend.innerPages} шт.)`);
  }
  if (formData.modules.frontend.contactForm) details.push("• Форма обратной связи");
  if (formData.modules.frontend.interactiveMap) details.push("• Интерактивная карта");
  if (formData.modules.frontend.calculator) details.push("• Калькулятор/конфигуратор");
  if (formData.modules.frontend.animations) details.push("• Анимации и интерактив");
  if (formData.modules.frontend.multilingual) details.push("• Мультиязычность");

  // Backend
  if (formData.modules.backend.restApi) details.push("• REST API");
  if (formData.modules.backend.auth) details.push("• Авторизация/регистрация");
  if (formData.modules.backend.adminPanel) details.push("• Панель администратора");
  if (formData.modules.backend.database) details.push("• База данных и модели");
  if (formData.modules.backend.fileStorage) details.push("• Файловое хранилище");
  if (formData.modules.backend.emailNotifications) details.push("• Email-уведомления");

  // E-commerce
  if (formData.modules.ecommerce.catalog) details.push("• Каталог товаров");
  if (formData.modules.ecommerce.cartCheckout) details.push("• Корзина и чекаут");
  if (formData.modules.ecommerce.paymentSystems.length > 0) {
    details.push(`• Платежные системы (${formData.modules.ecommerce.paymentSystems.length} шт.)`);
  }
  if (formData.modules.ecommerce.userAccount) details.push("• Личный кабинет покупателя");
  if (formData.modules.ecommerce.orderSystem) details.push("• Система заказов");

  // Integrations
  if (formData.modules.integrations.crm.length > 0) {
    details.push(`• CRM системы (${formData.modules.integrations.crm.length} шт.)`);
  }
  if (formData.modules.integrations.analytics.length > 0) {
    details.push(`• Аналитика (${formData.modules.integrations.analytics.length} шт.)`);
  }
  if (formData.modules.integrations.emailMarketing.length > 0) {
    details.push(`• Email-маркетинг (${formData.modules.integrations.emailMarketing.length} шт.)`);
  }
  if (formData.modules.integrations.socialMedia) details.push("• Социальные сети");
  if (formData.modules.integrations.telegramBot) details.push("• Телеграм-бот");
  if (formData.modules.integrations.erp1c) details.push("• 1С/ERP системы");

  return details.length > 0 ? details.join("\n") : "Не указано";
}

export async function POST(
  request: Request,
): Promise<NextResponse> {
  try {
    let body: GeneratePDFRequest;
    try {
      body = (await request.json()) as GeneratePDFRequest;
    } catch (parseError) {
      console.error("[PDF] JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body", details: parseError instanceof Error ? parseError.message : String(parseError) },
        { status: 400 },
      );
    }

    const { formData, calculation } = body;

    // Validate input
    if (!formData || !calculation) {
      console.error("[PDF] Missing formData or calculation", {
        hasFormData: !!formData,
        hasCalculation: !!calculation,
      });
      return NextResponse.json(
        { error: "Missing formData or calculation" },
        { status: 400 },
      );
    }

    if (!formData.projectInfo?.projectName) {
      console.error("[PDF] Project name is required");
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    // Validate calculation structure
    if (!calculation.costBreakdown) {
      console.error("[PDF] Missing costBreakdown in calculation", {
        calculationKeys: Object.keys(calculation),
      });
      return NextResponse.json(
        { error: "Invalid calculation structure: missing costBreakdown" },
        { status: 400 },
      );
    }

    // Create PDF
    // PDFKit automatically tries to load fonts on initialization
    // In Next.js/Turbopack, font paths may be incorrect
    // We need to patch the font loading mechanism
    
    // Patch PDFKit's font loading to use correct paths
    const pdfkitPath = require.resolve("pdfkit");
    const pdfkitRoot = dirname(dirname(pdfkitPath));
    const fontDataPath = join(pdfkitRoot, "js", "data");
    
    // Monkey-patch fs.readFileSync to intercept font file reads
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fsModule = require("fs") as { readFileSync: (path: string, ...args: unknown[]) => Buffer | string };
    const originalReadFileSync = fsModule.readFileSync;
    const patchedReadFileSync = (filePath: string, ...args: unknown[]): Buffer | string => {
      // If PDFKit is trying to read a font file with incorrect path, redirect it
      if (typeof filePath === "string" && filePath.includes("Helvetica.afm")) {
        const correctPath = join(fontDataPath, "Helvetica.afm");
        if (existsSync(correctPath)) {
          return originalReadFileSync(correctPath, ...args);
        }
      }
      return originalReadFileSync(filePath, ...args);
    };
    
    // Temporarily replace readFileSync
    fsModule.readFileSync = patchedReadFileSync;
    
    let doc: InstanceType<typeof PDFDocument>;
    try {
      // Create PDFDocument - it will use our patched readFileSync
      doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });
    } finally {
      // Restore original readFileSync
      fsModule.readFileSync = originalReadFileSync;
    }

    // Титульная страница
    doc.fontSize(20).text("Sayan Roor", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text("Full-stack разработчик", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(24).text("Коммерческое предложение", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(18).text(formData.projectInfo.projectName, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(
      `Дата: ${new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
      { align: "center" },
    );
    doc.moveDown();
    doc.fontSize(10).text(
      `КП №${Date.now().toString().slice(-6)}`,
      { align: "center" },
    );

    doc.addPage();

    // Executive Summary
    doc.fontSize(16).text("Executive Summary", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(formData.projectInfo.description);
    doc.moveDown();
    doc.fontSize(14).text("Основные цели:", { underline: true });
    doc.fontSize(12).text(
      `Тип проекта: ${PROJECT_TYPE_LABELS[formData.projectInfo.projectType] ?? formData.projectInfo.projectType}`,
    );
    doc.moveDown();
    doc.fontSize(14).text("Общая стоимость и сроки:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(20).text(
      `$${calculation.totalCost.toLocaleString("en-US")}`,
      { align: "center" },
    );
    doc.fontSize(12).text(
      `${calculation.totalHours} часов`,
      { align: "center" },
    );
    doc.fontSize(12).text(
      `Срок: ${formData.timeline.desiredWeeks} недель`,
      { align: "center" },
    );

    doc.addPage();

    // Детальная смета
    doc.fontSize(16).text("Детальная смета", { underline: true });
    doc.moveDown();

    // Discovery
    if (calculation.breakdown.discovery > 0) {
      doc.fontSize(14).text("ЭТАП 1: DISCOVERY & ПЛАНИРОВАНИЕ", {
        underline: true,
      });
      doc.moveDown(0.5);
      doc.fontSize(12).text(
        `• Анализ требований, техническая спецификация, прототипирование`,
        { indent: 20 },
      );
      doc.fontSize(12).text(
        `${calculation.breakdown.discovery}h × $10/ч = $${Math.round(calculation.costBreakdown.discovery).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // Design
    if (calculation.breakdown.design > 0) {
      doc.fontSize(14).text("ЭТАП 2: ДИЗАЙН", { underline: true });
      doc.moveDown(0.5);
      let designDescription = "• UI/UX дизайн";
      if (formData.design.useTemplate) {
        designDescription += " (готовый шаблон)";
      } else if (formData.design.adaptBrandbook) {
        designDescription += " (адаптация брендбука)";
      } else if (formData.design.designFromScratch) {
        designDescription += " (дизайн с нуля)";
      }
      if (formData.design.uiKit) {
        designDescription += " + UI Kit";
      }
      designDescription += ` (${formData.design.pageCount} страниц)`;
      doc.fontSize(12).text(designDescription, { indent: 20 });
      doc.fontSize(12).text(
        `${calculation.breakdown.design}h × $35/ч = $${Math.round(calculation.costBreakdown.design).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // Frontend
    if (calculation.breakdown.frontend > 0) {
      doc.fontSize(14).text("ЭТАП 3: FRONTEND", { underline: true });
      doc.moveDown(0.5);
      const frontendDetails = formatModuleDetails(formData)
        .split("\n")
        .filter((line) => line.startsWith("•") && (
          line.includes("Главная") ||
          line.includes("Внутренние") ||
          line.includes("Форма") ||
          line.includes("карта") ||
          line.includes("Калькулятор") ||
          line.includes("Анимации") ||
          line.includes("Мультиязычность")
        ));
      if (frontendDetails.length > 0) {
        frontendDetails.forEach((detail) => {
          doc.fontSize(11).text(detail, { indent: 20 });
        });
      } else {
        doc.fontSize(12).text(`• Разработка интерфейса`, { indent: 20 });
      }
      doc.fontSize(12).text(
        `${calculation.breakdown.frontend}h × $40/ч = $${Math.round(calculation.costBreakdown.frontend).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // Backend
    if (calculation.breakdown.backend > 0) {
      doc.fontSize(14).text("ЭТАП 4: BACKEND", { underline: true });
      doc.moveDown(0.5);
      const backendDetails = formatModuleDetails(formData)
        .split("\n")
        .filter((line) => line.startsWith("•") && (
          line.includes("REST API") ||
          line.includes("Авторизация") ||
          line.includes("Панель администратора") ||
          line.includes("База данных") ||
          line.includes("Файловое хранилище") ||
          line.includes("Email-уведомления")
        ));
      if (backendDetails.length > 0) {
        backendDetails.forEach((detail) => {
          doc.fontSize(11).text(detail, { indent: 20 });
        });
      } else {
        doc.fontSize(12).text(`• Backend разработка`, { indent: 20 });
      }
      doc.fontSize(12).text(
        `${calculation.breakdown.backend}h × $50/ч = $${Math.round(calculation.costBreakdown.backend).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // E-commerce
    if (calculation.breakdown.ecommerce > 0) {
      doc.fontSize(14).text("ЭТАП 5: E-COMMERCE", { underline: true });
      doc.moveDown(0.5);
      const ecommerceDetails = formatModuleDetails(formData)
        .split("\n")
        .filter((line) => line.startsWith("•") && (
          line.includes("Каталог") ||
          line.includes("Корзина") ||
          line.includes("Платежные системы") ||
          line.includes("Личный кабинет") ||
          line.includes("Система заказов")
        ));
      if (ecommerceDetails.length > 0) {
        ecommerceDetails.forEach((detail) => {
          doc.fontSize(11).text(detail, { indent: 20 });
        });
      } else {
        doc.fontSize(12).text(`• E-commerce функционал`, { indent: 20 });
      }
      doc.fontSize(12).text(
        `${calculation.breakdown.ecommerce}h × $50/ч = $${Math.round(calculation.costBreakdown.ecommerce).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // Integrations
    if (calculation.breakdown.integrations > 0) {
      doc.fontSize(14).text("ЭТАП 6: ИНТЕГРАЦИИ", { underline: true });
      doc.moveDown(0.5);
      const integrationDetails = formatModuleDetails(formData)
        .split("\n")
        .filter((line) => line.startsWith("•") && (
          line.includes("CRM") ||
          line.includes("Аналитика") ||
          line.includes("Email-маркетинг") ||
          line.includes("Социальные сети") ||
          line.includes("Телеграм-бот") ||
          line.includes("1С/ERP")
        ));
      if (integrationDetails.length > 0) {
        integrationDetails.forEach((detail) => {
          doc.fontSize(11).text(detail, { indent: 20 });
        });
      } else {
        doc.fontSize(12).text(`• Интеграции с внешними системами`, {
          indent: 20,
        });
      }
      doc.fontSize(12).text(
        `${calculation.breakdown.integrations}h × $60/ч = $${Math.round(calculation.costBreakdown.integrations).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // Technical
    if (calculation.breakdown.technical > 0) {
      doc.fontSize(14).text("ЭТАП 7: ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ", {
        underline: true,
      });
      doc.moveDown(0.5);
      const technicalDetails: string[] = [];
      if (formData.technical.expectedLoad === "high") {
        technicalDetails.push("• Высокая нагрузка (>10000 посетителей/день)");
      }
      if (formData.technical.highSecurity) {
        technicalDetails.push("• Высокие требования к безопасности");
      }
      if (formData.technical.pwa) {
        technicalDetails.push("• PWA/оффлайн режим");
      }
      if (formData.technical.realtime) {
        technicalDetails.push("• Реалтайм функции (WebSocket)");
      }
      if (technicalDetails.length > 0) {
        technicalDetails.forEach((detail) => {
          doc.fontSize(11).text(detail, { indent: 20 });
        });
      } else {
        doc.fontSize(12).text(`• Дополнительные технические требования`, {
          indent: 20,
        });
      }
      doc.fontSize(12).text(
        `${calculation.breakdown.technical}h × $60/ч = $${Math.round(calculation.costBreakdown.technical).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // Testing
    if (calculation.breakdown.testing > 0) {
      doc.fontSize(14).text("ЭТАП 8: ТЕСТИРОВАНИЕ & QA", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`• Тестирование и QA (15% от разработки)`, {
        indent: 20,
      });
      doc.fontSize(12).text(
        `${calculation.breakdown.testing}h × $15/ч = $${Math.round(calculation.costBreakdown.testing).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // Deployment
    if (calculation.breakdown.deployment > 0) {
      doc.fontSize(14).text("ЭТАП 9: ДЕПЛОЙ И НАСТРОЙКА", {
        underline: true,
      });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`• Деплой и настройка`, { indent: 20 });
      doc.fontSize(12).text(
        `${calculation.breakdown.deployment}h × $30/ч = $${Math.round(calculation.costBreakdown.deployment).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    // Documentation
    if (calculation.breakdown.documentation > 0) {
      doc.fontSize(14).text("ЭТАП 10: ДОКУМЕНТАЦИЯ", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`• Документация`, { indent: 20 });
      doc.fontSize(12).text(
        `${calculation.breakdown.documentation}h × $10/ч = $${Math.round(calculation.costBreakdown.documentation).toLocaleString("en-US")}`,
        { align: "right" },
      );
      doc.moveDown();
    }

    doc.addPage();

    // Итого
    doc.fontSize(16).text("ИТОГО", { underline: true });
    doc.moveDown();
    const developmentHours =
      calculation.breakdown.frontend +
      calculation.breakdown.backend +
      calculation.breakdown.ecommerce +
      calculation.breakdown.integrations +
      calculation.breakdown.design +
      calculation.breakdown.technical +
      calculation.breakdown.discovery +
      calculation.breakdown.deployment +
      calculation.breakdown.documentation;
    const developmentCost = Math.round(
      calculation.costBreakdown.frontend +
      calculation.costBreakdown.backend +
      calculation.costBreakdown.ecommerce +
      calculation.costBreakdown.integrations +
      calculation.costBreakdown.design +
      calculation.costBreakdown.technical +
      calculation.costBreakdown.discovery +
      calculation.costBreakdown.deployment +
      calculation.costBreakdown.documentation,
    );

    doc.fontSize(12).text(`Разработка: ${developmentHours}h  $${developmentCost.toLocaleString("en-US")}`);
    doc.fontSize(12).text(
      `Тестирование & QA (15%): ${calculation.breakdown.testing}h  $${Math.round(calculation.costBreakdown.testing).toLocaleString("en-US")}`,
    );
    doc.fontSize(12).text(
      `Деплой и настройка: ${calculation.breakdown.deployment}h  $${Math.round(calculation.costBreakdown.deployment).toLocaleString("en-US")}`,
    );
    doc.fontSize(12).text(
      `Документация: ${calculation.breakdown.documentation}h  $${Math.round(calculation.costBreakdown.documentation).toLocaleString("en-US")}`,
    );
    doc.moveDown();
    doc.fontSize(14).text(
      `ОБЩАЯ СТОИМОСТЬ: ${calculation.totalHours}h  $${calculation.totalCost.toLocaleString("en-US")}`,
      { underline: true },
    );

    // Контактная информация
    doc.addPage();
    doc.fontSize(16).text("Контактная информация", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Контактное лицо: ${formData.contact.contactName}`);
    if (formData.contact.companyName) {
      doc.fontSize(12).text(`Компания: ${formData.contact.companyName}`);
    }
    doc.fontSize(12).text(`Email: ${formData.contact.contactEmail}`);
    if (formData.contact.contactPhone) {
      doc.fontSize(12).text(`Телефон: ${formData.contact.contactPhone}`);
    }
    doc.moveDown();
    doc.fontSize(12).text("Sayan Roor", { underline: true });
    doc.fontSize(11).text("Full-stack разработчик");
    doc.fontSize(11).text("Email: roorsayan@gmail.com");
    doc.fontSize(11).text("Телефон: +7 747 827 74 85");
    doc.fontSize(11).text("Сайт: https://nanosudo.com");

    // Generate PDF buffer
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      
      // Set up event handlers BEFORE calling doc.end()
      doc.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      doc.on("end", () => {
        try {
          const buffer = Buffer.concat(chunks);
          if (buffer.length === 0) {
            console.error("[PDF] Generated PDF is empty");
            reject(new Error("Generated PDF is empty"));
          } else {
            resolve(buffer);
          }
        } catch (err) {
          console.error("[PDF] Error concatenating chunks:", err);
          reject(err instanceof Error ? err : new Error("Failed to concatenate PDF chunks"));
        }
      });
      
      doc.on("error", (err: Error) => {
        console.error("[PDF] PDFDocument error:", err);
        reject(err);
      });

      // Finalize PDF - this triggers the 'data' and 'end' events
      try {
        doc.end();
      } catch (err) {
        console.error("[PDF] Error calling doc.end():", err);
        reject(err instanceof Error ? err : new Error("Failed to finalize PDF document"));
      }
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="commercial-proposal-${formData.projectInfo.projectName || "project"}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[PDF] Error generating PDF:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error("[PDF] Error details:", { 
      name: errorName,
      message: errorMessage, 
      stack: errorStack,
      type: typeof error,
    });
    
    // Ensure we always return a valid JSON response
    const errorResponse = {
      error: "Failed to generate PDF",
      details: errorMessage,
      ...(process.env.NODE_ENV === "development" ? {
        name: errorName,
        ...(errorStack ? { stack: errorStack } : {}),
      } : {}),
    };
    
    console.error("[PDF] Returning error response:", errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
