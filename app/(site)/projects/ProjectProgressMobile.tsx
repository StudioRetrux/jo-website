"use client";

import { useState } from "react";
import Image from "next/image";
import { STEPS } from "./ProjectProgress";
import styles from "./projectProgressMobile.module.css";

/**
 * Progress on a phone: one column, and the steps are an accordion.
 *
 * Deliberately NOT the desktop version. That one pairs a sticky step list with a
 * scrolling column of blocks, and the whole interaction needs two columns to exist.
 */
export default function ProjectProgressMobile() {
  const [open, setOpen] = useState(0);

  return (
    <section className={styles.progress}>
      <h2 className={styles.title}>Progress</h2>
      <p className={styles.subtitle}>
        Carefully observe the regular routines of their dental clients
      </p>
      <span className={styles.rule} aria-hidden="true" />
      <ol className={styles.list}>
        {STEPS.map((step, i) => (
          <li className={styles.step} key={step.title}>
            <button
              type="button"
              className={`${styles.stepButton} ${i === open ? styles.stepButtonOpen : ""}`}
              aria-expanded={i === open}
              onClick={() => setOpen(i === open ? -1 : i)}
            >
              {/* same left-to-right wipe as the work page list rows */}
              <span className={styles.stepBg} aria-hidden="true" />
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.stepTitle}>{step.title}</span>
            </button>
            {/* always mounted: 0fr→1fr is what animates the height, and there's nothing
                to transition from if the panel only exists while open */}
            <div className={`${styles.panelWrap} ${i === open ? styles.panelWrapOpen : ""}`}>
              <div className={styles.panel}>
                <div className={styles.image}>
                  <Image src={step.image} alt={step.title} fill sizes="100vw" />
                </div>
                <p className={styles.caption}>{step.caption}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
