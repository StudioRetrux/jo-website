"use client";

import type { CSSProperties, ReactNode } from "react";
import { useProjectOverlay, detailPath, type DetailKind } from "./ProjectOverlay";

// Real anchor — middle-click, ctrl-click and crawlers get the actual route; a plain
// left-click opens the overlay instead so the page behind stays put. Going through the
// overlay is also what keeps the site an SPA: a document load costs every transition,
// because the section routes each mount only themselves.
export default function ProjectLink({
  slug,
  kind = "project",
  className,
  style,
  children,
}: {
  slug: string;
  kind?: DetailKind;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { openDetail } = useProjectOverlay();

  return (
    <a
      href={detailPath(kind, slug)}
      className={className}
      style={style}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        openDetail(kind, slug);
      }}
    >
      {children}
    </a>
  );
}
