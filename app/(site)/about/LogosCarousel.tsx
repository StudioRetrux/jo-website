"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import styles from "./about.module.css";

/**
 * The client logos as a continuously scrolling strip. Desktop lays the same five out
 * in a row with space-between; on a phone there's no room for that, so they loop.
 */
export default function LogosCarousel({ logos }: { logos: string[] }) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, containScroll: false },
    // stopOnInteraction false = resume after a swipe, not just after touch end
    [AutoScroll({ speed: 1, stopOnInteraction: false })],
  );

  return (
    <div className={styles.logosCarousel} ref={emblaRef}>
      <div className={styles.logosCarouselTrack}>
        {logos.map((logo) => (
          <div className={styles.logosCarouselSlide} key={logo}>
            <img src={`/${logo}`} alt="" className={styles.logoItem} />
          </div>
        ))}
      </div>
    </div>
  );
}
