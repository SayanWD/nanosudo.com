'use client';

import type { ReactElement, ReactNode } from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

type FlipCardProps = {
  readonly front: ReactNode;
  readonly back: ReactNode;
  readonly className?: string;
  readonly backgroundColor?: string;
};

export function FlipCard({ front, back, className, backgroundColor }: FlipCardProps): ReactElement {
  // Initialize isMobile based on window width if available (client-side)
  // On server, default to false to match initial render
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const checkMobile = (): void => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, start with back side visible (not flipped, so isFlipped = false)
      // isFlipped = true means front is visible, isFlipped = false means back is visible
      if (mobile) {
        setIsFlipped(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return (): void => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleTap = (): void => {
    if (isMobile) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className={cn("flip-card", className)}>
      <motion.div
        className={cn("flip-card-inner", isMobile && isFlipped && "mobile-flipped")}
        animate={isMobile ? { rotateY: isFlipped ? 0 : 180 } : {}}
        whileHover={!isMobile ? { rotateY: 180 } : {}}
        onTap={handleTap}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        suppressHydrationWarning
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

