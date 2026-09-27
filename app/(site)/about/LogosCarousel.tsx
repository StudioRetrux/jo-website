"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import styles from "./about.module.css";

/** The client logos as a continuously scrolling strip. */
export default function LogosCarousel({ logos }: { logos: string[] }) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, containScroll: false },
    // stopOnInteraction false = resume after a swipe, not just after touch end
    [AutoScroll({ speed: 1, stopOnInteraction: false })],
  );

  return (
    <div className={styles.logosCarousel} ref={emblaRef}>
      <div className={styles.logosCarouselTrack}>
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div className={styles.logosCarouselSlide} key={`${logo}-${index}`}>
            <img src={`/${logo}`} alt="" className={styles.logoItem} />
          </div>
        ))}
      </div>
    </div>
  );
}
