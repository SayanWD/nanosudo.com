/**
 * Soft rounded blob-like shapes for logo
 * Based on image reference: soft, rounded, volumetric forms with glassmorphism
 * 
 * S = 2 rounded elements (like Russian С) that assemble into S
 * R = 1 rounded С shape + 2 rounded lines (sticks) - one larger, one smaller
 */

import type { ReactElement } from 'react';
import { LOGO_COLORS, VARIANT_S_COLORS, VARIANT_R_COLORS } from './logo-colors';

interface SoftShapeProps {
  readonly fill?: string;
  readonly stroke?: string;
  readonly opacity?: number;
}

/**
 * Soft blob shape with glassmorphism effect
 * Dark outline + translucent gradient fill
 */
function SoftBlob({ 
  path, 
  gradientId, 
  color1, 
  color2, 
  opacity = 0.9,
  strokeColor = '#606887' // Dark grey outline
}: { 
  readonly path: string; 
  readonly gradientId: string; 
  readonly color1: string; 
  readonly color2: string; 
  readonly opacity?: number;
  readonly strokeColor?: string;
}): ReactElement {
  return (
    <>
      <defs>
        {/* Gradient fill for glassmorphism */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} stopOpacity={opacity * 0.6} />
          <stop offset="50%" stopColor={color1} stopOpacity={opacity * 0.7} />
          <stop offset="100%" stopColor={color2} stopOpacity={opacity * 0.5} />
        </linearGradient>
        {/* Grainy texture filter */}
        <filter id={`texture-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer result="grain">
            <feFuncA type="discrete" tableValues="0.3 0.5 0.4 0.6" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="grain" operator="overlay" opacity="0.2" />
        </filter>
        {/* Soft shadow for 3D effect */}
        <filter id={`shadow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset in="blur" dx="2" dy="3" result="offsetBlur" />
          <feComponentTransfer in="offsetBlur" result="shadow">
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={path}
        fill={`url(#${gradientId})`}
        stroke={strokeColor}
        strokeWidth="3"
        filter={`url(#texture-${gradientId}) url(#shadow-${gradientId})`}
        opacity={opacity}
      />
    </>
  );
}

/**
 * Letter S - 2 rounded elements (like Russian С) that assemble into S
 */
export function LetterSShapesSoft({ fill, opacity = 0.9 }: SoftShapeProps): ReactElement {
  const colors = fill && fill !== 'currentColor' ? [fill, fill] : VARIANT_S_COLORS;
  const useCurrentColor = fill === 'currentColor';
  const color1 = useCurrentColor ? 'currentColor' : colors[0];
  const color2 = useCurrentColor ? 'currentColor' : colors[1];
  
  return (
    <g className="letter-s-soft">
      {/* Top С element (upper curve of S) */}
      <SoftBlob
        path="M 50 50 Q 70 40, 90 50 Q 110 60, 90 70 Q 70 80, 50 70 Q 40 65, 50 60 Q 60 55, 50 50 Z"
        gradientId="s-top-c-gradient"
        color1={color1}
        color2={color2}
        opacity={opacity}
      />
      
      {/* Bottom С element (lower curve of S) - rotated/flipped */}
      <SoftBlob
        path="M 50 100 Q 70 90, 90 100 Q 110 110, 90 120 Q 70 130, 50 120 Q 40 115, 50 110 Q 60 105, 50 100 Z"
        gradientId="s-bottom-c-gradient"
        color1={color2}
        color2={color1}
        opacity={opacity * 0.9}
      />
      
      {/* Connection between two С elements (middle part) */}
      <SoftBlob
        path="M 80 70 Q 85 75, 80 80 Q 75 85, 80 90 Q 85 95, 80 100"
        gradientId="s-connection-gradient"
        color1={color1}
        color2={color2}
        opacity={opacity * 0.7}
      />
    </g>
  );
}

/**
 * Letter R - 1 rounded С shape + 2 rounded lines (sticks)
 * Components:
 * - 1 rounded С shape (bowl of R)
 * - 2 rounded lines (sticks): larger (vertical stem) + smaller (diagonal leg)
 */
export function LetterRShapesSoft({ fill, opacity = 0.9 }: SoftShapeProps): ReactElement {
  const colors = fill && fill !== 'currentColor' ? [fill, fill] : VARIANT_R_COLORS;
  const useCurrentColor = fill === 'currentColor';
  const color1 = useCurrentColor ? 'currentColor' : colors[0];
  const color2 = useCurrentColor ? 'currentColor' : colors[1];
  
  return (
    <g className="letter-r-soft">
      {/* Vertical stem - larger rounded line (stick) */}
      <SoftBlob
        path="M 60 50 Q 65 45, 70 50 L 70 140 Q 65 145, 60 140 Q 55 135, 60 130 L 60 60 Q 55 55, 60 50 Z"
        gradientId="r-stem-gradient"
        color1={color1}
        color2={color1}
        opacity={opacity}
      />
      
      {/* Top С shape (bowl of R) - like Russian С */}
      <SoftBlob
        path="M 70 60 Q 90 55, 110 65 Q 125 75, 110 85 Q 90 95, 70 90 Q 65 85, 70 80 Q 75 75, 80 70 Q 85 65, 70 60 Z"
        gradientId="r-c-bowl-gradient"
        color1={color1}
        color2={color2}
        opacity={opacity * 0.9}
      />
      
      {/* Diagonal leg - smaller rounded line (stick) */}
      <SoftBlob
        path="M 70 95 Q 85 105, 110 125 Q 120 135, 110 140 Q 95 130, 75 110 Q 70 105, 75 100 Q 80 95, 70 95 Z"
        gradientId="r-leg-gradient"
        color1={color2}
        color2={color1}
        opacity={opacity * 0.85}
      />
    </g>
  );
}

/**
 * Variant SR - S on left, R on right
 */
export function VariantSRShapesSoft({ fill, opacity = 0.9 }: SoftShapeProps): ReactElement {
  const useCurrentColor = fill === 'currentColor';
  const sFill = useCurrentColor ? 'currentColor' : (fill || undefined);
  const rFill = useCurrentColor ? 'currentColor' : (fill || undefined);
  
  return (
    <g className="variant-sr-soft">
      <g transform="translate(-50, 0)">
        <LetterSShapesSoft fill={sFill} opacity={opacity} />
      </g>
      <g transform="translate(50, 0)">
        <LetterRShapesSoft fill={rFill} opacity={opacity} />
      </g>
    </g>
  );
}

/**
 * Variant RS - R on left, S on right
 */
export function VariantRSShapesSoft({ fill, opacity = 0.9 }: SoftShapeProps): ReactElement {
  const useCurrentColor = fill === 'currentColor';
  const rFill = useCurrentColor ? 'currentColor' : (fill || undefined);
  const sFill = useCurrentColor ? 'currentColor' : (fill || undefined);
  
  return (
    <g className="variant-rs-soft">
      <g transform="translate(-50, 0)">
        <LetterRShapesSoft fill={rFill} opacity={opacity} />
      </g>
      <g transform="translate(50, 0)">
        <LetterSShapesSoft fill={sFill} opacity={opacity} />
      </g>
    </g>
  );
}

/**
 * Deconstructed - scattered soft blobs
 * Based on image: 5 organic blob shapes with glassmorphism
 */
export function VariantDeconstructedSoft({ opacity = 0.9 }: SoftShapeProps): ReactElement {
  return (
    <g className="variant-deconstructed-soft">
      {/* Long wavy shape - green to yellow (top-left to center) */}
      <SoftBlob
        path="M 10 30 Q 30 20, 60 25 Q 90 30, 120 28 Q 150 26, 170 30 Q 180 35, 170 40 Q 150 45, 120 43 Q 90 45, 60 40 Q 30 35, 10 30 Z"
        gradientId="decon-wave"
        color1={LOGO_COLORS.springgreen}
        color2={LOGO_COLORS.lime}
        opacity={opacity * 0.8}
      />
      
      {/* Small circle - pink to peach (top-right) */}
      <SoftBlob
        path="M 150 20 Q 160 15, 170 20 Q 175 25, 170 30 Q 165 35, 160 30 Q 155 25, 150 20 Z"
        gradientId="decon-circle"
        color1={LOGO_COLORS.flamingo}
        color2="#ffd4b3"
        opacity={opacity * 0.75}
      />
      
      {/* C-shape left - pink to yellow (middle-left, vertical, open right) */}
      <SoftBlob
        path="M 20 70 Q 30 60, 40 70 Q 50 80, 40 90 Q 30 100, 20 90 Q 15 85, 20 80 Q 25 75, 20 70 Z"
        gradientId="decon-c-left"
        color1={LOGO_COLORS.flamingo}
        color2={LOGO_COLORS.lime}
        opacity={opacity * 0.85}
      />
      
      {/* C-shape right - blue to cyan (middle-right, vertical, open left) */}
      <SoftBlob
        path="M 130 60 Q 140 50, 150 60 Q 160 70, 150 80 Q 140 90, 130 80 Q 125 75, 130 70 Q 135 65, 130 60 Z"
        gradientId="decon-c-right"
        color1={LOGO_COLORS.azure}
        color2={LOGO_COLORS.springgreen}
        opacity={opacity * 0.9}
      />
      
      {/* Wide U-shape bottom - purple to pink (horizontal, open upward) */}
      <SoftBlob
        path="M 30 120 Q 50 110, 90 115 Q 130 120, 150 110 Q 160 125, 150 140 Q 130 150, 90 145 Q 50 140, 30 130 Q 25 125, 30 120 Z"
        gradientId="decon-u-bottom"
        color1="#d4a5ff"
        color2={LOGO_COLORS.flamingo}
        opacity={opacity * 0.8}
      />
    </g>
  );
}
