/**
 * Logo component
 * Modular logo system with variants SR, RS, S, R, DECONSTRUCTED
 */

'use client';

import type { ReactElement } from 'react';
import { cn } from '@/lib/cn';
import type { LogoProps, LogoAppearance } from './logo-variants';
import {
  DEFAULT_VARIANT,
  DEFAULT_APPEARANCE,
  DEFAULT_SIZE,
  LOGO_SIZES,
  LOGO_VIEWBOX,
} from './logo-variants';
import {
  VariantSRShapes,
} from './logo-shapes';
import {
  LOGO_TEXT_COLORS,
  LOGO_BG_COLORS,
} from './logo-colors';

/**
 * Get appearance styles for logo
 */
function getAppearanceStyles(
  appearance: LogoAppearance,
  isDark: boolean = false,
): {
  readonly fill?: string;
  readonly stroke?: string;
  readonly strokeWidth?: number;
  readonly opacity?: number;
  readonly filter?: string;
  readonly backdropFilter?: string;
  readonly background?: string;
} {
  switch (appearance) {
    case 'OUTLINE':
      return {
        fill: 'none',
        stroke: isDark ? LOGO_TEXT_COLORS.light : LOGO_TEXT_COLORS.dark,
        strokeWidth: 2,
      };
    case 'OUTLINE_BLURRED':
      return {
        fill: 'none',
        stroke: isDark ? LOGO_TEXT_COLORS.light : LOGO_TEXT_COLORS.dark,
        strokeWidth: 2,
        backdropFilter: 'blur(8px)',
        background: isDark ? LOGO_BG_COLORS.dark : LOGO_BG_COLORS.light,
      };
    case 'COLOUR':
      return {
        fill: 'currentColor',
        stroke: 'none',
        opacity: 1,
      };
    case 'COLOUR_GLASS':
      return {
        fill: 'currentColor',
        stroke: 'none',
        opacity: 0.9,
        backdropFilter: 'blur(12px)',
      };
    case 'TRANSPARENT':
      return {
        fill: 'currentColor',
        stroke: 'none',
        opacity: 0.7,
      };
    case 'BLURRED_COLOUR':
      return {
        fill: 'currentColor',
        stroke: 'none',
        opacity: 0.6, // Increased for better visibility
        filter: 'blur(15px)', // Reduced blur for better visibility
      };
    case 'SOFT':
      return {
        fill: 'currentColor',
        stroke: 'none',
        opacity: 0.9, // High opacity for soft shapes
      };
    default:
      return {
        fill: 'currentColor',
        stroke: 'none',
      };
  }
}

/**
 * Logo component
 */
export function Logo({
  variant = DEFAULT_VARIANT,
  appearance = DEFAULT_APPEARANCE,
  size = DEFAULT_SIZE,
  className,
  animated = false,
  'aria-label': ariaLabel = 'Sayan Roor logo',
}: LogoProps): ReactElement {
  const { width, height } = LOGO_SIZES[size];
  const appearanceStyles = getAppearanceStyles(appearance);

  // For COLOUR appearance, use currentColor (set via style.color on parent)
  // For BLURRED_COLOUR and SOFT, also use currentColor
  const useCurrentColor = appearance === 'COLOUR' || appearance === 'COLOUR_GLASS' || appearance === 'TRANSPARENT' || appearance === 'BLURRED_COLOUR' || appearance === 'SOFT';

  // Render shapes based on variant (components declared outside render)
  function renderShapes(): ReactElement {
    const props = {
      // When using currentColor, pass 'currentColor' string so shapes use it
      fill: useCurrentColor ? 'currentColor' : appearanceStyles.fill,
      stroke: useCurrentColor ? 'none' : appearanceStyles.stroke,
      strokeWidth: appearanceStyles.strokeWidth || 2,
      opacity: appearanceStyles.opacity || 0.9,
    };

    // Simplified: only SR variant for all appearances
    switch (variant) {
      case 'SR':
      case 'RS':
      case 'S':
      case 'R':
      case 'DECONSTRUCTED':
      case 'VERTICAL':
      case 'HORIZONTAL':
      default:
        return <VariantSRShapes {...props} />;
    }
  }

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={width}
      height={height}
      className={cn(
        'logo',
        `logo--${variant}`,
        `logo--${appearance}`,
        `logo--${size}`,
        animated && 'logo--animated',
        className,
      )}
      aria-label={ariaLabel}
      role="img"
      style={{
        opacity: appearanceStyles.opacity,
        filter: appearanceStyles.filter,
        backdropFilter: appearanceStyles.backdropFilter,
        background: appearanceStyles.background,
      }}
    >
      <defs>
        {/* Gradients and filters for advanced effects */}
        <linearGradient id="logo-gradient-azure" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--logo-color-azure, #99b9ff)" />
          <stop offset="100%" stopColor="var(--logo-color-springgreen, #78ffd1)" />
        </linearGradient>
        <linearGradient id="logo-gradient-flamingo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--logo-color-flamingo, #ffb3c2)" />
          <stop offset="100%" stopColor="var(--logo-color-lime, #f0ffa6)" />
        </linearGradient>
        {appearance === 'BLURRED_COLOUR' && (
          <filter id="blur-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
        )}
      </defs>
      {renderShapes()}
    </svg>
  );
}

