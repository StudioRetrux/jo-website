"use client";

import { useState } from "react";
import Header from "../home/Header";
import MegaMenu from "../megamenu/MegaMenu";
import { usePageNav, SLIDE_DURATION, type Page } from "../contexts/PageNavContext";

const PAGE_BY_ITEM: Record<string, Page> = {
  Home: "home",
  Work: "work",
  About: "about",
  "Curated Spaces": "curratedspaces",
  Contact: "contact",
};

const PATH_BY_ITEM: Record<string, string> = {
  Home: "/",
  Work: "/works",
  About: "/about",
  "Curated Spaces": "/curratedspaces",
  Contact: "/contact",
};

/**
 * Same navbar the site sections use. In the overlay the shell is still mounted
 * underneath, so nav is state-driven and onLeave slides the detail away; on a direct
 * route hit there is no shell, so it falls back to a real navigation.
 */
export default function ProjectNav({
  title,
  homeNavigation = "route",
  onLeave,
}: {
  title: string;
  homeNavigation?: "state" | "route";
  onLeave?: () => void;
}) {
  const { navigateTo } = usePageNav();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavigate(item: string) {
    if (homeNavigation === "route") {
      const path = PATH_BY_ITEM[item];
      if (path) window.location.assign(path);
      else setMenuOpen(false);
      return;
    }
    const page = PAGE_BY_ITEM[item];
    if (page) {
      onLeave?.();
      navigateTo(page);
      setTimeout(() => setMenuOpen(false), SLIDE_DURATION);
    } else {
      setMenuOpen(false);
    }
  }

  return (
    <>
      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleNavigate} />
      <Header
        isHome
        onMenuToggle={() => setMenuOpen((v) => !v)}
        style={{ transition: "none" }}
        navLabel={`Home / Work / ${title}`}
        homeNavigation={homeNavigation}
        onNavigate={onLeave}
      />
    </>
  );
}
