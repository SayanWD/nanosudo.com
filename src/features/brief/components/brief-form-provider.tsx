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

import { BRIEF_STEP_ORDER, BRIEF_STEPS } from "../constants/steps";
import { BRIEF_DEFAULT_VALUES } from "../constants/defaults";
import { BRIEF_STORAGE_KEY } from "../constants/storage";
import { briefSchema, type BriefFormValues } from "../schemas/brief";
import type { BriefStepId, BriefStepMeta } from "../types";

type BriefFormContextValue = {
  readonly form: UseFormReturn<BriefFormValues>;
  readonly currentStep: BriefStepId;
  readonly setCurrentStep: (step: BriefStepId) => void;
  readonly stepMeta: BriefStepMeta;
  readonly steps: ReadonlyArray<BriefStepMeta>;
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  readonly goToNextStep: () => void;
  readonly goToPreviousStep: () => void;
  readonly getStepProgress: () => number;
  readonly stepErrors: FieldErrors<BriefFormValues[keyof BriefFormValues]>;
  readonly clearDraft: () => void;
};

const BriefFormContext = createContext<BriefFormContextValue | undefined>(
  undefined,
);

const stepMetaList: ReadonlyArray<BriefStepMeta> = BRIEF_STEPS.map(
  (step, index) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    index,
  }),
);

type BriefFormProviderProps = {
  readonly children: ReactNode;
  readonly initialStep?: BriefStepId;
  readonly initialValues?: Partial<BriefFormValues>;
  readonly enableAutosave?: boolean;
};

export function BriefFormProvider({
  children,
  initialStep = BRIEF_STEP_ORDER[0],
  initialValues,
  enableAutosave = true,
}: BriefFormProviderProps): ReactElement {
  const [currentStep, setCurrentStep] = useState<BriefStepId>(initialStep);
  const [storedValues] = useState<Partial<BriefFormValues> | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(BRIEF_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as unknown;
      const result = briefSchema.safeParse(parsed);
      if (result.success) {
        return result.data;
      }
    } catch {
      // ignore malformed drafts
    }
    return null;
  });

  const mergedDefaultValues: BriefFormValues = useMemo(() => {
    const defaults = BRIEF_DEFAULT_VALUES;
    const merged = {
      client: {
        ...storedValues?.client,
        ...initialValues?.client,
      },
      audience: {
        ...storedValues?.audience,
        ...initialValues?.audience,
      },
      metrics: {
        ...storedValues?.metrics,
        ...initialValues?.metrics,
      },
      contact: {
        ...storedValues?.contact,
        ...initialValues?.contact,
      },
    };

    const ensureArray = (
      value: unknown,
      fallback: ReadonlyArray<string>,
    ): string[] => {
      if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === "string");
      }
      return [...fallback];
    };

    const ensureBoolean = (value: unknown, fallback: boolean): boolean =>
      typeof value === "boolean" ? value : fallback;

    const metrics: BriefFormValues["metrics"] = {
      kpiTraffic: merged.metrics?.kpiTraffic ?? defaults.metrics.kpiTraffic,
      kpiConversion:
        merged.metrics?.kpiConversion ?? defaults.metrics.kpiConversion,
      hasBrandbook: ensureBoolean(
        merged.metrics?.hasBrandbook,
        defaults.metrics.hasBrandbook,
      ),
      brandbookLink:
        merged.metrics?.brandbookLink ?? defaults.metrics.brandbookLink,
      brandbookFile: null,
      brandTone: merged.metrics?.brandTone ?? defaults.metrics.brandTone,
    };

    const result: BriefFormValues = {
      client: {
        clientName: merged.client?.clientName ?? defaults.client.clientName,
        industry: merged.client?.industry ?? defaults.client.industry,
        geography: ensureArray(
          merged.client?.geography,
          defaults.client.geography,
        ),
        languages: ensureArray(
          merged.client?.languages,
          defaults.client.languages,
        ),
        businessGoals: ensureArray(
          merged.client?.businessGoals,
          defaults.client.businessGoals,
        ),
      },
      audience: {
        targetAudience:
          merged.audience?.targetAudience ?? defaults.audience.targetAudience,
        channels: ensureArray(
          merged.audience?.channels,
          defaults.audience.channels,
        ),
        usp: merged.audience?.usp ?? defaults.audience.usp,
        integrations: ensureArray(
          merged.audience?.integrations,
          defaults.audience.integrations,
        ),
      },
      metrics,
      contact: {
        contactName:
          merged.contact?.contactName ?? defaults.contact.contactName,
        contactEmail:
          merged.contact?.contactEmail ?? defaults.contact.contactEmail,
        contactPhone:
          merged.contact?.contactPhone ?? defaults.contact.contactPhone,
        contactMethod:
          merged.contact?.contactMethod ?? defaults.contact.contactMethod,
        teamRoles: merged.contact?.teamRoles ?? defaults.contact.teamRoles,
      },
    };

    return result;
  }, [initialValues, storedValues]);

  const form = useForm<BriefFormValues, undefined, BriefFormValues>({
    mode: "onBlur",
    resolver: zodResolver(briefSchema),
    defaultValues: mergedDefaultValues,
  });

  const currentIndex = useMemo(() => {
    const index = BRIEF_STEP_ORDER.indexOf(currentStep);
    return index === -1 ? 0 : index;
  }, [currentStep]);

  const currentStepMeta = stepMetaList[currentIndex];

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < BRIEF_STEP_ORDER.length - 1;

  const goToNextStep = (): void => {
    if (canGoForward) {
      setCurrentStep(BRIEF_STEP_ORDER[currentIndex + 1]);
    }
  };

  const goToPreviousStep = (): void => {
    if (canGoBack) {
      setCurrentStep(BRIEF_STEP_ORDER[currentIndex - 1]);
    }
  };

  const getStepProgress = (): number =>
    ((currentIndex + 1) / BRIEF_STEP_ORDER.length) * 100;

  const stepErrors =
    form.formState.errors[currentStepMeta.id] ??
    ({} as FieldErrors<BriefFormValues[keyof BriefFormValues]>);

  const clearDraft = (): void => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(BRIEF_STORAGE_KEY);
    }
  };

  useEffect(() => {
    if (!enableAutosave || typeof window === "undefined") {
      return;
    }
    const timeoutRef: { current: number | null } = { current: null };

    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch(() => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        const currentValues = form.getValues();
        const payload: BriefFormValues = {
          ...currentValues,
          metrics: {
            ...currentValues.metrics,
            brandbookFile: null,
          },
        };
        try {
          window.localStorage.setItem(
            BRIEF_STORAGE_KEY,
            JSON.stringify(payload),
          );
        } catch {
          // ignore storage quota errors
        }
      }, 350);
    });

    return (): void => {
      subscription.unsubscribe();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [enableAutosave, form]);

  const contextValue: BriefFormContextValue = {
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
    <BriefFormContext.Provider value={contextValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </BriefFormContext.Provider>
  );
}

export function useBriefFormContext(): BriefFormContextValue {
  const ctx = useContext(BriefFormContext);
  if (!ctx) {
    throw new Error(
      "useBriefFormContext must be used within a BriefFormProvider.",
    );
  }
  return ctx;
}
