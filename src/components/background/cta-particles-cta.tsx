"use client";

import React from "react";
import CTAParticles from "./cta-particles-clean";

export default function CTAParticlesCTA(): React.ReactElement {
  return (
    <CTAParticles
      baseCount={360}
      className="absolute inset-0 -z-10 pointer-events-none"
      text="SUDO"
      mode="text"
      followCursor={true}
      center={false}
      trail={true}
      trailBurst={8}
    />
  );
}
