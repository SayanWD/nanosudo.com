/**
 * i18n configuration
 * Supported locales: Russian (ru), English (en), Kazakh (kk)
 */

export const locales = ['ru', 'en', 'kk'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  kk: 'Қазақша',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

