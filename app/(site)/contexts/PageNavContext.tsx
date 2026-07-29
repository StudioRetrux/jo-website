"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSection } from "./SectionContext";

export type Page = "home" | "work" | "about" | "curratedspaces" | "contact";

export const SLIDE_DURATION = 700;
export const SLIDE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
/**
 * Stacking order for the page sliding in — above the megamenu (z-index 40) on purpose.
 * A nav leaves the menu sitting still and slides the target page up over it, so the
 * page slide is the only movement on screen.
 */
export const INCOMING_Z = 50;

const PAGE_PATHS: Record<Page, string> = {
  home: "/",
  work: "/works",
  about: "/about",
  curratedspaces: "/curratedspaces",
  contact: "/contact",
};

const PATH_PAGES: Record<string, Page> = {
  "/": "home",
  "/works": "work",
  "/about": "about",
  "/curratedspaces": "curratedspaces",
  "/contact": "contact",
};

type PageNavContextType = {
  activePage: Page;
  incomingPage: Page | null;
  navigateTo: (page: Page) => void;
};

const PageNavContext = createContext<PageNavContextType>({
  activePage: "home",
  incomingPage: null,
  navigateTo: () => {},
});

export function PageNavProvider({ children }: { children: React.ReactNode }) {
  const { navigate } = useSection();
  // usePathname resolves on the server too, so /works renders the work section in the
  // first paint instead of showing home and snapping once an effect runs
  const initialPage = PATH_PAGES[usePathname()] ?? "home";
  const [activePage, setActivePage] = useState<Page>(initialPage);
  const [incomingPage, setIncomingPage] = useState<Page | null>(null);
  const activePageRef = useRef<Page>(initialPage);
  const animatingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // On mount and on back/forward, the URL is the truth — section nav pushed those
  // entries onto this document, so a restored /works must open work, not home.
  useEffect(() => {
    const sync = () => {
      const page = PATH_PAGES[window.location.pathname] ?? "home";
      if (page === activePageRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      animatingRef.current = false;
      activePageRef.current = page;
      setActivePage(page);
      setIncomingPage(null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const navigateTo = useCallback(
    (page: Page) => {
      if (animatingRef.current || page === activePageRef.current) return;
      animatingRef.current = true;
      setIncomingPage(page);
      navigate(PAGE_PATHS[page]);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        activePageRef.current = page;
        setActivePage(page);
        setIncomingPage(null);
        animatingRef.current = false;
        timerRef.current = null;
      }, SLIDE_DURATION);
    },
    [navigate],
  );

  return (
    <PageNavContext.Provider value={{ activePage, incomingPage, navigateTo }}>
      {children}
    </PageNavContext.Provider>
  );
}

export const usePageNav = () => useContext(PageNavContext);
