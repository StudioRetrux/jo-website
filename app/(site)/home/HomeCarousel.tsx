"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./HomeCarousel.module.css";

// Quiet time that separates one wheel gesture from the next (ms).
const GESTURE_GAP_MS = 200;

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
    // ponytail: one gesture = one slide. Trackpad momentum fires a long tail of
    // wheel events; only the first event after a quiet gap counts as a new gesture.
    let lastAt = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      const gap = e.timeStamp - lastAt;
      lastAt = e.timeStamp;
      if (gap < GESTURE_GAP_MS) return;
      onAdvance(e.deltaY > 0 ? "down" : "up");
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
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
