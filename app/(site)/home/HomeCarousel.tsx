"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./HomeCarousel.module.css";

type Props = {
  slides: string[];
  current: number;
  incoming: number | null;
  revealing: boolean;
  revealTransition: string;
  direction: "down" | "up";
  onAdvance: (dir: "down" | "up") => void;
};

export default function HomeCarousel({ slides, current, incoming, revealing, revealTransition, direction, onAdvance }: Props) {
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) onAdvance("down");
      else if (e.deltaY < 0) onAdvance("up");
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onAdvance]);

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
