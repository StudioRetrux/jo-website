import ProjectText from "./ProjectText";
import type { CSSProperties } from "react";
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
    <div
      className={`${styles.aboutIntro} ${layout === "beside" ? styles.aboutIntroBeside : ""}`}
      // the hole the heading indents for has to fit the label, and (CONCLUSION) is far
      // wider than (ABOUT) — hand the length over so CSS sizes the indent per section
      style={{ "--label-chars": label.length } as CSSProperties}
    >
      <ProjectText as="span" className={styles.aboutLabel}>{label}</ProjectText>
      <div className={styles.aboutText}>
        <ProjectText key={heading} as="h2" className={styles.aboutHeading}>{heading}</ProjectText>
        <ProjectText key={body} as="p" className={styles.aboutBody}>{body}</ProjectText>
      </div>
    </div>
  );
}
