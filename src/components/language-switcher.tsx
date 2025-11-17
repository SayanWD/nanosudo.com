'use client';

import type { ReactElement } from "react";
import { useState } from "react";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';

export function LanguageSwitcher(): ReactElement {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: Locale): void => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Выбрать язык"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline">{localeNames[locale]}</span>
      </button>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 w-32 rounded-lg border border-border/60 bg-surface/95 backdrop-blur-md shadow-soft z-50">
            <div className="py-1">
              {locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleLanguageChange(loc)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    locale === loc
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                  }`}
                >
                  {localeNames[loc]}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

