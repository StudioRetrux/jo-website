"use client";

import type { CSSProperties } from "react";
import styles from "./work.module.css";

type Props = {
  text: string;
  style?: CSSProperties;
  /** in-app navigation for this label; without it the anchor just follows its href */
  onNavigate?: (item: string) => void;
};

const PATH_BY_ITEM: Record<string, string> = {
  Home: "/",
  Work: "/works",
  About: "/about",
  "Curated Spaces": "/curratedspaces",
  Contact: "/contact",
};

export default function FooterMenuText({ text, style, onNavigate }: Props) {
  const href = PATH_BY_ITEM[text];

  const label = (
    <span className={styles.footerMenuTextTrack}>
      <span className={styles.footerMenuTextItem}>{text}</span>
      <span className={`${styles.footerMenuTextItem} ${styles.footerMenuTextItemHover}`}>
        {text}
      </span>
    </span>
  );

  if (!href) {
    return <span className={styles.footerMenuTextClip} style={style}>{label}</span>;
  }

  // Real anchor so middle-click, ctrl-click and crawlers get the route; a plain
  // left-click hands over to the section nav, so the document never reloads.
  return (
    <a
      href={href}
      className={styles.footerMenuTextClip}
      style={style}
      onClick={(event) => {
        if (!onNavigate) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        onNavigate(text);
      }}
    >
      {label}
    </a>
  );
}
