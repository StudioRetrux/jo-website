"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./HomeCarousel.module.css";
import { SIZES } from "../assets";

// A wheel event after this much silence starts a new gesture.
const GESTURE_GAP_MS = 150;
// Wheel crumbs under this never open a slide — a trackpad's momentum tail decays to
// single-digit deltas, and treating those as intent is what carried one flick into two.
const WHEEL_MIN_DELTA = 8;
// Finger travel that makes a touch drag a swipe.
const SWIPE_PX = 40;

type Props = {
  slides: string[];
  current: number;
  incoming: number | null;
  revealing: boolean;
  revealTransition: string;
  direction: "down" | "up";
  onAdvance: (dir: "down" | "up") => void;
  paused?: boolean;
};

export default function HomeCarousel({ slides, current, incoming, revealing, revealTransition, direction, onAdvance, paused = false }: Props) {
  // Stacked layout: the image is the top half and the page reads vertically, so a
  // vertical drag is ambiguous. Swipe sideways instead, and reveal on that axis too.
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 480px)");
    const sync = () => setHorizontal(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // latest onAdvance without re-subscribing: a re-subscribe mid-flick used to reset the
  // gesture state, so the rest of that flick's momentum read as a fresh gesture
  const advanceRef = useRef(onAdvance);
  useEffect(() => { advanceRef.current = onAdvance; });

  useEffect(() => {
    if (paused) return;
    // No native scrolling on home — every input is swallowed and turned into at most one
    // advance per gesture. HomeSection's lock then holds until the slide lands.
    const advance = (dir: "down" | "up") => advanceRef.current(dir);

    // Wheel covers mouse wheels and trackpads. A trackpad flick is one unbroken stream
    // of events — ramp-up, then a jittery momentum tail lasting seconds — so a gesture is
    // "events with no gap over GESTURE_GAP_MS", and each gesture fires at most once.
    // Don't try to spot a new flick inside a running stream by delta size: momentum
    // jitter passes any such test and one flick moves two slides.
    let lastWheelAt = -Infinity;
    let armed = true;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.timeStamp - lastWheelAt > GESTURE_GAP_MS) armed = true;
      lastWheelAt = e.timeStamp;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!armed || Math.abs(delta) < WHEEL_MIN_DELTA) return;
      // spent even if the carousel is still locked — a flick mid-animation doesn't queue
      armed = false;
      advance(delta > 0 ? "down" : "up");
    };

    // one advance per finger-down, whichever axis the layout runs on
    const axis = (touch: Touch) => (horizontal ? touch.clientX : touch.clientY);
    let start: number | null = null;
    // a second finger landing mid-drag must not restart the swipe
    const onTouchStart = (e: TouchEvent) => { if (e.touches.length === 1) start = axis(e.touches[0]); };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (start === null) return;
      const delta = start - axis(e.touches[0]);
      if (Math.abs(delta) < SWIPE_PX) return;
      start = null;
      advance(delta > 0 ? "down" : "up");
    };

    const KEYS: Record<string, "down" | "up"> = {
      ArrowDown: "down", ArrowRight: "down", PageDown: "down", " ": "down",
      ArrowUp: "up", ArrowLeft: "up", PageUp: "up",
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const dir = KEYS[e.key];
      if (!dir || e.metaKey || e.ctrlKey || e.altKey) return;
      // space on a focused link/button is a click, not a slide
      if (e.key === " " && (e.target as HTMLElement).closest("a, button, input, textarea")) return;
      e.preventDefault();
      if (!e.repeat) advance(e.shiftKey && e.key === " " ? "up" : dir);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [paused, horizontal]);

  return (
    <div className={styles.container}>
      <Image
        src={slides[current]}
        alt=""
        fill
        sizes={SIZES.full}
        style={{ objectFit: "cover", objectPosition: "44% 50%" }}
      />

      {incoming !== null && (
        <Image
          key={slides[incoming]}
          src={slides[incoming]}
          alt=""
          fill
          sizes={SIZES.full}
          style={{
            objectFit: "cover",
            objectPosition: "44% 50%",
            clipPath: revealing
              ? "inset(0)"
              : horizontal
                ? (direction === "down" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)")
                : (direction === "down" ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)"),
            scale: revealing ? "1" : "1.08",
            transition: revealing ? revealTransition : "none",
          }}
        />
      )}
    </div>
  );
}
