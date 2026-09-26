"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { scrollParent } from "./scrollParent";
import styles from "./[slug]/projectDetail.module.css";

/**
 * Full-bleed image with weight: as the page scrolls, the image slips against its frame
 * in the opposite direction, from the very first pixel. There is no restoring force —
 * when the scroll stops the image stays wherever it ended up, off-centre included.
 * Scrolling back pulls it the other way.
 *
 * The slip eases off as the image nears OVERSCAN, and the layer is taller than the frame
 * by OVERSCAN on each edge, so it never uncovers it. The frame itself must clip
 * (`overflow: hidden`) and be positioned.
 */
const OVERSCAN = 40;
// image slip per pixel scrolled — higher = heavier, reaches its limit sooner
const SLIP = 0.8;

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export default function InertiaImage({ src, alt, sizes, className, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // the overlay and section pages scroll themselves, the /projects/[slug] route scrolls the document
    const root = scrollParent(node);
    const target: HTMLElement | Window = root ?? window;
    const scrollPos = () => (root ? root.scrollTop : window.scrollY);
    let y = 0;
    let prevScroll = scrollPos();
    let frame = 0;
    let onScreen = false;

    const tick = () => {
      frame = 0;
      const scroll = scrollPos();
      const delta = scroll - prevScroll;
      prevScroll = scroll;
      // full slip heading back toward centre, fading to nothing at the edge
      const room = Math.sign(delta) === Math.sign(y) ? 1 - Math.abs(y) / OVERSCAN : 1;
      y = Math.max(-OVERSCAN, Math.min(OVERSCAN, y + delta * SLIP * Math.max(0, room)));
      node.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const wake = () => {
      if (frame || !onScreen) return;
      frame = requestAnimationFrame(tick);
    };

    // Only move while the frame is on screen. Scroll that happened while it was off
    // screen (or a jump, like the overlay resetting to the top) doesn't count.
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) { prevScroll = scrollPos(); wake(); }
      },
      { root },
    );
    observer.observe(node);

    target.addEventListener("scroll", wake, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      target.removeEventListener("scroll", wake);
    };
  }, []);

  return (
    <div ref={ref} className={styles.inertiaLayer}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
    </div>
  );
}
