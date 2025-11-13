"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

import type { SubmissionRow } from "../types";

const supabase = getSupabaseBrowserClient();

type LoadState = "idle" | "loading" | "error";
type StatusFilter = SubmissionRow["status"] | "all";

export function AdminDashboard(): ReactElement {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const selectedSubmission = useMemo(() => {
    const submission =
      submissions.find((item) => item.id === selectedId) ?? null;
    if (
      submission &&
      statusFilter !== "all" &&
      submission.status !== statusFilter
    ) {
      return null;
    }
    return submission;
  }, [selectedId, statusFilter, submissions]);

  const filteredSubmissions = useMemo(
    () =>
      submissions.filter((submission) =>
        statusFilter === "all" ? true : submission.status === statusFilter,
      ),
    [statusFilter, submissions],
  );

  const loadData = useCallback(async (): Promise<void> => {
    setState("loading");
    setErrorMessage(null);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      setState("error");
      setErrorMessage(
        error.message ??
          "Не удалось загрузить заявки. Проверьте права доступа и попробуйте снова.",
      );
      return;
    }
    setSubmissions(data as SubmissionRow[]);
    setState("idle");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  const handleUpdateStatus = useCallback(
    async (submissionId: string, nextStatus: SubmissionRow["status"]): Promise<void> => {
      const currentSubmission = submissions.find(
        (submission) => submission.id === submissionId,
      );
      if (!currentSubmission || currentSubmission.status === nextStatus) {
        return;
      }

      setUpdatingStatus(submissionId);
      setErrorMessage(null);
      setSubmissions((previous) =>
        previous.map((submission) =>
          submission.id === submissionId
            ? {
                ...submission,
                status: nextStatus,
                updated_at: new Date().toISOString(),
              }
            : submission,
        ),
      );

      const { error } = await supabase
        .from("submissions")
        .update({ status: nextStatus })
        .eq("id", submissionId);

      if (error) {
        console.error(error);
        await loadData();
        setErrorMessage(
          error.message ?? "Не удалось обновить статус. Попробуйте ещё раз.",
        );
      }

      setUpdatingStatus(null);
    },
    [loadData, submissions],
  );

  const handleSignOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Заявки</h1>
          <p className="text-sm text-muted-foreground">
            Здесь отображаются все отправленные брифы. Нажмите на заявку, чтобы
            увидеть подробности и ссылки на материалы.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            disabled={state === "loading"}
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Закрыты</option>
            <option value="archived">Архив</option>
          </select>
          <button
            type="button"
            onClick={() => void loadData()}
            className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
            disabled={state === "loading"}
          >
            {state === "loading" ? "Обновляем..." : "Обновить"}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
          >
            Выйти
          </button>
        </div>
      </header>

      {errorMessage ? (
        <div className="rounded-2xl border border-error/40 bg-error/10 p-4 text-sm text-error shadow-soft">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border/60 bg-surface/80 shadow-soft">
          <div className="max-h-[520px] overflow-auto">
            <table className="min-w-full divide-y divide-border/60 text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Клиент
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      Нет заявок с выбранным статусом.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => {
                    const isSelected = selectedId === submission.id;
                    return (
                      <tr
                        key={submission.id}
                        onClick={() => setSelectedId(submission.id)}
                        className={cn(
                          "cursor-pointer transition hover:bg-muted/40",
                          isSelected && "bg-accent/10",
                        )}
                      >
                        <td className="px-4 py-3 text-foreground">
                          {submission.client_name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {submission.contact_email}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {submission.status}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(submission.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft">
          {selectedSubmission ? (
            <SubmissionDetails
              submission={selectedSubmission}
              updating={selectedSubmission.id === updatingStatus}
              onStatusChange={(nextStatus) => {
                void handleUpdateStatus(selectedSubmission.id, nextStatus);
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Выберите заявку из списка, чтобы увидеть подробную информацию.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SubmissionDetails({
  submission,
  onStatusChange,
  updating,
}: {
  submission: SubmissionRow;
  onStatusChange: (nextStatus: SubmissionRow["status"]) => void;
  updating: boolean;
}): ReactElement {
  const renderList = (
    label: string,
    items: string[] | null | undefined,
  ): ReactElement => (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </h3>
      <p className="rounded-lg border border-border/50 bg-background/40 px-4 py-2 text-sm text-foreground">
        {items && items.length > 0 ? items.join(", ") : "—"}
      </p>
    </section>
  );

  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <div className="space-y-2">
        <h2 className="font-heading text-xl text-foreground">
          {submission.client_name}
        </h2>
        <p>Заявка от {new Date(submission.created_at).toLocaleString()}</p>
      </div>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Контакты
        </h3>
        <div className="rounded-lg border border-border/50 bg-background/40 px-4 py-3 text-foreground">
          <p>
            <strong>Имя:</strong> {submission.contact_name}
          </p>
          <p>
            <strong>Email:</strong> {submission.contact_email}
          </p>
          <p>
            <strong>Телефон:</strong> {submission.contact_phone || "—"}
          </p>
          <p>
            <strong>Канал:</strong> {submission.contact_method}
          </p>
          <p>
            <strong>Команда:</strong> {submission.team_roles || "—"}
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          О клиенте
        </h3>
        <div className="rounded-lg border border-border/50 bg-background/40 px-4 py-3 text-foreground">
          <p>
            <strong>Отрасль:</strong> {submission.industry}
          </p>
          <p>
            <strong>Цели:</strong>{" "}
            {submission.business_goals && submission.business_goals.length > 0
              ? submission.business_goals.join(", ")
              : "—"}
          </p>
        </div>
      </section>

      {renderList("География", submission.geography)}
      {renderList("Языки", submission.languages)}

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Аудитория
        </h3>
        <div className="rounded-lg border border-border/50 bg-background/40 px-4 py-3 text-foreground">
          <p className="text-foreground">{submission.target_audience}</p>
        </div>
      </section>

      {renderList("Каналы", submission.channels)}

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          USP
        </h3>
        <p className="rounded-lg border border-border/50 bg-background/40 px-4 py-2 text-sm text-foreground">
          {submission.usp || "—"}
        </p>
      </section>

      {renderList("Интеграции", submission.integrations)}

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Метрики
        </h3>
        <div className="rounded-lg border border-border/50 bg-background/40 px-4 py-3 text-foreground">
          <p>
            <strong>Traffic KPI:</strong> {submission.kpi_traffic || "—"}
          </p>
          <p>
            <strong>Conversion KPI:</strong> {submission.kpi_conversion || "—"}
          </p>
          <p>
            <strong>Брендбук:</strong> {submission.has_brandbook ? "Да" : "Нет"}
          </p>
          <p>
            <strong>Тон:</strong> {submission.brand_tone ?? 50}/100
          </p>
          <p>
            <strong>Ссылка:</strong>{" "}
            {submission.brandbook_link ? (
              <a
                href={submission.brandbook_link}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                {submission.brandbook_link}
              </a>
            ) : (
              "—"
            )}
          </p>
          <p>
            <strong>Файл:</strong>{" "}
            {submission.brandbook_file_url ? (
              <a
                href={submission.brandbook_file_url}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                Скачать
              </a>
            ) : (
              "—"
            )}
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Метаданные
        </h3>
        <div className="rounded-lg border border-border/50 bg-background/40 px-4 py-3 text-foreground">
          <p>
            <strong>Статус:</strong> {submission.status}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {updating ? (
              <span className="w-full text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Обновляем...
              </span>
            ) : null}
            {(["new", "in_progress", "completed", "archived"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full border border-border/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition",
                  submission.status === status
                    ? "border-accent bg-accent/15 text-accent"
                    : "hover-border-accent/60 hover:text-accent",
                )}
                disabled={updating || submission.status === status}
              >
                {status}
              </button>
            ))}
          </div>
          <p>
            <strong>IP:</strong> {submission.submitted_ip || "—"}
          </p>
          <p>
            <strong>User-agent:</strong> {submission.user_agent || "—"}
          </p>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: Array<string | boolean | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
