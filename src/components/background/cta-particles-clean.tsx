"use client";

import React, { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  homeX: number;
  homeY: number;
  targetX?: number;
  targetY?: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function prefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export default function CTAParticlesClean(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouse = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current) return;
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    // expanded corner padding to give particles more room in corners
    const cornerPadding = 80;
    // increase particle count (5x more from previous 360 -> 1800)
    const baseCount = 1800;
    let particles: Particle[] = [];
    let textPoints: Array<{ x: number; y: number }> = [];

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

      const tw = Math.max(200, Math.min(1000, Math.floor(width * 0.7)));
      const th = Math.max(80, Math.floor(tw * 0.28));
      tc.width = tw;
      tc.height = th;

      const fontSize = Math.floor(th * 0.85);
      tctx.clearRect(0, 0, tw, th);
      tctx.fillStyle = "white";
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";
      tctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
      tctx.fillText("NANO", tw / 2, th / 2);

      const imageData = tctx.getImageData(0, 0, tw, th).data;
      const gap = 8;
      const scale = Math.min(width / tw, height / th) * 0.9;
      const offsetX = (width - tw * scale) / 2;
      const offsetY = (height - th * scale) / 2;

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

    function initParticles(): void {
      particles = [];
      const colors = sampleColors();
      const corners = [
        { x: cornerPadding, y: cornerPadding },
        { x: width - cornerPadding, y: cornerPadding },
        { x: cornerPadding, y: height - cornerPadding },
        { x: width - cornerPadding, y: height - cornerPadding },
      ];

      for (let i = 0; i < baseCount; i++) {
        const corner = corners[i % corners.length];
        // larger spread so particles occupy more space around corners
        const spread = 120 + Math.min(width, height) * 0.06;
        const px = corner.x + rand(-spread, spread);
        const py = corner.y + rand(-spread, spread);
        const speed = rand(0.02, 0.6);
        const angle = rand(0, Math.PI * 2);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = rand(0.9, 2.8);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const alpha = rand(0.45, 0.95);
        const p: Particle = { x: px, y: py, vx, vy, size, color, alpha, homeX: px, homeY: py };
        if (textPoints.length > 0) {
          const target = textPoints[i % textPoints.length];
          p.targetX = target.x;
          p.targetY = target.y;
        }
        particles.push(p);
      }
    }

    function resize(): void {
      if (!wrapperRef.current) {
        width = 0;
        height = 0;
        return;
      }
      const rect = wrapperRef.current?.getBoundingClientRect();
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
      createTextPoints();
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
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) {
        mouse.current.active = false;
        return;
      }
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inside) {
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
        mouse.current.active = true;
      } else {
        mouse.current.active = false;
      }
    }

    function onPointerLeave(): void {
      mouse.current.active = false;
    }

    function draw(): void {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.current.active && p.targetX !== undefined) {
          const now = performance.now();
          const attraction = now < boostUntil ? BASE_ATTRACTION * BOOST_MULTIPLIER : BASE_ATTRACTION;
          const dx = p.targetX - p.x;
          const dy = p.targetY! - p.y;
          p.vx += dx * attraction;
          p.vy += dy * attraction;
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
          p.vx *= 0.96;
          p.vy *= 0.96;
        } else {
          const dxh = p.homeX - p.x;
          const dyh = p.homeY - p.y;
          p.vx += dxh * 0.0006 + (Math.random() - 0.5) * 0.02;
          p.vy += dyh * 0.0006 + (Math.random() - 0.5) * 0.02;
          p.vx *= 0.995;
          p.vy *= 0.995;
        }

        p.x += p.vx;
        p.y += p.vy;

        const m = 4;
        if (p.x < -m) { p.x = -m; p.vx *= -0.4; }
        if (p.x > width + m) { p.x = width + m; p.vx *= -0.4; }
        if (p.y < -m) { p.y = -m; p.vy *= -0.4; }
        if (p.y > height + m) { p.y = height + m; p.vy *= -0.4; }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (mouse.current.active) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < Math.min(particles.length, i + 6); j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 56) {
              const alpha = (1 - d / 56) * 0.14 * Math.min(a.alpha, b.alpha);
              ctx.strokeStyle = `rgba(150,160,200, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    // Listen on window so we receive pointer events even when overlay elements
    // or page elements above the canvas prevent the wrapper from receiving them.
    const windowPointerMove = (e: PointerEvent): void => {
      const prevActive = mouse.current.active;
      onPointerMove(e);
      // if became active now (enter), trigger a short boost
      if (!prevActive && mouse.current.active) {
        boostUntil = performance.now() + BOOST_DURATION;
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
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
