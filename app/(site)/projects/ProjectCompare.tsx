"use client";

import type { PointerEvent as ReactPointerEvent, CSSProperties } from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: stand-in pair until the CMS carries before/after imagery.
const BEFORE = "/Resort Room 1.jpg";
const AFTER = "/Resort Room 2.jpg";

const STEP = 5;

export default function ProjectCompare() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  // Pointer Events cover mouse, touch and pen in one path; setPointerCapture keeps the
  // drag alive outside the frame and releases itself, so there's nothing to clean up.
  function track(event: ReactPointerEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!frame) return;
    const { left, width } = frame.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((event.clientX - left) / width) * 100)));
  }

  return (
    <section className={styles.compare}>
      <div
        ref={frameRef}
        className={styles.compareFrame}
        style={{ "--pos": `${pos}%` } as CSSProperties}
        role="slider"
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          track(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 0) return;
          track(event);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") setPos((v) => Math.max(0, v - STEP));
          if (event.key === "ArrowRight") setPos((v) => Math.min(100, v + STEP));
        }}
      >
        <Image src={AFTER} alt="After" fill sizes="100vw" draggable={false} className={styles.compareImage} />
        {/* clip the wrapper, not the image — the image stays pinned and gets revealed
            rather than squashing as the handle moves */}
        <div className={styles.compareClip}>
          <Image src={BEFORE} alt="Before" fill sizes="100vw" draggable={false} className={styles.compareImage} />
        </div>
        <span className={`${styles.compareLabel} ${styles.compareLabelBefore}`}>Before</span>
        <span className={`${styles.compareLabel} ${styles.compareLabelAfter}`}>After</span>
        <div className={styles.compareLine} aria-hidden="true" />
        <div className={styles.compareHandle} aria-hidden="true">
          <span className={styles.compareGrab} />
        </div>
      </div>
    </section>
  );
}
