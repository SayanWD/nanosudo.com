"use client";

import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  type FieldErrors,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";

import { BRIEF_NEW_STEP_ORDER, BRIEF_NEW_STEPS } from "../constants/steps-new";
import { BRIEF_NEW_DEFAULT_VALUES } from "../constants/defaults-new";
import { BRIEF_STORAGE_KEY } from "../constants/storage";
import { briefNewSchema, type BriefNewFormValues } from "../schemas/brief-new";
import type { BriefNewStepId } from "../constants/steps-new";

type BriefNewStepMeta = {
  readonly id: BriefNewStepId;
  readonly index: number;
  readonly title: string;
  readonly description: string;
};

type BriefNewFormContextValue = {
  readonly form: UseFormReturn<BriefNewFormValues>;
  readonly currentStep: BriefNewStepId;
  readonly setCurrentStep: (step: BriefNewStepId) => void;
  readonly stepMeta: BriefNewStepMeta;
  readonly steps: ReadonlyArray<BriefNewStepMeta>;
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  readonly goToNextStep: () => void;
  readonly goToPreviousStep: () => void;
  readonly getStepProgress: () => number;
  readonly stepErrors: FieldErrors<BriefNewFormValues[keyof BriefNewFormValues]>;
  readonly clearDraft: () => void;
};

const BriefNewFormContext = createContext<
  BriefNewFormContextValue | undefined
>(undefined);

export function useBriefNewFormContext(): BriefNewFormContextValue {
  const context = useContext(BriefNewFormContext);
  if (!context) {
    throw new Error(
      "useBriefNewFormContext must be used within BriefNewFormProvider",
    );
  }
  return context;
}

type BriefNewFormProviderProps = {
  readonly children: ReactNode;
  readonly initialStep?: BriefNewStepId;
  readonly initialValues?: Partial<BriefNewFormValues>;
  readonly enableAutosave?: boolean;
};

export function BriefNewFormProvider({
  children,
  initialStep = BRIEF_NEW_STEP_ORDER[0],
  initialValues,
  enableAutosave = true,
}: BriefNewFormProviderProps): ReactElement {
  const [currentStep, setCurrentStep] = useState<BriefNewStepId>(initialStep);

  // Load from localStorage
  const storedValues = useMemo(() => {
    if (typeof window === "undefined" || !enableAutosave) {
      return null;
    }
    try {
      const stored = localStorage.getItem(BRIEF_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Partial<BriefNewFormValues>;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }, [enableAutosave]);

  const mergedDefaultValues: BriefNewFormValues = useMemo(() => {
    const defaults = BRIEF_NEW_DEFAULT_VALUES;
    const merged = { ...storedValues, ...initialValues };

    return {
      projectInfo: {
        projectName:
          merged.projectInfo?.projectName ?? defaults.projectInfo.projectName,
        projectType:
          merged.projectInfo?.projectType ?? defaults.projectInfo.projectType,
        description:
          merged.projectInfo?.description ?? defaults.projectInfo.description,
      },
      modules: {
        frontend: {
          ...defaults.modules.frontend,
          ...merged.modules?.frontend,
        },
        backend: {
          ...defaults.modules.backend,
          ...merged.modules?.backend,
        },
        ecommerce: {
          ...defaults.modules.ecommerce,
          ...merged.modules?.ecommerce,
        },
        integrations: {
          ...defaults.modules.integrations,
          ...merged.modules?.integrations,
        },
      },
      design: {
        ...defaults.design,
        ...merged.design,
      },
      content: {
        ...defaults.content,
        ...merged.content,
      },
      technical: {
        ...defaults.technical,
        ...merged.technical,
      },
      timeline: {
        ...defaults.timeline,
        ...merged.timeline,
      },
      contact: {
        ...defaults.contact,
        ...merged.contact,
      },
    };
  }, [initialValues, storedValues]);

  const form = useForm<BriefNewFormValues, undefined, BriefNewFormValues>({
    mode: "onBlur",
    resolver: zodResolver(briefNewSchema),
    defaultValues: mergedDefaultValues,
  });

  // Autosave
  useEffect(() => {
    if (!enableAutosave || typeof window === "undefined") {
      return;
    }
    const subscription = form.watch((values) => {
      try {
        localStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(values));
      } catch {
        // Ignore storage errors
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [form, enableAutosave]);

  const stepMetaList: ReadonlyArray<BriefNewStepMeta> = useMemo(
    () =>
      BRIEF_NEW_STEPS.map((step, index) => ({
        id: step.id,
        index,
        title: step.title,
        description: step.description,
      })),
    [],
  );

  const currentIndex = useMemo(() => {
    const index = BRIEF_NEW_STEP_ORDER.indexOf(currentStep);
    return index === -1 ? 0 : index;
  }, [currentStep]);

  const currentStepMeta = stepMetaList[currentIndex];

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < BRIEF_NEW_STEP_ORDER.length - 1;

  const goToNextStep = (): void => {
    if (canGoForward) {
      const nextIndex = currentIndex + 1;
      setCurrentStep(BRIEF_NEW_STEP_ORDER[nextIndex]!);
    }
  };

  const goToPreviousStep = (): void => {
    if (canGoBack) {
      const prevIndex = currentIndex - 1;
      setCurrentStep(BRIEF_NEW_STEP_ORDER[prevIndex]!);
    }
  };

  const getStepProgress = (): number => {
    return ((currentIndex + 1) / BRIEF_NEW_STEP_ORDER.length) * 100;
  };

  const stepErrors = form.formState.errors;

  const clearDraft = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(BRIEF_STORAGE_KEY);
    }
    form.reset(BRIEF_NEW_DEFAULT_VALUES);
    setCurrentStep(BRIEF_NEW_STEP_ORDER[0]!);
  };

  const value: BriefNewFormContextValue = {
    form,
    currentStep,
    setCurrentStep,
    stepMeta: currentStepMeta,
    steps: stepMetaList,
    canGoBack,
    canGoForward,
    goToNextStep,
    goToPreviousStep,
    getStepProgress,
    stepErrors,
    clearDraft,
  };

  return (
    <BriefNewFormContext.Provider value={value}>
      <FormProvider {...form}>{children}</FormProvider>
    </BriefNewFormContext.Provider>
  );
}

