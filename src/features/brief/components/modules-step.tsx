"use client";

import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";
import { MODULE_HOURS } from "../schemas/brief-new";

export function ModulesStep(): ReactElement {
  const t = useTranslations();
  const {
    form: { register, watch, setValue },
    goNext,
  } = useBriefNewStep("modules");

  const FRONTEND_MODULES = [
    { key: "mainPage" as const, label: t("brief.modules.frontend.mainPage"), hours: MODULE_HOURS.frontend.mainPage },
    { key: "contactForm" as const, label: t("brief.modules.frontend.contactForm"), hours: MODULE_HOURS.frontend.contactForm },
    { key: "interactiveMap" as const, label: t("brief.modules.frontend.interactiveMap"), hours: MODULE_HOURS.frontend.interactiveMap },
    { key: "calculator" as const, label: t("brief.modules.frontend.calculator"), hours: MODULE_HOURS.frontend.calculator },
    { key: "animations" as const, label: t("brief.modules.frontend.animations"), hours: MODULE_HOURS.frontend.animations },
    { key: "multilingual" as const, label: t("brief.modules.frontend.multilingual"), hours: MODULE_HOURS.frontend.multilingual },
  ] as const;

  const BACKEND_MODULES = [
    { key: "restApi" as const, label: t("brief.modules.backend.restApi"), hours: MODULE_HOURS.backend.restApi },
    { key: "auth" as const, label: t("brief.modules.backend.auth"), hours: MODULE_HOURS.backend.auth },
    { key: "adminPanel" as const, label: t("brief.modules.backend.adminPanel"), hours: MODULE_HOURS.backend.adminPanel },
    { key: "database" as const, label: t("brief.modules.backend.database"), hours: MODULE_HOURS.backend.database },
    { key: "fileStorage" as const, label: t("brief.modules.backend.fileStorage"), hours: MODULE_HOURS.backend.fileStorage },
    { key: "emailNotifications" as const, label: t("brief.modules.backend.emailNotifications"), hours: MODULE_HOURS.backend.emailNotifications },
  ] as const;

  const ECOMMERCE_MODULES = [
    { key: "catalog" as const, label: t("brief.modules.ecommerce.catalog"), hours: MODULE_HOURS.ecommerce.catalog },
    { key: "cartCheckout" as const, label: t("brief.modules.ecommerce.cartCheckout"), hours: MODULE_HOURS.ecommerce.cartCheckout },
    { key: "userAccount" as const, label: t("brief.modules.ecommerce.userAccount"), hours: MODULE_HOURS.ecommerce.userAccount },
    { key: "orderSystem" as const, label: t("brief.modules.ecommerce.orderSystem"), hours: MODULE_HOURS.ecommerce.orderSystem },
  ] as const;

  const PAYMENT_SYSTEMS = [
    { value: "kaspi", label: t("brief.modules.paymentSystems.kaspi") },
    { value: "halyk", label: t("brief.modules.paymentSystems.halyk") },
    { value: "stripe", label: t("brief.modules.paymentSystems.stripe") },
    { value: "paypal", label: t("brief.modules.paymentSystems.paypal") },
    { value: "yandex", label: t("brief.modules.paymentSystems.yandex") },
    { value: "other", label: t("brief.modules.paymentSystems.other") },
  ] as const;

  const CRM_SYSTEMS = [
    { value: "bitrix24", label: t("brief.modules.integrations.crm.bitrix24") },
    { value: "amocrm", label: t("brief.modules.integrations.crm.amocrm") },
    { value: "hubspot", label: t("brief.modules.integrations.crm.hubspot") },
    { value: "other", label: t("brief.modules.integrations.crm.other") },
  ] as const;

  const ANALYTICS_SYSTEMS = [
    { value: "ga4", label: t("brief.modules.integrations.analytics.ga4") },
    { value: "yandex", label: t("brief.modules.integrations.analytics.yandex") },
    { value: "both", label: t("brief.modules.integrations.analytics.both") },
  ] as const;

  const EMAIL_MARKETING = [
    { value: "mailchimp", label: t("brief.modules.integrations.emailMarketing.mailchimp") },
    { value: "sendgrid", label: t("brief.modules.integrations.emailMarketing.sendgrid") },
    { value: "brevo", label: t("brief.modules.integrations.emailMarketing.brevo") },
    { value: "other", label: t("brief.modules.integrations.emailMarketing.other") },
  ] as const;

  const frontend = watch("modules.frontend");
  const ecommerce = watch("modules.ecommerce");
  const integrations = watch("modules.integrations");

  const toggleArray = (
    path: string,
    value: string,
    current: ReadonlyArray<string>,
  ): void => {
    const exists = current.includes(value);
    const next = exists
      ? current.filter((item) => item !== value)
      : [...current, value];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(path as any, next, { shouldTouch: true });
  };

  return (
    <div className="space-y-8">
      {/* Frontend */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {t("brief.modules.frontend.title")}
        </h3>
        <div className="space-y-4">
          {FRONTEND_MODULES.map((module) => (
            <label
              key={module.key}
              className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition"
            >
              <input
                type="checkbox"
                {...register(`modules.frontend.${module.key}`)}
                className="h-4 w-4 text-accent focus:ring-accent"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">{module.label}</div>
                <div className="text-xs text-muted-foreground">
                  {module.hours}h
                </div>
              </div>
            </label>
          ))}
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("brief.modules.frontend.innerPages")}
            </label>
            <input
              type="number"
              min="0"
              max="50"
              {...register("modules.frontend.innerPages", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-foreground"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {frontend.innerPages * MODULE_HOURS.frontend.innerPage}h
            </p>
          </div>
        </div>
      </section>

      {/* Backend */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Backend & Database
        </h3>
        <div className="space-y-4">
          {BACKEND_MODULES.map((module) => (
            <label
              key={module.key}
              className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition"
            >
              <input
                type="checkbox"
                {...register(`modules.backend.${module.key}`)}
                className="h-4 w-4 text-accent focus:ring-accent"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">{module.label}</div>
                <div className="text-xs text-muted-foreground">
                  {module.hours}h
                </div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* E-commerce */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          E-commerce специфика
        </h3>
        <div className="space-y-4">
          {ECOMMERCE_MODULES.map((module) => (
            <label
              key={module.key}
              className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition"
            >
              <input
                type="checkbox"
                {...register(`modules.ecommerce.${module.key}`)}
                className="h-4 w-4 text-accent focus:ring-accent"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">{module.label}</div>
                <div className="text-xs text-muted-foreground">
                  {module.hours}h
                </div>
              </div>
            </label>
          ))}
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <label className="block text-sm font-medium text-foreground mb-3">
              Платежные системы
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {PAYMENT_SYSTEMS.map((system) => (
                <label
                  key={system.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={ecommerce.paymentSystems.includes(system.value)}
                    onChange={() =>
                      toggleArray(
                        "modules.ecommerce.paymentSystems",
                        system.value,
                        ecommerce.paymentSystems,
                      )
                    }
                    className="h-4 w-4 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-foreground">
                    {system.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {ecommerce.paymentSystems.length * MODULE_HOURS.ecommerce.paymentSystem}h
            </p>
          </div>
        </div>
      </section>

      {/* Интеграции */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Интеграции
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <label className="block text-sm font-medium text-foreground mb-3">
              CRM системы
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {CRM_SYSTEMS.map((system) => (
                <label
                  key={system.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={integrations.crm.includes(system.value)}
                    onChange={() =>
                      toggleArray(
                        "modules.integrations.crm",
                        system.value,
                        integrations.crm,
                      )
                    }
                    className="h-4 w-4 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-foreground">
                    {system.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {integrations.crm.length * MODULE_HOURS.integrations.crm}h
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <label className="block text-sm font-medium text-foreground mb-3">
              Аналитика
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ANALYTICS_SYSTEMS.map((system) => (
                <label
                  key={system.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={integrations.analytics.includes(system.value)}
                    onChange={() =>
                      toggleArray(
                        "modules.integrations.analytics",
                        system.value,
                        integrations.analytics,
                      )
                    }
                    className="h-4 w-4 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-foreground">
                    {system.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {integrations.analytics.length * MODULE_HOURS.integrations.analytics}h
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border/60 bg-surface/80">
            <label className="block text-sm font-medium text-foreground mb-3">
              Email-рассылки
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {EMAIL_MARKETING.map((system) => (
                <label
                  key={system.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={integrations.emailMarketing.includes(system.value)}
                    onChange={() =>
                      toggleArray(
                        "modules.integrations.emailMarketing",
                        system.value,
                        integrations.emailMarketing,
                      )
                    }
                    className="h-4 w-4 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-foreground">
                    {system.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {integrations.emailMarketing.length * MODULE_HOURS.integrations.emailMarketing}h
            </p>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("modules.integrations.socialMedia")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                Социальные сети
              </div>
              <div className="text-xs text-muted-foreground">
                {MODULE_HOURS.integrations.socialMedia}h
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("modules.integrations.telegramBot")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Телеграм-бот</div>
              <div className="text-xs text-muted-foreground">
                {MODULE_HOURS.integrations.telegramBot}h
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-surface/80 cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              {...register("modules.integrations.erp1c")}
              className="h-4 w-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                1С/ERP системы
              </div>
              <div className="text-xs text-muted-foreground">
                {MODULE_HOURS.integrations.erp1c}h
              </div>
            </div>
          </label>
        </div>
      </section>

      <BriefNewStepNavigator onNext={goNext} />
    </div>
  );
}

