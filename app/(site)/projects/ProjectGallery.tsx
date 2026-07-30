"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./[slug]/projectDetail.module.css";

// Scatter positions, figma 1440 frame ÷ 1440 so the whole composition scales with the
// viewport instead of breaking at every width. 528px square = 36.667dvw.
const GALLERY = [
  { top: "0", left: "58.819dvw" },
  { top: "18.333dvw", left: "4.444dvw" },
  // 120px clear of image 2's bottom (18.333 + 36.667 = 55dvw)
  { top: "63.333dvw", left: "35.278dvw" },
];

// same wipe the work grid uses — WorkCard.tsx
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const REVEAL_MS = 800;

export default function ProjectGallery({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={styles.aboutGallery}>
      {GALLERY.map((pos, i) => (
        <GalleryItem key={i} src={src} alt={alt} pos={pos} />
      ))}
    </div>
  );
}

function GalleryItem({ src, alt, pos }: { src: string; alt: string; pos: { top: string; left: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // root: viewport — works for the route page and the overlay alike, since the
    // overlay is a fixed, full-viewport scroller
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={styles.aboutGalleryItem}
      style={{ "--top": pos.top, "--left": pos.left } as CSSProperties}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 480px) 65vw, (max-width: 700px) 100vw, 37vw"
        className={styles.aboutGalleryImage}
        style={{
          clipPath: revealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          scale: revealed ? "1" : "1.08",
          transition: `clip-path ${REVEAL_MS}ms ${EASE}, scale ${REVEAL_MS}ms ${EASE}`,
        }}
      />
    </div>
  );
}
