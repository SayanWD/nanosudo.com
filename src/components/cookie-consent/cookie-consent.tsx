"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { X, Settings, Check } from "lucide-react";
import { cn } from "@/lib/cn";

const COOKIE_CONSENT_KEY = "cookie-consent";

type CookieConsentStatus = "accepted" | "declined" | "custom" | null;

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function CookieConsent(): ReactElement | null {
  const t = useTranslations("cookieConsent");
  
  // Load preferences with lazy initialization
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window === "undefined") {
      return {
        necessary: true,
        analytics: false,
        marketing: false,
      };
    }
    
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (consent) {
        const saved = JSON.parse(consent) as {
          status: CookieConsentStatus;
          preferences?: CookiePreferences;
          timestamp: number;
        };
        if (saved.preferences) {
          return saved.preferences;
        }
      }
    } catch {
      // Invalid stored data, use defaults
    }
    
    return {
      necessary: true, // Always required
      analytics: false,
      marketing: false,
    };
  });
  
  // Check if consent banner should be visible
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    return !consent;
  });
  
  const [showPreferences, setShowPreferences] = useState(false);

  const saveConsent = (status: CookieConsentStatus, prefs?: CookiePreferences): void => {
    const data = {
      status,
      preferences: prefs ?? preferences,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
    setIsVisible(false);
    setShowPreferences(false);

    // Trigger custom event for analytics integration
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cookieConsent", {
          detail: { status, preferences: prefs ?? preferences },
        }),
      );
    }
  };

  const handleAcceptAll = (): void => {
    saveConsent("accepted", {
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleDeclineAll = (): void => {
    saveConsent("declined", {
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = (): void => {
    saveConsent("custom", preferences);
  };

  const togglePreference = (key: keyof CookiePreferences): void => {
    if (key === "necessary") return; // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setShowPreferences(false)}
        aria-hidden="true"
      />

      {/* Cookie Consent Banner */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-surface/95 backdrop-blur-xl shadow-soft",
          "transition-transform duration-300 ease-out",
          isVisible ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-modal="true"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {!showPreferences ? (
            // Main consent view
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1 space-y-2">
                <h3 id="cookie-consent-title" className="text-base font-semibold text-foreground">
                  {t("title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("description")}{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-medium text-accent underline-offset-4 hover:underline"
                  >
                    {t("privacyPolicyLink")}
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDeclineAll}
                  className="rounded-lg border border-border/60 bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t("decline")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="rounded-lg border border-border/60 bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {t("customize")}
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t("acceptAll")}
                </button>
              </div>
            </div>
          ) : (
            // Preferences view
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{t("preferences.title")}</h3>
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface/80 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={t("close")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="rounded-lg border border-border/60 bg-surface/50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{t("preferences.necessary.title")}</h4>
                        <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                          {t("preferences.required")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("preferences.necessary.description")}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <div className="rounded-full bg-accent/20 p-1">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="rounded-lg border border-border/60 bg-surface/50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{t("preferences.analytics.title")}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("preferences.analytics.description")}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => togglePreference("analytics")}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                          preferences.analytics ? "bg-accent" : "bg-muted",
                        )}
                        role="switch"
                        aria-checked={preferences.analytics}
                        aria-label={t("preferences.analytics.title")}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            preferences.analytics ? "translate-x-6" : "translate-x-1",
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="rounded-lg border border-border/60 bg-surface/50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{t("preferences.marketing.title")}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("preferences.marketing.description")}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => togglePreference("marketing")}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                          preferences.marketing ? "bg-accent" : "bg-muted",
                        )}
                        role="switch"
                        aria-checked={preferences.marketing}
                        aria-label={t("preferences.marketing.title")}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            preferences.marketing ? "translate-x-6" : "translate-x-1",
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={handleDeclineAll}
                  className="rounded-lg border border-border/60 bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t("declineAll")}
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="ml-auto rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t("savePreferences")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

