"use client";

import { useState } from "react";
import CtaImageTrail from "../about/CtaImageTrail";
import { useCursor } from "../contexts/CursorContext";
// same section as About's closing CTA — reuse its styles rather than copying them
import styles from "../about/about.module.css";

export default function ProjectCta() {
  const { setMode } = useCursor();
  const [trailActive, setTrailActive] = useState(false);

  return (
    <section
      className={styles.ctaSection}
      onMouseEnter={() => { setTrailActive(true); setMode("hidden"); }}
      onMouseLeave={() => { setTrailActive(false); setMode("default"); }}
    >
      <CtaImageTrail active={trailActive} />
      <div className={styles.ctaSectionInner}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Icon 1_1.png" alt="" className={styles.ctaSectionIcon} />
        <p className={styles.ctaSectionText}>
          Let&apos;s create spaces that<br />feel just as thoughtful.
        </p>
        <a href="mailto:retruxstudio@gmail.com" className={styles.ctaSectionCta}>Consult</a>
      </div>
    </section>
  );
}
