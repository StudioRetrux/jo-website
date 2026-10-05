import ParallaxImage from "./ParallaxImage";
import SplitReveal from "../SplitReveal";
import { SIZES } from "../assets";
import styles from "./[slug]/projectDetail.module.css";

// Kononenko's offset for text that doesn't wait on scroll: half the page transition, so
// it rises while the overlay is still sliding up — their 0.555s is half of THEIR 1.109s
// transition, and read as lag against our 700ms slide. Then eyebrow → title → subtitle
// this far apart; their 0.1s line stagger read as three separate entrances here.
// Inlined, not imported: PageNavContext is "use client", and this also renders as a server
// component on /works/[slug], where an imported constant arrives as a client reference.
const START = 0.45; // tuned by eye; half of SLIDE_DURATION (700ms) would be 0.35
const GAP = 0.05;

// ponytail: image is the listing thumbnail — the same asset the card shows, so nothing
// new to load and no second field to keep in sync until real hero art exists.
export default function ProjectHero({
  image,
  alt,
  category,
  year,
  title,
  subtitle,
}: {
  image: string;
  alt: string;
  category: string;
  year: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className={styles.hero}>
      <ParallaxImage src={image} alt={alt} priority sizes={SIZES.full} className={styles.heroImage} />
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        {/* keyed: the overlay swaps projects without re-mounting, and a split can't
            take new text */}
        <SplitReveal key={`${category}-${year}`} as="p" className={styles.heroEyebrow} play delay={START}>
          {category}
          <span aria-hidden="true">{" • "}</span>
          {year}
        </SplitReveal>
        <SplitReveal key={title} as="h1" className={styles.heroTitle} play delay={START + GAP}>
          {title}
        </SplitReveal>
        <SplitReveal key={subtitle} as="p" className={styles.heroSubtitle} play delay={START + GAP * 2}>
          {subtitle}
        </SplitReveal>
      </div>
    </section>
  );
}
