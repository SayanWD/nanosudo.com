'use client';

import type { ReactElement, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type FlipCardProps = {
  readonly front: ReactNode;
  readonly back: ReactNode;
  readonly className?: string;
  readonly backgroundColor?: string;
  readonly autoFlipOnMobile?: boolean;
};

export function FlipCard({ front, back, className, backgroundColor, autoFlipOnMobile = false }: FlipCardProps): ReactElement {
  // Mobile: show simple card with back content (information visible)
  // Desktop: show flip card with hover effect
  // Use CSS media queries instead of JS to avoid hydration issues
  if (autoFlipOnMobile) {
    return (
      <>
        {/* Mobile version - simple card with information (visible on mobile) */}
        <div className={cn("why-me-card-mobile", className)}>
          <div 
            className="why-me-card-mobile-content flip-card-colored"
            style={{
              ...(backgroundColor ? { 
                '--flip-card-bg-base': backgroundColor,
              } : {}),
            } as React.CSSProperties}
            data-bg-color={backgroundColor}
          >
            {back}
          </div>
        </div>
        
        {/* Desktop version - flip card with hover (visible on desktop) */}
        <div className={cn("flip-card flip-card-desktop", className)}>
          <motion.div
            className="flip-card-inner"
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div 
              className="flip-card-front flip-card-colored"
              style={backgroundColor ? { 
                '--flip-card-bg-base': backgroundColor,
              } as React.CSSProperties : undefined}
              data-bg-color={backgroundColor}
            >
              {front}
            </div>
            <div 
              className="flip-card-back flip-card-colored"
              style={backgroundColor ? { 
                '--flip-card-bg-base': backgroundColor,
              } as React.CSSProperties : undefined}
              data-bg-color={backgroundColor}
            >
              {back}
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // Default flip card (when autoFlipOnMobile is false)
  return (
    <div className={cn("flip-card", className)}>
      <motion.div
        className="flip-card-inner"
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          className="flip-card-front flip-card-colored"
          style={backgroundColor ? { 
            '--flip-card-bg-base': backgroundColor,
          } as React.CSSProperties : undefined}
          data-bg-color={backgroundColor}
        >
          {front}
        </div>
        <div 
          className="flip-card-back flip-card-colored"
          style={backgroundColor ? { 
            '--flip-card-bg-base': backgroundColor,
          } as React.CSSProperties : undefined}
          data-bg-color={backgroundColor}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

