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
};

export default function MegaMenuText({
  text,
  style,
  textStyle,
  hoverTextStyle,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: Props) {
  return (
    <span
      className={`${styles.megaMenuTextClip} roll-trigger`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <span className={`${styles.megaMenuTextTrack} roll`}>
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
