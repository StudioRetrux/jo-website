import type { CSSProperties } from "react";
import styles from "./work.module.css";

type Props = {
  text: string;
  style?: CSSProperties;
};

export default function FooterMenuText({ text, style }: Props) {
  return (
    <span className={styles.footerMenuTextClip} style={style}>
      <span className={styles.footerMenuTextTrack}>
        <span className={styles.footerMenuTextItem}>{text}</span>
        <span className={`${styles.footerMenuTextItem} ${styles.footerMenuTextItemHover}`}>
          {text}
        </span>
      </span>
    </span>
  );
}
