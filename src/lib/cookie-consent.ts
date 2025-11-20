/**
 * Cookie Consent Utilities
 * Helper functions for managing cookie consent preferences
 */

const COOKIE_CONSENT_KEY = "cookie-consent";

export type CookieConsentStatus = "accepted" | "declined" | "custom" | null;

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type CookieConsentData = {
  status: CookieConsentStatus;
  preferences: CookiePreferences;
  timestamp: number;
};

/**
 * Get current cookie consent data
 */
export function getCookieConsent(): CookieConsentData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as CookieConsentData;
  } catch {
    return null;
  }
}

/**
 * Check if user has given consent for a specific cookie category
 */
export function hasConsentFor(category: keyof CookiePreferences): boolean {
  const consent = getCookieConsent();
  if (!consent) {
    return false;
  }

  // Necessary cookies are always allowed
  if (category === "necessary") {
    return true;
  }

  return consent.preferences[category] ?? false;
}

/**
 * Check if user has accepted all cookies
 */
export function hasAcceptedAll(): boolean {
  const consent = getCookieConsent();
  if (!consent) {
    return false;
  }

  return (
    consent.status === "accepted" &&
    consent.preferences.analytics === true &&
    consent.preferences.marketing === true
  );
}

/**
 * Check if user has declined all cookies
 */
export function hasDeclinedAll(): boolean {
  const consent = getCookieConsent();
  if (!consent) {
    return false;
  }

  return consent.status === "declined";
}

/**
 * Clear cookie consent (for testing or reset)
 */
export function clearCookieConsent(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(COOKIE_CONSENT_KEY);
}

