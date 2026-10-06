"use client";

import ProjectText from "./ProjectText";
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
      onMouseEnter={() => setTrailActive(true)}
      onMouseLeave={() => { setTrailActive(false); setMode("default"); }}
    >
      <CtaImageTrail active={trailActive} />
      <div className={styles.ctaSectionInner}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Icon 1_1.webp" alt="" className={styles.ctaSectionIcon} />
        <ProjectText as="p" className={styles.ctaSectionText}>
          Let&apos;s create spaces that{" "}<br />feel just as thoughtful.
        </ProjectText>
        <a href="https://wa.me/6287823139800" className={styles.ctaSectionCta} target="_blank" rel="noreferrer noopener"><ProjectText as="span">Consult</ProjectText></a>
      </div>
    </section>
  );
}
