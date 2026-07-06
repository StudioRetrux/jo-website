"use client";

import type { CSSProperties } from "react";
import styles from "./home.module.css";
import { useSection } from "../contexts/SectionContext";

type Props = {
  isHome: boolean;
  onMenuToggle: () => void;
  style?: CSSProperties;
  navLabel?: string;
  homeNavigation?: "state" | "route";
};

const EASE = "1000ms cubic-bezier(0.9, 0, 0.5, 1)";

export default function Header({ isHome, onMenuToggle, style, navLabel, homeNavigation = "state" }: Props) {
  const { navigate } = useSection();

  function goHome() {
    if (homeNavigation === "route") {
      window.location.assign("/");
      return;
    }

    navigate("/");
  }

  function renderNavLabel(label: string) {
    const parts = label.split(" / ");
    return parts.map((part, i) => (
      <span key={i}>
        {i > 0 && <span> / </span>}
        {part.toLowerCase() === "home" ? (
          <span
            className={styles.headerNavLink}
            onClick={goHome}
          >
            {part}
          </span>
        ) : (
          <span>{part}</span>
        )}
      </span>
    ));
  }

  return (
    <header
      className={styles.header}
      style={{
        transform: isHome ? "translateY(0)" : "translateY(-100%)",
        transition: `transform ${EASE}`,
        ...style,
      }}
    >
      <div className={styles.headerLeft}>
        <button type="button" className={styles.hamburger} aria-label="Menu" onClick={onMenuToggle}>
          <span />
          <span />
        </button>
        <span className={styles.headerLogo} onClick={goHome}>Yohanes Alexander</span>
      </div>
      {navLabel && (
        <div className={styles.headerRight} style={{ justifyContent: "flex-end" }}>
          <span className={styles.headerNav}>{renderNavLabel(navLabel)}</span>
        </div>
      )}
    </header>
  );
}
