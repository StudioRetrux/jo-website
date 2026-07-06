import PreloadGrid from "./preload/PreloadGrid";
import { getWorkItems } from "@/lib/projects/data";
import { getResolvedHomeSlides } from "@/lib/projects/home";
import { FALLBACK_HOME_SLIDES } from "@/lib/projects/home-shared";
import styles from "./page.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  const [resolved, works] = await Promise.all([
    getResolvedHomeSlides(),
    getWorkItems(),
  ]);
  const slides = resolved.length > 0 ? resolved : FALLBACK_HOME_SLIDES;

  return (
    <main className={styles.page} aria-label="Home">
      <PreloadGrid slides={slides} works={works} />
    </main>
  );
}
