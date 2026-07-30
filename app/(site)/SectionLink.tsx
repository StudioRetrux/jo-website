"use client";

import type { ReactNode } from "react";
import { usePageNav, type Page } from "./contexts/PageNavContext";

const PAGE_BY_PATH: Record<string, Page> = {
  "/": "home",
  "/works": "work",
  "/about": "about",
  "/curratedspaces": "curratedspaces",
  "/contact": "contact",
};

/**
 * A link to one of the five sections that navigates in-document when the shell is
 * mounted (mode "state") and falls back to a real navigation when it isn't (mode
 * "route" — a direct hit on a detail page has no sections behind it to slide to).
 */
export default function SectionLink({
  href,
  mode = "state",
  onLeave,
  className,
  children,
}: {
  href: string;
  mode?: "state" | "route";
  /** dismiss whatever is on top (the detail overlay) before the section slides in */
  onLeave?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const { navigateTo } = usePageNav();
  const page = PAGE_BY_PATH[href];

  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (mode !== "state" || !page) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        onLeave?.();
        navigateTo(page);
      }}
    >
      {children}
    </a>
  );
}
