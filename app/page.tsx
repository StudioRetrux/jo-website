import PreloadGrid from "./preload/PreloadGrid";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page} aria-label="Home">
      <PreloadGrid />
    </main>
  );
}
