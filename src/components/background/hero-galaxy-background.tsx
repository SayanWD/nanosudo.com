"use client";

import type { ReactElement } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero background: modern, minimal, performant.
 *
 * Design principles:
 * - No heavy canvas; only a few GPU-accelerated layers.
 * - Soft brand-colored gradients (azure, aqua, flamingo, lime) forming depth.
 * - Subtle animated beams that move slowly for a premium feel.
 * - Very low-contrast grid to hint at systems/architecture.
 * - Respects `prefers-reduced-motion`.
 */
export function HeroGalaxyBackground(): ReactElement {
  const shouldReduceMotion = useReducedMotion();

  const floatTransition = {
    duration: 22,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base background matching site theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

      {/* Brand-colored depth field */}
      <div
        className="absolute inset-[-12%] opacity-80 dark:opacity-60"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 0% 0%, rgba(153,185,255,0.32), transparent 55%)",
            "radial-gradient(circle at 100% 0%, rgba(120,255,209,0.26), transparent 55%)",
            "radial-gradient(circle at 0% 100%, rgba(255,179,194,0.24), transparent 55%)",
            "radial-gradient(circle at 100% 100%, rgba(240,255,166,0.22), transparent 55%)",
          ].join(","),
        }}
      />

      {/* Animated beams — subtle, slow, GPU-accelerated */}
      {!shouldReduceMotion && (
        <>
          {/* Left vertical beam */}
          <motion.div
            className="absolute -left-40 top-[-10%] h-[140%] w-48 rounded-[999px] bg-gradient-to-b from-[#99b9ff]/28 via-[#78ffd1]/10 to-transparent blur-3xl"
            initial={{ y: -40 }}
            animate={{ y: 40 }}
            transition={floatTransition}
          />

          {/* Right diagonal beam */}
          <motion.div
            className="absolute -right-52 top-[-20%] h-[160%] w-64 rounded-[999px] bg-gradient-to-b from-[#ffb3c2]/26 via-[#99b9ff]/8 to-transparent blur-3xl"
            initial={{ y: 50, rotate: -8 }}
            animate={{ y: -30, rotate: -4 }}
            transition={floatTransition}
          />

          {/* Center soft highlight behind main copy */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-accent/22 via-accent/6 to-transparent blur-3xl"
            initial={{ opacity: 0.7, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1.02 }}
            transition={{
              duration: 14,
              repeat: Infinity,
              repeatType: "reverse",
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </>
      )}

      {/* Static fallback when motion is reduced: soft halo behind hero copy */}
      {shouldReduceMotion && (
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-accent/18 via-accent/4 to-transparent blur-3xl" />
      )}

      {/* Subtle tech grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: [
            "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 15%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 15%, black 30%, transparent 100%)",
        }}
      />

      {/* Soft vignette so content edges stay readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/70" />
    </div>
  );
}
