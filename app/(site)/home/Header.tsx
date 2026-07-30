"use client";

import { useEffect, useState, type CSSProperties } from "react";
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
const SCROLL_EASE = "transform 350ms cubic-bezier(0.4, 0, 0.2, 1)";
/** ignore jitter below this, and never hide while still near the top */
const SCROLL_DELTA = 8;
const SCROLL_REVEAL_TOP = 80;

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
  const [scrollHidden, setScrollHidden] = useState(false);
  // stays false until the first mobile scroll, so the page-entry transform and the
  // `transition: none` some callers pass keep priority until they've done their job
  const [scrollDriven, setScrollDriven] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    let last = 0;

    // capture phase: each page is its own `overflow-y: auto` box, and scroll doesn't
    // bubble — this catches whichever one the finger is actually on
    function onScroll(event: Event) {
      if (!mq.matches) { setScrollDriven(false); return; }
      const target = event.target;
      const top = target instanceof HTMLElement ? target.scrollTop : window.scrollY;
      const delta = top - last;
      if (Math.abs(delta) < SCROLL_DELTA) return;
      last = top;
      setScrollDriven(true);
      setScrollHidden(delta > 0 && top > SCROLL_REVEAL_TOP);
    }

    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, []);

  // a page sliding back in starts at the top with its header showing
  useEffect(() => {
    if (isHome) setScrollHidden(false);
  }, [isHome]);

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
        // last so it beats a caller's `transition: none`; only once scrolling owns it
        ...(isHome && scrollDriven
          ? {
              transform: scrollHidden ? "translateY(-100%)" : "translateY(0)",
              transition: SCROLL_EASE,
            }
          : null),
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
