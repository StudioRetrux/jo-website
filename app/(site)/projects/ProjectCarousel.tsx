"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useCursor } from "../contexts/CursorContext";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: stand-ins from public/ until the CMS carries a gallery.
const SLIDES = [
  "/homeresortbatu1.jpg",
  "/homeresortbatu2.png",
  "/Resort Room 1.jpg",
  "/Resort Room 2.jpg",
  "/Savart Denpasar 1.jpg",
];

export default function ProjectCarousel() {
  const { setMode } = useCursor();
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center", dragFree: true },
    [
      WheelGesturesPlugin(),
      // stopOnInteraction false = resume after a drag, not just after mouse leave
      AutoScroll({ speed: 1, stopOnInteraction: false }),
    ],
  );

  return (
    <section
      className={styles.carousel}
      ref={emblaRef}
      onMouseEnter={() => setMode("arrow")}
      onMouseLeave={() => setMode("default")}
    >
      <div className={styles.carouselTrack}>
        {SLIDES.map((src, i) => (
          <div className={styles.carouselSlide} key={`${src}-${i}`}>
            <Image
              src={src}
              alt=""
              fill
              sizes="80vw"
              draggable={false}
              className={styles.carouselImage}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
