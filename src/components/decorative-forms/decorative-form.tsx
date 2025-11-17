/**
 * Decorative Form Component
 * Large soft rounded forms for page decoration
 * Uses Logo component with SOFT appearance - soft, rounded, blob-like forms with gradients
 */

'use client';

import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { Logo, type LogoVariant } from '@/components/logo';

export type FormType = 's-part' | 'r-part' | 'sr-combined' | 'rs-combined' | 'deconstructed';

export interface DecorativeFormProps {
  readonly type: FormType;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly className?: string;
  readonly animated?: boolean;
  readonly initialX?: number;
  readonly initialY?: number;
  readonly delay?: number;
}


/**
 * Map form type to logo variant
 */
function getVariantFromType(type: FormType): LogoVariant {
  switch (type) {
    case 's-part':
      return 'S';
    case 'r-part':
      return 'R';
    case 'sr-combined':
      return 'SR';
    case 'rs-combined':
      return 'RS';
    case 'deconstructed':
      return 'DECONSTRUCTED';
    default:
      return 'SR';
  }
}

/**
 * Get color for form based on type
 */
function getColorForType(type: FormType): string {
  switch (type) {
    case 's-part':
    case 'sr-combined':
      return '#99b9ff'; // Azure
    case 'r-part':
    case 'rs-combined':
      return '#ffb3c2'; // Flamingo
    case 'deconstructed':
      return '#78ffd1'; // Springgreen
    default:
      return '#99b9ff';
  }
}

/**
 * Decorative Form Component
 */
export function DecorativeForm({
  type,
  size = 'lg',
  className,
  animated = true,
  initialX = 0,
  initialY = 0,
  delay = 0,
}: DecorativeFormProps): ReactElement {
  const variant = getVariantFromType(type);
  const color = getColorForType(type);
  const logoSize = size;

  const content = (
    <div
      style={{
        color,
        filter: 'blur(6px)',
        opacity: 0.6,
      }}
      className={className}
    >
      <Logo
        variant={variant}
        appearance="SOFT"
        size={logoSize}
        className="transition-opacity"
        aria-hidden="true"
      />
    </div>
  );

  if (!animated) {
    return (
      <div style={{ position: 'absolute', pointerEvents: 'none' }}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ 
        x: initialX, 
        y: initialY, 
        scale: 1,
        rotate: 0,
        opacity: 0.5,
      }}
      animate={{
        x: [initialX, initialX + 100, initialX - 60, initialX],
        y: [initialY, initialY + 80, initialY - 90, initialY],
        scale: [1, 1.4, 0.9, 1],
        rotate: [0, 60, -45, 360],
        opacity: [0.5, 0.7, 0.6, 0.5],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
      }}
    >
      {content}
    </motion.div>
  );
}
