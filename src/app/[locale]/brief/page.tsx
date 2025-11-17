"use client";

import { useMemo, useState, type ReactElement } from "react";

import {
  BriefAudienceStep,
  BriefClientStep,
  BriefContactStep,
  BriefFormProvider,
  BriefMetricsStep,
  BriefProgress,
  useBriefFormContext,
} from "@/features/brief";
import type { BriefStepId } from "@/features/brief";
import { SiteShell } from "@/components/layout/site-shell";

const STEP_COMPONENTS: Record<BriefStepId, () => ReactElement> = {
  client: () => <BriefClientStep />,
  audience: () => <BriefAudienceStep />,
  metrics: () => <BriefMetricsStep />,
  contact: () => <BriefContactStep />,
};

function BriefWizard(): ReactElement {
  const { currentStep } = useBriefFormContext();
  const StepComponent = useMemo(
    () => STEP_COMPONENTS[currentStep],
    [currentStep],
  );
  return <StepComponent />;
}

export default function BriefPage(): ReactElement {
  const [initialStep] = useState<BriefStepId>("client");

  return (
    <SiteShell>
      <main className="min-h-screen bg-background py-section">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              brief
            </p>
            <h1 className="font-heading text-3xl text-foreground md:text-4xl">
              Заполните бриф за 7 минут
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Чем больше деталей вы укажете сейчас, тем точнее будет предложение.
              Все поля можно редактировать позже, черновик сохраняется
              автоматически.
            </p>
          </div>
          <BriefFormProvider initialStep={initialStep}>
            <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="space-y-6">
                <BriefProgress />
                <div className="rounded-2xl border border-border/60 bg-surface/80 p-4 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    Советы по заполнению
                  </p>
                  <ul className="mt-3 space-y-2 list-disc pl-4">
                    <li>
                      Если нет данных — оставьте поле пустым или черновой
                      пометкой.
                    </li>
                    <li>
                      Черновик сохраняется локально и доступен при повторном
                      посещении.
                    </li>
                    <li>После отправки получите копию на email + PDF.</li>
                  </ul>
                </div>
              </aside>
              <div className="space-y-6">
                <BriefWizard />
              </div>
            </section>
          </BriefFormProvider>
        </div>
      </main>
    </SiteShell>
  );
}

