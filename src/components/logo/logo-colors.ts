/**
 * Logo color schemes
 * Based on DESIGN_SYSTEM.md color palette
 */

/**
 * Shape colors from design system
 */
export const LOGO_COLORS = {
  flamingo: '#ffb3c2',
  azure: '#99b9ff',
  springgreen: '#78ffd1',
  lime: '#f0ffa6',
} as const;

/**
 * Text colors for OUTLINE variant
 */
export const LOGO_TEXT_COLORS = {
  light: '#f3f2f9', // On dark backgrounds
  dark: '#606887', // On light backgrounds
  muted: '#aab2d1', // Muted variant
} as const;

/**
 * Background colors for BLURRED_BG variant
 */
export const LOGO_BG_COLORS = {
  light: 'rgba(243, 242, 249, 0.8)',
  dark: 'rgba(43, 43, 51, 0.8)',
} as const;

/**
 * Color mapping for variant SR (S before R)
 */
export const VARIANT_SR_COLORS = {
  s: [LOGO_COLORS.azure, LOGO_COLORS.springgreen],
  r: [LOGO_COLORS.flamingo, LOGO_COLORS.lime],
} as const;

/**
 * Color mapping for variant RS (R before S)
 */
export const VARIANT_RS_COLORS = {
  r: [LOGO_COLORS.flamingo, LOGO_COLORS.lime],
  s: [LOGO_COLORS.azure, LOGO_COLORS.springgreen],
} as const;

/**
 * Color mapping for variant S
 */
export const VARIANT_S_COLORS = [LOGO_COLORS.azure, LOGO_COLORS.springgreen] as const;

/**
 * Color mapping for variant R
 */
export const VARIANT_R_COLORS = [LOGO_COLORS.flamingo, LOGO_COLORS.lime] as const;

/**
 * Get colors for a specific variant
 */
export function getVariantColors(
  variant: 'SR' | 'RS' | 'S' | 'R',
): ReadonlyArray<string> | { readonly s: ReadonlyArray<string>; readonly r: ReadonlyArray<string> } {
  switch (variant) {
    case 'SR':
      return VARIANT_SR_COLORS;
    case 'RS':
      return VARIANT_RS_COLORS;
    case 'S':
      return VARIANT_S_COLORS;
    case 'R':
      return VARIANT_R_COLORS;
    default:
      return VARIANT_SR_COLORS;
  }
}

