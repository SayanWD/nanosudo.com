import type { BriefNewFormValues } from "../schemas/brief-new";
import {
  MODULE_HOURS,
  URGENCY_COEFFICIENTS,
  COMPLEXITY_COEFFICIENTS,
  HOURLY_RATES,
} from "../schemas/brief-new";

export type CalculationResult = {
  readonly totalHours: number;
  readonly totalCost: number;
  readonly breakdown: {
    readonly discovery: number;
    readonly frontend: number;
    readonly backend: number;
    readonly ecommerce: number;
    readonly integrations: number;
    readonly design: number;
    readonly technical: number;
    readonly testing: number;
    readonly deployment: number;
    readonly documentation: number;
  };
  readonly costBreakdown: {
    readonly discovery: number;
    readonly frontend: number;
    readonly backend: number;
    readonly ecommerce: number;
    readonly integrations: number;
    readonly design: number;
    readonly technical: number;
    readonly testing: number;
    readonly deployment: number;
    readonly documentation: number;
  };
  readonly coefficients: {
    readonly urgency: number;
    readonly complexity: number;
  };
};

export function calculateProjectCost(
  values: BriefNewFormValues,
): CalculationResult {
  const { projectInfo, modules, design, technical, timeline } = values;

  // Discovery (фиксированные)
  const discoveryHours = MODULE_HOURS.fixed.discovery;

  // Frontend модули
  let frontendHours = 0;
  if (modules.frontend.mainPage) {
    frontendHours += MODULE_HOURS.frontend.mainPage;
  }
  frontendHours +=
    modules.frontend.innerPages * MODULE_HOURS.frontend.innerPage;
  if (modules.frontend.contactForm) {
    frontendHours += MODULE_HOURS.frontend.contactForm;
  }
  if (modules.frontend.interactiveMap) {
    frontendHours += MODULE_HOURS.frontend.interactiveMap;
  }
  if (modules.frontend.calculator) {
    frontendHours += MODULE_HOURS.frontend.calculator;
  }
  if (modules.frontend.animations) {
    frontendHours += MODULE_HOURS.frontend.animations;
  }
  if (modules.frontend.multilingual) {
    frontendHours += MODULE_HOURS.frontend.multilingual;
  }

  // Backend модули
  let backendHours = 0;
  if (modules.backend.restApi) {
    backendHours += MODULE_HOURS.backend.restApi;
  }
  if (modules.backend.auth) {
    backendHours += MODULE_HOURS.backend.auth;
  }
  if (modules.backend.adminPanel) {
    backendHours += MODULE_HOURS.backend.adminPanel;
  }
  if (modules.backend.database) {
    backendHours += MODULE_HOURS.backend.database;
  }
  if (modules.backend.fileStorage) {
    backendHours += MODULE_HOURS.backend.fileStorage;
  }
  if (modules.backend.emailNotifications) {
    backendHours += MODULE_HOURS.backend.emailNotifications;
  }

  // E-commerce модули
  let ecommerceHours = 0;
  if (modules.ecommerce.catalog) {
    ecommerceHours += MODULE_HOURS.ecommerce.catalog;
  }
  if (modules.ecommerce.cartCheckout) {
    ecommerceHours += MODULE_HOURS.ecommerce.cartCheckout;
  }
  ecommerceHours +=
    modules.ecommerce.paymentSystems.length * MODULE_HOURS.ecommerce.paymentSystem;
  if (modules.ecommerce.userAccount) {
    ecommerceHours += MODULE_HOURS.ecommerce.userAccount;
  }
  if (modules.ecommerce.orderSystem) {
    ecommerceHours += MODULE_HOURS.ecommerce.orderSystem;
  }

  // Интеграции
  let integrationHours = 0;
  integrationHours +=
    modules.integrations.crm.length * MODULE_HOURS.integrations.crm;
  integrationHours +=
    modules.integrations.analytics.length * MODULE_HOURS.integrations.analytics;
  integrationHours +=
    modules.integrations.emailMarketing.length *
    MODULE_HOURS.integrations.emailMarketing;
  if (modules.integrations.socialMedia) {
    integrationHours += MODULE_HOURS.integrations.socialMedia;
  }
  if (modules.integrations.telegramBot) {
    integrationHours += MODULE_HOURS.integrations.telegramBot;
  }
  if (modules.integrations.erp1c) {
    integrationHours += MODULE_HOURS.integrations.erp1c;
  }

  // Дизайн
  let designHours = 0;
  if (design.useTemplate) {
    // Если используется шаблон, применяем коэффициент к базовым часам
    const baseDesignHours = design.designFromScratch
      ? MODULE_HOURS.design.fromScratch
      : design.adaptBrandbook
        ? MODULE_HOURS.design.adaptBrandbook
        : 16; // базовые часы
    designHours = baseDesignHours * MODULE_HOURS.design.template;
  } else if (design.adaptBrandbook) {
    designHours = MODULE_HOURS.design.adaptBrandbook;
  } else if (design.designFromScratch) {
    designHours = MODULE_HOURS.design.fromScratch;
  }
  if (design.uiKit) {
    designHours += MODULE_HOURS.design.uiKit;
  }
  // Умножаем на количество страниц (минимум 1)
  designHours *= Math.max(1, design.pageCount);

  // Технические требования
  let technicalHours = 0;
  if (technical.expectedLoad === "high") {
    technicalHours += MODULE_HOURS.technical.highLoad;
  }
  if (technical.highSecurity) {
    technicalHours += MODULE_HOURS.technical.highSecurity;
  }
  if (technical.pwa) {
    technicalHours += MODULE_HOURS.technical.pwa;
  }
  if (technical.realtime) {
    technicalHours += MODULE_HOURS.technical.realtime;
  }

  // Deployment и Documentation (фиксированные)
  const deploymentHours = MODULE_HOURS.fixed.deployment;
  const documentationHours = MODULE_HOURS.fixed.documentation;

  // Сумма часов разработки (без testing)
  const developmentHours =
    discoveryHours +
    frontendHours +
    backendHours +
    ecommerceHours +
    integrationHours +
    designHours +
    technicalHours +
    deploymentHours +
    documentationHours;

  // Testing (15% от разработки)
  const testingHours = Math.round(
    developmentHours * MODULE_HOURS.fixed.testing,
  );

  // Общая сумма часов до применения коэффициентов
  const baseTotalHours = developmentHours + testingHours;

  // Коэффициенты
  const urgencyCoefficient =
    timeline.desiredWeeks < 4
      ? URGENCY_COEFFICIENTS.urgent
      : timeline.desiredWeeks <= 8
        ? URGENCY_COEFFICIENTS.normal
        : URGENCY_COEFFICIENTS.flexible;

  const complexityCoefficient =
    COMPLEXITY_COEFFICIENTS[
      projectInfo.projectType as keyof typeof COMPLEXITY_COEFFICIENTS
    ] ?? 1.0;

  // Поэтапная сдача (+10% времени на координацию)
  const phasedCoefficient = timeline.phasedDelivery ? 1.1 : 1.0;

  // Итоговые часы
  const totalHours = Math.round(
    baseTotalHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient,
  );

  // Применяем коэффициенты к часам по категориям
  const adjustedDiscoveryHours = Math.round(discoveryHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedFrontendHours = Math.round(frontendHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedBackendHours = Math.round(backendHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedEcommerceHours = Math.round(ecommerceHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedIntegrationHours = Math.round(integrationHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedDesignHours = Math.round(designHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedTechnicalHours = Math.round(technicalHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedTestingHours = Math.round(testingHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedDeploymentHours = Math.round(deploymentHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);
  const adjustedDocumentationHours = Math.round(documentationHours * urgencyCoefficient * complexityCoefficient * phasedCoefficient);

  // Расчет стоимости с дифференцированными ставками
  const discoveryCost = adjustedDiscoveryHours * HOURLY_RATES.discovery;
  const frontendCost = adjustedFrontendHours * HOURLY_RATES.frontend;
  const backendCost = adjustedBackendHours * HOURLY_RATES.backend;
  const ecommerceCost = adjustedEcommerceHours * HOURLY_RATES.ecommerce;
  const integrationCost = adjustedIntegrationHours * HOURLY_RATES.integrations;
  const designCost = adjustedDesignHours * HOURLY_RATES.design;
  const technicalCost = adjustedTechnicalHours * HOURLY_RATES.technical;
  const testingCost = adjustedTestingHours * HOURLY_RATES.testing;
  const deploymentCost = adjustedDeploymentHours * HOURLY_RATES.deployment;
  const documentationCost = adjustedDocumentationHours * HOURLY_RATES.documentation;

  const totalCost = Math.round(
    discoveryCost +
    frontendCost +
    backendCost +
    ecommerceCost +
    integrationCost +
    designCost +
    technicalCost +
    testingCost +
    deploymentCost +
    documentationCost,
  );

  return {
    totalHours,
    totalCost,
    breakdown: {
      discovery: adjustedDiscoveryHours,
      frontend: adjustedFrontendHours,
      backend: adjustedBackendHours,
      ecommerce: adjustedEcommerceHours,
      integrations: adjustedIntegrationHours,
      design: adjustedDesignHours,
      technical: adjustedTechnicalHours,
      testing: adjustedTestingHours,
      deployment: adjustedDeploymentHours,
      documentation: adjustedDocumentationHours,
    },
    costBreakdown: {
      discovery: discoveryCost,
      frontend: frontendCost,
      backend: backendCost,
      ecommerce: ecommerceCost,
      integrations: integrationCost,
      design: designCost,
      technical: technicalCost,
      testing: testingCost,
      deployment: deploymentCost,
      documentation: documentationCost,
    },
    coefficients: {
      urgency: urgencyCoefficient,
      complexity: complexityCoefficient,
    },
  };
}

