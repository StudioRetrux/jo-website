import type { CSSProperties } from "react";
import styles from "./megamenu.module.css";

type Props = {
  text: string;
  style?: CSSProperties;
  textStyle?: CSSProperties;
  hoverTextStyle?: CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  active?: boolean;
};

export default function MegaMenuText({
  text,
  style,
  textStyle,
  hoverTextStyle,
  onMouseEnter,
  onMouseLeave,
  onClick,
  active,
}: Props) {
  return (
    <span
      className={styles.megaMenuTextClip}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <span className={`${styles.megaMenuTextTrack}${active ? ` ${styles.megaMenuTextTrackActive}` : ""}`}>
        <span className={styles.megaMenuNavItem} style={textStyle}>
          {text}
        </span>
        <span
          className={`${styles.megaMenuNavItem} ${styles.megaMenuNavItemUnderline}`}
          style={hoverTextStyle}
        >
          {text}
        </span>
      </span>
    </span>
  );
}
