"use client";

import { useEffect, useRef } from "react";

const TRAIL_IMAGES = [
  "/Resort Room 1.jpg",
  "/Resort Room 2.jpg",
];

const IMG_W = 260;
const IMG_H = 185;
const SPAWN_DIST = 160;
const SCALE_IN_MS = 400;
const LIFETIME_MS = 3200;

interface Particle {
  el: HTMLDivElement;
  startTime: number;
  rotation: number;
}

type Props = { active: boolean };

export default function CtaImageTrail({ active }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const srcIdx = useRef(0);
  const rafHandle = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !active) return;

    const spawn = (x: number, y: number) => {
      const rotation = (Math.random() - 0.5) * 40;
      const src = TRAIL_IMAGES[srcIdx.current % TRAIL_IMAGES.length];
      srcIdx.current++;

      const el = document.createElement("div");
      el.style.cssText = `
        position:absolute;
        width:${IMG_W}px;
        height:${IMG_H}px;
        left:${x - IMG_W / 2}px;
        top:${y - IMG_H / 2}px;
        background:url('${src}') center/cover no-repeat;
        pointer-events:none;
        transform-origin:center;
        transform:scale(0) rotate(${rotation}deg);
        opacity:1;
      `;
      wrap.appendChild(el);
      particles.current.push({ el, startTime: performance.now(), rotation });
    };

    const tick = (now: number) => {
      particles.current = particles.current.filter(({ el, startTime, rotation }) => {
        const age = now - startTime;
        if (age >= LIFETIME_MS) { el.remove(); return false; }
        let scale: number;
        if (age < SCALE_IN_MS) {
          scale = age / SCALE_IN_MS;
        } else {
          const t = (age - SCALE_IN_MS) / (LIFETIME_MS - SCALE_IN_MS);
          scale = 1 - t;
        }
        el.style.transform = `scale(${Math.max(0, scale)}) rotate(${rotation}deg)`;
        el.style.opacity = "1";
        return true;
      });
      rafHandle.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const last = lastPos.current;
      if (last && Math.hypot(x - last.x, y - last.y) < SPAWN_DIST) return;
      lastPos.current = { x, y };
      spawn(x, y);
    };

    wrap.addEventListener("mousemove", onMove);
    rafHandle.current = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafHandle.current);
      particles.current.forEach(({ el }) => el.remove());
      particles.current = [];
      lastPos.current = null;
    };
  }, [active]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: active ? "auto" : "none",
        zIndex: 0,
      }}
    />
  );
}
