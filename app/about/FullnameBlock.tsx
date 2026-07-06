"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./about.module.css";

const FULL_NAME = "Yohanes Alexander";
const WORDMARK_REVEAL_DURATION = 1200;
const WORDMARK_LETTER_DELAY = 20;

type PaddingValue = string | number;
type AnimationMode = "letters" | "reveal";

type Props = {
  open: boolean;
  animation?: AnimationMode;
  paddingTop?: PaddingValue;
  paddingRight?: PaddingValue;
  paddingBottom?: PaddingValue;
  paddingLeft?: PaddingValue;
};

function px(v: PaddingValue) { return typeof v === "number" ? `${v}px` : v; }

export default function FullnameBlock({
  open,
  animation = "letters",
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
}: Props) {
  const [fullnameEnteredView, setFullnameEnteredView] = useState(false);
  const fullnameRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const container = fullnameRef.current;
    if (!wordmark || !container) return;

    const fit = () => {
      const available = wordmark.clientWidth;
      wordmark.style.fontSize = "100px";
      wordmark.style.width = "max-content";
      const textWidth = wordmark.offsetWidth;
      wordmark.style.width = "";
      wordmark.style.fontSize = `${(available / textWidth) * 100 * 0.98}px`;
    };

    const observer = new ResizeObserver(fit);
    observer.observe(container);
    document.fonts.ready.then(fit);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) { setFullnameEnteredView(false); return; }
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setFullnameEnteredView(true))
    );
    return () => cancelAnimationFrame(id);
  }, [open]);

  const paddingStyle = {
    ...(paddingTop !== undefined && { paddingTop: px(paddingTop) }),
    ...(paddingRight !== undefined && { paddingRight: px(paddingRight) }),
    ...(paddingBottom !== undefined && { paddingBottom: px(paddingBottom) }),
    ...(paddingLeft !== undefined && { paddingLeft: px(paddingLeft) }),
  };

  return (
    <div
      ref={fullnameRef}
      className={styles.fullname}
      style={Object.keys(paddingStyle).length ? paddingStyle : undefined}
    >
      <div ref={wordmarkRef} className={styles.wordmark} aria-label={FULL_NAME}>
        {animation === "reveal" ? (
          <span
            aria-hidden="true"
            className={styles.wordmarkRevealTrack}
            style={{
              transform: fullnameEnteredView ? "translateY(0)" : "translateY(115%)",
              transition: fullnameEnteredView
                ? `transform ${WORDMARK_REVEAL_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            }}
          >
            {FULL_NAME}
          </span>
        ) : (
          FULL_NAME.split("").map((letter, index) => (
            <span
              aria-hidden="true"
              className={styles.wordmarkLetter}
              key={`${letter}-${index}`}
              style={{
                transform: fullnameEnteredView ? "translateY(0)" : "translateY(115%)",
                transition: fullnameEnteredView
                  ? `transform ${WORDMARK_REVEAL_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) ${index * WORDMARK_LETTER_DELAY}ms`
                  : "none",
              }}
            >
              {letter === " " ? " " : letter}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
