"use client";

import { useState, type ReactElement, FormEvent } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const supabase = getSupabaseBrowserClient();

export function AdminLoginForm(): ReactElement {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setStatus("pending");
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) {
        throw error;
      }
      setStatus("sent");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Не удалось отправить magic link. Проверьте email и попробуйте ещё раз.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border/60 bg-surface/80 p-8 shadow-soft"
    >
      <div className="space-y-2 text-center">
        <h2 className="font-heading text-xl text-foreground">Админ-панель</h2>
        <p className="text-sm text-muted-foreground">
          Введите рабочий email, добавленный в список администраторов. Мы
          отправим magic link для входа.
        </p>
      </div>
      <label className="flex flex-col gap-2 text-left">
        <span className="text-sm font-medium text-foreground">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@nanosudo.com"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          disabled={status === "pending" || status === "sent"}
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status === "pending" || status === "sent"}
      >
        {status === "pending" ? "Отправляем..." : "Получить magic link"}
      </button>
      {status === "sent" ? (
        <p className="text-sm text-success">
          Magic link отправлен! Проверьте почту и вернитесь по ссылке для входа.
        </p>
      ) : null}
      {status === "error" && errorMessage ? (
        <p className="text-sm text-error">{errorMessage}</p>
      ) : null}
    </form>
  );
}
