"use client";

import { useEffect, useState } from "react";
import styles from "./fullnameMobile.module.css";

const LINES = ["Yohanes", "Alexander"];
const REVEAL_MS = 1200;
const LETTER_DELAY = 20;

/**
 * The footer wordmark on mobile: a flat 56px over two lines.
 *
 * Deliberately NOT the desktop wordmark. That one measures the text and writes an
 * inline font-size to fit a single line to the viewport, which on a phone lands around
 * 30px and can't be overridden from CSS. Same per-letter reveal, no measuring.
 */
export default function FullnameMobile({ open }: { open: boolean }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!open) { setRevealed(false); return; }
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setRevealed(true)));
    return () => cancelAnimationFrame(id);
  }, [open]);

  let index = 0;

  return (
    <div className={styles.wordmark} aria-label={LINES.join(" ")}>
      {LINES.map((line) => (
        <span className={styles.line} key={line}>
          {line.split("").map((letter, i) => {
            const delay = index * LETTER_DELAY;
            index += 1;
            return (
              <span
                aria-hidden="true"
                className={styles.letter}
                key={`${letter}-${i}`}
                style={{
                  transform: revealed ? "translateY(0)" : "translateY(115%)",
                  transition: revealed
                    ? `transform ${REVEAL_MS}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`
                    : "none",
                }}
              >
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
