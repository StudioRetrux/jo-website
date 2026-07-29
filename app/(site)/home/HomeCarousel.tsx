"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./HomeCarousel.module.css";

// Input must go quiet this long before a new gesture counts.
const GESTURE_QUIET_MS = 400;
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
  useEffect(() => {
    if (paused) return;
    // ponytail: one gesture = one slide. A trackpad flick or touch drag fires a long
    // stream of events; every one of them re-arms the lock, so the gesture only ends
    // after the input actually goes quiet. Gap-since-last-event isn't enough — momentum
    // decays into gaps wide enough to look like a fresh flick.
    let locked = false;
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      locked = true;
      clearTimeout(timer);
      timer = setTimeout(() => { locked = false; }, GESTURE_QUIET_MS);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      const first = !locked;
      arm();
      if (first) onAdvance(e.deltaY > 0 ? "down" : "up");
    };

    let startY: number | null = null;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (locked) { arm(); return; }
      if (startY === null) return;
      const dy = startY - e.touches[0].clientY;
      if (Math.abs(dy) < SWIPE_PX) return;
      arm();
      onAdvance(dy > 0 ? "down" : "up");
    };
    const onTouchEnd = () => { startY = null; };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onAdvance, paused]);

  return (
    <div className={styles.container}>
      <Image
        src={slides[current]}
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "44% 50%" }}
      />

      {incoming !== null && (
        <Image
          key={slides[incoming]}
          src={slides[incoming]}
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "44% 50%",
            clipPath: revealing ? "inset(0% 0 0 0)" : (direction === "down" ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)"),
            scale: revealing ? "1" : "1.08",
            transition: revealing ? revealTransition : "none",
          }}
        />
      )}
    </div>
  );
}
