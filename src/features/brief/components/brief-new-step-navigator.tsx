"use client";

import { useState, type ReactElement } from "react";
import { useTranslations } from "next-intl";

import { useBriefNewFormContext } from "./brief-new-form-provider";

type BriefNewStepNavigatorProps = {
  readonly onNext?: () => Promise<void> | void;
  readonly nextLabel?: string;
  readonly isNextDisabled?: boolean;
  readonly onBeforeBack?: () => Promise<void> | void;
};

export function BriefNewStepNavigator({
  onNext,
  nextLabel,
  isNextDisabled = false,
  onBeforeBack,
}: BriefNewStepNavigatorProps): ReactElement {
  const t = useTranslations("brief.navigation");
  const { canGoBack, goToPreviousStep, goToNextStep, canGoForward } =
    useBriefNewFormContext();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const defaultNextLabel = nextLabel ?? t("next");

  const handleBack = async (): Promise<void> => {
    if (!canGoBack) {
      return;
    }
    if (onBeforeBack) {
      await onBeforeBack();
      return;
    }
    goToPreviousStep();
  };

  const handleNext = async (): Promise<void> => {
    if (isNextDisabled || isProcessing) {
      return;
    }
    if (!canGoForward && !onNext) {
      return;
    }
    setIsProcessing(true);
    try {
      if (onNext) {
        await onNext();
      } else {
        goToNextStep();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-6">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-accent/50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canGoBack || isProcessing}
      >
        {t("back")}
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isNextDisabled || isProcessing}
      >
        {isProcessing ? t("saving") : defaultNextLabel}
      </button>
    </div>
  );
}

