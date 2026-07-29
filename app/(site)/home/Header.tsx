"use client";

import type { CSSProperties } from "react";
import styles from "./home.module.css";
import { usePageNav, type Page } from "../contexts/PageNavContext";

type Props = {
  isHome: boolean;
  onMenuToggle: () => void;
  style?: CSSProperties;
  navLabel?: string;
  homeNavigation?: "state" | "route";
  /** Fired before navigating — lets an overlay dismiss itself first. */
  onNavigate?: () => void;
};

const EASE = "1000ms cubic-bezier(0.9, 0, 0.5, 1)";

const NAV_TARGETS: Record<string, { page: Page; path: string }> = {
  home: { page: "home", path: "/" },
  work: { page: "work", path: "/works" },
  works: { page: "work", path: "/works" },
  about: { page: "about", path: "/about" },
  "curated spaces": { page: "curratedspaces", path: "/curratedspaces" },
  contact: { page: "contact", path: "/contact" },
};

export default function Header({ isHome, onMenuToggle, style, navLabel, homeNavigation = "state", onNavigate }: Props) {
  const { navigateTo } = usePageNav();

  function go(target: { page: Page; path: string }) {
    onNavigate?.();
    if (homeNavigation === "route") {
      window.location.assign(target.path);
      return;
    }
    navigateTo(target.page);
  }

  function goHome() {
    go(NAV_TARGETS.home);
  }

  function renderNavLabel(label: string) {
    const parts = label.split(" / ");
    return parts.map((part, i) => {
      const target = NAV_TARGETS[part.toLowerCase()];
      // last crumb = the page you're on
      const current = i === parts.length - 1 ? styles.headerNavCurrent : "";
      return (
        <span key={i}>
          {i > 0 && <span> / </span>}
          {target ? (
            <span className={`${styles.headerNavLink} ${current}`} onClick={() => go(target)}>
              {part}
            </span>
          ) : (
            <span className={current}>{part}</span>
          )}
        </span>
      );
    });
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
