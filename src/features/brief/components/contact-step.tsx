"use client";

import Link from "next/link";
import { useState, type ReactElement } from "react";

import { cn } from "@/lib/cn";

import { useBriefStep } from "../hooks/use-brief-step";
import { BriefStepNavigator } from "./brief-step-navigator";
import { useBriefFormContext } from "./brief-form-provider";

type SubmissionState = "idle" | "submitting" | "success" | "error";

const SECTION_CARD_CLASS =
  "rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft";

const CONTACT_METHOD_OPTIONS: ReadonlyArray<{
  value: "email" | "telegram" | "whatsapp" | "phone";
  label: string;
}> = [
  { value: "email", label: "Email" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Телефон" },
];

type BrandbookFilePayload = {
  name: string;
  type: string;
  size: number;
  base64: string;
};

async function encodeFileToBase64(file: File): Promise<BrandbookFilePayload> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  const base64 = btoa(binary);
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    base64,
  };
}

export function BriefContactStep(): ReactElement {
  const {
    form,
    form: { register, watch, handleSubmit, trigger },
  } = useBriefStep("contact");
  const { clearDraft } = useBriefFormContext();
  const { errors, isSubmitting, isValidating } = form.formState;

  const [status, setStatus] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const contactErrors = errors.contact;

  const contactMethod = watch("contact.contactMethod");

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const basePayload = {
        ...values,
        metrics: {
          ...values.metrics,
          brandbookFile: null,
        },
      };

      let brandbookFilePayload: BrandbookFilePayload | undefined;
      if (values.metrics.brandbookFile instanceof File) {
        brandbookFilePayload = await encodeFileToBase64(
          values.metrics.brandbookFile,
        );
      }

      const response = await fetch("/api/brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: basePayload,
          brandbookFile: brandbookFilePayload,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message ??
            "Не удалось отправить бриф. Попробуйте ещё раз или свяжитесь со мной напрямую.",
        );
      }

      const result = (await response.json()) as { id: string };
      setSubmissionId(result.id);
      clearDraft();
      setStatus("success");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Возникла техническая ошибка. Попробуйте ещё раз позже.",
      );
      setStatus("error");
    }
  });

  const handleSubmitClick = async (): Promise<void> => {
    const isValid = await trigger(undefined, { shouldFocus: true });
    if (!isValid) {
      return;
    }
    void onSubmit();
  };

  if (status === "success") {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-accent/50 bg-accent/10 p-8 text-center shadow-soft">
          <h2 className="font-heading text-2xl text-foreground">
            Спасибо! Бриф отправлен.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Я изучу данные и свяжусь с вами в течение 24 часов. Все ответы и
            PDF-копия уже отправлены на указанный email.
          </p>
          {submissionId ? (
            <p className="mt-2 text-xs text-muted-foreground">
              ID заявки:{" "}
              <span className="font-semibold text-foreground">
                {submissionId}
              </span>
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft transition hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              На главную
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmissionId(null);
                setStatus("idle");
                form.reset();
              }}
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Отправить ещё один бриф
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl text-foreground">
          Контакты и команда
        </h2>
        <p className="text-sm text-muted-foreground">
          Оставьте данные для связи. Предпочтительный канал общения поможет
          ответить быстрее.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={SECTION_CARD_CLASS}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Имя контактного лица <span className="text-error">*</span>
            </span>
            <input
              type="text"
              autoComplete="name"
              placeholder="Например: Алина Григорьева"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              {...register("contact.contactName")}
            />
            {contactErrors?.contactName && (
              <span className="text-xs text-error">
                {contactErrors.contactName.message}
              </span>
            )}
          </label>
        </div>

        <div className={SECTION_CARD_CLASS}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Email <span className="text-error">*</span>
            </span>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              {...register("contact.contactEmail")}
            />
            {contactErrors?.contactEmail && (
              <span className="text-xs text-error">
                {contactErrors.contactEmail.message}
              </span>
            )}
          </label>
        </div>

        <div className={SECTION_CARD_CLASS}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Телефон</span>
            <input
              type="tel"
              autoComplete="tel"
              placeholder="+7 777 123 45 67"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              {...register("contact.contactPhone")}
            />
            {contactErrors?.contactPhone && (
              <span className="text-xs text-error">
                {contactErrors.contactPhone.message}
              </span>
            )}
          </label>
        </div>

        <div className={SECTION_CARD_CLASS}>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">
              Предпочтительный канал связи <span className="text-error">*</span>
            </span>
            <div className="grid gap-2">
              {CONTACT_METHOD_OPTIONS.map((option) => {
                const selected = contactMethod === option.value;
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                      selected
                        ? "border-accent bg-accent/10 text-accent"
                        : "hover:border-accent/50 hover:text-accent",
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={selected}
                      className="sr-only"
                      {...register("contact.contactMethod")}
                    />
                    <span className="font-semibold text-foreground">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
            {contactErrors?.contactMethod && (
              <span className="text-xs text-error">
                {contactErrors.contactMethod.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={SECTION_CARD_CLASS}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Команда / роли (кто участвует со стороны клиента)
          </span>
          <textarea
            rows={4}
            placeholder="Например: проджект-менеджер, дизайнер, SEO-специалист..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            {...register("contact.teamRoles")}
          />
          {contactErrors?.teamRoles && (
            <span className="text-xs text-error">
              {contactErrors.teamRoles.message}
            </span>
          )}
        </label>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-error/40 bg-error/10 p-4 text-sm text-error shadow-soft">
          {errorMessage}
        </div>
      ) : null}

      <BriefStepNavigator
        nextLabel={status === "submitting" ? "Отправка..." : "Отправить бриф"}
        onNext={handleSubmitClick}
        isNextDisabled={isSubmitting || isValidating || status === "submitting"}
      />
    </div>
  );
}
