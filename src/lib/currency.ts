/**
 * Currency formatting utilities
 * Supports:
 * - RUB for ru locale (1 USD = 90 RUB)
 * - USD for en locale
 * - KZT for kk locale (1 USD = 450 KZT, 40% cheaper = 60% of USD price)
 */

import type { Locale } from '@/i18n/config';

// Fixed exchange rates (approximate rates for 2025)
const USD_TO_RUB_RATE = 90;
const USD_TO_KZT_RATE = 450;

// Discount coefficient for KZT: 40% cheaper = 60% of USD price
const KZT_DISCOUNT_COEFFICIENT = 0.6;

/**
 * Converts USD amount to RUB
 */
export function usdToRub(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_RUB_RATE);
}

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
  if (locale === 'ru') {
    const rubAmount = usdToRub(usdAmount);
    return `${rubAmount.toLocaleString('ru-RU')} ₽`;
  }
  
  if (locale === 'kk') {
    const kztAmount = usdToKzt(usdAmount);
    return `${kztAmount.toLocaleString('kk-KZ')} ₸`;
  }
  
  // en uses USD
  return `$${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Formats currency with symbol only (for inline use)
 */
export function formatCurrencySymbol(locale: Locale): string {
  if (locale === 'ru') return '₽';
  if (locale === 'kk') return '₸';
  return '$';
}

/**
 * Formats hourly rate based on locale
 */
export function formatHourlyRate(
  usdRate: number,
  locale: Locale,
): string {
  if (locale === 'ru') {
    const rubRate = usdToRub(usdRate);
    return `${rubRate.toLocaleString('ru-RU')} ₽/ч`;
  }
  
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
  if (locale === 'ru') return 'рублей';
  if (locale === 'kk') return 'тенге';
  return 'долларов';
}

