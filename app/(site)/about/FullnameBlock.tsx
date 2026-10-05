"use client";

import React, { useEffect, useRef } from "react";
import SplitReveal from "../SplitReveal";
import styles from "./about.module.css";

const FULL_NAME = "Yohanes Alexander";

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
  const fullnameRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const container = fullnameRef.current;
    if (!wordmark || !container) return;
    // Mobile takes a flat 56px from CSS and wraps to two lines. Fitting one line to
    // the width of a phone would land somewhere near 30px — far too small, and it's
    // the inline font-size this writes that would block the override.
    if (window.matchMedia("(max-width: 480px)").matches) return;

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
      /* hero ("reveal") and footer ("letters") wordmarks share this component but need
         different type scales on mobile — CSS keys off this */
      data-animation={animation}
      style={Object.keys(paddingStyle).length ? paddingStyle : undefined}
    >
      <div ref={wordmarkRef} className={styles.wordmark}>
        {/* inner span so the fit above keeps the wordmark div to itself */}
        <SplitReveal
          as="span"
          style={{ display: "block" }}
          play={open}
          type={animation === "reveal" ? "lines" : "chars"}
          dynamic
        >
          {FULL_NAME}
        </SplitReveal>
      </div>
    </div>
  );
}
