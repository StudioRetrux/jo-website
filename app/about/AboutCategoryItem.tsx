import styles from "./about.module.css";

type Props = { text: string };

export default function AboutCategoryItem({ text }: Props) {
  return (
    <div className={styles.aboutCatItem}>
      <span className={styles.aboutCatItemBg} />
      <span className={styles.aboutCatTextClip}>
        <span className={styles.aboutCatTextTrack}>
          <span className={styles.aboutCatText}>{text}</span>
          <span className={`${styles.aboutCatText} ${styles.aboutCatTextHover}`}>{text}</span>
        </span>
      </span>
    </div>
  );
}
