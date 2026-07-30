"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { scrollParent } from "./scrollParent";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: fixed content + stand-in imagery until the CMS carries steps.
// exported so the mobile accordion (ProjectProgressMobile) reads the same list
export const STEPS = [
  {
    title: "Rethinking the Experience",
    image: "/homeresortbatu1.jpg",
    caption:
      "Every element is designed with purpose. Clean geometries and controlled proportions bring clarity, while material choices introduce a subtle warmth—balancing clinical precision with a more human experience.",
  },
  {
    title: "Designing with Intention",
    image: "/homeresortbatu2.png",
    caption:
      "The spatial layout is carefully structured to support both patients and staff. Zoning, circulation, and visibility are optimized to ensure efficiency without compromising comfort.",
  },
  {
    title: "Clarity in Function",
    image: "/Resort Room 1.jpg",
    caption:
      "Every element is designed with purpose. Clean geometries and controlled proportions bring clarity, while material choices introduce a subtle warmth—balancing clinical precision with a more human experience.",
  },
];

/** Share of a block that must be on screen before it takes over the step list. */
const VISIBLE = 0.2;

export default function ProjectProgress() {
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // A block claims the step list once VISIBLE of it is on screen. Two blocks clear
  // that bar at once, so direction decides: scrolling down the lower one just arrived
  // and wins, scrolling up the upper one did.
  useEffect(() => {
    // the overlay scrolls itself, the route page scrolls the document
    const root = scrollParent(blockRefs.current[0]);
    const readTop = () => (root ? root.scrollTop : window.scrollY);
    const ratios: number[] = [];
    let lastTop = readTop();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = blockRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) ratios[index] = entry.intersectionRatio;
        }

        const top = readTop();
        const down = top >= lastTop;
        lastTop = top;

        const visible = ratios.flatMap((ratio, i) => (ratio >= VISIBLE ? [i] : []));
        if (visible.length) setActive(down ? visible[visible.length - 1] : visible[0]);
      },
      // fire around the VISIBLE crossing, not just on first pixel
      { root, threshold: [0, VISIBLE, 1] },
    );
    blockRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.progress}>
      <aside className={styles.progressAside}>
        <h2 className={styles.progressTitle}>Progress</h2>
        <p className={styles.progressSubtitle}>
          Carefully observe the regular routines of their dental clients
        </p>
        <span className={styles.progressRule} aria-hidden="true" />
        <ol className={styles.progressList}>
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <button
                type="button"
                className={`${styles.progressStep} ${i === active ? styles.progressStepActive : ""}`}
                onClick={() =>
                  blockRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
              >
                <span className={styles.progressNum}>{String(i + 1).padStart(2, "0")}</span>
                {step.title}
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <div className={styles.progressMain}>
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            ref={(node) => { blockRefs.current[i] = node; }}
            className={styles.progressBlock}
          >
            <div className={styles.progressImage}>
              <Image src={step.image} alt={step.title} fill sizes="(max-width: 700px) 100vw, 60vw" />
            </div>
            <p className={styles.progressCaption}>{step.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
