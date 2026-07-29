"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./preload.module.css";
import HomeSection from "../home/HomeSection";
import { useLoadBar } from "../LoadBar";
import { INTRO_BASE_IMAGE, INTRO_REVEAL_IMAGES, SIZES, homeAssets } from "../assets";
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

/** Figma mobile: 242px cell in a 360px frame. */
const MOBILE_CELL_DVW = ((242 / 360) * 100).toFixed(2);

const veilMs = 800;
const textMs = 800;
const homeEase: Bezier = [0.9, 0, 0.5, 1];
const homeBaseImage = INTRO_BASE_IMAGE;
// First reveals are fixed; the LAST reveal is slide 1's background so the
// grid morph hands off seamlessly into the home carousel.
const fixedRevealImages = INTRO_REVEAL_IMAGES;

function easingValue([x1, y1, x2, y2]: Bezier) {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

// The intro belongs to a fresh arrival at "/". Section nav pushes /works, /about… onto
// this same document, so a back from a project detail re-mounts us — without this it
// would replay the whole orchestration and then snap to the section.
function isIntroVisit() {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return window.location.pathname === "/" && nav?.type !== "back_forward";
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
  const { preload } = useLoadBar();
  const { phase1Ms, phase2Ms, phase1Width, phase1Height, finalSize, phase1Ease, phase2Ease } =
    defaultControls;

  useEffect(() => {
    if (!isIntroVisit()) {
      setPhase("home");
      setGridLinesHidden(true);
      setHomeReady(true);
      setSliderRemoved(true);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const frames: number[] = [];
    const after = (ms: number, fn: () => void) => { timers.push(setTimeout(fn, ms)); };

    const slideDuration = 600;
    const slideGap = 300;
    const phase4Start = phase1Ms + phase2Ms + 500;

    setPhase("start");
    setRevealIndex(-1);
    setGridLinesHidden(false);
    setHomeReady(false);
    setSliderRemoved(false);

    function runIntro() {
      frames.push(requestAnimationFrame(() => {
        frames.push(requestAnimationFrame(() => {
          setPhase("phase1");
          after(phase1Ms, () => setPhase("end"));
          after(phase1Ms + phase2Ms, () => setPhase("phase3"));
          after(phase4Start, () => {
            setPhase("phase4");
            setRevealIndex(0);
            after(slideDuration + slideGap, () => setRevealIndex(1));
            after((slideDuration + slideGap) * 2, () => setRevealIndex(2));
          });
          const homeStart = phase4Start + (slideDuration + slideGap) * 2 + slideDuration + 1000;
          after(homeStart, () => setPhase("home"));
          after(homeStart + 800, () => setGridLinesHidden(true));
          after(homeStart + 1100, () => setHomeReady(true));
          after(homeStart + 1250, () => setSliderRemoved(true));
        }));
      }));
    }

    // The intro reveals these three by hand at fixed times, so it can't start until
    // they're decoded — otherwise it animates empty frames and pops them in late.
    // Home's own assets load in the background once the intro is under way.
    (async () => {
      const reveals = [...fixedRevealImages, slides[0].background];
      await preload(reveals.map((src) => ({ src, sizes: SIZES.full })));
      if (cancelled) return;
      runIntro();
      preload(homeAssets(slides));
    })();

    return () => {
      cancelled = true;
      frames.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
    };
  }, [preload, slides, phase1Ms, phase2Ms, phase1Width, phase1Height, finalSize, phase1Ease, phase2Ease]);

  const gridStyle = useMemo(() => {
    const isPhase1 = phase === "phase1";
    const isEnd = phase === "end" || phase === "phase3" || phase === "phase4";
    const isPhase3 = phase === "phase3" || phase === "phase4" || phase === "home";
    const isHome = phase === "home";
    const transitionMs = isHome ? 1000 : phase === "start" ? 0 : isPhase1 ? phase1Ms : phase2Ms;
    const easing = easingValue(isHome ? homeEase : isPhase1 ? phase1Ease : phase2Ease);
    // The settled cell is 45dvh on desktop, but that's taller than a phone is wide.
    // Figma's mobile frame puts it at 242 of 360, so cap by width and let whichever
    // is smaller win — no breakpoint needed.
    const endCell = `min(${finalSize}dvh, ${MOBILE_CELL_DVW}dvw)`;

    return {
      "--grid-cell-x": isHome
        ? "50dvw"
        : isEnd
          ? endCell
          : isPhase1
            ? `${phase1Width}dvw`
            : "105dvw",
      "--grid-cell-y": isHome
        ? "100dvh"
        : isEnd
          ? endCell
          : isPhase1
            ? `${phase1Height}dvh`
            : "105dvh",
      "--image-w": isHome
        ? "100dvw"
        : isEnd
          ? endCell
          : isPhase1
            ? `${phase1Width}dvw`
            : "105dvw",
      "--image-h": isHome
        ? "100dvh"
        : isEnd
          ? endCell
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
      {!sliderRemoved && <div
        className={styles.gridBackground}
        style={gridStyle}
        // marks the hand-off so CSS can retarget it per layout — see preload.module.css
        data-home={phase === "home" || undefined}
      >
        <div className={styles.imageLayer}>
          <div className={styles.gridImageTint} />
          <Image
            className={styles.gridImage}
            src={baseImage}
            alt=""
            fill
            priority
            sizes={SIZES.full}
          />
          {slideImages.map((src, i) => (
            <Image
              key={`${i}-${src}`}
              className={styles.gridImage2}
              src={src}
              alt=""
              fill
              sizes={SIZES.full}
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
