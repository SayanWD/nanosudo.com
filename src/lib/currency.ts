/**
 * Currency formatting utilities
 * Supports USD for ru/en locales and KZT for kk locale
 * KZT prices are 40% cheaper (60% of USD price)
 */

import type { Locale } from '@/i18n/config';

// Fixed exchange rate: 1 USD = 450 KZT (approximate rate for 2025)
const USD_TO_KZT_RATE = 450;

// Discount coefficient for KZT: 40% cheaper = 60% of USD price
const KZT_DISCOUNT_COEFFICIENT = 0.6;

/**
 * Converts USD amount to KZT with discount
 */
export function usdToKzt(usdAmount: number): number {
  return Math.round(usdAmount * KZT_DISCOUNT_COEFFICIENT * USD_TO_KZT_RATE);
}

/**
 * Formats currency based on locale
 */
export function formatCurrency(
  usdAmount: number,
  locale: Locale,
): string {
  if (locale === 'kk') {
    const kztAmount = usdToKzt(usdAmount);
    return `${kztAmount.toLocaleString('kk-KZ')} ₸`;
  }
  
  // ru and en use USD
  return `$${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Formats currency with symbol only (for inline use)
 */
export function formatCurrencySymbol(locale: Locale): string {
  return locale === 'kk' ? '₸' : '$';
}

/**
 * Formats hourly rate based on locale
 */
export function formatHourlyRate(
  usdRate: number,
  locale: Locale,
): string {
  if (locale === 'kk') {
    const kztRate = usdToKzt(usdRate);
    return `${kztRate.toLocaleString('kk-KZ')} ₸/ч`;
  }
  
  return `$${usdRate}/ч`;
}

/**
 * Gets currency name for display
 */
export function getCurrencyName(locale: Locale): string {
  return locale === 'kk' ? 'тенге' : 'долларов';
}

