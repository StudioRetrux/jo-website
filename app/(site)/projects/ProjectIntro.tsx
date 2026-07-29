import styles from "./[slug]/projectDetail.module.css";

/**
 * Label + first-line-indented heading + centred subtitle. Used by the About and
 * Conclusion sections, which are the same block with different copy.
 */
export default function ProjectIntro({
  label,
  heading,
  body,
  /** "stacked" centres the body under the heading; "beside" sits it to the right. */
  layout = "stacked",
}: {
  label: string;
  heading: string;
  body: string;
  layout?: "stacked" | "beside";
}) {
  return (
    <div className={`${styles.aboutIntro} ${layout === "beside" ? styles.aboutIntroBeside : ""}`}>
      <span className={styles.aboutLabel}>{label}</span>
      <div className={styles.aboutText}>
        <h2 className={styles.aboutHeading}>{heading}</h2>
        <p className={styles.aboutBody}>{body}</p>
      </div>
    </div>
  );
}
