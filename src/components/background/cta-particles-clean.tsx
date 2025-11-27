"use client";

import React, { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z?: number;
  vx: number;
  vy: number;
  vz?: number;
  size: number;
  color: string;
  alpha: number;
  homeX: number;
  homeY: number;
  targetX?: number;
  targetY?: number;
  // sphere-mode helpers
  targetAngle?: number;
  targetRadius?: number;
  // spherical targets for full 3D
  targetTheta?: number;
  targetPhi?: number;
  // text / interaction helpers
  isText?: boolean;
  detachedUntil?: number;
  targetScreenX?: number;
  targetScreenY?: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function prefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

type CTAParticlesProps = {
  readonly baseCount?: number;
  readonly cornerPadding?: number;
  readonly text?: string;
  readonly className?: string;
  readonly spreadFactor?: number;
  readonly mode?: "text" | "sphere";
  readonly rotate?: boolean;
  readonly rotationSpeed?: number; // radians per ms
  readonly wave?: boolean;
  readonly waveRadius?: number; // px
  readonly waveStrength?: number; // 0..1
  readonly waveSpeed?: number; // frequency
  readonly followCursor?: boolean;
  readonly center?: boolean; // force center formation
  readonly trail?: boolean;
  readonly trailBurst?: number; // number of trail dots per movement
};

export default function CTAParticlesClean({
  baseCount = 1800,
  cornerPadding = 80,
  text = "NANO",
  className = "absolute inset-0 z-0 pointer-events-none",
  spreadFactor = 0.06,
  mode = "text",
  rotate = false,
  rotationSpeed = 0.0006,
  wave = false,
  waveRadius = 160,
  waveStrength = 0.18,
  waveSpeed = 0.02,
  followCursor = true,
  center = false,
  trail = true,
  trailBurst = 8,
}: CTAParticlesProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouse = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const rotationRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current) return;
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    // corner padding and particle count controlled by props (defaults above)
    let particles: Particle[] = [];
    let textPoints: Array<{ x: number; y: number }> = [];
    let cursorTextPoints: Array<{ x: number; y: number }> = [];
    type Trail = { x: number; y: number; z: number; vx: number; vy: number; vz: number; alpha: number; size: number; life: number };
    const trails: Trail[] = [];
    const sphereOffset = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const lastSphere = { x: 0, y: 0 };
    
    // adaptive cap depending on device
    const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { hardwareConcurrency?: number }) : undefined;
    const hardwareConcurrency = nav?.hardwareConcurrency ?? 4;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const deviceFactor = Math.max(0.3, Math.min(1, (hardwareConcurrency / 6) * (1 / dpr)));
    const effectiveBaseCount = Math.max(200, Math.floor(baseCount * deviceFactor));

    function rand(min: number, max: number): number {
      return Math.random() * (max - min) + min;
    }

    function sampleColors(): string[] {
      if (prefersDark()) return ["255,255,255", "170,200,255"];
      return ["20,24,30", "90,120,180"];
    }

    function createTextPoints(): void {
      textPoints = [];
      const tc = document.createElement("canvas");
      const tctx = tc.getContext("2d");
      if (!tctx) return;
      
      const sphereRadius = Math.max(40, Math.min(width, height) * 0.28);
      // Make text large and clearly visible inside the sphere
      const tw = Math.max(240, Math.min(1200, Math.floor(sphereRadius * 2 * 0.95)));
      const th = Math.max(100, Math.floor(tw * 0.28));
      tc.width = tw;
      tc.height = th;

      const fontSize = Math.floor(th * 0.85);
      tctx.clearRect(0, 0, tw, th);
      tctx.fillStyle = "white";
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";
      tctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
      tctx.fillText(text, tw / 2, th / 2);

      const imageData = tctx.getImageData(0, 0, tw, th).data;
      const gap = 8;
      const scale = Math.min((sphereRadius * 2) / tw, height / th) * 0.95;
      // center the text on the section center (sphere center)
      const offsetX = (width / 2) - (tw * scale) / 2;
      const offsetY = (height / 2) - (th * scale) / 2;

      for (let y = 0; y < th; y += gap) {
        for (let x = 0; x < tw; x += gap) {
          const idx = (y * tw + x) * 4 + 3;
          if (imageData[idx] > 128) {
            textPoints.push({ x: x * scale + offsetX, y: y * scale + offsetY });
          }
        }
      }

      for (let i = textPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [textPoints[i], textPoints[j]] = [textPoints[j], textPoints[i]];
      }
    }

    function createCursorTextPoints(mx: number, my: number): void {
      cursorTextPoints = [];
      const tc = document.createElement("canvas");
      const tctx = tc.getContext("2d");
      if (!tctx) return;
      const sphereRadius = Math.max(40, Math.min(width, height) * 0.28);
      const tw = Math.max(240, Math.floor(sphereRadius * 2 * 1.0));
      const th = Math.max(100, Math.floor(tw * 0.32));
      tc.width = tw;
      tc.height = th;
      const fontSize = Math.floor(th * 0.9);
      tctx.clearRect(0, 0, tw, th);
      tctx.fillStyle = "white";
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";
      tctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
      tctx.fillText(text, tw / 2, th / 2);
      const imageData = tctx.getImageData(0, 0, tw, th).data;
      const gap = 20; // sparse gap for 5× fewer particles
      const scale = 1; // keep points in screen px for cursor placement
      const offsetX = mx - (tw * scale) / 2;
      const offsetY = my - (th * scale) / 2;
      for (let y = 0; y < th; y += gap) {
        for (let x = 0; x < tw; x += gap) {
          const idx = (y * tw + x) * 4 + 3;
          if (imageData[idx] > 100) { // lower threshold to catch more edge pixels
            cursorTextPoints.push({ x: x * scale + offsetX, y: y * scale + offsetY });
          }
        }
      }
      for (let i = cursorTextPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cursorTextPoints[i], cursorTextPoints[j]] = [cursorTextPoints[j], cursorTextPoints[i]];
      }
    }

    function createSpherePoints(): void {
      textPoints = [];
      // compatibility placeholder
    }

    function initParticles(): void {
      particles = [];
      const colors = sampleColors();
      const sphereRadius = Math.max(40, Math.min(width, height) * 0.28);

      if (mode === "sphere") {
        for (let i = 0; i < effectiveBaseCount; i++) {
          // Place particles on the sphere surface with slight jitter so shape is preserved
          const u = Math.random();
          const v = Math.random();
          const theta = Math.acos(2 * u - 1);
          const phi = 2 * Math.PI * v;
          // sample radius uniformly in volume using cubic root for correct distribution
          const r = sphereRadius * Math.cbrt(Math.random());
          const tx = r * Math.sin(theta) * Math.cos(phi);
          const ty = r * Math.sin(theta) * Math.sin(phi);
          const tz = r * Math.cos(theta);
          const jitter = 1.6;
          const px = tx + rand(-jitter, jitter);
          const py = ty + rand(-jitter, jitter);
          const pz = tz + rand(-jitter, jitter);
          const speed = rand(0.02, 0.6);
          const angle = rand(0, Math.PI * 2);
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;
          const vz = (Math.random() - 0.5) * 0.4;
          const size = rand(0.9, 2.8);
          const color = colors[Math.floor(Math.random() * colors.length)];
          const alpha = rand(0.45, 0.95);
        const p: Particle = {
          x: px,
          y: py,
          z: pz,
          vx,
          vy,
          vz,
          size: mode === "sphere" ? 3.2 : size, // match CTA particle size in sphere mode
          color,
          alpha: mode === "sphere" ? 0.96 : alpha, // match CTA particle alpha in sphere mode
          homeX: px,
          homeY: py,
        };

          if (mode === "sphere") {
            p.targetTheta = theta;
            p.targetPhi = phi;
            p.targetRadius = r;
          }
          particles.push(p);
        }
      } else {
        // text / full-area spawn mode: distribute across the section volume
        for (let i = 0; i < effectiveBaseCount; i++) {
          let px: number;
          let py: number;
          let pz: number;
          let homeX: number;
          let homeY: number;
          
          // if rotate is enabled in text mode, treat particles as a sphere field centered at canvas center
          if (rotate) {
            const u = Math.random();
            const v = Math.random();
            const theta = Math.acos(2 * u - 1);
            const phi = 2 * Math.PI * v;
            const r = sphereRadius * Math.cbrt(Math.random());
            px = r * Math.sin(theta) * Math.cos(phi);
            py = r * Math.sin(theta) * Math.sin(phi);
            pz = r * Math.cos(theta);
            homeX = px;
            homeY = py;
            
            const speed = rand(0.02, 0.6);
            const angle = rand(0, Math.PI * 2);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const vz = (Math.random() - 0.5) * 0.4;
            const size = 3.2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const alpha = 0.96;
            
            const p: Particle = {
              x: px,
              y: py,
              z: pz,
              vx,
              vy,
              vz,
              size,
              color,
              alpha,
              homeX,
              homeY,
              targetTheta: theta,
              targetPhi: phi,
              targetRadius: r,
            };
            particles.push(p);
          } else {
            // text mode without rotate: full area spawn
            px = rand(0, width);
            py = rand(0, height);
            pz = rand(-sphereRadius, sphereRadius);
            homeX = px;
            homeY = py;
            
            const speed = rand(0.01, 0.45);
            const angle = rand(0, Math.PI * 2);
            const vx = Math.cos(angle) * speed * 0.6;
            const vy = Math.sin(angle) * speed * 0.6;
            const vz = (Math.random() - 0.5) * 0.4;
            const size = rand(0.6, 2.2);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const alpha = rand(0.35, 0.95);
            const p: Particle = {
              x: px,
              y: py,
              z: pz,
              vx,
              vy,
              vz,
              size,
              color,
              alpha,
              homeX,
              homeY,
            };
            particles.push(p);
          }
        }
        
        // if we have text points, choose a subset of particles to form the visible large text
        if (textPoints.length > 0) {
          const textCount = Math.min(textPoints.length, Math.max(12, Math.floor(effectiveBaseCount * 0.36)));
          // shuffle indices
          const indices = Array.from({ length: particles.length }, (_, i) => i);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          for (let t = 0; t < textCount; t++) {
            const pi = particles[indices[t]];
            // targets assigned dynamically on hover via gatherTargets()
            pi.isText = true;
            // make text particles slightly larger and higher alpha
            pi.size = Math.max(pi.size, 1.6 + Math.random() * 1.8);
            pi.alpha = Math.max(pi.alpha, 0.8);
          }
        }
      }
    }

    function resize(): void {
      if (!wrapperRef.current) {
        width = 0;
        height = 0;
        return;
      }
      const rect = wrapperRef.current.getBoundingClientRect();
      if (!rect) {
        width = 0;
        height = 0;
        return;
      }
      width = Math.max(0, Math.floor(rect.width));
      height = Math.max(0, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (mode === "sphere") createSpherePoints();
      else createTextPoints();
      initParticles();
    }

    // Boost logic when user first enters the CTA with pointer
    let boostUntil = 0;
    const BOOST_DURATION = 350; // ms
    const BASE_ATTRACTION = 0.0018;
    const BOOST_MULTIPLIER = 3.2;
    // no-op placeholder (previous implementation tracked lastActive in closure)
    // kept for readability — not used programmatically

    function onPointerMove(e: PointerEvent): void {
      if (!wrapperRef.current) {
        mouse.current.active = false;
        return;
      }
      const rect = wrapperRef.current.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inside) {
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
        mouse.current.active = true;
        // set desired sphere offset target (screen-space), scaled down
        // use canvas width/height not rect dimensions for accurate center
        if (followCursor && !center) {
          const cx = width / 2;
          const cy = height / 2;
          sphereOffset.targetX = (mouse.current.x - cx) * 0.14;
          sphereOffset.targetY = (mouse.current.y - cy) * 0.14;
        }
        // if in sphere mode, create cursor text points and detach nearby surface particles to follow the cursor
        if (mode === "sphere") {
          if (cursorTextPoints.length === 0) createCursorTextPoints(mouse.current.x, mouse.current.y);
          else {
            createCursorTextPoints(mouse.current.x, mouse.current.y);
          }
          detachNearbyParticles(mouse.current.x, mouse.current.y);
        }
        // if in text mode with rotate (hero), create cursor text at mouse position and detach
        if (mode === "text" && rotate) {
          createCursorTextPoints(mouse.current.x, mouse.current.y);
          detachNearbyParticles(mouse.current.x, mouse.current.y);
        }
      } else {
        mouse.current.active = false;
      }
    }

    function onPointerLeave(): void {
      mouse.current.active = false;
      // scatter particles back to homes when pointer leaves
      scatterTargets();
      // clear detach timers to return sphere particles to normal state
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.detachedUntil = 0;
      }
    }

    function gatherTargets(): void {
      if (textPoints.length === 0) createTextPoints();
      if (textPoints.length === 0) return;
      // assign targets to particles so they will be attracted when pointer active
      for (let i = 0; i < particles.length; i++) {
        const tp = textPoints[i % textPoints.length];
        particles[i].targetX = tp.x;
        particles[i].targetY = tp.y;
        // optionally emphasize a subset visually
        if (i % Math.max(4, Math.floor(particles.length / Math.min(textPoints.length, 200)))) {
          // leave other particles with normal size
        }
      }
      
    }

    function detachNearbyParticles(mx: number, my: number): void {
      if (!particles || particles.length === 0) return;
      const now = performance.now();
      const cx = width / 2;
      const cy = height / 2;
      const sphereRadius = Math.max(40, Math.min(width, height) * 0.28);
      const rot = rotationRef.current;
      const maxDetach = 360; // detach all particles to fill section
      let detached = 0;
      // For center mode (hero), use smaller radius around sphere center; otherwise full section
      const DETACH_RADIUS = center ? Math.max(width, height) * 0.35 : Math.max(width, height) * 0.8;
      for (let i = 0; i < particles.length && detached < maxDetach; i++) {
        const p = particles[i];
        if (!p) continue;
        // compute rotated position for projection
        const px = p.x ?? 0;
        const py = p.y ?? 0;
        const pz = p.z ?? 0;
        const rx = Math.cos(rot) * px + Math.sin(rot) * pz;
        const rz = -Math.sin(rot) * px + Math.cos(rot) * pz;
        const fov = sphereRadius * 2;
        const scaleProj = Math.max(0.06, fov / (fov + rz));
        const screenX = cx + sphereOffset.x + rx * scaleProj;
        const screenY = cy + sphereOffset.y + py * scaleProj;
        const dx = mx - screenX;
        const dy = my - screenY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < DETACH_RADIUS && (p.detachedUntil ?? 0) < now) {
          p.detachedUntil = now + 520 + Math.random() * 720;
          detached++;
          // assign a screen-space text target if available so the particle chases the cursor-anchored text
          if (cursorTextPoints.length > 0) {
            const tp = cursorTextPoints[detached % cursorTextPoints.length];
            p.targetScreenX = tp.x;
            p.targetScreenY = tp.y;
            p.isText = true;
            // boost size and alpha immediately on detach - make very bright and large
            p.size = 3.2 + Math.random() * 0.4;
            p.alpha = 0.96;
          }
        }
      }
    }

    function scatterTargets(): void {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        delete p.targetX;
        delete p.targetY;
        // clear detach timers
        p.detachedUntil = 0;
      delete p.targetScreenX;
        delete p.targetScreenY;
      }
      cursorTextPoints = [];
    
    }    function draw(): void {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      const last = lastTimeRef.current ?? now;
      const dt = Math.max(0, now - last);
      lastTimeRef.current = now;
      if (rotate) rotationRef.current += rotationSpeed * dt;
      // smooth sphere offset
      if (center) {
        sphereOffset.targetX = 0; sphereOffset.targetY = 0;
      }
      sphereOffset.x += (sphereOffset.targetX - sphereOffset.x) * Math.min(0.22, dt / 120);
      sphereOffset.y += (sphereOffset.targetY - sphereOffset.y) * Math.min(0.22, dt / 120);

      // spawn trails when sphere moves fast enough
      const dxs = sphereOffset.x - lastSphere.x;
      const dys = sphereOffset.y - lastSphere.y;
      const moveDist = Math.sqrt(dxs * dxs + dys * dys);
      if (trail && moveDist > 0.9) {
        const burst = Math.max(1, Math.min(24, Math.floor(trailBurst ?? 6)));
        for (let b = 0; b < burst; b++) {
          const tr: typeof trails[number] = {
            x: rand(-8, 8),
            y: rand(-8, 8),
            z: rand(-6, 6),
            vx: dxs * 0.12 + rand(-0.3, 0.3),
            vy: dys * 0.12 + rand(-0.3, 0.3),
            vz: rand(-0.15, 0.15),
            alpha: 0.9,
            size: rand(0.6, 1.8),
            life: rand(360, 820),
          };
          trails.push(tr);
        }
        lastSphere.x = sphereOffset.x;
        lastSphere.y = sphereOffset.y;
      }

      const cx = width / 2;
      const cy = height / 2;
        const sphereRadius = Math.max(40, Math.min(width, height) * 0.28);
        // lighting direction (simulate sun) - normalized vector
        const lightDir = { x: -0.4, y: -0.2, z: 0.9 };
        const lightLen = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z);
        lightDir.x /= lightLen; lightDir.y /= lightLen; lightDir.z /= lightLen;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // precompute projection helpers for interaction decisions
        const fovLocal = sphereRadius * 2;
        const scaleProjPre = Math.max(0.08, fovLocal / (fovLocal + (p.z ?? 0)));
        const projXPre = cx + sphereOffset.x + (p.x ?? 0) * scaleProjPre;
        const projYPre = cy + sphereOffset.y + (p.y ?? 0) * scaleProjPre;
        // text particles near cursor are handled by detachNearbyParticles below
        // (no need to process here - sphere mode uses detachNearbyParticles)
        // If this particle is currently detached and has a cursor text target, steer it smoothly
        // toward the screen-space text target. No jitter - crystal clear text formation.
        if ((p.detachedUntil ?? 0) > now && p.targetScreenX !== undefined && p.targetScreenY !== undefined) {
          const tx = p.targetScreenX as number;
          const ty = p.targetScreenY as number;
          const dxs = tx - projXPre;
          const dys = ty - projYPre;
          // smooth attraction without jitter
          const strength = 0.028;
          const invScale = 1 / Math.max(0.06, scaleProjPre);
          p.vx = (p.vx ?? 0) + dxs * strength * invScale;
          p.vy = (p.vy ?? 0) + dys * strength * invScale;
          // nudge forward out of sphere gently
          p.vz = (p.vz ?? 0) + (0 - (p.z ?? 0)) * 0.0015;
          // maintain high visibility
          p.size = 3.2;
          p.alpha = 0.96;
          // smooth damping
          p.vx *= 0.88; p.vy *= 0.88; p.vz *= 0.92;
        }

        // sphere rotation in text mode
        if (rotate && !mouse.current.active && p.targetTheta !== undefined && p.targetPhi !== undefined && p.targetRadius !== undefined) {
          const theta = p.targetTheta as number;
          const phi = p.targetPhi as number;
          const r = p.targetRadius as number;
          const tx = r * Math.sin(theta) * Math.cos(phi);
          const ty = r * Math.sin(theta) * Math.sin(phi);
          const tz = r * Math.cos(theta);
          const rot = rotationRef.current;
          const rx = Math.cos(rot) * tx + Math.sin(rot) * tz;
          const rz = -Math.sin(rot) * tx + Math.cos(rot) * tz;
          const attraction = 0.0026;
          p.vx = (p.vx ?? 0) + (rx - (p.x ?? 0)) * attraction + (Math.random() - 0.5) * 0.02;
          p.vy = (p.vy ?? 0) + (ty - (p.y ?? 0)) * attraction + (Math.random() - 0.5) * 0.02;
          p.vz = (p.vz ?? 0) + (rz - (p.z ?? 0)) * attraction + (Math.random() - 0.5) * 0.02;
          (p.vx as number) *= 0.94;
          (p.vy as number) *= 0.94;
          (p.vz as number) *= 0.94;
        }

        if (mode === "sphere" && p.targetTheta !== undefined && p.targetPhi !== undefined && p.targetRadius !== undefined) {
          // compute spherical target in 3D
          const theta = p.targetTheta as number;
          const phi = p.targetPhi as number;
          const r = p.targetRadius as number;

          // compute rotated 3D target
          const tx = r * Math.sin(theta) * Math.cos(phi);
          const ty = r * Math.sin(theta) * Math.sin(phi);
          const tz = r * Math.cos(theta);
          const rot = rotationRef.current;
          const rx = Math.cos(rot) * tx + Math.sin(rot) * tz;
          const rz = -Math.sin(rot) * tx + Math.cos(rot) * tz;

          // attraction towards 3D target
          const attraction = 0.0026;
          p.vx = (p.vx ?? 0) + (rx - (p.x ?? 0)) * attraction + (Math.random() - 0.5) * 0.02;
          p.vy = (p.vy ?? 0) + (ty - (p.y ?? 0)) * attraction + (Math.random() - 0.5) * 0.02;
          p.vz = (p.vz ?? 0) + (rz - (p.z ?? 0)) * attraction + (Math.random() - 0.5) * 0.02;
          (p.vx as number) *= 0.94;
          (p.vy as number) *= 0.94;
          (p.vz as number) *= 0.94;
        } else if (mouse.current.active && p.targetX !== undefined) {
          const attractionNow = now < boostUntil ? BASE_ATTRACTION * BOOST_MULTIPLIER : BASE_ATTRACTION;
          // if this particle is marked as text and currently detached, pull toward mouse instead
          if ((p.detachedUntil ?? 0) > now) {
            const detachAttraction = 0.018;
            if (mode === "sphere") {
              // compute world target that projects to cursor
              const fovLocal = sphereRadius * 2;
              const scaleProj = Math.max(0.08, fovLocal / (fovLocal + (p.z ?? 0)));
              const worldTX = ((mouse.current.x ?? 0) - cx - sphereOffset.x) / scaleProj;
              const worldTY = ((mouse.current.y ?? 0) - cy - sphereOffset.y) / scaleProj;
              p.vx += (worldTX - (p.x ?? 0)) * detachAttraction + (Math.random() - 0.5) * 0.02;
              p.vy += (worldTY - (p.y ?? 0)) * detachAttraction + (Math.random() - 0.5) * 0.02;
            } else {
              // non-sphere: chase cursor in screen-space
              const worldTX = (mouse.current.x ?? 0);
              const worldTY = (mouse.current.y ?? 0);
              p.vx += (worldTX - (p.x ?? 0)) * (detachAttraction * 0.8) + (Math.random() - 0.5) * 0.02;
              p.vy += (worldTY - (p.y ?? 0)) * (detachAttraction * 0.8) + (Math.random() - 0.5) * 0.02;
            }
            p.vx *= 0.92;
            p.vy *= 0.92;
          } else {
            // normal attraction toward text target, stronger for text particles
            const dx = (p.targetX as number) - (p.x as number);
            const dy = (p.targetY as number) - (p.y as number);
            const textMul = p.isText ? 0.018 + Math.random() * 0.006 : attractionNow;
            p.vx += dx * textMul;
            p.vy += dy * textMul;
            p.vx += (Math.random() - 0.5) * 0.02;
            p.vy += (Math.random() - 0.5) * 0.02;
            p.vx *= p.isText ? 0.94 : 0.96;
            p.vy *= p.isText ? 0.94 : 0.96;
          }
        } else {
          const dxh = p.homeX - p.x;
          const dyh = p.homeY - p.y;
          p.vx += dxh * 0.0006 + (Math.random() - 0.5) * 0.02;
          p.vy += dyh * 0.0006 + (Math.random() - 0.5) * 0.02;
          p.vx *= 0.995;
          p.vy *= 0.995;
        }

        // update positions (3D aware)
        p.x = (p.x ?? 0) + (p.vx as number);
        p.y = (p.y ?? 0) + (p.vy as number);
        p.z = (p.z ?? 0) + (p.vz as number);

        const m = 4;
        if (mode === "sphere") {
          const bound = sphereRadius * 1.6;
          if (p.x < -bound) { p.x = -bound; p.vx *= -0.4; }
          if (p.x > bound) { p.x = bound; p.vx *= -0.4; }
          if (p.y < -bound) { p.y = -bound; p.vy *= -0.4; }
          if (p.y > bound) { p.y = bound; p.vy *= -0.4; }
        } else {
          if (p.x < -m) { p.x = -m; p.vx *= -0.4; }
          if (p.x > width + m) { p.x = width + m; p.vx *= -0.4; }
          if (p.y < -m) { p.y = -m; p.vy *= -0.4; }
          if (p.y > height + m) { p.y = height + m; p.vy *= -0.4; }
        }

        // project 3D to 2D (sphere-mode) or use screen-space for non-sphere
        let sx: number;
        let sy: number;
        let drawSize: number;
        
        // if particle has screen-space targets (detached cursor text), use screen space
        if (p.targetScreenX !== undefined && p.targetScreenY !== undefined) {
          sx = p.targetScreenX ?? 0;
          sy = p.targetScreenY ?? 0;
          drawSize = Math.max(0.35, p.size);
        } else if (mode === "sphere" || (rotate && p.targetRadius !== undefined)) {
          // use 3D projection for sphere mode or rotating text mode
          const fov = sphereRadius * 2;
          const zPos = p.z ?? 0;
          const scale = Math.max(0.08, fov / (fov + zPos));
          sx = cx + sphereOffset.x + (p.x ?? 0) * scale;
          sy = cy + sphereOffset.y + (p.y ?? 0) * scale;
          drawSize = Math.max(0.35, p.size * scale);
        } else {
          // non-sphere: treat particle coords as screen-space (absolute)
          sx = (p.x ?? 0);
          sy = (p.y ?? 0);
          drawSize = Math.max(0.35, p.size);
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.arc(sx, sy, drawSize, 0, Math.PI * 2);
        ctx.fill();
      }

      if (mouse.current.active) {
        // draw short links between nearest projected neighbors for effect
        for (let i = 0; i < Math.min(particles.length, 600); i += 2) {
          const a = particles[i];
          const az = a.z ?? 0;
          const afov = sphereRadius * 2;
          let ax: number;
          let ay: number;
          if (a.targetScreenX !== undefined && a.targetScreenY !== undefined) {
            ax = a.targetScreenX;
            ay = a.targetScreenY;
          } else if (mode === "sphere" || (rotate && a.targetRadius !== undefined)) {
            const ascale = Math.max(0.06, afov / (afov + az));
            ax = cx + sphereOffset.x + (a.x ?? 0) * ascale;
            ay = cy + sphereOffset.y + (a.y ?? 0) * ascale;
          } else {
            ax = a.x ?? 0;
            ay = a.y ?? 0;
          }
          for (let j = i + 1; j < Math.min(particles.length, i + 8); j++) {
            const b = particles[j];
            const bz = b.z ?? 0;
            let bx: number;
            let by: number;
            if (b.targetScreenX !== undefined && b.targetScreenY !== undefined) {
              bx = b.targetScreenX;
              by = b.targetScreenY;
            } else if (mode === "sphere" || (rotate && b.targetRadius !== undefined)) {
              const bscale = Math.max(0.06, afov / (afov + bz));
              bx = cx + sphereOffset.x + (b.x ?? 0) * bscale;
              by = cy + sphereOffset.y + (b.y ?? 0) * bscale;
            } else {
              bx = b.x ?? 0;
              by = b.y ?? 0;
            }
            const dx = ax - bx;
            const dy = ay - by;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 56) {
              const alpha = (1 - d / 56) * 0.14 * Math.min(a.alpha, b.alpha);
              ctx.strokeStyle = `rgba(150,160,200, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.stroke();
            }
          }
        }
      }

      // skip drawing trails when showing cursor text - keep NANO clean
      if (!mouse.current.active || cursorTextPoints.length === 0) {
        for (let t = trails.length - 1; t >= 0; t--) {
          const tr = trails[t];
          tr.life -= dt;
          if (tr.life <= 0) {
            trails.splice(t, 1);
            continue;
          }
          tr.x += tr.vx;
          tr.y += tr.vy;
          tr.z += tr.vz;
          tr.alpha *= 0.96;
          let tsx: number;
          let tsy: number;
          if (mode === "sphere") {
            const fov = sphereRadius * 2;
            const scale = Math.max(0.06, fov / (fov + tr.z));
            tsx = cx + sphereOffset.x + tr.x * scale;
            tsy = cy + sphereOffset.y + tr.y * scale;
          } else {
            tsx = tr.x;
            tsy = tr.y;
          }
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255, ${Math.max(0.02, tr.alpha)})`;
          ctx.arc(tsx, tsy, Math.max(0.2, tr.size), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    // Listen on window so we receive pointer events even when overlay elements
    // or page elements above the canvas prevent the wrapper from receiving them.
    const windowPointerMove = (e: PointerEvent): void => {
      const prevActive = mouse.current.active;
      onPointerMove(e);
      // if became active now (enter), trigger a short boost and gather
      if (!prevActive && mouse.current.active) {
        boostUntil = performance.now() + BOOST_DURATION;
        gatherTargets();
      }
      // if was active and now left, scatter
      if (prevActive && !mouse.current.active) {
        scatterTargets();
      }
    };

    window.addEventListener("pointermove", windowPointerMove);
    window.addEventListener("pointerup", onPointerLeave);
    window.addEventListener("pointercancel", onPointerLeave);

    const ro = new ResizeObserver(() => resize());
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    resize();
    rafRef.current = requestAnimationFrame(draw);

    return (): void => {
      ro.disconnect();
      window.removeEventListener("pointermove", windowPointerMove);
      window.removeEventListener("pointerup", onPointerLeave);
      window.removeEventListener("pointercancel", onPointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [baseCount, cornerPadding, spreadFactor, text, mode, rotate, rotationSpeed, wave, waveRadius, waveStrength, waveSpeed, center, followCursor, trail, trailBurst]);

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
