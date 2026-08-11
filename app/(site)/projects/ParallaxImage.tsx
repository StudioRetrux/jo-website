"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { scrollParent } from "./scrollParent";
import styles from "./[slug]/projectDetail.module.css";

/**
 * Full-bleed image that drifts inside its frame as the frame crosses the viewport.
 *
 * The layer is taller than the frame by OVERSCAN on each edge, so a ±OVERSCAN drift
 * never uncovers it — no scaling, no softened pixels. The frame itself must clip
 * (`overflow: hidden`) and be positioned, which every full-width section here already is.
 */
const OVERSCAN = 60;

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export default function ParallaxImage({ src, alt, sizes, className, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // the overlay scrolls itself, the /projects/[slug] route scrolls the document
    const root = scrollParent(node);
    const target: HTMLElement | Window = root ?? window;
    let frame = 0;
    let onScreen = false;

    const apply = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewTop = root ? root.getBoundingClientRect().top : 0;
      const viewHeight = root ? root.clientHeight : window.innerHeight;
      // -1 while the frame is still a full view below, +1 once it has passed above
      const centre = rect.top - viewTop + rect.height / 2;
      const progress = (viewHeight / 2 - centre) / ((viewHeight + rect.height) / 2);
      const y = Math.max(-1, Math.min(1, progress)) * OVERSCAN;
      node.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const schedule = () => {
      if (frame || !onScreen) return;
      frame = requestAnimationFrame(apply);
    };

    // Only listen while the frame is on screen — a project page stacks several of these
    // and off-screen ones have nothing to say.
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) schedule();
      },
      { root },
    );
    observer.observe(node);

    apply();
    target.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      target.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={ref} className={styles.parallaxLayer}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
    </div>
  );
}
