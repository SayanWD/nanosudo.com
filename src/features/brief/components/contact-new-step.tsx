"use client";

import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useBriefNewStep } from "../hooks/use-brief-new-step";
import { BriefNewStepNavigator } from "./brief-new-step-navigator";

export function ContactNewStep(): ReactElement {
  const t = useTranslations();
  const {
    form: { register, formState },
    goNext,
  } = useBriefNewStep("contact");
  const { errors } = formState;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="contactName"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            {t("brief.contact.contactName.label")} <span className="text-error">*</span>
          </label>
          <input
            id="contactName"
            type="text"
            {...register("contact.contactName")}
            placeholder={t("brief.contact.contactName.placeholder")}
            className="w-full rounded-lg border border-border/60 bg-surface/80 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
          {errors.contact?.contactName && (
            <p className="mt-1 text-sm text-error">
              {errors.contact.contactName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            {t("brief.contact.companyName.label")}
          </label>
          <input
            id="companyName"
            type="text"
            {...register("contact.companyName")}
            placeholder={t("brief.contact.companyName.placeholder")}
            className="w-full rounded-lg border border-border/60 bg-surface/80 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
        </div>

        <div>
          <label
            htmlFor="contactEmail"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            {t("brief.contact.contactEmail.label")} <span className="text-error">*</span>
          </label>
          <input
            id="contactEmail"
            type="email"
            {...register("contact.contactEmail")}
            placeholder={t("brief.contact.contactEmail.placeholder")}
            className="w-full rounded-lg border border-border/60 bg-surface/80 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
          {errors.contact?.contactEmail && (
            <p className="mt-1 text-sm text-error">
              {errors.contact.contactEmail.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contactPhone"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            {t("brief.contact.contactPhone.label")}
          </label>
          <input
            id="contactPhone"
            type="tel"
            {...register("contact.contactPhone")}
            placeholder={t("brief.contact.contactPhone.placeholder")}
            className="w-full rounded-lg border border-border/60 bg-surface/80 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
          {errors.contact?.contactPhone && (
            <p className="mt-1 text-sm text-error">
              {errors.contact.contactPhone.message}
            </p>
          )}
        </div>
      </div>

      <BriefNewStepNavigator
        onNext={goNext}
        nextLabel={t("brief.navigation.generateProposal")}
      />
    </div>
  );
}

