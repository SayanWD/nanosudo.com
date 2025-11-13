import { useFormContext, type UseFormReturn } from "react-hook-form";

import { useBriefFormContext } from "../components/brief-form-provider";
import type { BriefFormValues, BriefStepValues } from "../schemas/brief";
import type { BriefStepId } from "../types";

type UseBriefStepReturn<TStep extends BriefStepId> = {
  readonly stepId: TStep;
  readonly values: BriefStepValues<TStep>;
  readonly setStep: (step: BriefStepId) => void;
  readonly goNext: () => void;
  readonly goPrevious: () => void;
  readonly form: UseFormReturn<BriefFormValues>;
};

export function useBriefStep<TStep extends BriefStepId>(
  stepId: TStep,
): UseBriefStepReturn<TStep> {
  const briefContext = useBriefFormContext();
  const form = useFormContext<BriefFormValues>();

  const values = form.getValues(stepId) as BriefStepValues<TStep>;

  return {
    stepId,
    values,
    setStep: briefContext.setCurrentStep,
    goNext: briefContext.goToNextStep,
    goPrevious: briefContext.goToPreviousStep,
    form,
  };
}
