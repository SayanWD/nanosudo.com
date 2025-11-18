"use client";

import { useFormContext } from "react-hook-form";
import { useBriefNewFormContext } from "../components/brief-new-form-provider";
import type { BriefNewFormValues } from "../schemas/brief-new";
import type { BriefNewStepId } from "../constants/steps-new";

type UseBriefNewStepReturn = {
  readonly form: ReturnType<typeof useFormContext<BriefNewFormValues>>;
  readonly goNext: () => Promise<void>;
  readonly goBack: () => void;
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  readonly currentStep: BriefNewStepId;
};

export function useBriefNewStep(stepId: BriefNewStepId): UseBriefNewStepReturn {
  const form = useFormContext<BriefNewFormValues>();
  const {
    goToNextStep,
    goToPreviousStep,
    canGoBack,
    canGoForward,
    currentStep,
  } = useBriefNewFormContext();

  const goNext = async (): Promise<void> => {
    const fieldPath = stepId as keyof BriefNewFormValues;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await form.trigger(fieldPath as any);
    if (isValid) {
      goToNextStep();
    }
  };

  const goBack = (): void => {
    goToPreviousStep();
  };

  return {
    form,
    goNext,
    goBack,
    canGoBack,
    canGoForward,
    currentStep,
  };
}

