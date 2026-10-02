"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { scrollParent } from "./scrollParent";
import { PARALLAX_TRAVEL, parallaxOffset } from "./parallax";
import styles from "./parallaxImage.module.css";

/**
 * Move the image from -20% to +20% of its frame height as the frame crosses the
 * scroll viewport. Its parent must be positioned and clip with overflow: hidden.
 * The stationary frame determines progress, so reversing or jumping scroll is deterministic.
 */

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
    const imageFrame = node?.parentElement;
    if (!node || !imageFrame) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // the overlay and section pages scroll themselves, the /projects/[slug] route scrolls the document
    const root = scrollParent(node);
    const target: HTMLElement | Window = root ?? window;
    let frame = 0;
    let onScreen = true;

    const tick = () => {
      frame = 0;
      if (reducedMotion.matches) {
        node.style.transform = "none";
        return;
      }
      const rect = imageFrame.getBoundingClientRect();
      const viewportTop = root ? root.getBoundingClientRect().top + root.clientTop : 0;
      const viewportHeight = root ? root.clientHeight : window.innerHeight;
      const y = parallaxOffset(rect.top, rect.height, viewportTop, viewportHeight);
      node.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const wake = () => {
      if (frame || !onScreen || reducedMotion.matches) return;
      frame = requestAnimationFrame(tick);
    };

    // Observe the stationary frame, not the image that moves inside it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) wake();
      },
      { root },
    );
    observer.observe(imageFrame);

    const resizeObserver = new ResizeObserver(wake);
    resizeObserver.observe(imageFrame);
    if (root) resizeObserver.observe(root);

    const syncMotion = () => {
      if (reducedMotion.matches) node.style.transform = "none";
      else wake();
    };

    target.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    reducedMotion.addEventListener("change", syncMotion);
    wake();
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      target.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      reducedMotion.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={styles.layer}
      style={{ "--parallax-travel": `${PARALLAX_TRAVEL * 100}%` } as CSSProperties}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
    </div>
  );
}
