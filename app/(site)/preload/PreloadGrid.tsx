"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./preload.module.css";
import HomeSection from "../home/HomeSection";
import type { CuratedSpaceItem } from "@/lib/projects/curated-shared";
import type { ResolvedHomeSlide } from "@/lib/projects/home-shared";
import type { WorkItem } from "@/lib/projects/types";

const columns = [-1.5, -0.5, 0.5, 1.5];
const rows = [-0.5, 0.5];


type Phase = "start" | "phase1" | "end" | "phase3" | "phase4" | "home";
type Bezier = [number, number, number, number];

const defaultControls = {
  phase1Ms: 1900,
  phase2Ms: 1300,
  phase1Width: 100,
  phase1Height: 100,
  finalSize: 45,
  phase1Ease: [0.12, 0, 0.39, 0] as Bezier,
  phase2Ease: [0.19, 1, 0.22, 1] as Bezier,
};

const veilMs = 800;
const textMs = 800;
const homeEase: Bezier = [0.9, 0, 0.5, 1];
const homeBaseImage = "/preload1.webp";
// First reveals are fixed; the LAST reveal is slide 1's background so the
// grid morph hands off seamlessly into the home carousel.
const fixedRevealImages = ["/preload2.png", "/preload3.png"];

function easingValue([x1, y1, x2, y2]: Bezier) {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

export default function PreloadGrid({
  slides,
  works,
  curatedItems,
}: {
  slides: ResolvedHomeSlide[];
  works: WorkItem[];
  curatedItems?: CuratedSpaceItem[];
}) {
  const [phase, setPhase] = useState<Phase>("start");
  const [revealIndex, setRevealIndex] = useState(-1);
  const [gridLinesHidden, setGridLinesHidden] = useState(false);
  const [homeReady, setHomeReady] = useState(false);
  const [sliderRemoved, setSliderRemoved] = useState(false);
  const { phase1Ms, phase2Ms, phase1Width, phase1Height, finalSize, phase1Ease, phase2Ease } =
    defaultControls;

  useEffect(() => {
    let phase1Timer: ReturnType<typeof setTimeout>;
    let phase2Timer: ReturnType<typeof setTimeout>;
    let phase3Timer: ReturnType<typeof setTimeout>;
    let homeTimer: ReturnType<typeof setTimeout>;
    let gridLinesTimer: ReturnType<typeof setTimeout>;
    let homeReadyTimer: ReturnType<typeof setTimeout>;
    let sliderRemovedTimer: ReturnType<typeof setTimeout>;
    let frame1 = 0;
    let frame2 = 0;

    const slideDuration = 600;
    const slideGap = 300;
    const phase4Start = phase1Ms + phase2Ms + 500;

    setPhase("start");
    setRevealIndex(-1);
    setGridLinesHidden(false);
    setHomeReady(false);
    setSliderRemoved(false);

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
        const homeStart = phase4Start + (slideDuration + slideGap) * 2 + slideDuration + 1000;
        homeTimer = setTimeout(() => setPhase("home"), homeStart);
        gridLinesTimer = setTimeout(() => setGridLinesHidden(true), homeStart + 800);
        homeReadyTimer = setTimeout(() => setHomeReady(true), homeStart + 1100);
        sliderRemovedTimer = setTimeout(() => setSliderRemoved(true), homeStart + 1250);
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(homeTimer);
      clearTimeout(gridLinesTimer);
      clearTimeout(homeReadyTimer);
      clearTimeout(sliderRemovedTimer);
    };
  }, [phase1Ms, phase2Ms, phase1Width, phase1Height, finalSize, phase1Ease, phase2Ease]);

  const gridStyle = useMemo(() => {
    const isPhase1 = phase === "phase1";
    const isEnd = phase === "end" || phase === "phase3" || phase === "phase4";
    const isPhase3 = phase === "phase3" || phase === "phase4" || phase === "home";
    const isHome = phase === "home";
    const transitionMs = isHome ? 1000 : phase === "start" ? 0 : isPhase1 ? phase1Ms : phase2Ms;
    const easing = easingValue(isHome ? homeEase : isPhase1 ? phase1Ease : phase2Ease);

    return {
      "--grid-cell-x": isHome
        ? "50dvw"
        : isEnd
          ? `${finalSize}dvh`
          : isPhase1
            ? `${phase1Width}dvw`
            : "105dvw",
      "--grid-cell-y": isHome
        ? "100dvh"
        : isEnd
          ? `${finalSize}dvh`
          : isPhase1
            ? `${phase1Height}dvh`
            : "105dvh",
      "--image-w": isHome
        ? "100dvw"
        : isEnd
          ? `${finalSize}dvh`
          : isPhase1
            ? `${phase1Width}dvw`
            : "105dvw",
      "--image-h": isHome
        ? "100dvh"
        : isEnd
          ? `${finalSize}dvh`
          : isPhase1
            ? `${phase1Height}dvh`
            : "105dvh",
      "--grid-shift-x": isHome ? "-25dvw" : "0px",
      "--grid-frame-inset": isHome ? "0px" : "1px",
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
      "--preload-z": "20",
    } as CSSProperties;
  }, [
    phase,
    gridLinesHidden,
    phase1Ms,
    phase2Ms,
    phase1Width,
    phase1Height,
    finalSize,
    phase1Ease,
    phase2Ease,
  ]);

  const baseImage = homeBaseImage;
  const slideImages = [...fixedRevealImages, slides[0].background];

  return (
    <>
      {!sliderRemoved && <div className={styles.gridBackground} style={gridStyle}>
        <div className={styles.imageLayer}>
          <div className={styles.gridImageTint} />
          <Image
            className={styles.gridImage}
            src={baseImage}
            alt=""
            fill
            priority
            sizes="100vw"
          />
          {slideImages.map((src, i) => (
            <Image
              key={`${i}-${src}`}
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
      </div>}

      {phase === "home" && (
        <HomeSection
          slides={slides}
          works={works}
          curatedItems={curatedItems}
          carouselReady={homeReady}
          preloading={!sliderRemoved}
        />
      )}
    </>
  );
}
