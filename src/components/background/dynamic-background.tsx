'use client';

/**
 * Modern, tech-forward dynamic background component
 * 
 * Features:
 * - Smooth animated gradient orbs with parallax-like movement
 * - Subtle grid pattern for tech aesthetic
 * - Radial gradients for depth
 * - Performance-optimized CSS animations
 * - Mobile-responsive sizing
 * - Respects prefers-reduced-motion
 * - Works in both light and dark themes
 * 
 * UX/UI Best Practices:
 * - Non-intrusive animations that don't distract from content
 * - Low opacity to maintain readability
 * - Hardware-accelerated transforms
 * - Reduced motion support for accessibility
 */
import type { ReactElement } from 'react';

export function DynamicBackground(): ReactElement {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base gradient background with radial fade */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(153, 185, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(120, 255, 209, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 179, 194, 0.1) 0%, transparent 60%)
          `,
        }}
      />
      
      {/* Animated gradient orbs with smooth movement */}
      <div className="absolute inset-0">
        {/* Orb 1 - Azure (top-left, moves slowly) */}
        <div
          className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] md:h-[700px] md:w-[700px] rounded-full bg-[#99b9ff] opacity-20 blur-[100px] dark:opacity-12 animate-orb-1"
        />
        
        {/* Orb 2 - Spring Green (top-right, moves opposite) */}
        <div
          className="absolute -right-[10%] -top-[15%] h-[450px] w-[450px] md:h-[650px] md:w-[650px] rounded-full bg-[#78ffd1] opacity-18 blur-[100px] dark:opacity-10 animate-orb-2"
        />
        
        {/* Orb 3 - Flamingo (bottom-left, slower movement) */}
        <div
          className="absolute -bottom-[10%] -left-[15%] h-[480px] w-[480px] md:h-[680px] md:w-[680px] rounded-full bg-[#ffb3c2] opacity-16 blur-[100px] dark:opacity-9 animate-orb-3"
        />
        
        {/* Orb 4 - Lime (bottom-right, subtle movement) */}
        <div
          className="absolute -bottom-[15%] -right-[10%] h-[400px] w-[400px] md:h-[600px] md:w-[600px] rounded-full bg-[#f0ffa6] opacity-14 blur-[100px] dark:opacity-7 animate-orb-4"
        />
      </div>
      
      {/* Tech grid pattern overlay - subtle and modern */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: 'clamp(32px, 4vw, 64px) clamp(32px, 4vw, 64px)',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
      
      {/* Subtle radial gradient overlay for depth */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 0% 0%, rgba(153, 185, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 100% 100%, rgba(120, 255, 209, 0.06) 0%, transparent 60%)
          `,
        }}
      />
      
    </div>
  );
}

