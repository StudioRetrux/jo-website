import HomeSection from "./home/HomeSection";
import { getWorkItems } from "@/lib/projects/data";
import { getCuratedSpaceItems } from "@/lib/projects/curated";
import { getResolvedHomeSlides } from "@/lib/projects/home";
import { FALLBACK_HOME_SLIDES } from "@/lib/projects/home-shared";
import styles from "./page.module.css";

/**
 * Every section route renders this, not just its own section.
 *
 * The sections slide against each other, which only works while they're all mounted in
 * one document. A route that rendered a single section had to navigate by document
 * load, and that costs every transition on the site for the rest of the visit.
 * PageNavProvider reads the URL, so the right section is already open on first paint.
 */
export default async function SiteShell() {
  const [resolved, works, curatedItems] = await Promise.all([
    getResolvedHomeSlides(),
    getWorkItems(),
    getCuratedSpaceItems(),
  ]);
  const slides = resolved.length > 0 ? resolved : FALLBACK_HOME_SLIDES;

  return (
    <main className={styles.page}>
      <HomeSection slides={slides} works={works} curatedItems={curatedItems} carouselReady />
    </main>
  );
}
