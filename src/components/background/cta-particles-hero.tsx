"use client";

import React from "react";
import CTAParticles from "./cta-particles-clean";

export default function CTAParticlesHero(): React.ReactElement {
  return (
    <CTAParticles
      baseCount={360}
      className="absolute inset-0 -z-10 pointer-events-none"
      text="NANO"
      mode="text"
      rotate={true}
      rotationSpeed={0.0008}
      followCursor={true}
      center={true}
      trail={false}
    />
  );
}
