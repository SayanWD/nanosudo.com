"use client";

import { useMemo, useState, type ReactElement } from "react";
import { useTranslations } from "next-intl";

import {
  ProjectInfoStep,
  ModulesStep,
  DesignStep,
  ContentStep,
  TechnicalStep,
  TimelineStep,
  ContactNewStep,
  BriefNewFormProvider,
  useBriefNewFormContext,
  BriefNewProgress,
  CalculationPreview,
} from "@/features/brief/components";
import type { BriefNewStepId } from "@/features/brief/constants/steps-new";
import { SiteShell } from "@/components/layout/site-shell";
import { DynamicBackground } from "@/components/background/dynamic-background";
import { calculateProjectCost } from "@/features/brief/utils/calculation";

const STEP_COMPONENTS: Record<
  BriefNewStepId,
  () => ReactElement
> = {
  projectInfo: () => <ProjectInfoStep />,
  modules: () => <ModulesStep />,
  design: () => <DesignStep />,
  content: () => <ContentStep />,
  technical: () => <TechnicalStep />,
  timeline: () => <TimelineStep />,
  contact: () => <ContactNewStep />,
};

function BriefNewWizard(): ReactElement {
  const { currentStep } = useBriefNewFormContext();
  const StepComponent = useMemo(
    () => STEP_COMPONENTS[currentStep],
    [currentStep],
  );
  return <StepComponent />;
}

function BriefCalculationSection(): ReactElement {
  const { form } = useBriefNewFormContext();
  const t = useTranslations();
  const values = form.watch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitRequest = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      // Validate required fields first
      if (!values.projectInfo?.projectName || !values.contact?.contactEmail) {
        alert(t("brief.errors.fillRequired"));
        setIsSubmitting(false);
        return;
      }

      // Calculate cost
      let calculation;
      try {
        calculation = calculateProjectCost(values);
      } catch (calcError) {
        console.error("[Request] Calculation error:", calcError);
        throw new Error(t("brief.errors.calculationError", { error: calcError instanceof Error ? calcError.message : String(calcError) }));
      }

      // Validate calculation has required fields
      if (!calculation.costBreakdown) {
        throw new Error(t("brief.errors.missingBreakdown"));
      }

      // Prepare request payload
      const payload = {
        formData: values,
        calculation,
      };

      const response = await fetch("/api/brief-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Success
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      const errorMessage = error instanceof Error ? error.message : t("brief.errors.unknownError");
      alert(t("brief.errors.submitError", { error: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 rounded-lg border-2 border-accent bg-accent/10">
        <div className="text-center space-y-4">
          <div className="text-2xl">✓</div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {t("brief.calculation.submit.success.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("brief.calculation.submit.success.message")}
            </p>
            <p className="text-xs text-muted-foreground mt-4 p-3 bg-surface/80 rounded-lg">
              {t.rich("brief.calculation.submit.success.note", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CalculationPreview
      onSubmitRequest={isSubmitting ? undefined : handleSubmitRequest}
      isSubmitting={isSubmitting}
    />
  );
}

export default function BriefPage(): ReactElement {
  const [initialStep] = useState<BriefNewStepId>("projectInfo");
  const t = useTranslations();

  return (
    <SiteShell header={null}>
      {/* Dynamic background */}
      <DynamicBackground />
      <main className="relative min-h-screen bg-background py-section">
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              {t("brief.label")}
            </p>
            <h1 className="font-heading text-3xl text-foreground md:text-4xl">
              {t("brief.title")}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              {t("brief.description")}
            </p>
          </div>
          <BriefNewFormProvider initialStep={initialStep}>
            <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)_400px]">
              <aside className="space-y-6">
                <BriefNewProgress />
                <div className="rounded-2xl border border-border/60 bg-surface/80 p-4 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    {t("brief.tips.title")}
                  </p>
                  <ul className="mt-3 space-y-2 list-disc pl-4">
                    <li>{t("brief.tips.tip1")}</li>
                    <li>{t("brief.tips.tip2")}</li>
                    <li>{t("brief.tips.tip3")}</li>
                  </ul>
                </div>
              </aside>
              <div className="space-y-6">
                <BriefNewWizard />
              </div>
              <aside className="space-y-6">
                <div className="sticky top-24">
                  <BriefCalculationSection />
                </div>
              </aside>
            </section>
          </BriefNewFormProvider>
        </div>
      </main>
    </SiteShell>
  );
}
