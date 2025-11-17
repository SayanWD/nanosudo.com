/**
 * SVG shapes for logo variants
 * Modular forms system based on DESIGN_SYSTEM.md
 * 
 * Key principles:
 * - Each layout contains the same shapes with different positions/3D rotations
 * - Some shapes can be hidden behind other shapes (z-index via order)
 * - Clear space = circle diameter (including stroke)
 * - Do not move/rotate individual shapes, only use provided layouts
 */

import type { ReactElement } from 'react';
import type { LogoVariant } from './logo-variants';
import {
  getVariantColors,
  LOGO_COLORS,
  VARIANT_S_COLORS,
  VARIANT_R_COLORS,
} from './logo-colors';

interface ShapeProps {
  readonly className?: string;
  readonly fill?: string;
  readonly stroke?: string;
  readonly strokeWidth?: number;
  readonly opacity?: number;
  readonly transform?: string;
}

/**
 * Base modular shape: Circle
 * Used as building block for letters
 */
function ModularCircle({ className, fill, stroke, strokeWidth = 2, opacity = 1, transform }: ShapeProps): ReactElement {
  return (
    <circle
      className={className}
      cx="100"
      cy="100"
      r="30"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      transform={transform}
    />
  );
}

/**
 * Base modular shape: Rectangle
 * Used as building block for letters
 */
function ModularRect({ className, fill, stroke, strokeWidth = 2, opacity = 1, transform, x = 70, y = 70, width = 60, height = 60, rx = 8 }: ShapeProps & { readonly x?: number; readonly y?: number; readonly width?: number; readonly height?: number; readonly rx?: number }): ReactElement {
  return (
    <rect
      className={className}
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      transform={transform}
    />
  );
}

/**
 * Base modular shape: Triangle (polygon)
 * Used for accents and connections
 */
function ModularTriangle({ className, fill, stroke, strokeWidth = 2, opacity = 1, transform, points = "100,70 130,110 70,110" }: ShapeProps & { readonly points?: string }): ReactElement {
  return (
    <polygon
      className={className}
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      transform={transform}
    />
  );
}

/**
 * Letter S composed of modular shapes
 * Based on DESIGN_SYSTEM.md: same shapes, different positions/rotations
 */
function LetterSShapes({ fill, stroke, strokeWidth = 2 }: { readonly fill?: string; readonly stroke?: string; readonly strokeWidth?: number }): ReactElement {
  const colors = VARIANT_S_COLORS;
  const useFill = fill !== undefined;
  const useStroke = stroke !== undefined;
  
  return (
    <g className="letter-s">
      {/* Top curve of S - composed of overlapping circles and rectangles */}
      <ModularCircle
        className="shape-s-top-1"
        fill={useFill ? fill : colors[0]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(-20, -30) scale(0.8)"
        opacity={0.9}
      />
      <ModularRect
        className="shape-s-top-2"
        fill={useFill ? fill : colors[0]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        x={60}
        y={60}
        width={40}
        height={25}
        rx={12}
        transform="rotate(-15 80 72)"
        opacity={0.85}
      />
      <ModularCircle
        className="shape-s-top-3"
        fill={useFill ? fill : colors[1]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(20, -25) scale(0.7)"
        opacity={0.8}
      />
      
      {/* Middle section of S */}
      <ModularRect
        className="shape-s-middle-1"
        fill={useFill ? fill : colors[0]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        x={85}
        y={90}
        width={30}
        height={20}
        rx={10}
        transform="rotate(90 100 100)"
        opacity={0.9}
      />
      <ModularCircle
        className="shape-s-middle-2"
        fill={useFill ? fill : colors[1]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="scale(0.6)"
        opacity={0.7}
      />
      
      {/* Bottom curve of S - mirrored from top */}
      <ModularCircle
        className="shape-s-bottom-1"
        fill={useFill ? fill : colors[1]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(-20, 30) scale(0.8)"
        opacity={0.9}
      />
      <ModularRect
        className="shape-s-bottom-2"
        fill={useFill ? fill : colors[1]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        x={60}
        y={115}
        width={40}
        height={25}
        rx={12}
        transform="rotate(15 80 127)"
        opacity={0.85}
      />
      <ModularCircle
        className="shape-s-bottom-3"
        fill={useFill ? fill : colors[0]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(20, 25) scale(0.7)"
        opacity={0.8}
      />
    </g>
  );
}

/**
 * Letter R composed of modular shapes
 * Based on DESIGN_SYSTEM.md: same shapes, different positions/rotations
 */
function LetterRShapes({ fill, stroke, strokeWidth = 2 }: { readonly fill?: string; readonly stroke?: string; readonly strokeWidth?: number }): ReactElement {
  const colors = VARIANT_R_COLORS;
  const useFill = fill !== undefined;
  const useStroke = stroke !== undefined;
  
  return (
    <g className="letter-r">
      {/* Vertical stem of R */}
      <ModularRect
        className="shape-r-stem-1"
        fill={useFill ? fill : colors[0]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        x={60}
        y={65}
        width={20}
        height={70}
        rx={10}
        opacity={0.95}
      />
      <ModularCircle
        className="shape-r-stem-2"
        fill={useFill ? fill : colors[0]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(-30, 0) scale(0.5)"
        opacity={0.8}
      />
      
      {/* Top curve/bowl of R */}
      <ModularCircle
        className="shape-r-top-1"
        fill={useFill ? fill : colors[0]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(15, -20) scale(0.9)"
        opacity={0.9}
      />
      <ModularRect
        className="shape-r-top-2"
        fill={useFill ? fill : colors[0]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        x={75}
        y={70}
        width={35}
        height={30}
        rx={15}
        transform="rotate(-10 92 85)"
        opacity={0.85}
      />
      <ModularCircle
        className="shape-r-top-3"
        fill={useFill ? fill : colors[1]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(25, -15) scale(0.6)"
        opacity={0.75}
      />
      
      {/* Diagonal leg of R */}
      <ModularRect
        className="shape-r-leg-1"
        fill={useFill ? fill : colors[1]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        x={75}
        y={100}
        width={45}
        height={18}
        rx={9}
        transform="rotate(25 97 109)"
        opacity={0.9}
      />
      <ModularTriangle
        className="shape-r-leg-2"
        fill={useFill ? fill : colors[1]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        points="75,105 115,130 75,125"
        opacity={0.85}
      />
      <ModularCircle
        className="shape-r-leg-3"
        fill={useFill ? fill : colors[1]}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(35, 30) scale(0.5)"
        opacity={0.7}
      />
    </g>
  );
}

/**
 * Variant SR: S on left, R on right
 * Same shapes, different positions (translate)
 */
export function VariantSRShapes({ fill, stroke, strokeWidth = 2 }: { readonly appearance?: string; readonly fill?: string; readonly stroke?: string; readonly strokeWidth?: number }): ReactElement {
  const colors = getVariantColors('SR');
  const sColors = 's' in colors ? colors.s : [];
  const rColors = 'r' in colors ? colors.r : [];
  
  // Support currentColor for dynamic coloring
  const useFill = fill !== undefined && fill !== 'currentColor';
  const useCurrentColor = fill === 'currentColor';
  const useStroke = stroke !== undefined;

  return (
    <g className="variant-sr">
      {/* Letter S on the left */}
      <g transform="translate(-45, 0)">
        <LetterSShapes 
          fill={useCurrentColor ? 'currentColor' : useFill ? fill : sColors[0]} 
          stroke={useStroke ? stroke : useCurrentColor ? 'none' : sColors[1]} 
          strokeWidth={strokeWidth} 
        />
      </g>
      {/* Letter R on the right */}
      <g transform="translate(45, 0)">
        <LetterRShapes 
          fill={useCurrentColor ? 'currentColor' : useFill ? fill : rColors[0]} 
          stroke={useStroke ? stroke : useCurrentColor ? 'none' : rColors[1]} 
          strokeWidth={strokeWidth} 
        />
      </g>
    </g>
  );
}

/**
 * Variant RS: R on left, S on right
 * Same shapes, different positions (translate)
 */
export function VariantRSShapes({ fill, stroke, strokeWidth = 2 }: { readonly appearance?: string; readonly fill?: string; readonly stroke?: string; readonly strokeWidth?: number }): ReactElement {
  const colors = getVariantColors('RS');
  const rColors = 'r' in colors ? colors.r : [];
  const sColors = 's' in colors ? colors.s : [];
  
  // Support currentColor for dynamic coloring
  const useFill = fill !== undefined && fill !== 'currentColor';
  const useCurrentColor = fill === 'currentColor';
  const useStroke = stroke !== undefined;

  return (
    <g className="variant-rs">
      {/* Letter R on the left */}
      <g transform="translate(-45, 0)">
        <LetterRShapes 
          fill={useCurrentColor ? 'currentColor' : useFill ? fill : rColors[0]} 
          stroke={useStroke ? stroke : useCurrentColor ? 'none' : rColors[1]} 
          strokeWidth={strokeWidth} 
        />
      </g>
      {/* Letter S on the right */}
      <g transform="translate(45, 0)">
        <LetterSShapes 
          fill={useCurrentColor ? 'currentColor' : useFill ? fill : sColors[0]} 
          stroke={useStroke ? stroke : useCurrentColor ? 'none' : sColors[1]} 
          strokeWidth={strokeWidth} 
        />
      </g>
    </g>
  );
}

/**
 * Variant S: only letter S
 */
export function VariantSShapes({ fill, stroke, strokeWidth = 2 }: { readonly appearance?: string; readonly fill?: string; readonly stroke?: string; readonly strokeWidth?: number }): ReactElement {
  return (
    <g className="variant-s">
      <LetterSShapes fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </g>
  );
}

/**
 * Variant R: only letter R
 */
export function VariantRShapes({ fill, stroke, strokeWidth = 2 }: { readonly appearance?: string; readonly fill?: string; readonly stroke?: string; readonly strokeWidth?: number }): ReactElement {
  return (
    <g className="variant-r">
      <LetterRShapes fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </g>
  );
}

/**
 * Variant DECONSTRUCTED: all shapes visible but not forming letters
 * Based on DESIGN_SYSTEM.md: shapes scattered, some parts cut, more abstract
 */
export function VariantDeconstructedShapes({ fill, stroke, strokeWidth = 2 }: { readonly appearance?: string; readonly fill?: string; readonly stroke?: string; readonly strokeWidth?: number }): ReactElement {
  // If fill is 'currentColor', use it; otherwise use provided fill or fallback to colors
  const useFill = fill !== undefined && fill !== 'currentColor';
  const useCurrentColor = fill === 'currentColor';
  const useStroke = stroke !== undefined;
  
  return (
    <g className="variant-deconstructed">
      {/* Scattered modular shapes - same as in letters but repositioned */}
      <ModularCircle
        className="shape-decon-1"
        fill={useCurrentColor ? 'currentColor' : useFill ? fill : LOGO_COLORS.azure}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(-30, -20) scale(0.9) rotate(45)"
        opacity={0.8}
      />
      <ModularRect
        className="shape-decon-2"
        fill={useCurrentColor ? 'currentColor' : useFill ? fill : LOGO_COLORS.springgreen}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        x={130}
        y={60}
        width={50}
        height={50}
        rx={12}
        transform="rotate(-30 155 85)"
        opacity={0.75}
      />
      <ModularCircle
        className="shape-decon-3"
        fill={useCurrentColor ? 'currentColor' : useFill ? fill : LOGO_COLORS.flamingo}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(-40, 30) scale(1.1) rotate(-20)"
        opacity={0.85}
      />
      <ModularTriangle
        className="shape-decon-4"
        fill={useCurrentColor ? 'currentColor' : useFill ? fill : LOGO_COLORS.lime}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        points="120,120 160,140 120,160"
        transform="rotate(15 140 140)"
        opacity={0.8}
      />
      <ModularRect
        className="shape-decon-5"
        fill={useCurrentColor ? 'currentColor' : useFill ? fill : LOGO_COLORS.azure}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        x={40}
        y={50}
        width={45}
        height={45}
        rx={8}
        transform="rotate(25 62 72)"
        opacity={0.7}
      />
      <ModularCircle
        className="shape-decon-6"
        fill={useCurrentColor ? 'currentColor' : useFill ? fill : LOGO_COLORS.springgreen}
        stroke={useStroke ? stroke : undefined}
        strokeWidth={strokeWidth}
        transform="translate(50, 40) scale(0.8) rotate(60)"
        opacity={0.75}
      />
    </g>
  );
}

/**
 * Get shapes component for variant
 */
export function getShapesForVariant(variant: LogoVariant): (props: { readonly appearance?: string; readonly fill?: string; readonly stroke?: string; readonly strokeWidth?: number }) => ReactElement {
  switch (variant) {
    case 'SR':
      return VariantSRShapes;
    case 'RS':
      return VariantRSShapes;
    case 'S':
      return VariantSShapes;
    case 'R':
      return VariantRShapes;
    case 'DECONSTRUCTED':
      return VariantDeconstructedShapes;
    case 'VERTICAL':
    case 'HORIZONTAL':
      // TODO: Implement vertical/horizontal layouts
      return VariantSRShapes;
    default:
      return VariantSRShapes;
  }
}
