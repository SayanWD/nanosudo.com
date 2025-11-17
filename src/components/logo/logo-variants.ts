/**
 * Logo component types and constants
 * Based on DESIGN_SYSTEM.md and DESIGN_SYSTEM_PLAN.md
 */

export type LogoVariant = 'SR' | 'RS' | 'S' | 'R' | 'DECONSTRUCTED' | 'VERTICAL' | 'HORIZONTAL';

export type LogoAppearance =
  | 'OUTLINE'
  | 'OUTLINE_BLURRED'
  | 'COLOUR'
  | 'COLOUR_GLASS'
  | 'TRANSPARENT'
  | 'BLURRED_COLOUR'
  | 'SOFT';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LogoProps {
  readonly variant?: LogoVariant;
  readonly appearance?: LogoAppearance;
  readonly size?: LogoSize;
  readonly className?: string;
  readonly animated?: boolean;
  readonly 'aria-label'?: string;
}

/**
 * Size mappings for logo variants
 */
export const LOGO_SIZES: Record<LogoSize, { readonly width: number; readonly height: number }> = {
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
};

/**
 * Default viewBox for SVG logo
 * Clear space = circle diameter (r=30, strokeWidth=2) = 60 + 4 = 64
 * ViewBox includes clear space around the logo
 */
export const LOGO_VIEWBOX = '0 0 200 200';
export const LOGO_CLEAR_SPACE = 64; // Circle diameter including stroke

/**
 * Default variant
 */
export const DEFAULT_VARIANT: LogoVariant = 'SR';

/**
 * Default appearance
 */
export const DEFAULT_APPEARANCE: LogoAppearance = 'COLOUR';

/**
 * Default size
 */
export const DEFAULT_SIZE: LogoSize = 'md';

