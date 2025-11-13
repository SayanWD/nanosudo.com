"use client";

import { useEffect, useState, type ReactElement } from "react";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

import { AdminDashboard, AdminLoginForm } from "@/features/admin";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const supabase = getSupabaseBrowserClient();

export default function AdminPage(): ReactElement {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }): void => {
      setSession(data.session);
      setInitializing(false);
    });

    const subscription = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, newSession: Session | null): void => {
        setSession(newSession);
        setInitializing(false);
      },
    );

    return (): void => {
      subscription.data.subscription.unsubscribe();
    };
  }, []);

  if (initializing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <AdminLoginForm />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-section">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <AdminDashboard />
      </div>
    </main>
  );
}
