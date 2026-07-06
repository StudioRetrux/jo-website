"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import styles from "./home.module.css";

export type CarouselPhase = "idle" | "exiting" | "entering";

export const carouselSlides = [
  {
    tag: "HOSPITALITY • 2025",
    heading: "AMAINAIA HOTEL KUTA",
    descLines: ["A calm, well-crafted space designed", "for comfort and ease."],
    image: "/preload4ld.png",
  },
  {
    tag: "RESIDENTIAL • 2024",
    heading: "SERENITY VILLA BALI",
    descLines: ["A bold vision of living", "in harmony with nature."],
    image: "/preload1.webp",
  },
  {
    tag: "COMMERCIAL • 2024",
    heading: "TERRAZA OFFICE JAKARTA",
    descLines: ["Where work meets warmth,", "built for the modern era."],
    image: "/preload4ld.png",
  },
  {
    tag: "HOSPITALITY • 2023",
    heading: "DUNE RESORT LOMBOK",
    descLines: ["Raw textures and open skies,", "a retreat carved from the land."],
    image: "/preload1.webp",
  },
  {
    tag: "RESIDENTIAL • 2023",
    heading: "HIGHGROVE HOUSE UBUD",
    descLines: ["Elevated living among the trees,", "designed for stillness."],
    image: "/preload4ld.png",
  },
];

const T_TAG     = { exitDelayMs:  0, exitMs: 350, exitEasing: "cubic-bezier(0.55, 0, 1, 0.45)",  enterMs: 350, enterEasing: "cubic-bezier(0.25, 1, 0.5, 1)", delayMs:  0 };
const T_HEADING = { exitDelayMs:  0, exitMs: 350, exitEasing: "cubic-bezier(0.76, 0, 0.9, 0.4)", enterMs: 350, enterEasing: "cubic-bezier(0.1, 0.8, 0.3, 1)", delayMs:  0 };
const T_DESC1   = { exitDelayMs:  0, exitMs: 310, exitEasing: "cubic-bezier(0.55, 0, 1, 0.45)",  enterMs: 310, enterEasing: "cubic-bezier(0.25, 1, 0.5, 1)", delayMs:  0 };
const T_DESC2   = { exitDelayMs: 80, exitMs: 310, exitEasing: "cubic-bezier(0.55, 0, 1, 0.45)",  enterMs: 310, enterEasing: "cubic-bezier(0.25, 1, 0.5, 1)", delayMs: 80 };

const ALL_TIMINGS = [T_TAG, T_HEADING, T_DESC1, T_DESC2];
export const MAX_EXIT_MS = Math.max(...ALL_TIMINGS.map((t) => t.exitDelayMs + t.exitMs));
export const UNLOCK_MS   = Math.max(...ALL_TIMINGS.map((t) => t.exitDelayMs + t.exitMs + t.delayMs + t.enterMs)) + 30;

function TextSlide({
  current,
  incoming,
  phase,
  exitDelayMs,
  exitMs,
  exitEasing,
  enterMs,
  enterEasing,
  delayMs,
  direction,
  className,
}: {
  current: ReactNode;
  incoming: ReactNode | null;
  phase: CarouselPhase;
  exitDelayMs: number;
  exitMs: number;
  exitEasing: string;
  enterMs: number;
  enterEasing: string;
  delayMs: number;
  direction: "down" | "up";
  className: string;
}) {
  const exitTo    = direction === "down" ? "translateY(-110%)" : "translateY(110%)";
  const enterFrom = direction === "down" ? "translateY(110%)"  : "translateY(-110%)";
  return (
    <div style={{ overflow: "hidden", position: "relative", width: "100%" }}>
      {incoming !== null && (
        <div
          className={className}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            transform: phase !== "idle" ? exitTo : "translateY(0)",
            transition: phase === "exiting" ? `transform ${exitMs}ms ${exitEasing} ${exitDelayMs}ms` : "none",
          } as CSSProperties}
        >
          {current}
        </div>
      )}
      <div
        className={className}
        style={{
          width: "100%",
          transform: incoming !== null
            ? (phase === "entering" ? "translateY(0)" : enterFrom)
            : "translateY(0)",
          transition: phase === "entering"
            ? `transform ${enterMs}ms ${enterEasing} ${delayMs}ms`
            : "none",
        } as CSSProperties}
      >
        {incoming !== null ? incoming : current}
      </div>
    </div>
  );
}

type Props = {
  isHome: boolean;
  carouselCurrent: number;
  carouselIncoming: number | null;
  carouselPhase: CarouselPhase;
  carouselDirection: "down" | "up";
  carouselRevealing: boolean;
  revealTransition: string;
};

export default function RightPanel({
  isHome,
  carouselCurrent,
  carouselIncoming,
  carouselPhase,
  carouselDirection,
  carouselRevealing,
  revealTransition,
}: Props) {
  const activeIndex = carouselIncoming ?? carouselCurrent;

  return (
    <div
      className={styles.rightPanel}
      style={{
        transform: isHome ? "translateX(0)" : "translateX(100%)",
        pointerEvents: isHome ? "auto" : "none",
      }}
    >
      <div className={styles.rightIndicator}>
        <span className={styles.rightIndicatorText}>0{activeIndex + 1}</span>
        <div className={styles.rightIndicatorTrack}>
          <div className={styles.rightIndicatorRail} />
          <div
            className={styles.rightIndicatorBar}
            style={{ left: `${activeIndex * 12.5}%` }}
          />
        </div>
        <span className={styles.rightIndicatorText}>05</span>
      </div>

      <span className={styles.rightScroll}>SCROLL</span>
      <div className={styles.rightContent}>
        <TextSlide
          current={carouselSlides[carouselCurrent].tag}
          incoming={carouselIncoming !== null ? carouselSlides[carouselIncoming].tag : null}
          phase={carouselPhase} {...T_TAG}
          direction={carouselDirection}
          className={styles.rightTag}
        />

        <TextSlide
          current={carouselSlides[carouselCurrent].heading}
          incoming={carouselIncoming !== null ? carouselSlides[carouselIncoming].heading : null}
          phase={carouselPhase} {...T_HEADING}
          direction={carouselDirection}
          className={styles.rightHeading}
        />

        <div className={styles.rightThumbnail}>
          <Image
            src={carouselSlides[carouselCurrent].image}
            alt=""
            fill
            sizes="16dvw"
            style={{ objectFit: "cover" }}
          />
          {carouselIncoming !== null && (
            <Image
              key={carouselSlides[carouselIncoming].image}
              src={carouselSlides[carouselIncoming].image}
              alt=""
              fill
              sizes="16dvw"
              style={{
                objectFit: "cover",
                clipPath: carouselRevealing
                  ? "inset(0% 0 0 0)"
                  : carouselDirection === "down" ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
                scale: carouselRevealing ? "1" : "1.08",
                transition: carouselRevealing ? revealTransition : "none",
              } as CSSProperties}
            />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%" }}>
          <TextSlide
            current={carouselSlides[carouselCurrent].descLines[0]}
            incoming={carouselIncoming !== null ? carouselSlides[carouselIncoming].descLines[0] : null}
            phase={carouselPhase} {...T_DESC1}
            direction={carouselDirection}
            className={styles.rightDescription}
          />
          <TextSlide
            current={carouselSlides[carouselCurrent].descLines[1]}
            incoming={carouselIncoming !== null ? carouselSlides[carouselIncoming].descLines[1] : null}
            phase={carouselPhase} {...T_DESC2}
            direction={carouselDirection}
            className={styles.rightDescription}
          />
        </div>

        <button type="button" className={styles.rightCta}>VIEW WORK</button>
      </div>
    </div>
  );
}
