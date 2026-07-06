"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./preload.module.css";
import WorkSection from "../work/WorkSection";
import AboutSection from "../about/AboutSection";

const columns = [-1.5, -0.5, 0.5, 1.5];
const rows = [-0.5, 0.5];

type Phase = "start" | "phase1" | "end" | "phase3" | "phase4" | "reveal";
type Bezier = [number, number, number, number];

const phase1Ms = 1900;
const phase2Ms = 1300;
const phase1Width = 100;
const phase1Height = 100;
const finalSize = 45;
const phase1Ease: Bezier = [0.12, 0, 0.39, 0];
const phase2Ease: Bezier = [0.19, 1, 0.22, 1];
const veilMs = 800;
const textMs = 800;
const slideImages = ["/preload2.png", "/preload3.png", "/preload4ld.png"];

type PreloadOtherTarget = "work" | "about";

function easingValue([x1, y1, x2, y2]: Bezier) {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

export default function PreloadOther({ target = "work" }: { target?: PreloadOtherTarget }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [revealIndex, setRevealIndex] = useState(-1);
  const [gridLinesHidden, setGridLinesHidden] = useState(false);
  const [sliderRemoved, setSliderRemoved] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);

  useEffect(() => {
    let phase1Timer: ReturnType<typeof setTimeout>;
    let phase2Timer: ReturnType<typeof setTimeout>;
    let phase3Timer: ReturnType<typeof setTimeout>;
    let revealTimer: ReturnType<typeof setTimeout>;
    let gridLinesTimer: ReturnType<typeof setTimeout>;
    let frame1 = 0;
    let frame2 = 0;

    const slideDuration = 600;
    const slideGap = 300;
    const phase4Start = phase1Ms + phase2Ms + 500;

    setPhase("start");
    setRevealIndex(-1);
    setGridLinesHidden(false);
    setSliderRemoved(false);
    setContentOpen(false);

    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        setPhase("phase1");
        phase1Timer = setTimeout(() => setPhase("end"), phase1Ms);
        phase2Timer = setTimeout(() => setPhase("phase3"), phase1Ms + phase2Ms);
        phase3Timer = setTimeout(() => {
          setPhase("phase4");
          setRevealIndex(0);
          setTimeout(() => setRevealIndex(1), slideDuration + slideGap);
          setTimeout(() => setRevealIndex(2), (slideDuration + slideGap) * 2);
        }, phase4Start);

        const revealStart = phase4Start + (slideDuration + slideGap) * 2 + slideDuration + 1000;
        revealTimer = setTimeout(() => {
          setPhase("reveal");
          setContentOpen(true);
        }, revealStart);
        gridLinesTimer = setTimeout(() => setGridLinesHidden(true), revealStart + 800);
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(revealTimer);
      clearTimeout(gridLinesTimer);
    };
  }, []);

  const gridStyle = useMemo(() => {
    const isPhase1 = phase === "phase1";
    const isEnd = phase === "end" || phase === "phase3" || phase === "phase4" || phase === "reveal";
    const isPhase3 = phase === "phase3" || phase === "phase4" || phase === "reveal";
    const transitionMs = phase === "start" ? 0 : isPhase1 ? phase1Ms : phase2Ms;
    const easing = easingValue(isPhase1 ? phase1Ease : phase2Ease);

    return {
      "--grid-cell-x": isEnd
        ? `${finalSize}dvh`
        : isPhase1
          ? `${phase1Width}dvw`
          : "105dvw",
      "--grid-cell-y": isEnd
        ? `${finalSize}dvh`
        : isPhase1
          ? `${phase1Height}dvh`
          : "105dvh",
      "--image-w": isEnd
        ? `${finalSize}dvh`
        : isPhase1
          ? `${phase1Width}dvw`
          : "105dvw",
      "--image-h": isEnd
        ? `${finalSize}dvh`
        : isPhase1
          ? `${phase1Height}dvh`
          : "105dvh",
      "--grid-shift-x": "0px",
      "--grid-frame-inset": "1px",
      "--grid-transition-duration": `${transitionMs}ms`,
      "--grid-transition-easing": easing,
      "--veil-duration": `${veilMs}ms`,
      "--hero-intro-delay": "500ms",
      "--hero-line-delay": "0ms",
      "--hero-reveal-duration": `${textMs}ms`,
      "--grid-lines-opacity": gridLinesHidden ? "0" : "1",
      "--phase3-opacity": isPhase3 ? "0" : "1",
      "--phase3-image-opacity": isPhase3 ? "1" : "0.4",
      "--phase3-blend-mode": isPhase3 ? "normal" : "luminosity",
      "--phase3-duration": "400ms",
      "--preload-bg": "#f7f6f5",
      "--preload-z": "20",
      "--preload-y": phase === "reveal" ? "-100%" : "0%",
      "--preload-slide-duration": phase === "reveal" ? "700ms" : "0ms",
    } as CSSProperties;
  }, [phase, gridLinesHidden]);

  return (
    <>
      {target === "about" ? (
        <AboutSection open={contentOpen} homeNavigation="route" />
      ) : (
        <WorkSection open={contentOpen} homeNavigation="route" />
      )}

      <div
        className={styles.gridBackground}
        style={gridStyle}
        onTransitionEnd={(event) => {
          if (event.propertyName !== "transform" || phase !== "reveal") return;
          setSliderRemoved(true);
        }}
      >
        {!sliderRemoved && (
          <div className={styles.imageLayer}>
            <div className={styles.gridImageTint} />
            <Image
              className={styles.gridImage}
              src="/preload1.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            {slideImages.map((src, i) => (
              <Image
                key={src}
                className={styles.gridImage2}
                src={src}
                alt=""
                fill
                sizes="100vw"
                style={{
                  clipPath: `inset(0 ${revealIndex >= i ? "0%" : "100%"} 0 0)`,
                  scale: revealIndex >= i ? "1" : "1.08",
                } as CSSProperties}
              />
            ))}
          </div>
        )}
        {[-1.5, 0.5].map((col) => (
          <div
            key={`cell-${col}`}
            className={styles.gridCell}
            style={{ "--cell-col": col } as CSSProperties}
          />
        ))}
        <div className={styles.introVeil} />
        <h1 className={styles.heroText}>
          <span className={styles.heroLine}>
            <span>Elevating spaces as a</span>
          </span>
          <span className={styles.heroLine}>
            <span>harmonious complement</span>
          </span>
          <span className={styles.heroLine}>
            <span>to how people live</span>
          </span>
        </h1>
        {columns.map((column) => (
          <span
            className={styles.gridVertical}
            key={`column-${column}`}
            style={{ "--grid-column": column } as CSSProperties}
          />
        ))}
        {rows.map((row) => (
          <span
            className={styles.gridHorizontal}
            key={`row-${row}`}
            style={{ "--grid-row": row } as CSSProperties}
          />
        ))}
        {rows.flatMap((row) =>
          columns.map((column) => (
            <span
              className={styles.gridNode}
              key={`node-${row}-${column}`}
              style={
                {
                  "--grid-column": column,
                  "--grid-row": row,
                } as CSSProperties
              }
            />
          )),
        )}
      </div>
    </>
  );
}
