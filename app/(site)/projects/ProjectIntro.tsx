import styles from "./[slug]/projectDetail.module.css";

/**
 * Label + first-line-indented heading + centred subtitle. Used by the About and
 * Conclusion sections, which are the same block with different copy.
 */
export default function ProjectIntro({
  label,
  heading,
  body,
}: {
  label: string;
  heading: string;
  body: string;
}) {
  return (
    <div className={styles.aboutIntro}>
      <span className={styles.aboutLabel}>{label}</span>
      <div className={styles.aboutText}>
        <h2 className={styles.aboutHeading}>{heading}</h2>
        <p className={styles.aboutBody}>{body}</p>
      </div>
    </div>
  );
}
