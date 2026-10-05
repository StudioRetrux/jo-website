"use client";

import SplitReveal from "./SplitReveal";
import styles from "./fullnameMobile.module.css";

/**
 * The footer wordmark on mobile: a flat 56px over two lines.
 *
 * Deliberately NOT the desktop wordmark. That one measures the text and writes an
 * inline font-size to fit a single line to the viewport, which on a phone lands around
 * 30px and can't be overridden from CSS. Same per-letter reveal, no measuring.
 */
export default function FullnameMobile({ open }: { open: boolean }) {
  return (
    <SplitReveal className={styles.wordmark} play={open} type="chars" dynamic>
      Yohanes<br />Alexander
    </SplitReveal>
  );
}
