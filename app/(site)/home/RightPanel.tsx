"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import styles from "./home.module.css";
import ProjectLink from "../projects/ProjectLink";
import { SIZES } from "../assets";
import type { ResolvedHomeSlide } from "@/lib/projects/home-shared";

export type CarouselPhase = "idle" | "exiting" | "entering";

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
  slides: ResolvedHomeSlide[];
  isHome: boolean;
  carouselCurrent: number;
  carouselIncoming: number | null;
  carouselPhase: CarouselPhase;
  carouselDirection: "down" | "up";
  carouselRevealing: boolean;
  revealTransition: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function RightPanel({
  slides,
  isHome,
  carouselCurrent,
  carouselIncoming,
  carouselPhase,
  carouselDirection,
  carouselRevealing,
  revealTransition,
}: Props) {
  const activeIndex = carouselIncoming ?? carouselCurrent;
  // Bar is 50% wide (css); remaining 50% of travel split across the slides.
  const barStep = slides.length > 1 ? 50 / (slides.length - 1) : 0;

  return (
    <div
      className={styles.rightPanel}
      // transform lives in CSS so the axis can change with the layout: it slides in
      // from the right beside the image, from below once the two stack
      data-open={isHome || undefined}
      style={{ pointerEvents: isHome ? "auto" : "none" }}
    >
      <div className={styles.rightIndicator}>
        <span className={styles.rightIndicatorText}>{pad(activeIndex + 1)}</span>
        <div className={styles.rightIndicatorTrack}>
          <div className={styles.rightIndicatorRail} />
          <div
            className={styles.rightIndicatorBar}
            style={{ left: `${activeIndex * barStep}%` }}
          />
        </div>
        <span className={styles.rightIndicatorText}>{pad(slides.length)}</span>
      </div>

      <span className={styles.rightScroll}>
        <span className={styles.hintScroll}>SCROLL</span>
        <span className={styles.hintSwipe}>SWIPE</span>
      </span>
      <div className={styles.rightContent}>
        <TextSlide
          current={slides[carouselCurrent].tag}
          incoming={carouselIncoming !== null ? slides[carouselIncoming].tag : null}
          phase={carouselPhase} {...T_TAG}
          direction={carouselDirection}
          className={styles.rightTag}
        />

        <TextSlide
          current={slides[carouselCurrent].heading}
          incoming={carouselIncoming !== null ? slides[carouselIncoming].heading : null}
          phase={carouselPhase} {...T_HEADING}
          direction={carouselDirection}
          className={styles.rightHeading}
        />

        <div className={styles.rightThumbnail}>
          <Image
            src={slides[carouselCurrent].thumbnail}
            alt=""
            fill
            sizes={SIZES.homeThumbnail}
            style={{ objectFit: "cover" }}
          />
          {carouselIncoming !== null && (
            <Image
              key={slides[carouselIncoming].thumbnail}
              src={slides[carouselIncoming].thumbnail}
              alt=""
              fill
              sizes={SIZES.homeThumbnail}
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
            current={slides[carouselCurrent].descLines[0] ?? ""}
            incoming={carouselIncoming !== null ? slides[carouselIncoming].descLines[0] ?? "" : null}
            phase={carouselPhase} {...T_DESC1}
            direction={carouselDirection}
            className={styles.rightDescription}
          />
          <TextSlide
            current={slides[carouselCurrent].descLines[1] ?? ""}
            incoming={carouselIncoming !== null ? slides[carouselIncoming].descLines[1] ?? "" : null}
            phase={carouselPhase} {...T_DESC2}
            direction={carouselDirection}
            className={styles.rightDescription}
          />
        </div>

        {/* the slide's own work — ProjectLink opens the detail overlay, no reload */}
        {slides[activeIndex].slug ? (
          <ProjectLink slug={slides[activeIndex].slug} className={styles.rightCta}>
            VIEW WORK
          </ProjectLink>
        ) : (
          <button type="button" className={styles.rightCta}>VIEW WORK</button>
        )}
      </div>
    </div>
  );
}
