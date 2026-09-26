import styles from "./about.module.css";

type Props = { text: string; href: string; onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void };

export default function AboutCategoryItem({ text, href, onClick }: Props) {
  return (
    <a href={href} onClick={onClick} className={styles.aboutCatItem}>
      <span className={styles.aboutCatItemBg} />
      <span className={styles.aboutCatTextClip}>
        <span className={styles.aboutCatTextTrack}>
          <span className={styles.aboutCatText}>{text}</span>
          <span className={`${styles.aboutCatText} ${styles.aboutCatTextHover}`}>{text}</span>
        </span>
      </span>
    </a>
  );
}
