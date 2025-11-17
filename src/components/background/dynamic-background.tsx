'use client';

// Dynamic background component with smooth gradient animations
// Uses colors from DESIGN_SYSTEM.md for consistency
import type { ReactElement } from 'react';

/**
 * Dynamic background with animated gradients
 * Follows UX/UI best practices:
 * - Subtle animations that don't distract from content
 * - Uses design system colors (FLAMINGO, AZURE, SPRINGGREEN, LIME)
 * - Works in both light and dark themes with adjusted opacity
 * - Performance-optimized CSS animations
 * - Respects prefers-reduced-motion
 */
export function DynamicBackground(): ReactElement {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        {/* Orb 1 - Azure (top-left) */}
        <div
          className="bg-orb-1 absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-[#99b9ff] opacity-20 blur-3xl transition-opacity duration-1000 dark:opacity-10"
        />
        
        {/* Orb 2 - Spring Green (top-right) */}
        <div
          className="bg-orb-2 absolute -right-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-[#78ffd1] opacity-15 blur-3xl transition-opacity duration-1000 dark:opacity-8"
        />
        
        {/* Orb 3 - Flamingo (bottom-left) */}
        <div
          className="bg-orb-3 absolute -bottom-1/4 -left-1/4 h-[550px] w-[550px] rounded-full bg-[#ffb3c2] opacity-15 blur-3xl transition-opacity duration-1000 dark:opacity-8"
        />
        
        {/* Orb 4 - Lime (bottom-right) */}
        <div
          className="bg-orb-4 absolute -bottom-1/4 -right-1/4 h-[450px] w-[450px] rounded-full bg-[#f0ffa6] opacity-12 blur-3xl transition-opacity duration-1000 dark:opacity-6"
        />
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}

